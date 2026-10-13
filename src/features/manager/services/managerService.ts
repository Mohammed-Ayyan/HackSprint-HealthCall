import { ManagerOverviewData, EmployeeWorkload, EscalationCase } from "../types";

export const mockManagerOverview: ManagerOverviewData = {
  managerName: "Dr. Eleanor Vance",
  departmentName: "Surgical Recovery & Care Operations",
  totalEmployeesCount: 18,
  activeTasksCount: 32,
  completedTasksCount: 114,
  overdueTasksCount: 3,
  avgResolutionHours: 1.8,
  departmentVitalityScore: 97,
};

export const mockEmployeeWorkloads: EmployeeWorkload[] = [
  {
    id: "emp-1",
    name: "Clara Oswald",
    role: "Front Desk & Intake Lead",
    activeTasks: 6,
    completedToday: 22,
    overdueTasks: 0,
    workloadStatus: "Optimal",
    efficiencyRating: 98,
  },
  {
    id: "emp-2",
    name: "Marcus Sterling",
    role: "Senior Insurance Coordinator",
    activeTasks: 9,
    completedToday: 18,
    overdueTasks: 1,
    workloadStatus: "Near Capacity",
    efficiencyRating: 92,
  },
  {
    id: "emp-3",
    name: "Sarah Jenkins, RN",
    role: "Post-Op Triage Specialist",
    activeTasks: 7,
    completedToday: 26,
    overdueTasks: 0,
    workloadStatus: "Balanced",
    efficiencyRating: 96,
  },
  {
    id: "emp-4",
    name: "James Patel",
    role: "Pharmacy Dispatch Coordinator",
    activeTasks: 10,
    completedToday: 15,
    overdueTasks: 2,
    workloadStatus: "Overloaded",
    efficiencyRating: 88,
  },
];

export const mockEscalationCases: EscalationCase[] = [
  {
    id: "esc-01",
    patientName: "Rahul Sharma",
    callId: "CC-2026-9842",
    issue: "BlueCross diagnostic ultrasound prior-auth approaching clinical 4-hour SLA window",
    type: "Overdue Commitment",
    priority: "Urgent",
    assignedTo: "Marcus Sterling",
    overdueBy: "+42 mins",
    status: "Escalated",
  },
  {
    id: "esc-02",
    patientName: "Marcus Vance",
    callId: "CC-2026-9840",
    issue: "ECG laboratory report awaiting cardiology co-signature before outpatient release",
    type: "High Priority Case",
    priority: "High",
    assignedTo: "Dr. Rahul",
    overdueBy: "+1.2 hrs",
    status: "Under Review",
  },
  {
    id: "esc-03",
    patientName: "Eleanor Rigby",
    callId: "CC-2026-9831",
    issue: "Specialty biologics pharmacy dispensation rejected by third-party administrator",
    type: "Pending Clinical Approval",
    priority: "Urgent",
    assignedTo: "James Patel",
    overdueBy: "+2.0 hrs",
    status: "Escalated",
  },
];

let escalationStore = [...mockEscalationCases];
let workloadsStore = [...mockEmployeeWorkloads];

/**
 * Manager Service (API-Ready Layer)
 * Future replacement point: GET /api/manager/overview, PUT /api/manager/escalations/[id]
 */
export const managerService = {
  async getOverview(): Promise<ManagerOverviewData> {
    await new Promise((r) => setTimeout(r, 40));
    return mockManagerOverview;
  },

  async getEmployeeWorkloads(): Promise<EmployeeWorkload[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...workloadsStore];
  },

  async getEscalations(): Promise<EscalationCase[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...escalationStore];
  },

  async reassignEscalation(id: string, newEmployee: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const esc = escalationStore.find((e) => e.id === id);
    if (!esc) return false;
    esc.assignedTo = newEmployee;
    esc.status = "Reassigned";
    return true;
  },

  async updateEscalationPriority(id: string, priority: EscalationCase["priority"]): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const esc = escalationStore.find((e) => e.id === id);
    if (!esc) return false;
    esc.priority = priority;
    return true;
  },

  async resolveEscalation(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const esc = escalationStore.find((e) => e.id === id);
    if (!esc) return false;
    esc.status = "Resolved";
    return true;
  },
};
