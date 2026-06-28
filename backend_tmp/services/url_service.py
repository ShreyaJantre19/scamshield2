import ipaddress
import whois
from datetime import datetime
from urllib.parse import urlparse
# pyrefly: ignore [missing-import]
from rapidfuzz.distance.Levenshtein import normalized_similarity as ratio   
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeout

_WHOIS_TIMEOUT = 5  # seconds

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

KEYWORDS = [
    "login", "verify", "bank", "wallet",
    "password", "otp", "reward", "gift"
]

BRANDS = [
    "google", "paypal", "amazon", "facebook",
    "instagram", "microsoft", "apple",
    "netflix", "linkedin", "twitter"
]

SUSPICIOUS_TLDS = [
    "xyz", "top", "click", "zip", "review",
    "loan", "work", "country", "gq", "tk"
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_domain_name(url: str) -> str:
    host = urlparse(url).hostname or ""
    if host.startswith("www."):
        host = host[4:]
    return host.split(".")[0]


def get_tld(url: str) -> str:
    host = urlparse(url).hostname or ""
    return host.split(".")[-1]

# ---------------------------------------------------------------------------
# Individual check functions ΓÇô each returns (score: int, reasons: list[str])
# ---------------------------------------------------------------------------

def check_https(url: str):
    score = 0
    reasons = []
    if urlparse(url).scheme != "https":
        score += 20
        reasons.append("No HTTPS encryption")
    return score, reasons


def check_domain_age(domain_name: str):
    score = 0
    reasons = []
    try:
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(whois.whois, domain_name)
            info = future.result(timeout=_WHOIS_TIMEOUT)
        creation = info.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        age_days = (datetime.now() - creation).days
        if age_days < 30:
            score += 25
            reasons.append(f"Domain only {age_days} days old")
        elif age_days < 90:
            score += 15
            reasons.append(f"Domain only {age_days} days old")
    except FuturesTimeout:
        reasons.append("Domain age check timed out")
    except Exception:
        reasons.append("Could not verify domain age")
    return score, reasons


def check_url_length(url: str):
    score = 0
    reasons = []
    length = len(url)
    if length > 75:
        score += 10
        reasons.append(f"URL length is {length}")
    return score, reasons


def check_hyphens(url: str):
    score = 0
    reasons = []
    hyphens = url.count("-")
    if hyphens > 3:
        score += 10
        reasons.append(f"Contains {hyphens} hyphens")
    return score, reasons


def check_ip_url(url: str):
    score = 0
    reasons = []
    try:
        host = urlparse(url).hostname
        ipaddress.ip_address(host)
        score += 20
        reasons.append("Uses raw IP address")
    except Exception:
        pass
    return score, reasons


def check_keywords(url: str):
    score = 0
    reasons = []
    for word in KEYWORDS:
        if word in url:
            score += 10
            reasons.append(f"Contains keyword '{word}'")
    return score, reasons


def check_typosquatting(url: str):
    score = 0
    reasons = []
    domain = get_domain_name(url).lower()
    for brand in BRANDS:
        brand_lower = brand.lower()
        if domain == brand_lower:
            continue
        similarity = ratio(domain, brand_lower)
        if similarity > 0.80 or (brand_lower in domain):
            score += 30
            reasons.append(f"Possible impersonation of {brand}")
            break
    return score, reasons



def check_suspicious_tld(url: str):
    score = 0
    reasons = []
    tld = get_tld(url)
    if tld in SUSPICIOUS_TLDS:
        score += 20
        reasons.append(f"Suspicious TLD: .{tld}")
    return score, reasons

# ---------------------------------------------------------------------------
# Main analysis entry point
# ---------------------------------------------------------------------------

def analyze_url(url: str) -> dict:
    total_score = 0
    all_reasons = []

    checks = [
        check_https(url),
        check_url_length(url),
        check_hyphens(url),
        check_ip_url(url),
        check_keywords(url),
        check_typosquatting(url),
        check_suspicious_tld(url),
    ]

    for score, reasons in checks:
        total_score += score
        all_reasons.extend(reasons)

    status = (
        "high_risk" if total_score >= 50 else
        "medium_risk" if total_score >= 25 else
        "low_risk"
    )

    return {
        "score": total_score,
        "status": status,
        "reasons": all_reasons
    }
