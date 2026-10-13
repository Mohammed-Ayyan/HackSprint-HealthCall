"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  Building2,
  Mail,
  Phone,
  Clock,
  Activity,
  CheckCircle2,
  Bot,
  Calendar,
  Key,
  Award,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

interface UserProfile {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  npiOrId: string;
  facility: string;
  station: string;
  avatar: string;
  joinedDate: string;
}

const defaultProfiles: Record<string, UserProfile> = {
  Doctor: {
    name: "Dr. Rahul",
    role: "Doctor / Surgical Director",
    department: "Post-Surgical General & Acute Recovery",
    email: "dr.rahul@metrohealth.eco",
    phone: "+1 (555) 749-2101",
    npiOrId: "NPI-994820194",
    facility: "Pavilion 3, Suite 410",
    station: "Clinical Room 412",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    joinedDate: "January 2022",
  },
  Patient: {
    name: "Rahul Sharma",
    role: "Patient",
    department: "Patient Access & Care Experience",
    email: "rahul.sharma@email.com",
    phone: "+1 (555) 349-8812",
    npiOrId: "MRN-884920",
    facility: "Metro Health Living System",
    station: "Outpatient Care",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    joinedDate: "October 2026",
  },
  Receptionist: {
    name: "Clara Oswald",
    role: "Receptionist / Front Desk Lead",
    department: "Central Patient Ingestion & Scheduling",
    email: "clara.o@metrohealth.eco",
    phone: "+1 (555) 482-9912",
    npiOrId: "EMP-44210",
    facility: "Central Pavilion",
    station: "Intake Station A",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    joinedDate: "March 2023",
  },
  Insurance: {
    name: "Marcus Sterling",
    role: "Senior Insurance Coordinator",
    department: "RCM & Prior-Authorization Division",
    email: "marcus.s@metrohealth.eco",
    phone: "+1 (555) 881-3329",
    npiOrId: "EMP-77192",
    facility: "Administrative Annex 2",
    station: "Payer EDI Terminal 4",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    joinedDate: "July 2021",
  },
  Manager: {
    name: "Dr. Eleanor Vance",
    role: "Department Manager",
    department: "Surgical Recovery & Operations Management",
    email: "eleanor.v@metrohealth.eco",
    phone: "+1 (555) 993-4411",
    npiOrId: "EMP-10024",
    facility: "Operations Center",
    station: "Suite 500",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    joinedDate: "September 2020",
  },
  Admin: {
    name: "Dr. Evelyn Vance",
    role: "Hospital Administrator",
    department: "Executive Healthcare Administration",
    email: "admin@metrohealth.eco",
    phone: "+1 (555) 001-9988",
    npiOrId: "EXEC-001",
    facility: "Hospital Command Nexus",
    station: "Executive Boardroom",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    joinedDate: "January 2019",
  },
};

const activityTimelineItems = [
  {
    time: "10:30 AM",
    title: "Patient called hospital",
    category: "Telephony Inbound",
    description: "Inbound voice call initiated by Rahul Sharma reporting 100.8°F fever and prior-auth inquiry.",
    icon: Phone,
    highlight: "telephony",
  },
  {
    time: "10:31 AM",
    title: "AI analyzed conversation",
    category: "CareOps NLP",
    description: "Whisper-v3 transcribed audio. CareOps Clinical Speech Engine extracted symptoms, commitments, and urgency.",
    icon: Bot,
    highlight: "ai",
  },
  {
    time: "10:32 AM",
    title: "Insurance task created",
    category: "Workflow Automation",
    description: "Prior-authorization validation ticket #CLM-992014-BC auto-generated for BlueCross expedited submission.",
    icon: Shield,
    highlight: "task",
  },
  {
    time: "10:35 AM",
    title: "Assigned to insurance employee",
    category: "RCM Routing",
    description: "Ticket routed to Marcus Sterling with 4-hour SLA due to high post-surgical priority.",
    icon: CheckCircle2,
    highlight: "assigned",
  },
  {
    time: "10:40 AM",
    title: "Consultation slot booked with Dr. Rahul",
    category: "Reception Dispatch",
    description: "Front desk lead confirmed slot for Wednesday, 15 October at 10:30 AM in Pavilion 3.",
    icon: Calendar,
    highlight: "clinical",
  },
];

