export const templateScholarisArchive = {
  name: "template-scholaris-archive",
  dependencies: ["lucide-react"],
  fileName: "template-scholaris-archive.tsx",
  content: `"use client";

import React, { useState } from "react";
import { BookOpen, FileText, Download, Award } from "lucide-react";

export default function ScholarisArchiveTemplate() {
  const [copied, setCopied] = useState(false);

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
          <BookOpen className="w-5 h-5 text-sky-600" />
          <span className="font-bold text-base">Scholaris Archive</span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">Reproducibility: 9.8/10</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs text-sky-600 font-mono font-bold mb-1">DOI: 10.1038/s41586-026-09214-x</div>
          <h2 className="text-base font-bold">Sub-Quadratic Attention via Orthogonal State Space Projections</h2>
          <p className="text-xs opacity-75 mt-2">Dr. Evelyn Zhao (Stanford) • Prof. Kenneth Sterling (MIT)</p>
        </div>
      </main>
    </div>
  );
}`,
};
