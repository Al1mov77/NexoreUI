import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { initCommand } from './commands/init.js';
import { createCommand } from './commands/create.js';
import { authCommand } from './commands/auth.js';
import type { PackageManager } from './utils/detect.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '-h' || command === '--help') {
    printHelp();
    return;
  }

  if (command === 'create') {
    let projectName: string | undefined;
    let framework: string | undefined;
    let theme: string | undefined;
    let radius: string | undefined;
    let font: string | undefined;
    let density: string | undefined;
    let animation: string | undefined;
    let mode: string | undefined;
    let pm: string | undefined;
    let all = false;
    const components: string[] = [];

    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if ((arg === '--framework' || arg === '--template') && args[i + 1]) {
        framework = args[++i];
      } else if (arg.startsWith('--framework=')) {
        framework = arg.split('=')[1];
      } else if (arg.startsWith('--template=')) {
        framework = arg.split('=')[1];
      } else if (arg === '--theme' && args[i + 1]) {
        theme = args[++i];
      } else if (arg.startsWith('--theme=')) {
        theme = arg.split('=')[1];
      } else if (arg === '--radius' && args[i + 1]) {
        radius = args[++i];
      } else if (arg.startsWith('--radius=')) {
        radius = arg.split('=')[1];
      } else if (arg === '--font' && args[i + 1]) {
        font = args[++i];
      } else if (arg.startsWith('--font=')) {
        font = arg.split('=')[1];
      } else if (arg === '--density' && args[i + 1]) {
        density = args[++i];
      } else if (arg.startsWith('--density=')) {
        density = arg.split('=')[1];
      } else if (arg === '--animation' && args[i + 1]) {
        animation = args[++i];
      } else if (arg.startsWith('--animation=')) {
        animation = arg.split('=')[1];
      } else if (arg === '--mode' && args[i + 1]) {
        mode = args[++i];
      } else if (arg.startsWith('--mode=')) {
        mode = arg.split('=')[1];
      } else if (arg === '--pm' && args[i + 1]) {
        pm = args[++i];
      } else if (arg.startsWith('--pm=')) {
        pm = arg.split('=')[1];
      } else if (arg === '--all' || arg === '-a') {
        all = true;
      } else if ((arg === '--components' || arg === '-c') && args[i + 1]) {
        const val = args[++i];
        components.push(
          ...val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        );
        while (projectName && args[i + 1] && !args[i + 1].startsWith('-')) {
          components.push(
            ...args[++i]
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          );
        }
      } else if (arg.startsWith('--components=')) {
        const val = arg.slice('--components='.length);
        components.push(
          ...val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        );
      } else if (!arg.startsWith('-') && !projectName) {
        projectName = arg;
      }
    }

    await createCommand(projectName, {
      framework,
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      pm,
      all,
      components: components.length > 0 ? components : undefined,
    });
  } else if (command === 'init') {
    let yes = false;
    let theme: string | undefined;
    let radius: string | undefined;
    let font: string | undefined;
    let density: string | undefined;
    let animation: string | undefined;
    let mode: string | undefined;
    let framework: string | undefined;
    let pm: PackageManager | undefined;

    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === '-y' || arg === '--yes') {
        yes = true;
      } else if (arg === '--framework' && args[i + 1]) {
        framework = args[++i];
      } else if (arg.startsWith('--framework=')) {
        framework = arg.split('=')[1];
      } else if (arg === '--pm' && args[i + 1]) {
        pm = args[++i] as PackageManager;
      } else if (arg.startsWith('--pm=')) {
        pm = arg.split('=')[1] as PackageManager;
      } else if (arg === '--theme' && args[i + 1]) {
        theme = args[++i];
      } else if (arg.startsWith('--theme=')) {
        theme = arg.split('=')[1];
      } else if (arg === '--radius' && args[i + 1]) {
        radius = args[++i];
      } else if (arg.startsWith('--radius=')) {
        radius = arg.split('=')[1];
      } else if (arg === '--font' && args[i + 1]) {
        font = args[++i];
      } else if (arg.startsWith('--font=')) {
        font = arg.split('=')[1];
      } else if (arg === '--density' && args[i + 1]) {
        density = args[++i];
      } else if (arg.startsWith('--density=')) {
        density = arg.split('=')[1];
      } else if (arg === '--animation' && args[i + 1]) {
        animation = args[++i];
      } else if (arg.startsWith('--animation=')) {
        animation = arg.split('=')[1];
      } else if (arg === '--mode' && args[i + 1]) {
        mode = args[++i];
      } else if (arg.startsWith('--mode=')) {
        mode = arg.split('=')[1];
      }
    }

    await initCommand({ yes, theme, radius, font, density, animation, mode, framework, pm });
  } else if (command === 'list') {
    listCommand();
  } else if (command === 'add') {
    const components: string[] = [];
    let yes = false;
    let all = false;
    let pm: PackageManager | undefined;

    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === '-y' || arg === '--yes') {
        yes = true;
      } else if (arg === '--all' || arg === '-a') {
        all = true;
      } else if (arg === '--pm' && args[i + 1]) {
        pm = args[++i] as PackageManager;
      } else if (arg.startsWith('--pm=')) {
        pm = arg.split('=')[1] as PackageManager;
      } else if (!arg.startsWith('-')) {
        components.push(arg);
      }
    }

    await addCommand(components, { yes, all, pm });
  } else if (command === 'auth' || command === 'login') {
    let key: string | undefined;
    let status = false;
    let logout = false;

    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === '--status' || arg === '-s') {
        status = true;
      } else if (arg === '--logout') {
        logout = true;
      } else if (!arg.startsWith('-') && !key) {
        key = arg;
      }
    }

    await authCommand(key, { status, logout });
  } else {
    console.error(`\x1b[31mUnknown command: ${command}\x1b[0m`);
    printHelp();
  }
}

