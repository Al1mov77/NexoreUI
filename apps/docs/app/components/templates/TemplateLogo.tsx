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
import { TemplateLogoIcon } from "../../context/TemplateCustomizerContext";

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
}: {
  icon?: TemplateLogoIcon;
  className?: string;
}) {
  const IconComp = LOGO_ICONS[icon] || Sparkles;
  return <IconComp className={className} />;
}
