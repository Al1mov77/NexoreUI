export const templateRealEstate = {
  name: "template-real-estate",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-real-estate.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Building2, MapPin, Calendar, Users, Check } from "lucide-react";

export default function RealEstateTemplate() {
  const [nights, setNights] = useState(4);
  const baseRate = 2450;

  return (
    <div className="min-h-screen bg-[#0c0d12] text-zinc-100 font-sans p-6 sm:p-12">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <span className="font-serif text-base uppercase tracking-widest font-light">Haven Luxury Estates</span>
        <span className="text-xs uppercase tracking-widest font-mono text-zinc-400">Aspen • Kyoto • Zurich</span>
      </header>

      <main className="max-w-5xl mx-auto py-12 space-y-8">
        <div className="space-y-3">
          <div className="text-xs font-mono text-zinc-400">Aspen Valley, Colorado • Residence #04</div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light">The Obsidian Pavilion</h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            A 9,400 sq.ft cantilevered cedar and blackened steel retreat with panoramic mountain views and private helipad.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#14161f] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-xs text-zinc-400">Nightly Rate: $2,450 USD</div>
            <div className="text-2xl font-serif font-bold mt-0.5">
              \${(baseRate * nights).toLocaleString()} USD <span className="text-xs font-sans font-normal text-zinc-400">({nights} nights)</span>
            </div>
          </div>
          <button className="px-6 py-3 rounded-xl text-xs font-serif uppercase tracking-wider font-bold bg-white text-black hover:bg-zinc-200 shadow-md">
            Reserve Residence
          </button>
        </div>
      </main>
    </div>
  );
}
`,
};
