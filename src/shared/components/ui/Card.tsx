import React from "react";
import { cn } from "@/shared/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "purple" | "critical" | "subtle" | "amber";
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
    default: "bg-[#0c1813] border border-[#1b362a] text-slate-100 shadow-[0_4px_16px_rgba(2,8,6,0.4)]",
    elevated:
      "bg-gradient-to-b from-[#11231b] to-[#0d1c15] border border-emerald-500/25 text-slate-100 shadow-[0_10px_28px_-6px_rgba(2,8,6,0.6),0_0_12px_rgba(52,211,153,0.06)]",
    purple:
      "bg-gradient-to-b from-[#14261d] to-[#0e1a14] border border-teal-500/25 text-slate-100 shadow-[0_10px_28px_-6px_rgba(2,8,6,0.6)]",
    amber:
      "bg-gradient-to-b from-[#1d1a10] to-[#13110a] border border-amber-500/25 text-slate-100 shadow-[0_10px_28px_-6px_rgba(2,8,6,0.6)]",
    critical:
      "bg-gradient-to-b from-[#221213] to-[#150a0b] border border-rose-500/30 text-slate-100 shadow-[0_10px_28px_-6px_rgba(2,8,6,0.6)]",
    subtle: "bg-[#09140f] border border-[#152a21] text-slate-200",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5 transition-all duration-200",
        variantStyles[variant],
        glow && "hover:border-emerald-400/40 hover:shadow-[0_12px_32px_-4px_rgba(52,211,153,0.12)]",
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
    <div className={cn("flex items-center justify-between pb-3.5 border-b border-[#183126]", className)} {...props}>
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
    <h3 className={cn("text-sm font-bold tracking-tight text-white", className)} {...props}>
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
