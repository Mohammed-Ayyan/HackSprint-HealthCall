"use client";

import React from "react";
import { Bot, User, Clock, AlertTriangle, FileText, Activity, ShieldCheck, Stethoscope } from "lucide-react";
import { DoctorQueuePatient } from "../types";
import { Modal } from "@/shared/components/ui/Modal";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export interface AIPatientBriefModalProps {
  patient: DoctorQueuePatient | null;
  isOpen: boolean;
  onClose: () => void;
  onStartConsultation?: (patientId: string) => void;
}

export function AIPatientBriefModal({
  patient,
  isOpen,
  onClose,
  onStartConsultation,
}: AIPatientBriefModalProps) {
  if (!patient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#142e23] border border-[#23533c] flex items-center justify-center text-[#34d399]">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <span className="text-stone-100 font-bold">AI Clinical Brief & Patient Dossier</span>
            <p className="text-xs text-stone-400 font-normal">
              Autonomous clinical extraction prepared prior to consultation
            </p>
          </div>
        </div>
      }
      className="max-w-3xl bg-[#091510] border-[#1b362a]"
    >
      <div className="space-y-6 pt-2">
        {/* Header patient bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0d1f17] border border-[#1b3b2c]">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[#142d22] border border-[#2b5946] flex items-center justify-center text-[#34d399]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-100">{patient.name}</h3>
                <span className="text-xs font-mono text-stone-400">
                  {patient.gender}, {patient.age}y
                </span>
                <Badge variant="teal" size="sm" className="font-mono">
                  {patient.mrn}
                </Badge>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Appointment: <span className="font-mono text-stone-300">{patient.appointmentTime}</span> •{" "}
                <span className="text-[#34d399] font-medium">{patient.roomNumber}</span>
              </p>
            </div>
          </div>
          <Badge
            variant={
              patient.priority === "urgent"
                ? "red"
                : patient.priority === "high"
                ? "amber"
                : "teal"
            }
          >
            {patient.priority.toUpperCase()} PRIORITY
          </Badge>
        </div>

        {/* AI Summary Highlight Box */}
        <div className="bg-[#0b1c15] p-5 rounded-2xl border border-[#214b38] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-full bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.15),transparent_70%)] pointer-events-none" />
          <div className="flex items-center gap-2 text-xs font-semibold text-[#34d399] uppercase tracking-wider mb-2">
            <Bot className="h-4 w-4" />
            <span>AI Clinical Brief Summary</span>
          </div>
          <p className="text-sm font-semibold text-stone-100 leading-snug">
            {patient.aiBrief.summary}
          </p>

          {patient.aiBrief.keyVitalsAlert && (
            <div className="mt-3 inline-flex items-center gap-2 bg-[#201515] border border-[#4d2525] px-3 py-1.5 rounded-lg text-xs font-mono text-[#f87171]">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{patient.aiBrief.keyVitalsAlert}</span>
            </div>
          )}
        </div>

        {/* 3 Solarpunk Structured Points: Previous Conversation, Pending Issue, Required Action */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Important Clinical Touchpoints
          </h4>

          {/* Point 1: Previous Conversation */}
          <div className="bg-[#0b1712] p-4 rounded-xl border border-[#1b362a]">
            <p className="text-xs font-semibold text-[#34d399] flex items-center gap-1.5 mb-1.5">
              <Clock className="h-3.5 w-3.5" />
              1. Previous Telephony / Portal Conversation
            </p>
            <p className="text-xs text-stone-300 leading-relaxed">
              {patient.aiBrief.previousConversation}
            </p>
          </div>

          {/* Point 2: Pending Issue */}
          <div className="bg-[#0b1712] p-4 rounded-xl border border-[#1b362a]">
            <p className="text-xs font-semibold text-[#f59e0b] flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              2. Pending Issue
            </p>
            <p className="text-xs text-stone-300 leading-relaxed">
              {patient.aiBrief.pendingIssue}
            </p>
          </div>

          {/* Point 3: Required Action */}
          <div className="bg-[#0b1712] p-4 rounded-xl border border-[#1b362a]">
            <p className="text-xs font-semibold text-[#2dd4bf] flex items-center gap-1.5 mb-1.5">
              <Stethoscope className="h-3.5 w-3.5" />
              3. Required Clinical Action
            </p>
            <p className="text-xs text-stone-300 leading-relaxed">
              {patient.aiBrief.requiredAction}
            </p>
          </div>
        </div>

        {/* Medical Requests & Follow-up History Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#08130e] p-4 rounded-xl border border-[#183327]">
            <p className="text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#34d399]" />
              Active Medical Requests
            </p>
            <div className="space-y-2">
              {patient.medicalRequests.map((req) => (
                <div key={req.id} className="text-xs bg-[#0b1813] p-2.5 rounded-lg border border-[#1a382b] flex items-center justify-between">
                  <span className="text-stone-300 font-medium">{req.title}</span>
                  <Badge variant="amber" size="sm">{req.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#08130e] p-4 rounded-xl border border-[#183327]">
            <p className="text-xs font-semibold text-stone-300 mb-2 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#2dd4bf]" />
              Recent Follow-up History
            </p>
            <div className="space-y-2">
              {patient.followupHistory.map((fu, idx) => (
                <div key={idx} className="text-xs bg-[#0b1813] p-2.5 rounded-lg border border-[#1a382b]">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span>{fu.date}</span>
                    <span className="text-stone-300 font-medium">{fu.doctor}</span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-snug">{fu.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#183629]">
          <Button variant="outline" onClick={onClose}>
            Close Dossier
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (onStartConsultation) onStartConsultation(patient.id);
              onClose();
            }}
          >
            Open Clinical Chart & Enter Room
          </Button>
        </div>
      </div>
    </Modal>
  );
}
