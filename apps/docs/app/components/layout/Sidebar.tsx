"use client";

import React from "react";
import {
  BookOpen, Puzzle, Crown, Wand2, Package,
  MousePointer2, Type, Layout, Palette,
  Sparkles, CircleDot, Layers, Box, MessageSquare,
  Loader, Image, Star, SlidersHorizontal, ToggleLeft, Navigation,
  ListOrdered, Upload, Table2, BarChart, Eye, ShoppingBag,
  Cookie, Zap
} from "lucide-react";
import { NexoreLogo } from "./NexoreLogo";
import Link from "next/link";
import { motion } from "framer-motion";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    title: "Getting Started",
    items: [
      { id: "installation", label: "Installation", icon: BookOpen },
    ],
  },
  {
    title: "Components",
    items: [
      { id: "button", label: "Button", icon: MousePointer2 },
      { id: "input", label: "Input", icon: Type },
      { id: "card", label: "Card", icon: Layout },
      { id: "badge", label: "Badge", icon: Palette },
      { id: "alert", label: "Alert", icon: Sparkles },
      { id: "avatar", label: "Avatar", icon: CircleDot },
      { id: "accordion", label: "Accordion", icon: Layers },
      { id: "modal", label: "Modal / Dialog", icon: Box },
      { id: "tooltip", label: "Tooltip", icon: MessageSquare },
      { id: "tabs", label: "Tabs", icon: Layout },
      { id: "progress", label: "Progress", icon: Loader },
      { id: "skeleton", label: "Skeleton", icon: Image },
      { id: "slider", label: "Slider", icon: SlidersHorizontal },
      { id: "switch", label: "Switch", icon: ToggleLeft },
      { id: "rating", label: "Rating", icon: Star },
      { id: "command", label: "Command", icon: Type },
      { id: "table", label: "Table", icon: Table2 },
      { id: "stepper", label: "Stepper", icon: ListOrdered },
      { id: "scroll-area", label: "Scroll Area", icon: Layers },
      { id: "file-upload", label: "File Upload", icon: Upload },
      { id: "navigation", label: "Navigation", icon: Navigation },
      { id: "icons", label: "Icons", icon: Puzzle },
      { id: "dock", label: "Dock", icon: Package },
    ],
  },
  {
    title: "Pro",
    items: [
      { id: "charts", label: "Charts", icon: BarChart },
      { id: "data-display", label: "Data Display", icon: Layers },
      { id: "dark-mode", label: "Dark Mode Toolkit", icon: Eye },
      { id: "commerce", label: "Commerce", icon: ShoppingBag },
      { id: "cookie", label: "Cookie Consent", icon: Cookie },
      { id: "social", label: "Social", icon: MessageSquare },
      { id: "premium-effects", label: "Premium Effects", icon: Zap },
      { id: "loaders", label: "Loaders", icon: Loader },
    ],
  },
  {
    title: "Animated",
    items: [
      { id: "marquee", label: "Marquee", icon: Sparkles },
      { id: "number-ticker", label: "Number Ticker", icon: BarChart },
      { id: "animated-number", label: "Animated Number", icon: BarChart },
      { id: "typing-animation", label: "Typing Animation", icon: Type },
      { id: "blur-fade", label: "Blur Fade", icon: Eye },
      { id: "box-reveal", label: "Box Reveal", icon: Box },
      { id: "file-preview-card", label: "File Preview Card", icon: Image },
      { id: "image-compare", label: "Image Compare", icon: Image },
    ],
  },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

export default function Sidebar({ activeSection, onSectionChange, className = "" }: SidebarProps) {
  return (
    <aside className={`w-[220px] border-r border-border bg-background overflow-y-auto flex flex-col ${className}`}>
      {/* Logo */}
      <div className="flex items-center gap-2 h-14 px-4 border-b border-border shrink-0">
        <NexoreLogo size={20} />
        <span className="font-semibold text-sm tracking-tight">NexoreUI</span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">v0.1.2</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {sidebarGroups.map((group) => (
          <div key={group.title} className="mb-4">
            <h4 className="px-3 mb-1 text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              {group.title}
            </h4>
            <div className="space-y-[2px]">
              {group.items.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.id === "installation" ? "/docs/installation" : `/docs/components/${item.id}`}
                    onClick={() => onSectionChange(item.id)}
                    className={`relative w-full flex items-center gap-2.5 text-left px-3 py-1.5 rounded-md text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-sidebar-highlight"
                        className="absolute inset-0 bg-primary/10 border-l-2 border-primary rounded-md pointer-events-none"
                        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                      />
                    )}
                    <Icon size={14} className="relative z-10 shrink-0 opacity-70" />
                    <span className="relative z-10 truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-4 py-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Package size={11} />
          <span>MIT License</span>
        </div>
      </div>
    </aside>
  );
}
