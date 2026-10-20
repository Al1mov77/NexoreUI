"use client";

import React from "react";
import Link from "next/link";
import { Github, BookOpen, Package } from "lucide-react";

export function FooterSection() {
  const letters = ["N", "E", "X", "O", "R", "E", "U", "I"];

  return (
    <footer className="pt-16 pb-8 px-6 border-t border-border/50 relative z-10 bg-background/80 overflow-hidden">
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
          © 2026 NexoreUI
        </span>
      </div>

      {/* ─── Large Aesthetic NEXOREUI Wordmark with Letter Hover ─── */}
      <div className="max-w-6xl mx-auto pt-16 pb-2 select-none overflow-hidden border-t border-border/30 mt-12">
        <div className="relative flex justify-center items-center">
          <div
            className="text-[13vw] sm:text-[14.5vw] font-black tracking-[-0.05em] leading-none text-zinc-900/10 dark:text-white/[0.04] transition-colors duration-700 select-none cursor-default text-center flex justify-between w-full"
            aria-label="NexoreUI"
          >
            {letters.map((letter, idx) => (
              <span
                key={idx}
                className="inline-block transition-all duration-300 hover:-translate-y-2 hover:text-foreground dark:hover:text-white hover:drop-shadow-[0_8px_24px_rgba(255,255,255,0.15)]"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
