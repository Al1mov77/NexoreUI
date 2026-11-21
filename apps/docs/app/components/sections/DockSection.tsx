"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import { Dock } from "nexoreui";
import {
  Home,
  FolderGit2,
  Layers,
  Terminal,
  Settings,
  Inbox,
  FileCode2,
  GitBranch,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const workspaceItems = [
  { id: "home", icon: <Home className="h-4 w-4" />, label: "Overview", shortcut: "1" },
  { id: "projects", icon: <FolderGit2 className="h-4 w-4" />, label: "Projects", badge: 4, shortcut: "2" },
  { id: "components", icon: <Layers className="h-4 w-4" />, label: "Components", shortcut: "3", dividerAfter: true },
  { id: "console", icon: <Terminal className="h-4 w-4" />, label: "Console", shortcut: "4" },
  { id: "settings", icon: <Settings className="h-4 w-4" />, label: "Settings", shortcut: "5" },
];

const railItems = [
  { id: "inbox", icon: <Inbox className="h-4 w-4" />, label: "Inbox", badge: 3, shortcut: "G I" },
  { id: "branches", icon: <GitBranch className="h-4 w-4" />, label: "Branches", shortcut: "G B" },
  { id: "files", icon: <FileCode2 className="h-4 w-4" />, label: "Source", shortcut: "G F", dividerAfter: true },
  { id: "search", icon: <Search className="h-4 w-4" />, label: "Find", shortcut: "/" },
];

function InteractiveDockDemo({
  variant = "expanding",
  orientation = "horizontal",
  items = workspaceItems,
  defaultActive = "home",
}: {
  variant?: "expanding" | "rail" | "minimal";
  orientation?: "horizontal" | "vertical";
  items?: typeof workspaceItems;
  defaultActive?: string;
}) {
  const [activeId, setActiveId] = useState(defaultActive);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 py-6">
      <Dock
        items={items}
        activeId={activeId}
        onActiveChange={setActiveId}
        variant={variant}
        orientation={orientation}
      />
      <span className="text-xs font-mono text-muted-foreground">
        Active destination: <span className="text-foreground font-medium">{activeId}</span>
      </span>
    </div>
  );
}

const variants = [
  {
    name: "Expanding Command Dock",
    description: "Signature gliding layoutId capsule that expands horizontally to display the active route label.",
    component: <InteractiveDockDemo variant="expanding" items={workspaceItems} defaultActive="projects" />,
    code: `import { useState } from "react";
import { Dock } from "nexoreui";
import { Home, FolderGit2, Layers, Terminal, Settings } from "lucide-react";

const items = [
  { id: "home", icon: <Home className="h-4 w-4" />, label: "Overview", shortcut: "1" },
  { id: "projects", icon: <FolderGit2 className="h-4 w-4" />, label: "Projects", badge: 4, shortcut: "2" },
  { id: "components", icon: <Layers className="h-4 w-4" />, label: "Components", shortcut: "3", dividerAfter: true },
  { id: "console", icon: <Terminal className="h-4 w-4" />, label: "Console", shortcut: "4" },
  { id: "settings", icon: <Settings className="h-4 w-4" />, label: "Settings", shortcut: "5" },
];

export default function ExpandingDockDemo() {
  const [activeId, setActiveId] = useState("projects");

  return (
    <Dock
      items={items}
      activeId={activeId}
      onActiveChange={setActiveId}
      variant="expanding"
    />
  );
}`
  },
  {
    name: "Mechanical Rail Dock with Counters",
    description: "Fixed-width icon rail with unread badge pills, group dividers, and keyboard shortcut tooltips.",
    component: <InteractiveDockDemo variant="rail" items={railItems} defaultActive="inbox" />,
    code: `import { useState } from "react";
import { Dock } from "nexoreui";
import { Inbox, GitBranch, FileCode2, Search } from "lucide-react";

const items = [
  { id: "inbox", icon: <Inbox className="h-4 w-4" />, label: "Inbox", badge: 3, shortcut: "G I" },
  { id: "branches", icon: <GitBranch className="h-4 w-4" />, label: "Branches", shortcut: "G B" },
  { id: "files", icon: <FileCode2 className="h-4 w-4" />, label: "Source", shortcut: "G F", dividerAfter: true },
  { id: "search", icon: <Search className="h-4 w-4" />, label: "Find", shortcut: "/" },
];

export default function RailDockDemo() {
  const [activeId, setActiveId] = useState("inbox");

  return (
    <Dock
      items={items}
      activeId={activeId}
      onActiveChange={setActiveId}
      variant="rail"
    />
  );
}`
  },
  {
    name: "Vertical Editor Tool Dock",
    description: "Vertical toolbar orientation for canvas sidebars and inspector tool palettes.",
    component: (
      <InteractiveDockDemo
        variant="rail"
        orientation="vertical"
        items={[
          { id: "layers", icon: <Layers className="h-4 w-4" />, label: "Layers", shortcut: "L" },
          { id: "code", icon: <FileCode2 className="h-4 w-4" />, label: "Inspector", shortcut: "I" },
          { id: "controls", icon: <SlidersHorizontal className="h-4 w-4" />, label: "Tokens", shortcut: "T", dividerAfter: true },
          { id: "settings", icon: <Settings className="h-4 w-4" />, label: "Preferences", shortcut: "," },
        ]}
        defaultActive="layers"
      />
    ),
    code: `import { useState } from "react";
import { Dock } from "nexoreui";
import { Layers, FileCode2, SlidersHorizontal, Settings } from "lucide-react";

const items = [
  { id: "layers", icon: <Layers className="h-4 w-4" />, label: "Layers", shortcut: "L" },
  { id: "code", icon: <FileCode2 className="h-4 w-4" />, label: "Inspector", shortcut: "I" },
  { id: "controls", icon: <SlidersHorizontal className="h-4 w-4" />, label: "Tokens", shortcut: "T", dividerAfter: true },
  { id: "settings", icon: <Settings className="h-4 w-4" />, label: "Preferences", shortcut: "," },
];

export default function VerticalDockDemo() {
  const [activeId, setActiveId] = useState("layers");

  return (
    <Dock
      items={items}
      activeId={activeId}
      onActiveChange={setActiveId}
      variant="rail"
      orientation="vertical"
    />
  );
}`
  },
  {
    name: "Minimal Action Toolbar",
    description: "Low-contrast bordered active pill suited for inline toolbars inside cards and editors.",
    component: <InteractiveDockDemo variant="minimal" items={workspaceItems} defaultActive="console" />,
    code: `import { useState } from "react";
import { Dock } from "nexoreui";
import { Home, FolderGit2, Layers, Terminal, Settings } from "lucide-react";

const items = [
  { id: "home", icon: <Home className="h-4 w-4" />, label: "Overview", shortcut: "1" },
  { id: "projects", icon: <FolderGit2 className="h-4 w-4" />, label: "Projects", badge: 4, shortcut: "2" },
  { id: "components", icon: <Layers className="h-4 w-4" />, label: "Components", shortcut: "3", dividerAfter: true },
  { id: "console", icon: <Terminal className="h-4 w-4" />, label: "Console", shortcut: "4" },
  { id: "settings", icon: <Settings className="h-4 w-4" />, label: "Settings", shortcut: "5" },
];

export default function MinimalDockDemo() {
  const [activeId, setActiveId] = useState("console");

  return (
    <Dock
      items={items}
      activeId={activeId}
      onActiveChange={setActiveId}
      variant="minimal"
    />
  );
}`
  }
];

