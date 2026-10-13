"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  PhoneCall,
  Calendar,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Call } from "@/shared/types/call";
import { Badge } from "@/shared/components/ui/Badge";
import { PriorityBadge } from "@/features/ai-intelligence/components/PriorityBadge";
import { getDepartmentColorClass, formatTimeAgo } from "@/shared/utils/formatters";
import { cn } from "@/shared/utils/cn";

export interface CallTableProps {
  calls: Call[];
  className?: string;
}

export function CallTable({ calls, className }: CallTableProps) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = calls.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.patient.name.toLowerCase().includes(q) ||
      c.patient.mrn.toLowerCase().includes(q) ||
      c.intent.toLowerCase().includes(q) ||
      c.callNumber.toLowerCase().includes(q);

    const matchPriority = priorityFilter === "all" || c.priority === priorityFilter;
    const matchDepartment =
      departmentFilter === "all" ||
      c.assignedDepartment.toLowerCase() === departmentFilter.toLowerCase();

    return matchSearch && matchPriority && matchDepartment;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedCalls = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by patient name, MRN, call number, or intent..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="reception">Reception</option>
            <option value="insurance">Insurance</option>
            <option value="billing">Billing</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="emergency triage">Emergency Triage</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Patient & Identifier</th>
                <th className="py-3.5 px-4 font-semibold">Detected Issue (Intent)</th>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Routed Department</th>
                <th className="py-3.5 px-4 font-semibold">SLA Window</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Time</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-slate-800/60">
              {paginatedCalls.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No calls match current filters.
                  </td>
                </tr>
              ) : (
                paginatedCalls.map((call) => (
                  <tr
                    key={call.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  >
                    {/* Patient info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-300 font-mono text-[11px] font-bold">
                          {call.patient.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {call.patient.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {call.patient.mrn} • {call.callNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Intent / Issue */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-200">{call.intent}</span>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {call.summary.overview}
                        </p>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={call.priority} size="sm" />
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDepartmentColorClass(
                          call.assignedDepartment
                        )}`}
                      >
                        {call.assignedDepartment}
                      </span>
                    </td>

                    {/* SLA Remaining */}
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={
                          call.slaRemainingHours < 1
                            ? "text-rose-400 font-bold"
                            : call.slaRemainingHours < 3
                            ? "text-amber-400 font-semibold"
                            : "text-slate-300"
                        }
                      >
                        {call.slaRemainingHours.toFixed(1)} hrs
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          call.status === "in-progress"
                            ? "cyan"
                            : call.status === "analyzed"
                            ? "purple"
                            : "emerald"
                        }
                        size="sm"
                        dot={call.status === "in-progress"}
                      >
                        {call.status}
                      </Badge>
                    </td>

                    {/* Date / Time */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {formatTimeAgo(call.timestamp)}
                    </td>

                    {/* Action link */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/calls/${call.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-[11px] font-semibold transition-all"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} calls
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-mono text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
