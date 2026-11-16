import {
  ArchetypeId,
  ExtractedPalette,
  FontPairId,
  FontPairToken,
  HeroVariantId,
  MotionPersonality,
  NicheId,
  SectionBlockId,
} from "./schema";

export const ARCHETYPE_SECTION_ORDER: Readonly<
  Record<ArchetypeId, readonly SectionBlockId[]>
> = {
  monolith: ["hero", "specs", "gallery", "cta", "footer"],
  track: ["hero", "specs", "cta", "gallery", "footer"],
  editorial: ["hero", "gallery", "specs", "cta", "footer"],
  showroom: ["hero", "gallery", "cta", "specs", "footer"],
} as const;

export const ARCHETYPE_NICHE_COMPATIBILITY: Readonly<
  Record<ArchetypeId, readonly NicheId[]>
> = {
  monolith: ["auto", "gym", "test-bakery"],
  track: ["auto", "gym"],
  editorial: ["auto", "restaurant", "food", "test-bakery"],
  showroom: ["auto", "restaurant", "pharmacy", "food", "test-bakery"],
} as const;

export const NICHE_ARCHETYPE_MAP: Readonly<
  Record<NicheId, readonly ArchetypeId[]>
> = {
  auto: ["monolith", "track", "editorial", "showroom"],
  restaurant: ["editorial", "showroom"],
  gym: ["monolith", "track"],
  pharmacy: ["showroom"],
  food: ["editorial", "showroom"],
  "test-bakery": ["editorial", "showroom", "monolith"],
} as const;

export function isArchetypeAllowedForNiche(
  archetype: ArchetypeId,
  niche: NicheId
): boolean {
  const allowedByNiche = NICHE_ARCHETYPE_MAP[niche] ?? [];
  const allowedByArchetype = ARCHETYPE_NICHE_COMPATIBILITY[archetype] ?? [];
  return (
    allowedByNiche.includes(archetype) && allowedByArchetype.includes(niche)
  );
}

export function getAllowedArchetypesForNiche(
  niche: NicheId
): readonly ArchetypeId[] {
  return (NICHE_ARCHETYPE_MAP[niche] ?? ["showroom"]).filter((arch) =>
    isArchetypeAllowedForNiche(arch, niche)
  );
}

export const ARCHETYPE_RADIUS_RULES: Readonly<
  Record<
    ArchetypeId,
    { canonical: string; minPx: number; maxPx: number; description: string }
  >
> = {
  monolith: {
    canonical: "0px",
    minPx: 0,
    maxPx: 0,
    description: "Monolith: 0px",
  },
  track: {
    canonical: "2px",
    minPx: 0,
    maxPx: 2,
    description: "Track: 0–2px",
  },
  editorial: {
    canonical: "4px",
    minPx: 2,
    maxPx: 4,
    description: "Editorial: 2–4px",
  },
  showroom: {
    canonical: "12px",
    minPx: 10,
    maxPx: 14,
    description: "Showroom: 10–14px",
  },
} as const;

