from models.scan import Scan


def create_scan(db, scan_type, input_data, score, status):
    scan = Scan(
        scan_type=scan_type,
        input_data=input_data,
        score=score,
        status=status
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return scan


def get_scans(db):
    return db.query(Scan).all()


def get_scan_by_id(db, scan_id):
    return db.query(Scan).filter(Scan.id == scan_id).first()


def delete_scan(db, scan_id):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        return None
    db.delete(scan)
    db.commit()
    return scan


def get_statistics(db):
    total_scans = db.query(Scan).count()
    safe_scans = db.query(Scan).filter(Scan.status == "Safe").count()
    suspicious_scans = db.query(Scan).filter(Scan.status == "Suspicious").count()
    dangerous_scans = db.query(Scan).filter(Scan.status == "Dangerous").count()
    return {
        "total_scans": total_scans,
        "safe_scans": safe_scans,
        "suspicious_scans": suspicious_scans,
        "dangerous_scans": dangerous_scans
    }


def get_scan_types(db):
    url_scans = db.query(Scan).filter(Scan.scan_type == "URL").count()
    qr_scans = db.query(Scan).filter(Scan.scan_type == "QR").count()
    file_scans = db.query(Scan).filter(Scan.scan_type == "FILE").count()
    return {
        "url_scans": url_scans,
        "qr_scans": qr_scans,
        "file_scans": file_scans
    }


def get_risk_distribution(db):
    safe = db.query(Scan).filter(Scan.status == "Safe").count()
    suspicious = db.query(Scan).filter(Scan.status == "Suspicious").count()
    dangerous = db.query(Scan).filter(Scan.status == "Dangerous").count()
    return {
        "safe": safe,
        "suspicious": suspicious,
        "dangerous": dangerous
    }


def get_recent_scans(db):
    return db.query(Scan).order_by(Scan.id.desc()).limit(10).all()
