"use client";

import React, { useState } from "react";
import { PropsEditor, PropControl } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { ComponentSource } from "../ComponentSource";
import {
  AuroraSearchPill,
  AuroraSearchPillProps,
  AuroraSearchPillSize,
  AuroraSearchPillTheme,
  AuroraSearchPillGlow,
  AuroraSearchPillSpeed,
} from "nexoreui";
import {
  Sparkles,
  Search,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Bot,
  Zap,
  Cpu,
  Layers,
  Globe,
  Terminal,
} from "lucide-react";

const controls: PropControl[] = [
  {
    name: "searchLabel",
    type: "text",
    defaultValue: "Search...",
    description: "Search heading text rendered in active searching state.",
  },
  {
    name: "theme",
    type: "select",
    options: ["auto", "light", "dark"],
    defaultValue: "auto",
    description: "Surface theme: light (pure white), dark (obsidian), or auto.",
  },
  {
    name: "size",
    type: "select",
    options: ["sm", "md", "lg"],
    defaultValue: "md",
    description: "Size scale of the pill, typography, and badges.",
  },
  {
    name: "glowIntensity",
    type: "select",
    options: ["subtle", "medium", "strong", "none"],
    defaultValue: "medium",
    description: "Luminosity and diffusion of the surrounding aurora glow.",
  },
  {
    name: "speed",
    type: "select",
    options: ["slow", "normal", "fast"],
    defaultValue: "normal",
    description: "Conic gradient rotation speed (slow: 5s, normal: 3.2s, fast: 1.8s).",
  },
  {
    name: "spinMode",
    type: "select",
    options: ["always", "searching", "hover", "never"],
    defaultValue: "always",
    description: "Rotation mode: 'always' (continuous aurora wave), 'searching' (only while active), 'hover', or 'never'.",
  },
  {
    name: "autoCycle",
    type: "boolean",
    defaultValue: false,
    description: "Continuously toggle between listening and searching states.",
  },
];

const propsTableData = [
  {
    name: "isSearching",
    type: "boolean",
    defaultValue: "undefined",
    description: "Controlled searching active state.",
    required: false,
  },
  {
    name: "defaultSearching",
    type: "boolean",
    defaultValue: "false",
    description: "Initial searching state when uncontrolled.",
    required: false,
  },
  {
    name: "onToggle",
    type: "(isSearching: boolean) => void",
    defaultValue: "—",
    description: "Callback invoked whenever the pill is clicked or toggled.",
    required: false,
  },
  {
    name: "searchLabel",
    type: "string",
    defaultValue: '"Search..."',
    description: "Text label displayed next to source badges in the active state.",
    required: false,
  },
  {
    name: "sources",
    type: "AuroraSearchSource[]",
    defaultValue: "[Web, Neural Index, GitHub]",
    description: "Array of source icon badges rendered when searching is active (supports avatarUrl, icons, initials, presets).",
    required: false,
  },
  {
    name: "sourceAvatars",
    type: "string[]",
    defaultValue: "undefined",
    description: "Shortcut array of avatar image URLs rendered as source icons.",
    required: false,
  },
  {
    name: "spinMode",
    type: '"searching" | "always" | "hover" | "never"',
    defaultValue: '"searching"',
    description: "When the beam should rotate: only while searching (default), continuously, on hover, or never.",
    required: false,
  },
  {
    name: "theme",
    type: '"light" | "dark" | "auto"',
    defaultValue: '"auto"',
    description: "Color theme for the pill center surface.",
    required: false,
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    description: "Height, typography, and badge sizing scale.",
    required: false,
  },
  {
    name: "glowIntensity",
    type: '"subtle" | "medium" | "strong" | "none"',
    defaultValue: '"medium"',
    description: "Volumetric ambient blur glow opacity around the perimeter.",
    required: false,
  },
  {
    name: "speed",
    type: '"slow" | "normal" | "fast"',
    defaultValue: '"normal"',
    description: "Rotation velocity of the aurora light beam.",
    required: false,
  },
  {
    name: "autoCycle",
    type: "boolean",
    defaultValue: "false",
    description: "Enables automatic demo cycling between idle dots and searching.",
    required: false,
  },
  {
    name: "cycleInterval",
    type: "number",
    defaultValue: "2400",
    description: "Interval in milliseconds between autoCycle state transitions.",
    required: false,
  },
  {
    name: "className",
    type: "string",
    defaultValue: "—",
    description: "Additional CSS classes applied to the outer wrapper.",
    required: false,
  },
];

