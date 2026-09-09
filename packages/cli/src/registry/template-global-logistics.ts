export const templateGlobalLogistics = {
  name: "template-global-logistics",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-global-logistics.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Ship, Truck, Thermometer, Anchor, Navigation } from "lucide-react";

export default function GlobalLogisticsTemplate() {
  const [activeStage, setActiveStage] = useState(2);

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
          <Anchor className="w-5 h-5 text-cyan-600" />
          <span className="font-bold text-base">Vanguard Logistics</span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">14 Vessels Active</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <span className="text-xs font-mono opacity-60">MASTER BILL OF LADING</span>
          <h2 className="text-xl font-extrabold font-mono mt-1">BOL-849204-HKG</h2>
          <p className="text-xs opacity-70 mt-1">Shenzhen (YTN) &rarr; Rotterdam Gateway (RTM)</p>
        </div>
      </main>
    </div>
  );
}`,
};
