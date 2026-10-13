import React from "react";
import Link from "next/link";
import { ShieldAlert, AlertTriangle, ArrowRight, UserCheck } from "lucide-react";
import { ActionItem } from "@/shared/types/action";
import { Button } from "@/shared/components/ui/Button";

export interface EscalationBannerProps {
  escalatedTasks: ActionItem[];
  onAcknowledge?: (taskId: string) => void;
  className?: string;
}

export function EscalationBanner({
  escalatedTasks,
  onAcknowledge,
  className,
}: EscalationBannerProps) {
  if (escalatedTasks.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 bg-gradient-to-r from-rose-950/40 via-red-950/30 to-rose-950/40 border border-rose-500/40 shadow-xl shadow-rose-950/20 backdrop-blur-xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-pulse">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Manager Escalation Watchlist ({escalatedTasks.length})
              </h3>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                Action Required
              </span>
            </div>
            <p className="text-xs text-rose-300/80">
              Tasks overdue or flagged by AI for compliance breach risk.
            </p>
          </div>
        </div>

        <Link href="/actions">
          <Button variant="danger" size="sm" className="gap-1.5 text-xs">
            <span>Review Escalations</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-rose-900/40">
        {escalatedTasks.slice(0, 2).map((t) => (
          <div
            key={t.id}
            className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-800/40 text-xs flex items-center justify-between gap-2"
          >
            <div>
              <p className="font-bold text-white truncate max-w-xs">{t.task}</p>
              <p className="text-[11px] text-rose-300">
                Patient: {t.patientName} • {t.escalationReason || "SLA Window Critical"}
              </p>
            </div>
            <span className="text-[10px] font-mono text-rose-400 font-bold whitespace-nowrap">
              {t.sla.remainingHours.toFixed(1)}h left
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
