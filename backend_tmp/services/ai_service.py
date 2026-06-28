def get_risk_level(score):
    if score >= 60:
        return "Dangerous"
    elif score >= 30:
        return "Suspicious"
    return "Safe"


def generate_explanation(score, reasons):
    if score >= 60:
        return (
            "This content appears highly risky. "
            + "Detected issues include: "
            + ", ".join(reasons)
            + ". Proceed with extreme caution."
        )
    elif score >= 30:
        return (
            "This content contains some suspicious indicators. "
            + "Detected issues include: "
            + ", ".join(reasons)
            + ". Verification is recommended."
        )
    else:
        return "No major threats were detected. However, always exercise caution online."
