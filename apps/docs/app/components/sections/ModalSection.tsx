"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Button } from "nexoreui";

const variants = [
  {
    name: "Basic Dialog",
    component: (
      <div className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Basic Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Basic Dialog</DialogTitle>
              <DialogDescription>This is a simple modal dialog that can be used for various purposes.</DialogDescription>
            </DialogHeader>
            <div className="py-4 text-sm text-muted-foreground">Main content goes here.</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    ),
    code: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Button } from "nexoreui"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Basic Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Basic Dialog</DialogTitle>
      <DialogDescription>This is a simple modal dialog.</DialogDescription>
    </DialogHeader>
    <div className="py-4 text-sm text-muted-foreground">Main content goes here.</div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`
  }
];

const modalPropsData = [
  { name: "variant", type: '"default" | "glass" | "destructive" | "success" | "fullscreen" | "drawer"', defaultValue: '"default"', description: "Visual style variant of the dialog content.", required: false },
  { name: "size", type: '"sm" | "md" | "lg" | "xl" | "2xl" | "full"', defaultValue: '"lg"', description: "Responsive width profile of the dialog.", required: false },
  { name: "scrollable", type: "boolean", defaultValue: "false", description: "Enables vertical scrolling within the dialog body if content overflows.", required: false }
];

const DialogPlaygroundWrapper = ({
  isOpen,
  onOpenChange,
  variant,
  size,
  title,
  description,
  confirmText,
  cancelText,
  scrollable,
  children
}: any) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent variant={variant} size={size} scrollable={scrollable}>
      {(title || description) && (
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
      )}
      <div className="py-4">{children}</div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{cancelText || "Cancel"}</Button>
        </DialogClose>
        <Button variant={variant === "destructive" ? "destructive" : "default"}>{confirmText || "Confirm"}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export function ModalSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="modals" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dialogs & Overlays</h2>
        <p className="text-muted-foreground mt-1">
          Dialogs, drawers, and overlays for focused actions, inputs, or critical confirmations built on a strict compound pattern.
        </p>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use which variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["default", "Standard popups — confirmations, simple forms, settings dialogs"],
            ["glass", "High-end marketing or dashboard modals needing premium backdrop-blur"],
            ["destructive", "Critical warnings — irreversible deletion, security confirmations"],
            ["success", "Positive confirmation — payment success, operation complete"],
            ["fullscreen", "Immersive workflows — large content editing, step-by-step wizards"],
            ["drawer", "Mobile-optimized views — slide-up panels from the bottom"],
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
          component={DialogPlaygroundWrapper}
          componentName="Dialog"
          importFrom="nexoreui"
          controls={[
            {
              name: "isOpen",
              type: "boolean",
              defaultValue: false,
              description: "Whether the dialog is open"
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "glass", "destructive", "success", "fullscreen", "drawer"],
              defaultValue: "default",
              description: "Visual theme of the dialog content"
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg", "xl", "2xl", "full"],
              defaultValue: "lg",
              description: "Size width of the dialog window"
            },
            {
              name: "title",
              type: "text",
              defaultValue: "Dialog Title",
              description: "Title of the dialog (Mapped to <DialogTitle>)"
            },
            {
              name: "description",
              type: "text",
              defaultValue: "This is a detailed description of the dialog action.",
              description: "Description of the dialog content (Mapped to <DialogDescription>)"
            },
            {
              name: "confirmText",
              type: "text",
              defaultValue: "Confirm",
              description: "Label for the confirm action button"
            },
            {
              name: "cancelText",
              type: "text",
              defaultValue: "Cancel",
              description: "Label for the cancel action button"
            },
            {
              name: "scrollable",
              type: "boolean",
              defaultValue: false,
              description: "Whether the body content is scrollable"
            },
            {
              name: "children",
              type: "text",
              defaultValue: "Provide modal details here. This can be form inputs, progress steps, or text explanation.",
              description: "Inner content of the modal dialog"
            }
          ]}
        />
      </div>

      {/* Main variants */}
      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight font-mono text-zinc-300">Showcase & Examples</h3>
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
      <PropsTable propsData={modalPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Navigation:</strong> Pressing <kbd className="bg-muted px-1 rounded text-[10px]">Tab</kbd> cycles focus through interactive elements inside the modal. Pressing <kbd className="bg-muted px-1 rounded text-[10px]">Escape</kbd> closes the modal.</li>
          <li><strong>Aria Attributes:</strong> Built on top of Radix UI Dialog, automatically supplying proper ARIA roles (<code className="text-primary font-mono text-[10px]">role="dialog"</code>), <code className="text-primary font-mono text-[10px]">aria-describedby</code>, and <code className="text-primary font-mono text-[10px]">aria-labelledby</code> attributes.</li>
          <li><strong>Focus Restoration:</strong> Automatically returns focus to the trigger element when the modal is closed.</li>
        </ul>
      </div>
    </section>
  )
}
