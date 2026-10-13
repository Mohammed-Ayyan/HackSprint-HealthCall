import { Call, CallPriority, CallIntent, CallSentiment } from "@/shared/types/call";
import { mockLiveCall } from "@/features/ai-intelligence/mockCallService";

export const mockCallsList: Call[] = [
  mockLiveCall,
  {
    id: "call-002",
    callNumber: "CC-2026-9841",
    patient: {
      id: "pat-102",
      name: "Elena Morales",
      age: 54,
      gender: "Female",
      phone: "+1 (555) 392-1104",
      mrn: "MRN-672194",
      insuranceProvider: "Aetna Health Choice",
    },
    duration: "06:12",
    durationSeconds: 372,
    timestamp: "2026-10-13T10:45:00Z",
    status: "analyzed",
    priority: "high",
    intent: "Insurance Query",
    secondaryIntents: ["Complaint"],
    sentiment: "frustrated",
    sentimentScore: -0.65,
    summary: {
      overview:
        "Patient expressed strong frustration regarding a 3-week delay on cardiac catheterization insurance pre-authorization. Hospital billing indicated pending insurer clearance while Aetna representative reportedly claimed documentation was missing from the cardiology desk.",
      keyPoints: [
        "Pre-authorization delayed for 21 days",
        "Procedure: Cardiac catheterization scheduled next Tuesday",
        "Aetna claims physician clinical notes were missing",
        "Patient threatened hospital ombudsman complaint if postponed",
      ],
      clinicalFlags: ["Time-sensitive Cardiology Procedure"],
      insurancePending: true,
      confidenceScore: 0.98,
    },
    transcript: [
      {
        id: "t-201",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "Thank you for contacting Metro Health Insurance Relations. How may I assist you today?",
        timestamp: "00:03",
        offsetSeconds: 3,
      },
      {
        id: "t-202",
        speaker: "patient",
        speakerName: "Elena Morales",
        text: "I am furious. I was supposed to have my heart catheterization next Tuesday, but Aetna told me today that Metro Health still hasn't sent the doctor's clinical notes! I have been waiting three weeks!",
        timestamp: "00:15",
        offsetSeconds: 15,
        sentiment: "angry",
        highlighted: true,
      },
      {
        id: "t-203",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "I completely understand how stressful this is, Ms. Morales, especially with a cardiac procedure next week. Let me immediately open your file and coordinate directly with Cardiology records.",
        timestamp: "00:34",
        offsetSeconds: 34,
      },
      {
        id: "t-204",
        speaker: "patient",
        speakerName: "Elena Morales",
        text: "If this procedure gets postponed because of missing paperwork, I am filing an official complaint with the medical board.",
        timestamp: "00:52",
        offsetSeconds: 52,
        sentiment: "frustrated",
        highlighted: true,
      },
      {
        id: "t-205",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "I will personally escalate this to our Senior Insurance Case Manager. We will fax the signed cardiac documentation to Aetna within the hour, and I will text you the insurer confirmation receipt by 2:00 PM today.",
        timestamp: "01:10",
        offsetSeconds: 70,
        highlighted: true,
      },
    ],
    actions: [
      {
        id: "act-201",
        task: "Fax Dr. Chen's signed cardiac notes to Aetna expedited portal",
        department: "Insurance",
        priority: "high",
        deadline: "Today 01:00 PM",
        evidenceQuote: "Aetna told me today that Metro Health still hasn't sent the doctor's clinical notes!",
        suggestedAssignee: "Marcus Vance",
        status: "in-progress",
      },
      {
        id: "act-202",
        task: "Send confirmation SMS with Aetna pre-auth reference number to patient",
        department: "Customer Support",
        priority: "medium",
        deadline: "Today 02:00 PM",
        evidenceQuote: "I will text you the insurer confirmation receipt by 2:00 PM today.",
        suggestedAssignee: "Lisa Ray",
        status: "pending",
      },
    ],
    commitments: [
      {
        id: "com-201",
        commitment: "Fax signed clinical notes to Aetna within the hour",
        owner: "Insurance Prior-Auth Team",
        deadline: "Today 01:00 PM",
        timestamp: "01:10",
        status: "pending",
        evidenceQuote: "We will fax the signed cardiac documentation to Aetna within the hour.",
      },
      {
        id: "com-202",
        commitment: "Text patient pre-auth confirmation receipt by 2:00 PM",
        owner: "Customer Support",
        deadline: "Today 02:00 PM",
        timestamp: "01:10",
        status: "pending",
        evidenceQuote: "I will text you the insurer confirmation receipt by 2:00 PM today.",
      },
    ],
    assignedDepartment: "Insurance",
    agentName: "CareOps AI Voice Node #1",
    slaRemainingHours: 1.2,
  },
  {
    id: "call-003",
    callNumber: "CC-2026-9840",
    patient: {
      id: "pat-103",
      name: "Michael Chen",
      age: 39,
      gender: "Male",
      phone: "+1 (555) 774-2918",
      mrn: "MRN-331902",
      insuranceProvider: "UnitedHealthcare Choice",
    },
    duration: "02:45",
    durationSeconds: 165,
    timestamp: "2026-10-13T09:30:00Z",
    status: "analyzed",
    priority: "medium",
    intent: "Appointment Request",
    secondaryIntents: [],
    sentiment: "neutral",
    sentimentScore: 0.1,
    summary: {
      overview:
        "Patient called to book a regular quarterly diabetic checkup and HbA1c review with Dr. Miriam Vance. Prefers late afternoon slot on Thursday or Friday.",
      keyPoints: [
        "Routine diabetes follow-up consultation",
        "HbA1c blood test requisition needed before visit",
        "Patient requests appointment after 4:00 PM",
      ],
      clinicalFlags: ["Quarterly HbA1c screening due"],
      insurancePending: false,
      confidenceScore: 0.99,
    },
    transcript: [
      {
        id: "t-301",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "Good morning! Metro Health Scheduling. How can I help you?",
        timestamp: "00:02",
        offsetSeconds: 2,
      },
      {
        id: "t-302",
        speaker: "patient",
        speakerName: "Michael Chen",
        text: "Hi, I need to schedule my quarterly diabetes checkup with Dr. Miriam Vance. Ideally Thursday or Friday late afternoon after 4 PM.",
        timestamp: "00:12",
        offsetSeconds: 12,
        sentiment: "neutral",
      },
      {
        id: "t-303",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "Dr. Vance has an opening this Friday, October 17th at 4:30 PM. Would you also like us to order the preliminary HbA1c blood draw at the clinic lab?",
        timestamp: "00:26",
        offsetSeconds: 26,
      },
      {
        id: "t-304",
        speaker: "patient",
        speakerName: "Michael Chen",
        text: "Yes, please. That slot is perfect. Can you email me the calendar invitation and prep instructions?",
        timestamp: "00:41",
        offsetSeconds: 41,
        sentiment: "positive",
      },
      {
        id: "t-305",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "Done! I will send the calendar invite and fasting lab guidelines to your email on file right now.",
        timestamp: "00:55",
        offsetSeconds: 55,
      },
    ],
    actions: [
      {
        id: "act-301",
        task: "Book Dr. Vance appointment for Friday 4:30 PM",
        department: "Reception",
        priority: "medium",
        deadline: "Today 05:00 PM",
        evidenceQuote: "Dr. Vance has an opening this Friday, October 17th at 4:30 PM.",
        suggestedAssignee: "Sarah Jenkins",
        status: "completed",
      },
      {
        id: "act-302",
        task: "Generate preliminary HbA1c lab requisition order",
        department: "Clinical Team",
        priority: "low",
        deadline: "Tomorrow 12:00 PM",
        evidenceQuote: "Would you also like us to order the preliminary HbA1c blood draw at the clinic lab?",
        suggestedAssignee: "Dr. Miriam Vance",
        status: "assigned",
      },
    ],
    commitments: [
      {
        id: "com-301",
        commitment: "Email calendar invite and fasting lab instructions to patient",
        owner: "Reception Team",
        deadline: "Today 11:00 AM",
        timestamp: "00:55",
        status: "fulfilled",
        evidenceQuote: "I will send the calendar invite and fasting lab guidelines to your email on file right now.",
      },
    ],
    assignedDepartment: "Reception",
    agentName: "CareOps AI Voice Node #2",
    slaRemainingHours: 6.0,
  },
  {
    id: "call-004",
    callNumber: "CC-2026-9839",
    patient: {
      id: "pat-104",
      name: "Fatima Al-Mansoor",
      age: 62,
      gender: "Female",
      phone: "+1 (555) 819-4420",
      mrn: "MRN-190442",
      insuranceProvider: "Cigna Comprehensive",
    },
    duration: "04:50",
    durationSeconds: 290,
    timestamp: "2026-10-13T08:15:00Z",
    status: "triaged",
    priority: "high",
    intent: "Billing Issue",
    secondaryIntents: ["Complaint"],
    sentiment: "angry",
    sentimentScore: -0.78,
    summary: {
      overview:
        "Patient identified an erroneous duplicate copay invoice of $450 for brain MRI scan performed in August. Her credit card was debited twice by the automated billing merchant account.",
      keyPoints: [
        "Duplicate debit of $450 on Sept 28 and Oct 10",
        "Procedure: Brain MRI with contrast (Aug 14)",
        "Demanding immediate refund to Visa ending in 4109",
        "Requested written statement acknowledging billing ledger error",
      ],
      clinicalFlags: [],
      insurancePending: false,
      confidenceScore: 0.97,
    },
    transcript: [
      {
        id: "t-401",
        speaker: "patient",
        speakerName: "Fatima Al-Mansoor",
        text: "I am looking at my bank statement right now and Metro Health charged my credit card $450 twice for the exact same MRI scan from August! This is unacceptable!",
        timestamp: "00:08",
        offsetSeconds: 8,
        sentiment: "angry",
        highlighted: true,
      },
      {
        id: "t-402",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "Mrs. Al-Mansoor, I sincerely apologize for this duplicate billing issue. I can pull up invoice #INV-8910 right away. I see the second payment capture was triggered by an automatic reprocessing batch.",
        timestamp: "00:30",
        offsetSeconds: 30,
      },
      {
        id: "t-403",
        speaker: "patient",
        speakerName: "Fatima Al-Mansoor",
        text: "I need that $450 refunded immediately. Not in 30 days, right now.",
        timestamp: "00:48",
        offsetSeconds: 48,
        sentiment: "frustrated",
        highlighted: true,
      },
      {
        id: "t-404",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "I am creating an immediate merchant refund authorization ticket. Our billing manager David Ross will initiate the $450 credit back to your card ending in 4109 within 3 business hours.",
        timestamp: "01:05",
        offsetSeconds: 65,
        highlighted: true,
      },
    ],
    actions: [
      {
        id: "act-401",
        task: "Process $450 merchant refund to card ending 4109",
        department: "Billing",
        priority: "high",
        deadline: "Today 01:00 PM",
        evidenceQuote: "Metro Health charged my credit card $450 twice for the exact same MRI scan from August!",
        suggestedAssignee: "David Ross (Billing Manager)",
        status: "in-progress",
      },
      {
        id: "act-402",
        task: "Issue corrected zero-balance PDF statement to patient email",
        department: "Billing",
        priority: "medium",
        deadline: "Today 04:00 PM",
        evidenceQuote: "Requested written statement acknowledging billing ledger error.",
        suggestedAssignee: "Chloe Martin",
        status: "assigned",
      },
    ],
    commitments: [
      {
        id: "com-401",
        commitment: "Initiate $450 refund credit within 3 business hours",
        owner: "Billing Department",
        deadline: "Today 12:00 PM",
        timestamp: "01:05",
        status: "in-progress",
        evidenceQuote: "Our billing manager David Ross will initiate the $450 credit back to your card ending in 4109 within 3 business hours.",
      },
    ],
    assignedDepartment: "Billing",
    agentName: "CareOps AI Voice Node #3",
    slaRemainingHours: 0.8,
  },
  {
    id: "call-005",
    callNumber: "CC-2026-9838",
    patient: {
      id: "pat-105",
      name: "David Kowalski",
      age: 71,
      gender: "Male",
      phone: "+1 (555) 402-8819",
      mrn: "MRN-551028",
      insuranceProvider: "Medicare Part D + Humana",
    },
    duration: "03:10",
    durationSeconds: 190,
    timestamp: "2026-10-13T07:45:00Z",
    status: "analyzed",
    priority: "medium",
    intent: "Medicine Refill",
    secondaryIntents: [],
    sentiment: "concerned",
    sentimentScore: -0.22,
    summary: {
      overview:
        "Patient David Kowalski is running low on blood pressure medication (Lisinopril 20mg) and diabetes medication (Metformin 1000mg). Pharmacy indicated 0 refills remaining on existing script. Requests 90-day renewal sent to Walgreens on 5th Ave.",
      keyPoints: [
        "Medications: Lisinopril 20mg daily, Metformin 1000mg BID",
        "Only 2 days of supply remaining at home",
        "Walgreens #4019 pharmacy specified",
        "Needs physician electronic authorization",
      ],
      clinicalFlags: ["Hypertension Medication Gap Risk (<48 hrs supply)"],
      insurancePending: false,
      confidenceScore: 0.96,
    },
    transcript: [
      {
        id: "t-501",
        speaker: "patient",
        speakerName: "David Kowalski",
        text: "Hello, I went to Walgreens this morning and they said I have zero refills left on my Lisinopril and Metformin. I only have enough pills for today and tomorrow.",
        timestamp: "00:10",
        offsetSeconds: 10,
        sentiment: "concerned",
        highlighted: true,
      },
      {
        id: "t-502",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "Good morning, Mr. Kowalski. You must not miss your blood pressure doses. I will send an urgent refill authorization packet directly to Dr. Thorne's prescribing queue.",
        timestamp: "00:28",
        offsetSeconds: 28,
      },
      {
        id: "t-503",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "We will contact Walgreens on 5th Ave by 1:00 PM today so your 90-day refill will be ready for pickup this afternoon.",
        timestamp: "00:49",
        offsetSeconds: 49,
        highlighted: true,
      },
    ],
    actions: [
      {
        id: "act-501",
        task: "Route 90-day Lisinopril/Metformin refill authorization to Dr. Thorne",
        department: "Pharmacy",
        priority: "medium",
        deadline: "Today 12:00 PM",
        evidenceQuote: "I only have enough pills for today and tomorrow.",
        suggestedAssignee: "Pharm. Robert Sterling",
        status: "assigned",
      },
      {
        id: "act-502",
        task: "Transmit approved electronic script to Walgreens Store #4019",
        department: "Pharmacy",
        priority: "medium",
        deadline: "Today 01:00 PM",
        evidenceQuote: "We will contact Walgreens on 5th Ave by 1:00 PM today.",
        suggestedAssignee: "Pharm. Robert Sterling",
        status: "pending",
      },
    ],
    commitments: [
      {
        id: "com-501",
        commitment: "Contact Walgreens by 1:00 PM so 90-day supply is ready for afternoon pickup",
        owner: "Pharmacy Team",
        deadline: "Today 01:00 PM",
        timestamp: "00:49",
        status: "pending",
        evidenceQuote: "We will contact Walgreens on 5th Ave by 1:00 PM today so your 90-day refill will be ready for pickup.",
      },
    ],
    assignedDepartment: "Pharmacy",
    agentName: "CareOps AI Voice Node #4",
    slaRemainingHours: 2.1,
  },
  {
    id: "call-006",
    callNumber: "CC-2026-9837",
    patient: {
      id: "pat-106",
      name: "Samantha Reyes",
      age: 29,
      gender: "Female",
      phone: "+1 (555) 912-7003",
      mrn: "MRN-902141",
      insuranceProvider: "Kaiser Permanente",
    },
    duration: "01:52",
    durationSeconds: 112,
    timestamp: "2026-10-13T06:50:00Z",
    status: "analyzed",
    priority: "critical",
    intent: "Emergency Concern",
    secondaryIntents: [],
    sentiment: "frustrated",
    sentimentScore: -0.85,
    summary: {
      overview:
        "CRITICAL TRIAGE: Patient reported sudden onset acute dyspnea (shortness of breath) accompanied by left radiating shoulder pain and cold clamminess. CareOps AI protocol immediately triggered 911 EMS dispatch transfer and alerted on-duty emergency attending physician.",
      keyPoints: [
        "Sudden chest tightness and left arm pain",
        "Severe shortness of breath while resting",
        "Automated emergency protocol activated",
        "Transferred directly to 911 dispatch while retaining audio line",
      ],
      clinicalFlags: ["Suspected Acute Coronary Syndrome (ACS)", "911 EMS Dispatched"],
      insurancePending: false,
      confidenceScore: 0.99,
    },
    transcript: [
      {
        id: "t-601",
        speaker: "patient",
        speakerName: "Samantha Reyes",
        text: "I can barely breathe... my chest feels like someone is standing on it and my left arm is throbbing with pain...",
        timestamp: "00:05",
        offsetSeconds: 5,
        sentiment: "angry",
        highlighted: true,
      },
      {
        id: "t-602",
        speaker: "agent",
        speakerName: "AI Call Agent (CareOps)",
        text: "Ms. Reyes, stay calm and sit down immediately. I am activating emergency protocols right now and connecting 911 EMS dispatch to our line. Do not hang up.",
        timestamp: "00:18",
        offsetSeconds: 18,
      },
      {
        id: "t-603",
        speaker: "system",
        speakerName: "CareOps Emergency Bridge",
        text: "CRITICAL ALERT: Emergency EMS bridge connected. GPS coordinate dispatch sent to 442 Maple Lane.",
        timestamp: "00:35",
        offsetSeconds: 35,
        highlighted: true,
      },
    ],
    actions: [
      {
        id: "act-601",
        task: "EMS 911 Ambulance Dispatched to patient residence",
        department: "Emergency Triage",
        priority: "critical",
        deadline: "Immediate (Under 10 mins)",
        evidenceQuote: "I can barely breathe... my chest feels like someone is standing on it and my left arm is throbbing.",
        suggestedAssignee: "EMS Dispatch Coordinator",
        status: "completed",
      },
      {
        id: "act-602",
        task: "Notify ER Trauma Bay 2 for incoming cardiac arrival",
        department: "Emergency Triage",
        priority: "critical",
        deadline: "Immediate",
        evidenceQuote: "Sudden chest tightness and left arm pain.",
        suggestedAssignee: "Dr. Gregory Vance (ER Attending)",
        status: "in-progress",
      },
    ],
    commitments: [
      {
        id: "com-601",
        commitment: "Maintain emergency voice line open until paramedic arrival",
        owner: "Emergency Operations",
        deadline: "Immediate",
        timestamp: "00:18",
        status: "fulfilled",
        evidenceQuote: "I am activating emergency protocols right now and connecting 911 EMS dispatch to our line. Do not hang up.",
      },
    ],
    assignedDepartment: "Emergency Triage",
    agentName: "CareOps AI Emergency Sentry",
    slaRemainingHours: 0.1,
  },
];

