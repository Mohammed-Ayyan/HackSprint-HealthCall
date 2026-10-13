"use client";

import React, { useState } from "react";
import { Search, UserPlus, Phone, Mail, Calendar, ShieldCheck, History, ArrowUpRight } from "lucide-react";
import { DirectoryPatient } from "../types";
import { receptionService } from "../services/receptionService";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Input } from "@/shared/components/ui/Input";

export interface PatientDirectoryProps {
  initialPatients: DirectoryPatient[];
}

export function PatientDirectory({ initialPatients }: PatientDirectoryProps) {
  const [patients, setPatients] = useState<DirectoryPatient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<DirectoryPatient | null>(null);

  // New patient state
  const [newName, setNewName] = useState("");
  const [newMrn, setNewMrn] = useState(`MRN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [newContact, setNewContact] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDob, setNewDob] = useState("1992-05-14");
  const [newInsurance, setNewInsurance] = useState("BlueCross Premier PPO");

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contact.includes(searchTerm)
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await receptionService.createPatient({
      mrn: newMrn,
      name: newName,
      contact: newContact,
      email: newEmail,
      dob: newDob,
      insuranceProvider: newInsurance,
      lastVisit: "Today (Intake)",
    });
    setPatients([created, ...patients]);
    setIsCreateModalOpen(false);
    setNewName("");
    setNewContact("");
    setNewEmail("");
  };

  return (
    <>
      <Card className="bg-[#0b1712] border-[#1b362a]">
        <CardHeader className="border-b border-[#1b362a] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
                <Search className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base text-stone-100">Patient Directory & Registration</CardTitle>
                <p className="text-xs text-stone-400 mt-0.5">
                  Universal patient index with demographic lookups, insurance verifications, and visit history
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register Patient</span>
            </Button>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient name, MRN, phone number..."
              className="pl-10 bg-[#081510] border-[#1b382b] text-stone-200"
            />
          </div>
        </CardHeader>

        <div className="divide-y divide-[#162e24]">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No registered patients found matching "{searchTerm}".
            </div>
          ) : (
            filteredPatients.map((pat) => (
              <div
                key={pat.id}
                className="p-5 hover:bg-[#0e2019]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-stone-100">{pat.name}</h4>
                    <Badge variant="teal" size="sm" className="font-mono">
                      {pat.mrn}
                    </Badge>
                    <span className="text-xs text-stone-400">DOB: {pat.dob}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-400 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-stone-300">
                      <Phone className="h-3 w-3 text-[#34d399]" /> {pat.contact}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-stone-300">
                      <Mail className="h-3 w-3 text-[#2dd4bf]" /> {pat.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-400 mt-2">
                    <span className="text-stone-300 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#f59e0b]" /> {pat.insuranceProvider}
                    </span>
                    <span>•</span>
                    <span>Last visit: {pat.lastVisit}</span>
                    <span>•</span>
                    <span className="font-mono text-stone-500">{pat.totalAppointments} records</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPatientForHistory(pat)}
                    className="border-[#204938] text-stone-300 hover:text-[#34d399] flex items-center gap-1.5"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>View History</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Register Patient Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Patient Profile"
        className="max-w-lg bg-[#091510] border-[#1b362a]"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Full Legal Name
              </label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                required
                className="bg-[#0b1813] border-[#1b382b] text-stone-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Generated MRN
              </label>
              <Input
                value={newMrn}
                onChange={(e) => setNewMrn(e.target.value)}
                required
                className="bg-[#0b1813] border-[#1b382b] text-stone-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Contact Phone
              </label>
              <Input
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
                className="bg-[#0b1813] border-[#1b382b] text-stone-200 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                Date of Birth
              </label>
              <Input
                value={newDob}
                onChange={(e) => setNewDob(e.target.value)}
                type="date"
                required
                className="bg-[#0b1813] border-[#1b382b] text-stone-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Email Address
            </label>
            <Input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="patient@example.com"
              type="email"
              required
              className="bg-[#0b1813] border-[#1b382b] text-stone-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Insurance Carrier & Plan
            </label>
            <Input
              value={newInsurance}
              onChange={(e) => setNewInsurance(e.target.value)}
              placeholder="e.g. BlueCross Premier PPO"
              required
              className="bg-[#0b1813] border-[#1b382b] text-stone-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#183629]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Patient
            </Button>
          </div>
        </form>
      </Modal>

      {/* Patient History Modal */}
      {selectedPatientForHistory && (
        <Modal
          isOpen={!!selectedPatientForHistory}
          onClose={() => setSelectedPatientForHistory(null)}
          title={`Encounter History • ${selectedPatientForHistory.name}`}
          className="max-w-md bg-[#091510] border-[#1b362a]"
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-3 bg-[#0d1e17] rounded-xl border border-[#1e4233]">
              <p className="text-stone-300 font-medium">Demographics & Insurance</p>
              <p className="text-stone-400 mt-1">MRN: <span className="font-mono text-stone-200">{selectedPatientForHistory.mrn}</span></p>
              <p className="text-stone-400">Carrier: <span className="text-stone-200">{selectedPatientForHistory.insuranceProvider}</span></p>
              <p className="text-stone-400">Phone: <span className="text-stone-200 font-mono">{selectedPatientForHistory.contact}</span></p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-stone-300 uppercase tracking-wider text-[11px]">
                Past Encounters
              </p>
              <div className="bg-[#081510] p-2.5 rounded-lg border border-[#173327]">
                <p className="font-medium text-stone-200">Post-Op Wound Check & Consult</p>
                <p className="text-stone-400 text-[11px]">Dr. Rahul • Oct 08, 2026</p>
              </div>
              <div className="bg-[#081510] p-2.5 rounded-lg border border-[#173327]">
                <p className="font-medium text-stone-200">Inpatient Discharge Summary</p>
                <p className="text-stone-400 text-[11px]">Surgical Care Team • Oct 05, 2026</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedPatientForHistory(null)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
