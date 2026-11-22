"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Progress,
  CircularProgressCard,
  StackedProgress,
  Button,
  type ProgressProps,
} from "nexoreui";

function ProgressPlayground(props: ProgressProps) {
  return (
    <div className="w-full max-w-md">
      <Progress {...props} />
    </div>
  );
}

function InteractiveDeterminateDemo() {
  const [value, setValue] = useState(45);

  return (
    <div className="w-full max-w-md space-y-4">
      <Progress value={value} showLabel progressLabel="Bundle upload" />
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue((v) => Math.max(0, v - 15))}
        >
          -15%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue((v) => Math.min(100, v + 15))}
        >
          +15%
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setValue(45)}>
          Reset
        </Button>
      </div>
    </div>
  );
}

const variants = [
  {
    name: "Interactive Determinate Progress",
    description: "Steppable linear progress bar with tabular percentage readout and keyboard-accessible controls.",
    component: <InteractiveDeterminateDemo />,
    code: `import { useState } from "react";
import { Progress, Button } from "nexoreui";

export default function InteractiveProgressDemo() {
  const [value, setValue] = useState(45);

  return (
    <div className="w-full max-w-md space-y-4">
      <Progress value={value} showLabel progressLabel="Bundle upload" />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setValue((v) => Math.max(0, v - 15))}>
          -15%
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue((v) => Math.min(100, v + 15))}>
          +15%
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setValue(45)}>
          Reset
        </Button>
      </div>
    </div>
  );
}`,
  },
  {
    name: "Semantic Status & Quota Thresholds",
    description: "Custom formatValue callbacks paired with success, info, warning, and error status tokens.",
    component: (
      <div className="w-full max-w-md space-y-3.5">
        <Progress
          value={82}
          variant="success"
          showLabel
          progressLabel="Edge Cache Hit"
          formatValue={(v) => `${v}% hit`}
        />
        <Progress
          value={64}
          variant="info"
          showLabel
          progressLabel="Build Minutes"
          formatValue={(v) => `${v} / 100 min`}
        />
        <Progress
          value={88}
          variant="warning"
          showLabel
          progressLabel="Storage Quota"
          formatValue={(v) => `${v} GB`}
        />
        <Progress
          value={96}
          variant="error"
          showLabel
          progressLabel="Memory Pressure"
        />
      </div>
    ),
    code: `import { Progress } from "nexoreui";

export default function SemanticProgressDemo() {
  return (
    <div className="w-full max-w-md space-y-3.5">
      <Progress value={82} variant="success" showLabel progressLabel="Edge Cache Hit" formatValue={(v) => \`\${v}% hit\`} />
      <Progress value={64} variant="info" showLabel progressLabel="Build Minutes" formatValue={(v) => \`\${v} / 100 min\`} />
      <Progress value={88} variant="warning" showLabel progressLabel="Storage Quota" formatValue={(v) => \`\${v} GB\`} />
      <Progress value={96} variant="error" showLabel progressLabel="Memory Pressure" />
    </div>
  );
}`,
  },
  {
    name: "Segmented Pipeline Progress",
    description: "Discrete stepped track cells useful for batch jobs, multi-region rollouts, and build stages.",
    component: (
      <div className="w-full max-w-md space-y-3">
        <Progress
          value={67}
          segments={6}
          showLabel
          progressLabel="Regional rollout"
          formatValue={() => "4 / 6 regions"}
        />
        <Progress
          value={100}
          segments={6}
          variant="success"
          size="sm"
          showLabel
          progressLabel="Verification checks"
          formatValue={() => "6 / 6 passed"}
        />
      </div>
    ),
    code: `import { Progress } from "nexoreui";

export default function SegmentedProgressDemo() {
  return (
    <div className="w-full max-w-md space-y-3">
      <Progress
        value={67}
        segments={6}
        showLabel
        progressLabel="Regional rollout"
        formatValue={() => "4 / 6 regions"}
      />
      <Progress
        value={100}
        segments={6}
        variant="success"
        size="sm"
        showLabel
        progressLabel="Verification checks"
        formatValue={() => "6 / 6 passed"}
      />
    </div>
  );
}`,
  },
  {
    name: "Indeterminate Activity Track",
    description: "Smooth shuttle progress track for unknown-duration tasks, halting cleanly under reduced motion.",
    component: (
      <div className="w-full max-w-md space-y-3">
        <Progress isIndeterminate showLabel progressLabel="Indexing repository symbols..." />
        <Progress isIndeterminate size="sm" variant="info" />
      </div>
    ),
    code: `import { Progress } from "nexoreui";

export default function IndeterminateProgressDemo() {
  return (
    <div className="w-full max-w-md space-y-3">
      <Progress isIndeterminate showLabel progressLabel="Indexing repository symbols..." />
      <Progress isIndeterminate size="sm" variant="info" />
    </div>
  );
}`,
  },
  {
    name: "Circular Progress Cards",
    description: "Compact radial gauges with tabular center readouts and semantic threshold tones.",
    component: (
      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
        <CircularProgressCard
          value={78}
          title="Build Quota"
          subtitle="780 / 1,000 runs"
          variant="default"
        />
        <CircularProgressCard
          value={94}
          title="Cache Efficiency"
          subtitle="eu-central-1"
          variant="success"
        />
      </div>
    ),
    code: `import { CircularProgressCard } from "nexoreui";

export default function CircularProgressDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <CircularProgressCard value={78} title="Build Quota" subtitle="780 / 1,000 runs" variant="default" />
      <CircularProgressCard value={94} title="Cache Efficiency" subtitle="eu-central-1" variant="success" />
    </div>
  );
}`,
  },
  {
    name: "Multi-Segment Allocation",
    description: "StackedProgress breaks total capacity down by artifact category with matching semantic legend.",
    component: (
      <div className="w-full max-w-md">
        <StackedProgress
          title="Workspace Storage"
          max={100}
          unit="GB"
          segments={[
            { label: "Builds", value: 36, tone: "primary" },
            { label: "Logs", value: 22, tone: "info" },
            { label: "Snapshots", value: 14, tone: "warning" },
            { label: "Cache", value: 10, tone: "success" },
          ]}
        />
      </div>
    ),
    code: `import { StackedProgress } from "nexoreui";

export default function StackedProgressDemo() {
  return (
    <div className="w-full max-w-md">
      <StackedProgress
        title="Workspace Storage"
        max={100}
        unit="GB"
        segments={[
          { label: "Builds", value: 36, tone: "primary" },
          { label: "Logs", value: 22, tone: "info" },
          { label: "Snapshots", value: 14, tone: "warning" },
          { label: "Cache", value: 10, tone: "success" },
        ]}
      />
    </div>
  );
}`,
  },
];

