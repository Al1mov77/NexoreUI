"use client";

import React from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Tooltip,
  RichTooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  Button,
} from "nexoreui";
import { Search, Save, HelpCircle, Terminal, Activity, Copy } from "lucide-react";

interface TooltipPlaygroundProps {
  content?: string;
  side?: "top" | "bottom" | "left" | "right";
  variant?: "default" | "dark" | "light";
  shortcut?: string;
  showArrow?: boolean;
}

function TooltipPlayground({
  content = "Copy production webhook endpoint",
  side = "top",
  variant = "default",
  shortcut = "⌘C",
  showArrow = true,
}: TooltipPlaygroundProps) {
  return (
    <Tooltip
      content={content}
      side={side}
      variant={variant}
      shortcut={shortcut || undefined}
      showArrow={showArrow}
      delay={0}
    >
      <Button variant="outline">Hover or focus trigger</Button>
    </Tooltip>
  );
}

const variants = [
  {
    name: "Directional Placement",
    description: "Four anchor placements relative to the trigger control with automatic collision awareness.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Tooltip content="Anchored above trigger" side="top" delay={100}>
          <Button variant="outline" size="sm">Top</Button>
        </Tooltip>
        <Tooltip content="Anchored to the right" side="right" delay={100}>
          <Button variant="outline" size="sm">Right</Button>
        </Tooltip>
        <Tooltip content="Anchored below trigger" side="bottom" delay={100}>
          <Button variant="outline" size="sm">Bottom</Button>
        </Tooltip>
        <Tooltip content="Anchored to the left" side="left" delay={100}>
          <Button variant="outline" size="sm">Left</Button>
        </Tooltip>
      </div>
    ),
    code: `import { Tooltip, Button } from "nexoreui";

export default function DirectionalTooltipDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Tooltip content="Anchored above trigger" side="top" delay={100}>
        <Button variant="outline" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Anchored to the right" side="right" delay={100}>
        <Button variant="outline" size="sm">Right</Button>
      </Tooltip>
      <Tooltip content="Anchored below trigger" side="bottom" delay={100}>
        <Button variant="outline" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Anchored to the left" side="left" delay={100}>
        <Button variant="outline" size="sm">Left</Button>
      </Tooltip>
    </div>
  );
}`,
  },
  {
    name: "Icon Toolbar with Shortcut Keycaps",
    description: "Compact icon-only toolbar actions revealing label and inline keyboard shortcut keycaps.",
    component: (
      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1.5 shadow-xs">
        <Tooltip content="Command Search" shortcut="⌘K" delay={100}>
          <Button variant="ghost" size="icon" aria-label="Command Search">
            <Search className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Save Manifest" shortcut="⌘S" delay={100}>
          <Button variant="ghost" size="icon" aria-label="Save Manifest">
            <Save className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Open Console" shortcut="⌘/" delay={100}>
          <Button variant="ghost" size="icon" aria-label="Open Console">
            <Terminal className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Documentation" shortcut="?" delay={100}>
          <Button variant="ghost" size="icon" aria-label="Documentation">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    ),
    code: `import { Tooltip, Button } from "nexoreui";
import { Search, Save, Terminal, HelpCircle } from "lucide-react";

export default function ToolbarShortcutTooltipDemo() {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1.5">
      <Tooltip content="Command Search" shortcut="⌘K" delay={100}>
        <Button variant="ghost" size="icon" aria-label="Command Search">
          <Search className="h-4 w-4" />
        </Button>
      </Tooltip>
      <Tooltip content="Save Manifest" shortcut="⌘S" delay={100}>
        <Button variant="ghost" size="icon" aria-label="Save Manifest">
          <Save className="h-4 w-4" />
        </Button>
      </Tooltip>
      <Tooltip content="Open Console" shortcut="⌘/" delay={100}>
        <Button variant="ghost" size="icon" aria-label="Open Console">
          <Terminal className="h-4 w-4" />
        </Button>
      </Tooltip>
      <Tooltip content="Documentation" shortcut="?" delay={100}>
        <Button variant="ghost" size="icon" aria-label="Documentation">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </Tooltip>
    </div>
  );
}`,
  },
  {
    name: "Structured Rich Tooltip",
    description: "Multi-line metadata card pairing a concise heading, monospaced readout, and explanatory copy.",
    component: (
      <RichTooltip
        title="Edge Health Probe"
        meta="12ms RTT"
        description="Checks TLS handshake and upstream connection pools every 30 seconds across 4 regions."
        delay={100}
      >
        <Button variant="outline" className="gap-2">
          <Activity className="h-4 w-4" />
          <span>Inspect Probe Spec</span>
        </Button>
      </RichTooltip>
    ),
    code: `import { RichTooltip, Button } from "nexoreui";
import { Activity } from "lucide-react";

export default function RichTooltipDemo() {
  return (
    <RichTooltip
      title="Edge Health Probe"
      meta="12ms RTT"
      description="Checks TLS handshake and upstream connection pools every 30 seconds across 4 regions."
      delay={100}
    >
      <Button variant="outline" className="gap-2">
        <Activity className="h-4 w-4" />
        <span>Inspect Probe Spec</span>
      </Button>
    </RichTooltip>
  );
}`,
  },
  {
    name: "Surface Contrast Variants",
    description: "Inverted foreground pill for rapid visual scan versus popover-card light surface for subtle hints.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Tooltip content="Inverted contrast surface" variant="default" delay={100}>
          <Button variant="outline">Default Contrast</Button>
        </Tooltip>
        <Tooltip content="Popover card surface" variant="light" delay={100}>
          <Button variant="outline">Light Surface</Button>
        </Tooltip>
      </div>
    ),
    code: `import { Tooltip, Button } from "nexoreui";

export default function TooltipContrastDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tooltip content="Inverted contrast surface" variant="default" delay={100}>
        <Button variant="outline">Default Contrast</Button>
      </Tooltip>
      <Tooltip content="Popover card surface" variant="light" delay={100}>
        <Button variant="outline">Light Surface</Button>
      </Tooltip>
    </div>
  );
}`,
  },
  {
    name: "Shared Provider Skip-Delay Group",
    description: "Compound Radix primitives sharing skipDelayDuration so consecutive tool buttons open instantaneously.",
    component: (
      <TooltipProvider delayDuration={300} skipDelayDuration={500}>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <TooltipRoot>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Copy className="h-3.5 w-3.5" />
                <span>Copy CLI</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>npx nexoreui add tooltip</TooltipContent>
          </TooltipRoot>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Terminal className="h-3.5 w-3.5" />
                <span>Build Package</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>pnpm --filter nexoreui build</TooltipContent>
          </TooltipRoot>
        </div>
      </TooltipProvider>
    ),
    code: `import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  Button,
} from "nexoreui";
import { Copy, Terminal } from "lucide-react";

export default function SharedProviderTooltipDemo() {
  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={500}>
      <div className="flex items-center gap-2">
        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Copy className="h-3.5 w-3.5" />
              <span>Copy CLI</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>npx nexoreui add tooltip</TooltipContent>
        </TooltipRoot>
        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              <span>Build Package</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>pnpm --filter nexoreui build</TooltipContent>
        </TooltipRoot>
      </div>
    </TooltipProvider>
  );
}`,
  },
];

