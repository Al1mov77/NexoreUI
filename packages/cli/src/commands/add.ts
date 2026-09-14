import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { execSync } from 'child_process';
import { detectProject } from '../utils/detect.js';
import { ensureCnUtil, copyComponentFile, ensureDir } from '../utils/copy.js';
import { registry } from '../registry/index.js';

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

export interface AddOptions {
  yes?: boolean;
  all?: boolean;
  overwrite?: boolean;
}

export async function addCommand(components: string[], options: AddOptions = {}) {
  const allRegistryKeys = Object.keys(registry);

  // If --all flag is passed, select all registered components
  let targetComponents = [...components];
  if (options.all || targetComponents.includes('--all')) {
    targetComponents = allRegistryKeys;
    console.log(`\n\x1b[36m⚡ Adding all ${targetComponents.length} components from NexoreUI registry...\x1b[0m`);
  }

  if (targetComponents.length === 0) {
    console.error('\x1b[31mError: Please specify components to add or use --all.\x1b[0m');
    console.log('Example: npx nexoreui add button modal table --all');
    return;
  }

  // 1. Detect project structure
  let project = detectProject(process.cwd());
  const hasPackageJson = fs.existsSync(path.join(project.baseDir, 'package.json'));

  if (!hasPackageJson) {
    // Current directory or its parents do not have a package.json.
    // Check if any child subdirectory has a nexore.json or package.json
    try {
      const entries = fs.readdirSync(process.cwd(), { withFileTypes: true });
      const candidates = entries
        .filter((d) => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
        .map((d) => d.name)
        .filter((dirName) => {
          const subPath = path.join(process.cwd(), dirName);
          return fs.existsSync(path.join(subPath, 'nexore.json')) || fs.existsSync(path.join(subPath, 'package.json'));
        });

      if (candidates.length > 0) {
        const targetCandidate = candidates[0];
        console.warn(`\n\x1b[33m\x1b[1m⚠️  Notice: No package.json found in current directory (${process.cwd()}).\x1b[0m`);
        console.log(`Found a project in subdirectory: \x1b[36m\x1b[1m./${targetCandidate}\x1b[0m\n`);

        let shouldNavigate = options.yes;
        if (!options.yes) {
          const ans = await askQuestion(`Would you like to install components inside ./${targetCandidate}? (Y/n): `);
          shouldNavigate = !ans.trim() || ans.trim().toLowerCase() === 'y' || ans.trim().toLowerCase() === 'yes';
        }

        if (shouldNavigate) {
          console.log(`\x1b[32m✔ Switching working directory to ./${targetCandidate}...\x1b[0m\n`);
          process.chdir(path.join(process.cwd(), targetCandidate));
          return addCommand(components, options);
        } else {
          console.error(`\x1b[31mInstallation cancelled. Please change into your project folder first:\x1b[0m`);
          console.log(`  \x1b[36mcd ${targetCandidate}\x1b[0m`);
          console.log(`  \x1b[36mnpx nexoreui add ${components.join(' ')}\x1b[0m\n`);
          return;
        }
      }
    } catch {
      // Ignore directory scan errors
    }

    console.error(`\x1b[31m\x1b[1mError: No React project (package.json) found in ${process.cwd()}.\x1b[0m`);
    console.error(`Please make sure you are inside your project folder before running \x1b[36mnpx nexoreui add\x1b[0m.\n`);
    return;
  }

  console.log(`\n\x1b[34mDetected project type:\x1b[0m ${project.projectType.toUpperCase()}`);
  console.log(`\x1b[34mDetected package manager:\x1b[0m ${project.packageManager}\n`);

  // Read nexore.json config if exists
  let customComponentsDir: string | undefined;
  let customUtilsFile: string | undefined;
  try {
    const configPath = path.join(project.baseDir, 'nexore.json');
    if (fs.existsSync(configPath)) {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (cfg.aliases?.components) {
        customComponentsDir = cfg.aliases.components.replace(/^@\//, project.hasSrcDir ? 'src/' : '');
      }
      if (cfg.aliases?.utils) {
        const utilBase = cfg.aliases.utils.replace(/^@\//, project.hasSrcDir ? 'src/' : '');
        customUtilsFile = utilBase.endsWith('.ts') || utilBase.endsWith('.js') ? utilBase : `${utilBase}.ts`;
      }
    }
  } catch {
    // Fallback to default detection
  }

  // 2. Validate component names and determine all components to install
  const componentsToInstall = new Set<string>();
  const invalidComponents: string[] = [];

  const queue = [...targetComponents.filter((c) => c !== '--all')];
  while (queue.length > 0) {
    const compName = queue.shift()!;
    const registryItem = registry[compName];
    if (!registryItem) {
      invalidComponents.push(compName);
      continue;
    }

    if (!componentsToInstall.has(compName)) {
      componentsToInstall.add(compName);
      if (registryItem.componentsDependencies) {
        for (const dep of registryItem.componentsDependencies) {
          queue.push(dep);
        }
      }
    }
  }

  if (invalidComponents.length > 0) {
    console.error(`\x1b[31mError: Component(s) not found in registry: ${invalidComponents.join(', ')}\x1b[0m`);
    console.log('Run \x1b[32mnpx nexoreui list\x1b[0m to see all available components.');
    return;
  }

  // 3. Determine paths
  const defaultComponentsDir = customComponentsDir || (project.hasSrcDir ? 'src/components/ui' : 'components/ui');
  const defaultUtilsFile = customUtilsFile || (project.hasSrcDir ? 'src/lib/utils.ts' : 'lib/utils.ts');

  let componentsDirInput = defaultComponentsDir;
  let utilsFileInput = defaultUtilsFile;

  if (!options.yes && !customComponentsDir) {
    const compPrompt = await askQuestion(`Where would you like to install the components? (default: ${defaultComponentsDir}): `);
    componentsDirInput = compPrompt.trim() || defaultComponentsDir;

    const utilsPrompt = await askQuestion(`Where should we create the utilities file (cn helper)? (default: ${defaultUtilsFile}): `);
    utilsFileInput = utilsPrompt.trim() || defaultUtilsFile;
  }

  const absoluteComponentsDir = path.resolve(project.baseDir, componentsDirInput);
  const absoluteUtilsFile = path.resolve(project.baseDir, utilsFileInput);

  console.log(`\x1b[33mInstalling components to:\x1b[0m ${absoluteComponentsDir}`);
  console.log(`\x1b[33mUsing cn helper from:\x1b[0m ${absoluteUtilsFile}\n`);

  ensureDir(absoluteComponentsDir);

  // 4. Ensure cn helper exists
  const didCreateCn = ensureCnUtil(absoluteUtilsFile);
  if (didCreateCn) {
    console.log(`\x1b[32m✔ Created utilities file (cn helper) at:\x1b[0m ${utilsFileInput}`);
  }

  // 5. Copy component files
  const npmDependencies = new Set<string>();
  npmDependencies.add('clsx');
  npmDependencies.add('tailwind-merge');
  npmDependencies.add('lucide-react');
  npmDependencies.add('framer-motion');
  npmDependencies.add('class-variance-authority');

  for (const compName of componentsToInstall) {
    const registryItem = registry[compName];
    const isTemplate = compName.startsWith('template-');
    const targetDir = isTemplate
      ? path.resolve(project.baseDir, project.hasSrcDir ? 'src/templates' : 'templates')
      : absoluteComponentsDir;
    const targetPath = path.join(targetDir, registryItem.fileName);

    copyComponentFile(registryItem.content, targetPath, absoluteUtilsFile);
    const displayRelPath = path.relative(project.baseDir, targetPath).replace(/\\/g, '/');
    console.log(`\x1b[32m✔ Added ${isTemplate ? 'template' : 'component'}:\x1b[0m ${compName} -> ${displayRelPath}`);

    registryItem.dependencies.forEach((dep) => npmDependencies.add(dep));
  }

  // 6. Install collected npm dependencies
  const depsArray = Array.from(npmDependencies);
  let depsToInstall = [...depsArray];
  try {
    const packageJsonPath = path.join(project.baseDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const existingDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      depsToInstall = depsArray.filter((dep) => !existingDeps[dep]);
    }
  } catch {
    // Ignore and proceed
  }

  if (depsToInstall.length > 0) {
    console.log(`\n\x1b[33mInstalling external dependencies:\x1b[0m ${depsToInstall.join(', ')}...`);
    let installCmd = 'npm install --legacy-peer-deps';
    if (project.packageManager === 'pnpm') installCmd = 'pnpm add';
    else if (project.packageManager === 'yarn') installCmd = 'yarn add';
    else if (project.packageManager === 'bun') installCmd = 'bun add';

    try {
      execSync(`${installCmd} ${depsToInstall.join(' ')}`, {
        stdio: 'inherit',
        cwd: project.baseDir,
      });
      console.log('\x1b[32m✔ Dependencies installed successfully!\x1b[0m');
    } catch {
      console.error('\x1b[31mFailed to install dependencies automatically. Please run:\x1b[0m');
      console.log(`  ${installCmd} ${depsToInstall.join(' ')}`);
    }
  }

  console.log(`\n\x1b[32m\x1b[1m🎉 Done! ${componentsToInstall.size} NexoreUI component(s) ready to use.\x1b[0m\n`);
}
