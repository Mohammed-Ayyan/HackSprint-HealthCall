import React from "react";
import { Link2, Sparkles, Quote, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface EvidencePair {
  action: string;
  department: string;
  evidence: string;
  timestamp: string;
}

export interface EvidenceViewerProps {
  evidencePairs: EvidencePair[];
  className?: string;
}

export function EvidenceViewer({ evidencePairs, className }: EvidenceViewerProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Link2 className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>AI Explainability & Transcript Evidence View</CardTitle>
            <p className="text-[11px] text-slate-400">
              Deterministic verification showing the exact conversational anchors justifying each action
            </p>
          </div>
        </div>
        <Badge variant="cyan" size="sm">
          100% Grounded
        </Badge>
      </CardHeader>

      <div className="mt-4 space-y-3">
        {evidencePairs.map((pair, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5"
          >
            {/* Extracted Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Dispatched Action #{idx + 1}
                </span>
                <span className="text-xs text-slate-400">• {pair.department}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{pair.timestamp}</span>
            </div>
            <p className="text-xs font-bold text-white">{pair.action}</p>

            {/* Evidence Anchor */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs flex items-start gap-2">
              <Quote className="h-3.5 w-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider block">
                  Ground-Truth Transcript Evidence:
                </span>
                <p className="italic text-slate-300 mt-0.5 leading-relaxed">&ldquo;{pair.evidence}&rdquo;</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
