"use client";

import React from "react";
import { Activity, DollarSign, GitBranch, Package, Rocket, Server, ShieldCheck, Users } from "lucide-react";
import {
  AvatarGroup,
  CodeBlock,
  Divider,
  Kbd,
  PricingCard,
  StatCard,
  Timeline,
} from "nexoreui";
import { A11yHeader } from "../A11yNotice";
import { ComponentCard, ComponentSection } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { WhenToUse } from "../WhenToUse";

const whenToUseItems = [
  {
    label: "StatCard",
    description:
      "Use for KPI summaries with an uppercase label, tabular metric, directional delta, and single line of context.",
  },
  {
    label: "Timeline",
    description:
      "Use for chronological audit logs, release milestones, or deployment sequences ordered from newest to oldest.",
  },
  {
    label: "Kbd & AvatarGroup",
    description:
      "Use Kbd inside menus and toolbars for keyboard shortcuts, and AvatarGroup to summarize multi-user assignment stacks.",
  },
  {
    label: "CodeBlock & Divider",
    description:
      "Use CodeBlock for inspectable single-file snippets with copy feedback, and Divider for subtle 1px horizontal or vertical partitions.",
  },
  {
    label: "PricingCard",
    description:
      "Use in 2- or 3-column plan comparisons with consistent feature lists and one highlighted featured tier.",
  },
];

const releaseTimeline = [
  {
    title: "Production cutover completed",
    description: "Routed 100% of ingress traffic to cluster eu-west-2 with zero dropped connections.",
    date: "14:22 UTC",
    icon: <Rocket className="h-3.5 w-3.5" />,
  },
  {
    title: "Schema migration verified",
    description: "Applied index updates across billing_ledger and verified read replica checksums.",
    date: "13:45 UTC",
    icon: <Server className="h-3.5 w-3.5" />,
  },
  {
    title: "Release candidate tagged",
    description: "Merged release/v2.4.1 after full integration and accessibility checks passed.",
    date: "11:10 UTC",
    icon: <GitBranch className="h-3.5 w-3.5" />,
  },
];

const teamMembers = [
  { fallback: "MK" },
  { fallback: "TL" },
  { fallback: "NO" },
  { fallback: "AR" },
  { fallback: "JH" },
];

const sampleCodeSnippet = `import { StatCard } from "nexoreui"
import { DollarSign } from "lucide-react"

export function RevenueMetric() {
  return (
    <StatCard
      title="Monthly Recurring Revenue"
      value="$48,920"
      trend={{ value: "+12.4%", positive: true }}
      description="Net expansion compared with prior 30-day cycle"
      icon={DollarSign}
    />
  )
}`;

const statCardCode = `import { StatCard } from "nexoreui";
import { Activity, DollarSign, Users } from "lucide-react";

export default function MetricsGridDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <StatCard
        title="Net Revenue"
        value="$48,920"
        trend={{ value: "+12.4%", positive: true }}
        description="Compared with previous 30 days"
        icon={DollarSign}
      />
      <StatCard
        title="Active Seats"
        value="2,840"
        trend={{ value: "+4.1%", positive: true }}
        description="Verified workspace operators"
        icon={Users}
      />
      <StatCard
        title="Error Budget"
        value="99.94%"
        trend={{ value: "-0.02%", positive: false }}
        description="Rolling 7-day availability"
        icon={Activity}
      />
    </div>
  );
}`;

const timelineCode = `import { Timeline } from "nexoreui";
import { GitBranch, Rocket, Server } from "lucide-react";

const releaseEvents = [
  {
    title: "Production cutover completed",
    description: "Routed 100% of ingress traffic to cluster eu-west-2 with zero dropped connections.",
    date: "14:22 UTC",
    icon: <Rocket className="h-3.5 w-3.5" />,
  },
  {
    title: "Schema migration verified",
    description: "Applied index updates across billing_ledger and verified read replica checksums.",
    date: "13:45 UTC",
    icon: <Server className="h-3.5 w-3.5" />,
  },
  {
    title: "Release candidate tagged",
    description: "Merged release/v2.4.1 after full integration and accessibility checks passed.",
    date: "11:10 UTC",
    icon: <GitBranch className="h-3.5 w-3.5" />,
  },
];

export default function TimelineDemo() {
  return <Timeline items={releaseEvents} className="w-full max-w-lg" />;
}`;

