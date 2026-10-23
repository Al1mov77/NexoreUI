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
  let showLogo = true;
  let logoFit: "cover" | "contain" = "cover";
  let logoScale = 1;

  try {
    const ctx = useTemplateCustomizer();
    contextLogoUrl = ctx.config?.customLogoUrl;
    if (ctx.config?.showLogo !== undefined) {
      showLogo = ctx.config.showLogo;
    }
    if (ctx.config?.logoFit) {
      logoFit = ctx.config.logoFit;
    }
    if (ctx.config?.logoScale) {
      logoScale = ctx.config.logoScale;
    }
  } catch {
    /* Fallback gracefully if used outside provider */
  }

  const markerRef = React.useRef<HTMLElement | null>(null);

  /* Manage parent container visibility and edge-to-edge clipping for avatars */
  React.useEffect(() => {
    const el = markerRef.current;
    if (!el || !el.parentElement) return;
    const parent = el.parentElement;

    if (!showLogo) {
      parent.style.setProperty("display", "none", "important");
    } else {
      parent.style.removeProperty("display");
      if (customLogoUrl || contextLogoUrl) {
        parent.style.overflow = "hidden";
      }
    }

    return () => {
      parent.style.removeProperty("display");
    };
  }, [showLogo, customLogoUrl, contextLogoUrl]);

  if (!showLogo) {
    return <span ref={markerRef as any} className="hidden" aria-hidden="true" />;
  }

  const effectiveLogoUrl = customLogoUrl || contextLogoUrl;

  if (effectiveLogoUrl) {
    return (
      <img
        ref={markerRef as any}
        src={effectiveLogoUrl}
        alt="Brand Logo"
        className={`w-full h-full shrink-0 rounded-[inherit] inline-block ${
          logoFit === "contain" ? "object-contain p-1" : "object-cover"
        }`}
        style={{
          transform: logoScale !== 1 ? `scale(${logoScale})` : undefined,
        }}
      />
    );
  }

  const IconComp = LOGO_ICONS[icon] || Sparkles;
  return (
    <span ref={markerRef as any} className="inline-flex items-center justify-center">
      <IconComp className={className} />
    </span>
  );
}
