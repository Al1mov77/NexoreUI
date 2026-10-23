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
  const tagsMatch = b.match(/tags:\s*\[([\s\S]*?)\]/);

  if (idMatch && titleMatch) {
    const id = "template-" + idMatch[1].replace(/^template-/, '');
    const tags = tagsMatch ? tagsMatch[1].match(/"([^"]+)"/g).map(s => s.replace(/"/g, '')) : [];
    list.push({
      id,
      title: titleMatch[1],
      subtitle: subtitleMatch ? subtitleMatch[1] : '',
      category: categoryMatch ? categoryMatch[1] : '',
      badge: badgeMatch ? badgeMatch[1] : '',
      cli: cliMatch ? cliMatch[1] : '',
      isVideo: videoIds.has(id),
      tags
    });
  }
}

console.log('TOTAL TEMPLATES FOUND:', list.length);
console.log(JSON.stringify(list, null, 2));
