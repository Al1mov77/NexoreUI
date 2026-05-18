"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Switch, SimpleSwitch, NeonSwitch, IconSwitch, ThickSwitch, GlowSwitch, Button } from "nexoreui";

const variants = [
  {
    name: "Default Switch",
    component: <Switch id="airplane-mode" />,
    code: `import { Switch } from "nexoreui"\n\n<Switch id="airplane-mode" />`
  },
  {
    name: "Simple Switch (With Label)",
    component: <SimpleSwitch id="notifications" label="Enable Notifications" defaultChecked />,
    code: `import { SimpleSwitch } from "nexoreui"\n\n<SimpleSwitch id="notifications" label="Enable Notifications" defaultChecked />`
  },
  {
    name: "Neon Switch",
    component: <NeonSwitch id="cyber-mode" label="Cyber Mode" color="cyan" />,
    code: `import { NeonSwitch } from "nexoreui"\n\n<NeonSwitch id="cyber-mode" label="Cyber Mode" color="cyan" />`
  },
  {
    name: "Icon Switch",
    component: <IconSwitch id="dark-mode" iconOn="🌙" iconOff="☀️" defaultChecked />,
    code: `import { IconSwitch } from "nexoreui"\n\n<IconSwitch id="dark-mode" iconOn="🌙" iconOff="☀️" defaultChecked />`
  },
  {
    name: "Thick Switch",
    component: <ThickSwitch id="power-save" label="Power Saving" />,
    code: `import { ThickSwitch } from "nexoreui"\n\n<ThickSwitch id="power-save" label="Power Saving" />`
  },
  {
    name: "Glow Switch",
    component: <GlowSwitch id="glow-mode" label="Neon Glow" color="purple" defaultChecked />,
    code: `import { GlowSwitch } from "nexoreui"\n\n<GlowSwitch id="glow-mode" label="Neon Glow" color="purple" defaultChecked />`
  },
  {
    name: "Disabled Switch",
    component: <div className="flex items-center space-x-2"><Switch disabled id="disabled-switch" /><label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="disabled-switch">Unavailable Option</label></div>,
    code: `<Switch disabled id="disabled-switch" />`
  },
  {
    name: "Small Switch",
    component: <Switch className="scale-75 origin-left" id="small-switch" />,
    code: `<Switch className="scale-75" />`
  },
  {
    name: "Large Switch",
    component: <Switch className="scale-125 origin-left" id="large-switch" />,
    code: `<Switch className="scale-125" />`
  },
  {
    name: "Switch Group",
    component: <div className="space-y-4 p-4 border rounded-xl bg-card w-full max-w-sm"><SimpleSwitch id="s1" label="Email Updates" defaultChecked /><SimpleSwitch id="s2" label="SMS Alerts" /><SimpleSwitch id="s3" label="Weekly Newsletter" defaultChecked /></div>,
    code: `<div className="space-y-4">\n  <SimpleSwitch label="Email Updates" defaultChecked />\n  <SimpleSwitch label="SMS Alerts" />\n  <SimpleSwitch label="Weekly Newsletter" defaultChecked />\n</div>`
  }
];

export function TogglesSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="toggles" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Toggles & Switches</h2>
          <p className="text-muted-foreground">Controls that allow users to switch between two states.</p>
        </div>
      </div>
      <div className="space-y-12">
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
