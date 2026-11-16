"use client";

import React, { useEffect, useRef, useState } from "react";
import { VideoPassportBlock } from "../../../lib/generator/schema";

function findScrollContainer(node: HTMLElement | null): HTMLElement | Window {
  let current = node?.parentElement ?? null;
  while (current) {
    const style = window.getComputedStyle(current);
    const isScrollableY =
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight + 2;
    if (isScrollableY) {
      return current;
    }
    current = current.parentElement;
  }
  return window;
}

export function ScrollVideoCanvas({
  video,
  posterUrl,
  objectPosition = "50% 50%",
  reducedMotion,
  className,
}: {
  video?: VideoPassportBlock;
  posterUrl: string;
  objectPosition?: string;
  reducedMotion: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnFrameRef = useRef<number>(-1);
  const [loadedCount, setLoadedCount] = useState(0);

  const framesDir = video?.scrollFramesDir;
  const frameCount = Math.max(1, video?.scrollFrameCount || 80);

  useEffect(() => {
    if (reducedMotion || !framesDir) return;
    const frames: HTMLImageElement[] = [];
    let loaded = 0;
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, "0");
      img.src = `${framesDir}/frame_${numStr}.webp`;
      img.onload = () => {
        loaded++;
        if (i === 1) {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx && lastDrawnFrameRef.current === -1) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              lastDrawnFrameRef.current = 0;
            }
          }
        }
        if (loaded === 1 || loaded === frameCount || loaded % 20 === 0) {
          setLoadedCount(loaded);
        }
      };
      frames.push(img);
    }
    framesRef.current = frames;
  }, [framesDir, frameCount, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !framesDir || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scrollTarget = findScrollContainer(containerRef.current);
    let rafId = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let scrollTop = 0;
      let viewportHeight = window.innerHeight || 800;
      let relativeTop = rect.top;

      if (scrollTarget instanceof HTMLElement) {
        const containerRect = scrollTarget.getBoundingClientRect();
        scrollTop = scrollTarget.scrollTop;
        viewportHeight = scrollTarget.clientHeight || 800;
        relativeTop = rect.top - containerRect.top;
      } else {
        scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      }

      const isTopHero = relativeTop + scrollTop < 200;
      const progress = isTopHero
        ? Math.max(0, Math.min(1, scrollTop / Math.max(200, rect.height)))
        : Math.max(0, Math.min(1, (viewportHeight - relativeTop) / (viewportHeight + rect.height)));

      const maxIdx = frameCount - 1;
      const frameIdx = Math.min(maxIdx, Math.max(0, Math.floor(progress * maxIdx)));
      const frameImg = framesRef.current[frameIdx];
      if (frameImg && frameImg.complete && frameImg.naturalWidth > 0) {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        lastDrawnFrameRef.current = frameIdx;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    if (scrollTarget instanceof HTMLElement) {
      scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => {
      if (scrollTarget instanceof HTMLElement) {
        scrollTarget.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [framesDir, frameCount, reducedMotion, loadedCount]);

  if (reducedMotion || (!framesDir && !video?.webmUrl)) {
    return (
      <img
        src={posterUrl}
        alt="Static video poster frame"
        style={{ objectPosition }}
        className={className || "h-full w-full object-cover"}
      />
    );
  }

  if (!framesDir && video?.webmUrl) {
    return (
      <video
        muted
        autoPlay
        loop={video.loop}
        playsInline
        preload="metadata"
        poster={posterUrl}
        style={{ objectPosition }}
        className={className || "h-full w-full object-cover"}
      >
        <source src={video.webmUrl} type="video/webm" />
      </video>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className || "h-full w-full"}`}>
      <img
        src={posterUrl}
        alt="Poster placeholder"
        style={{ objectPosition }}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full h-full object-cover block relative z-10"
      />
    </div>
  );
}
