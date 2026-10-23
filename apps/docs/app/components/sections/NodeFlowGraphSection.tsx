"use client";

import React, { useState } from "react";
import { NodeFlowGraph, FlowNode, FlowEdge } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { Sparkles, Bot, Database, Globe, Cpu } from "lucide-react";
import { nodeFlowGraph } from "../../../../../packages/cli/src/registry/node-flow-graph";

const propsData = [
  {
    name: "initialNodes",
    type: "FlowNode[]",
    defaultValue: "defaultNodes",
    description: "Array of workflow nodes with positions, icons, and statuses.",
  },
  {
    name: "initialEdges",
    type: "FlowEdge[]",
    defaultValue: "defaultEdges",
    description: "Array of directed connecting cables between nodes.",
  },
  {
    name: "interactive",
    type: "boolean",
    defaultValue: "true",
    description: "Enables dragging nodes across the coordinate dot-matrix grid.",
  },
  {
    name: "showToolbar",
    type: "boolean",
    defaultValue: "true",
    description: "Displays execution trigger (Run Pipeline) and reset buttons.",
  },
  {
    name: "title",
    type: "string",
    defaultValue: '"AGENTIC WORKFLOW PIPELINE"',
    description: "Top canvas title header.",
  },
];

export function NodeFlowGraphSection() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const customNodes: FlowNode[] = [
    {
      id: "auth",
      label: "OAuth2 Gate",
      type: "Security",
      icon: "bot",
      status: "completed",
      x: 30,
      y: 110,
      dataSummary: "JWT Bearer / 256-bit",
    },
    {
      id: "ai",
      label: "LLM Orchestrator",
      type: "Compute",
      icon: "cpu",
      status: "idle",
      x: 270,
      y: 110,
      dataSummary: "Claude 3.5 Sonnet",
    },
    {
      id: "db",
      label: "PostgreSQL Sync",
      type: "Storage",
      icon: "db",
      status: "idle",
      x: 520,
      y: 110,
      dataSummary: "Prisma ORM ~ 4.2ms",
    },
  ];

  const customEdges: FlowEdge[] = [
    { id: "e1", from: "auth", to: "ai" },
    { id: "e2", from: "ai", to: "db" },
  ];

  return (
    <section id="node-flow-graph" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary dark:text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Pro Component</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          Node Flow Graph
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          An interactive workflow pipeline canvas with draggable nodes, dynamic SVG cubic bezier connecting
          cables, pulsing animated data packets, and sequential execution simulation.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-xs font-mono w-fit mt-3">
          <span className="text-slate-500 dark:text-slate-400">npx nexoreui add node-flow-graph</span>
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Interactive Playground
          </h2>
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === "preview"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === "code"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Component Source (CLI 1:1)
            </button>
          </div>
        </div>

        {activeTab === "preview" ? (
          <NodeFlowGraph />
        ) : (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <ComponentSource
              sourceCode={nodeFlowGraph.content}
              fileName="node-flow-graph.tsx"
            />
          </div>
        )}
      </div>

      {/* Usage Examples */}
      <div className="space-y-6 pt-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Usage Example (3-Node CI/CD Pipeline)
        </h2>
        <div className="space-y-4">
          <NodeFlowGraph
            initialNodes={customNodes}
            initialEdges={customEdges}
            title="3-STAGE BACKEND AUTH PIPELINE"
          />
          <ComponentSource
            sourceCode={`import { NodeFlowGraph } from "nexoreui";

const customNodes = [
  { id: "auth", label: "OAuth2 Gate", type: "Security", icon: "bot", status: "completed", x: 30, y: 110 },
  { id: "ai", label: "LLM Orchestrator", type: "Compute", icon: "cpu", status: "idle", x: 270, y: 110 },
  { id: "db", label: "PostgreSQL Sync", type: "Storage", icon: "db", status: "idle", x: 520, y: 110 },
];

const customEdges = [
  { id: "e1", from: "auth", to: "ai" },
  { id: "e2", from: "ai", to: "db" },
];

export function BackendPipeline() {
  return (
    <NodeFlowGraph
      initialNodes={customNodes}
      initialEdges={customEdges}
      title="3-STAGE BACKEND AUTH PIPELINE"
    />
  );
}`}
          />
        </div>
      </div>

      {/* API Reference Table */}
      <div className="pt-6">
        <PropsTable propsData={propsData} />
      </div>
    </section>
  );
}

export default NodeFlowGraphSection;
