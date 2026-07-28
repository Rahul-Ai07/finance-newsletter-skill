from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

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
app.include_router(newsletter.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(templates.router, prefix="/api")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "version": "0.1.0"}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# Serve static files (frontend build)
frontend_build = Path(__file__).parent.parent.parent / "frontend" / "build"
if frontend_build.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_build / "static")), name="static")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str, request: Request):
    """Serve SPA - return index.html for all non-API routes"""
    # Don't serve index.html for API routes
    if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi"):
        return JSONResponse({"detail": "Not found"}, status_code=404)

    # Serve index.html for all other routes
    index_file = frontend_build / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))

    return JSONResponse({"detail": "Not found"}, status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
