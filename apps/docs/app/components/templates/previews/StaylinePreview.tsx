"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  type CSSProperties,
  type FormEvent,
} from "react";
import { TemplateCustomizerContext } from "../../../context/TemplateCustomizerContext";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA CONSTANTS (Strict TypeScript — 0 any)
   ═══════════════════════════════════════════════════════════════════════════ */

export type ThemeMode = "light" | "dark";

type StatusBadgeType = "s-ok" | "s-warn" | "s-bad" | "s-info";

interface BookingFeedItem {
  readonly id: string;
  readonly roomType: string;
  readonly channel: string;
  readonly statusClass: StatusBadgeType;
  readonly total: number;
}

interface TimelineBarDef {
  readonly row: number;
  readonly col: number;
  readonly span: number;
}

interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

const INITIAL_FEED: readonly BookingFeedItem[] = [
  { id: "b-0", roomType: "Deluxe King · 3 nights", channel: "Direct", statusClass: "s-ok", total: 612 },
  { id: "b-1", roomType: "Twin Garden · 2 nights", channel: "Partner", statusClass: "s-info", total: 298 },
  { id: "b-2", roomType: "Family Suite · 5 nights", channel: "Phone", statusClass: "s-warn", total: 1240 },
  { id: "b-3", roomType: "Studio · 1 night", channel: "Direct", statusClass: "s-ok", total: 129 },
];

const POOL_ITEMS: readonly Omit<BookingFeedItem, "id">[] = [
  { roomType: "Deluxe King · 3 nights", channel: "Direct", statusClass: "s-ok", total: 612 },
  { roomType: "Twin Garden · 2 nights", channel: "Partner", statusClass: "s-info", total: 298 },
  { roomType: "Family Suite · 5 nights", channel: "Phone", statusClass: "s-warn", total: 1240 },
  { roomType: "Studio · 1 night", channel: "Direct", statusClass: "s-ok", total: 129 },
  { roomType: "Deluxe King · 2 nights", channel: "Partner", statusClass: "s-info", total: 408 },
  { roomType: "Attic Double · 4 nights", channel: "Direct", statusClass: "s-ok", total: 720 },
  { roomType: "Studio · 6 nights", channel: "Corporate", statusClass: "s-warn", total: 690 },
];

const SCRUB_WORDS: readonly string[] = [
  "Stayline", "replaces", "the", "whiteboard,", "three", "spreadsheets",
  "and", "the", "group", "chat", "with", "one", "calendar", "that",
  "sells", "your", "rooms,", "assigns", "them,", "cleans", "them",
  "and", "gets", "you", "paid."
];

const OCCUPANCY_CHART_VALUES: readonly number[] = [71, 74, 69, 78, 82, 91, 96, 83, 76, 79, 84, 88, 93, 87];

const TIMELINE_DAYS: readonly string[] = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIMELINE_LABELS: readonly string[] = ["Inbox", "301", "302", "303", "304", "305"];

const TIMELINE_EXISTING_BARS: readonly TimelineBarDef[] = [
  { row: 1, col: 0, span: 4 },
  { row: 1, col: 5, span: 4 },
  { row: 2, col: 1, span: 4 },
  { row: 2, col: 7, span: 3 },
  { row: 3, col: 0, span: 3 },
  { row: 3, col: 4, span: 3 },
  { row: 4, col: 0, span: 4 },
  { row: 4, col: 8, span: 2 },
  { row: 5, col: 2, span: 3 },
  { row: 5, col: 6, span: 3 },
];

const STORY_NOTES: readonly string[] = [
  "New booking · Deluxe King · Mon 12 to Thu 15 Oct",
  "Assigned to room 304 · no gaps, no double booking",
  "Housekeeping notified · clean by 11:00 on Thu 15",
  "Deposit captured · balance settles at check-in",
];

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "How do you prevent double bookings?",
    answer: "Every channel reads and writes one availability record. When a room sells anywhere, it closes everywhere within about a second, so two guests can never hold the same night.",
  },
  {
    question: "Can I keep using my current channel manager?",
    answer: "Yes. Stayline can sit beside it during the trial, then take over channel sync when you are ready to switch.",
  },
  {
    question: "Does housekeeping need to install anything?",
    answer: "No. Staff open a link on their phone, see their rooms for the day and tap to change status.",
  },
  {
    question: "What happens to my data if I leave?",
    answer: "You can export reservations, guests and payments as spreadsheets at any time, on every plan.",
  },
];

const HOUSEKEEPING_ROOMS: readonly string[] = ["301", "302", "303", "304"];
const HOUSEKEEPING_STATUSES: readonly { label: string; badge: StatusBadgeType }[] = [
  { label: "Dirty", badge: "s-bad" },
  { label: "Cleaning", badge: "s-warn" },
  { label: "Inspect", badge: "s-info" },
  { label: "Ready", badge: "s-ok" },
];

const PAYMENT_BAR_VALUES: readonly number[] = [38, 52, 44, 71, 63, 88, 100];

/* ═══════════════════════════════════════════════════════════════════════════
   SCOPED STYLESHEET (High-Contrast Light/Dark + Zero-Conflict Sticky System)
   ═══════════════════════════════════════════════════════════════════════════ */

