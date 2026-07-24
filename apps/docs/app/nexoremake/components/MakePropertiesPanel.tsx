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
                value={el.content || ''}
                onChange={(e) => onUpdateProps(el.id, { content: e.target.value })}
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
              </select>
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
        </div>

      </div>
    </div>
  );
}
