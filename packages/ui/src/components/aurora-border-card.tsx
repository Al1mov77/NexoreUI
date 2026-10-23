'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export type AuroraVariant = 'aurora' | 'ocean' | 'sunset' | 'forest' | 'cyber' | 'gold' | 'mono';
export type AuroraSpeed = 'slow' | 'normal' | 'fast';
export type AuroraGlow = 'subtle' | 'medium' | 'strong' | 'none';
export type AuroraRadius = 'sm' | 'md' | 'lg' | 'xl';
export type AuroraAnimation = 'flow' | 'wave' | 'pulse';

const radiusMap: Record<AuroraRadius, { outer: string; inner: string; rx: number }> = {
  sm: { outer: 'rounded-xl', inner: 'rounded-[calc(0.75rem-2px)]', rx: 12 },
  md: { outer: 'rounded-2xl', inner: 'rounded-[calc(1rem-2px)]', rx: 16 },
  lg: { outer: 'rounded-3xl', inner: 'rounded-[calc(1.5rem-2px)]', rx: 24 },
  xl: { outer: 'rounded-[2rem]', inner: 'rounded-[calc(2rem-3px)]', rx: 32 },
};

const speedDurations: Record<AuroraSpeed, number> = {
  slow: 7.5,
  normal: 4.5,
  fast: 2.5,
};

const variantColorStops: Record<AuroraVariant, { s1: string; s2: string; s3: string; s4: string }> = {
  aurora: { s1: '#ffffff', s2: '#a1a1aa', s3: '#52525b', s4: '#ffffff' },
  ocean: { s1: '#e4e4e7', s2: '#a1a1aa', s3: '#71717a', s4: '#fafafa' },
  sunset: { s1: '#f4f4f5', s2: '#d4d4d8', s3: '#71717a', s4: '#ffffff' },
  forest: { s1: '#e4e4e7', s2: '#a1a1aa', s3: '#52525b', s4: '#ffffff' },
  cyber: { s1: '#ffffff', s2: '#a1a1aa', s3: '#3f3f46', s4: '#ffffff' },
  gold: { s1: '#f4f4f5', s2: '#d4d4d8', s3: '#71717a', s4: '#ffffff' },
  mono: { s1: '#ffffff', s2: '#d4d4d8', s3: '#71717a', s4: '#ffffff' },
};

const subtitleGradients: Record<AuroraVariant, string> = {
  aurora: 'text-foreground',
  ocean: 'text-foreground',
  sunset: 'text-foreground',
  forest: 'text-foreground',
  cyber: 'text-foreground',
  gold: 'text-foreground',
  mono: 'text-foreground',
};

export interface AuroraBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AuroraVariant;
  speed?: AuroraSpeed;
  glow?: AuroraGlow;
  borderWidth?: 1 | 2 | 3 | number;
  radius?: AuroraRadius;
  animation?: AuroraAnimation;
  title?: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
}

/**
 * AuroraBorderCard Component
 *
 * Displays a permanent visible border with a single, continuous traveling Aurora snake wave.
 * Crisp and luminous on both Light and Dark themes.
 */
export const AuroraBorderCard = React.forwardRef<HTMLDivElement, AuroraBorderCardProps>(
  (
    {
      variant = 'mono',
      speed = 'fast',
      glow = 'medium',
      borderWidth = 1,
      radius = 'xl',
      animation = 'flow',
      title = 'Beautiful Components',
      subtitle = 'For Modern Builders',
      description = 'Build stunning interfaces with premium animated components.',
      badgeText = 'NexoreUI',
      buttonText = 'Get Started',
      buttonHref,
      onButtonClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const duration = speedDurations[speed] || 2.5;
    const radiusConfig = radiusMap[radius] || radiusMap.xl;
    const colors = variantColorStops[variant] || variantColorStops.aurora;
    const id = React.useId().replace(/:/g, '');

    const glowOpacity = glow === 'none' ? 0 : glow === 'subtle' ? 0.35 : glow === 'medium' ? 0.65 : 0.9;

    return (
      <div
        ref={ref}
        className={cn(
          'relative isolate select-none group transition-all duration-300',
          radiusConfig.outer,
          className
        )}
        {...props}
      >
        {/* ─── SVG Single Traveling Snake Wave System ─── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dynamic Multi-Stop Gradient for the Snake */}
            <linearGradient id={`snake-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.s1} />
              <stop offset="35%" stopColor={colors.s2} />
              <stop offset="70%" stopColor={colors.s3} />
              <stop offset="100%" stopColor={colors.s4} />
            </linearGradient>

            {/* Glowing Aura Filter */}
            <filter id={`snake-glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ─── 1. Permanent Static Base Border (Always Visible in Light & Dark) ─── */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx={radiusConfig.rx}
            fill="none"
            className="stroke-zinc-300/90 dark:stroke-white/15"
            strokeWidth={borderWidth}
            vectorEffect="non-scaling-stroke"
          />

          {/* ─── 2. Single Traveling Snake Glow (Moves with the snake head) ─── */}
          {!shouldReduceMotion && glow !== 'none' && (
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={radiusConfig.rx}
              fill="none"
              pathLength={100}
              stroke={`url(#snake-grad-${id})`}
              strokeWidth={Math.max(borderWidth * 2.5, 3)}
              strokeDasharray="26 74"
              strokeLinecap="round"
              filter={`url(#snake-glow-${id})`}
              vectorEffect="non-scaling-stroke"
              opacity={glowOpacity}
              animate={{
                strokeDashoffset: [0, -100],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}

          {/* ─── 3. Single Traveling Aurora Snake (Main Wave Head & Body) ─── */}
          {!shouldReduceMotion ? (
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={radiusConfig.rx}
              fill="none"
              pathLength={100}
              stroke={`url(#snake-grad-${id})`}
              strokeWidth={Math.max(borderWidth * 1.5, 2)}
              strokeDasharray="26 74"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              animate={{
                strokeDashoffset: [0, -100],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ) : (
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={radiusConfig.rx}
              fill="none"
              stroke={`url(#snake-grad-${id})`}
              strokeWidth={borderWidth}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* ─── Inner Card Surface ─── */}
        <div
          className={cn(
            'relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-8 transition-colors duration-200',
            // Light Theme: Crisp pure white surface with dark text
            'bg-white text-zinc-900 shadow-xl shadow-zinc-950/5 border border-zinc-200/70',
            // Dark Theme: Deep sleek obsidian with white text
            'dark:bg-[#0c0d14] dark:text-zinc-100 dark:shadow-2xl dark:shadow-black/70 dark:border-white/5',
            radiusConfig.inner
          )}
        >
          {children ? (
            children
          ) : (
            <div className="flex flex-col h-full justify-between gap-6">
              {/* Top Header / Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-white/[0.06] dark:text-zinc-200 dark:border-white/10 backdrop-blur-md shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>{badgeText}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  {title}
                </h3>
                <h4
                  className={cn(
                    'text-xl sm:text-2xl font-bold tracking-tight text-foreground',
                    subtitleGradients[variant] || subtitleGradients.aurora
                  )}
                >
                  {subtitle}
                </h4>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed pt-1 max-w-md">
                  {description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {buttonHref ? (
                  <a
                    href={buttonHref}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-xs cursor-pointer"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onButtonClick}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-xs cursor-pointer"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

AuroraBorderCard.displayName = 'AuroraBorderCard';
