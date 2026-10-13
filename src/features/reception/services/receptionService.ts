import {
  ReceptionOverviewData,
  ReceptionAppointment,
  ReceptionCallAction,
  DirectoryPatient,
  DoctorScheduleSlot,
} from "../types";
import { apiPatientService } from "@/features/platform/patients/apiPatientService";
import { apiAppointmentService } from "@/features/platform/appointments/apiAppointmentService";
import { apiDoctorService } from "@/features/platform/doctors/apiDoctorService";
import { authService } from "@/features/platform/auth/authService";

export const mockReceptionCallActions: ReceptionCallAction[] = [];

let callActionsStore: ReceptionCallAction[] = [];

/**
 * Reception Service (Connected to live MongoDB backend)
 */
export const receptionService = {
  async getOverview(): Promise<ReceptionOverviewData> {
    try {
      const [apts, pats] = await Promise.all([
        apiAppointmentService.getAppointments(),
        apiPatientService.getPatients(),
      ]);

      const currentUser = authService.getCurrentUser();
      const confirmedCount = apts.filter((a) => a.status === "confirmed").length;
      const pendingCount = apts.filter((a) => a.status === "pending").length;
      const cancelledCount = apts.filter((a) => a.status === "cancelled").length;

      return {
        receptionistName: currentUser?.name || "Front Desk Lead",
        frontDeskStation: currentUser?.department || "Central Pavilion Intake Desk",
        pendingBookingsCount: pendingCount,
        confirmedAppointmentsCount: confirmedCount,
        cancelledRequestsCount: cancelledCount,
        openCallTasksCount: callActionsStore.filter((c) => c.status !== "Completed").length,
      };
    } catch (err: any) {
      console.warn("[receptionService] Failed to load live overview:", err.message);
    }

    const fallbackUser = authService.getCurrentUser();
    return {
      receptionistName: fallbackUser?.name || "Front Desk Lead",
      frontDeskStation: "Central Pavilion Intake Desk",
      pendingBookingsCount: 0,
      confirmedAppointmentsCount: 0,
      cancelledRequestsCount: 0,
      openCallTasksCount: 0,
    };
  },

  async getAppointments(): Promise<ReceptionAppointment[]> {
    try {
      const liveApts = await apiAppointmentService.getAppointments();
      if (liveApts) {
        return liveApts.map((a) => ({
          id: a.id,
          patientName: a.patientName,
          mrn: a.mrn || "MRN-PENDING",
          doctorName: a.doctorName,
          department: a.doctorSpecialty || "General Medicine",
          date: a.date,
          time: a.time,
          status: a.status as any,
          source: "Patient Portal",
          notes: a.instructions || `Booked with ${a.doctorName}`,
        }));
      }
    } catch (err: any) {
      console.warn("[receptionService] Failed to load live appointments:", err.message);
    }
    return [];
  },

  async updateAppointmentStatus(
    id: string,
    status: ReceptionAppointment["status"]
  ): Promise<boolean> {
    const updated = await apiAppointmentService.updateAppointment(id, {
      status: status as any,
    });
    return !!updated;
  },

  async createAppointment(
    data: Omit<ReceptionAppointment, "id">
  ): Promise<ReceptionAppointment> {
    const created = await apiAppointmentService.createAppointment({
      patientName: data.patientName,
      mrn: data.mrn,
      doctorName: data.doctorName,
      doctorSpecialty: data.department,
      date: data.date,
      time: data.time,
      instructions: data.notes,
      status: data.status,
    });

    return {
      id: created.id,
      patientName: created.patientName,
      mrn: created.mrn || data.mrn,
      doctorName: created.doctorName,
      department: created.doctorSpecialty || data.department,
      date: created.date,
      time: created.time,
      status: created.status as any,
      source: data.source,
      notes: created.instructions || data.notes,
    };
  },

  async getCallActions(): Promise<ReceptionCallAction[]> {
    return [...callActionsStore];
  },

  async updateCallActionStatus(
    id: string,
    status: ReceptionCallAction["status"]
  ): Promise<boolean> {
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
    try {
      const liveDocs = await apiDoctorService.getDoctors();
      if (liveDocs && liveDocs.length > 0) {
        return liveDocs.map((doc) => ({
          doctorName: doc.name,
          specialty: doc.specialization || doc.department || "Clinical Care",
          availability: doc.status === "ACTIVE" ? "Available" : "In Surgery",
          availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"],
        }));
      }
    } catch (err: any) {
      console.warn("[receptionService] Failed to load live doctor schedules:", err.message);
    }
    return [];
  },
};
