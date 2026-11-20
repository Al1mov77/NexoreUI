import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { initCommand } from './init.js';
import { addCommand } from './add.js';
import { detectPackageManagerFromEnv, type PackageManager } from '../utils/detect.js';
import {
  buildAstroIndexPage,
  buildNextAppLayout,
  buildNextPagesDocument,
  buildStarterWorkspaceTsx,
  buildViteIndexHtml,
} from '../utils/starter.js';

export type SupportedFramework =
  | 'vite'
  | 'next'
  | 'next-app'
  | 'next-pages'
  | 'remix'
  | 'astro'
  | 'turbo'
  | 'monorepo';

export interface CreateOptions {
  theme?: string;
  radius?: string;
  template?: string;
  framework?: string;
  font?: string;
  density?: string;
  animation?: string;
  mode?: string;
  components?: string[];
  all?: boolean;
  pm?: string;
}

const VALID_FRAMEWORKS: readonly SupportedFramework[] = [
  'vite',
  'next',
  'next-app',
  'next-pages',
  'remix',
  'astro',
  'turbo',
  'monorepo',
] as const;

const VALID_PMS: readonly PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'] as const;

function resolvePackageManager(rawPm?: string): PackageManager {
  const normalized = (rawPm || '').toLowerCase() as PackageManager;
  if (VALID_PMS.includes(normalized)) return normalized;
  return detectPackageManagerFromEnv() || 'npm';
}

function getPmCommands(pm: PackageManager) {
  switch (pm) {
    case 'pnpm':
      return {
        install: 'pnpm install',
        add: 'pnpm add',
        addDev: 'pnpm add -D',
        dev: 'pnpm dev',
        addRunner: 'pnpm dlx nexoreui add',
        nextFlag: '--use-pnpm',
      };
    case 'yarn':
      return {
        install: 'yarn install',
        add: 'yarn add',
        addDev: 'yarn add -D',
        dev: 'yarn dev',
        addRunner: 'yarn dlx nexoreui add',
        nextFlag: '--use-yarn',
      };
    case 'bun':
      return {
        install: 'bun install',
        add: 'bun add',
        addDev: 'bun add -d',
        dev: 'bun run dev',
        addRunner: 'bunx nexoreui add',
        nextFlag: '--use-bun',
      };
    case 'npm':
    default:
      return {
        install: 'npm install --legacy-peer-deps',
        add: 'npm install --legacy-peer-deps',
        addDev: 'npm install -D --legacy-peer-deps',
        dev: 'npm run dev',
        addRunner: 'npx nexoreui add',
        nextFlag: '--use-npm',
      };
  }
}

