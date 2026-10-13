"use client";

import React from "react";
import { ShieldCheck, PhoneCall, Users, CheckCircle2, Sparkles, Building2, Activity } from "lucide-react";
import { AdminOverviewData } from "../types";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface AdminOverviewCardsProps {
  overview: AdminOverviewData;
}

export function AdminOverviewCards({ overview }: AdminOverviewCardsProps) {
  return (
    <div className="space-y-6">
      {/* Hospital System Command Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#eef6f0] via-[#f4f9f5] to-[#fcfdfc] p-6 border border-[#d6e5da] shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_top_right,rgba(5,150,105,0.08),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center shadow-md">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#142019] tracking-tight">
                  Hospital Operations Master Console
                </h1>
                <Badge variant="emerald" size="sm">
                  {overview.facilityName}
                </Badge>
              </div>
              <p className="text-xs text-[#627267] mt-1">
                Executive Administration: {overview.administratorName} • {overview.activeStaffCount} Credentialed Personnel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#dce8df] shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
            <span className="text-xs font-mono text-[#28382e] font-semibold">Living Ecosystem State: {overview.ecosystemStability}</span>
          </div>
        </div>
      </div>

      {/* 4 Cards: Total Calls, Patients Handled, Department Performance, AI Accuracy Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Calls */}
        <Card className="bg-white border-[#e2e8df] p-4 hover:border-[#1b4332]/40 transition-all shadow-sm">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#e8f3ec] text-[#1b4332] flex items-center justify-center">
              <PhoneCall className="h-4 w-4" />
            </div>
            <Badge variant="teal" size="sm">VOICE FLOW</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-[#627267] uppercase tracking-wider font-semibold">
              Total Calls Processed
            </p>
            <p className="text-xl font-bold font-mono text-[#142019] mt-1">
              {overview.totalCalls.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#627267] mt-0.5">Automated clinical extraction</p>
          </div>
        </Card>

        {/* Card 2: Patients Handled */}
        <Card className="bg-white border-[#e2e8df] p-4 hover:border-[#1b4332]/40 transition-all shadow-sm">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#e8f3ec] text-[#1b4332] flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <Badge variant="emerald" size="sm">PATIENTS</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-[#627267] uppercase tracking-wider font-semibold">
              Patients Handled
            </p>
            <p className="text-xl font-bold font-mono text-[#142019] mt-1">
              {overview.patientsHandled.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#627267] mt-0.5">Across all 5 clinical hubs</p>
          </div>
        </Card>

        {/* Card 3: Department Performance */}
        <Card className="bg-white border-[#e2e8df] p-4 hover:border-[#1b4332]/40 transition-all shadow-sm">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
            <Badge variant="amber" size="sm">EFFICIENCY</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-[#627267] uppercase tracking-wider font-semibold">
              Department Performance
            </p>
            <p className="text-xl font-bold font-mono text-[#059669] mt-1">
              {overview.overallDepartmentEfficiency}%
            </p>
            <p className="text-[11px] text-[#627267] mt-0.5">Commitment SLA turnaround</p>
          </div>
        </Card>

        {/* Card 4: AI Accuracy Metrics */}
        <Card className="bg-white border-[#e2e8df] p-4 hover:border-[#1b4332]/40 transition-all shadow-sm">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#ccfbf1] text-[#0d9488] flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <Badge variant="teal" size="sm">CALIBRATED</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-[#627267] uppercase tracking-wider font-semibold">
              AI Accuracy Metrics
            </p>
            <p className="text-xl font-bold font-mono text-[#0d9488] mt-1">
              {overview.aiAccuracyMetric}%
            </p>
            <p className="text-[11px] text-[#627267] mt-0.5">Autonomous intent validation</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
