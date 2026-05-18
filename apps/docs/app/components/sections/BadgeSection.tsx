"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Badge, NotificationBadge, RibbonBadge, OutlineDotBadge, GradientOutlineBadge, IconBadge, FloatingBadge, ProgressBadge, StatusRingBadge, NeonOutlineBadge, Button } from "nexoreui";

const variants = [
  {
    name: "Default Badge",
    component: <Badge>New</Badge>,
    code: `import { Badge } from "nexoreui"\n\n<Badge>New</Badge>`
  },
  {
    name: "Notification Badge",
    component: <div className="relative p-2"><div className="h-8 w-8 bg-secondary rounded-md"></div><NotificationBadge count={5} /></div>,
    code: `import { NotificationBadge } from "nexoreui"\n\n<div className="relative">\n  <Icon />\n  <NotificationBadge count={5} />\n</div>`
  },
  {
    name: "Ribbon Badge",
    component: <div className="relative h-24 w-24 bg-secondary rounded-lg overflow-hidden"><RibbonBadge text="SALE" /></div>,
    code: `import { RibbonBadge } from "nexoreui"\n\n<div className="relative overflow-hidden">\n  <RibbonBadge text="SALE" />\n</div>`
  },
  {
    name: "Outline Dot Badge",
    component: <OutlineDotBadge status="online">Online</OutlineDotBadge>,
    code: `import { OutlineDotBadge } from "nexoreui"\n\n<OutlineDotBadge status="online">Online</OutlineDotBadge>`
  },
  {
    name: "Gradient Outline Badge",
    component: <GradientOutlineBadge>Premium</GradientOutlineBadge>,
    code: `import { GradientOutlineBadge } from "nexoreui"\n\n<GradientOutlineBadge>Premium</GradientOutlineBadge>`
  },
  {
    name: "Icon Badge",
    component: <IconBadge icon="star">Featured</IconBadge>,
    code: `import { IconBadge } from "nexoreui"\n\n<IconBadge icon="star">Featured</IconBadge>`
  },
  {
    name: "Floating Badge",
    component: <div className="relative p-4 border rounded-lg">Container<FloatingBadge>Pro</FloatingBadge></div>,
    code: `import { FloatingBadge } from "nexoreui"\n\n<div className="relative">\n  Content\n  <FloatingBadge>Pro</FloatingBadge>\n</div>`
  },
  {
    name: "Progress Badge",
    component: <ProgressBadge progress={75}>Loading...</ProgressBadge>,
    code: `import { ProgressBadge } from "nexoreui"\n\n<ProgressBadge progress={75}>Loading...</ProgressBadge>`
  },
  {
    name: "Status Ring Badge",
    component: <StatusRingBadge status="warning">Warning</StatusRingBadge>,
    code: `import { StatusRingBadge } from "nexoreui"\n\n<StatusRingBadge status="warning">Warning</StatusRingBadge>`
  },
  {
    name: "Neon Outline Badge",
    component: <NeonOutlineBadge>Cyberpunk</NeonOutlineBadge>,
    code: `import { NeonOutlineBadge } from "nexoreui"\n\n<NeonOutlineBadge>Cyberpunk</NeonOutlineBadge>`
  }
];

export function BadgeSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="badges" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Badges</h2>
          <p className="text-muted-foreground">Small status indicators and labels.</p>
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
