from fastapi import APIRouter
from pydantic import BaseModel

from services.master_qr_analyzer import (
    master_qr_analyze
)

router = APIRouter()


class QRRequest(BaseModel):

    qr_data: str


@router.post("/scan/qr")
def scan_qr(data: QRRequest):

    return master_qr_analyze(

        data.qr_data

    ) 