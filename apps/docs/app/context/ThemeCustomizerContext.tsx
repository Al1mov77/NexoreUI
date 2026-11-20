"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  primaryFgLight: string;
  primaryFgDark: string;
  ringLight: string;
  ringDark: string;
  rgb: string;
  rgbLight: string;
  rgbDark: string;
  previewHex: string;
}

export const COLOR_PRESETS: Record<ThemeColor, ColorPreset> = {
  slate: {
    id: "slate",
    label: "Slate / Zinc (Signature)",
    primaryLight: "hsl(240 5.9% 10%)",
    primaryDark: "hsl(0 0% 98%)",
    primaryFgLight: "hsl(0 0% 98%)",
    primaryFgDark: "hsl(240 5.9% 10%)",
    ringLight: "hsl(240 10% 3.9%)",
    ringDark: "hsl(240 4.9% 83.9%)",
    rgb: "250 250 250",
    rgbLight: "24 24 27",
    rgbDark: "250 250 250",
    previewHex: "#71717a",
  },
  indigo: {
    id: "indigo",
    label: "Indigo",
    primaryLight: "hsl(243 75% 59%)",
    primaryDark: "hsl(239 84% 67%)",
    primaryFgLight: "hsl(0 0% 100%)",
    primaryFgDark: "hsl(0 0% 100%)",
    ringLight: "hsl(243 75% 59%)",
    ringDark: "hsl(239 84% 67%)",
    rgb: "129 140 248",
    rgbLight: "79 70 229",
    rgbDark: "129 140 248",
    previewHex: "#6366f1",
  },
  violet: {
    id: "violet",
    label: "Violet",
    primaryLight: "hsl(262.1 83.3% 57.8%)",
    primaryDark: "hsl(263.4 70% 58%)",
    primaryFgLight: "hsl(0 0% 100%)",
    primaryFgDark: "hsl(0 0% 100%)",
    ringLight: "hsl(262.1 83.3% 57.8%)",
    ringDark: "hsl(263.4 70% 58%)",
    rgb: "139 92 246",
    rgbLight: "124 58 237",
    rgbDark: "139 92 246",
    previewHex: "#8b5cf6",
  },
  emerald: {
    id: "emerald",
    label: "Emerald",
    primaryLight: "hsl(142.1 76.2% 36.3%)",
    primaryDark: "hsl(142.1 70.6% 45.3%)",
    primaryFgLight: "hsl(0 0% 100%)",
    primaryFgDark: "hsl(240 10% 3.9%)",
    ringLight: "hsl(142.1 76.2% 36.3%)",
    ringDark: "hsl(142.1 70.6% 45.3%)",
    rgb: "34 197 94",
    rgbLight: "22 163 74",
    rgbDark: "34 197 94",
    previewHex: "#10b981",
  },
  rose: {
    id: "rose",
    label: "Rose",
    primaryLight: "hsl(346.8 77.2% 49.8%)",
    primaryDark: "hsl(346.8 77.2% 55%)",
    primaryFgLight: "hsl(0 0% 100%)",
    primaryFgDark: "hsl(0 0% 100%)",
    ringLight: "hsl(346.8 77.2% 49.8%)",
    ringDark: "hsl(346.8 77.2% 55%)",
    rgb: "244 63 94",
    rgbLight: "225 29 72",
    rgbDark: "244 63 94",
    previewHex: "#f43f5e",
  },
  amber: {
    id: "amber",
    label: "Amber",
    primaryLight: "hsl(32 95% 44%)",
    primaryDark: "hsl(38 92% 50%)",
    primaryFgLight: "hsl(0 0% 100%)",
    primaryFgDark: "hsl(240 10% 3.9%)",
    ringLight: "hsl(32 95% 44%)",
    ringDark: "hsl(38 92% 50%)",
    rgb: "245 158 11",
    rgbLight: "217 119 6",
    rgbDark: "245 158 11",
    previewHex: "#f59e0b",
  },
  cyan: {
    id: "cyan",
    label: "Cyan",
    primaryLight: "hsl(191.6 91.4% 36.5%)",
    primaryDark: "hsl(188.7 94.5% 42.7%)",
    primaryFgLight: "hsl(0 0% 100%)",
    primaryFgDark: "hsl(240 10% 3.9%)",
    ringLight: "hsl(191.6 91.4% 36.5%)",
    ringDark: "hsl(188.7 94.5% 42.7%)",
    rgb: "6 182 212",
    rgbLight: "8 145 178",
    rgbDark: "6 182 212",
    previewHex: "#06b6d4",
  },
  sky: {
    id: "sky",
    label: "Sky Blue",
    primaryLight: "hsl(200.4 98% 39.4%)",
    primaryDark: "hsl(198.6 88.7% 48.4%)",
    primaryFgLight: "hsl(0 0% 100%)",
    primaryFgDark: "hsl(240 10% 3.9%)",
    ringLight: "hsl(200.4 98% 39.4%)",
    ringDark: "hsl(198.6 88.7% 48.4%)",
    rgb: "14 165 233",
    rgbLight: "2 132 199",
    rgbDark: "14 165 233",
    previewHex: "#0ea5e9",
  },
  orange: {
    id: "orange",
    label: "Orange",
    primaryLight: "hsl(20.5 90.2% 48.2%)",
    primaryDark: "hsl(24.6 95% 53.1%)",
    primaryFgLight: "hsl(0 0% 100%)",
    primaryFgDark: "hsl(240 10% 3.9%)",
    ringLight: "hsl(20.5 90.2% 48.2%)",
    ringDark: "hsl(24.6 95% 53.1%)",
    rgb: "249 115 22",
    rgbLight: "234 88 12",
    rgbDark: "249 115 22",
    previewHex: "#f97316",
  },
  neon: {
    id: "neon",
    label: "Cyber Neon",
    primaryLight: "hsl(173 80% 34%)",
    primaryDark: "hsl(173 95% 48%)",
    primaryFgLight: "hsl(0 0% 100%)",
    primaryFgDark: "hsl(240 10% 3.9%)",
    ringLight: "hsl(173 80% 34%)",
    ringDark: "hsl(173 95% 48%)",
    rgb: "6 239 211",
    rgbLight: "17 156 140",
    rgbDark: "6 239 211",
    previewHex: "#00e6cc",
  },
  crimson: {
    id: "crimson",
    label: "Crimson Red",
    primaryLight: "hsl(0 72.2% 50.6%)",
    primaryDark: "hsl(0 84.2% 60.2%)",
    primaryFgLight: "hsl(0 0% 100%)",
    primaryFgDark: "hsl(0 0% 100%)",
    ringLight: "hsl(0 72.2% 50.6%)",
    ringDark: "hsl(0 84.2% 60.2%)",
    rgb: "239 68 68",
    rgbLight: "220 38 38",
    rgbDark: "239 68 68",
    previewHex: "#dc2626",
  },
};

