import { NotificationItem, NotificationType } from "@/shared/types/notification";

let notificationsStore: NotificationItem[] = [
  {
    id: "notif-1",
    type: "critical-call",
    title: "Critical Triage: Acute Dyspnea & Chest Pain",
    message: "Samantha Reyes called with sudden onset crushing chest pain. 911 EMS dispatched.",
    priority: "critical",
    timestamp: "10 mins ago",
    read: false,
    relatedCallId: "call-006",
    patientName: "Samantha Reyes",
    actionUrl: "/calls/call-006",
  },
  {
    id: "notif-2",
    type: "escalation",
    title: "Task Escalated to Manager",
    message: "Billing refund ($450) for Fatima Al-Mansoor escalated. SLA within 45 mins of breach.",
    priority: "high",
    timestamp: "28 mins ago",
    read: false,
    relatedTaskId: "act-401",
    patientName: "Fatima Al-Mansoor",
    actionUrl: "/actions",
  },
  {
    id: "notif-3",
    type: "new-task",
    title: "New Task Assigned to Reception",
    message: "Urgent post-op consultation appointment for Rahul Sharma with Dr. Thorne.",
    priority: "high",
    timestamp: "45 mins ago",
    read: false,
    relatedCallId: "call-live-001",
    relatedTaskId: "act-101",
    patientName: "Rahul Sharma",
    actionUrl: "/calls/call-live-001",
  },
  {
    id: "notif-4",
    type: "deadline-missed",
    title: "SLA Warning Threshold: 50m Remaining",
    message: "Pharmacy 90-day Lisinopril authorization deadline approaching at 12:00 PM.",
    priority: "medium",
    timestamp: "1 hour ago",
    read: true,
    relatedTaskId: "act-501",
    patientName: "David Kowalski",
    actionUrl: "/actions",
  },
  {
    id: "notif-5",
    type: "new-task",
    title: "Prior-Auth Verification Needed",
    message: "Aetna cardiac catheterization clinical documentation upload required for Elena Morales.",
    priority: "high",
    timestamp: "2 hours ago",
    read: true,
    relatedCallId: "call-002",
    patientName: "Elena Morales",
    actionUrl: "/calls/call-002",
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
