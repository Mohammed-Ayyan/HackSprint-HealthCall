"""API route definitions for CareOps AI Engine (Phase 1 Foundation & Phase 2 Audio Transcription)."""

import logging
from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from app.core.config import settings
from app.models.schemas import (
    HealthResponse,
    TranscriptProcessRequest,
    TranscriptValidationResponse,
    TranscriptionResponse,
)
from app.services.transcription_service import (
    AudioFileTooLargeError,
    CorruptedAudioError,
    EmptyAudioFileError,
    TranscriptionModelInitError,
    UnsupportedAudioFormatError,
    UnsupportedLanguageError,
    transcription_service,
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


@router.post(
    "/transcribe",
    response_model=TranscriptionResponse,
    status_code=status.HTTP_200_OK,
    summary="Transcribe Healthcare Audio",
    description="Upload a healthcare call audio file (WAV, MP3, M4A, FLAC, OGG) to transcribe locally using Faster Whisper.",
)
async def transcribe_audio_endpoint(
    file: UploadFile = File(..., description="Audio recording file (WAV, MP3, M4A, FLAC, OGG, max 25MB)."),
    language: Optional[str] = Form(
        default=None,
        description="Optional language hint ('en', 'hi', 'kn'). Auto-detected if omitted.",
    ),
) -> TranscriptionResponse:
    """Accept and transcribe an uploaded audio recording with timestamped segments."""
    try:
        return await transcription_service.transcribe_audio(
            upload_file=file,
            language_hint=language,
        )
    except EmptyAudioFileError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except UnsupportedAudioFormatError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except AudioFileTooLargeError as exc:
        raise HTTPException(
            status_code=getattr(status, "HTTP_413_CONTENT_TOO_LARGE", 413),
            detail=str(exc),
        ) from exc
    except CorruptedAudioError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except UnsupportedLanguageError as exc:
        raise HTTPException(
            status_code=getattr(status, "HTTP_422_UNPROCESSABLE_CONTENT", 422),
            detail=str(exc),
        ) from exc
    except TranscriptionModelInitError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error during audio transcription.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during audio transcription.",
        ) from exc
