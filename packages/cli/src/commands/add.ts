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
  const project = detectProject(process.cwd());
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

  for (const compName of componentsToInstall) {
    const registryItem = registry[compName];
    const targetPath = path.join(absoluteComponentsDir, registryItem.fileName);

    copyComponentFile(registryItem.content, targetPath, absoluteUtilsFile);
    console.log(`\x1b[32m✔ Added component:\x1b[0m ${compName} -> ${path.join(componentsDirInput, registryItem.fileName)}`);

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
    let installCmd = 'npm install';
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
