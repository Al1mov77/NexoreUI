"use client";

import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from "react";
import { ChevronRight, Layers, ArrowRight, ArrowLeft, Terminal, Check, Copy } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { TableOfContents } from "../../components/layout/TableOfContents";
import { useLayout } from "../../LayoutClient";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  sidebarGroups,
  TOTAL_COMPONENTS_COUNT,
  getCliSlugForSection,
  getGithubComponentFile,
} from "../../config/navigation";
import { copyToClipboard } from "../../utils/clipboard";

const InstallationSection = lazy(() => import("../../components/sections/InstallationSection").then(m => ({ default: m.InstallationSection })));
const ComponentsOverviewSection = lazy(() => import("../../components/sections/ComponentsOverviewSection").then(m => ({ default: m.ComponentsOverviewSection })));
const ButtonSection = lazy(() => import("../../components/sections/ButtonSection").then(m => ({ default: m.ButtonSection })));
const InputSection = lazy(() => import("../../components/sections/InputSection").then(m => ({ default: m.InputSection })));
const CardSection = lazy(() => import("../../components/sections/CardSection").then(m => ({ default: m.CardSection })));
const BadgeSection = lazy(() => import("../../components/sections/BadgeSection").then(m => ({ default: m.BadgeSection })));
const AlertSection = lazy(() => import("../../components/sections/AlertSection").then(m => ({ default: m.AlertSection })));
const AvatarSection = lazy(() => import("../../components/sections/AvatarSection").then(m => ({ default: m.AvatarSection })));
const AccordionSection = lazy(() => import("../../components/sections/AccordionSection").then(m => ({ default: m.AccordionSection })));
const ModalSection = lazy(() => import("../../components/sections/ModalSection").then(m => ({ default: m.ModalSection })));
const TooltipSection = lazy(() => import("../../components/sections/TooltipSection").then(m => ({ default: m.TooltipSection })));
const TabsSection = lazy(() => import("../../components/sections/TabsSection").then(m => ({ default: m.TabsSection })));
const ProgressSection = lazy(() => import("../../components/sections/ProgressSection").then(m => ({ default: m.ProgressSection })));
const SkeletonSection = lazy(() => import("../../components/sections/SkeletonSection").then(m => ({ default: m.SkeletonSection })));
const SliderSection = lazy(() => import("../../components/sections/SliderSection").then(m => ({ default: m.SliderSection })));
const RatingSection = lazy(() => import("../../components/sections/RatingSection").then(m => ({ default: m.RatingSection })));
const CommandSection = lazy(() => import("../../components/sections/CommandSection").then(m => ({ default: m.CommandSection })));
const TableSection = lazy(() => import("../../components/sections/TableSection").then(m => ({ default: m.TableSection })));
const StepperSection = lazy(() => import("../../components/sections/StepperSection").then(m => ({ default: m.StepperSection })));
const ScrollAreaSection = lazy(() => import("../../components/sections/ScrollAreaSection").then(m => ({ default: m.ScrollAreaSection })));
const FileUploadSection = lazy(() => import("../../components/sections/FileUploadSection").then(m => ({ default: m.FileUploadSection })));
const NavigationSection = lazy(() => import("../../components/sections/NavigationSection").then(m => ({ default: m.NavigationSection })));
const IconsSection = lazy(() => import("../../components/sections/IconsSection").then(m => ({ default: m.IconsSection })));
const ChartsSection = lazy(() => import("../../components/sections/ChartsSection").then(m => ({ default: m.ChartsSection })));
const DataDisplaySection = lazy(() => import("../../components/sections/DataDisplaySection").then(m => ({ default: m.DataDisplaySection })));
const DarkModeSection = lazy(() => import("../../components/sections/DarkModeSection").then(m => ({ default: m.DarkModeSection })));
const CommerceSection = lazy(() => import("../../components/sections/CommerceSection").then(m => ({ default: m.CommerceSection })));
const SocialSection = lazy(() => import("../../components/sections/SocialSection").then(m => ({ default: m.SocialSection })));
const PremiumEffectsSection = lazy(() => import("../../components/sections/PremiumEffectsSection").then(m => ({ default: m.PremiumEffectsSection })));
const LoadersSection = lazy(() => import("../../components/sections/LoadersSection").then(m => ({ default: m.LoadersSection })));
const MarqueeSection = lazy(() => import("../../components/sections/MarqueeSection").then(m => ({ default: m.MarqueeSection })));
const NumberTickerSection = lazy(() => import("../../components/sections/NumberTickerSection").then(m => ({ default: m.NumberTickerSection })));
const AnimatedNumberSection = lazy(() => import("../../components/sections/AnimatedNumberSection").then(m => ({ default: m.AnimatedNumberSection })));
const TypingAnimationSection = lazy(() => import("../../components/sections/TypingAnimationSection").then(m => ({ default: m.TypingAnimationSection })));
const AuroraBorderCardSection = lazy(() => import("../../components/sections/AuroraBorderCardSection").then(m => ({ default: m.AuroraBorderCardSection })));
const AuroraBorderFXSection = lazy(() => import("../../components/sections/AuroraBorderFXSection").then(m => ({ default: m.AuroraBorderFXSection })));
const AiPromptInputSection = lazy(() => import("../../components/sections/AiPromptInputSection").then(m => ({ default: m.AiPromptInputSection })));
const BlurFadeSection = lazy(() => import("../../components/sections/BlurFadeSection").then(m => ({ default: m.BlurFadeSection })));
const BoxRevealSection = lazy(() => import("../../components/sections/BoxRevealSection").then(m => ({ default: m.BoxRevealSection })));
const FilePreviewCardSection = lazy(() => import("../../components/sections/FilePreviewCardSection").then(m => ({ default: m.FilePreviewCardSection })));
const ImageCompareSection = lazy(() => import("../../components/sections/ImageCompareSection").then(m => ({ default: m.ImageCompareSection })));
const SwitchSection = lazy(() => import("../../components/sections/SwitchSection").then(m => ({ default: m.SwitchSection })));
const DockSection = lazy(() => import("../../components/sections/DockSection").then(m => ({ default: m.DockSection })));
const MorphingGeometrySection = lazy(() => import("../../components/sections/MorphingGeometrySection").then(m => ({ default: m.MorphingGeometrySection })));
const InteractiveCodeBlockSection = lazy(() => import("../../components/sections/InteractiveCodeBlockSection").then(m => ({ default: m.InteractiveCodeBlockSection })));
const AuroraSearchPillSection = lazy(() => import("../../components/sections/AuroraSearchPillSection").then(m => ({ default: m.AuroraSearchPillSection })));
const NodeFlowGraphSection = lazy(() => import("../../components/sections/NodeFlowGraphSection").then(m => ({ default: m.NodeFlowGraphSection })));
const ProCardsSection = lazy(() => import("../../components/sections/ProCardsSection").then(m => ({ default: m.ProCardsSection })));
const ProObjectsSection = lazy(() => import("../../components/sections/ProObjectsSection").then(m => ({ default: m.ProObjectsSection })));
const SoundPulseSection = lazy(() => import("../../components/sections/SoundPulseSection").then(m => ({ default: m.SoundPulseSection })));
const SilkUnveilSection = lazy(() => import("../../components/sections/SilkUnveilSection").then(m => ({ default: m.SilkUnveilSection })));
const ProComponentsSection = lazy(() => import("../../components/sections/ProComponentsSection").then(m => ({ default: m.ProComponentsSection })));
const CheckboxSection = lazy(() => import("../../components/sections/CheckboxSection").then(m => ({ default: m.CheckboxSection })));
const SelectSection = lazy(() => import("../../components/sections/SelectSection").then(m => ({ default: m.SelectSection })));
const ToasterSection = lazy(() => import("../../components/sections/ToasterSection").then(m => ({ default: m.ToasterSection })));
const UltraEffectsSection = lazy(() => import("../../components/sections/UltraEffectsSection").then(m => ({ default: m.UltraEffectsSection })));
const SpecialAnimationsSection = lazy(() => import("../../components/sections/SpecialAnimationsSection").then(m => ({ default: m.SpecialAnimationsSection })));
const PremiumMediaSection = lazy(() => import("../../components/sections/PremiumMediaSection").then(m => ({ default: m.PremiumMediaSection })));
const PremiumOverlaysSection = lazy(() => import("../../components/sections/PremiumOverlaysSection").then(m => ({ default: m.PremiumOverlaysSection })));
const ProButtonsSection = lazy(() => import("../../components/sections/ProButtonsSection").then(m => ({ default: m.ProButtonsSection })));
const ProInputsSection = lazy(() => import("../../components/sections/ProInputsSection").then(m => ({ default: m.ProInputsSection })));
const SpecialFormsSection = lazy(() => import("../../components/sections/SpecialFormsSection").then(m => ({ default: m.SpecialFormsSection })));
const UltraComponentsSection = lazy(() => import("../../components/sections/UltraComponentsSection").then(m => ({ default: m.UltraComponentsSection })));
const WebglOverviewSection = lazy(() => import("../../components/sections/WebglOverviewSection").then(m => ({ default: m.WebglOverviewSection })));
const GlassLensSection = lazy(() => import("../../components/sections/GlassLensSection").then(m => ({ default: m.GlassLensSection })));
const FlutedGlassSection = lazy(() => import("../../components/sections/FlutedGlassSection").then(m => ({ default: m.FlutedGlassSection })));
const RippleWaterSection = lazy(() => import("../../components/sections/RippleWaterSection").then(m => ({ default: m.RippleWaterSection })));
const ScrollWarpSection = lazy(() => import("../../components/sections/ScrollWarpSection").then(m => ({ default: m.ScrollWarpSection })));
const TwistRibbonSection = lazy(() => import("../../components/sections/TwistRibbonSection").then(m => ({ default: m.TwistRibbonSection })));
const DitherImageSection = lazy(() => import("../../components/sections/DitherImageSection").then(m => ({ default: m.DitherImageSection })));
const GravityGridSection = lazy(() => import("../../components/sections/GravityGridSection").then(m => ({ default: m.GravityGridSection })));
const ScrollDrumSection = lazy(() => import("../../components/sections/ScrollDrumSection").then(m => ({ default: m.ScrollDrumSection })));
const LiquidSmearSection = lazy(() => import("../../components/sections/LiquidSmearSection").then(m => ({ default: m.LiquidSmearSection })));
const TypeProximitySection = lazy(() => import("../../components/sections/TypeProximitySection").then(m => ({ default: m.TypeProximitySection })));
const HoloFoilSection = lazy(() => import("../../components/sections/HoloFoilSection").then(m => ({ default: m.HoloFoilSection })));
const LetterPileSection = lazy(() => import("../../components/sections/LetterPileSection").then(m => ({ default: m.LetterPileSection })));
const FlowFieldSection = lazy(() => import("../../components/sections/FlowFieldSection").then(m => ({ default: m.FlowFieldSection })));
const TextRailSection = lazy(() => import("../../components/sections/TextRailSection").then(m => ({ default: m.TextRailSection })));
const MoireGratingSection = lazy(() => import("../../components/sections/MoireGratingSection").then(m => ({ default: m.MoireGratingSection })));
const SwipeDeckSection = lazy(() => import("../../components/sections/SwipeDeckSection").then(m => ({ default: m.SwipeDeckSection })));
const CameraMirrorSection = lazy(() => import("../../components/sections/CameraMirrorSection").then(m => ({ default: m.CameraMirrorSection })));
const ScrollRevealSection = lazy(() => import("../../components/sections/ScrollRevealSection").then(m => ({ default: m.ScrollRevealSection })));

const sectionComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  installation: InstallationSection,
  overview: ComponentsOverviewSection,
  icons: IconsSection,

  button: ButtonSection,
  "pro-buttons": ProButtonsSection,
  "action-buttons": ProButtonsSection,
  input: InputSection,
  "pro-inputs": ProInputsSection,
  "specialized-inputs": ProInputsSection,
  "special-forms": SpecialFormsSection,
  "form-controls": SpecialFormsSection,
  checkbox: CheckboxSection,
  select: SelectSection,
  switch: SwitchSection,
  slider: SliderSection,
  rating: RatingSection,
  "file-upload": FileUploadSection,

  card: CardSection,
  accordion: AccordionSection,
  tabs: TabsSection,
  table: TableSection,
  stepper: StepperSection,
  "scroll-area": ScrollAreaSection,
  navigation: NavigationSection,
  dock: DockSection,
  "data-display": DataDisplaySection,
  charts: ChartsSection,
  "premium-charts": ChartsSection,
  commerce: CommerceSection,
  "premium-commerce": CommerceSection,
  "premium-media": PremiumMediaSection,
  "media-showcase": PremiumMediaSection,

  modal: ModalSection,
  dialog: ModalSection,
  "premium-overlays": PremiumOverlaysSection,
  overlays: PremiumOverlaysSection,
  alert: AlertSection,
  badge: BadgeSection,
  avatar: AvatarSection,
  tooltip: TooltipSection,
  progress: ProgressSection,
  skeleton: SkeletonSection,
  loaders: LoadersSection,
  loader: LoadersSection,
  toaster: ToasterSection,
  social: SocialSection,
  "premium-social": SocialSection,
  "dark-mode": DarkModeSection,

  "aurora-border-card": AuroraBorderCardSection,
  "aurora-search-pill": AuroraSearchPillSection,
  "ai-prompt-input": AiPromptInputSection,
  command: CommandSection,
  "interactive-code-block": InteractiveCodeBlockSection,

  "aurora-border-fx": AuroraBorderFXSection,
  "morphing-geometry": MorphingGeometrySection,
  marquee: MarqueeSection,
  "number-ticker": NumberTickerSection,
  "animated-number": AnimatedNumberSection,
  "typing-animation": TypingAnimationSection,
  "blur-fade": BlurFadeSection,
  "box-reveal": BoxRevealSection,
  "file-preview-card": FilePreviewCardSection,
  "image-compare": ImageCompareSection,
  "premium-effects": PremiumEffectsSection,
  "spotlight-effects": PremiumEffectsSection,
  "ultra-effects": UltraEffectsSection,
  "text-motion": UltraEffectsSection,
  "ultra-components": UltraComponentsSection,
  "atmospheric-effects": UltraComponentsSection,
  "special-animations": SpecialAnimationsSection,
  "motion-primitives": SpecialAnimationsSection,

  "pro-components": ProComponentsSection,
  "pro-cards": ProCardsSection,
  "product-cards": ProCardsSection,
  "holo-finish-card": ProCardsSection,
  "pro-objects": ProObjectsSection,
  "live-object": ProObjectsSection,
  "sound-pulse": SoundPulseSection,
  "silk-unveil": SilkUnveilSection,
  "node-flow-graph": NodeFlowGraphSection,

  "webgl-overview": WebglOverviewSection,
  "webgl-shaders": WebglOverviewSection,
  webgl: WebglOverviewSection,
  "glass-lens": GlassLensSection,
  "fluted-glass": FlutedGlassSection,
  "ripple-water": RippleWaterSection,
  "scroll-warp": ScrollWarpSection,
  "twist-ribbon": TwistRibbonSection,
  "dither-image": DitherImageSection,
  "gravity-grid": GravityGridSection,
  "scroll-drum": ScrollDrumSection,
  "liquid-smear": LiquidSmearSection,

  "type-proximity": TypeProximitySection,
  "holo-foil": HoloFoilSection,
  "letter-pile": LetterPileSection,
  "flow-field": FlowFieldSection,
  "text-rail": TextRailSection,
  "moire-grating": MoireGratingSection,
  "swipe-deck": SwipeDeckSection,
  "camera-mirror": CameraMirrorSection,
  "scroll-reveal": ScrollRevealSection,
};

