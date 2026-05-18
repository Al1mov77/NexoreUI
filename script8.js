const fs = require('fs');
let code = fs.readFileSync('apps/docs/app/page.tsx', 'utf-8');

// Ensure imports exist
const imports = [
  'SimpleAccordion', 'PlusAccordion', 'BasicModal', 'DangerModal', 
  'SimpleCheckbox', 'InteractiveCardCheckbox', 'SimpleSwitch', 
  'SimpleSelect', 'SimpleTooltip'
];

imports.forEach(imp => {
  if (!code.includes(' ' + imp + ' ') && !code.includes(imp + ',')) {
    code = code.replace(/import \{([\s\S]*?)\} from "nexoreui"/, (match, p1) => {
      return 'import {' + p1 + ', ' + imp + '} from "nexoreui"';
    });
  }
});

// Delete pro-pack and mega-pack div blocks completely
code = code.replace(/<div id="pro-pack"[\s\S]*?id="mega-pack"/, '<div id="mega-pack"');
code = code.replace(/<div id="mega-pack"[\s\S]*?id="card"/, '<div id="card"');

// Inject the new categories (accordion, modal, tooltip, checkbox, switch, select)
// We need to make sure we have tabs for them, and if not, just append them into the main area.
// Wait, MvpComponents already has these ids!
// "Accordion Modal Tooltip Checkbox Switch Select" are empty categories.
// So we will just replace their empty <div>s with populated ones.

const injections = {
  'accordion': \`
      <div id="accordion" className={\`scroll-mt-20 \${activeTab === "accordion" ? "block" : "hidden"}\`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Accordions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SimpleAccordion />
          <PlusAccordion />
        </div>
      </div>
  \`,
  'modal': \`
      <div id="modal" className={\`scroll-mt-20 \${activeTab === "modal" ? "block" : "hidden"}\`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Modals</h3>
        <div className="flex gap-4">
          <BasicModal />
          <DangerModal />
        </div>
      </div>
  \`,
  'tooltip': \`
      <div id="tooltip" className={\`scroll-mt-20 \${activeTab === "tooltip" ? "block" : "hidden"}\`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Tooltips</h3>
        <div className="flex gap-4 p-8 bg-muted/20 rounded-xl border items-center justify-center">
          <SimpleTooltip />
        </div>
      </div>
  \`,
  'checkbox': \`
      <div id="checkbox" className={\`scroll-mt-20 \${activeTab === "checkbox" ? "block" : "hidden"}\`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Checkboxes</h3>
        <div className="space-y-4 max-w-sm">
          <SimpleCheckbox />
          <InteractiveCardCheckbox />
        </div>
      </div>
  \`,
  'switch': \`
      <div id="switch" className={\`scroll-mt-20 \${activeTab === "switch" ? "block" : "hidden"}\`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Switches</h3>
        <div className="space-y-4 max-w-sm">
          <SimpleSwitch />
        </div>
      </div>
  \`,
  'select': \`
      <div id="select" className={\`scroll-mt-20 \${activeTab === "select" ? "block" : "hidden"}\`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Select Menus</h3>
        <div className="space-y-4 max-w-sm">
          <SimpleSelect />
        </div>
      </div>
  \`
};

// Replace empty sections if they exist
for (const [id, content] of Object.entries(injections)) {
  const regex = new RegExp(\`<div id="\` + id + \`" className={[^{}]+}>[\\\\s\\\\S]*?(</section>|</div>\\\\s*</div>\\\\s*<div id=|<div id=")\`);
  const match = code.match(regex);
  if (match) {
    // If the section exists, replace it
    // Be careful not to replace the next section's starting div
    code = code.replace(regex, content + '\\n              ' + match[1]);
  } else {
    // If the section doesn't exist, append it before </main>
    code = code.replace('</main>', content + '\\n</main>');
  }
}

// Add CLI Instructions
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
                </div>
              </div>
\`;

if (!code.includes("pnpm dlx nexoreui add")) {
  code = code.replace('{/* Step 3 */}', cliInstructions + '\\n\\n              {/* Step 3 */}');
}

fs.writeFileSync('apps/docs/app/page.tsx', code);
console.log('Successfully injected mega-interactive components and CLI instructions');
