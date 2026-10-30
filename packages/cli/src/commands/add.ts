import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { execSync } from 'child_process';
import { detectProject } from '../utils/detect.js';
import { ensureCnUtil, copyComponentFile, ensureDir } from '../utils/copy.js';
import { registry } from '../registry/index.js';
import { readStoredConfig, verifyRemoteLicense, fetchRemoteTemplate } from '../utils/auth.js';

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

const TEMPLATE_MEDIA_ASSETS: Record<string, string[]> = {
  "template-nexore-case-pro": [
    "/templates/nexore-case/nexore-01-box-closed.jpg",
    "/templates/nexore-case/nexore-02-box-open.jpg",
    "/templates/nexore-case/nexore-03-case-white.jpg",
    "/templates/nexore-case/nexore-04-charms-sheet.jpg",
    "/templates/nexore-case/nexore-05-stars-tray.jpg",
    "/templates/nexore-case/nexore-06-paper-texture.jpg",
    "/templates/nexore-case/nexore-07-seal-pad.jpg",
  ],
  "nexore-case": [
    "/templates/nexore-case/nexore-01-box-closed.jpg",
    "/templates/nexore-case/nexore-02-box-open.jpg",
    "/templates/nexore-case/nexore-03-case-white.jpg",
    "/templates/nexore-case/nexore-04-charms-sheet.jpg",
    "/templates/nexore-case/nexore-05-stars-tray.jpg",
    "/templates/nexore-case/nexore-06-paper-texture.jpg",
    "/templates/nexore-case/nexore-07-seal-pad.jpg",
  ],
  "template-vesuvio-pizza-pro": [
    "/templates/vesuvio-pizza/scene/counter.jpg",
    "/templates/vesuvio-pizza/scene/box-closed.webp",
    "/templates/vesuvio-pizza/scene/box-base.webp",
    "/templates/vesuvio-pizza/scene/box-ajar.webp",
    "/templates/vesuvio-pizza/scene/timer.webp",
    "/templates/vesuvio-pizza/pizza/dough.webp",
    "/templates/vesuvio-pizza/pizza/sauce.webp",
    "/templates/vesuvio-pizza/pizza/crust-baked.webp",
    "/templates/vesuvio-pizza/pizza/pizza-baked-full.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-1.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-2.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-1.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-2.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-1.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-1.webp",
    "/templates/vesuvio-pizza/toppings/basil-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-3.webp",
    "/templates/vesuvio-pizza/toppings/olive-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-2.webp",
    "/templates/vesuvio-pizza/trays/tray-mozzarella.webp",
    "/templates/vesuvio-pizza/trays/tray-pepperoni.webp",
    "/templates/vesuvio-pizza/trays/tray-mushrooms.webp",
    "/templates/vesuvio-pizza/trays/tray-basil.webp",
    "/templates/vesuvio-pizza/trays/tray-olives.webp",
    "/templates/vesuvio-pizza/trays/tray-onion.webp",
    "/templates/vesuvio-pizza/hands/hand-open.webp",
    "/templates/vesuvio-pizza/hands/hand-pinch.webp",
    "/templates/vesuvio-pizza/hands/hand-ok.webp",
    "/templates/vesuvio-pizza/hands/hand-point.webp"
  ],
  "vesuvio-pizza": [
    "/templates/vesuvio-pizza/scene/counter.jpg",
    "/templates/vesuvio-pizza/scene/box-closed.webp",
    "/templates/vesuvio-pizza/scene/box-base.webp",
    "/templates/vesuvio-pizza/scene/box-ajar.webp",
    "/templates/vesuvio-pizza/scene/timer.webp",
    "/templates/vesuvio-pizza/pizza/dough.webp",
    "/templates/vesuvio-pizza/pizza/sauce.webp",
    "/templates/vesuvio-pizza/pizza/crust-baked.webp",
    "/templates/vesuvio-pizza/pizza/pizza-baked-full.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-1.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-2.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-1.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-2.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-1.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-1.webp",
    "/templates/vesuvio-pizza/toppings/basil-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-3.webp",
    "/templates/vesuvio-pizza/toppings/olive-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-2.webp",
    "/templates/vesuvio-pizza/trays/tray-mozzarella.webp",
    "/templates/vesuvio-pizza/trays/tray-pepperoni.webp",
    "/templates/vesuvio-pizza/trays/tray-mushrooms.webp",
    "/templates/vesuvio-pizza/trays/tray-basil.webp",
    "/templates/vesuvio-pizza/trays/tray-olives.webp",
    "/templates/vesuvio-pizza/trays/tray-onion.webp",
    "/templates/vesuvio-pizza/hands/hand-open.webp",
    "/templates/vesuvio-pizza/hands/hand-pinch.webp",
    "/templates/vesuvio-pizza/hands/hand-ok.webp",
    "/templates/vesuvio-pizza/hands/hand-point.webp"
  ],
  'template-pull-noodle-pro': ['/videos/pull-noodle.mp4'],
  'template-ferrari-nocturne': ['/videos/ferrari-nocturne.mp4'],
  'template-rose-nocturne': ['/videos/rose-nocturne-atelier.mp4'],
  'template-psyche-obsidian': ['/videos/psyche-obsidian-atelier.mp4'],
  'template-vortex-apex-pro': ['/videos/vortex-apex-obsidian.mp4'],
  'template-aerovoid-obsidian-pro': ['/videos/aerovoid-obsidian-parka.mp4'],
  'template-amarena-royale-pro': ['/videos/amarena-royale-cupcake.mp4'],
  'template-monolith-cacao-pro': ['/videos/monolith-cacao-glaze.mp4'],
  'template-levitas-cryo-pro': ['/videos/levitas-cryo-spheres.mp4'],
  'template-aura-obsidian-pro': ['/videos/aura-obsidian-botanica.mp4'],
  'template-aura-nocturne-pro': ['/videos/aura-nocturne-perfume.mp4'],
  'template-velvet-gelato-pro': ['/videos/velvet-cryo-gelato.mp4'],
  'template-zenith-elixir-pro': ['/videos/zenith-tea-elixir.mp4'],
  'template-chrono-x-pro': ['/videos/chrono-scrub.mp4'],
  'template-aura-sound-pro': ['/videos/headphones-scrub.mp4'],
};

