"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  PhoneCall,
  User,
  KanbanSquare,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Modal } from "@/shared/components/ui/Modal";
import { mockCallsList } from "@/features/workflow/mockCallsService";
import { mockActionItems } from "@/features/workflow/mockTasksService";
import { mockUsersList } from "@/features/platform/mockAuthService";
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
    : mockCallsList.slice(0, 3);

  const filteredActions = q
    ? mockActionItems.filter(
        (a) =>
          a.task.toLowerCase().includes(q) ||
          a.patientName.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q)
      )
    : mockActionItems.slice(0, 3);

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
      className="!p-0 overflow-hidden bg-slate-900/95 border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)]"
    >
      {/* Search Header Input */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/40">
        <Search className="h-5 w-5 text-cyan-400 flex-shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients, call IDs, extracted tasks, departments, or staff..."
          className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-slate-500 hover:text-slate-300 font-mono px-2 py-0.5 rounded bg-slate-800"
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
            <div className="flex items-center gap-1.5 px-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <PhoneCall className="h-3 w-3 text-cyan-400" />
              <span>Calls & Patient Intelligence</span>
            </div>
            {filteredCalls.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(`/calls/${c.id}`)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
                    {c.callNumber.slice(-4)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {c.patient.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.patient.mrn}</span>
                      <Badge variant={c.priority === "critical" ? "rose" : c.priority === "high" ? "amber" : "cyan"} size="sm">
                        {c.priority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-md">
                      {c.intent} • {c.summary.overview}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        {/* Action Items Section */}
        {filteredActions.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <KanbanSquare className="h-3 w-3 text-purple-400" />
              <span>Operational Tasks & Routing</span>
            </div>
            {filteredActions.map((a) => (
              <button
                key={a.id}
                onClick={() => handleSelect(`/actions`)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-950/60 border border-purple-500/20 flex items-center justify-center text-purple-300 font-mono text-xs font-bold">
                    TSK
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        {a.task}
                      </span>
                      <Badge variant="purple" size="sm">
                        {a.department}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Patient: {a.patientName} • Due: {a.deadline} • Status: {a.status}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        {/* Staff Section */}
        {filteredUsers.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <User className="h-3 w-3 text-emerald-400" />
              <span>Hospital Staff</span>
            </div>
            {filteredUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleSelect(`/users`)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="h-8 w-8 rounded-lg object-cover border border-slate-700"
                  />
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {u.role} • {u.department}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer shortcut hints */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">↑↓</kbd> Navigate
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Enter</kbd> Select
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">ESC</kbd> Close
          </span>
        </div>
        <span className="text-cyan-400/80">CareOps Omnisearch</span>
      </div>
    </Modal>
  );
}
