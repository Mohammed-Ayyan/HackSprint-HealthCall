"use client";

import React, { useState } from "react";
import { Users, Bot, Stethoscope, Clock, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { DoctorQueuePatient } from "../types";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { AIPatientBriefModal } from "./AIPatientBriefModal";

export interface DoctorQueueTableProps {
  patients: DoctorQueuePatient[];
  onStatusChange?: (patientId: string, newStatus: DoctorQueuePatient["status"]) => void;
}

export function DoctorQueueTable({ patients, onStatusChange }: DoctorQueueTableProps) {
  const [selectedPatient, setSelectedPatient] = useState<DoctorQueuePatient | null>(null);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

  const handleOpenBrief = (patient: DoctorQueuePatient) => {
    setSelectedPatient(patient);
    setIsBriefModalOpen(true);
  };

  const getPriorityBadge = (priority: DoctorQueuePatient["priority"]) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="red">URGENT</Badge>;
      case "high":
        return <Badge variant="amber">HIGH</Badge>;
      case "medium":
        return <Badge variant="teal">MEDIUM</Badge>;
      default:
        return <Badge variant="gray">ROUTINE</Badge>;
    }
  };

  const getStatusBadge = (status: DoctorQueuePatient["status"]) => {
    switch (status) {
      case "Checked In":
        return <Badge variant="green">CHECKED IN</Badge>;
      case "In Consultation":
        return <Badge variant="teal">IN CONSULTATION</Badge>;
      case "Pending Labs":
        return <Badge variant="amber">PENDING LABS</Badge>;
      default:
        return <Badge variant="gray">WAITING ROOM</Badge>;
    }
  };

  return (
    <>
      <Card className="bg-[#0b1712] border-[#1b362a]">
        <CardHeader className="border-b border-[#1b362a] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base text-stone-100">Live Clinical Patient Queue</CardTitle>
                <p className="text-xs text-stone-400 mt-0.5">
                  Real-time arrival sequence with AI-synthesized chief complaints and urgency triage
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-[#34d399] bg-[#0c2018] px-3 py-1 rounded-full border border-[#1b3b2c]">
              {patients.length} In Flow
            </span>
          </div>
        </CardHeader>

        <div className="divide-y divide-[#162e24]">
          {patients.map((pat) => (
            <div
              key={pat.id}
              className="p-5 hover:bg-[#0e2019]/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#132c21] border border-[#23533c] flex items-center justify-center text-[#34d399] flex-shrink-0 mt-0.5">
                  <span className="font-mono text-xs font-bold">{pat.appointmentTime.split(" ")[0]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-stone-100">{pat.name}</h4>
                    <span className="text-xs font-mono text-stone-400">
                      ({pat.gender}, {pat.age}y)
                    </span>
                    <Badge variant="gray" size="sm" className="font-mono">
                      {pat.mrn}
                    </Badge>
                    {getPriorityBadge(pat.priority)}
                    {getStatusBadge(pat.status)}
                  </div>
                  <p className="text-xs text-stone-300 mt-1.5 flex items-center gap-2">
                    <span className="text-stone-400">Chief Issue:</span>
                    <span className="text-stone-200 font-medium">{pat.issue}</span>
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Location: <span className="text-[#34d399] font-medium">{pat.roomNumber}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end lg:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenBrief(pat)}
                  className="border-[#214b38] text-stone-200 hover:bg-[#132d22] flex items-center gap-1.5"
                >
                  <Bot className="h-3.5 w-3.5 text-[#34d399]" />
                  <span>AI Patient Brief</span>
                </Button>

                {pat.status !== "In Consultation" ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (onStatusChange) onStatusChange(pat.id, "In Consultation");
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <Stethoscope className="h-3.5 w-3.5" />
                    <span>Call Patient</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (onStatusChange) onStatusChange(pat.id, "Pending Labs");
                    }}
                    className="border-[#2b4d3b] text-[#34d399]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Consultation Active</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <AIPatientBriefModal
        patient={selectedPatient}
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        onStartConsultation={(id) => {
          if (onStatusChange) onStatusChange(id, "In Consultation");
        }}
      />
    </>
  );
}
