"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Copy, Check, ArrowRight, Wand2, Sparkles, Filter,
  MousePointer2, Layout, Box, Bot, Zap, Crown, ExternalLink,
  Layers, Package, Terminal
} from "lucide-react";
import { sidebarGroups, TOTAL_COMPONENTS_COUNT } from "../../config/navigation";
import { useThemeCustomizer } from "../../context/ThemeCustomizerContext";
import { copyToClipboard } from "../../utils/clipboard";

// Component metadata for rich catalog view
interface ComponentCardInfo {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  desc: string;
  badge?: string;
  isNew?: boolean;
  cliCommand: string;
  previewType?: string;
}

const ALL_COMPONENTS_DATA: ComponentCardInfo[] = [
  // Core & Inputs
  { id: "button", name: "Button", category: "Core & Inputs", categoryId: "core", desc: "Interactive button with ripple effects, glowing borders, and loading states.", cliCommand: "npx nexoreui add button" },
  { id: "input", name: "Input", category: "Core & Inputs", categoryId: "core", desc: "Text inputs with animated labels, icons, error states, and clear triggers.", cliCommand: "npx nexoreui add input" },
  { id: "switch", name: "Switch", category: "Core & Inputs", categoryId: "core", desc: "Smooth sliding toggle switch with spring physics and accessible state.", cliCommand: "npx nexoreui add switch" },
  { id: "slider", name: "Slider", category: "Core & Inputs", categoryId: "core", desc: "Fluid range controller with dual thumbs, tooltip values, and stepped values.", cliCommand: "npx nexoreui add slider" },
  { id: "rating", name: "Rating", category: "Core & Inputs", categoryId: "core", desc: "Interactive star rating with fractional stars, hover animations, and presets.", cliCommand: "npx nexoreui add rating" },
  { id: "file-upload", name: "File Upload", category: "Core & Inputs", categoryId: "core", desc: "Drag-and-drop file uploader with size validation, progress, and preview.", cliCommand: "npx nexoreui add file-upload" },

  // Layout & Display
  { id: "card", name: "Card", category: "Layout & Display", categoryId: "layout", desc: "Modular container with border glow, glassmorphism, and header/footer slots.", cliCommand: "npx nexoreui add card" },
  { id: "accordion", name: "Accordion", category: "Layout & Display", categoryId: "layout", desc: "Collapsible disclosure panels with smooth height transitions and icons.", cliCommand: "npx nexoreui add accordion" },
  { id: "tabs", name: "Tabs", category: "Layout & Display", categoryId: "layout", desc: "Tabbed content navigation with animated active pill and keyboard navigation.", cliCommand: "npx nexoreui add tabs" },
  { id: "table", name: "Table", category: "Layout & Display", categoryId: "layout", desc: "High performance data table with sorting, pagination, and selection.", cliCommand: "npx nexoreui add table" },
  { id: "stepper", name: "Stepper", category: "Layout & Display", categoryId: "layout", desc: "Multi-step flow indicator with completed states, errors, and animations.", cliCommand: "npx nexoreui add stepper" },
  { id: "scroll-area", name: "Scroll Area", category: "Layout & Display", categoryId: "layout", desc: "Customized scrollable container with styled native and smooth scrollbars.", cliCommand: "npx nexoreui add scroll-area" },
  { id: "navigation", name: "Navigation", category: "Layout & Display", categoryId: "layout", desc: "Responsive navbar header and breadcrumb trail for modern apps.", cliCommand: "npx nexoreui add navigation" },
  { id: "dock", name: "Dock", category: "Layout & Display", categoryId: "layout", desc: "macOS-inspired magnify-on-hover dock menu with physics calculations.", cliCommand: "npx nexoreui add dock" },
  { id: "data-display", name: "Data Display", category: "Layout & Display", categoryId: "layout", desc: "Structured key-value grids, stats blocks, and summary list cards.", cliCommand: "npx nexoreui add data-display" },

  // Feedback & Overlays
  { id: "modal", name: "Modal / Dialog", category: "Feedback & Overlays", categoryId: "feedback", desc: "Accessible modal overlay with focus trapping, backdrop blur, and drawer modes.", cliCommand: "npx nexoreui add modal" },
  { id: "alert", name: "Alert", category: "Feedback & Overlays", categoryId: "feedback", desc: "Callout banner for status notifications, warnings, errors, and tips.", cliCommand: "npx nexoreui add alert" },
  { id: "badge", name: "Badge", category: "Feedback & Overlays", categoryId: "feedback", desc: "Compact indicator tag with pulse radar, variant styles, and count badges.", cliCommand: "npx nexoreui add badge" },
  { id: "avatar", name: "Avatar", category: "Feedback & Overlays", categoryId: "feedback", desc: "User picture with fallback initials, status dots, and stacked group rings.", cliCommand: "npx nexoreui add avatar" },
  { id: "tooltip", name: "Tooltip", category: "Feedback & Overlays", categoryId: "feedback", desc: "Instant contextual helper tooltip with micro-animations and arrow pointers.", cliCommand: "npx nexoreui add tooltip" },
  { id: "progress", name: "Progress", category: "Feedback & Overlays", categoryId: "feedback", desc: "Linear and circular progress meters with indeterminate and stepped states.", cliCommand: "npx nexoreui add progress" },
  { id: "skeleton", name: "Skeleton", category: "Feedback & Overlays", categoryId: "feedback", desc: "Fluid shimmer loading placeholder for images, text blocks, and avatars.", cliCommand: "npx nexoreui add skeleton" },
  { id: "loaders", name: "Loaders", category: "Feedback & Overlays", categoryId: "feedback", desc: "Collection of spinners, orbital rings, and pulse wave loading indicators.", cliCommand: "npx nexoreui add loaders" },

  // AI & Agentic
  { id: "aurora-border-card", name: "Aurora Border Card", category: "AI & Agentic", categoryId: "ai", desc: "Modern card with a continuously moving, smoothly flowing gradient border.", isNew: true, cliCommand: "npx nexoreui-cli add aurora-border-card" },
  { id: "interactive-code-block", name: "Interactive Code Block", category: "AI & Agentic", categoryId: "ai", desc: "macOS-inspired code presentation card with instant 1-click copy feedback and vibrant themes.", isNew: true, cliCommand: "npx nexoreui-cli add interactive-code-block" },
  { id: "ai-prompt-input", name: "AI Prompt Input", category: "AI & Agentic", categoryId: "ai", desc: "Ultra-premium conversational AI prompt bar with model selection and voice pulse.", isNew: true, cliCommand: "npx nexoreui-cli add ai-prompt-input" },
  { id: "command", name: "Command", category: "AI & Agentic", categoryId: "ai", desc: "Fast command palette with fuzzy search, keyboard shortcuts, and groups.", cliCommand: "npx nexoreui-cli add command" },

  // Animated & Effects
  { id: "aurora-border-fx", name: "Aurora Border FX", category: "Animated & Effects", categoryId: "animated", desc: "Interactive Aurora glow card with live color switcher, dynamic blur, and reactive multi-color borders.", isNew: true, cliCommand: "npx nexoreui-cli add aurora-border-fx" },
  { id: "morphing-geometry", name: "Morphing Geometry", category: "Animated & Effects", categoryId: "animated", desc: "Interactive geometric entity with fluid corner transitions and continuous rotation.", isNew: true, cliCommand: "npx nexoreui-cli add morphing-geometry" },
  { id: "marquee", name: "Marquee", category: "Animated & Effects", categoryId: "animated", desc: "Infinite horizontal and vertical content scroller with pause-on-hover.", cliCommand: "npx nexoreui add marquee" },
  { id: "number-ticker", name: "Number Ticker", category: "Animated & Effects", categoryId: "animated", desc: "Scroll-triggered rolling counter for statistics and metrics.", cliCommand: "npx nexoreui add number-ticker" },
  { id: "animated-number", name: "Animated Number", category: "Animated & Effects", categoryId: "animated", desc: "Smooth spring-interpolated transitions when numerical values change.", cliCommand: "npx nexoreui add animated-number" },
  { id: "typing-animation", name: "Typing Animation", category: "Animated & Effects", categoryId: "animated", desc: "Realistic typewriter text effect with blinking cursor and loop controls.", cliCommand: "npx nexoreui add typing-animation" },
  { id: "blur-fade", name: "Blur Fade", category: "Animated & Effects", categoryId: "animated", desc: "Staggered blur-in and fade-in entrance wrapper for content grids.", cliCommand: "npx nexoreui add blur-fade" },
  { id: "box-reveal", name: "Box Reveal", category: "Animated & Effects", categoryId: "animated", desc: "Curtain sliding block reveal animation for hero titles and cards.", cliCommand: "npx nexoreui add box-reveal" },
  { id: "file-preview-card", name: "File Preview Card", category: "Animated & Effects", categoryId: "animated", desc: "Interactive media card with download buttons and full preview overlays.", cliCommand: "npx nexoreui add file-preview-card" },
  { id: "image-compare", name: "Image Compare", category: "Animated & Effects", categoryId: "animated", desc: "Before and after comparison slider with touch and drag support.", cliCommand: "npx nexoreui add image-compare" },
  { id: "premium-effects", name: "Premium Effects", category: "Animated & Effects", categoryId: "animated", desc: "Glow halos, meteor animations, and glassmorphic surface presets.", cliCommand: "npx nexoreui add premium-effects" },

  // Pro Suites
  { id: "charts", name: "Charts", category: "Pro Suites", categoryId: "pro", desc: "Interactive SVG area, line, and bar charts tailored for dark mode.", badge: "Pro", cliCommand: "npx nexoreui add charts" },
  { id: "commerce", name: "Commerce", category: "Pro Suites", categoryId: "pro", desc: "E-commerce checkout cards, pricing tables, and product visualizers.", badge: "Pro", cliCommand: "npx nexoreui add commerce" },
  { id: "dark-mode", name: "Dark Mode Toolkit", category: "Pro Suites", categoryId: "pro", desc: "Theme switches, auto-detect hooks, and system color sync tools.", badge: "Pro", cliCommand: "npx nexoreui add dark-mode" },
  { id: "cookie", name: "Cookie Consent", category: "Pro Suites", categoryId: "pro", desc: "GDPR compliant cookie notification banner with granular preferences.", badge: "Pro", cliCommand: "npx nexoreui add cookie" },
  { id: "social", name: "Social", category: "Pro Suites", categoryId: "pro", desc: "Social comment thread blocks, share dialogs, and user cards.", badge: "Pro", cliCommand: "npx nexoreui add social" },
];

