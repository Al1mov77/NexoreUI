export const templateAiChat = {
  name: "template-ai-chat",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-ai-chat.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Send, Cpu, Copy, Check } from "lucide-react";

export default function AiChatTemplate() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex p-4 font-sans">
      <div className="flex-1">Cortex AI Assistant</div>
    </div>
  );
}
`,
};
