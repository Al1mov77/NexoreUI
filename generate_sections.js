const fs = require('fs');
const path = require('path');
const sections = [
  'TooltipSection', 'TabsSection', 'AccordionSection', 'BadgeSection', 
  'AvatarSection', 'SkeletonSection', 'ProgressSection', 'SliderSection', 
  'SpecialButtonsSection', 'SpecialCardsSection', 'SpecialInputsSection', 
  'SpecialAlertsSection', 'LoadersSection', 'TogglesSection', 'TypographySection', 
  'DataDisplaySection', 'NavigationSection', 'ModalsSection', 'CookieSection', 'DarkModeSection'
];

const dir = path.join(__dirname, 'apps', 'docs', 'app', 'components', 'sections');

sections.forEach(name => {
  const content = `"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Button } from "nexoreui";

const variants = [
  { name: "Variant 1", component: <div>Placeholder</div>, code: "// code" },
  { name: "Variant 2", component: <div>Placeholder</div>, code: "// code" },
  { name: "Variant 3", component: <div>Placeholder</div>, code: "// code" },
  { name: "Variant 4", component: <div>Placeholder</div>, code: "// code" },
  { name: "Variant 5", component: <div>Placeholder</div>, code: "// code" },
  { name: "Variant 6", component: <div>Placeholder</div>, code: "// code" },
  { name: "Variant 7", component: <div>Placeholder</div>, code: "// code" },
  { name: "Variant 8", component: <div>Placeholder</div>, code: "// code" },
  { name: "Variant 9", component: <div>Placeholder</div>, code: "// code" },
  { name: "Variant 10", component: <div>Placeholder</div>, code: "// code" }
];

export function ${name}() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="${name.toLowerCase()}" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">${name.replace('Section', '')}</h2>
          <p className="text-muted-foreground">Description for ${name}</p>
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
`;

  fs.writeFileSync(path.join(dir, `${name}.tsx`), content);
});
console.log('Created files');
