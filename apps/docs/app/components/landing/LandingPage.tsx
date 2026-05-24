"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, 
  Copy, 
  Check, 
  ChevronRight,
  Star, 
  Download, 
  Cpu, 
  Sparkles, 
  Layers,
  Settings,
  Shield,
  Play,
  Terminal,
  Activity,
  Zap,
  Globe
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";
import { ComponentSource } from "../ComponentSource";

// Typing title animation component
const TypingTitle = () => {
  const text = "Build beautiful user interfaces faster.";
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 min-h-[9rem] md:min-h-[12rem] flex flex-wrap justify-center">
      <span>{displayedText}</span>
      <span className="inline-block w-1 h-10 md:h-16 bg-[#6366f1] ml-1.5 animate-pulse" />
    </h1>
  );
};

// Animated statistic ticker component
const NumberTicker = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasTriggered(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hasTriggered) return;
    let start = 0;
    const duration = 2000; 
    const end = value;
    if (start === end) return;
    
    const totalMilisecondsSeconds = 2;
    const frameRate = 60;
    const totalFrames = totalMilisecondsSeconds * frameRate;
    let currentFrame = 0;
    
    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      // Ease out quadratic
      const currentCount = Math.round(end * (1 - (1 - progress) * (1 - progress)));
      setCount(currentCount);
      
      if (currentFrame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      }
    }, 1000 / frameRate);
    
    return () => clearInterval(counter);
  }, [value, hasTriggered]);
  
  return <span ref={containerRef}>{count.toLocaleString()}{suffix}</span>;
};

