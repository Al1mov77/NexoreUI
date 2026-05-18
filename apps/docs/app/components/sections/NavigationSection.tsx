"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { SimpleNavbar, CenteredNavbar, GlassNavbar, FloatingNavbar, SidebarMenu, BottomNav, BreadcrumbTrail, TabMenu, DropdownMenuVisual, TreeNavigation, Button } from "nexoreui";

const variants = [
  {
    name: "Simple Navbar",
    component: <div className="w-full relative h-32"><SimpleNavbar /></div>,
    code: `import { SimpleNavbar } from "nexoreui"\n\n<SimpleNavbar />`
  },
  {
    name: "Centered Navbar",
    component: <div className="w-full relative h-32"><CenteredNavbar /></div>,
    code: `import { CenteredNavbar } from "nexoreui"\n\n<CenteredNavbar />`
  },
  {
    name: "Glass Navbar",
    component: <div className="w-full relative h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"><GlassNavbar /></div>,
    code: `import { GlassNavbar } from "nexoreui"\n\n<GlassNavbar />`
  },
  {
    name: "Floating Navbar",
    component: <div className="w-full relative h-40 bg-zinc-900 rounded-lg flex items-start pt-4 justify-center"><div className="w-[80%]"><FloatingNavbar /></div></div>,
    code: `import { FloatingNavbar } from "nexoreui"\n\n<FloatingNavbar />`
  },
  {
    name: "Sidebar Menu",
    component: <div className="h-64 w-64 border rounded-xl overflow-hidden relative"><SidebarMenu /></div>,
    code: `import { SidebarMenu } from "nexoreui"\n\n<SidebarMenu />`
  },
  {
    name: "Bottom Navigation",
    component: <div className="relative h-40 w-full max-w-xs border rounded-xl overflow-hidden flex items-end"><BottomNav /></div>,
    code: `import { BottomNav } from "nexoreui"\n\n<BottomNav />`
  },
  {
    name: "Breadcrumb Trail",
    component: <BreadcrumbTrail />,
    code: `import { BreadcrumbTrail } from "nexoreui"\n\n<BreadcrumbTrail />`
  },
  {
    name: "Tab Menu",
    component: <TabMenu />,
    code: `import { TabMenu } from "nexoreui"\n\n<TabMenu />`
  },
  {
    name: "Dropdown Menu Visual",
    component: <DropdownMenuVisual />,
    code: `import { DropdownMenuVisual } from "nexoreui"\n\n<DropdownMenuVisual />`
  },
  {
    name: "Tree Navigation",
    component: <div className="w-64 border p-4 rounded-lg bg-background"><TreeNavigation /></div>,
    code: `import { TreeNavigation } from "nexoreui"\n\n<TreeNavigation />`
  }
];

export function NavigationSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="navigation" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Navigation</h2>
          <p className="text-muted-foreground">Menus, sidebars, and navbars to move through the app.</p>
        </div>
      </div>
      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-background/50 p-6">
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
