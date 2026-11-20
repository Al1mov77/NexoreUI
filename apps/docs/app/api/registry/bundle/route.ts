import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const COMPONENT_ALIASES: Record<string, string> = {
  modal: "dialog",
  loaders: "loader",
  charts: "premium-charts",
  commerce: "premium-commerce",
  social: "premium-social",
  "action-buttons": "pro-buttons",
  "specialized-inputs": "pro-inputs",
  "form-controls": "special-forms",
  "product-cards": "pro-cards",
  "spotlight-effects": "premium-effects",
  "text-motion": "ultra-effects",
  "atmospheric-effects": "ultra-components",
  "motion-primitives": "special-animations",
  "media-showcase": "premium-media",
  overlays: "premium-overlays",
};

const DEPENDENCY_VERSIONS: Record<string, string> = {
  "@apidevtools/json-schema-ref-parser": "^11.7.0",
  "@hookform/resolvers": "^3.9.1",
  "@radix-ui/react-accordion": "^1.2.2",
  "@radix-ui/react-checkbox": "^1.1.3",
  "@radix-ui/react-dialog": "^1.1.4",
  "@radix-ui/react-progress": "^1.1.1",
  "@radix-ui/react-scroll-area": "^1.2.2",
  "@radix-ui/react-select": "^2.1.4",
  "@radix-ui/react-slider": "^1.2.2",
  "@radix-ui/react-switch": "^1.1.2",
  "@radix-ui/react-tabs": "^1.1.2",
  "@radix-ui/react-tooltip": "^1.1.6",
  "@types/three": "^0.172.0",
  "class-variance-authority": "^0.7.1",
  clsx: "^2.1.1",
  "framer-motion": "^11.15.0",
  "lucide-react": "^0.475.0",
  "next-themes": "^0.4.4",
  "react-hook-form": "^7.54.2",
  sonner: "^1.7.1",
  "tailwind-merge": "^2.6.0",
  three: "^0.172.0",
  yaml: "^2.7.0",
  zod: "^3.24.1",
};

function findExistingDir(candidates: string[]): string | null {
  return candidates.find((d) => fs.existsSync(d)) || null;
}

function parseArrayField(source: string, fieldName: string): string[] {
  const regex = new RegExp(`${fieldName}:\\s*\\[([\\s\\S]*?)\\]`);
  const match = source.match(regex);
  if (!match) return [];
  return Array.from(match[1].matchAll(/['"]([^'"]+)['"]/g)).map((m) => m[1]);
}

function rewriteCnImport(content: string, utilsImport: string): string {
  return content.replace(
    /(['"])(\.\.\/(?:utils\/)?cn(?:\.js)?|@\/lib\/utils(?:\.js)?|\.\.\/\.\.\/lib\/utils(?:\.js)?)\1/g,
    `"${utilsImport}"`
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const requestedComponents: string[] | "all" = body.components || [];
    const utilsImport: string =
      typeof body.utilsImport === "string" && body.utilsImport.trim().length > 0
        ? body.utilsImport.trim()
        : "@/lib/utils";

    const componentsDir = findExistingDir([
      path.resolve(process.cwd(), "packages/ui/src/components"),
      path.resolve(process.cwd(), "../../packages/ui/src/components"),
    ]);

    const registryDir = findExistingDir([
      path.resolve(process.cwd(), "packages/cli/src/registry"),
      path.resolve(process.cwd(), "../../packages/cli/src/registry"),
    ]);

    if (!componentsDir) {
      return NextResponse.json(
        { success: false, error: "Components directory not found" },
        { status: 500 }
      );
    }

    const allIds = fs
      .readdirSync(componentsDir)
      .filter((f) => f.endsWith(".tsx") && !f.startsWith("."))
      .map((f) => f.replace(/\.tsx$/, ""));
    const allIdSet = new Set(allIds);

    const queue: string[] = [];
    if (
      requestedComponents === "all" ||
      (Array.isArray(requestedComponents) && requestedComponents.includes("all"))
    ) {
      queue.push(...allIds);
    } else if (Array.isArray(requestedComponents)) {
      for (const raw of requestedComponents) {
        const cleaned = String(raw).toLowerCase().trim().replace(/\.tsx?$/, "");
        const canonical = COMPONENT_ALIASES[cleaned] || cleaned;
        if (allIdSet.has(canonical)) {
          queue.push(canonical);
        }
      }
    }

    const resolvedIds = new Set<string>();
    const dependencies: Record<string, string> = {};
    const devDependencies: Record<string, string> = {};

    while (queue.length > 0) {
      const id = queue.shift()!;
      if (resolvedIds.has(id) || !allIdSet.has(id)) continue;
      resolvedIds.add(id);

      if (registryDir) {
        const regFile = path.join(registryDir, `${id}.ts`);
        if (fs.existsSync(regFile)) {
          try {
            const regContent = fs.readFileSync(regFile, "utf8");
            const compDeps = parseArrayField(regContent, "componentsDependencies");
            for (const dep of compDeps) {
              const depId = COMPONENT_ALIASES[dep] || dep;
              if (allIdSet.has(depId) && !resolvedIds.has(depId)) {
                queue.push(depId);
              }
            }
            const npmDeps = parseArrayField(regContent, "dependencies");
            for (const pkg of npmDeps) {
              const ver = DEPENDENCY_VERSIONS[pkg] || "latest";
              if (pkg.startsWith("@types/")) {
                devDependencies[pkg] = ver;
              } else {
                dependencies[pkg] = ver;
              }
            }
          } catch {}
        }
      }
    }

    const sortedIds = Array.from(resolvedIds).sort();
    const files: { id: string; name: string; content: string }[] = [];

    for (const id of sortedIds) {
      const fileName = `${id}.tsx`;
      const filePath = path.join(componentsDir, fileName);
      if (fs.existsSync(filePath)) {
        try {
          const rawContent = fs.readFileSync(filePath, "utf8");
          const content = rewriteCnImport(rawContent, utilsImport);
          files.push({ id, name: fileName, content });
        } catch {}
      }
    }

    return NextResponse.json({
      success: true,
      count: files.length,
      installedIds: sortedIds,
      dependencies,
      devDependencies,
      files,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
