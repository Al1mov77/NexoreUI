"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { GradientFocusInput, AnimatedLabelInput, OTPCodeInput, TagInput, SearchCommandInput, CurrencyInput, TextareaAutosize, RangeSliderInput, ColorPickerInput, ToggleInput, Button } from "nexoreui";

const variants = [
  {
    name: "Gradient Focus Input",
    component: <GradientFocusInput placeholder="Focus to see gradient border..." className="max-w-xs" />,
    code: `import { GradientFocusInput } from "nexoreui"\n\n<GradientFocusInput placeholder="Focus me..." />`
  },
  {
    name: "Animated Label Input",
    component: <div className="pt-4"><AnimatedLabelInput label="Full Name" className="max-w-xs" /></div>,
    code: `import { AnimatedLabelInput } from "nexoreui"\n\n<AnimatedLabelInput label="Full Name" />`
  },
  {
    name: "OTP Code Input",
    component: <OTPCodeInput length={6} onComplete={() => {}} />,
    code: `import { OTPCodeInput } from "nexoreui"\n\n<OTPCodeInput length={6} onComplete={(val) => console.log(val)} />`
  },
  {
    name: "Tag Input",
    component: <TagInput initialTags={["React", "Next.js", "Tailwind"]} placeholder="Add a tag..." className="max-w-xs" />,
    code: `import { TagInput } from "nexoreui"\n\n<TagInput \n  initialTags={["React", "Next.js", "Tailwind"]} \n  placeholder="Add a tag..." \n/>`
  },
  {
    name: "Search Command Input",
    component: <SearchCommandInput placeholder="Search components... (Ctrl+K)" shortcut="⌘K" className="max-w-xs" />,
    code: `import { SearchCommandInput } from "nexoreui"\n\n<SearchCommandInput \n  placeholder="Search..." \n  shortcut="⌘K" \n/>`
  },
  {
    name: "Currency Input",
    component: <CurrencyInput currency="USD" defaultValue={199.99} className="max-w-xs" />,
    code: `import { CurrencyInput } from "nexoreui"\n\n<CurrencyInput currency="USD" defaultValue={199.99} />`
  },
  {
    name: "Textarea Autosize",
    component: <TextareaAutosize minRows={2} maxRows={6} placeholder="Type a long message... It will grow automatically." className="max-w-xs" />,
    code: `import { TextareaAutosize } from "nexoreui"\n\n<TextareaAutosize minRows={2} maxRows={6} placeholder="..." />`
  },
  {
    name: "Color Picker Input",
    component: <ColorPickerInput defaultValue="#3b82f6" className="max-w-xs" />,
    code: `import { ColorPickerInput } from "nexoreui"\n\n<ColorPickerInput defaultValue="#3b82f6" />`
  },
  {
    name: "Toggle Input Group",
    component: <ToggleInput options={["Small", "Medium", "Large"]} defaultValue="Medium" />,
    code: `import { ToggleInput } from "nexoreui"\n\n<ToggleInput \n  options={["Small", "Medium", "Large"]} \n  defaultValue="Medium" \n/>`
  },
  {
    name: "Password Input (with strength)",
    component: <div className="space-y-2 max-w-xs w-full"><AnimatedLabelInput label="Password" type="password" /><div className="flex gap-1 mt-2"><div className="h-1.5 flex-1 rounded-full bg-red-500"></div><div className="h-1.5 flex-1 rounded-full bg-orange-500"></div><div className="h-1.5 flex-1 rounded-full bg-green-500"></div><div className="h-1.5 flex-1 rounded-full bg-secondary"></div></div><p className="text-xs text-muted-foreground text-right mt-1">Strong</p></div>,
    code: `import { PasswordInput } from "nexoreui"\n\n<PasswordInput showStrengthIndicator />`
  }
];

export function SpecialInputsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="special-inputs" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Special Inputs</h2>
          <p className="text-muted-foreground">Advanced input fields for specific data types and interactions.</p>
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
  );
}
