export type NicheId =
  | "auto"
  | "restaurant"
  | "gym"
  | "pharmacy"
  | "food"
  | "test-bakery";

export type AutoSubcategoryId =
  | "hypercar-launch"
  | "motorsport-tuning"
  | "bespoke-dealership"
  | "carbon-atelier";

export type ToneId = "luxury" | "track" | "heritage" | "technical";

export type PrimaryCtaGoal =
  | "Book a test drive"
  | "Reserve a car"
  | "Request a quote"
  | "Visit the showroom";

export type SlotDimensionType = "time" | "mass" | "power" | "length" | "price";

export type ArchetypeId = "monolith" | "track" | "editorial" | "showroom";

export type SectionBlockId = "hero" | "specs" | "gallery" | "cta" | "footer";

export type MonolithHeroVariant =
  | "fullbleed-left-slab"
  | "split-vertical-guillotine"
  | "architectural-plinth";

export type TrackHeroVariant =
  | "telemetry-hud-matrix"
  | "thermal-split-dossier"
  | "overhead-aero-windtunnel";

export type EditorialHeroVariant =
  | "magazine-spread-overlap"
  | "monograph-chapter-index"
  | "panoramic-gallery-salon";

export type ShowroomHeroVariant =
  | "interactive-orbit-stage"
  | "bespoke-split-configurator"
  | "cockpit-first-immersion";

export type HeroVariantId =
  | MonolithHeroVariant
  | TrackHeroVariant
  | EditorialHeroVariant
  | ShowroomHeroVariant;

export type SectionKind =
  | "section-orbit-360"
  | "section-state-morph"
  | "section-cockpit-pov"
  | "section-asymmetric-dossier"
  | "section-editorial-timeline"
  | "section-horizontal-strip"
  | "section-spec-ledger"
  | "section-trim-builder";

export type ShotScale =
  | "extreme-wide"
  | "three-quarter"
  | "profile"
  | "rear-stance"
  | "overhead"
  | "interior-pov"
  | "macro-detail";

export type NegativeSpaceZone =
  | "left-heavy"
  | "center-top"
  | "framed-symmetric"
  | "right-heavy"
  | "tight-fill";

export type EngineeringTag =
  | "900v-charging"
  | "aerodynamics"
  | "ceramic-brakes"
  | "forged-carbon"
  | "alcantara-cockpit"
  | "laser-optics"
  | "hud-telemetry"
  | "titanium-hardware";

export type FontPairId =
  | "syne-jakarta"
  | "space-ibm"
  | "cormorant-instrument"
  | "playfair-jakarta"
  | "oswald-inter"
  | "unbounded-manrope"
  | "fraunces-work"
  | "chakra-archivo"
  | "archivo-inter"
  | "jetbrains-inter";

export type CopyVoiceId =
  | "technical-homologation"
  | "bespoke-collector"
  | "editorial-manifesto"
  | "motorsport-raw";

export type MetricKind =
  | "acceleration"
  | "top-speed"
  | "range"
  | "power"
  | "mass-delta"
  | "downforce"
  | "rigidity"
  | "charge-time"
  | "chassis-quota"
  | "price";

export interface ValidatedMetric {
  id: string;
  kind: MetricKind;
  dimension: SlotDimensionType;
  label: string;
  numericValue: number;
  displayValue: string;
  unit: string;
  contextNote: string;
}

export interface ExtractedPalette {
  id: string;
  name: string;
  dominantHex: string;
  contrastRatio: string;
  dark: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    fg: string;
    muted: string;
    border: string;
    accent: string;
    accentFg: string;
  };
  light: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    fg: string;
    muted: string;
    border: string;
    accent: string;
    accentFg: string;
  };
}

export type AssetMediaType = "image" | "video";

export type CameraMotionType =
  | "static"
  | "slow-pan"
  | "orbit"
  | "tracking"
  | "macro-focus";

export interface VideoPassportBlock {
  webmUrl?: string;
  posterUrl: string;
  scrollFramesDir?: string;
  scrollFrameCount?: number;
  durationSeconds: number;
  loop: boolean;
  cameraMotion: CameraMotionType;
  fps: number;
  fileSizeBytes: number;
}

export interface SafeTextAreaSpec {
  region:
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "bottom-left"
    | "bottom-right"
    | "center"
    | "none";
  maxCoverageRatio: number;
  luminance: "dark" | "light" | "mixed";
}

export interface VaultAsset {
  id: string;
  niche: NicheId;
  mediaType: AssetMediaType;
  video?: VideoPassportBlock;
  safeTextArea: SafeTextAreaSpec;
  visualGroupId: string;
  contains_logo?: boolean;
  focalPoint?: { x: number; y: number };
  toneLuminance?: "dark" | "light" | "mid";
  subjectBox?: { x: number; y: number; width: number; height: number };
  subcategories: readonly string[];
  tones: readonly ToneId[];
  url: string;
  aspectRatio: "16:9" | "4:3" | "21:9";
  shotScale: ShotScale;
  negativeSpace: NegativeSpaceZone;
  heroViability: number;
  contrastScore: number;
  tags: readonly string[];
  palette: ExtractedPalette;
  partCode: string;
  titleTemplate: string;
  specMetric: ValidatedMetric;
  descriptionByVoice: Record<CopyVoiceId, string>;
}

export interface ScoreBreakdown {
  baseQuality: number;
  subcategoryMatch: number;
  toneMatch: number;
  tagMatch: number;
  compositionFit: number;
  scaleDiversityDelta: number;
  seedOffset: number;
  total: number;
  reasons: string[];
}

