"use client";

import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AUTO_SUBCATEGORY_PRESETS } from "../../../lib/generator/catalog-auto";
import { createDefaultConfig, synthesizeLanding } from "../../../lib/generator/engine";
import {
  buildExportBundle,
  createStoreZipBytes,
} from "../../../lib/generator/export-engine";
import {
  AutoSubcategoryId,
  EngineeringTag,
  GeneratorUserConfig,
  SynthesizedLandingPayload,
} from "../../../lib/generator/schema";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";
import {
  persistStudioBrief,
  readInitialStudioState,
  resolveInitialThemeMode,
  syncDomThemeMode,
  writeShareUrlQuery,
} from "./studio-storage";
import {
  ExportTab,
  FlowPhase,
  HistoryBuildEntry,
  IntakeStep,
  SUBCATEGORY_ORDER,
  TONE_ORDER,
} from "./studio-types";

export function useGeneratorStudio() {
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme, setTheme } = useTheme();

  const [toolTheme, setToolTheme] = useState<"dark" | "light">("dark");
  const [config, setConfig] = useState<GeneratorUserConfig>(() => ({
    ...createDefaultConfig("hypercar-launch", 1),
    themeMode: "dark",
    primaryCta: "Book a test drive",
  }));

  const [flowPhase, setFlowPhase] = useState<FlowPhase>("intake");
  const [intakeStep, setIntakeStep] = useState<IntakeStep>(0);
  const [activeStage, setActiveStage] = useState<number>(1);
  const [buildMode, setBuildMode] = useState<"initial" | "variant">("initial");
  const [lastBuildSeconds, setLastBuildSeconds] = useState<string>("4.0");

  const [showWhyPhotos, setShowWhyPhotos] = useState(false);
  const [showRefinePanel, setShowRefinePanel] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTab, setExportTab] = useState<ExportTab>("react");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAiCode, setCopiedAiCode] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [buildHistory, setBuildHistory] = useState<HistoryBuildEntry[]>([]);

  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const stageTimersRef = useRef<number[]>([]);
  const didInitRef = useRef(false);
  const pendingThemeRef = useRef<"dark" | "light" | null>(null);
  const pendingThemeTimerRef = useRef<number | null>(null);

  const applyToolTheme = useCallback(
    (mode: "dark" | "light", persist = true) => {
      setToolTheme((prev) => (prev === mode ? prev : mode));
      setConfig((prev) =>
        prev.themeMode === mode ? prev : { ...prev, themeMode: mode }
      );
      syncDomThemeMode(mode);
      if (persist) {
        pendingThemeRef.current = mode;
        if (typeof window !== "undefined") {
          if (pendingThemeTimerRef.current !== null) {
            window.clearTimeout(pendingThemeTimerRef.current);
          }
          pendingThemeTimerRef.current = window.setTimeout(() => {
            pendingThemeRef.current = null;
            pendingThemeTimerRef.current = null;
          }, 150);
        }
        setTheme(mode);
      }
    },
    [setTheme]
  );

  useEffect(() => {
    if (typeof window === "undefined" || didInitRef.current) return;
    didInitRef.current = true;
    const initialMode = resolveInitialThemeMode(window.location.search);
    applyToolTheme(initialMode, true);
    const initial = readInitialStudioState(
      window.location.search,
      initialMode,
      SUBCATEGORY_ORDER,
      TONE_ORDER
    );
    if (initial.replaceFullConfig) {
      setConfig(initial.replaceFullConfig);
    } else if (initial.configPatch) {
      const patch = initial.configPatch;
      setConfig((prev) => ({
        ...prev,
        themeMode: initialMode,
        subcategory: patch.subcategory || prev.subcategory,
        brandName: patch.brandName || prev.brandName,
        modelName: patch.modelName || prev.modelName,
        primaryCta: patch.primaryCta || prev.primaryCta || "Book a test drive",
        tone:
          patch.tone && TONE_ORDER.includes(patch.tone)
            ? patch.tone
            : prev.tone,
        location: patch.location || prev.location,
        focusTags:
          Array.isArray(patch.focusTags) && patch.focusTags.length > 0
            ? patch.focusTags
            : prev.focusTags,
      }));
    }
    if (initial.phase) {
      setFlowPhase(initial.phase);
    }
  }, [applyToolTheme]);

  useEffect(() => {
    if (resolvedTheme !== "dark" && resolvedTheme !== "light") return;
    if (
      pendingThemeRef.current !== null &&
      resolvedTheme !== pendingThemeRef.current
    ) {
      return;
    }
    pendingThemeRef.current = null;
    setToolTheme((prev) => (prev === resolvedTheme ? prev : resolvedTheme));
    setConfig((prev) =>
      prev.themeMode === resolvedTheme
        ? prev
        : { ...prev, themeMode: resolvedTheme }
    );
    syncDomThemeMode(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    persistStudioBrief(config);
  }, [
    config,
    config.subcategory,
    config.brandName,
    config.modelName,
    config.primaryCta,
    config.tone,
    config.location,
    config.focusTags,
  ]);

  const clearTimers = useCallback(() => {
    for (const id of stageTimersRef.current) {
      window.clearTimeout(id);
    }
    stageTimersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const sanitizedConfig = useMemo<GeneratorUserConfig>(() => {
    const preset = AUTO_SUBCATEGORY_PRESETS[config.subcategory];
    return {
      ...config,
      brandName: config.brandName.trim() || preset.defaultBrandName,
      modelName: config.modelName.trim() || preset.defaultModelName,
      location: config.location.trim() || preset.defaultLocation,
      primaryCta: config.primaryCta || "Book a test drive",
    };
  }, [config]);

  const payload: SynthesizedLandingPayload = useMemo(
    () => synthesizeLanding(sanitizedConfig),
    [sanitizedConfig]
  );

  const exportBundle = useMemo(() => buildExportBundle(payload), [payload]);

  const pushHistory = useCallback(
    (cfg: GeneratorUserConfig, archLabel: string) => {
      const entry: HistoryBuildEntry = {
        id: `${cfg.subcategory}-${cfg.variationSeed}-${cfg.tone}-${Date.now()}`,
        config: { ...cfg },
        label: `${cfg.brandName} · #${cfg.variationSeed}`,
        archetypeLabel: archLabel,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setBuildHistory((prev) => [entry, ...prev.slice(0, 4)]);
    },
    []
  );

  const triggerBuildSequence = useCallback(
    (nextConfig?: GeneratorUserConfig, mode: "initial" | "variant" = "initial") => {
      clearTimers();
      setBuildMode(mode);
      const targetConfig = nextConfig || sanitizedConfig;
      if (nextConfig) {
        setConfig(nextConfig);
      }
      writeShareUrlQuery(targetConfig);
      const targetPayload = synthesizeLanding(targetConfig);

      if (prefersReducedMotion) {
        setLastBuildSeconds("0.2");
        setFlowPhase("ready");
        pushHistory(targetConfig, targetPayload.tokens.archetypeLabel);
        return;
      }

      setFlowPhase("assembling");
      setActiveStage(1);
      const stepMs =
        targetConfig.speedMode === "fast"
          ? 240
          : targetConfig.speedMode === "slow"
          ? 1050
          : mode === "variant"
          ? 540
          : 720;
      setLastBuildSeconds(((stepMs * 5) / 1000).toFixed(1));

      for (let s = 2; s <= 5; s++) {
        const tid = window.setTimeout(() => setActiveStage(s), stepMs * (s - 1));
        stageTimersRef.current.push(tid);
      }
      const finalId = window.setTimeout(() => {
        setFlowPhase("ready");
        pushHistory(targetConfig, targetPayload.tokens.archetypeLabel);
      }, stepMs * 5);
      stageTimersRef.current.push(finalId);
    },
    [clearTimers, prefersReducedMotion, pushHistory, sanitizedConfig]
  );

  const handleSkipToResult = useCallback(() => {
    clearTimers();
    setFlowPhase("ready");
    pushHistory(sanitizedConfig, payload.tokens.archetypeLabel);
  }, [clearTimers, payload.tokens.archetypeLabel, pushHistory, sanitizedConfig]);

  const handleSelectSubcategory = useCallback((sub: AutoSubcategoryId) => {
    const preset = AUTO_SUBCATEGORY_PRESETS[sub];
    setConfig((prev) => ({
      ...prev,
      subcategory: sub,
      tone: preset.defaultTone,
      brandName: preset.defaultBrandName,
      modelName: preset.defaultModelName,
      chassisCode: preset.defaultChassisCode,
      location: preset.defaultLocation,
      focusTags: [...preset.defaultFocusTags],
      customMetrics: { ...preset.defaultCustomMetrics },
      heroOverrideId: undefined,
    }));
  }, []);

  const handleToggleFocusTag = useCallback((tag: EngineeringTag) => {
    setConfig((prev) => {
      const exists = prev.focusTags.includes(tag);
      if (exists && prev.focusTags.length <= 1) return prev;
      return {
        ...prev,
        focusTags: exists
          ? prev.focusTags.filter((t) => t !== tag)
          : [...prev.focusTags, tag],
        heroOverrideId: undefined,
      };
    });
  }, []);

  const handleNextVariation = useCallback(() => {
    triggerBuildSequence(
      { ...sanitizedConfig, variationSeed: (config.variationSeed % 10) + 1, heroOverrideId: undefined },
      "variant"
    );
  }, [config.variationSeed, sanitizedConfig, triggerBuildSequence]);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportBundle.pageTsx);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  }, [exportBundle.pageTsx]);

  const handleCopyForAiEditor = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportBundle.copyForAiEditor);
      setCopiedAiCode(true);
      window.setTimeout(() => setCopiedAiCode(false), 2000);
    } catch {
      setCopiedAiCode(false);
    }
  }, [exportBundle.copyForAiEditor]);

  const handleCopyShareLink = useCallback(async () => {
    if (typeof window === "undefined") return;
    writeShareUrlQuery(sanitizedConfig);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      window.setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      setCopiedShare(false);
    }
  }, [sanitizedConfig]);

  const handleDownloadZip = useCallback(async () => {
    setDownloadingZip(true);
    try {
      const encoder = new TextEncoder();
      const zipEntries: Array<{ path: string; data: Uint8Array }> =
        exportBundle.files.map((f) => ({
          path: f.path,
          data: encoder.encode(f.content),
        }));

      for (const mapping of exportBundle.assetMappings) {
        try {
          const res = await fetch(mapping.sourcePublicUrl);
          if (res.ok) {
            zipEntries.push({
              path: mapping.zipPath,
              data: new Uint8Array(await res.arrayBuffer()),
            });
          }
        } catch {
          void 0;
        }
      }

      const zipBytes = createStoreZipBytes(zipEntries);
      const blob = new Blob([zipBytes as unknown as BlobPart], {
        type: "application/zip",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const slug = sanitizedConfig.brandName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      anchor.href = url;
      anchor.download = `${slug || "dealership"}-landing-seed-${sanitizedConfig.variationSeed}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingZip(false);
    }
  }, [exportBundle, sanitizedConfig.brandName, sanitizedConfig.variationSeed]);

  useEffect(() => {
    if (flowPhase !== "intake") return;
    const targetRef =
      intakeStep === 2
        ? nameInputRef
        : intakeStep === 5
        ? cityInputRef
        : stepHeadingRef;
    window.setTimeout(() => targetRef.current?.focus(), 40);
  }, [flowPhase, intakeStep]);

  useEffect(() => {
    if (flowPhase !== "intake") return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";

      if (e.key === "Escape") {
        if (intakeStep > 0) {
          e.preventDefault();
          setIntakeStep((prev) => Math.max(0, prev - 1) as IntakeStep);
        }
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (intakeStep < 6) {
          setIntakeStep((prev) => Math.min(6, prev + 1) as IntakeStep);
        } else {
          triggerBuildSequence();
        }
        return;
      }
      if (isInput) return;

      const stepDelta =
        e.key === "ArrowDown" || e.key === "ArrowRight"
          ? 1
          : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? -1
          : 0;
      if (!stepDelta) return;

      if (intakeStep === 1) {
        e.preventDefault();
        const idx = SUBCATEGORY_ORDER.indexOf(config.subcategory);
        handleSelectSubcategory(
          SUBCATEGORY_ORDER[
            (idx + stepDelta + SUBCATEGORY_ORDER.length) %
              SUBCATEGORY_ORDER.length
          ]
        );
      } else if (intakeStep === 3) {
        e.preventDefault();
        const actions = UI_STRINGS.visitorActions;
        const idx = actions.findIndex((a) => a.id === config.primaryCta);
        const next =
          actions[(idx + stepDelta + actions.length) % actions.length];
        setConfig((prev) => ({ ...prev, primaryCta: next.id }));
      } else if (intakeStep === 4) {
        e.preventDefault();
        const idx = TONE_ORDER.indexOf(config.tone);
        const next =
          TONE_ORDER[(idx + stepDelta + TONE_ORDER.length) % TONE_ORDER.length];
        setConfig((prev) => ({ ...prev, tone: next }));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    config.primaryCta,
    config.subcategory,
    config.tone,
    flowPhase,
    handleSelectSubcategory,
    intakeStep,
    triggerBuildSequence,
  ]);

  return {
    prefersReducedMotion,
    toolTheme,
    config,
    setConfig,
    sanitizedConfig,
    flowPhase,
    setFlowPhase,
    intakeStep,
    setIntakeStep,
    activeStage,
    buildMode,
    lastBuildSeconds,
    showWhyPhotos,
    setShowWhyPhotos,
    showRefinePanel,
    setShowRefinePanel,
    showAdvanced,
    setShowAdvanced,
    showExportModal,
    setShowExportModal,
    exportTab,
    setExportTab,
    copiedCode,
    copiedAiCode,
    copiedShare,
    downloadingZip,
    buildHistory,
    payload,
    exportBundle,
    stepHeadingRef,
    nameInputRef,
    cityInputRef,
    applyToolTheme,
    triggerBuildSequence,
    handleSkipToResult,
    handleSelectSubcategory,
    handleToggleFocusTag,
    handleNextVariation,
    handleCopyCode,
    handleCopyForAiEditor,
    handleCopyShareLink,
    handleDownloadZip,
  };
}
