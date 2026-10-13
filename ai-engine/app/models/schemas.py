"""Pydantic schemas and domain models for CareOps AI Engine.

Establishes:
1. Health check response schema
2. Request validation schema for future transcript processing
3. Extensible future response schemas (Summary, Intent, Sentiment, Priority, Actions, Commitments, Privacy)
4. Standard error responses
"""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.core.config import settings


# ============================================================================
# Enums for Future AI Intelligence Processing
# ============================================================================

class SupportedLanguage(str, Enum):
    """Supported transcript language codes."""
    EN = "en"
    HI = "hi"
    KN = "kn"


class CallIntent(str, Enum):
    """Possible clinical and administrative intent categories."""
    APPOINTMENT_REQUEST = "Appointment Request"
    INSURANCE_QUERY = "Insurance Query"
    BILLING_ISSUE = "Billing Issue"
    COMPLAINT = "Complaint"
    MEDICINE_REFILL = "Medicine Refill"
    EMERGENCY_CONCERN = "Emergency Concern"
    GENERAL_INQUIRY = "General Inquiry"
    FOLLOW_UP_REQUEST = "Follow-up Request"


class CallSentiment(str, Enum):
    """Patient emotional sentiment categories."""
    SATISFIED = "Satisfied"
    NEUTRAL = "Neutral"
    CONFUSED = "Confused"
    FRUSTRATED = "Frustrated"
    ANGRY = "Angry"
    # Frontend alignment aliases
    POSITIVE = "positive"
    CONCERNED = "concerned"


class CallPriority(str, Enum):
    """Call and action urgency levels."""
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    # Lowercase aliases for frontend contract compatibility
    CRITICAL_LOWER = "critical"
    HIGH_LOWER = "high"
    MEDIUM_LOWER = "medium"
    LOW_LOWER = "low"


class DepartmentName(str, Enum):
    """Hospital departments for action routing."""
    RECEPTION = "Reception"
    INSURANCE = "Insurance"
    CUSTOMER_SUPPORT = "Customer Support"
    BILLING = "Billing"
    PHARMACY = "Pharmacy"
    EMERGENCY_TRIAGE = "Emergency Triage"
    CLINICAL_TEAM = "Clinical Team"


# ============================================================================
# Health Check Schema
# ============================================================================

class HealthResponse(BaseModel):
    """Health check status response."""
    status: str = "ok"
    service: str = "careops-ai-engine"
    version: str = "1.0.0"


# ============================================================================
# Request Schemas
# ============================================================================

