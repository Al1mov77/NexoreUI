"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { AnimatedNumber, Button } from "nexoreui"

function CounterExample() {
  const [val, setVal] = useState(100)
  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatedNumber value={val} className="text-4xl font-extrabold text-primary" />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setVal(v => v - 25)}>-25</Button>
        <Button size="sm" variant="outline" onClick={() => setVal(v => v + 25)}>+25</Button>
      </div>
    </div>
  )
}

const examples = [
  {
    name: "Interactive Counter",
    component: <CounterExample />,
    code: `import React, { useState } from "react"\nimport { AnimatedNumber, Button } from "nexoreui"\n\nexport function CounterExample() {\n  const [val, setVal] = useState(100)\n  return (\n    <div className="flex flex-col items-center gap-4">\n      <AnimatedNumber value={val} className="text-4xl font-extrabold text-primary" />\n      <div className="flex gap-2">\n        <Button size="sm" variant="outline" onClick={() => setVal(v => v - 25)}>-25</Button>\n        <Button size="sm" variant="outline" onClick={() => setVal(v => v + 25)}>+25</Button>\n      </div>\n    </div>\n  )\n}`
  },
  {
    name: "Currency Formatting",
    component: (
      <AnimatedNumber
        value={12450.75}
        formatFn={(v) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          }).format(v)
        }
        className="text-3xl font-bold text-emerald-500"
      />
    ),
    code: `import { AnimatedNumber } from "nexoreui"\n\n<AnimatedNumber \n  value={12450.75} \n  formatFn={(v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v)} \n  className="text-3xl font-bold text-emerald-500"\n/>`
  },
  {
    name: "Percentage Value",
    component: (
      <AnimatedNumber
        value={87.4}
        formatFn={(v) => `${v.toFixed(1)}%`}
        className="text-3xl font-bold text-indigo-500"
      />
    ),
    code: `import { AnimatedNumber } from "nexoreui"\n\n<AnimatedNumber \n  value={87.4} \n  formatFn={(v) => \`\${v.toFixed(1)}%\`} \n  className="text-3xl font-bold text-indigo-500"\n/>`
  },
  {
    name: "Temperature Reading",
    component: (
      <AnimatedNumber
        value={36.6}
        formatFn={(v) => `${v.toFixed(1)}°C`}
        className="text-3xl font-bold text-amber-500"
      />
    ),
    code: `import { AnimatedNumber } from "nexoreui"\n\n<AnimatedNumber \n  value={36.6} \n  formatFn={(v) => \`\${v.toFixed(1)}°C\`}\n  className="text-3xl font-bold text-amber-500"\n/>`
  },
  {
    name: "Large Integer Display",
    component: (
      <AnimatedNumber
        value={999999}
        formatFn={(v) => Math.round(v).toLocaleString()}
        className="text-4xl font-extrabold text-foreground"
      />
    ),
    code: `import { AnimatedNumber } from "nexoreui"\n\n<AnimatedNumber \n  value={999999} \n  formatFn={(v) => Math.round(v).toLocaleString()} \n  className="text-4xl font-extrabold text-foreground"\n/>`
  }
]

export function AnimatedNumberSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="animated-number" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Animated Number</h2>
          <p className="text-muted-foreground">Smoothly animates a numeric value whenever it changes, using Framer Motion springs.</p>
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={AnimatedNumber}
          componentName="AnimatedNumber"
          importFrom="nexoreui"
          controls={[
            {
              name: "value",
              type: "number",
              defaultValue: 450,
              description: "Target number value to animate to"
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
                <td className="p-3 font-mono font-bold text-primary">value</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">The numeric target value. Changing this triggers transition.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">duration</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Optional duration config (translated to spring dynamics).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">formatFn</td>
                <td className="p-3 font-mono text-purple-400">(value: number) =&gt; string</td>
                <td className="p-3 font-mono text-muted-foreground">Math.round(v).toLocaleString()</td>
                <td className="p-3">Formatting function for rendering the numeric value to string.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
