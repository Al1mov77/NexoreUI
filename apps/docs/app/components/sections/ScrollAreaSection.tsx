"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
import { ScrollArea, ScrollBar, Button } from "nexoreui"

const tagList = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

const examples = [
  {
    name: "Default Vertical Scroll",
    component: (
      <ScrollArea className="h-72 w-48 rounded-xl border border-border bg-card p-4">
        <div className="font-bold text-sm mb-4 border-b border-border pb-2 text-foreground">Versions</div>
        {tagList.map((tag) => (
          <div key={tag} className="text-sm py-1.5 border-b border-border/20 last:border-0 hover:text-primary transition-colors cursor-pointer">
            {tag}
          </div>
        ))}
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "nexoreui"\n\n<ScrollArea className="h-72 w-48 rounded-xl border p-4">\n  <div className="font-bold text-sm mb-4">Versions</div>\n  {tags.map((tag) => (\n    <div key={tag} className="text-sm py-1.5 border-b last:border-0">\n      {tag}\n    </div>\n  ))}\n</ScrollArea>`
  },
  {
    name: "Horizontal Scrolling Layout",
    component: (
      <ScrollArea className="w-80 whitespace-nowrap rounded-xl border border-border bg-card p-4">
        <div className="flex gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="inline-flex flex-col items-center gap-2 p-3 bg-muted rounded-xl">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                U{i}
              </div>
              <span className="text-xs font-semibold text-foreground">User {i}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    ),
    code: `import { ScrollArea, ScrollBar } from "nexoreui"\n\n<ScrollArea className="w-80 whitespace-nowrap rounded-xl border p-4">\n  <div className="flex gap-4">\n    {users.map((user, i) => (\n      <div key={i} className="inline-flex flex-col items-center gap-2 p-3 bg-muted rounded-xl">\n        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">\n          {user.initial}\n        </div>\n        <span className="text-xs font-semibold">{user.name}</span>\n      </div>\n    ))}\n  </div>\n  <ScrollBar orientation="horizontal" />\n</ScrollArea>`
  },
  {
    name: "Always Visible Scrollbar",
    component: (
      <ScrollArea type="always" className="h-32 w-64 rounded-xl border border-border bg-card p-4">
        <div className="text-sm space-y-2">
          <p className="font-bold text-foreground">Important Agreement Details</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            By utilizing the components and assets provided in this framework, you agree to all terms of service.
            The library remains open-source under MIT, but premium elements are subject to proprietary limits.
            Ensure compliance with modern styling design systems before deployment.
          </p>
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "nexoreui"\n\n<ScrollArea type="always" className="h-32 w-64 rounded-xl border p-4">\n  <p className="text-xs leading-relaxed">\n    This scrollbar is set to "always" visible type configuration.\n  </p>\n</ScrollArea>`
  },
  {
    name: "Slow Auto-Hide Scrollbar",
    component: (
      <ScrollArea scrollHideDelay={3000} className="h-32 w-64 rounded-xl border border-border bg-card p-4">
        <div className="text-sm space-y-2">
          <p className="font-bold text-foreground">Hover to reveal scrollbar</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Scroll this area using your mouse or trackpad, then move the mouse away.
            The scrollbar will slowly fade out after a 3000ms delay.
          </p>
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "nexoreui"\n\n<ScrollArea scrollHideDelay={3000} className="h-32 w-64 rounded-xl border p-4">\n  <p className="text-xs leading-relaxed">\n    The scrollbar fades out slowly after 3 seconds of inactivity.\n  </p>\n</ScrollArea>`
  },
  {
    name: "Short Custom Height",
    component: (
      <ScrollArea className="h-20 w-48 rounded-xl border border-border bg-card p-2">
        <div className="space-y-1">
          {tagList.slice(0, 5).map((tag) => (
            <div key={tag} className="text-xs px-2 py-1 hover:bg-muted rounded cursor-pointer">
              {tag}
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "nexoreui"\n\n<ScrollArea className="h-20 w-48 rounded-xl border p-2">\n  <div className="space-y-1">\n    {tags.map((tag) => (\n      <div key={tag} className="text-xs px-2 py-1">\n        {tag}\n      </div>\n    ))}\n  </div>\n</ScrollArea>`
  }
]

const scrollAreaPropsData = [
  { name: "type", type: '"auto" | "always" | "scroll" | "hover"', defaultValue: '"auto"', description: "Controls scrollbar visibility timing behavior.", required: false },
  { name: "scrollHideDelay", type: "number", defaultValue: "600", description: "Delay in milliseconds before scrollbar hides.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

const scrollBarPropsData = [
  { name: "orientation", type: '"vertical" | "horizontal"', defaultValue: '"vertical"', description: "The scrollbar orientation flow.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

export function ScrollAreaSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="scroll-area" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scroll Area</h2>
          <p className="text-muted-foreground mt-1">Custom scrollbar styling with touch support, auto-hiding behavior, and cross-browser consistency.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["vertical scroll", "Displaying long lists, configuration logs, or documents within constrained dashboard components"],
            ["horizontal scroll", "Navigating a horizontal series of cards, photo carousels, or table cells on mobile layouts"],
            ["always visible", "Ensuring users recognize that additional details exist below fold (e.g. Terms of Service scrolls)"],
            ["slow hide delay", "Providing users more time to target the scrollbar thumb before it fades away from view"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => (
            <ScrollArea {...props} className="h-40 w-64 rounded-xl border border-border bg-card p-4">
              <div className="font-bold text-sm mb-2 text-foreground">Interactive Demo</div>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>Scroll down to see the customizable scrollbar behaviors.</p>
                {tagList.map((tag) => (
                  <div key={tag} className="py-1 border-b border-border/10">{tag}</div>
                ))}
              </div>
            </ScrollArea>
          )}
          componentName="ScrollArea"
          importFrom="nexoreui"
          controls={[
            {
              name: "type",
              type: "select",
              options: ["auto", "always", "scroll", "hover"],
              defaultValue: "auto",
              description: "Scrollbar visibility trigger type"
            },
            {
              name: "scrollHideDelay",
              type: "number",
              defaultValue: 600,
              description: "Delay in milliseconds before scrollbar hides (only for type 'scroll' or 'hover')"
            }
          ]}
        />
      </div>

      {/* Examples list */}
      <div className="space-y-12">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}

      {/* Props Reference Tables */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4">ScrollArea Props</h3>
          <PropsTable propsData={scrollAreaPropsData} />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4">ScrollBar Props</h3>
          <PropsTable propsData={scrollBarPropsData} />
        </div>
      </div>

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Scrolling:</strong> Navigable using keyboard focus and default arrow/page-up/page-down keys when container holds focus.</li>
          <li><strong>Radix Integration:</strong> Uses native browser scroll mechanisms behind the scenes for full screen-reader compliance and layout adaptability.</li>
        </ul>
      </div>
    </section>
  )
}
