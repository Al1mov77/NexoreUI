"use client";

import React from "react";
import SwaggerFormBuilder from "../sources/SwaggerFormBuilder";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

export function SwaggerFormBuilderPreview() {
  const { config: customizerConfig } = useTemplateCustomizer();
  const theme = (customizerConfig?.theme === "light" ? "light" : "dark") as "light" | "dark";

  return <SwaggerFormBuilder theme={theme} />;
}
