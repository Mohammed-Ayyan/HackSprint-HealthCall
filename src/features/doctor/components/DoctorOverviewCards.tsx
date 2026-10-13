"use client";

import React from "react";
import { Stethoscope, Calendar, Clock, AlertTriangle, UserCheck, ArrowRight } from "lucide-react";
import { DoctorOverviewData } from "../types";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface DoctorOverviewCardsProps {
  overview: DoctorOverviewData;
}

export function DoctorOverviewCards({ overview }: DoctorOverviewCardsProps) {
  return (
    <div className="space-y-6">
      {/* Clinician Header Banner - Solarpunk Aesthetic */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1d17] via-[#0f241c] to-[#081510] p-6 border border-[#1e3c2f] shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.12),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#142e23] border border-[#2d5a47] flex items-center justify-center text-[#34d399] shadow-inner">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
                  {overview.doctorName}
                </h1>
                <Badge variant="teal" size="sm">
                  {overview.department}
                </Badge>
              </div>
              <p className="text-sm text-stone-400 mt-1">
                {overview.specialty} • Active Clinical Station
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#07130e] px-4 py-2.5 rounded-xl border border-[#183629] text-right">
              <p className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Next Consultation</p>
              <p className="text-base font-mono font-bold text-[#34d399]">{overview.nextPatientTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Operational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Today's Appointments */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-5 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#132820] border border-[#254d3c] flex items-center justify-center text-[#34d399]">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#34d399] bg-[#0c2018] px-2.5 py-1 rounded-full border border-[#1b3b2c]">
              TODAY'S SCHEDULE
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Today's Appointments
            </p>
            <p className="text-2xl font-bold text-stone-100 mt-1">
              {overview.todaysAppointmentsCount} Consultations
            </p>
            <p className="text-xs text-stone-400 mt-1">
              All slots synced with CareOps reception queue
            </p>
          </div>
        </Card>

        {/* Card 2: Pending Follow-ups */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-5 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#18231a] border border-[#3b4b2e] flex items-center justify-center text-[#f59e0b]">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#f59e0b] bg-[#1a1e0f] px-2.5 py-1 rounded-full border border-[#353f19]">
              FOLLOW-UPS
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Pending Follow-ups
            </p>
            <p className="text-2xl font-bold text-stone-100 mt-1">
              {overview.pendingFollowupsCount} Patients
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Requiring chart review, lab evaluation or call backs
            </p>
          </div>
        </Card>

        {/* Card 3: Urgent Cases */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-5 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#231515] border border-[#4d2525] flex items-center justify-center text-[#f87171]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <Badge variant="red">TRIAGE ELEVATED</Badge>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Urgent Cases
            </p>
            <p className="text-2xl font-bold text-[#f87171] mt-1">
              {overview.urgentCasesCount} Flagged Issues
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Flagged by CareOps AI speech sentiment & vitals triage
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
