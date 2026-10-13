import { CallPriority, CallSentiment } from "../types/call";

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function getPriorityBadgeClass(priority: CallPriority): string {
  switch (priority) {
    case "critical":
      return "bg-rose-500/15 text-rose-400 border border-rose-500/30";
    case "high":
      return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
    case "medium":
      return "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30";
    case "low":
      return "bg-slate-500/15 text-slate-400 border border-slate-500/30";
  }
}

export function getSentimentBadgeClass(sentiment: CallSentiment): string {
  switch (sentiment) {
    case "positive":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    case "neutral":
      return "bg-slate-500/15 text-slate-300 border border-slate-600/30";
    case "concerned":
      return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
    case "frustrated":
      return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
    case "angry":
      return "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse";
  }
}

export function getDepartmentColorClass(dept: string): string {
  switch (dept.toLowerCase()) {
    case "reception":
      return "text-cyan-400 bg-cyan-950/40 border-cyan-800/40";
    case "insurance":
      return "text-purple-400 bg-purple-950/40 border-purple-800/40";
    case "customer support":
      return "text-blue-400 bg-blue-950/40 border-blue-800/40";
    case "billing":
      return "text-amber-400 bg-amber-950/40 border-amber-800/40";
    case "pharmacy":
      return "text-emerald-400 bg-emerald-950/40 border-emerald-800/40";
    case "emergency triage":
    case "emergency":
      return "text-rose-400 bg-rose-950/40 border-rose-800/40";
    default:
      return "text-slate-400 bg-slate-800/40 border-slate-700/40";
  }
}
