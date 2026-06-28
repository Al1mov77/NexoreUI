import React from 'react';
import { 
  BringToFront, 
  SendToBack, 
  Trash2, 
  Copy, 
  Settings, 
  Sparkles, 
  Type, 
  Layers, 
  Maximize2, 
  SlidersHorizontal 
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
      <div className="w-[280px] shrink-0 bg-zinc-950 border-l border-zinc-900 flex flex-col items-center justify-center p-6 text-center select-none">
        <Settings className="h-8 w-8 text-zinc-700 animate-pulse mb-3" />
        <h4 className="text-xs font-semibold text-zinc-400">No element selected</h4>
        <p className="text-[10px] text-zinc-600 mt-1 max-w-[180px]">
          Click on an element on the canvas or add one from the toolbar to adjust its properties.
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

  return (
    <div className="w-[280px] shrink-0 bg-zinc-950 border-l border-zinc-900 flex flex-col h-full overflow-hidden select-none">
      {/* Element Header */}
      <div className="p-4 border-b border-zinc-900 bg-zinc-950/50 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5 capitalize">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            {el.type} settings
          </h4>
          <input
            type="text"
            value={el.name}
            onChange={(e) => onUpdateProps(el.id, { name: e.target.value })}
            className="bg-transparent text-[10px] text-zinc-500 outline-none hover:text-zinc-400 focus:text-zinc-300 font-mono mt-0.5 w-36"
          />
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(el.id)}
            title="Duplicate"
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onBringToFront(el.id)}
            title="Bring to Front"
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
          >
            <BringToFront className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onSendToBack(el.id)}
            title="Send to Back"
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
          >
            <SendToBack className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(el.id)}
            title="Delete"
            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Property Editors Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin properties-scroll-container" style={{ overscrollBehavior: 'contain' }}>
        
        {/* SECTION: Layout & Dimensions */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Maximize2 className="h-3 w-3" />
            Size & Position
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[9px] text-zinc-500 block mb-1">Width</label>
              <input
                type="text"
                value={el.size.width}
                onChange={(e) => handleSizeChange('width', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-[9px] text-zinc-500 block mb-1">Height</label>
              <input
                type="text"
                value={el.size.height}
                onChange={(e) => handleSizeChange('height', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION: Content details */}
        {['button', 'text', 'badge', 'image', 'switch', 'checkbox', 'progress', 'avatar', 'icon'].includes(el.type) && (
          <div className="space-y-3">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Type className="h-3 w-3" />
              Content Properties
            </div>
            {el.type === 'input' && (
              <div>
                <label className="text-[9px] text-zinc-500 block mb-1">Placeholder</label>
                <input
                  type="text"
                  value={el.placeholder || ''}
                  onChange={(e) => onUpdateProps(el.id, { placeholder: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 outline-none"
                />
              </div>
            )}
            {el.type === 'icon' && (
              <div>
                <label className="text-[9px] text-zinc-500 block mb-1">Icon Name (Lucide)</label>
                <input
                  type="text"
                  value={el.iconName || 'Sparkles'}
                  onChange={(e) => onUpdateProps(el.id, { iconName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 outline-none font-mono"
                />
              </div>
            )}
            {el.type !== 'input' && el.type !== 'icon' && (
              <div>
                <label className="text-[9px] text-zinc-500 block mb-1">
                  {el.type === 'image' ? 'Image URL' : el.type === 'progress' ? 'Progress %' : 'Text Content'}
                </label>
                <input
                  type="text"
                  value={el.content || ''}
                  onChange={(e) => onUpdateProps(el.id, { content: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* SECTION: Fills & Backgrounds */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="h-3 w-3" />
            Background & Colors
          </div>
          {el.type !== 'divider' && el.type !== 'image' && (
            <MakeColorPicker
              label="Background Fill"
              value={el.styles.backgroundColor || 'transparent'}
              onChange={(color) => handleStyleChange('backgroundColor', color)}
            />
          )}
          {['button', 'text', 'badge', 'input', 'switch', 'checkbox', 'progress', 'avatar', 'icon'].includes(el.type) && (
            <MakeColorPicker
              label="Text/Foreground Color"
              value={el.styles.color || '#ffffff'}
              onChange={(color) => handleStyleChange('color', color)}
            />
          )}
        </div>

        {/* SECTION: Borders & Radius */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <SlidersHorizontal className="h-3 w-3" />
            Borders
          </div>
          
          <div>
            <label className="text-[9px] text-zinc-500 block mb-1">Corner Radius</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="50"
                value={parseInt(el.styles.borderRadius || '0', 10) || 0}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                className="flex-1 accent-violet-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-mono text-zinc-400 w-8 text-right">
                {el.styles.borderRadius || '0px'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[9px] text-zinc-500 block mb-1">Border Width</label>
              <select
                value={el.styles.borderWidth || '0px'}
                onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 outline-none"
              >
                <option value="0px">None</option>
                <option value="1px">1px</option>
                <option value="2px">2px</option>
                <option value="4px">4px</option>
                <option value="8px">8px</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] text-zinc-500 block mb-1">Border Style</label>
              <select
                value={el.styles.borderStyle || 'solid'}
                onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 outline-none"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          </div>

          {(el.styles.borderWidth && el.styles.borderWidth !== '0px') && (
            <MakeColorPicker
              label="Border Color"
              value={el.styles.borderColor || '#27272a'}
              onChange={(color) => handleStyleChange('borderColor', color)}
            />
          )}
        </div>

        {/* SECTION: Spacing & Alignment */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <SlidersHorizontal className="h-3 w-3" />
            Spacing & Font
          </div>
          {['button', 'text', 'badge', 'input'].includes(el.type) && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-zinc-500 block mb-1">Font Size</label>
                <input
                  type="text"
                  value={el.styles.fontSize || '14px'}
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 font-mono outline-none"
                  placeholder="14px"
                />
              </div>
              <div>
                <label className="text-[9px] text-zinc-500 block mb-1">Font Weight</label>
                <select
                  value={el.styles.fontWeight || '400'}
                  onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 outline-none"
                >
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                </select>
              </div>
            </div>
          )}

          {el.type === 'text' && (
            <div>
              <label className="text-[9px] text-zinc-500 block mb-1">Text Alignment</label>
              <div className="grid grid-cols-4 gap-1 bg-zinc-900 rounded p-1">
                {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => handleStyleChange('textAlign', align)}
                    className={`py-1 text-[10px] capitalize rounded font-medium cursor-pointer transition-all ${
                      (el.styles.textAlign || 'left') === align ? 'bg-zinc-800 text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {align[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION: Shadow & Effects */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <SlidersHorizontal className="h-3 w-3" />
            Shadow & Effects
          </div>
          <div>
            <label className="text-[9px] text-zinc-500 block mb-1">Box Shadow</label>
            <select
              value={el.styles.boxShadow || 'none'}
              onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 outline-none"
            >
              <option value="none">None</option>
              <option value="0 1px 3px rgba(0,0,0,0.1)">Small (sm)</option>
              <option value="0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)">Medium (md)</option>
              <option value="0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)">Large (lg)</option>
              <option value="0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)">XLarge (xl)</option>
              <option value="0 25px 50px -12px rgba(0, 0, 0, 0.25)">2XLarge (2xl)</option>
              <option value="0 0 15px rgba(139, 92, 246, 0.5)">Violet Glow</option>
            </select>
          </div>
          
          <div>
            <label className="text-[9px] text-zinc-500 block mb-1">Opacity</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={el.styles.opacity !== undefined ? el.styles.opacity : 1}
                onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
                className="flex-1 accent-violet-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-mono text-zinc-400 w-8 text-right">
                {Math.round((el.styles.opacity !== undefined ? el.styles.opacity : 1) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* SECTION: Gradient Builder */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <SlidersHorizontal className="h-3 w-3" />
            Gradient
          </div>
          <div>
            <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Background Gradient</label>
            <select
              value={el.styles.backgroundGradient || 'none'}
              onChange={(e) => handleStyleChange('backgroundGradient', e.target.value)}
              className="w-full rounded px-2 py-1.5 text-xs outline-none border"
              style={{
                backgroundColor: 'var(--make-input-bg, #09090b)',
                borderColor: 'var(--make-border, #27272a)',
                color: 'var(--make-text, #e4e4e7)',
              }}
            >
              <option value="none">None (Solid Color)</option>
              <option value="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">Purple Dream</option>
              <option value="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">Pink Sunset</option>
              <option value="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">Ocean Blue</option>
              <option value="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">Mint Fresh</option>
              <option value="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">Warm Flame</option>
              <option value="linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)">Lavender</option>
              <option value="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)">Peach</option>
              <option value="linear-gradient(135deg, #0c0c0c 0%, #27272a 50%, #7c3aed 100%)">Dark Violet</option>
              <option value="linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)">Glass Light</option>
            </select>
          </div>
        </div>

        {/* SECTION: Transform */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <SlidersHorizontal className="h-3 w-3" />
            Transform
          </div>
          <div>
            <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Rotate (deg)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-180"
                max="180"
                value={parseInt(el.styles.rotate || '0', 10)}
                onChange={(e) => handleStyleChange('rotate', e.target.value)}
                className="flex-1 accent-violet-500 h-1 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-mono w-10 text-right" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                {el.styles.rotate || '0'}°
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Scale X</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="3"
                value={el.styles.scaleX || '1'}
                onChange={(e) => handleStyleChange('scaleX', e.target.value)}
                className="w-full rounded px-2 py-1 text-xs font-mono outline-none border"
                style={{
                  backgroundColor: 'var(--make-input-bg, #09090b)',
                  borderColor: 'var(--make-border, #27272a)',
                  color: 'var(--make-text, #e4e4e7)',
                }}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Scale Y</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="3"
                value={el.styles.scaleY || '1'}
                onChange={(e) => handleStyleChange('scaleY', e.target.value)}
                className="w-full rounded px-2 py-1 text-xs font-mono outline-none border"
                style={{
                  backgroundColor: 'var(--make-input-bg, #09090b)',
                  borderColor: 'var(--make-border, #27272a)',
                  color: 'var(--make-text, #e4e4e7)',
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Skew X (deg)</label>
              <input
                type="number"
                min="-45"
                max="45"
                value={el.styles.skewX || '0'}
                onChange={(e) => handleStyleChange('skewX', e.target.value)}
                className="w-full rounded px-2 py-1 text-xs font-mono outline-none border"
                style={{
                  backgroundColor: 'var(--make-input-bg, #09090b)',
                  borderColor: 'var(--make-border, #27272a)',
                  color: 'var(--make-text, #e4e4e7)',
                }}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Skew Y (deg)</label>
              <input
                type="number"
                min="-45"
                max="45"
                value={el.styles.skewY || '0'}
                onChange={(e) => handleStyleChange('skewY', e.target.value)}
                className="w-full rounded px-2 py-1 text-xs font-mono outline-none border"
                style={{
                  backgroundColor: 'var(--make-input-bg, #09090b)',
                  borderColor: 'var(--make-border, #27272a)',
                  color: 'var(--make-text, #e4e4e7)',
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION: Backdrop & Filters */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <Sparkles className="h-3 w-3 text-violet-400" />
            Filters & Backdrop
          </div>
          <div>
            <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Backdrop Blur (px)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="30"
                value={parseInt(el.styles.backdropBlur || '0', 10)}
                onChange={(e) => handleStyleChange('backdropBlur', e.target.value)}
                className="flex-1 accent-violet-500 h-1 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-mono w-8 text-right" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                {el.styles.backdropBlur || '0'}px
              </span>
            </div>
          </div>
          <div>
            <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Brightness (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="50"
                max="200"
                value={parseInt(el.styles.brightness || '100', 10)}
                onChange={(e) => handleStyleChange('brightness', e.target.value)}
                className="flex-1 accent-violet-500 h-1 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-mono w-10 text-right" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                {el.styles.brightness || '100'}%
              </span>
            </div>
          </div>
          <div>
            <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Contrast (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="50"
                max="200"
                value={parseInt(el.styles.contrast || '100', 10)}
                onChange={(e) => handleStyleChange('contrast', e.target.value)}
                className="flex-1 accent-violet-500 h-1 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-mono w-10 text-right" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                {el.styles.contrast || '100'}%
              </span>
            </div>
          </div>
          <div>
            <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Saturate (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="200"
                value={parseInt(el.styles.saturate || '100', 10)}
                onChange={(e) => handleStyleChange('saturate', e.target.value)}
                className="flex-1 accent-violet-500 h-1 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-mono w-10 text-right" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>
                {el.styles.saturate || '100'}%
              </span>
            </div>
          </div>
        </div>

        {/* SECTION: Advanced Spacing */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <SlidersHorizontal className="h-3 w-3" />
            Advanced Spacing
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const).map((prop) => (
              <div key={prop}>
                <label className="text-[9px] block mb-1 capitalize" style={{ color: 'var(--make-text-muted, #71717a)' }}>
                  {prop.replace('padding', 'Pad ')}
                </label>
                <input
                  type="text"
                  value={el.styles[prop] || '0px'}
                  onChange={(e) => handleStyleChange(prop, e.target.value)}
                  className="w-full rounded px-2 py-1 text-xs font-mono outline-none border"
                  style={{
                    backgroundColor: 'var(--make-input-bg, #09090b)',
                    borderColor: 'var(--make-border, #27272a)',
                    color: 'var(--make-text, #e4e4e7)',
                  }}
                  placeholder="0px"
                />
              </div>
            ))}
          </div>
          {['button', 'text', 'badge', 'input'].includes(el.type) && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Letter Spacing</label>
                <input
                  type="text"
                  value={el.styles.letterSpacing || '0px'}
                  onChange={(e) => handleStyleChange('letterSpacing', e.target.value)}
                  className="w-full rounded px-2 py-1 text-xs font-mono outline-none border"
                  style={{
                    backgroundColor: 'var(--make-input-bg, #09090b)',
                    borderColor: 'var(--make-border, #27272a)',
                    color: 'var(--make-text, #e4e4e7)',
                  }}
                  placeholder="0px"
                />
              </div>
              <div>
                <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Line Height</label>
                <input
                  type="text"
                  value={el.styles.lineHeight || '1.5'}
                  onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                  className="w-full rounded px-2 py-1 text-xs font-mono outline-none border"
                  style={{
                    backgroundColor: 'var(--make-input-bg, #09090b)',
                    borderColor: 'var(--make-border, #27272a)',
                    color: 'var(--make-text, #e4e4e7)',
                  }}
                  placeholder="1.5"
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Cursor</label>
              <select
                value={el.styles.cursor || 'default'}
                onChange={(e) => handleStyleChange('cursor', e.target.value)}
                className="w-full rounded px-2 py-1 text-xs outline-none border"
                style={{
                  backgroundColor: 'var(--make-input-bg, #09090b)',
                  borderColor: 'var(--make-border, #27272a)',
                  color: 'var(--make-text, #e4e4e7)',
                }}
              >
                <option value="default">Default</option>
                <option value="pointer">Pointer</option>
                <option value="grab">Grab</option>
                <option value="crosshair">Crosshair</option>
                <option value="text">Text</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] block mb-1" style={{ color: 'var(--make-text-muted, #71717a)' }}>Overflow</label>
              <select
                value={el.styles.overflow || 'visible'}
                onChange={(e) => handleStyleChange('overflow', e.target.value)}
                className="w-full rounded px-2 py-1 text-xs outline-none border"
                style={{
                  backgroundColor: 'var(--make-input-bg, #09090b)',
                  borderColor: 'var(--make-border, #27272a)',
                  color: 'var(--make-text, #e4e4e7)',
                }}
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
                <option value="scroll">Scroll</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION: Quick Style Presets */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <Sparkles className="h-3 w-3 text-violet-400" />
            Quick Presets
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              {
                name: 'Glassmorphism',
                styles: {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  backdropBlur: '12',
                  borderWidth: '1px',
                  borderColor: 'rgba(255,255,255,0.15)',
                  borderStyle: 'solid',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                } as any,
              },
              {
                name: 'Neon Glow',
                styles: {
                  backgroundColor: '#7c3aed',
                  boxShadow: '0 0 20px rgba(139,92,246,0.6), 0 0 40px rgba(139,92,246,0.3)',
                  borderRadius: '12px',
                  color: '#ffffff',
                } as any,
              },
              {
                name: 'Neumorphism',
                styles: {
                  backgroundColor: '#1a1a2e',
                  boxShadow: '8px 8px 16px #0d0d1a, -8px -8px 16px #272742',
                  borderRadius: '16px',
                  borderWidth: '0px',
                } as any,
              },
              {
                name: 'Brutalist',
                styles: {
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  borderWidth: '3px',
                  borderColor: '#000000',
                  borderStyle: 'solid',
                  borderRadius: '0px',
                  boxShadow: '4px 4px 0px #000000',
                } as any,
              },
            ].map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onUpdateStyle(el.id, preset.styles)}
                className="px-2.5 py-2 text-[10px] font-medium rounded-lg border transition-all cursor-pointer hover:border-violet-500/50"
                style={{
                  backgroundColor: 'var(--make-surface, #18181b)',
                  borderColor: 'var(--make-border, #27272a)',
                  color: 'var(--make-text-muted, #a1a1aa)',
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION: Micro Animations */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-violet-400" />
            Micro-Animations
          </div>
          <div>
            <label className="text-[9px] text-zinc-500 block mb-1">Animation Preset</label>
            <select
              value={el.animationPreset || 'none'}
              onChange={(e) => onUpdateProps(el.id, { animationPreset: e.target.value as any })}
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 outline-none"
            >
              <option value="none">None (Static)</option>
              <option value="pulse">Pulse (Breathing)</option>
              <option value="bounce">Bounce (Jumping)</option>
              <option value="fade-in">Fade In</option>
              <option value="slide-in">Slide In</option>
              <option value="glow">Glow Pulse</option>
              <option value="spin">Spin (Spinning)</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
export { MakePropertiesPanel };
export type { MakePropertiesPanelProps };
