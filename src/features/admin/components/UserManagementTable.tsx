"use client";

import React, { useState } from "react";
import { Users, UserPlus, Shield, UserX, CheckCircle2, Lock, Mail } from "lucide-react";
import { AdminUser } from "../types";
import { adminService } from "../services/adminService";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Input, Select } from "@/shared/components/ui/Input";

export interface UserManagementTableProps {
  initialUsers: AdminUser[];
}

export function UserManagementTable({ initialUsers }: UserManagementTableProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New user form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminUser["role"]>("Doctor");
  const [department, setDepartment] = useState("Post-Surgical General");

  const handleToggleStatus = async (id: string) => {
    await adminService.toggleUserStatus(id);
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Deactivated" : "Active" }
          : u
      )
    );
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await adminService.createUser({
      name,
      email,
      role,
      department,
      status: "Active",
      permissionsCount: role === "Doctor" ? 8 : role === "Department Manager" ? 12 : 6,
    });
    setUsers([created, ...users]);
    setIsCreateModalOpen(false);
    setName("");
    setEmail("");
  };

  return (
    <>
      <Card className="bg-[#0b1712] border-[#1b362a]">
        <CardHeader className="border-b border-[#1b362a] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base text-stone-100">Universal RBAC & User Administration</CardTitle>
                <p className="text-xs text-stone-400 mt-0.5">
                  Manage role-based entitlements across clinicians, reception, insurance, and executive leads
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create User Account</span>
            </Button>
          </div>
        </CardHeader>

        <div className="divide-y divide-[#162e24]">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-5 hover:bg-[#0e2019]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#132c21] border border-[#23533c] flex items-center justify-center text-[#34d399] flex-shrink-0 mt-0.5 font-bold font-mono text-xs">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-stone-100">{user.name}</h4>
                    <Badge variant="teal" size="sm">
                      {user.role}
                    </Badge>
                    <Badge
                      variant={user.status === "Active" ? "green" : "red"}
                      size="sm"
                    >
                      {user.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-stone-300 mt-1 flex items-center gap-2">
                    <Mail className="h-3 w-3 text-stone-400" />
                    <span className="font-mono text-stone-300">{user.email}</span> •{" "}
                    <span className="text-stone-400">{user.department}</span>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-stone-400 mt-2 font-mono flex-wrap">
                    <span>Last Active: {user.lastLogin}</span>
                    <span>•</span>
                    <span className="text-[#34d399] flex items-center gap-1">
                      <Lock className="h-3 w-3" /> {user.permissionsCount} Policies Enabled
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(user.id)}
                  className={
                    user.status === "Active"
                      ? "border-[#402323] text-red-300/80 hover:bg-[#201515]"
                      : "border-[#214b38] text-[#34d399] hover:bg-[#132d22]"
                  }
                >
                  {user.status === "Active" ? (
                    <>
                      <UserX className="h-3.5 w-3.5 mr-1" />
                      <span>Deactivate</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      <span>Reactivate</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create User Account Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision New Healthcare System Account"
        className="max-w-md bg-[#091510] border-[#1b362a]"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Full Legal Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Jordan Hayes"
              required
              className="bg-[#0b1813] border-[#1b382b] text-stone-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Enterprise Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="jordan.h@metrohealth.eco"
              required
              className="bg-[#0b1813] border-[#1b382b] text-stone-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                System Role
              </label>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminUser["role"])}
                className="bg-[#0b1813] border-[#1b382b] text-stone-200"
              >
                <option value="Doctor">Doctor</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Insurance Employee">Insurance Employee</option>
                <option value="Department Manager">Department Manager</option>
                <option value="Hospital Administrator">Hospital Administrator</option>
                <option value="Patient">Patient</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Department
              </label>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="bg-[#0b1813] border-[#1b382b] text-stone-200"
              />
            </div>
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
              Provision User
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
