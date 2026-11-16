export type ForgeSubcategoryId = "ev-flagship" | "track-division" | "bespoke-atelier";

export type HeroVariantId = "hangar-wide" | "topdown-aero" | "chiaroscuro-front";
export type StateMorphModeId = "tri-state-console" | "split-curtain-compare";
export type OrbitModeId = "drag-turntable" | "scroll-scrub-orbit";
export type CockpitModeId = "pov-hud-hotspots" | "interior-spec-deck";
export type MacroModeId = "optical-lens-matrix" | "technical-blueprint-grid";
export type ConversionModeId =
  | "allocation-configurator"
  | "track-session-booking"
  | "bespoke-commission";

export type RigGroup = "hero" | "tri-state" | "orbit-360" | "cockpit" | "macro";

export interface ForgeAssetItem {
  id: string;
  fileName: string;
  mediaUrl: string;
  rigGroup: RigGroup;
  chassisSeries: "series-a-hangar" | "series-b-studio" | "shared-interior" | "shared-macro";
  subcategories: readonly ForgeSubcategoryId[];
  angleDeg?: number;
  stateKey?: "stealth" | "track" | "launch" | "rear-aero" | "brake-thermal";
  hotspotX?: number;
  hotspotY?: number;
  defaultTitle: string;
  defaultMetric: string;
  defaultDetail: string;
  activeInOrbit?: boolean;
}

export interface ForgeSubcategorySchema {
  id: ForgeSubcategoryId;
  label: string;
  shortCode: string;
  summary: string;
  recommendedHero: HeroVariantId;
  recommendedStateMode: StateMorphModeId;
  recommendedOrbitMode: OrbitModeId;
  recommendedCockpitMode: CockpitModeId;
  recommendedMacroMode: MacroModeId;
  recommendedConversion: ConversionModeId;
  defaultInputs: ForgeUserInputs;
  defaultMacroIds: readonly string[];
}

export interface ForgeUserInputs {
  brandName: string;
  modelName: string;
  tagline: string;
  powerOutput: string;
  acceleration0to100: string;
  topSpeed: string;
  downforceOrRange: string;
  downforceOrRangeLabel: string;
  chassisMaterial: string;
  allocationCount: string;
  basePriceUsd: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
}

export interface ForgeRigSelection {
  heroVariant: HeroVariantId;
  enableStateMorph: boolean;
  stateMorphMode: StateMorphModeId;
  enableOrbit360: boolean;
  orbitMode: OrbitModeId;
  enableCockpit: boolean;
  cockpitMode: CockpitModeId;
  enableMacroMatrix: boolean;
  macroMode: MacroModeId;
  selectedMacroIds: string[];
  conversionMode: ConversionModeId;
}

export interface ForgeSynthesizedCopy {
  heroHeadline: string;
  heroLead: string;
  telemetryBannerNote: string;
  stateDescriptions: {
    stealth: { title: string; rideHeight: string; aeroBalance: string; detail: string };
    track: { title: string; rideHeight: string; aeroBalance: string; detail: string };
    launch: { title: string; rideHeight: string; aeroBalance: string; detail: string };
  };
  orbitAnnotations: Record<string, { title: string; metric: string; note: string }>;
  cockpitNotes: Record<string, { title: string; spec: string; note: string }>;
  macroNotes: Record<string, { title: string; metric: string; note: string }>;
  conversionHeading: string;
  conversionSubheading: string;
}

export interface ForgeBuildRecord {
  buildId: string;
  verticalId: string;
  subcategoryId: ForgeSubcategoryId;
  inputs: ForgeUserInputs;
  rigs: ForgeRigSelection;
  synthesized: ForgeSynthesizedCopy;
  ownerEmail: string | null;
  createdAt: number;
}

