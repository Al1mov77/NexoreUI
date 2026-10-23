import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  BringToFront,
  SendToBack,
  Trash2,
  Copy,
  Settings,
  Type,
  Maximize2,
  SlidersHorizontal,
  Palette,
  BoxSelect,
  Layers,
  Wand2,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { NexoreMakeElement, ElementType } from '../types';
import MakeColorPicker from './MakeColorPicker';
import { isLightColor, isDarkColor } from '../utils/colorUtils';

interface MakePropertiesPanelProps {
  selectedElement: NexoreMakeElement | null;
  onUpdateStyle: (id: string, styles: Partial<NexoreMakeElement['styles']>) => void;
  onUpdateProps: (
    id: string,
    payload: Partial<Omit<NexoreMakeElement, 'id' | 'styles' | 'position' | 'size'>>
  ) => void;
  onUpdateSize: (id: string, width: number | string, height: number | string) => void;
  onMove?: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  variant?: 'sidebar' | 'drawer';
}

const SECONDARY_CONTENT_TYPES: ReadonlySet<ElementType> = new Set<ElementType>([
  'card',
  'alert',
  'modal',
  'dialog',
  'toast',
  'cookie',
  'accordion',
  'faq-item',
  'callout',
  'hero-section',
  'pricing-table',
  'stat-card',
  'testimonial-card',
  'bento-grid',
  'aurora-border-card',
  'aurora-border-fx',
  'video-player',
]);

const LABEL_TYPES: ReadonlySet<ElementType> = new Set<ElementType>([
  'input',
  'textarea',
  'select',
  'checkbox',
  'switch',
  'slider',
  'progress',
  'otp-input',
  'tag-input',
  'aurora-search-pill',
  'ai-prompt-input',
  'file-upload',
  'stat-card',
  'pricing-table',
  'hero-section',
]);

const PLACEHOLDER_TYPES: ReadonlySet<ElementType> = new Set<ElementType>([
  'input',
  'textarea',
  'select',
  'aurora-search-pill',
  'ai-prompt-input',
  'tag-input',
  'file-upload',
]);

const ITEMS_LIST_TYPES: ReadonlySet<ElementType> = new Set<ElementType>([
  'tabs',
  'stepper',
  'pricing-table',
  'marquee',
  'tag-input',
  'breadcrumb',
  'navigation',
  'dock',
  'select',
  'bento-grid',
  'timeline',
]);

const VALUE_NUMBER_TYPES: ReadonlySet<ElementType> = new Set<ElementType>([
  'slider',
  'progress',
  'otp-input',
  'number-ticker',
  'animated-number',
]);

const CHECKABLE_TYPES: ReadonlySet<ElementType> = new Set<ElementType>([
  'checkbox',
  'switch',
  'dark-mode-toggle',
]);

const DISABLEABLE_TYPES: ReadonlySet<ElementType> = new Set<ElementType>([
  'button',
  'input',
  'textarea',
  'select',
  'checkbox',
  'switch',
  'slider',
  'otp-input',
  'tag-input',
  'aurora-search-pill',
  'ai-prompt-input',
]);

const ICON_SUPPORTED_TYPES: ReadonlySet<ElementType> = new Set<ElementType>([
  'icon',
  'button',
  'badge',
  'alert',
  'toast',
  'callout',
  'stat-card',
  'bento-grid',
  'aurora-border-card',
  'navigation',
]);

const SPEED_TYPES: ReadonlySet<ElementType> = new Set<ElementType>([
  'marquee',
  'aurora-border-card',
  'aurora-border-fx',
  'typing-animation',
  'morphing-geometry',
]);

const COMMON_ICONS = [
  'Zap',
  'Check',
  'ArrowRight',
  'Terminal',
  'Code2',
  'Layers',
  'Shield',
  'Lock',
  'Globe',
  'Activity',
  'BarChart3',
  'Clock',
  'Search',
  'Bell',
  'User',
  'Settings',
] as const;

type SectionId = 'presets' | 'layout' | 'content' | 'typography' | 'fill' | 'border' | 'effects' | 'advanced';

