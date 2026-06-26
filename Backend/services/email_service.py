import re
from rapidfuzz.distance.Levenshtein import normalized_similarity as ratio
from services.url_service import analyze_url

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SUSPICIOUS_DOMAIN_KEYWORDS = [
    "secure", "verify", "login", "update", "account",
    "bank", "payment", "wallet", "support", "refund", "signin"
]

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".click", ".live", ".site", ".zip", ".gq", ".tk", ".cf", ".ga", ".work"
]

BRANDS = [
    "google", "paypal", "amazon", "facebook", "instagram",
    "microsoft", "apple", "netflix", "linkedin", "twitter"
]

BRAND_DOMAINS = {
    "paypal": ["paypal.com", "paypal.in", "pypl.com"],
    "amazon": ["amazon.com", "amazon.in", "amazon.co.uk", "aws.amazon.com"],
    "google": ["google.com", "gmail.com", "googlemail.com"],
    "microsoft": ["microsoft.com", "outlook.com", "hotmail.com", "live.com", "msn.com"],
    "apple": ["apple.com", "icloud.com", "me.com"],
    "netflix": ["netflix.com"],
    "linkedin": ["linkedin.com"],
    "twitter": ["twitter.com", "x.com"],
    "facebook": ["facebook.com", "fb.com"],
    "instagram": ["instagram.com"]
}

URGENCY_KEYWORDS = [
    "urgent", "immediately", "act now", "final warning",
    "account suspended", "account blocked", "verify now", "limited time",
    "expires today", "security alert", "take action", "warning",
    "critical", "important notice", "suspended", "blocked", "terminated",
    "disabled", "locked", "deactivated"
]

CREDENTIAL_KEYWORDS = [
    "login", "verify", "password", "otp", "credentials", "security code",
    "bank details", "routing number", "pin", "social security", "ssn",
    "credit card", "debit card", "passcode", "update credentials", "verify account"
]

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def parse_sender(sender: str) -> tuple[str, str]:
    """
    Parses a sender string like:
      "PayPal Support" <support@paypal.com>
      or support@paypal.com
    Returns a tuple (display_name, email_address).
    """
    sender = sender.strip()
    if "<" in sender and ">" in sender:
        parts = sender.split("<")
        display_name = parts[0].strip(" \"'")
        email_address = parts[1].split(">")[0].strip()
        return display_name, email_address
    return "", sender


def extract_urls(text: str) -> list[str]:
    """Extract all URLs from a text string using regex."""
    # Simple regex for URLs
    url_pattern = r"https?://[^\s\"'<>]+"
    return re.findall(url_pattern, text)


# ---------------------------------------------------------------------------
# Main analysis function
# ---------------------------------------------------------------------------

