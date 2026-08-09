import React from "react";
import { Metadata } from "next";
import NexoreMakeClient from "./NexoreMakeClient";

export const metadata: Metadata = {
  title: "Nexore Make — Visual UI Component Builder",
  description: "Create, customize, and export custom UI components visually with AI assistance. Export to React, HTML/CSS, Vue, Svelte, Angular, and Vanilla JS.",
  keywords: ["visual component builder", "react ui builder", "tailwind css builder", "framer motion builder", "ai ui generator"],
  alternates: {
    canonical: "/nexoremake",
  },
  openGraph: {
    title: "Nexore Make — Visual UI Component Builder",
    description: "Create, customize, and export custom UI components visually with AI assistance.",
    url: "https://nexoreui.vercel.app/nexoremake",
  }
};

export default function NexoreMakePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Nexore Make",
    "url": "https://nexoreui.vercel.app/nexoremake",
    "description": "Visual drag-and-drop editor to build and export React components using Tailwind CSS and Framer Motion.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="w-full min-h-screen overflow-hidden flex flex-col" style={{
      backgroundColor: 'var(--make-bg, #030303)',
      color: 'var(--make-text, #e4e4e7)',
    }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Semantic HTML for crawlers that bails out of rendering heavy canvas logic */}
      <div className="sr-only">
        <h1>Nexore Make - Visual React Component Builder</h1>
        <p>
          Nexore Make is a powerful visual drag-and-drop editor built directly inside NexoreUI. 
          Reposition elements, adjust corner radius, configure borders, spacing, shadows, and animations 
          visually with instant multi-framework code exports (React, HTML, Vue, Svelte, Angular). 
          Includes an AI design assistant to generate and modify components using natural language.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Visual component editing with live preview</li>
          <li>Export to React, Vue, Svelte, Angular, HTML/CSS</li>
          <li>Integrated AI Assistant for UI generation</li>
          <li>Tailwind CSS and Framer Motion support</li>
        </ul>
      </div>
      
      {/* Interactive Client Application */}
      <NexoreMakeClient />
    </div>
  );
}