/**
 * Future backend replacement: src/features/workflow/apiCallsService.ts
 */
export const mockCallsService = {
  async getCalls(filters?: {
    search?: string;
    priority?: string;
    department?: string;
    status?: string;
    intent?: string;
  }): Promise<Call[]> {
    await new Promise((r) => setTimeout(r, 60));
    let calls = [...mockCallsList];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      calls = calls.filter(
        (c) =>
          c.patient.name.toLowerCase().includes(q) ||
          c.patient.mrn.toLowerCase().includes(q) ||
          c.summary.overview.toLowerCase().includes(q) ||
          c.callNumber.toLowerCase().includes(q)
      );
    }
    if (filters?.priority && filters.priority !== "all") {
      calls = calls.filter((c) => c.priority === filters.priority);
    }
    if (filters?.department && filters.department !== "all") {
      calls = calls.filter(
        (c) => c.assignedDepartment.toLowerCase() === filters.department?.toLowerCase()
      );
    }
    if (filters?.status && filters.status !== "all") {
      calls = calls.filter((c) => c.status === filters.status);
    }
    if (filters?.intent && filters.intent !== "all") {
      calls = calls.filter((c) => c.intent === filters.intent);
    }

    return calls;
  },

  async getCallById(id: string): Promise<Call | undefined> {
    await new Promise((r) => setTimeout(r, 60));
    return mockCallsList.find((c) => c.id === id);
  },

  async getRecentCalls(limit = 5): Promise<Call[]> {
    await new Promise((r) => setTimeout(r, 40));
    return mockCallsList.slice(0, limit);
  },
};
