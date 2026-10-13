"use client";

import React from "react";
import { Bell, CalendarCheck, Clock, ShieldAlert, Sparkles, Check } from "lucide-react";
import { PatientNotification } from "../types";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

export interface PatientNotificationsListProps {
  notifications: PatientNotification[];
}

export function PatientNotificationsList({ notifications }: PatientNotificationsListProps) {
  const getIcon = (type: PatientNotification["type"]) => {
    switch (type) {
      case "appointment":
        return <CalendarCheck className="h-4 w-4 text-[#34d399]" />;
      case "reminder":
        return <Clock className="h-4 w-4 text-[#2dd4bf]" />;
      case "insurance":
        return <ShieldAlert className="h-4 w-4 text-[#f59e0b]" />;
      default:
        return <Bell className="h-4 w-4 text-stone-400" />;
    }
  };

  return (
    <Card className="bg-[#0b1712] border-[#1b362a]">
      <CardHeader className="border-b border-[#1b362a] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base text-stone-100">Patient Alerts & Updates</CardTitle>
              <p className="text-xs text-stone-400 mt-0.5">
                Real-time dispatch from hospital clinics, doctors, and billing specialists
              </p>
            </div>
          </div>
          <Badge variant="green" size="sm">
            {notifications.filter((n) => !n.read).length} Unread
          </Badge>
        </div>
      </CardHeader>

      <div className="p-4 space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
              notif.read
                ? "bg-[#08140f] border-[#162e24] text-stone-400"
                : "bg-[#0e2118] border-[#204937] text-stone-200"
            }`}
          >
            <div className="mt-0.5 h-7 w-7 rounded-lg bg-[#142e22] border border-[#234f3a] flex items-center justify-center flex-shrink-0">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-stone-200 truncate">{notif.title}</h4>
                <span className="text-[11px] font-mono text-stone-500 whitespace-nowrap">
                  {notif.timestamp}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
