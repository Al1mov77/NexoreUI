'use client';

import * as React from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

// Register hardware angle property once for conic gradient rotation
if (typeof window !== 'undefined' && typeof (window as any).CSS !== 'undefined' && 'registerProperty' in (window as any).CSS) {
  try {
    (window as any).CSS.registerProperty({
      name: '--aurora-deg',
      syntax: '<angle>',
      inherits: false,
      initialValue: '0deg',
    });
  } catch {}
}

export interface AuroraSearchSource {
  /** Unique key for the source badge */
  id: string;
  /** Label or tooltip text for the source */
  label?: string;
  /** Direct avatar image URL (e.g. favicon, PNG, SVG) */
  avatarUrl?: string;
  /** Custom icon or element */
  icon?: React.ReactNode;
  /** Text initials to display inside badge */
  initials?: string;
  /** Built-in preset type or custom */
  type?: 'globe' | 'gradient' | 'github' | 'claude' | 'chatgpt' | 'perplexity' | 'custom';
  /** Custom background CSS string or hex */
  bg?: string;
}

export type AuroraSearchPillSize = 'sm' | 'md' | 'lg';
export type AuroraSearchPillSpeed = 'slow' | 'normal' | 'fast';
export type AuroraSearchPillTheme = 'light' | 'dark' | 'auto';
export type AuroraSearchPillGlow = 'subtle' | 'medium' | 'strong' | 'none';
export type AuroraSpinMode = 'always' | 'searching' | 'hover' | 'never';

export interface AuroraSearchPillProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  /** Controlled searching state */
  isSearching?: boolean;
  /** Uncontrolled default searching state */
  defaultSearching?: boolean;
  /** Callback fired when searching state toggles */
  onToggle?: (searching: boolean) => void;
  /** Main search title text shown when active (default: "Search...") */
  searchLabel?: string;
  /** List of badge sources to render in the active state */
  sources?: AuroraSearchSource[];
  /** Shortcut array of avatar image URLs */
  sourceAvatars?: string[];
  /** Color theme for the pill body: light, dark, or auto (follows dark mode) */
  theme?: AuroraSearchPillTheme;
  /** Size scale of the pill */
  size?: AuroraSearchPillSize;
  /** Glow intensity of the surrounding ambient aurora */
  glowIntensity?: AuroraSearchPillGlow;
  /** Speed of the rotating aurora beam */
  speed?: AuroraSearchPillSpeed;
  /**
   * When the aurora beam should rotate:
   * - 'always' (default): continuously rotates the aurora light wave all the time
   * - 'searching': only spins while searching/active, remains calm when idle
   * - 'hover': spins on cursor hover / focus
   * - 'never': static gradient, no rotation
   */
  spinMode?: AuroraSpinMode;
  /** Manually override spinning state */
  isSpinning?: boolean;
  /** Automatically toggle searching state at a set interval (demo mode) */
  autoCycle?: boolean;
  /** Interval in ms for autoCycle (default: 2400) */
  cycleInterval?: number;
}

const DEFAULT_SOURCES: AuroraSearchSource[] = [
  { id: 'web', type: 'globe', label: 'Web' },
  { id: 'gradient', type: 'gradient', label: 'Neural Index' },
  { id: 'github', type: 'github', label: 'GitHub' },
];

const SPEED_MAP: Record<AuroraSearchPillSpeed, string> = {
  slow: '5s',
  normal: '3.2s',
  fast: '1.8s',
};

const GLOW_OPACITY: Record<AuroraSearchPillGlow, number> = {
  none: 0,
  subtle: 0.45,
  medium: 0.75,
  strong: 0.95,
};

const SIZE_CONFIG: Record<
  AuroraSearchPillSize,
  {
    height: string;
    paddingDots: string;
    paddingSearch: string;
    dotSize: string;
    dotGap: string;
    fontSize: string;
    badgeSize: string;
    badgeMargin: string;
    minWidthSearch: string;
  }
> = {
  sm: {
    height: 'h-10',
    paddingDots: 'px-4',
    paddingSearch: 'px-4',
    dotSize: 'w-1.5 h-1.5',
    dotGap: 'gap-1.5',
    fontSize: 'text-xs',
    badgeSize: 'w-4 h-4',
    badgeMargin: '-ml-1',
    minWidthSearch: 'min-w-[160px]',
  },
  md: {
    height: 'h-12',
    paddingDots: 'px-5',
    paddingSearch: 'px-5',
    dotSize: 'w-[6.5px] h-[6.5px]',
    dotGap: 'gap-[7px]',
    fontSize: 'text-sm sm:text-base',
    badgeSize: 'w-[22px] h-[22px]',
    badgeMargin: '-ml-1.5',
    minWidthSearch: 'min-w-[190px]',
  },
  lg: {
    height: 'h-14',
    paddingDots: 'px-6',
    paddingSearch: 'px-6',
    dotSize: 'w-2 h-2',
    dotGap: 'gap-2',
    fontSize: 'text-base sm:text-lg',
    badgeSize: 'w-6 h-6',
    badgeMargin: '-ml-2',
    minWidthSearch: 'min-w-[220px]',
  },
};

