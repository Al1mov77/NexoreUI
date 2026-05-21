"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
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

export function SwitchSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="switches" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Switch</h2>
          <p className="text-muted-foreground">A control that allows the user to toggle between checked and unchecked states.</p>
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
    </section>
  );
}
