"""API route definitions for CareOps AI Engine (Phase 1 Foundation)."""

import logging
from fastapi import APIRouter, status
from app.core.config import settings
from app.models.schemas import (
    HealthResponse,
    TranscriptProcessRequest,
    TranscriptValidationResponse,
)

logger = logging.getLogger("careops.api")

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health Check",
    description="Verifies backend application status without claiming AI models are active.",
)
async def health_check() -> HealthResponse:
    """Return operational health status of the AI Engine backend."""
    return HealthResponse(
        status="ok",
        service=settings.APP_NAME,
        version=settings.APP_VERSION,
    )


@router.post(
    "/transcript/validate",
    response_model=TranscriptValidationResponse,
    status_code=status.HTTP_200_OK,
    summary="Validate Transcript Request",
    description="Validates incoming transcript payload against schema constraints without triggering AI analysis.",
)
async def validate_transcript(
    payload: TranscriptProcessRequest,
) -> TranscriptValidationResponse:
    """Validate transcript format, length, and language code for future pipeline stages.

    Note: Privacy-preserving logging records only length and language, not transcript content.
    """
    logger.info(
        "Transcript validation passed: lang=%s, length=%d, call_id=%s",
        payload.language,
        len(payload.transcript),
        payload.call_id or "unspecified",
    )

    return TranscriptValidationResponse(
        status="valid",
        message="Transcript accepted for future processing pipeline.",
        character_count=len(payload.transcript),
        language=payload.language,
        max_allowed_characters=settings.MAX_TRANSCRIPT_LENGTH,
    )
