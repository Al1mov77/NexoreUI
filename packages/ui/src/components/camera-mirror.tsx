"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export interface CameraMirrorProps extends React.HTMLAttributes<HTMLDivElement> {
  cell?: number;
  mode?: number;
  contrast?: number;
  bright?: number;
  inv?: number;
  dot?: number;
  trail?: number;
  col?: number;
  c1?: string;
  bg?: string;
  paused?: boolean;
}

function parseHex(h: string): [number, number, number] {
  const c = h.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const GLYPHS = " .:-=+*#%@";

export const CameraMirror = React.forwardRef<HTMLDivElement, CameraMirrorProps>(
  function CameraMirror(
    {
      cell = 12,
      mode = 0,
      contrast = 1.4,
      bright = 0,
      inv = 0,
      dot = 1,
      trail = 0.35,
      col = 0,
      c1 = "#f2efe8",
      bg = "#08080b",
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const atlasCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const atlasKeyRef = useRef<string>("");
    const atlasTileSizeRef = useRef<number>(12);

    const pointerRef = useRef<{ x: number; y: number; t: number }>({ x: -1e4, y: -1e4, t: -1e9 });
    const isVisibleRef = useRef<boolean>(true);
    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const [camMessage, setCamMessage] = useState<string | null>(null);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          t: performance.now(),
        };
      };

      const onPointerLeave = () => {
        pointerRef.current = { x: -1e4, y: -1e4, t: -1e9 };
      };

      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerdown", onPointerMove);
      el.addEventListener("pointerleave", onPointerLeave);

      return () => {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerdown", onPointerMove);
        el.removeEventListener("pointerleave", onPointerLeave);
      };
    }, []);

    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 } },
          audio: false,
        });
        const v = document.createElement("video");
        v.srcObject = s;
        v.muted = true;
        v.playsInline = true;
        await v.play();
        videoRef.current = v;
        streamRef.current = s;
        setCameraActive(true);
        setCamMessage(null);
      } catch {
        setCamMessage("No camera access, using simulation");
        setTimeout(() => setCamMessage(null), 3000);
      }
    };

    useEffect(() => {
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      if (!ctx) return;

      if (!sampleCanvasRef.current) {
        sampleCanvasRef.current = document.createElement("canvas");
      }
      if (!atlasCanvasRef.current) {
        atlasCanvasRef.current = document.createElement("canvas");
      }

      const sampleCanvas = sampleCanvasRef.current;
      const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!sampleCtx) return;

      const atlasCanvas = atlasCanvasRef.current;

      let rafId = 0;

      const resize = () => {
        const rect = cvs.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        cvs.width = Math.round(rect.width * dpr);
        cvs.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const ro = new ResizeObserver(resize);
      ro.observe(cvs);
      resize();

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const rect = cvs.getBoundingClientRect();
          const w = rect.width;
          const h = rect.height;

          if (w > 0 && h > 0) {
            const t = ms / 1000;
            const effectiveCell = Math.max(cell, Math.sqrt((w * h) / 7000));
            const cols = Math.ceil(w / effectiveCell);
            const rows = Math.ceil(h / effectiveCell);

            if (sampleCanvas.width !== cols || sampleCanvas.height !== rows) {
              sampleCanvas.width = cols;
              sampleCanvas.height = rows;
            }

            const video = videoRef.current;
            if (video && video.videoWidth) {
              const vw = video.videoWidth;
              const vh = video.videoHeight;
              const ar = cols / rows;
              let sw = vw;
              let sh = vh;
              if (vw / vh > ar) sw = vh * ar;
              else sh = vw / ar;

              sampleCtx.save();
              sampleCtx.translate(cols, 0);
              sampleCtx.scale(-1, 1);
              sampleCtx.drawImage(
                video,
                (vw - sw) / 2,
                (vh - sh) / 2,
                sw,
                sh,
                0,
                0,
                cols,
                rows
              );
              sampleCtx.restore();
            } else {
              sampleCtx.fillStyle = "#000000";
              sampleCtx.fillRect(0, 0, cols, rows);
              const r0 = Math.min(cols, rows);

              const drawBlob = (bx: number, by: number, r: number) => {
                const gr = sampleCtx.createRadialGradient(bx, by, 0, bx, by, r);
                gr.addColorStop(0, "#ffffff");
                gr.addColorStop(1, "rgba(255,255,255,0)");
                sampleCtx.fillStyle = gr;
                sampleCtx.fillRect(bx - r, by - r, r * 2, r * 2);
              };

              for (let i = 0; i < 3; i++) {
                drawBlob(
                  cols * (0.5 + 0.32 * Math.sin(t * 0.5 + i * 2.1)),
                  rows * (0.5 + 0.3 * Math.cos(t * 0.4 + i * 1.7)),
                  r0 * (0.2 + 0.07 * i)
                );
              }

              if (performance.now() - pointerRef.current.t < 2500) {
                drawBlob(
                  (pointerRef.current.x / w) * cols,
                  (pointerRef.current.y / h) * rows,
                  r0 * 0.18
                );
              }
            }

            const imgData = sampleCtx.getImageData(0, 0, cols, rows);
            const px = imgData.data;
            const c1Rgb = parseHex(c1);
            const bgRgb = parseHex(bg);

            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = `rgba(${bgRgb[0]},${bgRgb[1]},${bgRgb[2]},${1 - trail})`;
            ctx.fillRect(0, 0, w, h);

            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            if (mode === 2) {
              const currentKey = `${effectiveCell}|${c1}|${dpr}`;
              if (atlasKeyRef.current !== currentKey) {
                atlasKeyRef.current = currentKey;
                const tileSize = Math.round(effectiveCell * dpr);
                atlasTileSizeRef.current = tileSize;
                atlasCanvas.width = tileSize * 10;
                atlasCanvas.height = tileSize;
                const actx = atlasCanvas.getContext("2d");
                if (actx) {
                  actx.fillStyle = c1;
                  actx.font = `700 ${tileSize}px "Geist Mono", monospace`;
                  actx.textAlign = "center";
                  actx.textBaseline = "middle";
                  Array.from(GLYPHS).forEach((ch, idx) => {
                    actx.fillText(ch, idx * tileSize + tileSize / 2, tileSize / 2);
                  });
                }
              }
            }

            ctx.fillStyle = c1;
            const batch = col <= 0.01 && mode < 2;
            if (batch) ctx.beginPath();

            for (let j = 0; j < rows; j++) {
              for (let i = 0; i < cols; i++) {
                const q = (j * cols + i) * 4;
                const rVal = px[q] ?? 0;
                const gVal = px[q + 1] ?? 0;
                const bVal = px[q + 2] ?? 0;

                let luma = (rVal * 0.299 + gVal * 0.587 + bVal * 0.114) / 255;
                luma = Math.min(1, Math.max(0, (luma - 0.5) * contrast + 0.5 + bright));
                if (inv) luma = 1 - luma;
                if (luma < 0.04) continue;

                const cx = i * effectiveCell + effectiveCell / 2;
                const cy = j * effectiveCell + effectiveCell / 2;

                if (mode === 2) {
                  const k = Math.min(9, Math.floor(luma * 10));
                  const tileSize = atlasTileSizeRef.current;
                  if (k > 0) {
                    ctx.drawImage(
                      atlasCanvas,
                      k * tileSize,
                      0,
                      tileSize,
                      tileSize,
                      i * effectiveCell,
                      j * effectiveCell,
                      effectiveCell,
                      effectiveCell
                    );
                  }
                } else {
                  if (!batch) {
                    const cr = Math.round(c1Rgb[0] + (rVal - c1Rgb[0]) * col);
                    const cg = Math.round(c1Rgb[1] + (gVal - c1Rgb[1]) * col);
                    const cb = Math.round(c1Rgb[2] + (bVal - c1Rgb[2]) * col);
                    ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
                    ctx.beginPath();
                  }

                  if (mode === 0) {
                    const radiusVal = luma * effectiveCell * 0.5 * dot;
                    ctx.moveTo(cx + radiusVal, cy);
                    ctx.arc(cx, cy, radiusVal, 0, Math.PI * 2);
                  } else {
                    const sizeVal = Math.sqrt(luma) * effectiveCell * dot;
                    ctx.rect(cx - sizeVal / 2, cy - sizeVal / 2, sizeVal, sizeVal);
                  }

                  if (!batch) ctx.fill();
                }
              }
            }

            if (batch) ctx.fill();
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
      };
    }, [paused, cell, mode, contrast, bright, inv, dot, trail, col, c1, bg]);

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("relative w-full h-full overflow-hidden select-none touch-none", className)}
        style={{ backgroundColor: bg, ...style }}
        {...rest}
      >
        <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-auto">
          {!cameraActive && (
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold shadow-md hover:bg-zinc-200 transition"
            >
              Use camera
            </button>
          )}
          {camMessage && (
            <span className="text-[11px] font-mono text-white/70 bg-black/60 px-2.5 py-0.5 rounded-full">
              {camMessage}
            </span>
          )}
        </div>
      </div>
    );
  }
);

CameraMirror.displayName = "CameraMirror";
