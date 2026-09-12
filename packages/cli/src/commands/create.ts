import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { initCommand } from './init.js';
import { addCommand } from './add.js';

export interface CreateOptions {
  theme?: string;
  radius?: string;
  template?: 'vite' | 'next';
}

export async function createCommand(projectName?: string, options: CreateOptions = {}) {
  const name = projectName || 'my-nexore-app';
  const targetDir = path.resolve(process.cwd(), name);

  console.log(`\n\x1b[36m\x1b[1m🚀 Creating a new NexoreUI Project:\x1b[0m \x1b[32m${name}\x1b[0m\n`);

  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    console.error(`\x1b[31mError: Target directory ${name} already exists and is not empty.\x1b[0m`);
    return;
  }

  // 1. Scaffold base Vite React TypeScript template
  console.log(`\x1b[33m⚡ Step 1/4: Scaffolding React + Vite template...\x1b[0m`);
  try {
    execSync(`npm create vite@latest ${name} -- --template react-ts`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`\x1b[31mFailed to scaffold Vite project.\x1b[0m`);
    return;
  }

  // 2. Change directory and install dependencies
  process.chdir(targetDir);
  console.log(`\n\x1b[33m📦 Step 2/4: Installing NexoreUI, Tailwind CSS, and core packages...\x1b[0m`);
  execSync(`npm install nexoreui lucide-react clsx tailwind-merge framer-motion @tailwindcss/vite tailwindcss`, {
    stdio: 'inherit',
  });

  // 3. Run automated NexoreUI initialization
  console.log(`\n\x1b[33m⚙️  Step 3/4: Configuring theme and design tokens...\x1b[0m`);
  await initCommand({
    yes: true,
    theme: options.theme || 'emerald',
    radius: options.radius || '0.75',
  });

  // 4. Add starter UI components (Button, Card)
  console.log(`\n\x1b[33m🧩 Step 4/4: Adding starter UI components (button, card)...\x1b[0m`);
  try {
    await addCommand(['button', 'card'], { yes: true });
  } catch {
    // Non-blocking fallback
  }

  // 5. Replace default App.tsx with interactive NexoreUI demo showcase
  const appTsxPath = path.join(targetDir, 'src', 'App.tsx');
  const starterAppCode = `import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles, Terminal, Layers } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 transition-colors selection:bg-primary/20">
      <div className="max-w-xl w-full space-y-8 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>NexoreUI + Tailwind CSS v4</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Welcome to <span className="text-primary">NexoreUI</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Your project is fully configured with design tokens, glow effects, and modern animated components.
          </p>
        </div>

        {/* Demo Interactive Card */}
        <Card className="max-w-md mx-auto text-left shadow-xl border-border/80">
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
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/60">
              <span className="text-xs font-medium">Click Counter</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-primary/15 text-primary">
                {count} clicks
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setCount((c) => c + 1)} className="flex-1">
                Increment Count
              </Button>
              <Button variant="outline" onClick={() => setCount(0)}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CLI Hint */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground font-mono inline-flex items-center gap-2">
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

  // 6. Clean up Vite's default conflicting App.css
  const appCssPath = path.join(targetDir, 'src', 'App.css');
  if (fs.existsSync(appCssPath)) {
    try {
      fs.writeFileSync(appCssPath, '/* NexoreUI styles are loaded from src/index.css */\n', 'utf8');
    } catch {}
  }

  console.log(`\n\x1b[32m\x1b[1m✨ Project ${name} is ready with NexoreUI!\x1b[0m`);
  console.log(`\nTo get started:\n`);
  console.log(`  \x1b[36mcd ${name}\x1b[0m`);
  console.log(`  \x1b[36mnpm run dev\x1b[0m\n`);
  console.log(`To add more components to your project:\n`);
  console.log(`  \x1b[36mnpx nexoreui add modal table tabs --all\x1b[0m\n`);
}

