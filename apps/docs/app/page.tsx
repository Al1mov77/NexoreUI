"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, Layers, Zap, Search, X, Command, ChevronRight } from "lucide-react";
import { cn } from "nexoreui";

// Layout components
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";

// Section imports
import { ButtonSection } from "./components/sections/ButtonSection";
import { CardSection } from "./components/sections/CardSection";
import { InputSection } from "./components/sections/InputSection";
import { AlertSection } from "./components/sections/AlertSection";
import { ModalSection } from "./components/sections/ModalSection";
import { TooltipSection } from "./components/sections/TooltipSection";
import { TabsSection } from "./components/sections/TabsSection";
import { AccordionSection } from "./components/sections/AccordionSection";
import { BadgeSection } from "./components/sections/BadgeSection";
import { AvatarSection } from "./components/sections/AvatarSection";
import { SkeletonSection } from "./components/sections/SkeletonSection";
import { ProgressSection } from "./components/sections/ProgressSection";
import { SliderSection } from "./components/sections/SliderSection";
import { SpecialButtonsSection } from "./components/sections/SpecialButtonsSection";
import { SpecialCardsSection } from "./components/sections/SpecialCardsSection";
import { SpecialInputsSection } from "./components/sections/SpecialInputsSection";
import { SpecialAlertsSection } from "./components/sections/SpecialAlertsSection";
import { LoadersSection } from "./components/sections/LoadersSection";
import { TogglesSection } from "./components/sections/TogglesSection";
import { TypographySection } from "./components/sections/TypographySection";
import { DataDisplaySection } from "./components/sections/DataDisplaySection";
import { NavigationSection } from "./components/sections/NavigationSection";
import { ModalsSection } from "./components/sections/ModalsSection";
import { CookieSection } from "./components/sections/CookieSection";
import { DarkModeSection } from "./components/sections/DarkModeSection";
import { BlurFadeSection } from "./components/sections/BlurFadeSection";
import { BoxRevealSection } from "./components/sections/BoxRevealSection";
import { PremiumEffectsSection } from "./components/sections/PremiumEffectsSection";
import { ImageCompareSection } from "./components/sections/ImageCompareSection";
import { FilePreviewCardSection } from "./components/sections/FilePreviewCardSection";
import { InstallationSection } from "./components/sections/InstallationSection";
import { IconsSection } from "./components/sections/IconsSection";
import { ChartsSection } from "./components/sections/ChartsSection";
import { CommerceSection } from "./components/sections/CommerceSection";
import { SocialSection } from "./components/sections/SocialSection";

// Category definitions
const categories = [
  { id: "installation", name: "Getting Started", sections: [<InstallationSection key="1" />] },
  { id: "icons", name: "Icon Library", sections: [<IconsSection key="1" />] },
  { id: "buttons", name: "Buttons", sections: [<ButtonSection key="1" />, <SpecialButtonsSection key="2" />] },
  { id: "cards", name: "Cards", sections: [<CardSection key="1" />, <SpecialCardsSection key="2" />] },
  { id: "inputs", name: "Inputs", sections: [<InputSection key="1" />, <SpecialInputsSection key="2" />] },
  { id: "modals", name: "Modals & Dialogs", sections: [<ModalSection key="1" />, <ModalsSection key="2" />] },
  { id: "alerts", name: "Alerts & Toasts", sections: [<AlertSection key="1" />, <SpecialAlertsSection key="2" />] },
  { id: "avatars", name: "Avatars", sections: [<AvatarSection key="1" />] },
  { id: "badges", name: "Badges", sections: [<BadgeSection key="1" />] },
  { id: "loaders", name: "Loaders", sections: [<LoadersSection key="1" />] },
  { id: "toggles", name: "Toggles", sections: [<TogglesSection key="1" />] },
  { id: "typography", name: "Typography", sections: [<TypographySection key="1" />] },
  { id: "data-display", name: "Data Display", sections: [<DataDisplaySection key="1" />, <SkeletonSection key="2" />] },
  { id: "navigation", name: "Navigation", sections: [<NavigationSection key="1" />, <TabsSection key="2" />, <AccordionSection key="3" />] },
  { id: "tooltips", name: "Tooltips", sections: [<TooltipSection key="1" />] },
  { id: "progress", name: "Progress & Sliders", sections: [<ProgressSection key="1" />, <SliderSection key="2" />] },
  { id: "effects", name: "Effects & Motions", sections: [<BlurFadeSection key="1" />, <BoxRevealSection key="2" />, <PremiumEffectsSection key="3" />] },
  { id: "media", name: "Media & Content", sections: [<ImageCompareSection key="1" />, <FilePreviewCardSection key="2" />] },
  { id: "charts", name: "Charts & Data", sections: [<ChartsSection key="1" />] },
  { id: "social", name: "Social & Chat", sections: [<SocialSection key="1" />] },
  { id: "commerce", name: "Commerce", sections: [<CommerceSection key="1" />] },
  { id: "utilities", name: "Utilities", sections: [<CookieSection key="1" />, <DarkModeSection key="2" />] },
];

