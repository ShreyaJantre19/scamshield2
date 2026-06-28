from fastapi import APIRouter
from pydantic import BaseModel
from Backend.services.chatbot_service import ask_chatbot

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(data: ChatRequest):
    response = ask_chatbot(data.message)

    return {
        "response": response
    } 