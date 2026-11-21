"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import { Home, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent, Button } from "nexoreui";

const variants = [
  {
    name: "Default Tabs",
    component: (
      <Tabs defaultValue="account" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
          Update your profile details, display name, and primary email address.
        </TabsContent>
        <TabsContent value="password" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
          Rotate your workspace password or revoke active hardware sessions.
        </TabsContent>
      </Tabs>
    ),
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";

export default function DefaultTabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
        Update your profile details, display name, and primary email address.
      </TabsContent>
      <TabsContent value="password" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
        Rotate your workspace password or revoke active hardware sessions.
      </TabsContent>
    </Tabs>
  );
}`
  },
  {
    name: "Pill Style Tabs",
    component: (
      <Tabs defaultValue="all" className="w-full max-w-md">
        <TabsList variant="pill">
          <TabsTrigger variant="pill" value="all">All</TabsTrigger>
          <TabsTrigger variant="pill" value="unread">Unread</TabsTrigger>
          <TabsTrigger variant="pill" value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
          Showing all 24 deployment notifications.
        </TabsContent>
        <TabsContent value="unread" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
          Showing 3 unread system notifications.
        </TabsContent>
        <TabsContent value="archived" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
          Showing 12 archived audit alerts.
        </TabsContent>
      </Tabs>
    ),
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";

export default function PillTabsDemo() {
  return (
    <Tabs defaultValue="all" className="w-full max-w-md">
      <TabsList variant="pill">
        <TabsTrigger variant="pill" value="all">All</TabsTrigger>
        <TabsTrigger variant="pill" value="unread">Unread</TabsTrigger>
        <TabsTrigger variant="pill" value="archived">Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
        Showing all 24 deployment notifications.
      </TabsContent>
      <TabsContent value="unread" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
        Showing 3 unread system notifications.
      </TabsContent>
      <TabsContent value="archived" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
        Showing 12 archived audit alerts.
      </TabsContent>
    </Tabs>
  );
}`
  },
  {
    name: "Underline Tabs",
    component: (
      <Tabs defaultValue="overview" className="w-full max-w-md">
        <TabsList variant="underline">
          <TabsTrigger variant="underline" value="overview">Overview</TabsTrigger>
          <TabsTrigger variant="underline" value="analytics">Analytics</TabsTrigger>
          <TabsTrigger variant="underline" value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
          Cluster health is nominal across 4 active edge zones.
        </TabsContent>
        <TabsContent value="analytics" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
          Median response latency holds steady at 14ms over 24 hours.
        </TabsContent>
        <TabsContent value="logs" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground font-mono">
          [09:42:11 UTC] sync complete · 0 errors
        </TabsContent>
      </Tabs>
    ),
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";

export default function UnderlineTabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList variant="underline">
        <TabsTrigger variant="underline" value="overview">Overview</TabsTrigger>
        <TabsTrigger variant="underline" value="analytics">Analytics</TabsTrigger>
        <TabsTrigger variant="underline" value="logs">Logs</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
        Cluster health is nominal across 4 active edge zones.
      </TabsContent>
      <TabsContent value="analytics" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground">
        Median response latency holds steady at 14ms over 24 hours.
      </TabsContent>
      <TabsContent value="logs" className="p-4 rounded-lg border border-border bg-card text-sm text-muted-foreground font-mono">
        [09:42:11 UTC] sync complete · 0 errors
      </TabsContent>
    </Tabs>
  );
}`
  },
  {
    name: "Vertical Settings Tabs",
    component: (
      <Tabs defaultValue="general" orientation="vertical" className="flex flex-col sm:flex-row w-full max-w-md gap-3">
        <TabsList className="flex sm:flex-col h-auto w-full sm:w-32 items-stretch bg-muted/40 p-1 rounded-xl border border-border">
          <TabsTrigger value="general" className="justify-start">General</TabsTrigger>
          <TabsTrigger value="billing" className="justify-start">Billing</TabsTrigger>
          <TabsTrigger value="security" className="justify-start">Security</TabsTrigger>
        </TabsList>
        <div className="flex-1 border border-border bg-card p-4 rounded-xl text-sm text-muted-foreground">
          <TabsContent value="general" className="mt-0">
            Configure workspace name, region defaults, and timezone formatting.
          </TabsContent>
          <TabsContent value="billing" className="mt-0">
            Manage saved payment methods, VAT tax IDs, and monthly receipts.
          </TabsContent>
          <TabsContent value="security" className="mt-0">
            Enforce SAML single sign-on and review active API token scopes.
          </TabsContent>
        </div>
      </Tabs>
    ),
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";

export default function VerticalTabsDemo() {
  return (
    <Tabs defaultValue="general" orientation="vertical" className="flex flex-col sm:flex-row w-full max-w-md gap-3">
      <TabsList className="flex sm:flex-col h-auto w-full sm:w-32 items-stretch bg-muted/40 p-1 rounded-xl border border-border">
        <TabsTrigger value="general" className="justify-start">General</TabsTrigger>
        <TabsTrigger value="billing" className="justify-start">Billing</TabsTrigger>
        <TabsTrigger value="security" className="justify-start">Security</TabsTrigger>
      </TabsList>
      <div className="flex-1 border border-border bg-card p-4 rounded-xl text-sm text-muted-foreground">
        <TabsContent value="general" className="mt-0">
          Configure workspace name, region defaults, and timezone formatting.
        </TabsContent>
        <TabsContent value="billing" className="mt-0">
          Manage saved payment methods, VAT tax IDs, and monthly receipts.
        </TabsContent>
        <TabsContent value="security" className="mt-0">
          Enforce SAML single sign-on and review active API token scopes.
        </TabsContent>
      </div>
    </Tabs>
  );
}`
  },
  {
    name: "Tabs with Icons",
    component: (
      <Tabs defaultValue="home" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home" className="gap-2">
            <Home className="h-4 w-4" /> Home
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="p-4 border border-border rounded-lg bg-card text-sm text-muted-foreground">
          Workspace overview and recent activity stream.
        </TabsContent>
        <TabsContent value="settings" className="p-4 border border-border rounded-lg bg-card text-sm text-muted-foreground">
          Environment configuration and runtime preferences.
        </TabsContent>
      </Tabs>
    ),
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";
import { Home, Settings } from "lucide-react";

export default function IconTabsDemo() {
  return (
    <Tabs defaultValue="home" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="home" className="gap-2">
          <Home className="h-4 w-4" /> Home
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          <Settings className="h-4 w-4" /> Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="p-4 border border-border rounded-lg bg-card text-sm text-muted-foreground">
        Workspace overview and recent activity stream.
      </TabsContent>
      <TabsContent value="settings" className="p-4 border border-border rounded-lg bg-card text-sm text-muted-foreground">
        Environment configuration and runtime preferences.
      </TabsContent>
    </Tabs>
  );
}`
  },
  {
    name: "Disabled Tab State",
    component: (
      <Tabs defaultValue="active" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="disabled" disabled>Locked</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="p-4 border border-border rounded-lg bg-card text-sm text-muted-foreground">
          Active environment configuration.
        </TabsContent>
        <TabsContent value="archive" className="p-4 border border-border rounded-lg bg-card text-sm text-muted-foreground">
          Archived project snapshots.
        </TabsContent>
      </Tabs>
    ),
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";

export default function DisabledTabDemo() {
  return (
    <Tabs defaultValue="active" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Locked</TabsTrigger>
        <TabsTrigger value="archive">Archive</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="p-4 border border-border rounded-lg bg-card text-sm text-muted-foreground">
        Active environment configuration.
      </TabsContent>
      <TabsContent value="archive" className="p-4 border border-border rounded-lg bg-card text-sm text-muted-foreground">
        Archived project snapshots.
      </TabsContent>
    </Tabs>
  );
}`
  }
];