export const PRO_TEMPLATES: Array<{ id: string; slug: string; title: string }> = [
  { id: 'template-nexore-case-pro', slug: 'nexore-case', title: 'NEXORE CASE — Custom Phone Case Builder' },
  { id: 'template-vesuvio-pizza-pro', slug: 'vesuvio-pizza', title: 'VESUVIO — Woodfired Artisanal Pizza Studio' },
  { id: 'template-pull-noodle-pro', slug: 'pull-noodle', title: 'PULL — Hand-Pulled Noodle Bar' },
  { id: 'template-flip-skate-pro', slug: 'flip-skate', title: 'FLIP — Skate Shop & Hardware Studio' },
  { id: 'template-panda-bakery-pro', slug: 'panda-bakery', title: 'PANDA — Artisanal Mochi & Pastry Bakery' },
  { id: 'template-capy-spa-pro', slug: 'capy-spa', title: 'CAPY — Yuzu Onsen & Botanical Bathhouse' },
  { id: 'template-bear-lift-pro', slug: 'bear-lift', title: 'BEAR LIFT — Heavy Strength & Barbell Club' },
  { id: 'template-burlit-coffee-pro', slug: 'burlit-coffee', title: 'BURLIT — Specialty Espresso Roastery' },
  { id: 'template-ironpaw-tools-pro', slug: 'ironpaw-tools', title: 'IRONPAW — Heavy-Duty Workshop Tools' },
  { id: 'template-lamborghini-revuelto-pro', slug: 'lamborghini-revuelto', title: 'Lamborghini Revuelto — V12 Hybrid Configurator' },
  { id: 'template-stayline-pro', slug: 'stayline', title: 'STAYLINE — Architectural Hospitality & Stays' },
  { id: 'template-aerovoid-obsidian-pro', slug: 'aerovoid-obsidian', title: 'Aerovoid Obsidian Technical Parka' },
  { id: 'template-vortex-apex-pro', slug: 'vortex-apex', title: 'Vortex Apex Corse Telemetry' },
  { id: 'template-chrono-x-pro', slug: 'chrono-x', title: 'Chrono X Titanium Horology' },
  { id: 'template-ferrari-nocturne', slug: 'ferrari-nocturne', title: 'Ferrari Nocturne Atelier' },
  { id: 'template-aura-sound-pro', slug: 'aura-sound', title: 'Aura Sound Pro Acoustic Studio' },
  { id: 'template-aura-nocturne-pro', slug: 'aura-nocturne', title: 'Aura Nocturne Parfum' },
  { id: 'template-aura-obsidian-pro', slug: 'aura-obsidian', title: 'Aura Obsidian Botanica' },
  { id: 'template-velvet-gelato-pro', slug: 'velvet-gelato', title: 'Velvet Cryo Gelato' },
  { id: 'template-zenith-elixir-pro', slug: 'zenith-elixir', title: 'Zenith Botanical Elixir' },
  { id: 'template-monolith-cacao-pro', slug: 'monolith-cacao', title: 'Monolith Obsidian Cacao' },
  { id: 'template-amarena-royale-pro', slug: 'amarena-royale', title: 'Amarena Royale Patisserie' },
  { id: 'template-levitas-cryo-pro', slug: 'levitas-cryo', title: 'Levitas Cryo Atelier' },
  { id: 'template-rose-nocturne', slug: 'rose-nocturne', title: 'Rose Nocturne Atelier' },
  { id: 'template-psyche-obsidian', slug: 'psyche-obsidian', title: 'Psyche Obsidian Atelier' },
  { id: 'template-vapor-obsidian', slug: 'vapor-obsidian', title: 'Vapor Obsidian Atelier' },
  { id: 'template-vantr-particle', slug: 'vantr-particle', title: 'Vantr Particle Reveal' },
  { id: 'template-portfolio-pro', slug: 'portfolio', title: 'NexFolio Portfolio Pro' },
  { id: 'template-ecommerce-pro', slug: 'ecommerce', title: 'NexStore E-Commerce Pro' },
  { id: 'template-nexcore-admin-pro', slug: 'nexcore-admin', title: 'NexCore Admin Pro' },
  { id: 'template-users-table-pro', slug: 'users-table', title: 'NexUsers Table Pro' },
  { id: 'template-auth-pro', slug: 'auth', title: 'NexAuth Identity Pro' },
  { id: 'template-ai-chat-interface', slug: 'ai-chat-interface', title: 'AI Chat Interface Pro' },
  { id: 'template-swagger-form-builder', slug: 'swagger-form-builder', title: 'Swagger Form Builder Pro' },
];

