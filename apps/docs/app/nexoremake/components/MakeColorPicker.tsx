import React, { useState } from 'react';
import { Pipette } from 'lucide-react';

interface MakeColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  'transparent',
  '#ffffff',
  '#09090b',
  '#71717a',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
];

export default function MakeColorPicker({ value, onChange, label }: MakeColorPickerProps) {
  const [showPresets, setShowPresets] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && <label className="text-[11px] font-medium select-none block" style={{ color: 'var(--make-text-muted, #a1a1aa)' }}>{label}</label>}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="w-7 h-7 rounded border flex items-center justify-center cursor-pointer overflow-hidden transition-colors"
            style={{
              backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
              borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
              backgroundImage: value === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0'
            }}
          >
            {value !== 'transparent' && (
              <div 
                className="w-full h-full" 
                style={{ backgroundColor: value }} 
              />
            )}
          </button>
          
          {showPresets && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowPresets(false)} 
              />
              <div
                className="absolute left-0 mt-2 z-50 p-2 border rounded-lg shadow-xl w-44 grid grid-cols-4 gap-1.5"
                style={{
                  backgroundColor: 'rgba(9, 9, 11, 0.9)',
                  borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.12))',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  boxShadow: '0 0 0 1px rgba(139, 92, 246, 0.06), 0 10px 30px rgba(0, 0, 0, 0.4)',
                }}
              >
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onChange(color);
                      setShowPresets(false);
                    }}
                    className={`w-8 h-8 rounded border cursor-pointer overflow-hidden transition-all ${
                      value === color ? 'ring-2 ring-violet-500 scale-105' : 'hover:scale-105'
                    }`}
                    style={{
                      borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
                      backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                      backgroundSize: '8px 8px',
                      backgroundColor: color !== 'transparent' ? color : 'transparent'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        <div
          className="relative flex-1 flex items-center border rounded px-2 h-7 transition-all"
          style={{
            backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
            borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
          }}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-xs outline-none font-mono"
            style={{ color: 'var(--make-text, #ffffff)' }}
            placeholder="#ffffff"
          />
          <label className="cursor-pointer flex items-center" style={{ color: 'var(--make-text-muted, #71717a)' }}>
            <Pipette className="h-3 w-3 shrink-0" />
            <input
              type="color"
              value={value.startsWith('#') && value.length === 7 ? value : '#8b5cf6'}
              onChange={(e) => onChange(e.target.value)}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
