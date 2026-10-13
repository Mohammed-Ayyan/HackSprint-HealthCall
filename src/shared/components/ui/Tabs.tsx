"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/shared/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface LegacyTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export interface CompoundTabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
  // Legacy support fields
  tabs?: TabItem[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs(props: CompoundTabsProps) {
  // If used in legacy mode with tabs array:
  if (props.tabs && props.activeTab !== undefined && props.onChange) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 p-1 rounded-xl bg-[#0b1712] border border-[#1b362a]",
          props.className
        )}
      >
        {props.tabs.map((tab) => {
          const isActive = tab.id === props.activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => props.onChange!(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-[#132c21] text-[#34d399] border border-[#24503a]"
                  : "text-stone-400 hover:text-stone-200 hover:bg-[#0e2118] border border-transparent"
              )}
            >
              {tab.icon && <span className="text-current">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    isActive ? "bg-[#1c3f2e] text-[#34d399]" : "bg-[#12241c] text-stone-400"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Compound component mode
  const [internalTab, setInternalTab] = useState(props.defaultValue || "");
  const currentTab = props.value !== undefined ? props.value : internalTab;

  const handleTabChange = (val: string) => {
    if (props.value === undefined) {
      setInternalTab(val);
    }
    props.onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab: currentTab, setActiveTab: handleTabChange }}>
      <div className={cn("w-full", props.className)}>{props.children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-xl bg-[#0b1712] border border-[#1b362a]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const isActive = ctx.activeTab === value;

  return (
    <button
      type="button"
      data-state={isActive ? "active" : "inactive"}
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2",
        isActive
          ? "bg-[#132c21] text-[#34d399] border border-[#23533c] shadow-sm"
          : "text-stone-400 hover:text-stone-200 hover:bg-[#0e2118] border border-transparent",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.activeTab !== value) return null;

  return <div className={cn("animate-in fade-in-50 duration-200", className)}>{children}</div>;
}
