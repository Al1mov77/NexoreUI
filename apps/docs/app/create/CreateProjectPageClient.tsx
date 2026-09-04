"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2, Terminal, Check, Copy, Sparkles, Layers,
  ChevronRight, ArrowRight, Palette, Sliders, Laptop, Code2,
  Box, Eye, Bot, ShieldCheck, CheckSquare, Square, Package,
  ExternalLink, FileCode, Flame, HelpCircle, Type, Gauge,
  Zap, Moon, Sun, Monitor, Smartphone, FolderOpen, FileJson,
  ArrowDown, User, BarChart3, ChevronDown, Cpu, Activity,
  SlidersHorizontal, Star, Search, RefreshCw, Send, CheckCircle2,
  TrendingUp, Users, Play, X, Sparkle, Command, MessageSquare,
  Shield, CheckCircle, ArrowLeft, Download, FileText
} from "lucide-react";
import { copyToClipboard } from "../utils/clipboard";
import {
  useThemeCustomizer,
  COLOR_PRESETS,
  RADIUS_PRESETS,
  FONT_OPTIONS,
  DENSITY_OPTIONS,
  ANIMATION_OPTIONS,
  ThemeColor,
  RadiusValue,
  FrameworkType,
  PackageManagerType,
  FontFamilyType,
  DensityType,
  AnimationStyleType,
  DefaultModeType,
} from "../context/ThemeCustomizerContext";

/* ─── Framework Official Brand Vector SVGs ─── */
function NextjsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="black" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <path d="M17.5 18.2L9.2 7H7.5V17H9V9.5L16.2 19C16.65 18.78 17.09 18.51 17.5 18.2Z" fill="white" />
      <path d="M15 7H16.5V14.5H15V7Z" fill="url(#next_g)" />
      <defs>
        <linearGradient id="next_g" x1="15.75" y1="7" x2="15.75" y2="14.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ViteIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M29.5 5.5L16.5 28.5C16.3 28.9 15.7 28.9 15.5 28.5L2.5 5.5C2.3 5.1 2.6 4.6 3.1 4.7L15.6 5.8C15.8 5.8 16 5.8 16.2 5.7L28.9 4.3C29.4 4.2 29.8 4.7 29.5 5.5Z"
        fill="url(#vite_bg)"
      />
      <path
        d="M21.5 2L10.5 8.5C10.3 8.6 10.2 8.9 10.3 9.1L14 15.5C14.1 15.7 14.4 15.7 14.6 15.6L17 13.5C17.2 13.3 17.5 13.4 17.6 13.6L19.5 16.5C19.6 16.7 19.9 16.7 20.1 16.5L25.5 11.5C25.7 11.3 25.7 10.9 25.4 10.8L21.5 2Z"
        fill="url(#vite_bolt)"
      />
      <defs>
        <linearGradient id="vite_bg" x1="3" y1="4" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#41D1FF" />
          <stop offset="1" stopColor="#BD34FE" />
        </linearGradient>
        <linearGradient id="vite_bolt" x1="11" y1="6" x2="25" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFEA83" />
          <stop offset="0.2" stopColor="#FFDD35" />
          <stop offset="1" stopColor="#FFA800" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RemixIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h8c3.5 0 6 2.5 6 5.5 0 2.2-1.3 4.1-3.2 4.9L19 21h-3.8l-4.7-7H6v7H3V3zm3 7h5c1.7 0 3-1.1 3-2.5S12.7 5 11 5H6v5z" fill="currentColor" />
      <path d="M11 5H6v5h5c1.7 0 3-1.1 3-2.5S12.7 5 11 5z" fill="#38BDF8" />
    </svg>
  );
}

function AstroIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.8 9.5C18.4 6 16.8 2.8 14.2.5c-.3-.3-.8 0-.8.4.1 2.8-.7 5.6-2.3 7.9-1.6 2.3-3.9 4-6.6 4.8-.4.1-.5.7-.1.9 2.4 1.5 4.3 3.7 5.2 6.4.2.4.7.5 1 .1 1.4-2.4 3.7-4.3 6.4-5.3.4-.2.5-.7.2-1-1.8-1.5-3.1-3.5-3.8-5.8 2.4 1 4.3 2.8 5.2 5.2.2.4.8.4 1 0 1.2-2.4.9-5.3-.6-4.5z"
        fill="url(#astro_g)"
      />
      <path d="M12 23.5c0 0-1.4-4.3-4.3-5.8 3 0 4.3 3.8 4.3 3.8s1.4-3.8 4.3-3.8c-2.9 1.5-4.3 5.8-4.3 5.8z" fill="#FF5D01" />
      <defs>
        <linearGradient id="astro_g" x1="12" y1="1" x2="12" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BC52EE" />
          <stop offset="1" stopColor="#E63946" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TurborepoIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="url(#turbo_g)" strokeWidth="2.5" />
      <path d="M12 5C15.866 5 19 8.134 19 12C19 15.866 15.866 19 12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="turbo_g" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0070F3" />
          <stop offset="0.5" stopColor="#FF0080" />
          <stop offset="1" stopColor="#7928CA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Package Manager Official SVGs ─── */
function PnpmIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="28" height="28" fill="#F69220" rx="4" />
      <rect x="36" y="5" width="28" height="28" fill="#F69220" rx="4" />
      <rect x="67" y="5" width="28" height="28" fill="#F69220" rx="4" />
      <rect x="36" y="36" width="28" height="28" fill="#F69220" rx="4" />
      <rect x="67" y="36" width="28" height="28" fill="#4E4E4E" rx="4" />
      <rect x="5" y="67" width="28" height="28" fill="#4E4E4E" rx="4" />
      <rect x="36" y="67" width="28" height="28" fill="#4E4E4E" rx="4" />
      <rect x="67" y="67" width="28" height="28" fill="#4E4E4E" rx="4" />
    </svg>
  );
}

function NpmIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" fill="#CB3837" rx="36" />
      <path d="M48 48H208V208H160V96H112V208H48V48Z" fill="white" />
    </svg>
  );
}

function BunIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#FBF0DF" stroke="#E3B375" strokeWidth="1.5" />
      <circle cx="11.5" cy="15.5" r="2" fill="#2D2013" />
      <circle cx="20.5" cy="15.5" r="2" fill="#2D2013" />
      <ellipse cx="8" cy="18" rx="2" ry="1.2" fill="#F59E9E" />
      <ellipse cx="24" cy="18" rx="2" ry="1.2" fill="#F59E9E" />
      <path d="M14 18.5C15 19.5 17 19.5 18 18.5" stroke="#2D2013" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function YarnIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#2C8EBB" />
      <path d="M30 65C30 65 35 40 50 35C65 30 70 55 70 55" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <circle cx="50" cy="50" r="10" fill="white" />
    </svg>
  );
}

