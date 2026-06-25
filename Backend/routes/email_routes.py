# pyrefly: ignore [missing-import]
from fastapi import APIRouter
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

from services.master_email_analyzer import (
    master_email_analyze
)

router = APIRouter()


class EmailRequest(BaseModel):

    from_email: str

    reply_to: str

    subject: str

    body: str


@router.post("/scan/email")
def scan_email(data: EmailRequest):

    return master_email_analyze(

        data.from_email,

        data.reply_to,

        data.subject,

        data.body

    ) 