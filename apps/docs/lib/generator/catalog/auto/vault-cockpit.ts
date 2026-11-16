import { buildValidatedMetric } from "../../copy-bank";
import { EXTRACTED_PALETTES } from "../../design-tokens";
import { VaultAsset } from "../../schema";

export const COCKPIT_VAULT_ASSETS: readonly VaultAsset[] = [
  {
    id: "cockpit-pov-main-01",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-cockpit-pov-main-01",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["bespoke-dealership", "hypercar-launch", "motorsport-tuning"],
    tones: ["luxury", "technical", "track"],
    url: "/generator/auto/cockpit/cockpit-pov-main.jpg",
    aspectRatio: "16:9",
    shotScale: "interior-pov",
    negativeSpace: "center-top",
    safeTextArea: { region: "top", maxCoverageRatio: 0.34, luminance: "dark" },
    heroViability: 88,
    contrastScore: 93,
    tags: ["alcantara-cockpit", "hud-telemetry", "forged-carbon"],
    palette: EXTRACTED_PALETTES["anodized-titanium-gold"],
    partCode: "CAB-10",
    titleTemplate: "Driver cabin and controls",
    specMetric: buildValidatedMetric("sm-10", "acceleration", 1.98, "Digital driver display"),
    descriptionByVoice: {
      "technical-homologation":
        "Carbon steering wheel and digital cluster inside the {power} hp {modelName} in {location}.",
      "bespoke-collector":
        "Hand-stitched suede dashboard inside the {modelName} at our {location} showroom.",
      "editorial-manifesto":
        "Driver-focused cabin in the {power} hp {modelName} saving {massDelta} kg of trim weight.",
      "motorsport-raw":
        "Fixed carbon seat shell and shift lights inside the {accel} s {modelName}.",
    },
  },
  {
    id: "cockpit-hud-windshield-01",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-cockpit-hud-windshield-01",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["hypercar-launch", "motorsport-tuning"],
    tones: ["technical", "track"],
    url: "/generator/auto/cockpit/cockpit-hud-windshield.jpg",
    aspectRatio: "16:9",
    shotScale: "interior-pov",
    negativeSpace: "center-top",
    safeTextArea: { region: "top", maxCoverageRatio: 0.34, luminance: "dark" },
    heroViability: 25,
    contrastScore: 94,
    tags: ["hud-telemetry", "alcantara-cockpit"],
    palette: EXTRACTED_PALETTES["cryo-laser-ice"],
    partCode: "CAB-20",
    titleTemplate: "Windshield head-up display",
    specMetric: buildValidatedMetric("sm-20", "acceleration", 1.95, "Direct speed projection"),
    descriptionByVoice: {
      "technical-homologation":
        "Windshield display in the {modelName} projecting speed during {accel} s launches.",
      "bespoke-collector":
        "Clean digital readout above the suede dash of the {power} hp {modelName}.",
      "editorial-manifesto":
        "Eye-level speed and power display inside the {modelName} in {location}.",
      "motorsport-raw":
        "Direct shift and brake display for the {power} hp {modelName} on track.",
    },
  },
  {
    id: "cockpit-center-dial-01",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-cockpit-center-dial-01",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["bespoke-dealership", "hypercar-launch", "carbon-atelier"],
    tones: ["luxury", "heritage", "technical"],
    url: "/generator/auto/cockpit/cockpit-center-dial.jpg",
    aspectRatio: "16:9",
    shotScale: "macro-detail",
    negativeSpace: "tight-fill",
    safeTextArea: { region: "none", maxCoverageRatio: 0.12, luminance: "dark" },
    heroViability: 18,
    contrastScore: 95,
    tags: ["forged-carbon", "titanium-hardware", "alcantara-cockpit"],
    palette: EXTRACTED_PALETTES["hangar-mist-steel"],
    partCode: "CAB-21",
    titleTemplate: "Machined drive-mode selector",
    specMetric: buildValidatedMetric("sm-21", "power", 1420, "Four selectable drive modes"),
    descriptionByVoice: {
      "technical-homologation":
        "Aluminum rotary dial on the carbon console controlling all {power} hp in the {modelName}.",
      "bespoke-collector":
        "Knurled metal selector surrounded by matte carbon inside the {modelName} in {location}.",
      "editorial-manifesto":
        "One tactile metal dial managing {power} hp and {accel} s launch control.",
      "motorsport-raw":
        "Instant drive-mode dial inside the {massDelta} kg lighter {modelName} cabin.",
    },
  },
  {
    id: "cockpit-alcantara-seats-01",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-cockpit-alcantara-seats-01",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["bespoke-dealership", "motorsport-tuning"],
    tones: ["luxury", "track", "heritage"],
    url: "/generator/auto/cockpit/cockpit-alcantara-seats.jpg",
    aspectRatio: "16:9",
    shotScale: "macro-detail",
    negativeSpace: "tight-fill",
    safeTextArea: { region: "none", maxCoverageRatio: 0.12, luminance: "dark" },
    heroViability: 19,
    contrastScore: 91,
    tags: ["alcantara-cockpit", "forged-carbon"],
    palette: EXTRACTED_PALETTES["monolith-raw-concrete"],
    partCode: "CAB-22",
    titleTemplate: "Carbon bucket seats",
    specMetric: buildValidatedMetric("sm-22", "mass-delta", -38, "7.4 kg per carbon seat"),
    descriptionByVoice: {
      "technical-homologation":
        "Carbon shell seats in the {modelName} contributing to {massDelta} kg total weight savings.",
      "bespoke-collector":
        "Perforated charcoal suede seats tailored for the {power} hp {modelName} in {location}.",
      "editorial-manifesto":
        "Deep bolsters in the {modelName} supporting the driver during {accel} s acceleration.",
      "motorsport-raw":
        "Lightweight carbon bucket seats bolted into the {power} hp {modelName} chassis.",
    },
  },
  {
    id: "cockpit-titanium-door-01",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-cockpit-titanium-door-01",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["bespoke-dealership", "hypercar-launch"],
    tones: ["luxury", "heritage"],
    url: "/generator/auto/cockpit/cockpit-titanium-door.jpg",
    aspectRatio: "16:9",
    shotScale: "macro-detail",
    negativeSpace: "tight-fill",
    safeTextArea: { region: "none", maxCoverageRatio: 0.12, luminance: "dark" },
    heroViability: 18,
    contrastScore: 94,
    tags: ["titanium-hardware", "alcantara-cockpit"],
    palette: EXTRACTED_PALETTES["anodized-titanium-gold"],
    partCode: "CAB-23",
    titleTemplate: "Titanium audio door panel",
    specMetric: buildValidatedMetric("sm-23", "chassis-quota", 15, "Custom showroom edition"),
    descriptionByVoice: {
      "technical-homologation":
        "Brushed titanium speaker grille and carbon door panel on the {modelName} saving {massDelta} kg.",
      "bespoke-collector":
        "Machined titanium door trim and suede upholstery in the {power} hp {modelName} in {location}.",
      "editorial-manifesto":
        "Warm cabin lighting across brushed titanium inside the {accel} s {modelName}.",
      "motorsport-raw":
        "Carbon inner door structure on the {power} hp {modelName} reducing cabin weight.",
    },
  },
  {
    id: "cockpit-billet-pedals-01",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-cockpit-billet-pedals-01",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["motorsport-tuning", "carbon-atelier"],
    tones: ["track", "technical"],
    url: "/generator/auto/cockpit/cockpit-billet-pedals.jpg",
    aspectRatio: "16:9",
    shotScale: "macro-detail",
    negativeSpace: "tight-fill",
    safeTextArea: { region: "none", maxCoverageRatio: 0.12, luminance: "dark" },
    heroViability: 17,
    contrastScore: 93,
    tags: ["titanium-hardware", "forged-carbon", "ceramic-brakes"],
    palette: EXTRACTED_PALETTES["hangar-mist-steel"],
    partCode: "CAB-24",
    titleTemplate: "Milled aluminum pedal box",
    specMetric: buildValidatedMetric("sm-24", "rigidity", 65000, "Floor-mounted brake pedal"),
    descriptionByVoice: {
      "technical-homologation":
        "Floor-hinged aluminum pedals in the {modelName} built for {power} hp and {accel} s control.",
      "bespoke-collector":
        "Machined alloy pedals mounted to the carbon footwell of the {modelName} in {location}.",
      "editorial-manifesto":
        "Exposed aluminum pedal levers saving {massDelta} kg inside the {power} hp {modelName}.",
      "motorsport-raw":
        "Firm brake pedal modulation for the {power} hp {modelName} on road and track.",
    },
  }
];
