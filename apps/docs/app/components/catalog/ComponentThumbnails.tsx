"use client";

import React from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Terminal,
  Search,
  Upload,
  Moon,
  Sun,
  ShieldCheck,
  Layers,
  Star,
  FolderGit2,
  Settings,
  Home,
  X,
  FileText,
  ArrowUpRight,
  Mic,
  Paperclip,
  Play,
  Copy,
  SlidersHorizontal,
  Bell,
  Lock,
} from "lucide-react";

interface ThumbnailProps {
  id: string;
  category: string;
  className?: string;
}

const BAYER_MATRIX = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

const SOUND_PULSE_BARS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
  const amp = 10 + ((Math.sin(i * 1.4) + 1) * 5) + (i % 3 === 0 ? 4 : 0);
  const r1 = 14;
  const r2 = r1 + amp;
  return {
    x1: (44 + Math.cos(angle) * r1).toFixed(2),
    y1: (44 + Math.sin(angle) * r1).toFixed(2),
    x2: (44 + Math.cos(angle) * r2).toFixed(2),
    y2: (44 + Math.sin(angle) * r2).toFixed(2),
    strong: i % 2 === 0,
  };
});

const WAVEFORM_BARS = [
  24, 38, 62, 46, 84, 72, 34, 56, 92, 68, 42, 76, 88, 52, 30, 64, 78, 48, 36, 54,
];

