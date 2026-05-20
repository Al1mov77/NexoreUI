"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { SimpleTooltip, RichTooltip, Tooltip, TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider, Button } from "nexoreui";
import { Info } from "lucide-react";

const variants = [
  {
    name: "Simple Tooltip (Top)",
    component: <SimpleTooltip content="This is a simple tooltip" position="top"><Button variant="outline">Hover me</Button></SimpleTooltip>,
    code: `import { SimpleTooltip } from "nexoreui"\n\n<SimpleTooltip content="This is a simple tooltip" position="top">\n  <Button>Hover me</Button>\n</SimpleTooltip>`
  },
  {
    name: "Simple Tooltip (Bottom)",
    component: <SimpleTooltip content="Bottom positioned" position="bottom"><Button variant="outline">Hover me (Bottom)</Button></SimpleTooltip>,
    code: `import { SimpleTooltip } from "nexoreui"\n\n<SimpleTooltip content="Bottom positioned" position="bottom">\n  <Button>Hover me</Button>\n</SimpleTooltip>`
  },
  {
    name: "Simple Tooltip (Left)",
    component: <SimpleTooltip content="Left positioned" position="left"><Button variant="outline">Hover me (Left)</Button></SimpleTooltip>,
    code: `import { SimpleTooltip } from "nexoreui"\n\n<SimpleTooltip content="Left positioned" position="left">\n  <Button>Hover me</Button>\n</SimpleTooltip>`
  },
  {
    name: "Simple Tooltip (Right)",
    component: <SimpleTooltip content="Right positioned" position="right"><Button variant="outline">Hover me (Right)</Button></SimpleTooltip>,
    code: `import { SimpleTooltip } from "nexoreui"\n\n<SimpleTooltip content="Right positioned" position="right">\n  <Button>Hover me</Button>\n</SimpleTooltip>`
  },
  {
    name: "Rich Tooltip",
    component: <RichTooltip content={<div className="p-2"><h4 className="font-bold">Rich Content</h4><p className="text-sm">With HTML inside</p></div>}><Button variant="outline">Rich Hover</Button></RichTooltip>,
    code: `import { RichTooltip } from "nexoreui"\n\n<RichTooltip content={<div>Rich content</div>}>\n  <Button>Rich Hover</Button>\n</RichTooltip>`
  },
  {
    name: "Icon Tooltip",
    component: <SimpleTooltip content="More info needed"><Button variant="ghost" size="icon"><Info className="h-5 w-5" /></Button></SimpleTooltip>,
    code: `<SimpleTooltip content="More info needed">\n  <Button variant="ghost" size="icon"><Info /></Button>\n</SimpleTooltip>`
  },
  {
    name: "Standard Tooltip (Provider)",
    component: (
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger asChild><Button variant="outline">Standard Tooltip</Button></TooltipTrigger>
          <TooltipContent><p>Add to library</p></TooltipContent>
        </TooltipRoot>
      </TooltipProvider>
    ),
    code: `import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider } from "nexoreui"\n\n<TooltipProvider>\n  <TooltipRoot>\n    <TooltipTrigger>Hover</TooltipTrigger>\n    <TooltipContent><p>Info</p></TooltipContent>\n  </TooltipRoot>\n</TooltipProvider>`
  },
  {
    name: "Tooltip with Delay",
    component: (
      <TooltipProvider delayDuration={700}>
        <TooltipRoot>
          <TooltipTrigger asChild><Button variant="outline">Delayed Hover</Button></TooltipTrigger>
          <TooltipContent><p>Appears after 700ms</p></TooltipContent>
        </TooltipRoot>
      </TooltipProvider>
    ),
    code: `import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider } from "nexoreui"\n\n<TooltipProvider delayDuration={700}>\n  <TooltipRoot>\n    <TooltipTrigger>Delayed</TooltipTrigger>\n    <TooltipContent><p>Delayed info</p></TooltipContent>\n  </TooltipRoot>\n</TooltipProvider>`
  },
  {
    name: "Tooltip with Offset",
    component: (
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger asChild><Button variant="outline">Offset 20px</Button></TooltipTrigger>
          <TooltipContent sideOffset={20}><p>Further away</p></TooltipContent>
        </TooltipRoot>
      </TooltipProvider>
    ),
    code: `<TooltipContent sideOffset={20}>\n  <p>Further away</p>\n</TooltipContent>`
  },
  {
    name: "Long Text Tooltip",
    component: <SimpleTooltip content="This is a very long tooltip text that might need to wrap to multiple lines depending on the max-width settings of the component."><Button variant="outline">Long Text</Button></SimpleTooltip>,
    code: `<SimpleTooltip content="Very long text...">\n  <Button>Hover</Button>\n</SimpleTooltip>`
  }
];

const TooltipPlayground = (props: any) => {
  return (
    <Tooltip {...props}>
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  );
};

export function TooltipSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="tooltips" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tooltips</h2>
          <p className="text-muted-foreground">Popup information displayed on hover or focus.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={TooltipPlayground}
          componentName="Tooltip"
          importFrom="nexoreui"
          controls={[
            {
              name: "content",
              type: "text",
              defaultValue: "Tooltip text",
              description: "The information text displayed inside the popup window"
            },
            {
              name: "side",
              type: "select",
              options: ["top", "bottom", "left", "right"],
              defaultValue: "top",
              description: "Position of the tooltip relative to the trigger button"
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "dark", "light"],
              defaultValue: "default",
              description: "Theme styles: default, dark, or light"
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
