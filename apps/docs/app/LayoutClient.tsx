"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, Search, Moon, Sun, Layers, ArrowUpRight, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, type Transition, type Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { NexoreLogo } from "./components/layout/NexoreLogo";
import { ProBadge } from "./components/layout/ProBadge";
import { FooterSection } from "./components/landing/sections/FooterSection";
import { useAnalytics } from "../hooks/useAnalytics";
import { ThemeCustomizerProvider } from "./context/ThemeCustomizerContext";
import { useProStatus } from "../hooks/useProStatus";

interface LayoutContextType {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  mobileSidebarOpen: false,
  setMobileSidebarOpen: () => {},
  searchOpen: false,
  setSearchOpen: () => {},
});

export function useLayout() {
  return useContext(LayoutContext);
}

/* ─── Motion tokens ─── */
const SPRING: Transition = { type: "spring", stiffness: 400, damping: 30, mass: 0.8 };
const MENU_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MENU_EXIT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Primary navigation ─── */
interface NavItem {
  href: string;
  label: string;
  isActive: (p: string) => boolean;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/docs/installation", label: "Installation", isActive: (p) => p === "/docs/installation" },
  {
    href: "/docs/components",
    label: "Components",
    isActive: (p) => p.startsWith("/docs/components") || p === "/docs",
  },
  { href: "/docs/icons", label: "Icons", isActive: (p) => p === "/docs/icons" },
  { href: "/templates", label: "Templates", isActive: (p) => p.startsWith("/templates"), badge: "New" },
  { href: "/nexoremake", label: "Nexore Make", isActive: (p) => p.startsWith("/nexoremake") },
  { href: "/pricing", label: "Pricing", isActive: (p) => p.startsWith("/pricing") },
];

const SEARCH_SECTIONS = [
  { id: "demo", label: "Product Tour & Video Demo", desc: "Watch the 2-minute walkthrough and interactive showcase." },
  { id: "create", label: "Create Project", desc: "Interactive project configurator and theme studio." },
  { id: "templates", label: "Templates", desc: "Production-ready Next.js & Tailwind starters for SaaS, dashboards & portfolios." },
  { id: "overview", label: "Components Overview", desc: "Catalog directory of all 60+ components." },
  { id: "nexoremake", label: "Nexore Make", desc: "Visual component builder — design and export custom elements." },
  { id: "installation", label: "Installation", desc: "Get started with NexoreUI in your project." },
  { id: "button", label: "Button", desc: "Interactive button components with multiple variants." },
  { id: "input", label: "Input", desc: "Text input fields with labels, icons, and validation." },
  { id: "card", label: "Card", desc: "Versatile card layouts for content display." },
  { id: "badge", label: "Badge", desc: "Small status descriptors for UI elements." },
  { id: "alert", label: "Alert", desc: "Informational alert messages and notifications." },
  { id: "avatar", label: "Avatar", desc: "User profile pictures with fallback initials." },
  { id: "accordion", label: "Accordion", desc: "Collapsible content panels for organizing information." },
  { id: "modal", label: "Modal / Dialog", desc: "Overlay dialogs for focused interactions." },
  { id: "tooltip", label: "Tooltip", desc: "Contextual information on hover or focus." },
  { id: "tabs", label: "Tabs", desc: "Tabbed navigation between content panels." },
  { id: "progress", label: "Progress", desc: "Progress bars and indicators." },
  { id: "skeleton", label: "Skeleton", desc: "Loading placeholders for content." },
  { id: "slider", label: "Slider", desc: "Range input sliders for value selection." },
  { id: "rating", label: "Rating", desc: "Star rating components for feedback." },
  { id: "command", label: "Command", desc: "Command palette for quick actions." },
  { id: "table", label: "Table", desc: "Data tables with sorting and filtering." },
  { id: "stepper", label: "Stepper", desc: "Multi-step progress indicators." },
  { id: "scroll-area", label: "Scroll Area", desc: "Custom scrollable areas with styled scrollbars." },
  { id: "file-upload", label: "File Upload", desc: "File upload components with drag and drop." },
  { id: "navigation", label: "Navigation", desc: "Navigation menus and breadcrumbs." },
  { id: "icons", label: "Icons", desc: "Premium icon library included with NexoreUI." },
  { id: "charts", label: "Charts", desc: "Interactive charts and data visualization." },
  { id: "data-display", label: "Data Display", desc: "Components for displaying structured data." },
  { id: "dark-mode", label: "Dark Mode Toolkit", desc: "Dark mode toolkit and theme utilities." },
  { id: "commerce", label: "Commerce", desc: "E-commerce components: products, carts, pricing." },
  { id: "cookie", label: "Cookie Consent", desc: "Cookie consent banners and privacy notices." },
  { id: "social", label: "Social", desc: "Social media and chat UI components." },
  { id: "premium-effects", label: "Premium Effects", desc: "Premium visual effects and animations." },
  { id: "loaders", label: "Loaders", desc: "Loading spinners and progress indicators." },
  { id: "marquee", label: "Marquee", desc: "Scrolling marquee text and content." },
  { id: "number-ticker", label: "Number Ticker", desc: "Animated number counter components." },
  { id: "animated-number", label: "Animated Number", desc: "Smooth number transition animations." },
  { id: "typing-animation", label: "Typing Animation", desc: "Typewriter-style text animations." },
  { id: "aurora-border-card", label: "Aurora Border Card", desc: "Modern card with a continuously flowing animated gradient border." },
  { id: "aurora-search-pill", label: "Aurora Search Pill", desc: "Ultra-premium AI search pill with ambient rotating conic glow and source badges." },
  { id: "morphing-geometry", label: "Morphing Geometry", desc: "Interactive geometric entity with fluid corner transitions and continuous rotation." },
  { id: "interactive-code-block", label: "Interactive Code Block", desc: "macOS-inspired code presentation card with instant 1-click copy feedback." },
  { id: "ai-prompt-input", label: "AI Prompt Input", desc: "Ultra-premium conversational AI prompt bar with model selection." },
  { id: "blur-fade", label: "Blur Fade", desc: "Blur and fade entrance animations." },
  { id: "box-reveal", label: "Box Reveal", desc: "Box reveal entrance animations." },
  { id: "file-preview-card", label: "File Preview Card", desc: "File preview cards with thumbnails." },
  { id: "image-compare", label: "Image Compare", desc: "Before/after image comparison slider." },
  { id: "switch", label: "Switch", desc: "A control that allows the user to toggle between checked and unchecked states." },
  { id: "pro-cards", label: "Pro Cards Suite", desc: "HoloFinishCard, ParticleRevealCard, GlassShatterCard, and FrostHoverCard with physics." },
  { id: "pro-objects", label: "Pro Objects Suite", desc: "Interactive physical 3D objects: LiveObject, SoundPulse, and SilkUnveil." },
  { id: "sound-pulse", label: "SoundPulse (Pro Objects)", desc: "Audio-reactive physical product showcase with procedural Web Audio synth and 56 radial bars." },
  { id: "silk-unveil", label: "SilkUnveil (Pro Objects)", desc: "Verlet cloth physics product reveal with dynamic fold compression and organic wind." },
];

