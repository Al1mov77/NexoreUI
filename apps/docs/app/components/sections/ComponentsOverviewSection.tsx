"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

export interface ComponentCardInfo {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  desc: string;
  badge?: "Pro" | "New" | string;
  isNew?: boolean;
  cliCommand: string;
  tier: "free" | "pro";
}

export const ALL_COMPONENTS_DATA: ComponentCardInfo[] = [
  // Core & Inputs (8)
  { id: "button", name: "Button", category: "Core & Inputs", categoryId: "core", desc: "Interactive button with ripple effects, loading states, and custom variants.", cliCommand: "npx nexoreui add button", tier: "free" },
  { id: "input", name: "Input", category: "Core & Inputs", categoryId: "core", desc: "Text inputs with animated labels, icons, error states, and clear triggers.", cliCommand: "npx nexoreui add input", tier: "free" },
  { id: "checkbox", name: "Checkbox", category: "Core & Inputs", categoryId: "core", desc: "Accessible check control with animated tick icon and indeterminate state.", isNew: true, cliCommand: "npx nexoreui add checkbox", tier: "free" },
  { id: "select", name: "Select", category: "Core & Inputs", categoryId: "core", desc: "Custom dropdown select with animated transitions, search, and keyboard control.", isNew: true, cliCommand: "npx nexoreui add select", tier: "free" },
  { id: "switch", name: "Switch", category: "Core & Inputs", categoryId: "core", desc: "Smooth sliding toggle switch with spring physics and accessible state.", cliCommand: "npx nexoreui add switch", tier: "free" },
  { id: "slider", name: "Slider", category: "Core & Inputs", categoryId: "core", desc: "Fluid range controller with dual thumbs, tooltip values, and stepped values.", cliCommand: "npx nexoreui add slider", tier: "free" },
  { id: "rating", name: "Rating", category: "Core & Inputs", categoryId: "core", desc: "Interactive star rating with fractional stars, hover animations, and presets.", cliCommand: "npx nexoreui add rating", tier: "free" },
  { id: "file-upload", name: "File Upload", category: "Core & Inputs", categoryId: "core", desc: "Drag-and-drop file uploader with size validation, progress, and preview.", cliCommand: "npx nexoreui add file-upload", tier: "free" },

  // Layout & Display (9)
  { id: "card", name: "Card", category: "Layout & Display", categoryId: "layout", desc: "Modular container with border glow, glassmorphism, and header/footer slots.", cliCommand: "npx nexoreui add card", tier: "free" },
  { id: "accordion", name: "Accordion", category: "Layout & Display", categoryId: "layout", desc: "Collapsible disclosure panels with smooth height transitions and icons.", cliCommand: "npx nexoreui add accordion", tier: "free" },
  { id: "tabs", name: "Tabs", category: "Layout & Display", categoryId: "layout", desc: "Tabbed content navigation with animated active pill and keyboard navigation.", cliCommand: "npx nexoreui add tabs", tier: "free" },
  { id: "table", name: "Table", category: "Layout & Display", categoryId: "layout", desc: "High performance data table with sorting, pagination, and selection.", cliCommand: "npx nexoreui add table", tier: "free" },
  { id: "stepper", name: "Stepper", category: "Layout & Display", categoryId: "layout", desc: "Multi-step flow indicator with completed states, errors, and animations.", cliCommand: "npx nexoreui add stepper", tier: "free" },
  { id: "scroll-area", name: "Scroll Area", category: "Layout & Display", categoryId: "layout", desc: "Customized scrollable container with styled native and smooth scrollbars.", cliCommand: "npx nexoreui add scroll-area", tier: "free" },
  { id: "navigation", name: "Navigation", category: "Layout & Display", categoryId: "layout", desc: "Responsive navbar header and breadcrumb trail for modern apps.", cliCommand: "npx nexoreui add navigation", tier: "free" },
  { id: "dock", name: "Dock", category: "Layout & Display", categoryId: "layout", desc: "macOS-inspired magnify-on-hover dock menu with physics calculations.", cliCommand: "npx nexoreui add dock", tier: "free" },
  { id: "data-display", name: "Data Display", category: "Layout & Display", categoryId: "layout", desc: "Structured key-value grids, stats blocks, and summary list cards.", cliCommand: "npx nexoreui add data-display", tier: "free" },

  // Feedback & Overlays (9 — dialog merged with modal)
  { id: "modal", name: "Modal (Dialog)", category: "Feedback & Overlays", categoryId: "feedback", desc: "Accessible modal and dialog overlay with focus trapping, backdrop blur, and drawer modes.", cliCommand: "npx nexoreui add modal", tier: "free" },
  { id: "alert", name: "Alert", category: "Feedback & Overlays", categoryId: "feedback", desc: "Callout banner for status notifications, warnings, errors, and tips.", cliCommand: "npx nexoreui add alert", tier: "free" },
  { id: "badge", name: "Badge", category: "Feedback & Overlays", categoryId: "feedback", desc: "Compact indicator tag with pulse radar, variant styles, and count badges.", cliCommand: "npx nexoreui add badge", tier: "free" },
  { id: "avatar", name: "Avatar", category: "Feedback & Overlays", categoryId: "feedback", desc: "User picture with fallback initials, status dots, and stacked group rings.", cliCommand: "npx nexoreui add avatar", tier: "free" },
  { id: "tooltip", name: "Tooltip", category: "Feedback & Overlays", categoryId: "feedback", desc: "Instant contextual helper tooltip with micro-animations and arrow pointers.", cliCommand: "npx nexoreui add tooltip", tier: "free" },
  { id: "progress", name: "Progress", category: "Feedback & Overlays", categoryId: "feedback", desc: "Linear and circular progress meters with indeterminate and stepped states.", cliCommand: "npx nexoreui add progress", tier: "free" },
  { id: "skeleton", name: "Skeleton", category: "Feedback & Overlays", categoryId: "feedback", desc: "Fluid shimmer loading placeholder for images, text blocks, and avatars.", cliCommand: "npx nexoreui add skeleton", tier: "free" },
  { id: "loaders", name: "Loaders", category: "Feedback & Overlays", categoryId: "feedback", desc: "Collection of spinners, orbital rings, and pulse wave loading indicators.", cliCommand: "npx nexoreui add loaders", tier: "free" },
  { id: "toaster", name: "Toaster", category: "Feedback & Overlays", categoryId: "feedback", desc: "Toast notifications with stacked animations, swipe dismiss, and sound hints.", isNew: true, cliCommand: "npx nexoreui add toaster", tier: "free" },

  // AI & Agentic (6)
  { id: "aurora-border-card", name: "Aurora Border Card", category: "AI & Agentic", categoryId: "ai", desc: "Modern card with a continuously moving, smoothly flowing gradient border.", isNew: true, cliCommand: "npx nexoreui add aurora-border-card", tier: "free" },
  { id: "aurora-search-pill", name: "Aurora Search Pill", category: "AI & Agentic", categoryId: "ai", desc: "Floating interactive search pill with animated aurora conic light beam and tag filters.", isNew: true, cliCommand: "npx nexoreui add aurora-search-pill", tier: "free" },
  { id: "ai-prompt-input", name: "AI Prompt Input", category: "AI & Agentic", categoryId: "ai", desc: "Conversational AI prompt bar with model selection and voice pulse.", isNew: true, cliCommand: "npx nexoreui add ai-prompt-input", tier: "free" },
  { id: "command", name: "Command", category: "AI & Agentic", categoryId: "ai", desc: "Fast command palette with fuzzy search, keyboard shortcuts, and groups.", cliCommand: "npx nexoreui add command", tier: "free" },
  { id: "interactive-code-block", name: "Interactive Code Block", category: "AI & Agentic", categoryId: "ai", desc: "macOS-inspired code presentation card with instant 1-click copy feedback.", isNew: true, cliCommand: "npx nexoreui add interactive-code-block", tier: "free" },
  { id: "pro-ai", name: "Pro AI", category: "AI & Agentic", categoryId: "ai", desc: "Full-stack AI chat interfaces, model comparison cards, and token telemetries.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-ai", tier: "pro" },

  // Animated & Effects (8)
  { id: "aurora-border-fx", name: "Aurora Border FX", category: "Animated & Effects", categoryId: "animated", desc: "Interactive Aurora glow card with live color switcher, dynamic blur, and reactive borders.", isNew: true, cliCommand: "npx nexoreui add aurora-border-fx", tier: "free" },
  { id: "morphing-geometry", name: "Morphing Geometry", category: "Animated & Effects", categoryId: "animated", desc: "Interactive geometric entity with fluid corner transitions and continuous rotation.", isNew: true, cliCommand: "npx nexoreui add morphing-geometry", tier: "free" },
  { id: "marquee", name: "Marquee", category: "Animated & Effects", categoryId: "animated", desc: "Infinite horizontal and vertical content scroller with pause-on-hover.", cliCommand: "npx nexoreui add marquee", tier: "free" },
  { id: "number-ticker", name: "Number Ticker", category: "Animated & Effects", categoryId: "animated", desc: "Scroll-triggered rolling counter for statistics and metrics.", cliCommand: "npx nexoreui add number-ticker", tier: "free" },
  { id: "blur-fade", name: "Blur Fade", category: "Animated & Effects", categoryId: "animated", desc: "Staggered blur-in and fade-in entrance wrapper for content grids.", cliCommand: "npx nexoreui add blur-fade", tier: "free" },
  { id: "premium-effects", name: "Premium Effects", category: "Animated & Effects", categoryId: "animated", desc: "Glow halos, meteor animations, and glassmorphic surface presets.", cliCommand: "npx nexoreui add premium-effects", tier: "free" },
  { id: "ultra-effects", name: "Ultra Effects", category: "Animated & Effects", categoryId: "animated", desc: "Hyperspeed particle trails, neon borders, and cinematic light effects.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add ultra-effects", tier: "pro" },
  { id: "special-animations", name: "Special Animations", category: "Animated & Effects", categoryId: "animated", desc: "Magnetic physics buttons, wave glows, and fluid micro-interactions.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add special-animations", tier: "pro" },

  // Pro Suites (17)
  { id: "charts", name: "Charts", category: "Pro Suites", categoryId: "pro", desc: "Interactive SVG area, line, and bar charts tailored for dark mode.", badge: "Pro", cliCommand: "npx nexoreui add charts", tier: "pro" },
  { id: "commerce", name: "Commerce", category: "Pro Suites", categoryId: "pro", desc: "E-commerce checkout cards, pricing tables, and product visualizers.", badge: "Pro", cliCommand: "npx nexoreui add commerce", tier: "pro" },
  { id: "dark-mode", name: "Dark Mode Toolkit", category: "Pro Suites", categoryId: "pro", desc: "Theme switches, auto-detect hooks, and system color sync tools.", badge: "Pro", cliCommand: "npx nexoreui add dark-mode", tier: "pro" },
  { id: "social", name: "Social", category: "Pro Suites", categoryId: "pro", desc: "Social comment thread blocks, share dialogs, and user cards.", badge: "Pro", cliCommand: "npx nexoreui add social", tier: "pro" },
  { id: "premium-media", name: "Media Showcase", category: "Pro Suites", categoryId: "pro", desc: "Audio visualizers, responsive video players, and gallery carousels.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add premium-media", tier: "pro" },
  { id: "premium-overlays", name: "Overlays & Drawers", category: "Pro Suites", categoryId: "pro", desc: "Slide-over sheets, floating popovers, and bottom sheet drawers.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add premium-overlays", tier: "pro" },
  { id: "pro-buttons", name: "Pro Buttons", category: "Pro Suites", categoryId: "pro", desc: "Shape-morphing, split dropdowns, expand icons, and status buttons.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-buttons", tier: "pro" },
  { id: "pro-cards", name: "Pro Cards Suite", category: "Pro Components", categoryId: "pro-components", desc: "Physical product cards: HoloFinishCard, ParticleRevealCard, GlassShatterCard, and FrostHoverCard.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add holo-finish-card", tier: "pro" },
  { id: "pro-objects", name: "LiveObject (Pro Objects)", category: "Pro Components", categoryId: "pro-components", desc: "Interactive physical 3D object with cinematic ignition, gyroscope orientation, and specular sheen.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add live-object", tier: "pro" },
  { id: "pro-dashboards", name: "Pro Dashboards", category: "Pro Suites", categoryId: "pro", desc: "Analytics summary grids, revenue telemetry, and key performance gauges.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-dashboards", tier: "pro" },
  { id: "pro-ecommerce", name: "Pro E-Commerce", category: "Pro Suites", categoryId: "pro", desc: "Shopping bag drawers, coupon inputs, and transaction confirmation cards.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-ecommerce", tier: "pro" },
  { id: "pro-feedback", name: "Pro Feedback", category: "Pro Suites", categoryId: "pro", desc: "Net Promoter Score (NPS) dialogs, star reviews, and survey cards.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-feedback", tier: "pro" },
  { id: "pro-forms", name: "Pro Forms", category: "Pro Suites", categoryId: "pro", desc: "Multi-step registration wizards, credit card inputs, and address validators.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-forms", tier: "pro" },
  { id: "pro-inputs", name: "Pro Inputs", category: "Pro Suites", categoryId: "pro", desc: "OTP verification blocks, currency inputs, tag tokenizers, and auto-expanding textareas.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-inputs", tier: "pro" },
  { id: "pro-layouts", name: "Pro Layouts", category: "Pro Suites", categoryId: "pro", desc: "Split-view dashboards, collapsible sidebars, and app shell scaffolds.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-layouts", tier: "pro" },
  { id: "pro-lists", name: "Pro Lists", category: "Pro Suites", categoryId: "pro", desc: "Sortable lists, transaction logs, and team directories.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-lists", tier: "pro" },
  { id: "pro-marketing", name: "Pro Marketing", category: "Pro Suites", categoryId: "pro", desc: "Pricing tiered tables, customer testimonial carousels, and feature grids.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-marketing", tier: "pro" },
  { id: "pro-navigation", name: "Pro Navigation", category: "Pro Suites", categoryId: "pro", desc: "Segmented controls, floating bottom navbars, and pagination footers.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-navigation", tier: "pro" },
  { id: "pro-tables", name: "Pro Tables", category: "Pro Suites", categoryId: "pro", desc: "Exportable CSV tables, fuzzy search filters, and bulk row selectors.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add pro-tables", tier: "pro" },
  { id: "special-forms", name: "Special Forms", category: "Pro Suites", categoryId: "pro", desc: "Selectable card radios, reactive password strength meters, and ratings.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add special-forms", tier: "pro" },
  { id: "ultra-components", name: "Ultra Components", category: "Pro Suites", categoryId: "pro", desc: "Next-generation glowing HUDs, hologram cards, and spatial panels.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add ultra-components", tier: "pro" },

  // Nexore PRO Component
  { id: "node-flow-graph", name: "Node Flow Graph", category: "Nexore PRO Suite", categoryId: "pro-suite-2", desc: "Workflow pipeline canvas with draggable nodes and bezier cables.", badge: "Pro", isNew: true, cliCommand: "npx nexoreui add node-flow-graph", tier: "pro" },
];

