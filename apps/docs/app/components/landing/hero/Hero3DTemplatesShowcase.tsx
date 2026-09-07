"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  LayoutDashboard,
  CreditCard,
  Terminal,
  Gift,
  ShoppingBag,
  Activity,
  Check,
  Code2,
  Server,
  TrendingUp,
  ShieldCheck,
  Radio,
  Copy,
  Lock,
  Zap,
  Globe,
} from "lucide-react";

/**
 * ═════════════════════════════════════════════════════════════════
 * NEXOREUI 3D TEMPLATES UNIVERSE — 16 REAL TEMPLATE CARDS
 * A continuous, living 3D spatial field inspired by Tailwind Plus.
 * Arranged into 4 parallel lanes on a continuous tilted 3D plane.
 * ═════════════════════════════════════════════════════════════════
 */

interface TemplateCardData {
  id: string;
  title: string;
  urlHost: string;
  badge: string;
  category: string;
  renderContent: () => React.ReactNode;
}

const TEMPLATE_CARDS: TemplateCardData[] = [
  // ── Lane 1 Cards ──
  {
    id: "synthetix-ai",
    title: "Synthetix AI",
    urlHost: "synthetix.nexoreui.site",
    badge: "Flagship",
    category: "AI Startup",
    renderContent: () => (
      <div className="p-3.5 flex flex-col gap-2.5 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Synthetix-R1</span>
          </div>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            14ms TTFT
          </span>
        </div>
        <div className="flex gap-1 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold">R1 Reasoner</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500">Claude-3.5</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500">GPT-4o</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-100/80 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-white/5 text-[10px] font-mono text-slate-700 dark:text-zinc-300">
          <span className="text-indigo-500 font-bold">$</span> synthesize --pipeline=rag
          <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">✓ 4 edge regions compiled.</div>
        </div>
      </div>
    ),
  },
  {
    id: "pulsemetrics",
    title: "PulseMetrics",
    urlHost: "pulse.nexoreui.site",
    badge: "Real-time",
    category: "Analytics",
    renderContent: () => (
      <div className="p-3.5 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            Live MRR Stream
          </span>
          <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            +24.8%
          </span>
        </div>
        <div className="my-1">
          <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">$148,290.00</div>
          <div className="text-[9px] text-slate-500 dark:text-zinc-400">Net Retention 128% · Churn 0.8%</div>
        </div>
        <div className="w-full h-7 flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path
              d="M0 20 Q 20 15, 35 18 T 65 8 T 85 11 T 100 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-emerald-500 dark:text-emerald-400"
            />
          </svg>
        </div>
      </div>
    ),
  },
  {
    id: "warpspeed-cli",
    title: "WarpSpeed CLI",
    urlHost: "warp.nexoreui.site",
    badge: "Systems",
    category: "Devtools",
    renderContent: () => (
      <div className="p-3 flex flex-col justify-between h-full bg-slate-900 text-slate-100 font-mono text-[10px]">
        <div className="flex items-center gap-1 pb-1.5 border-b border-slate-800 text-slate-400">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span>warpspeed v2.4</span>
        </div>
        <div className="space-y-0.5 leading-relaxed my-1">
          <div className="text-cyan-400">~ $ nexoreui add button card</div>
          <div className="text-slate-400">→ resolving 2 primitives...</div>
          <div className="text-emerald-400 font-semibold">✓ Injected into ./components/ui</div>
        </div>
        <div className="text-slate-500 text-[9px]">Compiled in 18ms · 0 bytes runtime</div>
      </div>
    ),
  },
  {
    id: "apex-capital",
    title: "Apex Capital",
    urlHost: "apex.nexoreui.site",
    badge: "Neo-Bank",
    category: "Fintech",
    renderContent: () => (
      <div className="p-3.5 flex flex-col justify-between h-full bg-gradient-to-br from-slate-900 via-zinc-900 to-black text-white rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-300">Apex Black</span>
          </div>
          <Radio className="w-3 h-3 text-zinc-400 rotate-90" />
        </div>
        <div className="my-1">
          <div className="text-[9px] text-zinc-400 font-mono">Available Balance</div>
          <div className="text-lg font-mono font-bold tracking-tight text-white">$942,850.00</div>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 border-t border-white/10 pt-1.5">
          <span>•••• 8492</span>
          <span className="text-amber-400 font-semibold">USD / EUR / JPY</span>
        </div>
      </div>
    ),
  },

  // ── Lane 2 Cards ──
  {
    id: "hyperscale",
    title: "HyperScale",
    urlHost: "hyperscale.nexoreui.site",
    badge: "Full-Stack",
    category: "Developer SaaS",
    renderContent: () => (
      <div className="p-3.5 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Edge Topology</span>
          </div>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">99.99% Uptime</span>
        </div>
        <div className="space-y-1 my-1 text-[10px]">
          <div className="flex justify-between text-slate-600 dark:text-zinc-400">
            <span>us-east (IAD)</span>
            <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">4.2ms</span>
          </div>
          <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div className="w-[85%] h-full bg-cyan-500 rounded-full" />
          </div>
          <div className="flex justify-between text-slate-600 dark:text-zinc-400">
            <span>eu-central (FRA)</span>
            <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">8.6ms</span>
          </div>
        </div>
        <div className="text-[9px] text-slate-500 dark:text-zinc-400 font-mono">
          Commit: <span className="text-slate-800 dark:text-zinc-200">sha-8f2c01d</span>
        </div>
      </div>
    ),
  },
  {
    id: "prism-waitlist",
    title: "Prism Cloud",
    urlHost: "prism.nexoreui.site",
    badge: "Viral Growth",
    category: "Waitlist",
    renderContent: () => (
      <div className="p-3.5 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-violet-500" />
            Launch Countdown
          </span>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400">
            Tier 1
          </span>
        </div>
        <div className="my-1 text-center">
          <div className="text-[9px] text-slate-500 font-mono">Public Beta</div>
          <div className="text-sm font-mono font-extrabold text-slate-900 dark:text-white tracking-widest">
            04d : 18h : 32m : 11s
          </div>
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 border-t border-slate-200/80 dark:border-white/8 pt-1.5">
          <span>14,820 builders</span>
          <span className="text-violet-600 dark:text-violet-400 font-semibold">Priority #42</span>
        </div>
      </div>
    ),
  },
  {
    id: "code-export",
    title: "Code Export",
    urlHost: "export.nexoreui.site",
    badge: "Zero-Config",
    category: "Platform",
    renderContent: () => (
      <div className="p-3 flex flex-col justify-between h-full bg-slate-900 text-slate-200 font-mono text-[10px]">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-1">
            <Code2 className="w-3 h-3 text-primary" />
            <span>App.tsx</span>
          </div>
          <Copy className="w-2.5 h-2.5" />
        </div>
        <div className="space-y-0.5 leading-relaxed my-1">
          <div><span className="text-violet-400">import</span> &#123; <span className="text-amber-300">Button</span>, <span className="text-cyan-300">Card</span> &#125; <span className="text-violet-400">from</span> <span className="text-emerald-400">&quot;nexoreui&quot;</span>;</div>
          <div><span className="text-violet-400">export default</span> <span className="text-cyan-400">Page</span>&#40;&#41; &#123;</div>
          <div className="pl-2.5"><span className="text-violet-400">return</span> &lt;<span className="text-amber-300">Card</span> glow /&gt;;</div>
          <div>&#125;</div>
        </div>
        <div className="text-[9px] text-emerald-400">✓ Tailwind v4 verified</div>
      </div>
    ),
  },
  {
    id: "cognition-ai",
    title: "Cognition AI",
    urlHost: "cognition.nexoreui.site",
    badge: "Reasoning",
    category: "AI Chat",
    renderContent: () => (
      <div className="p-3.5 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/8 pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">AI Agent</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500">Thought 1.8s</span>
        </div>
        <div className="space-y-1 my-1">
          <div className="text-[10px] text-slate-500 italic">&quot;Synthesizing vector route...&quot;</div>
          <div className="p-1.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary font-medium">
            ✓ 4 edge nodes selected
          </div>
        </div>
        <div className="flex justify-between text-[9px] text-slate-500">
          <span>Tokens: 1,842</span>
          <span>Temp: 0.2</span>
        </div>
      </div>
    ),
  },

  // ── Lane 3 Cards ──
  {
    id: "sprintflow",
    title: "SprintFlow",
    urlHost: "sprint.nexoreui.site",
    badge: "Agile",
    category: "Project",
    renderContent: () => (
      <div className="p-3.5 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Sprint 24 · Release</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
            Active
          </span>
        </div>
        <div className="p-1.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/8 text-[10px] my-1">
          <div className="font-semibold text-slate-800 dark:text-zinc-200">Optimize WebGPU Shaders</div>
          <div className="flex justify-between text-[8px] text-slate-500 mt-1">
            <span>High Priority</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Done</span>
          </div>
        </div>
        <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
          <div className="w-[78%] h-full bg-primary rounded-full" />
        </div>
      </div>
    ),
  },
  {
    id: "aethel-store",
    title: "Aethel Luxury",
    urlHost: "aethel.nexoreui.site",
    badge: "Commerce",
    category: "Store",
    renderContent: () => (
      <div className="p-3.5 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Aethel Studio</span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-white">$480.00</span>
        </div>
        <div className="my-1">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Ceramic Tourbillon 01</div>
          <div className="text-[9px] text-slate-500">Matte obsidian finish</div>
        </div>
        <div className="flex justify-between items-center text-[9px] border-t border-slate-200/80 dark:border-white/8 pt-1.5">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">In Stock (3 left)</span>
          <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground font-semibold">Add</span>
        </div>
      </div>
    ),
  },
  {
    id: "inference-matrix",
    title: "Inference Matrix",
    urlHost: "benchmark.nexoreui.site",
    badge: "FP16",
    category: "Benchmark",
    renderContent: () => (
      <div className="p-3 flex flex-col justify-between h-full font-mono text-[10px]">
        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white font-sans">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-primary" />
            Model Benchmarks
          </span>
          <span className="text-[9px] text-slate-500">FP16</span>
        </div>
        <div className="space-y-1 my-1 text-[9px]">
          <div className="flex justify-between text-slate-500 pb-0.5 border-b border-slate-200 dark:border-white/5">
            <span>Model</span>
            <span>TTFT</span>
            <span>Tok/s</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-800 dark:text-zinc-200">
            <span>Synthetix-R1</span>
            <span className="text-emerald-600 dark:text-emerald-400">12ms</span>
            <span>184</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-zinc-400">
            <span>Claude-3.5</span>
            <span>28ms</span>
            <span>112</span>
          </div>
        </div>
        <div className="text-[8px] text-slate-400 text-right">Sub-10ms caching</div>
      </div>
    ),
  },
  {
    id: "security-guard",
    title: "Security Guard",
    urlHost: "security.nexoreui.site",
    badge: "TLS 1.3",
    category: "Security",
    renderContent: () => (
      <div className="p-3 flex flex-col justify-between h-full font-mono text-[10px]">
        <div className="flex items-center justify-between font-sans">
          <span className="flex items-center gap-1 font-bold text-xs text-slate-900 dark:text-white">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Webhook Ingestion
          </span>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">200 OK</span>
        </div>
        <div className="p-1.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[9px] space-y-0.5">
          <div className="text-slate-500">event: <span className="text-slate-800 dark:text-zinc-200">payment.completed</span></div>
          <div className="text-slate-500">digest: <span className="text-emerald-600 dark:text-emerald-400">&#123; 2900 &#125;</span></div>
        </div>
        <div className="flex justify-between text-[8px] text-slate-500">
          <span>TLS 1.3 active</span>
          <span>32ms digest</span>
        </div>
      </div>
    ),
  },

  // ── Lane 4 Cards ──
  {
    id: "docs-platform",
    title: "Docs Platform",
    urlHost: "docs.nexoreui.site",
    badge: "REST",
    category: "Documentation",
    renderContent: () => (
      <div className="p-3 flex flex-col justify-between h-full font-mono text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[9px]">
            POST
          </span>
          <span className="font-bold text-slate-800 dark:text-zinc-200">/v1/models/stream</span>
        </div>
        <div className="p-1.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[9px] text-slate-600 dark:text-zinc-400 my-1">
          Auth: <span className="text-primary font-semibold">Bearer sk_live_••••••</span>
        </div>
        <div className="flex justify-between text-[8px] text-slate-500">
          <span>SSE Protocol</span>
          <span className="text-emerald-500">200 Streaming</span>
        </div>
      </div>
    ),
  },
  {
    id: "pricing-calculator",
    title: "Pricing Matrix",
    urlHost: "pricing.nexoreui.site",
    badge: "Pro",
    category: "Pricing",
    renderContent: () => (
      <div className="p-3.5 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white">Pro Tier</span>
          <span className="text-xs font-mono font-bold text-primary">$29/mo</span>
        </div>
        <div className="space-y-1 my-1 text-[9px] text-slate-600 dark:text-zinc-300">
          <div className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-emerald-500" /> Unlimited projects</div>
          <div className="flex items-center gap-1"><Check className="w-2.5 h-2.5 text-emerald-500" /> Full Tailwind v4 source</div>
        </div>
        <button className="w-full py-1 rounded bg-primary/10 text-primary text-[9px] font-semibold">
          Deploy Workspace →
        </button>
      </div>
    ),
  },
  {
    id: "transaction-stream",
    title: "Transactions",
    urlHost: "ledger.nexoreui.site",
    badge: "Global",
    category: "Fintech",
    renderContent: () => (
      <div className="p-3 flex flex-col justify-between h-full font-mono text-[10px]">
        <div className="flex items-center justify-between font-sans">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Global Inflow</span>
          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">Real-time</span>
        </div>
        <div className="space-y-1 my-1 text-[9px]">
          <div className="flex justify-between items-center text-slate-800 dark:text-zinc-200">
            <span>Stripe Enterprise</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">+$4,200.00</span>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400">
            <span>SEPA Wire</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">+$12,450.00</span>
          </div>
        </div>
        <div className="text-[8px] text-slate-400 font-sans">Automated reconciliation</div>
      </div>
    ),
  },
  {
    id: "atom-components",
    title: "Atom UI",
    urlHost: "ui.nexoreui.site",
    badge: "v4.0",
    category: "Components",
    renderContent: () => (
      <div className="p-3 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Atom Primitives</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">v4.0</span>
        </div>
        <div className="flex items-center gap-1.5 my-1">
          <button className="px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-semibold shadow-xs">
            Primary
          </button>
          <button className="px-2 py-1 rounded border border-border bg-card text-foreground text-[10px] font-semibold">
            Outline
          </button>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-auto" />
        </div>
        <div className="text-[8px] text-slate-500 font-mono">Radix core · Accessible</div>
      </div>
    ),
  },
];

