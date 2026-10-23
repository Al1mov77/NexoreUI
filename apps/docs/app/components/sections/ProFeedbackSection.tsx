"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  EmptyStatePro,
  PasswordStrengthMeter,
  UploadProgress,
  MultiStepProgress,
} from "nexoreui";

export function ProFeedbackSection() {
  return (
    <SuiteSectionLayout
      id="pro-feedback"
      title="Pro Feedback"
      badge="Feedback & Status"
      description="Contextual user feedback patterns: empty project states, dynamic password security meters, multi-step progress rails, and file transfer indicators."
      cliCommand="npx nexoreui add pro-feedback"
      items={[
        {
          name: "Empty State Canvas",
          description: "Dashed workspace placeholder with guidance copy and primary creation call to action.",
          component: (
            <div className="w-full max-w-md">
              <EmptyStatePro />
            </div>
          ),
          code: `import { EmptyStatePro } from "nexoreui"

<EmptyStatePro />`
        },
        {
          name: "Reactive Password Strength Meter",
          description: "Real-time credential complexity meter with color-coded multi-segment indicators.",
          component: (
            <div className="w-full max-w-sm">
              <PasswordStrengthMeter score={3} />
            </div>
          ),
          code: `import { PasswordStrengthMeter } from "nexoreui"

<PasswordStrengthMeter score={3} />`,
          propsData: [
            { name: "score", type: "number", defaultValue: "3", description: "Entropy rating from 0 (very weak) to 4 (strong).", required: false }
          ]
        },
        {
          name: "File Upload Progress Bar",
          description: "Compact file transfer progress tracker with thumbnail, percentage label, and cancellation trigger.",
          component: (
            <div className="w-full max-w-sm">
              <UploadProgress />
            </div>
          ),
          code: `import { UploadProgress } from "nexoreui"

<UploadProgress />`
        },
        {
          name: "Multi-Step Process Indicator",
          description: "Sequential flow progress meter indicating completed, active, and upcoming steps.",
          component: (
            <div className="w-full max-w-sm p-4">
              <MultiStepProgress />
            </div>
          ),
          code: `import { MultiStepProgress } from "nexoreui"

<MultiStepProgress />`
        }
      ]}
      a11yNotes={[
        "Status Regions: Progress meters output proper aria-valuenow and aria-valuemax attributes.",
        "Color Independence: Strength indicators combine text descriptors (Weak, Good, Strong) with visual color fills."
      ]}
    />
  );
}
