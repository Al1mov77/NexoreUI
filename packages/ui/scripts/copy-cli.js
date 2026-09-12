const fs = require('fs');
const path = require('path');

const cliDistPath = path.resolve(__dirname, '../../cli/dist/index.js');
const binDir = path.resolve(__dirname, '../bin');
const binTarget = path.join(binDir, 'nexoreui.js');

if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

if (fs.existsSync(cliDistPath)) {
  let content = fs.readFileSync(cliDistPath, 'utf8');
  if (!content.startsWith('#!/usr/bin/env node')) {
    content = `#!/usr/bin/env node\n${content}`;
  }
  fs.writeFileSync(binTarget, content, { encoding: 'utf8', mode: 0o755 });
  console.log('✔ Successfully copied CLI binary to packages/ui/bin/nexoreui.js');
} else {
  console.warn('⚠ packages/cli/dist/index.js not found. Please build packages/cli first.');
}