/**
 * Individual Window Frame on the 3D Tilted Plane
 */
function TemplateWindowCard({
  item,
  href,
  tabIndex,
}: {
  item: TemplateCardData;
  href: string;
  tabIndex?: number;
}) {
  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      className="group block relative w-full h-[165px] sm:h-[175px] md:h-[185px] rounded-2xl transition-all duration-300 select-none overflow-hidden bg-white/95 dark:bg-zinc-950/95 border border-slate-200/90 dark:border-white/10 shadow-[0_14px_35px_-10px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] hover:border-primary/60 dark:hover:border-primary/50 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
    >
      {/* Chrome Top Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b select-none transition-colors border-slate-200/80 dark:border-white/8 bg-slate-100/90 dark:bg-zinc-900/90">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500/90 inline-block" />
          <span className="w-2 h-2 rounded-full bg-amber-500/90 inline-block" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/90 inline-block" />
          <span className="text-[10px] font-semibold text-slate-700 dark:text-zinc-300 ml-1 truncate max-w-[100px] sm:max-w-[130px]">
            {item.title}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500 dark:text-zinc-400">
          <Lock className="w-2.5 h-2.5 text-emerald-500" />
          <span className="truncate max-w-[100px]">{item.urlHost}</span>
        </div>
      </div>

      {/* Interior Visual Content */}
      <div className="w-full h-[calc(100%-29px)] overflow-hidden">
        {item.renderContent()}
      </div>

      {/* Glossy Sheen Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-transparent to-white/10 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

/**
 * ═════════════════════════════════════════════════════════════════
 * MAIN 3D CONTINUOUS TEMPLATE UNIVERSE SHOWCASE
 * ═════════════════════════════════════════════════════════════════
 */
export function Hero3DTemplatesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const prefersReduced = useReducedMotion();

  const [targetTilt, setTargetTilt] = useState({ x: 0, y: 0 });
  const [currentTilt, setCurrentTilt] = useState({ x: 0, y: 0 });

  // Mouse Parallax (Secondary subtle camera influence, max ±1deg X, ±1.5deg Y)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReduced) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setTargetTilt({
        x: -ny * 2.0, // max ±1.0deg
        y: nx * 3.0,  // max ±1.5deg
      });
    },
    [prefersReduced]
  );

  const handleMouseLeave = useCallback(() => {
    setTargetTilt({ x: 0, y: 0 });
  }, []);

  // Smooth LERP camera damping
  useEffect(() => {
    if (prefersReduced) {
      setCurrentTilt({ x: 0, y: 0 });
      return;
    }

    let active = true;
    const lerpFactor = 0.05;

    const tick = () => {
      if (!active) return;
      setCurrentTilt((prev) => {
        const dx = targetTilt.x - prev.x;
        const dy = targetTilt.y - prev.y;
        if (Math.abs(dx) < 0.005 && Math.abs(dy) < 0.005) {
          return targetTilt;
        }
        return {
          x: prev.x + dx * lerpFactor,
          y: prev.y + dy * lerpFactor,
        };
      });
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetTilt, prefersReduced]);

  // Divide into 4 lanes
  const lane1 = TEMPLATE_CARDS.slice(0, 4);
  const lane2 = TEMPLATE_CARDS.slice(4, 8);
  const lane3 = TEMPLATE_CARDS.slice(8, 12);
  const lane4 = TEMPLATE_CARDS.slice(12, 16);

  // 5 items per lane to guarantee vertical overflow buffer on large displays
  const lane1Set = [lane1[0], lane1[1], lane1[2], lane1[3], lane1[0]];
  const lane2Set = [lane2[0], lane2[1], lane2[2], lane2[3], lane2[0]];
  const lane3Set = [lane3[0], lane3[1], lane3[2], lane3[3], lane3[0]];
  const lane4Set = [lane4[0], lane4[1], lane4[2], lane4[3], lane4[0]];

  // Mobile: 4 items per lane
  const mobileLane1Set = [lane1[0], lane1[1], lane1[2], lane1[3]];
  const mobileLane2Set = [lane2[0], lane2[1], lane2[2], lane2[3]];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-[1540px] mx-auto flex flex-col items-center relative z-10 px-2 sm:px-4 select-none"
    >
      {/* ──────────────────────────────────────────────────────────
          PREMIUM CINEMATIC VIEWPORT FRAME
          With edge fade vignettes, dark/light backdrop, and subtle grid.
          ────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[480px] sm:h-[560px] md:h-[640px] lg:h-[720px] rounded-3xl border border-slate-200/90 dark:border-white/10 bg-slate-100/60 dark:bg-black/50 shadow-2xl overflow-hidden mb-8">
        {/* Subtle Isometric Background Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Multi-Directional Gradient Edge Fades (Vignettes for infinite horizon) */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-background via-background/60 to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none z-20" />
        <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-background via-background/50 to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-background via-background/50 to-transparent pointer-events-none z-20" />

        {/* ──────────────────────────────────────────────────────────
            DESKTOP & TABLET: 4-LANE 3D CONTINUOUS TEMPLATE UNIVERSE
            ────────────────────────────────────────────────────────── */}
        <div
          className="hidden md:flex w-full h-full relative items-center justify-center pointer-events-auto"
          style={{
            perspective: "1400px",
            perspectiveOrigin: "50% 36%",
          }}
        >
          {/* Mouse Parallax Gimbal (Subtle max ±1.0deg X, ±1.5deg Y) */}
          <div
            className="w-full h-full relative flex items-center justify-center pointer-events-auto"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${currentTilt.x}deg) rotateY(${currentTilt.y}deg)`,
              willChange: "transform",
            }}
          >
            {/* Stable 3D Tilted Plane (Fixed spatial angle matching Tailwind Plus) */}
            <div
              className="absolute flex items-center justify-center pointer-events-auto"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(52deg) rotateZ(-25deg)",
              }}
            >
              {/* Continuous Downward Flow Container (-25% -> 25% smooth linear infinite loop) */}
              <div
                className="animate-flow-down flex flex-col gap-0 pointer-events-auto"
                style={{
                  transformStyle: "preserve-3d",
                  width: "1800px",
                }}
              >
                {/* ── Composition Set 1 ── */}
                <div
                  className="grid grid-cols-4 gap-6 lg:gap-8 w-full pb-6 lg:pb-8 pointer-events-auto"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Lane 1 */}
                  <div className="flex flex-col gap-6 lg:gap-8 pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
                    {lane1Set.map((item, idx) => (
                      <TemplateWindowCard
                        key={`s1-l1-${item.id}-${idx}`}
                        item={item}
                        href={`/templates?template=${item.id}`}
                      />
                    ))}
                  </div>

                  {/* Lane 2 (Staggered offset) */}
                  <div className="flex flex-col gap-6 lg:gap-8 -translate-y-16 pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
                    {lane2Set.map((item, idx) => (
                      <TemplateWindowCard
                        key={`s1-l2-${item.id}-${idx}`}
                        item={item}
                        href={`/templates?template=${item.id}`}
                      />
                    ))}
                  </div>

                  {/* Lane 3 (Staggered offset) */}
                  <div className="flex flex-col gap-6 lg:gap-8 translate-y-12 pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
                    {lane3Set.map((item, idx) => (
                      <TemplateWindowCard
                        key={`s1-l3-${item.id}-${idx}`}
                        item={item}
                        href={`/templates?template=${item.id}`}
                      />
                    ))}
                  </div>

                  {/* Lane 4 (Staggered offset) */}
                  <div className="flex flex-col gap-6 lg:gap-8 -translate-y-8 pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
                    {lane4Set.map((item, idx) => (
                      <TemplateWindowCard
                        key={`s1-l4-${item.id}-${idx}`}
                        item={item}
                        href={`/templates?template=${item.id}`}
                      />
                    ))}
                  </div>
                </div>

                {/* ── Composition Set 2 (Identical duplicate for seamless infinite loop) ── */}
                <div
                  className="grid grid-cols-4 gap-6 lg:gap-8 w-full pb-6 lg:pb-8 pointer-events-auto"
                  style={{ transformStyle: "preserve-3d" }}
                  aria-hidden="true"
                >
                  {/* Lane 1 */}
                  <div className="flex flex-col gap-6 lg:gap-8 pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
                    {lane1Set.map((item, idx) => (
                      <TemplateWindowCard
                        key={`s2-l1-${item.id}-${idx}`}
                        item={item}
                        href={`/templates?template=${item.id}`}
                        tabIndex={-1}
                      />
                    ))}
                  </div>

                  {/* Lane 2 (Staggered offset) */}
                  <div className="flex flex-col gap-6 lg:gap-8 -translate-y-16 pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
                    {lane2Set.map((item, idx) => (
                      <TemplateWindowCard
                        key={`s2-l2-${item.id}-${idx}`}
                        item={item}
                        href={`/templates?template=${item.id}`}
                        tabIndex={-1}
                      />
                    ))}
                  </div>

                  {/* Lane 3 (Staggered offset) */}
                  <div className="flex flex-col gap-6 lg:gap-8 translate-y-12 pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
                    {lane3Set.map((item, idx) => (
                      <TemplateWindowCard
                        key={`s2-l3-${item.id}-${idx}`}
                        item={item}
                        href={`/templates?template=${item.id}`}
                        tabIndex={-1}
                      />
                    ))}
                  </div>

                  {/* Lane 4 (Staggered offset) */}
                  <div className="flex flex-col gap-6 lg:gap-8 -translate-y-8 pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
                    {lane4Set.map((item, idx) => (
                      <TemplateWindowCard
                        key={`s2-l4-${item.id}-${idx}`}
                        item={item}
                        href={`/templates?template=${item.id}`}
                        tabIndex={-1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            MOBILE: 2-LANE 3D CONTINUOUS TEMPLATE UNIVERSE (< 768px)
            Zero horizontal scroll, perfectly contained within viewport.
            ────────────────────────────────────────────────────────── */}
        <div
          className="flex md:hidden w-full h-full relative items-center justify-center overflow-hidden pointer-events-auto"
          style={{
            perspective: "1000px",
            perspectiveOrigin: "50% 40%",
          }}
        >
          {/* Stable Mobile 3D Tilted Plane */}
          <div
            className="absolute flex items-center justify-center pointer-events-auto"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(44deg) rotateZ(-18deg)",
            }}
          >
            {/* Mobile Continuous Downward Flow */}
            <div
              className="animate-flow-down-mobile flex flex-col gap-0 pointer-events-auto"
              style={{
                transformStyle: "preserve-3d",
                width: "700px",
              }}
            >
              {/* Mobile Set 1 */}
              <div
                className="grid grid-cols-2 gap-4 w-full px-4 pb-4 pointer-events-auto"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Mobile Lane 1 */}
                <div className="flex flex-col gap-4 pointer-events-auto">
                  {mobileLane1Set.map((item, idx) => (
                    <TemplateWindowCard
                      key={`m1-l1-${item.id}-${idx}`}
                      item={item}
                      href={`/templates?template=${item.id}`}
                    />
                  ))}
                </div>

                {/* Mobile Lane 2 (Staggered offset) */}
                <div className="flex flex-col gap-4 -translate-y-10 pointer-events-auto">
                  {mobileLane2Set.map((item, idx) => (
                    <TemplateWindowCard
                      key={`m1-l2-${item.id}-${idx}`}
                      item={item}
                      href={`/templates?template=${item.id}`}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile Set 2 (Identical duplicate for seamless infinite loop) */}
              <div
                className="grid grid-cols-2 gap-4 w-full px-4 pb-4 pointer-events-auto"
                style={{ transformStyle: "preserve-3d" }}
                aria-hidden="true"
              >
                {/* Mobile Lane 1 */}
                <div className="flex flex-col gap-4 pointer-events-auto">
                  {mobileLane1Set.map((item, idx) => (
                    <TemplateWindowCard
                      key={`m2-l1-${item.id}-${idx}`}
                      item={item}
                      href={`/templates?template=${item.id}`}
                      tabIndex={-1}
                    />
                  ))}
                </div>

                {/* Mobile Lane 2 (Staggered offset) */}
                <div className="flex flex-col gap-4 -translate-y-10 pointer-events-auto">
                  {mobileLane2Set.map((item, idx) => (
                    <TemplateWindowCard
                      key={`m2-l2-${item.id}-${idx}`}
                      item={item}
                      href={`/templates?template=${item.id}`}
                      tabIndex={-1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          EXPLORE STARTERS & ECOSYSTEM HUD
          Minimalist footer anchor guiding users to full templates.
          ────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-3 z-20">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            16+ Living Template Architectures
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Tailwind CSS v4 &amp; Radix Primitives
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 font-medium">
            <Globe className="w-3.5 h-3.5 text-cyan-500" />
            Next.js 15 App Router Ready
          </span>
        </div>

        <Link
          href="/templates"
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-1"
        >
          <span>Explore All 12 Full Application Starters &amp; Customizer Studio</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
