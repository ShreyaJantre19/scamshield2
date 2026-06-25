"""
whatsapp.py — WhatsApp Cloud API Webhook Router

Handles:
  GET  /whatsapp/webhook  — Meta webhook verification (hub.challenge handshake)
  POST /whatsapp/webhook  — Incoming message processing

Supports:
  - Text messages → URL extraction → /analyze
  - Image messages → download → QR decode attempt → /analyze
  - Document messages → download → file analysis → /analyze
"""

import os
import uuid
import asyncio
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query, Request
from fastapi.responses import PlainTextResponse

from services.fusion_service import fused_analyze
from services.whatsapp_service import (
    download_media,
    extract_urls_from_text,
    format_verdict,
    send_typing_indicator,
    send_whatsapp_message,
)

router = APIRouter()

# ---------------------------------------------------------------------------
# Load credentials from environment
# ---------------------------------------------------------------------------

WHATSAPP_ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN", "")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
WHATSAPP_VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "scamshield_verify")

TEMP_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "temp"))

# ---------------------------------------------------------------------------
# GET /whatsapp/webhook — Meta verification handshake
# ---------------------------------------------------------------------------

@router.get("/webhook")
async def verify_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
):
    """
    Meta sends a GET request with hub.mode=subscribe and hub.verify_token.
    We must respond with hub.challenge to confirm ownership.
    """
    if hub_mode == "subscribe" and hub_verify_token == WHATSAPP_VERIFY_TOKEN:
        print(f"[WhatsApp] Webhook verified ✓")
        return PlainTextResponse(content=hub_challenge or "")

    raise HTTPException(status_code=403, detail="Webhook verification failed")


# ---------------------------------------------------------------------------
# POST /whatsapp/webhook — Incoming messages
# ---------------------------------------------------------------------------

