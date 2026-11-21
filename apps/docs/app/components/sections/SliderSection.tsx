"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import { Volume1, Volume2 } from "lucide-react";
import { Slider, RangeSliderInput, Button } from "nexoreui";

function RangeFilterDemo() {
  const [range, setRange] = useState<number[]>([25, 75]);
  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Price filter</span>
        <span className="font-mono text-muted-foreground tabular-nums">
          ${range[0]} – ${range[1]}
        </span>
      </div>
      <RangeSliderInput value={range} min={0} max={200} step={5} onChange={setRange} />
    </div>
  );
}

function VolumeControlDemo() {
  const [volume, setVolume] = useState(70);
  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Output gain</span>
        <span className="font-mono text-muted-foreground tabular-nums">{volume}%</span>
      </div>
      <div className="flex items-center gap-3">
        <Volume1 className="h-4 w-4 text-muted-foreground shrink-0" />
        <Slider
          value={volume}
          min={0}
          max={100}
          onChange={setVolume}
          aria-label="Output volume"
          className="flex-1"
        />
        <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </div>
  );
}

function EqualizerDemo() {
  const [low, setLow] = useState(65);
  const [mid, setMid] = useState(48);
  const [high, setHigh] = useState(78);

  return (
    <div className="flex items-end justify-center gap-8 h-48 py-2">
      <div className="flex flex-col items-center gap-2 h-full">
        <div className="flex-1">
          <Slider orientation="vertical" value={low} onChange={setLow} aria-label="Low frequency" />
        </div>
        <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
          60Hz · {low}
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 h-full">
        <div className="flex-1">
          <Slider orientation="vertical" value={mid} onChange={setMid} aria-label="Mid frequency" />
        </div>
        <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
          1kHz · {mid}
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 h-full">
        <div className="flex-1">
          <Slider orientation="vertical" value={high} onChange={setHigh} aria-label="High frequency" />
        </div>
        <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
          12kHz · {high}
        </span>
      </div>
    </div>
  );
}

const variants = [
  {
    name: "Default Slider",
    component: (
      <div className="w-full max-w-md">
        <Slider defaultValue={50} label="Memory allocation" showValue valueSuffix="%" />
      </div>
    ),
    code: `import { Slider } from "nexoreui";

export default function DefaultSliderDemo() {
  return (
    <div className="w-full max-w-md">
      <Slider
        defaultValue={50}
        label="Memory allocation"
        showValue
        valueSuffix="%"
      />
    </div>
  );
}`
  },
  {
    name: "Dual-Thumb Range Filter",
    component: <RangeFilterDemo />,
    code: `import { useState } from "react";
import { RangeSliderInput } from "nexoreui";

export default function PriceRangeSliderDemo() {
  const [range, setRange] = useState<number[]>([25, 75]);

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Price filter</span>
        <span className="font-mono text-muted-foreground tabular-nums">
          \${range[0]} – \${range[1]}
        </span>
      </div>
      <RangeSliderInput
        value={range}
        min={0}
        max={200}
        step={5}
        onChange={setRange}
      />
    </div>
  );
}`
  },
  {
    name: "Discrete Steps with Scale Marks",
    component: (
      <div className="w-full max-w-md space-y-2">
        <Slider step={25} defaultValue={50} showValue label="Sampling rate" valueSuffix="%" />
        <div className="flex justify-between text-[11px] font-mono text-muted-foreground tabular-nums">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
    ),
    code: `import { Slider } from "nexoreui";

export default function StepMarksSliderDemo() {
  return (
    <div className="w-full max-w-md space-y-2">
      <Slider
        step={25}
        defaultValue={50}
        showValue
        label="Sampling rate"
        valueSuffix="%"
      />
      <div className="flex justify-between text-[11px] font-mono text-muted-foreground tabular-nums">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}`
  },
  {
    name: "Interactive Audio Volume Control",
    component: <VolumeControlDemo />,
    code: `import { useState } from "react";
import { Slider } from "nexoreui";
import { Volume1, Volume2 } from "lucide-react";

export default function VolumeSliderDemo() {
  const [volume, setVolume] = useState(70);

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Output gain</span>
        <span className="font-mono text-muted-foreground tabular-nums">{volume}%</span>
      </div>
      <div className="flex items-center gap-3">
        <Volume1 className="h-4 w-4 text-muted-foreground shrink-0" />
        <Slider
          value={volume}
          min={0}
          max={100}
          onChange={setVolume}
          aria-label="Output volume"
          className="flex-1"
        />
        <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </div>
  );
}`
  },
  {
    name: "Vertical 3-Band Equalizer",
    component: <EqualizerDemo />,
    code: `import { useState } from "react";
import { Slider } from "nexoreui";

export default function VerticalEqualizerDemo() {
  const [low, setLow] = useState(65);
  const [mid, setMid] = useState(48);
  const [high, setHigh] = useState(78);

  return (
    <div className="flex items-end justify-center gap-8 h-48 py-2">
      <div className="flex flex-col items-center gap-2 h-full">
        <div className="flex-1">
          <Slider orientation="vertical" value={low} onChange={setLow} aria-label="Low frequency" />
        </div>
        <span className="text-[11px] font-mono text-muted-foreground tabular-nums">60Hz · {low}</span>
      </div>
      <div className="flex flex-col items-center gap-2 h-full">
        <div className="flex-1">
          <Slider orientation="vertical" value={mid} onChange={setMid} aria-label="Mid frequency" />
        </div>
        <span className="text-[11px] font-mono text-muted-foreground tabular-nums">1kHz · {mid}</span>
      </div>
      <div className="flex flex-col items-center gap-2 h-full">
        <div className="flex-1">
          <Slider orientation="vertical" value={high} onChange={setHigh} aria-label="High frequency" />
        </div>
        <span className="text-[11px] font-mono text-muted-foreground tabular-nums">12kHz · {high}</span>
      </div>
    </div>
  );
}`
  },
  {
    name: "Semantic Status & Disabled States",
    component: (
      <div className="w-full max-w-md space-y-4">
        <Slider variant="success" defaultValue={82} label="Throughput target" showValue valueSuffix="%" />
        <Slider variant="warning" defaultValue={64} label="Memory threshold" showValue valueSuffix="%" />
        <Slider variant="error" defaultValue={92} label="CPU ceiling" showValue valueSuffix="%" />
        <Slider disabled defaultValue={40} label="Locked quota" showValue valueSuffix="%" />
      </div>
    ),
    code: `import { Slider } from "nexoreui";

export default function SemanticSlidersDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <Slider variant="success" defaultValue={82} label="Throughput target" showValue valueSuffix="%" />
      <Slider variant="warning" defaultValue={64} label="Memory threshold" showValue valueSuffix="%" />
      <Slider variant="error" defaultValue={92} label="CPU ceiling" showValue valueSuffix="%" />
      <Slider disabled defaultValue={40} label="Locked quota" showValue valueSuffix="%" />
    </div>
  );
}`
  }
];

