const fs = require('fs');
const content = fs.readFileSync('apps/docs/app/data/templates.ts', 'utf8');

const videoIds = new Set([
  "template-velvet-gelato-pro",
  "template-aerovoid-obsidian-pro",
  "template-vortex-apex-pro",
  "template-amarena-royale-pro",
  "template-monolith-cacao-pro",
  "template-levitas-cryo-pro",
  "template-aura-obsidian-pro",
  "template-aura-nocturne-pro",
  "template-zenith-elixir-pro",
  "template-ferrari-nocturne",
  "template-rose-nocturne",
  "template-psyche-obsidian",
  "template-vapor-obsidian",
  "template-vantr-particle",
  "template-vantr-particle-pro",
  "template-lamborghini-revuelto",
  "template-chrono-x-pro",
  "template-aura-sound-pro",
]);

const blocks = content.split(/\{\s*id:\s*"/).slice(1);
const all = [];

for (const b of blocks) {
  const idMatch = b.match(/^([^"]+)"/);
  const titleMatch = b.match(/title:\s*"([^"]+)"/);
  const subtitleMatch = b.match(/subtitle:\s*"([^"]+)"/);
  const categoryMatch = b.match(/category:\s*"([^"]+)"/);
  const cliMatch = b.match(/cliCommand:\s*"([^"]+)"/);
  const slugMatch = b.match(/slug:\s*"([^"]+)"/);

  if (idMatch && titleMatch) {
    const id = "template-" + idMatch[1].replace(/^template-/, '');
    all.push({
      id,
      slug: slugMatch ? slugMatch[1] : '',
      title: titleMatch[1],
      subtitle: subtitleMatch ? subtitleMatch[1] : '',
      category: categoryMatch ? categoryMatch[1] : '',
      cli: cliMatch ? cliMatch[1] : '',
      isVideo: videoIds.has(id),
    });
  }
}

console.log("ALL TEMPLATES (" + all.length + " total):\n");
all.forEach((t, i) => {
  console.log(`${i+1}. [${t.isVideo ? 'VIDEO' : 'REGULAR'}] [${t.category}] ${t.title}`);
  console.log(`   ID: ${t.id} | CLI: ${t.cli}`);
  console.log(`   ${t.subtitle}`);
});
