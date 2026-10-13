import { DoctorOverviewData, DoctorQueuePatient, DoctorFollowUp } from "../types";

export const mockDoctorOverview: DoctorOverviewData = {
  doctorName: "Dr. Rahul",
  specialty: "Post-Surgical General & Acute Recovery",
  department: "Clinical Pavilion 3",
  todaysAppointmentsCount: 8,
  pendingFollowupsCount: 5,
  urgentCasesCount: 2,
  nextPatientTime: "10:30 AM",
};

export const mockDoctorQueuePatients: DoctorQueuePatient[] = [
  {
    id: "pat-rahul-sharma",
    mrn: "MRN-884920",
    name: "Rahul Sharma",
    age: 42,
    gender: "Male",
    appointmentTime: "10:30 AM",
    issue: "Post-op wound redness & low-grade fever after laparoscopic appendectomy",
    priority: "urgent",
    status: "Checked In",
    roomNumber: "Room 412",
    aiBrief: {
      summary: "Patient requested urgent consultation after surgery.",
      previousConversation:
        "Telephony call 2 hours ago: Reported 100.8°F oral temp and periumbilical tightness. Expressed concern over infection and pending BlueCross ultrasound pre-auth.",
      pendingIssue: "Fever progression check; inspection of incision erythema; pending ultrasound authorization.",
      requiredAction:
        "Physical inspection of suture margin, order rapid CRP/WBC labs, and sign expedited prior-authorization request.",
      keyVitalsAlert: "Temp 100.8°F • Heart Rate 88 bpm • BP 128/82",
    },
    medicalRequests: [
      { id: "mr-1", title: "Stat Ultrasound (Abdominal Wall)", status: "Pending Auth", urgency: "High" },
      { id: "mr-2", title: "Amoxicillin-Clavulanate Script Refill", status: "Awaiting Doctor Sign-off", urgency: "Medium" },
    ],
    followupHistory: [
      { date: "Oct 08, 2026", notes: "Laparoscopic appendectomy successfully completed. Discharged in stable condition.", doctor: "Dr. Aris Thorne" },
      { date: "Oct 10, 2026", notes: "Day 2 Tele-Nurse check: Mild tenderness, incision dry.", doctor: "Nurse Sarah Jenkins" },
    ],
  },
  {
    id: "pat-ananya-patel",
    mrn: "MRN-773194",
    name: "Ananya Patel",
    age: 36,
    gender: "Female",
    appointmentTime: "11:15 AM",
    issue: "Post-cholecystectomy bile reflux evaluation and diet progression",
    priority: "medium",
    status: "Waiting Room",
    roomNumber: "Room 408",
    aiBrief: {
      summary: "Patient requested post-surgical dietary titration following gallbladder resection.",
      previousConversation:
        "Portal message yesterday: Inquiring whether mild nausea with fat intake requires medication adjustment.",
      pendingIssue: "Diet tolerance assessment and liver enzyme panel review.",
      requiredAction: "Review LFTs results from Oct 11, prescribe Ursodiol if indicated, recommend step 2 gastro-diet.",
    },
    medicalRequests: [
      { id: "mr-3", title: "Comprehensive Liver Function Panel", status: "Results Ready", urgency: "Routine" },
    ],
    followupHistory: [
      { date: "Oct 05, 2026", notes: "Elective laparoscopic cholecystectomy completed without complications.", doctor: "Dr. Rahul" },
    ],
  },
  {
    id: "pat-marcus-vance",
    mrn: "MRN-659201",
    name: "Marcus Vance",
    age: 58,
    gender: "Male",
    appointmentTime: "01:00 PM",
    issue: "Hypertension medication titration & chest tightness on exertion",
    priority: "high",
    status: "Pending Labs",
    roomNumber: "Room 415",
    aiBrief: {
      summary: "Patient called regarding exertional tightness while climbing stairs.",
      previousConversation:
        "Call Oct 12: Reported systolic readings between 148-156 at home over the weekend despite Lisinopril.",
      pendingIssue: "Suboptimal BP control with possible early angina.",
      requiredAction: "Perform 12-lead ECG, assess for ischemic symptoms, consider addition of Amlodipine.",
      keyVitalsAlert: "Home BP Avg 152/94 • Resting Pulse 76",
    },
    medicalRequests: [
      { id: "mr-4", title: "12-Lead Electrocardiogram", status: "Ordered", urgency: "Stat" },
    ],
    followupHistory: [
      { date: "Sep 15, 2026", notes: "Annual cardiovascular wellness exam. Started on Lisinopril 10mg.", doctor: "Dr. Rahul" },
    ],
  },
];

export const mockDoctorFollowUps: DoctorFollowUp[] = [
  {
    id: "dfu-01",
    patientId: "pat-rahul-sharma",
    patientName: "Rahul Sharma",
    scheduledDate: "17 October 2026",
    protocol: "48-Hour Incision Redness & Lab Recheck",
    notes: "Review WBC differential and ultrasound findings once insurance clears.",
    status: "Pending Clinician Review",
    assignedTo: "Dr. Rahul",
    priority: "high",
  },
  {
    id: "dfu-02",
    patientId: "pat-ananya-patel",
    patientName: "Ananya Patel",
    scheduledDate: "22 October 2026",
    protocol: "Post-Dietary Transition Telephone Check",
    notes: "Nurse triage to phone patient regarding tolerability of solid foods.",
    status: "Scheduled",
    assignedTo: "Nurse Triage Unit 2",
    priority: "medium",
  },
];

let patientsStore = [...mockDoctorQueuePatients];
let followupsStore = [...mockDoctorFollowUps];

/**
 * Doctor Service (API-Ready Layer)
 * Future replacement point: GET /api/doctor/queue, POST /api/doctor/followups
 */
export const doctorService = {
  async getOverview(): Promise<DoctorOverviewData> {
    await new Promise((r) => setTimeout(r, 40));
    return mockDoctorOverview;
  },

  async getPatientQueue(): Promise<DoctorQueuePatient[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...patientsStore];
  },

  async getPatientById(id: string): Promise<DoctorQueuePatient | undefined> {
    await new Promise((r) => setTimeout(r, 30));
    return patientsStore.find((p) => p.id === id);
  },

  async getFollowUps(): Promise<DoctorFollowUp[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...followupsStore];
  },

  async createFollowUp(data: Omit<DoctorFollowUp, "id">): Promise<DoctorFollowUp> {
    await new Promise((r) => setTimeout(r, 60));
    const newFU: DoctorFollowUp = {
      ...data,
      id: `dfu-${Date.now()}`,
    };
    followupsStore.unshift(newFU);
    return newFU;
  },

  async updateFollowUpStatus(id: string, status: DoctorFollowUp["status"]): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const fu = followupsStore.find((f) => f.id === id);
    if (!fu) return false;
    fu.status = status;
    return true;
  },

  async updatePatientStatus(patientId: string, status: DoctorQueuePatient["status"]): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const pat = patientsStore.find((p) => p.id === patientId);
    if (!pat) return false;
    pat.status = status;
    return true;
  },
};
