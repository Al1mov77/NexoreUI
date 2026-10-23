"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  PricingToggle,
  FeatureShowcase,
  ComparisonTableMock,
  WaitlistForm,
} from "nexoreui";

export function ProMarketingSection() {
  return (
    <SuiteSectionLayout
      id="pro-marketing"
      title="Pro Marketing"
      badge="Conversion & Launch"
      description="Conversion-focused marketing primitives: feature showcases, billing frequency toggles, tiered comparison tables, and early access waitlist forms."
      cliCommand="npx nexoreui add pro-marketing"
      items={[
        {
          name: "Annual & Monthly Pricing Toggle",
          description: "Interactive billing period selector featuring discount badges for annual subscriptions.",
          component: (
            <div className="p-4">
              <PricingToggle />
            </div>
          ),
          code: `import { PricingToggle } from "nexoreui"

<PricingToggle />`
        },
        {
          name: "Feature Spotlight Card",
          description: "High-impact feature presentation pairing explanatory copy with media/graphic slots.",
          component: (
            <div className="w-full max-w-lg">
              <FeatureShowcase />
            </div>
          ),
          code: `import { FeatureShowcase } from "nexoreui"

<FeatureShowcase />`
        },
        {
          name: "Feature Matrix & Comparison Table",
          description: "Side-by-side capability grid comparing standard versus pro tiers with checkmark indicators.",
          component: (
            <div className="w-full max-w-md">
              <ComparisonTableMock />
            </div>
          ),
          code: `import { ComparisonTableMock } from "nexoreui"

<ComparisonTableMock />`
        },
        {
          name: "Product Waitlist Card",
          description: "Early access landing page lead capture block with input field and submit action.",
          component: (
            <div className="w-full max-w-sm">
              <WaitlistForm />
            </div>
          ),
          code: `import { WaitlistForm } from "nexoreui"

<WaitlistForm />`
        }
      ]}
      a11yNotes={[
        "Form Semantics: Lead forms contain accessible button labels and email input validation attributes.",
        "Toggle States: Pricing switch reflects aria-checked state for assistive technologies."
      ]}
    />
  );
}
