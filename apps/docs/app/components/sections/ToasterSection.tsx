"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import { Button, Toaster, ToastCard, toast, notify, type ToasterProps } from "nexoreui";

interface ToasterPlaygroundProps {
  position?: ToasterProps["position"];
  variant?: ToasterProps["variant"];
  expand?: boolean;
  closeButton?: boolean;
  visibleToasts?: number;
  duration?: number;
}

function ToasterPlayground({
  position = "bottom-right",
  variant = "default",
  expand = false,
  closeButton = true,
  visibleToasts = 3,
  duration = 4000,
}: ToasterPlaygroundProps) {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <Toaster
        position={position}
        variant={variant}
        expand={expand}
        closeButton={closeButton}
        visibleToasts={visibleToasts}
        duration={duration}
      />
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() =>
            toast("Deployment queued", {
              description: "Building production edge bundle #484.",
            })
          }
        >
          Trigger Default
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast.success("DNS verified", {
              description: "TLS certificate provisioned for edge.nexore.dev.",
            })
          }
        >
          Trigger Success
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            notify.countdown({
              title: "Archive rule scheduled",
              description: "Logs older than 30 days will be purged.",
              duration: 5000,
              actionLabel: "Undo",
            })
          }
        >
          Trigger Countdown
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.dismiss()}
        >
          Dismiss All
        </Button>
      </div>
      <span className="text-xs font-mono text-muted-foreground tabular-nums">
        Position: {position} · Visible: {visibleToasts} · Duration: {duration}ms
      </span>
    </div>
  );
}

function SemanticToastsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast("Workspace synced", {
            description: "All environment variables are up to date.",
          })
        }
      >
        Default
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.success("Build promoted", {
            description: "Production traffic shifted to release v2.0.4.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.info("Scheduled sync", {
            description: "Index rebuild starts at 02:00 UTC.",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.warning("API quota at 85%", {
            description: "Consider raising your monthly rate ceiling.",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.error("Replica unreachable", {
            description: "Timed out connecting to db-eu-02 after 5000ms.",
          })
        }
      >
        Error
      </Button>
      <Button variant="ghost" size="sm" onClick={() => toast.dismiss()}>
        Dismiss All
      </Button>
    </div>
  );
}

function CountdownUndoDemo() {
  const [statusText, setStatusText] = useState("Ready");

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setStatusText("Pending removal (5.0s window)");
            notify.countdown({
              title: "Deleting staging branch",
              description: "Hover to pause countdown or click Undo to cancel.",
              duration: 5000,
              meta: "branch: staging-v2",
              actionLabel: "Undo",
              onAction: () => setStatusText("Action reverted by Undo"),
              onExpire: () => setStatusText("Countdown expired & committed"),
            });
          }}
        >
          Launch Undo Countdown
        </Button>
      </div>
      <span className="text-xs font-mono text-muted-foreground">
        Result: <span className="text-foreground font-medium">{statusText}</span>
      </span>
    </div>
  );
}

function PromiseLifecycleDemo() {
  const handleDeploy = () => {
    const deployTask = new Promise<{ region: string }>((resolve) => {
      window.setTimeout(() => resolve({ region: "eu-central-1" }), 1400);
    });

    toast.promise(deployTask, {
      loading: "Uploading edge worker bundle...",
      success: (res) => `Deployed cleanly to ${res.region}`,
      error: "Deployment failed",
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDeploy}>
      Simulate Async Deployment
    </Button>
  );
}

function MetadataToastCardDemo() {
  const [logOpened, setLogOpened] = useState(false);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <ToastCard
        status="success"
        title="Release v2.0.4 live"
        description="Edge cache warmed across 4 regional points of presence."
        meta="prod-us-east-1"
        remainingSeconds={4.2}
        progress={84}
        actionLabel={logOpened ? "Opened" : "View log"}
        onAction={() => setLogOpened(true)}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          notify.status({
            status: "info",
            title: "Release v2.0.4 live",
            description: "Edge cache warmed across 4 regional points of presence.",
            meta: "prod-us-east-1",
            actionLabel: "View log",
            onAction: () => setLogOpened(true),
          })
        }
      >
        Dispatch Status Toast
      </Button>
    </div>
  );
}

