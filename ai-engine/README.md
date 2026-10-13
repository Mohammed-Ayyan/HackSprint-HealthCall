# CareOps AI — Intelligence Engine Backend

> **Autonomous Clinical Telephony Processing, NLU Intent Classification, and Actionable Intelligence Engine**  
> **Phase 2: Local Audio Transcription Engine**

---

## 1. Project Overview

**CareOps AI** transforms healthcare phone conversations into structured, verified hospital actions in real time. Designed as an operational intelligence engine for hospital command centers, nursing supervisors, and departmental leads, CareOps AI ensures zero dropped patient follow-ups, prompt insurance prior-authorizations, and SLA enforcement.

The pipeline architecture is structured into incremental stages:

```
Audio recording
    ↓
Speech-to-text transcription (Faster Whisper)       [PHASE 2 - COMPLETED]
    ↓
Transcript processing & Diarization                 [PHASE 3 - PLANNED]
    ↓
Intent classification, Summary, Sentiment, Priority [PHASE 4 - PLANNED]
    ↓
Action extraction & Department routing              [PHASE 5 - PLANNED]
    ↓
Staff commitment detection & Evidence grounding     [PHASE 6 - PLANNED]
    ↓
Multilingual processing & PHI privacy masking       [PHASE 7 - PLANNED]
    ↓
Frontend live service replacement & E2E testing     [PHASE 8 - PLANNED]
```

---

## 2. Current Scope: Phase 2 (Audio Transcription Engine)

### What IS implemented in Phase 2:
- **Local Faster Whisper Speech Recognition**:
  - Locally runnable, privacy-preserving speech-to-text without paid external cloud transcription APIs.
  - Configurable model size (default `base`, configurable to `tiny`, `small`, `medium`, `large-v3`).
  - Optimized for CPU execution by default with `int8` quantization (configurable to CUDA / GPU).
  - Lazy singleton model initialization: cached and reused across requests; never downloaded or loaded on import.
- **Audio Upload API (`POST /api/v1/transcribe`)**:
  - Accepts `multipart/form-data` with audio file (`file`) and optional language hint (`language`).
  - Supports common healthcare telephony formats: **WAV, MP3, M4A, FLAC, OGG**.
  - Chunked streaming upload size enforcement (default limit: 25 MB) preventing unbounded memory consumption.
  - Non-empty file validation and PyAV-based container decoding verification.
  - Safe temporary file lifecycle: files are deleted immediately after transcription in a `finally:` block.
- **Language Hints & Automatic Detection**:
  - Supported initial language hints: English (`en`), Hindi (`hi`), Kannada (`kn`).
  - Automatic language detection when no hint is supplied.
  - Unsupported language codes rejected with clear HTTP 422 error messages.
- **Structured Response Contract**:
  - Returns `success`, consolidated `transcript`, detected `language`, `language_probability`, `duration_seconds`, timestamped `segments` (`start`, `end`, `text`), and server `processing_time_seconds`.
- **Privacy & Healthcare Security**:
  - Zero external API transmission: all audio remains strictly on the local machine.
  - Telemetry logging records only file extension, size in bytes, duration, language, and processing latency; never logs raw audio or transcript contents.
- **Comprehensive Automated Test Suite**:
  - 27 automated tests covering health checks, file validation, boundary limits, corrupted audio, mock model testing, temporary file cleanup verification, and real Faster Whisper live transcription.

### What is explicitly NOT implemented in Phase 2 (Reserved for Future Phases):
- ❌ Intent classification, Clinical summary, Sentiment analysis, Priority classification (Phase 4)
- ❌ Action extraction and department routing (Phase 5)
- ❌ Staff commitment detection & evidence quote anchoring (Phase 6)
- ❌ PHI redaction & multilingual neural translation (Phase 7)
- ❌ Modifying frontend UI or removing hardcoded mock datasets (Phase 8)

---

## 3. Directory Structure

```
ai-engine/
├── .env.example              # Safe template environment variables
├── .env                      # Local environment configuration
├── .gitignore                # Python, virtualenv, and cache ignores
├── requirements.txt          # Phase 2 dependencies (fastapi, faster-whisper, av<19, etc.)
├── README.md                 # Backend documentation and testing guide
├── app/
│   ├── __init__.py           # Application package marker
│   ├── main.py               # FastAPI entry point, CORS, and exception handlers
│   ├── api/
│   │   ├── __init__.py       # API package marker
│   │   └── routes.py         # /health, /transcript/validate, and /transcribe endpoints
│   ├── core/
│   │   ├── __init__.py       # Core package marker
│   │   └── config.py         # Centralized Pydantic settings & Whisper configuration
│   ├── models/
│   │   ├── __init__.py       # Models package marker
│   │   └── schemas.py        # Pydantic models for transcript validation, transcription, and errors
│   └── services/
│       ├── __init__.py       # Services package marker
│       └── transcription_service.py # Faster Whisper engine, validation, and PyAV decoding
└── tests/
    ├── __init__.py           # Tests package marker
    ├── conftest.py           # Pytest TestClient fixture & path setup
    ├── test_health.py        # Health-check endpoint tests
    ├── test_validation.py    # Transcript text validation tests
    └── test_transcription.py # Phase 2 audio upload, validation, cleanup, and live model tests
```

