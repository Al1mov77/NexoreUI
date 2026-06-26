"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { Alert, CyberAlert, SoftAlert, MinimalAlert, LeftBorderAlert, IconTopAlert, SolidAlert, BannerAlert, NeonAlert, GlassAlert, Button } from "nexoreui";

const variants = [
  {
    name: "Default Alert (Automatic Info)",
    component: <Alert variant="default" title="Information Update" description="A new system build has been successfully deployed." />,
    code: `import { Alert } from "nexoreui"\n\n<Alert title="Information Update" description="A new system build has been successfully deployed." />`
  },
  {
    name: "Dismissible Warning Alert",
    component: <Alert variant="warning" title="Subscription Warning" description="Your credit card is expiring next week." dismissible onDismiss={() => alert("Dismissed!")} />,
    code: `import { Alert } from "nexoreui"\n\n<Alert \n  variant="warning" \n  title="Subscription Warning" \n  description="Your credit card is expiring next week." \n  dismissible \n  onDismiss={() => console.log('dismissed')}\n/>`
  },
  {
    name: "Success Alert",
    component: <Alert variant="success" title="Success" description="All files have been uploaded correctly to S3." />,
    code: `import { Alert } from "nexoreui"\n\n<Alert variant="success" title="Success" description="All files uploaded correctly." />`
  },
  {
    name: "Destructive Alert (Error)",
    component: <Alert variant="destructive" title="Database Error" description="Could not connect to localhost:5432. Connection refused." />,
    code: `import { Alert } from "nexoreui"\n\n<Alert variant="destructive" title="Database Error" description="..." />`
  },
  {
    name: "Cyber Alert (Retro)",
    component: <CyberAlert title="SYSTEM WARNING" description="Unauthorized access detected." variant="danger" />,
    code: `import { CyberAlert } from "nexoreui"\n\n<CyberAlert title="SYSTEM WARNING" description="Unauthorized access detected." variant="danger" />`
  },
  {
    name: "Soft Alert",
    component: <SoftAlert title="Saved" description="Your profile settings have been updated." variant="success" />,
    code: `import { SoftAlert } from "nexoreui"\n\n<SoftAlert title="Saved" description="..." variant="success" />`
  },
  {
    name: "Minimal Alert",
    component: <MinimalAlert title="Notice" description="Please fill in your billing details." />,
    code: `import { MinimalAlert } from "nexoreui"\n\n<MinimalAlert title="Notice" description="..." />`
  },
  {
    name: "Banner Alert",
    component: <BannerAlert message="We are currently experiencing database degradation." variant="warning" />,
    code: `import { BannerAlert } from "nexoreui"\n\n<BannerAlert message="Database degradation warning." variant="warning" />`
  },
  {
    name: "Neon Alert",
    component: <NeonAlert title="Achievement Unlocked" description="You reached Level 5!" variant="primary" />,
    code: `import { NeonAlert } from "nexoreui"\n\n<NeonAlert title="Achievement Unlocked" description="..." variant="primary" />`
  },
  {
    name: "Glass Alert",
    component: <GlassAlert title="New Layout" description="Try out the new translucent dark theme option." />,
    code: `import { GlassAlert } from "nexoreui"\n\n<GlassAlert title="New Layout" description="..." />`
  }
];

const alertPropsData = [
  { name: "variant", type: '"default" | "destructive" | "success" | "warning" | "info" | "glass" | "floating" | "minimal" | "neon" | "cyberpunk" | "gradient" | "banner"', defaultValue: '"default"', description: "Visual style of the alert layout.", required: false },
  { name: "title", type: "React.ReactNode", defaultValue: "—", description: "Title heading text of the alert.", required: false },
  { name: "description", type: "React.ReactNode", defaultValue: "—", description: "Supporting message description text.", required: false },
  { name: "icon", type: "React.ReactNode", defaultValue: "—", description: "Custom Lucide icon element (supplied automatically based on variant if empty).", required: false },
  { name: "dismissible", type: "boolean", defaultValue: "false", description: "Whether the user can close the alert by clicking a close 'X' button.", required: false },
  { name: "onDismiss", type: "() => void", defaultValue: "—", description: "Callback triggered when the close button is clicked.", required: false },
  { name: "animate", type: "boolean", defaultValue: "true", description: "Enables slide-in slide-out entry animations.", required: false },
  { name: "actionText", type: "string", defaultValue: "—", description: "Label of action buttons on banner layout alerts.", required: false },
  { name: "onAction", type: "() => void", defaultValue: "—", description: "Action callback triggered by action button clicks.", required: false },
];

export function AlertSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="alerts" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alerts</h2>
          <p className="text-muted-foreground mt-1">Attention-grabbing components to highlight alerts, success, and warnings.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use which variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["default / info", "Standard informational statuses, updates, system notices"],
            ["success", "Confirming positive operations completed successfully (profile saved, payment completed)"],
            ["warning", "Non-blocking notifications requiring direct attention (subscription ending, resource thresholds)"],
            ["destructive", "Blocking errors, action failures, network connection disruptions"],
            ["minimal", "Low-priority notifications inside content blocks or dashboards sidebars"],
            ["banner", "Top-level full-screen announcements or urgent alerts alerts"],
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
          component={Alert}
          componentName="Alert"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "destructive", "success", "warning", "info", "glass", "minimal", "neon", "gradient"],
              defaultValue: "default",
              description: "Visual style of the alert"
            },
            {
              name: "title",
              type: "text",
              defaultValue: "Attention Needed",
              description: "Title of the alert"
            },
            {
              name: "description",
              type: "text",
              defaultValue: "Please review your account details before continuing.",
              description: "Description text of the alert"
            },
            {
              name: "animate",
              type: "boolean",
              defaultValue: true,
              description: "Whether to enable entry slide-in animation"
            },
            {
              name: "dismissible",
              type: "boolean",
              defaultValue: false,
              description: "Whether the alert can be closed by the user"
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
                <div className="w-full max-w-md">{item.component}</div>
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
      <PropsTable propsData={alertPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Alert Role:</strong> The component automatically sets <code className="text-primary font-mono text-[10px]">role="alert"</code>, informing screen readers of high-priority content updates instantly.</li>
          <li><strong>Keyboard Close:</strong> If <code className="text-primary font-mono text-[10px]">dismissible</code> is set, focus lands on the close button which is tab-focusable and clickable via <kbd className="bg-muted px-1 rounded text-[10px]">Space</kbd> or <kbd className="bg-muted px-1 rounded text-[10px]">Enter</kbd>.</li>
        </ul>
      </div>
    </section>
  )
}
