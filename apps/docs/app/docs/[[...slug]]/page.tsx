import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import DocsClientPage from "./DocsClientPage";
import { sidebarGroups, TOTAL_COMPONENTS_COUNT } from "../../config/navigation";

interface PageInfo {
  title: string;
  description: string;
  keywords: string[];
}

const METADATA_MAPPING: Record<string, PageInfo> = {
  overview: {
    title: "NexoreUI - React & Tailwind CSS Components Catalog",
    description: `Browse all ${TOTAL_COMPONENTS_COUNT} free open-source React and Tailwind CSS v4 components in NexoreUI.`,
    keywords: ["react components directory", "tailwind components catalog", "react ui library", "open source ui"],
  },
  icons: {
    title: "NexoreUI - React SVG Icons",
    description: "Searchable SVG icon set included with NexoreUI for React applications.",
    keywords: ["react icons", "svg icons", "lucide icons", "icon library"],
  },
  button: {
    title: "NexoreUI - Button Component",
    description: "Interactive React button components with multiple variants, sizes, and loading states.",
    keywords: ["react button component", "tailwind css button", "ui buttons"],
  },
  "pro-buttons": {
    title: "NexoreUI - Action Buttons",
    description: "Split dropdowns, segmented toggles, copy triggers, confirmation, and status buttons.",
    keywords: ["split button react", "segmented control", "copy button", "action buttons"],
  },
  input: {
    title: "NexoreUI - Input Component",
    description: "Accessible text input fields, textareas, and search inputs with validation states.",
    keywords: ["react input component", "form inputs", "tailwind css inputs"],
  },
  "pro-inputs": {
    title: "NexoreUI - Specialized Inputs",
    description: "OTP verification input with paste support, tag editors, currency inputs, and color pickers.",
    keywords: ["otp input react", "tag input", "currency input", "color picker react"],
  },
  "special-forms": {
    title: "NexoreUI - Form Controls",
    description: "Selectable card radios, numeric steppers, password strength meters, and file dropzones.",
    keywords: ["radio cards react", "number stepper", "file dropzone", "password strength"],
  },
  checkbox: {
    title: "NexoreUI - Checkbox Component",
    description: "Accessible checkbox control with animated check mark and indeterminate state.",
    keywords: ["react checkbox", "accessible checkbox", "tailwind checkbox"],
  },
  select: {
    title: "NexoreUI - Select Component",
    description: "Custom dropdown select with grouped items and full keyboard navigation.",
    keywords: ["react select", "dropdown menu", "tailwind select"],
  },
  switch: {
    title: "NexoreUI - Switch Component",
    description: "Accessible toggle switch control for binary settings in React.",
    keywords: ["react switch", "toggle switch", "tailwind switch"],
  },
  slider: {
    title: "NexoreUI - Slider Component",
    description: "Range slider with single or dual thumbs, step ticks, and value tooltips.",
    keywords: ["react slider", "range input", "dual thumb slider"],
  },
  rating: {
    title: "NexoreUI - Rating Component",
    description: "Interactive star rating component with hover preview and fractional values.",
    keywords: ["react star rating", "rating input", "review stars"],
  },
  "file-upload": {
    title: "NexoreUI - File Upload Component",
    description: "Drag-and-drop file uploader with size validation, progress display, and previews.",
    keywords: ["react file upload", "drag and drop upload", "file input"],
  },
  card: {
    title: "NexoreUI - Card Component",
    description: "Modular container card with header/footer slots, cursor spotlight, and 3D flip mode.",
    keywords: ["react card component", "ui cards", "spotlight card", "flip card"],
  },
  accordion: {
    title: "NexoreUI - Accordion Component",
    description: "Collapsible disclosure panels with smooth height transitions and ARIA support.",
    keywords: ["react accordion", "collapsible panel", "disclosure ui"],
  },
  tabs: {
    title: "NexoreUI - Tabs Component",
    description: "Tabbed navigation component with shared-layout active indicator and keyboard control.",
    keywords: ["react tabs", "animated tabs", "tabbed navigation"],
  },
  table: {
    title: "NexoreUI - Table Component",
    description: "Responsive React data table with column sorting, density presets, and selection.",
    keywords: ["react table", "data table component", "responsive table"],
  },
  stepper: {
    title: "NexoreUI - Stepper Component",
    description: "Multi-step flow indicator for onboarding, checkout, and wizard workflows.",
    keywords: ["react stepper", "step indicator", "multi-step wizard"],
  },
  "scroll-area": {
    title: "NexoreUI - Scroll Area Component",
    description: "Scrollable container with custom-styled cross-platform scrollbars.",
    keywords: ["react scroll area", "custom scrollbar", "overflow container"],
  },
  navigation: {
    title: "NexoreUI - Navigation Components",
    description: "Breadcrumbs, pagination controls, and step navigation components for React.",
    keywords: ["react breadcrumbs", "react pagination", "navigation components"],
  },
  dock: {
    title: "NexoreUI - Dock Component",
    description: "Cursor-magnified floating toolbar menu for React applications.",
    keywords: ["react dock component", "magnification dock", "floating toolbar"],
  },
  "data-display": {
    title: "NexoreUI - Data Display Components",
    description: "Stat cards, timelines, keyboard shortcuts, avatar groups, pricing cards, and dividers.",
    keywords: ["react stat card", "timeline component", "kbd component", "data display"],
  },
  charts: {
    title: "NexoreUI - Charts & Data Visualization",
    description: "SVG donut, bar, area, funnel, heatmap, and KPI widgets styled with semantic tokens.",
    keywords: ["react charts", "svg charts", "data visualization", "kpi widgets"],
  },
  commerce: {
    title: "NexoreUI - Commerce Components",
    description: "Product cards, cart drawers, checkout summaries, coupon inputs, and stock badges.",
    keywords: ["ecommerce ui components", "product card react", "cart drawer", "checkout ui"],
  },
  "premium-media": {
    title: "NexoreUI - Media & Audio Components",
    description: "Audio waveform visualizers, media players, file attachments, and galleries.",
    keywords: ["react audio player", "media gallery", "file attachment card"],
  },
  modal: {
    title: "NexoreUI - Dialog (Modal) Component",
    description: "Radix-powered accessible modal dialog with focus trapping and Escape dismissal.",
    keywords: ["react modal dialog", "radix ui dialog", "accessible modal"],
  },
  dialog: {
    title: "NexoreUI - Dialog (Modal) Component",
    description: "Radix-powered accessible modal dialog with focus trapping and Escape dismissal.",
    keywords: ["react modal dialog", "radix ui dialog", "accessible modal"],
  },
  "premium-overlays": {
    title: "NexoreUI - Overlays & Drawers",
    description: "Slide-over sheets, bottom action drawers, and contextual popover overlays.",
    keywords: ["react drawer", "slide over sheet", "bottom sheet react"],
  },
  alert: {
    title: "NexoreUI - Alert Component",
    description: "Status callout banners for informational, warning, success, and error messages.",
    keywords: ["react alert", "callout banner", "status notification"],
  },
  badge: {
    title: "NexoreUI - Badge Component",
    description: "Compact status indicator badges and tags in solid, outline, and semantic variants.",
    keywords: ["react badge", "status tags", "tailwind css badges"],
  },
  avatar: {
    title: "NexoreUI - Avatar Component",
    description: "User profile image with fallback initials, presence indicators, and stacked groups.",
    keywords: ["react avatar", "fallback initials", "avatar group"],
  },
  tooltip: {
    title: "NexoreUI - Tooltip Component",
    description: "Contextual hover and focus tooltips with directional positioning.",
    keywords: ["react tooltip", "radix ui tooltip", "hover popover"],
  },
  progress: {
    title: "NexoreUI - Progress Component",
    description: "Linear and circular progress bars for determinate and indeterminate tasks.",
    keywords: ["react progress bar", "circular progress", "loading indicator"],
  },
  skeleton: {
    title: "NexoreUI - Skeleton Component",
    description: "Placeholder loading skeletons for text, avatars, cards, and tables.",
    keywords: ["react skeleton", "loading placeholder", "shimmer skeleton"],
  },
  loaders: {
    title: "NexoreUI - Loaders Component",
    description: "Spinners, dot waves, bars, and ring loading indicators with reduced-motion support.",
    keywords: ["react loaders", "loading spinners", "ui indicators"],
  },
  toaster: {
    title: "NexoreUI - Toaster Component",
    description: "Stackable toast notifications with auto-dismiss, swipe dismissal, and actions.",
    keywords: ["react toast", "toaster notifications", "snackbar react"],
  },
  social: {
    title: "NexoreUI - Social & Chat Components",
    description: "Comment threads, chat bubbles, typing indicators, share sheets, and profile cards.",
    keywords: ["chat ui components", "comment thread react", "user profile card"],
  },
  "dark-mode": {
    title: "NexoreUI - Theme Toggle Component",
    description: "Light, dark, and system theme switcher with localStorage and matchMedia sync.",
    keywords: ["dark mode toggle", "theme switch react", "system theme sync"],
  },
  "aurora-border-card": {
    title: "NexoreUI - Aurora Border Card",
    description: "Card with a continuously moving SVG perimeter stroke in flow, wave, and pulse modes.",
    keywords: ["aurora border card", "animated border react", "svg border animation"],
  },
  "aurora-search-pill": {
    title: "NexoreUI - Aurora Search Pill",
    description: "Expandable search pill with rotating conic border track and quick filter chips.",
    keywords: ["search pill react", "animated search bar", "conic border"],
  },
  "ai-prompt-input": {
    title: "NexoreUI - AI Prompt Input",
    description: "Conversational prompt input bar with model selector, attachments, and voice toggle.",
    keywords: ["ai prompt input", "react ai chat input", "prompt composer"],
  },
  command: {
    title: "NexoreUI - Command Palette",
    description: "Keyboard-first command palette with fuzzy filtering, groups, and Cmd+K shortcut.",
    keywords: ["react command palette", "cmdk menu", "keyboard command bar"],
  },
  "interactive-code-block": {
    title: "NexoreUI - Interactive Code Block",
    description: "Syntax-formatted code viewer with line numbers, theme presets, and 1-click copy.",
    keywords: ["react code block", "code snippet card", "copy code component"],
  },
  "aurora-border-fx": {
    title: "NexoreUI - Aurora Border FX",
    description: "Interactive border card with color presets and hover illumination.",
    keywords: ["aurora border fx", "reactive border card", "color preset card"],
  },
  "morphing-geometry": {
    title: "NexoreUI - Morphing Geometry",
    description: "Interactive geometric container with corner radius morphing and rotation controls.",
    keywords: ["morphing geometry", "shape morph react", "framer motion geometry"],
  },
  marquee: {
    title: "NexoreUI - Marquee Component",
    description: "Infinite horizontal or vertical strip scroller with pause-on-hover support.",
    keywords: ["react marquee", "infinite scroller", "logo strip"],
  },
  "number-ticker": {
    title: "NexoreUI - Number Ticker Component",
    description: "Viewport-triggered rolling counter with tabular numerals and custom precision.",
    keywords: ["number ticker react", "animated counter", "rolling numbers"],
  },
  "animated-number": {
    title: "NexoreUI - Animated Number Component",
    description: "Smooth spring transitions between numeric values with tabular spacing.",
    keywords: ["animated number react", "spring counter", "numeric transition"],
  },
  "typing-animation": {
    title: "NexoreUI - Typing Animation Component",
    description: "Character-by-character typewriter text reveal animation.",
    keywords: ["typing animation react", "typewriter effect", "text reveal"],
  },
  "blur-fade": {
    title: "NexoreUI - Blur Fade Component",
    description: "Staggered entrance wrapper combining opacity, translation, and subtle blur.",
    keywords: ["blur fade react", "entrance animation", "stagger reveal"],
  },
  "box-reveal": {
    title: "NexoreUI - Box Reveal Component",
    description: "Block wipe reveal wrapper for typography and structured sections.",
    keywords: ["box reveal react", "text wipe animation", "reveal wrapper"],
  },
  "file-preview-card": {
    title: "NexoreUI - File Preview Card",
    description: "Preview cards for uploaded files with metadata and actions.",
    keywords: ["file preview card", "document card react", "upload preview"],
  },
  "image-compare": {
    title: "NexoreUI - Image Compare Component",
    description: "Interactive before-and-after image comparison slider.",
    keywords: ["image compare react", "before after slider", "comparison widget"],
  },
  "premium-effects": {
    title: "NexoreUI - Spotlight & Grid Effects",
    description: "Cursor-tracking spotlight cards, animated grid backgrounds, and shimmer dividers.",
    keywords: ["spotlight card react", "animated grid background", "motion effects"],
  },
  "ultra-effects": {
    title: "NexoreUI - Text & Motion Effects",
    description: "Text shimmer, box reveal, morphing words, hover buttons, and animated lists.",
    keywords: ["text shimmer react", "word morph", "animated list react"],
  },
  "ultra-components": {
    title: "NexoreUI - Atmospheric Effects",
    description: "Gradient border frames, retro perspective grids, meteors, and shiny text.",
    keywords: ["retro grid react", "shiny text", "gradient border frame"],
  },
  "special-animations": {
    title: "NexoreUI - Motion Primitives",
    description: "Magnetic hover targets, directional clip wipes, and staggered reveal helpers.",
    keywords: ["magnetic button react", "clip path wipe", "framer motion primitives"],
  },
  "pro-components": {
    title: "NexoreUI - Physics & 3D Showcase",
    description: "Unified showcase of interactive 3D product stages, cloth physics, and node pipelines.",
    keywords: ["3d react components", "cloth physics react", "interactive canvas", "node graph"],
  },
  "pro-cards": {
    title: "NexoreUI - 3D Product Cards",
    description: "Four physical product cards: HoloFinishCard, ParticleRevealCard, GlassShatterCard, and FrostHoverCard.",
    keywords: ["3d product cards", "holo finish card", "particle reveal card", "glass shatter card", "frost hover card"],
  },
  "holo-finish-card": {
    title: "NexoreUI - HoloFinishCard",
    description: "Interactive 3D product finish card with real-time pointer tilt and silhouette-masked foil.",
    keywords: ["holo finish card", "3d product card", "holographic foil"],
  },
  "pro-objects": {
    title: "NexoreUI - Live 3D Object",
    description: "Interactive 3D physical product stage with pointer tilt, gyroscope support, and specular sheen.",
    keywords: ["live object", "3d product viewer", "gyroscope tilt react", "specular sheen"],
  },
  "live-object": {
    title: "NexoreUI - Live 3D Object",
    description: "Interactive 3D physical product stage with pointer tilt, gyroscope support, and specular sheen.",
    keywords: ["live object", "3d product viewer", "gyroscope tilt react", "specular sheen"],
  },
  "sound-pulse": {
    title: "NexoreUI - SoundPulse Visualizer",
    description: "Audio-reactive product stage with procedural Web Audio step-sequencer and 56 radial bars.",
    keywords: ["sound pulse", "audio visualizer", "web audio api", "radial visualizer"],
  },
  "silk-unveil": {
    title: "NexoreUI - SilkUnveil Cloth Physics",
    description: "Interactive Verlet cloth physics unveil with fold shading and pointer pull.",
    keywords: ["silk unveil", "cloth physics react", "verlet simulation", "product reveal"],
  },
  "node-flow-graph": {
    title: "NexoreUI - Node Flow Graph",
    description: "Workflow pipeline canvas with draggable nodes, cubic Bezier cables, and packet flow.",
    keywords: ["node flow graph", "workflow builder", "draggable nodes", "bezier wires react"],
  },
  "webgl-overview": {
    title: "NexoreUI - WebGL Shaders Playground",
    description: "Nine GPU-accelerated WebGL fragment shaders and nine interactive canvas motion components.",
    keywords: ["webgl shaders", "react webgl", "fragment shader react", "canvas motion"],
  },
  "glass-lens": {
    title: "NexoreUI - Glass Lens WebGL Shader",
    description: "Refractive glass lens with chromatic dispersion, normal reconstruction, and follower lag.",
    keywords: ["glass lens", "liquid glass react", "webgl glass", "refraction shader"],
  },
  "fluted-glass": {
    title: "NexoreUI - Fluted Glass WebGL Shader",
    description: "Architectural reeded glass shader with cylindrical rib curvature and pointer distortion.",
    keywords: ["fluted glass", "reeded glass react", "webgl reeded glass", "ribbed glass shader"],
  },
  "ripple-water": {
    title: "NexoreUI - Ripple Water WebGL Shader",
    description: "Interactive fluid surface simulation with 16-slot ring buffer waves and specular reflection.",
    keywords: ["ripple water", "water ripple react", "webgl water", "fluid simulation react"],
  },
  "scroll-warp": {
    title: "NexoreUI - Scroll Warp WebGL Shader",
    description: "Scroll velocity page warp with non-linear pinch curves and RGB aberration split.",
    keywords: ["scroll warp", "velocity warp react", "scroll distortion", "webgl scroll warp"],
  },
  "twist-ribbon": {
    title: "NexoreUI - Twist Ribbon WebGL Shader",
    description: "3D twisting ribbon triangle-strip mesh driven by scroll velocity and dynamic normals.",
    keywords: ["twist ribbon", "3d ribbon react", "webgl ribbon", "helical mesh"],
  },
  "dither-image": {
    title: "NexoreUI - Dither Image WebGL Shader",
    description: "Ordered 8x8 Bayer matrix dithering shader with palette quantization and pointer reveal lens.",
    keywords: ["dither image", "bayer dither react", "retro dither shader", "palette quantization"],
  },
  "gravity-grid": {
    title: "NexoreUI - Gravity Grid WebGL Shader",
    description: "Distorted coordinate grid with inertial pointer masses and wave propagation.",
    keywords: ["gravity grid", "spacetime grid react", "gravity wave canvas", "webgl grid"],
  },
  "scroll-drum": {
    title: "NexoreUI - Scroll Drum WebGL Shader",
    description: "3D cylindrical typography drum driven by scroll momentum with perspective projection.",
    keywords: ["scroll drum", "3d typography drum", "cylindrical text react", "webgl drum"],
  },
  "liquid-smear": {
    title: "NexoreUI - Liquid Smear WebGL Shader",
    description: "Viscous fluid velocity smear simulation using ping-pong FBOs with relaxation memory.",
    keywords: ["liquid smear", "fluid smear react", "ping pong fbo", "webgl fluid simulation"],
  },
  "type-proximity": {
    title: "NexoreUI - Type Proximity Canvas",
    description: "Pointer-reactive typography grid morphing variable font weight and width by distance.",
    keywords: ["type proximity", "kinetic typography", "variable font animation"],
  },
  "holo-foil": {
    title: "NexoreUI - Holo Foil Canvas",
    description: "Multi-pass iridescent foil card with radial glare and optional gyroscope tracking.",
    keywords: ["holo foil", "holographic card", "iridescent shader", "foil glare"],
  },
  "letter-pile": {
    title: "NexoreUI - Letter Pile Physics",
    description: "2D rigid-body simulation of letter disks with circle collisions and pointer push.",
    keywords: ["letter pile", "physics typography", "rigid body simulation"],
  },
  "flow-field": {
    title: "NexoreUI - Flow Field Canvas",
    description: "Trigonometric curl-noise vector field steering tracer particles with FPS throttling.",
    keywords: ["flow field", "particle curl noise", "vector field canvas"],
  },
  "text-rail": {
    title: "NexoreUI - Text Rail Canvas",
    description: "Kinetic typography running along 9-point Catmull-Rom cubic Bezier splines.",
    keywords: ["text rail", "kinetic typography", "bezier text path", "catmull rom spline react"],
  },
  "moire-grating": {
    title: "NexoreUI - Moiré Grating Canvas",
    description: "Optical interference simulator superimposing two micro-gratings under drift.",
    keywords: ["moire grating", "moire effect react", "optical interference canvas"],
  },
  "swipe-deck": {
    title: "NexoreUI - Swipe Deck Component",
    description: "Gesture card stack with spring return, fling dismissal, and cyclic ordering.",
    keywords: ["swipe deck", "gesture card stack", "swipeable cards react"],
  },
  "camera-mirror": {
    title: "NexoreUI - Camera Mirror Canvas",
    description: "Webcam or procedural raster canvas projecting luminance into halftone or ASCII cells.",
    keywords: ["camera mirror", "webcam ascii react", "luminance raster canvas", "halftone matrix"],
  },
  "scroll-reveal": {
    title: "NexoreUI - Scroll Reveal Component",
    description: "Hardware-accelerated viewport transitions using native CSS animation-timeline: view().",
    keywords: ["scroll reveal", "css animation timeline", "hardware accelerated scroll"],
  },
};

