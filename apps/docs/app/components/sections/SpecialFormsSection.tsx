"use client";

import React, { useState } from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  RadioCard,
  NumberStepper,
  FileDropzone,
  RatingStars,
} from "nexoreui";

export function SpecialFormsSection() {
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [stepperVal, setStepperVal] = useState(3);
  const [rating, setRating] = useState(4);

  return (
    <SuiteSectionLayout
      id="special-forms"
      title="Form Controls"
      description="Visual selection cards, numeric steppers, drag-and-drop file dropzones, and interactive rating controls for structured forms."
      cliCommand="npx nexoreui add special-forms"
      items={[
        {
          name: "Interactive Radio Card",
          description: "Selectable card container that functions as a visual radio input for option groups.",
          component: (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              <RadioCard
                title="Standard"
                description="$29/mo for up to 10 workspaces"
                selected={selectedPlan === "standard"}
                onClick={() => setSelectedPlan("standard")}
              />
              <RadioCard
                title="Team"
                description="$99/mo with audit logs and SSO"
                selected={selectedPlan === "team"}
                onClick={() => setSelectedPlan("team")}
              />
            </div>
          ),
          code: `import { RadioCard } from "nexoreui"

<RadioCard
  title="Standard"
  description="$29/mo for up to 10 workspaces"
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
