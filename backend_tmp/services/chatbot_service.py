from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv() 

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

SYSTEM_PROMPT = """
You are ScamShield AI, an AI-powered cybersecurity assistant.
You only answer cybersecurity, scams, phishing, fraud and online safety questions.
If unrelated questions are asked, politely refuse.
Keep answers simple and concise.
"""

def ask_chatbot(message):
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": message
            }
        ],
        temperature=0.7,
        max_completion_tokens=300
    )

    return completion.choices[0].message.content 