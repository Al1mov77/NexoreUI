"use client";

import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from "react";
import { ChevronRight, Layers, ArrowRight, Compass, ChevronDown } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { TableOfContents } from "../../components/layout/TableOfContents";
import { useLayout } from "../../LayoutClient";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Lazy-load all section components
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
const CookieSection = lazy(() => import("../../components/sections/CookieSection").then(m => ({ default: m.CookieSection })));
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

const sectionComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  installation: InstallationSection,
  overview: ComponentsOverviewSection,
  button: ButtonSection,
  input: InputSection,
  card: CardSection,
  badge: BadgeSection,
  alert: AlertSection,
  avatar: AvatarSection,
  accordion: AccordionSection,
  modal: ModalSection,
  tooltip: TooltipSection,
  tabs: TabsSection,
  progress: ProgressSection,
  skeleton: SkeletonSection,
  slider: SliderSection,
  rating: RatingSection,
  command: CommandSection,
  table: TableSection,
  stepper: StepperSection,
  "scroll-area": ScrollAreaSection,
  "file-upload": FileUploadSection,
  navigation: NavigationSection,
  icons: IconsSection,
  charts: ChartsSection,
  "data-display": DataDisplaySection,
  "dark-mode": DarkModeSection,
  commerce: CommerceSection,
  cookie: CookieSection,
  social: SocialSection,
  "premium-effects": PremiumEffectsSection,
  loaders: LoadersSection,
  marquee: MarqueeSection,
  "number-ticker": NumberTickerSection,
  "animated-number": AnimatedNumberSection,
  "typing-animation": TypingAnimationSection,
  "aurora-border-card": AuroraBorderCardSection,
  "aurora-border-fx": AuroraBorderFXSection,
  "ai-prompt-input": AiPromptInputSection,
  "blur-fade": BlurFadeSection,
  "box-reveal": BoxRevealSection,
  "file-preview-card": FilePreviewCardSection,
  "image-compare": ImageCompareSection,
  switch: SwitchSection,
  dock: DockSection,
  "morphing-geometry": MorphingGeometrySection,
  "interactive-code-block": InteractiveCodeBlockSection,
};

const sectionLabels: Record<string, string> = {
  installation: "Installation",
  overview: "Components Overview",
  button: "Button",
  input: "Input",
  card: "Card",
  badge: "Badge",
  alert: "Alert",
  avatar: "Avatar",
  accordion: "Accordion",
  modal: "Modal / Dialog",
  tooltip: "Tooltip",
  tabs: "Tabs",
  progress: "Progress",
  skeleton: "Skeleton",
  slider: "Slider",
  rating: "Rating",
  command: "Command",
  table: "Table",
  stepper: "Stepper",
  "scroll-area": "Scroll Area",
  "file-upload": "File Upload",
  navigation: "Navigation",
  icons: "Icons",
  charts: "Charts",
  "data-display": "Data Display",
  "dark-mode": "Dark Mode",
  commerce: "Commerce",
  cookie: "Cookie Consent",
  social: "Social Suite",
  "premium-effects": "Premium Effects",
  loaders: "Loaders",
  marquee: "Marquee",
  "number-ticker": "Number Ticker",
  "animated-number": "Animated Number",
  "typing-animation": "Typing Animation",
  "aurora-border-card": "Aurora Border Card",
  "aurora-border-fx": "Aurora Border FX",
  "morphing-geometry": "Morphing Geometry",
  "interactive-code-block": "Interactive Code Block",
  "ai-prompt-input": "AI Prompt Input",
  "blur-fade": "Blur Fade",
  "box-reveal": "Box Reveal",
  "file-preview-card": "File Preview Card",
  "image-compare": "Image Compare",
  switch: "Switch",
  dock: "Dock",
};

const sectionDescriptions: Record<string, string> = {
  installation: "Get started with NexoreUI in your project with customizable themes.",
  overview: "Browse all 40+ handcrafted components with search and live previews.",
  button: "Interactive button components with multiple variants and animations.",
  input: "Text input fields with labels, icons, and validation states.",
  card: "Versatile card layouts for content display.",
  badge: "Small status descriptors for UI elements.",
  alert: "Informational alert messages and notifications.",
  avatar: "User profile pictures with fallback initials.",
  accordion: "Collapsible content panels for organizing information.",
  modal: "Overlay dialogs for focused interactions.",
  tooltip: "Contextual information on hover or focus.",
  tabs: "Tabbed navigation between content panels.",
  progress: "Progress bars and indicators.",
  skeleton: "Loading placeholders for content.",
  slider: "Range input sliders for value selection.",
  rating: "Star rating components for feedback.",
  command: "Command palette for quick actions.",
  table: "Data tables with sorting and filtering.",
  stepper: "Multi-step progress indicators.",
  "scroll-area": "Custom scrollable areas with styled scrollbars.",
  "file-upload": "File upload components with drag and drop.",
  navigation: "Navigation menus and breadcrumbs.",
  icons: "Premium icon library included with NexoreUI.",
  charts: "Interactive charts and data visualization.",
  "data-display": "Components for displaying structured data.",
  "dark-mode": "Dark mode toolkit and theme utilities.",
  commerce: "E-commerce components: products, carts, pricing.",
  cookie: "Cookie consent banners and privacy notices.",
  social: "Social media and chat UI components.",
  "premium-effects": "Premium visual effects and animations.",
  loaders: "Loading spinners and progress indicators.",
  marquee: "Scrolling marquee text and content.",
  "number-ticker": "Animated number counter components.",
  "animated-number": "Smooth number transition animations.",
  "typing-animation": "Typewriter-style text animations.",
  "aurora-border-card": "Modern card with a continuously flowing animated gradient border and live glow themes.",
  "aurora-border-fx": "Interactive Aurora glow card with live color switcher, dynamic blur, and reactive multi-color borders.",
  "morphing-geometry": "Interactive geometric entity with fluid corner transitions, continuous rotation, and specular surface styling.",
  "interactive-code-block": "macOS-inspired code presentation card with instant 1-click copy feedback and vibrant theme styling.",
  "ai-prompt-input": "Ultra-premium conversational AI prompt bar with model selection, attachments, and voice pulse.",
  "blur-fade": "Blur and fade entrance animations.",
  "box-reveal": "Box reveal entrance animations.",
  "file-preview-card": "File Preview card with thumbnails.",
  "image-compare": "Before/after image comparison slider.",
  switch: "A control that allows the user to toggle between checked and unchecked states.",
  dock: "A macOS-style magnify-on-hover toolbar menu.",
};

