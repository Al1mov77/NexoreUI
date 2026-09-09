"use client";

import React from "react";
import {
  Sparkles,
  Zap,
  Box,
  Terminal,
  Shield,
  Compass,
  Layers,
  Cpu,
  Flame,
  Activity,
} from "lucide-react";
import { TemplateLogoIcon, useTemplateCustomizer } from "../../context/TemplateCustomizerContext";

const LOGO_ICONS: Record<TemplateLogoIcon, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  zap: Zap,
  box: Box,
  terminal: Terminal,
  shield: Shield,
  compass: Compass,
  layers: Layers,
  cpu: Cpu,
  flame: Flame,
  activity: Activity,
};

export function TemplateLogo({
  icon = "sparkles",
  className = "h-4 w-4",
  customLogoUrl,
}: {
  icon?: TemplateLogoIcon;
  className?: string;
  customLogoUrl?: string;
}) {
  let contextLogoUrl: string | undefined;
  try {
    const ctx = useTemplateCustomizer();
    contextLogoUrl = ctx.config?.customLogoUrl;
  } catch {
    // Fallback gracefully if used outside provider
  }

  const effectiveLogoUrl = customLogoUrl || contextLogoUrl;

  if (effectiveLogoUrl) {
    return (
      <img
        src={effectiveLogoUrl}
        alt="Brand Logo"
        className={`object-contain aspect-square shrink-0 rounded-[inherit] inline-block ${className}`}
      />
    );
  }

  const IconComp = LOGO_ICONS[icon] || Sparkles;
  return <IconComp className={className} />;
}
