export const templateMiseenplaceKds = {
  name: "template-miseenplace-kds",
  dependencies: ["lucide-react"],
  fileName: "template-miseenplace-kds.tsx",
  content: `"use client";

import React, { useState } from "react";
import { UtensilsCrossed, Flame, Clock, Check } from "lucide-react";

export default function MiseEnPlaceTemplate() {
  const [bumped, setBumped] = useState(false);

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
          <UtensilsCrossed className="w-5 h-5 text-orange-600" />
          <span className="font-bold text-base">MiseEnPlace KDS</span>
        </div>
        <span className="text-xs font-mono font-bold text-orange-600">3 ACTIVE ORDERS</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs font-mono font-bold text-rose-600 mb-1">TABLE 12 • 04:15 ELAPSED</div>
          <h2 className="text-base font-bold">2x 45-Day Dry Aged Ribeye (Med-Rare)</h2>
          <p className="text-xs opacity-75 mt-1">Station: GRILL • Extra flaky Maldon salt</p>
          <button
            onClick={() => setBumped(true)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 transition-opacity hover:opacity-90"
          >
            {bumped ? "Order Bumped" : "Bump Order"}
          </button>
        </div>
      </main>
    </div>
  );
}`,
};
