"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Eye,
  EyeOff,
  Code2,
  Copy,
  Check,
  Terminal,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import {
  TEMPLATES,
  TemplateItem,
  TemplateCategory,
  isCinematicVideoTemplate,
  getTemplatePreviewImage,
  getTemplatePreviewVideo,
} from "../data/templates";
import { RenderTemplatePreview } from "../components/templates/TemplatePreviews";
import { TemplatePreviewWrapper } from "../components/templates/TemplatePreviewWrapper";
import { TemplateCardMedia } from "../components/templates/TemplateCardMedia";
import { TemplateCodeExportModal } from "../components/templates/TemplateCodeExportModal";
import {
  TemplateCustomizerProvider,
  useTemplateCustomizer,
} from "../context/TemplateCustomizerContext";

const FLAGSHIP_SLIDE_IDS = [
  "template-velvet-gelato-pro",
  "template-vortex-apex-pro",
  "template-aerovoid-obsidian-pro",
  "template-amarena-royale-pro",
  "template-monolith-cacao-pro",
  "template-levitas-cryo-pro",
] as const;

const SLIDE_DURATION_MS = 6500;

const CATEGORIES: readonly TemplateCategory[] = [
  "All",
  "Landing",
  "Automotive",
  "Hardware & 3D",
  "Dashboard",
  "Developer Tools",
  "E-Commerce",
  "AI Application",
  "Portfolio",
  "Hospitality",
] as const;

type ArchitectureFilter = "all" | "app-ui" | "3d-canvas" | "video";

const ARCHITECTURE_FILTERS: readonly { id: ArchitectureFilter; label: string }[] = [
  { id: "all", label: "All Types" },
  { id: "app-ui", label: "App UI & CRUD" },
  { id: "3d-canvas", label: "3D & Canvas" },
  { id: "video", label: "Video" },
] as const;

const APP_UI_IDS = new Set<string>([
  "template-ai-chat-interface",
  "template-ecommerce-pro",
  "template-auth-pro",
  "template-nexcore-admin-pro",
  "template-users-table-pro",
  "template-swagger-form-builder",
  "template-portfolio-pro",
]);

const CANVAS_3D_IDS = new Set<string>([
  "template-capy-spa-pro",
  "template-bear-lift-pro",
  "template-burlit-coffee-pro",
  "template-ironpaw-tools-pro",
  "template-stayline-pro",
  "template-vantr-particle",
  "template-vapor-obsidian",
  "template-psyche-obsidian",
  "template-lamborghini-revuelto",
  "template-chrono-x-pro",
  "template-aura-sound-pro",
  "template-vortex-apex-pro",
  "template-aerovoid-obsidian-pro",
  "template-monolith-cacao-pro",
]);

function matchesArchitectureFilter(tmpl: TemplateItem, filter: ArchitectureFilter): boolean {
  if (filter === "all") return true;
  if (filter === "app-ui") return APP_UI_IDS.has(tmpl.id);
  if (filter === "3d-canvas") return CANVAS_3D_IDS.has(tmpl.id);
  if (filter === "video") {
    return (
      Boolean(tmpl.previewVideo || getTemplatePreviewVideo(tmpl.slug) || getTemplatePreviewVideo(tmpl.id)) ||
      isCinematicVideoTemplate(tmpl.id)
    );
  }
  return true;
}

function formatCardTitle(title: string): { name: string; subtitle?: string } {
  if (title.includes(" — ")) {
    const parts = title.split(" — ");
    const name = parts[0].trim();
    const subtitle = parts.slice(1).join(" — ").trim();
    return { name, subtitle };
  }
  return { name: title };
}

