"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search,
  Copy,
  Check,
  ArrowRight,
  X,
  Terminal,
  Layers,
} from "lucide-react";
import { copyToClipboard } from "../../utils/clipboard";
import { ComponentThumbnail } from "../catalog/ComponentThumbnails";
import {
  sidebarGroups,
  getCliSlugForSection,
} from "../../config/navigation";

export interface ComponentCardInfo {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  desc: string;
  cliSlug: string;
  cliCommand: string;
}

const RAW_COMPONENTS_DATA: Omit<ComponentCardInfo, "cliSlug" | "cliCommand">[] = [
  // Core & Inputs (11)
  { id: "button", name: "Button", category: "Core & Inputs", categoryId: "core", desc: "Action buttons with multiple variants, sizes, loading spinners, and tactile motion." },
  { id: "pro-buttons", name: "Action Buttons", category: "Core & Inputs", categoryId: "core", desc: "Split dropdowns, segmented toggles, copy triggers, confirmation, and status buttons." },
  { id: "input", name: "Input", category: "Core & Inputs", categoryId: "core", desc: "Text fields with labels, leading icons, password visibility, and validation states." },
  { id: "pro-inputs", name: "Specialized Inputs", category: "Core & Inputs", categoryId: "core", desc: "OTP code boxes with paste support, tag editors, currency fields, and color pickers." },
  { id: "special-forms", name: "Form Controls", category: "Core & Inputs", categoryId: "core", desc: "Selectable card radios, numeric steppers, password strength meters, and file dropzones." },
  { id: "checkbox", name: "Checkbox", category: "Core & Inputs", categoryId: "core", desc: "Accessible check control with animated tick icon and indeterminate state." },
  { id: "select", name: "Select", category: "Core & Inputs", categoryId: "core", desc: "Custom dropdown select with grouped options and full keyboard navigation." },
  { id: "switch", name: "Switch", category: "Core & Inputs", categoryId: "core", desc: "Sliding toggle switch for binary settings with keyboard focus support." },
  { id: "slider", name: "Slider", category: "Core & Inputs", categoryId: "core", desc: "Range controller with single or dual thumbs, step ticks, and value tooltips." },
  { id: "rating", name: "Rating", category: "Core & Inputs", categoryId: "core", desc: "Interactive star rating control with hover preview and fractional display." },
  { id: "file-upload", name: "File Upload", category: "Core & Inputs", categoryId: "core", desc: "Drag-and-drop uploader with file size limits, previews, and removal controls." },

  // Layout & Display (12)
  { id: "card", name: "Card", category: "Layout & Display", categoryId: "layout", desc: "Structured container with header/footer slots, spotlight tracking, and 3D flip mode." },
  { id: "accordion", name: "Accordion", category: "Layout & Display", categoryId: "layout", desc: "Collapsible disclosure panels with smooth height transitions and ARIA attributes." },
  { id: "tabs", name: "Tabs", category: "Layout & Display", categoryId: "layout", desc: "Tabbed navigation bar with shared-layout active indicator and keyboard switching." },
  { id: "table", name: "Table", category: "Layout & Display", categoryId: "layout", desc: "Responsive data table with sorting, density controls, and row highlighting." },
  { id: "stepper", name: "Stepper", category: "Layout & Display", categoryId: "layout", desc: "Multi-step flow indicator with active, completed, and error states." },
  { id: "scroll-area", name: "Scroll Area", category: "Layout & Display", categoryId: "layout", desc: "Scrollable viewport with custom-styled scrollbars across operating systems." },
  { id: "navigation", name: "Navigation", category: "Layout & Display", categoryId: "layout", desc: "Breadcrumb trails, pagination controls, and step navigation bars." },
  { id: "dock", name: "Dock", category: "Layout & Display", categoryId: "layout", desc: "Cursor-magnified floating toolbar with distance-based icon scaling." },
  { id: "data-display", name: "Data Display", category: "Layout & Display", categoryId: "layout", desc: "Stat cards, timelines, keyboard shortcuts, avatar stacks, pricing cards, and dividers." },
  { id: "charts", name: "Charts", category: "Layout & Display", categoryId: "layout", desc: "SVG donut, bar, area, funnel, heatmap, and KPI widgets using semantic chart tokens." },
  { id: "commerce", name: "Commerce", category: "Layout & Display", categoryId: "layout", desc: "Product cards, cart drawers, checkout summaries, coupon inputs, and stock badges." },
  { id: "premium-media", name: "Media & Audio", category: "Layout & Display", categoryId: "layout", desc: "Audio waveform bars, media players, file attachment cards, and image galleries." },

  // Feedback & Overlays (12)
  { id: "modal", name: "Dialog (Modal)", category: "Feedback & Overlays", categoryId: "feedback", desc: "Radix-powered accessible modal dialog with focus trapping and keyboard dismissal." },
  { id: "premium-overlays", name: "Overlays & Drawers", category: "Feedback & Overlays", categoryId: "feedback", desc: "Slide-over sheets, bottom action drawers, and contextual popover surfaces." },
  { id: "alert", name: "Alert", category: "Feedback & Overlays", categoryId: "feedback", desc: "Status callout banners for informational, warning, success, and error messages." },
  { id: "badge", name: "Badge", category: "Feedback & Overlays", categoryId: "feedback", desc: "Compact label and status tag in solid, outline, subtle, and semantic variants." },
  { id: "avatar", name: "Avatar", category: "Feedback & Overlays", categoryId: "feedback", desc: "User profile image with fallback initials, presence indicator, and group stacking." },
  { id: "tooltip", name: "Tooltip", category: "Feedback & Overlays", categoryId: "feedback", desc: "Contextual hover and focus popover with directional positioning." },
  { id: "progress", name: "Progress", category: "Feedback & Overlays", categoryId: "feedback", desc: "Linear and circular progress indicators for determinate and loading workflows." },
  { id: "skeleton", name: "Skeleton", category: "Feedback & Overlays", categoryId: "feedback", desc: "Placeholder loading blocks for text lines, avatars, cards, and tables." },
  { id: "loaders", name: "Loaders", category: "Feedback & Overlays", categoryId: "feedback", desc: "Spinners, dot waves, bars, and ring loaders with reduced-motion support." },
  { id: "toaster", name: "Toaster", category: "Feedback & Overlays", categoryId: "feedback", desc: "Stackable toast notifications with auto-dismiss, actions, and swipe-to-close." },
  { id: "social", name: "Social & Chat", category: "Feedback & Overlays", categoryId: "feedback", desc: "Comment threads, chat bubbles, typing indicators, share sheets, and profile cards." },
  { id: "dark-mode", name: "Theme Toggle", category: "Feedback & Overlays", categoryId: "feedback", desc: "Light, dark, and system theme switcher with localStorage and matchMedia sync." },

  // AI & Code (5)
  { id: "aurora-border-card", name: "Aurora Border Card", category: "AI & Code", categoryId: "ai", desc: "Card with an animated SVG perimeter stroke in flow, wave, and pulse modes." },
  { id: "aurora-search-pill", name: "Aurora Search Pill", category: "AI & Code", categoryId: "ai", desc: "Expandable search pill with rotating conic border track and quick filter chips." },
  { id: "ai-prompt-input", name: "AI Prompt Input", category: "AI & Code", categoryId: "ai", desc: "Prompt composer with model picker, attachment hooks, and voice toggle state." },
  { id: "command", name: "Command Palette", category: "AI & Code", categoryId: "ai", desc: "Keyboard-first command menu with fuzzy filtering, groups, and Cmd+K shortcut." },
  { id: "interactive-code-block", name: "Code Block", category: "AI & Code", categoryId: "ai", desc: "Syntax-formatted snippet viewer with line numbers, themes, and 1-click copy." },

  // Motion & Effects (9)
  { id: "aurora-border-fx", name: "Aurora Border FX", category: "Motion & Effects", categoryId: "animated", desc: "Reactive border card with selectable color presets and smooth hover illumination." },
  { id: "morphing-geometry", name: "Morphing Geometry", category: "Motion & Effects", categoryId: "animated", desc: "Interactive shape container with corner radius morphing and rotation controls." },
  { id: "marquee", name: "Marquee", category: "Motion & Effects", categoryId: "animated", desc: "Infinite horizontal or vertical strip scroller with pause-on-hover support." },
  { id: "number-ticker", name: "Number Ticker", category: "Motion & Effects", categoryId: "animated", desc: "Viewport-triggered numeric counter with tabular alignment and custom precision." },
  { id: "blur-fade", name: "Blur Fade", category: "Motion & Effects", categoryId: "animated", desc: "Staggered entrance wrapper combining opacity, translation, and subtle blur." },
  { id: "premium-effects", name: "Spotlight & Grid", category: "Motion & Effects", categoryId: "animated", desc: "Cursor-tracking spotlight cards, animated grid backgrounds, and shimmer dividers." },
  { id: "ultra-effects", name: "Text & Motion", category: "Motion & Effects", categoryId: "animated", desc: "Text shimmer, box reveal, morphing words, interactive hover buttons, and animated lists." },
  { id: "ultra-components", name: "Atmospheric Effects", category: "Motion & Effects", categoryId: "animated", desc: "Gradient border frames, retro perspective grids, meteors, and shiny text." },
  { id: "special-animations", name: "Motion Primitives", category: "Motion & Effects", categoryId: "animated", desc: "Magnetic hover targets, directional clip wipes, and staggered reveal helpers." },

  // 3D & Physics (5)
  { id: "pro-cards", name: "3D Product Cards", category: "3D & Physics", categoryId: "physics", desc: "Interactive product cards: HoloFinish, ParticleReveal, GlassShatter, and FrostHover." },
  { id: "pro-objects", name: "Live 3D Object", category: "3D & Physics", categoryId: "physics", desc: "Interactive 3D product stage with pointer tilt, gyroscope support, and specular sheen." },
  { id: "sound-pulse", name: "SoundPulse", category: "3D & Physics", categoryId: "physics", desc: "Web Audio API step-sequencer visualizer with 56 radial frequency bars." },
  { id: "silk-unveil", name: "SilkUnveil", category: "3D & Physics", categoryId: "physics", desc: "Verlet cloth physics curtain with pointer ripple and pull-to-reveal mechanics." },
  { id: "node-flow-graph", name: "Node Flow Graph", category: "3D & Physics", categoryId: "physics", desc: "Draggable pipeline node editor with cubic Bezier cables and live packet flow." },

  // WebGL Shaders (9)
  { id: "glass-lens", name: "Glass Lens", category: "WebGL Shaders", categoryId: "webgl", desc: "Refractive lens shader with chromatic dispersion and damped pointer lag." },
  { id: "fluted-glass", name: "Fluted Glass", category: "WebGL Shaders", categoryId: "webgl", desc: "Reeded architectural glass shader with periodic rib curvature and specular highlights." },
  { id: "ripple-water", name: "Ripple Water", category: "WebGL Shaders", categoryId: "webgl", desc: "Interactive surface wave simulation driven by a 16-slot pointer ring buffer." },
  { id: "scroll-warp", name: "Scroll Warp", category: "WebGL Shaders", categoryId: "webgl", desc: "Scroll-velocity surface distortion with non-linear pinch and subtle RGB split." },
  { id: "twist-ribbon", name: "Twist Ribbon", category: "WebGL Shaders", categoryId: "webgl", desc: "3D helical ribbon mesh reacting to scroll momentum with dynamic surface normals." },
  { id: "dither-image", name: "Dither Image", category: "WebGL Shaders", categoryId: "webgl", desc: "Ordered 8x8 Bayer matrix dithering shader with palette quantization and reveal lens." },
  { id: "gravity-grid", name: "Gravity Grid", category: "WebGL Shaders", categoryId: "webgl", desc: "Coordinate mesh deforming around inertial pointer mass and wave propagation." },
  { id: "scroll-drum", name: "Scroll Drum", category: "WebGL Shaders", categoryId: "webgl", desc: "Cylindrical 3D typography drum driven by wheel and scroll momentum." },
  { id: "liquid-smear", name: "Liquid Smear", category: "WebGL Shaders", categoryId: "webgl", desc: "Ping-pong FBO viscous velocity buffer with elastic relaxation memory." },

  // Interactive Canvas (9)
  { id: "type-proximity", name: "Type Proximity", category: "Interactive Canvas", categoryId: "canvas", desc: "Pointer-reactive letter grid modulating variable font weight and width by distance." },
  { id: "holo-foil", name: "Holo Foil", category: "Interactive Canvas", categoryId: "canvas", desc: "Multi-layer iridescent foil card with pointer glare and optional gyroscope tilt." },
  { id: "letter-pile", name: "Letter Pile", category: "Interactive Canvas", categoryId: "canvas", desc: "2D rigid-body circle collision simulation of letter disks with pointer push." },
  { id: "flow-field", name: "Flow Field", category: "Interactive Canvas", categoryId: "canvas", desc: "Curl-noise trigonometric vector field steering tracer particles with FPS throttling." },
  { id: "text-rail", name: "Text Rail", category: "Interactive Canvas", categoryId: "canvas", desc: "Kinetic text path running along a 9-point Catmull-Rom Bezier spline." },
  { id: "moire-grating", name: "Moiré Grating", category: "Interactive Canvas", categoryId: "canvas", desc: "Optical interference canvas combining two periodic micro-gratings with drift." },
  { id: "swipe-deck", name: "Swipe Deck", category: "Interactive Canvas", categoryId: "canvas", desc: "Gesture-driven card stack with spring return, fling dismissal, and cyclic order." },
  { id: "camera-mirror", name: "Camera Mirror", category: "Interactive Canvas", categoryId: "canvas", desc: "Webcam or procedural raster canvas projecting luminance into halftone or ASCII cells." },
  { id: "scroll-reveal", name: "Scroll Reveal", category: "Interactive Canvas", categoryId: "canvas", desc: "Viewport scroll transitions using native CSS animation-timeline view()." },
];

