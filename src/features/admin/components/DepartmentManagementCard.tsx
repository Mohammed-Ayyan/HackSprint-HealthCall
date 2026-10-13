"use client";

import React from "react";
import { Building2, Users, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { HospitalDepartment } from "../types";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface DepartmentManagementCardProps {
  departments: HospitalDepartment[];
}

export function DepartmentManagementCard({ departments }: DepartmentManagementCardProps) {
  return (
    <Card className="bg-[#0b1712] border-[#1b362a]">
      <CardHeader className="border-b border-[#1b362a] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base text-stone-100">Hospital Department Ecosystem</CardTitle>
              <p className="text-xs text-stone-400 mt-0.5">
                Doctor hubs, Reception desks, Insurance & Billing units, and Patient Support wings
              </p>
            </div>
          </div>
          <Badge variant="teal">All 5 Divisions Linked</Badge>
        </div>
      </CardHeader>

      <div className="divide-y divide-[#162e24]">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-5 hover:bg-[#0e2019]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-[#132c21] border border-[#23533c] flex items-center justify-center text-[#34d399] flex-shrink-0 mt-0.5 font-bold font-mono text-xs">
                {dept.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-sm font-bold text-stone-100">{dept.name}</h4>
                  <Badge
                    variant={dept.status === "High Demand" ? "amber" : "green"}
                    size="sm"
                  >
                    {dept.status}
                  </Badge>
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  Department Lead: <span className="text-stone-100 font-semibold">{dept.leadName}</span>
                </p>

                <div className="flex items-center gap-4 text-xs text-stone-400 mt-2 font-mono flex-wrap">
                  <span>Staff: {dept.staffCount} specialists</span>
                  <span>•</span>
                  <span className="text-[#34d399]">{dept.openCommitmentsCount} active commitments</span>
                </div>

                {/* Workload score indicator */}
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="w-40 h-1.5 rounded-full bg-[#162c22] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        dept.currentWorkloadScore > 90 ? "bg-[#f59e0b]" : "bg-[#34d399]"
                      }`}
                      style={{ width: `${dept.currentWorkloadScore}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">
                    Load: {dept.currentWorkloadScore}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <span className="text-xs font-mono text-[#34d399] bg-[#0c241a] px-3 py-1.5 rounded-lg border border-[#1c4533]">
                Operational
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
