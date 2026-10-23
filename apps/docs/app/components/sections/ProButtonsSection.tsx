"use client";

import React, { useState } from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  MorphButton,
  SplitButton,
  CopyTextButton,
  ExpandButton,
  StatusButton,
  SegmentedButton,
  TextButton,
} from "nexoreui";
import { ArrowRight } from "lucide-react";

export function ProButtonsSection() {
  const [splitAction, setSplitAction] = useState("Merge Pull Request");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [segment, setSegment] = useState("Overview");

  const cycleStatus = () => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    }, 1500);
  };

  return (
    <SuiteSectionLayout
      id="pro-buttons"
      title="Pro Buttons"
      badge="Interaction Suite"
      description="Advanced interactive button components: spring morphing physics, split dropdowns, clipboard triggers, expanding icon buttons, and status-aware transitions."
      cliCommand="npx nexoreui add pro-buttons"
      items={[
        {
          name: "Morph Button",
          description: "Spring physics button that fluidly morphs its corner radius and scale on hover.",
          component: (
            <div className="p-4">
              <MorphButton>Hover to Morph</MorphButton>
            </div>
          ),
          code: `import { MorphButton } from "nexoreui"

<MorphButton>Hover to Morph</MorphButton>`
        },
        {
          name: "Split Action Button",
          description: "Dual-segment button pairing a primary trigger with secondary configuration actions.",
          component: (
            <div className="flex flex-col items-center gap-2">
              <SplitButton
                primary={splitAction}
                secondary="▾"
                onPrimary={() => {}}
                onSecondary={() => setSplitAction(s => s.includes("Merge") ? "Squash & Merge" : "Merge Pull Request")}
              />
              <span className="text-[10px] text-muted-foreground font-mono">Click chevron to switch mode</span>
            </div>
          ),
          code: `import { SplitButton } from "nexoreui"

<SplitButton
  primary="Merge Pull Request"
  secondary="▾"
  onPrimary={() => executeMerge()}
  onSecondary={() => toggleAction()}
/>`,
          propsData: [
            { name: "primary", type: "string", defaultValue: "—", description: "Label for primary action.", required: true },
            { name: "secondary", type: "string", defaultValue: "—", description: "Label for dropdown trigger segment.", required: true },
            { name: "onPrimary", type: "() => void", defaultValue: "—", description: "Callback triggered on primary click.", required: false },
            { name: "onSecondary", type: "() => void", defaultValue: "—", description: "Callback triggered on secondary click.", required: false }
          ]
        },
        {
          name: "Copy Text Button",
          description: "Dedicated clipboard action button providing visual confirmation feedback.",
          component: (
            <div className="p-4">
              <CopyTextButton text="git clone https://github.com/Al1mov77/NexoreUI.git" />
            </div>
          ),
          code: `import { CopyTextButton } from "nexoreui"

<CopyTextButton text="git clone https://github.com/Al1mov77/NexoreUI.git" />`
        },
        {
          name: "Expand Button",
          description: "Compact button that smoothly reveals an action icon on hover.",
          component: (
            <div className="p-4">
              <ExpandButton icon={<ArrowRight className="w-4 h-4" />}>
                Explore Suite
              </ExpandButton>
            </div>
          ),
          code: `import { ExpandButton } from "nexoreui"
import { ArrowRight } from "lucide-react"

<ExpandButton icon={<ArrowRight className="w-4 h-4" />}>
  Explore Suite
</ExpandButton>`
        },
        {
          name: "Status Button",
          description: "State-aware button transitioning between idle, loading, success, and error indicators.",
          component: (
            <div className="flex flex-col items-center gap-3 p-4">
              <StatusButton status={status} onClick={cycleStatus}>
                Deploy Production Build
              </StatusButton>
              <span className="text-[10px] text-muted-foreground font-mono">Click to test async state</span>
            </div>
          ),
          code: `import { StatusButton } from "nexoreui"

<StatusButton status={status} onClick={triggerAsync}>
  Deploy Production Build
</StatusButton>`,
          propsData: [
            { name: "status", type: "'idle' | 'loading' | 'success' | 'error'", defaultValue: "'idle'", description: "Current visual state of the button.", required: false }
          ]
        },
        {
          name: "Segmented Control Button",
          description: "Smooth sliding layout transition button group for view or mode toggling.",
          component: (
            <div className="p-4">
              <SegmentedButton
                options={["Overview", "Metrics", "Settings"]}
                value={segment}
                onChange={setSegment}
              />
            </div>
          ),
          code: `import { SegmentedButton } from "nexoreui"

<SegmentedButton
  options={["Overview", "Metrics", "Settings"]}
  value={selectedTab}
  onChange={setSelectedTab}
/>`
        },
        {
          name: "Text Button",
          description: "Minimal text button with a directional animated underline indicator.",
          component: (
            <div className="p-4">
              <TextButton>View full audit trail</TextButton>
            </div>
          ),
          code: `import { TextButton } from "nexoreui"

<TextButton>View full audit trail</TextButton>`
        }
      ]}
      a11yNotes={[
        "All interactive buttons include visible keyboard focus rings conforming to WCAG 2.1 AA.",
        "StatusButton announces state changes to screen readers and maintains disabled state while loading.",
        "SegmentedButton supports arrow key and tab navigation between options."
      ]}
    />
  );
}
