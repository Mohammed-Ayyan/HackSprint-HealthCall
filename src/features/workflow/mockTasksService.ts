import { ActionItem, TaskStatus, DepartmentName, DepartmentRoutingRule } from "@/shared/types/action";
import { mockCallsList } from "./mockCallsService";

// Build action items from the calls
export const mockActionItems: ActionItem[] = [
  {
    id: "act-101",
    callId: "call-live-001",
    patientName: "Rahul Sharma",
    patientMrn: "MRN-884920",
    task: "Schedule urgent post-op consultation with Dr. Thorne",
    description: "Follow-up for post-op laparoscopic appendectomy with fever (100.8°F).",
    department: "Reception",
    priority: "high",
    deadline: "Tomorrow 09:00 AM",
    status: "assigned",
    assignedTo: {
      id: "usr-2",
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      role: "Receptionist",
    },
    evidenceQuote: "I really need a follow-up appointment as soon as possible... fever of 100.8 degrees.",
    sla: {
      totalHours: 24,
      remainingHours: 18.5,
      deadlineTimestamp: "2026-10-14T09:00:00Z",
      isBreached: false,
      isWarning: false,
    },
    isEscalated: false,
    createdAt: "2026-10-13T11:24:00Z",
    updatedAt: "2026-10-13T11:25:30Z",
  },
  {
    id: "act-102",
    callId: "call-live-001",
    patientName: "Rahul Sharma",
    patientMrn: "MRN-884920",
    task: "Expedite BlueCross prior-auth verification for post-op imaging",
    description: "Check if pending pre-authorization covers ultrasound scan.",
    department: "Insurance",
    priority: "medium",
    deadline: "Tomorrow 11:00 AM",
    status: "pending",
    evidenceQuote: "BlueCross had a pending pre-auth on my post-op ultrasound... out-of-pocket bill.",
    sla: {
      totalHours: 24,
      remainingHours: 20.5,
      deadlineTimestamp: "2026-10-14T11:00:00Z",
      isBreached: false,
      isWarning: false,
    },
    isEscalated: false,
    createdAt: "2026-10-13T11:24:00Z",
    updatedAt: "2026-10-13T11:24:00Z",
  },
  {
    id: "act-103",
    callId: "call-live-001",
    patientName: "Rahul Sharma",
    patientMrn: "MRN-884920",
    task: "Clinical triage alert: Post-op fever monitoring protocol",
    description: "Nurse consultation regarding surgical incision redness and temperature monitoring.",
    department: "Clinical Team",
    priority: "critical",
    deadline: "Today within 2 hours",
    status: "in-progress",
    assignedTo: {
      id: "usr-6",
      name: "Nurse Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      role: "Doctor",
    },
    evidenceQuote: "I've developed a fever of 100.8 degrees and the lower incision feels swollen.",
    sla: {
      totalHours: 2,
      remainingHours: 0.9,
      deadlineTimestamp: "2026-10-13T13:24:00Z",
      isBreached: false,
      isWarning: true,
    },
    isEscalated: false,
    createdAt: "2026-10-13T11:24:00Z",
    updatedAt: "2026-10-13T11:28:00Z",
  },
  {
    id: "act-201",
    callId: "call-002",
    patientName: "Elena Morales",
    patientMrn: "MRN-672194",
    task: "Fax Dr. Chen's signed cardiac notes to Aetna expedited portal",
    description: "Urgent documentation needed for cardiac catheterization next Tuesday.",
    department: "Insurance",
    priority: "high",
    deadline: "Today 01:00 PM",
    status: "in-progress",
    assignedTo: {
      id: "usr-3",
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "Insurance Employee",
    },
    evidenceQuote: "Aetna told me today that Metro Health still hasn't sent the doctor's clinical notes!",
    sla: {
      totalHours: 4,
      remainingHours: 1.2,
      deadlineTimestamp: "2026-10-13T13:00:00Z",
      isBreached: false,
      isWarning: true,
    },
    isEscalated: false,
    createdAt: "2026-10-13T10:45:00Z",
    updatedAt: "2026-10-13T11:00:00Z",
  },
  {
    id: "act-202",
    callId: "call-002",
    patientName: "Elena Morales",
    patientMrn: "MRN-672194",
    task: "Send confirmation SMS with Aetna pre-auth reference number to patient",
    description: "Reassure patient by sending reference ticket after documents are uploaded.",
    department: "Customer Support",
    priority: "medium",
    deadline: "Today 02:00 PM",
    status: "pending",
    evidenceQuote: "I will text you the insurer confirmation receipt by 2:00 PM today.",
    sla: {
      totalHours: 5,
      remainingHours: 2.2,
      deadlineTimestamp: "2026-10-13T14:00:00Z",
      isBreached: false,
      isWarning: false,
    },
    isEscalated: false,
    createdAt: "2026-10-13T10:45:00Z",
    updatedAt: "2026-10-13T10:45:00Z",
  },
  {
    id: "act-401",
    callId: "call-004",
    patientName: "Fatima Al-Mansoor",
    patientMrn: "MRN-190442",
    task: "Process $450 merchant refund to card ending 4109",
    description: "Duplicate debit for August Brain MRI scan.",
    department: "Billing",
    priority: "high",
    deadline: "Today 01:00 PM",
    status: "in-progress",
    assignedTo: {
      id: "usr-4",
      name: "David Ross",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      role: "Manager",
    },
    evidenceQuote: "Metro Health charged my credit card $450 twice for the exact same MRI scan from August!",
    sla: {
      totalHours: 3,
      remainingHours: 0.8,
      deadlineTimestamp: "2026-10-13T13:00:00Z",
      isBreached: false,
      isWarning: true,
    },
    isEscalated: true,
    escalatedTo: "Hospital CFO & Compliance Officer",
    escalationReason: "Billing SLA threshold within 45 minutes; duplicate merchant debit complaint",
    createdAt: "2026-10-13T08:15:00Z",
    updatedAt: "2026-10-13T10:30:00Z",
  },
  {
    id: "act-501",
    callId: "call-005",
    patientName: "David Kowalski",
    patientMrn: "MRN-551028",
    task: "Route 90-day Lisinopril/Metformin refill authorization to Dr. Thorne",
    description: "Patient running out in 24-48 hours. Pharmacy requires electronic re-authorization.",
    department: "Pharmacy",
    priority: "medium",
    deadline: "Today 12:00 PM",
    status: "assigned",
    assignedTo: {
      id: "usr-5",
      name: "Robert Sterling",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      role: "Doctor",
    },
    evidenceQuote: "I only have enough pills for today and tomorrow.",
    sla: {
      totalHours: 4,
      remainingHours: 0.5,
      deadlineTimestamp: "2026-10-13T12:00:00Z",
      isBreached: false,
      isWarning: true,
    },
    isEscalated: false,
    createdAt: "2026-10-13T07:45:00Z",
    updatedAt: "2026-10-13T09:00:00Z",
  },
  {
    id: "act-301",
    callId: "call-003",
    patientName: "Michael Chen",
    patientMrn: "MRN-331902",
    task: "Book Dr. Vance appointment for Friday 4:30 PM",
    description: "Diabetic checkup and HbA1c review scheduled.",
    department: "Reception",
    priority: "medium",
    deadline: "Today 05:00 PM",
    status: "completed",
    assignedTo: {
      id: "usr-2",
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      role: "Receptionist",
    },
    evidenceQuote: "Dr. Vance has an opening this Friday, October 17th at 4:30 PM.",
    sla: {
      totalHours: 8,
      remainingHours: 0,
      deadlineTimestamp: "2026-10-13T17:00:00Z",
      isBreached: false,
      isWarning: false,
    },
    isEscalated: false,
    createdAt: "2026-10-13T09:30:00Z",
    updatedAt: "2026-10-13T09:55:00Z",
  },
  {
    id: "act-601",
    callId: "call-006",
    patientName: "Samantha Reyes",
    patientMrn: "MRN-902141",
    task: "EMS 911 Ambulance Dispatched to patient residence",
    description: "Active dyspnea and chest pain. Paramedic unit en-route.",
    department: "Emergency Triage",
    priority: "critical",
    deadline: "Immediate (Under 10 mins)",
    status: "completed",
    assignedTo: {
      id: "usr-1",
      name: "Dr. Aris Thorne",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "Doctor",
    },
    evidenceQuote: "I can barely breathe... chest feels like someone is standing on it and my left arm is throbbing.",
    sla: {
      totalHours: 0.2,
      remainingHours: 0,
      deadlineTimestamp: "2026-10-13T07:00:00Z",
      isBreached: false,
      isWarning: false,
    },
    isEscalated: false,
    createdAt: "2026-10-13T06:50:00Z",
    updatedAt: "2026-10-13T06:58:00Z",
  },
];

