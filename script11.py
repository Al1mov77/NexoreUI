import re

filepath = 'apps/docs/app/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Upgrade ComponentSource
new_component_source = """
function ComponentSource({ sourceCode }: { sourceCode: string }) {
  const [copied, setCopied] = React.useState(false)
  
  // Simple syntax highlighting (fake)
  // We need to be careful with HTML entities if we use dangerouslySetInnerHTML
  const escapedCode = sourceCode
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

  const highlightedCode = escapedCode
    .replace(/(import|export|default|function|return|const|let|var)/g, '<span class="text-blue-400">$1</span>')
    .replace(/(from|as)/g, '<span class="text-purple-400">$1</span>')
    .replace(/(&quot;.*?&quot;|&#039;.*?&#039;)/g, '<span class="text-green-400">$1</span>')
    .replace(/(\/\/.*)/g, '<span class="text-muted-foreground">$1</span>')
    .replace(/(&lt;\/?[a-zA-Z0-9]+.*?&gt;)/g, '<span class="text-pink-400">$1</span>')

  return (
    <div className="rounded-xl border border-border bg-black/80 backdrop-blur-xl overflow-hidden relative group flex flex-col h-full min-h-[100px] shadow-2xl">
      <div className="flex justify-between items-center px-4 py-2 bg-neutral-900 border-b border-border">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-muted-foreground font-mono">Example.tsx</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-50 group-hover:opacity-100 transition-opacity hover:bg-background" 
          onClick={() => {
            navigator.clipboard.writeText(sourceCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto h-full m-0">
        <code className="font-mono text-neutral-200" dangerouslySetInnerHTML={{ __html: highlightedCode }}></code>
      </pre>
    </div>
  )
}
"""

code = re.sub(r'function ComponentSource[\s\S]*?\}', new_component_source, code, count=1)

