"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
import { WhenToUse } from "../WhenToUse"
import { Stepper, Button } from "nexoreui"
import { CreditCard, Shield, Truck, CheckCircle2 } from "lucide-react"
import { A11yHeader } from "../A11yNotice"

const basicSteps = [
  { title: "Account", description: "Credentials & profile" },
  { title: "Payment", description: "Billing & tax ID" },
  { title: "Review", description: "Confirm order" }
]

const iconSteps = [
  { title: "Checkout", description: "Cart items", icon: <CreditCard className="h-4 w-4" /> },
  { title: "Security", description: "2FA check", icon: <Shield className="h-4 w-4" /> },
  { title: "Shipping", description: "Delivery route", icon: <Truck className="h-4 w-4" /> },
  { title: "Done", description: "Dispatched", icon: <CheckCircle2 className="h-4 w-4" /> }
]

function StepperWizardDemo({ variant, orientation, size = "md" }: any) {
  const [currentStep, setCurrentStep] = useState(1)
  const steps = variant === "arrows" ? iconSteps : basicSteps

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg">
      <Stepper
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        steps={steps}
        variant={variant}
        orientation={orientation}
        size={size}
      />
      <div className="p-4 rounded-xl bg-muted/30 border border-border text-center text-sm font-medium">
        {currentStep === 0 && (
          <p className="text-muted-foreground">Step 1: Create your account credentials.</p>
        )}
        {currentStep === 1 && (
          <p className="text-muted-foreground">Step 2: Enter payment method and billing address.</p>
        )}
        {currentStep === 2 && (
          <p className="text-muted-foreground">Step 3: Review summary details and confirm order.</p>
        )}
        {currentStep >= 3 && (
          <p className="text-success font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> All steps completed.
          </p>
        )}
      </div>
      <div className="flex justify-between items-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <span className="text-xs font-mono text-muted-foreground tabular-nums">
          Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
        </span>
        <Button
          size="sm"
          onClick={() => setCurrentStep((s) => Math.min(steps.length, s + 1))}
          disabled={currentStep === steps.length}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function StepperPlaygroundWrapper(props: any) {
  const [activeStep, setActiveStep] = useState(props.currentStep ?? 1)
  return (
    <div className="w-full max-w-xl">
      <Stepper
        {...props}
        currentStep={props.currentStep !== undefined ? props.currentStep : activeStep}
        onStepClick={props.onStepClick || setActiveStep}
        steps={props.variant === "arrows" ? iconSteps : basicSteps}
        className="w-full"
      />
    </div>
  )
}

const examples = [
  {
    name: "Interactive Step Wizard",
    component: <StepperWizardDemo />,
    code: `import { useState } from "react";
import { Stepper, Button } from "nexoreui";

const steps = [
  { title: "Account", description: "Credentials & profile" },
  { title: "Payment", description: "Billing & tax ID" },
  { title: "Review", description: "Confirm order" },
];

export default function WizardStepperDemo() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg">
      <Stepper
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        steps={steps}
      />
      <div className="flex justify-between items-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          size="sm"
          onClick={() => setCurrentStep((s) => Math.min(steps.length, s + 1))}
          disabled={currentStep === steps.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}`
  },
  {
    name: "Numbered Circles Style",
    component: <StepperWizardDemo variant="circles" size="md" />,
    code: `import { useState } from "react";
import { Stepper } from "nexoreui";

const steps = [
  { title: "Account" },
  { title: "Payment" },
  { title: "Review" },
];

export default function CircleStepperDemo() {
  const [step, setStep] = useState(1);

  return (
    <Stepper
      currentStep={step}
      onStepClick={setStep}
      variant="circles"
      steps={steps}
    />
  );
}`
  },
  {
    name: "Chevron Arrows with Icons",
    component: <StepperWizardDemo variant="arrows" />,
    code: `import { useState } from "react";
import { Stepper } from "nexoreui";
import { CreditCard, Shield, Truck, CheckCircle2 } from "lucide-react";

const steps = [
  { title: "Checkout", description: "Cart items", icon: <CreditCard className="h-4 w-4" /> },
  { title: "Security", description: "2FA check", icon: <Shield className="h-4 w-4" /> },
  { title: "Shipping", description: "Delivery route", icon: <Truck className="h-4 w-4" /> },
  { title: "Done", description: "Dispatched", icon: <CheckCircle2 className="h-4 w-4" /> },
];

export default function ArrowIconStepperDemo() {
  const [step, setStep] = useState(2);

  return (
    <Stepper
      currentStep={step}
      onStepClick={setStep}
      variant="arrows"
      steps={steps}
    />
  );
}`
  },
  {
    name: "Vertical Layout with Continuous Line",
    component: <StepperWizardDemo orientation="vertical" />,
    code: `import { useState } from "react";
import { Stepper } from "nexoreui";

const steps = [
  { title: "Account", description: "Credentials & profile" },
  { title: "Payment", description: "Billing & tax ID" },
  { title: "Review", description: "Confirm order" },
];

export default function VerticalStepperDemo() {
  const [step, setStep] = useState(1);

  return (
    <Stepper
      currentStep={step}
      onStepClick={setStep}
      orientation="vertical"
      steps={steps}
    />
  );
}`
  },
  {
    name: "Static Read-Only Progress",
    component: <Stepper currentStep={0} steps={basicSteps} className="w-full max-w-md" />,
    code: `import { Stepper } from "nexoreui";

const steps = [
  { title: "Account", description: "Credentials & profile" },
  { title: "Payment", description: "Billing & tax ID" },
  { title: "Review", description: "Confirm order" },
];

export default function ReadOnlyStepperDemo() {
  return <Stepper currentStep={0} steps={steps} className="w-full max-w-md" />;
}`
  }
]

const stepperPropsData = [
  { name: "steps", type: "StepItem[]", defaultValue: "-", description: "Array of step item structures containing title, description, and icon.", required: true },
  { name: "currentStep", type: "number", defaultValue: "-", description: "Active step index (0-indexed).", required: true },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Controls whether steps flow horizontally or vertically.", required: false },
  { name: "variant", type: '"default" | "circles" | "arrows"', defaultValue: '"default"', description: "The preset layout visual style variant.", required: false },
  { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Sizing scale dimensions of indicators and icons.", required: false },
  { name: "onStepClick", type: "(stepIndex: number) => void", defaultValue: "-", description: "Enables direct step click navigation.", required: false },
  { name: "className", type: "string", defaultValue: "-", description: "Additional custom class names.", required: false },
]

export function StepperSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="stepper" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Stepper</h2>
        <p className="text-muted-foreground mt-1">
          Multi-step progress indicator for onboarding, checkout flows, and configuration wizards.
        </p>
      </div>

      <WhenToUse
        items={[
          { label: "horizontal", description: "Linear 3–4 step workflows across wide containers where titles fit side-by-side." },
          { label: "circles", description: "Compact numbered progress indicators when step labels are short or concise." },
          { label: "arrows", description: "Strict sequential order such as checkout, verification, and fulfillment states." },
          { label: "vertical", description: "Mobile drawers or detailed onboarding steps that include multi-line descriptions." },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={StepperPlaygroundWrapper}
          componentName="Stepper"
          importFrom="nexoreui"
          controls={[
            {
              name: "currentStep",
              type: "number",
              defaultValue: 1,
              description: "Current active step index (0-indexed)"
            },
            {
              name: "orientation",
              type: "select",
              options: ["horizontal", "vertical"],
              defaultValue: "horizontal",
              description: "Stepper layout flow orientation"
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "circles", "arrows"],
              defaultValue: "default",
              description: "Visual indicator style variant"
            },
            {
              name: "size",
              type: "select",
              options: ["sm", "md", "lg"],
              defaultValue: "md",
              description: "Indicator sizing dimensions"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-background p-6">
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

      <PropsTable propsData={stepperPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Focus:</strong> Step indicators render as native <code className="text-primary font-mono text-[10px]">&lt;button&gt;</code> controls supporting <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Enter</kbd> and <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Space</kbd>.</li>
          <li><strong>Progress Tracking:</strong> The active step exposes <code className="text-primary font-mono text-[10px]">aria-current="step"</code> and explicit step titles.</li>
        </ul>
      </div>
    </section>
  )
}