function printHelp() {
  console.log(`
\x1b[36m\x1b[1mNexoreUI CLI\x1b[0m
\x1b[90mReact components and Tailwind CSS v4 theme setup\x1b[0m

Usage:
  npx nexoreui [command] [options]

Commands:
  \x1b[32mcreate [name]\x1b[0m        Create a new configured NexoreUI project
  \x1b[32minit\x1b[0m                 Initialize NexoreUI in an existing project
  \x1b[32madd [components...]\x1b[0m  Add components to your project (use --all for all 77 components)
  \x1b[32mauth [key]\x1b[0m           Authenticate your NexoreUI Pro license key (--status, --logout)
  \x1b[32mlist\x1b[0m                 List all available components in registry

Options:
  \x1b[33m--framework <name>\x1b[0m   Framework (vite, next, next-pages, remix, astro, turbo)
  \x1b[33m--pm <name>\x1b[0m          Package manager (npm, pnpm, yarn, bun)
  \x1b[33m--theme <name>\x1b[0m       Color palette (slate, zinc, indigo, violet, emerald, rose, amber, orange, cyan, sky, neon, crimson)
  \x1b[33m--radius <val>\x1b[0m       Border radius (0, 0.3, 0.5, 0.625, 0.75, 1.0)
  \x1b[33m--font <name>\x1b[0m        Font family (geist, inter, jetbrains, system)
  \x1b[33m--density <val>\x1b[0m      UI density (compact, default, relaxed)
  \x1b[33m--animation <val>\x1b[0m    Animation profile (none, subtle, energetic)
  \x1b[33m--mode <val>\x1b[0m         Default theme mode (system, dark, light)
  \x1b[33m--components <list>\x1b[0m  Comma-separated components to install during create
  \x1b[33m--all, -a\x1b[0m            Install all available components
  \x1b[33m-y, --yes\x1b[0m            Skip prompts and use defaults automatically
  \x1b[33m-h, --help\x1b[0m           Show help information
  `);
}

main().catch((err) => {
  console.error('\x1b[31mAn unexpected error occurred:\x1b[0m', err);
  process.exit(1);
});
