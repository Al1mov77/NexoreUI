import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { detectProject, type PackageManager } from '../utils/detect.js';
import { ensureCnUtil, ensureDir } from '../utils/copy.js';
import {
  ensurePathAlias,
  injectThemeCss,
  installPeerDependencies,
  THEME_PALETTES,
} from '../utils/config.js';
import { getGoogleFontsTags, getThemeInitInlineJs } from '../utils/starter.js';

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
  framework?: string;
  pm?: PackageManager;
  replaceCss?: boolean;
}

export async function initCommand(options: InitOptions = {}) {
  console.log(`\n\x1b[36m\x1b[1m=== Initializing NexoreUI in your project ===\x1b[0m\n`);

  const project = detectProject(process.cwd());
  const packageManager = options.pm || project.packageManager;
  console.log(`\x1b[32mOK Detected Project:\x1b[0m ${project.projectType.toUpperCase()} (${packageManager})`);

  let theme = (options.theme || 'slate').toLowerCase();
  if (!THEME_PALETTES[theme]) theme = 'slate';
  let radius = options.radius || '0.625';
  const font = (options.font || 'geist').toLowerCase();
  const density = (options.density || 'default').toLowerCase();
  const animation = (options.animation || 'subtle').toLowerCase();
  const mode = (options.mode || 'system').toLowerCase();

  const isRemix = project.projectType === 'remix' || options.framework === 'remix';
  const isAstro = project.projectType === 'astro' || options.framework === 'astro';
  const isNextPages =
    options.framework === 'next-pages' ||
    (project.projectType === 'next' && project.isNextPagesRouter);

  const defaultComponentsDir = isRemix
    ? 'app/components/ui'
    : project.hasSrcDir
      ? 'src/components/ui'
      : 'components/ui';
  const defaultUtilsFile = isRemix
    ? 'app/lib/utils.ts'
    : project.hasSrcDir
      ? 'src/lib/utils.ts'
      : 'lib/utils.ts';

  let defaultCssFile = 'src/index.css';
  if (isAstro) {
    defaultCssFile = 'src/styles/global.css';
  } else if (isRemix) {
    defaultCssFile = 'app/tailwind.css';
  } else if (isNextPages) {
    defaultCssFile = project.hasSrcDir ? 'src/styles/globals.css' : 'styles/globals.css';
  } else if (project.projectType === 'next' || options.framework === 'next' || options.framework === 'next-app') {
    defaultCssFile = project.hasSrcDir ? 'src/app/globals.css' : 'app/globals.css';
  } else {
    defaultCssFile = project.hasSrcDir ? 'src/index.css' : 'index.css';
  }

  let componentsDir = defaultComponentsDir;
  let utilsFile = defaultUtilsFile;

  if (!options.yes) {
    if (!options.theme) {
      const themeAns = await askQuestion(
        `Which color theme would you like to use? (slate, zinc, indigo, violet, emerald, rose, amber, orange, cyan, sky, neon, crimson) [default: slate]: `
      );
      if (themeAns.trim() && THEME_PALETTES[themeAns.trim().toLowerCase()]) {
        theme = themeAns.trim().toLowerCase();
      }
    }

    if (!options.radius) {
      const radiusAns = await askQuestion(
        `Which radius value would you like to use? (0, 0.3, 0.5, 0.625, 0.75, 1.0) [default: 0.625]: `
      );
      if (radiusAns.trim()) {
        radius = radiusAns.trim();
      }
    }

    const compAns = await askQuestion(
      `Where should UI components be created? (default: ${defaultComponentsDir}): `
    );
    if (compAns.trim()) componentsDir = compAns.trim();

    const utilsAns = await askQuestion(
      `Where should utility functions (cn helper) be placed? (default: ${defaultUtilsFile}): `
    );
    if (utilsAns.trim()) utilsFile = utilsAns.trim();
  }

  const absoluteComponentsDir = path.resolve(project.baseDir, componentsDir);
  const absoluteUtilsFile = path.resolve(project.baseDir, utilsFile);

  ensureDir(absoluteComponentsDir);
  ensureCnUtil(absoluteUtilsFile);

  const didUpdateAlias = ensurePathAlias(project.baseDir, project.projectType, project.hasSrcDir);
  if (didUpdateAlias) {
    const aliasLabel = isRemix ? '~/*' : '@/*';
    console.log(`\x1b[32mOK\x1b[0m Configured path alias \x1b[1m'${aliasLabel}'\x1b[0m in project config`);
  }

  const didInjectCss = injectThemeCss(
    project.baseDir,
    defaultCssFile,
    theme,
    radius,
    font,
    density,
    animation,
    Boolean(options.replaceCss)
  );
  if (didInjectCss) {
    console.log(`\x1b[32mOK\x1b[0m Injected Tailwind CSS v4 tokens into \x1b[1m${defaultCssFile}\x1b[0m`);
  }

  const indexHtmlPath = path.join(project.baseDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    try {
      let html = fs.readFileSync(indexHtmlPath, 'utf8');

      html = html.replace(/<html(\s+[^>]*)?>/i, (match) => {
        let updated = match;
        if (mode === 'dark') {
          if (updated.includes('class="')) {
            if (!updated.includes('dark')) {
              updated = updated.replace('class="', 'class="dark ');
            }
          } else {
            updated = updated.replace('<html', '<html class="dark"');
          }
        }
        if (!updated.includes('data-density=')) {
          updated = updated.replace(/>$/, ` data-density="${density}">`);
        }
        if (!updated.includes('data-animation=')) {
          updated = updated.replace(/>$/, ` data-animation="${animation}">`);
        }
        return updated;
      });

      const fontTags = getGoogleFontsTags(font);
      if (fontTags && !html.includes('fonts.googleapis.com')) {
        html = html.replace('</head>', `${fontTags}\n  </head>`);
      }

      if (!html.includes('nexore-theme')) {
        const initScript = getThemeInitInlineJs(mode);
        html = html.replace('</head>', `    <script>${initScript}</script>\n  </head>`);
      }

      fs.writeFileSync(indexHtmlPath, html, 'utf8');
    } catch {
    }
  }

  if (options.install !== false) {
    installPeerDependencies(project.baseDir, packageManager);
  }

  const aliasPrefix = isRemix ? '~/' : '@/';
  const stripRootPrefix = isRemix ? /^app\// : /^src\//;

  const config = {
    $schema: 'https://www.nexoreui.com/schema.json',
    style: 'default',
    theme,
    radius: Number(radius),
    framework: options.framework || project.projectType,
    packageManager,
    font,
    density,
    animation,
    defaultMode: mode,
    tailwind: {
      css: defaultCssFile,
      baseColor: 'zinc',
      cssVariables: true,
    },
    aliases: {
      components: `${aliasPrefix}${componentsDir.replace(stripRootPrefix, '')}`,
      utils: `${aliasPrefix}${utilsFile.replace(stripRootPrefix, '').replace(/\.(ts|js)$/, '')}`,
    },
  };

  const configPath = path.join(project.baseDir, 'nexore.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');

  console.log(`\x1b[32mOK\x1b[0m Generated \x1b[1mnexore.json\x1b[0m (Theme: ${theme}, Radius: ${radius}rem, Font: ${font}, Density: ${density}, Motion: ${animation})`);
  console.log(`\x1b[32mOK\x1b[0m Utilities ready at \x1b[1m${utilsFile}\x1b[0m`);
  console.log(`\x1b[32mOK\x1b[0m Components directory ready at \x1b[1m${componentsDir}\x1b[0m`);

  console.log(`\n\x1b[32m\x1b[1mNexoreUI initialized. Add components with:\x1b[0m`);
  console.log(`  \x1b[36mnpx nexoreui add button card dialog --all\x1b[0m\n`);
}
