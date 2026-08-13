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

        {/* Demo Showcase Video (right/bottom) */}
        <div className="lg:col-span-7 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl border border-zinc-800 rounded-2xl bg-zinc-950/80 overflow-hidden relative shadow-2xl flex flex-col group"
          >
            {/* Window header toolbar */}
            <div className="h-9 border-b border-zinc-900 px-4 flex items-center justify-between bg-zinc-950/90 select-none">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs font-mono text-zinc-500 font-medium">nexore_make_demo.mp4</span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span>DEMO</span>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <video
                src="/videos/demo.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
export default NexoreMakeSection;
