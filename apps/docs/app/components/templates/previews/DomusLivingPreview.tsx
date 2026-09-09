"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Sun,
  Moon,
  Wind,
  Thermometer,
  Zap,
  Shield,
  ShieldCheck,
  CheckCircle2,
  X,
  Sliders,
  Sparkles,
  Lock,
  Unlock,
  Tv,
  Coffee,
  Volume2,
  ChevronRight,
  Battery,
  Lightbulb,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function DomusLivingPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [targetTemp, setTargetTemp] = useState(21.5);
  const [activeScene, setActiveScene] = useState<string>("Cinema Lounge");
  const [isPerimeterArmed, setIsPerimeterArmed] = useState(true);
  const [ambientToast, setAmbientToast] = useState<string | null>(null);

  const rooms = [
    {
      name: "Living Pavilion",
      temp: "21.5°C",
      humidity: "46%",
      aqi: "12 (Clean)",
      lightsOn: 4,
      totalLights: 6,
      music: "Miles Davis - Kind of Blue",
      energyNow: "1.4 kW",
    },
    {
      name: "Master Suite",
      temp: "19.0°C",
      humidity: "50%",
      aqi: "8 (Pure)",
      lightsOn: 1,
      totalLights: 4,
      music: "Ambient Rain Frequencies",
      energyNow: "0.6 kW",
    },
    {
      name: "Kitchen & Dining",
      temp: "22.0°C",
      humidity: "42%",
      aqi: "18 (Good)",
      lightsOn: 5,
      totalLights: 5,
      music: "Morning Acoustic Jazz",
      energyNow: "2.1 kW",
    },
    {
      name: "Wellness & Spa",
      temp: "24.0°C",
      humidity: "65%",
      aqi: "10 (Clean)",
      lightsOn: 2,
      totalLights: 3,
      music: "Sound Bath Solfeggio 528Hz",
      energyNow: "3.2 kW",
    },
  ];

  const currentRoom = rooms[selectedRoom];

  const handleSceneTrigger = (sceneName: string) => {
    setActiveScene(sceneName);
    setAmbientToast(`Ambient Scene Activated: [${sceneName}] throughout ${currentRoom.name}`);
    setTimeout(() => setAmbientToast(null), 3500);
  };

  const handleToggleSecurity = () => {
    const nextState = !isPerimeterArmed;
    setIsPerimeterArmed(nextState);
    setAmbientToast(
      nextState ? "Home Perimeter Armed • Smart Locks Engaged" : "Home Perimeter Disarmed • Guest Access Enabled"
    );
    setTimeout(() => setAmbientToast(null), 3500);
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
      {/* Top Navigation */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(10, 14, 12, 0.88)" : "rgba(255, 255, 255, 0.92)",
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
              <TemplateLogo icon={config.logoIcon || "zap"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Domus Living</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.12)",
                    color: "var(--template-primary)",
                  }}
                >
                  Smart Home
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">
                Whole-Home Ambient Intelligence & Climate Ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSecurity}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all active:scale-95 ${
                isPerimeterArmed ? "bg-emerald-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-foreground"
              }`}
            >
              {isPerimeterArmed ? <ShieldCheck className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isPerimeterArmed ? "Perimeter Armed" : "Disarmed"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {ambientToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.12)" : "#ecfdf5",
                borderColor: "rgba(16, 185, 129, 0.3)",
                color: "#10b981",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{ambientToast}</span>
              </div>
              <button onClick={() => setAmbientToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Room Navigation Strip */}
        <div className="grid grid-cols-2 @md:grid-cols-4 gap-3">
          {rooms.map((room, idx) => {
            const isSelected = selectedRoom === idx;
            return (
              <button
                key={room.name}
                onClick={() => setSelectedRoom(idx)}
                className="p-4 rounded-2xl border text-left transition-all relative overflow-hidden"
                style={{
                  backgroundColor: isSelected ? "var(--template-surface)" : "transparent",
                  borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: "var(--template-primary)" }}
                  />
                )}
                <div className="text-xs font-bold">{room.name}</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black">{room.temp}</span>
                  <span className="text-[10px] opacity-60">RH {room.humidity}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] opacity-60 mt-1">
                  <span>{room.lightsOn} lights on</span>
                  <span>•</span>
                  <span>{room.energyNow}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tactical Room Command Deck */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
          {/* Left: Climate & Ambience (7 cols) */}
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
                  <span className="text-xs font-mono opacity-60">MICROCLIMATE CONTROL</span>
                  <h3 className="text-base font-bold tracking-tight">{currentRoom.name}</h3>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-bold">HVAC INVERTER ECO</span>
              </div>

              {/* Tactile Temp Dial Card */}
              <div
                className="p-6 rounded-2xl border text-center space-y-4 relative overflow-hidden"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                  borderColor: "var(--template-border)",
                }}
              >
                <div className="text-xs font-semibold opacity-60 uppercase tracking-wider">
                  Target Ambient Setpoint
                </div>

                <div className="text-5xl font-black tracking-tight" style={{ color: "var(--template-primary)" }}>
                  {targetTemp.toFixed(1)}°C
                </div>

                <div className="max-w-xs mx-auto space-y-2">
                  <input
                    type="range"
                    min="18.0"
                    max="26.0"
                    step="0.5"
                    value={targetTemp}
                    onChange={(e) => setTargetTemp(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono opacity-50">
                    <span>18.0°C (Cool)</span>
                    <span>22.0°C (Comfort)</span>
                    <span>26.0°C (Warm)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs font-medium" style={{ borderColor: "var(--template-border)" }}>
                  <div>
                    <div className="text-[10px] opacity-50">AIR QUALITY</div>
                    <div className="font-bold text-emerald-500">{currentRoom.aqi}</div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-50">RELATIVE HUMIDITY</div>
                    <div className="font-bold">{currentRoom.humidity}</div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-50">AIR RECIRCULATION</div>
                    <div className="font-bold">HEPA H13 Active</div>
                  </div>
                </div>
              </div>

              {/* Ambient Preset Scene Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">
                  Quick Ambient Scenes
                </span>
                <div className="grid grid-cols-2 @sm:grid-cols-4 gap-2">
                  {[
                    { name: "Cinema Lounge", icon: Tv, desc: "Dim 15% • Warm 2700K" },
                    { name: "Focus & Code", icon: Sparkles, desc: "Cool 4000K • 100%" },
                    { name: "Morning Sunrise", icon: Sun, desc: "Gradual Circadian" },
                    { name: "Deep Rest", icon: Moon, desc: "Sleep Audio • 0% Lux" },
                  ].map((sc) => {
                    const isActive = activeScene === sc.name;
                    const Icon = sc.icon;
                    return (
                      <button
                        key={sc.name}
                        onClick={() => handleSceneTrigger(sc.name)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isActive
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-transparent hover:border-black/10 dark:hover:border-white/10"
                        }`}
                        style={{
                          backgroundColor: isActive ? undefined : "var(--template-surface)",
                          borderColor: isActive ? undefined : "var(--template-border)",
                        }}
                      >
                        <Icon className="w-4 h-4 mb-1.5" />
                        <div className="text-xs font-bold">{sc.name}</div>
                        <div className="text-[10px] opacity-60 mt-0.5">{sc.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Energy Grid & Whole-House Telemetry (5 cols) */}
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
                  Microgrid & Power Flow
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">100% SELF-POWERED</span>
              </div>

              {/* Energy Grid Flow Tiles */}
              <div className="space-y-3">
                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="text-xs font-bold">Rooftop Solar Array</div>
                      <div className="text-[10px] opacity-60">12.4 kW peak output</div>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-amber-500">+7.8 kW</span>
                </div>

                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Battery className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="text-xs font-bold">Lithium Powerwall Pack</div>
                      <div className="text-[10px] opacity-60">28.4 kWh • 94% State of Charge</div>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-500">Storing 4.1 kW</span>
                </div>

                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-indigo-500" />
                    <div>
                      <div className="text-xs font-bold">Municipal Utility Grid</div>
                      <div className="text-[10px] opacity-60">Zero import • Net Exporting</div>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-indigo-500">-3.7 kW (Feed-in)</span>
                </div>
              </div>

              {/* Current Ambient Audio Player */}
              <div
                className="p-3.5 rounded-xl border space-y-2"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                  borderColor: "var(--template-border)",
                }}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold">Multi-Zone Architectural Audio</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500">Lossless 24-bit</span>
                </div>
                <p className="text-xs opacity-80 line-clamp-1">Playing: {currentRoom.music}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
