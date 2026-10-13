import {
  ReceptionOverviewData,
  ReceptionAppointment,
  ReceptionCallAction,
  DirectoryPatient,
  DoctorScheduleSlot,
} from "../types";

export const mockReceptionOverview: ReceptionOverviewData = {
  receptionistName: "Clara Oswald",
  frontDeskStation: "Central Pavilion Desk A",
  pendingBookingsCount: 4,
  confirmedAppointmentsCount: 16,
  cancelledRequestsCount: 2,
  openCallTasksCount: 5,
};

export const mockReceptionAppointments: ReceptionAppointment[] = [
  {
    id: "rec-apt-01",
    patientName: "Rahul Sharma",
    mrn: "MRN-884920",
    doctorName: "Dr. Rahul",
    department: "Post-Surgical General",
    date: "15 October",
    time: "10:30 AM",
    status: "confirmed",
    source: "CareOps Telephony AI",
    notes: "Post-op wound follow-up scheduled after morning call triage.",
  },
  {
    id: "rec-apt-02",
    patientName: "David Miller",
    mrn: "MRN-551940",
    doctorName: "Dr. Miriam Vance",
    department: "Endocrinology",
    date: "15 October",
    time: "11:45 AM",
    status: "pending",
    source: "Patient Portal",
    notes: "Requested diabetic insulin protocol check.",
  },
  {
    id: "rec-apt-03",
    patientName: "Sophia Hernandez",
    mrn: "MRN-332910",
    doctorName: "Dr. Aris Thorne",
    department: "General Surgery",
    date: "15 October",
    time: "02:00 PM",
    status: "confirmed",
    source: "Walk-In Front Desk",
    notes: "Pre-op surgical consult checklist completed.",
  },
  {
    id: "rec-apt-04",
    patientName: "Ethan Reynolds",
    mrn: "MRN-994120",
    doctorName: "Dr. Elena Rostova",
    department: "Cardiology",
    date: "15 October",
    time: "03:30 PM",
    status: "cancelled",
    source: "CareOps Telephony AI",
    notes: "Patient phoned to cancel due to out-of-town travel conflict.",
  },
];

export const mockReceptionCallActions: ReceptionCallAction[] = [
  {
    id: "cta-01",
    callId: "CC-2026-9842",
    callerName: "Rahul Sharma",
    callerPhone: "+1 (555) 349-8812",
    taskTitle: "Schedule appointment",
    priority: "high",
    deadline: "Today (by 2:00 PM)",
    aiSummaryExtract: "Caller experienced post-op redness and fever. Needs Dr. Rahul appointment booked within 48h.",
    status: "In Progress",
    assignedDoctorPreference: "Dr. Rahul",
  },
  {
    id: "cta-02",
    callId: "CC-2026-9845",
    callerName: "Maria Santos",
    callerPhone: "+1 (555) 782-1920",
    taskTitle: "Reschedule ultrasound and notify radiology desk",
    priority: "high",
    deadline: "Today",
    aiSummaryExtract: "Patient cannot attend 8:00 AM ultrasound due to fasting nausea. Requesting afternoon slot.",
    status: "Pending Action",
    assignedDoctorPreference: "Dr. Vance",
  },
  {
    id: "cta-03",
    callId: "CC-2026-9847",
    callerName: "George Washington",
    callerPhone: "+1 (555) 441-2993",
    taskTitle: "Confirm intake paperwork for incoming surgical transfer",
    priority: "medium",
    deadline: "Tomorrow 09:00 AM",
    aiSummaryExtract: "Caregiver inquired if physical insurance card must be presented or if digital upload suffices.",
    status: "Pending Action",
  },
];

export const mockDirectoryPatients: DirectoryPatient[] = [
  {
    id: "dp-1",
    mrn: "MRN-884920",
    name: "Rahul Sharma",
    contact: "+1 (555) 349-8812",
    email: "rahul.sharma@email.com",
    dob: "1984-06-12",
    insuranceProvider: "BlueCross Premier PPO",
    lastVisit: "Oct 08, 2026",
    totalAppointments: 4,
  },
  {
    id: "dp-2",
    mrn: "MRN-773194",
    name: "Ananya Patel",
    contact: "+1 (555) 672-9901",
    email: "ananya.patel@email.com",
    dob: "1990-11-23",
    insuranceProvider: "Aetna Choice POS II",
    lastVisit: "Oct 05, 2026",
    totalAppointments: 2,
  },
  {
    id: "dp-3",
    mrn: "MRN-659201",
    name: "Marcus Vance",
    contact: "+1 (555) 890-4412",
    email: "marcus.vance@email.com",
    dob: "1968-04-03",
    insuranceProvider: "UnitedHealthcare Choice",
    lastVisit: "Sep 15, 2026",
    totalAppointments: 6,
  },
];