export const RADIUS_PRESETS: { value: RadiusValue; label: string; shortLabel: string; rem: string }[] = [
  { value: "0", label: "0 (Sharp)", shortLabel: "Sharp", rem: "0rem" },
  { value: "0.3", label: "0.3 (Compact)", shortLabel: "Compact", rem: "0.3rem" },
  { value: "0.5", label: "0.5 (Smooth)", shortLabel: "Smooth", rem: "0.5rem" },
  { value: "0.625", label: "0.625 (Signature)", shortLabel: "Signature", rem: "0.625rem" },
  { value: "0.75", label: "0.75 (Rounded)", shortLabel: "Rounded", rem: "0.75rem" },
  { value: "1.0", label: "1.0 (Pill)", shortLabel: "Pill", rem: "1.0rem" },
];

export const FONT_OPTIONS: {
  id: FontFamilyType;
  label: string;
  css: string;
  monoCss: string;
  googleFontsHref: string | null;
}[] = [
  {
    id: "inter",
    label: "Inter",
    css: "'Inter', system-ui, -apple-system, sans-serif",
    monoCss: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
  },
  {
    id: "geist",
    label: "Geist Sans",
    css: "'Geist', system-ui, -apple-system, sans-serif",
    monoCss: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap",
  },
  {
    id: "jetbrains",
    label: "JetBrains Mono",
    css: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    monoCss: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap",
  },
  {
    id: "system",
    label: "System Default",
    css: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    monoCss: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    googleFontsHref: null,
  },
];

export const DENSITY_OPTIONS: {
  id: DensityType;
  label: string;
  desc: string;
  scale: string;
  padding: string;
  gap: string;
}[] = [
  {
    id: "compact",
    label: "Compact",
    desc: "Tight spacing, dense surfaces",
    scale: "0.875",
    padding: "0.75rem",
    gap: "0.5rem",
  },
  {
    id: "default",
    label: "Default",
    desc: "Balanced spacing and sizing",
    scale: "1",
    padding: "1.25rem",
    gap: "0.875rem",
  },
  {
    id: "relaxed",
    label: "Relaxed",
    desc: "Roomy spacing, generous targets",
    scale: "1.125",
    padding: "1.75rem",
    gap: "1.25rem",
  },
];

