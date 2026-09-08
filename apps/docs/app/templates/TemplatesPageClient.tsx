"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Sliders,
  Eye,
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  X,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  ArrowRight,
  Layers,
  Filter,
} from "lucide-react";
import { TEMPLATES, TemplateItem, TemplateCategory } from "../data/templates";
import { RenderTemplatePreview } from "../components/templates/TemplatePreviews";
import { TemplatePreviewWrapper } from "../components/templates/TemplatePreviewWrapper";
import { TemplateCustomizerStudio } from "../components/templates/TemplateCustomizerStudio";
import { TemplateCodeExportModal } from "../components/templates/TemplateCodeExportModal";
import {
  TemplateCustomizerProvider,
  useTemplateCustomizer,
  DEFAULT_TEMPLATE_CONFIG,
} from "../context/TemplateCustomizerContext";

function TemplatesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSlug = searchParams.get("template");
  const initialMode = searchParams.get("mode"); // "customize" | "preview" | "code"

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("All");
  const [copiedCli, setCopiedCli] = useState<string | null>(null);

  // Modals
  const [customizeTemplate, setCustomizeTemplate] = useState<TemplateItem | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [codeTemplate, setCodeTemplate] = useState<TemplateItem | null>(null);

  // Sync initial query params
  useEffect(() => {
    if (initialSlug) {
      const match = TEMPLATES.find((t) => t.slug === initialSlug || t.id === initialSlug);
      if (match) {
        if (initialMode === "customize") setCustomizeTemplate(match);
        else if (initialMode === "code") setCodeTemplate(match);
        else setPreviewTemplate(match);
      }
    }
  }, [initialSlug, initialMode]);

  const categories: TemplateCategory[] = [
    "All",
    "Landing",
    "Dashboard",
    "Developer Tools",
    "Fintech",
    "E-Commerce",
    "Portfolio",
    "Agency",
    "AI Application",
    "Waitlist",
    "Documentation",
  ];

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((tmpl) => {
      const matchesCategory =
        selectedCategory === "All" || tmpl.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tmpl.title.toLowerCase().includes(q) ||
        tmpl.subtitle.toLowerCase().includes(q) ||
        tmpl.description.toLowerCase().includes(q) ||
        tmpl.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredTemplate = TEMPLATES[0]; // Synthetix AI

  const handleCopyCli = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCli(cmd);
    setTimeout(() => setCopiedCli(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-indigo-500/20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Calm Hero Section */}
        <header className="text-center max-w-3xl mx-auto pt-4 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-mono mb-4 text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>NexoreUI Templates Ecosystem</span>
            <span className="opacity-40">•</span>
            <span>12 Production Architectures</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Production-Grade Application Templates
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Handcrafted with responsive Light & Dark surface hierarchy, real-time theme customization studio, and independent zero-dependency code export.
          </p>

          {/* Search Input */}
          <div className="max-w-md mx-auto relative mb-6">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by feature, category, or stack..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Calm Category Filter Pills */}
          <nav className="flex flex-wrap items-center justify-center gap-1.5 text-xs" aria-label="Template categories">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  selectedCategory === cat
                    ? "bg-foreground text-background border-foreground font-semibold shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </header>

        {/* Calm Featured Template Spotlight (shown when not searching) */}
        {!searchQuery && selectedCategory === "All" && featuredTemplate && (
          <section
            aria-label="Featured Template"
            className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Details */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                    Flagship Template
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {featuredTemplate.category}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                    {featuredTemplate.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-primary mb-2">
                    {featuredTemplate.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {featuredTemplate.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  {featuredTemplate.features.slice(0, 3).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions & CLI command */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setCustomizeTemplate(featuredTemplate)}
                    className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Customize in Studio</span>
                  </button>

                  <button
                    onClick={() => setPreviewTemplate(featuredTemplate)}
                    className="px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Live Preview</span>
                  </button>

                  <button
                    onClick={() => handleCopyCli(featuredTemplate.cliCommand)}
                    className="px-3 py-2.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-xs font-mono text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5"
                    title="Copy CLI install command"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{featuredTemplate.cliCommand}</span>
                    <span className="sm:hidden">Copy CLI</span>
                    {copiedCli === featuredTemplate.cliCommand ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Right Interactive Preview Window */}
              <div
                onClick={() => setPreviewTemplate(featuredTemplate)}
                className="lg:col-span-6 h-64 sm:h-80 rounded-xl border border-border/80 overflow-hidden relative group cursor-pointer shadow-sm"
              >
                <div className="w-[200%] h-[200%] origin-top-left transform scale-50 pointer-events-none select-none">
                  <TemplatePreviewWrapper autoFit={false} maxHeight="max-h-full">
                    <RenderTemplatePreview templateId={featuredTemplate.id} />
                  </TemplatePreviewWrapper>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[2px]">
                  <Eye className="h-4 w-4" />
                  <span>Click for Full Viewport Experience</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Template Catalog Grid */}
        <section aria-label="All Templates Catalog" className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              All Available Templates ({filteredTemplates.length})
            </h2>
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
              <span>Light + Dark Responsive</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-2xl border border-border bg-card hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md group text-left"
              >
                {/* Card Preview Window */}
                <div
                  onClick={() => setPreviewTemplate(tmpl)}
                  className="relative h-52 w-full bg-zinc-950 border-b border-border overflow-hidden cursor-pointer group-hover:brightness-105 transition-all"
                >
                  <div className="w-[200%] h-[200%] origin-top-left transform scale-50 pointer-events-none select-none">
                    <TemplatePreviewWrapper autoFit={false} maxHeight="max-h-full">
                      <RenderTemplatePreview templateId={tmpl.id} />
                    </TemplatePreviewWrapper>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[2px]">
                    <Eye className="h-4 w-4" />
                    <span>View Interactive Template</span>
                  </div>

                  {/* Category & Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20">
                      {tmpl.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm bg-zinc-800/80 border border-white/10">
                      {tmpl.badge}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold tracking-tight mb-1 text-foreground">
                      {tmpl.title}
                    </h3>
                    <p className="text-xs text-primary font-medium mb-2 truncate">
                      {tmpl.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {tmpl.description}
                    </p>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {tmpl.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3 Calm Actions: Preview, Customize, Code */}
                  <div className="pt-4 border-t border-border flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(tmpl)}
                      className="flex-1 py-2 rounded-xl border border-border bg-background hover:bg-secondary text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 text-foreground"
                      title="Live Responsive Preview"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => setCustomizeTemplate(tmpl)}
                      className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground hover:brightness-110 text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                      title="Customize in Studio"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Customize</span>
                    </button>

                    <button
                      onClick={() => setCodeTemplate(tmpl)}
                      className="p-2 rounded-xl border border-border bg-background hover:bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors"
                      title="View & Export Code"
                      aria-label={`View code for ${tmpl.title}`}
                    >
                      <Code2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty Search State */}
          {filteredTemplates.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              <p className="text-sm font-medium mb-1">No templates matched your search query.</p>
              <p className="text-xs">Try searching for "AI", "Fintech", "Docs", or "Dashboard".</p>
            </div>
          )}
        </section>
      </div>

      {/* 1. Customizer Studio Modal */}
      {customizeTemplate && (
        <TemplateCustomizerStudio
          template={customizeTemplate}
          isOpen={!!customizeTemplate}
          onClose={() => setCustomizeTemplate(null)}
        />
      )}

      {/* 2. Full Live Responsive Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-3 sm:p-6">
          <div className="max-w-7xl w-full mx-auto flex items-center justify-between pb-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm">{previewTemplate.title} — Responsive Preview</span>
              <span className="text-xs text-zinc-400 font-mono">({previewTemplate.category})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const curr = previewTemplate;
                  setPreviewTemplate(null);
                  setCustomizeTemplate(curr);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Customize in Studio</span>
              </button>

              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-7xl mx-auto overflow-hidden">
            <TemplatePreviewWrapper showToolbar maxHeight="max-h-[85vh]">
              <RenderTemplatePreview templateId={previewTemplate.id} />
            </TemplatePreviewWrapper>
          </div>
        </div>
      )}

      {/* 3. Code Export Modal */}
      {codeTemplate && (
        <TemplateCodeExportModal
          template={codeTemplate}
          config={DEFAULT_TEMPLATE_CONFIG}
          isOpen={!!codeTemplate}
          onClose={() => setCodeTemplate(null)}
        />
      )}
    </div>
  );
}

export default function TemplatesPageClient() {
  return (
    <TemplateCustomizerProvider>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <TemplatesPageContent />
      </Suspense>
    </TemplateCustomizerProvider>
  );
}
