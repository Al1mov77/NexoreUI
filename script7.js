const fs = require('fs');
let code = fs.readFileSync('apps/docs/app/page.tsx', 'utf-8');

const imports = [
  'SimpleAccordion', 'PlusAccordion', 'BasicModal', 'DangerModal', 
  'SimpleCheckbox', 'InteractiveCardCheckbox', 'SimpleSwitch', 
  'SimpleSelect', 'SimpleTooltip'
];

// Add imports to page.tsx
imports.forEach(imp => {
  if (!code.includes(' ' + imp + ' ') && !code.includes(imp + ',')) {
    code = code.replace(/import \{([\s\S]*?)\} from "nexoreui"/, (match, p1) => {
      return 'import {' + p1 + ', ' + imp + '} from "nexoreui"';
    });
  }
});

const injections = {
  'accordion': \`
      <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Accordions</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SimpleAccordion />
        <PlusAccordion />
      </div>
  \`,
  'modal': \`
      <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Modals</h4>
      <div className="flex gap-4">
        <BasicModal />
        <DangerModal />
      </div>
  \`,
  'tooltip': \`
      <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Tooltips</h4>
      <div className="flex gap-4 p-8 bg-muted/20 rounded-xl border items-center justify-center">
        <SimpleTooltip />
      </div>
  \`,
  'checkbox': \`
      <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Checkboxes</h4>
      <div className="space-y-4 max-w-sm">
        <SimpleCheckbox />
        <InteractiveCardCheckbox />
      </div>
  \`,
  'switch': \`
      <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Switches</h4>
      <div className="space-y-4 max-w-sm">
        <SimpleSwitch />
      </div>
  \`,
  'select': \`
      <h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Select Menus</h4>
      <div className="space-y-4 max-w-sm">
        <SimpleSelect />
      </div>
  \`
};

const sectionIds = Object.keys(injections);
const sections = code.split(/(?=<div id=")/);

const newSections = sections.map(section => {
  let matchedId = null;
  for (const id of sectionIds) {
    if (section.startsWith('<div id="' + id + '"')) {
      matchedId = id;
      break;
    }
  }

  if (matchedId) {
    const lastDivIndex = section.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
      return section.substring(0, lastDivIndex) + injections[matchedId] + '\\n' + section.substring(lastDivIndex);
    }
  }
  return section;
});

code = newSections.join('');

// Also update the Installation section to show how to use the CLI
const cliInstructions = \`
              {/* Step 2 CLI */}
              <div className="relative pl-8 border-l border-border/60 ml-3 space-y-6 mt-12">
                <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm">2</span>
                <div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight">Add Components</h3>
                  <p className="text-muted-foreground mb-4">You can use our CLI to automatically copy components into your project.</p>
                  <Tabs defaultValue="pnpm" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                      <TabsTrigger value="npm">npm</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pnpm" className="mt-0 h-16">
                      <ComponentSource sourceCode={"pnpm dlx nexoreui add [component-name]"} />
                    </TabsContent>
                    <TabsContent value="npm" className="mt-0 h-16">
                      <ComponentSource sourceCode={"npx nexoreui add [component-name]"} />
                    </TabsContent>
                  </Tabs>
                  <p className="text-sm mt-4 text-muted-foreground">Or you can copy the code directly from this documentation.</p>
                </div>
              </div>
\`;

if (!code.includes("Add Components")) {
  code = code.replace('{/* You can add more installation steps here */}', cliInstructions);
}

fs.writeFileSync('apps/docs/app/page.tsx', code);
console.log('Successfully injected mega-interactive components and CLI instructions');
