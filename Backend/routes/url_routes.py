# pyrefly: ignore [missing-import]
from fastapi import APIRouter
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

from services.master_analyzer import master_analyze

router = APIRouter()


class URLRequest(BaseModel):

    url: str

@router.post("/scan/url")
def scan_url(data: URLRequest):

    return master_analyze(data.url) 