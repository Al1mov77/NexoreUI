'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Send,
  Square,
  Mic,
  Paperclip,
  Globe,
  Sparkles,
  Bot,
  ChevronDown,
  X,
  FileText,
  Image as ImageIcon,
  Cpu,
} from 'lucide-react';
import { cn } from '../utils/cn';

const sizeMap = {
  sm: {
    outerRadius: 'rounded-xl',
    innerRadius: 'rounded-[calc(0.75rem-2px)]',
    padding: 'p-2.5 gap-2',
    text: 'text-xs',
    rx: 12,
  },
  md: {
    outerRadius: 'rounded-2xl',
    innerRadius: 'rounded-[calc(1rem-2px)]',
    padding: 'p-3.5 gap-2.5',
    text: 'text-sm',
    rx: 16,
  },
  lg: {
    outerRadius: 'rounded-3xl',
    innerRadius: 'rounded-[calc(1.5rem-2px)]',
    padding: 'p-4 gap-3',
    text: 'text-base',
    rx: 24,
  },
};

export interface AIModelOption {
  id: string;
  name: string;
  badge?: string;
  icon?: React.ElementType;
}

export interface AttachedFile {
  id: string;
  name: string;
  size?: string;
  type?: 'image' | 'file' | 'code';
}

export interface AiPromptInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSubmit'> {
  /**
   * Visual theme variant
   * @default "default"
   */
  variant?: 'default' | 'glow' | 'aurora' | 'glass' | 'minimal';
  /**
   * Dimension scale
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Text prompt value (controlled)
   */
  value?: string;
  /**
   * Default text prompt value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Callback fired when text changes
   */
  onChange?: (value: string) => void;
  /**
   * Callback fired when prompt is submitted (via button or Enter key)
   */
  onSubmit?: (prompt: string, options?: { model?: string; webSearch?: boolean; files?: AttachedFile[] }) => void;
  /**
   * Textarea placeholder text
   * @default "Ask anything or describe what you want to build..."
   */
  placeholder?: string;
  /**
   * Whether the AI is currently generating a response (switches Send to Stop button)
   * @default false
   */
  isLoading?: boolean;
  /**
   * Callback fired when user clicks stop generation
   */
  onStop?: () => void;
  /**
   * List of available models in the selector dropdown
   */
  models?: AIModelOption[];
  /**
   * Currently active model ID
   */
  selectedModel?: string;
  /**
   * Callback when active model is changed
   */
  onModelChange?: (modelId: string) => void;
  /**
   * Attached files list preview
   */
  files?: AttachedFile[];
  /**
   * Callback when a file is removed
   */
  onRemoveFile?: (fileId: string) => void;
  /**
   * Callback when user clicks the attach file button
   */
  onAttachClick?: () => void;
  /**
   * Whether voice listening is active
   * @default false
   */
  isListening?: boolean;
  /**
   * Callback when microphone button is clicked
   */
  onVoiceToggle?: () => void;
  /**
   * Whether web search enhancement is enabled
   * @default false
   */
  webSearchEnabled?: boolean;
  /**
   * Callback when web search toggle is clicked
   */
  onWebSearchToggle?: () => void;
  /**
   * Whether Deep Reasoning mode is enabled
   * @default false
   */
  reasoningEnabled?: boolean;
  /**
   * Callback when Deep Reasoning mode toggle is clicked
   */
  onReasoningToggle?: () => void;
  /**
   * Disables all interactive inputs
   * @default false
   */
  disabled?: boolean;
}

const defaultModels: AIModelOption[] = [
  { id: 'claude-3-7', name: 'Claude 3.7 Sonnet', badge: 'Hybrid', icon: Sparkles },
  { id: 'gpt-4o', name: 'GPT-4o', badge: 'Fast', icon: Bot },
  { id: 'gemini-2-flash', name: 'Gemini 2.0 Flash', badge: 'Multimodal', icon: Cpu },
  { id: 'deepseek-r1', name: 'DeepSeek R1', badge: 'Reasoning', icon: Globe },
];

/**
 * AiPromptInput Component
 *
 * An ultra-premium input bar for conversational and agentic AI interfaces.
 * Supports auto-expanding textarea, model selector, attachments, voice pulse,
 * web search / reasoning toggles, and SVG perimeter-traveling Aurora waves.
 */
