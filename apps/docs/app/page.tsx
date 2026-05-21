import React from "react";
import { Metadata } from "next";
import LandingPage from "./components/landing/LandingPage";

export const metadata: Metadata = {
  title: "NexoreUI — Build Beautiful Interfaces. Faster.",
  description: "300+ modern, animated, production-ready React 19 components. Built with Tailwind CSS, Framer Motion and Radix UI. Copy. Paste. Ship.",
  keywords: [
    "react components",
    "ui library",
    "tailwind css",
    "framer motion",
    "nextjs",
    "radix ui",
    "typescript",
    "open source",
    "component library",
    "nexoreui",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <LandingPage />;
}
