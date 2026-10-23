import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, Loader2, Send, AlertCircle, ImageIcon, X } from 'lucide-react';
import { CanvasSettings, NexoreMakeElement } from '../types';
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

const QUICK_ACTIONS = [
  {
    label: 'Surface Card',
    prompt: 'Apply clean dark zinc surface card styling with 1px border to the selected element',
  },
  {
    label: 'Sign-In Form',
    prompt: 'Create a structured sign-in card with email input, password input, and primary submit button',
  },
  {
    label: 'Pricing Tier',
    prompt: 'Create a SaaS pricing card with $49/mo price, 4 feature bullet items, and action button',
  },
  {
    label: 'KPI Metric Row',
    prompt: 'Create a stat metric card showing $124,500 monthly recurring revenue and +18.4% delta',
  },
  {
    label: 'Bento Specification',
    prompt: 'Create a bento feature card with icon, title, and concise technical description',
  },
] as const;

export default function MakeAIChat({
  elements,
  selectedId,
  canvasSettings,
  onApplyAIChanges,
}: MakeAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Select any element on the canvas to refine its properties, or describe a new component layout to generate:\n\n• "Create a sign-in card with email and password"\n• "Add a pricing card for Team plan at $49/mo"\n• "Align selected element and apply surface border"',
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
          setImage(canvas.toDataURL('image/jpeg', 0.7));
        } else if (typeof event.target?.result === 'string') {
          setImage(event.target.result);
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const processPrompt = async (userMessage: string, imageBase64?: string, retries = 1): Promise<void> => {
    setInput('');
    setImage(null);
    setMessages((prev) => [
      ...prev,
      {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        sender: 'user',
        text: imageBase64 ? `[Image] ${userMessage}` : userMessage,
      },
    ]);
    setIsLoading(true);

    trackEvent({
      eventType: 'ai_prompt_submitted',
      feature: 'Nexore Make',
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
          setMessages((prev) => [
            ...prev,
            {
              id: 'sys_' + Date.now(),
              sender: 'system',
              text: 'Rate limit reached. Retrying in 2 seconds...',
            },
          ]);
          await new Promise((res) => setTimeout(res, 2000));
          return processPrompt(userMessage, imageBase64, retries - 1);
        }
        const errData = (await response.json().catch(() => ({ error: 'Server error' }))) as {
          error?: string;
        };
        throw new Error(errData.error || `Server error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        error?: string;
        elements?: NexoreMakeElement[];
        message?: string;
      };
      if (data.error) throw new Error(data.error);

      if (data.elements && Array.isArray(data.elements)) {
        onApplyAIChanges(data.elements, canvasSettings);
      }

      trackEvent({
        eventType: 'ai_generation_completed',
        feature: 'Nexore Make',
        status: 'Success',
      });

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai_' + Math.random().toString(36).substring(2, 9),
          sender: 'ai',
          text: data.message || 'Canvas updated.',
        },
      ]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Request failed';
      if (retries > 0 && message.includes('fetch')) {
        setMessages((prev) => [
          ...prev,
          { id: 'sys_' + Date.now(), sender: 'system', text: 'Network error. Retrying...' },
        ]);
        await new Promise((res) => setTimeout(res, 1000));
        return processPrompt(userMessage, imageBase64, retries - 1);
      }

      trackEvent({
        eventType: 'ai_generation_failed',
        feature: 'Nexore Make',
        status: 'Failed',
      });

      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Math.random().toString(36).substring(2, 9),
          sender: 'system',
          text: `Failed: ${message}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file);
          }
          break;
        }
      }
    },
    [processImageFile]
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

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
    const rect = dropZoneRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsDragOver(false);
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((f) => f.type.startsWith('image/'));
      if (imageFile) {
        processImageFile(imageFile);
      }
    },
    [processImageFile]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !image) || isLoading) return;
    processPrompt(input.trim() || 'Recreate this UI layout from the reference image', image || undefined);
  };

  return (
    <div
      ref={dropZoneRef}
      onPaste={handlePaste}
      className="flex flex-col h-full select-none relative"
      style={{ backgroundColor: 'var(--make-panel-bg, #09090b)' }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-muted/80 border-2 border-dashed border-foreground/40 backdrop-blur-sm rounded-lg m-2 pointer-events-none">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 text-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Drop reference image here</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Analyze and reconstruct layout elements
            </p>
          </div>
        </div>
      )}

      <div
        className="px-3.5 py-2 border-b flex items-center justify-between text-[11px] shrink-0"
        style={{ borderColor: 'var(--make-border, #27272a)' }}
      >
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <Bot className="h-3.5 w-3.5 text-foreground" />
          <span>Nexore Assistant</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Gemini 2.5 Flash</span>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin"
        style={{ overscrollBehavior: 'contain' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-foreground text-background font-medium'
                  : msg.sender === 'system'
                  ? 'bg-destructive/10 border border-destructive/20 text-destructive font-mono text-[11px]'
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
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground mb-1.5">
                  <Bot className="h-3 w-3" />
                  <span>Nexore Assistant</span>
                </div>
              )}
              {msg.sender === 'system' && (
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-destructive mb-1.5">
                  <AlertCircle className="h-3 w-3" />
                  <span>Notice</span>
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
              <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground" />
              <span>Generating layout changes...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {messages.length <= 3 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => processPrompt(action.prompt)}
              disabled={isLoading}
              className="px-2.5 py-1.5 text-[10px] rounded-lg border transition-colors cursor-pointer hover:border-foreground/40 hover:text-foreground disabled:opacity-50"
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

      <form
        onSubmit={handleSubmit}
        className="p-3 border-t"
        style={{ borderColor: 'var(--make-border, #27272a)' }}
      >
        {image && (
          <div className="mb-2 relative inline-block">
            <img
              src={image}
              alt="Upload preview"
              className="h-16 rounded-lg object-cover border border-border"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 cursor-pointer shadow-sm"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <div
          className="flex items-center gap-2 border rounded-xl px-3 py-2 transition-colors focus-within:border-foreground/40"
          style={{
            backgroundColor: 'var(--make-surface, #18181b)',
            borderColor: 'var(--make-border, #27272a)',
          }}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            title="Upload reference image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={image ? 'Describe how to adapt this image...' : 'Describe layout or style change...'}
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            style={{ color: 'var(--make-text, #e4e4e7)' }}
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !image)}
            className="text-foreground hover:opacity-80 disabled:opacity-30 cursor-pointer transition-opacity shrink-0"
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
