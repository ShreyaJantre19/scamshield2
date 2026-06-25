# pyrefly: ignore [missing-import]
import re

from utils.keyword_detector import detect_keywords
from services.domain_age import get_domain_age
from services.typosquat_detector import detect_typosquat
from services.ssl_checker import check_ssl
from services.redirect_checker import check_redirects


def analyze_url(url):

    score = 0

    reasons = []

    # HTTPS Check
    if not url.startswith("https://"):

        score += 15

        reasons.append(
            "Website does not use HTTPS"
        )

    # Suspicious Keywords
    keywords = detect_keywords(url)

    if len(keywords) > 0:

        score += len(keywords) * 10

        reasons.append(
            f"Suspicious keywords found: {', '.join(keywords)}"
        )

    # Long URL
    if len(url) > 75:

        score += 5

        reasons.append(
            "URL is unusually long"
        )

    # Hyphen Detection
    if url.count("-") >= 2:

        score += 10

        reasons.append(
            "Too many hyphens in URL"
        )

    # Domain Extraction
    domain = (
        url.replace("https://", "")
           .replace("http://", "")
           .split("/")[0]
    )

    # Excessive Subdomains
    if domain.count(".") >= 3:

        score += 10

        reasons.append(
            "Excessive subdomains detected"
        )

    # IP Address URL Detection
    ip_pattern = r"^(?:http[s]?://)?(?:\d{1,3}\.){3}\d{1,3}"

    if re.match(ip_pattern, url):

        score += 20

        reasons.append(
            "IP address used instead of domain name"
        )

    # Domain Age Check
    domain_age = get_domain_age(url)

    if domain_age is not None:

        if domain_age < 30:

            score += 25

            reasons.append(
                "Domain is less than 30 days old"
            )

        elif domain_age < 180:

            score += 10

            reasons.append(
                "Domain is relatively new"
            )

    # Typosquatting Detection
    typo_result = detect_typosquat(url)

    if typo_result["detected"]:

        score += 30

        reasons.append(
            f"Possible typosquatting of {typo_result['brand']}"
        )

    # SSL Certificate Check
    ssl_info = check_ssl(url)

    if not ssl_info["valid"]:

        score += 20

        reasons.append(
            "SSL certificate missing or invalid"
        )

    # Redirect Analysis
    redirect_info = check_redirects(url)

    if redirect_info["redirect_count"] is not None:

        if redirect_info["redirect_count"] >= 3:

            score += 15

            reasons.append(
                "Too many redirects"
            )

    # Limit score to 100
    score = min(score, 100)

    # Determine Risk Level
    if score < 30:

        level = "SAFE"

        explanation = (
            "No major phishing indicators were detected."
        )

    elif score < 60:

        level = "SUSPICIOUS"

        explanation = (
            "The URL contains some suspicious characteristics."
        )

    else:

        level = "DANGEROUS"

        explanation = (
            "Multiple phishing indicators were detected."
        )

    if len(reasons) == 0:

        reasons.append(
            "No major threats detected"
        )

    return {

        "score": score,

        "level": level,

        "reasons": reasons,

        "explanation": explanation,

        "domain_age": domain_age,

        "typosquatting": typo_result,

        "ssl_info": ssl_info,

        "redirect_info": redirect_info

    } 