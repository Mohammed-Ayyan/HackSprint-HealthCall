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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1d17] via-[#0f241c] to-[#081510] p-6 border border-[#1e3c2f] shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.12),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#142e23] border border-[#2d5a47] flex items-center justify-center text-[#34d399] shadow-inner">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
                  Hospital Operations Master Console
                </h1>
                <Badge variant="green" size="sm">
                  {overview.facilityName}
                </Badge>
              </div>
              <p className="text-sm text-stone-400 mt-1">
                Executive Administration: {overview.administratorName} • {overview.activeStaffCount} Credentialed Personnel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#08140f] px-3.5 py-2 rounded-xl border border-[#1a382c]">
            <span className="h-2 w-2 rounded-full bg-[#34d399] animate-pulse" />
            <span className="text-xs font-mono text-stone-300">Living Ecosystem State: {overview.ecosystemStability}</span>
          </div>
        </div>
      </div>

      {/* 4 Cards: Total Calls, Patients Handled, Department Performance, AI Accuracy Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Calls */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#11241b] border border-[#234d3c] flex items-center justify-center text-[#34d399]">
              <PhoneCall className="h-4 w-4" />
            </div>
            <Badge variant="teal" size="sm">VOICE FLOW</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Total Calls Processed
            </p>
            <p className="text-xl font-bold font-mono text-stone-100 mt-1">
              {overview.totalCalls.toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">Automated clinical extraction</p>
          </div>
        </Card>

        {/* Card 2: Patients Handled */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#132820] border border-[#254d3c] flex items-center justify-center text-[#34d399]">
              <Users className="h-4 w-4" />
            </div>
            <Badge variant="green" size="sm">PATIENTS</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Patients Handled
            </p>
            <p className="text-xl font-bold font-mono text-stone-100 mt-1">
              {overview.patientsHandled.toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">Across all 5 clinical hubs</p>
          </div>
        </Card>

        {/* Card 3: Department Performance */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#18231a] border border-[#3b4b2e] flex items-center justify-center text-[#f59e0b]">
              <Activity className="h-4 w-4" />
            </div>
            <Badge variant="amber" size="sm">EFFICIENCY</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Department Performance
            </p>
            <p className="text-xl font-bold font-mono text-[#34d399] mt-1">
              {overview.overallDepartmentEfficiency}%
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">Commitment SLA turnaround</p>
          </div>
        </Card>

        {/* Card 4: AI Accuracy Metrics */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#142e23] border border-[#2b5946] flex items-center justify-center text-[#34d399]">
              <Sparkles className="h-4 w-4" />
            </div>
            <Badge variant="teal" size="sm">CALIBRATED</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              AI Accuracy Metrics
            </p>
            <p className="text-xl font-bold font-mono text-[#34d399] mt-1">
              {overview.aiAccuracyMetric}%
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">Autonomous intent validation</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
