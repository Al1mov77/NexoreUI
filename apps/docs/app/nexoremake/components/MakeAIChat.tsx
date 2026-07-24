import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, Send, Wand2, AlertCircle } from 'lucide-react';
import { CanvasSettings, NexoreMakeElement, ElementType } from '../types';

interface MakeAIChatProps {
  elements: NexoreMakeElement[];
  selectedId: string | null;
  canvasSettings: CanvasSettings;
  onApplyAIChanges: (elements: NexoreMakeElement[], settings: CanvasSettings) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
}

const quickActions = [
  { label: '🎨 Red Button', prompt: 'Change selected element to red color' },
  { label: '✨ Neon Glow', prompt: 'Add neon glow shadow effect' },
  { label: '💎 Glassmorphic', prompt: 'Make element glassmorphic with blur backdrop' },
  { label: '📝 Login form', prompt: 'Create a login form with email, password, and submit button' },
];

const COLOR_MAP: Record<string, { bg: string; text: string; shadow: string; border?: string }> = {
  red: { bg: '#ef4444', text: '#ffffff', shadow: '0 4px 20px rgba(239, 68, 68, 0.45)', border: '#dc2626' },
  красный: { bg: '#ef4444', text: '#ffffff', shadow: '0 4px 20px rgba(239, 68, 68, 0.45)', border: '#dc2626' },
  красным: { bg: '#ef4444', text: '#ffffff', shadow: '0 4px 20px rgba(239, 68, 68, 0.45)', border: '#dc2626' },
  красного: { bg: '#ef4444', text: '#ffffff', shadow: '0 4px 20px rgba(239, 68, 68, 0.45)', border: '#dc2626' },
  blue: { bg: '#3b82f6', text: '#ffffff', shadow: '0 4px 20px rgba(59, 130, 246, 0.45)', border: '#2563eb' },
  синий: { bg: '#3b82f6', text: '#ffffff', shadow: '0 4px 20px rgba(59, 130, 246, 0.45)', border: '#2563eb' },
  синим: { bg: '#3b82f6', text: '#ffffff', shadow: '0 4px 20px rgba(59, 130, 246, 0.45)', border: '#2563eb' },
  голубой: { bg: '#06b6d4', text: '#ffffff', shadow: '0 4px 20px rgba(6, 182, 212, 0.45)', border: '#0891b2' },
  green: { bg: '#10b981', text: '#ffffff', shadow: '0 4px 20px rgba(16, 185, 129, 0.45)', border: '#059669' },
  зеленый: { bg: '#10b981', text: '#ffffff', shadow: '0 4px 20px rgba(16, 185, 129, 0.45)', border: '#059669' },
  зеленым: { bg: '#10b981', text: '#ffffff', shadow: '0 4px 20px rgba(16, 185, 129, 0.45)', border: '#059669' },
  purple: { bg: '#8b5cf6', text: '#ffffff', shadow: '0 4px 20px rgba(139, 92, 246, 0.45)', border: '#7c3aed' },
  фиолетовый: { bg: '#8b5cf6', text: '#ffffff', shadow: '0 4px 20px rgba(139, 92, 246, 0.45)', border: '#7c3aed' },
  фиолетовым: { bg: '#8b5cf6', text: '#ffffff', shadow: '0 4px 20px rgba(139, 92, 246, 0.45)', border: '#7c3aed' },
  yellow: { bg: '#eab308', text: '#000000', shadow: '0 4px 20px rgba(234, 179, 8, 0.45)', border: '#ca8a04' },
  желтый: { bg: '#eab308', text: '#000000', shadow: '0 4px 20px rgba(234, 179, 8, 0.45)', border: '#ca8a04' },
  желтым: { bg: '#eab308', text: '#000000', shadow: '0 4px 20px rgba(234, 179, 8, 0.45)', border: '#ca8a04' },
  orange: { bg: '#f97316', text: '#ffffff', shadow: '0 4px 20px rgba(249, 115, 22, 0.45)', border: '#ea580c' },
  оранжевый: { bg: '#f97316', text: '#ffffff', shadow: '0 4px 20px rgba(249, 115, 22, 0.45)', border: '#ea580c' },
  pink: { bg: '#ec4899', text: '#ffffff', shadow: '0 4px 20px rgba(236, 72, 153, 0.45)', border: '#db2777' },
  розовый: { bg: '#ec4899', text: '#ffffff', shadow: '0 4px 20px rgba(236, 72, 153, 0.45)', border: '#db2777' },
  white: { bg: '#ffffff', text: '#09090b', shadow: '0 4px 20px rgba(255, 255, 255, 0.25)', border: '#e4e4e7' },
  белый: { bg: '#ffffff', text: '#09090b', shadow: '0 4px 20px rgba(255, 255, 255, 0.25)', border: '#e4e4e7' },
  белым: { bg: '#ffffff', text: '#09090b', shadow: '0 4px 20px rgba(255, 255, 255, 0.25)', border: '#e4e4e7' },
  dark: { bg: '#18181b', text: '#ffffff', shadow: '0 4px 20px rgba(0, 0, 0, 0.5)', border: '#27272a' },
  темный: { bg: '#18181b', text: '#ffffff', shadow: '0 4px 20px rgba(0, 0, 0, 0.5)', border: '#27272a' },
  черный: { bg: '#09090b', text: '#ffffff', shadow: '0 4px 20px rgba(0, 0, 0, 0.6)', border: '#27272a' },
};