/* ─── Frameworks List with Official Icons ─── */
const FRAMEWORKS: {
  id: FrameworkType;
  name: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  desc: string;
  tag: string;
}[] = [
  { id: "next-app", name: "Next.js (App Router)", IconComponent: NextjsIcon, desc: "React Server Components, App Router & Tailwind v4", tag: "Recommended" },
  { id: "next-pages", name: "Next.js (Pages Router)", IconComponent: NextjsIcon, desc: "Classic pages router directory structure", tag: "Legacy" },
  { id: "vite", name: "Vite (React)", IconComponent: ViteIcon, desc: "Super fast Single Page Application with Tailwind v4", tag: "Fast SPA" },
  { id: "remix", name: "Remix / RRv7", IconComponent: RemixIcon, desc: "Fullstack React framework with SSR and loaders", tag: "Fullstack" },
  { id: "astro", name: "Astro", IconComponent: AstroIcon, desc: "Content-focused site with React Island components", tag: "Islands" },
  { id: "monorepo", name: "Turborepo Monorepo", IconComponent: TurborepoIcon, desc: "pnpm workspaces + shared UI package architecture", tag: "Enterprise" },
];

/* ─── Package Managers List with Branded SVGs ─── */
const PACKAGE_MANAGERS: {
  id: PackageManagerType;
  name: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  runInit: string;
  runAdd: string;
  installPkg: string;
}[] = [
  { id: "pnpm", name: "pnpm", IconComponent: PnpmIcon, runInit: "pnpm dlx nexoreui init", runAdd: "pnpm dlx nexoreui add", installPkg: "pnpm add" },
  { id: "npm", name: "npm", IconComponent: NpmIcon, runInit: "npx nexoreui init", runAdd: "npx nexoreui add", installPkg: "npm install" },
  { id: "yarn", name: "yarn", IconComponent: YarnIcon, runInit: "yarn dlx nexoreui init", runAdd: "yarn dlx nexoreui add", installPkg: "yarn add" },
  { id: "bun", name: "bun", IconComponent: BunIcon, runInit: "bunx nexoreui init", runAdd: "bunx nexoreui add", installPkg: "bun add" },
];

/* ─── Component Presets ─── */
const PRESETS = [
  { id: "starter", name: "Essential Starter", desc: "Button, Input, Card, Modal, Badge, Switch", components: ["button", "input", "card", "modal", "badge", "switch"] },
  { id: "ai", name: "AI & Agentic Suite", desc: "Aurora Border Card, AI Prompt Input, Command", components: ["aurora-border-card", "ai-prompt-input", "command"] },
  { id: "saas", name: "SaaS & Dashboard Kit", desc: "Charts, Table, Tabs, Stepper, Scroll Area, Data Display, Navigation", components: ["charts", "table", "tabs", "stepper", "scroll-area", "data-display", "navigation"] },
  { id: "full", name: "Full Suite (All 40)", desc: "All handcrafted UI, AI, and animated components", components: ["all"] },
  { id: "custom", name: "Custom Selection", desc: "Pick exactly the components you need", components: [] },
];

const ALL_COMPONENTS_LIST = [
  "button", "input", "switch", "slider", "rating", "file-upload",
  "card", "accordion", "tabs", "table", "stepper", "scroll-area", "navigation", "dock", "data-display",
  "modal", "alert", "badge", "avatar", "tooltip", "progress", "skeleton", "loaders",
  "aurora-border-card", "morphing-geometry", "interactive-code-block", "ai-prompt-input", "command",
  "marquee", "number-ticker", "animated-number", "typing-animation", "blur-fade", "box-reveal", "file-preview-card", "image-compare", "premium-effects",
  "charts", "commerce", "dark-mode", "cookie", "social"
];

const GENERATION_CHECKLIST = [
  "Project configuration",
  "Dependencies",
  "Tailwind CSS setup",
  "Theme tokens",
  "Selected components",
  "TypeScript configuration",
  "Utilities",
];

function getCssPath(fw: FrameworkType): string {
  if (fw === "next-app") return "app/globals.css";
  if (fw === "next-pages") return "styles/globals.css";
  if (fw === "remix") return "app/tailwind.css";
  if (fw === "astro") return "src/styles/global.css";
  return "src/index.css";
}

function getConfigPath(): string {
  return "./nexore.json";
}

/* ═══════════════════════════════════════════════════════════════════════ */