export const FONT_PAIRS: Readonly<Record<FontPairId, FontPairToken>> = {
  "syne-jakarta": {
    id: "syne-jakarta",
    name: "Space Grotesk + Plus Jakarta Sans",
    tones: ["luxury", "technical"],
    archetypes: ["monolith"],
    displayFamily: "'Space Grotesk', sans-serif",
    bodyFamily: "'Plus Jakarta Sans', sans-serif",
    monoFamily: "'Plus Jakarta Sans', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap",
    headingTracking: "-0.04em",
    headingWeight: 700,
    uppercaseDisplay: true,
  },
  "oswald-inter": {
    id: "oswald-inter",
    name: "Oswald + Inter",
    tones: ["track", "technical"],
    archetypes: ["monolith"],
    displayFamily: "'Oswald', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    monoFamily: "'Inter', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap",
    headingTracking: "-0.025em",
    headingWeight: 600,
    uppercaseDisplay: true,
  },
  "space-ibm": {
    id: "space-ibm",
    name: "Space Grotesk + IBM Plex Mono",
    tones: ["track", "technical"],
    archetypes: ["track"],
    displayFamily: "'Space Grotesk', sans-serif",
    bodyFamily: "'Space Grotesk', sans-serif",
    monoFamily: "'IBM Plex Mono', monospace",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap",
    headingTracking: "-0.035em",
    headingWeight: 700,
    uppercaseDisplay: true,
  },
  "chakra-archivo": {
    id: "chakra-archivo",
    name: "Chakra Petch + JetBrains Mono",
    tones: ["track", "technical"],
    archetypes: ["track"],
    displayFamily: "'Chakra Petch', sans-serif",
    bodyFamily: "'Chakra Petch', sans-serif",
    monoFamily: "'JetBrains Mono', monospace",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
    headingTracking: "-0.03em",
    headingWeight: 700,
    uppercaseDisplay: true,
  },
  "cormorant-instrument": {
    id: "cormorant-instrument",
    name: "Cormorant Garamond + Instrument Sans",
    tones: ["heritage", "luxury"],
    archetypes: ["editorial"],
    displayFamily: "'Cormorant Garamond', serif",
    bodyFamily: "'Instrument Sans', sans-serif",
    monoFamily: "'Instrument Sans', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Instrument+Sans:wght@400;500;600;700&display=swap",
    headingTracking: "-0.025em",
    headingWeight: 600,
    uppercaseDisplay: false,
  },
  "playfair-jakarta": {
    id: "playfair-jakarta",
    name: "Playfair Display + Plus Jakarta Sans",
    tones: ["luxury", "heritage"],
    archetypes: ["editorial"],
    displayFamily: "'Playfair Display', serif",
    bodyFamily: "'Plus Jakarta Sans', sans-serif",
    monoFamily: "'Plus Jakarta Sans', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
    headingTracking: "-0.03em",
    headingWeight: 600,
    uppercaseDisplay: false,
  },
  "unbounded-manrope": {
    id: "unbounded-manrope",
    name: "Archivo + Manrope",
    tones: ["technical", "luxury"],
    archetypes: ["showroom"],
    displayFamily: "'Archivo', sans-serif",
    bodyFamily: "'Manrope', sans-serif",
    monoFamily: "'Manrope', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap",
    headingTracking: "-0.035em",
    headingWeight: 700,
    uppercaseDisplay: false,
  },
  "fraunces-work": {
    id: "fraunces-work",
    name: "Fraunces + Work Sans",
    tones: ["heritage", "luxury"],
    archetypes: ["showroom"],
    displayFamily: "'Fraunces', serif",
    bodyFamily: "'Work Sans', sans-serif",
    monoFamily: "'Work Sans', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&display=swap",
    headingTracking: "-0.03em",
    headingWeight: 600,
    uppercaseDisplay: false,
  },
  "archivo-inter": {
    id: "archivo-inter",
    name: "Archivo + Inter",
    tones: ["technical", "heritage"],
    archetypes: ["monolith"],
    displayFamily: "'Archivo', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    monoFamily: "'Inter', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=Inter:wght@400;500;600;700&display=swap",
    headingTracking: "-0.03em",
    headingWeight: 700,
    uppercaseDisplay: true,
  },
  "jetbrains-inter": {
    id: "jetbrains-inter",
    name: "JetBrains Mono + Inter",
    tones: ["track", "technical"],
    archetypes: ["track"],
    displayFamily: "'JetBrains Mono', monospace",
    bodyFamily: "'Inter', sans-serif",
    monoFamily: "'JetBrains Mono', monospace",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap",
    headingTracking: "-0.04em",
    headingWeight: 700,
    uppercaseDisplay: true,
  },
} as const;