/* ─── Shared surface tokens ─── */
const ICON_BTN =
  "relative inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground " +
  "bg-black/[0.02] hover:bg-black/[0.05] dark:bg-white/[0.03] dark:hover:bg-white/[0.07] " +
  "border border-black/[0.07] dark:border-white/[0.08] " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)] " +
  "transition-colors cursor-pointer";

/* ─── Hamburger that morphs into a cross ─── */
function MenuToggle({
  open,
  onClick,
  reducedMotion,
}: {
  open: boolean;
  onClick: () => void;
  reducedMotion: boolean;
}) {
  const barTransition: Transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.34, ease: MENU_EASE };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${ICON_BTN} active:scale-95 lg:hidden`}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <motion.span
        className="relative block h-4 w-4 will-change-transform"
        initial={false}
        animate={{ rotate: open ? 90 : 0 }}
        transition={barTransition}
      >
        <motion.span
          className="absolute left-1/2 top-1/2 -ml-[7px] -mt-[0.75px] h-[1.5px] w-[14px] rounded-full bg-current will-change-transform"
          initial={false}
          animate={open ? { y: 0, rotate: 45, scaleX: 1.05 } : { y: -3.5, rotate: 0, scaleX: 1 }}
          transition={barTransition}
        />
        <motion.span
          className="absolute left-1/2 top-1/2 -ml-[7px] -mt-[0.75px] h-[1.5px] w-[14px] rounded-full bg-current will-change-transform"
          initial={false}
          animate={open ? { y: 0, rotate: -45, scaleX: 1.05 } : { y: 3.5, rotate: 0, scaleX: 1 }}
          transition={barTransition}
        />
      </motion.span>
    </button>
  );
}

/* ─── Theme toggle with icon crossfade ─── */
function ThemeToggle({ theme, onToggle }: { theme?: string; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      transition={SPRING}
      className={`${ICON_BTN} overflow-hidden`}
      title="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ y: 14, opacity: 0, rotate: -60 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 60 }}
          transition={SPRING}
          className="flex"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
}

/* ─── Mobile sheet variants ─── */
const sheetList: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.048, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};
const sheetListReduced: Variants = {
  hidden: {},
  visible: {},
  exit: {},
};
const sheetItem: Variants = {
  hidden: { opacity: 0, y: -12, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: MENU_EASE } },
  exit: { opacity: 0, y: -6, scale: 0.99, transition: { duration: 0.18, ease: MENU_EXIT_EASE } },
};
const sheetItemReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

function LayoutClientInner({ children }: { children: React.ReactNode }) {
  const { isPro } = useProStatus();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      // 2.0 announcement banner appears only when a user visits the site for the very first time
      const hasVisited = localStorage.getItem("nexore_v2_has_visited");
      const isDismissed = localStorage.getItem("nexore_v2_banner_dismissed");
      if (!hasVisited && !isDismissed) {
        setBannerDismissed(false);
        localStorage.setItem("nexore_v2_has_visited", "true");
      } else {
        setBannerDismissed(true);
      }
    } catch {
      setBannerDismissed(true);
    }
  }, [mounted]);

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    try {
      localStorage.setItem("nexore_v2_banner_dismissed", "true");
      localStorage.setItem("nexore_v2_has_visited", "true");
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!mounted) return;

    try {
      sessionStorage.removeItem("nexore_visited_paths");
    } catch (e) {
      // ignore
    }
  }, [mounted]);

  // Initialize analytics session tracking
  useAnalytics();

  // Ensure scroll is immediately reset to the top when navigating to any new page
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }
  }, [pathname]);

  // Header elevation once the page leaves the top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isDocs = pathname.startsWith("/docs");
  const isMake = pathname.startsWith("/nexoremake");
  const isMakeEditor = pathname === "/nexoremake";
  const isPreview = pathname.startsWith("/templates/preview");

  // Close the mobile sheet on navigation
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const filteredSections = searchQuery
    ? SEARCH_SECTIONS.filter(
        (s) =>
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_SECTIONS;

  const handleSearchSelect = (id: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setMobileSidebarOpen(false);

    if (id === "demo") {
      router.push("/demo");
    } else if (id === "create") {
      router.push("/create");
    } else if (id === "templates") {
      router.push("/templates");
    } else if (id === "nexoremake") {
      router.push("/nexoremake");
    } else if (id === "installation") {
      router.push("/docs/installation");
    } else if (id === "overview") {
      router.push("/docs/components");
    } else if (id === "icons") {
      router.push("/docs/icons");
    } else {
      router.push(`/docs/components/${id}`);
    }
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  if (isPreview) {
    return (
      <LayoutContext.Provider
        value={{
          mobileSidebarOpen: false,
          setMobileSidebarOpen: () => {},
          searchOpen: false,
          setSearchOpen: () => {},
        }}
      >
        <div className="w-full min-h-screen bg-background text-foreground overflow-x-hidden">
          {children}
        </div>
      </LayoutContext.Provider>
    );
  }

  return (
    <LayoutContext.Provider
      value={{
        mobileSidebarOpen,
        setMobileSidebarOpen,
        searchOpen,
        setSearchOpen,
      }}
    >
      <div className={`relative flex ${isMakeEditor ? "h-screen max-h-screen overflow-hidden" : "min-h-screen"} flex-col bg-background text-foreground`}>
        {/* ─── Top Announcement Bar (NexoreUI 2.0) ─── */}
        {!bannerDismissed && !isMake && (
          <div className="relative z-50 w-full border-b border-border/70 bg-muted/40 px-3 sm:px-4 py-2 text-xs backdrop-blur-md">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3">
              <div className="flex flex-1 items-center justify-center gap-2 text-center text-xs sm:text-left">
                <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground px-1.5 py-0.5 rounded border border-border/80 bg-background/80 shrink-0">
                  NexoreUI 2.0
                </span>
                <span className="text-foreground/90 font-medium">
                  Now live: 30+ production templates, high-craft interactive components, and visual canvas exports.
                </span>
                <Link
                  href="/pricing"
                  className="hidden md:inline-flex items-center gap-1 font-semibold text-foreground underline underline-offset-4 hover:opacity-85 transition-opacity ml-1 shrink-0"
                >
                  Explore access
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <button
                type="button"
                onClick={handleDismissBanner}
                aria-label="Dismiss announcement"
                className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ─── Header ─── */}
        {!isMake && (
          <header
            className={`sticky top-0 z-50 w-full border-b transition-[background-color,border-color] duration-200 ${
              mobileSidebarOpen
                ? "bg-background border-border"
                : scrolled
                ? "bg-background/80 backdrop-blur-xl backdrop-saturate-150 border-black/[0.07] dark:border-white/[0.07] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
                : "bg-background/60 backdrop-blur-xl backdrop-saturate-150 border-transparent"
            }`}
          >
            <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6">
              {/* Left: Brand */}
              <Link href="/" className="group flex items-center gap-2.5 shrink-0" aria-label="NexoreUI home">
                <NexoreLogo size={20} />
                <div className="relative inline-flex items-center">
                  <span className="text-[17px] font-bold tracking-[-0.04em] text-foreground">
                    Nexore<span className="text-zinc-500 dark:text-zinc-400">UI</span>
                  </span>
                  {isPro && (
                    <span className="ml-1.5 -translate-y-2.5 self-start">
                      <ProBadge />
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline-flex items-center rounded-full bg-foreground text-background px-2.5 py-0.5 text-xs font-mono font-bold tracking-tight shadow-xs transition-all duration-200 group-hover:scale-110 group-hover:opacity-90">
                  2.0
                </span>
              </Link>

              {/* Center: Navigation rail with sliding indicators */}
              <nav
                onMouseLeave={() => setHoveredNav(null)}
                className="hidden lg:flex items-center p-1 rounded-full bg-black/[0.03] dark:bg-white/[0.025] border border-black/[0.06] dark:border-white/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_8px_24px_-12px_rgba(0,0,0,0.6)]"
              >
                {NAV_ITEMS.map((item) => {
                  const active = item.isActive(pathname);
                  const hovered = hoveredNav === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => setHoveredNav(item.href)}
                      className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-200 ${
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <AnimatePresence>
                        {hovered && !active && (
                          <motion.span
                            layoutId="nav-hover"
                            className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.05]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={SPRING}
                          />
                        )}
                      </AnimatePresence>
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full bg-white dark:bg-zinc-800/90 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.06),0_4px_12px_-4px_rgba(0,0,0,0.6)]"
                          transition={SPRING}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                      {item.badge && (
                        <span className="relative z-10 font-mono text-[9px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <motion.div whileTap={{ scale: 0.96 }} transition={SPRING} className="hidden sm:block">
                  <Link
                    href="/create"
                    className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-zinc-900 px-4 text-[13px] font-semibold tracking-[-0.01em] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.25),0_6px_16px_-6px_rgba(0,0,0,0.35)] transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.12),0_8px_24px_-8px_rgba(255,255,255,0.18)] dark:hover:bg-zinc-100"
                  >
                    <span>Create Project</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100" />
                  </Link>
                </motion.div>

                {/* Command-bar search */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING}
                  onClick={() => setSearchOpen(true)}
                  className={`${ICON_BTN} sm:w-44 sm:justify-start sm:gap-2 sm:px-3`}
                  aria-label="Search"
                >
                  <Search className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden flex-1 text-left text-[13px] sm:inline">Search…</span>
                  <kbd className="pointer-events-none hidden select-none items-center rounded-[5px] border border-black/[0.08] dark:border-white/[0.1] bg-background px-1.5 py-px font-mono text-[10px] text-muted-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(0,0,0,0.6)] sm:inline-flex">
                    ⌘K
                  </kbd>
                </motion.button>

                <motion.a
                  whileTap={{ scale: 0.92 }}
                  transition={SPRING}
                  href="https://github.com/Al1mov77/NexoreUI"
                  target="_blank"
                  rel="noreferrer"
                  className={`${ICON_BTN} hidden md:inline-flex`}
                  title="GitHub Repository"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </motion.a>

                {mounted ? (
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                ) : (
                  <span className="h-9 w-9" aria-hidden />
                )}

                <MenuToggle
                  open={mobileSidebarOpen}
                  onClick={() => setMobileSidebarOpen((prev) => !prev)}
                  reducedMotion={prefersReducedMotion}
                />
              </div>
            </div>

            {/* ─── Mobile Navigation Panel (non-docs pages; docs use their own sidebar) ─── */}
            <AnimatePresence>
              {!isDocs && mobileSidebarOpen && (
                <motion.div
                  key="mobile-sheet"
                  className="absolute inset-x-0 top-full z-50 origin-top border-b border-border bg-background shadow-[0_16px_36px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_44px_-12px_rgba(0,0,0,0.7)] will-change-transform lg:hidden"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -14, scaleY: 0.92 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scaleY: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { opacity: 0, y: -10, scaleY: 0.95, transition: { duration: 0.24, ease: MENU_EXIT_EASE } }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.38, ease: MENU_EASE }
                  }
                >
                  <motion.nav
                    variants={prefersReducedMotion ? sheetListReduced : sheetList}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    aria-label="Mobile navigation"
                    className="mx-auto flex max-w-screen-2xl flex-col gap-0.5 px-4 py-3 sm:px-6"
                  >
                    {NAV_ITEMS.map((item) => {
                      const active = item.isActive(pathname);
                      return (
                        <motion.div
                          key={item.href}
                          variants={prefersReducedMotion ? sheetItemReduced : sheetItem}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMobileSidebarOpen(false)}
                            className={`group relative flex h-11 items-center justify-between rounded-lg px-3 text-[15px] font-medium tracking-[-0.01em] active:scale-[0.99] transition-[background-color,color,transform] duration-200 ${
                              active
                                ? "bg-muted text-foreground font-semibold"
                                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              {active && <span className="h-4 w-1 rounded-full bg-foreground" />}
                              <span>{item.label}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              {item.badge && (
                                <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                                  {item.badge}
                                </span>
                              )}
                              <ArrowRight
                                className={`h-4 w-4 transition-transform duration-200 ${
                                  active
                                    ? "text-foreground opacity-90"
                                    : "text-muted-foreground opacity-35 group-hover:translate-x-0.5 group-hover:opacity-80 group-active:translate-x-0.5"
                                }`}
                              />
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}

                    <motion.div
                      variants={prefersReducedMotion ? sheetItemReduced : sheetItem}
                      className="my-2.5 h-px bg-border"
                    />

                    <motion.div
                      variants={prefersReducedMotion ? sheetItemReduced : sheetItem}
                      className="flex items-center gap-2 pt-0.5"
                    >
                      <Link
                        href="/create"
                        onClick={() => setMobileSidebarOpen(false)}
                        className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        <span>Create Project</span>
                        <ArrowUpRight className="h-4 w-4 opacity-70" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileSidebarOpen(false);
                          setSearchOpen(true);
                        }}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                        aria-label="Search"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                      <a
                        href="https://github.com/Al1mov77/NexoreUI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    </motion.div>
                  </motion.nav>
                </motion.div>
              )}
            </AnimatePresence>
          </header>
        )}

        {/* Content */}
        <div className="flex-1 min-h-0 flex flex-col">{children}</div>

        {/* Universal Footer */}
        {!isDocs && !isMake && <FooterSection />}

        {/* ─── Mobile Backdrop (non-docs pages; docs use their own sidebar) ─── */}
        <AnimatePresence>
          {!isDocs && !isMake && mobileSidebarOpen && (
            <motion.div
              key="mobile-backdrop"
              className="fixed inset-0 z-40 bg-black/25 dark:bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                prefersReducedMotion ? { duration: 0 } : { duration: 0.32, ease: MENU_EASE }
              }
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ─── Global Search Modal ─── */}
        <AnimatePresence>
          {searchOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh]">
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
              />
              <motion.div
                className="relative mx-4 w-full max-w-lg overflow-hidden rounded-xl border border-black/[0.08] dark:border-white/[0.09] bg-background shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_24px_64px_-12px_rgba(0,0,0,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_24px_64px_-12px_rgba(0,0,0,0.8)]"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } }}
                transition={SPRING}
              >
                <div className="flex items-center gap-3 px-4 border-b border-border">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-12 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    placeholder="Search components..."
                  />
                  <kbd className="hidden sm:inline-flex h-5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[9px] text-muted-foreground">
                    ESC
                  </kbd>
                </div>

                <div className="max-h-[320px] overflow-y-auto p-2 space-y-1">
                  {filteredSections.length > 0 ? (
                    filteredSections.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSearchSelect(s.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left hover:bg-muted hover:text-foreground transition-colors text-muted-foreground"
                      >
                        <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-foreground">{s.label}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5 truncate">
                            {s.desc}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No results for &quot;{searchQuery}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </LayoutContext.Provider>
  );
}

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const { isPro } = useProStatus();
  return (
    <ThemeCustomizerProvider>
      <LayoutClientInner>{children}</LayoutClientInner>
    </ThemeCustomizerProvider>
  );
}
