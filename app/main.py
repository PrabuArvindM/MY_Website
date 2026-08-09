import os
import time
from pathlib import Path
from datetime import datetime

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.database import init_db
from app.routers import (
    blog, contact, otp, projects, patent,
    internships, github, resume, certifications,
    achievements, jarvis, jarvis_hub
)

app = FastAPI(
    title="Prabu Arvind M - Personal Portfolio & AI Agent API",
    description="Production REST API backend for Prabu Arvind M (AI & DS Engineer)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 1. GZip Compression Middleware (Optimizes payload delivery)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 2. CORS Middleware (Custom Domain Ready: www.prabuarvind.tech)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Production Security & Performance Headers Middleware
class ProductionSecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Static asset caching
        if request.url.path.startswith("/static/"):
            response.headers["Cache-Control"] = "public, max-age=86400"
            
        return response

app.add_middleware(ProductionSecurityMiddleware)

# Initialize Database on Startup
@app.on_event("startup")
def on_startup():
    init_db()

# Register All API Routers
app.include_router(blog.router)
app.include_router(contact.router)
app.include_router(otp.router)
app.include_router(projects.router)
app.include_router(patent.router)
app.include_router(internships.router)
app.include_router(github.router)
app.include_router(resume.router)
app.include_router(certifications.router)
app.include_router(achievements.router)
app.include_router(jarvis.router)
app.include_router(jarvis_hub.router)

# Custom StaticFiles class with caching
class CachedStaticFiles(StaticFiles):
    def is_not_modified(self, response_headers, request_headers):
        return super().is_not_modified(response_headers, request_headers)

# Robust Static & Root Index Path Resolution
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
if not STATIC_DIR.exists():
    STATIC_DIR = Path.cwd() / "static"

app.mount("/static", CachedStaticFiles(directory=STATIC_DIR), name="static")

# Health Check Endpoint for Google Cloud Run & Render
@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

# Root HTML Delivery
@app.get("/")
def serve_index():
    candidates = [
        BASE_DIR / "index.html",
        Path.cwd() / "index.html",
        Path("/app/index.html")
    ]
    for candidate in candidates:
        if candidate.exists():
            return FileResponse(candidate)
    return HTMLResponse("<h1>Portfolio website index.html loading...</h1>", status_code=200)

# Custom 404 Error Handler
@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    if request.url.path.startswith("/api/"):
        return JSONResponse(
            status_code=404,
            content={"detail": f"API endpoint '{request.url.path}' not found."}
        )
    return HTMLResponse(
        content="""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>404 - Page Not Found | Prabu Arvind M</title>
            <style>
                body { background: #070913; color: #fff; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
                .card { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(0, 242, 254, 0.3); padding: 40px; border-radius: 20px; box-shadow: 0 0 30px rgba(0, 242, 254, 0.15); max-width: 400px; }
                h1 { color: #00f2fe; font-size: 3rem; margin: 0 0 10px; }
                p { color: #94a3b8; font-size: 1rem; margin-bottom: 20px; }
                a { display: inline-block; background: linear-gradient(135deg, #00f2fe, #4facfe); color: #000; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>404</h1>
                <p>The page or resource you are looking for does not exist.</p>
                <a href="/">Return to Portfolio</a>
            </div>
        </body>
        </html>
        """,
        status_code=404
    )

# Custom 500 Error Handler
@app.exception_handler(500)
async def custom_500_handler(request: Request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."}
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
