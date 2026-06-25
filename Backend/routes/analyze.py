"""
analyze.py — Unified /analyze endpoint for ScamShield

Accepts all analyzer types via a single POST /analyze endpoint.
Text inputs (url, email) accept JSON body.
Binary inputs (qr, file) accept multipart/form-data.
"""

import os
import uuid
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.database import get_db
from crud.scan_crud import create_scan
from services.fusion_service import fused_analyze

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic models for JSON body inputs
# ---------------------------------------------------------------------------

class URLAnalyzeRequest(BaseModel):
    type: str  # "url"
    url: str


class EmailAnalyzeRequest(BaseModel):
    type: str  # "email"
    sender: str
    subject: Optional[str] = ""
    body: Optional[str] = ""


# ---------------------------------------------------------------------------
# /analyze endpoint — JSON (url / email)
# ---------------------------------------------------------------------------

@router.post("/analyze")
async def analyze_endpoint(
    # ------ JSON body for url/email ------
    request_body: Optional[dict] = None,

    # ------ Multipart form fields for qr/file ------
    type: Optional[str] = Form(None),
    sender: Optional[str] = Form(None),
    subject: Optional[str] = Form(None),
    body: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db),
):
    """
    Unified analysis endpoint. Supports:
      - JSON: { "type": "url", "url": "https://..." }
      - JSON: { "type": "email", "sender": "...", "subject": "...", "body": "..." }
      - Multipart: type=qr + file upload
      - Multipart: type=file + file upload
    """
    # Resolve analyze_type from form field (multipart) or body
    analyze_type = type
    saved_path = None

    try:
        # ---------- Handle file / qr (multipart) ----------
        if file is not None:
            if not analyze_type:
                raise HTTPException(status_code=400, detail="'type' form field required when uploading a file")
            if analyze_type not in ("qr", "file"):
                raise HTTPException(status_code=400, detail="File upload only valid for type='qr' or type='file'")

            # Save temp file
            ext = os.path.splitext(file.filename)[1] if file.filename else ".bin"
            os.makedirs(os.path.join(os.path.dirname(__file__), "..", "temp"), exist_ok=True)
            saved_path = os.path.join(
                os.path.dirname(__file__), "..", "temp", f"{uuid.uuid4()}{ext}"
            )
            saved_path = os.path.normpath(saved_path)
            with open(saved_path, "wb") as f_out:
                f_out.write(await file.read())

            result = fused_analyze(
                analyze_type=analyze_type,
                file_path=saved_path,
                filename=file.filename,
                content_type=file.content_type,
            )

        # ---------- Handle url / email (form fields or JSON) ----------
        elif analyze_type == "url":
            if not url:
                raise HTTPException(status_code=400, detail="'url' field required for type='url'")
            result = fused_analyze(analyze_type="url", url=url)

        elif analyze_type == "email":
            if not sender:
                raise HTTPException(status_code=400, detail="'sender' field required for type='email'")
            result = fused_analyze(
                analyze_type="email",
                sender=sender,
                subject=subject or "",
                body=body or "",
            )

        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid or missing 'type'. Must be: url | email | qr | file"
            )

        # ---------- Save to DB ----------
        input_summary = (
            url or
            (f"From: {sender}" if sender else None) or
            (file.filename if file else "unknown")
        )
        create_scan(
            db=db,
            scan_type=analyze_type.upper(),
            input_data=input_summary or "",
            score=result["risk_score"],
            status=result["risk_level"],
        )

        return result

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    finally:
        # Clean up temp file
        if saved_path and os.path.exists(saved_path):
            try:
                os.remove(saved_path)
            except Exception:
                pass


# ---------------------------------------------------------------------------
# JSON-only convenience endpoint (no file upload, simpler for extension/bot)
# ---------------------------------------------------------------------------

class UnifiedJSONRequest(BaseModel):
    type: str
    url: Optional[str] = None
    sender: Optional[str] = None
    subject: Optional[str] = None
    body: Optional[str] = None


@router.post("/analyze/json")
async def analyze_json(
    request: UnifiedJSONRequest,
    db: Session = Depends(get_db),
):
    """
    JSON-only /analyze/json endpoint for URL and Email analysis.
    The browser extension and WhatsApp bot use this for text content.
    """
    try:
        if request.type == "url":
            if not request.url:
                raise HTTPException(status_code=400, detail="'url' required")
            result = fused_analyze(analyze_type="url", url=request.url)
            input_summary = request.url

        elif request.type == "email":
            if not request.sender:
                raise HTTPException(status_code=400, detail="'sender' required")
            result = fused_analyze(
                analyze_type="email",
                sender=request.sender,
                subject=request.subject or "",
                body=request.body or "",
            )
            input_summary = f"From: {request.sender}"

        else:
            raise HTTPException(status_code=400, detail="JSON endpoint only supports type: url | email")

        create_scan(
            db=db,
            scan_type=request.type.upper(),
            input_data=input_summary,
            score=result["risk_score"],
            status=result["risk_level"],
        )

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
