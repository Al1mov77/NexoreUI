"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { Checkbox, Button } from "nexoreui";

const variants = [
  {
    name: "Default Checkbox",
    component: <Checkbox id="terms-default" defaultChecked />,
    code: `import { Checkbox } from "nexoreui"\n\n<Checkbox id="terms" defaultChecked />`
  },
  {
    name: "With Label and Description",
    component: (
      <div className="flex items-start space-x-3 max-w-sm">
        <Checkbox id="terms-desc" defaultChecked className="mt-0.5" />
        <div className="grid gap-1 leading-none">
          <label
            htmlFor="terms-desc"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Accept terms and conditions
          </label>
          <p className="text-xs text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    ),
    code: `import { Checkbox } from "nexoreui"\n\n<div className="flex items-start space-x-3">\n  <Checkbox id="terms" className="mt-0.5" />\n  <div className="grid gap-1 leading-none">\n    <label htmlFor="terms" className="text-sm font-medium cursor-pointer">\n      Accept terms and conditions\n    </label>\n    <p className="text-xs text-muted-foreground">\n      You agree to our Terms of Service and Privacy Policy.\n    </p>\n  </div>\n</div>`
  },
  {
    name: "Settings Selection Row",
    component: (
      <div className="flex items-center justify-between rounded-lg border border-border p-4 w-full max-w-md bg-card/40">
        <div className="space-y-0.5 pr-4">
          <label htmlFor="notif-sync" className="text-sm font-semibold cursor-pointer">
            Security audit emails
          </label>
          <p className="text-xs text-muted-foreground">
            Receive automated alerts whenever a new API key is created.
          </p>
        </div>
        <Checkbox id="notif-sync" defaultChecked />
      </div>
    ),
    code: `import { Checkbox } from "nexoreui"\n\n<div className="flex items-center justify-between rounded-lg border border-border p-4">\n  <div className="space-y-0.5">\n    <label htmlFor="audit" className="text-sm font-semibold cursor-pointer">\n      Security audit emails\n    </label>\n    <p className="text-xs text-muted-foreground">\n      Receive automated alerts whenever a new API key is created.\n    </p>\n  </div>\n  <Checkbox id="audit" defaultChecked />\n</div>`
  },
  {
    name: "Disabled States",
    component: (
      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="disabled-unchecked" disabled />
          <label htmlFor="disabled-unchecked" className="text-xs text-muted-foreground">
            Disabled Unchecked
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="disabled-checked" disabled defaultChecked />
          <label htmlFor="disabled-checked" className="text-xs text-muted-foreground">
            Disabled Checked
          </label>
        </div>
      </div>
    ),
    code: `import { Checkbox } from "nexoreui"\n\n<Checkbox disabled />\n<Checkbox disabled defaultChecked />`
  }
];

const checkboxPropsData = [
  { name: "checked", type: "boolean | 'indeterminate'", defaultValue: "false", description: "Controlled state of the checkbox.", required: false },
  { name: "defaultChecked", type: "boolean", defaultValue: "false", description: "Initial checked state when uncontrolled.", required: false },
  { name: "onCheckedChange", type: "(checked: boolean | 'indeterminate') => void", defaultValue: "—", description: "Event handler called when the checked state changes.", required: false },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables interaction and dims visual contrast.", required: false },
  { name: "required", type: "boolean", defaultValue: "false", description: "HTML form required attribute for native validation.", required: false },
  { name: "name", type: "string", defaultValue: "—", description: "Name of the input field for form submission.", required: false },
  { name: "value", type: "string", defaultValue: "'on'", description: "Value attribute of the underlying HTML input.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional Tailwind CSS utility classes.", required: false }
];

export function CheckboxSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="checkbox" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Checkbox</h2>
        <p className="text-muted-foreground mt-1">
          Accessible check control with animated tick icon and state management.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["checkbox", "Multiple choices from a list or optional standalone opt-in toggles requiring explicit form submission."],
            ["switch (alternative)", "Immediate binary state activation without needing a Save/Submit button."],
            ["radio (alternative)", "Mutually exclusive single selection where exactly one option must be chosen."],
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
          component={Checkbox}
          componentName="Checkbox"
          importFrom="nexoreui"
          controls={[
            {
              name: "checked",
              type: "boolean",
              defaultValue: true,
              description: "The checked state of the checkbox"
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: false,
              description: "Whether the checkbox is interactive or disabled"
            }
          ]}
        />
      </div>

      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight">Variants & Examples</h3>
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-3">
            <h4 className="text-base font-medium">{item.name}</h4>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-border bg-background p-6">
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

      <PropsTable propsData={checkboxPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Navigation:</strong> Fully focusable using <kbd className="bg-muted px-1 rounded text-[10px]">Tab</kbd>, and toggles on <kbd className="bg-muted px-1 rounded text-[10px]">Space</kbd>.</li>
          <li><strong>ARIA conformance:</strong> Implements Radix UI Checkbox primitive with proper <code className="text-primary font-mono text-[10px]">role="checkbox"</code>, <code className="text-primary font-mono text-[10px]">aria-checked</code>, and automated state synchronization for screen readers.</li>
        </ul>
      </div>
    </section>
  );
}