const STAYLINE_CSS = `
.stayline {
  --background: #ffffff;
  --foreground: #09090b;
  --card: #ffffff;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --border: #e4e4e7;
  --primary: #18181b;
  --primary-foreground: #fafafa;
  --ring: #a1a1aa;
  --ok: #16a34a;
  --warn: #d97706;
  --bad: #dc2626;
  --info: #2563eb;
  --radius: .625rem;
  --font: "Geist", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  background: var(--background);
  color: var(--foreground);
  font-family: var(--font);
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  position: relative;
  width: 100%;
  min-height: 100%;
  text-align: left;
}

.stayline[data-theme="dark"] {
  --background: #09090b;
  --foreground: #fafafa;
  --card: #0c0c0f;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --border: #27272a;
  --primary: #fafafa;
  --primary-foreground: #18181b;
  --ring: #52525b;
  --ok: #4ade80;
  --warn: #fbbf24;
  --bad: #f87171;
  --info: #60a5fa;
  color-scheme: dark;
}

.stayline[data-theme="light"] {
  --background: #ffffff;
  --foreground: #09090b;
  --card: #ffffff;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --border: #e4e4e7;
  --primary: #18181b;
  --primary-foreground: #fafafa;
  --ring: #a1a1aa;
  --ok: #16a34a;
  --warn: #d97706;
  --bad: #dc2626;
  --info: #2563eb;
  color-scheme: light;
}

.stayline * { box-sizing: border-box; border-color: var(--border); }
.stayline a { color: inherit; text-decoration: none; }
.stayline button, .stayline input { font: inherit; color: inherit; }
.stayline button { cursor: pointer; }
.stayline :focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }

/* ── WebGL Wave Shader Canvas: Full fixed background at z-index 0 ── */
.stayline canvas.stayline-canvas,
.stayline-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  z-index: 0;
}

.stayline main, .stayline footer { position: relative; z-index: 1; }

.stayline .w { width: 100%; max-width: 1152px; margin-inline: auto; padding-inline: 20px; }
.stayline h1, .stayline h2, .stayline h3, .stayline p { margin: 0; }
.stayline h1, .stayline h2, .stayline h3 { font-weight: 600; letter-spacing: -.035em; text-wrap: balance; }
.stayline h2 { font-size: clamp(1.9rem, 4vw, 3rem); line-height: 1.08; }
.stayline .mono { font-family: var(--mono); font-size: .72rem; letter-spacing: .04em; text-transform: uppercase; color: var(--muted-foreground); }
.stayline .muted { color: var(--muted-foreground); }
.stayline svg.i { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex: none; }

/* Buttons & Badges */
.stayline .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 36px; padding: 0 16px; border-radius: calc(var(--radius) - 2px); font-size: .875rem; font-weight: 500; border: 1px solid transparent; white-space: nowrap; transition: background .15s, opacity .15s, border-color .15s; }
.stayline .btn.lg { height: 44px; padding: 0 24px; font-size: .95rem; }
.stayline .btn-d { background: var(--primary); color: var(--primary-foreground); }
.stayline .btn-d:hover { opacity: .88; }
.stayline .btn-o { background: var(--background); border-color: var(--border); box-shadow: 0 1px 2px rgba(0,0,0,.05); }
.stayline .btn-o:hover { background: var(--muted); }
.stayline .btn-g { background: transparent; }
.stayline .btn-g:hover { background: var(--muted); }
.stayline .btn.ic { width: 36px; padding: 0; }

.stayline .badge { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--border); border-radius: 999px; padding: 2px 10px; font-size: .75rem; font-weight: 500; line-height: 1.5; background: var(--background); }
.stayline .badge.s-ok { color: var(--ok); background: color-mix(in srgb, var(--ok) 11%, transparent); border-color: color-mix(in srgb, var(--ok) 28%, transparent); }
.stayline .badge.s-warn { color: var(--warn); background: color-mix(in srgb, var(--warn) 11%, transparent); border-color: color-mix(in srgb, var(--warn) 30%, transparent); }
.stayline .badge.s-bad { color: var(--bad); background: color-mix(in srgb, var(--bad) 10%, transparent); border-color: color-mix(in srgb, var(--bad) 28%, transparent); }
.stayline .badge.s-info { color: var(--info); background: color-mix(in srgb, var(--info) 10%, transparent); border-color: color-mix(in srgb, var(--info) 28%, transparent); }

.stayline .card { border: 1px solid var(--border); border-radius: var(--radius); background: var(--card); box-shadow: 0 1px 2px rgba(0,0,0,.04); min-width: 0; }
.stayline .card-h { padding: 20px 20px 0; display: grid; gap: 4px; }
.stayline .card-t { font-size: .95rem; font-weight: 600; letter-spacing: -.01em; }
.stayline .card-d { font-size: .875rem; color: var(--muted-foreground); }
.stayline .card-c { padding: 20px; }

.stayline .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); position: relative; }
.stayline .dot::after { content: ""; position: absolute; inset: 0; border-radius: 50%; background: var(--ok); animation: ping 2s infinite; }
@keyframes ping { 0% { transform: scale(1); opacity: .6; } 80%, 100% { transform: scale(2.6); opacity: 0; } }

/* Scroll Progress Bar */
.stayline #bar { position: sticky; left: 0; top: 0; height: 2px; width: 100%; background: var(--foreground); transform-origin: 0 50%; transform: scaleX(0); z-index: 60; }

/* Sticky Navigation */
.stayline nav { position: sticky; top: 0; left: 0; right: 0; z-index: 50; padding-top: env(safe-area-inset-top, 0px); background: color-mix(in srgb, var(--background) 82%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
.stayline nav .w { display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 60px; }
.stayline .logo { display: flex; align-items: center; gap: 9px; font-weight: 600; letter-spacing: -.03em; font-size: 1.05rem; }
.stayline .logo i { width: 24px; height: 24px; border-radius: 7px; background: var(--primary); color: var(--primary-foreground); display: grid; place-items: center; }
.stayline .links { display: flex; gap: 4px; margin-left: 24px; margin-right: auto; }
.stayline .links a { padding: 6px 12px; border-radius: calc(var(--radius) - 2px); font-size: .875rem; color: var(--muted-foreground); transition: color .15s, background .15s; }
.stayline .links a:hover { color: var(--foreground); background: var(--muted); }
.stayline .nav-r { display: flex; gap: 8px; align-items: center; }
.stayline .t-sun { display: none; }
.stayline[data-theme="dark"] .t-sun { display: block; }
.stayline[data-theme="dark"] .t-moon { display: none; }

/* Hero Section */
.stayline .hero { padding-top: 100px; text-align: center; }
.stayline .hero .badge { padding: 4px 12px 4px 6px; margin-bottom: 24px; animation: fade .8s both; }
.stayline .hero .badge b { background: var(--primary); color: var(--primary-foreground); border-radius: 999px; padding: 0 8px; font-weight: 500; font-size: .7rem; }

.stayline h1 {
  font-size: clamp(2.2rem, 6.5vw, 5rem);
  line-height: 1.04;
  letter-spacing: -.045em;
  max-width: 16ch;
  margin-inline: auto;
}
.stayline[data-theme="dark"] h1 {
  text-shadow: 0 0 24px var(--background), 0 0 8px var(--background);
}
.stayline[data-theme="light"] h1 {
  text-shadow: none;
}
.stayline h1 .ln { display: block; overflow: visible; padding-bottom: .08em; }
.stayline h1 .ln > span { display: inline-block; animation: rise .9s cubic-bezier(.2,.8,.2,1) both; }
.stayline h1 .ln:nth-child(2) > span { animation-delay: .1s; }

@keyframes rise { from { transform: translateY(105%); } to { transform: none; } }
@keyframes fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

.stayline .lede {
  margin: 20px auto 0;
  max-width: 54ch;
  color: color-mix(in srgb, var(--foreground) 78%, transparent);
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.5;
  animation: fade 1s .35s both;
}
.stayline[data-theme="dark"] .lede {
  text-shadow: 0 0 14px var(--background);
}
.stayline[data-theme="light"] .lede {
  text-shadow: none;
}

.stayline .cta-row { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; animation: fade 1s .5s both; }
.stayline .fine { color: var(--foreground); margin-top: 18px; animation: fade 1s .65s both; }

/* Dashboard Mockup */
.stayline .shotwrap { margin-top: 48px; perspective: 1600px; padding-bottom: 24px; }
.stayline .shot {
  text-align: left;
  transform: rotateX(var(--rx, 14deg)) translateY(var(--ty, 0px)) scale(var(--sc, .96));
  transform-origin: 50% 0;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  background: var(--background);
  box-shadow: 0 30px 80px -30px rgba(0,0,0,.35), 0 0 0 6px color-mix(in srgb, var(--muted) 60%, transparent);
  overflow: hidden;
  animation: fade 1.1s .6s both;
  will-change: transform;
}
.stayline .chrome { display: flex; align-items: center; gap: 7px; padding: 11px 16px; border-bottom: 1px solid var(--border); background: var(--card); }
.stayline .chrome i { width: 10px; height: 10px; border-radius: 50%; background: var(--muted); }
.stayline .chrome span { margin-left: 12px; font-family: var(--mono); font-size: .7rem; color: var(--muted-foreground); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stayline .dash { padding: 20px; display: grid; gap: 14px; background: color-mix(in srgb, var(--muted) 35%, var(--background)); }
.stayline .dh { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.stayline .dh h3 { font-size: 1.3rem; }
.stayline .stats4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.stayline .stat { padding: 16px; }
.stayline .stat .l { font-size: .8rem; color: var(--muted-foreground); font-weight: 500; }
.stayline .stat b { display: block; font-size: 1.65rem; letter-spacing: -.04em; font-weight: 600; margin-top: 6px; font-variant-numeric: tabular-nums; line-height: 1.1; }
.stayline .stat small { font-size: .75rem; color: var(--muted-foreground); }
.stayline .stat small em { font-style: normal; color: var(--ok); font-weight: 500; }

.stayline .row2 { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 14px; }
.stayline .chart { display: flex; align-items: flex-end; gap: 6px; height: 150px; margin-top: 6px; }
.stayline .chart i { flex: 1; border-radius: 4px 4px 2px 2px; background: var(--primary); opacity: .18; height: var(--h); transform-origin: bottom; animation: grow 1s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(.9s + var(--i) * .04s); }
.stayline .chart i.hi { opacity: 1; }
@keyframes grow { from { transform: scaleY(0); } to { transform: none; } }

.stayline .cl { display: flex; gap: 6px; margin-top: 8px; }
.stayline .cl span { flex: 1; text-align: center; font-family: var(--mono); font-size: .6rem; color: var(--muted-foreground); }

.stayline table { width: 100%; border-collapse: collapse; font-size: .85rem; }
.stayline th { text-align: left; font-weight: 500; color: var(--muted-foreground); font-size: .75rem; padding: 8px 10px; border-bottom: 1px solid var(--border); }
.stayline td { padding: 10px; border-bottom: 1px solid var(--border); white-space: nowrap; }
.stayline tr:last-child td { border-bottom: 0; }
.stayline td.r, .stayline th.r { text-align: right; font-variant-numeric: tabular-nums; }
.stayline tbody tr { animation: slide .5s cubic-bezier(.2,.8,.2,1) both; }
@keyframes slide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
.stayline .tw { overflow: hidden; }

/* Scrub Text */
.stayline .scrub { padding-block: 100px; }
.stayline .scrub p { font-size: clamp(1.6rem, 4.2vw, 3rem); line-height: 1.18; letter-spacing: -.035em; font-weight: 600; max-width: 22em; }
.stayline .scrub .wd { color: var(--foreground); opacity: .2; transition: opacity .25s; }
.stayline .scrub .wd.on { opacity: 1; }

/* Standard Section Layout */
.stayline .sec { padding-block: 96px; }
.stayline .head { max-width: 680px; margin-bottom: 48px; display: grid; gap: 14px; }
.stayline .head.c { text-align: center; margin-inline: auto; justify-items: center; }
.stayline .sub { color: var(--muted-foreground); font-size: 1.075rem; }

/* Metrics Strip */
.stayline .metrics { border-block: 1px solid var(--border); background: color-mix(in srgb, var(--background) 65%, transparent); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.stayline .sg { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.stayline .sg > div { padding: 36px 24px; border-left: 1px solid var(--border); }
.stayline .sg > div:first-child { border-left: 0; padding-left: 0; }
.stayline .sg b { display: block; font-size: clamp(2rem, 4vw, 3rem); font-weight: 600; letter-spacing: -.05em; line-height: 1; font-variant-numeric: tabular-nums; }
.stayline .sg p { margin-top: 10px; color: var(--muted-foreground); font-size: .9rem; max-width: 24ch; }

/* ── Pinned Story Timeline (480vh scroll track) ── */
.stayline .story {
  height: 480vh;
  background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--background) 78%, transparent) 10%, color-mix(in srgb, var(--background) 78%, transparent) 90%, transparent);
  position: relative;
}
.stayline .pin {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 56px;
  align-items: center;
  padding-top: 60px;
}
.stayline .steps { position: relative; display: grid; gap: 4px; padding-left: 26px; }
.stayline .steps::before { content: ""; position: absolute; left: 0; top: 4px; bottom: 4px; width: 2px; background: var(--border); border-radius: 2px; }
.stayline .steps .fill { position: absolute; left: 0; top: 4px; width: 2px; border-radius: 2px; height: calc((100% - 8px) * var(--p, 0)); background: var(--foreground); }
.stayline .step { padding: 12px 0; opacity: .35; transition: opacity .4s; }
.stayline .step.on { opacity: 1; }
.stayline .step h3 { font-size: clamp(1.25rem, 2.1vw, 1.65rem); margin-top: 6px; }
.stayline .step p { color: var(--muted-foreground); margin-top: 8px; max-height: 0; overflow: hidden; opacity: 0; transition: max-height .5s, opacity .5s; }
.stayline .step.on p { max-height: 150px; opacity: 1; }

.stayline .stage { padding: 16px; --hh: 32px; --rh: 48px; background: var(--card); }
.stayline .tl { position: relative; padding-left: 56px; height: calc(var(--hh) + 6 * var(--rh)); }
.stayline .tl .days { position: absolute; left: 56px; right: 0; top: 0; height: var(--hh); display: grid; grid-template-columns: repeat(10, 1fr); }
.stayline .days span { font-family: var(--mono); font-size: .6rem; color: var(--muted-foreground); text-align: center; line-height: 1.25; display: grid; place-content: center; }
.stayline .tl .rows { position: absolute; left: 56px; right: 0; top: var(--hh); bottom: 0; border: 1px solid var(--border); border-radius: 8px; background-image: linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px); background-size: 10% 100%, 100% var(--rh); }
.stayline .tl .lbl { position: absolute; left: 0; top: var(--hh); width: 52px; }
.stayline .lbl span { display: flex; align-items: center; height: var(--rh); font-family: var(--mono); font-size: .68rem; color: var(--muted-foreground); transition: color .3s; }
.stayline .lbl span.act { color: var(--foreground); font-weight: 500; }
.stayline .bar { position: absolute; left: calc(56px + (100% - 56px) * var(--c) / 10 + 2px); width: calc((100% - 56px) * var(--n) / 10 - 4px); top: calc(var(--hh) + var(--row) * var(--rh) + 6px); height: calc(var(--rh) - 12px); border-radius: 6px; background: var(--muted); border: 1px solid var(--border); }
.stayline .bar.new { --row: 0; background: var(--background); border: 1px dashed var(--foreground); color: var(--foreground); display: flex; align-items: center; padding-inline: 10px; font-family: var(--mono); font-size: .64rem; white-space: nowrap; overflow: hidden; transition: top .9s cubic-bezier(.65,0,.2,1), background .4s, color .4s; animation: pulse 1.8s infinite; }
.stayline .st1 .bar.new, .stayline .st2 .bar.new, .stayline .st3 .bar.new { --row: 4; background: var(--primary); color: var(--primary-foreground); border-style: solid; animation: none; }
.stayline .bar.hk { --row: 4; --c: 7; --n: 1; opacity: 0; transform: scale(.7); transition: opacity .5s, transform .5s; background: color-mix(in srgb, var(--warn) 14%, transparent); border-color: color-mix(in srgb, var(--warn) 45%, transparent); color: var(--warn); display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: .6rem; }
.stayline .st2 .bar.hk, .stayline .st3 .bar.hk { opacity: 1; transform: none; }
@keyframes pulse { 50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--foreground) 8%, transparent); } }

.stayline .note { margin-top: 14px; border: 1px solid var(--border); border-radius: calc(var(--radius) - 2px); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; gap: 14px; min-height: 64px; background: var(--muted); }
.stayline .note p { font-size: .9rem; transition: opacity .3s; }
.stayline .note .amt { font-size: 1.6rem; font-weight: 600; letter-spacing: -.04em; font-variant-numeric: tabular-nums; opacity: 0; transition: opacity .5s; white-space: nowrap; }
.stayline .st3 .note .amt { opacity: 1; }

/* Bento Grid */
.stayline .bento { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 16px; }
.stayline .c-a { grid-column: span 7; }
.stayline .c-b { grid-column: span 5; }
.stayline .c-c, .stayline .c-d, .stayline .c-e { grid-column: span 4; }
.stayline .bento .card { display: flex; flex-direction: column; }
.stayline .bento .card-c { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; }
.stayline .bento .card-h { padding-bottom: 6px; }

.stayline .lst { display: grid; gap: 8px; }
.stayline .lst > div { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 12px; border: 1px solid var(--border); border-radius: calc(var(--radius) - 2px); background: var(--background); font-size: .88rem; }
.stayline .lst em { font-style: normal; font-family: var(--mono); font-size: .7rem; color: var(--muted-foreground); margin-left: auto; font-variant-numeric: tabular-nums; }

.stayline .rate svg { width: 100%; height: auto; display: block; overflow: visible; }
.stayline .rate .ln { fill: none; stroke: var(--foreground); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 2s cubic-bezier(.3,.7,.2,1); }
.stayline .rate .ar { opacity: 0; transition: opacity 1.2s .9s; }
.stayline .rate.in .ln { stroke-dashoffset: 0; }
.stayline .rate.in .ar { opacity: 1; }
.stayline .rate text { font-family: var(--mono); font-size: 10px; fill: var(--muted-foreground); }
.stayline .rate .pk { fill: var(--foreground); font-size: 11px; font-weight: 500; }
.stayline .rate .grid line { stroke: var(--border); }

.stayline .bub { max-width: 88%; padding: 9px 13px; border-radius: 14px; font-size: .88rem; }
.stayline .bub.g { background: var(--muted); border-bottom-left-radius: 4px; }
.stayline .bub.s { justify-self: end; background: var(--primary); color: var(--primary-foreground); border-bottom-right-radius: 4px; }
.stayline .chat { display: grid; gap: 8px; }
.stayline .js .bub { opacity: 0; transform: translateY(10px); transition: opacity .5s, transform .5s; }
.stayline .js .in .bub { opacity: 1; transform: none; }
.stayline .in .bub:nth-child(2) { transition-delay: .8s; }
.stayline .in .bub:nth-child(3) { transition-delay: 1.6s; }

.stayline .big { font-size: 2.4rem; font-weight: 600; letter-spacing: -.05em; line-height: 1; font-variant-numeric: tabular-nums; }
.stayline .pbars { display: flex; align-items: flex-end; gap: 6px; height: 72px; margin-top: 8px; }
.stayline .pbars i { flex: 1; background: var(--primary); border-radius: 4px 4px 2px 2px; height: var(--h); opacity: .85; transform-origin: bottom; }
.stayline .js .pbars i { transform: scaleY(0); transition: transform 1s cubic-bezier(.2,.8,.2,1); }
.stayline .js .in .pbars i { transform: none; }

/* Pricing */
.stayline .tabs { display: inline-flex; padding: 4px; background: var(--muted); border-radius: calc(var(--radius)); gap: 2px; }
.stayline .tabs button { border: 0; background: transparent; padding: 6px 16px; border-radius: calc(var(--radius) - 3px); font-size: .875rem; font-weight: 500; color: var(--muted-foreground); transition: all .2s; }
.stayline .tabs button[aria-selected="true"] { background: var(--background); color: var(--foreground); box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.stayline .prices { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: stretch; }
.stayline .tier { padding: 28px; display: flex; flex-direction: column; gap: 20px; }
.stayline .tier.hot { border-color: var(--foreground); box-shadow: 0 0 0 1px var(--foreground), 0 20px 40px -24px rgba(0,0,0,.35); }
.stayline .tier .pr { font-size: 3rem; letter-spacing: -.06em; font-weight: 600; line-height: 1; font-variant-numeric: tabular-nums; }
.stayline .tier .pr small { font-size: .9rem; color: var(--muted-foreground); letter-spacing: 0; font-weight: 400; }
.stayline .tier ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; font-size: .92rem; }
.stayline .tier li { display: flex; gap: 10px; align-items: flex-start; }
.stayline .tier li svg { margin-top: 3px; color: var(--ok); }
.stayline .tier .btn { margin-top: auto; }

/* FAQ */
.stayline .faq { max-width: 720px; margin-inline: auto; }
.stayline .q { border-bottom: 1px solid var(--border); }
.stayline .q button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; background: none; border: 0; padding: 20px 0; text-align: left; font-weight: 500; font-size: 1rem; }
.stayline .q button svg { transition: transform .25s; color: var(--muted-foreground); }
.stayline .q[data-open="true"] button svg { transform: rotate(180deg); }
.stayline .q .a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s; }
.stayline .q[data-open="true"] .a { grid-template-rows: 1fr; }
.stayline .q .a > div { overflow: hidden; }
.stayline .q .a p { padding-bottom: 20px; color: var(--muted-foreground); font-size: .95rem; }

/* Final CTA Section */
.stayline .final { padding-block: 120px; text-align: center; position: relative; }
.stayline .final h2 { font-size: clamp(2.2rem, 5.5vw, 4.4rem); max-width: 14ch; margin-inline: auto; letter-spacing: -.05em; }
.stayline .final p { margin: 20px auto 0; color: var(--muted-foreground); max-width: 44ch; font-size: 1.1rem; }
.stayline .form { margin: 30px auto 0; display: flex; gap: 8px; max-width: 440px; flex-wrap: wrap; justify-content: center; }
.stayline .form input { flex: 1 1 220px; min-width: 0; height: 44px; border-radius: calc(var(--radius) - 2px); border: 1px solid var(--border); background: var(--background); padding: 0 14px; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
.stayline .form input::placeholder { color: var(--muted-foreground); }
.stayline #fmsg { margin-top: 12px; min-height: 1.4em; font-size: .88rem; color: var(--muted-foreground); }

/* Footer */
.stayline footer { border-top: 1px solid var(--border); background: var(--background); padding-block: 48px 32px; }
.stayline .fg { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 32px; }
.stayline .fg h4 { margin: 0 0 12px; font-size: .85rem; font-weight: 600; }
.stayline .fg a { display: block; color: var(--muted-foreground); font-size: .88rem; padding: 3px 0; }
.stayline .fg a:hover { color: var(--foreground); }
.stayline .fb { margin-top: 36px; padding-top: 20px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: .82rem; color: var(--muted-foreground); }

/* Scroll Reveal */
.stayline .js [data-r] { opacity: 0; transform: translateY(26px); transition: opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1); transition-delay: var(--d, 0s); }
.stayline .js [data-r].in { opacity: 1; transform: none; }

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSIVE DESIGN: MEDIA QUERIES + IS-MOBILE / IS-TABLET CLASSES
   ═══════════════════════════════════════════════════════════════════════════ */

@media (max-width: 760px) {
  .stayline .links, .stayline .nav-r .btn-g.tx { display: none; }
  .stayline h1 { font-size: 2.1rem; }
  .stayline .hero { padding-top: 80px; }
  .stayline .lede { font-size: 0.95rem; }
}
.stayline.is-mobile .links, .stayline.is-mobile .nav-r .btn-g.tx { display: none !important; }
.stayline.is-mobile h1 { font-size: 2.1rem !important; }
.stayline.is-mobile .hero { padding-top: 80px !important; }
.stayline.is-mobile .lede { font-size: 0.95rem !important; }

@media (max-width: 860px) {
  .stayline .stats4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stayline .row2 { grid-template-columns: 1fr; }
  .stayline .dash { padding: 14px; }
  .stayline .hide-m { display: none; }
  .stayline .shotwrap { margin-top: 36px; }
  .stayline .pin { grid-template-columns: 1fr; gap: 18px; align-content: center; }
  .stayline .step:not(.on) { display: none; }
  .stayline .steps .fill, .stayline .steps::before { display: none; }
  .stayline .steps { padding-left: 0; }
  .stayline .step h3 { font-size: 1.25rem; }
  .stayline .step p { font-size: .92rem; }
  .stayline .stage { --rh: 38px; padding: 12px; }
  .stayline .tl { padding-left: 40px; }
  .stayline .tl .days, .stayline .tl .rows { left: 40px; }
  .stayline .tl .lbl { width: 36px; }
  .stayline .bar { left: calc(40px + (100% - 40px) * var(--c) / 10 + 2px); width: calc((100% - 40px) * var(--n) / 10 - 4px); }
  .stayline .bar.new { font-size: .56rem; padding-inline: 6px; }
  .stayline .bar.new .lg { display: none; }
  .stayline .bar.hk { font-size: 0; }
  .stayline .note p { font-size: .84rem; }
  .stayline .note .amt { font-size: 1.3rem; }
}
.stayline.is-mobile .stats4 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
.stayline.is-mobile .row2 { grid-template-columns: 1fr !important; }
.stayline.is-mobile .dash { padding: 14px !important; }
.stayline.is-mobile .hide-m { display: none !important; }
.stayline.is-mobile .shotwrap { margin-top: 36px !important; }
.stayline.is-mobile .pin { grid-template-columns: 1fr !important; gap: 18px !important; align-content: center !important; }
.stayline.is-mobile .step:not(.on) { display: none !important; }
.stayline.is-mobile .steps .fill, .stayline.is-mobile .steps::before { display: none !important; }
.stayline.is-mobile .steps { padding-left: 0 !important; }
.stayline.is-mobile .step h3 { font-size: 1.25rem !important; }
.stayline.is-mobile .step p { font-size: 0.92rem !important; }
.stayline.is-mobile .stage { --rh: 38px !important; padding: 12px !important; }
.stayline.is-mobile .tl { padding-left: 40px !important; }
.stayline.is-mobile .tl .days, .stayline.is-mobile .tl .rows { left: 40px !important; }
.stayline.is-mobile .tl .lbl { width: 36px !important; }
.stayline.is-mobile .bar { left: calc(40px + (100% - 40px) * var(--c) / 10 + 2px) !important; width: calc((100% - 40px) * var(--n) / 10 - 4px) !important; }
.stayline.is-mobile .bar.new { font-size: 0.56rem !important; padding-inline: 6px !important; }
.stayline.is-mobile .bar.new .lg { display: none !important; }
.stayline.is-mobile .bar.hk { font-size: 0 !important; }
.stayline.is-mobile .note p { font-size: 0.84rem !important; }
.stayline.is-mobile .note .amt { font-size: 1.3rem !important; }

@media (max-width: 900px) {
  .stayline .c-a, .stayline .c-b, .stayline .c-c, .stayline .c-d, .stayline .c-e { grid-column: 1 / -1; }
  .stayline .prices { grid-template-columns: 1fr; }
}
.stayline.is-mobile .c-a, .stayline.is-mobile .c-b, .stayline.is-mobile .c-c, .stayline.is-mobile .c-d, .stayline.is-mobile .c-e { grid-column: 1 / -1 !important; }
.stayline.is-mobile .prices { grid-template-columns: 1fr !important; }

@media (max-width: 800px) {
  .stayline .sg { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stayline .sg > div:nth-child(3) { border-left: 0; }
  .stayline .sg > div:nth-child(n+3) { border-top: 1px solid var(--border); }
  .stayline .sg > div { padding: 28px 16px; }
  .stayline .sg > div:nth-child(odd) { padding-left: 0; }
}
.stayline.is-mobile .sg { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
.stayline.is-mobile .sg > div:nth-child(3) { border-left: 0 !important; }
.stayline.is-mobile .sg > div:nth-child(n+3) { border-top: 1px solid var(--border) !important; }
.stayline.is-mobile .sg > div { padding: 28px 16px !important; }
.stayline.is-mobile .sg > div:nth-child(odd) { padding-left: 0 !important; }

@media (max-width: 700px) {
  .stayline .sec { padding-block: 72px; }
  .stayline .scrub { padding-block: 80px; }
  .stayline .fg { grid-template-columns: 1fr 1fr; }
  .stayline .fg > div:first-child { grid-column: 1 / -1; }
}
.stayline.is-mobile .sec { padding-block: 72px !important; }
.stayline.is-mobile .scrub { padding-block: 80px !important; }
.stayline.is-mobile .fg { grid-template-columns: 1fr 1fr !important; }
.stayline.is-mobile .fg > div:first-child { grid-column: 1 / -1 !important; }

@media (prefers-reduced-motion: reduce) {
  .stayline *, .stayline *::before, .stayline *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    transition-delay: 0s !important;
  }
  .stayline .shot { transform: none !important; }
}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   WEBGL SHADER CONSTANTS (48 lines flowing wave physics)
   ═══════════════════════════════════════════════════════════════════════════ */

const VS_SOURCE = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

const FS_SOURCE = `precision mediump float;
uniform vec2 r; uniform float t; uniform float s; uniform vec2 m; uniform vec3 bg; uniform vec3 ink;
void main(){
  vec2 uv=gl_FragCoord.xy/r; float asp=r.x/r.y;
  vec2 p=vec2((uv.x-.5)*asp*2.,(uv.y-.5)*2.);
  p+=(m-.5)*vec2(.08,.05);
  float px=2.2/r.y; float a=0.; float h=0.;
  for(int i=0;i<48;i++){
    float f=float(i)/47.; float g=f*2.-1.;
    float spread=.66+.40*sin(p.x*.55+t*.06+s*.8);
    float amp=.09+.24*(1.-abs(g))*(1.+.35*sin(s*1.3));
    float y=g*spread
      +sin(p.x*1.25+f*2.4+t*.30+s*1.9)*amp
      +sin(p.x*2.6-f*1.5+t*.19-s*.9)*.05
      -.12;
    float d=abs(p.y-y);
    float w=1.0-.45*abs(g);
    a+=smoothstep(2.4*px,0.,d)*(.34+.40*(1.-abs(g)));
    h+=exp(-d*d*1400.)*.028*w;
  }
  a=min(a+h,1.);
  vec3 col=mix(bg,ink,a*.9);
  gl_FragColor=vec4(col,1.);
}`;

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT — StaylinePreview
   ═══════════════════════════════════════════════════════════════════════════ */

export function StaylinePreview() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const shotRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLParagraphElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLElement>(null);

  /* Container width tracking for container-aware mobile/tablet adaptation */
  const [containerWidth, setContainerWidth] = useState<number>(0);

  /* Sync with docs TemplateCustomizerContext if present, else fallback */
  const customizer = useContext(TemplateCustomizerContext);
  const [internalTheme, setInternalTheme] = useState<ThemeMode>("dark");

  const theme: ThemeMode =
    customizer && (customizer.config.theme === "dark" || customizer.config.theme === "light")
      ? customizer.config.theme
      : internalTheme;

  const themeRef = useRef<ThemeMode>(theme);
  themeRef.current = theme;

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = theme === "light" ? "dark" : "light";
    setInternalTheme(nextTheme);
    if (customizer?.updateConfig) {
      customizer.updateConfig({ theme: nextTheme });
    }
  }, [theme, customizer]);

  /* Live Feed State */
  const [feed, setFeed] = useState<readonly BookingFeedItem[]>(INITIAL_FEED);

  /* Live Channel Ages State */
  const [channelAges, setChannelAges] = useState<readonly number[]>([2, 5, 1, 9]);

  /* Housekeeping Room Statuses */
  const [hkStatuses, setHkStatuses] = useState<readonly number[]>([3, 1, 2, 0]);

  /* Story Timeline Step & Note & Payout State */
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [noteText, setNoteText] = useState<string>(STORY_NOTES[0] ?? "");
  const [noteOpacity, setNoteOpacity] = useState<number>(1);
  const [amountText, setAmountText] = useState<string>("+$0.00");
  const amtTimerRef = useRef<number>(0);

  /* Pricing Billing Period ('m' | 'y') */
  const [billingPeriod, setBillingPeriod] = useState<"m" | "y">("m");
  const [pocketPrice, setPocketPrice] = useState<number>(39);
  const [propertyPrice, setPropertyPrice] = useState<number>(119);

  /* FAQ Open Indices */
  const [openFaq, setOpenFaq] = useState<number>(0);

  /* Contact Form Status Message */
  const [formMsg, setFormMsg] = useState<string>("");

  /* Wave Shader Controls Ref */
  const waveControlsRef = useRef<{
    onScrollWave: (y: number, vh: number, bookTop: number) => void;
    readColors: () => void;
    updateSize: () => void;
  } | null>(null);

  /* Detect Scroll Container (window vs nearest ancestor overflow-y auto) */
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | Window | null>(null);
  const [isWindowContainer, setIsWindowContainer] = useState<boolean>(true);

  const detectScrollContainer = useCallback(() => {
    const el = rootRef.current;
    if (!el || typeof window === "undefined") {
      setScrollContainer(window);
      setIsWindowContainer(true);
      return;
    }

    let parent: HTMLElement | null = el.parentElement;
    let foundScrollable: HTMLElement | null = null;

    while (parent && parent !== document.body && parent !== document.documentElement) {
      const style = window.getComputedStyle(parent);
      const overflowY = style.overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        foundScrollable = parent;
        break;
      }
      parent = parent.parentElement;
    }

    if (foundScrollable) {
      setScrollContainer(foundScrollable);
      setIsWindowContainer(false);
    } else {
      setScrollContainer(window);
      setIsWindowContainer(true);
    }
  }, []);

  useEffect(() => {
    detectScrollContainer();
    const handleWinResize = () => detectScrollContainer();
    window.addEventListener("resize", handleWinResize);
    return () => window.removeEventListener("resize", handleWinResize);
  }, [detectScrollContainer]);

  /* ResizeObserver for Container Width & Canvas Resizing */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
      waveControlsRef.current?.updateSize();
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ─── WEBGL WAVE SHADER LIFECYCLE ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const compileShader = (type: number, src: string): WebGLShader | null => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VS_SOURCE);
    const fs = compileShader(gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) return;

    const pr = gl.createProgram();
    if (!pr) return;
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);

    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      gl.deleteProgram(pr);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }

    gl.useProgram(pr);

    const buf = gl.createBuffer();
    if (!buf) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const locA = gl.getAttribLocation(pr, "a");
    if (locA >= 0) {
      gl.enableVertexAttribArray(locA);
      gl.vertexAttribPointer(locA, 2, gl.FLOAT, false, 0, 0);
    }

    const uR = gl.getUniformLocation(pr, "r");
    const uT = gl.getUniformLocation(pr, "t");
    const uS = gl.getUniformLocation(pr, "s");
    const uM = gl.getUniformLocation(pr, "m");
    const uBg = gl.getUniformLocation(pr, "bg");
    const uInk = gl.getUniformLocation(pr, "ink");

    let bg: [number, number, number] = [9 / 255, 9 / 255, 11 / 255];
    let ink: [number, number, number] = [250 / 255, 250 / 255, 250 / 255];
    let mx = 0.5;
    let my = 0.5;
    let tx = 0.5;
    let ty = 0.5;
    let sc = 0;
    let ssc = 0;
    let animId = 0;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const readColors = () => {
      if (themeRef.current === "dark") {
        bg = [9 / 255, 9 / 255, 11 / 255]; // Pure #09090b
        ink = [250 / 255, 250 / 255, 250 / 255]; // Pure #fafafa
      } else {
        bg = [1, 1, 1]; // Pure #ffffff
        ink = [24 / 255, 24 / 255, 27 / 255]; // Crisp dark ink #18181b
      }
      if (isReduced) {
        draw(performance.now());
      }
    };

    const updateSize = () => {
      const root = rootRef.current;
      if (!root || !canvas) return;

      const rect = root.getBoundingClientRect();
      const w = Math.max(2, Math.floor(rect.width || window.innerWidth));
      let h = window.innerHeight;
      if (!isWindowContainer && scrollContainer instanceof HTMLElement) {
        h = Math.max(2, scrollContainer.clientHeight || window.innerHeight);
      }

      const k = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(2, Math.floor(w * k));
      canvas.height = Math.max(2, Math.floor(h * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      ssc += (sc - ssc) * 0.08;

      if (uR) gl.uniform2f(uR, canvas.width, canvas.height);
      if (uT) gl.uniform1f(uT, now / 1000);
      if (uS) gl.uniform1f(uS, ssc);
      if (uM) gl.uniform2f(uM, mx, my);
      if (uBg) gl.uniform3f(uBg, bg[0], bg[1], bg[2]);
      if (uInk) gl.uniform3f(uInk, ink[0], ink[1], ink[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    updateSize();
    readColors();

    const handleResize = () => {
      updateSize();
      if (isReduced) {
        draw(performance.now());
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        tx = (e.clientX - rect.left) / rect.width;
        ty = 1 - (e.clientY - rect.top) / rect.height;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const loop = (now: number) => {
      draw(now);
      if (!isReduced) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);

    const onScrollWave = (y: number, vh: number, bookTop: number) => {
      sc = vh > 0 ? y / vh : 0;
      let o = Math.max(0.62, 1 - y / (vh * 2));
      if (bookTop < vh) {
        o = Math.max(o, Math.min(1, (vh - bookTop) / (vh * 0.9)));
      }
      canvas.style.opacity = o.toFixed(3);
      if (isReduced) {
        draw(performance.now());
      }
    };

    waveControlsRef.current = {
      onScrollWave,
      readColors,
      updateSize,
    };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(pr);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [isWindowContainer, scrollContainer]);

  /* Re-read colors whenever theme changes */
  useEffect(() => {
    waveControlsRef.current?.readColors();
  }, [theme]);

  /* ─── SCROLL DRIVEN PHYSICS & STORY ORCHESTRATION ─── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const target: EventTarget = scrollContainer || window;
    let tick = false;

    const onScroll = () => {
      if (tick) return;
      tick = true;

      requestAnimationFrame(() => {
        tick = false;

        const isWin = target === window;
        const currentTarget = isWin ? window : (target as HTMLElement);

        const y: number = isWin ? window.scrollY : (currentTarget as HTMLElement).scrollTop;
        const vh: number = isWin ? window.innerHeight : (currentTarget as HTMLElement).clientHeight;
        const vw: number = isWin ? window.innerWidth : (currentTarget as HTMLElement).clientWidth;
        const rootEl = rootRef.current;
        const totalHeight = rootEl ? rootEl.scrollHeight : document.body.scrollHeight;
        const maxScroll = Math.max(1, totalHeight - vh);

        // 1. Progress Bar Scale
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${(maxScroll > 0 ? y / maxScroll : 0).toFixed(4)})`;
        }

        // 2. Wave Shader Opacity Surge for "Fill tomorrow night before dinner"
        let bookTop = 99999;
        if (bookRef.current) {
          const bRect = bookRef.current.getBoundingClientRect();
          const containerTop = isWin ? 0 : (currentTarget as HTMLElement).getBoundingClientRect().top;
          bookTop = bRect.top - containerTop;
        }
        waveControlsRef.current?.onScrollWave(y, vh, bookTop);

        // 3. 3D Dashboard Mockup Tilt & Scale
        const k = Math.min(1, y / (vh * 0.55));
        const isMobileScreen = vw < 860;
        if (shotRef.current) {
          const rx = ((isMobileScreen ? 7 : 14) * (1 - k)).toFixed(2);
          const scScale = (0.96 + 0.04 * k).toFixed(3);
          const ty = (-30 * k).toFixed(1);
          shotRef.current.style.setProperty("--rx", `${rx}deg`);
          shotRef.current.style.setProperty("--sc", scScale);
          shotRef.current.style.setProperty("--ty", `${ty}px`);
        }

        // 4. Scrubbed Text Lighting
        if (scrubRef.current) {
          const r = scrubRef.current.getBoundingClientRect();
          const containerTop = isWin ? 0 : (currentTarget as HTMLElement).getBoundingClientRect().top;
          const rTop = r.top - containerTop;
          const p = Math.max(0, Math.min(1, (vh * 0.82 - rTop) / (vh * 0.5 + r.height * 0.4)));
          const activeWordCount = Math.round(p * SCRUB_WORDS.length);
          const wordSpans = scrubRef.current.querySelectorAll<HTMLSpanElement>(".wd");
          wordSpans.forEach((w, i) => {
            if (i < activeWordCount) {
              w.classList.add("on");
            } else {
              w.classList.remove("on");
            }
          });
        }

        // 5. Pinned Story Timeline Progress & Step Trigger
        if (storyRef.current && fillRef.current) {
          const storyEl = storyRef.current;
          let storyTop = storyEl.offsetTop;

          if (!isWin && currentTarget instanceof HTMLElement) {
            const cRect = currentTarget.getBoundingClientRect();
            const sRect = storyEl.getBoundingClientRect();
            storyTop = sRect.top - cRect.top + y;
          }

          const scrollableDistance = storyEl.offsetHeight - vh;
          const storyProgress = scrollableDistance > 0
            ? Math.max(0, Math.min(1, (y - storyTop) / scrollableDistance))
            : 0;

          fillRef.current.style.setProperty("--p", storyProgress.toFixed(3));

          const targetStep = Math.min(3, Math.max(0, Math.floor(storyProgress * 4)));
          setCurrentStep((prev) => {
            if (prev !== targetStep) {
              setNoteOpacity(0);
              window.setTimeout(() => {
                setNoteText(STORY_NOTES[targetStep] ?? "");
                setNoteOpacity(1);
              }, 160);

              if (targetStep === 3) {
                cancelAnimationFrame(amtTimerRef.current);
                const t0 = performance.now();
                const animateAmount = (tNow: number) => {
                  const animK = Math.min(1, (tNow - t0) / 1200);
                  const easeK = 1 - Math.pow(1 - animK, 3);
                  setAmountText(`+$${(612 * easeK).toFixed(2)}`);
                  if (animK < 1) {
                    amtTimerRef.current = requestAnimationFrame(animateAmount);
                  }
                };
                amtTimerRef.current = requestAnimationFrame(animateAmount);
              } else {
                cancelAnimationFrame(amtTimerRef.current);
                setAmountText("+$0.00");
              }
              return targetStep;
            }
            return prev;
          });
        }
      });
    };

    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(amtTimerRef.current);
    };
  }, [scrollContainer]);

  /* ─── LIVE BOOKING SIMULATOR (Every 2.8s) ─── */
  useEffect(() => {
    let poolIndex = 4;
    const interval = window.setInterval(() => {
      setFeed((prev) => {
        const nextItem = POOL_ITEMS[poolIndex % POOL_ITEMS.length];
        if (!nextItem) return prev;
        poolIndex++;
        const newItem: BookingFeedItem = {
          ...nextItem,
          id: `b-${Date.now()}-${poolIndex}`,
        };
        const updated = [newItem, ...prev];
        return updated.length > 4 ? updated.slice(0, 4) : updated;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  /* ─── LIVE CHANNELS TICKER (Every 1.8s) ─── */
  useEffect(() => {
    const interval = window.setInterval(() => {
      setChannelAges((prev) =>
        prev.map((age) => (Math.random() < 0.4 ? 1 : Math.min(14, age + 1)))
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  /* ─── INTERSECTION OBSERVER FOR DATA-R AND BENTO CHARTS ─── */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    el.classList.add("js");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
          }
        });
      },
      { threshold: 0.12 }
    );

    const revealElements = el.querySelectorAll<HTMLElement>("[data-r]");
    revealElements.forEach((node) => revealObserver.observe(node));

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const target = e.target as HTMLElement;
          countObserver.unobserve(target);

          const targetNum = Number(target.getAttribute("data-count") ?? "0");
          const hasDec = target.getAttribute("data-dec") === "1";
          const startTime = performance.now();
          const duration = 1200;

          const tickCount = (now: number) => {
            const progress = Math.min(1, (now - startTime) / duration);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = targetNum * easeOut;
            target.textContent = hasDec ? currentVal.toFixed(1) : Math.round(currentVal).toString();
            if (progress < 1) {
              requestAnimationFrame(tickCount);
            }
          };
          requestAnimationFrame(tickCount);
        });
      },
      { threshold: 0.3 }
    );

    const countElements = el.querySelectorAll<HTMLElement>("[data-count]");
    countElements.forEach((node) => countObserver.observe(node));

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
    };
  }, []);

  /* Pricing Billing Toggle */
  const handlePeriodChange = (period: "m" | "y") => {
    setBillingPeriod(period);
    if (period === "y") {
      setPocketPrice(31);
      setPropertyPrice(95);
    } else {
      setPocketPrice(39);
      setPropertyPrice(119);
    }
  };

  /* Contact / Demo Form Handler */
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMsg("Thank you! A link to your demo room is on its way.");
  };

  /* Stage Class Names: accumulates st1, st2, st3 matching reference implementation */
  const stageClasses = `card stage ${currentStep >= 1 ? "st1" : ""} ${currentStep >= 2 ? "st2" : ""} ${currentStep >= 3 ? "st3" : ""}`.trim();

  const isMobile =
    containerWidth > 0
      ? containerWidth < 768
      : typeof window !== "undefined" && window.innerWidth < 768;

  const isTablet =
    containerWidth > 0
      ? containerWidth >= 768 && containerWidth < 1024
      : typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024;

  return (
    <div
      ref={rootRef}
      className={`stayline ${isMobile ? "is-mobile" : ""} ${isTablet ? "is-tablet" : ""}`}
      data-theme={theme}
    >
      {/* ── Scoped Stylesheet Injection ── */}
      <style dangerouslySetInnerHTML={{ __html: STAYLINE_CSS }} />

      {/* ── SVG Symbol Definitions ── */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <symbol id="i-bed" viewBox="0 0 24 24">
          <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </symbol>
        <symbol id="i-moon" viewBox="0 0 24 24">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </symbol>
        <symbol id="i-sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </symbol>
        <symbol id="i-chev" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </symbol>
      </svg>

      {/* ── Wave Shader Canvas (Direct sticky sibling — sticks across whole page seamlessly) ── */}
      <canvas
        ref={canvasRef}
        className="stayline-canvas"
        aria-hidden="true"
      />

      {/* ── 2px Scroll Progress Bar ── */}
      <div id="bar" className="scroll-bar" ref={barRef} />

      {/* ── Navigation Header ── */}
      <nav>
        <div className="w">
          <a className="logo" href="#top" aria-label="Stayline home">
            <i>
              <svg className="i">
                <use href="#i-bed" />
              </svg>
            </i>
            Stayline
          </a>
          <div className="links">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="nav-r">
            <button
              className="btn btn-g ic"
              id="theme"
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <svg className="i t-moon">
                <use href="#i-moon" />
              </svg>
              <svg className="i t-sun">
                <use href="#i-sun" />
              </svg>
            </button>
            <a className="btn btn-g tx" href="#book">
              Sign in
            </a>
            <a className="btn btn-d" href="#book">
              Get started
            </a>
          </div>
        </div>
      </nav>

      {/* ── Main Content Landmark ── */}
      <main id="top">
        {/* ── Hero Section ── */}
        <section className="hero">
          <div className="w">
            <a className="badge" href="#features">
              <b>New</b> Night audit now runs by itself{" "}
              <svg className="i" style={{ width: "13px", height: "13px" }}>
                <use href="#i-arrow" />
              </svg>
            </a>
            <h1>
              <span className="ln">
                <span>Rooms that fill,</span>
              </span>
              <span className="ln">
                <span>clean and bill themselves.</span>
              </span>
            </h1>
            <p className="lede">
              Stayline connects bookings, housekeeping and payments for hotels, guesthouses and room
              rentals. One calendar, no double bookings.
            </p>
            <div className="cta-row">
              <a className="btn btn-d lg" href="#book">
                Book a demo{" "}
                <svg className="i">
                  <use href="#i-arrow" />
                </svg>
              </a>
              <a className="btn btn-o lg" href="#how">
                See how a night runs
              </a>
            </div>
            <p className="fine mono">Setup in 20 minutes · Free for 14 days</p>

            {/* ── 3D Perspective Tilted Dashboard ── */}
            <div className="shotwrap">
              <div className="shot" id="shot" ref={shotRef}>
                <div className="chrome">
                  <i />
                  <i />
                  <i />
                  <span>app.stayline.io / harbor-house / overview</span>
                </div>
                <div className="dash">
                  <div className="dh">
                    <div>
                      <h3>Overview</h3>
                      <p className="card-d">Harbor House · 30 rooms · Thu 8 Oct</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span className="badge">
                        <span className="dot" /> Live
                      </span>
                      <span className="btn btn-d hide-m" style={{ pointerEvents: "none" }}>
                        New booking
                      </span>
                    </div>
                  </div>
                  <div className="stats4">
                    <div className="card stat">
                      <span className="l">Occupancy</span>
                      <b>
                        <span data-count="87">0</span>%
                      </b>
                      <small>
                        <em>+4%</em> vs last week
                      </small>
                    </div>
                    <div className="card stat">
                      <span className="l">Average rate</span>
                      <b>
                        $<span data-count="184">0</span>
                      </b>
                      <small>
                        <em>+$12</em> vs last week
                      </small>
                    </div>
                    <div className="card stat">
                      <span className="l">Revenue, 7 days</span>
                      <b>
                        $<span data-count="12480">0</span>
                      </b>
                      <small>
                        <em>+18%</em> vs last week
                      </small>
                    </div>
                    <div className="card stat">
                      <span className="l">Arrivals today</span>
                      <b>
                        <span data-count="9">0</span>
                      </b>
                      <small>7 departures</small>
                    </div>
                  </div>
                  <div className="row2">
                    <div className="card">
                      <div className="card-h">
                        <span className="card-t">Occupancy</span>
                        <span className="card-d">Last 14 nights</span>
                      </div>
                      <div className="card-c">
                        <div className="chart" id="chart">
                          {OCCUPANCY_CHART_VALUES.map((v, i) => (
                            <i
                              key={`oc-${i}`}
                              className={i === 13 ? "hi" : ""}
                              style={
                                {
                                  "--h": `${v}%`,
                                  "--i": i,
                                } as CSSProperties
                              }
                            />
                          ))}
                        </div>
                        <div className="cl" id="cl">
                          {OCCUPANCY_CHART_VALUES.map((_, i) => {
                            const dd = 25 + i;
                            const label = i % 2 === 0 ? (dd > 31 ? dd - 31 : dd) : "";
                            return <span key={`cl-${i}`}>{label}</span>;
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="card tw">
                      <div className="card-h">
                        <span className="card-t">Recent bookings</span>
                        <span className="card-d">From every channel, live</span>
                      </div>
                      <div className="card-c" style={{ paddingTop: "8px" }}>
                        <table>
                          <thead>
                            <tr>
                              <th>Room type</th>
                              <th className="hide-m">Channel</th>
                              <th className="r">Total</th>
                            </tr>
                          </thead>
                          <tbody id="feed">
                            {feed.map((it) => (
                              <tr key={it.id}>
                                <td>{it.roomType}</td>
                                <td className="hide-m">
                                  <span className={`badge ${it.statusClass}`}>{it.channel}</span>
                                </td>
                                <td className="r">${it.total.toLocaleString("en-US")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Scrub Text Section ── */}
        <section className="scrub">
          <div className="w">
            <p id="scrub" ref={scrubRef}>
              {SCRUB_WORDS.map((w, i) => (
                <span key={`scrub-w-${i}`} className="wd">
                  {w}{" "}
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* ── Metrics Strip ── */}
        <div className="metrics">
          <div className="w sg">
            <div data-r>
              <b>
                <span data-count="1.2" data-dec="1">
                  0
                </span>
                s
              </b>
              <p>for a booking to reach every channel</p>
            </div>
            <div data-r style={{ "--d": ".08s" } as CSSProperties}>
              <b>
                <span data-count="0">0</span>
              </b>
              <p>double bookings since the calendar went live</p>
            </div>
            <div data-r style={{ "--d": ".16s" } as CSSProperties}>
              <b>
                −<span data-count="31">0</span>%
              </b>
              <p>front desk time spent on admin</p>
            </div>
            <div data-r style={{ "--d": ".24s" } as CSSProperties}>
              <b>
                +<span data-count="18">0</span>%
              </b>
              <p>revenue per available room</p>
            </div>
          </div>
        </div>

        {/* ── Pinned Sticky Story Section ── */}
        <section className="story" id="how" ref={storyRef}>
          <div className="pin w">
            <div className="steps" id="steps">
              <div className="fill" ref={fillRef} />
              <div className="mono" style={{ marginBottom: "8px" }}>
                One booking, start to payout
              </div>
              <div className={`step ${currentStep === 0 ? "on" : ""}`}>
                <span className="mono">Step 1 of 4</span>
                <h3>A guest books</h3>
                <p>
                  A reservation arrives from any channel and appears in your inbox in under a second,
                  with dates, room type and deposit.
                </p>
              </div>
              <div className={`step ${currentStep === 1 ? "on" : ""}`}>
                <span className="mono">Step 2 of 4</span>
                <h3>Stayline picks the room</h3>
                <p>
                  Deluxe King 304 is the only room free for all three nights without breaking a longer
                  stay. It is assigned automatically.
                </p>
              </div>
              <div className={`step ${currentStep === 2 ? "on" : ""}`}>
                <span className="mono">Step 3 of 4</span>
                <h3>Housekeeping is told</h3>
                <p>
                  The cleaning task lands on the floor team&apos;s phones, timed so the room is ready
                  by 11:00 on check-out day.
                </p>
              </div>
              <div className={`step ${currentStep === 3 ? "on" : ""}`}>
                <span className="mono">Step 4 of 4</span>
                <h3>You get paid</h3>
                <p>
                  The deposit is captured at booking and the balance settles at check-in. Everything
                  reconciles to one payout.
                </p>
              </div>
            </div>

            <div className={stageClasses} id="stage" aria-live="polite">
              <div className="tl" id="tl">
                <div className="days" id="days">
                  {TIMELINE_DAYS.map((d, i) => (
                    <span key={`t-day-${i}`}>
                      {d}
                      <br />
                      {8 + i}
                    </span>
                  ))}
                </div>
                <div className="rows" />
                <div className="lbl" id="lbl">
                  {TIMELINE_LABELS.map((lbl, i) => (
                    <span
                      key={`t-lbl-${i}`}
                      className={
                        (currentStep === 0 && i === 0) || (currentStep >= 1 && i === 4) ? "act" : ""
                      }
                    >
                      {lbl}
                    </span>
                  ))}
                </div>

                {TIMELINE_EXISTING_BARS.map((b, i) => (
                  <div
                    key={`t-bar-${i}`}
                    className="bar"
                    style={
                      {
                        "--row": b.row,
                        "--c": b.col,
                        "--n": b.span,
                      } as CSSProperties
                    }
                  />
                ))}

                <div
                  className="bar new"
                  style={
                    {
                      "--c": 4,
                      "--n": 3,
                    } as CSSProperties
                  }
                >
                  #4821<span className="lg"> · 3 nights</span>
                </div>
                <div className="bar hk">Clean</div>
              </div>

              <div className="note">
                <p id="note" style={{ opacity: noteOpacity }}>
                  {noteText}
                </p>
                <div className="amt" id="amt">
                  {amountText}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Bento Grid Section ── */}
        <section className="sec" id="features">
          <div className="w">
            <div className="head" data-r>
              <span className="mono">Features</span>
              <h2>Everything the front desk does at night, done before you wake up.</h2>
            </div>
            <div className="bento">
              {/* Card A: One calendar, every channel */}
              <article className="card c-a" data-r>
                <div className="card-h">
                  <h3 className="card-t">One calendar, every channel</h3>
                  <p className="card-d">
                    Your site, partner portals and the phone desk all write to the same availability.
                    Whatever sells in one place closes everywhere.
                  </p>
                </div>
                <div className="card-c">
                  <div className="lst" id="channels">
                    {[
                      "Booking page",
                      "Partner portal A",
                      "Partner portal B",
                      "Phone desk",
                    ].map((name, j) => (
                      <div key={`chan-${j}`}>
                        <span>{name}</span>
                        <em>{channelAges[j] ?? 1}s ago</em>
                        <span className="badge s-ok">Synced</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* Card B: Rates that follow demand */}
              <article className="card c-b rate" id="rate" data-r style={{ "--d": ".08s" } as CSSProperties}>
                <div className="card-h">
                  <h3 className="card-t">Rates that follow demand</h3>
                  <p className="card-d">
                    Raise prices automatically as rooms sell down. Drop them to fill gaps three days
                    out.
                  </p>
                </div>
                <div className="card-c">
                  <svg viewBox="0 0 360 160" preserveAspectRatio="none" aria-label="Rate curve visualization">
                    <g className="grid">
                      <line x1="0" y1="30" x2="360" y2="30" />
                      <line x1="0" y1="70" x2="360" y2="70" />
                      <line x1="0" y1="110" x2="360" y2="110" />
                    </g>
                    <path
                      className="ar"
                      d="M 10 120 C 80 120, 110 95, 160 85 C 210 75, 230 40, 310 32 L 310 140 L 10 140 Z"
                      fill="color-mix(in srgb,var(--foreground) 6%,transparent)"
                    />
                    <path
                      className="ln"
                      d="M 10 120 C 80 120, 110 95, 160 85 C 210 75, 230 40, 310 32"
                      pathLength="1"
                    />
                    <circle cx="310" cy="32" r="4" fill="var(--foreground)" />
                    <text x="310" y="22" textAnchor="end" className="pk">
                      $240 · peak Sat
                    </text>
                    <text x="14" y="134">
                      Thu $140
                    </text>
                    <text x="160" y="134">
                      Fri $185
                    </text>
                    <text x="310" y="134" textAnchor="end">
                      Sat $240
                    </text>
                  </svg>
                </div>
              </article>

              {/* Card C: Housekeeping */}
              <article className="card c-c" data-r style={{ "--d": ".04s" } as CSSProperties}>
                <div className="card-h">
                  <h3 className="card-t">Housekeeping on their own phone</h3>
                  <p className="card-d">No clipboards. Cleaners see their list and tap to ready a room.</p>
                </div>
                <div className="card-c">
                  <div className="lst" id="hklist">
                    {HOUSEKEEPING_ROOMS.map((rm, idx) => {
                      const cur = hkStatuses[idx] ?? 0;
                      const statusDef = HOUSEKEEPING_STATUSES[cur] ?? { label: "Ready", badge: "s-ok" as StatusBadgeType };
                      return (
                        <div
                          key={`hk-rm-${rm}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setHkStatuses((prev) => {
                              const next = [...prev];
                              const nextVal = ((next[idx] ?? 0) + 1) % HOUSEKEEPING_STATUSES.length;
                              next[idx] = nextVal;
                              return next;
                            });
                          }}
                        >
                          <span>Room {rm}</span>
                          <span className={`badge ${statusDef.badge}`}>{statusDef.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>

              {/* Card D: Guest Chat Messages */}
              <article className="card c-d" data-r style={{ "--d": ".12s" } as CSSProperties}>
                <div className="card-h">
                  <h3 className="card-t">Key codes sent on time</h3>
                  <p className="card-d">Send door codes, Wi-Fi and parking 3 hours before arrival.</p>
                </div>
                <div className="card-c">
                  <div className="chat" id="chat">
                    <div className="bub g">Hi Sarah, your key code for room 304 is 8204#.</div>
                    <div className="bub s">Thanks! Can we drop bags early?</div>
                    <div className="bub g">Yes, locker room is open from 10:00.</div>
                  </div>
                </div>
              </article>

              {/* Card E: Settled Payments Bar Chart */}
              <article className="card c-e" data-r style={{ "--d": ".2s" } as CSSProperties}>
                <div className="card-h">
                  <h3 className="card-t">Settles to your bank daily</h3>
                  <p className="card-d">Deposits, extra nights and bar tabs roll into one payout.</p>
                </div>
                <div className="card-c">
                  <div className="big">$8,420</div>
                  <span className="mono">Settled this morning</span>
                  <div className="pbars" id="pbars">
                    {PAYMENT_BAR_VALUES.map((h, i) => (
                      <i key={`pbar-${i}`} style={{ "--h": `${h}%` } as CSSProperties} />
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── Pricing Section ── */}
        <section className="sec" id="pricing">
          <div className="w">
            <div className="head c" data-r>
              <span className="mono">Pricing</span>
              <h2>Flat rate per room. No booking fee, no surprises.</h2>
              <p className="sub">Try everything free for 14 days. Cancel anytime with one tap.</p>
              <div className="tabs" role="tablist" style={{ marginTop: "12px" }}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={billingPeriod === "m"}
                  onClick={() => handlePeriodChange("m")}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={billingPeriod === "y"}
                  onClick={() => handlePeriodChange("y")}
                >
                  Yearly · save 20%
                </button>
              </div>
            </div>

            <div className="prices">
              {/* Pocket Tier */}
              <div className="card tier" data-r>
                <div>
                  <div className="card-t">Pocket</div>
                  <p className="card-d">Up to 8 rooms · guesthouses & cabins</p>
                </div>
                <div className="pr">
                  $<span id="pr-p">{pocketPrice}</span>
                  <small>/mo</small>
                </div>
                <ul>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    One master calendar
                  </li>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    Two booking channels synced
                  </li>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    Automated confirmation emails
                  </li>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    Card payments at 1.4% + 20c
                  </li>
                </ul>
                <a className="btn btn-o" href="#book">
                  Start free
                </a>
              </div>

              {/* Property Tier (Featured Hot) */}
              <div className="card tier hot" data-r style={{ "--d": ".08s" } as CSSProperties}>
                <div>
                  <span className="badge s-ok" style={{ marginBottom: "8px" }}>
                    Most popular
                  </span>
                  <div className="card-t">Property</div>
                  <p className="card-d">Up to 30 rooms · boutique hotels</p>
                </div>
                <div className="pr">
                  $<span id="pr-h">{propertyPrice}</span>
                  <small>/mo</small>
                </div>
                <ul>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    Every channel, two-way sync
                  </li>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    Dynamic rates and rules
                  </li>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    Housekeeping app for staff
                  </li>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    Guest messaging and door codes
                  </li>
                </ul>
                <a className="btn btn-d" href="#book">
                  Start free
                </a>
              </div>

              {/* Group Tier */}
              <div className="card tier" data-r style={{ "--d": ".16s" } as CSSProperties}>
                <div>
                  <div className="card-t">Group</div>
                  <p className="card-d">60+ rooms or many properties</p>
                </div>
                <div className="pr">Custom</div>
                <ul>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    One dashboard for all properties
                  </li>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    Roles, audit log and API
                  </li>
                  <li>
                    <svg className="i">
                      <use href="#i-check" />
                    </svg>
                    Priority support and onboarding
                  </li>
                </ul>
                <a className="btn btn-o" href="#book">
                  Talk to us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="sec" id="faq" style={{ paddingTop: "24px" }}>
          <div className="w">
            <div className="head c" data-r>
              <h2>Questions, answered.</h2>
            </div>
            <div className="faq" id="faqbox" data-r>
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={`faq-${idx}`} className="q" data-open={isOpen ? "true" : "false"}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    >
                      {item.question}
                      <svg className="i">
                        <use href="#i-chev" />
                      </svg>
                    </button>
                    <div className="a">
                      <div>
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Final CTA Section ── */}
        <section className="final" id="book" ref={bookRef}>
          <div className="w">
            <h2 data-r>Fill tomorrow night before dinner.</h2>
            <p data-r style={{ "--d": ".1s" } as CSSProperties}>
              Set up takes 20 minutes. Import your existing calendar with one link.
            </p>
            <form className="form" id="demoform" onSubmit={handleFormSubmit} data-r style={{ "--d": ".2s" } as CSSProperties}>
              <input type="email" required placeholder="you@property.com" aria-label="Work email" />
              <button className="btn btn-d lg" type="submit">
                Get my demo room
              </button>
            </form>
            <div id="fmsg" role="status" aria-live="polite">
              {formMsg}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer>
        <div className="w">
          <div className="fg">
            <div>
              <a className="logo" href="#top" style={{ marginBottom: "12px", display: "inline-flex" }}>
                <i>
                  <svg className="i">
                    <use href="#i-bed" />
                  </svg>
                </i>
                Stayline
              </a>
              <p style={{ color: "var(--muted-foreground)", fontSize: ".88rem", maxWidth: "28ch" }}>
                The autonomous calendar for hotels and rentals.
              </p>
            </div>
            <div>
              <h4>Product</h4>
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
            <div>
              <h4>Integrations</h4>
              <a href="#features">Direct booking</a>
              <a href="#features">Partner portals</a>
              <a href="#features">Door locks</a>
              <a href="#features">Stripe</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#book">About</a>
              <a href="#book">Status</a>
              <a href="#book">Privacy</a>
              <a href="#book">Terms</a>
            </div>
          </div>
          <div className="fb">
            <span>© 2026 Stayline, Inc. All rights reserved.</span>
            <span className="mono">Built with NexoreUI Masterpiece Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