export const NEUTRAL_FAMILIES: Readonly<Record<string, ExtractedPalette>> = {
  "cool-concrete": {
    id: "cool-concrete",
    name: "Cool Concrete",
    dominantHex: "#8d8f91",
    contrastRatio: "18.8:1",
    dark: {
      bg: "#0a0b0d",
      surface: "#121316",
      surfaceElevated: "#1a1b1e",
      fg: "#f5f6f8",
      muted: "#8d8f91",
      border: "#26272a",
      accent: "#f5f6f8",
      accentFg: "#0a0b0d",
    },
    light: {
      bg: "#eff0f2",
      surface: "#e5e6e9",
      surfaceElevated: "#dcdddf",
      fg: "#0e0f12",
      muted: "#4c4d50",
      border: "#cacbce",
      accent: "#0e0f12",
      accentFg: "#f5f6f8",
    },
  },
  "warm-bone-paper": {
    id: "warm-bone-paper",
    name: "Warm Bone Paper",
    dominantHex: "#9a9996",
    contrastRatio: "16.4:1",
    dark: {
      bg: "#11110f",
      surface: "#191916",
      surfaceElevated: "#22221e",
      fg: "#f5f4f1",
      muted: "#9a9996",
      border: "#2d2d29",
      accent: "#f5f4f1",
      accentFg: "#11110f",
    },
    light: {
      bg: "#f7f6f3",
      surface: "#efeeeb",
      surfaceElevated: "#e5e4e1",
      fg: "#141412",
      muted: "#555451",
      border: "#d6d5d2",
      accent: "#141412",
      accentFg: "#f7f6f3",
    },
  },
  "pure-graphite": {
    id: "pure-graphite",
    name: "Pure Graphite",
    dominantHex: "#888888",
    contrastRatio: "21.0:1",
    dark: {
      bg: "#000000",
      surface: "#09090b",
      surfaceElevated: "#121215",
      fg: "#FFFFFF",
      muted: "#929296",
      border: "#222226",
      accent: "#FFFFFF",
      accentFg: "#000000",
    },
    light: {
      bg: "#FFFFFF",
      surface: "#F5F5F7",
      surfaceElevated: "#EBEBEE",
      fg: "#09090b",
      muted: "#525256",
      border: "#DFDFE3",
      accent: "#09090b",
      accentFg: "#FFFFFF",
    },
  },
  "soft-charcoal": {
    id: "soft-charcoal",
    name: "Soft Charcoal",
    dominantHex: "#96969a",
    contrastRatio: "17.6:1",
    dark: {
      bg: "#131315",
      surface: "#1b1b1e",
      surfaceElevated: "#242428",
      fg: "#f9f9fb",
      muted: "#96969a",
      border: "#2f2f33",
      accent: "#f9f9fb",
      accentFg: "#131315",
    },
    light: {
      bg: "#fafafc",
      surface: "#f1f1f4",
      surfaceElevated: "#e7e7eb",
      fg: "#151518",
      muted: "#58585c",
      border: "#dadade",
      accent: "#151518",
      accentFg: "#fafafc",
    },
  },
} as const;

export const ARCHETYPE_NEUTRAL_FAMILY_MAP: Readonly<Record<ArchetypeId, ExtractedPalette>> = {
  monolith: NEUTRAL_FAMILIES["pure-graphite"],
  editorial: NEUTRAL_FAMILIES["warm-bone-paper"],
  track: NEUTRAL_FAMILIES["cool-concrete"],
  showroom: NEUTRAL_FAMILIES["soft-charcoal"],
} as const;

export const EXTRACTED_PALETTES: Readonly<Record<string, ExtractedPalette>> = {
  ...NEUTRAL_FAMILIES,
  "hangar-mist-steel": NEUTRAL_FAMILIES["cool-concrete"],
  "thermal-ceramic-amber": NEUTRAL_FAMILIES["pure-graphite"],
  "cryo-laser-ice": NEUTRAL_FAMILIES["cool-concrete"],
  "anodized-titanium-gold": NEUTRAL_FAMILIES["warm-bone-paper"],
  "crimson-diffuser-oled": NEUTRAL_FAMILIES["pure-graphite"],
  "monolith-raw-concrete": NEUTRAL_FAMILIES["cool-concrete"],
  "paper-editorial-terracotta": NEUTRAL_FAMILIES["warm-bone-paper"],
  "british-racing-green": NEUTRAL_FAMILIES["soft-charcoal"],
  "limestone-bronze-patina": NEUTRAL_FAMILIES["soft-charcoal"],
} as const;

function parseHexRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return [128, 128, 128];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function snapToWhitelistPalette(rawPhotoHex: string): ExtractedPalette {
  const [r1, g1, b1] = parseHexRgb(rawPhotoHex);
  const palettes = Object.values(EXTRACTED_PALETTES);
  let bestPalette = palettes[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of palettes) {
    const [r2, g2, b2] = parseHexRgb(candidate.dominantHex);
    const rMean = (r1 + r2) / 2;
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    const weightedDist = Math.sqrt(
      (2 + rMean / 256) * dr * dr +
        4 * dg * dg +
        (2 + (255 - rMean) / 256) * db * db
    );
    if (weightedDist < bestDistance) {
      bestDistance = weightedDist;
      bestPalette = candidate;
    }
  }

  return bestPalette;
}

export const WHITELIST_ACCENT_HEXES: ReadonlySet<string> = new Set(
  Object.values(EXTRACTED_PALETTES).flatMap((p) => [
    p.dark.accent.toUpperCase(),
    p.light.accent.toUpperCase(),
  ])
);

