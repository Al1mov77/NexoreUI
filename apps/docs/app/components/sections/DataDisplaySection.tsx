"use client";

import React from "react";
import { Activity, DollarSign, Users } from "lucide-react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import {
  StatCard,
  Kbd,
  AvatarGroup,
  Timeline,
  CodeBlock,
  PricingCard,
  Divider,
} from "nexoreui";

const showcaseItems = [
  {
    name: "StatCard",
    description: "Metric summary card with optional trend indicator and icon.",
    component: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        <StatCard
          title="Monthly Revenue"
          value="$48,290"
          description="Compared to $41,800 last month"
          icon={DollarSign}
          trend={{ value: "15.5%", positive: true }}
        />
        <StatCard
          title="Active Workspaces"
          value="1,284"
          description="Rolling 30-day window"
          icon={Users}
          trend={{ value: "2.1%", positive: false }}
        />
      </div>
    ),
    code: `import { StatCard } from "nexoreui";
import { DollarSign } from "lucide-react";

export default function StatCardDemo() {
  return (
    <StatCard
      title="Monthly Revenue"
      value="$48,290"
      description="Compared to $41,800 last month"
      icon={DollarSign}
      trend={{ value: "15.5%", positive: true }}
    />
  );
}`,
  },
  {
    name: "Timeline",
    description: "Chronological event log with completed, current, and upcoming markers.",
    component: (
      <div className="w-full max-w-md">
        <Timeline
          items={[
            {
              title: "Schema migration applied",
              description: "Added composite index on events(org_id, created_at).",
              time: "09:14 UTC",
              status: "completed",
            },
            {
              title: "Canary rollout (25%)",
              description: "Monitoring p95 latency across us-east-1 replicas.",
              time: "09:30 UTC",
              status: "current",
            },
            {
              title: "Full production promotion",
              description: "Scheduled once error budget stays under 0.1%.",
              time: "10:00 UTC",
              status: "upcoming",
            },
          ]}
        />
      </div>
    ),
    code: `import { Timeline } from "nexoreui";

export default function TimelineDemo() {
  return (
    <Timeline
      items={[
        { title: "Schema migration applied", description: "Added composite index.", time: "09:14 UTC", status: "completed" },
        { title: "Canary rollout (25%)", description: "Monitoring p95 latency.", time: "09:30 UTC", status: "current" },
        { title: "Full production promotion", description: "Pending health check.", time: "10:00 UTC", status: "upcoming" },
      ]}
    />
  );
}`,
  },
  {
    name: "Kbd & AvatarGroup",
    description: "Keyboard shortcut keycaps and stacked user avatars with overflow counter.",
    component: (
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Open command bar</span>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>K</Kbd>
        </div>
        <AvatarGroup
          limit={3}
          items={[
            { fallback: "MK" },
            { fallback: "SR" },
            { fallback: "AL" },
            { fallback: "DT" },
            { fallback: "NP" },
          ]}
        />
      </div>
    ),
    code: `import { Kbd, AvatarGroup } from "nexoreui";

export default function KbdAndAvatarsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5">
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </div>
      <AvatarGroup
        limit={3}
        items={[
          { fallback: "MK" },
          { fallback: "SR" },
          { fallback: "AL" },
          { fallback: "DT" },
          { fallback: "NP" },
        ]}
      />
    </div>
  );
}`,
  },
  {
    name: "CodeBlock & Divider",
    description: "Copyable monospace code snippet box and horizontal or vertical separators.",
    component: (
      <div className="w-full max-w-md space-y-5">
        <CodeBlock
          language="bash"
          code={`npx nexoreui add data-display\npnpm dev`}
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Section A</span>
            <span>Section B</span>
          </div>
          <Divider orientation="horizontal" />
          <div className="flex items-center gap-3 h-5 text-xs text-muted-foreground">
            <span>Latency 12ms</span>
            <Divider orientation="vertical" />
            <span>Region us-east-1</span>
          </div>
        </div>
      </div>
    ),
    code: `import { CodeBlock, Divider } from "nexoreui";

export default function CodeAndDividerDemo() {
  return (
    <div className="space-y-4">
      <CodeBlock language="bash" code="npx nexoreui add data-display" />
      <Divider orientation="horizontal" />
    </div>
  );
}`,
  },
  {
    name: "PricingCard",
    description: "Structured subscription tier card with feature checklist and highlight state.",
    component: (
      <div className="w-full max-w-sm">
        <PricingCard
          title="Team"
          price="$29"
          description="For engineering teams shipping customer-facing products."
          features={[
            "Unlimited workspaces",
            "Role-based access control",
            "Audit log retention (90 days)",
            "Priority email support",
          ]}
          buttonText="Start Team plan"
          popular
        />
      </div>
    ),
    code: `import { PricingCard } from "nexoreui";

export default function PricingCardDemo() {
  return (
    <PricingCard
      title="Team"
      price="$29"
      description="For engineering teams shipping customer-facing products."
      features={[
        "Unlimited workspaces",
        "Role-based access control",
        "Audit log retention (90 days)",
      ]}
      buttonText="Start Team plan"
      popular
    />
  );
}`,
  },
];

const statCardPropsData = [
  { name: "title", type: "string", defaultValue: "-", description: "Label displayed above the metric value.", required: true },
  { name: "value", type: "string", defaultValue: "-", description: "Primary numeric or formatted metric.", required: true },
  { name: "description", type: "string", defaultValue: "-", description: "Secondary period or comparison note.", required: false },
  { name: "icon", type: "LucideIcon", defaultValue: "-", description: "Optional icon component displayed in the top-right corner.", required: false },
  { name: "trend", type: "{ value: string; positive: boolean }", defaultValue: "-", description: "Delta badge styled with semantic success or destructive tokens.", required: false },
];

export function DataDisplaySection() {
  return (
    <section id="data-display" className="space-y-10 scroll-mt-20">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Playground</h2>
        <PropsEditor
          component={StatCard}
          componentName="StatCard"
          importFrom="nexoreui"
          controls={[
            { name: "title", type: "text", defaultValue: "API Throughput", description: "Metric title" },
            { name: "value", type: "text", defaultValue: "4,820 req/s", description: "Primary value" },
            { name: "description", type: "text", defaultValue: "Last 24 hours", description: "Contextual note" },
          ]}
        />
      </div>

      <div className="space-y-10">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Components in data-display.tsx</h2>
        <div className="space-y-12">
          {showcaseItems.map((item, i) => (
            <div key={i} className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div
                  data-demo-preview
                  className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-background p-6 overflow-x-auto"
                >
                  {item.component}
                </div>
                <ComponentSource sourceCode={item.code} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">StatCard Props Reference</h2>
        <PropsTable propsData={statCardPropsData} />
      </div>
    </section>
  );
}
