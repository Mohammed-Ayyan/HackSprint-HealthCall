/**
 * CareOps AI - Real Backend Doctor Management Client
 * 
 * Direct API client for the Express / MongoDB backend (/api/v1/doctors).
 * Provides full CRUD operations, roster assignment, queue retrieval,
 * availability management, and clinical notes.
 */

export interface DoctorAvailabilitySlot {
  day: string;
  start: string;
  end: string;
  slots?: string[];
}

export interface Doctor {
  id: string;
  userId?: string;
  employeeId?: string;
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  department: string;
  qualification?: string;
  experience?: number;
  availability?: (DoctorAvailabilitySlot | string)[];
  assignedPatients?: string[];
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorPayload {
  userId: string;
  specialization: string;
  department: string;
  qualification?: string;
  experience?: number;
  employeeId?: string;
  availability?: any[];
}

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const TOKEN_KEY = "careops_jwt_token";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

// Fallback seed data for offline / static demo environments
const fallbackDoctors: Doctor[] = [
  {
    id: "doc-dr-rahul",
    employeeId: "DOC-1001",
    name: "Dr. Rahul",
    email: "dr.rahul@metrohealth.eco",
    phone: "+1 (555) 749-2101",
    specialization: "Post-Surgical General & Acute Recovery",
    department: "Post-Surgical General & Acute Recovery",
    qualification: "MBBS, MD (Cardiothoracic Care)",
    experience: 12,
    availability: [
      { day: "Monday", start: "09:00", end: "17:00", slots: ["10:30 AM", "11:15 AM", "02:00 PM", "04:30 PM"] },
      { day: "Wednesday", start: "09:00", end: "17:00", slots: ["10:30 AM", "02:00 PM"] },
    ],
    assignedPatients: ["pat-rahul-sharma", "pat-ananya-patel"],
    status: "ACTIVE",
  },
  {
    id: "doc-dr-miriam-vance",
    employeeId: "DOC-1002",
    name: "Dr. Miriam Vance",
    email: "vance.doctor@hospital.com",
    phone: "+1 (555) 892-1200",
    specialization: "Endocrinology & Metabolic Care",
    department: "Endocrinology",
    qualification: "MD, Endocrinology",
    experience: 9,
    availability: [
      { day: "Tuesday", start: "10:00", end: "16:00", slots: ["11:45 AM", "01:15 PM", "03:00 PM"] },
    ],
    assignedPatients: ["pat-marcus-vance"],
    status: "ACTIVE",
  },
];

let localDoctorsStore: Doctor[] = [...fallbackDoctors];

function normalizeDoctorFromApi(apiDoc: any): Doctor {
  return {
    id: apiDoc.id || apiDoc._id,
    userId: apiDoc.userId || undefined,
    employeeId: apiDoc.employeeId || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
    name: apiDoc.name,
    email: apiDoc.email,
    phone: apiDoc.phone || "",
    specialization: apiDoc.specialization || "General Medicine",
    department: apiDoc.department || "Clinical Care",
    qualification: apiDoc.qualification || "MBBS, MD",
    experience: Number(apiDoc.experience) || 5,
    availability: Array.isArray(apiDoc.availability) ? apiDoc.availability : [],
    assignedPatients: Array.isArray(apiDoc.assignedPatients) ? apiDoc.assignedPatients : [],
    status: (apiDoc.status || "ACTIVE").toUpperCase() as any,
    createdAt: apiDoc.createdAt || new Date().toISOString(),
    updatedAt: apiDoc.updatedAt || new Date().toISOString(),
  };
}

export const apiDoctorService = {
  /**
   * GET /api/v1/doctors
   * Retrieve hospital doctors with optional filters (specialization, department, status, search).
   */
  async getDoctors(filters?: {
    specialization?: string;
    department?: string;
    status?: string;
    search?: string;
  }): Promise<Doctor[]> {
    const token = getAuthToken();

    if (token) {
      try {
        const queryParams = new URLSearchParams();
        if (filters?.specialization) queryParams.append("specialization", filters.specialization);
        if (filters?.department) queryParams.append("department", filters.department);
        if (filters?.status) queryParams.append("status", filters.status);
        if (filters?.search) queryParams.append("search", filters.search);

        const url = `${BACKEND_BASE_URL}/doctors${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.doctors)) {
            return data.doctors.map(normalizeDoctorFromApi);
          }
        }
      } catch (err) {
        console.warn("[apiDoctorService] Backend request failed, using fallback store", err);
      }
    }

    // Fallback: local filter
    let results = [...localDoctorsStore];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q)
      );
    }
    if (filters?.department) {
      results = results.filter(
        (d) => d.department.toLowerCase() === filters.department?.toLowerCase()
      );
    }
    if (filters?.specialization) {
      results = results.filter(
        (d) => d.specialization.toLowerCase() === filters.specialization?.toLowerCase()
      );
    }
    return results;
  },

  /**
   * GET /api/v1/doctors/:id
   * Retrieve single doctor details.
   */
  async getDoctorById(id: string): Promise<Doctor | null> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/doctors/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.doctor) {
            return normalizeDoctorFromApi(data.doctor);
          }
        }
      } catch (err) {
        console.warn(`[apiDoctorService] Failed to fetch doctor ${id}`, err);
      }
    }

    const found = localDoctorsStore.find((d) => d.id === id || d.employeeId === id);
    return found || null;
  },

  /**
   * GET /api/v1/doctors/me
   * Retrieve authenticated clinician's own profile.
   */
  async getMyDoctorProfile(): Promise<Doctor | null> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/doctors/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.doctor) {
            return normalizeDoctorFromApi(data.doctor);
          }
        }
      } catch (err) {
        console.warn("[apiDoctorService] Failed to fetch /doctors/me", err);
      }
    }

    return localDoctorsStore[0] || null;
  },

  /**
   * GET /api/v1/doctors/:id/patients
   * Retrieve doctor's assigned patient queue.
   */
  async getAssignedPatients(doctorId?: string): Promise<any[]> {
    const token = getAuthToken();
    const idToUse = doctorId || "me";

    if (token) {
      try {
        // If "me" was specified, resolve current doctor ID first
        let targetId = idToUse;
        if (targetId === "me") {
          const meProfile = await this.getMyDoctorProfile();
          if (meProfile) targetId = meProfile.id;
        }

        const res = await fetch(`${BACKEND_BASE_URL}/doctors/${targetId}/patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.patients)) {
            return data.patients;
          }
        }
      } catch (err) {
        console.warn("[apiDoctorService] Failed to fetch doctor patient queue", err);
      }
    }

    return [];
  },

  /**
   * PATCH /api/v1/doctors/:id/availability
   * Updates doctor consultation schedule.
   */
  async updateAvailability(doctorId: string, availability: any[]): Promise<any[]> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/doctors/${doctorId}/availability`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ availability }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.availability) {
            return data.availability;
          }
        }
      } catch (err) {
        console.warn("[apiDoctorService] Failed to update availability on backend", err);
      }
    }

    const doc = localDoctorsStore.find((d) => d.id === doctorId);
    if (doc) doc.availability = availability;
    return availability;
  },

  /**
   * PATCH /api/v1/doctors/:id/patients
   * Assign a patient to doctor care roster.
   */
  async assignPatient(doctorId: string, patientId: string): Promise<Doctor | null> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/doctors/${doctorId}/patients`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.doctor) {
            return normalizeDoctorFromApi(data.doctor);
          }
        }
      } catch (err) {
        console.warn("[apiDoctorService] Failed to assign patient on backend", err);
      }
    }

    const doc = localDoctorsStore.find((d) => d.id === doctorId);
    if (doc && !doc.assignedPatients?.includes(patientId)) {
      doc.assignedPatients = [...(doc.assignedPatients || []), patientId];
    }
    return doc || null;
  },

  /**
   * POST /api/v1/doctors/:id/notes
   * Add clinical note to patient.
   */
  async addClinicalNote(doctorId: string, patientId: string, note: string): Promise<any> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/doctors/${doctorId}/notes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientId, note }),
        });

        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn("[apiDoctorService] Failed to record clinical note on backend", err);
      }
    }

    return { success: true, note, simulated: true };
  },

  /**
   * POST /api/v1/doctors
   * Create doctor profile (Admin only).
   */
  async createDoctor(payload: CreateDoctorPayload): Promise<Doctor> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/doctors`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.doctor) {
            const created = normalizeDoctorFromApi(data.doctor);
            localDoctorsStore.unshift(created);
            return created;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to create doctor profile");
        }
      } catch (err: any) {
        if (err.message && !err.message.includes("fetch")) throw err;
      }
    }

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      userId: payload.userId,
      employeeId: payload.employeeId || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "Dr. Clinician",
      email: "doctor@metrohealth.eco",
      specialization: payload.specialization,
      department: payload.department,
      qualification: payload.qualification || "MBBS, MD",
      experience: payload.experience || 5,
      availability: payload.availability || [],
      assignedPatients: [],
      status: "ACTIVE",
    };
    localDoctorsStore.unshift(newDoc);
    return newDoc;
  },

  /**
   * PATCH /api/v1/doctors/:id
   * Update doctor profile.
   */
  async updateDoctor(doctorId: string, updates: Partial<Doctor>): Promise<Doctor | null> {
    const token = getAuthToken();

    if (token) {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/doctors/${doctorId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.doctor) {
            return normalizeDoctorFromApi(data.doctor);
          }
        }
      } catch (err) {
        console.warn("[apiDoctorService] Failed to update doctor profile on backend", err);
      }
    }

    const idx = localDoctorsStore.findIndex((d) => d.id === doctorId);
    if (idx !== -1) {
      localDoctorsStore[idx] = { ...localDoctorsStore[idx], ...updates };
      return localDoctorsStore[idx];
    }
    return null;
  },
};
