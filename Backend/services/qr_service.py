import re
from PIL import Image
from rapidfuzz.distance.Levenshtein import normalized_similarity as ratio
from services.url_service import analyze_url, KEYWORDS, SUSPICIOUS_TLDS, BRANDS

# ---------------------------------------------------------------------------
# Core QR functionality
# ---------------------------------------------------------------------------

def decode_qr(image_path: str):
    """Open an image, find a QR code, and return the decoded string (or None)."""
    try:
        from pyzbar.pyzbar import decode
        image = Image.open(image_path)
        decoded = decode(image)
        if not decoded:
            return None
        return decoded[0].data.decode("utf-8")
    except Exception:
        return None


def detect_qr_type(content: str) -> str:
    """Classify a decoded QR payload into a human-readable type."""
    content_lower = content.lower().strip()
    if content_lower.startswith(("http://", "https://")):
        return "URL"
    if content_lower.startswith("tel:"):
        return "PHONE"
    if content_lower.startswith("sms:"):
        return "SMS"
    if content_lower.startswith("mailto:"):
        return "EMAIL"
    if content_lower.startswith("wifi:"):
        return "WIFI"
    if "upi://" in content_lower:
        return "UPI"
    return "TEXT"


# ---------------------------------------------------------------------------
# Parsing Helpers
# ---------------------------------------------------------------------------

def parse_mailto(mailto_link: str) -> dict:
    """Extract receiver, subject, and body from a mailto URL."""
    # mailto:receiver@domain.com?subject=hello&body=world
    res = {"receiver": "", "subject": "", "body": ""}
    
    # Strip mailto:
    clean = mailto_link[7:]
    
    if "?" in clean:
        parts = clean.split("?", 1)
        res["receiver"] = parts[0]
        query = parts[1]
        
        # Simple query parsing
        for param in query.split("&"):
            if "=" in param:
                k, v = param.split("=", 1)
                k_dec = k.lower().strip()
                # Unquote roughly
                import urllib.parse
                v_dec = urllib.parse.unquote(v)
                if k_dec in res:
                    res[k_dec] = v_dec
    else:
        res["receiver"] = clean
        
    return res


def parse_wifi(wifi_string: str) -> dict:
    """
    Parse WIFI:T:WPA;S:MyNetwork;P:myPassword;H:false;;
    Returns dict with S (SSID), T (Type), P (Password), H (Hidden).
    """
    res = {"S": "", "T": "", "P": "", "H": ""}
    # Strip wifi:
    clean = wifi_string[5:]
    
    # Split by semicolon
    tokens = clean.split(";")
    for token in tokens:
        if ":" in token:
            k, v = token.split(":", 1)
            k = k.strip().upper()
            if k in res:
                res[k] = v
    return res


# ---------------------------------------------------------------------------
# Risk Analysis function
# ---------------------------------------------------------------------------

