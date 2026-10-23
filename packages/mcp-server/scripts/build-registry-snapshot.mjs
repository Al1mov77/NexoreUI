import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const regDir = path.resolve(__dirname, "../../../packages/cli/src/registry");
const themeFile = path.resolve(__dirname, "../../../apps/docs/app/globals.css");
const srcOutPath = path.resolve(__dirname, "../src/registry-snapshot.json");
const distDir = path.resolve(__dirname, "../dist");
const distOutPath = path.resolve(__dirname, "../dist/registry-snapshot.json");

if (!fs.existsSync(regDir)) {
  if (fs.existsSync(srcOutPath)) {
    console.log("Registry source directory not found. Preserving existing snapshot.");
    if (fs.existsSync(distDir)) {
      fs.copyFileSync(srcOutPath, distOutPath);
    }
    process.exit(0);
  } else {
    console.error("Error: Registry directory not found and no existing snapshot available.");
    process.exit(1);
  }
}

const files = fs.readdirSync(regDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");

const components = {};
const templates = {};
const aliases = {
  loaders: "loader",
  charts: "premium-charts",
  commerce: "premium-commerce",
  social: "premium-social",
};

for (const file of files) {
  const content = fs.readFileSync(path.join(regDir, file), "utf-8");

  const nameMatch = content.match(/name:\s*["']([^"']+)["']/);
  if (!nameMatch) continue;
  const name = nameMatch[1];

  const fileMatch = content.match(/fileName:\s*["']([^"']+)["']/);
  const fileName = fileMatch ? fileMatch[1] : `${name}.tsx`;

  const depsMatch = content.match(/dependencies:\s*\[([\s\S]*?)\]/);
  let dependencies = [];
  if (depsMatch) {
    dependencies = depsMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/["']/g, ""))
      .filter(Boolean);
  }

  const devDepsMatch = content.match(/devDependencies:\s*\[([\s\S]*?)\]/);
  let devDependencies = [];
  if (devDepsMatch) {
    devDependencies = devDepsMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/["']/g, ""))
      .filter(Boolean);
  }

  const isTemplate = name.startsWith("template-");

  if (isTemplate) {
    // Pro templates: metadata only. Content is NEVER included in snapshot to prevent leakage of paid code.
    templates[name] = {
      name,
      slug: name.replace(/^template-/, ""),
      fileName,
      dependencies,
      devDependencies,
      category: "template",
      pro: true,
    };
  } else {
    let fileContent = "";
    const contentIdx = content.indexOf("content:");
    if (contentIdx !== -1) {
      const rest = content.slice(contentIdx + "content:".length).trim();
      if (rest.startsWith("`")) {
        const endTick = rest.lastIndexOf("`");
        if (endTick > 0) {
          fileContent = rest.slice(1, endTick);
        }
      } else if (rest.startsWith('"') || rest.startsWith("'")) {
        const q = rest[0];
        const endQ = rest.lastIndexOf(q);
        if (endQ > 0) {
          fileContent = rest.slice(1, endQ);
        }
      }
    }

    let category = "base";
    if (name.startsWith("pro-") || name.startsWith("ultra-")) {
      category = "pro-block";
    } else if (
      name.includes("anim") ||
      name.includes("effect") ||
      name.includes("meteor") ||
      name.includes("magic") ||
      name.includes("beam") ||
      name.includes("aurora") ||
      name.includes("blur-fade") ||
      name.includes("shatter") ||
      name.includes("reveal") ||
      name.includes("ticker") ||
      name.includes("morphing") ||
      name.includes("particle") ||
      name.includes("glow")
    ) {
      category = "animated";
    }

    components[name] = {
      name,
      fileName,
      dependencies,
      devDependencies,
      category,
      content: fileContent,
      props: null,
    };
  }
}

let themeContent = null;
if (fs.existsSync(themeFile)) {
  themeContent = fs.readFileSync(themeFile, "utf-8");
}

const snapshot = {
  version: "2.0.0",
  generatedAt: new Date().toISOString(),
  stats: {
    total: Object.keys(components).length + Object.keys(templates).length,
    componentsCount: Object.keys(components).length,
    templatesCount: Object.keys(templates).length,
  },
  components,
  templates,
  aliases,
  theme: themeContent,
};

fs.writeFileSync(srcOutPath, JSON.stringify(snapshot, null, 2), "utf-8");
console.log(`Registry snapshot written to ${srcOutPath}`);
console.log(`Components: ${snapshot.stats.componentsCount}, Templates: ${snapshot.stats.templatesCount}`);

if (fs.existsSync(distDir)) {
  fs.writeFileSync(distOutPath, JSON.stringify(snapshot, null, 2), "utf-8");
  console.log(`Registry snapshot copied to ${distOutPath}`);
}
