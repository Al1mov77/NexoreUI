"use client"

import React, { useState } from "react"
import { ChevronRight, Sparkles, Layers, Zap, Package } from "lucide-react"
import { cn } from "nexoreui"
import { NexoreLogo } from "./NexoreLogo"

interface SidebarItem {
  id: string
  name: string
}

interface SidebarGroup {
  title: string
  icon: React.ReactNode
  items: SidebarItem[]
}

interface SidebarProps {
  groups: SidebarGroup[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function Sidebar({ groups, activeTab, onTabChange }: SidebarProps) {
  const [openGroups, setOpenGroups] = useState<string[]>(
    groups.map(g => g.title) // all open by default
  )

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    )
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-[260px] bg-background/80 backdrop-blur-2xl border-r border-border overflow-y-auto hidden md:flex md:flex-col z-40">
      {/* ━━━ Logo Area ━━━ */}
      <div className="flex items-center gap-3 h-14 px-5 border-b border-border shrink-0">
        <NexoreLogo size={26} />
        <div className="flex items-center gap-2">
          <span className="font-bold text-[15px] tracking-tight bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            NexoreUI
          </span>
          <span className="inline-flex h-[18px] items-center rounded-full bg-gradient-to-r from-violet-500/15 to-purple-500/15 border border-violet-500/20 px-1.5 text-[9px] font-semibold text-violet-400 uppercase tracking-widest">
            Pro
          </span>
        </div>
      </div>

      {/* ━━━ Navigation ━━━ */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {groups.map((group) => {
          const isOpen = openGroups.includes(group.title)
          return (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70 hover:text-muted-foreground transition-colors"
              >
                <div className="flex items-center gap-2">
                  {group.icon}
                  {group.title}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-muted-foreground/40 tabular-nums">
                    {group.items.length}
                  </span>
                  <ChevronRight
                    className={cn(
                      "w-3 h-3 transition-transform duration-200 text-muted-foreground/40",
                      isOpen && "rotate-90"
                    )}
                  />
                </div>
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="space-y-0.5 ml-4 pl-3 border-l border-border/40 mt-1 mb-3">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                          "group/item w-full flex items-center text-left px-3 py-[6px] rounded-lg text-[13px] transition-all duration-200 relative",
                          isActive
                            ? "bg-primary/8 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        {/* Active indicator bar */}
                        {isActive && (
                          <span className="absolute -left-[13.5px] top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full bg-primary" />
                        )}
                        {item.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </nav>

      {/* ━━━ Footer ━━━ */}
      <div className="shrink-0 border-t border-border p-4">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground/50">
          <Package className="h-3 w-3" />
          <span>v0.1.0 · MIT License</span>
        </div>
      </div>
    </aside>
  )
}
