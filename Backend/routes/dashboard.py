from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from Backend.database.database import get_db
from Backend.crud.scan_crud import get_statistics

router = APIRouter()


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    return get_statistics(db)
