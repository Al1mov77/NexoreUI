import re
import os

filepath = 'apps/docs/app/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

# Ensure imports exist
imports = [
    'SimpleAccordion', 'PlusAccordion', 'NeonAccordion',
    'BasicModal', 'GlassModal', 'DangerModal', 
    'SimpleCheckbox', 'InteractiveCardCheckbox', 'CardCheckbox',
    'SimpleSwitch', 'NeonSwitch',
    'SimpleSelect', 'SimpleTooltip', 'RichTooltip',
    'NeonButton', 'ThreeDButton', 'RippleButton', 'CyberpunkButton', 'MagneticButton', 'ShimmerButton', 'BorderBeamButton', 'LoadingButton', 'DestructiveGlowButton', 'GhostOutlineButton',
    'GlowButton', 'ShinyButton', 'GradientButton', 'GlassButton'
]

for imp in imports:
    if f' {imp} ' not in code and f'{imp},' not in code:
        code = re.sub(r'import \{([\s\S]*?)\} from "nexoreui"', f'import {{\\1, {imp}}} from "nexoreui"', code, count=1)

# Helper function to replace or append a section
def upsert_section(section_id, content):
    global code
    regex = re.compile(rf'<div id="{section_id}"[\s\S]*?</div>\s*</div>(?=\s*(<div id=|</main>))')
    if regex.search(code):
        code = regex.sub(content, code)
    else:
        code = code.replace('</main>', content + '\n</main>')

# New sections to add or update
sections = {
    'button': """
      <div id="button" className={`scroll-mt-20 ${activeTab === "button" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Buttons</h3>
        <p className="text-sm text-muted-foreground mb-6">Standard and custom button variants.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border rounded-xl bg-card/50 backdrop-blur-sm">
          <div className="flex justify-center"><NeonButton>Neon</NeonButton></div>
          <div className="flex justify-center"><ThreeDButton>3D</ThreeDButton></div>
          <div className="flex justify-center"><RippleButton>Ripple</RippleButton></div>
          <div className="flex justify-center"><CyberpunkButton>Cyber</CyberpunkButton></div>
          <div className="flex justify-center"><MagneticButton>Magnetic</MagneticButton></div>
        </div>
      </div>
""",
    'special-buttons': """
      <div id="special-buttons" className={`scroll-mt-20 ${activeTab === "special-buttons" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Special Buttons</h3>
        <p className="text-sm text-muted-foreground mb-6">Buttons with advanced visual effects.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border rounded-xl bg-card/50 backdrop-blur-sm">
          <div className="flex justify-center"><GlowButton>Glow</GlowButton></div>
          <div className="flex justify-center"><ShinyButton>Shiny</ShinyButton></div>
          <div className="flex justify-center"><GradientButton>Gradient</GradientButton></div>
          <div className="flex justify-center"><GlassButton>Glass</GlassButton></div>
        </div>
      </div>
""",
    'accordion': """
      <div id="accordion" className={`scroll-mt-20 ${activeTab === "accordion" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Accordions</h3>
        <p className="text-sm text-muted-foreground mb-6">Interactive disclosure components.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border rounded-xl bg-card/50 backdrop-blur-sm">
          <SimpleAccordion />
          <PlusAccordion />
          <NeonAccordion />
        </div>
      </div>
""",
    'modal': """
      <div id="modal" className={`scroll-mt-20 ${activeTab === "modal" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Modals</h3>
        <p className="text-sm text-muted-foreground mb-6">Overlay dialogs for focused attention.</p>
        <div className="flex flex-wrap gap-4 p-6 border rounded-xl bg-card/50 backdrop-blur-sm justify-center">
          <BasicModal />
          <GlassModal />
          <DangerModal />
        </div>
      </div>
""",
    'tooltip': """
      <div id="tooltip" className={`scroll-mt-20 ${activeTab === "tooltip" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Tooltips</h3>
        <p className="text-sm text-muted-foreground mb-6">Contextual info on hover.</p>
        <div className="flex gap-8 p-8 border rounded-xl bg-card/50 backdrop-blur-sm items-center justify-center">
          <SimpleTooltip />
          <RichTooltip />
        </div>
      </div>
""",
    'checkbox': """
      <div id="checkbox" className={`scroll-mt-20 ${activeTab === "checkbox" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Checkboxes</h3>
        <p className="text-sm text-muted-foreground mb-6">Binary selection controls.</p>
        <div className="space-y-4 max-w-sm p-6 border rounded-xl bg-card/50 backdrop-blur-sm mx-auto">
          <SimpleCheckbox />
          <InteractiveCardCheckbox />
        </div>
      </div>
""",
    'switch': """
      <div id="switch" className={`scroll-mt-20 ${activeTab === "switch" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Switches</h3>
        <p className="text-sm text-muted-foreground mb-6">Toggle controls.</p>
        <div className="space-y-4 max-w-sm p-6 border rounded-xl bg-card/50 backdrop-blur-sm mx-auto">
          <SimpleSwitch />
          <NeonSwitch />
        </div>
      </div>
""",
    'select': """
      <div id="select" className={`scroll-mt-20 ${activeTab === "select" ? "block" : "hidden"}`}>
        <h3 className="text-2xl font-semibold tracking-tight text-primary mb-4">Select Menus</h3>
        <p className="text-sm text-muted-foreground mb-6">Custom dropdown selection.</p>
        <div className="p-6 border rounded-xl bg-card/50 backdrop-blur-sm flex justify-center">
          <SimpleSelect />
        </div>
      </div>
"""
}

# Delete the old injected sections if they exist to avoid duplicates
for id in sections.keys():
    code = re.sub(rf'<div id="{id}"[\s\S]*?</div>\s*</div>(?=\s*(<div id=|</main>))', '', code)

# Append new sections
for id, content in sections.items():
    code = code.replace('</main>', content + '\n</main>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully updated sections and added missing ones")
