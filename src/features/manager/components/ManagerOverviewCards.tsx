"use client";

import React from "react";
import { Users, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import { ManagerOverviewData } from "../types";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface ManagerOverviewCardsProps {
  overview: ManagerOverviewData;
}

export function ManagerOverviewCards({ overview }: ManagerOverviewCardsProps) {
  return (
    <div className="space-y-6">
      {/* Management Hub Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1d17] via-[#0f241c] to-[#081510] p-6 border border-[#1e3c2f] shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.12),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#142e23] border border-[#2d5a47] flex items-center justify-center text-[#34d399] shadow-inner">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
                  {overview.departmentName}
                </h1>
                <Badge variant="teal" size="sm">
                  Supervised by {overview.managerName}
                </Badge>
              </div>
              <p className="text-sm text-stone-400 mt-1">
                Operational Equilibrium & Departmental SLA Oversight
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#08140f] px-4 py-2.5 rounded-xl border border-[#1a382c] text-right">
              <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Department Vitality</p>
              <div className="flex items-center gap-2 justify-end">
                <span className="h-2 w-2 rounded-full bg-[#34d399] animate-pulse" />
                <span className="text-base font-mono font-bold text-[#34d399]">
                  {overview.departmentVitalityScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metrics: Employees, Active tasks, Completed tasks, Overdue tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Employees */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#132820] border border-[#254d3c] flex items-center justify-center text-[#34d399]">
              <Users className="h-4 w-4" />
            </div>
            <Badge variant="teal" size="sm">CLINICAL TEAM</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Employees Active
            </p>
            <p className="text-xl font-bold text-stone-100 mt-1">{overview.totalEmployeesCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Front desk, nurses & insurance</p>
          </div>
        </Card>

        {/* Card 2: Active Tasks */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#18231a] border border-[#3b4b2e] flex items-center justify-center text-[#f59e0b]">
              <Clock className="h-4 w-4" />
            </div>
            <Badge variant="amber" size="sm">DISPATCHED</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Active Tasks
            </p>
            <p className="text-xl font-bold text-stone-100 mt-1">{overview.activeTasksCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Within standard SLA window</p>
          </div>
        </Card>

        {/* Card 3: Completed Tasks */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#132820] border border-[#254d3c] flex items-center justify-center text-[#34d399]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <Badge variant="green" size="sm">RESOLVED</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Completed Tasks
            </p>
            <p className="text-xl font-bold text-stone-100 mt-1">{overview.completedTasksCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Avg turnaround {overview.avgResolutionHours}h</p>
          </div>
        </Card>

        {/* Card 4: Overdue Tasks */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#231515] border border-[#4d2525] flex items-center justify-center text-[#f87171]">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <Badge variant="red" size="sm">ACTION NEEDED</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Overdue Tasks
            </p>
            <p className="text-xl font-bold text-[#f87171] mt-1">{overview.overdueTasksCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Escalated to management queue</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
