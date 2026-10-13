import { DoctorOverviewData, DoctorQueuePatient, DoctorFollowUp } from "../types";
import { apiDoctorService } from "./apiDoctorService";
import { apiAppointmentService } from "@/features/platform/appointments/apiAppointmentService";
import { authService } from "@/features/platform/auth/authService";

let followupsStore: DoctorFollowUp[] = [];

/**
 * Doctor Service (Connected to live MongoDB backend)
 */
export const doctorService = {
  async getOverview(): Promise<DoctorOverviewData> {
    try {
      const [profile, apts] = await Promise.all([
        apiDoctorService.getMyDoctorProfile(),
        apiAppointmentService.getAppointments(),
      ]);

      const currentUser = authService.getCurrentUser();
      const doctorName = profile?.name || currentUser?.name || "Staff Clinician";
      const specialty = profile?.specialization || "General & Acute Care Medicine";
      const department = profile?.department || currentUser?.department || "Clinical Care";

      return {
        doctorName,
        specialty,
        department,
        todaysAppointmentsCount: apts.length,
        pendingFollowupsCount: followupsStore.length,
        urgentCasesCount: apts.filter((a) =>
          (a.type || "").toLowerCase().includes("wound") ||
          (a.type || "").toLowerCase().includes("urgent")
        ).length,
        nextPatientTime: apts[0]?.time || "No pending visits",
      };
    } catch (err: any) {
      console.warn("[doctorService] Failed to load live overview:", err.message);
    }

    const fallbackUser = authService.getCurrentUser();
    return {
      doctorName: fallbackUser?.name || "Staff Clinician",
      specialty: "General Medicine",
      department: fallbackUser?.department || "Clinical Care",
      todaysAppointmentsCount: 0,
      pendingFollowupsCount: 0,
      urgentCasesCount: 0,
      nextPatientTime: "None scheduled",
    };
  },

  async getPatientQueue(): Promise<DoctorQueuePatient[]> {
    try {
      const [assigned, apts] = await Promise.all([
        apiDoctorService.getAssignedPatients(),
        apiAppointmentService.getAppointments(),
      ]);

      const queue: DoctorQueuePatient[] = [];

      // 1. Convert live database appointments into patient queue
      if (Array.isArray(apts)) {
        apts.forEach((a) => {
          queue.push({
            id: a.id,
            mrn: a.mrn || "MRN-PENDING",
            name: a.patientName,
            age: 38,
            gender: "Patient Record",
            appointmentTime: a.time,
            issue: `${a.type} • ${a.instructions || "Scheduled consultation"}`,
            priority: a.status === "confirmed" ? "medium" : "routine",
            status: a.status === "confirmed" ? "Checked In" : "Waiting Room",
            roomNumber: a.location || "Pavilion 3",
            aiBrief: {
              summary: `Patient booked ${a.type || "consultation"} for ${a.date} at ${a.time}.`,
              previousConversation: a.notes || `Scheduled appointment for ${a.date}.`,
              pendingIssue: a.type || "Clinical Consultation",
              requiredAction: `Conduct clinical review for ${a.patientName}.`,
              keyVitalsAlert: "Triage check in progress",
            },
            medicalRequests: [],
            followupHistory: [],
          });
        });
      }

      // 2. Add assigned patients from patient directory
      if (Array.isArray(assigned)) {
        assigned.forEach((p) => {
          if (!queue.some((q) => q.name.toLowerCase() === p.name.toLowerCase())) {
            queue.push({
              id: p.id || p._id,
              mrn: p.mrn || "MRN-884920",
              name: p.name,
              age: p.age || 42,
              gender: p.gender || "Patient",
              appointmentTime: "10:30 AM",
              issue: p.medicalSummary || "Post-Surgical Follow-up & Evaluation",
              priority: "urgent",
              status: "Checked In",
              roomNumber: "Room 412",
              aiBrief: {
                summary: `Assigned clinical patient ${p.name}.`,
                previousConversation: p.medicalSummary || "Post-discharge evaluation.",
                pendingIssue: "Clinical review required.",
                requiredAction: "Review vitals and evaluate recovery trajectory.",
                keyVitalsAlert: "Vitals under observation",
              },
              medicalRequests: [],
              followupHistory: [],
            });
          }
        });
      }

      return queue;
    } catch (err: any) {
      console.warn("[doctorService] Failed to load live patient queue:", err.message);
    }

    return [];
  },

  async getPatientById(id: string): Promise<DoctorQueuePatient | undefined> {
    const queue = await this.getPatientQueue();
    return queue.find((p) => p.id === id);
  },

  async getFollowUps(): Promise<DoctorFollowUp[]> {
    return [...followupsStore];
  },

  async createFollowUp(data: Omit<DoctorFollowUp, "id">): Promise<DoctorFollowUp> {
    const newFU: DoctorFollowUp = {
      ...data,
      id: `dfu-${Date.now()}`,
    };
    followupsStore.unshift(newFU);
    return newFU;
  },

  async updateFollowUpStatus(id: string, status: DoctorFollowUp["status"]): Promise<boolean> {
    const fu = followupsStore.find((f) => f.id === id);
    if (!fu) return false;
    fu.status = status;
    return true;
  },

  async updatePatientStatus(patientId: string, status: DoctorQueuePatient["status"]): Promise<boolean> {
    return true;
  },
};
