import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import type { PackageManager, ProjectType } from './detect.js';

export interface ThemePalette {
  light: string;
  lightFg: string;
  dark: string;
  darkFg: string;
  ringLight: string;
  ringDark: string;
  rgbLight: string;
  rgbDark: string;
}

export const THEME_PALETTES: Record<string, ThemePalette> = {
  slate: {
    light: 'hsl(240 5.9% 10%)',
    lightFg: 'hsl(0 0% 98%)',
    dark: 'hsl(0 0% 98%)',
    darkFg: 'hsl(240 5.9% 10%)',
    ringLight: 'hsl(240 10% 3.9%)',
    ringDark: 'hsl(240 4.9% 83.9%)',
    rgbLight: '24 24 27',
    rgbDark: '250 250 250',
  },
  zinc: {
    light: 'hsl(240 5.9% 10%)',
    lightFg: 'hsl(0 0% 98%)',
    dark: 'hsl(0 0% 98%)',
    darkFg: 'hsl(240 5.9% 10%)',
    ringLight: 'hsl(240 10% 3.9%)',
    ringDark: 'hsl(240 4.9% 83.9%)',
    rgbLight: '24 24 27',
    rgbDark: '250 250 250',
  },
  indigo: {
    light: 'hsl(243 75% 59%)',
    lightFg: 'hsl(0 0% 100%)',
    dark: 'hsl(239 84% 67%)',
    darkFg: 'hsl(0 0% 100%)',
    ringLight: 'hsl(243 75% 59%)',
    ringDark: 'hsl(239 84% 67%)',
    rgbLight: '79 70 229',
    rgbDark: '129 140 248',
  },
  violet: {
    light: 'hsl(262.1 83.3% 57.8%)',
    lightFg: 'hsl(0 0% 100%)',
    dark: 'hsl(263.4 70% 58%)',
    darkFg: 'hsl(0 0% 100%)',
    ringLight: 'hsl(262.1 83.3% 57.8%)',
    ringDark: 'hsl(263.4 70% 58%)',
    rgbLight: '124 58 237',
    rgbDark: '139 92 246',
  },
  emerald: {
    light: 'hsl(142.1 76.2% 36.3%)',
    lightFg: 'hsl(0 0% 100%)',
    dark: 'hsl(142.1 70.6% 45.3%)',
    darkFg: 'hsl(240 10% 3.9%)',
    ringLight: 'hsl(142.1 76.2% 36.3%)',
    ringDark: 'hsl(142.1 70.6% 45.3%)',
    rgbLight: '22 163 74',
    rgbDark: '34 197 94',
  },
  rose: {
    light: 'hsl(346.8 77.2% 49.8%)',
    lightFg: 'hsl(0 0% 100%)',
    dark: 'hsl(346.8 77.2% 55%)',
    darkFg: 'hsl(0 0% 100%)',
    ringLight: 'hsl(346.8 77.2% 49.8%)',
    ringDark: 'hsl(346.8 77.2% 55%)',
    rgbLight: '225 29 72',
    rgbDark: '244 63 94',
  },
  amber: {
    light: 'hsl(32 95% 44%)',
    lightFg: 'hsl(0 0% 100%)',
    dark: 'hsl(38 92% 50%)',
    darkFg: 'hsl(240 10% 3.9%)',
    ringLight: 'hsl(32 95% 44%)',
    ringDark: 'hsl(38 92% 50%)',
    rgbLight: '217 119 6',
    rgbDark: '245 158 11',
  },
  orange: {
    light: 'hsl(20.5 90.2% 48.2%)',
    lightFg: 'hsl(0 0% 100%)',
    dark: 'hsl(24.6 95% 53.1%)',
    darkFg: 'hsl(240 10% 3.9%)',
    ringLight: 'hsl(20.5 90.2% 48.2%)',
    ringDark: 'hsl(24.6 95% 53.1%)',
    rgbLight: '234 88 12',
    rgbDark: '249 115 22',
  },
  cyan: {
    light: 'hsl(191.6 91.4% 36.5%)',
    lightFg: 'hsl(0 0% 100%)',
    dark: 'hsl(188.7 94.5% 42.7%)',
    darkFg: 'hsl(240 10% 3.9%)',
    ringLight: 'hsl(191.6 91.4% 36.5%)',
    ringDark: 'hsl(188.7 94.5% 42.7%)',
    rgbLight: '8 145 178',
    rgbDark: '6 182 212',
  },
  sky: {
    light: 'hsl(200.4 98% 39.4%)',
    lightFg: 'hsl(0 0% 100%)',
    dark: 'hsl(198.6 88.7% 48.4%)',
    darkFg: 'hsl(240 10% 3.9%)',
    ringLight: 'hsl(200.4 98% 39.4%)',
    ringDark: 'hsl(198.6 88.7% 48.4%)',
    rgbLight: '2 132 199',
    rgbDark: '14 165 233',
  },
  neon: {
    light: 'hsl(173 80% 34%)',
    lightFg: 'hsl(0 0% 100%)',
    dark: 'hsl(173 95% 48%)',
    darkFg: 'hsl(240 10% 3.9%)',
    ringLight: 'hsl(173 80% 34%)',
    ringDark: 'hsl(173 95% 48%)',
    rgbLight: '17 156 140',
    rgbDark: '6 239 211',
  },
  crimson: {
    light: 'hsl(0 72.2% 50.6%)',
    lightFg: 'hsl(0 0% 100%)',
    dark: 'hsl(0 84.2% 60.2%)',
    darkFg: 'hsl(0 0% 100%)',
    ringLight: 'hsl(0 72.2% 50.6%)',
    ringDark: 'hsl(0 84.2% 60.2%)',
    rgbLight: '220 38 38',
    rgbDark: '239 68 68',
  },
};