export const mockDepartmentRoutingRules: DepartmentRoutingRule[] = [
  {
    intent: "Insurance Query",
    targetDepartment: "Insurance",
    defaultPriority: "high",
    slaTargetHours: 4,
    autoAssignee: "Marcus Vance",
  },
  {
    intent: "Appointment Request",
    targetDepartment: "Reception",
    defaultPriority: "medium",
    slaTargetHours: 8,
    autoAssignee: "Sarah Jenkins",
  },
  {
    intent: "Complaint",
    targetDepartment: "Customer Support",
    defaultPriority: "high",
    slaTargetHours: 4,
    autoAssignee: "Lisa Ray",
  },
  {
    intent: "Billing Issue",
    targetDepartment: "Billing",
    defaultPriority: "high",
    slaTargetHours: 3,
    autoAssignee: "David Ross",
  },
  {
    intent: "Medicine Refill",
    targetDepartment: "Pharmacy",
    defaultPriority: "medium",
    slaTargetHours: 6,
    autoAssignee: "Robert Sterling",
  },
  {
    intent: "Emergency Concern",
    targetDepartment: "Emergency Triage",
    defaultPriority: "critical",
    slaTargetHours: 0.2,
    autoAssignee: "Emergency Duty Desk",
  },
];

import { apiTaskService } from "@/features/platform/tasks/apiTaskService";

