import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Loader2, Send, Wand2, AlertCircle, ImageIcon, X } from 'lucide-react';
import { CanvasSettings, NexoreMakeElement, ElementType } from '../types';
import { trackEvent } from '../../../hooks/useAnalytics';

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
  { label: 'Red Accent', prompt: 'Change selected element to red color' },
  { label: 'Neon Glow', prompt: 'Add neon glow shadow effect to selected element' },
  { label: 'Glassmorphic', prompt: 'Make selected element glassmorphic with blur backdrop' },
  { label: 'Login Form', prompt: 'Create a login form with email input, password input, and submit button' },
];

export default function MakeAIChat({ elements, selectedId, canvasSettings, onApplyAIChanges }: MakeAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I'm your AI Design Assistant. Select any element to modify it or ask me to build something:\n\n• \"Color red\" / \"Make button blue\"\n• \"Add glassmorphic card\"\n• \"Create a login form\"\n• \"Add neon glow effect\"",
    },
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round(height * (MAX_DIM / width));
            width = MAX_DIM;
          } else {
            width = Math.round(width * (MAX_DIM / height));
            height = MAX_DIM;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setImage(canvas.toDataURL('image/jpeg', 0.7)); // High compression
        } else {
          // Fallback if canvas fails
          setImage(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const processPrompt = async (userMessage: string, imageBase64?: string, retries = 1) => {
    setInput('');
    setImage(null);
    setMessages((prev) => [...prev, { id: 'msg_' + Math.random().toString(36).substring(2, 9), sender: 'user', text: imageBase64 ? `[Image] ${userMessage}` : userMessage }]);
    setIsLoading(true);

    trackEvent({
      eventType: 'ai_prompt_submitted',
      feature: 'Nexore Make'
    });

    try {
      const response = await fetch('/api/make-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          image: imageBase64,
          elements,
          selectedId,
          canvasSettings,
        }),
      });

      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          // Rate limit, retry once after 2 seconds
          setMessages((prev) => [...prev, { id: 'sys_' + Date.now(), sender: 'system', text: "Rate limit reached. Retrying in 2 seconds..." }]);
          await new Promise(res => setTimeout(res, 2000));
          return processPrompt(userMessage, imageBase64, retries - 1);
        }
        const errData = await response.json().catch(() => ({ error: 'Server error' }));
        throw new Error(errData.error || `Server error: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (data.elements && Array.isArray(data.elements)) {
        onApplyAIChanges(data.elements, canvasSettings);
      }
      
      trackEvent({
        eventType: 'ai_generation_completed',
        feature: 'Nexore Make',
        status: 'Success'
      });

      setMessages((prev) => [...prev, { id: 'ai_' + Math.random().toString(36).substring(2, 9), sender: 'ai', text: data.message || "Canvas updated successfully!" }]);
    } catch (err: any) {
      if (retries > 0 && err.message.includes('fetch')) {
         setMessages((prev) => [...prev, { id: 'sys_' + Date.now(), sender: 'system', text: "Network error. Retrying..." }]);
         await new Promise(res => setTimeout(res, 1000));
         return processPrompt(userMessage, imageBase64, retries - 1);
      }
      
      trackEvent({
        eventType: 'ai_generation_failed',
        feature: 'Nexore Make',
        status: 'Failed'
      });

      setMessages((prev) => [...prev, { id: 'err_' + Math.random().toString(36).substring(2, 9), sender: 'system', text: `Failed: ${err.message}. Please try again.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) processImageFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processImageFile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if leaving the main container
    const rect = dropZoneRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        setIsDragOver(false);
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(f => f.type.startsWith('image/'));
    if (imageFile) {
      processImageFile(imageFile);
    }
  }, [processImageFile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !image) || isLoading) return;
    processPrompt(input.trim() || 'Recreate this UI design from the image', image || undefined);
  };

  return (
    <div 
      ref={dropZoneRef}
      className="flex flex-col h-full select-none relative" 
      style={{ backgroundColor: 'var(--make-panel-bg, #09090b)' }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-violet-500/10 border-2 border-dashed border-violet-500/50 backdrop-blur-sm rounded-lg m-2 pointer-events-none">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 text-violet-400 mx-auto mb-2 animate-bounce" />
            <p className="text-sm font-medium text-violet-300">Drop image here</p>
            <p className="text-xs text-violet-400/60 mt-0.5">We'll analyze and recreate the UI</p>
          </div>
        </div>
      )}

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

      <form onSubmit={handleSubmit} className="p-3 border-t" style={{ borderColor: 'var(--make-border, #27272a)' }}>
        {image && (
          <div className="mb-2 relative inline-block">
            <img src={image} alt="Upload preview" className="h-16 rounded-lg object-cover border border-zinc-700" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 cursor-pointer shadow-md"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <div
          className="flex items-center gap-2 border rounded-xl px-3 py-2 transition-colors focus-within:border-violet-500/50"
          style={{ backgroundColor: 'var(--make-surface, #18181b)', borderColor: 'var(--make-border, #27272a)' }}
        >
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-zinc-400 hover:text-violet-400 cursor-pointer shrink-0" title="Upload image">
            <ImageIcon className="h-4 w-4" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={image ? "Describe what to do with image..." : "Describe change or component..."}
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-zinc-500"
            style={{ color: 'var(--make-text, #e4e4e7)' }}
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !image)}
            className="text-violet-400 hover:text-violet-300 disabled:text-zinc-700 cursor-pointer transition-colors shrink-0"
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
