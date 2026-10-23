"use client";

import React, { useState } from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  RadioCard,
  ColorSwatch,
  NumberStepper,
  FileDropzone,
  RatingStars,
} from "nexoreui";

export function SpecialFormsSection() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [activeColor, setActiveColor] = useState("zinc");
  const [stepperVal, setStepperVal] = useState(3);
  const [rating, setRating] = useState(4);

  return (
    <SuiteSectionLayout
      id="special-forms"
      title="Special Forms"
      badge="Special Form Elements"
      description="Visual selection cards, numeric steppers, drag-and-drop file dropzones, and interactive rating controls for modern form flows."
      cliCommand="npx nexoreui add special-forms"
      items={[
        {
          name: "Interactive Radio Card",
          description: "Selectable card container that functions as an enhanced radio input for plan/tier choices.",
          component: (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              <RadioCard
                title="Pro Developer"
                description="$29/mo for unlimited deployments"
                selected={selectedPlan === "pro"}
                onClick={() => setSelectedPlan("pro")}
              />
              <RadioCard
                title="Enterprise"
                description="$99/mo with dedicated support"
                selected={selectedPlan === "enterprise"}
                onClick={() => setSelectedPlan("enterprise")}
              />
            </div>
          ),
          code: `import { RadioCard } from "nexoreui"

<RadioCard
  title="Pro Developer"
  description="$29/mo for unlimited deployments"
  selected={selected}
  onClick={() => setSelected(true)}
/>`
        },
        {
          name: "Numeric Quantity Stepper",
          description: "Touch-friendly number increment and decrement control with boundary locks.",
          component: (
            <div className="p-4">
              <NumberStepper
                value={stepperVal}
                min={1}
                max={10}
                onChange={setStepperVal}
              />
            </div>
          ),
          code: `import { NumberStepper } from "nexoreui"

<NumberStepper
  value={value}
  min={1}
  max={10}
  onChange={setValue}
/>`
        },
        {
          name: "Interactive Drag-and-Drop Dropzone",
          description: "Visual upload area supporting drag over states, file format badges, and click triggers.",
          component: (
            <div className="w-full max-w-sm">
              <FileDropzone onDrop={() => {}} />
            </div>
          ),
          code: `import { FileDropzone } from "nexoreui"

<FileDropzone onDrop={(files) => handleUpload(files)} />`
        },
        {
          name: "Star Rating Input",
          description: "Interactive rating widget supporting hover highlighting and fractional click feedback.",
          component: (
            <div className="p-4">
              <RatingStars value={rating} onChange={setRating} />
            </div>
          ),
          code: `import { RatingStars } from "nexoreui"

<RatingStars value={rating} onChange={setRating} />`
        }
      ]}
      a11yNotes={[
        "Radio Groups: Radio cards maintain role='radio' and aria-checked states.",
        "Stepper Controls: Increment/decrement buttons include explicit aria-label tags."
      ]}
    />
  );
}
