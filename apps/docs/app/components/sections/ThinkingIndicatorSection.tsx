"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { ThinkingIndicator, Button, Badge, Card, CardHeader, CardTitle, CardContent } from "nexoreui";
import { Bot, Sparkles, Send, Mic, Terminal, Zap, ArrowRight, CornerDownLeft } from "lucide-react";

const thinkingIndicatorPropsData = [
  {
    name: "variant",
    type: '"default" | "neon" | "glow" | "cyberpunk"',
    defaultValue: '"default"',
    description: "Visual aesthetic preset for orbital particle colors, aura glow, and typography.",
    required: false,
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Physical dimensions and orbital trajectory radius of the particle cluster.",
    required: false,
  },
  {
    name: "label",
    type: "React.ReactNode",
    defaultValue: "undefined",
    description: "Optional text or node rendered next to the animated orbital indicator.",
    required: false,
  },
  {
    name: "shimmerLabel",
    type: "boolean",
    defaultValue: "true",
    description: "Enables subtle opacity pulsing on the label text in sync with reasoning cycles.",
    required: false,
  },
  {
    name: "speed",
    type: '"slow" | "normal" | "fast"',
    defaultValue: '"normal"',
    description: "Velocity multiplier for the primary and secondary orbital wave trajectories.",
    required: false,
  },
  {
    name: "className",
    type: "string",
    defaultValue: "—",
    description: "Custom CSS classes passed to the outer flex container.",
    required: false,
  },
];

const examples = [
  {
    name: "Default Reasoning in AI Chat",
    component: (
      <div className="w-full max-w-md p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-zinc-300">Nexore Assistant</span>
        </div>
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-between">
          <ThinkingIndicator variant="default" size="md" label="Thinking through architecture..." />
          <Badge variant="outline" size="sm" className="text-[10px]">Step 2/4</Badge>
        </div>
      </div>
    ),
    code: `import { ThinkingIndicator, Badge } from "nexoreui"\nimport { Bot } from "lucide-react"\n\n<div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">\n  <div className="flex items-center gap-3">\n    <Bot className="w-4 h-4 text-primary" />\n    <span className="text-xs font-semibold">Nexore Assistant</span>\n  </div>\n  <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-between">\n    <ThinkingIndicator variant="default" size="md" label="Thinking through architecture..." />\n    <Badge variant="outline" size="sm">Step 2/4</Badge>\n  </div>\n</div>`,
  },
  {
    name: "Neon Electric Theme",
    component: (
      <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-950 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center gap-3">
        <ThinkingIndicator variant="neon" size="lg" label="QUANTUM ENGINE REASONING" speed="fast" />
        <span className="text-xs font-mono text-cyan-400/60 tracking-widest">FPS: 60 | HUE_SHIFT: ACTIVE</span>
      </div>
    ),
    code: `import { ThinkingIndicator } from "nexoreui"\n\n<ThinkingIndicator\n  variant="neon"\n  size="lg"\n  label="QUANTUM ENGINE REASONING"\n  speed="fast"\n/>`,
  },
  {
    name: "Warm Glow Analytics Indicator",
    component: (
      <div className="w-full max-w-md p-5 rounded-2xl bg-gradient-to-b from-amber-950/20 to-zinc-950 border border-amber-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-300">Predictive Revenue Analysis</span>
          <ThinkingIndicator variant="glow" size="sm" speed="normal" />
        </div>
        <p className="text-xs text-zinc-400">
          Synthesizing real-time telemetry from 14 distributed clusters...
        </p>
      </div>
    ),
    code: `import { ThinkingIndicator } from "nexoreui"\n\n<div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/20">\n  <div className="flex items-center justify-between">\n    <span className="text-xs font-medium text-amber-300">Predictive Analysis</span>\n    <ThinkingIndicator variant="glow" size="sm" />\n  </div>\n</div>`,
  },
  {
    name: "Cyberpunk Terminal Execution",
    component: (
      <div className="w-full max-w-md p-4 rounded-xl bg-black border border-yellow-500/40 font-mono text-xs space-y-3 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
        <div className="flex items-center gap-2 text-yellow-500/80 border-b border-yellow-500/20 pb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>CYBER_SYS_DAEMON [v2.4]</span>
        </div>
        <div className="py-2">
          <ThinkingIndicator variant="cyberpunk" size="md" label="NEURAL_WEIGHTS_COMPUTING..." speed="fast" />
        </div>
      </div>
    ),
    code: `import { ThinkingIndicator } from "nexoreui"\n\n<ThinkingIndicator\n  variant="cyberpunk"\n  size="md"\n  label="NEURAL_WEIGHTS_COMPUTING..."\n  speed="fast"\n/>`,
  },
  {
    name: "Inline Micro-Indicator inside Prompt Bar",
    component: (
      <div className="w-full max-w-md p-2 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between gap-3 px-4">
        <span className="text-xs text-zinc-400">Synthesizing SQL query...</span>
        <div className="flex items-center gap-2">
          <ThinkingIndicator variant="default" size="sm" />
          <Button size="sm" variant="secondary" className="h-7 text-xs px-2.5">
            Cancel
          </Button>
        </div>
      </div>
    ),
    code: `import { ThinkingIndicator, Button } from "nexoreui"\n\n<div className="p-2 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between px-4">\n  <span className="text-xs text-zinc-400">Synthesizing SQL query...</span>\n  <div className="flex items-center gap-2">\n    <ThinkingIndicator variant="default" size="sm" />\n    <Button size="sm" variant="secondary">Cancel</Button>\n  </div>\n</div>`,
  },
  {
    name: "Hero Large Reasoning State",
    component: (
      <div className="w-full max-w-lg p-6 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-white/10 flex flex-col items-center text-center gap-4">
        <ThinkingIndicator variant="default" size="lg" speed="normal" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">Deep Reasoning in Progress</h4>
          <p className="text-xs text-zinc-400 max-w-xs">
            Evaluating multi-branch chain-of-thought solutions for edge optimization.
          </p>
        </div>
      </div>
    ),
    code: `import { ThinkingIndicator } from "nexoreui"\n\n<div className="p-6 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col items-center gap-4">\n  <ThinkingIndicator variant="default" size="lg" />\n  <h4 className="text-sm font-semibold">Deep Reasoning in Progress</h4>\n</div>`,
  },
];

