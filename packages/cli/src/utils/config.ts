import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import type { PackageManager, ProjectType } from './detect.js';

export const THEME_PALETTES: Record<string, { light: string; dark: string; rgb: string }> = {
  indigo: { light: 'hsl(250 85% 50%)', dark: 'hsl(250 85% 65%)', rgb: '99 60 220' },
  violet: { light: 'hsl(262.1 83.3% 57.8%)', dark: 'hsl(263.4 70% 50.4%)', rgb: '139 92 246' },
  emerald: { light: 'hsl(142.1 76.2% 36.3%)', dark: 'hsl(142.1 70.6% 45.3%)', rgb: '16 185 129' },
  rose: { light: 'hsl(346.8 77.2% 49.8%)', dark: 'hsl(346.8 77.2% 55%)', rgb: '244 63 94' },
  amber: { light: 'hsl(37.7 92.1% 50.2%)', dark: 'hsl(37.7 92.1% 55%)', rgb: '245 158 11' },
  orange: { light: 'hsl(24.6 95% 53.1%)', dark: 'hsl(24.6 95% 58%)', rgb: '249 115 22' },
  cyan: { light: 'hsl(190.4 95% 39%)', dark: 'hsl(188.7 94.5% 42.7%)', rgb: '6 182 212' },
  sky: { light: 'hsl(198.6 88.7% 48.4%)', dark: 'hsl(198.6 88.7% 55%)', rgb: '14 165 233' },
  slate: { light: 'hsl(240 5.9% 10%)', dark: 'hsl(0 0% 98%)', rgb: '244 244 245' },
  neon: { light: 'hsl(173 80% 40%)', dark: 'hsl(173 100% 50%)', rgb: '0 255 220' },
  crimson: { light: 'hsl(0 72% 51%)', dark: 'hsl(0 84% 60%)', rgb: '220 38 38' },
};

function stripJsonComments(str: string): string {
  return str
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^\\:])\/\/.*$/gm, '$1');
}

/**
 * Automatically configures `@` path alias in vite.config or tsconfig if missing.
 */
