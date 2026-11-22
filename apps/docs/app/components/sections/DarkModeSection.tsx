"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import { DarkModeToggle, type ThemeMode } from "nexoreui";

interface DarkModePlaygroundProps {
  theme?: ThemeMode;
  variant?: "pill" | "icon" | "segmented" | "card" | "dial";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  onChange?: (next: ThemeMode) => void;
}

function DarkModePlayground({
  theme = "dark",
  variant = "dial",
  size = "md",
  showLabel = true,
  onChange,
}: DarkModePlaygroundProps) {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <DarkModeToggle
        theme={theme}
        variant={variant}
        size={size}
        showLabel={showLabel}
        onChange={onChange}
      />
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span>Active preference:</span>
        <span className="px-2 py-0.5 rounded border border-border bg-muted text-foreground font-semibold capitalize">
          {theme}
        </span>
      </div>
    </div>
  );
}

function InteractiveThemeDemo({
  variant,
  showLabel = false,
}: {
  variant: "pill" | "segmented" | "card" | "dial";
  showLabel?: boolean;
}) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <DarkModeToggle
        variant={variant}
        showLabel={showLabel}
        theme={mode}
        onChange={setMode}
      />
      <span className="text-xs font-mono text-muted-foreground">
        Selected mode: <span className="text-foreground font-semibold">{mode}</span>
      </span>
    </div>
  );
}

function IconSizesDemo() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <DarkModeToggle variant="icon" size="sm" theme={mode} onChange={setMode} />
        <DarkModeToggle variant="icon" size="md" theme={mode} onChange={setMode} />
        <DarkModeToggle variant="icon" size="lg" theme={mode} onChange={setMode} />
      </div>
      <span className="text-xs font-mono text-muted-foreground">
        Current state: <span className="text-foreground font-semibold">{mode}</span>
      </span>
    </div>
  );
}

const examples = [
  {
    name: "Precision Horizon Dial",
    description: "Calibrated 180-degree arc cycling smoothly between Light, System, and Dark modes with arrow key support.",
    component: <InteractiveThemeDemo variant="dial" />,
    code: `import { useState } from "react";
import { DarkModeToggle, type ThemeMode } from "nexoreui";

export default function HorizonDialThemeDemo() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  return (
    <div className="flex flex-col items-center gap-3">
      <DarkModeToggle variant="dial" theme={mode} onChange={setMode} />
      <span className="text-xs font-mono text-muted-foreground">Selected mode: {mode}</span>
    </div>
  );
}`,
  },
  {
    name: "Eclipse Morph Icon Sizes",
    description: "Geometric SVG mask morphs between sun rays and crescent moon across sm, md, and lg controls.",
    component: <IconSizesDemo />,
    code: `import { useState } from "react";
import { DarkModeToggle, type ThemeMode } from "nexoreui";

export default function EclipseIconThemeDemo() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  return (
    <div className="flex items-center gap-3">
      <DarkModeToggle variant="icon" size="sm" theme={mode} onChange={setMode} />
      <DarkModeToggle variant="icon" size="md" theme={mode} onChange={setMode} />
      <DarkModeToggle variant="icon" size="lg" theme={mode} onChange={setMode} />
    </div>
  );
}`,
  },
  {
    name: "Gliding Segmented Tri-State",
    description: "Accessible radiogroup with shared-layout active capsule and Left/Right arrow navigation.",
    component: <InteractiveThemeDemo variant="segmented" showLabel />,
    code: `import { useState } from "react";
import { DarkModeToggle, type ThemeMode } from "nexoreui";

export default function SegmentedThemeDemo() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  return (
    <DarkModeToggle
      variant="segmented"
      showLabel
      theme={mode}
      onChange={setMode}
    />
  );
}`,
  },
  {
    name: "Architectural Pill Switch",
    description: "Dual-track solar and lunar pill switch with accessible role=switch semantics.",
    component: <InteractiveThemeDemo variant="pill" showLabel />,
    code: `import { useState } from "react";
import { DarkModeToggle, type ThemeMode } from "nexoreui";

export default function PillThemeDemo() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  return (
    <DarkModeToggle
      variant="pill"
      showLabel
      theme={mode}
      onChange={setMode}
    />
  );
}`,
  },
  {
    name: "Wireframe Surface Card Selector",
    description: "Three-card preference selector showing token-adaptive Light, Dark, and Split System surface previews.",
    component: <InteractiveThemeDemo variant="card" />,
    code: `import { useState } from "react";
import { DarkModeToggle, type ThemeMode } from "nexoreui";

export default function CardThemeDemo() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  return (
    <DarkModeToggle
      variant="card"
      theme={mode}
      onChange={setMode}
    />
  );
}`,
  },
];

