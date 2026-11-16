import { EXTRACTED_PALETTES } from "../design-tokens";
import {
  CopyVoiceId,
  GeneratorUserConfig,
  ValidatedMetric,
  VaultAsset,
} from "../schema";

export const TEST_BAKERY_VAULT_ASSETS: readonly VaultAsset[] = [
  {
    id: "bakery-hero-oven-01",
    niche: "test-bakery",
    mediaType: "image",
    visualGroupId: "vg-bakery-hearth",
    subcategories: ["bespoke-dealership", "carbon-atelier"],
    tones: ["heritage", "luxury"],
    url: "/generator/auto/hero/hero-chiaroscuro-front-01.jpg",
    aspectRatio: "16:9",
    shotScale: "extreme-wide",
    negativeSpace: "left-heavy",
    safeTextArea: {
      region: "left",
      maxCoverageRatio: 0.38,
      luminance: "dark",
    },
    heroViability: 96,
    contrastScore: 95,
    tags: ["forged-carbon", "titanium-hardware"],
    palette: EXTRACTED_PALETTES["limestone-bronze-patina"],
    partCode: "BKR-01",
    titleTemplate: "Stone deck oven in {location}",
    specMetric: {
      id: "bkr-m-01",
      kind: "charge-time",
      dimension: "time",
      label: "Cold Fermentation",
      numericValue: 36,
      unit: "h",
      displayValue: "36 h",
      contextNote: "Wild levain proof",
    },
    descriptionByVoice: {
      "technical-homologation":
        "Steam-injected stone hearth in {location} baking 180 loaves daily after 36 hours of fermentation.",
      "bespoke-collector":
        "Wood-fired stone deck in our {location} bakery producing crisp country loaves every morning.",
      "editorial-manifesto":
        "Morning bake in {location} shaped by hand and fermented for 36 hours in linen baskets.",
      "motorsport-raw":
        "High-mass stone deck oven in {location} holding steady heat for 180 daily loaves.",
    },
  },
  {
    id: "bakery-hero-counter-02",
    niche: "test-bakery",
    mediaType: "image",
    visualGroupId: "vg-bakery-counter",
    subcategories: ["bespoke-dealership", "hypercar-launch"],
    tones: ["luxury", "heritage", "technical"],
    url: "/generator/auto/hero/hero-negative-left-01.jpg",
    aspectRatio: "16:9",
    shotScale: "three-quarter",
    negativeSpace: "center-top",
    safeTextArea: {
      region: "top",
      maxCoverageRatio: 0.34,
      luminance: "dark",
    },
    heroViability: 92,
    contrastScore: 93,
    tags: ["alcantara-cockpit", "laser-optics"],
    palette: EXTRACTED_PALETTES["paper-editorial-terracotta"],
    partCode: "BKR-02",
    titleTemplate: "{brandName} morning counter",
    specMetric: {
      id: "bkr-m-02",
      kind: "mass-delta",
      dimension: "mass",
      label: "Loaf Weight",
      numericValue: 900,
      unit: "g",
      displayValue: "900 g",
      contextNote: "Standard country boule",
    },
    descriptionByVoice: {
      "technical-homologation":
        "Oak counter at {brandName} in {location} displaying 900 g sourdough loaves and rye batards.",
      "bespoke-collector":
        "Warm pastry and bread table inside our {location} bakery open from seven in the morning.",
      "editorial-manifesto":
        "Daily loaves and laminated pastries arranged on solid oak at {brandName} in {location}.",
      "motorsport-raw":
        "Direct counter service in {location} with fresh sourdough batches every two hours.",
    },
  },
  {
    id: "bakery-macro-crumb-03",
    niche: "test-bakery",
    mediaType: "image",
    visualGroupId: "vg-bakery-sourdough-loaf",
    subcategories: ["bespoke-dealership", "carbon-atelier"],
    tones: ["heritage", "technical"],
    url: "/generator/auto/macro/macro-forged-carbon.jpg",
    aspectRatio: "16:9",
    shotScale: "macro-detail",
    negativeSpace: "tight-fill",
    safeTextArea: {
      region: "none",
      maxCoverageRatio: 0.12,
      luminance: "dark",
    },
    heroViability: 24,
    contrastScore: 91,
    tags: ["forged-carbon"],
    palette: EXTRACTED_PALETTES["anodized-titanium-gold"],
    partCode: "BKR-03",
    titleTemplate: "Open sourdough crumb structure",
    specMetric: {
      id: "bkr-m-03",
      kind: "rigidity",
      dimension: "length",
      label: "Hydration Ratio",
      numericValue: 82,
      unit: "%",
      displayValue: "82 %",
      contextNote: "Organic stone-milled flour",
    },
    descriptionByVoice: {
      "technical-homologation":
        "Open crumb structure achieved with 82 percent water hydration and 36 hours of cold proofing.",
      "bespoke-collector":
        "Custard-soft interior crumb and blistered dark crust baked fresh in {location}.",
      "editorial-manifesto":
        "Slow natural fermentation yielding a tender crumb and deep roasted wheat aroma.",
      "motorsport-raw":
        "High-hydration country dough fermented for 36 hours before hearth baking in {location}.",
    },
  },
  {
    id: "bakery-macro-crust-04",
    niche: "test-bakery",
    mediaType: "image",
    visualGroupId: "vg-bakery-sourdough-loaf",
    subcategories: ["bespoke-dealership", "carbon-atelier"],
    tones: ["heritage", "luxury"],
    url: "/generator/auto/macro/macro-centerlock-nut.jpg",
    aspectRatio: "16:9",
    shotScale: "macro-detail",
    negativeSpace: "tight-fill",
    safeTextArea: {
      region: "none",
      maxCoverageRatio: 0.12,
      luminance: "dark",
    },
    heroViability: 22,
    contrastScore: 90,
    tags: ["titanium-hardware"],
    palette: EXTRACTED_PALETTES["anodized-titanium-gold"],
    partCode: "BKR-04",
    titleTemplate: "Scored country loaf crust",
    specMetric: {
      id: "bkr-m-04",
      kind: "price",
      dimension: "price",
      label: "Country Boule",
      numericValue: 12,
      unit: "USD",
      displayValue: "$12",
      contextNote: "900 g whole-grain loaf",
    },
    descriptionByVoice: {
      "technical-homologation":
        "Caramelized crust scored by hand prior to loading onto the stone deck in {location}.",
      "bespoke-collector":
        "Crisp blistered crust on our signature 900 g country loaf in {location}.",
      "editorial-manifesto":
        "Single razor score opening across the crust during the first ten minutes of steam.",
      "motorsport-raw":
        "Dark baked crust sealing moisture inside every 900 g loaf at {brandName}.",
    },
  },
  {
    id: "bakery-interior-mill-05",
    niche: "test-bakery",
    mediaType: "image",
    visualGroupId: "vg-bakery-stone-mill",
    subcategories: ["bespoke-dealership", "hypercar-launch", "carbon-atelier"],
    tones: ["heritage", "technical", "luxury"],
    url: "/generator/auto/cockpit/cockpit-pov-main.jpg",
    aspectRatio: "16:9",
    shotScale: "interior-pov",
    negativeSpace: "framed-symmetric",
    safeTextArea: {
      region: "bottom-left",
      maxCoverageRatio: 0.32,
      luminance: "dark",
    },
    heroViability: 84,
    contrastScore: 92,
    tags: ["alcantara-cockpit", "forged-carbon"],
    palette: EXTRACTED_PALETTES["hangar-mist-steel"],
    partCode: "BKR-05",
    titleTemplate: "In-house granite flour mill",
    specMetric: {
      id: "bkr-m-05",
      kind: "mass-delta",
      dimension: "mass",
      label: "Daily Flour Mill",
      numericValue: 140,
      unit: "kg",
      displayValue: "140 kg",
      contextNote: "Cold-ground heritage wheat",
    },
    descriptionByVoice: {
      "technical-homologation":
        "Granite millstones grinding 140 kg of organic regional wheat each week in {location}.",
      "bespoke-collector":
        "Freshly milled whole grain blended into every morning batch at {brandName} in {location}.",
      "editorial-manifesto":
        "Slow stone milling preserves wheat germ oils for richer flavor in our {location} loaves.",
      "motorsport-raw":
        "In-house grain mill supplying 140 kg of fresh flour for {location} daily bakes.",
    },
  },
] as const;