const KNOWN_PRO_TEMPLATE_NAMES = new Set<string>(
  PRO_TEMPLATES.flatMap((t) => [t.id, t.slug, `template-${t.slug}`, `${t.slug}-pro`])
);

export interface AddOptions {
  yes?: boolean;
  all?: boolean;
  overwrite?: boolean;
}

export async function addCommand(components: string[], options: AddOptions = {}) {
  const allRegistryKeys = Object.keys(registry);

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
  }

  // 2. Validate component names and separate Pro templates
  const componentsToInstall = new Set<string>();
  const templatesToInstall = new Set<string>();
  const invalidComponents: string[] = [];

  const queue = [...targetComponents.filter((c) => c !== '--all')];
  while (queue.length > 0) {
    const compName = queue.shift()!;
    if (registry[compName]) {
      if (!componentsToInstall.has(compName)) {
        componentsToInstall.add(compName);
        if (registry[compName].componentsDependencies) {
          for (const dep of registry[compName].componentsDependencies) {
            queue.push(dep);
          }
        }
      }
    } else if (
      compName.startsWith('template-') ||
      compName.endsWith('-pro') ||
      KNOWN_PRO_TEMPLATE_NAMES.has(compName) ||
      TEMPLATE_MEDIA_ASSETS[compName] ||
      TEMPLATE_MEDIA_ASSETS[`template-${compName}`] ||
      TEMPLATE_MEDIA_ASSETS[`template-${compName}-pro`]
    ) {
      templatesToInstall.add(compName);
    } else {
      invalidComponents.push(compName);
    }
  }

  if (invalidComponents.length > 0) {
    console.error(`\x1b[31mError: Component(s) not found in registry: ${invalidComponents.join(', ')}\x1b[0m`);
    console.log('Run \x1b[32mnpx nexoreui list\x1b[0m to see all available components.');
    return;
  }

  // 2b. Verify license if any Pro template is included
  const fetchedTemplates: Array<{
    name: string;
    slug: string;
    fileName: string;
    content: string;
    dependencies: string[];
    assets: string[];
  }> = [];

  if (templatesToInstall.size > 0) {
    const config = readStoredConfig();
    let licenseKey = config.licenseKey;

    if (!licenseKey) {
      console.error('\n\x1b[31m\x1b[1mError: NexoreUI Pro license required\x1b[0m');
      console.error(
        `The following item(s) are Pro templates:\n  ${Array.from(templatesToInstall).map((t) => `\x1b[33m${t}\x1b[0m`).join(', ')}`
      );
      console.log('\nTo install Pro templates, authenticate with your Pro license key:');
      console.log('  \x1b[36mnpx nexoreui auth <your-license-key>\x1b[0m');
      console.log('\nNeed a Pro license? Get lifetime access at:');
      console.log('  \x1b[36mhttps://nexoreui.site/pricing\x1b[0m\n');
      return;
    }

    const verifyRes = await verifyRemoteLicense(licenseKey);
    if (!verifyRes.valid) {
      console.error(`\n\x1b[31m\x1b[1mError: ${verifyRes.error || 'Invalid or revoked Pro license key'}\x1b[0m\n`);
      return;
    }

    console.log(`\x1b[32m✔ Verified Pro license for ${verifyRes.owner || 'authorized user'}.\x1b[0m`);

    for (const tName of templatesToInstall) {
      console.log(`\x1b[36m⏳ Fetching Pro template from secure registry:\x1b[0m ${tName}...`);
      const tRes = await fetchRemoteTemplate(tName, licenseKey);
      if (!tRes.valid || !tRes.content) {
        console.error(`\x1b[31mError: ${tRes.error || `Could not retrieve template '${tName}'`}\x1b[0m`);
        return;
      }
      fetchedTemplates.push({
        name: tRes.name || tName,
        slug: tRes.slug || tName.replace(/^template-/, ''),
        fileName: tRes.fileName || `${tName}.tsx`,
        content: tRes.content,
        dependencies: tRes.dependencies || ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
        assets: tRes.assets || TEMPLATE_MEDIA_ASSETS[tName] || [],
      });
    }
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

  // 5. Copy UI components
  const npmDependencies = new Set<string>();
  npmDependencies.add('clsx');
  npmDependencies.add('tailwind-merge');
  npmDependencies.add('lucide-react');
  npmDependencies.add('framer-motion');
  npmDependencies.add('class-variance-authority');

  for (const compName of componentsToInstall) {
    const registryItem = registry[compName];
    const targetPath = path.join(absoluteComponentsDir, registryItem.fileName);

    copyComponentFile(registryItem.content, targetPath, absoluteUtilsFile);
    const displayRelPath = path.relative(project.baseDir, targetPath).replace(/\\/g, '/');
    console.log(`\x1b[32m✔ Added component:\x1b[0m ${compName} -> ${displayRelPath}`);

    registryItem.dependencies.forEach((dep) => npmDependencies.add(dep));
  }

  // 5b. Install Pro templates
  for (const template of fetchedTemplates) {
    const targetDir = path.resolve(project.baseDir, project.hasSrcDir ? 'src/templates' : 'templates');
    ensureDir(targetDir);
    const targetPath = path.join(targetDir, template.fileName);

    copyComponentFile(template.content, targetPath, absoluteUtilsFile);
    const displayRelPath = path.relative(project.baseDir, targetPath).replace(/\\/g, '/');
    console.log(`\x1b[32m✔ Added Pro template:\x1b[0m ${template.name} -> ${displayRelPath}`);

    if (template.assets && template.assets.length > 0) {
      for (const assetPath of template.assets) {
        const destPath = path.join(project.baseDir, 'public', assetPath.replace(/^\//, ''));
        if (!fs.existsSync(destPath)) {
          try {
            ensureDir(path.dirname(destPath));
            const assetUrl = `https://nexoreui.site${assetPath}`;
            console.log(`\x1b[36m⏳ Downloading media asset:\x1b[0m ${assetPath}...`);
            const res = await fetch(assetUrl);
            if (res.ok) {
              const arrayBuffer = await res.arrayBuffer();
              fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
              console.log(`\x1b[32m✔ Downloaded asset:\x1b[0m public${assetPath}`);
            }
          } catch {
          }
        }
      }
    }

    template.dependencies.forEach((dep) => npmDependencies.add(dep));
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

  const totalCount = componentsToInstall.size + fetchedTemplates.length;
  console.log(`\n\x1b[32m\x1b[1m🎉 Done! ${totalCount} NexoreUI item(s) ready to use.\x1b[0m\n`);
}
