"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Sparkles,
  PhoneCall,
  UserCheck,
  ChevronDown,
  Check,
  Radio,
  ExternalLink,
} from "lucide-react";
import { UserRole } from "@/shared/types/user";
import { mockAuthService } from "@/features/platform/mockAuthService";
import { mockNotificationsService } from "@/features/platform/mockNotificationsService";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { NotificationDropdown } from "@/features/platform/components/NotificationDropdown";

export interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSimulator: () => void;
}

export function Header({ onOpenSearch, onOpenSimulator }: HeaderProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(mockAuthService.getCurrentUser());
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(mockNotificationsService.getUnreadCount());

  const roleDashboardMap: Record<string, string> = {
    Patient: "/patient/dashboard",
    Doctor: "/doctor/dashboard",
    Receptionist: "/reception/dashboard",
    "Insurance Employee": "/insurance/dashboard",
    Manager: "/manager/dashboard",
    Admin: "/admin/dashboard",
  };

  const availableRoles: { name: UserRole; dashboardUrl: string }[] = [
    { name: "Doctor", dashboardUrl: "/doctor/dashboard" },
    { name: "Receptionist", dashboardUrl: "/reception/dashboard" },
    { name: "Insurance Employee", dashboardUrl: "/insurance/dashboard" },
    { name: "Manager", dashboardUrl: "/manager/dashboard" },
    { name: "Admin", dashboardUrl: "/admin/dashboard" },
  ];

  const handleRoleChange = (role: UserRole, targetUrl?: string) => {
    const updated = mockAuthService.switchRole(role);
    setCurrentUser(updated);
    setIsRoleMenuOpen(false);
    if (targetUrl) {
      router.push(targetUrl);
    }
  };

  return (
    <header className="h-16 border-b border-[#152c22] bg-[#07100c] px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Left Search Bar Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0b1712] border border-[#1b362a] hover:border-[#2d5a47] text-stone-400 hover:text-stone-200 text-xs transition-all shadow-inner group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-[#34d399] transition-colors" />
            <span>Search patients, doctors, claims, calls, tasks...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-[#132c21] border border-[#23533c] text-[10px] font-mono text-[#34d399]">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Action Items */}
      <div className="flex items-center gap-3">
        {/* Simulate Live Inbound Call Button */}
        <Button
          onClick={onOpenSimulator}
          variant="primary"
          size="sm"
          className="gap-1.5 text-xs font-semibold"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Simulate Inbound Call</span>
          <span className="sm:hidden">Simulate</span>
        </Button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative h-9 w-9 rounded-xl bg-[#0b1712] border border-[#1b362a] hover:border-[#2d5a47] text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#f87171] text-[10px] font-bold text-white flex items-center justify-center shadow-md animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <NotificationDropdown
              onClose={() => setIsNotifOpen(false)}
              onCountChange={(cnt) => setUnreadCount(cnt)}
            />
          )}
        </div>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-[#0b1712] border border-[#1b362a] hover:border-[#2d5a47] transition-all cursor-pointer group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-7 w-7 rounded-lg object-cover border border-[#1e3e2f] group-hover:border-[#34d399] transition-colors"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-stone-200 leading-tight">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[#34d399] font-mono font-medium">
                  {currentUser.role}
                </span>
                <span className="text-[10px] text-stone-500">• {currentUser.department}</span>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-stone-400 group-hover:text-stone-200 transition-transform" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#091510] border border-[#1b362a] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 border-b border-[#183327]">
                <p className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                  Switch Active Persona
                </p>
                <p className="text-xs text-stone-200 font-medium mt-0.5">
                  Simulate Role Portal
                </p>
              </div>

              <div className="py-1 space-y-0.5">
                {availableRoles.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => handleRoleChange(r.name, r.dashboardUrl)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white hover:bg-[#132c21] transition-colors cursor-pointer group"
                  >
                    <span className={r.name === currentUser.role ? "text-[#34d399] font-bold" : ""}>
                      {r.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {r.name === currentUser.role && <Check className="h-3.5 w-3.5 text-[#34d399]" />}
                      <ExternalLink className="h-3 w-3 text-stone-500 opacity-0 group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-1.5 border-t border-[#183327] space-y-1">
                <Link
                  href="/patient/dashboard"
                  onClick={() => setIsRoleMenuOpen(false)}
                  className="block px-2.5 py-1 text-[11px] text-[#34d399] hover:underline"
                >
                  View Patient Portal Experience →
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsRoleMenuOpen(false)}
                  className="block px-2.5 py-1 text-[11px] text-stone-400 hover:text-stone-200"
                >
                  View Profile & Activity Timeline →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
