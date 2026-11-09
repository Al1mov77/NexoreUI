import React from "react";
import { Metadata } from "next";
import LandingPage from "./components/landing/LandingPage";

export const metadata: Metadata = {
  title: "NexoreUI — Build Beautiful Interfaces Faster",
  description: "Handcrafted React components built on Radix UI and Tailwind CSS v4. Copy the code directly into your project — no lock-in, no subscriptions. TypeScript, dark mode, and accessibility included.",
  keywords: [
    "react components",
    "ui library",
    "tailwind css v4",
    "framer motion",
    "nextjs",
    "radix ui",
    "typescript",
    "open source",
    "copy paste components",
    "component library",
    "nexoreui",
    "shadcn alternative",
    "accessible components",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.nexoreui.com/#website",
        "url": "https://www.nexoreui.com",
        "name": "NexoreUI",
        "description": "Handcrafted React components built on Radix UI and Tailwind CSS v4."
      },
      {
        "@type": "Organization",
        "@id": "https://www.nexoreui.com/#organization",
        "name": "NexoreUI",
        "url": "https://www.nexoreui.com",
        "logo": "https://www.nexoreui.com/nexore-avatar.png"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
