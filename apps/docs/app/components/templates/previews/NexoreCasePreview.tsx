"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

export type Kind =
  | "sparkles"
  | "daisy"
  | "daisy2"
  | "smile"
  | "charm"
  | "gem"
  | "tape"
  | "bolt"
  | "pinkgem"
  | "spark"
  | "star";

export interface PlacedItem {
  id: number;
  kind: Kind;
  x: number;
  y: number;
  s: number;
  r: number;
}

export interface NexoreCaseProps {
  assetBase?: string;
  assets?: Partial<Record<"boxClosed" | "boxOpen" | "caseBase" | "sheet" | "tray" | "paper" | "pad", string>>;
  color?: string;
  onColorChange?: (hex: string) => void;
  onSealed?: (result: { color: string; items: PlacedItem[] }) => void;
}

type Stage = "closed" | "open" | "unwrap" | "build" | "seal" | "done";
const ORDER: readonly Stage[] = ["closed", "open", "unwrap", "build", "seal", "done"];

interface Sprite {
  url: string;
  w: number;
  h: number;
}

const FILES = {
  boxClosed: "nexore-01-box-closed.jpg",
  boxOpen: "nexore-02-box-open.jpg",
  caseBase: "nexore-03-case-white.jpg",
  sheet: "nexore-04-charms-sheet.jpg",
  tray: "nexore-05-stars-tray.jpg",
  paper: "nexore-06-paper-texture.jpg",
  pad: "nexore-07-seal-pad.jpg",
} as const;

const IMG_W = 2576;
const IMG_H = 1438;
const CASE_RECT = { x: 960, y: 130, w: 660, h: 1130 } as const;
const SHEET_RECTS: Record<Exclude<Kind, "star">, { x: number; y: number; w: number; h: number }> = {
  sparkles: { x: 195, y: 138, w: 400, h: 362 },
  daisy: { x: 798, y: 122, w: 350, h: 350 },
  smile: { x: 1405, y: 180, w: 232, h: 232 },
  charm: { x: 1905, y: 205, w: 515, h: 240 },
  gem: { x: 268, y: 622, w: 210, h: 210 },
  tape: { x: 695, y: 655, w: 580, h: 130 },
  bolt: { x: 865, y: 1045, w: 230, h: 230 },
  daisy2: { x: 1432, y: 985, w: 356, h: 332 },
  pinkgem: { x: 1992, y: 924, w: 100, h: 142 },
  spark: { x: 2090, y: 1005, w: 280, h: 284 },
};
const TRAY_CROP = { x: 735, y: 250, w: 1105, h: 740 } as const;
const PAD_DIAM = 705;
const PAD_CY = 685;

const DEF_W: Record<Kind, number> = {
  sparkles: 96,
  daisy: 84,
  daisy2: 84,
  smile: 56,
  charm: 120,
  gem: 52,
  tape: 120,
  bolt: 54,
  pinkgem: 40,
  spark: 66,
  star: 44,
};
const SHELF: readonly Kind[] = [
  "star",
  "daisy",
  "daisy2",
  "smile",
  "charm",
  "gem",
  "tape",
  "bolt",
  "pinkgem",
];

const COLORS: readonly string[] = [
  "#ecebf2",
  "#c9b8ff",
  "#ff9ccc",
  "#8ed3ff",
  "#ffe27a",
  "#ffb08a",
  "#a8f0cf",
  "#ff6b5b",
  "#2f4bff",
  "#1a1a2e",
];

const CASE_W = 300;
const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));

function useImg(src: string, cors = false): HTMLImageElement | null | false {
  const [img, setImg] = useState<HTMLImageElement | null | false>(null);
  useEffect(() => {
    let alive = true;
    const i = new Image();
    if (cors) i.crossOrigin = "anonymous";
    i.onload = () => {
      if (alive) setImg(i);
    };
    i.onerror = () => {
      if (alive) setImg(false);
    };
    i.src = src;
    return () => {
      alive = false;
    };
  }, [src, cors]);
  return img;
}

