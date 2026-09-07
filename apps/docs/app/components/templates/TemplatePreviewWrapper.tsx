"use client";

import React from "react";
import { useTemplateCustomizer } from "../../context/TemplateCustomizerContext";
import { Monitor, Tablet, Smartphone, Moon, Sun, RotateCcw } from "lucide-react";

interface TemplatePreviewWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  onReset?: () => void;
}

export function TemplatePreviewWrapper({
  children,
  className = "",
  maxHeight = "max-h-[780px]",
  showToolbar = false,
  onReset,
}: TemplatePreviewWrapperProps) {
  const { config, updateConfig, deviceMode, setDeviceMode, cssVariables } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  const getContainerWidth = () => {
    switch (deviceMode) {
      case "mobile":
        return "max-w-[390px] w-full";
      case "tablet":
        return "max-w-[768px] w-full";
      case "desktop":
      default:
        return "w-full";
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {showToolbar && (
        <div className="w-full flex items-center justify-between px-4 py-2.5 mb-3 rounded-xl bg-zinc-900/60 border border-white/10 backdrop-blur-md text-xs">
          {/* Device switchers */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-white/5">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                deviceMode === "desktop"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                deviceMode === "tablet"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>Tablet (768px)</span>
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                deviceMode === "mobile"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile (390px)</span>
            </button>
          </div>

          {/* Quick theme & reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateConfig({ theme: isDark ? "light" : "dark" })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
            >
              {isDark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-indigo-400" />}
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {onReset && (
              <button
                onClick={onReset}
                title="Reset to Template Defaults"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Preview Frame */}
      <div
        data-device={deviceMode}
        className={`transition-all duration-300 ease-out flex justify-center w-full ${
          deviceMode === "mobile"
            ? "py-4"
            : deviceMode === "tablet"
            ? "py-3"
            : "py-0"
        }`}
      >
        <div
          style={cssVariables}
          className={`${getContainerWidth()} ${maxHeight} transition-all duration-300 relative ${
            deviceMode === "mobile"
              ? "rounded-[38px] p-2.5 bg-zinc-950 border-[6px] border-zinc-800/80 shadow-2xl shadow-black/80 ring-1 ring-white/10"
              : deviceMode === "tablet"
              ? "rounded-2xl p-1.5 bg-zinc-950 border-[4px] border-zinc-800/70 shadow-2xl shadow-black/70 ring-1 ring-white/10"
              : "rounded-2xl border border-zinc-800/80 shadow-2xl"
          }`}
        >
          {/* Mobile speaker & camera notch */}
          {deviceMode === "mobile" && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-900 rounded-full z-30 flex items-center justify-center pointer-events-none shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-black/90 ring-1 ring-zinc-700/50 mr-2" />
              <div className="w-8 h-1 rounded-full bg-zinc-700/60" />
            </div>
          )}

          {/* Actual scrollable viewport canvas */}
          <div
            className={`@container w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar transition-colors ${
              deviceMode === "mobile"
                ? "rounded-[28px] pt-7"
                : deviceMode === "tablet"
                ? "rounded-xl"
                : "rounded-2xl"
            } ${className}`}
            style={{
              backgroundColor: "var(--template-bg)",
              color: "var(--template-fg)",
              fontFamily: "var(--template-font)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
