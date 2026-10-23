import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { initCommand } from './init.js';
import { addCommand } from './add.js';

export type SupportedFramework = 'vite' | 'next' | 'next-app' | 'next-pages' | 'remix' | 'astro' | 'turbo' | 'monorepo';

export interface CreateOptions {
  theme?: string;
  radius?: string;
  template?: string;
  framework?: string;
  font?: string;
  density?: string;
  animation?: string;
  mode?: string;
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

export async function createCommand(projectName?: string, options: CreateOptions = {}) {
  const rawName = projectName || 'my-nexore-app';
  const name = rawName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-nexore-app';

  const rawFramework = (options.framework || options.template || 'vite').toLowerCase();
  if (!VALID_FRAMEWORKS.includes(rawFramework as SupportedFramework)) {
    console.error(
      `\x1b[31mError: Unsupported framework "${rawFramework}". Valid frameworks: vite, next, remix, astro, turbo\x1b[0m`
    );
    return;
  }

  const framework = rawFramework as SupportedFramework;
  const targetDir = path.resolve(process.cwd(), name);

  console.log(`\n\x1b[36m\x1b[1mCreating a new NexoreUI Project:\x1b[0m \x1b[32m${name}\x1b[0m (${framework})\n`);

  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    console.error(`\x1b[31mError: Target directory ${name} already exists and is not empty.\x1b[0m`);
    return;
  }

  // 1. Scaffold base template according to chosen framework
  console.log(`\x1b[33mStep 1/4: Scaffolding project with ${framework}...\x1b[0m`);
  try {
    if (framework === 'next' || framework === 'next-app' || framework === 'next-pages') {
      execSync(`npx -y create-next-app@latest ${name} --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --yes`, {
        stdio: 'inherit',
      });
    } else if (framework === 'astro') {
      execSync(`npx -y create-astro@latest ${name} --template minimal --no-install --no-git --typescript strict`, {
        stdio: 'inherit',
      });
    } else if (framework === 'remix') {
      execSync(`npx -y create-remix@latest ${name} --template remix-run/remix/templates/remix --typescript --no-install`, {
        stdio: 'inherit',
      });
    } else if (framework === 'turbo' || framework === 'monorepo') {
      execSync(`npx -y create-turbo@latest ${name} --example basic --no-deps`, {
        stdio: 'inherit',
      });
    } else {
      // Default: vite
      execSync(`npx -y create-vite@latest ${name} --template react-ts --no-immediate --no-interactive`, {
        stdio: 'inherit',
      });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`\x1b[31mFailed to scaffold ${framework} project: ${errorMsg}\x1b[0m`);
    return;
  }

  // 2. Change directory and install dependencies
  process.chdir(targetDir);
  console.log(`\n\x1b[33mStep 2/4: Installing NexoreUI core packages and icons...\x1b[0m`);
  try {
    if (framework === 'vite') {
      execSync(`npm install --legacy-peer-deps lucide-react clsx tailwind-merge framer-motion class-variance-authority @tailwindcss/vite tailwindcss`, {
        stdio: 'inherit',
      });
      execSync(`npm install -D --legacy-peer-deps @types/node`, { stdio: 'inherit' });
    } else if (framework === 'astro') {
      execSync(`npm install --legacy-peer-deps @astrojs/react @astrojs/tailwind lucide-react clsx tailwind-merge framer-motion class-variance-authority tailwindcss`, {
        stdio: 'inherit',
      });
    } else {
      execSync(`npm install --legacy-peer-deps lucide-react clsx tailwind-merge framer-motion class-variance-authority`, {
        stdio: 'inherit',
      });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`\x1b[33mWarning during dependency installation: ${errorMsg}\x1b[0m`);
  }

  // 3. Run automated NexoreUI initialization
  console.log(`\n\x1b[33mStep 3/4: Configuring theme and design tokens...\x1b[0m`);
  await initCommand({
    yes: true,
    theme: options.theme || 'slate',
    radius: options.radius || '0.625',
    font: options.font || 'geist',
    density: options.density,
    animation: options.animation,
    mode: options.mode,
  });

  // 4. Add starter UI components (Button, Card)
  console.log(`\n\x1b[33mStep 4/4: Adding starter UI components (button, card)...\x1b[0m`);
  try {
    await addCommand(['button', 'card'], { yes: true });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`\x1b[33mNotice: Could not automatically pre-install button and card (${errorMsg}). You can run "npx nexoreui add button card" manually.\x1b[0m`);
  }

  // 5. Replace starter App if Vite
  if (framework === 'vite') {
    const appTsxPath = path.join(targetDir, 'src', 'App.tsx');
    const isNoAnim = options.animation === 'none';
    const starterAppCode = `import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Terminal, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 transition-colors selection:bg-primary/20">
      <div className="max-w-xl w-full space-y-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <Layers className="h-3.5 w-3.5" />
          <span>NexoreUI + Tailwind CSS v4</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Welcome to <span className="text-primary">NexoreUI</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Your project is fully configured with design tokens and modern components.
          </p>
        </div>

        <Card ${isNoAnim ? 'hover="none" animate={false} ' : ''}className="max-w-md mx-auto text-left shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Interactive Component Demo
            </CardTitle>
            <CardDescription className="text-xs">
              Click the button to test component state and styling.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50 border border-border">
              <span className="text-xs font-medium">Click Counter</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-sm bg-primary/15 text-primary">
                {count} clicks
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button ${isNoAnim ? 'animate={false} ' : ''}onClick={() => setCount((c) => c + 1)} className="flex-1">
                Increment Count
              </Button>
              <Button ${isNoAnim ? 'animate={false} ' : ''}variant="outline" onClick={() => setCount(0)}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="p-3.5 rounded-md bg-muted/40 border border-border text-xs text-muted-foreground font-mono inline-flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary shrink-0" />
          <span>npx nexoreui add --all</span>
        </div>
      </div>
    </main>
  );
}
`;

    try {
      fs.writeFileSync(appTsxPath, starterAppCode, 'utf8');
    } catch {}

    const appCssPath = path.join(targetDir, 'src', 'App.css');
    if (fs.existsSync(appCssPath)) {
      try {
        fs.writeFileSync(appCssPath, '/* NexoreUI styles loaded from src/index.css */\n', 'utf8');
      } catch {}
    }
  }

  console.log(`\n\x1b[32m\x1b[1mProject ${name} is ready with NexoreUI!\x1b[0m\n`);
  console.log(`To get started:`);
  console.log(`  \x1b[36mcd ${name}\x1b[0m`);
  console.log(`  \x1b[36mnpm run dev\x1b[0m\n`);
  console.log(`To install components:`);
  console.log(`  \x1b[36mnpx nexoreui add --all\x1b[0m\n`);
}
