import {
  BookOpen, Puzzle, Crown, Wand2, Package,
  MousePointer2, Type, Layout, Palette,
  Sparkles, CircleDot, Layers, Box, MessageSquare,
  Loader, Image, Star, SlidersHorizontal, ToggleLeft, Navigation,
  ListOrdered, Upload, Table2, BarChart, Eye, ShoppingBag,
  Cookie, Zap
} from "lucide-react";

export const sidebarGroups = [
  {
    title: "Getting Started",
    items: [
      { id: "installation", label: "Installation", icon: BookOpen },
    ],
  },
  {
    title: "Components",
    items: [
      { id: "button", label: "Button", icon: MousePointer2 },
      { id: "input", label: "Input", icon: Type },
      { id: "card", label: "Card", icon: Layout },
      { id: "badge", label: "Badge", icon: Palette },
      { id: "alert", label: "Alert", icon: Sparkles },
      { id: "avatar", label: "Avatar", icon: CircleDot },
      { id: "accordion", label: "Accordion", icon: Layers },
      { id: "modal", label: "Modal / Dialog", icon: Box },
      { id: "tooltip", label: "Tooltip", icon: MessageSquare },
      { id: "tabs", label: "Tabs", icon: Layout },
      { id: "progress", label: "Progress", icon: Loader },
      { id: "skeleton", label: "Skeleton", icon: Image },
      { id: "slider", label: "Slider", icon: SlidersHorizontal },
      { id: "switch", label: "Switch", icon: ToggleLeft },
      { id: "rating", label: "Rating", icon: Star },
      { id: "command", label: "Command", icon: Type },
      { id: "table", label: "Table", icon: Table2 },
      { id: "stepper", label: "Stepper", icon: ListOrdered },
      { id: "scroll-area", label: "Scroll Area", icon: Layers },
      { id: "file-upload", label: "File Upload", icon: Upload },
      { id: "navigation", label: "Navigation", icon: Navigation },
      { id: "icons", label: "Icons", icon: Puzzle },
      { id: "dock", label: "Dock", icon: Package },
    ],
  },
  {
    title: "Pro",
    items: [
      { id: "charts", label: "Charts", icon: BarChart },
      { id: "data-display", label: "Data Display", icon: Layers },
      { id: "dark-mode", label: "Dark Mode Toolkit", icon: Eye },
      { id: "commerce", label: "Commerce", icon: ShoppingBag },
      { id: "cookie", label: "Cookie Consent", icon: Cookie },
      { id: "social", label: "Social", icon: MessageSquare },
      { id: "premium-effects", label: "Premium Effects", icon: Zap },
      { id: "loaders", label: "Loaders", icon: Loader },
    ],
  },
  {
    title: "Animated",
    items: [
      { id: "marquee", label: "Marquee", icon: Sparkles },
      { id: "number-ticker", label: "Number Ticker", icon: BarChart },
      { id: "animated-number", label: "Animated Number", icon: BarChart },
      { id: "typing-animation", label: "Typing Animation", icon: Type },
      { id: "blur-fade", label: "Blur Fade", icon: Eye },
      { id: "box-reveal", label: "Box Reveal", icon: Box },
      { id: "file-preview-card", label: "File Preview Card", icon: Image },
      { id: "image-compare", label: "Image Compare", icon: Image },
    ],
  },
];
