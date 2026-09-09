export const templateConferenceEvent = {
  name: "template-conference-event",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-conference-event.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Calendar, MapPin, Ticket, Sparkles, Check } from "lucide-react";

export default function ConferenceEventTemplate() {
  const [selectedDay, setSelectedDay] = useState("day-1");

  const schedule = [
    { time: "09:00 AM", title: "Opening Keynote: Autonomous Inference at Edge", speaker: "Dr. Elena Vance" },
    { time: "11:00 AM", title: "Deterministic Design Systems for 100M+ Users", speaker: "Marcus Sterling" },
    { time: "02:00 PM", title: "Zero-Downtime eBPF State Replication", speaker: "Hiroshi Tanaka" },
  ];

  return (
    <div className="min-h-screen bg-[#08090e] text-zinc-100 font-sans p-6 sm:p-12">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <span className="font-extrabold text-base tracking-tight">Vertex Summit 2027</span>
        <button className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md">
          Claim Pass
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
          <Calendar className="h-3.5 w-3.5" />
          <span>October 14–16, 2027 • San Francisco, CA & Virtual</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          The Convergence of Autonomous Systems
        </h1>

        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Gathering 4,500+ systems engineers and AI leaders to build the future of software infrastructure.
        </p>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#12141c] text-left space-y-3 mt-8">
          <h2 className="font-bold text-sm">Day 1 Schedule (Oct 14)</h2>
          <div className="space-y-2">
            {schedule.map((item) => (
              <div key={item.time} className="p-3 rounded-xl border border-white/5 bg-[#181a24] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div className="text-[10px] text-zinc-400">{item.speaker}</div>
                </div>
                <span className="font-mono text-purple-400 font-bold">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
`,
};