// Sidebar group definitions
const sidebarGroups = [
  {
    title: "Getting Started",
    icon: <Sparkles className="w-3.5 h-3.5 text-violet-500" />,
    items: categories.filter(c => c.id === "installation" || c.id === "icons"),
  },
  {
    title: "Components",
    icon: <Layers className="w-3.5 h-3.5 text-violet-500" />,
    items: categories.filter(
      c => !["installation", "icons", "effects", "media", "charts", "social", "commerce", "utilities"].includes(c.id)
    ),
  },
  {
    title: "Pro",
    icon: <Zap className="w-3.5 h-3.5 text-amber-500" />,
    items: categories.filter(
      c => ["effects", "media", "charts", "social", "commerce", "utilities"].includes(c.id)
    ),
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("installation");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeCategory = categories.find((c) => c.id === activeTab) || categories[0];

  // Cmd+K to open search
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

  const filteredCategories = searchQuery
    ? categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : categories;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <Sidebar
        groups={sidebarGroups}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id)}
      />

      {/* Main Content */}
      <div className="md:ml-[260px] min-h-screen flex flex-col relative">
        {/* ━━━ Ambient Background Glow ━━━ */}
        <div className="pointer-events-none fixed inset-0 md:left-[260px] overflow-hidden z-0">
          <div className="absolute -top-[300px] right-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/[0.03] blur-[100px] animate-glow-pulse" />
          <div className="absolute top-[40%] -left-[200px] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.02] blur-[120px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.02] blur-[100px] animate-glow-pulse" style={{ animationDelay: "4s" }} />
        </div>

        {/* Header */}
        <Header onSearchOpen={() => setSearchOpen(true)} />

        {/* Content */}
        <main className="flex-1 relative z-10">
          <div className="max-w-5xl mx-auto px-6 py-10 lg:px-10 lg:py-12">
            {/* ━━━ Page Header ━━━ */}
            <div className="mb-12 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest">
                  Documentation
                </span>
                <span className="text-muted-foreground/30">/</span>
                <span className="text-[11px] font-medium text-primary/70 uppercase tracking-widest">
                  {activeCategory.name}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {activeCategory.name}
              </h1>
              <p className="text-[15px] text-muted-foreground mt-2 max-w-xl leading-relaxed">
                Explore the {activeCategory.name.toLowerCase()} from the NexoreUI component library.
              </p>
              <div className="mt-6 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
            </div>

            {/* ━━━ Sections ━━━ */}
            <div className="space-y-16">
              {activeCategory.sections.length > 0 ? (
                activeCategory.sections
              ) : (
                <div className="text-center py-20 border border-dashed border-border/60 rounded-2xl bg-muted/5">
                  <div className="text-muted-foreground/40 mb-3">
                    <Layers className="h-10 w-10 mx-auto" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Components for this category are coming soon.
                  </p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    Check back later for updates.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ━━━ Search Modal ━━━ */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          />
          {/* Modal */}
          <div className="relative w-full max-w-[520px] mx-4 bg-card/95 backdrop-blur-2xl border border-border/60 rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 border-b border-border/50">
              <Search className="h-4 w-4 text-primary/60 shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-13 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/50 font-medium"
                placeholder="Search components..."
              />
              <kbd className="inline-flex h-6 select-none items-center rounded-md border border-border/50 bg-muted/30 px-2 font-mono text-[10px] font-medium text-muted-foreground/50">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[320px] overflow-y-auto p-2">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveTab(cat.id);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-150 text-left group",
                      cat.id === activeTab
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50 text-foreground"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg border transition-colors",
                      cat.id === activeTab
                        ? "border-primary/20 bg-primary/10"
                        : "border-border/50 bg-muted/30 group-hover:border-border"
                    )}>
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-[13px]">{cat.name}</span>
                      <span className="block text-[11px] text-muted-foreground/50 mt-0.5 truncate">
                        {cat.sections.length} component{cat.sections.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                  </button>
                ))
              ) : (
                <div className="text-center py-10">
                  <Search className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground/60 font-medium">
                    No components found for &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-4 px-5 py-3 border-t border-border/40 bg-muted/10">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40">
                <kbd className="inline-flex h-4 items-center rounded border border-border/40 bg-muted/20 px-1 font-mono text-[9px]">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40">
                <kbd className="inline-flex h-4 items-center rounded border border-border/40 bg-muted/20 px-1 font-mono text-[9px]">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40">
                <kbd className="inline-flex h-4 items-center rounded border border-border/40 bg-muted/20 px-1 font-mono text-[9px]">esc</kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
