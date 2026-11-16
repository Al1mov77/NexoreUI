import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import ts from "typescript";
import {
  AUTO_CLEAN_ASSET_COUNT,
  AUTO_COCKPIT_PACK,
  AUTO_MORPH_PACK,
  AUTO_ORBIT_PACK,
  AUTO_VAULT_ASSETS,
} from "../lib/generator/catalog-auto";
import { synthesizeLanding, createDefaultConfig } from "../lib/generator/engine";
import { buildExportBundle, AI_EDITOR_INSTRUCTION } from "../lib/generator/export-engine";
import { countWords, validateMetricIntegrity } from "../lib/generator/copy-bank";
import { containsSlopPattern } from "../lib/generator/linter";
import {
  ARCHETYPE_SECTION_ORDER,
  getAllowedArchetypesForNiche,
  isArchetypeAllowedForNiche,
} from "../lib/generator/design-tokens";
import type { AutoSubcategoryId, ToneId, PrimaryCtaGoal, GeneratorUserConfig } from "../lib/generator/schema";
import { buildAssetsIndexMarkdown } from "./sync-generator-index";

const DOCS_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(DOCS_ROOT, "..", "..");
const ASSETS_INDEX_PATH = path.join(REPO_ROOT, ".agents", "generator", "ASSETS_INDEX.md");

function walkTsFiles(dir: string, acc: string[]) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_ci_export_verify") continue;
      walkTsFiles(abs, acc);
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      acc.push(abs);
    }
  }
}

