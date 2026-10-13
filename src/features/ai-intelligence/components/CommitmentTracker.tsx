"use client";

import React, { useState } from "react";
import { Handshake, Clock, User, CheckCircle2, AlertCircle, Quote } from "lucide-react";
import { Commitment } from "@/shared/types/call";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { cn } from "@/shared/utils/cn";

export interface CommitmentTrackerProps {
  commitments: Commitment[];
  className?: string;
}

export function CommitmentTracker({ commitments: initial, className }: CommitmentTrackerProps) {
  const [commitments, setCommitments] = useState<Commitment[]>(initial);

  const toggleStatus = (id: string) => {
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === "fulfilled" ? "pending" : "fulfilled",
            }
          : c
      )
    );
  };

  return (
    <Card variant="purple" className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Handshake className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Spoken Commitment & Promise Tracker</CardTitle>
            <p className="text-[11px] text-slate-400">
              Audit trail of operational guarantees verbally delivered to the patient
            </p>
          </div>
        </div>
        <Badge variant="purple" size="sm">
          {commitments.filter((c) => c.status === "fulfilled").length}/{commitments.length} Fulfilled
        </Badge>
      </CardHeader>

      <div className="mt-4 space-y-3">
        {commitments.map((com) => {
          const isFulfilled = com.status === "fulfilled";

          return (
            <div
              key={com.id}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 space-y-2.5",
                isFulfilled
                  ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300"
                  : "bg-slate-900/80 border-slate-800/80 text-slate-100 hover:border-purple-500/40"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <button
                    onClick={() => toggleStatus(com.id)}
                    className={cn(
                      "mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer",
                      isFulfilled
                        ? "bg-emerald-500 border-emerald-400 text-slate-950"
                        : "border-slate-700 bg-slate-950/80 hover:border-purple-400"
                    )}
                  >
                    {isFulfilled && <CheckCircle2 className="h-4 w-4 stroke-[3]" />}
                  </button>

                  <div>
                    <h4
                      className={cn(
                        "text-sm font-semibold transition-all",
                        isFulfilled && "line-through text-slate-400"
                      )}
                    >
                      {com.commitment}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1 text-purple-300">
                        <User className="h-3.5 w-3.5" />
                        Owner: {com.owner}
                      </span>
                      <span className="flex items-center gap-1 text-cyan-300">
                        <Clock className="h-3.5 w-3.5" />
                        Deadline: {com.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant={isFulfilled ? "emerald" : "purple"}
                  size="sm"
                  dot={!isFulfilled}
                >
                  {isFulfilled ? "FULFILLED" : "PENDING COMMITMENT"}
                </Badge>
              </div>

              {/* Exact Spoken Evidence */}
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
                <Quote className="h-3 w-3 text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="italic text-[11px]">&ldquo;{com.evidenceQuote}&rdquo;</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
