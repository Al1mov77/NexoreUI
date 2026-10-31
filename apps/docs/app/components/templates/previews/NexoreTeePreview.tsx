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

export interface PlacedItem {
  id: number;
  kind: string;
  x: number;
  y: number;
  s: number;
  r: number;
}

export interface NexoreTeeProps {
  assetBase?: string;
  assets?: Partial<Record<keyof typeof FILES, string>>;
  color?: string;
  onColorChange?: (hex: string) => void;
  onSealed?: (result: { color: string; items: PlacedItem[] }) => void;
}

type Stage = "closed" | "open" | "unwrap" | "build" | "press" | "done";
const ORDER: readonly Stage[] = ["closed", "open", "unwrap", "build", "press", "done"];

interface Sprite {
  url: string;
  w: number;
  h: number;
}

const FILES = {
  boxClosed: "nexore-tee-01-box-closed.jpg",
  boxOpen: "nexore-tee-02-box-open.jpg",
  tee: "nexore-tee-03-tee-white.jpg",
  sheet: "nexore-tee-04-patch-sheet.jpg",
  tray: "nexore-tee-05-letters-tray.jpg",
  paper: "nexore-tee-06-paper-texture.jpg",
  bag: "nexore-tee-07-sealed-bag.jpg",
  pad: "nexore-tee-08-press-pad.jpg",
} as const;

const IMG_W = 2576;
const IMG_H = 1438;
const TRAY_CROP = { x: 735, y: 195, w: 1110, h: 790 } as const;
const PAD_DIAM = 705;
const PAD_CY = 685;
const FOLD = { x: 625, y: 245, w: 1255, h: 998 } as const;
const SEAL = { x: 1287, y: 720, r: 166 } as const;

const PATCHES = [
  "smile",
  "bolt",
  "daisy",
  "glitter",
  "cherry",
  "studs",
  "flame",
  "varsityN",
  "rhinestone",
  "tape",
  "pixel",
  "mascot",
] as const;
type Patch = (typeof PATCHES)[number];

const DEF_W: Record<Patch, number> = {
  smile: 62,
  bolt: 40,
  daisy: 66,
  glitter: 64,
  cherry: 60,
  studs: 70,
  flame: 54,
  varsityN: 56,
  rhinestone: 62,
  tape: 92,
  pixel: 58,
  mascot: 80,
};

const LETTER_W = 38;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const COLORS: readonly string[] = [
  "#ffffff",
  "#f3e9d2",
  "#c9b8ff",
  "#ff9ccc",
  "#8ed3ff",
  "#ffe27a",
  "#ffb08a",
  "#a8f0cf",
  "#ff4d4d",
  "#2f4bff",
  "#14142b",
];

const TEE_W = 400;
const MAX_ITEMS = 30;
const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
const isLetter = (k: string): boolean => k.startsWith("L:");

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

function keyCanvas(
  src: CanvasImageSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(sw));
  c.height = Math.max(1, Math.round(sh));
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) throw new Error("Canvas context missing");
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
    if (a > 40) {
      const px = i >> 2;
      const ix = px % c.width;
      const iy = (px / c.width) | 0;
      if (ix < minX) minX = ix;
      if (ix > maxX) maxX = ix;
      if (iy < minY) minY = iy;
      if (iy > maxY) maxY = iy;
    }
  }
  if (maxX < 0) throw new Error("Empty key canvas");
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

function scaleTo(c: HTMLCanvasElement, maxW: number): HTMLCanvasElement {
  if (c.width <= maxW) return c;
  const o = document.createElement("canvas");
  o.width = maxW;
  o.height = Math.round((c.height * maxW) / c.width);
  const x = o.getContext("2d");
  if (x) {
    x.imageSmoothingQuality = "high";
    x.drawImage(c, 0, 0, o.width, o.height);
  }
  return o;
}

function fallbackTee(): HTMLCanvasElement {
  const W = 900;
  const H = 826;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  if (!x) return c;
  x.fillStyle = "#f4f4f6";
  x.strokeStyle = "#d9d9e0";
  x.lineWidth = 6;
  x.lineJoin = "round";
  x.beginPath();
  x.moveTo(300, 20);
  x.quadraticCurveTo(450, 90, 600, 20);
  x.lineTo(880, 190);
  x.lineTo(760, 380);
  x.lineTo(660, 320);
  x.lineTo(660, 806);
  x.lineTo(240, 806);
  x.lineTo(240, 320);
  x.lineTo(140, 380);
  x.lineTo(20, 190);
  x.closePath();
  x.fill();
  x.stroke();
  x.beginPath();
  x.ellipse(450, 36, 150, 48, 0, 0, Math.PI);
  x.stroke();
  return c;
}

