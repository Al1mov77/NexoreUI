"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Button } from "nexoreui";
import { Sun, Moon, Monitor, Palette } from "lucide-react";

// --- Mock Components for Dark Mode Section ---

export function DarkModeToggle({ theme = "light", onChange }: any) {
  const isDark = theme === "dark";
  return (
    <button 
      onClick={() => onChange(isDark ? "light" : "dark")}
      className="relative w-14 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 transition-colors border border-border overflow-hidden"
    >
      <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300 flex items-center justify-center ${isDark ? 'translate-x-6' : 'translate-x-0'}`}>
        {isDark ? <Moon className="w-3.5 h-3.5 text-zinc-800" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
      </div>
    </button>
  );
}

export function ThemeProviderWrapper({ children, defaultTheme = "system" }: any) {
  return (
    <div className="p-4 border border-border rounded-xl bg-background flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
      <span className="text-sm font-mono">Theme Provider Active ({defaultTheme})</span>
    </div>
  );
}

export function SystemTheme() {
  return (
    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
      <Monitor className="w-5 h-5 text-muted-foreground" />
      <div>
        <h4 className="text-sm font-medium">System Preference</h4>
        <p className="text-xs text-muted-foreground">Automatically matches your OS theme.</p>
      </div>
    </div>
  );
}

export function ColorScheme({ schemes = ["Zinc", "Slate", "Stone", "Neutral", "Red", "Blue"] }: any) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-background border border-border rounded-xl w-full max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Color Scheme</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {schemes.map((s: string) => (
          <div key={s} className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary border border-border hover:border-primary cursor-pointer transition-colors">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- End Mock Components ---

const variants = [
  {
    name: "Sun/Moon Toggle",
    component: <DarkModeToggle theme="light" onChange={() => {}} />,
    code: `<DarkModeToggle \n  theme="light" \n  onChange={setTheme} \n/>`
  },
  {
    name: "Dark Mode Active",
    component: <DarkModeToggle theme="dark" onChange={() => {}} />,
    code: `<DarkModeToggle \n  theme="dark" \n  onChange={setTheme} \n/>`
  },
  {
    name: "Theme Provider (System Default)",
    component: <ThemeProviderWrapper defaultTheme="system" />,
    code: `<ThemeProvider defaultTheme="system" storageKey="nexore-ui-theme">\n  <App />\n</ThemeProvider>`
  },
  {
    name: "Theme Provider (Forced Dark)",
    component: <ThemeProviderWrapper defaultTheme="dark" />,
    code: `<ThemeProvider defaultTheme="dark" forcedTheme="dark">\n  <App />\n</ThemeProvider>`
  },
  {
    name: "System Theme Detector",
    component: <SystemTheme />,
    code: `<SystemTheme />`
  },
  {
    name: "Color Scheme Selector",
    component: <ColorScheme />,
    code: `<ColorScheme \n  schemes={["Zinc", "Slate", "Stone", "Neutral", "Red", "Blue"]} \n  onChange={setScheme} \n/>`
  },
  {
    name: "Compact Scheme Selector",
    component: <ColorScheme schemes={["Zinc", "Blue", "Green"]} />,
    code: `<ColorScheme \n  schemes={["Zinc", "Blue", "Green"]} \n/>`
  },
  {
    name: "Icon-Only Toggle (Sun)",
    component: <Button variant="ghost" size="icon"><Sun className="w-5 h-5" /></Button>,
    code: `import { Sun } from "lucide-react"\n\n<Button variant="ghost" size="icon">\n  <Sun className="w-5 h-5" />\n</Button>`
  },
  {
    name: "Icon-Only Toggle (Moon)",
    component: <Button variant="ghost" size="icon"><Moon className="w-5 h-5" /></Button>,
    code: `import { Moon } from "lucide-react"\n\n<Button variant="ghost" size="icon">\n  <Moon className="w-5 h-5" />\n</Button>`
  },
  {
    name: "Toggle with Label",
    component: <div className="flex items-center gap-3"><DarkModeToggle theme="light" onChange={() => {}} /><span className="text-sm font-medium">Toggle Theme</span></div>,
    code: `<div className="flex items-center gap-3">\n  <DarkModeToggle theme={theme} onChange={setTheme} />\n  <span>Toggle Theme</span>\n</div>`
  }
];

export function DarkModeSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="dark-mode" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dark Mode & Themes</h2>
          <p className="text-muted-foreground">Components for theme switching and provider management.</p>
        </div>
      </div>
      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background/50 p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}
    </section>
  );
}
