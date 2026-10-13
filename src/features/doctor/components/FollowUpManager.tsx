"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, Clock, UserCheck, AlertTriangle, FileEdit } from "lucide-react";
import { DoctorFollowUp } from "../types";
import { doctorService } from "../services/doctorService";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Input, Select } from "@/shared/components/ui/Input";

export interface FollowUpManagerProps {
  initialFollowUps: DoctorFollowUp[];
}

export function FollowUpManager({ initialFollowUps }: FollowUpManagerProps) {
  const [followUps, setFollowUps] = useState<DoctorFollowUp[]>(initialFollowUps);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [patientName, setPatientName] = useState("Rahul Sharma");
  const [scheduledDate, setScheduledDate] = useState("18 October 2026");
  const [protocol, setProtocol] = useState("Surgical Suture & Lab Recheck");
  const [notes, setNotes] = useState("Monitor WBC differential and wound incision exudate.");
  const [assignedTo, setAssignedTo] = useState("Nurse Triage Unit 2");
  const [priority, setPriority] = useState<DoctorFollowUp["priority"]>("high");

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await doctorService.createFollowUp({
      patientId: `pat-${Date.now()}`,
      patientName,
      scheduledDate,
      protocol,
      notes,
      assignedTo,
      priority,
      status: "Pending Clinician Review",
    });
    setFollowUps([created, ...followUps]);
    setIsCreateModalOpen(false);
  };

  const handleStatusChange = async (id: string, status: DoctorFollowUp["status"]) => {
    await doctorService.updateFollowUpStatus(id, status);
    setFollowUps(
      followUps.map((f) => (f.id === id ? { ...f, status } : f))
    );
  };

  return (
    <>
      <Card className="bg-[#0b1712] border-[#1b362a]">
        <CardHeader className="border-b border-[#1b362a] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base text-stone-100">Follow-up Management & Clinical Tasks</CardTitle>
                <p className="text-xs text-stone-400 mt-0.5">
                  Assigned post-consultation milestones, care protocols, and nursing triage dispatches
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Create Follow-up</span>
            </Button>
          </div>
        </CardHeader>

        <div className="divide-y divide-[#162e24]">
          {followUps.map((fu) => (
            <div
              key={fu.id}
              className="p-5 hover:bg-[#0e2019]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-[#142d22] border border-[#244f3b] flex items-center justify-center text-[#34d399] flex-shrink-0 mt-0.5">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-stone-100">{fu.patientName}</h4>
                    <Badge variant={fu.priority === "high" ? "amber" : "teal"} size="sm">
                      {fu.priority.toUpperCase()}
                    </Badge>
                    <Badge
                      variant={fu.status === "Completed" ? "green" : "gray"}
                      size="sm"
                    >
                      {fu.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-300 font-medium mt-1">
                    Protocol: <span className="text-[#34d399]">{fu.protocol}</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5 bg-[#081510] p-2 rounded-lg border border-[#183327] max-w-2xl">
                    <span className="text-stone-300 font-medium">Notes:</span> {fu.notes}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-stone-400 mt-2 font-mono">
                    <span>Due: {fu.scheduledDate}</span>
                    <span>•</span>
                    <span>Assigned: {fu.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                {fu.status !== "Completed" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(fu.id, "Completed")}
                    className="border-[#234d3a] text-stone-300 hover:text-[#34d399]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#34d399] mr-1.5" />
                    <span>Mark Completed</span>
                  </Button>
                ) : (
                  <span className="text-xs font-mono text-[#34d399] bg-[#0c241a] px-3 py-1.5 rounded-lg border border-[#1c4533]">
                    Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Follow-up Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule Clinical Follow-up"
        className="max-w-lg bg-[#091510] border-[#1b362a]"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Patient Name
            </label>
            <Input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              className="bg-[#0b1813] border-[#1b382b] text-stone-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Target Date
              </label>
              <Input
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
                className="bg-[#0b1813] border-[#1b382b] text-stone-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Priority
              </label>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as DoctorFollowUp["priority"])}
                className="bg-[#0b1813] border-[#1b382b] text-stone-200"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Routine</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Care Protocol / Follow-up Title
            </label>
            <Input
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              required
              className="bg-[#0b1813] border-[#1b382b] text-stone-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Assignee / Care Team
            </label>
            <Select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="bg-[#0b1813] border-[#1b382b] text-stone-200"
            >
              <option value="Dr. Rahul">Dr. Rahul (Self)</option>
              <option value="Nurse Triage Unit 2">Nurse Triage Unit 2</option>
              <option value="Post-Op Recovery Clinic">Post-Op Recovery Clinic</option>
              <option value="Care Coordination Desk">Care Coordination Desk</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Clinical Instructions / Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              required
              className="w-full bg-[#0b1813] border border-[#1b382b] text-stone-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#34d399]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#183629]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Follow-up
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
