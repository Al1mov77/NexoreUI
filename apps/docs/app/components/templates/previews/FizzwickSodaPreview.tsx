"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

const FONT_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;700&display=swap";

const ASSET_BASE = "/templates/fizzwick";
const ENGINE_REV = 5;

export type Flavor = {
  id: string;
  name: string;
  tag: string;
  text: string;
  color: string;
  dark: string;
  xs: number;
  wrap: string;
  small: string;
  mascot: string;
  splash: string;
  fx: string[];
};

export const FLAVORS: Flavor[] = [
  {
    id: "cherry",
    name: "Cherry Blast",
    tag: "Dark, juicy, loud",
    text: "Pressed cherries and a sharp fizz that wakes everything up.",
    color: "#d3122a",
    dark: "#4a0008",
    xs: 1,
    wrap: `${ASSET_BASE}/wrap-cherry.webp`,
    small: `${ASSET_BASE}/can-cherry-s.webp`,
    mascot: `${ASSET_BASE}/mascot-cherry.webp`,
    splash: `${ASSET_BASE}/splash-cherry.webp`,
    fx: Array.from({ length: 6 }, (_, i) => `${ASSET_BASE}/fx-cherry-${i}.webp`),
  },
  {
    id: "lime",
    name: "Lime Zap",
    tag: "Sharp and electric",
    text: "Fresh lime zest with a bright, clean sparkle.",
    color: "#4fa300",
    dark: "#173300",
    xs: 1,
    wrap: `${ASSET_BASE}/wrap-lime.webp`,
    small: `${ASSET_BASE}/can-lime-s.webp`,
    mascot: `${ASSET_BASE}/mascot-lime.webp`,
    splash: `${ASSET_BASE}/splash-lime.webp`,
    fx: Array.from({ length: 5 }, (_, i) => `${ASSET_BASE}/fx-lime-${i}.webp`),
  },
  {
    id: "orange",
    name: "Orange Rush",
    tag: "Sunny and sweet",
    text: "Sweet orange juice poured over crushed ice.",
    color: "#f06d00",
    dark: "#5a2200",
    xs: 1,
    wrap: `${ASSET_BASE}/wrap-orange.webp`,
    small: `${ASSET_BASE}/can-orange-s.webp`,
    mascot: `${ASSET_BASE}/mascot-orange.webp`,
    splash: `${ASSET_BASE}/splash-orange.webp`,
    fx: Array.from({ length: 5 }, (_, i) => `${ASSET_BASE}/fx-orange-${i}.webp`),
  },
  {
    id: "lemon",
    name: "Lemon Pop",
    tag: "Tart with a wink",
    text: "Sunny lemons, a little sour, a lot of bubbles.",
    color: "#e6b800",
    dark: "#5a4300",
    xs: 1,
    wrap: `${ASSET_BASE}/wrap-lemon.webp`,
    small: `${ASSET_BASE}/can-lemon-s.webp`,
    mascot: `${ASSET_BASE}/mascot-lemon.webp`,
    splash: `${ASSET_BASE}/splash-lemon.webp`,
    fx: Array.from({ length: 5 }, (_, i) => `${ASSET_BASE}/fx-lemon-${i}.webp`),
  },
  {
    id: "grape",
    name: "Grape Fizz",
    tag: "Deep and bubbly",
    text: "Concord-style grape with a velvet finish.",
    color: "#7a35c4",
    dark: "#240a45",
    xs: 1,
    wrap: `${ASSET_BASE}/wrap-grape.webp`,
    small: `${ASSET_BASE}/can-grape-s.webp`,
    mascot: `${ASSET_BASE}/mascot-grape.webp`,
    splash: `${ASSET_BASE}/splash-grape.webp`,
    fx: Array.from({ length: 3 }, (_, i) => `${ASSET_BASE}/fx-grape-${i}.webp`),
  },
  {
    id: "blueberry",
    name: "Blueberry Wave",
    tag: "Cool and smooth",
    text: "Wild blueberries riding a wave of cold bubbles.",
    color: "#2a50d8",
    dark: "#0a1a5a",
    xs: 0.82,
    wrap: `${ASSET_BASE}/wrap-blueberry.webp`,
    small: `${ASSET_BASE}/can-blueberry-s.webp`,
    mascot: `${ASSET_BASE}/mascot-blueberry.webp`,
    splash: `${ASSET_BASE}/splash-blueberry.webp`,
    fx: Array.from({ length: 4 }, (_, i) => `${ASSET_BASE}/fx-blueberry-${i}.webp`),
  },
];

const N = FLAVORS.length;
const SINGLE = 2.49;
const PACK = 4.99;
const LOGO_SRC = `${ASSET_BASE}/logo.png`;
const BG_SRC = `${ASSET_BASE}/bg.webp`;
const BOX_SRC = `${ASSET_BASE}/box.webp`;

const FAQS: ReadonlyArray<readonly [string, string]> = [
  [
    "What makes Fizzwick different from regular soda?",
    "Every 250 ml can blends cold-pressed fruit juice, carbonated mountain spring water, and a touch of organic cane sugar. Each can has 90 kcal and zero artificial sweeteners or high-fructose corn syrup.",
  ],
  [
    "How does the custom 3-pack crate work?",
    "Pick any three cans across all six flavors in our box builder, repeats welcome. A custom 3-pack crate is $4.99 instead of $7.47 for three single cans, saving you $2.48 on every box.",
  ],
  [
    "Are the cans recyclable and BPA-free?",
    "Yes. Every Fizzwick can and pull-tab is crafted from 100% infinitely recyclable aluminum with a BPA-free food-grade liner that keeps the carbonation crisp and protects the fresh fruit aroma.",
  ],
  [
    "How cold should I serve Fizzwick?",
    "Chill your cans to 3°C–5°C (38°F–41°F) before opening. Cold temperatures keep the fine carbonation locked in the liquid so the pressed fruit aromatics pop the moment you crack the tab.",
  ],
  [
    "Where do you ship and how fast do orders arrive?",
    "We ship chilled 3-packs and 12-can cases nationwide in heavy-duty recyclable cardboard carriers. Orders placed before 2 PM dispatch the same day and arrive within 2–3 business days.",
  ],
];

