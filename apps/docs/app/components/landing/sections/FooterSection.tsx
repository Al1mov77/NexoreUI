"use client";

import React from "react";
import Link from "next/link";
import { Github, BookOpen, Package } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="py-12 px-6 border-t border-border/50 relative z-10 bg-background/80">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-semibold text-foreground">NexoreUI</span>
          <span className="text-xs text-muted-foreground">
            Open source under the MIT License • Support:{" "}
            <a href="mailto:nexoreuiteam@mail.ru" className="font-mono text-foreground hover:underline">
              nexoreuiteam@mail.ru
            </a>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground" aria-label="Footer navigation">
          <Link
            href="/pricing"
            className="hover:text-foreground font-semibold text-foreground transition-colors"
          >
            Pricing & Plans
          </Link>
          <Link
            href="/terms"
            className="hover:text-foreground font-semibold text-foreground transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/support"
            className="hover:text-foreground font-semibold text-foreground transition-colors"
          >
            Support
          </Link>
          <Link
            href="/templates"
            className="hover:text-foreground transition-colors text-amber-500 font-medium"
          >
            Templates
          </Link>
          <Link
            href="/docs/installation"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <BookOpen size={13} />
            Documentation
          </Link>
          <a
            href="https://github.com/Al1mov77/NexoreUI"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Github size={13} />
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/nexoreui"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Package size={13} />
            npm
          </a>
          <Link
            href="/privacy"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
        </nav>

        <span className="text-xs text-muted-foreground select-none">
          © 2026 NexoreUI • чекап
        </span>
      </div>
    </footer>
  );
}

export default FooterSection;