/**
 * AuroraSearchPill Component
 *
 * An ultra-premium AI search pill with an ambient rotating aurora conic glow,
 * 1.5px illuminated border track, and smooth transition between pulsing dots and
 * active search query with source badges.
 */
export const AuroraSearchPill = React.forwardRef<HTMLDivElement, AuroraSearchPillProps>(
  (
    {
      isSearching: controlledSearching,
      defaultSearching = false,
      onToggle,
      searchLabel = 'Search...',
      sources = DEFAULT_SOURCES,
      sourceAvatars,
      theme = 'auto',
      size = 'md',
      glowIntensity = 'medium',
      speed = 'normal',
      spinMode = 'always',
      isSpinning: controlledSpinning,
      autoCycle = false,
      cycleInterval = 2400,
      className,
      onClick,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledSearching !== undefined;
    const [uncontrolledSearching, setUncontrolledSearching] = React.useState(defaultSearching);
    const active = isControlled ? controlledSearching : uncontrolledSearching;

    const [isHovered, setIsHovered] = React.useState(false);

    // Unique style injection ID for CSS custom property and keyframes
    const instanceId = React.useId().replace(/:/g, '');

    // Resolve active sources list (support direct sourceAvatars list)
    const activeSources = React.useMemo<AuroraSearchSource[]>(() => {
      if (sourceAvatars && sourceAvatars.length > 0) {
        return sourceAvatars.map((url, i): AuroraSearchSource => ({
          id: `avatar-${i}`,
          avatarUrl: url,
          label: `Source ${i + 1}`,
          type: 'custom',
        }));
      }
      return sources;
    }, [sourceAvatars, sources]);

    // Determine whether the aurora beam should actively rotate (default: always on)
    const shouldSpin = React.useMemo(() => {
      if (controlledSpinning !== undefined) return controlledSpinning;
      if (spinMode === 'never') return false;
      if (spinMode === 'searching') return active;
      if (spinMode === 'hover') return isHovered;
      // Default: 'always' -> continuously rotates in both idle (dots) and searching states
      return true;
    }, [controlledSpinning, spinMode, isHovered, active]);

    // Auto demo cycling
    React.useEffect(() => {
      if (!autoCycle) return;
      const interval = setInterval(() => {
        if (isControlled) {
          onToggle?.(!active);
        } else {
          setUncontrolledSearching((prev) => {
            const next = !prev;
            onToggle?.(next);
            return next;
          });
        }
      }, cycleInterval);

      return () => clearInterval(interval);
    }, [autoCycle, cycleInterval, active, isControlled, onToggle]);

    const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (!isControlled) {
        setUncontrolledSearching(!active);
      }
      onToggle?.(!active);
    };

    const sizeStyle = SIZE_CONFIG[size] || SIZE_CONFIG.md;
    const animationDuration = SPEED_MAP[speed] || SPEED_MAP.normal;
    const glowAlpha = GLOW_OPACITY[glowIntensity] ?? GLOW_OPACITY.medium;

    // Theme resolution for pill body
    const bodyThemeClass =
      theme === 'light'
        ? 'bg-white text-slate-900 border-white/60 shadow-sm'
        : theme === 'dark'
        ? 'bg-[#090d16] text-white border-white/10 shadow-lg shadow-black/40'
        : 'bg-white text-slate-900 dark:bg-[#090d16] dark:text-white border-white/60 dark:border-white/10 shadow-sm dark:shadow-black/40';

    const dotsColorClass =
      theme === 'light'
        ? 'bg-slate-900'
        : theme === 'dark'
        ? 'bg-white'
        : 'bg-slate-900 dark:bg-white';

    return (
      <div
        ref={ref}
        onClick={handleToggle}
        onMouseEnter={(e) => {
          setIsHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          onMouseLeave?.(e);
        }}
        role="button"
        tabIndex={0}
        aria-pressed={active}
        aria-label={active ? `Searching: ${searchLabel}` : 'Activate AI Search'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        className={cn(
          'relative inline-flex items-center justify-center cursor-pointer select-none isolate outline-none group',
          'transition-transform duration-200 ease-out active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
          className
        )}
        {...props}
      >
        {/* Scoped CSS for hardware accelerated conic rotation and pulse */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @property --aurora-deg {
              syntax: '<angle>';
              initial-value: 0deg;
              inherits: false;
            }
            @keyframes spinAurora {
              from {
                --aurora-deg: 0deg;
              }
              to {
                --aurora-deg: 360deg;
              }
            }
            @keyframes dotPulse {
              0%, 80%, 100% {
                opacity: 0.35;
                transform: scale(0.75);
              }
              40% {
                opacity: 1;
                transform: scale(1.15);
              }
            }
          `,
        }} />

        {/* 1. Ambient Volumetric Glow (Aurora Ambient Glow) */}
        {glowIntensity !== 'none' && (
          <div
            className="absolute -inset-1.5 rounded-full pointer-events-none blur-md z-0 transition-opacity duration-300"
            style={{
              opacity: glowAlpha,
              background: `conic-gradient(
                from var(--aurora-deg, 0deg) at 50% 50%,
                transparent 0deg,
                rgba(59, 130, 246, 0.75) 60deg,
                rgba(139, 92, 246, 0.9) 110deg,
                rgba(236, 72, 153, 0.95) 160deg,
                rgba(244, 63, 94, 0.8) 200deg,
                transparent 250deg,
                transparent 360deg
              )`,
              animation: shouldSpin
                ? `spinAurora ${animationDuration} linear infinite`
                : undefined,
            }}
          />
        )}

        {/* 2. Sharp 1.5px Conic Border Track */}
        <div
          className="relative z-10 p-[1.5px] rounded-full transition-shadow duration-300 shadow-sm"
          style={{
            background: `conic-gradient(
              from var(--aurora-deg, 0deg) at 50% 50%,
              rgba(226, 232, 240, 0.8) 0deg,
              rgba(59, 130, 246, 0.85) 60deg,
              rgba(139, 92, 246, 1) 110deg,
              rgba(236, 72, 153, 1) 160deg,
              rgba(244, 63, 94, 0.85) 200deg,
              rgba(226, 232, 240, 0.6) 260deg,
              rgba(226, 232, 240, 0.8) 360deg
            )`,
            animation: shouldSpin
              ? `spinAurora ${animationDuration} linear infinite`
              : undefined,
          }}
        >
          {/* 3. Center Pill Body */}
          <div
            className={cn(
              'relative z-20 rounded-full flex items-center justify-center overflow-hidden border',
              sizeStyle.height,
              active ? cn(sizeStyle.paddingSearch, sizeStyle.minWidthSearch) : sizeStyle.paddingDots,
              bodyThemeClass,
              'transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]'
            )}
          >
            {/* STATE 1: Pulsing Dots (Idle/Listening) */}
            <div
              className={cn(
                'flex items-center',
                sizeStyle.dotGap,
                'transition-all duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
                active
                  ? 'opacity-0 scale-50 -translate-y-2 pointer-events-none absolute'
                  : 'opacity-100 scale-100 translate-y-0'
              )}
            >
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  className={cn('rounded-full inline-block', sizeStyle.dotSize, dotsColorClass)}
                  style={{
                    animation: `dotPulse 1.4s ease-in-out infinite both`,
                    animationDelay: `${idx === 0 ? -0.32 : idx === 1 ? -0.16 : 0}s`,
                  }}
                />
              ))}
            </div>

            {/* STATE 2: Active Search Label + Overlapping Sources */}
            <div
              className={cn(
                'flex items-center gap-2.5 whitespace-nowrap',
                'transition-all duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
                active
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-90 translate-y-2 pointer-events-none absolute'
              )}
            >
              {/* Search Title */}
              <span className={cn('font-medium tracking-tight', sizeStyle.fontSize)}>
                {searchLabel}
              </span>

              {/* Overlapping Sources Row */}
              {activeSources && activeSources.length > 0 && (
                <div className="inline-flex items-center pl-0.5">
                  {activeSources.map((src, i) => {
                    const isFirst = i === 0;

                    return (
                      <div
                        key={src.id || i}
                        title={src.label || src.id}
                        className={cn(
                          'rounded-full border-[1.5px] border-white dark:border-zinc-900 flex items-center justify-center shrink-0 shadow-xs overflow-hidden',
                          sizeStyle.badgeSize,
                          !isFirst && sizeStyle.badgeMargin
                        )}
                        style={{
                          backgroundColor:
                            src.type === 'globe'
                              ? '#0b1120'
                              : src.type === 'github'
                              ? '#ffffff'
                              : src.type === 'claude'
                              ? '#d97757'
                              : src.type === 'chatgpt'
                              ? '#10a37f'
                              : src.type === 'perplexity'
                              ? '#1fb8cd'
                              : src.type === 'custom' && src.bg
                              ? src.bg
                              : undefined,
                          background:
                            src.type === 'gradient'
                              ? 'linear-gradient(135deg, #06b6d4 45%, #3b82f6 55%)'
                              : undefined,
                        }}
                      >
                        {src.avatarUrl ? (
                          <img
                            src={src.avatarUrl}
                            alt={src.label || src.id}
                            className="w-full h-full object-cover"
                          />
                        ) : src.icon ? (
                          src.icon
                        ) : src.type === 'globe' ? (
                          <Globe className="w-3 h-3 text-sky-400 stroke-[2.5]" />
                        ) : src.type === 'github' ? (
                          <svg className="w-3.5 h-3.5 fill-[#181717]" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        ) : src.type === 'claude' ? (
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        ) : src.type === 'chatgpt' ? (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        ) : src.type === 'perplexity' ? (
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        ) : src.initials ? (
                          <span className="text-[8px] font-bold text-white uppercase">
                            {src.initials}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AuroraSearchPill.displayName = 'AuroraSearchPill';
