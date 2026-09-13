const fs = require('fs');
const path = require('path');

const uiComponentsDir = path.resolve(__dirname, '../../ui/src/components');
const cliRegistryDir = path.resolve(__dirname, '../src/registry');

// Known npm packages that components might import
const KNOWN_PACKAGES = [
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'framer-motion',
  'lucide-react',
  'sonner',
  'next-themes',
  '@radix-ui/react-tabs',
  '@radix-ui/react-accordion',
  '@radix-ui/react-dialog',
  '@radix-ui/react-tooltip',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-switch',
  '@radix-ui/react-select',
  '@radix-ui/react-progress',
  '@radix-ui/react-slider',
  '@radix-ui/react-scroll-area',
];

function toCamelCase(str) {
  const camel = str.replace(/-([a-z0-9])/g, (_, g) => g.toUpperCase());
  if (['switch', 'case', 'default', 'class', 'function', 'return', 'import', 'export', 'delete', 'void'].includes(camel)) {
    return `${camel}Component`;
  }
  return camel;
}

function detectDependencies(content) {
  const deps = new Set(['clsx', 'tailwind-merge']);
  for (const pkg of KNOWN_PACKAGES) {
    if (content.includes(`'${pkg}'`) || content.includes(`"${pkg}"`)) {
      deps.add(pkg);
    }
  }
  return Array.from(deps);
}

function detectComponentDependencies(content, currentFileName) {
  const compDeps = new Set();
  const importRegex = /from\s+['"]\.\/([a-zA-Z0-9_-]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const depName = match[1];
    if (depName && `${depName}.tsx` !== currentFileName) {
      compDeps.add(depName);
    }
  }
  return Array.from(compDeps);
}

function syncAllComponents() {
  if (!fs.existsSync(uiComponentsDir)) {
    console.error(`UI components directory not found: ${uiComponentsDir}`);
    return;
  }

  const files = fs.readdirSync(uiComponentsDir).filter((f) => f.endsWith('.tsx'));
  const componentRegistryItems = [];

  for (const file of files) {
    const itemName = path.basename(file, '.tsx');
    const varName = toCamelCase(itemName);
    const filePath = path.join(uiComponentsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const dependencies = detectDependencies(content);
    const componentsDependencies = detectComponentDependencies(content, file);

    const escapedContent = content
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');

    const tsFileContent = `export const ${varName} = {
  name: "${itemName}",
  dependencies: ${JSON.stringify(dependencies, null, 2)},
  ${componentsDependencies.length > 0 ? `componentsDependencies: ${JSON.stringify(componentsDependencies, null, 2)},` : ''}
  fileName: "${file}",
  content: \`${escapedContent}\`
};
`;

    const targetTsPath = path.join(cliRegistryDir, `${itemName}.ts`);
    fs.writeFileSync(targetTsPath, tsFileContent, 'utf8');
    componentRegistryItems.push({ itemName, varName, fileName: file });
  }

  console.log(`✔ Generated ${componentRegistryItems.length} UI component registry items.`);

  // Find all template files in cli registry
  const existingRegistryFiles = fs.readdirSync(cliRegistryDir);
  const templateFiles = existingRegistryFiles.filter(
    (f) => f.startsWith('template-') && f.endsWith('.ts')
  );

  const templateItems = templateFiles.map((f) => {
    const itemName = path.basename(f, '.ts');
    const varName = toCamelCase(itemName);
    return { itemName, varName, fileName: f };
  });

  // Build registry/index.ts
  const imports = [];
  const registryEntries = [];

  // 1. Imports for components
  for (const item of componentRegistryItems) {
    imports.push(`import { ${item.varName} } from './${item.itemName}';`);
    registryEntries.push(`  '${item.itemName}': ${item.varName},`);
    if (item.varName !== item.itemName) {
      registryEntries.push(`  '${item.varName}': ${item.varName},`);
    }
  }

  // 2. Imports for templates
  for (const item of templateItems) {
    imports.push(`import { ${item.varName} } from './${item.itemName}';`);
    registryEntries.push(`  '${item.itemName}': ${item.varName},`);
  }

  // 3. Helpful aliases
  const aliases = [
    { alias: 'loaders', target: 'loader' },
    { alias: 'charts', target: 'premium-charts' },
    { alias: 'commerce', target: 'premium-commerce' },
    { alias: 'social', target: 'premium-social' },
  ];

  const aliasEntries = [];
  for (const a of aliases) {
    const targetVar = toCamelCase(a.target);
    aliasEntries.push(`  '${a.alias}': ${targetVar},`);
  }

  const indexContent = `${imports.join('\n')}

export interface RegistryItem {
  name: string;
  dependencies: string[];
  componentsDependencies?: string[];
  fileName: string;
  content: string;
}

export const registry: Record<string, RegistryItem> = {
  // UI Components
${registryEntries.filter(e => !e.includes('template-')).join('\n')}

  // Aliases
${aliasEntries.join('\n')}

  // Templates
${registryEntries.filter(e => e.includes('template-')).join('\n')}
};
`;

  const indexPath = path.join(cliRegistryDir, 'index.ts');
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log(`✔ Generated ${indexPath} with ${componentRegistryItems.length} components, ${aliases.length} aliases, and ${templateItems.length} templates.`);
}

syncAllComponents();
