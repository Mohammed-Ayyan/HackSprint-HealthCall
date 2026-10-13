import React from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-stone-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-stone-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full rounded-xl bg-[#0b1813] border border-[#1b382b] px-3.5 py-2 text-sm text-stone-100 placeholder:text-stone-500",
            "focus:outline-none focus:border-[#34d399] focus:ring-1 focus:ring-[#34d399]/30 transition-all duration-200",
            icon && "pl-9",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#f87171] font-medium">{error}</p>}
    </div>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: { label: string; value: string }[];
  error?: string;
  children?: React.ReactNode;
}

export function Select({
  label,
  options,
  error,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-stone-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "w-full rounded-xl bg-[#0b1813] border border-[#1b382b] px-3.5 py-2 text-sm text-stone-100",
          "focus:outline-none focus:border-[#34d399] focus:ring-1 focus:ring-[#34d399]/30 transition-all duration-200 cursor-pointer",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30",
          className
        )}
        {...props}
      >
        {children
          ? children
          : options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0b1813] text-stone-100">
                {opt.label}
              </option>
            ))}
      </select>
      {error && <p className="text-xs text-[#f87171] font-medium">{error}</p>}
    </div>
  );
}
