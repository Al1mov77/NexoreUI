import { Metadata } from "next";
import { PricingPageClient } from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing & Lifetime Pro License | NexoreUI",
  description: "One-time $39 launch payment (regular $79) for lifetime access to 30+ production Next.js templates, workspace & team management, unlimited Nexore Make exports, 2 developer team invites, and permanent updates.",
  keywords: [
    "nexoreui pricing",
    "react templates lifetime",
    "next.js 15 templates pro",
    "ui library commercial license",
    "nexore make pro export",
    "tailwind v4 templates"
  ],
  alternates: {
    canonical: "/pricing"
  },
  openGraph: {
    title: "NexoreUI Pro Lifetime Access: $39 (Launch Special, Reg. $79)",
    description: "30+ production Next.js templates, full source code, team & workspace management, unlimited visual canvas exports, and 2 permanent developer team invites.",
    url: "/pricing",
    type: "website"
  }
};

export default function PricingPage() {
  return <PricingPageClient />;
}
