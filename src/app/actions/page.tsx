"use client";

import React, { useState, useEffect } from "react";
import {
  KanbanSquare,
  Network,
  Clock,
  ShieldAlert,
  UserCheck,
  Plus,
  Filter,
} from "lucide-react";
import { AppShell } from "@/shared/components/layout/AppShell";
import { KanbanBoard } from "@/features/workflow/components/KanbanBoard";
import { SLATrackerCard } from "@/features/workflow/components/SLATrackerCard";
import { DepartmentRoutingUI } from "@/features/workflow/components/DepartmentRoutingUI";
import { EscalationBanner } from "@/features/workflow/components/EscalationBanner";
import { mockTasksService } from "@/features/workflow/mockTasksService";
import { mockUserService } from "@/features/platform/mockUserService";
import { ActionItem, DepartmentRoutingRule, TaskStatus } from "@/shared/types/action";
import { User } from "@/shared/types/user";
import { Modal } from "@/shared/components/ui/Modal";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export default function ActionsPage() {
  const [tasks, setTasks] = useState<ActionItem[]>([]);
  const [routingRules, setRoutingRules] = useState<DepartmentRoutingRule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTaskForAssign, setActiveTaskForAssign] = useState<ActionItem | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActionData();
  }, []);

  const loadActionData = async () => {
    setLoading(true);
    const [actionList, rules, staffList] = await Promise.all([
      mockTasksService.getTasks(),
      mockTasksService.getRoutingRules(),
      mockUserService.getUsers(),
    ]);
    setTasks(actionList);
    setRoutingRules(rules);
    setUsers(staffList);
    setLoading(false);
  };

  const handleOpenAssignModal = (task: ActionItem) => {
    setActiveTaskForAssign(task);
    setIsAssignModalOpen(true);
  };

  const handleAssignUser = async (user: User) => {
    if (!activeTaskForAssign) return;
    const updated = await mockTasksService.assignTask(activeTaskForAssign.id, {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    });
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    }
    setIsAssignModalOpen(false);
    setActiveTaskForAssign(null);
  };

  const handleEscalateTask = async (task: ActionItem) => {
    const updated = await mockTasksService.escalateTask(
      task.id,
      "Escalated by supervisor for urgent clinical resolution."
    );
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    }
  };

  const escalatedTasks = tasks.filter((t) => t.isEscalated);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-mono">
                Operational Action Workflows
              </h1>
              <Badge variant="cyan" size="sm">
                Kanban Board
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous clinical task tracking, department assignments, SLA monitoring, and escalations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">
              6 Departments Connected
            </Badge>
          </div>
        </div>

        {/* Escalation Alert */}
        {escalatedTasks.length > 0 && <EscalationBanner escalatedTasks={escalatedTasks} />}

        {/* Main Kanban Board */}
        <KanbanBoard
          initialTasks={tasks}
          onAssignTask={handleOpenAssignModal}
          onEscalateTask={handleEscalateTask}
        />

        {/* Bottom SLA Tracker & Routing Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <SLATrackerCard tasks={tasks} />
          </div>
          <div className="lg:col-span-6">
            <DepartmentRoutingUI rules={routingRules} />
          </div>
        </div>

        {/* Employee Assignment Modal */}
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title="Assign Staff to Operational Task"
          description={activeTaskForAssign ? `Task: ${activeTaskForAssign.task}` : undefined}
          size="md"
        >
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Select available hospital staff member from {activeTaskForAssign?.department || "relevant"} department:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleAssignUser(u)}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="h-9 w-9 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {u.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {u.role} • {u.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant={u.status === "active" ? "emerald" : "default"} size="sm">
                      {u.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
