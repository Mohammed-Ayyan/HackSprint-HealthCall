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
  HeartPulse,
  Stethoscope,
  UserCheck,
  ShieldCheck,
  Sliders,
  User,
  Building2,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Badge } from "@/shared/components/ui/Badge";

const coreNavItems = [
  { label: "Operations Command", href: "/dashboard", icon: LayoutDashboard },
  { label: "Call Intelligence", href: "/calls", icon: PhoneCall, count: 6 },
  { label: "Actions & Kanban", href: "/actions", icon: KanbanSquare, count: 9 },
  { label: "Analytics & Vitality", href: "/analytics", icon: BarChart3 },
];

const rolePortals = [
  { label: "Patient Portal", href: "/patient/dashboard", icon: HeartPulse },
  { label: "Doctor Portal", href: "/doctor/dashboard", icon: Stethoscope },
  { label: "Reception Desk", href: "/reception/dashboard", icon: UserCheck },
  { label: "Insurance & Claims", href: "/insurance/dashboard", icon: ShieldCheck },
  { label: "Department Manager", href: "/manager/dashboard", icon: Activity },
  { label: "Hospital Admin", href: "/admin/dashboard", icon: Building2 },
];

const systemNavItems = [
  { label: "Staff & RBAC", href: "/users", icon: Users },
  { label: "My Profile & Timeline", href: "/profile", icon: User },
  { label: "Notifications", href: "/notifications", icon: Bell, alert: true },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 flex-shrink-0 bg-[#07100c] border-r border-[#152c22] flex flex-col justify-between p-4 z-30 select-none overflow-y-auto",
        className
      )}
    >
      <div className="space-y-6">
        {/* Brand Header - Solarpunk Eco-Futuristic */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 group">
          <div className="h-10 w-10 rounded-xl bg-[#142e23] border border-[#2b5946] flex items-center justify-center text-[#34d399] shadow-inner group-hover:border-[#34d399] transition-all duration-300">
            <Activity className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-stone-100 font-mono">
                CareOps
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#132c21] text-[#34d399] font-bold border border-[#24523b]">
                AI
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-medium tracking-wide">
              Healthcare Living System
            </p>
          </div>
        </Link>

        {/* Live Call Telephony Pill */}
        <Link
          href="/calls/call-live-001"
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#0c1c15] border border-[#1e3c2f] hover:border-[#34d399]/60 transition-all group"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34d399]" />
            </span>
            <div className="text-left">
              <p className="text-[11px] font-semibold text-stone-200 group-hover:text-stone-100 flex items-center gap-1">
                Live Speech Stream
                <Sparkles className="h-3 w-3 text-[#34d399] inline" />
              </p>
              <p className="text-[10px] text-stone-400">Rahul Sharma (03:24)</p>
            </div>
          </div>
          <Badge variant="teal" size="sm">
            Triage
          </Badge>
        </Link>

        {/* Core Operations Console Navigation */}
        <nav className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Operations Console
          </p>
          {coreNavItems.map((item) => {
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
                    ? "bg-[#132c21] text-[#34d399] border border-[#25523c]"
                    : "text-stone-400 hover:text-stone-200 hover:bg-[#0c1813] border border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-[#34d399]" : "text-stone-500 group-hover:text-stone-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px] font-mono",
                      isActive ? "bg-[#183629] text-[#34d399]" : "bg-[#0f1f18] text-stone-400"
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Role-Based Portals Navigation */}
        <nav className="space-y-1 pt-2 border-t border-[#152c22]">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Role Experiences
          </p>
          {rolePortals.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href.replace("/dashboard", ""));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-[#132c21] text-[#34d399] border border-[#25523c]"
                    : "text-stone-400 hover:text-stone-200 hover:bg-[#0c1813] border border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-[#34d399]" : "text-stone-500 group-hover:text-stone-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* System & Profile Navigation */}
        <nav className="space-y-1 pt-2 border-t border-[#152c22]">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            System & Personal
          </p>
          {systemNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-[#132c21] text-[#34d399] border border-[#25523c]"
                    : "text-stone-400 hover:text-stone-200 hover:bg-[#0c1813] border border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-[#34d399]" : "text-stone-500 group-hover:text-stone-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.alert && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Info */}
      <div className="space-y-3 pt-4 border-t border-[#152c22]">
        <Link
          href="/landing"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0c1813] hover:bg-[#12241d] border border-[#1a382c] text-xs text-stone-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#34d399]" />
            <span>Living System Manifesto</span>
          </div>
          <span className="text-[10px] text-[#34d399] bg-[#12281f] px-1.5 py-0.5 rounded border border-[#224b38]">
            Solarpunk
          </span>
        </Link>
      </div>
    </aside>
  );
}
