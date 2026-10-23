"use client";

import React, { useState, useMemo, memo, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TEMPLATES, TemplateItem, getTemplatePreviewImage } from "../../../data/templates";

const ShowcaseCard = memo(function ShowcaseCard({ template }: { template: TemplateItem }) {
  const imageSrc = template.previewImage || getTemplatePreviewImage(template.slug);

  return (
    <div
      className="group relative flex-shrink-0 w-[320px] sm:w-[350px] h-[235px] rounded-2xl border border-border/80 dark:border-white/10 bg-card dark:bg-zinc-950 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:z-30 hover:border-foreground/40 dark:hover:border-white/30 cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_10px_28px_-6px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_20px_48px_-8px_rgba(0,0,0,0.6)] flex flex-col justify-between"
      style={{
        willChange: "transform",
        contentVisibility: "auto",
        containIntrinsicSize: "350px 235px",
      }}
    >
      <div className="relative flex-1 w-full overflow-hidden bg-zinc-900">
        <Image
          src={imageSrc}
          alt={template.title}
          width={480}
          height={300}
          sizes="(max-width: 640px) 320px, 350px"
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-20" />
      </div>

      <div className="h-[58px] px-3.5 bg-card/95 dark:bg-zinc-950/95 border-t border-border/60 dark:border-white/8 flex items-center justify-between z-10 shrink-0">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="text-xs font-bold text-foreground tracking-tight truncate leading-tight group-hover:text-primary transition-colors">
              {template.title}
            </h4>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold uppercase tracking-wider bg-muted text-muted-foreground border border-border/50 shrink-0">
              {template.category}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono truncate">
            {template.subtitle || template.description}
          </p>
        </div>

        <div className="w-6 h-6 rounded-full bg-secondary/80 group-hover:bg-primary group-hover:text-primary-foreground border border-border/80 flex items-center justify-center transition-all duration-200 shrink-0">
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      <Link
        href={`/templates?preview=${template.slug}`}
        className="absolute inset-0 z-30"
        aria-label={`Explore ${template.title}`}
      />
    </div>
  );
});

function MarqueeRow({
  templates,
  direction = "left",
  speed = 65,
  reducedMotion = false,
}: {
  templates: TemplateItem[];
  direction?: "left" | "right";
  speed?: number;
  reducedMotion?: boolean;
}) {
  const doubled = useMemo(() => [...templates, ...templates], [templates]);

  return (
    <div className="relative overflow-hidden py-1 group/row">
      <div
        className={`flex gap-4 sm:gap-5 w-max ${
          reducedMotion
            ? ""
            : direction === "left"
              ? "animate-showcase-left group-hover/row:[animation-play-state:paused]"
              : "animate-showcase-right group-hover/row:[animation-play-state:paused]"
        }`}
        style={
          reducedMotion
            ? undefined
            : {
                animationDuration: `${speed}s`,
                willChange: "transform",
              }
        }
      >
        {doubled.map((tmpl, idx) => (
          <ShowcaseCard key={`${tmpl.id}-${direction}-${idx}`} template={tmpl} />
        ))}
      </div>
    </div>
  );
}

export function TemplatesShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { row1, row2 } = useMemo(() => {
    const reversed = TEMPLATES.slice().reverse();
    const shifted = [...reversed.slice(8), ...reversed.slice(0, 8)];
    const r1 = shifted.filter((_, i) => i % 2 === 0);
    const r2 = shifted.filter((_, i) => i % 2 === 1);
    return { row1: r1, row2: r2 };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 relative z-10 overflow-hidden"
      id="templates"
    >
      <style jsx global>{`
        @keyframes showcase-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes showcase-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-showcase-left {
          animation: showcase-left linear infinite;
        }
        .animate-showcase-right {
          animation: showcase-right linear infinite;
        }
      `}</style>

      {/* Thin gradient separator between sections */}
      <div className="w-full max-w-5xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-20" />

      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground block mb-2">
              Cinematic Templates
            </span>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.04em] text-foreground mb-2 leading-tight"
            >
              Ship in hours, not weeks.
            </motion.h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
              Production-grade applications with 3D physics, bespoke audio engines, and responsive layout architecture.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/80 bg-card/60 hover:bg-card text-foreground font-semibold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-foreground/30 transition-all group cursor-pointer"
            >
              <span>Explore All Templates</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 2-Row Marquee Catalog with 8-10% edge masks */}
      <div
        className="relative min-h-[500px]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        {isInView ? (
          <div className="space-y-4">
            {/* Row 1 → Left */}
            <MarqueeRow templates={row1} direction="left" speed={65} reducedMotion={prefersReducedMotion} />

            {/* Row 2 → Right */}
            <MarqueeRow templates={row2} direction="right" speed={75} reducedMotion={prefersReducedMotion} />
          </div>
        ) : (
          <div className="h-[500px] flex items-center justify-center text-xs font-mono text-muted-foreground/40">
            Scroll to activate showcase
          </div>
        )}
      </div>
    </section>
  );
}
