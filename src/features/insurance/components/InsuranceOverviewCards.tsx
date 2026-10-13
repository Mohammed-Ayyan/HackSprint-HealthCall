"use client";

import React from "react";
import { ShieldCheck, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { InsuranceOverviewData } from "../types";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface InsuranceOverviewCardsProps {
  overview: InsuranceOverviewData;
}

export function InsuranceOverviewCards({ overview }: InsuranceOverviewCardsProps) {
  return (
    <div className="space-y-6">
      {/* Insurance Division Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1d17] via-[#0f241c] to-[#081510] p-6 border border-[#1e3c2f] shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.12),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#142e23] border border-[#2d5a47] flex items-center justify-center text-[#34d399] shadow-inner">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
                  Insurance & RCM Desk • {overview.employeeName}
                </h1>
                <Badge variant="teal" size="sm">
                  {overview.department}
                </Badge>
              </div>
              <p className="text-sm text-stone-400 mt-1">
                Prior-Auth Clearance, Claim Ingestion & Payer Dispute Resolution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#08140f] px-3.5 py-2 rounded-xl border border-[#1a382c]">
            <span className="h-2 w-2 rounded-full bg-[#34d399] animate-pulse" />
            <span className="text-xs font-mono text-stone-300">Payer EDI Gateway 837/835 Connected</span>
          </div>
        </div>
      </div>

      {/* 4 Cards: Pending claims, Approved claims, Rejected claims, Urgent cases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Claims */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#18231a] border border-[#3b4b2e] flex items-center justify-center text-[#f59e0b]">
              <Clock className="h-4 w-4" />
            </div>
            <Badge variant="amber" size="sm">IN QUEUE</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Pending Claims
            </p>
            <p className="text-xl font-bold text-stone-100 mt-1">{overview.pendingClaimsCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Awaiting carrier response</p>
          </div>
        </Card>

        {/* Card 2: Approved Claims */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#132820] border border-[#254d3c] flex items-center justify-center text-[#34d399]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <Badge variant="green" size="sm">APPROVED</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Approved Claims
            </p>
            <p className="text-xl font-bold text-stone-100 mt-1">{overview.approvedClaimsCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Cleared for hospital reimbursement</p>
          </div>
        </Card>

        {/* Card 3: Rejected Claims */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#201515] border border-[#432323] flex items-center justify-center text-[#f87171]">
              <XCircle className="h-4 w-4" />
            </div>
            <Badge variant="red" size="sm">DENIED</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Rejected Claims
            </p>
            <p className="text-xl font-bold text-[#f87171] mt-1">{overview.rejectedClaimsCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Appeal packets in draft</p>
          </div>
        </Card>

        {/* Card 4: Urgent Cases */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#231515] border border-[#4d2525] flex items-center justify-center text-[#f87171]">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <Badge variant="red" size="sm">CRITICAL</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Urgent Cases
            </p>
            <p className="text-xl font-bold text-[#f87171] mt-1">{overview.urgentCasesCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Flagged by patient telephony delay</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
