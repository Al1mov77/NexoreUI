"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Input, Button } from "nexoreui";
import { Search, Copy, Check, SlidersHorizontal } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Build the full icon registry from lucide-react exports
const ICON_ENTRIES: { name: string; Icon: React.ElementType }[] = (() => {
  const skipKeys = new Set([
    "createLucideIcon",
    "default",
    "icons",
    "Icon",
    "createElement",
    "LucideIcon",
    "LucideProps",
  ]);

  return Object.entries(LucideIcons)
    .filter(([key, val]) => {
      if (skipKeys.has(key)) return false;
      if (typeof val !== "function" && typeof val !== "object") return false;
      // Only PascalCase component names
      if (!/^[A-Z]/.test(key)) return false;
      return true;
    })
    .map(([name, Icon]) => ({ name, Icon: Icon as React.ElementType }));
})();

// Category definitions with keyword matchers
const CATEGORIES: { label: string; keywords: string[] }[] = [
  { label: "All", keywords: [] },
  { label: "Arrows", keywords: ["arrow", "chevron", "move", "corner", "align"] },
  { label: "Media", keywords: ["play", "pause", "volume", "music", "video", "camera", "image", "film", "mic", "speaker", "headphone", "radio"] },
  { label: "Communication", keywords: ["mail", "message", "phone", "chat", "send", "inbox", "bell", "megaphone", "at-sign"] },
  { label: "Files", keywords: ["file", "folder", "document", "clipboard", "archive", "paperclip", "notebook"] },
  { label: "Weather", keywords: ["sun", "moon", "cloud", "wind", "rain", "snow", "thermometer", "umbrella", "droplet", "rainbow"] },
  { label: "Shapes", keywords: ["circle", "square", "triangle", "diamond", "hexagon", "octagon", "pentagon", "star", "heart"] },
  { label: "Development", keywords: ["code", "terminal", "git", "bug", "database", "server", "cpu", "hard-drive", "binary", "braces", "brackets"] },
  { label: "Security", keywords: ["lock", "unlock", "shield", "key", "eye", "fingerprint", "scan"] },
  { label: "Layout", keywords: ["layout", "grid", "columns", "rows", "sidebar", "panel", "split", "maximize", "minimize"] },
  { label: "Commerce", keywords: ["cart", "shop", "credit", "wallet", "receipt", "tag", "dollar", "percent", "coins", "banknote"] },
  { label: "Social", keywords: ["user", "users", "person", "group", "contact", "share", "thumb", "hand", "heart"] },
];

function matchesCategory(iconName: string, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const lowerName = iconName.toLowerCase();
  return keywords.some((kw) => lowerName.includes(kw));
}

export function IconsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [iconSize, setIconSize] = useState(24);
  const [iconColor, setIconColor] = useState("#a1a1aa");
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [page, setPage] = useState(1);
  const iconsPerPage = 120;

  const filteredIcons = useMemo(() => {
    let results = ICON_ENTRIES;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((entry) =>
        entry.name.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      const cat = CATEGORIES.find((c) => c.label === selectedCategory);
      if (cat) {
        results = results.filter((entry) =>
          matchesCategory(entry.name, cat.keywords)
        );
      }
    }

    return results;
  }, [searchQuery, selectedCategory]);

  const paginatedIcons = useMemo(() => {
    return filteredIcons.slice(0, page * iconsPerPage);
  }, [filteredIcons, page]);

  const hasMore = paginatedIcons.length < filteredIcons.length;

  const handleCopy = useCallback((iconName: string) => {
    const code = `import { ${iconName} } from "lucide-react"\n\n<${iconName} />`;
    navigator.clipboard.writeText(code);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  }, []);

  // Reset page when filters change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  }, []);

  return (
    <section id="icons" className="space-y-8 scroll-mt-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Icon Library</h2>
          <p className="text-muted-foreground">
            Browse {ICON_ENTRIES.length.toLocaleString()} icons from{" "}
            <a
              href="https://lucide.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              Lucide React
            </a>
            . Click any icon to copy its import code.
          </p>
        </div>
      </div>

      {/* Installation */}
      <div className="rounded-xl border border-border/50 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <code className="text-sm text-emerald-400 font-mono">
            npm install lucide-react
          </code>
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white h-8"
            onClick={() => {
              navigator.clipboard.writeText("npm install lucide-react");
            }}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 px-4"
              onClick={() => setShowSettings(!showSettings)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Customize
            </Button>
            <div className="flex items-center px-3 rounded-xl border border-border/50 bg-card/50 text-sm text-muted-foreground tabular-nums">
              {filteredIcons.length.toLocaleString()} icon{filteredIcons.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Customization Panel */}
        {showSettings && (
          <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Size</label>
              <input
                type="range"
                min={14}
                max={48}
                value={iconSize}
                onChange={(e) => setIconSize(Number(e.target.value))}
                className="w-28 accent-primary"
              />
              <span className="text-xs text-muted-foreground tabular-nums w-8">{iconSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Color</label>
              <input
                type="color"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
                className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer bg-transparent"
              />
              <span className="text-xs text-muted-foreground font-mono">{iconColor}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => {
                setIconSize(24);
                setIconColor("#a1a1aa");
              }}
            >
              Reset
            </Button>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => handleCategoryChange(cat.label)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                selectedCategory === cat.label
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Icon Grid */}
      {filteredIcons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No icons found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Try a different search term or category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
          {paginatedIcons.map((entry) => {
            const IconComp = entry.Icon;
            const isCopied = copiedIcon === entry.name;
            return (
              <button
                key={entry.name}
                onClick={() => handleCopy(entry.name)}
                className="group relative flex flex-col items-center justify-center p-3 rounded-xl border border-transparent hover:border-border/80 bg-transparent hover:bg-card/60 transition-all duration-200 cursor-pointer"
                title={entry.name}
              >
                <div className="relative">
                  {isCopied ? (
                    <Check
                      className="text-emerald-500 transition-all"
                      style={{ width: iconSize, height: iconSize }}
                    />
                  ) : (
                    <IconComp
                      style={{
                        width: iconSize,
                        height: iconSize,
                        color: iconColor,
                      }}
                      className="transition-colors group-hover:text-foreground"
                    />
                  )}
                </div>
                <span className="mt-1.5 text-[10px] text-muted-foreground/70 group-hover:text-foreground truncate w-full text-center leading-tight transition-colors">
                  {entry.name}
                </span>

                {/* Copy indicator overlay */}
                {isCopied && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-in fade-in-0 duration-150">
                    <span className="text-[9px] font-medium text-emerald-500">Copied!</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            className="px-8"
          >
            Load more icons ({(filteredIcons.length - paginatedIcons.length).toLocaleString()} remaining)
          </Button>
        </div>
      )}
    </section>
  );
}
