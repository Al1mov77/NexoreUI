import { buildValidatedMetric } from "../../copy-bank";
import { EXTRACTED_PALETTES } from "../../design-tokens";
import { VaultAsset } from "../../schema";

export const ORBIT_VAULT_ASSETS: readonly VaultAsset[] = [
  {
    id: "orbit-frame-045",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-orbit-frame-045",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "light",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["hypercar-launch", "bespoke-dealership"],
    tones: ["luxury", "technical"],
    url: "/generator/auto/sequences/orbit-hangar-01/frame-045.jpg",
    aspectRatio: "16:9",
    shotScale: "three-quarter",
    negativeSpace: "center-top",
    safeTextArea: { region: "top", maxCoverageRatio: 0.34, luminance: "dark" },
    heroViability: 91,
    contrastScore: 93,
    tags: ["aerodynamics", "laser-optics", "forged-carbon"],
    palette: EXTRACTED_PALETTES["limestone-bronze-patina"],
    partCode: "EXT-07",
    titleTemplate: "Front quarter studio view",
    specMetric: buildValidatedMetric("sm-07", "power", 1420, "Combined motor output"),
    descriptionByVoice: {
      "technical-homologation":
        "Front quarter view of the {power} hp {modelName} with side cooling intakes in {location}.",
      "bespoke-collector":
        "Showroom lighting on the {modelName} highlighting its {massDelta} kg lighter carbon body.",
      "editorial-manifesto":
        "Sculpted front wheel arches on the {power} hp {modelName} built in {location}.",
      "motorsport-raw":
        "Wide front track on the {modelName} supporting {accel} s 0 to 100 km/h launches.",
    },
  },
  {
    id: "orbit-frame-000",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-orbit-frame-000",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "light",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["hypercar-launch", "motorsport-tuning"],
    tones: ["technical", "track"],
    url: "/generator/auto/sequences/orbit-hangar-01/frame-000.jpg",
    aspectRatio: "16:9",
    shotScale: "extreme-wide",
    negativeSpace: "center-top",
    safeTextArea: { region: "top", maxCoverageRatio: 0.34, luminance: "dark" },
    heroViability: 90,
    contrastScore: 94,
    tags: ["aerodynamics", "laser-optics"],
    palette: EXTRACTED_PALETTES["british-racing-green"],
    partCode: "EXT-08",
    titleTemplate: "Direct front elevation",
    specMetric: buildValidatedMetric("sm-08", "top-speed", 392, "Track speed rating"),
    descriptionByVoice: {
      "technical-homologation":
        "Low roof height on the {power} hp {modelName} engineered for {accel} s acceleration.",
      "bespoke-collector":
        "Front signature lighting on the {modelName} available at our {location} showroom.",
      "editorial-manifesto":
        "Low cabin positioned between the front fenders of the {power} hp {modelName}.",
      "motorsport-raw":
        "Front air channels on the {modelName} saving {massDelta} kg and delivering {power} hp.",
    },
  },
  {
    id: "orbit-frame-135",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-orbit-frame-135",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["motorsport-tuning", "bespoke-dealership"],
    tones: ["track", "luxury"],
    url: "/generator/auto/sequences/orbit-hangar-01/frame-135.jpg",
    aspectRatio: "16:9",
    shotScale: "rear-stance",
    negativeSpace: "left-heavy",
    safeTextArea: { region: "left", maxCoverageRatio: 0.38, luminance: "dark" },
    heroViability: 89,
    contrastScore: 94,
    tags: ["aerodynamics", "forged-carbon"],
    palette: EXTRACTED_PALETTES["crimson-diffuser-oled"],
    partCode: "EXT-09",
    titleTemplate: "Rear quarter and diffuser",
    specMetric: buildValidatedMetric("sm-09", "downforce", 820, "Rear axle load"),
    descriptionByVoice: {
      "technical-homologation":
        "Rear three-quarter view of the {power} hp {modelName} with carbon rear extractor.",
      "bespoke-collector":
        "Forged wheels and rear fender lines on the {modelName} in {location}.",
      "editorial-manifesto":
        "Wide rear fenders housing the {power} hp drive unit on the {modelName}.",
      "motorsport-raw":
        "Rear diffuser on the {modelName} supporting {accel} s launches and {power} hp.",
    },
  },
  {
    id: "orbit-frame-090",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-orbit-frame-090",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["carbon-atelier", "hypercar-launch"],
    tones: ["heritage", "technical"],
    url: "/generator/auto/sequences/orbit-hangar-01/frame-090.jpg",
    aspectRatio: "16:9",
    shotScale: "profile",
    negativeSpace: "center-top",
    safeTextArea: { region: "top", maxCoverageRatio: 0.34, luminance: "dark" },
    heroViability: 87,
    contrastScore: 92,
    tags: ["aerodynamics", "forged-carbon", "ceramic-brakes"],
    palette: EXTRACTED_PALETTES["monolith-raw-concrete"],
    partCode: "ORB-03",
    titleTemplate: "Side wheelbase profile",
    specMetric: buildValidatedMetric("sm-11", "mass-delta", -145, "Carbon dry weight"),
    descriptionByVoice: {
      "technical-homologation":
        "Side profile of the {modelName} showing its {massDelta} kg carbon body and {power} hp.",
      "bespoke-collector":
        "Balanced proportions of the {power} hp {modelName} available in {location}.",
      "editorial-manifesto":
        "Continuous roofline from front splitter to rear wing on the {accel} s {modelName}.",
      "motorsport-raw":
        "Low center of gravity on the {power} hp {modelName} built for {location} roads.",
    },
  },
  {
    id: "orbit-frame-180",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-orbit-frame-180",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["motorsport-tuning", "hypercar-launch"],
    tones: ["track", "luxury"],
    url: "/generator/auto/sequences/orbit-hangar-01/frame-180.jpg",
    aspectRatio: "16:9",
    shotScale: "rear-stance",
    negativeSpace: "center-top",
    safeTextArea: { region: "top", maxCoverageRatio: 0.34, luminance: "dark" },
    heroViability: 86,
    contrastScore: 95,
    tags: ["aerodynamics", "forged-carbon"],
    palette: EXTRACTED_PALETTES["crimson-diffuser-oled"],
    partCode: "EXT-12",
    titleTemplate: "Rear diffuser and tail lights",
    specMetric: buildValidatedMetric("sm-12", "downforce", 860, "Balanced aero load"),
    descriptionByVoice: {
      "technical-homologation":
        "Rear view of the {modelName} with dual diffuser channels and {power} hp output.",
      "bespoke-collector":
        "Wide rear stance on the {modelName} with LED tail lights in {location}.",
      "editorial-manifesto":
        "Woven carbon rear bodywork saving {massDelta} kg on the {power} hp {modelName}.",
      "motorsport-raw":
        "Rear cooling outlets for the {power} hp drivetrain on the {accel} s {modelName}.",
    },
  },
  {
    id: "orbit-frame-225",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-orbit-frame-225",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["motorsport-tuning", "hypercar-launch"],
    tones: ["track", "technical"],
    url: "/generator/auto/sequences/orbit-hangar-01/frame-225.jpg",
    aspectRatio: "16:9",
    shotScale: "rear-stance",
    negativeSpace: "right-heavy",
    safeTextArea: { region: "right", maxCoverageRatio: 0.36, luminance: "dark" },
    heroViability: 85,
    contrastScore: 92,
    tags: ["aerodynamics", "forged-carbon"],
    palette: EXTRACTED_PALETTES["monolith-raw-concrete"],
    partCode: "ORB-06",
    titleTemplate: "Rear wing and quarter panel",
    specMetric: buildValidatedMetric("sm-25", "downforce", 840, "Active rear wing balance"),
    descriptionByVoice: {
      "technical-homologation":
        "Rear quarter panel and carbon wing pylons on the {power} hp {modelName} in {location}.",
      "bespoke-collector":
        "Smooth metallic rear bodywork on the {modelName} saving {massDelta} kg of weight.",
      "editorial-manifesto":
        "Top-mounted carbon wing on the {power} hp {modelName} built for {accel} s sprints.",
      "motorsport-raw":
        "Rear wing mounts keeping airflow clean on the {power} hp {modelName}.",
    },
  },
  {
    id: "orbit-frame-270",
    niche: "auto",
    mediaType: "image",
    visualGroupId: "vg-auto-orbit-frame-270",
    contains_logo: false,
    focalPoint: { x: 0.5, y: 0.52 },
    toneLuminance: "dark",
    subjectBox: { x: 0.12, y: 0.18, width: 0.76, height: 0.68 },
    subcategories: ["bespoke-dealership", "carbon-atelier"],
    tones: ["luxury", "heritage"],
    url: "/generator/auto/sequences/orbit-hangar-01/frame-270.jpg",
    aspectRatio: "16:9",
    shotScale: "profile",
    negativeSpace: "center-top",
    safeTextArea: { region: "top", maxCoverageRatio: 0.34, luminance: "dark" },
    heroViability: 84,
    contrastScore: 91,
    tags: ["aerodynamics", "forged-carbon", "titanium-hardware"],
    palette: EXTRACTED_PALETTES["monolith-raw-concrete"],
    partCode: "ORB-07",
    titleTemplate: "Starboard side profile",
    specMetric: buildValidatedMetric("sm-26", "top-speed", 388, "Clean side airflow"),
    descriptionByVoice: {
      "technical-homologation":
        "Side profile of the {power} hp {modelName} with deep door air channels in {location}.",
      "bespoke-collector":
        "Forged wheels and grand touring proportions on the {modelName} in {location}.",
      "editorial-manifesto":
        "Compact overhangs and {massDelta} kg weight reduction on the {accel} s {modelName}.",
      "motorsport-raw":
        "Forward rake angle on the {power} hp {modelName} for high-speed stability.",
    },
  }
];
