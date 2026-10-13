import { NotificationItem, NotificationType } from "@/shared/types/notification";

let notificationsStore: NotificationItem[] = [
  {
    id: "notif-doc-1",
    type: "new-task",
    title: "Doctor: New follow-up assigned",
    message: "48-hour post-op suture and lab recheck assigned to Dr. Rahul for Rahul Sharma.",
    priority: "high",
    timestamp: "12 mins ago",
    read: false,
    relatedTaskId: "dfu-01",
    patientName: "Rahul Sharma",
    actionUrl: "/doctor/dashboard",
  },
  {
    id: "notif-ins-1",
    type: "escalation",
    title: "Insurance: Claim requires review",
    message: "BlueCross diagnostic ultrasound prior-auth approaching 4-hour SLA window.",
    priority: "high",
    timestamp: "24 mins ago",
    read: false,
    relatedTaskId: "ic-01",
    patientName: "Rahul Sharma",
    actionUrl: "/insurance/dashboard",
  },
  {
    id: "notif-mgr-1",
    type: "deadline-missed",
    title: "Manager: Task overdue",
    message: "Specialty biologics pharmacy dispensation is +2.0 hours past clinical SLA window.",
    priority: "critical",
    timestamp: "35 mins ago",
    read: false,
    relatedTaskId: "esc-03",
    patientName: "Eleanor Rigby",
    actionUrl: "/manager/dashboard",
  },
  {
    id: "notif-pat-1",
    type: "new-task",
    title: "Patient: Appointment confirmed",
    message: "Post-op consultation confirmed with Dr. Rahul for Wednesday, 15 October at 10:30 AM.",
    priority: "medium",
    timestamp: "45 mins ago",
    read: false,
    relatedTaskId: "apt-101",
    patientName: "Rahul Sharma",
    actionUrl: "/patient/dashboard",
  },
  {
    id: "notif-1",
    type: "critical-call",
    title: "Critical Triage: Acute Dyspnea & Chest Pain",
    message: "Samantha Reyes called with sudden onset crushing chest pain. 911 EMS dispatched.",
    priority: "critical",
    timestamp: "1 hour ago",
    read: true,
    relatedCallId: "call-006",
    patientName: "Samantha Reyes",
    actionUrl: "/calls/call-006",
  },
];

/**
 * Future backend replacement: src/features/platform/apiNotificationsService.ts
 */
export const mockNotificationsService = {
  async getNotifications(typeFilter?: NotificationType | "all"): Promise<NotificationItem[]> {
    await new Promise((r) => setTimeout(r, 40));
    if (!typeFilter || typeFilter === "all") return [...notificationsStore];
    return notificationsStore.filter((n) => n.type === typeFilter);
  },

  async markAsRead(id: string): Promise<void> {
    const item = notificationsStore.find((n) => n.id === id);
    if (item) item.read = true;
  },

  async markAllAsRead(): Promise<void> {
    notificationsStore.forEach((n) => (n.read = true));
  },

  getUnreadCount(): number {
    return notificationsStore.filter((n) => !n.read).length;
  },
};
