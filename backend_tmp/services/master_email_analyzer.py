from Backend.services.email_service import analyze_email


def master_email_analyze(
        from_email,
        reply_to,
        subject,
        body
):
    # Call the detailed email_service analyzer
    result = analyze_email(from_email, subject, body)
    score = result["risk_score"]
    reasons = result["reasons"]

    # Incorporate Reply-To mismatch logic
    if from_email.lower() != reply_to.lower():
        score += 25
        reasons.append("Reply-To address differs from sender")

    score = min(score, 100)

    if score < 30:
        level = "SAFE"
        explanation = "No major phishing indicators detected."
    elif score < 60:
        level = "SUSPICIOUS"
        explanation = "This email contains suspicious characteristics."
    else:
        level = "DANGEROUS"
        explanation = "Multiple phishing indicators detected."

    return {
        "score": score,
        "level": level,
        "keywords_found": result["parameters"].get("urgency_keywords", {}).get("keywords_found", []),
        "reasons": reasons,
        "explanation": explanation
    } 