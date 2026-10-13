import {
  AdminOverviewData,
  AdminUser,
  HospitalDepartment,
  SystemRuleConfig,
} from "../types";

export const mockAdminOverview: AdminOverviewData = {
  administratorName: "Dr. Evelyn Vance",
  facilityName: "Metro Health Living System",
  totalCalls: 3840,
  patientsHandled: 2914,
  overallDepartmentEfficiency: 96.4,
  aiAccuracyMetric: 99.1,
  activeStaffCount: 142,
  ecosystemStability: "Optimal",
};

export const mockAdminUsers: AdminUser[] = [
  {
    id: "usr-01",
    name: "Dr. Rahul",
    email: "dr.rahul@metrohealth.eco",
    role: "Doctor",
    department: "Post-Surgical General",
    status: "Active",
    lastLogin: "Today, 10:24 AM",
    permissionsCount: 8,
  },
  {
    id: "usr-02",
    name: "Clara Oswald",
    email: "clara.o@metrohealth.eco",
    role: "Receptionist",
    department: "Reception",
    status: "Active",
    lastLogin: "Today, 08:00 AM",
    permissionsCount: 6,
  },
  {
    id: "usr-03",
    name: "Marcus Sterling",
    email: "marcus.s@metrohealth.eco",
    role: "Insurance Employee",
    department: "Insurance",
    status: "Active",
    lastLogin: "Today, 09:12 AM",
    permissionsCount: 7,
  },
  {
    id: "usr-04",
    name: "Dr. Eleanor Vance",
    email: "eleanor.v@metrohealth.eco",
    role: "Department Manager",
    department: "Surgical Recovery",
    status: "Active",
    lastLogin: "Today, 07:45 AM",
    permissionsCount: 12,
  },
  {
    id: "usr-05",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    role: "Patient",
    department: "Patient Access",
    status: "Active",
    lastLogin: "Today, 11:20 AM",
    permissionsCount: 3,
  },
];

export const mockHospitalDepartments: HospitalDepartment[] = [
  {
    id: "dept-1",
    name: "Doctors & Clinical Staff",
    leadName: "Dr. Aris Thorne",
    staffCount: 48,
    currentWorkloadScore: 84,
    status: "Fully Staffed",
    openCommitmentsCount: 12,
  },
  {
    id: "dept-2",
    name: "Reception & Intake",
    leadName: "Clara Oswald",
    staffCount: 16,
    currentWorkloadScore: 78,
    status: "Fully Staffed",
    openCommitmentsCount: 5,
  },
  {
    id: "dept-3",
    name: "Insurance & Pre-Auth",
    leadName: "Marcus Sterling",
    staffCount: 22,
    currentWorkloadScore: 92,
    status: "High Demand",
    openCommitmentsCount: 18,
  },
  {
    id: "dept-4",
    name: "Billing & Revenue Cycle",
    leadName: "Teresa Ward",
    staffCount: 19,
    currentWorkloadScore: 72,
    status: "Fully Staffed",
    openCommitmentsCount: 8,
  },
  {
    id: "dept-5",
    name: "Patient Care Support",
    leadName: "Sarah Jenkins, RN",
    staffCount: 37,
    currentWorkloadScore: 88,
    status: "Fully Staffed",
    openCommitmentsCount: 14,
  },
];

export const mockSystemRules: SystemRuleConfig[] = [
  {
    id: "rule-1",
    category: "Notification Rules",
    title: "Urgent Post-Op Speech Alert SLA",
    description: "Broadcast SMS and in-app priority alert when patient mentions fever or swelling post-surgery.",
    enabled: true,
    value: "Immediate (<60s)",
  },
  {
    id: "rule-2",
    category: "AI Settings",
    title: "Clinical Entity Extraction Confidence Threshold",
    description: "Minimum semantic threshold required before creating auto-assigned medical commitment records.",
    enabled: true,
    value: "95% Confidence",
  },
  {
    id: "rule-3",
    category: "Routing Rules",
    title: "Prior-Authorization Autonomous Telephony Routing",
    description: "Route insurance queries directly to RCM queues bypassing front-desk switchboard.",
    enabled: true,
    value: "Direct RCM Bypass",
  },
];

let usersStore = [...mockAdminUsers];
let departmentsStore = [...mockHospitalDepartments];
let rulesStore = [...mockSystemRules];

/**
 * Admin Service (API-Ready Layer)
 * Future replacement point: GET /api/admin/analytics, POST /api/admin/users
 */
export const adminService = {
  async getOverview(): Promise<AdminOverviewData> {
    await new Promise((r) => setTimeout(r, 40));
    return mockAdminOverview;
  },

  async getUsers(): Promise<AdminUser[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...usersStore];
  },

  async createUser(data: Omit<AdminUser, "id" | "lastLogin">): Promise<AdminUser> {
    await new Promise((r) => setTimeout(r, 60));
    const newUser: AdminUser = {
      ...data,
      id: `usr-${Date.now()}`,
      lastLogin: "Never",
    };
    usersStore.unshift(newUser);
    return newUser;
  },

  async toggleUserStatus(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const user = usersStore.find((u) => u.id === id);
    if (!user) return false;
    user.status = user.status === "Active" ? "Deactivated" : "Active";
    return true;
  },

  async getDepartments(): Promise<HospitalDepartment[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...departmentsStore];
  },

  async getSystemRules(): Promise<SystemRuleConfig[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...rulesStore];
  },

  async toggleRule(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 50));
    const rule = rulesStore.find((r) => r.id === id);
    if (!rule) return false;
    rule.enabled = !rule.enabled;
    return true;
  },
};
