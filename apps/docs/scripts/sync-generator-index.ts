import fs from "node:fs";
import path from "node:path";
import {
  AUTO_CLEAN_ASSET_COUNT,
  AUTO_COCKPIT_PACK,
  AUTO_MORPH_PACK,
  AUTO_ORBIT_PACK,
  AUTO_VAULT_ASSETS,
} from "../lib/generator/catalog-auto";
import { getAllowedArchetypesForNiche } from "../lib/generator/design-tokens";
import { TEST_BAKERY_VAULT_ASSETS } from "../lib/generator/niches/test-bakery";
import { NicheId, VaultAsset } from "../lib/generator/schema";

const ALL_NICHES: readonly NicheId[] = [
  "auto",
  "test-bakery",
  "restaurant",
  "gym",
  "pharmacy",
  "food",
];

const DOCS_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(DOCS_ROOT, "..", "..");
const PUBLIC_GENERATOR_DIR = path.join(DOCS_ROOT, "public", "generator");
const ASSETS_INDEX_PATH = path.join(REPO_ROOT, ".agents", "generator", "ASSETS_INDEX.md");
const VAULT_GALLERY_PATH = path.join(PUBLIC_GENERATOR_DIR, "vault-gallery.html");

function walkFiles(dir: string, base: string, acc: string[]) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(abs, base, acc);
    } else {
      const rel = path.relative(base, abs).split(path.sep).join("/");
      acc.push(rel);
    }
  }
}

function collectRegisteredRefs() {
  const autoUrls = new Set<string>();
  const bakeryUrls = new Set<string>();
  const packUrls = new Set<string>();
  const frameDirs = new Set<string>();

  for (const asset of AUTO_VAULT_ASSETS) {
    autoUrls.add(asset.url);
    if (asset.video) {
      if (asset.video.webmUrl) autoUrls.add(asset.video.webmUrl);
      if (asset.video.posterUrl) autoUrls.add(asset.video.posterUrl);
      if (asset.video.scrollFramesDir) {
        frameDirs.add(asset.video.scrollFramesDir);
      }
    }
  }

  for (const frame of AUTO_ORBIT_PACK.frames) {
    packUrls.add(frame.url);
  }
  packUrls.add(AUTO_MORPH_PACK.stateAFrontUrl);
  packUrls.add(AUTO_MORPH_PACK.stateBFrontUrl);
  packUrls.add(AUTO_MORPH_PACK.stateBRearUrl);
  packUrls.add(AUTO_MORPH_PACK.stateBBrakeUrl);
  packUrls.add(AUTO_COCKPIT_PACK.mainPovUrl);
  for (const spot of AUTO_COCKPIT_PACK.hotspots) {
    packUrls.add(spot.detailAssetUrl);
  }
  for (const b of TEST_BAKERY_VAULT_ASSETS) {
    bakeryUrls.add(b.url);
  }

  return { autoUrls, bakeryUrls, packUrls, frameDirs };
}

