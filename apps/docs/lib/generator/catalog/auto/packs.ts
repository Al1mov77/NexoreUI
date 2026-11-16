import { buildValidatedMetric } from "../../copy-bank";
import {
  CockpitBlueprintPack,
  GeneratorUserConfig,
  OrbitSequencePack,
  StateMorphPack,
} from "../../schema";

export const AUTO_ORBIT_PACK: OrbitSequencePack = {
  id: "orbit-hangar-01",
  title: "Exterior studio views",
  environmentName: "Main showroom studio",
  frames: [
    {
      angle: 0,
      label: "Front view",
      url: "/generator/auto/sequences/orbit-hangar-01/frame-000.jpg",
      telemetryNote: "Low front nose channels air beneath the carbon floor.",
      dragCoefficient: "0.21 Cd",
    },
    {
      angle: 45,
      label: "Front quarter",
      url: "/generator/auto/sequences/orbit-hangar-01/frame-045.jpg",
      telemetryNote: "Double-wishbone front suspension tucked inside forged wheels.",
      dragCoefficient: "0.22 Cd",
    },
    {
      angle: 90,
      label: "Side profile",
      url: "/generator/auto/sequences/orbit-hangar-01/frame-090.jpg",
      telemetryNote: "2,700 mm wheelbase with a low 390 mm center of gravity.",
      dragCoefficient: "0.21 Cd",
    },
    {
      angle: 135,
      label: "Rear quarter",
      url: "/generator/auto/sequences/orbit-hangar-01/frame-135.jpg",
      telemetryNote: "Side air channels feed the rear cooling radiators.",
      dragCoefficient: "0.22 Cd",
    },
    {
      angle: 180,
      label: "Rear diffuser",
      url: "/generator/auto/sequences/orbit-hangar-01/frame-180.jpg",
      telemetryNote: "Four-channel carbon diffuser generates rear suction.",
      dragCoefficient: "0.23 Cd",
    },
    {
      angle: 225,
      label: "Rear wing",
      url: "/generator/auto/sequences/orbit-hangar-01/frame-225.jpg",
      telemetryNote: "Hydraulic carbon rear wing doubles as a high-speed airbrake.",
      dragCoefficient: "0.22 Cd",
    },
    {
      angle: 270,
      label: "Starboard profile",
      url: "/generator/auto/sequences/orbit-hangar-01/frame-270.jpg",
      telemetryNote: "Carbon doors with integrated side-impact protection beams.",
      dragCoefficient: "0.21 Cd",
    },
  ],
};

export const AUTO_MORPH_PACK: StateMorphPack = {
  id: "stealth-track-01",
  stateALabel: "Touring mode",
  stateACode: "Tour",
  stateAFrontUrl: "/generator/auto/morph/stealth-track-01/state-stealth-front.jpg",
  stateADescription:
    "Active wing retracted flush and suspension raised to 115 mm for highway comfort.",
  stateASpecs: [
    buildValidatedMetric("st-a1", "range", 640, "Highway touring range"),
    buildValidatedMetric("st-a2", "downforce", 290, "Flush wing position"),
    buildValidatedMetric("st-a3", "power", 880, "Touring power setting"),
    buildValidatedMetric("st-a4", "charge-time", 14, "Fast DC charging"),
  ],
  stateBLabel: "Track mode",
  stateBCode: "Track",
  stateBFrontUrl: "/generator/auto/morph/stealth-track-01/state-track-front.jpg",
  stateBRearUrl: "/generator/auto/morph/stealth-track-01/state-track-rear.jpg",
  stateBBrakeUrl: "/generator/auto/morph/stealth-track-01/state-track-brakes-hot.jpg",
  stateBDescription:
    "Ride height lowered 35 mm with active rear wing and carbon-ceramic brakes engaged.",
  stateBSpecs: [
    buildValidatedMetric("st-b1", "acceleration", 1.95, "All-wheel launch control"),
    buildValidatedMetric("st-b2", "downforce", 890, "Active wing deployed"),
    buildValidatedMetric("st-b3", "power", 1420, "Full power output"),
    buildValidatedMetric("st-b4", "top-speed", 392, "Track top speed"),
  ],
};

