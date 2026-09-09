export const templateFitnessAthletics = {
  name: "template-fitness-athletics",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-fitness-athletics.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Activity, Heart, Flame, Trophy, Timer, Plus, CheckCircle2 } from "lucide-react";

export default function FitnessAthleticsTemplate() {
  const [bpm, setBpm] = useState(158);
  const [intervals, setIntervals] = useState([
    { title: "Dynamic Hip Mobility", target: "10 min • Zone 1", done: true },
    { title: "Progressive Aerobic Build", target: "15 min @ 140 BPM", done: true },
    { title: "4 x 1,000m Lactate Repeats", target: "4 reps @ 3:42/km", done: false },
  ]);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-base">AeroPulse Athletics</span>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
          Recovery: 88% Ready
        </div>
      </header>

      <main className="py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <span className="text-xs opacity-70">Daily Strain</span>
            <div className="text-2xl font-extrabold mt-1">14.8 / 21.0</div>
          </div>
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <span className="text-xs opacity-70">Current Target BPM</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{bpm} BPM</div>
          </div>
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <span className="text-xs opacity-70">Resting Heart Rate</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">48 bpm</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Cardio Zone Spectrum</h3>
          <input
            type="range"
            min="100"
            max="195"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </main>
    </div>
  );
}`,
};
