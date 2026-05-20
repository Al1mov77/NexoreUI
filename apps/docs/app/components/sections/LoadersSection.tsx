"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { Loader, WifiLoader, HourglassLoader, HeartbeatLoader, BoxLoader, BouncingBalls, GlowRingLoader, LineScaleLoader, ClockLoader, BatteryLoader, SquareSpinLoader, Button } from "nexoreui";

const variants = [
  {
    name: "Wifi Loader",
    component: <WifiLoader />,
    code: `import { WifiLoader } from "nexoreui"\n\n<WifiLoader />`
  },
  {
    name: "Hourglass Loader",
    component: <HourglassLoader />,
    code: `import { HourglassLoader } from "nexoreui"\n\n<HourglassLoader />`
  },
  {
    name: "Heartbeat Loader",
    component: <HeartbeatLoader />,
    code: `import { HeartbeatLoader } from "nexoreui"\n\n<HeartbeatLoader />`
  },
  {
    name: "Box Loader",
    component: <BoxLoader />,
    code: `import { BoxLoader } from "nexoreui"\n\n<BoxLoader />`
  },
  {
    name: "Bouncing Balls",
    component: <BouncingBalls />,
    code: `import { BouncingBalls } from "nexoreui"\n\n<BouncingBalls />`
  },
  {
    name: "Glow Ring Loader",
    component: <GlowRingLoader />,
    code: `import { GlowRingLoader } from "nexoreui"\n\n<GlowRingLoader />`
  },
  {
    name: "Line Scale Loader",
    component: <LineScaleLoader />,
    code: `import { LineScaleLoader } from "nexoreui"\n\n<LineScaleLoader />`
  },
  {
    name: "Clock Loader",
    component: <ClockLoader />,
    code: `import { ClockLoader } from "nexoreui"\n\n<ClockLoader />`
  },
  {
    name: "Battery Loader",
    component: <BatteryLoader />,
    code: `import { BatteryLoader } from "nexoreui"\n\n<BatteryLoader />`
  },
  {
    name: "Square Spin Loader",
    component: <SquareSpinLoader />,
    code: `import { SquareSpinLoader } from "nexoreui"\n\n<SquareSpinLoader />`
  }
];

export function LoadersSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="loaders" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Loaders & Spinners</h2>
          <p className="text-muted-foreground">Animated loading indicators for async operations.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={Loader}
          componentName="Loader"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["dots", "ring", "bars", "pulse"],
              defaultValue: "dots",
              description: "The visual style variant of the loader indicator"
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg"],
              defaultValue: "md",
              description: "Size scale multiplier of the loader component"
            },
            {
              name: "color",
              type: "color",
              defaultValue: "#6366f1",
              description: "Dynamic color tint for the active spinner elements"
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
