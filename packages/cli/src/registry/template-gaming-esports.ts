export const templateGamingEsports = {
  name: "template-gaming-esports",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-gaming-esports.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Trophy, Tv, Users, Target, Crown } from "lucide-react";

export default function GamingEsportsTemplate() {
  const [votes, setVotes] = useState(64);

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
          <Trophy className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-base">Valkyrie Esports</span>
        </div>
        <span className="text-xs font-bold text-rose-500 font-mono">LIVE • 284k Viewers</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="font-extrabold text-lg">Sentinels (11)</div>
          <div className="font-mono text-xs opacity-60">Map 5 Inferno</div>
          <div className="font-extrabold text-lg">Cloud9 (9)</div>
        </div>
      </main>
    </div>
  );
}`,
};