function getCategoryIdFromSlug(slug?: string[]): string {
  if (!slug || slug.length === 0) return "overview";
  const path = slug.join("/");
  if (path === "installation") return "installation";
  if (path === "icons" || path === "components/icons") return "icons";
  if (path === "components" || path === "overview" || path === "components/overview") return "overview";

  const lastSegment = slug[slug.length - 1];

  const pluralMap: Record<string, string> = {
    buttons: "button",
    "action-buttons": "pro-buttons",
    inputs: "input",
    "specialized-inputs": "pro-inputs",
    "form-controls": "special-forms",
    cards: "card",
    badges: "badge",
    alerts: "alert",
    avatars: "avatar",
    accordions: "accordion",
    modals: "modal",
    "modals-dialogs": "modal",
    dialog: "modal",
    dialogs: "modal",
    loader: "loaders",
    "premium-charts": "charts",
    "premium-commerce": "commerce",
    "premium-social": "social",
    "media-showcase": "premium-media",
    overlays: "premium-overlays",
    checkboxes: "checkbox",
    selects: "select",
    toasters: "toaster",
    toast: "toaster",
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
    "theme-toggle": "dark-mode",
    commerces: "commerce",
    socials: "social",
    "premium-effects": "premium-effects",
    "spotlight-effects": "premium-effects",
    "text-motion": "ultra-effects",
    "atmospheric-effects": "ultra-components",
    "motion-primitives": "special-animations",
    loaders: "loaders",
    marquees: "marquee",
    "number-tickers": "number-ticker",
    "animated-numbers": "animated-number",
    "typing-animations": "typing-animation",
    "aurora-border-cards": "aurora-border-card",
    "aurora-cards": "aurora-border-card",
    "aurora-border-fx": "aurora-border-fx",
    "aurora-fx": "aurora-border-fx",
    "aurora-glow-card": "aurora-border-fx",
    "morphing-geometries": "morphing-geometry",
    "morphing-geometry": "morphing-geometry",
    "morphing-cards": "morphing-geometry",
    "interactive-code-blocks": "interactive-code-block",
    "code-blocks": "interactive-code-block",
    "ai-prompt-inputs": "ai-prompt-input",
    "prompt-inputs": "ai-prompt-input",
    "blur-fades": "blur-fade",
    "box-reveals": "box-reveal",
    "file-preview-cards": "file-preview-card",
    "image-compares": "image-compare",
    switches: "switch",
    docks: "dock",
    "node-flow-graphs": "node-flow-graph",
    "pro-components": "pro-components",
    "pro-component": "pro-components",
    "pro-objects": "pro-objects",
    "pro-object": "pro-objects",
    "live-object": "pro-objects",
    "sound-pulse": "sound-pulse",
    "sound-pulses": "sound-pulse",
    "silk-unveil": "silk-unveil",
    "silk-unveils": "silk-unveil",
    "pro-cards": "pro-cards",
    "product-cards": "pro-cards",
    "webgl-shaders": "webgl-overview",
    webgl: "webgl-overview",
    glass: "glass-lens",
    flute: "fluted-glass",
    ripple: "ripple-water",
    warp: "scroll-warp",
    ribbon: "twist-ribbon",
    dither: "dither-image",
    gravity: "gravity-grid",
    drum: "scroll-drum",
    smear: "liquid-smear",
    "type-proximity": "type-proximity",
    proximity: "type-proximity",
    "holo-foil": "holo-foil",
    foil: "holo-foil",
    "letter-pile": "letter-pile",
    pile: "letter-pile",
    "flow-field": "flow-field",
    flow: "flow-field",
    "text-rail": "text-rail",
    rail: "text-rail",
    "moire-grating": "moire-grating",
    moire: "moire-grating",
    "swipe-deck": "swipe-deck",
    deck: "swipe-deck",
    "camera-mirror": "camera-mirror",
    mirror: "camera-mirror",
    "scroll-reveal": "scroll-reveal",
    reveal: "scroll-reveal",
  };

  return pluralMap[lastSegment] || lastSegment;
}

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryId = getCategoryIdFromSlug(slug);
  const info = METADATA_MAPPING[categoryId] || METADATA_MAPPING.overview;

  return {
    title: info.title,
    description: info.description,
    keywords: [...info.keywords, "nexoreui", "react UI library", "tailwind components", "ui components"],
    alternates: {
      canonical: `/docs/${slug ? slug.join("/") : "components"}`,
    },
    openGraph: {
      title: info.title,
      description: info.description,
      url: `https://www.nexoreui.com/docs/${slug ? slug.join("/") : "components"}`,
    },
    twitter: {
      title: info.title,
      description: info.description,
    },
  };
}

