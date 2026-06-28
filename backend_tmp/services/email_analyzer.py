# pyrefly: ignore [missing-import]
import re


URGENT_KEYWORDS = [

    "urgent",

    "immediately",

    "verify",

    "suspended",

    "limited",

    "expire",

    "otp",

    "password",

    "bank",

    "login",

    "confirm",

    "payment"

]


def analyze_email(

        from_email,

        reply_to,

        subject,

        body

):

    score = 0

    reasons = []

    found_keywords = []

    # Reply-To mismatch

    if from_email.lower() != reply_to.lower():

        score += 25

        reasons.append(

            "Reply-To address differs from sender"

        )

    text = (

        subject +

        " " +

        body

    ).lower()

    # Urgency keyword detection

    for keyword in URGENT_KEYWORDS:

        if keyword in text:

            found_keywords.append(keyword)

    if len(found_keywords) > 0:

        score += len(found_keywords) * 5

        reasons.append(

            "Urgency language detected"

        )

    # Credential request detection

    credential_patterns = [

        "password",

        "otp",

        "verify account",

        "confirm identity",

        "login"

    ]

    for pattern in credential_patterns:

        if pattern in text:

            score += 10

            reasons.append(

                "Possible credential request"

            )

            break

    score = min(score, 100)

    if score < 30:

        level = "SAFE"

    elif score < 60:

        level = "SUSPICIOUS"

    else:

        level = "DANGEROUS"

    return {

        "score": score,

        "level": level,

        "keywords_found": found_keywords,

        "reasons": reasons

    } 