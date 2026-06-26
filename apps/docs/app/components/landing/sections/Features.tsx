"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Cpu, Sparkles, Shield, Zap, Globe, Terminal, Activity } from "lucide-react";

const bentoContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const bentoItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const SpringSandbox = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <div 
      className="w-full h-36 bg-card/40 rounded-lg relative overflow-hidden flex items-center justify-center cursor-pointer border border-border"
      onClick={() => {
        setPosition({ 
          x: Math.random() * 80 - 40, 
          y: Math.random() * 40 - 20 
        });
      }}
    >
      <span className="absolute top-2 left-3 text-[10px] font-mono text-muted-foreground">Click sandbox to trigger physics</span>
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 260, damping: 15 }}
        className="w-8 h-8 rounded-full bg-primary shadow-[0_0_15px_var(--color-primary)] flex items-center justify-center"
      >
        <Zap size={14} className="text-primary-foreground" />
      </motion.div>
    </div>
  );
};

const PerformanceGraph = () => {
  const [points, setPoints] = useState([20, 35, 10, 45, 30, 75, 55, 90]);
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const next = [...prev.slice(1)];
        next.push(Math.round(Math.random() * 50 + 40));
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const pathData = points.map((p, i) => `${i * 35},${100 - p}`).join(" L ");

  return (
    <div className="w-full h-36 bg-card/40 rounded-lg relative p-4 flex flex-col justify-end border border-border overflow-hidden">
      <span className="absolute top-2 left-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
        <Activity size={10} className="animate-pulse" />
        FPS: 120 | RENDER: 0.1ms
      </span>
      <svg className="w-full h-24 overflow-visible">
        <motion.path
          d={`M 0,${100 - points[0]} L ${pathData}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
    </div>
  );
};

const AccessibleKeys = () => {
  const [activeKey, setActiveKey] = useState("tab");
  useEffect(() => {
    const sequence = ["tab", "enter", "esc", "space"];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % sequence.length;
      setActiveKey(sequence[idx]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-36 bg-card/40 rounded-lg relative flex items-center justify-center gap-3 border border-border">
      {["tab", "space", "enter", "esc"].map((k) => (
        <div
          key={k}
          className={`px-3 py-2 rounded-lg border font-mono text-xs uppercase transition-all duration-300 ${
            activeKey === k
              ? "bg-primary/10 border-primary text-foreground shadow-[0_0_10px_rgba(99,102,241,0.1)] scale-105"
              : "bg-card border-border text-muted-foreground"
          }`}
        >
          {k}
        </div>
      ))}
    </div>
  );
};

export function Features() {
  return (
    <section id="features" className="py-24 px-6 border-t border-border relative z-10 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-xl mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Build system</h2>
          <p className="text-3xl font-bold tracking-tight text-foreground mb-3">Modular. Lightweight. Accessible.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every detail is engineered with best practices in React engineering and modern frontend systems.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          variants={bentoContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Box 1: Performance (col-span-2) */}
          <motion.div 
            variants={bentoItemVariants}
            whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
            className="md:col-span-2 rounded-2xl border border-border bg-card/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
          >
            <div>
              <span className="p-2 rounded-lg bg-primary/10 text-primary inline-block mb-4"><Cpu size={18} /></span>
              <h3 className="text-lg font-bold text-foreground mb-2">Lightning Fast Render Engines</h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Zero runtime stylesheet compilation overhead. Fully optimized trees that hook directly into React 19 fiber trees.
              </p>
            </div>
            <PerformanceGraph />
          </motion.div>

          {/* Box 2: Tailwind v4 (col-span-1) */}
          <motion.div 
            variants={bentoItemVariants}
            whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
            className="rounded-2xl border border-border bg-card/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
          >
            <div>
              <span className="p-2 rounded-lg bg-primary/10 text-primary inline-block mb-4"><Sparkles size={18} /></span>
              <h3 className="text-lg font-bold text-foreground mb-2">Tailwind CSS v4 Native</h3>
              <p className="text-xs text-muted-foreground">
                Built natively on top of Tailwind CSS v4 variables and modern utility structure.
              </p>
            </div>
            <div className="w-full h-36 bg-card/40 rounded-lg border border-border relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-radial from-primary/10 to-transparent blur-md pointer-events-none" />
              <span className="text-xs font-mono font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg bg-primary/5 shadow-[0_0_15px_rgba(99,102,241,0.05)] animate-pulse">
                @import "tailwindcss";
              </span>
            </div>
          </motion.div>

          {/* Box 3: TypeScript (col-span-1) */}
          <motion.div 
            variants={bentoItemVariants}
            whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
            className="rounded-2xl border border-border bg-card/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
          >
            <div>
              <span className="p-2 rounded-lg bg-primary/10 text-primary inline-block mb-4"><Shield size={18} /></span>
              <h3 className="text-lg font-bold text-foreground mb-2">100% Strict TypeScript</h3>
              <p className="text-xs text-muted-foreground">
                Fully typed components. No generic `any` casting. Type definition imports included out-of-the-box.
              </p>
            </div>
            <div className="w-full h-36 bg-card/40 rounded-lg border border-border relative p-3 font-mono text-[9px] text-muted-foreground overflow-y-auto">
              <div><span className="text-primary">export interface</span> ComponentProps {"{"}</div>
              <div className="pl-4">ref?: React.Ref&lt;HTMLButtonElement&gt;;</div>
              <div className="pl-4">variant: <span className="text-cyan-400">"glow" | "outline" | "solid"</span>;</div>
              <div>{"}"}</div>
            </div>
          </motion.div>

          {/* Box 4: Framer Motion Springs (col-span-2) */}
          <motion.div 
            variants={bentoItemVariants}
            whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
            className="md:col-span-2 rounded-2xl border border-border bg-card/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
          >
            <div>
              <span className="p-2 rounded-lg bg-primary/10 text-primary inline-block mb-4"><Zap size={18} /></span>
              <h3 className="text-lg font-bold text-foreground mb-2">Physics-based Animation Engine</h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Inertial physical properties like stiffness, damping and mass configured under-the-hood for realistic layouts.
              </p>
            </div>
            <SpringSandbox />
          </motion.div>

          {/* Box 5: Accessibility (col-span-1) */}
          <motion.div 
            variants={bentoItemVariants}
            whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
            className="rounded-2xl border border-border bg-card/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
          >
            <div>
              <span className="p-2 rounded-lg bg-primary/10 text-primary inline-block mb-4"><Globe size={18} /></span>
              <h3 className="text-lg font-bold text-foreground mb-2">Accessibility Focus</h3>
              <p className="text-xs text-muted-foreground">
                Fully compliant with WAI-ARIA and screen reader devices. Proper keyboard navigations.
              </p>
            </div>
            <AccessibleKeys />
          </motion.div>

          {/* Box 6: AI-Assistant Sandbox (col-span-2) */}
          <motion.div 
            variants={bentoItemVariants}
            whileHover={{ y: -4, borderColor: "var(--color-primary)" }}
            className="md:col-span-2 rounded-2xl border border-border bg-card/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
          >
            <div>
              <span className="p-2 rounded-lg bg-primary/10 text-primary inline-block mb-4"><Terminal size={18} /></span>
              <h3 className="text-lg font-bold text-foreground mb-2">Built-in AI Documentation Assistant</h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Modify the source code dynamically using natural language. Watch the Babel standalone transpile it in real-time.
              </p>
            </div>
            <div className="w-full h-36 bg-card/40 rounded-lg border border-border relative p-4 font-mono text-[10px] text-emerald-400 overflow-hidden flex flex-col gap-2">
              <div className="text-muted-foreground flex justify-between border-b border-border pb-1">
                <span>AI terminal autocomplete</span>
                <span>CONNECTED</span>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-1">
                <div>&gt; AI: Applying glow variants style to Button...</div>
                <div className="text-primary">&gt; Success: ComponentCompiled successfully [0.12ms]</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
