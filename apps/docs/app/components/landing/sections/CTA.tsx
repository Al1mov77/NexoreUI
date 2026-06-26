"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 px-6 border-t border-border bg-card/10 relative z-10 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Subtle glow behind container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-primary/5 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto flex flex-col items-center relative">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Start Building Modern Interfaces
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
          Take your developer experience and design quality to the next level. Install and copy components in seconds.
        </p>

        <Link
          href="/docs/installation"
          className="group relative inline-flex items-center justify-center h-12 px-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-[0_5px_30px_rgba(99,102,241,0.2)] hover:scale-102 cursor-pointer animate-fade-in"
        >
          Start Building
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
