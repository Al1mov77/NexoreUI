"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Check,
  ChevronDown,
  Copy,
  Menu,
  Moon,
  PackageCheck,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  X,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800;900&family=Barlow:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

const FONT = {
  display: "'Big Shoulders Display', sans-serif",
  body: "'Barlow', sans-serif",
  mono: "'IBM Plex Mono', monospace",
} as const;

const PALETTE = {
  light: {
    bg: "#f3efe6",
    surface: "#e9e2d4",
    line: "#cfc6b4",
    text: "#171614",
    muted: "#666056",
    accent: "#842432",
    accentInk: "#fbf8f3",
  },
  dark: {
    bg: "#0e0f11",
    surface: "#16181b",
    line: "#282b30",
    text: "#f1efe9",
    muted: "#8f949c",
    accent: "#c84354",
    accentInk: "#fff7f5",
  },
} as const;

const SPRING_WEIGHTY = { type: "spring" as const, stiffness: 260, damping: 22, mass: 1.15 };
const SPRING_SNAP = { type: "spring" as const, stiffness: 480, damping: 36, mass: 0.7 };
const EASE_PRECISION = [0.2, 0, 0, 1] as const;

type ZoneId =
  | "mudguard"
  | "quarter"
  | "overlay"
  | "heel"
  | "vamp"
  | "midsole"
  | "outsole"
  | "laces";

type MaterialId = "suede" | "leather" | "ripstop";
type LaceStyle = "flat" | "rope";
type TrimId = "dubrae" | "hangtag" | "patch";
type DebossFoil = "blind" | "gold";

interface SwatchColor {
  id: string;
  label: string;
  hex: string;
}

const SHOE_SWATCHES: readonly SwatchColor[] = [
  { id: "chalk", label: "Chalk", hex: "#f3efe6" },
  { id: "cream", label: "Warm Cream", hex: "#e9e2d4" },
  { id: "stone", label: "Stone", hex: "#cfc6b4" },
  { id: "oxblood", label: "Oxblood", hex: "#842432" },
  { id: "cobalt", label: "Cobalt", hex: "#27416b" },
  { id: "moss", label: "Moss", hex: "#3d5440" },
  { id: "gum", label: "Raw Gum", hex: "#b88954" },
  { id: "asphalt", label: "Asphalt", hex: "#171614" },
];

const GOLD_FOIL_HEX = "#d4af37";

interface PresetBuild {
  id: string;
  name: string;
  code: string;
  zones: Record<ZoneId, string>;
  upperMaterial: MaterialId;
  laceStyle: LaceStyle;
}

const PRESET_BUILDS: readonly PresetBuild[] = [
  {
    id: "oxblood-archive",
    name: "Oxblood Archive",
    code: "OX-89",
    zones: {
      mudguard: "#cfc6b4",
      quarter: "#f3efe6",
      overlay: "#842432",
      heel: "#842432",
      vamp: "#f3efe6",
      midsole: "#e9e2d4",
      outsole: "#b88954",
      laces: "#f3efe6",
    },
    upperMaterial: "suede",
    laceStyle: "flat",
  },
  {
    id: "cobalt-track",
    name: "Cobalt Track",
    code: "CB-89",
    zones: {
      mudguard: "#27416b",
      quarter: "#f3efe6",
      overlay: "#27416b",
      heel: "#171614",
      vamp: "#e9e2d4",
      midsole: "#f3efe6",
      outsole: "#b88954",
      laces: "#e9e2d4",
    },
    upperMaterial: "leather",
    laceStyle: "flat",
  },
  {
    id: "alpine-field",
    name: "Alpine Field",
    code: "AL-89",
    zones: {
      mudguard: "#3d5440",
      quarter: "#e9e2d4",
      overlay: "#842432",
      heel: "#3d5440",
      vamp: "#cfc6b4",
      midsole: "#e9e2d4",
      outsole: "#171614",
      laces: "#cfc6b4",
    },
    upperMaterial: "ripstop",
    laceStyle: "rope",
  },
  {
    id: "tonal-asphalt",
    name: "Tonal Asphalt",
    code: "AS-89",
    zones: {
      mudguard: "#171614",
      quarter: "#171614",
      overlay: "#666056",
      heel: "#171614",
      vamp: "#666056",
      midsole: "#e9e2d4",
      outsole: "#b88954",
      laces: "#171614",
    },
    upperMaterial: "suede",
    laceStyle: "rope",
  },
];

const ZONE_META: readonly { id: ZoneId; label: string; xPct: number; yPct: number }[] = [
  { id: "mudguard", label: "Mudguard", xPct: 24, yPct: 68 },
  { id: "vamp", label: "Vamp & Tongue", xPct: 26, yPct: 56 },
  { id: "quarter", label: "Quarter", xPct: 48, yPct: 48 },
  { id: "overlay", label: "Side Mark", xPct: 62, yPct: 50 },
  { id: "heel", label: "Heel Counter", xPct: 83, yPct: 55 },
  { id: "midsole", label: "Midsole", xPct: 58, yPct: 77 },
  { id: "outsole", label: "Outsole", xPct: 42, yPct: 85 },
  { id: "laces", label: "Laces", xPct: 42, yPct: 37 },
];

const ZONE_PATHS: Record<ZoneId | "tongue", string[]> = {
  quarter: [
    "M366,382 C402,380 442,378 475,372 C558,318 655,244 745,196 C815,232 912,282 1030,288 C1098,284 1165,254 1222,192 L1226,238 C1168,288 1106,332 1068,374 C1018,438 998,498 996,558 L784,583 C695,546 618,512 566,472 L548,418 L516,420 C478,432 422,430 392,416 Z",
  ],
  vamp: [
    "M168,434 C228,402 308,382 372,382 C382,404 406,426 458,430 C484,432 504,424 514,418 C498,452 482,486 468,512 C398,486 306,454 212,428 Z",
  ],
  tongue: [
    "M748,174 C802,118 860,86 895,78 C932,114 940,178 922,232 C868,200 812,178 748,174 Z",
  ],
  mudguard: [
    "M118,498 C130,468 148,444 168,434 C212,428 306,454 468,512 C484,484 500,446 516,418 C528,418 538,418 548,418 C544,440 578,470 636,502 C690,534 744,562 788,578 C615,606 430,612 290,596 C205,582 152,556 124,522 Z",
  ],
  overlay: [
    "M604,454 L692,422 L724,434 L644,472 Z",
    "M674,480 L758,442 L790,454 L716,494 Z",
    "M812,354 L1128,278 L1098,308 L842,374 Z",
  ],
  heel: [
    "M996,558 C998,495 1024,433 1070,374 C1105,332 1152,292 1207,234 L1215,184 L1236,178 C1256,204 1272,285 1278,418 L1266,518 C1178,534 1090,548 996,558 Z",
  ],
  midsole: [
    "M138,536 C184,572 262,596 385,608 C550,615 710,602 996,558 L1266,518 C1284,556 1288,590 1280,618 C1110,638 820,648 450,648 C305,644 215,616 154,568 Z",
  ],
  outsole: [
    "M116,496 C120,544 168,602 260,636 C360,664 560,674 860,674 C1120,672 1245,658 1280,634 L1278,618 C1110,638 820,648 450,648 C305,644 215,616 154,568 L124,522 Z",
  ],
  laces: [
    "M442,362 C495,318 575,256 688,174 L722,160 L750,178 L750,204 C695,248 595,318 492,374 L448,376 Z",
  ],
};

interface TrimSpec {
  id: TrimId;
  name: string;
  subtitle: string;
  price: number;
  grams: number;
  img: string;
  anchorXPct: number;
  anchorYPct: number;
  widthPct: number;
  rotateDeg: number;
}

const TRIM_SPECS: readonly TrimSpec[] = [
  {
    id: "dubrae",
    name: "Brushed Brass Dubrae",
    subtitle: "Engraved lace plate",
    price: 18,
    grams: 14,
    img: "/templates/solecraft/trim-dubrae.webp",
    anchorXPct: 33.8,
    anchorYPct: 45.2,
    widthPct: 5.2,
    rotateDeg: -33,
  },
  {
    id: "hangtag",
    name: "Cordovan Leather Tag",
    subtitle: "Top-eyelet grommet fob",
    price: 22,
    grams: 8,
    img: "/templates/solecraft/trim-hangtag.webp",
    anchorXPct: 56.5,
    anchorYPct: 39.2,
    widthPct: 6.4,
    rotateDeg: 8,
  },
  {
    id: "patch",
    name: "Woven Twill Label",
    subtitle: "Heavy tongue patch",
    price: 12,
    grams: 4,
    img: "/templates/solecraft/trim-patch.webp",
    anchorXPct: 62.6,
    anchorYPct: 19.8,
    widthPct: 6.8,
    rotateDeg: -14,
  },
];

interface AnatomyLayer {
  id: string;
  index: string;
  title: string;
  spec: string;
  detail: string;
  img: string;
  spreadOffset: number;
  widthPct: number;
}

const ANATOMY_LAYERS: readonly AnatomyLayer[] = [
  {
    id: "upper",
    index: "01",
    title: "Quarter & Mudguard Shell",
    spec: "1.6 mm calfskin + pigskin suede",
    detail: "Double-needle 14 SPI lockstitch over closed-cell collar foam for heel retention without bulk.",
    img: "/templates/solecraft/exploded-1-upper.webp",
    spreadOffset: -84,
    widthPct: 94,
  },
  {
    id: "footbed",
    index: "02",
    title: "Raw Cork Footbed",
    spec: "4 mm Portuguese cork + vegetable calf",
    detail: "Molds directly to arch contour after forty hours of wear while drawing heat away from the forefoot.",
    img: "/templates/solecraft/exploded-2-footbed.webp",
    spreadOffset: -36,
    widthPct: 92.5,
  },
  {
    id: "strobel",
    index: "03",
    title: "360 Strobel Lasting Board",
    spec: "Woven spun-bond perimeter stitch",
    detail: "Joins the entire upper shell cleanly to the base platform prior to midsole cold cement bonding.",
    img: "/templates/solecraft/exploded-3-strobel.webp",
    spreadOffset: 4,
    widthPct: 92.7,
  },
  {
    id: "midsole",
    index: "04",
    title: "Dual-Density EVA + TPU Heel Clip",
    spec: "52C heel cradle / 46C forefoot core",
    detail: "8 mm heel-to-toe drop stabilizes lateral strike without deadening road feel.",
    img: "/templates/solecraft/exploded-4-midsole.webp",
    spreadOffset: 44,
    widthPct: 97,
  },
  {
    id: "outsole",
    index: "05",
    title: "Vulcanized Waffle Outsole",
    spec: "High-abrasion natural rubber compound",
    detail: "Deep directional flex grooves and reinforced heel lug bevel built for wet concrete grip.",
    img: "/templates/solecraft/exploded-5-outsole.webp",
    spreadOffset: 90,
    widthPct: 100,
  },
];

