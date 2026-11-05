"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Code2, Copy, EyeOff, Maximize2, Search, X } from "lucide-react";
import { TEMPLATES, TemplateItem, getTemplatePreviewImage } from "../data/templates";
import { RenderTemplatePreview } from "../components/templates/TemplatePreviews";
import { TemplatePreviewWrapper } from "../components/templates/TemplatePreviewWrapper";
import { TemplateCardMedia } from "../components/templates/TemplateCardMedia";
import { TemplateCodeExportModal } from "../components/templates/TemplateCodeExportModal";
import { TemplateCustomizerProvider, useTemplateCustomizer } from "../context/TemplateCustomizerContext";

const ALL_CATEGORY = "All";
const FEATURED_COUNT = 2;
const ITEMS_PER_PAGE = 12;
const COPY_RESET_MS = 1800;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const buttonBase = `inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50 ${focusRing}`;
const buttonOutline = `${buttonBase} border border-border bg-background text-foreground hover:bg-accent`;
const buttonGhost = `${buttonBase} text-muted-foreground hover:bg-accent hover:text-foreground`;
const buttonPrimary = `${buttonBase} bg-primary text-primary-foreground hover:bg-primary/90`;

interface CategoryOption {
  name: string;
  count: number;
}

interface CardTitle {
  name: string;
  subtitle: string;
}

function toDisplayName(raw: string): string {
  const isShouting = raw === raw.toUpperCase() && /[A-Z]{3,}/.test(raw);
  if (!isShouting) return raw;
  return raw
    .toLowerCase()
    .split(" ")
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function splitTitle(template: TemplateItem): CardTitle {
  const separator = template.title.includes(" — ") ? " — " : " - ";
  const [head, ...tail] = template.title.split(separator);
  const subtitle = tail.join(separator).trim();
  return {
    name: toDisplayName(head.trim()),
    subtitle: subtitle || template.badge,
  };
}

function buildCategoryOptions(): CategoryOption[] {
  const counts = new Map<string, number>();
  for (const template of TEMPLATES) {
    counts.set(template.category, (counts.get(template.category) ?? 0) + 1);
  }
  const sorted = Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return [{ name: ALL_CATEGORY, count: TEMPLATES.length }, ...sorted];
}

const CATEGORY_OPTIONS = buildCategoryOptions();
const CATEGORY_NAMES = new Set(CATEGORY_OPTIONS.map((option) => option.name));

function getInstallCommand(template: TemplateItem): string {
  return template.cliCommand || `npx nexoreui add ${template.slug}`;
}

function matchesQuery(template: TemplateItem, query: string): boolean {
  if (!query) return true;
  const haystack = [
    template.title,
    template.subtitle,
    template.description,
    template.category,
    template.cliCommand ?? "",
    ...template.tags,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function writeUrl(patch: Record<string, string | null>, mode: "push" | "replace") {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
  }
  const search = params.toString();
  const url = `${window.location.pathname}${search ? `?${search}` : ""}`;
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

function useClipboard() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopiedValue(null), COPY_RESET_MS);
    } catch {
      setCopiedValue(null);
    }
  }, []);

  return { copiedValue, copy };
}

interface CategoryBarProps {
  active: string;
  onSelect: (name: string) => void;
}

