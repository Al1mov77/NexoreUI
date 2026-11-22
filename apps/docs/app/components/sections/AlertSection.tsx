"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Alert,
  LeftBorderAlert,
  MinimalAlert,
  OfflineBanner,
  RateLimitAlert,
  Button,
} from "nexoreui";

function DiagnosticsAlertDemo() {
  return (
    <div className="w-full max-w-md">
      <Alert
        variant="destructive"
        title="Replica connection refused"
        description="Primary worker could not reach postgres-read-02 within the 5000ms budget."
        meta="PG_CONN_5432"
        detailsLabel="Trace"
        details={
          <div className="space-y-1">
            <div>host=db-eu-02.internal port=5432</div>
            <div>error=ECONNREFUSED after 3 retries</div>
          </div>
        }
      />
    </div>
  );
}

function DismissibleActionAlertDemo() {
  const [dismissed, setDismissed] = useState(false);
  const [actionCount, setActionCount] = useState(0);

  if (dismissed) {
    return (
      <div className="w-full max-w-md flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <span>Billing alert dismissed.</span>
        <Button variant="outline" size="sm" onClick={() => setDismissed(false)}>
          Restore
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <Alert
        variant="warning"
        title="Card expires in 6 days"
        description="Update your workspace payment method to avoid deployment pauses."
        actionText={actionCount > 0 ? `Opened (${actionCount})` : "Update card"}
        onAction={() => setActionCount((c) => c + 1)}
        dismissible
        onDismiss={() => setDismissed(true)}
      />
    </div>
  );
}

function OperationalBannerDemo() {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="w-full max-w-md">
      <Alert
        variant="banner"
        title="Scheduled maintenance window"
        description="EU-West control plane upgrades run Sunday 02:00-02:20 UTC."
        actionText={acknowledged ? "Acknowledged" : "Details"}
        onAction={() => setAcknowledged(true)}
      />
    </div>
  );
}

const variants = [
  {
    name: "Semantic Status Suite",
    description: "Consistent icon-aligned surfaces across default, info, success, warning, and destructive alerts.",
    component: (
      <div className="w-full max-w-md space-y-3">
        <Alert
          variant="info"
          title="CLI v2.0.4 available"
          description="Run pnpm update nexoreui to pull the latest registry helpers."
        />
        <Alert
          variant="success"
          title="All edge clusters healthy"
          description="Zero packet loss across 4 regional deployments."
        />
      </div>
    ),
    code: `import { Alert } from "nexoreui";

export default function SemanticAlertsDemo() {
  return (
    <div className="w-full max-w-md space-y-3">
      <Alert
        variant="info"
        title="CLI v2.0.4 available"
        description="Run pnpm update nexoreui to pull the latest registry helpers."
      />
      <Alert
        variant="success"
        title="All edge clusters healthy"
        description="Zero packet loss across 4 regional deployments."
      />
    </div>
  );
}`,
  },
  {
    name: "Expandable Technical Diagnostics Alert",
    description: "Pairs a monospaced meta code tag with an expandable Trace drawer inside the alert body.",
    component: <DiagnosticsAlertDemo />,
    code: `import { Alert } from "nexoreui";

export default function DiagnosticsAlertDemo() {
  return (
    <div className="w-full max-w-md">
      <Alert
        variant="destructive"
        title="Replica connection refused"
        description="Primary worker could not reach postgres-read-02 within the 5000ms budget."
        meta="PG_CONN_5432"
        detailsLabel="Trace"
        details={
          <div className="space-y-1">
            <div>host=db-eu-02.internal port=5432</div>
            <div>error=ECONNREFUSED after 3 retries</div>
          </div>
        }
      />
    </div>
  );
}`,
  },
  {
    name: "Dismissible Alert with Action & Restore",
    description: "Responsive flex layout keeps action triggers and dismiss buttons aligned cleanly down to 375px.",
    component: <DismissibleActionAlertDemo />,
    code: `import { useState } from "react";
import { Alert, Button } from "nexoreui";

export default function DismissibleActionAlertDemo() {
  const [dismissed, setDismissed] = useState(false);
  const [actionCount, setActionCount] = useState(0);

  if (dismissed) {
    return (
      <div className="w-full max-w-md flex items-center justify-between rounded-xl border border-border px-4 py-3 text-xs text-muted-foreground">
        <span>Billing alert dismissed.</span>
        <Button variant="outline" size="sm" onClick={() => setDismissed(false)}>
          Restore
        </Button>
      </div>
    );
  }

  return (
    <Alert
      variant="warning"
      title="Card expires in 6 days"
      description="Update your workspace payment method to avoid deployment pauses."
      actionText={actionCount > 0 ? \`Opened (\${actionCount})\` : "Update card"}
      onAction={() => setActionCount((c) => c + 1)}
      dismissible
      onDismiss={() => setDismissed(true)}
    />
  );
}`,
  },
  {
    name: "Full-Width Operational Banner",
    description: "High-contrast inverted banner with inline action trigger for workspace-wide maintenance notices.",
    component: <OperationalBannerDemo />,
    code: `import { useState } from "react";
import { Alert } from "nexoreui";

export default function OperationalBannerDemo() {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="w-full max-w-md">
      <Alert
        variant="banner"
        title="Scheduled maintenance window"
        description="EU-West control plane upgrades run Sunday 02:00-02:20 UTC."
        actionText={acknowledged ? "Acknowledged" : "Details"}
        onAction={() => setAcknowledged(true)}
      />
    </div>
  );
}`,
  },
  {
    name: "Live Rate-Limit Countdown Alert",
    description: "Tabular seconds countdown with depleting warning progress bar and cooldown replay trigger.",
    component: <RateLimitAlert seconds={15} />,
    code: `import { RateLimitAlert } from "nexoreui";

export default function RateLimitAlertDemo() {
  return <RateLimitAlert seconds={15} />;
}`,
  },
  {
    name: "Specialized Presets",
    description: "Accent-border callout, minimal note, and high-visibility offline status banner.",
    component: (
      <div className="w-full max-w-md space-y-3">
        <LeftBorderAlert
          title="Environment override active"
          description="Local .env.development variables supersede dashboard secrets."
        />
        <MinimalAlert
          title="Draft autosaved"
          description="Schema changes stored locally 12 seconds ago."
        />
        <OfflineBanner />
      </div>
    ),
    code: `import { LeftBorderAlert, MinimalAlert, OfflineBanner } from "nexoreui";

export default function SpecializedAlertsDemo() {
  return (
    <div className="w-full max-w-md space-y-3">
      <LeftBorderAlert
        title="Environment override active"
        description="Local .env.development variables supersede dashboard secrets."
      />
      <MinimalAlert
        title="Draft autosaved"
        description="Schema changes stored locally 12 seconds ago."
      />
      <OfflineBanner />
    </div>
  );
}`,
  },
];

