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
    <Card className="bg-white border-[#e2e8df] shadow-sm">
      <CardHeader className="border-b border-[#edf2ea] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#e8f3ec] text-[#1b4332] flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base text-[#142019]">Hospital Department Ecosystem</CardTitle>
              <p className="text-xs text-[#627267] mt-0.5">
                Doctor hubs, Reception desks, Insurance & Billing units, and Patient Support wings
              </p>
            </div>
          </div>
          <Badge variant="teal">All 5 Divisions Linked</Badge>
        </div>
      </CardHeader>

      <div className="divide-y divide-[#edf2ea]">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-5 hover:bg-[#fbfdfb] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-[#e8f3ec] text-[#1b4332] border border-[#dce8df] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold font-mono text-xs">
                {dept.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-sm font-bold text-[#142019]">{dept.name}</h4>
                  <Badge
                    variant={dept.status === "High Demand" ? "amber" : "emerald"}
                    size="sm"
                  >
                    {dept.status}
                  </Badge>
                </div>
                <p className="text-xs text-[#28382e] mt-1">
                  Department Lead: <span className="text-[#142019] font-semibold">{dept.leadName}</span>
                </p>

                <div className="flex items-center gap-4 text-xs text-[#627267] mt-2 font-mono flex-wrap">
                  <span>Staff: {dept.staffCount} specialists</span>
                  <span>•</span>
                  <span className="text-[#059669] font-semibold">{dept.openCommitmentsCount} active commitments</span>
                </div>

                {/* Workload score indicator */}
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="w-40 h-1.5 rounded-full bg-[#e2e8df] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        dept.currentWorkloadScore > 90 ? "bg-[#d97706]" : "bg-[#059669]"
                      }`}
                      style={{ width: `${dept.currentWorkloadScore}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#627267]">
                    Load: {dept.currentWorkloadScore}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <span className="text-xs font-mono text-[#059669] bg-[#f0fdf4] px-3 py-1.5 rounded-lg border border-[#bbf7d0]">
                Operational
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
