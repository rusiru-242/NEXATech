"""
Main FastAPI application entry point for NexaTech AI Shopping Assistant microservice.
"""

import logging
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config.settings import settings
from routes.health import router as health_router
from routes.chat import router as chat_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ai_service")

# Initialize FastAPI application
app = FastAPI(
    title="NexaTech AI Shopping Microservice",
    description="Microservice providing AI shopping chatbot assistance and future ML model inference for NexaTech E-commerce.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
# Allows requests from Vite React frontend (http://localhost:5173)
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [str(settings.CORS_ORIGINS)]
logger.info(f"Configuring CORS for allowed origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

# Register route modules
app.include_router(health_router)
app.include_router(chat_router)


# Global Exception Handler for Request Validation Errors (e.g. invalid JSON payload)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handles request validation errors and returns a clean, structured JSON response.
    """
    logger.warning(f"Validation error on {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "reply": "Invalid request payload. Please ensure 'message' string is provided in the JSON body.",
            "errors": exc.errors()
        }
    )


# Global Fallback Exception Handler
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """
    Catches any unhandled exceptions to prevent server crashes and return safe JSON.
    """
    logger.error(f"Internal server error on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "reply": "Internal server error. Please try again later."
        }
    )


# Root route for quick service status
@app.get("/", tags=["Root"])
def root():
    return {
        "message": "NexaTech AI Shopping Microservice is running",
        "health_check": "/health",
        "chat_endpoint": "/chat",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting NexaTech AI microservice on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=(settings.ENVIRONMENT == "development")
    )
