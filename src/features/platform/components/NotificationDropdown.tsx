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
        return <AlertCircle className="h-4 w-4 text-[#f87171]" />;
      case "escalation":
        return <AlertTriangle className="h-4 w-4 text-[#f59e0b]" />;
      case "deadline-missed":
        return <Clock className="h-4 w-4 text-[#f59e0b]" />;
      case "new-task":
        return <Check className="h-4 w-4 text-[#34d399]" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#091510] border border-[#1b362a] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-[#183327] bg-[#07100c]">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#34d399]" />
          <h4 className="text-xs font-bold text-stone-100 uppercase tracking-wider">
            CareOps Living Alerts
          </h4>
        </div>
        <button
          onClick={handleMarkAll}
          className="flex items-center gap-1 text-[11px] text-[#34d399] hover:text-[#6ee7b7] font-medium transition-colors cursor-pointer"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-[#183327] text-[11px] p-1 bg-[#08130e]">
        {(["all", "critical-call", "escalation", "new-task"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "flex-1 py-1 rounded-lg font-medium capitalize transition-colors text-center cursor-pointer",
              filter === t
                ? "bg-[#132c21] text-[#34d399] border border-[#23533c]"
                : "text-stone-400 hover:text-stone-200"
            )}
          >
            {t === "all" ? "All" : t.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#152e24]">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">
            No active alerts in this category
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={cn(
                "p-3.5 hover:bg-[#0e2118] transition-colors relative group",
                !item.read ? "bg-[#0c1e16]/50" : "opacity-75"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg bg-[#142e23] border border-[#24523c] flex-shrink-0">
                  {getTypeIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-stone-200 truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          item.priority === "critical"
                            ? "red"
                            : item.priority === "high"
                            ? "amber"
                            : "teal"
                        }
                        size="sm"
                      >
                        {item.priority}
                      </Badge>
                      {item.patientName && (
                        <span className="text-[10px] text-stone-400 font-mono">
                          {item.patientName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!item.read && (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          className="text-[10px] text-stone-400 hover:text-[#34d399] transition-colors"
                        >
                          Mark read
                        </button>
                      )}
                      {item.actionUrl && (
                        <Link
                          href={item.actionUrl}
                          onClick={onClose}
                          className="flex items-center gap-0.5 text-[10px] text-[#34d399] hover:underline font-medium"
                        >
                          <span>Open</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[#183327] bg-[#07100c] text-center">
        <Link
          href="/notifications"
          onClick={onClose}
          className="text-xs text-stone-400 hover:text-[#34d399] transition-colors block py-1 font-medium"
        >
          View Notification History & Rules →
        </Link>
      </div>
    </div>
  );
}