# 2. Update sections with instructions
sections = {
    'button': """
      <div id="button" className={`scroll-mt-20 ${activeTab === "button" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Buttons</h3>
        <p className="text-sm text-muted-foreground mb-6">Standard and custom button variants.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-border bg-background p-6 glass">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex justify-center"><NeonButton>Neon</NeonButton></div>
              <div className="flex justify-center"><ThreeDButton>3D</ThreeDButton></div>
              <div className="flex justify-center"><RippleButton>Ripple</RippleButton></div>
              <div className="flex justify-center"><CyberpunkButton>Cyber</CyberpunkButton></div>
              <div className="flex justify-center"><MagneticButton>Magnetic</MagneticButton></div>
            </div>
          </div>
          <ComponentSource sourceCode={`// Шаг 1: Импортируйте нужную кнопку
import { NeonButton, ThreeDButton } from "nexoreui"

// Шаг 2: Используйте в вашем компоненте
export default function Demo() {
  return (
    <>
      <NeonButton>Neon Glow</NeonButton>
      <ThreeDButton>3D Effect</ThreeDButton>
    </>
  )
}`} />
        </div>
      </div>
""",
    'special-buttons': """
      <div id="special-buttons" className={`scroll-mt-20 ${activeTab === "special-buttons" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Special Buttons</h3>
        <p className="text-sm text-muted-foreground mb-6">Buttons with advanced visual effects.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-border bg-background p-6 glass">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-center"><GlowButton>Glow</GlowButton></div>
              <div className="flex justify-center"><ShinyButton>Shiny</ShinyButton></div>
              <div className="flex justify-center"><GradientButton>Gradient</GradientButton></div>
              <div className="flex justify-center"><GlassButton>Glass</GlassButton></div>
            </div>
          </div>
          <ComponentSource sourceCode={`// Шаг 1: Импортируйте премиум кнопки
import { GlowButton, ShinyButton } from "nexoreui"

// Шаг 2: Используйте с анимациями
export default function SpecialDemo() {
  return (
    <div className="flex gap-4">
      <GlowButton>Glow Effect</GlowButton>
      <ShinyButton>Shiny Light</ShinyButton>
    </div>
  )
}`} />
        </div>
      </div>
""",
    'accordion': """
      <div id="accordion" className={`scroll-mt-20 ${activeTab === "accordion" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Accordions</h3>
        <p className="text-sm text-muted-foreground mb-6">Interactive disclosure components.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-border bg-background p-6 glass gap-4">
            <SimpleAccordion />
            <PlusAccordion />
            <NeonAccordion />
          </div>
          <ComponentSource sourceCode={`// Шаг 1: Импортируйте аккордеоны
import { SimpleAccordion, NeonAccordion } from "nexoreui"

// Шаг 2: Вставьте в разметку
export default function AccordionDemo() {
  return (
    <div className="space-y-4">
      <SimpleAccordion />
      <NeonAccordion />
    </div>
  )
}`} />
        </div>
      </div>
""",
    'modal': """
      <div id="modal" className={`scroll-mt-20 ${activeTab === "modal" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Modals</h3>
        <p className="text-sm text-muted-foreground mb-6">Overlay dialogs for focused attention.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-border bg-background p-6 glass gap-4 flex-wrap">
            <BasicModal />
            <InteractiveGlassModal />
            <DangerModal />
          </div>
          <ComponentSource sourceCode={`// Шаг 1: Импортируйте модальные окна
import { BasicModal, InteractiveGlassModal } from "nexoreui"

// Шаг 2: Используйте (состояние открытия внутри)
export default function ModalDemo() {
  return (
    <>
      <BasicModal />
      <InteractiveGlassModal />
    </>
  )
}`} />
        </div>
      </div>
""",
    'tooltip': """
      <div id="tooltip" className={`scroll-mt-20 ${activeTab === "tooltip" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Tooltips</h3>
        <p className="text-sm text-muted-foreground mb-6">Contextual info on hover.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] gap-8 border rounded-xl bg-card/50 backdrop-blur-sm items-center justify-center p-6 glass">
            <SimpleTooltip />
            <RichTooltip />
          </div>
          <ComponentSource sourceCode={`// Шаг 1: Импортируйте тултипы
import { SimpleTooltip, RichTooltip } from "nexoreui"

// Шаг 2: Наведите для отображения
export default function TooltipDemo() {
  return (
    <div className="flex gap-4">
      <SimpleTooltip />
      <RichTooltip />
    </div>
  )
}`} />
        </div>
      </div>
""",
    'checkbox': """
      <div id="checkbox" className={`scroll-mt-20 ${activeTab === "checkbox" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Checkboxes</h3>
        <p className="text-sm text-muted-foreground mb-6">Binary selection controls.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] items-center justify-center border rounded-xl bg-card/50 backdrop-blur-sm p-6 glass">
            <div className="space-y-4 max-w-sm w-full">
              <SimpleCheckbox />
              <InteractiveCardCheckbox />
            </div>
          </div>
          <ComponentSource sourceCode={`// Шаг 1: Импортируйте чекбоксы
import { SimpleCheckbox, InteractiveCardCheckbox } from "nexoreui"

// Шаг 2: Используйте в формах
export default function CheckboxDemo() {
  return (
    <div className="space-y-4">
      <SimpleCheckbox />
      <InteractiveCardCheckbox title="Pro" description="$29" />
    </div>
  )
}`} />
        </div>
      </div>
""",
    'switch': """
      <div id="switch" className={`scroll-mt-20 ${activeTab === "switch" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Switches</h3>
        <p className="text-sm text-muted-foreground mb-6">Toggle controls.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] items-center justify-center border rounded-xl bg-card/50 backdrop-blur-sm p-6 glass">
            <div className="space-y-4 max-w-sm w-full">
              <SimpleSwitch />
              <NeonSwitch />
            </div>
          </div>
          <ComponentSource sourceCode={`// Шаг 1: Импортируйте свитчи
import { SimpleSwitch, NeonSwitch } from "nexoreui"

// Шаг 2: Используйте для настроек
export default function SwitchDemo() {
  return (
    <div className="space-y-4">
      <SimpleSwitch />
      <NeonSwitch />
    </div>
  )
}`} />
        </div>
      </div>
""",
    'select': """
      <div id="select" className={`scroll-mt-20 ${activeTab === "select" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Select Menus</h3>
        <p className="text-sm text-muted-foreground mb-6">Custom dropdown selection.</p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[350px] items-center justify-center border rounded-xl bg-card/50 backdrop-blur-sm p-6 glass">
            <SimpleSelect />
          </div>
          <ComponentSource sourceCode={`// Шаг 1: Импортируйте селект
import { SimpleSelect } from "nexoreui"

// Шаг 2: Выберите значение
export default function SelectDemo() {
  return <SimpleSelect />
}`} />
        </div>
      </div>
"""
}

# Replace sections
for id, content in sections.items():
    code = re.sub(rf'<div id="{id}"[\s\S]*?</div>\s*</div>(?=\s*(<div id=|</main>))', content, code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully added instructions and upgraded ComponentSource")
