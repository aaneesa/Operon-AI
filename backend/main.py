import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

app = FastAPI(title="Operon AI Backend")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clients
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
mongodb_url = os.getenv("DATABASE_URL")
mongo_client = AsyncIOMotorClient(mongodb_url)
db = mongo_client.get_default_database()

@app.get("/")
async def root():
    return {"message": "Operon AI FastAPI Backend is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected" if mongo_client else "disconnected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
