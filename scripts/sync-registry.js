const fs = require('fs');
const path = require('path');

function createRegistryItem(name, fileName, sourcePath) {
  const content = fs.readFileSync(sourcePath, 'utf8');
  const fileContent = `export const ${name} = {
  name: "${name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}",
  dependencies: [
    "lucide-react",
    "clsx",
    "tailwind-merge"
  ],
  fileName: "${fileName}",
  content: ${JSON.stringify(content)}
};
`;
  return fileContent;
}

const spContent = createRegistryItem(
  'soundPulse',
  'sound-pulse.tsx',
  path.join(__dirname, '../packages/ui/src/components/sound-pulse.tsx')
);
fs.writeFileSync(
  path.join(__dirname, '../packages/cli/src/registry/sound-pulse.ts'),
  spContent
);

const suContent = createRegistryItem(
  'silkUnveil',
  'silk-unveil.tsx',
  path.join(__dirname, '../packages/ui/src/components/silk-unveil.tsx')
);
fs.writeFileSync(
  path.join(__dirname, '../packages/cli/src/registry/silk-unveil.ts'),
  suContent
);

console.log('Successfully synced registry items for sound-pulse and silk-unveil.');