const darkModePropsData = [
  { name: "theme", type: '"light" | "dark" | "system"', defaultValue: "uncontrolled", description: "Controlled theme mode; when omitted, syncs automatically with localStorage and prefers-color-scheme.", required: false },
  { name: "variant", type: '"pill" | "icon" | "segmented" | "card" | "dial"', defaultValue: '"pill"', description: "Visual presentation style of the switcher.", required: false },
  { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Size preset applied to pill and icon variants.", required: false },
  { name: "showLabel", type: "boolean", defaultValue: "false", description: "Displays the active mode label beside pill or segmented options.", required: false },
  { name: "storageKey", type: "string", defaultValue: '"nexore-theme"', description: "LocalStorage key used when running uncontrolled.", required: false },
  { name: "onChange", type: '(theme: "light" | "dark" | "system") => void', defaultValue: "-", description: "Callback fired whenever the user selects a new theme mode.", required: false },
];

export function DarkModeSection() {
  return (
    <section id="dark-mode" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which theme switcher"
        items={[
          { label: "icon", description: "Compact navigation bars and header toolbars toggling cleanly between Light and Dark." },
          { label: "dial", description: "Tri-state utility headers cycling Light, System, and Dark with one control." },
          { label: "segmented", description: "Popovers and command menus where explicit Light / Dark / System labels belong side by side." },
          { label: "card", description: "Account and appearance settings panels showcasing live miniature surface previews." },
          { label: "pill", description: "Binary settings rows paired with an optional status label." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={DarkModePlayground}
          componentName="DarkModeToggle"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["dial", "icon", "segmented", "pill", "card"],
              defaultValue: "dial",
              description: "Visual switcher presentation",
            },
            {
              name: "theme",
              type: "select",
              options: ["dark", "light", "system"],
              defaultValue: "dark",
              description: "Selected theme preference",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg"],
              defaultValue: "md",
              description: "Control size for pill and icon variants",
            },
            {
              name: "showLabel",
              type: "boolean",
              defaultValue: true,
              description: "Displays labels on pill and segmented variants",
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

      <PropsTable propsData={darkModePropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Roving Radiogroup:</strong> Both <code className="text-primary font-mono text-[10px]">segmented</code> and <code className="text-primary font-mono text-[10px]">card</code> modes implement <code className="text-primary font-mono text-[10px]">role="radiogroup"</code> with <kbd className="bg-muted px-1 rounded text-[10px]">ArrowLeft</kbd>/<kbd className="bg-muted px-1 rounded text-[10px]">ArrowRight</kbd>, <kbd className="bg-muted px-1 rounded text-[10px]">Home</kbd>, and <kbd className="bg-muted px-1 rounded text-[10px]">End</kbd> focus management.</li>
          <li><strong>Switch Role:</strong> Binary <code className="text-primary font-mono text-[10px]">pill</code> mode exposes <code className="text-primary font-mono text-[10px]">role="switch"</code> and <code className="text-primary font-mono text-[10px]">aria-checked</code>.</li>
          <li><strong>Reduced Motion:</strong> Eclipse SVG mask transitions, dial rotation, and segmented capsule slides collapse to instant transitions when <code className="text-primary font-mono text-[10px]">prefers-reduced-motion</code> is active.</li>
        </ul>
      </div>
    </section>
  );
}

export default DarkModeSection;
