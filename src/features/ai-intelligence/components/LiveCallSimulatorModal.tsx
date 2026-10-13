"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PhoneCall,
  PhoneOff,
  Mic,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { LiveWaveform } from "@/shared/components/common/LiveWaveform";
import { cn } from "@/shared/utils/cn";

export interface LiveCallSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const simulationLines = [
  {
    speaker: "system",
    text: "Incoming telephony call connected on Trunk #4 (Patient: Rahul Sharma, MRN: MRN-884920)...",
    delay: 800,
  },
  {
    speaker: "agent",
    text: "Thank you for calling Metro Health Post-Surgical Care. My name is Alex. How may I assist you today?",
    delay: 2000,
  },
  {
    speaker: "patient",
    text: "Hello Alex, I had an appendectomy five days ago with Dr. Thorne. I've developed a fever of 100.8 degrees and the lower incision feels swollen. I really need a follow-up appointment as soon as possible.",
    delay: 3800,
    triggerInsight: "Fever > 100.4°F detected. Triggering high priority triage.",
  },
  {
    speaker: "agent",
    text: "I understand your concern, Mr. Sharma. Fevers after surgery need prompt attention. I will flag this immediately for Dr. Thorne's surgical triage nurse and check appointment openings for tomorrow morning.",
    delay: 5500,
  },
  {
    speaker: "patient",
    text: "Thank you. Also, BlueCross had a pending pre-auth on my post-op ultrasound. Will I face an out-of-pocket bill if the doctor orders imaging tomorrow?",
    delay: 7200,
  },
  {
    speaker: "agent",
    text: "I will submit an expedited insurance review ticket to our billing coordinator right away to confirm authorization. I will call you tomorrow before 10:00 AM with both your confirmed slot and insurance verification.",
    delay: 9000,
    triggerCommitment: "Promise recorded: Call patient before 10:00 AM tomorrow.",
  },
];

