"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";
import {
  Terminal, Package, Wand2, Palette, Sliders, Laptop,
  Sparkles, Check, Copy, ArrowRight, ShieldCheck, Code2,
  FileCode, Layers, CheckCircle2, FolderOpen, FileText, Eye,
  Activity, Bell, Search, Zap
} from "lucide-react";
import { copyToClipboard } from "../../utils/clipboard";
import {
  useThemeCustomizer,
  COLOR_PRESETS,
  RADIUS_PRESETS,
  FrameworkType,
  PackageManagerType,
} from "../../context/ThemeCustomizerContext";

/* ─── Framework Brand Icons ─── */
function NextjsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="black" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <path d="M17.5 18.2L9.2 7H7.5V17H9V9.5L16.2 19C16.65 18.78 17.09 18.51 17.5 18.2Z" fill="white" />
      <path d="M15 7H16.5V14.5H15V7Z" fill="url(#next_g_inst)" />
      <defs>
        <linearGradient id="next_g_inst" x1="15.75" y1="7" x2="15.75" y2="14.5" gradientUnits="userSpaceOnUse">
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
        fill="url(#vite_bg_inst)"
      />
      <path
        d="M21.5 2L10.5 8.5C10.3 8.6 10.2 8.9 10.3 9.1L14 15.5C14.1 15.7 14.4 15.7 14.6 15.6L17 13.5C17.2 13.3 17.5 13.4 17.6 13.6L19.5 16.5C19.6 16.7 19.9 16.7 20.1 16.5L25.5 11.5C25.7 11.3 25.7 10.9 25.4 10.8L21.5 2Z"
        fill="url(#vite_bolt_inst)"
      />
      <defs>
        <linearGradient id="vite_bg_inst" x1="3" y1="4" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#41D1FF" />
          <stop offset="1" stopColor="#BD34FE" />
        </linearGradient>
        <linearGradient id="vite_bolt_inst" x1="11" y1="6" x2="25" y2="17" gradientUnits="userSpaceOnUse">
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
        fill="url(#astro_g_inst)"
      />
      <path d="M12 23.5c0 0-1.4-4.3-4.3-5.8 3 0 4.3 3.8 4.3 3.8s1.4-3.8 4.3-3.8c-2.9 1.5-4.3 5.8-4.3 5.8z" fill="#FF5D01" />
      <defs>
        <linearGradient id="astro_g_inst" x1="12" y1="1" x2="12" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BC52EE" />
          <stop offset="1" stopColor="#E63946" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const FRAMEWORK_OPTIONS: { id: FrameworkType; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "next-app", label: "Next.js", Icon: NextjsIcon },
  { id: "vite", label: "Vite (React)", Icon: ViteIcon },
  { id: "remix", label: "Remix", Icon: RemixIcon },
  { id: "astro", label: "Astro", Icon: AstroIcon },
];

