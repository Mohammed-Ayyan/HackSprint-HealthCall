"use client";

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Cpu,
  Clock,
  Shield,
  Network,
  Save,
  CheckCircle,
  Database,
  Radio,
} from "lucide-react";
import { AppShell } from "@/shared/components/layout/AppShell";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

export default function SettingsPage() {
  const [minConfidence, setMinConfidence] = useState(85);
  const [autoDispatchEnabled, setAutoDispatchEnabled] = useState(true);
  const [fhirConnected, setFhirConnected] = useState(true);
  const [telephonyRecording, setTelephonyRecording] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-mono">
                Platform Engine Configuration
              </h1>
              <Badge variant="cyan" size="sm">
                CareOps Core
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure speech inference thresholds, hospital department SLAs, and EHR integration bridges
            </p>
          </div>

          <Button onClick={handleSave} variant="primary" size="sm" className="gap-1.5 text-xs">
            <Save className="h-3.5 w-3.5" />
            <span>Save Settings</span>
          </Button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Platform settings saved and propagated to all 6 operational nodes.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Inference & NLU Confidence */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-5 space-y-4">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <CardTitle>AI Inference & Dispatch Thresholds</CardTitle>
                </div>
                <Badge variant="cyan" size="sm">
                  Whisper + Opus
                </Badge>
              </CardHeader>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-200 mb-1.5">
                    <span>Minimum NLU Confidence for Auto-Dispatch</span>
                    <span className="font-mono text-cyan-400">{minConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="99"
                    value={minConfidence}
                    onChange={(e) => setMinConfidence(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Conversations with confidence below this threshold require human supervisor review.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-200">Autonomous Task Routing</p>
                      <p className="text-[11px] text-slate-400">
                        Automatically assign tasks to department queues without manual triage
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoDispatchEnabled}
                      onChange={(e) => setAutoDispatchEnabled(e.target.checked)}
                      className="h-4 w-4 accent-cyan-400 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-200">HIPAA Audio Stream Encryption</p>
                      <p className="text-[11px] text-slate-400">
                        Zero-retention ephemeral audio buffer with encrypted cryptographic keys
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={telephonyRecording}
                      onChange={(e) => setTelephonyRecording(e.target.checked)}
                      className="h-4 w-4 accent-cyan-400 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Department SLA Targets */}
            <Card className="p-5 space-y-4">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <CardTitle>Department SLA Response Targets</CardTitle>
                </div>
              </CardHeader>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Emergency Triage</span>
                  <p className="font-mono font-bold text-rose-400 text-sm">10 Minutes</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Reception Desk</span>
                  <p className="font-mono font-bold text-cyan-400 text-sm">8 Hours</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Insurance Pre-Auth</span>
                  <p className="font-mono font-bold text-purple-400 text-sm">4 Hours</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Billing Resolution</span>
                  <p className="font-mono font-bold text-amber-400 text-sm">3 Hours</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Hospital EHR & Telephony Integration Bridges */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-5 space-y-4">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <CardTitle>EHR & Telephony System Bridges</CardTitle>
                </div>
                <Badge variant="emerald" size="sm">
                  Active
                </Badge>
              </CardHeader>

              <div className="space-y-3 text-xs">
                {[
                  {
                    name: "Epic Systems EHR Bridge",
                    type: "FHIR R4 API Endpoint",
                    status: "Connected (Sync every 15s)",
                    connected: true,
                  },
                  {
                    name: "Cerner Millennium Health",
                    type: "HL7 v2.5 MLLP Bridge",
                    status: "Standby Failover",
                    connected: true,
                  },
                  {
                    name: "Twilio SIP Telephony Gateway",
                    type: "SIP Trunk Primary Node",
                    status: "Active (24 channels live)",
                    connected: true,
                  },
                  {
                    name: "Walgreens / CVS Surescripts API",
                    type: "Electronic Prescription Gateway",
                    status: "Authorized",
                    connected: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{item.type}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Compliance Badge */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs space-y-2 text-slate-400">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span>Enterprise Healthcare Certification</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                CareOps AI operates under BAA agreements compliant with HIPAA Security Rule 45 CFR Part 160 and Part 164. All data in transit and at rest is AES-256 encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
