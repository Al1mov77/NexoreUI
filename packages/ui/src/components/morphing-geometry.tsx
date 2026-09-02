'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

export type MorphingShape = 'pill' | 'circle' | 'square' | 'squircle' | 'custom';
export type MorphingVariant = 'gradient' | 'aurora' | 'neon' | 'glass' | 'outline' | 'subtle';
export type MorphingColor = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'rainbow' | 'mono';
export type MorphingSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom';

export interface MorphingGeometryProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Shape geometry preset */
  shape?: MorphingShape;
  /** Explicit corner radius (in pixels or css string) when shape is custom or morphed */
  radius?: number | string;
  /** Visual surface variant style */
  variant?: MorphingVariant;
  /** Color theme palette */
  color?: MorphingColor;
  /** Standardized size preset */
  size?: MorphingSize;
  /** Custom width/height dimension in pixels if size is 'custom' */
  dimension?: number;
  /** Whether the geometry undergoes continuous slow rotation */
  spin?: boolean;
  /** Spin duration in seconds */
  spinDuration?: number;
  /** Whether clicking morphs the shape dynamically */
  interactive?: boolean;
  /** Ambient box-shadow glow intensity */
  glow?: boolean;
  /** Icon or graphic to display centered within the shape */
  icon?: React.ReactNode;
  /** Content rendered inside the morphing shape */
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
    bg: 'from-violet-600 via-purple-600 to-indigo-700',
    border: 'border-violet-400/40',
    glow: 'rgba(139, 92, 246, 0.45)',
    text: 'text-white',
  },
  cyan: {
    bg: 'from-cyan-500 via-teal-500 to-blue-600',
    border: 'border-cyan-400/40',
    glow: 'rgba(6, 182, 212, 0.45)',
    text: 'text-white',
  },
  emerald: {
    bg: 'from-emerald-500 via-green-600 to-teal-700',
    border: 'border-emerald-400/40',
    glow: 'rgba(16, 185, 129, 0.45)',
    text: 'text-white',
  },
  rose: {
    bg: 'from-rose-500 via-pink-600 to-red-600',
    border: 'border-rose-400/40',
    glow: 'rgba(244, 63, 94, 0.45)',
    text: 'text-white',
  },
  amber: {
    bg: 'from-amber-500 via-orange-600 to-yellow-600',
    border: 'border-amber-400/40',
    glow: 'rgba(245, 158, 11, 0.45)',
    text: 'text-white',
  },
  rainbow: {
    bg: 'from-violet-500 via-pink-500 via-amber-400 to-cyan-400',
    border: 'border-white/30',
    glow: 'rgba(236, 72, 153, 0.45)',
    text: 'text-white',
  },
  mono: {
    bg: 'from-zinc-800 via-zinc-900 to-black dark:from-zinc-100 dark:via-zinc-200 dark:to-white',
    border: 'border-zinc-700 dark:border-zinc-300',
    glow: 'rgba(113, 113, 122, 0.3)',
    text: 'text-white dark:text-zinc-900',
  },
};

/**
 * MorphingGeometry Component
 *
 * An interactive geometric entity with fluid corner transitions, dynamic physics,
 * luminous glow, and continuous ambient rotational states.
 */
export const MorphingGeometry = React.forwardRef<HTMLDivElement, MorphingGeometryProps>(
  (
    {
      shape = 'squircle',
      radius,
      variant = 'gradient',
      color = 'violet',
      size = 'md',
      dimension,
      spin = false,
      spinDuration = 6,
      interactive = false,
      glow = true,
      icon,
      children,
      className,
      style,
      onClick,
      ...props
    },
    ref
  ) => {
    const [currentShape, setCurrentShape] = React.useState<MorphingShape>(shape);
    const [isHovered, setIsHovered] = React.useState(false);

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
      variantClasses = `bg-gradient-to-tr ${colorScheme.bg} border ${colorScheme.border} ${colorScheme.text}`;
    } else if (variant === 'aurora') {
      variantClasses = `bg-gradient-to-tr ${colorScheme.bg} border-2 border-white/40 shadow-2xl ${colorScheme.text}`;
    } else if (variant === 'neon') {
      variantClasses = `bg-black/90 border-2 ${colorScheme.border} ${colorScheme.text}`;
    } else if (variant === 'glass') {
      variantClasses = `bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 text-foreground`;
    } else if (variant === 'outline') {
      variantClasses = `bg-transparent border-2 ${colorScheme.border} ${colorScheme.text}`;
    } else if (variant === 'subtle') {
      variantClasses = `bg-muted/60 border border-border text-foreground`;
    }

    return (
      <motion.div
        ref={ref}
        animate={spin ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }}
        transition={{
          rotate: {
            duration: spinDuration,
            repeat: Infinity,
            ease: 'linear',
          },
          borderRadius: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
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
        {/* Specular ambient surface highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/20 pointer-events-none" />

        {/* Content / Icon Slot */}
        <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
          {icon || (children ? children : <Sparkles className="w-6 h-6 drop-shadow-md" />)}
        </div>
      </motion.div>
    );
  }
);

MorphingGeometry.displayName = 'MorphingGeometry';
export default MorphingGeometry;
