"use client";

import React, { useEffect, useState } from "react";
import { Github, Search, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

interface HeaderProps {
  onSearchOpen?: () => void;
  onToggleSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export function Header({ onSearchOpen, onToggleSidebar, isMobileSidebarOpen }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        {/* Mobile menu */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="mr-2 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
          >
            {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        {/* Logo — mobile only */}
        <div className="flex items-center gap-2 md:hidden">
          <span className="font-semibold text-sm">NexoreUI</span>
        </div>

        {/* Spacer for desktop (sidebar has logo) */}
        <div className="hidden md:block" />

        {/* Search */}
        <div className="flex-1 flex justify-center max-w-md mx-auto">
          <button
            onClick={onSearchOpen}
            className="inline-flex items-center gap-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline-flex flex-1 text-left">Search components...</span>
            <span className="sm:hidden flex-1 text-left">Search...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/Al1mov77/NexoreUI"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
