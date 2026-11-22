"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Loader,
  MatrixLoader,
  OrbitalLoader,
  StepRailLoader,
  PipelineLoader,
  SpinnerLoader,
  DotsLoader,
  BarLoader,
  ProgressRing,
  TextLoader,
  RingLoader,
  ClockLoader,
  HourglassLoader,
  LineScaleLoader,
  SquareSpinLoader,
  PulseLoader,
  WifiLoader,
  BatteryLoader,
  BoxLoader,
  GlowRingLoader,
  CircleLoader,
  Button,
} from "nexoreui";

function PipelineInteractiveDemo() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <PipelineLoader
        paused={paused}
        stages={[
          "Resolving workspace tokens",
          "Building registry manifest",
          "Verifying edge checksums",
        ]}
      />
      <Button variant="outline" size="sm" onClick={() => setPaused((p) => !p)}>
        {paused ? "Resume sequence" : "Pause sequence"}
      </Button>
    </div>
  );
}

function InlineButtonLoadersDemo() {
  const [busyA, setBusyA] = useState(true);
  const [busyB, setBusyB] = useState(true);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        variant="default"
        size="sm"
        onClick={() => setBusyA((v) => !v)}
        className="min-w-[136px] gap-2"
      >
        {busyA && <SpinnerLoader size={14} />}
        <span>{busyA ? "Deploying..." : "Click to deploy"}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setBusyB((v) => !v)}
        className="min-w-[136px] gap-2"
      >
        {busyB && <DotsLoader size="sm" />}
        <span>{busyB ? "Syncing" : "Sync nodes"}</span>
      </Button>
    </div>
  );
}

function ProgressRingInteractiveDemo() {
  const [progress, setProgress] = useState(68);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <ProgressRing progress={progress} size={68} strokeWidth={5} />
        <TextLoader text="Compiling schema" />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setProgress((p) => Math.max(0, p - 20))}
        >
          -20%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setProgress((p) => Math.min(100, p + 20))}
        >
          +20%
        </Button>
      </div>
    </div>
  );
}

const variants = [
  {
    name: "Architectural Signature Trio",
    description: "MatrixLoader 3x3 wave sequencer, OrbitalLoader vernier gauge, and StepRailLoader shuttle track.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <MatrixLoader size="md" />
          <span className="text-[11px] font-mono text-muted-foreground">MatrixLoader</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <OrbitalLoader size="md" />
          <span className="text-[11px] font-mono text-muted-foreground">OrbitalLoader</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <StepRailLoader size="md" />
          <span className="text-[11px] font-mono text-muted-foreground">StepRailLoader</span>
        </div>
      </div>
    ),
    code: `import { MatrixLoader, OrbitalLoader, StepRailLoader } from "nexoreui";

export default function SignatureLoadersDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <MatrixLoader size="md" />
      <OrbitalLoader size="md" />
      <StepRailLoader size="md" />
    </div>
  );
}`,
  },
  {
    name: "Live Multi-Stage Pipeline",
    description: "PipelineLoader cycles through operational build stages with vertical mask transitions and tabular step counts.",
    component: <PipelineInteractiveDemo />,
    code: `import { useState } from "react";
import { PipelineLoader, Button } from "nexoreui";

export default function PipelineLoaderDemo() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <PipelineLoader
        paused={paused}
        stages={[
          "Resolving workspace tokens",
          "Building registry manifest",
          "Verifying edge checksums",
        ]}
      />
      <Button variant="outline" size="sm" onClick={() => setPaused((p) => !p)}>
        {paused ? "Resume sequence" : "Pause sequence"}
      </Button>
    </div>
  );
}`,
  },
  {
    name: "Inline Button Loading States",
    description: "Compact indicators inheriting button foreground color with automatic reduced-motion fallback.",
    component: <InlineButtonLoadersDemo />,
    code: `import { useState } from "react";
import { SpinnerLoader, DotsLoader, Button } from "nexoreui";

export default function InlineButtonLoadersDemo() {
  const [busyA, setBusyA] = useState(true);
  const [busyB, setBusyB] = useState(true);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default" size="sm" onClick={() => setBusyA((v) => !v)} className="gap-2">
        {busyA && <SpinnerLoader size={14} />}
        <span>{busyA ? "Deploying..." : "Click to deploy"}</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => setBusyB((v) => !v)} className="gap-2">
        {busyB && <DotsLoader size="sm" />}
        <span>{busyB ? "Syncing" : "Sync nodes"}</span>
      </Button>
    </div>
  );
}`,
  },
  {
    name: "Determinate Progress Ring & Mono Status",
    description: "Interactive radial ProgressRing paired with monospaced TextLoader status readout.",
    component: <ProgressRingInteractiveDemo />,
    code: `import { useState } from "react";
import { ProgressRing, TextLoader, Button } from "nexoreui";

export default function ProgressRingDemo() {
  const [progress, setProgress] = useState(68);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <ProgressRing progress={progress} size={68} strokeWidth={5} />
        <TextLoader text="Compiling schema" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setProgress((p) => Math.max(0, p - 20))}>-20%</Button>
        <Button variant="outline" size="sm" onClick={() => setProgress((p) => Math.min(100, p + 20))}>+20%</Button>
      </div>
    </div>
  );
}`,
  },
  {
    name: "Precision Geometric Utilities",
    description: "Dual-arc RingLoader, ClockLoader, HourglassLoader, LineScaleLoader, and SquareSpinLoader.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-6">
        <RingLoader size="md" />
        <ClockLoader size="md" />
        <HourglassLoader size="md" />
        <LineScaleLoader size="md" />
        <SquareSpinLoader size="md" />
      </div>
    ),
    code: `import {
  RingLoader,
  ClockLoader,
  HourglassLoader,
  LineScaleLoader,
  SquareSpinLoader,
} from "nexoreui";

export default function GeometricLoadersDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <RingLoader size="md" />
      <ClockLoader size="md" />
      <HourglassLoader size="md" />
      <LineScaleLoader size="md" />
      <SquareSpinLoader size="md" />
    </div>
  );
}`,
  },
  {
    name: "Classic Indicator Set",
    description: "PulseLoader, BarLoader, WifiLoader, BatteryLoader, BoxLoader, GlowRingLoader, and CircleLoader.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-6">
        <PulseLoader size="md" />
        <BarLoader size="md" />
        <WifiLoader size="md" />
        <BatteryLoader size="md" />
        <BoxLoader size="md" />
        <GlowRingLoader size="md" />
        <CircleLoader size={28} />
      </div>
    ),
    code: `import {
  PulseLoader,
  BarLoader,
  WifiLoader,
  BatteryLoader,
  BoxLoader,
  GlowRingLoader,
  CircleLoader,
} from "nexoreui";

export default function ClassicLoadersDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <PulseLoader size="md" />
      <BarLoader size="md" />
      <WifiLoader size="md" />
      <BatteryLoader size="md" />
      <BoxLoader size="md" />
      <GlowRingLoader size="md" />
      <CircleLoader size={28} />
    </div>
  );
}`,
  },
];

