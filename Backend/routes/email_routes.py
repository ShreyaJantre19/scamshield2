# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from sqlalchemy.orm import Session

from Backend.services.master_email_analyzer import master_email_analyze
from Backend.database.database import get_db
from Backend.crud.scan_crud import create_scan

router = APIRouter()


class EmailRequest(BaseModel):
    from_email: str
    reply_to: str
    subject: str
    body: str


@router.post("/scan/email")
@router.post("/email/analyze")
def scan_email(data: EmailRequest, db: Session = Depends(get_db)):
    result = master_email_analyze(
        data.from_email,
        data.reply_to,
        data.subject,
        data.body
    )
    create_scan(
        db=db,
        scan_type="EMAIL",
        input_data=f"From: {data.from_email} | Subject: {data.subject}",
        score=result["score"],
        status=result["level"]
    )
    return result 