export async function generateStaticParams() {
  const params: { slug: string[] }[] = [{ slug: [] }];

  params.push({ slug: ["components"] });
  params.push({ slug: ["overview"] });
  params.push({ slug: ["icons"] });
  params.push({ slug: ["components", "icons"] });

  sidebarGroups.forEach((group) => {
    group.items.forEach((item) => {
      params.push({ slug: ["components", item.id] });
      if (item.id === "modal") {
        params.push({ slug: ["components", "modals"] });
        params.push({ slug: ["components", "modals-dialogs"] });
      } else if (!item.id.endsWith("s")) {
        params.push({ slug: ["components", `${item.id}s`] });
      }
    });
  });

  return params;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const categoryId = getCategoryIdFromSlug(slug);

  if (categoryId === "installation") {
    redirect("/create");
  }

  if (!slug || slug.length === 0) {
    redirect("/docs/components");
  }

  const info = METADATA_MAPPING[categoryId] || METADATA_MAPPING.overview;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: info.title,
    description: info.description,
    author: {
      "@type": "Organization",
      name: "NexoreUI",
    },
    publisher: {
      "@type": "Organization",
      name: "NexoreUI",
      logo: {
        "@type": "ImageObject",
        url: "https://www.nexoreui.com/nexore-avatar.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DocsClientPage key={categoryId} initialTab={categoryId} />
    </>
  );
}