export default function MakePropertiesPanel({
  selectedElement,
  onUpdateStyle,
  onUpdateProps,
  onUpdateSize,
  onMove,
  onDelete,
  onDuplicate,
  onBringToFront,
  onSendToBack,
  variant = 'sidebar',
}: MakePropertiesPanelProps) {
  const isDrawer = variant === 'drawer';
  const { resolvedTheme, theme } = useTheme();
  const isLight =
    resolvedTheme === 'light' ||
    theme === 'light' ||
    (typeof document !== 'undefined' &&
      !document.documentElement.classList.contains('dark'));
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    presets: true,
    layout: true,
    content: true,
    typography: true,
    fill: true,
    border: false,
    effects: false,
    advanced: false,
  });
  const [newItemText, setNewItemText] = useState('');

  const toggleSection = (section: SectionId) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!selectedElement) {
    return (
      <div
        className={`${
          isDrawer ? 'w-full border-0 py-10' : 'w-[280px] shrink-0 border-l'
        } flex flex-col items-center justify-center p-6 text-center select-none h-full`}
        style={{
          backgroundColor: isDrawer ? 'transparent' : 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
          borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
          color: 'var(--make-text-muted, #71717a)',
        }}
      >
        <div className="mb-3 p-2.5 rounded-xl bg-muted border border-border">
          <Settings className="h-5 w-5 text-foreground" />
        </div>
        <h4 className="text-xs font-semibold" style={{ color: 'var(--make-text, #ffffff)' }}>
          No element selected
        </h4>
        <p className="text-[10px] mt-1 max-w-[180px]">
          Click on an element on the canvas or drag one from the left toolbar to edit properties.
        </p>
      </div>
    );
  }

  const el = selectedElement;

  const handleStyleChange = <K extends keyof NexoreMakeElement['styles']>(
    key: K,
    value: NexoreMakeElement['styles'][K]
  ) => {
    if (key === 'backgroundColor') {
      const nextBg = String(value || '');
      const bgIsLight = isLightColor(nextBg);
      const bgIsDark = isDarkColor(nextBg);
      const currentColor = String(el.styles.color || '');

      const updates: Partial<NexoreMakeElement['styles']> = { [key]: value };

      if (bgIsLight) {
        if (!currentColor || isLightColor(currentColor)) {
          updates.color = '#09090b';
        }
        if (el.styles.borderColor === '#27272a' || el.styles.borderColor === '#3f3f46') {
          updates.borderColor = '#e4e4e7';
        }
      } else if (bgIsDark) {
        if (!currentColor || isDarkColor(currentColor)) {
          updates.color = '#fafafa';
        }
        if (el.styles.borderColor === '#e4e4e7' || el.styles.borderColor === '#d4d4d8') {
          updates.borderColor = '#27272a';
        }
      }
      onUpdateStyle(el.id, updates);
      return;
    }
    onUpdateStyle(el.id, { [key]: value });
  };

  const handleSizeChange = (dim: 'width' | 'height', val: string) => {
    let parsed: number | string = val;
    if (val.trim() === 'auto' || val.trim() === '100%') {
      parsed = val;
    } else {
      const num = parseInt(val, 10);
      if (!isNaN(num)) parsed = num;
    }

    if (dim === 'width') {
      onUpdateSize(el.id, parsed, el.size.height);
    } else {
      onUpdateSize(el.id, el.size.width, parsed);
    }
  };

  const applyPreset = (preset: 'surface' | 'muted' | 'elevated' | 'outline') => {
    switch (preset) {
      case 'surface':
        onUpdateStyle(el.id, {
          backgroundColor: isLight ? '#ffffff' : '#18181b',
          borderColor: isLight ? '#e4e4e7' : '#27272a',
          color: isLight ? '#09090b' : '#fafafa',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '10px',
          boxShadow: isLight ? '0 1px 2px rgba(0, 0, 0, 0.05)' : '0 1px 2px rgba(0, 0, 0, 0.08)',
          backdropBlur: '0px',
        });
        break;
      case 'muted':
        onUpdateStyle(el.id, {
          backgroundColor: isLight ? '#f4f4f5' : '#27272a',
          borderColor: isLight ? '#e4e4e7' : '#27272a',
          color: isLight ? '#09090b' : '#fafafa',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '8px',
          boxShadow: 'none',
          backdropBlur: '0px',
        });
        break;
      case 'elevated':
        onUpdateStyle(el.id, {
          backgroundColor: isLight ? '#ffffff' : '#18181b',
          borderColor: isLight ? '#e4e4e7' : '#3f3f46',
          color: isLight ? '#09090b' : '#fafafa',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '12px',
          boxShadow: isLight ? '0 8px 24px rgba(0, 0, 0, 0.08)' : '0 8px 24px rgba(0, 0, 0, 0.24)',
          backdropBlur: '0px',
        });
        break;
      case 'outline':
        onUpdateStyle(el.id, {
          backgroundColor: 'transparent',
          borderColor: isLight ? '#e4e4e7' : '#3f3f46',
          color: isLight ? '#09090b' : '#fafafa',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '8px',
          boxShadow: 'none',
          backdropBlur: '0px',
        });
        break;
    }
  };

  const currentItems = el.items ?? el.tags ?? [];

  const updateItemsList = (nextItems: string[]) => {
    if (el.type === 'tag-input') {
      onUpdateProps(el.id, { tags: nextItems, items: nextItems });
    } else {
      onUpdateProps(el.id, { items: nextItems });
    }
  };

  const isLayoutContainer =
    el.type === 'container' ||
    el.type === 'flex' ||
    el.type === 'grid' ||
    el.styles.display === 'flex' ||
    el.styles.display === 'grid';

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
    borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
    color: 'var(--make-text, #ffffff)',
  };

  const renderSectionHeader = (id: SectionId, icon: React.ReactNode, title: string) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between py-1 text-left group cursor-pointer"
    >
      <span
        className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--make-text-muted, #71717a)' }}
      >
        {icon}
        {title}
      </span>
      {openSections[id] ? (
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </button>
  );

  return (
    <div
      className={`${
        isDrawer ? 'w-full border-0' : 'w-[280px] shrink-0 border-l'
      } flex flex-col select-none h-full overflow-hidden`}
      style={{
        backgroundColor: isDrawer ? 'transparent' : 'var(--make-glass-bg, rgba(9, 9, 11, 0.75))',
        borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
        backdropFilter: isDrawer ? 'none' : 'blur(20px) saturate(180%)',
      }}
    >
      <div
        className="p-3.5 border-b flex items-center justify-between shrink-0"
        style={{
          borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
          backgroundColor: 'var(--make-surface, rgba(24, 24, 27, 0.5))',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-semibold bg-muted text-foreground border border-border">
            {el.type}
          </span>
          <span
            className="text-xs font-mono truncate max-w-[90px]"
            style={{ color: 'var(--make-text-muted, #71717a)' }}
            title={el.id}
          >
            #{el.id.slice(3, 8)}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onBringToFront(el.id)}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Bring to Front"
          >
            <BringToFront className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSendToBack(el.id)}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Send to Back"
          >
            <SendToBack className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(el.id)}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Duplicate (Ctrl+D)"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(el.id)}
            className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors ml-0.5"
            title="Delete (Del)"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        {/* SURFACE PRESETS */}
        <div className="space-y-2.5">
          {renderSectionHeader('presets', <Wand2 className="h-3.5 w-3.5" />, 'Surface Presets')}
          {openSections.presets && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => applyPreset('surface')}
                className="px-2.5 py-1.5 text-[10px] font-medium rounded-md border border-border bg-card text-foreground hover:bg-accent transition-all text-left"
              >
                Surface Card
              </button>
              <button
                type="button"
                onClick={() => applyPreset('muted')}
                className="px-2.5 py-1.5 text-[10px] font-medium rounded-md border border-border bg-muted text-foreground hover:bg-accent transition-all text-left"
              >
                Muted Panel
              </button>
              <button
                type="button"
                onClick={() => applyPreset('elevated')}
                className="px-2.5 py-1.5 text-[10px] font-medium rounded-md border border-border bg-card shadow-sm text-foreground hover:bg-accent transition-all text-left"
              >
                Elevated Popover
              </button>
              <button
                type="button"
                onClick={() => applyPreset('outline')}
                className="px-2.5 py-1.5 text-[10px] font-medium rounded-md border border-border bg-transparent text-foreground hover:bg-accent transition-all text-left"
              >
                Outline
              </button>
            </div>
          )}
        </div>

        <hr style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }} />

        {/* LAYOUT & GEOMETRY */}
        <div className="space-y-3">
          {renderSectionHeader('layout', <Maximize2 className="h-3.5 w-3.5" />, 'Layout & Position')}
          {openSections.layout && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    X Position
                  </label>
                  <input
                    type="number"
                    value={Math.round(el.position.x)}
                    onChange={(e) => {
                      const nextX = parseInt(e.target.value, 10);
                      if (!isNaN(nextX)) onMove?.(el.id, nextX, el.position.y);
                    }}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Y Position
                  </label>
                  <input
                    type="number"
                    value={Math.round(el.position.y)}
                    onChange={(e) => {
                      const nextY = parseInt(e.target.value, 10);
                      if (!isNaN(nextY)) onMove?.(el.id, el.position.x, nextY);
                    }}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Width
                  </label>
                  <input
                    type="text"
                    value={el.size.width}
                    onChange={(e) => handleSizeChange('width', e.target.value)}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Height
                  </label>
                  <input
                    type="text"
                    value={el.size.height}
                    onChange={(e) => handleSizeChange('height', e.target.value)}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 items-end">
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Z-Index
                  </label>
                  <input
                    type="number"
                    value={el.zIndex}
                    onChange={(e) => {
                      const nextZ = parseInt(e.target.value, 10);
                      if (!isNaN(nextZ)) onUpdateProps(el.id, { zIndex: nextZ });
                    }}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => onBringToFront(el.id)}
                    className="flex-1 h-7 rounded border border-border bg-muted/40 hover:bg-muted text-[10px] font-medium text-foreground transition-colors"
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendToBack(el.id)}
                    className="flex-1 h-7 rounded border border-border bg-muted/40 hover:bg-muted text-[10px] font-medium text-foreground transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>

              {isLayoutContainer && (
                <div
                  className="space-y-2.5 pt-2 border-t"
                  style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                        Display
                      </label>
                      <select
                        value={el.styles.display || (el.type === 'grid' ? 'grid' : 'flex')}
                        onChange={(e) =>
                          handleStyleChange(
                            'display',
                            e.target.value as NexoreMakeElement['styles']['display']
                          )
                        }
                        className="w-full h-7 border rounded px-1.5 text-xs outline-none"
                        style={inputStyle}
                      >
                        <option value="flex">Flex</option>
                        <option value="grid">Grid</option>
                        <option value="block">Block</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                        Gap (px)
                      </label>
                      <input
                        type="text"
                        value={el.styles.gap || '12px'}
                        onChange={(e) => handleStyleChange('gap', e.target.value)}
                        className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {(el.styles.display === 'flex' || el.type === 'flex' || el.type === 'container') && (
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="space-y-1">
                        <label className="text-[9px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                          Direction
                        </label>
                        <select
                          value={el.styles.flexDirection || 'column'}
                          onChange={(e) =>
                            handleStyleChange(
                              'flexDirection',
                              e.target.value as NexoreMakeElement['styles']['flexDirection']
                            )
                          }
                          className="w-full h-7 border rounded px-1 text-[10px] outline-none"
                          style={inputStyle}
                        >
                          <option value="row">Row</option>
                          <option value="column">Col</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                          Justify
                        </label>
                        <select
                          value={el.styles.justifyContent || 'flex-start'}
                          onChange={(e) =>
                            handleStyleChange(
                              'justifyContent',
                              e.target.value as NexoreMakeElement['styles']['justifyContent']
                            )
                          }
                          className="w-full h-7 border rounded px-1 text-[10px] outline-none"
                          style={inputStyle}
                        >
                          <option value="flex-start">Start</option>
                          <option value="center">Center</option>
                          <option value="flex-end">End</option>
                          <option value="space-between">Between</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                          Align
                        </label>
                        <select
                          value={el.styles.alignItems || 'stretch'}
                          onChange={(e) =>
                            handleStyleChange(
                              'alignItems',
                              e.target.value as NexoreMakeElement['styles']['alignItems']
                            )
                          }
                          className="w-full h-7 border rounded px-1 text-[10px] outline-none"
                          style={inputStyle}
                        >
                          <option value="stretch">Stretch</option>
                          <option value="flex-start">Start</option>
                          <option value="center">Center</option>
                          <option value="flex-end">End</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Padding & Margin */}
              <div
                className="space-y-2.5 pt-2 border-t"
                style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }}
              >
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                      Padding
                    </label>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {el.styles.paddingTop || '0px'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    value={parseInt(el.styles.paddingTop || '0', 10) || 0}
                    onChange={(e) => {
                      const val = `${e.target.value}px`;
                      onUpdateStyle(el.id, {
                        paddingTop: val,
                        paddingRight: val,
                        paddingBottom: val,
                        paddingLeft: val,
                      });
                    }}
                    className="w-full accent-foreground h-1 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                      Margin
                    </label>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {el.styles.marginTop || '0px'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    value={parseInt(el.styles.marginTop || '0', 10) || 0}
                    onChange={(e) => {
                      const val = `${e.target.value}px`;
                      onUpdateStyle(el.id, {
                        marginTop: val,
                        marginRight: val,
                        marginBottom: val,
                        marginLeft: val,
                      });
                    }}
                    className="w-full accent-foreground h-1 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <hr style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }} />

        {/* CONTENT & DATA (Supports all ElementTypes) */}
        <div className="space-y-3">
          {renderSectionHeader('content', <SlidersHorizontal className="h-3.5 w-3.5" />, 'Content & Data')}
          {openSections.content && (
            <div className="space-y-3 pt-1">
              {el.type !== 'divider' && el.type !== 'skeleton' && el.type !== 'spinner' && (
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Primary Text / Title
                  </label>
                  {el.type === 'interactive-code-block' || el.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={el.content || ''}
                      onChange={(e) => onUpdateProps(el.id, { content: e.target.value })}
                      className="w-full border rounded p-2 text-xs outline-none font-mono resize-y"
                      style={inputStyle}
                    />
                  ) : (
                    <input
                      type="text"
                      value={el.content || ''}
                      onChange={(e) => onUpdateProps(el.id, { content: e.target.value })}
                      className="w-full h-7 border rounded px-2 text-xs outline-none"
                      style={inputStyle}
                      placeholder="Enter text..."
                    />
                  )}
                </div>
              )}

              {SECONDARY_CONTENT_TYPES.has(el.type) && (
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Secondary Text / Subtitle
                  </label>
                  <input
                    type="text"
                    value={el.secondaryContent || ''}
                    onChange={(e) => onUpdateProps(el.id, { secondaryContent: e.target.value })}
                    className="w-full h-7 border rounded px-2 text-xs outline-none"
                    style={inputStyle}
                    placeholder="Secondary text or price..."
                  />
                </div>
              )}

              {LABEL_TYPES.has(el.type) && (
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Field Label / Kicker
                  </label>
                  <input
                    type="text"
                    value={el.label || ''}
                    onChange={(e) => onUpdateProps(el.id, { label: e.target.value })}
                    className="w-full h-7 border rounded px-2 text-xs outline-none"
                    style={inputStyle}
                    placeholder="Field label..."
                  />
                </div>
              )}

              {PLACEHOLDER_TYPES.has(el.type) && (
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={el.placeholder || ''}
                    onChange={(e) => onUpdateProps(el.id, { placeholder: e.target.value })}
                    className="w-full h-7 border rounded px-2 text-xs outline-none"
                    style={inputStyle}
                    placeholder="Placeholder..."
                  />
                </div>
              )}

              {el.type === 'testimonial-card' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={el.author || ''}
                      onChange={(e) => onUpdateProps(el.id, { author: e.target.value })}
                      className="w-full h-7 border rounded px-2 text-xs outline-none"
                      style={inputStyle}
                      placeholder="Elena Rostova"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={el.role || ''}
                      onChange={(e) => onUpdateProps(el.id, { role: e.target.value })}
                      className="w-full h-7 border rounded px-2 text-xs outline-none"
                      style={inputStyle}
                      placeholder="Principal Architect"
                    />
                  </div>
                </div>
              )}

              {VALUE_NUMBER_TYPES.has(el.type) && (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                      Numeric Value
                    </label>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {typeof el.value === 'number' ? el.value : 65}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={typeof el.value === 'number' ? el.value : 65}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value);
                      if (!isNaN(num)) onUpdateProps(el.id, { value: num });
                    }}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
              )}

              {el.type === 'rating' && (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                      Rating Stars (1 - 5)
                    </label>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {el.ratingValue ?? 5} / 5
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={el.ratingValue ?? 5}
                    onChange={(e) =>
                      onUpdateProps(el.id, { ratingValue: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-foreground h-1 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {ICON_SUPPORTED_TYPES.has(el.type) && (
                <div className="space-y-1.5">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Lucide Icon Name
                  </label>
                  <input
                    type="text"
                    value={el.iconName || ''}
                    onChange={(e) => onUpdateProps(el.id, { iconName: e.target.value })}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                    placeholder="Zap, Check, Terminal..."
                  />
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {COMMON_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => onUpdateProps(el.id, { iconName: icon })}
                        className={`px-1.5 py-0.5 text-[9px] font-mono rounded border transition-colors ${
                          el.iconName === icon
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(el.type === 'image' || el.type === 'avatar' || el.type === 'image-compare') && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                      Image URL (src)
                    </label>
                    <input
                      type="text"
                      value={el.src || ''}
                      onChange={(e) => onUpdateProps(el.id, { src: e.target.value })}
                      className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                      style={inputStyle}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                      Alt Description
                    </label>
                    <input
                      type="text"
                      value={el.alt || ''}
                      onChange={(e) => onUpdateProps(el.id, { alt: e.target.value })}
                      className="w-full h-7 border rounded px-2 text-xs outline-none"
                      style={inputStyle}
                      placeholder="Accessible image description"
                    />
                  </div>
                </div>
              )}

              {(el.type === 'button' || el.type === 'navigation') && (
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Link URL (href)
                  </label>
                  <input
                    type="text"
                    value={el.href || ''}
                    onChange={(e) => onUpdateProps(el.id, { href: e.target.value })}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                    placeholder="/docs or https://..."
                  />
                </div>
              )}

              {SPEED_TYPES.has(el.type) && (
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Animation Speed
                  </label>
                  <select
                    value={el.speed || 'normal'}
                    onChange={(e) =>
                      onUpdateProps(el.id, {
                        speed: e.target.value as 'slow' | 'normal' | 'fast',
                      })
                    }
                    className="w-full h-7 border rounded px-1.5 text-xs outline-none"
                    style={inputStyle}
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>
              )}

              {/* Interactive Items List Editor */}
              {ITEMS_LIST_TYPES.has(el.type) && (
                <div
                  className="space-y-2 pt-2 border-t"
                  style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }}
                >
                  <label
                    className="text-[10px] font-medium block"
                    style={{ color: 'var(--make-text-muted, #a1a1aa)' }}
                  >
                    List Items ({currentItems.length})
                  </label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                    {currentItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const next = [...currentItems];
                            next[idx] = e.target.value;
                            updateItemsList(next);
                          }}
                          className="flex-1 h-6 border rounded px-2 text-[11px] outline-none"
                          style={inputStyle}
                        />
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const next = [...currentItems];
                            const temp = next[idx - 1];
                            next[idx - 1] = next[idx];
                            next[idx] = temp;
                            updateItemsList(next);
                          }}
                          className="p-1 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === currentItems.length - 1}
                          onClick={() => {
                            if (idx === currentItems.length - 1) return;
                            const next = [...currentItems];
                            const temp = next[idx + 1];
                            next[idx + 1] = next[idx];
                            next[idx] = temp;
                            updateItemsList(next);
                          }}
                          className="p-1 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const next = currentItems.filter((_, i) => i !== idx);
                            updateItemsList(next);
                          }}
                          className="p-1 rounded border border-border text-muted-foreground hover:text-destructive"
                          title="Remove Item"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newItemText.trim()) {
                          e.preventDefault();
                          updateItemsList([...currentItems, newItemText.trim()]);
                          setNewItemText('');
                        }
                      }}
                      className="flex-1 h-7 border rounded px-2 text-xs outline-none"
                      style={inputStyle}
                      placeholder="Add new item..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newItemText.trim()) return;
                        updateItemsList([...currentItems, newItemText.trim()]);
                        setNewItemText('');
                      }}
                      className="h-7 px-2 rounded border border-border bg-muted hover:bg-accent text-foreground text-xs flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Checkable & Disableable states (single unified section, no duplicates) */}
              {(CHECKABLE_TYPES.has(el.type) || DISABLEABLE_TYPES.has(el.type)) && (
                <div
                  className="flex flex-col gap-2 pt-2 border-t"
                  style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }}
                >
                  {CHECKABLE_TYPES.has(el.type) && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="checked-prop"
                        checked={!!el.checked}
                        onChange={(e) => onUpdateProps(el.id, { checked: e.target.checked })}
                        className="rounded border-border text-foreground focus:ring-ring"
                      />
                      <label
                        htmlFor="checked-prop"
                        className="text-xs cursor-pointer"
                        style={{ color: 'var(--make-text-muted, #a1a1aa)' }}
                      >
                        Checked / Active State
                      </label>
                    </div>
                  )}
                  {DISABLEABLE_TYPES.has(el.type) && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="disabled-prop"
                        checked={!!el.disabled}
                        onChange={(e) => onUpdateProps(el.id, { disabled: e.target.checked })}
                        className="rounded border-border text-foreground focus:ring-ring"
                      />
                      <label
                        htmlFor="disabled-prop"
                        className="text-xs cursor-pointer"
                        style={{ color: 'var(--make-text-muted, #a1a1aa)' }}
                      >
                        Disabled State
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <hr style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }} />

        {/* TYPOGRAPHY */}
        <div className="space-y-3">
          {renderSectionHeader('typography', <Type className="h-3.5 w-3.5" />, 'Typography')}
          {openSections.typography && (
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                  Font Family
                </label>
                <select
                  value={el.styles.fontFamily || 'Inter, sans-serif'}
                  onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                  className="w-full h-7 border rounded px-1.5 text-xs outline-none"
                  style={inputStyle}
                >
                  <option value="Inter, sans-serif">Geist / Inter (Sans)</option>
                  <option value="'Space Grotesk', sans-serif">Space Grotesk (Display)</option>
                  <option value="'Fira Code', monospace">Geist Mono / Fira Code</option>
                  <option value="Georgia, serif">Georgia (Serif)</option>
                </select>
              </div>

              <MakeColorPicker
                label="Text Color"
                value={el.styles.color || '#ffffff'}
                onChange={(c) => handleStyleChange('color', c)}
              />

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Font Size
                  </label>
                  <input
                    type="text"
                    value={el.styles.fontSize || '14px'}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Font Weight
                  </label>
                  <select
                    value={el.styles.fontWeight || '400'}
                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                    className="w-full h-7 border rounded px-1.5 text-xs outline-none"
                    style={inputStyle}
                  >
                    <option value="300">Light (300)</option>
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Alignment
                  </label>
                  <select
                    value={el.styles.textAlign || 'left'}
                    onChange={(e) =>
                      handleStyleChange(
                        'textAlign',
                        e.target.value as NexoreMakeElement['styles']['textAlign']
                      )
                    }
                    className="w-full h-7 border rounded px-1.5 text-xs outline-none"
                    style={inputStyle}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Transform
                  </label>
                  <select
                    value={el.styles.textTransform || 'none'}
                    onChange={(e) =>
                      handleStyleChange(
                        'textTransform',
                        e.target.value as NexoreMakeElement['styles']['textTransform']
                      )
                    }
                    className="w-full h-7 border rounded px-1.5 text-xs outline-none"
                    style={inputStyle}
                  >
                    <option value="none">None</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="lowercase">lowercase</option>
                    <option value="capitalize">Capitalize</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Letter Spacing
                  </label>
                  <input
                    type="text"
                    value={el.styles.letterSpacing || '0px'}
                    onChange={(e) => handleStyleChange('letterSpacing', e.target.value)}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Line Height
                  </label>
                  <input
                    type="text"
                    value={el.styles.lineHeight || '1.5'}
                    onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <hr style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }} />

        {/* FILL & SURFACE */}
        <div className="space-y-3">
          {renderSectionHeader('fill', <Palette className="h-3.5 w-3.5" />, 'Fill & Surface')}
          {openSections.fill && (
            <div className="space-y-3 pt-1">
              <MakeColorPicker
                label="Background Color"
                value={el.styles.backgroundColor || 'transparent'}
                onChange={(c) => handleStyleChange('backgroundColor', c)}
              />

              <div className="space-y-1">
                <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                  Background Gradient
                </label>
                <input
                  type="text"
                  value={el.styles.backgroundGradient || ''}
                  onChange={(e) => handleStyleChange('backgroundGradient', e.target.value)}
                  className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                  style={inputStyle}
                  placeholder="linear-gradient(...) or none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Opacity
                  </label>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {Math.round(
                      (el.styles.opacity !== undefined ? Number(el.styles.opacity) : 1) * 100
                    )}
                    %
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={el.styles.opacity !== undefined ? el.styles.opacity : 1}
                  onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
                  className="w-full accent-foreground h-1 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        <hr style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }} />

        {/* BORDER & CORNERS */}
        <div className="space-y-3">
          {renderSectionHeader('border', <BoxSelect className="h-3.5 w-3.5" />, 'Border & Corners')}
          {openSections.border && (
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Corner Radius
                  </label>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {el.styles.borderRadius || '0px'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={parseInt(el.styles.borderRadius || '0', 10) || 0}
                  onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                  className="w-full accent-foreground h-1 rounded-lg cursor-pointer"
                />
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <input
                    type="text"
                    placeholder="TL"
                    value={el.styles.borderRadiusTopLeft || ''}
                    onChange={(e) => handleStyleChange('borderRadiusTopLeft', e.target.value)}
                    className="w-full h-6 border rounded px-1 text-[10px] text-center outline-none font-mono"
                    style={inputStyle}
                    title="Top Left Radius"
                  />
                  <input
                    type="text"
                    placeholder="TR"
                    value={el.styles.borderRadiusTopRight || ''}
                    onChange={(e) => handleStyleChange('borderRadiusTopRight', e.target.value)}
                    className="w-full h-6 border rounded px-1 text-[10px] text-center outline-none font-mono"
                    style={inputStyle}
                    title="Top Right Radius"
                  />
                  <input
                    type="text"
                    placeholder="BR"
                    value={el.styles.borderRadiusBottomRight || ''}
                    onChange={(e) => handleStyleChange('borderRadiusBottomRight', e.target.value)}
                    className="w-full h-6 border rounded px-1 text-[10px] text-center outline-none font-mono"
                    style={inputStyle}
                    title="Bottom Right Radius"
                  />
                  <input
                    type="text"
                    placeholder="BL"
                    value={el.styles.borderRadiusBottomLeft || ''}
                    onChange={(e) => handleStyleChange('borderRadiusBottomLeft', e.target.value)}
                    className="w-full h-6 border rounded px-1 text-[10px] text-center outline-none font-mono"
                    style={inputStyle}
                    title="Bottom Left Radius"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Border Width
                  </label>
                  <input
                    type="text"
                    value={el.styles.borderWidth || '0px'}
                    onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                    className="w-full h-7 border rounded px-2 text-xs outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                    Border Style
                  </label>
                  <select
                    value={el.styles.borderStyle || 'solid'}
                    onChange={(e) =>
                      handleStyleChange(
                        'borderStyle',
                        e.target.value as NexoreMakeElement['styles']['borderStyle']
                      )
                    }
                    className="w-full h-7 border rounded px-1.5 text-xs outline-none"
                    style={inputStyle}
                  >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </div>
              </div>

              <MakeColorPicker
                label="Border Color"
                value={el.styles.borderColor || 'transparent'}
                onChange={(c) => handleStyleChange('borderColor', c)}
              />
            </div>
          )}
        </div>

        <hr style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }} />

        {/* EFFECTS & TRANSFORMS */}
        <div className="space-y-3">
          {renderSectionHeader('effects', <Layers className="h-3.5 w-3.5" />, 'Effects & Transform')}
          {openSections.effects && (
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                  Elevation Shadow
                </label>
                <select
                  value={el.styles.boxShadow || 'none'}
                  onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                  className="w-full h-7 border rounded px-1.5 text-xs outline-none"
                  style={inputStyle}
                >
                  <option value="none">None</option>
                  <option value="0 1px 2px 0 rgba(0, 0, 0, 0.05)">Subtle (sm)</option>
                  <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Medium (md)</option>
                  <option value="0 10px 15px -3px rgba(0, 0, 0, 0.25)">Elevated (lg)</option>
                  <option value="0 20px 25px -5px rgba(0, 0, 0, 0.4)">Popover (xl)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                      Rotate
                    </label>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {el.styles.rotate || '0deg'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={parseInt(el.styles.rotate || '0', 10) || 0}
                    onChange={(e) => handleStyleChange('rotate', `${e.target.value}deg`)}
                    className="w-full accent-foreground h-1 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                      Scale
                    </label>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {el.styles.scaleX || '1'}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.05"
                    value={parseFloat(el.styles.scaleX || '1') || 1}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdateStyle(el.id, { scaleX: val, scaleY: val });
                    }}
                    className="w-full accent-foreground h-1 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <hr style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }} />

        {/* ADVANCED */}
        <div className="space-y-3">
          {renderSectionHeader('advanced', <Settings className="h-3.5 w-3.5" />, 'Advanced')}
          {openSections.advanced && (
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="space-y-1">
                <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                  Cursor
                </label>
                <select
                  value={el.styles.cursor || 'default'}
                  onChange={(e) => handleStyleChange('cursor', e.target.value)}
                  className="w-full h-7 border rounded px-1.5 text-xs outline-none"
                  style={inputStyle}
                >
                  <option value="default">Default</option>
                  <option value="pointer">Pointer</option>
                  <option value="text">Text</option>
                  <option value="grab">Grab</option>
                  <option value="not-allowed">Not Allowed</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px]" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                  Overflow
                </label>
                <select
                  value={el.styles.overflow || 'visible'}
                  onChange={(e) =>
                    handleStyleChange(
                      'overflow',
                      e.target.value as NexoreMakeElement['styles']['overflow']
                    )
                  }
                  className="w-full h-7 border rounded px-1.5 text-xs outline-none"
                  style={inputStyle}
                >
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                  <option value="scroll">Scroll</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
