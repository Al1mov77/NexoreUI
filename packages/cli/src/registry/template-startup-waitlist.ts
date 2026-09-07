export const templateStartupWaitlist = {
  name: "template-startup-waitlist",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-startup-waitlist.tsx",
  content: `"use client";

import React, { useState } from "react";
import { ArrowRight, Clock, Users } from "lucide-react";

export default function StartupWaitlistTemplate() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 p-8 text-center flex flex-col justify-center">
      <h1 className="text-5xl font-extrabold mb-4">Genesis Stealth</h1>
    </div>
  );
}
`,
};
