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
  },
  "tables": {
    title: "NexoreUI — Beautiful Premium React Table Components",
    description: "Explore highly customizable, responsive, and beautifully styled Table components with support for animations, density types, and multiple visual presets in NexoreUI.",
    keywords: ["react table", "data table component", "responsive table", "beautiful tables", "glassmorphic table", "cyberpunk table"]
  }
};

function getCategoryIdFromSlug(slug?: string[]): string {
  if (!slug || slug.length === 0) return "installation";
  const path = slug.join("/");
  if (path === "installation") return "installation";
  if (path === "icons") return "icons";
  
  const lastSegment = slug[slug.length - 1];
  
  // Plural to singular mapping to match DocsClientPage keys
  const pluralMap: Record<string, string> = {
    buttons: "button",
    inputs: "input",
    cards: "card",
    badges: "badge",
    alerts: "alert",
    avatars: "avatar",
    accordions: "accordion",
    modals: "modal",
    "modals-dialogs": "modal",
    tooltips: "tooltip",
    tabs: "tabs",
    progress: "progress",
    skeletons: "skeleton",
    sliders: "slider",
    ratings: "rating",
    commands: "command",
    tables: "table",
    steppers: "stepper",
    "scroll-areas": "scroll-area",
    "file-uploads": "file-upload",
    navigations: "navigation",
    charts: "charts",
    "data-displays": "data-display",
    "dark-modes": "dark-mode",
    commerces: "commerce",
    cookies: "cookie",
    socials: "social",
    "premium-effects": "premium-effects",
    loaders: "loaders",
    marquees: "marquee",
    "number-tickers": "number-ticker",
    "animated-numbers": "animated-number",
    "typing-animations": "typing-animation",
    "blur-fades": "blur-fade",
    "box-reveals": "box-reveal",
    "file-preview-cards": "file-preview-card",
    "image-compares": "image-compare",
    switches: "switch",
  };

  return pluralMap[lastSegment] || lastSegment;
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

export async function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["installation"] },
    { slug: ["icons"] },
    { slug: ["components", "icons"] },
    { slug: ["components", "buttons"] },
    { slug: ["components", "button"] },
    { slug: ["components", "cards"] },
    { slug: ["components", "card"] },
    { slug: ["components", "inputs"] },
    { slug: ["components", "input"] },
    { slug: ["components", "modals"] },
    { slug: ["components", "modal"] },
    { slug: ["components", "modals-dialogs"] },
    { slug: ["components", "alerts"] },
    { slug: ["components", "alert"] },
    { slug: ["components", "avatars"] },
    { slug: ["components", "avatar"] },
    { slug: ["components", "badges"] },
    { slug: ["components", "badge"] },
    { slug: ["components", "loaders"] },
    { slug: ["components", "loader"] },
    { slug: ["components", "data-display"] },
    { slug: ["components", "data-displays"] },
    { slug: ["components", "skeletons"] },
    { slug: ["components", "skeleton"] },
    { slug: ["components", "navigation"] },
    { slug: ["components", "navigations"] },
    { slug: ["components", "tabs"] },
    { slug: ["components", "accordions"] },
    { slug: ["components", "accordion"] },
    { slug: ["components", "tooltips"] },
    { slug: ["components", "tooltip"] },
    { slug: ["components", "progress"] },
    { slug: ["components", "sliders"] },
    { slug: ["components", "slider"] },
    { slug: ["components", "ratings"] },
    { slug: ["components", "rating"] },
    { slug: ["components", "commands"] },
    { slug: ["components", "command"] },
    { slug: ["components", "tables"] },
    { slug: ["components", "table"] },
    { slug: ["components", "steppers"] },
    { slug: ["components", "stepper"] },
    { slug: ["components", "scroll-areas"] },
    { slug: ["components", "scroll-area"] },
    { slug: ["components", "file-uploads"] },
    { slug: ["components", "file-upload"] },
    { slug: ["components", "charts"] },
    { slug: ["components", "chart"] },
    { slug: ["components", "dark-modes"] },
    { slug: ["components", "dark-mode"] },
    { slug: ["components", "commerces"] },
    { slug: ["components", "commerce"] },
    { slug: ["components", "cookies"] },
    { slug: ["components", "cookie"] },
    { slug: ["components", "socials"] },
    { slug: ["components", "social"] },
    { slug: ["components", "premium-effects"] },
    { slug: ["components", "premium-effect"] },
    { slug: ["components", "marquees"] },
    { slug: ["components", "marquee"] },
    { slug: ["components", "number-tickers"] },
    { slug: ["components", "number-ticker"] },
    { slug: ["components", "animated-numbers"] },
    { slug: ["components", "animated-number"] },
    { slug: ["components", "typing-animations"] },
    { slug: ["components", "typing-animation"] },
    { slug: ["components", "blur-fades"] },
    { slug: ["components", "blur-fade"] },
    { slug: ["components", "box-reveals"] },
    { slug: ["components", "box-reveal"] },
    { slug: ["components", "file-preview-cards"] },
    { slug: ["components", "file-preview-card"] },
    { slug: ["components", "image-compares"] },
    { slug: ["components", "image-compare"] },
    { slug: ["components", "switches"] },
    { slug: ["components", "switch"] },
  ];
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
