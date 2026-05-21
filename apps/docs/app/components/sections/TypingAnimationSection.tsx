"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { TypingAnimation, Button } from "nexoreui"

const examples = [
  {
    name: "Default Typing Cycle",
    component: <TypingAnimation texts={["Modern components.", "Beautiful aesthetics.", "Production ready."]} />,
    code: `import { TypingAnimation } from "nexoreui"\n\n<TypingAnimation texts={["Modern components.", "Beautiful aesthetics.", "Production ready."]} />`
  },
  {
    name: "Fast Typing Speed",
    component: <TypingAnimation texts={["Lightning fast typing speed!"]} speed={40} deleteSpeed={20} />,
    code: `import { TypingAnimation } from "nexoreui"\n\n<TypingAnimation texts={["Lightning fast typing speed!"]} speed={40} deleteSpeed={20} />`
  },
  {
    name: "No Loop / Run Once",
    component: <TypingAnimation texts={["This message will type once and stay."]} loop={false} />,
    code: `import { TypingAnimation } from "nexoreui"\n\n<TypingAnimation texts={["This message will type once and stay."]} loop={false} />`
  },
  {
    name: "Without Cursor",
    component: <TypingAnimation texts={["Typing without cursor blinking."]} cursor={false} />,
    code: `import { TypingAnimation } from "nexoreui"\n\n<TypingAnimation texts={["Typing without cursor blinking."]} cursor={false} />`
  },
  {
    name: "Gradient Custom Styling",
    component: <TypingAnimation texts={["Premium styling.", "Vibrant themes."]} className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent" />,
    code: `import { TypingAnimation } from "nexoreui"\n\n<TypingAnimation \n  texts={["Premium styling.", "Vibrant themes."]} \n  className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"\n/>`
  }
]

export function TypingAnimationSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="typing-animation" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Typing Animation</h2>
          <p className="text-muted-foreground">Animates typing and deleting effects for a sequence of texts.</p>
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => {
            const safeTexts = typeof props.texts === 'string' ? props.texts.split(',').map((t: string) => t.trim()) : props.texts;
            return <TypingAnimation {...props} texts={safeTexts} />
          }}
          componentName="TypingAnimation"
          importFrom="nexoreui"
          controls={[
            {
              name: "texts",
              type: "text",
              defaultValue: "Design Systems, Animated UI, React Components",
              description: "Comma-separated list of texts to cycle through"
            },
            {
              name: "speed",
              type: "number",
              defaultValue: 100,
              description: "Typing speed in milliseconds per character"
            },
            {
              name: "deleteSpeed",
              type: "number",
              defaultValue: 50,
              description: "Deleting speed in milliseconds per character"
            },
            {
              name: "pauseDuration",
              type: "number",
              defaultValue: 2000,
              description: "Pause duration in milliseconds after typing a full text"
            },
            {
              name: "loop",
              type: "boolean",
              defaultValue: true,
              description: "Whether to loop the texts indefinitely"
            },
            {
              name: "cursor",
              type: "boolean",
              defaultValue: true,
              description: "Whether to display the blinking cursor"
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
              <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-border bg-background p-6 text-xl">
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
                <td className="p-3 font-mono font-bold text-primary">texts</td>
                <td className="p-3 font-mono text-purple-400">string[]</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Array of text strings to type out sequentially.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">speed</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">100</td>
                <td className="p-3">Typing speed in milliseconds per character.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">deleteSpeed</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">50</td>
                <td className="p-3">Deleting speed in milliseconds per character.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">pauseDuration</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">2000</td>
                <td className="p-3">Pause duration in milliseconds after typing a full text.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">loop</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">true</td>
                <td className="p-3">Whether to loop the sequence of texts indefinitely.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">cursor</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">true</td>
                <td className="p-3">Whether to display the blinking cursor.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
