"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { BoxReveal, Button } from "nexoreui";

const variants = [
  {
    name: "Default Box Reveal",
    component: (
      <div className="flex flex-col items-center justify-center space-y-4">
        <BoxReveal boxColor="#5046e6" duration={0.5}>
          <p className="text-[3.5rem] font-semibold">
            NexoreUI<span className="text-[#5046e6]">.</span>
          </p>
        </BoxReveal>
        <BoxReveal boxColor="#5046e6" duration={0.5}>
          <h2 className="mt-[.5rem] text-[1rem]">
            A comprehensive UI component library.
          </h2>
        </BoxReveal>
      </div>
    ),
    code: `import { BoxReveal } from "nexoreui"\n\n<BoxReveal boxColor="#5046e6" duration={0.5}>\n  <p className="text-[3.5rem] font-semibold">\n    NexoreUI<span className="text-[#5046e6]">.</span>\n  </p>\n</BoxReveal>`
  }
];

export function BoxRevealSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="box-reveal" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Box Reveal</h2>
          <p className="text-muted-foreground">Reveal text with a sliding box animation.</p>
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