function TemplatesPageContent() {
  const searchParams = useSearchParams();

  const initialSlug = searchParams.get("template");
  const initialMode = searchParams.get("mode");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("All");
  const [architectureFilter, setArchitectureFilter] = useState<ArchitectureFilter>("all");
  const [copiedCli, setCopiedCli] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { config } = useTemplateCustomizer();

  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [codeTemplate, setCodeTemplate] = useState<TemplateItem | null>(null);
  const [isFullscreenView, setIsFullscreenView] = useState(false);
  const [isControlsHidden, setIsControlsHidden] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === "Escape") {
        if (isFullscreenView) {
          setIsFullscreenView(false);
          setIsControlsHidden(false);
        } else if (previewTemplate) {
          setPreviewTemplate(null);
        } else if (codeTemplate) {
          setCodeTemplate(null);
        } else if (searchQuery) {
          setSearchQuery("");
        }
      } else if (e.key.toLowerCase() === "h" && isFullscreenView) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== "input" && activeTag !== "textarea") {
          e.preventDefault();
          setIsControlsHidden((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenView, previewTemplate, codeTemplate, searchQuery]);

  useEffect(() => {
    if (initialSlug) {
      const match = TEMPLATES.find((t) => t.slug === initialSlug || t.id === initialSlug);
      if (match) {
        if (initialMode === "code") setCodeTemplate(match);
        else setPreviewTemplate(match);
      }
    }
  }, [initialSlug, initialMode]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: 0 };
    for (const cat of CATEGORIES) {
      if (cat !== "All") counts[cat] = 0;
    }
    for (const tmpl of TEMPLATES) {
      if (!matchesArchitectureFilter(tmpl, architectureFilter)) continue;
      counts.All = (counts.All || 0) + 1;
      counts[tmpl.category] = (counts[tmpl.category] || 0) + 1;
    }
    return counts;
  }, [architectureFilter]);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((tmpl) => {
      const matchesCategory =
        selectedCategory === "All" || tmpl.category === selectedCategory;
      const matchesArch = matchesArchitectureFilter(tmpl, architectureFilter);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tmpl.title.toLowerCase().includes(q) ||
        tmpl.subtitle.toLowerCase().includes(q) ||
        tmpl.description.toLowerCase().includes(q) ||
        tmpl.category.toLowerCase().includes(q) ||
        tmpl.tags.some((t) => t.toLowerCase().includes(q)) ||
        (tmpl.cliCommand && tmpl.cliCommand.toLowerCase().includes(q));
      return matchesCategory && matchesArch && matchesSearch;
    });
  }, [searchQuery, selectedCategory, architectureFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, architectureFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE));

  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTemplates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTemplates, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const catalogEl = document.getElementById("templates-catalog-section");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const flagshipSlides = useMemo(() => {
    return FLAGSHIP_SLIDE_IDS.map((id) => TEMPLATES.find((t) => t.id === id)).filter(
      (t): t is TemplateItem => Boolean(t)
    );
  }, []);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  useEffect(() => {
    if (flagshipSlides.length <= 1 || isSliderPaused) return;

    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100);
      setSlideProgress(pct);

      if (elapsed >= SLIDE_DURATION_MS) {
        setSlideProgress(0);
        setActiveSlideIndex((prev) => (prev + 1) % flagshipSlides.length);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [activeSlideIndex, flagshipSlides.length, isSliderPaused]);

  const activeSlide = flagshipSlides[activeSlideIndex] || flagshipSlides[0];
  const activeSlideFormatted = activeSlide ? formatCardTitle(activeSlide.title) : null;

  useEffect(() => {
    const container = showcaseRef.current;
    if (!container || !activeSlide) return;

    const playShowcaseVideos = () => {
      const videos = container.querySelectorAll("video");
      videos.forEach((v) => {
        v.muted = true;
        v.playsInline = true;
        if (v.paused) {
          v.play().catch(() => {});
        }
      });
    };

    playShowcaseVideos();
    const timer = setTimeout(playShowcaseVideos, 180);
    return () => clearTimeout(timer);
  }, [activeSlide]);

  const selectSlide = (idx: number) => {
    setSlideProgress(0);
    setActiveSlideIndex(idx);
  };

  const handlePrevSlide = () => {
    setSlideProgress(0);
    setActiveSlideIndex((prev) => (prev === 0 ? flagshipSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setSlideProgress(0);
    setActiveSlideIndex((prev) => (prev + 1) % flagshipSlides.length);
  };

  const handleCopyCli = (cmd: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(cmd);
    setCopiedCli(cmd);
    setTimeout(() => setCopiedCli(null), 2000);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedCategory !== "All" || architectureFilter !== "all";

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setArchitectureFilter("all");
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-x-clip">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <header className="pb-6 border-b border-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Templates
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
              Full-source Next.js starters with responsive layouts, clean typography, and zero lock-in.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-muted-foreground tabular-nums">
            <span className="px-2.5 py-1 rounded-md bg-muted border border-border text-foreground font-medium">
              {TEMPLATES.length} templates
            </span>
            <span>·</span>
            <span>Next.js 15 &amp; Tailwind v4</span>
          </div>
        </header>

        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
              <div className="relative flex-1 max-w-md">
                <div className="relative rounded-lg border border-border bg-card transition-colors focus-within:border-foreground/40 flex items-center px-3 h-9">
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0 mr-2.5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, stack, or CLI command..."
                    aria-label="Search templates"
                    className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5 pl-2">
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          searchInputRef.current?.focus();
                        }}
                        className="p-0.5 rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-muted-foreground bg-muted border border-border select-none">
                        ⌘K
                      </kbd>
                    )}
                  </div>
                </div>
              </div>

              <div
                role="group"
                aria-label="Filter by architecture type"
                className="inline-flex items-center p-0.5 rounded-lg bg-muted/70 border border-border self-start sm:self-auto"
              >
                {ARCHITECTURE_FILTERS.map((item) => {
                  const isActive = architectureFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setArchitectureFilter(item.id)}
                      className={`relative px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer select-none ${
                        isActive
                          ? "bg-background text-foreground shadow-xs border border-border/80"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-3 text-xs font-mono text-muted-foreground tabular-nums">
              <span>
                Showing {filteredTemplates.length} of {TEMPLATES.length}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1 text-xs text-foreground hover:underline cursor-pointer font-sans font-medium"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Template categories"
            className="flex flex-wrap items-center gap-1.5 pt-1"
          >
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] ?? 0;
              if (cat !== "All" && count === 0 && selectedCategory !== cat) {
                return null;
              }
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none flex items-center gap-1.5 border ${
                    isActive
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] font-mono tabular-nums ${
                      isActive ? "text-background/80" : "text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {!hasActiveFilters && activeSlide && activeSlideFormatted && (
          <section
            ref={showcaseRef}
            aria-label="Featured Template Showcase"
            className="w-full rounded-xl border border-border bg-card overflow-hidden shadow-xs"
          >
            <div className="h-11 px-3.5 sm:px-4 border-b border-border bg-card flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-border" />
                  <span className="w-2 h-2 rounded-full bg-border" />
                  <span className="w-2 h-2 rounded-full bg-border" />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground tabular-nums shrink-0">
                  0{activeSlideIndex + 1} / 0{flagshipSlides.length}
                </span>
                <span className="text-border select-none">·</span>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(activeSlide)}
                  className="text-xs sm:text-sm font-semibold text-foreground hover:underline truncate text-left cursor-pointer"
                >
                  {activeSlideFormatted.name}
                </button>
                {activeSlideFormatted.subtitle && (
                  <span className="hidden md:inline text-xs text-muted-foreground truncate">
                    — {activeSlideFormatted.subtitle}
                  </span>
                )}
                <span className="hidden lg:inline-flex px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border shrink-0">
                  {activeSlide.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(activeSlide)}
                  className="px-2.5 h-7 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-medium transition-opacity flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
              </div>
            </div>

            <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[460px] bg-zinc-950 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={() => setPreviewTemplate(activeSlide)}
                  className="w-full h-full relative cursor-pointer overflow-hidden"
                >
                  <div className="w-full h-full pointer-events-none select-none overflow-hidden">
                    <TemplatePreviewWrapper
                      autoFit={true}
                      viewportHeight={680}
                      maxHeight="max-h-full"
                    >
                      <RenderTemplatePreview templateId={activeSlide.id} />
                    </TemplatePreviewWrapper>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/85 border border-white/15 backdrop-blur-xl shadow-lg text-white select-none">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 hover:text-white transition-colors cursor-pointer"
                  title="Previous Slide"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  {flagshipSlides.map((slide, idx) => {
                    const isActive = idx === activeSlideIndex;
                    const shortTitle = formatCardTitle(slide.title).name;
                    const circumference = 2 * Math.PI * 6;
                    const dashOffset =
                      circumference - (slideProgress / 100) * circumference;

                    return isActive ? (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => selectSlide(idx)}
                        className="relative h-6 px-2.5 rounded-full bg-white/15 border border-white/30 flex items-center gap-1.5 text-[11px] font-mono font-medium text-white overflow-hidden cursor-pointer"
                        title={`Slide ${idx + 1}: ${shortTitle}`}
                        aria-label={`Slide ${idx + 1}: ${shortTitle}`}
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-white/25 pointer-events-none"
                          style={{ width: `${slideProgress}%` }}
                        />
                        <svg
                          className="relative z-10 w-3.5 h-3.5 -rotate-90 shrink-0"
                          viewBox="0 0 16 16"
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="6"
                            fill="none"
                            stroke="rgba(255,255,255,0.25)"
                            strokeWidth="2"
                          />
                          <circle
                            cx="8"
                            cy="8"
                            r="6"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="relative z-10 font-semibold text-white tabular-nums">
                          0{idx + 1}
                        </span>
                        <span className="relative z-10 text-white/95 font-medium tracking-tight truncate max-w-[90px] sm:max-w-[130px]">
                          {shortTitle}
                        </span>
                      </button>
                    ) : (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => selectSlide(idx)}
                        className="w-2 h-2 rounded-full bg-white/35 hover:bg-white/75 transition-colors cursor-pointer"
                        title={`Slide ${idx + 1}: ${shortTitle}`}
                        aria-label={`Slide ${idx + 1}: ${shortTitle}`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 hover:text-white transition-colors cursor-pointer"
                  title="Next Slide"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                <div className="w-px h-3 bg-white/20 mx-0.5" />

                <button
                  type="button"
                  onClick={() => setIsSliderPaused((prev) => !prev)}
                  className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/15 text-white/85 hover:text-white transition-colors cursor-pointer"
                  title={isSliderPaused ? "Resume auto-advance" : "Pause auto-advance"}
                  aria-label={isSliderPaused ? "Resume auto-advance" : "Pause auto-advance"}
                >
                  {isSliderPaused ? (
                    <Play className="h-2.5 w-2.5 fill-current ml-0.5 text-white" />
                  ) : (
                    <Pause className="h-2.5 w-2.5 fill-current text-white/85" />
                  )}
                </button>
              </div>
            </div>

            <div className="px-3.5 sm:px-4 py-2.5 border-t border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <p className="text-muted-foreground truncate max-w-2xl">
                {activeSlide.subtitle}
              </p>
              <button
                type="button"
                onClick={(e) => handleCopyCli(activeSlide.cliCommand, e)}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted border border-border font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                title="Copy CLI command"
              >
                <Terminal className="h-3 w-3 shrink-0" />
                <span>{activeSlide.cliCommand}</span>
                {copiedCli === activeSlide.cliCommand ? (
                  <Check className="h-3 w-3 text-foreground" />
                ) : (
                  <Copy className="h-3 w-3 opacity-60" />
                )}
              </button>
            </div>
          </section>
        )}

        <section
          id="templates-catalog-section"
          aria-label="Templates Catalog"
          className="space-y-6 scroll-mt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedTemplates.map((tmpl) => {
              const cleanTitle = formatCardTitle(tmpl.title);
              const cleanTags = tmpl.tags
                .filter((t) => t !== "NexoreUI PRO" && t !== tmpl.category)
                .slice(0, 3);
              const cliCmd = tmpl.cliCommand || `npx nexore add ${tmpl.slug}`;
              const cardVideoSrc =
                tmpl.previewVideo ||
                getTemplatePreviewVideo(tmpl.slug) ||
                getTemplatePreviewVideo(tmpl.id);

              return (
                <article
                  key={tmpl.id}
                  className="rounded-xl border border-border bg-card flex flex-col justify-between overflow-hidden hover:border-foreground/30 transition-colors group text-left"
                >
                  <div
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="relative h-48 sm:h-52 w-full bg-zinc-950 border-b border-border overflow-hidden cursor-pointer flex flex-col"
                  >
                    <div className="h-7 w-full bg-zinc-900 border-b border-zinc-800/90 px-3 flex items-center justify-between shrink-0 select-none z-20">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-zinc-700" />
                        <span className="w-2 h-2 rounded-full bg-zinc-700" />
                        <span className="w-2 h-2 rounded-full bg-zinc-700" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[150px]">
                        {tmpl.slug}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/80">
                        {tmpl.category}
                      </span>
                    </div>

                    <TemplateCardMedia
                      title={tmpl.title}
                      imageSrc={tmpl.previewImage || getTemplatePreviewImage(tmpl.slug)}
                      templateId={tmpl.id}
                      slug={tmpl.slug}
                      videoSrc={cardVideoSrc}
                    />
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewTemplate(tmpl)}
                          className="group/title block flex-1 min-w-0 text-left cursor-pointer"
                        >
                          <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground group-hover/title:underline truncate">
                            {cleanTitle.name}
                          </h2>
                          {cleanTitle.subtitle && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {cleanTitle.subtitle}
                            </p>
                          )}
                        </button>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border shrink-0">
                          {tmpl.badge}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-2 mb-3">
                        {tmpl.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {cleanTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border text-[10px] font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={(e) => handleCopyCli(cliCmd, e)}
                        className="w-full mb-3 px-2.5 py-1.5 rounded-lg bg-muted/50 hover:bg-muted border border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors group/cli"
                        title="Copy CLI command"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <Terminal className="h-3 w-3 shrink-0" />
                          <span className="truncate">{cliCmd}</span>
                        </div>
                        <div className="shrink-0 pl-1.5">
                          {copiedCli === cliCmd ? (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-foreground">
                              <Check className="h-3 w-3" />
                              <span>Copied</span>
                            </span>
                          ) : (
                            <Copy className="h-3 w-3 opacity-50 group-hover/cli:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 pt-2.5 border-t border-border">
                        <button
                          type="button"
                          onClick={() => setPreviewTemplate(tmpl)}
                          className="flex-1 h-8 px-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs font-medium transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Interactive Preview"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCodeTemplate(tmpl)}
                          className="h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs font-medium"
                          title="Export Code"
                          aria-label="Export Code"
                        >
                          <Code2 className="h-3.5 w-3.5" />
                          <span>Code</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Templates pagination"
              className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border"
            >
              <div className="text-xs text-muted-foreground font-mono tabular-nums">
                Page {currentPage} of {totalPages} ({filteredTemplates.length} templates)
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors flex items-center gap-1 cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const isActive = p === currentPage;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 rounded-lg border text-xs font-mono tabular-nums font-medium transition-colors cursor-pointer ${
                          isActive
                            ? "bg-foreground text-background border-foreground"
                            : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors flex items-center gap-1 cursor-pointer"
                  aria-label="Next Page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </nav>
          )}

          {filteredTemplates.length === 0 && (
            <div className="py-16 text-center border border-dashed border-border rounded-xl bg-muted/20 p-8">
              <Search className="h-6 w-6 text-muted-foreground mx-auto mb-2.5 opacity-60" />
              <p className="text-sm font-semibold text-foreground mb-1">
                No templates matched your filters
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                Try clearing the search query or switching to another category or architecture type.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}
        </section>
      </div>

      

      {previewTemplate && !isFullscreenView && (
        <div className="fixed inset-0 z-50 bg-background/95 dark:bg-black/95 backdrop-blur-2xl flex flex-col p-3 sm:p-6 overflow-hidden">
          <div className="max-w-7xl w-full mx-auto flex items-center justify-between pb-3 text-foreground border-b border-border/60 mb-3 relative z-30 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-bold text-sm sm:text-base text-foreground truncate">
                {previewTemplate.title}
              </span>
              <span className="text-xs text-muted-foreground font-mono shrink-0">
                ({previewTemplate.category})
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsFullscreenView(true)}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-medium text-secondary-foreground border border-border flex items-center gap-1.5 transition-colors cursor-pointer"
                title="View in Fullscreen"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Fullscreen</span>
              </button>

              <button
                type="button"
                onClick={() => setCodeTemplate(previewTemplate)}
                className="px-3.5 py-1.5 rounded-lg bg-foreground text-background hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition-opacity shadow-xs cursor-pointer"
                title="Export full production code"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Export Code</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-7xl mx-auto overflow-hidden">
            <TemplatePreviewWrapper
              showToolbar
              maxHeight="max-h-[85vh]"
              onOpenFullscreen={() => setIsFullscreenView(true)}
            >
              <RenderTemplatePreview templateId={previewTemplate.id} />
            </TemplatePreviewWrapper>
          </div>
        </div>
      )}

      {previewTemplate && isFullscreenView && (
        <div className="fixed inset-0 z-[99999] bg-black flex flex-col w-screen h-screen overflow-hidden">
          <AnimatePresence>
            {!isControlsHidden && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="fixed top-4 right-4 z-[99999] flex items-center gap-2 bg-zinc-950/95 border border-white/20 p-1.5 rounded-xl shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => setCodeTemplate(previewTemplate)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Export full TypeScript code"
                >
                  <Code2 className="h-3.5 w-3.5 text-zinc-300" />
                  <span className="hidden sm:inline">Export Code</span>
                </button>

                

                <button
                  type="button"
                  onClick={() => setIsControlsHidden(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-zinc-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Hide toolbar (or press H)"
                >
                  <EyeOff className="h-3.5 w-3.5 text-zinc-300" />
                  <span className="hidden sm:inline">Hide</span>
                  <span className="text-[10px] font-mono opacity-70 px-1 py-0.5 rounded bg-white/10">
                    H
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFullscreenView(false);
                    setIsControlsHidden(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-medium transition-colors cursor-pointer"
                  title="Exit Fullscreen (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Exit</span>
                  <span className="text-[10px] font-mono opacity-70 px-1 py-0.5 rounded bg-white/10">
                    Esc
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden">
            <RenderTemplatePreview templateId={previewTemplate.id} />
          </div>
        </div>
      )}

      {codeTemplate && (
        <TemplateCodeExportModal
          template={codeTemplate}
          config={config}
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
