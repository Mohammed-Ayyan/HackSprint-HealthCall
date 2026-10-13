"use client";

import React, { useState } from "react";
import { AlertTriangle, Clock, CheckCircle2, UserCheck, ArrowUpRight, ShieldAlert, ArrowRight } from "lucide-react";
import { EscalationCase } from "../types";
import { managerService } from "../services/managerService";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Select } from "@/shared/components/ui/Input";

export interface EscalationManagerCardProps {
  initialEscalations: EscalationCase[];
}

export function EscalationManagerCard({ initialEscalations }: EscalationManagerCardProps) {
  const [escalations, setEscalations] = useState<EscalationCase[]>(initialEscalations);
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationCase | null>(null);
  const [newAssignee, setNewAssignee] = useState("Marcus Sterling");
  const [newPriority, setNewPriority] = useState<EscalationCase["priority"]>("Urgent");

  const handleResolve = async (id: string) => {
    await managerService.resolveEscalation(id);
    setEscalations(
      escalations.map((e) => (e.id === id ? { ...e, status: "Resolved" } : e))
    );
  };

  const handleReassignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEscalation) return;
    await managerService.reassignEscalation(selectedEscalation.id, newAssignee);
    await managerService.updateEscalationPriority(selectedEscalation.id, newPriority);
    setEscalations(
      escalations.map((e) =>
        e.id === selectedEscalation.id
          ? { ...e, assignedTo: newAssignee, priority: newPriority, status: "Reassigned" }
          : e
      )
    );
    setSelectedEscalation(null);
  };

  return (
    <>
      <Card className="bg-[#0b1712] border-[#1b362a]">
        <CardHeader className="border-b border-[#1b362a] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#231515] border border-[#4d2525] flex items-center justify-center text-[#f87171]">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base text-stone-100">Escalation & SLA Incident Command</CardTitle>
                <p className="text-xs text-stone-400 mt-0.5">
                  Overdue commitments, clinical approvals, and urgent patient speech triggers
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-[#f87171] bg-[#201515] px-3 py-1 rounded-full border border-[#4d2525]">
              {escalations.filter((e) => e.status !== "Resolved").length} Active Incidents
            </span>
          </div>
        </CardHeader>

        <div className="divide-y divide-[#162e24]">
          {escalations.map((esc) => (
            <div
              key={esc.id}
              className="p-5 hover:bg-[#0e2019]/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#201515] border border-[#4d2525] flex items-center justify-center text-[#f87171] flex-shrink-0 mt-0.5">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-stone-100">{esc.patientName}</h4>
                    <span className="text-xs font-mono text-stone-400">({esc.callId})</span>
                    <Badge variant={esc.priority === "Urgent" ? "red" : "amber"} size="sm">
                      {esc.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="teal" size="sm">
                      {esc.type}
                    </Badge>
                    <Badge
                      variant={esc.status === "Resolved" ? "green" : "gray"}
                      size="sm"
                    >
                      {esc.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-stone-200 font-medium mt-1.5">{esc.issue}</p>

                  <div className="flex items-center gap-4 text-xs text-stone-400 mt-2 font-mono flex-wrap">
                    <span className="text-[#f87171] font-semibold bg-[#1a1111] px-2 py-0.5 rounded border border-[#3f1e1e]">
                      Overdue: {esc.overdueBy}
                    </span>
                    <span>•</span>
                    <span className="text-stone-300">Assignee: {esc.assignedTo}</span>
                  </div>
                </div>
              </div>

              {/* Assignment Control Buttons */}
              <div className="flex items-center gap-2.5 self-end lg:self-center">
                {esc.status !== "Resolved" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEscalation(esc);
                        setNewAssignee(esc.assignedTo);
                        setNewPriority(esc.priority);
                      }}
                      className="border-[#214b38] text-stone-300 hover:text-[#34d399] flex items-center gap-1.5"
                    >
                      <UserCheck className="h-3.5 w-3.5 text-[#34d399]" />
                      <span>Reassign / Prioritize</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleResolve(esc.id)}
                      className="flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Resolve</span>
                    </Button>
                  </>
                ) : (
                  <span className="text-xs font-mono text-[#34d399] bg-[#0c241a] px-3 py-1.5 rounded-lg border border-[#1c4533]">
                    Incident Cleared
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reassign & Priority Control Modal */}
      {selectedEscalation && (
        <Modal
          isOpen={!!selectedEscalation}
          onClose={() => setSelectedEscalation(null)}
          title={`Escalation Control • ${selectedEscalation.patientName}`}
          className="max-w-md bg-[#091510] border-[#1b362a]"
        >
          <form onSubmit={handleReassignSubmit} className="space-y-4 pt-2">
            <div>
              <p className="text-xs text-stone-300 font-medium mb-1">Issue Overview</p>
              <p className="text-xs text-stone-400 bg-[#081510] p-2.5 rounded-lg border border-[#183327]">
                {selectedEscalation.issue}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Assign Employee
              </label>
              <Select
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className="bg-[#0b1813] border-[#1b382b] text-stone-200"
              >
                <option value="Marcus Sterling">Marcus Sterling (Insurance Lead)</option>
                <option value="Sarah Jenkins, RN">Sarah Jenkins, RN (Post-Op Triage)</option>
                <option value="Clara Oswald">Clara Oswald (Front Desk Lead)</option>
                <option value="Dr. Rahul">Dr. Rahul (Surgical Director)</option>
                <option value="James Patel">James Patel (Pharmacy)</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Urgency / Priority Tier
              </label>
              <Select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as EscalationCase["priority"])}
                className="bg-[#0b1813] border-[#1b382b] text-stone-200"
              >
                <option value="Urgent">Urgent (Immediate Dispatch)</option>
                <option value="High">High (Within 1 Hour)</option>
                <option value="Medium">Medium (Within Shift)</option>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#183629]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedEscalation(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Assignment
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