const tabsPropsData = [
  { name: "defaultValue", type: "string", defaultValue: "-", description: "The value of the tab that should be active when initially rendered.", required: false },
  { name: "value", type: "string", defaultValue: "-", description: "Controlled value of the active tab.", required: false },
  { name: "onValueChange", type: "(value: string) => void", defaultValue: "-", description: "Callback triggered when the active tab changes.", required: false },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Keyboard navigation axis for switching between tabs.", required: false },
  { name: "variant", type: '"default" | "pill" | "underline"', defaultValue: '"default"', description: "Visual style variant applied to TabsList and TabsTrigger.", required: false },
];

const TabsPlaygroundWrapper = ({
  variant,
  tab1,
  tab2,
  content1,
  content2,
}: any) => (
  <Tabs defaultValue="tab1" className="w-full max-w-md">
    <TabsList variant={variant}>
      <TabsTrigger variant={variant} value="tab1">{tab1}</TabsTrigger>
      <TabsTrigger variant={variant} value="tab2">{tab2}</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1" className="p-4 border border-border bg-card rounded-lg mt-3 text-sm text-muted-foreground">
      {content1}
    </TabsContent>
    <TabsContent value="tab2" className="p-4 border border-border bg-card rounded-lg mt-3 text-sm text-muted-foreground">
      {content2}
    </TabsContent>
  </Tabs>
);

export function TabsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="tabs" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tabs</h2>
        <p className="text-muted-foreground mt-1">
          A set of layered sections of content that display one panel at a time with full keyboard navigation.
        </p>
      </div>

      <WhenToUse
        title="When to use which variant"
        items={[
          { label: "default", description: "Segmented settings panels and workspace views sharing a single page region." },
          { label: "pill", description: "Compact view filters such as All, Unread, and Archived message streams." },
          { label: "underline", description: "Full-width top-level section navigation on profile or detail pages." },
          { label: "vertical", description: "Settings layouts with 4+ distinct categories alongside a spacious detail pane." },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={TabsPlaygroundWrapper}
          componentName="Tabs"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "pill", "underline"],
              defaultValue: "default",
              description: "Visual style of the tabs."
            },
            {
              name: "tab1",
              type: "text",
              defaultValue: "Account",
              description: "Label for the first tab."
            },
            {
              name: "tab2",
              type: "text",
              defaultValue: "Password",
              description: "Label for the second tab."
            },
            {
              name: "content1",
              type: "text",
              defaultValue: "Make changes to your account here.",
              description: "Content for the first tab."
            },
            {
              name: "content2",
              type: "text",
              defaultValue: "Change your password here.",
              description: "Content for the second tab."
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-border bg-background p-6">
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

      <PropsTable propsData={tabsPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard navigation:</strong> Pressing <kbd className="bg-muted px-1 rounded text-[10px]">Left Arrow</kbd> / <kbd className="bg-muted px-1 rounded text-[10px]">Right Arrow</kbd> (or <kbd className="bg-muted px-1 rounded text-[10px]">Up</kbd> / <kbd className="bg-muted px-1 rounded text-[10px]">Down</kbd> in vertical tabs) moves active focus across tabs.</li>
          <li><strong>ARIA attributes:</strong> Exports <code className="text-primary font-mono text-[10px]">role="tablist"</code>, <code className="text-primary font-mono text-[10px]">role="tab"</code>, and <code className="text-primary font-mono text-[10px]">role="tabpanel"</code> attributes linking triggers to content.</li>
        </ul>
      </div>
    </section>
  );
}
