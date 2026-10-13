# CareOps AI — Intelligence Engine Backend

> **Autonomous Clinical Telephony Processing, NLU Intent Classification, and Actionable Intelligence Engine**  
> **Phase 1: Backend Foundation**

---

## 1. Project Overview

**CareOps AI** transforms healthcare phone conversations into structured, verified hospital actions in real time. Designed as an operational intelligence engine for hospital command centers, nursing supervisors, and departmental leads, CareOps AI ensures zero dropped patient follow-ups, prompt insurance prior-authorizations, and SLA enforcement.

The eventual end-to-end intelligence workflow will be:

```
Audio recording
    ↓
Speech-to-text transcription (Faster Whisper)
    ↓
Transcript processing & Diarization
    ↓
Intent classification (Appointment, Insurance, Billing, Complaint, Refill, Emergency)
    ↓
Summary generation (Clinical flags & Key takeaways)
    ↓
Sentiment analysis & Urgency scoring
    ↓
Priority classification (CRITICAL, HIGH, MEDIUM, LOW)
    ↓
Action extraction (Tasks, Target departments, Deadlines)
    ↓
Staff commitment detection (Verbal promises & Owner accountability)
    ↓
Evidence validation (Cryptographically anchored verbatim quotes)
    ↓
Sensitive information masking (PHI/HIPAA redaction)
    ↓
Structured results dispatched to the Frontend UI
```

---

## 2. Current Scope: Phase 1 (Backend Foundation)

**Phase 1 establishes ONLY the backend foundation.**

### What IS implemented in Phase 1:
- Clean modular application architecture (`app/api`, `app/core`, `app/models`, `app/services`)
- FastAPI application initialization with CORS middleware configured for the Next.js frontend
- Centralized environment configuration via Pydantic Settings
- Request schema validation for future transcript processing
- Extensible domain response schemas matching the frontend contract (Intents, Sentiment, Priority, Actions, Commitments, Privacy)
- Centralized, sanitized error handling (no leaked stack traces or filesystem paths)
- Privacy-aware structured logging (no raw patient transcripts logged)
- Operational health-check endpoint (`GET /api/v1/health`)
- Transcript schema validation endpoint (`POST /api/v1/transcript/validate`)
- Comprehensive automated test suite using `pytest` and FastAPI `TestClient`
- Windows-friendly setup guides and virtual environment configuration

### What is explicitly NOT implemented in Phase 1:
The following capabilities are reserved for subsequent phases and are **NOT** active in Phase 1:
- ❌ Audio transcription (Faster Whisper)
- ❌ Intent classification
- ❌ Clinical summary generation
- ❌ Acoustic/lexical sentiment analysis
- ❌ Priority classification
- ❌ Action extraction
- ❌ Staff commitment detection
- ❌ Evidence quote verification
- ❌ Multilingual neural translation
- ❌ Automated PHI/HIPAA redaction
- ❌ Live frontend data replacement (the existing frontend mock services remain active and intact)

---

## 3. Directory Structure

```
ai-engine/
├── .env.example              # Safe template environment variables
├── .gitignore                # Python and environment ignores
├── requirements.txt          # Minimal Phase 1 dependencies
├── README.md                 # Backend documentation
├── app/
│   ├── __init__.py           # Application package marker
│   ├── main.py               # FastAPI entry point, CORS, and exception handlers
│   ├── api/
│   │   ├── __init__.py       # API package marker
│   │   └── routes.py         # /health and /transcript/validate endpoints
│   ├── core/
│   │   ├── __init__.py       # Core package marker
│   │   └── config.py         # Centralized Pydantic settings
│   ├── models/
│   │   ├── __init__.py       # Models package marker
│   │   └── schemas.py        # Pydantic schemas, enums, and error contracts
│   └── services/
│       └── __init__.py       # Service layer marker (Phase 2+ implementation point)
└── tests/
    ├── __init__.py           # Tests package marker
    ├── conftest.py           # Pytest TestClient fixture & path setup
    ├── test_health.py        # Health-check endpoint tests
    └── test_validation.py    # Transcript validation & error handling tests
```

---

## 4. Prerequisites

- **Python**: 3.10 to 3.13 (Verified on Python 3.13)
- **pip**: 23.0+
- **OS**: Windows, macOS, or Linux (commands below include Windows PowerShell)

---

## 5. Local Setup Instructions (Windows / VS Code)

### Step 1: Open Terminal in `ai-engine` Directory
In PowerShell or VS Code terminal:
```powershell
cd ai-engine
```

### Step 2: Create a Virtual Environment
```powershell
python -m venv .venv
```

