"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, Search, Moon, Sun, Menu, X, Layers, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { NexoreLogo } from "./components/layout/NexoreLogo";

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
  { id: "blur-fade", label: "Blur Fade", desc: "Blur and fade entrance animations." },
  { id: "box-reveal", label: "Box Reveal", desc: "Box reveal entrance animations." },
  { id: "file-preview-card", label: "File Preview Card", desc: "File preview cards with thumbnails." },
  { id: "image-compare", label: "Image Compare", desc: "Before/after image comparison slider." },
];

export function LayoutClient({ children }: { children: React.ReactNode }) {
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
      const visitedKey = "nexore_visited_paths";
      let visitedPaths: string[] = [];
      try {
        const stored = sessionStorage.getItem(visitedKey);
        if (stored) {
          visitedPaths = JSON.parse(stored);
        }
      } catch (e) {
        // ignore
      }

      if (!visitedPaths.includes(pathname)) {
        let referrer = "Direct";
        try {
          if (document.referrer) {
            const referrerUrl = new URL(document.referrer);
            if (referrerUrl.origin !== window.location.origin) {
              referrer = document.referrer;
            }
          }
        } catch (e) {
          // ignore
        }

        fetch("/api/telegram-notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "visit",
            path: pathname,
            referrer,
          }),
        }).catch((err) => console.error("Error sending visitor notification:", err));

        visitedPaths.push(pathname);
        try {
          sessionStorage.setItem(visitedKey, JSON.stringify(visitedPaths));
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error("Error in visitor tracking effect:", err);
    }
  }, [pathname, mounted]);

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
    
    if (id === "nexoremake") {
      router.push("/nexoremake");
    } else if (id === "installation") {
      router.push("/docs/installation");
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
      <div className="relative flex min-h-screen flex-col bg-background text-foreground">
        {/* Header — 64px height, sticky, bg-background/95 backdrop-blur, border-border */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
            {/* Left: Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <NexoreLogo size={18} className="text-foreground" />
                <span className="font-semibold text-sm text-foreground tracking-tight">NexoreUI</span>
              </Link>
            </div>
 
            {/* Center: Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="/docs/installation"
                className="text-muted-foreground transition-colors hover:text-foreground font-medium"
              >
                Installation
              </Link>
              <Link
                href="/docs/components/button"
                className="text-muted-foreground transition-colors hover:text-foreground font-medium"
              >
                Components
              </Link>
              <Link
                href="/nexoremake"
                className="text-muted-foreground transition-colors hover:text-foreground font-medium flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3 text-violet-400" />
                <span>Nexore Make</span>
              </Link>
              <a
                href="https://github.com/Al1mov77/NexoreUI"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground font-medium"
              >
                GitHub
              </a>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {isDocs && (
                <button
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
                >
                  {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              )}

              <button
                onClick={() => setSearchOpen(true)}
                className="relative flex items-center gap-2 rounded-md border border-border bg-muted/50 p-1.5 sm:px-3 sm:py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-8 h-8 sm:w-40 text-left justify-center sm:justify-start"
              >
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 hidden sm:inline">Search...</span>
                <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground sm:inline-flex border border-border">
                  ⌘K
                </kbd>
              </button>

              <a
                href="https://github.com/Al1mov77/NexoreUI"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4 text-foreground" />
                <span className="sr-only">GitHub</span>
              </a>

              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="sr-only">Toggle theme</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1">{children}</div>

        {/* Footer — minimalist, single line */}
        {!isDocs && (
          <footer className="border-t border-border bg-background py-6">
            <div className="mx-auto max-w-screen-2xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <NexoreLogo size={14} className="text-muted-foreground" />
                <span>Built by NexoreUI. The source code is available on GitHub.</span>
              </div>
              <p>MIT License</p>
            </div>
          </footer>
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

              <div className="max-h-[320px] overflow-y-auto p-2">
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
