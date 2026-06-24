"""
whatsapp_service.py — ScamShield WhatsApp Cloud API Helpers

Handles:
  - Downloading media (images, documents) from Meta Graph API
  - Formatting analysis results into WhatsApp-friendly plain text
  - Sending reply messages via Meta WhatsApp Cloud API
"""

import os
import re
import requests
from typing import Optional


# ---------------------------------------------------------------------------
# Meta Graph API constants
# ---------------------------------------------------------------------------

GRAPH_API_VERSION = "v19.0"
GRAPH_BASE = f"https://graph.facebook.com/{GRAPH_API_VERSION}"


# ---------------------------------------------------------------------------
# Media download
# ---------------------------------------------------------------------------

def get_media_url(media_id: str, access_token: str) -> Optional[str]:
    """Retrieve the download URL for a media object by ID."""
    try:
        resp = requests.get(
            f"{GRAPH_BASE}/{media_id}",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json().get("url")
    except Exception as e:
        print(f"[WhatsApp] Failed to get media URL for {media_id}: {e}")
        return None


def download_media(media_id: str, access_token: str, dest_path: str) -> bool:
    """Download a media file from Meta CDN and save to dest_path. Returns True on success."""
    media_url = get_media_url(media_id, access_token)
    if not media_url:
        return False
    try:
        resp = requests.get(
            media_url,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=30,
            stream=True,
        )
        resp.raise_for_status()
        with open(dest_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"[WhatsApp] Failed to download media {media_id}: {e}")
        return False


# ---------------------------------------------------------------------------
# URL extraction from text
# ---------------------------------------------------------------------------

def extract_urls_from_text(text: str) -> list[str]:
    """Extract all http/https URLs from a plain text string."""
    pattern = r"https?://[^\s\"'<>]+"
    return list(set(re.findall(pattern, text)))


# ---------------------------------------------------------------------------
# Verdict formatter — converts unified JSON result → WhatsApp plain text
# ---------------------------------------------------------------------------

LEVEL_EMOJI = {
    "Dangerous": "🔴",
    "Suspicious": "🟡",
    "Safe": "🟢",
}

LEVEL_ADVICE = {
    "Dangerous": (
        "⛔ *Do NOT click any links, scan QR codes, or share personal information* "
        "related to this message. It appears to be a scam or phishing attempt."
    ),
    "Suspicious": (
        "⚠️ This content has some suspicious characteristics. "
        "Proceed with caution and verify through official channels before taking action."
    ),
    "Safe": (
        "✅ No major threats detected. However, always stay cautious online "
        "and avoid sharing sensitive information unless you are certain of the source."
    ),
}


def format_verdict(result: dict, content_preview: str = "") -> str:
    """
    Convert a fused_analyze() result dict into a formatted WhatsApp message.
    """
    score = result.get("risk_score", 0)
    level = result.get("risk_level", "Safe")
    signals = result.get("signals", [])
    explanation = result.get("explanation", "")
    emoji = LEVEL_EMOJI.get(level, "⚪")

    lines = [
        "🛡️ *ScamShield Analysis*",
        "",
        f"Risk Level: {emoji} *{level.upper()}* (Score: {score}/100)",
    ]

    if content_preview:
        preview = content_preview[:80] + ("…" if len(content_preview) > 80 else "")
        lines += ["", f"📋 Content: _{preview}_"]

    # Red flags section
    top_signals = [s for s in signals if not s["name"].startswith("correlation:")][:5]
    if top_signals:
        lines += ["", "⚠️ *Red Flags Detected:*"]
        for sig in top_signals:
            detail = sig.get("detail", sig["name"])
            # Truncate long details
            if len(detail) > 100:
                detail = detail[:97] + "…"
            lines.append(f"  • {detail}")

    # Correlation bonuses — show as insight
    correlation_signals = [s for s in signals if s["name"].startswith("correlation:")]
    if correlation_signals:
        lines += ["", "🔗 *Combined Risk Patterns:*"]
        for sig in correlation_signals:
            lines.append(f"  • {sig.get('detail', '')}")

    # Advice
    advice = LEVEL_ADVICE.get(level, "")
    if advice:
        lines += ["", advice]

    lines += ["", "─────────────────", "Powered by ScamShield 🛡️"]

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Send WhatsApp message via Cloud API
# ---------------------------------------------------------------------------

def send_whatsapp_message(
    to: str,
    text: str,
    access_token: str,
    phone_number_id: str,
) -> bool:
    """
    Send a plain text WhatsApp message via Meta Cloud API.
    `to` should be the full phone number with country code (e.g. "919876543210").
    Returns True on success.
    """
    url = f"{GRAPH_BASE}/{phone_number_id}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": text,
        },
    }
    try:
        resp = requests.post(
            url,
            json=payload,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            timeout=10,
        )
        resp.raise_for_status()
        return True
    except Exception as e:
        print(f"[WhatsApp] Failed to send message to {to}: {e}")
        return False


def send_typing_indicator(
    to: str,
    message_id: str,
    access_token: str,
    phone_number_id: str,
) -> None:
    """Mark the incoming message as read (shows double-tick and typing feel)."""
    url = f"{GRAPH_BASE}/{phone_number_id}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "status": "read",
        "message_id": message_id,
    }
    try:
        requests.post(
            url,
            json=payload,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=5,
        )
    except Exception:
        pass
