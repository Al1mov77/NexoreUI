import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { FORGE_AUTOMOTIVE_ASSETS } from "../../../../../../lib/forge/automotive-manifest";

const ALLOWED_FILES = new Set(
  FORGE_AUTOMOTIVE_ASSETS.map((item) => item.fileName)
);

function resolveStorageFile(vertical: string, fileName: string): string | null {
  if (vertical !== "automotive") {
    return null;
  }
  if (!ALLOWED_FILES.has(fileName)) {
    return null;
  }
  const candidates = [
    path.join(process.cwd(), "storage", "forge", vertical, fileName),
    path.join(process.cwd(), "apps", "docs", "storage", "forge", vertical, fileName),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ vertical: string; asset: string }> }
) {
  const secFetchSite = req.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    return NextResponse.json({ error: "Cross-site media access denied" }, { status: 403 });
  }

  const referer = req.headers.get("referer");
  const host = req.headers.get("host");
  if (referer && host) {
    try {
      const refHost = new URL(referer).host;
      if (refHost !== host) {
        return NextResponse.json({ error: "External hotlinking denied" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid referer header" }, { status: 403 });
    }
  }

  const { vertical, asset } = await context.params;
  const filePath = resolveStorageFile(vertical, asset);
  if (!filePath) {
    return NextResponse.json({ error: "Asset not found in vault" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, max-age=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "same-origin",
    },
  });
}