export function ComponentThumbnail({ id, className = "" }: ThumbnailProps) {
  const frame = `h-32 w-full rounded-lg bg-muted/25 border border-border/80 flex items-center justify-center p-3 overflow-hidden relative select-none bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:14px_14px] ${className}`;

  switch (id) {
    case "button":
      return (
        <div className={frame}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-md bg-foreground text-background text-[11px] font-medium shadow-xs">
                Deploy
              </span>
              <span className="px-3 py-1.5 rounded-md border border-border bg-card text-foreground text-[11px] font-medium shadow-xs">
                Preview
              </span>
              <span className="px-2.5 py-1.5 rounded-md bg-muted text-muted-foreground text-[11px] font-medium">
                Logs
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <span className="px-2 py-0.5 rounded border border-destructive/30 bg-destructive/10 text-destructive">
                Revoke
              </span>
              <span className="px-2 py-0.5 rounded border border-border bg-background text-muted-foreground">
                ⌘ Enter
              </span>
            </div>
          </div>
        </div>
      );

    case "pro-buttons":
      return (
        <div className={frame}>
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex rounded-md border border-border bg-card overflow-hidden shadow-xs">
              <span className="px-3 py-1.5 bg-foreground text-background font-medium text-[11px]">
                Merge PR
              </span>
              <span className="px-2 py-1.5 bg-card text-foreground border-l border-border flex items-center">
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="inline-flex items-center rounded-md border border-border bg-background p-0.5 gap-0.5 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-muted text-foreground font-semibold">Day</span>
              <span className="px-2 py-0.5 text-muted-foreground">Week</span>
              <span className="px-2 py-0.5 text-muted-foreground">Month</span>
            </div>
          </div>
        </div>
      );

    case "input":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-medium text-foreground">Workspace domain</span>
              <span className="font-mono text-success">Verified</span>
            </div>
            <div className="h-8 rounded-md border border-border bg-background px-2.5 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-foreground truncate text-[11px] font-mono">api.nexore.dev</span>
              </div>
              <Check className="w-3.5 h-3.5 text-success shrink-0" />
            </div>
          </div>
        </div>
      );

    case "pro-inputs":
      return (
        <div className={frame}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5">
              {["4", "8", "2", "9"].map((digit, i) => (
                <div
                  key={i}
                  className={`w-8 h-9 rounded-md border bg-background text-sm font-mono font-bold text-foreground flex items-center justify-center tabular-nums shadow-xs ${
                    i === 2 ? "border-foreground ring-1 ring-foreground/20" : "border-border"
                  }`}
                >
                  {digit}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <span className="px-1.5 py-0.5 rounded border border-border bg-background text-foreground">
                $1,240.00
              </span>
              <span className="px-1.5 py-0.5 rounded border border-border bg-card text-muted-foreground">
                react ×
              </span>
              <span className="px-1.5 py-0.5 rounded border border-border bg-card text-muted-foreground">
                ts ×
              </span>
            </div>
          </div>
        </div>
      );

    case "special-forms":
      return (
        <div className={frame}>
          <div className="w-full max-w-[230px] grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg border-2 border-foreground bg-card shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">Standard</span>
                <span className="w-3 h-3 rounded-full bg-foreground flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-background" />
                </span>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground tabular-nums">$29 / mo</div>
            </div>
            <div className="p-2 rounded-lg border border-border bg-background space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">Team</span>
                <span className="w-3 h-3 rounded-full border border-border" />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground tabular-nums">$99 / mo</div>
            </div>
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded-lg border border-border bg-card p-2 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 px-1.5 py-1 rounded bg-muted/40">
              <div className="w-4 h-4 rounded bg-foreground text-background flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-[11px] text-foreground font-medium">Session auto-save</span>
            </div>
            <div className="flex items-center gap-2 px-1.5 py-1">
              <div className="w-4 h-4 rounded border border-border bg-background shrink-0" />
              <span className="text-[11px] text-muted-foreground">Audit log webhook</span>
            </div>
          </div>
        </div>
      );

    case "select":
      return (
        <div className={frame}>
          <div className="w-full max-w-[215px] space-y-1">
            <div className="h-7 rounded-md border border-foreground/40 bg-background px-2.5 flex items-center justify-between text-[11px] shadow-xs">
              <span className="text-foreground font-medium">us-east-1 (Virginia)</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </div>
            <div className="rounded-md border border-border bg-card p-1 shadow-xs space-y-0.5 text-[10px]">
              <div className="px-2 py-0.5 rounded bg-muted text-foreground font-medium flex items-center justify-between">
                <span>us-east-1 (Virginia)</span>
                <Check className="w-3 h-3" />
              </div>
              <div className="px-2 py-0.5 text-muted-foreground">eu-central-1 (Frankfurt)</div>
            </div>
          </div>
        </div>
      );

    case "switch":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded-lg border border-border bg-card divide-y divide-border shadow-xs">
            <div className="px-2.5 py-2 flex items-center justify-between">
              <span className="text-[11px] text-foreground font-medium">Auto-deploy</span>
              <div className="w-8 h-4 rounded-full bg-foreground p-0.5 flex justify-end">
                <div className="w-3 h-3 rounded-full bg-background" />
              </div>
            </div>
            <div className="px-2.5 py-2 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Maintenance mode</span>
              <div className="w-8 h-4 rounded-full bg-muted border border-border p-0.5 flex justify-start">
                <div className="w-3 h-3 rounded-full bg-foreground/40" />
              </div>
            </div>
          </div>
        </div>
      );

    case "slider":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded-lg border border-border bg-card p-2.5 space-y-2.5 shadow-xs">
            <div className="flex justify-between text-[10px] font-mono tabular-nums">
              <span className="text-muted-foreground">Price range</span>
              <span className="text-foreground font-semibold">$40 – $180</span>
            </div>
            <div className="relative h-1.5 w-full bg-muted rounded-full">
              <div className="absolute left-[20%] right-[25%] h-full bg-foreground rounded-full" />
              <div className="absolute left-[20%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-foreground bg-background shadow-xs" />
              <div className="absolute left-[75%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-foreground bg-background shadow-xs" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground tabular-nums">
              <span>$0</span>
              <span>$125</span>
              <span>$250</span>
            </div>
          </div>
        </div>
      );

    case "rating":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded-lg border border-border bg-card p-2.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                ))}
                <div className="relative w-3.5 h-3.5">
                  <Star className="w-3.5 h-3.5 text-muted-foreground/40" />
                  <div className="absolute inset-0 w-1/2 overflow-hidden">
                    <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-foreground tabular-nums">4.5</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
                <span>5★</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[78%] bg-foreground rounded-full" />
                </div>
                <span className="tabular-nums">78%</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
                <span>4★</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[16%] bg-foreground/60 rounded-full" />
                </div>
                <span className="tabular-nums">16%</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "file-upload":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] space-y-1.5">
            <div className="h-11 rounded-lg border border-dashed border-border bg-card flex items-center justify-center gap-2 text-muted-foreground">
              <Upload className="w-3.5 h-3.5 text-foreground" />
              <span className="text-[10px] font-medium text-foreground">Drop CSV or JSON</span>
            </div>
            <div className="px-2 py-1 rounded-md border border-border bg-background flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 min-w-0">
                <FileText className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="font-mono text-foreground truncate">schema.json</span>
              </div>
              <span className="font-mono text-muted-foreground tabular-nums shrink-0">42 KB</span>
            </div>
          </div>
        </div>
      );

    case "card":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded-lg border border-border bg-card p-2.5 space-y-2 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                  Monthly ARR
                </div>
                <div className="text-sm font-mono font-bold text-foreground tabular-nums mt-0.5">
                  $124,500
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-success/10 border border-success/20 text-[10px] font-mono text-success font-medium tabular-nums">
                +14.2%
              </span>
            </div>
            <div className="pt-1.5 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Rolling 30d window</span>
              <ArrowUpRight className="w-3 h-3 text-foreground" />
            </div>
          </div>
        </div>
      );

    case "accordion":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded-lg border border-border bg-card divide-y divide-border shadow-xs overflow-hidden">
            <div className="p-2 bg-muted/30 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-foreground">API Authentication</span>
                <ChevronDown className="w-3 h-3 text-foreground rotate-180" />
              </div>
              <p className="text-[9px] text-muted-foreground leading-snug">
                Scoped bearer tokens with automatic key rotation.
              </p>
            </div>
            <div className="px-2 py-1.5 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Rate limiting</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </div>
      );

    case "tabs":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] space-y-1.5">
            <div className="grid grid-cols-3 rounded-lg border border-border bg-muted/50 p-0.5 text-[10px]">
              <span className="py-1 text-center rounded-md bg-background font-semibold text-foreground shadow-xs">
                Overview
              </span>
              <span className="py-1 text-center text-muted-foreground">Metrics</span>
              <span className="py-1 text-center text-muted-foreground">Logs</span>
            </div>
            <div className="rounded-lg border border-border bg-card p-2 text-[10px] text-muted-foreground flex items-center justify-between">
              <span>All 4 regions operational</span>
              <span className="font-mono text-foreground tabular-nums">12ms</span>
            </div>
          </div>
        </div>
      );

    case "table":
      return (
        <div className={frame}>
          <div className="w-full max-w-[230px] rounded-lg border border-border bg-card text-[10px] font-mono overflow-hidden shadow-xs">
            <div className="grid grid-cols-3 bg-muted/50 px-2 py-1 text-muted-foreground font-semibold border-b border-border">
              <span>User</span>
              <span>Role</span>
              <span className="text-right">Uptime</span>
            </div>
            <div className="divide-y divide-border">
              <div className="grid grid-cols-3 px-2 py-1 text-foreground">
                <span className="truncate">m.kato</span>
                <span className="text-muted-foreground">Admin</span>
                <span className="text-right tabular-nums">99.9%</span>
              </div>
              <div className="grid grid-cols-3 px-2 py-1 text-foreground">
                <span className="truncate">t.lind</span>
                <span className="text-muted-foreground">Ops</span>
                <span className="text-right tabular-nums">98.4%</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "stepper":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] flex items-start justify-between">
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-[9px] font-medium text-foreground">Account</span>
            </div>
            <div className="flex-1 h-0.5 bg-foreground mt-3 mx-1" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full border-2 border-foreground bg-background text-foreground flex items-center justify-center text-[10px] font-bold font-mono tabular-nums">
                2
              </div>
              <span className="text-[9px] font-semibold text-foreground">Billing</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mt-3 mx-1" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full border border-border bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-mono tabular-nums">
                3
              </div>
              <span className="text-[9px] text-muted-foreground">Review</span>
            </div>
          </div>
        </div>
      );

    case "scroll-area":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] h-20 rounded-lg border border-border bg-card p-2 flex justify-between gap-2 shadow-xs">
            <div className="space-y-1 text-[10px] font-mono text-muted-foreground overflow-hidden">
              <div className="text-foreground">01: session_init ok</div>
              <div>02: tls_handshake 8ms</div>
              <div>03: edge_cache hit</div>
              <div className="opacity-50">04: worker_sync ready</div>
            </div>
            <div className="w-1.5 bg-muted rounded-full p-[1px] shrink-0">
              <div className="w-full h-7 bg-foreground/60 rounded-full" />
            </div>
          </div>
        </div>
      );

    case "navigation":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] space-y-2">
            <div className="h-7 rounded-md border border-border bg-card px-2.5 flex items-center gap-1 text-[10px] font-mono text-muted-foreground shadow-xs">
              <span>Docs</span>
              <ChevronRight className="w-3 h-3" />
              <span>Layout</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-semibold">Navigation</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-[10px] font-mono tabular-nums">
              <span className="w-6 h-6 rounded-md border border-border bg-background text-muted-foreground flex items-center justify-center">
                1
              </span>
              <span className="w-6 h-6 rounded-md bg-foreground text-background font-bold flex items-center justify-center">
                2
              </span>
              <span className="w-6 h-6 rounded-md border border-border bg-background text-muted-foreground flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>
      );

    case "dock":
      return (
        <div className={frame}>
          <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-border bg-card shadow-xs">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground">
              <Home className="w-3.5 h-3.5" />
            </div>
            <div className="h-7 px-2.5 rounded-lg bg-foreground text-background flex items-center gap-1.5 text-[10px] font-medium">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Projects</span>
            </div>
            <div className="w-px h-4 bg-border mx-0.5" />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground">
              <Settings className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      );

    case "data-display":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border bg-card p-2 space-y-1 shadow-xs">
              <div className="text-[9px] font-mono uppercase text-muted-foreground">p95 Latency</div>
              <div className="text-sm font-mono font-bold text-foreground tabular-nums">12ms</div>
              <div className="text-[9px] font-mono text-success tabular-nums">-18% vs 7d</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-2 space-y-1 shadow-xs">
              <div className="text-[9px] font-mono uppercase text-muted-foreground">Throughput</div>
              <div className="text-sm font-mono font-bold text-foreground tabular-nums">4.8k/s</div>
              <div className="text-[9px] font-mono text-muted-foreground">us-east-1</div>
            </div>
          </div>
        </div>
      );

    case "charts":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] rounded-lg border border-border bg-card p-2 shadow-xs">
            <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground mb-1 tabular-nums">
              <span>Throughput</span>
              <span className="text-foreground font-semibold">7.8k req/m</span>
            </div>
            <svg viewBox="0 0 180 54" className="w-full h-14 overflow-visible">
              <line x1="0" y1="14" x2="180" y2="14" stroke="var(--border)" strokeDasharray="2 2" strokeWidth="1" />
              <line x1="0" y1="32" x2="180" y2="32" stroke="var(--border)" strokeDasharray="2 2" strokeWidth="1" />
              <line x1="0" y1="48" x2="180" y2="48" stroke="var(--border)" strokeWidth="1" />
              <path
                d="M 4 44 C 24 38, 36 28, 56 32 C 76 36, 92 16, 114 19 C 136 22, 154 8, 176 10 L 176 48 L 4 48 Z"
                fill="var(--foreground)"
                fillOpacity="0.08"
              />
              <path
                d="M 4 44 C 24 38, 36 28, 56 32 C 76 36, 92 16, 114 19 C 136 22, 154 8, 176 10"
                fill="none"
                stroke="var(--foreground)"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <circle cx="114" cy="19" r="3" fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.75" />
            </svg>
          </div>
        </div>
      );

    case "commerce":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] rounded-lg border border-border bg-card p-2 flex items-center gap-2.5 shadow-xs">
            <div className="w-14 h-14 rounded-md border border-border bg-muted/40 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-8 h-8 text-foreground" fill="none">
                <path d="M18 6v14M10 13h16M12 28h12l-2-8h-8l-2 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-[11px] font-semibold text-foreground truncate">Task Desk Lamp</div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-foreground tabular-nums">$129.00</span>
                <span className="px-2 py-0.5 rounded bg-foreground text-background text-[9px] font-medium">
                  Add
                </span>
              </div>
            </div>
          </div>
        </div>
      );

    case "premium-media":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] rounded-lg border border-border bg-card p-2.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span className="text-[10px] font-semibold text-foreground truncate">System Core Ep. 4</span>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground tabular-nums shrink-0">01:42</span>
            </div>
            <div className="h-6 flex items-end gap-[2px]">
              {WAVEFORM_BARS.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full ${i < 11 ? "bg-foreground" : "bg-muted-foreground/30"}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      );

    case "modal":
    case "dialog":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[215px] rounded-lg border border-destructive/40 bg-card p-2.5 space-y-2 shadow-xs overflow-hidden">
            <span className="absolute inset-x-4 top-0 h-0.5 bg-destructive rounded-full" />
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-foreground truncate">Revoke token?</span>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1 py-0.2 rounded border border-border bg-muted text-[8px] font-mono text-muted-foreground">
                  ESC
                </kbd>
                <X className="w-3 h-3 text-muted-foreground" />
              </span>
            </div>
            <p className="text-[9px] text-muted-foreground leading-snug">
              Press and hold to revoke signing key nx_live.
            </p>
            <div className="flex justify-end gap-1.5 pt-0.5">
              <span className="px-2 py-0.5 rounded border border-border text-[9px] text-muted-foreground">
                Cancel
              </span>
              <span className="px-2 py-0.5 rounded bg-destructive text-destructive-foreground text-[9px] font-medium">
                Hold
              </span>
            </div>
          </div>
        </div>
      );

    case "premium-overlays":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] h-20 rounded-lg border border-border bg-card flex overflow-hidden shadow-xs">
            <div className="flex-1 p-2 space-y-1.5 bg-muted/20">
              <div className="h-2 w-14 rounded bg-muted" />
              <div className="h-2 w-20 rounded bg-muted/60" />
              <div className="h-6 w-full rounded border border-border/60 bg-background/60" />
            </div>
            <div className="w-24 border-l border-border bg-background p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-foreground">Inspector</span>
                <X className="w-2.5 h-2.5 text-muted-foreground" />
              </div>
              <span className="px-1.5 py-0.5 rounded bg-foreground text-background text-[9px] font-medium text-center">
                Apply
              </span>
            </div>
          </div>
        </div>
      );

    case "alert":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] rounded-lg border border-success/35 bg-success/10 p-2.5 flex items-start gap-2.5 shadow-xs">
            <div className="w-5 h-5 rounded-md bg-success/15 text-success flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 space-y-0.5 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[11px] text-foreground truncate">Replicas healthy</span>
                <span className="px-1 rounded border border-border bg-background/80 text-[8px] font-mono text-muted-foreground">
                  SYNC_OK
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground leading-snug">
                3 edge clusters synced with zero loss.
              </div>
            </div>
          </div>
        </div>
      );

    case "badge":
      return (
        <div className={frame}>
          <div className="flex flex-col items-center gap-1.5 max-w-[220px]">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-stretch rounded-md border border-border overflow-hidden font-mono text-[9px]">
                <span className="px-1.5 py-0.5 bg-muted/60 text-muted-foreground border-r border-border">
                  Region
                </span>
                <span className="px-1.5 py-0.5 bg-card text-foreground font-semibold">
                  us-east-1
                </span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-success/15 border border-success/25 text-success text-[9px] font-mono font-medium">
                Healthy
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-foreground text-background text-[9px] font-mono font-semibold">
                v2.0.4
              </span>
              <span className="px-2 py-0.5 rounded-full border border-border bg-card text-[9px] font-mono text-foreground">
                Open PRs | 14
              </span>
            </div>
          </div>
        </div>
      );

    case "avatar":
      return (
        <div className={frame}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center">
              <div className="relative w-8 h-8 rounded-full border-2 border-card bg-foreground text-background flex items-center justify-center font-mono text-[11px] font-bold">
                MK
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-card" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-card bg-muted text-foreground flex items-center justify-center font-mono text-[11px] font-bold -ml-2">
                TL
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-card bg-muted text-foreground flex items-center justify-center font-mono text-[11px] font-bold -ml-2">
                NO
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-card bg-background text-muted-foreground flex items-center justify-center font-mono text-[10px] tabular-nums -ml-2">
                +4
              </div>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums">7 contributors</span>
          </div>
        </div>
      );

    case "tooltip":
      return (
        <div className={`${frame} flex-col gap-1.5`}>
          <div className="px-2.5 py-1 rounded-md bg-foreground text-background text-[10px] font-medium shadow-xs relative inline-flex items-center gap-1.5">
            <span>Copy endpoint</span>
            <kbd className="px-1 rounded bg-background/15 font-mono text-[8px]">⌘C</kbd>
            <div className="w-2 h-2 bg-foreground rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
          </div>
          <span className="px-2.5 py-1 rounded-md border border-border bg-card text-[11px] font-mono text-foreground inline-flex items-center gap-1.5 shadow-xs">
            <Copy className="w-3 h-3 text-muted-foreground" />
            <span>api.nexore.dev</span>
          </span>
        </div>
      );

    case "progress":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 shadow-xs">
            <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90 shrink-0">
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--muted)" strokeWidth="3.5" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="var(--foreground)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="88"
                strokeDashoffset="19"
              />
            </svg>
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex justify-between text-[10px] font-mono tabular-nums">
                <span className="text-muted-foreground">Rollout</span>
                <span className="text-foreground font-semibold">4 / 5</span>
              </div>
              <div className="grid grid-cols-5 gap-0.5 h-1.5">
                <span className="rounded-full bg-foreground" />
                <span className="rounded-full bg-foreground" />
                <span className="rounded-full bg-foreground" />
                <span className="rounded-full bg-foreground" />
                <span className="rounded-full bg-muted" />
              </div>
            </div>
          </div>
        </div>
      );

    case "skeleton":
      return (
        <div className={frame}>
          <div className="w-full max-w-[215px] rounded-lg border border-border bg-card p-2.5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-3/4 bg-muted rounded" />
                <div className="h-2 w-1/2 bg-muted/70 rounded" />
              </div>
            </div>
            <div className="h-2 w-full bg-muted/60 rounded" />
            <div className="h-2 w-2/3 bg-muted/60 rounded" />
          </div>
        </div>
      );

    case "loaders":
    case "loader":
      return (
        <div className={frame}>
          <div className="flex items-center gap-3.5 rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-xs">
            <div className="grid grid-cols-3 gap-0.5 w-5 h-5">
              {[1, 0.7, 0.35, 0.7, 1, 0.5, 0.35, 0.5, 0.25].map((op, i) => (
                <span
                  key={i}
                  className="rounded-[1px] bg-foreground"
                  style={{ opacity: op }}
                />
              ))}
            </div>
            <div className="h-4 w-px bg-border" />
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-foreground" fill="none">
              <circle cx="12" cy="12" r="9" stroke="var(--muted)" strokeWidth="2" strokeDasharray="1.5 2.5" />
              <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="h-4 w-px bg-border" />
            <div className="w-9 h-1.5 rounded-full bg-muted overflow-hidden p-[1px]">
              <div className="w-4 h-full rounded-full bg-foreground ml-2" />
            </div>
          </div>
        </div>
      );

    case "toaster":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[215px] pt-1.5">
            <div className="mx-3 h-4 rounded-t-lg border border-b-0 border-border bg-muted/50" />
            <div className="relative overflow-hidden p-2.5 rounded-lg border border-border bg-card flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-foreground truncate">Deleting branch</div>
                  <div className="text-[9px] font-mono text-muted-foreground tabular-nums">4.2s · staging</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-medium shrink-0">
                Undo
              </span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-muted">
                <span className="block h-full w-4/5 bg-warning" />
              </span>
            </div>
          </div>
        </div>
      );

    case "social":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded-lg border border-border bg-card p-2.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-muted border border-border font-mono text-[9px] flex items-center justify-center font-bold shrink-0">
                  MK
                </div>
                <span className="font-semibold text-[11px] text-foreground truncate">Mina Kato</span>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground tabular-nums shrink-0">10:42</span>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              Verified 77 artifacts cleanly.
            </p>
            <div className="flex items-center gap-1.5 text-[9px] font-mono tabular-nums">
              <span className="px-1.5 py-0.5 rounded-full bg-foreground text-background">24</span>
              <span className="px-1.5 py-0.5 rounded-full border border-border text-muted-foreground">+</span>
            </div>
          </div>
        </div>
      );

    case "dark-mode":
      return (
        <div className={frame}>
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-xs">
              <svg width="26" height="14" viewBox="0 0 36 20" fill="none" className="text-foreground">
                <path d="M 6 16 A 12 12 0 0 1 30 16" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="16" x2="27" y2="7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <circle cx="27" cy="7" r="2.75" fill="currentColor" />
              </svg>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-foreground">
                Dark
              </span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-0.5 text-[9px] font-mono">
              <span className="px-1.5 py-0.5 text-muted-foreground inline-flex items-center gap-1">
                <Sun className="w-2.5 h-2.5" />
              </span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border text-foreground inline-flex items-center gap-1 font-semibold">
                <Moon className="w-2.5 h-2.5" />
                <span>Dark</span>
              </span>
            </div>
          </div>
        </div>
      );

    case "aurora-border-card":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[215px] rounded-xl bg-card p-3 border border-border shadow-xs">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 215 64" fill="none" preserveAspectRatio="none">
              <rect
                x="1"
                y="1"
                width="213"
                height="62"
                rx="11"
                stroke="var(--foreground)"
                strokeWidth="1.5"
                strokeDasharray="64 200"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground">Perimeter Stroke</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                SVG Path
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Flow, wave & pulse trace modes</p>
          </div>
        </div>
      );

    case "aurora-search-pill":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] space-y-1.5">
            <div className="h-8 rounded-full border border-foreground/40 bg-card px-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Search className="w-3.5 h-3.5 text-foreground shrink-0" />
                <span className="text-[11px] text-muted-foreground truncate">Search documentation...</span>
              </div>
              <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-foreground">/</kbd>
            </div>
            <div className="flex justify-center gap-1 text-[9px] font-mono text-muted-foreground">
              <span className="px-1.5 py-0.5 rounded border border-border bg-background">Components</span>
              <span className="px-1.5 py-0.5 rounded border border-border bg-background">Tokens</span>
            </div>
          </div>
        </div>
      );

    case "ai-prompt-input":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] rounded-xl border border-border bg-card p-2.5 space-y-2 shadow-xs">
            <div className="text-[10px] text-muted-foreground truncate">
              Summarize migration changelog for v2.4...
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border/70">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Paperclip className="w-3 h-3" />
                <Mic className="w-3 h-3" />
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-foreground">
                  Pro
                </span>
              </div>
              <div className="w-5 h-5 rounded-md bg-foreground text-background flex items-center justify-center text-[10px] font-bold">
                ↑
              </div>
            </div>
          </div>
        </div>
      );

    case "command":
      return (
        <div className={frame}>
          <div className="w-full max-w-[220px] rounded-lg border border-border bg-card overflow-hidden shadow-xs">
            <div className="px-2.5 py-1.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                <Search className="w-3 h-3" />
                <span>Jump to...</span>
              </div>
              <kbd className="px-1 py-0.5 rounded bg-muted text-[9px] font-mono text-foreground">⌘K</kbd>
            </div>
            <div className="p-1 space-y-0.5 text-[10px]">
              <div className="px-2 py-1 rounded bg-muted text-foreground font-medium flex items-center justify-between">
                <span>Switch theme</span>
                <span className="font-mono text-[9px] text-muted-foreground">⌘T</span>
              </div>
              <div className="px-2 py-0.5 text-muted-foreground">Open settings</div>
            </div>
          </div>
        </div>
      );

    case "interactive-code-block":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] rounded-lg border border-border bg-card overflow-hidden font-mono text-[10px] shadow-xs">
            <div className="px-2.5 py-1 bg-muted/40 border-b border-border flex items-center justify-between text-[9px] text-muted-foreground">
              <span>terminal.sh</span>
              <span className="text-foreground">Copy</span>
            </div>
            <div className="p-2 space-y-0.5">
              <div className="flex gap-2">
                <span className="text-muted-foreground select-none">1</span>
                <span className="text-foreground truncate">npx nexoreui add dock</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground select-none">2</span>
                <span className="text-muted-foreground truncate">pnpm dev</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "aurora-border-fx":
      return (
        <div className={frame}>
          <div className="w-full max-w-[215px] rounded-xl border border-foreground/40 bg-card p-2.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground">Reactive Border</span>
              <span className="text-[9px] font-mono text-muted-foreground">4 presets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded border border-foreground bg-foreground text-background text-[9px] font-mono">
                Mono
              </span>
              <span className="px-2 py-0.5 rounded border border-border bg-background text-muted-foreground text-[9px] font-mono">
                Slate
              </span>
              <span className="px-2 py-0.5 rounded border border-border bg-background text-muted-foreground text-[9px] font-mono">
                Zinc
              </span>
            </div>
          </div>
        </div>
      );

    case "morphing-geometry":
      return (
        <div className={frame}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-border bg-card shadow-xs" />
            <span className="text-[10px] font-mono text-muted-foreground">→</span>
            <div className="w-9 h-9 rounded-xl border-2 border-foreground bg-card rotate-12 shadow-xs" />
            <span className="text-[10px] font-mono text-muted-foreground">→</span>
            <div className="w-8 h-8 rounded-full border border-border bg-card shadow-xs" />
          </div>
        </div>
      );

    case "marquee":
      return (
        <div className={frame}>
          <div className="w-full max-w-[225px] space-y-1.5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]">
            <div className="flex items-center gap-1.5 font-mono text-[9px] -translate-x-2">
              <span className="px-2 py-0.5 rounded border border-border bg-card text-foreground whitespace-nowrap">React 19</span>
              <span className="px-2 py-0.5 rounded border border-border bg-card text-foreground whitespace-nowrap">Tailwind v4</span>
              <span className="px-2 py-0.5 rounded border border-border bg-card text-foreground whitespace-nowrap">TypeScript</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[9px] translate-x-3">
              <span className="px-2 py-0.5 rounded border border-border bg-background text-muted-foreground whitespace-nowrap">Radix UI</span>
              <span className="px-2 py-0.5 rounded border border-border bg-background text-muted-foreground whitespace-nowrap">Framer</span>
              <span className="px-2 py-0.5 rounded border border-border bg-background text-muted-foreground whitespace-nowrap">MIT</span>
            </div>
          </div>
        </div>
      );

    case "number-ticker":
      return (
        <div className={frame}>
          <div className="rounded-lg border border-border bg-card px-4 py-2.5 text-center shadow-xs">
            <div className="text-xl font-mono font-bold text-foreground tabular-nums tracking-tight">
              1,248.0
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
              Requests / min
            </div>
          </div>
        </div>
      );

    case "blur-fade":
      return (
        <div className={frame}>
          <div className="flex items-center gap-2">
            {[
              { idx: "01", label: "Enter", opacity: "opacity-100", border: "border-foreground/50" },
              { idx: "02", label: "+60ms", opacity: "opacity-75", border: "border-border" },
              { idx: "03", label: "+120ms", opacity: "opacity-45", border: "border-border/60" },
            ].map((step) => (
              <div
                key={step.idx}
                className={`w-16 h-12 rounded-lg border bg-card p-1.5 flex flex-col justify-between text-[9px] font-mono shadow-xs ${step.opacity} ${step.border}`}
              >
                <span className="text-muted-foreground">{step.idx}</span>
                <span className="font-semibold text-foreground">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "premium-effects":
      return (
        <div className={frame}>
          <div className="w-full max-w-[215px] h-20 rounded-xl border border-border bg-card p-2.5 relative overflow-hidden flex flex-col justify-between shadow-xs">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-[radial-gradient(circle,var(--foreground)_0%,transparent_70%)] opacity-10 pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground">Spotlight Surface</span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">x: 142px · y: 28px</div>
          </div>
        </div>
      );

    case "ultra-effects":
      return (
        <div className={frame}>
          <div className="w-full max-w-[215px] rounded-lg border border-border bg-card p-2.5 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="h-4 px-2 rounded bg-foreground text-background text-[10px] font-mono font-semibold flex items-center">
                BoxReveal
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">0.45s</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Word morph & shimmer</span>
              <span className="font-mono text-foreground">→</span>
            </div>
          </div>
        </div>
      );

    case "ultra-components":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[215px] h-20 rounded-lg border border-border bg-card overflow-hidden flex items-center justify-center shadow-xs">
            <div className="absolute inset-x-0 bottom-0 h-12 [perspective:180px] pointer-events-none opacity-50">
              <div className="w-full h-full [transform:rotateX(58deg)] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:12px_12px]" />
            </div>
            <div className="relative z-10 px-3 py-1 rounded-md border border-border bg-background text-[10px] font-mono font-semibold text-foreground shadow-xs">
              Perspective Grid
            </div>
          </div>
        </div>
      );

    case "special-animations":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[215px] h-20 rounded-lg border border-border bg-card flex items-center justify-center shadow-xs">
            <div className="absolute inset-x-4 h-px bg-border" />
            <div className="absolute inset-y-3 w-px bg-border" />
            <div className="relative z-10 px-3 py-1 rounded-full border border-foreground bg-background text-[10px] font-mono font-semibold text-foreground translate-x-2 -translate-y-1 shadow-xs">
              Magnetic (+6, -3)
            </div>
          </div>
        </div>
      );

    case "pro-cards":
    case "holo-finish-card":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[205px] h-20 flex items-center justify-center">
            <div className="absolute w-36 h-14 rounded-xl border border-border bg-muted/50 rotate-6 translate-x-2 translate-y-1" />
            <div className="relative w-36 h-14 rounded-xl border border-foreground/50 bg-card p-2 flex flex-col justify-between -rotate-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-foreground">HoloFinish</span>
                <span className="text-[9px] font-mono px-1 rounded bg-muted text-foreground">3D</span>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">rx: -8° · ry: 12°</span>
            </div>
          </div>
        </div>
      );

    case "pro-objects":
    case "live-object":
      return (
        <div className={frame}>
          <svg viewBox="0 0 120 72" className="w-28 h-16 text-foreground" fill="none">
            <path d="M60 10 L86 24 L86 50 L60 64 L34 50 L34 24 Z" stroke="currentColor" strokeWidth="1.5" fill="var(--card)" />
            <path d="M34 24 L60 38 L86 24 M60 38 L60 64" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 37 L28 37 M92 37 L104 37" stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>
      );

    case "sound-pulse":
      return (
        <div className={frame}>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 88 88" className="w-20 h-20 text-foreground" fill="none">
              <circle cx="44" cy="44" r="10" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="44" cy="44" r="4" fill="currentColor" />
              {SOUND_PULSE_BARS.map((bar, idx) => (
                <line
                  key={idx}
                  x1={bar.x1}
                  y1={bar.y1}
                  x2={bar.x2}
                  y2={bar.y2}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeOpacity={bar.strong ? 0.9 : 0.35}
                />
              ))}
            </svg>
            <div className="text-[10px] font-mono space-y-0.5 text-muted-foreground tabular-nums">
              <div className="text-foreground font-semibold">56 bars</div>
              <div>120 BPM</div>
            </div>
          </div>
        </div>
      );

    case "silk-unveil":
      return (
        <div className={frame}>
          <div className="w-full max-w-[215px] h-20 rounded-lg border border-border bg-card p-2 flex flex-col justify-between overflow-hidden relative shadow-xs">
            <svg className="w-full h-full text-foreground" viewBox="0 0 180 48" fill="none">
              <path d="M0 14 C45 2, 90 26, 135 12 C155 6, 168 18, 180 12" stroke="currentColor" strokeWidth="1.4" />
              <path d="M0 24 C45 12, 90 36, 135 22 C155 16, 168 28, 180 22" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
              <path d="M0 34 C45 22, 90 46, 135 32 C155 26, 168 38, 180 32" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
            </svg>
            <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-background border border-border text-foreground">
              Verlet cloth
            </span>
          </div>
        </div>
      );

    case "node-flow-graph":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[230px] h-20 flex items-center justify-between px-1">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 230 80" fill="none">
              <path d="M 54 24 C 84 24, 90 40, 118 40" stroke="var(--foreground)" strokeWidth="1.4" strokeOpacity="0.55" />
              <path d="M 54 56 C 84 56, 90 40, 118 40" stroke="var(--foreground)" strokeWidth="1.4" strokeOpacity="0.35" strokeDasharray="3 2" />
              <path d="M 150 40 L 176 40" stroke="var(--foreground)" strokeWidth="1.4" />
            </svg>
            <div className="flex flex-col gap-2 z-10">
              <div className="px-2 py-0.5 rounded border border-border bg-card text-[9px] font-mono text-foreground shadow-xs">
                Trigger
              </div>
              <div className="px-2 py-0.5 rounded border border-border bg-card text-[9px] font-mono text-muted-foreground shadow-xs">
                Context
              </div>
            </div>
            <div className="z-10 px-2 py-1 rounded border border-border bg-card text-[9px] font-mono text-foreground shadow-xs">
              Transform
            </div>
            <div className="z-10 px-2 py-1 rounded bg-foreground text-background text-[9px] font-mono font-semibold flex items-center gap-1 shadow-xs">
              <span>Ship</span>
              <Check className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      );

    case "glass-lens":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[215px] h-20 rounded-lg border border-border bg-card flex items-center justify-center overflow-hidden shadow-xs">
            <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground select-none">
              REFRACTION
            </span>
            <div className="absolute w-14 h-14 rounded-full border-2 border-foreground bg-background/85 flex items-center justify-center shadow-xs">
              <span className="font-mono text-[11px] font-bold text-foreground tabular-nums">1.18x</span>
            </div>
          </div>
        </div>
      );

    case "fluted-glass":
      return (
        <div className={frame}>
          <div className="w-full max-w-[215px] h-20 rounded-lg border border-border bg-card flex divide-x divide-border overflow-hidden relative shadow-xs">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${
                  i % 2 === 0
                    ? "bg-linear-to-r from-muted/60 via-background to-muted/30"
                    : "bg-linear-to-r from-background via-muted/40 to-background"
                }`}
              />
            ))}
            <span className="absolute bottom-1.5 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-background/90 border border-border text-foreground">
              10 ribs
            </span>
          </div>
        </div>
      );

    case "ripple-water":
      return (
        <div className={frame}>
          <svg viewBox="0 0 180 76" className="w-44 h-20 text-foreground" fill="none">
            <ellipse cx="90" cy="38" rx="68" ry="26" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.2" />
            <ellipse cx="90" cy="38" rx="48" ry="18" stroke="currentColor" strokeOpacity="0.38" strokeWidth="1.3" />
            <ellipse cx="90" cy="38" rx="28" ry="10.5" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.4" />
            <ellipse cx="90" cy="38" rx="10" ry="4" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="90" cy="38" r="2" fill="currentColor" />
          </svg>
        </div>
      );

    case "scroll-warp":
      return (
        <div className={frame}>
          <svg className="w-44 h-20 text-foreground" viewBox="0 0 180 72" fill="none">
            <path
              d="M18 12 Q90 28 162 12 L152 60 Q90 44 28 60 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="var(--card)"
            />
            <path d="M23 36 Q90 46 157 36" stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M58 18 Q62 36 60 54 M122 18 Q118 36 120 54" stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>
      );

    case "twist-ribbon":
      return (
        <div className={frame}>
          <svg className="w-44 h-16 text-foreground" viewBox="0 0 180 64" fill="none">
            <path d="M8 22 C44 4, 72 56, 108 24 C132 4, 152 46, 172 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 40 C44 22, 72 60, 108 40 C132 22, 152 56, 172 40" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" strokeLinecap="round" />
            <line x1="48" y1="16" x2="48" y2="34" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
            <line x1="90" y1="36" x2="90" y2="50" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
            <line x1="132" y1="16" x2="132" y2="36" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
          </svg>
        </div>
      );

    case "dither-image":
      return (
        <div className={frame}>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2 shadow-xs">
            <svg viewBox="0 0 48 48" className="w-12 h-12 rounded border border-border bg-background shrink-0">
              {BAYER_MATRIX.map((row, y) =>
                row.map((threshold, x) => {
                  const gradient = ((x + y) / 14) * 64;
                  return gradient > threshold ? (
                    <rect
                      key={`${x}-${y}`}
                      x={x * 6 + 1}
                      y={y * 6 + 1}
                      width="4"
                      height="4"
                      rx="0.5"
                      fill="var(--foreground)"
                    />
                  ) : null;
                })
              )}
            </svg>
            <div className="font-mono space-y-0.5">
              <div className="text-[10px] font-semibold text-foreground">Bayer 8×8</div>
              <div className="text-[9px] text-muted-foreground">Quantized 1-bit</div>
            </div>
          </div>
        </div>
      );

    case "gravity-grid":
      return (
        <div className={frame}>
          <svg className="w-44 h-20 text-foreground" viewBox="0 0 180 76" fill="none">
            <path d="M12 16 Q90 28 168 16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
            <path d="M12 38 Q90 56 168 38" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.65" />
            <path d="M12 60 Q90 72 168 60" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
            <path d="M44 6 Q60 38 44 70" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
            <path d="M90 6 L90 70" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
            <path d="M136 6 Q120 38 136 70" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="90" cy="46" r="5" fill="var(--foreground)" />
            <circle cx="90" cy="46" r="10" stroke="var(--foreground)" strokeOpacity="0.3" strokeDasharray="2 2" />
          </svg>
        </div>
      );

    case "scroll-drum":
      return (
        <div className={frame}>
          <div className="w-full max-w-[205px] rounded-lg border border-border bg-card py-2 px-3 flex flex-col items-center leading-tight font-mono shadow-xs">
            <span className="text-[8px] text-muted-foreground/45 scale-x-90">01 INDEX</span>
            <span className="text-[10px] text-muted-foreground/75 my-0.5">02 VIEWPORT</span>
            <span className="text-xs font-bold text-foreground px-2 py-0.5 rounded bg-muted/60 border border-border">
              03 CYLINDER
            </span>
            <span className="text-[10px] text-muted-foreground/75 mt-0.5">04 MOMENTUM</span>
          </div>
        </div>
      );

    case "liquid-smear":
      return (
        <div className={frame}>
          <svg className="w-44 h-20 text-foreground" viewBox="0 0 180 72" fill="none">
            <path d="M18 48 C48 12, 82 58, 118 22 C136 6, 152 26, 164 16" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.18" />
            <path d="M18 48 C48 12, 82 58, 118 22 C136 6, 152 26, 164 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" />
            <circle cx="164" cy="16" r="3.5" fill="currentColor" />
          </svg>
        </div>
      );

    case "type-proximity":
      return (
        <div className={frame}>
          <div className="relative rounded-lg border border-border bg-card px-4 py-2.5 flex items-baseline gap-1.5 font-sans text-foreground shadow-xs">
            <span className="text-xs font-extralight opacity-40">N</span>
            <span className="text-sm font-normal opacity-65">E</span>
            <span className="text-xl font-black tracking-tight">X</span>
            <span className="text-sm font-normal opacity-65">O</span>
            <span className="text-xs font-extralight opacity-40">R</span>
            <span className="text-[10px] font-extralight opacity-30">E</span>
          </div>
        </div>
      );

    case "holo-foil":
      return (
        <div className={frame}>
          <div className="relative w-full max-w-[205px] h-16 rounded-xl border border-foreground/40 bg-card p-2.5 flex flex-col justify-between overflow-hidden shadow-xs">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(125deg,transparent_0_6px,var(--border)_6px_7px)] opacity-55 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-foreground">SPECULAR FOIL</span>
              <Lock className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="relative z-10 text-[9px] font-mono text-muted-foreground tabular-nums">
              tilt: +6.4° / -3.1°
            </div>
          </div>
        </div>
      );

    case "letter-pile":
      return (
        <div className={frame}>
          <div className="flex items-end justify-center gap-1 font-mono text-xs font-bold border-b border-border pb-1.5 px-4">
            <span className="w-7 h-7 rounded-full border border-border bg-card text-foreground flex items-center justify-center -rotate-12 shadow-xs">
              N
            </span>
            <span className="w-7 h-7 rounded-full border border-foreground bg-foreground text-background flex items-center justify-center translate-y-0.5 rotate-6 shadow-xs">
              X
            </span>
            <span className="w-7 h-7 rounded-full border border-border bg-card text-foreground flex items-center justify-center -translate-y-2 -rotate-6 shadow-xs">
              R
            </span>
            <span className="w-7 h-7 rounded-full border border-border bg-card text-foreground flex items-center justify-center rotate-12 shadow-xs">
              E
            </span>
          </div>
        </div>
      );

    case "flow-field":
      return (
        <div className={frame}>
          <svg className="w-44 h-20 text-foreground" viewBox="0 0 180 72" fill="none">
            <path d="M10 14 Q52 4 94 22 T170 16" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.35" strokeLinecap="round" />
            <path d="M10 28 Q54 18 96 36 T170 30" stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.85" strokeLinecap="round" />
            <path d="M10 42 Q56 32 98 50 T170 44" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.55" strokeLinecap="round" />
            <path d="M10 56 Q58 46 100 62 T170 58" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.3" strokeLinecap="round" />
            <circle cx="96" cy="36" r="2" fill="currentColor" />
            <circle cx="140" cy="27" r="1.5" fill="currentColor" />
          </svg>
        </div>
      );

    case "text-rail":
      return (
        <div className={frame}>
          <svg className="w-44 h-20 text-foreground" viewBox="0 0 180 72" fill="none">
            <path id="thumb-rail-path" d="M10 52 C52 10, 128 62, 170 20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.45" />
            <text fill="currentColor" fontSize="9.5" fontFamily="monospace" fontWeight="700" letterSpacing="2">
              <textPath href="#thumb-rail-path" startOffset="12%">
                BEZIER SPLINE RAIL
              </textPath>
            </text>
          </svg>
        </div>
      );

    case "moire-grating":
      return (
        <div className={frame}>
          <div className="relative w-40 h-16 rounded-lg border border-border bg-card overflow-hidden shadow-xs">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,var(--foreground)_0_1px,transparent_1px_5px)] opacity-25" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(83deg,var(--foreground)_0_1px,transparent_1px_5px)] opacity-45" />
          </div>
        </div>
      );

    case "swipe-deck":
      return (
        <div className={frame}>
          <div className="relative w-32 h-16 flex items-center justify-center">
            <div className="absolute w-24 h-12 rounded-lg border border-border bg-muted/60 -rotate-8 -translate-x-3" />
            <div className="absolute w-24 h-12 rounded-lg border border-border bg-muted/90 rotate-5 translate-x-2" />
            <div className="relative w-24 h-12 rounded-lg border border-foreground/60 bg-card px-2.5 flex items-center justify-between shadow-xs">
              <span className="text-[10px] font-mono font-bold text-foreground tabular-nums">01 / 04</span>
              <Bell className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </div>
      );

    case "camera-mirror":
      return (
        <div className={frame}>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2 shadow-xs">
            <svg viewBox="0 0 48 48" className="w-12 h-12 rounded border border-border bg-background shrink-0">
              {[0, 1, 2, 3, 4].map((row) =>
                [0, 1, 2, 3, 4].map((col) => {
                  const dx = col - 2;
                  const dy = row - 2;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const r = Math.max(0.7, 3.2 - dist * 0.85);
                  return (
                    <circle
                      key={`${row}-${col}`}
                      cx={col * 9 + 6}
                      cy={row * 9 + 6}
                      r={r}
                      fill="var(--foreground)"
                      fillOpacity={Math.max(0.2, 1 - dist * 0.25)}
                    />
                  );
                })
              )}
            </svg>
            <div className="font-mono space-y-0.5">
              <div className="text-[10px] font-semibold text-foreground">Halftone</div>
              <div className="text-[9px] text-muted-foreground">ASCII raster</div>
            </div>
          </div>
        </div>
      );

    case "scroll-reveal":
      return (
        <div className={frame}>
          <div className="w-full max-w-[215px] h-20 rounded-lg border border-border bg-card p-2 flex gap-2 shadow-xs">
            <div className="flex-1 space-y-1.5 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-foreground font-semibold">view()</span>
                <div className="h-2.5 flex-1 rounded bg-foreground/90" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-muted-foreground">60%</span>
                <div className="h-2.5 w-3/4 rounded bg-foreground/50" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-muted-foreground/60">20%</span>
                <div className="h-2.5 w-1/2 rounded bg-foreground/20" />
              </div>
            </div>
            <div className="w-1.5 bg-muted rounded-full p-[1px] shrink-0">
              <div className="w-full h-8 bg-foreground rounded-full mt-2" />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={frame}>
          <div className="px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium text-foreground flex items-center gap-1.5 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] capitalize">{id.replace(/-/g, " ")}</span>
          </div>
        </div>
      );
  }
}
