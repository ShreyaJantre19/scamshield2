from services.email_analyzer import analyze_email


def master_email_analyze(

        from_email,

        reply_to,

        subject,

        body

):

    result = analyze_email(

        from_email,

        reply_to,

        subject,

        body

    )

    score = result["score"]

    reasons = result["reasons"]

    score = min(score, 100)

    if score < 30:

        level = "SAFE"

        explanation = (
            "No major phishing indicators detected."
        )

    elif score < 60:

        level = "SUSPICIOUS"

        explanation = (
            "This email contains suspicious characteristics."
        )

    else:

        level = "DANGEROUS"

        explanation = (
            "Multiple phishing indicators detected."
        )

    return {

        "score": score,

        "level": level,

        "keywords_found":
        result["keywords_found"],

        "reasons": reasons,

        "explanation": explanation

    } 