export function LiveCallSimulatorModal({ isOpen, onClose }: LiveCallSimulatorModalProps) {
  const [stage, setStage] = useState<"idle" | "ringing" | "live" | "analyzed">("idle");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [visibleLines, setVisibleLines] = useState<typeof simulationLines>([]);
  const [detectedIntent, setDetectedIntent] = useState<string | null>(null);
  const [detectedSentiment, setDetectedSentiment] = useState<string | null>(null);
  const [detectedPriority, setDetectedPriority] = useState<string | null>(null);
  const [extractedTasks, setExtractedTasks] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStage("idle");
      setVisibleLines([]);
      setSecondsElapsed(0);
      setDetectedIntent(null);
      setDetectedSentiment(null);
      setDetectedPriority(null);
      setExtractedTasks([]);
    }
  }, [isOpen]);

  // Handle simulation flow
  useEffect(() => {
    if (stage !== "live") return;

    const timer = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);

    const timeouts: NodeJS.Timeout[] = [];

    // Stream lines
    simulationLines.forEach((line, index) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);

        if (index === 2) {
          setDetectedIntent("Appointment Request");
          setDetectedSentiment("Concerned");
          setDetectedPriority("High");
          setExtractedTasks((t) => [...t, "Schedule urgent post-op consultation with Dr. Thorne"]);
        }
        if (index === 4) {
          setExtractedTasks((t) => [
            ...t,
            "Expedite BlueCross prior-auth verification for post-op imaging",
          ]);
        }
        if (index === 5) {
          setTimeout(() => {
            setStage("analyzed");
          }, 1500);
        }
      }, line.delay);
      timeouts.push(t);
    });

    return () => {
      clearInterval(timer);
      timeouts.forEach(clearTimeout);
    };
  }, [stage]);

  const handleStartCall = () => {
    setStage("ringing");
    setTimeout(() => {
      setStage("live");
    }, 1200);
  };

  const handleEndCall = () => {
    setStage("analyzed");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Interactive Telephony & AI Extraction Sandbox"
      description="Simulate real-time inbound patient call processing with live diarization and automated operational extraction."
      className="bg-white border-[#d2ddd0]"
    >
      <div className="space-y-4">
        {/* Call Banner */}
        <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-[#e2e8df] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                stage === "live"
                  ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-sm animate-pulse"
                  : stage === "ringing"
                  ? "bg-[#fffbeb] text-[#d97706] border border-[#fde68a] animate-bounce"
                  : stage === "analyzed"
                  ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]"
                  : "bg-[#f0f4ef] text-[#607264] border border-[#dce5da]"
              )}
            >
              <PhoneCall className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#142019]">Rahul Sharma</span>
                <span className="text-xs text-[#607264] font-mono">(48M, MRN-884920)</span>
                <Badge
                  variant={
                    stage === "live"
                      ? "emerald"
                      : stage === "analyzed"
                      ? "emerald"
                      : "default"
                  }
                  size="sm"
                  dot={stage === "live"}
                >
                  {stage === "live"
                    ? "In-Call (Streaming)"
                    : stage === "ringing"
                    ? "Connecting..."
                    : stage === "analyzed"
                    ? "Call Completed & Triaged"
                    : "Standby"}
                </Badge>
              </div>
              <p className="text-xs text-[#607264] mt-0.5">
                BlueCross Premier PPO • Procedure: Laparoscopic Appendectomy (Oct 8, 2026)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {stage === "live" && (
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-[#dce5da] shadow-xs">
                <LiveWaveform isPlaying={true} barsCount={24} variant="emerald" />
                <span className="text-xs font-mono font-bold text-[#059669]">
                  00:{secondsElapsed.toString().padStart(2, "0")}
                </span>
              </div>
            )}

            {stage === "idle" && (
              <Button onClick={handleStartCall} variant="primary" size="sm" className="gap-2">
                <PhoneCall className="h-4 w-4" />
                <span>Simulate Inbound Call</span>
              </Button>
            )}

            {stage === "live" && (
              <Button onClick={handleEndCall} variant="danger" size="sm" className="gap-2">
                <PhoneOff className="h-4 w-4" />
                <span>Hang Up</span>
              </Button>
            )}

            {stage === "analyzed" && (
              <Link href="/calls/call-live-001" onClick={onClose}>
                <Button variant="primary" size="sm" className="gap-2">
                  <span>View Full Call Dossier</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Live Diarized Transcript Stream & AI Extraction Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Transcript Box */}
          <div className="lg:col-span-7 rounded-2xl bg-[#fcfdfc] border border-[#e2e8df] p-4 space-y-3 min-h-[300px] max-h-[380px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#edf2ea] text-xs font-semibold text-[#607264]">
              <span className="flex items-center gap-1.5 text-[#1b4332]">
                <Mic className="h-3.5 w-3.5 text-[#059669]" />
                Real-Time Audio Diarization Stream
              </span>
              <span className="text-[10px] font-mono text-[#607264]">Node: Whisper-v3-Turbo</span>
            </div>

            {visibleLines.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center p-6 space-y-2 text-[#607264]">
                <Bot className="h-8 w-8 text-[#059669]/60 animate-pulse" />
                <p className="text-xs font-medium text-[#142019]">Click &apos;Simulate Inbound Call&apos; above to trigger audio streaming</p>
                <p className="text-[11px] text-[#607264] max-w-sm">
                  CareOps AI will transcribe the audio, detect clinical intents, analyze emotional tone, and dispatch operational hospital tasks.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleLines.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 rounded-xl text-xs leading-relaxed transition-all animate-in fade-in duration-300",
                      line.speaker === "agent"
                        ? "bg-[#ecfdf5] border border-[#a7f3d0] text-[#142019] ml-4"
                        : line.speaker === "patient"
                        ? "bg-[#f4f7f4] border border-[#dce5da] text-[#142019] mr-4"
                        : "bg-[#f0f4ef] text-[#607264] italic text-[11px]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1 font-semibold text-[11px]">
                      <span
                        className={
                          line.speaker === "agent"
                            ? "text-[#059669]"
                            : line.speaker === "patient"
                            ? "text-[#0d9488]"
                            : "text-[#607264]"
                        }
                      >
                        {line.speaker === "agent"
                          ? "CareOps Voice Agent"
                          : line.speaker === "patient"
                          ? "Rahul Sharma (Patient)"
                          : "System Pipeline"}
                      </span>
                    </div>
                    <p>{line.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-time AI Extraction Panel */}
          <div className="lg:col-span-5 rounded-2xl bg-[#fcfdfc] border border-[#e2e8df] p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#edf2ea] text-xs font-semibold text-[#142019]">
              <span className="flex items-center gap-1.5 text-[#1b4332]">
                <Sparkles className="h-3.5 w-3.5 text-[#059669]" />
                Inference Engines
              </span>
              <span className="text-[10px] text-[#059669] font-mono font-bold">0.02s Latency</span>
            </div>

            {/* Inference Badges */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-[#607264] tracking-wider">
                Clinical Classification
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#f7f9f6] border border-[#e2e8df] space-y-1">
                  <span className="text-[10px] text-[#607264]">Detected Intent</span>
                  <p className="font-semibold text-[#059669]">
                    {detectedIntent || <span className="text-[#8ba08e]">Listening...</span>}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f7f9f6] border border-[#e2e8df] space-y-1">
                  <span className="text-[10px] text-[#607264]">Sentiment</span>
                  <p className="font-semibold text-[#d97706]">
                    {detectedSentiment || <span className="text-[#8ba08e]">Analyzing...</span>}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f7f9f6] border border-[#e2e8df] space-y-1">
                  <span className="text-[10px] text-[#607264]">Triage Priority</span>
                  <p className="font-semibold text-[#dc2626]">
                    {detectedPriority || <span className="text-[#8ba08e]">Assessing...</span>}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f7f9f6] border border-[#e2e8df] space-y-1">
                  <span className="text-[10px] text-[#607264]">SLA Target</span>
                  <p className="font-semibold text-[#0d9488]">
                    {detectedPriority ? "24 Hours (Urgent)" : <span className="text-[#8ba08e]">Pending</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Extracted Tasks Stream */}
            <div className="space-y-2 pt-2 border-t border-[#edf2ea]">
              <p className="text-[10px] uppercase font-bold text-[#607264] tracking-wider">
                Automated Department Tasks Dispatched ({extractedTasks.length})
              </p>
              {extractedTasks.length === 0 ? (
                <p className="text-xs text-[#8ba08e] italic">No tasks extracted yet...</p>
              ) : (
                <div className="space-y-1.5">
                  {extractedTasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] text-xs text-[#142019] flex items-start gap-2 animate-in slide-in-from-right duration-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] mt-0.5 flex-shrink-0" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Commitment Tracker */}
            {visibleLines.length >= 6 && (
              <div className="p-2.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-xs space-y-1 animate-in zoom-in-95">
                <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-wider">
                  Operational Commitment Detected
                </span>
                <p className="text-[#142019] text-[11px] font-medium">
                  &quot;Call patient tomorrow before 10:00 AM with confirmed slot.&quot;
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#d97706] font-mono">
                  <Clock className="h-3 w-3" />
                  <span>Owner: Reception Team • Deadline: Oct 14, 10:00 AM</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
