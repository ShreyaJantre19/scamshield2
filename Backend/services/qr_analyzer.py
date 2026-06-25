# pyrefly: ignore [missing-import]
SHORTENERS = [

    "bit.ly",

    "tinyurl.com",

    "t.co",

    "goo.gl",

    "cutt.ly",

    "rb.gy",

    "shorturl.at"

]


def analyze_qr_content(content):

    content = content.strip()

    result = {

        "type": "UNKNOWN",

        "risk": "LOW"

    }

    # URL

    if content.startswith(
        ("http://", "https://")
    ):

        result["type"] = "URL"

        for shortener in SHORTENERS:

            if shortener in content:

                result["risk"] = "HIGH"

                result["reason"] = (
                    "URL shortener detected"
                )

                return result

        result["reason"] = (
            "Normal URL detected"
        )

        return result

    # UPI

    if content.startswith("upi://"):

        result["type"] = "UPI"

        result["risk"] = "MEDIUM"

        result["reason"] = (
            "Payment QR detected"
        )

        return result

    # SMS

    if content.startswith("SMSTO:"):

        result["type"] = "SMS"

        result["risk"] = "HIGH"

        result["reason"] = (
            "SMS QR detected"
        )

        return result

    # PHONE

    if content.startswith("tel:"):

        result["type"] = "PHONE"

        result["risk"] = "MEDIUM"

        result["reason"] = (
            "Phone call QR detected"
        )

        return result

    # WIFI

    if content.startswith("WIFI:"):

        result["type"] = "WIFI"

        result["risk"] = "HIGH"

        result["reason"] = (
            "WiFi configuration QR detected"
        )

        return result

    return result 