const CATEGORY_TABS = [
  { id: "all", label: "All Components", icon: Layers, count: ALL_COMPONENTS_DATA.length },
  { id: "core", label: "Core & Inputs", icon: MousePointer2, count: 6 },
  { id: "layout", label: "Layout & Display", icon: Layout, count: 9 },
  { id: "feedback", label: "Feedback & Overlays", icon: Box, count: 8 },
  { id: "ai", label: "AI & Agentic", icon: Bot, count: 4 },
  { id: "animated", label: "Animated & Effects", icon: Zap, count: 10 },
  { id: "pro", label: "Pro Suites", icon: Crown, count: 5 },
];

export function ComponentsOverviewSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (e: React.MouseEvent, command: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await copyToClipboard(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredComponents = useMemo(() => {
    return ALL_COMPONENTS_DATA.filter((comp) => {
      const matchesCategory =
        selectedCategory === "all" || comp.categoryId === selectedCategory;
      const matchesQuery =
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="relative rounded-2xl border border-border bg-gradient-to-br from-card/80 via-card/40 to-background p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{TOTAL_COMPONENTS_COUNT} Ready Components</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Component Directory
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore our modular UI components built with Tailwind CSS v4 and Radix UI primitives. Copy the code or install them instantly via CLI.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.25)] hover:scale-105 active:scale-95"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>Create Project</span>
            </Link>
            <Link
              href="/docs/installation"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>CLI Guide</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 40+ components by name, category, or keyword..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <TabIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
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

              return (
                <motion.div
                  key={comp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/docs/components/${comp.id}`}
                    className="group relative flex flex-col justify-between h-full p-5 rounded-xl border border-border/80 bg-card/40 backdrop-blur-sm hover:border-primary/50 hover:bg-card/80 hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.1)] transition-all duration-200"
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {comp.name}
                          </h3>
                          {comp.isNew && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                              AI
                            </span>
                          )}
                          {comp.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wide">
                              {comp.badge}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-muted-foreground/60 group-hover:text-muted-foreground">
                          {comp.category}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {comp.desc}
                      </p>
                    </div>

                    {/* Bottom action bar */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 text-xs">
                      {/* CLI Command copy button */}
                      <button
                        onClick={(e) => handleCopy(e, comp.cliCommand, comp.id)}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted/60 hover:bg-muted text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy CLI install command"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400 font-sans">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 opacity-70" />
                            <span>add {comp.id}</span>
                          </>
                        )}
                      </button>

                      {/* View Link */}
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center border border-dashed border-border rounded-xl">
              <p className="text-sm font-medium text-foreground mb-1">No components found</p>
              <p className="text-xs text-muted-foreground mb-4">
                No components match your search term &quot;{searchQuery}&quot; in category &quot;{selectedCategory}&quot;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 rounded-lg bg-muted text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