const dockPropsData = [
  { name: "items", type: "DockItem[]", defaultValue: "-", description: "Array of dock actions with icon, label, optional id, badge, shortcut, and dividerAfter.", required: true },
  { name: "activeId", type: "string", defaultValue: "-", description: "Controlled active item ID.", required: false },
  { name: "defaultActiveId", type: "string", defaultValue: "items[0]", description: "Initial active item ID when uncontrolled.", required: false },
  { name: "onActiveChange", type: "(id: string) => void", defaultValue: "-", description: "Callback fired when a dock item is selected.", required: false },
  { name: "variant", type: '"expanding" | "rail" | "minimal"', defaultValue: '"expanding"', description: "Active capsule expansion and contrast mode.", required: false },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Toolbar axis and keyboard arrow direction.", required: false },
  { name: "className", type: "string", defaultValue: "-", description: "Additional custom class names for the dock container.", required: false }
];

const DockPlayground = ({
  variant = "expanding",
  orientation = "horizontal",
}: {
  variant?: "expanding" | "rail" | "minimal";
  orientation?: "horizontal" | "vertical";
}) => {
  return (
    <InteractiveDockDemo
      variant={variant}
      orientation={orientation}
      items={workspaceItems}
      defaultActive="home"
    />
  );
};

export function DockSection() {
  return (
    <section id="dock" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dock</h2>
        <p className="text-muted-foreground mt-1">
          Architectural command dock with shared-layout active capsule, group dividers, badge counters, and roving keyboard navigation.
        </p>
      </div>

      <WhenToUse
        items={[
          { label: "expanding", description: "Primary workspace toolbars where displaying the active destination label reduces icon guesswork." },
          { label: "rail", description: "Compact horizontal or vertical tool strips with unread counts and shortcut keycaps." },
          { label: "minimal", description: "Subtle inline utility bars embedded inside editor panes or floating inspector overlays." },
          { label: "vertical", description: "Canvas sidebars and multi-tool studio layouts anchored along the left or right edge." },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={DockPlayground}
          componentName="Dock"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["expanding", "rail", "minimal"],
              defaultValue: "expanding",
              description: "Visual active capsule mode"
            },
            {
              name: "orientation",
              type: "select",
              options: ["horizontal", "vertical"],
              defaultValue: "horizontal",
              description: "Toolbar axis and keyboard arrow direction"
            }
          ]}
        />
      </div>

      <div className="space-y-10">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Showcase & Examples</h3>
        {variants.map((item, i) => (
          <div key={i} className="space-y-4">
            <div>
              <h4 className="text-base font-semibold text-foreground">{item.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[170px] items-center justify-center rounded-xl border border-border bg-background p-6 overflow-visible">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      <PropsTable propsData={dockPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Toolbar Role & Roving Arrows:</strong> Container exposes <code className="text-primary font-mono text-[10px]">role="toolbar"</code> and navigates across items via <kbd className="bg-muted px-1 rounded text-[10px]">ArrowLeft</kbd>/<kbd className="bg-muted px-1 rounded text-[10px]">ArrowRight</kbd> (or <kbd className="bg-muted px-1 rounded text-[10px]">Up</kbd>/<kbd className="bg-muted px-1 rounded text-[10px]">Down</kbd>), <kbd className="bg-muted px-1 rounded text-[10px]">Home</kbd>, and <kbd className="bg-muted px-1 rounded text-[10px]">End</kbd>.</li>
          <li><strong>Reduced Motion:</strong> Shared-layout capsule glides smoothly or snaps instantly when <code className="text-primary font-mono text-[10px]">prefers-reduced-motion</code> is enabled.</li>
        </ul>
      </div>
    </section>
  );
}
