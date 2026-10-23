const fs = require('fs');
const content = fs.readFileSync('apps/docs/app/data/templates.ts', 'utf8');

// Parse video IDs
const videoIdsMatch = content.match(/CINEMATIC_VIDEO_TEMPLATE_IDS = new Set<string>\(\[([\s\S]*?)\]\);/);
const videoIds = new Set(
  videoIdsMatch ? videoIdsMatch[1].match(/"([^"]+)"/g).map(s => s.replace(/"/g, '')) : []
);

// Match each template block
const blocks = content.split(/\{\s*id:\s*"/).slice(1);
const list = [];

for (const b of blocks) {
  const idMatch = b.match(/^([^"]+)"/);
  const titleMatch = b.match(/title:\s*"([^"]+)"/);
  const subtitleMatch = b.match(/subtitle:\s*"([^"]+)"/);
  const categoryMatch = b.match(/category:\s*"([^"]+)"/);
  const badgeMatch = b.match(/badge:\s*"([^"]+)"/);
  const cliMatch = b.match(/cliCommand:\s*"([^"]+)"/);

  if (idMatch && titleMatch) {
    const id = "template-" + idMatch[1].replace(/^template-/, '');
    const isVideo = videoIds.has(id);
    list.push({
      id,
      title: titleMatch[1],
      subtitle: subtitleMatch ? subtitleMatch[1] : '',
      category: categoryMatch ? categoryMatch[1] : '',
      badge: badgeMatch ? badgeMatch[1] : '',
      cli: cliMatch ? cliMatch[1] : '',
      isVideo
    });
  }
}

console.log('=== VIDEO SCRUBBING / CINEMATIC SCROLL TEMPLATES ===');
const videoTemplates = list.filter(t => t.isVideo);
videoTemplates.forEach((t, i) => {
  console.log(`${i + 1}. [${t.id}] ${t.title} (${t.category}) - ${t.badge}\n   CLI: ${t.cli}\n   ${t.subtitle}\n`);
});

console.log('\n=== NEW FLAGSHIP PRO TEMPLATES (E-Commerce, Data Table, Portfolio, Admin, Auth) ===');
const flagshipIds = new Set([
  'template-ecommerce-pro',
  'template-users-table-pro',
  'template-portfolio-pro',
  'template-nexcore-admin-pro',
  'template-auth-pro'
]);
const flagships = list.filter(t => flagshipIds.has(t.id));
flagships.forEach((t, i) => {
  console.log(`${i + 1}. [${t.id}] ${t.title} (${t.category}) - ${t.badge}\n   CLI: ${t.cli}\n   ${t.subtitle}\n`);
});

console.log('\n=== OTHER REGULAR / SPECIALIZED TEMPLATES ===');
const others = list.filter(t => !t.isVideo && !flagshipIds.has(t.id));
others.forEach((t, i) => {
  console.log(`${i + 1}. [${t.id}] ${t.title} (${t.category}) - ${t.badge}\n   CLI: ${t.cli}\n   ${t.subtitle}\n`);
});

console.log(`\nTOTALS: Video: ${videoTemplates.length}, Flagships: ${flagships.length}, Others: ${others.length}, Total: ${list.length}`);
