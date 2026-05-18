"use client"

import React, { useEffect, useState } from "react"
import { Github, Search, Command, Star } from "lucide-react"
import { ThemeToggle } from "../../../components/theme-toggle"
import { NexoreLogo } from "./NexoreLogo"

interface HeaderProps {
  onSearchOpen?: () => void
}

export function Header({ onSearchOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-background/60 backdrop-blur-2xl border-b border-border shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="flex h-14 items-center justify-between px-6">
        {/* Left: Logo (mobile only, desktop has sidebar) */}
        <div className="flex items-center gap-2 md:hidden">
          <NexoreLogo size={24} />
          <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            NexoreUI
          </span>
        </div>
        <div className="hidden md:block" />

        {/* Center: Premium Search */}
        <button
          onClick={onSearchOpen}
          className="group flex items-center gap-2.5 h-9 w-full max-w-[300px] rounded-xl border border-border/60 bg-muted/30 px-3.5 text-sm text-muted-foreground hover:bg-muted/50 hover:border-border transition-all duration-200"
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
          <span className="flex-1 text-left text-[13px]">Search components...</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded-md border border-border/60 bg-background/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground/60">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* GitHub with star count */}
          <a
            href="https://github.com/Al1mov77/NexoreUI"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg text-muted-foreground/70 hover:text-foreground hover:bg-muted/40 transition-all px-2.5"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline text-[12px] font-medium">Star</span>
            <span className="hidden sm:inline-flex h-5 items-center rounded-md bg-muted/60 px-1.5 text-[10px] font-semibold tabular-nums text-muted-foreground/70">
              <Star className="h-2.5 w-2.5 mr-0.5 fill-current text-amber-500" />
              142
            </span>
          </a>

          <div className="w-px h-4 bg-border/50 mx-1 hidden sm:block" />

          <ThemeToggle />

          <span className="hidden sm:inline-flex h-[22px] items-center rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/15 px-2 text-[10px] font-semibold text-violet-400/80 tracking-wide">
            v0.1.0
          </span>
        </div>
      </div>
    </header>
  )
}
