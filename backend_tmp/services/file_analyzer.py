# pyrefly: ignore [missing-import]
from Backend.utils.hash_generator import generate_sha256


def analyze_file(file_path):

    sha256 = generate_sha256(file_path)

    extension = file_path.split(".")[-1]

    suspicious_extensions = [

        "exe",

        "bat",

        "cmd",

        "vbs",

        "scr"

    ]

    score = 0

    reasons = []

    if extension.lower() in suspicious_extensions:

        score += 40

        reasons.append(

            "Potentially dangerous file extension"

        )

    return {

        "score": score,

        "sha256": sha256,

        "reasons": reasons

    } 