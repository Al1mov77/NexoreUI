"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
import { Stepper, Button } from "nexoreui"
import { CreditCard, Shield, Truck, Sparkles } from "lucide-react"

const basicSteps = [
  { title: "Account", description: "Create username and pass" },
  { title: "Payment", description: "Link credit card details" },
  { title: "Review", description: "Final validation checking" }
]

const iconSteps = [
  { title: "Checkout", description: "Add cart items", icon: <CreditCard className="h-4 w-4" /> },
  { title: "Security", description: "OTP verification", icon: <Shield className="h-4 w-4" /> },
  { title: "Shipping", description: "Deliver details", icon: <Truck className="h-4 w-4" /> },
  { title: "Done", description: "Order confirmation", icon: <Sparkles className="h-4 w-4" /> }
]

function StepperWizardDemo({ variant, orientation }: any) {
  const [currentStep, setCurrentStep] = useState(1)
  const steps = variant === "arrows" ? iconSteps : basicSteps

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <Stepper currentStep={currentStep} steps={steps} variant={variant} orientation={orientation} />
      <div className="p-6 rounded-2xl bg-muted/40 border border-border text-center text-sm font-medium">
        {currentStep === 0 && <p>Create your credentials to proceed.</p>}
        {currentStep === 1 && <p>Enter billing information and addresses.</p>}
        {currentStep === 2 && <p>Review final order values and submit.</p>}
        {currentStep >= 3 && <p>Your order was successfully completed!</p>}
      </div>
      <div className="flex justify-between items-center">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}>Back</Button>
        <Button size="sm" onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))} disabled={currentStep === steps.length}>Next</Button>
      </div>
    </div>
  )
}

const examples = [
  {
    name: "Interactive Step Wizard",
    component: <StepperWizardDemo />,
    code: `import React, { useState } from "react"\nimport { Stepper, Button } from "nexoreui"\n\nexport function Demo() {\n  const [currentStep, setCurrentStep] = useState(0)\n  const steps = [\n    { title: "Account", description: "Username & pass" },\n    { title: "Payment", description: "Credit card details" },\n    { title: "Review", description: "Final validation" }\n  ]\n  return (\n    <div className="flex flex-col gap-6">\n      <Stepper currentStep={currentStep} steps={steps} />\n      <div className="flex justify-between">\n        <Button onClick={() => setCurrentStep(s => Math.max(0, s - 1))}>Back</Button>\n        <Button onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}>Next</Button>\n      </div>\n    </div>\n  )\n}`
  },
  {
    name: "Circles Layout Style",
    component: <StepperWizardDemo variant="circles" />,
    code: `import { Stepper } from "nexoreui"\n\n<Stepper \n  currentStep={1} \n  variant="circles" \n  steps={[\n    { title: "Account" },\n    { title: "Payment" },\n    { title: "Review" }\n  ]} \n/>`
  },
  {
    name: "Arrow Layout with Icons",
    component: <StepperWizardDemo variant="arrows" />,
    code: `import { Stepper } from "nexoreui"\nimport { CreditCard, Shield, Truck } from "lucide-react"\n\n<Stepper \n  currentStep={2} \n  variant="arrows" \n  steps={[\n    { title: "Checkout", icon: <CreditCard className="h-4 w-4" /> },\n    { title: "Security", icon: <Shield className="h-4 w-4" /> },\n    { title: "Shipping", icon: <Truck className="h-4 w-4" /> }\n  ]} \n/>`
  },
  {
    name: "Vertical Layout Alignment",
    component: <StepperWizardDemo orientation="vertical" />,
    code: `import { Stepper } from "nexoreui"\n\n<Stepper \n  currentStep={1} \n  orientation="vertical" \n  steps={basicSteps} \n/>`
  },
  {
    name: "Initial Incomplete State",
    component: <Stepper currentStep={0} steps={basicSteps} />,
    code: `import { Stepper } from "nexoreui"\n\n<Stepper currentStep={0} steps={basicSteps} />`
  }
]

const stepperPropsData = [
  { name: "steps", type: "StepItem[]", defaultValue: "—", description: "Array of step item structures containing title, description, and icon.", required: true },
  { name: "currentStep", type: "number", defaultValue: "—", description: "Active step index (0-indexed).", required: true },
  { name: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"', description: "Controls whether steps flow horizontal or down vertical.", required: false },
  { name: "variant", type: '"default" | "circles" | "arrows"', defaultValue: '"default"', description: "The preset layout visual style variant.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

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
          <p className="text-muted-foreground mt-1">Wizard layout to display tracking progress in multi-step structures with custom active transitions.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["default layout", "Guided multi-step tasks where space is ample and step labels are necessary"],
            ["circles variant", "Compact layouts with numbered circle indicators, ideal for mobile or dense grids"],
            ["arrows variant", "Strict linear progress sequences like checkout flows and delivery tracking systems"],
            ["vertical alignment", "Form wizards on sidepanels or vertical checkout sidebars with varying step lengths"],
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
          component={(props: any) => (
            <Stepper {...props} steps={basicSteps} className="w-full" />
          )}
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
            }
          ]}
        />
      </div>

      {/* Examples list */}
      <div className="space-y-12">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Progress Landmarks:</strong> Uses native HTML list structure <code className="text-primary font-mono text-[10px]">&lt;ol&gt;</code> and <code className="text-primary font-mono text-[10px]">&lt;li&gt;</code> items representing ordered step sequences.</li>
          <li><strong>Step Labels:</strong> Employs <code className="text-primary font-mono text-[10px]">aria-current="step"</code> on the active step block to identify status correctly to screen reader engines.</li>
        </ul>
      </div>
    </section>
  )
}