const loaderPropsData = [
  { name: "variant", type: '"matrix" | "orbital" | "step-rail" | "pipeline" | "dots" | "spinner" | "bars" | "ring" | "pulse" | "progress-ring" | ...', defaultValue: '"dots"', description: "Selects the loader indicator rendered by the unified Loader wrapper.", required: false },
  { name: "size", type: '"sm" | "md" | "lg" | number', defaultValue: '"md"', description: "Size preset or explicit pixel size.", required: false },
  { name: "color", type: "string", defaultValue: '"currentColor"', description: "Foreground stroke/fill color inherited from text color by default.", required: false },
  { name: "text", type: "string", defaultValue: '"Loading"', description: "Status label for the text loader variant.", required: false },
  { name: "progress", type: "number", defaultValue: "50", description: "Completion percentage (0-100) for progress-ring.", required: false },
  { name: "stages", type: "string[]", defaultValue: "3 default stages", description: "Sequential status messages displayed by PipelineLoader.", required: false },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pauses stage rotation on PipelineLoader.", required: false },
];

export function LoadersSection() {
  return (
    <section id="loaders" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which loader"
        items={[
          { label: "MatrixLoader / OrbitalLoader", description: "Architectural focal spinners for page transitions, sync panels, and build dashboards." },
          { label: "PipelineLoader", description: "Long-running multi-stage tasks where communicating the active phase reduces perceived wait." },
          { label: "SpinnerLoader / DotsLoader", description: "Compact inline indicators inside action buttons, form submits, and search inputs." },
          { label: "StepRailLoader", description: "Slender horizontal activity bars inside compact cards and toolbars." },
          { label: "ProgressRing", description: "Determinate circular metrics when exact percentage completion is known." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={Loader}
          componentName="Loader"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: [
                "matrix",
                "orbital",
                "step-rail",
                "pipeline",
                "dots",
                "spinner",
                "bars",
                "ring",
                "pulse",
                "wifi",
                "hourglass",
                "clock",
                "battery",
                "box",
                "square-spin",
                "text",
                "progress-ring",
              ],
              defaultValue: "matrix",
              description: "Visual style variant of the loader",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg"],
              defaultValue: "md",
              description: "Scale preset",
            },
            {
              name: "text",
              type: "text",
              defaultValue: "Syncing edges",
              description: "Message shown when variant is text",
            },
            {
              name: "progress",
              type: "number",
              defaultValue: 64,
              description: "Percentage shown when variant is progress-ring",
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

      <PropsTable propsData={loaderPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Status Semantics:</strong> Indeterminate loaders expose <code className="text-primary font-mono text-[10px]">role="status"</code> with <code className="text-primary font-mono text-[10px]">aria-label="Loading"</code>, while <code className="text-primary font-mono text-[10px]">ProgressRing</code> uses <code className="text-primary font-mono text-[10px]">role="progressbar"</code>.</li>
          <li><strong>Reduced Motion Compliance:</strong> Continuous rotations, oscillations, and pulse rings stop cleanly when <code className="text-primary font-mono text-[10px]">prefers-reduced-motion</code> is active.</li>
          <li><strong>CurrentColor Inheritance:</strong> All loaders inherit parent foreground tokens automatically for reliable contrast in light and dark themes.</li>
        </ul>
      </div>
    </section>
  );
}
