#!/usr/bin/env node
/*
 * NexoreUI template export sync.
 *
 * Turns a docs preview (uses useTemplateCustomizer) into the standalone CLI registry entry,
 * 100% full and non-truncated, and optionally type-checks the exported code.
 *
 * Usage (run from the repo root):
 *   node scripts/sync-template-export.js \
 *     --preview  apps/docs/app/components/templates/previews/XPreview.tsx \
 *     --registry packages/cli/src/registry/template-x.ts \
 *     --const    templateX \
 *     --name     template-x \
 *     --component XTemplate \
 *     --brand    "BRAND NAME" \
 *     [--file template-x.tsx] [--deps framer-motion,lucide-react] [--check]
 *
 * Rules the preview must follow so the export works:
 *   - Only config.theme, config.brandName, config.heroTitle, config.heroSubtitle,
 *     config.customLogoUrl and config.hiddenSections may be read from the customizer.
 *   - No imports from local relative modules (inline helpers instead).
 *   - Exactly one `const { ... } = useTemplateCustomizer();`.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) { out[key] = next; i++; } else out[key] = "true";
    }
  }
  return out;
}

function fail(msg) {
  console.error("\nSYNC FAILED: " + msg + "\n");
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
for (const k of ["preview", "registry", "const", "name", "component", "brand"]) {
  if (!args[k]) fail("missing --" + k);
}

const root = process.cwd();
const previewPath = path.resolve(root, args.preview);
const registryPath = path.resolve(root, args.registry);
if (!fs.existsSync(previewPath)) fail("preview not found: " + args.preview);

let src = fs.readFileSync(previewPath, "utf8");

/* 1. Remove the customizer import */
src = src.replace(/^import\s*\{\s*useTemplateCustomizer\s*\}\s*from\s*["'][^"']+["'];?\r?\n/m, "");

/* 2. No local imports allowed in a standalone export */
const rel = Array.from(src.matchAll(/^import[^;]*?from\s*["'](\.{1,2}\/[^"']+)["'];?/gm)).map((m) => m[1]);
if (rel.length) fail("preview imports local modules, inline them first: " + rel.join(", "));

/* 3. Locate the customizer destructure */
const hook = src.match(/const\s*\{([^}]*)\}\s*=\s*useTemplateCustomizer\(\);?/);
if (!hook) fail("could not find `const { ... } = useTemplateCustomizer();`");
const hookNames = hook[1].split(",").map((s) => s.trim()).filter(Boolean);

/* 4. Which config fields does the preview read */
const KNOWN = {
  theme: { type: "string", def: '"dark"' },
  brandName: { type: "string", def: JSON.stringify(args.brand) },
  heroTitle: { type: "string", def: null },
  heroSubtitle: { type: "string", def: null },
  customLogoUrl: { type: "string", def: null },
  hiddenSections: { type: "Record<string, boolean>", def: null },
};
const fields = Array.from(new Set(Array.from(src.matchAll(/\bconfig\.(\w+)/g)).map((m) => m[1])));
const unknown = fields.filter((f) => !(f in KNOWN));
if (unknown.length) fail("preview reads unsupported config fields: " + unknown.join(", ") + ". Replace them with local constants.");
if (/\bconfig\b(?!\.)/.test(src.replace(hook[0], ""))) {
  console.warn("WARNING: `config` is used without a field access. Make sure the export still works.");
}

const usesDevice = hookNames.includes("deviceMode");

/* 5. Build props */
const propNames = [...fields];
const destructure = propNames.map((f) => (KNOWN[f].def ? `${f} = ${KNOWN[f].def}` : f));
const typeLines = propNames.map((f) => `${f}?: ${KNOWN[f].type};`);
if (usesDevice) {
  destructure.push('deviceMode = "desktop"');
  typeLines.push('deviceMode?: "desktop" | "tablet" | "mobile";');
}

const header =
  `export default function ${args.component}({\n` +
  destructure.map((d) => `  ${d},`).join("\n") + "\n" +
  `}: {\n` +
  typeLines.map((t) => `  ${t}`).join("\n") + "\n" +
  `}) {`;

const fnRe = /export\s+function\s+\w+\s*\(\s*\)\s*\{/;
if (!fnRe.test(src)) fail("could not find `export function Name() {` in the preview");
src = src.replace(fnRe, header);

const configObj = `const config = { ${propNames.join(", ")} };`;
src = src.replace(hook[0], configObj);

if (/useTemplateCustomizer/.test(src)) fail("useTemplateCustomizer is still referenced after transform");

/* 6. Write the registry file as a template literal, matching repo convention */
const esc = src.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const deps = (args.deps || "framer-motion,lucide-react").split(",").map((d) => `"${d.trim()}"`).join(", ");
const out =
  `export const ${args.const} = {\n` +
  `  name: "${args.name}",\n` +
  `  dependencies: [${deps}],\n` +
  `  fileName: "${args.file || args.name + ".tsx"}",\n` +
  `  content: \`${esc}\`,\n` +
  `};\n`;
fs.writeFileSync(registryPath, out, "utf8");
console.log("Wrote " + args.registry + " (" + src.split("\n").length + " lines of template code)");

/* 7. Optional type-check of the exported code */
if (args.check) {
  const dir = path.resolve(root, "apps/docs/app/__export_check__");
  const tmpFile = path.join(dir, "Template.tsx");
  const tmpCfg = path.resolve(root, "apps/docs/tsconfig.export-check.json");
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(tmpFile, src, "utf8");
    fs.writeFileSync(
      tmpCfg,
      JSON.stringify({ extends: "./tsconfig.json", include: ["next-env.d.ts", "app/__export_check__/Template.tsx"], exclude: ["node_modules"] }, null, 2)
    );
    let output = "";
    try {
      execSync("npx tsc --noEmit -p apps/docs/tsconfig.export-check.json", { cwd: root, stdio: "pipe" });
    } catch (e) {
      output = String(e.stdout || "") + String(e.stderr || "");
    }
    const mine = output.split(/\r?\n/).filter((l) => l.includes("__export_check__"));
    if (mine.length) {
      console.error("\nEXPORT TYPE ERRORS:\n" + mine.join("\n"));
      process.exitCode = 1;
    } else {
      console.log("Export type-check passed.");
    }
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(tmpCfg, { force: true }); } catch {}
  }
}
