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
      {label && <label className="text-[11px] font-medium text-zinc-400 select-none">{label}</label>}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="w-7 h-7 rounded border border-zinc-800 flex items-center justify-center cursor-pointer overflow-hidden bg-zinc-950 hover:border-zinc-700 transition-colors"
            style={{
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
              <div className="absolute left-0 mt-2 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl w-44 grid grid-cols-4 gap-1.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onChange(color);
                      setShowPresets(false);
                    }}
                    className={`w-8 h-8 rounded border border-zinc-800 cursor-pointer overflow-hidden transition-all ${
                      value === color ? 'ring-2 ring-violet-500 scale-105' : 'hover:scale-105'
                    }`}
                    style={{
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
        
        <div className="relative flex-1 flex items-center bg-zinc-950 border border-zinc-800 rounded px-2 h-7 focus-within:border-zinc-700 transition-colors">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-xs text-zinc-100 outline-none font-mono"
            placeholder="#ffffff"
          />
          <label className="cursor-pointer text-zinc-500 hover:text-zinc-300 flex items-center">
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
