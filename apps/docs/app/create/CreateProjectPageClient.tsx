"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Wand2, Terminal, Check, Copy, Layers,
  ChevronRight, ArrowRight, Palette, Sliders, Laptop, Code2,
  Box, Eye, Bot, CheckSquare, Square, Package,
  ExternalLink, FileCode, HelpCircle, Type, Gauge,
  Zap, Moon, Sun, Monitor, Smartphone, FolderOpen, FileJson,
  User, BarChart3, ChevronDown, Cpu, Activity,
  SlidersHorizontal, Star, Search, RefreshCw, Send, CheckCircle2,
  TrendingUp, Play, X, Sparkles, Command, MessageSquare,
  Shield, ArrowLeft, Download, FileText, Link as LinkIcon, Share2
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
  PackageManagerType,
  FontFamilyType,
  DensityType,
  AnimationStyleType,
  DefaultModeType,
} from "../context/ThemeCustomizerContext";

import { SIGNATURE_THEME } from "../../lib/theme/signature";
import {
  FrameworkType,
  FRAMEWORK_CONFIGS,
  getFrameworkConfig,
} from "../../lib/create/frameworks";
import {
  buildCreateCommand,
  getPackageManagerRunners,
  sanitizeProjectName,
} from "../../lib/create/buildCreateCommand";
import {
  REGISTRY_COMPONENTS,
  ALL_COMPONENT_IDS,
  TOTAL_REGISTRY_COMPONENTS_COUNT,
  RegistryComponentItem,
} from "../../lib/registry/component-list.generated";
import { generateAndDownloadZip } from "../../lib/create/zipExport";

// Real production components from nexoreui
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Switch,
  Slider,
  Checkbox,
  Badge,
} from "nexoreui";

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

const FRAMEWORK_ICON_MAP: Record<FrameworkType, React.ComponentType<{ className?: string }>> = {
  "next-app": NextjsIcon,
  "next-pages": NextjsIcon,
  vite: ViteIcon,
  remix: RemixIcon,
  astro: AstroIcon,
  monorepo: TurborepoIcon,
};

const PM_ICON_MAP: Record<PackageManagerType, React.ComponentType<{ className?: string }>> = {
  pnpm: PnpmIcon,
  npm: NpmIcon,
  yarn: YarnIcon,
  bun: BunIcon,
};

const PRESETS = [
  { id: "starter", name: "Essential Starter", desc: "Button, Input, Card, Modal, Badge, Switch", components: ["button", "input", "card", "modal", "badge", "switch"] },
  { id: "ai", name: "AI & Agents Kit", desc: "AI Prompt Input, Command, Aurora Border Card", components: ["ai-prompt-input", "command", "aurora-border-card", "pro-ai"] },
  { id: "saas", name: "SaaS Dashboard Suite", desc: "Table, Tabs, Stepper, Scroll Area, Data Display, Navigation", components: ["table", "tabs", "stepper", "scroll-area", "data-display", "navigation", "pro-tables", "pro-dashboards"] },
  { id: "full", name: "Full Suite", desc: `All ${TOTAL_REGISTRY_COMPONENTS_COUNT} components from registry`, components: "all" as const },
  { id: "custom", name: "Custom Selection", desc: "Select components individually", components: [] },
];

const COMPONENT_CATEGORIES = [
  { id: "all", label: "All Components" },
  { id: "forms", label: "Forms & Controls" },
  { id: "cards", label: "Cards & Surfaces" },
  { id: "layout", label: "Layout & Data" },
  { id: "feedback", label: "Overlays & Feedback" },
  { id: "ai", label: "AI & Agents" },
  { id: "effects", label: "Visual Effects" },
  { id: "pro", label: "Pro Suite" },
  { id: "ultra", label: "Ultra Modules" },
] as const;

const GENERATION_CHECKLIST = [
  "Project scaffold",
  "Dependencies",
  "Tailwind CSS v4",
  "Theme tokens",
  "Component registry",
  "TypeScript aliases",
  "Utilities",
];