/**
 * Healthcare Workflow & Operational Task Service
 * Backed by live MongoDB backend (/api/v1/tasks) with fallback.
 */
export const mockTasksService = {
  async getTasks(filters?: {
    status?: TaskStatus;
    department?: DepartmentName;
    priority?: string;
    search?: string;
  }): Promise<ActionItem[]> {
    try {
      const realTasks = await apiTaskService.getTasks(filters as any);
      if (realTasks && realTasks.length > 0) {
        return realTasks;
      }
    } catch (e: any) {
      console.warn("[mockTasksService] Live tasks unavailable, using fallback:", e.message);
    }

    let items = [...mockActionItems];

    if (filters?.status) {
      items = items.filter((i) => i.status === filters.status);
    }
    if (filters?.department) {
      items = items.filter((i) => i.department === filters.department);
    }
    if (filters?.priority) {
      items = items.filter((i) => i.priority === filters.priority);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.task.toLowerCase().includes(q) ||
          i.patientName.toLowerCase().includes(q) ||
          i.department.toLowerCase().includes(q)
      );
    }

    return items;
  },

  async updateTaskStatus(taskId: string, newStatus: TaskStatus): Promise<ActionItem | null> {
    try {
      const updated = await apiTaskService.updateTaskStatus(taskId, newStatus);
      if (updated) return updated;
    } catch (e: any) {
      console.warn("[mockTasksService] Live status update failed:", e.message);
    }

    const task = mockActionItems.find((i) => i.id === taskId);
    if (!task) return null;
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
    return { ...task };
  },

  async assignTask(
    taskId: string,
    user: { id: string; name: string; avatar: string; role: string }
  ): Promise<ActionItem | null> {
    try {
      const updated = await apiTaskService.assignTask(taskId, user.id);
      if (updated) return updated;
    } catch (e: any) {
      console.warn("[mockTasksService] Live assignment failed:", e.message);
    }

    const task = mockActionItems.find((i) => i.id === taskId);
    if (!task) return null;
    task.assignedTo = user;
    if (task.status === "pending") {
      task.status = "assigned";
    }
    task.updatedAt = new Date().toISOString();
    return { ...task };
  },

  async escalateTask(taskId: string, reason: string): Promise<ActionItem | null> {
    try {
      const updated = await apiTaskService.updateTaskStatus(taskId, "IN_PROGRESS");
      if (updated) {
        updated.isEscalated = true;
        updated.escalatedTo = "Operations Executive / Manager";
        updated.escalationReason = reason;
        return updated;
      }
    } catch (e: any) {
      console.warn("[mockTasksService] Live escalate failed:", e.message);
    }

    const task = mockActionItems.find((i) => i.id === taskId);
    if (!task) return null;
    task.isEscalated = true;
    task.escalatedTo = "Operations Executive / Manager";
    task.escalationReason = reason;
    task.priority = "critical";
    task.updatedAt = new Date().toISOString();
    return { ...task };
  },

  async getRoutingRules(): Promise<DepartmentRoutingRule[]> {
    return mockDepartmentRoutingRules;
  },

  async getOverdueAndEscalated(): Promise<ActionItem[]> {
    try {
      const allTasks = await this.getTasks();
      return allTasks.filter((i) => i.isEscalated || i.sla.isBreached || i.sla.isWarning);
    } catch {
      return mockActionItems.filter((i) => i.isEscalated || i.sla.isBreached || i.sla.isWarning);
    }
  },
};
