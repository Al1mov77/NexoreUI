export const templateHelpCenter = {
  name: "template-help-center",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-help-center.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Search, LifeBuoy, CreditCard, ShieldCheck, Code2, ChevronDown } from "lucide-react";

export default function HelpCenterTemplate() {
  const [query, setQuery] = useState("");

  const categories = [
    { title: "Getting Started", icon: LifeBuoy, count: "14 articles" },
    { title: "Billing & Invoicing", icon: CreditCard, count: "9 articles" },
    { title: "Security & 2FA", icon: ShieldCheck, count: "18 articles" },
    { title: "Developer API", icon: Code2, count: "22 articles" },
  ];

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 font-sans p-6 sm:p-12">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <span className="font-bold text-base">Resolv Support Desk</span>
        <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md">
          Submit Ticket
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-12 space-y-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold">How can our support team help you?</h1>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 opacity-50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides, 2FA, billing..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#12141c] text-xs outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="p-4 rounded-2xl border border-white/10 bg-[#12141c] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold">{c.title}</div>
                    <div className="text-[10px] text-zinc-400">{c.count}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
`,
};
