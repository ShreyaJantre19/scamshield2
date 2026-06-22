from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from crud.scan_crud import get_scans, get_scan_by_id, delete_scan

router = APIRouter()


@router.get("/history")
def history(db: Session = Depends(get_db)):
    scans = get_scans(db)
    return scans


@router.get("/history/{scan_id}")
def get_scan_details(scan_id: int, db: Session = Depends(get_db)):
    scan = get_scan_by_id(db, scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan


@router.delete("/history/{scan_id}")
def remove_scan(scan_id: int, db: Session = Depends(get_db)):
    scan = delete_scan(db, scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return {"message": "Scan deleted successfully"}
