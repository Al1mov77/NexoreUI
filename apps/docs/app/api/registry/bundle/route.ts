import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Resolve component file path across workspaces
function resolveComponentFile(fileName: string): string | null {
  const candidateDirs = [
    path.resolve(process.cwd(), "packages/ui/src/components"),
    path.resolve(process.cwd(), "../../packages/ui/src/components"),
    path.resolve(process.cwd(), "packages/cli/src/registry"),
    path.resolve(process.cwd(), "../../packages/cli/src/registry"),
  ];

  for (const dir of candidateDirs) {
    const tsxPath = path.join(dir, fileName.endsWith(".tsx") ? fileName : `${fileName}.tsx`);
    if (fs.existsSync(tsxPath)) {
      return tsxPath;
    }
    const tsPath = path.join(dir, fileName.endsWith(".ts") ? fileName : `${fileName}.ts`);
    if (fs.existsSync(tsPath)) {
      return tsPath;
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const requestedComponents: string[] | "all" = body.components || [];

    const componentsDir = [
      path.resolve(process.cwd(), "packages/ui/src/components"),
      path.resolve(process.cwd(), "../../packages/ui/src/components"),
    ].find((d) => fs.existsSync(d));

    if (!componentsDir) {
      return NextResponse.json(
        { success: false, error: "Components directory not found" },
        { status: 500 }
      );
    }

    const allFiles = fs
      .readdirSync(componentsDir)
      .filter((f) => f.endsWith(".tsx") && !f.startsWith("."));

    let targetFileNames: string[] = [];

    if (requestedComponents === "all" || (Array.isArray(requestedComponents) && requestedComponents.includes("all"))) {
      targetFileNames = allFiles;
    } else if (Array.isArray(requestedComponents)) {
      const normalizedTargets = new Set(
        requestedComponents.map((c) => c.toLowerCase().trim().replace(/\.tsx?$/, ""))
      );

      targetFileNames = allFiles.filter((fileName) => {
        const id = fileName.replace(/\.tsx$/, "").toLowerCase();
        return normalizedTargets.has(id);
      });

      // Always include essential primitives if not present
      for (const essential of ["button.tsx"]) {
        if (allFiles.includes(essential) && !targetFileNames.includes(essential)) {
          targetFileNames.push(essential);
        }
      }
    }

    const files: { name: string; content: string }[] = [];

    for (const fileName of targetFileNames) {
      const filePath = resolveComponentFile(fileName);
      if (filePath) {
        try {
          const content = fs.readFileSync(filePath, "utf8");
          files.push({ name: fileName, content });
        } catch {
          // ignore read error on individual file
        }
      }
    }

    return NextResponse.json({ success: true, count: files.length, files });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
