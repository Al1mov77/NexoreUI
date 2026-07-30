import React from 'react';
import { 
  BringToFront, 
  SendToBack, 
  Trash2, 
  Copy, 
  Settings, 
  Sparkles, 
  Type, 
  Maximize2, 
  SlidersHorizontal,
  Palette,
  Sparkle,
  BoxSelect,
  Layers,
  Wand2
} from 'lucide-react';
import { NexoreMakeElement } from '../types';
import MakeColorPicker from './MakeColorPicker';

interface MakePropertiesPanelProps {
  selectedElement: NexoreMakeElement | null;
  onUpdateStyle: (id: string, styles: Partial<NexoreMakeElement['styles']>) => void;
  onUpdateProps: (id: string, payload: Partial<Omit<NexoreMakeElement, 'id' | 'styles' | 'position' | 'size'>>) => void;
  onUpdateSize: (id: string, width: number | string, height: number | string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
}

export default function MakePropertiesPanel({
  selectedElement,
  onUpdateStyle,
  onUpdateProps,
  onUpdateSize,
  onDelete,
  onDuplicate,
  onBringToFront,
  onSendToBack,
}: MakePropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div
        className="w-[280px] shrink-0 border-l flex flex-col items-center justify-center p-6 text-center select-none h-full"
        style={{
          backgroundColor: 'var(--make-panel-bg, #09090b)',
          borderColor: 'var(--make-border, #27272a)',
          color: 'var(--make-text-muted, #71717a)',
        }}
      >
        <Settings className="h-8 w-8 animate-pulse mb-3 text-violet-400" />
        <h4 className="text-xs font-semibold" style={{ color: 'var(--make-text, #ffffff)' }}>No element selected</h4>
        <p className="text-[10px] mt-1 max-w-[180px]">
          Click on an element on the canvas or drag one from the left toolbar to edit properties.
        </p>
      </div>
    );
  }

  const el = selectedElement;

  const handleStyleChange = (key: keyof NexoreMakeElement['styles'], value: any) => {
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

  // Apply visual style presets
  const applyPreset = (preset: 'glass' | 'neon' | 'neumorphic' | 'brutalist' | 'cyberpunk') => {
    switch (preset) {
      case 'glass':
        onUpdateStyle(el.id, {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropBlur: '16',
          borderColor: 'rgba(255, 255, 255, 0.18)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
          color: '#ffffff',
        });
        break;
      case 'neon':
        onUpdateStyle(el.id, {
          backgroundColor: '#09090b',
          borderColor: '#8b5cf6',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.25)',
          color: '#a78bfa',
        });
        onUpdateProps(el.id, { animationPreset: 'glow' });
        break;
      case 'neumorphic':
        onUpdateStyle(el.id, {
          backgroundColor: '#18181b',
          borderRadius: '16px',
          borderWidth: '0px',
          boxShadow: '6px 6px 14px #0c0c0e, -6px -6px 14px #242428',
          color: '#e4e4e7',
        });
        break;
      case 'brutalist':
        onUpdateStyle(el.id, {
          backgroundColor: '#fbbf24',
          borderColor: '#000000',
          borderWidth: '3px',
          borderStyle: 'solid',
          borderRadius: '0px',
          boxShadow: '5px 5px 0px #000000',
          color: '#000000',
          fontWeight: '700',
        });
        break;
      case 'cyberpunk':
        onUpdateStyle(el.id, {
          backgroundColor: '#000000',
          borderColor: '#06b6d4',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderRadius: '4px',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.5), inset 0 0 15px rgba(6, 182, 212, 0.2)',
          color: '#06b6d4',
          fontWeight: '700',
        });
        break;
    }
  };

  return (
    <div
      className="w-[280px] shrink-0 border-l flex flex-col h-full overflow-hidden select-none"
      style={{
        backgroundColor: 'var(--make-panel-bg, #09090b)',
        borderColor: 'var(--make-border, #27272a)',
        color: 'var(--make-text, #e4e4e7)',
      }}
    >
      {/* Header toolbar */}
      <div
        className="p-3.5 border-b flex items-center justify-between shrink-0"
        style={{
          backgroundColor: 'var(--make-surface, #18181b)',
          borderColor: 'var(--make-border, #27272a)',
        }}
      >
        <div>
          <h4 className="text-xs font-semibold capitalize flex items-center gap-1.5" style={{ color: 'var(--make-text, #ffffff)' }}>
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            {el.type} settings
          </h4>
          <input
            type="text"
            value={el.name}
            onChange={(e) => onUpdateProps(el.id, { name: e.target.value })}
            className="bg-transparent text-[10px] outline-none font-mono mt-0.5 w-32"
            style={{ color: 'var(--make-text-muted, #71717a)' }}
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(el.id)}
            title="Duplicate"
            className="p-1.5 rounded hover:bg-violet-500/10 hover:text-violet-400 transition-colors cursor-pointer"
            style={{ color: 'var(--make-text-muted, #a1a1aa)' }}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onBringToFront(el.id)}
            title="Bring to Front"
            className="p-1.5 rounded hover:bg-violet-500/10 hover:text-violet-400 transition-colors cursor-pointer"
            style={{ color: 'var(--make-text-muted, #a1a1aa)' }}
          >
            <BringToFront className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onSendToBack(el.id)}
            title="Send to Back"
            className="p-1.5 rounded hover:bg-violet-500/10 hover:text-violet-400 transition-colors cursor-pointer"
            style={{ color: 'var(--make-text-muted, #a1a1aa)' }}
          >
            <SendToBack className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(el.id)}
            title="Delete"
            className="p-1.5 rounded hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
            style={{ color: 'var(--make-text-muted, #a1a1aa)' }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main scrollable properties area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin" style={{ overscrollBehavior: 'contain' }}>
        
        {/* PRESETS SECTION */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <Wand2 className="h-3 w-3 text-violet-400" />
            Quick Presets
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => applyPreset('glass')}
              className="px-2 py-1.5 text-[10px] font-medium rounded border transition-all cursor-pointer hover:border-violet-500/50 hover:text-violet-400"
              style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)' }}
            >
              💎 Glassmorphic
            </button>
            <button
              onClick={() => applyPreset('neon')}
              className="px-2 py-1.5 text-[10px] font-medium rounded border transition-all cursor-pointer hover:border-violet-500/50 hover:text-violet-400"
              style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)' }}
            >
              ✨ Neon Glow
            </button>
            <button
              onClick={() => applyPreset('neumorphic')}
              className="px-2 py-1.5 text-[10px] font-medium rounded border transition-all cursor-pointer hover:border-violet-500/50 hover:text-violet-400"
              style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)' }}
            >
              🔘 Neumorphism
            </button>
            <button
              onClick={() => applyPreset('brutalist')}
              className="px-2 py-1.5 text-[10px] font-medium rounded border transition-all cursor-pointer hover:border-violet-500/50 hover:text-violet-400"
              style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)' }}
            >
              ⚡ Brutalist
            </button>
          </div>
        </div>

        {/* CONTENT & LABEL */}
        {(el.type === 'button' || el.type === 'text' || el.type === 'badge' || el.type === 'input' || el.type === 'switch' || el.type === 'checkbox' || el.type === 'progress') && (
          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
              <Type className="h-3 w-3" />
              Content & Label
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Text Content</label>
              <input
                type="text"
                value={el.type === 'progress' ? (el.label || '') : (el.content || '')}
                onChange={(e) => onUpdateProps(el.id, el.type === 'progress' ? { label: e.target.value } : { content: e.target.value })}
                className="w-full border rounded px-2.5 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
            {el.type === 'input' && (
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Placeholder</label>
                <input
                  type="text"
                  value={el.placeholder || ''}
                  onChange={(e) => onUpdateProps(el.id, { placeholder: e.target.value })}
                  className="w-full border rounded px-2.5 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                />
              </div>
            )}
          </div>
        )}

        {/* LINK & OVERFLOW (For All) */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <Layers className="h-3 w-3" />
            General Props
          </div>
          <div>
            <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Link (href)</label>
            <input
              type="text"
              value={el.href || ''}
              onChange={(e) => onUpdateProps(el.id, { href: e.target.value })}
              placeholder="https://..."
              className="w-full border rounded px-2.5 py-1 text-xs outline-none focus:border-violet-500"
              style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="disabled-prop-all"
                checked={el.disabled || false}
                onChange={(e) => onUpdateProps(el.id, { disabled: e.target.checked })}
                className="accent-violet-500"
              />
              <label htmlFor="disabled-prop-all" className="text-xs" style={{ color: 'var(--make-text, #ffffff)' }}>Disabled State</label>
            </div>
            
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Overflow</label>
               <select
                value={el.styles.overflow || 'visible'}
                onChange={(e) => handleStyleChange('overflow', e.target.value)}
                className="w-full border rounded px-2 py-0.5 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
               >
                 <option value="visible" className="bg-zinc-900">Visible</option>
                 <option value="hidden" className="bg-zinc-900">Hidden</option>
                 <option value="scroll" className="bg-zinc-900">Scroll</option>
                 <option value="auto" className="bg-zinc-900">Auto</option>
               </select>
            </div>
          </div>
        </div>

        {/* COMPONENT SPECIFIC PROPS */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <SlidersHorizontal className="h-3 w-3" />
            Specific Props
          </div>
          {(el.type === 'button' || el.type === 'badge' || el.type === 'card' || el.type === 'input') && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Variant</label>
                <select
                  value={el.variant || 'default'}
                  onChange={(e) => onUpdateProps(el.id, { variant: e.target.value as any })}
                  className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                >
                  <option value="default" className="bg-zinc-900">Default</option>
                  <option value="secondary" className="bg-zinc-900">Secondary</option>
                  <option value="outline" className="bg-zinc-900">Outline</option>
                  <option value="ghost" className="bg-zinc-900">Ghost</option>
                  <option value="destructive" className="bg-zinc-900">Destructive</option>
                  <option value="link" className="bg-zinc-900">Link</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Size</label>
                <select
                  value={el.sizeVariant || 'default'}
                  onChange={(e) => onUpdateProps(el.id, { sizeVariant: e.target.value as any })}
                  className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                >
                  <option value="default" className="bg-zinc-900">Default (md)</option>
                  <option value="sm" className="bg-zinc-900">Small (sm)</option>
                  <option value="lg" className="bg-zinc-900">Large (lg)</option>
                  <option value="icon" className="bg-zinc-900">Icon</option>
                </select>
              </div>
            </div>
          )}
          
          {(el.type === 'button' || el.type === 'input' || el.type === 'checkbox' || el.type === 'switch') && (
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="disabled-prop"
                checked={el.disabled || false}
                onChange={(e) => onUpdateProps(el.id, { disabled: e.target.checked })}
                className="accent-violet-500"
              />
              <label htmlFor="disabled-prop" className="text-xs" style={{ color: 'var(--make-text, #ffffff)' }}>Disabled State</label>
            </div>
          )}

          {(el.type === 'checkbox' || el.type === 'switch') && (
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="checkbox" 
                id="checked-prop"
                checked={el.checked || false}
                onChange={(e) => onUpdateProps(el.id, { checked: e.target.checked })}
                className="accent-violet-500"
              />
              <label htmlFor="checked-prop" className="text-xs" style={{ color: 'var(--make-text, #ffffff)' }}>Checked State</label>
            </div>
          )}

          {(el.type === 'image' || el.type === 'avatar') && (
            <div className="mt-2 space-y-2">
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Image URL (src)</label>
                <input
                  type="text"
                  value={el.src || ''}
                  onChange={(e) => onUpdateProps(el.id, { src: e.target.value })}
                  placeholder="https://..."
                  className="w-full border rounded px-2.5 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                />
              </div>
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Alt Text</label>
                <input
                  type="text"
                  value={el.alt || ''}
                  onChange={(e) => onUpdateProps(el.id, { alt: e.target.value })}
                  placeholder="Image description"
                  className="w-full border rounded px-2.5 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                />
              </div>
            </div>
          )}

          {el.type === 'progress' && (
            <div className="mt-2 space-y-2">
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Value (0-100%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parseInt(String(el.value ?? '60'), 10) || 0}
                    onChange={(e) => onUpdateProps(el.id, { value: parseInt(e.target.value, 10) })}
                    className="w-full accent-violet-500 cursor-pointer"
                  />
                  <span className="text-[10px] w-8 font-mono">{el.value ?? 60}%</span>
                </div>
              </div>
            </div>
          )}

          {el.type === 'divider' && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Style</label>
                <select
                  value={el.styles.borderStyle || 'solid'}
                  onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
                  className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                >
                  <option value="solid" className="bg-zinc-900">Solid</option>
                  <option value="dashed" className="bg-zinc-900">Dashed</option>
                  <option value="dotted" className="bg-zinc-900">Dotted</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Thickness</label>
                <input
                  type="text"
                  value={el.styles.borderWidth || '1px'}
                  onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                  className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                />
              </div>
            </div>
          )}

          {el.type === 'icon' && (
            <div className="mt-2 space-y-2">
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Icon Name (Lucide)</label>
                <input
                  type="text"
                  value={el.iconName || ''}
                  onChange={(e) => onUpdateProps(el.id, { iconName: e.target.value })}
                  placeholder="e.g. Activity, Heart"
                  className="w-full border rounded px-2.5 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                />
              </div>
            </div>
          )}

          {(el.type === 'container' || el.type === 'flex' || el.type === 'grid') && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Display</label>
                <select
                  value={el.styles.display || 'flex'}
                  onChange={(e) => handleStyleChange('display', e.target.value)}
                  className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                >
                  <option value="flex" className="bg-zinc-900">Flex</option>
                  <option value="grid" className="bg-zinc-900">Grid</option>
                  <option value="block" className="bg-zinc-900">Block</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Direction</label>
                <select
                  value={el.styles.flexDirection || 'row'}
                  onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                  className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                >
                  <option value="row" className="bg-zinc-900">Row</option>
                  <option value="column" className="bg-zinc-900">Column</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Justify</label>
                <select
                  value={el.styles.justifyContent || 'flex-start'}
                  onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                  className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                >
                  <option value="flex-start" className="bg-zinc-900">Start</option>
                  <option value="center" className="bg-zinc-900">Center</option>
                  <option value="flex-end" className="bg-zinc-900">End</option>
                  <option value="space-between" className="bg-zinc-900">Space Between</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Align</label>
                <select
                  value={el.styles.alignItems || 'stretch'}
                  onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                  className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                >
                  <option value="stretch" className="bg-zinc-900">Stretch</option>
                  <option value="flex-start" className="bg-zinc-900">Start</option>
                  <option value="center" className="bg-zinc-900">Center</option>
                  <option value="flex-end" className="bg-zinc-900">End</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Gap</label>
                <input
                  type="text"
                  value={el.styles.gap || '0px'}
                  onChange={(e) => handleStyleChange('gap', e.target.value)}
                  className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                  style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* DIMENSIONS */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <Maximize2 className="h-3 w-3" />
            Dimensions
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Width</label>
              <input
                type="text"
                value={el.size.width}
                onChange={(e) => handleSizeChange('width', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs font-mono outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Height</label>
              <input
                type="text"
                value={el.size.height}
                onChange={(e) => handleSizeChange('height', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs font-mono outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
          </div>
        </div>

        {/* COLORS & STYLES */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <Palette className="h-3 w-3" />
            Background & Colors
          </div>
          
          <MakeColorPicker
            label="Background Color"
            value={el.styles.backgroundColor || 'transparent'}
            onChange={(val) => handleStyleChange('backgroundColor', val)}
          />

          <MakeColorPicker
            label="Text Color"
            value={el.styles.color || '#ffffff'}
            onChange={(val) => handleStyleChange('color', val)}
          />
        </div>

        {/* TYPOGRAPHY */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <Type className="h-3 w-3" />
            Typography
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Font Size</label>
              <input
                type="text"
                value={el.styles.fontSize || '14px'}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Font Weight</label>
              <select
                value={el.styles.fontWeight || '400'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              >
                <option value="300" className="bg-zinc-900">Light (300)</option>
                <option value="400" className="bg-zinc-900">Normal (400)</option>
                <option value="500" className="bg-zinc-900">Medium (500)</option>
                <option value="600" className="bg-zinc-900">SemiBold (600)</option>
                <option value="700" className="bg-zinc-900">Bold (700)</option>
                <option value="800" className="bg-zinc-900">ExtraBold (800)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Font Family</label>
              <select
                value={el.styles.fontFamily || 'inherit'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              >
                <option value="inherit" className="bg-zinc-900">Inherit</option>
                <option value="sans-serif" className="bg-zinc-900">Sans-serif</option>
                <option value="serif" className="bg-zinc-900">Serif</option>
                <option value="monospace" className="bg-zinc-900">Monospace</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Font Style</label>
              <select
                value={el.styles.fontStyle || 'normal'}
                onChange={(e) => handleStyleChange('fontStyle', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              >
                <option value="normal" className="bg-zinc-900">Normal</option>
                <option value="italic" className="bg-zinc-900">Italic</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Text Decoration</label>
              <select
                value={el.styles.textDecoration || 'none'}
                onChange={(e) => handleStyleChange('textDecoration', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              >
                <option value="none" className="bg-zinc-900">None</option>
                <option value="underline" className="bg-zinc-900">Underline</option>
                <option value="line-through" className="bg-zinc-900">Line Through</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Text Align</label>
              <select
                value={el.styles.textAlign || 'left'}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              >
                <option value="left" className="bg-zinc-900">Left</option>
                <option value="center" className="bg-zinc-900">Center</option>
                <option value="right" className="bg-zinc-900">Right</option>
                <option value="justify" className="bg-zinc-900">Justify</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Transform</label>
              <select
                value={el.styles.textTransform || 'none'}
                onChange={(e) => handleStyleChange('textTransform', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              >
                <option value="none" className="bg-zinc-900">None</option>
                <option value="uppercase" className="bg-zinc-900">UPPERCASE</option>
                <option value="lowercase" className="bg-zinc-900">lowercase</option>
                <option value="capitalize" className="bg-zinc-900">Capitalize</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Letter Spacing</label>
              <input
                type="text"
                value={el.styles.letterSpacing || 'normal'}
                onChange={(e) => handleStyleChange('letterSpacing', e.target.value)}
                placeholder="e.g. 1px, 0.05em"
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Line Height</label>
              <input
                type="text"
                value={el.styles.lineHeight || 'normal'}
                onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                placeholder="e.g. 1.5, 24px"
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
          </div>
        </div>

        {/* PADDING & MARGIN */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <BoxSelect className="h-3 w-3" />
            Spacing
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Padding (All)</label>
              <input
                type="text"
                value={el.styles.paddingTop || '0px'}
                onChange={(e) => {
                  handleStyleChange('paddingTop', e.target.value);
                  handleStyleChange('paddingBottom', e.target.value);
                  handleStyleChange('paddingLeft', e.target.value);
                  handleStyleChange('paddingRight', e.target.value);
                }}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Margin (All)</label>
              <input
                type="text"
                value={el.styles.marginTop || '0px'}
                onChange={(e) => {
                  handleStyleChange('marginTop', e.target.value);
                  handleStyleChange('marginBottom', e.target.value);
                  handleStyleChange('marginLeft', e.target.value);
                  handleStyleChange('marginRight', e.target.value);
                }}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
          </div>
        </div>

        {/* BORDERS & SHADOWS */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <BoxSelect className="h-3 w-3" />
            Borders & Corner Radius
          </div>

          <div>
            <div className="flex items-center justify-between text-[9px] mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>
              <span>Corner Radius</span>
              <span>{el.styles.borderRadius || '8px'}</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={parseInt(el.styles.borderRadius || '8', 10)}
              onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              className="w-full accent-violet-500 cursor-pointer"
            />
          </div>

          <MakeColorPicker
            label="Border Color"
            value={el.styles.borderColor || 'transparent'}
            onChange={(val) => handleStyleChange('borderColor', val)}
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Border Width</label>
              <input
                type="text"
                value={el.styles.borderWidth || '0px'}
                onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Backdrop Blur</label>
              <input
                type="text"
                value={el.styles.backdropBlur || '0'}
                onChange={(e) => handleStyleChange('backdropBlur', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
                placeholder="0 - 20 (px)"
              />
            </div>
          </div>
        </div>

        {/* ANIMATION & EFFECTS */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <Sparkles className="h-3 w-3 text-violet-400" />
            Animation & Effects
          </div>
          <div>
            <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Animation Preset</label>
            <select
              value={el.animationPreset || 'none'}
              onChange={(e) => onUpdateProps(el.id, { animationPreset: e.target.value as any })}
              className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
              style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
            >
              <option value="none" className="bg-zinc-900">None (Static)</option>
              <option value="pulse" className="bg-zinc-900">Pulse</option>
              <option value="bounce" className="bg-zinc-900">Bounce</option>
              <option value="glow" className="bg-zinc-900">Neon Glow</option>
              <option value="spin" className="bg-zinc-900">Spin</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Rotate (deg)</label>
              <input
                type="text"
                value={el.styles.rotate || '0deg'}
                onChange={(e) => handleStyleChange('rotate', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Scale</label>
              <input
                type="text"
                value={el.styles.scaleX || '1'}
                onChange={(e) => {
                  handleStyleChange('scaleX', e.target.value);
                  handleStyleChange('scaleY', e.target.value);
                }}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[9px] mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>
              <span>Opacity</span>
              <span>{Math.round((el.styles.opacity ?? 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={el.styles.opacity ?? 1}
              onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
              className="w-full accent-violet-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Box Shadow</label>
            <input
              type="text"
              value={el.styles.boxShadow || 'none'}
              onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
              placeholder="0 4px 6px rgba(0,0,0,0.1)"
              className="w-full border rounded px-2 py-1 text-xs font-mono outline-none focus:border-violet-500"
              style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
             <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Filter: Blur</label>
              <input
                type="text"
                value={el.styles.blur || '0px'}
                onChange={(e) => handleStyleChange('blur', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Mix Blend Mode</label>
              <select
                value={el.styles.mixBlendMode || 'normal'}
                onChange={(e) => handleStyleChange('mixBlendMode', e.target.value)}
                className="w-full border rounded px-2 py-1 text-xs outline-none focus:border-violet-500"
                style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text, #ffffff)' }}
              >
                <option value="normal" className="bg-zinc-900">Normal</option>
                <option value="multiply" className="bg-zinc-900">Multiply</option>
                <option value="screen" className="bg-zinc-900">Screen</option>
                <option value="overlay" className="bg-zinc-900">Overlay</option>
                <option value="difference" className="bg-zinc-900">Difference</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
