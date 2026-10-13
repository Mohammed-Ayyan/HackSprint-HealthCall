import {
  PatientAppointment,
  PatientRequest,
  CommunicationRecord,
  PatientNotification,
  PatientOverviewData,
} from "../types";

export const mockPatientOverview: PatientOverviewData = {
  patientName: "Rahul Sharma",
  mrn: "MRN-884920",
  assignedPCP: "Dr. Aris Thorne (Surgical Director)",
  insuranceStatus: "Prior-Auth Under Review",
  insuranceProvider: "BlueCross Premier PPO (#BC-992014)",
  upcomingAppointmentsCount: 1,
  pendingRequestsCount: 2,
  recentMessagesCount: 3,
};

export const mockPatientAppointments: PatientAppointment[] = [
  {
    id: "apt-101",
    doctorName: "Dr. Rahul",
    doctorSpecialty: "Post-Surgical General Medicine",
    date: "15 October",
    time: "10:30 AM",
    location: "Pavilion 3, Suite 410 (Metro Health Hospital)",
    status: "confirmed",
    type: "Post-Op Wound Check",
    instructions: "Bring current temperature log and post-op medication bottles.",
  },
  {
    id: "apt-102",
    doctorName: "Dr. Miriam Vance",
    doctorSpecialty: "Endocrinology & Metabolic Care",
    date: "24 October",
    time: "02:15 PM",
    location: "North Garden Wing, Clinic 2B",
    status: "pending",
    type: "In-Person Consultation",
    instructions: "8-hour fasting lab blood test prior to appointment.",
  },
];

export const mockPatientRequests: PatientRequest[] = [
  {
    id: "req-01",
    title: "Insurance claim follow-up (Post-op Ultrasound)",
    category: "Insurance",
    status: "In Progress",
    createdDate: "Oct 13, 2026",
    estimatedResolution: "Today by 04:00 PM",
    department: "Insurance Relations",
    lastUpdateNotes: "Hospital billing submitted expedited prior-auth documents to BlueCross.",
  },
  {
    id: "req-02",
    title: "Prescription Renewal Authorization",
    category: "Prescription",
    status: "Under Review",
    createdDate: "Oct 12, 2026",
    estimatedResolution: "Within 24 Hours",
    department: "Pharmacy & Clinic 4",
    lastUpdateNotes: "Forwarded to Dr. Thorne for electronic sign-off.",
  },
];

export const mockCommunicationHistory: CommunicationRecord[] = [
  {
    id: "com-01",
    callNumber: "CC-2026-9842",
    date: "Today, 11:24 AM",
    duration: "03:24",
    channel: "Telephony Voice Call",
    summary:
      "Patient called regarding fever of 100.8°F and surgical incision swelling following laparoscopic appendectomy. Inquired about BlueCross pre-auth status.",
    commitmentsMade: [
      "Confirmed slot booked with Dr. Rahul for Oct 15 at 10:30 AM",
      "Expedited insurance review ticket opened with billing coordinator",
    ],
    hospitalResponse:
      "Dr. Thorne's surgical nurse reviewed vitals. Follow-up consultation confirmed for Oct 15 at 10:30 AM.",
    status: "Ongoing Follow-up",
  },
  {
    id: "com-02",
    callNumber: "CC-2026-8910",
    date: "Oct 08, 2026",
    duration: "02:10",
    channel: "Nurse Triage Check",
    summary:
      "Routine post-discharge day 1 call. Patient was resting comfortably with minimal dressing seepage.",
    commitmentsMade: ["Discharge packet digital copy sent via SMS"],
    hospitalResponse: "Medication schedule confirmed; instructions verified.",
    status: "Resolved",
  },
];

export const mockPatientNotifications: PatientNotification[] = [
  {
    id: "pnotif-1",
    title: "Appointment confirmed with Dr. Rahul",
    message: "Your post-op checkup is confirmed for Wednesday, 15 October at 10:30 AM.",
    timestamp: "2 hours ago",
    type: "appointment",
    read: false,
    actionUrl: "/patient/dashboard",
  },
  {
    id: "pnotif-2",
    title: "Doctor follow-up reminder",
    message: "Please log your body temperature today prior to your consultation.",
    timestamp: "4 hours ago",
    type: "reminder",
    read: false,
  },
  {
    id: "pnotif-3",
    title: "Insurance update available",
    message: "Expedited prior-authorization packet transmitted to BlueCross.",
    timestamp: "Yesterday",
    type: "insurance",
    read: true,
  },
];

let appointmentsStore = [...mockPatientAppointments];
let requestsStore = [...mockPatientRequests];

/**
 * Patient Service (API-Ready Layer)
 * Future replacement point: GET /api/patient/appointments, POST /api/patient/requests
 */
import { apiPatientService } from "./apiPatientService";

export const patientService = {
  async getOverview(): Promise<PatientOverviewData> {
    try {
      const profile = await apiPatientService.getMyProfile();
      if (profile) {
        return {
          ...mockPatientOverview,
          patientName: profile.name || mockPatientOverview.patientName,
          mrn: profile.mrn || mockPatientOverview.mrn,
          assignedPCP: profile.assignedDoctorName
            ? `${profile.assignedDoctorName} (${profile.department || "Clinical Care"})`
            : mockPatientOverview.assignedPCP,
          insuranceProvider: profile.insuranceProvider || mockPatientOverview.insuranceProvider,
          insuranceStatus: (profile.insuranceStatus as any) || mockPatientOverview.insuranceStatus,
        };
      }
    } catch {
      // Graceful fallback to mock data
    }
    return mockPatientOverview;
  },

  async getAppointments(): Promise<PatientAppointment[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...appointmentsStore];
  },

  async requestAppointment(
    data: Omit<PatientAppointment, "id" | "status">
  ): Promise<PatientAppointment> {
    await new Promise((r) => setTimeout(r, 60));
    const newApt: PatientAppointment = {
      ...data,
      id: `apt-${Date.now()}`,
      status: "pending",
    };
    appointmentsStore.unshift(newApt);
    return newApt;
  },

  async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const apt = appointmentsStore.find((a) => a.id === id);
    if (!apt) return false;
    apt.date = newDate;
    apt.time = newTime;
    apt.status = "rescheduled";
    return true;
  },

  async cancelAppointment(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const apt = appointmentsStore.find((a) => a.id === id);
    if (!apt) return false;
    apt.status = "cancelled";
    return true;
  },

  async getRequests(): Promise<PatientRequest[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...requestsStore];
  },

  async getCommunicationHistory(): Promise<CommunicationRecord[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...mockCommunicationHistory];
  },

  async getNotifications(): Promise<PatientNotification[]> {
    await new Promise((r) => setTimeout(r, 30));
    return [...mockPatientNotifications];
  },
};
