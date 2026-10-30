import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Check, Copy, X, Download, FileCode2, Lock, ShieldCheck, Clock, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { CanvasSettings, NexoreMakeElement } from '../types';
import { isLightColor } from '../utils/colorUtils';
import {
  generateReactCode,
  generateHTMLCode,
  generateVueCode,
} from '../utils/codeGenerator';

interface MakeCodeExportProps {
  isOpen: boolean;
  onClose: () => void;
  elements: NexoreMakeElement[];
  canvasSettings: CanvasSettings;
}

type CodeTab = 'react' | 'html' | 'vue';

const TAB_META: Record<CodeTab, { label: string; ext: string; fileName: string }> = {
  react: { label: 'React / TSX', ext: '.tsx', fileName: 'CustomComponent.tsx' },
  html: { label: 'HTML / CSS', ext: '.html', fileName: 'index.html' },
  vue: { label: 'Vue', ext: '.vue', fileName: 'CustomComponent.vue' },
};

interface ServerExportStatus {
  authenticated: boolean;
  requiresAuth?: boolean;
  isPro: boolean;
  allowed: boolean;
  totalLimit?: number;
  usedToday?: number;
  remaining?: number;
  resetAt?: number | null;
  resetInMs?: number;
  serverTime?: number;
  user?: { email: string; name: string };
  message?: string;
  error?: string;
}

function highlightToken(token: string, key: number) {
  if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
    return (
      <span key={key} className="text-emerald-700 dark:text-emerald-400">
        {token}
      </span>
    );
  }
  if (
    /^(import|export|default|function|return|const|let|var|from|ref|true|false|null|undefined|template|script|style)$/.test(
      token
    )
  ) {
    return (
      <span key={key} className="text-purple-700 dark:text-purple-400 font-medium">
        {token}
      </span>
    );
  }
  if (token.startsWith('<') || token === '>' || token === '/>') {
    return (
      <span key={key} className="text-blue-700 dark:text-blue-400 font-medium">
        {token}
      </span>
    );
  }
  if (token.startsWith('.')) {
    return (
      <span key={key} className="text-indigo-700 dark:text-indigo-300 font-medium">
        {token}
      </span>
    );
  }
  if (/^\d+(\.\d+)?(px|%|rem|em|deg|s|ms)?$/.test(token)) {
    return (
      <span key={key} className="text-amber-700 dark:text-amber-400">
        {token}
      </span>
    );
  }
  return <span key={key}>{token}</span>;
}

