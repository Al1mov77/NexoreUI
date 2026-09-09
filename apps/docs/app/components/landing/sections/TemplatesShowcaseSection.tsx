"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  FolderGit2,
  Gift,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Terminal,
  ArrowRight,
  Eye,
  Sliders,
  Cpu,
  Layers,
  CreditCard,
  ShoppingBag,
  Briefcase,
  Bot,
  Kanban,
  FileText,
  Lock,
  X,
  Play,
  CheckCircle2,
  Maximize2,
  Activity,
  Coins,
  GraduationCap,
  Calendar,
  Headphones,
  Building2,
  ShieldCheck,
  Workflow,
  Utensils,
  LifeBuoy,
  Sun,
  Moon,
  Upload,
  Shuffle,
  Dumbbell,
  Compass,
  Server,
  Disc,
  Sword,
  Ship,
  Trophy,
  Grid,
  ShieldAlert,
  Sprout,
} from "lucide-react";
import { TEMPLATES, TemplateItem } from "../../../data/templates";
import { RenderTemplatePreview } from "../../templates/TemplatePreviews";
import { TemplatePreviewWrapper } from "../../templates/TemplatePreviewWrapper";
import { TemplateCustomizerProvider, useTemplateCustomizer, DeviceMode } from "../../../context/TemplateCustomizerContext";

const TEMPLATE_ICONS: Record<string, React.ElementType> = {
  "template-ai-startup": Cpu,
  "template-modern-saas": Layers,
  "template-analytics-dashboard": LayoutDashboard,
  "template-devtools-cli": Terminal,
  "template-creative-portfolio": FolderGit2,
  "template-fintech-app": CreditCard,
  "template-ecommerce-store": ShoppingBag,
  "template-agency-creative": Briefcase,
  "template-ai-chat": Bot,
  "template-project-management": Kanban,
  "template-startup-waitlist": Gift,
  "template-docs-platform": FileText,
  "template-healthcare-portal": Activity,
  "template-web3-dex": Coins,
  "template-edtech-learning": GraduationCap,
  "template-conference-event": Calendar,
  "template-audio-podcast": Headphones,
  "template-real-estate": Building2,
  "template-uptime-status": ShieldCheck,
  "template-agent-workflow": Workflow,
  "template-restaurant-culinary": Utensils,
  "template-help-center": LifeBuoy,
  "template-fitness-athletics": Dumbbell,
  "template-wilderness-travel": Compass,
  "template-devops-kubernetes": Server,
  "template-audio-daw": Disc,
  "template-gamified-habits": Sword,
  "template-global-logistics": Ship,
  "template-gaming-esports": Trophy,
  "template-architecture-spatial": Grid,
  "template-cybersecurity-soc": ShieldAlert,
  "template-cleantech-agriculture": Sprout,
};

