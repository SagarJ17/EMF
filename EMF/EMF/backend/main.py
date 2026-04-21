from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from contextlib import asynccontextmanager
from core.config import settings
from database.session import engine, Base
from routers import lead_magnet, bookings, contact, bmi, reviews, videos, transformations, upload
from routers import settings as settings_router
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        return response

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Yield to let the app start (Alembic handles migrations now)
    yield


app = FastAPI(
    title="EMF Fitness API",
    description="Backend API for EMF Fitness personal training platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lead_magnet.router, prefix="/lead-magnet", tags=["Lead Magnet"])
app.include_router(bookings.router, prefix="/book-session", tags=["Bookings"])
app.include_router(contact.router, prefix="/contact", tags=["Contact"])
app.include_router(bmi.router, prefix="/calculate-bmi", tags=["BMI Calculator"])
app.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
app.include_router(videos.router, prefix="/videos", tags=["Videos"])
app.include_router(transformations.router, prefix="/transformations", tags=["Transformations"])
app.include_router(upload.router, prefix="/upload", tags=["Uploads"])
app.include_router(settings_router.router, prefix="/settings", tags=["Settings"])
from routers import reports
app.include_router(reports.router, prefix="/reports", tags=["Reports"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "EMF Fitness API is running"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
