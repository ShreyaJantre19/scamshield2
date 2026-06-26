"""
fusion_service.py — ScamShield Orchestration & Correlation Engine

Chains all four analyzers (URL, Email, QR, File), applies weighted fusion scoring,
and fires correlation bonus rules to escalate risk when multiple red flags co-occur.
"""

import io
import os
import uuid
import tempfile
from typing import Optional

# pyrefly: ignore [missing-import]
from services.url_service import analyze_url
# pyrefly: ignore [missing-import]
from services.email_service import analyze_email
# pyrefly: ignore [missing-import]
from services.qr_service import decode_qr, detect_qr_type, analyze_qr_risks
# pyrefly: ignore [missing-import]
from services.file_service import analyze_file as _analyze_file
# pyrefly: ignore [missing-import]
from services.ai_service import generate_explanation

# ---------------------------------------------------------------------------
# Scoring weights for each sub-analyzer
# ---------------------------------------------------------------------------

WEIGHTS = {
    "url":   1.0,
    "email": 1.0,
    "qr":    0.9,
    "file":  1.0,
}

# ---------------------------------------------------------------------------
# Risk-level thresholds (unified across the system)
# ---------------------------------------------------------------------------

def score_to_level(score: int) -> str:
    if score >= 60:
        return "Dangerous"
    elif score >= 30:
        return "Suspicious"
    return "Safe"


def score_to_emoji(score: int) -> str:
    if score >= 60:
        return "🔴"
    elif score >= 30:
        return "🟡"
    return "🟢"


# ---------------------------------------------------------------------------
# Correlation bonus rule helpers
# ---------------------------------------------------------------------------

def _has_urgency(signals: list) -> bool:
    return any(s["name"] == "urgency_keywords" and s["score"] > 0 for s in signals)


def _has_typosquatting(signals: list) -> bool:
    return any("typosquat" in s["name"].lower() and s["score"] > 0 for s in signals)


def _has_credential_keywords(signals: list) -> bool:
    return any(s["name"] == "credential_keywords" and s["score"] > 0 for s in signals)


def _has_qr_url(signals: list) -> bool:
    return any(s["name"] in ("qr_url_risk", "qr_analysis") and s["score"] > 0 for s in signals)


def _has_url_risk(signals: list) -> bool:
    return any(s["name"] in ("url_analysis", "qr_url_risk") and s["score"] > 0 for s in signals)


def _apply_correlation_bonuses(signals: list, weighted_score: float) -> tuple[float, list]:
    """
    Apply cross-analyzer correlation bonuses and return (adjusted_score, bonus_signals).
    """
    bonus_signals = []
    bonus_score = 0.0

    # Rule 1: Urgency language + any URL/QR risk → phishing pressure tactic combo
    if _has_urgency(signals) and _has_url_risk(signals):
        bonus = 15
        bonus_score += bonus
        bonus_signals.append({
            "name": "correlation:urgency+url",
            "score": bonus,
            "detail": "Urgency language combined with suspicious URL — classic phishing pressure tactic"
        })

    # Rule 2: Typosquatting + credential keywords → high-confidence credential theft
    if _has_typosquatting(signals) and _has_credential_keywords(signals):
        bonus = 20
        bonus_score += bonus
        bonus_signals.append({
            "name": "correlation:typosquat+credentials",
            "score": bonus,
            "detail": "Brand impersonation combined with credential-theft keywords — very high confidence phishing"
        })

    # Rule 3: Urgency + QR URL → QR phishing escalation
    if _has_urgency(signals) and _has_qr_url(signals):
        bonus = 15
        bonus_score += bonus
        bonus_signals.append({
            "name": "correlation:urgency+qr",
            "score": bonus,
            "detail": "QR code leading to suspicious URL paired with urgency language — escalated risk"
        })

    # Rule 4: Triple threat — urgency + QR + typosquatting → force Dangerous tier
    if _has_urgency(signals) and _has_qr_url(signals) and _has_typosquatting(signals):
        # Force score above Dangerous threshold
        if weighted_score + bonus_score < 60:
            extra = 60 - (weighted_score + bonus_score) + 5
            bonus_score += extra
            bonus_signals.append({
                "name": "correlation:triple_threat",
                "score": int(extra),
                "detail": "Triple red flag: urgency language + QR code + brand impersonation. Risk tier escalated to Dangerous."
            })

    return bonus_score, bonus_signals


# ---------------------------------------------------------------------------
# Individual analyzer wrappers — each returns (sub_result_dict, signals_list)
# ---------------------------------------------------------------------------

def _run_url(url: str) -> tuple[dict, list]:
    result = analyze_url(url)
    score = result.get("score", 0)
    signals = []

    if score > 0:
        signals.append({
            "name": "url_analysis",
            "score": score,
            "detail": "; ".join(result.get("reasons", [])) or "URL risk detected"
        })

    # Individual fine-grained signals from reasons
    for reason in result.get("reasons", []):
        r_lower = reason.lower()
        if "typosquat" in r_lower or "impersonat" in r_lower:
            signals.append({"name": "typosquatting", "score": 30, "detail": reason})
        elif "https" in r_lower:
            signals.append({"name": "no_https", "score": 20, "detail": reason})

    return result, signals