export const MOTION_PERSONALITIES: Readonly<Record<ArchetypeId, MotionPersonality>> = {
  monolith: {
    name: "Architectural Mass (Slow & Heavy)",
    duration: 0.85,
    stagger: 0.08,
    ease: [0.16, 1, 0.3, 1],
    springStiffness: 140,
    springDamping: 26,
    parallaxAmount: 24,
  },
  track: {
    name: "Telemetry Snap (High-Frequency Precision)",
    duration: 0.28,
    stagger: 0.04,
    ease: [0.22, 1, 0.36, 1],
    springStiffness: 360,
    springDamping: 30,
    parallaxAmount: 12,
  },
  editorial: {
    name: "Magazine Glide (Fluid Serif Rhythm)",
    duration: 0.72,
    stagger: 0.07,
    ease: [0.25, 1, 0.5, 1],
    springStiffness: 180,
    springDamping: 24,
    parallaxAmount: 20,
  },
  showroom: {
    name: "Direct Manipulation (Interactive Stage)",
    duration: 0.48,
    stagger: 0.06,
    ease: [0.2, 0.9, 0.3, 1],
    springStiffness: 260,
    springDamping: 28,
    parallaxAmount: 16,
  },
} as const;

export const HERO_VARIANTS_BY_ARCHETYPE: Readonly<
  Record<ArchetypeId, readonly { id: HeroVariantId; label: string; desc: string }[]>
> = {
  monolith: [
    {
      id: "fullbleed-left-slab",
      label: "Full-bleed left overlay",
      desc: "Wide hero photo with left-aligned headline and primary action",
    },
    {
      id: "split-vertical-guillotine",
      label: "Asymmetric two-column split",
      desc: "Structural 1px split with typography on the left and photo on the right",
    },
    {
      id: "architectural-plinth",
      label: "Wide banner stage",
      desc: "Clean masthead above a wide studio vehicle plate",
    },
  ],
  track: [
    {
      id: "telemetry-hud-matrix",
      label: "Split performance layout",
      desc: "Side-by-side headline and track photo with key figures",
    },
    {
      id: "thermal-split-dossier",
      label: "Dual-column showcase",
      desc: "Primary track stance paired with clean specification summary",
    },
    {
      id: "overhead-aero-windtunnel",
      label: "Top-down studio view",
      desc: "Overhead vehicle perspective with balanced typography",
    },
  ],
  editorial: [
    {
      id: "magazine-spread-overlap",
      label: "Asymmetric editorial spread",
      desc: "Serif headline column alongside a framed studio photograph",
    },
    {
      id: "monograph-chapter-index",
      label: "Editorial gallery header",
      desc: "Balanced editorial introduction paired with a wide salon photo",
    },
    {
      id: "panoramic-gallery-salon",
      label: "Salon split header",
      desc: "Two-column editorial masthead above a framed wide plate",
    },
  ],
  showroom: [
    {
      id: "interactive-orbit-stage",
      label: "Centered showroom stage",
      desc: "Headline and action above a wide 16:9 studio photograph",
    },
    {
      id: "bespoke-split-configurator",
      label: "Showroom split layout",
      desc: "Vehicle stage paired with direct booking action",
    },
    {
      id: "cockpit-first-immersion",
      label: "Interior cabin showcase",
      desc: "Driver cabin perspective with clean specification overview",
    },
  ],
} as const;

export interface ToolThemeTokens {
  bg: string;
  surface: string;
  surfaceElevated: string;
  surfaceActive: string;
  border: string;
  borderStrong: string;
  fg: string;
  muted: string;
  accent: string;
  accentFg: string;
  ring: string;
  scrollTrack: string;
  scrollThumb: string;
}

export const TOOL_UI_TOKENS: Readonly<{
  light: ToolThemeTokens;
  dark: ToolThemeTokens;
}> = {
  light: {
    bg: "#FFFFFF",
    surface: "#FAFAFA",
    surfaceElevated: "#F5F5F5",
    surfaceActive: "#EAEAEA",
    border: "#E5E5E5",
    borderStrong: "#CCCCCC",
    fg: "#000000",
    muted: "#666666",
    accent: "#000000",
    accentFg: "#FFFFFF",
    ring: "#000000",
    scrollTrack: "#FFFFFF",
    scrollThumb: "#CCCCCC",
  },
  dark: {
    bg: "#000000",
    surface: "#09090b",
    surfaceElevated: "#121215",
    surfaceActive: "#18181b",
    border: "#222226",
    borderStrong: "#2e2e32",
    fg: "#FFFFFF",
    muted: "#8e8e92",
    accent: "#FFFFFF",
    accentFg: "#000000",
    ring: "#FFFFFF",
    scrollTrack: "#000000",
    scrollThumb: "#222226",
  },
} as const;

