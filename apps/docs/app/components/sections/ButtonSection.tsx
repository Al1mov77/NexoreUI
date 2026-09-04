"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { A11yHeader } from "../A11yNotice";
import { Button } from "nexoreui";

// ━━━ Main variants — what developers should actually use ━━━
const mainVariants = [
  {
    name: "Default",
    use: "Primary actions: Submit, Save, Continue",
    component: <Button variant="default">Save Changes</Button>,
    code: `import { Button } from "nexoreui"\n\n<Button variant="default">Save Changes</Button>`
  },
  {
    name: "Secondary",
    use: "Alternative actions: Cancel, Back, Skip",
    component: <Button variant="secondary">Cancel</Button>,
    code: `import { Button } from "nexoreui"\n\n<Button variant="secondary">Cancel</Button>`
  },
  {
    name: "Destructive",
    use: "Irreversible actions: Delete, Remove, Reset",
    component: <Button variant="destructive">Delete Account</Button>,
    code: `import { Button } from "nexoreui"\n\n<Button variant="destructive">Delete Account</Button>`
  },
  {
    name: "Outline",
    use: "Alternative CTAs, secondary options",
    component: <Button variant="outline">View Details</Button>,
    code: `import { Button } from "nexoreui"\n\n<Button variant="outline">View Details</Button>`
  },
  {
    name: "Ghost",
    use: "Quiet actions: Edit, View more, inline links",
    component: <Button variant="ghost">Edit Profile</Button>,
    code: `import { Button } from "nexoreui"\n\n<Button variant="ghost">Edit Profile</Button>`
  },
  {
    name: "Loading State",
    use: "Form submissions, async operations",
    component: <Button isLoading>Saving...</Button>,
    code: `import { Button } from "nexoreui"\n\n<Button isLoading>Saving...</Button>`
  },
  {
    name: "Neon / Glow",
    use: "Hero sections, landing pages, key CTAs",
    component: <Button variant="neon">Get Started Free</Button>,
    code: `import { Button } from "nexoreui"\n\n<Button variant="neon">Get Started Free</Button>`
  },
  {
    name: "Gradient",
    use: "Marketing pages, premium feature CTAs",
    component: <Button variant="gradient">Upgrade to Pro</Button>,
    code: `import { Button } from "nexoreui"\n\n<Button variant="gradient">Upgrade to Pro</Button>`
  },
  {
    name: "Glass",
    use: "Overlays on images/videos, frosted UI panels",
    component: <Button variant="glass">Learn More</Button>,
    code: `import { Button } from "nexoreui"\n\n<Button variant="glass">Learn More</Button>`
  },
  {
    name: "Interactive Hero Button",
    use: "State-aware micro-interactions from the landing page",
    component: (() => {
      const ButtonDemo = () => {
        const [clicks, setClicks] = useState(0);
        return (
          <button
            onClick={() => setClicks((c) => c + 1)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-[0_0_10px_rgba(var(--primary-rgb),0.25)] cursor-pointer"
          >
            Clicked {clicks} times
          </button>
        );
      };
      return <ButtonDemo />;
    })(),
    code: `import { useState } from "react";\n\nexport default function HeroButton() {\n  const [clicks, setClicks] = useState(0);\n  return (\n    <button\n      onClick={() => setClicks((c) => c + 1)}\n      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-[0_0_10px_rgba(var(--primary-rgb),0.25)] cursor-pointer"\n    >\n      Clicked {clicks} times\n    </button>\n  );\n}`
  },
];


const buttonPropsData = [
  { name: "variant", type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "premium" | "neon" | "glass" | "shimmer" | "gradient" | "glow"', defaultValue: '"default"', description: "Visual style variant of the button.", required: false },
  { name: "size", type: '"default" | "sm" | "lg" | "icon" | "iconSquare"', defaultValue: '"default"', description: "Size dimensions of the button.", required: false },
  { name: "animate", type: "boolean", defaultValue: "true", description: "Enables hover scale and press animations.", required: false },
  { name: "shimmer", type: "boolean", defaultValue: "false", description: "Renders a sliding light shimmer beam animation.", required: false },
  { name: "glow", type: "boolean", defaultValue: "false", description: "Renders a background neon shadow glow matching the theme color.", required: false },
  { name: "isLoading", type: "boolean", defaultValue: "false", description: "Displays a loading spinner and disables user interaction.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

export function ButtonSection() {
  return (
    <section id="buttons" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Button</h2>
        <p className="text-muted-foreground mt-1">
          Interactive button components with multiple variants for every use case.
        </p>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use which variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["default", "Primary actions — Save, Submit, Continue"],
            ["secondary", "Alternative actions — Cancel, Back, Skip"],
            ["destructive", "Irreversible actions — Delete, Remove"],
            ["outline", "Alternative CTAs, secondary navigation"],
            ["ghost", "Quiet in-context actions — Edit, View more"],
            ["neon / glow", "Hero sections, marketing CTAs"],
            ["gradient", "Premium features, upgrade prompts"],
            ["glass", "On top of images, video players, overlays"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={Button}
          componentName="Button"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "secondary", "destructive", "outline", "ghost", "link", "premium", "neon", "glass", "shimmer", "gradient", "glow"],
              defaultValue: "default",
              description: "Visual style of the button"
            },
            {
              name: "size",
              type: "select",
              options: ["default", "sm", "lg", "icon"],
              defaultValue: "default",
              description: "Size of the button"
            },
            {
              name: "animate",
              type: "boolean",
              defaultValue: true,
              description: "Enable hover/tap motion animation"
            },
            {
              name: "shimmer",
              type: "boolean",
              defaultValue: false,
              description: "Enable shimmer light effect"
            },
            {
              name: "glow",
              type: "boolean",
              defaultValue: false,
              description: "Enable neon glow effect"
            },
            {
              name: "isLoading",
              type: "boolean",
              defaultValue: false,
              description: "Show loading spinner"
            },
            {
              name: "children",
              type: "text",
              defaultValue: "Click Me",
              description: "Button label text"
            }
          ]}
        />
      </div>

      {/* Main variants */}
      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight">Variants</h3>
        {mainVariants.map((item, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-baseline gap-3">
              <h4 className="text-base font-medium">{item.name}</h4>
              <span className="text-xs text-muted-foreground">{item.use}</span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[130px] items-center justify-center rounded-xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>


      {/* Props Reference Table */}
      <PropsTable propsData={buttonPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Navigation:</strong> Fully focusable using <kbd className="bg-muted px-1 rounded text-[10px]">Tab</kbd>, and triggers actions on <kbd className="bg-muted px-1 rounded text-[10px]">Enter</kbd> or <kbd className="bg-muted px-1 rounded text-[10px]">Space</kbd>.</li>
          <li><strong>Loading State:</strong> When <code className="text-primary font-mono text-[10px]">isLoading</code> is set, the button receives <code className="text-primary font-mono text-[10px]">aria-busy="true"</code> and is disabled, notifying screen readers of loading progress.</li>
        </ul>
      </div>
    </section>
  );
}
