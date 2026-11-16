const fs = require('fs');
const path = require('path');

const uiDir = path.resolve(__dirname, '../packages/ui/src/components');
const regDir = path.resolve(__dirname, '../packages/cli/src/registry');

const regFiles = fs.readdirSync(regDir).filter(
  (f) => f.endsWith('.ts') && f !== 'index.ts' && !f.startsWith('template-')
);

let updated = 0;

for (const rf of regFiles) {
  const base = rf.replace('.ts', '');
  const uiFile = path.join(uiDir, base + '.tsx');
  if (!fs.existsSync(uiFile)) continue;

  const uiSrc = fs.readFileSync(uiFile, 'utf8');
  const regPath = path.join(regDir, rf);
  const regSrc = fs.readFileSync(regPath, 'utf8');

  const contentIdx = regSrc.indexOf('content: ');
  if (contentIdx === -1) {
    console.log('Skipping (no content key):', rf);
    continue;
  }

  const header = regSrc.slice(0, contentIdx + 'content: '.length);
  const esc = uiSrc.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  const newRegContent = header + '`' + esc + '`\n};\n';

  fs.writeFileSync(regPath, newRegContent, 'utf8');
  updated++;
}

console.log(`Successfully synced ${updated} component registry files from packages/ui/src/components/`);
