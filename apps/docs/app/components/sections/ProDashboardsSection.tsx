"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  StatWidgetCard,
  ProgressWidget,
  QuickActionsWidget,
  StorageWidget,
  ServerStatusWidget,
  TaskChecklist,
} from "nexoreui";

export function ProDashboardsSection() {
  return (
    <SuiteSectionLayout
      id="pro-dashboards"
      title="Pro Dashboards"
      badge="Analytics & Monitoring"
      description="Essential telemetry cards and management widgets for modern administrative dashboards and SaaS monitoring consoles."
      cliCommand="npx nexoreui add pro-dashboards"
      items={[
        {
          name: "Metric & Revenue Stat Card",
          description: "Summary statistic block displaying numeric totals, directional growth percentages, and contextual periods.",
          component: (
            <div className="w-full max-w-sm">
              <StatWidgetCard
                title="Monthly Recurring Revenue"
                value="$58,420.00"
                trend="+18.4%"
              />
            </div>
          ),
          code: `import { StatWidgetCard } from "nexoreui"

<StatWidgetCard
  title="Monthly Recurring Revenue"
  value="$58,420.00"
  trend="+18.4%"
/>`,
          propsData: [
            { name: "title", type: "string", defaultValue: "'Total Revenue'", description: "Label text for the statistic.", required: false },
            { name: "value", type: "string", defaultValue: "—", description: "Primary numeric value display.", required: true },
            { name: "trend", type: "string", defaultValue: "—", description: "Percentage growth or decline indicator.", required: false }
          ]
        },
        {
          name: "Server Status Telemetry",
          description: "Infrastructure health monitor showing region availability, latency telemetry, and operational status.",
          component: (
            <div className="w-full max-w-sm">
              <ServerStatusWidget />
            </div>
          ),
          code: `import { ServerStatusWidget } from "nexoreui"

<ServerStatusWidget />`
        },
        {
          name: "Storage Quota Meter",
          description: "Storage allocation gauge with percentage progress bar and capacity counters.",
          component: (
            <div className="w-full max-w-sm">
              <StorageWidget />
            </div>
          ),
          code: `import { StorageWidget } from "nexoreui"

<StorageWidget />`
        },
        {
          name: "Goal & Quota Progress Widget",
          description: "Milestone completion meter showing current progress relative to monthly targets.",
          component: (
            <div className="w-full max-w-sm">
              <ProgressWidget />
            </div>
          ),
          code: `import { ProgressWidget } from "nexoreui"

<ProgressWidget />`
        },
        {
          name: "Interactive Task Checklist",
          description: "Actionable todo checklist with strike-through states and form checkboxes.",
          component: (
            <div className="w-full max-w-sm">
              <TaskChecklist />
            </div>
          ),
          code: `import { TaskChecklist } from "nexoreui"

<TaskChecklist />`
        }
      ]}
      a11yNotes={[
        "Tabular Numbers: Numeric values use font-mono tabular-nums for aligned visual comparison.",
        "Color Contrast: Status badges maintain WCAG AAA compliance across dark and light modes."
      ]}
    />
  );
}
