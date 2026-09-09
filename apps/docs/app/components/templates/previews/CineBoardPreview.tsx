"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clapperboard,
  Film,
  Camera,
  Layers,
  Sliders,
  CheckCircle2,
  X,
  Sparkles,
  Video,
  Aperture,
  Maximize2,
  Clock,
  Calendar,
  PackageCheck,
  ChevronRight,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function CineBoardPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [selectedShot, setSelectedShot] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<"2.39:1" | "16:9" | "4:3">("2.39:1");
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);
  const [gearManifestToast, setGearManifestToast] = useState<string | null>(null);

  const shots = [
    {
      scene: "SCENE 14A",
      shotNumber: "SHOT 01",
      type: "EXT. DESERT HIGHWAY - DUSK",
      framing: "Extreme Wide Shot (EWS)",
      movement: "Slow Drone Push-In (3.2m/s)",
      lens: "Cooke Anamorphic /i Full Frame Plus 40mm T2.3",
      lighting: "Golden Hour Natural Ambient + 12kW HMI Bounce",
      sound: "Low wind rustle, distant vehicle rumble",
      scriptNote: "The lone vintage interceptor vehicle idles on asphalt heat mirage as sodium street lamps buzz to life.",
      colorGrade: "Kodak 5219 500T Stock Emulation",
      duration: "00:08",
    },
    {
      scene: "SCENE 14A",
      shotNumber: "SHOT 02",
      type: "INT. CABIN - DUSK",
      framing: "Tight Close-Up (TCU)",
      movement: "Handheld Micro-Shake (Character Breath)",
      lens: "ARRI Master Prime 85mm T1.3",
      lighting: "Dashboard LED phosphor glow + warm sodium side rim",
      sound: "Heavy analog radio static, ignition click",
      scriptNote: "Elena's knuckles tighten on the leather steering wheel. Eyes dart toward rearview mirror.",
      colorGrade: "Deep Amber Cyan Split Tone",
      duration: "00:05",
    },
    {
      scene: "SCENE 14B",
      shotNumber: "SHOT 03",
      type: "EXT. ABANDONED MOTEL - NIGHT",
      framing: "Medium Two-Shot (M2S)",
      movement: "Dolly Track Left to Right (Circular)",
      lens: "Zeiss Supreme Prime 29mm T1.5",
      lighting: "Flickering neon red tube + cold moonlight backlight",
      sound: "Neon ballast hum, dripping rain gutter",
      scriptNote: "Both operatives exchange encrypted satellite drive under buzzing vacancy sign.",
      colorGrade: "High Contrast Neo-Noir Bleach Bypass",
      duration: "00:12",
    },
  ];

  const currentShot = shots[selectedShot];

  const handleCheckoutPackage = () => {
    setIsGearModalOpen(false);
    setGearManifestToast("Production Gear Manifest submitted to Camera Rental House!");
    setTimeout(() => setGearManifestToast(null), 4000);
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans text-left"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(12, 10, 16, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "layers"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">CineBoard Studio</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(244, 63, 94, 0.12)",
                    color: "var(--template-primary)",
                  }}
                >
                  Film & Media
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">
                Feature Pre-Production & Visual Storyboard Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Aspect Ratio Selector */}
            <div
              className="flex items-center gap-1 p-1 rounded-lg border text-xs"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              {(["2.39:1", "16:9", "4:3"] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-all ${
                    aspectRatio === ratio
                      ? "bg-rose-500 text-white shadow-sm"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsGearModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Camera Package</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {gearManifestToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(244, 63, 94, 0.12)" : "#fff1f2",
                borderColor: "rgba(244, 63, 94, 0.3)",
                color: "#e11d48",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <span>{gearManifestToast}</span>
              </div>
              <button onClick={() => setGearManifestToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Storyboard Deck Grid */}
        <div className="grid grid-cols-1 @md:grid-cols-3 gap-4">
          {shots.map((shot, idx) => {
            const isSelected = selectedShot === idx;
            return (
              <button
                key={shot.shotNumber}
                onClick={() => setSelectedShot(idx)}
                className="rounded-2xl border text-left overflow-hidden transition-all relative flex flex-col justify-between"
                style={{
                  backgroundColor: "var(--template-surface)",
                  borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                }}
              >
                {/* Visual Viewport Simulation */}
                <div
                  className="w-full p-4 flex flex-col justify-between relative overflow-hidden transition-all"
                  style={{
                    backgroundColor: isDark ? "#09060b" : "#18181b",
                    color: "#ffffff",
                    aspectRatio: aspectRatio === "2.39:1" ? "21/9" : aspectRatio === "16:9" ? "16/9" : "4/3",
                  }}
                >
                  {/* Framing Reticle */}
                  <div className="absolute inset-2 border border-white/20 rounded pointer-events-none flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white/40" />
                  </div>

                  <div className="flex items-center justify-between z-10 text-[10px] font-mono">
                    <span className="bg-rose-600 px-1.5 py-0.5 rounded font-bold text-white">
                      {shot.shotNumber}
                    </span>
                    <span className="opacity-70">{shot.duration}</span>
                  </div>

                  <div className="z-10 text-left">
                    <div className="text-[10px] font-mono text-rose-400 font-semibold">{shot.scene}</div>
                    <div className="text-xs font-bold text-white line-clamp-1">{shot.framing}</div>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold opacity-80 line-clamp-1">{shot.type}</span>
                    <span className="opacity-60 text-[10px] font-mono">{aspectRatio}</span>
                  </div>
                  <p className="text-[11px] opacity-60 line-clamp-1">{shot.scriptNote}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Shot Technical Dossier */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
          {/* Main Director & DP Specifications (7 cols) */}
          <div className="@lg:col-span-7 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-6"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-rose-500">
                      {currentShot.scene} // {currentShot.shotNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 font-mono">
                      TARGET: {currentShot.duration}
                    </span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight">{currentShot.type}</h3>
                </div>

                <span className="text-xs font-mono font-bold opacity-60">{currentShot.framing}</span>
              </div>

              {/* Script Breakdown & Director Notes */}
              <div
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                  borderColor: "var(--template-border)",
                }}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 block">
                  Action & Director Blocking Notes
                </span>
                <p className="text-xs leading-relaxed italic opacity-85">"{currentShot.scriptNote}"</p>
              </div>

              {/* Technical Camera & Optics Specs */}
              <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3 text-xs">
                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold opacity-60">
                    <Aperture className="w-3.5 h-3.5 text-rose-500" />
                    <span>LENS & FOCAL LENGTH</span>
                  </div>
                  <div className="font-semibold text-xs">{currentShot.lens}</div>
                </div>

                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold opacity-60">
                    <Video className="w-3.5 h-3.5 text-indigo-500" />
                    <span>CAMERA MOVEMENT</span>
                  </div>
                  <div className="font-semibold text-xs">{currentShot.movement}</div>
                </div>

                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold opacity-60">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>LIGHTING & GAFFER DESIGN</span>
                  </div>
                  <div className="font-semibold text-xs">{currentShot.lighting}</div>
                </div>

                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold opacity-60">
                    <Film className="w-3.5 h-3.5 text-emerald-500" />
                    <span>COLOR PALETTE & EMULATION</span>
                  </div>
                  <div className="font-semibold text-xs">{currentShot.colorGrade}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stripboard Production Schedule (5 cols) */}
          <div className="@lg:col-span-5 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-5"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Call Sheet Stripboard
                </span>
                <span className="text-xs font-mono text-rose-500 font-bold">DAY 03 OF 18</span>
              </div>

              <div className="space-y-2">
                {[
                  { strip: "14A", loc: "EXT. HIGHWAY DUSK", pages: "1 2/8", cast: "ELENA, MARK", time: "18:30 - 20:15", type: "EXT_NIGHT" },
                  { strip: "14B", loc: "INT. SEDAN CABIN", pages: "6/8", cast: "ELENA", time: "20:30 - 22:00", type: "INT_NIGHT" },
                  { strip: "15", loc: "EXT. NEON MOTEL", pages: "2 1/8", cast: "ELENA, OPERATIVE", time: "22:45 - 02:00", type: "EXT_NIGHT" },
                ].map((strip) => (
                  <div
                    key={strip.strip}
                    className="p-3 rounded-xl border text-xs flex items-center justify-between"
                    style={{
                      borderColor: "var(--template-border)",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold bg-rose-500/20 text-rose-600 px-1.5 py-0.5 rounded text-[10px]">
                          SCENE {strip.strip}
                        </span>
                        <span className="font-bold">{strip.loc}</span>
                      </div>
                      <div className="text-[11px] opacity-60 mt-1">
                        Cast: {strip.cast} • Pages: {strip.pages}
                      </div>
                    </div>
                    <div className="text-right text-[10px] font-mono opacity-75">{strip.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Camera Package Rental Modal */}
      <AnimatePresence>
        {isGearModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#0d0912" : "#ffffff",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-bold">Rental Package Manifest</h3>
                </div>
                <button onClick={() => setIsGearModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs opacity-70">
                Equipment assigned to Principal Photography Unit A. Insured by Lloyd’s Production Binder #941.
              </p>

              <div className="space-y-2 text-xs">
                {[
                  { item: "ARRI Alexa 35 Camera Body (LPL Mount)", status: "Reserved", serial: "SN-9421" },
                  { item: "Cooke Anamorphic /i Full Frame 5-Lens Set", status: "Reserved", serial: "SN-3081" },
                  { item: "Teradek Bolt 4K 1500 TX/RX Wireless Video", status: "Checked Out", serial: "SN-7712" },
                  { item: "SmallHD Cine 13” 4K High-Bright Monitor", status: "Reserved", serial: "SN-5520" },
                ].map((gear) => (
                  <div
                    key={gear.item}
                    className="p-3 rounded-xl border flex items-center justify-between"
                    style={{
                      backgroundColor: "var(--template-surface)",
                      borderColor: "var(--template-border)",
                    }}
                  >
                    <div>
                      <div className="font-semibold">{gear.item}</div>
                      <div className="text-[10px] font-mono opacity-50">{gear.serial}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-500">
                      {gear.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsGearModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckoutPackage}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ backgroundColor: "var(--template-primary)" }}
                >
                  Confirm Reservation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
