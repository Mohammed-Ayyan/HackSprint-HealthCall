import React from "react";
import { cn } from "@/shared/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "cyan" | "purple" | "rose" | "amber" | "emerald" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  children,
  className,
  variant = "default",
  size = "md",
  dot = false,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800/80 text-slate-300 border-slate-700/60",
    cyan: "bg-cyan-950/60 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
    purple: "bg-purple-950/60 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]",
    rose: "bg-rose-950/60 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(239,68,68,0.15)]",
    amber: "bg-amber-950/60 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    emerald: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    outline: "bg-transparent text-slate-400 border-slate-800",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-all duration-200",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse",
            variant === "cyan" && "bg-cyan-400",
            variant === "purple" && "bg-purple-400",
            variant === "rose" && "bg-rose-400",
            variant === "amber" && "bg-amber-400",
            variant === "emerald" && "bg-emerald-400",
            variant === "default" && "bg-slate-400",
            variant === "outline" && "bg-slate-500"
          )}
        />
      )}
      {children}
    </span>
  );
}
