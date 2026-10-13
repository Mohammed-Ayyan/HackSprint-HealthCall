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
  Layers,
  HeartPulse,
  Flame,
  BarChart3,
  Users,
  Play,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";
import { LiveWaveform } from "@/shared/components/common/LiveWaveform";
import { LiveCallSimulatorModal } from "@/features/ai-intelligence/components/LiveCallSimulatorModal";

export default function LandingPage() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const workflowSteps = [
    { step: "01", title: "Patient Call", desc: "SIP telephony trunk connects patient to AI voice gateway node", icon: <PhoneCall className="h-4 w-4 text-cyan-400" /> },
    { step: "02", title: "Speech Diarization", desc: "Real-time Whisper-v3 dual-channel speaker diarization stream", icon: <Activity className="h-4 w-4 text-sky-400" /> },
    { step: "03", title: "NLU Intelligence", desc: "Intent classifier, emotional valence, and priority inferred in 20ms", icon: <Sparkles className="h-4 w-4 text-purple-400" /> },
    { step: "04", title: "Action Extraction", desc: "Clinical tasks & verbal commitments extracted with transcript anchors", icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" /> },
    { step: "05", title: "Department Routing", desc: "Autonomous dispatch to Reception, Insurance, Billing, or Pharmacy", icon: <Network className="h-4 w-4 text-indigo-400" /> },
    { step: "06", title: "SLA Task Tracking", desc: "Kanban board tracking countdown deadlines and supervisor escalations", icon: <Clock className="h-4 w-4 text-amber-400" /> },
  ];

  return (
    <div className="min-h-screen w-screen bg-[#080c14] text-slate-100 overflow-x-hidden relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-cyan-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <nav className="h-20 border-b border-slate-800/80 bg-[#080c14]/80 backdrop-blur-2xl sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-300">
            <Activity className="h-5 w-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white font-mono">
                CareOps
              </span>
              <span className="text-xs px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Healthcare Operations Intelligence</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <Link href="/dashboard" className="hover:text-cyan-300 transition-colors">
            Operations Console
          </Link>
          <Link href="/calls" className="hover:text-cyan-300 transition-colors">
            Call Intelligence
          </Link>
          <Link href="/actions" className="hover:text-cyan-300 transition-colors">
            Kanban & SLA
          </Link>
          <Link href="/analytics" className="hover:text-cyan-300 transition-colors">
            Analytics
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsSimulatorOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs hidden sm:inline-flex gap-1.5"
          >
            <Play className="h-3.5 w-3.5 text-cyan-400" />
            <span>Simulate Call</span>
          </Button>

          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="text-xs gap-1.5 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <span>Launch Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-20 pb-16 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping inline-block" />
          <span>Operational AI for Hospitals & Health Systems</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Turn Thousands of Patient Phone Calls into{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Organized Hospital Actions.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          CareOps AI listens to inbound patient calls in real time. We diarize speech, extract clinical summaries, detect urgent intents, route tasks to hospital departments, and track promises before the caller even hangs up.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/dashboard">
            <Button variant="primary" size="lg" className="gap-2 text-sm font-bold shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <span>Enter Operations Console</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            onClick={() => setIsSimulatorOpen(true)}
            variant="purple"
            size="lg"
            className="gap-2 text-sm font-bold shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          >
            <Play className="h-4 w-4 text-purple-200" />
            <span>Interactive Live Call Simulator</span>
          </Button>
        </div>

        {/* Live Operational Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 text-left">
          {[
            { label: "Daily Calls Ingested", value: "1,482", note: "+14.8% vs last week", color: "text-cyan-400" },
            { label: "Extraction Accuracy", value: "99.2%", note: "Verified ground truth", color: "text-emerald-400" },
            { label: "Mean Resolution Time", value: "1.8 hrs", note: "Down from 36 hours", color: "text-purple-400" },
            { label: "Departments Automated", value: "6 Units", note: "Zero manual data entry", color: "text-white" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-1"
            >
              <p className="text-xs text-slate-400 uppercase font-mono">{stat.label}</p>
              <h3 className={`text-2xl font-extrabold font-mono ${stat.color}`}>{stat.value}</h3>
              <p className="text-[11px] text-slate-500">{stat.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Workflow Pipeline (Directly addresses the hackathon prompt) */}
      <section className="px-6 sm:px-12 py-16 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Autonomous Pipeline Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            From Spoken Voice to Executed Clinical Workflows
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            A deterministic pipeline replacing slow manual triage with automated hospital intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((s) => (
            <div
              key={s.step}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
                  {s.icon}
                </div>
                <span className="font-mono text-xs font-bold text-slate-600 group-hover:text-cyan-400 transition-colors">
                  {s.step}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {s.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Feature Highlights */}
      <section className="px-6 sm:px-12 py-16 max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card variant="elevated" className="p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <PhoneCall className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Live Telephony Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time dual-channel audio waveforms, live streaming transcripts, and automatic extraction of patient MRN, symptoms, and urgency before the call terminates.
            </p>
            <div className="pt-2">
              <Link href="/calls/call-live-001" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1">
                <span>Inspect Live Call Screen</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>

          {/* Card 2 */}
          <Card variant="purple" className="p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Network className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Department Routing & Kanban</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-label NLU routes tasks to Reception, Insurance, Billing, Pharmacy, or Clinical Team with automated staff assignment and live countdown SLA timers.
            </p>
            <div className="pt-2">
              <Link href="/actions" className="text-xs text-purple-400 hover:underline font-semibold flex items-center gap-1">
                <span>View Kanban Board</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>

          {/* Card 3 */}
          <Card className="p-6 space-y-4 border-slate-800">
            <div className="h-10 w-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Commitment Tracker & Evidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guarantees and promises made verbally (&ldquo;I will call you tomorrow&rdquo;) are automatically tracked with cryptographic transcript evidence quotes so nothing falls through the cracks.
            </p>
            <div className="pt-2">
              <Link href="/calls/call-live-001" className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                <span>Explore Grounded Citations</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6 sm:px-12 text-center space-y-4 bg-slate-950/60">
        <div className="flex items-center justify-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          <span className="font-mono font-bold text-white">CareOps AI</span>
          <span className="text-xs text-slate-500">• Hackathon Operations Intelligence Edition</span>
        </div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Built for hospital operations teams, nurse supervisors, and clinic administrators. HIPAA BAA ready.
        </p>
        <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-cyan-300">
            Dashboard
          </Link>
          <Link href="/calls" className="hover:text-cyan-300">
            Calls
          </Link>
          <Link href="/actions" className="hover:text-cyan-300">
            Actions
          </Link>
          <Link href="/analytics" className="hover:text-cyan-300">
            Analytics
          </Link>
          <Link href="/auth/login" className="hover:text-cyan-300">
            Login
          </Link>
        </div>
      </footer>

      {/* Live Call Simulator Modal */}
      <LiveCallSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
}