const sliderPropsData = [
  { name: "min", type: "number", defaultValue: "0", description: "The minimum value of the slider.", required: false },
  { name: "max", type: "number", defaultValue: "100", description: "The maximum value of the slider.", required: false },
  { name: "step", type: "number", defaultValue: "1", description: "The step value increment.", required: false },
  { name: "value", type: "number", defaultValue: "-", description: "Controlled numeric value of the slider.", required: false },
  { name: "defaultValue", type: "number", defaultValue: "0", description: "Initial value in uncontrolled mode.", required: false },
  { name: "onChange", type: "(value: number) => void", defaultValue: "-", description: "Callback function called when the value changes.", required: false },
  { name: "label", type: "string", defaultValue: "-", description: "Optional header label displayed above the track.", required: false },
  { name: "showValue", type: "boolean", defaultValue: "false", description: "Whether to show the current value above the slider.", required: false },
  { name: "valueSuffix", type: "string", defaultValue: '""', description: "Unit suffix appended to the displayed value (e.g. '%').", required: false },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Axis along which the thumb moves.", required: false },
  { name: "variant", type: '"default" | "success" | "warning" | "error"', defaultValue: '"default"', description: "The semantic track and thumb color variant.", required: false },
  { name: "className", type: "string", defaultValue: "-", description: "Additional custom class names.", required: false },
];

const rangeSliderPropsData = [
  { name: "defaultValue", type: "number[]", defaultValue: "[20, 80]", description: "The default initial range values.", required: false },
  { name: "value", type: "number[]", defaultValue: "-", description: "Controlled [min, max] range tuple.", required: false },
  { name: "min", type: "number", defaultValue: "0", description: "The minimum range value.", required: false },
  { name: "max", type: "number", defaultValue: "100", description: "The maximum range value.", required: false },
  { name: "step", type: "number", defaultValue: "1", description: "The step increment.", required: false },
  { name: "onChange", type: "(value: number[]) => void", defaultValue: "-", description: "Callback function called when values change.", required: false },
  { name: "className", type: "string", defaultValue: "-", description: "Additional custom class names.", required: false },
];

export function SliderSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="sliders" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Slider</h2>
        <p className="text-muted-foreground mt-1">
          Input control for selecting a single numeric value or bounded range from a scale.
        </p>
      </div>

      <WhenToUse
        items={[
          { label: "default slider", description: "Adjusting a single continuous value such as volume, zoom percentage, or opacity." },
          { label: "range slider", description: "Filtering bounded minimum and maximum intervals like price caps or latency windows." },
          { label: "discrete steps", description: "Constraining selection to fixed increments such as 25% sampling rates or 1–5 tiers." },
          { label: "vertical mixer", description: "Audio channel faders and multi-band equalizer strips where vertical travel mirrors gain." },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => (
            <div className="w-full max-w-sm">
              <Slider {...props} />
            </div>
          )}
          componentName="Slider"
          importFrom="nexoreui"
          controls={[
            {
              name: "value",
              type: "number",
              defaultValue: 50,
              description: "Current position of the slider thumb"
            },
            {
              name: "min",
              type: "number",
              defaultValue: 0,
              description: "Minimum allowed value"
            },
            {
              name: "max",
              type: "number",
              defaultValue: 100,
              description: "Maximum allowed value"
            },
            {
              name: "step",
              type: "number",
              defaultValue: 1,
              description: "Step increment between values"
            },
            {
              name: "showValue",
              type: "boolean",
              defaultValue: true,
              description: "Whether to render current value label"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4">Slider Props</h3>
          <PropsTable propsData={sliderPropsData} />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4">RangeSliderInput Props</h3>
          <PropsTable propsData={rangeSliderPropsData} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Support:</strong> Fully keyboard navigable. Use <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Right Arrow</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Up Arrow</kbd> to increment, and <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Left Arrow</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Down Arrow</kbd> to decrement.</li>
          <li><strong>ARIA Roles:</strong> Automatically maps to <code className="text-primary font-mono text-[10px]">role="slider"</code> with <code className="text-primary font-mono text-[10px]">aria-valuemin</code>, <code className="text-primary font-mono text-[10px]">aria-valuemax</code>, and <code className="text-primary font-mono text-[10px]">aria-valuenow</code> attributes.</li>
        </ul>
      </div>
    </section>
  );
}