export const FORGE_AUTOMOTIVE_ASSETS: readonly ForgeAssetItem[] = [
  {
    id: "hero-hangar-wide",
    fileName: "hero-hangar-wide.jpg",
    mediaUrl: "/api/forge/media/automotive/hero-hangar-wide.jpg",
    rigGroup: "hero",
    chassisSeries: "series-a-hangar",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    defaultTitle: "Asymmetric Hangar Stage",
    defaultMetric: "0.24 Cd",
    defaultDetail: "Full-width dark concrete bay with negative space on the port side for primary telemetry.",
  },
  {
    id: "hero-topdown-aero",
    fileName: "hero-topdown-aero.jpg",
    mediaUrl: "/api/forge/media/automotive/hero-topdown-aero.jpg",
    rigGroup: "hero",
    chassisSeries: "series-a-hangar",
    subcategories: ["track-division", "ev-flagship"],
    defaultTitle: "Overhead Teardrop Planform",
    defaultMetric: "840 kg @ 250 km/h",
    defaultDetail: "Top-down orthographic projection exposing hood NACA extraction ducts and tapered cabin glass.",
  },
  {
    id: "hero-chiaroscuro-front",
    fileName: "hero-chiaroscuro-front.jpg",
    mediaUrl: "/api/forge/media/automotive/hero-chiaroscuro-front.jpg",
    rigGroup: "hero",
    chassisSeries: "series-a-hangar",
    subcategories: ["bespoke-atelier", "ev-flagship"],
    angleDeg: 0,
    defaultTitle: "Front Chiaroscuro Silhouette",
    defaultMetric: "1,980 mm Width",
    defaultDetail: "Low-key overhead rim light isolating front fender crests and central wiper blade.",
  },
  {
    id: "state-01-stealth",
    fileName: "state-01-stealth.jpg",
    mediaUrl: "/api/forge/media/automotive/state-01-stealth.jpg",
    rigGroup: "tri-state",
    chassisSeries: "series-a-hangar",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    stateKey: "stealth",
    defaultTitle: "Stealth Mode (Dormant Aero)",
    defaultMetric: "120 mm Ride Height",
    defaultDetail: "Optical emitters off, front dive planes retracted, rear decklid flush for minimal drag.",
  },
  {
    id: "state-02-track",
    fileName: "state-02-track.jpg",
    mediaUrl: "/api/forge/media/automotive/state-02-track.jpg",
    rigGroup: "tri-state",
    chassisSeries: "series-a-hangar",
    subcategories: ["track-division", "ev-flagship", "bespoke-atelier"],
    stateKey: "track",
    defaultTitle: "Track Mode (Active Downforce)",
    defaultMetric: "75 mm Ride Height",
    defaultDetail: "Multi-element laser projectors active, front canards deployed, hydraulic rear wing raised.",
  },
  {
    id: "state-03-launch",
    fileName: "state-03-launch.jpg",
    mediaUrl: "/api/forge/media/automotive/state-03-launch.jpg",
    rigGroup: "tri-state",
    chassisSeries: "series-a-hangar",
    subcategories: ["track-division", "ev-flagship"],
    stateKey: "launch",
    defaultTitle: "Launch Control (Kinetic Vector)",
    defaultMetric: "1.85 s 0-100 km/h",
    defaultDetail: "Four-wheel torque vectoring pre-loaded with active slip regulation and directional launch streaks.",
  },
  {
    id: "state-rear-aero-wing",
    fileName: "state-rear-aero-wing.jpg",
    mediaUrl: "/api/forge/media/automotive/state-rear-aero-wing.jpg",
    rigGroup: "tri-state",
    chassisSeries: "series-a-hangar",
    subcategories: ["track-division", "ev-flagship"],
    stateKey: "rear-aero",
    defaultTitle: "Active Carbon Rear Wing & Diffuser",
    defaultMetric: "32 deg Attack Angle",
    defaultDetail: "Dual-pylon swan-neck carbon wing deployed above full-width OLED tail signature and titanium exhaust.",
  },
  {
    id: "state-brake-thermal",
    fileName: "state-brake-thermal.jpg",
    mediaUrl: "/api/forge/media/automotive/state-brake-thermal.jpg",
    rigGroup: "tri-state",
    chassisSeries: "series-a-hangar",
    subcategories: ["track-division", "bespoke-atelier"],
    stateKey: "brake-thermal",
    defaultTitle: "Carbon-Ceramic Rotor under Peak Thermal Load",
    defaultMetric: "980 C Rotor Temp",
    defaultDetail: "420 mm cross-drilled carbon-silicon-carbide disc glowing amber behind forged carbon spokes.",
  },
  {
    id: "orbit-000-raw",
    fileName: "orbit-000-raw.jpg",
    mediaUrl: "/api/forge/media/automotive/orbit-000-raw.jpg",
    rigGroup: "orbit-360",
    chassisSeries: "series-b-studio",
    subcategories: ["ev-flagship"],
    angleDeg: 0,
    activeInOrbit: false,
    defaultTitle: "0 deg Front Reserve Plate",
    defaultMetric: "0 deg",
    defaultDetail: "Archived raw front studio capture.",
  },
  {
    id: "orbit-045-front-quarter",
    fileName: "orbit-045-front-quarter.jpg",
    mediaUrl: "/api/forge/media/automotive/orbit-045-front-quarter.jpg",
    rigGroup: "orbit-360",
    chassisSeries: "series-b-studio",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    angleDeg: 45,
    activeInOrbit: true,
    defaultTitle: "45 deg Front Three-Quarter",
    defaultMetric: "48:52 Mass Split",
    defaultDetail: "Front carbon splitter, bi-LED DRL signature, and front wheel arch vent routing.",
  },
  {
    id: "orbit-090-side-profile",
    fileName: "orbit-090-side-profile.jpg",
    mediaUrl: "/api/forge/media/automotive/orbit-090-side-profile.jpg",
    rigGroup: "orbit-360",
    chassisSeries: "series-b-studio",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    angleDeg: 90,
    activeInOrbit: true,
    defaultTitle: "90 deg Port Flank Profile",
    defaultMetric: "2,745 mm Wheelbase",
    defaultDetail: "Monocoque side air channel sculpting and low-drag roofline proportions.",
  },
  {
    id: "orbit-135-rear-quarter",
    fileName: "orbit-135-rear-quarter.jpg",
    mediaUrl: "/api/forge/media/automotive/orbit-135-rear-quarter.jpg",
    rigGroup: "orbit-360",
    chassisSeries: "series-b-studio",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    angleDeg: 135,
    activeInOrbit: true,
    defaultTitle: "135 deg Rear Three-Quarter",
    defaultMetric: "1,120 Nm Rear Axle",
    defaultDetail: "Rear haunch intake channels feeding the rear inverters and active wing pylons.",
  },
  {
    id: "orbit-180-rear-direct",
    fileName: "orbit-180-rear-direct.jpg",
    mediaUrl: "/api/forge/media/automotive/orbit-180-rear-direct.jpg",
    rigGroup: "orbit-360",
    chassisSeries: "series-b-studio",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    angleDeg: 180,
    activeInOrbit: true,
    defaultTitle: "180 deg Direct Stern & Diffuser",
    defaultMetric: "4-Channel Venturi",
    defaultDetail: "Twin OLED rear light blades over exposed carbon underbody diffuser tunnels.",
  },
  {
    id: "orbit-225-opposite-rear",
    fileName: "orbit-225-opposite-rear.jpg",
    mediaUrl: "/api/forge/media/automotive/orbit-225-opposite-rear.jpg",
    rigGroup: "orbit-360",
    chassisSeries: "series-b-studio",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    angleDeg: 225,
    activeInOrbit: true,
    defaultTitle: "225 deg Starboard Rear Quarter",
    defaultMetric: "21-Inch Forged Alloys",
    defaultDetail: "Opposite rear quarter highlighting negative-pressure wheel arch extraction.",
  },
  {
    id: "orbit-270-opposite-side",
    fileName: "orbit-270-opposite-side.jpg",
    mediaUrl: "/api/forge/media/automotive/orbit-270-opposite-side.jpg",
    rigGroup: "orbit-360",
    chassisSeries: "series-b-studio",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    angleDeg: 270,
    activeInOrbit: true,
    defaultTitle: "270 deg Starboard Profile",
    defaultMetric: "1,090 mm Total Height",
    defaultDetail: "Continuous waistline crease and carbon side sill ground-effect skirt.",
  },
  {
    id: "cockpit-driver-pov",
    fileName: "cockpit-driver-pov.jpg",
    mediaUrl: "/api/forge/media/automotive/cockpit-driver-pov.jpg",
    rigGroup: "cockpit",
    chassisSeries: "shared-interior",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    defaultTitle: "Driver Cockpit POV",
    defaultMetric: "12.4-Inch Cluster",
    defaultDetail: "Flat-bottom carbon-Alcantara steering wheel with central digital rev/power gauge.",
  },
  {
    id: "cockpit-windshield-hud",
    fileName: "cockpit-windshield-hud.jpg",
    mediaUrl: "/api/forge/media/automotive/cockpit-windshield-hud.jpg",
    rigGroup: "cockpit",
    chassisSeries: "shared-interior",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    hotspotX: 50,
    hotspotY: 28,
    defaultTitle: "Collimated Windshield HUD",
    defaultMetric: "1.8 G Lateral Vector",
    defaultDetail: "Direct-glass holographic projection displaying real-time G-force radar and speed.",
  },
  {
    id: "cockpit-center-console",
    fileName: "cockpit-center-console.jpg",
    mediaUrl: "/api/forge/media/automotive/cockpit-center-console.jpg",
    rigGroup: "cockpit",
    chassisSeries: "shared-interior",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    hotspotX: 74,
    hotspotY: 78,
    defaultTitle: "Floating Carbon Bridge & Rotary Selector",
    defaultMetric: "CNC 7075 Aluminum",
    defaultDetail: "Knurled solid aluminum drive mode dial set into open-pore matte carbon fiber.",
  },
  {
    id: "cockpit-alcantara-seat",
    fileName: "cockpit-alcantara-seat.jpg",
    mediaUrl: "/api/forge/media/automotive/cockpit-alcantara-seat.jpg",
    rigGroup: "cockpit",
    chassisSeries: "shared-interior",
    subcategories: ["bespoke-atelier", "track-division", "ev-flagship"],
    hotspotX: 88,
    hotspotY: 56,
    defaultTitle: "Fixed Carbon Shell Bucket Seat",
    defaultMetric: "5.4 kg Seat Mass",
    defaultDetail: "Perforated charcoal Alcantara cushions with precision contrast micro-stitching.",
  },
  {
    id: "cockpit-door-acoustics",
    fileName: "cockpit-door-acoustics.jpg",
    mediaUrl: "/api/forge/media/automotive/cockpit-door-acoustics.jpg",
    rigGroup: "cockpit",
    chassisSeries: "shared-interior",
    subcategories: ["bespoke-atelier", "ev-flagship"],
    hotspotX: 14,
    hotspotY: 66,
    defaultTitle: "Machined Titanium Door Acoustic Array",
    defaultMetric: "1,400 W / 14 Drivers",
    defaultDetail: "Micro-drilled brushed titanium transducer grille with flush pull release.",
  },
  {
    id: "cockpit-billet-pedals",
    fileName: "cockpit-billet-pedals.jpg",
    mediaUrl: "/api/forge/media/automotive/cockpit-billet-pedals.jpg",
    rigGroup: "cockpit",
    chassisSeries: "shared-interior",
    subcategories: ["track-division", "bespoke-atelier"],
    hotspotX: 46,
    hotspotY: 90,
    defaultTitle: "Floor-Mounted Billet Pedal Box",
    defaultMetric: "Load-Cell Brake",
    defaultDetail: "5-axis CNC-milled aluminum arms with machined traction studs and exposed linkage.",
  },
  {
    id: "macro-charging-port",
    fileName: "macro-charging-port.jpg",
    mediaUrl: "/api/forge/media/automotive/macro-charging-port.jpg",
    rigGroup: "macro",
    chassisSeries: "shared-macro",
    subcategories: ["ev-flagship"],
    defaultTitle: "800V Motorized CCS Port",
    defaultMetric: "350 kW Peak DC",
    defaultDetail: "Actuated carbon charge door with status telemetry ring: 10% to 80% in 16 minutes.",
  },
  {
    id: "macro-camera-winglet",
    fileName: "macro-camera-winglet.jpg",
    mediaUrl: "/api/forge/media/automotive/macro-camera-winglet.jpg",
    rigGroup: "macro",
    chassisSeries: "shared-macro",
    subcategories: ["ev-flagship", "track-division"],
    defaultTitle: "Digital Side-Camera Blade",
    defaultMetric: "-4.2% Frontal Drag",
    defaultDetail: "Wind-tunnel sculpted carbon winglet housing a 120 fps HDR rear-vision optic.",
  },
  {
    id: "macro-hood-aeroduct",
    fileName: "macro-hood-aeroduct.jpg",
    mediaUrl: "/api/forge/media/automotive/macro-hood-aeroduct.jpg",
    rigGroup: "macro",
    chassisSeries: "shared-macro",
    subcategories: ["track-division", "ev-flagship", "bespoke-atelier"],
    defaultTitle: "Front Hood S-Duct Extraction Channel",
    defaultMetric: "210 kg Front Load",
    defaultDetail: "Twin carbon channels evacuating high-pressure front radiator airflow over the windshield.",
  },
  {
    id: "macro-laser-headlight",
    fileName: "macro-laser-headlight.jpg",
    mediaUrl: "/api/forge/media/automotive/macro-laser-headlight.jpg",
    rigGroup: "macro",
    chassisSeries: "shared-macro",
    subcategories: ["ev-flagship", "track-division", "bespoke-atelier"],
    defaultTitle: "Tri-Lens Matrix Laser Projector",
    defaultMetric: "650 m Throw Range",
    defaultDetail: "Collimated laser modules mounted on CNC-finned titanium thermal sinks.",
  },
  {
    id: "macro-forged-carbon",
    fileName: "macro-forged-carbon.jpg",
    mediaUrl: "/api/forge/media/automotive/macro-forged-carbon.jpg",
    rigGroup: "macro",
    chassisSeries: "shared-macro",
    subcategories: ["bespoke-atelier", "track-division"],
    defaultTitle: "Autoclave Forged Carbon Composite",
    defaultMetric: "65,000 Nm/deg Rigidity",
    defaultDetail: "Isotropic chopped-tow carbon fiber cured under high pressure with satin clearcoat.",
  },
  {
    id: "macro-centerlock-nut",
    fileName: "macro-centerlock-nut.jpg",
    mediaUrl: "/api/forge/media/automotive/macro-centerlock-nut.jpg",
    rigGroup: "macro",
    chassisSeries: "shared-macro",
    subcategories: ["track-division", "bespoke-atelier"],
    defaultTitle: "Anodized Titanium Center-Lock Hub",
    defaultMetric: "600 Nm Lock Torque",
    defaultDetail: "Grade-5 titanium monoblock wheel fastener with laser-etched torque vectors.",
  },
] as const;