const money = (n: number) => `$${n.toFixed(2)}`;
const css = (v: Record<string, string | number>) => v as CSSProperties;
const ease = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pad = (n: number) => String(n).padStart(2, "0");
const backOut = (t: number) => {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

function findScroller(el: HTMLElement | null): HTMLElement | null {
  let cur = el?.parentElement ?? null;
  while (cur) {
    const st = window.getComputedStyle(cur);
    if (/(auto|scroll|overlay)/.test(st.overflowY)) {
      if (cur.tagName !== "HTML" && cur.tagName !== "BODY") return cur;
      if (cur.scrollHeight > cur.clientHeight + 2) return cur;
    }
    cur = cur.parentElement;
  }
  return null;
}

class SoundSynth {
  private ctx: AudioContext | null = null;
  private nbuf: AudioBuffer | null = null;
  on = false;

  private A() {
    return this.on && this.ctx ? this.ctx : null;
  }

  private noise(c: AudioContext) {
    if (!this.nbuf) {
      this.nbuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const d = this.nbuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = c.createBufferSource();
    s.buffer = this.nbuf;
    s.loop = true;
    return s;
  }

  private env(c: AudioContext, peak: number, dur: number, attack = 0.005) {
    const g = c.createGain();
    const t = c.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(c.destination);
    return g;
  }

  private tone(
    c: AudioContext,
    f0: number,
    f1: number,
    dur: number,
    peak: number,
    type: OscillatorType = "sine"
  ) {
    const o = c.createOscillator();
    const t = c.currentTime;
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    o.connect(this.env(c, peak, dur));
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private hiss(
    c: AudioContext,
    dur: number,
    peak: number,
    f: number,
    type: BiquadFilterType = "highpass"
  ) {
    const s = this.noise(c);
    const b = c.createBiquadFilter();
    b.type = type;
    b.frequency.value = f;
    s.connect(b);
    b.connect(this.env(c, peak, dur, 0.02));
    s.start();
    s.stop(c.currentTime + dur + 0.05);
    return b;
  }

  toggle() {
    this.on = !this.on;
    if (this.on && typeof window !== "undefined" && window.AudioContext) {
      this.ctx = this.ctx || new window.AudioContext();
      void this.ctx.resume();
      this.tick();
    }
    return this.on;
  }

  tick() {
    const c = this.A();
    if (c) this.tone(c, 1500, 900, 0.06, 0.12);
  }

  pop() {
    const c = this.A();
    if (!c) return;
    this.tone(c, 420, 110, 0.12, 0.5);
    this.hiss(c, 0.08, 0.35, 1800, "bandpass");
  }

  fizz(d = 1.3) {
    const c = this.A();
    if (c) this.hiss(c, d, 0.16, 3500);
  }

  whoosh() {
    const c = this.A();
    if (!c) return;
    const b = this.hiss(c, 0.48, 0.22, 500, "bandpass");
    b.frequency.setValueAtTime(400, c.currentTime);
    b.frequency.exponentialRampToValueAtTime(2200, c.currentTime + 0.42);
  }

  thud() {
    const c = this.A();
    if (c) {
      this.tone(c, 150, 55, 0.22, 0.55);
      this.hiss(c, 0.05, 0.12, 900, "lowpass");
    }
  }

  dispose() {
    this.on = false;
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

const BH = 2.6;
const TOTAL = 3.47;

type Hc = {
  g: THREE.Group;
  x: number;
  y: number;
  z: number;
  ry: number;
  rz: number;
  s: number;
  spin: number;
  started: boolean;
};

type Els = {
  hero: HTMLElement | null;
  fly: HTMLElement | null;
  hang: HTMLElement | null;
  box: HTMLElement | null;
};

type Assets = {
  wraps: string[];
  xs: number[];
  colors: string[];
};

function geos() {
  const setVRange = (g: THREE.BufferGeometry, v0: number, v1: number) => {
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) {
      const y = uv.getY(i);
      uv.setY(i, v0 + y * (v1 - v0));
    }
  };
  const body = new THREE.CylinderGeometry(1, 1, BH, 72, 1, true);
  const tp: THREE.Vector2[] = [];
  const bp: THREE.Vector2[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    tp.push(new THREE.Vector2(0.8 + 0.2 * Math.cos((t * Math.PI) / 2), 1.3 + 0.38 * t));
    bp.unshift(new THREE.Vector2(0.86 + 0.14 * Math.cos((t * Math.PI) / 2), -1.3 - 0.25 * t));
  }
  const shTop = new THREE.LatheGeometry(tp, 72);
  setVRange(shTop, 0.96, 0.985);
  const shBot = new THREE.LatheGeometry(bp, 72);
  setVRange(shBot, 0.015, 0.04);
  const V = (a: number[][]) => a.map(([x, y]) => new THREE.Vector2(x, y));
  const top = new THREE.LatheGeometry(
    V([
      [0.8, 1.68],
      [0.775, 1.74],
      [0.77, 1.78],
      [0.8, 1.8],
      [0.82, 1.83],
      [0.8, 1.855],
      [0.74, 1.86],
      [0.7, 1.83],
      [0.64, 1.835],
      [0, 1.835],
    ]),
    72
  );
  const base = new THREE.LatheGeometry(
    V([
      [0, -1.56],
      [0.66, -1.56],
      [0.74, -1.61],
      [0.8, -1.61],
      [0.84, -1.58],
      [0.86, -1.55],
    ]),
    72
  );
  const tab = new THREE.CylinderGeometry(0.2, 0.2, 0.03, 28);
  tab.scale(1, 1, 1.5);
  return { body, shTop, shBot, top, base, tab };
}

class CanEngine {
  r: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  packScene = new THREE.Scene();
  cam = new THREE.PerspectiveCamera(30, 1, 10, 7000);
  orthoCam = new THREE.OrthographicCamera(-512, 512, 340, -340, -2000, 2000);
  W = 1024;
  H = 680;
  raf = 0;
  last = 0;
  drawn = false;
  disposed = false;
  paints: THREE.MeshStandardMaterial[] = [];
  shoulders: THREE.MeshStandardMaterial[] = [];
  silver: THREE.MeshStandardMaterial;
  G: ReturnType<typeof geos>;
  heroG = new THREE.Group();
  pivot = new THREE.Group();
  hero: Hc[] = [];
  flyG = new THREE.Group();
  flyCans: THREE.Group[] = [];
  packG = new THREE.Group();
  packCans: THREE.Group[][] = [];
  packState: ({ f: number; t0: number } | null)[] = [null, null, null];
  hangG = new THREE.Group();
  rope = new THREE.Group();
  hang: { piv: THREE.Group; mesh: THREE.Group; k: number }[] = [];
  flavor = 0;
  chP = 0;
  hangP = 0;
  introAt = Infinity;
  px = 0;
  py = 0;
  reduce = false;
  topPx = { x: 0, y: 0 };
  private rc = new THREE.Raycaster();
  private rot = { x: 0, y: 0 };
  private pmrem: THREE.PMREMGenerator;
  private envTex: THREE.Texture;
  private loadedTex: THREE.Texture[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private A: Assets,
    public els: Els,
    onProgress?: (f: number) => void
  ) {
    this.r = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.r.setClearColor(0x000000, 0);
    this.r.autoClear = false;
    this.r.toneMapping = THREE.ACESFilmicToneMapping;
    this.r.toneMappingExposure = 0.9;
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.pmrem = new THREE.PMREMGenerator(this.r);
    const room = new RoomEnvironment();
    this.envTex = this.pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    this.scene.environment = this.envTex;
    this.packScene.environment = this.envTex;

    const k1 = new THREE.DirectionalLight(0xffffff, 0.9);
    k1.position.set(-300, 500, 700);
    const k2 = new THREE.DirectionalLight(0xffffff, 0.42);
    k2.position.set(500, 100, -400);
    this.scene.add(k1, k2, this.heroG, this.flyG, this.hangG);

    const pk1 = new THREE.DirectionalLight(0xffffff, 0.95);
    pk1.position.set(-250, 550, 750);
    const pk2 = new THREE.DirectionalLight(0xffffff, 0.45);
    pk2.position.set(450, 150, -350);
    this.packScene.add(pk1, pk2, this.packG);

    this.silver = new THREE.MeshStandardMaterial({
      color: 0xe2e6ec,
      metalness: 0.96,
      roughness: 0.24,
      envMapIntensity: 0.9,
      side: THREE.DoubleSide,
    });
    this.G = geos();
    this.heroG.add(this.pivot);
    this.hangG.add(this.rope);

    const urls = [...A.wraps];
    let done = 0;
    const loader = new THREE.TextureLoader();
    Promise.all(
      urls.map((u) =>
        loader
          .loadAsync(u)
          .then((t) => {
            if (this.disposed) {
              t.dispose();
              return t;
            }
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = Math.min(4, this.r.capabilities.getMaxAnisotropy());
            this.loadedTex.push(t);
            onProgress?.(++done / urls.length);
            return t;
          })
          .catch(() => {
            onProgress?.(++done / urls.length);
            return new THREE.Texture();
          })
      )
    ).then((all) => {
      if (!this.disposed) this.build(all);
    });
  }

  private makeCan(paint: THREE.Material, shoulderPaint: THREE.Material, idx: number) {
    const w = new THREE.Group();
    const g = new THREE.Group();
    const G = this.G;
    const tab = new THREE.Mesh(G.tab, this.silver);
    tab.position.set(0, 1.86, -0.2);
    g.add(
      new THREE.Mesh(G.body, paint),
      new THREE.Mesh(G.shTop, shoulderPaint),
      new THREE.Mesh(G.shBot, shoulderPaint),
      new THREE.Mesh(G.top, this.silver),
      new THREE.Mesh(G.base, this.silver),
      tab
    );
    g.position.y = -0.125;
    w.add(g);
    w.userData.idx = idx;
    w.visible = false;
    return w;
  }

  private build(all: THREE.Texture[]) {
    const { A } = this;
    this.paints = all.slice(0, N).map(
      (map) =>
        new THREE.MeshStandardMaterial({
          map,
          metalness: 0.32,
          roughness: 0.38,
          envMapIntensity: 0.5,
          emissive: new THREE.Color(0.11, 0.11, 0.11),
          emissiveMap: map,
          side: THREE.DoubleSide,
        })
    );
    this.shoulders = A.colors.map((hex) => {
      const c = new THREE.Color(hex);
      return new THREE.MeshStandardMaterial({
        color: c,
        metalness: 0.36,
        roughness: 0.36,
        envMapIntensity: 0.52,
        emissive: c.clone().multiplyScalar(0.1),
        side: THREE.DoubleSide,
      });
    });

    for (let k = 0; k < N; k++) {
      const g = this.makeCan(this.paints[k], this.shoulders[k], k);
      this.pivot.add(g);
      this.hero.push({ g, x: 0, y: 0, z: -500, ry: 0, rz: 0, s: 0, spin: 0, started: false });

      const fc = this.makeCan(this.paints[k], this.shoulders[k], k);
      this.flyG.add(fc);
      this.flyCans.push(fc);
    }

    for (let s = 0; s < 3; s++) {
      this.packCans[s] = [];
      for (let k = 0; k < N; k++) {
        const pc = this.makeCan(this.paints[k], this.shoulders[k], k);
        this.packG.add(pc);
        this.packCans[s].push(pc);
      }
    }

    const peg = new THREE.BoxGeometry(12, 30, 10);
    const pegM = new THREE.MeshStandardMaterial({ color: 0xe7c28a, roughness: 0.7 });
    const rm = new THREE.Mesh(
      new THREE.BoxGeometry(1, 3, 3),
      new THREE.MeshStandardMaterial({ color: 0x2a1d14, roughness: 0.8 })
    );
    rm.name = "rope";
    this.rope.add(rm);
    for (let k = 0; k < N * 2; k++) {
      const piv = new THREE.Group();
      const mesh = this.makeCan(this.paints[k % N], this.shoulders[k % N], k % N);
      mesh.visible = true;
      const p = new THREE.Mesh(peg, pegM);
      p.position.y = -4;
      piv.add(p, mesh);
      this.rope.add(piv);
      this.hang.push({ piv, mesh, k });
    }
    this.wake();
  }

  resize(w: number, h: number) {
    this.W = Math.max(260, w);
    this.H = Math.max(260, h);
    if (this.disposed) return;
    this.r.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.W < 700 ? 1.6 : 2));
    this.r.setSize(this.W, this.H, false);
    this.cam.aspect = this.W / this.H;
    this.cam.position.z = this.H / 2 / Math.tan(THREE.MathUtils.degToRad(15));
    this.cam.updateProjectionMatrix();

    this.orthoCam.left = -this.W / 2;
    this.orthoCam.right = this.W / 2;
    this.orthoCam.top = this.H / 2;
    this.orthoCam.bottom = -this.H / 2;
    this.orthoCam.position.set(0, 0, 1000);
    this.orthoCam.updateProjectionMatrix();
    this.wake();
  }

  setFlavor(i: number) {
    const same = i === this.flavor;
    this.flavor = i;
    const c = this.hero[i];
    if (c && c.started) c.spin = this.reduce ? 0 : Math.PI * 2;
    if (!same || c) this.wake();
  }

  setPack(ids: number[]) {
    for (let s = 0; s < 3; s++) {
      const f = ids[s];
      const cur = this.packState[s];
      if (f === undefined) this.packState[s] = null;
      else if (!cur || cur.f !== f) this.packState[s] = { f, t0: performance.now() / 1000 };
    }
    this.wake();
  }

  startIntro(delay = 0) {
    this.introAt = performance.now() / 1000 + delay;
    this.wake();
  }

  wake() {
    if (!this.disposed && !this.raf && this.paints.length) {
      this.last = performance.now() / 1000;
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.G.body.dispose();
    this.G.shTop.dispose();
    this.G.shBot.dispose();
    this.G.top.dispose();
    this.G.base.dispose();
    this.G.tab.dispose();
    this.paints.forEach((m) => m.dispose());
    this.shoulders.forEach((m) => m.dispose());
    this.silver.dispose();
    this.loadedTex.forEach((t) => t.dispose());
    this.envTex.dispose();
    this.pmrem.dispose();
    this.r.dispose();
  }

  private relRect(el: HTMLElement | null) {
    if (!el) return null;
    const cr = this.canvas.getBoundingClientRect();
    const sx = cr.width > 0 ? cr.width / this.W : 1;
    const sy = cr.height > 0 ? cr.height / this.H : 1;
    const r = el.getBoundingClientRect();
    return {
      left: (r.left - cr.left) / sx,
      top: (r.top - cr.top) / sy,
      width: r.width / sx,
      height: r.height / sy,
      bottom: (r.bottom - cr.top) / sy,
    };
  }

  pick(which: "hero" | "hang", clientX: number, clientY: number) {
    const cr = this.canvas.getBoundingClientRect();
    const sx = cr.width > 0 ? cr.width / this.W : 1;
    const sy = cr.height > 0 ? cr.height / this.H : 1;
    const cx = (clientX - cr.left) / sx;
    const cy = (clientY - cr.top) / sy;
    this.rc.setFromCamera(
      new THREE.Vector2((cx / this.W) * 2 - 1, -((cy / this.H) * 2 - 1)),
      this.cam
    );
    const objs =
      which === "hero" ? this.hero.filter((c) => c.g.visible).map((c) => c.g) : this.hang.map((h) => h.mesh);
    const hit = this.rc.intersectObjects(objs, true)[0];
    if (!hit) return -1;
    let o: THREE.Object3D | null = hit.object;
    while (o && o.userData.idx === undefined) o = o.parent;
    return o ? (o.userData.idx as number) : -1;
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.disposed) return;
    const t = now / 1000;
    const dt = Math.min(0.05, Math.max(0.001, t - this.last));
    this.last = t;
    const { W, H, A } = this;
    const desk = W >= 900;

    const hr = this.relRect(this.els.hero);
    const fr = this.relRect(this.els.fly);
    const gr = this.relRect(this.els.hang);
    const br = this.relRect(this.els.box);

    const hv = !!hr && hr.bottom > 20 && hr.top < H - 20;
    const fv = !!fr && fr.bottom > 40 && fr.top < H - 40;
    // Hide hanging rope scene cleanly before it overlaps Q&A below it
    const gv = !!gr && gr.bottom > H * 0.32 && gr.top < H - 20;
    const bv = !!br && br.bottom > 20 && br.top < H - 20;

    this.heroG.visible = hv;
    this.flyG.visible = fv;
    this.hangG.visible = gv;
    this.packG.visible = bv;

    if (!hv && !fv && !gv && !bv) {
      if (this.drawn) {
        this.r.clear();
        this.drawn = false;
      }
      return;
    }

    this.raf = requestAnimationFrame(this.frame);
    const kk = (r: number) => 1 - Math.exp(-dt * r);
    const sc = (g: THREE.Object3D, s: number, xs: number) => g.scale.set(s * xs, s, s * xs);

    if (hv && hr) {
      this.heroG.position.set(-W / 2, H / 2 - hr.top, 0);
      const hh = hr.height;
      const ch = desk ? Math.min(0.54 * hh, 560) : Math.min(0.44 * hh, 390);
      const step = desk ? Math.min(0.22 * W, 340) : Math.min(0.32 * W, 240);
      const drop = 0.022 * hh;
      const s0 = ch / TOTAL;
      this.pivot.position.set(W / 2, -hh * (desk ? 0.39 : 0.35), 0);
      this.topPx = { x: W / 2, y: hr.top + hh * (desk ? 0.39 : 0.35) - ch * 0.5 };
      this.rot.y += (this.px * 0.16 - this.rot.y) * kk(4);
      this.rot.x += (-this.py * 0.07 - this.rot.x) * kk(4);
      this.pivot.rotation.set(this.rot.x, this.rot.y, 0);

      this.hero.forEach((c, idx) => {
        const d = ((idx - this.flavor + N + 3) % N) - 3;
        const a = Math.abs(d);
        const act = d === 0;
        const started = t >= this.introAt + idx * 0.09 || (this.reduce && t >= this.introAt);
        if (!started) {
          c.g.visible = false;
          return;
        }
        if (!c.started) {
          c.started = true;
          c.x = 0;
          c.y = 0;
          c.z = -600;
          c.s = 0;
          c.spin = this.reduce ? 0 : Math.PI * 3;
        }
        const k = kk(4.2);
        c.x += (d * step - c.x) * k;
        c.y += (-(a * a * drop) - c.y) * k;
        c.z += (-a * 160 - c.z) * k;
        c.ry += (-d * 0.28 - c.ry) * k;
        c.rz += (-d * 0.11 - c.rz) * k;
        c.s += ((a > 2 ? 0.0001 : act ? 1 : 0.66) * s0 - c.s) * kk(5);
        c.spin *= Math.exp(-dt * 2.4);
        if (Math.abs(c.spin) < 0.001) c.spin = 0;
        const sway = this.reduce ? 0 : act ? Math.sin(t * 0.9) * 0.2 : Math.sin(t * 1.1 + idx) * 0.06;
        const fl = this.reduce ? 0 : act ? Math.sin(t * 1.4) * ch * 0.012 : 0;
        c.g.visible = c.s > 0.01 * s0;
        c.g.position.set(c.x, c.y + fl, c.z);
        c.g.rotation.set(0.1, c.ry + c.spin + sway, c.rz);
        sc(c.g, c.s, A.xs[idx]);
      });
    }

    if (fv && fr) {
      this.flyG.position.set(-W / 2, H / 2 - fr.top, 0);
      const p = this.chP;
      const activeK = clamp(Math.floor(p * N), 0, N - 1);
      const localT = clamp(p * N - activeK, 0, 1);
      const cy = fr.height * (desk ? 0.5 : 0.43);
      const base = (desk ? Math.min(0.58 * H, 540) : Math.min(0.46 * H, 420)) / TOTAL;

      for (let k = 0; k < N; k++) {
        const can = this.flyCans[k];
        can.visible = k === activeK;
        if (!can.visible) continue;

        // Clean 3-phase chapter choreography: enter (0..0.18), showcase turn (0.18..0.82), exit (0.82..1.0)
        const enterP = k === 0 ? 1 : ease(clamp(localT / 0.18, 0, 1));
        const exitP = k === N - 1 ? 0 : ease(clamp((localT - 0.84) / 0.16, 0, 1));
        const turnP = ease(clamp((localT - 0.16) / 0.66, 0, 1));

        const zPos = lerp(-900, 0, enterP) - exitP * 650;
        const yOffset = (1 - enterP) * -60 + exitP * 50 + (this.reduce ? 0 : Math.sin(t * 1.2) * 5);
        const canScale = base * lerp(0.72, 1, enterP) * lerp(1, 0.78, exitP);

        can.position.set(desk ? W * 0.54 : W / 2, -cy + yOffset, zPos);
        can.rotation.set(
          0.1 + Math.sin(turnP * Math.PI) * 0.08,
          (1 - enterP) * Math.PI + turnP * Math.PI * 2 + (this.reduce ? 0 : Math.sin(t * 0.6) * 0.05),
          Math.sin(turnP * Math.PI * 2) * 0.06 - 0.03
        );
        sc(can, canScale, A.xs[k]);
      }
    }

    if (bv && br) {
      // Orthographic camera coordinate space: origin (0,0) is center of canvas, +Y is up, 1 unit = 1px
      this.packG.position.set(-W / 2, H / 2 - br.top, 0);
      const holeDiam = 0.1856 * br.width;
      const hx = [0.2772, 0.4994, 0.7222];
      for (let s = 0; s < 3; s++) {
        const st = this.packState[s];
        this.packCans[s].forEach((c, f) => {
          c.visible = !!st && st.f === f;
        });
        if (!st) continue;
        const c = this.packCans[s][st.f];
        const b = backOut(this.reduce ? 1 : clamp((t - st.t0) / 0.75, 0, 1));
        const cx = br.left + hx[s] * br.width;
        // Center Y at 45.8% of box height so bottom of can rests cleanly on bottom of hole (63%) and top sits inside opening
        const cy = -0.458 * br.height + (1 - b) * 75;
        c.position.set(cx, cy, 0);
        c.rotation.order = "XYZ";
        // Pure X-tilt only (ry = 0, rz = 0) in orthographic projection -> 100% straight vertical cans in all 3 holes
        c.rotation.set(0.96 + (1 - b) * 0.35, 0, 0);
        const inner = c.children[0];
        if (inner) {
          inner.rotation.y = (1 - b) * Math.PI * 2;
        }
        sc(c, 0.435 * holeDiam * lerp(1.22, 1, b), 1);
      }
    }

    if (gv && gr) {
      this.hangG.position.set(-W / 2, H / 2 - gr.top, 0);
      const cw = desk ? clamp(0.15 * W, 170, 230) : clamp(0.3 * W, 110, 190);
      const gap = Math.min(0.09 * W, 70);
      const pitch = cw + gap;
      const padX = 0.1 * W;
      const total = padX * 2 + N * 2 * pitch - gap;
      const travel = -this.hangP * Math.max(0, total - W);
      const canH = cw * 1.75;
      this.rope.position.set(travel, -gr.height * (desk ? 0.47 : 0.42), 0);
      this.rope.rotation.z = 0.0611;
      const rm = this.rope.getObjectByName("rope");
      if (rm) {
        rm.scale.x = total + 2 * W;
        rm.position.x = total / 2;
      }
      this.hang.forEach(({ piv, mesh, k }) => {
        const lx = padX + k * pitch + cw / 2;
        const sx = travel + lx;
        piv.position.set(lx, 0, 0);
        piv.rotation.z = this.reduce ? 0 : Math.sin(t * 1.85 + k * 0.9) * 0.06;
        mesh.position.y = -(canH / 2 + 4);
        sc(mesh, canH / TOTAL, A.xs[k % N]);
        mesh.rotation.set(
          0.1,
          clamp(((W / 2 - sx) / W) * 1.5, -0.9, 0.9) + (this.reduce ? 0 : Math.sin(t * 0.8 + k) * 0.12),
          0
        );
      });
    }

    this.r.clear();
    if (hv || fv || gv) {
      this.r.render(this.scene, this.cam);
    }
    if (bv) {
      this.r.clearDepth();
      this.r.render(this.packScene, this.orthoCam);
    }
    this.drawn = true;
  };
}

/** Smooth Lenis-equivalent scene progress (0..1) driven on rAF */
function useScene(
  ref: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  viewH: number,
  reduced: boolean,
  cb: (p: number) => void
) {
  const fn = useRef(cb);
  fn.current = cb;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let on = false;
    let targetP = 0;
    let smoothP = 0;
    let inited = false;
    let lastT = performance.now();

    const measureTarget = () => {
      const r = el.getBoundingClientRect();
      const cv = canvasRef.current;
      const cr = cv ? cv.getBoundingClientRect() : null;
      const sy = cr && cr.height > 0 ? cr.height / viewH : 1;
      const topRel = cr ? (r.top - cr.top) / sy : r.top;
      const hUnscaled = el.offsetHeight || r.height / sy;
      return clamp(-topRel / Math.max(1, hUnscaled - viewH), 0, 1);
    };

    const step = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now;
      targetP = measureTarget();
      if (!inited || reduced) {
        smoothP = targetP;
        inited = true;
      } else {
        const k = 1 - Math.exp(-dt * 8.5);
        smoothP += (targetP - smoothP) * k;
      }
      fn.current(smoothP);
      if (on && Math.abs(targetP - smoothP) > 0.0002) {
        raf = requestAnimationFrame(step);
      }
    };

    const kick = () => {
      if (on && !raf) {
        lastT = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    const sc = findScroller(el);
    const io = new IntersectionObserver(
      ([e]) => {
        on = e.isIntersecting;
        if (on) kick();
      },
      { root: sc, rootMargin: "200px" }
    );
    io.observe(el);

    const scrollTarget: EventTarget = sc ?? window;
    scrollTarget.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });
    on = true;
    kick();

    return () => {
      io.disconnect();
      scrollTarget.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
    };
  }, [ref, canvasRef, viewH, reduced]);
}

