"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
import { A11yHeader } from "../A11yNotice"
import { WhenToUse } from "../WhenToUse"
import { ScrollArea, ScrollBar, Button } from "nexoreui"

const releaseTags = [
  "v2.4.0 — Keyboard & ARIA pass",
  "v2.3.2 — Scrollbar inset padding",
  "v2.3.1 — Token border adjustments",
  "v2.3.0 — Reduced motion support",
  "v2.2.4 — Horizontal track layout",
  "v2.2.0 — Form validation helpers",
  "v2.1.2 — Focus ring contrast fix",
  "v2.1.0 — Table density presets",
  "v2.0.4 — TypeScript strict exports",
  "v2.0.0 — Tailwind CSS v4 tokens",
]

const teamMembers = [
  { initials: "MK", name: "Mina Kato", role: "Systems" },
  { initials: "TL", name: "Tomas Lind", role: "Ops" },
  { initials: "NO", name: "Nadia Okafor", role: "Frontend" },
  { initials: "HB", name: "Hanna Berg", role: "Infra" },
  { initials: "JS", name: "Jonas Sato", role: "Design" },
  { initials: "ER", name: "Elena Ruiz", role: "QA" },
]

const eventLogs = [
  { time: "09:41:02", msg: "edge_node us-east-1 synced" },
  { time: "09:41:09", msg: "tls_cert renewed (90d)" },
  { time: "09:41:14", msg: "cache_purge completed" },
  { time: "09:41:28", msg: "snapshot #402 verified" },
  { time: "09:41:45", msg: "webhook delivery 200 OK" },
  { time: "09:42:01", msg: "replica lag 4ms nominal" },
]

const keyboardShortcuts = [
  { action: "Open Command Palette", keys: "Ctrl + K" },
  { action: "Toggle Sidebar", keys: "Ctrl + B" },
  { action: "Focus Search", keys: "/" },
  { action: "Save Changes", keys: "Ctrl + S" },
  { action: "Switch Theme", keys: "Ctrl + T" },
  { action: "Close Dialog", keys: "Esc" },
]

