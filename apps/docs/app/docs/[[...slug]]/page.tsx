import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import DocsClientPage from "./DocsClientPage";

// Metadata mapping for SEO optimization (100/100 score)
interface PageInfo {
  title: string;
  description: string;
  keywords: string[];
}

const METADATA_MAPPING: Record<string, PageInfo> = {
  "installation": {
    title: "NexoreUI — Installation & Setup Guide",
    description: "Learn how to install NexoreUI component library and configure it in your React / Vite / Next.js projects with Tailwind CSS v4.",
    keywords: ["install react components", "setup tailwind css v4", "react component library", "installation guide"]
  },
  "icons": {
    title: "NexoreUI — Modern Premium React SVG Icons",
    description: "Browse the built-in modern premium SVG icon library in NexoreUI for react applications.",
    keywords: ["react icons", "premium svg icons", "react lucide icons", "icon library"]
  },
  "buttons": {
    title: "NexoreUI — Beautiful React Button Components",
    description: "Explore the wide variety of premium, animated, and styled Button components in NexoreUI. Features glow effects, glassmorphic designs, and ripple animations.",
    keywords: ["react button component", "beautiful buttons", "glow button", "tailwind css button", "premium buttons"]
  },
  "cards": {
    title: "NexoreUI — Premium React Card Components",
    description: "Discover stunning Card components in NexoreUI, featuring hover animations, border glow effects, and modern card layouts for portfolios, blogs, and landing pages.",
    keywords: ["react card component", "ui cards", "premium cards", "hover effect card", "glassmorphic card"]
  },
  "inputs": {
    title: "NexoreUI — Interactive React Input & Form Components",
    description: "Check out the input fields, text areas, and search bars in NexoreUI. Includes glowing borders, animated labels, and premium validation designs.",
    keywords: ["react input component", "form inputs", "animated text input", "tailwind css inputs", "modern input design"]
  },
  "modals": {
    title: "NexoreUI — Glassmorphic Modal Dialog & Drawer Components",
    description: "Browse our modals and overlays, including alert dialogs, drawers, and glassmorphic modals with fully customizable props and smooth animations.",
    keywords: ["react modal dialog", "glassmorphism modal", "drawer component", "alert dialog react", "radix ui dialog"]
  },
  "alerts": {
    title: "NexoreUI — Toast & Alert Notification Components",
    description: "Get premium toast and alert notification components for React applications. Features customizable types, colors, and animations.",
    keywords: ["react alerts", "toast notifications", "animated alert", "notification components", "tailwind toast"]
  },
  "avatars": {
    title: "NexoreUI — Customizable Avatar Components",
    description: "Fully customizable React avatar components with support for images, fallback initials, status indicators, and custom styling.",
    keywords: ["react avatar", "avatar placeholder", "fallback initials", "user profile image"]
  },
  "badges": {
    title: "NexoreUI — Interactive Badge & Tag Components",
    description: "Highlight status, categories, or notifications using NexoreUI interactive badge components.",
    keywords: ["react badge", "status tags", "pills components", "tailwind css badges"]
  },
  "loaders": {
    title: "NexoreUI — Premium Spinners & Loading Components",
    description: "Enhance UX with beautiful premium loaders, progress indicators, and spinners from NexoreUI.",
    keywords: ["react loaders", "loading spinners", "ui indicators", "progress indicator"]
  },
  "toggles": {
    title: "NexoreUI — Interactive Switch & Toggle Components",
    description: "Customizable switches, checkbox inputs, and interactive toggles for settings and preferences in React applications.",
    keywords: ["react toggle switch", "interactive switches", "checkbox custom", "form controls"]
  },
  "typography": {
    title: "NexoreUI — Sleek Typography & Heading Components",
    description: "Upgrade your headings and copy with animated text effects, gradient text, and responsive typography from NexoreUI.",
    keywords: ["react typography", "gradient text", "text animations", "tailwind heading styles"]
  },
  "data-display": {
    title: "NexoreUI — Data Display & Table Components",
    description: "Organize and display complex data using tables, list grids, and skeletal layouts in NexoreUI.",
    keywords: ["react data table", "data display components", "skeleton loading table", "responsive lists"]
  },
  "navigation": {
    title: "NexoreUI — Modern Tabs, Accordions & Navbar Components",
    description: "Improve site navigation with responsive tabs, animated accordions, and header nav components in NexoreUI.",
    keywords: ["react navbar", "navigation tabs", "collapsible accordion", "interactive menus"]
  },
  "tooltips": {
    title: "NexoreUI — Elegant Tooltip & Info Components",
    description: "Provide helpful micro-copy and descriptions to users on hover using NexoreUI tooltips.",
    keywords: ["react tooltip", "hover tooltip", "radix ui tooltip", "info hover popover"]
  },
  "progress": {
    title: "NexoreUI — Progress Bar & Range Slider Components",
    description: "Display download states, upload percentages, or slider values with premium interactive slider components.",
    keywords: ["react progress bar", "range slider", "volume slider react", "ui sliders"]
  },
  "effects": {
    title: "NexoreUI — Premium Motion & BlurFade Effects",
    description: "Add smooth animations like BlurFade, BoxReveal, and gradient effects to your React components.",
    keywords: ["framer motion effects", "blur fade react", "reveal animation", "premium web transitions"]
  },
  "media": {
    title: "NexoreUI — Image Comparison & File Preview Components",
    description: "Interactive components like ImageCompare and premium file upload previews to level up your media presentation.",
    keywords: ["image compare react", "file preview card", "interactive media layout", "before after slider"]
  },
  "charts": {
    title: "NexoreUI — Interactive Premium Charts & Graphs",
    description: "Visualize data with interactive charts, line graphs, bar charts, and area graphs designed for high performance.",
    keywords: ["react charts", "data visualization", "interactive area chart", "line graph component"]
  },
  "social": {
    title: "NexoreUI — Social Feed & Chat UI Components",
    description: "Build clean comments feeds, chat boxes, and user cards with social components in NexoreUI.",
    keywords: ["chat UI components", "social feed layout", "comment thread react", "user card profile"]
  },
  "commerce": {
    title: "NexoreUI — E-commerce Product & Checkout UI",
    description: "Beautiful product cards, shopping carts, checkout layouts, and checkout modules for ecommerce applications.",
    keywords: ["ecommerce UI components", "product card react", "checkout page design", "pricing cards"]
  },
  "utilities": {
    title: "NexoreUI — Cookie Banner & Dark Mode Utilities",
    description: "Essential website utilities including cookie consent banners and dark mode toggle components.",
    keywords: ["cookie consent react", "dark mode toggle", "theme switch component", "privacy banner"]
  }
};

