"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { NumberTicker, Button } from "nexoreui"

const examples = [
  {
    name: "Default Ticker",
    component: <NumberTicker value={100} />,
    code: `import { NumberTicker } from "nexoreui"\n\n<NumberTicker value={100} />`
  },
  {
    name: "With Prefix and Suffix",
    component: <NumberTicker value={4500} prefix="$" suffix="+" />,
    code: `import { NumberTicker } from "nexoreui"\n\n<NumberTicker value={4500} prefix="$" suffix="+" />`
  },
  {
    name: "Decimals Customization",
    component: <NumberTicker value={98.76} decimals={2} duration={2.5} />,
    code: `import { NumberTicker } from "nexoreui"\n\n<NumberTicker value={98.76} decimals={2} duration={2.5} />`
  },
  {
    name: "Slow Motion Statistics",
    component: <NumberTicker value={1250} duration={5} prefix="+" />,
    code: `import { NumberTicker } from "nexoreui"\n\n<NumberTicker value={1250} duration={5} prefix="+" />`
  },
  {
    name: "Large Custom Font Sizing",
    component: <NumberTicker value={42} className="text-5xl font-extrabold text-violet-500" suffix="k" />,
    code: `import { NumberTicker } from "nexoreui"\n\n<NumberTicker value={42} className="text-5xl font-extrabold text-violet-500" suffix="k" />`
  }
]

export function NumberTickerSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="number-ticker" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Number Ticker</h2>
          <p className="text-muted-foreground">Animates a numeric value from 0 to target value when it enters the viewport.</p>
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={NumberTicker}
          componentName="NumberTicker"
          importFrom="nexoreui"
          controls={[
            {
              name: "value",
              type: "number",
              defaultValue: 100,
              description: "Target number to animate towards"
            },
            {
              name: "duration",
              type: "number",
              defaultValue: 2,
              description: "Duration of the scroll animation in seconds"
            },
            {
              name: "prefix",
              type: "text",
              defaultValue: "$",
              description: "Text character rendered before the numbers"
            },
            {
              name: "suffix",
              type: "text",
              defaultValue: "+",
              description: "Text character rendered after the numbers"
            },
            {
              name: "decimals",
              type: "number",
              defaultValue: 0,
              description: "Number of fractional decimal digits"
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
              <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-border bg-background p-6 font-bold text-3xl">
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
                <td className="p-3 font-mono font-bold text-primary">value</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">The final numeric target to animate to.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">duration</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">2</td>
                <td className="p-3">Animation duration in seconds.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">prefix</td>
                <td className="p-3 font-mono text-purple-400">string</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;&quot;</td>
                <td className="p-3">Optional character before the value.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">suffix</td>
                <td className="p-3 font-mono text-purple-400">string</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;&quot;</td>
                <td className="p-3">Optional character after the value.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">decimals</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">0</td>
                <td className="p-3">Precision of fractional decimals.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
