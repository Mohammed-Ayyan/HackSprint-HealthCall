"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ShieldCheck, ArrowRight, User, Lock } from "lucide-react";
import { UserRole } from "@/shared/types/user";
import { mockAuthService } from "@/features/platform/mockAuthService";
import { Button } from "@/shared/components/ui/Button";
import { Input, Select } from "@/shared/components/ui/Input";
import { Card } from "@/shared/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("e.rostova@metrohealth.org");
  const [role, setRole] = useState<UserRole>("Admin");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await mockAuthService.login(email, role);
    router.push("/dashboard");
  };

  const handleQuickRole = async (selectedRole: UserRole, userEmail: string) => {
    setLoading(true);
    await mockAuthService.login(userEmail, selectedRole);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-[#080c14] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <Activity className="h-6 w-6 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-mono">
            CareOps AI
          </h1>
          <p className="text-xs text-slate-400">
            Enterprise Healthcare Call Intelligence & Operations Console
          </p>
        </div>

        {/* Login Card */}
        <Card variant="elevated" className="p-6 border-slate-700/80 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Hospital Staff Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.rostova@metrohealth.org"
              required
            />

            <Select
              label="Operational Role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { label: "Admin (Executive Governance)", value: "Admin" },
                { label: "Doctor (Clinical Review & Orders)", value: "Doctor" },
                { label: "Receptionist (Triage & Scheduling)", value: "Receptionist" },
                { label: "Insurance Employee (Prior-Auth & Claims)", value: "Insurance Employee" },
                { label: "Manager (SLA Escalations & Operations)", value: "Manager" },
              ]}
            />

            <Button type="submit" variant="primary" size="md" className="w-full gap-2" loading={loading}>
              <span>Enter Operations Console</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* 1-Click Role Presets for Demo Judges */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 text-center">
              Quick Role Demo Presets (Hackathon Mode)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickRole("Admin", "e.rostova@metrohealth.org")}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="font-bold text-rose-400 block text-[11px]">Admin Persona</span>
                <span className="text-[10px] text-slate-400">Full platform controls</span>
              </button>
              <button
                onClick={() => handleQuickRole("Doctor", "a.thorne@metrohealth.org")}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="font-bold text-cyan-400 block text-[11px]">Doctor Persona</span>
                <span className="text-[10px] text-slate-400">Clinical order review</span>
              </button>
              <button
                onClick={() => handleQuickRole("Receptionist", "s.jenkins@metrohealth.org")}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="font-bold text-blue-400 block text-[11px]">Receptionist</span>
                <span className="text-[10px] text-slate-400">Appointment routing</span>
              </button>
              <button
                onClick={() => handleQuickRole("Insurance Employee", "m.vance@metrohealth.org")}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="font-bold text-purple-400 block text-[11px]">Insurance Spec.</span>
                <span className="text-[10px] text-slate-400">Prior-auth clearances</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Footer links */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-4">
          <Link href="/auth/signup" className="hover:text-cyan-400 transition-colors">
            New Hospital Staff? Request Access
          </Link>
          <span>•</span>
          <Link href="/landing" className="hover:text-cyan-400 transition-colors">
            Product Story Showcase
          </Link>
        </div>
      </div>
    </div>
  );
}
