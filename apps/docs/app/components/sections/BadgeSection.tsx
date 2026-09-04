"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { Star } from "lucide-react";
import { Badge, Button } from "nexoreui";

const variants = [
  {
    name: "Default Badge",
    component: <Badge>New Feature</Badge>,
    code: `import { Badge } from "nexoreui"\n\n<Badge>New Feature</Badge>`
  },
  {
    name: "Status Badges (Standard Core)",
    component: (
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success" dot pulse>Success</Badge>
        <Badge variant="info" dot>Info</Badge>
        <Badge variant="warning" dot>Warning</Badge>
        <Badge variant="destructive" dot pulse>Destructive</Badge>
      </div>
    ),
    code: `import { Badge } from "nexoreui"\n\n<Badge variant="success" dot pulse>Success</Badge>\n<Badge variant="info" dot>Info</Badge>\n<Badge variant="warning" dot>Warning</Badge>\n<Badge variant="destructive" dot pulse>Destructive</Badge>`
  },
  {
    name: "Neon Glow Badge",
    component: <Badge variant="neon">Premium Glow</Badge>,
    code: `import { Badge } from "nexoreui"\n\n<Badge variant="neon">Premium Glow</Badge>`
  },
  {
    name: "Notification Badge",
    component: <div className="relative p-2"><div className="h-8 w-8 bg-zinc-800 rounded-md"></div><Badge variant="destructive" size="sm" className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full text-[10px] font-bold justify-center">5</Badge></div>,
    code: `import { Badge } from "nexoreui"\n\n<div className="relative">\n  <Icon />\n  <Badge variant="destructive" size="sm" className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full">5</Badge>\n</div>`
  },
  {
    name: "Ribbon Badge",
    component: <div className="relative h-24 w-24 bg-zinc-800 rounded-lg overflow-hidden"><Badge variant="default" className="absolute top-0 right-0 rounded-bl-xl rounded-none text-[10px] font-bold uppercase">SALE</Badge></div>,
    code: `import { Badge } from "nexoreui"\n\n<div className="relative overflow-hidden">\n  <Badge variant="default" className="absolute top-0 right-0 rounded-bl-xl rounded-none">SALE</Badge>\n</div>`
  },
  {
    name: "Outline Dot Badge",
    component: <Badge variant="outline" dot pulse>Online</Badge>,
    code: `import { Badge } from "nexoreui"\n\n<Badge variant="outline" dot pulse>Online</Badge>`
  },
  {
    name: "Gradient Outline Badge",
    component: <Badge variant="gradient">Sponsored</Badge>,
    code: `import { Badge } from "nexoreui"\n\n<Badge variant="gradient">Sponsored</Badge>`
  },
  {
    name: "Icon Badge",
    component: (
      <Badge variant="outline" className="gap-1.5">
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Featured
      </Badge>
    ),
    code: `import { Badge } from "nexoreui"\nimport { Star } from "lucide-react"\n\n<Badge variant="outline" className="gap-1.5">\n  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />\n  Featured\n</Badge>`
  },
  {
    name: "Floating Badge",
    component: <div className="relative p-6 border border-border rounded-lg bg-zinc-900/50">Item Card<Badge variant="default" className="absolute -top-2 -right-2">Pro</Badge></div>,
    code: `import { Badge } from "nexoreui"\n\n<div className="relative">\n  Content\n  <Badge variant="default" className="absolute -top-2 -right-2">Pro</Badge>\n</div>`
  },
  {
    name: "Progress Badge",
    component: <Badge variant="secondary" pulse>Uploading 75%</Badge>,
    code: `import { Badge } from "nexoreui"\n\n<Badge variant="secondary" pulse>Uploading 75%</Badge>`
  },
  {
    name: "Live Status Hero Badge",
    component: (
      <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live Status
      </span>
    ),
    code: `export default function LiveStatusBadge() {\n  return (\n    <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">\n      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />\n      Live Status\n    </span>\n  );\n}`
  }
];

const badgePropsData = [
  { name: "variant", type: '"default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" | "gradient" | "neon"', defaultValue: '"default"', description: "Visual style of the badge label.", required: false },
  { name: "size", type: '"default" | "sm" | "lg"', defaultValue: '"default"', description: "Responsive text scaling.", required: false },
  { name: "dot", type: "boolean", defaultValue: "false", description: "Renders a small status indicator dot on the left.", required: false },
  { name: "pulse", type: "boolean", defaultValue: "false", description: "Enables repeating scaling animation on the status dot.", required: false },
  { name: "children", type: "React.ReactNode", defaultValue: "—", description: "Text label or element contents.", required: true }
];

export function BadgeSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="badges" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Badges</h2>
          <p className="text-muted-foreground mt-1">Status indicators, notification tags, and label chips.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use which variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["default / secondary", "General metadata tags, category filters, counts descriptions"],
            ["success", "Completed actions, online status, valid forms updates"],
            ["info", "Helpful tips, announcements, secondary updates notes"],
            ["warning", "Pending actions, warnings, warning alerts thresholds"],
            ["destructive", "Errors, failures, offline statuses, system blocking"],
            ["neon / gradient", "Calling interest to sponsored badges or upgraded plans"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={Badge}
          componentName="Badge"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "secondary", "destructive", "success", "warning", "info", "outline", "gradient", "neon"],
              defaultValue: "default",
              description: "Visual style of the badge label"
            },
            {
              name: "size",
              type: "select",
              options: ["default", "sm", "lg"],
              defaultValue: "default",
              description: "Size dimensions of the badge"
            },
            {
              name: "dot",
              type: "boolean",
              defaultValue: false,
              description: "Show a small status indicator dot"
            },
            {
              name: "pulse",
              type: "boolean",
              defaultValue: false,
              description: "Animate status dot with a pulse effect"
            },
            {
              name: "children",
              type: "text",
              defaultValue: "New",
              description: "Badge text content"
            }
          ]}
        />
      </div>

      {/* Main variants */}
      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight font-mono text-zinc-300">Showcase & Examples</h3>
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

      {/* Props Reference Table */}
      <PropsTable propsData={badgePropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Text Contrast:</strong> Text colors are automatically set based on theme guidelines, ensuring readable color contrast ranges for dark and light modes.</li>
          <li><strong>Screen Readers:</strong> If the badge is representing dynamic count updates (like notifications), ensure a parent element sets <code className="text-primary font-mono text-[10px]">aria-live="polite"</code>.</li>
        </ul>
      </div>
    </section>
  );
}