export function AuroraSearchPillSection() {
  const [currentPage, setCurrentPage] = useState(1);

  const customSources = [
    { id: "web", type: "globe" as const, label: "Web Search" },
    { id: "claude", type: "claude" as const, label: "Claude 3.5" },
    { id: "chatgpt", type: "chatgpt" as const, label: "GPT-4o" },
    { id: "perplexity", type: "perplexity" as const, label: "Perplexity AI" },
    { id: "gh", type: "github" as const, label: "GitHub Repos" },
  ];

  const examples = [
    {
      name: "1. Interactive Click-to-Search Pill",
      description: "Default state renders 3 pulsing dots. Clicking expands into active query with source icons.",
      component: (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <AuroraSearchPill
            searchLabel="Search..."
            glowIntensity="medium"
          />
          <span className="text-xs text-muted-foreground font-mono">
            Click to expand / collapse
          </span>
        </div>
      ),
      code: `import { AuroraSearchPill } from "nexoreui";

export function DefaultSearchDemo() {
  return (
    <AuroraSearchPill
      searchLabel="Search..."
      glowIntensity="medium"
      onToggle={(active) => console.log("Search active:", active)}
    />
  );
}`,
    },
    {
      name: "2. Dark Obsidian AI Agent Pill",
      description: "Deep obsidian backdrop with illuminated vibrant aurora border and ambient backlight.",
      component: (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <AuroraSearchPill
            theme="dark"
            searchLabel="Searching agent memory..."
            defaultSearching={true}
            glowIntensity="strong"
          />
          <span className="text-xs text-muted-foreground font-mono">
            Dark theme with strong glow
          </span>
        </div>
      ),
      code: `import { AuroraSearchPill } from "nexoreui";

export function DarkAgentSearchPill() {
  return (
    <AuroraSearchPill
      theme="dark"
      searchLabel="Searching agent memory..."
      defaultSearching={true}
      glowIntensity="strong"
    />
  );
}`,
    },
    {
      name: "3. Multi-Engine Research Sources",
      description: "Customized multi-source badges for multi-agent reasoning, web globes, and code search.",
      component: (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <AuroraSearchPill
            searchLabel="Reasoning over 4 sources..."
            sources={customSources}
            defaultSearching={true}
            speed="fast"
          />
          <span className="text-xs text-muted-foreground font-mono">
            Fast rotation with 4 source engines
          </span>
        </div>
      ),
      code: `import { AuroraSearchPill } from "nexoreui";
import { Sparkles } from "lucide-react";

const sources = [
  { id: "web", type: "globe", label: "Web Search" },
  { id: "grad", type: "gradient", label: "Neural Knowledge" },
  {
    id: "ai",
    type: "custom",
    bg: "#6366f1",
    label: "Synthetix AI",
    icon: <Sparkles className="w-3 h-3 text-white" />,
  },
  { id: "gh", type: "github", label: "GitHub Repos" },
];

export function MultiSourcePill() {
  return (
    <AuroraSearchPill
      searchLabel="Reasoning over 4 sources..."
      sources={sources}
      defaultSearching={true}
      speed="fast"
    />
  );
}`,
    },
    {
      name: "4. Sizing Variants (Small, Medium, Large)",
      description: "Scalable across navbar headers, hero search banners, and compact floating widgets.",
      component: (
        <div className="py-10 flex flex-col items-center justify-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <AuroraSearchPill size="sm" searchLabel="Quick search..." defaultSearching={true} />
            <AuroraSearchPill size="md" searchLabel="Universal query..." defaultSearching={true} />
            <AuroraSearchPill size="lg" searchLabel="Deep AI Inference..." defaultSearching={true} />
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Available sizes: sm (h-10), md (h-12), lg (h-14)
          </span>
        </div>
      ),
      code: `import { AuroraSearchPill } from "nexoreui";

export function SizingVariantsDemo() {
  return (
    <div className="flex items-center gap-4">
      <AuroraSearchPill size="sm" searchLabel="Quick search..." defaultSearching={true} />
      <AuroraSearchPill size="md" searchLabel="Universal query..." defaultSearching={true} />
      <AuroraSearchPill size="lg" searchLabel="Deep AI Inference..." defaultSearching={true} />
    </div>
  );
}`,
    },
    {
      name: "5. Auto-Cycling Live Demo Pill",
      description: "Continuously transitions between listening dots and searching status — ideal for hero demos.",
      component: (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <AuroraSearchPill
            autoCycle={true}
            cycleInterval={2200}
            searchLabel="Searching web & knowledge..."
            glowIntensity="strong"
          />
          <span className="text-xs text-muted-foreground font-mono">
            Autonomous loop every 2.2 seconds
          </span>
        </div>
      ),
      code: `import { AuroraSearchPill } from "nexoreui";

export function AutoCyclingPill() {
  return (
    <AuroraSearchPill
      autoCycle={true}
      cycleInterval={2200}
      searchLabel="Searching web & knowledge..."
      glowIntensity="strong"
    />
  );
}`,
    },
  ];

  const totalPages = examples.length;
  const currentExample = examples[currentPage - 1];

  return (
    <div className="space-y-12">
      {/* Component Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
            New Component
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            @nexoreui/aurora-search-pill
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Aurora Search Pill
        </h1>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
          Ultra-premium conversational AI search pill featuring a rotating conic gradient halo,
          1.5px illuminated border track, and fluid transition between 3 pulsing dots and an active
          search query with overlapping source badges.
        </p>
      </div>

      {/* Interactive Playground (PropsEditor) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
          <Sliders className="h-4 w-4 text-primary" />
          <span>Interactive Playground</span>
        </div>
        <PropsEditor
          component={AuroraSearchPill}
          controls={controls}
          componentName="AuroraSearchPill"
          importFrom="nexoreui"
          defaultProps={{
            searchLabel: "Search...",
            theme: "auto",
            size: "md",
            glowIntensity: "medium",
            speed: "normal",
            spinMode: "always",
            autoCycle: false,
          }}
        />
      </div>

      {/* Code Block with React / HTML / Vue Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
          <Terminal className="h-4 w-4 text-primary" />
          <span>Source Code & Export</span>
        </div>
        <ComponentSource
          fileName="AuroraSearchPillDemo.tsx"
          sourceCode={`import { AuroraSearchPill } from "nexoreui";

export default function AuroraSearchPillDemo() {
  return (
    <AuroraSearchPill
      searchLabel="Search..."
      theme="auto"
      size="md"
      glowIntensity="medium"
      speed="normal"
      onToggle={(isSearching) => console.log("State:", isSearching)}
    />
  );
}`}
        />
      </div>

      {/* Props Reference Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
          <Layers className="h-4 w-4 text-primary" />
          <span>Props Reference</span>
        </div>
        <PropsTable propsData={propsTableData} />
      </div>

      {/* 5+ Categorized Usage Examples */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Usage Examples ({currentPage} of {totalPages})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors"
              aria-label="Previous example"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors"
              aria-label="Next example"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">
              {currentExample.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentExample.description}
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-zinc-950/50 dark:bg-black/50 p-4">
            {currentExample.component}
          </div>

          <ComponentSource
            fileName={`${currentExample.name.replace(/[^a-zA-Z0-9]/g, "")}.tsx`}
            sourceCode={currentExample.code}
          />
        </div>
      </div>
    </div>
  );
}
