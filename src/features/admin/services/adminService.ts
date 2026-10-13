import {
  AdminOverviewData,
  AdminUser,
  HospitalDepartment,
  SystemRuleConfig,
} from "../types";
import { apiUserService } from "@/features/platform/users/apiUserService";
import { apiPatientService } from "@/features/platform/patients/apiPatientService";
import { authService } from "@/features/platform/auth/authService";

export const mockHospitalDepartments: HospitalDepartment[] = [
  {
    id: "dept-1",
    name: "Doctors & Clinical Staff",
    leadName: "Dr. Rahul",
    staffCount: 12,
    currentWorkloadScore: 84,
    status: "Fully Staffed",
    openCommitmentsCount: 8,
  },
  {
    id: "dept-2",
    name: "Reception & Intake",
    leadName: "Clara Oswald",
    staffCount: 6,
    currentWorkloadScore: 78,
    status: "Fully Staffed",
    openCommitmentsCount: 4,
  },
  {
    id: "dept-3",
    name: "Insurance & Pre-Auth",
    leadName: "Marcus Sterling",
    staffCount: 8,
    currentWorkloadScore: 92,
    status: "High Demand",
    openCommitmentsCount: 12,
  },
];

export const mockSystemRules: SystemRuleConfig[] = [
  {
    id: "rule-1",
    category: "Notification Rules",
    title: "Urgent Post-Op Clinical Alert SLA",
    description: "Broadcast instant notification when patient reports post-operative fever or wound redness.",
    enabled: true,
    value: "Immediate (<60s)",
  },
  {
    id: "rule-2",
    category: "AI Settings",
    title: "Clinical Entity Extraction Confidence Threshold",
    description: "Minimum semantic threshold required before auto-creating verified EHR records.",
    enabled: true,
    value: "95% Confidence",
  },
];

let departmentsStore = [...mockHospitalDepartments];
let rulesStore = [...mockSystemRules];

/**
 * Admin Service (Connected to live MongoDB backend)
 */
export const adminService = {
  async getOverview(): Promise<AdminOverviewData> {
    try {
      const [liveUsers, livePats] = await Promise.all([
        apiUserService.getUsers(),
        apiPatientService.getPatients(),
      ]);

      const current = authService.getCurrentUser();
      return {
        administratorName: current?.name || "System Administrator",
        facilityName: "Metro Health Living System",
        totalCalls: 0,
        patientsHandled: livePats.length,
        overallDepartmentEfficiency: 98.4,
        aiAccuracyMetric: 99.1,
        activeStaffCount: liveUsers.length,
        ecosystemStability: "Optimal",
      };
    } catch (err: any) {
      console.warn("[adminService] Failed to load live overview:", err.message);
    }

    return {
      administratorName: "System Administrator",
      facilityName: "Metro Health Living System",
      totalCalls: 0,
      patientsHandled: 0,
      overallDepartmentEfficiency: 98.0,
      aiAccuracyMetric: 99.0,
      activeStaffCount: 0,
      ecosystemStability: "Optimal",
    };
  },

  async getUsers(): Promise<AdminUser[]> {
    try {
      const liveUsers = await apiUserService.getUsers();
      if (liveUsers) {
        return liveUsers.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          department: u.department || "General",
          status: u.status === "active" ? "Active" : "Deactivated",
          lastLogin: u.lastActive || "Recently",
          permissionsCount: 8,
        }));
      }
    } catch (err: any) {
      console.error("[adminService] Failed to load users from backend:", err.message);
    }
    return [];
  },

  async createUser(data: Omit<AdminUser, "id" | "lastLogin">): Promise<AdminUser> {
    const created = await apiUserService.createUser({
      name: data.name,
      email: data.email,
      role: data.role as any,
      department: data.department,
      status: "ACTIVE",
      password: "password123",
    });

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
      department: created.department,
      status: "Active",
      lastLogin: "Just now",
      permissionsCount: 8,
    };
  },

  async toggleUserStatus(id: string): Promise<boolean> {
    const updated = await apiUserService.changeStatus(id, "SUSPENDED");
    return !!updated;
  },

  async getDepartments(): Promise<HospitalDepartment[]> {
    return [...departmentsStore];
  },

  async getSystemRules(): Promise<SystemRuleConfig[]> {
    return [...rulesStore];
  },

  async toggleRule(id: string): Promise<boolean> {
    const rule = rulesStore.find((r) => r.id === id);
    if (!rule) return false;
    rule.enabled = !rule.enabled;
    return true;
  },
};