export const TOTAL_COMPONENTS_COUNT = ALL_COMPONENTS_DATA.length;

export function ComponentsOverviewSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const initialTier = (searchParams.get("tier") as "all" | "free" | "pro") || "all";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [tierFilter, setTierFilter] = useState<"all" | "free" | "pro">(initialTier);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedBulkIds, setSelectedBulkIds] = useState<Set<string>>(new Set());
  const [bulkCopied, setBulkCopied] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state changes with URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (tierFilter && tierFilter !== "all") params.set("tier", tierFilter);

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    window.history.replaceState(null, "", targetUrl);
  }, [selectedCategory, searchQuery, tierFilter, pathname]);

  // Keyboard shortcut handlers: '/' to focus search, 'Escape' to clear
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

  const handleCopyBulk = async () => {
    if (selectedBulkIds.size === 0) return;
    const items = Array.from(selectedBulkIds).join(" ");
    const command = `npx nexoreui add ${items}`;
    await copyToClipboard(command);
    setBulkCopied(true);
    setTimeout(() => setBulkCopied(false), 2000);
  };

  const clearBulkSelection = () => {
    setSelectedBulkIds(new Set());
  };

  const categoryTabs = useMemo(() => {
    return [
      { id: "all", label: "All Components", count: ALL_COMPONENTS_DATA.length },
      { id: "core", label: "Core & Inputs", count: ALL_COMPONENTS_DATA.filter(c => c.categoryId === "core").length },
      { id: "layout", label: "Layout & Display", count: ALL_COMPONENTS_DATA.filter(c => c.categoryId === "layout").length },
      { id: "feedback", label: "Feedback & Overlays", count: ALL_COMPONENTS_DATA.filter(c => c.categoryId === "feedback").length },
      { id: "ai", label: "AI & Agentic", count: ALL_COMPONENTS_DATA.filter(c => c.categoryId === "ai").length },
      { id: "animated", label: "Animated & Effects", count: ALL_COMPONENTS_DATA.filter(c => c.categoryId === "animated").length },
      { id: "pro", label: "Pro Suites", count: ALL_COMPONENTS_DATA.filter(c => c.categoryId === "pro").length },
      { id: "pro-suite-2", label: "Nexore PRO Suite", count: ALL_COMPONENTS_DATA.filter(c => c.categoryId === "pro-suite-2").length },
    ];
  }, []);

  const filteredComponents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ALL_COMPONENTS_DATA.filter((comp) => {
      const matchesCategory =
        selectedCategory === "all" || comp.categoryId === selectedCategory;
      const matchesTier =
        tierFilter === "all" || comp.tier === tierFilter;
      const matchesQuery =
        !q ||
        comp.name.toLowerCase().includes(q) ||
        comp.desc.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q) ||
        comp.id.toLowerCase().includes(q);
      return matchesCategory && matchesTier && matchesQuery;
    });
  }, [selectedCategory, searchQuery, tierFilter]);

  return (
    <section className="space-y-6 pb-24">
      {/* Search and Tier Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input with Hotkey indicator */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${ALL_COMPONENTS_DATA.length} components by name, feature, or keyword...`}
              className="w-full h-10 pl-10 pr-16 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/40 transition-colors"
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

          {/* Tier Segmented Filter (All / Free / Pro) */}
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5 shrink-0 self-start sm:self-auto">
            {(["all", "free", "pro"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  tierFilter === t
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categoryTabs.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-foreground text-background border-foreground font-semibold"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono ${isSelected ? "text-background/80" : "text-muted-foreground/60"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredComponents.length > 0 ? (
            filteredComponents.map((comp) => {
              const isCopied = copiedId === comp.id;
              const isSelected = selectedBulkIds.has(comp.id);

              return (
                <motion.div
                  key={comp.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`group relative flex flex-col justify-between h-full p-4 rounded-xl border bg-card transition-all ${
                    isSelected
                      ? "border-foreground/60 ring-1 ring-foreground/20"
                      : "border-border hover:border-foreground/30 hover:bg-card/90"
                  }`}
                >
                  {/* Top: Selection Checkbox & Visual Preview Thumbnail */}
                  <div className="mb-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Checkbox for bulk install */}
                        <button
                          type="button"
                          onClick={(e) => toggleBulkSelect(e, comp.id)}
                          aria-label={`Select ${comp.name} for bulk install`}
                          className={`relative z-10 w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
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

                      {/* Badges */}
                      <div className="flex items-center gap-1.5">
                        {comp.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border border-border bg-muted/50 text-foreground">
                            {comp.badge}
                          </span>
                        )}
                        {comp.isNew && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-foreground text-background">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Component Visual Mini-Preview */}
                    <ComponentThumbnail id={comp.id} category={comp.category} />
                  </div>

                  {/* Middle: Title & Description */}
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground tracking-tight mb-1">
                      <Link
                        href={`/docs/components/${comp.id}`}
                        className="focus:outline-none focus:underline"
                      >
                        <span className="absolute inset-0 z-0" aria-hidden="true" />
                        {comp.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {comp.desc}
                    </p>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
                    {/* Copy CLI button (relative z-10 so it clicks independently) */}
                    <button
                      type="button"
                      onClick={(e) => handleCopySingle(e, comp.cliCommand, comp.id)}
                      className="relative z-10 inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-muted/40 hover:bg-muted text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Copy CLI install command"
                      aria-label={`Copy CLI command for ${comp.name}`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-500 font-sans">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Terminal className="h-3 w-3 opacity-60" />
                          <span>add {comp.id}</span>
                        </>
                      )}
                    </button>

                    {/* View Link hint */}
                    <div className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all">
                      <span>View</span>
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
                No components match your search &quot;{searchQuery}&quot; with current filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setTierFilter("all");
                }}
                className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Reset filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bulk CLI Install Bar */}
      <AnimatePresence>
        {selectedBulkIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-xl p-3 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-lg flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2 py-0.5 rounded-md bg-foreground text-background font-mono text-[11px] font-semibold">
                {selectedBulkIds.size}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {selectedBulkIds.size === 1 ? "1 component selected" : `${selectedBulkIds.size} components selected`}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground truncate max-w-xs">
                  npx nexoreui add {Array.from(selectedBulkIds).join(" ")}
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
                    <span>Copied!</span>
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
