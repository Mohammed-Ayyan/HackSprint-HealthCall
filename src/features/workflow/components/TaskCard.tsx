import React from "react";
import { Clock, AlertTriangle, ArrowRight, UserPlus, CheckCircle2, Flame, ShieldAlert } from "lucide-react";
import { ActionItem, TaskStatus } from "@/shared/types/action";
import { Badge } from "@/shared/components/ui/Badge";
import { PriorityBadge } from "@/features/ai-intelligence/components/PriorityBadge";
import { getDepartmentColorClass } from "@/shared/utils/formatters";
import { cn } from "@/shared/utils/cn";

export interface TaskCardProps {
  task: ActionItem;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onEscalate?: (task: ActionItem) => void;
  onAssign?: (task: ActionItem) => void;
}

export function TaskCard({
  task,
  onStatusChange,
  onEscalate,
  onAssign,
}: TaskCardProps) {
  const isUrgentSLA = task.sla.isWarning || task.sla.isBreached || task.sla.remainingHours < 2;

  return (
    <div
      className={cn(
        "rounded-2xl p-4 bg-slate-900/90 border transition-all duration-200 space-y-3 shadow-lg select-none group",
        task.isEscalated
          ? "border-rose-500/50 bg-rose-950/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
          : isUrgentSLA
          ? "border-amber-500/40 bg-amber-950/15"
          : "border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900"
      )}
    >
      {/* Top Header: Department & Priority */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDepartmentColorClass(
            task.department
          )}`}
        >
          {task.department}
        </span>
        <PriorityBadge priority={task.priority} size="sm" />
      </div>

      {/* Task Title & Description */}
      <div>
        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
          {task.task}
        </h4>
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      {/* Patient info */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
        <span>Patient: <strong className="text-slate-300 font-sans">{task.patientName}</strong></span>
        <span className="text-slate-500">{task.patientMrn}</span>
      </div>

      {/* SLA Countdown pill */}
      <div
        className={cn(
          "flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-mono",
          task.sla.isBreached
            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
            : isUrgentSLA
            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
            : "bg-slate-950/80 text-cyan-300 border border-slate-800"
        )}
      >
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          <span>SLA Remaining:</span>
        </span>
        <span className="font-bold">
          {task.sla.remainingHours > 0
            ? `${task.sla.remainingHours.toFixed(1)} hrs`
            : "BREACHED"}
        </span>
      </div>

      {/* Escalation Tag if applicable */}
      {task.isEscalated && (
        <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[10px] text-rose-300 flex items-center gap-1.5 font-medium">
          <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Escalated to {task.escalatedTo || "Manager"}</span>
        </div>
      )}

      {/* Assignee & Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        {task.assignedTo ? (
          <div className="flex items-center gap-2">
            <img
              src={task.assignedTo.avatar}
              alt={task.assignedTo.name}
              className="h-6 w-6 rounded-full object-cover border border-slate-700"
            />
            <span className="text-[11px] text-slate-300 font-medium truncate max-w-[100px]">
              {task.assignedTo.name}
            </span>
          </div>
        ) : (
          <button
            onClick={() => onAssign && onAssign(task)}
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Assign Staff</span>
          </button>
        )}

        {/* Status Quick Advance or Escalate */}
        <div className="flex items-center gap-1">
          {!task.isEscalated && task.status !== "completed" && onEscalate && (
            <button
              onClick={() => onEscalate(task)}
              title="Escalate task to manager"
              className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 text-[10px] font-bold border border-slate-700 hover:border-rose-500/30 transition-colors cursor-pointer"
            >
              Escalate
            </button>
          )}

          {task.status !== "completed" && onStatusChange && (
            <button
              onClick={() => {
                const nextStatus: TaskStatus =
                  task.status === "pending"
                    ? "assigned"
                    : task.status === "assigned"
                    ? "in-progress"
                    : "completed";
                onStatusChange(task.id, nextStatus);
              }}
              title="Advance to next workflow stage"
              className="px-2 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Advance</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
