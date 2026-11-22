"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import { X, ExternalLink, CheckCircle2, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  DialogStepHeader,
  DialogConfirmButton,
  Button,
  cn,
} from "nexoreui";

type DialogVariant =
  | "default"
  | "glass"
  | "destructive"
  | "success"
  | "fullscreen"
  | "drawer"
  | "command";

type DialogSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface DialogPlaygroundProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: DialogVariant;
  size?: DialogSize;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  scrollable?: boolean;
  showEscHint?: boolean;
  children?: React.ReactNode;
}

function DialogPlaygroundWrapper({
  isOpen = false,
  onOpenChange,
  variant = "default",
  size = "lg",
  title = "Workspace Settings",
  description = "Update runtime limits and webhook targets for this environment.",
  confirmText = "Save changes",
  cancelText = "Cancel",
  scrollable = false,
  showEscHint = true,
  children,
}: DialogPlaygroundProps) {
  const sizeClasses: Record<DialogSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "w-full max-w-2xl",
  };

  const variantCardClasses: Record<DialogVariant, string> = {
    default: "border-border bg-card text-card-foreground shadow-md",
    glass: "border-border bg-card/90 backdrop-blur-md text-card-foreground shadow-md",
    destructive: "border-destructive/40 bg-card text-card-foreground shadow-md",
    success: "border-success/40 bg-card text-card-foreground shadow-md",
    fullscreen: "w-full max-w-2xl border-border bg-background text-foreground shadow-md",
    drawer: "w-full max-w-lg border-border bg-card rounded-t-2xl rounded-b-lg shadow-md",
    command: "w-full max-w-lg border-border bg-card text-card-foreground shadow-md",
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-1 sm:p-3">
      <div
        className={cn(
          "w-full rounded-2xl border p-5 sm:p-6 transition-colors relative overflow-hidden",
          sizeClasses[size],
          variantCardClasses[variant]
        )}
      >
        {(variant === "destructive" || variant === "success") && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-5 top-0 h-0.5 rounded-full",
              variant === "destructive" ? "bg-destructive" : "bg-success"
            )}
          />
        )}

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1 min-w-0">
            <h4 className="text-base font-semibold text-foreground tracking-tight">
              {title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {showEscHint && (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-muted/60 font-mono text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            )}
            <button
              type="button"
              onClick={() => onOpenChange?.(true)}
              aria-label="Open live dialog overlay"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="py-3 text-xs text-muted-foreground border-y border-border/60 my-3">
          {children || (
            <div className="space-y-2">
              <p>
                Interactive preview reflecting <code className="font-mono text-foreground">{variant}</code> variant and <code className="font-mono text-foreground">{size}</code> size.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange?.(true)}
            className="text-xs gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Live Dialog</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange?.(false)}
              className="text-xs"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={variant === "destructive" ? "destructive" : "default"}
              size="sm"
              onClick={() => onOpenChange?.(true)}
              className="text-xs"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          variant={variant}
          size={size}
          scrollable={scrollable}
          showEscHint={showEscHint}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-3">
              <p>{children}</p>
              <div className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-foreground flex items-center justify-between gap-2">
                <span>variant: {variant}</span>
                <span>size: {size}</span>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{cancelText}</Button>
            </DialogClose>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={() => onOpenChange?.(false)}
            >
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StandardDialogDemo() {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("edge-gateway-prod");
  const [savedName, setSavedName] = useState("edge-gateway-prod");

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Environment</Button>
        </DialogTrigger>
        <DialogContent size="md" showEscHint>
          <DialogHeader>
            <DialogTitle>Environment Configuration</DialogTitle>
            <DialogDescription>
              Rename the deployment identifier used across edge nodes.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-2">
              <label
                htmlFor="dialog-env-name"
                className="block text-xs font-medium text-foreground"
              >
                Identifier
              </label>
              <input
                id="dialog-env-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setSavedName(projectName.trim() || savedName);
                setOpen(false);
              }}
            >
              Save Identifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <span className="text-xs font-mono text-muted-foreground">
        Active identifier: <span className="text-foreground font-medium">{savedName}</span>
      </span>
    </div>
  );
}

