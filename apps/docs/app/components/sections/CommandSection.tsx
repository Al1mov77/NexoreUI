"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
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

const commandPropsData = [
  { name: "items", type: "CommandItem[]", defaultValue: "—", description: "Array of items shown. Contains label, value, icon, and onSelect callback.", required: true },
  { name: "placeholder", type: "string", defaultValue: '"Type a command or search..."', description: "Search input placeholder.", required: false },
  { name: "open", type: "boolean", defaultValue: "false", description: "Active display status of Command Dialog.", required: false },
  { name: "onOpenChange", type: "(open: boolean) => void", defaultValue: "—", description: "Callback trigger when dialog open/close state changes.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

export function CommandSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="command" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Command Palette</h2>
          <p className="text-muted-foreground mt-1">Cmd+K overlay panel that supports fully customizable item actions, list filters, and spring animations.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["standard palette", "Providing power users with keyboard-first navigation shortcuts to jump to files, profiles, or trigger actions"],
            ["custom search", "Constraining input scopes to specific search domains or dashboard page queries"],
            ["action triggers", "Exposing utility actions (e.g. settings configs, project switching, clearing cash files) dynamically"],
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

      {/* Props Reference Table */}
      <PropsTable propsData={commandPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Shortcuts:</strong> Automatically registers global listeners for key bindings like <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Ctrl+K</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Cmd+K</kbd> to toggle visibility.</li>
          <li><strong>List Navigation:</strong> Fully navigable using Arrow Keys <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Up Arrow</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Down Arrow</kbd>, and triggers item choice on <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Enter</kbd>.</li>
        </ul>
      </div>
    </section>
  )
}
