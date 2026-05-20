"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
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
    component: <Slider className="w-[60%]" />,
    code: `<Slider />`
  },
  {
    name: "Disabled Slider",
    component: <Slider className="w-[60%]" />,
    code: `<Slider disabled />`
  },
  {
    name: "Vertical Slider",
    component: <Slider className="h-[150px]" />,
    code: `<Slider orientation="vertical" />`
  },
  {
    name: "Slider with Label",
    component: <div className="w-[60%] space-y-3"><div className="flex justify-between"><span className="text-sm font-medium">Volume</span><span className="text-sm text-muted-foreground">75%</span></div><Slider /></div>,
    code: `<div className="space-y-3">\n  <div className="flex justify-between">\n    <span>Volume</span>\n    <span>75%</span>\n  </div>\n  <Slider />\n</div>`
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

export function SliderSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="sliders" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sliders</h2>
          <p className="text-muted-foreground">Input component to select a value from a range.</p>
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
              name: "disabled",
              type: "boolean",
              defaultValue: false,
              description: "Whether the slider is locked/disabled"
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
    </section>
  );
}
