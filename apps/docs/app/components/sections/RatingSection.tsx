"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { Rating, Button } from "nexoreui"

function InteractiveRatingDemo({ icon, size, max }: any) {
  const [val, setVal] = useState(3)
  return (
    <div className="flex flex-col items-center gap-3">
      <Rating value={val} onChange={setVal} icon={icon} size={size} max={max} />
      <span className="text-sm font-semibold text-muted-foreground">Score: {val} / {max || 5}</span>
    </div>
  )
}

const examples = [
  {
    name: "Interactive Star Rating",
    component: <InteractiveRatingDemo />,
    code: `import React, { useState } from "react"\nimport { Rating } from "nexoreui"\n\nexport function Demo() {\n  const [val, setVal] = useState(3)\n  return (\n    <div className="flex flex-col items-center gap-3">\n      <Rating value={val} onChange={setVal} />\n      <span>Score: {val} / 5</span>\n    </div>\n  )\n}`
  },
  {
    name: "Heart Favorites Scoring",
    component: <InteractiveRatingDemo icon="heart" max={10} size="sm" />,
    code: `import { Rating } from "nexoreui"\n\n<Rating value={val} onChange={setVal} icon="heart" max={10} size="sm" />`
  },
  {
    name: "Thumbs Up Like Counter",
    component: <InteractiveRatingDemo icon="thumb" max={5} size="lg" />,
    code: `import { Rating } from "nexoreui"\n\n<Rating value={val} onChange={setVal} icon="thumb" size="lg" />`
  },
  {
    name: "Read-Only Fixed Display",
    component: <Rating value={4} readonly size="md" />,
    code: `import { Rating } from "nexoreui"\n\n<Rating value={4} readonly size="md" />`
  },
  {
    name: "Large Custom Star Score",
    component: <InteractiveRatingDemo size="lg" max={7} />,
    code: `import { Rating } from "nexoreui"\n\n<Rating value={val} onChange={setVal} size="lg" max={7} />`
  }
]

export function RatingSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="rating" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rating</h2>
          <p className="text-muted-foreground">Premium rating indicator supporting custom shapes (Stars, Hearts, Thumbs), sizes, keyboard navigation, and micro-interactions.</p>
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => {
            const [val, setVal] = useState(3)
            return <Rating {...props} value={val} onChange={setVal} />
          }}
          componentName="Rating"
          importFrom="nexoreui"
          controls={[
            {
              name: "max",
              type: "number",
              defaultValue: 5,
              description: "Maximum scale score rating"
            },
            {
              name: "icon",
              type: "select",
              options: ["star", "heart", "thumb"],
              defaultValue: "star",
              description: "Custom icon symbol structure"
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg"],
              defaultValue: "md",
              description: "Sizing multiplier dimensions"
            },
            {
              name: "readonly",
              type: "boolean",
              defaultValue: false,
              description: "Disables interaction and mouse effects"
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
                <td className="p-3">Selected active rating score count.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">max</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">5</td>
                <td className="p-3">Maximum scoring slots count.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">onChange</td>
                <td className="p-3 font-mono text-purple-400">(value: number) =&gt; void</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Callback fired when a rating star is selected.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">readonly</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">false</td>
                <td className="p-3">Disables pointer event hooks and transforms to read-only.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">size</td>
                <td className="p-3 font-mono text-purple-400">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;md&quot;</td>
                <td className="p-3">Visual dimensions of the rating icons.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">icon</td>
                <td className="p-3 font-mono text-purple-400">&quot;star&quot; | &quot;heart&quot; | &quot;thumb&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;star&quot;</td>
                <td className="p-3">Selection symbol rendering variant.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
