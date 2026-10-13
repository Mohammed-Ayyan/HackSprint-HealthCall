"use client";

import React, { useState } from "react";
import { PhoneCall, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Bot, Clock } from "lucide-react";
import { CommunicationRecord } from "../types";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

export interface CommunicationHistoryListProps {
  records: CommunicationRecord[];
}

export function CommunicationHistoryList({ records }: CommunicationHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(records[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Card className="bg-[#0b1712] border-[#1b362a]">
      <CardHeader className="border-b border-[#1b362a] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#11261d] border border-[#204937] flex items-center justify-center text-[#34d399]">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base text-stone-100">Communication & Telephony History</CardTitle>
              <p className="text-xs text-stone-400 mt-0.5">
                Past conversations, synthesized AI clinical extracts, and verified hospital responses
              </p>
            </div>
          </div>
          <Badge variant="teal">CareOps Voice Engine</Badge>
        </div>
      </CardHeader>

      <div className="divide-y divide-[#162e24]">
        {records.map((rec) => {
          const isExpanded = expandedId === rec.id;
          return (
            <div key={rec.id} className="p-5 hover:bg-[#0e2019]/40 transition-colors">
              <div
                className="flex items-start md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => toggleExpand(rec.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#132c21] border border-[#23533c] flex items-center justify-center text-[#34d399] flex-shrink-0">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-stone-300">
                        {rec.callNumber}
                      </span>
                      <Badge variant="gray" size="sm">
                        {rec.channel}
                      </Badge>
                      <Badge variant={rec.status === "Resolved" ? "green" : "amber"} size="sm">
                        {rec.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                      <span>{rec.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" /> {rec.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-stone-400 hover:text-stone-200">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#183327] space-y-4">
                  {/* AI Summary Section */}
                  <div className="bg-[#081510] rounded-xl p-4 border border-[#1b3b2c]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#34d399] mb-2">
                      <Bot className="h-4 w-4 text-[#34d399]" />
                      <span>CareOps Clinical Speech Summary</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">{rec.summary}</p>
                  </div>

                  {/* Commitments Made */}
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                      Commitments Detected & Logged
                    </p>
                    <div className="space-y-1.5">
                      {rec.commitmentsMade.map((commit, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-stone-300 bg-[#0d1f17] px-3 py-2 rounded-lg border border-[#1b3a2c]"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#34d399] mt-0.5 flex-shrink-0" />
                          <span>{commit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hospital Response */}
                  <div className="bg-[#0e221a] p-3.5 rounded-xl border border-[#224b38]">
                    <p className="text-xs font-semibold text-[#2dd4bf] uppercase tracking-wider mb-1">
                      Hospital Action & Care Team Response
                    </p>
                    <p className="text-xs text-stone-200">{rec.hospitalResponse}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
