import re

filepath = 'apps/docs/app/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

# Ensure imports exist
imports = ['Skeleton', 'Progress', 'Slider']

for imp in imports:
    if f' {imp} ' not in code and f'{imp},' not in code:
        code = re.sub(r'import \{([\s\S]*?)\} from "nexoreui"', f'import {{\\1, {imp}}} from "nexoreui"', code, count=1)

sections = {
    'skeleton': """
      <div id="skeleton" className={`scroll-mt-20 ${activeTab === "skeleton" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Skeleton</h3>
        <p className="text-sm text-muted-foreground mb-6">Placeholder for loading states.</p>
        <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm space-y-4 max-w-sm mx-auto">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </div>
""",
    'progress': """
      <div id="progress" className={`scroll-mt-20 ${activeTab === "progress" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Progress</h3>
        <p className="text-sm text-muted-foreground mb-6">Displays progress status.</p>
        <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm flex justify-center items-center">
          <Progress value={65} className="w-[60%]" />
        </div>
      </div>
""",
    'slider': """
      <div id="slider" className={`scroll-mt-20 ${activeTab === "slider" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Slider</h3>
        <p className="text-sm text-muted-foreground mb-6">Range input control.</p>
        <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm flex justify-center items-center">
          <Slider defaultValue={[50]} max={100} step={1} className="w-[60%]" />
        </div>
      </div>
"""
}

# Append new sections
for id, content in sections.items():
    if f'id="{id}"' not in code:
        code = code.replace('</main>', content + '\n</main>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully added skeleton, progress, slider sections")
