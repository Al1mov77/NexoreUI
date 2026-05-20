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

export async function addCommand(components: string[], options: { yes?: boolean }) {
  if (components.length === 0) {
    console.error('\x1b[31mError: Please specify components to add.\x1b[0m');
    console.log('Example: npx nexoreui add button modal');
    return;
  }

  // 1. Detect project structure
  const project = detectProject(process.cwd());
  console.log(`\n\x1b[34mDetected project type:\x1b[0m ${project.projectType.toUpperCase()}`);
  console.log(`\x1b[34mDetected package manager:\x1b[0m ${project.packageManager}\n`);

  // 2. Validate component names and determine all components to install (including internal dependencies)
  const componentsToInstall = new Set<string>();
  const invalidComponents: string[] = [];

  const queue = [...components];
  while (queue.length > 0) {
    const compName = queue.shift()!;
    const registryItem = registry[compName];
    if (!registryItem) {
      invalidComponents.push(compName);
      continue;
    }
    
    if (!componentsToInstall.has(compName)) {
      componentsToInstall.add(compName);
      // Queue up any sibling component dependencies (e.g. modal depends on button)
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

  // 3. Determine defaults
  const defaultComponentsDir = project.hasSrcDir ? 'src/components/ui' : 'components/ui';
  const defaultUtilsFile = project.hasSrcDir ? 'src/lib/utils.ts' : 'lib/utils.ts';

  let componentsDirInput = '';
  let utilsFileInput = '';

  if (options.yes) {
    componentsDirInput = defaultComponentsDir;
    utilsFileInput = defaultUtilsFile;
  } else {
    // Prompt user
    const compPrompt = await askQuestion(`Where would you like to install the components? (default: ${defaultComponentsDir}): `);
    componentsDirInput = compPrompt.trim() || defaultComponentsDir;

    const utilsPrompt = await askQuestion(`Where should we create the utilities file (cn helper)? (default: ${defaultUtilsFile}): `);
    utilsFileInput = utilsPrompt.trim() || defaultUtilsFile;
  }

  const absoluteComponentsDir = path.resolve(project.baseDir, componentsDirInput);
  const absoluteUtilsFile = path.resolve(project.baseDir, utilsFileInput);

  console.log(`\n\x1b[33mInstalling components to:\x1b[0m ${absoluteComponentsDir}`);
  console.log(`\x1b[33mUsing cn helper from:\x1b[0m ${absoluteUtilsFile}\n`);

  // Ensure directories exist
  ensureDir(absoluteComponentsDir);

  // 4. Ensure cn helper exists
  const didCreateCn = ensureCnUtil(absoluteUtilsFile);
  if (didCreateCn) {
    console.log(`\x1b[32mCreated utilities file (cn helper) at:\x1b[0m ${utilsFileInput}`);
  } else {
    console.log(`\x1b[90mUtilities file already exists at:\x1b[0m ${utilsFileInput}`);
  }

  // 5. Copy component files
  const npmDependencies = new Set<string>();
  
  // Include standard clsx and tailwind-merge since cn helper is created
  npmDependencies.add('clsx');
  npmDependencies.add('tailwind-merge');

  for (const compName of componentsToInstall) {
    const registryItem = registry[compName];
    const targetPath = path.join(absoluteComponentsDir, registryItem.fileName);
    
    // Copy and rewrite relative imports
    copyComponentFile(registryItem.content, targetPath, absoluteUtilsFile);
    console.log(`\x1b[32mAdded component:\x1b[0m ${compName} -> ${path.join(componentsDirInput, registryItem.fileName)}`);

    // Collect external dependencies
    registryItem.dependencies.forEach(dep => npmDependencies.add(dep));
  }

  // 6. Install collected npm dependencies
  const depsArray = Array.from(npmDependencies);
  
  // Filter out dependencies that are already in package.json to avoid reinstalling unless needed
  let depsToInstall = [...depsArray];
  try {
    const packageJsonPath = path.join(project.baseDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const existingDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      depsToInstall = depsArray.filter(dep => !existingDeps[dep]);
    }
  } catch (e) {
    // Ignore and install all
  }

  if (depsToInstall.length > 0) {
    console.log(`\n\x1b[33mInstalling external dependencies:\x1b[0m ${depsToInstall.join(', ')}...`);
    let installCmd = 'npm install';
    if (project.packageManager === 'pnpm') {
      installCmd = 'pnpm add';
    } else if (project.packageManager === 'yarn') {
      installCmd = 'yarn add';
    } else if (project.packageManager === 'bun') {
      installCmd = 'bun add';
    }

    try {
      execSync(`${installCmd} ${depsToInstall.join(' ')}`, {
        stdio: 'inherit',
        cwd: project.baseDir,
      });
      console.log('\x1b[32mDependencies installed successfully!\x1b[0m');
    } catch (err) {
      console.error('\x1b[31mFailed to install dependencies. Please run the command manually:\x1b[0m');
      console.log(`  ${installCmd} ${depsToInstall.join(' ')}`);
    }
  } else {
    console.log('\n\x1b[90mAll external dependencies are already installed.\x1b[0m');
  }

  console.log('\n\x1b[32m\x1b[1mDone! NexoreUI components are ready to use.\x1b[0m\n');
}
