"""
Health check endpoints for monitoring microservice status.
"""

from fastapi import APIRouter, status
from pydantic import BaseModel
from config.settings import settings

router = APIRouter()


class HealthResponse(BaseModel):
    """Schema for health endpoint response."""
    status: str
    service: str
    version: str
    environment: str
    model_type: str
    gemini_model: str


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Microservice Health Check",
    tags=["Health"]
)
def get_health() -> HealthResponse:
    """
    Returns the operational status of the AI shopping chatbot microservice.
    Used by load balancers, orchestrators, and developers to verify service health.
    """
    return HealthResponse(
        status="ok",
        service="NexaTech AI Shopping Microservice",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        model_type=settings.MODEL_TYPE,
        gemini_model=settings.GEMINI_MODEL
    )
