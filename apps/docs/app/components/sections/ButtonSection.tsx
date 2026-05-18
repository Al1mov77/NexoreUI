"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Button, NeonButton, ThreeDButton, RippleButton, CyberpunkButton, MagneticButton, ShimmerButton, BorderBeamButton, LoadingButton, DestructiveGlowButton } from "nexoreui";

const buttonVariants = [
  {
    name: "Default Button",
    component: <Button variant="default">Default</Button>,
    code: `import { Button } from "nexoreui"\n\n<Button variant="default">Default</Button>`
  },
  {
    name: "Neon Button",
    component: <NeonButton>Neon Glow</NeonButton>,
    code: `import { NeonButton } from "nexoreui"\n\n<NeonButton>Neon Glow</NeonButton>`
  },
  {
    name: "3D Button",
    component: <ThreeDButton>Press Me</ThreeDButton>,
    code: `import { ThreeDButton } from "nexoreui"\n\n<ThreeDButton>Press Me</ThreeDButton>`
  },
  {
    name: "Ripple Button",
    component: <RippleButton>Click For Ripple</RippleButton>,
    code: `import { RippleButton } from "nexoreui"\n\n<RippleButton>Click For Ripple</RippleButton>`
  },
  {
    name: "Cyberpunk Button",
    component: <CyberpunkButton>Hack The Planet</CyberpunkButton>,
    code: `import { CyberpunkButton } from "nexoreui"\n\n<CyberpunkButton>Hack The Planet</CyberpunkButton>`
  },
  {
    name: "Magnetic Button",
    component: <MagneticButton>Hover Me</MagneticButton>,
    code: `import { MagneticButton } from "nexoreui"\n\n<MagneticButton>Hover Me</MagneticButton>`
  },
  {
    name: "Shimmer Button",
    component: <ShimmerButton>Shining</ShimmerButton>,
    code: `import { ShimmerButton } from "nexoreui"\n\n<ShimmerButton>Shining</ShimmerButton>`
  },
  {
    name: "Border Beam Button",
    component: <BorderBeamButton>Animated Border</BorderBeamButton>,
    code: `import { BorderBeamButton } from "nexoreui"\n\n<BorderBeamButton>Animated Border</BorderBeamButton>`
  },
  {
    name: "Loading Button",
    component: <LoadingButton isLoading>Processing...</LoadingButton>,
    code: `import { LoadingButton } from "nexoreui"\n\n<LoadingButton isLoading>Processing...</LoadingButton>`
  },
  {
    name: "Destructive Glow Button",
    component: <DestructiveGlowButton>Delete Item</DestructiveGlowButton>,
    code: `import { DestructiveGlowButton } from "nexoreui"\n\n<DestructiveGlowButton>Delete Item</DestructiveGlowButton>`
  }
];

export function ButtonSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(buttonVariants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = buttonVariants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="buttons" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Buttons</h2>
          <p className="text-muted-foreground">Interactive button components with various styles.</p>
        </div>
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6 glass">
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
    </section>
  )
}
