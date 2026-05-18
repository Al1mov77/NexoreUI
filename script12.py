import re

filepath = 'apps/docs/app/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Replace Russian comments with English
code = code.replace('// Шаг 1:', '// Step 1:')
code = code.replace('// Шаг 2:', '// Step 2:')
code = code.replace('Импортируйте нужную кнопку', 'Import the buttons')
code = code.replace('Используйте в вашем компоненте', 'Use them in your component')
code = code.replace('Импортируйте премиум кнопки', 'Import premium buttons')
code = code.replace('Используйте с анимациями', 'Use with animations')
code = code.replace('Импортируйте аккордеоны', 'Import accordions')
code = code.replace('Вставьте в разметку', 'Insert into your layout')
code = code.replace('Импортируйте модальные окна', 'Import modals')
code = code.replace('Используйте (состояние открытия внутри)', 'Use them (open state is managed internally)')
code = code.replace('Импортируйте тултипы', 'Import tooltips')
code = code.replace('Наведите для отображения', 'Hover to display')
code = code.replace('Импортируйте чекбоксы', 'Import checkboxes')
code = code.replace('Используйте в формах', 'Use in forms')
code = code.replace('Импортируйте свитчи', 'Import switches')
code = code.replace('Используйте для настроек', 'Use for settings')
code = code.replace('Импортируйте селект', 'Import select')
code = code.replace('Выберите значение', 'Select a value')

# 2. Expand instructions to include more components
# For Buttons
code = code.replace(
    '// Step 1: Import the buttons\nimport { NeonButton, ThreeDButton } from "nexoreui"',
    '// Step 1: Import the buttons\nimport { NeonButton, ThreeDButton, RippleButton, CyberpunkButton, MagneticButton } from "nexoreui"'
)
code = code.replace(
    '<NeonButton>Neon Glow</NeonButton>\n      <ThreeDButton>3D Effect</ThreeDButton>',
    '<NeonButton>Neon</NeonButton>\n      <ThreeDButton>3D</ThreeDButton>\n      <RippleButton>Ripple</RippleButton>\n      <CyberpunkButton>Cyber</CyberpunkButton>\n      <MagneticButton>Magnetic</MagneticButton>'
)

# For Special Buttons
code = code.replace(
    '// Step 1: Import premium buttons\nimport { GlowButton, ShinyButton } from "nexoreui"',
    '// Step 1: Import premium buttons\nimport { GlowButton, ShinyButton, GradientButton, GlassButton } from "nexoreui"'
)
code = code.replace(
    '<GlowButton>Glow Effect</GlowButton>\n      <ShinyButton>Shiny Light</ShinyButton>',
    '<GlowButton>Glow</GlowButton>\n      <ShinyButton>Shiny</ShinyButton>\n      <GradientButton>Gradient</GradientButton>\n      <GlassButton>Glass</GlassButton>'
)

# For Accordions
code = code.replace(
    '// Step 1: Import accordions\nimport { SimpleAccordion, NeonAccordion } from "nexoreui"',
    '// Step 1: Import accordions\nimport { SimpleAccordion, PlusAccordion, NeonAccordion } from "nexoreui"'
)
code = code.replace(
    '<SimpleAccordion />\n      <NeonAccordion />',
    '<SimpleAccordion />\n      <PlusAccordion />\n      <NeonAccordion />'
)

# For Modals
code = code.replace(
    '// Step 1: Import modals\nimport { BasicModal, InteractiveGlassModal } from "nexoreui"',
    '// Step 1: Import modals\nimport { BasicModal, InteractiveGlassModal, DangerModal } from "nexoreui"'
)
code = code.replace(
    '<BasicModal />\n      <InteractiveGlassModal />',
    '<BasicModal />\n      <InteractiveGlassModal />\n      <DangerModal />'
)

# 3. Add instructions for missing sections at the bottom (Skeleton, Progress, Slider)
sections_to_update = {
    'skeleton': """
      <div id="skeleton" className={`scroll-mt-20 ${activeTab === "skeleton" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Skeleton</h3>
        <p className="text-sm text-muted-foreground mb-6">Placeholder for loading states.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] items-center justify-center border rounded-xl bg-card/50 backdrop-blur-sm p-6 glass">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
          <ComponentSource sourceCode={`// Step 1: Import Skeleton
import { Skeleton } from "nexoreui"

// Step 2: Use as placeholder
export default function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}`} />
        </div>
      </div>
""",
    'progress': """
      <div id="progress" className={`scroll-mt-20 ${activeTab === "progress" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Progress</h3>
        <p className="text-sm text-muted-foreground mb-6">Displays progress status.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] items-center justify-center border rounded-xl bg-card/50 backdrop-blur-sm p-6 glass">
            <Progress value={65} className="w-[60%]" />
          </div>
          <ComponentSource sourceCode={`// Step 1: Import Progress
import { Progress } from "nexoreui"

// Step 2: Set value
export default function ProgressDemo() {
  return <Progress value={65} className="w-[60%]" />
}`} />
        </div>
      </div>
""",
    'slider': """
      <div id="slider" className={`scroll-mt-20 ${activeTab === "slider" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Slider</h3>
        <p className="text-sm text-muted-foreground mb-6">Range input control.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] items-center justify-center border rounded-xl bg-card/50 backdrop-blur-sm p-6 glass">
            <Slider defaultValue={[50]} max={100} step={1} className="w-[60%]" />
          </div>
          <ComponentSource sourceCode={`// Step 1: Import Slider
import { Slider } from "nexoreui"

// Step 2: Use in forms
export default function SliderDemo() {
  return <Slider defaultValue={[50]} max={100} step={1} />
}`} />
        </div>
      </div>
"""
}

for id, content in sections_to_update.items():
    code = re.sub(rf'<div id="{id}"[\s\S]*?</div>\s*</div>(?=\s*(<div id=|</main>))', content, code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully updated instructions to English and added missing ones at the bottom")
