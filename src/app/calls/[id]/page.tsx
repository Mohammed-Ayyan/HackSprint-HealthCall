"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  PhoneCall,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  Volume2,
  CheckCircle,
  Quote,
  Activity,
} from "lucide-react";
import { AppShell } from "@/shared/components/layout/AppShell";
import { AudioPlayer } from "@/shared/components/common/AudioPlayer";
import { AISummaryCard } from "@/features/ai-intelligence/components/AISummaryCard";
import { IntentDetector } from "@/features/ai-intelligence/components/IntentDetector";
import { SentimentGauge } from "@/features/ai-intelligence/components/SentimentGauge";
import { PriorityBadge } from "@/features/ai-intelligence/components/PriorityBadge";
import { ActionExtractor } from "@/features/ai-intelligence/components/ActionExtractor";
import { CommitmentTracker } from "@/features/ai-intelligence/components/CommitmentTracker";
import { EvidenceViewer } from "@/features/ai-intelligence/components/EvidenceViewer";
import { AuditTimeline } from "@/features/platform/components/AuditTimeline";
import { DepartmentRoutingUI } from "@/features/workflow/components/DepartmentRoutingUI";
import { mockCallsService } from "@/features/workflow/mockCallsService";
import { mockTasksService } from "@/features/workflow/mockTasksService";
import { mockAuditService } from "@/features/platform/mockAuditService";
import { Call, TranscriptSegment } from "@/shared/types/call";
import { AuditEvent } from "@/shared/types/audit";
import { DepartmentRoutingRule } from "@/shared/types/action";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Tabs } from "@/shared/components/ui/Tabs";
import { cn } from "@/shared/utils/cn";
import { Suspense } from "react";

export default function CallDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400 text-sm">
          Loading Call Intelligence Dossier...
        </div>
      }
    >
      <CallDetailsContent params={params} />
    </Suspense>
  );
}

function CallDetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [call, setCall] = useState<Call | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [routingRules, setRoutingRules] = useState<DepartmentRoutingRule[]>([]);
  const [activeTab, setActiveTab] = useState<"transcript" | "intelligence" | "actions" | "audit">("intelligence");
  const [highlightedTranscriptId, setHighlightedTranscriptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCallData();
  }, [resolvedParams.id]);

  const loadCallData = async () => {
    setLoading(true);
    const foundCall = await mockCallsService.getCallById(resolvedParams.id);
    if (foundCall) {
      setCall(foundCall);
      const [events, rules] = await Promise.all([
        mockAuditService.getAuditTimeline(foundCall.id),
        mockTasksService.getRoutingRules(),
      ]);
      setAuditEvents(events);
      setRoutingRules(rules);
    }
    setLoading(false);
  };

  if (!loading && !call) {
    return (
      <AppShell>
        <div className="p-12 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Call Not Found</h2>
          <p className="text-sm text-slate-400">The requested call dossier does not exist.</p>
          <Link href="/calls">
            <Button variant="primary" size="sm">
              Return to Calls
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  if (loading || !call) {
    return (
      <AppShell>
        <div className="h-96 flex items-center justify-center text-slate-400 text-sm">
          Loading Call Intelligence Dossier...
        </div>
      </AppShell>
    );
  }

  const evidencePairs = call.actions.map((act) => ({
    action: act.task,
    department: act.department,
    evidence: act.evidenceQuote,
    timestamp: act.deadline,
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <Link
              href="/calls"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-white font-mono">
                  Dossier: #{call.callNumber}
                </h1>
                <Badge
                  variant={call.priority === "critical" ? "rose" : call.priority === "high" ? "amber" : "cyan"}
                  size="sm"
                >
                  {call.priority.toUpperCase()} PRIORITY
                </Badge>
                <Badge variant={call.status === "in-progress" ? "cyan" : "purple"} size="sm" dot>
                  {call.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Processed via {call.agentName} • Duration: {call.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              SLA Window: <strong className="text-cyan-400">{call.slaRemainingHours.toFixed(1)} hrs</strong>
            </span>
          </div>
        </div>

        {/* Patient Identity Strip */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-lg font-mono">
              {call.patient.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{call.patient.name}</h2>
                <span className="text-xs text-slate-400 font-mono">
                  ({call.patient.age}y, {call.patient.gender})
                </span>
                <span className="text-xs text-cyan-300 font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
                  {call.patient.mrn}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Phone: {call.patient.phone} • Insurance: <strong className="text-slate-200">{call.patient.insuranceProvider}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Primary Intent</span>
              <span className="text-xs font-bold text-white">{call.intent}</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-800 mx-2" />
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Department</span>
              <span className="text-xs font-bold text-cyan-400">{call.assignedDepartment}</span>
            </div>
          </div>
        </div>

        {/* Interactive Audio Player & Scrubber */}
        <AudioPlayer durationSeconds={call.durationSeconds} />

        {/* Tab Navigation */}
        <Tabs
          tabs={[
            { id: "intelligence", label: "AI Intelligence & NLU", count: call.actions.length },
            { id: "transcript", label: "Diarized Transcript", count: call.transcript.length },
            { id: "actions", label: "Dispatched Actions & Routing", count: call.actions.length },
            { id: "audit", label: "Compliance & Audit Timeline", count: auditEvents.length },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as typeof activeTab)}
        />

        {/* Tab 1: AI Intelligence Overview */}
        {activeTab === "intelligence" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Summary Card */}
              <div className="lg:col-span-7">
                <AISummaryCard summary={call.summary} />
              </div>

              {/* Sentiment & Vocal Stress */}
              <div className="lg:col-span-5">
                <SentimentGauge sentiment={call.sentiment} sentimentScore={call.sentimentScore} />
              </div>
            </div>

            {/* Clinical Intent Classifier */}
            <IntentDetector
              detectedIntent={call.intent}
              secondaryIntents={call.secondaryIntents}
            />

            {/* Commitments & Evidence */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <CommitmentTracker commitments={call.commitments} />
              </div>
              <div className="lg:col-span-6">
                <EvidenceViewer evidencePairs={evidencePairs} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Transcript Viewer */}
        {activeTab === "transcript" && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-white">Full Diarized Multi-Speaker Audio Transcript</span>
                <span className="font-mono text-cyan-400">Time-Synced Audio Anchors</span>
              </div>

              <div className="mt-4 space-y-3">
                {call.transcript.map((seg) => (
                  <div
                    key={seg.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all duration-200",
                      seg.speaker === "agent"
                        ? "bg-cyan-950/15 border-cyan-800/30 text-slate-200"
                        : seg.speaker === "patient"
                        ? "bg-slate-900 border-slate-800 text-slate-100"
                        : "bg-slate-950 border-slate-800/80 text-slate-400 italic",
                      seg.highlighted && "ring-1 ring-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-bold",
                            seg.speaker === "agent"
                              ? "text-cyan-400"
                              : seg.speaker === "patient"
                              ? "text-purple-400"
                              : "text-slate-500"
                          )}
                        >
                          {seg.speakerName}
                        </span>
                        {seg.sentiment && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            Tone: {seg.sentiment}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">{seg.timestamp}</span>
                    </div>

                    <p className="text-sm leading-relaxed">{seg.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Tab 3: Dispatched Actions & Department Routing */}
        {activeTab === "actions" && (
          <div className="space-y-6">
            <ActionExtractor actions={call.actions} />
            <DepartmentRoutingUI rules={routingRules} />
          </div>
        )}

        {/* Tab 4: Compliance & Audit Timeline */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <AuditTimeline events={auditEvents} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
