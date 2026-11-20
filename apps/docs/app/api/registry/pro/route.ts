import { NextRequest, NextResponse } from "next/server";
import { verifyLicense, getDb } from "../../../../lib/license-store";
import { getCurrentUser, getUserProStatus } from "../../../../lib/google-auth";
import { TEMPLATES } from "../../../data/templates";

const TOYBERRY_ASSETS_LIST = [
  ...Array.from({ length: 120 }, (_, i) => `/templates/toyberry/frames/s1/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 120 }, (_, i) => `/templates/toyberry/frames/s2/${String(i + 1).padStart(4, "0")}.webp`),
  "/templates/toyberry/toys/dino.png",
  "/templates/toyberry/toys/rocket.png",
  "/templates/toyberry/toys/bear.png",
  "/templates/toyberry/toys/pinkcar.png",
  "/templates/toyberry/toys/duck.png",
  "/templates/toyberry/toys/redcar.png",
  "/templates/toyberry/toys/robot.png",
  "/templates/toyberry/toys/train.png",
];

const KARMIN_ASSETS_LIST = [
  ...Array.from({ length: 120 }, (_, i) => `/templates/karmin/frames/eye/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 120 }, (_, i) => `/templates/karmin/frames/smoke/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 120 }, (_, i) => `/templates/karmin/frames/morph/${String(i + 1).padStart(4, "0")}.webp`),
  "/templates/karmin/stills/halo.webp",
  "/templates/karmin/stills/panther.webp",
  "/templates/karmin/stills/tiger.webp",
];

const FIZZWICK_ASSETS_LIST = [
  "/templates/fizzwick/bg.webp",
  "/templates/fizzwick/box.webp",
  "/templates/fizzwick/ice.webp",
  "/templates/fizzwick/logo.png",
  ...["cherry", "lime", "orange", "lemon", "grape", "blueberry"].flatMap((f) => [
    `/templates/fizzwick/can-${f}-s.webp`,
    `/templates/fizzwick/mascot-${f}.webp`,
    `/templates/fizzwick/splash-${f}.webp`,
    `/templates/fizzwick/wrap-${f}.webp`,
  ]),
  ...Array.from({ length: 6 }, (_, i) => `/templates/fizzwick/fx-cherry-${i}.webp`),
  ...Array.from({ length: 5 }, (_, i) => `/templates/fizzwick/fx-lime-${i}.webp`),
  ...Array.from({ length: 5 }, (_, i) => `/templates/fizzwick/fx-orange-${i}.webp`),
  ...Array.from({ length: 5 }, (_, i) => `/templates/fizzwick/fx-lemon-${i}.webp`),
  ...Array.from({ length: 3 }, (_, i) => `/templates/fizzwick/fx-grape-${i}.webp`),
  ...Array.from({ length: 4 }, (_, i) => `/templates/fizzwick/fx-blueberry-${i}.webp`),
];

const MACHINA65_ASSETS_LIST = [
  "/templates/machina-65/hero-board.webp",
  "/templates/machina-65/exploded-1-keycaps.webp",
  "/templates/machina-65/exploded-2-switches.webp",
  "/templates/machina-65/exploded-3-plate.webp",
  "/templates/machina-65/exploded-4-foam.webp",
  "/templates/machina-65/exploded-5-pcb.webp",
  "/templates/machina-65/exploded-6-chassis.webp",
  "/templates/machina-65/exploded-7-weight.webp",
  "/templates/machina-65/top-master.webp",
  "/templates/machina-65/top-chassis-empty.webp",
  "/templates/machina-65/plate-alu.webp",
  "/templates/machina-65/plate-brass.webp",
  "/templates/machina-65/plate-pc.webp",
  "/templates/machina-65/switch-linear.webp",
  "/templates/machina-65/switch-tactile.webp",
  "/templates/machina-65/switch-silent.webp",
  "/templates/machina-65/knob-brass.webp",
  "/templates/machina-65/knob-black.webp",
  "/templates/machina-65/knob-orange.webp",
  "/templates/machina-65/cap-esc-orange.webp",
  "/templates/machina-65/cap-esc-brass.webp",
  "/templates/machina-65/cap-enter-accent.webp",
  "/templates/machina-65/cap-space-accent.webp",
  "/templates/machina-65/cable-coiled.webp",
  "/templates/machina-65/puller-tool.webp",
  "/templates/machina-65/swatch-alu.webp",
  "/templates/machina-65/swatch-brass.webp",
  "/templates/machina-65/swatch-pbt.webp",
  "/templates/machina-65/compare-raw-cnc.webp",
  "/templates/machina-65/compare-finished.webp",
  "/templates/machina-65/case-bottom.webp",
  "/templates/machina-65/case-lid.webp",
  "/templates/machina-65/case-dustcover.webp",
];

const SOLECRAFT_ASSETS_LIST = [
  "/templates/solecraft/shoe-master.webp",
  "/templates/solecraft/shoe-day1.webp",
  "/templates/solecraft/shoe-month12.webp",
  "/templates/solecraft/exploded-1-upper.webp",
  "/templates/solecraft/exploded-2-footbed.webp",
  "/templates/solecraft/exploded-3-strobel.webp",
  "/templates/solecraft/exploded-4-midsole.webp",
  "/templates/solecraft/exploded-5-outsole.webp",
  "/templates/solecraft/swatch-suede.webp",
  "/templates/solecraft/swatch-leather.webp",
  "/templates/solecraft/swatch-ripstop.webp",
  "/templates/solecraft/tex-suede.webp",
  "/templates/solecraft/tex-leather.webp",
  "/templates/solecraft/tex-ripstop.webp",
  "/templates/solecraft/trim-dubrae.webp",
  "/templates/solecraft/trim-hangtag.webp",
  "/templates/solecraft/trim-patch.webp",
  "/templates/solecraft/box-sleeve.webp",
  "/templates/solecraft/box-tray-full.webp",
  "/templates/solecraft/box-tray-front.webp",
  "/templates/solecraft/tissue-paper.webp",
];

const TEMPLATE_MEDIA_ASSETS: Record<string, string[]> = {
  "template-machina-65-pro": MACHINA65_ASSETS_LIST,
  "machina-65": MACHINA65_ASSETS_LIST,
  "machina65": MACHINA65_ASSETS_LIST,
  "template-solecraft-pro": SOLECRAFT_ASSETS_LIST,
  "solecraft-run89": SOLECRAFT_ASSETS_LIST,
  "solecraft": SOLECRAFT_ASSETS_LIST,
  "template-fizzwick-soda-pro": FIZZWICK_ASSETS_LIST,
  "fizzwick-soda": FIZZWICK_ASSETS_LIST,
  "fizzwick": FIZZWICK_ASSETS_LIST,
  "template-toyberry-store-pro": TOYBERRY_ASSETS_LIST,
  "toyberry-store": TOYBERRY_ASSETS_LIST,
  "toyberry": TOYBERRY_ASSETS_LIST,
  "template-karmin-film-pro": KARMIN_ASSETS_LIST,
  "karmin-film": KARMIN_ASSETS_LIST,
  "karmin": KARMIN_ASSETS_LIST,
  "template-nexore-tee-pro": [
    "/templates/nexore-tee/nexore-tee-01-box-closed.jpg",
    "/templates/nexore-tee/nexore-tee-02-box-open.jpg",
    "/templates/nexore-tee/nexore-tee-03-tee-white.jpg",
    "/templates/nexore-tee/nexore-tee-04-patch-sheet.jpg",
    "/templates/nexore-tee/nexore-tee-04-patches-sheet.jpg",
    "/templates/nexore-tee/nexore-tee-05-letters-tray.jpg",
    "/templates/nexore-tee/nexore-tee-06-paper-texture.jpg",
    "/templates/nexore-tee/nexore-tee-07-sealed-bag.jpg",
    "/templates/nexore-tee/nexore-tee-08-press-pad.jpg",
  ],
  "nexore-tee": [
    "/templates/nexore-tee/nexore-tee-01-box-closed.jpg",
    "/templates/nexore-tee/nexore-tee-02-box-open.jpg",
    "/templates/nexore-tee/nexore-tee-03-tee-white.jpg",
    "/templates/nexore-tee/nexore-tee-04-patch-sheet.jpg",
    "/templates/nexore-tee/nexore-tee-04-patches-sheet.jpg",
    "/templates/nexore-tee/nexore-tee-05-letters-tray.jpg",
    "/templates/nexore-tee/nexore-tee-06-paper-texture.jpg",
    "/templates/nexore-tee/nexore-tee-07-sealed-bag.jpg",
    "/templates/nexore-tee/nexore-tee-08-press-pad.jpg",
  ],
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
  "template-dustline-dawn-pro": ["/templates/dustline-dawn/ride.mp4", "/templates/dustline-dawn/poster.webp", "/templates/dustline-dawn/p1.webp", "/templates/dustline-dawn/p2.webp", "/templates/dustline-dawn/p3.webp", "/templates/dustline-dawn/p4.webp", "/templates/dustline-dawn/p5.webp"],
  "dustline-dawn": ["/templates/dustline-dawn/ride.mp4", "/templates/dustline-dawn/poster.webp", "/templates/dustline-dawn/p1.webp", "/templates/dustline-dawn/p2.webp", "/templates/dustline-dawn/p3.webp", "/templates/dustline-dawn/p4.webp", "/templates/dustline-dawn/p5.webp"],
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
          error: "NexoreUI Pro license required. Please authenticate via 'npx nexoreui auth <key>' or purchase at https://www.nexoreui.com/pricing",
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
