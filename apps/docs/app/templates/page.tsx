import React from "react";
import { Metadata } from "next";
import TemplatesPageClient from "./TemplatesPageClient";

export const metadata: Metadata = {
  title: "Templates — Production-Ready Next.js & Tailwind Starters | NexoreUI",
  description:
    "Explore handcrafted, responsive Next.js 15 & Tailwind CSS v4 templates for AI SaaS, Analytics Dashboards, Developer Portfolios, and Startup Waitlists. Copy the clean code or install via CLI.",
  keywords: [
    "nextjs templates",
    "tailwind css templates",
    "saas landing page template",
    "analytics dashboard template",
    "developer portfolio template",
    "startup waitlist template",
    "react templates",
    "nexoreui templates",
    "copy paste website template",
  ],
  alternates: {
    canonical: "/templates",
  },
};

export default function TemplatesPage() {
  return <TemplatesPageClient />;
}
