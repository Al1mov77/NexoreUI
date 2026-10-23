const fs = require('fs');

const navFile = fs.readFileSync('apps/docs/app/config/navigation.ts', 'utf8');
const overviewFile = fs.readFileSync('apps/docs/app/components/sections/ComponentsOverviewSection.tsx', 'utf8');
const docsClientFile = fs.readFileSync('apps/docs/app/docs/[[...slug]]/DocsClientPage.tsx', 'utf8');

const sectionFiles = fs.readdirSync('apps/docs/app/components/sections');
const uiFiles = fs.existsSync('packages/ui/src/components') ? fs.readdirSync('packages/ui/src/components') : [];
const cliFiles = fs.existsSync('packages/cli/src/registry') ? fs.readdirSync('packages/cli/src/registry') : [];

const sectionComponentsMatch = docsClientFile.match(/const sectionComponents[^{]+{([\s\S]+?)\n};/);
const mappedSections = new Set();
if (sectionComponentsMatch) {
  const lines = sectionComponentsMatch[1].split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    const m = trimmed.match(/^["']?([a-zA-Z0-9_-]+)["']?\s*:/);
    if (m) mappedSections.add(m[1].trim());
  }
}

const navIds = new Set();
const navRegex = /id:\s*["']([^"']+)["']/g;
let match;
while ((match = navRegex.exec(navFile)) !== null) {
  navIds.add(match[1]);
}

const overviewIds = new Set();
const overviewRegex = /id:\s*["']([^"']+)["']/g;
while ((match = overviewRegex.exec(overviewFile)) !== null) {
  overviewIds.add(match[1]);
}

const allIds = new Set([...navIds, ...overviewIds]);
const categoryIds = new Set(['all', 'core', 'layout', 'feedback', 'ai', 'animated', 'pro', 'pro-suite-2']);

const missing = [];
for (const id of Array.from(allIds).sort()) {
  if (categoryIds.has(id)) continue;
  if (!mappedSections.has(id)) {
    const uiFile = uiFiles.find(f => f === id + '.tsx' || f === id + '.ts');
    const cliFile = cliFiles.find(f => f === id + '.ts' || f === id + '.tsx');
    missing.push({
      id,
      inNav: navIds.has(id),
      inOverview: overviewIds.has(id),
      hasUI: !!uiFile,
      uiFile: uiFile || null,
      hasCLI: !!cliFile,
      cliFile: cliFile || null
    });
  }
}

console.log('Total missing sections:', missing.length);
console.log(JSON.stringify(missing, null, 2));