const sectionLabels: Record<string, string> = {
  installation: "Installation",
  overview: "Components Overview",
  icons: "Icons",

  button: "Button",
  "pro-buttons": "Action Buttons",
  "action-buttons": "Action Buttons",
  input: "Input",
  "pro-inputs": "Specialized Inputs",
  "specialized-inputs": "Specialized Inputs",
  "special-forms": "Form Controls",
  "form-controls": "Form Controls",
  checkbox: "Checkbox",
  select: "Select",
  switch: "Switch",
  slider: "Slider",
  rating: "Rating",
  "file-upload": "File Upload",

  card: "Card",
  accordion: "Accordion",
  tabs: "Tabs",
  table: "Table",
  stepper: "Stepper",
  "scroll-area": "Scroll Area",
  navigation: "Navigation",
  dock: "Dock",
  "data-display": "Data Display",
  charts: "Charts",
  "premium-charts": "Charts",
  commerce: "Commerce",
  "premium-commerce": "Commerce",
  "premium-media": "Media & Audio",
  "media-showcase": "Media & Audio",

  modal: "Dialog (Modal)",
  dialog: "Dialog (Modal)",
  "premium-overlays": "Overlays & Drawers",
  overlays: "Overlays & Drawers",
  alert: "Alert",
  badge: "Badge",
  avatar: "Avatar",
  tooltip: "Tooltip",
  progress: "Progress",
  skeleton: "Skeleton",
  loaders: "Loaders",
  loader: "Loaders",
  toaster: "Toaster",
  social: "Social & Chat",
  "premium-social": "Social & Chat",
  "dark-mode": "Theme Toggle",

  "aurora-border-card": "Aurora Border Card",
  "aurora-search-pill": "Aurora Search Pill",
  "ai-prompt-input": "AI Prompt Input",
  command: "Command Palette",
  "interactive-code-block": "Code Block",

  "aurora-border-fx": "Aurora Border FX",
  "morphing-geometry": "Morphing Geometry",
  marquee: "Marquee",
  "number-ticker": "Number Ticker",
  "animated-number": "Animated Number",
  "typing-animation": "Typing Animation",
  "blur-fade": "Blur Fade",
  "box-reveal": "Box Reveal",
  "file-preview-card": "File Preview Card",
  "image-compare": "Image Compare",
  "premium-effects": "Spotlight & Grid",
  "spotlight-effects": "Spotlight & Grid",
  "ultra-effects": "Text & Motion",
  "text-motion": "Text & Motion",
  "ultra-components": "Atmospheric Effects",
  "atmospheric-effects": "Atmospheric Effects",
  "special-animations": "Motion Primitives",
  "motion-primitives": "Motion Primitives",

  "pro-components": "Physics Showcase",
  "pro-cards": "3D Product Cards",
  "product-cards": "3D Product Cards",
  "holo-finish-card": "HoloFinishCard",
  "pro-objects": "Live 3D Object",
  "live-object": "Live 3D Object",
  "sound-pulse": "SoundPulse",
  "silk-unveil": "SilkUnveil",
  "node-flow-graph": "Node Flow Graph",

  "webgl-overview": "Shaders Playground",
  "webgl-shaders": "Shaders Playground",
  webgl: "Shaders Playground",
  "glass-lens": "Glass Lens",
  "fluted-glass": "Fluted Glass",
  "ripple-water": "Ripple Water",
  "scroll-warp": "Scroll Warp",
  "twist-ribbon": "Twist Ribbon",
  "dither-image": "Dither Image",
  "gravity-grid": "Gravity Grid",
  "scroll-drum": "Scroll Drum",
  "liquid-smear": "Liquid Smear",

  "type-proximity": "Type Proximity",
  "holo-foil": "Holo Foil",
  "letter-pile": "Letter Pile",
  "flow-field": "Flow Field",
  "text-rail": "Text Rail",
  "moire-grating": "Moiré Grating",
  "swipe-deck": "Swipe Deck",
  "camera-mirror": "Camera Mirror",
  "scroll-reveal": "Scroll Reveal",
};

