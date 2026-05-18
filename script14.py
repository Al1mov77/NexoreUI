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

# 1. Update Modals section to show compound components
modal_source = """// Step 1: Import primitives or pre-built modals
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, Button } from "nexoreui"

// Step 2: Compose your custom modal (MUI/shadcn style)
export default function CustomModalDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Custom Modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="py-4">Custom content goes here...</div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Custom Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}"""

target_modal_source = """          <ComponentSource sourceCode={`// Step 1: Import modals
import { BasicModal, InteractiveGlassModal, DangerModal } from "nexoreui"

// Step 2: Use them (open state is managed internally)
export default function ModalDemo() {
  return (
    <>
      <BasicModal />
      <InteractiveGlassModal />
    </>
  )
}`} />"""

replacement_modal_source = """          <ComponentSource sourceCode={`__MODAL_SOURCE__`} />""".replace('__MODAL_SOURCE__', modal_source)

code = code.replace(target_modal_source, replacement_modal_source)


# 2. Update Pro Tables section
pro_tables_content = """<div className="space-y-8 w-full">
                    <DataTablePro />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InvoiceTable />
                      <LeaderboardTable />
                    </div>
                  </div>"""

pro_tables_source = """// Step 1: Import Pro Tables
import { DataTablePro, InvoiceTable, LeaderboardTable } from "nexoreui"

// Step 2: Use in admin dashboards
export default function TablesDemo() {
  return (
    <div className="space-y-8">
      <DataTablePro />
      <div className="grid grid-cols-2 gap-4">
        <InvoiceTable />
        <LeaderboardTable />
      </div>
    </div>
  )
}"""

target_pro_tables = """<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Pro Tables</h4>
                  <div className="space-y-8">
                    <DataTablePro />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InvoiceTable />
                      <LeaderboardTable />
                    </div>
                  </div>"""

replacement_pro_tables = """<h4 className="font-bold text-xl mt-8 mb-4 border-b pb-2">Pro Tables</h4>
                  __GRID__""".replace('__GRID__', make_grid(pro_tables_content, pro_tables_source))

code = code.replace(target_pro_tables, replacement_pro_tables)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully updated Modals and Pro Tables sections")
