import os
import sys

# Patch Python path for serverless imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import engine, Base
from models.scan import Scan

# Initialize database tables on startup
Base.metadata.create_all(bind=engine)

# Import Routers
from routes.url_routes import router as url_router 
from routes.email_routes import router as email_router
from routes.file_routes import router as file_router
from routes.qr_routes import router as qr_router
from routes.threat_routes import router as threat_router
from routes.chatbot_routes import router as chatbot_router 
from routes.analyze import router as analyze_router
from routes.dashboard import router as dashboard_router
from routes.history import router as history_router
from routes.whatsapp import router as whatsapp_router

app = FastAPI(
    title="ScamShield AI",
    version="1.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers under /api prefix
app.include_router(chatbot_router, prefix="/api", tags=["Chatbot"]) 
app.include_router(url_router, prefix="/api", tags=["URL Scanner"])
app.include_router(email_router, prefix="/api", tags=["Email Analyzer"])
app.include_router(file_router, prefix="/api", tags=["File Scanner"])
app.include_router(qr_router, prefix="/api", tags=["QR Scanner"])
app.include_router(threat_router, prefix="/api", tags=["Threat Feed"])
app.include_router(analyze_router, prefix="/api", tags=["Unified Analysis"])
#app.include_router(dashboard_router, prefix="/api", tags=["Dashboard"])
#app.include_router(history_router, prefix="/api", tags=["Scan History"])
app.include_router(whatsapp_router, prefix="/api", tags=["WhatsApp Webhook"])

@app.get("/")
def home():
    return {
        "message": "ScamShield AI Backend Running",
        "modules": [
            "URL Intelligence",
            "QR Intelligence",
            "Email Intelligence",
            "File Intelligence",
            "Threat Feed"
        ]
    }