function keyCanvas(src: CanvasImageSource, sx: number, sy: number, sw: number, sh: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(sw));
  c.height = Math.max(1, Math.round(sh));
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) throw new Error("no 2d context");
  x.drawImage(src, sx, sy, sw, sh, 0, 0, c.width, c.height);
  const d = x.getImageData(0, 0, c.width, c.height);
  const p = d.data;
  let minX = c.width;
  let minY = c.height;
  let maxX = -1;
  let maxY = -1;
  for (let i = 0; i < p.length; i += 4) {
    const r = p[i] ?? 0;
    const g = p[i + 1] ?? 0;
    const b = p[i + 2] ?? 0;
    const m = Math.max(r, b);
    const dd = g - m;
    const a = dd >= 120 ? 0 : dd <= 40 ? 255 : Math.round((255 * (120 - dd)) / 80);
    if (a < 255 && dd > 0) p[i + 1] = m;
    p[i + 3] = a;
    if (a > 24) {
      const px = i >> 2;
      const ix = px % c.width;
      const iy = (px / c.width) | 0;
      if (ix < minX) minX = ix;
      if (ix > maxX) maxX = ix;
      if (iy < minY) minY = iy;
      if (iy > maxY) maxY = iy;
    }
  }
  if (maxX < 0) throw new Error("empty key");
  x.putImageData(d, 0, 0);
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const out = document.createElement("canvas");
  out.width = bw;
  out.height = bh;
  const outCtx = out.getContext("2d");
  if (outCtx) {
    outCtx.drawImage(c, minX, minY, bw, bh, 0, 0, bw, bh);
  }
  return out;
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fallbackCase(): HTMLCanvasElement {
  const W = 560;
  const H = 770;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  if (!x) return c;
  x.fillStyle = "#e9e8ef";
  rr(x, 0, 0, W, H, 96);
  x.fill();
  x.globalCompositeOperation = "destination-out";
  rr(x, 44, 44, 150, 150, 40);
  x.fill();
  x.globalCompositeOperation = "source-atop";
  const g = x.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "rgba(255,255,255,.7)");
  g.addColorStop(0.5, "rgba(255,255,255,0)");
  g.addColorStop(1, "rgba(80,80,110,.18)");
  x.fillStyle = g;
  x.fillRect(0, 0, W, H);
  x.strokeStyle = "rgba(90,90,120,.22)";
  x.lineWidth = 10;
  rr(x, 40, 40, 158, 158, 44);
  x.stroke();
  return c;
}

function makeCaseBase(img: HTMLImageElement | false | null): HTMLCanvasElement {
  if (img) {
    try {
      const k = img.naturalWidth / IMG_W;
      return keyCanvas(img, CASE_RECT.x * k, CASE_RECT.y * k, CASE_RECT.w * k, CASE_RECT.h * k);
    } catch {
      return fallbackCase();
    }
  }
  return fallbackCase();
}

function tintCase(base: HTMLCanvasElement, hex: string): string {
  const c = document.createElement("canvas");
  c.width = base.width;
  c.height = base.height;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) return "";
  x.drawImage(base, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height);
  const p = d.data;
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const t = [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
  const ref = [232, 231, 240] as const;
  for (let i = 0; i < p.length; i += 4) {
    if (!p[i + 3]) continue;
    p[i] = Math.min(255, (t[0] * (p[i] ?? 0)) / ref[0]);
    p[i + 1] = Math.min(255, (t[1] * (p[i + 1] ?? 0)) / ref[1]);
    p[i + 2] = Math.min(255, (t[2] * (p[i + 2] ?? 0)) / ref[2]);
  }
  x.putImageData(d, 0, 0);
  return c.toDataURL("image/png");
}

