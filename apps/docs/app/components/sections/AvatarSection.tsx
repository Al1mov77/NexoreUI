"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { Avatar, AvatarFallback, AvatarImage, StackAvatar, DottedAvatar, ShadowAvatar, PolymorphAvatar, GlassAvatar, AnimatedBorderAvatar, InitialsGradientAvatar, SquareAvatar, TooltipAvatar, PulseAvatar, Button } from "nexoreui";

const AvatarPlayground = (props: any) => {
  const { src, fallback, ...rest } = props;
  return (
    <Avatar {...rest}>
      <AvatarImage src={src || ""} />
      <AvatarFallback>{fallback || "NX"}</AvatarFallback>
    </Avatar>
  );
};

const variants = [
  {
    name: "Default Avatar",
    component: <Avatar><AvatarImage src="https://github.com/vercel.png" /><AvatarFallback>CN</AvatarFallback></Avatar>,
    code: `import { Avatar, AvatarImage, AvatarFallback } from "nexoreui"\n\n<Avatar>\n  <AvatarImage src="https://github.com/vercel.png" />\n  <AvatarFallback>CN</AvatarFallback>\n</Avatar>`
  },
  {
    name: "Stack Avatar",
    component: <StackAvatar urls={["https://github.com/vercel.png", "https://github.com/vercel.png", "https://github.com/vercel.png"]} max={3} />,
    code: `import { StackAvatar } from "nexoreui"\n\n<StackAvatar \n  urls={["url1", "url2", "url3"]} \n  max={3} \n/>`
  },
  {
    name: "Dotted Avatar",
    component: <DottedAvatar src="https://github.com/vercel.png" status="online" />,
    code: `import { DottedAvatar } from "nexoreui"\n\n<DottedAvatar \n  src="https://github.com/vercel.png" \n  status="online" \n/>`
  },
  {
    name: "Shadow Avatar",
    component: <ShadowAvatar src="https://github.com/vercel.png" />,
    code: `import { ShadowAvatar } from "nexoreui"\n\n<ShadowAvatar src="https://github.com/vercel.png" />`
  },
  {
    name: "Polymorph Avatar",
    component: <PolymorphAvatar src="https://github.com/vercel.png" shape="hexagon" />,
    code: `import { PolymorphAvatar } from "nexoreui"\n\n<PolymorphAvatar \n  src="https://github.com/vercel.png" \n  shape="hexagon" \n/>`
  },
  {
    name: "Glass Avatar",
    component: <GlassAvatar src="https://github.com/vercel.png" />,
    code: `import { GlassAvatar } from "nexoreui"\n\n<GlassAvatar src="https://github.com/vercel.png" />`
  },
  {
    name: "Animated Border Avatar",
    component: <AnimatedBorderAvatar src="https://github.com/vercel.png" />,
    code: `import { AnimatedBorderAvatar } from "nexoreui"\n\n<AnimatedBorderAvatar src="https://github.com/vercel.png" />`
  },
  {
    name: "Initials Gradient Avatar",
    component: <InitialsGradientAvatar initials="UN" />,
    code: `import { InitialsGradientAvatar } from "nexoreui"\n\n<InitialsGradientAvatar initials="UN" />`
  },
  {
    name: "Tooltip Avatar",
    component: <TooltipAvatar src="https://github.com/vercel.png" name="vercel" />,
    code: `import { TooltipAvatar } from "nexoreui"\n\n<TooltipAvatar \n  src="https://github.com/vercel.png" \n  name="vercel" \n/>`
  },
  {
    name: "Pulse Avatar",
    component: <PulseAvatar src="https://github.com/vercel.png" status="busy" />,
    code: `import { PulseAvatar } from "nexoreui"\n\n<PulseAvatar \n  src="https://github.com/vercel.png" \n  status="busy" \n/>`
  }
];

const avatarPropsData = [
  { name: "src", type: "string", defaultValue: "—", description: "The image source URL for the avatar.", required: false },
  { name: "fallback", type: "string", defaultValue: "—", description: "Initials to display as a fallback if the image fails to load.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
];

export function AvatarSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="avatars" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Avatars</h2>
          <p className="text-muted-foreground mt-1">User profile image representations with status dots and fallbacks.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["default avatar", "Profile settings, headers, user menus, comment authors"],
            ["stack avatar", "Colleague lists, project members list, active chat members groups"],
            ["dotted / pulse avatar", "Indicating active online, away, or busy status in messaging apps"],
            ["initials fallback", "Default render state when a user hasn't uploaded a photo or image load fails"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={AvatarPlayground}
          componentName="Avatar"
          importFrom="nexoreui"
          controls={[
            {
              name: "src",
              type: "text",
              defaultValue: "https://github.com/vercel.png",
              description: "URL of the avatar image"
            },
            {
              name: "fallback",
              type: "text",
              defaultValue: "NX",
              description: "Fallback initials when image fails to load"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}

      {/* Props Reference Table */}
      <PropsTable propsData={avatarPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Image Fallbacks:</strong> If the image fails to load or the source URL is invalid, the component automatically hides the image and displays the initials fallback, ensuring a consistent visual appearance.</li>
          <li><strong>ARIA labels:</strong> Avatars should include descriptive alt text or labels (e.g. `aria-label="User Profile"`) if they function as interactive links or icons.</li>
        </ul>
      </div>
    </section>
  );
}
