from fastapi import APIRouter, UploadFile, File
from services.master_file_analyzer import master_file_analyze

router = APIRouter()


@router.post("/api/file/analyze")
async def scan_file(
    file: UploadFile = File(...)
):

    result = await master_file_analyze(file)

    return result 