"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
import { Stepper, Button } from "nexoreui"
import { CreditCard, Shield, Truck, Sparkles, CheckCircle2 } from "lucide-react"
import { A11yHeader } from "../A11yNotice"

const basicSteps = [
  { title: "Account", description: "Create username & pass" },
  { title: "Payment", description: "Link credit card details" },
  { title: "Review", description: "Final validation checking" }
]

const iconSteps = [
  { title: "Checkout", description: "Add cart items", icon: <CreditCard className="h-4 w-4" /> },
  { title: "Security", description: "OTP verification", icon: <Shield className="h-4 w-4" /> },
  { title: "Shipping", description: "Delivery details", icon: <Truck className="h-4 w-4" /> },
  { title: "Done", description: "Order confirmation", icon: <Sparkles className="h-4 w-4" /> }
]

function StepperWizardDemo({ variant, orientation, size = "md" }: any) {
  const [currentStep, setCurrentStep] = useState(1)
  const steps = variant === "arrows" ? iconSteps : basicSteps

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <Stepper
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        steps={steps}
        variant={variant}
        orientation={orientation}
        size={size}
      />
      <div className="p-5 rounded-2xl bg-muted/40 border border-border text-center text-sm font-medium">
        {currentStep === 0 && <p className="text-muted-foreground">Step 1: Create your account credentials.</p>}
        {currentStep === 1 && <p className="text-muted-foreground">Step 2: Enter payment methods & billing address.</p>}
        {currentStep === 2 && <p className="text-muted-foreground">Step 3: Review summary details and submit order.</p>}
        {currentStep >= 3 && (
          <p className="text-emerald-500 font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> All steps completed successfully!
          </p>
        )}
      </div>
      <div className="flex justify-between items-center">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}>
          Back
        </Button>
        <span className="text-xs font-mono text-muted-foreground">Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</span>
        <Button size="sm" onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))} disabled={currentStep === steps.length}>
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
    name: "1. Interactive Step Wizard (Clickable)",
    component: <StepperWizardDemo />,
    code: `import React, { useState } from "react";
import { Stepper, Button } from "nexoreui";

export default function WizardDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { title: "Account", description: "Username & pass" },
    { title: "Payment", description: "Credit card details" },
    { title: "Review", description: "Final validation" }
  ];

  return (
    <div className="flex flex-col gap-6">
      <Stepper
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        steps={steps}
      />
      <div className="flex justify-between">
        <Button onClick={() => setCurrentStep(s => Math.max(0, s - 1))}>Back</Button>
        <Button onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}>Next</Button>
      </div>
    </div>
  );
}`
  },
  {
    name: "2. Numbered Circles Style",
    component: <StepperWizardDemo variant="circles" size="md" />,
    code: `import { Stepper } from "nexoreui";

<Stepper 
  currentStep={1} 
  variant="circles" 
  steps={[
    { title: "Account" },
    { title: "Payment" },
    { title: "Review" }
  ]} 
/>`
  },
  {
    name: "3. Chevron Arrows with Icons",
    component: <StepperWizardDemo variant="arrows" />,
    code: `import { Stepper } from "nexoreui";
import { CreditCard, Shield, Truck } from "lucide-react";

<Stepper 
  currentStep={2} 
  variant="arrows" 
  steps={[
    { title: "Checkout", icon: <CreditCard className="h-4 w-4" /> },
    { title: "Security", icon: <Shield className="h-4 w-4" /> },
    { title: "Shipping", icon: <Truck className="h-4 w-4" /> }
  ]} 
/>`
  },
  {
    name: "4. Vertical Layout with Continuous Connector Line",
    component: <StepperWizardDemo orientation="vertical" />,
    code: `import { Stepper } from "nexoreui";

<Stepper 
  currentStep={1} 
  orientation="vertical" 
  steps={basicSteps} 
/>`
  },
  {
    name: "5. Initial Incomplete State",
    component: <Stepper currentStep={0} steps={basicSteps} className="w-full max-w-md" />,
    code: `import { Stepper } from "nexoreui";

<Stepper currentStep={0} steps={basicSteps} />`
  }
]

const stepperPropsData = [
  { name: "steps", type: "StepItem[]", defaultValue: "—", description: "Array of step item structures containing title, description, and icon.", required: true },
  { name: "currentStep", type: "number", defaultValue: "—", description: "Active step index (0-indexed).", required: true },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Controls whether steps flow horizontal or down vertical.", required: false },
  { name: "variant", type: '"default" | "circles" | "arrows"', defaultValue: '"default"', description: "The preset layout visual style variant.", required: false },
  { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Sizing scale dimensions of indicators and icons.", required: false },
  { name: "onStepClick", type: "(stepIndex: number) => void", defaultValue: "—", description: "Enables direct step click navigation.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
]

export function StepperSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="stepper" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stepper</h2>
          <p className="text-muted-foreground mt-1">
            Wizard layout displaying progress in multi-step workflows with smooth transitions, continuous vertical alignment, and direct step clicking.
          </p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["horizontal default", "Guided multi-step tasks where space is ample and step labels are necessary"],
            ["circles variant", "Compact layouts with numbered circle indicators, ideal for mobile or dense grids"],
            ["arrows variant", "Strict linear progress sequences like checkout flows and delivery tracking systems"],
            ["vertical orientation", "Form wizards on sidepanels or checkout drawers with multi-line step descriptions"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Playground */}
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

      {/* Examples list */}
      <div className="space-y-12">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}

      {/* Props Reference Table */}
      <PropsTable propsData={stepperPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Focus:</strong> Step indicators are interactive buttons supporting keyboard focus and activation with <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Space</kbd>.</li>
          <li><strong>Progress Tracking:</strong> Screen readers announce the active step via <code className="text-primary font-mono text-[10px]">aria-valuenow</code> and step index.</li>
        </ul>
      </div>
    </section>
  )
}
