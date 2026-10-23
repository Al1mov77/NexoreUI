const fs = require('fs');
const path = require('path');

const navFile = fs.readFileSync(path.join(__dirname, '../apps/docs/app/config/navigation.ts'), 'utf8');
const overviewFile = fs.readFileSync(path.join(__dirname, '../apps/docs/app/components/sections/ComponentsOverviewSection.tsx'), 'utf8');
const docsClientFile = fs.readFileSync(path.join(__dirname, '../apps/docs/app/docs/[[...slug]]/DocsClientPage.tsx'), 'utf8');

// Parse sectionComponents from DocsClientPage
const sectionComponentsMatch = docsClientFile.match(/const sectionComponents[^{]+{([\s\S]+?)\n};/);
if (!sectionComponentsMatch) {
  console.error('ERROR: Could not find sectionComponents in DocsClientPage.tsx');
  process.exit(1);
}

const mappedSections = new Set();
const lines = sectionComponentsMatch[1].split('\n');
for (const line of lines) {
  const trimmed = line.trim();
  const m = trimmed.match(/^["']?([a-zA-Z0-9_-]+)["']?\s*:/);
  if (m) mappedSections.add(m[1].trim());
}

// Extract IDs from navigation
const navIds = new Set();
const navRegex = /id:\s*["']([^"']+)["']/g;
let match;
while ((match = navRegex.exec(navFile)) !== null) {
  navIds.add(match[1]);
}

// Extract IDs from ALL_COMPONENTS_DATA
const overviewIds = new Set();
const overviewRegex = /id:\s*["']([^"']+)["']/g;
while ((match = overviewRegex.exec(overviewFile)) !== null) {
  overviewIds.add(match[1]);
}

const categoryIds = new Set([
  'all', 'core', 'layout', 'feedback', 'ai', 'animated', 'pro', 'pro-suite-2', 'pro-components', 'pro-suites'
]);

const checkedIds = new Set([...navIds, ...overviewIds]);
const missing = [];

for (const id of Array.from(checkedIds).sort()) {
  if (categoryIds.has(id) && id !== 'pro-components') continue;
  if (!mappedSections.has(id)) {
    missing.push(id);
  }
}

if (missing.length > 0) {
  console.error('\n❌ FAILED: Found components without registered sections in DocsClientPage:');
  missing.forEach(id => console.error(`  - ${id}`));
  process.exit(1);
}

console.log(`\n✅ PASSED: All ${checkedIds.size} checked IDs from navigation and catalog have registered sections!`);
process.exit(0);
