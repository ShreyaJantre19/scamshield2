# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from sqlalchemy.orm import Session

from services.master_analyzer import master_analyze
from database.database import get_db
from crud.scan_crud import create_scan

router = APIRouter()


class URLRequest(BaseModel):
    url: str

@router.post("/scan/url")
def scan_url(data: URLRequest, db: Session = Depends(get_db)):
    result = master_analyze(data.url)
    create_scan(
        db=db,
        scan_type="URL",
        input_data=data.url,
        score=result["score"],
        status=result["level"]
    )
    return result 