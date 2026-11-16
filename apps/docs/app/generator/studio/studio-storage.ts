import { createDefaultConfig } from "../../../lib/generator/engine";
import {
  AutoSubcategoryId,
  GeneratorUserConfig,
  PrimaryCtaGoal,
  ToneId,
} from "../../../lib/generator/schema";
import { FlowPhase } from "./studio-types";

export const STORAGE_KEY = "nexore-generator-brief-v2";
export const THEME_STORAGE_KEY = "nexore-generator-theme";

export function syncDomThemeMode(mode: "dark" | "light") {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.classList.toggle("light", mode === "light");
    root.setAttribute("data-tool-theme", mode);
    root.style.colorScheme = mode;
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
      window.localStorage.setItem("theme", mode);
      const params = new URLSearchParams(window.location.search);
      if (params.has("theme") && params.get("theme") !== mode) {
        params.set("theme", mode);
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${params.toString()}`
        );
      }
    } catch {
      void 0;
    }
  }
}

export function resolveInitialThemeMode(search: string): "dark" | "light" {
  const params = new URLSearchParams(search);
  const urlTheme = params.get("theme");
  if (urlTheme === "dark" || urlTheme === "light") {
    return urlTheme;
  }
  try {
    const saved =
      window.localStorage.getItem(THEME_STORAGE_KEY) ||
      window.localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "dark";
  }
}

export function readInitialStudioState(
  search: string,
  initialMode: "dark" | "light",
  validSubcategories: readonly AutoSubcategoryId[],
  validTones: readonly ToneId[]
): {
  configPatch: Partial<GeneratorUserConfig> | null;
  replaceFullConfig: GeneratorUserConfig | null;
  phase: FlowPhase | null;
} {
  const params = new URLSearchParams(search);
  const urlSub = params.get("sub") as AutoSubcategoryId | null;
  const urlBrand = params.get("brand");
  const urlModel = params.get("model");
  const urlCta = params.get("cta") as PrimaryCtaGoal | null;
  const urlTone = params.get("tone") as ToneId | null;
  const urlCity = params.get("city");
  const urlSeed = params.get("seed");
  const urlPhase = params.get("phase");

  if (urlSub && validSubcategories.includes(urlSub)) {
    const base = createDefaultConfig(urlSub, Number(urlSeed) || 1);
    return {
      replaceFullConfig: {
        ...base,
        themeMode: initialMode,
        brandName: urlBrand || base.brandName,
        modelName: urlModel || base.modelName,
        primaryCta: urlCta || "Book a test drive",
        tone: urlTone && validTones.includes(urlTone) ? urlTone : base.tone,
        location: urlCity || base.location,
        variationSeed: Math.min(10, Math.max(1, Number(urlSeed) || 1)),
      },
      configPatch: null,
      phase: urlPhase === "ready" ? "ready" : null,
    };
  }

  if (urlSeed) {
    const s = Math.min(10, Math.max(1, Number(urlSeed) || 1));
    const base = createDefaultConfig("hypercar-launch", s);
    return {
      replaceFullConfig: {
        ...base,
        themeMode: initialMode,
        brandName: urlBrand || base.brandName,
        modelName: urlModel || base.modelName,
        primaryCta: urlCta || "Book a test drive",
        tone: urlTone && validTones.includes(urlTone) ? urlTone : base.tone,
        location: urlCity || base.location,
        variationSeed: s,
      },
      configPatch: null,
      phase: urlPhase === "ready" ? "ready" : null,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GeneratorUserConfig>;
      if (parsed.subcategory && validSubcategories.includes(parsed.subcategory)) {
        return {
          replaceFullConfig: null,
          configPatch: parsed,
          phase: null,
        };
      }
    }
  } catch {
    void 0;
  }

  return { replaceFullConfig: null, configPatch: null, phase: null };
}

export function persistStudioBrief(config: GeneratorUserConfig) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        subcategory: config.subcategory,
        brandName: config.brandName,
        modelName: config.modelName,
        primaryCta: config.primaryCta,
        tone: config.tone,
        location: config.location,
        focusTags: config.focusTags,
      })
    );
  } catch {
    void 0;
  }
}

export function writeShareUrlQuery(cfg: GeneratorUserConfig) {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams();
    params.set("sub", cfg.subcategory);
    params.set("brand", cfg.brandName);
    params.set("model", cfg.modelName);
    params.set("cta", cfg.primaryCta || "Book a test drive");
    params.set("tone", cfg.tone);
    params.set("city", cfg.location);
    params.set("seed", String(cfg.variationSeed));
    params.set("theme", cfg.themeMode);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  } catch {
    void 0;
  }
}
