# pyrefly: ignore [missing-import]
SUSPICIOUS_KEYWORDS = [
    "login",
    "verify",
    "bank",
    "update",
    "secure",
    "payment",
    "account",
    "otp",
    "invoice",
    "urgent",
    "refund",
    "suspended",
    "confirm"
]


def detect_keywords(url: str):

    found = []

    url_lower = url.lower()

    for keyword in SUSPICIOUS_KEYWORDS:

        if keyword in url_lower:
            found.append(keyword)

    return found 