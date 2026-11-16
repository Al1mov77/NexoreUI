"use client";

import { LayoutGroup } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { UI_STRINGS } from "../../lib/generator/ui-strings";
import { ArchetypeCanvas } from "./ArchetypeCanvas";
import { AssemblyStageVisualizer } from "./AssemblyStageVisualizer";
import { AdvancedPanel } from "./studio/AdvancedPanel";
import { ExportModal } from "./studio/ExportModal";
import { IntakeWizard } from "./studio/IntakeWizard";
import { IntroScreen } from "./studio/IntroScreen";
import { ReadyToolbar } from "./studio/ReadyToolbar";
import { RefinePanel } from "./studio/RefinePanel";
import { useGeneratorStudio } from "./studio/useGeneratorStudio";
import { WhyPhotosPanel } from "./studio/WhyPhotosPanel";

export function GeneratorClient() {
  const studio = useGeneratorStudio();
  const prevFlowPhaseRef = useRef(studio.flowPhase);

  useEffect(() => {
    if (prevFlowPhaseRef.current !== studio.flowPhase) {
      prevFlowPhaseRef.current = studio.flowPhase;
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    }
  }, [studio.flowPhase]);

  return (
    <LayoutGroup>
      <link rel="stylesheet" href={studio.payload.tokens.fontPair.googleFontsUrl} />
      <div
        data-testid="generator-root"
        data-tool-theme={studio.toolTheme}
        style={{
          backgroundColor: "var(--tool-bg)",
          color: "var(--tool-fg)",
        }}
        className="generator-themed-root min-h-screen overflow-x-clip font-sans transition-colors duration-200"
      >
        <div
          style={{
            borderColor: "var(--tool-border)",
            backgroundColor: "var(--tool-surface)",
          }}
          className="border-b"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-12 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold">
                {UI_STRINGS.meta.toolTitle}
              </span>
              <span
                style={{
                  borderColor: "var(--tool-border)",
                  backgroundColor: "var(--tool-surface-elevated)",
                  color: "var(--tool-muted)",
                }}
                className="hidden sm:inline rounded-md border px-2 py-0.5 text-[11px]"
              >
                {UI_STRINGS.intro.betaNote}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {studio.flowPhase === "ready" && (
                <button
                  type="button"
                  data-testid="btn-edit-brief"
                  onClick={() => {
                    studio.setFlowPhase("intake");
                    studio.setIntakeStep(1);
                  }}
                  style={{ color: "var(--tool-muted)" }}
                  className="hover:opacity-80 font-medium cursor-pointer"
                >
                  {UI_STRINGS.postBuild.editBriefButton}
                </button>
              )}
            </div>
          </div>
        </div>

        <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {studio.flowPhase === "intake" && studio.intakeStep === 0 && (
              <IntroScreen
                key="intake-intro"
                prefersReducedMotion={studio.prefersReducedMotion}
                stepHeadingRef={studio.stepHeadingRef}
                onStart={() => studio.setIntakeStep(1)}
              />
            )}

            {studio.flowPhase === "intake" && studio.intakeStep >= 1 && (
              <IntakeWizard
                key={`intake-step-${studio.intakeStep}`}
                prefersReducedMotion={studio.prefersReducedMotion}
                intakeStep={studio.intakeStep}
                config={studio.config}
                sanitizedConfig={studio.sanitizedConfig}
                payload={studio.payload}
                stepHeadingRef={studio.stepHeadingRef}
                nameInputRef={studio.nameInputRef}
                cityInputRef={studio.cityInputRef}
                onSetIntakeStep={studio.setIntakeStep}
                onSetConfig={studio.setConfig}
                onSelectSubcategory={studio.handleSelectSubcategory}
                onToggleFocusTag={studio.handleToggleFocusTag}
                onBuild={() => studio.triggerBuildSequence()}
              />
            )}

            {studio.flowPhase === "assembling" && (
              <AssemblyStageVisualizer
                key="stage-assembling"
                payload={studio.payload}
                activeStage={studio.activeStage}
                buildMode={studio.buildMode}
                onSkipToResult={studio.handleSkipToResult}
              />
            )}

            {studio.flowPhase === "ready" && (
              <div key="stage-ready" className="space-y-4">
                <div
                  style={{ borderColor: "var(--tool-border)" }}
                  className="overflow-hidden rounded-xl border shadow-xs"
                >
                  <ArchetypeCanvas payload={studio.payload} />
                </div>

                <ReadyToolbar
                  lastBuildSeconds={studio.lastBuildSeconds}
                  sanitizedConfig={studio.sanitizedConfig}
                  payload={studio.payload}
                  showWhyPhotos={studio.showWhyPhotos}
                  showRefinePanel={studio.showRefinePanel}
                  showAdvanced={studio.showAdvanced}
                  copiedShare={studio.copiedShare}
                  buildHistory={studio.buildHistory}
                  onToggleWhyPhotos={() =>
                    studio.setShowWhyPhotos((v) => !v)
                  }
                  onNextVariation={studio.handleNextVariation}
                  onToggleRefinePanel={() =>
                    studio.setShowRefinePanel((v) => !v)
                  }
                  onToggleExportModal={() =>
                    studio.setShowExportModal((v) => !v)
                  }
                  onCopyShareLink={studio.handleCopyShareLink}
                  onToggleAdvanced={() => studio.setShowAdvanced((v) => !v)}
                  onSelectHistoryConfig={(cfg) => studio.setConfig(cfg)}
                />

                {studio.showRefinePanel && (
                  <RefinePanel
                    config={studio.config}
                    payload={studio.payload}
                    onSetConfig={studio.setConfig}
                    onToggleFocusTag={studio.handleToggleFocusTag}
                    onClose={() => studio.setShowRefinePanel(false)}
                  />
                )}

                {studio.showWhyPhotos && (
                  <WhyPhotosPanel
                    config={studio.config}
                    payload={studio.payload}
                    onToggleXRay={(checked) =>
                      studio.setConfig((prev) => ({
                        ...prev,
                        showXRayScoring: checked,
                      }))
                    }
                  />
                )}

                {studio.showAdvanced && (
                  <AdvancedPanel
                    config={studio.config}
                    payload={studio.payload}
                    onSetConfig={studio.setConfig}
                    onApplyToolTheme={studio.applyToolTheme}
                  />
                )}

                {studio.showExportModal && (
                  <ExportModal
                    exportBundle={studio.exportBundle}
                    exportTab={studio.exportTab}
                    copiedCode={studio.copiedCode}
                    copiedAiCode={studio.copiedAiCode}
                    downloadingZip={studio.downloadingZip}
                    onSetExportTab={studio.setExportTab}
                    onCopyForAiEditor={studio.handleCopyForAiEditor}
                    onCopyCode={studio.handleCopyCode}
                    onDownloadZip={studio.handleDownloadZip}
                    onClose={() => studio.setShowExportModal(false)}
                  />
                )}
              </div>
            )}
        </main>
      </div>
    </LayoutGroup>
  );
}

export default GeneratorClient;