def analyze_email(sender: str, subject: str, body: str) -> dict:
    """
    Analyze email safety using 7 parameters.
    Returns:
      - risk_score: int (0 to 100)
      - reasons: list[str]
      - verdict: str ("Safe", "Suspicious", "Dangerous")
      - parameters: dict (details of all 7 parameters)
    """
    risk_score = 0
    reasons = []
    parameters = {}

    display_name, email_address = parse_sender(sender)

    # Validate email address
    if "@" not in email_address:
        return {
            "risk_score": 100,
            "reasons": ["Invalid sender email address format (missing '@')"],
            "verdict": "Dangerous",
            "parameters": {"error": "Invalid email formatting"}
        }

    domain = email_address.split("@")[-1].lower()
    email_text = f"{subject} {body}".lower()

    # 1. Sender Domain check (Fake Sender)
    domain_score = 0
    domain_reasons = []

    # Suspicious domain keywords
    for keyword in SUSPICIOUS_DOMAIN_KEYWORDS:
        if keyword in domain:
            domain_score += 10
            domain_reasons.append(f"Suspicious domain keyword: '{keyword}'")

    # Multiple hyphens
    hyphen_count = domain.count("-")
    if hyphen_count >= 2:
        domain_score += 10
        domain_reasons.append(f"Domain contains {hyphen_count} hyphens")

    # Long domain
    if len(domain) > 25:
        domain_score += 10
        domain_reasons.append("Unusually long sender domain name")

    # Suspicious TLDs
    for tld in SUSPICIOUS_TLDS:
        if domain.endswith(tld):
            domain_score += 15
            domain_reasons.append(f"Suspicious TLD detected: {tld}")

    parameters["sender_domain"] = {
        "email_address": email_address,
        "domain": domain,
        "score": domain_score,
        "reasons": domain_reasons,
        "status": "Suspicious" if domain_score > 0 else "Safe"
    }
    risk_score += domain_score
    reasons.extend(domain_reasons)

    # 2. Typosquatting (Brand Impersonation)
    typosquatting_detected = False
    typosquatting_brand = ""
    
    # Check similarity with known brands
    domain_name_only = domain.split(".")[0]
    for brand in BRANDS:
        similarity = ratio(domain_name_only, brand)
        if similarity > 0.80 and domain_name_only != brand:
            typosquatting_detected = True
            typosquatting_brand = brand
            break

    parameters["typosquatting"] = {
        "detected": typosquatting_detected,
        "brand_impersonated": typosquatting_brand,
        "status": "Dangerous" if typosquatting_detected else "Safe"
    }
    if typosquatting_detected:
        risk_score += 30
        reasons.append(f"Possible typosquatting/impersonation of brand '{typosquatting_brand}' in domain '{domain}'")

    # 3. Urgency Keywords (Pressure Tactics)
    urgency_found = []
    for kw in URGENCY_KEYWORDS:
        if kw in email_text:
            urgency_found.append(kw)

    urgency_score = min(len(urgency_found) * 10, 30)
    parameters["urgency_keywords"] = {
        "keywords_found": urgency_found,
        "score": urgency_score,
        "status": "Suspicious" if urgency_found else "Safe"
    }
    risk_score += urgency_score
    if urgency_found:
        reasons.append(f"Urgency/pressure phrases detected: {', '.join(urgency_found)}")

    # 4. Credential Keywords (Credential Theft)
    credentials_found = []
    for kw in CREDENTIAL_KEYWORDS:
        if kw in email_text:
            credentials_found.append(kw)

    credential_score = min(len(credentials_found) * 10, 30)
    parameters["credential_keywords"] = {
        "keywords_found": credentials_found,
        "score": credential_score,
        "status": "Suspicious" if credentials_found else "Safe"
    }
    risk_score += credential_score
    if credentials_found:
        reasons.append(f"Credential/verification keywords found: {', '.join(credentials_found)}")

    # 5. URL Extraction (Find Links)
    extracted_urls_list = extract_urls(subject + " " + body)
    unique_urls = list(set(extracted_urls_list))

    parameters["url_extraction"] = {
        "urls_found": unique_urls,
        "count": len(unique_urls),
        "status": "Suspicious" if unique_urls else "Safe"
    }

    # 6. URL Analyzer Reuse (Deep URL inspection)
    url_reuse_results = []
    url_threat_detected = False
    
    for url in unique_urls:
        try:
            url_res = analyze_url(url)
            url_reuse_results.append({
                "url": url,
                "score": url_res["score"],
                "status": url_res["status"],
                "reasons": url_res["reasons"]
            })
            if url_res["score"] >= 30:
                url_threat_detected = True
                # Propagate URL risks into email analysis
                risk_score += min(url_res["score"], 30)
                for r in url_res["reasons"]:
                    reasons.append(f"Extracted URL ({url}) risk: {r}")
        except Exception:
            pass

    parameters["url_analyzer_reuse"] = {
        "results": url_reuse_results,
        "threat_detected": url_threat_detected,
        "status": "Dangerous" if url_threat_detected else "Safe"
    }

    # 7. Display Name Mismatch (Spoofing)
    mismatch_detected = False
    mismatch_detail = ""

    if display_name:
        display_name_lower = display_name.lower()
        for brand, official_domains in BRAND_DOMAINS.items():
            if brand in display_name_lower:
                # Brand is mentioned in display name. Verify if domain matches official brand domains.
                matched = False
                for official_dom in official_domains:
                    if domain == official_dom or domain.endswith("." + official_dom):
                        matched = True
                        break
                if not matched:
                    mismatch_detected = True
                    mismatch_detail = f"Display name contains '{brand.capitalize()}' but sender domain '{domain}' is not official"
                    break

    parameters["display_name_mismatch"] = {
        "display_name": display_name,
        "email_address": email_address,
        "mismatch_detected": mismatch_detected,
        "details": mismatch_detail,
        "status": "Dangerous (Spoofing)" if mismatch_detected else "Safe"
    }
    if mismatch_detected:
        risk_score += 35
        reasons.append(mismatch_detail)

    # -----------------------------------------------------------------------
    # Capitalization & Punctuation checks (Legacy support - adds minor points)
    # -----------------------------------------------------------------------
    uppercase_words = 0
    for word in (subject + " " + body).split():
        if len(word) > 3 and word.isupper():
            uppercase_words += 1
    if uppercase_words >= 3:
        risk_score += 5
        reasons.append("Excessive capitalized words in email text")

    if "!!!" in body:
        risk_score += 5
        reasons.append("Excessive exclamation marks in email body")

    # Clamping and standard verdicts
    risk_score = min(risk_score, 100)

    if risk_score >= 60:
        verdict = "Dangerous"
    elif risk_score >= 30:
        verdict = "Suspicious"
    else:
        verdict = "Safe"

    return {
        "risk_score": risk_score,
        "reasons": reasons,
        "verdict": verdict,
        "parameters": parameters
    }
