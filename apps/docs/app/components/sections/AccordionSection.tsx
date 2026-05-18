"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent, SimpleAccordion, PlusAccordion, NeonAccordion, Button, Accordion } from "nexoreui";

const variants = [
  {
    name: "Default Accordion",
    component: (
      <AccordionRoot type="single" collapsible className="w-full max-w-sm">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    ),
    code: `import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from "nexoreui"\n\n<AccordionRoot type="single" collapsible>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Is it accessible?</AccordionTrigger>\n    <AccordionContent>Yes.</AccordionContent>\n  </AccordionItem>\n</AccordionRoot>`
  },
  {
    name: "Multiple Accordion",
    component: (
      <AccordionRoot type="multiple" className="w-full max-w-sm">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    ),
    code: `<AccordionRoot type="multiple">\n  {/* items */}\n</AccordionRoot>`
  },
  {
    name: "Simple Accordion",
    component: <SimpleAccordion />,
    code: `import { SimpleAccordion } from "nexoreui"\n\n<SimpleAccordion />`
  },
  {
    name: "Plus Accordion",
    component: <PlusAccordion />,
    code: `import { PlusAccordion } from "nexoreui"\n\n<PlusAccordion />`
  },
  {
    name: "Neon Accordion",
    component: <NeonAccordion />,
    code: `import { NeonAccordion } from "nexoreui"\n\n<NeonAccordion />`
  },
  {
    name: "Bordered Accordion",
    component: (
      <AccordionRoot type="single" collapsible className="w-full max-w-sm border rounded-lg p-2">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="hover:no-underline hover:bg-secondary/50 rounded-md px-3">Section 1</AccordionTrigger>
          <AccordionContent className="px-3 pt-2">Content for section 1</AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    ),
    code: `<AccordionRoot className="border rounded-lg p-2">\n  <AccordionItem value="1" className="border-b-0">\n    <AccordionTrigger className="hover:bg-secondary rounded-md px-3">...</AccordionTrigger>\n  </AccordionItem>\n</AccordionRoot>`
  },
  {
    name: "Disabled Accordion",
    component: (
      <AccordionRoot type="single" collapsible className="w-full max-w-sm">
        <AccordionItem value="item-1" disabled>
          <AccordionTrigger>Disabled Item</AccordionTrigger>
          <AccordionContent>You cannot see me</AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    ),
    code: `<AccordionItem value="item-1" disabled>\n  <AccordionTrigger>Disabled Item</AccordionTrigger>\n</AccordionItem>`
  },
  {
    name: "No Underline Accordion",
    component: (
      <AccordionRoot type="single" collapsible className="w-full max-w-sm">
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:no-underline">No Underline on Hover</AccordionTrigger>
          <AccordionContent>Clean aesthetic.</AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    ),
    code: `<AccordionTrigger className="hover:no-underline">\n  No Underline on Hover\n</AccordionTrigger>`
  },
  {
    name: "Chevron Left Accordion",
    component: (
      <AccordionRoot type="single" collapsible className="w-full max-w-sm">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex-row-reverse justify-end gap-4">Icon on left</AccordionTrigger>
          <AccordionContent>Content here.</AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    ),
    code: `<AccordionTrigger className="flex-row-reverse justify-end gap-4">\n  Icon on left\n</AccordionTrigger>`
  },
  {
    name: "Ghost Accordion",
    component: (
      <AccordionRoot type="single" collapsible className="w-full max-w-sm">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="px-4 py-2 hover:bg-secondary rounded-md">Ghost Style</AccordionTrigger>
          <AccordionContent className="px-4">No borders, just background on hover.</AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    ),
    code: `<AccordionItem value="item-1" className="border-none">\n  <AccordionTrigger className="px-4 py-2 hover:bg-secondary rounded-md">\n    Ghost Style\n  </AccordionTrigger>\n</AccordionItem>`
  }
];

export function AccordionSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="accordions" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Accordions</h2>
          <p className="text-muted-foreground">A vertically stacked set of interactive headings that each reveal an associated section of content.</p>
        </div>
      </div>
      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-background p-6">
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
