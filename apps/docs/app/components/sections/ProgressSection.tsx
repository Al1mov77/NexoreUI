"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Progress, ProgressRing, CircularProgressCard, MultiStepProgress, Button } from "nexoreui";

const variants = [
  {
    name: "Default Progress",
    component: <Progress value={33} className="w-[60%]" />,
    code: `import { Progress } from "nexoreui"\n\n<Progress value={33} />`
  },
  {
    name: "Indeterminate Progress",
    component: <Progress className="w-[60%]" isIndeterminate />,
    code: `import { Progress } from "nexoreui"\n\n<Progress isIndeterminate />`
  },
  {
    name: "Progress Ring",
    component: <ProgressRing value={65} size={80} strokeWidth={8} />,
    code: `import { ProgressRing } from "nexoreui"\n\n<ProgressRing value={65} size={80} strokeWidth={8} />`
  },
  {
    name: "Circular Progress Card",
    component: <CircularProgressCard title="Storage Used" value={82} max={100} unit="GB" />,
    code: `import { CircularProgressCard } from "nexoreui"\n\n<CircularProgressCard \n  title="Storage Used" \n  value={82} \n  max={100} \n  unit="GB" \n/>`
  },
  {
    name: "Multi-step Progress",
    component: <MultiStepProgress steps={4} currentStep={2} />,
    code: `import { MultiStepProgress } from "nexoreui"\n\n<MultiStepProgress steps={4} currentStep={2} />`
  },
  {
    name: "Colored Progress",
    component: <Progress value={50} className="w-[60%] [&>div]:bg-green-500" />,
    code: `<Progress value={50} className="[&>div]:bg-green-500" />`
  },
  {
    name: "Thick Progress",
    component: <Progress value={75} className="w-[60%] h-4" />,
    code: `<Progress value={75} className="h-4" />`
  },
  {
    name: "Progress with Label",
    component: <div className="w-[60%] space-y-1"><div className="flex justify-between text-sm"><span className="font-medium">Downloading...</span><span className="text-muted-foreground">45%</span></div><Progress value={45} /></div>,
    code: `<div className="space-y-1">\n  <div className="flex justify-between text-sm">\n    <span className="font-medium">Downloading...</span>\n    <span className="text-muted-foreground">45%</span>\n  </div>\n  <Progress value={45} />\n</div>`
  },
  {
    name: "Animated Progress Ring",
    component: <ProgressRing value={90} size={80} animated />,
    code: `<ProgressRing value={90} size={80} animated />`
  },
  {
    name: "Gradient Progress",
    component: <Progress value={60} className="w-[60%] [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500" />,
    code: `<Progress value={60} className="[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500" />`
  }
];

export function ProgressSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="progress" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Progress</h2>
          <p className="text-muted-foreground">Indicators for loading and completion status.</p>
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
