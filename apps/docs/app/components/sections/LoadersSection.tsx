"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { WifiLoader, HourglassLoader, HeartbeatLoader, BoxLoader, BouncingBalls, GlowRingLoader, LineScaleLoader, ClockLoader, BatteryLoader, SquareSpinLoader, Button } from "nexoreui";

const variants = [
  {
    name: "Wifi Loader",
    component: <WifiLoader color="primary" size="md" />,
    code: `import { WifiLoader } from "nexoreui"\n\n<WifiLoader color="primary" size="md" />`
  },
  {
    name: "Hourglass Loader",
    component: <HourglassLoader color="secondary" size="lg" />,
    code: `import { HourglassLoader } from "nexoreui"\n\n<HourglassLoader color="secondary" size="lg" />`
  },
  {
    name: "Heartbeat Loader",
    component: <HeartbeatLoader color="danger" size="md" />,
    code: `import { HeartbeatLoader } from "nexoreui"\n\n<HeartbeatLoader color="danger" size="md" />`
  },
  {
    name: "Box Loader",
    component: <BoxLoader color="primary" size="md" />,
    code: `import { BoxLoader } from "nexoreui"\n\n<BoxLoader color="primary" size="md" />`
  },
  {
    name: "Bouncing Balls",
    component: <BouncingBalls color="primary" size="md" />,
    code: `import { BouncingBalls } from "nexoreui"\n\n<BouncingBalls color="primary" size="md" />`
  },
  {
    name: "Glow Ring Loader",
    component: <GlowRingLoader color="success" size="lg" />,
    code: `import { GlowRingLoader } from "nexoreui"\n\n<GlowRingLoader color="success" size="lg" />`
  },
  {
    name: "Line Scale Loader",
    component: <LineScaleLoader color="primary" size="md" />,
    code: `import { LineScaleLoader } from "nexoreui"\n\n<LineScaleLoader color="primary" size="md" />`
  },
  {
    name: "Clock Loader",
    component: <ClockLoader color="muted" size="md" />,
    code: `import { ClockLoader } from "nexoreui"\n\n<ClockLoader color="muted" size="md" />`
  },
  {
    name: "Battery Loader",
    component: <BatteryLoader color="success" size="md" />,
    code: `import { BatteryLoader } from "nexoreui"\n\n<BatteryLoader color="success" size="md" />`
  },
  {
    name: "Square Spin Loader",
    component: <SquareSpinLoader color="warning" size="md" />,
    code: `import { SquareSpinLoader } from "nexoreui"\n\n<SquareSpinLoader color="warning" size="md" />`
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
