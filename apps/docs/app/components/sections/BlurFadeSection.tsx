"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { BlurFade, Button } from "nexoreui";

const variants = [
  {
    name: "Default Blur Fade",
    component: (
      <BlurFade delay={0.25} inView>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
          Hello World
        </h2>
      </BlurFade>
    ),
    code: `import { BlurFade } from "nexoreui"\n\n<BlurFade delay={0.25} inView>\n  <h2 className="text-3xl font-bold">\n    Hello World\n  </h2>\n</BlurFade>`
  },
  {
    name: "Blur Fade Image Gallery",
    component: (
      <div className="columns-2 gap-4 sm:columns-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlurFade key={i} delay={0.25 + i * 0.05} inView>
            <div className="mb-4 rounded-lg bg-muted object-cover aspect-square flex items-center justify-center">
              Image {i + 1}
            </div>
          </BlurFade>
        ))}
      </div>
    ),
    code: `import { BlurFade } from "nexoreui"\n\n<div className="columns-2 gap-4">\n  {images.map((img, i) => (\n    <BlurFade key={i} delay={0.25 + i * 0.05} inView>\n      <img src={img} alt="Gallery" className="rounded-lg" />\n    </BlurFade>\n  ))}\n</div>`
  }
];

export function BlurFadeSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="blur-fade" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blur Fade</h2>
          <p className="text-muted-foreground">Fade in elements with a blur effect as they enter the viewport.</p>
        </div>
      </div>
      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-6 relative">
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
