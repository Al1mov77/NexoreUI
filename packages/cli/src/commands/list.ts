import { registry } from '../registry/index.js';

export function listCommand() {
  console.log('\n\x1b[34m\x1b[1m=== Available NexoreUI Components ===\x1b[0m\n');
  
  Object.keys(registry).forEach((name) => {
    const item = registry[name];
    console.log(`- \x1b[32m\x1b[1m${name}\x1b[0m (${item.fileName})`);
    if (item.dependencies.length > 0) {
      console.log(`  \x1b[90mDependencies: ${item.dependencies.join(', ')}\x1b[0m`);
    }
    if (item.componentsDependencies && item.componentsDependencies.length > 0) {
      console.log(`  \x1b[33mRequires component: ${item.componentsDependencies.join(', ')}\x1b[0m`);
    }
    console.log('');
  });
}
