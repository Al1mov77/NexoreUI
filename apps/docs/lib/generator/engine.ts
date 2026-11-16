import {
  AUTO_COCKPIT_PACK,
  AUTO_MORPH_PACK,
  AUTO_ORBIT_PACK,
  AUTO_SUBCATEGORY_PRESETS,
  AUTO_VAULT_ASSETS,
  buildBriefCockpitPack,
  buildBriefMorphPack,
  buildBriefOrbitPack,
} from "./catalog-auto";
import {
  interpolateText,
  selectBlueprintSectionCopy,
  selectCopyBundle,
  validateAndBuildVehicleMetrics,
  VOICE_LABELS,
} from "./copy-bank";
import {
  ARCHETYPE_NEUTRAL_FAMILY_MAP,
  ARCHETYPE_RADIUS_RULES,
  ARCHETYPE_SECTION_ORDER,
  FONT_PAIRS,
  getAllowedArchetypesForNiche,
  HERO_VARIANTS_BY_ARCHETYPE,
  isArchetypeAllowedForNiche,
  MOTION_PERSONALITIES,
  snapToWhitelistPalette,
} from "./design-tokens";
import { buildExportBundle } from "./export-engine";
import { validateDesignLinter } from "./linter";
import {
  buildTestBakeryMetrics,
  selectTestBakeryCopy,
  TEST_BAKERY_VAULT_ASSETS,
} from "./niches/test-bakery";
import {
  ArchetypeDesignTokens,
  ArchetypeId,
  AutoSubcategoryId,
  CopyVoiceId,
  FontPairId,
  GeneratorUserConfig,
  HeroVariantId,
  ScoreBreakdown,
  ScoredAsset,
  SectionKind,
  ShotScale,
  SynthesizedLandingPayload,
  SynthesizedSectionSpec,
  TimelineChapter,
  VaultAsset,
} from "./schema";

const ARCHETYPE_ORDER: readonly ArchetypeId[] = [
  "monolith",
  "track",
  "editorial",
  "showroom",
];

const ARCHETYPE_LABELS: Readonly<Record<ArchetypeId, string>> = {
  monolith: "Monolith",
  track: "Track",
  editorial: "Editorial",
  showroom: "Showroom",
};

const FONT_PAIR_KEYS: readonly FontPairId[] = [
  "syne-jakarta",
  "space-ibm",
  "cormorant-instrument",
  "oswald-inter",
  "unbounded-manrope",
  "playfair-jakarta",
  "chakra-archivo",
  "fraunces-work",
  "archivo-inter",
  "jetbrains-inter",
];

const VOICE_ORDER: readonly CopyVoiceId[] = [
  "technical-homologation",
  "motorsport-raw",
  "editorial-manifesto",
  "bespoke-collector",
];

const SECTION_SLOT_ROLE: Readonly<Record<SectionKind, "specs" | "gallery" | "cta">> = {
  "section-spec-ledger": "specs",
  "section-state-morph": "specs",
  "section-horizontal-strip": "gallery",
  "section-asymmetric-dossier": "gallery",
  "section-orbit-360": "gallery",
  "section-cockpit-pov": "gallery",
  "section-editorial-timeline": "gallery",
  "section-trim-builder": "cta",
};

function orderBlueprintBySectionOrder(
  blueprint: readonly SectionKind[],
  sectionOrder: readonly string[]
): SectionKind[] {
  return [...blueprint].sort((a, b) => {
    const slotA = SECTION_SLOT_ROLE[a];
    const slotB = SECTION_SLOT_ROLE[b];
    const idxA = sectionOrder.indexOf(slotA);
    const idxB = sectionOrder.indexOf(slotB);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });
}

