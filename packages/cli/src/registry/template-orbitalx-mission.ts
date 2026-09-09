export const templateOrbitalxMission = {
  name: "template-orbitalx-mission",
  dependencies: ["lucide-react"],
  fileName: "template-orbitalx-mission.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Satellite, Radio, Compass, Zap, Terminal } from "lucide-react";

export default function OrbitalXTemplate() {
  const [armed, setArmed] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-mono max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b font-sans" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-base">OrbitalX Operations</span>
        </div>
        <span className="text-xs font-mono text-emerald-500 font-bold">AOS in 04m 12s</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs opacity-60">ORBITAL VELOCITY: 7.58 km/s • LEO 545 km</div>
          <h2 className="text-base font-bold font-sans mt-1">AstraConstellation-07 (NORAD 58210)</h2>
          <p className="text-xs opacity-75 mt-2">Propellant: 78.4% Hydrazine • Solar: 1,420 W Nominal</p>
        </div>
      </main>
    </div>
  );
}`,
};
