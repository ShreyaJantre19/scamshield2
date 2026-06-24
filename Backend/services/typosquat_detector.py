# pyrefly: ignore [missing-import]
from Levenshtein import distance
from utils.brand_database import BRANDS


def detect_typosquat(url):

    try:

        domain = (
            url.replace("https://", "")
               .replace("http://", "")
               .split("/")[0]
               .lower()
        )

        domain = domain.replace("www.", "")

        domain_name = domain.split(".")[0]

        for brand in BRANDS:

            if domain_name == brand:
                continue

            if distance(domain_name, brand) <= 2:

                return {
                    "detected": True,
                    "brand": brand
                }

        return {
            "detected": False
        }

    except:

        return {
            "detected": False
        } 