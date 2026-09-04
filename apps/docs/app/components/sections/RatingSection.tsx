"use client"

import React, { useState } from "react"
import { ComponentSource } from "../ComponentSource"
import { PropsEditor } from "../PropsEditor"
import { PropsTable } from "../PropsTable"
import { A11yHeader } from "../A11yNotice"
import { Rating, RatingBreakdown, ReviewCard, Button } from "nexoreui"

function InteractiveRatingDemo({ icon = "star", size = "md", max = 5, variant = "amber", allowHalf = false, showScore = true }: any) {
  const [val, setVal] = useState(4.5)
  return (
    <div className="flex flex-col items-center gap-3">
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
      <span className="text-xs font-mono text-muted-foreground">Interactive Value: {val}</span>
    </div>
  )
}

function RatingPlayground(props: any) {
  const [val, setVal] = useState(props.value ?? 4.5)
  return <Rating {...props} value={val} onChange={setVal} />
}

const examples = [
  {
    name: "1. Half-Star Precision Rating",
    component: (
      <InteractiveRatingDemo
        icon="star"
        variant="amber"
        allowHalf
        showScore
      />
    ),
    code: `import React, { useState } from "react";
import { Rating } from "nexoreui";

export default function HalfStarDemo() {
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
    name: "2. E-Commerce Review Rating Breakdown",
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

export default function BreakdownDemo() {
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
    name: "3. Verified Customer Review Card",
    component: (
      <div className="w-full flex justify-center">
        <ReviewCard
          author="Alexander Vance"
          rating={5}
          date="2 days ago"
          title="Exceptional quality and finish"
          content="The attention to detail and build quality exceeded expectations. Seamless integration with our design system!"
          avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
          verified
        />
      </div>
    ),
    code: `import { ReviewCard } from "nexoreui";

export default function ReviewCardDemo() {
  return (
    <ReviewCard
      author="Alexander Vance"
      rating={5}
      date="2 days ago"
      title="Exceptional quality and finish"
      content="The attention to detail and build quality exceeded expectations."
      avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
      verified
    />
  );
}`
  },
  {
    name: "4. Flame Streak & Gamification Rating",
    component: (
      <InteractiveRatingDemo
        icon="flame"
        variant="rose"
        max={5}
        size="lg"
        showScore
      />
    ),
    code: `import { Rating } from "nexoreui";

<Rating
  icon="flame"
  variant="rose"
  max={5}
  size="lg"
  showScore
/>`
  },
  {
    name: "5. Heart Favorites & Wishlist Scoring",
    component: (
      <InteractiveRatingDemo
        icon="heart"
        variant="rose"
        max={5}
        size="md"
        allowHalf
      />
    ),
    code: `import { Rating } from "nexoreui";

<Rating
  icon="heart"
  variant="rose"
  allowHalf
  size="md"
/>`
  },
  {
    name: "6. Neon Cyan Trophy Achievement Score",
    component: (
      <InteractiveRatingDemo
        icon="trophy"
        variant="cyan"
        max={5}
        size="md"
        showScore
      />
    ),
    code: `import { Rating } from "nexoreui";

<Rating
  icon="trophy"
  variant="cyan"
  max={5}
  size="md"
  showScore
/>`
  },
  {
    name: "7. Qualitative Tooltip Labels on Hover",
    component: (
      <div className="flex flex-col items-center gap-3">
        <Rating
          defaultValue={4}
          tooltips={["Terrible", "Poor", "Average", "Very Good", "Exceptional"]}
          showScore
          size="lg"
          variant="emerald"
        />
      </div>
    ),
    code: `import { Rating } from "nexoreui";

<Rating
  defaultValue={4}
  tooltips={["Terrible", "Poor", "Average", "Very Good", "Exceptional"]}
  showScore
  size="lg"
  variant="emerald"
/>`
  },
  {
    name: "8. Read-Only Fixed Metric Display",
    component: (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
        <Rating value={4.7} readonly size="sm" allowHalf variant="amber" />
        <span className="text-xs font-bold text-foreground">4.7 / 5.0</span>
        <span className="text-xs text-muted-foreground">(1,420 reviews)</span>
      </div>
    ),
    code: `import { Rating } from "nexoreui";

<div className="flex items-center gap-3">
  <Rating value={4.7} readonly size="sm" allowHalf variant="amber" />
  <span className="text-xs font-bold">4.7 / 5.0</span>
</div>`
  }
]

const ratingPropsData = [
  { name: "value", type: "number", defaultValue: "—", description: "Controlled active rating score count.", required: false },
  { name: "defaultValue", type: "number", defaultValue: "0", description: "Default rating value for uncontrolled usage.", required: false },
  { name: "max", type: "number", defaultValue: "5", description: "Maximum scoring slots count.", required: false },
  { name: "onChange", type: "(value: number) => void", defaultValue: "—", description: "Callback fired when a rating icon is selected.", required: false },
  { name: "variant", type: '"amber" | "primary" | "emerald" | "rose" | "cyan"', defaultValue: '"amber"', description: "Color theme and glow appearance.", required: false },
  { name: "icon", type: '"star" | "heart" | "thumb" | "flame" | "trophy" | "smile"', defaultValue: '"star"', description: "Selection symbol rendering variant.", required: false },
  { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Visual dimensions of the rating icons.", required: false },
  { name: "allowHalf", type: "boolean", defaultValue: "false", description: "Enables fractional half-point rating precision (0.5).", required: false },
  { name: "showScore", type: "boolean", defaultValue: "false", description: "Displays score badge alongside icons.", required: false },
  { name: "tooltips", type: "string[]", defaultValue: "—", description: "Array of text labels shown on hover corresponding to each score.", required: false },
  { name: "readonly", type: "boolean", defaultValue: "false", description: "Disables pointer event hooks and transforms to display-only.", required: false },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names.", required: false },
]

export function RatingSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const totalPages = Math.ceil(examples.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleItems = examples.slice(startIndex, startIndex + itemsPerPage)

  return (
    <section id="rating" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rating</h2>
          <p className="text-muted-foreground mt-1">
            Premium rating indicator supporting custom shapes (Stars, Hearts, Thumbs, Flames, Trophies), half-star precision, color themes, breakdown cards, and reviews.
          </p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["star rating", "Product reviews, app store ratings, item reviews with fractional precision"],
            ["heart rating", "Marking items as favorites, wishlists, and popularity feedback"],
            ["flame / streak", "Activity streaks, hot trending topics, and gamification rewards"],
            ["trophy rating", "Achievements, difficulty tiers, skill badges, and challenge levels"],
            ["review breakdown", "Customer testimonial sections with distribution percentage bars"],
            ["read-only mode", "Aggregated historical feedback stats where direct user input is disabled"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Playground */}
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
              description: "Color aesthetic theme and glowing accents"
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
              description: "Icon sizing multiplier"
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
              description: "Display numerical score badge"
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

      {/* Examples list */}
      <div className="space-y-12">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} scope={{ Rating, RatingBreakdown, ReviewCard, Button }} />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}

      {/* Props Reference Table */}
      <PropsTable propsData={ratingPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <A11yHeader />
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Focus:</strong> Focusable using standard <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Tab</kbd> navigation. Use arrow keys <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Right Arrow</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px]">Left Arrow</kbd> to increment or decrement rating values.</li>
          <li><strong>Screen Reader Compliance:</strong> Implements WAI-ARIA slider role with dynamic <code className="text-primary font-mono text-[10px]">aria-valuenow</code>, <code className="text-primary font-mono text-[10px]">aria-valuemin</code>, and <code className="text-primary font-mono text-[10px]">aria-valuemax</code>.</li>
        </ul>
      </div>
    </section>
  )
}
