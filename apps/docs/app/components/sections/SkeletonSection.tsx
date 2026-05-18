"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Skeleton, SkeletonCard, ShimmerBlock, Button } from "nexoreui";

const variants = [
  {
    name: "Default Skeleton",
    component: <Skeleton className="h-4 w-[250px]" />,
    code: `import { Skeleton } from "nexoreui"\n\n<Skeleton className="h-4 w-[250px]" />`
  },
  {
    name: "Circular Skeleton",
    component: <Skeleton className="h-12 w-12 rounded-full" />,
    code: `import { Skeleton } from "nexoreui"\n\n<Skeleton className="h-12 w-12 rounded-full" />`
  },
  {
    name: "Skeleton Paragraph",
    component: <div className="space-y-2"><Skeleton className="h-4 w-full max-w-sm" /><Skeleton className="h-4 w-4/5 max-w-sm" /><Skeleton className="h-4 w-2/3 max-w-sm" /></div>,
    code: `import { Skeleton } from "nexoreui"\n\n<div className="space-y-2">\n  <Skeleton className="h-4 w-full" />\n  <Skeleton className="h-4 w-4/5" />\n  <Skeleton className="h-4 w-2/3" />\n</div>`
  },
  {
    name: "User Profile Skeleton",
    component: <div className="flex items-center space-x-4"><Skeleton className="h-12 w-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-[200px]" /><Skeleton className="h-4 w-[150px]" /></div></div>,
    code: `import { Skeleton } from "nexoreui"\n\n<div className="flex items-center space-x-4">\n  <Skeleton className="h-12 w-12 rounded-full" />\n  <div className="space-y-2">\n    <Skeleton className="h-4 w-[200px]" />\n    <Skeleton className="h-4 w-[150px]" />\n  </div>\n</div>`
  },
  {
    name: "Skeleton Card",
    component: <SkeletonCard />,
    code: `import { SkeletonCard } from "nexoreui"\n\n<SkeletonCard />`
  },
  {
    name: "Shimmer Block",
    component: <ShimmerBlock className="h-32 w-full max-w-sm rounded-xl" />,
    code: `import { ShimmerBlock } from "nexoreui"\n\n<ShimmerBlock className="h-32 w-full rounded-xl" />`
  },
  {
    name: "Product Skeleton",
    component: <div className="space-y-4"><Skeleton className="h-[200px] w-full max-w-xs rounded-xl" /><Skeleton className="h-4 w-[150px]" /><Skeleton className="h-4 w-[100px]" /></div>,
    code: `<div className="space-y-4">\n  <Skeleton className="h-[200px] w-full max-w-xs rounded-xl" />\n  <Skeleton className="h-4 w-[150px]" />\n  <Skeleton className="h-4 w-[100px]" />\n</div>`
  },
  {
    name: "Table Row Skeleton",
    component: <div className="flex items-center justify-between space-x-4 border-b py-2 w-full max-w-md"><Skeleton className="h-4 w-[100px]" /><Skeleton className="h-4 w-[150px]" /><Skeleton className="h-8 w-8 rounded-full" /></div>,
    code: `<div className="flex items-center justify-between space-x-4 border-b py-2">\n  <Skeleton className="h-4 w-[100px]" />\n  <Skeleton className="h-4 w-[150px]" />\n  <Skeleton className="h-8 w-8 rounded-full" />\n</div>`
  },
  {
    name: "List Item Skeleton",
    component: <div className="flex items-center space-x-2"><Skeleton className="h-4 w-4 rounded-sm" /><Skeleton className="h-4 w-[200px]" /></div>,
    code: `<div className="flex items-center space-x-2">\n  <Skeleton className="h-4 w-4 rounded-sm" />\n  <Skeleton className="h-4 w-[200px]" />\n</div>`
  },
  {
    name: "Grid Skeleton",
    component: <div className="grid grid-cols-2 gap-4 w-full max-w-xs"><Skeleton className="h-20 rounded-lg" /><Skeleton className="h-20 rounded-lg" /><Skeleton className="h-20 rounded-lg" /><Skeleton className="h-20 rounded-lg" /></div>,
    code: `<div className="grid grid-cols-2 gap-4">\n  <Skeleton className="h-20 rounded-lg" />\n  <Skeleton className="h-20 rounded-lg" />\n  <Skeleton className="h-20 rounded-lg" />\n  <Skeleton className="h-20 rounded-lg" />\n</div>`
  }
];

export function SkeletonSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="skeletons" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Skeletons</h2>
          <p className="text-muted-foreground">Placeholder elements while content is loading.</p>
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
