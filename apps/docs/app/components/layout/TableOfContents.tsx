"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp, Github, Compass } from "lucide-react";
import { getGithubComponentFile } from "../../config/navigation";

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

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TableOfContents({
  activeSection,
  customItems,
  githubFileName,
  className = "",
}: TableOfContentsProps) {
  const [dynamicItems, setDynamicItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  const items = customItems && customItems.length > 0 ? customItems : dynamicItems;

  useEffect(() => {
    if (customItems && customItems.length > 0) return;

    const collectHeadings = () => {
      const container = document.querySelector("[data-docs-content]");
      if (!container) return;

      const headings = Array.from(container.querySelectorAll("h2, h3")).filter((el) => {
        const text = el.textContent?.trim();
        if (!text || text.length > 64) return false;
        // Skip headings inside interactive component preview boxes
        if (el.closest("[data-demo-preview]")) return false;
        return true;
      });

      const usedIds = new Set<string>();
      const collected: TocItem[] = [];

      for (const el of headings) {
        const text = el.textContent?.trim() || "";
        const base = slugifyHeading(text) || "section";
        let id = el.id;

        if (!id || usedIds.has(id)) {
          let suffix = 0;
          let candidate = base;
          while (usedIds.has(candidate)) {
            suffix += 1;
            candidate = `${base}-${suffix}`;
          }
          id = candidate;
          el.id = id;
        }

        usedIds.add(id);
        collected.push({
          id,
          title: text,
          level: el.tagName === "H3" ? 3 : 2,
        });
      }

      setDynamicItems(collected.slice(0, 12));
      if (collected.length > 0) {
        setActiveId(collected[0].id);
      }
    };

    const timer = window.setTimeout(collectHeadings, 120);
    const observer = new MutationObserver(() => {
      collectHeadings();
    });
    const container = document.querySelector("[data-docs-content]");
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeSection, customItems]);

  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const headingElements = items
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 130;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= scrollPosition) {
          setActiveId(el.id);
          return;
        }
      }

      setActiveId(headingElements[0].id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 88;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;
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
    githubUrl = "https://github.com/Al1mov77/NexoreUI/blob/main/apps/docs/app/components/sections/IconsSection.tsx";
  } else if (activeSection === "pro-components") {
    githubUrl = "https://github.com/Al1mov77/NexoreUI/blob/main/apps/docs/app/components/sections/ProComponentsSection.tsx";
  } else if (activeSection === "webgl-overview") {
    githubUrl = "https://github.com/Al1mov77/NexoreUI/blob/main/apps/docs/app/components/sections/WebglOverviewSection.tsx";
  } else {
    const resolvedFile = githubFileName || getGithubComponentFile(activeSection);
    githubUrl = `https://github.com/Al1mov77/NexoreUI/blob/main/packages/ui/src/components/${resolvedFile}`;
  }

  return (
    <div className={`space-y-6 text-xs ${className}`}>
      {/* On This Page Section */}
      {items.length > 0 && (
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
                  type="button"
                  onClick={() => scrollToId(item.id)}
                  className={`relative block w-full text-left py-1 transition-all text-xs rounded-r-md cursor-pointer ${
                    item.level === 3 ? "pl-4" : "pl-2.5"
                  } ${
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:translate-x-0.5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-toc-marker"
                      className="absolute -left-[9px] top-1 bottom-1 w-[2px] bg-foreground rounded-full"
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    />
                  )}
                  <span className="truncate block">{item.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Quick Action Links Card */}
      <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 shadow-xs">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
          Resources
        </span>

        <Link
          href="/templates"
          className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
        >
          <span>Full Templates</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-foreground text-background font-semibold">
            Pro
          </span>
        </Link>

        <Link
          href="/create"
          className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted/40 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Project Studio</span>
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
        type="button"
        onClick={scrollToTop}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors cursor-pointer pl-1 group"
      >
        <ArrowUp className="h-3 w-3 group-hover:-translate-y-0.5 transition-transform text-foreground" />
        <span>Back to top</span>
      </button>
    </div>
  );
}
