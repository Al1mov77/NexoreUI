import { AutoSubcategoryId, EngineeringTag, ToneId } from "../../schema";

export const ENGINEERING_TAG_META: ReadonlyArray<{
  id: EngineeringTag;
  label: string;
  code: string;
}> = [
  { id: "900v-charging", label: "900V Fast Charging", code: "HV-900" },
  { id: "aerodynamics", label: "Active Aerodynamics", code: "AERO-DF" },
  { id: "ceramic-brakes", label: "Carbon-Ceramic Brakes", code: "CCB-420" },
  { id: "forged-carbon", label: "Carbon Fiber Body", code: "CF-MONO" },
  { id: "alcantara-cockpit", label: "Suede Sport Cabin", code: "CAB-ALC" },
  { id: "laser-optics", label: "Matrix LED Headlights", code: "OPT-LSR" },
  { id: "hud-telemetry", label: "Windshield Head-Up Display", code: "HUD-AR" },
  { id: "titanium-hardware", label: "Center-Lock Forged Wheels", code: "TI-CNC" },
] as const;

export interface SubcategoryDefaultSpec {
  id: AutoSubcategoryId;
  label: string;
  shortDesc: string;
  defaultTone: ToneId;
  defaultBrandName: string;
  defaultModelName: string;
  defaultChassisCode: string;
  defaultLocation: string;
  defaultFocusTags: readonly EngineeringTag[];
  defaultCustomMetrics: {
    accelSeconds: number;
    topSpeedKmh: number;
    rangeKm: number;
    powerHp: number;
    massDeltaKg: number;
    downforceKg: number;
    basePriceUsd: number;
  };
}

export const AUTO_SUBCATEGORY_PRESETS: Readonly<
  Record<AutoSubcategoryId, SubcategoryDefaultSpec>
> = {
  "hypercar-launch": {
    id: "hypercar-launch",
    label: "Exotic & Supercar Dealership",
    shortDesc: "Showroom for flagship coupes and electric sports cars.",
    defaultTone: "technical",
    defaultBrandName: "Kronos",
    defaultModelName: "Valkyrie GT",
    defaultChassisCode: "KR-900",
    defaultLocation: "Zurich",
    defaultFocusTags: ["900v-charging", "aerodynamics", "laser-optics", "forged-carbon"],
    defaultCustomMetrics: {
      accelSeconds: 1.95,
      topSpeedKmh: 392,
      rangeKm: 640,
      powerHp: 1420,
      massDeltaKg: -135,
      downforceKg: 820,
      basePriceUsd: 295000,
    },
  },
  "motorsport-tuning": {
    id: "motorsport-tuning",
    label: "Motorsport & Track Division",
    shortDesc: "Track-prepared cars with ceramic brakes and active wings.",
    defaultTone: "track",
    defaultBrandName: "Apex Werks",
    defaultModelName: "RS Coupe",
    defaultChassisCode: "AW-GT3",
    defaultLocation: "Munich",
    defaultFocusTags: ["ceramic-brakes", "titanium-hardware", "aerodynamics", "hud-telemetry"],
    defaultCustomMetrics: {
      accelSeconds: 2.08,
      topSpeedKmh: 384,
      rangeKm: 520,
      powerHp: 1240,
      massDeltaKg: -168,
      downforceKg: 960,
      basePriceUsd: 345000,
    },
  },
  "bespoke-dealership": {
    id: "bespoke-dealership",
    label: "Bespoke Collector Salon",
    shortDesc: "Private showroom for custom-built grand tourers.",
    defaultTone: "luxury",
    defaultBrandName: "Vortex",
    defaultModelName: "Obsidian GT",
    defaultChassisCode: "VX-015",
    defaultLocation: "Geneva",
    defaultFocusTags: ["alcantara-cockpit", "titanium-hardware", "laser-optics", "hud-telemetry"],
    defaultCustomMetrics: {
      accelSeconds: 2.25,
      topSpeedKmh: 365,
      rangeKm: 610,
      powerHp: 1120,
      massDeltaKg: -95,
      downforceKg: 680,
      basePriceUsd: 420000,
    },
  },
  "carbon-atelier": {
    id: "carbon-atelier",
    label: "Electric & Lightweight Studio",
    shortDesc: "Long-range electric vehicles with lightweight carbon bodies.",
    defaultTone: "heritage",
    defaultBrandName: "Atelier Carbon",
    defaultModelName: "Aero 01",
    defaultChassisCode: "AC-CF88",
    defaultLocation: "Milan",
    defaultFocusTags: ["forged-carbon", "aerodynamics", "titanium-hardware", "ceramic-brakes"],
    defaultCustomMetrics: {
      accelSeconds: 2.02,
      topSpeedKmh: 375,
      rangeKm: 580,
      powerHp: 1310,
      massDeltaKg: -185,
      downforceKg: 890,
      basePriceUsd: 245000,
    },
  },
} as const;
