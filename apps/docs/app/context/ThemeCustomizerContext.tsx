"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SIGNATURE_THEME } from "../../lib/theme/signature";
import { FrameworkType, getFrameworkConfig } from "../../lib/create/frameworks";
export type { FrameworkType };

export type ThemeColor =
  | "indigo"
  | "violet"
  | "emerald"
  | "rose"
  | "amber"
  | "cyan"
  | "sky"
  | "slate"
  | "orange"
  | "neon"
  | "crimson";

export type RadiusValue = "0" | "0.3" | "0.5" | "0.625" | "0.75" | "1.0";
export type PackageManagerType = "pnpm" | "npm" | "yarn" | "bun";
export type FontFamilyType = "inter" | "geist" | "jetbrains" | "system";
export type DensityType = "compact" | "default" | "relaxed";
export type AnimationStyleType = "subtle" | "energetic" | "none";
export type DefaultModeType = "system" | "dark" | "light";

export interface ColorPreset {
  id: ThemeColor;
  label: string;
  primaryLight: string;
  primaryDark: string;
  ringLight: string;
  ringDark: string;
  rgb: string;
  previewHex: string;
}

export const COLOR_PRESETS: Record<ThemeColor, ColorPreset> = {
  slate: {
    id: "slate",
    label: "Slate / Zinc (Signature)",
    primaryLight: "hsl(240 5.9% 10%)",
    primaryDark: "hsl(0 0% 98%)",
    ringLight: "hsl(240 5.9% 10%)",
    ringDark: "hsl(0 0% 98%)",
    rgb: "244 244 245",
    previewHex: "#71717a",
  },
  indigo: {
    id: "indigo",
    label: "Indigo",
    primaryLight: "hsl(250 85% 50%)",
    primaryDark: "hsl(250 85% 65%)",
    ringLight: "hsl(250 85% 50%)",
    ringDark: "hsl(250 85% 65%)",
    rgb: "99 60 220",
    previewHex: "#6366f1",
  },
  violet: {
    id: "violet",
    label: "Violet",
    primaryLight: "hsl(262.1 83.3% 57.8%)",
    primaryDark: "hsl(263.4 70% 50.4%)",
    ringLight: "hsl(262.1 83.3% 57.8%)",
    ringDark: "hsl(263.4 70% 50.4%)",
    rgb: "139 92 246",
    previewHex: "#8b5cf6",
  },
  emerald: {
    id: "emerald",
    label: "Emerald",
    primaryLight: "hsl(142.1 76.2% 36.3%)",
    primaryDark: "hsl(142.1 70.6% 45.3%)",
    ringLight: "hsl(142.1 76.2% 36.3%)",
    ringDark: "hsl(142.1 70.6% 45.3%)",
    rgb: "16 185 129",
    previewHex: "#10b981",
  },
  rose: {
    id: "rose",
    label: "Rose",
    primaryLight: "hsl(346.8 77.2% 49.8%)",
    primaryDark: "hsl(346.8 77.2% 55%)",
    ringLight: "hsl(346.8 77.2% 49.8%)",
    ringDark: "hsl(346.8 77.2% 55%)",
    rgb: "244 63 94",
    previewHex: "#f43f5e",
  },
  amber: {
    id: "amber",
    label: "Amber",
    primaryLight: "hsl(37.7 92.1% 50.2%)",
    primaryDark: "hsl(37.7 92.1% 55%)",
    ringLight: "hsl(37.7 92.1% 50.2%)",
    ringDark: "hsl(37.7 92.1% 55%)",
    rgb: "245 158 11",
    previewHex: "#f59e0b",
  },
  cyan: {
    id: "cyan",
    label: "Cyan",
    primaryLight: "hsl(190.4 95% 39%)",
    primaryDark: "hsl(188.7 94.5% 42.7%)",
    ringLight: "hsl(190.4 95% 39%)",
    ringDark: "hsl(188.7 94.5% 42.7%)",
    rgb: "6 182 212",
    previewHex: "#06b6d4",
  },
  sky: {
    id: "sky",
    label: "Sky Blue",
    primaryLight: "hsl(198.6 88.7% 48.4%)",
    primaryDark: "hsl(198.6 88.7% 55%)",
    ringLight: "hsl(198.6 88.7% 48.4%)",
    ringDark: "hsl(198.6 88.7% 55%)",
    rgb: "14 165 233",
    previewHex: "#0ea5e9",
  },
  orange: {
    id: "orange",
    label: "Orange",
    primaryLight: "hsl(24.6 95% 53.1%)",
    primaryDark: "hsl(24.6 95% 58%)",
    ringLight: "hsl(24.6 95% 53.1%)",
    ringDark: "hsl(24.6 95% 58%)",
    rgb: "249 115 22",
    previewHex: "#f97316",
  },
  neon: {
    id: "neon",
    label: "Cyber Neon",
    primaryLight: "hsl(173 80% 40%)",
    primaryDark: "hsl(173 100% 50%)",
    ringLight: "hsl(173 80% 40%)",
    ringDark: "hsl(173 100% 50%)",
    rgb: "0 255 220",
    previewHex: "#00f0ff",
  },
  crimson: {
    id: "crimson",
    label: "Crimson Red",
    primaryLight: "hsl(0 72% 51%)",
    primaryDark: "hsl(0 84% 60%)",
    ringLight: "hsl(0 72% 51%)",
    ringDark: "hsl(0 84% 60%)",
    rgb: "220 38 38",
    previewHex: "#dc2626",
  },
};

