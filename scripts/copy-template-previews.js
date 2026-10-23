const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Umar\\Desktop\\preview for nexoreui templates';
const destDir = path.resolve(__dirname, '../apps/docs/public/templates/previews');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

// Match by substring / keyword in filename
const templates = [
  { slug: 'ironpaw-tools', key: 'Ironpaw' },
  { slug: 'stayline', key: 'Stayline' },
  { slug: 'ai-chat-interface', key: 'AI Chat' },
  { slug: 'nexstore-ecommerce-pro', key: 'NEXSTORE' },
  { slug: 'nexauth-identity-pro', key: 'NEXAUTH' },
  { slug: 'nexcore-admin-pro', key: 'NEXCORE' },
  { slug: 'nexusers-table-pro', key: 'NEXUSERS' },
  { slug: 'swagger-form-builder', key: 'SWAGGER' },
  { slug: 'nexfolio-portfolio-pro', key: 'NEXFOLIO' },
  { slug: 'vantr-particle-reveal', key: 'VANTR' },
  { slug: 'vapor-obsidian-atelier', key: 'VAPOR' },
  { slug: 'ferrari-nocturne-atelier', key: 'FERRARI' },
  { slug: 'rose-nocturne-atelier', key: 'ROSE' },
  { slug: 'psyche-obsidian-atelier', key: 'PSYCHE' },
  { slug: 'vortex-apex-corse', key: 'Vortex' },
  { slug: 'aerovoid-obsidian-parka', key: 'Aerovoid' },
  { slug: 'amarena-royale-patisserie', key: 'Amarena' },
  { slug: 'monolith-obsidian-cacao', key: 'Monolith' },
  { slug: 'levitas-cryo-atelier', key: 'Levitas' },
  { slug: 'aura-obsidian-botanica', key: 'Botanica' },
  { slug: 'aura-nocturne-parfum', key: 'Nocturne Extrait' },
  { slug: 'velvet-cryo-gelato', key: 'Velvet' },
  { slug: 'zenith-botanical-elixir', key: 'Zenith' },
  { slug: 'lamborghini-revuelto', key: 'Lamborghini' },
  { slug: 'chrono-x-titanium', key: 'Chrono-X' },
  { slug: 'aura-sound-pro', key: 'Aura Sound' }
];

let copied = 0;
for (const tmpl of templates) {
  const matchedFile = files.find(f => f.toLowerCase().includes(tmpl.key.toLowerCase()));
  if (!matchedFile) {
    console.error(`Could not find file for key: ${tmpl.key}`);
    process.exit(1);
  }
  const srcPath = path.join(srcDir, matchedFile);
  const destPath = path.join(destDir, `${tmpl.slug}.png`);
  fs.copyFileSync(srcPath, destPath);
  console.log(`[${copied + 1}/26] Copied: "${matchedFile}" -> "${tmpl.slug}.png"`);
  copied++;
}

console.log(`\nSuccessfully copied all ${copied} template preview images!`);
