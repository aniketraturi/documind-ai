from fastapi import FastAPI

app = FastAPI(
    title="DocuMind AI API",
    description="Backend API for an AI-powered enterprise document knowledge base.",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}