export const RADIUS_PRESETS: { value: RadiusValue; label: string; rem: string }[] = [
  { value: "0", label: "0 (Sharp)", rem: "0rem" },
  { value: "0.3", label: "0.3 (Compact)", rem: "0.3rem" },
  { value: "0.5", label: "0.5 (Smooth)", rem: "0.5rem" },
  { value: "0.625", label: "0.625 (Nexore Signature)", rem: "0.625rem" },
  { value: "0.75", label: "0.75 (Smooth)", rem: "0.75rem" },
  { value: "1.0", label: "1.0 (Pill)", rem: "1.0rem" },
];

export const FONT_OPTIONS: { id: FontFamilyType; label: string; css: string }[] = [
  { id: "inter", label: "Inter", css: "'Inter', sans-serif" },
  { id: "geist", label: "Geist Sans", css: "'Geist', sans-serif" },
  { id: "jetbrains", label: "JetBrains Mono", css: "'JetBrains Mono', monospace" },
  { id: "system", label: "System Default", css: "system-ui, -apple-system, sans-serif" },
];

export const DENSITY_OPTIONS: { id: DensityType; label: string; desc: string; scale: string }[] = [
  { id: "compact", label: "Compact", desc: "Tight spacing, small elements", scale: "0.875" },
  { id: "default", label: "Default", desc: "Balanced spacing and sizing", scale: "1" },
  { id: "relaxed", label: "Relaxed", desc: "Roomy spacing, large touch targets", scale: "1.125" },
];

export const ANIMATION_OPTIONS: { id: AnimationStyleType; label: string; desc: string }[] = [
  { id: "subtle", label: "Subtle", desc: "Smooth fades and gentle transitions" },
  { id: "energetic", label: "Energetic", desc: "Fast responsive transitions" },
  { id: "none", label: "None", desc: "No animations, instant transitions" },
];

interface ThemeCustomizerContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  radius: RadiusValue;
  setRadius: (radius: RadiusValue) => void;
  framework: FrameworkType;
  setFramework: (framework: FrameworkType) => void;
  packageManager: PackageManagerType;
  setPackageManager: (pm: PackageManagerType) => void;
  fontFamily: FontFamilyType;
  setFontFamily: (font: FontFamilyType) => void;
  density: DensityType;
  setDensity: (density: DensityType) => void;
  animationStyle: AnimationStyleType;
  setAnimationStyle: (style: AnimationStyleType) => void;
  defaultMode: DefaultModeType;
  setDefaultMode: (mode: DefaultModeType) => void;
  applyThemeToDocs: boolean;
  setApplyThemeToDocs: (apply: boolean) => void;
  resetToSignature: () => void;
  getInitCommand: () => string;
  getInstallDepsCommand: () => string;
  getGlobalsCssSnippet: () => string;
  getNexoreConfigSnippet: () => string;
}

const ThemeCustomizerContext = createContext<ThemeCustomizerContextType | null>(null);