// Floating particles component
const ParticleBackground = () => {
  const particles = Array.from({ length: 25 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size = Math.random() * 5 + 2;
        const delay = Math.random() * 10;
        const duration = Math.random() * 12 + 10;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-[#6366f1]/15 blur-[1px] animate-float"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.7; }
          100% { transform: translateY(-100px) translateX(25px); opacity: 0; }
        }
        .animate-float {
          animation: float infinite linear;
        }
      `}</style>
    </div>
  );
};

// Technology sliding marquee
const TechMarquee = () => {
  const techs = ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS v4", "Vite", "Framer Motion", "Radix UI", "PostCSS", "Babel", "ESLint"];
  return (
    <div className="w-full overflow-hidden relative py-5 border-y border-white/5 bg-zinc-950/20 select-none">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />
      
      <div className="flex gap-16 animate-marquee whitespace-nowrap min-w-full">
        <div className="flex gap-16 justify-around shrink-0 min-w-full">
          {techs.map((t, idx) => (
            <span key={idx} className="text-xs font-mono text-zinc-500 hover:text-white transition-colors">{t}</span>
          ))}
        </div>
        <div className="flex gap-16 justify-around shrink-0 min-w-full">
          {techs.map((t, idx) => (
            <span key={idx} className="text-xs font-mono text-zinc-500 hover:text-white transition-colors">{t}</span>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

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

const showcaseContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const showcaseItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function LandingPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [githubStars, setGithubStars] = useState<number>(1420); // Fallback star count

  useEffect(() => {
    fetch("https://api.github.com/repos/Al1mov77/NexoreUI")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count) {
          setGithubStars(data.stargazers_count);
        }
      })
      .catch((err) => console.error("Error fetching github stars:", err));
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // 6 Live Showcase Components directly on the Hero
  const componentShowcases = [
    {
      id: "button",
      name: "Animated Button",
      desc: "Micro-interactions and state-aware ripple.",
      render: () => {
        const [clicks, setClicks] = useState(0);
        return (
          <button 
            onClick={(e) => { e.preventDefault(); setClicks(c => c + 1); }}
            className="px-4 py-2 rounded-lg bg-[#6366f1] text-white text-xs font-semibold hover:bg-[#5558e6] active:scale-95 transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)] cursor-pointer"
          >
            Clicked {clicks} times
          </button>
        );
      }
    },
    {
      id: "badge",
      name: "Pulse Badge",
      desc: "Beautiful glowing indicators for notifications.",
      render: () => (
        <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Status
        </span>
      )
    },
    {
      id: "switch",
      name: "Toggle Switch",
      desc: "Smooth sliding toggle with status update.",
      render: () => {
        const [enabled, setEnabled] = useState(true);
        return (
          <button 
            onClick={(e) => { e.preventDefault(); setEnabled(v => !v); }}
            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer ${enabled ? "bg-[#6366f1]" : "bg-zinc-800"}`}
          >
            <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${enabled ? "translate-x-4.5" : "translate-x-0"}`} />
          </button>
        );
      }
    },
    {
      id: "progress",
      name: "Circular Progress",
      desc: "Circular indicators with custom values.",
      render: () => {
        const [val, setVal] = useState(65);
        useEffect(() => {
          const interval = setInterval(() => {
            setVal((v) => (v >= 100 ? 0 : v + 5));
          }, 800);
          return () => clearInterval(interval);
        }, []);
        return (
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" fill="transparent" />
              <circle cx="24" cy="24" r="20" stroke="#6366f1" strokeWidth="3.5" fill="transparent"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * val) / 100}
                className="transition-all duration-300"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-semibold">{val}%</span>
          </div>
        );
      }
    },
    {
      id: "tooltip",
      name: "Micro Tooltip",
      desc: "Interactive overlays with instant positioning.",
      render: () => (
        <div className="relative group">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded bg-zinc-950 border border-white/8 text-[9px] font-mono text-zinc-300 whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
            Hover success!
          </div>
          <button className="px-3.5 py-1.5 rounded-lg border border-white/10 bg-zinc-900/50 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors cursor-pointer">
            Hover Me
          </button>
        </div>
      )
    },
    {
      id: "slider",
      name: "Interactive Slider",
      desc: "Fluid volume slider controller UI.",
      render: () => {
        const [value, setValue] = useState(70);
        return (
          <div className="w-28 space-y-1.5">
            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>Volume</span>
              <span>{value}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={value} 
              onChange={(e) => { e.stopPropagation(); setValue(Number(e.target.value)); }}
              onClick={(e) => e.preventDefault()}
              className="w-full accent-[#6366f1] bg-white/5 h-1 rounded cursor-pointer"
            />
          </div>
        );
      }
    }
  ];

  // Bento Animations Helpers
  const SpringSandbox = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    return (
      <div 
        className="w-full h-36 bg-zinc-950/40 rounded-lg relative overflow-hidden flex items-center justify-center cursor-pointer border border-white/5"
        onClick={() => {
          setPosition({ 
            x: Math.random() * 80 - 40, 
            y: Math.random() * 40 - 20 
          });
        }}
      >
        <span className="absolute top-2 left-3 text-[10px] font-mono text-zinc-600">Click sandbox to trigger physics</span>
        <motion.div
          animate={{ x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 260, damping: 15 }}
          className="w-8 h-8 rounded-full bg-[#6366f1] shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center justify-center"
        >
          <Zap size={14} className="text-white" />
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
      <div className="w-full h-36 bg-zinc-950/40 rounded-lg relative p-4 flex flex-col justify-end border border-white/5 overflow-hidden">
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
      <div className="w-full h-36 bg-zinc-950/40 rounded-lg relative flex items-center justify-center gap-3 border border-white/5">
        {["tab", "space", "enter", "esc"].map((k) => (
          <div
            key={k}
            className={`px-3 py-2 rounded-lg border font-mono text-xs uppercase transition-all duration-300 ${
              activeKey === k
                ? "bg-[#6366f1]/20 border-[#6366f1] text-white shadow-[0_0_10px_rgba(99,102,241,0.2)] scale-105"
                : "bg-zinc-900 border-white/5 text-zinc-500"
            }`}
          >
            {k}
          </div>
        ))}
      </div>
    );
  };

  const codeSnippets = [
    `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {`,
    `  variant?: 'primary' | 'outline' | 'glow';`,
    `  size?: 'sm' | 'md' | 'lg';`,
    `}`,
    `export const Button = React.forwardRef<`,
    `  HTMLButtonElement,`,
    `  ButtonProps`,
    `>(({ variant = 'primary', className, ...props }, ref) => {`
  ];

  const typeSnippet = `type Component<T> = React.FC<T & Props>;`;

  return (
    <main className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans antialiased selection:bg-[#6366f1]/30 selection:text-white relative overflow-hidden">
      
      {/* Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20 bg-[#09090b]">
        <div className="absolute top-[-10%] left-[-15%] w-[65%] h-[60%] rounded-full bg-indigo-500/10 blur-[130px] animate-mesh-1" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-violet-600/10 blur-[140px] animate-mesh-2" />
        <div className="absolute top-[35%] right-[15%] w-[45%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] animate-mesh-3" />
      </div>
      <style jsx global>{`
        @keyframes mesh1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes mesh2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 50px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes mesh3 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-30px, -40px) scale(0.9); }
          66% { transform: translate(50px, 30px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-mesh-1 { animation: mesh1 22s infinite ease-in-out; }
        .animate-mesh-2 { animation: mesh2 28s infinite ease-in-out; }
        .animate-mesh-3 { animation: mesh3 24s infinite ease-in-out; }
      `}</style>

      {/* Grid mask fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/40 to-[#09090b] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 overflow-hidden select-none demo-grid-pattern">
        
        <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/8 bg-zinc-900/60 backdrop-blur-md text-xs text-zinc-400 hover:text-white transition-all hover:scale-102 cursor-pointer mb-8 shadow-sm">
              <span>Introducing NexoreUI v1.0.0</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6366f1]" />
            </div>
          </motion.div>

          {/* Title with typing animation */}
          <TypingTitle />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-base md:text-lg text-zinc-400 max-w-xl mb-10 leading-relaxed font-normal"
          >
            300+ modern, animated, and production-ready primitives built with React, Radix UI and Tailwind CSS. Copy, paste, customize, and ship.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <Link
              href="/docs/installation"
              className="relative group w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-xl bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#5558e6] active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(99,102,241,0.3)] hover:scale-102 cursor-pointer overflow-visible"
            >
              {/* Pulse Glow Effect */}
              <span className="absolute inset-0 bg-[#6366f1]/40 rounded-xl blur-lg group-hover:scale-110 transition-transform -z-10 animate-pulse duration-1000" />
              Get Started
            </Link>
            <a
              href="#showcase"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-xl border border-white/8 bg-zinc-900/50 backdrop-blur-md text-zinc-200 text-sm font-semibold hover:bg-zinc-800 hover:text-white hover:scale-102 active:scale-[0.98] transition-all cursor-pointer"
            >
              Browse Components
            </a>
          </motion.div>
        </div>

        {/* 6 Component Hero Showcase Grid */}
        <motion.div 
          variants={showcaseContainerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 z-10"
        >
          {componentShowcases.map((comp) => {
            const CompRender = comp.render;
            return (
              <motion.div key={comp.id} variants={showcaseItemVariants} className="h-full">
                <Link 
                  href={`/docs/components/${comp.id}`}
                  className="group relative rounded-xl border border-white/8 bg-zinc-900/40 p-5 flex flex-col justify-between items-center text-center gap-4 hover:border-[#6366f1]/40 hover:bg-zinc-900/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:-translate-y-1.5 h-full"
                >
                  {/* Micro backlight glow */}
                  <div className="absolute inset-0 rounded-xl bg-[#6366f1]/0 group-hover:bg-[#6366f1]/2 blur-xl transition-all duration-300 -z-10" />
                  
                  <div className="w-full flex flex-col items-center">
                    <span className="text-sm font-semibold text-white group-hover:text-[#6366f1] transition-colors">{comp.name}</span>
                    <span className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">{comp.desc}</span>
                  </div>
                  
                  <div className="h-16 flex items-center justify-center w-full">
                    <CompRender />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Browse 300+ button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.7 }}
          className="mt-12 z-10"
        >
          <Link
            href="/docs/components/button"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <span>Browse 300+ Components</span>
            <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer z-10" 
          onClick={() => {
            const nextSec = document.getElementById("showcase");
            if (nextSec) nextSec.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-[9px] uppercase tracking-widest font-mono">Scroll Down</span>
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowRight className="rotate-90 w-3.5 h-3.5 text-[#6366f1]" />
          </motion.div>
        </div>
      </section>

      {/* 2. STATS & SOCIAL PROOF SECTION */}
      <section id="showcase" className="py-20 px-6 border-t border-white/5 bg-[#0a0a0c]/60 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#6366f1] mb-2">Used by developers worldwide</h2>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-white">Engineered for Performance and Visual Excellence</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center">
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-mono">
                <NumberTicker value={githubStars} />
              </h3>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <Star size={11} className="text-amber-400 fill-amber-400/50" /> GitHub Stars
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-mono">
                <NumberTicker value={12850} suffix="+" />
              </h3>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                <Download size={11} className="text-[#6366f1]" /> Weekly Downloads
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-mono">
                <NumberTicker value={300} suffix="+" />
              </h3>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Active Primitives</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-mono">
                <NumberTicker value={120} suffix="FPS" />
              </h3>
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Fluid Animations</p>
            </div>
          </div>

          {/* Tech Marquee */}
          <TechMarquee />
        </div>
      </section>

      {/* 3. BENTO GRID FEATURES SECTION */}
      <section className="py-24 px-6 border-t border-white/5 relative z-10 bg-transparent">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="max-w-xl mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#6366f1] mb-2">Build system</h2>
            <p className="text-3xl font-bold tracking-tight text-white mb-3">Modular. Lightweight. Accessible.</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
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
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.25)" }}
              className="md:col-span-2 rounded-2xl border border-white/8 bg-zinc-900/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
            >
              <div>
                <span className="p-2 rounded-lg bg-[#6366f1]/10 text-[#6366f1] inline-block mb-4"><Cpu size={18} /></span>
                <h3 className="text-lg font-bold text-white mb-2">Lightning Fast Render Engines</h3>
                <p className="text-xs text-zinc-500 max-w-md">
                  Zero runtime stylesheet compilation overhead. Fully optimized trees that hook directly into React 19 fiber trees.
                </p>
              </div>
              <PerformanceGraph />
            </motion.div>

            {/* Box 2: Tailwind v4 (col-span-1) */}
            <motion.div 
              variants={bentoItemVariants}
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.25)" }}
              className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
            >
              <div>
                <span className="p-2 rounded-lg bg-[#6366f1]/10 text-[#6366f1] inline-block mb-4"><Sparkles size={18} /></span>
                <h3 className="text-lg font-bold text-white mb-2">Tailwind CSS v4 Native</h3>
                <p className="text-xs text-zinc-500">
                  Built natively on top of Tailwind CSS v4 variables and modern utility structure.
                </p>
              </div>
              <div className="w-full h-36 bg-zinc-950/40 rounded-lg border border-white/5 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-radial from-[#6366f1]/10 to-transparent blur-md pointer-events-none" />
                <span className="text-xs font-mono font-bold text-[#6366f1] border border-[#6366f1]/30 px-3 py-1.5 rounded-lg bg-[#6366f1]/5 shadow-[0_0_15px_rgba(99,102,241,0.15)] animate-pulse">
                  @import "tailwindcss";
                </span>
              </div>
            </motion.div>

            {/* Box 3: TypeScript (col-span-1) */}
            <motion.div 
              variants={bentoItemVariants}
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.25)" }}
              className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
            >
              <div>
                <span className="p-2 rounded-lg bg-[#6366f1]/10 text-[#6366f1] inline-block mb-4"><Shield size={18} /></span>
                <h3 className="text-lg font-bold text-white mb-2">100% Strict TypeScript</h3>
                <p className="text-xs text-zinc-500">
                  Fully typed components. No generic `any` casting. Type definition imports included out-of-the-box.
                </p>
              </div>
              <div className="w-full h-36 bg-zinc-950/40 rounded-lg border border-white/5 relative p-3 font-mono text-[9px] text-zinc-500 overflow-y-auto">
                <div><span className="text-[#6366f1]">export interface</span> ComponentProps {"{"}</div>
                <div className="pl-4">ref?: React.Ref&lt;HTMLButtonElement&gt;;</div>
                <div className="pl-4">variant: <span className="text-cyan-400">"glow" | "outline" | "solid"</span>;</div>
                <div>{"}"}</div>
              </div>
            </motion.div>

            {/* Box 4: Framer Motion Springs (col-span-2) */}
            <motion.div 
              variants={bentoItemVariants}
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.25)" }}
              className="md:col-span-2 rounded-2xl border border-white/8 bg-zinc-900/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
            >
              <div>
                <span className="p-2 rounded-lg bg-[#6366f1]/10 text-[#6366f1] inline-block mb-4"><Zap size={18} /></span>
                <h3 className="text-lg font-bold text-white mb-2">Physics-based Animation Engine</h3>
                <p className="text-xs text-zinc-500 max-w-md">
                  Inertial physical properties like stiffness, damping and mass configured under-the-hood for realistic layouts.
                </p>
              </div>
              <SpringSandbox />
            </motion.div>

            {/* Box 5: Accessibility (col-span-1) */}
            <motion.div 
              variants={bentoItemVariants}
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.25)" }}
              className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
            >
              <div>
                <span className="p-2 rounded-lg bg-[#6366f1]/10 text-[#6366f1] inline-block mb-4"><Globe size={18} /></span>
                <h3 className="text-lg font-bold text-white mb-2">Accessibility Focus</h3>
                <p className="text-xs text-zinc-500">
                  Fully compliant with WAI-ARIA and screen reader devices. Proper keyboard navigations.
                </p>
              </div>
              <AccessibleKeys />
            </motion.div>

            {/* Box 6: AI-Assistant Sandbox (col-span-2) */}
            <motion.div 
              variants={bentoItemVariants}
              whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.25)" }}
              className="md:col-span-2 rounded-2xl border border-white/8 bg-zinc-900/30 p-6 flex flex-col justify-between gap-6 transition-all duration-300"
            >
              <div>
                <span className="p-2 rounded-lg bg-[#6366f1]/10 text-[#6366f1] inline-block mb-4"><Terminal size={18} /></span>
                <h3 className="text-lg font-bold text-white mb-2">Built-in AI Documentation Assistant</h3>
                <p className="text-xs text-zinc-500 max-w-md">
                  Modify the source code dynamically using natural language. Watch the Babel standalone transpile it in real-time.
                </p>
              </div>
              <div className="w-full h-36 bg-zinc-950/40 rounded-lg border border-white/5 relative p-4 font-mono text-[10px] text-emerald-400 overflow-hidden flex flex-col gap-2">
                <div className="text-zinc-600 flex justify-between border-b border-white/5 pb-1">
                  <span>AI terminal autocomplete</span>
                  <span>CONNECTED</span>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-1">
                  <div>&gt; AI: Applying glow variants style to Button...</div>
                  <div className="text-[#6366f1]">&gt; Success: ComponentCompiled successfully [0.12ms]</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-32 px-6 border-t border-white/5 bg-gradient-to-b from-[#09090b] via-[#0b0c14] to-[#09090b] relative z-10 overflow-hidden flex flex-col items-center justify-center text-center">
        
        {/* Animated Particles */}
        <ParticleBackground />
        
        {/* Glow behind container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#6366f1]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto flex flex-col items-center relative">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Start Building Modern Interfaces
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
            Take your developer experience and design quality to the next level. Install and copy components in seconds.
          </p>

          <Link
            href="/docs/installation"
            className="group relative inline-flex items-center justify-center h-12 px-10 rounded-xl bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#5558e6] active:scale-[0.98] transition-all shadow-[0_5px_30px_rgba(99,102,241,0.4)] hover:scale-102 cursor-pointer"
          >
            Start Building
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#09090b] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span>© 2026 NexoreUI. Open source under the MIT License.</span>
          <div className="flex gap-4">
            <a 
              href="https://github.com/Al1mov77/NexoreUI" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a 
              href="/docs/installation" 
              className="hover:text-white transition-colors"
            >
              Documentation
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
