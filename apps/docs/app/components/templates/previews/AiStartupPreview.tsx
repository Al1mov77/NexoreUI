"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Check,
  ChevronRight,
  Send,
  Terminal,
  Activity,
  Layers,
  Menu,
  X,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function AiStartupPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  const [selectedModel, setSelectedModel] = useState<"Synthetix-R1" | "Claude-3.5" | "GPT-4o">("Synthetix-R1");
  const [promptText, setPromptText] = useState("Generate an edge-routed vector indexing service");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(
    "✓ Graph compiled. 4 regions provisioned. TTFT: 12ms. Throughput: 142 tok/s."
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const promptSuggestions = [
    "Edge vector indexer",
    "Rust WebSocket gateway",
    "Zero-knowledge rollup audit",
  ];

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setGeneratedOutput(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedOutput(
        `✓ [${selectedModel}] execution complete. 2,140 tokens streamed with zero-copy serialization. Global latency: 1.2ms.`
      );
    }, 850);
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans selection:bg-indigo-500/20"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Subtle top indicator bar */}
      <div
        className="w-full py-2.5 px-4 text-center text-xs font-mono border-b transition-colors flex items-center justify-center gap-2"
        style={{
          backgroundColor: "var(--template-surface)",
          borderColor: "var(--template-border)",
          color: "var(--template-fg-muted)",
        }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--template-primary)" }}
        />
        <span className="font-semibold">Synthetix Core 3.4 Operational</span>
        <span className="opacity-40">•</span>
        <span>Global TTFT: 4.2ms</span>
      </div>

      {/* Navigation */}
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
              {config.brandName || "Synthetix AI"}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden @md:flex items-center gap-7 text-sm font-medium"
            style={{ color: "var(--template-fg-muted)" }}
          >
            <a href="#playground" className="hover:text-[var(--template-fg)] transition-colors">
              Playground
            </a>
            <a href="#benchmarks" className="hover:text-[var(--template-fg)] transition-colors">
              Benchmarks
            </a>
            <a href="#architecture" className="hover:text-[var(--template-fg)] transition-colors">
              Architecture
            </a>
            <a href="#pricing" className="hover:text-[var(--template-fg)] transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              className="hidden @sm:inline-flex text-sm font-medium px-4 py-2 rounded-lg border transition-all hover:opacity-80"
              style={{
                borderColor: "var(--template-border)",
                backgroundColor: "var(--template-surface)",
                color: "var(--template-fg)",
                borderRadius: "var(--template-radius)",
              }}
            >
              Sign In
            </button>
            <button
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white shadow-sm transition-all flex items-center gap-1.5 hover:brightness-110"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <span>Get API Key</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="@md:hidden p-2 rounded-lg border transition-colors"
              style={{
                borderColor: "var(--template-border)",
                backgroundColor: "var(--template-surface)",
                color: "var(--template-fg)",
              }}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="@md:hidden border-b px-4 py-3 space-y-2 text-sm font-medium overflow-hidden"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <a
                href="#playground"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[var(--template-fg)]"
                style={{ color: "var(--template-fg-muted)" }}
              >
                Interactive Playground
              </a>
              <a
                href="#benchmarks"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[var(--template-fg)]"
                style={{ color: "var(--template-fg-muted)" }}
              >
                Inference Benchmarks
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[var(--template-fg)]"
                style={{ color: "var(--template-fg-muted)" }}
              >
                Tiered Pricing
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-10 @sm:pt-16 @md:pt-20 pb-12 @md:pb-16 px-4 @sm:px-6 max-w-4xl mx-auto text-center">
        {/* Subtle pill tag */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-medium mb-6 transition-colors"
          style={{
            backgroundColor: "var(--template-surface-muted)",
            borderColor: "var(--template-border)",
            color: "var(--template-fg-muted)",
          }}
        >
          <Cpu className="h-3.5 w-3.5" style={{ color: "var(--template-primary)" }} />
          <span>Next-Generation Autonomous Inference Engine</span>
        </div>

        <h1
          className="text-2xl @xs:text-3xl @sm:text-4xl @md:text-5xl @lg:text-6xl font-extrabold tracking-tight mb-5 leading-[1.12]"
          style={{ fontFamily: "var(--template-heading-font)" }}
        >
          Zero Latency. Real Autonomous Intelligence.
        </h1>

        <p
          className="text-sm @sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed"
          style={{ color: "var(--template-fg-muted)" }}
        >
          Stream deep reasoning tokens directly to edge clients. Synthesize complex backend architectures,
          fine-tune proprietary weights, and run telemetry without cold starts.
        </p>

        {/* Live Interactive Model Playground Card */}
        <div
          id="playground"
          className="max-w-2xl mx-auto rounded-2xl border p-4 @sm:p-6 text-left shadow-lg transition-all"
          style={{
            backgroundColor: "var(--template-surface-elevated)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
            boxShadow: "var(--template-card-shadow-elevated)",
          }}
        >
          {/* Header Controls */}
          <div
            className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-3 pb-3 mb-3 border-b"
            style={{ borderColor: "var(--template-border)" }}
          >
            <div
              className="inline-flex items-center gap-1 p-1 rounded-lg border text-xs"
              style={{
                backgroundColor: "var(--template-surface-muted)",
                borderColor: "var(--template-border)",
              }}
            >
              {(["Synthetix-R1", "Claude-3.5", "GPT-4o"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedModel === m
                      ? "text-white font-semibold shadow-sm"
                      : "opacity-75 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: selectedModel === m ? "var(--template-primary)" : "transparent",
                    color: selectedModel === m ? "#ffffff" : "var(--template-fg)",
                    borderRadius: "calc(var(--template-radius) - 4px)",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            <div
              className="flex items-center gap-2 text-xs font-mono"
              style={{ color: "var(--template-fg-muted)" }}
            >
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-500" />
                <span>1,200 tok/s</span>
              </span>
              <span>•</span>
              <span>Sub-15ms TTFT</span>
            </div>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleSynthesize} className="space-y-3">
            <div
              className="flex flex-col @sm:flex-row items-stretch @sm:items-center gap-2 p-2.5 rounded-xl border transition-all focus-within:ring-1"
              style={{
                backgroundColor: "var(--template-surface-muted)",
                borderColor: "var(--template-border)",
                borderRadius: "calc(var(--template-radius) - 2px)",
              }}
            >
              <div className="flex items-center gap-2.5 flex-1 px-1.5">
                <Terminal className="h-4 w-4 shrink-0 opacity-40" />
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Type an inference prompt..."
                  className="w-full bg-transparent text-sm focus:outline-none py-1.5"
                  style={{ color: "var(--template-fg)" }}
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className="h-10 px-5 rounded-lg text-sm font-semibold text-white shrink-0 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:brightness-110"
                style={{
                  backgroundColor: "var(--template-primary)",
                  borderRadius: "calc(var(--template-radius) - 4px)",
                }}
              >
                {isGenerating ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Synthesize</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt suggestions */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="opacity-50">Quick test:</span>
              {promptSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptText(s)}
                  className="px-2.5 py-1 rounded-md border transition-colors truncate max-w-[200px]"
                  style={{
                    backgroundColor: "var(--template-surface)",
                    borderColor: "var(--template-border)",
                    color: "var(--template-fg-muted)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Generated Output Area */}
            <AnimatePresence>
              {generatedOutput && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 rounded-xl border text-xs leading-relaxed"
                  style={{
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                    borderColor: "var(--template-border)",
                    color: "var(--template-fg)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5 text-xs" style={{ color: "var(--template-fg-muted)" }}>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--template-primary)" }} />
                      <span>Inference Output</span>
                    </span>
                    <span className="text-emerald-500 font-mono font-semibold">200 OK</span>
                  </div>
                  <p className="font-mono text-xs leading-normal">{generatedOutput}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>

      {/* Benchmarks Section */}
      <section
        id="benchmarks"
        className="py-12 @sm:py-16 px-4 @sm:px-6 max-w-5xl mx-auto border-t"
        style={{ borderColor: "var(--template-border)" }}
      >
        <div className="text-center max-w-xl mx-auto mb-8 @sm:mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--template-primary)" }}
          >
            Precision Benchmarks
          </p>
          <h2
            className="text-xl @sm:text-2xl @md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--template-heading-font)" }}
          >
            Engineered for Microsecond Precision
          </h2>
        </div>

        {/* Responsive Table / Card View */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: "var(--template-border)",
            backgroundColor: "var(--template-surface)",
            boxShadow: "var(--template-card-shadow)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs @sm:text-sm text-left min-w-[500px]">
              <thead
                className="text-xs uppercase font-mono border-b"
                style={{
                  backgroundColor: "var(--template-surface-muted)",
                  borderColor: "var(--template-border)",
                  color: "var(--template-fg-muted)",
                }}
              >
                <tr>
                  <th className="p-3.5 font-semibold">Model Architecture</th>
                  <th className="p-3.5 font-semibold">TTFT</th>
                  <th className="p-3.5 font-semibold">Throughput</th>
                  <th className="p-3.5 font-semibold">Cold Start</th>
                  <th className="p-3.5 font-semibold text-right">Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--template-border)" }}>
                <tr>
                  <td className="p-3.5 font-semibold flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "var(--template-primary)" }}
                    />
                    <span>Synthetix R1 Ultra</span>
                  </td>
                  <td className="p-3.5 text-emerald-500 font-bold font-mono">4.2ms</td>
                  <td className="p-3.5 font-mono">280 tok/s</td>
                  <td className="p-3.5 font-mono">0.0ms</td>
                  <td className="p-3.5 text-right font-mono text-emerald-500 font-semibold">180 Regions</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium flex items-center gap-2 opacity-75">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    <span>Claude 3.5 Sonnet Standard</span>
                  </td>
                  <td className="p-3.5 opacity-75 font-mono">28.4ms</td>
                  <td className="p-3.5 opacity-75 font-mono">82 tok/s</td>
                  <td className="p-3.5 opacity-75 font-mono">120ms</td>
                  <td className="p-3.5 text-right opacity-75 font-mono">Single Region</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium flex items-center gap-2 opacity-75">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    <span>GPT-4o Baseline</span>
                  </td>
                  <td className="p-3.5 opacity-75 font-mono">34.1ms</td>
                  <td className="p-3.5 opacity-75 font-mono">76 tok/s</td>
                  <td className="p-3.5 opacity-75 font-mono">95ms</td>
                  <td className="p-3.5 text-right opacity-75 font-mono">Dual Region</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-12 @sm:py-16 px-4 @sm:px-6 max-w-4xl mx-auto border-t"
        style={{ borderColor: "var(--template-border)" }}
      >
        <div className="text-center max-w-xl mx-auto mb-8 @sm:mb-10">
          <h2
            className="text-xl @sm:text-2xl @md:text-3xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "var(--template-heading-font)" }}
          >
            Predictable Developer Pricing
          </h2>
          <p className="text-sm" style={{ color: "var(--template-fg-muted)" }}>
            Scale from initial prototype to production scale with clear usage terms.
          </p>

          {/* Billing Cycle Pill Toggle */}
          <div
            className="inline-flex items-center gap-1.5 p-1 mt-5 rounded-full border text-xs"
            style={{
              backgroundColor: "var(--template-surface-muted)",
              borderColor: "var(--template-border)",
            }}
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                billingCycle === "monthly" ? "shadow-sm font-semibold" : "opacity-70 hover:opacity-100"
              }`}
              style={{
                backgroundColor: billingCycle === "monthly" ? "var(--template-surface-elevated)" : "transparent",
                color: "var(--template-fg)",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                billingCycle === "annual" ? "shadow-sm font-semibold" : "opacity-70 hover:opacity-100"
              }`}
              style={{
                backgroundColor: billingCycle === "annual" ? "var(--template-surface-elevated)" : "transparent",
                color: "var(--template-fg)",
              }}
            >
              <span>Annual</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                }}
              >
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Starter Tier */}
          <div
            className="p-6 @sm:p-7 rounded-2xl border flex flex-col justify-between transition-all"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
              boxShadow: "var(--template-card-shadow)",
            }}
          >
            <div>
              <h3 className="font-bold text-lg mb-1">Developer Starter</h3>
              <p className="text-sm mb-5" style={{ color: "var(--template-fg-muted)" }}>
                For engineers building prototypes and internal agents.
              </p>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-bold font-mono">$0</span>
                <span className="text-sm opacity-60">/ forever free</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>100,000 free tokens / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>3 edge regions access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Community Discord support</span>
                </li>
              </ul>
            </div>
            <button
              className="w-full mt-7 h-11 rounded-xl border text-sm font-semibold hover:opacity-80 transition-all flex items-center justify-center"
              style={{
                borderColor: "var(--template-border)",
                backgroundColor: "var(--template-surface-elevated)",
                color: "var(--template-fg)",
                borderRadius: "var(--template-radius)",
              }}
            >
              Get Started Free
            </button>
          </div>

          {/* Production Tier */}
          <div
            className="p-6 @sm:p-7 rounded-2xl border flex flex-col justify-between relative transition-all"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-primary)",
              borderRadius: "var(--template-radius)",
              boxShadow: "var(--template-card-shadow-elevated)",
            }}
          >
            <span
              className="absolute -top-3 right-5 px-3 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              RECOMMENDED
            </span>
            <div>
              <h3 className="font-bold text-lg mb-1">Production Cluster</h3>
              <p className="text-sm mb-5" style={{ color: "var(--template-fg-muted)" }}>
                For high-throughput AI services with guaranteed latency.
              </p>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-bold font-mono">
                  {billingCycle === "annual" ? "$49" : "$65"}
                </span>
                <span className="text-sm opacity-60">/ month</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>100M tokens + $0.20/M overage</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>180+ global edge locations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Zero data retention guarantee</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Dedicated SLA & priority support</span>
                </li>
              </ul>
            </div>
            <button
              className="w-full mt-7 h-11 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 flex items-center justify-center"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              Start 14-Day Production Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 @sm:px-6 border-t text-center text-xs"
        style={{
          borderColor: "var(--template-border)",
          color: "var(--template-fg-muted)",
        }}
      >
        <p>© {new Date().getFullYear()} {config.brandName || "Synthetix AI"}. All rights reserved.</p>
      </footer>
    </div>
  );
}
