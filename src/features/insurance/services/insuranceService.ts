import { InsuranceOverviewData, InsuranceClaim, ClaimTimelineStage } from "../types";

export const mockInsuranceOverview: InsuranceOverviewData = {
  employeeName: "Marcus Sterling",
  department: "RCM & Prior-Authorization Division",
  pendingClaimsCount: 14,
  approvedClaimsCount: 42,
  rejectedClaimsCount: 3,
  urgentCasesCount: 4,
};

export const mockInsuranceClaims: InsuranceClaim[] = [
  {
    id: "ic-01",
    claimId: "CLM-992014-BC",
    patientName: "Rahul Sharma",
    mrn: "MRN-884920",
    payerName: "BlueCross Premier PPO",
    claimType: "Prior-Authorization",
    status: "Pending Review",
    priority: "Urgent",
    deadline: "Today 04:00 PM",
    amount: "$3,450.00",
    aiConversationSummary:
      "Patient contacted hospital regarding delayed approval for post-operative wound imaging and diagnostic ultrasound.",
    requiredAction: "Verify claim status with BlueCross electronic EDI clearinghouse and submit clinical notes.",
    currentStage: "Reviewed",
    timelineHistory: [
      {
        stage: "Submitted",
        timestamp: "Oct 12, 09:15 AM",
        details: "Prior-authorization batch #8812 transmitted via CMS-1500 EDI.",
        completed: true,
      },
      {
        stage: "Reviewed",
        timestamp: "Oct 13, 10:45 AM",
        details: "CareOps AI flagged delay warning from caller conversation. Assigned to Marcus Sterling.",
        completed: true,
      },
      {
        stage: "Updated",
        timestamp: "Pending",
        details: "Carrier requested additional ICD-10 post-op fever documentation.",
        completed: false,
      },
      {
        stage: "Completed",
        timestamp: "Pending",
        details: "Final determination & electronic remittance advice notification to patient.",
        completed: false,
      },
    ],
  },
  {
    id: "ic-02",
    claimId: "CLM-772109-AE",
    patientName: "Ananya Patel",
    mrn: "MRN-773194",
    payerName: "Aetna Choice POS II",
    claimType: "Post-Op Surgical Coverage",
    status: "Approved",
    priority: "Medium",
    deadline: "Oct 16, 2026",
    amount: "$8,920.00",
    aiConversationSummary:
      "Patient requested verification that outpatient laparoscopic cholecystectomy facility fee is covered under tier 1 in-network deductible.",
    requiredAction: "Archive pre-determination letter and sync patient billing balance.",
    currentStage: "Completed",
    timelineHistory: [
      { stage: "Submitted", timestamp: "Oct 06, 11:00 AM", details: "Initial surgery package submitted.", completed: true },
      { stage: "Reviewed", timestamp: "Oct 08, 02:30 PM", details: "Medical necessity reviewed by medical director.", completed: true },
      { stage: "Updated", timestamp: "Oct 10, 09:15 AM", details: "Explanation of benefits received with 90% allowance.", completed: true },
      { stage: "Completed", timestamp: "Oct 11, 04:00 PM", details: "Approved without co-insurance penalty.", completed: true },
    ],
  },
  {
    id: "ic-03",
    claimId: "CLM-551029-UH",
    patientName: "Marcus Vance",
    mrn: "MRN-659201",
    payerName: "UnitedHealthcare Choice",
    claimType: "Diagnostic Imaging",
    status: "Under Carrier Audit",
    priority: "High",
    deadline: "Tomorrow 12:00 PM",
    amount: "$1,850.00",
    aiConversationSummary:
      "Patient phoned after receiving surprise out-of-network denial for cardiovascular stress testing.",
    requiredAction: "Initiate first-level appeal with in-network exception clause due to hospital emergency protocol.",
    currentStage: "Updated",
    timelineHistory: [
      { stage: "Submitted", timestamp: "Oct 09, 01:20 PM", details: "Stress echo authorization request filed.", completed: true },
      { stage: "Reviewed", timestamp: "Oct 11, 10:15 AM", details: "Underwriting initial review queried provider NPI.", completed: true },
      { stage: "Updated", timestamp: "Oct 13, 08:30 AM", details: "Hospital billing attached clinical emergency note.", completed: true },
      { stage: "Completed", timestamp: "Pending", details: "Awaiting final payer ruling.", completed: false },
    ],
  },
  {
    id: "ic-04",
    claimId: "CLM-331902-CI",
    patientName: "Eleanor Rigby",
    mrn: "MRN-110294",
    payerName: "Cigna Open Access",
    claimType: "Medication Approval",
    status: "Rejected",
    priority: "Urgent",
    deadline: "Immediate",
    amount: "$640.00",
    aiConversationSummary:
      "Patient called pharmacy reporting denied tier-3 biological anti-inflammatory injection.",
    requiredAction: "Submit peer-to-peer review request with Dr. Vance within 24 hours.",
    currentStage: "Updated",
    timelineHistory: [
      { stage: "Submitted", timestamp: "Oct 10, 04:00 PM", details: "Specialty pharmacy script request.", completed: true },
      { stage: "Reviewed", timestamp: "Oct 12, 11:30 AM", details: "Formulary exception denied by pharmacy benefit manager.", completed: true },
      { stage: "Updated", timestamp: "Oct 13, 11:00 AM", details: "CareOps AI flagged patient distress over missing medication.", completed: true },
      { stage: "Completed", timestamp: "Pending", details: "Escalated to peer-to-peer doctor queue.", completed: false },
    ],
  },
];

let claimsStore = [...mockInsuranceClaims];

/**
 * Insurance Service (API-Ready Layer)
 * Future replacement point: GET /api/insurance/claims, PUT /api/insurance/claims/[id]
 */
export const insuranceService = {
  async getOverview(): Promise<InsuranceOverviewData> {
    await new Promise((r) => setTimeout(r, 40));
    return mockInsuranceOverview;
  },

  async getClaims(): Promise<InsuranceClaim[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...claimsStore];
  },

  async getClaimById(id: string): Promise<InsuranceClaim | undefined> {
    await new Promise((r) => setTimeout(r, 30));
    return claimsStore.find((c) => c.id === id);
  },

  async updateClaimStage(id: string, stage: ClaimTimelineStage): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const claim = claimsStore.find((c) => c.id === id);
    if (!claim) return false;
    claim.currentStage = stage;
    const historyItem = claim.timelineHistory.find((h) => h.stage === stage);
    if (historyItem) {
      historyItem.completed = true;
      historyItem.timestamp = "Just now";
    }
    if (stage === "Completed") {
      claim.status = "Approved";
    }
    return true;
  },

  async updateClaimStatus(id: string, status: InsuranceClaim["status"]): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const claim = claimsStore.find((c) => c.id === id);
    if (!claim) return false;
    claim.status = status;
    return true;
  },
};