export function ensurePathAlias(baseDir: string, projectType: ProjectType, hasSrcDir: boolean): boolean {
  let updated = false;

  // 1. Check TypeScript / JavaScript config files
  const configsToCheck = [
    path.join(baseDir, 'tsconfig.app.json'),
    path.join(baseDir, 'tsconfig.json'),
    path.join(baseDir, 'jsconfig.json'),
  ];

  for (const targetConfig of configsToCheck) {
    if (fs.existsSync(targetConfig)) {
      try {
        const content = fs.readFileSync(targetConfig, 'utf8');
        const cleanContent = stripJsonComments(content);
        const parsed = JSON.parse(cleanContent);
        parsed.compilerOptions = parsed.compilerOptions || {};
        if (!parsed.compilerOptions.moduleResolution || parsed.compilerOptions.moduleResolution !== 'bundler') {
          parsed.compilerOptions.baseUrl = parsed.compilerOptions.baseUrl || '.';
        }
        parsed.compilerOptions.paths = parsed.compilerOptions.paths || {};

        const aliasTarget = hasSrcDir ? ['./src/*'] : ['./*'];
        if (!parsed.compilerOptions.paths['@/*']) {
          parsed.compilerOptions.paths['@/*'] = aliasTarget;
          fs.writeFileSync(targetConfig, JSON.stringify(parsed, null, 2), 'utf8');
          updated = true;
        }
      } catch {
        // If parsing fails, skip to avoid breaking custom configs
      }
    }
  }

  // 2. Check Vite Config
  if (projectType === 'vite') {
    const viteConfigFiles = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs'];
    for (const fileName of viteConfigFiles) {
      const vitePath = path.join(baseDir, fileName);
      if (fs.existsSync(vitePath)) {
        let viteContent = fs.readFileSync(vitePath, 'utf8');
        if (!viteContent.includes("alias") && !viteContent.includes("'@'")) {
          // Check if path import exists
          const hasPathImport = viteContent.includes("from 'path'") || viteContent.includes('from "path"');
          let headerAdditions = '';
          if (!hasPathImport) {
            headerAdditions += `import path from 'path'\nimport { fileURLToPath } from 'url'\nconst __dirname = path.dirname(fileURLToPath(import.meta.url))\n`;
          }

          if (viteContent.includes('defineConfig({')) {
            viteContent = headerAdditions + viteContent.replace(
              'defineConfig({',
              `defineConfig({\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './${hasSrcDir ? 'src' : '.'}'),\n    },\n  },`
            );
            fs.writeFileSync(vitePath, viteContent, 'utf8');
            updated = true;
          }
        }

        // Configure @tailwindcss/vite if missing
        if (!viteContent.includes('@tailwindcss/vite')) {
          let updatedVite = `import tailwindcss from '@tailwindcss/vite'\n` + viteContent;
          if (updatedVite.includes('plugins: [')) {
            updatedVite = updatedVite.replace(/plugins:\s*\[/, 'plugins: [tailwindcss(), ');
            fs.writeFileSync(vitePath, updatedVite, 'utf8');
            updated = true;
          }
        }
        break;
      }
    }
  }

  return updated;
}

/**
 * Injects Tailwind CSS v4 source directive and theme variables into the main CSS file.
 */
export function injectThemeCss(
  baseDir: string,
  cssRelativePath: string,
  themeName: string,
  radiusValue: string | number,
  fontFamily: string = 'system',
  density: string = 'default',
  animationStyle: string = 'energetic'
): boolean {
  const cssAbsolutePath = path.join(baseDir, cssRelativePath);
  const palette = THEME_PALETTES[themeName] || THEME_PALETTES.cyan;
  const radius = typeof radiusValue === 'number' ? radiusValue : parseFloat(radiusValue as string) || 0.75;

  const fontMap: Record<string, string> = {
    inter: "'Inter', sans-serif",
    geist: "'Geist', sans-serif",
    jetbrains: "'JetBrains Mono', monospace",
    system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };
  const selectedFont = fontMap[fontFamily] || fontMap.system;

  const densityPadding = density === 'compact' ? '0.5rem' : density === 'relaxed' ? '1.25rem' : '0.75rem';
  const densityGap = density === 'compact' ? '0.375rem' : density === 'relaxed' ? '1rem' : '0.5rem';

  let animationCss = '';
  if (animationStyle === 'none') {
    animationCss = `
/* NexoreUI Animation Style: None */
*, *::before, *::after {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
}
`;
  } else if (animationStyle === 'subtle') {
    animationCss = `
:root {
  --motion-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-duration: 0.35s;
}
`;
  } else {
    animationCss = `
:root {
  --motion-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
  --motion-duration: 0.2s;
}
`;
  }

  const themeBlock = `/* NexoreUI Theme Tokens */
@source "../node_modules/nexoreui/dist/**/*.{js,mjs}";

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: ${selectedFont};
}

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 3.9%);
  --primary: ${palette.light};
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(240 4.8% 95.9%);
  --secondary-foreground: hsl(240 5.9% 10%);
  --muted: hsl(240 4.8% 95.9%);
  --muted-foreground: hsl(240 3.8% 46.1%);
  --accent: hsl(240 4.8% 95.9%);
  --accent-foreground: hsl(240 5.9% 10%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(240 5.9% 90%);
  --input: hsl(240 5.9% 90%);
  --ring: ${palette.light};
  --radius: ${radius}rem;
  --glow-radius: 12px;
  --glow-strength: 0.15;
  --glow-color: ${palette.rgb};
  --density-padding: ${densityPadding};
  --density-gap: ${densityGap};
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(240 10% 3.9%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(240 10% 3.9%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: ${palette.dark};
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(240 3.7% 15.9%);
  --secondary-foreground: hsl(0 0% 98%);
  --muted: hsl(240 3.7% 15.9%);
  --muted-foreground: hsl(240 5% 64.9%);
  --accent: hsl(240 3.7% 15.9%);
  --accent-foreground: hsl(0 0% 98%);
  --destructive: hsl(0 62.8% 30.6%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(240 3.7% 15.9%);
  --input: hsl(240 3.7% 15.9%);
  --ring: ${palette.dark};
  --radius: ${radius}rem;
  --glow-radius: 20px;
  --glow-strength: 0.35;
  --glow-color: ${palette.rgb};
  --density-padding: ${densityPadding};
  --density-gap: ${densityGap};
}

body {
  background-color: var(--background);
  color: var(--foreground);
}
${animationCss}
/* End NexoreUI Theme Tokens */`;

  if (fs.existsSync(cssAbsolutePath)) {
    let existingContent = fs.readFileSync(cssAbsolutePath, 'utf8');
    // Remove Vite's default conflicting #root, body centering, and dark colors
    existingContent = existingContent.replace(/#root\s*\{[^}]*\}/g, '');
    existingContent = existingContent.replace(/:root\s*\{[^}]*color:\s*rgba\(255,\s*255,\s*255[^}]*\}/g, '');
    existingContent = existingContent.replace(/body\s*\{[^}]*place-items:\s*center[^}]*\}/g, '');

    // Check if theme tokens already exist to replace them
    if (existingContent.includes('/* NexoreUI Theme Tokens */')) {
      existingContent = existingContent.replace(
        /\/\* NexoreUI Theme Tokens \*\/[\s\S]*?\/\* End NexoreUI Theme Tokens \*\//,
        themeBlock
      );
      fs.writeFileSync(cssAbsolutePath, existingContent, 'utf8');
      return true;
    } else if (existingContent.includes('--color-primary')) {
      // Legacy theme block without comments, replace from @theme onwards
      existingContent = existingContent.replace(/(@source[\s\S]*|@theme[\s\S]*)/, themeBlock);
      fs.writeFileSync(cssAbsolutePath, existingContent, 'utf8');
      return true;
    } else {
      let finalContent = existingContent.trim() + '\n\n' + themeBlock;
      if (!finalContent.includes('@import "tailwindcss"') && !finalContent.includes("@import 'tailwindcss'")) {
        finalContent = '@import "tailwindcss";\n' + finalContent;
      }
      fs.writeFileSync(cssAbsolutePath, finalContent, 'utf8');
      return true;
    }
  } else {
    const cssDir = path.dirname(cssAbsolutePath);
    if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });
    fs.writeFileSync(cssAbsolutePath, `@import "tailwindcss";\n\n` + themeBlock, 'utf8');
    return true;
  }
}

