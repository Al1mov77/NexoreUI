"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

function BlurFade({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const [copied, setCopied] = useState(false);
  const installCommand = "pnpm add nexoreui";

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 6 Live Showcase Components directly on the Hero
  const componentShowcases = [
    {
      id: "button",
      name: "Animated Button",
      desc: "Tactile spring response and scale transitions.",
      render: () => {
        const [clicks, setClicks] = useState(0);
        return (
          <button 
            onClick={(e) => { e.preventDefault(); setClicks(c => c + 1); }}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 active:scale-95 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.15)] cursor-pointer"
          >
            Clicked {clicks} times
          </button>
        );
      }
    },
    {
      id: "button",
      name: "Shimmer Effect",
      desc: "Premium looping sweep animation layout.",
      render: () => (
        <button 
          onClick={(e) => e.preventDefault()}
          className="relative overflow-hidden px-5 py-2 rounded-lg bg-zinc-900 border border-border text-white text-xs font-semibold cursor-pointer"
        >
          <span className="relative z-10">Shimmer</span>
          <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-text" style={{ transform: 'skewX(-20deg)', animationDuration: '2.5s' }} />
        </button>
      )
    },
    {
      id: "button",
      name: "Glow Accent",
      desc: "Subtle surrounding drop-shadow illumination.",
      render: () => (
        <button 
          onClick={(e) => e.preventDefault()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-[0_0_15px_var(--color-primary)] border border-primary/20 cursor-pointer"
        >
          Glowing Button
        </button>
      )
    },
    {
      id: "input",
      name: "Text Input",
      desc: "Clean input field with state-aware active rings.",
      render: () => (
        <input 
          type="text" 
          placeholder="Type here..."
          onClick={(e) => e.preventDefault()}
          className="w-32 px-3 py-1.5 rounded-lg border border-border bg-card/60 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-foreground"
        />
      )
    },
    {
      id: "input",
      name: "Password Mode",
      desc: "Hidden characters with toggle show logic.",
      render: () => {
        const [show, setShow] = useState(false);
        return (
          <div className="relative w-36">
            <input 
              type={show ? "text" : "password"} 
              value="secret123"
              readOnly
              onClick={(e) => e.preventDefault()}
              className="w-full pl-3 pr-10 py-1.5 rounded-lg border border-border bg-card/60 text-xs focus:outline-none text-foreground"
            />
            <button 
              onClick={(e) => { e.preventDefault(); setShow(!show); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground hover:text-foreground select-none cursor-pointer"
            >
              {show ? "HIDE" : "SHOW"}
            </button>
          </div>
        );
      }
    },
    {
      id: "table",
      name: "Data Table",
      desc: "High density structured table layouts.",
      render: () => (
        <div className="border border-border rounded-lg bg-card/50 overflow-hidden text-left text-[10px] w-40">
          <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-2 py-1 font-semibold text-muted-foreground">
            <span>Name</span>
            <span>Status</span>
          </div>
          <div className="grid grid-cols-2 px-2 py-1 border-b border-border/40 text-foreground">
            <span>User A</span>
            <span className="text-emerald-500 font-medium">Active</span>
          </div>
          <div className="grid grid-cols-2 px-2 py-1 text-foreground">
            <span>User B</span>
            <span className="text-muted-foreground">Pending</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-24 overflow-hidden select-none demo-grid-pattern">
      <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
        {/* Badge */}
        <BlurFade delay={0.05}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-md text-xs text-muted-foreground hover:text-foreground transition-all hover:scale-102 cursor-pointer mb-8 shadow-sm">
            <span>Introducing NexoreUI v1.0.0</span>
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
          </div>
        </BlurFade>

        {/* Title */}
        <BlurFade delay={0.1}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-3xl leading-tight">
            Build beautiful user interfaces faster.
          </h1>
        </BlurFade>

        {/* Subtitle */}
        <BlurFade delay={0.15}>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed font-normal">
            Modern, animated, and production-ready primitives built with React, Radix UI and Tailwind CSS. Copy, paste, customize, and ship.
          </p>
        </BlurFade>

        {/* CTA Buttons */}
        <BlurFade delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Link
              href="/docs/installation"
              className="relative group w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-[0_4px_25px_var(--color-primary)] hover:scale-102 cursor-pointer overflow-visible"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-xl border border-border bg-card/50 backdrop-blur-md text-foreground text-sm font-semibold hover:bg-muted hover:scale-102 active:scale-[0.98] transition-all cursor-pointer"
            >
              Browse Components
            </a>
          </div>
        </BlurFade>

        {/* Install Command */}
        <BlurFade delay={0.25}>
          <div 
            onClick={handleCopy}
            className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-lg border border-border bg-card/60 backdrop-blur-md text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-all hover:border-primary/40 mb-16 shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">$</span>
              <span>{installCommand}</span>
            </div>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </div>
        </BlurFade>
      </div>

      {/* Component Showcase Grid */}
      <BlurFade delay={0.3}>
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 z-10">
          {componentShowcases.map((comp) => {
            const CompRender = comp.render;
            return (
              <div key={comp.id} className="h-full">
                <Link 
                  href={`/docs/components/${comp.id}`}
                  className="group relative rounded-xl border border-border bg-card/40 p-5 flex flex-col justify-between items-center text-center gap-4 hover:border-primary/40 hover:bg-card/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] hover:-translate-y-1.5 h-full"
                >
                  <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/2 blur-xl transition-all duration-300 -z-10" />
                  
                  <div className="w-full flex flex-col items-center">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{comp.name}</span>
                    <span className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">{comp.desc}</span>
                  </div>
                  
                  <div className="h-16 flex items-center justify-center w-full">
                    <CompRender />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </BlurFade>
    </section>
  );
}