function makeTeeBase(img: HTMLImageElement | false | null): HTMLCanvasElement {
  if (img) {
    try {
      const k = img.naturalWidth / IMG_W;
      return scaleTo(keyCanvas(img, 0, 0, IMG_W * k, IMG_H * k), 900);
    } catch {}
  }
  return fallbackTee();
}

function tintTee(base: HTMLCanvasElement, hex: string): string {
  const c = document.createElement("canvas");
  c.width = base.width;
  c.height = base.height;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) return "";
  x.drawImage(base, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height);
  const p = d.data;
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const t = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const ref = 244;
  for (let i = 0; i < p.length; i += 4) {
    if (!p[i + 3]) continue;
    for (let k = 0; k < 3; k++) {
      const pk = p[i + k] ?? 0;
      const tk = t[k] ?? 0;
      p[i + k] = Math.min(255, (tk * pk) / ref);
    }
  }
  x.putImageData(d, 0, 0);
  return c.toDataURL("image/png");
}

function fallbackSprite(kind: Patch): Sprite {
  const labels: Record<Patch, string> = {
    smile: "SMILE",
    bolt: "BOLT",
    daisy: "DAISY",
    glitter: "HEART",
    cherry: "CHERRY",
    studs: "STUD",
    flame: "FLAME",
    varsityN: "N",
    rhinestone: "GEM",
    tape: "TAPE",
    pixel: "PIXEL",
    mascot: "STAR",
  };
  const txt = labels[kind] ?? kind;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400"><rect x="6" y="6" width="88" height="88" rx="20" fill="#1f3fe0"/><text x="50" y="58" font-size="20" font-weight="900" font-family="system-ui,sans-serif" text-anchor="middle" fill="#f6ecd6">${txt}</text></svg>`;
  return { url: "data:image/svg+xml;utf8," + encodeURIComponent(svg), w: 100, h: 100 };
}

function buildPatches(sheet: HTMLImageElement | false | null): Record<Patch, Sprite> {
  const out = {} as Record<Patch, Sprite>;
  PATCHES.forEach((k, i) => {
    if (sheet) {
      try {
        const f = sheet.naturalWidth / IMG_W;
        const cw = (IMG_W / 4) * f;
        const ch = (IMG_H / 3) * f;
        const c = keyCanvas(sheet, (i % 4) * cw, Math.floor(i / 4) * ch, cw, ch);
        out[k] = { url: c.toDataURL("image/png"), w: c.width, h: c.height };
        return;
      } catch {}
    }
    out[k] = fallbackSprite(k);
  });
  return out;
}

function makeLetter(ch: string): Sprite {
  const c = document.createElement("canvas");
  c.width = 260;
  c.height = 300;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) return { url: "", w: 260, h: 300 };
  x.font = '400 210px "Alfa Slab One","Arial Black",Impact,sans-serif';
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.lineJoin = "round";
  x.strokeStyle = "#f6ecd6";
  x.lineWidth = 40;
  x.strokeText(ch, 130, 160);
  x.fillStyle = "#1f3fe0";
  x.fillText(ch, 130, 160);
  x.globalCompositeOperation = "source-atop";
  for (let i = 0; i < 1600; i++) {
    x.fillStyle = Math.random() < 0.5 ? "rgba(120,150,255,.38)" : "rgba(10,30,150,.28)";
    x.beginPath();
    x.arc(Math.random() * 260, Math.random() * 300, 1 + Math.random() * 2.2, 0, 7);
    x.fill();
  }
  const d = x.getImageData(0, 0, 260, 300).data;
  let a = 260;
  let b = 300;
  let e = -1;
  let f = -1;
  for (let i = 3; i < d.length; i += 4) {
    if ((d[i] ?? 0) > 40) {
      const px = (i - 3) >> 2;
      const ix = px % 260;
      const iy = (px / 260) | 0;
      if (ix < a) a = ix;
      if (ix > e) e = ix;
      if (iy < b) b = iy;
      if (iy > f) f = iy;
    }
  }
  if (e < 0) return { url: c.toDataURL(), w: 260, h: 300 };
  const o = document.createElement("canvas");
  o.width = e - a + 1;
  o.height = f - b + 1;
  const oCtx = o.getContext("2d");
  if (oCtx) {
    oCtx.drawImage(c, a, b, o.width, o.height, 0, 0, o.width, o.height);
  }
  return { url: o.toDataURL("image/png"), w: o.width, h: o.height };
}

const GOLD =
  '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".5" stop-color="#e2b64a"/><stop offset="1" stop-color="#a97b1f"/></linearGradient></defs>';
