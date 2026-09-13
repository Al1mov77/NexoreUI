export const templateDevtoolsCli = {
  name: "template-devtools-cli",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-devtools-cli.tsx",
  content: `"use client";

import React, { useState } from "react";
import {
  Terminal,
  Copy,
  Check,
  Star,
  Flame,
} from "lucide-react";

export interface DevtoolsCliTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function DevtoolsCliTemplate({
  brandName = "HyperTerminal",
  theme = "dark",
}: DevtoolsCliTemplateProps) {
  
    const isDark = theme === "dark";

  const [copiedCurl, setCopiedCurl] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "hyper init --template=edge-runtime",
    "✓ Initialized repository in 12ms",
    "hyper bench --concurrent=1000",
    "✓ P99 latency: 0.8ms across 1,000 parallel threads",
  ]);

  const sampleCommands = ["hyper bench --fast", "hyper deploy --prod", "hyper status"];

  const handleCopyCurl = () => {
    navigator.clipboard.writeText("curl -fsSL https://get.hyperterminal.dev | sh");
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleTerminalSubmit = (e?: React.FormEvent, manualCmd?: string) => {
    if (e) e.preventDefault();
    const cmd = (manualCmd || terminalInput).trim();
    if (!cmd) return;
    let response = \`Executed: \${cmd}\`;
    if (cmd.includes("bench")) {
      response = "✓ Bench: 4.8M ops/sec. Memory: 12.8MB RSS. Zero memory leaks.";
    } else if (cmd.includes("deploy")) {
      response = "✓ Provisioned 35 edge clusters in 380ms. Routing active.";
    } else if (cmd.includes("status")) {
      response = "✓ All 35 edge nodes healthy. CPU load: 1.4%. FPS: 120.";
    } else {
      response = \`✓ Command '\${cmd}' executed successfully in 6ms.\`;
    }
    setTerminalHistory((prev) => [...prev, cmd, response]);
    setTerminalInput("");
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans"
      
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all shrink-0"
              
            >
              <Terminal className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-sm sm:text-base tracking-tight"
              
            >
              {brandName || "HyperTerminal"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>18.4k stars</span>
            </div>

            <button
              onClick={handleCopyCurl}
              className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 flex items-center gap-2"
              
            >
              {copiedCurl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copiedCurl ? "Copied!" : "Install CLI"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero: Split Value Prop & Terminal View */}
      <section className="pt-8 sm:pt-14 lg:pt-20 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono"
              style={{
                backgroundColor: "#161822",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#6366f1",
              }}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Engineered in Rust • Zero C FFI</span>
            </div>

            <h1
              className="text-2xl @xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]"
              
            >
              The High-Performance Terminal for Systems Engineers.
            </h1>

            <p className="text-sm sm:text-base leading-relaxed" >
              Sub-millisecond input rendering, native GPU acceleration, multiplexed shell sessions, and
              instant distributed telemetry out of the box.
            </p>

            {/* Quick Curl Box */}
            <div
              className="p-3 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm shadow-sm"
              
            >
              <div className="flex items-center gap-2.5 truncate font-mono text-xs sm:text-sm min-w-0">
                <span className="text-emerald-500 font-bold shrink-0">$</span>
                <span className="truncate" >
                  curl -fsSL https://get.hyperterminal.dev | sh
                </span>
              </div>
              <button
                onClick={handleCopyCurl}
                className="p-1.5 rounded hover:opacity-75 transition-opacity shrink-0"
                aria-label="Copy install command"
              >
                {copiedCurl ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 opacity-60" />}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Terminal Sandbox */}
          <div className="lg:col-span-6 w-full">
            <div
              className="rounded-2xl border shadow-xl overflow-hidden font-mono text-xs sm:text-sm transition-all"
              style={{
                backgroundColor: isDark ? "#08090d" : "#11131a",
                color: "#fafafa",
                borderColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: "0.75rem",
              }}
            >
              {/* Window Titlebar */}
              <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs opacity-60 truncate max-w-[200px]">
                  hyper-session: ~/workspace/prod
                </span>
                <span className="text-xs text-emerald-400 font-bold">120 FPS</span>
              </div>

              {/* Terminal Logs */}
              <div className="p-4 sm:p-5 space-y-2.5 max-h-64 sm:max-h-80 overflow-y-auto no-scrollbar">
                {terminalHistory.map((line, idx) => (
                  <div
                    key={idx}
                    className={line.startsWith("✓") ? "text-emerald-400 font-medium" : "text-zinc-200"}
                  >
                    {!line.startsWith("✓") && <span className="mr-2" >$</span>}
                    {line}
                  </div>
                ))}

                {/* Active input prompt */}
                <form onSubmit={(e) => handleTerminalSubmit(e)} className="flex items-center gap-2 pt-1">
                  <span >$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="try: hyper bench --fast"
                    className="w-full bg-transparent focus:outline-none text-white placeholder:text-zinc-600 text-xs sm:text-sm"
                  />
                </form>
              </div>

              {/* Quick interactive chip buttons for mobile / touch */}
              <div className="px-4 py-2.5 bg-black/30 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
                <span className="opacity-40">Tap run:</span>
                {sampleCommands.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => handleTerminalSubmit(undefined, cmd)}
                    className="px-2.5 py-1 rounded border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-colors font-mono"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benchmark Matrix */}
      <section
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t"
        
      >
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
            
          >
            Engineered For Pure Performance
          </h2>
          <p className="text-xs sm:text-sm" >
            Verified on 64-core Linux kernel 6.8 environments with native GPU rasterization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div
            className="p-6 rounded-xl border text-center transition-all"
            
          >
            <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-2" >
              COLD START LATENCY
            </p>
            <p className="text-3xl sm:text-4xl font-bold font-mono text-emerald-500 mb-2">0.4ms</p>
            <p className="text-xs sm:text-sm opacity-70">18x faster than traditional shells</p>
          </div>

          <div
            className="p-6 rounded-xl border text-center transition-all"
            
          >
            <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-2" >
              MEMORY FOOTPRINT
            </p>
            <p className="text-3xl sm:text-4xl font-bold font-mono mb-2" >
              12.8 MB
            </p>
            <p className="text-xs sm:text-sm opacity-70">94% less memory than web wrappers</p>
          </div>

          <div
            className="p-6 rounded-xl border text-center transition-all"
            
          >
            <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-2" >
              RENDER REFRESH RATE
            </p>
            <p className="text-3xl sm:text-4xl font-bold font-mono text-amber-500 mb-2">120 FPS</p>
            <p className="text-xs sm:text-sm opacity-70">Metal & Vulkan GPU acceleration</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 sm:px-6 border-t text-center text-xs sm:text-sm"
        
      >
        <p>© {new Date().getFullYear()} {brandName || "HyperTerminal"}. Open source MIT licensed.</p>
      </footer>
    </div>
  );
}
`,
};
