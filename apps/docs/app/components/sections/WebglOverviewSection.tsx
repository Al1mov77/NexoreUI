"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  GlassLens,
  FlutedGlass,
  RippleWater,
  ScrollWarp,
  TwistRibbon,
  DitherImage,
  GravityGrid,
  ScrollDrum,
  LiquidSmear,
  TypeProximity,
  HoloFoil,
  LetterPile,
  FlowField,
  TextRail,
  MoireGrating,
  SwipeDeck,
  CameraMirror,
  ScrollReveal,
} from "nexoreui";
import { Copy, Check, RotateCcw, ArrowRight, SlidersHorizontal, Terminal, Play, Pause, ChevronUp, ChevronDown, Code2, Layers } from "lucide-react";

type EffectKey =
  | "glass"
  | "flute"
  | "ripple"
  | "warp"
  | "ribbon"
  | "dither"
  | "gravity"
  | "drum"
  | "smear"
  | "proximity"
  | "foil"
  | "pile"
  | "flow"
  | "rail"
  | "moire"
  | "deck"
  | "mirror"
  | "reveal";

interface ControlSchema {
  key: string;
  label: string;
  type: "range" | "color";
  min?: number;
  max?: number;
  step?: number;
}

interface EffectConfig {
  key: EffectKey;
  slug: string;
  name: string;
  tabLabel: string;
  title: string;
  description: string;
  specs: { label: string; value: string }[];
  defaultProps: Record<string, string | number | boolean>;
  schema: ControlSchema[];
}

