"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Satellite,
  Radio,
  Compass,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  X,
  Sliders,
  Shield,
  Clock,
  Terminal,
  ChevronRight,
  Globe,
  Sun,
  Flame,
  BatteryCharging,
  Send,
  Lock,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function OrbitalXPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [selectedSat, setSelectedSat] = useState(0);
  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [isCommandArmLocked, setIsCommandArmLocked] = useState(true);
  const [missionToast, setMissionToast] = useState<string | null>(null);

  const satellites = [
    {
      norad: "ORB-58210",
      name: "AstraConstellation-07",
      orbit: "LEO 545 km • 97.4° Inclination",
      status: "NOMINAL",
      velocity: "7.58 km/s",
      apogee: "552 km",
      perigee: "538 km",
      propellant: "78.4% Hydrazine",
      solarGen: "1,420 W",
      batteryState: "94% (Charging)",
      thermal: "+18.2 °C (Radiator B)",
      gyroRate: "0.002 °/s (Zero-G Hold)",
      nextPass: "Svalbard Ground Station (04m 12s)",
      downlinkRate: "450 Mbps (Ka-Band)",
    },
    {
      norad: "ORB-58211",
      name: "AstraConstellation-08",
      orbit: "LEO 550 km • 97.4° Inclination",
      status: "ATTITUDE_TRIM",
      velocity: "7.57 km/s",
      apogee: "560 km",
      perigee: "542 km",
      propellant: "64.1% Hydrazine",
      solarGen: "1,390 W",
      batteryState: "88% (Discharging)",
      thermal: "+22.4 °C (Radiator A)",
      gyroRate: "0.014 °/s (Trimming)",
      nextPass: "Troll Research Station (12m 45s)",
      downlinkRate: "320 Mbps (X-Band)",
    },
    {
      norad: "ORB-58212",
      name: "AstraConstellation-09",
      orbit: "LEO 540 km • 97.4° Inclination",
      status: "NOMINAL",
      velocity: "7.59 km/s",
      apogee: "548 km",
      perigee: "532 km",
      propellant: "92.0% Hydrazine",
      solarGen: "1,450 W",
      batteryState: "98% (Float)",
      thermal: "+15.9 °C (Radiator B)",
      gyroRate: "0.001 °/s (Locked)",
      nextPass: "Punta Arenas Station (29m 10s)",
      downlinkRate: "500 Mbps (Ka-Band)",
    },
  ];

  const currentSat = satellites[selectedSat];

  const handleExecuteCommand = (cmdName: string) => {
    setIsCommandModalOpen(false);
    setIsCommandArmLocked(true);
    setMissionToast(`Telecommand Uplink Staged: [${cmdName}] broadcast to ${currentSat.name}`);
    setTimeout(() => setMissionToast(null), 4000);
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
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 12, 19, 0.9)" : "rgba(255, 255, 255, 0.92)",
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
              <TemplateLogo icon={config.logoIcon || "compass"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">OrbitalX Operations</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.12)",
                    color: "var(--template-primary)",
                  }}
                >
                  Aerospace
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">
                LEO Flight Dynamics & Ground Station Telemetry Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden @sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Svalbard AOS in 04:12</span>
            </div>

            <button
              onClick={() => setIsCommandModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Uplink Command</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {missionToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono"
              style={{
                backgroundColor: isDark ? "rgba(59, 130, 246, 0.12)" : "#eff6ff",
                borderColor: "rgba(59, 130, 246, 0.3)",
                color: "#3b82f6",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{missionToast}</span>
              </div>
              <button onClick={() => setMissionToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Constellation Sat Selector Strip */}
        <div className="grid grid-cols-1 @md:grid-cols-3 gap-3">
          {satellites.map((sat, i) => {
            const isSelected = selectedSat === i;
            return (
              <button
                key={sat.norad}
                onClick={() => setSelectedSat(i)}
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
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold opacity-60">{sat.norad}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      sat.status === "NOMINAL"
                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/15 text-amber-500 border border-amber-500/20"
                    }`}
                  >
                    {sat.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold tracking-tight">{sat.name}</h3>
                <p className="text-[11px] opacity-60 mt-1">{sat.orbit}</p>
              </button>
            );
          })}
        </div>

        {/* Tactical Telemetry Cockpit */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
          {/* Orbital Physics & Flight State (7 Cols) */}
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
                  <span className="text-xs font-mono opacity-60">FLIGHT DYNAMICS</span>
                  <h3 className="text-base font-bold tracking-tight">{currentSat.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-emerald-500">REALTIME TELEMETRY</span>
                </div>
              </div>

              {/* Orbital Arc Simulation Display */}
              <div
                className="p-4 rounded-xl border relative overflow-hidden flex flex-col justify-between h-48"
                style={{
                  backgroundColor: isDark ? "#060a12" : "#0f172a",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                }}
              >
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono opacity-70 tracking-wider">
                    {"GROUND TRACK // SUB-SATELLITE POSITION"}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">LAT 78.22° N • LON 15.65° E</span>
                </div>

                {/* SVG Visual Track */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 600 200">
                    <path
                      d="M 20,160 Q 200,20 400,100 T 580,40"
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.8)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                    <circle cx="340" cy="80" r="6" fill="#3b82f6" />
                    <circle cx="340" cy="80" r="14" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-2 z-10 pt-4 border-t border-white/10 font-mono text-xs">
                  <div>
                    <div className="text-[10px] opacity-60">ORBITAL VELOCITY</div>
                    <div className="font-bold text-sm text-cyan-400">{currentSat.velocity}</div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-60">APOGEE / PERIGEE</div>
                    <div className="font-bold text-sm text-emerald-400">
                      {currentSat.apogee} / {currentSat.perigee}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-60">DOWNLINK CARRIER</div>
                    <div className="font-bold text-sm text-indigo-300">{currentSat.downlinkRate}</div>
                  </div>
                </div>
              </div>

              {/* Subsystem Health Matrix */}
              <div className="grid grid-cols-2 @sm:grid-cols-4 gap-3">
                <div
                  className="p-3 rounded-xl border space-y-1"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-semibold">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>SOLAR POWER</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{currentSat.solarGen}</div>
                  <div className="text-[10px] text-emerald-500">Both Wings Deployed</div>
                </div>

                <div
                  className="p-3 rounded-xl border space-y-1"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-semibold">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                    <span>STORAGE</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{currentSat.batteryState}</div>
                  <div className="text-[10px] opacity-60">Li-Ion 48V Bus</div>
                </div>

                <div
                  className="p-3 rounded-xl border space-y-1"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-semibold">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>PROPULSION</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{currentSat.propellant}</div>
                  <div className="text-[10px] opacity-60">Delta-V: 184 m/s</div>
                </div>

                <div
                  className="p-3 rounded-xl border space-y-1"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-semibold">
                    <Compass className="w-3.5 h-3.5 text-indigo-500" />
                    <span>ATTITUDE GYRO</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{currentSat.gyroRate}</div>
                  <div className="text-[10px] text-emerald-500">3-Axis Stabilized</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ground Station Pass & Telemetry Log (5 Cols) */}
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
                  Ground Station Acquisition
                </span>
                <span className="text-xs font-mono text-emerald-500">TRACKING PASS #4012</span>
              </div>

              <div className="p-4 rounded-xl border space-y-2" style={{ borderColor: "var(--template-border)" }}>
                <div className="text-xs font-bold">{currentSat.nextPass}</div>
                <div className="flex items-center justify-between text-[11px] opacity-70">
                  <span>Elevation Peak: 74.2°</span>
                  <span>Duration: 09m 40s</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 w-3/4" />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-2">
                  Telemetry Event Log
                </span>
                <div className="space-y-2 font-mono text-[11px]">
                  {[
                    { t: "16:04:12Z", ev: "Star Tracker #2 autonomously aligned to guide stars", ok: true },
                    { t: "16:02:40Z", ev: "Heater Circuit B engaged: battery temp maintained at 18.2°C", ok: true },
                    { t: "15:58:19Z", ev: "Ka-Band Transponder downlink handshake confirmed", ok: true },
                    { t: "15:44:00Z", ev: "Periodic reaction wheel desaturation scheduled", ok: false },
                  ].map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border flex items-start justify-between gap-2"
                      style={{
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                        borderColor: "var(--template-border)",
                      }}
                    >
                      <span className="opacity-50 shrink-0">{log.t}</span>
                      <span className="flex-1 opacity-80">{log.ev}</span>
                      <span className={log.ok ? "text-emerald-500" : "text-amber-500"}>●</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Uplink Command Modal */}
      <AnimatePresence>
        {isCommandModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#080c14" : "#ffffff",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-bold">Staged Telecommand Uplink</h3>
                </div>
                <button onClick={() => setIsCommandModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs opacity-70">
                Target: <span className="font-mono font-bold text-blue-500">{currentSat.name}</span>. Telecommands
                require dual operator arming key verification prior to RF modulation.
              </p>

              {/* Arming Lock Slider */}
              <div
                className="p-3 rounded-xl border flex items-center justify-between text-xs"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#f8fafc",
                  borderColor: "var(--template-border)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Lock className={`w-4 h-4 ${isCommandArmLocked ? "text-amber-500" : "text-emerald-500"}`} />
                  <span className="font-semibold">
                    {isCommandArmLocked ? "Safety Interlock Armed (Locked)" : "Safety Interlock Bypassed"}
                  </span>
                </div>
                <button
                  onClick={() => setIsCommandArmLocked(!isCommandArmLocked)}
                  className="px-2.5 py-1 rounded text-[11px] font-bold border"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  {isCommandArmLocked ? "Disarm Interlock" : "Engage Lock"}
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: "EXEC_PAYLOAD_DIAGNOSTICS", desc: "Run spectral sensor baseline self-test" },
                  { name: "REORIENT_NADIR_POINTING", desc: "Slew reaction wheels to earth-center lock" },
                  { name: "TRIM_DELTA_V_BURN_0.2S", desc: "Fire monopropellant thrusters for 200ms" },
                ].map((cmd) => (
                  <button
                    key={cmd.name}
                    disabled={isCommandArmLocked}
                    onClick={() => handleExecuteCommand(cmd.name)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isCommandArmLocked
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-blue-500 hover:bg-blue-500/5 cursor-pointer"
                    }`}
                    style={{
                      borderColor: "var(--template-border)",
                    }}
                  >
                    <div>
                      <div className="font-mono text-xs font-bold">{cmd.name}</div>
                      <div className="text-[11px] opacity-60">{cmd.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsCommandModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
