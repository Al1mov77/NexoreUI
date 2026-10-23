"use client";

import React, { useState } from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import { Drawer, CommandPalette, Button } from "nexoreui";
import { FileText, Settings, User } from "lucide-react";

export function PremiumOverlaysSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState<"right" | "bottom">("right");
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <SuiteSectionLayout
      id="premium-overlays"
      title="Overlays & Drawers"
      badge="Overlays Suite"
      description="Accessible viewport overlay mechanics: slide-over sheets, bottom action drawers, and modal command palettes with keyboard event traps."
      cliCommand="npx nexoreui add premium-overlays"
      items={[
        {
          name: "Slide-Over Sheet & Drawer",
          description: "Directional slide-in container supporting bottom sheets for mobile and right sidebars for desktop.",
          component: (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDrawerSide("right");
                  setDrawerOpen(true);
                }}
              >
                Open Right Drawer
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDrawerSide("bottom");
                  setDrawerOpen(true);
                }}
              >
                Open Bottom Drawer
              </Button>

              <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                side={drawerSide}
                title="Workspace Preferences"
              >
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Configure environment parameters, security compliance keys, and automated deployment webhooks.
                  </p>
                  <div className="rounded-lg border border-border p-3 space-y-2 text-xs">
                    <div className="font-semibold text-foreground">API Token Management</div>
                    <div className="text-muted-foreground">Active key expiring in 28 days.</div>
                  </div>
                  <Button variant="default" className="w-full" onClick={() => setDrawerOpen(false)}>
                    Save Configuration
                  </Button>
                </div>
              </Drawer>
            </div>
          ),
          code: `import { Drawer, Button } from "nexoreui"

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Drawer</Button>

<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Settings">
  <p className="text-sm">Drawer content</p>
</Drawer>`,
          propsData: [
            { name: "open", type: "boolean", defaultValue: "false", description: "Whether the drawer overlay is visible.", required: true },
            { name: "onClose", type: "() => void", defaultValue: "—", description: "Callback triggered when clicking backdrop or close trigger.", required: true },
            { name: "side", type: "'bottom' | 'right' | 'left'", defaultValue: "'bottom'", description: "Direction the drawer slides in from.", required: false },
            { name: "title", type: "string", defaultValue: "—", description: "Header title string.", required: false }
          ]
        },
        {
          name: "Command Palette Overlay",
          description: "Searchable action modal with grouping, keyboard arrow navigation, and instant callback execution.",
          component: (
            <div>
              <Button variant="outline" onClick={() => setCmdOpen(true)}>
                Trigger Command Palette (Cmd+K)
              </Button>

              <CommandPalette
                open={cmdOpen}
                onClose={() => setCmdOpen(false)}
                placeholder="Search tools, projects, or settings..."
                items={[
                  { id: "1", label: "Create new deployment", group: "Actions", icon: <FileText className="w-4 h-4" /> },
                  { id: "2", label: "Manage team permissions", group: "Organization", icon: <User className="w-4 h-4" /> },
                  { id: "3", label: "Cluster monitoring settings", group: "System", icon: <Settings className="w-4 h-4" /> },
                ]}
              />
            </div>
          ),
          code: `import { CommandPalette, Button } from "nexoreui"

<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  placeholder="Type a command..."
  items={[
    { id: "1", label: "New Project", group: "Projects" },
    { id: "2", label: "Settings", group: "System" }
  ]}
/>`
        }
      ]}
      a11yNotes={[
        "Focus Trap: Focus is contained within active overlay sheets and returned to trigger elements upon dismissal.",
        "Escape Key: Overlays automatically dismiss when pressing Escape."
      ]}
    />
  );
}
