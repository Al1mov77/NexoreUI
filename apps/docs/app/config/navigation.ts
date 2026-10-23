export interface NavItem {
  id: string;
  label: string;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export const topLevelNavItems: NavItem[] = [
  { id: "installation", label: "Installation" },
  { id: "overview", label: "Components Overview" },
  { id: "icons", label: "Icons" },
];

export const sidebarGroups: NavGroup[] = [
  {
    id: "core",
    title: "Core & Inputs",
    items: [
      { id: "button", label: "Button" },
      { id: "input", label: "Input" },
      { id: "checkbox", label: "Checkbox" },
      { id: "select", label: "Select" },
      { id: "switch", label: "Switch" },
      { id: "slider", label: "Slider" },
      { id: "rating", label: "Rating" },
      { id: "file-upload", label: "File Upload" },
    ],
  },
  {
    id: "layout",
    title: "Layout & Display",
    items: [
      { id: "card", label: "Card" },
      { id: "accordion", label: "Accordion" },
      { id: "tabs", label: "Tabs" },
      { id: "table", label: "Table" },
      { id: "stepper", label: "Stepper" },
      { id: "scroll-area", label: "Scroll Area" },
      { id: "navigation", label: "Navigation" },
      { id: "dock", label: "Dock" },
      { id: "data-display", label: "Data Display" },
      { id: "charts", label: "Charts" },
      { id: "commerce", label: "Commerce" },
    ],
  },
  {
    id: "feedback",
    title: "Feedback & Overlays",
    items: [
      { id: "modal", label: "Modal (Dialog)" },
      { id: "alert", label: "Alert" },
      { id: "badge", label: "Badge" },
      { id: "avatar", label: "Avatar" },
      { id: "tooltip", label: "Tooltip" },
      { id: "progress", label: "Progress" },
      { id: "skeleton", label: "Skeleton" },
      { id: "loaders", label: "Loaders" },
      { id: "toaster", label: "Toaster" },
      { id: "social", label: "Social" },
    ],
  },
  {
    id: "ai",
    title: "AI & Agentic",
    items: [
      { id: "aurora-border-card", label: "Aurora Border Card" },
      { id: "aurora-search-pill", label: "Aurora Search Pill" },
      { id: "ai-prompt-input", label: "AI Prompt Input" },
      { id: "command", label: "Command" },
      { id: "interactive-code-block", label: "Interactive Code Block" },
      { id: "pro-ai", label: "Pro AI" },
    ],
  },
  {
    id: "animated",
    title: "Animated & Effects",
    items: [
      { id: "aurora-border-fx", label: "Aurora Border FX" },
      { id: "morphing-geometry", label: "Morphing Geometry" },
      { id: "marquee", label: "Marquee" },
      { id: "number-ticker", label: "Number Ticker" },
      { id: "blur-fade", label: "Blur Fade" },
      { id: "dark-mode", label: "Dark Mode Toolkit" },
      { id: "premium-effects", label: "Premium Effects" },
      { id: "ultra-effects", label: "Ultra Effects" },
      { id: "special-animations", label: "Special Animations" },
    ],
  },
  {
    id: "pro",
    title: "Pro Suites",
    items: [
      { id: "premium-media", label: "Media Showcase" },
      { id: "premium-overlays", label: "Overlays & Drawers" },
      { id: "pro-buttons", label: "Pro Buttons" },
      { id: "pro-dashboards", label: "Pro Dashboards" },
      { id: "pro-ecommerce", label: "Pro E-Commerce" },
      { id: "pro-feedback", label: "Pro Feedback" },
      { id: "pro-forms", label: "Pro Forms" },
      { id: "pro-inputs", label: "Pro Inputs" },
      { id: "pro-layouts", label: "Pro Layouts" },
      { id: "pro-lists", label: "Pro Lists" },
      { id: "pro-marketing", label: "Pro Marketing" },
      { id: "pro-navigation", label: "Pro Navigation" },
      { id: "pro-tables", label: "Pro Tables" },
      { id: "special-forms", label: "Special Forms" },
      { id: "ultra-components", label: "Ultra Components" },
    ],
  },
  {
    id: "pro-components",
    title: "Nexore PRO Suite",
    items: [
      { id: "pro-components", label: "Overview" },
      { id: "pro-cards", label: "Pro Cards" },
      { id: "pro-objects", label: "Pro Objects" },
      { id: "sound-pulse", label: "SoundPulse" },
      { id: "silk-unveil", label: "SilkUnveil" },
      { id: "node-flow-graph", label: "Node Flow Graph" },
    ],
  },
];

// Helper to get total component count
export const TOTAL_COMPONENTS_COUNT = sidebarGroups.reduce(
  (sum, g) => sum + g.items.length,
  0
);
