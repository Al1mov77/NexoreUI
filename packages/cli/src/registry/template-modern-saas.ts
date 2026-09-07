export const templateModernSaas = {
  name: "template-modern-saas",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-modern-saas.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Command, Search, GitBranch, CheckCircle2, ArrowUpRight, ChevronRight, Zap } from "lucide-react";

export default function ModernSaasTemplate() {
  const [activeTab, setActiveTab] = useState<"branch" | "edge" | "telemetry">("branch");

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 font-sans">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090b10]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-sm">Aura Cloud</span>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium">
            Console
          </button>
        </div>
      </header>

      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-5">
          <GitBranch className="h-3 w-3" />
          <span>Continuous Edge Infrastructure</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
          The Developer Cloud for Ultra-Fast Teams.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-10">
          Push code, spawn instant ephemeral preview environments, and deploy across 300 global edge locations
          with zero configuration.
        </p>
      </section>
    </div>
  );
}
`,
};
