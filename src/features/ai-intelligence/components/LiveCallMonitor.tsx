"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Mic,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  User,
  HeartPulse,
} from "lucide-react";
import { Call } from "@/shared/types/call";
import { Card } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { LiveWaveform } from "@/shared/components/common/LiveWaveform";
import { formatDuration } from "@/shared/utils/formatters";

export interface LiveCallMonitorProps {
  call: Call;
  className?: string;
}

export function LiveCallMonitor({ call, className }: LiveCallMonitorProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(call.durationSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card
      variant="elevated"
      className="relative overflow-hidden p-6 border-cyan-500/30 bg-gradient-to-br from-slate-900/95 via-[#0c1527]/90 to-slate-900/95 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)]"
    >
      {/* Top Bar with Live Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide uppercase font-mono">
                Live Active Inbound Telephony
              </h2>
              <Badge variant="cyan" size="sm" dot>
                Streaming Audio
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Gateway Node: {call.agentName} • Call ID: #{call.callNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Audio Waveform */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <Mic className="h-4 w-4 text-cyan-400 animate-pulse" />
            <LiveWaveform isPlaying={true} barsCount={20} variant="cyan" />
            <span className="text-xs font-mono font-bold text-cyan-300">
              {formatDuration(elapsedSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">HIPAA Encrypted</span>
          </div>
        </div>
      </div>

      {/* Main Live Call Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Patient Details & Status */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Patient Identity
              </span>
              <span className="text-[10px] font-mono text-cyan-400">{call.patient.mrn}</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{call.patient.name}</h3>
              <p className="text-xs text-slate-400">
                {call.patient.age} yrs • {call.patient.gender} • {call.patient.phone}
              </p>
              <p className="text-xs text-cyan-300 font-medium mt-1">
                {call.patient.insuranceProvider}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Triage Priority</span>
              <Badge variant={call.priority === "critical" ? "rose" : "amber"} size="sm" dot>
                {call.priority.toUpperCase()} PRIORITY
              </Badge>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="font-semibold text-cyan-200">AI Speech Pipeline</p>
                <p className="text-[10px] text-slate-400">Listening & Extracting...</p>
              </div>
            </div>
            <span className="font-mono text-xs text-cyan-400 font-bold">96% Conf</span>
          </div>
        </div>

        {/* Real-time Streaming Transcript & Live Summary */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          {/* Latest Transcript Line */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">Real-Time Patient Speech Feed</span>
              <span className="text-[11px] text-slate-500 font-mono">Diarization Active</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  {call.patient.name}:
                </span>
                <span className="text-[11px] text-slate-500 font-mono">01:35</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                &ldquo;I need a follow-up appointment after surgery. I&apos;ve developed a fever of 100.8 degrees and the lower incision feels swollen...&rdquo;
              </p>
            </div>
          </div>

          {/* Quick Extracted Tasks Preview */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-rose-400" />
              <span className="text-xs text-slate-300">
                <strong className="text-white">Auto-Extracted Action:</strong> Schedule urgent Dr. Thorne consultation (Tomorrow 09:00 AM)
              </span>
            </div>

            <Link href={`/calls/${call.id}`}>
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <span>Open Call Intelligence Dossier</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
