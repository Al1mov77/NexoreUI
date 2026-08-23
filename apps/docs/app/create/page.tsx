import React from "react";
import { Metadata } from "next";
import { CreateProjectPageClient } from "./CreateProjectPageClient";

export const metadata: Metadata = {
  title: "Create Project — NexoreUI Theme Studio & Project Configurator",
  description: "Customize your framework, pick your signature color palette and border radius, and generate personalized NexoreUI CLI commands for instant setup.",
  keywords: [
    "create nexore project",
    "shadcn theme generator",
    "tailwind theme customizer",
    "react component configurator",
    "nextjs project generator",
    "tailwind css v4 theme",
    "ui library cli"
  ],
  alternates: {
    canonical: "/create",
  },
  openGraph: {
    title: "Create Project — NexoreUI Theme Studio & Project Configurator",
    description: "Customize your framework, pick your signature color palette and border radius, and generate personalized NexoreUI CLI commands for instant setup.",
    url: "https://nexoreui.vercel.app/create",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Project — NexoreUI Theme Studio & Project Configurator",
    description: "Customize your framework, pick your signature color palette and border radius, and generate personalized NexoreUI CLI commands for instant setup.",
  },
};

export default function CreateProjectPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "NexoreUI Project & Theme Studio",
    "url": "https://nexoreui.vercel.app/create",
    "description": "Interactive project generator with custom themes, framework presets, component suites, and one-click copyable CLI commands.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "publisher": {
      "@type": "Organization",
      "name": "NexoreUI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nexoreui.vercel.app/favicon.ico"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CreateProjectPageClient />
    </>
  );
}
