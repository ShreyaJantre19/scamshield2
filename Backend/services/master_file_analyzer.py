import os
import tempfile

from services.file_analyzer import analyze_file
from services.macro_detector import detect_macros


async def master_file_analyze(file):

    # Save uploaded file temporarily

    temp_dir = tempfile.gettempdir()

    file_path = os.path.join(
        temp_dir,
        file.filename
    )

    with open(file_path, "wb") as buffer:

        content = await file.read()

        buffer.write(content)

    # Existing analysis

    result = analyze_file(file_path)

    score = result["score"]

    reasons = result["reasons"]

    # Macro Detection

    has_macros = detect_macros(file_path)

    if has_macros:

        score += 40

        reasons.append(

            "Embedded macros detected"

        )

    score = min(score, 100)

    # Risk Level

    if score < 30:

        level = "SAFE"

        explanation = (
            "No major threats detected."
        )

    elif score < 60:

        level = "SUSPICIOUS"

        explanation = (
            "This file contains suspicious characteristics."
        )

    else:

        level = "DANGEROUS"

        explanation = (
            "Multiple indicators suggest this file may be malicious."
        )

    return {

        "filename": file.filename,

        "risk_score": score,

        "status": level,

        "sha256": result["sha256"],

        "reasons": reasons,

        "has_macros": has_macros,

        "explanation": explanation

    } 