const alertPropsData = [
  { name: "variant", type: '"default" | "destructive" | "success" | "warning" | "info" | "glass" | "minimal" | "banner" | "neon" | "gradient"', defaultValue: '"default"', description: "Visual semantic style of the alert surface.", required: false },
  { name: "title", type: "React.ReactNode", defaultValue: "-", description: "Primary alert heading.", required: false },
  { name: "description", type: "React.ReactNode", defaultValue: "-", description: "Supporting explanation copy.", required: false },
  { name: "meta", type: "string", defaultValue: "-", description: "Monospaced status or error code badge displayed beside the title.", required: false },
  { name: "details", type: "React.ReactNode", defaultValue: "-", description: "Expandable technical diagnostics content toggled inline.", required: false },
  { name: "detailsLabel", type: "string", defaultValue: '"Diagnostics"', description: "Label for the expandable details toggle button.", required: false },
  { name: "dismissible", type: "boolean", defaultValue: "false", description: "Renders an accessible dismiss trigger on the trailing edge.", required: false },
  { name: "onDismiss", type: "() => void", defaultValue: "-", description: "Callback fired when the dismiss trigger is activated.", required: false },
  { name: "actionText", type: "string", defaultValue: "-", description: "Label for the optional inline action button.", required: false },
  { name: "onAction", type: "() => void", defaultValue: "-", description: "Callback fired when the action button is clicked.", required: false },
  { name: "animate", type: "boolean", defaultValue: "true", description: "Enables calm entrance transition when reduced motion is off.", required: false },
];

export function AlertSection() {
  return (
    <section id="alerts" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which variant"
        items={[
          { label: "default / info", description: "Informational updates, version releases, and non-blocking system notices." },
          { label: "success", description: "Confirmed completions such as verified DNS records or healthy deploys." },
          { label: "warning", description: "Approaching quotas, expiring payment methods, and cooldown countdowns." },
          { label: "destructive + details", description: "Blocking failures paired with expandable stack traces or error codes." },
          { label: "banner", description: "Full-width operational notices pinned across a workspace shell." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={Alert}
          componentName="Alert"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "info", "success", "warning", "destructive", "minimal", "banner", "glass", "neon"],
              defaultValue: "default",
              description: "Visual semantic style of the alert",
            },
            {
              name: "title",
              type: "text",
              defaultValue: "Cluster sync complete",
              description: "Heading text inside the alert",
            },
            {
              name: "description",
              type: "text",
              defaultValue: "Configuration snapshots replicated across all regional nodes.",
              description: "Supporting message body",
            },
            {
              name: "meta",
              type: "text",
              defaultValue: "SYNC_OK",
              description: "Optional monospaced status code tag",
            },
            {
              name: "animate",
              type: "boolean",
              defaultValue: true,
              description: "Calm entrance transition",
            },
            {
              name: "dismissible",
              type: "boolean",
              defaultValue: false,
              description: "Shows dismiss close button",
            },
          ]}
        />
      </div>

      <div className="space-y-10">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Showcase & Examples</h2>
        {variants.map((item) => (
          <div key={item.name} className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div
                data-demo-preview
                className="flex min-h-[180px] items-center justify-center rounded-xl border border-border bg-background p-6"
              >
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      <PropsTable propsData={alertPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Live Alert Role:</strong> Sets <code className="text-primary font-mono text-[10px]">role="alert"</code> for critical notices so assistive technologies announce updates without moving focus.</li>
          <li><strong>Expandable Diagnostics:</strong> Details disclosure controls expose <code className="text-primary font-mono text-[10px]">aria-expanded</code> and <code className="text-primary font-mono text-[10px]">aria-controls</code> linked to the trace panel.</li>
          <li><strong>Keyboard Controls:</strong> Dismiss and inline action buttons include visible focus rings and respond to <kbd className="bg-muted px-1 rounded text-[10px]">Enter</kbd> and <kbd className="bg-muted px-1 rounded text-[10px]">Space</kbd>.</li>
        </ul>
      </div>
    </section>
  );
}
