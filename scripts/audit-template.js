#!/usr/bin/env node
/*
 * NexoreUI template audit.
 *
 * Usage:
 *   node scripts/audit-template.js <file.tsx> [more files]
 *
 * Fails (exit 1) on any "error". Warnings must be justified in the final report.
 * This is a static gate. It does not replace looking at the page in a browser.
 */
const fs = require("fs");
const path = require("path");

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: node scripts/audit-template.js <file.tsx> [more files]");
  process.exit(2);
}

const BANNED_WORDS = [
  "seamless", "elevate", "unleash", "cutting-edge", "next-gen", "next-generation",
  "revolutionary", "game-changing", "world-class", "state-of-the-art", "haute",
  "bespoke atelier", "synergy", "supercharge", "reimagine", "unlock the power",
];

const AEROVOID_FINGERPRINTS = [
  "Pick a color.", "Three layers. One job each.", "Ripstop, up close", "colorway-ring",
  "Scroll to separate the layers", "Free shipping. 30-day returns.", "Built for the cold.",
  "layer-bar", "size-pill", "aero-construction",
];

const lineRules = [
  { id: "emoji", level: "error", msg: "Emoji or pictographic glyph",
    test: (l) => /\p{Extended_Pictographic}/u.test(l.replace(/[\u00A9\u00AE\u2122]/g, "")) },
  { id: "glyph-bullet", level: "error", msg: "Emoji-style glyph bullet",
    test: (l) => /[\u2713\u2714\u2717\u2726\u2727\u2605\u2606\u25C6\u25C7\u2736\u273A]/.test(l) },
  { id: "dot-separator", level: "warn", msg: "Middle-dot separators are a generated-copy tell",
    test: (l) => /[A-Za-z0-9\)]\s\u2022\s[A-Za-z0-9\(]/.test(l) },
  { id: "pulse", level: "error", msg: "Pulsing or pinging element",
    test: (l) => /animate-(ping|pulse)/.test(l) },
  { id: "blur-blob", level: "error", msg: "Decorative blur blob",
    test: (l) => /blur-\[\d{2,}px\]|\bblur-(2xl|3xl)\b/.test(l) },
  { id: "purple-family", level: "error", msg: "Purple/pink/indigo utility color",
    test: (l) => /\b(?:bg|text|from|via|to|border|ring|shadow|fill|stroke)-(?:purple|violet|fuchsia|pink|indigo)-\d{2,3}/.test(l) },
  { id: "gradient-text", level: "warn", msg: "Gradient text. Only neutral gradients are allowed",
    test: (l) => /bg-clip-text/.test(l) },
  { id: "accent-to-slate-button", level: "error", msg: "Accent-to-slate gradient button",
    test: (l) => /linear-gradient\(135deg,\s*\$\{[^}]*\},\s*#0f172a\)/.test(l) },
  { id: "pill-kicker", level: "warn", msg: "Pill or kicker label (rounded-full + uppercase). Never above a heading",
    test: (l) => /rounded-full/.test(l) && /uppercase/.test(l) },
  { id: "banned-word", level: "error", msg: "Banned marketing word",
    test: (l) => BANNED_WORDS.some((w) => new RegExp("\\b" + w.replace(/[-]/g, "[- ]") + "\\b", "i").test(l)) },
  { id: "fake-scarcity", level: "error", msg: "Fake scarcity or urgency",
    test: (l) => /\bonly \d+ (of \d+ )?(left|remaining)|limited (batch|allocation|edition run)|\d+ (people|others) (are )?(viewing|watching)|selling fast/i.test(l) },
  { id: "fake-serial", level: "error", msg: "Fake serial or batch number",
    test: (l) => /\b(serial|batch)\s*#/i.test(l) },
  { id: "fake-credential", level: "error", msg: "Invented lab, agency or partner",
    test: (l) => /\bNASA\b|\bESA\b|Osaka Nanotech|Swiss Lab|Institute of/.test(l) },
  { id: "telemetry", level: "warn", msg: "Telemetry language usually means fake data",
    test: (l) => /\btelemetry\b/i.test(l) },
  { id: "game-ui", level: "warn", msg: "Game-like UI vocabulary (HUD, crosshair, power-up, confetti, cursor trail)",
    test: (l) => /\bHUD\b|crosshair|power-?up|scoreboard|cursor-?trail|confetti|health bar/i.test(l) },
  { id: "primitive-scene", level: "warn", msg: "Decorative 3D primitive or particle scene (orb, sphere, cube, ring, particles)",
    test: (l) => /\b(orb|orbs|sphere|spheres|particles?|floating (cube|ring|orb))\b/i.test(l) && !/^\s*(\/\/|\*|\/\*)/.test(l) },
  { id: "aerovoid-fingerprint", level: "error", msg: "Copied from the Aerovoid template",
    test: (l) => AEROVOID_FINGERPRINTS.some((f) => l.includes(f)) },
];

let totalErrors = 0;
let totalWarns = 0;

for (const f of files) {
  const abs = path.resolve(process.cwd(), f);
  if (!fs.existsSync(abs)) {
    console.error("Missing file: " + f);
    totalErrors++;
    continue;
  }
  const src = fs.readFileSync(abs, "utf8");
  const lines = src.split(/\r?\n/);
  const found = [];

  lines.forEach((line, i) => {
    for (const r of lineRules) {
      if (r.id === "aerovoid-fingerprint" && /aerovoid/i.test(f)) continue;
      if (r.test(line)) found.push({ level: r.level, id: r.id, msg: r.msg, line: i + 1, text: line.trim().slice(0, 110) });
    }
  });

  const fileRules = [];

  if (!/fonts\.googleapis\.com|next\/font/.test(src)) {
    fileRules.push({ level: "error", id: "no-font-loading", msg: "No font loading. The template would render in a default font" });
  }
  if (/framer-motion/.test(src) && !/useReducedMotion/.test(src)) {
    fileRules.push({ level: "error", id: "no-reduced-motion", msg: "useReducedMotion is not used" });
  }
  if (!/isMobile|@container|\bsm:|\bmd:|\blg:/.test(src)) {
    fileRules.push({ level: "error", id: "no-responsive", msg: "No responsive handling found" });
  }
  if (!/isTablet|\bmd:|@md|@2xl|@xl/.test(src)) {
    fileRules.push({ level: "warn", id: "no-tablet", msg: "No explicit tablet handling found" });
  }
  if (/<canvas\b/.test(src) && !/canvas-ok:/.test(src)) {
    fileRules.push({ level: "warn", id: "canvas", msg: "Canvas used. Add a comment 'canvas-ok: <reason it carries real content>' or remove it" });
  }
  const uniformSpring = (src.match(/stiffness:\s*400,\s*damping:\s*30/g) || []).length;
  if (uniformSpring > 0) {
    fileRules.push({ level: "warn", id: "default-spring", msg: "Default 400/30 spring found " + uniformSpring + "x. Use the motion personality tokens from the brief" });
  }
  const zinc = (src.match(/\bzinc-\d{2,3}/g) || []).length;
  if (zinc >= 8) {
    fileRules.push({ level: "warn", id: "default-palette", msg: "Default Tailwind zinc palette used " + zinc + "x. Use the identity palette tokens" });
  }
  const hexes = Array.from(new Set((src.match(/#[0-9a-fA-F]{6}\b/g) || []).map((h) => h.toLowerCase())));
  if (hexes.length > 18) {
    fileRules.push({ level: "warn", id: "too-many-colors", msg: hexes.length + " distinct hex colors. A palette has about 9" });
  }
  const sections = (src.match(/<section\b/g) || []).length;
  if (sections > 8) {
    fileRules.push({ level: "warn", id: "too-many-sections", msg: sections + " sections. Each must have a different job" });
  }
  const fonts = Array.from(new Set((src.match(/family=([A-Za-z0-9+]+)/g) || []).map((m) => m.slice(7).replace(/\+/g, " "))));

  console.log("\n" + f);
  console.log("  fonts: " + (fonts.join(", ") || "none") + " | colors: " + hexes.length + " | sections: " + sections);

  const all = [...found, ...fileRules];
  for (const x of all) {
    const tag = x.level === "error" ? "ERROR" : "warn ";
    console.log("  " + tag + " [" + x.id + "]" + (x.line ? " line " + x.line : "") + ": " + x.msg + (x.text ? "\n         " + x.text : ""));
    if (x.level === "error") totalErrors++; else totalWarns++;
  }
  if (!all.length) console.log("  clean");
}

console.log("\n" + totalErrors + " error(s), " + totalWarns + " warning(s)");
process.exit(totalErrors ? 1 : 0);