function selectSemanticAssetsForSection(
  kind: SectionKind,
  candidates: readonly VaultAsset[],
  config: GeneratorUserConfig,
  usedUrls: Set<string>,
  usedGroups: Set<string>,
  targetCount: number,
  preferredScalesBySlot?: readonly (readonly ShotScale[])[]
): ScoredAsset[] {
  const chosen: ScoredAsset[] = [];
  for (let slot = 0; slot < targetCount; slot++) {
    const slotPreferredScales = preferredScalesBySlot?.[slot];
    let best: ScoredAsset | null = null;
    for (const asset of candidates) {
      if (asset.contains_logo) continue;
      if (usedUrls.has(asset.url) || usedGroups.has(asset.visualGroupId)) continue;

      let total = asset.contrastScore * 0.4 + asset.heroViability * 0.25;
      const reasons: string[] = [];

      const subMatch = asset.subcategories.includes(config.subcategory) ? 18 : 0;
      total += subMatch;
      const toneMatch = asset.tones.includes(config.tone) ? 15 : 0;
      total += toneMatch;
      const tagMatches = config.focusTags.filter((t) => asset.tags.includes(t)).length;
      const tagScore = tagMatches * 16;
      total += tagScore;

      if (kind === "section-horizontal-strip") {
        if (asset.shotScale === "macro-detail") {
          total += 45;
          reasons.push("+45 Macro hardware study");
        }
        if (tagMatches > 0) {
          total += tagMatches * 14;
          reasons.push(`+${tagMatches * 14} Engineering focus match`);
        }
      } else if (kind === "section-asymmetric-dossier") {
        if (
          asset.shotScale === "three-quarter" ||
          asset.shotScale === "rear-stance" ||
          asset.shotScale === "profile" ||
          asset.shotScale === "overhead"
        ) {
          total += 22;
        }
      } else if (slotPreferredScales && slotPreferredScales.includes(asset.shotScale)) {
        total += 36;
        reasons.push(`+36 Narrative arc fit (${asset.shotScale})`);
      }

      const seedOffset = Math.round(
        deterministicHash(`${kind}-${asset.id}-${slot}`, config.variationSeed) * 18
      );
      total += seedOffset;

      const candidate: ScoredAsset = {
        asset,
        score: {
          baseQuality: Math.round(asset.contrastScore * 0.4 + asset.heroViability * 0.25),
          subcategoryMatch: subMatch,
          toneMatch,
          tagMatch: tagScore,
          compositionFit: 0,
          scaleDiversityDelta: slotPreferredScales?.includes(asset.shotScale) ? 36 : 0,
          seedOffset,
          total: Math.round(total),
          reasons,
        },
      };

      if (!best || candidate.score.total > best.score.total) {
        best = candidate;
      }
    }
    if (!best) break;
    chosen.push(best);
    usedUrls.add(best.asset.url);
    usedGroups.add(best.asset.visualGroupId);
  }
  return chosen;
}

const SECTION_BLUEPRINTS_BY_ARCHETYPE: Readonly<
  Record<ArchetypeId, readonly (readonly SectionKind[])[]>
> = {
  monolith: [
    [
      "section-asymmetric-dossier",
      "section-spec-ledger",
      "section-trim-builder",
    ],
    [
      "section-cockpit-pov",
      "section-editorial-timeline",
      "section-spec-ledger",
    ],
    [
      "section-orbit-360",
      "section-horizontal-strip",
      "section-trim-builder",
    ],
  ],
  track: [
    [
      "section-state-morph",
      "section-spec-ledger",
      "section-horizontal-strip",
    ],
    [
      "section-spec-ledger",
      "section-cockpit-pov",
      "section-state-morph",
    ],
    [
      "section-orbit-360",
      "section-spec-ledger",
      "section-asymmetric-dossier",
    ],
  ],
  editorial: [
    [
      "section-editorial-timeline",
      "section-asymmetric-dossier",
      "section-cockpit-pov",
    ],
    [
      "section-asymmetric-dossier",
      "section-editorial-timeline",
      "section-trim-builder",
    ],
    [
      "section-horizontal-strip",
      "section-asymmetric-dossier",
      "section-orbit-360",
    ],
  ],
  showroom: [
    [
      "section-trim-builder",
      "section-orbit-360",
      "section-spec-ledger",
    ],
    [
      "section-cockpit-pov",
      "section-state-morph",
      "section-trim-builder",
    ],
    [
      "section-orbit-360",
      "section-asymmetric-dossier",
      "section-trim-builder",
    ],
  ],
};

const DARK_HERO_ROTATION: readonly string[] = [
  "vid-f3c98adc",
  "66x8th66x8th66x8",
  "vid-482d1587",
  "4hi6kp4hi6kp4hi6",
  "dqq90cdqq90cdqq9",
  "hero-negative-left-01",
  "vault-rain-hypercar-spray-motion-01",
  "yv2rxjyv2rxjyv2r",
  "dzn8nqdzn8nqdzn8",
  "vid-f0555e7d",
];