export async function createCommand(projectName?: string, options: CreateOptions = {}) {
  const rawName = projectName || 'my-nexore-app';
  const name =
    rawName
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/^-+|-+$/g, '') || 'my-nexore-app';

  const rawFramework = (options.framework || options.template || 'vite').toLowerCase();
  if (!VALID_FRAMEWORKS.includes(rawFramework as SupportedFramework)) {
    console.error(
      `\x1b[31mError: Unsupported framework "${rawFramework}". Valid frameworks: vite, next, next-pages, remix, astro, turbo\x1b[0m`
    );
    return;
  }

  const framework = rawFramework as SupportedFramework;
  const pm = resolvePackageManager(options.pm);
  const pmCmds = getPmCommands(pm);
  const theme = (options.theme || 'slate').toLowerCase();
  const radius = options.radius || '0.625';
  const font = (options.font || 'geist').toLowerCase();
  const density = (options.density || 'default').toLowerCase();
  const animation = (options.animation || 'subtle').toLowerCase();
  const mode = (options.mode || 'system').toLowerCase();

  const targetDir = path.resolve(process.cwd(), name);

  console.log(
    `\n\x1b[36m\x1b[1mCreating a new NexoreUI project:\x1b[0m \x1b[32m${name}\x1b[0m (${framework}, ${pm})\n`
  );

  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    console.error(`\x1b[31mError: Target directory ${name} already exists and is not empty.\x1b[0m`);
    return;
  }

  console.log(`\x1b[33mStep 1/4: Scaffolding project with ${framework}...\x1b[0m`);
  try {
    if (framework === 'next' || framework === 'next-app') {
      execSync(
        `npx -y create-next-app@latest ${name} --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" ${pmCmds.nextFlag} --yes`,
        { stdio: 'inherit' }
      );
    } else if (framework === 'next-pages') {
      execSync(
        `npx -y create-next-app@latest ${name} --typescript --tailwind --eslint --no-app --src-dir=false --import-alias="@/*" ${pmCmds.nextFlag} --yes`,
        { stdio: 'inherit' }
      );
    } else if (framework === 'astro') {
      execSync(
        `npx -y create-astro@latest ${name} --template minimal --no-install --no-git --typescript strict`,
        { stdio: 'inherit' }
      );
    } else if (framework === 'remix') {
      execSync(
        `npx -y create-remix@latest ${name} --template remix-run/remix/templates/remix --typescript --no-install`,
        { stdio: 'inherit' }
      );
    } else if (framework === 'turbo' || framework === 'monorepo') {
      execSync(`npx -y create-turbo@latest ${name} --example basic --no-deps`, {
        stdio: 'inherit',
      });
    } else {
      execSync(
        `npx -y create-vite@latest ${name} --template react-ts --no-immediate --no-interactive`,
        { stdio: 'inherit' }
      );
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`\x1b[31mFailed to scaffold ${framework} project: ${errorMsg}\x1b[0m`);
    return;
  }

  const isMonorepo = framework === 'turbo' || framework === 'monorepo';
  const appDir =
    isMonorepo && fs.existsSync(path.join(targetDir, 'apps', 'web'))
      ? path.join(targetDir, 'apps', 'web')
      : targetDir;

  process.chdir(appDir);

  console.log(`\n\x1b[33mStep 2/4: Installing NexoreUI dependencies...\x1b[0m`);
  try {
    if (framework === 'vite') {
      execSync(
        `${pmCmds.add} lucide-react clsx tailwind-merge framer-motion class-variance-authority @tailwindcss/vite tailwindcss`,
        { stdio: 'inherit', cwd: appDir }
      );
      execSync(`${pmCmds.addDev} @types/node`, { stdio: 'inherit', cwd: appDir });
    } else if (framework === 'astro') {
      execSync(
        `${pmCmds.add} @astrojs/react @tailwindcss/vite tailwindcss react react-dom lucide-react clsx tailwind-merge framer-motion class-variance-authority`,
        { stdio: 'inherit', cwd: appDir }
      );
      execSync(`${pmCmds.addDev} @types/react @types/react-dom @types/node`, {
        stdio: 'inherit',
        cwd: appDir,
      });
    } else if (framework === 'remix') {
      execSync(pmCmds.install, { stdio: 'inherit', cwd: appDir });
      execSync(
        `${pmCmds.add} lucide-react clsx tailwind-merge framer-motion class-variance-authority tailwindcss @tailwindcss/vite`,
        { stdio: 'inherit', cwd: appDir }
      );
    } else {
      execSync(
        `${pmCmds.add} lucide-react clsx tailwind-merge framer-motion class-variance-authority`,
        { stdio: 'inherit', cwd: appDir }
      );
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`\x1b[33mWarning during dependency installation: ${errorMsg}\x1b[0m`);
  }

  console.log(`\n\x1b[33mStep 3/4: Configuring theme and design tokens...\x1b[0m`);
  await initCommand({
    yes: true,
    theme,
    radius,
    font,
    density,
    animation,
    mode,
    framework: isMonorepo ? 'next-app' : framework,
    pm,
    install: false,
    replaceCss: true,
  });

  const requestedComponents =
    options.components && options.components.length > 0
      ? options.components
      : ['button', 'card', 'input', 'badge', 'switch'];

  if (options.all) {
    console.log(`\n\x1b[33mStep 4/4: Adding all NexoreUI registry components...\x1b[0m`);
  } else {
    console.log(
      `\n\x1b[33mStep 4/4: Adding selected UI components (${requestedComponents.join(', ')})...\x1b[0m`
    );
  }

  let installedComponents: string[] = [];
  try {
    installedComponents = await addCommand(options.all ? [] : requestedComponents, {
      yes: true,
      all: Boolean(options.all),
      pm,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(
      `\x1b[33mNotice: Could not install components (${errorMsg}). Run "${pmCmds.addRunner} ${requestedComponents.join(' ')}" manually.\x1b[0m`
    );
  }

  if (framework === 'vite') {
    const appTsxPath = path.join(appDir, 'src', 'App.tsx');
    const starterCode = buildStarterWorkspaceTsx({
      projectName: name,
      frameworkLabel: 'Vite + React',
      frameworkTag: 'vite',
      entryFile: 'src/App.tsx',
      cssPath: 'src/index.css',
      componentsDir: 'src/components/ui',
      importPrefix: '@',
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      packageManager: pm,
      installedComponents,
      includeUseClient: false,
    });

    try {
      fs.writeFileSync(appTsxPath, starterCode, 'utf8');
      fs.writeFileSync(
        path.join(appDir, 'index.html'),
        buildViteIndexHtml({ projectName: name, font, density, animation, mode }),
        'utf8'
      );
      const appCssPath = path.join(appDir, 'src', 'App.css');
      if (fs.existsSync(appCssPath)) {
        fs.unlinkSync(appCssPath);
      }
    } catch {
    }
  } else if (framework === 'next' || framework === 'next-app' || isMonorepo) {
    const hasSrcApp = fs.existsSync(path.join(appDir, 'src', 'app'));
    const appFolder = hasSrcApp ? path.join(appDir, 'src', 'app') : path.join(appDir, 'app');
    const componentsDirLabel = fs.existsSync(path.join(appDir, 'src'))
      ? 'src/components/ui'
      : 'components/ui';
    const entryFileLabel = hasSrcApp ? 'src/app/page.tsx' : 'app/page.tsx';
    const cssPathLabel = hasSrcApp ? 'src/app/globals.css' : 'app/globals.css';

    const starterCode = buildStarterWorkspaceTsx({
      projectName: name,
      frameworkLabel: isMonorepo ? 'Turborepo + Next.js' : 'Next.js App Router',
      frameworkTag: isMonorepo ? 'turbo' : 'next',
      entryFile: entryFileLabel,
      cssPath: cssPathLabel,
      componentsDir: componentsDirLabel,
      importPrefix: '@',
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      packageManager: pm,
      installedComponents,
      includeUseClient: true,
    });

    try {
      if (fs.existsSync(appFolder)) {
        fs.writeFileSync(
          path.join(appFolder, 'layout.tsx'),
          buildNextAppLayout({ projectName: name, font, density, animation, mode }),
          'utf8'
        );
        fs.writeFileSync(path.join(appFolder, 'page.tsx'), starterCode, 'utf8');
      }
    } catch {
    }
  } else if (framework === 'next-pages') {
    const hasSrcPages = fs.existsSync(path.join(appDir, 'src', 'pages'));
    const pagesFolder = hasSrcPages
      ? path.join(appDir, 'src', 'pages')
      : path.join(appDir, 'pages');
    const componentsDirLabel = fs.existsSync(path.join(appDir, 'src'))
      ? 'src/components/ui'
      : 'components/ui';
    const entryFileLabel = hasSrcPages ? 'src/pages/index.tsx' : 'pages/index.tsx';
    const cssPathLabel = hasSrcPages ? 'src/styles/globals.css' : 'styles/globals.css';

    const starterCode = buildStarterWorkspaceTsx({
      projectName: name,
      frameworkLabel: 'Next.js Pages Router',
      frameworkTag: 'next',
      entryFile: entryFileLabel,
      cssPath: cssPathLabel,
      componentsDir: componentsDirLabel,
      importPrefix: '@',
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      packageManager: pm,
      installedComponents,
      includeUseClient: false,
    });

    try {
      if (fs.existsSync(pagesFolder)) {
        fs.writeFileSync(
          path.join(pagesFolder, '_document.tsx'),
          buildNextPagesDocument({ font, density, animation, mode }),
          'utf8'
        );
        fs.writeFileSync(path.join(pagesFolder, 'index.tsx'), starterCode, 'utf8');
      }
    } catch {
    }
  } else if (framework === 'astro') {
    const compPath = path.join(appDir, 'src', 'components', 'StarterWorkspace.tsx');
    const indexAstroPath = path.join(appDir, 'src', 'pages', 'index.astro');

    const starterCode = buildStarterWorkspaceTsx({
      projectName: name,
      frameworkLabel: 'Astro + React',
      frameworkTag: 'astro',
      entryFile: 'src/components/StarterWorkspace.tsx',
      cssPath: 'src/styles/global.css',
      componentsDir: 'src/components/ui',
      importPrefix: '@',
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      packageManager: pm,
      installedComponents,
      includeUseClient: false,
    });

    try {
      fs.mkdirSync(path.dirname(compPath), { recursive: true });
      fs.writeFileSync(compPath, starterCode, 'utf8');
      fs.mkdirSync(path.dirname(indexAstroPath), { recursive: true });
      fs.writeFileSync(
        indexAstroPath,
        buildAstroIndexPage({ projectName: name, font, density, animation, mode }),
        'utf8'
      );
    } catch {
    }
  } else if (framework === 'remix') {
    const routePath = path.join(appDir, 'app', 'routes', '_index.tsx');
    const starterCode = buildStarterWorkspaceTsx({
      projectName: name,
      frameworkLabel: 'Remix',
      frameworkTag: 'remix',
      entryFile: 'app/routes/_index.tsx',
      cssPath: 'app/tailwind.css',
      componentsDir: 'app/components/ui',
      importPrefix: '~',
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      packageManager: pm,
      installedComponents,
      includeUseClient: false,
    });

    try {
      fs.mkdirSync(path.dirname(routePath), { recursive: true });
      fs.writeFileSync(routePath, starterCode, 'utf8');
    } catch {
    }
  }

  console.log(`\n\x1b[32m\x1b[1mProject ${name} is ready.\x1b[0m\n`);
  console.log(`Next steps:`);
  console.log(`  \x1b[36mcd ${name}\x1b[0m`);
  console.log(`  \x1b[36m${pmCmds.dev}\x1b[0m\n`);
  console.log(`Add more components anytime:`);
  console.log(`  \x1b[36m${pmCmds.addRunner} <component>\x1b[0m\n`);
}
