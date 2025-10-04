"""Entry point for the LACOSA backend service."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router as api_router


app = FastAPI(
    title="LACOSA API",
    description="Local Companion for Expats & Nomads",
    version="0.1.0",
)


# Basic CORS for frontend/mobile clients (relaxed for MVP)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    """Basic health check endpoint."""
    return {"status": "ok"}
