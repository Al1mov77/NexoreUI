"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Switch,
} from "nexoreui";

const variants = [
  {
    name: "Project Settings Card",
    component: (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>Deploy a new edge service in under 30 seconds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input label="Project Name" placeholder="billing-worker" />
        </CardContent>
        <CardFooter className="justify-between gap-2 pt-4 border-t border-border">
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Create Project</Button>
        </CardFooter>
      </Card>
    ),
    code: `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
} from "nexoreui";

export default function ProjectCardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>Deploy a new edge service in under 30 seconds.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input label="Project Name" placeholder="billing-worker" />
      </CardContent>
      <CardFooter className="justify-between gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Create Project</Button>
      </CardFooter>
    </Card>
  );
}`
  },
  {
    name: "Metric Summary Card",
    component: (
      <Card variant="bento" className="w-full max-w-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">Monthly Recurring Revenue</CardTitle>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/20 tabular-nums">
              +14.2%
            </span>
          </div>
          <CardDescription>Rolling 30-day net billing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono tracking-tight text-foreground tabular-nums">
            $124,500
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 tabular-nums">
            342 active team subscriptions
          </p>
        </CardContent>
      </Card>
    ),
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "nexoreui";

export default function MetricCardDemo() {
  return (
    <Card variant="bento" className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Monthly Recurring Revenue</CardTitle>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/20 tabular-nums">
            +14.2%
          </span>
        </div>
        <CardDescription>Rolling 30-day net billing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-mono tracking-tight tabular-nums">
          $124,500
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 tabular-nums">
          342 active team subscriptions
        </p>
      </CardContent>
    </Card>
  );
}`
  },
  {
    name: "Spotlight Tracking Card",
    component: (
      <Card variant="spotlight" className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Edge Key Rotation</CardTitle>
          <CardDescription>
            Move your pointer across the surface to inspect the radial spotlight illumination.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs font-mono text-muted-foreground space-y-1.5">
          <div className="flex justify-between">
            <span>Rotation schedule</span>
            <span className="text-foreground">Every 30 days</span>
          </div>
          <div className="flex justify-between">
            <span>Active replicas</span>
            <span className="text-foreground tabular-nums">18 regions</span>
          </div>
        </CardContent>
      </Card>
    ),
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "nexoreui";

export default function SpotlightCardDemo() {
  return (
    <Card variant="spotlight" className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Edge Key Rotation</CardTitle>
        <CardDescription>
          Move your pointer across the surface to inspect the radial spotlight illumination.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs font-mono text-muted-foreground space-y-1.5">
        <div className="flex justify-between">
          <span>Rotation schedule</span>
          <span className="text-foreground">Every 30 days</span>
        </div>
        <div className="flex justify-between">
          <span>Active replicas</span>
          <span className="text-foreground tabular-nums">18 regions</span>
        </div>
      </CardContent>
    </Card>
  );
}`
  },
  {
    name: "Interactive 3D Flip Spec Card",
    component: (
      <div className="w-full max-w-sm">
        <Card
          variant="flip"
          backContent={
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Hardware Specification
              </p>
              <p className="text-sm font-semibold text-foreground">
                CNC Milled 6061 Aluminum · 1.42 kg
              </p>
              <p className="text-xs text-muted-foreground">
                Click or move pointer away to return to front view.
              </p>
            </div>
          }
        >
          <CardHeader>
            <CardTitle>Enclosure Chassis</CardTitle>
            <CardDescription>Hover or tap to inspect back specifications.</CardDescription>
          </CardHeader>
          <CardFooter className="text-xs font-mono text-muted-foreground">
            Front Face · View Details
          </CardFooter>
        </Card>
      </div>
    ),
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "nexoreui";

export default function FlipCardDemo() {
  return (
    <Card
      variant="flip"
      className="w-full max-w-sm"
      backContent={
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Hardware Specification
          </p>
          <p className="text-sm font-semibold text-foreground">
            CNC Milled 6061 Aluminum · 1.42 kg
          </p>
        </div>
      }
    >
      <CardHeader>
        <CardTitle>Enclosure Chassis</CardTitle>
        <CardDescription>Hover or tap to inspect back specifications.</CardDescription>
      </CardHeader>
      <CardFooter className="text-xs font-mono text-muted-foreground">
        Front Face · View Details
      </CardFooter>
    </Card>
  );
}`
  },
  {
    name: "Notification Settings Card",
    component: (
      <Card hover="none" className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose which events trigger real-time alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="card-deploy-alerts" className="text-sm font-medium cursor-pointer">
                Deployment alerts
              </label>
              <p className="text-xs text-muted-foreground">Notify when production builds complete.</p>
            </div>
            <Switch id="card-deploy-alerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label htmlFor="card-billing-alerts" className="text-sm font-medium cursor-pointer">
                Usage thresholds
              </label>
              <p className="text-xs text-muted-foreground">Warn when monthly quota reaches 80%.</p>
            </div>
            <Switch id="card-billing-alerts" />
          </div>
        </CardContent>
      </Card>
    ),
    code: `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Switch,
} from "nexoreui";

export default function NotificationCardDemo() {
  return (
    <Card hover="none" className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose which events trigger real-time alerts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <label htmlFor="deploy-alerts" className="text-sm font-medium cursor-pointer">
              Deployment alerts
            </label>
            <p className="text-xs text-muted-foreground">Notify when production builds complete.</p>
          </div>
          <Switch id="deploy-alerts" defaultChecked />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <label htmlFor="usage-alerts" className="text-sm font-medium cursor-pointer">
              Usage thresholds
            </label>
            <p className="text-xs text-muted-foreground">Warn when monthly quota reaches 80%.</p>
          </div>
          <Switch id="usage-alerts" />
        </div>
      </CardContent>
    </Card>
  );
}`
  }
];

const cardPropsData = [
  { name: "variant", type: '"default" | "glass" | "gradient" | "glow" | "bento" | "spotlight" | "flip" | "tilt"', defaultValue: '"default"', description: "Visual style and interaction profile of the card.", required: false },
  { name: "hover", type: '"lift" | "glow" | "none"', defaultValue: '"lift"', description: "Interactive hover feedback style.", required: false },
  { name: "animate", type: "boolean", defaultValue: "true", description: "Enables motion transitions when supported by reduced-motion settings.", required: false },
  { name: "backContent", type: "React.ReactNode", defaultValue: "-", description: "Content rendered on the reverse side when variant is 'flip'.", required: false },
  { name: "className", type: "string", defaultValue: "-", description: "Additional Tailwind CSS classes.", required: false },
];

const CardPlaygroundWrapper = ({
  variant,
  hover,
  animate,
  title,
  description,
  children,
}: any) => (
  <Card variant={variant} hover={hover} animate={animate} className="w-full max-w-sm">
    {(title || description) && (
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    )}
    {children && <CardContent>{children}</CardContent>}
  </Card>
);

export function CardSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="cards" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Card</h2>
        <p className="text-muted-foreground mt-1">
          Structured container with compound header, body, and footer slots plus spotlight and flip modes.
        </p>
      </div>

      <WhenToUse
        title="When to use which variant"
        items={[
          { label: "default", description: "Standard content panels, feature summaries, forms, and settings blocks." },
          { label: "bento", description: "Dashboard grid metrics and compact overview tiles." },
          { label: "spotlight", description: "Interactive capability cards with cursor-tracked radial surface highlight." },
          { label: "flip", description: "Two-sided spec or summary cards revealing secondary details on hover or click." },
          { label: "hover: none", description: "Static settings or form containers that should stay stationary while typing." },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={CardPlaygroundWrapper}
          componentName="Card"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "bento", "glass", "spotlight", "tilt"],
              defaultValue: "default",
              description: "Visual style of the card"
            },
            {
              name: "hover",
              type: "select",
              options: ["lift", "glow", "none"],
              defaultValue: "lift",
              description: "Hover transition behavior"
            },
            {
              name: "animate",
              type: "boolean",
              defaultValue: true,
              description: "Whether motion effects are enabled"
            },
            {
              name: "title",
              type: "text",
              defaultValue: "Workspace Overview",
              description: "Heading passed into <CardTitle>"
            },
            {
              name: "description",
              type: "text",
              defaultValue: "Manage API keys, billing alerts, and team access.",
              description: "Subtitle passed into <CardDescription>"
            },
            {
              name: "children",
              type: "text",
              defaultValue: "Changes take effect across all edge regions immediately.",
              description: "Body copy rendered inside <CardContent>"
            }
          ]}
        />
      </div>

      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Showcase & Examples</h3>
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h4 className="text-base font-medium text-foreground">{item.name}</h4>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-border bg-background p-6">
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

      <PropsTable propsData={cardPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Heading Hierarchy:</strong> <code className="text-primary font-mono text-[10px]">&lt;CardTitle&gt;</code> renders a semantic <code className="text-primary font-mono text-[10px]">&lt;h3&gt;</code> element for clean screen-reader outlines.</li>
          <li><strong>Reduced Motion:</strong> Tilt and flip transitions respect <code className="text-primary font-mono text-[10px]">prefers-reduced-motion</code> automatically.</li>
        </ul>
      </div>
    </section>
  );
}