def _run_email(sender: str, subject: str, body: str) -> tuple[dict, list]:
    result = analyze_email(sender, subject, body)
    signals = []
    params = result.get("parameters", {})

    # Map parameters to named signals
    urgency = params.get("urgency_keywords", {})
    if urgency.get("score", 0) > 0:
        signals.append({
            "name": "urgency_keywords",
            "score": urgency["score"],
            "detail": "Urgency/pressure phrases: " + ", ".join(urgency.get("keywords_found", []))
        })

    cred = params.get("credential_keywords", {})
    if cred.get("score", 0) > 0:
        signals.append({
            "name": "credential_keywords",
            "score": cred["score"],
            "detail": "Credential-theft keywords: " + ", ".join(cred.get("keywords_found", []))
        })

    typo = params.get("typosquatting", {})
    if typo.get("detected"):
        signals.append({
            "name": "typosquatting",
            "score": 30,
            "detail": f"Brand impersonation: {typo.get('brand_impersonated', 'unknown')}"
        })

    mismatch = params.get("display_name_mismatch", {})
    if mismatch.get("mismatch_detected"):
        signals.append({
            "name": "sender_spoofing",
            "score": 35,
            "detail": mismatch.get("details", "Sender display name does not match domain")
        })

    url_reuse = params.get("url_analyzer_reuse", {})
    if url_reuse.get("threat_detected"):
        signals.append({
            "name": "url_analysis",
            "score": min(sum(r.get("score", 0) for r in url_reuse.get("results", [])), 30),
            "detail": f"Suspicious URLs found in email: {', '.join(r['url'] for r in url_reuse.get('results', []))}"
        })

    return result, signals


def _run_qr_from_path(image_path: str) -> tuple[dict, list, Optional[str]]:
    """Decode QR from a file path, analyze it, return (result, signals, decoded_url)."""
    content = decode_qr(image_path)
    if content is None:
        return {}, [], None

    qr_type = detect_qr_type(content)
    result = analyze_qr_risks(qr_type, content)
    score = result.get("score", 0)
    signals = []

    if score > 0:
        signal_name = "qr_url_risk" if qr_type == "URL" else "qr_analysis"
        signals.append({
            "name": signal_name,
            "score": score,
            "detail": f"QR payload ({qr_type}): " + "; ".join(result.get("reasons", []))
        })

    # Bubble up URL-level typosquatting from QR
    for reason in result.get("reasons", []):
        if "typosquat" in reason.lower() or "impersonat" in reason.lower():
            signals.append({"name": "typosquatting", "score": 30, "detail": reason})

    decoded_url = content if qr_type == "URL" else None
    return result, signals, decoded_url


def _run_file(filename: str, file_path: str, content_type: str = None) -> tuple[dict, list]:
    result = _analyze_file(filename, file_path, content_type)
    score = result.get("score", 0)
    signals = []
    params = result.get("parameters", {})

    if params.get("file_extension", {}).get("is_executable"):
        signals.append({
            "name": "executable_file",
            "score": 40,
            "detail": f"Executable file extension: {params['file_extension'].get('extension', '')}"
        })

    if params.get("double_extension", {}).get("has_double_extension"):
        signals.append({
            "name": "double_extension",
            "score": 40,
            "detail": f"Double extension detected: {params['double_extension'].get('detected', '')}"
        })

    if params.get("macro_detection", {}).get("macros_detected"):
        signals.append({
            "name": "macro_detected",
            "score": 30,
            "detail": "Embedded macros found in Office document"
        })

    if params.get("mime_type", {}).get("mismatch_detected"):
        signals.append({
            "name": "mime_mismatch",
            "score": 50,
            "detail": f"File type mismatch: declared vs actual format differ"
        })

    if params.get("archive_detection", {}).get("hidden_payloads"):
        signals.append({
            "name": "hidden_payload",
            "score": 35,
            "detail": f"Hidden executables in archive: {', '.join(params['archive_detection']['hidden_payloads'])}"
        })

    if params.get("pdf_indicators", {}).get("active_indicators"):
        signals.append({
            "name": "pdf_active_content",
            "score": 25,
            "detail": f"Active PDF content: {', '.join(params['pdf_indicators']['active_indicators'])}"
        })

    if not signals and score > 0:
        signals.append({
            "name": "file_risk",
            "score": score,
            "detail": "; ".join(result.get("reasons", []))
        })

    return result, signals


# ---------------------------------------------------------------------------
# Main unified analyze function
# ---------------------------------------------------------------------------

