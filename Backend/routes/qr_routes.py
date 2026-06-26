from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from crud.scan_crud import create_scan

from services.master_qr_analyzer import (
    master_qr_analyze
)

router = APIRouter()


class QRRequest(BaseModel):
    qr_data: str


@router.post("/scan/qr")
def scan_qr(data: QRRequest, db: Session = Depends(get_db)):
    result = master_qr_analyze(data.qr_data)
    create_scan(
        db=db,
        scan_type="QR",
        input_data=data.qr_data,
        score=result["score"],
        status=result["level"]
    )
    return result 