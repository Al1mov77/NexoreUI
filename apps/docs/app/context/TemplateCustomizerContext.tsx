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

export interface TemplateConfig {
  brandName: string;
  logoIcon: TemplateLogoIcon;
  colors: {
    presetId: TemplateColorPreset;
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    fontFamily: TemplateFontFamily;
    headingFont: TemplateFontFamily;
  };
  ui: {
    radius: TemplateRadius;
    density: TemplateDensity;
    style: TemplateStyle;
  };
  theme: "light" | "dark";
  motion: TemplateMotion;
}

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  brandName: "Synthetix AI",
  logoIcon: "sparkles",
  colors: {
    presetId: "indigo",
    primary: "#4f46e5",
    secondary: "#6366f1",
    accent: "#0284c7",
  },
  typography: {
    fontFamily: "Inter",
    headingFont: "Plus Jakarta Sans",
  },
  ui: {
    radius: "medium",
    density: "normal",
    style: "modern",
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

  const resetToTemplateDefaults = (templateId: string, initialBrandName?: string) => {
    setConfig({
      ...DEFAULT_TEMPLATE_CONFIG,
      brandName: initialBrandName || "Nexore",
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

      // Semantic tokens for Light & Dark mode
      // Light mode: Clean, crisp, high-contrast, premium
      // Surface hierarchy: Background (#ffffff) -> Surface (#f8f9fa) -> Surface Elevated (#ffffff with shadow) -> Surface Muted (#f1f3f5)
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
