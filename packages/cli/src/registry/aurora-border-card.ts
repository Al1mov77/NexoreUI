export const auroraBorderCard = {
  name: "aurora-border-card",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion",
  "lucide-react"
],
  
  fileName: "aurora-border-card.tsx",
  content: `'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
  aurora: { s1: '#38bdf8', s2: '#818cf8', s3: '#2dd4bf', s4: '#38bdf8' },
  ocean: { s1: '#0284c7', s2: '#38bdf8', s3: '#0ea5e9', s4: '#7dd3fc' },
  sunset: { s1: '#f97316', s2: '#f59e0b', s3: '#ef4444', s4: '#fb923c' },
  forest: { s1: '#10b981', s2: '#14b8a6', s3: '#059669', s4: '#34d399' },
  cyber: { s1: '#06b6d4', s2: '#3b82f6', s3: '#6366f1', s4: '#22d3ee' },
  gold: { s1: '#d97706', s2: '#f59e0b', s3: '#eab308', s4: '#fbbf24' },
  mono: { s1: 'var(--foreground)', s2: 'var(--muted-foreground)', s3: 'var(--border)', s4: 'var(--foreground)' },
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

export const AuroraBorderCard = React.forwardRef<HTMLDivElement, AuroraBorderCardProps>(
  (
    {
      variant = 'mono',
      speed = 'fast',
      glow = 'medium',
      borderWidth = 1,
      radius = 'xl',
      animation = 'flow',
      title = 'Interface Component',
      subtitle = 'Adaptive Geometry',
      description = 'Production component container with hardware-accelerated perimeter illumination.',
      badgeText,
      buttonText = 'Explore',
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
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={\`snake-grad-\${id}\`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.s1} />
              <stop offset="35%" stopColor={colors.s2} />
              <stop offset="70%" stopColor={colors.s3} />
              <stop offset="100%" stopColor={colors.s4} />
            </linearGradient>

            <filter id={\`ambient-blur-\${id}\`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={glow === 'strong' ? 14 : glow === 'medium' ? 9 : 5} />
            </filter>
          </defs>

          {glowOpacity > 0 && !shouldReduceMotion && (
            <motion.rect
              x={borderWidth}
              y={borderWidth}
              width={\`calc(100% - \${borderWidth * 2}px)\`}
              height={\`calc(100% - \${borderWidth * 2}px)\`}
              rx={radiusConfig.rx}
              ry={radiusConfig.rx}
              fill="none"
              stroke={\`url(#snake-grad-\${id})\`}
              strokeWidth={borderWidth * 2.5}
              strokeDasharray={animation === 'pulse' ? '1000 0' : animation === 'wave' ? '260 740' : '160 840'}
              strokeLinecap="round"
              filter={\`url(#ambient-blur-\${id})\`}
              style={{ opacity: glowOpacity }}
              animate={
                animation === 'pulse'
                  ? { opacity: [glowOpacity * 0.35, glowOpacity, glowOpacity * 0.35] }
                  : { strokeDashoffset: animation === 'wave' ? [0, -500, -1000] : [0, -1000] }
              }
              transition={{
                duration,
                repeat: Infinity,
                ease: animation === 'wave' ? 'easeInOut' : 'linear',
              }}
            />
          )}

          {!shouldReduceMotion ? (
            <motion.rect
              x={borderWidth / 2}
              y={borderWidth / 2}
              width={\`calc(100% - \${borderWidth}px)\`}
              height={\`calc(100% - \${borderWidth}px)\`}
              rx={radiusConfig.rx}
              ry={radiusConfig.rx}
              fill="none"
              stroke={\`url(#snake-grad-\${id})\`}
              strokeWidth={borderWidth}
              strokeDasharray={animation === 'pulse' ? '1000 0' : animation === 'wave' ? '260 740' : '180 820'}
              strokeLinecap="round"
              className="opacity-95 dark:opacity-100"
              animate={
                animation === 'pulse'
                  ? { opacity: [0.35, 1, 0.35] }
                  : { strokeDashoffset: animation === 'wave' ? [0, -500, -1000] : [0, -1000] }
              }
              transition={{
                duration,
                repeat: Infinity,
                ease: animation === 'wave' ? 'easeInOut' : 'linear',
              }}
            />
          ) : (
            <rect
              x={borderWidth / 2}
              y={borderWidth / 2}
              width={\`calc(100% - \${borderWidth}px)\`}
              height={\`calc(100% - \${borderWidth}px)\`}
              rx={radiusConfig.rx}
              ry={radiusConfig.rx}
              fill="none"
              stroke="var(--border)"
              strokeWidth={borderWidth}
            />
          )}
        </svg>

        <div
          className={cn(
            'relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-8 transition-colors duration-200',
            'bg-card text-card-foreground shadow-sm border border-border/70',
            radiusConfig.inner
          )}
        >
          {children ? (
            children
          ) : (
            <div className="flex flex-col h-full justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
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
                <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed pt-1 max-w-md">
                  {description}
                </p>
              </div>

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
`
};
