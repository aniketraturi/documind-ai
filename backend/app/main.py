from fastapi import FastAPI

from app.api.routes import auth, health

app = FastAPI(
    title="DocuMind AI API",
    description="Backend API for an AI-powered enterprise document knowledge base.",
    version="0.1.0",
)

app.include_router(health.router)
app.include_router(auth.router)