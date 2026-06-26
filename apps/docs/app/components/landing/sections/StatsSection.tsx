"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Download, Code2 } from "lucide-react";

// Animated number that counts up when entering viewport
function NumberTicker({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setHasTriggered(true); },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
  }, []);

  useEffect(() => {
    if (!hasTriggered) return;
    const frameRate = 60;
    const totalFrames = 2 * frameRate; // 2 seconds
    let currentFrame = 0;
    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      // Ease-out quadratic
      setCount(Math.round(value * (1 - (1 - progress) * (1 - progress))));
      if (currentFrame >= totalFrames) { setCount(value); clearInterval(counter); }
    }, 1000 / frameRate);
    return () => clearInterval(counter);
  }, [value, hasTriggered]);

  return <span ref={containerRef}>{count.toLocaleString()}{suffix}</span>;
}

// Tech stack marquee — CSS-only animation via globals.css class
function TechMarquee() {
  const techs = [
    "React 19", "Next.js 15", "TypeScript", "Tailwind CSS v4",
    "Radix UI", "Framer Motion", "Vite", "PostCSS", "ESLint", "Zod",
  ];
  // Duplicate array so the seamless loop works
  const all = [...techs, ...techs];

  return (
    <div className="w-full overflow-hidden relative py-5 border-y border-border/50 select-none">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      {/* animate-marquee-hero defined in globals.css — NOT style jsx */}
      <div className="flex gap-16 animate-marquee-hero whitespace-nowrap">
        {all.map((t, idx) => (
          <span key={idx} className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors shrink-0">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StatsSection() {
  const [githubStars, setGithubStars] = useState<number>(0);
  const [npmDownloads, setNpmDownloads] = useState<number>(0);

  useEffect(() => {
    // Real GitHub stars
    fetch("https://api.github.com/repos/Al1mov77/NexoreUI")
      .then((r) => r.json())
      .then((d) => { if (d.stargazers_count) setGithubStars(d.stargazers_count); })
      .catch(() => setGithubStars(0));

    // Real npm weekly downloads
    fetch("https://api.npmjs.org/downloads/point/last-week/nexoreui")
      .then((r) => r.json())
      .then((d) => { if (d.downloads) setNpmDownloads(d.downloads); })
      .catch(() => setNpmDownloads(0));
  }, []);

  const stats = [
    {
      value: githubStars,
      suffix: "",
      label: "GitHub Stars",
      icon: <Star size={11} className="text-amber-400 fill-amber-400/50" />,
    },
    {
      value: npmDownloads,
      suffix: "+",
      label: "Weekly Downloads",
      icon: <Download size={11} className="text-primary" />,
    },
    {
      // Real component count — 53 files in /components
      value: 53,
      suffix: "",
      label: "Components",
      icon: <Code2 size={11} className="text-primary" />,
    },
    {
      value: 100,
      suffix: "%",
      label: "TypeScript",
      icon: <span className="text-[10px] font-bold text-blue-400">TS</span>,
    },
  ];

  return (
    <section id="showcase" className="py-20 px-6 border-t border-border/50 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-2">
            Open source, growing fast
          </h2>
          <p className="text-2xl md:text-3xl font-bold tracking-tight">
            Trusted by developers who{" "}
            <span className="text-primary">ship</span>
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono">
                <NumberTicker value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                {stat.icon}
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <TechMarquee />
      </div>
    </section>
  );
}
