export const templateCineboardStudio = {
  name: "template-cineboard-studio",
  dependencies: ["lucide-react"],
  fileName: "template-cineboard-studio.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Clapperboard, Film, Camera, Video } from "lucide-react";

export default function CineBoardTemplate() {
  const [ratio, setRatio] = useState("2.39:1");

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
          <Clapperboard className="w-5 h-5 text-rose-600" />
          <span className="font-bold text-base">CineBoard Studio</span>
        </div>
        <div className="text-xs font-mono font-bold bg-rose-600/10 text-rose-600 px-2 py-1 rounded">
          Framing: {ratio}
        </div>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-base font-bold">SCENE 14A • SHOT 01 (EXT. HIGHWAY DUSK)</h2>
          <p className="text-xs opacity-75 mt-1">Cooke Anamorphic 40mm T2.3 • Drone Push-In (3.2m/s)</p>
        </div>
      </main>
    </div>
  );
}`,
};
