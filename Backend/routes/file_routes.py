from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from services.master_file_analyzer import master_file_analyze
from database.database import get_db
from crud.scan_crud import create_scan

router = APIRouter()


@router.post("/file/analyze")
async def scan_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    result = await master_file_analyze(file)
    create_scan(
        db=db,
        scan_type="FILE",
        input_data=file.filename,
        score=result["risk_score"],
        status=result["status"]
    )

    return result 