const LIGHT_HERO_ROTATION: readonly string[] = [
  "1syitu1syitu1syi",
  "ekm96gekm96gekm9",
  "f36hc2f36hc2f36h",
  "73xqeu73xqeu73xq",
  "k989dlk989dlk989",
  "i366fbi366fbi366",
  "y927cqy927cqy927",
  "8zk6828zk6828zk6",
  "vault-plinth-side-profile-01",
  "5aa22r5aa22r5aa2",
];

function deterministicHash(input: string, seed: number): number {
  let h = 2166136261 ^ (seed * 16777619);
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function createDefaultConfig(
  subcategory: AutoSubcategoryId = "hypercar-launch",
  seed: number = 1,
  themeMode?: "light" | "dark"
): GeneratorUserConfig {
  const preset = AUTO_SUBCATEGORY_PRESETS[subcategory];
  const autoTheme: "light" | "dark" = seed % 2 === 0 ? "light" : "dark";
  return {
    niche: "auto",
    subcategory,
    tone: preset.defaultTone,
    brandName: preset.defaultBrandName,
    modelName: preset.defaultModelName,
    chassisCode: preset.defaultChassisCode,
    location: preset.defaultLocation,
    year: 2026,
    focusTags: [...preset.defaultFocusTags],
    forcedArchetype: "auto",
    themeMode: themeMode || autoTheme,
    speedMode: "studio",
    showXRayScoring: false,
    variationSeed: seed,
    customMetrics: { ...preset.defaultCustomMetrics },
  };
}

function resolveArchetypeAndVariant(config: GeneratorUserConfig): {
  archetype: ArchetypeId;
  heroVariant: HeroVariantId;
  heroVariantLabel: string;
  fontPairId: FontPairId;
  voice: CopyVoiceId;
} {
  const seedIndex = Math.max(0, Math.abs(config.variationSeed) - 1);
  const allowedArchetypes = getAllowedArchetypesForNiche(config.niche);

  const archetype: ArchetypeId =
    config.forcedArchetype !== "auto" &&
    isArchetypeAllowedForNiche(config.forcedArchetype, config.niche)
      ? config.forcedArchetype
      : allowedArchetypes[seedIndex % allowedArchetypes.length];

  const occurrenceIdx = Math.floor(seedIndex / allowedArchetypes.length);
  const variants = HERO_VARIANTS_BY_ARCHETYPE[archetype];
  const variantIdx = occurrenceIdx % variants.length;
  const chosenVariant = variants[variantIdx];

  const compatibleFonts = FONT_PAIR_KEYS.filter((fKey) =>
    FONT_PAIRS[fKey].archetypes.includes(archetype)
  );
  const fontPairId =
    compatibleFonts.length > 0
      ? compatibleFonts[occurrenceIdx % compatibleFonts.length]
      : FONT_PAIR_KEYS[seedIndex % FONT_PAIR_KEYS.length];

  const voice = VOICE_ORDER[seedIndex % VOICE_ORDER.length];

  return {
    archetype,
    heroVariant: chosenVariant.id,
    heroVariantLabel: chosenVariant.label,
    fontPairId,
    voice,
  };
}

function scoreHeroCandidate(
  asset: VaultAsset,
  config: GeneratorUserConfig,
  heroVariant: HeroVariantId,
  preferredHeroId: string
): ScoredAsset {
  if (asset.contains_logo) {
    return {
      asset,
      score: {
        baseQuality: 0,
        subcategoryMatch: 0,
        toneMatch: 0,
        tagMatch: 0,
        compositionFit: 0,
        scaleDiversityDelta: 0,
        seedOffset: 0,
        total: -9999,
        reasons: ["Blocked: Contains trademark logo/badge"],
      },
    };
  }

  const reasons: string[] = [];
  const baseQuality = asset.heroViability;

  if (baseQuality >= 85) {
    reasons.push(`+${baseQuality} Wide 16:9 Hero Viability`);
  } else {
    reasons.push(`${baseQuality} Macro/Close-up Penalty (Not Hero Frame)`);
  }

  let subcategoryMatch = 0;
  if (asset.subcategories.includes(config.subcategory)) {
    subcategoryMatch = 22;
    reasons.push(`+22 Subcategory Fit (${config.subcategory})`);
  }

  let toneMatch = 0;
  if (asset.tones.includes(config.tone)) {
    toneMatch = 18;
    reasons.push(`+18 Tone Fit (${config.tone})`);
  }

  let tagMatch = 0;
  const matchedTags: string[] = [];
  for (const tag of config.focusTags) {
    if (asset.tags.includes(tag)) {
      tagMatch += 12;
      matchedTags.push(`#${tag}`);
    }
  }
  if (matchedTags.length > 0) {
    reasons.push(`+${tagMatch} Tag Match (${matchedTags.join(", ")})`);
  }

  let compositionFit = 0;
  if (
    heroVariant === "overhead-aero-windtunnel" &&
    asset.shotScale === "overhead"
  ) {
    compositionFit = 38;
    reasons.push("+38 Overhead Wind-Tunnel Geometry Match");
  } else if (
    heroVariant === "cockpit-first-immersion" &&
    asset.shotScale === "interior-pov"
  ) {
    compositionFit = 38;
    reasons.push("+38 First-Person Cockpit Immersion Match");
  } else if (
    (heroVariant === "fullbleed-left-slab" ||
      heroVariant === "magazine-spread-overlap") &&
    asset.negativeSpace === "left-heavy"
  ) {
    compositionFit = 26;
    reasons.push("+26 Left Negative Space for Asymmetric Headline");
  } else if (asset.negativeSpace === "center-top") {
    compositionFit = 16;
    reasons.push("+16 Upper Negative Space Clearance");
  }

  let seedOffset = Math.round(
    deterministicHash(asset.id, config.variationSeed) * 14
  );
  if (asset.id === preferredHeroId && asset.heroViability >= 80) {
    seedOffset += 110;
    reasons.push(
      `+110 Seed #${config.variationSeed} Primary Camera Angle Allocation`
    );
  }

  let tonalFit = 0;
  const isDarkTheme = config.themeMode === "dark";
  const isDarkAsset = asset.safeTextArea.luminance === "dark";
  if ((isDarkTheme && isDarkAsset) || (!isDarkTheme && !isDarkAsset)) {
    tonalFit = 30;
    reasons.push(
      `+30 Tonal Fit (${isDarkTheme ? "Dark asset on dark surface" : "High-key asset on light surface"})`
    );
  } else {
    tonalFit = -20;
    reasons.push(
      `-20 Tonal Penalty (${isDarkTheme ? "Bright asset on dark surface" : "Dark asset on light surface"})`
    );
  }

  reasons.push(
    `Palette: ${asset.palette.name} (${asset.palette.dominantHex})`
  );

  const total =
    baseQuality +
    subcategoryMatch +
    toneMatch +
    tagMatch +
    compositionFit +
    seedOffset +
    tonalFit;

  return {
    asset,
    score: {
      baseQuality,
      subcategoryMatch,
      toneMatch,
      tagMatch,
      compositionFit,
      scaleDiversityDelta: 0,
      seedOffset,
      total,
      reasons,
    },
  };
}

function scoreFeatureCandidatesWithDiversity(
  assets: readonly VaultAsset[],
  config: GeneratorUserConfig,
  excludedUrls: Set<string>,
  excludedVisualGroups: Set<string>
): ScoredAsset[] {
  const remaining = assets.filter(
    (a) =>
      !a.contains_logo &&
      a.mediaType !== "video" &&
      !excludedUrls.has(a.url) &&
      !excludedVisualGroups.has(a.visualGroupId)
  );
  const selected: ScoredAsset[] = [];
  const usedScales: ShotScale[] = [];

  const targetCount = Math.min(14, remaining.length);
  while (selected.length < targetCount && selected.length < remaining.length) {
    const lastScale =
      usedScales.length > 0 ? usedScales[usedScales.length - 1] : null;

    let bestCandidate: ScoredAsset | null = null;

    for (const asset of remaining) {
      if (
        selected.some(
          (s) =>
            s.asset.id === asset.id ||
            s.asset.visualGroupId === asset.visualGroupId
        )
      ) {
        continue;
      }

      const reasons: string[] = [];
      const baseQuality = Math.round(asset.contrastScore * 0.6);
      reasons.push(`+${baseQuality} Contrast & Optical Sharpness`);

      let subcategoryMatch = 0;
      if (asset.subcategories.includes(config.subcategory)) {
        subcategoryMatch = 20;
        reasons.push(`+20 Subcategory Fit`);
      }

      let toneMatch = 0;
      if (asset.tones.includes(config.tone)) {
        toneMatch = 15;
        reasons.push(`+15 Tone Alignment (${config.tone})`);
      }

      let tagMatch = 0;
      const matched: string[] = [];
      for (const tag of config.focusTags) {
        if (asset.tags.includes(tag)) {
          tagMatch += 24;
          matched.push(`#${tag}`);
        }
      }
      if (matched.length > 0) {
        reasons.push(`+${tagMatch} Matched ${matched.join(", ")}`);
      }

      let compositionFit = 0;
      if (asset.shotScale === "macro-detail") {
        compositionFit = 22;
        reasons.push("+22 High-Detail Engineering Macro");
      } else if (asset.shotScale === "interior-pov") {
        compositionFit = 18;
        reasons.push("+18 Cabin Materiality Perspective");
      }

      let scaleDiversityDelta = 0;
      if (lastScale && asset.shotScale === lastScale) {
        scaleDiversityDelta = -18;
        reasons.push(`-18 Consecutive '${lastScale}' Scale Penalty`);
      } else if (lastScale && asset.shotScale !== lastScale) {
        scaleDiversityDelta = 16;
        reasons.push(
          `+16 Shot-Scale Contrast (${lastScale} vs ${asset.shotScale})`
        );
      }

      const seedOffset = Math.round(
        deterministicHash(
          `${asset.id}-slot-${selected.length}`,
          config.variationSeed
        ) * 25
      );

      const total =
        baseQuality +
        subcategoryMatch +
        toneMatch +
        tagMatch +
        compositionFit +
        scaleDiversityDelta +
        seedOffset;

      const scored: ScoredAsset = {
        asset,
        score: {
          baseQuality,
          subcategoryMatch,
          toneMatch,
          tagMatch,
          compositionFit,
          scaleDiversityDelta,
          seedOffset,
          total,
          reasons,
        },
      };

      if (!bestCandidate || scored.score.total > bestCandidate.score.total) {
        bestCandidate = scored;
      }
    }

    if (bestCandidate) {
      selected.push(bestCandidate);
      usedScales.push(bestCandidate.asset.shotScale);
    } else {
      break;
    }
  }

  return selected;
}

export function synthesizeLanding(
  config: GeneratorUserConfig
): SynthesizedLandingPayload {
  const seedIndex = Math.max(0, Math.abs(config.variationSeed) - 1);
  const { archetype, heroVariant, heroVariantLabel, fontPairId, voice } =
    resolveArchetypeAndVariant(config);

  const vaultAssets =
    config.niche === "test-bakery" ? TEST_BAKERY_VAULT_ASSETS : AUTO_VAULT_ASSETS;

  const widePool =
    config.niche === "test-bakery"
      ? vaultAssets.filter((a) => a.heroViability >= 80).map((a) => a.id)
      : config.themeMode === "light"
        ? LIGHT_HERO_ROTATION
        : DARK_HERO_ROTATION;

  const preferredHeroId = widePool[seedIndex % widePool.length];

  const allScoredForHero = vaultAssets
    .map((asset) =>
      scoreHeroCandidate(asset, config, heroVariant, preferredHeroId)
    )
    .sort((a, b) => b.score.total - a.score.total);

  const overriddenHero = config.heroOverrideId
    ? allScoredForHero.find((item) => item.asset.id === config.heroOverrideId)
    : undefined;

  const heroAsset = overriddenHero || allScoredForHero[0];
  const usedUrls = new Set<string>([heroAsset.asset.url]);
  const usedVisualGroups = new Set<string>([heroAsset.asset.visualGroupId]);

  const secondaryCandidates = allScoredForHero.filter(
    (item) =>
      !usedUrls.has(item.asset.url) &&
      !usedVisualGroups.has(item.asset.visualGroupId) &&
      item.asset.shotScale !== heroAsset.asset.shotScale
  );
  const secondaryHeroAsset =
    secondaryCandidates[0] || allScoredForHero[1] || heroAsset;

  if (vaultAssets.length > 6) {
    usedUrls.add(secondaryHeroAsset.asset.url);
    usedVisualGroups.add(secondaryHeroAsset.asset.visualGroupId);
  }

  const isBakery = config.niche === "test-bakery";
  const sectionOrder = ARCHETYPE_SECTION_ORDER[archetype];
  const blueprints = SECTION_BLUEPRINTS_BY_ARCHETYPE[archetype];
  const chosenBlueprint = orderBlueprintBySectionOrder(
    blueprints[seedIndex % blueprints.length],
    sectionOrder
  );

  const orbitPack = isBakery ? AUTO_ORBIT_PACK : buildBriefOrbitPack(config);
  const morphPack = isBakery ? AUTO_MORPH_PACK : buildBriefMorphPack(config);
  const cockpitPack = isBakery ? AUTO_COCKPIT_PACK : buildBriefCockpitPack(config);

  const featureUsedUrls = new Set<string>(usedUrls);
  const featureUsedGroups = new Set<string>(usedVisualGroups);

  if (!isBakery && vaultAssets.length > 10) {
    const packUrls: string[] = [
      ...orbitPack.frames.map((f) => f.url),
      morphPack.stateAFrontUrl,
      morphPack.stateBFrontUrl,
      morphPack.stateBRearUrl,
      morphPack.stateBBrakeUrl,
      cockpitPack.mainPovUrl,
      ...cockpitPack.hotspots.map((h) => h.detailAssetUrl),
    ];
    for (const url of packUrls) {
      featureUsedUrls.add(url);
      const match = vaultAssets.find((a) => a.url === url);
      if (match) {
        featureUsedGroups.add(match.visualGroupId);
      }
    }
  }

  const featureAssets = scoreFeatureCandidatesWithDiversity(
    vaultAssets,
    config,
    featureUsedUrls,
    featureUsedGroups
  );

  const uniqueVisualGroupsCount = new Set(
    vaultAssets.map((a) => a.visualGroupId)
  ).size;
  const thinLibraryNotice =
    featureAssets.length < 4 || uniqueVisualGroupsCount < 6
      ? `Thin library notice: ${vaultAssets.length} assets in vault (${uniqueVisualGroupsCount} unique visual groups); gallery reduced to ${featureAssets.length} unique frames with 0 duplicate subjects.`
      : undefined;

  const eliminatedCandidates = allScoredForHero.slice(-6);

  const extractedPalette =
    ARCHETYPE_NEUTRAL_FAMILY_MAP[archetype] ||
    snapToWhitelistPalette(heroAsset.asset.palette.dominantHex);
  const fontPair = FONT_PAIRS[fontPairId];
  const motion = MOTION_PERSONALITIES[archetype];

  const gridStyleMap: Record<
    ArchetypeId,
    ArchetypeDesignTokens["gridStyle"]
  > = {
    monolith: "hairline-brutal",
    track: "technical-matrix",
    editorial: "editorial-columns",
    showroom: "architectural-bento",
  };

  const padYMap: Record<ArchetypeId, string> = {
    monolith: "py-24",
    track: "py-16",
    editorial: "py-28",
    showroom: "py-20",
  };

  const lockedRadius = ARCHETYPE_RADIUS_RULES[archetype].canonical;

  const tokens: ArchetypeDesignTokens = {
    archetype,
    archetypeLabel: ARCHETYPE_LABELS[archetype],
    heroVariant,
    heroVariantLabel,
    fontPair,
    palette: extractedPalette,
    voice,
    voiceLabel: VOICE_LABELS[voice],
    motion,
    cardRadius: lockedRadius,
    buttonRadius: lockedRadius,
    sectionPaddingY: padYMap[archetype],
    gridStyle: gridStyleMap[archetype],
    sectionOrder,
  };

  const validatedMetrics = isBakery
    ? buildTestBakeryMetrics()
    : validateAndBuildVehicleMetrics(config);
  const bakeryCopy = isBakery ? selectTestBakeryCopy(config, voice) : null;
  const copyBundle = bakeryCopy || selectCopyBundle(config, voice);

  const sectionAssignedUrls = new Set<string>(featureUsedUrls);
  const sectionAssignedGroups = new Set<string>(featureUsedGroups);
  const isThinVault = vaultAssets.length < 10;

  let timelineSourceAssets: ScoredAsset[] = featureAssets.slice(0, 3);

  const sections: SynthesizedSectionSpec[] = chosenBlueprint.map((kind) => {
    const meta = selectBlueprintSectionCopy(kind, config, archetype, isBakery);
    let primaryAssets: ScoredAsset[];

    if (isThinVault) {
      primaryAssets = featureAssets.slice(0, Math.min(4, featureAssets.length));
    } else if (kind === "section-editorial-timeline") {
      const semanticChapters = selectSemanticAssetsForSection(
        kind,
        vaultAssets,
        config,
        sectionAssignedUrls,
        sectionAssignedGroups,
        3,
        [
          ["extreme-wide", "three-quarter"],
          ["macro-detail", "profile", "overhead"],
          ["interior-pov", "rear-stance"],
        ]
      );
      primaryAssets =
        semanticChapters.length >= 2
          ? semanticChapters
          : featureAssets.slice(0, Math.min(3, featureAssets.length));
      timelineSourceAssets = primaryAssets;
    } else if (kind === "section-horizontal-strip") {
      const stripAssets = selectSemanticAssetsForSection(
        kind,
        vaultAssets,
        config,
        sectionAssignedUrls,
        sectionAssignedGroups,
        4
      );
      primaryAssets =
        stripAssets.length >= 2
          ? stripAssets
          : featureAssets.slice(0, Math.min(4, featureAssets.length));
    } else if (kind === "section-asymmetric-dossier") {
      const galleryAssets = selectSemanticAssetsForSection(
        kind,
        vaultAssets,
        config,
        sectionAssignedUrls,
        sectionAssignedGroups,
        4
      );
      primaryAssets =
        galleryAssets.length >= 2
          ? galleryAssets
          : featureAssets.slice(0, Math.min(4, featureAssets.length));
    } else {
      const fallbackAssets = selectSemanticAssetsForSection(
        kind,
        vaultAssets,
        config,
        sectionAssignedUrls,
        sectionAssignedGroups,
        2
      );
      primaryAssets =
        fallbackAssets.length > 0
          ? fallbackAssets
          : featureAssets.slice(0, Math.min(2, featureAssets.length));
    }

    return {
      kind,
      code: meta.code,
      title: meta.title,
      subtitle: meta.subtitle,
      primaryAssets,
    };
  });

  const timelineCrops: readonly ("16:9" | "4:5" | "21:9")[] = [
    "16:9",
    "4:5",
    "21:9",
  ];
  const timelineChapters: TimelineChapter[] = timelineSourceAssets
    .slice(0, 3)
    .map((scored, idx) => ({
      index: `0${idx + 1}`,
      phaseCode: scored.asset.partCode,
      title: interpolateText(scored.asset.titleTemplate, config),
      body: interpolateText(scored.asset.descriptionByVoice[voice], config),
      asset: scored,
      cropAspect: timelineCrops[idx % timelineCrops.length],
    }));

  const allCopyStrings = [
    copyBundle.manifestoQuote,
    copyBundle.ctaSecondary,
    ...timelineChapters.flatMap((c) => [c.title, c.body]),
    ...validatedMetrics.flatMap((m) => [m.label, m.displayValue, m.contextNote]),
  ];

  const linter = validateDesignLinter(
    config,
    tokens,
    copyBundle.headline,
    copyBundle.subheadline,
    copyBundle.ctaPrimary,
    sections,
    allCopyStrings
  );

  return {
    config,
    tokens,
    heroAsset,
    secondaryHeroAsset,
    allScoredCandidates: allScoredForHero,
    eliminatedCandidates,
    featureAssets,
    timelineChapters,
    sections,
    sectionOrder,
    validatedMetrics,
    headline: copyBundle.headline,
    headlineFormId: copyBundle.headlineFormId,
    subheadline: copyBundle.subheadline,
    manifestoQuote: copyBundle.manifestoQuote,
    ctaPrimary: copyBundle.ctaPrimary,
    ctaSecondary: copyBundle.ctaSecondary,
    thinLibraryNotice,
    orbitPack,
    morphPack,
    cockpitPack,
    linter,
  };
}

export function generateExportTsxCode(
  payload: SynthesizedLandingPayload
): string {
  return buildExportBundle(payload).reactTsx;
}