### Step 3: Activate the Virtual Environment
**On Windows (PowerShell):**
```powershell
.\.venv\Scripts\Activate.ps1
```
*(If PowerShell restricts script execution, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned`)*

**On Windows (Command Prompt):**
```cmd
.venv\Scripts\activate.bat
```

**On Linux/macOS:**
```bash
source .venv/bin/activate
```

### Step 4: Install Dependencies
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Step 5: Configure Environment Variables
Copy the template configuration:
```powershell
Copy-Item .env.example .env
```
*(On Linux/macOS: `cp .env.example .env`)*

---

## 6. Running the Backend Server

Start the development server with Uvicorn:

```powershell
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The server will be available at:
- **Base URL**: `http://127.0.0.1:8000`
- **Interactive OpenAPI Documentation (Swagger UI)**: `http://127.0.0.1:8000/api/v1/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/api/v1/redoc`

---

## 7. API Endpoints

### 1. Health Check
- **Endpoint**: `GET /api/v1/health`
- **Description**: Verifies the backend engine is running. Does not claim AI models are loaded.
- **Response (HTTP 200)**:
```json
{
  "status": "ok",
  "service": "careops-ai-engine",
  "version": "1.0.0"
}
```

### 2. Transcript Request Validation
- **Endpoint**: `POST /api/v1/transcript/validate`
- **Description**: Validates transcript input format, character limits, and language codes without executing AI inference.
- **Example Request**:
```json
{
  "transcript": "Hello, I need to check if my post-op follow-up appointment is confirmed for tomorrow morning.",
  "language": "en"
}
```
- **Successful Response (HTTP 200)**:
```json
{
  "status": "valid",
  "message": "Transcript accepted for future processing pipeline.",
  "character_count": 96,
  "language": "en",
  "max_allowed_characters": 50000
}
```

---

## 8. Request Validation Rules

| Rule | Behavior | HTTP Status |
|---|---|---|
| **Non-empty string** | Rejects `""` or missing `transcript` field | `422 Unprocessable Entity` |
| **Whitespace-only** | Rejects strings containing only spaces, tabs, or newlines | `422 Unprocessable Entity` |
| **Trimming** | Automatically trims leading/trailing whitespace | Processed cleanly |
| **Max length** | Rejects transcripts longer than 50,000 characters without silent truncation | `422 Unprocessable Entity` |
| **Supported languages** | Accepts `en` (English), `hi` (Hindi), `kn` (Kannada). Rejects other codes with clear error | `422 Unprocessable Entity` |
| **Extensible payload** | Accepts optional `call_id`, `patient_mrn`, `audio_url`, `metadata` | Passed through |

### Error Response Format
All errors return a consistent, secure JSON structure:
```json
{
  "error": "Validation Error",
  "message": "Request payload failed schema validation.",
  "details": [
    {
      "field": "transcript",
      "message": "Transcript must not be empty or contain only whitespace."
    }
  ],
  "status_code": 422
}
```

---

## 9. Running Automated Tests

Run the test suite using `pytest`:

```powershell
pytest
```

Or for verbose output with detailed test names:
```powershell
pytest -v
```

### Verified Test Suite:
1. `test_health_check_returns_200`
2. `test_health_check_response_structure`
3. `test_root_endpoint_returns_200`
4. `test_valid_transcript_passes_validation`
5. `test_empty_transcript_is_rejected`
6. `test_whitespace_only_transcript_is_rejected`
7. `test_unsupported_language_is_rejected`
8. `test_oversized_transcript_is_rejected`
9. `test_error_response_structure`
10. `test_all_supported_languages_accepted` (`en`, `hi`, `kn`)
11. `test_transcript_whitespace_trimming`
12. `test_missing_transcript_field_rejected`
13. `test_non_string_transcript_rejected`

---

## 10. Frontend Integration Requirements (For Phase 8)

The frontend currently uses mock data defined in `src/features/ai-intelligence/mockCallService.ts` and types in `src/shared/types/call.ts`.

When connecting the real AI backend in later phases:
1. The frontend environment will configure:
   ```env
   NEXT_PUBLIC_AI_API_URL=http://127.0.0.1:8000/api/v1
   ```
2. The AI Engine CORS configuration already allows `http://localhost:3000`.
3. In Phase 8, `mockCallService.ts` will be replaced with `apiCallService.ts` calling the verified backend endpoints.
4. **Existing frontend mock data must remain in place until the backend pipeline is verified and fully functional.**

---

## 11. Incremental Development Roadmap

- **Phase 1 (Completed)**: Backend Foundation, Configuration, Schemas, Validation, Error Handling, Health API, Automated Tests.
- **Phase 2**: Local dual-channel audio transcription (Faster Whisper).
- **Phase 3**: Transcript normalization and diarization pipeline.
- **Phase 4**: Intent classification, clinical summary generation, sentiment scoring, priority classification.
- **Phase 5**: Action extraction with department routing and deadline inference.
- **Phase 6**: Verbal commitment detection and transcript evidence grounding.
- **Phase 7**: Multilingual processing (`hi`, `kn`) and PHI redaction.
- **Phase 8**: Frontend service replacement, end-to-end integration, and removal of mock data.
