export const templateArchitectureSpatial = {
  name: "template-architecture-spatial",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-architecture-spatial.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Layers, Sun, Building, FileText } from "lucide-react";

export default function ArchitectureSpatialTemplate() {
  const [hour, setHour] = useState(13);

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
          <Building className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-base">Arcform Spatial</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono">
          LEED Platinum • 620 m²
        </span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Solar Daylight Azimuth ({hour}:00 JST)</h3>
          <input
            type="range"
            min="8"
            max="18"
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>
      </main>
    </div>
  );
}`,
};
