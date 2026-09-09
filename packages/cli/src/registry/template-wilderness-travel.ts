export const templateWildernessTravel = {
  name: "template-wilderness-travel",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-wilderness-travel.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Compass, Mountain, Scale, Radio, Tent } from "lucide-react";

export default function WildernessTravelTemplate() {
  const [baseWeight, setBaseWeight] = useState(6.4);
  const [foodDays, setFoodDays] = useState(6);
  const totalWeight = (baseWeight + foodDays * 0.75 + 2.0).toFixed(1);

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
          <Compass className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-base">NomadRoute Expeditions</span>
        </div>
        <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600">
          Reserve Permits
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-xl font-extrabold mb-1">Patagonia High Icefield Crossing</h2>
          <p className="text-xs opacity-70">148 km • +6,850m Cumulative Gain • 8 Days</p>
        </div>

        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Skin-Out Pack Weight: {totalWeight} kg</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">Ultralight Load</span>
          </div>
          <input
            type="range"
            min="4.0"
            max="12.0"
            step="0.2"
            value={baseWeight}
            onChange={(e) => setBaseWeight(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </main>
    </div>
  );
}`,
};
