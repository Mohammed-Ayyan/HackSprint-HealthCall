import React from "react";
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, FileText } from "lucide-react";
import { AISummary } from "@/shared/types/call";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface AISummaryCardProps {
  summary: AISummary;
  className?: string;
}

export function AISummaryCard({ summary, className }: AISummaryCardProps) {
  return (
    <Card variant="purple" className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>AI Conversation Summary & Key Points</CardTitle>
            <p className="text-[11px] text-slate-400">
              Clinical Natural Language Understanding Model • Confidence: {(summary.confidenceScore * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        <Badge variant="purple" size="sm">
          Validated NLU
        </Badge>
      </CardHeader>

      <div className="mt-4 space-y-4 text-xs">
        {/* Overview narrative */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 leading-relaxed text-slate-200">
          <p className="font-semibold text-purple-300 text-[11px] uppercase tracking-wider mb-1">
            Clinical Overview
          </p>
          <p className="text-slate-300">{summary.overview}</p>
        </div>

        {/* Structured Key Points */}
        <div className="space-y-2">
          <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            Structured Extraction Points
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {summary.keyPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-300 leading-normal"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Flags & Insurance Status */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium text-[11px]">Clinical Flags:</span>
            {summary.clinicalFlags.length > 0 ? (
              summary.clinicalFlags.map((flag, i) => (
                <Badge key={i} variant="rose" size="sm" dot>
                  {flag}
                </Badge>
              ))
            ) : (
              <span className="text-slate-500 italic">None detected</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium text-[11px]">Insurance:</span>
            {summary.insurancePending ? (
              <Badge variant="amber" size="sm">
                Pre-Auth Pending Review
              </Badge>
            ) : (
              <Badge variant="emerald" size="sm">
                Verified Cleared
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