function HoldToConfirmDemo() {
  const [open, setOpen] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const [attemptKey, setAttemptKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) setAttemptKey((k) => k + 1);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="destructive">Revoke Signing Key</Button>
        </DialogTrigger>
        <DialogContent variant="destructive" size="md" showEscHint>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
              <span>Revoke Production Key?</span>
            </DialogTitle>
            <DialogDescription>
              Press and hold for 1.2 seconds to permanently invalidate key nx_live_89a4.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p>
              Active webhook signatures verified by this token will stop passing immediately across all 4 regions.
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogConfirmButton
              key={attemptKey}
              holdDuration={1200}
              label="Hold to revoke"
              holdingLabel="Revoking..."
              confirmedLabel="Key revoked"
              onConfirm={() => {
                setRevoked(true);
                setOpen(false);
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span>Status: {revoked ? "Revoked" : "Active"}</span>
        {revoked && (
          <button
            type="button"
            onClick={() => setRevoked(false)}
            className="text-foreground underline underline-offset-2 cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function MultiStepDialogDemo() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const stepLabels = [
    "Select cluster region",
    "Configure replication quota",
    "Verify provisioning manifest",
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setStep(1);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Launch Multi-Step Wizard</Button>
      </DialogTrigger>
      <DialogContent size="md" showEscHint>
        <DialogStepHeader
          step={step}
          totalSteps={3}
          label={stepLabels[step - 1]}
        />
        <DialogHeader>
          <DialogTitle>Provision Read Replica</DialogTitle>
          <DialogDescription>
            Step {step} of 3 in configuring your regional database failover node.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          {step === 1 && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1">
              <div className="font-medium text-foreground">Region: eu-central-1</div>
              <div>Estimated RTT from primary: 14 ms</div>
            </div>
          )}
          {step === 2 && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1 font-mono tabular-nums">
              <div className="font-medium text-foreground">Allocated IOPS: 6,000</div>
              <div>Snapshot cadence: Every 6 hours</div>
            </div>
          )}
          {step === 3 && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1">
              <div className="font-medium text-foreground">Manifest validated</div>
              <div>Ready to provision eu-central-1 replica.</div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => (step > 1 ? setStep(step - 1) : setOpen(false))}
          >
            {step > 1 ? "Back" : "Cancel"}
          </Button>
          <Button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                setOpen(false);
                setStep(1);
              }
            }}
          >
            {step < 3 ? "Continue" : "Provision Node"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ScrollablePolicyDialogDemo() {
  const [open, setOpen] = useState(false);

  const policyClauses = [
    "1. All production tokens automatically rotate every 90 days unless pinned to an enterprise hardware module.",
    "2. Audit events are retained for 365 days in immutable append-only storage with cryptographic checksums.",
    "3. Role assignments follow least-privilege scopes; temporary elevation expires after 4 hours.",
    "4. Automated backups replicate asynchronously across two distinct availability zones.",
    "5. Exported telemetry logs redact bearer headers and payment identifiers prior to storage.",
    "6. Workspace owners receive immediate webhook notifications when IP allowlists change.",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Review Audit Policy</Button>
      </DialogTrigger>
      <DialogContent size="md" scrollable showEscHint>
        <DialogHeader>
          <DialogTitle>Data Retention Policy</DialogTitle>
          <DialogDescription>
            Review compliance controls before enabling workspace-wide enforcement.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="max-h-56 space-y-3">
          {policyClauses.map((clause) => (
            <p key={clause} className="text-xs leading-relaxed text-muted-foreground">
              {clause}
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button onClick={() => setOpen(false)}>Accept Policy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DrawerVariantDialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Bottom Sheet Dialog</Button>
      </DialogTrigger>
      <DialogContent variant="drawer">
        <DialogHeader>
          <DialogTitle>Export Diagnostics Bundle</DialogTitle>
          <DialogDescription>
            Download anonymized crash dumps and edge trace metrics for the past 24 hours.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex items-center justify-between text-xs font-mono tabular-nums">
            <span>Archive size</span>
            <span className="text-foreground font-semibold">4.8 MB (.tar.gz)</span>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Download Archive</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SuccessReceiptDialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Release Receipt</Button>
      </DialogTrigger>
      <DialogContent variant="success" size="sm" showEscHint>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span>Deployment Promoted</span>
          </DialogTitle>
          <DialogDescription>
            Build #482 is now serving 100% of production traffic.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
            <div className="rounded-lg border border-border bg-muted/30 p-2">
              <div className="text-[10px] text-muted-foreground uppercase">Latency</div>
              <div className="text-foreground font-semibold mt-0.5">11 ms</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-2">
              <div className="text-[10px] text-muted-foreground uppercase">Regions</div>
              <div className="text-foreground font-semibold mt-0.5">4 / 4 live</div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full sm:w-auto">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const variants = [
  {
    name: "Standard Workspace Dialog",
    description: "Accessible Radix modal with ESC keycap hint, labeled form input, and controlled close state.",
    component: <StandardDialogDemo />,
    code: `import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Button,
} from "nexoreui";

export default function StandardDialogDemo() {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("edge-gateway-prod");
  const [savedName, setSavedName] = useState("edge-gateway-prod");

  return (
    <div className="flex flex-col items-center gap-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Environment</Button>
        </DialogTrigger>
        <DialogContent size="md" showEscHint>
          <DialogHeader>
            <DialogTitle>Environment Configuration</DialogTitle>
            <DialogDescription>
              Rename the deployment identifier used across edge nodes.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-2">
              <label htmlFor="env-name" className="block text-xs font-medium text-foreground">
                Identifier
              </label>
              <input
                id="env-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground font-mono"
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setSavedName(projectName.trim() || savedName);
                setOpen(false);
              }}
            >
              Save Identifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <span className="text-xs font-mono text-muted-foreground">
        Active identifier: {savedName}
      </span>
    </div>
  );
}`,
  },
  {
    name: "Press-and-Hold Destructive Confirmation",
    description: "Safety-gated destructive dialog using DialogConfirmButton to prevent accidental one-click deletions.",
    component: <HoldToConfirmDemo />,
    code: `import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  DialogConfirmButton,
  Button,
} from "nexoreui";
import { ShieldAlert } from "lucide-react";

export default function HoldToConfirmDemo() {
  const [open, setOpen] = useState(false);
  const [revoked, setRevoked] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Revoke Signing Key</Button>
      </DialogTrigger>
      <DialogContent variant="destructive" size="md" showEscHint>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <span>Revoke Production Key?</span>
          </DialogTitle>
          <DialogDescription>
            Press and hold for 1.2 seconds to permanently invalidate key nx_live_89a4.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p>
            Active webhook signatures verified by this token will stop passing immediately across all 4 regions.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogConfirmButton
            holdDuration={1200}
            label="Hold to revoke"
            holdingLabel="Revoking..."
            confirmedLabel={revoked ? "Key revoked" : "Confirmed"}
            onConfirm={() => {
              setRevoked(true);
              setOpen(false);
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
  },
  {
    name: "Multi-Step Provisioning Dialog",
    description: "Segmented DialogStepHeader progress track with Back/Continue state transitions.",
    component: <MultiStepDialogDemo />,
    code: `import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogStepHeader,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Button,
} from "nexoreui";

const stepLabels = [
  "Select cluster region",
  "Configure replication quota",
  "Verify provisioning manifest",
];

export default function MultiStepDialogDemo() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) setStep(1); }}>
      <DialogTrigger asChild>
        <Button variant="outline">Launch Multi-Step Wizard</Button>
      </DialogTrigger>
      <DialogContent size="md" showEscHint>
        <DialogStepHeader step={step} totalSteps={3} label={stepLabels[step - 1]} />
        <DialogHeader>
          <DialogTitle>Provision Read Replica</DialogTitle>
          <DialogDescription>
            Step {step} of 3 in configuring your regional database failover node.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-xs text-muted-foreground">
            {step === 1 && "Region: eu-central-1 (14 ms RTT)"}
            {step === 2 && "Allocated IOPS: 6,000 | Snapshot cadence: Every 6 hours"}
            {step === 3 && "Manifest validated. Ready to provision eu-central-1 replica."}
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => (step > 1 ? setStep(step - 1) : setOpen(false))}>
            {step > 1 ? "Back" : "Cancel"}
          </Button>
          <Button onClick={() => (step < 3 ? setStep(step + 1) : setOpen(false))}>
            {step < 3 ? "Continue" : "Provision Node"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
  },
  {
    name: "Scrollable Audit Policy Dialog",
    description: "Pinned header and footer framing a scrollable DialogBody region for longer compliance text.",
    component: <ScrollablePolicyDialogDemo />,
    code: `import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Button,
} from "nexoreui";

const policyClauses = [
  "1. All production tokens automatically rotate every 90 days.",
  "2. Audit events are retained for 365 days in append-only storage.",
  "3. Role assignments follow least-privilege scopes with 4-hour elevation.",
  "4. Automated backups replicate asynchronously across two zones.",
  "5. Telemetry logs redact bearer headers prior to storage.",
];

export default function ScrollablePolicyDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Review Audit Policy</Button>
      </DialogTrigger>
      <DialogContent size="md" scrollable showEscHint>
        <DialogHeader>
          <DialogTitle>Data Retention Policy</DialogTitle>
          <DialogDescription>
            Review compliance controls before enabling workspace-wide enforcement.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="max-h-56 space-y-3">
          {policyClauses.map((clause) => (
            <p key={clause} className="text-xs leading-relaxed text-muted-foreground">
              {clause}
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button onClick={() => setOpen(false)}>Accept Policy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
  },
  {
    name: "Mobile-First Bottom Sheet Dialog",
    description: "Bottom-anchored drawer dialog variant for responsive mobile and tablet task sheets.",
    component: <DrawerVariantDialogDemo />,
    code: `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Button,
} from "nexoreui";

export default function DrawerDialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Bottom Sheet Dialog</Button>
      </DialogTrigger>
      <DialogContent variant="drawer">
        <DialogHeader>
          <DialogTitle>Export Diagnostics Bundle</DialogTitle>
          <DialogDescription>
            Download anonymized crash dumps and edge trace metrics for the past 24 hours.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex items-center justify-between text-xs font-mono tabular-nums">
            <span>Archive size</span>
            <span className="text-foreground font-semibold">4.8 MB (.tar.gz)</span>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Download Archive</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
  },
  {
    name: "Compact Deployment Receipt",
    description: "Success hairline accent with tabular metrics summary inside a small dialog container.",
    component: <SuccessReceiptDialogDemo />,
    code: `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Button,
} from "nexoreui";
import { CheckCircle2 } from "lucide-react";

export default function SuccessReceiptDialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Release Receipt</Button>
      </DialogTrigger>
      <DialogContent variant="success" size="sm" showEscHint>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>Deployment Promoted</span>
          </DialogTitle>
          <DialogDescription>
            Build #482 is now serving 100% of production traffic.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
            <div className="rounded-lg border border-border bg-muted/30 p-2">
              <div className="text-[10px] text-muted-foreground uppercase">Latency</div>
              <div className="text-foreground font-semibold mt-0.5">11 ms</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-2">
              <div className="text-[10px] text-muted-foreground uppercase">Regions</div>
              <div className="text-foreground font-semibold mt-0.5">4 / 4 live</div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
  },
];

const modalPropsData = [
  { name: "variant", type: '"default" | "glass" | "destructive" | "success" | "fullscreen" | "drawer" | "command"', defaultValue: '"default"', description: "Visual surface and viewport layout mode of DialogContent.", required: false },
  { name: "size", type: '"sm" | "md" | "lg" | "xl" | "2xl" | "full"', defaultValue: '"lg"', description: "Responsive maximum width constraint.", required: false },
  { name: "scrollable", type: "boolean", defaultValue: "false", description: "Caps dialog height at 82vh with internal vertical scrolling.", required: false },
  { name: "showEscHint", type: "boolean", defaultValue: "false", description: "Displays a monochrome ESC keycap hint beside the close button.", required: false },
  { name: "hideClose", type: "boolean", defaultValue: "false", description: "Hides the top-right dismiss button when an explicit footer action is required.", required: false },
  { name: "DialogStepHeader", type: "{ step, totalSteps, label }", defaultValue: "-", description: "Segmented progress strip with tabular step indicator.", required: false },
  { name: "DialogConfirmButton", type: "{ onConfirm, holdDuration, label }", defaultValue: "1200ms", description: "Press-and-hold confirmation trigger supporting pointer and keyboard Space/Enter.", required: false },
];

export function ModalSection() {
  return (
    <section id="modals" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which variant"
        items={[
          { label: "default / glass", description: "Focused editing forms, workspace settings, and medium-complexity decisions." },
          { label: "destructive + hold", description: "Irreversible key revocations or resource deletions guarded by DialogConfirmButton." },
          { label: "DialogStepHeader", description: "Sequential 2-4 step onboarding or provisioning flows inside a modal shell." },
          { label: "drawer", description: "Bottom-anchored sheets optimized for thumb reach on compact mobile viewports." },
          { label: "fullscreen", description: "Distraction-free document review or multi-pane editors needing full viewport width." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={DialogPlaygroundWrapper}
          componentName="Dialog"
          importFrom="nexoreui"
          controls={[
            {
              name: "isOpen",
              type: "boolean",
              defaultValue: false,
              description: "Controls live portal modal visibility",
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "glass", "destructive", "success", "fullscreen", "drawer", "command"],
              defaultValue: "default",
              description: "Dialog surface and viewport mode",
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg", "xl", "2xl", "full"],
              defaultValue: "lg",
              description: "Maximum dialog width",
            },
            {
              name: "scrollable",
              type: "boolean",
              defaultValue: false,
              description: "Enables internal vertical scrolling",
            },
            {
              name: "showEscHint",
              type: "boolean",
              defaultValue: true,
              description: "Shows ESC keyboard shortcut badge",
            },
            {
              name: "title",
              type: "text",
              defaultValue: "Workspace Settings",
              description: "Heading rendered inside DialogTitle",
            },
            {
              name: "description",
              type: "text",
              defaultValue: "Update runtime limits and webhook targets for this environment.",
              description: "Subheading rendered inside DialogDescription",
            },
            {
              name: "confirmText",
              type: "text",
              defaultValue: "Save changes",
              description: "Primary footer action label",
            },
            {
              name: "cancelText",
              type: "text",
              defaultValue: "Cancel",
              description: "Secondary dismiss action label",
            },
            {
              name: "children",
              type: "text",
              defaultValue: "All configuration changes synchronize across edge nodes immediately.",
              description: "Body content inside DialogBody",
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

      <PropsTable propsData={modalPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Focus Containment & Return:</strong> Built on Radix UI Dialog so <kbd className="bg-muted px-1 rounded text-[10px]">Tab</kbd> stays trapped while open and returns focus to the trigger upon close.</li>
          <li><strong>Keyboard Hold Safety:</strong> <code className="text-primary font-mono text-[10px]">DialogConfirmButton</code> responds to sustained <kbd className="bg-muted px-1 rounded text-[10px]">Space</kbd> or <kbd className="bg-muted px-1 rounded text-[10px]">Enter</kbd> holds and resets cleanly on blur or early release.</li>
          <li><strong>Reduced Motion:</strong> Step progress transitions and overlay fades honor <code className="text-primary font-mono text-[10px]">prefers-reduced-motion</code> automatically.</li>
        </ul>
      </div>
    </section>
  );
}
