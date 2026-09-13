export const templateModernSaas = {
  name: "template-modern-saas",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-modern-saas.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Command,
  Search,
  GitBranch,
  GitCommit,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  ShieldCheck,
  ChevronRight,
  Layers,
  Terminal,
  MousePointer2,
  Server,
  Activity,
  X,
} from "lucide-react";

export interface ModernSaasTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function ModernSaasTemplate({
  brandName = "Aura Cloud",
  theme = "dark",
}: ModernSaasTemplateProps) {
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"branch" | "edge" | "telemetry">("branch");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [showCursors, setShowCursors] = useState(true);

  const commandItems = [
    { label: "Deploy to Production", category: "Deployments", icon: Zap },
    { label: "Create Ephemeral Preview Branch", category: "Git", icon: GitBranch },
    { label: "Inspect Edge Latency Spikes", category: "Telemetry", icon: Clock },
    { label: "Manage Team Access & RBAC", category: "Security", icon: ShieldCheck },
  ];

  const filteredCommands = commandItems.filter((item) =>
    item.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors font-sans selection:bg-primary/20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-border/80 bg-background/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <span className="font-bold text-base tracking-tight">
              {brandName}
            </span>
          </div>

          {/* Quick command search trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted/60 text-muted-foreground text-sm transition-all shadow-xs"
          >
            <Search className="h-4 w-4" />
            <span>Search actions or deployments...</span>
            <kbd className="px-1.5 py-0.5 rounded text-xs font-mono border border-border bg-muted text-foreground">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Mobile command trigger button */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="md:hidden p-2 rounded-lg border border-border bg-card text-foreground transition-colors"
              title="Search commands (⌘K)"
              aria-label="Open Command Menu"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowCursors(!showCursors)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              <span>{showCursors ? "Hide Cursors" : "Show Cursors"}</span>
            </button>

            <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5">
              <span>Console</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 md:pt-20 pb-12 md:pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center relative">
        {/* Collaborative cursor simulation */}
        {showCursors && (
          <>
            <motion.div
              animate={{ x: [0, 40, 20, 0], y: [0, -20, 15, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute top-28 left-8 hidden xl:flex items-center gap-1.5 pointer-events-none z-20"
            >
              <MousePointer2 className="h-4 w-4 text-emerald-500 fill-emerald-500" />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-sm">
                sarah.ts (editing)
              </span>
            </motion.div>

            <motion.div
              animate={{ x: [0, -30, -10, 0], y: [0, 25, -10, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="absolute top-44 right-12 hidden xl:flex items-center gap-1.5 pointer-events-none z-20"
            >
              <MousePointer2 className="h-4 w-4 text-primary fill-primary" />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono border border-primary/30 bg-primary/10 text-primary shadow-sm">
                alex.dev (reviewing)
              </span>
            </motion.div>
          </>
        )}

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-5 transition-colors">
          <GitBranch className="h-3.5 w-3.5" />
          <span>Continuous Edge Infrastructure</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 leading-[1.15]">
          The Developer Cloud for <span className="text-primary">High-Velocity Teams</span>.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Push code, spawn instant ephemeral preview environments, and deploy across global edge nodes
          with zero configuration overhead.
        </p>

        {/* Live CI/CD Pipeline Card */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-4 sm:p-6 text-left shadow-xl transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 mb-4 border-b border-border text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-semibold">prod-edge-gateway #8492</span>
              <span className="text-muted-foreground text-xs font-mono">on main</span>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-semibold">Ready in 1.4s</span>
          </div>

          {/* 3 Pipeline Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="p-3.5 rounded-xl border border-border bg-muted/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">1. Build & Tree Shake</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm font-mono font-semibold">14 bundles (42kb)</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-muted/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">2. Edge Replication</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm font-mono font-semibold">312 nodes synced</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-muted/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">3. TLS & SSL Routing</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm font-mono font-semibold">Active & Encrypted</p>
            </div>
          </div>

          {/* Generated preview URL bar */}
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
              <span className="truncate">https://aura-cloud-gateway-preview-q8x.edge.dev</span>
            </div>
            <a
              href="#visit"
              className="flex items-center gap-1.5 font-semibold text-primary shrink-0 hover:underline"
            >
              <span>Visit Preview</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Feature Tabs Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {[
            { id: "branch", label: "Instant Branch Previews" },
            { id: "edge", label: "Zero-Downtime Rollbacks" },
            { id: "telemetry", label: "Edge Telemetry & KV" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={\`px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer \${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm font-semibold"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }\`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Detail View */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-lg transition-all">
          {activeTab === "branch" && (
            <div className="space-y-4 text-sm">
              <h3 className="font-bold text-lg sm:text-xl">
                Every Git commit gets a production replica.
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Share live preview links with team members and clients. Comments left on the preview link are
                automatically linked back to your GitHub PR.
              </p>
              <div className="p-4 rounded-xl font-mono text-xs sm:text-sm border border-border bg-muted/60 overflow-x-auto leading-relaxed">
                git checkout -b feat/redesign-checkout <br />
                git push origin feat/redesign-checkout <br />
                <span className="text-emerald-500 font-semibold">
                  → [{brandName}] Ephemeral environment deployed at https://pr-42.aura.run (2.1s)
                </span>
              </div>
            </div>
          )}

          {activeTab === "edge" && (
            <div className="space-y-4 text-sm">
              <h3 className="font-bold text-lg sm:text-xl">
                Instant atomic rollbacks with zero traffic drops.
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                If an unexpected error occurs, revert back to any historical checkpoint with a single click or CLI
                command in under 300 milliseconds.
              </p>
              <div className="p-4 rounded-xl font-mono text-xs sm:text-sm border border-border bg-muted/60 overflow-x-auto leading-relaxed">
                $ aura rollback --target=v2.14.0 --atomic <br />
                <span className="text-emerald-500 font-semibold">
                  ✓ Reverted 312 edge locations to commit [d91a2] in 280ms. Error rate: 0.00%
                </span>
              </div>
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="space-y-4 text-sm">
              <h3 className="font-bold text-lg sm:text-xl">
                Built-in microsecond telemetry and distributed KV.
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Inspect cold starts, invocation count, memory consumption, and cache hit ratios without configuring
                external log aggregators.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-mono">
                <div className="p-3.5 rounded-xl border border-border bg-muted/40">
                  <p className="text-xs text-muted-foreground">CACHE HIT RATE</p>
                  <p className="text-xl font-bold text-emerald-500 mt-1">99.82%</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-muted/40">
                  <p className="text-xs text-muted-foreground">AVG LATENCY</p>
                  <p className="text-xl font-bold text-foreground mt-1">1.2ms</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-muted/40">
                  <p className="text-xs text-muted-foreground">INVOCATIONS</p>
                  <p className="text-xl font-bold text-foreground mt-1">14.2M / day</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-muted/40">
                  <p className="text-xs text-muted-foreground">COLD START</p>
                  <p className="text-xl font-bold text-emerald-500 mt-1">0ms</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Command Modal Simulation */}
      <AnimatePresence>
        {isCommandOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={() => setIsCommandOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            >
              <div className="p-3.5 border-b border-border flex items-center gap-2.5">
                <Search className="h-4 w-4 opacity-50" />
                <input
                  type="text"
                  autoFocus
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder="Type a command or search deployments..."
                  className="w-full bg-transparent text-sm focus:outline-none py-1 text-foreground"
                />
                <button
                  onClick={() => setIsCommandOpen(false)}
                  className="p-1 rounded hover:opacity-75 transition-opacity"
                  aria-label="Close Command Menu"
                >
                  <X className="h-4 w-4 opacity-60" />
                </button>
              </div>

              <div className="p-2 max-h-60 overflow-y-auto space-y-1">
                {filteredCommands.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      alert(\`Executed command: "\${item.label}"\`);
                      setIsCommandOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-sm hover:bg-muted/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{item.category}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-border text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {brandName}. Designed for high-velocity software engineering.</p>
      </footer>
    </div>
  );
}
`,
};
