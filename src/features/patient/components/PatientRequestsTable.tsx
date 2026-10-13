"use client";

import React from "react";
import { FileText, ShieldAlert, Pill, Clock, ArrowRight, Activity, CheckCircle2 } from "lucide-react";
import { PatientRequest } from "../types";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface PatientRequestsTableProps {
  requests: PatientRequest[];
}

export function PatientRequestsTable({ requests }: PatientRequestsTableProps) {
  const getStatusBadge = (status: PatientRequest["status"]) => {
    switch (status) {
      case "In Progress":
        return <Badge variant="teal">IN PROGRESS</Badge>;
      case "Under Review":
        return <Badge variant="amber">UNDER REVIEW</Badge>;
      case "Action Required":
        return <Badge variant="red">ACTION REQUIRED</Badge>;
      case "Resolved":
        return <Badge variant="green">RESOLVED</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: PatientRequest["category"]) => {
    switch (category) {
      case "Insurance":
        return <ShieldAlert className="h-4 w-4 text-[#f59e0b]" />;
      case "Prescription":
        return <Pill className="h-4 w-4 text-[#2dd4bf]" />;
      default:
        return <FileText className="h-4 w-4 text-[#34d399]" />;
    }
  };

  return (
    <Card className="bg-[#0b1712] border-[#1b362a]">
      <CardHeader className="border-b border-[#1b362a] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#12261e] border border-[#234d3c] flex items-center justify-center text-[#34d399]">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base text-stone-100">Patient Requests & Commitments</CardTitle>
              <p className="text-xs text-stone-400 mt-0.5">
                Automatically generated and assigned from recent patient telephony calls
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#34d399] bg-[#0c2018] px-3 py-1 rounded-full border border-[#1b3b2c]">
            {requests.length} Active Tracks
          </span>
        </div>
      </CardHeader>

      <div className="divide-y divide-[#162e24]">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-5 hover:bg-[#0e2019]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 h-8 w-8 rounded-lg bg-[#11231b] border border-[#1f4233] flex items-center justify-center">
                {getCategoryIcon(req.category)}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-sm font-semibold text-stone-200">{req.title}</h4>
                  {getStatusBadge(req.status)}
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Department: <span className="text-stone-300 font-medium">{req.department}</span> • Created:{" "}
                  <span className="font-mono text-stone-300">{req.createdDate}</span>
                </p>
                <div className="mt-2 text-xs bg-[#07130e] text-stone-300 p-2.5 rounded-lg border border-[#173326] max-w-2xl">
                  <span className="text-[#34d399] font-medium">Latest Hospital Action:</span>{" "}
                  {req.lastUpdateNotes}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-end justify-between pl-11 md:pl-0">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300/90 bg-[#161d10] px-3 py-1.5 rounded-lg border border-[#303f19]">
                <Clock className="h-3.5 w-3.5" />
                <span>Est: {req.estimatedResolution}</span>
              </div>
              <span className="text-[11px] font-mono text-stone-500 mt-2">
                ID: {req.id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
