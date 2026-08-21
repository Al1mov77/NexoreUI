"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { AgentStatusPill, Badge, Button } from "nexoreui";
import { Sparkles, Bot, Layers, ShieldCheck, Activity, Cpu } from "lucide-react";

const agentStatusPillPropsData = [
  {
    name: "status",
    type: '"idle" | "thinking" | "running" | "success" | "error"',
    defaultValue: '"idle"',
    description: "Operating status of the AI agent with corresponding live animations, icons, or dots.",
    required: false,
  },
  {
    name: "variant",
    type: '"default" | "neon" | "glow" | "cyberpunk"',
    defaultValue: '"default"',
    description: "Visual aesthetic theme matching NexoreUI indicator presets.",
    required: false,
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Compactness scale of the pill container.",
    required: false,
  },
  {
    name: "showLabel",
    type: "boolean",
    defaultValue: "false",
    description: "Whether to display the text label next to the animated indicator.",
    required: false,
  },
  {
    name: "label",
    type: "ReactNode",
    defaultValue: "undefined",
    description: "Custom label text override for the pill.",
    required: false,
  },
  {
    name: "pulse",
    type: "boolean",
    defaultValue: "false",
    description: "Adds an animated ambient radar/pulse ping ring for active attention.",
    required: false,
  },
];

export function AgentStatusPillSection() {
  const [pipelineState, setPipelineState] = useState<
    "idle" | "thinking" | "running" | "success" | "error"
  >("thinking");

  return (
    <div className="space-y-12">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="text-primary border-primary/40">
            Agentic AI
          </Badge>
          <Badge variant="secondary">React 19</Badge>
          <Badge variant="secondary">Framer Motion</Badge>
          <span className="text-xs text-muted-foreground font-mono">
            import &#123; AgentStatusPill &#125; from &apos;nexoreui&apos;
          </span>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
          Ultra-compact status descriptor for AI agents in toolbars, headers, and cards.
          Integrates live thinking orbital animation, state icons, pulse radar rings, and customizable labels.
        </p>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Interactive Playground
        </h3>
        <PropsEditor
          component={({ status, variant, size, showLabel, pulse }: any) => (
            <div className="flex flex-col items-center justify-center p-10 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 shadow-2xl backdrop-blur-xl gap-4">
              <AgentStatusPill
                status={status}
                variant={variant}
                size={size}
                showLabel={showLabel}
                pulse={pulse}
              />
              <span className="text-[11px] text-zinc-500 font-mono">
                Pill component (standalone or embeddable in navigation)
              </span>
            </div>
          )}
          componentName="AgentStatusPill"
          importFrom="nexoreui"
          controls={[
            {
              name: "status",
              type: "select",
              options: ["idle", "thinking", "running", "success", "error"],
              defaultValue: "thinking",
              description: "Current execution status of the agent.",
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "neon", "glow", "cyberpunk"],
              defaultValue: "default",
              description: "Visual aesthetic preset.",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg"],
              defaultValue: "md",
              description: "Physical pill scale.",
            },
            {
              name: "showLabel",
              type: "boolean",
              defaultValue: true,
              description: "Display readable status title.",
            },
            {
              name: "pulse",
              type: "boolean",
              defaultValue: true,
              description: "Ambient radar pulse ring.",
            },
          ]}
        />
      </div>

      {/* Real-World Examples */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Real-World Examples</h3>

        {/* Example 1: Header / Navigation Bar Integration */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Bot className="w-4 h-4 text-primary" />
            <span>Navigation Header Integration</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-sm text-primary">
                NX
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-100">Nexore Cloud Agent</div>
                <div className="text-[10px] text-zinc-500">Autonomous Task Worker #41</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AgentStatusPill
                status="thinking"
                variant="neon"
                size="sm"
                showLabel
                label="Reasoning"
                pulse
              />
              <Button size="sm" variant="outline" className="h-7 text-xs">
                View Logs
              </Button>
            </div>
          </div>
          <ComponentSource
            sourceCode={`<header className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
  <div className="flex items-center gap-3">
    <div className="font-bold text-sm text-primary">Nexore Cloud Agent</div>
  </div>
  <AgentStatusPill
    status="thinking"
    variant="neon"
    size="sm"
    showLabel
    label="Reasoning"
    pulse
  />
</header>`}
          />
        </div>

        {/* Example 2: Multi-Agent Pipeline Status Grid */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Layers className="w-4 h-4 text-primary" />
            <span>Multi-Agent Swarm Orchestration</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                <span>Planner Agent</span>
              </div>
              <AgentStatusPill status="success" variant="default" size="sm" showLabel />
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-cyan-200 font-mono">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Executor Agent</span>
              </div>
              <AgentStatusPill status="running" variant="neon" size="sm" showLabel pulse />
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                <span>Reviewer Agent</span>
              </div>
              <AgentStatusPill status="idle" variant="default" size="sm" showLabel />
            </div>
          </div>
        </div>
      </div>

      {/* Props Reference Table */}
      <div className="space-y-4">
        <PropsTable propsData={agentStatusPillPropsData} />
      </div>
    </div>
  );
}

export default AgentStatusPillSection;
