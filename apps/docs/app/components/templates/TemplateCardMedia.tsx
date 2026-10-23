"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye } from "lucide-react";
import { RenderTemplatePreview } from "./TemplatePreviews";

interface TemplateCardMediaProps {
  title: string;
  imageSrc: string;
  templateId?: string;
  slug?: string;
  videoSrc?: string;
  isHovered?: boolean;
  className?: string;
}

const HOVER_HERO_TEMPLATES = new Set<string>([
  "template-pull-noodle-pro",
  "pull-noodle",
  "template-flip-skate-pro",
  "flip-skate",
  "template-panda-bakery-pro",
  "panda-bakery",
  "template-capy-spa-pro",
  "capy-spa",
  "template-bear-lift-pro",
  "bear-lift",
  "template-burlit-coffee-pro",
  "burlit-coffee",
  "template-ironpaw-tools-pro",
  "ironpaw-tools",
  "template-ferrari-nocturne",
  "ferrari-nocturne",
  "ferrari-nocturne-atelier",
  "template-rose-nocturne",
  "rose-nocturne",
  "rose-nocturne-atelier",
  "template-psyche-obsidian",
  "psyche-obsidian",
  "psyche-obsidian-atelier",
  "template-vortex-apex-pro",
  "vortex-apex-pro",
  "vortex-apex-corse",
  "template-aerovoid-obsidian-pro",
  "aerovoid-obsidian-pro",
  "aerovoid-obsidian-parka",
  "template-amarena-royale-pro",
  "amarena-royale-pro",
  "amarena-royale-patisserie",
  "template-monolith-cacao-pro",
  "monolith-cacao-pro",
  "monolith-obsidian-cacao",
  "template-levitas-cryo-pro",
  "levitas-cryo-pro",
  "levitas-cryo-atelier",
  "template-aura-obsidian-pro",
  "aura-obsidian-pro",
  "aura-obsidian-botanica",
  "template-aura-nocturne-pro",
  "aura-nocturne-pro",
  "aura-nocturne-parfum",
  "template-velvet-gelato-pro",
  "velvet-gelato-pro",
  "velvet-cryo-gelato",
  "template-zenith-elixir-pro",
  "zenith-elixir-pro",
  "zenith-botanical-elixir",
]);

export function TemplateCardMedia({
  title,
  imageSrc,
  templateId,
  slug,
  isHovered: isHoveredProp,
  className = "",
}: TemplateCardMediaProps) {
  const [internalHover, setInternalHover] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(380);
  const containerRef = useRef<HTMLDivElement>(null);

  const resolvedId = templateId || slug || "";
  const canPlayHero = HOVER_HERO_TEMPLATES.has(resolvedId);
  const activeHover = isHoveredProp !== undefined ? (isHoveredProp || internalHover) : internalHover;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      if (el.clientWidth > 0) {
        setContainerWidth(el.clientWidth);
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!activeHover || !canPlayHero) {
      setIsMounted(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 90);

    return () => clearTimeout(timer);
  }, [activeHover, canPlayHero]);

  useEffect(() => {
    if (!isMounted) return;
    const el = containerRef.current;
    if (!el) return;

    const vids = el.querySelectorAll("video");
    vids.forEach((v) => {
      v.muted = true;
      v.playsInline = true;
      v.play().catch(() => {});
    });
  }, [isMounted]);

  const scale = containerWidth > 0 ? containerWidth / 1280 : 0.3;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      className={`relative flex-1 w-full overflow-hidden bg-zinc-950 select-none ${className}`}
    >
      <img
        src={imageSrc}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      />

      {isMounted && canPlayHero && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10 transition-opacity duration-300"
          style={{ transform: "translateZ(0)", isolation: "isolate" }}
        >
          <div
            style={{
              width: 1280,
              height: 720,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="overflow-hidden bg-black"
          >
            <RenderTemplatePreview templateId={resolvedId} />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none z-20">
        <div className="px-3.5 py-1.5 rounded-lg bg-background text-foreground border border-border font-medium text-xs shadow-sm flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          <span>Live Preview</span>
        </div>
      </div>
    </div>
  );
}
