'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { ThinkingIndicator } from './thinking-indicator';

/**
 * CVA variants for the AgentStatusPill container
 */
const agentStatusPillVariants = cva(
  'inline-flex items-center rounded-full border transition-all duration-300 select-none relative isolate overflow-visible',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900/80 border-zinc-800 text-zinc-200 backdrop-blur-md shadow-sm',
        neon: 'bg-black/90 border-cyan-500/40 text-cyan-300 backdrop-blur-md shadow-[0_0_12px_rgba(0,240,255,0.15)]',
        glow: 'bg-zinc-950/90 border-amber-500/40 text-amber-200 backdrop-blur-md shadow-[0_0_12px_rgba(245,158,11,0.15)]',
        cyberpunk:
          'bg-black border-yellow-500/50 text-yellow-300 backdrop-blur-md shadow-[0_0_12px_rgba(250,204,21,0.2)] font-mono',
      },
      size: {
        sm: 'h-6 px-2 text-[11px] gap-1.5',
        md: 'h-7 px-2.5 text-xs gap-2',
        lg: 'h-8 px-3 text-sm gap-2.5',
      },
      status: {
        idle: '',
        thinking: '',
        running: '',
        success: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
        error: 'border-red-500/40 bg-red-950/20 text-red-300',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      status: 'idle',
    },
  }
);

/**
 * Props for the AgentStatusPill component
 */
export interface AgentStatusPillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof agentStatusPillVariants> {
  /**
   * Current operating status of the AI agent
   * @default "idle"
   */
  status?: 'idle' | 'thinking' | 'running' | 'success' | 'error';
  /**
   * Aesthetic color preset
   * @default "default"
   */
  variant?: 'default' | 'neon' | 'glow' | 'cyberpunk';
  /**
   * Component size scale
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether to display the text status label alongside the indicator
   * @default false
   */
  showLabel?: boolean;
  /**
   * Custom label text override
   */
  label?: React.ReactNode;
  /**
   * Adds an ambient radar/pulse ping ring for active attention
   * @default false
   */
  pulse?: boolean;
}

const defaultStatusLabels: Record<string, string> = {
  idle: 'Idle',
  thinking: 'Thinking...',
  running: 'Running',
  success: 'Completed',
  error: 'Failed',
};

const pulseColors: Record<string, string> = {
  default: 'bg-indigo-500/30',
  neon: 'bg-cyan-400/40',
  glow: 'bg-amber-400/40',
  cyberpunk: 'bg-yellow-400/40',
};

const idleDotColors: Record<string, string> = {
  default: 'bg-zinc-400/60 shadow-[0_0_6px_rgba(255,255,255,0.3)]',
  neon: 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]',
  glow: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
  cyberpunk: 'bg-yellow-400 shadow-[0_0_8px_#facc15]',
};

/**
 * AgentStatusPill Component
 *
 * Ultra-compact status descriptor for AI agents in toolbars, headers, and cards.
 * Integrates live thinking orbital animation, state icons, pulse ring, and custom labels.
 */
export const AgentStatusPill = React.forwardRef<HTMLDivElement, AgentStatusPillProps>(
  (
    {
      className,
      status = 'idle',
      variant = 'default',
      size = 'md',
      showLabel = false,
      label,
      pulse = false,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();

    const displayLabel = label ?? defaultStatusLabels[status || 'idle'];

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={`Agent status: ${status}`}
        className={cn(agentStatusPillVariants({ variant, size, status }), className)}
        {...props}
      >
        {/* Ambient Pulse Ring */}
        {pulse && !shouldReduceMotion && (
          <span
            className={cn(
              'absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40',
              pulseColors[variant || 'default']
            )}
          />
        )}

        {/* Dynamic Status Icon / Micro-Indicator */}
        <div className="relative flex items-center justify-center shrink-0">
          <AnimatePresence mode="wait">
            {(status === 'thinking' || status === 'running') && (
              <motion.div
                key="active-orb"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <div className="scale-75 origin-center">
                  <ThinkingIndicator variant={variant} size="sm" />
                </div>
              </motion.div>
            )}

            {status === 'idle' && (
              <motion.div
                key="idle-dot"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={cn('w-2 h-2 rounded-full', idleDotColors[variant || 'default'])}
              />
            )}

            {status === 'success' && (
              <motion.div
                key="success-check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              >
                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                key="error-x"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-red-500/20 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
              >
                <X className="w-2.5 h-2.5 stroke-[2.5]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Optional Label */}
        {showLabel && (
          <span className="font-medium tracking-tight whitespace-nowrap">{displayLabel}</span>
        )}
      </div>
    );
  }
);

AgentStatusPill.displayName = 'AgentStatusPill';
export { agentStatusPillVariants };
