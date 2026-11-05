"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { RenderTemplatePreview } from "./TemplatePreviews";

interface TemplateCardMediaProps {
  imageSrc: string;
  templateId: string;
  isHovered: boolean;
  eager?: boolean;
}

const LIVE_HOVER_TEMPLATES = new Set<string>([
  "template-toyberry-store-pro",
  "template-karmin-film-pro",
  "template-nexore-tee-pro",
  "template-nexore-case-pro",
  "template-vesuvio-pizza-pro",
  "template-pull-noodle-pro",
  "template-flip-skate-pro",
  "template-panda-bakery-pro",
  "template-capy-spa-pro",
  "template-bear-lift-pro",
  "template-burlit-coffee-pro",
  "template-ironpaw-tools-pro",
  "template-ferrari-nocturne",
  "template-rose-nocturne",
  "template-psyche-obsidian",
  "template-vortex-apex-pro",
  "template-aerovoid-obsidian-pro",
  "template-amarena-royale-pro",
  "template-monolith-cacao-pro",
  "template-levitas-cryo-pro",
  "template-aura-obsidian-pro",
  "template-aura-nocturne-pro",
  "template-velvet-gelato-pro",
  "template-zenith-elixir-pro",
]);

const HOVER_DELAY_MS = 220;
const PREVIEW_VIEWPORT_WIDTH = 1280;
const PREVIEW_VIEWPORT_HEIGHT = 800;

function useFinePointer(): boolean {
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isFine;
}

export function TemplateCardMedia({ imageSrc, templateId, isHovered, eager = false }: TemplateCardMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLiveMounted, setIsLiveMounted] = useState(false);
  const isFinePointer = useFinePointer();
  const prefersReducedMotion = useReducedMotion();

  const canPlayLive = LIVE_HOVER_TEMPLATES.has(templateId) && isFinePointer && !prefersReducedMotion;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isHovered || !canPlayLive) {
      setIsLiveMounted(false);
      return;
    }
    const timer = window.setTimeout(() => setIsLiveMounted(true), HOVER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isHovered, canPlayLive]);

  useEffect(() => {
    if (!isLiveMounted) return;
    const el = containerRef.current;
    if (!el) return;
    el.querySelectorAll("video").forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => undefined);
    });
  }, [isLiveMounted]);

  const scale = containerWidth > 0 ? containerWidth / PREVIEW_VIEWPORT_WIDTH : 0;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden select-none">
      <img
        src={imageSrc}
        alt=""
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover object-top"
      />

      {isLiveMounted && scale > 0 && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            style={{
              width: PREVIEW_VIEWPORT_WIDTH,
              height: PREVIEW_VIEWPORT_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="overflow-hidden bg-background"
          >
            <RenderTemplatePreview templateId={templateId} />
          </div>
        </div>
      )}
    </div>
  );
}
