"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { Switch, Button } from "nexoreui";

const variants = [
  {
    name: "Default Switch",
    component: <Switch />,
    code: `import { Switch } from "nexoreui"\n\n<Switch />`
  },
  {
    name: "Disabled Switch",
    component: <Switch disabled checked />,
    code: `import { Switch } from "nexoreui"\n\n<Switch disabled checked />`
  },
  {
    name: "With Label & Description",
    component: (
      <div className="flex items-center space-x-3">
        <Switch id="airplane-mode" />
        <label htmlFor="airplane-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
          Airplane Mode
        </label>
      </div>
    ),
    code: `import { Switch } from "nexoreui"\n\n<div className="flex items-center space-x-3">\n  <Switch id="airplane-mode" />\n  <label htmlFor="airplane-mode" className="text-sm font-medium cursor-pointer">\n    Airplane Mode\n  </label>\n</div>`
  },
  {
    name: "Settings Row Card",
    component: (
      <div className="flex items-center justify-between rounded-lg border border-border p-4 w-full max-w-sm">
        <div className="space-y-0.5 pr-4">
          <label className="text-sm font-semibold">Push Notifications</label>
          <p className="text-xs text-muted-foreground">Receive real-time alerts in this browser.</p>
        </div>
        <Switch defaultChecked />
      </div>
    ),
    code: `import { Switch } from "nexoreui"\n\n<div className="flex items-center justify-between rounded-lg border border-border p-4">\n  <div className="space-y-0.5">\n    <label className="text-sm font-semibold">Push Notifications</label>\n    <p className="text-xs text-muted-foreground">Receive real-time alerts.</p>\n  </div>\n  <Switch defaultChecked />\n</div>`
  }
];

const switchPropsData = [
  { name: "checked", type: "boolean", defaultValue: "false", description: "Controlled checked state of the switch toggle.", required: false },
  { name: "defaultChecked", type: "boolean", defaultValue: "false", description: "Default initial checked state.", required: false },
  { name: "onCheckedChange", type: "(checked: boolean) => void", defaultValue: "—", description: "Callback triggered when the checked state changes.", required: false },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction and visually mutes the switch.", required: false },
  { name: "name", type: "string", defaultValue: "—", description: "Name of the input field for HTML forms integration.", required: false },
  { name: "value", type: "string", defaultValue: "—", description: "Value of the switch input element.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

export function SwitchSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="switches" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Switch</h2>
          <p className="text-muted-foreground mt-1">A control that allows the user to toggle between checked and unchecked states.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["toggle switch", "Immediate state changes (dark mode toggle, push notifications, wifi settings)"],
            ["checkbox (alternative)", "Standard multi-select forms where actions are not applied instantly (requires a Submit button click)"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={Switch}
          componentName="Switch"
          importFrom="nexoreui"
          controls={[
            {
              name: "checked",
              type: "boolean",
              defaultValue: false,
              description: "The controlled state of the switch"
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: false,
              description: "Whether the switch is interactive or not"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6">
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

      {/* Props Reference Table */}
      <PropsTable propsData={switchPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Navigation:</strong> Fully focusable using <kbd className="bg-muted px-1 rounded text-[10px]">Tab</kbd>, and state changes on <kbd className="bg-muted px-1 rounded text-[10px]">Space</kbd> or <kbd className="bg-muted px-1 rounded text-[10px]">Enter</kbd>.</li>
          <li><strong>ARIA attributes:</strong> Uses Radix UI Switch primitive, which exports <code className="text-primary font-mono text-[10px]">role="switch"</code> and maps the state visually to screen readers via <code className="text-primary font-mono text-[10px]">aria-checked</code>.</li>
        </ul>
      </div>
    </section>
  );
}
