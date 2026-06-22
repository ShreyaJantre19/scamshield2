# pyrefly: ignore [missing-import]
from fastapi import APIRouter

from services.threat_feed import (
    get_threat_feed
)

router = APIRouter()


@router.get("/threat-feed")
def threat_feed():

    return {

        "threats": get_threat_feed()

    } 