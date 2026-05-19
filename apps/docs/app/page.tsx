import React from "react";
import { Metadata } from "next";
import DocsClientPage from "./docs/[[...slug]]/DocsClientPage";

export const metadata: Metadata = {
  title: "NexoreUI — Installation & Setup Guide",
  description: "Learn how to install NexoreUI component library and configure it in your React / Vite / Next.js projects with Tailwind CSS v4.",
  keywords: [
    "install react components",
    "setup tailwind css v4",
    "react component library",
    "installation guide",
    "nexoreui",
    "react UI library",
    "tailwind components",
    "ui components"
  ],
  alternates: {
    canonical: "/"
  }
};

export default function Home() {
  return <DocsClientPage initialTab="installation" />;
}