const kbdAndAvatarsCode = `import { AvatarGroup, Divider, Kbd } from "nexoreui";

const teamMembers = [
  { fallback: "MK" },
  { fallback: "TL" },
  { fallback: "NO" },
  { fallback: "AR" },
  { fallback: "JH" },
];

export default function ShortcutsAndTeamDemo() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full max-w-lg rounded-xl border border-border bg-card p-5">
      <div className="space-y-2">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Command Palette
        </p>
        <div className="flex items-center gap-1.5 text-sm text-foreground">
          <span>Open search</span>
          <Kbd>Cmd</Kbd>
          <span className="text-muted-foreground">+</span>
          <Kbd>K</Kbd>
        </div>
      </div>

      <Divider orientation="vertical" className="hidden sm:block h-10" />
      <Divider orientation="horizontal" className="sm:hidden" />

      <div className="space-y-2">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Reviewers
        </p>
        <AvatarGroup items={teamMembers} limit={3} />
      </div>
    </div>
  );
}`;

const codeBlockAndDividerCode = `import { CodeBlock, Divider } from "nexoreui";

const snippet = \`import { StatCard } from "nexoreui"
import { DollarSign } from "lucide-react"

export function RevenueMetric() {
  return (
    <StatCard
      title="Monthly Recurring Revenue"
      value="$48,920"
      trend={{ value: "+12.4%", positive: true }}
      description="Net expansion compared with prior 30-day cycle"
      icon={DollarSign}
    />
  )
}\`;

export default function CodeBlockDemo() {
  return (
    <div className="w-full max-w-xl space-y-5">
      <CodeBlock code={snippet} language="tsx" filename="revenue-metric.tsx" />
      <Divider />
      <div className="flex h-6 items-center gap-4 text-xs text-muted-foreground">
        <span>MIT License</span>
        <Divider orientation="vertical" />
        <span>Zero dependencies</span>
        <Divider orientation="vertical" />
        <span>TypeScript strict</span>
      </div>
    </div>
  );
}`;

const pricingCardCode = `import { PricingCard } from "nexoreui";

export default function PricingGridDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
      <PricingCard
        title="Standard"
        price="$29"
        description="Core components and analytics widgets for small product teams."
        features={[
          "All 72 core and layout components",
          "Copy-paste registry CLI access",
          "Light and dark semantic themes",
          "Community support",
        ]}
        buttonText="Select Standard"
      />
      <PricingCard
        title="Team Pro"
        price="$79"
        popular
        description="Complete multi-brand templates, generators, and team seats."
        features={[
          "Everything in Standard",
          "All Pro page templates and flows",
          "Unlimited commercial client projects",
          "Priority engineering fixes",
        ]}
        buttonText="Upgrade to Team Pro"
      />
    </div>
  );
}`;

