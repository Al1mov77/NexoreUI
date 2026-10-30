"use client";

import React, { useState, useMemo, memo, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TEMPLATES, TemplateItem, getTemplatePreviewImage } from "../../../data/templates";

const FLAGSHIP_SLUGS = [
  "pull-noodle",
  "flip-skate",
  "panda-bakery",
  "capy-spa",
  "bear-lift",
  "burlit-coffee",
  "ironpaw-tools",
  "stayline",
  "ai-chat-interface",
  "nexstore-ecommerce-pro",
  "aura-sound-pro",
  "chrono-x-titanium",
  "zenith-botanical-elixir",
  "monolith-obsidian-cacao",
  "aerovoid-obsidian-parka",
  "velvet-cryo-gelato",
] as const;

const ShowcaseCard = memo(function ShowcaseCard({
  template,
  priority = false,
}: {
  template: TemplateItem;
  priority?: boolean;
}) {
  const imageSrc = template.previewImage || getTemplatePreviewImage(template.slug);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="group relative flex-shrink-0 w-[340px] sm:w-[540px] lg:w-[680px] h-[220px] sm:h-[350px] lg:h-[440px] rounded-2xl sm:rounded-3xl border border-border/80 dark:border-white/10 bg-card dark:bg-zinc-950 overflow-hidden shadow-md dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out hover:scale-[1.015] hover:border-foreground/30 dark:hover:border-white/30 cursor-pointer snap-center"
      style={{
        willChange: "transform",
        containIntrinsicSize: "680px 440px",
      }}
    >
      <div className="relative w-full h-full overflow-hidden bg-muted/40 dark:bg-zinc-900">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/60 to-muted/30 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 animate-pulse pointer-events-none" />
        )}
        <Image
          src={imageSrc}
          alt={template.title}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 640px) 340px, (max-width: 1024px) 540px, 680px"
          onLoad={() => setIsLoaded(true)}
          className={`object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.03] ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
            {template.title}
          </span>
          <span className="text-[11px] font-mono text-white/80 flex items-center gap-1.5">
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
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
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showcaseTemplates = useMemo(() => {
    const map = new Map(TEMPLATES.map((t) => [t.slug, t]));
    const picked: TemplateItem[] = [];
    for (const slug of FLAGSHIP_SLUGS) {
      const item = map.get(slug);
      if (item) picked.push(item);
    }
    if (picked.length < 16) {
      for (const t of TEMPLATES) {
        if (!picked.some((p) => p.slug === t.slug)) {
          picked.push(t);
          if (picked.length >= 16) break;
        }
      }
    }
    return picked;
  }, []);

  const doubled = useMemo(() => [...showcaseTemplates, ...showcaseTemplates], [showcaseTemplates]);

  return (
    <section
      ref={sectionRef}
      className="py-24 relative z-10 overflow-hidden"
      id="templates"
    >
      <style jsx global>{`
        @keyframes showcase-float {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-showcase-float {
          animation: showcase-float 110s linear infinite;
        }
      `}</style>

      <div className="w-full max-w-5xl mx-auto h-px bg-gradient-to-r from-transparent via-border to-transparent mb-20 px-4" />

      <div className="max-w-6xl mx-auto mb-12 px-4 sm:px-6">
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

      <div
        className="relative py-4"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="relative overflow-hidden group/marquee">
          <div
            className={`flex gap-5 sm:gap-6 w-max ${
              prefersReducedMotion
                ? "overflow-x-auto snap-x snap-mandatory px-6 py-2"
                : "animate-showcase-float group-hover/marquee:[animation-play-state:paused]"
            }`}
            style={
              prefersReducedMotion
                ? undefined
                : {
                    animationPlayState: isInView ? "running" : "paused",
                    willChange: "transform",
                  }
            }
          >
            {doubled.map((tmpl, idx) => (
              <ShowcaseCard
                key={`${tmpl.id}-${idx}`}
                template={tmpl}
                priority={idx < 4}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
