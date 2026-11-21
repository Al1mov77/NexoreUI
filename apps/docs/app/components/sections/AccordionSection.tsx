"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Button,
} from "nexoreui";

const variants = [
  {
    name: "Single Collapsible FAQ",
    component: (
      <Accordion type="single" collapsible defaultValue="item-1" className="w-full max-w-md">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA Accordion pattern with full keyboard support.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It uses NexoreUI semantic tokens for both light and dark themes.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I copy the source?</AccordionTrigger>
          <AccordionContent>
            Yes. Run the CLI command or copy the component code directly into your project.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "nexoreui";

export default function SingleAccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA Accordion pattern with full keyboard support.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It uses NexoreUI semantic tokens for both light and dark themes.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I copy the source?</AccordionTrigger>
        <AccordionContent>
          Yes. Run the CLI command or copy the component code directly into your project.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`
  },
  {
    name: "Multiple Open Panels",
    component: (
      <Accordion
        type="multiple"
        defaultValue={["api-keys", "webhooks"]}
        className="w-full max-w-md"
      >
        <AccordionItem value="api-keys">
          <AccordionTrigger>API Authentication</AccordionTrigger>
          <AccordionContent>
            Scoped bearer tokens rotate automatically every 30 days with zero downtime.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="webhooks">
          <AccordionTrigger>Webhook Retries</AccordionTrigger>
          <AccordionContent>
            Failed deliveries retry with exponential backoff for up to 24 hours.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "nexoreui";

export default function MultipleAccordionDemo() {
  return (
    <Accordion
      type="multiple"
      defaultValue={["api-keys", "webhooks"]}
      className="w-full max-w-md"
    >
      <AccordionItem value="api-keys">
        <AccordionTrigger>API Authentication</AccordionTrigger>
        <AccordionContent>
          Scoped bearer tokens rotate automatically every 30 days with zero downtime.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="webhooks">
        <AccordionTrigger>Webhook Retries</AccordionTrigger>
        <AccordionContent>
          Failed deliveries retry with exponential backoff for up to 24 hours.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`
  },
  {
    name: "Outlined Card Accordion",
    component: (
      <Accordion type="single" collapsible variant="outline" className="w-full max-w-md">
        <AccordionItem value="billing">
          <AccordionTrigger>Billing Cycles</AccordionTrigger>
          <AccordionContent>
            Invoices are issued on the first day of each calendar month in USD or EUR.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="seats">
          <AccordionTrigger>Seat Management</AccordionTrigger>
          <AccordionContent>
            Pro-rated adjustments apply automatically when inviting or removing members.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "nexoreui";

export default function OutlineAccordionDemo() {
  return (
    <Accordion type="single" collapsible variant="outline" className="w-full max-w-md">
      <AccordionItem value="billing">
        <AccordionTrigger>Billing Cycles</AccordionTrigger>
        <AccordionContent>
          Invoices are issued on the first day of each calendar month in USD or EUR.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="seats">
        <AccordionTrigger>Seat Management</AccordionTrigger>
        <AccordionContent>
          Pro-rated adjustments apply automatically when inviting or removing members.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`
  },
  {
    name: "Plus Icon Trigger",
    component: (
      <Accordion type="single" collapsible className="w-full max-w-md">
        <AccordionItem value="install">
          <AccordionTrigger iconType="plus">How do I install NexoreUI?</AccordionTrigger>
          <AccordionContent>
            Run npx nexoreui add accordion in your Next.js or React repository.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tokens">
          <AccordionTrigger iconType="plus">Does it require Tailwind CSS v4?</AccordionTrigger>
          <AccordionContent>
            Yes. Semantic CSS variables map directly to Tailwind v4 theme tokens.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "nexoreui";

export default function PlusAccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="install">
        <AccordionTrigger iconType="plus">How do I install NexoreUI?</AccordionTrigger>
        <AccordionContent>
          Run npx nexoreui add accordion in your Next.js or React repository.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tokens">
        <AccordionTrigger iconType="plus">Does it require Tailwind CSS v4?</AccordionTrigger>
        <AccordionContent>
          Yes. Semantic CSS variables map directly to Tailwind v4 theme tokens.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`
  },
  {
    name: "Default Expanded & Disabled Item",
    component: (
      <Accordion type="single" collapsible defaultValue="active-item" className="w-full max-w-md">
        <AccordionItem value="active-item">
          <AccordionTrigger>Active Region Config</AccordionTrigger>
          <AccordionContent>
            Primary traffic routes through us-east-1 with automatic failover enabled.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="locked-item" disabled>
          <AccordionTrigger>Enterprise Audit Vault (Locked)</AccordionTrigger>
          <AccordionContent>
            Upgrade to the Team plan to configure immutable log exports.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "nexoreui";

export default function DisabledAccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="active-item" className="w-full max-w-md">
      <AccordionItem value="active-item">
        <AccordionTrigger>Active Region Config</AccordionTrigger>
        <AccordionContent>
          Primary traffic routes through us-east-1 with automatic failover enabled.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="locked-item" disabled>
        <AccordionTrigger>Enterprise Audit Vault (Locked)</AccordionTrigger>
        <AccordionContent>
          Upgrade to the Team plan to configure immutable log exports.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`
  }
];

const accordionPropsData = [
  { name: "type", type: '"single" | "multiple"', defaultValue: "-", description: "Whether one or multiple items can be expanded at the same time.", required: true },
  { name: "collapsible", type: "boolean", defaultValue: "false", description: "When type is 'single', allows expanding items to be collapsed.", required: false },
  { name: "variant", type: '"default" | "glass" | "outline" | "neon"', defaultValue: '"default"', description: "Visual container variant of the accordion.", required: false },
  { name: "defaultValue", type: "string | string[]", defaultValue: "-", description: "Value of the item(s) to expand by default.", required: false },
  { name: "value", type: "string | string[]", defaultValue: "-", description: "Controlled value of expanded item(s).", required: false },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents items from being toggled.", required: false },
];

const AccordionPlaygroundWrapper = ({
  type,
  collapsible,
  variant,
  itemVariant,
  iconType,
  title1,
  content1,
  title2,
  content2,
}: any) => (
  <div className="w-full flex justify-center">
    <Accordion
      type={type}
      collapsible={type === "single" ? collapsible : undefined}
      variant={variant}
      className="w-full max-w-md"
    >
      <AccordionItem value="item-1" variant={itemVariant}>
        <AccordionTrigger iconType={iconType}>{title1}</AccordionTrigger>
        <AccordionContent>{content1}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" variant={itemVariant}>
        <AccordionTrigger iconType={iconType}>{title2}</AccordionTrigger>
        <AccordionContent>{content2}</AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export function AccordionSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="accordions" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Accordion</h2>
        <p className="text-muted-foreground mt-1">
          A vertically stacked set of collapsible disclosure panels for organizing structured content.
        </p>
      </div>

      <WhenToUse
        items={[
          { label: "single collapsible", description: "FAQ sections and step-by-step documentation where only one answer needs focus at a time." },
          { label: "multiple open", description: "Filter sidebars and settings drawers where users compare or edit several groups together." },
          { label: "outline card", description: "Self-contained disclosure blocks placed directly onto dashboard or pricing pages." },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={AccordionPlaygroundWrapper}
          componentName="Accordion"
          importFrom="nexoreui"
          controls={[
            {
              name: "type",
              type: "select",
              options: ["single", "multiple"],
              defaultValue: "single",
              description: "Whether one or multiple items can be expanded"
            },
            {
              name: "collapsible",
              type: "boolean",
              defaultValue: true,
              description: "Allows all items to be closed (only for type='single')"
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "outline", "glass", "neon"],
              defaultValue: "default",
              description: "Visual style variant of the accordion"
            },
            {
              name: "itemVariant",
              type: "select",
              options: ["default", "neon"],
              defaultValue: "default",
              description: "Visual style variant of the accordion items"
            },
            {
              name: "iconType",
              type: "select",
              options: ["chevron", "plus"],
              defaultValue: "chevron",
              description: "Icon type used in the trigger"
            },
            {
              name: "title1",
              type: "text",
              defaultValue: "Is it accessible?",
              description: "Title of the first item"
            },
            {
              name: "content1",
              type: "text",
              defaultValue: "Yes. It adheres to the WAI-ARIA design pattern.",
              description: "Content of the first item"
            },
            {
              name: "title2",
              type: "text",
              defaultValue: "Is it styled?",
              description: "Title of the second item"
            },
            {
              name: "content2",
              type: "text",
              defaultValue: "Yes. It comes with default styles that match the other components' aesthetic.",
              description: "Content of the second item"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[190px] items-center justify-center rounded-xl border border-border bg-background p-6">
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

      <PropsTable propsData={accordionPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Controls:</strong> Pressing <kbd className="bg-muted px-1 rounded text-[10px]">Enter</kbd> or <kbd className="bg-muted px-1 rounded text-[10px]">Space</kbd> on a focused trigger expands or collapses the panel, and <kbd className="bg-muted px-1 rounded text-[10px]">Up</kbd> / <kbd className="bg-muted px-1 rounded text-[10px]">Down</kbd> move between headers.</li>
          <li><strong>ARIA attributes:</strong> Uses Radix UI Accordion wrapper connecting triggers via <code className="text-primary font-mono text-[10px]">aria-controls</code> and <code className="text-primary font-mono text-[10px]">aria-expanded</code>.</li>
        </ul>
      </div>
    </section>
  );
}