/* ─── Robust Dedicated Code Viewer Component (No Babel/Transpilation dependency) ─── */
function InstallationCodeBlock({
  filename,
  code,
}: {
  filename: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-zinc-950 shadow-xl overflow-hidden text-zinc-200">
      {/* macOS Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-xs font-mono text-zinc-400 font-medium">{filename}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-[11px] font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-xs font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap break-all">
          {code}
        </pre>
      </div>
    </div>
  );
}

function LiveThemePreviewCard({ themeColor, radius }: { themeColor: any; radius: any }) {
  const preset = COLOR_PRESETS[themeColor as keyof typeof COLOR_PRESETS] || COLOR_PRESETS.indigo;
  const [btnClicks, setBtnClicks] = useState(0);
  const [toggleOn, setToggleOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'settings'>('overview');
  const [sliderVal, setSliderVal] = useState(68);
  const [testInput, setTestInput] = useState("NexoreUI dynamic tokens");

  const radiusRem = `${radius}rem`;
  const primaryColor = preset.previewHex;

  return (
    <div className="pt-5 border-t border-border/60 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Live Component Sandbox ({preset.label})
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
          <span className="px-1.5 py-0.5 rounded bg-muted border border-border">{preset.previewHex}</span>
          <span className="px-1.5 py-0.5 rounded bg-muted border border-border">radius: {radius}rem</span>
        </div>
      </div>

      {/* Interactive live preview canvas container */}
      <div 
        className="p-4 sm:p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xl transition-all duration-300 space-y-4"
        style={{
          borderRadius: `max(0.75rem, ${radiusRem})`,
        }}
      >
        {/* ROW 1: Buttons & Interactive Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          {/* 1. Primary Button */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Primary Button</span>
            <button
              type="button"
              onClick={() => setBtnClicks((c) => c + 1)}
              className="w-full py-2.5 px-3.5 text-xs font-semibold text-white transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              style={{
                backgroundColor: primaryColor,
                borderRadius: radiusRem,
                boxShadow: `0 4px 16px ${primaryColor}45`,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Clicked {btnClicks} times</span>
            </button>
          </div>

          {/* 2. Outline Button */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Outline Button</span>
            <button
              type="button"
              className="w-full py-2.5 px-3.5 text-xs font-semibold transition-all duration-200 active:scale-95 border flex items-center justify-center gap-1.5 cursor-pointer"
              style={{
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: `${primaryColor}10`,
                borderRadius: radiusRem,
              }}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Secondary Action</span>
            </button>
          </div>

          {/* 3. Segmented Tabs */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Segmented Tabs</span>
            <div className="flex items-center p-1 bg-muted/60 border border-border rounded-lg" style={{ borderRadius: radiusRem }}>
              {(['overview', 'metrics', 'settings'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1 text-[11px] font-medium capitalize transition-all cursor-pointer ${
                    activeTab === tab
                      ? "text-white shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    backgroundColor: activeTab === tab ? primaryColor : 'transparent',
                    borderRadius: `calc(${radiusRem} - 2px)`,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: Form Input, Range Slider & Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1 border-t border-border/40">
          {/* Input Field */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Input with Focus Ring</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-background border border-border text-foreground outline-none transition-all duration-200"
                style={{
                  borderRadius: radiusRem,
                  borderColor: `${primaryColor}70`,
                  boxShadow: `0 0 0 1.5px ${primaryColor}35`,
                }}
              />
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground uppercase">
              <span>Slider Controller</span>
              <span className="font-semibold" style={{ color: primaryColor }}>{sliderVal}%</span>
            </div>
            <div className="py-1">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
                style={{
                  accentColor: primaryColor,
                  borderRadius: radiusRem,
                }}
              />
            </div>
          </div>

          {/* Status Badge & Toggle */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Status & Toggle Switch</span>
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-background/80 border border-border" style={{ borderRadius: radiusRem }}>
              <span 
                className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium border"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  borderColor: `${primaryColor}40`,
                  color: primaryColor,
                  borderRadius: radiusRem,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                Active Theme
              </span>

              <button
                type="button"
                onClick={() => setToggleOn(!toggleOn)}
                className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer border"
                style={{
                  backgroundColor: toggleOn ? primaryColor : 'var(--muted)',
                  borderColor: toggleOn ? `${primaryColor}80` : 'var(--border)',
                }}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                    toggleOn ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ROW 3: Stat Card, Alert Banner & Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1 border-t border-border/40">
          {/* Mini Stat Card */}
          <div 
            className="p-2.5 rounded-xl border border-border bg-background flex items-center justify-between shadow-xs"
            style={{ borderRadius: radiusRem }}
          >
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Monthly Growth</div>
              <div className="text-base font-bold text-foreground mt-0.5">+34.8%</div>
            </div>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor, borderRadius: `calc(${radiusRem} - 2px)` }}
            >
              <Activity className="h-4 w-4" />
            </div>
          </div>

          {/* Theme Alert Callout */}
          <div 
            className="p-2.5 rounded-xl border flex items-center gap-2"
            style={{
              backgroundColor: `${primaryColor}10`,
              borderColor: `${primaryColor}35`,
              borderRadius: radiusRem,
            }}
          >
            <Bell className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
            <span className="text-[11px] leading-tight font-medium" style={{ color: primaryColor }}>
              Theme tokens synchronized with Tailwind CSS v4 variables
            </span>
          </div>

          {/* Tag Badges Collection */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span 
              className="px-2 py-1 text-[10px] font-semibold text-white shadow-xs"
              style={{ backgroundColor: primaryColor, borderRadius: radiusRem }}
            >
              Solid Badge
            </span>
            <span 
              className="px-2 py-1 text-[10px] font-semibold border"
              style={{ borderColor: primaryColor, color: primaryColor, borderRadius: radiusRem }}
            >
              Outline
            </span>
            <span 
              className="px-2 py-1 text-[10px] font-semibold"
              style={{ backgroundColor: `${primaryColor}20`, color: primaryColor, borderRadius: radiusRem }}
            >
              Soft Tag
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export function InstallationSection() {
  const {
    themeColor,
    setThemeColor,
    radius,
    setRadius,
    framework,
    setFramework,
    packageManager,
    setPackageManager,
    getInitCommand,
    getGlobalsCssSnippet,
    getInstallDepsCommand,
  } = useThemeCustomizer();

  const [copiedInit, setCopiedInit] = useState(false);

  const handleCopyInit = async () => {
    await copyToClipboard(getInitCommand());
    setCopiedInit(true);
    setTimeout(() => setCopiedInit(false), 2000);
  };

  const getRunner = () => {
    if (packageManager === "pnpm") return "pnpm dlx";
    if (packageManager === "bun") return "bunx";
    if (packageManager === "yarn") return "yarn dlx";
    return "npx";
  };

  return (
    <section id="installation" className="max-w-4xl space-y-12 pb-16 pt-2">
      {/* Header Banner */}
      <div className="pb-8 border-b border-border/70 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Quick Start</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Installation & Setup Guide
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
          Initialize NexoreUI in your project with customizable theme tokens, or install individual components directly into your codebase with zero vendor lock-in.
        </p>

        {/* Feature Highlights */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Tailwind CSS v4 Ready</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Code2 className="h-4 w-4 text-violet-500" />
            <span>100% TypeScript</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Live Tokens Customization</span>
          </div>
        </div>
      </div>

      {/* Project Studio CTA Banner */}
      <div className="p-5 rounded-2xl border-2 border-primary/30 bg-primary/5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">NexoreUI Project & Theme Studio</span>
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              New
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure frameworks, live component sandbox previews, typography, density, and generate full production setups in seconds.
          </p>
        </div>

        <Link
          href="/create"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 shrink-0"
        >
          <span>Open Studio</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Step 1: Interactive Project Configurator */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/15 text-primary text-xs font-bold border border-primary/25">
              1
            </span>
            <span>Interactive Project Configurator</span>
          </h2>
          <p className="text-muted-foreground ml-10 text-xs sm:text-sm">
            Select your framework, package manager, color palette, and border radius. All settings generate live commands!
          </p>
        </div>

        <div className="ml-0 sm:ml-10 p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-6 shadow-sm">
          {/* Framework and PM Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Framework */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Laptop className="h-3.5 w-3.5 text-primary" />
                <span>Framework</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FRAMEWORK_OPTIONS.map((fw) => {
                  const Icon = fw.Icon;
                  const isSelected = framework === fw.id;
                  return (
                    <button
                      key={fw.id}
                      type="button"
                      onClick={() => setFramework(fw.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{fw.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Package Manager */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                <span>Package Manager</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["pnpm", "npm", "yarn", "bun"] as PackageManagerType[]).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPackageManager(pm)}
                    className={`py-2 rounded-xl border text-xs font-mono font-medium transition-all text-center cursor-pointer ${
                      packageManager === pm
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color & Radius Customizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-border/60">
            {/* Color Palette */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Palette className="h-3.5 w-3.5 text-primary" />
                <span>Theme Palette</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {Object.values(COLOR_PRESETS).slice(0, 8).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setThemeColor(preset.id)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      themeColor === preset.id
                        ? "border-primary bg-primary/10 ring-1 ring-primary font-semibold"
                        : "border-border bg-card hover:border-border/80"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: preset.previewHex }}
                    />
                    <span className="truncate text-[11px] capitalize">{preset.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Radius */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-primary" />
                <span>Border Radius</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {RADIUS_PRESETS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRadius(r.value)}
                    className={`py-1.5 rounded-lg border text-xs font-mono transition-all text-center cursor-pointer ${
                      radius === r.value
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Component Preview for Theme Palette & Radius */}
          <LiveThemePreviewCard themeColor={themeColor} radius={radius} />

          {/* Generated CLI Command Box */}
          <div className="pt-4 border-t border-border/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                <span>Generated Initialization Command</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {themeColor} • {radius}rem
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 shadow-inner">
              <span className="truncate mr-3">{getInitCommand()}</span>
              <button
                type="button"
                onClick={handleCopyInit}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-sans shrink-0 transition-colors cursor-pointer"
              >
                {copiedInit ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Add Components via CLI */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-foreground text-xs font-bold border border-border">
              2
            </span>
            <span>Add Components via CLI</span>
          </h2>
          <p className="text-muted-foreground ml-10 text-xs sm:text-sm">
            Add components directly into your codebase. Fully editable TypeScript components created in <code className="text-primary font-mono text-xs">@/components/ui/</code>.
          </p>
        </div>

        <div className="ml-0 sm:ml-10">
          <Tabs defaultValue="cli-method" className="w-full">
            <TabsList className="mb-4 bg-muted/60 p-1 rounded-xl flex w-fit max-w-full overflow-x-auto hide-scrollbar border border-border">
              <TabsTrigger
                value="cli-method"
                className="rounded-lg px-5 py-2 text-xs sm:text-sm flex items-center gap-2"
              >
                <Terminal className="h-3.5 w-3.5" />
                CLI (Recommended)
              </TabsTrigger>
              <TabsTrigger
                value="npm-method"
                className="rounded-lg px-5 py-2 text-xs sm:text-sm flex items-center gap-2"
              >
                <Package className="h-3.5 w-3.5" />
                npm Package
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cli-method" className="space-y-3 outline-none">
              <InstallationCodeBlock
                filename="Terminal"
                code={`# 1. Initialize configuration\n${getInitCommand()}\n\n# 2. Add individual components\n${getRunner()} nexoreui add button card modal input switch badge\n\n# 3. Or add the AI & Agentic suite\n${getRunner()} nexoreui add aurora-border-card ai-prompt-input command\n\n# 4. Or include all 40 components\n${getRunner()} nexoreui add --all`}
              />
            </TabsContent>

            <TabsContent value="npm-method" className="space-y-3 outline-none">
              <InstallationCodeBlock
                filename="Terminal"
                code={`# Install core package and peer dependencies\n${getInstallDepsCommand()}`}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Step 3: CSS Theme Variables */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-foreground text-xs font-bold border border-border">
              3
            </span>
            <span>Configure globals.css (Tailwind CSS v4)</span>
          </h2>
          <p className="text-muted-foreground ml-10 text-xs sm:text-sm">
            Add the generated theme tokens to your stylesheet for automatic dark/light mode support and custom radius.
          </p>
        </div>

        <div className="ml-0 sm:ml-10">
          <InstallationCodeBlock
            filename="app/globals.css"
            code={getGlobalsCssSnippet()}
          />
        </div>
      </div>

      {/* Step 4: Utilities Helper (lib/utils.ts) */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-foreground text-xs font-bold border border-border">
              4
            </span>
            <span>Configure Utility Helper (lib/utils.ts)</span>
          </h2>
          <p className="text-muted-foreground ml-10 text-xs sm:text-sm">
            Ensure your project has the standard <code className="text-primary font-mono text-xs">cn()</code> helper for merging Tailwind classes cleanly.
          </p>
        </div>

        <div className="ml-0 sm:ml-10">
          <InstallationCodeBlock
            filename="src/lib/utils.ts"
            code={`import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
          />
        </div>
      </div>
    </section>
  );
}
