"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PhoneCall,
  KanbanSquare,
  BarChart3,
  Users,
  Bell,
  Settings,
  Sparkles,
  Activity,
  Layers,
  Flame,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Badge } from "@/shared/components/ui/Badge";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Call Intelligence", href: "/calls", icon: PhoneCall, count: 6 },
  { label: "Actions & Kanban", href: "/actions", icon: KanbanSquare, count: 9 },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Staff & Users", href: "/users", icon: Users },
  { label: "Notifications", href: "/notifications", icon: Bell, alert: true },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 flex-shrink-0 bg-[#090d16]/95 border-r border-slate-800/80 flex flex-col justify-between p-4 backdrop-blur-2xl z-30 select-none",
        className
      )}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-300">
            <Activity className="h-5 w-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-mono">
                CareOps
              </span>
              <span className="text-xs px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Healthcare Operations Intelligence
            </p>
          </div>
        </Link>

        {/* Live Call Pill Indicator */}
        <Link
          href="/calls/call-live-001"
          className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all group"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <div className="text-left">
              <p className="text-[11px] font-semibold text-cyan-200 group-hover:text-cyan-100 flex items-center gap-1">
                Live Active Call
                <Sparkles className="h-3 w-3 text-cyan-400 inline" />
              </p>
              <p className="text-[10px] text-slate-400">Rahul Sharma (03:24)</p>
            </div>
          </div>
          <Badge variant="cyan" size="sm">
            Triage
          </Badge>
        </Link>

        {/* Navigation List */}
        <nav className="space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Operations Console
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px] font-mono",
                      isActive ? "bg-cyan-500/20 text-cyan-200" : "bg-slate-800 text-slate-400"
                    )}
                  >
                    {item.count}
                  </span>
                )}

                {item.alert && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Info */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        <Link
          href="/landing"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 text-xs text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-400" />
            <span>Product Showcase</span>
          </div>
          <span className="text-[10px] text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">
            Demo
          </span>
        </Link>

        {/* Engine status indicator */}
        <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px]">AI Pipeline</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Active
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono truncate">
            Whisper-v3 + Claude-Opus
          </p>
        </div>
      </div>
    </aside>
  );
}
