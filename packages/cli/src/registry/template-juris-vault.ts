export const templateJurisVault = {
  name: "template-juris-vault",
  dependencies: ["lucide-react"],
  fileName: "template-juris-vault.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Scale, FileText, CheckCircle2, AlertTriangle, PenTool } from "lucide-react";

export default function JurisVaultTemplate() {
  const [signed, setSigned] = useState(false);

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
          <Scale className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-base">JurisVault AI</span>
        </div>
        <button
          onClick={() => setSigned(true)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 transition-opacity hover:opacity-90"
        >
          {signed ? "Executed & Signed" : "Approve & E-Sign"}
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs text-rose-600 font-bold mb-1">CRITICAL RISK • SEC-8.2</div>
          <h2 className="text-base font-bold">Limitation of Liability & Consequential Damages</h2>
          <p className="text-xs opacity-70 mt-2">Counterparty proposes uncapped liability. Recommended: Insert 2x ACV fallback clause.</p>
        </div>
      </main>
    </div>
  );
}`,
};
