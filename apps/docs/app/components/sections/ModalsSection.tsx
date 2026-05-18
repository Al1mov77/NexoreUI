"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import {
  Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription,
  Drawer, ContextMenu, Button
} from "nexoreui";

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Drawer Panel">
        <p className="text-muted-foreground">This is a bottom sheet style drawer with smooth spring animation.</p>
      </Drawer>
    </>
  )
}

function SideDrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Side Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="right" title="Settings">
        <p className="text-muted-foreground">Slide-in panel from the right side.</p>
      </Drawer>
    </>
  )
}

const variants = [
  {
    name: "Standard Dialog",
    component: (
      <Dialog>
        <DialogTrigger asChild><Button>Open Dialog</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here.</DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">Profile form goes here.</div>
        </DialogContent>
      </Dialog>
    ),
    code: `import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "nexoreui"\n\n<Dialog>\n  <DialogTrigger>Open</DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Edit Profile</DialogTitle>\n    </DialogHeader>\n    <div>Content</div>\n  </DialogContent>\n</Dialog>`
  },
  {
    name: "Bottom Drawer",
    component: <DrawerDemo />,
    code: `import { Drawer } from "nexoreui"\n\n<Drawer open={open} onClose={() => setOpen(false)} title="Drawer">\n  <p>Content</p>\n</Drawer>`
  },
  {
    name: "Side Drawer (Right)",
    component: <SideDrawerDemo />,
    code: `import { Drawer } from "nexoreui"\n\n<Drawer\n  open={open}\n  onClose={() => setOpen(false)}\n  side="right"\n  title="Settings"\n>\n  <p>Content</p>\n</Drawer>`
  },
  {
    name: "Context Menu",
    component: (
      <ContextMenu
        items={[
          { label: "Copy", shortcut: "⌘C" },
          { label: "Cut", shortcut: "⌘X" },
          { label: "Paste", shortcut: "⌘V" },
          { separator: true, label: "" },
          { label: "Delete", shortcut: "⌫", destructive: true },
        ]}
      >
        <div className="p-8 border-2 border-dashed rounded-xl bg-secondary/30 text-center cursor-context-menu text-sm text-muted-foreground">
          Right-click here
        </div>
      </ContextMenu>
    ),
    code: `import { ContextMenu } from "nexoreui"\n\n<ContextMenu items={[\n  { label: "Copy", shortcut: "⌘C" },\n  { label: "Delete", destructive: true }\n]}>\n  <div>Right click me</div>\n</ContextMenu>`
  },
];

export function ModalsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="modals-premium" className="space-y-8 scroll-mt-20">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Premium Overlays</h2>
        <p className="text-sm text-muted-foreground mt-1">Dialogs, drawers, context menus, and more.</p>
      </div>
      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-base font-medium">{item.name}</h3>
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
