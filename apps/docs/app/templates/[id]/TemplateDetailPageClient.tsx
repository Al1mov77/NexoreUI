"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Terminal,
  Copy,
  Check,
  Code2,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  Layers,
  Upload,
  Shuffle,
  Trash2,
  X,
} from "lucide-react";
import { TemplateItem, TEMPLATES } from "../../data/templates";
import { RenderTemplatePreview } from "../../components/templates/TemplatePreviews";
import { TemplatePreviewWrapper } from "../../components/templates/TemplatePreviewWrapper";
import { TemplateCustomizerStudio } from "../../components/templates/TemplateCustomizerStudio";
import { TemplateCodeExportModal } from "../../components/templates/TemplateCodeExportModal";
import {
  TemplateCustomizerProvider,
  useTemplateCustomizer,
  DEFAULT_TEMPLATE_CONFIG,
  DeviceMode,
} from "../../context/TemplateCustomizerContext";

function TemplateDetailContent({ template }: { template: TemplateItem }) {
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

  const [copiedCli, setCopiedCli] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const handleCopyCli = () => {
    navigator.clipboard.writeText(template.cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const relatedTemplates = TEMPLATES.filter((t) => t.id !== template.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/20">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <Link href="/templates" className="hover:text-foreground transition-colors">
            Templates
          </Link>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <span className="text-foreground font-semibold">{template.title}</span>
        </nav>

        {/* Template Header Hero */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              {template.category}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono text-muted-foreground bg-muted border border-border/50">
              {template.badge} Architecture
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                {template.title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={() => setIsStudioOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-md hover:opacity-90 flex items-center gap-1.5 transition-all"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Customize in Studio</span>
              </button>

              <button
                onClick={() => setIsCodeModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground flex items-center gap-1.5 transition-all"
              >
                <Code2 className="h-3.5 w-3.5 text-primary" />
                <span>Export Code</span>
              </button>
            </div>
          </div>

          {/* CLI Installation Box */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl border border-border bg-card/60 backdrop-blur-md text-xs font-mono max-w-full overflow-x-auto">
              <Terminal className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-muted-foreground select-all">{template.cliCommand}</span>
              <button
                onClick={handleCopyCli}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                title="Copy CLI command"
              >
                {copiedCli ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Live Interactive Preview Canvas Frame */}
        <section className="rounded-3xl border border-border/80 bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden space-y-0">
          {/* Top Bar 1: Viewport & Device Switcher */}
          <div className="px-4 py-2.5 border-b border-border/50 bg-muted/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                {template.slug}.nexoreui.site • Live Viewport
              </span>
            </div>

            {/* Device Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-background/80 border border-border/60 text-xs shadow-xs">
              {(
                [
                  { mode: "desktop" as DeviceMode, icon: Monitor, label: "Desktop (1024px)" },
                  { mode: "tablet" as DeviceMode, icon: Tablet, label: "Tablet (768px)" },
                  { mode: "mobile" as DeviceMode, icon: Smartphone, label: "Mobile (390px)" },
                ] as const
              ).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setDeviceMode(mode)}
                  title={label}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all text-xs ${
                    deviceMode === mode
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline text-[11px]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Bar 2: Live Theme Customizer Quick-Bar */}
          <div className="px-4 py-2.5 border-b border-border/40 bg-muted/30 flex items-center justify-between gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold border border-primary/20">
                <Sparkles className="w-3 h-3" />
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

              {/* Quick Logo Upload Button & Active Indicator */}
              <div className="flex items-center">
                <input
                  type="file"
                  id="detail-logo-upload"
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
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 border border-primary/30 text-[11px] text-primary">
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
                    htmlFor="detail-logo-upload"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border/60 bg-background/60 hover:bg-muted text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-xs"
                    title="Upload custom logo icon (SVG, PNG, WebP)"
                  >
                    <Upload className="w-3 h-3 text-primary" />
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
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Dark Mode"
                >
                  <Moon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Rendered Template Viewport */}
          <div className="overflow-hidden bg-card">
            <TemplatePreviewWrapper showToolbar={false} maxHeight="max-h-[850px]" autoFit={false}>
              <RenderTemplatePreview templateId={template.id} />
            </TemplatePreviewWrapper>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6">
          <h2 className="text-xl font-bold">Architecture Features & Deliverables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {template.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs leading-relaxed">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-mono text-[11px]">Tags:</span>
            {template.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg border border-border bg-muted/40 font-mono text-[11px]">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Recommended & Related Templates */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Explore More Architectures</h2>
            <Link href="/templates" className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
              <span>View All 22 Starters</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTemplates.map((item) => (
              <Link
                key={item.id}
                href={`/templates/${item.slug}`}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-muted font-semibold">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">{item.badge}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {item.subtitle}
                  </p>
                </div>
                <div className="pt-2 text-xs text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Template</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Customizer Studio Modal */}
      {isStudioOpen && (
        <TemplateCustomizerStudio
          template={template}
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
        />
      )}

      {/* Code Export Modal */}
      {isCodeModalOpen && (
        <TemplateCodeExportModal
          template={template}
          config={config}
          isOpen={isCodeModalOpen}
          onClose={() => setIsCodeModalOpen(false)}
        />
      )}
    </div>
  );
}

export function TemplateDetailPageClient({ template }: { template: TemplateItem }) {
  return (
    <TemplateCustomizerProvider>
      <TemplateDetailContent template={template} />
    </TemplateCustomizerProvider>
  );
}
