"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, Search, X, FolderCode, Layers, ShieldCheck, Compass } from "lucide-react";
import { NexoreLogo } from "./NexoreLogo";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { sidebarGroups, topLevelNavItems, TOTAL_COMPONENTS_COUNT } from "../../config/navigation";
import { useLayout } from "../../LayoutClient";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

export default function Sidebar({ activeSection, onSectionChange, className = "" }: SidebarProps) {
  const { setMobileSidebarOpen } = useLayout();
  const [filterQuery, setFilterQuery] = useState("");

  // Find group of current active section to keep it expanded
  const activeGroupId = sidebarGroups.find((g) =>
    g.items.some((item) => item.id === activeSection)
  )?.id;

  // Track expanded state for each group
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    core: true,
    layout: true,
    feedback: true,
    ai: true,
    animated: false,
    pro: true,
    "pro-components": true,
  });

  // Auto-expand group if activeSection is in it
  useEffect(() => {
    if (activeGroupId) {
      setExpandedGroups((prev) => ({
        ...prev,
        [activeGroupId]: true,
      }));
    }
  }, [activeGroupId]);

  // If user is searching in sidebar, auto-expand all groups
  useEffect(() => {
    if (filterQuery.trim()) {
      setExpandedGroups({
        core: true,
        layout: true,
        feedback: true,
        ai: true,
        animated: true,
        pro: true,
        "pro-components": true,
      });
    }
  }, [filterQuery]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const filteredGroups = useMemo(() => {
    if (!filterQuery.trim()) return sidebarGroups;

    const q = filterQuery.toLowerCase();
    return sidebarGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [filterQuery]);

  return (
    <aside className={`w-[260px] border-r border-border bg-background/95 backdrop-blur-md overflow-hidden flex flex-col ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <NexoreLogo size={18} />
          <span className="font-bold text-sm tracking-tight text-foreground">
            NexoreUI
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            2.0
          </span>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Search Filter */}
      <div className="px-3 pt-3 pb-2 shrink-0 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full h-8 pl-8 pr-7 text-xs bg-muted/40 border border-border rounded-lg outline-none focus:border-foreground/30 text-foreground placeholder:text-muted-foreground/60 transition-colors"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery("")}
              className="absolute right-2 top-2 p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear filter"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Scrollable Area */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-4 text-sm scrollbar-none">
        {/* Mobile Quick Links Block (>= 44px touch targets) */}
        {!filterQuery && (
          <div className="md:hidden space-y-1 border-b border-border pb-3">
            <div className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Navigation
            </div>
            {[
              { href: "/docs/installation", label: "Installation", id: "installation" },
              { href: "/docs/components", label: "Components", id: "overview" },
              { href: "/docs/icons", label: "Icons", id: "icons" },
              { href: "/templates", label: "Templates", id: "templates" },
              { href: "/nexoremake", label: "Nexore Make", id: "nexoremake" },
              { href: "/create", label: "Create Project", id: "create" },
            ].map((link) => {
              const isCurrent = activeSection === link.id;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    if (["installation", "overview", "icons"].includes(link.id)) {
                      onSectionChange(link.id);
                    }
                    setMobileSidebarOpen(false);
                  }}
                  className={`min-h-[44px] flex items-center px-3 rounded-lg text-xs font-medium transition-colors ${
                    isCurrent
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Desktop Top-Level Items (Installation, Overview, Icons) */}
        {!filterQuery && (
          <div className="hidden md:block space-y-0.5 border-b border-border pb-3">
            {topLevelNavItems.map((item) => {
              const isActive = activeSection === item.id;
              const href =
                item.id === "installation"
                  ? "/docs/installation"
                  : item.id === "overview"
                  ? "/docs/components"
                  : "/docs/icons";

              return (
                <Link
                  key={item.id}
                  href={href}
                  onClick={() => {
                    onSectionChange(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`relative w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Categorized Groups with Accordion */}
        <div className="space-y-3">
          <div className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Categories ({TOTAL_COMPONENTS_COUNT})
          </div>

          {filteredGroups.map((group) => {
            const isExpanded = expandedGroups[group.id] ?? false;
            const hasActiveChild = group.items.some((i) => i.id === activeSection);

            return (
              <div key={group.id} className="space-y-1">
                {/* Category Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors group cursor-pointer ${
                    hasActiveChild ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <span>{group.title}</span>
                  <div className="flex items-center gap-1.5 text-muted-foreground/60">
                    <span className="text-[10px] font-mono opacity-60 group-hover:opacity-100">
                      {group.items.length}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </motion.div>
                  </div>
                </button>

                {/* Sub-items */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                      className="overflow-hidden pl-2 border-l border-border/40 ml-3 space-y-0.5"
                    >
                      {group.items.map((item) => {
                        const isActive = activeSection === item.id;

                        return (
                          <Link
                            key={item.id}
                            href={`/docs/components/${item.id}`}
                            onClick={() => {
                              onSectionChange(item.id);
                              setMobileSidebarOpen(false);
                            }}
                            className={`min-h-[32px] md:min-h-[28px] w-full flex items-center px-2.5 py-1 rounded-md text-xs transition-colors duration-150 ${
                              isActive
                                ? "font-semibold text-foreground bg-muted"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            }`}
                          >
                            <span className="truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-3 py-2.5 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="font-mono text-[10px]">NexoreUI v2.0</span>
        <Link
          href="/create"
          onClick={() => setMobileSidebarOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors text-[10px] font-medium"
        >
          Studio
        </Link>
      </div>
    </aside>
  );
}