export function DataDisplaySection() {
  return (
    <section id="data-display" className="space-y-12 scroll-mt-20">
      <WhenToUse items={whenToUseItems} />

      <ComponentSection
        title="Interactive Playground"
        description="Inspect StatCard typography, tabular spacing, and trend hierarchy across Desktop, Tablet, and Mobile viewports."
      >
        <PropsEditor
          component={StatCard}
          componentName="StatCard"
          importFrom="nexoreui"
          controls={[
            {
              name: "title",
              type: "text",
              defaultValue: "Monthly Recurring Revenue",
              description: "Uppercase label describing the metric.",
            },
            {
              name: "value",
              type: "text",
              defaultValue: "$48,920",
              description: "Primary tabular numerical value.",
            },
            {
              name: "description",
              type: "text",
              defaultValue: "Net expansion across 1,420 active accounts",
              description: "Contextual helper text below the value.",
            },
          ]}
        />
      </ComponentSection>

      <div className="space-y-10">
        <ComponentCard
          title="Metric Summary Cards"
          description="StatCard pairs monospace labels, tabular-nums values, directional trend badges, and muted icon containers."
          code={statCardCode}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <StatCard
              title="Net Revenue"
              value="$48,920"
              trend={{ value: "+12.4%", positive: true }}
              description="Compared with previous 30 days"
              icon={DollarSign}
            />
            <StatCard
              title="Active Seats"
              value="2,840"
              trend={{ value: "+4.1%", positive: true }}
              description="Verified workspace operators"
              icon={Users}
            />
            <StatCard
              title="Error Budget"
              value="99.94%"
              trend={{ value: "-0.02%", positive: false }}
              description="Rolling 7-day availability"
              icon={Activity}
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Activity Timeline"
          description="Chronological event sequence with an aligned flex connector column and crisp timestamp labels."
          code={timelineCode}
        >
          <Timeline items={releaseTimeline} className="w-full max-w-lg" />
        </ComponentCard>

        <ComponentCard
          title="Keyboard Shortcuts & Avatar Stack"
          description="Compact Kbd keycaps and AvatarGroup stacks with automatic overflow counter."
          code={kbdAndAvatarsCode}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full max-w-lg rounded-xl border border-border bg-card p-5">
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Command Palette
              </p>
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <span>Open search</span>
                <Kbd>Cmd</Kbd>
                <span className="text-muted-foreground">+</span>
                <Kbd>K</Kbd>
              </div>
            </div>

            <Divider orientation="vertical" className="hidden sm:block h-10" />
            <Divider orientation="horizontal" className="sm:hidden" />

            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Reviewers
              </p>
              <AvatarGroup items={teamMembers} limit={3} />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Code Block & Structural Dividers"
          description="CodeBlock separates filename metadata and copy controls into a dedicated header bar, paired with horizontal and vertical Divider lines."
          code={codeBlockAndDividerCode}
        >
          <div className="w-full max-w-xl space-y-5">
            <CodeBlock code={sampleCodeSnippet} language="tsx" filename="revenue-metric.tsx" />
            <Divider />
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-foreground" />
                MIT License
              </span>
              <Divider orientation="vertical" className="h-4" />
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-foreground" />
                Zero dependencies
              </span>
              <Divider orientation="vertical" className="h-4" />
              <span>TypeScript strict</span>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Pricing Comparison"
          description="Balanced PricingCard grid using inline tier badges and tabular monthly figures."
          code={pricingCardCode}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
            <PricingCard
              title="Standard"
              price="$29"
              description="Core components and analytics widgets for small product teams."
              features={[
                "All 72 core and layout components",
                "Copy-paste registry CLI access",
                "Light and dark semantic themes",
                "Community support",
              ]}
              buttonText="Select Standard"
            />
            <PricingCard
              title="Team Pro"
              price="$79"
              popular
              description="Complete multi-brand templates, generators, and team seats."
              features={[
                "Everything in Standard",
                "All Pro page templates and flows",
                "Unlimited commercial client projects",
                "Priority engineering fixes",
              ]}
              buttonText="Upgrade to Team Pro"
            />
          </div>
        </ComponentCard>
      </div>

      <div className="space-y-4">
        <A11yHeader title="Accessibility & Semantics" />
        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground rounded-xl border border-border bg-card p-5">
          <li>
            <strong className="text-foreground">Semantic elements:</strong> Timeline renders as an ordered list (&lt;ol&gt;), Kbd uses native &lt;kbd&gt;, and Divider sets role=&quot;separator&quot; with aria-orientation.
          </li>
          <li>
            <strong className="text-foreground">Readable copy controls:</strong> CodeBlock moves clipboard actions into a dedicated header bar so code lines never get obscured on mobile viewports.
          </li>
          <li>
            <strong className="text-foreground">Tabular alignment:</strong> StatCard trends, AvatarGroup overflow chips, Timeline timestamps, and PricingCard prices apply tabular-nums.
          </li>
        </ul>
      </div>

      <PropsTable
        propsData={[
          {
            name: "title",
            type: "string",
            description: "Heading label rendered in StatCard or PricingCard.",
            required: true,
          },
          {
            name: "value",
            type: "string",
            description: "Primary formatted KPI figure displayed in StatCard.",
            required: true,
          },
          {
            name: "trend",
            type: "{ value: string; positive: boolean }",
            description: "Optional delta badge in StatCard using semantic success/destructive tokens.",
          },
          {
            name: "items (Timeline)",
            type: "TimelineItem[]",
            description: "Ordered list of event objects with title, description, optional date, and icon.",
          },
          {
            name: "items (AvatarGroup)",
            type: "AvatarGroupItem[]",
            description: "Member list with fallback initials and optional image src.",
          },
          {
            name: "limit",
            type: "number",
            defaultValue: "3",
            description: "Maximum visible avatars rendered by AvatarGroup before showing +N.",
          },
          {
            name: "filename",
            type: "string",
            description: "Optional filename displayed in the CodeBlock header bar.",
          },
          {
            name: "orientation",
            type: '"horizontal" | "vertical"',
            defaultValue: '"horizontal"',
            description: "Axis orientation for Divider separator lines.",
          },
        ]}
      />
    </section>
  );
}

export default DataDisplaySection;