const sectionDescriptions: Record<string, string> = {
  installation: "Install NexoreUI via CLI or npm and configure Tailwind CSS v4 design tokens.",
  overview: `Browse all ${TOTAL_COMPONENTS_COUNT} free open-source React components with live previews and 1-click CLI copy.`,
  icons: "Searchable SVG icon set included with NexoreUI.",

  button: "Action buttons with solid, outline, ghost, shimmer, and 3D variants.",
  "pro-buttons": "Split dropdown buttons, segmented toggles, copy triggers, confirmation, and status buttons.",
  input: "Text input fields with labels, icons, password toggles, and validation states.",
  "pro-inputs": "Specialized inputs: OTP code boxes with paste support, tag editors, currency inputs, and color pickers.",
  "special-forms": "Visual card radios, numeric steppers, password strength meters, and file dropzones.",
  checkbox: "Accessible checkbox control with animated check mark and indeterminate state.",
  select: "Custom dropdown select with grouped items and full keyboard navigation.",
  switch: "Binary toggle switch with accessible role and smooth state transition.",
  slider: "Range slider with single or dual thumbs, steps, and live value display.",
  rating: "Interactive star rating component with hover preview and fractional display.",
  "file-upload": "Drag-and-drop file uploader with size limits and file list management.",

  card: "Container cards with header/footer slots, cursor spotlight tracking, and 3D flip mode.",
  accordion: "Collapsible disclosure panels with smooth height transitions.",
  tabs: "Tabbed navigation with animated active indicator and keyboard switching.",
  table: "Data table with column sorting, density presets, and responsive overflow.",
  stepper: "Multi-step flow indicator for onboarding and checkout sequences.",
  "scroll-area": "Scrollable containers with styled cross-platform scrollbars.",
  navigation: "Breadcrumbs, pagination controls, and step navigation components.",
  dock: "Floating toolbar with distance-based icon magnification on hover.",
  "data-display": "Stat cards, timelines, keyboard shortcuts, avatar stacks, pricing cards, and dividers.",
  charts: "SVG charts and analytics widgets built on semantic theme tokens.",
  commerce: "E-commerce product cards, cart drawers, order summaries, and stock badges.",
  "premium-media": "Audio visualizers, media players, file attachments, and gallery controls.",

  modal: "Radix-powered accessible modal dialog with focus trapping and Escape dismissal.",
  dialog: "Radix-powered accessible modal dialog with focus trapping and Escape dismissal.",
  "premium-overlays": "Slide-over sheets, bottom action drawers, and floating popover overlays.",
  alert: "Status callout banners for informational, success, warning, and error messages.",
  badge: "Compact labels and status tags in multiple visual variants.",
  avatar: "User profile images with fallback initials, presence indicators, and group stacks.",
  tooltip: "Contextual hover and focus tooltips with directional offsets.",
  progress: "Linear and circular progress bars for determinate and loading states.",
  skeleton: "Placeholder blocks matching content geometry during async loading.",
  loaders: "Spinners, bars, and ring loaders respecting reduced-motion preferences.",
  loader: "Spinners, bars, and ring loaders respecting reduced-motion preferences.",
  toaster: "Stackable toast notifications with auto-dismiss and action buttons.",
  social: "Comment threads, chat messages, share sheets, and user profile cards.",
  "dark-mode": "Light, dark, and system theme toggle with matchMedia and localStorage sync.",

  "aurora-border-card": "Card framed by a continuous animated SVG border stroke in flow, wave, or pulse mode.",
  "aurora-search-pill": "Expandable search bar with rotating conic border track and quick filter chips.",
  "ai-prompt-input": "Conversational prompt composer with model switcher, attachments, and voice toggle.",
  command: "Keyboard-first command palette with fuzzy filtering, groups, and Cmd+K shortcut.",
  "interactive-code-block": "Formatted code viewer with line numbers, themes, and instant clipboard copy.",

  "aurora-border-fx": "Reactive border card with selectable color presets and hover illumination.",
  "morphing-geometry": "Interactive geometric container with corner radius morphing and rotation controls.",
  marquee: "Continuous horizontal or vertical strip scroller with pause-on-hover.",
  "number-ticker": "Viewport-triggered rolling counter with tabular numerals.",
  "animated-number": "Smooth spring interpolation between numeric states.",
  "typing-animation": "Character-by-character typewriter text reveal.",
  "blur-fade": "Staggered entrance animation combining opacity, translation, and subtle blur.",
  "box-reveal": "Block wipe entrance animation for headings and text blocks.",
  "file-preview-card": "Structured preview cards for uploaded documents and media.",
  "image-compare": "Interactive before-and-after comparison slider.",
  "premium-effects": "Cursor-tracking spotlight cards, animated grid backgrounds, and shimmer dividers.",
  "ultra-effects": "Text shimmer, box reveal, word morphing, interactive hover buttons, and animated lists.",
  "ultra-components": "Animated gradient borders, shiny text, meteors, and perspective grids.",
  "special-animations": "Magnetic hover buttons, clip-path wipes, and entrance choreography helpers.",

  "pro-components": "Unified playground showcasing interactive 3D and physics components.",
  "pro-cards": "Physical product cards: HoloFinishCard, ParticleRevealCard, GlassShatterCard, and FrostHoverCard.",
  "pro-objects": "Interactive 3D product stage with pointer tilt, gyroscope orientation, and specular sheen.",
  "live-object": "Interactive 3D product stage with pointer tilt, gyroscope orientation, and specular sheen.",
  "sound-pulse": "Audio-reactive product stage with procedural Web Audio step-sequencer and 56 radial bars.",
  "silk-unveil": "Verlet cloth physics curtain with fold shading, breathing wind, and pointer pull.",
  "node-flow-graph": "Draggable workflow pipeline canvas with dynamic cubic Bezier cables.",

  "webgl-overview": "Nine GPU-accelerated WebGL fragment shaders and interactive canvas components.",
  "glass-lens": "Refractive glass lens with chromatic dispersion, surface normals, and follower lag.",
  "fluted-glass": "Architectural reeded glass shader with periodic rib curvature and pointer distortion.",
  "ripple-water": "Interactive fluid surface simulation with 16-slot ring buffer waves.",
  "scroll-warp": "Scroll-velocity distortion with non-linear pinch curves and RGB split.",
  "twist-ribbon": "3D twisting ribbon triangle-strip mesh driven by scroll velocity.",
  "dither-image": "Ordered 8x8 Bayer matrix dithering shader with palette quantization and pointer lens.",
  "gravity-grid": "Coordinate grid deforming around inertial pointer masses with wave propagation.",
  "scroll-drum": "3D cylindrical typography drum driven by scroll momentum.",
  "liquid-smear": "Viscous velocity smear buffer using ping-pong FBOs with relaxation memory.",

  "type-proximity": "Typography grid modulating variable font weight and width by pointer distance.",
  "holo-foil": "Multi-pass iridescent foil card with radial glare and optional gyroscope tracking.",
  "letter-pile": "2D rigid-body simulation of letter disks with circle collisions and pointer push.",
  "flow-field": "Trigonometric curl-noise vector field steering tracer particles with FPS throttling.",
  "text-rail": "Kinetic typography flowing along 9-point Catmull-Rom Bezier splines.",
  "moire-grating": "Optical interference canvas combining two periodic micro-gratings under drift.",
  "swipe-deck": "Gesture card stack with spring return, fling discharge, and cyclic ordering.",
  "camera-mirror": "Webcam or procedural raster canvas projecting luminance into halftone or ASCII cells.",
  "scroll-reveal": "Hardware-accelerated viewport transitions using native CSS animation-timeline: view().",
};