def analyze_qr_risks(qr_type: str, content: str) -> dict:
    """
    Analyze the safety risks of a QR code based on its type and content.
    Returns:
      - score: int (0 to 100)
      - reasons: list[str]
      - status: str ("Safe", "Suspicious", "Dangerous")
      - parameters: dict (detailed results for the 8 parameters)
    """
    score = 0
    reasons = []
    parameters = {
        "qr_decoding_success": {
            "status": "Passed",
            "message": "QR code decoded successfully"
        },
        "content_type_detection": {
            "detected_type": qr_type,
            "status": "Passed"
        }
    }

    # Initialize all other action parameters to N/A
    parameters["phone_action"] = {"status": "N/A"}
    parameters["sms_action"] = {"status": "N/A"}
    parameters["email_action"] = {"status": "N/A"}
    parameters["wifi_credentials"] = {"status": "N/A"}
    parameters["upi_payment_request"] = {"status": "N/A"}
    parameters["url_reuse"] = {"status": "N/A"}

    # 1. URL Reuse Action
    if qr_type == "URL":
        url_res = analyze_url(content)
        score = url_res["score"]
        reasons = url_res["reasons"]
        parameters["url_reuse"] = {
            "url": content,
            "score": score,
            "reasons": reasons,
            "status": url_res["status"]
        }

    # 2. UPI Payment Action
    elif qr_type == "UPI":
        content_lower = content.lower()
        upi_reasons = []
        upi_score = 0

        # Check for amount specified
        if "am=" in content_lower:
            try:
                amt_match = re.search(r"[?&]am=([^&]+)", content_lower)
                if amt_match:
                    amt = float(amt_match.group(1))
                    if amt > 2000:
                        upi_score += 25
                        upi_reasons.append(f"High payment request amount: {amt} INR")
            except ValueError:
                pass

        # Payee name parameter missing
        if "pn=" not in content_lower:
            upi_score += 15
            upi_reasons.append("UPI link is missing payee name (pn) parameter")

        # Payee address verification
        vpa_match = re.search(r"upi://pay\?pa=([^&]+)", content)
        if vpa_match:
            vpa = vpa_match.group(1)
            if "@" not in vpa:
                upi_score += 35
                upi_reasons.append(f"Invalid virtual payment address (VPA): '{vpa}'")
        else:
            upi_score += 20
            upi_reasons.append("UPI link is missing payment address (pa) parameter")

        score = upi_score
        reasons = upi_reasons
        parameters["upi_payment_request"] = {
            "vpa": vpa_match.group(1) if vpa_match else None,
            "reasons": upi_reasons,
            "status": "Dangerous" if upi_score >= 50 else "Suspicious" if upi_score > 0 else "Safe"
        }

    # 3. Phone Action
    elif qr_type == "PHONE":
        phone_reasons = []
        phone_score = 0
        number = content.split(":")[1].split("?")[0] if ":" in content else ""
        clean_number = "".join(filter(str.isdigit, number))

        # Shortcode or premium number
        if clean_number and len(clean_number) < 6:
            phone_score += 20
            phone_reasons.append(f"Shortcode / Premium rate number: '{number}'")

        score = phone_score
        reasons = phone_reasons
        parameters["phone_action"] = {
            "phone_number": number,
            "reasons": phone_reasons,
            "status": "Suspicious" if phone_score > 0 else "Safe"
        }

    # 4. SMS Action
    elif qr_type == "SMS":
        sms_reasons = []
        sms_score = 0
        
        # sms:number?body=text
        parts = content.split("?", 1)
        number_part = parts[0]
        number = number_part.split(":")[1] if ":" in number_part else ""
        clean_number = "".join(filter(str.isdigit, number))
        
        sms_body = ""
        if len(parts) > 1 and "body=" in parts[1]:
            import urllib.parse
            body_match = re.search(r"body=([^&]+)", parts[1])
            if body_match:
                sms_body = urllib.parse.unquote(body_match.group(1))

        # Check for premium number
        if clean_number and len(clean_number) < 6:
            sms_score += 20
            sms_reasons.append(f"Shortcode / Premium rate number: '{number}'")

        # Check for keywords in body
        if sms_body:
            sms_body_lower = sms_body.lower()
            found_kws = [kw for kw in KEYWORDS if kw in sms_body_lower]
            if found_kws:
                sms_score += 25
                sms_reasons.append(f"SMS contains credential theft/scam keywords: {', '.join(found_kws)}")

        score = sms_score
        reasons = sms_reasons
        parameters["sms_action"] = {
            "phone_number": number,
            "body": sms_body,
            "reasons": sms_reasons,
            "status": "Dangerous" if sms_score >= 40 else "Suspicious" if sms_score > 0 else "Safe"
        }

    # 5. Email Action
    elif qr_type == "EMAIL":
        email_reasons = []
        email_score = 0
        parsed = parse_mailto(content)
        receiver = parsed["receiver"]
        subject = parsed["subject"]
        body = parsed["body"]
        
        # Validate receiver domain
        if "@" in receiver:
            receiver_domain = receiver.split("@")[-1].lower()
            
            # Suspicious domain keywords
            for kw in ["secure", "verify", "login", "update", "bank", "payment"]:
                if kw in receiver_domain:
                    email_score += 15
                    email_reasons.append(f"Suspicious keyword in email receiver domain: '{kw}'")

            # Typosquatting in email receiver
            domain_name_only = receiver_domain.split(".")[0]
            for brand in BRANDS:
                similarity = ratio(domain_name_only, brand)
                if similarity > 0.80 and domain_name_only != brand:
                    email_score += 30
                    email_reasons.append(f"Possible typosquatting of brand '{brand}' in email domain '{receiver_domain}'")

            # Suspicious TLD
            for tld in SUSPICIOUS_TLDS:
                if receiver_domain.endswith(tld):
                    email_score += 15
                    email_reasons.append(f"Suspicious TLD in receiver domain: {tld}")
        else:
            email_score += 20
            email_reasons.append("Email action is missing valid receiver address")

        # Keywords in subject/body
        email_text = f"{subject} {body}".lower()
        found_kws = [kw for kw in KEYWORDS if kw in email_text]
        if found_kws:
            email_score += 20
            email_reasons.append(f"Email body or subject contains scam/phishing keywords: {', '.join(found_kws)}")

        score = email_score
        reasons = email_reasons
        parameters["email_action"] = {
            "receiver": receiver,
            "subject": subject,
            "reasons": email_reasons,
            "status": "Dangerous" if email_score >= 45 else "Suspicious" if email_score > 0 else "Safe"
        }

    # 6. WiFi Credentials Action
    elif qr_type == "WIFI":
        wifi_reasons = []
        wifi_score = 0
        parsed = parse_wifi(content)
        ssid = parsed["S"]
        auth_type = parsed["T"].lower()
        password = parsed["P"]

        # 1. Unsecured auth
        if auth_type == "nopass" or not auth_type or not password:
            wifi_score += 30
            wifi_reasons.append("Unsecured/Unencrypted open Wi-Fi configuration (no password required)")
        else:
            # 2. Weak password
            if len(password) < 8:
                wifi_score += 15
                wifi_reasons.append(f"Weak password: length is only {len(password)} characters (minimum recommended is 8)")

        # 3. Phishing SSID names
        ssid_lower = ssid.lower()
        phish_ssids = ["free_public", "scam", "phish", "mcdonalds_free", "starbucks_free", "airport_wifi"]
        for p_ssid in phish_ssids:
            if p_ssid in ssid_lower:
                wifi_score += 20
                wifi_reasons.append(f"SSID matches known mock/phishing hotspot name: '{ssid}'")

        score = wifi_score
        reasons = wifi_reasons
        parameters["wifi_credentials"] = {
            "ssid": ssid,
            "auth_type": parsed["T"],
            "reasons": wifi_reasons,
            "status": "Dangerous" if wifi_score >= 45 else "Suspicious" if wifi_score > 0 else "Safe"
        }

    # 7. Text phishing check
    elif qr_type == "TEXT":
        text_reasons = []
        text_score = 0
        content_lower = content.lower()
        for keyword in KEYWORDS:
            if keyword in content_lower:
                text_score += 15
                text_reasons.append(f"Text payload contains scam keyword: '{keyword}'")

        score = text_score
        reasons = text_reasons

    # Classify final risk status based on the unified score threshold
    if score >= 60:
        status = "Dangerous"
    elif score >= 30:
        status = "Suspicious"
    else:
        status = "Safe"

    return {
        "score": score,
        "reasons": reasons,
        "status": status,
        "type": qr_type,
        "parameters": parameters
    }