export const TOOL_THEME_STYLE_CSS = `
:root {
  --tool-bg: ${TOOL_UI_TOKENS.light.bg};
  --tool-surface: ${TOOL_UI_TOKENS.light.surface};
  --tool-surface-elevated: ${TOOL_UI_TOKENS.light.surfaceElevated};
  --tool-surface-active: ${TOOL_UI_TOKENS.light.surfaceActive};
  --tool-border: ${TOOL_UI_TOKENS.light.border};
  --tool-border-strong: ${TOOL_UI_TOKENS.light.borderStrong};
  --tool-fg: ${TOOL_UI_TOKENS.light.fg};
  --tool-muted: ${TOOL_UI_TOKENS.light.muted};
  --tool-accent: ${TOOL_UI_TOKENS.light.accent};
  --tool-accent-fg: ${TOOL_UI_TOKENS.light.accentFg};
  --tool-ring: ${TOOL_UI_TOKENS.light.ring};
  --tool-scroll-track: ${TOOL_UI_TOKENS.light.scrollTrack};
  --tool-scroll-thumb: ${TOOL_UI_TOKENS.light.scrollThumb};
}
.dark, [data-tool-theme="dark"] {
  --tool-bg: ${TOOL_UI_TOKENS.dark.bg};
  --tool-surface: ${TOOL_UI_TOKENS.dark.surface};
  --tool-surface-elevated: ${TOOL_UI_TOKENS.dark.surfaceElevated};
  --tool-surface-active: ${TOOL_UI_TOKENS.dark.surfaceActive};
  --tool-border: ${TOOL_UI_TOKENS.dark.border};
  --tool-border-strong: ${TOOL_UI_TOKENS.dark.borderStrong};
  --tool-fg: ${TOOL_UI_TOKENS.dark.fg};
  --tool-muted: ${TOOL_UI_TOKENS.dark.muted};
  --tool-accent: ${TOOL_UI_TOKENS.dark.accent};
  --tool-accent-fg: ${TOOL_UI_TOKENS.dark.accentFg};
  --tool-ring: ${TOOL_UI_TOKENS.dark.ring};
  --tool-scroll-track: ${TOOL_UI_TOKENS.dark.scrollTrack};
  --tool-scroll-thumb: ${TOOL_UI_TOKENS.dark.scrollThumb};
}
[data-tool-theme="light"] {
  --tool-bg: ${TOOL_UI_TOKENS.light.bg};
  --tool-surface: ${TOOL_UI_TOKENS.light.surface};
  --tool-surface-elevated: ${TOOL_UI_TOKENS.light.surfaceElevated};
  --tool-surface-active: ${TOOL_UI_TOKENS.light.surfaceActive};
  --tool-border: ${TOOL_UI_TOKENS.light.border};
  --tool-border-strong: ${TOOL_UI_TOKENS.light.borderStrong};
  --tool-fg: ${TOOL_UI_TOKENS.light.fg};
  --tool-muted: ${TOOL_UI_TOKENS.light.muted};
  --tool-accent: ${TOOL_UI_TOKENS.light.accent};
  --tool-accent-fg: ${TOOL_UI_TOKENS.light.accentFg};
  --tool-ring: ${TOOL_UI_TOKENS.light.ring};
  --tool-scroll-track: ${TOOL_UI_TOKENS.light.scrollTrack};
  --tool-scroll-thumb: ${TOOL_UI_TOKENS.light.scrollThumb};
}
.generator-themed-root {
  background-color: var(--tool-bg);
  color: var(--tool-fg);
  scrollbar-color: var(--tool-scroll-thumb) var(--tool-scroll-track);
}
.generator-themed-root button:focus-visible,
.generator-themed-root a:focus-visible,
.generator-themed-root input:focus-visible,
.generator-themed-root select:focus-visible,
.generator-themed-root textarea:focus-visible {
  outline: 2px solid var(--tool-ring);
  outline-offset: 2px;
}
.generator-themed-root h1:focus,
.generator-themed-root h2:focus {
  outline: none;
}
`;
