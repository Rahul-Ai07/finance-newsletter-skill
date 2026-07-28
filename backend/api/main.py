from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
import logging
from datetime import datetime

from backend.api import newsletter, auth, templates
from backend.db.models import Base
from backend.db import engine

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Premium Newsletter SaaS",
    description="Compliance-first newsletter generation platform for fintech",
    version="0.1.0",
    docs_url="/api/docs" if os.getenv("ENVIRONMENT") == "development" else None,
    redoc_url="/api/redoc" if os.getenv("ENVIRONMENT") == "development" else None,
    openapi_url="/api/openapi.json" if os.getenv("ENVIRONMENT") == "development" else None,
)

# Security: Trusted Host Middleware
allowed_hosts = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1,newsletter-saas-prod.herokuapp.com").split(",")
app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

# Security: CORS configuration - restrictive by default
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:8080").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Add security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)

    # Prevent MIME type sniffing
    response.headers["X-Content-Type-Options"] = "nosniff"

    # Enable XSS protection
    response.headers["X-XSS-Protection"] = "1; mode=block"

    # Prevent clickjacking
    response.headers["X-Frame-Options"] = "DENY"

    # Content Security Policy
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'"

    # Referrer Policy
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

    # Permissions Policy
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

    # HTTPS strict transport security (only in production)
    if os.getenv("ENVIRONMENT") == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

    return response

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url.path} from {request.client.host}")
    response = await call_next(request)
    logger.info(f"{request.method} {request.url.path} - {response.status_code}")
    return response

# Include routers
app.include_router(newsletter.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(templates.router, prefix="/api")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "version": "0.1.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler - don't expose sensitive details"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)

    # Don't expose internal details in production
    if os.getenv("ENVIRONMENT") == "production":
        detail = "Internal server error"
    else:
        detail = str(exc)

    return JSONResponse(
        status_code=500,
        content={"detail": detail}
    )

# Serve static files (frontend build)
frontend_build = Path(__file__).parent.parent.parent / "frontend" / "build"
if frontend_build.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_build / "static")), name="static")
    logger.info("Static files mounted")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str, request: Request):
    """Serve SPA - return index.html for all non-API routes"""

    # Don't serve index.html for API routes
    if full_path.startswith("api/") or full_path.startswith("health"):
        return JSONResponse({"detail": "Not found"}, status_code=404)

    # Serve index.html for all other routes (SPA routing)
    index_file = frontend_build / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))

    return JSONResponse({"detail": "Not found"}, status_code=404)

logger.info(f"Application started in {os.getenv('ENVIRONMENT', 'development')} mode")
