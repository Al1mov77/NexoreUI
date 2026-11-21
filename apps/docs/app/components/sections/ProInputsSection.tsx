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
      title="Specialized Inputs"
      description="Specialized input primitives for structured data entry: OTP verification inputs with clipboard paste, controlled/uncontrolled tag editors, formatted currency fields, auto-expanding textareas, and color pickers."
      cliCommand="npx nexoreui add pro-inputs"
      items={[
        {
          name: "OTP Verification Code Input",
          description: "Segmented security pin input with automatic focus advancement, arrow navigation, and multi-digit paste.",
          component: (
            <div className="flex flex-col items-center gap-3 max-w-full">
              <OTPCodeInput length={6} onChange={(val: string) => setEnteredOtp(val)} />
              {enteredOtp && (
                <span className="text-xs font-mono text-muted-foreground">Value: {enteredOtp}</span>
              )}
            </div>
          ),
          code: `import { useState } from "react";
import { OTPCodeInput } from "nexoreui";

export default function OtpDemo() {
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-col items-center gap-3">
      <OTPCodeInput length={6} onChange={setCode} />
      {code && (
        <span className="text-xs font-mono text-muted-foreground">
          Code: {code}
        </span>
      )}
    </div>
  );
}`,
          propsData: [
            { name: "length", type: "number", defaultValue: "6", description: "Number of numeric pin segments.", required: false },
            { name: "onChange", type: "(val: string) => void", defaultValue: "-", description: "Callback triggered on each digit input change.", required: false },
            { name: "className", type: "string", defaultValue: "-", description: "Optional container class name.", required: false }
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
            { name: "value", type: "string[]", defaultValue: "-", description: "Controlled array of tag strings.", required: false },
            { name: "defaultValue", type: "string[]", defaultValue: '["React", "Next.js", "Tailwind"]', description: "Initial tags when used uncontrolled.", required: false },
            { name: "onChange", type: "(tags: string[]) => void", defaultValue: "-", description: "Callback fired when tags are added or removed.", required: false },
            { name: "placeholder", type: "string", defaultValue: "'Add tag...'", description: "Placeholder string for tag input field.", required: false },
            { name: "className", type: "string", defaultValue: "-", description: "Container CSS classes.", required: false }
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
          code: `import { useState } from "react";
import { ColorPickerInput } from "nexoreui";

export default function ColorPickerDemo() {
  const [color, setColor] = useState("#18181b");

  return (
    <ColorPickerInput
      value={color}
      onChange={setColor}
      label="Accent Color"
    />
  );
}`,
          propsData: [
            { name: "value", type: "string", defaultValue: "'#18181b'", description: "Initial hexadecimal color value.", required: false },
            { name: "onChange", type: "(color: string) => void", defaultValue: "-", description: "Callback when color is modified.", required: false },
            { name: "label", type: "string", defaultValue: "-", description: "Optional descriptive label.", required: false }
          ]
        }
      ]}
      a11yNotes={[
        "OTPCodeInput supports arrow keys, backspace navigation, and clipboard paste across numeric fields.",
        "TagInput tokens feature keyboard-accessible remove triggers with clear contrast.",
        "ColorPickerInput wraps standard HTML5 color input ensuring full keyboard and accessibility support."
      ]}
    />
  );
}
