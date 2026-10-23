'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MousePointerClick, SlidersHorizontal, Layers, Percent } from 'lucide-react';

export function NexoreMakeSection() {
  return (
    <section className="py-24 px-6 border-y border-border/60 bg-background relative overflow-hidden select-none">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Texts CTA Column (left/top) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground block">
            Visual Component Builder
          </span>

          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.04em] text-foreground leading-tight">
            Don&apos;t like our components? <br />
            <span className="text-zinc-400 dark:text-zinc-300">Design your own.</span>
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed font-normal">
            Nexore Make is a visual drag-and-drop editor built directly inside our UI library. 
            Reposition elements, adjust corner radius, configure borders, spacing, shadows, and animations 
            visually with instant multi-framework code exports.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/nexoremake"
              className="px-5 py-2.5 bg-foreground text-background rounded-xl text-xs font-semibold transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_4px_16px_-2px_rgba(0,0,0,0.3)] flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer hover:opacity-90"
            >
              <span>Launch Builder</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            
            <Link
              href="/nexoremake/favorites"
              className="px-5 py-2.5 bg-card/60 hover:bg-card border border-border/80 text-foreground rounded-xl text-xs font-semibold transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Saved Library</span>
            </Link>
          </div>
        </div>

        {/* Animated Editor Mockup (right/bottom) — theme-aware, no gray screen bug */}
        <div className="lg:col-span-7 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg aspect-[1.5] border border-border/80 dark:border-white/10 rounded-2xl bg-card overflow-hidden relative shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_20px_50px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] flex flex-col"
          >
            {/* Header toolbar */}
            <div className="h-8 border-b border-border/70 px-3 flex items-center justify-between bg-muted/40 backdrop-blur-md select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ff5f57]/80" />
                <div className="w-2 h-2 rounded-full bg-[#febc2e]/80" />
                <div className="w-2 h-2 rounded-full bg-[#28c840]/80" />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">nexore_make_sandbox.tsx</span>
              <div className="w-8" />
            </div>

            {/* Editor Workspace Mockup */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Mini Toolbar */}
              <div className="w-10 border-r border-border/70 bg-card flex flex-col items-center py-2.5 gap-2 shrink-0">
                <div className="w-6 h-6 rounded bg-foreground/10 border border-foreground/20 flex items-center justify-center text-foreground">
                  <MousePointerClick className="h-3.5 w-3.5" />
                </div>
                <div className="w-6 h-6 rounded bg-muted/60 flex items-center justify-center text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <div className="w-6 h-6 rounded bg-muted/60 flex items-center justify-center text-muted-foreground">
                  <Percent className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Mini Canvas — theme-aware blueprint grid, fixes the gray screen */}
              <div className="flex-1 bg-slate-50 dark:bg-zinc-900/60 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:14px_14px] relative flex items-center justify-center p-4">
                
                {/* Floating Canvas Component showing resize/styling animations */}
                <motion.div
                  animate={{
                    width: [140, 180, 140],
                    height: [68, 88, 68],
                    borderRadius: ['8px', '22px', '8px'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-zinc-900 dark:bg-zinc-100 flex flex-col items-center justify-center text-white dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 rounded-lg p-3 relative shadow-lg shadow-black/15 dark:shadow-white/5"
                  style={{ width: 140, height: 68 }}
                >
                  <span className="text-[10px] font-bold select-none tracking-wide text-white dark:text-zinc-900">Custom Button</span>
                  <span className="text-[8px] opacity-80 mt-0.5 select-none text-zinc-300 dark:text-zinc-600">Live Editor</span>

                  {/* Selected outline handles mockup */}
                  <div className="absolute inset-0 ring-1.5 ring-zinc-400/60 dark:ring-zinc-600/60 rounded pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white dark:bg-zinc-900 rounded-full translate-x-1 translate-y-1 border border-zinc-700 dark:border-zinc-300 shadow-xs" />
                </motion.div>

                {/* Simulated Cursor dragging the corner handle */}
                <motion.div
                  animate={{
                    x: [28, 68, 28],
                    y: [14, 34, 14],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute pointer-events-none z-30"
                >
                  <svg className="w-4 h-4 text-foreground drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 3l16 11-8 2 5 6-3 1.5-5-6-5 4.5z" />
                  </svg>
                </motion.div>
              </div>

              {/* Mini properties panel */}
              <div className="w-24 border-l border-border/70 bg-card p-2 space-y-2 shrink-0">
                <div className="text-[7px] text-muted-foreground font-bold uppercase tracking-wider">Properties</div>
                
                <div className="space-y-1">
                  <div className="h-1 bg-muted-foreground/30 rounded w-10" />
                  <div className="h-3 bg-muted/60 border border-border/70 rounded flex items-center justify-between px-1">
                    <div className="w-6 h-1 bg-muted-foreground/50 rounded" />
                    <SlidersHorizontal className="h-2 w-2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="h-1 bg-muted-foreground/30 rounded w-12" />
                  <div className="flex items-center gap-1">
                    <div className="w-3.5 h-3.5 rounded bg-zinc-900 dark:bg-zinc-100 border border-border" />
                    <div className="h-2.5 bg-muted/60 border border-border/70 rounded w-12" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
export default NexoreMakeSection;
