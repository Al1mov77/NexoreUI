"use client";

import React from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { WhenToUse } from "../WhenToUse";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  StackAvatar,
  DottedAvatar,
  ShadowAvatar,
  PolymorphAvatar,
  SquareAvatar,
  SquircleAvatar,
  HexagonAvatar,
  TooltipAvatar,
  OutlineAvatar,
  InitialsAvatar,
} from "nexoreui";

interface AvatarPlaygroundProps {
  src?: string;
  fallback?: string;
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "default" | "gradient" | "glow" | "glass";
  status?: "online" | "offline" | "away" | "busy";
}

function AvatarPlayground({
  src = "/nexore-avatar.png",
  fallback = "MK",
  size = "lg",
  variant = "default",
  status = "online",
}: AvatarPlaygroundProps) {
  return (
    <Avatar size={size} variant={variant} status={status}>
      <AvatarImage src={src} alt="Member avatar" />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

const teamMembers = [
  { src: "/nexore-avatar.png", fallback: "MK", name: "Mina Kato" },
  { fallback: "TL", name: "Tomas Lind" },
  { fallback: "NO", name: "Nadia Okafor" },
  { fallback: "DR", name: "David Romero" },
  { fallback: "SR", name: "Sara Reyes" },
  { fallback: "AL", name: "Alex Lin" },
];

const variants = [
  {
    name: "Image & Automatic Fallback Recovery",
    description: "Seamlessly renders verified images or falls back to crisp monospaced initials when src is empty or fails to load.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Avatar size="lg">
          <AvatarImage src="/nexore-avatar.png" alt="Mina Kato" />
          <AvatarFallback>MK</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/missing-profile.png" alt="Tomas Lind" />
          <AvatarFallback>TL</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>NO</AvatarFallback>
        </Avatar>
      </div>
    ),
    code: `import { Avatar, AvatarImage, AvatarFallback } from "nexoreui";

export default function AvatarFallbackDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="lg">
        <AvatarImage src="/nexore-avatar.png" alt="Mina Kato" />
        <AvatarFallback>MK</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/missing-profile.png" alt="Tomas Lind" />
        <AvatarFallback>TL</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>NO</AvatarFallback>
      </Avatar>
    </div>
  );
}`,
  },
  {
    name: "Presence Status & Size Scale",
    description: "Four sizes paired with semantic availability indicators using accessible aria-labels.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Avatar size="sm" status="online">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar size="default" status="away">
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar size="lg" status="busy">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <Avatar size="xl" status="offline">
          <AvatarFallback>XL</AvatarFallback>
        </Avatar>
      </div>
    ),
    code: `import { Avatar, AvatarFallback } from "nexoreui";

export default function AvatarStatusScaleDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar size="sm" status="online"><AvatarFallback>SM</AvatarFallback></Avatar>
      <Avatar size="default" status="away"><AvatarFallback>MD</AvatarFallback></Avatar>
      <Avatar size="lg" status="busy"><AvatarFallback>LG</AvatarFallback></Avatar>
      <Avatar size="xl" status="offline"><AvatarFallback>XL</AvatarFallback></Avatar>
    </div>
  );
}`,
  },
  {
    name: "Interactive Collaborator Stack",
    description: "Overlapping member group that expands smoothly on hover with a tabular +N overflow counter.",
    component: (
      <div className="flex flex-col items-center gap-2">
        <StackAvatar avatars={teamMembers} max={4} size="default" />
        <span className="text-xs font-mono text-muted-foreground tabular-nums">
          6 workspace contributors
        </span>
      </div>
    ),
    code: `import { StackAvatar } from "nexoreui";

const teamMembers = [
  { src: "/nexore-avatar.png", fallback: "MK", name: "Mina Kato" },
  { fallback: "TL", name: "Tomas Lind" },
  { fallback: "NO", name: "Nadia Okafor" },
  { fallback: "DR", name: "David Romero" },
  { fallback: "SR", name: "Sara Reyes" },
  { fallback: "AL", name: "Alex Lin" },
];

export default function CollaboratorStackDemo() {
  return <StackAvatar avatars={teamMembers} max={4} size="default" />;
}`,
  },
  {
    name: "Architectural Geometry",
    description: "Square, squircle, polygon hexagon, and hover-morphing avatar frames.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <SquareAvatar src="/nexore-avatar.png" fallback="SQ" size="lg" />
        <SquircleAvatar fallback="SC" size="lg" />
        <HexagonAvatar fallback="HX" size="lg" />
        <PolymorphAvatar fallback="PM" shape="square" size="lg" />
      </div>
    ),
    code: `import { SquareAvatar, SquircleAvatar, HexagonAvatar, PolymorphAvatar } from "nexoreui";

export default function AvatarGeometryDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SquareAvatar src="/nexore-avatar.png" fallback="SQ" size="lg" />
      <SquircleAvatar fallback="SC" size="lg" />
      <HexagonAvatar fallback="HX" size="lg" />
      <PolymorphAvatar fallback="PM" shape="square" size="lg" />
    </div>
  );
}`,
  },
  {
    name: "Keyboard & Hover Name Tooltips",
    description: "Focusable avatars revealing member names and live status via pointer hover or Tab focus.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <TooltipAvatar
          src="/nexore-avatar.png"
          fallback="MK"
          name="Mina Kato (Admin)"
          status="online"
          size="lg"
        />
        <TooltipAvatar
          fallback="TL"
          name="Tomas Lind (Ops)"
          status="away"
          size="lg"
        />
        <TooltipAvatar
          fallback="NO"
          name="Nadia Okafor (Lead)"
          status="busy"
          size="lg"
        />
      </div>
    ),
    code: `import { TooltipAvatar } from "nexoreui";

export default function TooltipAvatarDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <TooltipAvatar
        src="/nexore-avatar.png"
        fallback="MK"
        name="Mina Kato (Admin)"
        status="online"
        size="lg"
      />
      <TooltipAvatar fallback="TL" name="Tomas Lind (Ops)" status="away" size="lg" />
      <TooltipAvatar fallback="NO" name="Nadia Okafor (Lead)" status="busy" size="lg" />
    </div>
  );
}`,
  },
  {
    name: "Surface Frame Variants",
    description: "Outline, dashed invite, elevated shadow, and pure initials frames built on semantic borders.",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <OutlineAvatar fallback="OL" size="lg" />
        <DottedAvatar fallback="DT" size="lg" />
        <ShadowAvatar src="/nexore-avatar.png" fallback="SH" size="lg" />
        <InitialsAvatar initials="NX" size="lg" />
      </div>
    ),
    code: `import { OutlineAvatar, DottedAvatar, ShadowAvatar, InitialsAvatar } from "nexoreui";

export default function AvatarFramesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <OutlineAvatar fallback="OL" size="lg" />
      <DottedAvatar fallback="DT" size="lg" />
      <ShadowAvatar src="/nexore-avatar.png" fallback="SH" size="lg" />
      <InitialsAvatar initials="NX" size="lg" />
    </div>
  );
}`,
  },
];

