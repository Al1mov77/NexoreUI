import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '-h' || command === '--help') {
    printHelp();
    return;
  }

  if (command === 'list') {
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
  \x1b[32madd [components...]\x1b[0m  Add components to your project (e.g., button, modal, card, alert, badge)
  \x1b[32mlist\x1b[0m                 List all available components

Options:
  \x1b[33m-y, --yes\x1b[0m            Skip prompts and use default paths
  \x1b[33m-h, --help\x1b[0m           Show help information
  `);
}

main().catch((err) => {
  console.error('\x1b[31mAn unexpected error occurred:\x1b[0m', err);
  process.exit(1);
});