const STAR5 = Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5;
  const r = i % 2 ? 21 : 48;
  return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
}).join(" ");

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Baloo+2:wght@700;800&family=Nunito:wght@700;800&display=swap');
.nt{--blue:#1f3fe0;--cream:#f6ecd6;position:relative;width:100%;height:100%;min-height:560px;overflow:hidden;
 font-family:'Nunito',system-ui,sans-serif;color:var(--blue);-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;
 background:radial-gradient(120% 90% at 15% 0%,#3fd33f 0%,#14c014 45%,#03ad03 100%)}
.nt *{box-sizing:border-box}
.nt{transition:background-color .6s}
.nt.done{background:#04fd02}
.nt.closed,.nt.open{background:#08d91e}
.nt .scene{position:absolute;inset:0;background-size:cover;background-position:center;display:grid;place-items:center;
 transition:opacity .75s ease,transform .95s cubic-bezier(.2,.8,.2,1)}
.nt .s-before{opacity:0;transform:scale(.93);pointer-events:none}
.nt .s-on{opacity:1;transform:none}
.nt .s-after{opacity:0;transform:translateY(-6%) scale(1.1) rotate(-1deg);pointer-events:none}
.nt .fbox{width:min(46vw,260px);aspect-ratio:.7;background:var(--cream);border:2px solid #d8c9a4;border-radius:6px;box-shadow:0 22px 30px rgba(0,60,0,.35);
 display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-family:'Baloo 2',sans-serif;font-weight:800;color:var(--blue)}
.nt .fbox b{font-size:clamp(30px,8vw,48px);line-height:.9;transform:rotate(-4deg)}
.nt .fpad{width:min(70vw,360px);aspect-ratio:1;border-radius:50%;background:#f1f0f6;box-shadow:inset 0 0 0 26px #e6e4ee,0 20px 30px rgba(0,60,0,.3)}
.nt .top{position:absolute;left:0;right:0;top:0;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;z-index:6;pointer-events:none;transition:opacity .4s}
.nt .pill{background:var(--cream);border:2px solid var(--blue);border-radius:99px;padding:3px 13px;font:800 15px 'Baloo 2',sans-serif;line-height:1.5;white-space:nowrap}
.nt .cta{position:absolute;left:50%;bottom:9%;transform:translateX(-50%);z-index:7;white-space:nowrap;background:var(--blue);color:#fff;border:3px solid #fff;
 border-radius:99px;padding:12px 26px;font:800 18px 'Baloo 2',sans-serif;box-shadow:0 8px 0 rgba(0,40,120,.35);cursor:pointer;animation:nt-bob 1.6s ease-in-out infinite}
.nt .cta:active{transform:translateX(-50%) translateY(4px);box-shadow:0 3px 0 rgba(0,40,120,.35)}
@keyframes nt-bob{50%{margin-bottom:8px}}
.nt .holder{position:absolute;left:50%;top:50%;transform-origin:center;transition:transform 1.15s cubic-bezier(.65,0,.25,1),opacity .55s ease;z-index:3}
.nt .tee-inner{position:relative;width:100%;height:100%;animation:nt-enter .95s cubic-bezier(.2,1.15,.3,1) both;filter:drop-shadow(0 14px 12px rgba(0,60,0,.38))}
.nt.press .tee-inner.stamp{animation:nt-stamp .55s ease-out both}
@keyframes nt-enter{from{transform:translateY(95vh) rotate(-12deg)}to{transform:none}}
@keyframes nt-stamp{0%{transform:scale(1)}40%{transform:scale(.93)}100%{transform:scale(1)}}
.nt .tee-img{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}
.nt .layer{position:absolute;inset:0;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
.nt .it{position:absolute;touch-action:none;cursor:grab}
.nt .it img{width:100%;display:block;pointer-events:none;animation:nt-pop .38s cubic-bezier(.3,1.7,.5,1);filter:drop-shadow(0 1.5px 1.5px rgba(0,0,0,.3))}
.nt .it.sel{outline:2px dashed var(--blue);outline-offset:4px;border-radius:4px}
@keyframes nt-pop{from{transform:scale(.2) rotate(-20deg);opacity:0}}
.nt .scan{pointer-events:none;mix-blend-mode:screen;opacity:0;transition:opacity .4s;
 background:linear-gradient(180deg,transparent calc(var(--p,0)*100% - 14%),rgba(206,170,255,.95) calc(var(--p,0)*100%),transparent calc(var(--p,0)*100% + 14%))}
.nt.press .scan{opacity:1}
.nt .ring{position:absolute;left:50%;border-radius:50%;transform:translate(-50%,-50%);z-index:2;opacity:0;transition:opacity .6s;pointer-events:none;
 box-shadow:0 0 calc(30px + var(--p,0)*120px) calc(6px + var(--p,0)*38px) rgba(167,110,255,calc(.15 + var(--p,0)*.55))}
.nt.press .ring{opacity:1}
.nt .bagfold{position:absolute;z-index:4;overflow:hidden;border-radius:3.5%;pointer-events:none;opacity:0;transform:scale(1.12);
 animation:nt-fold .9s .45s cubic-bezier(.2,.9,.3,1) both}
@keyframes nt-fold{to{opacity:1;transform:none}}
.nt .bagtint{position:absolute;z-index:4;border-radius:3.5%;pointer-events:none;mix-blend-mode:multiply;opacity:0;animation:nt-tintin .9s .45s ease both}
@keyframes nt-tintin{to{opacity:1}}
.nt .bagseal{position:absolute;z-index:5;border-radius:50%;pointer-events:none;opacity:0;animation:nt-tintin .9s .45s ease both}
.nt .bagfold .it{cursor:default}
.nt .cf{position:absolute;width:26px;height:26px;z-index:8;pointer-events:none;background:url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>${GOLD}<polygon points='${STAR5}' fill='url(#g)' stroke='#a97b1f' stroke-width='3' stroke-linejoin='round'/></svg>`)}") center/contain no-repeat;
 animation:nt-burst 1.5s cubic-bezier(.1,.7,.3,1) forwards}
@keyframes nt-burst{from{transform:translate(0,0) scale(.3) rotate(0);opacity:1}to{transform:translate(var(--dx),var(--dy)) scale(1.1) rotate(var(--r));opacity:0}}
.nt .panel{position:absolute;left:50%;transform:translateX(-50%);bottom:10px;width:min(560px,calc(100% - 20px));height:236px;z-index:6;border:2px solid var(--blue);
 border-radius:22px;background-color:var(--cream);background-size:cover;background-blend-mode:multiply;padding:10px 12px;display:flex;flex-direction:column;gap:8px;
 box-shadow:0 10px 0 rgba(0,40,120,.25);animation:nt-rise .6s .2s cubic-bezier(.2,1.1,.3,1) both}
@keyframes nt-rise{from{transform:translateX(-50%) translateY(120%)}}
.nt .row{display:flex;align-items:center;gap:8px}
.nt .lbl{font:800 11px 'Nunito',sans-serif;opacity:.75;letter-spacing:.04em;text-transform:uppercase}
.nt .sw{flex:0 0 auto;width:30px;height:30px;border-radius:50%;border:2px solid var(--blue);cursor:pointer;padding:0}
.nt .sw.on{box-shadow:0 0 0 3px var(--cream),0 0 0 5px var(--blue)}
.nt .colors{display:flex;gap:9px;overflow-x:auto;padding:5px 6px;scrollbar-width:none;touch-action:pan-x;flex:1}
.nt .shelf{display:flex;gap:8px;overflow-x:auto;padding:4px 2px;scrollbar-width:none;touch-action:pan-x;height:78px;align-items:center}
.nt .tile{flex:0 0 auto;width:66px;height:66px;border-radius:15px;background:rgba(255,255,255,.7);border:2px solid var(--blue);display:grid;place-items:center;cursor:grab;touch-action:pan-x;overflow:hidden;position:relative}
.nt .tile img{max-width:78%;max-height:78%;pointer-events:none}
.nt .tile.folder{width:98px;background-color:#111;background-repeat:no-repeat;cursor:pointer}
.nt .tile.folder i,.nt .tile.back i{position:absolute;left:0;right:0;bottom:0;background:var(--cream);font:800 10px 'Nunito';text-align:center;letter-spacing:.08em;border-top:2px solid var(--blue);font-style:normal}
.nt .tile.back{width:70px;cursor:pointer;font:800 26px 'Baloo 2',sans-serif;background:var(--cream)}
.nt .btn{white-space:nowrap;border:2px solid var(--blue);background:#fff;color:var(--blue);border-radius:13px;font:800 15px 'Nunito',sans-serif;height:42px;min-width:42px;padding:0 12px;cursor:pointer}
.nt .btn.primary{background:var(--blue);color:#fff;box-shadow:0 4px 0 rgba(0,30,110,.45)}
.nt .btn:disabled{opacity:.4;cursor:default;box-shadow:none}
.nt .btn:active:not(:disabled){transform:translateY(2px)}
.nt .grow{flex:1}
.nt .word{width:110px;height:42px;border:2px solid var(--blue);border-radius:13px;padding:0 10px;font:800 15px 'Nunito',sans-serif;color:var(--blue);background:#fff;text-transform:uppercase;min-width:0}
.nt .ghost{position:absolute;z-index:50;pointer-events:none;transform:translate(-50%,-50%) scale(1.08);filter:drop-shadow(0 10px 8px rgba(0,0,0,.3))}
.nt .ghost img{width:100%;height:auto;max-width:none;display:block}
.nt .dock{position:absolute;left:50%;transform:translateX(-50%);bottom:26px;z-index:7;width:min(420px,calc(100% - 28px));text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center}
.nt .bar{width:100%;height:16px;border-radius:99px;border:2px solid var(--blue);background:var(--cream);overflow:hidden}
.nt .bar i{display:block;height:100%;width:calc(var(--p,0)*100%);background:linear-gradient(90deg,#a76eff,#6f8dff)}
.nt .title{font:800 28px 'Baloo 2',sans-serif;background:var(--cream);border:2px solid var(--blue);border-radius:99px;padding:2px 20px;animation:nt-pop .6s cubic-bezier(.3,1.7,.5,1);white-space:nowrap}
.nt .note{position:absolute;left:10px;right:10px;top:58px;z-index:9;background:#fff;border:2px solid var(--blue);border-radius:12px;padding:6px 10px;font:700 12px 'Nunito';text-align:center}
`;

export function NexoreTee({
  assetBase = "/templates/nexore-tee/",
  assets,
  color: colorProp,
  onColorChange,
  onSealed,
}: NexoreTeeProps) {
  const url = (key: keyof typeof FILES): string =>
    assets?.[key] || assetBase.replace(/\/?$/, "/") + FILES[key];

  const rootRef = useRef<HTMLDivElement>(null);
  const teeRef = useRef<HTMLDivElement>(null);
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
  const [color, setColorState] = useState(colorProp || COLORS[0] || "#ffffff");
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [ghost, setGhost] = useState<{ kind: string; x: number; y: number } | null>(null);
  const [pct, setPct] = useState(0);
  const [stamp, setStamp] = useState(false);
  const [mode, setMode] = useState<"patches" | "letters">("patches");
  const [word, setWord] = useState("");
  const [letters, setLetters] = useState<Record<string, Sprite>>({});

  const idRef = useRef(1);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const raf = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (colorProp) setColorState(colorProp);
  }, [colorProp]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      timers.current.forEach(clearTimeout);
    },
    []
  );

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const setColor = (hex: string) => {
    setColorState(hex);
    onColorChange?.(hex);
  };

  const imgBoxClosed = useImg(url("boxClosed"));
  const imgBoxOpen = useImg(url("boxOpen"));
  const imgPad = useImg(url("pad"));
  const imgBag = useImg(url("bag"));
  const imgTray = useImg(url("tray"));
  const imgPaper = useImg(url("paper"));
  const imgTee = useImg(url("tee"), true);
  const imgSheet = useImg(url("sheet"), true);

  const ready = imgTee !== null && imgSheet !== null;
  const base = useMemo(() => (ready ? makeTeeBase(imgTee) : null), [ready, imgTee]);
  const patches = useMemo(() => (ready ? buildPatches(imgSheet) : null), [ready, imgSheet]);
  const teeUrl = useMemo(() => (base ? tintTee(base, color) : ""), [base, color]);
  const usingFallback = ready && (imgTee === false || imgSheet === false);

  useEffect(() => {
    const gen = () => {
      const m: Record<string, Sprite> = {};
      LETTERS.forEach((l) => (m[l] = makeLetter(l)));
      setLetters(m);
    };
    gen();
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.load('210px "Alfa Slab One"').then(gen).catch(() => {});
    }
  }, []);

  const TEE_H = base ? Math.round((TEE_W * base.height) / base.width) : 367;

  const PANEL = 246;
  const TOP = 56;
  const sBuild = clamp(Math.min((vh - TOP - PANEL - 56) / TEE_H, (vw - 24) / TEE_W), 0.3, 2.4);
  const cover = Math.max(vw / IMG_W, vh / IMG_H);
  const padD = PAD_DIAM * cover;
  const padDy = (PAD_CY - IMG_H / 2) * cover;
  const sPress = Math.min((padD * 0.8) / TEE_W, (vw - 24) / TEE_W, (vh * 0.62) / TEE_H);

  const idx = ORDER.indexOf(stage);
  const teeVisible = idx >= 3;
  const inPress = idx >= 4;
  const holderT = inPress
    ? `translate(-50%,-50%) translate(0px,${padDy}px) scale(${sPress})`
    : `translate(-50%,-50%) translate(0px,${(TOP - PANEL) / 2 - 6}px) scale(${sBuild})`;

  const scene = (from: number, to: number) =>
    "scene " + (idx >= to ? "s-after" : idx >= from ? "s-on" : "s-before");

  const openBox = () => setStage("open");
  const unwrap = () => {
    setStage("unwrap");
    later(() => setStage("build"), 750);
  };

  const addItem = useCallback(
    (kind: string, x: number, y: number) => {
      if (itemsRef.current.length >= MAX_ITEMS) return;
      const id = idRef.current++;
      const it: PlacedItem = {
        id,
        kind,
        x: clamp(x, 10, TEE_W - 10),
        y: clamp(y, 10, TEE_H - 10),
        s: 1,
        r: Math.round((Math.random() - 0.5) * 20),
      };
      setItems((l) => [...l, it]);
      setSel(id);
    },
    [TEE_H]
  );

  const addWord = () => {
    const w = word.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8);
    if (!w) return;
    const step = LETTER_W * 0.98;
    const x0 = TEE_W / 2 - ((w.length - 1) * step) / 2;
    const room = MAX_ITEMS - itemsRef.current.length;
    w.split("").slice(0, room).forEach((ch, i) => {
      const id = idRef.current++;
      setItems((l) => [...l, { id, kind: "L:" + ch, x: x0 + i * step, y: TEE_H * 0.5, s: 1, r: 0 }]);
    });
    setWord("");
  };

  const toRootLocal = (clientX: number, clientY: number): { x: number; y: number } => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return { x: clientX, y: clientY };
    return { x: clientX - r.left, y: clientY - r.top };
  };

  const onShelfDown = (e: ReactPointerEvent, kind: string) => {
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
      const local = toRootLocal(ev.clientX, ev.clientY);
      setGhost({ kind, x: local.x, y: local.y });
    };
    const up = (ev: PointerEvent) => {
      cleanup();
      setGhost(null);
      const rect = teeRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (started) {
        const inside =
          ev.clientX >= rect.left &&
          ev.clientX <= rect.right &&
          ev.clientY >= rect.top &&
          ev.clientY <= rect.bottom;
        if (inside) {
          const k = rect.width / TEE_W;
          addItem(kind, (ev.clientX - rect.left) / k, (ev.clientY - rect.top) / k);
        }
      } else {
        addItem(
          kind,
          TEE_W / 2 + (Math.random() - 0.5) * 110,
          TEE_H * 0.45 + (Math.random() - 0.5) * 90
        );
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
    const rect = teeRef.current?.getBoundingClientRect();
    if (!rect) return;
    const k = rect.width / TEE_W;
    const it = itemsRef.current.find((i) => i.id === id);
    if (!it) return;
    const ox = it.x - (e.clientX - rect.left) / k;
    const oy = it.y - (e.clientY - rect.top) / k;
    const mv = (ev: PointerEvent) => {
      const nx = clamp((ev.clientX - rect.left) / k + ox, 0, TEE_W);
      const ny = clamp((ev.clientY - rect.top) / k + oy, 0, TEE_H);
      setItems((l) => l.map((item) => (item.id === id ? { ...item, x: nx, y: ny } : item)));
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
    if (it && items.length < MAX_ITEMS) {
      const id = idRef.current++;
      setItems((l) => [
        ...l,
        { ...it, id, x: clamp(it.x + 14, 0, TEE_W), y: clamp(it.y + 14, 0, TEE_H) },
      ]);
      setSel(id);
    }
  };

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        sel !== null &&
        stage === "build" &&
        (e.target as HTMLElement)?.tagName !== "INPUT"
      ) {
        removeSel();
      }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [sel, stage, removeSel]);

  const startPress = () => {
    if (!items.length) return;
    setSel(null);
    setPct(0);
    setStamp(false);
    setStage("press");
    const t0 = performance.now() + 1200;
    const dur = 3200;
    const tick = (t: number) => {
      const p = clamp((t - t0) / dur, 0, 1);
      rootRef.current?.style.setProperty("--p", String(p));
      setPct(Math.round(p * 100));
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setStamp(true);
        later(() => {
          setStage("done");
          onSealed?.({ color, items: itemsRef.current });
        }, 800);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const reset = (to: Stage) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    cancelAnimationFrame(raf.current);
    setItems([]);
    setSel(null);
    setStamp(false);
    setMode("patches");
    rootRef.current?.style.setProperty("--p", "0");
    setStage(to);
  };

  const confetti = useMemo(
    () =>
      Array.from({ length: 18 }, () => {
        const a = Math.random() * Math.PI * 2;
        const d = 110 + Math.random() * 130;
        return {
          dx: Math.cos(a) * d,
          dy: Math.sin(a) * d,
          r: (Math.random() - 0.5) * 540,
          s: 0.7 + Math.random() * 0.8,
        };
      }),
    [stage === "done"]
  );

  const selItem = items.find((i) => i.id === sel);
  const sprite = (k: string): Sprite | null =>
    isLetter(k)
      ? letters[k.slice(2)] ?? null
      : patches?.[k as Patch] ?? fallbackSprite(k as Patch);
  const widthOf = (k: string) => (isLetter(k) ? LETTER_W : DEF_W[k as Patch] ?? 56);

  const sBox = Math.min(cover, (vw - 20) / 700);
  const sBag = Math.min(cover, (vw - 20) / 1560);
  const bg = (
    img: HTMLImageElement | null | false,
    key: keyof typeof FILES,
    sc = cover
  ): React.CSSProperties | undefined => {
    if (!img) return undefined;
    const st: React.CSSProperties = { backgroundImage: `url(${url(key)})` };
    if (sc < cover - 1e-6) {
      const w = IMG_W * sc;
      const h = IMG_H * sc;
      const feather =
        "linear-gradient(to right,transparent,#000 7%,#000 93%,transparent),linear-gradient(to bottom,transparent,#000 7%,#000 93%,transparent)";
      Object.assign(st, {
        inset: "auto",
        left: (vw - w) / 2,
        top: (vh - h) / 2,
        width: w,
        height: h,
        backgroundSize: "100% 100%",
        WebkitMaskImage: feather,
        maskImage: feather,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      });
    }
    return st;
  };

  const offX = (vw - IMG_W * sBag) / 2;
  const offY = (vh - IMG_H * sBag) / 2;
  const fold = {
    left: offX + FOLD.x * sBag,
    top: offY + FOLD.y * sBag,
    width: FOLD.w * sBag,
    height: FOLD.h * sBag,
  };
  const BODY = 0.62;
  const foldK = fold.width / (BODY * TEE_W);

  return (
    <div
      ref={rootRef}
      className={`nt ${stage}`}
      style={{ "--p": 0 } as CSSProperties}
      onPointerDown={(e) => {
        if (!(e.target as HTMLElement).closest(".it,.panel")) setSel(null);
      }}
    >
      <style>{CSS}</style>

      <div
        className={scene(0, 1)}
        style={bg(imgBoxClosed, "boxClosed", sBox)}
        onClick={stage === "closed" ? openBox : undefined}
      >
        {imgBoxClosed === false && (
          <div className="fbox">
            <b>NEXORE</b>
            <span style={{ font: "800 22px 'Baloo 2'" }}>TEE</span>
          </div>
        )}
      </div>
      <div
        className={scene(1, 3)}
        style={bg(imgBoxOpen, "boxOpen", sBox)}
        onClick={stage === "open" ? unwrap : undefined}
      >
        {imgBoxOpen === false && (
          <div className="fbox" style={{ background: "linear-gradient(160deg,#cfe8f7,#9fcbe8)" }} />
        )}
      </div>
      <div className={scene(4, 5)} style={bg(imgPad, "pad")}>
        {imgPad === false && <div className="fpad" style={{ marginTop: padDy * 2 }} />}
      </div>
      <div className={scene(5, 99)} style={bg(imgBag, "bag", sBag)} />

      <div
        className="ring"
        style={{ width: padD * 0.78, height: padD * 0.78, top: `calc(50% + ${padDy}px)` }}
      />

      <div className="top" style={{ opacity: idx >= 3 ? 1 : 0 }}>
        <span className="pill">NEXORE TEE</span>
        <span className="pill">
          {stage === "build"
            ? `${items.length} item${items.length === 1 ? "" : "s"}`
            : stage === "press"
            ? "pressing"
            : "ready to ship"}
        </span>
      </div>

      {stage === "closed" && (
        <button className="cta" onClick={openBox}>
          Open the box
        </button>
      )}
      {stage === "open" && (
        <button className="cta" onClick={unwrap}>
          Take out the tee
        </button>
      )}

      {teeVisible && ready && (
        <div
          className="holder"
          style={{
            width: TEE_W,
            height: TEE_H,
            transform: holderT,
            opacity: stage === "done" ? 0 : 1,
            pointerEvents: stage === "done" ? "none" : undefined,
          }}
        >
          <div className={"tee-inner" + (stamp ? " stamp" : "")}>
            <div ref={teeRef} style={{ position: "absolute", inset: 0 }}>
              <img className="tee-img" src={teeUrl} alt="" draggable={false} />
              <div
                className="layer"
                style={{ WebkitMaskImage: `url(${teeUrl})`, maskImage: `url(${teeUrl})` }}
              >
                {items.map((it) => {
                  const sp = sprite(it.kind);
                  if (!sp) return null;
                  const w = widthOf(it.kind) * it.s;
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
                style={{ WebkitMaskImage: `url(${teeUrl})`, maskImage: `url(${teeUrl})` }}
              />
            </div>
          </div>
        </div>
      )}

      {stage === "done" && ready && (
        <>
          <div className="bagtint" style={{ ...fold, background: color }} />
          <div className="bagfold" style={fold}>
            {items.map((it) => {
              const sp = sprite(it.kind);
              if (!sp) return null;
              const bx = (it.x - ((1 - BODY) / 2) * TEE_W) / (BODY * TEE_W);
              const by = it.y / TEE_H;
              return (
                <div
                  key={it.id}
                  className="it"
                  style={{
                    left: fold.width * (0.02 + 0.96 * bx),
                    top: fold.height * (0.12 + 0.8 * by),
                    width: widthOf(it.kind) * it.s * foldK * 0.82,
                    transform: `translate(-50%,-50%) rotate(${it.r}deg)`,
                  }}
                >
                  <img src={sp.url} alt="" draggable={false} style={{ animation: "none" }} />
                </div>
              );
            })}
          </div>
          {imgBag && (
            <div
              className="bagseal"
              style={{
                left: offX + SEAL.x * sBag - SEAL.r * sBag,
                top: offY + SEAL.y * sBag - SEAL.r * sBag,
                width: SEAL.r * 2 * sBag,
                height: SEAL.r * 2 * sBag,
                backgroundImage: `url(${url("bag")})`,
                backgroundSize: `${IMG_W * sBag}px ${IMG_H * sBag}px`,
                backgroundPosition: `${-(SEAL.x - SEAL.r) * sBag}px ${-(SEAL.y - SEAL.r) * sBag}px`,
              }}
            />
          )}
        </>
      )}

      {stage === "build" && (
        <div
          className="panel"
          style={imgPaper ? { backgroundImage: `url(${url("paper")})` } : undefined}
        >
          <div className="row">
            <span className="lbl">color</span>
            <div className="colors">
              {COLORS.map((c) => (
                <button
                  key={c}
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
                  value={color.length === 7 ? color : "#ffffff"}
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
            {mode === "patches" ? (
              <>
                <div
                  className="tile folder"
                  onClick={() => setMode("letters")}
                  style={
                    imgTray
                      ? {
                          backgroundImage: `url(${url("tray")})`,
                          backgroundSize: `${(IMG_W / TRAY_CROP.w) * 98}px auto`,
                          backgroundPosition: `-${(TRAY_CROP.x * 98) / TRAY_CROP.w}px -${
                            (TRAY_CROP.y * 98) / TRAY_CROP.w
                          }px`,
                        }
                      : { color: "#fff", fontFamily: "Alfa Slab One,serif", fontSize: 30 }
                  }
                >
                  {!imgTray && "ABC"}
                  <i>LETTERS &gt;</i>
                </div>
                {PATCHES.map((k) => (
                  <div key={k} className="tile" onPointerDown={(e) => onShelfDown(e, k)}>
                    <img src={(patches?.[k] ?? fallbackSprite(k)).url} alt="" draggable={false} />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div
                  className="tile back"
                  onClick={() => setMode("patches")}
                  title="Back to patches"
                >
                  <span>&lt;</span>
                  <i>PATCHES</i>
                </div>
                {LETTERS.map((l) => (
                  <div key={l} className="tile" onPointerDown={(e) => onShelfDown(e, "L:" + l)}>
                    {letters[l] && <img src={letters[l].url} alt={l} draggable={false} />}
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="row">
            {selItem ? (
              <>
                <button
                  className="btn"
                  onClick={() =>
                    patchSel((i) => ({ ...i, s: clamp(i.s * 0.87, 0.35, 3) }))
                  }
                  aria-label="Smaller"
                >
                  -
                </button>
                <button
                  className="btn"
                  onClick={() =>
                    patchSel((i) => ({ ...i, s: clamp(i.s * 1.15, 0.35, 3) }))
                  }
                  aria-label="Bigger"
                >
                  +
                </button>
                <button
                  className="btn"
                  onClick={() => patchSel((i) => ({ ...i, r: i.r + 20 }))}
                  aria-label="Rotate"
                >
                  &#8635;
                </button>
                <button className="btn" onClick={dupSel} aria-label="Duplicate">
                  &#10697;
                </button>
                <button className="btn" onClick={removeSel} aria-label="Delete">
                  &#128465;
                </button>
              </>
            ) : mode === "letters" ? (
              <>
                <input
                  className="word"
                  value={word}
                  maxLength={8}
                  placeholder="Type a word"
                  onChange={(e) => setWord(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addWord()}
                />
                <button className="btn" onClick={addWord} disabled={!word.trim()}>
                  Add
                </button>
              </>
            ) : (
              <span className="lbl grow">
                {items.length ? "tap an item to edit" : "drag items onto the tee"}
              </span>
            )}
            <span className="grow" />
            <button className="btn primary" disabled={!items.length} onClick={startPress}>
              Press it
            </button>
          </div>
        </div>
      )}

      {stage === "press" && (
        <div className="dock">
          <div className="bar">
            <i />
          </div>
          <div className="pill">Pressing... {pct}%</div>
        </div>
      )}

      {stage === "done" && (
        <>
          <div className="dock">
            <div className="title">Pressed &amp; sealed</div>
            <div className="row">
              <button className="btn" onClick={() => reset("build")}>
                Make another
              </button>
              <button className="btn primary" onClick={() => reset("closed")}>
                Back to the box
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
                  top: "46%",
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
        <div className="note">Preview without asset files - put them in {assetBase}</div>
      )}

      {ghost && (() => {
        const sp = sprite(ghost.kind);
        return sp ? (
          <div
            className="ghost"
            style={{ left: ghost.x, top: ghost.y, width: widthOf(ghost.kind) * sBuild }}
          >
            <img src={sp.url} alt="" />
          </div>
        ) : null;
      })()}
    </div>
  );
}

export function NexoreTeePreview() {
  useTemplateCustomizer();
  return <NexoreTee assetBase="/templates/nexore-tee/" />;
}

export default NexoreTee;