const GOLD = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".5" stop-color="#e2b64a"/><stop offset="1" stop-color="#a97b1f"/></linearGradient></defs>`;
const P4 = "M50 2 L60 40 L98 50 L60 60 L50 98 L40 60 L2 50 L40 40Z";
const STAR5 = Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const r = i % 2 ? 21 : 48;
  return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
}).join(" ");

function petals(cols: readonly string[]): string {
  let s = `<circle cx="50" cy="50" r="48" fill="#fff"/>`;
  for (let i = 0; i < 12; i++) {
    s += `<ellipse cx="50" cy="24" rx="8.5" ry="19" fill="${cols[i % 3]}" stroke="#7a3b1d" stroke-width=".8" transform="rotate(${i * 30} 50 50)"/>`;
  }
  return s + `<circle cx="50" cy="50" r="14" fill="#ffd21f" stroke="#b88a00" stroke-width="1.5"/>`;
}

const FB: Record<Kind, readonly [string, number, number]> = {
  sparkles: [
    `${GOLD}<path d="${P4}" fill="url(#g)"/><path transform="translate(78 68) scale(.5)" d="${P4}" fill="url(#g)"/>`,
    130,
    120,
  ],
  spark: [`${GOLD}<path d="${P4}" fill="url(#g)"/>`, 100, 100],
  star: [
    `${GOLD}<polygon points="${STAR5}" fill="url(#g)" stroke="#a97b1f" stroke-width="2" stroke-linejoin="round"/>`,
    100,
    100,
  ],
  daisy: [petals(["#ff7a3c", "#fff0dc", "#ff7fb8"]), 100, 100],
  daisy2: [petals(["#fff0dc", "#ff7fb8", "#ff7a3c"]), 100, 100],
  smile: [
    `<circle cx="50" cy="50" r="46" fill="#ffd91f" stroke="#b88a00" stroke-width="3"/><ellipse cx="35" cy="40" rx="5" ry="9" fill="#222"/><ellipse cx="65" cy="40" rx="5" ry="9" fill="#222"/><path d="M24 58 Q50 88 76 58" stroke="#222" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    100,
    100,
  ],
  charm: [
    `${GOLD}<path d="M8 12 Q100 90 192 12" stroke="url(#g)" stroke-width="7" stroke-dasharray="10 4" fill="none" stroke-linecap="round"/><path d="M100 94 C78 76 82 54 96 54 C100 54 100 59 100 62 C100 59 100 54 104 54 C118 54 122 76 100 94Z" fill="url(#g)" stroke="#a97b1f"/>`,
    200,
    100,
  ],
  gem: [
    `<defs><radialGradient id="r"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c6d0ea"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="url(#r)" stroke="#9aa6c8" stroke-width="2"/><polygon points="50,18 78,38 68,74 32,74 22,38" fill="none" stroke="#8d9bc0" stroke-width="1.5"/><path d="M50 18 L50 74 M22 38 L78 38 M32 74 L50 40 L68 74" stroke="#8d9bc0" stroke-width="1" fill="none"/>`,
    100,
    100,
  ],
  tape: [
    `<clipPath id="c"><polygon points="0,6 196,0 200,50 4,56"/></clipPath><g clip-path="url(#c)"><g transform="skewX(-25)">${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 24 - 20}" y="0" width="24" height="60" fill="${["#fff1a8", "#d9c7ff", "#ffc8e0"][i % 3]}"/>`).join("")}</g></g>`,
    200,
    56,
  ],
  bolt: [
    `${GOLD}<circle cx="50" cy="50" r="46" fill="#2fa4e8" stroke="url(#g)" stroke-width="4"/><polygon points="58,16 32,54 49,54 40,86 68,44 52,44" fill="#fff" stroke="#1b6fa3" stroke-width="2" stroke-linejoin="round"/>`,
    100,
    100,
  ],
  pinkgem: [
    `<defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd3e4"/><stop offset="1" stop-color="#e85f90"/></linearGradient></defs><path d="M35 4 C60 40 66 58 66 68 A31 31 0 0 1 4 68 C4 58 10 40 35 4Z" fill="url(#p)" stroke="#c9a24a" stroke-width="3"/><path d="M35 4 L35 99 M12 56 L58 56 M35 4 L12 56 M35 4 L58 56" stroke="#fff" stroke-opacity=".6" fill="none"/>`,
    70,
    100,
  ],
};

function fallbackSprite(kind: Kind): Sprite {
  const [inner, w, h] = FB[kind];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 4}" height="${h * 4}">${inner}</svg>`;
  return { url: "data:image/svg+xml;utf8," + encodeURIComponent(svg), w, h };
}

function buildSprites(sheet: HTMLImageElement | false | null): Record<Kind, Sprite> {
  const out = {} as Record<Kind, Sprite>;
  (Object.keys(FB) as Kind[]).forEach((k) => {
    if (k !== "star" && sheet) {
      try {
        const f = sheet.naturalWidth / IMG_W;
        const r = SHEET_RECTS[k];
        const c = keyCanvas(sheet, r.x * f, r.y * f, r.w * f, r.h * f);
        out[k] = { url: c.toDataURL("image/png"), w: c.width, h: c.height };
        return;
      } catch {
        out[k] = fallbackSprite(k);
        return;
      }
    }
    out[k] = fallbackSprite(k);
  });
  return out;
}