function HighlightedLine({ line }: { line: string }) {
  if (!line) return <span>&nbsp;</span>;
  const parts: React.ReactNode[] = [];
  const regex =
    /("(?:\\.|[^"\\])*"|'[^']*'|`[^`]*`|\b(?:import|export|default|function|return|const|let|var|from|ref|true|false|null|undefined|template|script|style)\b|<\/?[\w-]+|\/?>|\.[\w-]+|\b\d+(?:\.\d+)?(?:px|%|rem|em|deg|s|ms)?\b)/g;

  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let count = 0;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIdx) {
      parts.push(
        <span key={`txt-${count++}`}>{line.slice(lastIdx, match.index)}</span>
      );
    }
    parts.push(highlightToken(match[0], count++));
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < line.length) {
    parts.push(<span key={`txt-${count++}`}>{line.slice(lastIdx)}</span>);
  }

  return <span>{parts}</span>;
}

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function MakeCodeExport({
  isOpen,
  onClose,
  elements,
  canvasSettings,
}: MakeCodeExportProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>('react');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState<ServerExportStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingTimeText, setRemainingTimeText] = useState<string>('');

  const { resolvedTheme, theme } = useTheme();

  const isLight =
    resolvedTheme === 'light' ||
    theme === 'light' ||
    (canvasSettings.backgroundColor ? isLightColor(canvasSettings.backgroundColor) : false);

  const code = useMemo(() => {
    switch (activeTab) {
      case 'react':
        return generateReactCode(elements, canvasSettings, isLight);
      case 'html':
        return generateHTMLCode(elements, canvasSettings, isLight);
      case 'vue':
        return generateVueCode(elements, canvasSettings, isLight);
      default:
        return '';
    }
  }, [activeTab, elements, canvasSettings, isLight]);

  const codeLines = useMemo(() => code.split('\n'), [code]);
  const meta = TAB_META[activeTab];

  // Fetch verified export status from server on open
  const fetchStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/nexoremake/export');
      const data: ServerExportStatus = await res.json();
      setStatus(data);
    } catch {
      setErrorMessage('Failed to connect to authentication server.');
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen, fetchStatus]);

  // Real-time server-based countdown timer
  useEffect(() => {
    if (!status?.resetAt) {
      setRemainingTimeText('');
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, (status.resetAt || 0) - now);
      if (diff <= 0) {
        setRemainingTimeText('Ready to export');
        fetchStatus();
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setRemainingTimeText(`${hours}h ${mins}m ${secs}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [status?.resetAt, fetchStatus]);

  if (!isOpen) return null;

  // Consume 1 export on server
  const consumeExport = async (): Promise<boolean> => {
    if (!status?.authenticated) {
      return false;
    }
    if (status.isPro) {
      return true;
    }
    if (status.remaining !== undefined && status.remaining <= 0) {
      setErrorMessage('Daily export limit reached (2/2). Upgrade to Pro for unlimited exports.');
      return false;
    }

    setIsExporting(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/nexoremake/export', { method: 'POST' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Export limit reached.');
        setStatus((prev) => (prev ? { ...prev, allowed: false, remaining: 0, resetAt: data.resetAt } : null));
        return false;
      }

      setStatus((prev) => (prev ? { ...prev, ...data } : null));
      return true;
    } catch {
      setErrorMessage('Network error communicating with export server.');
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    const allowed = await consumeExport();
    if (!allowed) return;

    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const allowed = await consumeExport();
    if (!allowed) return;

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = meta.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLimitReached = Boolean(
    status && status.authenticated && !status.isPro && status.remaining !== undefined && status.remaining <= 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/60 dark:bg-black/80"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] z-50 border border-border bg-card text-foreground"
        style={{
          animation: 'make-fade-scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0 bg-muted/50 dark:bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClose}
                className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600 hover:bg-zinc-500 dark:hover:bg-zinc-400 transition-colors cursor-pointer"
                aria-label="Close modal"
              />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>

            <div className="flex items-center gap-2">
              <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">{meta.fileName}</span>
            </div>

            {/* Auth / Tier Badge */}
            {status && !isLoadingStatus && (
              <div className="ml-2 hidden sm:flex items-center">
                {status.isPro ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    <Sparkles className="w-3 h-3" />
                    <span>Pro • Unlimited</span>
                  </span>
                ) : status.authenticated ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-muted text-muted-foreground border border-border">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>Free Tier: {status.remaining ?? 2}/2 left today</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                    <Lock className="w-3 h-3" />
                    <span>Google Sign-in Required</span>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {status?.authenticated && !isLimitReached && (
              <>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : isExporting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer ml-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Format Tabs */}
        <div className="flex border-b border-border overflow-x-auto scrollbar-none px-3 gap-1 shrink-0 bg-muted/30 dark:bg-muted/20">
          {(Object.keys(TAB_META) as CodeTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setCopied(false);
              }}
              className={`relative px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {TAB_META[tab].label}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Limit Warning / Cooldown Banner */}
        {isLimitReached && (
          <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium">
              <Clock className="w-4 h-4 shrink-0" />
              <span>
                Daily export limit reached (2/2 used). Next export unlocks in{' '}
                <strong className="font-mono tabular-nums">{remainingTimeText || '24h'}</strong>.
              </span>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
            >
              <span>Get Unlimited with Pro</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="px-5 py-2.5 bg-destructive/10 border-b border-destructive/20 text-xs text-destructive font-medium flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-destructive/80 hover:text-destructive text-xs ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-auto select-text scrollbar-thin bg-zinc-50/90 dark:bg-zinc-950">
          {isLoadingStatus ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-mono">Verifying server authorization...</span>
            </div>
          ) : !status?.authenticated ? (
            /* Google Sign-In Gate */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-card border border-border shadow-md flex items-center justify-center">
                <GoogleIcon className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  Sign in with Google to Export Code
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sign in with your Google account to confirm identity. Free users can export up to 2 components every 24 hours.
                </p>
              </div>

              <div className="w-full flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `/api/auth/google?returnTo=/nexoremake`;
                  }}
                  className="w-full h-11 px-4 rounded-xl bg-foreground text-background font-semibold text-xs flex items-center justify-center gap-2.5 shadow-md hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Continue with Google</span>
                </button>

                <Link
                  href="/auth/login?state=/nexoremake"
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Or sign in with email verification code
                </Link>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-muted-foreground/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero spam • 24h cooldown server-tracked</span>
              </div>
            </div>
          ) : isLimitReached ? (
            /* Blurred preview when limit is reached */
            <div className="relative">
              <div className="flex min-h-full filter blur-[5px] select-none pointer-events-none opacity-40">
                <div className="shrink-0 py-5 pl-4 pr-3 text-right border-r border-zinc-200 dark:border-zinc-800/60 min-w-[54px]">
                  {codeLines.slice(0, 30).map((_, i) => (
                    <div key={i} className="text-[12px] leading-relaxed font-mono text-zinc-400">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex-1 py-5 px-5">
                  <pre className="text-[12px] leading-relaxed font-mono">
                    <code>
                      {codeLines.slice(0, 30).map((line, i) => (
                        <div key={i} className="whitespace-pre">
                          <HighlightedLine line={line} />
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="max-w-md p-6 rounded-2xl bg-card/95 border border-border shadow-2xl backdrop-blur-xl text-center space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">
                      Free Limit Reached (2/2 exports today)
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your daily quota resets in{' '}
                      <strong className="font-mono text-foreground font-semibold">
                        {remainingTimeText || '24 hours'}
                      </strong>
                      . Upgrade to Pro for unlimited exports and all 32 flagship templates.
                    </p>
                  </div>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Upgrade to NexoreUI Pro</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Full Code View */
            <div className="flex min-h-full">
              <div className="shrink-0 py-5 pl-4 pr-3 text-right select-none border-r border-zinc-200 dark:border-zinc-800/60 min-w-[54px] bg-zinc-100/60 dark:bg-transparent">
                {codeLines.map((_, i) => (
                  <div key={i} className="text-[12px] leading-relaxed font-mono text-zinc-400 dark:text-zinc-600 tabular-nums">
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="flex-1 py-5 px-5 overflow-x-auto scrollbar-thin">
                <pre className="text-[12px] leading-relaxed font-mono font-normal text-zinc-900 dark:text-zinc-200">
                  <code>
                    {codeLines.map((line, i) => (
                      <div key={i} className="whitespace-pre">
                        <HighlightedLine line={line} />
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
