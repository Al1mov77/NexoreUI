"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

export type RadiusValue = "0" | "0.3" | "0.5" | "0.75" | "1.0";
export type FrameworkType = "next-app" | "next-pages" | "vite" | "remix" | "astro" | "monorepo";
export type PackageManagerType = "pnpm" | "npm" | "yarn" | "bun";
export type FontFamilyType = "inter" | "geist" | "jetbrains" | "system";
export type DensityType = "compact" | "default" | "relaxed";
export type AnimationStyleType = "subtle" | "energetic" | "none";
export type DefaultModeType = "dark" | "light";

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
  indigo: {
    id: "indigo",
    label: "Indigo (Signature)",
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
  slate: {
    id: "slate",
    label: "Zinc / Slate",
    primaryLight: "hsl(240 5.9% 10%)",
    primaryDark: "hsl(0 0% 98%)",
    ringLight: "hsl(240 5.9% 10%)",
    ringDark: "hsl(0 0% 98%)",
    rgb: "244 244 245",
    previewHex: "#71717a",
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
  { value: "0.5", label: "0.5 (Default)", rem: "0.5rem" },
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
  { id: "energetic", label: "Energetic", desc: "Spring bounces and lively motion" },
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
  getInitCommand: () => string;
  getInstallDepsCommand: () => string;
  getGlobalsCssSnippet: () => string;
  getNexoreConfigSnippet: () => string;
}

const ThemeCustomizerContext = createContext<ThemeCustomizerContextType | null>(null);

export function ThemeCustomizerProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColorState] = useState<ThemeColor>("indigo");
  const [radius, setRadiusState] = useState<RadiusValue>("0.75");
  const [framework, setFramework] = useState<FrameworkType>("next-app");
  const [packageManager, setPackageManager] = useState<PackageManagerType>("pnpm");
  const [fontFamily, setFontFamilyState] = useState<FontFamilyType>("inter");
  const [density, setDensityState] = useState<DensityType>("default");
  const [animationStyle, setAnimationStyleState] = useState<AnimationStyleType>("subtle");
  const [defaultMode, setDefaultModeState] = useState<DefaultModeType>("dark");
  // applyThemeToDocs is NEVER persisted — always starts as false
  const [applyThemeToDocs, setApplyThemeToDocsState] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedColor = localStorage.getItem("nexore_theme_color") as ThemeColor;
      const savedRadius = localStorage.getItem("nexore_theme_radius") as RadiusValue;
      const savedFramework = localStorage.getItem("nexore_framework") as FrameworkType;
      const savedPm = localStorage.getItem("nexore_pm") as PackageManagerType;
      const savedFont = localStorage.getItem("nexore_font") as FontFamilyType;
      const savedDensity = localStorage.getItem("nexore_density") as DensityType;
      const savedAnimation = localStorage.getItem("nexore_animation") as AnimationStyleType;
      const savedMode = localStorage.getItem("nexore_default_mode") as DefaultModeType;

      if (savedColor && COLOR_PRESETS[savedColor]) setThemeColorState(savedColor);
      if (savedRadius && RADIUS_PRESETS.some((r) => r.value === savedRadius)) setRadiusState(savedRadius);
      if (savedFramework) setFramework(savedFramework);
      if (savedPm) setPackageManager(savedPm);
      if (savedFont && FONT_OPTIONS.some((f) => f.id === savedFont)) setFontFamilyState(savedFont);
      if (savedDensity && DENSITY_OPTIONS.some((d) => d.id === savedDensity)) setDensityState(savedDensity);
      if (savedAnimation && ANIMATION_OPTIONS.some((a) => a.id === savedAnimation)) setAnimationStyleState(savedAnimation);
      if (savedMode && (savedMode === "dark" || savedMode === "light")) setDefaultModeState(savedMode);
      // NOTE: applyThemeToDocs is intentionally NOT loaded from localStorage
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync to document.documentElement if applyThemeToDocs is true OR if currently on /create
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const isCreatePage = typeof window !== "undefined" && (window.location.pathname === "/create" || window.location.pathname.startsWith("/create"));

    if (applyThemeToDocs || isCreatePage) {
      const preset = COLOR_PRESETS[themeColor] || COLOR_PRESETS.indigo;
      root.style.setProperty("--primary", isDark ? preset.primaryDark : preset.primaryLight);
      root.style.setProperty("--ring", isDark ? preset.ringDark : preset.ringLight);
      root.style.setProperty("--primary-rgb", preset.rgb);
      root.style.setProperty("--radius", `${radius}rem`);
    } else {
      // Reset to signature NexoreUI default on other pages
      const defaultPreset = COLOR_PRESETS.indigo;
      root.style.setProperty("--primary", isDark ? defaultPreset.primaryDark : defaultPreset.primaryLight);
      root.style.setProperty("--ring", isDark ? defaultPreset.ringDark : defaultPreset.ringLight);
      root.style.setProperty("--primary-rgb", defaultPreset.rgb);
      root.style.setProperty("--radius", "0.75rem");
    }

    const observer = new MutationObserver(() => {
      const nowDark = root.classList.contains("dark");
      const currentIsCreate = typeof window !== "undefined" && (window.location.pathname === "/create" || window.location.pathname.startsWith("/create"));
      const activePreset = (applyThemeToDocs || currentIsCreate) ? (COLOR_PRESETS[themeColor] || COLOR_PRESETS.indigo) : COLOR_PRESETS.indigo;
      root.style.setProperty("--primary", nowDark ? activePreset.primaryDark : activePreset.primaryLight);
      root.style.setProperty("--ring", nowDark ? activePreset.ringDark : activePreset.ringLight);
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [themeColor, radius, applyThemeToDocs, mounted]);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    try { localStorage.setItem("nexore_theme_color", color); } catch (e) { /* ignore */ }
  };

  const setRadius = (r: RadiusValue) => {
    setRadiusState(r);
    try { localStorage.setItem("nexore_theme_radius", r); } catch (e) { /* ignore */ }
  };

  const setApplyThemeToDocs = (apply: boolean) => {
    setApplyThemeToDocsState(apply);
    // Intentionally NOT persisted to localStorage
  };

  const setFontFamily = (font: FontFamilyType) => {
    setFontFamilyState(font);
    try { localStorage.setItem("nexore_font", font); } catch (e) { /* ignore */ }
  };

  const setDensity = (d: DensityType) => {
    setDensityState(d);
    try { localStorage.setItem("nexore_density", d); } catch (e) { /* ignore */ }
  };

  const setAnimationStyle = (style: AnimationStyleType) => {
    setAnimationStyleState(style);
    try { localStorage.setItem("nexore_animation", style); } catch (e) { /* ignore */ }
  };

  const setDefaultMode = (mode: DefaultModeType) => {
    setDefaultModeState(mode);
    try { localStorage.setItem("nexore_default_mode", mode); } catch (e) { /* ignore */ }
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

  const getCssFilePath = () => {
    if (framework === "next-app") return "app/globals.css";
    if (framework === "next-pages") return "styles/globals.css";
    return "src/index.css";
  };

  const fontCss = FONT_OPTIONS.find((f) => f.id === fontFamily)?.css || "'Inter', sans-serif";

  const getGlobalsCssSnippet = () => {
    const preset = COLOR_PRESETS[themeColor];
    return `@import "tailwindcss";
@source "../node_modules/nexoreui/dist/**/*.{js,mjs}";

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-border: var(--border);
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
  --primary: ${preset.primaryLight};
  --primary-foreground: hsl(0 0% 100%);
  --border: hsl(240 5.9% 90%);
  --radius: ${radius}rem;
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(240 10% 3.9%);
  --card-foreground: hsl(0 0% 98%);
  --primary: ${preset.primaryDark};
  --primary-foreground: hsl(0 0% 100%);
  --border: hsl(240 3.7% 15.9%);
  --radius: ${radius}rem;
}`;
  };

  const getNexoreConfigSnippet = () => {
    return JSON.stringify(
      {
        $schema: "https://nexoreui.site/schema.json",
        style: "default",
        theme: themeColor,
        radius: Number(radius),
        framework: framework,
        packageManager: packageManager,
        font: fontFamily,
        density: density,
        animation: animationStyle,
        defaultMode: defaultMode,
        tailwind: {
          config: "tailwind.config.js",
          css: getCssFilePath(),
          baseColor: "zinc",
          cssVariables: true,
        },
        aliases: {
          components: "@/components/ui",
          utils: "@/lib/utils",
        },
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