function CategoryBar({ active, onSelect }: CategoryBarProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="-mx-4 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {CATEGORY_OPTIONS.map((option) => {
        const isActive = option.name === active;
        return (
          <button
            key={option.name}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.name)}
            className={`relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors cursor-pointer select-none ${focusRing} ${
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="templates-category-indicator"
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.28, ease: EASE_OUT }}
                className="absolute inset-0 rounded-md border border-border bg-muted"
              />
            )}
            <span className="relative">{option.name}</span>
            <span className="relative font-mono text-[11px] tabular-nums text-muted-foreground">{option.count}</span>
          </button>
        );
      })}
    </div>
  );
}

interface TemplateCardProps {
  template: TemplateItem;
  featured: boolean;
  isCopied: boolean;
  onPreview: (template: TemplateItem) => void;
  onCode: (template: TemplateItem) => void;
  onCopy: (command: string) => void;
}

function TemplateCard({ template, featured, isCopied, onPreview, onCode, onCopy }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { name, subtitle } = splitTitle(template);
  const command = getInstallCommand(template);
  const titleId = `template-title-${template.id}`;

  return (
    <article aria-labelledby={titleId} className="flex min-w-0 flex-col gap-3">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-full overflow-hidden rounded-lg border border-border bg-muted transition-colors hover:border-foreground/25 ${
          featured ? "aspect-[16/10] lg:aspect-[16/9]" : "aspect-[16/10]"
        }`}
      >
        <TemplateCardMedia
          imageSrc={template.previewImage || getTemplatePreviewImage(template.slug)}
          templateId={template.id}
          isHovered={isHovered}
          eager={featured}
        />
        <button
          type="button"
          onClick={() => onPreview(template)}
          aria-label={`Open live preview of ${name}`}
          className={`absolute inset-0 z-10 cursor-pointer rounded-lg ${focusRing}`}
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            id={titleId}
            className={`truncate font-semibold tracking-[-0.015em] text-foreground ${
              featured ? "text-lg" : "text-[15px]"
            }`}
          >
            {name}
          </h2>
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <span className="shrink-0 pt-1 font-mono text-[11px] uppercase tracking-[0.04em] text-muted-foreground">
          {template.category}
        </span>
      </div>

      <div className="-ml-3 flex items-center gap-1">
        <button type="button" onClick={() => onPreview(template)} className={buttonGhost}>
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          Preview
        </button>
        <button type="button" onClick={() => onCode(template)} className={buttonGhost}>
          <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
          Code
        </button>
        <button
          type="button"
          onClick={() => onCopy(command)}
          title={command}
          aria-label={isCopied ? "Install command copied" : `Copy install command: ${command}`}
          className={`${buttonGhost} ml-auto font-mono text-[12px]`}
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span aria-live="polite">{isCopied ? "Copied" : "Copy CLI"}</span>
        </button>
      </div>
    </article>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Templates pagination" className="flex items-center justify-between gap-4 border-t border-border pt-6">
      <p className="font-mono text-[12px] tabular-nums text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={buttonGhost}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </button>
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onChange(page)}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Page ${page}`}
              className={`${buttonBase} w-8 px-0 font-mono tabular-nums ${
                isActive
                  ? "border border-border bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={buttonGhost}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

interface PreviewDialogProps {
  template: TemplateItem;
  onClose: () => void;
  onFullscreen: () => void;
  onCode: () => void;
}

function PreviewDialog({ template, onClose, onFullscreen, onCode }: PreviewDialogProps) {
  const { name, subtitle } = splitTitle(template);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-preview-title"
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background p-3 sm:p-6"
    >
      <div className="mx-auto mb-3 flex w-full max-w-7xl shrink-0 items-center justify-between gap-4 border-b border-border pb-3">
        <div className="min-w-0">
          <p id="template-preview-title" className="truncate text-sm font-semibold text-foreground sm:text-base">
            {name}
          </p>
          <p className="hidden truncate text-[13px] text-muted-foreground sm:block">{subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" onClick={onFullscreen} className={`${buttonOutline} hidden sm:inline-flex`}>
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            Fullscreen
          </button>
          <button type="button" onClick={onCode} className={buttonPrimary}>
            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            Export code
          </button>
          <button type="button" onClick={onClose} aria-label="Close preview" className={`${buttonGhost} w-8 px-0`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl flex-1 overflow-hidden">
        <TemplatePreviewWrapper showToolbar maxHeight="max-h-[85vh]" onOpenFullscreen={onFullscreen}>
          <RenderTemplatePreview templateId={template.id} />
        </TemplatePreviewWrapper>
      </div>
    </div>
  );
}

interface FullscreenViewProps {
  template: TemplateItem;
  isToolbarHidden: boolean;
  onHideToolbar: () => void;
  onExit: () => void;
  onCode: () => void;
}

function FullscreenView({ template, isToolbarHidden, onHideToolbar, onExit, onCode }: FullscreenViewProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${splitTitle(template).name} fullscreen preview`}
      className="fixed inset-0 z-[99999] flex h-screen w-screen flex-col overflow-hidden bg-background"
    >
      <AnimatePresence>
        {!isToolbarHidden && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="fixed right-4 top-4 z-[99999] flex items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-md"
          >
            <button type="button" onClick={onCode} className={buttonGhost}>
              <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Export code</span>
            </button>
            <button type="button" onClick={onHideToolbar} title="Hide toolbar (H)" className={buttonGhost}>
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Hide</span>
              <kbd className="hidden font-mono text-[11px] text-muted-foreground sm:inline">H</kbd>
            </button>
            <button type="button" onClick={onExit} className={buttonOutline}>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Exit
              <kbd className="font-mono text-[11px] text-muted-foreground">Esc</kbd>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-full w-full flex-1 overflow-y-auto overflow-x-hidden">
        <RenderTemplatePreview templateId={template.id} />
      </div>
    </div>
  );
}

function TemplatesPageContent() {
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const { config } = useTemplateCustomizer();
  const { copiedValue, copy } = useClipboard();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const catalogRef = useRef<HTMLElement>(null);

  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("category") ?? ALL_CATEGORY;
  const activeCategory = CATEGORY_NAMES.has(urlCategory) ? urlCategory : ALL_CATEGORY;
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const initialSlug = searchParams.get("template");
  const initialMode = searchParams.get("mode");

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [codeTemplate, setCodeTemplate] = useState<TemplateItem | null>(null);
  const [isFullscreenView, setIsFullscreenView] = useState(false);
  const [isToolbarHidden, setIsToolbarHidden] = useState(false);

  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (!initialSlug) return;
    const match = TEMPLATES.find((template) => template.slug === initialSlug || template.id === initialSlug);
    if (!match) return;
    if (initialMode === "code") setCodeTemplate(match);
    else setPreviewTemplate(match);
  }, [initialSlug, initialMode]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const hasActiveFilters = normalizedQuery !== "" || activeCategory !== ALL_CATEGORY;

  const filteredTemplates = useMemo(
    () =>
      TEMPLATES.filter(
        (template) =>
          (activeCategory === ALL_CATEGORY || template.category === activeCategory) &&
          matchesQuery(template, normalizedQuery),
      ),
    [activeCategory, normalizedQuery],
  );

  const featuredTemplates = hasActiveFilters ? [] : filteredTemplates.slice(0, FEATURED_COUNT);
  const gridTemplates = hasActiveFilters ? filteredTemplates : filteredTemplates.slice(FEATURED_COUNT);
  const totalPages = Math.max(1, Math.ceil(gridTemplates.length / ITEMS_PER_PAGE));
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1;
  const pageTemplates = gridTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const showFeatured = featuredTemplates.length > 0 && currentPage === 1;

  const closeCode = useCallback(() => setCodeTemplate(null), []);

  const exitFullscreen = useCallback(() => {
    setIsFullscreenView(false);
    setIsToolbarHidden(false);
  }, []);

  const openCode = useCallback(
    (template: TemplateItem) => {
      exitFullscreen();
      setCodeTemplate(template);
    },
    [exitFullscreen],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isTyping = activeTag === "input" || activeTag === "textarea";

      if (event.key === "/" && !isTyping && !previewTemplate && !codeTemplate) {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (event.key === "Escape") {
        if (codeTemplate) setCodeTemplate(null);
        else if (isFullscreenView) exitFullscreen();
        else if (previewTemplate) setPreviewTemplate(null);
        return;
      }

      if (event.key.toLowerCase() === "h" && isFullscreenView && !isTyping) {
        event.preventDefault();
        setIsToolbarHidden((hidden) => !hidden);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [codeTemplate, isFullscreenView, previewTemplate, exitFullscreen]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    writeUrl({ q: value.trim() || null, page: null }, "replace");
  };

  const handleCategorySelect = (name: string) => {
    writeUrl({ category: name === ALL_CATEGORY ? null : name, page: null }, "push");
  };

  const handlePageChange = (page: number) => {
    writeUrl({ page: page === 1 ? null : String(page) }, "push");
    scrollToCatalog();
  };

  const clearFilters = () => {
    setSearchQuery("");
    writeUrl({ q: null, category: null, page: null }, "push");
    searchInputRef.current?.focus();
  };

  const gridKey = `${activeCategory}-${currentPage}`;
  const cardProps = {
    onPreview: setPreviewTemplate,
    onCode: openCode,
    onCopy: copy,
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background px-4 pb-24 pt-10 text-foreground sm:px-6 sm:pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-3 pb-10">
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-balance">
            Templates
          </h1>
          <p className="max-w-[54ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            Full-source Next.js starters. Open a live preview, read the code, or install one with a single CLI command.
          </p>
          <p className="font-mono text-[12px] uppercase tracking-[0.04em] text-muted-foreground tabular-nums">
            {TEMPLATES.length} templates · Next.js 15 · Tailwind v4
          </p>
        </header>

        <div className="flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-start lg:gap-4">
          <div className="relative w-full shrink-0 lg:mt-0.5 lg:w-64">
            <label htmlFor="templates-search" className="sr-only">
              Search templates
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="templates-search"
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape" && searchQuery) {
                  event.stopPropagation();
                  handleSearchChange("");
                }
              }}
              placeholder="Search templates"
              autoComplete="off"
              className={`h-9 w-full rounded-md border border-border bg-background pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground transition-colors [&::-webkit-search-cancel-button]:hidden ${focusRing}`}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                aria-label="Clear search"
                className={`absolute right-1.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer ${focusRing}`}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 font-mono text-[11px] text-muted-foreground sm:inline-block">
                /
              </kbd>
            )}
          </div>

          <CategoryBar active={activeCategory} onSelect={handleCategorySelect} />
        </div>

        {hasActiveFilters && (
          <div className="flex h-12 items-center justify-between gap-4">
            <p aria-live="polite" className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {filteredTemplates.length} of {TEMPLATES.length} templates
            </p>
            <button type="button" onClick={clearFilters} className={`${buttonGhost} -mr-3`}>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear filters
            </button>
          </div>
        )}

        <section
          ref={catalogRef}
          aria-label="Templates catalog"
          className={`scroll-mt-24 space-y-12 ${hasActiveFilters ? "pt-4" : "pt-10"}`}
        >
          <motion.div
            key={gridKey}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="space-y-12"
          >
            {showFeatured && (
              <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
                {featuredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    featured
                    isCopied={copiedValue === getInstallCommand(template)}
                    {...cardProps}
                  />
                ))}
              </div>
            )}

            {pageTemplates.length > 0 && (
              <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {pageTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    featured={false}
                    isCopied={copiedValue === getInstallCommand(template)}
                    {...cardProps}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border px-6 py-12 sm:items-center sm:text-center">
              <p className="text-base font-semibold text-foreground">No templates match these filters</p>
              <p className="max-w-[48ch] text-sm text-muted-foreground">
                Nothing in {activeCategory === ALL_CATEGORY ? "the catalog" : activeCategory} matches
                {normalizedQuery ? ` "${searchQuery.trim()}"` : " this filter"}. Clear the filters to see all{" "}
                {TEMPLATES.length} templates.
              </p>
              <button type="button" onClick={clearFilters} className={buttonOutline}>
                Clear filters
              </button>
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={handlePageChange} />
        </section>
      </div>

      {previewTemplate && !isFullscreenView && (
        <PreviewDialog
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onFullscreen={() => setIsFullscreenView(true)}
          onCode={() => openCode(previewTemplate)}
        />
      )}

      {previewTemplate && isFullscreenView && (
        <FullscreenView
          template={previewTemplate}
          isToolbarHidden={isToolbarHidden}
          onHideToolbar={() => setIsToolbarHidden(true)}
          onExit={exitFullscreen}
          onCode={() => openCode(previewTemplate)}
        />
      )}

      {codeTemplate && (
        <TemplateCodeExportModal template={codeTemplate} config={config} isOpen onClose={closeCode} />
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
