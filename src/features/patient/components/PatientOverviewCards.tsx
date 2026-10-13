"use client";

import React from "react";
import { Calendar, ShieldCheck, Clock, HeartPulse, User, ArrowUpRight } from "lucide-react";
import { PatientOverviewData, PatientAppointment } from "../types";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface PatientOverviewCardsProps {
  overview: PatientOverviewData;
  nextAppointment?: PatientAppointment;
}

export function PatientOverviewCards({ overview, nextAppointment }: PatientOverviewCardsProps) {
  return (
    <div className="space-y-6">
      {/* Patient Greeting Banner - Solarpunk Living Ecosystem Style */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c1c15] via-[#0e221a] to-[#07130e] p-6 border border-[#1e3b2f] shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.12),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#142e23] border border-[#2d5a47] flex items-center justify-center text-[#34d399] shadow-inner">
              <User className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
                  Welcome back, {overview.patientName}
                </h1>
                <Badge variant="teal" size="sm" className="font-mono">
                  {overview.mrn}
                </Badge>
              </div>
              <p className="text-sm text-stone-400 mt-1 flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-[#34d399]" />
                Primary Care: <span className="text-stone-300 font-medium">{overview.assignedPCP}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-[#08140f]/80 px-4 py-2.5 rounded-xl border border-[#1b382c]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34d399]"></span>
            </span>
            <span className="text-xs text-stone-300 font-medium">CareOps Telephony Sync Active</span>
          </div>
        </div>
      </div>

      {/* 3 Core Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Upcoming Appointment */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-5 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#132820] border border-[#254d3c] flex items-center justify-center text-[#34d399]">
              <Calendar className="h-5 w-5" />
            </div>
            <Badge variant={nextAppointment?.status === "confirmed" ? "green" : "amber"}>
              {nextAppointment?.status ? nextAppointment.status.toUpperCase() : "SCHEDULED"}
            </Badge>
          </div>
          
          <div className="mt-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Upcoming Appointment
            </p>
            {nextAppointment ? (
              <div className="mt-2">
                <p className="text-lg font-bold text-stone-100">{nextAppointment.doctorName}</p>
                <p className="text-xs text-stone-400">{nextAppointment.doctorSpecialty}</p>
                <div className="mt-3 flex items-center gap-4 text-xs font-mono text-[#34d399] bg-[#07130e] px-3 py-2 rounded-lg border border-[#1b382c]">
                  <span>{nextAppointment.date}</span>
                  <span>•</span>
                  <span>{nextAppointment.time}</span>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-sm text-stone-300">Dr. Rahul</p>
                <p className="text-xs text-stone-400">Post-Op Wound Check</p>
                <div className="mt-3 flex items-center gap-4 text-xs font-mono text-[#34d399] bg-[#07130e] px-3 py-2 rounded-lg border border-[#1b382c]">
                  <span>15 October</span>
                  <span>•</span>
                  <span>10:30 AM</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Card 2: Insurance Status */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-5 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#18231a] border border-[#3b4b2e] flex items-center justify-center text-[#f59e0b]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <Badge variant="amber">VERIFYING</Badge>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Insurance Status
            </p>
            <p className="text-lg font-bold text-stone-100 mt-2">{overview.insuranceStatus}</p>
            <p className="text-xs text-stone-400 mt-1">{overview.insuranceProvider}</p>
            
            <div className="mt-3 text-xs text-amber-300/90 bg-[#161a0f] px-3 py-2 rounded-lg border border-[#36421c] flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Prior-auth documents in review by hospital team</span>
            </div>
          </div>
        </Card>

        {/* Card 3: Pending Actions */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-5 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#112423] border border-[#234c49] flex items-center justify-center text-[#2dd4bf]">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-bold text-[#2dd4bf] bg-[#0c2422] px-2.5 py-1 rounded-full border border-[#1b4e49]">
              {overview.pendingRequestsCount} ACTIVE
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Pending Actions
            </p>
            <p className="text-lg font-bold text-stone-100 mt-2">
              {overview.pendingRequestsCount} Workflows In Progress
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Generated from CareOps voice telephony triage
            </p>
            
            <div className="mt-3 text-xs text-[#2dd4bf] bg-[#0a1b18] px-3 py-2 rounded-lg border border-[#1b433e] flex items-center justify-between">
              <span>View open inquiries</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
