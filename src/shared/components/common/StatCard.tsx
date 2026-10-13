import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Card } from "@/shared/components/ui/Card";

export interface StatCardProps {
  title: string;
  value: string | number;
  changePercent?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "cyan" | "purple" | "rose" | "emerald" | "amber" | "default";
  className?: string;
}

export function StatCard({
  title,
  value,
  changePercent,
  subtitle,
  icon,
  variant = "cyan",
  className,
}: StatCardProps) {
  const isPositive = changePercent !== undefined && changePercent > 0;
  const isNegative = changePercent !== undefined && changePercent < 0;

  const glowStyles = {
    cyan: "border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_15px_35px_-10px_rgba(6,182,212,0.2)]",
    purple: "border-purple-500/20 hover:border-purple-500/40 hover:shadow-[0_15px_35px_-10px_rgba(139,92,246,0.2)]",
    rose: "border-rose-500/20 hover:border-rose-500/40 hover:shadow-[0_15px_35px_-10px_rgba(239,68,68,0.2)]",
    amber: "border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_15px_35px_-10px_rgba(245,158,11,0.2)]",
    emerald: "border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_15px_35px_-10px_rgba(16,185,129,0.2)]",
    default: "border-slate-800 hover:border-slate-700",
  };

  const iconBgStyles = {
    cyan: "bg-cyan-950/60 text-cyan-400 border border-cyan-500/30",
    purple: "bg-purple-950/60 text-purple-400 border border-purple-500/30",
    rose: "bg-rose-950/60 text-rose-400 border border-rose-500/30",
    amber: "bg-amber-950/60 text-amber-400 border border-amber-500/30",
    emerald: "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30",
    default: "bg-slate-800 text-slate-300 border border-slate-700",
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 group cursor-default",
        glowStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-white font-mono">{value}</h3>
          </div>
        </div>

        {icon && (
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
              iconBgStyles[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {changePercent !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold font-mono px-1.5 py-0.5 rounded",
              isPositive && "bg-emerald-500/10 text-emerald-400",
              isNegative && "bg-rose-500/10 text-rose-400",
              !isPositive && !isNegative && "bg-slate-800 text-slate-400"
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
            {Math.abs(changePercent)}%
          </span>
        )}
        <span className="text-slate-400">{subtitle || "vs last 24h"}</span>
      </div>

      {/* Subtle bottom gradient line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity",
          variant === "cyan" && "bg-gradient-to-r from-transparent via-cyan-500 to-transparent",
          variant === "purple" && "bg-gradient-to-r from-transparent via-purple-500 to-transparent",
          variant === "rose" && "bg-gradient-to-r from-transparent via-rose-500 to-transparent",
          variant === "emerald" && "bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
        )}
      />
    </Card>
  );
}