export const AUTO_COCKPIT_PACK: CockpitBlueprintPack = {
  id: "cockpit-blueprint-01",
  mainPovUrl: "/generator/auto/cockpit/cockpit-pov-main.jpg",
  hotspots: [
    {
      id: "hs-hud",
      label: "Windshield display",
      coordX: 48,
      coordY: 31,
      tag: "hud-telemetry",
      detailAssetUrl: "/generator/auto/cockpit/cockpit-hud-windshield.jpg",
      partCode: "CAB-01",
      headline: "Windshield head-up display",
      materialSpec: "Acoustic laminated glass",
      description:
        "Projects speed, navigation, and shift indicators directly in the driver line of sight.",
    },
    {
      id: "hs-dial",
      label: "Drive mode dial",
      coordX: 74,
      coordY: 78,
      tag: "forged-carbon",
      detailAssetUrl: "/generator/auto/cockpit/cockpit-center-dial.jpg",
      partCode: "CAB-02",
      headline: "Machined drive selector",
      materialSpec: "Carbon fiber and milled aluminum",
      description:
        "Tactile rotary dial mounted on the carbon center console for switching drive modes.",
    },
    {
      id: "hs-seats",
      label: "Carbon bucket seats",
      coordX: 86,
      coordY: 56,
      tag: "alcantara-cockpit",
      detailAssetUrl: "/generator/auto/cockpit/cockpit-alcantara-seats.jpg",
      partCode: "CAB-03",
      headline: "Lightweight carbon seats",
      materialSpec: "Perforated charcoal suede",
      description:
        "Carbon shell seats weighing 7.4 kg each with breathable suede cushions.",
    },
    {
      id: "hs-door",
      label: "Titanium door trim",
      coordX: 16,
      coordY: 64,
      tag: "titanium-hardware",
      detailAssetUrl: "/generator/auto/cockpit/cockpit-titanium-door.jpg",
      partCode: "CAB-04",
      headline: "Brushed titanium speaker grille",
      materialSpec: "Grade-2 titanium and suede",
      description:
        "Precision-drilled speaker grille integrated into the lightweight carbon door panel.",
    },
    {
      id: "hs-pedals",
      label: "Aluminum pedals",
      coordX: 45,
      coordY: 86,
      tag: "titanium-hardware",
      detailAssetUrl: "/generator/auto/cockpit/cockpit-billet-pedals.jpg",
      partCode: "CAB-05",
      headline: "Floor-hinged aluminum pedals",
      materialSpec: "Milled aircraft aluminum",
      description:
        "Load-cell brake pedal calibrated for progressive stopping power and firm feedback.",
    },
  ],
};

export function buildBriefOrbitPack(config: GeneratorUserConfig): OrbitSequencePack {
  const dfRear = Math.round(config.customMetrics.downforceKg * 0.58);
  return {
    ...AUTO_ORBIT_PACK,
    title: `${config.modelName} studio orbit`,
    environmentName: `${config.location} studio (${config.chassisCode})`,
    frames: AUTO_ORBIT_PACK.frames.map((frame) => {
      if (frame.angle === 180) {
        return {
          ...frame,
          telemetryNote: `Four-channel carbon diffuser generates ${dfRear} kg of rear suction.`,
        };
      }
      return frame;
    }),
  };
}

export function buildBriefMorphPack(config: GeneratorUserConfig): StateMorphPack {
  const m = config.customMetrics;
  const touringPower = Math.max(420, Math.round((m.powerHp * 0.62) / 10) * 10);
  const touringDownforce = Math.max(140, Math.round(m.downforceKg * 0.35));
  const trackDownforce = Math.max(m.downforceKg, Math.round(m.downforceKg * 1.08));
  const fastChargeMins = config.focusTags.includes("900v-charging") ? 12 : 16;

  return {
    ...AUTO_MORPH_PACK,
    stateADescription: `${config.modelName} (${config.chassisCode}) retracts the active wing and raises ride height to 115 mm for ${config.location} highway touring.`,
    stateASpecs: [
      buildValidatedMetric("st-a1", "range", m.rangeKm, "Highway touring range"),
      buildValidatedMetric("st-a2", "downforce", touringDownforce, "Flush wing position"),
      buildValidatedMetric("st-a3", "power", touringPower, "Touring power setting"),
      buildValidatedMetric("st-a4", "charge-time", fastChargeMins, "Fast DC charging"),
    ],
    stateBDescription: `Lowered 35 mm with active rear wing and ${config.focusTags.includes("ceramic-brakes") ? "carbon-ceramic" : "forged"} brakes engaged on ${config.modelName}.`,
    stateBSpecs: [
      buildValidatedMetric("st-b1", "acceleration", m.accelSeconds, "All-wheel launch control"),
      buildValidatedMetric("st-b2", "downforce", trackDownforce, "Active wing deployed"),
      buildValidatedMetric("st-b3", "power", m.powerHp, "Full power output"),
      buildValidatedMetric("st-b4", "top-speed", m.topSpeedKmh, "Track top speed"),
    ],
  };
}

export function buildBriefCockpitPack(config: GeneratorUserConfig): CockpitBlueprintPack {
  const hasHud = config.focusTags.includes("hud-telemetry");
  const sorted = [...AUTO_COCKPIT_PACK.hotspots].sort((a, b) => {
    const aFocus = config.focusTags.includes(a.tag) ? 1 : 0;
    const bFocus = config.focusTags.includes(b.tag) ? 1 : 0;
    return bFocus - aFocus;
  });
  return {
    ...AUTO_COCKPIT_PACK,
    hotspots: sorted.map((hs) =>
      hs.id === "hs-hud" && hasHud
        ? {
            ...hs,
            description: `Calibrated for ${config.modelName}: projects speed, lap timing, and shift markers in line of sight.`,
          }
        : hs
    ),
  };
}
