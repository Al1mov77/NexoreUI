"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Drawer,
  CommandPalette,
  ContextMenu,
  FloatingPopover,
  Button,
} from "nexoreui";
import {
  FileText,
  Settings,
  User,
  Copy,
  Download,
  Trash2,
  SlidersHorizontal,
  Terminal,
  FolderGit2,
  Layers,
} from "lucide-react";

interface DrawerPlaygroundProps {
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  side?: "bottom" | "right" | "left" | "top";
  size?: "sm" | "md" | "lg";
  title?: string;
  description?: string;
}

function DrawerPlayground({
  open = false,
  onOpen,
  onClose,
  side = "right",
  size = "md",
  title = "Deployment Settings",
  description = "Configure edge cache headers and webhook signatures.",
}: DrawerPlaygroundProps) {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            {side} / {size}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <Button type="button" onClick={onOpen} className="w-full">
        Open {side} drawer
      </Button>

      <Drawer
        open={open}
        onClose={() => onClose?.()}
        side={side}
        size={size}
        title={title}
        description={description}
        snapPoints={side === "bottom" ? [0.45, 0.85] : undefined}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onClose?.()}>
              Close
            </Button>
            <Button size="sm" onClick={() => onClose?.()}>
              Apply Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-muted-foreground">
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
            <div className="font-medium text-foreground">Environment Sync</div>
            <div>Propagation across 4 edge clusters completes in under 300ms.</div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 font-mono tabular-nums flex items-center justify-between">
            <span>Cache TTL</span>
            <span className="text-foreground font-semibold">3600s</span>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function RightInspectorDrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Right Inspector
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        size="md"
        title="Edge Route Inspector"
        description="Inspect runtime headers and regional cache latency."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Dismiss
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Purge Cache
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
            <div className="text-muted-foreground">Route Pattern</div>
            <div className="font-mono font-semibold text-foreground">/api/v2/telemetry/*</div>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono tabular-nums">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="text-muted-foreground text-[10px] uppercase">Hit Ratio</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">98.4%</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="text-muted-foreground text-[10px] uppercase">Origin RTT</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">14 ms</div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function SnapBottomDrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Snap-Detent Bottom Sheet
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="bottom"
        snapPoints={[0.45, 0.85]}
        title="Release Checklist"
        description="Click the top handle or detent pips to switch sheet height."
        footer={
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-muted-foreground tabular-nums">
              3 / 3 checks passing
            </span>
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        }
      >
        <div className="space-y-2.5 text-xs">
          <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-center justify-between">
            <span className="font-medium text-foreground">TypeScript strict check</span>
            <span className="font-mono text-success">Passed</span>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-center justify-between">
            <span className="font-medium text-foreground">Registry bundle checksum</span>
            <span className="font-mono text-success">Verified</span>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-center justify-between">
            <span className="font-medium text-foreground">Edge canary rollout</span>
            <span className="font-mono text-foreground tabular-nums">100%</span>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function LeftNavDrawerDemo() {
  const [open, setOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");

  const destinations = [
    { label: "Overview", icon: <Layers className="h-4 w-4" /> },
    { label: "Repositories", icon: <FolderGit2 className="h-4 w-4" /> },
    { label: "Runtime Logs", icon: <Terminal className="h-4 w-4" /> },
    { label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Left Navigation Drawer
      </Button>
      <span className="text-xs font-mono text-muted-foreground">
        Active view: <span className="text-foreground font-medium">{activeNav}</span>
      </span>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        size="sm"
        title="Workspace"
      >
        <nav className="space-y-1">
          {destinations.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setActiveNav(item.label);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                activeNav === item.label
                  ? "bg-accent text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </Drawer>
    </div>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState("None");

  const items = [
    {
      id: "deploy",
      label: "Trigger production deploy",
      description: "Build main branch and promote edge routes",
      group: "Deployments",
      shortcut: "G D",
      icon: <FileText className="w-4 h-4" />,
      onSelect: () => setLastCommand("Trigger production deploy"),
    },
    {
      id: "members",
      label: "Manage team roles",
      description: "Update workspace permissions and invites",
      group: "Organization",
      shortcut: "G M",
      icon: <User className="w-4 h-4" />,
      onSelect: () => setLastCommand("Manage team roles"),
    },
    {
      id: "tokens",
      label: "Rotate API secrets",
      description: "Generate scoped signing keys for CLI access",
      group: "System",
      shortcut: "G K",
      icon: <Settings className="w-4 h-4" />,
      onSelect: () => setLastCommand("Rotate API secrets"),
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Command Palette
      </Button>
      <span className="text-xs font-mono text-muted-foreground">
        Last command: <span className="text-foreground font-medium">{lastCommand}</span>
      </span>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Search commands, routes, or settings..."
        items={items}
      />
    </div>
  );
}

function ContextAndPopoverDemo() {
  const [lastAction, setLastAction] = useState("Right-click card or open popover");
  const [regionFilter, setRegionFilter] = useState("us-east-1");
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <div className="w-full flex flex-wrap items-center justify-center gap-3">
        <ContextMenu
          items={[
            {
              label: "Copy endpoint URL",
              shortcut: "⌘C",
              icon: <Copy className="w-3.5 h-3.5" />,
              onClick: () => setLastAction("Copied endpoint URL"),
            },
            {
              label: "Download JSON manifest",
              shortcut: "⌘D",
              icon: <Download className="w-3.5 h-3.5" />,
              onClick: () => setLastAction("Downloaded JSON manifest"),
            },
            { label: "", separator: true },
            {
              label: "Purge cache",
              destructive: true,
              icon: <Trash2 className="w-3.5 h-3.5" />,
              onClick: () => setLastAction("Purged route cache"),
            },
          ]}
        >
          <div
            tabIndex={0}
            className="rounded-xl border border-dashed border-border bg-muted/20 px-5 py-4 text-center cursor-context-menu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="text-xs font-semibold text-foreground">Right-click target</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Or press Shift+F10 when focused
            </div>
          </div>
        </ContextMenu>

        <FloatingPopover
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          align="center"
          trigger={
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Region: {regionFilter}</span>
            </Button>
          }
        >
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground">Filter by cluster</div>
            <div className="space-y-1">
              {["us-east-1", "eu-central-1", "ap-northeast-1"].map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => {
                    setRegionFilter(region);
                    setLastAction(`Filtered to ${region}`);
                    setPopoverOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    regionFilter === region
                      ? "bg-accent text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </FloatingPopover>
      </div>
      <span className="text-xs font-mono text-muted-foreground">{lastAction}</span>
    </div>
  );
}

const examples = [
  {
    name: "Right-Edge Inspector Sheet",
    description: "Slide-over desktop inspector drawer with description subtitle and pinned footer actions.",
    component: <RightInspectorDrawerDemo />,
    code: `import { useState } from "react";
import { Drawer, Button } from "nexoreui";

export default function RightInspectorDrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Right Inspector
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        size="md"
        title="Edge Route Inspector"
        description="Inspect runtime headers and regional cache latency."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Dismiss
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Purge Cache
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="text-muted-foreground">Route Pattern</div>
            <div className="font-mono font-semibold text-foreground">/api/v2/telemetry/*</div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}`,
  },
  {
    name: "Snap-Detent Bottom Action Sheet",
    description: "Bottom drawer with calibrated snapPoints rail and live percentage detent pips.",
    component: <SnapBottomDrawerDemo />,
    code: `import { useState } from "react";
import { Drawer, Button } from "nexoreui";

export default function SnapBottomDrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Snap-Detent Bottom Sheet
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="bottom"
        snapPoints={[0.45, 0.85]}
        title="Release Checklist"
        description="Click the top handle or detent pips to switch sheet height."
        footer={
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground tabular-nums">
              3 / 3 checks passing
            </span>
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        }
      >
        <div className="space-y-2 text-xs">
          <div className="rounded-lg border border-border bg-muted/30 p-3 flex justify-between">
            <span className="font-medium text-foreground">TypeScript strict check</span>
            <span className="font-mono text-success">Passed</span>
          </div>
        </div>
      </Drawer>
    </div>
  );
}`,
  },
  {
    name: "Left Workspace Navigation Drawer",
    description: "Compact left-edge navigation rail drawer with active route highlighting.",
    component: <LeftNavDrawerDemo />,
    code: `import { useState } from "react";
import { Drawer, Button } from "nexoreui";

const destinations = ["Overview", "Repositories", "Runtime Logs", "Settings"];

export default function LeftNavDrawerDemo() {
  const [open, setOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");

  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Left Navigation Drawer
      </Button>
      <span className="text-xs font-mono text-muted-foreground">Active view: {activeNav}</span>
      <Drawer open={open} onClose={() => setOpen(false)} side="left" size="sm" title="Workspace">
        <nav className="space-y-1">
          {destinations.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setActiveNav(label);
                setOpen(false);
              }}
              className="flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium hover:bg-muted"
            >
              {label}
            </button>
          ))}
        </nav>
      </Drawer>
    </div>
  );
}`,
  },
  {
    name: "Grouped Command Palette",
    description: "Searchable command overlay with gliding selection capsule, match count, and shortcut keycaps.",
    component: <CommandPaletteDemo />,
    code: `import { useState } from "react";
import { CommandPalette, Button } from "nexoreui";
import { FileText, User, Settings } from "lucide-react";

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState("None");

  const items = [
    {
      id: "deploy",
      label: "Trigger production deploy",
      description: "Build main branch and promote edge routes",
      group: "Deployments",
      shortcut: "G D",
      icon: <FileText className="w-4 h-4" />,
      onSelect: () => setLastCommand("Trigger production deploy"),
    },
    {
      id: "members",
      label: "Manage team roles",
      description: "Update workspace permissions and invites",
      group: "Organization",
      shortcut: "G M",
      icon: <User className="w-4 h-4" />,
      onSelect: () => setLastCommand("Manage team roles"),
    },
    {
      id: "tokens",
      label: "Rotate API secrets",
      description: "Generate scoped signing keys for CLI access",
      group: "System",
      shortcut: "G K",
      icon: <Settings className="w-4 h-4" />,
      onSelect: () => setLastCommand("Rotate API secrets"),
    },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Command Palette
      </Button>
      <span className="text-xs font-mono text-muted-foreground">Last command: {lastCommand}</span>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Search commands, routes, or settings..."
        items={items}
      />
    </div>
  );
}`,
  },
  {
    name: "Context Menu & Floating Popover",
    description: "Viewport-clamped right-click ContextMenu alongside an anchored FloatingPopover filter card.",
    component: <ContextAndPopoverDemo />,
    code: `import { useState } from "react";
import { ContextMenu, FloatingPopover, Button } from "nexoreui";
import { Copy, Download, Trash2, SlidersHorizontal } from "lucide-react";

export default function ContextAndPopoverDemo() {
  const [lastAction, setLastAction] = useState("Right-click card or open popover");
  const [regionFilter, setRegionFilter] = useState("us-east-1");
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <ContextMenu
          items={[
            { label: "Copy endpoint URL", shortcut: "⌘C", icon: <Copy className="w-3.5 h-3.5" />, onClick: () => setLastAction("Copied endpoint URL") },
            { label: "Download JSON manifest", shortcut: "⌘D", icon: <Download className="w-3.5 h-3.5" />, onClick: () => setLastAction("Downloaded JSON manifest") },
            { label: "", separator: true },
            { label: "Purge cache", destructive: true, icon: <Trash2 className="w-3.5 h-3.5" />, onClick: () => setLastAction("Purged route cache") },
          ]}
        >
          <div tabIndex={0} className="rounded-xl border border-dashed border-border px-5 py-4 text-xs font-semibold">
            Right-click target
          </div>
        </ContextMenu>

        <FloatingPopover
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          trigger={
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Region: {regionFilter}</span>
            </Button>
          }
        >
          <div className="space-y-1">
            {["us-east-1", "eu-central-1", "ap-northeast-1"].map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => {
                  setRegionFilter(region);
                  setLastAction(\`Filtered to \${region}\`);
                  setPopoverOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono hover:bg-muted"
              >
                {region}
              </button>
            ))}
          </div>
        </FloatingPopover>
      </div>
      <span className="text-xs font-mono text-muted-foreground">{lastAction}</span>
    </div>
  );
}`,
  },
];

const overlaysPropsData = [
  { name: "open", type: "boolean", defaultValue: "false", description: "Controls Drawer or CommandPalette overlay visibility.", required: true },
  { name: "onClose", type: "() => void", defaultValue: "-", description: "Callback invoked on backdrop click, Escape key, or close button.", required: true },
  { name: "side", type: '"bottom" | "right" | "left" | "top"', defaultValue: '"bottom"', description: "Viewport edge from which the Drawer slides in.", required: false },
  { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Maximum panel width for left and right Drawers.", required: false },
  { name: "snapPoints", type: "number[]", defaultValue: "-", description: "Fractional viewport height detents (0.25-0.92) for bottom Drawers.", required: false },
  { name: "footer", type: "React.ReactNode", defaultValue: "-", description: "Optional pinned footer bar inside the Drawer.", required: false },
  { name: "FloatingPopover", type: "{ trigger, side, align, open, onOpenChange }", defaultValue: '"bottom" / "center"', description: "Lightweight anchored popover with outside-click and Escape dismissal.", required: false },
];

export function PremiumOverlaysSection() {
  return (
    <section id="premium-overlays" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which overlay"
        items={[
          { label: "Drawer (right / left)", description: "Inspectors, property editors, and workspace navigation rails anchored to screen edges." },
          { label: "Drawer (bottom + snap)", description: "Mobile-friendly action sheets supporting compact 45% and expanded 85% detents." },
          { label: "CommandPalette", description: "Keyboard-driven quick actions with fuzzy search, grouped commands, and shortcut keycaps." },
          { label: "ContextMenu", description: "Pointer right-click or Shift+F10 contextual actions clamped inside viewport edges." },
          { label: "FloatingPopover", description: "Compact anchored filter menus and quick configuration cards tied to a button trigger." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={DrawerPlayground}
          componentName="Drawer"
          importFrom="nexoreui"
          controls={[
            {
              name: "open",
              type: "boolean",
              defaultValue: false,
              description: "Controls live Drawer portal visibility",
            },
            {
              name: "side",
              type: "select",
              options: ["right", "bottom", "left", "top"],
              defaultValue: "right",
              description: "Viewport edge from which the drawer enters",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg"],
              defaultValue: "md",
              description: "Maximum width for left/right drawers",
            },
            {
              name: "title",
              type: "text",
              defaultValue: "Deployment Settings",
              description: "Header title text",
            },
            {
              name: "description",
              type: "text",
              defaultValue: "Configure edge cache headers and webhook signatures.",
              description: "Supporting subtitle text",
            },
          ]}
        />
      </div>

      <div className="space-y-10">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Showcase & Examples</h2>
        {examples.map((item) => (
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

      <PropsTable propsData={overlaysPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Portal & Focus Return:</strong> <code className="text-primary font-mono text-[10px]">Drawer</code> and <code className="text-primary font-mono text-[10px]">CommandPalette</code> render via React portals, lock background scroll, and restore focus to the trigger when closed.</li>
          <li><strong>Keyboard Navigation:</strong> <code className="text-primary font-mono text-[10px]">CommandPalette</code> implements <code className="text-primary font-mono text-[10px]">role="combobox"</code> / <code className="text-primary font-mono text-[10px]">role="listbox"</code> with <kbd className="bg-muted px-1 rounded text-[10px]">ArrowUp</kbd>/<kbd className="bg-muted px-1 rounded text-[10px]">ArrowDown</kbd>, and <code className="text-primary font-mono text-[10px]">ContextMenu</code> opens via <kbd className="bg-muted px-1 rounded text-[10px]">Shift+F10</kbd>.</li>
          <li><strong>Viewport Clamping:</strong> <code className="text-primary font-mono text-[10px]">ContextMenu</code> automatically measures bounding boxes to prevent edge clipping on 375px viewports.</li>
        </ul>
      </div>
    </section>
  );
}
