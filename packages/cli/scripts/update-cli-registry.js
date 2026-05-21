const fs = require('fs');
const path = require('path');

const uiComponentsDir = path.resolve(__dirname, '../../ui/src/components');
const cliRegistryDir = path.resolve(__dirname, '../src/registry');

function updateRegistryItem(uiFileName, cliItemName, registryName, dependencies, componentsDependencies) {
  const uiFilePath = path.join(uiComponentsDir, uiFileName);
  const cliFilePath = path.join(cliRegistryDir, `${cliItemName}.ts`);

  if (!fs.existsSync(uiFilePath)) {
    console.error(`UI component not found: ${uiFilePath}`);
    return;
  }

  let content = fs.readFileSync(uiFilePath, 'utf8');
  
  // Escape backticks, backslashes, and dollar signs for template literal embedding
  const escapedContent = content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  const fileContent = `export const ${registryName} = {
  name: "${registryName}",
  dependencies: ${JSON.stringify(dependencies, null, 2)},
  ${componentsDependencies ? `componentsDependencies: ${JSON.stringify(componentsDependencies, null, 2)},` : ''}
  fileName: "${cliItemName === 'modal' ? 'modal.tsx' : uiFileName}",
  content: \`${escapedContent}\`
};
`;

  fs.writeFileSync(cliFilePath, fileContent, 'utf8');
  console.log(`Updated registry item: ${registryName} at ${cliFilePath}`);
}

// Update registry items
updateRegistryItem('button.tsx', 'button', 'button', ["class-variance-authority", "clsx", "tailwind-merge", "framer-motion", "lucide-react"]);
updateRegistryItem('dialog.tsx', 'modal', 'modal', ["@radix-ui/react-dialog", "class-variance-authority", "clsx", "tailwind-merge", "lucide-react", "framer-motion"], ["button"]);
updateRegistryItem('card.tsx', 'card', 'card', ["class-variance-authority", "clsx", "tailwind-merge", "framer-motion", "lucide-react"]);
updateRegistryItem('alert.tsx', 'alert', 'alert', ["class-variance-authority", "clsx", "tailwind-merge", "framer-motion", "lucide-react"]);
updateRegistryItem('badge.tsx', 'badge', 'badge', ["class-variance-authority", "clsx", "tailwind-merge", "framer-motion", "lucide-react"]);
