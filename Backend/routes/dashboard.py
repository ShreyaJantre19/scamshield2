from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from crud.scan_crud import get_statistics

router = APIRouter()


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    return get_statistics(db)
