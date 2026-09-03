'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

export type AuroraFXColor = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber' | string;
export type AuroraFXGlow = 'none' | 'subtle' | 'medium' | 'strong';
export type AuroraFXRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface AuroraColorOption {
  name: string;
  hex: string;
}

export const defaultAuroraColors: AuroraColorOption[] = [
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
];

const colorPresetMap: Record<string, string> = {
  violet: '#8b5cf6',
  cyan: '#06b6d4',
  emerald: '#10b981',
  rose: '#f43f5e',
  amber: '#f59e0b',
};

const radiusMap: Record<AuroraFXRadius, { outer: string; inner: string }> = {
  sm: { outer: 'rounded-lg', inner: 'rounded-[calc(0.5rem-1px)]' },
  md: { outer: 'rounded-xl', inner: 'rounded-[calc(0.75rem-1px)]' },
  lg: { outer: 'rounded-2xl', inner: 'rounded-[calc(1rem-1px)]' },
  xl: { outer: 'rounded-3xl', inner: 'rounded-[calc(1.5rem-1.5px)]' },
  full: { outer: 'rounded-full', inner: 'rounded-full' },
};

const glowOpacityMap: Record<AuroraFXGlow, number> = {
  none: 0,
  subtle: 0.25,
  medium: 0.45,
  strong: 0.75,
};

export interface AuroraBorderFXProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Color preset ('violet', 'cyan', 'emerald', 'rose', 'amber') or any valid CSS hex/rgb color */
  color?: AuroraFXColor;
  /** Ambient dynamic glow intensity */
  glow?: AuroraFXGlow;
  /** Corner radius preset */
  radius?: AuroraFXRadius;
  /** Badge text displayed at the top */
  badgeText?: string;
  /** Icon displayed next to badge text */
  badgeIcon?: React.ReactNode;
  /** Card title */
  title?: string;
  /** Card description */
  description?: string;
  /** Whether to show the interactive color switcher */
  showColorPicker?: boolean;
  /** Custom color options for the color switcher */
  colors?: AuroraColorOption[];
  /** Controlled active color */
  activeColor?: string;
  /** Callback fired when color changes in color picker */
  onColorChange?: (colorHex: string) => void;
  /** Preview slot inside card body */
  previewSlot?: React.ReactNode;
  /** Footer slot at the bottom of the card */
  footerSlot?: React.ReactNode;
  /** Custom children — replaces standard card body if provided */
  children?: React.ReactNode;
}

/**
 * AuroraBorderFX Component
 *
 * State-of-the-art interactive card with reactive Aurora glow,
 * dynamic gradient border tracking, ambient atmospheric blur,
 * and built-in interactive color switcher.
 */
export const AuroraBorderFX = React.forwardRef<HTMLDivElement, AuroraBorderFXProps>(
  (
    {
      color = 'violet',
      glow = 'medium',
      radius = 'lg',
      badgeText = 'Aurora Border FX',
      badgeIcon = <Sparkles className="w-3 h-3" />,
      title = 'Reactive Aurora Borders',
      description = 'Smooth multi-color conic gradients that dynamically track and react with zero JavaScript canvas lag.',
      showColorPicker = true,
      colors = defaultAuroraColors,
      activeColor: controlledColor,
      onColorChange,
      previewSlot,
      footerSlot,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const resolvedInitialColor = colorPresetMap[color] || color || '#8b5cf6';
    const [internalColor, setInternalColor] = React.useState<string>(resolvedInitialColor);

    React.useEffect(() => {
      if (colorPresetMap[color]) {
        setInternalColor(colorPresetMap[color]);
      } else if (color) {
        setInternalColor(color);
      }
    }, [color]);

    const currentColor = controlledColor !== undefined ? controlledColor : internalColor;
    const radiusConfig = radiusMap[radius] || radiusMap.lg;
    const glowOpacity = glowOpacityMap[glow] ?? 0.45;

    const handleSelectColor = (hex: string) => {
      if (controlledColor === undefined) {
        setInternalColor(hex);
      }
      onColorChange?.(hex);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative isolate p-5 sm:p-6 overflow-hidden flex flex-col justify-between group transition-all duration-300',
          'border border-border/80 bg-card/60 backdrop-blur-xl shadow-xl',
          radiusConfig.outer,
          className
        )}
        {...props}
      >
        {/* Ambient Dynamic Background Glow */}
        {glow !== 'none' && (
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[85px] pointer-events-none transition-colors duration-500 -z-10"
            style={{
              backgroundColor: currentColor,
              opacity: glowOpacity,
            }}
          />
        )}

        {/* Ambient Secondary Counter-Glow for depth */}
        {glow !== 'none' && glow !== 'subtle' && (
          <div
            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[90px] pointer-events-none transition-colors duration-700 -z-10"
            style={{
              backgroundColor: currentColor,
              opacity: glowOpacity * 0.4,
            }}
          />
        )}

        {/* Custom Children Mode */}
        {children ? (
          <div className="relative z-10 w-full h-full">{children}</div>
        ) : (
          <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
            {/* Header: Badge & Color Switcher */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                {badgeText && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-300 shadow-xs"
                    style={{
                      backgroundColor: `${currentColor}18`,
                      borderColor: `${currentColor}40`,
                      color: currentColor,
                    }}
                  >
                    {badgeIcon}
                    <span>{badgeText}</span>
                  </div>
                )}

                {/* Color Switcher */}
                {showColorPicker && colors && colors.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-muted/60 dark:bg-muted/40 p-1 rounded-full border border-border/60 backdrop-blur-md">
                    {colors.map((c) => {
                      const isActive = currentColor.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleSelectColor(c.hex)}
                          className={cn(
                            'w-3.5 h-3.5 rounded-full transition-all duration-200 cursor-pointer',
                            isActive
                              ? 'scale-125 ring-2 ring-foreground/40 shadow-xs'
                              : 'hover:scale-110 opacity-70 hover:opacity-100'
                          )}
                          style={{ backgroundColor: c.hex }}
                          title={`Switch to ${c.name}`}
                          aria-label={`Switch glow to ${c.name}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div>
                {title && (
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="pt-2 flex items-center justify-center">
              {previewSlot ? (
                previewSlot
              ) : (
                <div
                  className={cn(
                    'relative p-[1.5px] overflow-hidden transition-all duration-300 w-full max-w-[280px]',
                    radiusConfig.inner
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${currentColor}, transparent 60%, ${currentColor}90)`,
                  }}
                >
                  <div
                    className={cn(
                      'bg-card/90 dark:bg-card/80 px-4 py-3 flex items-center justify-between backdrop-blur-md shadow-inner',
                      radiusConfig.inner
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                        style={{ backgroundColor: currentColor }}
                      />
                      <span className="text-xs font-mono font-semibold text-foreground">
                        Interactive Aurora Pill
                      </span>
                    </div>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md font-medium border"
                      style={{
                        backgroundColor: `${currentColor}12`,
                        borderColor: `${currentColor}30`,
                        color: currentColor,
                      }}
                    >
                      {currentColor.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Slot */}
            {footerSlot && <div className="pt-2 border-t border-border/50">{footerSlot}</div>}
          </div>
        )}
      </div>
    );
  }
);

AuroraBorderFX.displayName = 'AuroraBorderFX';
