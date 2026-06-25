from pydantic import BaseModel
from typing import List

class AnalysisResult(BaseModel):
    score: int
    status: str
    reasons: List[str]


class URLRequest(BaseModel):
    url: str    