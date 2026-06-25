# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.url_routes import router as url_router
from backend.routes.email_routes import router as email_router
from backend.routes.file_routes import router as file_router
from backend.routes.qr_routes import router as qr_router
from backend.routes.threat_routes import router as threat_router
from backend.routes.chatbot_routes import router as chatbot_router 



app = FastAPI(
    title="ScamShield AI",
    version="1.0"
)

app.include_router(
    chatbot_router,
    prefix="/api"
) 


# CORS

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)

# Routes

app.include_router(
    url_router
)

app.include_router(
    email_router
)

app.include_router(
    file_router
)

app.include_router(
    qr_router
)

app.include_router(
    threat_router
)


@app.get("/")
def home():

    return {

        "message":
        "ScamShield AI Backend Running",

        "modules": [

            "URL Intelligence",

            "QR Intelligence",

            "Email Intelligence",

            "File Intelligence",

            "Threat Feed"

        ]

    } 