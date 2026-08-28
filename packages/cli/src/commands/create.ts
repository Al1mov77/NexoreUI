import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { initCommand } from './init.js';

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
  console.log(`\x1b[33m⚡ Scaffolding React + Vite + Tailwind CSS template...\x1b[0m`);
  try {
    execSync(`npm create vite@latest ${name} -- --template react-ts`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`\x1b[31mFailed to scaffold Vite project.\x1b[0m`);
    return;
  }

  // 2. Change directory and install dependencies
  process.chdir(targetDir);
  console.log(`\n\x1b[33m📦 Installing NexoreUI, Tailwind CSS, and core packages...\x1b[0m`);
  execSync(`npm install nexoreui lucide-react clsx tailwind-merge framer-motion @tailwindcss/vite tailwindcss`, {
    stdio: 'inherit',
  });

  // 3. Run automated NexoreUI initialization
  await initCommand({
    yes: true,
    theme: options.theme || 'cyan',
    radius: options.radius || '1.0',
  });

  console.log(`\n\x1b[32m\x1b[1m✨ Project ${name} is ready!\x1b[0m`);
  console.log(`\nTo get started:\n`);
  console.log(`  \x1b[36mcd ${name}\x1b[0m`);
  console.log(`  \x1b[36mnpx nexoreui add button card modal table --all\x1b[0m`);
  console.log(`  \x1b[36mnpm run dev\x1b[0m\n`);
}
