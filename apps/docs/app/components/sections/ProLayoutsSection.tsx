"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  SidebarLayout,
  DashboardGridLayout,
  AuthenticationLayout,
} from "nexoreui";

export function ProLayoutsSection() {
  return (
    <SuiteSectionLayout
      id="pro-layouts"
      title="Pro Layouts"
      badge="Application Shells"
      description="Architectural application layout patterns: responsive sidebar scaffolds, dashboard metric grids, and centered authentication views."
      cliCommand="npx nexoreui add pro-layouts"
      items={[
        {
          name: "Application Sidebar Scaffold",
          description: "Full application shell featuring collapsible navigation rail, top header bar, and content viewport.",
          component: (
            <div className="w-full">
              <SidebarLayout />
            </div>
          ),
          code: `import { SidebarLayout } from "nexoreui"

<SidebarLayout />`
        },
        {
          name: "Dashboard Grid Framework",
          description: "Responsive 12-column telemetry grid featuring stat card slots and wide chart placeholders.",
          component: (
            <div className="w-full">
              <DashboardGridLayout />
            </div>
          ),
          code: `import { DashboardGridLayout } from "nexoreui"

<DashboardGridLayout />`
        },
        {
          name: "Centered Authentication Shell",
          description: "Distraction-free card layout optimized for sign-in, account creation, and password reset screens.",
          component: (
            <div className="w-full">
              <AuthenticationLayout />
            </div>
          ),
          code: `import { AuthenticationLayout } from "nexoreui"

<AuthenticationLayout />`
        }
      ]}
      a11yNotes={[
        "Landmarks: Layout shells utilize semantic <aside>, <header>, and <main> landmarks for assistive technology navigation.",
        "Responsive Flow: Sidebars automatically collapse into mobile drawer states below 768px viewports."
      ]}
    />
  );
}
