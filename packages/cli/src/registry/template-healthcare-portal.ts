export const templateHealthcarePortal = {
  name: "template-healthcare-portal",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-healthcare-portal.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Heart, Calendar, Pill, CheckCircle2, Video, TrendingUp } from "lucide-react";

export default function HealthcarePortalTemplate() {
  const [checkedMeds, setCheckedMeds] = useState<string[]>(["med-1"]);

  const vitals = [
    { label: "Resting Heart Rate", value: "64", unit: "BPM", delta: "-3 bpm vs avg", status: "Optimal" },
    { label: "Blood Oxygen (SpO2)", value: "98.8", unit: "%", delta: "+0.4% healthy", status: "Optimal" },
    { label: "Sleep Recovery", value: "88", unit: "/100", delta: "7h 42m deep sleep", status: "High" },
    { label: "Heart Rate Var.", value: "58", unit: "ms", delta: "+7ms resilience", status: "Normal" },
  ];

  const medications = [
    { id: "med-1", name: "Atorvastatin Calcium", dose: "20mg • Morning with meal", days: "24 days left" },
    { id: "med-2", name: "Omega-3 Pure EPA/DHA", dose: "1000mg • Midday with water", days: "18 days left" },
    { id: "med-3", name: "Magnesium Glycinate", dose: "400mg • Evening before sleep", days: "6 days left" },
  ];

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 font-sans p-6 sm:p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-teal-400">PulseCare Telehealth</span>
          <h1 className="text-2xl font-bold">Patient Health Telemetry</h1>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2">
          <Video className="h-3.5 w-3.5" />
          <span>Book Specialist</span>
        </button>
      </header>

      <main className="max-w-6xl mx-auto py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {vitals.map((v) => (
            <div key={v.label} className="p-4 rounded-2xl border border-white/10 bg-[#12141c]">
              <span className="text-xs text-zinc-400">{v.label}</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono my-1">
                {v.value} <span className="text-xs font-normal opacity-60">{v.unit}</span>
              </div>
              <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {v.delta}
              </span>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#12141c] space-y-4">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Pill className="h-4 w-4 text-teal-400" />
            <span>Daily Prescriptions</span>
          </h2>
          <div className="space-y-2">
            {medications.map((m) => {
              const isDone = checkedMeds.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() =>
                    setCheckedMeds((prev) =>
                      prev.includes(m.id) ? prev.filter((i) => i !== m.id) : [...prev, m.id]
                    )
                  }
                  className="p-3.5 rounded-xl border border-white/5 bg-[#181a24] flex items-center justify-between cursor-pointer hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={\`w-5 h-5 rounded-lg border flex items-center justify-center \${
                        isDone ? "bg-teal-600 border-teal-600 text-white" : "border-zinc-500"
                      }\`}
                    >
                      {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <div className={\`text-xs font-semibold \${isDone ? "line-through opacity-50" : ""}\`}>
                        {m.name}
                      </div>
                      <div className="text-[10px] text-zinc-400">{m.dose}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{m.days}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
`,
};
