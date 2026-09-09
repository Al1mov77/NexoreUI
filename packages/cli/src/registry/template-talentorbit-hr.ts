export const templateTalentorbitHr = {
  name: "template-talentorbit-hr",
  dependencies: ["lucide-react"],
  fileName: "template-talentorbit-hr.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Users, Calendar, Award, MapPin } from "lucide-react";

export default function TalentOrbitTemplate() {
  const [ptoDays, setPtoDays] = useState(18);

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
          <Users className="w-5 h-5 text-violet-600" />
          <span className="font-bold text-base">TalentOrbit HR</span>
        </div>
        <span className="text-xs font-semibold text-violet-600">{ptoDays} Days PTO Left</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-base font-bold">Sophia Lindqvist • VP of Engineering</h2>
          <p className="text-xs opacity-70 mt-1">Stockholm (UTC+1) • 24 Direct Reports • Top Performer (9-Box 1A)</p>
        </div>
      </main>
    </div>
  );
}`,
};
