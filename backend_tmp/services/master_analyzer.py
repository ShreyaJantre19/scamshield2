from Backend.services.url_analyzer import analyze_url
# pyrefly: ignore [missing-import]
from Backend.services.url_shortener_detector import detect_shortener
from Backend.services.virustotal_service import check_url_virustotal
from Backend.services.safe_browsing_service import check_safe_browsing
# pyrefly: ignore [missing-import]
from Backend.services.phishtank_service import check_phishtank
# pyrefly: ignore [missing-import]
from Backend.services.openphish_service import check_openphish
from Backend.services.explanation_generator import generate_explanation


def master_analyze(url):

    result = analyze_url(url)

    score = result["score"]

    reasons = result["reasons"]

    # URL Shortener Detection

    shortener_result = detect_shortener(url)

    if shortener_result["detected"]:

        score += 15

        reasons.append(
            f"URL shortener detected ({shortener_result['service']})"
        )

    # VirusTotal

    vt_result = check_url_virustotal(url)

    if vt_result["malicious"] is not None:

        if vt_result["malicious"] > 0:

            score += 40

            reasons.append(
                f"VirusTotal flagged by {vt_result['malicious']} engines"
            )

        elif vt_result["suspicious"] > 0:

            score += 20

            reasons.append(
                f"VirusTotal suspicious detections: {vt_result['suspicious']}"
            )

    # Google Safe Browsing

    gsb_result = check_safe_browsing(url)

    if "matches" in gsb_result:

        score += 50

        reasons.append(
            "Google Safe Browsing detected threats"
        )

    # PhishTank

    phishtank_result = check_phishtank(url)

    try:

        if phishtank_result["results"]["valid"]:

            score += 50

            reasons.append(
                "URL found in PhishTank database"
            )

    except:

        pass

    # OpenPhish

    if check_openphish(url):

        score += 50

        reasons.append(
            "URL found in OpenPhish feed"
        )

    score = min(score, 100)

    if score < 30:

        level = "SAFE"

    elif score < 60:

        level = "SUSPICIOUS"

    else:

        level = "DANGEROUS"

    explanation = generate_explanation(

        score,

        reasons

    )

    return {

        "score": score,

        "level": level,

        "reasons": reasons,

        "explanation": explanation,

        "domain_age":
        result.get(
            "domain_age"
        ),

        "typosquatting":
        result.get(
            "typosquatting"
        ),

        "ssl_info":
        result.get(
            "ssl_info"
        ),

        "redirect_info":
        result.get(
            "redirect_info"
        ),

        "url_shortener":
        shortener_result,

        "virustotal":
        vt_result,

        "safe_browsing":
        gsb_result
 
    }  