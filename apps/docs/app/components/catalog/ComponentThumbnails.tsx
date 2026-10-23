"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Terminal,
  Search,
  Upload,
  Play,
  Volume2,
  Moon,
  Sun,
  Shield,
  FileCode,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Fingerprint,
  Activity,
  Sliders,
  Sparkle,
} from "lucide-react";

interface ThumbnailProps {
  id: string;
  category: string;
  className?: string;
}

export function ComponentThumbnail({ id, className = "" }: ThumbnailProps) {
  switch (id) {
    // 1. Core & Inputs
    case "button":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-2 p-2 ${className}`}>
          <button type="button" className="px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-medium shadow-xs hover:opacity-90 transition-opacity">
            Deploy
          </button>
          <button type="button" className="px-3 py-1.5 rounded-md border border-border bg-card text-foreground text-xs font-medium hover:bg-muted transition-colors">
            Cancel
          </button>
        </div>
      );

    case "input":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="w-full max-w-[210px] h-8 rounded-md border border-border bg-background px-2.5 flex items-center gap-2 text-xs">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-foreground truncate text-[11px] font-mono">nexore-prod.app</span>
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-3 p-3 ${className}`}>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-background border border-border">
            <div className="w-4 h-4 rounded bg-foreground text-background flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-xs text-foreground font-medium">Session auto-save</span>
          </div>
        </div>
      );

    case "select":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="w-full max-w-[210px] h-8 rounded-md border border-border bg-background px-2.5 flex items-center justify-between text-xs">
            <span className="text-foreground text-[11px]">us-east-1 (N. Virginia)</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </div>
        </div>
      );

    case "switch":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-3 p-3 ${className}`}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border">
            <span className="text-xs text-foreground font-medium">Auto-deploy</span>
            <div className="w-8 h-4 rounded-full bg-foreground p-0.5 flex justify-end">
              <div className="w-3 h-3 rounded-full bg-background" />
            </div>
          </div>
        </div>
      );

    case "slider":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="w-full max-w-[210px] space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>Memory limit</span>
              <span className="text-foreground font-semibold">72%</span>
            </div>
            <div className="relative h-1.5 w-full bg-muted rounded-full">
              <div className="h-full w-[72%] bg-foreground rounded-full" />
              <div className="absolute left-[72%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-border bg-background shadow-xs" />
            </div>
          </div>
        </div>
      );

    case "rating":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-1.5 p-3 ${className}`}>
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-sm">★</span>
            ))}
          </div>
          <span className="text-xs font-mono font-semibold text-foreground ml-1">4.9 / 5.0</span>
        </div>
      );

    case "file-upload":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[220px] h-12 rounded border border-dashed border-border bg-background flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Upload className="w-3.5 h-3.5 text-foreground" />
            <span className="text-[11px]">Drop schema or CSV</span>
          </div>
        </div>
      );

    // 2. Layout & Display
    case "card":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] rounded-md border border-border bg-background p-2 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground">Monthly ARR</div>
              <div className="text-xs font-mono font-bold text-foreground">$124,500</div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-foreground font-medium">
              +14.2%
            </span>
          </div>
        </div>
      );

    case "accordion":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] rounded-md border border-border bg-background px-2.5 py-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground text-[11px]">API Authentication</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
      );

    case "tabs":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="flex rounded-md border border-border bg-muted/40 p-0.5 text-xs">
            <span className="px-2.5 py-1 rounded bg-background font-medium text-foreground shadow-xs text-[11px]">
              Overview
            </span>
            <span className="px-2.5 py-1 text-muted-foreground text-[11px]">
              Metrics
            </span>
            <span className="px-2.5 py-1 text-muted-foreground text-[11px]">
              Logs
            </span>
          </div>
        </div>
      );

    case "table":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[220px] rounded border border-border bg-background text-[10px] font-mono overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/40 px-2 py-1 text-muted-foreground font-semibold border-b border-border">
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
            </div>
            <div className="grid grid-cols-3 px-2 py-1 text-foreground">
              <span>alex.ts</span>
              <span>Admin</span>
              <span className="text-emerald-500 font-semibold">Active</span>
            </div>
          </div>
        </div>
      );

    case "stepper":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
            <div className="w-8 h-0.5 bg-foreground" />
            <div className="w-5 h-5 rounded-full border-2 border-foreground bg-background text-foreground flex items-center justify-center text-[10px] font-bold">
              2
            </div>
            <div className="w-8 h-0.5 bg-muted" />
            <div className="w-5 h-5 rounded-full border border-border bg-muted text-muted-foreground flex items-center justify-center text-[10px]">
              3
            </div>
          </div>
        </div>
      );

    case "scroll-area":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] h-12 rounded border border-border bg-background p-1.5 flex justify-between">
            <div className="space-y-1 text-[10px] font-mono text-muted-foreground">
              <div className="text-foreground">log_01: session_init</div>
              <div>log_02: tls_handshake</div>
              <div>log_03: token_granted</div>
            </div>
            <div className="w-1 bg-muted rounded-full relative">
              <div className="w-full h-1/2 bg-foreground/50 rounded-full" />
            </div>
          </div>
        </div>
      );

    case "navigation":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="w-full max-w-[220px] h-8 rounded-md border border-border bg-background px-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-foreground">
              <span className="w-2 h-2 rounded-full bg-foreground" />
              <span>Nexore</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>Docs</span>
              <span>API</span>
              <span>Pricing</span>
            </div>
          </div>
        </div>
      );

    case "dock":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-border bg-background/80 backdrop-blur-sm shadow-sm">
            <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-[10px] font-mono">⌘</div>
            <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center text-xs -translate-y-1 shadow-sm">⚡</div>
            <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-[10px] font-mono">⌥</div>
            <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-[10px] font-mono">⎋</div>
          </div>
        </div>
      );

    case "data-display":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="rounded border border-border bg-background p-1.5">
              <div className="text-muted-foreground">Edge Latency</div>
              <div className="text-foreground font-bold">12ms</div>
            </div>
            <div className="rounded border border-border bg-background p-1.5">
              <div className="text-muted-foreground">Uptime</div>
              <div className="text-emerald-500 font-bold">99.98%</div>
            </div>
          </div>
        </div>
      );

    // 3. Feedback & Overlays
    case "modal":
    case "dialog":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2 ${className}`}>
          <div className="w-full max-w-[210px] rounded-lg border border-border bg-background p-2 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Delete Workspace?</span>
              <span className="text-muted-foreground text-[10px]">✕</span>
            </div>
            <div className="flex justify-end gap-1.5 pt-1">
              <button type="button" className="px-2 py-0.5 rounded border border-border text-[9px] text-muted-foreground">Cancel</button>
              <button type="button" className="px-2 py-0.5 rounded bg-foreground text-background text-[9px] font-medium">Delete</button>
            </div>
          </div>
        </div>
      );

    case "alert":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[220px] rounded-md border border-border bg-background p-2 flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4 text-foreground shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-[11px] text-foreground">Cluster Healthy</div>
              <div className="text-[10px] text-muted-foreground truncate">All nodes in operational sync</div>
            </div>
          </div>
        </div>
      );

    case "badge":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-2 p-3 ${className}`}>
          <span className="px-2.5 py-1 rounded-full bg-foreground text-background text-[11px] font-mono font-semibold">
            Production
          </span>
          <span className="px-2.5 py-1 rounded-full border border-border bg-background text-[11px] font-mono font-medium text-foreground">
            v2.0
          </span>
        </div>
      );

    case "avatar":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-2 p-3 ${className}`}>
          <div className="w-8 h-8 rounded-full border border-border bg-foreground text-background flex items-center justify-center font-mono text-xs font-bold">
            NX
          </div>
          <div className="w-8 h-8 rounded-full border border-border bg-muted text-foreground flex items-center justify-center font-mono text-xs font-bold -ml-4">
            UI
          </div>
          <div className="w-8 h-8 rounded-full border border-border bg-background text-muted-foreground flex items-center justify-center font-mono text-xs -ml-4">
            +3
          </div>
        </div>
      );

    case "tooltip":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex flex-col items-center justify-center p-2 ${className}`}>
          <div className="px-2 py-0.5 rounded bg-foreground text-background text-[10px] font-medium shadow-xs mb-1">
            Copy deployment URL
          </div>
          <button type="button" className="px-2.5 py-1 rounded border border-border bg-background text-xs font-mono text-muted-foreground">
            api.nexore.dev
          </button>
        </div>
      );

    case "progress":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="w-full max-w-[210px] space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-muted-foreground">Building container...</span>
              <span className="text-foreground font-semibold">78%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[78%] bg-foreground rounded-full" />
            </div>
          </div>
        </div>
      );

    case "skeleton":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="w-full max-w-[210px] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-muted shrink-0 animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-2 w-1/2 bg-muted/60 rounded animate-pulse" />
            </div>
          </div>
        </div>
      );

    case "loaders":
    case "loader":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-3 p-3 ${className}`}>
          <div className="w-5 h-5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      );

    case "toaster":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] p-2 rounded-lg border border-border bg-background shadow-sm flex items-center gap-2 text-xs">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
            <span className="text-[11px] font-medium text-foreground">Saved to cloud</span>
          </div>
        </div>
      );

    // 4. AI & Agentic
    case "command":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="w-full max-w-[210px] h-8 rounded-md border border-border bg-background px-2.5 flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px] font-mono">⌘ Type a command...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-foreground">↵</kbd>
          </div>
        </div>
      );

    case "ai-prompt-input":
    case "pro-ai":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[220px] rounded-lg border border-border bg-background p-2 flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground truncate">Explain database migration...</span>
            <div className="w-5 h-5 rounded bg-foreground text-background flex items-center justify-center text-[10px] shrink-0">
              ↑
            </div>
          </div>
        </div>
      );

    case "aurora-border-card":
    case "aurora-border-fx":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="w-full max-w-[210px] p-2 rounded-lg border-2 border-foreground/80 bg-background text-center">
            <span className="text-[11px] font-medium text-foreground">Reactive Border Glow</span>
          </div>
        </div>
      );

    case "aurora-search-pill":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="w-full max-w-[210px] h-8 rounded-full border border-border bg-background px-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px]">Search templates & components</span>
            <span className="text-[10px] font-mono">⌘K</span>
          </div>
        </div>
      );

    case "interactive-code-block":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] rounded-md border border-border bg-background p-2 font-mono text-[10px] flex items-center justify-between">
            <span className="text-foreground">$ pnpm add nexoreui</span>
            <span className="text-[10px] text-muted-foreground font-sans">Copy</span>
          </div>
        </div>
      );

    // 5. Animated & Effects
    case "morphing-geometry":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <motion.div
            animate={{ borderRadius: ["20%", "50%", "20%"], rotate: [0, 90, 180] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-2 border-foreground bg-foreground/10"
          />
        </div>
      );

    case "marquee":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center overflow-hidden p-2 ${className}`}>
          <div className="flex items-center gap-2 text-xs font-mono whitespace-nowrap animate-pulse">
            <span className="px-2 py-0.5 rounded bg-background border border-border text-[10px]">Next.js 15</span>
            <span className="px-2 py-0.5 rounded bg-background border border-border text-[10px]">React 19</span>
            <span className="px-2 py-0.5 rounded bg-background border border-border text-[10px]">Tailwind v4</span>
          </div>
        </div>
      );

    case "number-ticker":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-foreground tabular-nums">14,250+</div>
            <div className="text-[10px] text-muted-foreground">Global installations</div>
          </div>
        </div>
      );

    case "blur-fade":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="px-3 py-1.5 rounded-lg border border-border bg-background/60 backdrop-blur-md text-xs font-medium text-foreground">
            Staggered Blur In
          </div>
        </div>
      );

    case "dark-mode":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-3 p-3 ${className}`}>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background">
            <Sun className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="w-7 h-3.5 rounded-full bg-foreground p-0.5 flex justify-end">
              <div className="w-2.5 h-2.5 rounded-full bg-background" />
            </div>
            <Moon className="w-3.5 h-3.5 text-foreground" />
          </div>
        </div>
      );

    case "premium-effects":
    case "ultra-effects":
    case "special-animations":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="px-4 py-1.5 rounded-md border border-foreground/40 bg-foreground/5 text-xs font-semibold text-foreground tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-ping" />
            <span>Kinetic Motion</span>
          </div>
        </div>
      );

    // 6. Pro Suites & Charts
    case "charts":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2 ${className}`}>
          <div className="w-full max-w-[210px] h-12 flex items-end gap-1.5 px-2">
            {[35, 55, 45, 80, 65, 95, 75, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-foreground rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      );

    case "commerce":
    case "pro-ecommerce":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] rounded-md border border-border bg-background p-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground">Pro Suite</div>
              <div className="text-xs font-mono font-bold text-foreground">$129.00</div>
            </div>
            <button type="button" className="px-2.5 py-1 rounded bg-foreground text-background text-[10px] font-medium">
              Checkout
            </button>
          </div>
        </div>
      );

    case "social":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] rounded border border-border bg-background p-2 flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-muted font-mono text-[10px] flex items-center justify-center font-bold">AL</div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[10px] text-foreground">Alex Rivers</div>
              <div className="text-[9px] text-muted-foreground truncate">Shipped release v2.0</div>
            </div>
          </div>
        </div>
      );

    case "premium-media":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-1 p-3 ${className}`}>
          {[30, 60, 45, 90, 75, 40, 85, 50, 70].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-foreground rounded-full"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      );

    case "premium-overlays":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2 ${className}`}>
          <div className="w-full max-w-[210px] h-12 rounded border border-border bg-background flex">
            <div className="w-2/3 p-1.5 text-[9px] text-muted-foreground">Main app content</div>
            <div className="w-1/3 border-l border-border bg-muted/30 p-1.5 text-[9px] font-semibold text-foreground">Drawer</div>
          </div>
        </div>
      );

    case "pro-buttons":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-2 p-2 ${className}`}>
          <div className="inline-flex rounded-md border border-border bg-background overflow-hidden text-xs">
            <span className="px-2.5 py-1 bg-foreground text-background font-medium text-[11px]">Merge</span>
            <span className="px-2 py-1 bg-muted text-foreground text-[11px] border-l border-border">▾</span>
          </div>
        </div>
      );

    case "pro-cards":
    case "holo-finish-card":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[190px] h-12 rounded-lg border-2 border-foreground/60 bg-linear-to-r from-background via-muted/40 to-background p-2 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-foreground">3D Specular Plate</span>
            <span className="text-xs">✦</span>
          </div>
        </div>
      );

    case "pro-dashboards":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-border bg-background p-1.5">
              <div className="text-[9px] text-muted-foreground">Conversion</div>
              <div className="font-mono font-bold text-[11px] text-foreground">3.84%</div>
            </div>
            <div className="rounded border border-border bg-background p-1.5">
              <div className="text-[9px] text-muted-foreground">Total MRR</div>
              <div className="font-mono font-bold text-[11px] text-foreground">$42.8k</div>
            </div>
          </div>
        </div>
      );

    case "pro-feedback":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <span
                key={n}
                className={`w-4 h-5 rounded text-[9px] font-mono flex items-center justify-center font-medium ${
                  n >= 9 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                }`}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      );

    case "pro-forms":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] space-y-1.5">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Step 2 of 4</span>
              <span className="text-foreground font-semibold">Payment</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full">
              <div className="h-full w-1/2 bg-foreground rounded-full" />
            </div>
          </div>
        </div>
      );

    case "pro-inputs":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-1.5 p-3 ${className}`}>
          {["4", "8", "2", "9"].map((digit, i) => (
            <div key={i} className="w-8 h-8 rounded border border-border bg-background text-sm font-mono font-bold text-foreground flex items-center justify-center">
              {digit}
            </div>
          ))}
        </div>
      );

    case "pro-layouts":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] h-12 rounded border border-border bg-background flex overflow-hidden">
            <div className="w-12 bg-muted/40 border-r border-border p-1 space-y-1">
              <div className="h-1.5 w-full bg-foreground/20 rounded" />
              <div className="h-1.5 w-full bg-muted-foreground/20 rounded" />
            </div>
            <div className="flex-1 p-1.5 space-y-1">
              <div className="h-2 w-16 bg-foreground/30 rounded" />
              <div className="h-4 w-full bg-muted/30 rounded" />
            </div>
          </div>
        </div>
      );

    case "pro-lists":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] space-y-1 text-xs">
            <div className="p-1 rounded border border-border bg-background flex items-center justify-between text-[10px]">
              <span className="text-foreground">⋮⋮ Product roadmap</span>
              <span className="text-muted-foreground text-[9px]">High</span>
            </div>
            <div className="p-1 rounded border border-border bg-background flex items-center justify-between text-[10px]">
              <span className="text-foreground">⋮⋮ Security audit</span>
              <span className="text-muted-foreground text-[9px]">Done</span>
            </div>
          </div>
        </div>
      );

    case "pro-marketing":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[200px] rounded border border-border bg-background p-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold text-foreground">Pro Team</div>
              <div className="text-xs font-mono font-bold text-foreground">$49<span className="text-[9px] text-muted-foreground">/mo</span></div>
            </div>
            <span className="px-2 py-0.5 rounded bg-foreground text-background text-[10px] font-medium">Get Started</span>
          </div>
        </div>
      );

    case "pro-navigation":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-3 ${className}`}>
          <div className="flex rounded-full border border-border bg-background px-3 py-1 gap-3 text-[10px] font-medium shadow-xs">
            <span className="text-foreground font-semibold">Home</span>
            <span className="text-muted-foreground">Projects</span>
            <span className="text-muted-foreground">Settings</span>
          </div>
        </div>
      );

    case "pro-tables":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 ${className}`}>
          <div className="w-full max-w-[210px] rounded border border-border bg-background p-1.5 space-y-1 text-[10px] font-mono">
            <div className="flex justify-between text-muted-foreground border-b border-border pb-1">
              <span>Customer</span>
              <span>Spent</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Stripe Inc.</span>
              <span className="font-semibold">$4,850</span>
            </div>
          </div>
        </div>
      );

    case "special-forms":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-2 p-2.5 ${className}`}>
          <div className="p-1.5 rounded border-2 border-foreground bg-background text-[10px] font-medium text-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-foreground" />
            <span>Standard</span>
          </div>
          <div className="p-1.5 rounded border border-border bg-muted/30 text-[10px] text-muted-foreground">
            Enterprise
          </div>
        </div>
      );

    case "ultra-components":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2 ${className}`}>
          <div className="w-12 h-12 rounded-full border-2 border-foreground/80 flex flex-col items-center justify-center">
            <span className="text-xs font-mono font-bold text-foreground">85</span>
            <span className="text-[8px] font-mono text-muted-foreground uppercase">MPH</span>
          </div>
        </div>
      );

    case "node-flow-graph":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center gap-3 p-2.5 ${className}`}>
          <div className="px-2 py-1 rounded border border-border bg-background text-[9px] font-mono">Input</div>
          <div className="w-6 h-0.5 bg-foreground" />
          <div className="px-2 py-1 rounded bg-foreground text-background text-[9px] font-mono font-semibold">Parser</div>
        </div>
      );

    case "sound-pulse":
    case "silk-unveil":
    case "pro-objects":
    case "live-object":
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2 ${className}`}>
          <div className="w-10 h-10 rounded-lg border border-foreground/60 bg-foreground/10 flex items-center justify-center text-xs font-mono font-bold text-foreground">
            3D
          </div>
        </div>
      );

    default:
      return (
        <div className={`h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2 ${className}`}>
          <div className="px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium text-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] capitalize">{id.replace(/-/g, " ")}</span>
          </div>
        </div>
      );
  }
}
