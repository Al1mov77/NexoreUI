import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { initCommand } from './commands/init.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '-h' || command === '--help') {
    printHelp();
    return;
  }

  if (command === 'init') {
    let yes = false;
    let theme: string | undefined;
    let radius: string | undefined;

    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === '-y' || arg === '--yes') {
        yes = true;
      } else if (arg === '--theme' && args[i + 1]) {
        theme = args[++i];
      } else if (arg.startsWith('--theme=')) {
        theme = arg.split('=')[1];
      } else if (arg === '--radius' && args[i + 1]) {
        radius = args[++i];
      } else if (arg.startsWith('--radius=')) {
        radius = arg.split('=')[1];
      }
    }

    await initCommand({ yes, theme, radius });
  } else if (command === 'list') {
    listCommand();
  } else if (command === 'add') {
    const components: string[] = [];
    let yes = false;

    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === '-y' || arg === '--yes') {
        yes = true;
      } else if (!arg.startsWith('-')) {
        components.push(arg);
      }
    }

    await addCommand(components, { yes });
  } else {
    console.error(`\x1b[31mUnknown command: ${command}\x1b[0m`);
    printHelp();
  }
}

function printHelp() {
  console.log(`
\x1b[34m\x1b[1mNexoreUI CLI\x1b[0m
Usage:
  npx nexoreui [command] [options]

Commands:
  \x1b[32minit\x1b[0m                 Initialize NexoreUI in your project (configure theme, radius, and paths)
  \x1b[32madd [components...]\x1b[0m  Add components to your project (e.g., button, modal, card, alert, badge)
  \x1b[32mlist\x1b[0m                 List all available components

Options:
  \x1b[33m--theme <name>\x1b[0m       Set color palette (indigo, violet, emerald, rose, amber, cyan, slate, neon)
  \x1b[33m--radius <val>\x1b[0m       Set border radius (0, 0.3, 0.5, 0.75, 1.0)
  \x1b[33m-y, --yes\x1b[0m            Skip prompts and use default paths
  \x1b[33m-h, --help\x1b[0m           Show help information
  `);
}

main().catch((err) => {
  console.error('\x1b[31mAn unexpected error occurred:\x1b[0m', err);
  process.exit(1);
});
