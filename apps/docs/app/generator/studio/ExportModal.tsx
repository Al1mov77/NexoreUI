"use client";

import { Check, Code2, Copy, Download, X } from "lucide-react";
import React from "react";
import { ExportBundle } from "../../../lib/generator/export-engine";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";
import { ExportTab } from "./studio-types";

function getMediaBadge(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".mp4")) return "MP4 video";
  if (lower.endsWith(".webm")) return "WebM video";
  if (lower.endsWith(".png")) return "PNG asset";
  if (lower.endsWith(".webp")) return "WebP asset";
  return "JPG asset";
}

export function ExportModal({
  exportBundle,
  exportTab,
  copiedCode,
  copiedAiCode,
  downloadingZip,
  onSetExportTab,
  onCopyForAiEditor,
  onCopyCode,
  onDownloadZip,
  onClose,
}: {
  exportBundle: ExportBundle;
  exportTab: ExportTab;
  copiedCode: boolean;
  copiedAiCode: boolean;
  downloadingZip: boolean;
  onSetExportTab: (tab: ExportTab) => void;
  onCopyForAiEditor: () => void;
  onCopyCode: () => void;
  onDownloadZip: () => void;
  onClose: () => void;
}) {
  return (
    <div
      data-testid="panel-export"
      style={{
        borderColor: "var(--tool-border)",
        backgroundColor: "var(--tool-surface)",
      }}
      className="rounded-xl border p-5 space-y-5"
    >
      <div
        style={{ borderColor: "var(--tool-border)" }}
        className="flex flex-wrap items-center justify-between gap-4 border-b pb-4"
      >
        <div>
          <h3 className="text-base font-semibold">
            {UI_STRINGS.exportModal.title}
          </h3>
          <p style={{ color: "var(--tool-muted)" }} className="text-xs">
            {UI_STRINGS.exportModal.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            style={{
              borderColor: "var(--tool-border)",
              backgroundColor: "var(--tool-surface-elevated)",
            }}
            className="inline-flex rounded-lg border p-0.5 text-xs font-medium"
          >
            <button
              type="button"
              data-testid="export-tab-react"
              onClick={() => onSetExportTab("react")}
              style={{
                backgroundColor:
                  exportTab === "react"
                    ? "var(--tool-surface-active)"
                    : "transparent",
                color: "var(--tool-fg)",
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 cursor-pointer transition-colors"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>page.tsx</span>
            </button>
            <button
              type="button"
              data-testid="export-tab-zip"
              onClick={() => onSetExportTab("zip")}
              style={{
                backgroundColor:
                  exportTab === "zip"
                    ? "var(--tool-surface-active)"
                    : "transparent",
                color: "var(--tool-fg)",
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 cursor-pointer transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>ZIP Bundle</span>
            </button>
          </div>

          {exportTab === "react" && (
            <>
              <button
                type="button"
                data-testid="btn-copy-ai-editor"
                onClick={onCopyForAiEditor}
                style={{
                  backgroundColor: "var(--tool-accent)",
                  color: "var(--tool-accent-fg)",
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium cursor-pointer"
              >
                {copiedAiCode ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>
                  {copiedAiCode
                    ? UI_STRINGS.exportModal.copiedForAiButton
                    : UI_STRINGS.exportModal.copyForAiButton}
                </span>
              </button>

              <button
                type="button"
                data-testid="btn-copy-code"
                onClick={onCopyCode}
                style={{
                  borderColor: "var(--tool-border)",
                  backgroundColor: "var(--tool-surface-elevated)",
                  color: "var(--tool-fg)",
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium cursor-pointer"
              >
                {copiedCode ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>
                  {copiedCode
                    ? UI_STRINGS.exportModal.copiedButton
                    : UI_STRINGS.exportModal.copyButton}
                </span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label={UI_STRINGS.exportModal.closeButton}
            style={{
              borderColor: "var(--tool-border)",
              backgroundColor: "var(--tool-surface-elevated)",
              color: "var(--tool-fg)",
            }}
            className="rounded-lg border p-2 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        style={{
          borderColor: "var(--tool-border)",
          backgroundColor: "var(--tool-surface-elevated)",
        }}
        className="rounded-lg border px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
      >
        <span>
          AI Editor Prompt:{" "}
          <strong style={{ color: "var(--tool-fg)" }}>
            &ldquo;{UI_STRINGS.exportModal.aiInstructionNote}&rdquo;
          </strong>
        </span>
        <span className="font-mono tabular-nums">
          page.tsx · {exportBundle.lineCount} lines · 1 dependency (react)
        </span>
      </div>

      {exportTab !== "zip" ? (
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <pre
              style={{
                borderColor: "var(--tool-border)",
                backgroundColor: "var(--tool-surface-elevated)",
                color: "var(--tool-fg)",
              }}
              className="max-h-[420px] overflow-auto rounded-xl border p-4 text-[11px] font-mono leading-relaxed"
            >
              <code>{exportBundle.pageTsx}</code>
            </pre>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-semibold block">
              {UI_STRINGS.exportModal.imagesListLabel} (
              {exportBundle.assetMappings.length})
            </span>
            <div className="space-y-2">
              {exportBundle.assetMappings.map((img) => {
                const isVideo =
                  img.sourcePublicUrl.toLowerCase().endsWith(".mp4") ||
                  img.sourcePublicUrl.toLowerCase().endsWith(".webm");
                return (
                  <div
                    key={img.relativeRef}
                    style={{
                      borderColor: "var(--tool-border)",
                      backgroundColor: "var(--tool-surface-elevated)",
                    }}
                    className="rounded-lg border p-2.5 flex items-center gap-3 text-xs"
                  >
                    {isVideo ? (
                      <video
                        src={img.sourcePublicUrl}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-10 w-14 object-cover rounded shrink-0"
                      />
                    ) : (
                      <img
                        src={img.sourcePublicUrl}
                        alt={img.role}
                        className="h-10 w-14 object-cover rounded shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{img.role}</div>
                      <div
                        style={{ color: "var(--tool-muted)" }}
                        className="font-mono text-[11px] truncate"
                      >
                        {img.relativeRef}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-12">
          <div
            style={{
              borderColor: "var(--tool-border)",
              backgroundColor: "var(--tool-surface-elevated)",
            }}
            className="lg:col-span-7 rounded-xl border p-4 space-y-2.5"
          >
            <span className="text-xs font-semibold block">
              {UI_STRINGS.exportModal.zipStructureLabel}
            </span>
            <ul className="space-y-1.5 text-xs font-mono">
              {exportBundle.files.map((file) => (
                <li
                  key={file.path}
                  style={{
                    borderColor: "var(--tool-border)",
                    backgroundColor: "var(--tool-surface)",
                  }}
                  className="flex items-center justify-between rounded border px-3 py-1.5"
                >
                  <span>{file.path}</span>
                  <span
                    style={{ color: "var(--tool-muted)" }}
                    className="tabular-nums"
                  >
                    {file.content.split("\n").length} lines
                  </span>
                </li>
              ))}
              {exportBundle.assetMappings.map((asset) => (
                <li
                  key={asset.zipPath}
                  style={{
                    borderColor: "var(--tool-border)",
                    backgroundColor: "var(--tool-surface)",
                  }}
                  className="flex items-center justify-between rounded border px-3 py-1.5"
                >
                  <span>{asset.zipPath}</span>
                  <span style={{ color: "var(--tool-muted)" }}>
                    {getMediaBadge(asset.zipPath)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div
              style={{
                borderColor: "var(--tool-border)",
                backgroundColor: "var(--tool-surface-elevated)",
              }}
              className="rounded-xl border p-4 space-y-2 text-xs"
            >
              <span className="font-semibold block">Standalone archive</span>
              <p style={{ color: "var(--tool-muted)" }}>
                Includes the single-file page.tsx ({exportBundle.lineCount}{" "}
                lines), images manifest, and all{" "}
                {exportBundle.assetMappings.length} high-resolution media
                assets.
              </p>
            </div>

            <button
              type="button"
              data-testid="btn-download-zip"
              disabled={downloadingZip}
              onClick={onDownloadZip}
              style={{
                backgroundColor: "var(--tool-accent)",
                color: "var(--tool-accent-fg)",
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>
                {downloadingZip
                  ? UI_STRINGS.exportModal.downloadingZipButton
                  : UI_STRINGS.exportModal.downloadZipButton}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
