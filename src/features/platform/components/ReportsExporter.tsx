"use client";

import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, Printer, CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { exportToCSV, printOrExportPDF } from "@/shared/utils/export";
import { mockCallsList } from "@/features/workflow/mockCallsService";
import { mockActionItems } from "@/features/workflow/mockTasksService";

export function ReportsExporter({ className }: { className?: string }) {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportCallsCSV = () => {
    const rows = mockCallsList.map((c) => ({
      CallNumber: c.callNumber,
      Patient: c.patient.name,
      MRN: c.patient.mrn,
      Duration: c.duration,
      Priority: c.priority,
      Intent: c.intent,
      Sentiment: c.sentiment,
      Department: c.assignedDepartment,
      Status: c.status,
      Summary: c.summary.overview,
    }));
    exportToCSV("CareOps_Calls_Intelligence_Report", rows);
    showNotice("Call Report CSV downloaded successfully");
  };

  const handleExportDepartmentCSV = () => {
    const rows = mockActionItems.map((a) => ({
      TaskID: a.id,
      Task: a.task,
      Department: a.department,
      Patient: a.patientName,
      Priority: a.priority,
      Deadline: a.deadline,
      Status: a.status,
      SLA_Remaining_Hours: a.sla.remainingHours,
      Escalated: a.isEscalated ? "YES" : "NO",
    }));
    exportToCSV("CareOps_Department_Operations_Report", rows);
    showNotice("Department Operations CSV downloaded successfully");
  };

  const handleExportPDF = (reportType: string) => {
    printOrExportPDF(reportType);
  };

  const showNotice = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Download className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Enterprise Compliance & Operational Reporting</CardTitle>
            <p className="text-[11px] text-slate-400">
              Generate certified CSV datasets and audit-ready PDF dossiers for hospital executive review
            </p>
          </div>
        </div>
        <Badge variant="cyan" size="sm">
          Audit Compliant
        </Badge>
      </CardHeader>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Call Report */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-300">
            <FileSpreadsheet className="h-4 w-4" />
            <h4 className="text-xs font-bold text-white">Call Intelligence Report</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Full conversational transcripts, clinical NLU summaries, and triage priority distribution.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button onClick={handleExportCallsCSV} variant="secondary" size="sm" className="w-full text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              CSV
            </Button>
            <Button onClick={() => handleExportPDF("Call Intelligence Report")} variant="outline" size="sm" className="w-full text-xs">
              <Printer className="h-3.5 w-3.5 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        {/* Department Report */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-300">
            <FileText className="h-4 w-4" />
            <h4 className="text-xs font-bold text-white">Department Workflow Report</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Active departmental queues, staff assignments, SLA performance, and escalation logs.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button onClick={handleExportDepartmentCSV} variant="secondary" size="sm" className="w-full text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              CSV
            </Button>
            <Button onClick={() => handleExportPDF("Department Workflow Report")} variant="outline" size="sm" className="w-full text-xs">
              <Printer className="h-3.5 w-3.5 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        {/* Performance & Quality Report */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle className="h-4 w-4" />
            <h4 className="text-xs font-bold text-white">Quality & SLA Performance</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Turnaround times, commitment fulfillment audits, and resolution metrics by clinic.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button onClick={handleExportCallsCSV} variant="secondary" size="sm" className="w-full text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              CSV
            </Button>
            <Button onClick={() => handleExportPDF("Performance Report")} variant="outline" size="sm" className="w-full text-xs">
              <Printer className="h-3.5 w-3.5 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}
    </Card>
  );
}