const NON_CLI_SECTIONS = new Set([
  "installation",
  "overview",
  "icons",
  "pro-components",
  "webgl-overview",
  "webgl-shaders",
  "webgl",
]);

const orderedSections: string[] = [
  "installation",
  "overview",
  ...sidebarGroups.flatMap((group) => group.items.map((item) => item.id)),
  "icons",
];

function SectionLoadingFallback() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-48 bg-muted rounded animate-pulse" />
      <div className="h-4 w-80 bg-muted rounded animate-pulse" />
      <div className="h-48 w-full bg-muted rounded-md animate-pulse" />
      <div className="h-4 w-64 bg-muted rounded animate-pulse" />
    </div>
  );
}

interface DocsClientPageProps {
  initialTab?: string;
}

export default function DocsClientPage({ initialTab }: DocsClientPageProps) {
  const [activeSection, setActiveSection] = useState(initialTab ?? "installation");
  const [cliCopied, setCliCopied] = useState(false);
  const { mobileSidebarOpen, setMobileSidebarOpen } = useLayout();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && sectionComponents[hash]) {
        setActiveSection(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [activeSection, initialTab]);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    setMobileSidebarOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [setMobileSidebarOpen]);

  const ActiveComponent = useMemo(() => sectionComponents[activeSection], [activeSection]);
  const activeLabel = sectionLabels[activeSection] || activeSection;
  const activeDescription = sectionDescriptions[activeSection] || "";

  const showCliCommand = Boolean(ActiveComponent) && !NON_CLI_SECTIONS.has(activeSection);
  const cliSlug = getCliSlugForSection(activeSection);
  const cliCommand = `npx nexoreui add ${cliSlug}`;

  const handleCopyCli = async () => {
    await copyToClipboard(cliCommand);
    setCliCopied(true);
    setTimeout(() => setCliCopied(false), 2000);
  };

  const currentIndex = orderedSections.indexOf(activeSection);
  const prevSection = currentIndex > 0 ? orderedSections[currentIndex - 1] : null;
  const prevLabel = prevSection ? (sectionLabels[prevSection] || prevSection) : "";
  const prevHref = prevSection
    ? prevSection === "installation"
      ? "/docs/installation"
      : prevSection === "overview"
        ? "/docs/components"
        : prevSection === "icons"
          ? "/docs/icons"
          : `/docs/components/${prevSection}`
    : "";

  const nextSection = currentIndex !== -1 && currentIndex < orderedSections.length - 1 ? orderedSections[currentIndex + 1] : null;
  const nextLabel = nextSection ? (sectionLabels[nextSection] || nextSection) : "";
  const nextHref = nextSection
    ? nextSection === "installation"
      ? "/docs/installation"
      : nextSection === "overview"
        ? "/docs/components"
        : nextSection === "icons"
          ? "/docs/icons"
          : `/docs/components/${nextSection}`
    : "";

  const hideToc = activeSection === "overview" || activeSection === "webgl-overview" || activeSection === "pro-components";

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        className="hidden md:flex fixed left-0 top-16 bottom-0 z-40 h-[calc(100vh-64px)] border-r border-border"
      />

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              key="docs-backdrop"
              className="fixed inset-0 top-16 bg-black/50 backdrop-blur-[6px] z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              key="docs-drawer"
              className="fixed left-0 top-16 bottom-0 z-50 md:hidden shadow-md"
              initial={prefersReducedMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={prefersReducedMotion ? undefined : { x: "-100%" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: "easeOut" }}
            >
              <Sidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                className="h-[calc(100vh-64px)] border-r border-border"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="md:pl-[260px] flex-1 flex flex-col relative overflow-x-clip">
        <main className="flex-1 min-w-0">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 lg:py-10">
            <div className="flex items-start justify-between gap-8 xl:gap-12">
              <div
                data-docs-content
                className={`flex-1 min-w-0 ${hideToc ? "w-full max-w-none" : "max-w-5xl xl:max-w-6xl"}`}
              >
                <div className="mb-8">
                  <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-3 overflow-x-auto whitespace-nowrap">
                    <Link
                      href="/docs/components"
                      onClick={() => handleSectionChange("overview")}
                      className="hover:text-foreground transition-colors"
                    >
                      Components
                    </Link>
                    <ChevronRight size={13} className="shrink-0 text-muted-foreground/60" />
                    <span className="text-foreground font-medium truncate">
                      {activeLabel}
                    </span>
                  </nav>

                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {activeLabel}
                      </h1>

                      {activeDescription && (
                        <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-2xl">
                          {activeDescription}
                        </p>
                      )}
                    </div>

                    {showCliCommand && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleCopyCli}
                          className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-card hover:bg-muted/60 text-xs font-mono text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={`Copy ${cliCommand}`}
                          title={cliCommand}
                        >
                          <Terminal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[230px] sm:max-w-none">{cliCommand}</span>
                          {cliCopied ? (
                            <Check className="h-3.5 w-3.5 text-success shrink-0" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 border-b border-border" />
                </div>

                <div>
                  <Suspense fallback={<SectionLoadingFallback />}>
                    {ActiveComponent ? <ActiveComponent /> : (
                      <div className="text-center py-20 border border-dashed border-border rounded-lg bg-muted/20 space-y-4">
                        <Layers className="h-8 w-8 mx-auto text-muted-foreground/60 mb-3" />
                        <p className="text-sm text-muted-foreground">Component page not found</p>
                        <div>
                          <Link
                            href="/docs/components"
                            onClick={() => handleSectionChange("overview")}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium transition-colors"
                          >
                            Back to components
                          </Link>
                        </div>
                      </div>
                    )}
                  </Suspense>
                </div>

                {(prevSection || nextSection) && (
                  <div className="mt-16 pt-8 border-t border-border flex items-center justify-between gap-4">
                    {prevSection ? (
                      <Link
                        href={prevHref}
                        onClick={() => handleSectionChange(prevSection)}
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium transition-colors"
                      >
                        <ArrowLeft size={16} className="text-muted-foreground group-hover:text-foreground group-hover:-translate-x-0.5 transition-transform" />
                        <div className="flex flex-col items-start">
                          <span className="text-[10px] text-muted-foreground font-normal">Previous</span>
                          <span className="text-foreground transition-colors">{prevLabel}</span>
                        </div>
                      </Link>
                    ) : <div />}

                    {nextSection ? (
                      <Link
                        href={nextHref}
                        onClick={() => handleSectionChange(nextSection)}
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium transition-colors"
                      >
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-muted-foreground font-normal">Next</span>
                          <span className="text-foreground transition-colors">{nextLabel}</span>
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ) : null}
                  </div>
                )}
              </div>

              {!hideToc && (
                <div className="hidden xl:block w-56 shrink-0 sticky top-24 self-start">
                  <TableOfContents
                    activeSection={activeSection}
                    githubFileName={getGithubComponentFile(activeSection)}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
