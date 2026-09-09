"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useTemplateCustomizer, DeviceMode } from "../../context/TemplateCustomizerContext";
import { Monitor, Tablet, Smartphone, Moon, Sun, RotateCcw, Maximize2 } from "lucide-react";

interface TemplatePreviewWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  onReset?: () => void;
  /** Fixed height for scaled viewport calculation (default: 680) */
  viewportHeight?: number;
  /** Whether to enable auto-scaling to fit the container (default: true) */
  autoFit?: boolean;
  /** Callback to trigger full screen live preview */
  onOpenFullscreen?: () => void;
}

const DEVICE_CONFIG: Record<
  DeviceMode,
  {
    targetWidth: number;
    targetHeight: number;
    label: string;
    icon: typeof Monitor;
    badge: string;
  }
> = {
  desktop: {
    targetWidth: 1024,
    targetHeight: 680,
    label: "Desktop",
    icon: Monitor,
    badge: "1024px",
  },
  tablet: {
    targetWidth: 768,
    targetHeight: 680,
    label: "Tablet",
    icon: Tablet,
    badge: "768px",
  },
  mobile: {
    targetWidth: 390,
    targetHeight: 680,
    label: "Mobile",
    icon: Smartphone,
    badge: "390px",
  },
};

export function TemplatePreviewWrapper({
  children,
  className = "",
  maxHeight = "max-h-[780px]",
  showToolbar = false,
  onReset,
  viewportHeight = 680,
  autoFit = true,
  onOpenFullscreen,
}: TemplatePreviewWrapperProps) {
  const { config, updateConfig, deviceMode, setDeviceMode, cssVariables } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState<number>(0);

  // Measure available container width accurately with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleResize = () => {
      if (el) {
        setAvailableWidth(el.clientWidth);
      }
    };

    handleResize();

    const observer = new ResizeObserver(() => {
      handleResize();
    });
    observer.observe(el);
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const currentDevice = DEVICE_CONFIG[deviceMode] || DEVICE_CONFIG.desktop;
  const targetWidth = currentDevice.targetWidth;
  const targetHeight = viewportHeight || currentDevice.targetHeight;

  // Calculate proportional scale when available width is smaller than target device
  const { scale, isScaled } = useMemo(() => {
    if (!autoFit || availableWidth <= 0) {
      return { scale: 1, isScaled: false };
    }

    // Allocate padding based on device type
    const padding = deviceMode === "mobile" ? 8 : 12;
    const usableWidth = availableWidth - padding;

    if (usableWidth < targetWidth) {
      const computedScale = Math.max(0.22, Math.min(1, usableWidth / targetWidth));
      return { scale: computedScale, isScaled: true };
    }

    return { scale: 1, isScaled: false };
  }, [autoFit, availableWidth, targetWidth, deviceMode]);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-center relative">
      {/* Optional Toolbar */}
      {showToolbar && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 mb-3 rounded-xl bg-zinc-900/70 border border-white/10 backdrop-blur-md text-xs">
          {/* Device switchers */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-white/5">
            {(["desktop", "tablet", "mobile"] as DeviceMode[]).map((mode) => {
              const cfg = DEVICE_CONFIG[mode];
              const Icon = cfg.icon;
              const isActive = deviceMode === mode;

              return (
                <button
                  key={mode}
                  onClick={() => setDeviceMode(mode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  title={`${cfg.label} (${cfg.badge})`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{cfg.label}</span>
                  <span className="text-[10px] opacity-70 sm:hidden">{cfg.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Scale indicator if scaled */}
          {isScaled && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400">
              <span>Scaled:</span>
              <span className="text-zinc-200 font-semibold">{Math.round(scale * 100)}%</span>
            </div>
          )}

          {/* Quick theme, fullscreen & reset */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => updateConfig({ theme: isDark ? "light" : "dark" })}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
              title="Toggle template theme"
            >
              {isDark ? (
                <Sun className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-indigo-400" />
              )}
              <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
            </button>

            {onOpenFullscreen && (
              <button
                onClick={onOpenFullscreen}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-all text-xs"
                title="Open fullscreen preview"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            )}

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

      {/* Main Preview Container with Proportional Viewport Scaler */}
      <div
        data-device={deviceMode}
        className="w-full flex justify-center items-center overflow-hidden transition-all duration-300 relative py-1 sm:py-2"
        style={{
          // When scaled down, set exact outer height matching targetHeight * scale
          height: isScaled ? `${Math.ceil(targetHeight * scale) + (deviceMode === "mobile" ? 20 : 10)}px` : undefined,
          minHeight: isScaled ? undefined : deviceMode === "mobile" ? "520px" : "480px",
        }}
      >
        {/* Proportional Transform Wrapper */}
        <div
          style={{
            width: isScaled ? `${targetWidth}px` : undefined,
            maxWidth: isScaled ? undefined : deviceMode === "desktop" ? "100%" : `${targetWidth}px`,
            transform: isScaled ? `scale(${scale})` : undefined,
            transformOrigin: "top center",
            flexShrink: 0,
          }}
          className={`transition-transform duration-300 ease-out flex justify-center ${
            isScaled ? "absolute top-1" : "w-full"
          }`}
        >
          {/* Framed Canvas */}
          <div
            style={cssVariables}
            className={`transition-all duration-300 relative ${
              deviceMode === "desktop"
                ? "w-full rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden bg-zinc-950"
                : deviceMode === "tablet"
                ? "w-[768px] rounded-2xl p-1.5 bg-zinc-950 border-[4px] border-zinc-800/70 shadow-2xl shadow-black/70 ring-1 ring-white/10"
                : "w-[390px] rounded-[38px] p-2.5 bg-zinc-950 border-[6px] border-zinc-800/80 shadow-2xl shadow-black/80 ring-1 ring-white/10"
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
              style={{
                height: `${targetHeight}px`,
                backgroundColor: "var(--template-bg)",
                color: "var(--template-fg)",
                fontFamily: "var(--template-font)",
                backgroundImage: "var(--template-bg-pattern)",
                backgroundSize: "var(--template-bg-size)",
                backgroundRepeat: "repeat",
                fontSize: "var(--template-font-size-scale, 100%)",
              }}
              className={`@container w-full overflow-y-auto overflow-x-hidden no-scrollbar transition-colors ${
                deviceMode === "mobile"
                  ? "rounded-[28px] pt-7"
                  : deviceMode === "tablet"
                  ? "rounded-xl"
                  : "rounded-2xl"
              } ${className}`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
