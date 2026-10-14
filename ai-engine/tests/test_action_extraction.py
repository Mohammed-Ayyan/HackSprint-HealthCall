"""Phase 5 Action Extraction Engine tests.

Covers all required test cases:
1. Clear follow-up action and explicit deadline.
2. Action with no deadline.
3. Transcript mentioning an appointment date that must NOT become a task deadline.
4. Transcript containing no actionable tasks.
5. Transcript with ambiguous ownership or timing.
6. Malformed or failed AI response handling (including hallucinated evidence rejection).
7. Action deduplication.
8. Endpoint integration testing (/api/v1/analyze-transcript returns actions).
"""

import json
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.schemas import ActionExtractionResponse, CallIntent
from app.services.intelligence_service import (
    IntelligenceService,
    MalformedModelOutputError,
    intelligence_service,
)


class MockLLMClient:
    """Mock LLM client returning deterministic responses for Phase 5 tests."""

    def __init__(self, responses=None, exception=None, model_name="mock-llama3"):
        self.responses = list(responses) if responses else []
        self.exception = exception
        self.model_name = model_name
        self.call_count = 0

    def generate(self, prompt: str, system=None) -> str:
        self.call_count += 1
        if self.exception:
            raise self.exception
        if self.responses:
            return self.responses.pop(0)
        return json.dumps({
            "intent": {"label": "General Inquiry", "evidence": "What are your hours?"},
            "summary": "Patient inquired about hours.",
            "sentiment": {"label": "Neutral", "explanation": "Inquiry tone."},
            "priority": {"level": "LOW", "reason": "General information request."},
            "actions": [],
        })


@pytest.fixture(autouse=True)
def restore_real_llm_client():
    """Restore singleton intelligence_service LLM client after test run."""
    original_client = intelligence_service._llm_client
    yield
    intelligence_service._llm_client = original_client


# ============================================================================
# Case 1: Clear follow-up action and explicit deadline
# ============================================================================

def test_action_with_clear_followup_and_explicit_deadline():
    """Verify action item with explicit deadline and department is extracted with evidence."""
    transcript = (
        "Patient: I need prior authorization for my post-op MRI. "
        "Staff: I will submit the prior-authorization request to BlueCross today before 5:00 PM."
    )
    mock_output = json.dumps({
        "intent": {"label": "Insurance Query", "evidence": "I need prior authorization for my post-op MRI."},
        "summary": "Patient requested prior authorization for post-op MRI.",
        "sentiment": {"label": "Neutral", "explanation": "Patient is asking about insurance process."},
        "priority": {"level": "MEDIUM", "reason": "Insurance pre-authorization inquiry."},
        "actions": [
            {
                "task": "Submit prior-authorization request to BlueCross",
                "department": "Insurance",
                "priority": "high",
                "deadline": "today before 5:00 PM",
                "evidence_quote": "I will submit the prior-authorization request to BlueCross today before 5:00 PM.",
                "suggested_assignee": None,
                "status": "pending",
            }
        ],
    })
    service = IntelligenceService(MockLLMClient([mock_output]))
    res = service.analyze(transcript=transcript)

    assert len(res.actions) == 1
    act = res.actions[0]
    assert act.task == "Submit prior-authorization request to BlueCross"
    assert act.department == "Insurance"
    assert act.priority == "high"
    assert act.deadline == "today before 5:00 PM"
    assert "today before 5:00 PM" in act.evidence_quote
    assert act.suggested_assignee is None
    assert act.status == "pending"


# ============================================================================
# Case 2: Action containing no deadline
# ============================================================================

def test_action_containing_no_deadline():
    """Verify action with no explicit deadline keeps deadline=None rather than guessing."""
    transcript = (
        "Patient: Has the doctor reviewed my pathology results? "
        "Staff: I will ask Dr. Thorne to review your lab results once they arrive."
    )
    mock_output = json.dumps({
        "intent": {"label": "Follow-up Request", "evidence": "Has the doctor reviewed my pathology results?"},
        "summary": "Patient checking on pathology results.",
        "sentiment": {"label": "Neutral", "explanation": "Standard clinical follow-up."},
        "priority": {"level": "MEDIUM", "reason": "Lab review follow-up."},
        "actions": [
            {
                "task": "Ask Dr. Thorne to review lab results",
                "department": "Clinical Team",
                "priority": "medium",
                "deadline": None,
                "evidence_quote": "I will ask Dr. Thorne to review your lab results once they arrive.",
                "suggested_assignee": "Dr. Thorne",
                "status": "pending",
            }
        ],
    })
    service = IntelligenceService(MockLLMClient([mock_output]))
    res = service.analyze(transcript=transcript)

    assert len(res.actions) == 1
    act = res.actions[0]
    assert act.task == "Ask Dr. Thorne to review lab results"
    assert act.department == "Clinical Team"
    assert act.deadline is None
    assert act.suggested_assignee == "Dr. Thorne"


