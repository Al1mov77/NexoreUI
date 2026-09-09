export const templateCybersecuritySoc = {
  name: "template-cybersecurity-soc",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-cybersecurity-soc.tsx",
  content: `"use client";

import React, { useState } from "react";
import { ShieldAlert, Terminal, Lock, CheckCircle2 } from "lucide-react";

export default function CybersecuritySocTemplate() {
  const [quarantined, setQuarantined] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-mono max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b font-sans" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span className="font-bold text-base">Aegis SOC</span>
        </div>
        <button
          onClick={() => setQuarantined(!quarantined)}
          className={\`px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white \${quarantined ? "bg-gray-600" : "bg-rose-600"}\`}
        >
          {quarantined ? "Host Air-Gapped" : "Isolate Host"}
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs text-rose-600 font-bold mb-1">CRITICAL • MITRE T1021.002</div>
          <h2 className="text-base font-extrabold font-sans">Pass-the-Hash Lateral Movement via SMB</h2>
          <p className="text-xs opacity-70 mt-1">Target Host: srv-dc-primary-01.internal (10.240.12.8)</p>
        </div>
      </main>
    </div>
  );
}`,
};
