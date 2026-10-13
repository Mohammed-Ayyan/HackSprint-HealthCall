"use client";

import React, { useState } from "react";
import { Calendar, User, Clock, CheckCircle2, XCircle, Filter, Plus } from "lucide-react";
import { ReceptionAppointment } from "../types";
import { receptionService } from "../services/receptionService";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export interface AppointmentQueueListProps {
  initialAppointments: ReceptionAppointment[];
  onAppointmentsChange?: () => void;
}

export function AppointmentQueueList({ initialAppointments }: AppointmentQueueListProps) {
  const [appointments, setAppointments] = useState<ReceptionAppointment[]>(initialAppointments);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  const handleStatusChange = async (id: string, status: ReceptionAppointment["status"]) => {
    await receptionService.updateAppointmentStatus(id, status);
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  return (
    <Card className="bg-[#0b1712] border-[#1b362a]">
      <CardHeader className="border-b border-[#1b362a] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base text-stone-100">Reception Appointment Queue</CardTitle>
              <p className="text-xs text-stone-400 mt-0.5">
                Front desk intake queue, phone triage reservations, and direct cancellations
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#081510] p-1 rounded-xl border border-[#1b382c]">
            {(["all", "pending", "confirmed", "cancelled"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all capitalize ${
                  filter === mode
                    ? "bg-[#132c21] text-[#34d399] border border-[#23533d]"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <div className="divide-y divide-[#162e24]">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">
            No appointments found matching "{filter}".
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 hover:bg-[#0e2019]/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#132c21] border border-[#23533c] flex items-center justify-center text-[#34d399] flex-shrink-0 mt-0.5 font-mono text-xs font-bold">
                  {apt.time.split(" ")[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-stone-100">{apt.patientName}</h4>
                    <span className="text-xs font-mono text-stone-400">({apt.mrn})</span>
                    <Badge
                      variant={
                        apt.status === "confirmed"
                          ? "green"
                          : apt.status === "pending"
                          ? "amber"
                          : "red"
                      }
                      size="sm"
                    >
                      {apt.status.toUpperCase()}
                    </Badge>
                    <Badge variant="gray" size="sm">
                      {apt.source}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-300 mt-1">
                    Doctor: <span className="text-stone-100 font-semibold">{apt.doctorName}</span> •{" "}
                    <span className="text-stone-400">{apt.department}</span>
                  </p>
                  {apt.notes && (
                    <p className="text-xs text-stone-400 mt-1 bg-[#081510] p-2 rounded-lg border border-[#173327] max-w-2xl">
                      {apt.notes}
                    </p>
                  )}
                  <p className="text-[11px] font-mono text-[#34d399] mt-1.5">
                    {apt.date} at {apt.time}
                  </p>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 self-end lg:self-center">
                {apt.status === "pending" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusChange(apt.id, "confirmed")}
                    className="flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Confirm Slot</span>
                  </Button>
                )}

                {apt.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(apt.id, "cancelled")}
                    className="border-[#382323] text-red-300/80 hover:bg-[#201515] flex items-center gap-1.5"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </Button>
                )}

                {apt.status === "cancelled" && (
                  <span className="text-xs font-mono text-stone-500 bg-[#161515] px-3 py-1.5 rounded-lg border border-[#302323]">
                    Archived Cancellation
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
