"use client";

import React from "react";
import Link from "next/link";
import { Github, BookOpen, Package } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="py-12 px-6 border-t border-border/50 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="text-sm font-semibold text-foreground">NexoreUI</span>
          <span className="text-xs text-muted-foreground">
            Open source under the MIT License.
          </span>
        </div>

        <nav className="flex items-center gap-6 text-xs text-muted-foreground" aria-label="Footer navigation">
          <a
            href="https://github.com/Al1mov77/NexoreUI"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Github size={13} />
            GitHub
          </a>
          <Link
            href="/docs/installation"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <BookOpen size={13} />
            Documentation
          </Link>
          <a
            href="https://www.npmjs.com/package/nexoreui"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Package size={13} />
            npm
          </a>
        </nav>

        <span className="text-xs text-muted-foreground">© 2026 NexoreUI</span>
      </div>
    </footer>
  );
}
