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

import { sidebarGroups } from "../../config/navigation";

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