const examples = [
  {
    name: "Release Changelog List",
    component: (
      <ScrollArea className="h-56 w-full max-w-xs rounded-xl border border-border bg-card p-4">
        <div className="font-semibold text-sm mb-3 border-b border-border pb-2 text-foreground">
          Releases
        </div>
        <div className="divide-y divide-border/60">
          {releaseTags.map((tag) => (
            <div key={tag} className="text-xs py-2 text-muted-foreground hover:text-foreground transition-colors">
              {tag}
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "nexoreui";

const releases = [
  "v2.4.0 — Keyboard & ARIA pass",
  "v2.3.2 — Scrollbar inset padding",
  "v2.3.1 — Token border adjustments",
  "v2.3.0 — Reduced motion support",
  "v2.2.4 — Horizontal track layout",
  "v2.2.0 — Form validation helpers",
  "v2.1.2 — Focus ring contrast fix",
  "v2.1.0 — Table density presets",
];

export default function ChangelogScrollDemo() {
  return (
    <ScrollArea className="h-56 w-full max-w-xs rounded-xl border border-border bg-card p-4">
      <div className="font-semibold text-sm mb-3 border-b border-border pb-2">
        Releases
      </div>
      <div className="divide-y divide-border/60">
        {releases.map((tag) => (
          <div key={tag} className="text-xs py-2 text-muted-foreground">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`
  },
  {
    name: "Horizontal Team Strip",
    component: (
      <ScrollArea className="w-full max-w-sm whitespace-nowrap rounded-xl border border-border bg-card p-4">
        <div className="flex gap-3 pb-2">
          {teamMembers.map((member) => (
            <div
              key={member.initials}
              className="inline-flex flex-col items-center gap-1.5 p-3 bg-muted/40 border border-border rounded-xl min-w-[92px]"
            >
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center font-mono text-xs font-semibold text-foreground">
                {member.initials}
              </div>
              <span className="text-xs font-medium text-foreground">{member.name}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{member.role}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    ),
    code: `import { ScrollArea, ScrollBar } from "nexoreui";

const members = [
  { initials: "MK", name: "Mina Kato", role: "Systems" },
  { initials: "TL", name: "Tomas Lind", role: "Ops" },
  { initials: "NO", name: "Nadia Okafor", role: "Frontend" },
  { initials: "HB", name: "Hanna Berg", role: "Infra" },
  { initials: "JS", name: "Jonas Sato", role: "Design" },
];

export default function HorizontalTeamStripDemo() {
  return (
    <ScrollArea className="w-full max-w-sm whitespace-nowrap rounded-xl border border-border bg-card p-4">
      <div className="flex gap-3 pb-2">
        {members.map((member) => (
          <div
            key={member.initials}
            className="inline-flex flex-col items-center gap-1.5 p-3 bg-muted/40 border border-border rounded-xl min-w-[92px]"
          >
            <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center font-mono text-xs font-semibold">
              {member.initials}
            </div>
            <span className="text-xs font-medium">{member.name}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{member.role}</span>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}`
  },
  {
    name: "Always-Visible Legal Terms",
    component: (
      <ScrollArea type="always" className="h-36 w-full max-w-sm rounded-xl border border-border bg-card p-4">
        <div className="text-sm space-y-2 pr-3">
          <p className="font-semibold text-foreground">Data Processing Addendum</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Customer telemetry logs are retained for 30 days by default and purged automatically
            upon expiration. Regional pinning keeps all snapshots encrypted at rest within the
            selected jurisdiction.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Audit trails remain immutable for compliance verification and can be exported in JSON
            or CSV formats at any time by workspace owners.
          </p>
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "nexoreui";

export default function AlwaysVisibleScrollDemo() {
  return (
    <ScrollArea type="always" className="h-36 w-full max-w-sm rounded-xl border border-border bg-card p-4">
      <div className="text-sm space-y-2 pr-3">
        <p className="font-semibold text-foreground">Data Processing Addendum</p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Customer telemetry logs are retained for 30 days by default and purged automatically
          upon expiration. Regional pinning keeps all snapshots encrypted at rest within the
          selected jurisdiction.
        </p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Audit trails remain immutable for compliance verification and can be exported in JSON
          or CSV formats at any time by workspace owners.
        </p>
      </div>
    </ScrollArea>
  );
}`
  },
  {
    name: "Live Event Log Viewport",
    component: (
      <ScrollArea scrollHideDelay={1800} className="h-36 w-full max-w-sm rounded-xl border border-border bg-card p-3">
        <div className="space-y-1.5 font-mono text-xs pr-2">
          {eventLogs.map((entry) => (
            <div key={entry.time} className="flex items-center gap-3 py-1 border-b border-border/50 last:border-0">
              <span className="text-muted-foreground shrink-0 tabular-nums">{entry.time}</span>
              <span className="text-foreground truncate">{entry.msg}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "nexoreui";

const logs = [
  { time: "09:41:02", msg: "edge_node us-east-1 synced" },
  { time: "09:41:09", msg: "tls_cert renewed (90d)" },
  { time: "09:41:14", msg: "cache_purge completed" },
  { time: "09:41:28", msg: "snapshot #402 verified" },
  { time: "09:41:45", msg: "webhook delivery 200 OK" },
];

export default function EventLogScrollDemo() {
  return (
    <ScrollArea scrollHideDelay={1800} className="h-36 w-full max-w-sm rounded-xl border border-border bg-card p-3">
      <div className="space-y-1.5 font-mono text-xs pr-2">
        {logs.map((entry) => (
          <div key={entry.time} className="flex items-center gap-3 py-1 border-b border-border/50 last:border-0">
            <span className="text-muted-foreground shrink-0 tabular-nums">{entry.time}</span>
            <span className="text-foreground truncate">{entry.msg}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`
  },
  {
    name: "Compact Shortcut Reference",
    component: (
      <ScrollArea className="h-32 w-full max-w-xs rounded-xl border border-border bg-card p-3">
        <div className="space-y-1 pr-2">
          {keyboardShortcuts.map((item) => (
            <div key={item.action} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md hover:bg-muted/50">
              <span className="text-foreground">{item.action}</span>
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted text-muted-foreground">
                {item.keys}
              </kbd>
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "nexoreui";

const shortcuts = [
  { action: "Open Command Palette", keys: "Ctrl + K" },
  { action: "Toggle Sidebar", keys: "Ctrl + B" },
  { action: "Focus Search", keys: "/" },
  { action: "Save Changes", keys: "Ctrl + S" },
  { action: "Close Dialog", keys: "Esc" },
];

export default function ShortcutScrollDemo() {
  return (
    <ScrollArea className="h-32 w-full max-w-xs rounded-xl border border-border bg-card p-3">
      <div className="space-y-1 pr-2">
        {shortcuts.map((item) => (
          <div key={item.action} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md">
            <span>{item.action}</span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted text-muted-foreground">
              {item.keys}
            </kbd>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`
  }
]

const scrollAreaPropsData = [
  { name: "type", type: '"auto" | "always" | "scroll" | "hover"', defaultValue: '"auto"', description: "Controls scrollbar visibility timing behavior.", required: false },
  { name: "scrollHideDelay", type: "number", defaultValue: "600", description: "Delay in milliseconds before scrollbar hides.", required: false },
  { name: "className", type: "string", defaultValue: "-", description: "Additional custom class names.", required: false },
]

const scrollBarPropsData = [
  { name: "orientation", type: '"vertical" | "horizontal"', defaultValue: '"vertical"', description: "The scrollbar orientation flow.", required: false },
  { name: "className", type: "string", defaultValue: "-", description: "Additional custom class names.", required: false },
]

export function ScrollAreaSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="scroll-area" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Scroll Area</h2>
        <p className="text-muted-foreground mt-1">
          Custom cross-platform scrollbar container preserving native scroll momentum and touch support.
        </p>
      </div>

      <WhenToUse
        items={[
          { label: "vertical scroll", description: "Long release lists, log feeds, or command menus inside bounded height panels." },
          { label: "horizontal scroll", description: "Wide card strips, user rosters, or code blocks requiring an explicit horizontal bar." },
          { label: "type='always'", description: "Legal agreements or terms blocks where users need immediate visual proof of overflow." },
          { label: "scrollHideDelay", description: "Adjusting how long the thumb stays visible after pointer movement stops." },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => (
            <ScrollArea {...props} className="h-44 w-full max-w-xs rounded-xl border border-border bg-card p-4">
              <div className="font-semibold text-sm mb-2 text-foreground">Interactive Demo</div>
              <div className="text-xs text-muted-foreground space-y-1.5 pr-2">
                {releaseTags.map((tag) => (
                  <div key={tag} className="py-1.5 border-b border-border/50 last:border-0">
                    {tag}
                  </div>
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
              description: "Delay in milliseconds before scrollbar hides"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4">ScrollArea Props</h3>
          <PropsTable propsData={scrollAreaPropsData} />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4">ScrollBar Props</h3>
          <PropsTable propsData={scrollBarPropsData} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Scrolling:</strong> Supports native arrow, PageUp, and PageDown keys when focused.</li>
          <li><strong>Radix Integration:</strong> Preserves native scroll physics and screen-reader visibility while styling custom tracks.</li>
        </ul>
      </div>
    </section>
  )
}