export const FORGE_SUBCATEGORIES: readonly ForgeSubcategorySchema[] = [
  {
    id: "ev-flagship",
    label: "Electric Hypercar Flagship",
    shortCode: "EV-GT",
    summary:
      "Quad-motor electric flagship with 800V fast-charge architecture, studio 360 turntable, and collimated HUD telemetry.",
    recommendedHero: "hangar-wide",
    recommendedStateMode: "tri-state-console",
    recommendedOrbitMode: "drag-turntable",
    recommendedCockpitMode: "pov-hud-hotspots",
    recommendedMacroMode: "optical-lens-matrix",
    recommendedConversion: "allocation-configurator",
    defaultInputs: {
      brandName: "KRONOS",
      modelName: "ZERO-GT",
      tagline: "Quad-motor carbon monocoque engineered for sustained 800V track deployment.",
      powerOutput: "1,420 kW (1,914 HP)",
      acceleration0to100: "1.85 s",
      topSpeed: "412 km/h",
      downforceOrRange: "540 km WLTP",
      downforceOrRangeLabel: "Combined Range",
      chassisMaterial: "T1000 Carbon Tub",
      allocationCount: "40 Units Worldwide",
      basePriceUsd: "$2,350,000",
      primaryCtaLabel: "Configure Allocation",
      secondaryCtaLabel: "Inspect 360 Studio",
    },
    defaultMacroIds: [
      "macro-charging-port",
      "macro-camera-winglet",
      "macro-laser-headlight",
      "macro-hood-aeroduct",
    ],
  },
  {
    id: "track-division",
    label: "Track & Motorsport Division",
    shortCode: "TRACK-RS",
    summary:
      "Closed-circuit aerodynamic weapon featuring Stealth/Track/Launch tri-state morphing, glowing ceramic rotors, and active swan-neck wing.",
    recommendedHero: "topdown-aero",
    recommendedStateMode: "tri-state-console",
    recommendedOrbitMode: "scroll-scrub-orbit",
    recommendedCockpitMode: "pov-hud-hotspots",
    recommendedMacroMode: "technical-blueprint-grid",
    recommendedConversion: "track-session-booking",
    defaultInputs: {
      brandName: "VORTEX",
      modelName: "APEX-R",
      tagline: "Active ground-effect track prototype with 840 kg downforce and thermal ceramic braking.",
      powerOutput: "1,180 kW (1,600 HP)",
      acceleration0to100: "1.92 s",
      topSpeed: "395 km/h",
      downforceOrRange: "840 kg @ 250 km/h",
      downforceOrRangeLabel: "Peak Downforce",
      chassisMaterial: "Forged Carbon Monocoque",
      allocationCount: "18 Track Builds",
      basePriceUsd: "$2,890,000",
      primaryCtaLabel: "Book Telemetry Session",
      secondaryCtaLabel: "Test Aero States",
    },
    defaultMacroIds: [
      "macro-hood-aeroduct",
      "macro-centerlock-nut",
      "macro-forged-carbon",
      "macro-camera-winglet",
    ],
  },
  {
    id: "bespoke-atelier",
    label: "Bespoke Showroom & Carbon Atelier",
    shortCode: "ATELIER",
    summary:
      "Private commission specification suite focused on exposed forged composites, perforated Alcantara seating, and CNC titanium acoustics.",
    recommendedHero: "chiaroscuro-front",
    recommendedStateMode: "split-curtain-compare",
    recommendedOrbitMode: "drag-turntable",
    recommendedCockpitMode: "pov-hud-hotspots",
    recommendedMacroMode: "optical-lens-matrix",
    recommendedConversion: "bespoke-commission",
    defaultInputs: {
      brandName: "AETHER",
      modelName: "NOCTURNE",
      tagline: "Coachbuilt carbon-titanium grand tourer tailored to individual chassis telemetry.",
      powerOutput: "1,250 kW (1,700 HP)",
      acceleration0to100: "1.98 s",
      topSpeed: "404 km/h",
      downforceOrRange: "65,000 Nm/deg",
      downforceOrRangeLabel: "Torsional Rigidity",
      chassisMaterial: "Exposed Forged Composite",
      allocationCount: "12 Commissions",
      basePriceUsd: "$3,200,000",
      primaryCtaLabel: "Request Atelier Slot",
      secondaryCtaLabel: "Explore Cockpit",
    },
    defaultMacroIds: [
      "macro-forged-carbon",
      "macro-centerlock-nut",
      "macro-laser-headlight",
      "macro-hood-aeroduct",
    ],
  },
] as const;

