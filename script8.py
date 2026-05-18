import re
import os

filepath = 'apps/docs/app/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

imports = [
    'SimpleAccordion', 'PlusAccordion', 'BasicModal', 'DangerModal', 
    'SimpleCheckbox', 'InteractiveCardCheckbox', 'SimpleSwitch', 
    'SimpleSelect', 'SimpleTooltip'
]

for imp in imports:
    if f' {imp} ' not in code and f'{imp},' not in code:
        code = re.sub(r'import \{([\s\S]*?)\} from "nexoreui"', f'import {{\\1, {imp}}} from "nexoreui"', code, count=1)

# Delete pro-pack and mega-pack div blocks completely
code = re.sub(r'<div id="pro-pack"[\s\S]*?id="mega-pack"', '<div id="mega-pack"', code)
code = re.sub(r'<div id="mega-pack"[\s\S]*?id="card"', '<div id="card"', code)

injections = {
    'accordion': """
      <div id="accordion" className={`scroll-mt-20 ${activeTab === "accordion" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Accordions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SimpleAccordion />
          <PlusAccordion />
        </div>
      </div>
  """,
    'modal': """
      <div id="modal" className={`scroll-mt-20 ${activeTab === "modal" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Modals</h3>
        <div className="flex gap-4">
          <BasicModal />
          <DangerModal />
        </div>
      </div>
  """,
    'tooltip': """
      <div id="tooltip" className={`scroll-mt-20 ${activeTab === "tooltip" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Tooltips</h3>
        <div className="flex gap-4 p-8 bg-muted/20 rounded-xl border items-center justify-center">
          <SimpleTooltip />
        </div>
      </div>
  """,
    'checkbox': """
      <div id="checkbox" className={`scroll-mt-20 ${activeTab === "checkbox" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Checkboxes</h3>
        <div className="space-y-4 max-w-sm">
          <SimpleCheckbox />
          <InteractiveCardCheckbox />
        </div>
      </div>
  """,
    'switch': """
      <div id="switch" className={`scroll-mt-20 ${activeTab === "switch" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Switches</h3>
        <div className="space-y-4 max-w-sm">
          <SimpleSwitch />
        </div>
      </div>
  """,
    'select': """
      <div id="select" className={`scroll-mt-20 ${activeTab === "select" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Select Menus</h3>
        <div className="space-y-4 max-w-sm">
          <SimpleSelect />
        </div>
      </div>
  """
}

# Instead of complex regex replacing sections, we can just append them to the end of <main> if they are empty
# But they aren't completely empty, they might not exist.
# Actually I will just insert them before </main>
code = code.replace('</main>', ''.join(injections.values()) + '\n</main>')

cli_instructions = """
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
"""

if "pnpm dlx nexoreui add" not in code:
    code = code.replace('{/* Step 3 */}', cli_instructions + '\n\n              {/* Step 3 */}')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully injected components")