export function ThinkingIndicatorSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(examples.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="thinking-indicator" className="space-y-10 scroll-mt-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-2xl font-bold tracking-tight">Thinking Indicator</h2>
          <Badge variant="gradient" size="sm">New</Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          An animated AI reasoning and thinking indicator built with Framer Motion orbital wave trajectories, continuous hue-shifting, and native reduced-motion accessibility.
        </p>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use which variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
          {[
            ["default", "Clean, modern AI chats (ChatGPT/Claude/Gemini style) with dominant indigo & accent particles."],
            ["neon", "Futuristic cyberpunk dashboards, gaming interfaces, and high-contrast dark modes."],
            ["glow", "Ethereal, warm analytical and finance widgets with soft ambient diffusion."],
            ["cyberpunk", "Developer tools, matrix terminals, and command-line style HUD widgets."],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={ThinkingIndicator}
          componentName="ThinkingIndicator"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "neon", "glow", "cyberpunk"],
              defaultValue: "default",
              description: "Visual aesthetic and color palette of the orbital particles.",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg"],
              defaultValue: "md",
              description: "Dimension scale and trajectory radius.",
            },
            {
              name: "label",
              type: "text",
              defaultValue: "Thinking...",
              description: "Accompanying status message.",
            },
            {
              name: "speed",
              type: "select",
              options: ["slow", "normal", "fast"],
              defaultValue: "normal",
              description: "Orbital rotation and wave oscillation speed.",
            },
            {
              name: "shimmerLabel",
              type: "boolean",
              defaultValue: true,
              description: "Soft breathing pulse on the label text.",
            },
          ]}
        />
      </div>

      {/* Props Reference Table */}
      <div className="space-y-4">
        <PropsTable propsData={thinkingIndicatorPropsData} />
      </div>

      {/* Examples Showcase */}
      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight">Usage Examples</h3>
        <div className="space-y-8">
          {visibleItems.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-background p-6">
                  {item.component}
                </div>
                <ComponentSource sourceCode={item.code} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground mx-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
