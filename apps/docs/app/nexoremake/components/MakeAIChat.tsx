import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, Send, Wand2, AlertCircle } from 'lucide-react';
import { CanvasSettings, NexoreMakeElement, ElementType } from '../types';

interface MakeAIChatProps {
  elements: NexoreMakeElement[];
  canvasSettings: CanvasSettings;
  onApplyAIChanges: (elements: NexoreMakeElement[], settings: CanvasSettings) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
}

const quickActions = [
  { label: '🎨 Glassmorphic card', prompt: 'Create a glassmorphic card with blur backdrop, semi-transparent background, and subtle border' },
  { label: '✨ Neon button', prompt: 'Create a neon glowing button with violet/purple colors and glow shadow effect' },
  { label: '📝 Login form', prompt: 'Create a simple login form with email input, password input, and a submit button' },
  { label: '🃏 Profile card', prompt: 'Create a profile card with avatar, name text, and a follow button' },
];

function generateElementsFromPrompt(
  prompt: string,
  currentElements: NexoreMakeElement[],
  canvasSettings: CanvasSettings
): { elements: NexoreMakeElement[]; message: string } {
  const lowerPrompt = prompt.toLowerCase();
  const baseId = () => 'el_' + Math.random().toString(36).substr(2, 9);
  const maxZ = currentElements.reduce((max, el) => Math.max(max, el.zIndex), 0);
  const cx = canvasSettings.width / 2;
  const cy = canvasSettings.height / 2;
  const newElements: NexoreMakeElement[] = [...currentElements];

  if (lowerPrompt.includes('button') || lowerPrompt.includes('кнопк')) {
    const isNeon = lowerPrompt.includes('neon') || lowerPrompt.includes('glow') || lowerPrompt.includes('неон');
    const isGlass = lowerPrompt.includes('glass') || lowerPrompt.includes('стекл');
    newElements.push({
      id: baseId(), type: 'button', name: isNeon ? 'Neon Button' : isGlass ? 'Glass Button' : 'AI Button',
      position: { x: cx - 80, y: cy - 22 }, size: { width: 160, height: 44 }, zIndex: maxZ + 1,
      styles: {
        backgroundColor: isNeon ? '#7c3aed' : isGlass ? 'rgba(255,255,255,0.1)' : '#6d28d9',
        color: '#ffffff', borderRadius: '12px', fontSize: '14px', fontWeight: '600',
        boxShadow: isNeon ? '0 0 20px rgba(139,92,246,0.6), 0 0 40px rgba(139,92,246,0.3)' : isGlass ? '0 8px 32px rgba(0,0,0,0.2)' : '0 4px 14px rgba(109,40,217,0.4)',
        borderWidth: isGlass ? '1px' : '0px', borderColor: isGlass ? 'rgba(255,255,255,0.2)' : 'transparent', borderStyle: 'solid',
      },
      content: isNeon ? '✨ Neon Click' : isGlass ? 'Glass Button' : 'Click Me',
      animationPreset: isNeon ? 'glow' : 'none',
    });
    return { elements: newElements, message: isNeon ? "Created a neon-glowing button with violet shadow!" : isGlass ? "Created a glassmorphic button with blur backdrop!" : "Created a styled button!" };
  }

  if (lowerPrompt.includes('card') || lowerPrompt.includes('карточк') || lowerPrompt.includes('карт')) {
    const isGlass = lowerPrompt.includes('glass') || lowerPrompt.includes('стекл') || lowerPrompt.includes('morphi');
    const isProfile = lowerPrompt.includes('profile') || lowerPrompt.includes('профил');
    newElements.push({
      id: baseId(), type: 'card', name: isGlass ? 'Glass Card' : isProfile ? 'Profile Card' : 'AI Card',
      position: { x: cx - 140, y: cy - 100 }, size: { width: 280, height: 200 }, zIndex: maxZ + 1,
      styles: {
        backgroundColor: isGlass ? 'rgba(255,255,255,0.08)' : '#18181b', borderRadius: '16px',
        borderWidth: '1px', borderColor: isGlass ? 'rgba(255,255,255,0.15)' : '#27272a', borderStyle: 'solid',
        boxShadow: isGlass ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.3)',
      },
      content: '', animationPreset: 'none',
    });
    if (isProfile) {
      newElements.push({ id: baseId(), type: 'avatar', name: 'Profile Avatar', position: { x: cx - 24, y: cy - 80 }, size: { width: 48, height: 48 }, zIndex: maxZ + 2, styles: { backgroundColor: '#7c3aed' }, content: 'U', animationPreset: 'none' });
      newElements.push({ id: baseId(), type: 'text', name: 'Profile Name', position: { x: cx - 60, y: cy - 20 }, size: { width: 120, height: 24 }, zIndex: maxZ + 3, styles: { color: '#ffffff', fontSize: '16px', fontWeight: '600', textAlign: 'center' }, content: 'John Doe', animationPreset: 'none' });
      newElements.push({ id: baseId(), type: 'button', name: 'Follow Button', position: { x: cx - 50, y: cy + 20 }, size: { width: 100, height: 32 }, zIndex: maxZ + 4, styles: { backgroundColor: '#7c3aed', color: '#ffffff', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }, content: 'Follow', animationPreset: 'none' });
    }
    return { elements: newElements, message: isGlass ? "Created a glassmorphic card!" : isProfile ? "Created a profile card with avatar, name, and follow button!" : "Created a styled card!" };
  }

  if (lowerPrompt.includes('form') || lowerPrompt.includes('login') || lowerPrompt.includes('форм') || lowerPrompt.includes('логин')) {
    newElements.push({ id: baseId(), type: 'card', name: 'Form Container', position: { x: cx - 160, y: cy - 140 }, size: { width: 320, height: 280 }, zIndex: maxZ + 1, styles: { backgroundColor: '#18181b', borderRadius: '16px', borderWidth: '1px', borderColor: '#27272a', borderStyle: 'solid', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }, content: '', animationPreset: 'none' });
    newElements.push({ id: baseId(), type: 'text', name: 'Form Title', position: { x: cx - 130, y: cy - 120 }, size: { width: 260, height: 30 }, zIndex: maxZ + 2, styles: { color: '#ffffff', fontSize: '18px', fontWeight: '700', textAlign: 'center' }, content: 'Sign In', animationPreset: 'none' });
    newElements.push({ id: baseId(), type: 'input', name: 'Email Input', position: { x: cx - 130, y: cy - 70 }, size: { width: 260, height: 40 }, zIndex: maxZ + 3, styles: { backgroundColor: '#09090b', borderRadius: '8px', borderWidth: '1px', borderColor: '#27272a', borderStyle: 'solid', color: '#a1a1aa', fontSize: '13px' }, placeholder: 'Email address', animationPreset: 'none' });
    newElements.push({ id: baseId(), type: 'input', name: 'Password Input', position: { x: cx - 130, y: cy - 15 }, size: { width: 260, height: 40 }, zIndex: maxZ + 4, styles: { backgroundColor: '#09090b', borderRadius: '8px', borderWidth: '1px', borderColor: '#27272a', borderStyle: 'solid', color: '#a1a1aa', fontSize: '13px' }, placeholder: 'Password', animationPreset: 'none' });
    newElements.push({ id: baseId(), type: 'button', name: 'Submit Button', position: { x: cx - 130, y: cy + 45 }, size: { width: 260, height: 42 }, zIndex: maxZ + 5, styles: { backgroundColor: '#7c3aed', color: '#ffffff', borderRadius: '8px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }, content: 'Sign In', animationPreset: 'none' });
    return { elements: newElements, message: "Created a login form with email, password, and submit button!" };
  }

  if (lowerPrompt.includes('text') || lowerPrompt.includes('heading') || lowerPrompt.includes('текст') || lowerPrompt.includes('заголов')) {
    newElements.push({ id: baseId(), type: 'text', name: 'AI Text', position: { x: cx - 100, y: cy - 15 }, size: { width: 200, height: 30 }, zIndex: maxZ + 1, styles: { color: '#ffffff', fontSize: lowerPrompt.includes('heading') ? '24px' : '14px', fontWeight: lowerPrompt.includes('heading') ? '700' : '400', textAlign: 'center' }, content: lowerPrompt.includes('heading') ? 'Heading Text' : 'Your text here', animationPreset: 'none' });
    return { elements: newElements, message: "Created a text element!" };
  }

  newElements.push({ id: baseId(), type: 'button', name: 'AI Element', position: { x: cx - 70, y: cy - 20 }, size: { width: 140, height: 40 }, zIndex: maxZ + 1, styles: { backgroundColor: '#7c3aed', color: '#ffffff', borderRadius: '10px', fontSize: '13px', fontWeight: '600', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }, content: 'AI Element', animationPreset: 'none' });
  return { elements: newElements, message: "Created a basic element. Try 'glassmorphic card', 'neon button', 'login form', or 'profile card' for better results!" };
}

export default function MakeAIChat({ elements, canvasSettings, onApplyAIChanges }: MakeAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', sender: 'ai', text: "Hello! I'm your AI Design Assistant. Tell me what you'd like to build:\n\n• \"Create a neon glowing button\"\n• \"Make a glassmorphic card\"\n• \"Build a login form\"\n• \"Add a profile card\"\n\nI'll generate elements directly on the canvas!" },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const processPrompt = (userMessage: string) => {
    setInput('');
    setMessages((prev) => [...prev, { id: 'msg_' + Math.random().toString(36).substr(2, 9), sender: 'user', text: userMessage }]);
    setIsLoading(true);
    setTimeout(() => {
      try {
        const result = generateElementsFromPrompt(userMessage, elements, canvasSettings);
        if (result.elements.length > elements.length) {
          onApplyAIChanges(result.elements, canvasSettings);
          setMessages((prev) => [...prev, { id: 'ai_' + Math.random().toString(36).substr(2, 9), sender: 'ai', text: result.message }]);
        } else {
          setMessages((prev) => [...prev, { id: 'ai_' + Math.random().toString(36).substr(2, 9), sender: 'ai', text: "Couldn't determine what to create. Try 'button', 'card', 'form', or 'profile card'." }]);
        }
      } catch (err: any) {
        setMessages((prev) => [...prev, { id: 'err_' + Math.random().toString(36).substr(2, 9), sender: 'system', text: `Error: ${err.message}` }]);
      } finally { setIsLoading(false); }
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!input.trim() || isLoading) return; processPrompt(input.trim()); };

  return (
    <div className="flex flex-col h-full select-none" style={{ backgroundColor: 'var(--make-panel-bg, #09090b)' }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin" style={{ overscrollBehavior: 'contain' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-violet-600 text-white' : msg.sender === 'system' ? 'bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[11px]' : 'border'}`}
              style={msg.sender === 'ai' ? { backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text-muted, #a1a1aa)' } : undefined}>
              {msg.sender === 'ai' && (<div className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-400 mb-1.5"><Sparkles className="h-3 w-3" /><span>Nexore AI</span></div>)}
              {msg.sender === 'system' && (<div className="flex items-center gap-1.5 text-[10px] font-semibold text-red-400 mb-1.5"><AlertCircle className="h-3 w-3" /><span>Error</span></div>)}
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-xl p-3 flex items-center gap-2 text-xs border" style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text-muted, #a1a1aa)' }}>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400" /><span>AI is designing...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {messages.length <= 2 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {quickActions.map((action) => (
            <button key={action.label} type="button" onClick={() => processPrompt(action.prompt)} disabled={isLoading}
              className="px-2.5 py-1.5 text-[10px] rounded-lg border transition-all cursor-pointer hover:border-violet-500/50 hover:text-violet-400 disabled:opacity-50"
              style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)', color: 'var(--make-text-muted, #a1a1aa)' }}>
              {action.label}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-3 border-t" style={{ borderColor: 'var(--make-border, #27272a)' }}>
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 transition-colors focus-within:border-violet-500/50"
          style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)' }}>
          <Wand2 className="h-3.5 w-3.5 text-violet-400 shrink-0" />
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} placeholder="Describe what to create..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-zinc-500" style={{ color: 'var(--make-text, #e4e4e7)' }} />
          <button type="submit" disabled={isLoading || !input.trim()} className="text-violet-400 hover:text-violet-300 disabled:text-zinc-700 cursor-pointer transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
export { MakeAIChat };
export type { MakeAIChatProps };
