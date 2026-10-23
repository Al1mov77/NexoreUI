'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { NexoreMakeElement, CanvasSettings } from '../types';
import { isLightColor, isDarkColor } from '../utils/colorUtils';

export type RenderMode = 'edit' | 'preview' | 'static';

export function normalizeUnit(
  value: string | number | undefined,
  unit: 'px' | 'deg' | '%'
): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') {
    return `${value}${unit}`;
  }
  const trimmed = String(value).trim();
  if (!trimmed || trimmed === 'none' || trimmed === 'normal') return trimmed;
  if (
    trimmed.endsWith('px') ||
    trimmed.endsWith('deg') ||
    trimmed.endsWith('%') ||
    trimmed.endsWith('rem') ||
    trimmed.endsWith('em') ||
    trimmed.endsWith('vw') ||
    trimmed.endsWith('vh') ||
    trimmed.endsWith('turn') ||
    trimmed.endsWith('rad')
  ) {
    // Strip accidental doubled units such as "10degdeg" or "4pxpx"
    return trimmed
      .replace(/degdeg$/i, 'deg')
      .replace(/pxpx$/i, 'px')
      .replace(/%%$/, '%');
  }
  const num = parseFloat(trimmed);
  if (!Number.isNaN(num)) {
    return `${num}${unit}`;
  }
  return trimmed;
}

export function computeElementStyles(
  el: NexoreMakeElement,
  isLight = false
): React.CSSProperties {
  const mergedStyles: React.CSSProperties = { ...el.styles };

  if (
    mergedStyles.borderWidth &&
    mergedStyles.borderWidth !== '0px' &&
    mergedStyles.borderWidth !== '0'
  ) {
    if (!mergedStyles.borderStyle || mergedStyles.borderStyle === 'none') {
      mergedStyles.borderStyle = 'solid';
    }
  }

  if (el.styles.backgroundGradient && el.styles.backgroundGradient !== 'none') {
    mergedStyles.background = el.styles.backgroundGradient;
    delete mergedStyles.backgroundColor;
  }

  const transforms: string[] = [];
  if (el.styles.rotate && el.styles.rotate !== '0' && el.styles.rotate !== '0deg') {
    const rot = normalizeUnit(el.styles.rotate, 'deg');
    if (rot) transforms.push(`rotate(${rot})`);
  }
  if (
    (el.styles.scaleX && el.styles.scaleX !== '1') ||
    (el.styles.scaleY && el.styles.scaleY !== '1')
  ) {
    transforms.push(`scale(${el.styles.scaleX || 1}, ${el.styles.scaleY || 1})`);
  }
  if (transforms.length > 0) {
    mergedStyles.transform = transforms.join(' ');
  }

  const filters: string[] = [];
  if (el.styles.blur && el.styles.blur !== '0' && el.styles.blur !== '0px') {
    const b = normalizeUnit(el.styles.blur, 'px');
    if (b) filters.push(`blur(${b})`);
  }
  if (el.styles.saturate && el.styles.saturate !== '100' && el.styles.saturate !== '100%') {
    const s = normalizeUnit(el.styles.saturate, '%');
    if (s) filters.push(`saturate(${s})`);
  }
  if (el.styles.brightness && el.styles.brightness !== '100' && el.styles.brightness !== '100%') {
    const br = normalizeUnit(el.styles.brightness, '%');
    if (br) filters.push(`brightness(${br})`);
  }
  if (el.styles.contrast && el.styles.contrast !== '100' && el.styles.contrast !== '100%') {
    const c = normalizeUnit(el.styles.contrast, '%');
    if (c) filters.push(`contrast(${c})`);
  }
  if (filters.length > 0) {
    mergedStyles.filter = filters.join(' ');
  }

  const bdFilters: string[] = [];
  if (
    el.styles.backdropBlur &&
    el.styles.backdropBlur !== '0' &&
    el.styles.backdropBlur !== '0px'
  ) {
    const bb = normalizeUnit(el.styles.backdropBlur, 'px');
    if (bb) bdFilters.push(`blur(${bb})`);
  }
  if (
    el.styles.backdropSaturate &&
    el.styles.backdropSaturate !== '100' &&
    el.styles.backdropSaturate !== '100%'
  ) {
    const bs = normalizeUnit(el.styles.backdropSaturate, '%');
    if (bs) bdFilters.push(`saturate(${bs})`);
  }
  if (bdFilters.length > 0) {
    mergedStyles.backdropFilter = bdFilters.join(' ');
    mergedStyles.WebkitBackdropFilter = bdFilters.join(' ');
  }

  if (el.styles.letterSpacing) {
    mergedStyles.letterSpacing = normalizeUnit(el.styles.letterSpacing, 'px');
  }
  if (el.styles.lineHeight) {
    mergedStyles.lineHeight = String(el.styles.lineHeight);
  }

  if (
    el.styles.paddingTop ||
    el.styles.paddingRight ||
    el.styles.paddingBottom ||
    el.styles.paddingLeft
  ) {
    mergedStyles.padding = `${normalizeUnit(el.styles.paddingTop, 'px') || '0px'} ${
      normalizeUnit(el.styles.paddingRight, 'px') || '0px'
    } ${normalizeUnit(el.styles.paddingBottom, 'px') || '0px'} ${
      normalizeUnit(el.styles.paddingLeft, 'px') || '0px'
    }`;
  }

  if (
    el.styles.marginTop ||
    el.styles.marginRight ||
    el.styles.marginBottom ||
    el.styles.marginLeft
  ) {
    mergedStyles.margin = `${normalizeUnit(el.styles.marginTop, 'px') || '0px'} ${
      normalizeUnit(el.styles.marginRight, 'px') || '0px'
    } ${normalizeUnit(el.styles.marginBottom, 'px') || '0px'} ${
      normalizeUnit(el.styles.marginLeft, 'px') || '0px'
    }`;
  }

  if (el.styles.cursor) mergedStyles.cursor = el.styles.cursor;
  if (el.styles.overflow) mergedStyles.overflow = el.styles.overflow;

  if (el.styles.textDecoration && el.styles.textDecoration !== 'none') {
    mergedStyles.textDecoration = el.styles.textDecoration;
  }
  if (el.styles.textTransform && el.styles.textTransform !== 'none') {
    mergedStyles.textTransform = el.styles.textTransform;
  }
  if (el.styles.fontStyle && el.styles.fontStyle !== 'normal') {
    mergedStyles.fontStyle = el.styles.fontStyle;
  }
  if (el.styles.wordSpacing) mergedStyles.wordSpacing = el.styles.wordSpacing;
  if (el.styles.textShadow && el.styles.textShadow !== 'none') {
    mergedStyles.textShadow = el.styles.textShadow;
  }

  if (el.styles.borderRadiusTopLeft) {
    mergedStyles.borderTopLeftRadius = normalizeUnit(el.styles.borderRadiusTopLeft, 'px');
  }
  if (el.styles.borderRadiusTopRight) {
    mergedStyles.borderTopRightRadius = normalizeUnit(el.styles.borderRadiusTopRight, 'px');
  }
  if (el.styles.borderRadiusBottomLeft) {
    mergedStyles.borderBottomLeftRadius = normalizeUnit(el.styles.borderRadiusBottomLeft, 'px');
  }
  if (el.styles.borderRadiusBottomRight) {
    mergedStyles.borderBottomRightRadius = normalizeUnit(el.styles.borderRadiusBottomRight, 'px');
  }

  if (el.styles.outlineWidth && el.styles.outlineWidth !== '0px' && el.styles.outlineWidth !== '0') {
    mergedStyles.outline = `${normalizeUnit(el.styles.outlineWidth, 'px')} ${
      el.styles.outlineStyle || 'solid'
    } ${el.styles.outlineColor || '#71717a'}`;
    if (el.styles.outlineOffset) {
      mergedStyles.outlineOffset = normalizeUnit(el.styles.outlineOffset, 'px');
    }
  }
  if (el.styles.mixBlendMode && el.styles.mixBlendMode !== 'normal') {
    mergedStyles.mixBlendMode = el.styles.mixBlendMode;
  }

  // Contrast protection: ensure text and icons are always clearly visible against their background
  const bgVal = String(mergedStyles.backgroundColor || '').trim();
  const hasExplicitBg =
    bgVal &&
    bgVal !== 'transparent' &&
    bgVal !== 'rgba(0, 0, 0, 0)' &&
    bgVal !== 'rgba(0,0,0,0)';

  const surfaceIsLight = hasExplicitBg ? isLightColor(bgVal) : isLight;
  const currentColor = String(mergedStyles.color || '').trim();

  if (surfaceIsLight) {
    if (!currentColor || isLightColor(currentColor)) {
      mergedStyles.color = '#09090b';
    }
  } else {
    if (!currentColor || isDarkColor(currentColor)) {
      mergedStyles.color = '#fafafa';
    }
  }

  return mergedStyles;
}