export function ThemeCustomizerProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColorState] = useState<ThemeColor>(SIGNATURE_THEME.color);
  const [radius, setRadiusState] = useState<RadiusValue>(SIGNATURE_THEME.radius);
  const [framework, setFramework] = useState<FrameworkType>("next-app");
  const [packageManager, setPackageManager] = useState<PackageManagerType>("pnpm");
  const [fontFamily, setFontFamilyState] = useState<FontFamilyType>(SIGNATURE_THEME.font);
  const [density, setDensityState] = useState<DensityType>(SIGNATURE_THEME.density);
  const [animationStyle, setAnimationStyleState] = useState<AnimationStyleType>(SIGNATURE_THEME.animation);
  const [defaultMode, setDefaultModeState] = useState<DefaultModeType>(SIGNATURE_THEME.mode);
  const [applyThemeToDocs, setApplyThemeToDocsState] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window === "undefined") return;

      const savedColor = localStorage.getItem("nexore_theme_color") as ThemeColor;
      const savedRadius = localStorage.getItem("nexore_theme_radius") as RadiusValue;
      const savedFramework = localStorage.getItem("nexore_framework") as FrameworkType;
      const savedPm = localStorage.getItem("nexore_pm") as PackageManagerType;
      const savedFont = localStorage.getItem("nexore_font") as FontFamilyType;
      const savedDensity = localStorage.getItem("nexore_density") as DensityType;
      const savedAnimation = localStorage.getItem("nexore_animation") as AnimationStyleType;
      const savedMode = localStorage.getItem("nexore_default_mode") as DefaultModeType;

      if (savedColor && COLOR_PRESETS[savedColor]) {
        setThemeColorState(savedColor);
      } else {
        setThemeColorState(SIGNATURE_THEME.color);
      }

      if (savedRadius && RADIUS_PRESETS.some((r) => r.value === savedRadius)) {
        setRadiusState(savedRadius);
      } else {
        setRadiusState(SIGNATURE_THEME.radius);
      }

      if (savedFramework) setFramework(savedFramework);
      if (savedPm) setPackageManager(savedPm);
      if (savedFont && FONT_OPTIONS.some((f) => f.id === savedFont)) setFontFamilyState(savedFont);
      if (savedDensity && DENSITY_OPTIONS.some((d) => d.id === savedDensity)) setDensityState(savedDensity);
      if (savedAnimation && ANIMATION_OPTIONS.some((a) => a.id === savedAnimation)) setAnimationStyleState(savedAnimation);
      if (savedMode && (savedMode === "dark" || savedMode === "light" || savedMode === "system")) setDefaultModeState(savedMode);
    } catch (e) {
      console.warn("Could not read theme settings from localStorage:", e);
    }
  }, []);

  // Single source of truth for applying theme styles to document root
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const isCreatePage = typeof window !== "undefined" && (window.location.pathname === "/create" || window.location.pathname.startsWith("/create"));

    if (applyThemeToDocs || isCreatePage) {
      const preset = COLOR_PRESETS[themeColor] || COLOR_PRESETS[SIGNATURE_THEME.color];
      const primaryVal = isDark ? preset.primaryDark : preset.primaryLight;
      const primaryFg = isDark
        ? (preset.id === "slate" ? "hsl(240 5.9% 10%)" : "hsl(0 0% 100%)")
        : (preset.id === "slate" ? "hsl(0 0% 98%)" : "hsl(0 0% 100%)");
      const ringVal = isDark ? preset.ringDark : preset.ringLight;

      root.style.setProperty("--primary", primaryVal);
      root.style.setProperty("--color-primary", primaryVal);
      root.style.setProperty("--primary-foreground", primaryFg);
      root.style.setProperty("--color-primary-foreground", primaryFg);
      root.style.setProperty("--ring", ringVal);
      root.style.setProperty("--color-ring", ringVal);
      root.style.setProperty("--primary-rgb", preset.rgb);
      root.style.setProperty("--radius", `${radius}rem`);
    } else {
      const defaultPreset = COLOR_PRESETS[SIGNATURE_THEME.color];
      const primaryVal = isDark ? defaultPreset.primaryDark : defaultPreset.primaryLight;
      const primaryFg = isDark ? "hsl(240 5.9% 10%)" : "hsl(0 0% 98%)";
      const ringVal = isDark ? defaultPreset.ringDark : defaultPreset.ringLight;

      root.style.setProperty("--primary", primaryVal);
      root.style.setProperty("--color-primary", primaryVal);
      root.style.setProperty("--primary-foreground", primaryFg);
      root.style.setProperty("--color-primary-foreground", primaryFg);
      root.style.setProperty("--ring", ringVal);
      root.style.setProperty("--color-ring", ringVal);
      root.style.setProperty("--primary-rgb", defaultPreset.rgb);
      root.style.setProperty("--radius", `${SIGNATURE_THEME.radius}rem`);
    }

    const observer = new MutationObserver(() => {
      const nowDark = root.classList.contains("dark");
      const currentIsCreate = typeof window !== "undefined" && (window.location.pathname === "/create" || window.location.pathname.startsWith("/create"));
      const activePreset = (applyThemeToDocs || currentIsCreate)
        ? (COLOR_PRESETS[themeColor] || COLOR_PRESETS[SIGNATURE_THEME.color])
        : COLOR_PRESETS[SIGNATURE_THEME.color];

      const primaryVal = nowDark ? activePreset.primaryDark : activePreset.primaryLight;
      const primaryFg = nowDark
        ? (activePreset.id === "slate" ? "hsl(240 5.9% 10%)" : "hsl(0 0% 100%)")
        : (activePreset.id === "slate" ? "hsl(0 0% 98%)" : "hsl(0 0% 100%)");
      const ringVal = nowDark ? activePreset.ringDark : activePreset.ringLight;

      root.style.setProperty("--primary", primaryVal);
      root.style.setProperty("--color-primary", primaryVal);
      root.style.setProperty("--primary-foreground", primaryFg);
      root.style.setProperty("--color-primary-foreground", primaryFg);
      root.style.setProperty("--ring", ringVal);
      root.style.setProperty("--color-ring", ringVal);
      root.style.setProperty("--primary-rgb", activePreset.rgb);
      root.style.setProperty("--radius", (applyThemeToDocs || currentIsCreate) ? `${radius}rem` : `${SIGNATURE_THEME.radius}rem`);
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [themeColor, radius, applyThemeToDocs, mounted]);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    try {
      localStorage.setItem("nexore_theme_color", color);
    } catch (e) {
      console.warn("Could not save theme color to localStorage:", e);
    }
  };

  const setRadius = (r: RadiusValue) => {
    setRadiusState(r);
    try {
      localStorage.setItem("nexore_theme_radius", r);
    } catch (e) {
      console.warn("Could not save theme radius to localStorage:", e);
    }
  };

  const setApplyThemeToDocs = (apply: boolean) => {
    setApplyThemeToDocsState(apply);
  };

  const setFontFamily = (font: FontFamilyType) => {
    setFontFamilyState(font);
    try {
      localStorage.setItem("nexore_font", font);
    } catch (e) {
      console.warn("Could not save font family to localStorage:", e);
    }
  };

  const setDensity = (d: DensityType) => {
    setDensityState(d);
    try {
      localStorage.setItem("nexore_density", d);
    } catch (e) {
      console.warn("Could not save density to localStorage:", e);
    }
  };

  const setAnimationStyle = (style: AnimationStyleType) => {
    setAnimationStyleState(style);
    try {
      localStorage.setItem("nexore_animation", style);
    } catch (e) {
      console.warn("Could not save animation style to localStorage:", e);
    }
  };

  const setDefaultMode = (mode: DefaultModeType) => {
    setDefaultModeState(mode);
    try {
      localStorage.setItem("nexore_default_mode", mode);
    } catch (e) {
      console.warn("Could not save default mode to localStorage:", e);
    }
  };

  const resetToSignature = () => {
    setThemeColor(SIGNATURE_THEME.color);
    setRadius(SIGNATURE_THEME.radius);
    setFontFamily(SIGNATURE_THEME.font);
    setDensity(SIGNATURE_THEME.density);
    setAnimationStyle(SIGNATURE_THEME.animation);
    setDefaultMode(SIGNATURE_THEME.mode);
    setApplyThemeToDocs(false);
  };

  const getInitCommand = () => {
    let runner = "npx";
    if (packageManager === "pnpm") runner = "pnpm dlx";
    else if (packageManager === "bun") runner = "bunx";
    else if (packageManager === "yarn") runner = "yarn dlx";

    return `${runner} nexoreui init --theme ${themeColor} --radius ${radius}`;
  };

  const getInstallDepsCommand = () => {
    if (packageManager === "pnpm") {
      return "pnpm add nexoreui lucide-react framer-motion clsx tailwind-merge";
    } else if (packageManager === "bun") {
      return "bun add nexoreui lucide-react framer-motion clsx tailwind-merge";
    } else if (packageManager === "yarn") {
      return "yarn add nexoreui lucide-react framer-motion clsx tailwind-merge";
    } else {
      return "npm install nexoreui lucide-react framer-motion clsx tailwind-merge";
    }
  };

  const fontCss = FONT_OPTIONS.find((f) => f.id === fontFamily)?.css || "'Geist', sans-serif";

  const getGlobalsCssSnippet = () => {
    const preset = COLOR_PRESETS[themeColor] || COLOR_PRESETS[SIGNATURE_THEME.color];
    const fwConfig = getFrameworkConfig(framework);
    return `@import "tailwindcss";
@source "../components/**/*.{ts,tsx}";
@source "../app/**/*.{ts,tsx}";

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: ${fontCss};
}

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 3.9%);
  --primary: ${preset.primaryLight};
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(240 4.8% 95.9%);
  --secondary-foreground: hsl(240 5.9% 10%);
  --muted: hsl(240 4.8% 95.9%);
  --muted-foreground: hsl(240 3.8% 46.1%);
  --accent: hsl(240 4.8% 95.9%);
  --accent-foreground: hsl(240 5.9% 10%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(240 5.9% 90%);
  --input: hsl(240 5.9% 90%);
  --ring: ${preset.ringLight || preset.primaryLight};
  --radius: ${radius}rem;
  --primary-rgb: ${preset.rgb};
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(240 10% 3.9%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(240 10% 3.9%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: ${preset.primaryDark};
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(240 3.7% 15.9%);
  --secondary-foreground: hsl(0 0% 98%);
  --muted: hsl(240 3.7% 15.9%);
  --muted-foreground: hsl(240 5% 64.9%);
  --accent: hsl(240 3.7% 15.9%);
  --accent-foreground: hsl(0 0% 98%);
  --destructive: hsl(0 62.8% 30.6%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(240 3.7% 15.9%);
  --input: hsl(240 3.7% 15.9%);
  --ring: ${preset.ringDark || preset.primaryDark};
  --radius: ${radius}rem;
  --primary-rgb: ${preset.rgb};
}`;
  };

  const getNexoreConfigSnippet = () => {
    const fwConfig = getFrameworkConfig(framework);
    return JSON.stringify(
      {
        $schema: "https://nexoreui.site/schema.json",
        style: "default",
        theme: themeColor,
        radius: Number(radius),
        framework: fwConfig.cliFlag,
        packageManager: packageManager,
        font: fontFamily,
        density: density,
        animation: animationStyle,
        defaultMode: defaultMode,
        tailwind: {
          css: fwConfig.cssPath,
          baseColor: "zinc",
          cssVariables: true,
        },
        aliases: fwConfig.aliases,
      },
      null,
      2
    );
  };

  return (
    <ThemeCustomizerContext.Provider
      value={{
        themeColor,
        setThemeColor,
        radius,
        setRadius,
        framework,
        setFramework,
        packageManager,
        setPackageManager,
        fontFamily,
        setFontFamily,
        density,
        setDensity,
        animationStyle,
        setAnimationStyle,
        defaultMode,
        setDefaultMode,
        applyThemeToDocs,
        setApplyThemeToDocs,
        resetToSignature,
        getInitCommand,
        getInstallDepsCommand,
        getGlobalsCssSnippet,
        getNexoreConfigSnippet,
      }}
    >
      {children}
    </ThemeCustomizerContext.Provider>
  );
}

export function useThemeCustomizer() {
  const context = useContext(ThemeCustomizerContext);
  if (!context) {
    throw new Error("useThemeCustomizer must be used within a ThemeCustomizerProvider");
  }
  return context;
}
