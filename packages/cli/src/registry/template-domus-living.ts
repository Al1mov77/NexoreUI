export const templateDomusLiving = {
  name: "template-domus-living",
  dependencies: ["lucide-react"],
  fileName: "template-domus-living.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Home, Thermometer, Sun, Zap, ShieldCheck } from "lucide-react";

export default function DomusLivingTemplate() {
  const [temp, setTemp] = useState(21.5);

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
          <Home className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-base">Domus Living</span>
        </div>
        <span className="text-xs font-semibold text-emerald-600">Perimeter Armed</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Living Pavilion Climate: {temp}°C</h3>
          <input
            type="range"
            min="18.0"
            max="26.0"
            step="0.5"
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </main>
    </div>
  );
}`,
};
