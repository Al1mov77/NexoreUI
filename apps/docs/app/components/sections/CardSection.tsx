"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "nexoreui";

const variants = [
  {
    name: "Default Compound Card",
    component: (
      <Card className="p-0 w-full max-w-sm">
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Simple content wrapper built with compound components.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This is the main body of the card.</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Action</Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "nexoreui"

<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Default Card</CardTitle>
    <CardDescription>Simple content wrapper built with compound components.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm">This is the main body of the card.</p>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Action</Button>
  </CardFooter>
</Card>`
  }
];

const cardPropsData = [
  { name: "variant", type: '"default" | "glass" | "gradient" | "glow"', defaultValue: '"default"', description: "Visual style profile of the card.", required: false },
  { name: "hover", type: '"lift" | "glow" | "none"', defaultValue: '"lift"', description: "Interactive hover feedback animation style.", required: false },
  { name: "animate", type: "boolean", defaultValue: "true", description: "Enables spring/scale animations for hover states.", required: false }
];

const CardPlaygroundWrapper = ({
  variant,
  hover,
  animate,
  title,
  description,
  image,
  children
}: any) => (
  <Card variant={variant} hover={hover} animate={animate} className="w-full max-w-sm">
    {image && (
      <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
        <img src={image} alt="Card preview" className="object-cover w-full h-full" />
      </div>
    )}
    {(title || description) && (
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    )}
    {children && <CardContent>{children}</CardContent>}
  </Card>
);

export function CardSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="cards" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cards</h2>
        <p className="text-muted-foreground mt-1">
          Versatile layouts with hover animations, glows, and custom glass overrides built on a flexible compound pattern.
        </p>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use which variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["default", "Standard information blocks, features grids, item detail summaries"],
            ["glass", "Sleek dark modes with rich imagery backdrops to frosted glass panels"],
            ["gradient", "Highlighting special items — pricing recommendations, premium tiers"],
            ["glow", "Calling direct interactive interest to promo tiles or dashboard headers"],
            ["hover: lift", "Highly clickable cards — linking articles, store products, profiles"],
            ["hover: glow", "Highlighting specific widgets inside dense dashboards"],
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
          component={CardPlaygroundWrapper}
          componentName="Card"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "glass", "gradient", "glow", "spotlight", "tilt"],
              defaultValue: "default",
              description: "Visual style of the card"
            },
            {
              name: "hover",
              type: "select",
              options: ["lift", "glow", "none"],
              defaultValue: "lift",
              description: "Hover animation style"
            },
            {
              name: "animate",
              type: "boolean",
              defaultValue: true,
              description: "Whether to enable hover scale/lift animation"
            },
            {
              name: "title",
              type: "text",
              defaultValue: "Card Title",
              description: "Title of the card (Mapped to <CardTitle>)"
            },
            {
              name: "description",
              type: "text",
              defaultValue: "This is a description of the card.",
              description: "Description of the card (Mapped to <CardDescription>)"
            },
            {
              name: "image",
              type: "text",
              defaultValue: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400",
              description: "Optional top image URL (Mapped inside Card)"
            },
            {
              name: "children",
              type: "text",
              defaultValue: "Card Content goes here.",
              description: "Card body children text (Mapped to <CardContent>)"
            }
          ]}
        />
      </div>

      {/* Main variants */}
      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight font-mono text-zinc-300">Showcase & Examples</h3>
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-background/50 p-6">
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
      <PropsTable propsData={cardPropsData} />
    </section>
  )
}