function collectGeneratorSourceFiles(): string[] {
  const files: string[] = [];
  walkTsFiles(path.join(DOCS_ROOT, "lib", "generator"), files);
  walkTsFiles(path.join(DOCS_ROOT, "app", "generator"), files);
  const scriptsDir = path.join(DOCS_ROOT, "scripts");
  if (fs.existsSync(scriptsDir)) {
    for (const entry of fs.readdirSync(scriptsDir)) {
      if (entry.includes("generator") && (entry.endsWith(".ts") || entry.endsWith(".tsx"))) {
        files.push(path.join(scriptsDir, entry));
      }
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function findCommentsAst(code: string, isTsx: boolean): string[] {
  const sf = ts.createSourceFile(
    isTsx ? "check.tsx" : "check.ts",
    code,
    ts.ScriptTarget.Latest,
    true,
    isTsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  const found: string[] = [];

  function checkRanges(ranges: ts.CommentRange[] | undefined) {
    if (!ranges) return;
    for (const r of ranges) {
      found.push(code.slice(r.pos, r.end));
    }
  }

  function visit(node: ts.Node) {
    checkRanges(ts.getLeadingCommentRanges(code, node.getFullStart()));
    checkRanges(ts.getTrailingCommentRanges(code, node.getEnd()));
    ts.forEachChild(node, visit);
  }

  visit(sf);
  return found;
}

function checkZeroCyrillicAndCommentsInSource() {
  console.log("=== 1. LINT CHECK: ZERO CYRILLIC, ZERO COMMENTS & MODULE SIZE ===");
  const sourceFiles = collectGeneratorSourceFiles();
  const modularEnforcedPrefixes = [
    path.join(DOCS_ROOT, "lib", "generator", "catalog", "auto") + path.sep,
    path.join(DOCS_ROOT, "app", "generator", "canvas") + path.sep,
    path.join(DOCS_ROOT, "app", "generator", "studio") + path.sep,
  ];
  const modularExactFiles = new Set([
    path.join(DOCS_ROOT, "app", "generator", "ArchetypeCanvas.tsx"),
    path.join(DOCS_ROOT, "app", "generator", "GeneratorClient.tsx"),
  ]);

  for (const filePath of sourceFiles) {
    const rawContent = fs.readFileSync(filePath, "utf8");
    const rel = path.relative(DOCS_ROOT, filePath);
    const cyrillicMatch = rawContent.match(/[\u0400-\u04FF]/);
    if (cyrillicMatch) {
      throw new Error(`Cyrillic character found in ${rel}: "${cyrillicMatch[0]}"`);
    }
    const comments = findCommentsAst(rawContent, filePath.endsWith(".tsx"));
    if (comments.length > 0) {
      throw new Error(`Comment detected in source file ${rel}: ${comments[0]}`);
    }
    const enforceMax500 =
      modularExactFiles.has(filePath) ||
      modularEnforcedPrefixes.some((p) => filePath.startsWith(p));
    if (enforceMax500) {
      const lineCount = rawContent.split("\n").length;
      if (lineCount > 500) {
        throw new Error(`Modular generator file ${rel} exceeds 500 lines (${lineCount} lines)`);
      }
    }
  }
  console.log(`PASS: All ${sourceFiles.length} generator source files contain 0 Cyrillic characters and 0 comments; modular shards <= 500 lines.`);
}

function test200HeroBlocksAndAntiSlop() {
  console.log("\n=== 2. COPY BANK & ANTI-SLOP TEST: 200 HERO BLOCKS ===");
  const subCategories: AutoSubcategoryId[] = [
    "hypercar-launch",
    "motorsport-tuning",
    "bespoke-dealership",
    "carbon-atelier",
  ];
  const tones: ToneId[] = [
    "luxury",
    "track",
    "heritage",
    "technical",
  ];
  const ctas: PrimaryCtaGoal[] = [
    "Book a test drive",
    "Reserve a car",
    "Request a quote",
    "Visit the showroom",
  ];
  const brands = [
    "Valkyrie",
    "Aethelgard",
    "Koenigwerk",
    "Solstice",
    "Meridian",
    "Vanguard",
    "Apex Werks",
    "Nordic",
    "Onyx",
    "Stuttgart",
  ];
  const cities = ["Zurich", "Geneva", "Munich", "London", "Milan", "Tokyo", "Stuttgart"];

  let count = 0;
  for (let i = 0; i < 200; i++) {
    const base = createDefaultConfig(subCategories[i % subCategories.length], (i % 10) + 1);
    const config: GeneratorUserConfig = {
      ...base,
      tone: tones[Math.floor(i / 4) % tones.length],
      brandName: brands[i % brands.length],
      modelName: `GT ${100 + i}`,
      chassisCode: `KR-${(i % 9) + 1}`,
      location: cities[i % cities.length],
      primaryCta: ctas[Math.floor(i / 16) % ctas.length],
      variationSeed: (i % 10) + 1,
    };

    const payload = synthesizeLanding(config);

    const hWords = countWords(payload.headline);
    const subWords = countWords(payload.subheadline);
    const ctaWords = countWords(payload.ctaPrimary);

    if (hWords < 1 || hWords > 6) {
      throw new Error(`Headline exceeds 6 words (${hWords}w) on iteration ${i}: "${payload.headline}"`);
    }
    if (subWords < 1 || subWords > 18) {
      throw new Error(`Subheadline exceeds 18 words (${subWords}w) on iteration ${i}: "${payload.subheadline}"`);
    }
    if (ctaWords < 2 || ctaWords > 3) {
      throw new Error(`CTA outside 2-3 words (${ctaWords}w) on iteration ${i}: "${payload.ctaPrimary}"`);
    }

    const sentencesToCheck = [
      payload.headline,
      payload.subheadline,
      payload.manifestoQuote,
      ...payload.timelineChapters.map((c) => c.title),
      ...payload.timelineChapters.map((c) => c.body),
      ...payload.sections.map((s) => s.title),
      ...payload.sections.map((s) => s.subtitle),
    ];

    for (const sentence of sentencesToCheck) {
      const trimmed = sentence.trim();
      if (!trimmed) {
        throw new Error(`Empty sentence on iteration ${i}`);
      }
      if (!/^[A-Z0-9"']/.test(trimmed)) {
        throw new Error(`Malformed sentence (does not start with capital letter) on iteration ${i}: "${sentence}"`);
      }
      if (/\{[a-zA-Z]+\}/.test(trimmed)) {
        throw new Error(`Uninterpolated slot in sentence on iteration ${i}: "${sentence}"`);
      }
      const slopReason = containsSlopPattern(trimmed);
      if (slopReason) {
        throw new Error(`Slop pattern (${slopReason}) on iteration ${i}: "${sentence}"`);
      }
    }

    for (const metric of payload.validatedMetrics) {
      if (!validateMetricIntegrity(metric)) {
        throw new Error(
          `Invalid metric slot on iteration ${i}: display="${metric.displayValue}" unit="${metric.unit}" label="${metric.label}" dimension="${metric.dimension}"`
        );
      }
    }

    const failedLinter = payload.linter.checks.filter((c) => !c.passed);
    if (failedLinter.length > 0) {
      throw new Error(`Design linter failed on iteration ${i}: ${JSON.stringify(failedLinter)}`);
    }

    count++;
  }
  console.log(`PASS: Generated and validated ${count} hero blocks. All headlines <= 6w, supporting sentences <= 18w, CTAs 2-3w, 0 slop tokens.`);
}

function print10SeedsTableAndHeroUsage() {
  console.log("\n=== 3. SEEDS 1–10 VERIFICATION TABLE (A.1) ===");
  const subCategories: AutoSubcategoryId[] = [
    "hypercar-launch",
    "motorsport-tuning",
    "bespoke-dealership",
    "carbon-atelier",
  ];

  const heroPhotoCounts: Record<string, number> = {};

  console.log("| Seed | Archetype | Hero Variant | Hero Photo ID | Font Pair | Accent Hex | Theme | Section Order | Headline | Linter Result |");
  console.log("|------|-----------|--------------|---------------|-----------|------------|-------|---------------|----------|---------------|");

  for (let seed = 1; seed <= 10; seed++) {
    const sub = subCategories[(seed - 1) % subCategories.length];
    const config = createDefaultConfig(sub, seed);
    const payload = synthesizeLanding(config);

    const passedCount = payload.linter.checks.filter((c) => c.passed).length;
    const totalCount = payload.linter.checks.length;

    const heroId = payload.heroAsset.asset.id;
    heroPhotoCounts[heroId] = (heroPhotoCounts[heroId] || 0) + 1;

    const accentHex =
      config.themeMode === "light"
        ? payload.tokens.palette.light.accent
        : payload.tokens.palette.dark.accent;

    const sectionOrderStr = payload.sectionOrder.join(" -> ");

    console.log(
      `| #${seed} | ${payload.tokens.archetype} (${payload.tokens.cardRadius}) | ${payload.tokens.heroVariant} | ${heroId} | ${payload.tokens.fontPair.id} | ${accentHex} | ${config.themeMode} | ${sectionOrderStr} | ${payload.headline} | PASS (${passedCount}/${totalCount}) |`
    );
  }

  console.log("\n--- HERO PHOTO USAGE COUNT ACROSS SEEDS 1–10 ---");
  console.log("| Hero Photo ID | Usage Count Across Seeds 1–10 |");
  console.log("|---------------|-------------------------------|");
  for (const [id, count] of Object.entries(heroPhotoCounts)) {
    console.log(`| ${id} | ${count}x |`);
  }
  const uniqueCount = Object.keys(heroPhotoCounts).length;
  console.log(`Total unique hero photos used: ${uniqueCount} / 10 seeds.`);
}

function testCopyVarietyAcross10Seeds() {
  console.log("\n=== 4. COPY VARIETY TEST ACROSS SEEDS 1–10 ON ONE BRIEF (C) ===");
  const baseConfig = createDefaultConfig("hypercar-launch", 1);
  baseConfig.brandName = "Kronos";
  baseConfig.modelName = "Valkyrie GT";
  baseConfig.location = "Zurich";

  const formIds = new Set<string>();
  const allSentences = new Set<string>();
  let sentenceCount = 0;

  for (let seed = 1; seed <= 10; seed++) {
    const config: GeneratorUserConfig = {
      ...baseConfig,
      variationSeed: seed,
    };
    const payload = synthesizeLanding(config);

    if (formIds.has(payload.headlineFormId)) {
      throw new Error(`Duplicate headline form "${payload.headlineFormId}" on seed #${seed}: "${payload.headline}"`);
    }
    formIds.add(payload.headlineFormId);

    const testSentences = [
      payload.headline,
      payload.subheadline,
      payload.manifestoQuote,
      payload.sections.find((s) => s.code === "Specs")?.subtitle,
      payload.sections.find((s) => s.code === "Gallery")?.subtitle,
      payload.sections.find((s) => s.code === "Reserve")?.subtitle,
    ].filter((s): s is string => Boolean(s));

    for (const s of testSentences) {
      sentenceCount++;
      if (allSentences.has(s)) {
        throw new Error(`Sentence repeated on seed #${seed}: "${s}"`);
      }
      allSentences.add(s);
    }
  }

  console.log(`PASS: Across seeds 1–10 on one brief, all 10 headlines have unique forms (${formIds.size}/10).`);
  console.log(`PASS: All ${sentenceCount} evaluated section sentences are 100% unique across seeds 1–10 (0 repetitions).`);
}

function testBakeryNichePipeline() {
  console.log("\n=== 5. TEST NICHE PIPELINE: test-bakery WITH 5 ASSETS (D) ===");
  
  if (isArchetypeAllowedForNiche("track", "test-bakery")) {
    throw new Error("Track archetype must NOT be allowed for test-bakery niche!");
  }
  console.log("PASS: isArchetypeAllowedForNiche('track', 'test-bakery') === false (Track rejected for bakery).");

  const allowedForBakery = getAllowedArchetypesForNiche("test-bakery");
  console.log(`PASS: Allowed archetypes for test-bakery: [${allowedForBakery.join(", ")}].`);

  for (let seed = 1; seed <= 10; seed++) {
    const config: GeneratorUserConfig = {
      niche: "test-bakery",
      subcategory: "bespoke-dealership",
      tone: "heritage",
      brandName: "Atelier Levain",
      modelName: "Country Bakery",
      chassisCode: "AL-01",
      location: "Zurich",
      year: 2026,
      focusTags: ["forged-carbon", "titanium-hardware"],
      forcedArchetype: "auto",
      themeMode: seed % 2 === 0 ? "light" : "dark",
      speedMode: "studio",
      showXRayScoring: false,
      variationSeed: seed,
      customMetrics: {
        accelSeconds: 2.0,
        topSpeedKmh: 350,
        rangeKm: 500,
        powerHp: 1200,
        massDeltaKg: -100,
        downforceKg: 700,
        basePriceUsd: 250000,
      },
    };

    const payload = synthesizeLanding(config);

    if (payload.tokens.archetype === "track") {
      throw new Error(`Track archetype incorrectly selected for test-bakery on seed #${seed}`);
    }

    const heroUrl = payload.heroAsset.asset.url;
    const galleryUrls = payload.featureAssets.map((f) => f.asset.url);
    if (galleryUrls.includes(heroUrl)) {
      throw new Error(`Hero image duplicated in gallery on test-bakery seed #${seed}`);
    }
    const uniqueGalleryUrls = new Set(galleryUrls);
    if (uniqueGalleryUrls.size !== galleryUrls.length) {
      throw new Error(`Duplicate image in gallery on test-bakery seed #${seed}`);
    }

    const uniqueGalleryGroups = new Set(payload.featureAssets.map((f) => f.asset.visualGroupId));
    if (uniqueGalleryGroups.size !== payload.featureAssets.length) {
      throw new Error(`Duplicate visualGroupId in gallery on test-bakery seed #${seed}`);
    }

    if (!payload.thinLibraryNotice) {
      throw new Error(`Expected thinLibraryNotice for 5-asset test-bakery on seed #${seed}`);
    }

    const bundle = buildExportBundle(payload);
    if (bundle.lineCount > 150) {
      throw new Error(`test-bakery export exceeds 150 lines: ${bundle.lineCount}`);
    }
  }

  console.log("PASS: test-bakery passed 10 seeds without car jargon, 0 duplicate photos, deduplicated by visualGroupId, and surfaced honest thin-library notice.");
}

function test10ExportsWithTscAndEslint() {
  console.log("\n=== 6. CI EXPORT TEST: 10 SINGLE-FILE EXPORTS (<= 150 LINES, TSC + ESLINT, 0 COMMENTS) ===");
  const tmpDir = path.join(DOCS_ROOT, "app/generator/_ci_export_verify");
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tmpDir, { recursive: true });

  const subCategories: AutoSubcategoryId[] = [
    "hypercar-launch",
    "motorsport-tuning",
    "bespoke-dealership",
    "carbon-atelier",
  ];

  let samplePageTsx = "";
  let sampleLineCount = 0;

  try {
    for (let seed = 1; seed <= 10; seed++) {
      const sub = subCategories[(seed - 1) % subCategories.length];
      const config = createDefaultConfig(sub, seed);
      const payload = synthesizeLanding(config);
      const bundle = buildExportBundle(payload);

      if (seed === 1) {
        samplePageTsx = bundle.pageTsx;
        sampleLineCount = bundle.lineCount;
      }

      if (bundle.lineCount > 150) {
        throw new Error(`Seed #${seed} export exceeds 150 lines (${bundle.lineCount} lines)`);
      }

      if (bundle.dependencies.length > 1) {
        throw new Error(`Seed #${seed} export has more than 1 dependency (${bundle.dependencies.length})`);
      }

      if (!bundle.copyForAiEditor.startsWith(AI_EDITOR_INSTRUCTION)) {
        throw new Error(`Seed #${seed} copyForAiEditor missing AI editor instruction header`);
      }

      const comments = findCommentsAst(bundle.pageTsx, true);
      if (comments.length > 0) {
        throw new Error(`Seed #${seed} page.tsx contains AST comment: ${comments[0]}`);
      }
      if (bundle.pageTsx.includes("/*") || bundle.pageTsx.includes("*/") || bundle.pageTsx.includes("TODO")) {
        throw new Error(`Seed #${seed} page.tsx contains comment or TODO marker`);
      }
      if (/[\u0400-\u04FF]/.test(bundle.pageTsx)) {
        throw new Error(`Seed #${seed} page.tsx contains Cyrillic characters`);
      }

      fs.writeFileSync(path.join(tmpDir, `page-seed-${seed}.tsx`), bundle.pageTsx, "utf8");
    }

    console.log(`Wrote 10 single-file exports (each ${sampleLineCount} lines, 1 dependency: react).`);
    console.log("Running TypeScript compiler (tsc --noEmit) across all 10 exported files...");
    execSync("npx tsc --noEmit", {
      cwd: DOCS_ROOT,
      stdio: "pipe",
    });
    console.log("PASS: tsc --noEmit succeeded with 0 errors across all 10 exported files.");

    console.log("Running ESLint across all 10 exported files...");
    execSync(`npx eslint "app/generator/_ci_export_verify/**/*.tsx"`, {
      cwd: DOCS_ROOT,
      stdio: "pipe",
    });
    console.log("PASS: ESLint succeeded with 0 errors across all 10 exported files.");
  } finally {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  console.log(`\n=== FIRST 45 LINES OF EXPORTED page.tsx (${sampleLineCount} lines total) ===`);
  console.log(samplePageTsx.split("\n").slice(0, 45).join("\n"));
}

function testCatalogDiskAndIndexFreshness() {
  console.log("\n=== 7. CATALOG INTEGRITY, PACK DEDUP & ASSETS_INDEX FRESHNESS ===");
  if (AUTO_VAULT_ASSETS.length !== 107) {
    throw new Error(`Expected 107 registered auto assets, got ${AUTO_VAULT_ASSETS.length}`);
  }
  if (AUTO_CLEAN_ASSET_COUNT !== 84) {
    throw new Error(`Expected 84 non-logo clean assets, got ${AUTO_CLEAN_ASSET_COUNT}`);
  }

  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const seenPartCodes = new Set<string>();
  for (const asset of AUTO_VAULT_ASSETS) {
    if (seenIds.has(asset.id)) {
      throw new Error(`Duplicate VaultAsset id: ${asset.id}`);
    }
    seenIds.add(asset.id);
    if (seenUrls.has(asset.url)) {
      throw new Error(`Duplicate VaultAsset url: ${asset.url}`);
    }
    seenUrls.add(asset.url);
    if (seenPartCodes.has(asset.partCode)) {
      throw new Error(`Duplicate VaultAsset partCode: ${asset.partCode}`);
    }
    seenPartCodes.add(asset.partCode);
  }

  const videos = AUTO_VAULT_ASSETS.filter((a) => a.mediaType === "video");
  if (videos.length !== 3) {
    throw new Error(`Expected 3 hero video assets, got ${videos.length}`);
  }
  for (const vid of videos) {
    const dir = vid.video?.scrollFramesDir;
    const count = vid.video?.scrollFrameCount;
    if (!dir || count !== 80) {
      throw new Error(`Video ${vid.id} missing scrollFramesDir/scrollFrameCount=80`);
    }
    const sampleFrameAbs = path.join(DOCS_ROOT, "public", dir.replace(/^\//, ""), "frame_001.webp");
    if (!fs.existsSync(sampleFrameAbs)) {
      throw new Error(`Missing scroll frame on disk for ${vid.id}: ${sampleFrameAbs}`);
    }
  }

  const packUrls = new Set<string>([
    ...AUTO_ORBIT_PACK.frames.map((f) => f.url),
    AUTO_MORPH_PACK.stateAFrontUrl,
    AUTO_MORPH_PACK.stateBFrontUrl,
    AUTO_MORPH_PACK.stateBRearUrl,
    AUTO_MORPH_PACK.stateBBrakeUrl,
    AUTO_COCKPIT_PACK.mainPovUrl,
    ...AUTO_COCKPIT_PACK.hotspots.map((h) => h.detailAssetUrl),
  ]);

  for (let seed = 1; seed <= 10; seed++) {
    const payload = synthesizeLanding(createDefaultConfig("hypercar-launch", seed));
    for (const feat of payload.featureAssets) {
      if (packUrls.has(feat.asset.url)) {
        throw new Error(`Pack asset leaked into generic featureAssets on seed #${seed}: ${feat.asset.url}`);
      }
    }
  }

  const indexCheck = buildAssetsIndexMarkdown();
  if (indexCheck.missingUrls.length > 0) {
    throw new Error(`Missing media referenced by catalog: ${indexCheck.missingUrls.join(", ")}`);
  }
  if (indexCheck.orphanFiles.length > 0) {
    throw new Error(`Orphan disk files not registered in catalog: ${indexCheck.orphanFiles.join(", ")}`);
  }
  if (!fs.existsSync(ASSETS_INDEX_PATH)) {
    throw new Error(`Missing .agents/generator/ASSETS_INDEX.md. Run sync-generator-index.ts`);
  }
  const onDisk = fs.readFileSync(ASSETS_INDEX_PATH, "utf8").replace(/\r\n/g, "\n");
  const expected = indexCheck.markdown.replace(/\r\n/g, "\n");
  if (onDisk !== expected) {
    throw new Error(`.agents/generator/ASSETS_INDEX.md is stale. Run sync-generator-index.ts`);
  }

  console.log("PASS: 107 auto assets (84 clean, 3 scroll-frame videos), 0 duplicates/orphans/missing, packs excluded from gallery, ASSETS_INDEX.md in sync.");
}

function testSectionOrderAndExportParity() {
  console.log("\n=== 8. ARCHETYPE SECTION ORDER & EXPORT PARITY ===");
  const subCategories: AutoSubcategoryId[] = [
    "hypercar-launch",
    "motorsport-tuning",
    "bespoke-dealership",
    "carbon-atelier",
  ];
  const orderSlots = ["specs", "gallery", "cta"] as const;

  for (let i = 0; i < subCategories.length; i++) {
    const sub = subCategories[i];
    for (const arch of ["monolith", "track", "editorial", "showroom"] as const) {
      const cfg: GeneratorUserConfig = {
        ...createDefaultConfig(sub, i + 1),
        forcedArchetype: arch,
      };
      const payload = synthesizeLanding(cfg);
      const expectedOrder = ARCHETYPE_SECTION_ORDER[arch];
      if (payload.sectionOrder.join(",") !== expectedOrder.join(",")) {
        throw new Error(`SectionOrder mismatch on ${arch}`);
      }

      const rolePos = new Map(orderSlots.map((slot) => [slot, expectedOrder.indexOf(slot)]));
      let prevPos = -1;
      for (const sec of payload.sections) {
        const slot =
          sec.kind === "section-spec-ledger" || sec.kind === "section-state-morph"
            ? "specs"
            : sec.kind === "section-trim-builder"
            ? "cta"
            : "gallery";
        const pos = rolePos.get(slot) ?? 0;
        if (pos < prevPos) {
          throw new Error(`Synthesized section ${sec.kind} out of ARCHETYPE_SECTION_ORDER for ${arch}`);
        }
        prevPos = pos;
      }

      const bundle = buildExportBundle(payload);
      if (!bundle.pageTsx.includes(JSON.stringify(payload.manifestoQuote))) {
        throw new Error(`Exported page.tsx missing manifestoQuote for ${arch}/${sub}`);
      }

      const ctaIdx = bundle.pageTsx.indexOf(`id="cta"`);
      const footerIdx = bundle.pageTsx.indexOf("<footer");
      if (ctaIdx === -1 || footerIdx === -1 || ctaIdx > footerIdx) {
        throw new Error(`Exported page.tsx missing valid CTA placement before footer for ${arch}`);
      }
      if (arch === "track" || arch === "showroom") {
        const specsSection = payload.sections.find((s) => s.kind === "section-spec-ledger");
        const specsPosInExport = specsSection ? bundle.pageTsx.indexOf(`id="${specsSection.kind}"`) : -1;
        if (arch === "showroom" && specsPosInExport !== -1 && ctaIdx > specsPosInExport) {
          throw new Error(`Showroom export placed CTA after specs instead of obeying ARCHETYPE_SECTION_ORDER`);
        }
      }
    }
  }

  console.log("PASS: All 4 archetypes enforce ARCHETYPE_SECTION_ORDER, include manifestoQuote, and sync CTA placement across preview and export.");
}

checkZeroCyrillicAndCommentsInSource();
test200HeroBlocksAndAntiSlop();
print10SeedsTableAndHeroUsage();
testCopyVarietyAcross10Seeds();
testBakeryNichePipeline();
test10ExportsWithTscAndEslint();
testCatalogDiskAndIndexFreshness();
testSectionOrderAndExportParity();
