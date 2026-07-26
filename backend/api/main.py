from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

from backend.api import newsletter, auth, templates
from backend.db.models import Base
from backend.db import engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Premium Newsletter SaaS",
    description="Compliance-first newsletter generation platform for fintech",
    version="0.1.0"
)

# CORS configuration
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:8080").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(newsletter.router)
app.include_router(auth.router)
app.include_router(templates.router)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "version": "0.1.0"}

@app.get("/")
async def root():
    """API root"""
    return {
        "name": "Premium Newsletter SaaS",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