function getCategoryIdFromSlug(slug?: string[]): string {
  if (!slug || slug.length === 0) return "installation";
  const path = slug.join("/");
  if (path === "installation") return "installation";
  if (path === "icons") return "icons";
  if (path === "components/buttons" || path === "components/button") return "buttons";
  if (path === "components/cards" || path === "components/card") return "cards";
  if (path === "components/inputs" || path === "components/input") return "inputs";
  if (path === "components/modals" || path === "components/modal" || path === "components/modals-dialogs") return "modals";
  if (path === "components/alerts" || path === "components/alert") return "alerts";
  if (path === "components/avatars" || path === "components/avatar") return "avatars";
  if (path === "components/badges" || path === "components/badge") return "badges";
  if (path === "components/loaders" || path === "components/loader") return "loaders";
  if (path === "components/toggles" || path === "components/toggle") return "toggles";
  if (path === "components/typography" || path === "components/special-typography") return "typography";
  if (path === "components/data-display" || path === "components/skeletons") return "data-display";
  if (path === "components/navigation" || path === "components/tabs" || path === "components/accordions") return "navigation";
  if (path === "components/tooltips" || path === "components/tooltip") return "tooltips";
  if (path === "components/progress" || path === "components/sliders" || path === "components/slider") return "progress";
  if (path === "components/effects" || path === "components/motions") return "effects";
  if (path === "components/media" || path === "components/content") return "media";
  if (path === "components/charts") return "charts";
  if (path === "components/social") return "social";
  if (path === "components/commerce") return "commerce";
  if (path === "components/utilities") return "utilities";
  return "installation";
}

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryId = getCategoryIdFromSlug(slug);
  const info = METADATA_MAPPING[categoryId] || METADATA_MAPPING.installation;

  return {
    title: info.title,
    description: info.description,
    keywords: [...info.keywords, "nexoreui", "react UI library", "tailwind components", "ui components"],
    alternates: {
      canonical: `/docs/${slug ? slug.join("/") : "installation"}`
    },
    openGraph: {
      title: info.title,
      description: info.description,
      url: `https://nexoreui.vercel.app/docs/${slug ? slug.join("/") : "installation"}`,
    },
    twitter: {
      title: info.title,
      description: info.description,
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const categoryId = getCategoryIdFromSlug(slug);
  
  // If slug doesn't exist, redirect to /docs/installation
  if (!slug || slug.length === 0) {
    redirect("/docs/installation");
  }

  return <DocsClientPage initialTab={categoryId} />;
}