@router.post("/webhook")
async def receive_message(request: Request, background_tasks: BackgroundTasks):
    """
    Meta posts all incoming WhatsApp events here.
    We acknowledge immediately with 200 OK and process in background.
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    # Acknowledge receipt immediately (Meta requires 200 within 20s)
    background_tasks.add_task(_process_webhook_body, body)
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Background processing
# ---------------------------------------------------------------------------

async def _process_webhook_body(body: dict):
    """Parse the Meta webhook payload and dispatch to appropriate handler."""
    try:
        entry = body.get("entry", [{}])[0]
        changes = entry.get("changes", [{}])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])

        if not messages:
            return  # Status update or other non-message event

        for message in messages:
            msg_type = message.get("type")
            from_number = message.get("from", "")
            msg_id = message.get("id", "")

            # Mark as read
            send_typing_indicator(from_number, msg_id, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID)

            if msg_type == "text":
                await _handle_text_message(from_number, message)
            elif msg_type == "image":
                await _handle_image_message(from_number, message)
            elif msg_type in ("document", "video", "audio"):
                await _handle_document_message(from_number, message, msg_type)
            else:
                _reply(from_number, (
                    "🛡️ *ScamShield*\n\n"
                    "I can analyze:\n"
                    "• 🔗 URLs / suspicious links (send as text)\n"
                    "• 📷 QR code screenshots (send as image)\n"
                    "• 📎 Suspicious files (send as document)\n"
                    "• 📧 Email content (paste text with 'From:', 'Subject:', 'Body:')\n\n"
                    "Just forward me the suspicious content!"
                ))

    except Exception as e:
        print(f"[WhatsApp] Error processing webhook: {e}")


async def _handle_text_message(from_number: str, message: dict):
    """Handle incoming text — try URL extraction, then email parsing, then generic text."""
    text = message.get("text", {}).get("body", "").strip()
    if not text:
        return

    # 1. Check if message is a help request
    if text.lower() in ("hi", "hello", "help", "start", "/help", "?"):
        _reply(from_number, (
            "👋 *Welcome to ScamShield Bot!*\n\n"
            "I help you identify scams, phishing links, and suspicious content.\n\n"
            "*How to use:*\n"
            "• Send a URL → I'll check it for phishing/scam indicators\n"
            "• Send an email body → I'll analyze it for scam patterns\n"
            "• Send a QR code screenshot → I'll decode and analyze it\n"
            "• Send a suspicious file → I'll scan it for malware indicators\n\n"
            "Simply forward me any suspicious message! 🛡️"
        ))
        return

    # 2. Try to extract URLs from the text
    urls = extract_urls_from_text(text)

    if urls:
        # Analyze first URL found (and mention if multiple)
        primary_url = urls[0]
        try:
            result = fused_analyze(analyze_type="url", url=primary_url)
            verdict_text = format_verdict(result, content_preview=primary_url)
            if len(urls) > 1:
                verdict_text += f"\n\n📌 _{len(urls) - 1} more URL(s) found in message. Send them individually for analysis._"
        except Exception as e:
            verdict_text = f"❌ Analysis failed: {str(e)}"
        _reply(from_number, verdict_text)
        return

    # 3. Try email heuristic — look for "From:", "Subject:", "Body:" pattern
    text_lower = text.lower()
    if "from:" in text_lower or "subject:" in text_lower:
        sender, subject, body = _parse_email_from_text(text)
        if sender:
            try:
                result = fused_analyze(
                    analyze_type="email",
                    sender=sender,
                    subject=subject,
                    body=body,
                )
                verdict_text = format_verdict(result, content_preview=f"Email from {sender}")
            except Exception as e:
                verdict_text = f"❌ Analysis failed: {str(e)}"
            _reply(from_number, verdict_text)
            return

    # 4. Generic text — look for suspicious keywords in the raw text
    # Treat the whole message as an email body with no sender for partial analysis
    try:
        result = fused_analyze(
            analyze_type="email",
            sender="unknown@unknown.com",
            subject="",
            body=text,
        )
        verdict_text = format_verdict(result, content_preview=text[:60])
        # Prepend context note
        verdict_text = "📝 *Analyzing text content…*\n\n" + verdict_text
    except Exception as e:
        verdict_text = f"❌ Could not analyze text: {str(e)}"
    _reply(from_number, verdict_text)


async def _handle_image_message(from_number: str, message: dict):
    """Handle image — attempt QR decode, then analyze."""
    media_id = message.get("image", {}).get("id", "")
    if not media_id:
        _reply(from_number, "❌ Could not retrieve image. Please try again.")
        return

    _reply(from_number, "🔍 *Analyzing image…* Please wait.")

    os.makedirs(TEMP_DIR, exist_ok=True)
    dest = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.jpg")

    try:
        success = download_media(media_id, WHATSAPP_ACCESS_TOKEN, dest)
        if not success:
            _reply(from_number, "❌ Failed to download image. Make sure the image is not too large.")
            return

        result = fused_analyze(
            analyze_type="qr",
            file_path=dest,
            filename="image.jpg",
            content_type="image/jpeg",
        )

        # Check if QR was actually found
        qr_sub = result.get("sub_results", {}).get("qr", {})
        if not qr_sub:
            _reply(from_number, (
                "🤔 *No QR code detected* in the image.\n\n"
                "If you meant to share a QR code, please ensure the image is clear and well-lit.\n"
                "You can also send the URL as text directly."
            ))
            return

        verdict_text = format_verdict(result, content_preview="QR code image")
        _reply(from_number, verdict_text)

    except Exception as e:
        _reply(from_number, f"❌ Analysis error: {str(e)}")
    finally:
        if os.path.exists(dest):
            try:
                os.remove(dest)
            except Exception:
                pass


async def _handle_document_message(from_number: str, message: dict, msg_type: str):
    """Handle document/file — download and run file analysis."""
    doc_data = message.get(msg_type, message.get("document", {}))
    media_id = doc_data.get("id", "")
    filename = doc_data.get("filename", f"file_{uuid.uuid4().hex[:8]}")
    mime_type = doc_data.get("mime_type", "application/octet-stream")

    if not media_id:
        _reply(from_number, "❌ Could not retrieve file. Please try again.")
        return

    _reply(from_number, f"🔍 *Analyzing file:* `{filename}`… Please wait.")

    os.makedirs(TEMP_DIR, exist_ok=True)
    dest = os.path.join(TEMP_DIR, f"{uuid.uuid4()}_{filename}")

    try:
        success = download_media(media_id, WHATSAPP_ACCESS_TOKEN, dest)
        if not success:
            _reply(from_number, "❌ Failed to download file. Please try again.")
            return

        result = fused_analyze(
            analyze_type="file",
            file_path=dest,
            filename=filename,
            content_type=mime_type,
        )
        verdict_text = format_verdict(result, content_preview=filename)
        _reply(from_number, verdict_text)

    except Exception as e:
        _reply(from_number, f"❌ Analysis error: {str(e)}")
    finally:
        if os.path.exists(dest):
            try:
                os.remove(dest)
            except Exception:
                pass


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _reply(to: str, text: str):
    """Send a WhatsApp reply. Truncates if too long (WhatsApp limit: 4096 chars)."""
    if len(text) > 4000:
        text = text[:3997] + "…"
    send_whatsapp_message(to, text, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID)


def _parse_email_from_text(text: str) -> tuple[str, str, str]:
    """
    Try to extract From/Subject/Body from a pasted email text.
    Handles formats like:
      From: support@paypal.com
      Subject: Your account is suspended
      Body: Click here to verify...
    """
    import re
    sender = ""
    subject = ""
    body = ""

    from_match = re.search(r"from\s*:\s*(.+)", text, re.IGNORECASE)
    subject_match = re.search(r"subject\s*:\s*(.+)", text, re.IGNORECASE)
    body_match = re.search(r"body\s*:\s*(.+)", text, re.IGNORECASE | re.DOTALL)

    if from_match:
        sender = from_match.group(1).strip().split("\n")[0]
    if subject_match:
        subject = subject_match.group(1).strip().split("\n")[0]
    if body_match:
        body = body_match.group(1).strip()
    elif sender:
        # If no explicit body label, use everything after subject line
        lines = text.split("\n")
        capture = False
        body_lines = []
        for line in lines:
            if capture:
                body_lines.append(line)
            if re.match(r"subject\s*:", line, re.IGNORECASE):
                capture = True
        body = "\n".join(body_lines).strip()

    return sender, subject, body
