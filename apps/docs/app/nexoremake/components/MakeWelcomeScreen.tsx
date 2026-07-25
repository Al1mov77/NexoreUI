'use client';

import React, { useState } from 'react';
import { nexoreTemplates, Template } from '../templates';
import { Layers, MousePointer2, Sparkles, Wand2, LayoutTemplate, Zap } from 'lucide-react';

interface MakeWelcomeScreenProps {
  onSelectTemplate: (template: Template) => void;
}

// Realistic HTML preview of template elements
function TemplatePreview({ template }: { template: Template }) {
  const containerW = 280;
  const containerH = 110;
  const scaleX = containerW / template.canvasSettings.width;
  const scaleY = containerH / template.canvasSettings.height;
  const scale = Math.min(scaleX, scaleY) * 0.9;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-black/40 relative">
      <div
        className="flex-shrink-0"
        style={{
          width: template.canvasSettings.width,
          height: template.canvasSettings.height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
          backgroundColor: template.canvasSettings.backgroundColor !== 'transparent' ? template.canvasSettings.backgroundColor : undefined,
        }}
      >
        {template.elements.map((el) => {
          const isText = el.type === 'text';
          const isButton = el.type === 'button';
          const isImage = el.type === 'image' || el.type === 'avatar';
          
          let bg = el.styles.backgroundColor;
          if (!bg && isButton) bg = '#7c3aed';
          if (!bg && el.type === 'input') bg = '#18181b';
          if (!bg && el.type === 'card') bg = '#09090b';

          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: el.position.x,
                top: el.position.y,
                width: el.size.width,
                height: el.size.height,
                backgroundColor: bg,
                color: el.styles.color || '#fff',
                borderRadius: el.styles.borderRadius || (isImage && el.type === 'avatar' ? '50%' : '4px'),
                borderWidth: el.styles.borderWidth,
                borderColor: el.styles.borderColor,
                borderStyle: el.styles.borderStyle,
                fontSize: el.styles.fontSize,
                fontWeight: el.styles.fontWeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: el.styles.textAlign === 'center' ? 'center' : (el.styles.textAlign === 'right' ? 'flex-end' : 'flex-start'),
                overflow: 'hidden',
                padding: '0 8px',
                opacity: el.styles.opacity,
                boxShadow: el.styles.boxShadow,
              }}
            >
              {isImage && el.src ? (
                <img src={el.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                el.content || (isText ? 'Text' : '')
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Sections': <LayoutTemplate className="w-5 h-5" />,
  'Forms': <Wand2 className="w-5 h-5" />,
  'Cards': <Layers className="w-5 h-5" />,
};

export default function MakeWelcomeScreen({ onSelectTemplate }: MakeWelcomeScreenProps) {
  const [leaving, setLeaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (template: Template) => {
    setSelectedId(template.id);
    setLeaving(true);
    setTimeout(() => onSelectTemplate(template), 600);
  };

  return (
    <div
      className={`absolute inset-0 z-10 overflow-y-auto transition-all duration-700 ${
        leaving ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Animated gradient background — fixed so it doesn't scroll */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0c0014 0%, #09090b 30%, #0c0014 100%)',
          }}
        />
        {/* Floating gradient orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
            top: '-10%',
            right: '-5%',
            animation: 'welcomeFloat 8s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
            bottom: '-15%',
            left: '-5%',
            animation: 'welcomeFloat 10s ease-in-out infinite alternate-reverse',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
            top: '40%',
            left: '30%',
            animation: 'welcomeFloat 12s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute w-[350px] h-[350px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
            top: '10%',
            left: '60%',
            animation: 'welcomeFloat 9s ease-in-out infinite alternate-reverse',
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full min-h-full flex flex-col items-center py-24 px-6">
        {/* Hero text with staggered animation */}
        <div
          className="text-center mb-12"
          style={{
            animation: 'welcomeFadeUp 0.8s ease-out forwards',
            opacity: 0,
          }}
        >
          {/* Glowing logo badge */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl blur-xl"
                style={{ background: 'rgba(139,92,246,0.4)' }}
              />
              <div className="relative p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-violet-400" />
              </div>
            </div>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Nexore Make
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
            Design beautiful UI components visually. Start from a template
            or drag elements from the sidebar.
          </p>
        </div>

        {/* Template grid with staggered entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {nexoreTemplates.map((template, index) => (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              disabled={leaving}
              className={`group text-left rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col overflow-hidden relative ${
                selectedId === template.id
                  ? 'border-violet-500 scale-[1.02] shadow-xl shadow-violet-500/20'
                  : 'border-zinc-800/60 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5 hover:scale-[1.01]'
              }`}
              style={{
                background: 'rgba(15,15,20,0.8)',
                backdropFilter: 'blur(12px)',
                animation: `welcomeFadeUp 0.8s ease-out ${0.2 + index * 0.15}s forwards`,
                opacity: 0,
              }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
              </div>

              {/* Preview area */}
              <div className="relative h-28 w-full overflow-hidden border-b border-zinc-800/40">
                <div className="absolute inset-0 p-3">
                  <TemplatePreview template={template} />
                </div>
                {/* Gradient fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[rgba(15,15,20,0.8)] to-transparent" />
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1 relative z-10">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 group-hover:text-violet-400 group-hover:border-violet-500/30 group-hover:bg-violet-500/10 transition-all duration-300">
                    {categoryIcons[template.category] || <Layers className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {template.name}
                    </h3>
                    <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">
                      {template.category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-1">
                  {template.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {template.elements.length} elements
                  </span>
                  <div className="flex items-center gap-1 text-xs font-medium text-violet-400 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    <span>Use template</span>
                    <Zap className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom hint */}
        <div
          className="text-center mt-8"
          style={{
            animation: 'welcomeFadeUp 0.8s ease-out 0.8s forwards',
            opacity: 0,
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800/40 text-zinc-500 text-xs">
            <MousePointer2 className="w-3.5 h-3.5" />
            <span>Or drag elements from the left toolbar to build from scratch</span>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes welcomeFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes welcomeFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
