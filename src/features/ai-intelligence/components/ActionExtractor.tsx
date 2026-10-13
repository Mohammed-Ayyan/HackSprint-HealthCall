import React from "react";
import { CheckSquare, ArrowRight, UserPlus, Calendar, Clock, Quote } from "lucide-react";
import { ActionExtraction } from "@/shared/types/call";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { getDepartmentColorClass } from "@/shared/utils/formatters";
import { PriorityBadge } from "./PriorityBadge";

export interface ActionExtractorProps {
  actions: ActionExtraction[];
  onSelectAction?: (action: ActionExtraction) => void;
  className?: string;
}

export function ActionExtractor({
  actions,
  onSelectAction,
  className,
}: ActionExtractorProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Autonomous Action Extraction</CardTitle>
            <p className="text-[11px] text-slate-400">
              Dispatched operational tasks extracted directly from patient conversation
            </p>
          </div>
        </div>
        <Badge variant="cyan" size="sm">
          {actions.length} Tasks Generated
        </Badge>
      </CardHeader>

      <div className="mt-4 space-y-3">
        {actions.map((act) => (
          <div
            key={act.id}
            onClick={() => onSelectAction && onSelectAction(act)}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-200 space-y-3 group cursor-pointer"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getDepartmentColorClass(act.department)}`}>
                  {act.department}
                </span>
                <PriorityBadge priority={act.priority} size="sm" />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>Due: {act.deadline}</span>
              </div>
            </div>

            {/* Task title */}
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {act.task}
              </h4>
              {act.suggestedAssignee && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <UserPlus className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Assignee: <strong className="text-slate-300">{act.suggestedAssignee}</strong></span>
                </p>
              )}
            </div>

            {/* Evidence quote */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
              <Quote className="h-3.5 w-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="italic text-slate-400">
                &ldquo;{act.evidenceQuote}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
