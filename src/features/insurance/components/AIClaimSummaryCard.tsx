"use client";

import React from "react";
import { Bot, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { InsuranceClaim } from "../types";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export interface AIClaimSummaryCardProps {
  claim: InsuranceClaim;
  onVerifyStatus?: (claimId: string) => void;
}

export function AIClaimSummaryCard({ claim, onVerifyStatus }: AIClaimSummaryCardProps) {
  return (
    <Card className="bg-[#0b1712] border-[#1b362a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.1),transparent_70%)] pointer-events-none" />

      <CardHeader className="border-b border-[#1b362a] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#142e23] border border-[#275440] flex items-center justify-center text-[#34d399]">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base text-stone-100">CareOps AI Claim Intelligence</CardTitle>
              <p className="text-xs text-stone-400 mt-0.5">
                Targeting: {claim.patientName} • Claim ID:{" "}
                <span className="font-mono text-[#34d399]">{claim.claimId}</span>
              </p>
            </div>
          </div>
          <Badge variant="teal">Speech-to-Claim Sync</Badge>
        </div>
      </CardHeader>

      <div className="p-5 space-y-5">
        {/* Patient Conversation Summary */}
        <div className="bg-[#081510] p-4 rounded-xl border border-[#183327]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#34d399] uppercase tracking-wider mb-2">
            <Bot className="h-4 w-4" />
            <span>Patient Conversation Summary</span>
          </div>
          <blockquote className="text-sm font-medium text-stone-200 italic leading-relaxed border-l-2 border-[#34d399] pl-3 py-0.5">
            "{claim.aiConversationSummary}"
          </blockquote>
          <p className="text-[11px] text-stone-400 mt-2 font-mono">
            Carrier: <span className="text-stone-300 font-semibold">{claim.payerName}</span> • Amount:{" "}
            <span className="text-[#34d399] font-bold">{claim.amount}</span>
          </p>
        </div>

        {/* Required Action */}
        <div className="bg-[#0e2118] p-4 rounded-xl border border-[#204938] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2dd4bf] uppercase tracking-wider mb-1">
              <AlertCircle className="h-4 w-4" />
              <span>Required Operational Action</span>
            </div>
            <p className="text-xs text-stone-200 font-medium">
              {claim.requiredAction}
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (onVerifyStatus) onVerifyStatus(claim.id);
            }}
            className="flex items-center gap-1.5 flex-shrink-0"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Verify Claim Status</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
