export const templateDevopsKubernetes = {
  name: "template-devops-kubernetes",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-devops-kubernetes.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Server, Cpu, Database, Terminal, Search, SlidersHorizontal } from "lucide-react";

export default function DevopsKubernetesTemplate() {
  const [canary, setCanary] = useState(15);

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
          <Server className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-base">KubeOrbit Cloud</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-mono">
          242/248 Pods Healthy
        </span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border font-sans" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Canary Ingress Weight: {canary}%</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={canary}
            onChange={(e) => setCanary(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </main>
    </div>
  );
}`,
};