const tooltipPropsData = [
  { name: "content", type: "React.ReactNode", defaultValue: "-", description: "Text or element rendered inside the tooltip bubble.", required: true },
  { name: "side", type: '"top" | "bottom" | "left" | "right"', defaultValue: '"top"', description: "Preferred edge relative to the trigger control.", required: false },
  { name: "variant", type: '"default" | "dark" | "light"', defaultValue: '"default"', description: "Semantic surface and text contrast preset.", required: false },
  { name: "shortcut", type: "string", defaultValue: "-", description: "Optional keyboard shortcut rendered as an inline keycap.", required: false },
  { name: "showArrow", type: "boolean", defaultValue: "true", description: "Renders a directional pointer arrow matched to the tooltip surface.", required: false },
  { name: "delay / delayDuration", type: "number", defaultValue: "200", description: "Hover delay in milliseconds before opening.", required: false },
  { name: "sideOffset", type: "number", defaultValue: "6", description: "Gap in pixels between the trigger and tooltip.", required: false },
];

export function TooltipSection() {
  return (
    <section id="tooltips" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which tooltip"
        items={[
          { label: "Tooltip + shortcut", description: "Icon-only toolbar controls that need an explicit label and keyboard shortcut keycap." },
          { label: "RichTooltip", description: "Short structured descriptions with a title and single metric or timing hint." },
          { label: "TooltipProvider", description: "Grouping dense button rows with skipDelayDuration so moving across icons feels instant." },
          { label: "variant=light", description: "Longer descriptive hints that benefit from standard popover card contrast." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={TooltipPlayground}
          componentName="Tooltip"
          importFrom="nexoreui"
          controls={[
            {
              name: "content",
              type: "text",
              defaultValue: "Copy production webhook endpoint",
              description: "Text displayed inside the tooltip",
            },
            {
              name: "side",
              type: "select",
              options: ["top", "bottom", "left", "right"],
              defaultValue: "top",
              description: "Edge placement relative to the trigger",
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "light", "dark"],
              defaultValue: "default",
              description: "Surface contrast variant",
            },
            {
              name: "shortcut",
              type: "text",
              defaultValue: "⌘C",
              description: "Optional keyboard shortcut chip",
            },
            {
              name: "showArrow",
              type: "boolean",
              defaultValue: true,
              description: "Toggle pointer arrow",
            },
          ]}
        />
      </div>

      <div className="space-y-10">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Showcase & Examples</h2>
        {variants.map((item) => (
          <div key={item.name} className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div
                data-demo-preview
                className="flex min-h-[180px] items-center justify-center rounded-xl border border-border bg-background p-6"
              >
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      <PropsTable propsData={tooltipPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Hover & Keyboard Focus:</strong> Opens immediately when a focusable trigger receives keyboard focus and dismisses on blur or <kbd className="bg-muted px-1 rounded text-[10px]">Escape</kbd>.</li>
          <li><strong>ARIA Association:</strong> Backed by Radix UI Tooltip so <code className="text-primary font-mono text-[10px]">role="tooltip"</code> and <code className="text-primary font-mono text-[10px]">aria-describedby</code> stay synchronized automatically.</li>
          <li><strong>Reduced Motion:</strong> Scale and slide entry animations disable cleanly when <code className="text-primary font-mono text-[10px]">prefers-reduced-motion</code> is active.</li>
        </ul>
      </div>
    </section>
  );
}