export interface FontConfig {
  sans: string;
  mono: string;
  label: string;
  googleFontsHref: string | null;
}

export const FONT_CONFIGS: Record<string, FontConfig> = {
  geist: {
    sans: "'Geist', system-ui, -apple-system, sans-serif",
    mono: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    label: 'Geist',
    googleFontsHref:
      'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap',
  },
  inter: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    label: 'Inter',
    googleFontsHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
  },
  jetbrains: {
    sans: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    label: 'JetBrains Mono',
    googleFontsHref:
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  },
  system: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    label: 'System UI',
    googleFontsHref: null,
  },
};

export const DENSITY_CONFIGS: Record<string, { scale: string; padding: string; gap: string }> = {
  compact: { scale: '0.875', padding: '0.75rem', gap: '0.5rem' },
  default: { scale: '1', padding: '1.25rem', gap: '0.875rem' },
  relaxed: { scale: '1.125', padding: '1.75rem', gap: '1.25rem' },
};

export const ANIMATION_CONFIGS: Record<string, { duration: string; ease: string }> = {
  none: { duration: '0s', ease: 'linear' },
  subtle: { duration: '0.28s', ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  energetic: { duration: '0.16s', ease: 'cubic-bezier(0.22, 1, 0.36, 1)' },
};

function cleanJsonc(input: string): string {
  let out = '';
  let inString = false;
  let escaped = false;
  let i = 0;

  while (i < input.length) {
    const ch = input[i];
    const next = input[i + 1];

    if (inString) {
      out += ch;
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      i++;
      continue;
    }

    if (ch === '"') {
      inString = true;
      out += ch;
      i++;
      continue;
    }

    if (ch === '/' && next === '/') {
      while (i < input.length && input[i] !== '\n') i++;
      continue;
    }

    if (ch === '/' && next === '*') {
      i += 2;
      while (i < input.length && !(input[i] === '*' && input[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    out += ch;
    i++;
  }

  return out.replace(/,\s*([}\]])/g, '$1');
}

export function ensurePathAlias(
  baseDir: string,
  projectType: ProjectType,
  hasSrcDir: boolean
): boolean {
  let updated = false;

  const configsToCheck = [
    path.join(baseDir, 'tsconfig.app.json'),
    path.join(baseDir, 'tsconfig.json'),
    path.join(baseDir, 'jsconfig.json'),
  ];

  const aliasKey = projectType === 'remix' ? '~/*' : '@/*';
  const aliasTarget =
    projectType === 'remix' ? ['./app/*'] : hasSrcDir ? ['./src/*'] : ['./*'];

  for (const targetConfig of configsToCheck) {
    if (fs.existsSync(targetConfig)) {
      try {
        const content = fs.readFileSync(targetConfig, 'utf8');
        const parsed = JSON.parse(cleanJsonc(content));
        parsed.compilerOptions = parsed.compilerOptions || {};
        parsed.compilerOptions.paths = parsed.compilerOptions.paths || {};

        if (!parsed.compilerOptions.paths[aliasKey]) {
          parsed.compilerOptions.paths[aliasKey] = aliasTarget;
          fs.writeFileSync(targetConfig, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
          updated = true;
        }
      } catch {
      }
    }
  }

  if (projectType === 'vite') {
    const viteConfigFiles = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs'];
    for (const fileName of viteConfigFiles) {
      const vitePath = path.join(baseDir, fileName);
      if (fs.existsSync(vitePath)) {
        let viteContent = fs.readFileSync(vitePath, 'utf8');
        let changed = false;

        if (!viteContent.includes('alias') && !viteContent.includes("'@'")) {
          const hasUrlImport =
            viteContent.includes("from 'url'") ||
            viteContent.includes('from "url"') ||
            viteContent.includes("from 'node:url'") ||
            viteContent.includes('from "node:url"');
          const headerAddition = hasUrlImport
            ? ''
            : "import { fileURLToPath, URL } from 'node:url'\n";

          if (viteContent.includes('defineConfig({')) {
            viteContent =
              headerAddition +
              viteContent.replace(
                'defineConfig({',
                `defineConfig({\n  resolve: {\n    alias: {\n      '@': fileURLToPath(new URL('./${hasSrcDir ? 'src' : '.'}', import.meta.url)),\n    },\n  },`
              );
            changed = true;
          }
        }

        if (!viteContent.includes('@tailwindcss/vite')) {
          if (viteContent.includes('plugins: [')) {
            viteContent = `import tailwindcss from '@tailwindcss/vite'\n` + viteContent;
            viteContent = viteContent.replace(/plugins:\s*\[/, 'plugins: [tailwindcss(), ');
            changed = true;
          }
        }

        if (changed) {
          fs.writeFileSync(vitePath, viteContent, 'utf8');
          updated = true;
        }
        break;
      }
    }
  }

  if (projectType === 'astro') {
    const astroConfigFiles = ['astro.config.mjs', 'astro.config.ts', 'astro.config.js'];
    for (const fileName of astroConfigFiles) {
      const astroPath = path.join(baseDir, fileName);
      if (fs.existsSync(astroPath)) {
        const content = fs.readFileSync(astroPath, 'utf8');
        if (!content.includes('@astrojs/react') || !content.includes('@tailwindcss/vite')) {
          const nextAstroConfig = `import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
`;
          fs.writeFileSync(astroPath, nextAstroConfig, 'utf8');
          updated = true;
        }
        break;
      }
    }
  }

  return updated;
}

export function buildThemeCss(
  themeName: string,
  radiusValue: string | number,
  fontFamily: string = 'geist',
  density: string = 'default',
  animationStyle: string = 'subtle'
): string {
  const normalizedTheme = themeName.toLowerCase().trim();
  const palette = THEME_PALETTES[normalizedTheme] || THEME_PALETTES.slate;
  const radius =
    typeof radiusValue === 'number'
      ? radiusValue
      : radiusValue !== undefined && !isNaN(parseFloat(radiusValue as string))
        ? parseFloat(radiusValue as string)
        : 0.625;

  const fontConfig = FONT_CONFIGS[fontFamily] || FONT_CONFIGS.geist;
  const densityConfig = DENSITY_CONFIGS[density] || DENSITY_CONFIGS.default;
  const animConfig = ANIMATION_CONFIGS[animationStyle] || ANIMATION_CONFIGS.subtle;

  const reducedMotionCss =
    animationStyle === 'none'
      ? `
*,
*::before,
*::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
`
      : `
:root[data-animation="none"] *,
:root[data-animation="none"] *::before,
:root[data-animation="none"] *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
`;

  return `/* NexoreUI Theme Tokens */
@theme inline {
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
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: max(0px, calc(var(--radius) - 4px));
  --radius-md: max(0px, calc(var(--radius) - 2px));
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --font-sans: ${fontConfig.sans};
  --font-mono: ${fontConfig.mono};
}

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 3.9%);
  --primary: ${palette.light};
  --primary-foreground: ${palette.lightFg};
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
  --ring: ${palette.ringLight};
  --primary-rgb: ${palette.rgbLight};
  --radius: ${radius}rem;
  --success: hsl(142 71% 36%);
  --success-foreground: hsl(0 0% 100%);
  --warning: hsl(32 95% 44%);
  --warning-foreground: hsl(0 0% 100%);
  --info: hsl(221 83% 53%);
  --info-foreground: hsl(0 0% 100%);
  --chart-1: hsl(240 5.9% 10%);
  --chart-2: hsl(240 4% 30%);
  --chart-3: hsl(240 3.8% 46%);
  --chart-4: hsl(240 5% 65%);
  --chart-5: hsl(240 5.9% 80%);
  --density-scale: ${densityConfig.scale};
  --density-padding: ${densityConfig.padding};
  --density-gap: ${densityConfig.gap};
  --motion-duration: ${animConfig.duration};
  --motion-ease: ${animConfig.ease};
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(240 10% 3.9%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(240 10% 3.9%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: ${palette.dark};
  --primary-foreground: ${palette.darkFg};
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
  --ring: ${palette.ringDark};
  --primary-rgb: ${palette.rgbDark};
  --radius: ${radius}rem;
  --success: hsl(142 69% 58%);
  --success-foreground: hsl(240 10% 3.9%);
  --warning: hsl(43 96% 56%);
  --warning-foreground: hsl(240 10% 3.9%);
  --info: hsl(213 94% 68%);
  --info-foreground: hsl(240 10% 3.9%);
  --chart-1: hsl(0 0% 98%);
  --chart-2: hsl(240 5% 80%);
  --chart-3: hsl(240 5% 64.9%);
  --chart-4: hsl(240 4% 46%);
  --chart-5: hsl(240 3.7% 30%);
  --density-scale: ${densityConfig.scale};
  --density-padding: ${densityConfig.padding};
  --density-gap: ${densityConfig.gap};
  --motion-duration: ${animConfig.duration};
  --motion-ease: ${animConfig.ease};
}

@layer base {
  * {
    border-color: var(--border);
  }
  html,
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

.animate-accordion-down { animation: accordion-down 0.2s ease-out; }
.animate-accordion-up { animation: accordion-up 0.2s ease-out; }
${reducedMotionCss}
/* End NexoreUI Theme Tokens */`;
}

export function injectThemeCss(
  baseDir: string,
  cssRelativePath: string,
  themeName: string,
  radiusValue: string | number,
  fontFamily: string = 'geist',
  density: string = 'default',
  animationStyle: string = 'subtle',
  replaceExisting: boolean = false
): boolean {
  const cssAbsolutePath = path.join(baseDir, cssRelativePath);
  const themeBlock = buildThemeCss(themeName, radiusValue, fontFamily, density, animationStyle);

  const cssDir = path.dirname(cssAbsolutePath);
  if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });

  if (!replaceExisting && fs.existsSync(cssAbsolutePath)) {
    const existing = fs.readFileSync(cssAbsolutePath, 'utf8');
    const startMarker = '/* NexoreUI Theme Tokens */';
    const endMarker = '/* End NexoreUI Theme Tokens */';
    const startIdx = existing.indexOf(startMarker);
    const endIdx = existing.indexOf(endMarker);

    let nextCss = existing;
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      nextCss =
        existing.slice(0, startIdx) +
        themeBlock +
        existing.slice(endIdx + endMarker.length);
    } else {
      const needsTailwindImport = !/@import\s+["']tailwindcss["']/.test(existing);
      const needsDarkVariant = !existing.includes('@custom-variant dark');
      const prefix = [
        needsTailwindImport ? '@import "tailwindcss";' : '',
        needsDarkVariant ? '@custom-variant dark (&:where(.dark, .dark *));' : '',
      ]
        .filter(Boolean)
        .join('\n\n');
      nextCss = `${prefix ? prefix + '\n\n' : ''}${existing.trimEnd()}\n\n${themeBlock}\n`;
    }
    fs.writeFileSync(cssAbsolutePath, nextCss, 'utf8');
    return true;
  }

  const cleanFullCss = `@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

${themeBlock}
`;

  fs.writeFileSync(cssAbsolutePath, cleanFullCss, 'utf8');
  return true;
}

export function installPeerDependencies(
  baseDir: string,
  packageManager: PackageManager,
  dependencies: string[] = [
    'clsx',
    'tailwind-merge',
    'lucide-react',
    'framer-motion',
    'class-variance-authority',
  ]
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

    console.log(`\n\x1b[33mInstalling peer dependencies:\x1b[0m ${missingDeps.join(', ')}...`);
    execSync(`${installCmd} ${missingDeps.join(' ')}`, {
      stdio: 'inherit',
      cwd: baseDir,
    });
    return true;
  } catch {
    console.warn('\x1b[33mWarning: Automatic peer dependency installation skipped.\x1b[0m');
    return false;
  }
}