const EFFECTS: EffectConfig[] = [
  {
    key: "glass",
    slug: "glass-lens",
    name: "GlassLens",
    tabLabel: "Glass Lens",
    title: "Liquid Glass Lens",
    description: "Refractive glass lens with dynamic chromatic dispersion, specular highlights, and lag physics.",
    specs: [
      { label: "Rendering Type", value: "Fragment Shader (Raymarch)" },
      { label: "Normal Mapping", value: "Analytic Gradient Reconstruction" },
      { label: "Chromatic Aberration", value: "Triple-sampled UV dispersion" },
      { label: "Physics Lag", value: "Spring Damped Inertia" },
    ],
    defaultProps: {
      size: 0.3,
      thick: 1.3,
      disp: 0.3,
      blur: 0.35,
      mag: 1.12,
      smo: 0.35,
      rim: 0.55,
      spec: 0.7,
      lag: 0.12,
      tin: 0.06,
      tint: "#9fd8ff",
    },
    schema: [
      { key: "size", label: "Size", type: "range", min: 0.1, max: 0.7, step: 0.005 },
      { key: "thick", label: "Bevel Thickness", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "disp", label: "Dispersion", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "blur", label: "Frost Blur", type: "range", min: 0, max: 1.5, step: 0.01 },
      { key: "mag", label: "Magnification", type: "range", min: 0.7, max: 1.8, step: 0.01 },
      { key: "smo", label: "Metaball Merge", type: "range", min: 0.02, max: 0.9, step: 0.01 },
      { key: "rim", label: "Rim Light", type: "range", min: 0, max: 1.5, step: 0.01 },
      { key: "spec", label: "Specular", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "lag", label: "Trail Lag", type: "range", min: 0.03, max: 0.4, step: 0.005 },
      { key: "tin", label: "Tint Amount", type: "range", min: 0, max: 0.5, step: 0.005 },
      { key: "tint", label: "Lens Tint", type: "color" },
    ],
  },
  {
    key: "flute",
    slug: "fluted-glass",
    name: "FlutedGlass",
    tabLabel: "Fluted Glass",
    title: "Fluted Reeded Glass",
    description: "Architectural ribbed glass panels with pointer-reactive lens curvature and wave perturbation.",
    specs: [
      { label: "Rendering Type", value: "Coordinate Projection Shader" },
      { label: "Rib Architecture", value: "Periodic Sine Curvature" },
      { label: "Pointer Reach", value: "Exponential Attenuation" },
      { label: "Specular Finish", value: "Normal Rim Highlights" },
    ],
    defaultProps: {
      cnt: 22,
      bend: 0.85,
      disp: 0.25,
      frost: 0.25,
      ang: 0,
      warp: 0.5,
      edge: 0.5,
      hl: 0.8,
      pinf: 1,
      tin: 0,
      tint: "#ffffff",
    },
    schema: [
      { key: "cnt", label: "Rib Count", type: "range", min: 4, max: 70, step: 1 },
      { key: "bend", label: "Curvature", type: "range", min: 0, max: 1.6, step: 0.01 },
      { key: "disp", label: "Dispersion", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "frost", label: "Frosting", type: "range", min: 0, max: 1.5, step: 0.01 },
      { key: "ang", label: "Rib Angle", type: "range", min: -1.6, max: 1.6, step: 0.01 },
      { key: "warp", label: "Wave Perturbation", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "edge", label: "Rib Edge Shading", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "hl", label: "Specular Highlight", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "pinf", label: "Pointer Reach", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "tin", label: "Tint Amount", type: "range", min: 0, max: 0.6, step: 0.005 },
      { key: "tint", label: "Rib Tint", type: "color" },
    ],
  },
  {
    key: "ripple",
    slug: "ripple-water",
    name: "RippleWater",
    tabLabel: "Water Ripples",
    title: "Interactive Water Ripples",
    description: "Surface wave simulation with pointer drag trails, periodic rain drops, and specular normal depth.",
    specs: [
      { label: "Simulation Architecture", value: "16-Slot Ring Buffer Wave Engine" },
      { label: "Normal Shading", value: "Sobel-filtered Surface Depth" },
      { label: "Refraction Index", value: "Dynamic Vector Offset" },
      { label: "Rain Particle Rate", value: "Poisson Random Generator" },
    ],
    defaultProps: {
      fq: 48,
      spd: 1.1,
      damp: 1.1,
      wd: 0.18,
      amp: 1,
      refr: 1.2,
      disp: 0.35,
      spec: 0.8,
      shade: 2.5,
      gap: 0.12,
      idle: 0.6,
    },
    schema: [
      { key: "fq", label: "Wave Frequency", type: "range", min: 12, max: 100, step: 1 },
      { key: "spd", label: "Wave Speed", type: "range", min: 0.2, max: 3, step: 0.01 },
      { key: "damp", label: "Damping Rate", type: "range", min: 0.2, max: 3, step: 0.01 },
      { key: "wd", label: "Ring Width", type: "range", min: 0.06, max: 0.5, step: 0.005 },
      { key: "amp", label: "Wave Strength", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "refr", label: "Refraction", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "disp", label: "Dispersion", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "spec", label: "Specular Highlight", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "shade", label: "Normal Depth", type: "range", min: 0, max: 6, step: 0.05 },
      { key: "gap", label: "Trail Spacing", type: "range", min: 0.03, max: 0.4, step: 0.005 },
      { key: "idle", label: "Idle Rain Probability", type: "range", min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    key: "warp",
    slug: "scroll-warp",
    name: "ScrollWarp",
    tabLabel: "Scroll Warp",
    title: "Scroll Velocity Warp",
    description: "Page distortion driven by scroll velocity with non-linear pinch, chromatic split, and grain.",
    specs: [
      { label: "Kinetic Driver", value: "Normalized Scroll Velocity Delta" },
      { label: "Pinch Geometry", value: "Power Curve Exponential Scaling" },
      { label: "Channel Splitting", value: "RGB Pixel Aberration" },
      { label: "Noise Architecture", value: "Procedural Simplex Film Grain" },
    ],
    defaultProps: {
      curve: 1,
      skew: 0.6,
      split: 0.8,
      wave: 0.4,
      zoom: 0.5,
      inertia: 0.12,
      vgain: 1,
      grain: 0.04,
    },
    schema: [
      { key: "curve", label: "Pinch Curvature", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "skew", label: "Shear Offset", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "split", label: "RGB Split", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "wave", label: "Ripple Amplitude", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "zoom", label: "Push Zoom", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "inertia", label: "Scroll Inertia", type: "range", min: 0.03, max: 0.5, step: 0.005 },
      { key: "vgain", label: "Velocity Gain", type: "range", min: 0.2, max: 3, step: 0.01 },
      { key: "grain", label: "Film Grain", type: "range", min: 0, max: 0.15, step: 0.005 },
    ],
  },
  {
    key: "ribbon",
    slug: "twist-ribbon",
    name: "TwistRibbon",
    tabLabel: "Twist Ribbon",
    title: "3D Twisting Ribbon",
    description: "3D ribbon triangle-strip mesh accelerated by scroll velocity with depth testing and shading.",
    specs: [
      { label: "Geometry", value: "Parametric Triangle-Strip Mesh" },
      { label: "Perspective", value: "Focal Camera Z-Division" },
      { label: "Torsion Physics", value: "Helical Phase Acceleration" },
      { label: "Dual Shading", value: "Contrasting Front and Back Normals" },
    ],
    defaultProps: {
      twist: 1.6,
      flex: 1.2,
      spd: 0.35,
      boost: 1,
      wid: 0.55,
      tilt: 0.28,
      wamp: 0.3,
      wfq: 1.2,
      cam: 4.5,
      cnt: 2,
      spread: 0.9,
      rep: 3,
      shade: 0.6,
      paper: "#f2efe8",
      ink: "#0b0b10",
      back: "#ff4a2b",
      bg: "#15151b",
    },
    schema: [
      { key: "twist", label: "Resting Twist", type: "range", min: 0, max: 4, step: 0.01 },
      { key: "flex", label: "Scroll Twist Flex", type: "range", min: 0, max: 4, step: 0.01 },
      { key: "spd", label: "Drift Speed", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "boost", label: "Scroll Push", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "wid", label: "Ribbon Width", type: "range", min: 0.15, max: 1.1, step: 0.01 },
      { key: "tilt", label: "Axis Tilt", type: "range", min: -1, max: 1, step: 0.01 },
      { key: "wamp", label: "Wave Height", type: "range", min: 0, max: 0.8, step: 0.01 },
      { key: "cnt", label: "Ribbon Layers", type: "range", min: 1, max: 3, step: 1 },
      { key: "paper", label: "Front Surface", type: "color" },
      { key: "ink", label: "Text Color", type: "color" },
      { key: "back", label: "Back Surface", type: "color" },
      { key: "bg", label: "Scene Background", type: "color" },
    ],
  },
  {
    key: "dither",
    slug: "dither-image",
    name: "DitherImage",
    tabLabel: "Dither Image",
    title: "Ordered Bayer Dither",
    description: "Quantized retro dithering through a 4-tone palette with interactive pointer reveal lens.",
    specs: [
      { label: "Matrix Matrix", value: "Analytical Bayer 8×8 Matrix" },
      { label: "Quantization", value: "Four-level Tone Mapping" },
      { label: "Resolution Scaling", value: "Uniform DPR Compensation" },
      { label: "Interactive Reveal", value: "Smooth Distance Attenuation" },
    ],
    defaultProps: {
      px: 3,
      lv: 3,
      bn: 3,
      cont: 1.3,
      bias: 0,
      anim: 0,
      mode: 0,
      rad: 0.22,
      soft: 0.18,
      rv: 1,
      c0: "#0a0a0f",
      c1: "#2d3bff",
      c2: "#ff6a3d",
      c3: "#f6f1e6",
    },
    schema: [
      { key: "px", label: "Dither Pixel Size", type: "range", min: 1, max: 12, step: 0.5 },
      { key: "lv", label: "Quantization Levels", type: "range", min: 2, max: 8, step: 1 },
      { key: "cont", label: "Contrast", type: "range", min: 0.4, max: 2.6, step: 0.01 },
      { key: "bias", label: "Luma Bias", type: "range", min: -0.4, max: 0.4, step: 0.01 },
      { key: "rad", label: "Reveal Radius", type: "range", min: 0, max: 0.8, step: 0.01 },
      { key: "soft", label: "Reveal Softness", type: "range", min: 0, max: 0.6, step: 0.01 },
      { key: "rv", label: "Reveal Amount", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "c0", label: "Shadow Tone", type: "color" },
      { key: "c1", label: "Mid Low Tone", type: "color" },
      { key: "c2", label: "Mid High Tone", type: "color" },
      { key: "c3", label: "Highlight Tone", type: "color" },
    ],
  },
  {
    key: "gravity",
    slug: "gravity-grid",
    name: "GravityGrid",
    tabLabel: "Gravity Grid",
    title: "Spacetime Gravity Grid",
    description: "Distorted coordinate grid with three inertial gravitational masses and wave propagation.",
    specs: [
      { label: "Spacetime Field", value: "Tri-Point Gravitational Well" },
      { label: "Decay Math", value: "Inverse Power Falloff Function" },
      { label: "Wave Transmission", value: "Oscillatory Field Propagation" },
      { label: "Inertial Damping", value: "Triple Delayed Particle Lag" },
    ],
    defaultProps: {
      cell: 24,
      lw: 0.012,
      mass: 1.6,
      fall: 3.2,
      dots: 0,
      wave: 0.5,
      glow: 0.6,
      lag: 0.1,
      bg: "#0b0c12",
      ink: "#cfd6ee",
      hot: "#ff6a3d",
    },
    schema: [
      { key: "cell", label: "Grid Density", type: "range", min: 6, max: 70, step: 1 },
      { key: "lw", label: "Line Width", type: "range", min: 0.003, max: 0.05, step: 0.001 },
      { key: "mass", label: "Gravitational Mass", type: "range", min: -0.9, max: 4, step: 0.01 },
      { key: "fall", label: "Distance Falloff", type: "range", min: 0.4, max: 10, step: 0.05 },
      { key: "dots", label: "Lines to Dots", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "wave", label: "Gravity Waves", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "glow", label: "Mass Center Glow", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "lag", label: "Lag Damping", type: "range", min: 0.03, max: 0.4, step: 0.005 },
      { key: "bg", label: "Cosmic Background", type: "color" },
      { key: "ink", label: "Grid Line Color", type: "color" },
      { key: "hot", label: "Singularity Core", type: "color" },
    ],
  },
  {
    key: "drum",
    slug: "scroll-drum",
    name: "ScrollDrum",
    tabLabel: "Scroll Drum",
    title: "3D Cylindrical Type Drum",
    description: "Continuous 3D rotating cylinder of typography with scroll acceleration and chromatic split.",
    specs: [
      { label: "Geometric Projection", value: "Cylindrical Inverse Ray-Surface" },
      { label: "Perspective Bulge", value: "Trigonometric Arc Cosine" },
      { label: "Rotational Physics", value: "Inertial Scroll Damping" },
      { label: "Chromatic Separation", value: "Velocity-scaled UV Offset" },
    ],
    defaultProps: {
      rad: 1.15,
      gain: 1.2,
      spd: 0.12,
      bulge: 0.35,
      fade: 0.8,
      split: 0.8,
      tilt: -0.12,
      hl: 0.8,
    },
    schema: [
      { key: "rad", label: "Drum Radius", type: "range", min: 0.5, max: 2.2, step: 0.01 },
      { key: "gain", label: "Scroll Rotation Gain", type: "range", min: 0.2, max: 4, step: 0.01 },
      { key: "spd", label: "Idle Rotation Speed", type: "range", min: -1, max: 1, step: 0.01 },
      { key: "bulge", label: "Perspective Bulge", type: "range", min: 0, max: 1.2, step: 0.01 },
      { key: "fade", label: "Edge Shading", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "split", label: "Chromatic Split", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "tilt", label: "Drum Axis Tilt", type: "range", min: -0.6, max: 0.6, step: 0.01 },
      { key: "hl", label: "Gloss Reflection", type: "range", min: 0, max: 2, step: 0.01 },
    ],
  },
  {
    key: "smear",
    slug: "liquid-smear",
    name: "LiquidSmear",
    tabLabel: "Liquid Smear",
    title: "Fluid Velocity Smear",
    description: "Persistent viscous fluid distortion where pointer dragging creates velocity trails that settle.",
    specs: [
      { label: "Fluid Engine", value: "Double-Buffered FBO Ping-Pong" },
      { label: "Velocity Map", value: "Encoded 2D Byte Channel Vectors" },
      { label: "Decay Math", value: "Continuous Viscous Relaxation" },
      { label: "Surface Caustics", value: "Specular Refraction Normals" },
    ],
    defaultProps: {
      push: 1.4,
      rad: 0.22,
      relax: 0.975,
      spread: 0.35,
      amt: 1,
      disp: 0.4,
      spec: 0.6,
      shade: 3,
    },
    schema: [
      { key: "push", label: "Pointer Push Force", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "rad", label: "Brush Radius", type: "range", min: 0.05, max: 0.6, step: 0.005 },
      { key: "relax", label: "Fluid Memory (Decay)", type: "range", min: 0.9, max: 0.998, step: 0.001 },
      { key: "spread", label: "Velocity Diffusion", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "amt", label: "Distortion Depth", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "disp", label: "Refraction Dispersion", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "spec", label: "Specular Gloss", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "shade", label: "Gloss Depth", type: "range", min: 0, max: 8, step: 0.05 },
    ],
  },
  {
    key: "proximity",
    slug: "type-proximity",
    name: "TypeProximity",
    tabLabel: "Type Proximity",
    title: "Pointer-Distance Typography",
    description: "Every letter reads its distance to your finger or pointer and dynamically reshapes its weight and width axes.",
    specs: [
      { label: "Rendering Type", value: "DOM Letter Matrix (Layout-Thrash Free)" },
      { label: "Variable Font Axes", value: "Bricolage Grotesque (wght, wdth)" },
      { label: "Color Shift", value: "RGB Ink-to-Tint Interpolation" },
      { label: "Falloff Math", value: "Exponential Distance Attenuation" },
    ],
    defaultProps: {
      rad: 240,
      wmin: 200,
      wmax: 850,
      dmin: 75,
      dmax: 100,
      fall: 1.6,
      size: 11,
      ease: 0.22,
      idle: 0.7,
      hue: 0.85,
      tint: "#ff4a2b",
      bg: "#e8eaee",
      ink: "#0d0e12",
    },
    schema: [
      { key: "rad", label: "Proximity Radius", type: "range", min: 60, max: 700, step: 1 },
      { key: "wmin", label: "Weight (Far)", type: "range", min: 100, max: 800, step: 1 },
      { key: "wmax", label: "Weight (Near)", type: "range", min: 200, max: 800, step: 1 },
      { key: "dmin", label: "Width (Far)", type: "range", min: 75, max: 100, step: 1 },
      { key: "dmax", label: "Width (Near)", type: "range", min: 75, max: 100, step: 1 },
      { key: "fall", label: "Distance Falloff", type: "range", min: 0.5, max: 4, step: 0.01 },
      { key: "size", label: "Font Size (vw)", type: "range", min: 4, max: 16, step: 0.1 },
      { key: "ease", label: "Response Smoothing", type: "range", min: 0.04, max: 0.6, step: 0.01 },
      { key: "idle", label: "Idle Sweep Speed", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "hue", label: "Tint Amount", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "tint", label: "Accent Tint", type: "color" },
      { key: "bg", label: "Paper Background", type: "color" },
      { key: "ink", label: "Base Ink", type: "color" },
    ],
  },
  {
    key: "foil",
    slug: "holo-foil",
    name: "HoloFoil",
    tabLabel: "Holo Foil",
    title: "Holographic Foil Card",
    description: "Multi-layered iridescent holographic card with rainbow spectral gradients, sparkles, soft specular glare, and gyroscope tilt.",
    specs: [
      { label: "Iridescence Engine", value: "Color-Dodge & Conic Overlays" },
      { label: "Micro-Glitter", value: "Double Radial Micro-Grid Grating" },
      { label: "Parallax Finish", value: "Non-3D Depth Separation" },
      { label: "Kinetics", value: "DeviceOrientation Alpha/Beta Tracking" },
    ],
    defaultProps: {
      tilt: 16,
      foil: 1,
      sparkle: 1,
      glare: 0.7,
      hue: 0,
      depth: 22,
      radius: 22,
      gyro: 1,
      ease: 0.12,
    },
    schema: [
      { key: "tilt", label: "Max 3D Tilt", type: "range", min: 0, max: 35, step: 0.5 },
      { key: "foil", label: "Foil Reflection", type: "range", min: 0, max: 1.6, step: 0.01 },
      { key: "sparkle", label: "Glitter Sparkle", type: "range", min: 0, max: 1.6, step: 0.01 },
      { key: "glare", label: "Specular Glare", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "hue", label: "Hue Rotation", type: "range", min: 0, max: 360, step: 1 },
      { key: "depth", label: "Text Parallax", type: "range", min: 0, max: 60, step: 1 },
      { key: "radius", label: "Card Radius", type: "range", min: 0, max: 48, step: 1 },
      { key: "gyro", label: "Gyro Multiplier", type: "range", min: 0.3, max: 2, step: 0.01 },
      { key: "ease", label: "Motion Ease", type: "range", min: 0.04, max: 0.4, step: 0.01 },
    ],
  },
  {
    key: "pile",
    slug: "letter-pile",
    name: "LetterPile",
    tabLabel: "Letter Pile",
    title: "Kinetic Rigid Letter Pile",
    description: "Simulated 2D physics disks containing typography with multi-pass circle collisions, gravity tilt, and pointer repulsion.",
    specs: [
      { label: "Physics Engine", value: "3-Iteration Constraint Impulse Solver" },
      { label: "Gravity Vector", value: "Dynamic Gyro Roll / Desktop Idle Sway" },
      { label: "Boundary Handling", value: "Restitution Energy Damping" },
      { label: "Letter Rendering", value: "High-Contrast Dynamic Luma Thresholding" },
    ],
    defaultProps: {
      count: 54,
      size: 5.2,
      grav: 1,
      bounce: 0.45,
      drag: 0.15,
      push: 1.4,
      gyro: 1,
      swing: 0.35,
      c1: "#ff4a2b",
      c2: "#2d4bff",
      c3: "#f4f1e8",
      bg: "#101014",
      ink: "#101014",
    },
    schema: [
      { key: "count", label: "Letter Count", type: "range", min: 10, max: 140, step: 1 },
      { key: "size", label: "Disk Radius", type: "range", min: 2.5, max: 9, step: 0.1 },
      { key: "grav", label: "Gravity Force", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "bounce", label: "Restitution (Bounce)", type: "range", min: 0, max: 0.95, step: 0.01 },
      { key: "drag", label: "Air Drag", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "push", label: "Pointer Repulsion", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "gyro", label: "Gyro Gain", type: "range", min: 0.3, max: 2, step: 0.01 },
      { key: "swing", label: "Idle Sway", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "c1", label: "Disk Color A", type: "color" },
      { key: "c2", label: "Disk Color B", type: "color" },
      { key: "c3", label: "Disk Color C", type: "color" },
      { key: "bg", label: "Scene Background", type: "color" },
      { key: "ink", label: "Dark Letter Ink", type: "color" },
    ],
  },
  {
    key: "flow",
    slug: "flow-field",
    name: "FlowField",
    tabLabel: "Flow Field",
    title: "Trigonometric Vector Flow Field",
    description: "Dense vector field particle trails steered by triple harmonic sine curl equations with additive glow and velocity smoothing.",
    specs: [
      { label: "Field Vector Math", value: "Triple Sine Periodic Curl" },
      { label: "Performance Throttle", value: "Dynamic EMA Frame-Time Particle Culling" },
      { label: "Rendering Engine", value: "12-Bucket Batched Path Strokes" },
      { label: "Color Harmonics", value: "Cyclic HSLA Additive Blending" },
    ],
    defaultProps: {
      count: 1600,
      scale: 1.4,
      curl: 1.2,
      speed: 90,
      drift: 0.6,
      fade: 0.045,
      lw: 1.2,
      pf: 1.2,
      prad: 200,
      hue: 190,
      range: 140,
      glow: 1,
      bg: "#07080c",
    },
    schema: [
      { key: "count", label: "Particle Stream Count", type: "range", min: 200, max: 4000, step: 50 },
      { key: "scale", label: "Field Frequency Scale", type: "range", min: 0.3, max: 4, step: 0.01 },
      { key: "curl", label: "Vorticity (Curl)", type: "range", min: 0.3, max: 3, step: 0.01 },
      { key: "speed", label: "Drift Speed", type: "range", min: 20, max: 300, step: 1 },
      { key: "drift", label: "Vector Drift", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "fade", label: "Trail Persistence (Fade)", type: "range", min: 0.01, max: 0.2, step: 0.001 },
      { key: "lw", label: "Stream Line Width", type: "range", min: 0.4, max: 4, step: 0.1 },
      { key: "pf", label: "Pointer Repulsion Force", type: "range", min: -3, max: 3, step: 0.01 },
      { key: "prad", label: "Pointer Reach Radius", type: "range", min: 80, max: 400, step: 1 },
      { key: "hue", label: "Base Hue Angle", type: "range", min: 0, max: 360, step: 1 },
      { key: "range", label: "Hue Spectrum Range", type: "range", min: 0, max: 360, step: 1 },
      { key: "glow", label: "Additive Lighter Glow", type: "range", min: 0, max: 1, step: 1 },
      { key: "bg", label: "Canvas Backdrop", type: "color" },
    ],
  },
  {
    key: "rail",
    slug: "text-rail",
    name: "TextRail",
    tabLabel: "Text Rail",
    title: "Kinetic Bezier Text Rail",
    description: "Continuous typography riding SVG Catmull-Rom spline curves distorted and pushed forward by scroll kinetic velocity.",
    specs: [
      { label: "Geometry", value: "9-Point Catmull-Rom to Cubic Bezier" },
      { label: "Metric Alignment", value: "Font-Ready Unit Offset Measurement" },
      { label: "Kinetic Damping", value: "Dual Cascading Velocity Inertia" },
      { label: "Typography Layout", value: "Repeating SVG TextPath Tracks" },
    ],
    defaultProps: {
      amp: 0.16,
      freq: 1.6,
      size: 0.2,
      speed: 0.2,
      gain: 1.2,
      bend: 1.2,
      rails: 3,
      gap: 0.28,
      outline: 0.55,
      line: 0.25,
      rot: -8,
      skew: 1,
      drift: 0.5,
      inertia: 0.12,
      vgain: 1,
      bg: "#101014",
      ink: "#f2efe8",
      c2: "#ff4a2b",
    },
    schema: [
      { key: "amp", label: "Spline Wave Height", type: "range", min: 0, max: 0.4, step: 0.005 },
      { key: "freq", label: "Wave Frequency", type: "range", min: 0.3, max: 3.5, step: 0.01 },
      { key: "size", label: "Typography Size", type: "range", min: 0.08, max: 0.34, step: 0.005 },
      { key: "speed", label: "Idle Drift Speed", type: "range", min: -1, max: 1, step: 0.01 },
      { key: "gain", label: "Scroll Translation Gain", type: "range", min: 0, max: 4, step: 0.01 },
      { key: "bend", label: "Velocity Curve Bend", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "rails", label: "Rail Count", type: "range", min: 1, max: 4, step: 1 },
      { key: "gap", label: "Rail Spacing", type: "range", min: 0.08, max: 0.45, step: 0.005 },
      { key: "outline", label: "Outline Ratio", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "line", label: "Guide Wire Opacity", type: "range", min: 0, max: 0.6, step: 0.01 },
      { key: "rot", label: "Angular Tilt", type: "range", min: -30, max: 30, step: 0.5 },
      { key: "skew", label: "Scroll Angular Skew", type: "range", min: 0, max: 3, step: 0.01 },
      { key: "drift", label: "Harmonic Wave Drift", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "inertia", label: "Scroll Inertia", type: "range", min: 0.03, max: 0.5, step: 0.005 },
      { key: "vgain", label: "Velocity Gain", type: "range", min: 0.2, max: 3, step: 0.01 },
      { key: "bg", label: "Background", type: "color" },
      { key: "ink", label: "Base Typography Ink", type: "color" },
      { key: "c2", label: "Accent Ribbon Tone", type: "color" },
    ],
  },
  {
    key: "moire",
    slug: "moire-grating",
    name: "MoireGrating",
    tabLabel: "Moiré Grating",
    title: "Optical Interference Moiré Grating",
    description: "Dual optical grating arrays generating geometric interference fringes driven by pointer follower coordinates and Lissajous drift.",
    specs: [
      { label: "Pattern Typology", value: "Concentric Rings, Parallel Slits, Radial Beams" },
      { label: "Optical Physics", value: "High-Density Multiply Interference Blending" },
      { label: "Spatial Offset", value: "Scale Ratio & Harmonic Differential Rotation" },
      { label: "Motion Trajectory", value: "Lissajous Figure Orbit Tracking" },
    ],
    defaultProps: {
      type: 0,
      gap: 9,
      duty: 0.42,
      ratio: 1.04,
      rot: 0.05,
      drift: 0.4,
      follow: 0.12,
      mix: 1,
      bg: "#e8ebef",
      a: "#101014",
      b: "#ff4a2b",
    },
    schema: [
      { key: "type", label: "Pattern (0:Circles, 1:Lines, 2:Rays)", type: "range", min: 0, max: 2, step: 1 },
      { key: "gap", label: "Slit Pitch Spacing (px)", type: "range", min: 4, max: 30, step: 0.5 },
      { key: "duty", label: "Duty Cycle Line Weight", type: "range", min: 0.1, max: 0.8, step: 0.01 },
      { key: "ratio", label: "Grating Scale Ratio", type: "range", min: 0.9, max: 1.15, step: 0.001 },
      { key: "rot", label: "Angular Spin Velocity", type: "range", min: -0.5, max: 0.5, step: 0.005 },
      { key: "drift", label: "Lissajous Idle Drift", type: "range", min: 0, max: 2, step: 0.01 },
      { key: "follow", label: "Pointer Follow Lag", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "mix", label: "Secondary Grating Mix", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "bg", label: "Substrate Paper", type: "color" },
      { key: "a", label: "Base Grating Ink", type: "color" },
      { key: "b", label: "Interference Grating Ink", type: "color" },
    ],
  },
  {
    key: "deck",
    slug: "swipe-deck",
    name: "SwipeDeck",
    tabLabel: "Swipe Deck",
    title: "Spring-Kinetic Swipe Card Deck",
    description: "Tactile gesture card deck with physical spring relaxation, velocity fling discharge, and infinite cyclical card recycling.",
    specs: [
      { label: "Physics Engine", value: "Hooke Law Spring Oscillator (a = -kx - cv)" },
      { label: "Gesture Tracking", value: "Pointer Capture with EMA Velocity Profiler" },
      { label: "Depth Architecture", value: "Scaled & Offset Cascading Depth Stack" },
      { label: "Haptic Integration", value: "Velocity Fling Vibration Triggers" },
    ],
    defaultProps: {
      stiff: 220,
      damp: 22,
      tilt: 8,
      fling: 650,
      depth: 3,
      offset: 16,
      shrink: 0.06,
      radius: 26,
      lift: 1.04,
      bg: "#0f1014",
    },
    schema: [
      { key: "stiff", label: "Spring Stiffness", type: "range", min: 40, max: 600, step: 1 },
      { key: "damp", label: "Spring Damping", type: "range", min: 4, max: 50, step: 0.5 },
      { key: "tilt", label: "Drag Tilt Factor", type: "range", min: 0, max: 20, step: 0.1 },
      { key: "fling", label: "Fling Velocity Threshold", type: "range", min: 150, max: 2000, step: 10 },
      { key: "depth", label: "Visible Stack Depth", type: "range", min: 2, max: 5, step: 1 },
      { key: "offset", label: "Stack Vertical Offset", type: "range", min: 4, max: 44, step: 1 },
      { key: "shrink", label: "Stack Scale Decay", type: "range", min: 0, max: 0.15, step: 0.005 },
      { key: "radius", label: "Card Border Radius", type: "range", min: 0, max: 48, step: 1 },
      { key: "lift", label: "Pointer Lift Elevation", type: "range", min: 1, max: 1.15, step: 0.005 },
      { key: "bg", label: "Stage Backdrop", type: "color" },
    ],
  },
  {
    key: "mirror",
    slug: "camera-mirror",
    name: "CameraMirror",
    tabLabel: "Camera Mirror",
    title: "Realtime Raster Video Mirror",
    description: "Local camera or procedural raster visualizer projecting luminance into circles, square matrices, or monospace ASCII character glyphs.",
    specs: [
      { label: "Video Stream", value: "WebRTC MediaDevices (Zero External Transfer)" },
      { label: "Processing Pipeline", value: "Micro-Canvas Subsampling with getImageData" },
      { label: "Typography Atlas", value: "High-Density Pre-rendered Glyph Cache" },
      { label: "Luminance Modulation", value: "Analytic ITU-R BT.601 Gamma Correction" },
    ],
    defaultProps: {
      cell: 12,
      mode: 0,
      contrast: 1.4,
      bright: 0,
      inv: 0,
      dot: 1,
      trail: 0.35,
      col: 0,
      c1: "#f2efe8",
      bg: "#08080b",
    },
    schema: [
      { key: "cell", label: "Cell Sampling Grid Size", type: "range", min: 6, max: 32, step: 1 },
      { key: "mode", label: "Mode (0:Dots, 1:Squares, 2:ASCII)", type: "range", min: 0, max: 2, step: 1 },
      { key: "contrast", label: "Luminance Contrast", type: "range", min: 0.5, max: 3, step: 0.01 },
      { key: "bright", label: "Exposure Bias", type: "range", min: -0.4, max: 0.4, step: 0.01 },
      { key: "inv", label: "Invert Light/Dark", type: "range", min: 0, max: 1, step: 1 },
      { key: "dot", label: "Element Scale Multiplier", type: "range", min: 0.4, max: 1.4, step: 0.01 },
      { key: "trail", label: "Visual Trail Persistence", type: "range", min: 0, max: 0.9, step: 0.01 },
      { key: "col", label: "Camera Color Blend", type: "range", min: 0, max: 1, step: 0.01 },
      { key: "c1", label: "Raster Element Ink", type: "color" },
      { key: "bg", label: "Background Floor", type: "color" },
    ],
  },
  {
    key: "reveal",
    slug: "scroll-reveal",
    name: "ScrollReveal",
    tabLabel: "Scroll Reveal",
    title: "Pure CSS Scroll-Driven Reveal",
    description: "Hardware-accelerated zero-JS viewport transitions utilizing native CSS animation-timeline: view() and stagger animation ranges.",
    specs: [
      { label: "Architecture", value: "Zero-JS Declarative CSS Timelines" },
      { label: "Viewport Triggers", value: "CSS animation-timeline: view()" },
      { label: "Kinetic Stagger", value: "Normalized calc(--i * --stag) Ranges" },
      { label: "Typography", value: "Bricolage Grotesque Condensed Display Font" },
    ],
    defaultProps: {
      rot: -6,
      sc: 0.78,
      bl: 8,
      rad: 48,
      stag: 5,
      sh: 60,
      lr: 8,
    },
    schema: [
      { key: "rot", label: "Initial Card Rotation", type: "range", min: -30, max: 30, step: 0.5 },
      { key: "sc", label: "Entry Scale Factor", type: "range", min: 0.3, max: 1, step: 0.01 },
      { key: "bl", label: "Entry Blur Filter (px)", type: "range", min: 0, max: 24, step: 0.5 },
      { key: "rad", label: "Card Radius (px)", type: "range", min: 0, max: 120, step: 1 },
      { key: "stag", label: "Letter Stagger Percentage", type: "range", min: 0, max: 12, step: 0.1 },
      { key: "sh", label: "Letter Rise Elevation (vh)", type: "range", min: 0, max: 120, step: 1 },
      { key: "lr", label: "Letter Twist Angle", type: "range", min: -45, max: 45, step: 0.5 },
    ],
  },
];

export function WebglOverviewSection() {
  const [activeKey, setActiveKey] = useState<EffectKey>("glass");
  const [rightPanelTab, setRightPanelTab] = useState<"controls" | "code" | "specs">("controls");
  const [customProps, setCustomProps] = useState<Record<string, Record<string, string | number | boolean>>>(() => {
    const initial: Record<string, Record<string, string | number | boolean>> = {};
    EFFECTS.forEach((e) => {
      initial[e.key] = { ...e.defaultProps };
    });
    return initial;
  });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedCardSlug, setCopiedCardSlug] = useState<string | null>(null);

  const [isAutoDrift, setIsAutoDrift] = useState(false);
  const [scrubPosition, setScrubPosition] = useState<number | null>(null);
  const stageCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeEffect = useMemo(
    () => EFFECTS.find((e) => e.key === activeKey) || EFFECTS[0]!,
    [activeKey]
  );

  const isScrollEffect =
    activeKey === "warp" ||
    activeKey === "ribbon" ||
    activeKey === "drum" ||
    activeKey === "rail";

  const currentProps = customProps[activeKey] || activeEffect.defaultProps;

  const handlePropChange = (key: string, val: string | number | boolean) => {
    setCustomProps((prev) => ({
      ...prev,
      [activeKey]: {
        ...prev[activeKey],
        [key]: val,
      },
    }));
  };

  const handleReset = () => {
    setCustomProps((prev) => ({
      ...prev,
      [activeKey]: { ...activeEffect.defaultProps },
    }));
    setIsAutoDrift(false);
    setScrubPosition(null);
  };

  const triggerScrollImpulse = (deltaY: number) => {
    setScrubPosition(null);
    if (stageCanvasRef.current) {
      stageCanvasRef.current.dispatchEvent(
        new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true })
      );
    }
  };

  const generatedJsx = useMemo(() => {
    const lines = Object.entries(currentProps).map(([k, v]) => {
      if (typeof v === "string") return `  ${k}="${v}"`;
      return `  ${k}={${v}}`;
    });
    return `<${activeEffect.name}\n${lines.join("\n")}\n/>`;
  }, [activeEffect, currentProps]);

  const handleCopyJsx = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(generatedJsx);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1400);
    }
  };

  const handleCopyCli = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`npx nexoreui add ${activeEffect.slug}`);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 1400);
    }
  };

  const handleCardCopyCli = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`npx nexoreui add ${slug}`);
      setCopiedCardSlug(slug);
      setTimeout(() => setCopiedCardSlug(null), 1400);
    }
  };

  return (
    <section className="space-y-12 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            WebGL Shaders
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
            Hardware-accelerated fragment shaders and interactive canvas physics components.
            Self-contained TypeScript components with adaptive resolution scaling.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyCli}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title="Copy CLI command"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{copiedCli ? "Copied!" : `npx nexoreui add ${activeEffect.slug}`}</span>
          </button>
        </div>
      </div>

      {/* Modern Clean Category Switcher (No numbers, No AI-slop) */}
      <div className="w-full overflow-x-auto pb-1 scrollbar-none">
        <div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 p-1.5 min-w-full sm:min-w-0">
          {EFFECTS.map((eff) => {
            const isActive = eff.key === activeKey;
            return (
              <button
                key={eff.key}
                type="button"
                onClick={() => {
                  setActiveKey(eff.key);
                  setIsAutoDrift(false);
                  setScrubPosition(null);
                }}
                className={`relative whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                }`}
              >
                {eff.tabLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Studio Grid (Canvas on Left, Multi-Tab Studio on Right) */}
      <div id="studio" className="grid grid-cols-1 gap-6 lg:grid-cols-12 w-full">
        {/* Left Column: Canvas Viewport (lg:col-span-7 xl:col-span-8) */}
        <div className="flex flex-col rounded-2xl border border-border bg-card lg:col-span-7 xl:col-span-8 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-muted/20">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-foreground">{activeEffect.title}</div>
              <div className="text-xs text-muted-foreground">{activeEffect.description}</div>
            </div>
            <Link
              href={`/docs/components/${activeEffect.slug}`}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
            >
              <span>Full documentation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="relative h-[440px] w-full bg-black/95">
            {activeKey === "glass" && (
              <GlassLens
                {...currentProps}
                ref={stageCanvasRef}
                className="h-full w-full"
              />
            )}
            {activeKey === "flute" && (
              <FlutedGlass
                {...currentProps}
                ref={stageCanvasRef}
                className="h-full w-full"
              />
            )}
            {activeKey === "ripple" && (
              <RippleWater
                {...currentProps}
                ref={stageCanvasRef}
                className="h-full w-full"
              />
            )}
            {activeKey === "warp" && (
              <ScrollWarp
                {...currentProps}
                ref={stageCanvasRef}
                captureWheel={true}
                autoScroll={isAutoDrift}
                scrollProgress={scrubPosition !== null ? scrubPosition : undefined}
                className="h-full w-full"
              />
            )}
            {activeKey === "ribbon" && (
              <TwistRibbon
                {...currentProps}
                ref={stageCanvasRef}
                captureWheel={true}
                autoScroll={isAutoDrift}
                scrollProgress={scrubPosition !== null ? scrubPosition : undefined}
                className="h-full w-full"
              />
            )}
            {activeKey === "dither" && (
              <DitherImage
                {...currentProps}
                ref={stageCanvasRef}
                className="h-full w-full"
              />
            )}
            {activeKey === "gravity" && (
              <GravityGrid
                {...currentProps}
                ref={stageCanvasRef}
                className="h-full w-full"
              />
            )}
            {activeKey === "drum" && (
              <ScrollDrum
                {...currentProps}
                ref={stageCanvasRef}
                captureWheel={true}
                autoScroll={isAutoDrift}
                scrollProgress={scrubPosition !== null ? scrubPosition : undefined}
                className="h-full w-full"
              />
            )}
            {activeKey === "smear" && (
              <LiquidSmear
                {...currentProps}
                ref={stageCanvasRef}
                className="h-full w-full"
              />
            )}
            {activeKey === "proximity" && (
              <TypeProximity
                {...currentProps}
                className="h-full w-full"
              />
            )}
            {activeKey === "foil" && (
              <HoloFoil
                {...currentProps}
                className="h-full w-full"
              />
            )}
            {activeKey === "pile" && (
              <LetterPile
                {...currentProps}
                ref={stageCanvasRef}
                className="h-full w-full"
              />
            )}
            {activeKey === "flow" && (
              <FlowField
                {...currentProps}
                ref={stageCanvasRef}
                className="h-full w-full"
              />
            )}
            {activeKey === "rail" && (
              <TextRail
                {...currentProps}
                captureWheel={true}
                autoScroll={isAutoDrift}
                scrollProgress={scrubPosition !== null ? scrubPosition : undefined}
                className="h-full w-full"
              />
            )}
            {activeKey === "moire" && (
              <MoireGrating
                {...currentProps}
                ref={stageCanvasRef}
                className="h-full w-full"
              />
            )}
            {activeKey === "deck" && (
              <SwipeDeck
                {...currentProps}
                className="h-full w-full"
              />
            )}
            {activeKey === "mirror" && (
              <CameraMirror
                {...currentProps}
                className="h-full w-full"
              />
            )}
            {activeKey === "reveal" && (
              <ScrollReveal
                {...currentProps}
                className="h-full w-full"
              />
            )}

            <div className="pointer-events-none absolute bottom-4 left-4 rounded-md border border-border/40 bg-background/80 px-2.5 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              {isScrollEffect
                ? "Scroll wheel over canvas or drag pointer"
                : "Move pointer across canvas to interact"}
            </div>
          </div>

          {isScrollEffect && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">Kinetic Controls:</span>
                <button
                  type="button"
                  onClick={() => triggerScrollImpulse(-600)}
                  className="flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-xs font-mono text-foreground transition hover:bg-muted"
                  title="Simulate rapid upward scroll flick"
                >
                  <ChevronUp className="h-3 w-3" />
                  Flick Up
                </button>
                <button
                  type="button"
                  onClick={() => triggerScrollImpulse(600)}
                  className="flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-xs font-mono text-foreground transition hover:bg-muted"
                  title="Simulate rapid downward scroll flick"
                >
                  <ChevronDown className="h-3 w-3" />
                  Flick Down
                </button>
                <button
                  type="button"
                  onClick={() => setIsAutoDrift((prev) => !prev)}
                  className={`flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-mono transition ${
                    isAutoDrift
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {isAutoDrift ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  {isAutoDrift ? "Pause Drift" : "Auto-Drift"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">Scrub:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.005"
                  value={scrubPosition !== null ? scrubPosition : 0.25}
                  onChange={(e) => {
                    setIsAutoDrift(false);
                    setScrubPosition(parseFloat(e.target.value));
                  }}
                  className="w-24 accent-primary h-1.5 bg-muted rounded appearance-none cursor-pointer"
                />
                {scrubPosition !== null && (
                  <button
                    type="button"
                    onClick={() => setScrubPosition(null)}
                    className="text-[10px] font-mono text-muted-foreground underline hover:text-foreground"
                  >
                    Release
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Fully Populated Studio Panel (lg:col-span-5 xl:col-span-4) */}
        <div className="flex flex-col rounded-2xl border border-border bg-card lg:col-span-5 xl:col-span-4 overflow-hidden shadow-sm">
          {/* Header with 3 Tabs */}
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5 bg-muted/20">
            <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => setRightPanelTab("controls")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  rightPanelTab === "controls"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span>Controls</span>
              </button>
              <button
                type="button"
                onClick={() => setRightPanelTab("code")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  rightPanelTab === "code"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="h-3 w-3" />
                <span>Code</span>
              </button>
              <button
                type="button"
                onClick={() => setRightPanelTab("specs")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  rightPanelTab === "specs"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Layers className="h-3 w-3" />
                <span>Specs</span>
              </button>
            </div>

            {rightPanelTab === "controls" && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition"
                title="Reset parameters to defaults"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Panel Content Body */}
          <div className="flex-1 overflow-y-auto p-4 max-h-[400px] min-h-[360px]">
            {rightPanelTab === "controls" && (
              <div className="space-y-3.5">
                {activeEffect.schema.map((c) => (
                  <div key={c.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">{c.label}</span>
                      <span className="font-mono text-foreground font-medium">
                        {c.type === "color"
                          ? currentProps[c.key]
                          : Number(currentProps[c.key]).toFixed(c.step && c.step < 0.01 ? 3 : 2)}
                      </span>
                    </div>
                    {c.type === "range" ? (
                      <input
                        type="range"
                        min={c.min}
                        max={c.max}
                        step={c.step}
                        value={Number(currentProps[c.key] ?? 0)}
                        onChange={(e) => handlePropChange(c.key, parseFloat(e.target.value))}
                        className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    ) : (
                      <input
                        type="color"
                        value={String(currentProps[c.key] ?? "#000000")}
                        onChange={(e) => handlePropChange(c.key, e.target.value)}
                        className="w-full h-7 rounded border border-border bg-transparent cursor-pointer p-0.5"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {rightPanelTab === "code" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-black/90 p-3 font-mono text-[11px] leading-relaxed text-zinc-300 overflow-x-auto whitespace-pre">
                  {`import { ${activeEffect.name} } from "nexoreui";\n\n${generatedJsx}`}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Parameters update dynamically in real time as you tweak the control sliders.
                </p>
              </div>
            )}

            {rightPanelTab === "specs" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
                  {activeEffect.specs.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between px-3 py-2 text-xs">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-mono text-foreground font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground leading-relaxed">
                  Exported directly as an isolated React client component with native WebGL rendering context.
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="border-t border-border p-3.5 bg-muted/20 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopyJsx}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? "Copied JSX Code" : "Copy JSX Component"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Component Catalog Grid (Full Width, No // Badges, Clean Professional Cards) */}
      <div id="component-catalog" className="space-y-6 pt-4 w-full">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Component Catalog
          </h2>
          <p className="text-sm text-muted-foreground">
            Complete library of WebGL shader components with live rendering previews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Card 1: GlassLens */}
          <Link
            href="/docs/components/glass-lens"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080c] overflow-hidden border-b border-border/40">
              <GlassLens
                size={0.34}
                disp={0.38}
                thick={1.4}
                mag={1.14}
                rim={0.65}
                spec={0.8}
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    GlassLens
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Refractive glass lens with dynamic chromatic dispersion, specular highlights, and lag physics.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add glass-lens</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "glass-lens")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "glass-lens" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 2: FlutedGlass */}
          <Link
            href="/docs/components/fluted-glass"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080c] overflow-hidden border-b border-border/40">
              <FlutedGlass
                cnt={24}
                bend={0.9}
                disp={0.3}
                warp={0.7}
                frost={0.2}
                edge={0.6}
                hl={0.9}
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    FlutedGlass
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Architectural ribbed glass panels with pointer-reactive lens curvature and wave perturbation.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add fluted-glass</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "fluted-glass")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "fluted-glass" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 3: RippleWater */}
          <Link
            href="/docs/components/ripple-water"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080c] overflow-hidden border-b border-border/40">
              <RippleWater
                fq={44}
                spd={1.1}
                damp={1.1}
                refr={1.3}
                spec={0.9}
                shade={2.6}
                idle={0.85}
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    RippleWater
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Surface wave simulation with pointer drag trails, periodic rain drops, and specular normal depth.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add ripple-water</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "ripple-water")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "ripple-water" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 4: ScrollWarp */}
          <Link
            href="/docs/components/scroll-warp"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080c] overflow-hidden border-b border-border/40">
              <ScrollWarp
                autoScroll={true}
                autoSpeed={2.2}
                curve={1.1}
                skew={0.65}
                split={0.9}
                wave={0.5}
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    ScrollWarp
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Page distortion driven by scroll velocity with non-linear pinch, chromatic split, and grain.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add scroll-warp</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "scroll-warp")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "scroll-warp" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 5: TwistRibbon */}
          <Link
            href="/docs/components/twist-ribbon"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080c] overflow-hidden border-b border-border/40">
              <TwistRibbon
                autoScroll={true}
                autoSpeed={3.0}
                twist={1.8}
                flex={1.2}
                wid={0.55}
                tilt={0.3}
                rep={3}
                text="3D RIBBON / MOTION / "
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    TwistRibbon
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  3D ribbon triangle-strip mesh accelerated by scroll velocity with depth testing and shading.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add twist-ribbon</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "twist-ribbon")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "twist-ribbon" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 6: DitherImage */}
          <Link
            href="/docs/components/dither-image"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080c] overflow-hidden border-b border-border/40">
              <DitherImage
                px={3}
                lv={3}
                cont={1.4}
                rad={0.28}
                soft={0.2}
                rv={1.0}
                c0="#09090d"
                c1="#2b38ff"
                c2="#ff5722"
                c3="#f3ede2"
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    DitherImage
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Quantized retro dithering through a 4-tone palette with interactive pointer reveal lens.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add dither-image</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "dither-image")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "dither-image" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 7: GravityGrid */}
          <Link
            href="/docs/components/gravity-grid"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080c] overflow-hidden border-b border-border/40">
              <GravityGrid
                cell={22}
                lw={0.014}
                mass={1.8}
                fall={3.4}
                wave={0.65}
                glow={0.8}
                bg="#08080d"
                ink="#c4cce8"
                hot="#ff5722"
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    GravityGrid
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Distorted coordinate grid with three inertial gravitational masses and wave propagation.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add gravity-grid</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "gravity-grid")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "gravity-grid" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 8: ScrollDrum */}
          <Link
            href="/docs/components/scroll-drum"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080c] overflow-hidden border-b border-border/40">
              <ScrollDrum
                autoScroll={true}
                autoSpeed={2.4}
                rad={1.15}
                bulge={0.38}
                split={0.8}
                tilt={-0.12}
                hl={0.85}
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    ScrollDrum
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Continuous 3D rotating cylinder of typography with scroll acceleration and chromatic split.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add scroll-drum</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "scroll-drum")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "scroll-drum" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 9: LiquidSmear */}
          <Link
            href="/docs/components/liquid-smear"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080c] overflow-hidden border-b border-border/40">
              <LiquidSmear
                push={1.6}
                rad={0.24}
                relax={0.978}
                spread={0.35}
                amt={1.1}
                disp={0.45}
                spec={0.7}
                shade={3.2}
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    LiquidSmear
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Persistent viscous fluid distortion where pointer dragging creates velocity trails that settle.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add liquid-smear</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "liquid-smear")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "liquid-smear" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 10: TypeProximity */}
          <Link
            href="/docs/components/type-proximity"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#e8eaee] overflow-hidden border-b border-border/40">
              <TypeProximity
                rad={200}
                wmin={200}
                wmax={800}
                size={7}
                idle={1.2}
                tint="#ff4a2b"
                ink="#0d0e12"
                bg="#e8eaee"
                lines={["Type", "Proximity"]}
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    TypeProximity
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every letter reads its distance to your finger or pointer and dynamically reshapes its weight and width axes.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add type-proximity</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "type-proximity")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "type-proximity" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 11: HoloFoil */}
          <Link
            href="/docs/components/holo-foil"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080c] overflow-hidden border-b border-border/40">
              <HoloFoil
                tilt={18}
                foil={1.1}
                sparkle={1.2}
                glare={0.8}
                radius={16}
                title="Holo"
                subtitle="Iridescent Card"
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    HoloFoil
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Multi-layered iridescent holographic card with rainbow spectral gradients, sparkles, and gyroscope tilt.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add holo-foil</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "holo-foil")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "holo-foil" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 12: LetterPile */}
          <Link
            href="/docs/components/letter-pile"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#101014] overflow-hidden border-b border-border/40">
              <LetterPile
                count={32}
                size={7}
                grav={0.8}
                bounce={0.5}
                c1="#ff4a2b"
                c2="#2d4bff"
                c3="#f4f1e8"
                bg="#101014"
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    LetterPile
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Simulated 2D physics disks containing typography with multi-pass circle collisions and pointer repulsion.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add letter-pile</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "letter-pile")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "letter-pile" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 13: FlowField */}
          <Link
            href="/docs/components/flow-field"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#07080c] overflow-hidden border-b border-border/40">
              <FlowField
                count={1200}
                speed={80}
                curl={1.4}
                scale={1.6}
                hue={190}
                range={120}
                glow={1}
                bg="#07080c"
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    FlowField
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dense vector field particle trails steered by triple harmonic sine curl equations with additive glow.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add flow-field</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "flow-field")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "flow-field" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 14: TextRail */}
          <Link
            href="/docs/components/text-rail"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#101014] overflow-hidden border-b border-border/40">
              <TextRail
                autoScroll={true}
                autoSpeed={2.5}
                rails={3}
                amp={0.18}
                freq={1.8}
                size={0.22}
                rot={-6}
                bg="#101014"
                ink="#f2efe8"
                c2="#ff4a2b"
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    TextRail
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Continuous typography riding SVG Catmull-Rom spline curves distorted and pushed by kinetic velocity.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add text-rail</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "text-rail")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "text-rail" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 15: MoireGrating */}
          <Link
            href="/docs/components/moire-grating"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#e8ebef] overflow-hidden border-b border-border/40">
              <MoireGrating
                type={0}
                gap={8}
                ratio={1.05}
                rot={0.08}
                duty={0.45}
                bg="#e8ebef"
                a="#101014"
                b="#ff4a2b"
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    MoireGrating
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dual optical grating arrays generating geometric interference fringes driven by coordinates and Lissajous drift.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add moire-grating</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "moire-grating")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "moire-grating" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 16: SwipeDeck */}
          <Link
            href="/docs/components/swipe-deck"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#0f1014] overflow-hidden border-b border-border/40">
              <SwipeDeck
                radius={20}
                offset={14}
                depth={3}
                bg="#0f1014"
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    SwipeDeck
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tactile gesture card deck with physical spring relaxation, velocity fling discharge, and infinite recycling.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add swipe-deck</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "swipe-deck")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "swipe-deck" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 17: CameraMirror */}
          <Link
            href="/docs/components/camera-mirror"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#08080b] overflow-hidden border-b border-border/40">
              <CameraMirror
                cell={10}
                mode={0}
                contrast={1.5}
                bg="#08080b"
                c1="#f2efe8"
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    CameraMirror
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Local camera or procedural raster visualizer projecting luminance into circles, square matrices, or ASCII characters.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add camera-mirror</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "camera-mirror")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "camera-mirror" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>

          {/* Card 18: ScrollReveal */}
          <Link
            href="/docs/components/scroll-reveal"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/40 hover:shadow-md"
          >
            <div className="relative h-48 w-full bg-[#101014] overflow-hidden border-b border-border/40">
              <ScrollReveal
                rot={-5}
                sc={0.85}
                rad={24}
                className="h-full w-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                    ScrollReveal
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Hardware-accelerated zero-JS viewport transitions utilizing native CSS scroll-driven timelines.
                </p>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>npx nexoreui add scroll-reveal</span>
                <button
                  type="button"
                  onClick={(e) => handleCardCopyCli(e, "scroll-reveal")}
                  className="rounded p-1 hover:bg-muted hover:text-foreground transition"
                  title="Copy command"
                >
                  {copiedCardSlug === "scroll-reveal" ? (
                    <Check className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