interface DocsClientPageProps {
  initialTab?: string;
}

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

const orderedSections = [
  "installation",
  "overview",
  "button",
  "input",
  "switch",
  "slider",
  "rating",
  "file-upload",
  "card",
  "accordion",
  "tabs",
  "table",
  "stepper",
  "scroll-area",
  "navigation",
  "dock",
  "data-display",
  "modal",
  "alert",
  "badge",
  "avatar",
  "tooltip",
  "progress",
  "skeleton",
  "loaders",
  "aurora-border-card",
  "aurora-border-fx",
  "morphing-geometry",
  "interactive-code-block",
  "ai-prompt-input",
  "command",
  "marquee",
  "number-ticker",
  "animated-number",
  "typing-animation",
  "blur-fade",
  "box-reveal",
  "file-preview-card",
  "image-compare",
  "premium-effects",
  "charts",
  "commerce",
  "dark-mode",
  "cookie",
  "social",
  "icons",
];

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function DocsClientPage({ initialTab }: DocsClientPageProps) {
  const [activeSection, setActiveSection] = useState(initialTab ?? "installation");
  const { mobileSidebarOpen, setMobileSidebarOpen } = useLayout();

  // Sync with URL hash
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

  // Guarantee scroll resets to top immediately when section or tab changes
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

  const currentIndex = orderedSections.indexOf(activeSection);
  const nextSection = currentIndex !== -1 && currentIndex < orderedSections.length - 1 ? orderedSections[currentIndex + 1] : null;
  const nextLabel = nextSection ? sectionLabels[nextSection] : "";
  const nextHref = nextSection ? (nextSection === "installation" ? "/docs/installation" : nextSection === "overview" ? "/docs/components" : nextSection === "icons" ? "/docs/icons" : `/docs/components/${nextSection}`) : "";

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-background">
      {/* Desktop Sidebar — sticky under header */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        className="hidden md:flex fixed left-0 top-16 bottom-0 z-40 h-[calc(100vh-64px)] border-r border-border"
      />

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <Sidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            className="fixed left-0 top-16 bottom-0 z-50 md:hidden h-[calc(100vh-64px)] border-r border-border"
          />
        </>
      )}

      {/* Main content area */}
      <div className="md:pl-[240px] flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle background ambient glows for the documentation area */}
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[#6366f1]/5 dark:bg-[#6366f1]/3 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-[#6366f1]/5 dark:bg-[#6366f1]/2 blur-[100px] rounded-full pointer-events-none -z-10" />
        
        <main className="flex-1 min-w-0">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-6 lg:py-10">
            <div className="flex items-start justify-between gap-8 xl:gap-12">
              {/* Main Docs Content Column */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex-1 min-w-0 max-w-4xl xl:max-w-5xl"
              >
                {/* Page Header */}
                <motion.div variants={itemVariants} className="mb-8">
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-3 overflow-x-auto whitespace-nowrap">
                    <span>Docs</span>
                    <ChevronRight size={13} className="shrink-0" />
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-foreground/90 font-medium truncate"
                    >
                      {activeLabel}
                    </motion.span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {activeLabel}
                  </h1>

                  {activeDescription && (
                    <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-2xl">
                      {activeDescription}
                    </p>
                  )}

                  <div className="mt-6 border-b border-border" />
                </motion.div>

                {/* Section Content */}
                <motion.div variants={itemVariants}>
                  <Suspense fallback={<SectionLoadingFallback />}>
                    {ActiveComponent ? <ActiveComponent /> : (
                      <div className="text-center py-20 border border-dashed border-border rounded-lg bg-muted/20">
                        <Layers className="h-8 w-8 mx-auto text-muted-foreground/60 mb-3" />
                        <p className="text-sm text-muted-foreground">Section not found</p>
                      </div>
                    )}
                  </Suspense>
                </motion.div>

                {/* Pagination Footer */}
                {nextSection && (
                  <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-border flex justify-end">
                    <Link
                      href={nextHref}
                      onClick={() => handleSectionChange(nextSection)}
                      className="group flex items-center gap-3 px-5 py-2.5 rounded-xl border border-border bg-card/60 hover:bg-card text-sm font-medium transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
                    >
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-muted-foreground/60 font-normal">Next</span>
                        <span className="text-foreground group-hover:text-primary transition-colors">{nextLabel}</span>
                      </div>
                      <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                )}
              </motion.div>

              {/* Right Sidebar: Table of Contents (Desktop >= xl) */}
              <div className="hidden xl:block w-56 shrink-0 sticky top-24 self-start">
                <TableOfContents
                  activeSection={activeSection}
                  githubFileName={`${activeSection}.tsx`}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
