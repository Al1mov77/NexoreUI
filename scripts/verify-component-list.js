const fs = require('fs');
const path = require('path');

const registryDir = path.resolve(__dirname, '../packages/cli/src/registry');
const generatedFile = path.resolve(__dirname, '../apps/docs/lib/registry/component-list.generated.ts');

if (!fs.existsSync(generatedFile)) {
  console.error('❌ Generated component list file not found. Run "node scripts/generate-component-list.js" first.');
  process.exit(1);
}

const registryFiles = fs.readdirSync(registryDir)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && !f.startsWith('template-'));

const generatedContent = fs.readFileSync(generatedFile, 'utf8');
const match = generatedContent.match(/TOTAL_REGISTRY_COMPONENTS_COUNT\s*=\s*(\d+)/);

if (!match) {
  console.error('❌ Could not parse TOTAL_REGISTRY_COMPONENTS_COUNT from generated file.');
  process.exit(1);
}

const generatedCount = parseInt(match[1], 10);
const registryCount = registryFiles.length;

if (generatedCount !== registryCount) {
  console.error(`❌ Component count mismatch: Registry has ${registryCount} files, but generated list has ${generatedCount}.`);
  process.exit(1);
}

console.log(`✔ Component list verified: ${generatedCount} / ${registryCount} components synchronized with registry.`);
