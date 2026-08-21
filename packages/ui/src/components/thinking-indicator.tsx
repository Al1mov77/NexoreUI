'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../utils/cn';

/**
 * CVA variants for the ThinkingIndicator container and typography styles
 */
const thinkingIndicatorVariants = cva(
  'inline-flex items-center gap-3.5 transition-all select-none',
  {
    variants: {
      variant: {
        default: 'text-zinc-200',
        neon: 'text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]',
        glow: 'text-amber-200 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]',
        cyberpunk: 'text-yellow-300 font-mono',
      },
      size: {
        sm: 'text-xs gap-2.5',
        md: 'text-sm gap-3.5',
        lg: 'text-base gap-4.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Props for the ThinkingIndicator component
 */
export interface ThinkingIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof thinkingIndicatorVariants> {
  /**
   * Visual aesthetic preset for orbital particle colors, aura glow, and typography
   * @default "default"
   */
  variant?: 'default' | 'neon' | 'glow' | 'cyberpunk';
  /**
   * Physical dimensions of the unified orb container:
   * - 'sm': 32px orb
   * - 'md': 48px orb
   * - 'lg': 64px orb
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional text label displayed alongside the glowing orb
   * @default undefined
   */
  label?: React.ReactNode;
  /**
   * Whether to animate the label with a subtle brightness breathing cycle
   * @default true
   */
  shimmerLabel?: boolean;
  /**
   * Custom speed multiplier for the rotation and hue-shift cycles
   * @default "normal"
   */
  speed?: 'slow' | 'normal' | 'fast';
}

// Geometric scale tokens according to exact spec: sm=32px, md=48px, lg=64px
const sizeConfig = {
  sm: {
    orbBox: 'w-8 h-8', // 32px
    baseBlur: 'w-8 h-8 blur-[10px]',
    orbitRadius: 10,
    dotSize: 'w-1.5 h-1.5', // ~6px
    coreSize: 'w-2 h-2', // ~8px
    glowRadius: '8px',
  },
  md: {
    orbBox: 'w-12 h-12', // 48px
    baseBlur: 'w-12 h-12 blur-[14px]',
    orbitRadius: 15,
    dotSize: 'w-2 h-2', // ~8px
    coreSize: 'w-3 h-3', // ~12px
    glowRadius: '12px',
  },
  lg: {
    orbBox: 'w-16 h-16', // 64px
    baseBlur: 'w-16 h-16 blur-[18px]',
    orbitRadius: 20,
    dotSize: 'w-2.5 h-2.5', // ~10px
    coreSize: 'w-4 h-4', // ~16px
    glowRadius: '16px',
  },
};

// Cycle durations in seconds
const speedConfig = {
  slow: { baseRotate: 6.0, orbitRotate: 5.0, corePulse: 3.5, hueShift: 8.0 },
  normal: { baseRotate: 4.0, orbitRotate: 3.2, corePulse: 2.4, hueShift: 6.0 },
  fast: { baseRotate: 2.4, orbitRotate: 1.8, corePulse: 1.5, hueShift: 3.8 },
};

/**
 * Conic gradient and optical themes for the unified Orb
 */
const variantThemes = {
  default: {
    // Ethereal Indigo-Cyan-Pink-Violet nebula
    conicGradient: 'conic-gradient(from 0deg, #6366f1, #06b6d4, #ec4899, #8b5cf6, #6366f1)',
    coreGradient: 'radial-gradient(circle, #ffffff 0%, #38bdf8 40%, #6366f1 80%, transparent 100%)',
    coreShadow: '0 0 16px rgba(56, 189, 248, 0.9), 0 0 30px rgba(99, 102, 241, 0.6)',
    dotGradient: 'bg-gradient-to-tr from-indigo-400 via-cyan-300 to-white shadow-[0_0_10px_rgba(6,182,212,0.9)]',
    labelClass: 'text-zinc-200 font-medium tracking-tight',
  },
  neon: {
    // High-contrast electric cyan, laser magenta, neon lime
    conicGradient: 'conic-gradient(from 0deg, #00f0ff, #ff007f, #39ff14, #00f0ff)',
    coreGradient: 'radial-gradient(circle, #ffffff 0%, #00f0ff 45%, #ff007f 85%, transparent 100%)',
    coreShadow: '0 0 20px #00f0ff, 0 0 35px rgba(255, 0, 127, 0.7)',
    dotGradient: 'bg-cyan-300 shadow-[0_0_12px_#00f0ff,0_0_20px_#00f0ff]',
    labelClass: 'text-cyan-300 font-mono font-semibold uppercase tracking-wider drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]',
  },
  glow: {
    // Warm celestial amber, golden orange, coral peach
    conicGradient: 'conic-gradient(from 0deg, #f59e0b, #fb7185, #fbbf24, #ea580c, #f59e0b)',
    coreGradient: 'radial-gradient(circle, #ffffff 0%, #fde047 35%, #f59e0b 75%, transparent 100%)',
    coreShadow: '0 0 20px rgba(251, 191, 36, 0.95), 0 0 35px rgba(245, 158, 11, 0.65)',
    dotGradient: 'bg-gradient-to-tr from-amber-300 to-yellow-100 shadow-[0_0_12px_rgba(251,191,36,0.9)]',
    labelClass: 'text-amber-200 font-medium tracking-tight drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]',
  },
  cyberpunk: {
    // Laser yellow, crimson red, matrix cyan
    conicGradient: 'conic-gradient(from 0deg, #facc15, #f43f5e, #06b6d4, #facc15)',
    coreGradient: 'radial-gradient(circle, #ffffff 0%, #facc15 40%, #f43f5e 80%, transparent 100%)',
    coreShadow: '0 0 18px #facc15, 0 0 30px rgba(244, 63, 94, 0.8)',
    dotGradient: 'bg-yellow-300 shadow-[0_0_10px_#facc15,0_0_18px_rgba(250,204,21,0.8)]',
    labelClass: 'text-yellow-300 font-mono uppercase tracking-widest text-[11px] px-2 py-0.5 rounded bg-yellow-950/40 border border-yellow-500/40 shadow-[0_0_10px_rgba(250,204,21,0.3)]',
  },
};

/**
 * ThinkingIndicator Component
 *
 * A unified "Orb-style" AI status indicator inspired by Siri and Vercel v0.
 * Features a rotating conic-gradient base blur, synchronized 3-dot orbital constellation (120° apart),
 * a high-glow central anchor core, and continuous full-composition hue-rotation.
 */
export const ThinkingIndicator = React.forwardRef<HTMLDivElement, ThinkingIndicatorProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      label,
      shimmerLabel = true,
      speed = 'normal',
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();

    const currentSize = sizeConfig[size || 'md'];
    const currentSpeed = speedConfig[speed || 'normal'];
    const theme = variantThemes[variant || 'default'];

    return (
      <div
        ref={ref}
        role="status"
        aria-label={typeof label === 'string' ? label : 'AI is thinking'}
        aria-live="polite"
        className={cn(thinkingIndicatorVariants({ variant, size }), className)}
        {...props}
      >
        {/* Full Composition Container with Global Continuous Hue Shift */}
        <motion.div
          aria-hidden="true"
          className={cn(
            'relative flex items-center justify-center shrink-0 isolate',
            currentSize.orbBox
          )}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
              }
          }
          transition={{
            duration: currentSpeed.hueShift,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Layer 1 (Base Aura): Rotating Conic-Gradient with Large Blur */}
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full pointer-events-none opacity-50',
              currentSize.baseBlur
            )}
            style={{
              background: theme.conicGradient,
            }}
            animate={
              shouldReduceMotion
                ? { opacity: [0.35, 0.65, 0.35] }
                : {
                  rotate: 360,
                  scale: [0.92, 1.08, 0.92],
                  opacity: [0.45, 0.65, 0.45],
                }
            }
            transition={{
              rotate: {
                duration: currentSpeed.baseRotate,
                repeat: Infinity,
                ease: 'linear',
              },
              scale: {
                duration: currentSpeed.corePulse,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              opacity: {
                duration: currentSpeed.corePulse,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          />

          {/* Layer 2 (Orbit Constellation): 3 Dots at 120° Rotating Synchronously as a Single Unit */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                  rotate: 360,
                }
            }
            transition={{
              duration: currentSpeed.orbitRotate,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[0, 120, 240].map((angle, idx) => (
              <div
                key={angle}
                className="absolute flex items-center justify-center"
                style={{
                  transform: `rotate(${angle}deg) translateX(${currentSize.orbitRadius}px)`,
                }}
              >
                {/* Pulsing individual dot with phase offset */}
                <motion.div
                  className={cn(
                    'rounded-full transform-gpu',
                    currentSize.dotSize,
                    theme.dotGradient
                  )}
                  animate={
                    shouldReduceMotion
                      ? { opacity: [0.5, 1, 0.5] }
                      : {
                        scale: [0.85, 1.25, 0.85],
                        opacity: [0.8, 1, 0.8],
                      }
                  }
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: idx * 0.4,
                  }}
                />
              </div>
            ))}
          </motion.div>

          {/* Layer 3 (Core Anchor): High-Intensity Central Blur Nucleus */}
          <motion.div
            className={cn(
              'rounded-full pointer-events-none z-10',
              currentSize.coreSize
            )}
            style={{
              background: theme.coreGradient,
              boxShadow: theme.coreShadow,
            }}
            animate={
              shouldReduceMotion
                ? { opacity: [0.6, 1, 0.6] }
                : {
                  scale: [0.88, 1.14, 0.88],
                  opacity: [0.85, 1, 0.85],
                }
            }
            transition={{
              duration: currentSpeed.corePulse,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Integrated Label with Synchronized Glow / Shimmer */}
        {label && (
          <motion.div
            className={cn('inline-block select-none', theme.labelClass)}
            animate={
              shouldReduceMotion || !shimmerLabel
                ? undefined
                : {
                  opacity: [0.8, 1, 0.8],
                }
            }
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {label}
          </motion.div>
        )}
      </div>
    );
  }
);

ThinkingIndicator.displayName = 'ThinkingIndicator';
