"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { BlurFade, Button } from "nexoreui"

const examples = [
  {
    name: "Default Blur Fade",
    component: (
      <BlurFade inView>
        <h3 className="text-3xl font-extrabold text-foreground">
          Hello Beautiful World
        </h3>
      </BlurFade>
    ),
    code: `import { BlurFade } from "nexoreui"\n\n<BlurFade inView>\n  <h3 className="text-3xl font-extrabold">\n    Hello Beautiful World\n  </h3>\n</BlurFade>`
  },
  {
    name: "Slow Motion Entrance",
    component: (
      <BlurFade inView duration={1.5}>
        <div className="bg-primary text-primary-foreground p-6 rounded-2xl font-bold shadow-lg">
          Slow Smooth Entry
        </div>
      </BlurFade>
    ),
    code: `import { BlurFade } from "nexoreui"\n\n<BlurFade inView duration={1.5}>\n  <div className="bg-primary text-primary-foreground p-6 rounded-2xl font-bold">\n    Slow Smooth Entry\n  </div>\n</BlurFade>`
  },
  {
    name: "Large Offset Animation",
    component: (
      <BlurFade inView yOffset={40} duration={0.6}>
        <div className="bg-muted text-foreground border border-border p-6 rounded-2xl font-bold">
          High Rise Entrance (yOffset = 40)
        </div>
      </BlurFade>
    ),
    code: `import { BlurFade } from "nexoreui"\n\n<BlurFade inView yOffset={40} duration={0.6}>\n  <div className="bg-muted p-6 rounded-2xl font-bold">\n    High Rise Entrance\n  </div>\n</BlurFade>`
  },
  {
    name: "Heavy Starting Blur",
    component: (
      <BlurFade inView blur="16px" duration={0.8}>
        <div className="text-xl font-bold text-purple-500">
          Heavy Starting Blur (blur = 16px)
        </div>
      </BlurFade>
    ),
    code: `import { BlurFade } from "nexoreui"\n\n<BlurFade inView blur="16px" duration={0.8}>\n  <div className="text-xl font-bold text-purple-500">\n    Heavy Starting Blur\n  </div>\n</BlurFade>`
  },
  {
    name: "Staggered Card Grid",
    component: (
      <div className="grid grid-cols-3 gap-3 w-full max-w-md">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlurFade key={i} delay={i * 0.1} inView>
            <div className="h-16 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm">
              Box {i + 1}
            </div>
          </BlurFade>
        ))}
      </div>
    ),
    code: `import { BlurFade } from "nexoreui"\n\n<div className="grid grid-cols-3 gap-3">\n  {items.map((item, i) => (\n    <BlurFade key={i} delay={i * 0.1} inView>\n      <div className="h-16 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center font-bold">\n        Box {i + 1}\n      </div>\n    </BlurFade>\n  ))}\n</div>`
  }
]

export function BlurFadeSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="blur-fade" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blur Fade</h2>
          <p className="text-muted-foreground">Animates children with a smooth spring blur and fade transition as they enter viewport.</p>
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => (
            <BlurFade {...props} inView>
              <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-center">
                Animate Me!
              </div>
            </BlurFade>
          )}
          componentName="BlurFade"
          importFrom="nexoreui"
          controls={[
            {
              name: "delay",
              type: "number",
              defaultValue: 0,
              description: "Animation delay in seconds"
            },
            {
              name: "duration",
              type: "number",
              defaultValue: 0.4,
              description: "Animation duration in seconds"
            },
            {
              name: "yOffset",
              type: "number",
              defaultValue: 6,
              description: "Y-axis offset translation at start"
            },
            {
              name: "blur",
              type: "text",
              defaultValue: "4px",
              description: "Starting CSS blur filter amount"
            },
            {
              name: "once",
              type: "boolean",
              defaultValue: true,
              description: "Trigger the viewport animation only once"
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
                <td className="p-3">The elements to animate.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">delay</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">0</td>
                <td className="p-3">Time delay before trigger starts (in seconds).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">duration</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">0.4</td>
                <td className="p-3">Time duration of transition (in seconds).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">yOffset</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">6</td>
                <td className="p-3">Distance in pixels the element translates from on Y-axis.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">blur</td>
                <td className="p-3 font-mono text-purple-400">string</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;4px&quot;</td>
                <td className="p-3">Starting CSS blur amount (e.g. &quot;8px&quot;).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">inView</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">true</td>
                <td className="p-3">Whether to trigger animation when the element is visible on screen.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">once</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">true</td>
                <td className="p-3">Trigger the transition once only upon viewport entry.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">margin</td>
                <td className="p-3 font-mono text-purple-400">string</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;-50px&quot;</td>
                <td className="p-3">Intersection Observer offset threshold margin.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
