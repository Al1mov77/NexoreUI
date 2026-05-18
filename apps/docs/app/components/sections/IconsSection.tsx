"use client";

import React from "react";
import { ComponentSource } from "../ComponentSource";
import { Blocks, Layers, Sparkles, Activity, CheckCircle, Flame, Heart, Zap, Star, Shield } from "lucide-react";

export function IconsSection() {
  const icons = [
    { name: "Blocks", component: <Blocks /> },
    { name: "Layers", component: <Layers /> },
    { name: "Sparkles", component: <Sparkles /> },
    { name: "Activity", component: <Activity /> },
    { name: "CheckCircle", component: <CheckCircle /> },
    { name: "Flame", component: <Flame /> },
    { name: "Heart", component: <Heart /> },
    { name: "Zap", component: <Zap /> },
    { name: "Star", component: <Star /> },
    { name: "Shield", component: <Shield /> },
  ];

  return (
    <section id="icons" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Icon Library</h2>
          <p className="text-muted-foreground">We use lucide-react for all icons in NexoreUI.</p>
        </div>
      </div>

      <div className="space-y-12">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Installation</h3>
          <ComponentSource sourceCode={"pnpm add lucide-react"} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Commonly Used Icons</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {icons.map((icon, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-6 border border-border rounded-xl bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-muted-foreground">
                <div className="mb-2">{icon.component}</div>
                <span className="text-xs">{icon.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
