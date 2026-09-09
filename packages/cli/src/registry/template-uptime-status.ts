export const templateUptimeStatus = {
  name: "template-uptime-status",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-uptime-status.tsx",
  content: `"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Server, Bell, Globe } from "lucide-react";

export default function UptimeStatusTemplate() {
  const services = [
    { name: "Global Anycast Edge CDN", uptime: "100.0%", ping: "11ms" },
    { name: "Authentication Engine & SSO", uptime: "99.99%", ping: "24ms" },
    { name: "Distributed Vector Indexing", uptime: "99.97%", ping: "38ms" },
    { name: "PostgreSQL Database Clusters", uptime: "99.95%", ping: "14ms" },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans p-6 sm:p-12">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-bold text-base">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <span>Beacon Status</span>
        </div>
        <button className="px-3.5 py-1.5 rounded-xl border border-white/10 text-xs hover:bg-white/10 flex items-center gap-1.5">
          <Bell className="h-3.5 w-3.5" />
          <span>Subscribe</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-10 space-y-6">
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs text-emerald-400 font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>All Core Services Operational — 99.994% Availability</span>
          </div>
          <span className="font-mono">Past 90 Days</span>
        </div>

        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.name} className="p-4 rounded-xl border border-white/10 bg-[#12141c] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold">{s.name}</div>
                <div className="text-[10px] text-zinc-400 font-mono">Latency: {s.ping}</div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">{s.uptime}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
`,
};