export function buildAssetsIndexMarkdown(): {
  markdown: string;
  missingUrls: string[];
  orphanFiles: string[];
  vaultImages: string[];
} {
  const publicRoot = path.join(DOCS_ROOT, "public");
  const allDiskRel: string[] = [];
  walkFiles(PUBLIC_GENERATOR_DIR, publicRoot, allDiskRel);

  const diskUrls = new Set(
    allDiskRel
      .filter((rel) => rel !== "generator/vault-gallery.html")
      .map((rel) => `/${rel}`)
  );

  const folderCounts = new Map<string, number>();
  for (const rel of allDiskRel) {
    if (!rel.startsWith("generator/auto/")) continue;
    const sub = rel.slice("generator/auto/".length).split("/")[0] || "(root)";
    folderCounts.set(sub, (folderCounts.get(sub) || 0) + 1);
  }

  const { autoUrls, bakeryUrls, packUrls, frameDirs } = collectRegisteredRefs();
  const allRegistered = new Set<string>([...autoUrls, ...packUrls, ...bakeryUrls]);

  const missingUrls: string[] = [];
  for (const url of allRegistered) {
    if (!diskUrls.has(url)) {
      missingUrls.push(url);
    }
  }

  for (const dirUrl of frameDirs) {
    const absDir = path.join(publicRoot, dirUrl.replace(/^\//, ""));
    if (!fs.existsSync(absDir)) {
      missingUrls.push(`${dirUrl}/ (missing directory)`);
    }
  }

  const orphanFiles: string[] = [];
  for (const diskUrl of diskUrls) {
    if (allRegistered.has(diskUrl)) continue;
    let coveredByFrames = false;
    for (const dirUrl of frameDirs) {
      if (diskUrl.startsWith(`${dirUrl}/`)) {
        coveredByFrames = true;
        break;
      }
    }
    if (!coveredByFrames) {
      orphanFiles.push(diskUrl);
    }
  }

  const formatFocal = (asset: VaultAsset) =>
    asset.focalPoint
      ? `${asset.focalPoint.x.toFixed(2)},${asset.focalPoint.y.toFixed(2)}`
      : "-";

  const formatSafe = (asset: VaultAsset) =>
    asset.safeTextArea
      ? `${asset.safeTextArea.region}/${asset.safeTextArea.luminance}`
      : "-";

  const sortedFolders = Array.from(folderCounts.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  const heroAssets = AUTO_VAULT_ASSETS.filter((a) => a.heroViability >= 80);
  const videoAssets = AUTO_VAULT_ASSETS.filter((a) => a.mediaType === "video");

  const nicheRows = ALL_NICHES.map((nicheId) => {
    const count =
      nicheId === "auto"
        ? AUTO_VAULT_ASSETS.length
        : nicheId === "test-bakery"
        ? TEST_BAKERY_VAULT_ASSETS.length
        : 0;
    const status =
      nicheId === "auto"
        ? "production"
        : nicheId === "test-bakery"
        ? "qa-sandbox"
        : "type-stub";
    const archetypes = getAllowedArchetypesForNiche(nicheId).join(", ");
    return `| \`${nicheId}\` | ${status} | ${count} | ${archetypes} |`;
  });

  const autoRows = AUTO_VAULT_ASSETS.map((a) => {
    const tones = a.tones.join(",");
    const lum = a.safeTextArea?.luminance || "dark";
    const logo = a.contains_logo ? "yes" : "no";
    return `| \`${a.id}\` | \`${a.partCode}\` | ${a.mediaType} | ${a.shotScale} | ${tones} | ${lum} | ${a.heroViability} | ${logo} | ${formatFocal(a)} | ${formatSafe(a)} | \`${a.url}\` |`;
  });

  const bakeryRows = TEST_BAKERY_VAULT_ASSETS.map(
    (b) =>
      `| \`${b.id}\` | \`${b.partCode}\` | ${b.shotScale} | ${b.tones.join(",")} | ${b.heroViability} | \`${b.url}\` |`
  );

  const vaultImages = allDiskRel
    .filter(
      (rel) =>
        rel.startsWith("generator/auto/vault/") &&
        (rel.endsWith(".jpg") || rel.endsWith(".png") || rel.endsWith(".webp"))
    )
    .map((rel) => `/${rel}`)
    .sort((a, b) => a.localeCompare(b));

  const lines: string[] = [
    "# Nexore Generator Assets & Niche Index",
    "",
    "Auto-generated by `pnpm --filter docs exec npx tsx scripts/sync-generator-index.ts`. Do not edit by hand.",
    "",
    "## Summary",
    "",
    `- Registered \`auto\` assets: **${AUTO_VAULT_ASSETS.length}** total (**${AUTO_CLEAN_ASSET_COUNT}** non-logo clean, ${heroAssets.length} hero-viable >= 80, ${videoAssets.length} hero videos)`,
    `- Registered \`test-bakery\` sandbox assets: **${TEST_BAKERY_VAULT_ASSETS.length}**`,
    `- Interactive pack media refs: **${packUrls.size}** (Orbit: ${AUTO_ORBIT_PACK.frames.length} frames, Morph: 4 states, Cockpit: 1 cabin + ${AUTO_COCKPIT_PACK.hotspots.length} hotspots)`,
    `- Scroll-scrubbing frame dirs: **${frameDirs.size}**`,
    `- Disk files in \`apps/docs/public/generator/auto/\`: **${Array.from(folderCounts.values()).reduce((s, n) => s + n, 0)}**`,
    `- Missing referenced URLs: **${missingUrls.length}**`,
    `- Unregistered orphan disk files: **${orphanFiles.length}**`,
    "",
    "## Disk Folders (`public/generator/auto/`)",
    "",
    "| Folder | File Count |",
    "|--------|------------|",
    ...sortedFolders.map(([name, count]) => `| \`${name}/\` | ${count} |`),
    "",
    "## Niche Status Matrix",
    "",
    "| Niche | Status | Registered Assets | Allowed Archetypes |",
    "|-------|--------|-------------------|--------------------|",
    ...nicheRows,
    "",
    "## Hero Videos & Interactive Packs",
    "",
    "| Kind | Id / Pack | Primary URL | Frames / States |",
    "|------|-----------|-------------|-----------------|",
    ...videoAssets.map(
      (v) =>
        `| hero-video | \`${v.id}\` | \`${v.url}\` | dir: \`${v.video?.scrollFramesDir || "-"}\` (${v.video?.scrollFrameCount || 0}) |`
    ),
    `| orbit-pack | \`${AUTO_ORBIT_PACK.id}\` | \`${AUTO_ORBIT_PACK.frames[0]?.url || "-"}\` | ${AUTO_ORBIT_PACK.frames.length} angles |`,
    `| morph-pack | \`${AUTO_MORPH_PACK.id}\` | \`${AUTO_MORPH_PACK.stateAFrontUrl}\` | 2 modes / 4 plates |`,
    `| cockpit-pack | \`${AUTO_COCKPIT_PACK.id}\` | \`${AUTO_COCKPIT_PACK.mainPovUrl}\` | ${AUTO_COCKPIT_PACK.hotspots.length} hotspots |`,
    "",
  ];

  if (missingUrls.length > 0) {
    lines.push("## Missing Referenced Files", "");
    for (const u of missingUrls) lines.push(`- \`${u}\``);
    lines.push("");
  }

  if (orphanFiles.length > 0) {
    lines.push("## Orphan Disk Files (Not Registered)", "");
    for (const u of orphanFiles.sort()) lines.push(`- \`${u}\``);
    lines.push("");
  }

  lines.push(
    `## Auto Vault Passport Table (${AUTO_VAULT_ASSETS.length} assets)`,
    "",
    "| ID | Part | Media | Shot Scale | Tones | Lum | Hero | Logo | Focal | Safe Text | URL |",
    "|----|------|-------|------------|-------|-----|------|------|-------|-----------|-----|",
    ...autoRows,
    "",
    `## Test Bakery Sandbox (${TEST_BAKERY_VAULT_ASSETS.length} assets)`,
    "",
    "| ID | Part | Shot Scale | Tones | Hero | URL |",
    "|----|------|------------|-------|------|-----|",
    ...bakeryRows,
    ""
  );

  return {
    markdown: lines.join("\n"),
    missingUrls,
    orphanFiles,
    vaultImages,
  };
}

export function buildVaultGalleryHtml(vaultImages: string[]): string {
  const cards = vaultImages
    .map((imgUrl) => {
      const name = imgUrl.split("/").pop() || imgUrl;
      return `      <div class="card"><img src="${imgUrl}" loading="lazy" /><div class="name">${name}</div></div>`;
    })
    .join("\n");

  return [
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    "  <meta charset=\"utf-8\" />",
    `  <title>Vault Images Gallery (${vaultImages.length} images)</title>`,
    "  <style>",
    "    body { background: #111; color: #fff; font-family: sans-serif; padding: 20px; }",
    "    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }",
    "    .card { background: #222; border-radius: 8px; overflow: hidden; padding: 8px; }",
    "    img { width: 100%; height: auto; display: block; border-radius: 4px; }",
    "    .name { font-size: 13px; margin-top: 6px; word-break: break-all; }",
    "  </style>",
    "</head>",
    "<body>",
    `  <h1>Vault Images Gallery (${vaultImages.length} images)</h1>`,
    "  <div class=\"grid\">",
    cards,
    "  </div>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

function runCli() {
  const result = buildAssetsIndexMarkdown();
  fs.mkdirSync(path.dirname(ASSETS_INDEX_PATH), { recursive: true });
  fs.writeFileSync(ASSETS_INDEX_PATH, result.markdown, "utf8");

  const galleryHtml = buildVaultGalleryHtml(result.vaultImages);
  fs.writeFileSync(VAULT_GALLERY_PATH, galleryHtml, "utf8");

  console.log(
    `Synced ${ASSETS_INDEX_PATH} (${AUTO_CLEAN_ASSET_COUNT} auto assets, ${result.vaultImages.length} vault gallery images, ${result.missingUrls.length} missing, ${result.orphanFiles.length} orphans).`
  );
  if (result.orphanFiles.length > 0) {
    console.log("Orphan disk files:", result.orphanFiles);
  }
  if (result.missingUrls.length > 0) {
    console.log("Missing URLs:", result.missingUrls);
  }
}

const isDirectEntry =
  typeof process !== "undefined" &&
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(__filename);

if (isDirectEntry) {
  runCli();
}
