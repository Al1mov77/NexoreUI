export const templateCreativePortfolio = {
  name: "template-creative-portfolio",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-creative-portfolio.tsx",
  content: `"use client";

import React from "react";
import { ArrowUpRight, Award, X } from "lucide-react";

export default function CreativePortfolioTemplate() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-serif p-8">
      <header className="flex justify-between items-center mb-16 font-sans">
        <span className="font-bold uppercase tracking-tight">Studio Monolith</span>
      </header>
      <h1 className="text-5xl font-light leading-tight mb-12">
        Sculpting singular digital experiences for luxury institutions.
      </h1>
    </div>
  );
}
`,
};