function resolveLucideIcon(
  iconName?: string,
  fallback: React.ComponentType<{ size?: number; className?: string; color?: string }> = LucideIcons.Box
): React.ComponentType<{ size?: number; className?: string; color?: string }> {
  if (!iconName) return fallback;
  const iconsMap = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ size?: number; className?: string; color?: string }>
  >;
  return iconsMap[iconName] || fallback;
}

export interface ElementRendererProps {
  element: NexoreMakeElement;
  mode?: RenderMode;
  isLight?: boolean;
  isSelected?: boolean;
}

export default function ElementRenderer({
  element: el,
  mode = 'edit',
  isLight,
}: ElementRendererProps) {
  const isDocLight =
    typeof document !== 'undefined' &&
    !document.documentElement.classList.contains('dark');
  const effectiveIsLight = isLight !== undefined ? isLight : isDocLight;
  const mergedStyles = computeElementStyles(el, effectiveIsLight);
  const isInteractive = mode === 'preview';
  const baseClasses = `w-full h-full select-none flex items-center justify-center overflow-hidden transition-shadow ${
    el.animationPreset === 'spin' ? 'animate-spin' : ''
  } ${el.disabled ? 'opacity-50 pointer-events-none' : ''}`;

  switch (el.type) {
    case 'button': {
      let variantClasses = '';
      if (el.variant === 'outline') {
        variantClasses = 'border border-zinc-700 text-zinc-100 bg-transparent';
      } else if (el.variant === 'ghost') {
        variantClasses = 'bg-transparent hover:bg-zinc-800/60 text-zinc-200';
      } else if (el.variant === 'destructive') {
        variantClasses = 'bg-red-600 text-white border-none';
      } else if (el.variant === 'secondary') {
        variantClasses = 'bg-zinc-800 text-zinc-100 border border-zinc-700';
      } else if (el.variant === 'link') {
        variantClasses = 'bg-transparent text-zinc-100 underline border-none';
      }

      let sizeClasses = '';
      if (el.sizeVariant === 'sm') sizeClasses = 'text-xs px-2.5 py-1';
      else if (el.sizeVariant === 'lg') sizeClasses = 'text-base px-6 py-3';
      else if (el.sizeVariant === 'icon') sizeClasses = 'p-2 rounded-lg aspect-square';

      return (
        <button
          type="button"
          disabled={el.disabled}
          className={`${baseClasses} ${variantClasses} ${sizeClasses} font-medium`}
          style={mergedStyles}
        >
          {el.content || 'Button'}
        </button>
      );
    }

    case 'card':
      return (
        <div className={baseClasses} style={mergedStyles}>
          {el.content ? <p className="text-xs opacity-80">{el.content}</p> : null}
        </div>
      );

    case 'input': {
      let inputSize = 'px-3 py-2 text-sm';
      if (el.sizeVariant === 'sm') inputSize = 'px-2.5 py-1 text-xs';
      else if (el.sizeVariant === 'lg') inputSize = 'px-4 py-3 text-base';

      return (
        <input
          type="text"
          readOnly={!isInteractive}
          disabled={el.disabled}
          defaultValue={el.content || ''}
          placeholder={el.placeholder || 'Enter text...'}
          className={`${baseClasses} ${inputSize} border rounded-md outline-none placeholder:text-muted-foreground ${
            isInteractive ? '' : 'pointer-events-none'
          }`}
          style={mergedStyles}
        />
      );
    }

    case 'text':
      return (
        <div className={baseClasses} style={mergedStyles}>
          {el.content || 'Text block'}
        </div>
      );

    case 'badge': {
      let badgeVariant = 'bg-zinc-800 text-zinc-100 border border-zinc-700';
      if (el.variant === 'destructive') {
        badgeVariant = 'bg-red-500/15 text-red-400 border border-red-500/30';
      } else if (el.variant === 'secondary') {
        badgeVariant = 'bg-zinc-900 text-zinc-300 border border-zinc-800';
      } else if (el.variant === 'outline') {
        badgeVariant = 'bg-transparent border border-zinc-700 text-zinc-300';
      }

      return (
        <span
          className={`${baseClasses} ${badgeVariant} px-2.5 py-0.5 rounded-full text-[11px] font-medium`}
          style={mergedStyles}
        >
          {el.content || 'Badge'}
        </span>
      );
    }

    case 'avatar':
      return (
        <div className={`${baseClasses} rounded-full border border-zinc-800`} style={mergedStyles}>
          {el.src ? (
            <img
              src={el.src}
              alt={el.alt || 'Avatar'}
              className="w-full h-full object-cover pointer-events-none rounded-full"
            />
          ) : el.content ? (
            <span className="text-xs font-semibold">{el.content}</span>
          ) : (
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              alt={el.alt || 'User avatar'}
              className="w-full h-full object-cover pointer-events-none rounded-full"
            />
          )}
        </div>
      );

    case 'icon': {
      const IconComponent = resolveLucideIcon(el.iconName, LucideIcons.Box);
      const sizeStr = el.styles?.fontSize
        ? String(el.styles.fontSize).replace(/[^0-9.]/g, '')
        : '22';
      const size = parseInt(sizeStr, 10) || 22;
      return (
        <div
          className={`${baseClasses} text-inherit flex items-center justify-center`}
          style={mergedStyles}
        >
          <IconComponent size={size} color="currentColor" />
        </div>
      );
    }

    case 'divider':
      return (
        <hr
          className="w-full border-none"
          style={{
            height: '1px',
            backgroundColor: mergedStyles.backgroundColor || '#27272a',
            ...mergedStyles,
          }}
        />
      );

    case 'image':
      return (
        <img
          src={
            el.src ||
            el.content ||
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
          }
          alt={el.alt || 'Preview'}
          className={`${baseClasses} object-cover rounded`}
          style={mergedStyles}
        />
      );

    case 'switch':
      return (
        <div className={`${baseClasses} flex items-center gap-2`} style={mergedStyles}>
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-all flex items-center ${
              el.checked ? 'bg-zinc-100 justify-end' : 'bg-zinc-800 justify-start'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full shadow-sm ${
                el.checked ? 'bg-zinc-950' : 'bg-zinc-400'
              }`}
            />
          </div>
          <span className="text-xs font-sans">{el.content || 'Switch'}</span>
        </div>
      );

    case 'checkbox':
      return (
        <div className={`${baseClasses} flex items-center gap-2`} style={mergedStyles}>
          <div
            className={`w-4 h-4 border rounded flex items-center justify-center ${
              el.checked
                ? 'border-zinc-100 bg-zinc-100 text-zinc-950'
                : 'border-zinc-700 bg-zinc-900'
            }`}
          >
            {el.checked && <LucideIcons.Check size={11} />}
          </div>
          <span className="text-xs font-sans select-none">{el.content || 'Checkbox'}</span>
        </div>
      );

    case 'progress': {
      const rawValue =
        el.value !== undefined
          ? Number(String(el.value).replace(/[^0-9.]/g, ''))
          : el.content
          ? Number(String(el.content).replace(/[^0-9.]/g, ''))
          : 60;
      const pct = Number.isNaN(rawValue) ? 60 : Math.min(100, Math.max(0, rawValue));
      return (
        <div className={`${baseClasses} flex flex-col justify-center gap-1`} style={mergedStyles}>
          {el.label ? (
            <div className="flex items-center justify-between w-full text-[10px] text-zinc-400 px-0.5">
              <span>{el.label}</span>
              <span className="font-mono tabular-nums">{pct}%</span>
            </div>
          ) : null}
          <div
            className="w-full h-2 rounded-full p-0.5 flex items-center overflow-hidden"
            style={{ backgroundColor: mergedStyles.backgroundColor || '#27272a' }}
          >
            <div
              className="h-full bg-zinc-100 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    }

    case 'slider': {
      const val =
        typeof el.value === 'number'
          ? el.value
          : parseInt(String(el.value ?? 50), 10) || 50;
      const clamped = Math.min(100, Math.max(0, val));
      return (
        <div
          className={`${baseClasses} flex flex-col justify-center gap-1.5 px-3`}
          style={mergedStyles}
        >
          <div className="flex justify-between w-full text-[10px] text-zinc-400 font-medium">
            <span>{el.label || el.content || 'Level'}</span>
            <span className="font-mono tabular-nums">{clamped}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full relative overflow-hidden">
            <div
              className="h-full bg-zinc-100 rounded-full"
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>
      );
    }

    case 'rating': {
      const rating = Math.min(5, Math.max(0, Number(el.ratingValue ?? el.value ?? 5)));
      return (
        <div
          className={`${baseClasses} flex items-center justify-center gap-1`}
          style={mergedStyles}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <LucideIcons.Star
              key={star}
              size={16}
              className={
                star <= rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-zinc-800 text-zinc-700'
              }
            />
          ))}
        </div>
      );
    }

    case 'stepper': {
      const steps =
        el.items && el.items.length > 0 ? el.items : ['Account', 'Workspace', 'Review'];
      const activeIdx = Math.max(0, Math.min(steps.length - 1, Number(el.value ?? 0) || 0));
      return (
        <div
          className={`${baseClasses} flex items-center justify-between px-4`}
          style={mergedStyles}
        >
          {steps.map((st, i) => (
            <React.Fragment key={`${st}-${i}`}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold font-mono ${
                    i <= activeIdx
                      ? 'bg-zinc-100 text-zinc-950'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[11px] font-medium hidden sm:inline ${
                    i <= activeIdx ? 'text-zinc-100' : 'text-zinc-500'
                  }`}
                >
                  {st}
                </span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-px mx-2 bg-zinc-800" />}
            </React.Fragment>
          ))}
        </div>
      );
    }

    case 'select':
      return (
        <div
          className={`${baseClasses} px-3 py-2 border border-zinc-800 rounded-lg flex items-center justify-between bg-zinc-900/60 text-xs text-zinc-200`}
          style={mergedStyles}
        >
          <span>{el.content || el.placeholder || 'Select an option...'}</span>
          <LucideIcons.ChevronDown size={14} className="text-zinc-400 shrink-0" />
        </div>
      );

    case 'file-upload':
      return (
        <div
          className={`${baseClasses} border border-dashed border-zinc-700 bg-zinc-900/30 rounded-xl flex flex-col items-center justify-center gap-2 p-4 text-center`}
          style={mergedStyles}
        >
          <div className="w-9 h-9 rounded-lg bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-200">
            <LucideIcons.UploadCloud size={18} />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-200">
              {el.content || 'Drop files here or click to browse'}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              {el.secondaryContent || 'PNG, JPG, SVG or PDF up to 10MB'}
            </p>
          </div>
        </div>
      );

    case 'textarea':
      return (
        <div
          className={`${baseClasses} p-3 border border-zinc-800 rounded-lg bg-zinc-900/50 text-xs text-zinc-300 flex flex-col justify-between items-start text-left`}
          style={mergedStyles}
        >
          <span className="text-zinc-400 select-none">
            {el.content || el.placeholder || 'Write a detailed description...'}
          </span>
          <div className="self-end text-[10px] text-zinc-500 font-mono tabular-nums">
            {(el.content || '').length} / 250
          </div>
        </div>
      );

    case 'tag-input': {
      const tagList =
        el.items && el.items.length > 0
          ? el.items
          : el.tags && el.tags.length > 0
          ? el.tags
          : ['Design System', 'React 19', 'TypeScript'];
      return (
        <div
          className={`${baseClasses} p-2 border border-zinc-800 rounded-lg bg-zinc-900/40 flex flex-wrap items-center justify-start gap-1.5`}
          style={mergedStyles}
        >
          {tagList.map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-medium text-zinc-200"
            >
              {tag}
              <LucideIcons.X size={10} className="text-zinc-400" />
            </span>
          ))}
          <span className="text-[11px] text-zinc-500 px-1">
            {el.placeholder || 'Add tag...'}
          </span>
        </div>
      );
    }

    case 'otp-input': {
      const rawOtp = String(el.content || el.value || '428').padEnd(4, ' ').slice(0, 4);
      const digits = rawOtp.split('');
      return (
        <div
          className={`${baseClasses} flex items-center justify-center gap-2`}
          style={mergedStyles}
        >
          {digits.map((digit, i) => {
            const isCurrent = digit === ' ' || digit === '_';
            return (
              <div
                key={i}
                className={`w-10 h-11 rounded-lg border flex items-center justify-center font-mono font-semibold text-sm tabular-nums ${
                  isCurrent
                    ? 'border-zinc-400 bg-zinc-900 text-zinc-200'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-100'
                }`}
              >
                {isCurrent ? '|' : digit}
              </div>
            );
          })}
        </div>
      );
    }

    case 'tabs': {
      const tabs =
        el.items && el.items.length > 0 ? el.items : ['Overview', 'Metrics', 'Settings'];
      return (
        <div
          className={`${baseClasses} p-1 bg-zinc-900/80 border border-zinc-800 rounded-lg flex items-center gap-1`}
          style={mergedStyles}
        >
          {tabs.map((tab, i) => (
            <div
              key={`${tab}-${i}`}
              className={`flex-1 py-1.5 text-center text-xs font-medium rounded-md transition-all ${
                i === 0 ? 'bg-zinc-800 text-zinc-100 shadow-xs' : 'text-zinc-400'
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      );
    }

    case 'accordion':
      return (
        <div
          className={`${baseClasses} flex flex-col justify-center border border-zinc-800 rounded-xl p-3.5 bg-zinc-900/40 text-left`}
          style={mergedStyles}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold text-zinc-200">
              {el.content || 'How does license activation work?'}
            </span>
            <LucideIcons.ChevronUp size={14} className="text-zinc-400" />
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed w-full">
            {el.secondaryContent ||
              'Each team seat includes CLI access and full TypeScript source code without runtime dependencies.'}
          </p>
        </div>
      );

    case 'dock':
      return (
        <div
          className={`${baseClasses} p-2 bg-zinc-950/90 border border-zinc-800 backdrop-blur-md rounded-2xl flex items-center justify-center gap-2 shadow-lg`}
          style={mergedStyles}
        >
          {[
            LucideIcons.Home,
            LucideIcons.Compass,
            LucideIcons.Layers,
            LucideIcons.Code2,
            LucideIcons.Settings,
          ].map((Icon, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300"
            >
              <Icon size={17} />
            </div>
          ))}
        </div>
      );

    case 'navigation': {
      const navLinks =
        el.items && el.items.length > 0
          ? el.items
          : ['Components', 'Templates', 'Documentation', 'Pricing'];
      return (
        <div
          className={`${baseClasses} px-5 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md flex items-center justify-between`}
          style={mergedStyles}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-zinc-100 text-zinc-950 flex items-center justify-center font-mono text-[10px] font-bold">
              N
            </div>
            <span className="text-xs font-semibold text-zinc-100 tracking-tight">
              {el.content || 'NexoreUI'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-zinc-400">
            {navLinks.map((item, idx) => (
              <span
                key={`${item}-${idx}`}
                className={idx === 0 ? 'text-zinc-100 font-medium' : ''}
              >
                {item}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="px-3 py-1 rounded-md bg-zinc-100 text-zinc-950 text-[11px] font-semibold"
          >
            {el.secondaryContent || 'Sign In'}
          </button>
        </div>
      );
    }

    case 'breadcrumb': {
      const crumbs =
        el.items && el.items.length > 0
          ? el.items
          : ['Workspace', 'Projects', el.content || 'Settings'];
      return (
        <div
          className={`${baseClasses} flex items-center gap-2 text-xs text-zinc-500 font-medium px-2`}
          style={mergedStyles}
        >
          {crumbs.map((crumb, idx) => (
            <React.Fragment key={`${crumb}-${idx}`}>
              <span
                className={
                  idx === crumbs.length - 1
                    ? 'text-zinc-100 font-semibold'
                    : 'hover:text-zinc-300'
                }
              >
                {crumb}
              </span>
              {idx < crumbs.length - 1 && <LucideIcons.ChevronRight size={12} />}
            </React.Fragment>
          ))}
        </div>
      );
    }

    case 'alert':
      return (
        <div
          className={`${baseClasses} p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/70 flex items-start gap-3 text-left`}
          style={mergedStyles}
        >
          <LucideIcons.Info size={16} className="text-zinc-200 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-semibold text-zinc-100">
              {el.content || 'System Maintenance Scheduled'}
            </h5>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              {el.secondaryContent ||
                'Database read replicas will undergo a 5-minute rolling upgrade at 02:00 UTC.'}
            </p>
          </div>
        </div>
      );

    case 'modal':
    case 'dialog':
      return (
        <div
          className={`${baseClasses} p-4 rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl flex flex-col justify-between text-left`}
          style={mergedStyles}
        >
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 w-full">
            <h4 className="text-xs font-semibold text-zinc-100">
              {el.content || 'Confirm Production Deployment'}
            </h4>
            <LucideIcons.X size={14} className="text-zinc-500" />
          </div>
          <p className="text-[11px] text-zinc-400 my-2 w-full leading-relaxed">
            {el.secondaryContent ||
              'This action will promote build #418 to production across all edge regions.'}
          </p>
          <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-zinc-900 w-full">
            <button
              type="button"
              className="px-3 py-1 text-[10px] rounded-md border border-zinc-800 text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-3 py-1 text-[10px] rounded-md bg-zinc-100 text-zinc-950 font-semibold"
            >
              Deploy
            </button>
          </div>
        </div>
      );

    case 'tooltip':
      return (
        <div className={`${baseClasses} flex items-center justify-center`} style={mergedStyles}>
          <div className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-medium text-zinc-200 shadow-md flex items-center gap-1.5">
            <span>{el.content || 'Command Palette'}</span>
            <span className="text-zinc-500 font-mono text-[9px]">
              {el.secondaryContent || 'Ctrl+K'}
            </span>
          </div>
        </div>
      );

    case 'toast':
      return (
        <div
          className={`${baseClasses} px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg flex items-center gap-2.5 text-left`}
          style={mergedStyles}
        >
          <LucideIcons.CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-zinc-100">
              {el.content || 'Configuration Saved'}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {el.secondaryContent || 'Environment variables synced to production'}
            </p>
          </div>
        </div>
      );

    case 'cookie':
      return (
        <div
          className={`${baseClasses} p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shadow-lg`}
          style={mergedStyles}
        >
          <div className="flex items-center gap-2.5">
            <LucideIcons.Cookie size={16} className="text-zinc-400 shrink-0" />
            <p className="text-[11px] text-zinc-300 text-left">
              {el.content || 'We use essential cookies to remember your session preferences.'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              className="px-2.5 py-1 text-[10px] rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800"
            >
              Decline
            </button>
            <button
              type="button"
              className="px-2.5 py-1 text-[10px] rounded-md bg-zinc-100 text-zinc-950 font-semibold"
            >
              Accept
            </button>
          </div>
        </div>
      );

    case 'spinner':
      return (
        <div className={`${baseClasses} flex items-center justify-center`} style={mergedStyles}>
          <LucideIcons.Loader2 size={22} className="animate-spin text-zinc-200" />
        </div>
      );

    case 'aurora-border-card': {
      const CardIcon = resolveLucideIcon(el.iconName, LucideIcons.Layers);
      return (
        <div
          className={`${baseClasses} p-4 rounded-xl relative border border-zinc-700/80 bg-zinc-950/90 flex flex-col justify-center text-left`}
          style={mergedStyles}
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 mb-2">
            <CardIcon size={14} />
          </div>
          <h4 className="text-xs font-semibold text-zinc-100">
            {el.content || 'Specular Border Surface'}
          </h4>
          <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
            {el.secondaryContent || 'Precision 1px border highlight with adaptive dark contrast.'}
          </p>
        </div>
      );
    }

    case 'aurora-border-fx':
      return (
        <div
          className={`${baseClasses} p-4 rounded-xl relative border border-zinc-700 bg-zinc-950 flex items-center justify-center`}
          style={mergedStyles}
        >
          <span className="text-xs font-semibold text-zinc-100 tracking-tight">
            {el.content || 'Specular Border Frame'}
          </span>
        </div>
      );

    case 'aurora-search-pill':
      return (
        <div
          className={`${baseClasses} px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/90 flex items-center justify-between text-xs text-zinc-300`}
          style={mergedStyles}
        >
          <div className="flex items-center gap-2">
            <LucideIcons.Search size={14} className="text-zinc-400" />
            <span className="text-zinc-400">
              {el.placeholder || el.content || 'Search documentation, components...'}
            </span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
            Ctrl+K
          </kbd>
        </div>
      );

    case 'morphing-geometry':
      return (
        <div
          className={`${baseClasses} flex items-center justify-center relative overflow-hidden border border-zinc-800 rounded-xl bg-zinc-950`}
          style={mergedStyles}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-14 h-14 stroke-zinc-300 fill-zinc-900"
          >
            <polygon points="50,6 93,28 93,72 50,94 7,72 7,28" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'interactive-code-block':
      return (
        <div
          className={`${baseClasses} rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col text-left overflow-hidden`}
          style={mergedStyles}
        >
          <div className="h-7 bg-zinc-900/80 px-3 border-b border-zinc-800 flex items-center justify-between w-full shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              {el.secondaryContent || el.name || 'Component.tsx'}
            </span>
            <LucideIcons.Copy size={11} className="text-zinc-500" />
          </div>
          <div className="p-3 font-mono text-[11px] text-zinc-300 leading-relaxed overflow-hidden w-full flex-1">
            <div>import React from &apos;react&apos;;</div>
            <div className="text-zinc-500">{el.content || 'export function Module() {'}</div>
            <div className="pl-3 text-zinc-300">return &lt;div className=&quot;p-4&quot; /&gt;;</div>
            <div>&#125;</div>
          </div>
        </div>
      );

    case 'ai-prompt-input':
      return (
        <div
          className={`${baseClasses} p-2 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center gap-2`}
          style={mergedStyles}
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center shrink-0">
            <LucideIcons.Terminal size={13} />
          </div>
          <input
            type="text"
            readOnly
            placeholder={el.placeholder || el.content || 'Describe a layout change...'}
            className="flex-1 bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none pointer-events-none"
          />
          <button
            type="button"
            className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center shrink-0"
          >
            <LucideIcons.ArrowRight size={13} />
          </button>
        </div>
      );

    case 'marquee': {
      const marqueeItems =
        el.items && el.items.length > 0
          ? el.items
          : el.content
          ? el.content
              .split(/[•,|]/)
              .map((s) => s.trim())
              .filter(Boolean)
          : ['Next.js 15', 'React 19', 'Tailwind CSS', 'Framer Motion', 'TypeScript'];
      return (
        <div
          className={`${baseClasses} border-y border-zinc-800 bg-zinc-950/60 flex items-center gap-6 px-4 overflow-hidden whitespace-nowrap`}
          style={mergedStyles}
        >
          {marqueeItems.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="text-xs font-medium text-zinc-400 flex items-center gap-2 shrink-0"
            >
              <span className="w-1 h-1 rounded-full bg-zinc-500" />
              {item}
            </span>
          ))}
        </div>
      );
    }

    case 'number-ticker':
    case 'animated-number':
      return (
        <div
          className={`${baseClasses} p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col items-center justify-center text-center`}
          style={mergedStyles}
        >
          <span className="text-2xl font-semibold text-zinc-100 font-mono tabular-nums tracking-tight">
            {el.content || String(el.value ?? '99.98%')}
          </span>
          <span className="text-[10px] text-zinc-500 mt-0.5">
            {el.secondaryContent || '30-day rolling availability'}
          </span>
        </div>
      );

    case 'typing-animation':
      return (
        <div
          className={`${baseClasses} px-3 py-2 font-mono text-xs text-zinc-200 flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg`}
          style={mergedStyles}
        >
          <span>{el.content || '$ npx nexoreui add button'}</span>
          <span className="w-1.5 h-3.5 bg-zinc-400 inline-block" />
        </div>
      );

    case 'blur-fade':
      return (
        <div
          className={`${baseClasses} p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col items-center justify-center text-center`}
          style={mergedStyles}
        >
          <span className="text-xs font-semibold text-zinc-100">
            {el.content || 'Viewport Reveal Container'}
          </span>
          <span className="text-[10px] text-zinc-500 mt-1">
            {el.secondaryContent || 'Opacity and translateY entrance transition'}
          </span>
        </div>
      );

    case 'image-compare':
      return (
        <div
          className={`${baseClasses} rounded-xl border border-zinc-800 overflow-hidden relative flex items-center justify-center`}
          style={mergedStyles}
        >
          <img
            src={
              el.src ||
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
            }
            alt={el.alt || 'Comparison'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/80 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-zinc-950 border border-zinc-700 text-zinc-100 flex items-center justify-center shadow">
              <LucideIcons.MoveHorizontal size={11} />
            </div>
          </div>
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-zinc-950/80 border border-zinc-800 rounded text-[9px] font-mono text-zinc-200">
            {el.content || 'Before'}
          </span>
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-zinc-950/80 border border-zinc-800 rounded text-[9px] font-mono text-zinc-200">
            {el.secondaryContent || 'After'}
          </span>
        </div>
      );

    case 'dark-mode-toggle':
      return (
        <div
          className={`${baseClasses} p-1 rounded-full border border-zinc-800 bg-zinc-900/80 flex items-center gap-1`}
          style={mergedStyles}
        >
          <div className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-xs">
            <LucideIcons.Moon size={12} />
          </div>
          <div className="w-6 h-6 rounded-full text-zinc-400 flex items-center justify-center">
            <LucideIcons.Sun size={12} />
          </div>
        </div>
      );

    case 'pricing-table': {
      const features =
        el.items && el.items.length > 0
          ? el.items
          : [
              'Full TypeScript source code',
              '38 production templates',
              'Commercial team license',
              'Direct engineering support',
            ];
      return (
        <div
          className={`${baseClasses} p-5 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between text-left`}
          style={mergedStyles}
        >
          <div className="w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                {el.content || 'Team License'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono">
                Annual
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-zinc-100 tabular-nums tracking-tight">
                {el.secondaryContent || '$49'}
              </span>
              <span className="text-xs text-zinc-500">/ seat</span>
            </div>
            <div className="mt-3 space-y-1.5 text-[11px] text-zinc-300">
              {features.map((feat, idx) => (
                <div key={`${feat}-${idx}`} className="flex items-center gap-2">
                  <LucideIcons.Check size={13} className="text-zinc-100 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="mt-4 w-full py-2 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-semibold"
          >
            {el.label || 'Select Plan'}
          </button>
        </div>
      );
    }

    case 'hero-section':
      return (
        <div
          className={`${baseClasses} p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center text-center`}
          style={mergedStyles}
        >
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
            {el.content || 'Ship production interfaces without boilerplate'}
          </h2>
          <p className="text-xs text-zinc-400 mt-2 max-w-sm leading-relaxed">
            {el.secondaryContent ||
              'Accessible React components and visual layout primitives built on Tailwind CSS tokens.'}
          </p>
          <div className="flex items-center gap-2.5 mt-4">
            <button
              type="button"
              className="px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-semibold"
            >
              Browse Components
            </button>
            <button
              type="button"
              className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium"
            >
              Documentation
            </button>
          </div>
        </div>
      );

    case 'testimonial-card': {
      const starsCount = Math.min(5, Math.max(1, Number(el.ratingValue ?? 5)));
      return (
        <div
          className={`${baseClasses} p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between text-left`}
          style={mergedStyles}
        >
          <div className="flex items-center gap-1 text-amber-400 mb-2 w-full">
            {Array.from({ length: starsCount }).map((_, i) => (
              <LucideIcons.Star key={i} size={12} className="fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed w-full">
            &ldquo;
            {el.content ||
              'The keyboard navigation and token consistency saved our team two weeks during our dashboard rebuild.'}
            &rdquo;
          </p>
          <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-zinc-900 w-full">
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-semibold text-zinc-200">
              {(el.author || 'Elena Rostova').charAt(0)}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-100">
                {el.author || 'Elena Rostova'}
              </p>
              <p className="text-[10px] text-zinc-500">
                {el.role || 'Staff Frontend Engineer, Linearis'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    case 'bento-grid': {
      const BentoIcon = resolveLucideIcon(el.iconName, LucideIcons.Activity);
      const tagLabel =
        (el.items && el.items[0]) || (el.tags && el.tags[0]) || 'Telemetry';
      return (
        <div
          className={`${baseClasses} p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between text-left relative overflow-hidden`}
          style={mergedStyles}
        >
          <div className="flex items-center justify-between w-full">
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono uppercase">
              {tagLabel}
            </span>
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <BentoIcon size={14} />
            </div>
          </div>
          <div className="w-full mt-3">
            <h4 className="text-sm font-semibold text-zinc-100">
              {el.content || 'Edge Request Latency'}
            </h4>
            <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {el.secondaryContent ||
                'P95 response times tracked across 18 regional PoPs in real time.'}
            </p>
          </div>
        </div>
      );
    }

    case 'stat-card': {
      const StatIcon = resolveLucideIcon(el.iconName, LucideIcons.TrendingUp);
      return (
        <div
          className={`${baseClasses} p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between text-left`}
          style={mergedStyles}
        >
          <div className="flex items-center justify-between text-zinc-400 w-full">
            <span className="text-xs font-medium">{el.content || 'Monthly Recurring Revenue'}</span>
            <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
              <StatIcon size={13} />
            </div>
          </div>
          <div className="my-2 w-full">
            <span className="text-2xl font-semibold text-zinc-100 font-mono tabular-nums tracking-tight">
              {el.secondaryContent || '$48,290'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono w-full">
            <LucideIcons.ArrowUpRight size={12} />
            <span>{el.label || '+14.2% vs prior 30d'}</span>
          </div>
        </div>
      );
    }

    case 'faq-item':
      return (
        <div
          className={`${baseClasses} p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col justify-center text-left`}
          style={mergedStyles}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold text-zinc-200">
              {el.content || 'Can I export standalone React and Vue components?'}
            </span>
            <div className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
              <LucideIcons.Plus size={12} />
            </div>
          </div>
          {el.secondaryContent ? (
            <p className="text-[11px] text-zinc-400 mt-1.5 line-clamp-2 w-full">
              {el.secondaryContent}
            </p>
          ) : null}
        </div>
      );

    case 'timeline':
      return (
        <div
          className={`${baseClasses} px-3 py-2 flex items-center justify-start gap-3 text-left`}
          style={mergedStyles}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-100 ring-4 ring-zinc-800 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-zinc-100">
              {el.content || 'Release 2.0 Deployed'}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">
              {el.secondaryContent || '2026-10-17 · 14:20 UTC'}
            </p>
          </div>
        </div>
      );

    case 'video-player':
      return (
        <div
          className={`${baseClasses} rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden relative flex items-center justify-center`}
          style={mergedStyles}
        >
          <img
            src={
              el.src ||
              'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600'
            }
            alt={el.alt || 'Video poster'}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="w-11 h-11 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-lg">
            <LucideIcons.Play size={18} className="ml-0.5 fill-zinc-950" />
          </div>
          <div className="absolute bottom-2 inset-x-3 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-zinc-100" />
          </div>
        </div>
      );

    case 'callout':
      return (
        <div
          className={`${baseClasses} p-3.5 rounded-xl border-l-2 border-l-zinc-200 border border-zinc-800 bg-zinc-900/50 flex items-start gap-2.5 text-left`}
          style={mergedStyles}
        >
          <LucideIcons.AlertTriangle size={15} className="text-zinc-200 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-100">
              {el.content || 'Configuration Note'}
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              {el.secondaryContent ||
                'Verify that your API key is set in .env.local before starting the server.'}
            </p>
          </div>
        </div>
      );

    case 'container':
    case 'flex':
    case 'grid':
      return (
        <div
          className={`${baseClasses} border border-dashed border-zinc-800 rounded-xl p-3 flex items-center justify-center text-zinc-500 text-xs`}
          style={mergedStyles}
        >
          {el.content || `${el.type} container`}
        </div>
      );

    case 'skeleton':
      return (
        <div
          className={`${baseClasses} rounded-lg bg-zinc-800/70 border border-zinc-800`}
          style={mergedStyles}
        />
      );

    case 'scroll-area':
      return (
        <div
          className={`${baseClasses} p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-y-auto scrollbar-thin text-left`}
          style={mergedStyles}
        >
          <p className="text-xs text-zinc-300 leading-relaxed">
            {el.content || 'Scrollable viewport container with custom thin scrollbar.'}
          </p>
        </div>
      );

    case 'kbd':
      return (
        <div
          className={`${baseClasses} inline-flex items-center justify-center`}
          style={mergedStyles}
        >
          <kbd className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-xs font-mono font-semibold text-zinc-200 shadow-xs">
            {el.content || 'Ctrl + K'}
          </kbd>
        </div>
      );

    default:
      return <div className="w-full h-full border border-zinc-800" style={mergedStyles} />;
  }
}

export { ElementRenderer };

export interface TemplatePreviewProps {
  elements: NexoreMakeElement[];
  canvasSettings: CanvasSettings;
  containerWidth?: number;
  containerHeight?: number;
  containerW?: number;
  containerH?: number;
  className?: string;
}

export function TemplatePreview({
  elements,
  canvasSettings,
  containerWidth,
  containerHeight,
  containerW,
  containerH,
  className = '',
}: TemplatePreviewProps) {
  const effectiveW = containerWidth ?? containerW ?? 280;
  const effectiveH = containerHeight ?? containerH ?? 140;
  const cWidth = canvasSettings?.width || 800;
  const cHeight = canvasSettings?.height || 600;
  const scaleX = effectiveW / cWidth;
  const scaleY = effectiveH / cHeight;
  const scale = Math.min(scaleX, scaleY) * 0.9;
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className={`w-full h-full rounded-lg overflow-hidden flex items-center justify-center relative select-none pointer-events-none ${className}`}
      style={{ backgroundColor: 'var(--make-canvas-bg, #09090b)' }}
    >
      <div
        className="shrink-0 relative overflow-hidden"
        style={{
          width: cWidth,
          height: cHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          backgroundColor:
            canvasSettings?.backgroundColor &&
            canvasSettings.backgroundColor !== 'transparent'
              ? canvasSettings.backgroundColor
              : undefined,
        }}
      >
        {sorted.map((el) => (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left: typeof el.position.x === 'number' ? `${el.position.x}px` : el.position.x,
              top: typeof el.position.y === 'number' ? `${el.position.y}px` : el.position.y,
              width: typeof el.size.width === 'number' ? `${el.size.width}px` : el.size.width,
              height: typeof el.size.height === 'number' ? `${el.size.height}px` : el.size.height,
              zIndex: el.zIndex,
            }}
          >
            <ElementRenderer element={el} mode="static" />
          </div>
        ))}
      </div>
    </div>
  );
}
