"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
import { A11yHeader } from "../A11yNotice"
import { WhenToUse } from "../WhenToUse"
import {
  Rating,
  RatingBreakdown,
  ReviewCard,
  Button,
  type RatingIconType,
  type RatingVariant,
  type RatingSize,
} from "nexoreui"

interface InteractiveRatingDemoProps {
  icon?: RatingIconType
  size?: RatingSize
  max?: number
  variant?: RatingVariant
  allowHalf?: boolean
  showScore?: boolean
}

function InteractiveRatingDemo({
  icon = "star",
  size = "md",
  max = 5,
  variant = "amber",
  allowHalf = false,
  showScore = true,
}: InteractiveRatingDemoProps) {
  const [val, setVal] = useState(4.5)
  return (
    <div className="flex flex-col items-center gap-2.5">
      <Rating
        value={val}
        onChange={setVal}
        icon={icon}
        size={size}
        max={max}
        variant={variant}
        allowHalf={allowHalf}
        showScore={showScore}
      />
      <span className="text-xs font-mono text-muted-foreground tabular-nums">
        Selected score: {val}
      </span>
    </div>
  )
}

function RatingPlayground(props: React.ComponentProps<typeof Rating>) {
  const [val, setVal] = useState(props.value ?? 4.5)
  return <Rating {...props} value={val} onChange={setVal} />
}

const examples = [
  {
    name: "Half-Star Precision Rating",
    component: (
      <InteractiveRatingDemo
        icon="star"
        variant="amber"
        allowHalf
        showScore
      />
    ),
    code: `import { useState } from "react";
import { Rating } from "nexoreui";

export default function HalfStarRatingDemo() {
  const [rating, setRating] = useState(4.5);

  return (
    <Rating
      value={rating}
      onChange={setRating}
      allowHalf
      showScore
      variant="amber"
    />
  );
}`
  },
  {
    name: "Review Rating Breakdown",
    component: (
      <div className="w-full flex justify-center">
        <RatingBreakdown
          rating={4.8}
          totalReviews={2849}
          distribution={{ 5: 78, 4: 15, 3: 4, 2: 2, 1: 1 }}
        />
      </div>
    ),
    code: `import { RatingBreakdown } from "nexoreui";

export default function RatingBreakdownDemo() {
  return (
    <RatingBreakdown
      rating={4.8}
      totalReviews={2849}
      distribution={{ 5: 78, 4: 15, 3: 4, 2: 2, 1: 1 }}
    />
  );
}`
  },
  {
    name: "Customer Review Card",
    component: (
      <div className="w-full flex justify-center">
        <ReviewCard
          author="Mina Kato"
          rating={4.5}
          date="Oct 14, 2026"
          title="Consistent keyboard navigation across forms"
          content="Integrated directly with our existing design tokens and worked cleanly across mobile breakpoints."
          verified
        />
      </div>
    ),
    code: `import { ReviewCard } from "nexoreui";

export default function ReviewCardDemo() {
  return (
    <ReviewCard
      author="Mina Kato"
      rating={4.5}
      date="Oct 14, 2026"
      title="Consistent keyboard navigation across forms"
      content="Integrated directly with our existing design tokens and worked cleanly across mobile breakpoints."
      verified
    />
  );
}`
  },
  {
    name: "Heart & Flame Reaction Variants",
    component: (
      <div className="flex flex-col items-center gap-4">
        <InteractiveRatingDemo icon="heart" variant="rose" max={5} size="md" allowHalf />
        <InteractiveRatingDemo icon="flame" variant="amber" max={5} size="md" showScore />
      </div>
    ),
    code: `import { useState } from "react";
import { Rating } from "nexoreui";

export default function CustomIconRatingDemo() {
  const [hearts, setHearts] = useState(4);
  const [streak, setStreak] = useState(3);

  return (
    <div className="flex flex-col gap-4">
      <Rating
        icon="heart"
        variant="rose"
        value={hearts}
        onChange={setHearts}
        allowHalf
      />
      <Rating
        icon="flame"
        variant="amber"
        value={streak}
        onChange={setStreak}
        showScore
      />
    </div>
  );
}`
  },
  {
    name: "Qualitative Hover Tooltips",
    component: (
      <div className="flex flex-col items-center gap-3">
        <Rating
          defaultValue={4}
          tooltips={["Poor", "Fair", "Good", "Very Good", "Excellent"]}
          showScore
          size="lg"
          variant="emerald"
        />
      </div>
    ),
    code: `import { Rating } from "nexoreui";

export default function TooltipRatingDemo() {
  return (
    <Rating
      defaultValue={4}
      tooltips={["Poor", "Fair", "Good", "Very Good", "Excellent"]}
      showScore
      size="lg"
      variant="emerald"
    />
  );
}`
  },
  {
    name: "Read-Only Aggregated Score",
    component: (
      <div className="flex flex-wrap items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border bg-card">
        <Rating value={4.7} readonly size="sm" allowHalf variant="amber" />
        <span className="text-xs font-semibold text-foreground tabular-nums">4.7 / 5.0</span>
        <span className="text-xs text-muted-foreground tabular-nums">(1,420 reviews)</span>
      </div>
    ),
    code: `import { Rating } from "nexoreui";

export default function ReadOnlyRatingDemo() {
  return (
    <div className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border bg-card">
      <Rating value={4.7} readonly size="sm" allowHalf variant="amber" />
      <span className="text-xs font-semibold tabular-nums">4.7 / 5.0</span>
      <span className="text-xs text-muted-foreground tabular-nums">(1,420 reviews)</span>
    </div>
  );
}`
  }
]

