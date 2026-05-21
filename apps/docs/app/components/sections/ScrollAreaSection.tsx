"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
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

export function ScrollAreaSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="scroll-area" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scroll Area</h2>
          <p className="text-muted-foreground">Custom scrollbar styling with touch support, auto-hiding behavior, and cross-browser consistency.</p>
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

      {/* Props Table */}
      <div className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold tracking-tight">API Reference</h3>
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-semibold">
                <th className="p-3">Property</th>
                <th className="p-3">Type</th>
                <th className="p-3">Default</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-mono font-bold text-primary">type</td>
                <td className="p-3 font-mono text-purple-400">&quot;auto&quot; | &quot;always&quot; | &quot;scroll&quot; | &quot;hover&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;auto&quot;</td>
                <td className="p-3">Controls the visibility type of the scrollbar.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">scrollHideDelay</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">600</td>
                <td className="p-3">Delay in milliseconds before the scrollbar fades away after scrolling ceases.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">orientation</td>
                <td className="p-3 font-mono text-purple-400">&quot;vertical&quot; | &quot;horizontal&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;vertical&quot;</td>
                <td className="p-3">Orientation of the ScrollBar component (passed directly to ScrollBar component).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
