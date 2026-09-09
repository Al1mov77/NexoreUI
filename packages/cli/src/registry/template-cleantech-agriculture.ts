export const templateCleantechAgriculture = {
  name: "template-cleantech-agriculture",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-cleantech-agriculture.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Sprout, Droplets, Sun, Wind, Leaf } from "lucide-react";

export default function CleantechAgricultureTemplate() {
  const [ph, setPh] = useState(6.2);
  const [red, setRed] = useState(65);

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
          <Sprout className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-base">Verdant IoT</span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">98.4% Water Recycled</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Hydroponic pH Level: {ph}</h3>
          <input
            type="range"
            min="5.5"
            max="7.0"
            step="0.1"
            value={ph}
            onChange={(e) => setPh(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </main>
    </div>
  );
}`,
};
