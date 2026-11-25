export interface NavItem {
  id: string;
  label: string;
  isOverview?: boolean;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export const topLevelNavItems: NavItem[] = [
  { id: "create", label: "Create Project" },
  { id: "overview", label: "Components Overview" },
  { id: "icons", label: "Icons" },
];

export const sidebarGroups: NavGroup[] = [
  {
    id: "core",
    title: "Core & Inputs",
    items: [
      { id: "button", label: "Button" },
      { id: "pro-buttons", label: "Action Buttons" },
      { id: "input", label: "Input" },
      { id: "pro-inputs", label: "Specialized Inputs" },
      { id: "special-forms", label: "Form Controls" },
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
      { id: "premium-media", label: "Media & Audio" },
    ],
  },
  {
    id: "feedback",
    title: "Feedback & Overlays",
    items: [
      { id: "modal", label: "Dialog (Modal)" },
      { id: "premium-overlays", label: "Overlays & Drawers" },
      { id: "alert", label: "Alert" },
      { id: "badge", label: "Badge" },
      { id: "avatar", label: "Avatar" },
      { id: "tooltip", label: "Tooltip" },
      { id: "progress", label: "Progress" },
      { id: "skeleton", label: "Skeleton" },
      { id: "loaders", label: "Loaders" },
      { id: "toaster", label: "Toaster" },
      { id: "social", label: "Social & Chat" },
      { id: "dark-mode", label: "Theme Toggle" },
    ],
  },
  {
    id: "ai",
    title: "AI & Code",
    items: [
      { id: "aurora-border-card", label: "Aurora Border Card" },
      { id: "aurora-search-pill", label: "Aurora Search Pill" },
      { id: "ai-prompt-input", label: "AI Prompt Input" },
      { id: "command", label: "Command Palette" },
      { id: "interactive-code-block", label: "Code Block" },
    ],
  },
  {
    id: "animated",
    title: "Motion & Effects",
    items: [
      { id: "aurora-border-fx", label: "Aurora Border FX" },
      { id: "morphing-geometry", label: "Morphing Geometry" },
      { id: "marquee", label: "Marquee" },
      { id: "number-ticker", label: "Number Ticker" },
      { id: "blur-fade", label: "Blur Fade" },
      { id: "premium-effects", label: "Spotlight & Grid" },
      { id: "ultra-effects", label: "Text & Motion" },
      { id: "ultra-components", label: "Atmospheric Effects" },
      { id: "special-animations", label: "Motion Primitives" },
    ],
  },
  {
    id: "physics",
    title: "3D & Physics",
    items: [
      { id: "pro-components", label: "Physics Showcase", isOverview: true },
      { id: "pro-cards", label: "3D Product Cards" },
      { id: "pro-objects", label: "Live 3D Object" },
      { id: "sound-pulse", label: "SoundPulse" },
      { id: "silk-unveil", label: "SilkUnveil" },
      { id: "node-flow-graph", label: "Node Flow Graph" },
    ],
  },
  {
    id: "webgl",
    title: "WebGL Shaders",
    items: [
      { id: "webgl-overview", label: "Shaders Playground", isOverview: true },
      { id: "glass-lens", label: "Glass Lens" },
      { id: "fluted-glass", label: "Fluted Glass" },
      { id: "ripple-water", label: "Ripple Water" },
      { id: "scroll-warp", label: "Scroll Warp" },
      { id: "twist-ribbon", label: "Twist Ribbon" },
      { id: "dither-image", label: "Dither Image" },
      { id: "gravity-grid", label: "Gravity Grid" },
      { id: "scroll-drum", label: "Scroll Drum" },
      { id: "liquid-smear", label: "Liquid Smear" },
    ],
  },
  {
    id: "canvas",
    title: "Interactive Canvas",
    items: [
      { id: "type-proximity", label: "Type Proximity" },
      { id: "holo-foil", label: "Holo Foil" },
      { id: "letter-pile", label: "Letter Pile" },
      { id: "flow-field", label: "Flow Field" },
      { id: "text-rail", label: "Text Rail" },
      { id: "moire-grating", label: "Moiré Grating" },
      { id: "swipe-deck", label: "Swipe Deck" },
      { id: "camera-mirror", label: "Camera Mirror" },
      { id: "scroll-reveal", label: "Scroll Reveal" },
    ],
  },
];

export const CLI_SLUG_BY_SECTION: Record<string, string> = {
  modal: "dialog",
  loaders: "loader",
  charts: "premium-charts",
  commerce: "premium-commerce",
  social: "premium-social",
  "pro-objects": "live-object",
};

export function getCliSlugForSection(sectionId: string): string {
  return CLI_SLUG_BY_SECTION[sectionId] || sectionId;
}

export function getGithubComponentFile(sectionId: string): string {
  return `${getCliSlugForSection(sectionId)}.tsx`;
}

export const TOTAL_COMPONENTS_COUNT = sidebarGroups.reduce(
  (sum, g) => sum + g.items.filter((i) => !i.isOverview).length,
  0
);
