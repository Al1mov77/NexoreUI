export const templateAurasolaceSanctuary = {
  name: "template-aurasolace-sanctuary",
  dependencies: ["lucide-react"],
  fileName: "template-aurasolace-sanctuary.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Heart, Wind, Volume2, Sparkles } from "lucide-react";

export default function AuraSolaceTemplate() {
  const [phase, setPhase] = useState("Inhale (4s)");

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
          <Heart className="w-5 h-5 text-teal-600" />
          <span className="font-bold text-base">AuraSolace Sanctuary</span>
        </div>
        <span className="text-xs font-semibold text-teal-600">Peaceful Grounded</span>
      </header>

      <main className="py-8 space-y-6 text-center">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="w-32 h-32 rounded-full border-2 border-teal-500 mx-auto flex items-center justify-center font-bold text-xs text-teal-600">
            {phase}
          </div>
          <h2 className="text-base font-bold mt-4">Parasympathetic Nervous System Regulation</h2>
        </div>
      </main>
    </div>
  );
}`,
};
