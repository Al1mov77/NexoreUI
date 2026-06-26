"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { Dock, Button } from "nexoreui";
import { Home, Search, Settings, User, Bell, Heart, Plus } from "lucide-react";

const dockItems = [
  { icon: <Home className="h-5 w-5" />, label: "Home", onClick: () => alert("Home clicked") },
  { icon: <Search className="h-5 w-5" />, label: "Search", onClick: () => alert("Search clicked") },
  { icon: <Bell className="h-5 w-5" />, label: "Notifications", onClick: () => alert("Notifications clicked") },
  { icon: <Heart className="h-5 w-5" />, label: "Favorites", onClick: () => alert("Favorites clicked") },
  { icon: <User className="h-5 w-5" />, label: "Profile", onClick: () => alert("Profile clicked") },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", onClick: () => alert("Settings clicked") },
];

const variants = [
  {
    name: "Standard macOS Dock",
    component: (
      <div className="w-full flex items-center justify-center p-4">
        <Dock items={dockItems} />
      </div>
    ),
    code: `import { Dock } from "nexoreui"\nimport { Home, Search, Bell, Heart, User, Settings } from "lucide-react"\n\nconst items = [\n  { icon: <Home />, label: "Home" },\n  { icon: <Search />, label: "Search" },\n  { icon: <Bell />, label: "Notifications" },\n  { icon: <Heart />, label: "Favorites" },\n  { icon: <User />, label: "Profile" },\n  { icon: <Settings />, label: "Settings" }\n];\n\n<Dock items={items} />`
  },
  {
    name: "Highly Magnified Dock",
    component: (
      <div className="w-full flex items-center justify-center p-4">
        <Dock items={dockItems} magnification={80} distance={180} />
      </div>
    ),
    code: `import { Dock } from "nexoreui"\n\n<Dock items={items} magnification={80} distance={180} />`
  }
];

const dockPropsData = [
  { name: "items", type: "{ icon: React.ReactNode; label: string; onClick?: () => void }[]", defaultValue: "—", description: "Array of interactive action items rendered inside the dock list.", required: true },
  { name: "className", type: "string", defaultValue: "—", description: "Additional custom class names for the container wrapper.", required: false },
  { name: "magnification", type: "number", defaultValue: "60", description: "Maximum width/height of the hovered icon in pixels.", required: false },
  { name: "distance", type: "number", defaultValue: "140", description: "Hover active boundary distance threshold in pixels.", required: false }
];

const DockPlayground = (props: any) => {
  return <Dock items={dockItems} {...props} />;
};

export function DockSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="dock" className="space-y-10 scroll-mt-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dock</h2>
        <p className="text-muted-foreground mt-1">
          A macOS-style magnify-on-hover toolbar menu with customizable items and magnification settings.
        </p>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use which variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["standard dock", "Bottom navigation panels in dashboards, portfolio pages, product previews"],
            ["high magnification", "Creative pages where the magnification effect is the focal interactive point"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={DockPlayground}
          componentName="Dock"
          importFrom="nexoreui"
          controls={[
            {
              name: "magnification",
              type: "number",
              defaultValue: 60,
              description: "Maximum height/width of hovered icon in pixels"
            },
            {
              name: "distance",
              type: "number",
              defaultValue: 140,
              description: "Range in pixels within which hover begins magnifying neighboring items"
            }
          ]}
        />
      </div>

      {/* Main variants */}
      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight font-mono text-zinc-300">Showcase & Examples</h3>
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>

      {/* Props Reference Table */}
      <PropsTable propsData={dockPropsData} />

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Focus:</strong> Every icon in the Dock is a focusable <code className="text-primary font-mono text-[10px]">&lt;div&gt;</code> element that triggers key callbacks and displays clean outlines.</li>
          <li><strong>Tooltips:</strong> Icons include built-in hover labels that display visually and describe the action to screen readers.</li>
        </ul>
      </div>
    </section>
  );
}
