import React from "react";
import { cn } from "@/shared/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "cyan"
    | "purple"
    | "rose"
    | "amber"
    | "emerald"
    | "outline"
    | "biolum"
    | "teal"
    | "green"
    | "red"
    | "gray";
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
  const variantStyles: Record<string, string> = {
    default: "bg-[#13221b] text-slate-300 border-[#223d30]",
    gray: "bg-[#13221b] text-stone-400 border-[#223d30]",
    biolum: "bg-[#0c2a1e] text-[#34d399] border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.15)]",
    emerald: "bg-[#0c2a1e] text-[#34d399] border-emerald-500/30",
    green: "bg-[#0c2a1e] text-[#34d399] border-emerald-500/30",
    cyan: "bg-[#0b2824] text-[#2dd4bf] border-teal-500/30 shadow-[0_0_10px_rgba(45,212,191,0.12)]",
    teal: "bg-[#0b2824] text-[#2dd4bf] border-teal-500/30 shadow-[0_0_10px_rgba(45,212,191,0.12)]",
    amber: "bg-[#251d0e] text-[#f59e0b] border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.12)]",
    rose: "bg-[#281315] text-[#f87171] border-rose-500/30 shadow-[0_0_10px_rgba(248,113,113,0.12)]",
    red: "bg-[#281315] text-[#f87171] border-rose-500/30 shadow-[0_0_10px_rgba(248,113,113,0.12)]",
    purple: "bg-[#1d162b] text-indigo-300 border-indigo-500/30",
    outline: "bg-transparent text-slate-400 border-[#1e382d]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] font-semibold tracking-wide",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wide",
  };

  const styleKey = variantStyles[variant] ? variant : "default";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border transition-all duration-150",
        variantStyles[styleKey],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            (variant === "cyan" || variant === "teal") && "bg-teal-400 animate-pulse",
            (variant === "biolum" || variant === "emerald" || variant === "green") && "bg-emerald-400 animate-pulse",
            (variant === "rose" || variant === "red") && "bg-rose-400 animate-pulse",
            variant === "amber" && "bg-amber-400 animate-pulse",
            variant === "purple" && "bg-indigo-400",
            (variant === "default" || variant === "gray") && "bg-slate-400",
            variant === "outline" && "bg-slate-500"
          )}
        />
      )}
      {children}
    </span>
  );
}
