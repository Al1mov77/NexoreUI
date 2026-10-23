"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { Button, Toaster, toast } from "nexoreui";

const variants = [
  {
    name: "Default Toast Notification",
    component: (
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() =>
            toast("Deployment Started", {
              description: "Building production bundle for preview deployment.",
            })
          }
        >
          Trigger Default Toast
        </Button>
      </div>
    ),
    code: `import { toast } from "nexoreui"

<Button
  variant="outline"
  onClick={() =>
    toast("Deployment Started", {
      description: "Building production bundle for preview deployment.",
    })
  }
>
  Trigger Default Toast
</Button>`
  },
  {
    name: "Status Variants (Success, Warning, Error)",
    component: (
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() =>
            toast.success("Profile Updated", {
              description: "Your notification preferences have been saved.",
            })
          }
        >
          Success Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning("Rate Limit Warning", {
              description: "You have used 85% of your allocated monthly API requests.",
            })
          }
        >
          Warning Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error("Cluster Unreachable", {
              description: "Connection to database-primary timed out after 5000ms.",
            })
          }
        >
          Error Toast
        </Button>
      </div>
    ),
    code: `import { toast } from "nexoreui"

toast.success("Profile Updated", {
  description: "Your notification preferences have been saved.",
})

toast.warning("Rate Limit Warning", {
  description: "You have used 85% of your monthly quota.",
})

toast.error("Cluster Unreachable", {
  description: "Connection to database-primary timed out.",
})`
  },
  {
    name: "Toast with Action Button",
    component: (
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() =>
            toast("Branch merged into main", {
              description: "Pull request #412 has been merged cleanly.",
              action: {
                label: "Undo",
                onClick: () => toast("Revert action triggered"),
              },
            })
          }
        >
          Toast with Action
        </Button>
      </div>
    ),
    code: `import { toast } from "nexoreui"

toast("Branch merged into main", {
  description: "Pull request #412 has been merged cleanly.",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo triggered"),
  },
})`
  }
];

const toasterPropsData = [
  { name: "position", type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'", defaultValue: "'bottom-right'", description: "Placement of toasts on screen viewport.", required: false },
  { name: "expand", type: "boolean", defaultValue: "false", description: "Whether toasts should expand to full width on hover or click.", required: false },
  { name: "duration", type: "number", defaultValue: "4000", description: "Default display duration in milliseconds before dismiss.", required: false },
  { name: "visibleToasts", type: "number", defaultValue: "3", description: "Maximum number of stacked toasts displayed concurrently.", required: false },
  { name: "closeButton", type: "boolean", defaultValue: "false", description: "Render an explicit dismiss X button inside each toast.", required: false },
  { name: "richColors", type: "boolean", defaultValue: "false", description: "Render enriched contrast badges for success/error states.", required: false }
];

export function ToasterSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="toaster" className="space-y-10 scroll-mt-20">
      <Toaster />
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Toaster</h2>
        <p className="text-muted-foreground mt-1">
          Stackable toast notifications with auto-dismiss, swipe gesture support, and theme synchronization.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">Root Layout Setup</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Add the <code className="text-primary font-mono text-[11px]">&lt;Toaster /&gt;</code> component once inside your root <code className="font-mono text-[11px]">app/layout.tsx</code>. You can then trigger toasts from any client component via <code className="text-primary font-mono text-[11px]">toast()</code>.
        </p>
        <ComponentSource
          sourceCode={`// app/layout.tsx\nimport { Toaster } from "nexoreui"\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>\n        {children}\n        <Toaster />\n      </body>\n    </html>\n  )\n}`}
        />
      </div>

      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Examples</h3>
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

      <PropsTable propsData={toasterPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Screen Readers:</strong> Toasts are rendered inside an <code className="text-primary font-mono text-[10px]">aria-live="polite"</code> region, preventing interruption of active screen reader tasks.</li>
          <li><strong>Keyboard Dismiss:</strong> Interactive action buttons inside toasts can be navigated with <kbd className="bg-muted px-1 rounded text-[10px]">Tab</kbd>.</li>
          <li><strong>Focus Management:</strong> Triggering a toast does not yank cursor focus away from the current input or active workflow.</li>
        </ul>
      </div>
    </section>
  );
}
