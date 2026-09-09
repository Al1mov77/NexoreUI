"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export type TemplateColorPreset =
  | "indigo"
  | "violet"
  | "emerald"
  | "rose"
  | "amber"
  | "cyan"
  | "orange"
  | "blue"
  | "custom";

export type TemplateFontFamily =
  | "Inter"
  | "Geist"
  | "Manrope"
  | "DM Sans"
  | "Plus Jakarta Sans"
  | "Space Grotesk";

export type TemplateRadius = "sharp" | "small" | "medium" | "large" | "full";
export type TemplateDensity = "compact" | "normal" | "relaxed";
export type TemplateMotion = "reduced" | "normal" | "expressive";
export type TemplateStyle = "minimal" | "modern" | "bold";
export type TemplateLogoIcon =
  | "sparkles"
  | "zap"
  | "box"
  | "terminal"
  | "shield"
  | "compass"
  | "layers"
  | "cpu"
  | "flame"
  | "activity";

export type TemplateLogoBadgeStyle = "default" | "circle" | "squircle" | "glow" | "minimal";
export type TemplateBackgroundEffect = "none" | "grid" | "dots" | "glow";
export type TemplateCardSurface = "default" | "glass" | "bordered" | "elevated";
export type TemplateFontScale = "compact" | "normal" | "spacious";

export type DeviceMode = "desktop" | "tablet" | "mobile";

export interface ColorPresetConfig {
  id: TemplateColorPreset;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  primaryRgb: string;
}

export const TEMPLATE_COLOR_PRESETS: Record<TemplateColorPreset, ColorPresetConfig> = {
  indigo: {
    id: "indigo",
    label: "Indigo",
    primary: "#4f46e5",
    secondary: "#6366f1",
    accent: "#0284c7",
    primaryRgb: "79, 70, 229",
  },
  blue: {
    id: "blue",
    label: "Ocean",
    primary: "#2563eb",
    secondary: "#3b82f6",
    accent: "#0d9488",
    primaryRgb: "37, 99, 235",
  },
  emerald: {
    id: "emerald",
    label: "Forest",
    primary: "#059669",
    secondary: "#10b981",
    accent: "#d97706",
    primaryRgb: "5, 150, 105",
  },
  violet: {
    id: "violet",
    label: "Alpine",
    primary: "#7c3aed",
    secondary: "#8b5cf6",
    accent: "#db2777",
    primaryRgb: "124, 58, 237",
  },
  rose: {
    id: "rose",
    label: "Rose",
    primary: "#e11d48",
    secondary: "#f43f5e",
    accent: "#9333ea",
    primaryRgb: "225, 29, 72",
  },
  orange: {
    id: "orange",
    label: "Sunset",
    primary: "#ea580c",
    secondary: "#f97316",
    accent: "#d97706",
    primaryRgb: "234, 88, 12",
  },
  cyan: {
    id: "cyan",
    label: "Slate",
    primary: "#0f766e",
    secondary: "#0d9488",
    accent: "#0284c7",
    primaryRgb: "15, 118, 110",
  },
  amber: {
    id: "amber",
    label: "Stone",
    primary: "#78716c",
    secondary: "#57534e",
    accent: "#292524",
    primaryRgb: "120, 113, 108",
  },
  custom: {
    id: "custom",
    label: "Custom Palette",
    primary: "#4f46e5",
    secondary: "#6366f1",
    accent: "#0284c7",
    primaryRgb: "79, 70, 229",
  },
};

export const RADIUS_VALUES: Record<TemplateRadius, string> = {
  sharp: "0px",
  small: "6px",
  medium: "10px",
  large: "16px",
  full: "9999px",
};

