"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { Command, Button } from "nexoreui"
import { Settings, User, FileText, Plus, Search, Trash, Star } from "lucide-react"

const commandItemsDemo = [
  { label: "Search Profile", value: "profile", icon: <User className="h-4 w-4" />, onSelect: () => alert("Profile Clicked") },
  { label: "Create New File", value: "create_file", icon: <Plus className="h-4 w-4" />, onSelect: () => alert("Create File Clicked") },
  { label: "Settings Preferences", value: "settings", icon: <Settings className="h-4 w-4" />, onSelect: () => alert("Settings Clicked") },
  { label: "Read Documentation", value: "docs", icon: <FileText className="h-4 w-4" />, onSelect: () => alert("Docs Clicked") },
  { label: "Delete Temporary Files", value: "delete", icon: <Trash className="h-4 w-4" />, onSelect: () => alert("Delete Clicked") },
  { label: "Favorite Selected Items", value: "favorite", icon: <Star className="h-4 w-4" />, onSelect: () => alert("Favorite Clicked") }
]

function CommandTriggerButton({ items, placeholder }: any) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={() => setOpen(true)}>
        Open Command Palette (Ctrl+K)
      </Button>
      <span className="text-xs text-muted-foreground">Press Ctrl+K or Cmd+K on your keyboard.</span>
      <Command open={open} onOpenChange={setOpen} items={items} placeholder={placeholder} />
    </div>
  )
}

const examples = [
  {
    name: "Standard Palette (Shortcut Activated)",
    component: <CommandTriggerButton items={commandItemsDemo.slice(0, 4)} />,
    code: `import React, { useState } from "react"\nimport { Command, Button } from "nexoreui"\nimport { User, Plus, Settings, FileText } from "lucide-react"\n\nexport function Demo() {\n  const [open, setOpen] = useState(false)\n  const items = [\n    { label: "Search Profile", value: "profile", icon: <User className="h-4 w-4" />, onSelect: () => {} },\n    { label: "Create New File", value: "create_file", icon: <Plus className="h-4 w-4" />, onSelect: () => {} },\n    { label: "Settings Preferences", value: "settings", icon: <Settings className="h-4 w-4" />, onSelect: () => {} },\n    { label: "Read Documentation", value: "docs", icon: <FileText className="h-4 w-4" />, onSelect: () => {} }\n  ]\n  return (\n    <>\n      <Button onClick={() => setOpen(true)}>Open Palette</Button>\n      <Command open={open} onOpenChange={setOpen} items={items} />\n    </>\n  )\n}`
  },
  {
    name: "Custom Search Placeholder",
    component: <CommandTriggerButton items={commandItemsDemo} placeholder="Search settings or administrative options..." />,
    code: `import { Command } from "nexoreui"\n\n<Command \n  open={open} \n  onOpenChange={setOpen} \n  items={items} \n  placeholder="Search settings or administrative options..." \n/>`
  },
  {
    name: "Only Administrative Operations",
    component: (
      <CommandTriggerButton
        items={[
          { label: "Delete Cache", value: "delete", icon: <Trash className="h-4 w-4" />, onSelect: () => alert("Cache Cleared") },
          { label: "Profile Maintenance", value: "profile", icon: <User className="h-4 w-4" />, onSelect: () => alert("Maintenance Done") }
        ]}
      />
    ),
    code: `import { Command } from "nexoreui"\n\n// Trigger containing destructive operations\n<Command \n  open={open} \n  onOpenChange={setOpen} \n  items={[\n    { label: "Delete Cache", value: "delete", icon: <Trash className="h-4 w-4" />, onSelect: () => {} }\n  ]} \n/>`
  },
  {
    name: "Star Favorite List Actions",
    component: (
      <CommandTriggerButton
        items={[
          { label: "Star Current Project", value: "star", icon: <Star className="h-4 w-4" />, onSelect: () => alert("Starred Project") },
          { label: "Read Docs Reference", value: "docs", icon: <FileText className="h-4 w-4" />, onSelect: () => alert("Docs Opened") }
        ]}
      />
    ),
    code: `import { Command } from "nexoreui"\n\n<Command \n  open={open} \n  onOpenChange={setOpen} \n  items={[\n    { label: "Star Current Project", value: "star", icon: <Star className="h-4 w-4" />, onSelect: () => {} }\n  ]} \n/>`
  },
  {
    name: "Programmatic Controlled Toggle",
    component: (
      <div className="flex gap-2">
        <CommandTriggerButton items={commandItemsDemo} />
      </div>
    ),
    code: `import React, { useState } from "react"\nimport { Command } from "nexoreui"\n\n// Fully controlled state toggle binding\nconst [open, setOpen] = useState(false)`
  }
]

export function CommandSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="command" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Command Palette</h2>
          <p className="text-muted-foreground">Cmd+K overlay panel that supports fully customizable item actions, list filters, and spring animations.</p>
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => (
            <CommandTriggerButton {...props} items={commandItemsDemo} />
          )}
          componentName="Command"
          importFrom="nexoreui"
          controls={[
            {
              name: "placeholder",
              type: "text",
              defaultValue: "Type a command or search...",
              description: "Input search placeholder text"
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
                <td className="p-3 font-mono font-bold text-primary">items</td>
                <td className="p-3 font-mono text-purple-400">CommandItem[]</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Array of items shown. Contains label, value, icon, and onSelect callback.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">placeholder</td>
                <td className="p-3 font-mono text-purple-400">string</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;Type a command or search...&quot;</td>
                <td className="p-3">Search input placeholder.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">open</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">false</td>
                <td className="p-3">Active display status of Command Dialog.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">onOpenChange</td>
                <td className="p-3 font-mono text-purple-400">(open: boolean) =&gt; void</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Callback trigger when dialog open/close state changes.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
