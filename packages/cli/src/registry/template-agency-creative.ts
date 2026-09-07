export const templateAgencyCreative = {
  name: "template-agency-creative",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-agency-creative.tsx",
  content: `"use client";

import React from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function AgencyCreativeTemplate() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 p-8 font-sans">
      <h1 className="text-6xl font-black uppercase">Vanguard Digital</h1>
    </div>
  );
}
`,
};
