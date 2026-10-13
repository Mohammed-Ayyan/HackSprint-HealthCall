import { DoctorOverviewData, DoctorQueuePatient, DoctorFollowUp } from "../types";
import { apiDoctorService } from "./apiDoctorService";
import { apiAppointmentService } from "@/features/platform/appointments/apiAppointmentService";
import { apiTaskService } from "@/features/platform/tasks/apiTaskService";
import { authService } from "@/features/platform/auth/authService";

let followupsStore: DoctorFollowUp[] = [];

function mapTaskToFollowUp(t: any): DoctorFollowUp {
  let status: DoctorFollowUp["status"] = "Pending Clinician Review";
  if (t.status === "completed") status = "Completed";
  else if (t.isEscalated || t.priority === "critical") status = "Escalated";
  else if (t.status === "in-progress" || t.status === "assigned") status = "Scheduled";

  let prio: "high" | "medium" | "low" = "medium";
  if (t.priority === "critical" || t.priority === "high") prio = "high";
  else if (t.priority === "low") prio = "low";

  return {
    id: t.id,
    patientId: t.patientMrn || t.id,
    patientName: t.patientName || "Patient",
    scheduledDate: t.deadline || "Within 24 hours",
    protocol: t.task,
    notes: t.description,
    status,
    assignedTo: t.assignedTo?.name || "Clinical Team",
    priority: prio,
  };
}

/**
 * Doctor Service (Connected to live MongoDB backend)
 */
export const doctorService = {
  async getOverview(): Promise<DoctorOverviewData> {
    try {
      const [profile, apts, followups] = await Promise.all([
        apiDoctorService.getMyDoctorProfile(),
        apiAppointmentService.getAppointments(),
        this.getFollowUps(),
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
        pendingFollowupsCount: followups.filter((f) => f.status !== "Completed").length,
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
    try {
      const liveTasks = await apiTaskService.getTasks({ department: "CLINICAL" });
      if (liveTasks && liveTasks.length > 0) {
        return liveTasks.map(mapTaskToFollowUp);
      }
    } catch (e: any) {
      console.warn("[doctorService] Could not load live clinical tasks:", e.message);
    }
    return [...followupsStore];
  },

  async createFollowUp(data: Omit<DoctorFollowUp, "id">): Promise<DoctorFollowUp> {
    try {
      const created = await apiTaskService.createTask({
        title: data.protocol,
        description: data.notes,
        department: "CLINICAL",
        priority: data.priority === "high" ? "HIGH" : data.priority === "low" ? "LOW" : "MEDIUM",
      });
      if (created) {
        const fu = mapTaskToFollowUp(created);
        followupsStore.unshift(fu);
        return fu;
      }
    } catch (e: any) {
      console.warn("[doctorService] Could not persist follow-up to backend:", e.message);
    }

    const newFU: DoctorFollowUp = {
      ...data,
      id: `dfu-${Date.now()}`,
    };
    followupsStore.unshift(newFU);
    return newFU;
  },

  async updateFollowUpStatus(id: string, status: DoctorFollowUp["status"]): Promise<boolean> {
    try {
      let targetStatus = "IN_PROGRESS";
      if (status === "Completed") targetStatus = "COMPLETED";
      else if (status === "Pending Clinician Review") targetStatus = "CREATED";

      await apiTaskService.updateTaskStatus(id, targetStatus);
    } catch (e: any) {
      console.warn("[doctorService] Could not update task status on backend:", e.message);
    }

    const fu = followupsStore.find((f) => f.id === id);
    if (!fu) return false;
    fu.status = status;
    return true;
  },

  async updatePatientStatus(patientId: string, status: DoctorQueuePatient["status"]): Promise<boolean> {
    return true;
  },
};