const Layers = ({ i, flat }: { i: number; flat?: boolean }) => (
  <div className={`fw-layers ${flat ? "flat" : ""}`} aria-hidden="true">
    {FLAVORS.map((x, k) => (
      <div
        key={x.id}
        className={`fw-layer ${k === i ? "on" : ""}`}
        style={css({ "--c": x.color, "--d": x.dark })}
      />
    ))}
  </div>
);

const Split = ({ text }: { text: string }) => {
  const words = text.split(/(\n| )/).filter((w) => w !== " ");
  return (
    <span className="fw-split in" aria-label={text.replace(/\n/g, " ")}>
      {words.map((w, k) =>
        w === "\n" ? (
          <br key={k} />
        ) : (
          <Fragment key={k}>
            <span className="w" aria-hidden="true">
              <span style={css({ "--w": k })}>{w}</span>
            </span>{" "}
          </Fragment>
        )
      )}
    </span>
  );
};

const FIZZWICK_CSS = `
.fw-app, .fw-app * { box-sizing: border-box; margin: 0; }
.fw-app {
  background: #0b0606;
  color: #ffffff;
  font-family: 'DM Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative;
  width: 100%;
}
.fw-app img { display: block; max-width: 100%; }
:where(.fw-app) button { font: inherit; color: inherit; cursor: pointer; background: none; border: 0; }
:where(.fw-app) a { color: inherit; text-decoration: none; }
.fw-app :focus-visible { outline: 3px solid #ffffff; outline-offset: 3px; }
.fw-app h1, .fw-app h2, .fw-app h3, .fw-app h4,
.fw-app .fw-btn, .fw-app .fw-flavor-name, .fw-app .fw-cart,
.fw-app .fw-hero-num, .fw-app .fw-qa-big, .fw-app .fw-pre-num {
  font-family: 'Archivo Black', 'DM Sans', sans-serif;
  font-weight: 400;
}

.fw-split { display: inline; }
.fw-split .w {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding: 0.06em 0 0.1em;
  margin-bottom: -0.1em;
}
.fw-split .w > span {
  display: inline-block;
  transform: translate3d(0, 115%, 0);
  transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) calc(var(--w) * 65ms);
}
.fw-split.in .w > span,
.fw-app.go .fw-hero h1 .fw-split .w > span {
  transform: none;
}

.fw-pre {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: var(--fw-vh, 100svh);
  z-index: 100;
  background: #b3123f;
  overflow: hidden;
}
.fw-pre::after {
  content: '';
  position: absolute;
  left: -10%;
  right: -10%;
  top: calc(100% - 1px);
  height: 16vh;
  background: #b3123f;
  border-radius: 0 0 50% 50%;
}
.fw-pre-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.5; }
.fw-pre-logo {
  position: absolute;
  left: 50%;
  top: 44%;
  width: min(62vw, 340px);
  translate: -50% -50%;
  animation: fwPop 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes fwPop { from { opacity: 0; transform: translate3d(0, 24px, 0) scale(0.85); } }
.fw-pre-b {
  position: absolute;
  bottom: -30px;
  left: var(--x);
  width: calc(var(--z) * 1px);
  height: calc(var(--z) * 1px);
  border: 2px solid rgba(255,255,255,0.55);
  border-radius: 50%;
  animation: fwRise 2.6s ease-in infinite;
  animation-delay: var(--d);
}
@keyframes fwRise { to { transform: translate3d(0, -110vh, 0); opacity: 0; } }
.fw-pre-line {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 86px;
  height: 3px;
  background: rgba(255,255,255,0.22);
  border-radius: 3px;
  overflow: hidden;
}
.fw-pre-line span { display: block; height: 100%; background: #ffffff; transform: scaleX(0); transform-origin: 0 50%; }
.fw-pre-num { position: absolute; left: 20px; bottom: 14px; font-size: clamp(48px, 10vw, 112px); line-height: 1; }
.fw-pre.p1, .fw-pre.p2 { transform: translate3d(0, -120%, 0); transition: transform 0.95s cubic-bezier(0.76, 0, 0.24, 1); }
.fw-pre.p2 { visibility: hidden; pointer-events: none; }

.fw-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s;
  opacity: 0;
  pointer-events: auto;
}
.fw-app.go .fw-nav { opacity: 1; }
.fw-nav.hide { transform: translate3d(0, -120%, 0); }
.fw-nav-logo {
  background: rgba(11,6,6,0.55);
  padding: 7px 14px;
  border-radius: 99px;
  display: inline-flex;
  align-items: center;
}
.fw-nav-logo img { height: 24px; width: auto; }
.fw-nav-links {
  display: none;
  gap: 6px;
  background: rgba(11,6,6,0.55);
  border-radius: 99px;
  padding: 6px;
}
.fw-nav-links button {
  padding: 8px 16px;
  border-radius: 99px;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
}
.fw-nav-links button:hover { background: #ffffff; color: #161010; }
.fw-nav-r { display: flex; align-items: center; gap: 8px; }
.fw-snd {
  background: rgba(11,6,6,0.55);
  border: 1.5px solid rgba(255,255,255,0.42);
  border-radius: 99px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}
.fw-snd[aria-pressed="true"] { background: #ffffff; color: #161010; }
.fw-cart {
  background: #ffffff;
  color: #161010;
  border-radius: 99px;
  padding: 9px 16px;
  font-size: 14px;
  animation: fwBump 0.4s;
}
.fw-cart b {
  margin-left: 6px;
  background: #d3122a;
  color: #ffffff;
  border-radius: 99px;
  padding: 2px 8px;
}
@keyframes fwBump { 40% { transform: scale(1.12); } }

.fw-layers { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.fw-layer {
  position: absolute;
  inset: -6%;
  opacity: 0;
  transition: opacity 0.65s ease;
  background: repeating-radial-gradient(circle at 50% 56%, var(--c) 0 6.5vmax, color-mix(in srgb, var(--c) 82%, #0b0606) 6.5vmax 13vmax);
}
.fw-layer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, transparent 35%, rgba(11,6,6,0.58) 100%);
}
.fw-layer.on { opacity: 1; }
.fw-app.go .fw-layer.on { animation: fwRingExpand 1.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
@keyframes fwRingExpand { from { transform: scale(1.22); } to { transform: none; } }
.fw-layers.flat .fw-layer { inset: 0; background: radial-gradient(circle at 50% 45%, var(--c), var(--d) 92%); }
.fw-layers.flat .fw-layer::after { display: none; }
.fw-app.go .fw-layers.flat .fw-layer.on { animation: none; }

.fw-hero {
  position: relative;
  height: var(--fw-vh, 100svh);
  min-height: 540px;
  overflow: hidden;
  background: #0b0606;
  touch-action: pan-y;
  user-select: none;
}
.fw-bub {
  position: absolute;
  left: var(--x);
  bottom: -20px;
  width: calc(var(--s) * 1px);
  height: calc(var(--s) * 1px);
  border: 1.5px solid rgba(255,255,255,0.4);
  border-radius: 50%;
  z-index: 3;
  animation: fwRise var(--t) linear infinite;
  animation-delay: var(--dl);
}
.fw-hero-num {
  position: absolute;
  right: 5%;
  bottom: 24%;
  z-index: 2;
  font-size: clamp(76px, 20vw, 220px);
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255,255,255,0.34);
  animation: fwFade 0.7s;
}
@keyframes fwFade { from { opacity: 0; transform: translate3d(0, 14px, 0); } }
.fw-hero-copy {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  text-align: center;
  padding: 0 20px 22px;
}
.fw-hero-copy h1 { font-size: clamp(22px, 4.6vw, 42px); line-height: 1; }
.fw-flavor-name, .fw-hero-cta, .fw-dots {
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  transition: opacity 0.75s, transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.fw-app.go .fw-flavor-name { opacity: 1; transform: none; transition-delay: 0.25s; }
.fw-app.go .fw-hero-cta { opacity: 1; transform: none; transition-delay: 0.35s; }
.fw-app.go .fw-dots { opacity: 1; transform: none; transition-delay: 0.45s; }
.fw-flavor-name { font-size: clamp(24px, 5vw, 46px); margin-top: 8px; line-height: 1; }
.fw-flavor-name span {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  opacity: 0.88;
  margin-top: 6px;
}
.fw-hero-cta { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 14px; }
.fw-btn {
  background: #ffffff;
  color: #161010;
  border-radius: 99px;
  padding: 13px 24px;
  font-size: 15px;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.fw-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.fw-btn.ghost { background: rgba(11,6,6,0.32); color: #ffffff; border: 1.5px solid rgba(255,255,255,0.55); }
.fw-dots { display: flex; gap: 10px; justify-content: center; margin-top: 14px; }
.fw-dots button {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--dc);
  border: 2px solid rgba(255,255,255,0.45);
  transition: transform 0.3s;
}
.fw-dots button.on { transform: scale(1.45); border-color: #ffffff; }
.fw-fb-can { position: absolute; left: 50%; top: 44%; height: 42%; translate: -50% -50%; z-index: 4; }
.fw-hero-splash {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(130vw, 1080px);
  max-width: none;
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  transform: translate3d(-50%, -50%, 0);
}
.fw-app.go .fw-hero-splash { animation: fwHsplash 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
@keyframes fwHsplash {
  0% { opacity: 0; transform: translate3d(-50%, -36%, 0) scale(0.55); }
  25% { opacity: 0.95; }
  100% { opacity: 0; transform: translate3d(-50%, -60%, 0) scale(1.15); }
}

.fw-chap { height: calc(var(--fw-vh, 100svh) * 6.5); position: relative; }
.fw-scene {
  position: sticky;
  top: 0;
  height: var(--fw-vh, 100svh);
  overflow: hidden;
  color: #ffffff;
}
.fw-bubbles { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
.fw-ch-word {
  position: absolute;
  left: 50%;
  top: 44%;
  translate: -50% -50%;
  z-index: 1;
  font-size: min(26vw, 220px);
  white-space: nowrap;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255,255,255,0.18);
  pointer-events: none;
  font-family: 'Archivo Black', sans-serif;
  animation: fwFade 0.55s;
}
.fw-splash {
  position: absolute;
  left: 50%;
  top: 56%;
  width: min(135vw, 1060px);
  max-width: none;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transform: translate3d(-50%, 0, 0);
  will-change: transform, opacity;
}
.fw-ch-copy {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 5%;
  z-index: 5;
  text-shadow: 0 2px 14px rgba(11,6,6,0.65);
  animation: fwFade 0.55s;
}
.fw-ch-n { font-size: 13px; opacity: 0.85; font-variant-numeric: tabular-nums; font-weight: 700; }
.fw-ch-copy h2 { font-size: clamp(32px, 8vw, 68px); line-height: 0.95; margin: 6px 0; }
.fw-ch-copy p:not(.fw-ch-n) { max-width: 34ch; font-size: 16px; opacity: 0.95; line-height: 1.45; }
.fw-facts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.fw-facts span {
  background: rgba(11,6,6,0.28);
  border: 1px solid rgba(255,255,255,0.24);
  border-radius: 99px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
}
.fw-vdots {
  position: absolute;
  right: 16px;
  top: 50%;
  translate: 0 -50%;
  z-index: 5;
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}
.fw-vdots li button {
  display: block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.55);
  transition: transform 0.3s, background 0.3s;
}
.fw-vdots li.on button { background: #ffffff; transform: scale(1.45); border-color: #ffffff; }
.fw-pct {
  position: absolute;
  left: 20px;
  top: 76px;
  z-index: 5;
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  font-weight: 700;
  opacity: 0.82;
}

.fw-shop, .fw-qa-wrap { background: #f4efe8; color: #161010; padding: 72px 16px; overflow: hidden; position: relative; }
.fw-big { font-size: clamp(40px, 9vw, 96px); line-height: 0.92; margin-bottom: 30px; }
.fw-big.left { text-align: left; }
.fw-panel .fw-big { font-size: clamp(32px, 4.4vw, 58px); margin-bottom: 22px; }
.fw-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
  perspective: 1000px;
}
.fw-card {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  background: var(--cc);
  aspect-ratio: 3 / 4;
  color: #ffffff;
}
.fw-card-t {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.fw-card-m { position: absolute; inset: -4%; width: 108%; height: 108%; max-width: none; object-fit: cover; }
.fw-card h3 {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  z-index: 2;
  font-size: clamp(15px, 3.4vw, 25px);
  line-height: 0.95;
  text-shadow: 0 2px 4px rgba(11,6,6,0.28);
  transform: translateZ(30px);
}
.fw-card-can {
  position: absolute;
  right: 6%;
  bottom: 16%;
  height: 55%;
  width: auto;
  z-index: 2;
  transform: translateZ(60px) rotate(-6deg);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s;
}
.fw-card-foot {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  transform: translateZ(40px);
}
.fw-plus {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ffffff;
  color: #161010;
  font-size: 24px;
  line-height: 1;
  transition: transform 0.3s;
}
.fw-plus:hover { transform: rotate(90deg) scale(1.1); }
@media (hover: hover) {
  .fw-desktop .fw-card-can {
    opacity: 0;
    transform: translateZ(60px) translateY(40px) rotate(-10deg);
  }
  .fw-desktop .fw-card:hover .fw-card-can,
  .fw-desktop .fw-card:focus-within .fw-card-can {
    opacity: 1;
    transform: translateZ(60px) rotate(-6deg);
  }
}

.fw-build { padding: 12px; background: #f4efe8; position: relative; }
.fw-panel {
  background: #150c0a;
  color: #ffffff;
  border-radius: 28px;
  padding: 40px 18px;
  display: grid;
  gap: 26px;
  max-width: 1300px;
  margin: 0 auto;
}
.fw-build-sub {
  font-size: 15px;
  line-height: 1.5;
  color: rgba(255,255,255,0.74);
  margin-bottom: 18px;
  max-width: 42ch;
}
.fw-tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.fw-tile {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16px;
  background: color-mix(in srgb, var(--cc) 45%, #150c0a);
  border: 1px solid rgba(255,255,255,0.12);
  display: grid;
  place-items: center;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s, border-color 0.2s;
}
.fw-tile:hover:not(:disabled) { transform: translate3d(0, -4px, 0); border-color: rgba(255,255,255,0.45); }
.fw-tile:active:not(:disabled) { transform: scale(0.95); }
.fw-tile:disabled { opacity: 0.35; }
.fw-tile img { height: 68%; width: auto; margin-bottom: 10px; }
.fw-tile span {
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 7px;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  line-height: 1.1;
  color: #ffffff;
}
.fw-buy { width: 100%; margin-top: 14px; padding: 16px 24px; font-size: 16px; }
.fw-pack-stage { position: relative; width: 100%; max-width: 640px; margin: 0 auto; }
.fw-box { width: 100%; height: auto; border-radius: 18px; }
.fw-pslot {
  position: absolute;
  top: 50.6%;
  width: 18.56%;
  aspect-ratio: 1;
  translate: -50% -50%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  z-index: 20;
}
.fw-pslot b {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(26px, 6vw, 52px);
  color: rgba(255,255,255,0.24);
}

.fw-hang { height: calc(var(--fw-vh, 100svh) * 3.0); background: #f4efe8; color: #161010; position: relative; }
.fw-hang .fw-scene { color: #161010; cursor: pointer; }
.fw-htitle { position: absolute; left: 5%; top: 14%; margin: 0; z-index: 3; }

.fw-faq {
  display: grid;
  gap: 36px;
  max-width: 1200px;
  margin: 0 auto;
}
.fw-qa-side { display: flex; flex-direction: column; justify-content: space-between; gap: 24px; }
.fw-qa-big { font-size: clamp(72px, 14vw, 168px); line-height: 0.86; letter-spacing: -0.03em; }
.fw-qa-lead { font-size: 16px; line-height: 1.55; color: rgba(22,16,16,0.72); max-width: 36ch; margin-top: 14px; }
.fw-qa-card {
  background: #150c0a;
  color: #ffffff;
  border-radius: 20px;
  padding: 22px 24px;
  max-width: 380px;
}
.fw-qa-card h4 { font-size: 16px; margin-bottom: 6px; }
.fw-qa-card p { font-size: 14px; color: rgba(255,255,255,0.74); line-height: 1.45; margin-bottom: 14px; }
.fw-qa-card button {
  background: #ffffff;
  color: #161010;
  border-radius: 99px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 700;
}
.fw-faq-list { width: 100%; border-top: 1.5px solid rgba(22,16,16,0.16); }
.fw-faq-item { border-bottom: 1.5px solid rgba(22,16,16,0.16); }
.fw-faq-item button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  text-align: left;
  padding: 22px 0;
  font-size: clamp(17px, 2vw, 21px);
  font-weight: 700;
}
.fw-faq-q { display: flex; align-items: baseline; gap: 14px; }
.fw-faq-num {
  font-family: 'Archivo Black', sans-serif;
  font-size: 13px;
  color: rgba(22,16,16,0.42);
  font-variant-numeric: tabular-nums;
}
.fw-faq-item i { width: 18px; height: 18px; flex: none; position: relative; }
.fw-faq-item i::before, .fw-faq-item i::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 8px;
  height: 2px;
  background: currentColor;
  transition: transform 0.3s;
}
.fw-faq-item i::after { transform: rotate(90deg); }
.fw-faq-item.open i::after { transform: none; }
.fw-faq-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.38s cubic-bezier(0.2, 0.8, 0.2, 1); }
.fw-faq-a p { overflow: hidden; color: rgba(22,16,16,0.78); font-size: 16px; line-height: 1.6; padding-left: 28px; max-width: 58ch; }
.fw-faq-item.open .fw-faq-a { grid-template-rows: 1fr; }
.fw-faq-item.open .fw-faq-a p { padding-bottom: 22px; }

.fw-foot {
  transition: background-color 0.8s;
  padding: 64px 20px 36px;
  overflow: hidden;
  color: #ffffff;
  position: relative;
}
.fw-foot-in { max-width: 1200px; margin: 0 auto; }
.fw-foot-top {
  display: grid;
  gap: 28px;
  padding-bottom: 44px;
  border-bottom: 1.5px solid rgba(255,255,255,0.22);
}
.fw-foot-logo { width: min(56vw, 240px); margin-bottom: 12px; }
.fw-foot-tag { font-size: 16px; line-height: 1.5; color: rgba(255,255,255,0.88); max-width: 38ch; }
.fw-foot-form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; max-width: 420px; }
.fw-foot-input {
  flex: 1;
  min-width: 200px;
  background: rgba(11,6,6,0.28);
  border: 1.5px solid rgba(255,255,255,0.38);
  border-radius: 99px;
  padding: 12px 18px;
  color: #ffffff;
  font: inherit;
  font-size: 14px;
}
.fw-foot-input::placeholder { color: rgba(255,255,255,0.65); }
.fw-foot-submit {
  background: #ffffff;
  color: #161010;
  border-radius: 99px;
  padding: 12px 22px;
  font-family: 'Archivo Black', sans-serif;
  font-size: 14px;
}
.fw-cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  padding: 40px 0;
  border-bottom: 1.5px solid rgba(255,255,255,0.22);
}
.fw-cols h4 {
  font-size: 13px;
  letter-spacing: 0.04em;
  color: rgba(255,255,255,0.72);
  margin-bottom: 12px;
}
.fw-cols button {
  display: block;
  margin: 8px 0;
  font-weight: 600;
  font-size: 15px;
  text-align: left;
  color: #ffffff;
  opacity: 0.92;
}
.fw-cols button:hover { opacity: 1; text-decoration: underline; }
.fw-foot-bot {
  padding-top: 26px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  font-size: 13px;
  color: rgba(255,255,255,0.8);
}
.fw-foot-meta { display: flex; gap: 18px; flex-wrap: wrap; }
.fw-foot-meta button { font-weight: 600; color: #ffffff; }
.fw-foot-meta button:hover { text-decoration: underline; }

.fw-burst { position: absolute; z-index: 30; pointer-events: none; width: 0; height: 0; }
.fw-burst i {
  position: absolute;
  left: 0;
  top: 0;
  width: calc(var(--s) * 1px);
  height: calc(var(--s) * 1px);
  border: 2px solid #ffffff;
  border-radius: 50%;
  animation: fwBst 0.95s cubic-bezier(0.1, 0.7, 0.3, 1) forwards;
}
@keyframes fwBst {
  from { transform: translate3d(0, 0, 0) scale(0.3); opacity: 1; }
  to { transform: translate3d(var(--dx), var(--dy), 0) scale(1); opacity: 0; }
}

.fw-desktop .fw-nav { padding: 16px 40px; }
.fw-desktop .fw-nav-logo img { height: 28px; }
.fw-desktop .fw-nav-links { display: flex; }
.fw-desktop .fw-hero-num { bottom: 12%; }
.fw-desktop .fw-shop, .fw-desktop .fw-qa-wrap { padding: 104px 40px; }
.fw-desktop .fw-cards { grid-template-columns: repeat(3, 1fr); gap: 16px; }
.fw-desktop .fw-panel { grid-template-columns: 1fr 1.15fr; gap: 50px; padding: 64px 54px; align-items: center; }
.fw-desktop .fw-tiles { max-width: 460px; }
.fw-desktop .fw-faq { grid-template-columns: 0.85fr 1.15fr; align-items: start; gap: 56px; }
.fw-desktop .fw-htitle { left: 6%; font-size: clamp(48px, 6.2vw, 84px); }
.fw-desktop .fw-ch-copy { left: 6%; right: auto; width: min(32vw, 440px); top: 50%; bottom: auto; translate: 0 -50%; }
.fw-desktop .fw-vdots { right: 40px; }
.fw-desktop .fw-pct { left: 6%; }
.fw-desktop .fw-foot { padding: 80px 40px 40px; }
.fw-desktop .fw-foot-top { grid-template-columns: 1.2fr 1fr; align-items: end; }
.fw-desktop .fw-cols { grid-template-columns: repeat(4, 1fr); }

@media (prefers-reduced-motion: reduce) {
  .fw-app *, .fw-app *::before, .fw-app *::after {
    animation-duration: 0.01s !important;
    transition-duration: 0.01s !important;
  }
  .fw-split .w > span { transform: none !important; }
}
`;

