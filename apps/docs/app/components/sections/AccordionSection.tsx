"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Button } from "nexoreui";

const variants = [
  {
    name: "Default Accordion",
    component: (
      <Accordion type="single" collapsible className="w-full max-w-sm">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "nexoreui"\n\n<Accordion type="single" collapsible>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Is it accessible?</AccordionTrigger>\n    <AccordionContent>Yes.</AccordionContent>\n  </AccordionItem>\n</Accordion>`
  },
  {
    name: "Multiple Accordion",
    component: (
      <Accordion type="multiple" className="w-full max-w-sm">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `<Accordion type="multiple">\n  <AccordionItem value="1">\n    {/* ... */}\n  </AccordionItem>\n</Accordion>`
  },
  {
    name: "Glass Accordion",
    component: (
      <div className="w-full h-full min-h-[250px] flex items-start pt-10 justify-center bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center p-6 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-background/50"></div>
        <Accordion type="single" collapsible variant="glass" className="w-full max-w-sm relative z-10">
          <AccordionItem value="item-1">
            <AccordionTrigger>Glass Style</AccordionTrigger>
            <AccordionContent>This uses backdrop-blur and semi-transparent backgrounds over an image.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Premium Look</AccordionTrigger>
            <AccordionContent>Perfect for marketing pages.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ),
    code: `<Accordion type="single" collapsible variant="glass">\n  {/* items */}\n</Accordion>`
  },
  {
    name: "Outline Accordion",
    component: (
      <Accordion type="single" collapsible variant="outline" className="w-full max-w-sm mt-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>Outline Border</AccordionTrigger>
          <AccordionContent>A clean, bordered look.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `<Accordion type="single" collapsible variant="outline">\n  {/* items */}\n</Accordion>`
  },
  {
    name: "Neon Accordion",
    component: (
      <div className="w-full h-full min-h-[200px] flex items-start pt-10 justify-center bg-black p-6 rounded-xl">
        <Accordion type="single" collapsible variant="neon" className="w-full max-w-sm">
          <AccordionItem value="item-1" variant="neon">
            <AccordionTrigger variant="neon">Premium Features</AccordionTrigger>
            <AccordionContent className="px-4 text-neutral-400">Access to exclusive animated components and premium layouts.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ),
    code: `<Accordion type="single" collapsible variant="neon">\n  <AccordionItem value="item-1" variant="neon">\n    <AccordionTrigger variant="neon">Premium Features</AccordionTrigger>\n    {/* ... */}\n  </AccordionItem>\n</Accordion>`
  },
  {
    name: "Plus Icon Accordion",
    component: (
      <Accordion type="single" collapsible className="w-full max-w-sm">
        <AccordionItem value="item-1">
          <AccordionTrigger iconType="plus">How do I install it?</AccordionTrigger>
          <AccordionContent>You can install it via pnpm, npm, or yarn using the CLI.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `<AccordionTrigger iconType="plus">\n  How do I install it?\n</AccordionTrigger>`
  },
  {
    name: "Disabled Accordion",
    component: (
      <Accordion type="single" collapsible className="w-full max-w-sm">
        <AccordionItem value="item-1" disabled>
          <AccordionTrigger>Disabled Item</AccordionTrigger>
          <AccordionContent>You cannot see me</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `<AccordionItem value="item-1" disabled>\n  <AccordionTrigger>Disabled Item</AccordionTrigger>\n</AccordionItem>`
  }
];

const accordionPropsData = [
  { name: "type", type: '"single" | "multiple"', defaultValue: "—", description: "Whether one or multiple items can be expanded at the same time.", required: true },
  { name: "collapsible", type: "boolean", defaultValue: "false", description: "When type is 'single', allows expanding items to be collapsed.", required: false },
  { name: "variant", type: '"default" | "glass" | "outline" | "neon"', defaultValue: '"default"', description: "Visual style variant of the accordion.", required: false },
  { name: "defaultValue", type: "string | string[]", defaultValue: "—", description: "Value of the item(s) to expand by default.", required: false },
  { name: "value", type: "string | string[]", defaultValue: "—", description: "Controlled value of expanded item(s).", required: false },
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
  content2
}: any) => (
  <div className={variant === "glass" ? "p-8 w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background rounded-xl" : variant === "neon" ? "p-8 bg-black rounded-xl w-full" : "w-full"}>
    <Accordion type={type} collapsible={type === "single" ? collapsible : undefined} variant={variant} className="w-full max-w-sm mx-auto">
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Accordions</h2>
          <p className="text-muted-foreground mt-1">A vertically stacked set of collapsible panels for organizing content.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["FAQ sections", "Displaying answers to complex or specific product questions without cluttering the main layout"],
            ["compact forms / sidebar settings", "Grouping complex sets of advanced configurations (e.g. SMTP config, SMTP logs)"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive playground */}
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
              options: ["default", "glass", "outline", "neon"],
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
              <div className="flex min-h-[200px] items-start pt-10 justify-center rounded-xl border border-border bg-background p-6 relative overflow-hidden">
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
      <PropsTable propsData={accordionPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Controls:</strong> Supports standard keyboard controls. Pressing <kbd className="bg-muted px-1 rounded text-[10px]">Enter</kbd> or <kbd className="bg-muted px-1 rounded text-[10px]">Space</kbd> on a focused heading triggers expand/collapse.</li>
          <li><strong>ARIA attributes:</strong> Uses Radix UI Accordion wrapper, connecting triggers via <code className="text-primary font-mono text-[10px]">aria-controls</code> and mapping state via <code className="text-primary font-mono text-[10px]">aria-expanded</code>.</li>
        </ul>
      </div>
    </section>
  );
}
