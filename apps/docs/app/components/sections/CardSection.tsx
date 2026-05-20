"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { Card, ImageCard, ProfileCard, ProductCard, ArticleCard, StatCardSimple, PricingCardBasic, WeatherCard, EventCard, TestimonialCardBasic, Button } from "nexoreui";

const variants = [
  {
    name: "Default Card",
    component: <Card className="p-6 w-full max-w-sm"><div className="font-bold text-lg">Default Card</div><p className="text-muted-foreground">Simple content wrapper.</p></Card>,
    code: `import { Card } from "nexoreui"\n\n<Card className="p-6">...</Card>`
  },
  {
    name: "Image Card",
    component: <ImageCard imageUrl="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400" title="Retro Gaming" description="Relive the golden era of arcade." />,
    code: `import { ImageCard } from "nexoreui"\n\n<ImageCard \n  imageUrl="..." \n  title="Retro Gaming" \n  description="..." \n/>`
  },
  {
    name: "Profile Card",
    component: <ProfileCard name="Alex Johnson" role="Lead Designer" avatarUrl="https://i.pravatar.cc/150?u=a042581f4e29026024d" />,
    code: `import { ProfileCard } from "nexoreui"\n\n<ProfileCard \n  name="Alex Johnson" \n  role="Lead Designer" \n  avatarUrl="..." \n/>`
  },
  {
    name: "Product Card",
    component: <ProductCard title="Wireless Headphones" price="$199.99" imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" />,
    code: `import { ProductCard } from "nexoreui"\n\n<ProductCard \n  title="Wireless Headphones" \n  price="$199.99" \n  imageUrl="..." \n/>`
  },
  {
    name: "Article Card",
    component: <ArticleCard title="The Future of React" author="Jane Doe" date="Oct 24, 2026" category="Development" />,
    code: `import { ArticleCard } from "nexoreui"\n\n<ArticleCard \n  title="The Future of React" \n  author="Jane Doe" \n  date="Oct 24, 2026" \n  category="Development" \n/>`
  },
  {
    name: "Stat Card",
    component: <StatCardSimple title="Total Revenue" value="$45,231.89" trend="+20.1%" isPositive={true} />,
    code: `import { StatCardSimple } from "nexoreui"\n\n<StatCardSimple \n  title="Total Revenue" \n  value="$45,231.89" \n  trend="+20.1%" \n  isPositive={true} \n/>`
  },
  {
    name: "Pricing Card",
    component: <PricingCardBasic plan="Pro" price="$29" features={["5 Projects", "Unlimited Users", "Analytics"]} isPopular={true} />,
    code: `import { PricingCardBasic } from "nexoreui"\n\n<PricingCardBasic \n  plan="Pro" \n  price="$29" \n  features={["5 Projects", "Unlimited Users", "Analytics"]} \n  isPopular={true} \n/>`
  },
  {
    name: "Weather Card",
    component: <WeatherCard location="San Francisco" temp="68°F" condition="Partly Cloudy" />,
    code: `import { WeatherCard } from "nexoreui"\n\n<WeatherCard \n  location="San Francisco" \n  temp="68°F" \n  condition="Partly Cloudy" \n/>`
  },
  {
    name: "Event Card",
    component: <EventCard title="Design System Workshop" date="Nov 12, 2026" location="Virtual" attendees={124} />,
    code: `import { EventCard } from "nexoreui"\n\n<EventCard \n  title="Design System Workshop" \n  date="Nov 12, 2026" \n  location="Virtual" \n  attendees={124} \n/>`
  },
  {
    name: "Testimonial Card",
    component: <TestimonialCardBasic quote="NexoreUI saved us hundreds of hours in development time." author="Mark Smith" company="TechStartup" />,
    code: `import { TestimonialCardBasic } from "nexoreui"\n\n<TestimonialCardBasic \n  quote="..." \n  author="Mark Smith" \n  company="TechStartup" \n/>`
  }
];

export function CardSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="cards" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cards</h2>
          <p className="text-muted-foreground">Versatile card components for displaying different types of content.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={Card}
          componentName="Card"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "glass", "gradient", "glow"],
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
              description: "Title of the card"
            },
            {
              name: "description",
              type: "text",
              defaultValue: "This is a description of the card.",
              description: "Description of the card"
            },
            {
              name: "image",
              type: "text",
              defaultValue: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400",
              description: "Optional top image URL"
            },
            {
              name: "children",
              type: "text",
              defaultValue: "Card Content goes here.",
              description: "Card body children text"
            }
          ]}
        />
      </div>

      <div className="space-y-12">
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
    </section>
  )
}