export const AiPromptInput = React.forwardRef<HTMLDivElement, AiPromptInputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      value: controlledValue,
      defaultValue = '',
      onChange,
      onSubmit,
      placeholder = 'Ask anything or describe what you want to build...',
      isLoading = false,
      onStop,
      models = defaultModels,
      selectedModel: controlledModel,
      onModelChange,
      files: controlledFiles,
      onRemoveFile,
      onAttachClick,
      isListening: controlledListening,
      onVoiceToggle,
      webSearchEnabled: controlledWebSearch,
      onWebSearchToggle,
      reasoningEnabled: controlledReasoning,
      onReasoningToggle,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [internalModel, setInternalModel] = React.useState(models[0]?.id || 'claude-3-7');
    const [isModelDropdownOpen, setIsModelDropdownOpen] = React.useState(false);
    const [internalListening, setInternalListening] = React.useState(false);
    const [internalWebSearch, setInternalWebSearch] = React.useState(false);
    const [internalReasoning, setInternalReasoning] = React.useState(false);
    const [internalFiles, setInternalFiles] = React.useState<AttachedFile[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const shouldReduceMotion = useReducedMotion();
    const id = React.useId().replace(/:/g, '');

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const currentModelId = controlledModel !== undefined ? controlledModel : internalModel;
    const currentModel = models.find((m) => m.id === currentModelId) || models[0];

    const isListening = controlledListening !== undefined ? controlledListening : internalListening;
    const webSearch = controlledWebSearch !== undefined ? controlledWebSearch : internalWebSearch;
    const reasoning = controlledReasoning !== undefined ? controlledReasoning : internalReasoning;
    const files = controlledFiles !== undefined ? controlledFiles : internalFiles;

    const activeSize = sizeMap[size] || sizeMap.md;

    // Auto-resize textarea height
    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
      }
    }, [value]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleSubmit = () => {
      if (isLoading) {
        onStop?.();
        return;
      }
      if (!value.trim() && files.length === 0) return;
      onSubmit?.(value, {
        model: currentModelId,
        webSearch,
        files,
      });
      if (!isControlled) setInternalValue('');
    };

    const handleVoiceClick = () => {
      if (onVoiceToggle) onVoiceToggle();
      else setInternalListening(!internalListening);
    };

    const handleWebSearchClick = () => {
      if (onWebSearchToggle) onWebSearchToggle();
      else setInternalWebSearch(!internalWebSearch);
    };

    const handleReasoningClick = () => {
      if (onReasoningToggle) onReasoningToggle();
      else setInternalReasoning(!internalReasoning);
    };

    const handleAttachClick = () => {
      if (onAttachClick) {
        onAttachClick();
      } else if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (selected && selected.length > 0) {
        const newFiles: AttachedFile[] = Array.from(selected).map((f, i) => ({
          id: `${Date.now()}-${i}`,
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          type: f.type.startsWith('image/') ? 'image' : 'file',
        }));
        setInternalFiles((prev) => [...prev, ...newFiles]);
      }
    };

    const handleRemoveFileInternal = (id: string) => {
      if (onRemoveFile) onRemoveFile(id);
      else setInternalFiles((prev) => prev.filter((f) => f.id !== id));
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative isolate w-full transition-all duration-300 select-none group',
          activeSize.outerRadius,
          className
        )}
        {...props}
      >
        {/* Hidden file input for uncontrolled attach */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelected}
        />

        {/* ─── Aurora Variant: SVG Traveling Border Waves ─── */}
        {variant === 'aurora' && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`ai-aurora-grad1-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="25%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="75%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id={`ai-aurora-grad2-${id}`} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="35%" stopColor="#6366f1" />
                <stop offset="70%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <filter id={`ai-aurora-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base border line (Always visible) */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={activeSize.rx}
              fill="none"
              className="stroke-zinc-200 dark:stroke-white/10"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Ambient traveling snake wave glow */}
            {!shouldReduceMotion && (
              <motion.rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx={activeSize.rx}
                fill="none"
                pathLength={100}
                stroke={`url(#ai-aurora-grad1-${id})`}
                strokeWidth="5"
                strokeDasharray="26 74"
                strokeLinecap="round"
                filter={`url(#ai-aurora-glow-${id})`}
                opacity="0.65"
                vectorEffect="non-scaling-stroke"
                animate={{
                  strokeDashoffset: [0, -100],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Single traveling aurora snake */}
            {!shouldReduceMotion ? (
              <motion.rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx={activeSize.rx}
                fill="none"
                pathLength={100}
                stroke={`url(#ai-aurora-grad1-${id})`}
                strokeWidth="2.5"
                strokeDasharray="26 74"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                animate={{
                  strokeDashoffset: [0, -100],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx={activeSize.rx}
                fill="none"
                stroke={`url(#ai-aurora-grad1-${id})`}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
        )}

        {/* ─── Inner Prompt Input Container Surface ─── */}
        <div
          className={cn(
            'relative z-10 flex flex-col w-full transition-all duration-300',
            activeSize.padding,
            activeSize.text,
            activeSize.outerRadius,
            variant === 'aurora' &&
              'bg-white dark:bg-[#0c0d14] text-zinc-900 dark:text-zinc-100 shadow-xl',
            variant === 'default' &&
              'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-lg shadow-zinc-950/5 dark:shadow-black/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20',
            variant === 'glow' &&
              'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-[0_0_20px_rgba(99,60,220,0.18)] focus-within:border-primary focus-within:shadow-[0_0_25px_rgba(99,60,220,0.35)]',
            variant === 'glass' &&
              'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl focus-within:border-primary/50',
            variant === 'minimal' &&
              'bg-zinc-100/80 dark:bg-zinc-900/80 border border-transparent focus-within:bg-white dark:focus-within:bg-zinc-950 focus-within:border-zinc-300 dark:focus-within:border-zinc-700'
          )}
        >
          {/* ─── Attached Files Pill Drawer ─── */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-0.5 pb-1">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/80 shadow-sm"
                  >
                    {file.type === 'image' ? (
                      <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-primary" />
                    )}
                    <span className="max-w-[140px] truncate font-medium">{file.name}</span>
                    {file.size && <span className="text-[10px] text-zinc-400">({file.size})</span>}
                    <button
                      type="button"
                      onClick={() => handleRemoveFileInternal(file.id)}
                      className="ml-1 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ─── Main Textarea ─── */}
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening to your voice...' : placeholder}
              disabled={disabled}
              className="w-full bg-transparent resize-none border-0 p-0 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-0 leading-relaxed max-h-[180px] overflow-y-auto"
            />
          </div>

          {/* ─── Bottom Actions Toolbar ─── */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-white/5">
            {/* Left Controls: Model dropdown, Search, Reasoning */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Model Selector Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-white/10 transition-colors cursor-pointer"
                >
                  {currentModel?.icon ? (
                    <currentModel.icon className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  )}
                  <span>{currentModel?.name || 'Model'}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Model Dropdown Menu */}
                {isModelDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-56 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Select AI Model
                    </div>
                    {models.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          if (onModelChange) onModelChange(model.id);
                          else setInternalModel(model.id);
                          setIsModelDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left',
                          currentModelId === model.id
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {model.icon ? (
                            <model.icon className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                          )}
                          <span>{model.name}</span>
                        </div>
                        {model.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                            {model.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Web Search Toggle Pill */}
              <button
                type="button"
                onClick={handleWebSearchClick}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  webSearch
                    ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Deep Reasoning Mode Toggle Pill */}
              <button
                type="button"
                onClick={handleReasoningClick}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  reasoning
                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Deep Think</span>
              </button>
            </div>

            {/* Right Controls: Attach, Voice, Submit/Stop */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Attach File Button */}
              <button
                type="button"
                onClick={handleAttachClick}
                disabled={disabled}
                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                title="Attach files or media"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={handleVoiceClick}
                disabled={disabled}
                className={cn(
                  'p-2 rounded-xl transition-all cursor-pointer relative',
                  isListening
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                )}
                title={isListening ? 'Stop listening' : 'Speak to AI'}
              >
                {isListening && !shouldReduceMotion && (
                  <span className="absolute inset-0 rounded-xl bg-red-500 animate-ping opacity-50" />
                )}
                <Mic className="w-4 h-4 relative z-10" />
              </button>

              {/* Submit / Stop Morphing Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || (!isLoading && !value.trim() && files.length === 0)}
                className={cn(
                  'inline-flex items-center justify-center p-2 rounded-xl text-white font-semibold transition-all duration-200 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed',
                  isLoading
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-zinc-950/20'
                    : 'bg-primary hover:bg-primary/90 active:scale-95 shadow-primary/25'
                )}
                title={isLoading ? 'Stop generation' : 'Send prompt (Enter)'}
              >
                {isLoading ? (
                  <Square className="w-4 h-4 fill-current" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AiPromptInput.displayName = 'AiPromptInput';
