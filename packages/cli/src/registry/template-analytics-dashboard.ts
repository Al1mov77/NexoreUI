export const templateAnalyticsDashboard = {
  name: "template-analytics-dashboard",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-analytics-dashboard.tsx",
  content: `"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, Users, CreditCard, ArrowUpRight, Download } from "lucide-react";

export default function AnalyticsDashboardTemplate() {
  const [dateRange, setDateRange] = useState("30D");

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-56 border-r border-white/10 p-4 shrink-0 bg-[#08090d]">
        <div className="font-bold text-sm mb-6">Prism Analytics</div>
        <nav className="space-y-1 text-xs">
          <button className="w-full text-left px-3 py-2 rounded-lg bg-emerald-600 text-white font-semibold">
            Overview
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-zinc-400 hover:text-white">
            Inflows
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Executive Telemetry</h1>
      </main>
    </div>
  );
}
`,
};
