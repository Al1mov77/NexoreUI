"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Terminal, Copy, Check } from "lucide-react";
import { TemplatesMarquee } from "../hero/TemplatesMarquee";
import { copyToClipboard } from "../../../utils/clipboard";
import { Button } from "nexoreui";

// Mini interactive demos shown in the hero grid
const componentShowcases = [
  {
    id: "button",
    name: "Animated Button",
    desc: "Micro-interactions and state-aware feedback.",
    render: function ButtonDemo() {
      const [clicks, setClicks] = useState(0);
      return (
        <Button
          size="sm"
          onClick={(e) => { e.preventDefault(); setClicks((c) => c + 1); }}
          className="text-xs font-semibold cursor-pointer"
        >
          Clicked {clicks} times
        </Button>
      );
    },
  },
  {
    id: "badge",
    name: "Status Badge",
    desc: "Clean indicator for live status.",
    render: function BadgeDemo() {
      return (
        <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/25 text-success text-xs font-medium">
          <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
          Live Status
        </span>
      );
    },
  },
  {
    id: "switch",
    name: "Toggle Switch",
    desc: "Smooth sliding toggle with state update.",
    render: function SwitchDemo() {
      const [enabled, setEnabled] = useState(true);
      return (
        <button
          onClick={(e) => { e.preventDefault(); setEnabled((v) => !v); }}
          aria-checked={enabled}
          role="switch"
          className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer border ${
            enabled ? "bg-foreground border-foreground" : "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
          }`}
        >
          <div
            className={`w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
              enabled ? "translate-x-4 bg-background" : "translate-x-0 bg-white dark:bg-zinc-300"
            }`}
          />
        </button>
      );
    },
  },
  {
    id: "progress",
    name: "Circular Progress",
    desc: "Animated progress indicators.",
    render: function ProgressDemo() {
      const [val, setVal] = useState(65);
      React.useEffect(() => {
        const interval = setInterval(() => {
          setVal((v) => (v >= 100 ? 0 : v + 5));
        }, 800);
        return () => clearInterval(interval);
      }, []);
      const r = 20;
      const circumference = 2 * Math.PI * r;
      return (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r={r} stroke="currentColor" strokeWidth="3.5" fill="transparent" className="text-muted" />
            <circle
              cx="24" cy="24" r={r}
              stroke="currentColor" strokeWidth="3.5" fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * val) / 100}
              className="text-primary transition-all duration-300"
            />
          </svg>
          <span className="absolute text-[10px] font-mono font-semibold">{val}%</span>
        </div>
      );
    },
  },
  {
    id: "tooltip",
    name: "Micro Tooltip",
    desc: "Interactive overlays with instant positioning.",
    render: function TooltipDemo() {
      return (
        <div className="relative group">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded bg-card border border-border text-[9px] font-mono text-foreground whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Hover success!
          </div>
          <button className="px-3.5 py-1.5 rounded-lg border border-border bg-card/50 hover:bg-card text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Hover Me
          </button>
        </div>
      );
    },
  },
  {
    id: "slider",
    name: "Interactive Slider",
    desc: "Fluid range controller.",
    render: function SliderDemo() {
      const [value, setValue] = useState(70);
      return (
        <div className="w-28 space-y-1.5">
          <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
            <span>Volume</span>
            <span>{value}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => { e.stopPropagation(); setValue(Number(e.target.value)); }}
            onClick={(e) => e.preventDefault()}
            className="w-full h-1 rounded cursor-pointer accent-primary bg-muted"
          />
        </div>
      );
    },
  },
];

const showcaseContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const showcaseItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyCli = async () => {
    await copyToClipboard("npx nexoreui init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start text-center px-4 sm:px-6 pt-28 sm:pt-32 pb-20 overflow-hidden select-none demo-grid-pattern"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background pointer-events-none -z-10" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] mb-6 leading-[1.04] text-foreground"
        >
          Build beautiful <br className="hidden sm:inline" />
          interfaces faster.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed px-2 font-normal"
        >
          Handcrafted components built on Radix UI and Tailwind CSS v4.
          Copy the code, customize your theme, and ship production-ready applications with zero lock-in.
        </motion.p>

        {/* CTAs & Interactive Command Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3.5"
        >
          {/* Centerpiece: Aurora Pill "Get Started" Button matching AuroraSearchPill */}
          <Link
            href="/docs/installation"
            id="hero-cta-primary"
            className="relative group inline-flex items-center justify-center cursor-pointer select-none isolate outline-none transition-transform duration-200 ease-out active:scale-[0.96]"
          >
            {/* Ambient volumetric glowing halo with continuous smooth rotation */}
            <div className="absolute -inset-1.5 rounded-full overflow-hidden pointer-events-none blur-[7px] z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className="absolute -inset-[200%] animate-[spin_3.2s_linear_infinite]"
                style={{
                  background: `conic-gradient(
                    from 0deg at 50% 50%,
                    transparent 0deg,
                    var(--hero-glow-1) 50deg,
                    var(--hero-glow-2) 100deg,
                    var(--hero-glow-3) 150deg,
                    var(--hero-glow-4) 200deg,
                    transparent 250deg,
                    transparent 360deg
                  )`,
                }}
              />
            </div>

            {/* 2px Sharp Border Track with continuous rotating conic gradient */}
            <div className="relative z-10 p-[2px] rounded-full overflow-hidden shadow-sm transition-all duration-300">
              <div
                className="absolute -inset-[200%] animate-[spin_3.2s_linear_infinite]"
                style={{
                  background: `conic-gradient(
                    from 0deg at 50% 50%,
                    var(--hero-track-1) 0deg,
                    var(--hero-track-2) 60deg,
                    var(--hero-track-3) 110deg,
                    var(--hero-track-4) 160deg,
                    var(--hero-track-1) 200deg,
                    var(--hero-track-5) 260deg,
                    var(--hero-track-1) 360deg
                  )`,
                }}
              />

              {/* Center Pill Body */}
              <div className="relative z-20 h-11 px-7 rounded-full flex items-center justify-center gap-2.5 font-semibold text-sm bg-white dark:bg-[#070b14] text-zinc-900 dark:text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_2px_8px_-2px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-all duration-300 group-hover:bg-zinc-50 dark:group-hover:bg-[#0c1324]">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-foreground transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Secondary Action Button */}
          <Link href="/templates" id="hero-cta-templates">
            <Button variant="outline" size="lg" className="h-11 px-6 rounded-xl font-semibold gap-2 border-border hover:bg-accent cursor-pointer">
              <span>Explore Templates</span>
            </Button>
          </Link>

          {/* Direct CLI Command */}
          <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl border border-border/70 bg-card/40 backdrop-blur-md font-mono text-xs text-muted-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
            <Terminal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-foreground select-all">npx nexoreui init</span>
            <button
              onClick={handleCopyCli}
              aria-label="Copy CLI init command"
              className="ml-1 p-1 hover:text-foreground text-muted-foreground transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full z-10 mt-2 mb-16 sm:mb-20 relative"
      >
        <div className="opacity-100 transition-opacity duration-300">
          <TemplatesMarquee />
        </div>

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4">
          <div className="pointer-events-auto relative z-10 flex w-full max-w-lg flex-col items-center text-center px-6 py-6 sm:px-8 sm:py-7 rounded-2xl border border-border bg-background/80 dark:bg-card/80 backdrop-blur-xl shadow-xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight text-balance">
              Production templates for modern web apps
            </h2>
            <p className="mt-2.5 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Full-source Next.js starters with responsive layouts, clean typography, and zero lock-in.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/templates"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-xs font-semibold text-background shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span>Browse templates</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/create"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <span>Create Project</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6-component mini showcase grid */}
      <motion.div
        variants={showcaseContainerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-4 z-10"
      >
        {componentShowcases.map((comp) => {
          const CompRender = comp.render;
          return (
            <motion.div key={comp.id} variants={showcaseItemVariants} className="h-full">
              <Link
                href={`/docs/components/${comp.id}`}
                className="group relative rounded-2xl border border-border/80 dark:border-white/10 bg-card/40 dark:bg-zinc-950/60 backdrop-blur-md p-5 flex flex-col justify-between items-center text-center gap-4 hover:border-foreground/30 hover:bg-card/70 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_12px_32px_-8px_rgba(0,0,0,0.4)] hover:-translate-y-1 h-full"
              >
                <div className="w-full flex flex-col items-center">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">{comp.name}</span>
                  <span className="text-[11px] text-muted-foreground mt-1 max-w-[200px] leading-relaxed">{comp.desc}</span>
                </div>
                <div className="h-16 flex items-center justify-center w-full">
                  <CompRender />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Browse all link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5 }}
        className="mt-12 z-10"
      >
        <Link
          href="/docs/components"
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Browse All 60+ Components</span>
          <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}