const examples = [
  {
    name: "Semantic Status Suite",
    description: "Default, success, info, warning, and error notifications rendered with matched semantic borders and icons.",
    component: <SemanticToastsDemo />,
    code: `import { Button, toast } from "nexoreui";

export default function SemanticToastsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => toast("Workspace synced", { description: "All environment variables are up to date." })}>
        Default
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.success("Build promoted", { description: "Production traffic shifted to release v2.0.4." })}>
        Success
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.info("Scheduled sync", { description: "Index rebuild starts at 02:00 UTC." })}>
        Info
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.warning("API quota at 85%", { description: "Consider raising your monthly rate ceiling." })}>
        Warning
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.error("Replica unreachable", { description: "Timed out connecting to db-eu-02 after 5000ms." })}>
        Error
      </Button>
      <Button variant="ghost" size="sm" onClick={() => toast.dismiss()}>
        Dismiss All
      </Button>
    </div>
  );
}`,
  },
  {
    name: "Live Undo Countdown Toast",
    description: "Hover-pausable countdown bar with tabular remaining seconds and deterministic Undo recovery via notify.countdown.",
    component: <CountdownUndoDemo />,
    code: `import { useState } from "react";
import { Button, notify } from "nexoreui";

export default function CountdownUndoDemo() {
  const [statusText, setStatusText] = useState("Ready");

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setStatusText("Pending removal (5.0s window)");
          notify.countdown({
            title: "Deleting staging branch",
            description: "Hover to pause countdown or click Undo to cancel.",
            duration: 5000,
            meta: "branch: staging-v2",
            actionLabel: "Undo",
            onAction: () => setStatusText("Action reverted by Undo"),
            onExpire: () => setStatusText("Countdown expired & committed"),
          });
        }}
      >
        Launch Undo Countdown
      </Button>
      <span className="text-xs font-mono text-muted-foreground">Result: {statusText}</span>
    </div>
  );
}`,
  },
  {
    name: "Async Promise Lifecycle",
    description: "Transitions automatically from loading spinner to success or error feedback when an async task resolves.",
    component: <PromiseLifecycleDemo />,
    code: `import { Button, toast } from "nexoreui";

export default function PromiseLifecycleDemo() {
  const handleDeploy = () => {
    const deployTask = new Promise<{ region: string }>((resolve) => {
      window.setTimeout(() => resolve({ region: "eu-central-1" }), 1400);
    });

    toast.promise(deployTask, {
      loading: "Uploading edge worker bundle...",
      success: (res) => \`Deployed cleanly to \${res.region}\`,
      error: "Deployment failed",
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDeploy}>
      Simulate Async Deployment
    </Button>
  );
}`,
  },
  {
    name: "Structured Metadata ToastCard",
    description: "Architectural ToastCard surface supporting monospaced deployment tags, countdown progress bars, and action triggers.",
    component: <MetadataToastCardDemo />,
    code: `import { useState } from "react";
import { Button, ToastCard, notify } from "nexoreui";

export default function MetadataToastCardDemo() {
  const [logOpened, setLogOpened] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <ToastCard
        status="success"
        title="Release v2.0.4 live"
        description="Edge cache warmed across 4 regional points of presence."
        meta="prod-us-east-1"
        remainingSeconds={4.2}
        progress={84}
        actionLabel={logOpened ? "Opened" : "View log"}
        onAction={() => setLogOpened(true)}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          notify.status({
            status: "info",
            title: "Release v2.0.4 live",
            description: "Edge cache warmed across 4 regional points of presence.",
            meta: "prod-us-east-1",
            actionLabel: "View log",
            onAction: () => setLogOpened(true),
          })
        }
      >
        Dispatch Status Toast
      </Button>
    </div>
  );
}`,
  },
  {
    name: "Root Layout Registration",
    description: "Mount Toaster once in your root layout so any client component can dispatch notifications.",
    component: (
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4 space-y-2 text-xs">
        <div className="font-mono font-semibold text-foreground">app/layout.tsx</div>
        <p className="text-muted-foreground leading-relaxed">
          Place <code className="font-mono text-foreground">&lt;Toaster /&gt;</code> directly inside your root layout body to synchronize theme tokens automatically.
        </p>
      </div>
    ),
    code: `import { Toaster } from "nexoreui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  );
}`,
  },
];

