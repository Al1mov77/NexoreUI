import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { detectProject } from '../utils/detect.js';
import { ensureCnUtil, ensureDir } from '../utils/copy.js';

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

const THEME_HEX: Record<string, { light: string; dark: string; rgb: string }> = {
  indigo: { light: 'hsl(250 85% 50%)', dark: 'hsl(250 85% 65%)', rgb: '99 60 220' },
  violet: { light: 'hsl(262.1 83.3% 57.8%)', dark: 'hsl(263.4 70% 50.4%)', rgb: '139 92 246' },
  emerald: { light: 'hsl(142.1 76.2% 36.3%)', dark: 'hsl(142.1 70.6% 45.3%)', rgb: '16 185 129' },
  rose: { light: 'hsl(346.8 77.2% 49.8%)', dark: 'hsl(346.8 77.2% 55%)', rgb: '244 63 94' },
  amber: { light: 'hsl(37.7 92.1% 50.2%)', dark: 'hsl(37.7 92.1% 55%)', rgb: '245 158 11' },
  cyan: { light: 'hsl(190.4 95% 39%)', dark: 'hsl(188.7 94.5% 42.7%)', rgb: '6 182 212' },
  slate: { light: 'hsl(240 5.9% 10%)', dark: 'hsl(0 0% 98%)', rgb: '244 244 245' },
  neon: { light: 'hsl(173 80% 40%)', dark: 'hsl(173 100% 50%)', rgb: '0 255 220' },
};

export async function initCommand(options: { yes?: boolean; theme?: string; radius?: string }) {
  console.log(`\n\x1b[34m\x1b[1m=== Initializing NexoreUI in your project ===\x1b[0m\n`);

  const project = detectProject(process.cwd());
  console.log(`\x1b[32mDetected Project:\x1b[0m ${project.projectType.toUpperCase()} (${project.packageManager})`);

  let theme = options.theme || 'indigo';
  let radius = options.radius || '0.75';
  const defaultComponentsDir = project.hasSrcDir ? 'src/components/ui' : 'components/ui';
  const defaultUtilsFile = project.hasSrcDir ? 'src/lib/utils.ts' : 'lib/utils.ts';
  const defaultCssFile = project.projectType === 'next' ? (project.hasSrcDir ? 'src/app/globals.css' : 'app/globals.css') : (project.hasSrcDir ? 'src/index.css' : 'src/index.css');

  let componentsDir = defaultComponentsDir;
  let utilsFile = defaultUtilsFile;

  if (!options.yes) {
    if (!options.theme) {
      const themeAns = await askQuestion(`Which color theme would you like to use? (indigo, violet, emerald, rose, amber, cyan, slate, neon) [default: indigo]: `);
      if (themeAns.trim() && THEME_HEX[themeAns.trim().toLowerCase()]) {
        theme = themeAns.trim().toLowerCase();
      }
    }

    if (!options.radius) {
      const radiusAns = await askQuestion(`Which radius value would you like to use? (0, 0.3, 0.5, 0.75, 1.0) [default: 0.75]: `);
      if (radiusAns.trim()) {
        radius = radiusAns.trim();
      }
    }

    const compAns = await askQuestion(`Where should UI components be created? (default: ${defaultComponentsDir}): `);
    if (compAns.trim()) componentsDir = compAns.trim();

    const utilsAns = await askQuestion(`Where should utility functions (cn helper) be placed? (default: ${defaultUtilsFile}): `);
    if (utilsAns.trim()) utilsFile = utilsAns.trim();
  }

  const absoluteComponentsDir = path.resolve(project.baseDir, componentsDir);
  const absoluteUtilsFile = path.resolve(project.baseDir, utilsFile);

  ensureDir(absoluteComponentsDir);
  ensureCnUtil(absoluteUtilsFile);

  // Write nexore.json config
  const config = {
    $schema: "https://nexoreui.site/schema.json",
    style: "default",
    theme: theme,
    radius: Number(radius),
    framework: project.projectType,
    tailwind: {
      config: "tailwind.config.js",
      css: defaultCssFile,
      baseColor: "zinc",
      cssVariables: true,
    },
    aliases: {
      components: `@/${componentsDir.replace(/^src\//, '')}`,
      utils: `@/${utilsFile.replace(/^src\//, '').replace(/\.ts$/, '')}`,
    },
  };

  const configPath = path.join(project.baseDir, 'nexore.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

  console.log(`\n\x1b[32m✔\x1b[0m Created \x1b[1mnexore.json\x1b[0m`);
  console.log(`\x1b[32m✔\x1b[0m Configured utilities at \x1b[1m${utilsFile}\x1b[0m`);
  console.log(`\x1b[32m✔\x1b[0m Components directory ready at \x1b[1${componentsDir}\x1b[0m`);

  const preset = THEME_HEX[theme] || THEME_HEX.indigo;
  console.log(`\n\x1b[33m\x1b[1mNext Step: Add theme variables to your ${defaultCssFile}:\x1b[0m`);
  console.log(`\x1b[90m
:root {
  --primary: ${preset.light};
  --radius: ${radius}rem;
}
.dark {
  --primary: ${preset.dark};
  --radius: ${radius}rem;
}
\x1b[0m`);

  console.log(`\x1b[32m\x1b[1mProject initialized successfully! You can now add components:\x1b[0m`);
  console.log(`  \x1b[34mnpx nexoreui add button card modal\x1b[0m\n`);
}
