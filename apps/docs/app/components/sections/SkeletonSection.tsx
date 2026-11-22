"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Skeleton,
  SkeletonText,
  SkeletonTable,
  SkeletonMetricCard,
  Badge,
  Button,
  type SkeletonProps,
} from "nexoreui";

function SkeletonPlayground(props: SkeletonProps) {
  return (
    <div className="w-full max-w-sm flex items-center justify-center">
      <Skeleton {...props} />
    </div>
  );
}

function LiveContentToggleDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-muted-foreground">
          State: <span className="text-foreground font-medium">{loading ? "Loading" : "Loaded"}</span>
        </span>
        <Button variant="outline" size="sm" onClick={() => setLoading((v) => !v)}>
          {loading ? "Show loaded card" : "Simulate loading"}
        </Button>
      </div>

      <div
        aria-busy={loading}
        className="rounded-xl border border-border bg-card p-4 space-y-3"
      >
        {loading ? (
          <>
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton variant="line" className="h-3.5 w-2/3" />
                <Skeleton variant="line" className="h-3 w-1/2" />
              </div>
            </div>
            <SkeletonText lines={2} />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                  MK
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">Mina Kato</div>
                  <div className="text-xs font-mono text-muted-foreground">eu-central-1 · #482</div>
                </div>
              </div>
              <Badge variant="success" dot>Live</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Promoted schema build across 4 regional edge clusters with zero dropped requests.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const variants = [
  {
    name: "Live Content-to-Skeleton Toggle",
    description: "Matches exact card proportions and aria-busy attributes while toggling between loading and loaded states.",
    component: <LiveContentToggleDemo />,
    code: `import { useState } from "react";
import { Skeleton, SkeletonText, Badge, Button } from "nexoreui";

export default function LiveContentToggleDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full max-w-sm space-y-3">
      <Button variant="outline" size="sm" onClick={() => setLoading((v) => !v)}>
        {loading ? "Show loaded card" : "Simulate loading"}
      </Button>

      <div aria-busy={loading} className="rounded-xl border border-border bg-card p-4 space-y-3">
        {loading ? (
          <>
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton variant="line" className="h-3.5 w-2/3" />
                <Skeleton variant="line" className="h-3 w-1/2" />
              </div>
            </div>
            <SkeletonText lines={2} />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center font-mono text-xs font-semibold">
                  MK
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">Mina Kato</div>
                  <div className="text-xs font-mono text-muted-foreground">eu-central-1</div>
                </div>
              </div>
              <Badge variant="success" dot>Live</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Promoted schema build across 4 regional edge clusters with zero dropped requests.
            </p>
          </>
        )}
      </div>
    </div>
  );
}`,
  },
  {
    name: "Typographic Paragraph",
    description: "SkeletonText automatically tapers final lines to mirror natural paragraph proportions.",
    component: (
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4">
        <SkeletonText lines={4} />
      </div>
    ),
    code: `import { SkeletonText } from "nexoreui";

export default function SkeletonTextDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4">
      <SkeletonText lines={4} />
    </div>
  );
}`,
  },
  {
    name: "Profile Header Placeholder",
    description: "Responsive flex-1 container pairing circular avatar geometry with two-tier heading lines.",
    component: (
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4 flex items-center gap-3">
        <Skeleton variant="circle" className="h-11 w-11 shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton variant="line" className="h-3.5 w-3/5" />
          <Skeleton variant="line" className="h-3 w-2/5" />
        </div>
        <Skeleton variant="rect" className="h-8 w-16 rounded-lg shrink-0" />
      </div>
    ),
    code: `import { Skeleton } from "nexoreui";

export default function ProfileHeaderSkeletonDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <Skeleton variant="circle" className="h-11 w-11 shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton variant="line" className="h-3.5 w-3/5" />
        <Skeleton variant="line" className="h-3 w-2/5" />
      </div>
      <Skeleton variant="rect" className="h-8 w-16 rounded-lg shrink-0" />
    </div>
  );
}`,
  },
  {
    name: "Structured Data Table",
    description: "SkeletonTable reserves header and row geometry to eliminate table layout shifts on mount.",
    component: (
      <div className="w-full max-w-md">
        <SkeletonTable rows={3} columns={3} />
      </div>
    ),
    code: `import { SkeletonTable } from "nexoreui";

export default function SkeletonTableDemo() {
  return (
    <div className="w-full max-w-md">
      <SkeletonTable rows={3} columns={3} />
    </div>
  );
}`,
  },
  {
    name: "KPI Metric Card Pair",
    description: "Responsive two-column dashboard metric card placeholders that stack cleanly at 375px.",
    component: (
      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SkeletonMetricCard />
        <SkeletonMetricCard />
      </div>
    ),
    code: `import { SkeletonMetricCard } from "nexoreui";

export default function SkeletonMetricGridDemo() {
  return (
    <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3">
      <SkeletonMetricCard />
      <SkeletonMetricCard />
    </div>
  );
}`,
  },
  {
    name: "Shimmer Sweep vs Static Mode",
    description: "Compare continuous directional shimmer against static placeholders for low-power or reduced-motion views.",
    component: (
      <div className="w-full max-w-sm space-y-3">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-muted-foreground">animated=true</span>
          <Skeleton variant="rect" className="h-10 w-full" animated />
        </div>
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-muted-foreground">animated=false</span>
          <Skeleton variant="rect" className="h-10 w-full" animated={false} />
        </div>
      </div>
    ),
    code: `import { Skeleton } from "nexoreui";

export default function SkeletonAnimationModeDemo() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <Skeleton variant="rect" className="h-10 w-full" animated />
      <Skeleton variant="rect" className="h-10 w-full" animated={false} />
    </div>
  );
}`,
  },
];

const skeletonPropsData = [
  { name: "variant", type: '"line" | "circle" | "rect"', defaultValue: '"rect"', description: "Geometric shape preset of the placeholder.", required: false },
  { name: "width", type: "string | number", defaultValue: "-", description: "Optional explicit CSS width or pixel dimension.", required: false },
  { name: "height", type: "string | number", defaultValue: "-", description: "Optional explicit CSS height or pixel dimension.", required: false },
  { name: "count", type: "number", defaultValue: "1", description: "Renders sequential stacked blocks with automatic last-line taper.", required: false },
  { name: "animated", type: "boolean", defaultValue: "true", description: "Enables directional shimmer sweep unless reduced motion is active.", required: false },
  { name: "SkeletonText", type: "{ lines, animated }", defaultValue: "lines = 3", description: "Multi-line paragraph placeholder with staggered widths.", required: false },
  { name: "SkeletonTable", type: "{ rows, columns, animated }", defaultValue: "4 x 3", description: "Structured data table placeholder with header and rows.", required: false },
  { name: "SkeletonMetricCard", type: "{ animated }", defaultValue: "true", description: "Dashboard KPI card placeholder matching StatCard layout.", required: false },
];

export function SkeletonSection() {
  return (
    <section id="skeletons" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which skeleton"
        items={[
          { label: "Skeleton", description: "Matching avatar circles, buttons, and media containers to eliminate cumulative layout shift." },
          { label: "SkeletonText", description: "Multi-line article bodies, release summaries, and comment paragraphs." },
          { label: "SkeletonTable", description: "Paginated tables and audit logs while server queries resolve." },
          { label: "SkeletonMetricCard", description: "KPI dashboard tiles before telemetry figures arrive." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={SkeletonPlayground}
          componentName="Skeleton"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["rect", "circle", "line"],
              defaultValue: "rect",
              description: "Placeholder geometry shape",
            },
            {
              name: "count",
              type: "number",
              defaultValue: 1,
              description: "Number of stacked blocks",
            },
            {
              name: "animated",
              type: "boolean",
              defaultValue: true,
              description: "Directional shimmer sweep",
            },
            {
              name: "width",
              type: "text",
              defaultValue: "100%",
              description: "CSS width or numeric pixels",
            },
            {
              name: "height",
              type: "text",
              defaultValue: "40px",
              description: "CSS height or numeric pixels",
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

      <PropsTable propsData={skeletonPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Decorative Hiding:</strong> Individual skeleton blocks set <code className="text-primary font-mono text-[10px]">aria-hidden="true"</code> so assistive tech skips decorative bars.</li>
          <li><strong>Busy Container Region:</strong> Pair skeleton regions with <code className="text-primary font-mono text-[10px]">aria-busy="true"</code> on the enclosing container until resolved data replaces them.</li>
          <li><strong>Reduced Motion:</strong> Shimmer sweeps automatically halt when <code className="text-primary font-mono text-[10px]">prefers-reduced-motion</code> is active.</li>
        </ul>
      </div>
    </section>
  );
}
