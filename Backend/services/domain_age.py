# pyrefly: ignore [missing-import]
import whois
from datetime import datetime, timezone


def get_domain_age(url):

    try:

        domain = (
            url.replace("https://", "")
               .replace("http://", "")
               .split("/")[0]
        )

        info = whois.whois(domain)

        creation_date = info.creation_date

        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if creation_date.tzinfo is not None:
            creation_date = creation_date.replace(tzinfo=None)

        age_days = (
            datetime.now() -
            creation_date
        ).days

        return age_days

    except Exception:

        return None 