def fused_analyze(
    analyze_type: str,
    # URL
    url: Optional[str] = None,
    # Email
    sender: Optional[str] = None,
    subject: Optional[str] = None,
    body: Optional[str] = None,
    # File / QR  (path to a saved temp file)
    file_path: Optional[str] = None,
    filename: Optional[str] = None,
    content_type: Optional[str] = None,
) -> dict:
    """
    Unified analysis entry point. Orchestrates all sub-analyzers, applies
    chaining (email→URL, file→QR→URL), and computes a fused risk verdict.

    Returns:
        {
          "risk_score": int,
          "risk_level": str,
          "signals": list[dict],
          "explanation": str,
          "sub_results": dict
        }
    """
    all_signals = []
    sub_results = {}
    weighted_sub_scores = []

    t = analyze_type.lower()

    # ------------------------------------------------------------------ URL
    if t == "url":
        if not url:
            raise ValueError("'url' field required for type='url'")
        result, signals = _run_url(url)
        all_signals.extend(signals)
        sub_results["url"] = result
        weighted_sub_scores.append(result.get("score", 0) * WEIGHTS["url"])

    # ------------------------------------------------------------------ EMAIL
    elif t == "email":
        if not sender:
            raise ValueError("'sender' field required for type='email'")
        result, signals = _run_email(sender, subject or "", body or "")
        all_signals.extend(signals)
        sub_results["email"] = result
        weighted_sub_scores.append(result.get("risk_score", 0) * WEIGHTS["email"])

        # Chain: also check any URLs extracted from the email body
        extracted_urls = result.get("parameters", {}).get("url_extraction", {}).get("urls_found", [])
        for eu in extracted_urls[:3]:  # cap at 3 URLs to avoid slow-downs
            url_result, url_signals = _run_url(eu)
            all_signals.extend(url_signals)
            sub_results.setdefault("chained_urls", []).append({"url": eu, **url_result})

    # ------------------------------------------------------------------ QR
    elif t == "qr":
        if not file_path:
            raise ValueError("'file_path' required for type='qr'")
        result, signals, decoded_url = _run_qr_from_path(file_path)
        all_signals.extend(signals)
        sub_results["qr"] = result
        if result:
            weighted_sub_scores.append(result.get("score", 0) * WEIGHTS["qr"])

        # Chain: if QR decoded a URL, run URL analyzer on it too
        if decoded_url:
            url_result, url_signals = _run_url(decoded_url)
            # Augment QR signal with chained URL score
            all_signals.extend(url_signals)
            sub_results["chained_url"] = {"url": decoded_url, **url_result}
            chained_score = url_result.get("score", 0) * WEIGHTS["url"]
            weighted_sub_scores.append(chained_score * 0.5)  # half-weight for chained QR→URL

    # ------------------------------------------------------------------ FILE
    elif t == "file":
        if not file_path:
            raise ValueError("'file_path' required for type='file'")
        result, signals = _run_file(filename or os.path.basename(file_path), file_path, content_type)
        all_signals.extend(signals)
        sub_results["file"] = result
        weighted_sub_scores.append(result.get("score", 0) * WEIGHTS["file"])

        # Chain: attempt QR decode on image files
        img_exts = {".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp"}
        ext = os.path.splitext(filename or file_path)[1].lower()
        if ext in img_exts:
            qr_result, qr_signals, decoded_url = _run_qr_from_path(file_path)
            if qr_result:
                all_signals.extend(qr_signals)
                sub_results["chained_qr"] = qr_result
                weighted_sub_scores.append(qr_result.get("score", 0) * WEIGHTS["qr"])

                if decoded_url:
                    url_result, url_signals = _run_url(decoded_url)
                    all_signals.extend(url_signals)
                    sub_results["chained_qr_url"] = {"url": decoded_url, **url_result}

    else:
        raise ValueError(f"Unknown analyze type: '{analyze_type}'. Must be one of: url, email, qr, file")

    # ------------------------------------------------------------------ Fusion
    # Base weighted average score
    if weighted_sub_scores:
        raw_score = sum(weighted_sub_scores) / len(weighted_sub_scores)
    else:
        raw_score = 0.0

    # Deduplicate signals by name (keep highest scoring instance)
    seen = {}
    for sig in all_signals:
        name = sig["name"]
        if name not in seen or sig["score"] > seen[name]["score"]:
            seen[name] = sig
    deduped_signals = sorted(seen.values(), key=lambda s: s["score"], reverse=True)

    # Apply correlation bonuses
    bonus_score, bonus_signals = _apply_correlation_bonuses(deduped_signals, raw_score)
    final_score = min(int(raw_score + bonus_score), 100)
    deduped_signals.extend(bonus_signals)

    risk_level = score_to_level(final_score)
    explanation = generate_explanation(final_score, [s["detail"] for s in deduped_signals[:5]])

    return {
        "risk_score": final_score,
        "risk_level": risk_level,
        "signals": deduped_signals,
        "explanation": explanation,
        "sub_results": sub_results,
    }
