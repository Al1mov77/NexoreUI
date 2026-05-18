import re

filepath = 'apps/docs/app/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

# Helper to wrap content in a 2-column grid with ComponentSource
def make_grid(content, source_code):
    template = """
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
          <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-border bg-background p-6 glass">
            __CONTENT__
          </div>
          <ComponentSource sourceCode={`__SOURCE__`} />
        </div>
"""
    return template.replace('__CONTENT__', content).replace('__SOURCE__', source_code)

# 1. Update Card section
# Mega Cards
mega_cards_content = """<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <ProfileCard name="Alex Doe" role="Designer" />
                    <WeatherCard city="New York" temp={72} condition="Sunny" />
                    <EventCard title="Tech Summit" date="Oct 24" location="Online" />
                  </div>"""
mega_cards_source = """// Step 1: Import Mega Cards
import { ProfileCard, WeatherCard, EventCard } from "nexoreui"

// Step 2: Use them with props
export default function CardsDemo() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ProfileCard name="Alex Doe" role="Designer" />
      <WeatherCard city="New York" temp={72} condition="Sunny" />
      <EventCard title="Tech Summit" date="Oct 24" location="Online" />
    </div>
  )
}"""

# eCommerce Cards
ecommerce_cards_content = """<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <ProductGallery />
                    <div className="space-y-4"><OrderSummaryCard /><CartDrawerItem /></div>
                  </div>"""
ecommerce_cards_source = """// Step 1: Import eCommerce components
import { ProductGallery, OrderSummaryCard, CartDrawerItem } from "nexoreui"

// Step 2: Combine them for a store layout
export default function StoreDemo() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <ProductGallery />
      <div className="space-y-4">
        <OrderSummaryCard />
        <CartDrawerItem />
      </div>
    </div>
  )
}"""

# Replace in Card section
code = code.replace("""<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Cards</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProfileCard name="Alex Doe" role="Designer" />
                    <WeatherCard city="New York" temp={72} condition="Sunny" />
                    <EventCard title="Tech Summit" date="Oct 24" location="Online" />
                  </div>""", f'<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Cards</h4>\n{make_grid(mega_cards_content, mega_cards_source)}')

code = code.replace("""<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">eCommerce Cards</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProductGallery />
                    <div className="space-y-4"><OrderSummaryCard /><CartDrawerItem /></div>
                  </div>""", f'<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">eCommerce Cards</h4>\n{make_grid(ecommerce_cards_content, ecommerce_cards_source)}')


# 2. Update Alert section
# Mega Alerts
mega_alerts_content = """<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <CyberAlert title="System Failure" description="Core temp critical." />
                    <SoftAlert title="Info" description="Your data is saved." />
                    <MinimalAlert text="Processing..." />
                    <LeftBorderAlert title="Success" description="Action completed." />
                    <SolidAlert title="Notice" description="Maintenance tonight." />
                    <NeonAlert title="Achievement" description="Level up!" />
                  </div>"""
mega_alerts_source = """// Step 1: Import Mega Alerts
import { CyberAlert, SoftAlert, LeftBorderAlert, NeonAlert } from "nexoreui"

// Step 2: Use specific variants
export default function AlertsDemo() {
  return (
    <div className="space-y-4">
      <CyberAlert title="System Failure" description="Core temp critical." />
      <SoftAlert title="Info" description="Your data is saved." />
      <LeftBorderAlert title="Success" description="Action completed." />
      <NeonAlert title="Achievement" description="Level up!" />
    </div>
  )
}"""

code = code.replace("""<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Alerts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CyberAlert title="System Failure" description="Core temp critical." />
                    <SoftAlert title="Info" description="Your data is saved." />
                    <MinimalAlert text="Processing..." />
                    <LeftBorderAlert title="Success" description="Action completed." />
                    <SolidAlert title="Notice" description="Maintenance tonight." />
                    <NeonAlert title="Achievement" description="Level up!" />
                  </div>""", f'<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Alerts</h4>\n{make_grid(mega_alerts_content, mega_alerts_source)}')


# 3. Update Input section
# Mega Inputs
mega_inputs_content = """<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <FloatingLabelInput label="Floating Label" />
                    <UnderlineInput placeholder="Underline" />
                    <IconInputLeft placeholder="Search" />
                    <PillInput placeholder="Pill Input" />
                    <ErrorInput placeholder="Error" errorMessage="Invalid format" />
                    <SuccessInput placeholder="Success" defaultValue="Valid data" />
                    <GhostInput placeholder="Ghost Input" />
                    <NeumorphicInput placeholder="Neumorphic" />
                  </div>"""
