"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import { Badge, SplitBadge, Button } from "nexoreui";
import { Bell, ShieldCheck, GitBranch, Clock } from "lucide-react";

function RemovableFilterChipsDemo() {
  const initialTags = ["TypeScript", "Next.js 15", "Tailwind v4", "Reduced Motion"];
  const [tags, setTags] = useState<string[]>(initialTags);

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md">
      <div className="flex flex-wrap items-center justify-center gap-2 min-h-[32px]">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              shape="rounded"
              removable
              onRemove={() => setTags((prev) => prev.filter((item) => item !== tag))}
            >
              {tag}
            </Badge>
          ))
        ) : (
          <span className="text-xs font-mono text-muted-foreground">No active filters</span>
        )}
      </div>
      {tags.length < initialTags.length && (
        <Button variant="outline" size="sm" onClick={() => setTags(initialTags)}>
          Reset filters
        </Button>
      )}
    </div>
  );
}

const variants = [
  {
    name: "Core & Semantic Status Badges",
    description: "Theme-adaptive semantic tokens paired with static concentric status dots.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success" dot>
          Healthy
        </Badge>
        <Badge variant="info" dot>
          Syncing
        </Badge>
        <Badge variant="warning" dot>
          Degraded
        </Badge>
        <Badge variant="destructive" dot>
          Failed
        </Badge>
      </div>
    ),
    code: `import { Badge } from "nexoreui";

export default function SemanticBadgesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success" dot>Healthy</Badge>
      <Badge variant="info" dot>Syncing</Badge>
      <Badge variant="warning" dot>Degraded</Badge>
      <Badge variant="destructive" dot>Failed</Badge>
    </div>
  );
}`,
  },
  {
    name: "Split Telemetry Badges",
    description: "Two-compartment key/value badges for regions, versions, latency, and release status.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <SplitBadge label="Region" value="us-east-1" />
        <SplitBadge label="Build" value="v2.0.4" variant="info" />
        <SplitBadge label="Latency" value="12ms" variant="success" />
        <SplitBadge label="Quota" value="88%" variant="warning" />
      </div>
    ),
    code: `import { SplitBadge } from "nexoreui";

export default function SplitTelemetryBadgesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <SplitBadge label="Region" value="us-east-1" />
      <SplitBadge label="Build" value="v2.0.4" variant="info" />
      <SplitBadge label="Latency" value="12ms" variant="success" />
      <SplitBadge label="Quota" value="88%" variant="warning" />
    </div>
  );
}`,
  },
  {
    name: "Compartment & Notification Counter Badges",
    description: "Tabular numeric compartments inside badges and compact count pills anchored on action buttons.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Badge variant="outline" count={14}>
          Open PRs
        </Badge>
        <Badge variant="secondary" count={3}>
          Warnings
        </Badge>
        <div className="relative inline-flex">
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Badge
            variant="destructive"
            size="sm"
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 justify-center font-mono tabular-nums"
          >
            5
          </Badge>
        </div>
      </div>
    ),
    code: `import { Badge, Button } from "nexoreui";
import { Bell } from "lucide-react";

export default function CounterBadgesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="outline" count={14}>Open PRs</Badge>
      <Badge variant="secondary" count={3}>Warnings</Badge>
      <div className="relative inline-flex">
        <Button variant="outline" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Badge
          variant="destructive"
          size="sm"
          className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 justify-center font-mono tabular-nums"
        >
          5
        </Badge>
      </div>
    </div>
  );
}`,
  },
  {
    name: "Interactive Removable Filter Chips",
    description: "Keyboard-accessible dismiss buttons for active table filters and tag selections.",
    component: <RemovableFilterChipsDemo />,
    code: `import { useState } from "react";
import { Badge, Button } from "nexoreui";

const initialTags = ["TypeScript", "Next.js 15", "Tailwind v4", "Reduced Motion"];

export default function RemovableFilterChipsDemo() {
  const [tags, setTags] = useState(initialTags);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              shape="rounded"
              removable
              onRemove={() => setTags((prev) => prev.filter((item) => item !== tag))}
            >
              {tag}
            </Badge>
          ))
        ) : (
          <span className="text-xs font-mono text-muted-foreground">No active filters</span>
        )}
      </div>
      {tags.length < initialTags.length && (
        <Button variant="outline" size="sm" onClick={() => setTags(initialTags)}>
          Reset filters
        </Button>
      )}
    </div>
  );
}`,
  },
  {
    name: "Size & Geometry Matrix",
    description: "Scale options from compact table tags (sm) to prominent status pills (lg) in pill or rounded geometry.",
    component: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge size="sm" shape="pill">Small Pill</Badge>
          <Badge size="default" shape="pill">Default Pill</Badge>
          <Badge size="lg" shape="pill">Large Pill</Badge>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge size="sm" shape="rounded" variant="outline">Small Rounded</Badge>
          <Badge size="default" shape="rounded" variant="outline">Default Rounded</Badge>
          <Badge size="lg" shape="rounded" variant="outline">Large Rounded</Badge>
        </div>
      </div>
    ),
    code: `import { Badge } from "nexoreui";

export default function BadgeSizesDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge size="sm" shape="pill">Small Pill</Badge>
        <Badge size="default" shape="pill">Default Pill</Badge>
        <Badge size="lg" shape="pill">Large Pill</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge size="sm" shape="rounded" variant="outline">Small Rounded</Badge>
        <Badge size="default" shape="rounded" variant="outline">Default Rounded</Badge>
        <Badge size="lg" shape="rounded" variant="outline">Large Rounded</Badge>
      </div>
    </div>
  );
}`,
  },
  {
    name: "Icon-Paired Semantic Badges",
    description: "Leading icon slot keeping stroke scale proportional across verified, branch, and schedule labels.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge variant="success" icon={<ShieldCheck className="h-3 w-3" />}>
          Verified Signature
        </Badge>
        <Badge variant="outline" shape="rounded" icon={<GitBranch className="h-3 w-3" />}>
          main
        </Badge>
        <Badge variant="warning" icon={<Clock className="h-3 w-3" />}>
          Scheduled 02:00 UTC
        </Badge>
      </div>
    ),
    code: `import { Badge } from "nexoreui";
import { ShieldCheck, GitBranch, Clock } from "lucide-react";

export default function IconBadgesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success" icon={<ShieldCheck className="h-3 w-3" />}>
        Verified Signature
      </Badge>
      <Badge variant="outline" shape="rounded" icon={<GitBranch className="h-3 w-3" />}>
        main
      </Badge>
      <Badge variant="warning" icon={<Clock className="h-3 w-3" />}>
        Scheduled 02:00 UTC
      </Badge>
    </div>
  );
}`,
  },
];

