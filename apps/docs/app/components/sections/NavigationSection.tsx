"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
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
  TabMenu,
  DropdownMenuVisual,
} from "nexoreui";

function PaginationDemo() {
  const [page, setPage] = useState(2);
  return (
    <div className="flex flex-col items-center gap-2">
      <Pagination totalPages={5} currentPage={page} onPageChange={setPage} />
      <span className="text-xs font-mono text-muted-foreground tabular-nums">
        Current page: {page} of 5
      </span>
    </div>
  );
}

const navigationPropsData = [
  { name: "Breadcrumb.items", type: "{ label: string; href?: string }[]", defaultValue: "-", description: "Ordered route hierarchy segments with optional links.", required: true },
  { name: "Pagination.totalPages", type: "number", defaultValue: "-", description: "Total number of pages in the paginated collection.", required: true },
  { name: "Pagination.currentPage", type: "number", defaultValue: "-", description: "Currently active 1-indexed page number.", required: true },
  { name: "Pagination.onPageChange", type: "(page: number) => void", defaultValue: "-", description: "Callback fired when selecting a page or stepping forward/back.", required: false },
  { name: "Steps.items", type: "{ title: string; description?: string; status: 'complete' | 'current' | 'upcoming' }[]", defaultValue: "-", description: "Vertical status sequence steps.", required: true },
];

const showcaseItems = [
  {
    name: "Breadcrumb",
    description: "Hierarchical route trail marking the current page location.",
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
    description: "Controlled page switcher with previous/next controls and current page state.",
    component: <PaginationDemo />,
    code: `import { useState } from "react";
import { Pagination } from "nexoreui";

export default function PaginationDemo() {
  const [page, setPage] = useState(2);

  return (
    <Pagination
      totalPages={5}
      currentPage={page}
      onPageChange={setPage}
    />
  );
}`,
  },
  {
    name: "Steps Timeline",
    description: "Ordered vertical checklist highlighting completed, current, and upcoming milestones.",
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
    name: "Responsive Header Navbars",
    description: "Standard header bars with interactive active link state and collapsible mobile drawer.",
    component: (
      <div className="w-full space-y-4">
        <SimpleNavbar />
        <CenteredNavbar />
      </div>
    ),
    code: `import { SimpleNavbar, CenteredNavbar } from "nexoreui";

export default function HeaderNavbarsDemo() {
  return (
    <div className="w-full space-y-4">
      <SimpleNavbar
        brand="Nexore"
        links={[
          { label: "Overview", href: "#overview" },
          { label: "Components", href: "#components" },
          { label: "Pricing", href: "#pricing" },
        ]}
      />
      <CenteredNavbar
        brand="Studio"
        links={[
          { label: "Products" },
          { label: "Solutions" },
          { label: "Pricing" },
        ]}
      />
    </div>
  );
}`,
  },
  {
    name: "Pill & Floating Navigation Bars",
    description: "Compact rounded navigation rails for top marketing headers or floating mobile bars.",
    component: (
      <div className="w-full space-y-4 bg-muted/30 border border-border rounded-xl p-4">
        <GlassNavbar />
        <FloatingNavbar />
      </div>
    ),
    code: `import { GlassNavbar, FloatingNavbar } from "nexoreui";

export default function PillAndFloatingNavDemo() {
  return (
    <div className="w-full space-y-4">
      <GlassNavbar
        brand="Workspace"
        links={[{ label: "Features" }, { label: "Pricing" }, { label: "Docs" }]}
      />
      <FloatingNavbar />
    </div>
  );
}`,
  },
  {
    name: "Sidebar Menu & Tab Bar",
    description: "Vertical workspace navigation paired with horizontal section tab switching.",
    component: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
        <SidebarMenu />
        <div className="space-y-4 w-full min-w-0">
          <TabMenu />
          <DropdownMenuVisual />
        </div>
      </div>
    ),
    code: `import { SidebarMenu, TabMenu, DropdownMenuVisual } from "nexoreui";

export default function SidebarAndTabsDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
      <SidebarMenu />
      <div className="space-y-4 w-full">
        <TabMenu />
        <DropdownMenuVisual />
      </div>
    </div>
  );
}`,
  },
  {
    name: "Mobile Bottom Navigation Bar",
    description: "Touch-target bottom bar for compact viewport navigation with primary action button.",
    component: (
      <div className="w-full max-w-sm">
        <BottomNav />
      </div>
    ),
    code: `import { BottomNav } from "nexoreui";

export default function BottomNavDemo() {
  return (
    <div className="w-full max-w-sm">
      <BottomNav />
    </div>
  );
}`,
  },
];

export function NavigationSection() {
  return (
    <section id="navigation" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Navigation</h2>
        <p className="text-muted-foreground mt-1">
          Breadcrumbs, pagination controls, top navbars, sidebars, and mobile bottom bars for multi-page architecture.
        </p>
      </div>

      <WhenToUse
        items={[
          { label: "Breadcrumb", description: "Nested documentation or folder hierarchies where users jump back to parent levels." },
          { label: "Pagination", description: "Long tables and search result pages split into numbered pages." },
          { label: "Simple / Centered Navbar", description: "Top-level application and product headers with responsive mobile collapse." },
          { label: "SidebarMenu / BottomNav", description: "Persistent workspace section switching on desktop sidebars or mobile viewports." },
        ]}
      />

      <div className="space-y-10">
        {showcaseItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div
                data-demo-preview
                className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-background p-4 sm:p-6 overflow-hidden"
              >
                <div className="w-full flex items-center justify-center min-w-0">
                  {item.component}
                </div>
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      <PropsTable propsData={navigationPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Landmarks:</strong> Breadcrumbs, Pagination, and Navbars expose distinct <code className="text-primary font-mono text-[10px]">aria-label</code> landmarks and <code className="text-primary font-mono text-[10px]">aria-current="page"</code> on active links.</li>
          <li><strong>Mobile Targets:</strong> Navigation controls remain reachable without overflowing 375px viewports.</li>
        </ul>
      </div>
    </section>
  );
}