export function buildTestBakeryMetrics(): ValidatedMetric[] {
  return [
    {
      id: "bkr-metric-ferment",
      kind: "charge-time",
      dimension: "time",
      label: "Cold Fermentation",
      numericValue: 36,
      unit: "h",
      displayValue: "36 h",
      contextNote: "Natural wild levain",
    },
    {
      id: "bkr-metric-weight",
      kind: "mass-delta",
      dimension: "mass",
      label: "Country Loaf Weight",
      numericValue: 900,
      unit: "g",
      displayValue: "900 g",
      contextNote: "Stone-milled organic wheat",
    },
    {
      id: "bkr-metric-batch",
      kind: "power",
      dimension: "power",
      label: "Daily Hearth Output",
      numericValue: 180,
      unit: "loaves",
      displayValue: "180 loaves",
      contextNote: "Baked at 06:30 and 11:30",
    },
    {
      id: "bkr-metric-hydration",
      kind: "range",
      dimension: "length",
      label: "Dough Hydration",
      numericValue: 82,
      unit: "%",
      displayValue: "82 %",
      contextNote: "Spring water and sea salt",
    },
    {
      id: "bkr-metric-price",
      kind: "price",
      dimension: "price",
      label: "Signature Country Loaf",
      numericValue: 12,
      unit: "USD",
      displayValue: "$12",
      contextNote: "Available whole or halved",
    },
  ];
}

