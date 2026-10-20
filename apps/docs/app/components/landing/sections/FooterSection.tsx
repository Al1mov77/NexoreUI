"use client";

import React from "react";
import Link from "next/link";
import { Github, Package } from "lucide-react";
import { NexoreLogo } from "../../layout/NexoreLogo";

export function FooterSection() {
  const letters = ["N", "E", "X", "O", "R", "E", "U", "I"];

  return (
    <footer className="border-t border-border/50 bg-background/95 relative z-10 pt-16 pb-8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top: 4-Column Architectural Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-border/40">
          {/* Brand Info (col-span-5) */}
          <div className="col-span-2 md:col-span-5 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <NexoreLogo size={20} />
              <span className="font-bold text-base tracking-tight text-foreground">
                Nexore<span className="text-zinc-500 dark:text-zinc-400 font-black">UI</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Handcrafted React components built on Radix UI and Tailwind CSS v4.
              Copy-paste into your project — free, open source, no lock-in.
            </p>
            <div className="pt-1 text-xs text-muted-foreground">
              <span>Support & Contact: </span>
              <a
                href="mailto:nexoreuiteam@mail.ru"
                className="font-mono text-foreground hover:underline transition-colors"
              >
                nexoreuiteam@mail.ru
              </a>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block">
              Product
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/docs/components" className="text-muted-foreground hover:text-foreground transition-colors">
                  Components
                </Link>
              </li>
              <li>
                <Link href="/docs/icons" className="text-muted-foreground hover:text-foreground transition-colors">
                  Icons
                </Link>
              </li>
              <li>
                <Link href="/nexoremake" className="text-muted-foreground hover:text-foreground transition-colors">
                  Nexore Make
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                  Create Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal & Plans */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block">
              Legal & Plans
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/docs/installation" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div className="col-span-2 md:col-span-2 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block">
              Community
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/Al1mov77/NexoreUI"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github size={13} />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/nexoreui"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Package size={13} />
                  <span>npm</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Info */}
        <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 NexoreUI. Open source under the MIT License.</span>
          <span>Built with Next.js & Tailwind CSS v4</span>
        </div>

        {/* ─── Large Aesthetic NEXOREUI Wordmark with Letter Hover ─── */}
        <div className="pt-10 pb-2 select-none overflow-hidden">
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
      </div>
    </footer>
  );
}

export default FooterSection;
