import { AuditEvent } from "@/shared/types/audit";

export const mockCallAuditEvents: Record<string, AuditEvent[]> = {
  "call-live-001": [
    {
      id: "aud-101",
      callId: "call-live-001",
      stage: "CALL_RECEIVED",
      title: "Incoming Telephony Packet Ingested",
      description: "SIP trunk connected from +1 (555) 234-8901 into CareOps Audio Gateway Node #4.",
      timestamp: "10:20 AM",
      actor: "CareOps Engine",
    },
    {
      id: "aud-102",
      callId: "call-live-001",
      stage: "AUDIO_PROCESSED",
      title: "Speech Processing & Diarization",
      description: "Audio stream diarized into 2 channels (Agent: CareOps Voice, Patient: Rahul Sharma).",
      timestamp: "10:21 AM",
      actor: "System AI",
    },
    {
      id: "aud-103",
      callId: "call-live-001",
      stage: "AI_ANALYSIS_COMPLETED",
      title: "Clinical Intent & Sentiment Inferred",
      description: "Intent identified as Appointment Request (0.96 conf); Sentiment evaluated as Concerned (-0.38). Clinical flag: Post-op fever.",
      timestamp: "10:22 AM",
      actor: "System AI",
    },
    {
      id: "aud-104",
      callId: "call-live-001",
      stage: "TASK_EXTRACTED",
      title: "Action Item & Commitment Extracted",
      description: "Extracted 3 tasks and 2 commitments with cryptographic transcript byte anchors.",
      timestamp: "10:23 AM",
      actor: "System AI",
    },
    {
      id: "aud-105",
      callId: "call-live-001",
      stage: "ROUTED_TO_DEPARTMENT",
      title: "Smart Department Routing Executed",
      description: "Auto-routed task #act-101 to Reception Desk and task #act-102 to Insurance Pre-Auth.",
      timestamp: "10:25 AM",
      actor: "CareOps Engine",
    },
    {
      id: "aud-106",
      callId: "call-live-001",
      stage: "STAFF_ASSIGNED",
      title: "Staff Assignment & SLA Clock Activated",
      description: "Assigned to Sarah Jenkins (Reception Lead). 24h SLA target countdown initiated.",
      timestamp: "10:25 AM",
      actor: "Staff User",
    },
  ],
  "call-002": [
    {
      id: "aud-201",
      callId: "call-002",
      stage: "CALL_RECEIVED",
      title: "Inbound Call Connected",
      description: "Elena Morales connected via Insurance Helpline.",
      timestamp: "10:45 AM",
      actor: "CareOps Engine",
    },
    {
      id: "aud-202",
      callId: "call-002",
      stage: "AI_ANALYSIS_COMPLETED",
      title: "Urgency Escalate Triggered",
      description: "Frustrated sentiment detected (-0.65). Cardiac procedure delay detected.",
      timestamp: "10:48 AM",
      actor: "System AI",
    },
    {
      id: "aud-203",
      callId: "call-002",
      stage: "ROUTED_TO_DEPARTMENT",
      title: "Routed to Senior Prior-Auth",
      description: "Prior-auth ticket assigned to Marcus Vance with 4h expedited SLA.",
      timestamp: "10:50 AM",
      actor: "CareOps Engine",
    },
  ],
};

/**
 * Future backend replacement: src/features/platform/apiAuditService.ts
 */
export const mockAuditService = {
  async getAuditTimeline(callId: string): Promise<AuditEvent[]> {
    await new Promise((r) => setTimeout(r, 40));
    return mockCallAuditEvents[callId] || mockCallAuditEvents["call-live-001"];
  },
};
