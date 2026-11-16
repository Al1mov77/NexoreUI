import {
  ArchetypeDesignTokens,
  GeneratorUserConfig,
  ScoredAsset,
  SynthesizedLandingPayload,
  SynthesizedSectionSpec,
  VaultAsset,
} from "../../../lib/generator/schema";

export interface SurfacePalette {
  bg: string;
  surface: string;
  fg: string;
  muted: string;
  border: string;
  accent: string;
  accentFg: string;
}

export interface TrimLiveState {
  finishLabel: string;
  wheelLabel: string;
  aeroLabel: string;
  buildCode: string;
  priceDelta: number;
  massDeltaKg: number;
  downforceDeltaKg: number;
  accelDeltaSec: number;
  rangeDeltaKm: number;
}

export interface SectionComponentProps {
  section: SynthesizedSectionSpec;
  sectionIndex: number;
  payload: SynthesizedLandingPayload;
  pal: SurfacePalette;
  reducedMotion: boolean;
  isBakery: boolean;
  cleanCity: string;
  trimState?: TrimLiveState | null;
  onTrimChange?: (next: TrimLiveState) => void;
}

export function getTransitionSpec(
  tokens: ArchetypeDesignTokens,
  reducedMotion: boolean
) {
  if (reducedMotion) {
    return { duration: 0 };
  }
  return {
    duration: tokens.motion.duration,
    ease: [
      tokens.motion.ease[0],
      tokens.motion.ease[1],
      tokens.motion.ease[2],
      tokens.motion.ease[3],
    ] as [number, number, number, number],
  };
}

export function getAssetImageUrl(scored: ScoredAsset): string {
  if (scored.asset.mediaType === "video") {
    return scored.asset.video?.posterUrl || scored.asset.url;
  }
  return scored.asset.url;
}

export function getAssetObjectPosition(asset?: VaultAsset | null): string {
  if (!asset) return "50% 50%";
  if (asset.focalPoint) {
    const x = Math.max(5, Math.min(95, Math.round(asset.focalPoint.x * 100)));
    const y = Math.max(5, Math.min(95, Math.round(asset.focalPoint.y * 100)));
    return `${x}% ${y}%`;
  }
  if (asset.subjectBox) {
    const cx = Math.round((asset.subjectBox.x + asset.subjectBox.width / 2) * 100);
    const cy = Math.round((asset.subjectBox.y + asset.subjectBox.height / 2) * 100);
    return `${Math.max(10, Math.min(90, cx))}% ${Math.max(10, Math.min(90, cy))}%`;
  }
  return "50% 50%";
}

export function getSafeOverlayStyle(
  asset: VaultAsset,
  themeMode: "dark" | "light"
): {
  flexAlignClass: string;
  scrimGradient: string;
} {
  const region = asset.safeTextArea.region;
  const isRight = region === "right" || region === "bottom-right";
  const isLight = themeMode === "light";

  const scrimGradient = isRight
    ? isLight
      ? "linear-gradient(270deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.28) 38%, transparent 65%)"
      : "linear-gradient(270deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, transparent 75%)"
    : isLight
      ? "linear-gradient(90deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.28) 38%, transparent 65%)"
      : "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, transparent 75%)";

  const flexAlignClass = isRight ? "flex justify-end" : "flex justify-start";
  return { flexAlignClass, scrimGradient };
}

export interface TrimOptionItem {
  id: string;
  label: string;
  code: string;
  priceDelta: number;
  massDelta: number;
  downforceDelta: number;
  accelDelta: number;
  rangeDelta: number;
}

export function getSubcategoryTrimCatalog(config: GeneratorUserConfig): {
  finishes: readonly TrimOptionItem[];
  wheels: readonly TrimOptionItem[];
  aero: readonly TrimOptionItem[];
} {
  const finishes: readonly TrimOptionItem[] =
    config.subcategory === "bespoke-dealership"
      ? [
          { id: "raw-carbon", label: "Hand-Laid Gloss Carbon", code: "CF-01", priceDelta: 0, massDelta: 0, downforceDelta: 0, accelDelta: 0, rangeDelta: 0 },
          { id: "glacier-coat", label: "Mineral Silver Coat", code: "MS-02", priceDelta: 6800, massDelta: 2, downforceDelta: 0, accelDelta: 0, rangeDelta: 0 },
          { id: "obsidian-lacquer", label: "Deep Obsidian Tint", code: "OT-04", priceDelta: 9200, massDelta: -3, downforceDelta: 0, accelDelta: -0.01, rangeDelta: 4 },
        ]
      : [
          { id: "raw-carbon", label: "Satin Raw Carbon", code: "CF-00", priceDelta: 0, massDelta: 0, downforceDelta: 0, accelDelta: 0, rangeDelta: 0 },
          { id: "glacier-coat", label: "Mineral Silver Coat", code: "MS-02", priceDelta: 5400, massDelta: 2, downforceDelta: 0, accelDelta: 0, rangeDelta: 0 },
          { id: "dark-weave", label: "Deep Slate Weave", code: "SW-04", priceDelta: 7800, massDelta: -4, downforceDelta: 0, accelDelta: -0.01, rangeDelta: 6 },
        ];

  const hasTitanium = config.focusTags.includes("titanium-hardware");
  const wheels: readonly TrimOptionItem[] = [
    { id: "forged-10", label: "Forged Ten-Spoke", code: "W10", priceDelta: 0, massDelta: 0, downforceDelta: 0, accelDelta: 0, rangeDelta: 0 },
    {
      id: "mag-lock",
      label: hasTitanium ? "Titanium Center-Lock" : "Magnesium Center-Lock",
      code: hasTitanium ? "WTI" : "WMG",
      priceDelta: 12000,
      massDelta: -14,
      downforceDelta: 15,
      accelDelta: -0.04,
      rangeDelta: 14,
    },
    { id: "carbon-barrel", label: "Carbon Barrel Track", code: "WCB", priceDelta: 18500, massDelta: -18, downforceDelta: 28, accelDelta: -0.07, rangeDelta: 18 },
  ];

  const hasCeramic = config.focusTags.includes("ceramic-brakes");
  const aero: readonly TrimOptionItem[] =
    config.subcategory === "motorsport-tuning"
      ? [
          { id: "clubsport-splitter", label: "Clubsport Carbon Splitter", code: "ACS", priceDelta: 0, massDelta: 0, downforceDelta: 0, accelDelta: 0, rangeDelta: 0 },
          {
            id: "track-wing",
            label: hasCeramic ? "Endurance Wing & CCB Ducts" : "High-Downforce Wing Pack",
            code: "AHD",
            priceDelta: 11200,
            massDelta: -7,
            downforceDelta: 140,
            accelDelta: -0.05,
            rangeDelta: -18,
          },
        ]
      : [
          { id: "road-diffuser", label: "Road Touring Diffuser", code: "ARD", priceDelta: 0, massDelta: 0, downforceDelta: 0, accelDelta: 0, rangeDelta: 0 },
          { id: "track-wing", label: "High-Downforce Wing Pack", code: "AHD", priceDelta: 9400, massDelta: -6, downforceDelta: 120, accelDelta: -0.04, rangeDelta: -14 },
        ];

  return { finishes, wheels, aero };
}
