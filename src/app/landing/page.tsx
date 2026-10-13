"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Network,
  Clock,
  HeartPulse,
  Stethoscope,
  Users,
  Building2,
  Play,
  Leaf,
  Sun,
  Layers,
  ChevronRight,
  Radio,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";
import { LiveWaveform } from "@/shared/components/common/LiveWaveform";
import { LiveCallSimulatorModal } from "@/features/ai-intelligence/components/LiveCallSimulatorModal";

export default function LandingPage() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const ecosystemChain = [
    { title: "Patients", desc: "Compassionate voice access & personalized care portal tracking", icon: HeartPulse, color: "#34d399" },
    { title: "Healthcare Employees", desc: "Automated task extraction and SLA commitments triage", icon: Users, color: "#2dd4bf" },
    { title: "Doctors", desc: "Autonomous clinical briefs & follow-up decision support", icon: Stethoscope, color: "#34d399" },
    { title: "Departments", desc: "Dynamic workload balancing across surgical, clinics & labs", icon: Network, color: "#f59e0b" },
    { title: "Insurance Teams", desc: "Instant prior-authorization validation & EDI claims pipeline", icon: ShieldCheck, color: "#f59e0b" },
    { title: "Hospital Admin", desc: "Whole-ecosystem vitality metrics, governance & resource routing", icon: Building2, color: "#34d399" },
  ];

  const rolePortals = [
    {
      title: "Patient Portal",
      href: "/patient/dashboard",
      desc: "Track requests, view appointments, and access hospital speech transcripts with clarity.",
      icon: HeartPulse,
      badge: "Patient Experience",
    },
    {
      title: "Doctor Portal",
      href: "/doctor/dashboard",
      desc: "Review AI clinical summaries before consultation and dispatch post-op follow-ups.",
      icon: Stethoscope,
      badge: "Clinical Decision Support",
    },
    {
      title: "Receptionist Portal",
      href: "/reception/dashboard",
      desc: "Manage front-desk intake, calendar matrices, and AI-generated phone tasks.",
      icon: Users,
      badge: "Intake Operations",
    },
    {
      title: "Insurance Employee Portal",
      href: "/insurance/dashboard",
      desc: "Prior-auth adjudication, conversational dispute extraction, and 4-stage lifecycle timeline.",
      icon: ShieldCheck,
      badge: "Revenue Cycle & RCM",
    },
    {
      title: "Department Manager Portal",
      href: "/manager/dashboard",
      desc: "Supervise team workload equilibrium, resolve SLA escalations, and reassign commitments.",
      icon: Activity,
      badge: "Workload Command",
    },
    {
      title: "Hospital Administrator Portal",
      href: "/admin/dashboard",
      desc: "Hospital-wide analytics, department governance, RBAC permissions, and AI routing rules.",
      icon: Building2,
      badge: "Ecosystem Governance",
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-[#07100c] text-stone-100 overflow-x-hidden relative selection:bg-[#34d399]/30 selection:text-[#34d399]">
      {/* Solarpunk subtle organic lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.12),transparent_70%)] pointer-events-none" />

      {/* Top Solarpunk Navigation Bar */}
      <nav className="h-20 border-b border-[#152c22] bg-[#07100c]/90 backdrop-blur-2xl sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-[#142e23] border border-[#2b5946] flex items-center justify-center text-[#34d399] shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Activity className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-stone-100 font-mono">
                CareOps
              </span>
              <span className="text-xs px-1.5 py-0.2 rounded bg-[#132c21] text-[#34d399] font-bold border border-[#24523b]">
                AI
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-medium">Healthcare Operations Intelligence</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-300">
          <Link href="/patient/dashboard" className="hover:text-[#34d399] transition-colors">
            Patient Portal
          </Link>
          <Link href="/doctor/dashboard" className="hover:text-[#34d399] transition-colors">
            Doctor Portal
          </Link>
          <Link href="/reception/dashboard" className="hover:text-[#34d399] transition-colors">
            Reception Desk
          </Link>
          <Link href="/insurance/dashboard" className="hover:text-[#34d399] transition-colors">
            Insurance Hub
          </Link>
          <Link href="/manager/dashboard" className="hover:text-[#34d399] transition-colors">
            Department Manager
          </Link>
          <Link href="/admin/dashboard" className="hover:text-[#34d399] transition-colors">
            Hospital Admin
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsSimulatorOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs hidden sm:inline-flex gap-1.5 border-[#1d4333] text-stone-200"
          >
            <Play className="h-3.5 w-3.5 text-[#34d399]" />
            <span>Simulate Telephony Call</span>
          </Button>

          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="text-xs gap-1.5 font-bold">
              <span>Operations Command</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section - Solarpunk Philosophy */}
      <section className="relative px-6 sm:px-12 pt-20 pb-16 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2219] border border-[#204938] text-[#34d399] text-xs font-mono shadow-sm">
          <Leaf className="h-3.5 w-3.5" />
          <span>Solarpunk Eco-Futurism • A Living Healthcare Operations Ecosystem</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-100 leading-[1.12]">
            Healthcare Operations Intelligence,{" "}
            <span className="text-[#34d399]">Naturally Synchronized</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Where patient speech transforms into sustainable clinical workflows. Technology remains invisible while doctors, caregivers, patients, and administrators work in human-centered harmony.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/dashboard">
            <Button variant="primary" size="lg" className="gap-2 text-sm font-bold shadow-lg">
              <span>Enter Operations Console</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            onClick={() => setIsSimulatorOpen(true)}
            variant="outline"
            size="lg"
            className="gap-2 text-sm border-[#1e4334] text-stone-200 hover:bg-[#12281e]"
          >
            <Play className="h-4 w-4 text-[#34d399]" />
            <span>Simulate Live Inbound Telephony</span>
          </Button>
        </div>

        {/* Live Patient Flow Simulation Banner */}
        <div className="pt-8 max-w-3xl mx-auto">
          <div className="bg-[#0b1712] border border-[#1b362a] rounded-2xl p-5 shadow-xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#183327]">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34d399]" />
                </span>
                <span className="text-xs font-mono text-stone-200 font-semibold">
                  Active Call Node: CC-2026-9842 • Rahul Sharma (Post-Op Check)
                </span>
              </div>
              <Badge variant="teal" size="sm">
                Speech Diarization Streaming
              </Badge>
            </div>

            <div className="pt-4 space-y-3">
              <div className="bg-[#07130e] p-3 rounded-xl border border-[#162e24]">
                <p className="text-xs text-stone-400 font-mono mb-1 text-[11px] uppercase text-[#34d399]">
                  Autonomous Clinical Extraction
                </p>
                <p className="text-xs text-stone-200">
                  "Patient reports 100.8°F low-grade fever and wound tightness. Verified Dr. Rahul follow-up slot for Oct 15 at 10:30 AM; dispatched prior-auth ultrasound review to insurance queue."
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                <span>Latency: 22ms</span>
                <span>Accuracy: 99.1% calibrated</span>
                <span>Status: Dispatched to 3 Clinical Hubs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Healthcare Living Chain (Product Vision) */}
      <section className="px-6 sm:px-12 py-16 max-w-6xl mx-auto border-t border-[#152c22]">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="teal">Connected Hospital Ecosystem</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-100">
            From Conversation to Whole-Hospital Action
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            CareOps AI seamlessly connects every stakeholder in modern healthcare without friction or fragmented software silos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {ecosystemChain.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div
                key={node.title}
                className="bg-[#0b1712] p-4 rounded-xl border border-[#1b362a] flex flex-col justify-between text-left hover:border-[#2d5845] transition-all"
              >
                <div>
                  <div className="h-9 w-9 rounded-lg bg-[#142e23] border border-[#26533f] flex items-center justify-center text-[#34d399] mb-3">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">Node 0{idx + 1}</span>
                  <h3 className="text-sm font-bold text-stone-100 mt-1">{node.title}</h3>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">{node.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role-Based Portals Showcase */}
      <section className="px-6 sm:px-12 py-16 max-w-6xl mx-auto border-t border-[#152c22]">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="green">Role-Based Experiences</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-100">
            Dedicated Workspaces for Every Hospital Role
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            Experience tailored portals designed specifically for patients, clinicians, reception, insurance, managers, and administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rolePortals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Link
                key={portal.title}
                href={portal.href}
                className="group bg-[#0b1712] p-5 rounded-2xl border border-[#1b362a] hover:border-[#34d399]/60 hover:bg-[#0e2118] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-[#142e23] border border-[#26533f] flex items-center justify-center text-[#34d399] group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="teal" size="sm">
                      {portal.badge}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-stone-100 group-hover:text-[#34d399] transition-colors">
                    {portal.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    {portal.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#162e24] flex items-center justify-between text-xs font-semibold text-[#34d399]">
                  <span>Launch Portal Experience</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Solarpunk Footer */}
      <footer className="border-t border-[#152c22] bg-[#07100c] px-6 sm:px-12 py-12 max-w-6xl mx-auto text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-400">
        <div>
          <p className="font-mono text-stone-200 font-bold">CareOps AI Living Platform</p>
          <p className="mt-1 text-[11px] text-stone-500">
            Sustainable Healthcare Operations • Built for clinicians, patients, and hospital leadership.
          </p>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <Link href="/dashboard" className="hover:text-[#34d399] transition-colors">
            Operations Console
          </Link>
          <Link href="/patient/dashboard" className="hover:text-[#34d399] transition-colors">
            Patient Portal
          </Link>
          <Link href="/profile" className="hover:text-[#34d399] transition-colors">
            User Profile
          </Link>
        </div>
      </footer>

      <LiveCallSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
}
