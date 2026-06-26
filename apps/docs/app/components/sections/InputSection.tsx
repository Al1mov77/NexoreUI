"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { Input, FloatingLabelInput, UnderlineInput, IconInputLeft, IconInputRight, PillInput, ErrorInput, SuccessInput, GhostInput, NeumorphicInput, Button } from "nexoreui";

const variants = [
  {
    name: "Default Input",
    component: <Input placeholder="Type something..." className="max-w-xs" />,
    code: `import { Input } from "nexoreui"\n\n<Input placeholder="Type something..." />`
  },
  {
    name: "Input with Label & Helper Text",
    component: <Input label="Email Address" description="We will never share your email." placeholder="you@example.com" className="max-w-xs" required />,
    code: `import { Input } from "nexoreui"\n\n<Input \n  label="Email Address" \n  description="We will never share your email." \n  placeholder="you@example.com" \n  required \n/>`
  },
  {
    name: "Floating Label Input",
    component: <FloatingLabelInput label="Username" id="floating-user" className="max-w-xs" />,
    code: `import { FloatingLabelInput } from "nexoreui"\n\n<FloatingLabelInput label="Username" id="username" />`
  },
  {
    name: "Icon Left Input",
    component: <IconInputLeft placeholder="Search database..." className="max-w-xs" />,
    code: `import { IconInputLeft } from "nexoreui"\n\n<IconInputLeft placeholder="Search database..." />`
  },
  {
    name: "Icon Right Input",
    component: <IconInputRight placeholder="Enter password" type="password" className="max-w-xs" />,
    code: `import { IconInputRight } from "nexoreui"\n\n<IconInputRight placeholder="Enter password" type="password" />`
  },
  {
    name: "Error State Input",
    component: <ErrorInput placeholder="invalid-email" errorMessage="Please enter a valid email address." className="max-w-xs" />,
    code: `import { ErrorInput } from "nexoreui"\n\n<ErrorInput \n  placeholder="invalid-email" \n  errorMessage="Please enter a valid email address." \n/>`
  },
  {
    name: "Success State Input",
    component: <SuccessInput placeholder="username-available" className="max-w-xs" />,
    code: `import { SuccessInput } from "nexoreui"\n\n<SuccessInput placeholder="username-available" />`
  },
  {
    name: "Underline Input",
    component: <UnderlineInput placeholder="Modern borderless username" className="max-w-xs" />,
    code: `import { UnderlineInput } from "nexoreui"\n\n<UnderlineInput placeholder="Username" />`
  },
  {
    name: "Neumorphic Soft Input",
    component: <NeumorphicInput placeholder="Soft inset shadow UI" className="max-w-xs" />,
    code: `import { NeumorphicInput } from "nexoreui"\n\n<NeumorphicInput placeholder="Soft UI" />`
  }
];

const inputPropsData = [
  { name: "variant", type: '"default" | "glass" | "gradient" | "underline"', defaultValue: '"default"', description: "Visual style of the input border and background.", required: false },
  { name: "type", type: "string", defaultValue: '"text"', description: "Standard HTML input type (e.g. text, password, email, number).", required: false },
  { name: "placeholder", type: "string", defaultValue: "—", description: "Placeholder text shown when input is empty.", required: false },
  { name: "animate", type: "boolean", defaultValue: "true", description: "Enables interactive focus and entry slide/fade animations.", required: false },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents user interaction and visually mutes the input.", required: false },
  { name: "label", type: "string", defaultValue: "—", description: "Label text rendered above the input.", required: false },
  { name: "description", type: "string", defaultValue: "—", description: "Supporting helper description text rendered below the input.", required: false },
  { name: "error", type: "string", defaultValue: "—", description: "Validation error message. Displays in red and updates aria attributes.", required: false },
  { name: "required", type: "boolean", defaultValue: "false", description: "Adds a required star indicator and applies native standard validation constraints.", required: false },
];

export function InputSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="inputs" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inputs</h2>
        <p className="text-muted-foreground mt-1">
          Text input fields with clean borders, labels, validation states, and helper descriptions.
        </p>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use which variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["default", "Standard dashboard forms, database filtering, account creation"],
            ["floating label", "Sleek onboarding forms, login panels, space-constrained headers"],
            ["underline", "Ultra-minimal editorial interfaces, clean mobile web designs"],
            ["icon left/right", "Search bars, password visibility toggles, credit cards"],
            ["error state", "Form validation failures to alert the user of mistakes"],
            ["success state", "Confirming custom identifiers (like usernames) are available"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={Input}
          componentName="Input"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "glass", "gradient", "underline"],
              defaultValue: "default",
              description: "Visual style of the input field"
            },
            {
              name: "type",
              type: "select",
              options: ["text", "password", "email", "number"],
              defaultValue: "text",
              description: "Input type"
            },
            {
              name: "label",
              type: "text",
              defaultValue: "Username",
              description: "Optional label text above the field"
            },
            {
              name: "description",
              type: "text",
              defaultValue: "Choose a unique username.",
              description: "Optional help description text"
            },
            {
              name: "error",
              type: "text",
              defaultValue: "",
              description: "Optional validation error text"
            },
            {
              name: "placeholder",
              type: "text",
              defaultValue: "Type something...",
              description: "Placeholder text"
            },
            {
              name: "required",
              type: "boolean",
              defaultValue: false,
              description: "Whether field is required"
            },
            {
              name: "animate",
              type: "boolean",
              defaultValue: true,
              description: "Whether to enable animations"
            },
            {
              name: "disabled",
              type: "boolean",
              defaultValue: false,
              description: "Whether the input is disabled"
            }
          ]}
        />
      </div>

      {/* Main variants */}
      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight font-mono text-zinc-300">Showcase & Examples</h3>
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6">
                <div className="w-full max-w-xs">{item.component}</div>
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

      {/* Props Reference Table */}
      <PropsTable propsData={inputPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>ARIA Relationships:</strong> If `label` is provided, the input automatically connects to the label. If `description` or `error` is provided, the input sets <code className="text-primary font-mono text-[10px]">aria-describedby</code> to link text elements for screen readers.</li>
          <li><strong>Validation State:</strong> When an error is active, the input receives <code className="text-primary font-mono text-[10px]">aria-invalid="true"</code> and the error label uses <code className="text-primary font-mono text-[10px]">role="alert"</code>.</li>
          <li><strong>Keyboard Support:</strong> Fully focusable using standard <kbd className="bg-muted px-1 rounded text-[10px]">Tab</kbd> controls, displaying high-contrast outline focus rings.</li>
        </ul>
      </div>
    </section>
  )
}
