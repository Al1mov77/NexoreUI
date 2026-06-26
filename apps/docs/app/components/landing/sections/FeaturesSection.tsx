"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cpu, Sparkles, Shield, Zap, Globe, Terminal, Activity,
} from "lucide-react";

const bentoContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const bentoItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// Animated performance graph — CSS colors only, no hardcoded hex
function PerformanceGraph() {
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
    <div className="w-full h-36 bg-muted/30 rounded-lg relative p-4 flex flex-col justify-end border border-border/50 overflow-hidden">
      <span className="absolute top-2 left-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
        <Activity size={10} className="animate-pulse" />
        RENDER: 0.1ms
      </span>
      <svg className="w-full h-24 overflow-visible">
        <path
          d={`M 0,${100 - points[0]} L ${pathData}`}
          fill="none"
          stroke="hsl(160 60% 45%)"
          strokeWidth="2.5"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
    </div>
  );
}

// Spring physics sandbox
function SpringSandbox() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <div
      className="w-full h-36 bg-muted/30 rounded-lg relative overflow-hidden flex items-center justify-center cursor-pointer border border-border/50"
      onClick={() => setPosition({ x: Math.random() * 80 - 40, y: Math.random() * 40 - 20 })}
    >
      <span className="absolute top-2 left-3 text-[10px] font-mono text-muted-foreground">
        Click to trigger spring physics
      </span>
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 260, damping: 15 }}
        className="w-8 h-8 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center"
      >
        <Zap size={14} className="text-primary-foreground" />
      </motion.div>
    </div>
  );
}

// Keyboard accessibility showcase
function AccessibleKeys() {
  const keys = ["Tab", "Space", "Enter", "Esc"] as const;
  const [activeKey, setActiveKey] = useState<string>("Tab");
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % keys.length;
      setActiveKey(keys[idx]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-36 bg-muted/30 rounded-lg relative flex items-center justify-center gap-3 border border-border/50">
      {keys.map((k) => (
        <div
          key={k}
          className={`px-3 py-2 rounded-lg border font-mono text-xs transition-all duration-300 ${
            activeKey === k
              ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)] scale-105"
              : "bg-card border-border/50 text-muted-foreground"
          }`}
        >
          {k}
        </div>
      ))}
    </div>
  );
}

const features = [
  {
    colSpan: "md:col-span-2",
    icon: <Cpu size={18} />,
    title: "Copy-Paste Ready",
    desc: "No install ceremony. Copy the source directly into your project. You own the code — customize it without fighting abstractions.",
    demo: <PerformanceGraph />,
  },
  {
    colSpan: "",
    icon: <Sparkles size={18} />,
    title: "Tailwind CSS v4 Native",
    desc: "Built natively on Tailwind v4 CSS variables. Zero runtime stylesheet compilation.",
    demo: (
      <div className="w-full h-36 bg-muted/30 rounded-lg border border-border/50 relative flex items-center justify-center overflow-hidden">
        <span className="text-xs font-mono font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg bg-primary/5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
          @import &quot;tailwindcss&quot;;
        </span>
      </div>
    ),
  },
  {
    colSpan: "",
    icon: <Shield size={18} />,
    title: "100% TypeScript",
    desc: "Fully typed components. No generic `any` casting. Type imports included.",
    demo: (
      <div className="w-full h-36 bg-muted/30 rounded-lg border border-border/50 relative p-3 font-mono text-[9px] text-muted-foreground overflow-y-auto">
        <div><span className="text-primary">export interface</span> ButtonProps {"{"}</div>
        <div className="pl-4">variant: <span className="text-cyan-400">&quot;default&quot; | &quot;outline&quot; | &quot;glow&quot;</span>;</div>
        <div className="pl-4">size: <span className="text-cyan-400">&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</span>;</div>
        <div className="pl-4">isLoading: <span className="text-orange-400">boolean</span>;</div>
        <div>{"}"}</div>
      </div>
    ),
  },
  {
    colSpan: "md:col-span-2",
    icon: <Zap size={18} />,
    title: "Physics-Based Animations",
    desc: "Inertial spring physics with configurable stiffness, damping, and mass for natural feel.",
    demo: <SpringSandbox />,
  },
  {
    colSpan: "",
    icon: <Globe size={18} />,
    title: "Accessibility First",
    desc: "Radix UI primitives ensure WAI-ARIA compliance, keyboard navigation, and screen reader support.",
    demo: <AccessibleKeys />,
  },
  {
    colSpan: "md:col-span-2",
    icon: <Terminal size={18} />,
    title: "Dark Mode Ready",
    desc: "CSS variable-based theming. Dark mode works automatically via next-themes without configuration.",
    demo: (
      <div className="w-full h-36 bg-muted/30 rounded-lg border border-border/50 p-4 font-mono text-[10px] text-emerald-400 overflow-hidden flex flex-col gap-2">
        <div className="text-muted-foreground flex justify-between border-b border-border pb-1">
          <span>theme toggle</span>
          <span>CONNECTED</span>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-1">
          <div>&gt; dark mode: <span className="text-primary">enabled</span></div>
          <div>&gt; --primary: <span className="text-violet-400">hsl(250 85% 65%)</span></div>
          <div className="text-emerald-400">&gt; All 53 components updated automatically</div>
        </div>
      </div>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 border-t border-border/50 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-2">
            Build system
          </h2>
          <p className="text-3xl font-bold tracking-tight mb-3">
            Modular. Accessible. Yours.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every component is engineered with real-world usage in mind, not just demos.
          </p>
        </div>

        <motion.div
          variants={bentoContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feat, i) => (
            <motion.div
              key={i}
              variants={bentoItemVariants}
              whileHover={{ y: -4, borderColor: "rgba(var(--primary-rgb), 0.25)" }}
              className={`${feat.colSpan} rounded-2xl border border-border/60 bg-card/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300`}
            >
              <div>
                <span className="p-2 rounded-lg bg-primary/10 text-primary inline-block mb-4">
                  {feat.icon}
                </span>
                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-xs text-muted-foreground max-w-md">{feat.desc}</p>
              </div>
              {feat.demo}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