export function getActiveOrbitAssets(): ForgeAssetItem[] {
  return FORGE_AUTOMOTIVE_ASSETS.filter(
    (a) => a.rigGroup === "orbit-360" && a.activeInOrbit === true
  );
}

export function getHeroAsset(variant: HeroVariantId): ForgeAssetItem {
  const idMap: Record<HeroVariantId, string> = {
    "hangar-wide": "hero-hangar-wide",
    "topdown-aero": "hero-topdown-aero",
    "chiaroscuro-front": "hero-chiaroscuro-front",
  };
  return (
    FORGE_AUTOMOTIVE_ASSETS.find((a) => a.id === idMap[variant]) ||
    FORGE_AUTOMOTIVE_ASSETS[0]
  );
}

export function buildDefaultSynthesizedCopy(
  subcategoryId: ForgeSubcategoryId,
  inputs: ForgeUserInputs
): ForgeSynthesizedCopy {
  const fullModel = `${inputs.brandName} ${inputs.modelName}`.trim();
  return {
    heroHeadline: `${fullModel}: ${inputs.chassisMaterial}`,
    heroLead: inputs.tagline,
    telemetryBannerNote: `${inputs.allocationCount} | ${inputs.powerOutput} | 0-100 km/h in ${inputs.acceleration0to100}`,
    stateDescriptions: {
      stealth: {
        title: `${inputs.modelName} Stealth Calibration`,
        rideHeight: "120 mm Standard Clearance",
        aeroBalance: "0.24 Cd Low-Drag Profile",
        detail: `Flush decklid and closed front channels configure ${fullModel} for low-signature highway transit.`,
      },
      track: {
        title: `${inputs.modelName} Track Calibration`,
        rideHeight: "75 mm Hydraulic Drop",
        aeroBalance: inputs.downforceOrRange,
        detail: `Laser projectors ignite while front dive planes and the swan-neck carbon wing lock into high-downforce geometry.`,
      },
      launch: {
        title: `${inputs.modelName} Launch Control`,
        rideHeight: "68 mm Rear Squat Pre-Load",
        aeroBalance: `${inputs.acceleration0to100} Launch Vector`,
        detail: `Inverters pre-charge all four corners to deliver ${inputs.powerOutput} with active slip telemetry.`,
      },
    },
    orbitAnnotations: {
      "45": {
        title: "Front Splitter & Bi-LED Optics",
        metric: "48:52 Static Balance",
        note: `Carbon intake ducts channel cooling air across ${inputs.brandName} front inverters.`,
      },
      "90": {
        title: "Monocoque Side Air Channel",
        metric: "2,745 mm Wheelbase",
        note: `Sculpted doors route boundary-layer airflow directly into the rear quarter radiators.`,
      },
      "135": {
        title: "Rear Haunch & Active Pylons",
        metric: inputs.powerOutput,
        note: `Muscular rear fenders house dual rear axial-flux motors and hydraulic wing actuators.`,
      },
      "180": {
        title: "Venturi Diffuser & OLED Blade",
        metric: "4-Tunnel Underbody",
        note: `Full-width rear extraction tunnels generate ground effect without parasitic drag.`,
      },
      "225": {
        title: "Starboard Aero Extraction",
        metric: "21-Inch Forged Wheels",
        note: `Louvred rear wheel arches vent turbulent high-pressure air from the brake assemblies.`,
      },
      "270": {
        title: "Ground-Effect Side Sill",
        metric: "1,090 mm Roofline",
        note: `Teardrop canopy profile stabilizes high-speed yaw at ${inputs.topSpeed}.`,
      },
    },
    cockpitNotes: {
      "cockpit-windshield-hud": {
        title: "Collimated Windshield HUD",
        spec: "1.8 G Telemetry Vector",
        note: `Projects real-time apex speed, battery thermal state, and lateral G-loads onto the glass.`,
      },
      "cockpit-center-console": {
        title: "CNC Aluminum Drive Selector",
        spec: "7075 Billet & Matte Carbon",
        note: `Tactile rotary indexing between Stealth, Track, and Launch calibrations.`,
      },
      "cockpit-alcantara-seat": {
        title: "Carbon Shell Bucket Seat",
        spec: "5.4 kg Fixed Shell",
        note: `Perforated charcoal Alcantara pads custom-molded to the driver torso.`,
      },
      "cockpit-door-acoustics": {
        title: "Brushed Titanium Acoustic Grille",
        spec: "14-Channel Cabin Array",
        note: `CNC-perforated titanium fascia integrated into the structural carbon door card.`,
      },
      "cockpit-billet-pedals": {
        title: "Floor-Hinged Billet Pedal Box",
        spec: "Load-Cell Brake Sensor",
        note: `Zero-play machined aluminum pedals calibrated for threshold trail-braking.`,
      },
    },
    macroNotes: {
      "macro-charging-port": {
        title: "800V Motorized Charge Port",
        metric: "350 kW DC Input",
        note: "Automated carbon flap with circular charge-state telemetry halo.",
      },
      "macro-camera-winglet": {
        title: "Digital Side-Camera Winglet",
        metric: "-4.2% Drag Delta",
        note: "Replaces conventional mirrors with a carbon blade and low-latency HDR sensor.",
      },
      "macro-hood-aeroduct": {
        title: "Hood S-Duct Extraction",
        metric: "210 kg Front Axle Load",
        note: "Evacuates front heat-exchanger airflow to pin the nose at high speed.",
      },
      "macro-laser-headlight": {
        title: "Matrix Laser Headlight Module",
        metric: "650 m Illumination",
        note: "Triple projector optics cooled by internal machined titanium heat sinks.",
      },
      "macro-forged-carbon": {
        title: "Forged Carbon Weave",
        metric: "65,000 Nm/deg",
        note: "High-pressure molded carbon composite with isotropic structural strength.",
      },
      "macro-centerlock-nut": {
        title: "Titanium Center-Lock Fastener",
        metric: "600 Nm Torque Spec",
        note: "Single-nut motorsport hub machined from anodized Grade-5 titanium.",
      },
    },
    conversionHeading:
      subcategoryId === "track-division"
        ? `Schedule ${fullModel} Circuit Telemetry`
        : subcategoryId === "bespoke-atelier"
        ? `Commission Your ${fullModel} Specification`
        : `Reserve ${fullModel} Build Allocation`,
    conversionSubheading: `${inputs.allocationCount} available starting at ${inputs.basePriceUsd}. Select chassis trim and delivery telemetry below.`,
  };
}