export const FONT_OPTIONS: { id: TemplateFontFamily; label: string; sample: string; googleFont: string }[] = [
  { id: "Inter", label: "Inter", sample: "Clean, neutral, highly legible modern sans", googleFont: "Inter:wght@400;500;600;700;800" },
  { id: "Geist", label: "Geist Sans", sample: "Precision developer tool typeface by Vercel", googleFont: "Geist:wght@400;500;600;700;800" },
  { id: "Manrope", label: "Manrope", sample: "Geometric semi-rounded modern neo-grotesque", googleFont: "Manrope:wght@400;500;600;700;800" },
  { id: "DM Sans", label: "DM Sans", sample: "Low-contrast geometric sans for high clarity", googleFont: "DM+Sans:wght@400;500;700" },
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans", sample: "Warm, contemporary grotesque with personality", googleFont: "Plus+Jakarta+Sans:wght@400;500;600;700;800" },
  { id: "Space Grotesk", label: "Space Grotesk", sample: "Futuristic tech aesthetic with distinctive glyphs", googleFont: "Space+Grotesk:wght@400;500;600;700" },
];

export interface CuratedStylePreset {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  config: Partial<TemplateConfig>;
}

export const CURATED_STYLE_PRESETS: CuratedStylePreset[] = [
  {
    id: "cyber-matrix",
    name: "Cyber Matrix",
    tagline: "High-tech terminal vibes with sharp precision",
    badge: "CYBER",
    config: {
      colors: {
        presetId: "cyan",
        primary: "#06b6d4",
        secondary: "#0ea5e9",
        accent: "#3b82f6",
      },
      typography: {
        fontFamily: "Space Grotesk",
        headingFont: "Space Grotesk",
        scale: "normal",
      },
      ui: {
        radius: "sharp",
        density: "compact",
        style: "bold",
        cardSurface: "glass",
      },
      effects: {
        backgroundEffect: "grid",
        glowIntensity: "vibrant",
      },
      theme: "dark",
      motion: "expressive",
    },
  },
  {
    id: "nordic-clean",
    name: "Nordic Clean",
    tagline: "Organic forest hues, smooth corners & generous space",
    badge: "MINIMAL",
    config: {
      colors: {
        presetId: "emerald",
        primary: "#10b981",
        secondary: "#059669",
        accent: "#047857",
      },
      typography: {
        fontFamily: "Inter",
        headingFont: "Plus Jakarta Sans",
        scale: "normal",
      },
      ui: {
        radius: "large",
        density: "relaxed",
        style: "minimal",
        cardSurface: "default",
      },
      effects: {
        backgroundEffect: "none",
        glowIntensity: "none",
      },
      motion: "normal",
    },
  },
  {
    id: "sunset-velvet",
    name: "Sunset Velvet",
    tagline: "Warm amber glow with sleek fluid neo-grotesque",
    badge: "WARM",
    config: {
      colors: {
        presetId: "orange",
        primary: "#f97316",
        secondary: "#fb923c",
        accent: "#f43f5e",
      },
      typography: {
        fontFamily: "Manrope",
        headingFont: "Plus Jakarta Sans",
        scale: "normal",
      },
      ui: {
        radius: "medium",
        density: "normal",
        style: "modern",
        cardSurface: "glass",
      },
      effects: {
        backgroundEffect: "glow",
        glowIntensity: "vibrant",
      },
      motion: "expressive",
    },
  },
  {
    id: "enterprise-trust",
    name: "Enterprise Trust",
    tagline: "High-credibility sapphire blue for scale and clarity",
    badge: "CORP",
    config: {
      colors: {
        presetId: "blue",
        primary: "#2563eb",
        secondary: "#3b82f6",
        accent: "#0284c7",
      },
      typography: {
        fontFamily: "Inter",
        headingFont: "Inter",
        scale: "compact",
      },
      ui: {
        radius: "small",
        density: "compact",
        style: "modern",
        cardSurface: "bordered",
      },
      effects: {
        backgroundEffect: "none",
        glowIntensity: "none",
      },
      motion: "reduced",
    },
  },
  {
    id: "violet-aurora",
    name: "Violet Aurora",
    tagline: "Futuristic purple neon with frosted glass glow",
    badge: "GLOW",
    config: {
      colors: {
        presetId: "violet",
        primary: "#8b5cf6",
        secondary: "#a78bfa",
        accent: "#ec4899",
      },
      typography: {
        fontFamily: "Geist",
        headingFont: "Space Grotesk",
        scale: "normal",
      },
      ui: {
        radius: "large",
        density: "normal",
        style: "modern",
        cardSurface: "glass",
      },
      effects: {
        backgroundEffect: "dots",
        glowIntensity: "vibrant",
      },
      theme: "dark",
      motion: "expressive",
    },
  },
];