interface SwatchDeckItem {
  id: MaterialId;
  title: string;
  origin: string;
  weight: string;
  finish: string;
  notes: string;
  img: string;
  tex: string;
}

const SWATCH_DECK: readonly SwatchDeckItem[] = [
  {
    id: "suede",
    title: "Hairy Pigskin Suede",
    origin: "Stead Tannery grade split",
    weight: "1.4 mm nap",
    finish: "Water-repellent drum dyed",
    notes: "Loose velvet fiber absorbs studio light cleanly and burnishes along high-flex toe creases.",
    img: "/templates/solecraft/swatch-suede.webp",
    tex: "/templates/solecraft/tex-suede.webp",
  },
  {
    id: "leather",
    title: "Full-Grain Tumbled Calf",
    origin: "Milled drum-tumbled hide",
    weight: "1.6 mm thickness",
    finish: "Aniline matte wax",
    notes: "Natural pebbled grain retains structural memory across the quarter eyestay without cracking.",
    img: "/templates/solecraft/swatch-leather.webp",
    tex: "/templates/solecraft/tex-leather.webp",
  },
  {
    id: "ripstop",
    title: "Ballistic Ripstop Grid",
    origin: "High-tenacity filament weave",
    weight: "280 gsm weave",
    finish: "PFAS-free DWR barrier",
    notes: "Crosshatch tension threads halt micro-tears while venting moisture across the toebox vamp.",
    img: "/templates/solecraft/swatch-ripstop.webp",
    tex: "/templates/solecraft/tex-ripstop.webp",
  },
];

const SIZE_CHART: readonly { us: string; eu: string; cm: string }[] = [
  { us: "US 7", eu: "EU 40", cm: "25.0 CM" },
  { us: "US 8", eu: "EU 41", cm: "26.0 CM" },
  { us: "US 8.5", eu: "EU 42", cm: "26.5 CM" },
  { us: "US 9", eu: "EU 42.5", cm: "27.0 CM" },
  { us: "US 9.5", eu: "EU 43", cm: "27.5 CM" },
  { us: "US 10", eu: "EU 44", cm: "28.0 CM" },
  { us: "US 10.5", eu: "EU 44.5", cm: "28.5 CM" },
  { us: "US 11", eu: "EU 45", cm: "29.0 CM" },
  { us: "US 12", eu: "EU 46", cm: "30.0 CM" },
];

const CARE_ROWS: readonly { material: string; tool: string; cadence: string; protocol: string }[] = [
  {
    material: "Hairy Suede",
    tool: "Crepe brush & gum eraser",
    cadence: "Monthly dry brush",
    protocol: "Lift flattened fibers dry in one direction. Never soak suede in liquid detergent.",
  },
  {
    material: "Tumbled Calfskin",
    tool: "Neutral beeswax balm",
    cadence: "Every 90 days",
    protocol: "Wipe dust with damp cotton rag, apply thin wax layer to toe creases, buff matte.",
  },
  {
    material: "Raw Gum Outsole",
    tool: "Soft bristle & mild soap",
    cadence: "After wet weather",
    protocol: "Clear grit from waffle channels to prevent uneven edge compression over long mileage.",
  },
];

const FAQ_ROWS: readonly { q: string; a: string }[] = [
  {
    q: "How true to size does Last 89 fit?",
    a: "Last 89 runs true to standard Brannock sizing with a slightly sculpted midfoot. Wide feet sit comfortably half a size up.",
  },
  {
    q: "Can worn gum outsoles be resoled at your workshop?",
    a: "Yes. Because the upper uses 360-degree Strobel construction over dual-density EVA, we strip and re-bond fresh rubber soles without disturbing the upper hide.",
  },
  {
    q: "Does heel foil or blind deboss wear off over time?",
    a: "Blind debossing is heat-pressed 0.8 mm directly into the counter suede and remains permanent. Metallic gold leaf softens naturally along the grain.",
  },
  {
    q: "How is a custom pair dispatched after assembly?",
    a: "Each pair is finished by hand, wrapped in unbleached archival tissue inside our kraft drawer box with its build card, and dispatched in 12 business days.",
  },
];

function findScroller(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
    p = p.parentElement;
  }
  return null;
}

function useViewHeight(ref: React.RefObject<HTMLElement | null>) {
  const [h, setH] = useState(800);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = findScroller(el);
    const read = () => setH(s ? s.clientHeight : window.innerHeight);
    read();
    if (s) {
      const ro = new ResizeObserver(read);
      ro.observe(s);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [ref]);
  return h;
}

function useScrollProgress(ref: React.RefObject<HTMLElement | null>, kind: "leave" | "track", viewH: number): MotionValue<number> {
  const mv = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = findScroller(el);
    const update = () => {
      const r = el.getBoundingClientRect();
      const top = s ? s.getBoundingClientRect().top : 0;
      const vh = s ? s.clientHeight : window.innerHeight;
      const total = kind === "track" ? r.height - vh : r.height;
      mv.set(total > 0 ? Math.min(1, Math.max(0, -(r.top - top) / total)) : 0);
    };
    update();
    const target: HTMLElement | Window = s ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, kind, mv, viewH]);
  return mv;
}

function usePageScrollProgress(rootRef: React.RefObject<HTMLElement | null>): MotionValue<number> {
  const mv = useMotionValue(0);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const s = findScroller(el);
    const update = () => {
      if (s) {
        const max = s.scrollHeight - s.clientHeight;
        mv.set(max > 0 ? Math.min(1, Math.max(0, s.scrollTop / max)) : 0);
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        mv.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      }
    };
    update();
    const target: HTMLElement | Window = s ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [rootRef, mv]);
  return mv;
}

function SplitWords({
  text,
  className,
  style,
  delay = 0,
  onView = false,
  reduce = false,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  onView?: boolean;
  reduce?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className={className} style={style} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pt-[0.06em] pb-[0.12em] -mt-[0.06em] -mb-[0.12em]"
        >
          <motion.span
            className="inline-block"
            initial={reduce ? { y: 0 } : { y: "110%" }}
            {...(onView
              ? { whileInView: { y: 0 }, viewport: { once: true, margin: "-8% 0px" } }
              : { animate: { y: 0 } })}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.55, ease: EASE_PRECISION, delay: delay + i * 0.06 }
            }
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

interface SneakerCompositeProps {
  zones: Record<ZoneId, string>;
  upperMaterial: MaterialId;
  laceStyle: LaceStyle;
  heelText: string;
  heelFoil: DebossFoil;
  equippedTrims: Record<TrimId, boolean>;
  className?: string;
  activeZone?: ZoneId | null;
  draggingTrim?: TrimId | null;
  onSelectZone?: (zone: ZoneId) => void;
  onSnapshotReady?: (dataUrl: string) => void;
  interactive?: boolean;
}

