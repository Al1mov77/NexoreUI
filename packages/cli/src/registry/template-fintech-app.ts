export const templateFintechApp = {
  name: "template-fintech-app",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-fintech-app.tsx",
  content: `"use client";

import React, { useState } from "react";
import { CreditCard, Send, Lock, Unlock, ShieldCheck } from "lucide-react";

export default function FintechAppTemplate() {
  const [frozen, setFrozen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans p-6">
      <h1 className="text-2xl font-bold mb-4">Apex Treasury</h1>
    </div>
  );
}
`,
};
