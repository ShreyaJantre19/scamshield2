# pyrefly: ignore [missing-import]
import random


THREATS = [

    "Phishing campaign targeting banking users",

    "Fake Microsoft login pages detected",

    "Malicious QR codes spreading via posters",

    "Fake PayPal emails reported",

    "Typosquatting domains increasing",

    "Credential stealing attacks detected",

    "Suspicious UPI QR scams trending"

]


def get_threat_feed():

    return random.sample(
        THREATS,
        5
    ) 