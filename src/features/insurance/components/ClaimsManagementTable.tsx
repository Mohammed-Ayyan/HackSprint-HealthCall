"use client";

import React from "react";
import { FileText, ShieldAlert, Clock, ArrowRight, CheckCircle2, XCircle, Search } from "lucide-react";
import { InsuranceClaim } from "../types";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export interface ClaimsManagementTableProps {
  claims: InsuranceClaim[];
  selectedClaimId: string;
  onSelectClaim: (claim: InsuranceClaim) => void;
}

export function ClaimsManagementTable({
  claims,
  selectedClaimId,
  onSelectClaim,
}: ClaimsManagementTableProps) {
  const getStatusBadge = (status: InsuranceClaim["status"]) => {
    switch (status) {
      case "Approved":
        return <Badge variant="green">APPROVED</Badge>;
      case "Pending Review":
        return <Badge variant="amber">PENDING REVIEW</Badge>;
      case "Under Carrier Audit":
        return <Badge variant="teal">CARRIER AUDIT</Badge>;
      case "Rejected":
        return <Badge variant="red">REJECTED</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: InsuranceClaim["priority"]) => {
    switch (priority) {
      case "Urgent":
        return <Badge variant="red" size="sm">URGENT</Badge>;
      case "High":
        return <Badge variant="amber" size="sm">HIGH</Badge>;
      case "Medium":
        return <Badge variant="teal" size="sm">MEDIUM</Badge>;
      default:
        return <Badge variant="gray" size="sm">ROUTINE</Badge>;
    }
  };

  return (
    <Card className="bg-[#0b1712] border-[#1b362a]">
      <CardHeader className="border-b border-[#1b362a] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base text-stone-100">Claims & Prior-Auth Ledger</CardTitle>
              <p className="text-xs text-stone-400 mt-0.5">
                Select a case to inspect CareOps voice extracts and audit timelines
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#34d399] bg-[#0c2018] px-3 py-1 rounded-full border border-[#1b3b2c]">
            {claims.length} Records
          </span>
        </div>
      </CardHeader>

      <div className="divide-y divide-[#162e24]">
        {claims.map((claim) => {
          const isSelected = claim.id === selectedClaimId;
          return (
            <div
              key={claim.id}
              onClick={() => onSelectClaim(claim)}
              className={`p-5 transition-colors cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isSelected
                  ? "bg-[#11291f]/70 border-l-4 border-l-[#34d399]"
                  : "hover:bg-[#0e2019]/60"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#132c21] border border-[#23533c] flex items-center justify-center text-[#34d399] flex-shrink-0 mt-0.5">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-stone-100">{claim.patientName}</h4>
                    <span className="text-xs font-mono text-[#34d399] font-semibold">
                      {claim.claimId}
                    </span>
                    <span className="text-xs font-mono text-stone-400">({claim.mrn})</span>
                    {getStatusBadge(claim.status)}
                    {getPriorityBadge(claim.priority)}
                  </div>

                  <p className="text-xs text-stone-300 mt-1">
                    Payer: <span className="text-stone-100 font-semibold">{claim.payerName}</span> • Type:{" "}
                    <span className="text-stone-300">{claim.claimType}</span>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-stone-400 mt-2 font-mono flex-wrap">
                    <span className="text-stone-300 font-semibold">Amount: {claim.amount}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-300/90">
                      <Clock className="h-3 w-3" /> Deadline: {claim.deadline}
                    </span>
                    <span>•</span>
                    <span className="text-stone-400">Stage: {claim.currentStage}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end lg:self-center">
                <Button
                  variant={isSelected ? "primary" : "outline"}
                  size="sm"
                  className={isSelected ? "" : "border-[#204937] text-stone-300"}
                >
                  <span>{isSelected ? "Inspecting" : "Inspect"}</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