const CSS = `
.nx{--blue:#1f3fe0;--cream:#f6ecd6;position:relative;width:100%;height:100vh;height:100dvh;min-height:560px;overflow:hidden;
 font-family:'Nunito',system-ui,sans-serif;color:var(--blue);-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;
 touch-action:none;background:radial-gradient(120% 90% at 15% 0%,#3fd33f 0%,#14c014 45%,#03ad03 100%)}
.nx *{box-sizing:border-box}
.nx .scene{position:absolute;inset:0;background-size:cover;background-position:center;display:grid;place-items:center;
 transition:opacity .75s ease,transform .95s cubic-bezier(.2,.8,.2,1)}
.nx .s-before{opacity:0;transform:scale(.93);pointer-events:none}
.nx .s-on{opacity:1;transform:none}
.nx .s-after{opacity:0;transform:translateY(-7%) scale(1.12) rotate(-1.5deg);pointer-events:none}
.nx .fbox{width:min(46vw,260px);aspect-ratio:.55;background:var(--cream);border:2px solid #d8c9a4;border-radius:6px;box-shadow:0 22px 30px rgba(0,60,0,.35);
 display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-family:'Baloo 2',sans-serif;font-weight:800;color:var(--blue)}
.nx .fbox b{font-size:clamp(30px,8vw,48px);line-height:.9;transform:rotate(-4deg)}
.nx .fbox span{font-size:22px}.nx .fbox em{font-size:54px;font-style:normal}
.nx .fbox.in{background:linear-gradient(160deg,#cfe8f7,#9fcbe8);}
.nx .fpad{width:min(70vw,360px);aspect-ratio:1;border-radius:50%;background:#f1f0f6;box-shadow:inset 0 0 0 26px #e6e4ee,0 20px 30px rgba(0,60,0,.3)}
.nx .top{position:absolute;left:0;right:0;top:0;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;z-index:6;pointer-events:none;transition:opacity .4s}
.nx .pill{background:var(--cream);border:2px solid var(--blue);border-radius:99px;padding:3px 13px;font:800 15px 'Baloo 2',sans-serif;line-height:1.5;color:var(--blue)}
.nx .cta{position:absolute;left:50%;bottom:9%;transform:translateX(-50%);z-index:7;white-space:nowrap;background:var(--blue);color:#fff;border:3px solid #fff;
 border-radius:99px;padding:12px 26px;font:800 18px 'Baloo 2',sans-serif;box-shadow:0 8px 0 rgba(0,40,120,.35);cursor:pointer;animation:nx-bob 1.6s ease-in-out infinite}
.nx .cta:active{transform:translateX(-50%) translateY(4px);box-shadow:0 3px 0 rgba(0,40,120,.35)}
@keyframes nx-bob{50%{margin-bottom:8px}}
.nx .holder{position:absolute;left:50%;top:50%;transform-origin:center;transition:transform 1.15s cubic-bezier(.65,0,.25,1);z-index:3}
.nx .case-inner{position:relative;width:100%;height:100%;animation:nx-enter .95s cubic-bezier(.2,1.15,.3,1) both;filter:drop-shadow(0 16px 14px rgba(0,60,0,.38))}
@keyframes nx-enter{from{transform:translateY(95vh) rotate(-12deg)}to{transform:none}}
.nx .case-img{position:absolute;inset:0;width:100%;height:100%;max-width:none;display:block;pointer-events:none}
.nx .layer{position:absolute;inset:0;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
.nx .it{position:absolute;touch-action:none;cursor:grab}
.nx .it img{width:100%;height:auto;max-width:none;display:block;pointer-events:none;animation:nx-pop .38s cubic-bezier(.3,1.7,.5,1);filter:drop-shadow(0 2px 2px rgba(0,0,0,.28))}
.nx .it.sel{outline:2px dashed var(--blue);outline-offset:5px;border-radius:4px}
@keyframes nx-pop{from{transform:scale(.2) rotate(-20deg);opacity:0}}
.nx .scan{pointer-events:none;mix-blend-mode:screen;opacity:0;transition:opacity .4s;
 background:linear-gradient(180deg,transparent calc(var(--p,0)*100% - 14%),rgba(206,170,255,.95) calc(var(--p,0)*100%),transparent calc(var(--p,0)*100% + 14%))}
.nx.seal .scan{opacity:1}
.nx .coat{pointer-events:none;opacity:0;transition:opacity .9s;background:linear-gradient(135deg,rgba(255,255,255,.6) 0%,rgba(255,255,255,0) 34%,rgba(255,255,255,0) 62%,rgba(255,255,255,.28) 100%)}
.nx.done .coat{opacity:1}
.nx .badge{position:absolute;right:-8px;bottom:-8px;width:62px;height:62px;border-radius:50%;background:var(--blue);color:var(--cream);border:3px solid var(--cream);
 display:grid;place-items:center;font:800 30px 'Baloo 2',sans-serif;animation:nx-pop .6s .2s cubic-bezier(.3,1.7,.5,1) both;transform:rotate(-12deg)}
.nx .ring{position:absolute;left:50%;border-radius:50%;transform:translate(-50%,-50%);z-index:2;opacity:0;transition:opacity .6s;pointer-events:none;
 box-shadow:0 0 calc(30px + var(--p,0)*120px) calc(6px + var(--p,0)*38px) rgba(167,110,255,calc(.15 + var(--p,0)*.55))}
.nx.seal .ring,.nx.done .ring{opacity:1}
.nx.done .ring{animation:nx-pulse 2.2s ease-in-out infinite}
@keyframes nx-pulse{50%{box-shadow:0 0 150px 40px rgba(167,110,255,.5)}}
.nx .cf{position:absolute;width:26px;height:26px;z-index:8;pointer-events:none;background:url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>${GOLD}<polygon points='${STAR5}' fill='url(#g)' stroke='#a97b1f' stroke-width='3' stroke-linejoin='round'/></svg>`)}") center/contain no-repeat;
 animation:nx-burst 1.5s cubic-bezier(.1,.7,.3,1) forwards}
@keyframes nx-burst{from{transform:translate(0,0) scale(.3) rotate(0);opacity:1}to{transform:translate(var(--dx),var(--dy)) scale(1.1) rotate(var(--r));opacity:0}}
.nx .panel{position:absolute;left:50%;transform:translateX(-50%);bottom:10px;width:min(560px,calc(100% - 20px));height:236px;z-index:6;border:2px solid var(--blue);
 border-radius:22px;background-color:var(--cream);background-size:cover;background-blend-mode:multiply;padding:10px 12px;display:flex;flex-direction:column;gap:8px;
 box-shadow:0 10px 0 rgba(0,40,120,.25);animation:nx-rise .6s .2s cubic-bezier(.2,1.1,.3,1) both}
