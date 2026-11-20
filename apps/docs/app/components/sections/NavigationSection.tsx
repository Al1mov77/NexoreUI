"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import {
  Breadcrumb,
  Pagination,
  Steps,
  SimpleNavbar,
  CenteredNavbar,
  GlassNavbar,
  FloatingNavbar,
  SidebarMenu,
  BottomNav,
  BreadcrumbTrail,
  TabMenu,
  DropdownMenuVisual,
} from "nexoreui";

function PaginationDemo() {
  const [page, setPage] = useState(2);
  return <Pagination totalPages={5} currentPage={page} onPageChange={setPage} />;
}

const showcaseItems = [
  {
    name: "Breadcrumb",
    component: (
      <Breadcrumb
        items={[
          { label: "Home", href: "#navigation" },
          { label: "Components", href: "#navigation" },
          { label: "Navigation" },
        ]}
      />
    ),
    code: `import { Breadcrumb } from "nexoreui";

export default function BreadcrumbDemo() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Components", href: "/docs/components" },
        { label: "Navigation" },
      ]}
    />
  );
}`,
  },
  {
    name: "Pagination",
    component: <PaginationDemo />,
    code: `import { useState } from "react";
import { Pagination } from "nexoreui";

export default function PaginationDemo() {
  const [page, setPage] = useState(2);
  return <Pagination totalPages={5} currentPage={page} onPageChange={setPage} />;
}`,
  },
  {
    name: "Steps",
    component: (
      <Steps
        items={[
          { title: "Project setup", description: "Initialize config and theme tokens.", status: "complete" },
          { title: "Install components", description: "Copy source files into your repo.", status: "current" },
          { title: "Deploy", description: "Ship with zero runtime lock-in.", status: "upcoming" },
        ]}
      />
    ),
    code: `import { Steps } from "nexoreui";

export default function StepsDemo() {
  return (
    <Steps
      items={[
        { title: "Project setup", description: "Initialize config and theme tokens.", status: "complete" },
        { title: "Install components", description: "Copy source files into your repo.", status: "current" },
        { title: "Deploy", description: "Ship with zero runtime lock-in.", status: "upcoming" },
      ]}
    />
  );
}`,
  },
  {
    name: "Simple Navbar",
    component: (
      <div className="w-full relative">
        <SimpleNavbar />
      </div>
    ),
    code: `import { SimpleNavbar } from "nexoreui";\n\n<SimpleNavbar />`,
  },
  {
    name: "Centered Navbar",
    component: (
      <div className="w-full relative">
        <CenteredNavbar />
      </div>
    ),
    code: `import { CenteredNavbar } from "nexoreui";\n\n<CenteredNavbar />`,
  },
  {
    name: "Glass & Floating Navbars",
    component: (
      <div className="w-full space-y-6 bg-muted/40 border border-border rounded-xl p-4">
        <GlassNavbar />
        <FloatingNavbar />
      </div>
    ),
    code: `import { GlassNavbar, FloatingNavbar } from "nexoreui";\n\n<GlassNavbar />\n<FloatingNavbar />`,
  },
  {
    name: "Sidebar, Bottom Nav, Tabs & Menu",
    component: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
        <div className="h-64 border border-border rounded-xl overflow-hidden">
          <SidebarMenu />
        </div>
        <div className="space-y-4">
          <TabMenu />
          <DropdownMenuVisual />
          <BreadcrumbTrail />
          <div className="border border-border rounded-xl overflow-hidden">
            <BottomNav />
          </div>
        </div>
      </div>
    ),
    code: `import { SidebarMenu, TabMenu, DropdownMenuVisual, BreadcrumbTrail, BottomNav } from "nexoreui";`,
  },
];

export function NavigationSection() {
  return (
    <section id="navigation" className="space-y-12 scroll-mt-20">
      <div className="space-y-10">
        {showcaseItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">{item.name}</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div
                data-demo-preview
                className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-background p-6 overflow-x-auto"
              >
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
