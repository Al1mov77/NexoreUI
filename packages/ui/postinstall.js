const fs = require('fs');
const path = require('path');

try {
  // Resolve the root of the project that is installing nexoreui.
  // npm, pnpm, and yarn set INIT_CWD to the directory where the install command was run.
  let projectRoot = process.env.INIT_CWD;

  if (!projectRoot) {
    // Fallback: traverse upwards from node_modules/nexoreui
    let currentDir = __dirname;
    while (currentDir !== path.parse(currentDir).root) {
      if (fs.existsSync(path.join(currentDir, 'package.json')) && !currentDir.includes('node_modules')) {
        projectRoot = currentDir;
        break;
      }
      currentDir = path.dirname(currentDir);
    }
  }

  if (projectRoot) {
    const parentPackageJsonPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(parentPackageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(parentPackageJsonPath, 'utf8'));

      const hasTailwind = 
        (pkg.dependencies && pkg.dependencies.tailwindcss) || 
        (pkg.devDependencies && pkg.devDependencies.tailwindcss) ||
        (pkg.dependencies && pkg.dependencies['@tailwindcss/vite']) ||
        (pkg.devDependencies && pkg.devDependencies['@tailwindcss/vite']) ||
        (pkg.dependencies && pkg.dependencies['@tailwindcss/postcss']) ||
        (pkg.devDependencies && pkg.devDependencies['@tailwindcss/postcss']);

      if (!hasTailwind) {
        console.log('\n\x1b[33m%s\x1b[0m', '⚠️  [NexoreUI] Warning: Tailwind CSS was not found in your project dependencies.');
        console.log('\x1b[36m%s\x1b[0m', '   NexoreUI components require Tailwind CSS for styling to work properly.');
        console.log('   Please install Tailwind CSS in your project:');
        console.log('\x1b[1m   npm install tailwindcss @tailwindcss/vite\x1b[22m\n');
      } else {
        console.log('\n\x1b[32m%s\x1b[0m', '✅ [NexoreUI] Tailwind CSS detected.');
        console.log('\x1b[36m%s\x1b[0m', '   Make sure to configure Tailwind to scan NexoreUI components by adding:');
        console.log('\x1b[35m%s\x1b[0m', '   @import "tailwindcss";');
        console.log('\x1b[35m%s\x1b[0m', '   @source "../node_modules/nexoreui/dist/**/*.{js,mjs}";');
        console.log('   to your global CSS file.\n');
      }
    }
  }
} catch (e) {
  // Fail silently to prevent blocking package installation in case of permission issues
}
