"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";
import { UserRole } from "@/shared/types/user";
import { DepartmentName } from "@/shared/types/action";
import { mockUserService } from "@/features/platform/mockUserService";
import { mockAuthService } from "@/features/platform/mockAuthService";
import { Button } from "@/shared/components/ui/Button";
import { Input, Select } from "@/shared/components/ui/Input";
import { Card } from "@/shared/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Doctor");
  const [department, setDepartment] = useState<DepartmentName>("Clinical Team");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await mockUserService.addUser({
      name,
      email,
      role,
      department,
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    });
    await mockAuthService.login(email, role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-[#080c14] relative overflow-hidden">
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <Activity className="h-6 w-6 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-mono">
            Register Staff Account
          </h1>
          <p className="text-xs text-slate-400">
            Join your hospital department queue in CareOps AI
          </p>
        </div>

        <Card variant="elevated" className="p-6 border-slate-700/80 space-y-5">
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full Name & Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Jordan Hayes"
              required
            />

            <Input
              label="Hospital Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="j.hayes@metrohealth.org"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                options={[
                  { label: "Admin", value: "Admin" },
                  { label: "Doctor", value: "Doctor" },
                  { label: "Receptionist", value: "Receptionist" },
                  { label: "Insurance Employee", value: "Insurance Employee" },
                  { label: "Manager", value: "Manager" },
                ]}
              />

              <Select
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentName)}
                options={[
                  { label: "Clinical Team", value: "Clinical Team" },
                  { label: "Reception", value: "Reception" },
                  { label: "Insurance", value: "Insurance" },
                  { label: "Billing", value: "Billing" },
                  { label: "Pharmacy", value: "Pharmacy" },
                  { label: "Emergency Triage", value: "Emergency Triage" },
                ]}
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full gap-2" loading={loading}>
              <span>Complete Registration</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
            Already registered?{" "}
            <Link href="/auth/login" className="text-cyan-400 hover:underline font-semibold">
              Sign In Here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