export const ALL_COMPONENTS_DATA: ComponentCardInfo[] = RAW_COMPONENTS_DATA.map((item) => {
  const cliSlug = getCliSlugForSection(item.id);
  return {
    ...item,
    cliSlug,
    cliCommand: `npx nexoreui add ${cliSlug}`,
  };
});

export const TOTAL_COMPONENTS_COUNT = ALL_COMPONENTS_DATA.length;

export function ComponentsOverviewSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedBulkIds, setSelectedBulkIds] = useState<Set<string>>(new Set());
  const [bulkCopied, setBulkCopied] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    window.history.replaceState(null, "", targetUrl);
  }, [selectedCategory, searchQuery, pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      const isInputActive = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

      if (e.key === "/" && !isInputActive) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === "Escape" && isInputActive) {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopySingle = async (e: React.MouseEvent, command: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await copyToClipboard(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleBulkSelect = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBulkIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkCommand = useMemo(() => {
    const slugs = Array.from(selectedBulkIds).map((id) => getCliSlugForSection(id));
    return `npx nexoreui add ${slugs.join(" ")}`;
  }, [selectedBulkIds]);

  const handleCopyBulk = async () => {
    if (selectedBulkIds.size === 0) return;
    await copyToClipboard(bulkCommand);
    setBulkCopied(true);
    setTimeout(() => setBulkCopied(false), 2000);
  };

  const clearBulkSelection = () => {
    setSelectedBulkIds(new Set());
  };

  const categoryTabs = useMemo(() => {
    return [
      { id: "all", label: "All Components", count: ALL_COMPONENTS_DATA.length },
      ...sidebarGroups.map((group) => ({
        id: group.id,
        label: group.title,
        count: ALL_COMPONENTS_DATA.filter((c) => c.categoryId === group.id).length,
      })),
    ];
  }, []);

  const filteredComponents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ALL_COMPONENTS_DATA.filter((comp) => {
      const matchesCategory =
        selectedCategory === "all" || comp.categoryId === selectedCategory;
      const matchesQuery =
        !q ||
        comp.name.toLowerCase().includes(q) ||
        comp.desc.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q) ||
        comp.id.toLowerCase().includes(q) ||
        comp.cliSlug.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section className="space-y-6 pb-24">
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${ALL_COMPONENTS_DATA.length} free components by name, slug, or keyword...`}
              aria-label="Search components"
              className="w-full h-10 pl-10 pr-16 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="pointer-events-auto p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded">
                  /
                </kbd>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 px-3.5 h-10 rounded-lg border border-border bg-card text-xs shrink-0">
            <span className="font-mono text-muted-foreground tabular-nums">
              {ALL_COMPONENTS_DATA.length} free · MIT
            </span>
            <span className="h-3.5 w-px bg-border" aria-hidden="true" />
            <Link
              href="/templates"
              className="inline-flex items-center gap-1 font-medium text-foreground hover:underline underline-offset-4"
            >
              <span>Templates</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categoryTabs.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isSelected
                    ? "bg-foreground text-background border-foreground font-semibold"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono tabular-nums ${isSelected ? "text-background/80" : "text-muted-foreground/70"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredComponents.length > 0 ? (
            filteredComponents.map((comp) => {
              const isCopied = copiedId === comp.id;
              const isSelected = selectedBulkIds.has(comp.id);

              return (
                <motion.div
                  key={comp.id}
                  layout={!prefersReducedMotion}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                  className={`group relative flex flex-col justify-between h-full p-4 rounded-xl border bg-card transition-colors ${
                    isSelected
                      ? "border-foreground/60 ring-1 ring-foreground/20"
                      : "border-border hover:border-foreground/30 hover:bg-card/90"
                  }`}
                >
                  <div className="mb-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleBulkSelect(e, comp.id)}
                          aria-label={`Select ${comp.name} for bulk install`}
                          aria-pressed={isSelected}
                          className={`relative z-10 w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            isSelected
                              ? "bg-foreground border-foreground text-background"
                              : "border-border hover:border-foreground/50 bg-background"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                          {comp.category}
                        </span>
                      </div>
                    </div>

                    <ComponentThumbnail id={comp.id} category={comp.category} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground tracking-tight mb-1">
                      <Link
                        href={`/docs/components/${comp.id}`}
                        className="focus:outline-none focus-visible:underline"
                      >
                        <span className="absolute inset-0 z-0" aria-hidden="true" />
                        {comp.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {comp.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={(e) => handleCopySingle(e, comp.cliCommand, comp.id)}
                      className="relative z-10 inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-muted/40 hover:bg-muted text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      title={comp.cliCommand}
                      aria-label={`Copy ${comp.cliCommand}`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-success" />
                          <span className="text-success font-sans">Copied</span>
                        </>
                      ) : (
                        <>
                          <Terminal className="h-3 w-3 opacity-60" />
                          <span>add {comp.cliSlug}</span>
                        </>
                      )}
                    </button>

                    <div className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all">
                      <span>Docs</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center border border-dashed border-border rounded-xl bg-card/30">
              <Layers className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No components found</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
                No components match &quot;{searchQuery}&quot; in this category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Reset filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedBulkIds.size > 0 && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-xl p-3 rounded-xl border border-border bg-card shadow-md flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2 py-0.5 rounded-md bg-foreground text-background font-mono text-[11px] font-semibold tabular-nums">
                {selectedBulkIds.size}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {selectedBulkIds.size === 1 ? "1 component selected" : `${selectedBulkIds.size} components selected`}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground truncate max-w-xs">
                  {bulkCommand}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={clearBulkSelection}
                className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleCopyBulk}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
              >
                {bulkCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
