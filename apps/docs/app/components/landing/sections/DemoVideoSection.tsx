"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

export function DemoVideoSection() {
  return (
    <section
      id="demo"
      className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden border-b border-border/60 bg-muted/20 dark:bg-zinc-950/40 select-none transition-colors duration-300"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(0,0,0,0.03),transparent_75%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(255,255,255,0.04),transparent_75%)]" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10 text-center">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground block">
            Product Walkthrough
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.035em] text-foreground leading-[1.08] text-balance">
            See NexoreUI in action
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            A concise architectural tour: core components, visual builder, and instant Next.js production code exports.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="group relative rounded-2xl border border-zinc-200/90 dark:border-white/10 bg-zinc-950 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12),0_8px_20px_-8px_rgba(0,0,0,0.06)] dark:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-300">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-30" />

            <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
              <iframe
                src="https://www.youtube-nocookie.com/embed/0mJizbAG_hc?rel=0&modestbranding=1"
                title="NexoreUI Product Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/docs/components"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-foreground text-background font-semibold text-xs shadow-md transition-opacity hover:opacity-90 cursor-pointer"
          >
            <span>Explore All Components</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/nexoremake"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-border/80 bg-card hover:bg-muted font-semibold text-xs text-foreground transition-colors shadow-xs cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Launch Nexore Make</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DemoVideoSection;
