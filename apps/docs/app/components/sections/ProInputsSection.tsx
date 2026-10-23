"use client";

import React, { useState } from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  OTPCodeInput,
  TagInput,
  CurrencyInput,
  TextareaAutosize,
  ColorPickerInput,
} from "nexoreui";

export function ProInputsSection() {
  const [color, setColor] = useState("#18181b");
  const [enteredOtp, setEnteredOtp] = useState("");

  return (
    <SuiteSectionLayout
      id="pro-inputs"
      title="Pro Inputs"
      badge="Specialized Controls"
      description="Specialized input primitives for high-precision data entry: OTP verification pins, tag tokenizers, formatted currency fields, and auto-expanding textareas."
      cliCommand="npx nexoreui add pro-inputs"
      items={[
        {
          name: "OTP Verification Code Input",
          description: "Segmented security pin input with automatic focus advancement across digits.",
          component: (
            <div className="p-4 flex flex-col items-center gap-3">
              <OTPCodeInput length={6} onChange={(val: string) => setEnteredOtp(val)} />
              {enteredOtp && (
                <span className="text-xs font-mono text-muted-foreground">Value: {enteredOtp}</span>
              )}
            </div>
          ),
          code: `import { OTPCodeInput } from "nexoreui"

<OTPCodeInput
  length={6}
  onChange={(code) => handleCode(code)}
/>`,
          propsData: [
            { name: "length", type: "number", defaultValue: "6", description: "Number of numeric pin segments.", required: false },
            { name: "onChange", type: "(val: string) => void", defaultValue: "—", description: "Callback triggered on each digit input change.", required: false },
            { name: "className", type: "string", defaultValue: "—", description: "Optional container class name.", required: false }
          ]
        },
        {
          name: "Interactive Tag Input",
          description: "Tokenizing input that converts typed enter keys into removable pill tags.",
          component: (
            <div className="w-full max-w-sm p-2">
              <TagInput placeholder="Add tag and press enter..." />
            </div>
          ),
          code: `import { TagInput } from "nexoreui"

<TagInput placeholder="Add tag and press enter..." />`,
          propsData: [
            { name: "placeholder", type: "string", defaultValue: "'Add tag...'", description: "Placeholder string for tag input field.", required: false },
            { name: "className", type: "string", defaultValue: "—", description: "Container CSS classes.", required: false }
          ]
        },
        {
          name: "Currency Masked Input",
          description: "Numerical input field with currency symbol prefix.",
          component: (
            <div className="w-full max-w-xs">
              <CurrencyInput
                currency="$"
                placeholder="0.00"
                defaultValue="250.00"
              />
            </div>
          ),
          code: `import { CurrencyInput } from "nexoreui"

<CurrencyInput currency="$" defaultValue="250.00" />`,
          propsData: [
            { name: "currency", type: "string", defaultValue: "'$'", description: "Currency symbol prefix rendered inside the input.", required: false }
          ]
        },
        {
          name: "Auto-Expanding Textarea",
          description: "Smooth multi-line textarea that dynamically expands its height to fit content without scrollbars.",
          component: (
            <div className="w-full max-w-sm">
              <TextareaAutosize
                placeholder="Describe project requirements (dynamically expands as you type)..."
              />
            </div>
          ),
          code: `import { TextareaAutosize } from "nexoreui"

<TextareaAutosize placeholder="Describe project requirements..." />`
        },
        {
          name: "Hex Color Picker Input",
          description: "Visual swatch picker with native color selection and synchronized state.",
          component: (
            <div className="w-full max-w-xs">
              <ColorPickerInput value={color} onChange={setColor} label="Accent Color" />
            </div>
          ),
          code: `import { ColorPickerInput } from "nexoreui"

<ColorPickerInput value={color} onChange={setColor} />`,
          propsData: [
            { name: "value", type: "string", defaultValue: "'#8b5cf6'", description: "Initial hexadecimal color value.", required: false },
            { name: "onChange", type: "(color: string) => void", defaultValue: "—", description: "Callback when color is modified.", required: false },
            { name: "label", type: "string", defaultValue: "—", description: "Optional descriptive label.", required: false }
          ]
        }
      ]}
      a11yNotes={[
        "OTPCodeInput handles arrow keys and backspace navigation between numeric fields seamlessly.",
        "TagInput tokens feature keyboard-accessible remove triggers with clear contrast.",
        "ColorPickerInput wraps standard HTML5 color input ensuring full keyboard and accessibility support."
      ]}
    />
  );
}