@keyframes nx-rise{from{transform:translateX(-50%) translateY(120%)}}
.nx .row{display:flex;align-items:center;gap:8px}
.nx .lbl{font:800 11px 'Nunito',sans-serif;opacity:.75;letter-spacing:.04em;text-transform:uppercase;color:var(--blue)}
.nx .sw{flex:0 0 auto;width:30px;height:30px;border-radius:50%;border:2px solid var(--blue);cursor:pointer;padding:0}
.nx .sw.on{box-shadow:0 0 0 3px var(--cream),0 0 0 5px var(--blue)}
.nx .colors{display:flex;gap:9px;overflow-x:auto;padding:5px 6px;scrollbar-width:none;touch-action:pan-x;flex:1}
.nx .shelf{display:flex;gap:8px;overflow-x:auto;padding:4px 2px;scrollbar-width:none;touch-action:pan-x;height:78px;align-items:center}
.nx .tile{flex:0 0 auto;width:66px;height:66px;border-radius:15px;background:rgba(255,255,255,.7);border:2px solid var(--blue);display:grid;place-items:center;cursor:grab;touch-action:none;overflow:hidden;position:relative}
.nx .tile img{max-width:78%;max-height:78%;width:auto;height:auto;pointer-events:none}
.nx .tile.tray{width:98px;background-color:#111;background-repeat:no-repeat}
.nx .tile.tray i{position:absolute;left:0;right:0;bottom:0;background:var(--cream);font:800 10px 'Nunito';text-align:center;letter-spacing:.08em;border-top:2px solid var(--blue);color:var(--blue);font-style:normal}
.nx .btn{white-space:nowrap;border:2px solid var(--blue);background:#fff;color:var(--blue);border-radius:13px;font:800 15px 'Nunito',sans-serif;height:42px;min-width:42px;padding:0 12px;cursor:pointer}
.nx .btn.primary{background:var(--blue);color:#fff;box-shadow:0 4px 0 rgba(0,30,110,.45)}
.nx .btn:disabled{opacity:.4;cursor:default;box-shadow:none}
.nx .btn:active:not(:disabled){transform:translateY(2px)}
.nx .grow{flex:1}
.nx .ghost{position:absolute;z-index:50;pointer-events:none;transform:translate(-50%,-50%) scale(1.08);filter:drop-shadow(0 10px 8px rgba(0,0,0,.3))}
.nx .ghost img{width:100%;height:auto;max-width:none;display:block}
.nx .dock{position:absolute;left:50%;transform:translateX(-50%);bottom:26px;z-index:7;width:min(420px,calc(100% - 28px));text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center}
.nx .bar{width:100%;height:16px;border-radius:99px;border:2px solid var(--blue);background:var(--cream);overflow:hidden}
.nx .bar i{display:block;height:100%;width:calc(var(--p,0)*100%);background:linear-gradient(90deg,#a76eff,#6f8dff)}
.nx .title{font:800 28px 'Baloo 2',sans-serif;background:var(--cream);border:2px solid var(--blue);border-radius:99px;padding:2px 20px;color:var(--blue);animation:nx-pop .6s cubic-bezier(.3,1.7,.5,1)}
.nx .note{position:absolute;left:10px;right:10px;top:58px;z-index:9;background:#fff;border:2px solid var(--blue);border-radius:12px;padding:6px 10px;font:700 12px 'Nunito';text-align:center;color:var(--blue)}
`;

export function NexoreCase({
  assetBase = "/templates/nexore-case/",
  assets,
  color: colorProp,
  onColorChange,
  onSealed,
}: NexoreCaseProps) {
  const url = (f: string): string => {
    const key = (Object.keys(FILES) as (keyof typeof FILES)[]).find((k) => FILES[k] === f);
    return (key && assets?.[key]) || assetBase.replace(/\/?$/, "/") + f;
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const caseRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => {
      setViewport({
        w: el.clientWidth || window.innerWidth || 390,
        h: el.clientHeight || window.innerHeight || 800,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const vw = viewport.w;
  const vh = viewport.h;

  const [stage, setStage] = useState<Stage>("closed");
  const [color, setColorState] = useState<string>(colorProp || COLORS[0] || "#ecebf2");
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [ghost, setGhost] = useState<{ kind: Kind; x: number; y: number } | null>(null);
  const [pct, setPct] = useState(0);

  const idRef = useRef(1);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const raf = useRef(0);

  useEffect(() => {
    if (colorProp) setColorState(colorProp);
  }, [colorProp]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const setColor = (hex: string) => {
    setColorState(hex);
    onColorChange?.(hex);
  };

  const imgBoxClosed = useImg(url(FILES.boxClosed));
  const imgBoxOpen = useImg(url(FILES.boxOpen));
  const imgPad = useImg(url(FILES.pad));
  const imgTray = useImg(url(FILES.tray));
  const imgPaper = useImg(url(FILES.paper));
  const imgCase = useImg(url(FILES.caseBase), true);
  const imgSheet = useImg(url(FILES.sheet), true);

  const ready = imgCase !== null && imgSheet !== null;
  const base = useMemo(() => (ready ? makeCaseBase(imgCase) : null), [ready, imgCase]);
  const sprites = useMemo(() => (ready ? buildSprites(imgSheet) : null), [ready, imgSheet]);
  const caseUrl = useMemo(() => (base ? tintCase(base, color) : ""), [base, color]);
  const usingFallback = ready && (imgCase === false || imgSheet === false);

  const caseH = base ? Math.round((CASE_W * base.height) / base.width) : 412;

  const PANEL = 246;
  const TOP = 56;
  const sBuild = clamp(Math.min((vh - TOP - PANEL - 56) / caseH, (vw - 32) / CASE_W), 0.3, 1.5);
  const cover = Math.max(vw / IMG_W, vh / IMG_H);
  const padD = PAD_DIAM * cover;
  const padDy = (PAD_CY - IMG_H / 2) * cover;
  const sSeal = Math.min((padD * 0.7) / caseH, (vh * 0.7) / caseH, (vw - 40) / CASE_W);

  const idx = ORDER.indexOf(stage);
  const caseVisible = idx >= 3;
  const inSeal = idx >= 4;
  const holderT = inSeal
    ? `translate(-50%,-50%) translate(0px,${padDy - (stage === "done" ? 26 : 0)}px) scale(${sSeal})`
    : `translate(-50%,-50%) translate(0px,${(TOP - PANEL) / 2 - 6}px) scale(${sBuild})`;

  const sceneCls = (on: number, after: number, before = 0): string =>
    "scene " + (idx >= after ? "s-after" : idx >= on ? "s-on" : idx >= before ? "s-before" : "s-before");

  const openBox = () => setStage("open");
  const unwrap = () => {
    setStage("unwrap");
    window.setTimeout(() => setStage("build"), 750);
  };

  const addItem = useCallback(
    (kind: Kind, x: number, y: number) => {
      if (itemsRef.current.length >= 24) return;
      const id = idRef.current++;
      const it: PlacedItem = {
        id,
        kind,
        x: clamp(x, 12, CASE_W - 12),
        y: clamp(y, 12, caseH - 12),
        s: 1,
        r: Math.round((Math.random() - 0.5) * 24),
      };
      setItems((l) => [...l, it]);
      setSel(id);
    },
    [caseH]
  );

  const toRootLocal = (clientX: number, clientY: number): { x: number; y: number } => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return { x: clientX, y: clientY };
    return { x: clientX - r.left, y: clientY - r.top };
  };

  const onShelfDown = (e: ReactPointerEvent, kind: Kind) => {
    e.preventDefault();
    const sx = e.clientX;
    const sy = e.clientY;
    let started = false;
    const cleanup = () => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
    };
    const mv = (ev: PointerEvent) => {
      if (!started && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
      started = true;
      const loc = toRootLocal(ev.clientX, ev.clientY);
      setGhost({ kind, x: loc.x, y: loc.y });
    };
    const up = (ev: PointerEvent) => {
      cleanup();
      setGhost(null);
      const rect = caseRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (started) {
        const inside =
          ev.clientX >= rect.left - 24 &&
          ev.clientX <= rect.right + 24 &&
          ev.clientY >= rect.top - 24 &&
          ev.clientY <= rect.bottom + 24;
        if (inside) {
          const k = rect.width / CASE_W;
          addItem(kind, (ev.clientX - rect.left) / k, (ev.clientY - rect.top) / k);
        }
      } else {
        addItem(kind, CASE_W / 2 + (Math.random() - 0.5) * 120, caseH / 2 + (Math.random() - 0.5) * 160);
      }
    };
    const cancel = () => {
      cleanup();
      setGhost(null);
    };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
  };

  const onItemDown = (e: ReactPointerEvent, id: number) => {
    if (stage !== "build") return;
    e.stopPropagation();
    e.preventDefault();
    setSel(id);
    setItems((l) => {
      const it = l.find((i) => i.id === id);
      return it ? [...l.filter((i) => i.id !== id), it] : l;
    });
    const rect = caseRef.current?.getBoundingClientRect();
    const it = itemsRef.current.find((i) => i.id === id);
    if (!rect || !it) return;
    const k = rect.width / CASE_W;
    const ox = it.x - (e.clientX - rect.left) / k;
    const oy = it.y - (e.clientY - rect.top) / k;
    const mv = (ev: PointerEvent) => {
      const nx = clamp((ev.clientX - rect.left) / k + ox, 0, CASE_W);
      const ny = clamp((ev.clientY - rect.top) / k + oy, 0, caseH);
      setItems((l) => l.map((i) => (i.id === id ? { ...i, x: nx, y: ny } : i)));
    };
    const up = () => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
  };

  const patchSel = (f: (i: PlacedItem) => PlacedItem) =>
    setItems((l) => l.map((i) => (i.id === sel ? f(i) : i)));

  const removeSel = useCallback(() => {
    setItems((l) => l.filter((i) => i.id !== sel));
    setSel(null);
  }, [sel]);

  const dupSel = () => {
    const it = items.find((i) => i.id === sel);
    if (it) {
      const id = idRef.current++;
      setItems((l) => [...l, { ...it, id, x: clamp(it.x + 16, 0, CASE_W), y: clamp(it.y + 16, 0, caseH) }]);
      setSel(id);
    }
  };

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && sel !== null && stage === "build") removeSel();
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [sel, stage, removeSel]);

  const startSeal = () => {
    if (!items.length) return;
    setSel(null);
    setPct(0);
    setStage("seal");
    const t0 = performance.now() + 1200;
    const dur = 3400;
    const tick = (t: number) => {
      const p = clamp((t - t0) / dur, 0, 1);
      rootRef.current?.style.setProperty("--p", String(p));
      setPct(Math.round(p * 100));
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setStage("done");
        onSealed?.({ color, items: itemsRef.current });
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const restart = () => {
    setItems([]);
    setSel(null);
    rootRef.current?.style.setProperty("--p", "0");
    setStage("build");
  };

  const closeBox = () => {
    setItems([]);
    setSel(null);
    rootRef.current?.style.setProperty("--p", "0");
    setStage("closed");
  };

  const isDone = stage === "done";
  const confetti = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2 + ((i * 7) % 5) * 0.08;
        const d = 110 + ((i * 37) % 130);
        return {
          dx: Math.cos(a) * d,
          dy: Math.sin(a) * d,
          r: (((i * 53) % 100) / 100 - 0.5) * 540,
          s: 0.7 + (((i * 29) % 80) / 100),
        };
      }),
    [isDone]
  );

  const selItem = items.find((i) => i.id === sel);
  const sprite = (k: Kind): Sprite => sprites?.[k] ?? fallbackSprite(k);
  const bg = (img: HTMLImageElement | null | false, src: string): CSSProperties | undefined =>
    img ? { backgroundImage: `url(${src})` } : undefined;

  return (
    <div ref={rootRef} className={`nx ${stage}`} style={{ "--p": 0 } as CSSProperties}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@700;800&display=swap"
      />
      <style>{CSS}</style>

      <div
        className={sceneCls(0, 1)}
        style={bg(imgBoxClosed, url(FILES.boxClosed))}
        onClick={stage === "closed" ? openBox : undefined}
      >
        {imgBoxClosed === false && (
          <div className="fbox">
            <b>NEXORE</b>
            <span>CASE</span>
          </div>
        )}
      </div>
      <div
        className={sceneCls(1, 3)}
        style={bg(imgBoxOpen, url(FILES.boxOpen))}
        onClick={stage === "open" ? unwrap : undefined}
      >
        {imgBoxOpen === false && (
          <div className="fbox in">
            <span>NEXORE</span>
          </div>
        )}
      </div>
      <div className={sceneCls(4, 99, 3)} style={bg(imgPad, url(FILES.pad))}>
        {imgPad === false && <div className="fpad" style={{ marginTop: padDy * 2 }} />}
      </div>

      <div className="ring" style={{ width: padD * 0.78, height: padD * 0.78, top: `calc(50% + ${padDy}px)` }} />

      <div className="top" style={{ opacity: idx >= 3 ? 1 : 0 }}>
        <span className="pill">NEXORE CASE</span>
        <span className="pill">
          {stage === "build" ? `Charms: ${items.length}` : stage === "seal" ? "Sealing" : "Ready"}
        </span>
      </div>

      {stage === "closed" && (
        <button type="button" className="cta" onClick={openBox}>
          Open Box
        </button>
      )}
      {stage === "open" && (
        <button type="button" className="cta" onClick={unwrap}>
          Unbox Case
        </button>
      )}

      {caseVisible && ready && (
        <div className="holder" style={{ width: CASE_W, height: caseH, transform: holderT }}>
          <div className="case-inner" onPointerDown={() => setSel(null)}>
            <div ref={caseRef} style={{ position: "absolute", inset: 0 }}>
              <img className="case-img" src={caseUrl} alt="" draggable={false} />
              <div className="layer" style={{ WebkitMaskImage: `url(${caseUrl})`, maskImage: `url(${caseUrl})` }}>
                {items.map((it) => {
                  const sp = sprite(it.kind);
                  const w = DEF_W[it.kind] * it.s;
                  return (
                    <div
                      key={it.id}
                      className={"it" + (it.id === sel && stage === "build" ? " sel" : "")}
                      style={{
                        left: it.x,
                        top: it.y,
                        width: w,
                        transform: `translate(-50%,-50%) rotate(${it.r}deg)`,
                      }}
                      onPointerDown={(e) => onItemDown(e, it.id)}
                    >
                      <img src={sp.url} alt="" draggable={false} />
                    </div>
                  );
                })}
              </div>
              <div
                className="layer scan"
                style={{ WebkitMaskImage: `url(${caseUrl})`, maskImage: `url(${caseUrl})` }}
              />
              <div
                className="layer coat"
                style={{ WebkitMaskImage: `url(${caseUrl})`, maskImage: `url(${caseUrl})` }}
              />
            </div>
            {stage === "done" && <div className="badge">✓</div>}
          </div>
        </div>
      )}

      {stage === "build" && (
        <div className="panel" style={imgPaper ? { backgroundImage: `url(${url(FILES.paper)})` } : undefined}>
          <div className="row">
            <span className="lbl">Color</span>
            <div className="colors">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={"sw" + (c.toLowerCase() === color.toLowerCase() ? " on" : "")}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  aria-label={c}
                />
              ))}
              <label
                className="sw"
                style={{
                  background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)",
                  position: "relative",
                }}
              >
                <input
                  type="color"
                  value={color.length === 7 ? color : "#ecebf2"}
                  onChange={(e) => setColor(e.target.value)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                />
              </label>
            </div>
          </div>

          <div className="shelf">
            {SHELF.map((k) =>
              k === "star" ? (
                <div
                  key={k}
                  className="tile tray"
                  onPointerDown={(e) => onShelfDown(e, k)}
                  style={
                    imgTray
                      ? {
                          backgroundImage: `url(${url(FILES.tray)})`,
                          backgroundSize: `${(IMG_W / TRAY_CROP.w) * 98}px auto`,
                          backgroundPosition: `-${(TRAY_CROP.x / IMG_W) * (IMG_W / TRAY_CROP.w) * 98}px -${(TRAY_CROP.y / IMG_W) * (IMG_W / TRAY_CROP.w) * 98}px`,
                        }
                      : undefined
                  }
                >
                  {!imgTray && <img src={fallbackSprite("star").url} alt="" />}
                  <i>STARS</i>
                </div>
              ) : (
                <div key={k} className="tile" onPointerDown={(e) => onShelfDown(e, k)}>
                  <img src={sprite(k).url} alt="" draggable={false} />
                </div>
              )
            )}
          </div>

          <div className="row">
            {selItem ? (
              <>
                <button
                  type="button"
                  className="btn"
                  onClick={() => patchSel((i) => ({ ...i, s: clamp(i.s * 0.87, 0.35, 3) }))}
                >
                  −
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => patchSel((i) => ({ ...i, s: clamp(i.s * 1.15, 0.35, 3) }))}
                >
                  +
                </button>
                <button type="button" className="btn" onClick={() => patchSel((i) => ({ ...i, r: i.r + 20 }))}>
                  ↻
                </button>
                <button type="button" className="btn" onClick={dupSel}>
                  +1
                </button>
                <button type="button" className="btn" onClick={removeSel}>
                  ×
                </button>
              </>
            ) : (
              <span className="lbl grow">
                {items.length ? "Tap a charm to edit" : "Drag charms onto the case"}
              </span>
            )}
            <span className="grow" />
            <button type="button" className="btn primary" disabled={!items.length} onClick={startSeal}>
              Seal Case
            </button>
          </div>
        </div>
      )}

      {stage === "seal" && (
        <div className="dock">
          <div className="bar">
            <i />
          </div>
          <div className="pill">Sealing… {pct}%</div>
        </div>
      )}

      {stage === "done" && (
        <>
          <div className="dock">
            <div className="title">Case Sealed</div>
            <div className="row">
              <button type="button" className="btn" onClick={restart}>
                Reset Case
              </button>
              <button type="button" className="btn primary" onClick={closeBox}>
                Back to Box
              </button>
            </div>
          </div>
          {confetti.map((c, i) => (
            <i
              key={i}
              className="cf"
              style={
                {
                  left: "50%",
                  top: `calc(50% + ${padDy}px)`,
                  "--dx": `${c.dx}px`,
                  "--dy": `${c.dy}px`,
                  "--r": `${c.r}deg`,
                  transform: `scale(${c.s})`,
                } as CSSProperties
              }
            />
          ))}
        </>
      )}

      {usingFallback && stage === "build" && (
        <div className="note">Preview without asset files — place them in {assetBase}</div>
      )}

      {ghost && (
        <div className="ghost" style={{ left: ghost.x, top: ghost.y, width: DEF_W[ghost.kind] * sBuild }}>
          <img src={sprite(ghost.kind).url} alt="" />
        </div>
      )}
    </div>
  );
}

export function NexoreCasePreview() {
  useTemplateCustomizer();
  return <NexoreCase assetBase="/templates/nexore-case/" />;
}

export default NexoreCase;
