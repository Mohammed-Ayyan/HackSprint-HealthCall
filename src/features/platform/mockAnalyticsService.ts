import {
  AnalyticsSummary,
  CallVolumePoint,
  CategoryDistribution,
  DepartmentWorkload,
  ResolutionTimeMetric,
} from "@/shared/types/analytics";

export const mockAnalyticsSummary: AnalyticsSummary = {
  totalCalls: 1482,
  callsChangePercent: 14.8,
  completedTasks: 1290,
  tasksChangePercent: 22.4,
  pendingActions: 48,
  criticalCases: 12,
  criticalChangePercent: -8.3,
  avgResolutionHours: 1.8,
  overallSLACompliance: 97.4,
  automatedExtractionAccuracy: 99.2,
};

export const mockVolumeTrends: CallVolumePoint[] = [
  { time: "06:00", totalCalls: 18, criticalCalls: 1, resolvedActions: 14 },
  { time: "08:00", totalCalls: 84, criticalCalls: 3, resolvedActions: 72 },
  { time: "10:00", totalCalls: 195, criticalCalls: 4, resolvedActions: 168 },
  { time: "12:00", totalCalls: 242, criticalCalls: 2, resolvedActions: 215 },
  { time: "14:00", totalCalls: 210, criticalCalls: 3, resolvedActions: 198 },
  { time: "16:00", totalCalls: 178, criticalCalls: 1, resolvedActions: 160 },
  { time: "18:00", totalCalls: 96, criticalCalls: 0, resolvedActions: 92 },
  { time: "20:00", totalCalls: 42, criticalCalls: 1, resolvedActions: 40 },
];

export const mockIssueCategories: CategoryDistribution[] = [
  { category: "Appointment Request", count: 540, percentage: 36.4, color: "#22d3ee" }, // cyan
  { category: "Insurance Query", count: 325, percentage: 21.9, color: "#8b5cf6" }, // purple
  { category: "Billing Issue", count: 245, percentage: 16.5, color: "#f59e0b" }, // amber
  { category: "Medicine Refill", count: 210, percentage: 14.2, color: "#10b981" }, // emerald
  { category: "Emergency Concern", count: 98, percentage: 6.6, color: "#ef4444" }, // red
  { category: "Complaint / Feedback", count: 64, percentage: 4.4, color: "#ec4899" }, // pink
];

export const mockDepartmentWorkloads: DepartmentWorkload[] = [
  {
    department: "Reception",
    activeTasks: 18,
    pendingReview: 4,
    completedToday: 142,
    slaBreachRate: 1.8,
    avgResolutionHours: 0.6,
  },
  {
    department: "Insurance",
    activeTasks: 14,
    pendingReview: 7,
    completedToday: 89,
    slaBreachRate: 3.2,
    avgResolutionHours: 2.4,
  },
  {
    department: "Billing",
    activeTasks: 9,
    pendingReview: 3,
    completedToday: 76,
    slaBreachRate: 2.1,
    avgResolutionHours: 1.9,
  },
  {
    department: "Pharmacy",
    activeTasks: 6,
    pendingReview: 2,
    completedToday: 112,
    slaBreachRate: 0.8,
    avgResolutionHours: 0.8,
  },
  {
    department: "Emergency Triage",
    activeTasks: 2,
    pendingReview: 0,
    completedToday: 34,
    slaBreachRate: 0.0,
    avgResolutionHours: 0.1,
  },
  {
    department: "Clinical Team",
    activeTasks: 11,
    pendingReview: 5,
    completedToday: 68,
    slaBreachRate: 2.4,
    avgResolutionHours: 1.4,
  },
];

export const mockResolutionTimeMetrics: ResolutionTimeMetric[] = [
  { department: "Emergency", targetHours: 0.2, actualHours: 0.1 },
  { department: "Reception", targetHours: 1.5, actualHours: 0.6 },
  { department: "Pharmacy", targetHours: 2.0, actualHours: 0.8 },
  { department: "Billing", targetHours: 4.0, actualHours: 1.9 },
  { department: "Insurance", targetHours: 6.0, actualHours: 2.4 },
  { department: "Clinical", targetHours: 3.0, actualHours: 1.4 },
];

/**
 * Future backend replacement: src/features/platform/apiAnalyticsService.ts
 */
export const mockAnalyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    await new Promise((r) => setTimeout(r, 60));
    return mockAnalyticsSummary;
  },

  async getVolumeTrends(): Promise<CallVolumePoint[]> {
    await new Promise((r) => setTimeout(r, 60));
    return mockVolumeTrends;
  },

  async getIssueCategories(): Promise<CategoryDistribution[]> {
    await new Promise((r) => setTimeout(r, 60));
    return mockIssueCategories;
  },

  async getDepartmentWorkload(): Promise<DepartmentWorkload[]> {
    await new Promise((r) => setTimeout(r, 60));
    return mockDepartmentWorkloads;
  },

  async getResolutionTimeMetrics(): Promise<ResolutionTimeMetric[]> {
    await new Promise((r) => setTimeout(r, 60));
    return mockResolutionTimeMetrics;
  },
};