export default function ProfilePage() {
  const [selectedPersona, setSelectedPersona] = useState<string>("Doctor");
  const profile = defaultProfiles[selectedPersona] || defaultProfiles.Doctor;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Solarpunk Profile Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1d17] via-[#0f241c] to-[#081510] p-6 border border-[#1e3c2f] shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.12),transparent_70%)] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-20 w-20 rounded-2xl object-cover border-2 border-[#34d399] shadow-lg"
            />
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
                  {profile.name}
                </h1>
                <Badge variant="teal" size="sm">
                  {profile.role}
                </Badge>
                <Badge variant="green" size="sm" className="font-mono">
                  {profile.npiOrId}
                </Badge>
              </div>
              <p className="text-sm text-stone-400 mt-1 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#34d399]" />
                {profile.department} • <span className="text-stone-300">{profile.facility}</span>
              </p>
            </div>
          </div>

          {/* Persona quick switch buttons */}
          <div className="bg-[#08140f] p-1.5 rounded-xl border border-[#1b382c] flex items-center gap-1 flex-wrap">
            {Object.keys(defaultProfiles).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedPersona(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPersona === role
                    ? "bg-[#132c21] text-[#34d399] border border-[#23533c]"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Contact & Identity Details (Left) + Activity Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#0b1712] border-[#1b362a]">
            <CardHeader className="border-b border-[#1b362a] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base text-stone-100">Identity & Contact Verification</CardTitle>
                  <p className="text-xs text-stone-400 mt-0.5">Verified CareOps Enterprise Identity</p>
                </div>
              </div>
            </CardHeader>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#081510] border border-[#183327]">
                <span className="text-stone-400 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#34d399]" /> Email Address
                </span>
                <span className="font-mono text-stone-200 font-medium">{profile.email}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#081510] border border-[#183327]">
                <span className="text-stone-400 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#2dd4bf]" /> Direct Phone
                </span>
                <span className="font-mono text-stone-200 font-medium">{profile.phone}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#081510] border border-[#183327]">
                <span className="text-stone-400 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#f59e0b]" /> Station / Room
                </span>
                <span className="text-stone-200 font-medium">{profile.station}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#081510] border border-[#183327]">
                <span className="text-stone-400 flex items-center gap-2">
                  <Key className="h-4 w-4 text-stone-400" /> Identity Token
                </span>
                <span className="font-mono text-[#34d399] font-medium">{profile.npiOrId}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#081510] border border-[#183327]">
                <span className="text-stone-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-stone-400" /> Member Since
                </span>
                <span className="text-stone-300 font-medium">{profile.joinedDate}</span>
              </div>
            </div>
          </Card>

          {/* Role Direct Dashboard Navigation Link */}
          <Card className="bg-[#0b1712] border-[#1b362a] p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Role Dashboard Jump
            </h4>
            <div className="space-y-2">
              <a
                href="/patient/dashboard"
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#081510] hover:bg-[#11291e] border border-[#183327] text-xs text-stone-300 hover:text-[#34d399] transition-all"
              >
                <span>Patient Portal</span>
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/doctor/dashboard"
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#081510] hover:bg-[#11291e] border border-[#183327] text-xs text-stone-300 hover:text-[#34d399] transition-all"
              >
                <span>Doctor Portal</span>
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/reception/dashboard"
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#081510] hover:bg-[#11291e] border border-[#183327] text-xs text-stone-300 hover:text-[#34d399] transition-all"
              >
                <span>Receptionist Portal</span>
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/insurance/dashboard"
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#081510] hover:bg-[#11291e] border border-[#183327] text-xs text-stone-300 hover:text-[#34d399] transition-all"
              >
                <span>Insurance Employee Portal</span>
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/manager/dashboard"
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#081510] hover:bg-[#11291e] border border-[#183327] text-xs text-stone-300 hover:text-[#34d399] transition-all"
              >
                <span>Department Manager Portal</span>
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/admin/dashboard"
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#081510] hover:bg-[#11291e] border border-[#183327] text-xs text-stone-300 hover:text-[#34d399] transition-all"
              >
                <span>Hospital Administrator Portal</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </Card>
        </div>

        {/* Right Column: Activity Timeline (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="bg-[#0b1712] border-[#1b362a]">
            <CardHeader className="border-b border-[#1b362a] pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-stone-100">CareOps Activity Timeline</CardTitle>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Sequential audit trail of patient calls, AI extractions, commitments, and staff routing
                    </p>
                  </div>
                </div>
                <Badge variant="green" size="sm">
                  Live Log
                </Badge>
              </div>
            </CardHeader>

            <div className="p-6">
              <div className="relative border-l-2 border-[#1c3a2e] ml-4 space-y-8">
                {activityTimelineItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="relative pl-7">
                      {/* Timeline Node Dot */}
                      <div className="absolute -left-[17px] top-0.5 h-8 w-8 rounded-full bg-[#0c1c15] border-2 border-[#34d399] flex items-center justify-center text-[#34d399] shadow-md">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="bg-[#081510] p-4 rounded-xl border border-[#183327] hover:border-[#285743] transition-all">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                          <span className="font-mono text-xs font-bold text-[#34d399]">
                            {item.time}
                          </span>
                          <Badge variant="teal" size="sm">
                            {item.category}
                          </Badge>
                        </div>

                        <h4 className="text-sm font-bold text-stone-100">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
