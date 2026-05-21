"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
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

export function StepperSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="stepper" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stepper</h2>
          <p className="text-muted-foreground">Wizard layout to display tracking progress in multi-step structures with custom active transitions.</p>
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

      {/* Props Table */}
      <div className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold tracking-tight">API Reference</h3>
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-semibold">
                <th className="p-3">Property</th>
                <th className="p-3">Type</th>
                <th className="p-3">Default</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-mono font-bold text-primary">steps</td>
                <td className="p-3 font-mono text-purple-400">StepItem[]</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Array containing title, description, and optional custom icon elements.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">currentStep</td>
                <td className="p-3 font-mono text-purple-400">number</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Active step numeric index index (0-indexed).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">orientation</td>
                <td className="p-3 font-mono text-purple-400">&quot;horizontal&quot; | &quot;vertical&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;horizontal&quot;</td>
                <td className="p-3">Layout orientation.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">variant</td>
                <td className="p-3 font-mono text-purple-400">&quot;default&quot; | &quot;circles&quot; | &quot;arrows&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;default&quot;</td>
                <td className="p-3">The display style variant of indicators.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
