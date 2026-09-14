import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { detectProject } from '../utils/detect.js';
import { ensureCnUtil, ensureDir } from '../utils/copy.js';
import { ensurePathAlias, injectThemeCss, installPeerDependencies, THEME_PALETTES } from '../utils/config.js';

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

export interface InitOptions {
  yes?: boolean;
  theme?: string;
  radius?: string;
  install?: boolean;
  font?: string;
  density?: string;
  animation?: string;
  mode?: string;
}

export async function initCommand(options: InitOptions = {}) {
  console.log(`\n\x1b[36m\x1b[1m=== Initializing NexoreUI in your project ===\x1b[0m\n`);

  const project = detectProject(process.cwd());
  console.log(`\x1b[32m✔ Detected Project:\x1b[0m ${project.projectType.toUpperCase()} (${project.packageManager})`);

  let theme = options.theme || 'cyan';
  let radius = options.radius || '0.75';
  let font = options.font || 'system';
  let density = options.density || 'default';
  let animation = options.animation || 'energetic';
  let mode = options.mode || 'dark';

  const defaultComponentsDir = project.hasSrcDir ? 'src/components/ui' : 'components/ui';
  const defaultUtilsFile = project.hasSrcDir ? 'src/lib/utils.ts' : 'lib/utils.ts';
  const defaultCssFile = project.projectType === 'next' 
    ? (project.hasSrcDir ? 'src/app/globals.css' : 'app/globals.css') 
    : (project.hasSrcDir ? 'src/index.css' : 'src/index.css');

  let componentsDir = defaultComponentsDir;
  let utilsFile = defaultUtilsFile;

  if (!options.yes) {
    if (!options.theme) {
      const themeAns = await askQuestion(`Which color theme would you like to use? (cyan, indigo, violet, emerald, rose, amber, orange, slate, neon) [default: cyan]: `);
      if (themeAns.trim() && THEME_PALETTES[themeAns.trim().toLowerCase()]) {
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

  // 1. Ensure directories & cn helper
  ensureDir(absoluteComponentsDir);
  ensureCnUtil(absoluteUtilsFile);

  // 2. Configure Path Aliases (@/) automatically
  const didUpdateAlias = ensurePathAlias(project.baseDir, project.projectType, project.hasSrcDir);
  if (didUpdateAlias) {
    console.log(`\x1b[32m✔\x1b[0m Configured path alias \x1b[1m'@/*'\x1b[0m in project config`);
  }

  // 3. Inject Tailwind CSS v4 source & theme variables
  const didInjectCss = injectThemeCss(project.baseDir, defaultCssFile, theme, radius, font, density, animation);
  if (didInjectCss) {
    console.log(`\x1b[32m✔\x1b[0m Injected Tailwind CSS v4 @theme tokens into \x1b[1m${defaultCssFile}\x1b[0m`);
  }

  // Configure index.html (dark mode & Google Fonts)
  const indexHtmlPath = path.join(project.baseDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    try {
      let html = fs.readFileSync(indexHtmlPath, 'utf8');

      // 1. Configure dark/light mode class on <html>
      if (mode === 'dark' && !html.includes('class="dark"')) {
        html = html.replace(/<html(\s+[^>]*)?>/i, (match) => {
          if (match.includes('class="')) {
            return match.replace('class="', 'class="dark ');
          }
          return match.replace('<html', '<html class="dark"');
        });
      }

      // 2. Inject Google Fonts into <head> cleanly without PostCSS @import conflicts
      if (!html.includes('fonts.googleapis.com')) {
        const fontLinks = `    <!-- NexoreUI Fonts -->\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">\n  </head>`;
        html = html.replace('</head>', fontLinks);
      }

      fs.writeFileSync(indexHtmlPath, html, 'utf8');
    } catch {}
  }

  // 4. Install peer dependencies automatically
  installPeerDependencies(project.baseDir, project.packageManager);

  // 5. Write nexore.json config
  const config = {
    $schema: "https://nexoreui.site/schema.json",
    style: "default",
    theme: theme,
    radius: Number(radius),
    framework: project.projectType,
    packageManager: project.packageManager,
    font: font,
    density: density,
    animation: animation,
    defaultMode: mode,
    tailwind: {
      config: "tailwind.config.js",
      css: defaultCssFile,
      baseColor: "zinc",
      cssVariables: true,
    },
    aliases: {
      components: `@/${componentsDir.replace(/^src\//, '')}`,
      utils: `@/${utilsFile.replace(/^src\//, '').replace(/\.(ts|js)$/, '')}`,
    },
  };

  const configPath = path.join(project.baseDir, 'nexore.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

  console.log(`\x1b[32m✔\x1b[0m Generated \x1b[1mnexore.json\x1b[0m (Theme: ${theme}, Radius: ${radius}rem)`);
  console.log(`\x1b[32m✔\x1b[0m Utilities ready at \x1b[1m${utilsFile}\x1b[0m`);
  console.log(`\x1b[32m✔\x1b[0m Components directory ready at \x1b[1m${componentsDir}\x1b[0m`);

  console.log(`\n\x1b[32m\x1b[1m🎉 NexoreUI initialized successfully! You can now add components:\x1b[0m`);
  console.log(`  \x1b[36mnpx nexoreui add button card modal table --all\x1b[0m\n`);
}