const progressPropsData = [
  { name: "value", type: "number", defaultValue: "0", description: "Current numeric value bounded between 0 and max.", required: false },
  { name: "max", type: "number", defaultValue: "100", description: "Upper bound representing 100% completion.", required: false },
  { name: "variant", type: '"default" | "success" | "warning" | "error" | "info"', defaultValue: '"default"', description: "Semantic fill token applied to the indicator.", required: false },
  { name: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"', description: "Track thickness preset.", required: false },
  { name: "segments", type: "number", defaultValue: "-", description: "Renders discrete stepped cells instead of a continuous bar.", required: false },
  { name: "showLabel", type: "boolean", defaultValue: "false", description: "Displays the progressLabel and tabular readout above the track.", required: false },
  { name: "progressLabel", type: "string", defaultValue: '"Progress"', description: "Accessible label and visual header text.", required: false },
  { name: "isIndeterminate", type: "boolean", defaultValue: "false", description: "Switches to an animated activity shuttle when duration is unknown.", required: false },
  { name: "StackedProgress", type: "{ segments, max, unit, title }", defaultValue: "-", description: "Multi-category allocation bar with tabular legend.", required: false },
];

export function ProgressSection() {
  return (
    <section id="progress" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which progress indicator"
        items={[
          { label: "Progress (determinate)", description: "Known duration tasks such as file uploads, quota usage, or multi-step installers." },
          { label: "segments", description: "Discrete stages like regional rollouts or pipeline checks with fixed step counts." },
          { label: "isIndeterminate", description: "Background jobs with unknown duration where immediate liveness feedback matters." },
          { label: "CircularProgressCard", description: "Compact KPI cards highlighting build quotas, cache ratios, or CPU utilization." },
          { label: "StackedProgress", description: "Capacity breakdowns across multiple resource categories within a single budget." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={ProgressPlayground}
          componentName="Progress"
          importFrom="nexoreui"
          controls={[
            {
              name: "value",
              type: "number",
              defaultValue: 62,
              description: "Current completion percentage (0-100)",
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "success", "info", "warning", "error"],
              defaultValue: "default",
              description: "Semantic indicator fill tone",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "default", "lg"],
              defaultValue: "default",
              description: "Track height preset",
            },
            {
              name: "showLabel",
              type: "boolean",
              defaultValue: true,
              description: "Displays header label and tabular readout",
            },
            {
              name: "progressLabel",
              type: "text",
              defaultValue: "Deployment progress",
              description: "Text label above the track",
            },
            {
              name: "isIndeterminate",
              type: "boolean",
              defaultValue: false,
              description: "Toggles indeterminate shuttle mode",
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

      <PropsTable propsData={progressPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Progressbar Role:</strong> Linear, segmented, and circular progress indicators all expose <code className="text-primary font-mono text-[10px]">role="progressbar"</code> with <code className="text-primary font-mono text-[10px]">aria-valuenow</code>, <code className="text-primary font-mono text-[10px]">aria-valuemin</code>, and <code className="text-primary font-mono text-[10px]">aria-valuemax</code>.</li>
          <li><strong>Indeterminate Semantics:</strong> Omits <code className="text-primary font-mono text-[10px]">aria-valuenow</code> during indeterminate activity so screen readers announce an ongoing task without stale percentages.</li>
          <li><strong>Reduced Motion:</strong> Disables continuous shuttle animation and smooth stroke transitions when <code className="text-primary font-mono text-[10px]">prefers-reduced-motion</code> is enabled.</li>
        </ul>
      </div>
    </section>
  );
}
