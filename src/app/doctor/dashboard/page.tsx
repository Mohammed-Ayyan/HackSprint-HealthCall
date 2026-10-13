"use client";

import React, { useEffect, useState } from "react";
import { doctorService } from "@/features/doctor/services/doctorService";
import { DoctorOverviewData, DoctorQueuePatient, DoctorFollowUp } from "@/features/doctor/types";
import { DoctorOverviewCards } from "@/features/doctor/components/DoctorOverviewCards";
import { DoctorQueueTable } from "@/features/doctor/components/DoctorQueueTable";
import { FollowUpManager } from "@/features/doctor/components/FollowUpManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/Tabs";
import { Users, Clock, Stethoscope } from "lucide-react";

export default function DoctorDashboardPage() {
  const [overview, setOverview] = useState<DoctorOverviewData | null>(null);
  const [patients, setPatients] = useState<DoctorQueuePatient[]>([]);
  const [followUps, setFollowUps] = useState<DoctorFollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ov, pts, fus] = await Promise.all([
          doctorService.getOverview(),
          doctorService.getPatientQueue(),
          doctorService.getFollowUps(),
        ]);
        setOverview(ov);
        setPatients(pts);
        setFollowUps(fus);
      } catch (err) {
        console.error("Failed to load doctor dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePatientStatusChange = async (patientId: string, newStatus: DoctorQueuePatient["status"]) => {
    await doctorService.updatePatientStatus(patientId, newStatus);
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
    );
  };

  if (loading || !overview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#34d399] border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-[#34d399]">Connecting to Clinician Hub & EHR Matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Doctor Overview Cards (Today's appointments, pending follow-ups, urgent cases) */}
      <DoctorOverviewCards overview={overview} />

      {/* 2. Interactive Workspace Tabs */}
      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="bg-[#0b1712] border border-[#1b362a] p-1 rounded-xl">
          <TabsTrigger
            value="queue"
            className="data-[state=active]:bg-[#132c21] data-[state=active]:text-[#34d399] flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Patient Queue ({patients.length})
          </TabsTrigger>
          <TabsTrigger
            value="followups"
            className="data-[state=active]:bg-[#132c21] data-[state=active]:text-[#34d399] flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Follow-up Management ({followUps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-6">
          <DoctorQueueTable
            patients={patients}
            onStatusChange={handlePatientStatusChange}
          />
        </TabsContent>

        <TabsContent value="followups" className="mt-6">
          <FollowUpManager initialFollowUps={followUps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