const badgePropsData = [
  { name: "variant", type: '"default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" | "muted"', defaultValue: '"default"', description: "Semantic surface and foreground color pairing.", required: false },
  { name: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"', description: "Padding and typographic scale of the badge.", required: false },
  { name: "shape", type: '"pill" | "rounded"', defaultValue: '"pill"', description: "Border radius profile: full capsule or subtle 6px corners.", required: false },
  { name: "dot", type: "boolean", defaultValue: "false", description: "Renders a static leading status dot matched to badge color.", required: false },
  { name: "icon", type: "React.ReactNode", defaultValue: "-", description: "Optional leading icon rendered cleanly beside the label.", required: false },
  { name: "count", type: "number | string", defaultValue: "-", description: "Appends a hairline-separated monospaced counter compartment.", required: false },
  { name: "removable", type: "boolean", defaultValue: "false", description: "Adds an accessible remove trigger button on the trailing edge.", required: false },
  { name: "onRemove", type: "() => void", defaultValue: "-", description: "Callback invoked when the remove button is activated.", required: false },
  { name: "SplitBadge", type: "{ label, value, variant, size }", defaultValue: "-", description: "Two-compartment key/value badge for telemetry readouts.", required: false },
];

export function BadgeSection() {
  return (
    <section id="badges" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which badge"
        items={[
          { label: "success / warning / destructive", description: "Conveying health status, quota thresholds, and build outcomes in tables and headers." },
          { label: "SplitBadge", description: "Dense telemetry metadata pairs such as region, version, or latency metrics." },
          { label: "count / notification", description: "Quantifying unread counts, open pull requests, or pending review items." },
          { label: "removable", description: "Active filter tokens that users can clear individually or via keyboard." },
          { label: "outline / muted", description: "Neutral categorization tags that must not compete with primary action buttons." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={Badge}
          componentName="Badge"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "secondary", "outline", "muted", "success", "info", "warning", "destructive"],
              defaultValue: "default",
              description: "Semantic surface and foreground color variant",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "default", "lg"],
              defaultValue: "default",
              description: "Size scale of the badge",
            },
            {
              name: "shape",
              type: "select",
              options: ["pill", "rounded"],
              defaultValue: "pill",
              description: "Corner geometry profile",
            },
            {
              name: "dot",
              type: "boolean",
              defaultValue: false,
              description: "Displays a static leading status indicator dot",
            },
            {
              name: "children",
              type: "text",
              defaultValue: "Production",
              description: "Label text inside the badge",
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

      <PropsTable propsData={badgePropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Paired Status Semantics:</strong> Badges pair color tokens with explicit text labels rather than relying on dot hue alone.</li>
          <li><strong>Removable Chip Access:</strong> Dismiss buttons expose descriptive <code className="text-primary font-mono text-[10px]">aria-label</code> attributes and standard focus rings.</li>
          <li><strong>Live Counter Regions:</strong> Wrap dynamically updating notification badges in <code className="text-primary font-mono text-[10px]">aria-live="polite"</code> when announcing unread increments.</li>
        </ul>
      </div>
    </section>
  );
}