const toasterPropsData = [
  { name: "position", type: '"top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center"', defaultValue: '"bottom-right"', description: "Viewport anchor corner for stacked toast notifications.", required: false },
  { name: "variant", type: '"default" | "bordered" | "minimal"', defaultValue: '"default"', description: "Border and shadow profile applied to toast surfaces.", required: false },
  { name: "expand", type: "boolean", defaultValue: "false", description: "Expands stacked toasts by default instead of collapsing them.", required: false },
  { name: "closeButton", type: "boolean", defaultValue: "false", description: "Renders an explicit close button on standard toasts.", required: false },
  { name: "visibleToasts", type: "number", defaultValue: "3", description: "Maximum number of concurrent visible toasts before stacking.", required: false },
  { name: "duration", type: "number", defaultValue: "4000", description: "Default auto-dismiss duration in milliseconds.", required: false },
  { name: "notify.countdown", type: "{ title, description, duration, actionLabel, onAction, onExpire }", defaultValue: "5000ms", description: "Dispatches a hover-pausable undo toast with live countdown bar.", required: false },
];

export function ToasterSection() {
  return (
    <section id="toaster" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which toast"
        items={[
          { label: "toast / toast.success", description: "Transient confirmation after mutations without blocking the user's current screen." },
          { label: "notify.countdown", description: "Reversible destructive actions such as deleting branches or archiving records with Undo." },
          { label: "toast.promise", description: "Async operations with distinct pending, resolved, and failure states." },
          { label: "notify.status", description: "Structured deployments or webhooks carrying monospaced metadata chips." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={ToasterPlayground}
          componentName="Toaster"
          importFrom="nexoreui"
          controls={[
            {
              name: "position",
              type: "select",
              options: ["bottom-right", "bottom-left", "bottom-center", "top-right", "top-left", "top-center"],
              defaultValue: "bottom-right",
              description: "Viewport corner where toasts appear",
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "bordered", "minimal"],
              defaultValue: "default",
              description: "Toast card border and elevation preset",
            },
            {
              name: "expand",
              type: "boolean",
              defaultValue: false,
              description: "Expands stacked notifications automatically",
            },
            {
              name: "closeButton",
              type: "boolean",
              defaultValue: true,
              description: "Displays dismiss button on each toast",
            },
            {
              name: "visibleToasts",
              type: "number",
              defaultValue: 3,
              description: "Maximum stacked toasts shown simultaneously",
            },
            {
              name: "duration",
              type: "number",
              defaultValue: 4000,
              description: "Auto-dismiss timing in milliseconds",
            },
          ]}
        />
      </div>

      <div className="space-y-10">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Showcase & Examples</h2>
        {examples.map((item) => (
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

      <PropsTable propsData={toasterPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Non-Intrusive Live Region:</strong> Renders notifications inside an <code className="text-primary font-mono text-[10px]">aria-live="polite"</code> region so active focus is never stolen from forms.</li>
          <li><strong>Pause on Hover & Focus:</strong> <code className="text-primary font-mono text-[10px]">notify.countdown</code> halts timer decay whenever hovered or focused so keyboard users can reach Undo reliably.</li>
          <li><strong>Reduced Motion:</strong> Loading spinners and countdown progress bars respect <code className="text-primary font-mono text-[10px]">prefers-reduced-motion</code> automatically.</li>
        </ul>
      </div>
    </section>
  );
}