/**
 * Automatically installs core peer dependencies if missing.
 */
export function installPeerDependencies(
  baseDir: string,
  packageManager: PackageManager,
  dependencies: string[] = ['clsx', 'tailwind-merge', 'lucide-react', 'framer-motion', 'class-variance-authority']
): boolean {
  try {
    const packageJsonPath = path.join(baseDir, 'package.json');
    let missingDeps = [...dependencies];

    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const installed = { ...pkg.dependencies, ...pkg.devDependencies };
      missingDeps = dependencies.filter((dep) => !installed[dep]);
    }

    if (missingDeps.length === 0) return true;

    let installCmd = 'npm install --legacy-peer-deps';
    if (packageManager === 'pnpm') installCmd = 'pnpm add';
    else if (packageManager === 'yarn') installCmd = 'yarn add';
    else if (packageManager === 'bun') installCmd = 'bun add';

    console.log(`\n\x1b[33m⚡ Installing peer dependencies:\x1b[0m ${missingDeps.join(', ')}...`);
    execSync(`${installCmd} ${missingDeps.join(' ')}`, {
      stdio: 'inherit',
      cwd: baseDir,
    });
    return true;
  } catch (err) {
    console.warn('\x1b[33mWarning: Automatic peer dependency installation skipped.\x1b[0m');
    return false;
  }
}
