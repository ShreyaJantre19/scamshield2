from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from database.database import Base


class Scan(Base):

    __tablename__ = "scans"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    scan_type = Column(
        String
    )

    input_data = Column(
        String
    )

    score = Column(
        Integer
    )

    status = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )