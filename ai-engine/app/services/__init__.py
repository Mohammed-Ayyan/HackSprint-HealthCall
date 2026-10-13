"""Services module — CareOps AI Engine.

Implemented:
- Phase 2: Audio transcription via Faster Whisper (transcription_service.py)
- Phase 3: Transcript normalization, segmentation & metadata (transcript_processing_service.py)
- Phase 4: Core AI Intelligence Engine: Intent, Summary, Sentiment, Priority (intelligence_service.py)

Planned for future phases:
- Phase 5: Action extraction & department routing
- Phase 6: Verbal commitment detection & evidence validation
- Phase 7: Multilingual processing & PHI privacy masking
"""

from app.services.intelligence_service import (
    InferenceError,
    InferenceTimeoutError,
    IntelligenceError,
    IntelligenceService,
    MalformedModelOutputError,
    ModelUnavailableError,
    OllamaClient,
    intelligence_service,
)
from app.services.transcript_processing_service import (
    TranscriptProcessingError,
    transcript_processing_service,
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

__all__ = [
    "transcription_service",
    "AudioFileTooLargeError",
    "CorruptedAudioError",
    "EmptyAudioFileError",
    "TranscriptionModelInitError",
    "UnsupportedAudioFormatError",
    "UnsupportedLanguageError",
    "transcript_processing_service",
    "TranscriptProcessingError",
    "intelligence_service",
    "IntelligenceService",
    "OllamaClient",
    "IntelligenceError",
    "ModelUnavailableError",
    "InferenceTimeoutError",
    "InferenceError",
    "MalformedModelOutputError",
]