mega_inputs_source = """// Step 1: Import specialized inputs
import { FloatingLabelInput, UnderlineInput, PillInput } from "nexoreui"

// Step 2: Use in your forms
export default function InputsDemo() {
  return (
    <div className="space-y-4">
      <FloatingLabelInput label="Username" />
      <UnderlineInput placeholder="Email" />
      <PillInput placeholder="Search..." />
    </div>
  )
}"""

code = code.replace("""<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Inputs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FloatingLabelInput label="Floating Label" />
                    <UnderlineInput placeholder="Underline" />
                    <IconInputLeft placeholder="Search" />
                    <PillInput placeholder="Pill Input" />
                    <ErrorInput placeholder="Error" errorMessage="Invalid format" />
                    <SuccessInput placeholder="Success" defaultValue="Valid data" />
                    <GhostInput placeholder="Ghost Input" />
                    <NeumorphicInput placeholder="Neumorphic" />
                  </div>""", f'<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Mega Inputs</h4>\n{make_grid(mega_inputs_content, mega_inputs_source)}')

# Pro Forms
pro_forms_content = """<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <LoginFormPro />
                    <PaymentFormPro />
                    <ProfileSettingsForm />
                    <FileUploadForm />
                  </div>"""
pro_forms_source = """// Step 1: Import production-ready forms
import { LoginFormPro, PaymentFormPro, FileUploadForm } from "nexoreui"

// Step 2: Use directly for quick setups
export default function FormsDemo() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <LoginFormPro />
      <PaymentFormPro />
      <FileUploadForm />
    </div>
  )
}"""

code = code.replace("""<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Pro Forms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <LoginFormPro />
                    <PaymentFormPro />
                    <ProfileSettingsForm />
                    <FileUploadForm />
                  </div>""", f'<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Pro Forms</h4>\n{make_grid(pro_forms_content, pro_forms_source)}')


# 4. Update Data Display section
data_display_content = """<div className="flex flex-col items-center justify-center gap-6 w-full">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">Press</span>
                      <Kbd>⌘</Kbd>
                      <Kbd>K</Kbd>
                      <span className="text-sm font-medium">to search</span>
                    </div>
                    
                    <AvatarGroup items={[
                      { fallback: "CN" },
                      { fallback: "NU" },
                      { fallback: "AI" },
                    ]} />

                    <StatCard 
                      title="Total Revenue" 
                      value="$45,231.89" 
                      description="+20.1% from last month"
                      trend={{ value: "20.1%", positive: true }}
                    />

                    <Timeline items={[
                      { title: "Project Created", description: "The project was initialized.", time: "2 hours ago", status: "completed" },
                      { title: "Implementation", description: "Coding the components.", time: "Just now", status: "current" },
                    ]} />
                  </div>"""

data_display_source = """// Step 1: Import Data Display components
import { Kbd, AvatarGroup, StatCard, Timeline } from "nexoreui"

// Step 2: Use them to show structured data
export default function DataDemo() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span>Press</span>
        <Kbd>⌘</Kbd> <Kbd>K</Kbd>
      </div>
      
      <StatCard 
        title="Revenue" 
        value="$45,231.89" 
        trend={{ value: "20.1%", positive: true }}
      />
      
      <Timeline items={[
        { title: "Step 1", description: "Done", status: "completed" },
        { title: "Step 2", description: "In progress", status: "current" }
      ]} />
    </div>
  )
}"""

data_display_template = """
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex min-h-[450px] items-center justify-center rounded-xl border border-border bg-background p-6 glass">
            __CONTENT__
          </div>
          <ComponentSource sourceCode={`__SOURCE__`} />
        </div>
"""

data_display_section = data_display_template.replace('__CONTENT__', data_display_content).replace('__SOURCE__', data_display_source)

code = re.sub(r'<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">[\s\S]*?<div className="rounded-xl border border-border bg-muted/50 overflow-hidden relative p-4 flex justify-center">\s*<PricingCard[\s\S]*?/>\s*</div>\s*</div>\s*</div>', 
              data_display_section, code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully added instructions for all missing components")
