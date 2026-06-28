import os
import zipfile
import mimetypes

# List of dangerous/executable extensions
EXECUTABLE_EXTENSIONS = {
    ".exe", ".dll", ".bat", ".cmd", ".sh", ".msi", ".scr",
    ".js", ".vbs", ".ps1", ".jar", ".sys", ".com", ".pif",
    ".wsf", ".hta", ".cpl", ".reg"
}

# Common social engineering keywords in filenames
SOCIAL_ENG_KEYWORDS = [
    "invoice", "receipt", "payment", "salary", "bonus", "urgent",
    "security", "update", "verify", "confidential", "refund", "gift",
    "prize", "claim", "bank", "account", "document", "doc_", "scan_"
]

# Popular document/image/audio/video extensions that are safe under normal circumstances
SAFE_EXTENSIONS = {
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".txt", ".csv",
    ".mp3", ".wav", ".mp4", ".avi", ".zip", ".rar", ".7z"
}


def format_file_size(size_bytes: int) -> str:
    """Format file size in human-readable format."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"


def analyze_file(filename: str, file_path: str, declared_content_type: str = None) -> dict:
    """
    Perform static analysis on an uploaded file for 8 parameters.
    Returns a dict with:
      - score: int (0 to 100)
      - reasons: list[str]
      - parameters: dict (detailed results for each check)
    """
    score = 0
    reasons = []
    parameters = {}

    # Read file content/metadata
    if not os.path.exists(file_path):
        return {
            "score": 100,
            "reasons": ["File not found on server"],
            "parameters": {"error": "File not found"}
        }

    file_size = os.path.getsize(file_path)
    file_extension = os.path.splitext(filename)[1].lower()

    # Read first 8KB of the file for magic byte and content scanning
    try:
        with open(file_path, "rb") as f:
            file_bytes = f.read(8192)
    except Exception as e:
        return {
            "score": 100,
            "reasons": [f"Could not read file: {str(e)}"],
            "parameters": {"error": f"Read error: {str(e)}"}
        }

    # 1. File Extension check
    is_exe_ext = file_extension in EXECUTABLE_EXTENSIONS
    parameters["file_extension"] = {
        "extension": file_extension,
        "is_executable": is_exe_ext,
        "status": "Suspicious (Executable)" if is_exe_ext else "Safe"
    }
    if is_exe_ext:
        score += 40
        reasons.append(f"Executable file extension: {file_extension}")

    # 2. Double Extension check
    # Split filename by dots, ignore leading dot
    cleaned_name = filename.lstrip(".")
    parts = cleaned_name.split(".")
    has_double_ext = False
    double_ext_detected = ""

    if len(parts) >= 3:
        # e.g., invoice.pdf.exe -> parts = ["invoice", "pdf", "exe"]
        # E.g., check if second-to-last part and last part are both extensions
        last_ext = "." + parts[-1].lower()
        second_last_ext = "." + parts[-2].lower()
        
        # If the last is an executable/script, or if second-last looks like a safe doc extension
        if (last_ext in EXECUTABLE_EXTENSIONS and second_last_ext in SAFE_EXTENSIONS) or \
           (last_ext in SAFE_EXTENSIONS and second_last_ext in SAFE_EXTENSIONS):
            has_double_ext = True
            double_ext_detected = f"{second_last_ext}{last_ext}"

    parameters["double_extension"] = {
        "has_double_extension": has_double_ext,
        "detected": double_ext_detected,
        "status": "Dangerous" if has_double_ext else "Safe"
    }
    if has_double_ext:
        score += 40
        reasons.append(f"Double file extension detected: {double_ext_detected}")

    # 3. Filename Keywords check
    found_keywords = []
    filename_lower = filename.lower()
    for kw in SOCIAL_ENG_KEYWORDS:
        if kw in filename_lower:
            found_keywords.append(kw)

    parameters["filename_keywords"] = {
        "found_keywords": found_keywords,
        "status": "Suspicious" if found_keywords else "Safe"
    }
    if found_keywords:
        score += 10
        reasons.append(f"Social engineering keyword(s) in filename: {', '.join(found_keywords)}")

    # 4. File Size check
    is_anomalous_size = file_size == 0
    parameters["file_size"] = {
        "size_bytes": file_size,
        "readable_size": format_file_size(file_size),
        "is_anomalous": is_anomalous_size,
        "status": "Dangerous (0-byte file)" if is_anomalous_size else "Safe"
    }
    if is_anomalous_size:
        score += 20
        reasons.append("Anomalous file size: 0 bytes")

    # 5. MIME Type (Fake File Types) check
    # Check signature magic bytes
    magic_bytes = file_bytes[:8]
    detected_format = "unknown"
    mismatch_detected = False

    if magic_bytes.startswith(b"MZ"):
        detected_format = "pe_executable"
    elif magic_bytes.startswith(b"%PDF"):
        detected_format = "pdf"
    elif magic_bytes.startswith(b"PK\x03\x04"):
        detected_format = "zip_or_office"
    elif magic_bytes.startswith(b"\x89PNG"):
        detected_format = "png"
    elif magic_bytes.startswith(b"\xff\xd8\xff"):
        detected_format = "jpeg"
    elif magic_bytes.startswith(b"GIF8"):
        detected_format = "gif"

    # Compare detected format with extension
    if detected_format == "pe_executable" and file_extension not in EXECUTABLE_EXTENSIONS:
        mismatch_detected = True
        reasons.append("Fake file type: file is an executable (PE signature) disguised with a non-executable extension")
        score += 50
    elif detected_format == "pdf" and file_extension != ".pdf":
        mismatch_detected = True
        reasons.append("File format mismatch: file contains PDF magic bytes but has non-PDF extension")
        score += 20
    elif detected_format == "png" and file_extension not in (".png",):
        mismatch_detected = True
        reasons.append("File format mismatch: PNG header with non-PNG extension")
        score += 15
    elif detected_format == "jpeg" and file_extension not in (".jpg", ".jpeg"):
        mismatch_detected = True
        reasons.append("File format mismatch: JPEG header with non-JPEG extension")
        score += 15

    # Check if a safe extension is actually a zip file, but is not docx/xlsx/zip etc.
    if detected_format == "zip_or_office" and file_extension not in (".zip", ".docx", ".xlsx", ".pptx", ".jar"):
        mismatch_detected = True
        reasons.append("File format mismatch: ZIP signature with non-archive extension")
        score += 20

    parameters["mime_type"] = {
        "declared_content_type": declared_content_type,
        "detected_magic_format": detected_format,
        "mismatch_detected": mismatch_detected,
        "status": "Dangerous (Mismatch)" if mismatch_detected else "Safe"
    }

    # 6. Macro Detection check (Office files)
    macros_detected = False
    office_file_types = {".doc", ".xls", ".ppt", ".docx", ".xlsx", ".pptx", ".docm", ".xlsm", ".pptm"}
    
    if file_extension in office_file_types or detected_format == "zip_or_office":
        # Check macro-enabled extensions explicitly
        if file_extension in (".docm", ".xlsm", ".pptm"):
            macros_detected = True
            reasons.append(f"Macro-enabled Office extension detected: {file_extension}")
            score += 30
        elif detected_format == "zip_or_office":
            # Scan zip archive members
            try:
                if zipfile.is_zipfile(file_path):
                    with zipfile.ZipFile(file_path, "r") as zf:
                        for name in zf.namelist():
                            if "vbaProject.bin" in name or "vba" in name.lower():
                                macros_detected = True
                                reasons.append("Embedded macros found inside Microsoft Office document structure (vbaProject.bin)")
                                score += 30
                                break
            except Exception:
                pass # Not a valid zip or cannot open

    parameters["macro_detection"] = {
        "macros_detected": macros_detected,
        "status": "Suspicious (Macros present)" if macros_detected else "Safe"
    }

    # 7. Archive Detection (Executable payloads inside ZIP)
    hidden_archive_payloads = []
    if file_extension == ".zip" or detected_format == "zip_or_office":
        try:
            if zipfile.is_zipfile(file_path):
                with zipfile.ZipFile(file_path, "r") as zf:
                    for member_name in zf.namelist():
                        member_ext = os.path.splitext(member_name)[1].lower()
                        # Check if member file is an executable
                        if member_ext in EXECUTABLE_EXTENSIONS:
                            hidden_archive_payloads.append(member_name)
                        # Check if member file has double extension
                        member_cleaned = member_name.split("/")[-1].lstrip(".")
                        member_parts = member_cleaned.split(".")
                        if len(member_parts) >= 3:
                            member_last = "." + member_parts[-1].lower()
                            member_second = "." + member_parts[-2].lower()
                            if member_last in EXECUTABLE_EXTENSIONS or member_second in SAFE_EXTENSIONS:
                                hidden_archive_payloads.append(member_name)
        except Exception:
            pass

    parameters["archive_detection"] = {
        "is_archive": file_extension == ".zip",
        "hidden_payloads": hidden_archive_payloads,
        "status": "Dangerous" if hidden_archive_payloads else "Safe"
    }
    if hidden_archive_payloads:
        score += 35
        reasons.append(f"Hidden executable or script payload inside ZIP archive: {', '.join(hidden_archive_payloads)}")

    # 8. PDF Indicators check (Active elements)
    pdf_indicators_found = []
    if file_extension == ".pdf" or detected_format == "pdf":
        # Read entire file bytes for search (files can be larger, but we already read 8KB in file_bytes)
        # We can read the whole file or search in the chunk if it's small, let's read the full file bytes safely
        try:
            with open(file_path, "rb") as f:
                full_bytes = f.read()
            
            # PDF dictionary keys representing active content
            pdf_active_keys = [
                (b"/JavaScript", "JavaScript"),
                (b"/JS", "JS (Short JS)"),
                (b"/OpenAction", "OpenAction (Auto run)"),
                (b"/AA", "Additional Actions"),
                (b"/Launch", "Launch (Process creation)"),
                (b"/SubmitForm", "SubmitForm (Data exfiltration)")
            ]
            
            for key_bytes, key_name in pdf_active_keys:
                if key_bytes in full_bytes:
                    pdf_indicators_found.append(key_name)
        except Exception:
            pass

    parameters["pdf_indicators"] = {
        "is_pdf": file_extension == ".pdf",
        "active_indicators": pdf_indicators_found,
        "status": "Suspicious (Active content)" if pdf_indicators_found else "Safe"
    }
    if pdf_indicators_found:
        score += 25
        reasons.append(f"Active content indicators found in PDF: {', '.join(pdf_indicators_found)}")

    # Final calculations
    score = min(score, 100)
    
    return {
        "score": score,
        "reasons": reasons,
        "parameters": parameters
    }
