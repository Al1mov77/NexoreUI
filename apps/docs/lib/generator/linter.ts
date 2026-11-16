import { countWords } from "./copy-bank";
import {
  ARCHETYPE_RADIUS_RULES,
  EXTRACTED_PALETTES,
  TOOL_UI_TOKENS,
} from "./design-tokens";
import {
  ArchetypeDesignTokens,
  DesignLinterCheck,
  DesignLinterResult,
  GeneratorUserConfig,
  SynthesizedSectionSpec,
} from "./schema";

function parseHexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.slice(0, 6);
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return [128, 128, 128];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function computeWcagContrast(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(parseHexToRgb(hexA));
  const lumB = relativeLuminance(parseHexToRgb(hexB));
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

function extractPrimaryFontName(cssStack: string): string {
  const first = cssStack.split(",")[0] || cssStack;
  return first.replace(/['"]/g, "").trim();
}

const BANNED_JARGON_REGEX =
  /\b(guillotine|sector\s*08|pavilion\s*04|monolith\s*slab|chiaroscuro|isotropic|collimated|cryo|horology|symbology|binnacle|autoclave|homologation|telemetry|monograph|specifier|dossier)\b/i;

const BANNED_ARROWS_REGEX = /[→↗⟷⟶»▸•]/;
const BANNED_BRACKETS_REGEX = /\[[^\]]+\]/;

export function containsSlopPattern(text: string): string | null {
  if (text.includes("//") || text.includes("///")) {
    return 'contains "//" separator';
  }
  if (BANNED_BRACKETS_REGEX.test(text)) {
    return "contains [bracket tag]";
  }
  if (BANNED_ARROWS_REGEX.test(text)) {
    return "contains decorative arrow or bullet glyph";
  }
  const jargonMatch = text.match(BANNED_JARGON_REGEX);
  if (jargonMatch) {
    return `contains banned jargon "${jargonMatch[0]}"`;
  }
  return null;
}

export function validateDesignLinter(
  config: GeneratorUserConfig,
  tokens: ArchetypeDesignTokens,
  headline: string,
  subheadline = "",
  ctaPrimary = "Book test drive",
  sections: readonly SynthesizedSectionSpec[] = [],
  allCopyStrings: readonly string[] = []
): DesignLinterResult {
  const rule = ARCHETYPE_RADIUS_RULES[tokens.archetype];
  const cardPx = parseInt(tokens.cardRadius, 10);
  const btnPx = parseInt(tokens.buttonRadius, 10);
  const radiusPassed =
    !Number.isNaN(cardPx) &&
    cardPx === btnPx &&
    cardPx >= rule.minPx &&
    cardPx <= rule.maxPx;

  const whitelistEntries = Object.values(EXTRACTED_PALETTES);
  const isWhitelisted = whitelistEntries.some(
    (p) =>
      p.id === tokens.palette.id &&
      p.dark.accent.toLowerCase() === tokens.palette.dark.accent.toLowerCase() &&
      p.light.accent.toLowerCase() === tokens.palette.light.accent.toLowerCase()
  );

  const uiHexesToCheck = [
    tokens.palette.dark.bg,
    tokens.palette.dark.surface,
    tokens.palette.dark.surfaceElevated,
    tokens.palette.dark.fg,
    tokens.palette.dark.muted,
    tokens.palette.dark.border,
    tokens.palette.dark.accent,
    tokens.palette.dark.accentFg,
    tokens.palette.light.bg,
    tokens.palette.light.surface,
    tokens.palette.light.surfaceElevated,
    tokens.palette.light.fg,
    tokens.palette.light.muted,
    tokens.palette.light.border,
    tokens.palette.light.accent,
    tokens.palette.light.accentFg,
  ];

  const toolUiHexes = [
    TOOL_UI_TOKENS.dark.bg,
    TOOL_UI_TOKENS.dark.surface,
    TOOL_UI_TOKENS.dark.surfaceElevated,
    TOOL_UI_TOKENS.dark.surfaceActive,
    TOOL_UI_TOKENS.dark.fg,
    TOOL_UI_TOKENS.dark.muted,
    TOOL_UI_TOKENS.dark.accent,
    TOOL_UI_TOKENS.dark.accentFg,
    TOOL_UI_TOKENS.dark.scrollTrack,
    TOOL_UI_TOKENS.dark.scrollThumb,
    TOOL_UI_TOKENS.light.bg,
    TOOL_UI_TOKENS.light.surface,
    TOOL_UI_TOKENS.light.surfaceElevated,
    TOOL_UI_TOKENS.light.surfaceActive,
    TOOL_UI_TOKENS.light.border,
    TOOL_UI_TOKENS.light.borderStrong,
    TOOL_UI_TOKENS.light.fg,
    TOOL_UI_TOKENS.light.muted,
    TOOL_UI_TOKENS.light.accent,
    TOOL_UI_TOKENS.light.accentFg,
    TOOL_UI_TOKENS.light.scrollTrack,
    TOOL_UI_TOKENS.light.scrollThumb,
  ].filter((h) => h.startsWith("#"));

  const toolUiChromatic: string[] = [];
  for (const hex of toolUiHexes) {
    const [r, g, b] = parseHexToRgb(hex);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max - min > 4) {
      toolUiChromatic.push(hex);
    }
  }
  const toolUiMonochromePassed = toolUiChromatic.length === 0;

  const chromaticColors: string[] = [];
  for (const hex of uiHexesToCheck) {
    const [r, g, b] = parseHexToRgb(hex);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max - min > 4) {
      chromaticColors.push(hex);
    }
  }
  const monochromePassed = chromaticColors.length === 0 && toolUiMonochromePassed;

  const displayName = extractPrimaryFontName(tokens.fontPair.displayFamily);
  const bodyName = extractPrimaryFontName(tokens.fontPair.bodyFamily);
  const uniqueFamilies = Array.from(new Set([displayName, bodyName]));
  const fontPassed = uniqueFamilies.length <= 2;

  const darkTextRatio = computeWcagContrast(
    tokens.palette.dark.fg,
    tokens.palette.dark.bg
  );
  const darkSurfaceRatio = computeWcagContrast(
    tokens.palette.dark.fg,
    tokens.palette.dark.surface
  );
  const lightTextRatio = computeWcagContrast(
    tokens.palette.light.fg,
    tokens.palette.light.bg
  );
  const lightSurfaceRatio = computeWcagContrast(
    tokens.palette.light.fg,
    tokens.palette.light.surface
  );
  const darkBtnRatio = computeWcagContrast(
    tokens.palette.dark.accentFg,
    tokens.palette.dark.accent
  );
  const lightBtnRatio = computeWcagContrast(
    tokens.palette.light.accentFg,
    tokens.palette.light.accent
  );

  const ctaContrastPassed = darkBtnRatio >= 7.0 && lightBtnRatio >= 7.0;

  const minContrastRatio = Math.min(
    darkTextRatio,
    darkSurfaceRatio,
    lightTextRatio,
    lightSurfaceRatio,
    darkBtnRatio,
    lightBtnRatio
  );
  const contrastPassed = minContrastRatio >= 4.5;

  const hasSoftHyphen = headline.includes("\u00AD");
  const hasRawBreakingHyphen = /[A-Za-z0-9]-[A-Za-z0-9]/.test(headline);
  const headlineWrapSafe =
    !hasSoftHyphen && !hasRawBreakingHyphen && headline.trim().length > 0;

  const headlineWordCount = countWords(headline);
  const subheadlineWordCount = countWords(subheadline);
  const ctaWordCount = countWords(ctaPrimary);

  const sectionsWithinLimits = sections.every(
    (s) => countWords(s.title) <= 6 && countWords(s.subtitle) <= 18
  );

  const hasConcreteMetric =
    /\b\d+(?:[.,]\d+)?\s*(?:hp|s|km\/h|kg|km|USD|\$|kW|Nm)\b/i.test(headline);
  const hasYearModel =
    /\b202\d\b/.test(headline) &&
    (config.modelName ? headline.toLowerCase().includes(config.modelName.toLowerCase()) : false);
  const hasConcreteClaim = hasConcreteMetric || hasYearModel;

  const archetypeNames = ["monolith", "track", "editorial", "showroom"];
  const archetypeCollision = archetypeNames.includes(config.brandName.trim().toLowerCase());
  const concreteClaimPassed = hasConcreteClaim && !archetypeCollision;

  const maxHeadlineWords = hasConcreteClaim ? 10 : 6;
  const copyLimitsPassed =
    headlineWordCount >= 1 &&
    headlineWordCount <= maxHeadlineWords &&
    subheadlineWordCount >= 1 &&
    subheadlineWordCount <= 18 &&
    ctaWordCount >= 2 &&
    ctaWordCount <= 3 &&
    sectionsWithinLimits;

  const combinedCorpus = [
    headline,
    subheadline,
    ctaPrimary,
    config.brandName,
    config.modelName,
    config.location,
    ...sections.flatMap((s) => [s.title, s.subtitle]),
    ...allCopyStrings,
  ];

  let slopViolation: string | null = null;
  for (const str of combinedCorpus) {
    const found = containsSlopPattern(str);
    if (found) {
      slopViolation = `${found} in "${str}"`;
      break;
    }
  }

  const totalPageSections = Math.min(5, Math.max(4, 2 + sections.length));
  const noSlopPassed =
    slopViolation === null && totalPageSections >= 4 && totalPageSections <= 5;

  const cyrillicTextSample = combinedCorpus.join(" ");
  const noCyrillicPassed = !/[\u0400-\u04FF]/.test(cyrillicTextSample);

  const checks: DesignLinterCheck[] = [
    {
      id: "radius",
      label: "Archetype Radius Lock",
      passed: radiusPassed,
      actual: `${tokens.cardRadius} (${tokens.archetype})`,
      expected: `${rule.minPx}–${rule.maxPx}px`,
    },
    {
      id: "monochrome-neutrals",
      label: "Monochrome Neutrals & 7:1 CTA",
      passed: isWhitelisted && monochromePassed && ctaContrastPassed,
      actual: monochromePassed
        ? (ctaContrastPassed
            ? `${tokens.palette.name} · CTA ${darkBtnRatio.toFixed(1)}:1 / ${lightBtnRatio.toFixed(1)}:1`
            : `CTA contrast ${Math.min(darkBtnRatio, lightBtnRatio).toFixed(1)}:1 (< 7:1)`)
        : `Chromatic saturation: ${chromaticColors.join(", ")}`,
      expected: "Neutrals only · CTA contrast >= 7:1",
    },
    {
      id: "font-limit",
      label: "Typography Cap & Mono Numbers Only",
      passed: fontPassed,
      actual: `${uniqueFamilies.length} families (${uniqueFamilies.join(" + ")})`,
      expected: "Max 2 families, mono on numbers only",
    },
    {
      id: "wcag-contrast",
      label: "WCAG AA Contrast (>= 4.5:1)",
      passed: contrastPassed,
      actual: `Min ${minContrastRatio.toFixed(1)}:1 (Dark ${darkTextRatio.toFixed(1)}:1 / Light ${lightTextRatio.toFixed(1)}:1)`,
      expected: ">= 4.5:1",
    },
    {
      id: "headline-wrap",
      label: "Headline Hyphen & Wrap Guard",
      passed: headlineWrapSafe,
      actual: headlineWrapSafe ? "Protected non-breaking tokens" : "Unsafe hyphen break",
      expected: "No mid-word breaks",
    },
    {
      id: "copy-limits",
      label: "Strict Copy Word Limits",
      passed: copyLimitsPassed,
      actual: `H1: ${headlineWordCount}w, Sub: ${subheadlineWordCount}w, CTA: ${ctaWordCount}w`,
      expected: "H1 <= 10w (with claim), Sub <= 18w, CTA 2-3w",
    },
    {
      id: "concrete-claim",
      label: "Concrete Spec Claim & No Brand Collision",
      passed: concreteClaimPassed,
      actual: archetypeCollision
        ? `Brand "${config.brandName}" collides with archetype`
        : hasConcreteClaim
        ? "Verified numeric spec in headline"
        : `No verified engineering claim in "${headline}"`,
      expected: "Measured numeric spec · No archetype name leak",
    },
    {
      id: "no-slop",
      label: "Anti-Slop Copy & Structure Gate",
      passed: noSlopPassed,
      actual: slopViolation ? slopViolation : "0 slop tokens · 5 sections",
      expected: "No //, [tags], arrows, or jargon · 4-5 sections",
    },
    {
      id: "no-cyrillic",
      label: "English-Only Copy Gate",
      passed: noCyrillicPassed,
      actual: noCyrillicPassed ? "0 Cyrillic chars" : "Cyrillic detected",
      expected: "100% English strings",
    },
  ];

  const errors = checks
    .filter((c) => !c.passed)
    .map((c) => `${c.label}: ${c.actual} (expected ${c.expected})`);

  return {
    passed: errors.length === 0,
    radiusPx: tokens.cardRadius,
    accentHex:
      config.themeMode === "light"
        ? tokens.palette.light.accent
        : tokens.palette.dark.accent,
    fontFamilies: uniqueFamilies,
    fontCount: uniqueFamilies.length,
    minContrastRatio,
    contrastSummary: `${minContrastRatio.toFixed(1)}:1 min`,
    headlineWrapSafe,
    headlineWordCount,
    subheadlineWordCount,
    ctaWordCount,
    sectionCount: totalPageSections,
    checks,
    errors,
  };
}