export interface TemplateConfig {
  brandName: string;
  brandTagline?: string;
  ctaText?: string;
  logoIcon: TemplateLogoIcon;
  customLogoUrl?: string; // base64 data URL or external image URL
  logoBadgeStyle?: TemplateLogoBadgeStyle;
  colors: {
    presetId: TemplateColorPreset;
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    fontFamily: TemplateFontFamily;
    headingFont: TemplateFontFamily;
    scale?: TemplateFontScale;
  };
  ui: {
    radius: TemplateRadius;
    density: TemplateDensity;
    style: TemplateStyle;
    cardSurface?: TemplateCardSurface;
  };
  effects: {
    backgroundEffect: TemplateBackgroundEffect;
    glowIntensity: "none" | "subtle" | "vibrant";
  };
  theme: "light" | "dark";
  motion: TemplateMotion;
}

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  brandName: "",
  brandTagline: "",
  ctaText: "",
  logoIcon: "sparkles",
  customLogoUrl: "",
  logoBadgeStyle: "default",
  colors: {
    presetId: "indigo",
    primary: "#4f46e5",
    secondary: "#6366f1",
    accent: "#0284c7",
  },
  typography: {
    fontFamily: "Inter",
    headingFont: "Plus Jakarta Sans",
    scale: "normal",
  },
  ui: {
    radius: "medium",
    density: "normal",
    style: "modern",
    cardSurface: "default",
  },
  effects: {
    backgroundEffect: "none",
    glowIntensity: "subtle",
  },
  theme: "dark",
  motion: "normal",
};

// Helper: hex to RGB triplet
export function hexToRgb(hex: string): string {
  const cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return "79, 70, 229";
}

interface TemplateCustomizerContextType {
  config: TemplateConfig;
  updateConfig: (partial: Partial<TemplateConfig> | ((prev: TemplateConfig) => TemplateConfig)) => void;
  setColorPreset: (presetId: TemplateColorPreset) => void;
  setCustomPrimaryColor: (hex: string) => void;
  setCustomLogoUrl: (url: string) => void;
  removeCustomLogo: () => void;
  applyStylePreset: (presetId: string) => void;
  randomizeConfig: () => void;
  exportConfigJson: () => string;
  importConfigJson: (jsonStr: string) => boolean;
  resetToTemplateDefaults: (templateId: string, initialBrandName?: string) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  cssVariables: React.CSSProperties;
}

const TemplateCustomizerContext = createContext<TemplateCustomizerContextType | undefined>(undefined);

