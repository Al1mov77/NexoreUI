"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
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

function RatingPlayground(props: any) {
  const [val, setVal] = useState(3)
  return <Rating {...props} value={val} onChange={setVal} />
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

const ratingPropsData = [
  { name: "value", type: "number", defaultValue: "—", description: "Selected active rating score count.", required: true },
  { name: "max", type: "number", defaultValue: "5", description: "Maximum scoring slots count.", required: false },
  { name: "onChange", type: "(value: number) => void", defaultValue: "—", description: "Callback fired when a rating icon is selected.", required: false },
  { name: "readonly", type: "boolean", defaultValue: "false", description: "Disables pointer event hooks and transforms to read-only.", required: false },
  { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Visual dimensions of the rating icons.", required: false },
  { name: "icon", type: '"star" | "heart" | "thumb"', defaultValue: '"star"', description: "Selection symbol rendering variant.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

export function RatingSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="rating" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rating</h2>
          <p className="text-muted-foreground mt-1">Premium rating indicator supporting custom shapes (Stars, Hearts, Thumbs), sizes, keyboard navigation, and micro-interactions.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["star rating", "Gathering or displaying qualitative feedback (product reviews, app store ratings, item reviews)"],
            ["heart rating", "Marking items as favorites, adding to wishlists, or showcasing popularity indices"],
            ["thumb rating", "Binary liking/disliking systems or quick satisfaction scoring layouts"],
            ["read-only mode", "Displaying aggregated feedback stats where user input is not permitted (e.g. historical average scores)"],
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
          component={RatingPlayground}
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

      {/* Props Reference Table */}
      <PropsTable propsData={ratingPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Focus:</strong> Focusable using standard <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Tab</kbd> navigation. Use arrow keys <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Right Arrow</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Left Arrow</kbd> to increase or decrease rating active value.</li>
          <li><strong>Roles & Labels:</strong> Each button maps to a descriptive rating label representing its specific value (e.g. "Rate 4 out of 5").</li>
        </ul>
      </div>
    </section>
  )
}
