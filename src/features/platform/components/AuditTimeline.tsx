import React from "react";
import { History, Shield, Bot, Server, User, Clock, CheckCircle2 } from "lucide-react";
import { AuditEvent } from "@/shared/types/audit";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { cn } from "@/shared/utils/cn";

export interface AuditTimelineProps {
  events: AuditEvent[];
  className?: string;
}

export function AuditTimeline({ events, className }: AuditTimelineProps) {
  const getActorIcon = (actor: AuditEvent["actor"]) => {
    switch (actor) {
      case "System AI":
        return <Bot className="h-3.5 w-3.5 text-purple-400" />;
      case "CareOps Engine":
        return <Server className="h-3.5 w-3.5 text-cyan-400" />;
      case "Staff User":
      case "Manager":
        return <User className="h-3.5 w-3.5 text-emerald-400" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <History className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Autonomous Audit & Compliance Timeline</CardTitle>
            <p className="text-[11px] text-slate-400">
              Immutable end-to-end ledger tracing each lifecycle event from call ring to resolution
            </p>
          </div>
        </div>
        <Badge variant="cyan" size="sm">
          Cryptographically Verified
        </Badge>
      </CardHeader>

      <div className="mt-5 relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500 before:via-purple-500 before:to-emerald-500">
        {events.map((event, index) => (
          <div key={event.id} className="relative group">
            {/* Step node dot */}
            <div className="absolute -left-[27px] top-1 h-5 w-5 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.4)] group-hover:scale-125 transition-transform">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 hover:bg-slate-900 transition-all space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-300">
                    {event.timestamp}
                  </span>
                  <span className="text-xs font-bold text-white">{event.title}</span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800">
                  {getActorIcon(event.actor)}
                  <span>{event.actor}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
