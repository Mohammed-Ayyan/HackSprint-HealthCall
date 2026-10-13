"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ExternalLink, AlertTriangle, AlertCircle, Clock, Check } from "lucide-react";
import { NotificationItem, NotificationType } from "@/shared/types/notification";
import { mockNotificationsService } from "@/features/platform/mockNotificationsService";
import { Badge } from "@/shared/components/ui/Badge";
import { cn } from "@/shared/utils/cn";

export interface NotificationDropdownProps {
  onClose: () => void;
  onCountChange?: (count: number) => void;
}

export function NotificationDropdown({ onClose, onCountChange }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    const list = await mockNotificationsService.getNotifications(filter);
    setNotifications(list);
    if (onCountChange) {
      onCountChange(mockNotificationsService.getUnreadCount());
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await mockNotificationsService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAll = async () => {
    await mockNotificationsService.markAllAsRead();
    loadNotifications();
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "critical-call":
        return <AlertCircle className="h-4 w-4 text-rose-400" />;
      case "escalation":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "deadline-missed":
        return <Clock className="h-4 w-4 text-orange-400" />;
      case "new-task":
        return <Check className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-950/40 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Operational Alerts
          </h4>
        </div>
        <button
          onClick={handleMarkAll}
          className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-slate-800 text-[11px] p-1 bg-slate-900/60">
        {(["all", "critical-call", "escalation", "new-task"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "flex-1 py-1 text-center rounded-lg font-medium transition-colors cursor-pointer",
              filter === t
                ? "bg-slate-800 text-cyan-300 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {t === "all" ? "All" : t === "critical-call" ? "Critical" : t === "escalation" ? "Escalations" : "Tasks"}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No active alerts in this category
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkAsRead(item.id)}
              className={cn(
                "p-3 transition-colors hover:bg-slate-800/40 cursor-pointer flex gap-3 text-left",
                !item.read && "bg-cyan-950/20"
              )}
            >
              <div className="mt-0.5">{getTypeIcon(item.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.message}</p>
                {item.actionUrl && (
                  <Link
                    href={item.actionUrl}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold mt-1"
                  >
                    <span>View item</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
              {!item.read && (
                <div className="h-2 w-2 rounded-full bg-cyan-400 self-center flex-shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/40 text-center">
        <Link
          href="/notifications"
          onClick={onClose}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          View Full Notification Center →
        </Link>
      </div>
    </div>
  );
}
