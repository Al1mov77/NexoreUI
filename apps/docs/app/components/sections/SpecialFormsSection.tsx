"use client";

import React, { useState } from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  RadioCard,
  NumberStepper,
  FileDropzone,
  RatingStars,
} from "nexoreui";

function DropzoneExample() {
  const [files, setFiles] = useState<string[]>([]);

  const handleDrop = (fileList: FileList) => {
    setFiles(Array.from(fileList).map((f) => f.name));
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <FileDropzone accept=".csv,.json,.pdf" onDrop={handleDrop} />
      {files.length > 0 && (
        <p className="text-xs font-mono text-muted-foreground">
          Ready: {files.join(", ")}
        </p>
      )}
    </div>
  );
}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md" role="radiogroup" aria-label="Workspace plan">
              <RadioCard
                name="plan"
                value="standard"
                title="Standard"
                description="$29/mo for up to 10 workspaces"
                checked={selectedPlan === "standard"}
                onChange={() => setSelectedPlan("standard")}
              />
              <RadioCard
                name="plan"
                value="team"
                title="Team"
                description="$99/mo with audit logs and SSO"
                checked={selectedPlan === "team"}
                onChange={() => setSelectedPlan("team")}
              />
            </div>
          ),
          code: `import { useState } from "react";
import { RadioCard } from "nexoreui";

export default function PlanSelectorDemo() {
  const [plan, setPlan] = useState("standard");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md" role="radiogroup" aria-label="Workspace plan">
      <RadioCard
        name="plan"
        value="standard"
        title="Standard"
        description="$29/mo for up to 10 workspaces"
        checked={plan === "standard"}
        onChange={() => setPlan("standard")}
      />
      <RadioCard
        name="plan"
        value="team"
        title="Team"
        description="$99/mo with audit logs and SSO"
        checked={plan === "team"}
        onChange={() => setPlan("team")}
      />
    </div>
  );
}`,
          propsData: [
            { name: "title", type: "string", defaultValue: "-", description: "Primary label rendered inside the radio card.", required: true },
            { name: "description", type: "string", defaultValue: "-", description: "Secondary helper text under the title.", required: false },
            { name: "checked", type: "boolean", defaultValue: "false", description: "Controlled selection state of the underlying radio input.", required: false },
            { name: "onChange", type: "(e: React.ChangeEvent<HTMLInputElement>) => void", defaultValue: "-", description: "Change handler called when the radio input is selected.", required: false },
            { name: "name", type: "string", defaultValue: "-", description: "Group name tying radio cards into a mutually exclusive set.", required: false },
            { name: "value", type: "string", defaultValue: "-", description: "Form submission value for this radio option.", required: false },
          ],
        },
        {
          name: "Numeric Quantity Stepper",
          description: "Touch-friendly number increment and decrement control with boundary locks.",
          component: (
            <div className="p-4 flex items-center gap-3">
              <NumberStepper
                value={stepperVal}
                min={1}
                max={10}
                onChange={setStepperVal}
              />
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                Seats: {stepperVal}
              </span>
            </div>
          ),
          code: `import { useState } from "react";
import { NumberStepper } from "nexoreui";

export default function SeatQuantityDemo() {
  const [seats, setSeats] = useState(3);

  return (
    <div className="flex items-center gap-3">
      <NumberStepper
        value={seats}
        min={1}
        max={10}
        onChange={setSeats}
      />
      <span className="text-xs font-mono text-muted-foreground tabular-nums">
        Seats: {seats}
      </span>
    </div>
  );
}`,
          propsData: [
            { name: "value", type: "number", defaultValue: "0", description: "Current numeric count.", required: false },
            { name: "min", type: "number", defaultValue: "0", description: "Lower bound clamping decrement clicks.", required: false },
            { name: "max", type: "number", defaultValue: "100", description: "Upper bound clamping increment clicks.", required: false },
            { name: "onChange", type: "(val: number) => void", defaultValue: "-", description: "Callback fired when value increments or decrements.", required: false },
          ],
        },
        {
          name: "Interactive Drag-and-Drop Dropzone",
          description: "Visual upload area supporting drag over states, file lists, removal, and keyboard activation.",
          component: <DropzoneExample />,
          code: `import { useState } from "react";
import { FileDropzone } from "nexoreui";

export default function DocumentDropzoneDemo() {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleDrop = (fileList: FileList) => {
    setFileNames(Array.from(fileList).map((file) => file.name));
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <FileDropzone
        accept=".csv,.json,.pdf"
        multiple
        onDrop={handleDrop}
      />
      {fileNames.length > 0 && (
        <p className="text-xs font-mono text-muted-foreground">
          Ready: {fileNames.join(", ")}
        </p>
      )}
    </div>
  );
}`,
          propsData: [
            { name: "onDrop", type: "(files: FileList) => void", defaultValue: "-", description: "Callback fired with dropped or picked FileList.", required: false },
            { name: "accept", type: "string", defaultValue: "-", description: "Comma-separated file extensions or MIME filters.", required: false },
            { name: "multiple", type: "boolean", defaultValue: "true", description: "Allows selecting multiple files at once.", required: false },
          ],
        },
        {
          name: "Star Rating Input",
          description: "Interactive star rating widget with keyboard focus rings and accessible labels.",
          component: (
            <div className="p-4 flex items-center gap-3">
              <RatingStars value={rating} max={5} onChange={setRating} />
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                {rating} / 5
              </span>
            </div>
          ),
          code: `import { useState } from "react";
import { RatingStars } from "nexoreui";

export default function StarRatingInputDemo() {
  const [rating, setRating] = useState(4);

  return (
    <div className="flex items-center gap-3">
      <RatingStars value={rating} max={5} onChange={setRating} />
      <span className="text-xs font-mono text-muted-foreground tabular-nums">
        {rating} / 5
      </span>
    </div>
  );
}`,
          propsData: [
            { name: "value", type: "number", defaultValue: "0", description: "Current selected rating value.", required: false },
            { name: "max", type: "number", defaultValue: "5", description: "Total number of star controls.", required: false },
            { name: "onChange", type: "(rate: number) => void", defaultValue: "-", description: "Callback fired when a star is clicked.", required: false },
          ],
        }
      ]}
      a11yNotes={[
        "Radio Groups: Radio cards wrap native radio inputs with screen-reader visibility and keyboard focus rings.",
        "Stepper Controls: Increment and decrement buttons include explicit aria-label tags and disabled boundary states."
      ]}
    />
  );
}
