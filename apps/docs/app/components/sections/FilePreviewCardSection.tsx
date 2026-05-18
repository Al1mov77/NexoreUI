"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { FilePreviewCard, Button } from "nexoreui";

const variants = [
  {
    name: "Default File Preview",
    component: (
      <FilePreviewCard 
        name="project_presentation.pdf" 
        size="2.4 MB" 
        type="pdf" 
        className="w-full max-w-sm"
      />
    ),
    code: `import { FilePreviewCard } from "nexoreui"\n\n<FilePreviewCard \n  name="project_presentation.pdf" \n  size="2.4 MB" \n  type="pdf" \n/>`
  },
  {
    name: "Image File Preview",
    component: (
      <FilePreviewCard 
        name="design_mockup.png" 
        size="4.1 MB" 
        type="image" 
        className="w-full max-w-sm"
      />
    ),
    code: `import { FilePreviewCard } from "nexoreui"\n\n<FilePreviewCard \n  name="design_mockup.png" \n  size="4.1 MB" \n  type="image" \n/>`
  }
];

export function FilePreviewCardSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="file-preview-card" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">File Preview Card</h2>
          <p className="text-muted-foreground">Display file details with an icon and download action.</p>
        </div>
      </div>
      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-6 relative">
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
