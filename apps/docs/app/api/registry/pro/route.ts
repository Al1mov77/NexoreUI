import { NextRequest, NextResponse } from "next/server";
import { verifyLicense, getDb } from "../../../../lib/license-store";
import { getCurrentUser, getUserProStatus } from "../../../../lib/google-auth";
import { TEMPLATES } from "../../../data/templates";

const TEMPLATE_MEDIA_ASSETS: Record<string, string[]> = {
  "template-nexore-case-pro": [
    "/templates/nexore-case/nexore-01-box-closed.jpg",
    "/templates/nexore-case/nexore-02-box-open.jpg",
    "/templates/nexore-case/nexore-03-case-white.jpg",
    "/templates/nexore-case/nexore-04-charms-sheet.jpg",
    "/templates/nexore-case/nexore-05-stars-tray.jpg",
    "/templates/nexore-case/nexore-06-paper-texture.jpg",
    "/templates/nexore-case/nexore-07-seal-pad.jpg",
  ],
  "nexore-case": [
    "/templates/nexore-case/nexore-01-box-closed.jpg",
    "/templates/nexore-case/nexore-02-box-open.jpg",
    "/templates/nexore-case/nexore-03-case-white.jpg",
    "/templates/nexore-case/nexore-04-charms-sheet.jpg",
    "/templates/nexore-case/nexore-05-stars-tray.jpg",
    "/templates/nexore-case/nexore-06-paper-texture.jpg",
    "/templates/nexore-case/nexore-07-seal-pad.jpg",
  ],
  "template-vesuvio-pizza-pro": [
    "/templates/vesuvio-pizza/scene/counter.jpg",
    "/templates/vesuvio-pizza/scene/box-closed.webp",
    "/templates/vesuvio-pizza/scene/box-base.webp",
    "/templates/vesuvio-pizza/scene/box-ajar.webp",
    "/templates/vesuvio-pizza/scene/timer.webp",
    "/templates/vesuvio-pizza/pizza/dough.webp",
    "/templates/vesuvio-pizza/pizza/sauce.webp",
    "/templates/vesuvio-pizza/pizza/crust-baked.webp",
    "/templates/vesuvio-pizza/pizza/pizza-baked-full.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-1.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-2.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-1.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-2.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-1.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-1.webp",
    "/templates/vesuvio-pizza/toppings/basil-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-3.webp",
    "/templates/vesuvio-pizza/toppings/olive-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-2.webp",
    "/templates/vesuvio-pizza/trays/tray-mozzarella.webp",
    "/templates/vesuvio-pizza/trays/tray-pepperoni.webp",
    "/templates/vesuvio-pizza/trays/tray-mushrooms.webp",
    "/templates/vesuvio-pizza/trays/tray-basil.webp",
    "/templates/vesuvio-pizza/trays/tray-olives.webp",
    "/templates/vesuvio-pizza/trays/tray-onion.webp",
    "/templates/vesuvio-pizza/hands/hand-open.webp",
    "/templates/vesuvio-pizza/hands/hand-pinch.webp",
    "/templates/vesuvio-pizza/hands/hand-ok.webp",
    "/templates/vesuvio-pizza/hands/hand-point.webp"
  ],
  "vesuvio-pizza": [
    "/templates/vesuvio-pizza/scene/counter.jpg",
    "/templates/vesuvio-pizza/scene/box-closed.webp",
    "/templates/vesuvio-pizza/scene/box-base.webp",
    "/templates/vesuvio-pizza/scene/box-ajar.webp",
    "/templates/vesuvio-pizza/scene/timer.webp",
    "/templates/vesuvio-pizza/pizza/dough.webp",
    "/templates/vesuvio-pizza/pizza/sauce.webp",
    "/templates/vesuvio-pizza/pizza/crust-baked.webp",
    "/templates/vesuvio-pizza/pizza/pizza-baked-full.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-1.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-2.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-1.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-2.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-1.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-1.webp",
    "/templates/vesuvio-pizza/toppings/basil-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-3.webp",
    "/templates/vesuvio-pizza/toppings/olive-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-2.webp",
    "/templates/vesuvio-pizza/trays/tray-mozzarella.webp",
    "/templates/vesuvio-pizza/trays/tray-pepperoni.webp",
    "/templates/vesuvio-pizza/trays/tray-mushrooms.webp",
    "/templates/vesuvio-pizza/trays/tray-basil.webp",
    "/templates/vesuvio-pizza/trays/tray-olives.webp",
    "/templates/vesuvio-pizza/trays/tray-onion.webp",
    "/templates/vesuvio-pizza/hands/hand-open.webp",
    "/templates/vesuvio-pizza/hands/hand-pinch.webp",
    "/templates/vesuvio-pizza/hands/hand-ok.webp",
    "/templates/vesuvio-pizza/hands/hand-point.webp"
  ],
  "template-pull-noodle-pro": ["/videos/pull-noodle.mp4"],
  "pull-noodle-pro": ["/videos/pull-noodle.mp4"],
  "template-ferrari-nocturne": ["/videos/ferrari-nocturne.mp4"],
  "ferrari-nocturne": ["/videos/ferrari-nocturne.mp4"],
  "template-rose-nocturne": ["/videos/rose-nocturne-atelier.mp4"],
  "rose-nocturne": ["/videos/rose-nocturne-atelier.mp4"],
  "template-psyche-obsidian": ["/videos/psyche-obsidian-atelier.mp4"],
  "psyche-obsidian": ["/videos/psyche-obsidian-atelier.mp4"],
  "template-vortex-apex-pro": ["/videos/vortex-apex-obsidian.mp4"],
  "vortex-apex-pro": ["/videos/vortex-apex-obsidian.mp4"],
  "template-aerovoid-obsidian-pro": ["/videos/aerovoid-obsidian-parka.mp4"],
  "aerovoid-obsidian-pro": ["/videos/aerovoid-obsidian-parka.mp4"],
  "template-amarena-royale-pro": ["/videos/amarena-royale-cupcake.mp4"],
  "amarena-royale-pro": ["/videos/amarena-royale-cupcake.mp4"],
  "template-monolith-cacao-pro": ["/videos/monolith-cacao-glaze.mp4"],
  "monolith-cacao-pro": ["/videos/monolith-cacao-glaze.mp4"],
  "template-levitas-cryo-pro": ["/videos/levitas-cryo-spheres.mp4"],
  "levitas-cryo-pro": ["/videos/levitas-cryo-spheres.mp4"],
  "template-aura-obsidian-pro": ["/videos/aura-obsidian-botanica.mp4"],
  "aura-obsidian-pro": ["/videos/aura-obsidian-botanica.mp4"],
  "template-aura-nocturne-pro": ["/videos/aura-nocturne-perfume.mp4"],
  "aura-nocturne-pro": ["/videos/aura-nocturne-perfume.mp4"],
  "template-velvet-gelato-pro": ["/videos/velvet-cryo-gelato.mp4"],
  "velvet-gelato-pro": ["/videos/velvet-cryo-gelato.mp4"],
  "template-zenith-elixir-pro": ["/videos/zenith-tea-elixir.mp4"],
  "zenith-elixir-pro": ["/videos/zenith-tea-elixir.mp4"],
  "template-chrono-x-pro": ["/videos/chrono-scrub.mp4"],
  "chrono-x-pro": ["/videos/chrono-scrub.mp4"],
  "template-aura-sound-pro": ["/videos/headphones-scrub.mp4"],
  "aura-sound-pro": ["/videos/headphones-scrub.mp4"],
};

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};

    const name = (searchParams.get("name") || body.name || "").trim().toLowerCase();
    const key = (
      req.headers.get("x-license-key") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      searchParams.get("key") ||
      body.key ||
      ""
    ).trim();

    const deviceId = searchParams.get("device_id") || body.deviceId || req.headers.get("x-device-id") || undefined;
    const deviceName = searchParams.get("device_name") || body.deviceName || req.headers.get("x-device-name") || undefined;

    if (!name) {
      return NextResponse.json({ valid: false, error: "Template name parameter is required." }, { status: 400 });
    }

    let activeKey = key;
    if (!activeKey) {
      const user = await getCurrentUser();
      if (user) {
        const proStatus = await getUserProStatus(user);
        if (proStatus.isPro && proStatus.licenseKey) {
          activeKey = proStatus.licenseKey;
        }
      }
    }

    if (!activeKey) {
      return NextResponse.json(
        {
          valid: false,
          error: "NexoreUI Pro license required. Please authenticate via 'npx nexoreui auth <key>' or purchase at https://www.nexoreui.site/pricing",
        },
        { status: 401 }
      );
    }

    const verification = await verifyLicense(activeKey, deviceId, deviceName);
    if (!verification.valid) {
      return NextResponse.json(
        {
          valid: false,
          error: verification.error || "Invalid or revoked NexoreUI Pro license key.",
        },
        { status: 401 }
      );
    }

    const cleanTarget = name.replace(/^template-/, "").replace(/-pro$/, "");
    const prefixedName = name.startsWith("template-") ? name : `template-${name}`;
    const proSuffixedName = prefixedName.endsWith("-pro") ? prefixedName : `${prefixedName}-pro`;

    // 1. Query secure Neon PostgreSQL storage
    const pool = getDb();
    let dbRow: {
      id: string;
      slug: string;
      name: string;
      content: string;
      dependencies: string[] | string;
      assets: string[] | string;
    } | null = null;

    if (pool) {
      try {
        const queryRes = await pool.query(
          `SELECT id, slug, name, content, dependencies, assets
           FROM pro_templates
           WHERE LOWER(id) = $1
              OR LOWER(slug) = $1
              OR LOWER(id) = $2
              OR LOWER(slug) = $2
              OR LOWER(id) = $3
              OR LOWER(id) = $4
           LIMIT 1`,
          [name, cleanTarget, prefixedName, proSuffixedName]
        );
        if (queryRes.rows && queryRes.rows.length > 0) {
          dbRow = queryRes.rows[0];
        }
      } catch (dbErr) {
        console.error("Neon DB query error in Pro registry:", dbErr);
      }
    }

    // 2. Fallback to TEMPLATES metadata if DB row not found
    const template = TEMPLATES.find((t) => {
      const tId = t.id.toLowerCase();
      const tSlug = t.slug.toLowerCase();
      return (
        tId === name ||
        tSlug === name ||
        tId === prefixedName ||
        tId === proSuffixedName ||
        tSlug === cleanTarget ||
        tId.includes(cleanTarget)
      );
    });

    if (!dbRow && !template) {
      return NextResponse.json(
        {
          valid: false,
          error: `Template '${name}' not found in Pro registry.`,
        },
        { status: 404 }
      );
    }

    const templateId = dbRow?.id || template?.id || name;
    const templateSlug = dbRow?.slug || template?.slug || cleanTarget;
    const fileName = `${templateSlug}.tsx`;

    let dependencies: string[] = ["framer-motion", "lucide-react", "clsx", "tailwind-merge"];
    if (dbRow?.dependencies) {
      dependencies = Array.isArray(dbRow.dependencies)
        ? dbRow.dependencies
        : typeof dbRow.dependencies === "string"
        ? JSON.parse(dbRow.dependencies)
        : dependencies;
    }

    let assets: string[] =
      TEMPLATE_MEDIA_ASSETS[templateId] ||
      TEMPLATE_MEDIA_ASSETS[templateSlug] ||
      TEMPLATE_MEDIA_ASSETS[`template-${templateSlug}-pro`] ||
      [];

    if (dbRow?.assets) {
      const parsedAssets = Array.isArray(dbRow.assets)
        ? dbRow.assets
        : typeof dbRow.assets === "string"
        ? JSON.parse(dbRow.assets)
        : [];
      if (parsedAssets.length > 0) {
        assets = parsedAssets;
      }
    }

    const content = dbRow?.content || template?.codeSnippet || "";

    return NextResponse.json({
      valid: true,
      name: templateId,
      slug: templateSlug,
      fileName,
      content,
      dependencies,
      assets,
      owner: verification.owner,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal registry error";
    return NextResponse.json({ valid: false, error: message }, { status: 500 });
  }
}
