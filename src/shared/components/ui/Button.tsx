import React from "react";
import { cn } from "@/shared/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "purple" | "solar";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  loading = false,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary:
      "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-[0_2px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_16px_rgba(16,185,129,0.35)] active:scale-[0.98]",
    solar:
      "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-[0_2px_12px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_16px_rgba(245,158,11,0.35)] active:scale-[0.98]",
    purple:
      "bg-[#1e2f26] hover:bg-[#253a30] text-emerald-300 border border-emerald-500/30 active:scale-[0.98]",
    secondary:
      "bg-[#13221b] hover:bg-[#1a2d24] text-slate-200 border border-[#223d30] shadow-sm active:scale-[0.98]",
    outline:
      "bg-transparent hover:bg-[#13221b] text-slate-300 border border-[#244234] hover:border-emerald-500/40 active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-[#13221b] text-slate-300 hover:text-white active:scale-[0.98]",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_2px_10px_rgba(225,29,72,0.25)] active:scale-[0.98]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5 font-medium",
    md: "px-4 py-2 text-xs rounded-xl gap-2 font-semibold",
    lg: "px-5 py-2.5 text-sm rounded-xl gap-2.5 font-bold",
    icon: "h-8 w-8 rounded-lg p-0 flex items-center justify-center",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin mr-1.5" />
      ) : null}
      {children}
    </button>
  );
}