class TranscriptProcessRequest(BaseModel):
    """Request schema for transcript processing.

    Validates:
    - transcript must be non-empty string
    - rejects whitespace-only transcripts
    - trims leading/trailing whitespace
    - enforces configurable max length without silent truncation
    - supports validated language codes (en, hi, kn)
    - extensible for future metadata
    """
    model_config = ConfigDict(extra="ignore")

    transcript: str = Field(
        ...,
        description="Raw or diarized transcript text from healthcare phone call.",
        examples=["I need to schedule a follow-up appointment with Dr. Thorne."],
    )
    language: str = Field(
        default="en",
        description="ISO language code of the transcript. Initial support: en, hi, kn.",
        examples=["en"],
    )
    # Extensible future fields (optional)
    call_id: Optional[str] = Field(default=None, description="Unique identifier for the call session.")
    patient_mrn: Optional[str] = Field(default=None, description="Patient Medical Record Number if known.")
    audio_url: Optional[str] = Field(default=None, description="Audio source URL for dual-channel validation.")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Auxiliary telephony metadata.")

    @field_validator("transcript", mode="before")
    @classmethod
    def validate_and_strip_transcript(cls, v: Any) -> str:
        if not isinstance(v, str):
            raise ValueError("Transcript must be a string.")
        stripped = v.strip()
        if not stripped:
            raise ValueError("Transcript must not be empty or contain only whitespace.")
        if len(stripped) > settings.MAX_TRANSCRIPT_LENGTH:
            raise ValueError(
                f"Transcript exceeds maximum allowed length of {settings.MAX_TRANSCRIPT_LENGTH} characters "
                f"(received {len(stripped)} characters). Oversized transcripts are rejected without truncation."
            )
        return stripped

    @field_validator("language")
    @classmethod
    def validate_language(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("Language must be a string.")
        normalized = v.strip().lower()
        if normalized not in settings.ALLOWED_LANGUAGES:
            supported = ", ".join(settings.ALLOWED_LANGUAGES)
            raise ValueError(
                f"Unsupported language code '{v}'. Supported language codes are: {supported}."
            )
        return normalized


class TranscriptValidationResponse(BaseModel):
    """Response confirming successful transcript request validation."""
    status: str = "valid"
    message: str = "Transcript accepted for future processing pipeline."
    character_count: int
    language: str
    max_allowed_characters: int


# ============================================================================
# Phase 2: Audio Transcription Schemas
# ============================================================================

class TranscriptionSegment(BaseModel):
    """Single segment of transcribed speech with timestamps."""
    id: Optional[int] = None
    start: float = Field(..., description="Start timestamp in seconds.")
    end: float = Field(..., description="End timestamp in seconds.")
    text: str = Field(..., description="Recognized speech segment text.")


class TranscriptionResponse(BaseModel):
    """Structured audio transcription result."""
    success: bool = Field(default=True, description="Indicates whether transcription succeeded.")
    transcript: str = Field(..., description="Full consolidated transcript text.")
    language: str = Field(..., description="Detected or specified ISO language code.")
    language_probability: Optional[float] = Field(
        default=None,
        description="Confidence score for language detection (0.0 to 1.0).",
    )
    duration_seconds: Optional[float] = Field(
        default=None,
        description="Total audio duration in seconds.",
    )
    segments: List[TranscriptionSegment] = Field(
        default_factory=list,
        description="Timestamped diarized or speech segments.",
    )
    processing_time_seconds: float = Field(
        ...,
        description="Total server processing latency in seconds.",
    )


# ============================================================================
# Future AI Intelligence Response Schemas (Phase 3+ Extensibility)
# ============================================================================

class AISummaryResponse(BaseModel):
    """Clinical summary extracted from transcript."""
    overview: str
    key_points: List[str] = Field(default_factory=list)
    clinical_flags: List[str] = Field(default_factory=list)
    insurance_pending: bool = False
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0)


class ActionExtractionResponse(BaseModel):
    """Action item extracted from conversation with grounding evidence."""
    id: str
    task: str
    department: str
    priority: str
    deadline: Optional[str] = None
    evidence_quote: str
    suggested_assignee: Optional[str] = None
    status: Optional[str] = "pending"


class CommitmentResponse(BaseModel):
    """Verbal promise or commitment detected during staff-patient call."""
    id: str
    commitment: str
    owner: Optional[str] = None
    deadline: Optional[str] = None
    timestamp: Optional[str] = None
    status: Optional[str] = "pending"
    evidence_quote: str


class PrivacyMaskingInfo(BaseModel):
    """Redaction and HIPAA/privacy-masking metadata."""
    is_masked: bool = False
    masked_entities_count: int = 0
    detected_entity_types: List[str] = Field(default_factory=list)
    redacted_transcript: Optional[str] = None


class ProcessingMetadata(BaseModel):
    """Execution telemetry and pipeline provenance."""
    processing_time_ms: Optional[float] = None
    model_version: Optional[str] = None
    pipeline_stage: str = "foundation"
    created_at: Optional[str] = None


class AIIntelligenceResponse(BaseModel):
    """Unified AI intelligence contract for downstream frontend integration."""
    call_id: Optional[str] = None
    transcript: str
    detected_language: str
    summary: Optional[AISummaryResponse] = None
    intent: Optional[CallIntent] = None
    secondary_intents: List[CallIntent] = Field(default_factory=list)
    sentiment: Optional[CallSentiment] = None
    sentiment_score: Optional[float] = Field(default=None, ge=-1.0, le=1.0)
    priority: Optional[CallPriority] = None
    actions: List[ActionExtractionResponse] = Field(default_factory=list)
    commitments: List[CommitmentResponse] = Field(default_factory=list)
    privacy_masking: Optional[PrivacyMaskingInfo] = None
    metadata: Optional[ProcessingMetadata] = None
    notes: Optional[str] = "Phase 1 schema definition only - AI model processing deferred to future phases."


# ============================================================================
# Standardized Error Schemas
# ============================================================================

class ErrorDetail(BaseModel):
    """Individual field validation error detail."""
    field: Optional[str] = None
    message: str


class ErrorResponse(BaseModel):
    """Standardized API error response format."""
    error: str
    message: str
    details: Optional[List[ErrorDetail]] = None
    status_code: int
