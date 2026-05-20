"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { Alert, CyberAlert, SoftAlert, MinimalAlert, LeftBorderAlert, IconTopAlert, SolidAlert, BannerAlert, NeonAlert, GlassAlert, Button } from "nexoreui";

const variants = [
  {
    name: "Default Alert",
    component: <Alert title="Info" description="This is a default alert message." />,
    code: `import { Alert } from "nexoreui"\n\n<Alert title="Info" description="This is a default alert message." />`
  },
  {
    name: "Cyber Alert",
    component: <CyberAlert title="SYSTEM WARNING" description="Unauthorized access detected." variant="danger" />,
    code: `import { CyberAlert } from "nexoreui"\n\n<CyberAlert title="SYSTEM WARNING" description="Unauthorized access detected." variant="danger" />`
  },
  {
    name: "Soft Alert",
    component: <SoftAlert title="Success" description="Your profile has been updated." variant="success" />,
    code: `import { SoftAlert } from "nexoreui"\n\n<SoftAlert title="Success" description="Your profile has been updated." variant="success" />`
  },
  {
    name: "Minimal Alert",
    component: <MinimalAlert title="Note" description="Please complete your registration." />,
    code: `import { MinimalAlert } from "nexoreui"\n\n<MinimalAlert title="Note" description="Please complete your registration." />`
  },
  {
    name: "Left Border Alert",
    component: <LeftBorderAlert title="Warning" description="Your subscription expires soon." variant="warning" />,
    code: `import { LeftBorderAlert } from "nexoreui"\n\n<LeftBorderAlert title="Warning" description="Your subscription expires soon." variant="warning" />`
  },
  {
    name: "Icon Top Alert",
    component: <IconTopAlert title="Update Available" description="Version 2.0 is ready to install." />,
    code: `import { IconTopAlert } from "nexoreui"\n\n<IconTopAlert title="Update Available" description="Version 2.0 is ready to install." />`
  },
  {
    name: "Solid Alert",
    component: <SolidAlert title="Error" description="Failed to connect to the database." variant="error" />,
    code: `import { SolidAlert } from "nexoreui"\n\n<SolidAlert title="Error" description="Failed to connect to the database." variant="error" />`
  },
  {
    name: "Banner Alert",
    component: <BannerAlert message="We are experiencing degraded performance." variant="warning" />,
    code: `import { BannerAlert } from "nexoreui"\n\n<BannerAlert message="We are experiencing degraded performance." variant="warning" />`
  },
  {
    name: "Neon Alert",
    component: <NeonAlert title="Achievement Unlocked" description="You've reached level 10!" variant="primary" />,
    code: `import { NeonAlert } from "nexoreui"\n\n<NeonAlert title="Achievement Unlocked" description="You've reached level 10!" variant="primary" />`
  },
  {
    name: "Glass Alert",
    component: <GlassAlert title="New Feature" description="Check out the new dashboard layout." />,
    code: `import { GlassAlert } from "nexoreui"\n\n<GlassAlert title="New Feature" description="Check out the new dashboard layout." />`
  }
];

export function AlertSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="alerts" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alerts</h2>
          <p className="text-muted-foreground">Attention-grabbing components to display important messages.</p>
        </div>
      </div>

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
              options: ["default", "destructive", "success", "warning", "info", "glass"],
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
              defaultValue: "Please update your payment settings immediately.",
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

      <div className="space-y-12">
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
    </section>
  )
}