function TemplatesShowcaseContent() {
  const SHOWCASE_TEMPLATE_IDS = [
    "template-ai-startup",
    "template-healthcare-portal",
    "template-web3-dex",
    "template-analytics-dashboard",
  ];
  const showcaseTemplates = TEMPLATES.filter((t) => SHOWCASE_TEMPLATE_IDS.includes(t.id));

  const [activeTemplateId, setActiveTemplateId] = useState<string>("template-ai-startup");
  const {
    config,
    updateConfig,
    setColorPreset,
    setCustomLogoUrl,
    removeCustomLogo,
    randomizeConfig,
    deviceMode,
    setDeviceMode,
  } = useTemplateCustomizer();
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const activeTemplate = TEMPLATES.find((t) => t.id === activeTemplateId) || TEMPLATES[0];

  const handleCopyCode = () => {
    if (!activeTemplate) return;
    navigator.clipboard.writeText(activeTemplate.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSelectTemplate = (id: string) => {
    setActiveTemplateId(id);
    // Reset to preview cover mode when changing templates for clean presentation
    setIsLiveOpen(false);
  };

  // Lock body scroll and listen for Escape key in fullscreen mode
  useEffect(() => {
    if (!fullscreenOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreenOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreenOpen]);

  return (
    <section className="py-24 px-4 sm:px-6 border-t border-border/50 relative z-10 overflow-hidden" id="templates">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-500/[0.08] via-blue-500/[0.04] to-transparent blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-to-tl from-cyan-500/[0.06] to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 text-xs font-mono mb-4"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>PRODUCTION TEMPLATES</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-3 leading-tight"
            >
              Ship in Hours,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">
                Not Weeks
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-muted-foreground leading-relaxed"
            >
              Explore 4 flagship architectures below with real-time live theme customization, or view all 22 starters with independent source code export.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/25 hover:bg-cyan-400 hover:shadow-cyan-500/40 transition-all group"
            >
              <span>Explore All 22 Starters</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* 4 Flagship Template Switcher Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar"
        >
          {showcaseTemplates.map((tmpl) => {
            const IconComp = TEMPLATE_ICONS[tmpl.id] || Sparkles;
            const isActive = tmpl.id === activeTemplateId;

            return (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold border-cyan-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border-transparent"
                }`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span className="font-semibold">{tmpl.title}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-black/20 text-slate-950 font-bold"
                      : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  {tmpl.category}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Interactive Showcase Preview Window */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-2xl shadow-2xl shadow-black/20 overflow-hidden"
        >
          {/* Top Bar — Tier 1: Browser Chrome & Viewport Switcher */}
          <div className="px-4 py-2.5 border-b border-border/50 bg-muted/20 flex items-center justify-between gap-3 text-xs">
            {/* Window traffic dots + address pill */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block hover:bg-red-500 transition-colors" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block hover:bg-amber-500 transition-colors" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block hover:bg-emerald-500 transition-colors" />
              </div>

              {/* Browser Address Bar Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background/80 border border-border/50 text-[11px] font-mono text-muted-foreground truncate max-w-[220px] sm:max-w-xs shadow-xs">
                <Lock className="w-2.5 h-2.5 text-cyan-500 shrink-0" />
                <span className="truncate">{activeTemplate.slug}.nexoreui.site</span>
              </div>
            </div>

            {/* Device Switcher (Desktop, Tablet, Mobile) */}
            <div className="flex items-center p-0.5 rounded-xl bg-background/70 border border-border/60 text-xs shadow-xs shrink-0">
              {([
                { mode: "desktop" as DeviceMode, icon: Monitor, label: "Desktop" },
                { mode: "tablet" as DeviceMode, icon: Tablet, label: "Tablet" },
                { mode: "mobile" as DeviceMode, icon: Smartphone, label: "Mobile" },
              ]).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setDeviceMode(mode)}
                  title={`${label} Preview`}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-xs ${
                    deviceMode === mode
                      ? "bg-cyan-500 text-slate-950 shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline text-[11px]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Bar — Tier 2: Instant Live Theme Customizer Bar */}
          <div className="px-4 py-2 border-b border-border/40 bg-muted/30 flex items-center justify-between gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/20">
                <Sparkles className="w-3 h-3 text-cyan-500" />
                <span>Live Customizer</span>
              </span>
              <span className="text-[11px] text-muted-foreground hidden lg:inline">
                Customize palette, upload custom logo, or randomize live:
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Color Preset Palette Dots */}
              <div className="flex items-center gap-1.5">
                {[
                  { id: "indigo", color: "#6366f1", label: "Indigo" },
                  { id: "blue", color: "#3b82f6", label: "Ocean Blue" },
                  { id: "emerald", color: "#10b981", label: "Forest Green" },
                  { id: "rose", color: "#f43f5e", label: "Rose" },
                  { id: "orange", color: "#f97316", label: "Sunset" },
                  { id: "violet", color: "#8b5cf6", label: "Violet" },
                  { id: "cyan", color: "#06b6d4", label: "Cyan" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setColorPreset(preset.id as any)}
                    title={preset.label}
                    className={`w-3.5 h-3.5 rounded-full transition-all hover:scale-125 cursor-pointer ${
                      config.colors.presetId === preset.id
                        ? "ring-2 ring-offset-2 ring-foreground scale-110"
                        : "opacity-80"
                    }`}
                    style={{ backgroundColor: preset.color }}
                  />
                ))}
              </div>

              {/* Quick Logo Upload Button & Indicator */}
              <div className="flex items-center">
                <input
                  type="file"
                  id="showcase-logo-upload"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const dataUrl = event.target?.result as string;
                      if (dataUrl) setCustomLogoUrl(dataUrl);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {config.customLogoUrl ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-600 dark:text-cyan-400">
                    <img src={config.customLogoUrl} alt="Logo" className="w-3.5 h-3.5 object-contain" />
                    <span className="font-mono text-[10px]">Logo</span>
                    <button
                      onClick={removeCustomLogo}
                      title="Remove custom logo"
                      className="text-muted-foreground hover:text-red-400 p-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="showcase-logo-upload"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border/60 bg-background/60 hover:bg-muted text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-xs"
                    title="Upload custom logo icon (SVG, PNG, WebP)"
                  >
                    <Upload className="w-3 h-3 text-cyan-500" />
                    <span>Upload Logo</span>
                  </label>
                )}
              </div>

              {/* 🎲 Shuffle / Randomize Button */}
              <button
                onClick={randomizeConfig}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[11px] font-semibold transition-all shadow-xs"
                title="Shuffle Theme: randomize colors, fonts & radius"
              >
                <Shuffle className="w-3 h-3" />
                <span className="hidden sm:inline">Shuffle</span>
              </button>

              {/* Theme Toggle Button (Light/Dark) */}
              <div className="flex items-center border border-border/60 rounded-lg p-0.5 bg-background/60">
                <button
                  onClick={() => updateConfig({ theme: "light" })}
                  className={`p-1 rounded transition-colors ${
                    config.theme === "light"
                      ? "bg-amber-400 text-slate-950 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Light Mode"
                >
                  <Sun className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => updateConfig({ theme: "dark" })}
                  className={`p-1 rounded transition-colors ${
                    config.theme === "dark"
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Dark Mode"
                >
                  <Moon className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Link to dedicated template page */}
              <Link
                href={`/templates/${activeTemplate.slug}`}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline ml-1"
              >
                <span>Full Page</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Top Bar — Tier 2: Template Meta & Quick Action Buttons */}
          <div className="px-4 py-2.5 border-b border-border/40 bg-muted/10 flex items-center justify-between gap-2 text-xs flex-wrap sm:flex-nowrap">
            {/* Left: Title & Category */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-foreground truncate text-xs sm:text-sm">
                {activeTemplate.title}
              </span>
              <span className="hidden sm:inline text-muted-foreground font-mono text-[10px] px-2 py-0.5 rounded-md bg-secondary border border-border/40">
                {activeTemplate.category}
              </span>
              <span className="text-[10px] text-cyan-500 font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                {isLiveOpen ? "Interactive Realtime" : "Visual Preview"}
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              {/* Toggle Live Preview or Close Live Preview */}
              {isLiveOpen ? (
                <button
                  onClick={() => setIsLiveOpen(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  title="Collapse live sandbox and return to preview mode"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Close Preview</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsLiveOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-cyan-400 transition-all cursor-pointer"
                  title="Open live template sandbox with active controls"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Interactive Mode</span>
                </button>
              )}

              <button
                onClick={() => setFullscreenOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border/60 text-foreground text-xs font-medium transition-all cursor-pointer"
                title="Open fullscreen view"
              >
                <Maximize2 className="h-3.5 w-3.5 text-cyan-500" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>

              <Link
                href={`/templates?template=${activeTemplate.slug}&mode=customize`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border/60 text-foreground text-xs font-medium transition-all"
                title="Customize tokens in Studio"
              >
                <Sliders className="h-3.5 w-3.5 text-cyan-500" />
                <span className="hidden sm:inline">Customize</span>
              </Link>

              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background/80 hover:bg-background border border-border text-xs font-medium text-foreground transition-all shadow-xs"
                title="Copy template code"
              >
                {copiedCode ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="hidden sm:inline">{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Canvas Area: Real Visual Template Preview with Interactive Lock & Unlock */}
          <div className="relative min-h-[460px] sm:min-h-[620px] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Live Interactive Strip when unlocked */}
            {isLiveOpen && (
              <div className="w-full max-w-4xl mx-auto px-4 pt-3 pb-1 flex items-center justify-between z-30">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-zinc-200 font-semibold">Interactive Sandbox</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400 text-[11px] font-mono">
                    Inputs, models & state controls unlocked
                  </span>
                </div>

                <button
                  onClick={() => setIsLiveOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
                  title="Return to preview mode"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close Preview</span>
                </button>
              </div>
            )}

            {/* REAL Visual Template Render */}
            <div className={`w-full h-full relative transition-all duration-300 ${!isLiveOpen ? "pointer-events-none select-none" : ""}`}>
              <TemplatePreviewWrapper
                viewportHeight={620}
                onOpenFullscreen={() => setFullscreenOpen(true)}
              >
                <RenderTemplatePreview templateId={activeTemplate.id} />
              </TemplatePreviewWrapper>
            </div>

            {/* Preview Mode Glass Overlay (Displays real template below + launch button) */}
            {!isLiveOpen && (
              <div className="absolute inset-x-0 bottom-0 z-20 pt-20 pb-8 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent flex flex-col items-center justify-center gap-3 pointer-events-none">
                <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setIsLiveOpen(true)}
                    className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl shadow-cyan-500/30 hover:bg-cyan-400 hover:shadow-cyan-500/50 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Interactive Sandbox</span>
                  </button>

                  <button
                    onClick={() => setFullscreenOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white font-semibold text-xs border border-white/15 shadow-xl backdrop-blur-md hover:border-cyan-500/40 active:scale-95 transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fullscreen View</span>
                  </button>
                </div>

                <p className="text-[11px] text-zinc-400 font-mono tracking-tight pointer-events-none">
                  {activeTemplate.title} ({activeTemplate.category}) • Click to test models, prompt input & widgets
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Live Demo Modal with Dedicated Floating Close Button */}
      {fullscreenOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col p-3 sm:p-6 overflow-hidden">
          {/* FLOATING HIGH-VISIBILITY CLOSE BUTTON (Top-Right of Viewport) */}
          <button
            onClick={() => setFullscreenOpen(false)}
            id="fullscreen-floating-close-btn"
            className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[100000] inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-zinc-900/95 hover:bg-red-600 text-white border border-white/20 shadow-2xl backdrop-blur-2xl text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 group"
            title="Close Fullscreen (Esc)"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 group-hover:bg-white transition-colors animate-pulse" />
            <X className="w-4 h-4 stroke-[2.5]" />
            <span>Close (Esc)</span>
          </button>

          {/* Modal Header */}
          <div className="max-w-7xl w-full mx-auto flex items-center justify-between pb-3 text-white shrink-0 pr-32 sm:pr-36">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-bold text-sm sm:text-base">{activeTemplate.title} — Fullscreen Live Demo</span>
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">({activeTemplate.category})</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/templates?template=${activeTemplate.slug}&mode=customize`}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-cyan-400 flex items-center gap-1.5 transition-all"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Customize in Studio</span>
              </Link>
            </div>
          </div>

          {/* Fullscreen Viewport Container */}
          <div className="flex-1 w-full max-w-7xl mx-auto overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-zinc-950">
            <TemplatePreviewWrapper showToolbar maxHeight="max-h-[85vh]" autoFit={false}>
              <RenderTemplatePreview templateId={activeTemplate.id} />
            </TemplatePreviewWrapper>
          </div>
        </div>
      )}
    </section>
  );
}

export function TemplatesShowcaseSection() {
  return (
    <TemplateCustomizerProvider>
      <TemplatesShowcaseContent />
    </TemplateCustomizerProvider>
  );
}
