"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { Modal, BasicModal, DangerModal, InteractiveGlassModal, GlassModal, AlertModal, SuccessModal, CommandPaletteModal, Button } from "nexoreui";

const variants = [
  {
    name: "Basic Modal",
    component: (
      <div className="p-4">
        <BasicModal trigger={<Button>Open Basic Modal</Button>} />
      </div>
    ),
    code: `import { BasicModal, Button } from "nexoreui"\n\n<BasicModal trigger={<Button>Open Basic Modal</Button>} />`
  },
  {
    name: "Danger Modal",
    component: (
      <div className="p-4">
        <DangerModal trigger={<Button variant="destructive">Open Danger Modal</Button>} />
      </div>
    ),
    code: `import { DangerModal, Button } from "nexoreui"\n\n<DangerModal trigger={<Button variant="destructive">Open Danger Modal</Button>} />`
  },
  {
    name: "Interactive Glass Modal",
    component: (
      <div className="p-4">
        <InteractiveGlassModal trigger={<Button variant="glow">Open Glass Modal</Button>} />
      </div>
    ),
    code: `import { InteractiveGlassModal, Button } from "nexoreui"\n\n<InteractiveGlassModal trigger={<Button variant="glow">Open Glass Modal</Button>} />`
  },
  {
    name: "Glass Modal",
    component: (
      <div className="p-4">
        <GlassModal trigger={<Button>Glass UI</Button>} title="Glass Effect" description="This is a glassmorphic background.">
          <div className="py-4 text-sm text-muted-foreground">Frosted glass backdrop overlay content.</div>
        </GlassModal>
      </div>
    ),
    code: `import { GlassModal, Button } from "nexoreui"\n\n<GlassModal trigger={<Button>Glass UI</Button>} title="Glass Effect" description="Frosted glass overlay.">\n  <div className="py-4">Content here</div>\n</GlassModal>`
  },
  {
    name: "Alert Modal",
    component: (
      <div className="p-4">
        <AlertModal trigger={<Button variant="destructive">Show Alert</Button>} title="Operation failed" description="Please try again." onConfirm={() => alert("Confirmed")}>
          <div className="py-2 text-sm text-muted-foreground">Error details here.</div>
        </AlertModal>
      </div>
    ),
    code: `import { AlertModal, Button } from "nexoreui"\n\n<AlertModal trigger={<Button variant="destructive">Show Alert</Button>} title="Failed" />`
  },
  {
    name: "Success Modal",
    component: (
      <div className="p-4">
        <SuccessModal trigger={<Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">Show Success</Button>} title="Saved successfully" description="All good!">
          <div className="py-2 text-sm text-muted-foreground">Your changes have been saved.</div>
        </SuccessModal>
      </div>
    ),
    code: `import { SuccessModal, Button } from "nexoreui"\n\n<SuccessModal trigger={<Button className="bg-green-600 hover:bg-green-700 text-white">Show Success</Button>} title="Saved" />`
  },
  {
    name: "Command Palette Modal",
    component: (
      <div className="p-4">
        <CommandPaletteModal trigger={<Button variant="outline">Open Command Menu</Button>} />
      </div>
    ),
    code: `import { CommandPaletteModal, Button } from "nexoreui"\n\n<CommandPaletteModal trigger={<Button>Open</Button>} />`
  }
];

const modalPropsData = [
  { name: "title", type: "React.ReactNode", defaultValue: "—", description: "Title heading shown at the top of the modal.", required: false },
  { name: "description", type: "React.ReactNode", defaultValue: "—", description: "Description or supporting text displayed below the title.", required: false },
  { name: "isOpen", type: "boolean", defaultValue: "false", description: "Controlled open state of the modal.", required: false },
  { name: "onOpenChange", type: "(open: boolean) => void", defaultValue: "—", description: "Callback triggered when open state changes (open, close, Escape, backdrop click).", required: false },
  { name: "trigger", type: "React.ReactNode", defaultValue: "—", description: "Element that triggers the modal open on click.", required: false },
  { name: "confirmText", type: "string", defaultValue: '"Confirm"', description: "Label for the primary confirm action button.", required: false },
  { name: "cancelText", type: "string", defaultValue: '"Cancel"', description: "Label for the cancel action button.", required: false },
  { name: "onConfirm", type: "() => void", defaultValue: "—", description: "Callback triggered when the primary button is clicked.", required: false },
  { name: "onCancel", type: "() => void", defaultValue: "—", description: "Callback triggered when the cancel button is clicked.", required: false },
  { name: "variant", type: '"default" | "glass" | "destructive" | "success" | "fullscreen" | "drawer"', defaultValue: '"default"', description: "Visual style variant of the modal window layout.", required: false },
  { name: "size", type: '"sm" | "md" | "lg" | "xl" | "2xl" | "full"', defaultValue: '"lg"', description: "Responsive width profile of the modal.", required: false },
  { name: "scrollable", type: "boolean", defaultValue: "false", description: "Enables vertical scrolling within the modal body if content overflows.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names for the Modal content element.", required: false }
];

export function ModalSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="modals" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Modals & Overlays</h2>
        <p className="text-muted-foreground mt-1">
          Dialogs, drawers, and overlays for focused actions, inputs, or critical confirmations.
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
          component={Modal}
          componentName="Modal"
          importFrom="nexoreui"
          controls={[
            {
              name: "isOpen",
              type: "boolean",
              defaultValue: false,
              description: "Whether the modal is open"
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "glass", "destructive", "success", "fullscreen", "drawer"],
              defaultValue: "default",
              description: "Visual theme of the modal"
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg", "xl", "2xl", "full"],
              defaultValue: "lg",
              description: "Size width of the modal window"
            },
            {
              name: "title",
              type: "text",
              defaultValue: "Modal Title",
              description: "Title of the modal"
            },
            {
              name: "description",
              type: "text",
              defaultValue: "This is a detailed description of the modal action.",
              description: "Description of the modal content"
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
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Navigation:</strong> Pressing <kbd className="bg-muted px-1 rounded text-[10px]">Tab</kbd> cycles focus through interactive elements inside the modal. Pressing <kbd className="bg-muted px-1 rounded text-[10px]">Escape</kbd> closes the modal.</li>
          <li><strong>Aria Attributes:</strong> Built on top of Radix UI Dialog, automatically supplying proper ARIA roles (<code className="text-primary font-mono text-[10px]">role="dialog"</code>), <code className="text-primary font-mono text-[10px]">aria-describedby</code>, and <code className="text-primary font-mono text-[10px]">aria-labelledby</code> attributes.</li>
          <li><strong>Focus Restoration:</strong> Automatically returns focus to the trigger element when the modal is closed.</li>
        </ul>
      </div>
    </section>
  )
}
