"use client";

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
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function ModernSaasPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

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
    <div
      className="@container w-full min-h-screen transition-colors font-sans"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Top Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 @sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm transition-all"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon} className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-base tracking-tight"
              style={{ fontFamily: "var(--template-heading-font)" }}
            >
              {config.brandName || "Aura Cloud"}
            </span>
          </div>

          {/* Quick command search trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden @md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-sm transition-all shadow-sm hover:opacity-80"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              color: "var(--template-fg-muted)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <Search className="h-4 w-4" />
            <span>Search actions or deployments...</span>
            <kbd
              className="px-1.5 py-0.5 rounded text-xs font-mono border"
              style={{
                backgroundColor: "var(--template-surface-muted)",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Mobile command trigger button */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="@md:hidden p-2 rounded-lg border transition-colors"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
              title="Search commands (⌘K)"
              aria-label="Open Command Menu"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowCursors(!showCursors)}
              className="hidden @lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-80"
              style={{
                borderColor: "var(--template-border)",
                color: "var(--template-fg-muted)",
              }}
            >
              <Users className="h-3.5 w-3.5" />
              <span>{showCursors ? "Hide Cursors" : "Show Cursors"}</span>
            </button>

            <button
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white shadow-sm transition-all hover:brightness-110 flex items-center gap-1.5"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <span>Console</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-10 @sm:pt-16 @md:pt-20 pb-12 @md:pb-16 px-4 @sm:px-6 max-w-5xl mx-auto text-center relative">
        {/* Collaborative cursor simulation (Wide Container Only) */}
        {showCursors && (
          <>
            <motion.div
              animate={{ x: [0, 40, 20, 0], y: [0, -20, 15, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute top-28 left-8 hidden @xl:flex items-center gap-1.5 pointer-events-none z-20"
            >
              <MousePointer2 className="h-4 w-4 text-emerald-500 fill-emerald-500" />
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-mono border shadow-sm"
                style={{
                  backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#ecfdf5",
                  borderColor: isDark ? "rgba(16, 185, 129, 0.3)" : "#a7f3d0",
                  color: isDark ? "#6ee7b7" : "#065f46",
                }}
              >
                sarah.ts (editing)
              </span>
            </motion.div>

            <motion.div
              animate={{ x: [0, -30, -10, 0], y: [0, 25, -10, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="absolute top-44 right-12 hidden @xl:flex items-center gap-1.5 pointer-events-none z-20"
            >
              <MousePointer2
                className="h-4 w-4"
                style={{ color: "var(--template-primary)", fill: "var(--template-primary)" }}
              />
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-mono border shadow-sm"
                style={{
                  backgroundColor: "rgba(var(--template-primary-rgb), 0.1)",
                  borderColor: "rgba(var(--template-primary-rgb), 0.3)",
                  color: "var(--template-primary)",
                }}
              >
                alex.dev (reviewing)
              </span>
            </motion.div>
          </>
        )}

        <div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono mb-5 transition-colors"
          style={{
            backgroundColor: "var(--template-surface-muted)",
            borderColor: "var(--template-border)",
            color: "var(--template-fg-muted)",
          }}
        >
          <GitBranch className="h-3.5 w-3.5" style={{ color: "var(--template-primary)" }} />
          <span>Continuous Edge Infrastructure</span>
        </div>

        <h1
          className="text-2xl @xs:text-3xl @sm:text-4xl @md:text-5xl @lg:text-6xl font-extrabold tracking-tight mb-5 leading-[1.12]"
          style={{ fontFamily: "var(--template-heading-font)" }}
        >
          The Developer Cloud for High-Velocity Teams.
        </h1>

        <p
          className="text-sm @sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed"
          style={{ color: "var(--template-fg-muted)" }}
        >
          Push code, spawn instant ephemeral preview environments, and deploy across global edge nodes
          with zero configuration overhead.
        </p>

        {/* Live CI/CD Pipeline Card */}
        <div
          className="max-w-3xl mx-auto rounded-2xl border p-4 @sm:p-6 text-left shadow-lg transition-all"
          style={{
            backgroundColor: "var(--template-surface-elevated)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
            boxShadow: "var(--template-card-shadow-elevated)",
          }}
        >
          <div
            className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-2.5 pb-3.5 mb-4 border-b text-sm"
            style={{ borderColor: "var(--template-border)" }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-mono font-semibold">prod-edge-gateway #8492</span>
              <span className="opacity-50">on main</span>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-semibold">Ready in 1.4s</span>
          </div>

          {/* 3 Pipeline Steps */}
          <div className="grid grid-cols-1 @sm:grid-cols-3 gap-3 mb-4">
            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{
                backgroundColor: "var(--template-surface-muted)",
                borderColor: "var(--template-border)",
                borderRadius: "calc(var(--template-radius) - 2px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono opacity-75">1. Build & Tree Shake</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm font-mono font-semibold">14 bundles (42kb)</p>
            </div>

            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{
                backgroundColor: "var(--template-surface-muted)",
                borderColor: "var(--template-border)",
                borderRadius: "calc(var(--template-radius) - 2px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono opacity-75">2. Edge Replication</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm font-mono font-semibold">312 nodes synced</p>
            </div>

            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{
                backgroundColor: "var(--template-surface-muted)",
                borderColor: "var(--template-border)",
                borderRadius: "calc(var(--template-radius) - 2px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono opacity-75">3. TLS & SSL Routing</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm font-mono font-semibold">Active & Encrypted</p>
            </div>
          </div>

          {/* Generated preview URL bar */}
          <div
            className="p-3.5 rounded-xl border flex flex-col @sm:flex-row @sm:items-center justify-between gap-3 text-xs @sm:text-sm font-mono"
            style={{
              backgroundColor: "rgba(var(--template-primary-rgb), 0.05)",
              borderColor: "rgba(var(--template-primary-rgb), 0.2)",
              borderRadius: "calc(var(--template-radius) - 2px)",
            }}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--template-primary)" }} />
              <span className="truncate">https://aura-cloud-gateway-preview-q8x.edge.dev</span>
            </div>
            <a
              href="#visit"
              className="flex items-center gap-1.5 font-semibold shrink-0 hover:underline"
              style={{ color: "var(--template-primary)" }}
            >
              <span>Visit Preview</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Feature Tabs Section */}
      <section
        className="py-12 @sm:py-16 px-4 @sm:px-6 max-w-5xl mx-auto border-t"
        style={{ borderColor: "var(--template-border)" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {[
            { id: "branch", label: "Instant Branch Previews" },
            { id: "edge", label: "Zero-Downtime Rollbacks" },
            { id: "telemetry", label: "Edge Telemetry & KV" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                activeTab === tab.id
                  ? "shadow-sm font-semibold text-white"
                  : "hover:opacity-100"
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? "var(--template-primary)" : "var(--template-surface)",
                borderColor: activeTab === tab.id ? "var(--template-primary)" : "var(--template-border)",
                color: activeTab === tab.id ? "#ffffff" : "var(--template-fg-muted)",
                borderRadius: "var(--template-radius)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Detail View */}
        <div
          className="p-6 @sm:p-8 rounded-2xl border transition-all"
          style={{
            backgroundColor: "var(--template-surface-elevated)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
            boxShadow: "var(--template-card-shadow)",
          }}
        >
          {activeTab === "branch" && (
            <div className="space-y-4 text-sm">
              <h3 className="font-bold text-lg @sm:text-xl" style={{ fontFamily: "var(--template-heading-font)" }}>
                Every Git commit gets a production replica.
              </h3>
              <p className="leading-relaxed" style={{ color: "var(--template-fg-muted)" }}>
                Share live preview links with team members and clients. Comments left on the preview link are
                automatically linked back to your GitHub PR.
              </p>
              <div
                className="p-4 rounded-xl font-mono text-xs @sm:text-sm border overflow-x-auto leading-relaxed"
                style={{
                  backgroundColor: "var(--template-surface-muted)",
                  borderColor: "var(--template-border)",
                  borderRadius: "calc(var(--template-radius) - 2px)",
                }}
              >
                git checkout -b feat/redesign-checkout <br />
                git push origin feat/redesign-checkout <br />
                <span className="text-emerald-500 font-semibold">
                  → [Aura Cloud] Ephemeral environment deployed at https://pr-42.aura.run (2.1s)
                </span>
              </div>
            </div>
          )}

          {activeTab === "edge" && (
            <div className="space-y-4 text-sm">
              <h3 className="font-bold text-lg @sm:text-xl" style={{ fontFamily: "var(--template-heading-font)" }}>
                Instant atomic rollbacks with zero traffic drops.
              </h3>
              <p className="leading-relaxed" style={{ color: "var(--template-fg-muted)" }}>
                If an unexpected error occurs, revert back to any historical checkpoint with a single click or CLI
                command in under 300 milliseconds.
              </p>
              <div
                className="p-4 rounded-xl font-mono text-xs @sm:text-sm border overflow-x-auto leading-relaxed"
                style={{
                  backgroundColor: "var(--template-surface-muted)",
                  borderColor: "var(--template-border)",
                  borderRadius: "calc(var(--template-radius) - 2px)",
                }}
              >
                $ aura rollback --target=v2.14.0 --atomic <br />
                <span className="text-emerald-500 font-semibold">
                  ✓ Reverted 312 edge locations to commit [d91a2] in 280ms. Error rate: 0.00%
                </span>
              </div>
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="space-y-4 text-sm">
              <h3 className="font-bold text-lg @sm:text-xl" style={{ fontFamily: "var(--template-heading-font)" }}>
                Built-in microsecond telemetry and distributed KV.
              </h3>
              <p className="leading-relaxed" style={{ color: "var(--template-fg-muted)" }}>
                Inspect cold starts, invocation count, memory consumption, and cache hit ratios without configuring
                external log aggregators.
              </p>
              <div className="grid grid-cols-2 @sm:grid-cols-4 gap-3.5 font-mono">
                <div
                  className="p-3.5 rounded-xl border"
                  style={{
                    backgroundColor: "var(--template-surface-muted)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <p className="text-xs font-mono font-medium" style={{ color: "var(--template-fg-muted)" }}>CACHE HIT RATE</p>
                  <p className="text-xl font-bold text-emerald-500 mt-1">99.82%</p>
                </div>
                <div
                  className="p-3.5 rounded-xl border"
                  style={{
                    backgroundColor: "var(--template-surface-muted)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <p className="text-xs font-mono font-medium" style={{ color: "var(--template-fg-muted)" }}>AVG LATENCY</p>
                  <p className="text-xl font-bold mt-1">1.2ms</p>
                </div>
                <div
                  className="p-3.5 rounded-xl border"
                  style={{
                    backgroundColor: "var(--template-surface-muted)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <p className="text-xs font-mono font-medium" style={{ color: "var(--template-fg-muted)" }}>INVOCATIONS</p>
                  <p className="text-xl font-bold mt-1">14.2M / day</p>
                </div>
                <div
                  className="p-3.5 rounded-xl border"
                  style={{
                    backgroundColor: "var(--template-surface-muted)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <p className="text-xs font-mono font-medium" style={{ color: "var(--template-fg-muted)" }}>COLD START</p>
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
              className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div
                className="p-3.5 border-b flex items-center gap-2.5"
                style={{ borderColor: "var(--template-border)" }}
              >
                <Search className="h-4 w-4 opacity-50" />
                <input
                  type="text"
                  autoFocus
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder="Type a command or search deployments..."
                  className="w-full bg-transparent text-sm focus:outline-none py-1"
                  style={{ color: "var(--template-fg)" }}
                />
                <button
                  onClick={() => setIsCommandOpen(false)}
                  className="p-1 rounded hover:opacity-75 transition-opacity"
                  aria-label="Close Command Palette"
                >
                  <X className="h-4 w-4 opacity-60" />
                </button>
              </div>

              <div className="p-2 max-h-60 overflow-y-auto space-y-1">
                {filteredCommands.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      alert(`Executed command: "${item.label}"`);
                      setIsCommandOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-sm transition-colors text-left"
                    style={{
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4" style={{ color: "var(--template-primary)" }} />
                      <span style={{ color: "var(--template-fg)" }}>{item.label}</span>
                    </div>
                    <span className="text-xs opacity-60 font-mono">{item.category}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        className="py-8 px-4 @sm:px-6 border-t text-center text-xs"
        style={{
          borderColor: "var(--template-border)",
          color: "var(--template-fg-muted)",
        }}
      >
        <p>© {new Date().getFullYear()} {config.brandName || "Aura Cloud"}. Designed for high-velocity software engineering.</p>
      </footer>
    </div>
  );
}
