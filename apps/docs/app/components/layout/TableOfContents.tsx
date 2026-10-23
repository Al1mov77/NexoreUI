"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp, Github, Compass } from "lucide-react";

export interface TocItem {
  id: string;
  title: string;
  level?: number;
}

interface TableOfContentsProps {
  activeSection: string;
  customItems?: TocItem[];
  githubFileName?: string;
  className?: string;
}

const DEFAULT_ITEMS_BY_SECTION: Record<string, TocItem[]> = {
  installation: [
    { id: "project-configurator", title: "Project Configurator" },
    { id: "automatic-installation", title: "Automatic Setup (CLI)" },
    { id: "manual-installation", title: "Manual Setup" },
    { id: "tailwind-configuration", title: "Tailwind CSS Setup" },
    { id: "import-usage", title: "Usage in Code" },
  ],
  icons: [
    { id: "icon-showcase", title: "Icon Showcase" },
    { id: "icon-search", title: "Search Icons" },
    { id: "installation-usage", title: "Installation & Usage" },
  ],
};

const DEFAULT_COMPONENT_TOC: TocItem[] = [
  { id: "playground", title: "Interactive Playground" },
  { id: "variants", title: "Variants & Examples" },
  { id: "props", title: "Props Reference" },
  { id: "accessibility", title: "Accessibility (a11y)" },
];

export function TableOfContents({
  activeSection,
  customItems,
  githubFileName,
  className = "",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  const items =
    customItems ||
    DEFAULT_ITEMS_BY_SECTION[activeSection] ||
    DEFAULT_COMPONENT_TOC;

  useEffect(() => {
    const handleScroll = () => {
      // Find which heading is currently in viewport
      const headingElements = items
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(items[i].id);
          return;
        }
      }

      if (headingElements.length > 0) {
        setActiveId(items[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let githubUrl = "https://github.com/Al1mov77/NexoreUI/tree/main/packages/ui/src/components";
  if (activeSection === "installation") {
    githubUrl = "https://github.com/Al1mov77/NexoreUI/blob/main/apps/docs/app/components/sections/InstallationSection.tsx";
  } else if (activeSection === "overview") {
    githubUrl = "https://github.com/Al1mov77/NexoreUI/blob/main/apps/docs/app/components/sections/ComponentsOverviewSection.tsx";
  } else if (activeSection === "icons") {
    githubUrl = "https://github.com/Al1mov77/NexoreUI/blob/main/apps/docs/app/icons/page.tsx";
  } else if (githubFileName) {
    githubUrl = `https://github.com/Al1mov77/NexoreUI/blob/main/packages/ui/src/components/${githubFileName}`;
  }

  return (
    <div className={`space-y-6 text-xs ${className}`}>
      {/* On This Page Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-semibold text-foreground tracking-tight">
          <Compass className="h-3.5 w-3.5 text-foreground" />
          <span>On This Page</span>
        </div>

        <nav className="space-y-1 pl-2 border-l border-border/60">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className={`relative block w-full text-left py-1 pl-2.5 transition-all text-xs rounded-r-md ${
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:translate-x-0.5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-toc-marker"
                    className="absolute -left-[9px] top-1 bottom-1 w-[2px] bg-foreground rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="truncate block">{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Action Links Card */}
      <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 shadow-sm">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
          Quick Actions
        </span>

        <Link
          href="/create"
          className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
        >
          <span>Project Studio</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-foreground text-background font-semibold">
            New
          </span>
        </Link>

        <Link
          href="/nexoremake"
          className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/40 text-xs text-muted-foreground hover:text-foreground transition-all"
        >
          <span>Nexore Make (AI)</span>
        </Link>

        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/40 text-xs text-muted-foreground hover:text-foreground transition-all"
        >
          <Github className="h-3.5 w-3.5" />
          <span>Source on GitHub</span>
        </a>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors cursor-pointer pl-1 group"
      >
        <ArrowUp className="h-3 w-3 group-hover:-translate-y-0.5 transition-transform text-primary" />
        <span>Back to top</span>
      </button>
    </div>
  );
}