export interface ScoredAsset {
  asset: VaultAsset;
  score: ScoreBreakdown;
}

export interface OrbitFrameItem {
  angle: number;
  label: string;
  url: string;
  telemetryNote: string;
  dragCoefficient: string;
}

export interface OrbitSequencePack {
  id: string;
  title: string;
  environmentName: string;
  frames: readonly OrbitFrameItem[];
}

export interface StateMorphPack {
  id: string;
  stateALabel: string;
  stateACode: string;
  stateAFrontUrl: string;
  stateADescription: string;
  stateASpecs: readonly ValidatedMetric[];
  stateBLabel: string;
  stateBCode: string;
  stateBFrontUrl: string;
  stateBRearUrl: string;
  stateBBrakeUrl: string;
  stateBDescription: string;
  stateBSpecs: readonly ValidatedMetric[];
}

export interface CockpitHotspotItem {
  id: string;
  label: string;
  coordX: number;
  coordY: number;
  tag: EngineeringTag;
  detailAssetUrl: string;
  partCode: string;
  headline: string;
  materialSpec: string;
  description: string;
}

export interface CockpitBlueprintPack {
  id: string;
  mainPovUrl: string;
  hotspots: readonly CockpitHotspotItem[];
}

export interface FontPairToken {
  id: FontPairId;
  name: string;
  tones: readonly ToneId[];
  archetypes: readonly ArchetypeId[];
  displayFamily: string;
  bodyFamily: string;
  monoFamily: string;
  googleFontsUrl: string;
  headingTracking: string;
  headingWeight: number;
  uppercaseDisplay: boolean;
}

export interface MotionPersonality {
  name: string;
  duration: number;
  stagger: number;
  ease: readonly [number, number, number, number];
  springStiffness: number;
  springDamping: number;
  parallaxAmount: number;
}

export interface ArchetypeDesignTokens {
  archetype: ArchetypeId;
  archetypeLabel: string;
  heroVariant: HeroVariantId;
  heroVariantLabel: string;
  fontPair: FontPairToken;
  palette: ExtractedPalette;
  voice: CopyVoiceId;
  voiceLabel: string;
  motion: MotionPersonality;
  cardRadius: string;
  buttonRadius: string;
  sectionPaddingY: string;
  sectionOrder: readonly SectionBlockId[];
  gridStyle:
    | "hairline-brutal"
    | "technical-matrix"
    | "editorial-columns"
    | "architectural-bento";
}

export interface GeneratorUserConfig {
  niche: NicheId;
  subcategory: AutoSubcategoryId;
  tone: ToneId;
  brandName: string;
  modelName: string;
  chassisCode: string;
  location: string;
  year: number;
  primaryCta?: PrimaryCtaGoal;
  heroOverrideId?: string;
  focusTags: EngineeringTag[];
  forcedArchetype: ArchetypeId | "auto";
  themeMode: "dark" | "light";
  speedMode: "fast" | "studio" | "slow";
  showXRayScoring: boolean;
  variationSeed: number;
  customMetrics: {
    accelSeconds: number;
    topSpeedKmh: number;
    rangeKm: number;
    powerHp: number;
    massDeltaKg: number;
    downforceKg: number;
    basePriceUsd: number;
  };
}

export interface TimelineChapter {
  index: string;
  phaseCode: string;
  title: string;
  body: string;
  asset: ScoredAsset;
  cropAspect: "16:9" | "4:5" | "21:9";
}

export interface SynthesizedSectionSpec {
  kind: SectionKind;
  code: string;
  title: string;
  subtitle: string;
  primaryAssets: ScoredAsset[];
}

export interface DesignLinterCheck {
  id:
    | "radius"
    | "accent-whitelist"
    | "monochrome-neutrals"
    | "font-limit"
    | "wcag-contrast"
    | "headline-wrap"
    | "copy-limits"
    | "concrete-claim"
    | "no-slop"
    | "no-cyrillic";
  label: string;
  passed: boolean;
  actual: string;
  expected: string;
}

export interface DesignLinterResult {
  passed: boolean;
  radiusPx: string;
  accentHex: string;
  fontFamilies: string[];
  fontCount: number;
  minContrastRatio: number;
  contrastSummary: string;
  headlineWrapSafe: boolean;
  headlineWordCount: number;
  subheadlineWordCount: number;
  ctaWordCount: number;
  sectionCount: number;
  checks: DesignLinterCheck[];
  errors: string[];
}

export interface SynthesizedLandingPayload {
  config: GeneratorUserConfig;
  tokens: ArchetypeDesignTokens;
  heroAsset: ScoredAsset;
  secondaryHeroAsset: ScoredAsset;
  allScoredCandidates: ScoredAsset[];
  eliminatedCandidates: ScoredAsset[];
  featureAssets: ScoredAsset[];
  timelineChapters: TimelineChapter[];
  sections: SynthesizedSectionSpec[];
  sectionOrder: readonly SectionBlockId[];
  validatedMetrics: ValidatedMetric[];
  headline: string;
  headlineFormId: string;
  subheadline: string;
  manifestoQuote: string;
  ctaPrimary: string;
  ctaSecondary: string;
  thinLibraryNotice?: string;
  orbitPack: OrbitSequencePack;
  morphPack: StateMorphPack;
  cockpitPack: CockpitBlueprintPack;
  linter: DesignLinterResult;
}
