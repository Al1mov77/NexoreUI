"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, Search, Moon, Sun, Menu, X, Layers, Sparkles, Wand2, Terminal, ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import { NexoreLogo } from "./components/layout/NexoreLogo";
import { useAnalytics } from "../hooks/useAnalytics";
import { ThemeCustomizerProvider } from "./context/ThemeCustomizerContext";

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

const SEARCH_SECTIONS = [
  { id: "create", label: "Create Project", desc: "Interactive project configurator and theme studio." },
  { id: "overview", label: "Components Overview", desc: "Catalog directory of all 40+ components." },
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
  { id: "ai-prompt-input", label: "AI Prompt Input", desc: "Ultra-premium conversational AI prompt bar with model selection." },
  { id: "blur-fade", label: "Blur Fade", desc: "Blur and fade entrance animations." },
  { id: "box-reveal", label: "Box Reveal", desc: "Box reveal entrance animations." },
  { id: "file-preview-card", label: "File Preview Card", desc: "File preview cards with thumbnails." },
  { id: "image-compare", label: "Image Compare", desc: "Before/after image comparison slider." },
  { id: "switch", label: "Switch", desc: "A control that allows the user to toggle between checked and unchecked states." },
  { id: "dock", label: "Dock", desc: "A macOS-style magnify-on-hover toolbar menu." },
];

function LayoutClientInner({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isDocs = pathname.startsWith("/docs");
  const isMake = pathname.startsWith("/nexoremake");

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

    if (id === "create") {
      router.push("/create");
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

  return (
    <LayoutContext.Provider
      value={{
        mobileSidebarOpen,
        setMobileSidebarOpen,
        searchOpen,
        setSearchOpen,
      }}
    >
      <div className={`relative flex ${isMake ? "h-screen max-h-screen overflow-hidden" : "min-h-screen"} flex-col bg-background text-foreground`}>
        {/* Header — 64px height, sticky, bg-background/80 backdrop-blur-xl, border-border/50 */}
        {!isMake && (
          <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
              {/* Left: Brand Logo & Title */}
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <NexoreLogo size={20} />
                  <span className="font-bold text-base sm:text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                    Nexore<span className="text-primary font-black">UI</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-muted text-muted-foreground border border-border/70">
                    v1.4
                  </span>
                </Link>
              </div>

              {/* Center: High-End Floating Navigation Pill */}
              <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800 backdrop-blur-xl shadow-xs">
                <Link
                  href="/docs/installation"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    pathname === "/docs/installation"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold border border-zinc-200/80 dark:border-zinc-700"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  <span>Installation</span>
                </Link>

                <Link
                  href="/docs/components"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    pathname?.startsWith("/docs/components") || pathname === "/docs"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold border border-zinc-200/80 dark:border-zinc-700"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  <span>Components</span>
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-primary/15 text-primary text-[10px] font-mono font-bold">
                    41
                  </span>
                </Link>

                <Link
                  href="/docs/icons"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    pathname === "/docs/icons"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold border border-zinc-200/80 dark:border-zinc-700"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Icons</span>
                </Link>

                <Link
                  href="/nexoremake"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    pathname?.startsWith("/nexoremake")
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold border border-zinc-200/80 dark:border-zinc-700"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <Wand2 className="h-3.5 w-3.5 text-fuchsia-500" />
                  <span>Nexore Make</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 text-[9px] font-bold">
                    AI
                  </span>
                </Link>
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Create Project Studio Pill CTA */}
                <Link
                  href="/create"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary via-indigo-500 to-violet-600 hover:from-primary/90 hover:to-violet-500 text-white text-xs font-semibold shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>Create Project</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-bold tracking-wider">
                    STUDIO
                  </span>
                </Link>

                {/* Search Trigger */}
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="relative flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 hover:bg-muted/70 p-2 sm:px-3.5 sm:py-1.5 text-xs text-muted-foreground hover:text-foreground transition-all sm:w-40 text-left justify-center sm:justify-start shadow-2xs cursor-pointer"
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 hidden sm:inline text-xs">Search...</span>
                  <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded-full bg-background px-1.5 py-0.5 font-mono text-[9px] font-medium text-muted-foreground sm:inline-flex border border-border shadow-2xs">
                    ⌘K
                  </kbd>
                </button>

                {/* GitHub Link */}
                <a
                  href="https://github.com/Al1mov77/NexoreUI"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:inline-flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-border/60 transition-all cursor-pointer shadow-2xs"
                  title="GitHub Repository"
                >
                  <Github className="h-4 w-4 text-foreground" />
                  <span className="sr-only">GitHub</span>
                </a>

                {/* Theme Mode Switcher */}
                {mounted && (
                  <button
                    type="button"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="inline-flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-border/60 transition-all cursor-pointer shadow-2xs"
                    title="Toggle Theme"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Moon className="h-4 w-4 text-primary" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </button>
                )}

                {/* Mobile Menu Hamburger */}
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className="inline-flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden border border-border/60 cursor-pointer"
                  aria-label="Toggle mobile menu"
                >
                  {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Content */}
        <div className="flex-1 min-h-0 flex flex-col">{children}</div>

        {/* Footer */}
        {!isDocs && !isMake && (
          <footer className="border-t border-border bg-background py-6">
            <div className="mx-auto max-w-screen-2xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <NexoreLogo size={16} />
                <span>Built by NexoreUI. The source code is available on GitHub.</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/create" className="hover:text-foreground transition-colors text-primary">
                  Create Project
                </Link>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <p>MIT License</p>
              </div>
            </div>
          </footer>
        )}

        {/* Mobile Navigation Drawer for non-docs pages */}
        {!isDocs && mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-[280px] max-w-[80vw] bg-background border-r border-border h-full flex flex-col p-4 shadow-2xl z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <Link href="/" onClick={() => setMobileSidebarOpen(false)} className="flex items-center gap-2 group">
                  <NexoreLogo size={18} />
                  <span className="font-semibold text-sm tracking-tight text-foreground">Nexore<span className="text-primary font-bold">UI</span></span>
                </Link>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="py-4 space-y-2">
                <Link
                  href="/create"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/10 border border-primary/30 text-xs font-semibold text-primary"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>Create Project Studio</span>
                </Link>
                <Link
                  href="/docs/installation"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Installation</span>
                </Link>
                <Link
                  href="/docs/components"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Components Directory</span>
                </Link>
                <Link
                  href="/docs/icons"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Icons</span>
                </Link>
                <Link
                  href="/nexoremake"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <span>Nexore Make (AI Builder)</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Global Search Modal */}
        {searchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh]">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
            />
            <div className="relative w-full max-w-lg mx-4 bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
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
            </div>
          </div>
        )}
      </div>
    </LayoutContext.Provider>
  );
}

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeCustomizerProvider>
      <LayoutClientInner>{children}</LayoutClientInner>
    </ThemeCustomizerProvider>
  );
}
