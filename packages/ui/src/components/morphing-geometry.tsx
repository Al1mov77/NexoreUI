'use client';

import * as React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

export type MorphingShape = 'pill' | 'circle' | 'square' | 'squircle' | 'custom';
export type MorphingVariant = 'gradient' | 'aurora' | 'neon' | 'glass' | 'outline' | 'subtle';
export type MorphingColor = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'rainbow' | 'mono';
export type MorphingSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom';

export interface MorphingGeometryProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  shape?: MorphingShape;
  radius?: number | string;
  variant?: MorphingVariant;
  color?: MorphingColor;
  size?: MorphingSize;
  dimension?: number;
  spin?: boolean;
  spinDuration?: number;
  interactive?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const sizeMap: Record<MorphingSize, string> = {
  sm: 'w-16 h-16 text-xs',
  md: 'w-24 h-24 text-sm',
  lg: 'w-32 h-32 text-base',
  xl: 'w-44 h-44 text-lg',
  custom: '',
};

const shapeRadiusMap: Record<MorphingShape, string> = {
  pill: '9999px',
  circle: '50%',
  square: '0px',
  squircle: '28%',
  custom: '16px',
};

const colorGradients: Record<MorphingColor, { bg: string; border: string; glow: string; text: string }> = {
  violet: {
    bg: 'from-zinc-900 via-zinc-800 to-zinc-700 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300',
    border: 'border-border',
    glow: 'rgba(113, 113, 122, 0.3)',
    text: 'text-primary-foreground',
  },
  cyan: {
    bg: 'from-sky-500 via-cyan-600 to-blue-600',
    border: 'border-sky-500/40',
    glow: 'rgba(6, 182, 212, 0.35)',
    text: 'text-white',
  },
  emerald: {
    bg: 'from-emerald-500 via-green-600 to-teal-600',
    border: 'border-emerald-500/40',
    glow: 'rgba(16, 185, 129, 0.35)',
    text: 'text-white',
  },
  rose: {
    bg: 'from-rose-500 via-red-500 to-amber-500',
    border: 'border-rose-500/40',
    glow: 'rgba(244, 63, 94, 0.35)',
    text: 'text-white',
  },
  amber: {
    bg: 'from-amber-400 via-orange-500 to-amber-600',
    border: 'border-amber-400/40',
    glow: 'rgba(245, 158, 11, 0.35)',
    text: 'text-white',
  },
  rainbow: {
    bg: 'from-zinc-800 via-zinc-600 to-zinc-900 dark:from-zinc-200 dark:via-zinc-400 dark:to-zinc-100',
    border: 'border-border',
    glow: 'rgba(113, 113, 122, 0.25)',
    text: 'text-primary-foreground',
  },
  mono: {
    bg: 'from-zinc-900 via-zinc-800 to-zinc-950',
    border: 'border-zinc-700',
    glow: 'rgba(0, 0, 0, 0.2)',
    text: 'text-white',
  },
};

export const MorphingGeometry = React.forwardRef<HTMLDivElement, MorphingGeometryProps>(
  (
    {
      shape = 'circle',
      radius,
      variant = 'gradient',
      color = 'violet',
      size = 'md',
      dimension,
      spin = false,
      spinDuration = 12,
      interactive = false,
      glow = false,
      icon,
      children,
      className,
      style,
      onClick,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const [currentShape, setCurrentShape] = React.useState<MorphingShape>(shape);

    React.useEffect(() => {
      setCurrentShape(shape);
    }, [shape]);

    const handleInteractiveClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) {
        const shapesList: MorphingShape[] = ['square', 'squircle', 'circle', 'pill'];
        const nextIdx = (shapesList.indexOf(currentShape) + 1) % shapesList.length;
        setCurrentShape(shapesList[nextIdx]);
      }
      onClick?.(e);
    };

    const colorScheme = colorGradients[color] || colorGradients.violet;
    const computedRadius = radius !== undefined
      ? typeof radius === 'number' ? `${radius}px` : radius
      : shapeRadiusMap[currentShape];

    const customDimensionStyle: React.CSSProperties = size === 'custom' && dimension
      ? { width: `${dimension}px`, height: `${dimension}px` }
      : {};

    const glowStyle: React.CSSProperties = glow
      ? { boxShadow: `0 12px 36px -4px ${colorScheme.glow}` }
      : {};

    let variantClasses = '';
    if (variant === 'gradient') {
      variantClasses = `bg-linear-to-tr ${colorScheme.bg} border ${colorScheme.border} ${colorScheme.text}`;
    } else if (variant === 'aurora') {
      variantClasses = `bg-linear-to-tr ${colorScheme.bg} border-2 border-white/40 shadow-2xl ${colorScheme.text}`;
    } else if (variant === 'neon') {
      variantClasses = `bg-black/90 border-2 ${colorScheme.border} ${colorScheme.text}`;
    } else if (variant === 'glass') {
      variantClasses = `bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 text-foreground`;
    } else if (variant === 'outline') {
      variantClasses = `bg-transparent border-2 ${colorScheme.border} text-foreground`;
    } else if (variant === 'subtle') {
      variantClasses = `bg-muted/60 border border-border text-foreground`;
    }

    const shouldSpin = spin && !shouldReduceMotion;

    return (
      <motion.div
        ref={ref}
        animate={shouldSpin ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }}
        transition={{
          rotate: {
            duration: spinDuration,
            repeat: Infinity,
            ease: 'linear',
          },
          borderRadius: { duration: shouldReduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] },
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleInteractiveClick}
        className={cn(
          'relative flex items-center justify-center select-none overflow-hidden transition-all duration-300',
          sizeMap[size],
          variantClasses,
          interactive ? 'cursor-pointer' : '',
          className
        )}
        style={{
          borderRadius: computedRadius,
          ...glowStyle,
          ...customDimensionStyle,
          ...style,
        }}
        {...props}
      >
        <div className="absolute inset-0 bg-linear-to-b from-white/25 via-transparent to-black/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
          {icon || (children ? children : <div className="w-5 h-5 rounded-full border-2 border-current opacity-80" />)}
        </div>
      </motion.div>
    );
  }
);

MorphingGeometry.displayName = 'MorphingGeometry';
export default MorphingGeometry;