export const ANIMATION_OPTIONS: {
  id: AnimationStyleType;
  label: string;
  desc: string;
  duration: string;
  ease: string;
  durationNum: number;
  easeTuple: readonly [number, number, number, number];
}[] = [
  {
    id: "subtle",
    label: "Subtle",
    desc: "Smooth ease-out transitions",
    duration: "0.28s",
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
    durationNum: 0.28,
    easeTuple: [0.16, 1, 0.3, 1],
  },
  {
    id: "energetic",
    label: "Energetic",
    desc: "Fast responsive transitions",
    duration: "0.16s",
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    durationNum: 0.16,
    easeTuple: [0.22, 1, 0.36, 1],
  },
  {
    id: "none",
    label: "None",
    desc: "Instant state changes, zero motion",
    duration: "0s",
    ease: "linear",
    durationNum: 0,
    easeTuple: [0, 0, 1, 1],
  },
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
  const pathname = usePathname();
  const [themeColor, setThemeColorState] = useState<ThemeColor>(SIGNATURE_THEME.color);
  const [radius, setRadiusState] = useState<RadiusValue>(SIGNATURE_THEME.radius);
  const [framework, setFrameworkState] = useState<FrameworkType>("next-app");
  const [packageManager, setPackageManagerState] = useState<PackageManagerType>("pnpm");
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

      if (savedFramework) setFrameworkState(savedFramework);
      if (savedPm) setPackageManagerState(savedPm);
      if (savedFont && FONT_OPTIONS.some((f) => f.id === savedFont)) setFontFamilyState(savedFont);
      if (savedDensity && DENSITY_OPTIONS.some((d) => d.id === savedDensity)) setDensityState(savedDensity);
      if (savedAnimation && ANIMATION_OPTIONS.some((a) => a.id === savedAnimation)) setAnimationStyleState(savedAnimation);
      if (savedMode && (savedMode === "dark" || savedMode === "light" || savedMode === "system")) setDefaultModeState(savedMode);
    } catch (e) {
      console.warn("Could not read theme settings from localStorage:", e);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const isCreatePage = Boolean(pathname && (pathname === "/create" || pathname.startsWith("/create/")));

    const applyTokens = (nowDark: boolean) => {
      const useCustom = applyThemeToDocs || isCreatePage;
      const preset = useCustom
        ? COLOR_PRESETS[themeColor] || COLOR_PRESETS[SIGNATURE_THEME.color]
        : COLOR_PRESETS[SIGNATURE_THEME.color];

      const primaryVal = nowDark ? preset.primaryDark : preset.primaryLight;
      const primaryFg = nowDark ? preset.primaryFgDark : preset.primaryFgLight;
      const ringVal = nowDark ? preset.ringDark : preset.ringLight;
      const rgbVal = nowDark ? preset.rgbDark : preset.rgbLight;

      root.style.setProperty("--primary", primaryVal);
      root.style.setProperty("--color-primary", primaryVal);
      root.style.setProperty("--primary-foreground", primaryFg);
      root.style.setProperty("--color-primary-foreground", primaryFg);
      root.style.setProperty("--ring", ringVal);
      root.style.setProperty("--color-ring", ringVal);
      root.style.setProperty("--primary-rgb", rgbVal);
      root.style.setProperty("--radius", useCustom ? `${radius}rem` : `${SIGNATURE_THEME.radius}rem`);
    };

    applyTokens(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      applyTokens(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [themeColor, radius, applyThemeToDocs, pathname, mounted]);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    try {
      localStorage.setItem("nexore_theme_color", color);
    } catch {}
  };

  const setRadius = (r: RadiusValue) => {
    setRadiusState(r);
    try {
      localStorage.setItem("nexore_theme_radius", r);
    } catch {}
  };

  const setFramework = (fw: FrameworkType) => {
    setFrameworkState(fw);
    try {
      localStorage.setItem("nexore_framework", fw);
    } catch {}
  };

  const setPackageManager = (pm: PackageManagerType) => {
    setPackageManagerState(pm);
    try {
      localStorage.setItem("nexore_pm", pm);
    } catch {}
  };

  const setApplyThemeToDocs = (apply: boolean) => {
    setApplyThemeToDocsState(apply);
  };

  const setFontFamily = (font: FontFamilyType) => {
    setFontFamilyState(font);
    try {
      localStorage.setItem("nexore_font", font);
    } catch {}
  };

  const setDensity = (d: DensityType) => {
    setDensityState(d);
    try {
      localStorage.setItem("nexore_density", d);
    } catch {}
  };

  const setAnimationStyle = (style: AnimationStyleType) => {
    setAnimationStyleState(style);
    try {
      localStorage.setItem("nexore_animation", style);
    } catch {}
  };

  const setDefaultMode = (mode: DefaultModeType) => {
    setDefaultModeState(mode);
    try {
      localStorage.setItem("nexore_default_mode", mode);
    } catch {}
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

    const fwConfig = getFrameworkConfig(framework);
    return `${runner} nexoreui init -y --framework ${fwConfig.cliFlag} --pm ${packageManager} --theme ${themeColor} --radius ${radius} --font ${fontFamily} --density ${density} --animation ${animationStyle} --mode ${defaultMode}`;
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

  const fontOption = FONT_OPTIONS.find((f) => f.id === fontFamily) || FONT_OPTIONS[1];
  const densityOption = DENSITY_OPTIONS.find((d) => d.id === density) || DENSITY_OPTIONS[1];
  const animOption = ANIMATION_OPTIONS.find((a) => a.id === animationStyle) || ANIMATION_OPTIONS[0];

  const getGlobalsCssSnippet = () => {
    const preset = COLOR_PRESETS[themeColor] || COLOR_PRESETS[SIGNATURE_THEME.color];
    const reducedMotionCss =
      animationStyle === "none"
        ? `
*,
*::before,
*::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}`
        : `
:root[data-animation="none"] *,
:root[data-animation="none"] *::before,
:root[data-animation="none"] *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}`;

    return `@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
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
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: max(0px, calc(var(--radius) - 4px));
  --radius-md: max(0px, calc(var(--radius) - 2px));
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --font-sans: ${fontOption.css};
  --font-mono: ${fontOption.monoCss};
}

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 3.9%);
  --primary: ${preset.primaryLight};
  --primary-foreground: ${preset.primaryFgLight};
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
  --ring: ${preset.ringLight};
  --primary-rgb: ${preset.rgbLight};
  --radius: ${radius}rem;
  --success: hsl(142 71% 36%);
  --success-foreground: hsl(0 0% 100%);
  --warning: hsl(32 95% 44%);
  --warning-foreground: hsl(0 0% 100%);
  --info: hsl(221 83% 53%);
  --info-foreground: hsl(0 0% 100%);
  --chart-1: hsl(240 5.9% 10%);
  --chart-2: hsl(240 4% 30%);
  --chart-3: hsl(240 3.8% 46%);
  --chart-4: hsl(240 5% 65%);
  --chart-5: hsl(240 5.9% 80%);
  --density-scale: ${densityOption.scale};
  --density-padding: ${densityOption.padding};
  --density-gap: ${densityOption.gap};
  --motion-duration: ${animOption.duration};
  --motion-ease: ${animOption.ease};
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(240 10% 3.9%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(240 10% 3.9%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: ${preset.primaryDark};
  --primary-foreground: ${preset.primaryFgDark};
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
  --ring: ${preset.ringDark};
  --primary-rgb: ${preset.rgbDark};
  --radius: ${radius}rem;
  --success: hsl(142 69% 58%);
  --success-foreground: hsl(240 10% 3.9%);
  --warning: hsl(43 96% 56%);
  --warning-foreground: hsl(240 10% 3.9%);
  --info: hsl(213 94% 68%);
  --info-foreground: hsl(240 10% 3.9%);
  --chart-1: hsl(0 0% 98%);
  --chart-2: hsl(240 5% 80%);
  --chart-3: hsl(240 5% 64.9%);
  --chart-4: hsl(240 4% 46%);
  --chart-5: hsl(240 3.7% 30%);
  --density-scale: ${densityOption.scale};
  --density-padding: ${densityOption.padding};
  --density-gap: ${densityOption.gap};
  --motion-duration: ${animOption.duration};
  --motion-ease: ${animOption.ease};
}

@layer base {
  * {
    border-color: var(--border);
  }
  html,
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

.animate-accordion-down { animation: accordion-down 0.2s ease-out; }
.animate-accordion-up { animation: accordion-up 0.2s ease-out; }${reducedMotionCss}
`;
  };

  const getNexoreConfigSnippet = () => {
    const fwConfig = getFrameworkConfig(framework);
    return JSON.stringify(
      {
        $schema: "https://www.nexoreui.com/schema.json",
        style: "default",
        theme: themeColor,
        radius: Number(radius),
        framework: fwConfig.cliFlag,
        packageManager,
        font: fontFamily,
        density,
        animation: animationStyle,
        defaultMode,
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
