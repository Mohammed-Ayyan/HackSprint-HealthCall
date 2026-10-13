"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  FileCheck2,
  Users2,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import { UserRole } from "@/shared/types/user";
import { useAuth } from "@/features/platform/auth/authContext";
import { Button } from "@/shared/components/ui/Button";
import { Input, Select } from "@/shared/components/ui/Input";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";

interface RoleOption {
  role: UserRole;
  label: string;
  department: string;
  badge: "emerald" | "teal" | "amber" | "default" | "red";
  icon: React.ComponentType<{ className?: string }>;
  defaultEmail: string;
  destination: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "Patient",
    label: "Patient / Care Recipient",
    department: "Patient Access & Experience",
    badge: "emerald",
    icon: HeartHandshake,
    defaultEmail: "rahul.sharma@email.com",
    destination: "/patient/dashboard",
  },
  {
    role: "Doctor",
    label: "Doctor / Attending Physician",
    department: "Post-Surgical General & Acute Recovery",
    badge: "teal",
    icon: Stethoscope,
    defaultEmail: "dr.rahul@metrohealth.eco",
    destination: "/doctor/dashboard",
  },
  {
    role: "Receptionist",
    label: "Receptionist / Front Intake",
    department: "Central Intake & Scheduling",
    badge: "default",
    icon: UserCheck,
    defaultEmail: "clara.o@metrohealth.eco",
    destination: "/reception/dashboard",
  },
  {
    role: "Insurance Employee",
    label: "Insurance / Prior-Auth Specialist",
    department: "RCM & Carrier Relations",
    badge: "amber",
    icon: FileCheck2,
    defaultEmail: "marcus.s@metrohealth.eco",
    destination: "/insurance/dashboard",
  },
  {
    role: "Manager",
    label: "Department Manager / Ops Lead",
    department: "Surgical Recovery & Operations",
    badge: "teal",
    icon: Users2,
    defaultEmail: "eleanor.v@metrohealth.eco",
    destination: "/manager/dashboard",
  },
  {
    role: "Admin",
    label: "Hospital Administrator / Executive",
    department: "Executive Healthcare Governance",
    badge: "emerald",
    icon: ShieldCheck,
    defaultEmail: "admin@metrohealth.eco",
    destination: "/admin/dashboard",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("dr.rahul@metrohealth.eco");
  const [password, setPassword] = useState("••••••••••••");
  const [role, setRole] = useState<UserRole>("Doctor");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    const match = ROLE_OPTIONS.find((r) => r.role === newRole);
    if (match) {
      setEmail(match.defaultEmail);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await login({ email, password, role });
      if (res.success && res.redirectTo) {
        router.push(res.redirectTo);
      } else {
        setErrorMsg("Failed to authenticate with current credentials.");
      }
    } catch (err: unknown) {
      setErrorMsg("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = async (targetRole: UserRole, userEmail: string) => {
    setLoading(true);
    setErrorMsg(null);
    setRole(targetRole);
    setEmail(userEmail);
    try {
      const res = await login({ email: userEmail, password: "demo-password", role: targetRole });
      if (res.success && res.redirectTo) {
        router.push(res.redirectTo);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#f7f9f6] text-[#142019] relative overflow-hidden">
      {/* Solarpunk subtle background ambient blooms */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10 py-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-[#1b4332] items-center justify-center shadow-[0_4px_16px_rgba(27,67,50,0.2)] mb-1">
            <HeartHandshake className="h-6 w-6 text-[#74c69d]" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#142019] font-heading">
              CareOps AI
            </h1>
            <Badge variant="emerald">Eco-Futuristic v2.4</Badge>
          </div>
          <p className="text-xs text-[#627267] max-w-sm mx-auto">
            Sustainable hospital operations & intelligent healthcare call triage platform
          </p>
        </div>

        {/* Login Card */}
        <Card variant="elevated" className="p-6 sm:p-8 bg-white border-[#d8e2d6] shadow-[0_8px_30px_rgba(20,32,25,0.06)] space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <span className="font-semibold">Notice:</span> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#28382e] mb-1.5">
                Select Your Hospital Role
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#d8e2d6] rounded-xl text-xs font-medium text-[#142019] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/30 focus:border-[#1b4332] transition-colors cursor-pointer"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.role} value={opt.role}>
                    {opt.label} — {opt.destination}
                  </option>
                ))}
              </select>
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#627267]">
                <Sparkles className="h-3 w-3 text-[#059669]" />
                <span>Redirects automatically to dedicated portal: <code className="font-mono text-[#1b4332] font-semibold">{ROLE_OPTIONS.find((r) => r.role === role)?.destination}</code></span>
              </div>
            </div>

            <Input
              label="Staff / Patient Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dr.rahul@metrohealth.eco"
              required
            />

            <Input
              label="Secure Password / Passkey"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 shadow-sm"
              loading={loading}
            >
              <span>Sign In to {role} Console</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Persona Demo Presets for Hackathon Judges */}
          <div className="pt-5 border-t border-[#edf2ea] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#627267]">
                1-Click Role Presets (Interactive Demo)
              </span>
              <span className="text-[10px] text-[#059669] font-medium">Instant Login</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = role === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => handleQuickPreset(opt.role, opt.defaultEmail)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#e8f3ec] border-[#1b4332] shadow-sm"
                        : "bg-[#fcfdfc] hover:bg-[#f4f7f3] border-[#e2e8df] text-[#28382e]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-[#1b4332]" />
                        <span className="font-bold text-[11px] text-[#142019]">{opt.role}</span>
                      </div>
                      <span className="text-[9px] font-mono text-[#627267]">{opt.destination.replace('/dashboard', '')}</span>
                    </div>
                    <span className="text-[10px] text-[#627267] truncate">{opt.department}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Footer links */}
        <div className="text-center text-xs text-[#627267] flex items-center justify-center gap-3">
          <Link href="/auth/signup" className="hover:text-[#1b4332] font-medium transition-colors">
            Register New Staff
          </Link>
          <span>•</span>
          <Link href="/landing" className="hover:text-[#1b4332] font-medium transition-colors">
            Product Vision & Story
          </Link>
          <span>•</span>
          <Link href="/dashboard" className="hover:text-[#1b4332] font-medium transition-colors">
            Global Ops View
          </Link>
        </div>
      </div>
    </div>
  );
}
