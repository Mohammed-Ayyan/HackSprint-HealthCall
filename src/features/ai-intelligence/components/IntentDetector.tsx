import React from "react";
import {
  Calendar,
  FileCheck,
  AlertTriangle,
  Receipt,
  Pill,
  Siren,
  Target,
} from "lucide-react";
import { CallIntent } from "@/shared/types/call";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { cn } from "@/shared/utils/cn";

export interface IntentDetectorProps {
  detectedIntent: CallIntent;
  secondaryIntents?: string[];
  className?: string;
}

const allIntents: { name: CallIntent; icon: React.ReactNode; desc: string }[] = [
  {
    name: "Appointment Request",
    icon: <Calendar className="h-4 w-4" />,
    desc: "Post-op, specialist, or routine consult scheduling",
  },
  {
    name: "Insurance Query",
    icon: <FileCheck className="h-4 w-4" />,
    desc: "Pre-authorization, claims, or coverage inquiry",
  },
  {
    name: "Complaint",
    icon: <AlertTriangle className="h-4 w-4" />,
    desc: "Service delay, staff feedback, or dispute",
  },
  {
    name: "Billing Issue",
    icon: <Receipt className="h-4 w-4" />,
    desc: "Duplicate debit, invoice balance, or copay question",
  },
  {
    name: "Medicine Refill",
    icon: <Pill className="h-4 w-4" />,
    desc: "Prescription renewal, pharmacy transfer, or dosage",
  },
  {
    name: "Emergency Concern",
    icon: <Siren className="h-4 w-4" />,
    desc: "Acute clinical symptom, 911 EMS dispatch, ER triage",
  },
];

export function IntentDetector({
  detectedIntent,
  secondaryIntents = [],
  className,
}: IntentDetectorProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Clinical Intent Classification</CardTitle>
            <p className="text-[11px] text-slate-400">
              Multi-label intent classifier mapping to hospital departmental routing
            </p>
          </div>
        </div>
      </CardHeader>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {allIntents.map((item) => {
          const isPrimary = item.name === detectedIntent;
          const isSecondary = secondaryIntents.includes(item.name);

          return (
            <div
              key={item.name}
              className={cn(
                "p-3 rounded-xl border transition-all duration-200 relative overflow-hidden",
                isPrimary
                  ? "bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30"
                  : isSecondary
                  ? "bg-purple-950/30 border-purple-500/40 text-purple-200"
                  : "bg-slate-900/40 border-slate-800/60 opacity-60 hover:opacity-90"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={cn(
                    "p-1.5 rounded-lg",
                    isPrimary
                      ? "bg-cyan-500/20 text-cyan-300"
                      : isSecondary
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-slate-800 text-slate-400"
                  )}
                >
                  {item.icon}
                </div>

                {isPrimary && (
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    Primary Intent (98%)
                  </span>
                )}
                {isSecondary && (
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                    Secondary (84%)
                  </span>
                )}
              </div>

              <h4
                className={cn(
                  "text-xs font-bold",
                  isPrimary ? "text-white" : isSecondary ? "text-purple-200" : "text-slate-300"
                )}
              >
                {item.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
