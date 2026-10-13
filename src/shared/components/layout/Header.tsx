"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Sparkles,
  PhoneCall,
  UserCheck,
  ChevronDown,
  Check,
  Radio,
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
  const [currentUser, setCurrentUser] = useState(mockAuthService.getCurrentUser());
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(mockNotificationsService.getUnreadCount());

  const availableRoles: UserRole[] = [
    "Admin",
    "Doctor",
    "Receptionist",
    "Insurance Employee",
    "Manager",
  ];

  const handleRoleChange = (role: UserRole) => {
    const updated = mockAuthService.switchRole(role);
    setCurrentUser(updated);
    setIsRoleMenuOpen(false);
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-2xl px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Left Search Bar Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-all shadow-inner group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span>Search patients, calls, tasks, departments...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
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
          className="gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.25)] text-xs font-semibold"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Simulate Inbound Call</span>
          <span className="sm:hidden">Simulate</span>
        </Button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative h-9 w-9 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse">
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
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer group"
          >
            {/* User avatar */}
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-7 w-7 rounded-lg object-cover border border-slate-700 group-hover:border-cyan-400 transition-colors"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-cyan-400 font-mono font-medium">
                  {currentUser.role}
                </span>
                <span className="text-[10px] text-slate-500">• {currentUser.department}</span>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300 transition-transform" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-950/40 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 border-b border-slate-800">
                <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Switch Active Persona
                </p>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Simulate Department View
                </p>
              </div>

              <div className="py-1 space-y-0.5">
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                  >
                    <span className={role === currentUser.role ? "text-cyan-400 font-bold" : ""}>
                      {role}
                    </span>
                    {role === currentUser.role && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>

              <div className="pt-1.5 border-t border-slate-800">
                <Link
                  href="/users"
                  onClick={() => setIsRoleMenuOpen(false)}
                  className="block px-2.5 py-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  Manage All Staff & Permissions →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
