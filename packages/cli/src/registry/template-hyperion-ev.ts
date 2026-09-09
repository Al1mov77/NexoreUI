export const templateHyperionEv = {
  name: "template-hyperion-ev",
  dependencies: ["lucide-react"],
  fileName: "template-hyperion-ev.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Car, BatteryCharging, Zap, Gauge } from "lucide-react";

export default function HyperionEvTemplate() {
  const [soc, setSoc] = useState(74);

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
          <Car className="w-5 h-5 text-cyan-600" />
          <span className="font-bold text-base">Hyperion Fleet EV</span>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-600">{soc}% SoC</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-base font-bold">Hyperion Freight Hauler Max (CA-941-EV)</h2>
          <p className="text-xs opacity-75 mt-1">Usable Capacity: 210 kWh / 280 kWh • 780V Architecture</p>
        </div>
      </main>
    </div>
  );
}`,
};