const ratingPropsData = [
  { name: "value", type: "number", defaultValue: "-", description: "Controlled active rating score count.", required: false },
  { name: "defaultValue", type: "number", defaultValue: "0", description: "Default rating value for uncontrolled usage.", required: false },
  { name: "max", type: "number", defaultValue: "5", description: "Maximum scoring slots count.", required: false },
  { name: "onChange", type: "(value: number) => void", defaultValue: "-", description: "Callback fired when a rating icon is selected.", required: false },
  { name: "variant", type: '"amber" | "primary" | "emerald" | "rose" | "cyan"', defaultValue: '"primary"', description: "Color token mapping for active rating icons.", required: false },
  { name: "icon", type: '"star" | "heart" | "thumb" | "flame" | "trophy" | "smile"', defaultValue: '"star"', description: "Selection symbol rendering variant.", required: false },
  { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Visual dimensions of the rating icons.", required: false },
  { name: "allowHalf", type: "boolean", defaultValue: "false", description: "Enables fractional half-point rating precision (0.5).", required: false },
  { name: "showScore", type: "boolean", defaultValue: "false", description: "Displays numeric score readout alongside icons.", required: false },
  { name: "tooltips", type: "string[]", defaultValue: "-", description: "Array of text labels shown on hover corresponding to each score.", required: false },
  { name: "readonly", type: "boolean", defaultValue: "false", description: "Disables pointer event hooks and transforms to display-only.", required: false },
  { name: "className", type: "string", defaultValue: "-", description: "Additional custom class names.", required: false },
]

export function RatingSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="rating" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Rating</h2>
        <p className="text-muted-foreground mt-1">
          Interactive rating indicator supporting custom symbols, half-step precision, breakdown distributions, and review cards.
        </p>
      </div>

      <WhenToUse
        items={[
          { label: "star rating", description: "Evaluating products, documentation pages, or feedback forms with whole or half-step scores." },
          { label: "heart / thumb", description: "Saving favorites or capturing lightweight sentiment signals." },
          { label: "review breakdown", description: "Summarizing historical rating distributions alongside total verified counts." },
          { label: "read-only mode", description: "Displaying aggregated score metrics inline inside product cards or table rows." },
        ]}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={RatingPlayground}
          componentName="Rating"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["amber", "primary", "emerald", "rose", "cyan"],
              defaultValue: "amber",
              description: "Semantic color mapping for filled icons"
            },
            {
              name: "icon",
              type: "select",
              options: ["star", "heart", "thumb", "flame", "trophy", "smile"],
              defaultValue: "star",
              description: "Icon symbol shape"
            },
            {
              name: "size",
              type: "select",
              options: ["xs", "sm", "md", "lg", "xl"],
              defaultValue: "md",
              description: "Icon sizing scale"
            },
            {
              name: "allowHalf",
              type: "boolean",
              defaultValue: true,
              description: "Enable 0.5 fractional half-star precision"
            },
            {
              name: "showScore",
              type: "boolean",
              defaultValue: true,
              description: "Display numerical score readout"
            },
            {
              name: "max",
              type: "number",
              defaultValue: 5,
              description: "Maximum scale rating count"
            },
            {
              name: "readonly",
              type: "boolean",
              defaultValue: false,
              description: "Disables interaction and hover effects"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} scope={{ Rating, RatingBreakdown, ReviewCard, Button }} />
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

      <PropsTable propsData={ratingPropsData} />

      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Focus:</strong> Focusable using standard <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Tab</kbd> navigation. Use <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Right Arrow</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Left Arrow</kbd> to step through rating values.</li>
          <li><strong>Screen Reader Compliance:</strong> Implements WAI-ARIA slider role with dynamic <code className="text-primary font-mono text-[10px]">aria-valuenow</code>, <code className="text-primary font-mono text-[10px]">aria-valuemin</code>, and <code className="text-primary font-mono text-[10px]">aria-valuemax</code>.</li>
        </ul>
      </div>
    </section>
  )
}
