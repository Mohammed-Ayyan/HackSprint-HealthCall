"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  PhoneCall,
  User,
  KanbanSquare,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import { Modal } from "@/shared/components/ui/Modal";
import { mockCallsList } from "@/features/workflow/mockCallsService";
import { mockActionItems } from "@/features/workflow/mockTasksService";
import { mockUsersList } from "@/features/platform/mockAuthService";
import { mockInsuranceClaims } from "@/features/insurance/services/insuranceService";
import { Badge } from "@/shared/components/ui/Badge";
import { cn } from "@/shared/utils/cn";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  const q = query.toLowerCase().trim();

  const filteredCalls = q
    ? mockCallsList.filter(
        (c) =>
          c.patient.name.toLowerCase().includes(q) ||
          c.callNumber.toLowerCase().includes(q) ||
          c.patient.mrn.toLowerCase().includes(q) ||
          c.intent.toLowerCase().includes(q)
      )
    : mockCallsList.slice(0, 2);

  const filteredActions = q
    ? mockActionItems.filter(
        (a) =>
          a.task.toLowerCase().includes(q) ||
          a.patientName.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q)
      )
    : mockActionItems.slice(0, 2);

  const filteredClaims = q
    ? mockInsuranceClaims.filter(
        (c) =>
          c.claimId.toLowerCase().includes(q) ||
          c.patientName.toLowerCase().includes(q) ||
          c.payerName.toLowerCase().includes(q)
      )
    : mockInsuranceClaims.slice(0, 2);

  const filteredUsers = q
    ? mockUsersList.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q)
      )
    : mockUsersList.slice(0, 2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="!p-0 overflow-hidden bg-[#091510] border-[#1b362a] shadow-2xl text-stone-200"
    >
      {/* Search Header Input */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#183327] bg-[#07100c]">
        <Search className="h-5 w-5 text-[#34d399] flex-shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients, doctors, employees, calls, tasks, claims..."
          className="w-full bg-transparent text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-stone-400 hover:text-stone-200 font-mono px-2 py-0.5 rounded bg-[#132c21]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Box */}
      <div className="max-h-96 overflow-y-auto p-3 space-y-4">
        {/* Calls Section */}
        {filteredCalls.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2 text-[10px] uppercase font-bold tracking-wider text-stone-400">
              <PhoneCall className="h-3 w-3 text-[#34d399]" />
              <span>Calls & Patient Intelligence</span>
            </div>
            {filteredCalls.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(`/calls/${c.id}`)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#11241b] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#142e23] border border-[#23533c] flex items-center justify-center text-[#34d399] font-mono text-xs font-bold">
                    {c.callNumber.slice(-4)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-100 group-hover:text-[#34d399] transition-colors">
                        {c.patient.name}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">{c.patient.mrn}</span>
                      <Badge variant={c.priority === "critical" ? "red" : c.priority === "high" ? "amber" : "teal"} size="sm">
                        {c.priority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-stone-400 truncate max-w-md">
                      {c.intent} • {c.summary.overview}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-stone-600 group-hover:text-[#34d399] transition-colors opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        {/* Action Items Section */}
        {filteredActions.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2 text-[10px] uppercase font-bold tracking-wider text-stone-400">
              <KanbanSquare className="h-3 w-3 text-[#2dd4bf]" />
              <span>Operational Tasks & Commitments</span>
            </div>
            {filteredActions.map((a) => (
              <button
                key={a.id}
                onClick={() => handleSelect(`/actions`)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#11241b] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#112423] border border-[#234c49] flex items-center justify-center text-[#2dd4bf] font-mono text-xs font-bold">
                    TSK
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-100 group-hover:text-[#2dd4bf] transition-colors">
                        {a.task}
                      </span>
                      <Badge variant="teal" size="sm">
                        {a.department}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Patient: {a.patientName} • Due: {a.deadline} • Status: {a.status}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-stone-600 group-hover:text-[#2dd4bf] transition-colors opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        {/* Insurance Claims Section */}
        {filteredClaims.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2 text-[10px] uppercase font-bold tracking-wider text-stone-400">
              <ShieldCheck className="h-3 w-3 text-[#f59e0b]" />
              <span>Insurance Claims & Prior-Auth</span>
            </div>
            {filteredClaims.map((clm) => (
              <button
                key={clm.id}
                onClick={() => handleSelect(`/insurance/dashboard`)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#11241b] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#18231a] border border-[#3b4b2e] flex items-center justify-center text-[#f59e0b] font-mono text-xs font-bold">
                    CLM
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-100 group-hover:text-[#f59e0b] transition-colors">
                        {clm.claimId} • {clm.patientName}
                      </span>
                      <Badge variant="amber" size="sm">
                        {clm.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Carrier: {clm.payerName} • Amount: {clm.amount} • Deadline: {clm.deadline}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-stone-600 group-hover:text-[#f59e0b] transition-colors opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        {/* Staff & Clinicians Section */}
        {filteredUsers.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2 text-[10px] uppercase font-bold tracking-wider text-stone-400">
              <User className="h-3 w-3 text-[#34d399]" />
              <span>Hospital Staff & Doctors</span>
            </div>
            {filteredUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleSelect(`/profile`)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#11241b] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="h-8 w-8 rounded-lg object-cover border border-[#1b362a]"
                  />
                  <div>
                    <p className="text-xs font-bold text-stone-100 group-hover:text-[#34d399] transition-colors">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      {u.role} • {u.department}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-stone-600 group-hover:text-[#34d399] transition-colors opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer shortcut hints */}
      <div className="px-4 py-2.5 bg-[#07100c] border-t border-[#183327] flex items-center justify-between text-[11px] text-stone-500 font-mono">
        <div className="flex items-center gap-3">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#132c21] text-stone-300">↑↓</kbd> Navigate
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#132c21] text-stone-300">Enter</kbd> Select
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#132c21] text-stone-300">ESC</kbd> Close
          </span>
        </div>
        <span className="text-[#34d399]">CareOps Universal Search</span>
      </div>
    </Modal>
  );
}
