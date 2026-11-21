"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  Button
} from "nexoreui";

function ControlledSelectDemo() {
  const [region, setRegion] = useState("us-east-1");
  return (
    <div className="w-full max-w-xs space-y-2">
      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger>
          <SelectValue placeholder="Choose deployment region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us-east-1">us-east-1 (Virginia)</SelectItem>
          <SelectItem value="eu-central-1">eu-central-1 (Frankfurt)</SelectItem>
          <SelectItem value="ap-northeast-1">ap-northeast-1 (Tokyo)</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs font-mono text-muted-foreground">
        Selected region: <span className="text-foreground">{region}</span>
      </p>
    </div>
  );
}

const variants = [
  {
    name: "Basic Select",
    component: (
      <div className="w-full max-w-xs">
        <Select defaultValue="light">
          <SelectTrigger>
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "nexoreui";

export default function ThemeSelectDemo() {
  return (
    <Select defaultValue="light">
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
}`
  },
  {
    name: "Controlled Region Picker",
    component: <ControlledSelectDemo />,
    code: `import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "nexoreui";

export default function ControlledSelectDemo() {
  const [region, setRegion] = useState("us-east-1");

  return (
    <div className="w-full max-w-xs space-y-2">
      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger>
          <SelectValue placeholder="Choose deployment region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us-east-1">us-east-1 (Virginia)</SelectItem>
          <SelectItem value="eu-central-1">eu-central-1 (Frankfurt)</SelectItem>
          <SelectItem value="ap-northeast-1">ap-northeast-1 (Tokyo)</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs font-mono text-muted-foreground">
        Selected region: {region}
      </p>
    </div>
  );
}`
  },
  {
    name: "Grouped Options with Labels",
    component: (
      <div className="w-full max-w-xs">
        <Select defaultValue="postgres">
          <SelectTrigger>
            <SelectValue placeholder="Select a runtime" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Databases</SelectLabel>
              <SelectItem value="postgres">PostgreSQL 16</SelectItem>
              <SelectItem value="redis">Redis Cache</SelectItem>
              <SelectItem value="sqlite">SQLite Edge</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Queues</SelectLabel>
              <SelectItem value="kafka">Apache Kafka</SelectItem>
              <SelectItem value="sqs">Managed Queue</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    ),
    code: `import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "nexoreui";

export default function GroupedSelectDemo() {
  return (
    <Select defaultValue="postgres">
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder="Select a runtime" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Databases</SelectLabel>
          <SelectItem value="postgres">PostgreSQL 16</SelectItem>
          <SelectItem value="redis">Redis Cache</SelectItem>
          <SelectItem value="sqlite">SQLite Edge</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Queues</SelectLabel>
          <SelectItem value="kafka">Apache Kafka</SelectItem>
          <SelectItem value="sqs">Managed Queue</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}`
  },
  {
    name: "Disabled Select & Disabled Item",
    component: (
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Select disabled defaultValue="starter">
          <SelectTrigger>
            <SelectValue placeholder="Disabled dropdown" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="starter">Starter Plan (Locked)</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="us-east">
          <SelectTrigger>
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us-east">US East (N. Virginia)</SelectItem>
            <SelectItem value="eu-west" disabled>EU West (Maintenance)</SelectItem>
            <SelectItem value="ap-south">AP South (Mumbai)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "nexoreui";

export default function DisabledSelectDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Select disabled defaultValue="starter">
        <SelectTrigger>
          <SelectValue placeholder="Disabled dropdown" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="starter">Starter Plan (Locked)</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="us-east">
        <SelectTrigger>
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us-east">US East (N. Virginia)</SelectItem>
          <SelectItem value="eu-west" disabled>EU West (Maintenance)</SelectItem>
          <SelectItem value="ap-south">AP South (Mumbai)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}`
  }
];

const selectPropsData = [
  { name: "defaultValue", type: "string", defaultValue: "-", description: "The value of the select when initially rendered in uncontrolled mode.", required: false },
  { name: "value", type: "string", defaultValue: "-", description: "The controlled value of the select.", required: false },
  { name: "onValueChange", type: "(value: string) => void", defaultValue: "-", description: "Callback triggered when the value of the select changes.", required: false },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "When true, prevents user interaction with the select trigger.", required: false },
  { name: "name", type: "string", defaultValue: "-", description: "The name attribute for HTML form submissions.", required: false },
  { name: "required", type: "boolean", defaultValue: "false", description: "Whether an option must be selected before submitting.", required: false }
];

export function SelectSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="select" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Select</h2>
        <p className="text-muted-foreground mt-1">
          Custom dropdown select with grouped items and full keyboard navigation.
        </p>
      </div>

      <WhenToUse
        items={[
          { label: "select", description: "Picking a single choice from 4 to 15 options where compact layout height matters." },
          { label: "radio cards", description: "Comparing 2 to 4 mutually exclusive choices that benefit from visible descriptions." },
          { label: "command", description: "Large datasets with 15+ entries where instant keyboard search and filtering help." },
        ]}
      />

      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight">Variants & Examples</h3>
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-3">
            <h4 className="text-base font-medium">{item.name}</h4>
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

      <PropsTable propsData={selectPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Navigation:</strong> Open via <kbd className="bg-muted px-1 rounded text-[10px]">Enter</kbd> or <kbd className="bg-muted px-1 rounded text-[10px]">Space</kbd>, navigate options using <kbd className="bg-muted px-1 rounded text-[10px]">Up</kbd> / <kbd className="bg-muted px-1 rounded text-[10px]">Down</kbd> arrows, confirm with <kbd className="bg-muted px-1 rounded text-[10px]">Enter</kbd>, and dismiss with <kbd className="bg-muted px-1 rounded text-[10px]">Escape</kbd>.</li>
          <li><strong>Typeahead:</strong> Focuses matching options when typing alphanumeric characters.</li>
          <li><strong>Radix Primitive:</strong> Adheres to WAI-ARIA Select pattern with correct <code className="text-primary font-mono text-[10px]">combobox</code> and <code className="text-primary font-mono text-[10px]">listbox</code> roles.</li>
        </ul>
      </div>
    </section>
  );
}