function SneakerCompositeStage({
  zones,
  upperMaterial,
  laceStyle,
  heelText,
  heelFoil,
  equippedTrims,
  className = "",
  activeZone = null,
  draggingTrim = null,
  onSelectZone,
  onSnapshotReady,
  interactive = false,
}: SneakerCompositeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const assetsRef = useRef<{
    master: HTMLImageElement | null;
    textures: Record<MaterialId, HTMLImageElement | null>;
    loaded: boolean;
  }>({
    master: null,
    textures: { suede: null, leather: null, ripstop: null },
    loaded: false,
  });
  const [assetsTick, setAssetsTick] = useState(0);

  useEffect(() => {
    let active = true;
    const loadImg = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([
      loadImg("/templates/solecraft/shoe-master.webp"),
      loadImg("/templates/solecraft/tex-suede.webp"),
      loadImg("/templates/solecraft/tex-leather.webp"),
      loadImg("/templates/solecraft/tex-ripstop.webp"),
    ])
      .then(([master, suede, leather, ripstop]) => {
        if (!active) return;
        assetsRef.current = {
          master,
          textures: { suede, leather, ripstop },
          loaded: true,
        };
        setAssetsTick((t) => t + 1);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const store = assetsRef.current;
    if (!canvas || !store.loaded || !store.master) return;

    const W = 1408;
    const H = 768;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(store.master, 0, 0, W, H);

    const drawZoneTint = (zoneKey: ZoneId | "tongue", hex: string, withTexture: boolean) => {
      const paths = ZONE_PATHS[zoneKey];
      ctx.save();
      const region = new Path2D();
      for (const d of paths) region.addPath(new Path2D(d));
      ctx.clip(region);

      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = hex;
      ctx.fillRect(0, 0, W, H);

      const isDeepTone = hex === "#171614" || hex === "#842432" || hex === "#27416b" || hex === "#3d5440";
      if (isDeepTone) {
        ctx.globalCompositeOperation = "color";
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = hex;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }

      if (withTexture) {
        const texImg = store.textures[upperMaterial];
        if (texImg) {
          const pattern = ctx.createPattern(texImg, "repeat");
          if (pattern) {
            ctx.globalCompositeOperation = "soft-light";
            ctx.globalAlpha = upperMaterial === "ripstop" ? 0.34 : 0.24;
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, W, H);
            ctx.globalAlpha = 1;
          }
        }
      }

      if (zoneKey === "laces" && laceStyle === "rope") {
        ctx.globalCompositeOperation = "soft-light";
        ctx.globalAlpha = 0.28;
        ctx.strokeStyle = PALETTE.light.accentInk;
        ctx.lineWidth = 4;
        for (let k = 0; k < 14; k++) {
          ctx.beginPath();
          ctx.moveTo(440 + k * 23, 380 - k * 14);
          ctx.lineTo(468 + k * 23, 355 - k * 14);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    };

    drawZoneTint("quarter", zones.quarter, true);
    drawZoneTint("vamp", zones.vamp, false);
    drawZoneTint("tongue", zones.vamp, false);
    drawZoneTint("mudguard", zones.mudguard, true);
    drawZoneTint("overlay", zones.overlay, true);
    drawZoneTint("heel", zones.heel, true);
    drawZoneTint("midsole", zones.midsole, false);
    drawZoneTint("outsole", zones.outsole, false);
    drawZoneTint("laces", zones.laces, false);

    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(store.master, 0, 0, W, H);
    ctx.restore();

    const stamp = heelText.trim().toUpperCase().slice(0, 3);
    if (stamp) {
      ctx.save();
      ctx.translate(1152, 422);
      ctx.rotate(-0.11);
      ctx.font = "800 42px 'Big Shoulders Display', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (heelFoil === "gold") {
        ctx.shadowColor = "rgba(0,0,0,0.45)";
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 2;
        ctx.fillStyle = GOLD_FOIL_HEX;
        ctx.fillText(stamp, 0, 0);
      } else {
        ctx.fillStyle = "rgba(18,14,12,0.58)";
        ctx.fillText(stamp, 0, 1);
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.fillText(stamp, 0, -1);
      }
      ctx.restore();
    }

    if (onSnapshotReady) {
      try {
        onSnapshotReady(canvas.toDataURL("image/png"));
      } catch {
        // Ignore if cross-origin prevents export
      }
    }
  }, [
    assetsTick,
    zones,
    upperMaterial,
    laceStyle,
    heelText,
    heelFoil,
    onSnapshotReady,
  ]);

  return (
    <div className={`relative w-full aspect-[1408/768] select-none ${className}`}>
      {/* canvas-ok: real-time multi-zone footwear pigment, texture grain and heel deboss compositor */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain block"
        aria-label="Custom configured Solecraft Run-89 sneaker preview"
      />

      {TRIM_SPECS.map((trim) => {
        const equipped = equippedTrims[trim.id];
        const showSnap = draggingTrim === trim.id;
        return (
          <React.Fragment key={trim.id}>
            {showSnap && (
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={SPRING_SNAP}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-dashed flex items-center justify-center"
                style={{
                  left: `${trim.anchorXPct}%`,
                  top: `${trim.anchorYPct}%`,
                  width: `${trim.widthPct + 3}%`,
                  height: "14%",
                  borderColor: PALETTE.light.accent,
                  backgroundColor: "rgba(132,36,50,0.12)",
                }}
              />
            )}
            <AnimatePresence>
              {equipped && (
                <motion.img
                  src={trim.img}
                  alt={trim.name}
                  initial={{ opacity: 0, scale: 1.35, y: -14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={SPRING_SNAP}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_6px_10px_rgba(0,0,0,0.34)]"
                  style={{
                    left: `${trim.anchorXPct}%`,
                    top: `${trim.anchorYPct}%`,
                    width: `${trim.widthPct}%`,
                    transform: `translate(-50%, -50%) rotate(${trim.rotateDeg}deg)`,
                  }}
                />
              )}
            </AnimatePresence>
          </React.Fragment>
        );
      })}

      {interactive &&
        onSelectZone &&
        ZONE_META.map((z) => {
          const selected = activeZone === z.id;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onSelectZone(z.id)}
              aria-label={`Select ${z.label} zone`}
              title={z.label}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-200 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 cursor-pointer"
              style={{
                left: `${z.xPct}%`,
                top: `${z.yPct}%`,
                width: 28,
                height: 28,
              }}
            >
              <span
                className="block rounded-full border transition-all duration-200"
                style={{
                  width: selected ? 14 : 10,
                  height: selected ? 14 : 10,
                  backgroundColor: selected ? PALETTE.light.accent : "rgba(243,239,230,0.88)",
                  borderColor: selected ? "#fff" : "#171614",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                }}
              />
            </button>
          );
        })}
    </div>
  );
}

export function SolecraftPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const reduceMotion = Boolean(useReducedMotion());

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const anatomyRef = useRef<HTMLElement>(null);

  const [containerWidth, setContainerWidth] = useState(1200);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = !isMobile && (deviceMode === "tablet" || containerWidth < 1024);

  const [localTheme, setLocalTheme] = useState<"light" | "dark">(
    config.theme === "dark" ? "dark" : "light"
  );
  useEffect(() => {
    setLocalTheme(config.theme === "dark" ? "dark" : "light");
  }, [config.theme]);

  const pal = PALETTE[localTheme];
  const isDark = localTheme === "dark";

  const brandLabel = (config.brandName || "SOLECRAFT").toUpperCase();
  const heroHeadline = config.heroTitle || "BUILT ON LAST 89";
  const heroLead =
    config.heroSubtitle ||
    "Hand-cut pigskin suede, tumbled calfskin, and 360-degree Strobel construction. Assembled to order on our archival running last.";

  const isHidden = (id: string) => Boolean(config.hiddenSections?.[id]);

  const viewH = useViewHeight(rootRef);
  const pageProgress = usePageScrollProgress(rootRef);
  const smoothPageProgress = useSpring(pageProgress, { stiffness: 220, damping: 28, mass: 0.6 });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = useCallback((sectionId: string) => {
    const root = rootRef.current;
    if (!root) return;
    const target = root.querySelector(`#${sectionId}`);
    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  }, [reduceMotion]);

  /* Hero pointer shadow + scroll lift */
  const heroProgress = useScrollProgress(heroRef, "leave", viewH);
  const heroShoeY = useTransform(heroProgress, [0, 1], [0, -56]);
  const heroShadowX = useSpring(0, { stiffness: 180, damping: 24 });
  const heroShadowY = useSpring(0, { stiffness: 180, damping: 24 });

  /* Section 2: Exploded Anatomy Scroll */
  const anatomyProgress = useScrollProgress(anatomyRef, "track", viewH);
  const smoothAnatomy = useSpring(anatomyProgress, { stiffness: 210, damping: 24, mass: 0.9 });
  const spread = useTransform(smoothAnatomy, [0.06, 0.45], [0, 1]);
  const [activeLayerIdx, setActiveLayerIdx] = useState(0);

  useMotionValueEvent(anatomyProgress, "change", (latest) => {
    const idx = Math.min(4, Math.max(0, Math.floor(latest * 5)));
    setActiveLayerIdx(idx);
  });

  /* Section 3: Material Swatch Deck & Optical Loupe */
  const [swatchIndex, setSwatchIndex] = useState(0);
  const activeSwatch = SWATCH_DECK[swatchIndex];
  const loupeX = useSpring(180, { stiffness: 240, damping: 26 });
  const loupeY = useSpring(180, { stiffness: 240, damping: 26 });
  const [loupeActive, setLoupeActive] = useState(false);
  const loupeMask = useMotionTemplate`radial-gradient(circle 84px at ${loupeX}px ${loupeY}px, #000 0%, transparent 100%)`;

  const cycleSwatch = (dir: 1 | -1) => {
    setSwatchIndex((prev) => (prev + dir + SWATCH_DECK.length) % SWATCH_DECK.length);
  };

  /* Section 4: Atelier Workbench State */
  const [zones, setZones] = useState<Record<ZoneId, string>>(PRESET_BUILDS[0].zones);
  const [activeZone, setActiveZone] = useState<ZoneId>("mudguard");
  const [upperMaterial, setUpperMaterial] = useState<MaterialId>("suede");
  const [laceStyle, setLaceStyle] = useState<LaceStyle>("flat");
  const [heelText, setHeelText] = useState("R89");
  const [heelFoil, setHeelFoil] = useState<DebossFoil>("blind");
  const [equippedTrims, setEquippedTrims] = useState<Record<TrimId, boolean>>({
    dubrae: false,
    hangtag: false,
    patch: false,
  });
  const [shoeSnapshot, setShoeSnapshot] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState(false);

  /* Drag and Drop for Hardware Trims */
  const shoeStageRef = useRef<HTMLDivElement>(null);
  const [draggingTrim, setDraggingTrim] = useState<TrimId | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isOverShoe, setIsOverShoe] = useState(false);

  const handleTrimPointerDown = (trimId: TrimId, e: React.PointerEvent<HTMLButtonElement>) => {
    if (isMobile) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingTrim(trimId);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleTrimPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingTrim) return;
    setDragPos({ x: e.clientX, y: e.clientY });
    const stage = shoeStageRef.current;
    if (stage) {
      const rect = stage.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      setIsOverShoe(inside);
    }
  };

  const handleTrimPointerUp = (trimId: TrimId, e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingTrim) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const stage = shoeStageRef.current;
    let droppedOnShoe = false;
    if (stage) {
      const rect = stage.getBoundingClientRect();
      droppedOnShoe =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    }
    if (droppedOnShoe) {
      setEquippedTrims((prev) => ({ ...prev, [trimId]: true }));
    }
    setDraggingTrim(null);
    setIsOverShoe(false);
  };

  const toggleTrim = (trimId: TrimId) => {
    setEquippedTrims((prev) => ({ ...prev, [trimId]: !prev[trimId] }));
  };

  const applyPreset = (preset: PresetBuild) => {
    setZones(preset.zones);
    setUpperMaterial(preset.upperMaterial);
    setLaceStyle(preset.laceStyle);
  };

  const totalPrice = useMemo(() => {
    let price = 245;
    if (heelFoil === "gold" && heelText.trim().length > 0) price += 15;
    for (const trim of TRIM_SPECS) {
      if (equippedTrims[trim.id]) price += trim.price;
    }
    return price;
  }, [heelFoil, heelText, equippedTrims]);

  const totalGrams = useMemo(() => {
    let g = upperMaterial === "leather" ? 402 : upperMaterial === "ripstop" ? 364 : 385;
    for (const trim of TRIM_SPECS) {
      if (equippedTrims[trim.id]) g += trim.grams;
    }
    return g;
  }, [upperMaterial, equippedTrims]);

  const buildCode = useMemo(() => {
    const matTag = upperMaterial === "suede" ? "SD" : upperMaterial === "leather" ? "LT" : "RS";
    const trimCount = Object.values(equippedTrims).filter(Boolean).length;
    const tag = (heelText.trim() || "R89").toUpperCase();
    return `R89-${matTag}-${tag}-T${trimCount}`;
  }, [upperMaterial, equippedTrims, heelText]);

  const copyBuildCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(buildCode).catch(() => undefined);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  /* Section 5: Before / After Patina Wipe */
  const [wipePct, setWipePct] = useState(50);
  const wipeContainerRef = useRef<HTMLDivElement>(null);

  const updateWipeFromClientX = (clientX: number) => {
    const el = wipeContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100));
    setWipePct(pct);
  };

  /* Section 6: Drawer Box Packaging Ritual */
  const [selectedSize, setSelectedSize] = useState(SIZE_CHART[5]);
  const [packStage, setPackStage] = useState<"idle" | "open" | "shoe-in" | "tissue" | "sealed">("idle");
  const packTimersRef = useRef<number[]>([]);

  const clearPackTimers = () => {
    packTimersRef.current.forEach((id) => window.clearTimeout(id));
    packTimersRef.current = [];
  };

  useEffect(() => () => clearPackTimers(), []);

  const triggerPackRitual = () => {
    clearPackTimers();
    if (reduceMotion) {
      setPackStage("sealed");
      return;
    }
    setPackStage("open");

    packTimersRef.current.push(
      window.setTimeout(() => {
        setPackStage("shoe-in");
      }, 420),
      window.setTimeout(() => {
        setPackStage("tissue");
      }, 980),
      window.setTimeout(() => {
        setPackStage("sealed");
      }, 1580)
    );
  };

  const resetPackRitual = () => {
    clearPackTimers();
    setPackStage("idle");
  };

  /* Section 7: FAQ State */
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const pxPad = isMobile ? "px-5" : isTablet ? "px-8" : "px-12";
  const trayTranslate =
    packStage === "idle"
      ? { x: -8, y: -5.2 }
      : packStage === "sealed"
        ? { x: -2.0, y: -1.3 }
        : { x: 0, y: 0 };

  const heroLines = useMemo(() => {
    const words = heroHeadline.trim().split(/\s+/);
    if (words.length <= 2) return [words.join(" ")];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }, [heroHeadline]);

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-clip transition-colors duration-500"
      style={{
        backgroundColor: pal.bg,
        color: pal.text,
        fontFamily: FONT.body,
        ["--selection-bg" as string]: pal.accent,
      }}
    >
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`
        .solecraft-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E");
        }
        .solecraft-root ::selection {
          background: ${pal.accent};
          color: ${pal.accentInk};
        }
      `}</style>

      <div className="solecraft-root relative">
        <div className="solecraft-grain pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

        {/* Sticky Editorial Header */}
        <header
          className="sticky top-0 z-40 w-full border-b transition-colors duration-300"
          style={{
            backgroundColor: isMobile
              ? pal.bg
              : isDark
                ? "rgba(14,15,17,0.92)"
                : "rgba(243,239,230,0.92)",
            backdropFilter: isMobile ? undefined : "blur(10px)",
            boxShadow: isMobile ? `0 -36px 0 ${pal.bg}` : undefined,
            borderColor: pal.line,
          }}
        >
          <div className={`mx-auto max-w-[1280px] ${pxPad} h-16 flex items-center justify-between gap-4`}>
            <div className="flex items-center gap-3 min-w-0">
              {config.customLogoUrl ? (
                <img src={config.customLogoUrl} alt={brandLabel} className="h-6 w-auto object-contain" />
              ) : (
                <span
                  className="text-2xl font-black tracking-[-0.02em] leading-none"
                  style={{ fontFamily: FONT.display }}
                >
                  {brandLabel}
                </span>
              )}
              <span
                className="h-4 w-px shrink-0"
                style={{ backgroundColor: pal.line }}
                aria-hidden="true"
              />
              <span
                className="text-[11px] font-medium tracking-[0.06em] truncate"
                style={{ fontFamily: FONT.mono, color: pal.muted }}
              >
                RUN-89 ARCHIVE
              </span>
            </div>

            {!isMobile && !isTablet && (
              <nav className="flex items-center gap-7" aria-label="Workshop sections">
                {[
                  { id: "last", label: "Last" },
                  { id: "anatomy", label: "Anatomy" },
                  { id: "materials", label: "Materials" },
                  { id: "build", label: "Workbench" },
                  { id: "patina", label: "Patina" },
                  { id: "pack", label: "Pack" },
                ].map((nav) => (
                  <button
                    key={nav.id}
                    type="button"
                    onClick={() => scrollToSection(nav.id)}
                    className="group relative py-1 text-sm font-medium tracking-[0.02em] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                    style={{ color: pal.text }}
                  >
                    <span>{nav.label}</span>
                    <span
                      className="absolute left-0 bottom-0 h-px w-full origin-right scale-x-0 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
                      style={{ backgroundColor: pal.accent }}
                    />
                  </button>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setLocalTheme((t) => (t === "light" ? "dark" : "light"))}
                aria-label="Toggle light or dark workshop finish"
                className="inline-flex h-10 w-10 items-center justify-center border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                style={{ borderColor: pal.line, color: pal.text }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {(isMobile || isTablet) && (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  aria-label="Toggle navigation drawer"
                  className="inline-flex h-10 w-10 items-center justify-center border cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                  style={{ borderColor: pal.line, color: pal.text }}
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              )}

              {!isMobile && (
                <button
                  type="button"
                  onClick={() => scrollToSection("build")}
                  className="h-10 px-4 text-xs font-semibold tracking-[0.04em] transition-transform active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                  style={{ backgroundColor: pal.accent, color: pal.accentInk }}
                >
                  Open workbench
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (isMobile || isTablet) && (
              <motion.div
                initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_PRECISION }}
                className="overflow-hidden border-t"
                style={{ borderColor: pal.line, backgroundColor: pal.surface }}
              >
                <div className={`${pxPad} py-4 grid grid-cols-2 gap-2`}>
                  {[
                    { id: "last", label: "Last 89" },
                    { id: "anatomy", label: "5-Layer Sole" },
                    { id: "materials", label: "Materials" },
                    { id: "build", label: "Workbench" },
                    { id: "patina", label: "Patina Study" },
                    { id: "pack", label: "Pack Pair" },
                  ].map((nav) => (
                    <button
                      key={nav.id}
                      type="button"
                      onClick={() => scrollToSection(nav.id)}
                      className="min-h-[44px] px-3 text-left text-sm font-medium border cursor-pointer"
                      style={{ borderColor: pal.line, color: pal.text }}
                    >
                      {nav.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="h-[2px] w-full origin-left"
            style={{
              scaleX: smoothPageProgress,
              backgroundColor: pal.accent,
            }}
          />
        </header>

        {/* SECTION 1: HERO */}
        {!isHidden("hero") && (
          <section
            id="last"
            ref={heroRef}
            className={`scroll-mt-20 relative z-10 mx-auto max-w-[1280px] ${pxPad} ${
              isMobile ? "pt-6 pb-12" : isTablet ? "pt-12 pb-20" : "pt-16 pb-24"
            }`}
          >
            <div
              className={
                isMobile
                  ? "flex flex-col gap-6"
                  : "grid grid-cols-12 gap-8 items-center"
              }
            >
              <div className={isMobile ? "w-full" : isTablet ? "col-span-6" : "col-span-6"}>
                <h1
                  className="font-black uppercase tracking-[-0.02em] leading-[0.94]"
                  style={{
                    fontFamily: FONT.display,
                    fontSize: isMobile
                      ? "clamp(3rem, 13vw, 4.2rem)"
                      : isTablet
                        ? "clamp(4rem, 7.5vw, 5.4rem)"
                        : "clamp(5rem, 8vw, 7.4rem)",
                    textWrap: "balance",
                  }}
                >
                  {heroLines.map((line, idx) => (
                    <span key={`${line}-${idx}`} className="block">
                      <SplitWords text={line} delay={idx * 0.08} reduce={reduceMotion} />
                    </span>
                  ))}
                </h1>

                <p
                  className="mt-5 max-w-[46ch] text-base leading-[1.6]"
                  style={{ color: pal.muted }}
                >
                  {heroLead}
                </p>

                <div
                  className="mt-7 grid grid-cols-3 border-y py-3.5"
                  style={{ borderColor: pal.line }}
                >
                  <div>
                    <div className="text-[11px]" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      WEIGHT
                    </div>
                    <div className="mt-0.5 text-lg font-semibold tabular-nums">385 g</div>
                  </div>
                  <div className="border-x px-3" style={{ borderColor: pal.line }}>
                    <div className="text-[11px]" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      HEEL DROP
                    </div>
                    <div className="mt-0.5 text-lg font-semibold tabular-nums">8 mm</div>
                  </div>
                  <div className="pl-3">
                    <div className="text-[11px]" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      CONSTRUCTION
                    </div>
                    <div className="mt-0.5 text-lg font-semibold tabular-nums">360 Strobel</div>
                  </div>
                </div>

                <div className={`mt-7 flex ${isMobile ? "flex-col" : "flex-row"} gap-3`}>
                  <button
                    type="button"
                    onClick={() => scrollToSection("build")}
                    className="min-h-[46px] px-6 text-sm font-semibold tracking-[0.03em] transition-transform active:scale-[0.97] cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                    style={{ backgroundColor: pal.accent, color: pal.accentInk }}
                  >
                    Configure your pair
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("anatomy")}
                    className="min-h-[46px] px-6 text-sm font-semibold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                    style={{ borderColor: pal.line, color: pal.text }}
                  >
                    Inspect 5-layer sole
                  </button>
                </div>
              </div>

              <div
                className={isMobile ? "w-full" : isTablet ? "col-span-6" : "col-span-6"}
                onPointerMove={(e) => {
                  if (isMobile || reduceMotion) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const nx = (e.clientX - rect.left) / rect.width - 0.5;
                  const ny = (e.clientY - rect.top) / rect.height - 0.5;
                  heroShadowX.set(-nx * 24);
                  heroShadowY.set(-ny * 12);
                }}
                onPointerLeave={() => {
                  heroShadowX.set(0);
                  heroShadowY.set(0);
                }}
              >
                <div
                  className={`relative border ${isMobile ? "p-4" : "p-6"} overflow-hidden`}
                  style={{
                    borderColor: pal.line,
                    backgroundColor: pal.surface,
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] mb-2" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                    <span>PROTOTYPE SILHOUETTE</span>
                    <span>SCALE 1:1</span>
                  </div>

                  <div className="relative aspect-[16/10] flex items-center justify-center">
                    <motion.div
                      aria-hidden="true"
                      className="absolute bottom-[10%] left-[12%] right-[10%] h-7 rounded-full pointer-events-none"
                      style={{
                        x: heroShadowX,
                        y: heroShadowY,
                        background:
                          "radial-gradient(ellipse at center, rgba(23,22,20,0.28) 0%, rgba(23,22,20,0) 72%)",
                      }}
                    />
                    <motion.img
                      src="/templates/solecraft/shoe-master.webp"
                      alt="Solecraft Run-89 unbleached prototype running sneaker"
                      className="relative z-10 w-full h-full object-contain drop-shadow-[0_14px_20px_rgba(23,22,20,0.14)]"
                      style={reduceMotion ? undefined : { y: heroShoeY }}
                    />
                  </div>

                  <div className="mt-2 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: pal.line, fontFamily: FONT.mono, color: pal.muted }}>
                    <span>UNBLEACHED SUEDE / CALF</span>
                    <span>FROM $245</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: STICKY 5-LAYER EXPLODED ANATOMY */}
        {!isHidden("anatomy") && (
          <section
            id="anatomy"
            ref={anatomyRef}
            className="scroll-mt-20 relative z-10 border-t"
            style={{
              borderColor: pal.line,
              height: reduceMotion ? "auto" : viewH * (isMobile ? 2.2 : 2.9),
            }}
          >
            <div
              className={`${reduceMotion ? "" : "sticky top-16 overflow-hidden"} w-full`}
              style={reduceMotion ? undefined : { height: Math.max(540, viewH - 64) }}
            >
              <div className={`mx-auto max-w-[1280px] h-full ${pxPad} py-8 flex flex-col justify-between`}>
                <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-4" style={{ borderColor: pal.line }}>
                  <div>
                    <h2
                      className="font-black uppercase leading-[0.95]"
                      style={{
                        fontFamily: FONT.display,
                        fontSize: isMobile ? "2.4rem" : "3.5rem",
                      }}
                    >
                      FIVE LAYERS. STITCHED, NOT GLUED.
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {ANATOMY_LAYERS.map((layer, idx) => {
                      const active = activeLayerIdx === idx;
                      return (
                        <button
                          key={layer.id}
                          type="button"
                          onClick={() => setActiveLayerIdx(idx)}
                          className="relative min-h-[40px] min-w-[40px] px-2.5 text-xs font-medium border cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                          style={{
                            borderColor: active ? pal.accent : pal.line,
                            color: active ? pal.accentInk : pal.text,
                            fontFamily: FONT.mono,
                          }}
                        >
                          {active && (
                            <motion.span
                              layoutId="anatomy-step"
                              transition={SPRING_SNAP}
                              className="absolute inset-0"
                              style={{ backgroundColor: pal.accent }}
                            />
                          )}
                          <span className="relative z-10">{layer.index}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className={
                    isMobile
                      ? "flex-1 flex flex-col justify-center gap-4 py-2"
                      : "flex-1 grid grid-cols-12 gap-8 items-center py-4"
                  }
                >
                  <div
                    className={
                      isMobile
                        ? "w-full relative flex flex-col items-center justify-center min-h-[250px]"
                        : "col-span-7 relative flex flex-col items-center justify-center h-full"
                    }
                  >
                    <div className="relative w-full max-w-[500px] flex flex-col items-center">
                      {ANATOMY_LAYERS.map((layer, idx) => {
                        const active = activeLayerIdx === idx;
                        return (
                          <ExplodedLayerImage
                            key={layer.id}
                            layer={layer}
                            spread={spread}
                            active={active}
                            isMobile={isMobile}
                            reduce={reduceMotion}
                            onClick={() => setActiveLayerIdx(idx)}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className={isMobile ? "w-full" : "col-span-5"}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={ANATOMY_LAYERS[activeLayerIdx].id}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                        transition={{ duration: 0.28, ease: EASE_PRECISION }}
                        className={`border ${isMobile ? "p-5" : "p-7"}`}
                        style={{
                          borderColor: pal.line,
                          backgroundColor: pal.surface,
                        }}
                      >
                        <div className="flex items-center justify-between text-xs" style={{ fontFamily: FONT.mono, color: pal.accent }}>
                          <span>LAYER {ANATOMY_LAYERS[activeLayerIdx].index} OF 05</span>
                          <span>EXPLODED STACK</span>
                        </div>
                        <h3
                          className={`mt-3 ${isMobile ? "text-3xl" : "text-4xl"} font-extrabold uppercase leading-[0.95]`}
                          style={{ fontFamily: FONT.display }}
                        >
                          {ANATOMY_LAYERS[activeLayerIdx].title}
                        </h3>
                        <div
                          className="mt-2 pb-3 border-b text-xs"
                          style={{
                            borderColor: pal.line,
                            fontFamily: FONT.mono,
                            color: pal.muted,
                          }}
                        >
                          {ANATOMY_LAYERS[activeLayerIdx].spec}
                        </div>
                        <p className={`mt-4 ${isMobile ? "text-sm" : "text-base"} leading-[1.6]`} style={{ color: pal.text }}>
                          {ANATOMY_LAYERS[activeLayerIdx].detail}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: MATERIAL SWATCH DECK + OPTICAL LOUPE */}
        {!isHidden("materials") && (
          <section
            id="materials"
            className={`scroll-mt-20 relative z-10 border-t ${isMobile ? "py-14" : "py-24"}`}
            style={{ borderColor: pal.line }}
          >
            <div className={`mx-auto max-w-[1280px] ${pxPad}`}>
              <div className={isMobile ? "flex flex-col gap-8" : "grid grid-cols-12 gap-10 items-center"}>
                <div className={isMobile ? "w-full" : "col-span-5"}>
                  <h2
                    className="font-black uppercase leading-[0.94]"
                    style={{
                      fontFamily: FONT.display,
                      fontSize: isMobile ? "2.6rem" : "3.8rem",
                    }}
                  >
                    SURFACE YOU CAN READ WITH YOUR THUMB.
                  </h2>
                  <p className="mt-4 text-base leading-[1.6]" style={{ color: pal.muted }}>
                    Move the optical loupe across any square-cut tannery swatch, or flick through the deck to compare fiber length, grain density, and breathability before opening the workbench.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {SWATCH_DECK.map((item, idx) => {
                      const active = idx === swatchIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSwatchIndex(idx)}
                          className="relative min-h-[44px] px-4 text-xs font-semibold border cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                          style={{
                            borderColor: active ? pal.accent : pal.line,
                            color: active ? pal.accentInk : pal.text,
                          }}
                        >
                          {active && (
                            <motion.span
                              layoutId="swatch-tab"
                              transition={SPRING_SNAP}
                              className="absolute inset-0"
                              style={{ backgroundColor: pal.accent }}
                            />
                          )}
                          <span className="relative z-10">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className="mt-6 border p-5"
                    style={{ borderColor: pal.line, backgroundColor: pal.surface }}
                  >
                    <div className="grid grid-cols-2 gap-3 text-xs pb-3 border-b" style={{ borderColor: pal.line, fontFamily: FONT.mono }}>
                      <div>
                        <span className="block" style={{ color: pal.muted }}>GRADE</span>
                        <span className="font-semibold">{activeSwatch.origin}</span>
                      </div>
                      <div>
                        <span className="block" style={{ color: pal.muted }}>GAUGE</span>
                        <span className="font-semibold">{activeSwatch.weight}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-[1.55]" style={{ color: pal.text }}>
                      {activeSwatch.notes}
                    </p>
                  </div>
                </div>

                <div className={isMobile ? "w-full" : "col-span-7"}>
                  <div className="relative mx-auto max-w-[460px]">
                    <div className="flex items-center justify-between text-[11px] mb-2" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      <span>{isMobile ? "SWIPE OR TAP DECK TO CYCLE" : "HOVER TO MAGNIFY GRAIN / DRAG TO FLICK"}</span>
                      <span>
                        0{swatchIndex + 1} / 0{SWATCH_DECK.length}
                      </span>
                    </div>

                    <div
                      className="relative aspect-square border overflow-hidden cursor-zoom-in"
                      style={{
                        borderColor: pal.line,
                        backgroundColor: pal.surface,
                      }}
                      onPointerEnter={() => setLoupeActive(true)}
                      onPointerMove={(e) => {
                        if (isMobile) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        loupeX.set(e.clientX - rect.left);
                        loupeY.set(e.clientY - rect.top);
                      }}
                      onPointerLeave={() => {
                        setLoupeActive(false);
                        loupeX.set(180);
                        loupeY.set(180);
                      }}
                    >
                      <motion.div
                        key={activeSwatch.id}
                        drag={isMobile || reduceMotion ? false : "x"}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.45}
                        onDragEnd={(_, info) => {
                          if (Math.abs(info.offset.x) > 70) {
                            cycleSwatch(info.offset.x > 0 ? -1 : 1);
                          }
                        }}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={SPRING_WEIGHTY}
                        className={`relative w-full h-full ${isMobile ? "p-6" : "p-10"} flex items-center justify-center`}
                      >
                        <img
                          src={activeSwatch.img}
                          alt={activeSwatch.title}
                          className="w-full h-full object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.22)] pointer-events-none"
                        />

                        {/* Optical Loupe Magnification Layer */}
                        <motion.div
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-0 ${isMobile ? "p-6" : "p-10"} flex items-center justify-center`}
                          style={{
                            WebkitMaskImage: loupeMask,
                            maskImage: loupeMask,
                            opacity: isMobile || loupeActive ? 1 : 0.7,
                          }}
                        >
                          <img
                            src={activeSwatch.img}
                            alt=""
                            className="w-full h-full object-contain scale-[1.65]"
                          />
                        </motion.div>
                      </motion.div>

                      <button
                        type="button"
                        onClick={() => cycleSwatch(1)}
                        className="absolute bottom-3 right-3 min-h-[40px] px-3 text-xs font-semibold border backdrop-blur-sm cursor-pointer"
                        style={{
                          borderColor: pal.line,
                          backgroundColor: isDark ? "rgba(14,15,17,0.84)" : "rgba(243,239,230,0.88)",
                          color: pal.text,
                          fontFamily: FONT.mono,
                        }}
                      >
                        Next swatch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: ATELIER WORKBENCH (PRIMARY SIGNATURE MOMENT) */}
        {!isHidden("build") && (
          <section
            id="build"
            className={`scroll-mt-20 relative z-10 border-t ${isMobile ? "py-14" : "py-24"}`}
            style={{ borderColor: pal.line }}
          >
            <div className={`mx-auto max-w-[1280px] ${pxPad}`}>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-5" style={{ borderColor: pal.line }}>
                <div>
                  <h2
                    className="font-black uppercase leading-[0.94]"
                    style={{
                      fontFamily: FONT.display,
                      fontSize: isMobile ? "2.6rem" : "4rem",
                    }}
                  >
                    BUILD EVERY PANEL. SNAP THE HARDWARE.
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_BUILDS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="min-h-[40px] px-3 text-xs font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                      style={{
                        borderColor: pal.line,
                        backgroundColor: pal.surface,
                        color: pal.text,
                        fontFamily: FONT.mono,
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`mt-8 ${
                  isMobile || isTablet ? "flex flex-col gap-6" : "grid grid-cols-12 gap-8 items-start"
                }`}
              >
                {/* Left Column: Live Shoe Composite Mat + Drag & Drop Trim Tray */}
                <div className={isMobile || isTablet ? "w-full" : "col-span-7"}>
                  <div
                    ref={shoeStageRef}
                    className={`relative border ${isMobile ? "p-4" : "p-8"} transition-colors duration-200`}
                    style={{
                      borderColor: isOverShoe ? pal.accent : pal.line,
                      backgroundColor: pal.surface,
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-3" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      <span>ACTIVE ZONE: {ZONE_META.find((z) => z.id === activeZone)?.label.toUpperCase()}</span>
                      <span>{upperMaterial.toUpperCase()} / {laceStyle.toUpperCase()} LACE</span>
                    </div>

                    <SneakerCompositeStage
                      zones={zones}
                      upperMaterial={upperMaterial}
                      laceStyle={laceStyle}
                      heelText={heelText}
                      heelFoil={heelFoil}
                      equippedTrims={equippedTrims}
                      activeZone={activeZone}
                      draggingTrim={draggingTrim}
                      onSelectZone={(z) => setActiveZone(z)}
                      onSnapshotReady={setShoeSnapshot}
                      interactive
                    />

                    <div className="mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-[11px]" style={{ borderColor: pal.line, fontFamily: FONT.mono, color: pal.muted }}>
                      <span>CLICK ANY TARGET RING ON THE SHOE TO SELECT PANEL</span>
                      <span>{isOverShoe ? "RELEASE TO ATTACH TRIM" : "DROP HARDWARE ON MAT"}</span>
                    </div>
                  </div>

                  {/* Hardware Trims Tray */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] mb-2" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      <span>HARDWARE & TRIM TRAY</span>
                      <span>{isMobile ? "TAP TO ATTACH" : "DRAG TO SHOE OR CLICK"}</span>
                    </div>

                    <div className={`grid ${isMobile ? "grid-cols-1 gap-2.5" : "grid-cols-3 gap-3"}`}>
                      {TRIM_SPECS.map((trim) => {
                        const equipped = equippedTrims[trim.id];
                        return (
                          <div
                            key={trim.id}
                            className={`border p-3 flex ${isMobile ? "flex-row items-center justify-between" : "flex-col justify-between"} gap-3`}
                            style={{
                              borderColor: equipped ? pal.accent : pal.line,
                              backgroundColor: pal.surface,
                            }}
                          >
                            <button
                              type="button"
                              onPointerDown={(e) => handleTrimPointerDown(trim.id, e)}
                              onPointerMove={handleTrimPointerMove}
                              onPointerUp={(e) => handleTrimPointerUp(trim.id, e)}
                              onClick={() => toggleTrim(trim.id)}
                              className={`flex ${isMobile ? "flex-row items-center flex-1" : "flex-col items-start w-full"} gap-2.5 text-left min-w-0 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2`}
                            >
                              <div
                                className={`${isMobile ? "h-12 w-12" : "h-14 w-full"} shrink-0 flex items-center justify-center p-1.5 border`}
                                style={{ borderColor: pal.line, backgroundColor: pal.bg }}
                              >
                                <img
                                  src={trim.img}
                                  alt={trim.name}
                                  className="max-h-full max-w-full object-contain pointer-events-none"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold leading-snug">{trim.name}</div>
                                <div className="text-[11px] tabular-nums mt-0.5" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                                  +${trim.price} / +{trim.grams} g
                                </div>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleTrim(trim.id)}
                              aria-label={`${equipped ? "Remove" : "Attach"} ${trim.name}`}
                              className={`min-h-[40px] ${isMobile ? "px-3 shrink-0" : "w-full"} text-[11px] font-semibold border cursor-pointer`}
                              style={{
                                borderColor: equipped ? pal.accent : pal.line,
                                backgroundColor: equipped ? pal.accent : "transparent",
                                color: equipped ? pal.accentInk : pal.text,
                                fontFamily: FONT.mono,
                              }}
                            >
                              {equipped ? "Remove" : "Attach"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Zone Tabs, Swatches, Material, Heel Deboss & Live Ticket */}
                <div className={`${isMobile || isTablet ? "w-full" : "col-span-5"} flex flex-col gap-5`}>
                  {/* Zone Tabs */}
                  <div className="border p-4" style={{ borderColor: pal.line, backgroundColor: pal.surface }}>
                    <div className="flex items-center justify-between text-[11px] mb-2.5" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      <span>1. PANEL SELECTION</span>
                      <span>8 ZONES</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {ZONE_META.map((z) => {
                        const active = activeZone === z.id;
                        return (
                          <button
                            key={z.id}
                            type="button"
                            onClick={() => setActiveZone(z.id)}
                            className="relative min-h-[42px] px-2.5 text-xs font-medium border text-left flex items-center gap-2 cursor-pointer"
                            style={{
                              borderColor: active ? pal.accent : pal.line,
                              color: active ? pal.accentInk : pal.text,
                            }}
                          >
                            {active && (
                              <motion.span
                                layoutId="zone-pill"
                                transition={SPRING_SNAP}
                                className="absolute inset-0"
                                style={{ backgroundColor: pal.accent }}
                              />
                            )}
                            <span
                              className="relative z-10 w-2.5 h-2.5 shrink-0 border"
                              style={{
                                backgroundColor: zones[z.id],
                                borderColor: active ? pal.accentInk : pal.line,
                              }}
                            />
                            <span className="relative z-10 leading-tight">{z.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Color Picker for Active Zone */}
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: pal.line }}>
                      <div className="flex items-center justify-between text-[11px] mb-2.5" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                        <span>2. PIGMENT FOR {ZONE_META.find((z) => z.id === activeZone)?.label.toUpperCase()}</span>
                        <span>
                          {SHOE_SWATCHES.find((s) => s.hex === zones[activeZone])?.label.toUpperCase() || "CUSTOM"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {SHOE_SWATCHES.map((sw) => {
                          const selected = zones[activeZone] === sw.hex;
                          return (
                            <button
                              key={sw.id}
                              type="button"
                              onClick={() => setZones((prev) => ({ ...prev, [activeZone]: sw.hex }))}
                              className="min-h-[42px] px-2.5 py-1.5 border flex items-center gap-2.5 text-xs cursor-pointer transition-transform active:scale-[0.97]"
                              style={{
                                borderColor: selected ? pal.accent : pal.line,
                                backgroundColor: selected ? pal.bg : "transparent",
                              }}
                            >
                              <span
                                className="w-4 h-4 shrink-0 border"
                                style={{ backgroundColor: sw.hex, borderColor: pal.line }}
                              />
                              <span className="text-xs leading-tight">{sw.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Upper Material & Lace Style */}
                    <div className={`mt-4 pt-4 border-t grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`} style={{ borderColor: pal.line }}>
                      <div>
                        <div className="text-[11px] mb-2" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                          3. UPPER TEXTURE
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {(
                            [
                              { id: "suede", label: "Hairy Suede" },
                              { id: "leather", label: "Tumbled Leather" },
                              { id: "ripstop", label: "Ripstop Grid" },
                            ] as const
                          ).map((mat) => {
                            const active = upperMaterial === mat.id;
                            return (
                              <button
                                key={mat.id}
                                type="button"
                                onClick={() => setUpperMaterial(mat.id)}
                                className="min-h-[40px] px-3 text-xs font-medium border text-left flex items-center justify-between cursor-pointer"
                                style={{
                                  borderColor: active ? pal.accent : pal.line,
                                  backgroundColor: active ? pal.accent : "transparent",
                                  color: active ? pal.accentInk : pal.text,
                                }}
                              >
                                <span>{mat.label}</span>
                                {active && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] mb-2" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                          4. LACES & HEEL STAMP
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 mb-3">
                          {(
                            [
                              { id: "flat", label: "Flat Cotton" },
                              { id: "rope", label: "Waxed Rope" },
                            ] as const
                          ).map((ls) => {
                            const active = laceStyle === ls.id;
                            return (
                              <button
                                key={ls.id}
                                type="button"
                                onClick={() => setLaceStyle(ls.id)}
                                className="min-h-[40px] px-2 text-xs font-medium border cursor-pointer"
                                style={{
                                  borderColor: active ? pal.accent : pal.line,
                                  backgroundColor: active ? pal.accent : "transparent",
                                  color: active ? pal.accentInk : pal.text,
                                }}
                              >
                                {ls.label}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            maxLength={3}
                            value={heelText}
                            onChange={(e) => setHeelText(e.target.value.toUpperCase())}
                            aria-label="Heel deboss initials"
                            placeholder="R89"
                            className="w-20 min-h-[40px] px-2.5 border text-sm font-semibold uppercase tracking-[0.12em] bg-transparent focus-visible:outline-none focus-visible:ring-2"
                            style={{ borderColor: pal.line, fontFamily: FONT.mono, color: pal.text }}
                          />
                          <button
                            type="button"
                            onClick={() => setHeelFoil((f) => (f === "blind" ? "gold" : "blind"))}
                            className="flex-1 min-h-[40px] px-2.5 text-xs font-medium border cursor-pointer"
                            style={{
                              borderColor: heelFoil === "gold" ? pal.accent : pal.line,
                              color: pal.text,
                              fontFamily: FONT.mono,
                            }}
                          >
                            {heelFoil === "gold" ? "Gold Foil (+$15)" : "Blind Deboss"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Paper Build Ticket */}
                  <div
                    className="border p-5"
                    style={{
                      borderColor: pal.line,
                      backgroundColor: pal.bg,
                    }}
                  >
                    <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: pal.line }}>
                      <div className="flex items-center gap-2 text-xs font-semibold" style={{ fontFamily: FONT.mono }}>
                        <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: pal.accent }} />
                        <span>WORKSHOP TICKET</span>
                      </div>
                      <button
                        type="button"
                        onClick={copyBuildCode}
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border cursor-pointer"
                        style={{ borderColor: pal.line, fontFamily: FONT.mono }}
                      >
                        {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? "Copied" : buildCode}</span>
                      </button>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs" style={{ fontFamily: FONT.mono }}>
                      <div className="flex justify-between">
                        <span style={{ color: pal.muted }}>Last 89 Base Pair ({upperMaterial})</span>
                        <span className="tabular-nums">$245</span>
                      </div>
                      {heelFoil === "gold" && heelText.trim().length > 0 && (
                        <div className="flex justify-between">
                          <span style={{ color: pal.muted }}>Heel Gold Foil ({heelText})</span>
                          <span className="tabular-nums">+$15</span>
                        </div>
                      )}
                      {TRIM_SPECS.filter((t) => equippedTrims[t.id]).map((t) => (
                        <div key={t.id} className="flex justify-between">
                          <span style={{ color: pal.muted }}>{t.name}</span>
                          <span className="tabular-nums">+${t.price}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      className="mt-4 pt-3 border-t flex items-end justify-between"
                      style={{ borderColor: pal.line }}
                    >
                      <div>
                        <div className="text-[11px]" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                          EST. PAIR MASS: {totalGrams} g
                        </div>
                        <div className="text-3xl font-black tabular-nums leading-none mt-1" style={{ fontFamily: FONT.display }}>
                          ${totalPrice} USD
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollToSection("pack")}
                        className="min-h-[44px] px-5 text-xs font-semibold tracking-[0.04em] cursor-pointer transition-transform active:scale-[0.97]"
                        style={{ backgroundColor: pal.accent, color: pal.accentInk }}
                      >
                        Proceed to pack
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dragged Hardware Floating Proxy */}
            {draggingTrim && (
              <div
                aria-hidden="true"
                className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 scale-110"
                style={{ left: dragPos.x, top: dragPos.y }}
              >
                <img
                  src={TRIM_SPECS.find((t) => t.id === draggingTrim)?.img}
                  alt=""
                  className="w-20 h-20 object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.42)]"
                />
              </div>
            )}
          </section>
        )}

        {/* SECTION 5: BEFORE / AFTER PATINA WIPE */}
        {!isHidden("patina") && (
          <section
            id="patina"
            className={`scroll-mt-20 relative z-10 border-t ${isMobile ? "py-14" : "py-24"}`}
            style={{ borderColor: pal.line }}
          >
            <div className={`mx-auto max-w-[1280px] ${pxPad}`}>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div>
                  <h2
                    className="font-black uppercase leading-[0.94]"
                    style={{
                      fontFamily: FONT.display,
                      fontSize: isMobile ? "2.6rem" : "3.8rem",
                    }}
                  >
                    DAY 01 FRESH CUT VS MONTH 12 PATINA.
                  </h2>
                </div>

                <div className="flex items-center gap-1.5">
                  {[
                    { label: "Day 1", val: 92 },
                    { label: "50 / 50", val: 50 },
                    { label: "Month 12", val: 8 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setWipePct(preset.val)}
                      className="min-h-[40px] px-3 text-xs font-medium border cursor-pointer"
                      style={{
                        borderColor: Math.abs(wipePct - preset.val) < 12 ? pal.accent : pal.line,
                        color: pal.text,
                        fontFamily: FONT.mono,
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                ref={wipeContainerRef}
                className="relative w-full aspect-[16/9] max-h-[540px] border overflow-hidden select-none"
                style={{
                  borderColor: pal.line,
                  backgroundColor: pal.surface,
                }}
              >
                {/* Month 12 Underlay */}
                <img
                  src="/templates/solecraft/shoe-month12.webp"
                  alt="Run-89 after twelve months of wear showing natural suede burnishing and leather creasing"
                  className={`absolute inset-0 w-full h-full object-contain ${isMobile ? "p-4" : "p-10"} pointer-events-none`}
                />

                {/* Day 1 Overlay clipped dynamically */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - wipePct}% 0 0)` }}
                >
                  <img
                    src="/templates/solecraft/shoe-day1.webp"
                    alt="Run-89 fresh out of the workshop drawer box on day one"
                    className={`absolute inset-0 w-full h-full object-contain ${isMobile ? "p-4" : "p-10"} pointer-events-none`}
                  />
                </div>

                {/* Corner Labels */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 text-[11px] border"
                  style={{
                    borderColor: pal.line,
                    backgroundColor: pal.bg,
                    fontFamily: FONT.mono,
                  }}
                >
                  DAY 01 UNWORN
                </div>
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 text-[11px] border"
                  style={{
                    borderColor: pal.line,
                    backgroundColor: pal.bg,
                    fontFamily: FONT.mono,
                  }}
                >
                  MONTH 12 PATINA
                </div>

                {/* Wipe Hairline + Drag Handle (touch-none strictly on handle) */}
                <div
                  className="absolute top-0 bottom-0 w-px z-20 pointer-events-none"
                  style={{ left: `${wipePct}%`, backgroundColor: pal.accent }}
                />
                <button
                  type="button"
                  aria-label="Drag comparison divider"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    updateWipeFromClientX(e.clientX);
                  }}
                  onPointerMove={(e) => {
                    if (e.buttons === 0 && e.pointerType === "mouse") return;
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                      updateWipeFromClientX(e.clientX);
                    }
                  }}
                  onPointerUp={(e) => {
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                  }}
                  className="touch-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 min-w-[44px] min-h-[44px] px-2.5 border flex items-center justify-center text-[11px] font-semibold cursor-ew-resize shadow-md"
                  style={{
                    left: `${wipePct}%`,
                    borderColor: pal.accent,
                    backgroundColor: pal.bg,
                    color: pal.text,
                    fontFamily: FONT.mono,
                  }}
                >
                  DRAG
                </button>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 6: PACKAGING RITUAL (DRAWER BOX + TISSUE + THERMAL LABEL) */}
        {!isHidden("pack") && (
          <section
            id="pack"
            className={`scroll-mt-20 relative z-10 border-t ${isMobile ? "py-14" : "py-24"}`}
            style={{ borderColor: pal.line }}
          >
            <div className={`mx-auto max-w-[1280px] ${pxPad}`}>
              <div className={isMobile || isTablet ? "flex flex-col gap-8" : "grid grid-cols-12 gap-10 items-center"}>
                <div className={isMobile || isTablet ? "w-full" : "col-span-5"}>
                  <h2
                    className="font-black uppercase leading-[0.94]"
                    style={{
                      fontFamily: FONT.display,
                      fontSize: isMobile ? "2.6rem" : "3.8rem",
                    }}
                  >
                    WRAPPED IN ARCHIVAL TISSUE. STAMPED TO SIZE.
                  </h2>
                  <p className="mt-3 text-base leading-[1.6]" style={{ color: pal.muted }}>
                    Select your exact millimeter fit below and pack your configured Run-89 pair into the raw oatmeal-kraft drawer box.
                  </p>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-[11px] mb-2" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      <span>SELECT FIT</span>
                      <span>
                        {selectedSize.us} / {selectedSize.eu} / {selectedSize.cm}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {SIZE_CHART.map((sz) => {
                        const active = sz.us === selectedSize.us;
                        return (
                          <button
                            key={sz.us}
                            type="button"
                            onClick={() => setSelectedSize(sz)}
                            className="relative min-h-[46px] px-3 py-2 border text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                            style={{
                              borderColor: active ? pal.accent : pal.line,
                              color: active ? pal.accentInk : pal.text,
                              fontFamily: FONT.mono,
                            }}
                          >
                            {active && (
                              <motion.span
                                layoutId="size-ring"
                                transition={SPRING_SNAP}
                                className="absolute inset-0"
                                style={{ backgroundColor: pal.accent }}
                              />
                            )}
                            <span className="relative z-10 block text-xs font-semibold">{sz.us}</span>
                            <span className="relative z-10 block text-[10px] opacity-80">{sz.cm}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={triggerPackRitual}
                      className="min-h-[48px] flex-1 px-6 text-sm font-semibold tracking-[0.04em] inline-flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.97]"
                      style={{ backgroundColor: pal.accent, color: pal.accentInk }}
                    >
                      <PackageCheck className="w-4 h-4" />
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={packStage === "sealed" ? "repack" : "pack"}
                          initial={reduceMotion ? { opacity: 1 } : { y: 8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={reduceMotion ? { opacity: 0 } : { y: -8, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          {packStage === "sealed" ? "Pack another pair" : "Pack pair"}
                        </motion.span>
                      </AnimatePresence>
                    </button>

                    {packStage !== "idle" && (
                      <button
                        type="button"
                        onClick={resetPackRitual}
                        className="min-h-[48px] px-4 text-xs font-semibold border inline-flex items-center gap-1.5 cursor-pointer"
                        style={{ borderColor: pal.line, color: pal.text }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Layered 3-Depth Drawer Shoebox Stage */}
                <div className={isMobile || isTablet ? "w-full" : "col-span-7"}>
                  <div
                    className="relative aspect-[16/10] border overflow-hidden flex items-center justify-center"
                    style={{
                      borderColor: pal.line,
                      backgroundColor: pal.surface,
                    }}
                  >
                    <div className="absolute top-3 left-3 text-[11px] z-30" style={{ fontFamily: FONT.mono, color: pal.muted }}>
                      {packStage === "idle" && "BOX READY ON BENCH"}
                      {packStage === "open" && "SLIDING DRAWER TRAY..."}
                      {packStage === "shoe-in" && "NESTING CONFIGURED PAIR..."}
                      {packStage === "tissue" && "FOLDING ARCHIVAL TISSUE..."}
                      {packStage === "sealed" && `LABELED: ${selectedSize.us} / ${buildCode}`}
                    </div>

                    <div className="relative w-full max-w-[720px] aspect-[1024/559]">
                      {/* Sliding Inner Tray Assembly */}
                      <motion.div
                        className="absolute inset-0"
                        animate={
                          reduceMotion
                            ? { x: 0, y: 0 }
                            : { x: `${trayTranslate.x}%`, y: `${trayTranslate.y}%` }
                        }
                        transition={SPRING_WEIGHTY}
                      >
                        {/* Back & Interior Floor */}
                        <img
                          src="/templates/solecraft/box-tray-full.webp"
                          alt="Open raw cardboard drawer tray"
                          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        />

                        {/* Clipped Interior Tray Cavity for Shoe & Tissue */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            clipPath:
                              packStage === "shoe-in"
                                ? "polygon(46.2% 51.2%, 68.9% 30.4%, 87.3% 40.1%, 87.3% 100%, 46.2% 100%)"
                                : "polygon(46.2% 51.2%, 68.9% 30.4%, 87.3% 40.1%, 63.9% 64.6%)",
                          }}
                        >
                          {/* Configured Sneaker Nested Inside Tray */}
                          <motion.div
                            className="absolute"
                            style={{
                              left: "51.5%",
                              top: "27%",
                              width: "31.5%",
                              transformOrigin: "center center",
                            }}
                            initial={{ opacity: 0, y: -38, rotate: -25, scale: 0.92 }}
                            animate={
                              packStage === "shoe-in" || packStage === "tissue" || packStage === "sealed"
                                ? { opacity: 1, y: 0, rotate: -25, scale: 1 }
                                : { opacity: 0, y: -38, rotate: -25, scale: 0.92 }
                            }
                            transition={SPRING_WEIGHTY}
                          >
                            {shoeSnapshot ? (
                              <img
                                src={shoeSnapshot}
                                alt="Your custom Run-89 pair inside the box"
                                className="w-full h-auto object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.3)]"
                              />
                            ) : (
                              <img
                                src="/templates/solecraft/shoe-master.webp"
                                alt="Run-89 pair inside the box"
                                className="w-full h-auto object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.3)]"
                              />
                            )}
                          </motion.div>

                          {/* Folded Tissue Paper Dropping Over Shoe Inside Tray */}
                          <motion.img
                            src="/templates/solecraft/tissue-paper.webp"
                            alt="Unbleached archival tissue paper wrapping"
                            className="absolute object-contain"
                            style={{
                              left: "50.5%",
                              top: "31.5%",
                              width: "32.5%",
                              rotate: "-2deg",
                            }}
                            initial={{ opacity: 0, y: -24, scale: 1.04 }}
                            animate={
                              packStage === "tissue" || packStage === "sealed"
                                ? { opacity: 0.84, y: 0, scale: 1 }
                                : { opacity: 0, y: -24, scale: 1.04 }
                            }
                            transition={SPRING_WEIGHTY}
                          />
                        </div>

                        {/* Front Tray Wall & Pull-tab Overlapping Shoe/Tissue */}
                        <img
                          src="/templates/solecraft/box-tray-front.webp"
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        />

                        {/* Thermal Size Sticker Printed on Front Tray Face */}
                        <AnimatePresence>
                          {packStage === "sealed" && (
                            <motion.div
                              initial={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                              animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.42, ease: EASE_PRECISION }}
                              className={`absolute border shadow-sm ${isMobile ? "p-1 text-[7px]" : "p-1.5 text-[9px]"} leading-[1.3]`}
                              style={{
                                left: "49.5%",
                                top: "59.2%",
                                width: "12.4%",
                                transform: "skewY(22.2deg)",
                                backgroundColor: "#f3efe6",
                                borderColor: "#cfc6b4",
                                color: "#171614",
                                fontFamily: FONT.mono,
                              }}
                            >
                              <div className="font-bold tracking-tight">RUN-89</div>
                              <div>{selectedSize.us}</div>
                              <div>{selectedSize.cm}</div>
                              <div className="mt-1 pt-0.5 border-t border-black/20 text-[0.85em] truncate">
                                {buildCode}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Stationary Outer Cardboard Sleeve */}
                      <img
                        src="/templates/solecraft/box-sleeve.webp"
                        alt="Minimal kraft outer shoebox sleeve"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 7: CARE SPECIFICATION LEDGER, FAQ & FOOTER */}
        {!isHidden("care") && (
          <section
            id="care"
            className={`scroll-mt-20 relative z-10 border-t ${isMobile ? "py-14" : "py-20"}`}
            style={{ borderColor: pal.line }}
          >
            <div className={`mx-auto max-w-[1280px] ${pxPad}`}>
              <div className={isMobile ? "flex flex-col gap-10" : "grid grid-cols-12 gap-10"}>
                {/* Left: Care Specification Ledger */}
                <div className={isMobile ? "w-full" : "col-span-6"}>
                  <h2
                    className="text-4xl font-black uppercase leading-none"
                    style={{ fontFamily: FONT.display }}
                  >
                    MATERIAL MAINTENANCE
                  </h2>

                  <div className="mt-6 border-t" style={{ borderColor: pal.line }}>
                    {CARE_ROWS.map((row) => (
                      <div
                        key={row.material}
                        className={`py-4 border-b grid ${isMobile ? "grid-cols-1" : "grid-cols-12"} gap-2 items-baseline`}
                        style={{ borderColor: pal.line }}
                      >
                        <div className={`${isMobile ? "" : "col-span-4"} font-semibold text-sm`}>{row.material}</div>
                        <div className={isMobile ? "" : "col-span-8"}>
                          <div className="text-[11px]" style={{ fontFamily: FONT.mono, color: pal.accent }}>
                            {row.tool} / {row.cadence}
                          </div>
                          <p className="mt-1 text-sm leading-[1.5]" style={{ color: pal.muted }}>
                            {row.protocol}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Measured FAQ Accordion */}
                <div className={isMobile ? "w-full" : "col-span-6"}>
                  <h2
                    className="text-4xl font-black uppercase leading-none"
                    style={{ fontFamily: FONT.display }}
                  >
                    FREQUENT QUESTIONS
                  </h2>

                  <div className="mt-6 border-t" style={{ borderColor: pal.line }}>
                    {FAQ_ROWS.map((item, idx) => {
                      const open = openFaq === idx;
                      return (
                        <div key={item.q} className="border-b" style={{ borderColor: pal.line }}>
                          <button
                            type="button"
                            onClick={() => setOpenFaq(open ? null : idx)}
                            aria-expanded={open}
                            className="w-full min-h-[52px] py-3.5 flex items-center justify-between gap-4 text-left text-sm font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                          >
                            <span>{item.q}</span>
                            <motion.span
                              animate={{ rotate: open ? 180 : 0 }}
                              transition={{ duration: 0.22 }}
                              className="shrink-0"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.span>
                          </button>

                          <AnimatePresence initial={false}>
                            {open && (
                              <motion.div
                                initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                transition={{ duration: 0.24, ease: EASE_PRECISION }}
                                className="overflow-hidden"
                              >
                                <p className="pb-4 text-sm leading-[1.6]" style={{ color: pal.muted }}>
                                  {item.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="relative z-10 border-t py-8" style={{ borderColor: pal.line }}>
          <div className={`mx-auto max-w-[1280px] ${pxPad} flex flex-wrap items-center justify-between gap-4 text-xs`} style={{ fontFamily: FONT.mono, color: pal.muted }}>
            <div className="flex items-center gap-3">
              <span className="font-semibold" style={{ color: pal.text }}>{brandLabel}</span>
              <span>/</span>
              <span>LAST 89 ARCHIVE WORKSHOP</span>
            </div>
            <div className="flex items-center gap-4">
              <span>BUILD {buildCode}</span>
              <button
                type="button"
                onClick={() => scrollToSection("last")}
                className="underline underline-offset-4 cursor-pointer"
                style={{ color: pal.text }}
              >
                Back to top
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ExplodedLayerImage({
  layer,
  spread,
  active,
  isMobile,
  reduce,
  onClick,
}: {
  layer: AnatomyLayer;
  spread: MotionValue<number>;
  active: boolean;
  isMobile: boolean;
  reduce: boolean;
  onClick: () => void;
}) {
  const factor = isMobile ? 0.56 : 1;
  const y = useTransform(spread, [0, 1], [0, layer.spreadOffset * factor]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={reduce ? undefined : { y }}
      animate={{
        opacity: active ? 1 : 0.42,
        scale: active ? 1.03 : 0.98,
      }}
      transition={SPRING_WEIGHTY}
      aria-label={`Inspect ${layer.title}`}
      className={`relative w-full flex justify-center ${isMobile ? "-my-1.5" : "-my-2"} cursor-pointer focus-visible:outline-none focus-visible:ring-2`}
    >
      <div className="mx-auto w-full max-w-[440px] flex justify-center">
        <img
          src={layer.img}
          alt={layer.title}
          style={{ width: `${layer.widthPct}%` }}
          className="h-auto object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)]"
        />
      </div>
    </motion.button>
  );
}