const BAKERY_HEADLINES: ReadonlyArray<{ formId: string; template: string }> = [
  { formId: "bkr-form-01", template: "{brandName} {modelName} in {location}" },
  { formId: "bkr-form-02", template: "36 Hour Sourdough at {brandName}" },
  { formId: "bkr-form-03", template: "Stone Hearth Bread in {location}" },
  { formId: "bkr-form-04", template: "{brandName}: 180 Loaves Daily" },
  { formId: "bkr-form-05", template: "Fresh {modelName} in {location}" },
  { formId: "bkr-form-06", template: "900 g Country Loaves at {brandName}" },
  { formId: "bkr-form-07", template: "Organic Flour Mill in {location}" },
  { formId: "bkr-form-08", template: "Visit {brandName} in {location}" },
  { formId: "bkr-form-09", template: "82 Percent Hydration {modelName}" },
  { formId: "bkr-form-10", template: "{year} {brandName} Bakery {location}" },
];

export function selectTestBakeryCopy(
  config: GeneratorUserConfig,
  _voice: CopyVoiceId
): {
  headline: string;
  headlineFormId: string;
  subheadline: string;
  manifestoQuote: string;
  ctaPrimary: string;
  ctaSecondary: string;
  specsSentence: string;
  gallerySentence: string;
  ctaSentence: string;
} {
  const seedIdx = Math.max(0, Math.abs(config.variationSeed) - 1);
  const brand = (config.brandName || "Atelier Levain").trim();
  const model = (config.modelName || "Sourdough Bakery").trim();
  const loc = (config.location || "Zurich").trim();
  const year = String(config.year || 2026);

  const fill = (tpl: string) =>
    tpl
      .replace(/\{brandName\}/g, brand)
      .replace(/\{modelName\}/g, model)
      .replace(/\{location\}/g, loc)
      .replace(/\{year\}/g, year);

  const chosen = BAKERY_HEADLINES[seedIdx % BAKERY_HEADLINES.length];

  return {
    headline: fill(chosen.template).split(/\s+/).slice(0, 6).join(" "),
    headlineFormId: chosen.formId,
    subheadline: fill(
      `Stone-milled sourdough fermented for 36 hours and baked fresh every morning at ${brand} in ${loc}.`
    ),
    manifestoQuote: fill(
      `Every 900 g loaf at ${brand} in ${loc} uses organic regional grain and 36 hours of cold fermentation.`
    ),
    ctaPrimary: "Order morning loaf",
    ctaSecondary: "View baking schedule",
    specsSentence: fill(
      `Five daily baking figures measured across our stone hearth and flour mill in ${loc}.`
    ),
    gallerySentence: fill(
      `Inside the ${brand} bakehouse in ${loc}, from granite flour milling to morning counter service.`
    ),
    ctaSentence: fill(
      `Reserve a 900 g country loaf in ${loc} starting at $12 for morning pickup.`
    ),
  };
}