export function TemplateCustomizerProvider({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig?: Partial<TemplateConfig>;
}) {
  const [config, setConfig] = useState<TemplateConfig>(() => ({
    ...DEFAULT_TEMPLATE_CONFIG,
    ...initialConfig,
    colors: { ...DEFAULT_TEMPLATE_CONFIG.colors, ...(initialConfig?.colors || {}) },
    typography: { ...DEFAULT_TEMPLATE_CONFIG.typography, ...(initialConfig?.typography || {}) },
    ui: { ...DEFAULT_TEMPLATE_CONFIG.ui, ...(initialConfig?.ui || {}) },
    effects: { ...DEFAULT_TEMPLATE_CONFIG.effects, ...(initialConfig?.effects || {}) },
  }));
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");

  const updateConfig = (
    partial: Partial<TemplateConfig> | ((prev: TemplateConfig) => TemplateConfig)
  ) => {
    if (typeof partial === "function") {
      setConfig((prev) => partial(prev));
    } else {
      setConfig((prev) => ({
        ...prev,
        ...partial,
        colors: { ...prev.colors, ...(partial.colors || {}) },
        typography: { ...prev.typography, ...(partial.typography || {}) },
        ui: { ...prev.ui, ...(partial.ui || {}) },
        effects: { ...prev.effects, ...(partial.effects || {}) },
      }));
    }
  };

  const setColorPreset = (presetId: TemplateColorPreset) => {
    const preset = TEMPLATE_COLOR_PRESETS[presetId];
    if (preset) {
      setConfig((prev) => ({
        ...prev,
        colors: {
          presetId,
          primary: preset.primary,
          secondary: preset.secondary,
          accent: preset.accent,
        },
      }));
    }
  };

  const setCustomPrimaryColor = (hex: string) => {
    setConfig((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        presetId: "custom",
        primary: hex,
      },
    }));
  };

  const setCustomLogoUrl = (url: string) => {
    setConfig((prev) => ({
      ...prev,
      customLogoUrl: url,
    }));
  };

  const removeCustomLogo = () => {
    setConfig((prev) => ({
      ...prev,
      customLogoUrl: "",
    }));
  };

  const applyStylePreset = (presetId: string) => {
    const preset = CURATED_STYLE_PRESETS.find((p) => p.id === presetId);
    if (preset && preset.config) {
      setConfig((prev) => ({
        ...prev,
        ...preset.config,
        colors: { ...prev.colors, ...(preset.config.colors || {}) },
        typography: { ...prev.typography, ...(preset.config.typography || {}) },
        ui: { ...prev.ui, ...(preset.config.ui || {}) },
        effects: { ...prev.effects, ...(preset.config.effects || {}) },
      }));
    }
  };

  const randomizeConfig = () => {
    const presets: TemplateColorPreset[] = ["indigo", "violet", "emerald", "rose", "orange", "blue", "cyan"];
    const fonts: TemplateFontFamily[] = ["Inter", "Geist", "Manrope", "DM Sans", "Plus Jakarta Sans", "Space Grotesk"];
    const radiuses: TemplateRadius[] = ["sharp", "small", "medium", "large", "full"];
    const bgEffects: TemplateBackgroundEffect[] = ["none", "grid", "dots", "glow"];

    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    const randomHeadingFont = fonts[Math.floor(Math.random() * fonts.length)];
    const randomRadius = radiuses[Math.floor(Math.random() * radiuses.length)];
    const randomBgEffect = bgEffects[Math.floor(Math.random() * bgEffects.length)];

    const colorConfig = TEMPLATE_COLOR_PRESETS[randomPreset];

    setConfig((prev) => ({
      ...prev,
      colors: {
        presetId: randomPreset,
        primary: colorConfig.primary,
        secondary: colorConfig.secondary,
        accent: colorConfig.accent,
      },
      typography: {
        ...prev.typography,
        fontFamily: randomFont,
        headingFont: randomHeadingFont,
      },
      ui: {
        ...prev.ui,
        radius: randomRadius,
      },
      effects: {
        ...prev.effects,
        backgroundEffect: randomBgEffect,
        glowIntensity: Math.random() > 0.5 ? "vibrant" : "subtle",
      },
    }));
  };

  const exportConfigJson = (): string => {
    return JSON.stringify(config, null, 2);
  };

  const importConfigJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === "object") {
        setConfig((prev) => ({
          ...prev,
          ...parsed,
          colors: { ...prev.colors, ...(parsed.colors || {}) },
          typography: { ...prev.typography, ...(parsed.typography || {}) },
          ui: { ...prev.ui, ...(parsed.ui || {}) },
          effects: { ...prev.effects, ...(parsed.effects || {}) },
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetToTemplateDefaults = (templateId: string, initialBrandName?: string) => {
    setConfig({
      ...DEFAULT_TEMPLATE_CONFIG,
      brandName: initialBrandName || "",
      customLogoUrl: "",
    });
  };

  // Google Fonts dynamic injector
  useEffect(() => {
    const fontsToLoad = new Set<string>();
    const bodyFont = FONT_OPTIONS.find((f) => f.id === config.typography.fontFamily);
    const headingFont = FONT_OPTIONS.find((f) => f.id === config.typography.headingFont);

    if (bodyFont) fontsToLoad.add(bodyFont.googleFont);
    if (headingFont) fontsToLoad.add(headingFont.googleFont);

    fontsToLoad.forEach((gf) => {
      const linkId = `google-font-${gf.replace(/[^a-zA-Z0-9]/g, "-")}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${gf}&display=swap`;
        document.head.appendChild(link);
      }
    });
  }, [config.typography.fontFamily, config.typography.headingFont]);

  // Compute CSS Variables object for real-time consumption
  const cssVariables = useMemo(() => {
    const isDark = config.theme === "dark";
    const primaryRgb = hexToRgb(config.colors.primary);
    const resolvedRadius = RADIUS_VALUES[config.ui.radius];

    const densityMultiplier =
      config.ui.density === "compact" ? "0.85" : config.ui.density === "relaxed" ? "1.2" : "1";
    const densitySpacing =
      config.ui.density === "compact" ? "0.85rem" : config.ui.density === "relaxed" ? "1.2rem" : "1rem";

    const motionFactor =
      config.motion === "reduced" ? "0" : config.motion === "expressive" ? "1.4" : "1";

    // Compute background pattern
    const bgEffect = config.effects?.backgroundEffect || "none";
    let bgPattern = "none";
    let bgSize = "auto";
    if (bgEffect === "grid") {
      bgPattern = isDark
        ? `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`
        : `linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`;
      bgSize = "32px 32px";
    } else if (bgEffect === "dots") {
      bgPattern = isDark
        ? `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)`
        : `radial-gradient(rgba(0, 0, 0, 0.12) 1px, transparent 1px)`;
      bgSize = "20px 20px";
    } else if (bgEffect === "glow") {
      const glowAlpha = config.effects?.glowIntensity === "vibrant" ? "0.22" : "0.12";
      bgPattern = `radial-gradient(circle at 50% 20%, rgba(${primaryRgb}, ${isDark ? glowAlpha : "0.08"}) 0%, transparent 60%)`;
      bgSize = "100% 100%";
    }

    const fontScale =
      config.typography.scale === "compact" ? "92%" : config.typography.scale === "spacious" ? "108%" : "100%";

    return {
      "--template-primary": config.colors.primary,
      "--template-primary-rgb": primaryRgb,
      "--template-secondary": config.colors.secondary,
      "--template-accent": config.colors.accent,
      "--template-font": `'${config.typography.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      "--template-heading-font": `'${config.typography.headingFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      "--template-radius": resolvedRadius,
      "--template-density": densityMultiplier,
      "--template-spacing": densitySpacing,
      "--template-motion": motionFactor,
      "--template-bg-pattern": bgPattern,
      "--template-bg-size": bgSize,
      "--template-font-size-scale": fontScale,

      // Semantic tokens for Light & Dark mode
      "--template-bg": isDark ? "#090a0f" : "#ffffff",
      "--template-surface": isDark ? "#12141c" : "#f8f9fa",
      "--template-surface-elevated": isDark ? "#181a24" : "#ffffff",
      "--template-surface-muted": isDark ? "#161822" : "#f1f3f5",
      "--template-surface-highlight": isDark ? "#1e212d" : "#e9ecef",
      "--template-border": isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
      "--template-border-subtle": isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
      "--template-border-hover": isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.16)",
      "--template-fg": isDark ? "#f4f4f7" : "#0f172a",
      "--template-fg-muted": isDark ? "#9aa0aa" : "#475569",
      "--template-fg-subtle": isDark ? "#636975" : "#94a3b8",
      "--template-muted": isDark ? "#161822" : "#f1f3f5",
      "--template-muted-fg": isDark ? "#9aa0aa" : "#475569",
      "--template-card-shadow": isDark
        ? "0 4px 20px -2px rgba(0, 0, 0, 0.5)"
        : "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
      "--template-card-shadow-elevated": isDark
        ? "0 10px 30px -4px rgba(0, 0, 0, 0.7)"
        : "0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
    } as React.CSSProperties;
  }, [config]);

  return (
    <TemplateCustomizerContext.Provider
      value={{
        config,
        updateConfig,
        setColorPreset,
        setCustomPrimaryColor,
        setCustomLogoUrl,
        removeCustomLogo,
        applyStylePreset,
        randomizeConfig,
        exportConfigJson,
        importConfigJson,
        resetToTemplateDefaults,
        deviceMode,
        setDeviceMode,
        cssVariables,
      }}
    >
      {children}
    </TemplateCustomizerContext.Provider>
  );
}

export function useTemplateCustomizer() {
  const context = useContext(TemplateCustomizerContext);
  if (!context) {
    throw new Error("useTemplateCustomizer must be used within a TemplateCustomizerProvider");
  }
  return context;
}
