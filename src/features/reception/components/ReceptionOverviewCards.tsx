"use client";

import React from "react";
import { UserCheck, Clock, CheckCircle2, XCircle, PhoneForwarded } from "lucide-react";
import { ReceptionOverviewData } from "../types";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface ReceptionOverviewCardsProps {
  overview: ReceptionOverviewData;
}

export function ReceptionOverviewCards({ overview }: ReceptionOverviewCardsProps) {
  return (
    <div className="space-y-6">
      {/* Front Desk Header - Solarpunk Aesthetic */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1d17] via-[#0f241c] to-[#081510] p-6 border border-[#1e3c2f] shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.12),transparent_70%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#142e23] border border-[#2d5a47] flex items-center justify-center text-[#34d399] shadow-inner">
              <UserCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
                  Front Desk Hub • {overview.receptionistName}
                </h1>
                <Badge variant="teal" size="sm">
                  {overview.frontDeskStation}
                </Badge>
              </div>
              <p className="text-sm text-stone-400 mt-1">
                Ecosystem Patient Ingestion & Telephony Dispatch Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#08140f] px-3.5 py-2 rounded-xl border border-[#1a382c]">
            <span className="h-2 w-2 rounded-full bg-[#34d399] animate-pulse" />
            <span className="text-xs font-mono text-stone-300">CareOps Voice Gateway Active</span>
          </div>
        </div>
      </div>

      {/* 4 Cards: Pending Bookings, Confirmed, Cancelled, Open Call Tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#18231a] border border-[#3b4b2e] flex items-center justify-center text-[#f59e0b]">
              <Clock className="h-4 w-4" />
            </div>
            <Badge variant="amber" size="sm">PENDING</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Pending Bookings
            </p>
            <p className="text-xl font-bold text-stone-100 mt-1">{overview.pendingBookingsCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Awaiting staff confirmation</p>
          </div>
        </Card>

        {/* Card 2: Confirmed */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#132820] border border-[#254d3c] flex items-center justify-center text-[#34d399]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <Badge variant="green" size="sm">CONFIRMED</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Confirmed Today
            </p>
            <p className="text-xl font-bold text-stone-100 mt-1">{overview.confirmedAppointmentsCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Ready for arrival check-in</p>
          </div>
        </Card>

        {/* Card 3: Cancelled */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#201515] border border-[#432323] flex items-center justify-center text-[#f87171]">
              <XCircle className="h-4 w-4" />
            </div>
            <Badge variant="red" size="sm">CANCELLED</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              Cancelled Requests
            </p>
            <p className="text-xl font-bold text-stone-100 mt-1">{overview.cancelledRequestsCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Slots freed for triage</p>
          </div>
        </Card>

        {/* Card 4: Open Call Tasks */}
        <Card className="bg-[#0b1712] border-[#1b362a] p-4 hover:border-[#2d5845] transition-all">
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-lg bg-[#112423] border border-[#234c49] flex items-center justify-center text-[#2dd4bf]">
              <PhoneForwarded className="h-4 w-4" />
            </div>
            <Badge variant="teal" size="sm">AI TASKS</Badge>
          </div>
          <div className="mt-3">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              AI Call Actions
            </p>
            <p className="text-xl font-bold text-stone-100 mt-1">{overview.openCallTasksCount}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Tasks from call analyzer</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