export function CreateProjectPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReduced = useReducedMotion();

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
    resetToSignature,
    getGlobalsCssSnippet, getNexoreConfigSnippet,
  } = useThemeCustomizer();

  const [projectName, setProjectName] = useState("my-nexore-app");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("starter");
  const [customSelectedComps, setCustomSelectedComps] = useState<string[]>([
    "button", "card", "input", "modal", "badge", "switch"
  ]);
  const [compSearchQuery, setCompSearchQuery] = useState("");
  const [selectedCompCategory, setSelectedCompCategory] = useState<string>("all");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Production generation workflow states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generationStepIndex, setGenerationStepIndex] = useState(0);
  const [activeGeneratedTab, setActiveGeneratedTab] = useState<"cli" | "css" | "config" | "pkg" | "utils">("cli");
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const { resolvedTheme } = useTheme();

  // Scoped Sandbox local state (NEVER modifies global docs site theme)
  const [sandboxMode, setSandboxMode] = useState<"dark" | "light">("dark");
  const [isSandboxUserOverridden, setIsSandboxUserOverridden] = useState(false);
  const [sandboxTab, setSandboxTab] = useState<"all" | "actions" | "forms" | "cards">("all");
  const [motionTriggerCount, setMotionTriggerCount] = useState(0);

  // Synchronize sandbox theme mode with site theme unless user explicitly clicked the sandbox Sun/Moon
  useEffect(() => {
    if (!isSandboxUserOverridden) {
      if (resolvedTheme) {
        setSandboxMode(resolvedTheme === "light" ? "light" : "dark");
      } else if (typeof document !== "undefined") {
        const isLight = document.documentElement.classList.contains("light") || !document.documentElement.classList.contains("dark");
        setSandboxMode(isLight ? "light" : "dark");
      }
    }
  }, [resolvedTheme, isSandboxUserOverridden]);

  // Mobile preview drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Interactive Sandbox internal test values
  const [sandboxSwitchValue, setSandboxSwitchValue] = useState(true);
  const [sandboxCheckboxValue, setSandboxCheckboxValue] = useState(true);
  const [sandboxSliderValue, setSandboxSliderValue] = useState<number>(65);
  const [sandboxInputValue, setSandboxInputValue] = useState("NexoreUI production stack");
  const [sandboxCounter, setSandboxCounter] = useState(0);

  const activeColorPreset = COLOR_PRESETS[themeColor] || COLOR_PRESETS[SIGNATURE_THEME.color];
  const activeFontOption = FONT_OPTIONS.find((f) => f.id === fontFamily) || FONT_OPTIONS[0];
  const activeFwConfig = getFrameworkConfig(framework);

  // Shareable Theme URL: Read query parameters on mount (Priority: URL > localStorage > defaults)
  const urlInitialized = useRef(false);
  useEffect(() => {
    if (urlInitialized.current || !searchParams) return;
    urlInitialized.current = true;

    const urlTheme = searchParams.get("theme") as ThemeColor;
    const urlRadius = searchParams.get("radius") as RadiusValue;
    const urlFont = searchParams.get("font") as FontFamilyType;
    const urlDensity = searchParams.get("density") as DensityType;
    const urlFramework = searchParams.get("framework") as FrameworkType;
    const urlPm = searchParams.get("pm") as PackageManagerType;
    const urlMode = searchParams.get("mode") as DefaultModeType;
    const urlPreset = searchParams.get("preset");
    const urlComps = searchParams.get("comps");

    if (urlTheme && COLOR_PRESETS[urlTheme]) setThemeColor(urlTheme);
    if (urlRadius && RADIUS_PRESETS.some((r) => r.value === urlRadius)) setRadius(urlRadius);
    if (urlFont && FONT_OPTIONS.some((f) => f.id === urlFont)) setFontFamily(urlFont);
    if (urlDensity && DENSITY_OPTIONS.some((d) => d.id === urlDensity)) setDensity(urlDensity);
    if (urlFramework && FRAMEWORK_CONFIGS[urlFramework]) setFramework(urlFramework);
    if (urlPm && (urlPm === "pnpm" || urlPm === "npm" || urlPm === "yarn" || urlPm === "bun")) setPackageManager(urlPm);
    if (urlMode && (urlMode === "system" || urlMode === "dark" || urlMode === "light")) setDefaultMode(urlMode);

    if (urlPreset && PRESETS.some((p) => p.id === urlPreset)) {
      setSelectedPresetId(urlPreset);
    }
    if (urlComps) {
      const parsed = urlComps.split(",").filter((c) => ALL_COMPONENT_IDS.includes(c));
      if (parsed.length > 0) {
        setCustomSelectedComps(parsed);
        if (!urlPreset) setSelectedPresetId("custom");
      }
    }
  }, [searchParams, setThemeColor, setRadius, setFontFamily, setDensity, setFramework, setPackageManager, setDefaultMode]);

  // Shareable Theme URL: Debounced URL update on state change (250ms)
  const urlDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!urlInitialized.current) return;

    if (urlDebounceTimer.current) clearTimeout(urlDebounceTimer.current);
    urlDebounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("theme", themeColor);
      params.set("radius", radius);
      params.set("font", fontFamily);
      params.set("density", density);
      params.set("framework", framework);
      params.set("pm", packageManager);
      params.set("mode", defaultMode);

      if (selectedPresetId !== "starter") {
        params.set("preset", selectedPresetId);
      }
      if (selectedPresetId === "custom" && customSelectedComps.length > 0 && customSelectedComps.length < 15) {
        params.set("comps", customSelectedComps.join(","));
      }

      const queryString = params.toString();
      const newPath = queryString ? `/create?${queryString}` : "/create";
      router.replace(newPath, { scroll: false });
    }, 250);

    return () => {
      if (urlDebounceTimer.current) clearTimeout(urlDebounceTimer.current);
    };
  }, [themeColor, radius, fontFamily, density, framework, packageManager, defaultMode, selectedPresetId, customSelectedComps, router]);

  // Body scroll lock when mobile drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isMobileDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileDrawerOpen]);

  // Escape key handler to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileDrawerOpen]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await copyToClipboard(text);
      setCopiedCode(label);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.warn("Could not copy to clipboard:", err);
    }
  };

  const handleCopyShareLink = () => {
    if (typeof window === "undefined") return;
    handleCopy(window.location.href, "share-link");
  };

  const handleResetToSignature = () => {
    resetToSignature();
    setIsSandboxUserOverridden(false);
    if (resolvedTheme) {
      setSandboxMode(resolvedTheme === "light" ? "light" : "dark");
    }
  };

  const getEffectiveComponents = useCallback((): string[] | "all" => {
    if (selectedPresetId === "full") return "all";
    if (selectedPresetId === "custom") return customSelectedComps;
    const preset = PRESETS.find((p) => p.id === selectedPresetId);
    return (preset?.components as string[]) || [];
  }, [selectedPresetId, customSelectedComps]);

  const selectedCount = useMemo(() => {
    const eff = getEffectiveComponents();
    if (eff === "all") return TOTAL_REGISTRY_COMPONENTS_COUNT;
    return eff.length;
  }, [getEffectiveComponents]);

  const commands = useMemo(() => {
    return buildCreateCommand({
      packageManager,
      projectName,
      framework,
      presetId: selectedPresetId,
      selectedComponents: getEffectiveComponents(),
      themeColor,
      radius,
      fontFamily,
      density,
      animationStyle,
      defaultMode,
    });
  }, [packageManager, projectName, framework, selectedPresetId, getEffectiveComponents, themeColor, radius, fontFamily, density, animationStyle, defaultMode]);

  const toggleComponent = (id: string) => {
    setCustomSelectedComps((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const filteredComponents = useMemo(() => {
    return REGISTRY_COMPONENTS.filter((comp) => {
      const matchesSearch =
        compSearchQuery.trim() === "" ||
        comp.name.toLowerCase().includes(compSearchQuery.toLowerCase()) ||
        comp.id.toLowerCase().includes(compSearchQuery.toLowerCase());
      const matchesCategory =
        selectedCompCategory === "all" || comp.category === selectedCompCategory;
      return matchesSearch && matchesCategory;
    });
  }, [compSearchQuery, selectedCompCategory]);

  const getPackageJsonSnippet = useCallback(() => {
    return JSON.stringify(
      {
        name: sanitizeProjectName(projectName),
        version: "0.1.0",
        private: true,
        scripts: {
          dev: activeFwConfig.devScript,
          build: activeFwConfig.buildScript,
          start: activeFwConfig.startScript,
        },
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          "framer-motion": "^11.1.7",
          "lucide-react": "^0.475.0",
          clsx: "^2.1.1",
          "tailwind-merge": "^2.3.0",
          "class-variance-authority": "^0.7.1",
        },
      },
      null,
      2
    );
  }, [projectName, activeFwConfig]);

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
   NexoreUI Project Setup & Configuration
   Framework: ${activeFwConfig.name}
   Package Manager: ${packageManager}
   Theme: ${activeColorPreset.label} (${themeColor})
   Radius: ${radius}rem
   Components: ${selectedCount} selected
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

// 1. CLI Commands:
${commands.fullCliCommand}

// 2. nexore.json
${getNexoreConfigSnippet()}

// 3. ${activeFwConfig.cssPath}
${getGlobalsCssSnippet()}

// 4. lib/utils.ts
${getUtilsSnippet()}
`;
  };

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenerationComplete(false);
    setGenerationStepIndex(0);

    setTimeout(() => {
      const el = document.getElementById("generated-project-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
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
        }, 120);
      }
    }, 150);
  };

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      await generateAndDownloadZip({
        projectName: sanitizeProjectName(projectName),
        framework,
        selectedComponents: getEffectiveComponents(),
        themeColor,
        radius,
        packageManager,
        globalsCssSnippet: getGlobalsCssSnippet(),
        nexoreConfigSnippet: getNexoreConfigSnippet(),
        packageJsonSnippet: getPackageJsonSnippet(),
        utilsSnippet: getUtilsSnippet(),
        fullCliCommand: commands.fullCliCommand,
        createCommand: commands.createCommand,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Could not generate ZIP archive: ${msg}`);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  /* ─── Render Scoped Sandbox View (Used in Desktop Sidebar & Mobile Drawer) ─── */
  const renderSandboxCanvas = () => {
    const isDark = sandboxMode === "dark";

    const primaryColor = isDark ? activeColorPreset.primaryDark : activeColorPreset.primaryLight;
    const primaryFgColor = isDark
      ? (themeColor === "slate" ? "hsl(240 5.9% 10%)" : "hsl(0 0% 100%)")
      : (themeColor === "slate" ? "hsl(0 0% 98%)" : "hsl(0 0% 100%)");

    const ringColor = isDark ? activeColorPreset.ringDark : activeColorPreset.ringLight;
    const bgColor = isDark ? "hsl(240 10% 3.9%)" : "hsl(0 0% 100%)";
    const fgColor = isDark ? "hsl(0 0% 98%)" : "hsl(240 10% 3.9%)";
    const cardColor = isDark ? "hsl(240 10% 5.5%)" : "hsl(0 0% 100%)";
    const cardFgColor = isDark ? "hsl(0 0% 98%)" : "hsl(240 10% 3.9%)";
    const mutedColor = isDark ? "hsl(240 3.7% 15.9%)" : "hsl(240 4.8% 95.9%)";
    const mutedFgColor = isDark ? "hsl(240 5% 64.9%)" : "hsl(240 3.8% 46.1%)";
    const borderColor = isDark ? "hsl(240 3.7% 15.9%)" : "hsl(240 5.9% 90%)";
    const inputColor = isDark ? "hsl(240 3.7% 15.9%)" : "hsl(240 5.9% 90%)";
    const secondaryColor = isDark ? "hsl(240 3.7% 15.9%)" : "hsl(240 4.8% 95.9%)";
    const secondaryFgColor = isDark ? "hsl(0 0% 98%)" : "hsl(240 5.9% 10%)";
    const accentColor = isDark ? "hsl(240 3.7% 15.9%)" : "hsl(240 4.8% 95.9%)";
    const accentFgColor = isDark ? "hsl(0 0% 98%)" : "hsl(240 5.9% 10%)";

    return (
      <div
        className={`rounded-xl border border-border bg-background text-foreground p-4 sm:p-5 transition-colors duration-200 shadow-xs ${
          isDark ? "dark" : ""
        }`}
        style={{
          "--radius": `${radius}rem`,
          "--primary-rgb": activeColorPreset.rgb,
          fontFamily: activeFontOption.css,

          // Standard CSS variables
          "--primary": primaryColor,
          "--primary-foreground": primaryFgColor,
          "--ring": ringColor,
          "--background": bgColor,
          "--foreground": fgColor,
          "--card": cardColor,
          "--card-foreground": cardFgColor,
          "--muted": mutedColor,
          "--muted-foreground": mutedFgColor,
          "--border": borderColor,
          "--input": inputColor,
          "--secondary": secondaryColor,
          "--secondary-foreground": secondaryFgColor,
          "--accent": accentColor,
          "--accent-foreground": accentFgColor,

          // Tailwind CSS v4 color variables (Essential for bg-card, text-foreground, etc.)
          "--color-primary": primaryColor,
          "--color-primary-foreground": primaryFgColor,
          "--color-ring": ringColor,
          "--color-background": bgColor,
          "--color-foreground": fgColor,
          "--color-card": cardColor,
          "--color-card-foreground": cardFgColor,
          "--color-muted": mutedColor,
          "--color-muted-foreground": mutedFgColor,
          "--color-border": borderColor,
          "--color-input": inputColor,
          "--color-secondary": secondaryColor,
          "--color-secondary-foreground": secondaryFgColor,
          "--color-accent": accentColor,
          "--color-accent-foreground": accentFgColor,
        } as React.CSSProperties}
      >
        {/* Sandbox Canvas Header: Theme Mode and Motion Trigger */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Component Sandbox
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Scoped Sun/Moon Toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-muted border border-border">
              <button
                type="button"
                onClick={() => {
                  setIsSandboxUserOverridden(true);
                  setSandboxMode("dark");
                }}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  sandboxMode === "dark" ? "bg-card text-foreground shadow-xs font-medium" : "text-muted-foreground"
                }`}
                title="Preview Dark Theme"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSandboxUserOverridden(true);
                  setSandboxMode("light");
                }}
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  sandboxMode === "light" ? "bg-card text-foreground shadow-xs font-medium" : "text-muted-foreground"
                }`}
                title="Preview Light Theme"
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Replay Entry Motion */}
            <button
              type="button"
              disabled={Boolean(prefersReduced)}
              onClick={() => setMotionTriggerCount((c) => c + 1)}
              className="px-2 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer disabled:opacity-40"
              title="Re-run animation entry"
            >
              <Play className="h-3 w-3" />
              <span>{prefersReduced ? "Reduced" : "Play"}</span>
            </button>
          </div>
        </div>

        {/* Live Config Spec Badges */}
        <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-muted-foreground mb-4">
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">
            {activeColorPreset.label}
          </span>
          <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            r: {radius}rem
          </span>
          <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            {activeFontOption.label}
          </span>
          <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border capitalize">
            {density}
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-muted border border-border mb-4">
          {[
            { id: "all" as const, label: "Overview" },
            { id: "actions" as const, label: "Buttons & Badges" },
            { id: "forms" as const, label: "Form Controls" },
            { id: "cards" as const, label: "Card Layout" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSandboxTab(t.id)}
              className={`flex-1 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                sandboxTab === t.id
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Re-animatable Motion Container */}
        <motion.div
          key={`sandbox-motion-${motionTriggerCount}`}
          initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-4"
        >
          {/* Card / Settings Showcase */}
          {(sandboxTab === "all" || sandboxTab === "cards") && (
            <Card className="border-border bg-card text-card-foreground">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Account Preferences</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Production
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Manage notification settings and visual display density.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">Email Notifications</p>
                    <p className="text-[11px] text-muted-foreground">Receive digest updates daily</p>
                  </div>
                  <Switch
                    checked={sandboxSwitchValue}
                    onCheckedChange={setSandboxSwitchValue}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <Checkbox
                    id="sandbox-weekly"
                    checked={sandboxCheckboxValue}
                    onCheckedChange={(c) => setSandboxCheckboxValue(Boolean(c))}
                  />
                  <label htmlFor="sandbox-weekly" className="text-xs text-foreground cursor-pointer select-none">
                    Subscribe to weekly changelog and component updates
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Buttons Showcase */}
          {(sandboxTab === "all" || sandboxTab === "actions") && (
            <div className="p-3.5 rounded-lg border border-border bg-card text-card-foreground space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>BUTTON VARIANTS</span>
                <span>Clicks: {sandboxCounter}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  size="sm"
                  onClick={() => setSandboxCounter((c) => c + 1)}
                  className="w-full text-xs"
                >
                  Primary
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSandboxCounter((c) => c + 1)}
                  className="w-full text-xs"
                >
                  Secondary
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSandboxCounter((c) => c + 1)}
                  className="w-full text-xs text-foreground bg-background border-input hover:bg-accent"
                >
                  Outline
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSandboxCounter(0)}
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <Badge variant="default">Primary Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Active Status</Badge>
              </div>
            </div>
          )}

          {/* Form Controls Showcase */}
          {(sandboxTab === "all" || sandboxTab === "forms") && (
            <div className="p-3.5 rounded-lg border border-border bg-card text-card-foreground space-y-3">
              <div className="text-xs text-muted-foreground font-mono">
                FORM INPUTS & SLIDER
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Project Name</label>
                <Input
                  value={sandboxInputValue}
                  onChange={(val) => setSandboxInputValue(val)}
                  placeholder="Enter project title"
                  className="text-xs bg-background text-foreground border-input placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Notification Threshold</span>
                  <span className="font-mono text-primary font-semibold">{sandboxSliderValue}%</span>
                </div>
                <Slider
                  value={sandboxSliderValue}
                  onChange={setSandboxSliderValue}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ═══ Header Section ═══ */}
        <div className="space-y-2 border-b border-border pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Project Configurator
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                Create Project & Theme Studio
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Configure your framework, signature color palette, typography and component suite. Produces copyable CLI commands and a complete ZIP archive.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted text-xs font-medium transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
              >
                {copiedCode === "share-link" ? (
                  <><Check className="h-3.5 w-3.5 text-emerald-500" /><span className="text-emerald-500">Link Copied!</span></>
                ) : (
                  <><Share2 className="h-3.5 w-3.5" /><span>Share Configuration</span></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ═══ Generation View (Triggered on 'Create Project') ═══ */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              id="generated-project-section"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 scroll-mt-20"
            >
              {!generationComplete ? (
                /* Step-by-step synthesis progress */
                <div className="max-w-md mx-auto py-8 text-center space-y-5">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Wand2 className="h-5 w-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Synthesizing Project Configuration...
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Generating token definitions and dependency manifest for {activeFwConfig.name}.
                    </p>
                  </div>

                  <div className="space-y-2 text-left bg-muted/40 p-3.5 rounded-lg border border-border">
                    {GENERATION_CHECKLIST.map((stepName, idx) => {
                      const isDone = idx < generationStepIndex;
                      const isCurrent = idx === generationStepIndex;
                      return (
                        <div
                          key={stepName}
                          className={`flex items-center gap-2 text-xs font-mono transition-colors ${
                            isDone
                              ? "text-emerald-500 font-medium"
                              : isCurrent
                              ? "text-primary font-semibold"
                              : "text-muted-foreground/50"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          ) : isCurrent ? (
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                          ) : (
                            <div className="h-3.5 w-3.5 rounded-full border border-border shrink-0" />
                          )}
                          <span>{stepName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Ready State */
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-emerald-500 stroke-[3]" />
                        <h2 className="text-lg font-bold text-foreground">
                          {sanitizeProjectName(projectName)} is ready
                        </h2>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                          Configured
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activeFwConfig.name} • {packageManager} • {activeColorPreset.label} • {radius}rem radius • {selectedCount} components
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => handleCopy(commands.createCommand, "copy-create-cmd")}
                      >
                        {copiedCode === "copy-create-cmd" ? (
                          <><Check className="h-3.5 w-3.5" /><span>Copied!</span></>
                        ) : (
                          <><Terminal className="h-3.5 w-3.5" /><span>Copy Create Command</span></>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isDownloadingZip}
                        onClick={handleDownloadZip}
                      >
                        {isDownloadingZip ? (
                          <><div className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" /><span>Generating ZIP...</span></>
                        ) : (
                          <><Download className="h-3.5 w-3.5" /><span>Download Starter (.zip)</span></>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsGenerating(false);
                          setGenerationComplete(false);
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </div>

                  {/* Tabbed Code Explorer */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between overflow-x-auto gap-2">
                      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border">
                        {[
                          { id: "cli" as const, label: "CLI Commands", icon: Terminal },
                          { id: "config" as const, label: "nexore.json", icon: FileJson },
                          { id: "css" as const, label: activeFwConfig.cssPath, icon: FileCode },
                          { id: "pkg" as const, label: "package.json", icon: Package },
                          { id: "utils" as const, label: "lib/utils.ts", icon: FileText },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          const isSelected = activeGeneratedTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveGeneratedTab(tab.id)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                                isSelected ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const text =
                            activeGeneratedTab === "cli"
                              ? commands.fullCliCommand
                              : activeGeneratedTab === "config"
                              ? getNexoreConfigSnippet()
                              : activeGeneratedTab === "css"
                              ? getGlobalsCssSnippet()
                              : activeGeneratedTab === "pkg"
                              ? getPackageJsonSnippet()
                              : getUtilsSnippet();
                          handleCopy(text, `tab-${activeGeneratedTab}`);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {copiedCode === `tab-${activeGeneratedTab}` ? (
                          <><Check className="h-3.5 w-3.5 text-emerald-500" /><span>Copied</span></>
                        ) : (
                          <><Copy className="h-3.5 w-3.5" /><span>Copy File</span></>
                        )}
                      </button>
                    </div>

                    <div className="rounded-lg border border-border bg-zinc-950 text-zinc-100 p-4 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
                      <pre className="whitespace-pre-wrap break-all">
                        {activeGeneratedTab === "cli" && `# 1. Create project with ${activeFwConfig.name}:\n${commands.createCommand}\n\n# 2. Existing project setup:\n${commands.fullCliCommand}`}
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

        {/* ═══ Main 2-Column Grid ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ─── Left Column: Configurator Steps (7 cols) ─── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Step 1: Framework */}
            <StepCard num={1} total={6} title="Framework & Architecture" icon={Laptop}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(FRAMEWORK_CONFIGS).map((fw) => {
                  const isSelected = framework === fw.id;
                  const Icon = FRAMEWORK_ICON_MAP[fw.id];
                  return (
                    <button
                      key={fw.id}
                      type="button"
                      onClick={() => setFramework(fw.id)}
                      className={`flex flex-col items-start p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="text-xs font-semibold text-foreground">{fw.name}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground line-clamp-1">{fw.desc}</span>
                      <span className={`mt-2 text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-primary/20 text-primary font-semibold" : "bg-muted text-muted-foreground"
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
                {(["pnpm", "npm", "yarn", "bun"] as PackageManagerType[]).map((pm) => {
                  const isSelected = packageManager === pm;
                  const Icon = PM_ICON_MAP[pm];
                  const runners = getPackageManagerRunners(pm);
                  return (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPackageManager(pm)}
                      className={`p-3 rounded-lg border text-xs font-mono transition-colors text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="text-xs font-semibold text-foreground">{pm}</span>
                      <span className="text-[10px] text-muted-foreground">{runners.installPkg}</span>
                    </button>
                  );
                })}
              </div>
            </StepCard>

            {/* Step 3: Color Palette & Radius */}
            <StepCard num={3} total={6} title="Color Palette & Radius" icon={Palette}>
              {/* Palette */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Palette:</span>
                  <span className="font-mono text-primary font-semibold capitalize">
                    {activeColorPreset.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {Object.values(COLOR_PRESETS).map((preset) => {
                    const isSelected = themeColor === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setThemeColor(preset.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary font-semibold"
                            : "border-border bg-card hover:border-foreground/30"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: preset.previewHex }}
                        />
                        <span className="text-[11px] text-muted-foreground capitalize truncate">
                          {preset.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Radius Options */}
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Border Radius:</span>
                  <span className="font-mono text-primary font-semibold">{radius}rem</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {RADIUS_PRESETS.map((r) => {
                    const isSelected = radius === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRadius(r.value)}
                        className={`py-2 px-1 text-xs font-mono rounded-lg border text-center transition-colors cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary"
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="font-semibold">{r.value}rem</div>
                        <div className="text-[9px] text-muted-foreground truncate">{r.label.split(" ")[1] || "Rem"}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </StepCard>

            {/* Step 4: Typography, Density, Motion & Default Mode */}
            <StepCard num={4} total={6} title="Typography, Density & Defaults" icon={Sliders}>
              {/* Default Mode */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Project Default Mode (nexore.json):</span>
                  <span className="font-mono text-primary font-semibold capitalize">{defaultMode}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["system", "dark", "light"] as DefaultModeType[]).map((mode) => {
                    const isSelected = defaultMode === mode;
                    const ModeIcon = mode === "dark" ? Moon : mode === "light" ? Sun : Monitor;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setDefaultMode(mode)}
                        className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-semibold capitalize transition-colors cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ModeIcon className="h-3.5 w-3.5" />
                        <span>{mode}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Font Family:</span>
                  <span className="font-mono text-primary font-semibold">{activeFontOption.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_OPTIONS.map((f) => {
                    const isSelected = fontFamily === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFontFamily(f.id)}
                        className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                          isSelected ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card hover:border-foreground/30"
                        }`}
                      >
                        <span className="text-xs font-bold text-foreground block" style={{ fontFamily: f.css }}>
                          {f.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono truncate block mt-0.5">
                          {f.css.split(",")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Density */}
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Density:</span>
                  <span className="font-mono text-primary font-semibold capitalize">{density}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DENSITY_OPTIONS.map((d) => {
                    const isSelected = density === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDensity(d.id)}
                        className={`flex flex-col items-center p-2 rounded-lg border transition-colors cursor-pointer ${
                          isSelected ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card hover:border-foreground/30"
                        }`}
                      >
                        <span className="text-xs font-semibold text-foreground">{d.label}</span>
                        <span className="text-[10px] text-muted-foreground text-center mt-0.5">{d.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Animation */}
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Animation Profile:</span>
                  <span className="font-mono text-primary font-semibold capitalize">{animationStyle}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ANIMATION_OPTIONS.map((a) => {
                    const isSelected = animationStyle === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAnimationStyle(a.id)}
                        className={`flex flex-col items-center p-2 rounded-lg border transition-colors cursor-pointer ${
                          isSelected ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card hover:border-foreground/30"
                        }`}
                      >
                        <span className="text-xs font-semibold text-foreground">{a.label}</span>
                        <span className="text-[10px] text-muted-foreground text-center mt-0.5">{a.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </StepCard>

            {/* Step 5: Components Registry Selection */}
            <StepCard num={5} total={6} title="Component Selection" icon={Box}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESETS.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPresetId(p.id)}
                      className={`flex flex-col items-start p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                          : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-xs text-foreground">{p.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {p.id === "full" ? `${TOTAL_REGISTRY_COMPONENTS_COUNT} comps` : p.id === "custom" ? "Custom" : `${(p.components as string[]).length} comps`}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground leading-tight">{p.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Individual Checkboxes */}
              {selectedPresetId === "custom" && (
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Selected: {customSelectedComps.length} of {TOTAL_REGISTRY_COMPONENTS_COUNT} components
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomSelectedComps([...ALL_COMPONENT_IDS])}
                        className="text-primary hover:underline text-xs font-medium cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-muted-foreground">•</span>
                      <button
                        type="button"
                        onClick={() => setCustomSelectedComps([])}
                        className="text-muted-foreground hover:underline text-xs cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Search and Category filter */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        value={compSearchQuery}
                        onChange={(e) => setCompSearchQuery(e.target.value)}
                        placeholder="Search registry components..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-muted/50 border border-border text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <select
                      value={selectedCompCategory}
                      onChange={(e) => setSelectedCompCategory(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-md bg-muted/50 border border-border text-foreground outline-none cursor-pointer"
                    >
                      {COMPONENT_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-60 overflow-y-auto p-2.5 rounded-lg bg-muted/30 border border-border">
                    {filteredComponents.map((comp) => {
                      const isChecked = customSelectedComps.includes(comp.id);
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => toggleComponent(comp.id)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono text-left transition-colors cursor-pointer ${
                            isChecked
                              ? "bg-primary/15 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {isChecked ? (
                            <CheckSquare className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : (
                            <Square className="h-3.5 w-3.5 opacity-40 shrink-0" />
                          )}
                          <span className="truncate text-[11px]">{comp.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </StepCard>

            {/* Step 6: Documentation Global Preview */}
            <StepCard num={6} total={6} title="Apply Theme to Docs Site" icon={Eye}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">Global Site Preview</span>
                      {applyThemeToDocs && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                          Active Everywhere
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Temporarily preview your selected palette and radius across all documentation pages.
                    </p>
                  </div>
                  <Switch
                    checked={applyThemeToDocs}
                    onCheckedChange={setApplyThemeToDocs}
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border text-xs">
                  <span className="text-muted-foreground text-[11px]">
                    Signature theme: slate • 0.625rem radius
                  </span>
                  <button
                    type="button"
                    onClick={handleResetToSignature}
                    className="text-primary hover:underline font-semibold text-[11px] cursor-pointer"
                  >
                    Reset to Signature NexoreUI
                  </button>
                </div>
              </div>
            </StepCard>

            {/* ═══ Primary Action Card ═══ */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Ready to Build Your Stack?</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Generate the complete production setup with {activeFwConfig.name} and {selectedCount} components.
                  </p>
                </div>

                <Button
                  onClick={handleStartGeneration}
                  disabled={isGenerating && !generationComplete}
                  className="w-full sm:w-auto"
                >
                  <Wand2 className="h-4 w-4 mr-1.5" />
                  <span>Create Project</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>

          </div>

          {/* ─── Right Column: Sticky Sandbox (Desktop >= md) ─── */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            {renderSandboxCanvas()}
          </div>

        </div>

      </div>

      {/* ─── Mobile Floating Preview Button & Drawer (< md screens) ─── */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg cursor-pointer hover:opacity-95 active:scale-95 transition-all"
        >
          <Eye className="h-4 w-4" />
          <span>Preview Theme ({activeColorPreset.label.split(" ")[0]})</span>
        </button>

        <AnimatePresence>
          {isMobileDrawerOpen && (
            <div className="fixed inset-0 z-50 flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-2xl bg-card border-t border-border p-4 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                      Mobile Live Preview
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {renderSandboxCanvas()}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Reusable Step Card ─── */
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
    <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span>{num}. {title}</span>
        </label>
        <span className="text-[11px] font-mono text-muted-foreground">Step {num} of {total}</span>
      </div>
      {children}
    </div>
  );
}
