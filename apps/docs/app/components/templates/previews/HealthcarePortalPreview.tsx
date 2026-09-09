"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Heart,
  Calendar,
  Clock,
  Pill,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  User,
  ShieldCheck,
  Video,
  FileText,
  Plus,
  X,
  Stethoscope,
  Sparkles,
  RefreshCw,
  Droplet,
  Moon,
  Zap,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function HealthcarePortalPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // Interactive States
  const [activeTab, setActiveTab] = useState<"telemetry" | "regimen" | "labs">("telemetry");
  const [selectedVital, setSelectedVital] = useState<"bpm" | "spo2" | "sleep" | "hrv">("bpm");
  const [checkedMeds, setCheckedMeds] = useState<string[]>(["med-1", "med-2"]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Cardiology");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("Tomorrow, 10:30 AM");
  const [bookingToast, setBookingToast] = useState(false);
  const [refillToast, setRefillToast] = useState<string | null>(null);
  const [symptomSeverity, setSymptomSeverity] = useState<string | null>(null);

  const vitalsData = {
    bpm: {
      label: "Resting Heart Rate",
      value: "64",
      unit: "BPM",
      delta: "-3 bpm vs 30d avg",
      status: "Optimal",
      icon: Heart,
      color: "text-rose-500",
      bgGlow: "rgba(244, 63, 94, 0.12)",
      trend: [62, 65, 68, 63, 61, 64, 66, 64],
    },
    spo2: {
      label: "Blood Oxygen (SpO2)",
      value: "98.8",
      unit: "%",
      delta: "+0.4% healthy range",
      status: "Excellent",
      icon: Droplet,
      color: "text-sky-500",
      bgGlow: "rgba(14, 165, 233, 0.12)",
      trend: [97, 98, 98.5, 99, 98.2, 98.6, 98.8, 98.8],
    },
    sleep: {
      label: "Sleep Recovery Score",
      value: "88",
      unit: "/100",
      delta: "7h 42m deep restorative",
      status: "Restorative",
      icon: Moon,
      color: "text-indigo-500",
      bgGlow: "rgba(99, 102, 241, 0.12)",
      trend: [72, 78, 81, 85, 82, 89, 84, 88],
    },
    hrv: {
      label: "Heart Rate Variability",
      value: "58",
      unit: "ms",
      delta: "+7ms autonomic balance",
      status: "High Resilience",
      icon: Activity,
      color: "text-emerald-500",
      bgGlow: "rgba(16, 185, 129, 0.12)",
      trend: [48, 52, 55, 51, 56, 54, 60, 58],
    },
  };

  const medications = [
    {
      id: "med-1",
      name: "Atorvastatin Calcium",
      dosage: "20mg • Oral Tablet",
      schedule: "Morning with meal",
      remaining: "24 days supply",
      prescribedBy: "Dr. Aris Thorne",
    },
    {
      id: "med-2",
      name: "Omega-3 Pure EPA/DHA",
      dosage: "1000mg • Softgel",
      schedule: "Midday with water",
      remaining: "18 days supply",
      prescribedBy: "Dr. Sarah Lin",
    },
    {
      id: "med-3",
      name: "Magnesium Glycinate",
      dosage: "400mg • Bedtime",
      schedule: "Evening before rest",
      remaining: "6 days supply (Refill Soon)",
      prescribedBy: "Dr. Aris Thorne",
    },
  ];

  const labPanels = [
    { test: "ApoB Lipoprotein", value: "68 mg/dL", target: "< 80 mg/dL", status: "Optimal", pct: 45 },
    { test: "High-Sensitivity CRP", value: "0.6 mg/L", target: "< 1.0 mg/L", status: "Low Risk", pct: 30 },
    { test: "Fasting Blood Glucose", value: "86 mg/dL", target: "70-99 mg/dL", status: "Optimal", pct: 50 },
    { test: "Estimated GFR (Kidney)", value: "112 mL/min", target: "> 90 mL/min", status: "Healthy", pct: 85 },
  ];

  const handleToggleMed = (id: string) => {
    setCheckedMeds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingOpen(false);
    setBookingToast(true);
    setTimeout(() => setBookingToast(false), 3500);
  };

  const handleRefill = (medName: string) => {
    setRefillToast(`Refill request sent to pharmacy for ${medName}.`);
    setTimeout(() => setRefillToast(null), 3000);
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
      {/* Top Telehealth Navigation */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "activity"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "PulseCare Health"}
                </span>
                <span className="hidden @md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  <ShieldCheck className="h-3 w-3" />
                  HIPAA Certified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            <div
              className="hidden @sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] opacity-80">Sync: Dexcom G7 (Active)</span>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Video className="h-3.5 w-3.5" />
              <span>Book Doctor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Clinical Telemetry Body */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @sm:py-8 space-y-6">
        {/* Patient Profile Header Card */}
        <div
          className="p-4 @sm:p-6 rounded-2xl border flex flex-col @md:flex-row items-start @md:items-center justify-between gap-4"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center font-bold text-base">
              ER
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base @sm:text-lg">Elena Rostova</h1>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                  Active Patient #4892
                </span>
              </div>
              <p className="text-xs opacity-75 mt-0.5">
                Primary Physician: Dr. Aris Thorne • Longevity & Preventive Cardiology
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full @md:w-auto justify-between @md:justify-end border-t @md:border-t-0 pt-3 @md:pt-0" style={{ borderColor: "var(--template-border)" }}>
            <div className="text-left @md:text-right">
              <span className="text-[11px] opacity-60 uppercase tracking-wider block">Next Consultation</span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">Sep 12, 10:30 AM (Telehealth)</span>
            </div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="p-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ borderColor: "var(--template-border)" }}
              aria-label="View appointment details"
            >
              <Calendar className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Biometrics 4-Metric Grid */}
        <div className="grid grid-cols-2 @lg:grid-cols-4 gap-3 @sm:gap-4">
          {(["bpm", "spo2", "sleep", "hrv"] as const).map((key) => {
            const item = vitalsData[key];
            const isSelected = selectedVital === key;
            const IconComp = item.icon;

            return (
              <button
                key={key}
                onClick={() => setSelectedVital(key)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected ? "ring-2 shadow-md" : "hover:border-opacity-60"
                }`}
                style={{
                  backgroundColor: isSelected ? "var(--template-surface-elevated)" : "var(--template-surface)",
                  borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs opacity-70 font-medium">{item.label}</span>
                  <div className={`p-1.5 rounded-lg ${item.color}`} style={{ backgroundColor: item.bgGlow }}>
                    <IconComp className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-2xl @sm:text-3xl font-black tracking-tight">{item.value}</span>
                  <span className="text-xs font-mono opacity-60">{item.unit}</span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {item.delta}
                  </span>
                  <span className="opacity-50 font-mono">{item.status}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Telemetry Waveform Visualization */}
        <div
          className="p-5 @sm:p-6 rounded-2xl border space-y-4"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-sm @sm:text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-500" />
                <span>Continuous 24h Telemetry: {vitalsData[selectedVital].label}</span>
              </h2>
              <p className="text-xs opacity-65">Continuous stream sampled every 60s via sensor telemetry.</p>
            </div>

            <div
              className="inline-flex p-1 rounded-xl border text-xs"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
              }}
            >
              {["12H", "24H", "7D", "30D"].map((range, idx) => (
                <span
                  key={range}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                    idx === 1 ? "bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold" : "opacity-60"
                  }`}
                >
                  {range}
                </span>
              ))}
            </div>
          </div>

          {/* SVG Sparkline Curve */}
          <div className="w-full h-28 relative flex items-end pt-4">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 80">
              <defs>
                <linearGradient id="vitalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--template-primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--template-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Shaded Area */}
              <path
                d="M 0 60 Q 100 20, 200 45 T 400 30 T 600 25 L 700 35 L 700 80 L 0 80 Z"
                fill="url(#vitalGradient)"
              />
              {/* Line */}
              <path
                d="M 0 60 Q 100 20, 200 45 T 400 30 T 600 25 L 700 35"
                fill="none"
                stroke="var(--template-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] font-mono opacity-50 pt-1 border-t" style={{ borderColor: "var(--template-border)" }}>
            <span>00:00 (Midnight)</span>
            <span>06:00 (Waking)</span>
            <span>12:00 (Midday)</span>
            <span>18:00 (Post-Workout)</span>
            <span>Current (Live)</span>
          </div>
        </div>

        {/* Two-Column Clinical Section: Medications + Symptom Triage */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Prescription Regimen & Lab Panels */}
          <div className="@lg:col-span-2 space-y-6">
            {/* Daily Medication Checklist */}
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm @sm:text-base flex items-center gap-2">
                    <Pill className="h-4 w-4 text-indigo-500" />
                    <span>Daily Medication Regimen</span>
                  </h3>
                  <p className="text-xs opacity-65">Tap pills to verify doses administered today.</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  {checkedMeds.length}/{medications.length} Complete
                </span>
              </div>

              <div className="space-y-2.5">
                {medications.map((med) => {
                  const isDone = checkedMeds.includes(med.id);
                  return (
                    <div
                      key={med.id}
                      className="p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors"
                      style={{
                        backgroundColor: "var(--template-surface-elevated)",
                        borderColor: "var(--template-border)",
                      }}
                    >
                      <button
                        onClick={() => handleToggleMed(med.id)}
                        className="flex items-center gap-3 text-left flex-1"
                      >
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                            isDone ? "bg-teal-600 border-teal-600 text-white" : "border-zinc-400 opacity-60"
                          }`}
                        >
                          {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <div className={`font-semibold text-xs @sm:text-sm ${isDone ? "line-through opacity-50" : ""}`}>
                            {med.name}
                          </div>
                          <div className="text-[11px] opacity-65 flex items-center gap-2">
                            <span>{med.dosage}</span>
                            <span>•</span>
                            <span>{med.schedule}</span>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden @sm:inline-block text-[11px] font-mono opacity-60">{med.remaining}</span>
                        <button
                          onClick={() => handleRefill(med.name)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-medium border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          style={{ borderColor: "var(--template-border)" }}
                        >
                          Refill
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comprehensive Lab Biomarkers */}
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm @sm:text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-500" />
                    <span>Quarterly Biomarker Panel</span>
                  </h3>
                  <p className="text-xs opacity-65">Verified by Quest Diagnostics Laboratories • Aug 28, 2026</p>
                </div>
                <button
                  onClick={() => alert("Downloading Lab Results PDF...")}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                >
                  Download PDF
                </button>
              </div>

              <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3">
                {labPanels.map((lab) => (
                  <div
                    key={lab.test}
                    className="p-3.5 rounded-xl border space-y-2"
                    style={{
                      backgroundColor: "var(--template-surface-elevated)",
                      borderColor: "var(--template-border)",
                    }}
                  >
                    <div className="flex justify-between items-start text-xs">
                      <span className="font-semibold">{lab.test}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        {lab.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-mono font-bold text-sm">{lab.value}</span>
                      <span className="text-[11px] opacity-60">Target: {lab.target}</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{ width: `${lab.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Symptom Triage + Care Team */}
          <div className="space-y-6">
            {/* Interactive Symptom Triage Card */}
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Symptom Triage Assistant</h3>
                  <p className="text-xs opacity-65">Log current symptoms for clinical review</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] opacity-70 font-medium block">Select Reported Sensations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Mild Fatigue", "Headache", "Tension", "Palpitations", "Joint Stiffness"].map((symp) => (
                    <button
                      key={symp}
                      onClick={() => setSymptomSeverity(symp)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        symptomSeverity === symp
                          ? "bg-teal-600 text-white border-teal-600"
                          : "border-zinc-300 dark:border-zinc-700 opacity-80 hover:opacity-100"
                      }`}
                    >
                      {symp}
                    </button>
                  ))}
                </div>
              </div>

              {symptomSeverity && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl border bg-teal-500/10 border-teal-500/20 text-xs space-y-1"
                >
                  <div className="font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Low Urgency Recorded</span>
                  </div>
                  <p className="opacity-80 leading-relaxed">
                    Condition logged in health record. Dr. Thorne recommended hydration and 8h restorative sleep.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Specialist Care Team */}
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <h3 className="font-bold text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-teal-500" />
                <span>Primary Care Specialists</span>
              </h3>

              <div className="space-y-3">
                {[
                  {
                    name: "Dr. Aris Thorne, MD",
                    role: "Cardiovascular Medicine",
                    status: "Available Tomorrow",
                    rating: "4.9 ★",
                  },
                  {
                    name: "Dr. Sarah Lin, PhD",
                    role: "Metabolic Nutrition",
                    status: "Next slot in 3 days",
                    rating: "5.0 ★",
                  },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="p-3 rounded-xl border flex items-center justify-between"
                    style={{
                      backgroundColor: "var(--template-surface-elevated)",
                      borderColor: "var(--template-border)",
                    }}
                  >
                    <div>
                      <div className="font-bold text-xs">{doc.name}</div>
                      <div className="text-[10px] opacity-65">{doc.role}</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSpecialty(doc.role);
                        setIsBookingOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white bg-teal-600 hover:bg-teal-500"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Appointment Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-5"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              color: "var(--template-fg)",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--template-border)" }}>
              <div className="flex items-center gap-2 font-bold text-base">
                <Calendar className="h-4 w-4 text-teal-500" />
                <span>Schedule Telehealth Visit</span>
              </div>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="p-1.5 rounded-lg opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1.5 opacity-80">Specialty</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <option value="Cardiology">Preventive Cardiology</option>
                  <option value="Endocrinology">Metabolic Endocrinology</option>
                  <option value="Longevity">Longevity & Biomarkers</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1.5 opacity-80">Preferred Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Tomorrow, 10:30 AM", "Tomorrow, 2:15 PM", "Sep 14, 9:00 AM", "Sep 14, 4:00 PM"].map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2 rounded-xl border text-center font-medium transition-colors ${
                        selectedTimeSlot === slot
                          ? "bg-teal-600 text-white border-teal-600"
                          : "border-zinc-300 dark:border-zinc-700 opacity-80 hover:opacity-100"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-teal-500/10 border-teal-500/20 text-[11px] leading-relaxed">
                ✓ Video consultation link and pre-appointment questionnaire will be dispatched to your email.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-semibold opacity-75 hover:opacity-100"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-sm"
                >
                  Confirm Visit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Toasts */}
      {bookingToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Consultation confirmed for {selectedTimeSlot}!</span>
        </div>
      )}

      {refillToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{refillToast}</span>
        </div>
      )}
    </div>
  );
}
