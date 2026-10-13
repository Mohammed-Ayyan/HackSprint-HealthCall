"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Layers,
  Flame,
} from "lucide-react";
import { AppShell } from "@/shared/components/layout/AppShell";
import { StatCard } from "@/shared/components/common/StatCard";
import { LiveCallMonitor } from "@/features/ai-intelligence/components/LiveCallMonitor";
import { EscalationBanner } from "@/features/workflow/components/EscalationBanner";
import { AnalyticsCharts } from "@/features/platform/components/AnalyticsCharts";
import { ReportsExporter } from "@/features/platform/components/ReportsExporter";
import { mockCallService } from "@/features/ai-intelligence/mockCallService";
import { mockCallsService } from "@/features/workflow/mockCallsService";
import { mockTasksService } from "@/features/workflow/mockTasksService";
import { mockAnalyticsService } from "@/features/platform/mockAnalyticsService";
import { Call } from "@/shared/types/call";
import { ActionItem } from "@/shared/types/action";
import {
  AnalyticsSummary,
  CallVolumePoint,
  CategoryDistribution,
  DepartmentWorkload,
  ResolutionTimeMetric,
} from "@/shared/types/analytics";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";

export default function DashboardPage() {
  const [liveCall, setLiveCall] = useState<Call | null>(null);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [escalatedTasks, setEscalatedTasks] = useState<ActionItem[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [volumeTrends, setVolumeTrends] = useState<CallVolumePoint[]>([]);
  const [categories, setCategories] = useState<CategoryDistribution[]>([]);
  const [workloads, setWorkloads] = useState<DepartmentWorkload[]>([]);
  const [resolutionMetrics, setResolutionMetrics] = useState<ResolutionTimeMetric[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const [call, recent, escalated, sum, trends, cats, load, res] = await Promise.all([
      mockCallService.getLiveCall(),
      mockCallsService.getRecentCalls(5),
      mockTasksService.getOverdueAndEscalated(),
      mockAnalyticsService.getSummary(),
      mockAnalyticsService.getVolumeTrends(),
      mockAnalyticsService.getIssueCategories(),
      mockAnalyticsService.getDepartmentWorkload(),
      mockAnalyticsService.getResolutionTimeMetrics(),
    ]);

    setLiveCall(call);
    setRecentCalls(recent);
    setEscalatedTasks(escalated);
    setSummary(sum);
    setVolumeTrends(trends);
    setCategories(cats);
    setWorkloads(load);
    setResolutionMetrics(res);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Executive Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-mono">
                CareOps Operational Intelligence
              </h1>
              <Badge variant="cyan" size="sm" dot>
                Shift: Morning Active
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time voice processing, conversational NLU, and autonomous clinical dispatch
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              Accuracy: <strong className="text-cyan-400">99.2%</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              SLA Compliance: <strong className="text-emerald-400">97.4%</strong>
            </span>
          </div>
        </div>

        {/* Manager Escalation Alert if any */}
        {escalatedTasks.length > 0 && <EscalationBanner escalatedTasks={escalatedTasks} />}

        {/* Top Operational KPI Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Inbound Calls"
              value={summary.totalCalls.toLocaleString()}
              changePercent={summary.callsChangePercent}
              subtitle="vs yesterday"
              icon={<PhoneCall className="h-5 w-5" />}
              variant="cyan"
            />
            <StatCard
              title="Completed Actions"
              value={summary.completedTasks.toLocaleString()}
              changePercent={summary.tasksChangePercent}
              subtitle="autonomous dispatch"
              icon={<CheckCircle2 className="h-5 w-5" />}
              variant="emerald"
            />
            <StatCard
              title="Pending Action Queue"
              value={summary.pendingActions}
              subtitle="across 6 departments"
              icon={<Clock className="h-5 w-5" />}
              variant="purple"
            />
            <StatCard
              title="Critical Triage Cases"
              value={summary.criticalCases}
              changePercent={summary.criticalChangePercent}
              subtitle="immediate attention"
              icon={<Flame className="h-5 w-5" />}
              variant="rose"
            />
          </div>
        )}

        {/* Live Active Telephony Card */}
        {liveCall && <LiveCallMonitor call={liveCall} />}

        {/* Analytics Charts & Trends */}
        {volumeTrends.length > 0 && (
          <AnalyticsCharts
            volumeTrends={volumeTrends}
            categories={categories}
            departmentWorkloads={workloads}
            resolutionMetrics={resolutionMetrics}
          />
        )}

        {/* Quick Recent Calls Feed & Reports Exporter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Recent Patient Telephony Stream
              </h3>
              <Link
                href="/calls"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>View all calls</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 divide-y divide-slate-800/80 overflow-hidden">
              {recentCalls.map((c) => (
                <Link
                  key={c.id}
                  href={`/calls/${c.id}`}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
                      {c.callNumber.slice(-4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {c.patient.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{c.patient.mrn}</span>
                        <Badge
                          variant={c.priority === "critical" ? "rose" : c.priority === "high" ? "amber" : "cyan"}
                          size="sm"
                        >
                          {c.priority}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 max-w-lg truncate">
                        {c.intent} • {c.summary.overview}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="text-slate-500">{c.duration}</span>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <ReportsExporter />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