---

## 4. Prerequisites & Environment Setup

- **Python**: 3.10 to 3.13 (Verified on Python 3.13)
- **pip**: 23.0+
- **OS**: Windows, macOS, or Linux (PowerShell commands below)

### Step 1: Open Terminal in `ai-engine` Directory
```powershell
cd ai-engine
```

### Step 2: Activate the Virtual Environment
**On Windows (PowerShell):**
```powershell
.\.venv\Scripts\Activate.ps1
```

### Step 3: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Copy the template configuration if not already configured:
```powershell
Copy-Item .env.example .env
```

Configuration variables in `.env`:
```env
WHISPER_MODEL_SIZE=base
WHISPER_DEVICE=cpu
WHISPER_COMPUTE_TYPE=int8
MAX_AUDIO_UPLOAD_SIZE_MB=25
ALLOWED_AUDIO_EXTENSIONS=[".wav", ".mp3", ".m4a", ".flac", ".ogg"]
SUPPORTED_AUDIO_LANGUAGES=["en", "hi", "kn"]
```

---

## 5. Running the Backend Server

Start the Uvicorn development server:

```powershell
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive API documentation will be available at:
- **Swagger UI**: [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs)
- **ReDoc**: [http://127.0.0.1:8000/api/v1/redoc](http://127.0.0.1:8000/api/v1/redoc)

---

## 6. Audio Upload & Transcription API

### Endpoint: `POST /api/v1/transcribe`

Accepts `multipart/form-data`:
* `file` (Required): Audio recording file (`.wav`, `.mp3`, `.m4a`, `.flac`, `.ogg`, max 25MB).
* `language` (Optional): ISO language hint (`en`, `hi`, `kn`). If omitted, automatic language detection is performed.

#### Example Response (HTTP 200 OK):
```json
{
  "success": true,
  "transcript": "Hello, I am calling following my surgery with Dr. Thorne. I have developed a low-grade fever and need to confirm my follow-up appointment.",
  "language": "en",
  "language_probability": 0.9854,
  "duration_seconds": 7.42,
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 3.8,
      "text": "Hello, I am calling following my surgery with Dr. Thorne."
    },
    {
      "id": 1,
      "start": 3.8,
      "end": 7.42,
      "text": "I have developed a low-grade fever and need to confirm my follow-up appointment."
    }
  ],
  "processing_time_seconds": 1.48
}
```

---

## 7. How to Test the Transcription Endpoint

### Method A: Interactive Browser (Swagger UI)
1. Navigate to [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs)
2. Expand **`POST /api/v1/transcribe`** and click **"Try it out"**
3. Choose an audio file (e.g., `.wav`, `.mp3`)
4. Optionally enter `en`, `hi`, or `kn` in the `language` field
5. Click **"Execute"** and view the structured transcript and segments.

### Method B: PowerShell `curl` / `Invoke-RestMethod`
```powershell
$form = @{
    file = Get-Item "C:\path\to\recording.wav"
    language = "en"
}
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/transcribe" -Method Post -Form $form
$response | ConvertTo-Json -Depth 5
```

### Method C: Linux / macOS `curl`
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/transcribe" \
     -F "file=@/path/to/recording.wav" \
     -F "language=en"
```

---

## 8. Automated Test Suite

Run the full automated test suite using `pytest`:

```powershell
pytest -v
```

### Test Coverage (27 Tests, 100% Passing):
1. **Health Check Tests**:
   - `test_health_check_returns_200`
   - `test_health_check_response_structure`
   - `test_root_endpoint_returns_200`
   - `test_health_check_still_works`
2. **Audio Upload Validation Tests**:
   - `test_missing_audio_file_rejected` (HTTP 422)
   - `test_empty_upload_rejected` (HTTP 400)
   - `test_unsupported_audio_extension_rejected` (HTTP 400)
   - `test_oversized_upload_rejected` (HTTP 413)
   - `test_unsupported_language_hint_rejected` (HTTP 422)
   - `test_corrupted_audio_handled_safely` (HTTP 400)
3. **Transcription & Lifecycle Tests**:
   - `test_successful_transcription_response_schema` (Validates contract)
   - `test_temporary_files_are_cleaned_up` (Confirms immediate temp file deletion)
   - `test_model_initialization_failure_handling` (HTTP 503)
   - `test_automatic_language_detection` (Auto-detects when hint is omitted)
   - `test_real_faster_whisper_transcription_live` (Live model transcription integration test)
4. **Transcript Text Validation Tests**:
   - 12 tests covering length, stripping, non-string, and multilingual text validation (`en`, `hi`, `kn`).

---

## 9. Current Limitations & Roadmap

- **Audio Length**: Default maximum file size is 25 MB (~25-30 minutes of compressed audio).
- **Background Noise**: Clinical speech with severe acoustic background noise may require diarization filtering (scheduled for Phase 3).
- **First-Run Model Download**: Faster Whisper downloads model weights automatically on its first run to the local HuggingFace cache directory (`~/.cache/huggingface/hub`).
- **Next Phase (Phase 3)**: Transcript segmentation, speaker diarization, and text normalization.
