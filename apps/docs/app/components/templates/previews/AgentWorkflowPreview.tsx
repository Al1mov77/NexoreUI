"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  Play,
  Sliders,
  CheckCircle2,
  GitBranch,
  Cpu,
  Database,
  Send,
  Plus,
  RefreshCw,
  X,
  Sparkles,
  Zap,
  Code2,
  Settings,
  ChevronRight,
  Terminal,
  Activity,
  Layers,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function AgentWorkflowPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [activeRecipe, setActiveRecipe] = useState<"support" | "finance" | "lead">("support");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-llm");
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [temperature, setTemperature] = useState(0.2);
  const [modelChoice, setModelChoice] = useState("Claude 3.5 Sonnet");
  const [logs, setLogs] = useState<string[]>([
    "✓ Canvas initialized. 4 nodes mounted. Latency baseline: 2ms.",
  ]);

  const nodes = [
    {
      id: "node-trigger",
      title: "Webhook Ingress",
      category: "Trigger",
      icon: Zap,
      color: "border-amber-500 text-amber-500",
      bg: "bg-amber-500/10",
      details: "POST /v1/incoming-inquiry",
      meta: "Payload: JSON Schema 2.0",
    },
    {
      id: "node-rag",
      title: "Vector DB Retrieval",
      category: "Knowledge Tool",
      icon: Database,
      color: "border-cyan-500 text-cyan-500",
      bg: "bg-cyan-500/10",
      details: "Pinecone: support-kb-v4",
      meta: "Top K: 5 • Cosine Threshold: 0.86",
    },
    {
      id: "node-llm",
      title: "Reasoning LLM",
      category: "Model Engine",
      icon: Cpu,
      color: "border-blue-500 text-blue-500",
      bg: "bg-blue-500/10",
      details: modelChoice,
      meta: `Temp: ${temperature} • Max: 1,024 toks`,
    },
    {
      id: "node-dispatch",
      title: "Action Dispatcher",
      category: "Output Tool",
      icon: Send,
      color: "border-emerald-500 text-emerald-500",
      bg: "bg-emerald-500/10",
      details: "Zendesk & Slack Webhook",
      meta: "Route: #support-escalations",
    },
  ];

  const handleRunPipeline = () => {
    setIsRunning(true);
    setActiveStepIndex(0);
    setLogs(["[00:00] Initializing workflow execution..."]);

    setTimeout(() => {
      setActiveStepIndex(1);
      setLogs((prev) => [...prev, "[00:18] Webhook event received. Parsing customer payload..."]);
      setTimeout(() => {
        setActiveStepIndex(2);
        setLogs((prev) => [
          ...prev,
          "[00:94] Vector search complete. 5 knowledge chunks fetched from Pinecone.",
        ]);
        setTimeout(() => {
          setActiveStepIndex(3);
          setLogs((prev) => [
            ...prev,
            `[04:20] ${modelChoice} synthesized resolution with 420 reasoning tokens.`,
          ]);
          setTimeout(() => {
            setIsRunning(false);
            setActiveStepIndex(null);
            setLogs((prev) => [
              ...prev,
              "✓ [05:10] Workflow finished! Response delivered to Zendesk ticket #4910.",
            ]);
          }, 800);
        }, 1100);
      }, 700);
    }, 600);
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans text-left"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Studio Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "layers"} className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-bold text-sm @sm:text-base tracking-tight"
                style={{ fontFamily: "var(--template-heading-font)" }}
              >
                {config.brandName || "Nexus Nodes"}
              </span>
              <span className="hidden @md:inline-block text-xs opacity-60 ml-2 font-mono">
                • Visual Agent Orchestrator
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            <button
              onClick={handleRunPipeline}
              disabled={isRunning}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-transform active:scale-95"
              style={{
                backgroundColor: isRunning ? "#2563eb" : "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Test Run Workflow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas Workspace */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Pipeline Control Toolbar */}
        <div
          className="p-4 rounded-2xl border flex flex-col @sm:flex-row items-start @sm:items-center justify-between gap-3"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold opacity-70">Preset Workflow:</span>
            <div
              className="inline-flex p-0.5 rounded-xl border"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
              }}
            >
              {[
                { id: "support", label: "Support Auto-Triage" },
                { id: "finance", label: "Doc Extractor" },
                { id: "lead", label: "Lead Scoring" },
              ].map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => setActiveRecipe(rec.id as any)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    activeRecipe === rec.id
                      ? "bg-blue-600 text-white font-bold shadow-sm"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono opacity-60">
            <span>Canvas Status: Operational</span>
            <span>•</span>
            <span>4 Active Nodes</span>
          </div>
        </div>

        {/* Visual Graph Nodes Flow + Parameter Inspector */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
          {/* Node Canvas Area: 8 Cols */}
          <div className="@lg:col-span-8 space-y-6">
            <div
              className="p-6 @sm:p-8 rounded-3xl border relative overflow-hidden min-h-[420px] flex flex-col justify-between"
              style={{
                backgroundColor: isDark ? "#090a10" : "#f8fafc",
                borderColor: "var(--template-border)",
                backgroundImage: `radial-gradient(${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            >
              <div className="flex justify-between items-center text-xs opacity-60 font-mono">
                <span>CANVAS: ORCHESTRATION GRAPH</span>
                <span>EXECUTION: SERIAL SYNCHRONOUS</span>
              </div>

              {/* Connected Nodes Flow Sequence */}
              <div className="flex flex-col @sm:flex-row items-center justify-between gap-3 my-auto py-6">
                {nodes.map((node, index) => {
                  const IconComp = node.icon;
                  const isSelected = selectedNodeId === node.id;
                  const isCurrentlyExecuting = activeStepIndex === index;

                  return (
                    <React.Fragment key={node.id}>
                      {/* Node Card */}
                      <button
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`w-full @sm:w-44 p-4 rounded-2xl border text-left transition-all relative ${
                          isCurrentlyExecuting
                            ? "ring-4 ring-blue-500 scale-105 shadow-xl bg-blue-500/20"
                            : isSelected
                            ? "ring-2 ring-blue-500 shadow-md"
                            : "hover:border-zinc-400"
                        }`}
                        style={{
                          backgroundColor: isSelected
                            ? "var(--template-surface-elevated)"
                            : "var(--template-surface)",
                          borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-1.5 rounded-lg ${node.bg} ${node.color}`}>
                            <IconComp className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-mono opacity-60">{node.category}</span>
                        </div>

                        <div className="font-bold text-xs @sm:text-sm truncate">{node.title}</div>
                        <div className="text-[11px] opacity-75 font-mono truncate mt-0.5">{node.details}</div>
                      </button>

                      {/* Connecting Cable Connector Indicator */}
                      {index < nodes.length - 1 && (
                        <div className="flex items-center justify-center my-1 @sm:my-0">
                          <div
                            className={`w-6 h-0.5 @sm:w-8 transition-colors ${
                              activeStepIndex !== null && activeStepIndex > index
                                ? "bg-blue-500 shadow-sm"
                                : "bg-zinc-300 dark:bg-zinc-700"
                            }`}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-xs opacity-60">
                <span>Tip: Click any node to configure parameters in inspector.</span>
                <span className="font-mono">Node ID: {selectedNodeId}</span>
              </div>
            </div>

            {/* Live Pipeline Execution Terminal Console */}
            <div
              className="p-5 rounded-2xl border space-y-2 font-mono text-xs"
              style={{
                backgroundColor: isDark ? "#06070a" : "#0f172a",
                borderColor: "var(--template-border)",
                color: "#e2e8f0",
              }}
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/10 text-[11px] opacity-60">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-blue-400" />
                  <span>Pipeline Execution Telemetry</span>
                </span>
                <span>Stream Active</span>
              </div>

              <div className="space-y-1 pt-1 max-h-36 overflow-y-auto">
                {logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed opacity-90">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Parameter Inspector Sidebar Drawer: 4 Cols */}
          <div className="@lg:col-span-4 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-5 shadow-sm"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="border-b pb-3">
                <div className="text-xs uppercase font-mono tracking-wider opacity-60">Node Parameters</div>
                <h3 className="font-bold text-base mt-0.5">
                  {nodes.find((n) => n.id === selectedNodeId)?.title}
                </h3>
              </div>

              {selectedNodeId === "node-llm" ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Foundation Model</label>
                    <select
                      value={modelChoice}
                      onChange={(e) => setModelChoice(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                      style={{ borderColor: "var(--template-border)" }}
                    >
                      <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                      <option value="DeepSeek R1">DeepSeek R1 (Reasoning)</option>
                      <option value="GPT-4o Omnimodal">GPT-4o (OpenAI)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1 opacity-80">
                      <span>Sampling Temperature</span>
                      <span className="font-mono">{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] opacity-50 font-mono">
                      <span>Deterministic (0.0)</span>
                      <span>Creative (1.0)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 opacity-80">System Directive</label>
                    <textarea
                      rows={3}
                      defaultValue="Analyze customer ticket intent, cross-reference Pinecone vectors, and generate concise verified resolution."
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none text-xs leading-relaxed"
                      style={{ borderColor: "var(--template-border)" }}
                    />
                  </div>
                </div>
              ) : selectedNodeId === "node-rag" ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Vector Index</label>
                    <input
                      type="text"
                      defaultValue="support-kb-v4"
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none font-mono"
                      style={{ borderColor: "var(--template-border)" }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Similarity Threshold (Cosine)</label>
                    <input
                      type="text"
                      defaultValue="0.86"
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none font-mono"
                      style={{ borderColor: "var(--template-border)" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs opacity-75 leading-relaxed">
                  <p>Standard configuration active for {selectedNodeId}. All payload schema validations passing.</p>
                </div>
              )}

              <div className="border-t pt-4">
                <button
                  onClick={handleRunPipeline}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-sm"
                >
                  Apply & Run Node
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
