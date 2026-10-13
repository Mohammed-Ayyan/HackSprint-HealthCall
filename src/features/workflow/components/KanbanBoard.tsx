"use client";

import React, { useState } from "react";
import { Plus, Filter, KanbanSquare, CheckCircle, AlertTriangle } from "lucide-react";
import { ActionItem, TaskStatus, DepartmentName } from "@/shared/types/action";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export interface KanbanBoardProps {
  initialTasks: ActionItem[];
  onTaskUpdated?: (updatedTask: ActionItem) => void;
  onAssignTask?: (task: ActionItem) => void;
  onEscalateTask?: (task: ActionItem) => void;
}

const columns: { id: TaskStatus; label: string; color: string; badgeVariant: "default" | "cyan" | "purple" | "emerald" }[] = [
  { id: "pending", label: "Pending Triage", color: "border-slate-800", badgeVariant: "default" },
  { id: "assigned", label: "Assigned to Staff", color: "border-purple-800/40", badgeVariant: "purple" },
  { id: "in-progress", label: "In Active Progress", color: "border-cyan-800/40", badgeVariant: "cyan" },
  { id: "completed", label: "Completed & Verified", color: "border-emerald-800/40", badgeVariant: "emerald" },
];

export function KanbanBoard({
  initialTasks,
  onTaskUpdated,
  onAssignTask,
  onEscalateTask,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<ActionItem[]>(initialTasks);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const filteredTasks = departmentFilter === "all"
    ? tasks
    : tasks.filter((t) => t.department.toLowerCase() === departmentFilter.toLowerCase());

  const handleStatusChange = (taskId: string, nextStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, status: nextStatus, updatedAt: new Date().toISOString() };
          if (onTaskUpdated) onTaskUpdated(updated);
          return updated;
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Department Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Department:</span>
          <div className="flex flex-wrap gap-1.5">
            {["all", "Reception", "Insurance", "Billing", "Pharmacy", "Emergency Triage"].map((dept) => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  departmentFilter === dept
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-800/60 text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                {dept === "all" ? "All Departments" : dept}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <strong className="text-cyan-300">{filteredTasks.length}</strong> operational tasks
        </div>
      </div>

      {/* 4 Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl bg-slate-950/60 border ${col.color} p-4 space-y-4 min-h-[500px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {col.label}
                  </h3>
                  <Badge variant={col.badgeVariant} size="sm">
                    {colTasks.length}
                  </Badge>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 text-xs text-slate-600">
                    No items in {col.label.toLowerCase()}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onAssign={onAssignTask}
                      onEscalate={onEscalateTask}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
