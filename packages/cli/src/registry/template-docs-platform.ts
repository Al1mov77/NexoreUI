export const templateDocsPlatform = {
  name: "template-docs-platform",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-docs-platform.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Search, Code2, Send } from "lucide-react";

export default function DocsPlatformTemplate() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 p-6">
      <h1 className="text-3xl font-bold">Codex Documentation</h1>
    </div>
  );
}
`,
};
