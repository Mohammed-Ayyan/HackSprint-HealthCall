import React from "react";
import { cn } from "@/shared/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "purple" | "critical" | "subtle";
  glow?: boolean;
}

export function Card({
  children,
  className,
  variant = "default",
  glow = false,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 text-slate-100",
    elevated:
      "bg-slate-900/80 backdrop-blur-2xl border border-cyan-500/20 text-slate-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.08)]",
    purple:
      "bg-slate-900/80 backdrop-blur-2xl border border-purple-500/25 text-slate-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6),0_0_20px_rgba(139,92,246,0.1)]",
    critical:
      "bg-rose-950/20 backdrop-blur-2xl border border-rose-500/30 text-slate-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6),0_0_20px_rgba(239,68,68,0.12)]",
    subtle: "bg-slate-900/30 backdrop-blur-md border border-slate-800/40 text-slate-200",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-5 transition-all duration-300",
        variantStyles[variant],
        glow && "hover:border-cyan-400/40 hover:shadow-[0_20px_45px_-10px_rgba(6,182,212,0.15)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between pb-4 border-b border-slate-800/60", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold tracking-tight text-white", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-400", className)} {...props}>
      {children}
    </p>
  );
}
