"use client";

import React from "react";
import { Users, BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { EmployeeWorkload } from "../types";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface TeamWorkloadManagerProps {
  workloads: EmployeeWorkload[];
}

export function TeamWorkloadManager({ workloads }: TeamWorkloadManagerProps) {
  const getWorkloadBadge = (status: EmployeeWorkload["workloadStatus"]) => {
    switch (status) {
      case "Optimal":
        return <Badge variant="green">OPTIMAL</Badge>;
      case "Balanced":
        return <Badge variant="teal">BALANCED</Badge>;
      case "Near Capacity":
        return <Badge variant="amber">NEAR CAPACITY</Badge>;
      case "Overloaded":
        return <Badge variant="red">OVERLOADED</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <Card className="bg-[#0b1712] border-[#1b362a]">
      <CardHeader className="border-b border-[#1b362a] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base text-stone-100">Team Workload & Performance Matrix</CardTitle>
              <p className="text-xs text-stone-400 mt-0.5">
                Real-time task distribution, throughput efficiency, and clinical workload capacity
              </p>
            </div>
          </div>
          <Badge variant="teal">Live Balancing</Badge>
        </div>
      </CardHeader>

      <div className="divide-y divide-[#162e24]">
        {workloads.map((emp) => (
          <div
            key={emp.id}
            className="p-5 hover:bg-[#0e2019]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-[#132c21] border border-[#23533c] flex items-center justify-center text-[#34d399] flex-shrink-0 mt-0.5 font-bold font-mono text-xs">
                {emp.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-sm font-bold text-stone-100">{emp.name}</h4>
                  <span className="text-xs text-stone-400">{emp.role}</span>
                  {getWorkloadBadge(emp.workloadStatus)}
                </div>

                <div className="flex items-center gap-4 text-xs text-stone-400 mt-1.5 flex-wrap font-mono">
                  <span className="text-stone-300">Active Tasks: <strong className="text-white">{emp.activeTasks}</strong></span>
                  <span>•</span>
                  <span className="text-[#34d399]">Completed: {emp.completedToday}</span>
                  <span>•</span>
                  {emp.overdueTasks > 0 ? (
                    <span className="text-[#f87171] font-semibold">Overdue: {emp.overdueTasks}</span>
                  ) : (
                    <span className="text-stone-500">0 Overdue</span>
                  )}
                </div>

                {/* Progress bar visual for workload load */}
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="w-48 h-1.5 rounded-full bg-[#162c22] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        emp.workloadStatus === "Overloaded"
                          ? "bg-[#f87171]"
                          : emp.workloadStatus === "Near Capacity"
                          ? "bg-[#f59e0b]"
                          : "bg-[#34d399]"
                      }`}
                      style={{ width: `${Math.min(emp.activeTasks * 10, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">
                    Cap: {emp.activeTasks * 10}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-end justify-between pl-12 md:pl-0">
              <div className="bg-[#091510] px-3.5 py-1.5 rounded-xl border border-[#1a382c] text-right">
                <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-mono">
                  Efficiency Rating
                </span>
                <span className="text-sm font-mono font-bold text-[#34d399]">
                  {emp.efficiencyRating}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
