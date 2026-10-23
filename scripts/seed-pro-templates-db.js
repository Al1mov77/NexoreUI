const fs = require("fs");
const path = require("path");
const { createPool } = require(path.join(__dirname, "../apps/docs/node_modules/@vercel/postgres"));

const TEMPLATE_MEDIA_ASSETS = {
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

async function main() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error("Error: POSTGRES_URL or DATABASE_URL environment variable is missing.");
    process.exit(1);
  }

  const pool = createPool({ connectionString: url });
  console.log("Connected to Neon PostgreSQL.");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pro_templates (
      id VARCHAR(100) PRIMARY KEY,
      slug VARCHAR(100) NOT NULL,
      name VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      dependencies JSONB,
      assets JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Verified table: pro_templates");

  const registryDir = path.join(__dirname, "../packages/cli/src/registry");
  const files = fs.readdirSync(registryDir).filter((f) => f.startsWith("template-") && f.endsWith(".ts"));

  console.log(`Found ${files.length} template registry files.`);

  for (const file of files) {
    const filePath = path.join(registryDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");

    const id = file.replace(/\.ts$/, "");
    const slug = id.replace(/^template-/, "").replace(/-pro$/, "");

    let name = id;
    let dependencies = ["framer-motion", "lucide-react", "clsx", "tailwind-merge"];
    let content = "";

    const nameMatch = raw.match(/name:\s*["']([^"']+)["']/);
    if (nameMatch) name = nameMatch[1];

    const depsMatch = raw.match(/dependencies:\s*(\[[^\]]+\])/);
    if (depsMatch) {
      try {
        dependencies = JSON.parse(depsMatch[1].replace(/'/g, '"'));
      } catch {}
    }

    const contentMarker = 'content: `';
    const contentIdx = raw.indexOf(contentMarker);
    if (contentIdx !== -1) {
      const start = contentIdx + contentMarker.length;
      const end = raw.lastIndexOf('`');
      if (end > start) {
        content = raw.slice(start, end);
      }
    } else {
      const doubleQuoteMarker = 'content: "';
      const dqIdx = raw.indexOf(doubleQuoteMarker);
      if (dqIdx !== -1) {
        const start = dqIdx + doubleQuoteMarker.length;
        const end = raw.lastIndexOf('"');
        if (end > start) {
          content = raw.slice(start, end);
        }
      }
    }

    if (!content) {
      console.warn(`Warning: Could not extract content for ${file}`);
      continue;
    }

    const assets = TEMPLATE_MEDIA_ASSETS[id] || TEMPLATE_MEDIA_ASSETS[slug] || [];

    await pool.query(
      `INSERT INTO pro_templates (id, slug, name, content, dependencies, assets, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET
         slug = EXCLUDED.slug,
         name = EXCLUDED.name,
         content = EXCLUDED.content,
         dependencies = EXCLUDED.dependencies,
         assets = EXCLUDED.assets,
         updated_at = CURRENT_TIMESTAMP`,
      [id, slug, name, content, JSON.stringify(dependencies), JSON.stringify(assets)]
    );

    console.log(`+ Seeded pro template: ${id} (slug: ${slug}, ${content.length} chars)`);
  }

  const { rows } = await pool.query("SELECT COUNT(*) AS count FROM pro_templates");
  console.log(`Successfully verified ${rows[0].count} pro templates stored in Neon PostgreSQL.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal seeding error:", err);
  process.exit(1);
});