# ============================================================================
# Case 3: Appointment date must NOT become a task deadline
# ============================================================================

def test_appointment_date_must_not_become_task_deadline():
    """Appointment date or requested consultation time must not be confused with task deadline."""
    transcript = (
        "Patient: I need to book an appointment with Dr. Thorne for next Tuesday at 10:00 AM. "
        "Staff: Sure, I will schedule that appointment for you."
    )
    # The raw model output mistakenly tried to map the appointment date as a deadline
    mock_output = json.dumps({
        "intent": {"label": "Appointment Request", "evidence": "I need to book an appointment with Dr. Thorne"},
        "summary": "Patient booking an appointment.",
        "sentiment": {"label": "Neutral", "explanation": "Routine request."},
        "priority": {"level": "MEDIUM", "reason": "Appointment scheduling."},
        "actions": [
            {
                "task": "Schedule appointment with Dr. Thorne",
                "department": "Reception",
                "priority": "medium",
                "deadline": "next Tuesday at 10:00 AM",  # Appointment time, not task deadline!
                "evidence_quote": "Sure, I will schedule that appointment for you.",
                "suggested_assignee": None,
                "status": "pending",
            }
        ],
    })
    service = IntelligenceService(MockLLMClient([mock_output]))
    res = service.analyze(transcript=transcript)

    assert len(res.actions) == 1
    act = res.actions[0]
    assert act.task == "Schedule appointment with Dr. Thorne"
    # The validation sanitizer detected that 'next Tuesday at 10:00 AM' is an appointment date
    assert act.deadline is None


# ============================================================================
# Case 4: Transcript containing no actionable tasks
# ============================================================================

def test_transcript_containing_no_actionable_tasks():
    """Purely informational queries without follow-up work produce an empty action list."""
    transcript = (
        "Patient: Hello, what are your visiting hours on weekends? "
        "Staff: Weekend visiting hours are from 10:00 AM to 6:00 PM. "
        "Patient: Okay, thank you for the information. Goodbye."
    )
    mock_output = json.dumps({
        "intent": {"label": "General Inquiry", "evidence": "what are your visiting hours on weekends?"},
        "summary": "Patient asked about weekend visiting hours.",
        "sentiment": {"label": "Satisfied", "explanation": "Inquiry answered immediately."},
        "priority": {"level": "LOW", "reason": "General facility information."},
        "actions": [],
    })
    service = IntelligenceService(MockLLMClient([mock_output]))
    res = service.analyze(transcript=transcript)

    assert res.actions == []


# ============================================================================
# Case 5: Transcript with ambiguous ownership or timing
# ============================================================================

def test_transcript_with_ambiguous_ownership_or_timing():
    """Tasks with unstated departments, timing, or owners default to Unknown/None without invention."""
    transcript = (
        "Patient: The waiting room temperature on the second floor is freezing, "
        "someone needs to adjust the AC thermostat."
    )
    mock_output = json.dumps({
        "intent": {"label": "Complaint", "evidence": "someone needs to adjust the AC thermostat"},
        "summary": "Patient reported freezing temperature in waiting room.",
        "sentiment": {"label": "Frustrated", "explanation": "Cold room complaint."},
        "priority": {"level": "LOW", "reason": "Facility comfort issue."},
        "actions": [
            {
                "task": "Adjust waiting room AC thermostat",
                "department": "Facilities",  # Not a standard CareOps clinical/administrative department
                "priority": "low",
                "deadline": None,
                "evidence_quote": "someone needs to adjust the AC thermostat.",
                "suggested_assignee": None,
                "status": "pending",
            }
        ],
    })
    service = IntelligenceService(MockLLMClient([mock_output]))
    res = service.analyze(transcript=transcript)

    assert len(res.actions) == 1
    act = res.actions[0]
    assert act.task == "Adjust waiting room AC thermostat"
    assert act.department == "Unknown"
    assert act.deadline is None
    assert act.suggested_assignee is None


# ============================================================================
# Case 6: Malformed or failed AI response handling
# ============================================================================

def test_malformed_json_response_raises_handled_error():
    """Unparseable model JSON raises MalformedModelOutputError after retries."""
    service = IntelligenceService(MockLLMClient(exception=MalformedModelOutputError("Invalid syntax")))
    with pytest.raises(MalformedModelOutputError):
        service.analyze("Patient wants a refill.")


def test_hallucinated_evidence_quote_rejected():
    """Actions with fabricated evidence quotes not present in the transcript are dropped."""
    transcript = "Patient: I just wanted to say thank you to the nursing team for their help."
    # Model hallucinated an action that has zero backing in the transcript
    hallucinated_output = json.dumps({
        "intent": {"label": "General Inquiry", "evidence": "thank you to the nursing team"},
        "summary": "Patient expressed gratitude.",
        "sentiment": {"label": "Satisfied", "explanation": "Thanking staff."},
        "priority": {"level": "LOW", "reason": "Complimentary call."},
        "actions": [
            {
                "task": "Order insulin refill from pharmacy",
                "department": "Pharmacy",
                "priority": "high",
                "deadline": "Today",
                "evidence_quote": "Please send 30 units of insulin to CVS pharmacy immediately.",
                "suggested_assignee": "Pharmacist Dave",
                "status": "pending",
            }
        ],
    })
    service = IntelligenceService(MockLLMClient([hallucinated_output]))
    res = service.analyze(transcript=transcript)

    # The action was rejected because the evidence quote is completely absent from transcript
    assert res.actions == []


