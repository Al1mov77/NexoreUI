import {
  BookOpen, Puzzle, Crown, Wand2, Package,
  MousePointer2, Type, Layout, Palette,
  Sparkles, CircleDot, Layers, Box, MessageSquare,
  Loader, Image, Star, SlidersHorizontal, ToggleLeft, Navigation,
  ListOrdered, Upload, Table2, BarChart, Eye, ShoppingBag,
  Cookie, Zap, Wrench, Bot, Activity, LayoutGrid, CheckCircle2,
  Sliders, ShieldCheck, Terminal, HeartHandshake
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string;
  isNew?: boolean;
}

export interface NavGroup {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string;
  items: NavItem[];
}

export const topLevelNavItems: NavItem[] = [
  { id: "installation", label: "Installation", icon: BookOpen },
  { id: "overview", label: "Components Overview", icon: LayoutGrid, badge: "40+" },
  { id: "icons", label: "Icons", icon: Puzzle, badge: "300+" },
];

export const sidebarGroups: NavGroup[] = [
  {
    id: "core",
    title: "Core & Inputs",
    icon: MousePointer2,
    items: [
      { id: "button", label: "Button", icon: MousePointer2 },
      { id: "input", label: "Input", icon: Type },
      { id: "switch", label: "Switch", icon: ToggleLeft },
      { id: "slider", label: "Slider", icon: SlidersHorizontal },
      { id: "rating", label: "Rating", icon: Star },
      { id: "file-upload", label: "File Upload", icon: Upload },
    ],
  },
  {
    id: "layout",
    title: "Layout & Display",
    icon: Layout,
    items: [
      { id: "card", label: "Card", icon: Layout },
      { id: "accordion", label: "Accordion", icon: Layers },
      { id: "tabs", label: "Tabs", icon: Layout },
      { id: "table", label: "Table", icon: Table2 },
      { id: "stepper", label: "Stepper", icon: ListOrdered },
      { id: "scroll-area", label: "Scroll Area", icon: Layers },
      { id: "navigation", label: "Navigation", icon: Navigation },
      { id: "dock", label: "Dock", icon: Package },
      { id: "data-display", label: "Data Display", icon: Layers },
    ],
  },
  {
    id: "feedback",
    title: "Feedback & Overlays",
    icon: Sparkles,
    items: [
      { id: "modal", label: "Modal / Dialog", icon: Box },
      { id: "alert", label: "Alert", icon: Sparkles },
      { id: "badge", label: "Badge", icon: Palette },
      { id: "avatar", label: "Avatar", icon: CircleDot },
      { id: "tooltip", label: "Tooltip", icon: MessageSquare },
      { id: "progress", label: "Progress", icon: Loader },
      { id: "skeleton", label: "Skeleton", icon: Image },
      { id: "loaders", label: "Loaders", icon: Loader },
    ],
  },
  {
    id: "ai",
    title: "AI & Agentic",
    icon: Bot,
    badge: "New",
    items: [
      { id: "aurora-border-card", label: "Aurora Border Card", icon: Sparkles, isNew: true },
      { id: "ai-prompt-input", label: "AI Prompt Input", icon: MessageSquare, isNew: true },
      { id: "command", label: "Command", icon: Type },
    ],
  },
  {
    id: "animated",
    title: "Animated & Effects",
    icon: Zap,
    items: [
      { id: "marquee", label: "Marquee", icon: Sparkles },
      { id: "number-ticker", label: "Number Ticker", icon: BarChart },
      { id: "animated-number", label: "Animated Number", icon: BarChart },
      { id: "typing-animation", label: "Typing Animation", icon: Type },
      { id: "blur-fade", label: "Blur Fade", icon: Eye },
      { id: "box-reveal", label: "Box Reveal", icon: Box },
      { id: "file-preview-card", label: "File Preview Card", icon: Image },
      { id: "image-compare", label: "Image Compare", icon: Image },
      { id: "premium-effects", label: "Premium Effects", icon: Zap },
    ],
  },
  {
    id: "pro",
    title: "Pro Suites",
    icon: Crown,
    badge: "Pro",
    items: [
      { id: "charts", label: "Charts", icon: BarChart },
      { id: "commerce", label: "Commerce", icon: ShoppingBag },
      { id: "dark-mode", label: "Dark Mode Toolkit", icon: Eye },
      { id: "cookie", label: "Cookie Consent", icon: Cookie },
      { id: "social", label: "Social", icon: MessageSquare },
    ],
  },
];

// Helper to get total component count
export const TOTAL_COMPONENTS_COUNT = sidebarGroups.reduce(
  (sum, g) => sum + g.items.length,
  0
);
