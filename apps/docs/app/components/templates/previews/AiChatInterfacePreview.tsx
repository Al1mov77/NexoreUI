"use client";

import React from "react";
import AiChatInterface from "../sources/AiChatInterface";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

export function AiChatInterfacePreview() {
  const { config: customizerConfig, deviceMode } = useTemplateCustomizer();
  const theme = (customizerConfig?.theme === "light" ? "light" : "dark") as "light" | "dark";

  return (
    <div className="w-full h-full min-h-[640px] flex flex-col flex-1">
      <AiChatInterface theme={theme} deviceMode={deviceMode} className="w-full h-full flex-1" />
    </div>
  );
}
