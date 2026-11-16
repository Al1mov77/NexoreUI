import {
  AutoSubcategoryId,
  GeneratorUserConfig,
  ToneId,
} from "../../../lib/generator/schema";

export type FlowPhase = "intake" | "assembling" | "ready";
export type IntakeStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ExportTab = "react" | "zip";

export interface HistoryBuildEntry {
  id: string;
  config: GeneratorUserConfig;
  label: string;
  archetypeLabel: string;
  timestamp: string;
}

export const STORAGE_KEY = "nexore-generator-brief-v2";
export const THEME_STORAGE_KEY = "nexore-generator-theme";

export const SUBCATEGORY_ORDER: readonly AutoSubcategoryId[] = [
  "hypercar-launch",
  "motorsport-tuning",
  "bespoke-dealership",
  "carbon-atelier",
];

export const TONE_ORDER: readonly ToneId[] = [
  "technical",
  "track",
  "luxury",
  "heritage",
];
