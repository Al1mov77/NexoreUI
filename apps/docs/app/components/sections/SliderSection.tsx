"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { Slider, RangeSliderInput, Button } from "nexoreui";

const variants = [
  {
    name: "Default Slider",
    component: <Slider className="w-[60%]" />,
    code: `import { Slider } from "nexoreui"\n\n<Slider />`
  },
  {
    name: "Range Slider",
    component: <RangeSliderInput className="w-[60%]" />,
    code: `import { RangeSliderInput } from "nexoreui"\n\n<RangeSliderInput />`
  },
  {
    name: "Step Slider",
    component: <Slider className="w-[60%]" step={10} showValue />,
    code: `<Slider step={10} showValue />`
  },
  {
    name: "Disabled Slider",
    component: <Slider className="w-[60%]" disabled />,
    code: `<Slider disabled />`
  },
  {
    name: "Vertical Slider",
    component: <div className="h-[150px] flex items-center justify-center"><Slider orientation="vertical" className="h-full" /></div>,
    code: `<Slider orientation="vertical" className="h-[150px]" />`
  },
  {
    name: "Slider with Label",
    component: <div className="w-[60%] space-y-3"><div className="flex justify-between"><span className="text-sm font-medium">Volume</span><span className="text-sm text-muted-foreground">75%</span></div><Slider value={75} /></div>,
    code: `<div className="space-y-3">\n  <div className="flex justify-between">\n    <span>Volume</span>\n    <span>75%</span>\n  </div>\n  <Slider value={75} />\n</div>`
  },
  {
    name: "Colored Slider",
    component: <Slider className="w-[60%] [&_[role=slider]]:bg-red-500 [&>span>span]:bg-red-500" />,
    code: `<Slider className="[&_[role=slider]]:bg-red-500 [&>span>span]:bg-red-500" />`
  },
  {
    name: "Thick Slider",
    component: <Slider className="w-[60%] [&>span]:h-4 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6" />,
    code: `<Slider className="[&>span]:h-4 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6" />`
  },
  {
    name: "Discrete Slider (with marks)",
    component: <div className="w-[60%] relative"><Slider /><div className="flex justify-between mt-2 text-xs text-muted-foreground"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div></div>,
    code: `<div>\n  <Slider />\n  <div className="flex justify-between mt-2 text-xs">\n    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>\n  </div>\n</div>`
  },
  {
    name: "Volume Control Example",
    component: <div className="flex items-center gap-4 w-[60%]"><span className="text-xl">🔈</span><Slider className="flex-1" /><span className="text-xl">🔊</span></div>,
    code: `<div className="flex items-center gap-4">\n  <span>🔈</span>\n  <Slider className="flex-1" />\n  <span>🔊</span>\n</div>`
  }
];

const sliderPropsData = [
  { name: "min", type: "number", defaultValue: "0", description: "The minimum value of the slider.", required: false },
  { name: "max", type: "number", defaultValue: "100", description: "The maximum value of the slider.", required: false },
  { name: "step", type: "number", defaultValue: "1", description: "The step value increment.", required: false },
  { name: "value", type: "number", defaultValue: "0", description: "The current value of the slider.", required: false },
  { name: "onChange", type: "(value: number) => void", defaultValue: "—", description: "Callback function called when the value changes.", required: false },
  { name: "showValue", type: "boolean", defaultValue: "false", description: "Whether to show the current value above the slider.", required: false },
  { name: "variant", type: '"default" | "success" | "warning" | "error"', defaultValue: '"default"', description: "The visual style variant.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

const rangeSliderPropsData = [
  { name: "defaultValue", type: "number[]", defaultValue: "[20, 80]", description: "The default initial range values.", required: false },
  { name: "min", type: "number", defaultValue: "0", description: "The minimum range value.", required: false },
  { name: "max", type: "number", defaultValue: "100", description: "The maximum range value.", required: false },
  { name: "step", type: "number", defaultValue: "1", description: "The step increment.", required: false },
  { name: "onChange", type: "(value: number[]) => void", defaultValue: "—", description: "Callback function called when values change.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

export function SliderSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="sliders" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sliders</h2>
          <p className="text-muted-foreground mt-1">Input component to select a single value or range from a scale.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["default slider", "Selecting a single value within a defined range (volume control, brightness, zoom percentage)"],
            ["range slider", "Selecting a sub-range with two handles (price range filters, date range bounds)"],
            ["discrete slider", "Selecting values with specific, constrained increments (rating scales, clothing sizes 1-5)"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={Slider}
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
              defaultValue: false,
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
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6">
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

      {/* Props Reference Tables */}
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

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Support:</strong> Fully keyboard navigable. Use <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Right Arrow</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Up Arrow</kbd> to increment, and <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Left Arrow</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Down Arrow</kbd> to decrement.</li>
          <li><strong>ARIA Roles:</strong> Automatically maps to <code className="text-primary font-mono text-[10px]">role="slider"</code> with correct <code className="text-primary font-mono text-[10px]">aria-valuemin</code>, <code className="text-primary font-mono text-[10px]">aria-valuemax</code>, and <code className="text-primary font-mono text-[10px]">aria-valuenow</code> attributes.</li>
        </ul>
      </div>
    </section>
  );
}