export const mockDoctorSchedules: DoctorScheduleSlot[] = [
  {
    doctorName: "Dr. Rahul",
    specialty: "Post-Surgical General",
    availability: "Available",
    availableSlots: ["10:30 AM", "11:15 AM", "02:00 PM", "04:30 PM"],
  },
  {
    doctorName: "Dr. Miriam Vance",
    specialty: "Endocrinology",
    availability: "Available",
    availableSlots: ["11:45 AM", "01:15 PM", "03:00 PM"],
  },
  {
    doctorName: "Dr. Aris Thorne",
    specialty: "General Surgery",
    availability: "In Surgery",
    availableSlots: ["04:00 PM", "05:15 PM"],
  },
  {
    doctorName: "Dr. Elena Rostova",
    specialty: "Cardiology",
    availability: "Fully Booked",
    availableSlots: [],
  },
];

let appointmentsStore = [...mockReceptionAppointments];
let callActionsStore = [...mockReceptionCallActions];
let directoryStore = [...mockDirectoryPatients];

/**
 * Reception Service (API-Ready Layer)
 * Future replacement point: GET /api/reception/appointments, POST /api/reception/appointments
 */
import { apiPatientService } from "@/features/platform/patients/apiPatientService";

export const receptionService = {
  async getOverview(): Promise<ReceptionOverviewData> {
    await new Promise((r) => setTimeout(r, 40));
    return mockReceptionOverview;
  },

  async getAppointments(): Promise<ReceptionAppointment[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...appointmentsStore];
  },

  async updateAppointmentStatus(
    id: string,
    status: ReceptionAppointment["status"]
  ): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const apt = appointmentsStore.find((a) => a.id === id);
    if (!apt) return false;
    apt.status = status;
    return true;
  },

  async createAppointment(
    data: Omit<ReceptionAppointment, "id">
  ): Promise<ReceptionAppointment> {
    await new Promise((r) => setTimeout(r, 60));
    const newApt: ReceptionAppointment = {
      ...data,
      id: `rec-apt-${Date.now()}`,
    };
    appointmentsStore.unshift(newApt);
    return newApt;
  },

  async getCallActions(): Promise<ReceptionCallAction[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...callActionsStore];
  },

  async updateCallActionStatus(
    id: string,
    status: ReceptionCallAction["status"]
  ): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const action = callActionsStore.find((a) => a.id === id);
    if (!action) return false;
    action.status = status;
    return true;
  },

  async getPatientDirectory(): Promise<DirectoryPatient[]> {
    try {
      const apiPatients = await apiPatientService.getPatients();
      if (apiPatients) {
        return apiPatients.map((p) => ({
          id: p.id,
          mrn: p.mrn,
          name: p.name,
          contact: p.phone,
          email: p.email,
          dob: p.dateOfBirth || "1990-01-01",
          insuranceProvider: p.insuranceProvider || "MetroHealth Care Plan",
          lastVisit: "Recent Consultation",
          totalAppointments: 1,
        }));
      }
    } catch (err: any) {
      console.error("[receptionService] Failed to fetch patient directory from backend:", err.message);
    }
    return [];
  },

  async createPatient(
    data: Omit<DirectoryPatient, "id" | "totalAppointments">
  ): Promise<DirectoryPatient> {
    const created = await apiPatientService.createPatient({
      name: data.name,
      email: data.email,
      phone: data.contact,
      dateOfBirth: data.dob,
      insuranceProvider: data.insuranceProvider,
    });
    return {
      id: created.id,
      mrn: created.mrn,
      name: created.name,
      contact: created.phone,
      email: created.email,
      dob: created.dateOfBirth || data.dob,
      insuranceProvider: created.insuranceProvider || data.insuranceProvider,
      lastVisit: data.lastVisit || "Today (Intake)",
      totalAppointments: 1,
    };
  },

  async getDoctorSchedules(): Promise<DoctorScheduleSlot[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...mockDoctorSchedules];
  },
};
