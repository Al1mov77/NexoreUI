"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { Modal, BasicModal, DangerModal, InteractiveGlassModal, GlassModal, AlertModal, SuccessModal, CommandPaletteModal, Button } from "nexoreui";

const variants = [
  {
    name: "Basic Modal",
    component: <div className="p-4"><BasicModal /></div>,
    code: `import { BasicModal } from "nexoreui"\n\n<BasicModal />`
  },
  {
    name: "Danger Modal",
    component: <div className="p-4"><DangerModal /></div>,
    code: `import { DangerModal } from "nexoreui"\n\n<DangerModal />`
  },
  {
    name: "Interactive Glass Modal",
    component: <div className="p-4"><InteractiveGlassModal /></div>,
    code: `import { InteractiveGlassModal } from "nexoreui"\n\n<InteractiveGlassModal />`
  },
  {
    name: "Glass Modal",
    component: <div className="p-4"><GlassModal trigger={<Button>Glass UI</Button>} title="Glass Effect" description="This is a glassmorphic background."><div className="py-4">Content here</div></GlassModal></div>,
    code: `import { GlassModal } from "nexoreui"\n\n<GlassModal trigger={<Button>Glass UI</Button>}>...</GlassModal>`
  },
  {
    name: "Alert Modal",
    component: <div className="p-4"><AlertModal trigger={<Button variant="destructive">Show Alert</Button>} title="Operation failed" description="Please try again." onConfirm={() => alert("Confirmed")}><div className="py-2">Error details here.</div></AlertModal></div>,
    code: `import { AlertModal } from "nexoreui"\n\n<AlertModal trigger={<Button>Show Alert</Button>} title="Failed" />`
  },
  {
    name: "Success Modal",
    component: <div className="p-4"><SuccessModal trigger={<Button className="bg-green-500 hover:bg-green-600 text-white">Show Success</Button>} title="Saved successfully" description="All good!"><div className="py-2">Your changes have been saved.</div></SuccessModal></div>,
    code: `import { SuccessModal } from "nexoreui"\n\n<SuccessModal trigger={<Button>Show Success</Button>} title="Saved" />`
  },
  {
    name: "Command Palette Modal",
    component: <div className="p-4"><CommandPaletteModal trigger={<Button variant="outline">Open Command Menu</Button>} /></div>,
    code: `import { CommandPaletteModal } from "nexoreui"\n\n<CommandPaletteModal trigger={<Button>Open</Button>} />`
  }
];

export function ModalSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="modals" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Modals & Overlays</h2>
          <p className="text-muted-foreground">Dialogs, drawers, and overlays for focused tasks.</p>
        </div>
      </div>

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
  )
}
