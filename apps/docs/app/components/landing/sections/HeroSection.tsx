"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

// Mini interactive demos shown in the hero grid
const componentShowcases = [
  {
    id: "button",
    name: "Animated Button",
    desc: "Micro-interactions and state-aware feedback.",
    render: function ButtonDemo() {
      const [clicks, setClicks] = useState(0);
      return (
        <button
          onClick={(e) => { e.preventDefault(); setClicks((c) => c + 1); }}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-[0_0_10px_rgba(var(--primary-rgb),0.25)] cursor-pointer"
        >
          Clicked {clicks} times
        </button>
      );
    },
  },
  {
    id: "badge",
    name: "Pulse Badge",
    desc: "Glowing indicators for live status.",
    render: function BadgeDemo() {
      return (
        <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
          className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer border ${enabled ? "bg-primary border-primary/50" : "bg-muted border-border"}`}
        >
          <div
            className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${enabled ? "translate-x-4" : "translate-x-0"}`}
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
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 overflow-hidden select-none demo-grid-pattern"
      aria-labelledby="hero-title"
    >
      {/* Mesh gradient blobs — animated via globals.css keyframes (not style jsx) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-15%] w-[65%] h-[60%] rounded-full bg-primary/8 blur-[130px] animate-mesh-1" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-violet-600/8 blur-[140px] animate-mesh-2" />
        <div className="absolute top-[35%] right-[15%] w-[45%] h-[50%] rounded-full bg-cyan-500/5 blur-[120px] animate-mesh-3" />
      </div>

      {/* Fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="https://github.com/Al1mov77/NexoreUI"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/60 bg-card/60 backdrop-blur-md text-xs text-muted-foreground hover:text-foreground transition-all hover:scale-105 cursor-pointer mb-8 shadow-sm"
          >
            <Zap className="w-3 h-3 text-primary" />
            <span>Now on GitHub — Star us ⭐</span>
            <ArrowRight className="w-3 h-3 text-primary" />
          </Link>
        </motion.div>

        {/* Static headline — no typing animation (causes 2s blank h1 + CLS) */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Build beautiful{" "}
          <span className="text-primary">interfaces</span>{" "}
          faster.
        </motion.h1>

        {/* Subtitle — honest and compelling */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
        >
          Handcrafted components built on Radix UI and Tailwind CSS v4.
          Copy the code, make it yours — no hidden dependencies, no vendor lock-in.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <Link
            href="/docs/installation"
            id="hero-cta-primary"
            className="relative group w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_8px_35px_rgba(var(--primary-rgb),0.4)] cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#showcase"
            id="hero-cta-secondary"
            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-xl border border-border bg-card/50 backdrop-blur-md text-muted-foreground text-sm font-semibold hover:bg-card hover:text-foreground active:scale-[0.98] transition-all cursor-pointer"
          >
            Browse Components
          </a>
        </motion.div>
      </div>

      {/* 6-component mini showcase grid */}
      <motion.div
        variants={showcaseContainerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 z-10"
      >
        {componentShowcases.map((comp) => {
          const CompRender = comp.render;
          return (
            <motion.div key={comp.id} variants={showcaseItemVariants} className="h-full">
              <Link
                href={`/docs/${comp.id}`}
                className="group relative rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 flex flex-col justify-between items-center text-center gap-4 hover:border-primary/40 hover:bg-card/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.1)] hover:-translate-y-1.5 h-full"
              >
                <div className="w-full flex flex-col items-center">
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors">{comp.name}</span>
                  <span className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">{comp.desc}</span>
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
        transition={{ delay: 0.7 }}
        className="mt-12 z-10"
      >
        <Link
          href="/docs/button"
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Browse All Components</span>
          <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer z-10"
        onClick={() => {
          const el = document.getElementById("showcase");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-[9px] uppercase tracking-widest font-mono text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowRight className="rotate-90 w-3.5 h-3.5 text-primary" />
        </motion.div>
      </div>
    </section>
  );
}