def test_invented_deadline_sanitized_to_none():
    """Model-invented deadlines absent from the transcript text are sanitized to None."""
    transcript = "Staff: I will file the insurance claim form."
    mock_output = json.dumps({
        "intent": {"label": "Insurance Query", "evidence": "I will file the insurance claim form."},
        "summary": "Staff filing insurance claim.",
        "sentiment": {"label": "Neutral", "explanation": "Factual statement."},
        "priority": {"level": "MEDIUM", "reason": "Standard insurance claim."},
        "actions": [
            {
                "task": "File insurance claim form",
                "department": "Insurance",
                "priority": "medium",
                "deadline": "Tomorrow at 09:00 AM sharp",  # Absent from transcript!
                "evidence_quote": "I will file the insurance claim form.",
                "suggested_assignee": None,
                "status": "pending",
            }
        ],
    })
    service = IntelligenceService(MockLLMClient([mock_output]))
    res = service.analyze(transcript=transcript)

    assert len(res.actions) == 1
    assert res.actions[0].deadline is None


# ============================================================================
# Case 7: Action Deduplication
# ============================================================================

def test_duplicate_actions_deduplicated():
    """Identical tasks returned by the model are deduplicated."""
    transcript = "Staff: I will send your referral to cardiology. Again, I will send that referral to cardiology."
    mock_output = json.dumps({
        "intent": {"label": "Follow-up Request", "evidence": "I will send your referral to cardiology."},
        "summary": "Staff referring patient to cardiology.",
        "sentiment": {"label": "Neutral", "explanation": "Referral processing."},
        "priority": {"level": "MEDIUM", "reason": "Specialist referral."},
        "actions": [
            {
                "task": "Send referral to cardiology",
                "department": "Clinical Team",
                "priority": "medium",
                "deadline": None,
                "evidence_quote": "I will send your referral to cardiology.",
                "suggested_assignee": None,
                "status": "pending",
            },
            {
                "task": "Send referral to cardiology",
                "department": "Clinical Team",
                "priority": "medium",
                "deadline": None,
                "evidence_quote": "Again, I will send that referral to cardiology.",
                "suggested_assignee": None,
                "status": "pending",
            },
        ],
    })
    service = IntelligenceService(MockLLMClient([mock_output]))
    res = service.analyze(transcript=transcript)

    assert len(res.actions) == 1


# ============================================================================
# Case 8: Greeting / Insufficient Transcript Produces Empty Actions
# ============================================================================

def test_insufficient_transcript_produces_empty_actions():
    """Short greetings bypass LLM and immediately return empty actions."""
    res = intelligence_service.analyze("Hello? Is anyone there?")
    assert res.actions == []
    assert res.intent.label == "Unknown"


# ============================================================================
# Case 9: API Endpoint Integration Test
# ============================================================================

def test_api_endpoint_returns_extracted_actions(client: TestClient):
    """POST /api/v1/analyze-transcript returns actions in the response payload."""
    mock_output = json.dumps({
        "intent": {"label": "Medicine Refill", "evidence": "I need my blood pressure pills refilled."},
        "summary": "Patient requested blood pressure medication refill.",
        "sentiment": {"label": "Neutral", "explanation": "Routine prescription refill request."},
        "priority": {"level": "MEDIUM", "reason": "Medication refill inquiry."},
        "actions": [
            {
                "task": "Submit lisinopril refill request to pharmacy",
                "department": "Pharmacy",
                "priority": "medium",
                "deadline": "within 24 hours",
                "evidence_quote": "I will send the refill order to your pharmacy within 24 hours.",
                "suggested_assignee": "Nurse Elena",
                "status": "pending",
            }
        ],
    })
    intelligence_service.set_llm_client(MockLLMClient([mock_output]))

    response = client.post(
        "/api/v1/analyze-transcript",
        json={
            "transcript": "Patient: I need my blood pressure pills refilled. Staff: I will send the refill order to your pharmacy within 24 hours. Nurse Elena is on duty.",
            "language": "en",
            "call_id": "call-refill-441",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "actions" in data
    assert len(data["actions"]) == 1
    act = data["actions"][0]
    assert act["id"] == "act-call-refill-441-1"
    assert act["task"] == "Submit lisinopril refill request to pharmacy"
    assert act["department"] == "Pharmacy"
    assert act["priority"] == "medium"
    assert act["deadline"] == "within 24 hours"
    assert act["suggested_assignee"] == "Nurse Elena"
    assert act["status"] == "pending"
