"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  LoginFormPro,
  PaymentFormPro,
  ProfileSettingsForm,
  SubscriptionForm,
} from "nexoreui";

export function ProFormsSection() {
  return (
    <SuiteSectionLayout
      id="pro-forms"
      title="Pro Forms"
      badge="Form Architectures"
      description="Production-grade form templates with integrated field validation, password visibility toggles, credit card formatting, and responsive submit actions."
      cliCommand="npx nexoreui add pro-forms"
      items={[
        {
          name: "Authentication & Login Form",
          description: "Clean sign-in card with email field, password reveal action, remember-me checkbox, and OAuth triggers.",
          component: (
            <div className="w-full max-w-sm">
              <LoginFormPro />
            </div>
          ),
          code: `import { LoginFormPro } from "nexoreui"

<LoginFormPro />`
        },
        {
          name: "Payment & Checkout Form",
          description: "Credit card input form with expiry date, CVC protection field, and encrypted payment badge.",
          component: (
            <div className="w-full max-w-sm">
              <PaymentFormPro />
            </div>
          ),
          code: `import { PaymentFormPro } from "nexoreui"

<PaymentFormPro />`
        },
        {
          name: "Profile Settings Form",
          description: "Account settings form with avatar preview upload, username, bio, and time zone selectors.",
          component: (
            <div className="w-full max-w-md">
              <ProfileSettingsForm />
            </div>
          ),
          code: `import { ProfileSettingsForm } from "nexoreui"

<ProfileSettingsForm />`
        },
        {
          name: "Newsletter & Subscription Bar",
          description: "Single-line subscription form with email validation and inline submission trigger.",
          component: (
            <div className="w-full max-w-md">
              <SubscriptionForm />
            </div>
          ),
          code: `import { SubscriptionForm } from "nexoreui"

<SubscriptionForm />`
        }
      ]}
      a11yNotes={[
        "Form Controls: Inputs are paired with explicit label elements and unique htmlFor associations.",
        "Validation Errors: Native validation attributes (type='email', required) ensure proper mobile keyboard modes."
      ]}
    />
  );
}