export function FizzwickSodaPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const prefersReduced = !!useReducedMotion();

  const hiddenMap = (config.hiddenSections ?? {}) as Record<string, boolean>;
  const isSectionHidden = (k: string) => Boolean(hiddenMap[k]);
  const activeBrand = config.brandName?.trim() || "Fizzwick";
  const activeHeroTitle = config.heroTitle?.trim() || "Pick your fizz.";
  const logoUrl = config.customLogoUrl || LOGO_SRC;

  const rootRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState<{ w: number; h: number }>({ w: 1200, h: 720 });

  const isMobile = deviceMode === "mobile" || stageSize.w < 640;
  const isTablet = !isMobile && (deviceMode === "tablet" || stageSize.w < 900);
  const isDesktop = !isMobile && !isTablet;
  const modeClass = isDesktop ? "fw-desktop" : isTablet ? "fw-tablet" : "fw-mobile";

  const [phase, setPhase] = useState<0 | 1 | 2>(prefersReduced ? 2 : 0);
  const [i, setI] = useState(0);
  const [ch, setCh] = useState(0);
  const [auto, setAuto] = useState(true);
  const [gl, setGl] = useState(true);
  const [snd, setSnd] = useState(false);
  const [cart, setCart] = useState(0);
  const [bump, setBump] = useState(0);
  const [pack, setPack] = useState<{ k: number; f: number }[]>([]);
  const [faq, setFaq] = useState<number | null>(0);
  const [burst, setBurst] = useState<{ k: number; x: number; y: number } | null>(null);
  const [navHide, setNavHide] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const f = FLAVORS[i];
  const cf = FLAVORS[ch];

  const soundRef = useRef<SoundSynth | null>(null);
  if (!soundRef.current) soundRef.current = new SoundSynth();

  const glRef = useRef<HTMLCanvasElement>(null);
  const eng = useRef<CanEngine | null>(null);
  const loadP = useRef(0);
  const heroRef = useRef<HTMLElement>(null);
  const heroVis = useRef(true);
  const startX = useRef<number | null>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const chapRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const splashRefs = useRef<(HTMLImageElement | null)[]>([]);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLImageElement>(null);
  const hangRef = useRef<HTMLElement>(null);
  const hangScene = useRef<HTMLDivElement>(null);
  const lastC = useRef(-1);
  const lastScrollY = useRef(0);

  /* Measure container & active scroller */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const sc = findScroller(root);
      const w = Math.max(280, Math.round(root.clientWidth || window.innerWidth));
      const parentH = root.parentElement?.clientHeight ?? 0;
      const rawH = sc ? sc.clientHeight : parentH > 120 && parentH < window.innerHeight ? parentH : window.innerHeight;
      const h = Math.max(480, Math.round(rawH));
      if (parentH > 80 && parentH < 360 && !sc) {
        setPhase(2);
      }
      setStageSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    if (root.parentElement) ro.observe(root.parentElement);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [deviceMode]);

  /* WebGL Engine */
  useEffect(() => {
    const canvas = glRef.current;
    if (!canvas) return;
    let e: CanEngine | null = null;
    try {
      e = new CanEngine(
        canvas,
        {
          wraps: FLAVORS.map((x) => x.wrap),
          xs: FLAVORS.map((x) => x.xs),
          colors: FLAVORS.map((x) => x.color),
        },
        {
          hero: heroRef.current,
          fly: sceneRef.current,
          hang: hangScene.current,
          box: boxRef.current,
        },
        (p) => {
          loadP.current = p;
        }
      );
      e.reduce = prefersReduced;
      e.resize(stageSize.w, stageSize.h);
      if (phase >= 1) e.startIntro(0);
      eng.current = e;

      const sc = findScroller(rootRef.current);
      const scrollTarget: EventTarget = sc ?? window;
      const wake = () => e?.wake();
      scrollTarget.addEventListener("scroll", wake, { passive: true });
      return () => {
        scrollTarget.removeEventListener("scroll", wake);
        e?.dispose();
        eng.current = null;
      };
    } catch {
      setGl(false);
      loadP.current = 1;
    }
  }, [ENGINE_REV]);

  useEffect(() => {
    const e = eng.current;
    if (!e) return;
    e.els = {
      hero: heroRef.current,
      fly: sceneRef.current,
      hang: hangScene.current,
      box: boxRef.current,
    };
    e.reduce = prefersReduced;
    e.resize(stageSize.w, stageSize.h);
  }, [stageSize.w, stageSize.h, prefersReduced, config.hiddenSections]);

  useEffect(() => {
    eng.current?.setFlavor(i);
  }, [i]);

  useEffect(() => {
    eng.current?.setPack(pack.map((p) => p.f));
  }, [pack]);

  useEffect(() => {
    return () => soundRef.current?.dispose();
  }, []);

  /* Preloader */
  useEffect(() => {
    if (prefersReduced) {
      setPhase(2);
      eng.current?.startIntro(0);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    let shown = 0;
    const tick = (t: number) => {
      const tp = Math.min(1, (t - t0) / 1200);
      const target = Math.min(ease(tp), 0.12 + 0.88 * loadP.current);
      shown += (target - shown) * 0.24;
      if (numRef.current) numRef.current.textContent = String(Math.min(100, Math.round(shown * 100)));
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${shown})`;
      if (tp >= 1 && ((loadP.current >= 1 && shown > 0.98) || t - t0 > 3000)) {
        setPhase(1);
        eng.current?.startIntro(0.35);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReduced]);

  useEffect(() => {
    if (phase === 1) {
      const a = window.setTimeout(() => setPhase(2), 950);
      return () => window.clearTimeout(a);
    }
  }, [phase]);

  /* Scroll bar + nav auto-hide */
  useEffect(() => {
    const sc = findScroller(rootRef.current);
    const target: EventTarget = sc ?? window;
    let raf = 0;
    const update = () => {
      raf = 0;
      const sy = sc ? sc.scrollTop : window.scrollY;
      const max = sc
        ? Math.max(1, sc.scrollHeight - sc.clientHeight)
        : Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (barRef.current) barRef.current.style.transform = `scaleX(${clamp(sy / max, 0, 1)})`;
      const dy = sy - lastScrollY.current;
      if (Math.abs(dy) > 6) {
        setNavHide(dy > 0 && sy > 200);
        lastScrollY.current = sy;
      }
      eng.current?.wake();
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    target.addEventListener("scroll", kick, { passive: true });
    kick();
    return () => {
      target.removeEventListener("scroll", kick);
      cancelAnimationFrame(raf);
    };
  }, [stageSize.h]);

  /* Desktop micro interactions: magnetic buttons + card tilt */
  useEffect(() => {
    if (prefersReduced || !isDesktop || !rootRef.current) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const off: (() => void)[] = [];
    rootRef.current.querySelectorAll<HTMLElement>(".fw-btn").forEach((b) => {
      const mv = (e: PointerEvent) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate3d(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.28}px,0)`;
      };
      const lv = () => {
        b.style.transform = "";
      };
      b.addEventListener("pointermove", mv);
      b.addEventListener("pointerleave", lv);
      off.push(() => {
        b.removeEventListener("pointermove", mv);
        b.removeEventListener("pointerleave", lv);
      });
    });
    rootRef.current.querySelectorAll<HTMLElement>("[data-tilt]").forEach((c) => {
      const inner = c.firstElementChild as HTMLElement | null;
      if (!inner) return;
      let raf = 0;
      let rx = 0;
      let ry = 0;
      const apply = () => {
        raf = 0;
        inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      };
      const mv = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        ry = ((e.clientX - r.left) / r.width - 0.5) * 14;
        rx = -((e.clientY - r.top) / r.height - 0.5) * 14;
        if (!raf) raf = requestAnimationFrame(apply);
      };
      const lv = () => {
        rx = ry = 0;
        if (!raf) raf = requestAnimationFrame(apply);
      };
      c.addEventListener("pointermove", mv);
      c.addEventListener("pointerleave", lv);
      off.push(() => {
        c.removeEventListener("pointermove", mv);
        c.removeEventListener("pointerleave", lv);
      });
    });
    return () => off.forEach((o) => o());
  }, [prefersReduced, isDesktop]);

  const pick = useCallback(
    (idx: number) => {
      setAuto(false);
      const k = ((idx % N) + N) % N;
      if (k === i) eng.current?.setFlavor(k);
      else {
        soundRef.current?.tick();
        soundRef.current?.whoosh();
      }
      setI(k);
    },
    [i]
  );

  /* Hero autoplay only while visible */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const sc = findScroller(rootRef.current);
    const io = new IntersectionObserver(
      ([e]) => {
        heroVis.current = e.isIntersecting;
      },
      { root: sc }
    );
    io.observe(el);
    const t = window.setInterval(() => {
      if (auto && phase === 2 && heroVis.current && !document.hidden && !prefersReduced) {
        setI((v) => (v + 1) % N);
      }
    }, 4800);
    const key = (e: KeyboardEvent) => {
      if (!heroVis.current) return;
      if (e.key === "ArrowRight") pick(i + 1);
      if (e.key === "ArrowLeft") pick(i - 1);
    };
    window.addEventListener("keydown", key);
    return () => {
      io.disconnect();
      window.clearInterval(t);
      window.removeEventListener("keydown", key);
    };
  }, [auto, phase, i, pick, prefersReduced]);

  /* Chapters: synchronized rAF drives 3D can, splash, and active flavor strictly per chapter */
  useScene(chapRef, glRef, stageSize.h, prefersReduced, (p) => {
    if (eng.current) {
      eng.current.chP = p;
      eng.current.wake();
    }
    const activeK = clamp(Math.floor(p * N), 0, N - 1);
    const localT = clamp(p * N - activeK, 0, 1);
    splashRefs.current.forEach((el, k) => {
      if (!el) return;
      if (k !== activeK) {
        el.style.opacity = "0";
        return;
      }
      const b = Math.sin(localT * Math.PI);
      el.style.opacity = String(ease(b) * 0.88);
      el.style.transform = `translate3d(-50%,${(1 - b) * 48}px,0) scale(${0.76 + b * 0.36})`;
    });
    if (pctRef.current) pctRef.current.textContent = (p * 100).toFixed(1);
    if (activeK !== lastC.current) {
      if (lastC.current !== -1) soundRef.current?.whoosh();
      lastC.current = activeK;
      setCh(activeK);
    }
  });

  useScene(hangRef, glRef, stageSize.h, prefersReduced, (p) => {
    if (eng.current) {
      eng.current.hangP = p;
      eng.current.wake();
    }
  });

  /* Bubbles canvas (chapters only) */
  useEffect(() => {
    const cv = cvRef.current;
    const sc = chapRef.current;
    if (!cv || !sc || prefersReduced) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let vis = false;
    let w = 0;
    let h = 0;
    const bs = Array.from({ length: stageSize.w < 700 ? 18 : 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 2 + Math.random() * 8,
      v: 0.0006 + Math.random() * 0.0015,
      s: Math.random() * 6,
    }));
    const draw = (t: number) => {
      raf = 0;
      if (!vis) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255,255,255,0.34)";
      for (const b of bs) {
        b.y -= b.v * 16;
        if (b.y < -0.05) {
          b.y = 1.05;
          b.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc((b.x + Math.sin(t / 900 + b.s) * 0.015) * w, b.y * h, b.r, 0, 6.283);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    const rootScroller = findScroller(rootRef.current);
    const io = new IntersectionObserver(
      ([e]) => {
        vis = e.isIntersecting;
        if (vis && !raf) {
          w = cv.width = cv.clientWidth || stageSize.w;
          h = cv.height = cv.clientHeight || stageSize.h;
          raf = requestAnimationFrame(draw);
        }
      },
      { root: rootScroller }
    );
    io.observe(sc);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [prefersReduced, stageSize.w, stageSize.h]);

  const scrollToSection = useCallback(
    (id: string) => {
      const sc = findScroller(rootRef.current);
      const el =
        id === "top"
          ? heroRef.current
          : (rootRef.current?.querySelector(`#${id}`) as HTMLElement | null);
      if (!el) return;
      if (sc) {
        const top =
          id === "top" ? 0 : el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
        sc.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
      } else {
        const top = id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
      }
    },
    [prefersReduced]
  );

  const jumpToChapter = useCallback(
    (k: number) => {
      const chapEl = chapRef.current;
      if (!chapEl) return;
      const sc = findScroller(rootRef.current);
      const span = Math.max(1, chapEl.offsetHeight - stageSize.h);
      const frac = (k + 0.45) / N;
      if (sc) {
        const start = chapEl.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
        sc.scrollTo({ top: start + frac * span, behavior: prefersReduced ? "auto" : "smooth" });
      } else {
        const start = chapEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: start + frac * span, behavior: prefersReduced ? "auto" : "smooth" });
      }
    },
    [stageSize.h, prefersReduced]
  );

  const add = (q: number) => {
    setCart((c) => c + q);
    setBump((b) => b + 1);
    soundRef.current?.pop();
    soundRef.current?.fizz(0.7);
  };
  const full = pack.length === 3;
  const openCan = () => {
    const tp = eng.current?.topPx ?? { x: stageSize.w / 2, y: stageSize.h * 0.25 };
    setBurst({ k: Date.now(), x: tp.x, y: tp.y });
    soundRef.current?.pop();
    soundRef.current?.fizz(1.6);
    eng.current?.setFlavor(i);
  };

  return (
    <div
      ref={rootRef}
      className={`fw-app overflow-x-clip ${modeClass} ${phase >= 1 ? "go" : ""}`}
      style={css({ "--fw-vh": `${stageSize.h}px` })}
    >
      <link rel="stylesheet" href={FONT_STYLESHEET} />
      <style dangerouslySetInnerHTML={{ __html: FIZZWICK_CSS }} />

      {/* Pinned Viewport Overlay: WebGL Canvas */}
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          height: 0,
          overflow: "visible",
          zIndex: 15,
          pointerEvents: "none",
        }}
      >
        {/* canvas-ok: Three.js WebGL 3D aluminum soda can renderer (hero, chapters, 3-pack, hanging rope) */}
        <canvas
          ref={glRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${stageSize.w}px`,
            height: `${stageSize.h}px`,
            pointerEvents: "none",
            display: "block",
          }}
        />
      </div>

      {/* Pinned Top Progress Bar + Burst + Preloader + Nav */}
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          height: 0,
          overflow: "visible",
          zIndex: 60,
          pointerEvents: "none",
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3 }}>
          <i
            ref={barRef}
            style={{
              display: "block",
              height: "100%",
              background: "#ffffff",
              transform: "scaleX(0)",
              transformOrigin: "0 50%",
            }}
          />
        </div>

        {burst && (
          <div
            className="fw-burst"
            key={burst.k}
            style={{ left: burst.x, top: burst.y }}
            aria-hidden="true"
          >
            {Array.from({ length: 18 }, (_, k) => {
              const a = -Math.PI / 2 + (k / 18 - 0.5) * 2.4;
              const d = 90 + ((k * 37) % 140);
              return (
                <i
                  key={k}
                  style={css({
                    "--dx": `${Math.cos(a) * d}px`,
                    "--dy": `${Math.sin(a) * d - 40}px`,
                    "--s": 6 + ((k * 7) % 14),
                  })}
                />
              );
            })}
          </div>
        )}

        <div className={`fw-pre p${phase}`} aria-hidden={phase === 2}>
          <img className="fw-pre-bg" src={BG_SRC} alt="" />
          {Array.from({ length: 12 }, (_, k) => (
            <i
              key={k}
              className="fw-pre-b"
              style={css({
                "--x": `${6 + k * 8}%`,
                "--d": `${(k % 5) * 0.35}s`,
                "--z": 6 + (k % 4) * 5,
              })}
            />
          ))}
          <img className="fw-pre-logo" src={logoUrl} alt={activeBrand} />
          <div className="fw-pre-line">
            <span ref={lineRef} />
          </div>
          <span className="fw-pre-num">
            <span ref={numRef}>0</span>
          </span>
        </div>

        <nav className={`fw-nav ${navHide ? "hide" : ""}`}>
          <button
            type="button"
            onClick={() => scrollToSection("top")}
            className="fw-nav-logo"
            aria-label={activeBrand}
          >
            <img src={logoUrl} alt={activeBrand} />
          </button>
          <div className="fw-nav-links">
            {!isSectionHidden("flavors") && (
              <button type="button" onClick={() => scrollToSection("fruit")}>
                Flavors
              </button>
            )}
            {!isSectionHidden("shop") && (
              <button type="button" onClick={() => scrollToSection("shop")}>
                Shop
              </button>
            )}
            {!isSectionHidden("build") && (
              <button type="button" onClick={() => scrollToSection("build")}>
                Build a box
              </button>
            )}
            {!isSectionHidden("faq") && (
              <button type="button" onClick={() => scrollToSection("faq")}>
                Q&amp;A
              </button>
            )}
          </div>
          <div className="fw-nav-r">
            <button
              type="button"
              className="fw-snd"
              aria-pressed={snd}
              onClick={() => setSnd(soundRef.current!.toggle())}
            >
              {snd ? "Sound on" : "Sound off"}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("build")}
              className="fw-cart"
              key={bump}
            >
              Basket <b>{cart}</b>
            </button>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <header
        id="top"
        className="fw-hero"
        ref={heroRef}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse" && eng.current && heroRef.current) {
            const r = heroRef.current.getBoundingClientRect();
            eng.current.px = ((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1;
            eng.current.py = ((e.clientY - r.top) / Math.max(1, r.height)) * 2 - 1;
          }
        }}
        onPointerDown={(e) => {
          startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 50) pick(i + (dx < 0 ? 1 : -1));
          else if (
            Math.abs(dx) < 8 &&
            eng.current &&
            !(e.target as HTMLElement).closest("a,button")
          ) {
            const k = eng.current.pick("hero", e.clientX, e.clientY);
            if (k === i) openCan();
            else if (k >= 0) pick(k);
          }
        }}
      >
        <Layers i={i} />
        <img key={"hs" + i} className="fw-hero-splash" src={f.splash} alt="" />
        {Array.from({ length: 10 }, (_, k) => (
          <i
            key={k}
            className="fw-bub"
            style={css({
              "--x": `${5 + k * 10}%`,
              "--s": 6 + (k % 4) * 5,
              "--t": `${7 + (k % 5)}s`,
              "--dl": `${-k * 1.3}s`,
            })}
          />
        ))}
        {!gl && <img className="fw-fb-can" src={f.small} alt={f.name} />}
        <div className="fw-hero-num" key={f.id} aria-hidden="true">
          {pad(i + 1)}
        </div>
        <div className="fw-hero-copy">
          <h1>
            <Split text={activeHeroTitle} />
          </h1>
          <p className="fw-flavor-name" key={"n" + f.id}>
            {f.name}
            <span>{config.heroSubtitle?.trim() || `${f.tag}, tap the can to open it`}</span>
          </p>
          <div className="fw-hero-cta">
            <button type="button" className="fw-btn" onClick={() => add(1)}>
              Add one ({money(SINGLE)})
            </button>
            <button
              type="button"
              className="fw-btn ghost"
              onClick={() => scrollToSection("build")}
            >
              Build a 3 pack
            </button>
          </div>
          <div className="fw-dots">
            {FLAVORS.map((x, k) => (
              <button
                key={x.id}
                type="button"
                className={k === i ? "on" : ""}
                onClick={() => pick(k)}
                aria-label={x.name}
                style={css({ "--dc": x.color })}
              >
                {k === i && (
                  <motion.span
                    layoutId="fw-hero-dot"
                    className="pointer-events-none absolute -inset-1 rounded-full border border-[#ffffff]"
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* FLAVOR CHAPTERS (pinned, 3D fly-through; start marquee removed per brief) */}
      {!isSectionHidden("flavors") && (
        <section id="fruit" className="fw-chap" ref={chapRef}>
          <div className="fw-scene" ref={sceneRef} data-step={ch}>
            <Layers i={ch} flat />
            <div className="fw-ch-word" key={"w" + cf.id} aria-hidden="true">
              {cf.name.split(" ")[0]}
            </div>
            {FLAVORS.map((x, k) => (
              <img
                key={x.id}
                className="fw-splash"
                ref={(el) => {
                  splashRefs.current[k] = el;
                }}
                src={x.splash}
                alt=""
                loading="lazy"
                decoding="async"
              />
            ))}
            {/* canvas-ok: 2D ambient carbonation bubbles overlay for flavor chapters */}
            <canvas ref={cvRef} className="fw-bubbles" aria-hidden="true" />
            {!gl && <img className="fw-fb-can" src={cf.small} alt={cf.name} />}
            <div className="fw-ch-copy" key={"c" + cf.id}>
              <p className="fw-ch-n">
                {pad(ch + 1)} / {pad(N)}
              </p>
              <h2>{cf.name}</h2>
              <p>{cf.text}</p>
              <div className="fw-facts">
                <span>Real juice</span>
                <span>250 ml</span>
                <span>90 kcal</span>
              </div>
            </div>
            <ul className="fw-vdots">
              {FLAVORS.map((x, k) => (
                <li key={x.id} className={k === ch ? "on" : ""}>
                  <button
                    type="button"
                    aria-label={`Jump to ${x.name}`}
                    onClick={() => jumpToChapter(k)}
                  />
                </li>
              ))}
            </ul>
            <span className="fw-pct">
              <span ref={pctRef}>0.0</span>%
            </span>
          </div>
        </section>
      )}

      {/* SHOP CANS */}
      {!isSectionHidden("shop") && (
        <section id="shop" className="fw-shop">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2 className="fw-big">
              <Split text={"Grab\na can"} />
            </h2>
          </div>
          <div className="fw-cards">
            {FLAVORS.map((x, k) => (
              <article
                key={x.id}
                className="fw-card"
                data-tilt
                style={css({ "--cc": x.color })}
              >
                <div className="fw-card-t">
                  <img
                    className="fw-card-m"
                    src={x.mascot}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <h3>{x.name}</h3>
                  <img
                    className="fw-card-can"
                    src={x.small}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="fw-card-foot">
                    <span>{money(SINGLE)}</span>
                    <button
                      type="button"
                      className="fw-plus"
                      aria-label={`Add ${x.name}`}
                      onClick={() => {
                        add(1);
                        setI(k);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* BUILD YOUR 3 PACK */}
      {!isSectionHidden("build") && (
        <section id="build" className="fw-build">
          <div className="fw-panel">
            <div className="fw-build-l">
              <h2 className="fw-big left">
                <Split text={"Build your\n3 pack &\nsave " + money(SINGLE * 3 - PACK)} />
              </h2>
              <p className="fw-build-sub">
                Tap any three cans below to load your custom crate. Click a slot inside the box to swap a flavor.
              </p>
              <div className="fw-tiles">
                {FLAVORS.map((x, k) => (
                  <button
                    key={x.id}
                    type="button"
                    className="fw-tile"
                    disabled={full}
                    style={css({ "--cc": x.color })}
                    onClick={() => {
                      setPack((p) => (p.length >= 3 ? p : [...p, { k: Date.now() + k, f: k }]));
                      soundRef.current?.thud();
                    }}
                  >
                    <img src={x.small} alt="" loading="lazy" decoding="async" />
                    <span>{x.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="fw-build-r">
              <div className="fw-pack-stage">
                <img
                  ref={boxRef}
                  className="fw-box"
                  src={BOX_SRC}
                  alt="Cardboard three-pack"
                />
                {[27.72, 49.94, 72.22].map((x, s) => (
                  <button
                    key={s}
                    type="button"
                    className="fw-pslot"
                    style={{ left: `${x}%` }}
                    disabled={!pack[s]}
                    onClick={() => setPack((p) => p.filter((_, q) => q !== s))}
                    aria-label={
                      pack[s] ? `Remove ${FLAVORS[pack[s].f].name}` : `Slot ${s + 1}`
                    }
                  >
                    {!pack[s] && <b>{s + 1}</b>}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="fw-btn fw-buy"
                disabled={!full}
                onClick={() => {
                  add(3);
                  setPack([]);
                }}
              >
                {full
                  ? `Add 3-pack to basket (${money(PACK)})`
                  : `Pick ${3 - pack.length} more (${money(PACK)})`}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* HANGING ROPE SCENE */}
      <section className="fw-hang" ref={hangRef}>
        <div
          className="fw-scene"
          ref={hangScene}
          onPointerUp={(e) => {
            const k = eng.current?.pick("hang", e.clientX, e.clientY) ?? -1;
            if (k >= 0) {
              pick(k);
              scrollToSection("top");
            }
          }}
        >
          <h2 className="fw-big left fw-htitle">
            <Split text={"Pick your\nfizz"} />
          </h2>
        </div>
      </section>

      {/* FAQ (end marquee removed per brief) */}
      {!isSectionHidden("faq") && (
        <section id="faq" className="fw-qa-wrap">
          <div className="fw-faq">
            <div className="fw-qa-side">
              <div>
                <div className="fw-qa-big" aria-hidden="true">
                  Q&amp;A
                </div>
                <p className="fw-qa-lead">
                  Everything you need to know about our cold-pressed fruit ingredients, custom 3-pack crates, and chilled delivery.
                </p>
              </div>
              <div className="fw-qa-card">
                <h4>Need a custom case for an event?</h4>
                <p>
                  We supply mixed 24-can studio crates for launches, offices, and summer pop-ups.
                </p>
                <button type="button" onClick={() => scrollToSection("build")}>
                  Build your crate
                </button>
              </div>
            </div>
            <div className="fw-faq-list">
              {FAQS.map(([q, a], k) => (
                <div key={q} className={`fw-faq-item ${faq === k ? "open" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setFaq(faq === k ? null : k)}
                    aria-expanded={faq === k}
                  >
                    <span className="fw-faq-q">
                      <span className="fw-faq-num">{pad(k + 1)}</span>
                      <span>{q}</span>
                    </span>
                    <i />
                  </button>
                  <div className="fw-faq-a">
                    <p>{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      {!isSectionHidden("footer") && (
        <footer className="fw-foot" style={{ backgroundColor: f.color }}>
          <div className="fw-foot-in">
            <div className="fw-foot-top">
              <div>
                <img src={logoUrl} alt={activeBrand} className="fw-foot-logo" />
                <p className="fw-foot-tag">
                  Cold-pressed fruit soda with a loud fizz. Six small-batch flavors canned at peak ripeness, 250 ml and 90 kcal per can.
                </p>
              </div>
              <div>
                <form
                  className="fw-foot-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) {
                      setSubscribed(true);
                      setEmail("");
                      soundRef.current?.pop();
                    }
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={subscribed ? "You are on the list" : "Enter your email for flavor drops"}
                    aria-label="Email for flavor drops"
                    className="fw-foot-input"
                  />
                  <button type="submit" className="fw-foot-submit">
                    {subscribed ? "Joined" : "Notify me"}
                  </button>
                </form>
              </div>
            </div>

            <div className="fw-cols">
              <div>
                <h4>Six Flavors</h4>
                {FLAVORS.map((x, k) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => {
                      pick(k);
                      scrollToSection("top");
                    }}
                  >
                    {x.name}
                  </button>
                ))}
              </div>
              <div>
                <h4>Shop</h4>
                <button type="button" onClick={() => scrollToSection("shop")}>
                  Single Cans ({money(SINGLE)})
                </button>
                <button type="button" onClick={() => scrollToSection("build")}>
                  Custom 3-Pack ({money(PACK)})
                </button>
                <button type="button" onClick={() => scrollToSection("fruit")}>
                  Flavor Chapters
                </button>
              </div>
              <div>
                <h4>Standards</h4>
                <button type="button" onClick={() => scrollToSection("fruit")}>
                  Real Pressed Juice
                </button>
                <button type="button" onClick={() => scrollToSection("faq")}>
                  Recyclable Aluminum
                </button>
                <button type="button" onClick={() => scrollToSection("faq")}>
                  Shipping &amp; Cold Chain
                </button>
              </div>
              <div>
                <h4>Community</h4>
                <button type="button" onClick={() => scrollToSection("top")}>
                  Instagram
                </button>
                <button type="button" onClick={() => scrollToSection("top")}>
                  TikTok
                </button>
                <button type="button" onClick={() => scrollToSection("top")}>
                  YouTube
                </button>
              </div>
            </div>

            <div className="fw-foot-bot">
              <p>
                &copy; {new Date().getFullYear()} {activeBrand} Beverage Co. All rights reserved.
              </p>
              <div className="fw-foot-meta">
                <button type="button" onClick={() => scrollToSection("faq")}>
                  FAQ
                </button>
                <button type="button" onClick={() => scrollToSection("build")}>
                  3-Pack Crate
                </button>
                <button type="button" onClick={() => scrollToSection("top")}>
                  Back to top
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
