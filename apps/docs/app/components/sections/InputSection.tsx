"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Input, FloatingLabelInput, UnderlineInput, IconInputLeft, IconInputRight, PillInput, ErrorInput, SuccessInput, GhostInput, NeumorphicInput, Button } from "nexoreui";

const variants = [
  {
    name: "Default Input",
    component: <Input placeholder="Type something..." className="max-w-xs" />,
    code: `import { Input } from "nexoreui"\n\n<Input placeholder="Type something..." />`
  },
  {
    name: "Floating Label",
    component: <FloatingLabelInput label="Email Address" id="email-input" className="max-w-xs" />,
    code: `import { FloatingLabelInput } from "nexoreui"\n\n<FloatingLabelInput label="Email Address" id="email" />`
  },
  {
    name: "Underline Input",
    component: <UnderlineInput placeholder="Username" className="max-w-xs" />,
    code: `import { UnderlineInput } from "nexoreui"\n\n<UnderlineInput placeholder="Username" />`
  },
  {
    name: "Icon Left",
    component: <IconInputLeft placeholder="Search..." className="max-w-xs" />,
    code: `import { IconInputLeft } from "nexoreui"\n\n<IconInputLeft placeholder="Search..." />`
  },
  {
    name: "Icon Right",
    component: <IconInputRight placeholder="Password" type="password" className="max-w-xs" />,
    code: `import { IconInputRight } from "nexoreui"\n\n<IconInputRight placeholder="Password" type="password" />`
  },
  {
    name: "Pill Input",
    component: <PillInput placeholder="Subscribe..." className="max-w-xs" />,
    code: `import { PillInput } from "nexoreui"\n\n<PillInput placeholder="Subscribe..." />`
  },
  {
    name: "Error State",
    component: <ErrorInput placeholder="Invalid email" errorMessage="Please enter a valid email address." className="max-w-xs" />,
    code: `import { ErrorInput } from "nexoreui"\n\n<ErrorInput \n  placeholder="Invalid email" \n  errorMessage="Please enter a valid email address." \n/>`
  },
  {
    name: "Success State",
    component: <SuccessInput placeholder="Username available" className="max-w-xs" />,
    code: `import { SuccessInput } from "nexoreui"\n\n<SuccessInput placeholder="Username available" />`
  },
  {
    name: "Ghost Input",
    component: <GhostInput placeholder="Invisible borders..." className="max-w-xs" />,
    code: `import { GhostInput } from "nexoreui"\n\n<GhostInput placeholder="Invisible borders..." />`
  },
  {
    name: "Neumorphic Input",
    component: <NeumorphicInput placeholder="Soft UI" className="max-w-xs" />,
    code: `import { NeumorphicInput } from "nexoreui"\n\n<NeumorphicInput placeholder="Soft UI" />`
  }
];

export function InputSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="inputs" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inputs</h2>
          <p className="text-muted-foreground">Text input fields with different styles and states.</p>
        </div>
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6">
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
    </section>
  )
}
