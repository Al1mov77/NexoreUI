"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { Marquee, Button } from "nexoreui"

const marqueeItems = [
  "React",
  "TypeScript",
  "TailwindCSS",
  "Framer Motion",
  "Radix UI",
  "Next.js",
  "Vite",
  "HTML5",
  "CSS3"
]

const examples = [
  {
    name: "Default Left Marquee",
    component: (
      <Marquee speed={30}>
        {marqueeItems.map((item, idx) => (
          <span key={idx} className="mx-4 text-xl font-bold bg-muted px-4 py-2 rounded-xl border border-border">
            {item}
          </span>
        ))}
      </Marquee>
    ),
    code: `import { Marquee } from "nexoreui"\n\n<Marquee speed={30}>\n  {items.map((item, idx) => (\n    <span key={idx} className="mx-4 text-xl font-bold bg-muted px-4 py-2 rounded-xl border">\n      {item}\n    </span>\n  ))}\n</Marquee>`
  },
  {
    name: "Right Direction Marquee",
    component: (
      <Marquee speed={30} direction="right">
        {marqueeItems.map((item, idx) => (
          <span key={idx} className="mx-4 text-xl font-bold bg-muted px-4 py-2 rounded-xl border border-border">
            {item}
          </span>
        ))}
      </Marquee>
    ),
    code: `import { Marquee } from "nexoreui"\n\n<Marquee speed={30} direction="right">\n  {items.map((item, idx) => (\n    <span key={idx} className="mx-4 text-xl font-bold bg-muted px-4 py-2 rounded-xl border">\n      {item}\n    </span>\n  ))}\n</Marquee>`
  },
  {
    name: "High Speed Tech Grid",
    component: (
      <Marquee speed={60}>
        {marqueeItems.map((item, idx) => (
          <span key={idx} className="mx-4 text-xl font-bold bg-primary text-primary-foreground px-4 py-2 rounded-xl">
            {item}
          </span>
        ))}
      </Marquee>
    ),
    code: `import { Marquee } from "nexoreui"\n\n<Marquee speed={60}>\n  {items.map((item, idx) => (\n    <span key={idx} className="mx-4 text-xl font-bold bg-primary text-primary-foreground px-4 py-2 rounded-xl">\n      {item}\n    </span>\n  ))}\n</Marquee>`
  },
  {
    name: "No Pause on Hover",
    component: (
      <Marquee speed={25} pauseOnHover={false}>
        {marqueeItems.map((item, idx) => (
          <span key={idx} className="mx-4 text-xl font-bold bg-muted px-4 py-2 rounded-xl border border-border">
            {item}
          </span>
        ))}
      </Marquee>
    ),
    code: `import { Marquee } from "nexoreui"\n\n<Marquee speed={25} pauseOnHover={false}>\n  {items.map((item, idx) => (\n    <span key={idx} className="mx-4 text-xl font-bold bg-muted px-4 py-2 rounded-xl border">\n      {item}\n    </span>\n  ))}\n</Marquee>`
  },
  {
    name: "Large Custom Gap",
    component: (
      <Marquee speed={35} gap={48}>
        {marqueeItems.map((item, idx) => (
          <span key={idx} className="text-xl font-bold bg-muted px-4 py-2 rounded-xl border border-border">
            {item}
          </span>
        ))}
      </Marquee>
    ),
    code: `import { Marquee } from "nexoreui"\n\n<Marquee speed={35} gap={48}>\n  {items.map((item, idx) => (\n    <span key={idx} className="text-xl font-bold bg-muted px-4 py-2 rounded-xl border">\n      {item}\n    </span>\n  ))}\n</Marquee>`
  }
]

export function MarqueeSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="marquee" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Marquee</h2>
          <p className="text-muted-foreground">Infinite auto-scrolling container that runs smoothly at high frame rates.</p>
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => (
            <Marquee {...props} className="w-full">
              {marqueeItems.map((item, idx) => (
                <span key={idx} className="text-lg font-bold bg-muted px-4 py-2 rounded-xl border border-border whitespace-nowrap">
                  {item}
                </span>
              ))}
            </Marquee>
          )}
          componentName="Marquee"
          importFrom="nexoreui"
          controls={[
            {
              name: "speed",
              type: "number",
              defaultValue: 40,
              description: "Animation speed (represented as pixels per second/rate)"
            },
            {
              name: "direction",
              type: "select",
              options: ["left", "right"],
              defaultValue: "left",
              description: "Direction in which the marquee scrolls"
            },
            {
              name: "pauseOnHover",
              type: "boolean",
              defaultValue: true,
              description: "Pause the scrolling motion when hovering"
            },
            {
              name: "gap",
              type: "number",
              defaultValue: 16,
              description: "Gap in pixels between children items"
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
              <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-border bg-background p-6 overflow-hidden">
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
                <td className="p-3 font-mono font-bold text-primary">children</td>
                <td className="p-3 font-mono text-purple-400">ReactNode</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Content inside the marquee.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">speed</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">40</td>
                <td className="p-3">Scrolling velocity multiplier.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">direction</td>
                <td className="p-3 font-mono text-purple-400">&quot;left&quot; | &quot;right&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;left&quot;</td>
                <td className="p-3">Scroll direction.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">pauseOnHover</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">true</td>
                <td className="p-3">Whether scrolling pauses on cursor hover.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">gap</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">16</td>
                <td className="p-3">Gap in pixels between children.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
