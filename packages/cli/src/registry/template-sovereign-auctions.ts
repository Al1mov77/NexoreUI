export const templateSovereignAuctions = {
  name: "template-sovereign-auctions",
  dependencies: ["lucide-react"],
  fileName: "template-sovereign-auctions.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Gavel, ShieldCheck, DollarSign, Award } from "lucide-react";

export default function SovereignAuctionsTemplate() {
  const [bid, setBid] = useState(2450000);

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
          <Gavel className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-base">Sovereign Auctions</span>
        </div>
        <span className="text-xs font-mono font-bold text-amber-600">\${bid.toLocaleString()}</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs opacity-60">LOT 24 • EVENING SALE LONDON</div>
          <h2 className="text-base font-bold mt-1">Composition in Cadmium & Cobalt Resonance, 1988</h2>
          <button
            onClick={() => setBid(bid + 50000)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 transition-opacity hover:opacity-90"
          >
            Raise Bid +$50,000
          </button>
        </div>
      </main>
    </div>
  );
}`,
};
