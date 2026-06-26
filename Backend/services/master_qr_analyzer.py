from Backend.services.qr_analyzer import analyze_qr_content
from Backend.services.master_analyzer import master_analyze


def master_qr_analyze(content):

    qr_result = analyze_qr_content(content)

    # QR contains a URL
    if qr_result["type"] == "URL":

        url_result = master_analyze(content)

        return {

            "score": url_result["score"],

            "level": url_result["level"],

            "reasons": url_result["reasons"],

            "explanation": url_result["explanation"]

        }

    # QR contains plain text, phone number, etc.
    return {

        "score": 0,

        "level": "SAFE",

        "reasons": [

            f"QR code contains {qr_result['type']} content"

        ],

        "explanation":

            "This QR code does not contain a website link."

    } 