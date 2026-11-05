import React from "react";
import { Metadata } from "next";
import TemplatesPageClient from "./TemplatesPageClient";

export const metadata: Metadata = {
  title: "Next.js and Tailwind Templates | NexoreUI",
  description:
    "Full-source Next.js 15 and Tailwind CSS v4 templates: landing pages, dashboards, stores, auth flows and portfolios. Open a live preview, copy the code, or install with the CLI.",
  keywords: [
    "nextjs templates",
    "tailwind css templates",
    "landing page template",
    "dashboard template",
    "ecommerce template",
    "portfolio template",
    "react templates",
    "nexoreui templates",
  ],
  alternates: {
    canonical: "/templates",
  },
};

export default function TemplatesPage() {
  return <TemplatesPageClient />;
}
