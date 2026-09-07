export const templateDevtoolsCli = {
  name: "template-devtools-cli",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-devtools-cli.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Star } from "lucide-react";

export default function DevtoolsCliTemplate() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen bg-[#090a10] text-zinc-100 font-mono p-6">
      <header className="flex justify-between items-center mb-12">
        <span className="font-bold text-sm">HyperTerminal</span>
      </header>
    </div>
  );
}
`,
};
