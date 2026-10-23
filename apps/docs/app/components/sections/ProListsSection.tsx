"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  ContactList,
  NotificationList,
  TimelineVertical,
  StepList,
} from "nexoreui";

export function ProListsSection() {
  return (
    <SuiteSectionLayout
      id="pro-lists"
      title="Pro Lists"
      badge="Data Presentation"
      description="Structured vertical listing components: team directories, interactive notification feeds, timeline chronologies, and linear process steps."
      cliCommand="npx nexoreui add pro-lists"
      items={[
        {
          name: "Team & Contact Directory",
          description: "List of team members with status indicators, email metadata, and quick action buttons.",
          component: (
            <div className="w-full max-w-md">
              <ContactList />
            </div>
          ),
          code: `import { ContactList } from "nexoreui"

<ContactList />`
        },
        {
          name: "Notification Feed List",
          description: "Event notification stream with read/unread visual styling and relative timestamps.",
          component: (
            <div className="w-full max-w-md">
              <NotificationList />
            </div>
          ),
          code: `import { NotificationList } from "nexoreui"

<NotificationList />`
        },
        {
          name: "Vertical History Timeline",
          description: "Connected node timeline for project milestones, changelogs, and audit histories.",
          component: (
            <div className="w-full max-w-sm">
              <TimelineVertical />
            </div>
          ),
          code: `import { TimelineVertical } from "nexoreui"

<TimelineVertical />`
        },
        {
          name: "Sequential Step Process",
          description: "Numbered onboarding or deployment flow with completed checkmarks and current active indicators.",
          component: (
            <div className="w-full max-w-md">
              <StepList />
            </div>
          ),
          code: `import { StepList } from "nexoreui"

<StepList />`
        }
      ]}
      a11yNotes={[
        "List Semantics: Utilizes ordered and unordered HTML list structures (<ul>, <ol>, <li>) for automated assistive item counting.",
        "Timestamps: Relative dates include semantic <time> elements with ISO dateTime attributes."
      ]}
    />
  );
}
