"use client";

import React, { useState, useEffect } from "react";
import { Users, Shield, UserCheck, Key, Lock } from "lucide-react";
import { AppShell } from "@/shared/components/layout/AppShell";
import { UserManagementTable } from "@/features/platform/components/UserManagementTable";
import { mockUserService } from "@/features/platform/mockUserService";
import { User } from "@/shared/types/user";
import { Badge } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const list = await mockUserService.getUsers();
    setUsers(list);
    setLoading(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-mono">
                User Management & Access Control
              </h1>
              <Badge variant="cyan" size="sm">
                RBAC Governance
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Administer hospital personnel, departmental task queues, and role-based permissions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              Active Personas: <strong className="text-cyan-300">{users.length} Users</strong>
            </span>
          </div>
        </div>

        {/* Roles Breakdown Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { role: "Admin", desc: "Full system & RBAC controls", count: 1, color: "border-rose-500/30 text-rose-300" },
            { role: "Doctor", desc: "Clinical review & approvals", count: 2, color: "border-cyan-500/30 text-cyan-300" },
            { role: "Receptionist", desc: "Appointment scheduling", count: 1, color: "border-blue-500/30 text-blue-300" },
            { role: "Insurance Employee", desc: "Prior-auth & claims", count: 1, color: "border-purple-500/30 text-purple-300" },
            { role: "Manager", desc: "SLA escalations & reporting", count: 1, color: "border-amber-500/30 text-amber-300" },
          ].map((r) => (
            <div key={r.role} className={`p-3 rounded-xl bg-slate-900/60 border ${r.color} space-y-1`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{r.role}</span>
                <span className="text-xs font-mono font-bold bg-slate-800 px-1.5 py-0.5 rounded">{r.count}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* User Table with Add/Edit/Delete */}
        {!loading && <UserManagementTable initialUsers={users} />}
      </div>
    </AppShell>
  );
}