export function compileForgeBuildTsx(build: ForgeBuildRecord): string {
  const heroAsset = getHeroAsset(build.rigs.heroVariant);
  const orbitAssets = getActiveOrbitAssets();
  const macroAssets = FORGE_AUTOMOTIVE_ASSETS.filter(
    (a) => a.rigGroup === "macro" && build.rigs.selectedMacroIds.includes(a.id)
  );

  const payload = {
    brandName: build.inputs.brandName,
    modelName: build.inputs.modelName,
    tagline: build.synthesized.heroLead,
    heroHeadline: build.synthesized.heroHeadline,
    powerOutput: build.inputs.powerOutput,
    acceleration: build.inputs.acceleration0to100,
    topSpeed: build.inputs.topSpeed,
    downforceOrRangeLabel: build.inputs.downforceOrRangeLabel,
    downforceOrRange: build.inputs.downforceOrRange,
    allocationCount: build.inputs.allocationCount,
    basePriceUsd: build.inputs.basePriceUsd,
    primaryCtaLabel: build.inputs.primaryCtaLabel,
    secondaryCtaLabel: build.inputs.secondaryCtaLabel,
    heroImage: `/assets/automotive/${heroAsset.fileName}`,
    heroVariant: build.rigs.heroVariant,
    rigs: build.rigs,
    states: {
      stealth: {
        image: "/assets/automotive/state-01-stealth.jpg",
        ...build.synthesized.stateDescriptions.stealth,
      },
      track: {
        image: "/assets/automotive/state-02-track.jpg",
        ...build.synthesized.stateDescriptions.track,
      },
      launch: {
        image: "/assets/automotive/state-03-launch.jpg",
        ...build.synthesized.stateDescriptions.launch,
      },
      rearWingImage: "/assets/automotive/state-rear-aero-wing.jpg",
      brakeThermalImage: "/assets/automotive/state-brake-thermal.jpg",
    },
    orbitFrames: orbitAssets.map((a) => ({
      angle: a.angleDeg ?? 0,
      image: `/assets/automotive/${a.fileName}`,
      title:
        build.synthesized.orbitAnnotations[String(a.angleDeg ?? 45)]?.title ??
        a.defaultTitle,
      metric:
        build.synthesized.orbitAnnotations[String(a.angleDeg ?? 45)]?.metric ??
        a.defaultMetric,
      note:
        build.synthesized.orbitAnnotations[String(a.angleDeg ?? 45)]?.note ??
        a.defaultDetail,
    })),
    cockpit: {
      povImage: "/assets/automotive/cockpit-driver-pov.jpg",
      hudImage: "/assets/automotive/cockpit-windshield-hud.jpg",
      hotspots: [
        {
          id: "cockpit-windshield-hud",
          x: 50,
          y: 28,
          image: "/assets/automotive/cockpit-windshield-hud.jpg",
          ...(build.synthesized.cockpitNotes["cockpit-windshield-hud"] ?? {
            title: "Collimated HUD",
            spec: "1.8 G Vector",
            note: "Windshield telemetry projection.",
          }),
        },
        {
          id: "cockpit-center-console",
          x: 74,
          y: 78,
          image: "/assets/automotive/cockpit-center-console.jpg",
          ...(build.synthesized.cockpitNotes["cockpit-center-console"] ?? {
            title: "Rotary Console",
            spec: "CNC Aluminum",
            note: "Drive mode selector bridge.",
          }),
        },
        {
          id: "cockpit-alcantara-seat",
          x: 88,
          y: 56,
          image: "/assets/automotive/cockpit-alcantara-seat.jpg",
          ...(build.synthesized.cockpitNotes["cockpit-alcantara-seat"] ?? {
            title: "Carbon Bucket Seat",
            spec: "5.4 kg Shell",
            note: "Perforated charcoal Alcantara.",
          }),
        },
        {
          id: "cockpit-door-acoustics",
          x: 14,
          y: 66,
          image: "/assets/automotive/cockpit-door-acoustics.jpg",
          ...(build.synthesized.cockpitNotes["cockpit-door-acoustics"] ?? {
            title: "Titanium Acoustics",
            spec: "1,400 W Array",
            note: "Machined door transducer grille.",
          }),
        },
        {
          id: "cockpit-billet-pedals",
          x: 46,
          y: 90,
          image: "/assets/automotive/cockpit-billet-pedals.jpg",
          ...(build.synthesized.cockpitNotes["cockpit-billet-pedals"] ?? {
            title: "Billet Pedal Box",
            spec: "Load-Cell Brake",
            note: "CNC-milled floor-mounted pedals.",
          }),
        },
      ],
    },
    macros: macroAssets.map((m) => ({
      id: m.id,
      image: `/assets/automotive/${m.fileName}`,
      title: build.synthesized.macroNotes[m.id]?.title ?? m.defaultTitle,
      metric: build.synthesized.macroNotes[m.id]?.metric ?? m.defaultMetric,
      note: build.synthesized.macroNotes[m.id]?.note ?? m.defaultDetail,
    })),
    conversionHeading: build.synthesized.conversionHeading,
    conversionSubheading: build.synthesized.conversionSubheading,
  };

  return `"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Gauge, ShieldCheck, Sliders, Compass, Eye, Check, ArrowRight } from "lucide-react";

const BUILD_DATA = ${JSON.stringify(payload, null, 2)} as const;

type CalibrationMode = "stealth" | "track" | "launch";

export default function ${
    build.inputs.brandName.replace(/[^a-zA-Z0-9]/g, "") || "Automotive"
  }ShowroomPage() {
  const prefersReducedMotion = useReducedMotion();
  const [calibration, setCalibration] = useState<CalibrationMode>("track");
  const [splitRatio, setSplitRatio] = useState<number>(52);
  const [orbitIndex, setOrbitIndex] = useState<number>(0);
  const [hudEnabled, setHudEnabled] = useState<boolean>(true);
  const [activeHotspotIndex, setActiveHotspotIndex] = useState<number>(0);
  const [selectedTrim, setSelectedTrim] = useState<"standard" | "track-pack" | "exposed-carbon">("track-pack");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const currentOrbit = BUILD_DATA.orbitFrames[orbitIndex] ?? BUILD_DATA.orbitFrames[0];
  const currentHotspot = BUILD_DATA.cockpit.hotspots[activeHotspotIndex] ?? BUILD_DATA.cockpit.hotspots[0];
  const currentState = BUILD_DATA.states[calibration];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1152px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {BUILD_DATA.brandName}
            </span>
            <span className="text-sm font-semibold tracking-tight">
              {BUILD_DATA.modelName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-xs text-muted-foreground tabular-nums">
              {BUILD_DATA.allocationCount}
            </span>
            <a
              href="#allocation"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {BUILD_DATA.primaryCtaLabel}
            </a>
          </div>
        </div>
      </header>

      <section className="relative border-b border-border pt-12 pb-20">
        <div className="mx-auto max-w-[1152px] px-5">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7 space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {BUILD_DATA.brandName} ENGINEERING SPECIFICATION
              </p>
              <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.04em] leading-none text-balance">
                {BUILD_DATA.heroHeadline}
              </h1>
              <p className="max-w-[54ch] text-base text-muted-foreground leading-relaxed">
                {BUILD_DATA.tagline}
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
              <a
                href="#allocation"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {BUILD_DATA.primaryCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#state-rig"
                className="inline-flex h-11 items-center rounded-md border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                {BUILD_DATA.secondaryCtaLabel}
              </a>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
            <div className="relative aspect-[16/9] w-full bg-muted">
              <img
                src={BUILD_DATA.heroImage}
                alt={BUILD_DATA.heroHeadline}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
              <div className="bg-card p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Peak Output</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{BUILD_DATA.powerOutput}</p>
              </div>
              <div className="bg-card p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">0-100 km/h</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{BUILD_DATA.acceleration}</p>
              </div>
              <div className="bg-card p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">V-Max</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{BUILD_DATA.topSpeed}</p>
              </div>
              <div className="bg-card p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{BUILD_DATA.downforceOrRangeLabel}</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{BUILD_DATA.downforceOrRange}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {BUILD_DATA.rigs.enableStateMorph && (
        <section id="state-rig" className="border-b border-border py-20">
          <div className="mx-auto max-w-[1152px] px-5 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  ACTIVE CHASSIS CALIBRATION
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">
                  Tri-State Aerodynamic & Thermal Morph
                </h2>
              </div>
              <div className="inline-flex rounded-md border border-border bg-card p-1">
                {(["stealth", "track", "launch"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setCalibration(mode)}
                    className={
                      calibration === mode
                        ? "rounded px-4 py-1.5 font-mono text-xs uppercase bg-primary text-primary-foreground"
                        : "rounded px-4 py-1.5 font-mono text-xs uppercase text-muted-foreground hover:text-foreground"
                    }
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {BUILD_DATA.rigs.stateMorphMode === "split-curtain-compare" ? (
              <div className="space-y-4">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-card">
                  <img
                    src={BUILD_DATA.states.track.image}
                    alt="Track state"
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-y-0 left-0 overflow-hidden border-r border-primary"
                    style={{ width: \`\${splitRatio}%\` }}
                  >
                    <img
                      src={BUILD_DATA.states.stealth.image}
                      alt="Stealth state"
                      className="h-full max-w-none object-cover"
                      style={{ width: "100vw", maxWidth: "1112px" }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs uppercase text-muted-foreground">Stealth</span>
                  <input
                    type="range"
                    min={5}
                    max={95}
                    value={splitRatio}
                    onChange={(e) => setSplitRatio(Number(e.target.value))}
                    aria-label="Compare Stealth and Track state"
                    className="w-full accent-primary"
                  />
                  <span className="font-mono text-xs uppercase text-muted-foreground">Track</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="lg:col-span-8 overflow-hidden rounded-lg border border-border bg-card">
                  <div className="aspect-[16/9] w-full bg-muted">
                    <motion.img
                      key={currentState.image}
                      src={currentState.image}
                      alt={currentState.title}
                      initial={prefersReducedMotion ? false : { opacity: 0.4 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-2 border-t border-border">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold">{currentState.title}</h3>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {currentState.rideHeight} | {currentState.aeroBalance}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{currentState.detail}</p>
                  </div>
                </div>
                <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                  <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <img
                      src={BUILD_DATA.states.rearWingImage}
                      alt="Active Carbon Wing"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="font-mono text-[11px] uppercase text-muted-foreground">Rear Aero Deck</p>
                      <p className="mt-1 text-sm font-semibold">Swan-Neck Carbon Wing & Diffuser</p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <img
                      src={BUILD_DATA.states.brakeThermalImage}
                      alt="Carbon Ceramic Brake Rotor"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="font-mono text-[11px] uppercase text-muted-foreground">Thermal Dissipation</p>
                      <p className="mt-1 text-sm font-semibold">980 C Carbon-Ceramic Rotor Load</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {BUILD_DATA.rigs.enableOrbit360 && (
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-[1152px] px-5 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  MULTI-ANGLE STUDIO TURNTABLE
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">
                  360-Degree Exterior Inspection
                </h2>
              </div>
              <span className="font-mono text-xs uppercase text-muted-foreground tabular-nums">
                Viewing Angle: {currentOrbit.angle} deg
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="aspect-[16/9] w-full bg-muted">
                <img
                  src={currentOrbit.image}
                  alt={currentOrbit.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="border-t border-border p-6 space-y-5">
                <div className="flex flex-wrap gap-2">
                  {BUILD_DATA.orbitFrames.map((frame, idx) => (
                    <button
                      key={frame.angle}
                      type="button"
                      onClick={() => setOrbitIndex(idx)}
                      className={
                        orbitIndex === idx
                          ? "rounded-md bg-primary px-3 py-1.5 font-mono text-xs text-primary-foreground tabular-nums"
                          : "rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground tabular-nums"
                      }
                    >
                      {frame.angle} deg
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{currentOrbit.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentOrbit.note}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    {currentOrbit.metric}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {BUILD_DATA.rigs.enableCockpit && (
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-[1152px] px-5 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  DRIVER INTERFACE & TELEMETRY
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">
                  Cockpit POV & Spatial Nodes
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setHudEnabled((prev) => !prev)}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-4 font-mono text-xs uppercase hover:bg-accent"
              >
                <Eye className="h-3.5 w-3.5" />
                {hudEnabled ? "HUD Projection: Active" : "HUD Projection: Off"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="relative lg:col-span-8 overflow-hidden rounded-lg border border-border bg-card aspect-[16/9]">
                <img
                  src={hudEnabled ? BUILD_DATA.cockpit.hudImage : BUILD_DATA.cockpit.povImage}
                  alt="Driver Cockpit POV"
                  className="h-full w-full object-cover"
                />
                {BUILD_DATA.cockpit.hotspots.map((spot, idx) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveHotspotIndex(idx)}
                    style={{ left: \`\${spot.x}%\`, top: \`\${spot.y}%\` }}
                    aria-label={spot.title}
                    className={
                      activeHotspotIndex === idx
                        ? "absolute -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-primary text-primary-foreground font-mono text-xs font-semibold ring-4 ring-background flex items-center justify-center"
                        : "absolute -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full border border-border bg-background/90 text-foreground font-mono text-xs hover:bg-accent flex items-center justify-center"
                    }
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div className="lg:col-span-4 overflow-hidden rounded-lg border border-border bg-card flex flex-col justify-between">
                <div>
                  <img
                    src={currentHotspot.image}
                    alt={currentHotspot.title}
                    className="aspect-[16/10] w-full object-cover border-b border-border"
                  />
                  <div className="p-5 space-y-2">
                    <p className="font-mono text-xs uppercase text-muted-foreground">
                      {currentHotspot.spec}
                    </p>
                    <h3 className="text-lg font-semibold">{currentHotspot.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentHotspot.note}</p>
                  </div>
                </div>
                <div className="border-t border-border p-4 flex flex-wrap gap-1.5">
                  {BUILD_DATA.cockpit.hotspots.map((spot, idx) => (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setActiveHotspotIndex(idx)}
                      className={
                        activeHotspotIndex === idx
                          ? "rounded bg-primary px-2.5 py-1 font-mono text-[11px] text-primary-foreground"
                          : "rounded border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
                      }
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {BUILD_DATA.rigs.enableMacroMatrix && BUILD_DATA.macros.length > 0 && (
        <section className="border-b border-border py-20">
          <div className="mx-auto max-w-[1152px] px-5 space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                COMPOSITE & HARDWARE ARCHITECTURE
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">
                Macro Engineering Tolerances
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {BUILD_DATA.macros.map((macro) => (
                <div
                  key={macro.id}
                  className="group overflow-hidden rounded-lg border border-border bg-card"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                    <img
                      src={macro.image}
                      alt={macro.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold">{macro.title}</h3>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {macro.metric}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{macro.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="allocation" className="py-20">
        <div className="mx-auto max-w-[1152px] px-5">
          <div className="rounded-lg border border-border bg-card p-6 sm:p-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                DIRECT CHASSIS ALLOCATION
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.035em]">
                {BUILD_DATA.conversionHeading}
              </h2>
              <p className="text-sm text-muted-foreground max-w-[54ch]">
                {BUILD_DATA.conversionSubheading}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
                {(
                  [
                    { id: "standard", label: "Standard Spec", delta: "Included" },
                    { id: "track-pack", label: "Aero Track Pack", delta: "+$145,000" },
                    { id: "exposed-carbon", label: "Full Forged Carbon", delta: "+$280,000" },
                  ] as const
                ).map((trim) => (
                  <button
                    key={trim.id}
                    type="button"
                    onClick={() => setSelectedTrim(trim.id)}
                    className={
                      selectedTrim === trim.id
                        ? "rounded-md border border-primary bg-accent p-4 text-left"
                        : "rounded-md border border-border bg-background p-4 text-left hover:bg-accent/50"
                    }
                  >
                    <p className="text-sm font-semibold">{trim.label}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground tabular-nums">
                      {trim.delta}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between rounded-md border border-border bg-background p-6 space-y-4">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  Base Allocation Price
                </span>
                <p className="text-3xl font-semibold tabular-nums">{BUILD_DATA.basePriceUsd}</p>
              </div>
              {submitted ? (
                <div className="rounded-md border border-border bg-muted p-4 text-sm">
                  Allocation dossier registered for {BUILD_DATA.brandName} {BUILD_DATA.modelName} ({selectedTrim}).
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label htmlFor="client-name" className="block font-mono text-[11px] uppercase text-muted-foreground mb-1">
                      Full Name
                    </label>
                    <input
                      id="client-name"
                      type="text"
                      required
                      placeholder="Viktor Lindqvist"
                      className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="client-email" className="block font-mono text-[11px] uppercase text-muted-foreground mb-1">
                      Direct Email
                    </label>
                    <input
                      id="client-email"
                      type="email"
                      required
                      placeholder="v.lindqvist@atelier.ch"
                      className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-11 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {BUILD_DATA.primaryCtaLabel}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
`;
}
