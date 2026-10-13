import React from "react";
import { Clock, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";
import { ActionItem } from "@/shared/types/action";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { cn } from "@/shared/utils/cn";

export interface SLATrackerCardProps {
  tasks: ActionItem[];
  className?: string;
}

export function SLATrackerCard({ tasks, className }: SLATrackerCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Operational SLA Tracking Engine</CardTitle>
            <p className="text-[11px] text-slate-400">
              Real-time countdown deadlines and compliance breach monitors
            </p>
          </div>
        </div>
        <Badge variant="cyan" size="sm">
          97.4% Target Compliance
        </Badge>
      </CardHeader>

      <div className="mt-4 space-y-3">
        {tasks.slice(0, 4).map((task) => {
          const isBreached = task.sla.isBreached;
          const isWarning = task.sla.isWarning || task.sla.remainingHours < 2;

          return (
            <div
              key={task.id}
              className={cn(
                "p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors",
                isBreached
                  ? "bg-rose-950/20 border-rose-500/40"
                  : isWarning
                  ? "bg-amber-950/20 border-amber-500/30"
                  : "bg-slate-900/60 border-slate-800/80"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{task.task}</span>
                  <Badge variant="outline" size="sm">
                    {task.department}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400">
                  Patient: {task.patientName} • Deadline: <strong className="text-slate-300">{task.deadline}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <p className="text-[10px] text-slate-500 uppercase">Remaining Time</p>
                  <p
                    className={cn(
                      "text-xs font-bold",
                      isBreached ? "text-rose-400" : isWarning ? "text-amber-400" : "text-cyan-400"
                    )}
                  >
                    {task.sla.remainingHours > 0
                      ? `${task.sla.remainingHours.toFixed(1)} hours remaining`
                      : "SLA Breached"}
                  </p>
                </div>

                <Badge
                  variant={isBreached ? "rose" : isWarning ? "amber" : "emerald"}
                  size="sm"
                  dot={isWarning || isBreached}
                >
                  {isBreached ? "BREACHED" : isWarning ? "WARNING" : "ON TRACK"}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
