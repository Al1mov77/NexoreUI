"use client";

import React from "react";
import {
  Check,
  ChevronDown,
  Terminal,
  Search,
  Upload,
  Moon,
  Sun,
  Shield,
  Layers,
  Star,
  Compass,
  Folder,
  Settings,
  Waves,
  Box,
  Binary,
  Camera,
  X,
  Aperture,
  Sliders,
} from "lucide-react";

interface ThumbnailProps {
  id: string;
  category: string;
  className?: string;
}

export function ComponentThumbnail({ id, className = "" }: ThumbnailProps) {
  const frame = `h-20 w-full rounded-lg bg-muted/20 border border-border/60 flex items-center justify-center p-2.5 overflow-hidden ${className}`;

  switch (id) {
    case "button":
      return (
        <div className={`${frame} gap-2`}>
          <span className="px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-medium">
            Deploy
          </span>
          <span className="px-3 py-1.5 rounded-md border border-border bg-card text-foreground text-xs font-medium">
            Cancel
          </span>
        </div>
      );

    case "pro-buttons":
      return (
        <div className={`${frame} gap-2`}>
          <div className="inline-flex rounded-md border border-border bg-background overflow-hidden text-xs">
            <span className="px-2.5 py-1 bg-foreground text-background font-medium text-[11px]">Merge</span>
            <span className="px-2 py-1 bg-muted text-foreground text-[11px] border-l border-border">
              <ChevronDown className="w-3 h-3" />
            </span>
          </div>
        </div>
      );

    case "input":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] h-8 rounded-md border border-border bg-background px-2.5 flex items-center gap-2 text-xs">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-foreground truncate text-[11px] font-mono">api.example.com</span>
          </div>
        </div>
      );

    case "pro-inputs":
      return (
        <div className={`${frame} gap-1.5`}>
          {["4", "8", "2", "9"].map((digit, i) => (
            <div key={i} className="w-8 h-8 rounded border border-border bg-background text-sm font-mono font-bold text-foreground flex items-center justify-center tabular-nums">
              {digit}
            </div>
          ))}
        </div>
      );

    case "special-forms":
      return (
        <div className={`${frame} gap-2`}>
          <div className="px-2 py-1.5 rounded border-2 border-foreground bg-background text-[10px] font-medium text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-foreground" />
            <span>Standard</span>
          </div>
          <div className="px-2 py-1.5 rounded border border-border bg-muted/30 text-[10px] text-muted-foreground">
            Team
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className={frame}>
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
        <div className={frame}>
          <div className="w-full max-w-[210px] h-8 rounded-md border border-border bg-background px-2.5 flex items-center justify-between text-xs">
            <span className="text-foreground text-[11px]">us-east-1 (Virginia)</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          </div>
        </div>
      );

    case "switch":
      return (
        <div className={frame}>
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
        <div className={frame}>
          <div className="w-full max-w-[210px] space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground tabular-nums">
              <span>Memory limit</span>
              <span className="text-foreground font-semibold">72%</span>
            </div>
            <div className="relative h-1.5 w-full bg-muted rounded-full">
              <div className="h-full w-[72%] bg-foreground rounded-full" />
              <div className="absolute left-[72%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-border bg-background" />
            </div>
          </div>
        </div>
      );

    case "rating":
      return (
        <div className={`${frame} gap-2`}>
          <div className="flex items-center gap-1 text-foreground">
            {[0, 1, 2, 3].map((i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-foreground text-foreground" />
            ))}
            <div className="relative w-3.5 h-3.5">
              <Star className="w-3.5 h-3.5 text-muted-foreground/40" />
              <div className="absolute inset-0 w-1/2 overflow-hidden">
                <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-foreground tabular-nums">4.5</span>
        </div>
      );

    case "file-upload":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] h-12 rounded border border-dashed border-border bg-background flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Upload className="w-3.5 h-3.5 text-foreground" />
            <span className="text-[11px]">Drop CSV or JSON</span>
          </div>
        </div>
      );

    case "card":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] rounded-md border border-border bg-background p-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground">Monthly ARR</div>
              <div className="text-xs font-mono font-bold text-foreground tabular-nums">$124,500</div>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-foreground font-medium tabular-nums">
              +14.2%
            </span>
          </div>
        </div>
      );

    case "accordion":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] rounded-md border border-border bg-background px-2.5 py-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground text-[11px]">API Authentication</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
      );

    case "tabs":
      return (
        <div className={frame}>
          <div className="flex rounded-md border border-border bg-muted/40 p-0.5 text-xs">
            <span className="px-2.5 py-1 rounded bg-background font-medium text-foreground text-[11px]">
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
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded border border-border bg-background text-[10px] font-mono overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/40 px-2 py-1 text-muted-foreground font-semibold border-b border-border">
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
            </div>
            <div className="grid grid-cols-3 px-2 py-1 text-foreground">
              <span>m.kato</span>
              <span>Admin</span>
              <span className="font-semibold">Active</span>
            </div>
          </div>
        </div>
      );

    case "stepper":
      return (
        <div className={frame}>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <div className="w-8 h-0.5 bg-foreground" />
            <div className="w-5 h-5 rounded-full border-2 border-foreground bg-background text-foreground flex items-center justify-center text-[10px] font-bold font-mono">
              2
            </div>
            <div className="w-8 h-0.5 bg-muted" />
            <div className="w-5 h-5 rounded-full border border-border bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-mono">
              3
            </div>
          </div>
        </div>
      );

    case "scroll-area":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] h-12 rounded border border-border bg-background p-1.5 flex justify-between">
            <div className="space-y-1 text-[10px] font-mono text-muted-foreground">
              <div className="text-foreground">01: session_init</div>
              <div>02: tls_handshake</div>
            </div>
            <div className="w-1 bg-muted rounded-full relative">
              <div className="w-full h-1/2 bg-foreground/50 rounded-full" />
            </div>
          </div>
        </div>
      );

    case "navigation":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] h-8 rounded-md border border-border bg-background px-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <span>Docs</span>
              <span>/</span>
              <span className="text-foreground font-semibold">Components</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">1 / 4</span>
          </div>
        </div>
      );

    case "dock":
      return (
        <div className={frame}>
          <div className="flex items-end gap-1.5 px-2.5 py-1.5 rounded-xl border border-border bg-background">
            <div className="w-6 h-6 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground">
              <Folder className="w-3.5 h-3.5" />
            </div>
            <div className="w-6 h-6 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center -translate-y-1">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="w-6 h-6 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground">
              <Settings className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      );

    case "data-display":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="rounded border border-border bg-background p-1.5">
              <div className="text-muted-foreground">p95 Latency</div>
              <div className="text-foreground font-bold tabular-nums">12ms</div>
            </div>
            <div className="rounded border border-border bg-background p-1.5">
              <div className="text-muted-foreground">Requests</div>
              <div className="text-foreground font-bold tabular-nums">4.8k/s</div>
            </div>
          </div>
        </div>
      );

    case "charts":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] h-12 flex items-end gap-1.5 px-2">
            {[35, 55, 45, 80, 65, 95, 75, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-foreground rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      );

    case "commerce":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] rounded-md border border-border bg-background p-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground">Desk Lamp</div>
              <div className="text-xs font-mono font-bold text-foreground tabular-nums">$129.00</div>
            </div>
            <span className="px-2.5 py-1 rounded bg-foreground text-background text-[10px] font-medium">
              Add to bag
            </span>
          </div>
        </div>
      );

    case "premium-media":
      return (
        <div className={`${frame} gap-1`}>
          {[30, 60, 45, 90, 75, 40, 85, 50, 70].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-foreground rounded-full"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      );

    case "modal":
    case "dialog":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] rounded-lg border border-border bg-background p-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="text-[11px]">Delete workspace?</span>
              <X className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="flex justify-end gap-1.5 pt-0.5">
              <span className="px-2 py-0.5 rounded border border-border text-[9px] text-muted-foreground">Cancel</span>
              <span className="px-2 py-0.5 rounded bg-foreground text-background text-[9px] font-medium">Delete</span>
            </div>
          </div>
        </div>
      );

    case "premium-overlays":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] h-12 rounded border border-border bg-background flex overflow-hidden">
            <div className="w-2/3 p-1.5 text-[9px] text-muted-foreground">Main viewport</div>
            <div className="w-1/3 border-l border-border bg-muted/40 p-1.5 text-[9px] font-semibold text-foreground">Sheet</div>
          </div>
        </div>
      );

    case "alert":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded-md border border-border bg-background p-2 flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4 text-foreground shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-[11px] text-foreground">Region healthy</div>
              <div className="text-[10px] text-muted-foreground truncate">All replicas synced</div>
            </div>
          </div>
        </div>
      );

    case "badge":
      return (
        <div className={`${frame} gap-2`}>
          <span className="px-2.5 py-1 rounded-full bg-foreground text-background text-[11px] font-mono font-semibold">
            Stable
          </span>
          <span className="px-2.5 py-1 rounded-full border border-border bg-background text-[11px] font-mono font-medium text-foreground">
            v2.0
          </span>
        </div>
      );

    case "avatar":
      return (
        <div className={`${frame} gap-2`}>
          <div className="w-8 h-8 rounded-full border border-border bg-foreground text-background flex items-center justify-center font-mono text-xs font-bold">
            MK
          </div>
          <div className="w-8 h-8 rounded-full border border-border bg-muted text-foreground flex items-center justify-center font-mono text-xs font-bold -ml-4">
            SR
          </div>
          <div className="w-8 h-8 rounded-full border border-border bg-background text-muted-foreground flex items-center justify-center font-mono text-xs -ml-4">
            +3
          </div>
        </div>
      );

    case "tooltip":
      return (
        <div className={`${frame} flex-col`}>
          <div className="px-2 py-0.5 rounded bg-foreground text-background text-[10px] font-medium mb-1">
            Copy endpoint URL
          </div>
          <span className="px-2.5 py-1 rounded border border-border bg-background text-xs font-mono text-muted-foreground">
            api.example.com
          </span>
        </div>
      );

    case "progress":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono tabular-nums">
              <span className="text-muted-foreground">Uploading</span>
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
        <div className={frame}>
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
        <div className={`${frame} gap-3`}>
          <div className="w-5 h-5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
          <div className="flex items-center gap-1">
            <span className="w-1 h-3 rounded-full bg-foreground/40" />
            <span className="w-1 h-5 rounded-full bg-foreground" />
            <span className="w-1 h-3 rounded-full bg-foreground/40" />
          </div>
        </div>
      );

    case "toaster":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] p-2 rounded-lg border border-border bg-background flex items-center gap-2 text-xs">
            <span className="w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span className="text-[11px] font-medium text-foreground">Changes saved</span>
          </div>
        </div>
      );

    case "social":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] rounded border border-border bg-background p-2 flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-muted font-mono text-[10px] flex items-center justify-center font-bold">MK</div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[10px] text-foreground">Mina Kato</div>
              <div className="text-[9px] text-muted-foreground truncate">Merged schema migration</div>
            </div>
          </div>
        </div>
      );

    case "dark-mode":
      return (
        <div className={frame}>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background">
            <Sun className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="w-7 h-3.5 rounded-full bg-foreground p-0.5 flex justify-end">
              <div className="w-2.5 h-2.5 rounded-full bg-background" />
            </div>
            <Moon className="w-3.5 h-3.5 text-foreground" />
          </div>
        </div>
      );

    case "aurora-border-card":
      return (
        <div className={frame}>
          <div className="w-full max-w-[200px] rounded-lg border-2 border-foreground/70 bg-background px-3 py-2 flex items-center justify-between text-xs">
            <span className="text-[10px] font-medium text-foreground">Perimeter Stroke</span>
            <span className="text-[9px] font-mono text-muted-foreground">SVG</span>
          </div>
        </div>
      );

    case "aurora-search-pill":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] h-8 rounded-full border border-foreground/40 bg-background px-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px]">Ask or search...</span>
            <Search className="w-3 h-3 text-foreground" />
          </div>
        </div>
      );

    case "ai-prompt-input":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded-lg border border-border bg-background p-2 flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground truncate">Summarize release notes...</span>
            <div className="w-5 h-5 rounded bg-foreground text-background flex items-center justify-center text-[10px] shrink-0 font-bold">
              ↑
            </div>
          </div>
        </div>
      );

    case "command":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] h-8 rounded-md border border-border bg-background px-2.5 flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px] font-mono">Type a command...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-foreground">⌘K</kbd>
          </div>
        </div>
      );

    case "interactive-code-block":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] rounded-md border border-border bg-background p-2 font-mono text-[10px] flex items-center justify-between">
            <span className="text-foreground">$ npx nexoreui add</span>
            <span className="text-[10px] text-muted-foreground font-sans">Copy</span>
          </div>
        </div>
      );

    case "aurora-border-fx":
      return (
        <div className={frame}>
          <div className="w-full max-w-[200px] rounded-lg border border-border bg-background px-2.5 py-2 flex items-center justify-between">
            <span className="text-[10px] font-medium text-foreground">Border Presets</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-foreground" />
              <span className="w-2.5 h-2.5 rounded-full bg-foreground/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-foreground/20" />
            </div>
          </div>
        </div>
      );

    case "morphing-geometry":
      return (
        <div className={`${frame} gap-3`}>
          <div className="w-7 h-7 rounded-md border border-foreground/40 bg-muted/40" />
          <div className="w-8 h-8 rounded-xl border-2 border-foreground bg-foreground/10 rotate-12" />
          <div className="w-7 h-7 rounded-full border border-foreground/40 bg-muted/40" />
        </div>
      );

    case "marquee":
      return (
        <div className={frame}>
          <div className="w-full max-w-[210px] overflow-hidden flex items-center gap-1.5 font-mono">
            <span className="px-2 py-0.5 rounded bg-background border border-border text-[10px] whitespace-nowrap">React 19</span>
            <span className="px-2 py-0.5 rounded bg-background border border-border text-[10px] whitespace-nowrap">Tailwind v4</span>
            <span className="px-2 py-0.5 rounded bg-background border border-border text-[10px] whitespace-nowrap">TypeScript</span>
          </div>
        </div>
      );

    case "number-ticker":
      return (
        <div className={frame}>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-foreground tabular-nums">1,248</div>
            <div className="text-[10px] text-muted-foreground">Requests / min</div>
          </div>
        </div>
      );

    case "blur-fade":
      return (
        <div className={frame}>
          <div className="flex items-center gap-2">
            <div className="w-14 h-10 rounded-md border border-border bg-background p-1.5 flex flex-col justify-between text-[8px] font-mono text-foreground">
              <span className="text-muted-foreground">01</span>
              <span className="font-semibold">Sharp</span>
            </div>
            <div className="w-14 h-10 rounded-md border border-border/70 bg-background/80 p-1.5 flex flex-col justify-between text-[8px] font-mono text-foreground opacity-75">
              <span className="text-muted-foreground">02</span>
              <span>Mid</span>
            </div>
            <div className="w-14 h-10 rounded-md border border-border/40 bg-background/50 p-1.5 flex flex-col justify-between text-[8px] font-mono text-muted-foreground opacity-45">
              <span className="text-muted-foreground">03</span>
              <span>Soft</span>
            </div>
          </div>
        </div>
      );

    case "premium-effects":
      return (
        <div className={frame}>
          <div className="w-full max-w-[200px] h-12 rounded-lg border border-border bg-card p-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold text-foreground">Spotlight Grid</div>
              <div className="text-[9px] text-muted-foreground">Cursor radial track</div>
            </div>
            <Aperture className="w-3.5 h-3.5 text-foreground" />
          </div>
        </div>
      );

    case "ultra-effects":
      return (
        <div className={frame}>
          <div className="w-full max-w-[200px] h-12 rounded-lg border border-border bg-background px-2.5 flex items-center justify-between text-[10px] font-mono">
            <span className="text-foreground font-semibold">BoxReveal</span>
            <span className="px-1.5 py-0.5 rounded bg-foreground text-background text-[9px]">Wipe</span>
          </div>
        </div>
      );

    case "ultra-components":
      return (
        <div className={`${frame} relative`}>
          <div className="absolute inset-x-0 bottom-0 h-10 [perspective:200px] pointer-events-none opacity-40">
            <div className="w-full h-full [transform:rotateX(60deg)] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:10px_10px]" />
          </div>
          <div className="relative z-10 px-3 py-1 rounded-md border border-foreground/40 bg-background text-[10px] font-mono font-semibold text-foreground">
            RetroGrid
          </div>
        </div>
      );

    case "special-animations":
      return (
        <div className={frame}>
          <div className="w-full max-w-[200px] space-y-1">
            <div className="px-2 py-0.5 rounded border border-border bg-background flex items-center justify-between text-[9px] font-mono">
              <span className="text-foreground">01 Stagger</span>
              <span className="text-muted-foreground">60ms</span>
            </div>
            <div className="px-2 py-0.5 rounded border border-border bg-background/80 translate-x-1.5 flex items-center justify-between text-[9px] font-mono">
              <span className="text-foreground">02 Magnetic</span>
              <span className="text-muted-foreground">Spring</span>
            </div>
          </div>
        </div>
      );

    case "pro-cards":
    case "holo-finish-card":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[190px] h-12 flex items-center justify-center">
            <div className="absolute w-36 h-10 rounded-lg border border-border/50 bg-muted/30 rotate-6 translate-x-2 translate-y-1" />
            <div className="relative w-36 h-10 rounded-lg border border-foreground/60 bg-card px-2.5 flex items-center justify-between -rotate-2">
              <span className="text-[10px] font-mono font-bold text-foreground">HoloFinish</span>
              <span className="text-[9px] font-mono px-1 rounded bg-muted text-foreground">3D</span>
            </div>
          </div>
        </div>
      );

    case "pro-objects":
    case "live-object":
      return (
        <div className={frame}>
          <div className="relative w-12 h-12 flex items-center justify-center [perspective:600px]">
            <div className="w-10 h-10 rounded-lg border border-foreground/60 bg-muted/40 [transform:rotateX(25deg)_rotateY(-25deg)] flex items-center justify-center">
              <Box className="w-5 h-5 text-foreground stroke-[1.5]" />
            </div>
          </div>
        </div>
      );

    case "sound-pulse":
      return (
        <div className={frame}>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-foreground/20" />
            <div className="absolute inset-1.5 rounded-full border border-foreground/40" />
            <div className="absolute inset-3 rounded-full border border-foreground/70" />
            <div className="w-3 h-3 rounded-full bg-foreground" />
          </div>
        </div>
      );

    case "silk-unveil":
      return (
        <div className={frame}>
          <div className="w-full max-w-[190px] h-10 rounded border border-border bg-background p-1.5 flex flex-col justify-between overflow-hidden relative">
            <svg className="w-full h-full text-foreground/50" viewBox="0 0 160 28" fill="none">
              <path d="M0 14 C40 0, 80 28, 120 14 C140 7, 150 20, 160 14" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 20 C40 6, 80 34, 120 20 C140 13, 150 26, 160 20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
            </svg>
            <span className="absolute bottom-1 right-2 text-[9px] font-mono text-muted-foreground">Verlet</span>
          </div>
        </div>
      );

    case "node-flow-graph":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[210px] h-12 flex items-center justify-between px-1">
            <div className="relative px-2 py-1 rounded border border-border bg-background text-[9px] font-mono z-10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
              <span>Input</span>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 200 48">
              <path d="M 60 24 C 95 24, 105 24, 140 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/70" strokeDasharray="3 3" />
            </svg>
            <div className="relative px-2 py-1 rounded border border-foreground bg-foreground text-background text-[9px] font-mono font-semibold z-10 flex items-center gap-1">
              <span>Output</span>
              <Check className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      );

    case "glass-lens":
      return (
        <div className={frame}>
          <div className="relative w-11 h-11 rounded-full border-2 border-foreground/80 bg-foreground/10 flex items-center justify-center">
            <div className="absolute inset-1 rounded-full border border-dashed border-foreground/40" />
            <span className="text-[9px] font-mono font-bold text-foreground tabular-nums">1.12x</span>
          </div>
        </div>
      );

    case "fluted-glass":
      return (
        <div className={frame}>
          <div className="w-full max-w-[190px] h-10 rounded border border-border bg-background flex divide-x divide-border overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-muted/40" : "bg-transparent"}`} />
            ))}
          </div>
        </div>
      );

    case "ripple-water":
      return (
        <div className={frame}>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-foreground/20" />
            <div className="absolute inset-2 rounded-full border border-foreground/50" />
            <Waves className="w-4 h-4 text-foreground relative z-10" />
          </div>
        </div>
      );

    case "scroll-warp":
      return (
        <div className={frame}>
          <svg className="w-36 h-10 text-foreground" viewBox="0 0 144 40" fill="none">
            <path d="M12 6 Q72 18 132 6 L124 34 Q72 22 20 34 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" />
          </svg>
        </div>
      );

    case "twist-ribbon":
      return (
        <div className={frame}>
          <svg className="w-36 h-8 text-foreground" viewBox="0 0 144 32" fill="none">
            <path d="M4 16 C36 2, 72 30, 108 16 C124 10, 134 22, 140 16" stroke="currentColor" strokeWidth="2" />
            <path d="M4 22 C36 8, 72 36, 108 22 C124 16, 134 28, 140 22" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
          </svg>
        </div>
      );

    case "dither-image":
      return (
        <div className={frame}>
          <div className="w-full max-w-[190px] h-10 rounded border border-border bg-background px-2.5 flex items-center justify-between">
            <Binary className="w-4 h-4 text-foreground" />
            <span className="text-[10px] font-mono text-muted-foreground">Bayer 8x8</span>
          </div>
        </div>
      );

    case "gravity-grid":
      return (
        <div className={frame}>
          <svg className="w-36 h-11 text-foreground" viewBox="0 0 144 44" fill="none">
            <path d="M8 10 Q72 20 136 10 M8 22 Q72 32 136 22 M8 34 Q72 40 136 34" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
            <path d="M36 4 Q48 22 36 40 M72 4 L72 40 M108 4 Q96 22 108 40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
            <circle cx="72" cy="24" r="3.5" fill="currentColor" />
          </svg>
        </div>
      );

    case "scroll-drum":
      return (
        <div className={frame}>
          <div className="flex flex-col items-center leading-none font-mono">
            <span className="text-[8px] text-muted-foreground/50 scale-x-90">01 INDEX</span>
            <span className="text-xs font-bold text-foreground my-0.5">02 CYLINDER</span>
            <span className="text-[8px] text-muted-foreground/50 scale-x-90">03 ROTATE</span>
          </div>
        </div>
      );

    case "liquid-smear":
      return (
        <div className={frame}>
          <svg className="w-36 h-10 text-foreground" viewBox="0 0 144 40" fill="none">
            <path d="M16 26 C40 6, 62 34, 92 14 C106 6, 120 18, 130 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.85" />
            <path d="M22 32 C46 14, 70 36, 98 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
          </svg>
        </div>
      );

    case "type-proximity":
      return (
        <div className={frame}>
          <div className="flex items-baseline gap-1 font-sans text-foreground">
            <span className="text-xs font-light opacity-50">A</span>
            <span className="text-sm font-normal opacity-75">B</span>
            <span className="text-lg font-extrabold">C</span>
            <span className="text-sm font-normal opacity-75">D</span>
            <span className="text-xs font-light opacity-50">E</span>
          </div>
        </div>
      );

    case "holo-foil":
      return (
        <div className={frame}>
          <div className="w-full max-w-[190px] h-10 rounded-md border border-foreground/40 bg-background px-2.5 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-foreground">Foil Pass</span>
            <Sliders className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
      );

    case "letter-pile":
      return (
        <div className={frame}>
          <div className="flex items-end gap-1 font-mono text-[11px] font-bold text-foreground">
            <span className="w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center -rotate-12">N</span>
            <span className="w-6 h-6 rounded-full border border-foreground bg-foreground text-background flex items-center justify-center translate-y-0.5 rotate-6">X</span>
            <span className="w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center -rotate-6">R</span>
            <span className="w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center rotate-12">E</span>
          </div>
        </div>
      );

    case "flow-field":
      return (
        <div className={frame}>
          <svg className="w-36 h-10 text-foreground" viewBox="0 0 144 40" fill="none">
            <path d="M8 10 Q40 4 72 16 T136 12" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
            <path d="M8 20 Q44 14 76 26 T136 22" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
            <path d="M8 30 Q48 24 80 34 T136 32" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
          </svg>
        </div>
      );

    case "text-rail":
      return (
        <div className={frame}>
          <svg className="w-40 h-11 text-foreground" viewBox="0 0 160 44" fill="none">
            <path d="M6 32 C46 6, 114 38, 154 12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.5" />
            <text x="26" y="24" fill="currentColor" fontSize="9" fontFamily="monospace" fontWeight="700">SPLINE PATH</text>
          </svg>
        </div>
      );

    case "moire-grating":
      return (
        <div className={frame}>
          <div className="relative w-32 h-10 rounded border border-border bg-background overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,var(--foreground)_0_1px,transparent_1px_5px)] opacity-25" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(84deg,var(--foreground)_0_1px,transparent_1px_5px)] opacity-35" />
          </div>
        </div>
      );

    case "swipe-deck":
      return (
        <div className={frame}>
          <div className="relative w-24 h-11 flex items-center justify-center">
            <div className="absolute w-20 h-9 rounded-md border border-border bg-muted/50 -rotate-6 -translate-x-2" />
            <div className="absolute w-20 h-9 rounded-md border border-border bg-muted/80 rotate-3 translate-x-1" />
            <div className="relative w-20 h-9 rounded-md border border-foreground/60 bg-background flex items-center justify-center text-[9px] font-mono font-semibold text-foreground">
              01 / 04
            </div>
          </div>
        </div>
      );

    case "camera-mirror":
      return (
        <div className={frame}>
          <div className="w-full max-w-[190px] h-10 rounded border border-border bg-background px-2.5 flex items-center justify-between">
            <Camera className="w-3.5 h-3.5 text-foreground" />
            <span className="text-[10px] font-mono text-muted-foreground">ASCII · Halftone</span>
          </div>
        </div>
      );

    case "scroll-reveal":
      return (
        <div className={frame}>
          <div className="w-full max-w-[190px] rounded border border-border bg-background px-2.5 py-1.5 flex items-center justify-between">
            <span className="text-[10px] font-mono text-foreground">view()</span>
            <div className="flex items-center gap-1">
              <span className="w-4 h-1 rounded bg-foreground/25" />
              <span className="w-4 h-1 rounded bg-foreground/55" />
              <span className="w-4 h-1 rounded bg-foreground" />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={frame}>
          <div className="px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium text-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] capitalize">{id.replace(/-/g, " ")}</span>
          </div>
        </div>
      );
  }
}