function processAIPrompt(
  prompt: string,
  currentElements: NexoreMakeElement[],
  selectedId: string | null,
  canvasSettings: CanvasSettings
): { elements: NexoreMakeElement[]; message: string } {
  const lowerPrompt = prompt.toLowerCase().trim();
  const baseId = () => 'el_' + Math.random().toString(36).substring(2, 9);
  const cx = canvasSettings.width / 2;
  const cy = canvasSettings.height / 2;
  const maxZ = currentElements.reduce((max, el) => Math.max(max, el.zIndex), 0);

  // Target element for modification if selected or if referring to existing element
  const targetElement = selectedId
    ? currentElements.find((el) => el.id === selectedId)
    : currentElements.length > 0
    ? currentElements[currentElements.length - 1]
    : null;

  const isModificationRequest =
    selectedId ||
    lowerPrompt.includes('color') ||
    lowerPrompt.includes('цвет') ||
    lowerPrompt.includes('красн') ||
    lowerPrompt.includes('сини') ||
    lowerPrompt.includes('зелен') ||
    lowerPrompt.includes('фиолет') ||
    lowerPrompt.includes('бел') ||
    lowerPrompt.includes('черн') ||
    lowerPrompt.includes('измен') ||
    lowerPrompt.includes('помен') ||
    lowerPrompt.includes('улучш') ||
    lowerPrompt.includes('make') ||
    lowerPrompt.includes('change') ||
    lowerPrompt.includes('set ') ||
    lowerPrompt.includes('glow') ||
    lowerPrompt.includes('glass');

  const isCreationRequest =
    lowerPrompt.includes('create') ||
    lowerPrompt.includes('add') ||
    lowerPrompt.includes('добав') ||
    lowerPrompt.includes('создай') ||
    lowerPrompt.includes('сделай новую') ||
    lowerPrompt.includes('form') ||
    lowerPrompt.includes('login') ||
    lowerPrompt.includes('profile');

  // 1. MODIFY EXISTING / SELECTED ELEMENT
  if (targetElement && isModificationRequest && !isCreationRequest) {
    const updatedElements = currentElements.map((el) => {
      if (el.id !== targetElement.id) return el;

      const newStyles = { ...el.styles };
      let newContent = el.content;
      let newAnimation = el.animationPreset;

      // Check color match
      for (const [colorName, colorDef] of Object.entries(COLOR_MAP)) {
        if (lowerPrompt.includes(colorName)) {
          newStyles.backgroundColor = colorDef.bg;
          newStyles.color = colorDef.text;
          newStyles.boxShadow = colorDef.shadow;
          if (colorDef.border) newStyles.borderColor = colorDef.border;
          break;
        }
      }

      // Check glassmorphism
      if (lowerPrompt.includes('glass') || lowerPrompt.includes('стекл')) {
        newStyles.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        newStyles.backdropBlur = '16';
        newStyles.borderColor = 'rgba(255, 255, 255, 0.15)';
        newStyles.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        newStyles.borderRadius = '16px';
      }

      // Check neon
      if (lowerPrompt.includes('neon') || lowerPrompt.includes('glow') || lowerPrompt.includes('неон')) {
        newStyles.boxShadow = '0 0 20px rgba(139, 92, 246, 0.7), 0 0 40px rgba(139, 92, 246, 0.3)';
        newStyles.borderColor = '#8b5cf6';
        newAnimation = 'glow';
      }

      // Check rounded / border radius
      if (lowerPrompt.includes('round') || lowerPrompt.includes('скругл') || lowerPrompt.includes('radius')) {
        newStyles.borderRadius = '24px';
      }

      // Check text change
      const textMatch = lowerPrompt.match(/(?:text|caption|label|надпись|текст)[:= ]+["']?([^"']+)["']?/i);
      if (textMatch && textMatch[1]) {
        newContent = textMatch[1].trim();
      }

      return {
        ...el,
        styles: newStyles,
        content: newContent,
        animationPreset: newAnimation,
      };
    });

    return {
      elements: updatedElements,
      message: `Updated "${targetElement.name || targetElement.type}" according to your request!`,
    };
  }

  // 2. CREATE NEW ELEMENTS
  const newElements: NexoreMakeElement[] = [...currentElements];

  // Determine color if specified in prompt
  let initialColor = COLOR_MAP.purple;
  for (const [colorName, colorDef] of Object.entries(COLOR_MAP)) {
    if (lowerPrompt.includes(colorName)) {
      initialColor = colorDef;
      break;
    }
  }

  if (lowerPrompt.includes('button') || lowerPrompt.includes('кнопк')) {
    const isNeon = lowerPrompt.includes('neon') || lowerPrompt.includes('glow') || lowerPrompt.includes('неон');
    const isGlass = lowerPrompt.includes('glass') || lowerPrompt.includes('стекл');

    newElements.push({
      id: baseId(),
      type: 'button',
      name: isNeon ? 'Neon Button' : isGlass ? 'Glass Button' : 'Custom Button',
      position: { x: cx - 80, y: cy - 22 },
      size: { width: 160, height: 44 },
      zIndex: maxZ + 1,
      styles: {
        backgroundColor: isGlass ? 'rgba(255,255,255,0.08)' : initialColor.bg,
        color: initialColor.text,
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: isNeon
          ? '0 0 20px rgba(139,92,246,0.7), 0 0 40px rgba(139,92,246,0.3)'
          : isGlass
          ? '0 8px 32px rgba(0,0,0,0.2)'
          : initialColor.shadow,
        borderWidth: isGlass ? '1px' : '0px',
        borderColor: isGlass ? 'rgba(255,255,255,0.2)' : initialColor.border || 'transparent',
        borderStyle: 'solid',
      },
      content: isNeon ? '✨ Neon Click' : isGlass ? 'Glass Button' : 'Click Me',
      animationPreset: isNeon ? 'glow' : 'none',
    });

    return {
      elements: newElements,
      message: `Created a customized button!`,
    };
  }

  if (lowerPrompt.includes('card') || lowerPrompt.includes('карточк') || lowerPrompt.includes('карт')) {
    const isGlass = lowerPrompt.includes('glass') || lowerPrompt.includes('стекл');
    const isProfile = lowerPrompt.includes('profile') || lowerPrompt.includes('профил');

    newElements.push({
      id: baseId(),
      type: 'card',
      name: isGlass ? 'Glass Card' : isProfile ? 'Profile Card' : 'Custom Card',
      position: { x: cx - 140, y: cy - 100 },
      size: { width: 280, height: 200 },
      zIndex: maxZ + 1,
      styles: {
        backgroundColor: isGlass ? 'rgba(255,255,255,0.08)' : initialColor.bg,
        borderRadius: '16px',
        borderWidth: '1px',
        borderColor: isGlass ? 'rgba(255,255,255,0.15)' : initialColor.border || '#27272a',
        borderStyle: 'solid',
        boxShadow: initialColor.shadow,
      },
      content: '',
      animationPreset: 'none',
    });

    if (isProfile) {
      newElements.push({
        id: baseId(),
        type: 'avatar',
        name: 'Profile Avatar',
        position: { x: cx - 24, y: cy - 80 },
        size: { width: 48, height: 48 },
        zIndex: maxZ + 2,
        styles: { backgroundColor: '#7c3aed' },
        content: 'U',
        animationPreset: 'none',
      });
      newElements.push({
        id: baseId(),
        type: 'text',
        name: 'Profile Name',
        position: { x: cx - 60, y: cy - 20 },
        size: { width: 120, height: 24 },
        zIndex: maxZ + 3,
        styles: { color: '#ffffff', fontSize: '16px', fontWeight: '600', textAlign: 'center' },
        content: 'Alex Rivera',
        animationPreset: 'none',
      });
      newElements.push({
        id: baseId(),
        type: 'button',
        name: 'Follow Button',
        position: { x: cx - 50, y: cy + 20 },
        size: { width: 100, height: 32 },
        zIndex: maxZ + 4,
        styles: { backgroundColor: '#7c3aed', color: '#ffffff', borderRadius: '8px', fontSize: '12px', fontWeight: '600' },
        content: 'Follow',
        animationPreset: 'none',
      });
    }

    return {
      elements: newElements,
      message: isProfile ? 'Created a profile card with avatar and follow button!' : 'Created a custom styled card!',
    };
  }

  if (lowerPrompt.includes('form') || lowerPrompt.includes('login') || lowerPrompt.includes('форм') || lowerPrompt.includes('логин')) {
    newElements.push({ id: baseId(), type: 'card', name: 'Form Container', position: { x: cx - 160, y: cy - 140 }, size: { width: 320, height: 280 }, zIndex: maxZ + 1, styles: { backgroundColor: 'var(--make-surface, #18181b)', borderRadius: '16px', borderWidth: '1px', borderColor: 'var(--make-border, #27272a)', borderStyle: 'solid', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }, content: '', animationPreset: 'none' });
    newElements.push({ id: baseId(), type: 'text', name: 'Form Title', position: { x: cx - 130, y: cy - 120 }, size: { width: 260, height: 30 }, zIndex: maxZ + 2, styles: { color: 'var(--make-text, #ffffff)', fontSize: '18px', fontWeight: '700', textAlign: 'center' }, content: 'Welcome Back', animationPreset: 'none' });
    newElements.push({ id: baseId(), type: 'input', name: 'Email Input', position: { x: cx - 130, y: cy - 70 }, size: { width: 260, height: 40 }, zIndex: maxZ + 3, styles: { backgroundColor: 'var(--make-bg, #09090b)', borderRadius: '8px', borderWidth: '1px', borderColor: 'var(--make-border, #27272a)', borderStyle: 'solid', color: 'var(--make-text-muted, #a1a1aa)', fontSize: '13px' }, placeholder: 'Email address', animationPreset: 'none' });
    newElements.push({ id: baseId(), type: 'input', name: 'Password Input', position: { x: cx - 130, y: cy - 15 }, size: { width: 260, height: 40 }, zIndex: maxZ + 4, styles: { backgroundColor: 'var(--make-bg, #09090b)', borderRadius: '8px', borderWidth: '1px', borderColor: 'var(--make-border, #27272a)', borderStyle: 'solid', color: 'var(--make-text-muted, #a1a1aa)', fontSize: '13px' }, placeholder: 'Password', animationPreset: 'none' });
    newElements.push({ id: baseId(), type: 'button', name: 'Submit Button', position: { x: cx - 130, y: cy + 45 }, size: { width: 260, height: 42 }, zIndex: maxZ + 5, styles: { backgroundColor: '#7c3aed', color: '#ffffff', borderRadius: '8px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }, content: 'Sign In', animationPreset: 'none' });
    return { elements: newElements, message: 'Created a login form!' };
  }

  // Generic new element
  newElements.push({
    id: baseId(),
    type: 'button',
    name: 'Custom Element',
    position: { x: cx - 70, y: cy - 20 },
    size: { width: 140, height: 40 },
    zIndex: maxZ + 1,
    styles: {
      backgroundColor: initialColor.bg,
      color: initialColor.text,
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: '600',
      boxShadow: initialColor.shadow,
    },
    content: 'AI Element',
    animationPreset: 'none',
  });

  return {
    elements: newElements,
    message: `Generated custom element on canvas!`,
  };
}

export default function MakeAIChat({ elements, selectedId, canvasSettings, onApplyAIChanges }: MakeAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I'm your AI Design Assistant. Select any element to modify it or ask me to build something:\n\n• \"Color red\" / \"Make button blue\"\n• \"Add glassmorphic card\"\n• \"Create a login form\"\n• \"Add neon glow effect\"",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processPrompt = (userMessage: string) => {
    setInput('');
    setMessages((prev) => [...prev, { id: 'msg_' + Math.random().toString(36).substring(2, 9), sender: 'user', text: userMessage }]);
    setIsLoading(true);

    setTimeout(() => {
      try {
        const result = processAIPrompt(userMessage, elements, selectedId, canvasSettings);
        onApplyAIChanges(result.elements, canvasSettings);
        setMessages((prev) => [...prev, { id: 'ai_' + Math.random().toString(36).substring(2, 9), sender: 'ai', text: result.message }]);
      } catch (err: any) {
        setMessages((prev) => [...prev, { id: 'err_' + Math.random().toString(36).substring(2, 9), sender: 'system', text: `Error: ${err.message}` }]);
      } finally {
        setIsLoading(false);
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    processPrompt(input.trim());
  };

  return (
    <div className="flex flex-col h-full select-none" style={{ backgroundColor: 'var(--make-panel-bg, #09090b)' }}>
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin" style={{ overscrollBehavior: 'contain' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-violet-600 text-white'
                  : msg.sender === 'system'
                  ? 'bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[11px]'
                  : 'border'
              }`}
              style={
                msg.sender === 'ai'
                  ? {
                      backgroundColor: 'var(--make-surface, #18181b)',
                      borderColor: 'var(--make-border, #27272a)',
                      color: 'var(--make-text-muted, #a1a1aa)',
                    }
                  : undefined
              }
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-400 mb-1.5">
                  <Sparkles className="h-3 w-3" />
                  <span>Nexore AI</span>
                </div>
              )}
              {msg.sender === 'system' && (
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-red-400 mb-1.5">
                  <AlertCircle className="h-3 w-3" />
                  <span>Error</span>
                </div>
              )}
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="rounded-xl p-3 flex items-center gap-2 text-xs border"
              style={{
                backgroundColor: 'var(--make-surface, #18181b)',
                borderColor: 'var(--make-border, #27272a)',
                color: 'var(--make-text-muted, #a1a1aa)',
              }}
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400" />
              <span>AI is processing...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 3 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => processPrompt(action.prompt)}
              disabled={isLoading}
              className="px-2.5 py-1.5 text-[10px] rounded-lg border transition-all cursor-pointer hover:border-violet-500/50 hover:text-violet-400 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--make-surface, #18181b)',
                borderColor: 'var(--make-border, #27272a)',
                color: 'var(--make-text-muted, #a1a1aa)',
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-3 border-t" style={{ borderColor: 'var(--make-border, #27272a)' }}>
        <div
          className="flex items-center gap-2 border rounded-xl px-3 py-2 transition-colors focus-within:border-violet-500/50"
          style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)' }}
        >
          <Wand2 className="h-3.5 w-3.5 text-violet-400 shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Describe change or component..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-zinc-500"
            style={{ color: 'var(--make-text, #e4e4e7)' }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="text-violet-400 hover:text-violet-300 disabled:text-zinc-700 cursor-pointer transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
export { MakeAIChat };
export type { MakeAIChatProps };
