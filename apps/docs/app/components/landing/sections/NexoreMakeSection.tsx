'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MousePointerClick, SlidersHorizontal, Layers, Percent } from 'lucide-react';

export function NexoreMakeSection() {
  return (
    <section className="py-24 px-6 border-y border-zinc-900 bg-black relative overflow-hidden select-none">
      
      {/* Dynamic blob background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Texts CTA Column (left/top) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>New Feature</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            Don't like our components? <br />
            <span className="text-violet-400">Design your own.</span>
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Nexore Make is a visual drag-and-drop editor built directly inside our UI library. 
            Reposition elements, adjust corner radius, configure borders, spacing, shadows, and animations 
            visually with instant multi-framework code exports.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
            <Link
              href="/nexoremake"
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-violet-950/20 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>Launch Builder</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            
            <Link
              href="/nexoremake/favorites"
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Saved Library</span>
            </Link>
          </div>
        </div>

        {/* Animated Editor Mockup (right/bottom) */}
        <div className="lg:col-span-7 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg aspect-[1.5] border border-zinc-850 rounded-xl bg-zinc-950/60 overflow-hidden relative shadow-2xl flex flex-col"
          >
            {/* Header toolbar */}
            <div className="h-8 border-b border-zinc-900 px-3 flex items-center justify-between bg-zinc-950/90 select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ff5f57]/80" />
                <div className="w-2 h-2 rounded-full bg-[#febc2e]/80" />
                <div className="w-2 h-2 rounded-full bg-[#28c840]/80" />
              </div>
              <span className="text-[9px] font-mono text-zinc-600">nexore_make_sandbox.tsx</span>
              <div className="w-8" />
            </div>

            {/* Editor Workspace Mockup */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Mini Toolbar */}
              <div className="w-10 border-r border-zinc-900 bg-zinc-950 flex flex-col items-center py-2.5 gap-2 shrink-0">
                <div className="w-6 h-6 rounded bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <MousePointerClick className="h-3.5 w-3.5" />
                </div>
                <div className="w-6 h-6 rounded bg-zinc-900/50 flex items-center justify-center text-zinc-500">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <div className="w-6 h-6 rounded bg-zinc-900/50 flex items-center justify-center text-zinc-500">
                  <Percent className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Mini Canvas */}
              <div className="flex-1 bg-[#020202] demo-grid-pattern relative flex items-center justify-center p-4">
                
                {/* Floating Canvas Component showing resize/styling animations */}
                <motion.div
                  animate={{
                    width: [140, 180, 140],
                    height: [70, 90, 70],
                    borderRadius: ['8px', '24px', '8px'],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-violet-600 flex flex-col items-center justify-center text-white border border-violet-500 rounded-lg p-3 relative shadow-lg shadow-violet-950/30"
                  style={{ width: 140, height: 70 }}
                >
                  <span className="text-[10px] font-bold select-none tracking-wide text-white">Custom Button</span>
                  <span className="text-[8px] opacity-60 mt-0.5 select-none">Live Editor</span>

                  {/* Selected outline handles mockup */}
                  <div className="absolute inset-0 ring-1.5 ring-white/50 rounded pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-full translate-x-0.5 translate-y-0.5 border border-violet-600" />
                </motion.div>

                {/* Simulated Cursor dragging the corner handle */}
                <motion.div
                  animate={{
                    x: [30, 70, 30],
                    y: [15, 35, 15],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute pointer-events-none z-30"
                >
                  <svg className="w-4 h-4 text-violet-300 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 3l16 11-8 2 5 6-3 1.5-5-6-5 4.5z" />
                  </svg>
                </motion.div>
              </div>

              {/* Mini properties panel */}
              <div className="w-24 border-l border-zinc-900 bg-zinc-950 p-2 space-y-2 shrink-0">
                <div className="text-[7px] text-zinc-600 font-bold uppercase tracking-wider">Properties</div>
                
                <div className="space-y-1">
                  <div className="h-1 bg-zinc-800 rounded w-10" />
                  <div className="h-3 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-between px-1">
                    <div className="w-6 h-1 bg-zinc-700 rounded" />
                    <SlidersHorizontal className="h-2 w-2 text-zinc-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="h-1 bg-zinc-800 rounded w-12" />
                  <div className="flex items-center gap-1">
                    <div className="w-3.5 h-3.5 rounded bg-violet-500 border border-violet-400" />
                    <div className="h-2.5 bg-zinc-900 border border-zinc-800 rounded w-12" />
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
