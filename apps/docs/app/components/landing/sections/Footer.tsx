"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border bg-card/40 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>© 2026 NexoreUI. Open source under the MIT License.</span>
        <div className="flex gap-4">
          <a 
            href="https://github.com/Al1mov77/NexoreUI" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a 
            href="/docs/installation" 
            className="hover:text-foreground transition-colors"
          >
            Documentation
          </a>
        </div>
      </div>
    </footer>
  );
}
