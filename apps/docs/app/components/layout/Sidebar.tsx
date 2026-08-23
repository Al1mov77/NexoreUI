"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown, Sparkles, Wand2, Package, Layers, Plus, Terminal, Search, X
} from "lucide-react";
import { NexoreLogo } from "./NexoreLogo";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { sidebarGroups, topLevelNavItems, TOTAL_COMPONENTS_COUNT } from "../../config/navigation";
import { useThemeCustomizer } from "../../context/ThemeCustomizerContext";
import { useLayout } from "../../LayoutClient";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

export default function Sidebar({ activeSection, onSectionChange, className = "" }: SidebarProps) {
  const { themeColor } = useThemeCustomizer();
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
    feedback: false,
    ai: true,
    animated: false,
    pro: false,
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
        <Link href="/" className="flex items-center gap-2">
          <NexoreLogo size={18} />
          <span className="font-semibold text-sm tracking-tight text-foreground">NexoreUI</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            {TOTAL_COMPONENTS_COUNT} comps
          </span>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Action Button: Create Project Studio */}
      <div className="px-3 pt-3 pb-2 shrink-0 space-y-2">
        <Link
          href="/create"
          onClick={() => setMobileSidebarOpen(false)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/15 border border-primary/20 text-xs font-semibold text-primary transition-all hover:scale-[1.01] active:scale-[0.99] group shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Wand2 className="h-3.5 w-3.5 text-primary group-hover:rotate-12 transition-transform" />
            <span>Create Project</span>
          </div>
          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-primary text-primary-foreground font-bold">
            Studio
          </span>
        </Link>

        {/* Quick Search Filter */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Quick filter..."
            className="w-full h-8 pl-8 pr-7 text-xs bg-muted/40 border border-border/80 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery("")}
              className="absolute right-2 top-2 p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Scrollable Area */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-4 text-sm">
        {/* Top-Level Items (Installation, Overview, Icons) - Only if not filtering */}
        {!filterQuery && (
          <div className="space-y-0.5 border-b border-border/60 pb-3">
            {topLevelNavItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
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
                  className={`relative w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-sidebar-highlight"
                      className="absolute inset-0 bg-primary/10 border-l-2 border-primary rounded-lg pointer-events-none"
                      transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                    />
                  )}
                  <div className="flex items-center gap-2 relative z-10">
                    <Icon className="h-4 w-4 shrink-0 opacity-80" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Categorized Groups with Accordion */}
        <div className="space-y-3">
          <div className="px-2 flex items-center justify-between text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
            <span>Categories</span>
            <span className="text-[10px] font-mono text-muted-foreground/50">{filteredGroups.length} groups</span>
          </div>

          {filteredGroups.map((group) => {
            const isExpanded = expandedGroups[group.id] ?? false;
            const hasActiveChild = group.items.some((i) => i.id === activeSection);
            const GroupIcon = group.icon || Layers;

            return (
              <div key={group.id} className="space-y-1">
                {/* Category Accordion Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors group ${
                    hasActiveChild ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GroupIcon className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
                    <span>{group.title}</span>
                    {group.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        {group.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground/60">
                    <span className="text-[10px] font-mono opacity-60 group-hover:opacity-100">
                      {group.items.length}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
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
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden pl-2 border-l border-border/40 ml-3 space-y-0.5"
                    >
                      {group.items.map((item) => {
                        const isActive = activeSection === item.id;
                        const ItemIcon = item.icon;

                        return (
                          <Link
                            key={item.id}
                            href={`/docs/components/${item.id}`}
                            onClick={() => {
                              onSectionChange(item.id);
                              setMobileSidebarOpen(false);
                            }}
                            className={`relative w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors duration-150 ${
                              isActive
                                ? "text-primary font-medium bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                            }`}
                          >
                            <div className="flex items-center gap-2 relative z-10 truncate">
                              <ItemIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.isNew && (
                              <span className="relative z-10 text-[9px] font-bold px-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                AI
                              </span>
                            )}
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

      {/* Footer info */}
      <div className="shrink-0 border-t border-border px-3 py-2.5 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px]">Theme: {themeColor}</span>
        </div>
        <Link
          href="/create"
          onClick={() => setMobileSidebarOpen(false)}
          className="text-muted-foreground hover:text-primary transition-colors text-[10px] font-medium"
        >
          Studio
        </Link>
      </div>
    </aside>
  );
}