export function CreateProjectPageClient() {
  const {
    themeColor, setThemeColor,
    radius, setRadius,
    framework, setFramework,
    packageManager, setPackageManager,
    fontFamily, setFontFamily,
    density, setDensity,
    animationStyle, setAnimationStyle,
    defaultMode, setDefaultMode,
    applyThemeToDocs, setApplyThemeToDocs,
    getGlobalsCssSnippet, getNexoreConfigSnippet,
  } = useThemeCustomizer();

  const [selectedPresetId, setSelectedPresetId] = useState<string>("starter");
  const [customSelectedComps, setCustomSelectedComps] = useState<string[]>(["button", "card", "input", "modal", "badge", "switch"]);
  const [installationMode, setInstallationMode] = useState<"minimal" | "full">("minimal");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Production-Ready Generation Flow States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generationStepIndex, setGenerationStepIndex] = useState(0);
  const [activeGeneratedTab, setActiveGeneratedTab] = useState<"cli" | "css" | "config" | "pkg" | "utils">("cli");

  // Right sidebar main tabs: 'sandbox' | 'setup'
  const [rightSidebarTab, setRightSidebarTab] = useState<"sandbox" | "setup">("sandbox");

  // Showcase category switcher
  const [sandboxCategory, setSandboxCategory] = useState<"all" | "ai" | "cards" | "forms" | "actions">("all");

  // Sandbox canvas light / dark preview toggle
  const [sandboxThemeMode, setSandboxThemeMode] = useState<"dark" | "light">("dark");

  // Motion physics test trigger
  const [motionTriggerCount, setMotionTriggerCount] = useState(0);

  // Sandbox interactive preview states
  const [sandboxClicks, setSandboxClicks] = useState(0);
  const [sandboxSwitch, setSandboxSwitch] = useState(true);
  const [sandboxCheckbox, setSandboxCheckbox] = useState(true);
  const [sandboxInput, setSandboxInput] = useState("Customizing my NexoreUI project...");
  const [sandboxSlider, setSandboxSlider] = useState(68);
  const [sandboxProgress, setSandboxProgress] = useState(74);
  const [sandboxRating, setSandboxRating] = useState(4);
  const [sandboxTab, setSandboxTab] = useState<"overview" | "analytics" | "reports">("overview");
  const [sandboxAgentRunning, setSandboxAgentRunning] = useState(true);
  const [sandboxPromptInput, setSandboxPromptInput] = useState("Generate auth middleware for Next.js 15");

  const activeColorPreset = COLOR_PRESETS[themeColor] || COLOR_PRESETS.indigo;
  const activeFontOption = FONT_OPTIONS.find((f) => f.id === fontFamily) || FONT_OPTIONS[0];

  const { theme, setTheme, resolvedTheme } = useTheme();

  // Handler to sync theme across Studio Sandbox, Studio Configurator, and whole NexoreUI App
  const handleSetThemeMode = (mode: "dark" | "light") => {
    setSandboxThemeMode(mode);
    setDefaultMode(mode);
    setTheme(mode);
  };

  // Keep sandbox and default mode synced when user toggles the global header theme
  useEffect(() => {
    if (resolvedTheme === "dark" || resolvedTheme === "light") {
      setSandboxThemeMode(resolvedTheme);
      setDefaultMode(resolvedTheme);
    }
  }, [resolvedTheme, setDefaultMode]);

  // Real-time live theme application for /create page
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");

    root.style.setProperty("--primary", isDark ? activeColorPreset.primaryDark : activeColorPreset.primaryLight);
    root.style.setProperty("--ring", isDark ? activeColorPreset.ringDark : activeColorPreset.ringLight);
    root.style.setProperty("--primary-rgb", activeColorPreset.rgb);
    root.style.setProperty("--radius", `${radius}rem`);

    return () => {
      if (!applyThemeToDocs) {
        const defaultPreset = COLOR_PRESETS.indigo;
        root.style.setProperty("--primary", isDark ? defaultPreset.primaryDark : defaultPreset.primaryLight);
        root.style.setProperty("--ring", isDark ? defaultPreset.ringDark : defaultPreset.ringLight);
        root.style.setProperty("--primary-rgb", defaultPreset.rgb);
        root.style.setProperty("--radius", "0.75rem");
      }
    };
  }, [themeColor, radius, activeColorPreset, applyThemeToDocs]);

  const handleCopy = async (text: string, label: string) => {
    await copyToClipboard(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleComponent = (comp: string) => {
    setCustomSelectedComps((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  const currentPmConfig = PACKAGE_MANAGERS.find((p) => p.id === packageManager) || PACKAGE_MANAGERS[0];
  const currentFwConfig = FRAMEWORKS.find((f) => f.id === framework) || FRAMEWORKS[0];

  const getActiveComponents = () => {
    if (selectedPresetId === "full") return "all";
    if (selectedPresetId === "custom") {
      if (installationMode === "full") return "all";
      return customSelectedComps;
    }
    const preset = PRESETS.find((p) => p.id === selectedPresetId);
    return preset ? preset.components : [];
  };

  const getSelectedComponentsCount = (): number => {
    const comps = getActiveComponents();
    if (comps === "all") return ALL_COMPONENTS_LIST.length;
    if (Array.isArray(comps)) return comps.length;
    return 0;
  };

  const getAddCommand = () => {
    const activeComps = getActiveComponents();
    if (activeComps === "all") return `${currentPmConfig.runAdd} ${ALL_COMPONENTS_LIST.slice(0, 10).join(" ")} --all`;
    if (Array.isArray(activeComps)) {
      if (activeComps.length === 0) return `${currentPmConfig.runAdd} button`;
      return `${currentPmConfig.runAdd} ${activeComps.join(" ")}`;
    }
    return `${currentPmConfig.runAdd} button`;
  };

  const getInitCommand = () => {
    return `${currentPmConfig.runInit} --theme ${themeColor} --radius ${radius}`;
  };

  const getFullCliCommand = () => {
    return `${getInitCommand()} && ${getAddCommand()}`;
  };

  const getPackageJsonSnippet = () => {
    return JSON.stringify(
      {
        name: "my-nexore-app",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: framework.startsWith("next") ? "next dev" : framework === "vite" ? "vite" : "npm run dev",
          build: framework.startsWith("next") ? "next build" : "npm run build",
          start: framework.startsWith("next") ? "next start" : "npm run start"
        },
        dependencies: {
          "nexoreui": "^0.1.3",
          "react": "^19.0.0",
          "react-dom": "^19.0.0",
          "framer-motion": "^11.1.7",
          "lucide-react": "^0.378.0",
          "clsx": "^2.1.1",
          "tailwind-merge": "^2.3.0"
        }
      },
      null,
      2
    );
  };

  const getUtilsSnippet = () => {
    return `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  };

  const getAllCodeBundle = () => {
    return `/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NexoreUI Project Setup & Configuration Bundle
   Framework: ${currentFwConfig.name}
   Package Manager: ${currentPmConfig.name}
   Theme: ${activeColorPreset.label} (${themeColor})
   Radius: ${radius}rem
   Components: ${getSelectedComponentsCount()} selected
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

// 1. CLI Commands:
${getFullCliCommand()}

// 2. ${getConfigPath()}
${getNexoreConfigSnippet()}

// 3. ${getCssPath(framework)}
${getGlobalsCssSnippet()}

// 4. lib/utils.ts
${getUtilsSnippet()}
`;
  };

  // Generation trigger workflow
  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenerationComplete(false);
    setGenerationStepIndex(0);

    // Automatically and smoothly scroll to the generated project section
    setTimeout(() => {
      const el = document.getElementById("generated-project-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 40);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setGenerationStepIndex(current);
      if (current >= GENERATION_CHECKLIST.length) {
        clearInterval(interval);
        setTimeout(() => {
          setGenerationComplete(true);
          const el = document.getElementById("generated-project-section");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 200);
      }
    }, 180);
  };

  const handleResetGeneration = () => {
    setIsGenerating(false);
    setGenerationComplete(false);
    setGenerationStepIndex(0);
  };

  /* ─── Motion transition configs for Sandbox based on animationStyle ─── */
  const getMotionProps = () => {
    if (animationStyle === "none") {
      return {
        transition: { duration: 0 },
        whileHover: {},
        whileTap: {},
      };
    }
    if (animationStyle === "energetic") {
      return {
        transition: { type: "spring", stiffness: 450, damping: 14, mass: 0.8 },
        whileHover: { scale: 1.05, y: -2 },
        whileTap: { scale: 0.92 },
      };
    }
    // subtle
    return {
      transition: { duration: 0.25, ease: "easeInOut" },
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.97 },
    };
  };

  /* ─── Density classes mapped ─── */
  const densityPadding = density === "compact" ? "p-2.5 space-y-2" : density === "relaxed" ? "p-5 space-y-4" : "p-3.5 space-y-3";
  const densityButtonClass = density === "compact" ? "py-1.5 px-2.5 text-[11px] h-7.5" : density === "relaxed" ? "py-2.5 px-4 text-sm h-10.5" : "py-2 px-3 text-xs h-9";
  const densityInputClass = density === "compact" ? "py-1.5 text-[11px] pl-8" : density === "relaxed" ? "py-2.5 text-sm pl-10" : "py-2 text-xs pl-9";

  /* ─── Step-by-step guide data ─── */
  const setupSteps = [
    {
      num: 1,
      title: "Initialize project & theme",
      desc: "Scaffold the NexoreUI configuration and install dependencies automatically.",
      icon: Terminal,
      code: getInitCommand(),
      filePath: null,
      hint: "Creates nexore.json and installs required packages.",
    },
    {
      num: 2,
      title: "Verify nexore.json",
      desc: "Project configuration file generated at project root.",
      icon: FileJson,
      code: getNexoreConfigSnippet(),
      filePath: getConfigPath(),
      hint: `File location: ${getConfigPath()}`,
    },
    {
      num: 3,
      title: "Update globals.css",
      desc: "Replace CSS variables with the generated design tokens.",
      icon: Palette,
      code: getGlobalsCssSnippet(),
      filePath: getCssPath(framework),
      hint: `File location: ${getCssPath(framework)}`,
    },
    {
      num: 4,
      title: "Add components",
      desc: "Install the selected components directly to your codebase.",
      icon: Package,
      code: getAddCommand(),
      filePath: null,
      hint: "Files added to @/components/ui/ — 100% editable TypeScript.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-background text-foreground relative transition-colors duration-300"
      style={{
        "--radius": `${radius}rem`,
        "--primary-rgb": activeColorPreset.rgb,
      } as React.CSSProperties}
    >
      {/* Dynamic Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full blur-[160px] opacity-20 dark:opacity-25 transition-colors duration-700"
          style={{ backgroundColor: activeColorPreset.previewHex }}
        />
        <div
          className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full blur-[140px] opacity-10 dark:opacity-15 transition-colors duration-700"
          style={{ backgroundColor: activeColorPreset.previewHex }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ═══ Header / Hero Section ═══ */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary transition-colors duration-300">
            <Wand2 className="h-3.5 w-3.5" />
            <span>Interactive Project & Theme Studio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Build Your <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-cyan-500 dark:from-primary dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent">NexoreUI</span> Stack
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Choose your framework, theme, components and motion. Generate a production-ready NexoreUI project in seconds.
          </p>

          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground pt-1 flex-wrap">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Tailwind CSS v4</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Live Visual Feedback</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Code2 className="h-4 w-4 text-violet-500 dark:text-violet-400" />
              <span>100% TypeScript</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>Zero Vendor Lock-in</span>
            </div>
          </div>
        </div>

        {/* ═══ Main Generation Modal / View (When Triggered) ═══ */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              id="generated-project-section"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-primary/10 relative overflow-hidden scroll-mt-24"
            >
              {/* Background gradient decorative glow */}
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

              {!generationComplete ? (
                /* Animated Generation Progress Checklist */
                <div className="max-w-xl mx-auto py-8 text-center space-y-6">
                  <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 animate-pulse">
                    <Wand2 className="h-6 w-6" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      Generating Your Production Stack...
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Synthesizing configuration files, token bindings, and component registry for {currentFwConfig.name}.
                    </p>
                  </div>

                  <div className="space-y-2 text-left max-w-sm mx-auto pt-2 bg-muted/40 p-4 rounded-xl border border-border">
                    {GENERATION_CHECKLIST.map((stepName, idx) => {
                      const isDone = idx < generationStepIndex;
                      const isCurrent = idx === generationStepIndex;
                      return (
                        <div
                          key={stepName}
                          className={`flex items-center gap-2.5 text-xs font-mono transition-colors ${
                            isDone
                              ? "text-emerald-500 font-semibold"
                              : isCurrent
                              ? "text-primary font-bold animate-pulse"
                              : "text-muted-foreground/40"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : isCurrent ? (
                            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-border shrink-0" />
                          )}
                          <span>{stepName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Generation Success Screen */
                <div className="space-y-6">
                  {/* Success Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0 shadow-sm">
                        <Check className="h-6 w-6 stroke-[3]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                            Your NexoreUI project is ready.
                          </h2>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-semibold">
                            Production Ready
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {currentFwConfig.name} • {currentPmConfig.name} • {activeColorPreset.label} theme • {radius}rem radius • {getSelectedComponentsCount()} components
                        </p>
                      </div>
                    </div>

                    {/* Main Action Buttons */}
                    <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
                      <button
                        onClick={() => handleCopy(getAllCodeBundle(), "main-copy-code")}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md shadow-primary/20"
                      >
                        {copiedCode === "main-copy-code" ? (
                          <><Check className="h-3.5 w-3.5" /><span>Code Copied!</span></>
                        ) : (
                          <><Copy className="h-3.5 w-3.5" /><span>Copy Code</span></>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(getFullCliCommand(), "main-copy-cli")}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-muted border border-border text-foreground hover:bg-muted/80 text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        {copiedCode === "main-copy-cli" ? (
                          <><Check className="h-3.5 w-3.5 text-emerald-500" /><span className="text-emerald-500">Command Copied!</span></>
                        ) : (
                          <><Terminal className="h-3.5 w-3.5 text-primary" /><span>Copy CLI Command</span></>
                        )}
                      </button>

                      <button
                        onClick={handleResetGeneration}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Create Another Project</span>
                      </button>
                    </div>
                  </div>

                  {/* Checklist summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {GENERATION_CHECKLIST.map((step) => (
                      <div
                        key={step}
                        className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/40 border border-border text-[11px] font-mono text-muted-foreground"
                      >
                        <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Generated Project Files Explorer Tabs */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar p-1 rounded-xl bg-muted/60 border border-border">
                        {[
                          { id: "cli", label: "CLI Commands", icon: Terminal },
                          { id: "config", label: "nexore.json", icon: FileJson },
                          { id: "css", label: getCssPath(framework), icon: FileCode },
                          { id: "pkg", label: "package.json", icon: Package },
                          { id: "utils", label: "lib/utils.ts", icon: FileText },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          const isSelected = activeGeneratedTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveGeneratedTab(tab.id as any)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-background text-foreground shadow-sm font-semibold border border-border"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5 text-primary" />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          const textToCopy =
                            activeGeneratedTab === "cli" ? getFullCliCommand() :
                            activeGeneratedTab === "config" ? getNexoreConfigSnippet() :
                            activeGeneratedTab === "css" ? getGlobalsCssSnippet() :
                            activeGeneratedTab === "pkg" ? getPackageJsonSnippet() :
                            getUtilsSnippet();
                          handleCopy(textToCopy, `tab-${activeGeneratedTab}`);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-xs font-semibold text-primary transition-colors cursor-pointer"
                      >
                        {copiedCode === `tab-${activeGeneratedTab}` ? (
                          <><Check className="h-3.5 w-3.5 text-emerald-500" /><span>Copied!</span></>
                        ) : (
                          <><Copy className="h-3.5 w-3.5" /><span>Copy File</span></>
                        )}
                      </button>
                    </div>

                    {/* Tab Code Output Canvas */}
                    <div className="relative rounded-xl overflow-hidden border border-border bg-zinc-950 text-zinc-100 shadow-inner">
                      <pre className="p-4 text-xs font-mono overflow-x-auto max-h-72 whitespace-pre-wrap break-all leading-relaxed">
                        {activeGeneratedTab === "cli" && `# 1. Initialize project with ${themeColor} theme and ${radius}rem radius\n${getInitCommand()}\n\n# 2. Add selected components (${getSelectedComponentsCount()} items)\n${getAddCommand()}`}
                        {activeGeneratedTab === "config" && getNexoreConfigSnippet()}
                        {activeGeneratedTab === "css" && getGlobalsCssSnippet()}
                        {activeGeneratedTab === "pkg" && getPackageJsonSnippet()}
                        {activeGeneratedTab === "utils" && getUtilsSnippet()}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ 2-Column Main Workspace ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ─── Left Column: Configuration Steps (7 Columns) ─── */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Step 1: Framework Selection */}
            <StepCard num={1} total={6} title="Framework & Architecture" icon={Laptop}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FRAMEWORKS.map((fw) => {
                  const isSelected = framework === fw.id;
                  const Icon = fw.IconComponent;
                  return (
                    <button
                      key={fw.id}
                      onClick={() => setFramework(fw.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-sm"
                          : "border-border bg-card/60 text-muted-foreground hover:border-border/80 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <Icon className="w-4.5 h-4.5 text-foreground" />
                        </div>
                        <span className="font-bold text-xs text-foreground">{fw.name}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground line-clamp-1">{fw.desc}</span>
                      <span className={`mt-2 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-primary/20 text-primary font-medium" : "bg-muted text-muted-foreground"
                      }`}>
                        {fw.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </StepCard>

            {/* Step 2: Package Manager */}
            <StepCard num={2} total={6} title="Package Manager" icon={Terminal}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PACKAGE_MANAGERS.map((pm) => {
                  const isSelected = packageManager === pm.id;
                  const Icon = pm.IconComponent;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setPackageManager(pm.id)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-medium transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary"
                          : "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-xs font-semibold">{pm.name}</span>
                      <span className="text-[10px] text-muted-foreground">{pm.installPkg}</span>
                    </button>
                  );
                })}
              </div>
            </StepCard>

            {/* Step 3: Color Palette & Radius */}
            <StepCard num={3} total={6} title="Color Palette & Radius" icon={Palette}>
              {/* Color Swatches */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Palette:</span>
                  <span className="font-mono text-primary font-bold capitalize transition-colors duration-300">
                    {activeColorPreset.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {Object.values(COLOR_PRESETS).map((preset) => {
                    const isSelected = themeColor === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setThemeColor(preset.id)}
                        className={`group flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-1 ring-offset-background font-semibold"
                            : "border-border bg-card/60 hover:border-border/80"
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: preset.previewHex }} />
                        <span className="text-[11px] text-muted-foreground group-hover:text-foreground capitalize truncate">
                          {preset.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Radius Options */}
              <div className="space-y-2 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Border Radius:</span>
                  <span className="font-mono text-primary font-bold transition-colors duration-300">{radius}rem</span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {RADIUS_PRESETS.map((r) => {
                    const isSelected = radius === r.value;
                    return (
                      <button
                        key={r.value}
                        onClick={() => setRadius(r.value)}
                        className={`py-1.5 text-xs font-mono rounded-lg border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary"
                            : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {r.label.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </StepCard>

            {/* Step 4: Typography, Density, Motion & Default Mode */}
            <StepCard num={4} total={6} title="Typography, Density & Motion" icon={Sliders}>
              {/* Default Mode */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Default Mode:</span>
                  <span className="font-mono text-primary font-bold capitalize">{defaultMode} Mode</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {(["dark", "light"] as DefaultModeType[]).map((mode) => {
                    const isSelected = defaultMode === mode;
                    const ModeIcon = mode === "dark" ? Moon : Sun;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleSetThemeMode(mode)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary font-bold"
                            : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ModeIcon className="h-4 w-4 shrink-0 text-primary" />
                        <span className="text-xs font-semibold capitalize">{mode} Mode</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-2 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Font Family:</span>
                  <span className="font-mono text-primary font-bold">{activeFontOption.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_OPTIONS.map((f) => {
                    const isSelected = fontFamily === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFontFamily(f.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "border-border bg-card/60 hover:border-border/80"
                        }`}
                      >
                        <span className="text-xs font-bold text-foreground block" style={{ fontFamily: f.css }}>{f.label}</span>
                        <span className="text-[10px] text-muted-foreground font-mono truncate block mt-0.5">{f.css.split(",")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* UI Density */}
              <div className="space-y-2 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">UI Density (Padding & Sizing):</span>
                  <span className="font-mono text-primary font-bold capitalize">{density}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DENSITY_OPTIONS.map((d) => {
                    const isSelected = density === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setDensity(d.id)}
                        className={`flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "border-border bg-card/60 hover:border-border/80"
                        }`}
                      >
                        <Gauge className={`h-3.5 w-3.5 mb-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-xs font-bold text-foreground">{d.label}</span>
                        <span className="text-[10px] text-muted-foreground text-center leading-tight mt-0.5">{d.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Animation Style */}
              <div className="space-y-2 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Animation Style:</span>
                  <span className="font-mono text-primary font-bold capitalize">{animationStyle}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ANIMATION_OPTIONS.map((a) => {
                    const isSelected = animationStyle === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setAnimationStyle(a.id)}
                        className={`flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary"
                            : "border-border bg-card/60 hover:border-border/80"
                        }`}
                      >
                        <Zap className={`h-3.5 w-3.5 mb-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-xs font-bold text-foreground">{a.label}</span>
                        <span className="text-[10px] text-muted-foreground text-center leading-tight mt-0.5">{a.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </StepCard>

            {/* Step 5: Component Bundles & Custom Selection */}
            <StepCard num={5} total={6} title="Component Selection & Installation Mode" icon={Box}>
              {/* Presets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESETS.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPresetId(p.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-sm"
                          : "border-border bg-card/60 text-muted-foreground hover:border-border/80 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-xs text-foreground">{p.name}</span>
                        {p.id !== "full" && p.components.length > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                            {p.components.length} comps
                          </span>
                        )}
                        {p.id === "full" && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/20 text-primary font-semibold">
                            41 comps
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground leading-tight">{p.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Selection Mode & Checklist */}
              {selectedPresetId === "custom" && (
                <div className="pt-4 border-t border-border/60 space-y-4">
                  {/* Installation Mode Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Installation Mode</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                        {installationMode === "minimal" ? `${customSelectedComps.length} / ${ALL_COMPONENTS_LIST.length} components selected` : "41 / 41 components selected"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Minimal Option */}
                      <button
                        type="button"
                        onClick={() => setInstallationMode("minimal")}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          installationMode === "minimal"
                            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                            : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-foreground">Minimal</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/20 text-primary font-bold">
                            {customSelectedComps.length} / {ALL_COMPONENTS_LIST.length}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          Install/include only the components selected by the user.
                        </p>
                      </button>

                      {/* Full Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setInstallationMode("full");
                          setCustomSelectedComps([...ALL_COMPONENTS_LIST]);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          installationMode === "full"
                            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                            : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-foreground">Full</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/20 text-primary font-bold">
                            41 / 41
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          Include the complete NexoreUI component system.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Component Checkboxes (Active in Minimal mode or custom toggle) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Pick individual components:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCustomSelectedComps([...ALL_COMPONENTS_LIST]);
                            setInstallationMode("minimal");
                          }}
                          className="text-primary hover:underline text-[11px] cursor-pointer font-medium"
                        >
                          Select All (41)
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => {
                            setCustomSelectedComps([]);
                            setInstallationMode("minimal");
                          }}
                          className="text-muted-foreground hover:underline text-[11px] cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-52 overflow-y-auto p-2.5 rounded-xl bg-muted/40 border border-border">
                      {ALL_COMPONENTS_LIST.map((comp) => {
                        const isChecked = customSelectedComps.includes(comp);
                        return (
                          <button
                            key={comp}
                            onClick={() => {
                              toggleComponent(comp);
                              setInstallationMode("minimal");
                            }}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono text-left transition-colors cursor-pointer ${
                              isChecked
                                ? "bg-primary/15 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {isChecked ? <CheckSquare className="h-3.5 w-3.5 text-primary shrink-0" /> : <Square className="h-3.5 w-3.5 opacity-40 shrink-0" />}
                            <span className="truncate text-[11px]">{comp}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </StepCard>

            {/* Step 6: Test Theme on Docs Site */}
            <StepCard num={6} total={6} title="Apply to Documentation Site" icon={Eye}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">Global Site Preview</span>
                      {applyThemeToDocs && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                          Active Everywhere
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Preview on this page is always live in real-time. Enable this switch to temporarily preview your theme across all documentation pages.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApplyThemeToDocs(!applyThemeToDocs)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center border cursor-pointer shrink-0 ml-3 ${
                      applyThemeToDocs ? "bg-primary border-primary/50" : "bg-muted border-border"
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                        applyThemeToDocs ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {applyThemeToDocs && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                    <span className="text-muted-foreground text-[11px]">Custom theme is currently active across all documentation pages</span>
                    <button
                      type="button"
                      onClick={() => {
                        setApplyThemeToDocs(false);
                        setThemeColor("indigo");
                        setRadius("0.75");
                      }}
                      className="text-primary hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      Reset to Signature NexoreUI
                    </button>
                  </div>
                )}
              </div>
            </StepCard>

            {/* ═══ Big Primary 'Create Project' Action Trigger Card ═══ */}
            <div className="p-6 rounded-2xl border-2 border-primary/40 bg-card/80 backdrop-blur-md space-y-4 shadow-xl shadow-primary/5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">Ready to Build Your Stack?</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generate the full production setup with {currentFwConfig.name}, {activeColorPreset.label} theme, and {getSelectedComponentsCount()} components.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartGeneration}
                  disabled={isGenerating && !generationComplete}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/25 group disabled:opacity-80"
                >
                  {isGenerating && !generationComplete ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      <span>Generating Project...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                      <span>Create Project</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* ─── Right Column: Tabbed Live Sandbox & Setup Guide (5 Columns) ─── */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            
            {/* Main Tabs Switcher */}
            <div className="flex p-1 rounded-xl bg-card border border-border shadow-md">
              <button
                onClick={() => setRightSidebarTab("sandbox")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                  rightSidebarTab === "sandbox"
                    ? "text-foreground bg-primary/15 text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Live Sandbox</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
              <button
                onClick={() => setRightSidebarTab("setup")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                  rightSidebarTab === "setup"
                    ? "text-foreground bg-primary/15 text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Setup & Code</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">4 steps</span>
              </button>
            </div>

            {/* TAB 1: Live Component Sandbox */}
            {rightSidebarTab === "sandbox" && (
              <div
                className={`rounded-2xl border backdrop-blur-md space-y-4 shadow-2xl transition-all duration-300 p-4 sm:p-5 ${
                  sandboxThemeMode === "light"
                    ? "bg-white text-zinc-900 shadow-zinc-200 border-zinc-200"
                    : "bg-zinc-950/90 text-zinc-100 border-zinc-800/90 shadow-black/50"
                }`}
                style={{
                  fontFamily: activeFontOption.css,
                  "--primary": sandboxThemeMode === "light" ? activeColorPreset.primaryLight : activeColorPreset.primaryDark,
                  "--ring": sandboxThemeMode === "light" ? activeColorPreset.ringLight : activeColorPreset.ringDark,
                } as React.CSSProperties}
              >
                {/* Sandbox Header: Title + Theme Toggle + Live Indicator */}
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary transition-colors duration-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Live Component Sandbox
                    </span>
                  </div>

                  {/* Mode switch (Dark / Light) for immediate canvas & app theme sync */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center p-0.5 rounded-lg bg-muted border border-border">
                      <button
                        type="button"
                        onClick={() => handleSetThemeMode("dark")}
                        className={`p-1 rounded-md text-xs transition-colors cursor-pointer ${
                          sandboxThemeMode === "dark" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Switch to Dark Mode"
                      >
                        <Moon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetThemeMode("light")}
                        className={`p-1 rounded-md text-xs transition-colors cursor-pointer ${
                          sandboxThemeMode === "light" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Switch to Light Mode"
                      >
                        <Sun className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Customizer Badges Strip */}
                <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-muted-foreground">
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-semibold">
                    {activeColorPreset.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-muted border border-border">
                    r: {radius}rem
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-muted border border-border">
                    {activeFontOption.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-muted border border-border capitalize">
                    {density}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-muted border border-border capitalize">
                    {animationStyle} motion
                  </span>
                </div>

                {/* Showcase Category Switcher with Lucide Icons */}
                <div className="flex gap-1 p-1 rounded-xl bg-muted/60 border border-border/80 overflow-x-auto hide-scrollbar">
                  {[
                    { id: "all", label: "All Showcase", icon: Sparkles },
                    { id: "ai", label: "AI & Agents", icon: Bot },
                    { id: "cards", label: "Cards & Data", icon: BarChart3 },
                    { id: "forms", label: "Forms & Inputs", icon: SlidersHorizontal },
                    { id: "actions", label: "Buttons & Badges", icon: Zap },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = sandboxCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSandboxCategory(cat.id as any)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-primary" : ""}`} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* ─── Category: Actions & Buttons ─── */}
                {(sandboxCategory === "all" || sandboxCategory === "actions") && (
                  <div className={`rounded-xl bg-muted/20 border border-border/60 ${densityPadding}`}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-primary" />
                        <span>Buttons & Micro-interactions</span>
                      </span>
                      <span className="font-mono text-[10px]">Clicks: {sandboxClicks}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <motion.button
                        {...getMotionProps()}
                        onClick={() => setSandboxClicks((c) => c + 1)}
                        className={`bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(var(--primary-rgb),0.35)] ${densityButtonClass}`}
                        style={{ borderRadius: `${radius}rem` }}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Primary</span>
                      </motion.button>

                      <motion.button
                        {...getMotionProps()}
                        onClick={() => setSandboxClicks((c) => c + 1)}
                        className={`border border-primary/40 bg-primary/10 text-primary font-semibold hover:bg-primary/20 flex items-center justify-center cursor-pointer ${densityButtonClass}`}
                        style={{ borderRadius: `${radius}rem` }}
                      >
                        Outline
                      </motion.button>

                      <motion.button
                        {...getMotionProps()}
                        onClick={() => setSandboxClicks((c) => c + 1)}
                        className={`border border-border bg-muted/50 text-muted-foreground font-medium hover:bg-muted flex items-center justify-center cursor-pointer ${densityButtonClass}`}
                        style={{ borderRadius: `${radius}rem` }}
                      >
                        Ghost
                      </motion.button>
                    </div>

                    {/* Motion Physics Test Trigger */}
                    <div className="flex items-center justify-between pt-1 border-t border-border/40">
                      <span className="text-[11px] text-muted-foreground">Test Motion Physics:</span>
                      <motion.button
                        {...getMotionProps()}
                        onClick={() => setMotionTriggerCount((c) => c + 1)}
                        className="px-2.5 py-1 rounded-md bg-primary/15 hover:bg-primary/25 text-primary text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="h-3 w-3" />
                        <span>Play Motion ({animationStyle})</span>
                      </motion.button>
                    </div>

                    {/* Badges Stack */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold bg-primary text-primary-foreground shadow-xs"
                        style={{ borderRadius: `${radius}rem` }}
                      >
                        Featured
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium bg-primary/15 border border-primary/30 text-primary"
                        style={{ borderRadius: `${radius}rem` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Live Status
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-mono bg-muted text-muted-foreground border border-border"
                        style={{ borderRadius: `${radius}rem` }}
                      >
                        v1.4.0
                      </span>
                    </div>
                  </div>
                )}

                {/* ─── Category: AI & Agentic Suite ─── */}
                {(sandboxCategory === "all" || sandboxCategory === "ai") && (
                  <div className={`rounded-xl bg-muted/20 border border-border/60 ${densityPadding}`}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                        <span>AI & Agentic Suite</span>
                      </span>
                      <button
                        onClick={() => setSandboxAgentRunning((r) => !r)}
                        className="text-[10px] text-primary hover:underline font-mono cursor-pointer"
                      >
                        {sandboxAgentRunning ? "Pause" : "Resume"}
                      </button>
                    </div>

                    {/* Agent Status Pill */}
                    <div
                      className="flex items-center justify-between p-2.5 bg-card/80 border border-border shadow-xs"
                      style={{ borderRadius: `${radius}rem` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${sandboxAgentRunning ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"}`} />
                        <span className="text-xs font-semibold text-foreground">Nexore-Agent-v2</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md border border-border">
                        124ms • 1.2k tokens
                      </span>
                    </div>

                    {/* AI Thinking Indicator Card */}
                    <div
                      className="p-3 bg-primary/5 border border-primary/20 space-y-1.5"
                      style={{ borderRadius: `${radius}rem` }}
                    >
                      <div className="flex items-center justify-between text-xs text-primary font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Cpu className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "3s" }} />
                          <span>Thinking...</span>
                        </div>
                        <span className="text-[10px] font-mono opacity-80">Step 2 of 4</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Synthesizing design tokens for <span className="text-foreground font-semibold font-mono">{themeColor}</span> theme with radius <span className="text-foreground font-semibold font-mono">{radius}rem</span>.
                      </p>
                    </div>

                    {/* Interactive Prompt Tester */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={sandboxPromptInput}
                          onChange={(e) => setSandboxPromptInput(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 text-[11px] bg-card border border-border text-foreground outline-none focus:border-primary"
                          style={{ borderRadius: `${radius}rem` }}
                        />
                        <motion.button
                          {...getMotionProps()}
                          onClick={() => {
                            setSandboxAgentRunning(true);
                            setSandboxClicks((c) => c + 1);
                          }}
                          className="px-2.5 py-1.5 bg-primary text-primary-foreground text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          style={{ borderRadius: `${radius}rem` }}
                        >
                          <Send className="h-3 w-3" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Category: Cards & Data ─── */}
                {(sandboxCategory === "all" || sandboxCategory === "cards") && (
                  <div className={`rounded-xl bg-muted/20 border border-border/60 ${densityPadding}`}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <BarChart3 className="h-3.5 w-3.5 text-primary" />
                        <span>Cards & Analytics Metric</span>
                      </span>
                    </div>

                    {/* Stats Metric Card */}
                    <div
                      className="p-3.5 bg-card/90 border border-border space-y-3 shadow-sm"
                      style={{ borderRadius: `${radius}rem` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground font-medium">Monthly Revenue</p>
                            <p className="text-lg font-extrabold text-foreground tracking-tight">$48,290.00</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          +24.8%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>Target completion</span>
                          <span className="font-mono text-primary font-bold">{sandboxProgress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted border border-border overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300 rounded-full"
                            style={{ width: `${sandboxProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Segmented Tabs Preview */}
                    <div className="space-y-1.5">
                      <div className="flex gap-1 p-1 rounded-xl bg-muted/60 border border-border">
                        {(["overview", "analytics", "reports"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setSandboxTab(tab)}
                            className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition-all capitalize cursor-pointer ${
                              sandboxTab === tab
                                ? "bg-background text-foreground shadow-sm font-bold"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      <div className="p-2.5 rounded-xl bg-card/60 border border-border text-[11px] text-muted-foreground">
                        Viewing <span className="text-primary font-bold capitalize">{sandboxTab}</span> metrics with live theme styling.
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Category: Forms & Inputs ─── */}
                {(sandboxCategory === "all" || sandboxCategory === "forms") && (
                  <div className={`rounded-xl bg-muted/20 border border-border/60 ${densityPadding}`}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                        <span>Form Controls & Inputs</span>
                      </span>
                    </div>

                    {/* Themed Input Field */}
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground font-medium">Search & Input</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          value={sandboxInput}
                          onChange={(e) => setSandboxInput(e.target.value)}
                          className={`w-full pr-8 bg-card/80 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground ${densityInputClass}`}
                          style={{ borderRadius: `${radius}rem` }}
                        />
                        {sandboxInput && (
                          <button
                            onClick={() => setSandboxInput("")}
                            className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Interactive Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Interactive Range Slider</span>
                        <span className="font-mono text-primary font-bold">{sandboxSlider}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sandboxSlider}
                        onChange={(e) => setSandboxSlider(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-lg"
                      />
                    </div>

                    {/* Switch + Star Rating Row */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSandboxSwitch((s) => !s)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer border ${
                            sandboxSwitch ? "bg-primary border-primary/50" : "bg-muted border-border"
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                              sandboxSwitch ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-xs font-medium">Auto-save</span>
                      </div>

                      {/* Interactive 5-Star Rating */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setSandboxRating(star)}
                            className="text-primary hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${
                                star <= sandboxRating ? "fill-primary text-primary" : "text-muted-foreground/40"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Setup Guide & Code Snippets */}
            {rightSidebarTab === "setup" && (
              <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-md overflow-hidden shadow-xl space-y-0">
                {/* Header with Quick Copy All */}
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-primary transition-colors duration-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Project Setup Guide</span>
                  </div>

                  <button
                    onClick={() => handleCopy(`${getInitCommand()}\n${getAddCommand()}`, "quick-copy-all")}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copiedCode === "quick-copy-all" ? (
                      <><Check className="h-3 w-3" /><span>Copied!</span></>
                    ) : (
                      <><Terminal className="h-3 w-3" /><span>Copy Commands</span></>
                    )}
                  </button>
                </div>

                <div className="divide-y divide-border">
                  {setupSteps.map((step) => {
                    const isExpanded = expandedStep === step.num || expandedStep === null;
                    return (
                      <div key={step.num}>
                        <button
                          onClick={() => setExpandedStep(expandedStep === step.num ? -1 : step.num)}
                          className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-muted/30 transition-colors group cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0 transition-colors duration-300">
                            {step.num}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{step.title}</p>
                            {step.filePath && (
                              <p className="text-[10px] font-mono text-primary/80 flex items-center gap-1">
                                <FolderOpen className="h-3 w-3 shrink-0" />
                                <span>{step.filePath}</span>
                              </p>
                            )}
                          </div>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground/60 shrink-0 transition-transform duration-200 ${expandedStep === step.num || expandedStep === null ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence initial={false}>
                          {(expandedStep === step.num || expandedStep === null) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3.5 pb-3.5 space-y-2">
                                <p className="text-[11px] text-muted-foreground">{step.desc}</p>

                                <div className="relative">
                                  <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto max-h-48 whitespace-pre-wrap break-all">
                                    {step.code}
                                  </pre>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopy(step.code, `step-${step.num}`);
                                    }}
                                    className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-[10px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                  >
                                    {copiedCode === `step-${step.num}` ? (
                                      <><Check className="h-3 w-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                                    ) : (
                                      <><Copy className="h-3 w-3" /><span>Copy</span></>
                                    )}
                                  </button>
                                </div>

                                <div className="flex items-start gap-1.5 p-2 rounded-lg bg-primary/5 border border-primary/15 text-[10px] text-muted-foreground">
                                  <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                  <span>{step.hint}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable Step Card Wrapper ─── */
function StepCard({
  num,
  total,
  title,
  icon: Icon,
  children,
}: {
  num: number;
  total: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-4 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary transition-colors duration-300" />
          <span>{num}. {title}</span>
        </label>
        <span className="text-[11px] font-mono text-muted-foreground">Step {num} of {total}</span>
      </div>
      {children}
    </div>
  );
}