const avatarPropsData = [
  { name: "size", type: '"sm" | "default" | "lg" | "xl"', defaultValue: '"default"', description: "Diameter scale of the avatar container.", required: false },
  { name: "variant", type: '"default" | "gradient" | "glow" | "glass"', defaultValue: '"default"', description: "Border and ring treatment around the avatar.", required: false },
  { name: "status", type: '"online" | "offline" | "away" | "busy"', defaultValue: "-", description: "Semantic availability indicator badge anchored at bottom-right.", required: false },
  { name: "src", type: "string", defaultValue: "-", description: "Image path passed to AvatarImage (falls back to AvatarFallback on error).", required: false },
  { name: "fallback", type: "React.ReactNode", defaultValue: "-", description: "Initials or icon displayed inside AvatarFallback.", required: false },
  { name: "StackAvatar", type: "{ avatars, max, size }", defaultValue: "max = 4", description: "Interactive overlapping group with tabular +N overflow counter.", required: false },
];

export function AvatarSection() {
  return (
    <section id="avatars" className="space-y-10 scroll-mt-20">
      <WhenToUse
        title="When to use which avatar"
        items={[
          { label: "Avatar + AvatarFallback", description: "Account menus, profile headers, and activity items with automatic broken-image recovery." },
          { label: "status", description: "Real-time team rosters, support queues, and presence lists showing availability." },
          { label: "StackAvatar", description: "Collaborator counts on pull requests, documents, and shared project cards." },
          { label: "TooltipAvatar", description: "Compact collaborator rows where full names should appear on hover or keyboard focus." },
          { label: "Square / Squircle", description: "Organization workspaces, project icons, and service accounts distinct from people." },
        ]}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Interactive Playground</h2>
        <PropsEditor
          component={AvatarPlayground}
          componentName="Avatar"
          importFrom="nexoreui"
          controls={[
            {
              name: "size",
              type: "select",
              options: ["sm", "default", "lg", "xl"],
              defaultValue: "lg",
              description: "Diameter scale of the avatar",
            },
            {
              name: "variant",
              type: "select",
              options: ["default", "gradient", "glow", "glass"],
              defaultValue: "default",
              description: "Frame border and ring style",
            },
            {
              name: "status",
              type: "select",
              options: ["online", "away", "busy", "offline"],
              defaultValue: "online",
              description: "Presence status dot",
            },
            {
              name: "src",
              type: "text",
              defaultValue: "/nexore-avatar.png",
              description: "Image path or URL (clear to test fallback)",
            },
            {
              name: "fallback",
              type: "text",
              defaultValue: "MK",
              description: "Fallback initials when image is absent or fails",
            },
          ]}
        />
      </div>

      <div className="space-y-10">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Showcase & Examples</h2>
        {variants.map((item) => (
          <div key={item.name} className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div
                data-demo-preview
                className="flex min-h-[180px] items-center justify-center rounded-xl border border-border bg-background p-6"
              >
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      <PropsTable propsData={avatarPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Zero Broken Image Icons:</strong> <code className="text-primary font-mono text-[10px]">AvatarImage</code> tracks load state via context and cleanly suppresses broken <code className="text-primary font-mono text-[10px]">&lt;img&gt;</code> tags so initials stay legible.</li>
          <li><strong>Presence Semantics:</strong> Status indicators render <code className="text-primary font-mono text-[10px]">role="img"</code> and descriptive <code className="text-primary font-mono text-[10px]">aria-label</code> strings for screen readers.</li>
          <li><strong>Keyboard Tooltips:</strong> <code className="text-primary font-mono text-[10px]">TooltipAvatar</code> exposes <code className="text-primary font-mono text-[10px]">tabIndex={0}</code> and reveals labels on <code className="text-primary font-mono text-[10px]">focus-visible</code>.</li>
        </ul>
      </div>
    </section>
  );
}
