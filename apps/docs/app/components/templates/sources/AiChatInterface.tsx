"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
} from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FileCode,
  Gauge,
  History,
  Layers,
  Maximize2,
  Menu,
  MessageSquare,
  Moon,
  Paperclip,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sliders,
  Sparkles,
  Square,
  Sun,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  X,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   1. TYPES & DATA CONTRACTS
   ═══════════════════════════════════════════════════════════════════════════ */

export type ThemeMode = "dark" | "light";
export type CursorStyle = "block" | "line" | "pulse";
export type ModelProvider = "mock" | "openai" | "anthropic" | "custom-sse";

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
  status?: "streaming" | "complete" | "stopped" | "error";
  errorMessage?: string;
  attachments?: FileAttachment[];
  metrics?: {
    tokens: number;
    durationMs: number;
    speedTokPerSec: number;
  };
  reaction?: "like" | "dislike" | null;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  modelId: string;
}

export interface StreamSettings {
  wordsPerSecond: number;
  cursorStyle: CursorStyle;
  reduceMotion: boolean;
  temperature: number;
  model: string;
}

export interface PromptCard {
  id: string;
  category: string;
  title: string;
  prompt: string;
  description: string;
  icon: "code" | "sparkles" | "terminal" | "layers";
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. INITIAL PRESETS & MOCK SESSIONS
   ═══════════════════════════════════════════════════════════════════════════ */

const AVAILABLE_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", context: "128k" },
  { id: "claude-3-7-sonnet", name: "Claude 3.7 Sonnet", provider: "Anthropic", context: "200k" },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", context: "64k" },
  { id: "custom-sse", name: "Custom Backend (SSE)", provider: "Your API", context: "Streaming" },
];

const PROMPT_SUGGESTIONS: PromptCard[] = [
  {
    id: "p1",
    category: "Architecture",
    title: "High-Throughput Streaming Pipeline",
    description: "Design an ultra-low latency event pipeline in Go & Apache Kafka.",
    prompt: "Design a high-throughput event streaming pipeline in Go using Apache Kafka. Include code for consumer groups, backpressure handling, and a summary benchmark table.",
    icon: "layers",
  },
  {
    id: "p2",
    category: "Fullstack",
    title: "React Hook Form + Zod v4 Schema",
    description: "Build a production-grade polymorphic form validation model.",
    prompt: "Create a typed React Hook Form component using Zod v4 schema with discriminated unions, async validation, and clean accessibility focus attributes.",
    icon: "code",
  },
  {
    id: "p3",
    category: "Telemetry",
    title: "Microsecond Latency Monitor",
    description: "Implement an algorithmic sliding window p99 quantile tracker.",
    prompt: "Write a high-performance TypeScript sliding-window quantile calculator (p50, p95, p99) for tracking microsecond network request latency.",
    icon: "terminal",
  },
  {
    id: "p4",
    category: "Systems",
    title: "LLM Inference Cost & Latency Benchmark",
    description: "Compare Claude 3.7 Sonnet, GPT-4o, and DeepSeek R1.",
    prompt: "Provide a comprehensive comparison table of Claude 3.7 Sonnet, GPT-4o, and DeepSeek R1, analyzing time-to-first-token (TTFT), tokens/sec, and pricing per 1M tokens.",
    icon: "sparkles",
  },
];

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "session-today-1",
    title: "React Hook Form + Zod v4 Architecture",
    createdAt: Date.now() - 1000 * 60 * 30, // 30 mins ago (Today)
    updatedAt: Date.now() - 1000 * 60 * 5,
    modelId: "claude-3-7-sonnet",
    messages: [
      {
        id: "m-1",
        role: "user",
        content: "How should we structure a high-performance form with dynamic array fields and Zod validation in Next.js 15?",
        createdAt: Date.now() - 1000 * 60 * 30,
      },
      {
        id: "m-2",
        role: "assistant",
        content: `### High-Performance Dynamic Forms with React Hook Form & Zod

When scaling large forms with dynamic row additions, isolating re-renders is critical. By coupling **\`useFieldArray\`** with individual sub-component memoization, only modified inputs re-evaluate.

#### 1. Schema Definition

\`\`\`typescript
import { z } from "zod";

export const ParameterRuleSchema = z.object({
  id: z.string().uuid(),
  key: z.string().min(1, "Key is required").max(64),
  type: z.enum(["string", "number", "boolean", "json"]),
  required: z.boolean().default(false),
  description: z.string().max(256).optional(),
});

export const FormConfigurationSchema = z.object({
  serviceName: z.string().min(3).max(48),
  concurrencyLimit: z.number().int().min(1).max(1000),
  parameters: z.array(ParameterRuleSchema).min(1, "At least one parameter is required"),
});

export type FormConfiguration = z.infer<typeof FormConfigurationSchema>;
\`\`\`

#### 2. Architecture Comparison

| Metric | Uncontrolled + useFieldArray | Controlled State (useState) | Redux / Global Store |
| :--- | :--- | :--- | :--- |
| **Input Latency (100 rows)** | \`< 4ms\` (60 FPS) | \`~48ms\` (Frame drops) | \`~32ms\` |
| **Bundle Size Overhead** | \`~8.5 kB\` | \`0 kB\` | \`> 35 kB\` |
| **Validation Trigger** | On blur / Submit | On change (High CPU) | Dispatch cycle |

Notice that native DOM state delegation completely avoids layout thrashing during fast typing.`,
        createdAt: Date.now() - 1000 * 60 * 28,
        status: "complete",
        metrics: {
          tokens: 384,
          durationMs: 1420,
          speedTokPerSec: 270,
        },
      },
    ],
  },
  {
    id: "session-today-2",
    title: "Distributed Kafka Partitioning Strategy",
    createdAt: Date.now() - 1000 * 60 * 180, // 3 hours ago (Today)
    updatedAt: Date.now() - 1000 * 60 * 180,
    modelId: "gpt-4o",
    messages: [
      {
        id: "m-3",
        role: "user",
        content: "What is the optimal partition key for order tracking in multi-tenant e-commerce?",
        createdAt: Date.now() - 1000 * 60 * 180,
      },
      {
        id: "m-4",
        role: "assistant",
        content: `For multi-tenant order streams, using purely \`tenant_id\` causes **hot-partition bottlenecks** on flash sale tenants.

Instead, use a compound partition key:
\`\`\`bash
# Composite key format
{tenant_id}:{order_id}
\`\`\`

This guarantees strict FIFO sequencing for every individual order while evenly dispersing processing load across all Kafka brokers.`,
        createdAt: Date.now() - 1000 * 60 * 179,
        status: "complete",
        metrics: {
          tokens: 165,
          durationMs: 820,
          speedTokPerSec: 201,
        },
      },
    ],
  },
  {
    id: "session-yesterday-1",
    title: "Web Audio Spatial API Synthesis",
    createdAt: Date.now() - 1000 * 60 * 60 * 26, // Yesterday (~26 hours ago)
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
    modelId: "claude-3-7-sonnet",
    messages: [
      {
        id: "m-5",
        role: "user",
        content: "Explain HRTF spatial panning in modern Web Audio.",
        createdAt: Date.now() - 1000 * 60 * 60 * 26,
      },
      {
        id: "m-6",
        role: "assistant",
        content: `**HRTF (Head-Related Transfer Function)** synthesizes 3D auditory cues by modeling acoustic diffraction around the human skull and ear pinnae.

\`\`\`javascript
const panner = new PannerNode(audioCtx, {
  panningModel: "HRTF",
  distanceModel: "inverse",
  refDistance: 1,
  maxDistance: 10000,
  rolloffFactor: 1,
  coneInnerAngle: 60,
  coneOuterAngle: 120,
  coneOuterGain: 0.15,
});
\`\`\`

Always verify that the user gesture unlocks the \`AudioContext\` before initiating playback.`,
        createdAt: Date.now() - 1000 * 60 * 60 * 25,
        status: "complete",
      },
    ],
  },
  {
    id: "session-week-1",
    title: "PostgreSQL B-Tree Index Optimization",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago (Previous 7 days)
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    modelId: "deepseek-r1",
    messages: [
      {
        id: "m-7",
        role: "user",
        content: "When does Postgres choose a Seq Scan over Index Scan?",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
      },
      {
        id: "m-8",
        role: "assistant",
        content: `PostgreSQL cost optimizer prefers a Sequential Scan when estimated selectivity exceeds roughly **10-15% of table pages**, because random disk seeks on index leaves cost more than contiguous page reads.`,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
        status: "complete",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   3. MOCK INTELLIGENT STREAM PROVIDER
   ═══════════════════════════════════════════════════════════════════════════ */

interface StreamProviderArgs {
  prompt: string;
  history: ChatMessage[];
  signal: AbortSignal;
  wordsPerSecond: number;
  onChunk: (chunk: string) => void;
  onComplete: (metrics: { tokens: number; durationMs: number; speedTokPerSec: number }) => void;
  onError: (error: Error) => void;
}

function generateMockResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("error") || p.includes("fail") || p.includes("test-error")) {
    throw new Error("HTTP 429: API Rate limit exceeded. Backoff quota replenished in 12s.");
  }

  if (p.includes("long-code") || p.includes("test-long-code")) {
    return `### Single-Line Horizontal Scroll Verification

Here is an uninterrupted continuous line of code exceeding 300 characters to verify horizontal scrolling integrity:

\`\`\`typescript
export const compileEnterpriseQuantumSimulationPipelineContextRegistryMatrix = (ctx: ExecutionContext, opts: CompilerOptions): PipelineResultDescriptor<QuantumCircuitTopologyMatrix, ImmutableTensorBufferQueueRef> => ctx.dispatchTelemetryEventSynchronousUnbufferedPipelineExecutionStageBatchWorkerProcessThreadIdentifier();
\`\`\`

Notice that the container maintains strict bounds without overflowing adjacent panes or viewport boundaries.`;
  }

  if (p.includes("kafka") || p.includes("pipeline") || p.includes("event")) {
    return `### High-Throughput Event Streaming Architecture (Go + Kafka)

To guarantee sub-millisecond dispatch under saturated consumer loads, we implement a pipelined worker pool decoupled via buffered channels:

\`\`\`go
package pipeline

import (
	"context"
	"sync"
	"github.com/segmentio/kafka-go"
)

type EventBatchProcessor struct {
	reader  *kafka.Reader
	workers int
	jobs    chan kafka.Message
	wg      sync.WaitGroup
}

func NewEventBatchProcessor(brokers []string, topic string, group string, workers int) *EventBatchProcessor {
	return &EventBatchProcessor{
		reader: kafka.NewReader(kafka.ReaderConfig{
			Brokers:  brokers,
			Topic:    topic,
			GroupID:  group,
			MinBytes: 10e3, // 10KB
			MaxBytes: 10e6, // 10MB
		}),
		workers: workers,
		jobs:    make(chan kafka.Message, workers*64),
	}
}

func (p *EventBatchProcessor) Start(ctx context.Context) error {
	for i := 0; i < p.workers; i++ {
		p.wg.Add(1)
		go p.worker(ctx)
	}

	for {
		msg, err := p.reader.FetchMessage(ctx)
		if err != nil {
			return err
		}
		select {
		case p.jobs <- msg:
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

func (p *EventBatchProcessor) worker(ctx context.Context) {
	defer p.wg.Done()
	for msg := range p.jobs {
		// Zero-allocation byte slice decoding
		processPayload(msg.Value)
		p.reader.CommitMessages(ctx, msg)
	}
}
\`\`\`

#### Telemetry Benchmarks

| Workers | Batch Size | Throughput (msg/sec) | p99 Latency | CPU Utilization |
| :--- | :--- | :--- | :--- | :--- |
| **8 cores** | \`1,000\` | \`184,200\` | \`1.24 ms\` | \`42%\` |
| **16 cores** | \`5,000\` | \`420,800\` | \`2.18 ms\` | \`68%\` |
| **32 cores** | \`10,000\` | \`890,500\` | \`3.85 ms\` | \`84%\` |

> **Key takeaway:** Decoupling network I/O from JSON decoding via pre-allocated Go ring buffers prevents GC pauses during traffic surges.`;
  }

  if (p.includes("benchmark") || p.includes("comparison") || p.includes("table") || p.includes("latency")) {
    return `### LLM Frontier Inference Benchmarks (2026 Telemetry)

Below is an empirical analysis across leading intelligence backends evaluated on complex reasoning and code synthesis workloads:

| Model Architecture | TTFT (Time to First Token) | Throughput (Tokens/s) | Context Window | Input Cost / 1M | Output Cost / 1M |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Claude 3.7 Sonnet** | \`180 ms\` | \`115 tok/s\` | \`200k\` | \`$3.00\` | \`$15.00\` |
| **GPT-4o** | \`210 ms\` | \`105 tok/s\` | \`128k\` | \`$2.50\` | \`$10.00\` |
| **DeepSeek R1** | \`340 ms\` | \`82 tok/s\` | \`64k\` | \`$0.55\` | \`$2.19\` |
| **Llama 3.3 70B (vLLM)** | \`95 ms\` | \`160 tok/s\` | \`128k\` | \`$0.20\` (Self-hosted) | \`$0.20\` |

#### Key Architectural Highlights
1. **Speculative Decoding:** Claude 3.7 Sonnet achieves a 35% speedup by pairing small draft models for common syntax tokens.
2. **Key-Value Cache Compression:** KV Cache quantization (FP8) maintains precision while lowering memory bandwidth constraints on high concurrent load.`;
  }

  // Default intelligent technical response
  return `### Enterprise Solution Overview

I have analyzed your request regarding **"${prompt.slice(0, 60)}${prompt.length > 60 ? "…" : ""}"**.

Here is an architectural implementation following NexoreUI craft standards:

\`\`\`typescript
export interface StreamPipelineOptions {
  batchSize: number;
  maxConcurrency: number;
  retryStrategy: "exponential" | "linear";
  telemetryHook?: (metrics: ExecutionTelemetry) => void;
}

export async function executeStreamingPipeline<T, R>(
  items: AsyncIterable<T>,
  handler: (item: T) => Promise<R>,
  options: StreamPipelineOptions
): Promise<R[]> {
  const results: R[] = [];
  const queue = new Set<Promise<void>>();

  for await (const item of items) {
    const task = handler(item).then((res) => {
      results.push(res);
    });

    queue.add(task);
    task.finally(() => queue.delete(task));

    if (queue.size >= options.maxConcurrency) {
      await Promise.race(queue);
    }
  }

  await Promise.all(queue);
  return results;
}
\`\`\`

#### Operational Characteristics
- **Memory Overhead:** Constrained strictly to active sliding buffer size.
- **Backpressure Protection:** Concurrency gate halts upstream pulling if downstream slows down.
- **Fail-Safe Recovery:** Errors during batch dispatch are recorded without killing parallel sibling workers.`;
}

async function streamMockResponse({
  prompt,
  signal,
  wordsPerSecond,
  onChunk,
  onComplete,
  onError,
}: StreamProviderArgs) {
  let fullText = "";
  try {
    fullText = generateMockResponse(prompt);
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
    return;
  }

  const startTime = performance.now();
  // Tokenize into words + markdown punctuation tokens
  const tokens = fullText.match(/(\s+|\n+|[^\s\n]+)/g) || [fullText];
  const delayMs = Math.max(8, Math.round(1000 / Math.max(10, wordsPerSecond)));

  let streamedTokens = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (signal.aborted) {
      const durationMs = performance.now() - startTime;
      onComplete({
        tokens: streamedTokens,
        durationMs,
        speedTokPerSec: Math.round((streamedTokens / (durationMs || 1)) * 1000),
      });
      return;
    }

    onChunk(tokens[i]);
    streamedTokens++;

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const durationMs = performance.now() - startTime;
  onComplete({
    tokens: streamedTokens,
    durationMs,
    speedTokPerSec: Math.round((streamedTokens / (durationMs || 1)) * 1000),
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. MARKDOWN & CODE HIGHLIGHTING ENGINE (Pure React / Zero Extra Dep)
   ═══════════════════════════════════════════════════════════════════════════ */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightSyntaxLine(line: string, isDark: boolean): string {
  const tokenRegex = /(\/\/.*$|#.*$)|("(?:\[\s\S]|[^"\\])*"|'(?:\[\s\S]|[^'\\])*'|`(?:\[\s\S]|[^`\\])*`)|(\b(?:import|export|from|default|function|const|let|var|return|async|await|class|interface|type|extends|implements|new|if|else|for|while|switch|case|break|try|catch|finally|throw|package|go|func|select|defer)\b)|(\b(?:string|number|boolean|any|void|unknown|never|Record|Array|Promise|Set|Map|z|error)\b)/g;

  return line.replace(tokenRegex, (match, comment, str, kw, type) => {
    if (comment) {
      return `<span style="color: ${isDark ? "#71717a" : "#6e7781"}; font-style: italic;">${escapeHtml(comment)}</span>`;
    }
    if (str) {
      return `<span style="color: ${isDark ? "#34d399" : "#0a8a44"}; font-weight: 500;">${escapeHtml(str)}</span>`;
    }
    if (kw) {
      return `<span style="color: ${isDark ? "#818cf8" : "#cf222e"}; font-weight: 600;">${escapeHtml(kw)}</span>`;
    }
    if (type) {
      return `<span style="color: ${isDark ? "#38bdf8" : "#953800"}; font-weight: 500;">${escapeHtml(type)}</span>`;
    }
    return escapeHtml(match);
  });
}

interface CodeBlockProps {
  language: string;
  code: string;
  theme: ThemeMode;
}

function CodeBlock({ language, code, theme }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedLines = useMemo(() => {
    const lines = code.split("\n");
    return lines.map((line) => highlightSyntaxLine(line, isDark));
  }, [code, isDark]);

  return (
    <div
      className={`my-4 rounded-xl overflow-hidden border transition-colors ${
        isDark
          ? "bg-[#0c0c0e] border-zinc-800/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          : "bg-[#f6f8fa] border-zinc-300 text-zinc-900 shadow-xs"
      }`}
    >
      {/* Header bar */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b ${
          isDark
            ? "border-zinc-800/80 bg-white/[0.02]"
            : "border-zinc-200 bg-zinc-100/90 text-zinc-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <FileCode className={`w-3.5 h-3.5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`} />
          <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            {language || "text"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code block"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-mono active:scale-95 transition-all ${
            isDark
              ? "text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10"
              : "text-zinc-700 hover:text-zinc-950 bg-white hover:bg-zinc-200 border border-zinc-200 shadow-xs"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code viewport with protected horizontal scroll */}
      <div className={`p-4 overflow-x-auto text-[13px] font-mono leading-relaxed max-w-full ${isDark ? "text-zinc-200" : "text-zinc-850"}`}>
        <pre className="inline-block min-w-full">
          <code>
            {highlightedLines.map((line, idx) => (
              <span
                key={idx}
                className="block whitespace-pre"
                dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
              />
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

interface MarkdownTableProps {
  lines: string[];
  theme: ThemeMode;
}

function MarkdownTable({ lines, theme }: MarkdownTableProps) {
  const isDark = theme === "dark";
  const headers = useMemo(() => {
    if (lines.length === 0) return [];
    return lines[0]
      .split("|")
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
  }, [lines]);

  const rows = useMemo(() => {
    if (lines.length < 3) return [];
    return lines.slice(2).map((rowLine) =>
      rowLine
        .split("|")
        .map((c) => c.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
    );
  }, [lines]);

  return (
    <div
      className={`my-4 overflow-x-auto rounded-xl border ${
        isDark
          ? "border-zinc-800 bg-[#0d0d10]"
          : "border-zinc-300 bg-white shadow-xs"
      }`}
    >
      <table className="w-full text-left text-xs border-collapse font-sans">
        <thead
          className={`${
            isDark
              ? "bg-zinc-900/90 text-zinc-200 border-b border-zinc-800"
              : "bg-zinc-100 text-zinc-900 border-b border-zinc-300"
          }`}
        >
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className={`px-3.5 py-2.5 font-semibold text-[11px] uppercase tracking-wider font-mono ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                {h.replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y font-sans ${isDark ? "divide-zinc-800/60" : "divide-zinc-200"}`}>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={`${
                rIdx % 2 === 0
                  ? isDark
                    ? "bg-zinc-950/40"
                    : "bg-white"
                  : isDark
                  ? "bg-zinc-900/20"
                  : "bg-zinc-50/70"
              } hover:bg-zinc-500/5 transition-colors`}
            >
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className={`px-3.5 py-2.5 leading-normal ${
                    isDark ? "text-zinc-300" : "text-zinc-800"
                  }`}
                >
                  {cell.startsWith("`") && cell.endsWith("`") ? (
                    <code
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                        isDark
                          ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                          : "bg-zinc-100 text-zinc-900 border border-zinc-300 font-medium"
                      }`}
                    >
                      {cell.replace(/`/g, "")}
                    </code>
                  ) : cell.startsWith("**") && cell.endsWith("**") ? (
                    <strong
                      className={`font-semibold ${
                        isDark ? "text-zinc-100" : "text-zinc-950 font-bold"
                      }`}
                    >
                      {cell.replace(/\*\*/g, "")}
                    </strong>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface MarkdownContentProps {
  content: string;
  isStreaming?: boolean;
  cursorStyle?: CursorStyle;
  theme: ThemeMode;
}

function MarkdownRenderer({
  content,
  isStreaming,
  cursorStyle = "line",
  theme,
}: MarkdownContentProps) {
  const isDark = theme === "dark";

  const renderedElements = useMemo(() => {
    const rawLines = content.split("\n");
    const elements: React.ReactNode[] = [];

    let inCodeBlock = false;
    let codeLanguage = "";
    let codeBuffer: string[] = [];

    let inTable = false;
    let tableBuffer: string[] = [];

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];

      // Code Block Detection
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <CodeBlock
              key={`code-${i}`}
              language={codeLanguage}
              code={codeBuffer.join("\n")}
              theme={theme}
            />
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          codeLanguage = line.trim().replace(/^```/, "").trim();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Markdown Table Detection
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        inTable = true;
        tableBuffer.push(line);
        continue;
      } else if (inTable) {
        elements.push(
          <MarkdownTable
            key={`table-${i}`}
            lines={[...tableBuffer]}
            theme={theme}
          />
        );
        tableBuffer = [];
        inTable = false;
      }

      // Headings
      if (line.startsWith("#### ")) {
        elements.push(
          <h4
            key={`h4-${i}`}
            className={`text-sm font-bold tracking-tight mt-4 mb-1.5 ${
              isDark ? "text-zinc-200" : "text-zinc-900"
            }`}
          >
            {line.replace("#### ", "")}
          </h4>
        );
        continue;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className={`text-base font-semibold tracking-tight mt-5 mb-2 ${
              isDark ? "text-zinc-200" : "text-zinc-900"
            }`}
          >
            {line.replace("### ", "")}
          </h3>
        );
        continue;
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className={`text-lg font-bold tracking-tight mt-6 mb-2.5 ${
              isDark ? "text-zinc-100" : "text-zinc-950 font-bold"
            }`}
          >
            {line.replace("## ", "")}
          </h2>
        );
        continue;
      }

      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={`h1-${i}`}
            className={`text-xl font-extrabold tracking-tight mt-6 mb-3 ${
              isDark ? "text-zinc-50" : "text-zinc-950 font-extrabold"
            }`}
          >
            {line.replace("# ", "")}
          </h1>
        );
        continue;
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className={`my-3 pl-3.5 border-l-2 italic text-sm ${
              isDark
                ? "border-zinc-700 text-zinc-400"
                : "border-zinc-300 text-zinc-600"
            }`}
          >
            {line.replace("> ", "")}
          </blockquote>
        );
        continue;
      }

      // Lists
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.trim().replace(/^[-*]\s+/, "");
        elements.push(
          <li
            key={`li-${i}`}
            className={`ml-4 list-disc text-sm my-1 leading-relaxed ${
              isDark ? "text-zinc-300" : "text-zinc-800"
            }`}
          >
            {renderInlineMarkdown(itemText, isDark)}
          </li>
        );
        continue;
      }

      // Numbered List
      if (/^\d+\.\s+/.test(line.trim())) {
        const itemText = line.trim().replace(/^\d+\.\s+/, "");
        elements.push(
          <li
            key={`oli-${i}`}
            className={`ml-4 list-decimal text-sm my-1 leading-relaxed ${
              isDark ? "text-zinc-300" : "text-zinc-800"
            }`}
          >
            {renderInlineMarkdown(itemText, isDark)}
          </li>
        );
        continue;
      }

      // Regular paragraph or empty line
      if (line.trim() === "") {
        elements.push(<div key={`sp-${i}`} className="h-2" />);
      } else {
        elements.push(
          <p
            key={`p-${i}`}
            className={`text-sm leading-relaxed my-1 ${
              isDark ? "text-zinc-300" : "text-zinc-800"
            }`}
          >
            {renderInlineMarkdown(line, isDark)}
          </p>
        );
      }
    }

    // Flush unclosed buffers during streaming
    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <CodeBlock
          key="code-unclosed"
          language={codeLanguage}
          code={codeBuffer.join("\n")}
          theme={theme}
        />
      );
    }
    if (inTable && tableBuffer.length > 0) {
      elements.push(
        <MarkdownTable
          key="table-unclosed"
          lines={tableBuffer}
          theme={theme}
        />
      );
    }

    return elements;
  }, [content, theme, isDark]);

  return (
    <div className="relative font-sans text-sm">
      {renderedElements}
      {isStreaming && <StreamingCursor style={cursorStyle} isDark={isDark} />}
    </div>
  );
}

function renderInlineMarkdown(text: string, isDark: boolean): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className={`px-1.5 py-0.5 rounded text-[12px] font-mono ${
            isDark
              ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
              : "bg-zinc-100 text-zinc-900 border border-zinc-300 font-medium"
          }`}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong
          key={match.index}
          className={`font-semibold ${isDark ? "text-zinc-100" : "text-zinc-950 font-bold"}`}
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-0.5 underline font-medium transition-colors ${
              isDark
                ? "text-zinc-100 hover:text-zinc-300"
                : "text-zinc-900 hover:text-zinc-700"
            }`}
          >
            {linkMatch[1]}
            <ExternalLink className="w-3 h-3 ml-0.5 inline opacity-70" />
          </a>
        );
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

function StreamingCursor({ style, isDark }: { style: CursorStyle; isDark: boolean }) {
  if (style === "block") {
    return (
      <span
        className={`inline-block w-2.5 h-4 ml-1 align-middle animate-pulse ${
          isDark ? "bg-zinc-100" : "bg-zinc-900"
        }`}
      />
    );
  }
  if (style === "pulse") {
    return (
      <span
        className={`inline-block w-2.5 h-2.5 ml-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)] animate-ping ${
          isDark ? "bg-zinc-100" : "bg-zinc-900"
        }`}
      />
    );
  }
  return (
    <span
      className={`inline-block w-0.5 h-4 ml-0.5 align-middle animate-[blink_1s_infinite] ${
        isDark ? "bg-zinc-100" : "bg-zinc-900"
      }`}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. HOOK: useChatStream (Pluggable Provider Architecture)
   ═══════════════════════════════════════════════════════════════════════════ */

export interface UseChatStreamProps {
  settings: StreamSettings;
  onNewMessage?: (msg: ChatMessage) => void;
  onUpdateMessage?: (msg: ChatMessage) => void;
}

export function useChatStream({
  settings,
  onNewMessage,
  onUpdateMessage,
}: UseChatStreamProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  }, []);

  const sendPrompt = useCallback(
    async (
      promptText: string,
      currentSession: ChatSession,
      attachments?: FileAttachment[]
    ) => {
      if (isGenerating) return;

      const userMsgId = "user-" + Date.now();
      const assistantMsgId = "assistant-" + (Date.now() + 1);

      const userMessage: ChatMessage = {
        id: userMsgId,
        role: "user",
        content: promptText,
        createdAt: Date.now(),
        attachments: attachments && attachments.length > 0 ? attachments : undefined,
      };

      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        createdAt: Date.now() + 1,
        status: "streaming",
      };

      onNewMessage?.(userMessage);
      onNewMessage?.(assistantMessage);

      setIsGenerating(true);
      setActiveMessageId(assistantMsgId);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      let accumulatedText = "";

      await streamMockResponse({
        prompt: promptText,
        history: [...currentSession.messages, userMessage],
        signal: controller.signal,
        wordsPerSecond: settings.wordsPerSecond,
        onChunk: (chunk) => {
          accumulatedText += chunk;
          onUpdateMessage?.({
            ...assistantMessage,
            content: accumulatedText,
            status: "streaming",
          });
        },
        onComplete: (metrics) => {
          setIsGenerating(false);
          setActiveMessageId(null);
          abortControllerRef.current = null;
          onUpdateMessage?.({
            ...assistantMessage,
            content: accumulatedText,
            status: controller.signal.aborted ? "stopped" : "complete",
            metrics,
          });
        },
        onError: (err) => {
          setIsGenerating(false);
          setActiveMessageId(null);
          abortControllerRef.current = null;
          onUpdateMessage?.({
            ...assistantMessage,
            content: accumulatedText,
            status: "error",
            errorMessage: err.message,
          });
        },
      });
    },
    [isGenerating, settings.wordsPerSecond, onNewMessage, onUpdateMessage]
  );

  return {
    isGenerating,
    activeMessageId,
    sendPrompt,
    stopStream,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. MAIN COMPONENT: AiChatInterface
   ═══════════════════════════════════════════════════════════════════════════ */

export interface AiChatInterfaceProps {
  theme?: ThemeMode;
  initialQuery?: string;
  onThemeChange?: (theme: ThemeMode) => void;
  deviceMode?: "desktop" | "tablet" | "mobile";
  className?: string;
}

export default function AiChatInterface({
  theme = "dark",
  initialQuery = "",
  onThemeChange,
  deviceMode,
  className,
}: AiChatInterfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    update();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const isMobile =
    deviceMode === "mobile" ||
    (containerWidth !== null ? containerWidth < 680 : false);
  const isTablet =
    deviceMode === "tablet" ||
    (containerWidth !== null ? containerWidth >= 680 && containerWidth < 960 : false);

  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(theme);
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(next);
    onThemeChange?.(next);
  };

  const isDark = currentTheme === "dark";

  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>("session-today-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [inputValue, setInputValue] = useState(initialQuery);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<StreamSettings>({
    wordsPerSecond: 65,
    cursorStyle: "line",
    reduceMotion: false,
    temperature: 0.7,
    model: "claude-3-7-sonnet",
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportTab, setExportTab] = useState<"full" | "hook" | "providers" | "route">("full");
  const [copiedCode, setCopiedCode] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || sessions[0];
  }, [sessions, activeSessionId]);

  const handleNewMessage = useCallback((msg: ChatMessage) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            updatedAt: Date.now(),
            messages: [...s.messages, msg],
          };
        }
        return s;
      })
    );
  }, [activeSessionId]);

  const handleUpdateMessage = useCallback((updatedMsg: ChatMessage) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            updatedAt: Date.now(),
            messages: s.messages.map((m) =>
              m.id === updatedMsg.id ? updatedMsg : m
            ),
          };
        }
        return s;
      })
    );
  }, [activeSessionId]);

  const { isGenerating, activeMessageId, sendPrompt, stopStream } = useChatStream({
    settings,
    onNewMessage: handleNewMessage,
    onUpdateMessage: handleUpdateMessage,
  });

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsUserScrolledUp(distanceFromBottom > 120);
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
    setIsUserScrolledUp(false);
  }, []);

  useEffect(() => {
    if (!isUserScrolledUp) {
      scrollToBottom(false);
    }
  }, [activeSession.messages, isUserScrolledUp, scrollToBottom]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextH = Math.min(el.scrollHeight, 180);
    el.style.height = `${Math.max(48, nextH)}px`;
  }, [inputValue]);

  const handleSend = () => {
    if ((!inputValue.trim() && attachments.length === 0) || isGenerating) return;
    const text = inputValue.trim();
    const currentAttachments = [...attachments];
    setInputValue("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
    }
    sendPrompt(text, activeSession, currentAttachments);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreateNewChat = () => {
    const newId = "session-" + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: "New Chat",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      modelId: settings.model,
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setIsMobileDrawerOpen(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== sessionId);
      if (remaining.length === 0) {
        const fallback: ChatSession = {
          id: "session-fallback",
          title: "New Chat",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [],
          modelId: settings.model,
        };
        setActiveSessionId(fallback.id);
        return [fallback];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingSessionId) return;
    const trimmed = editingTitle.trim() || "Untitled Chat";
    setSessions((prev) =>
      prev.map((s) => (s.id === editingSessionId ? { ...s, title: trimmed } : s))
    );
    setEditingSessionId(null);
  };

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [sessions, searchQuery]);

  const groupedSessions = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const groups: {
      today: ChatSession[];
      yesterday: ChatSession[];
      previous7Days: ChatSession[];
      older: ChatSession[];
    } = {
      today: [],
      yesterday: [],
      previous7Days: [],
      older: [],
    };

    filteredSessions.forEach((s) => {
      const diff = now - s.createdAt;
      if (diff < oneDay) {
        groups.today.push(s);
      } else if (diff < 2 * oneDay) {
        groups.yesterday.push(s);
      } else if (diff < 8 * oneDay) {
        groups.previous7Days.push(s);
      } else {
        groups.older.push(s);
      }
    });

    return groups;
  }, [filteredSessions]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: FileAttachment[] = Array.from(files).map((file) => ({
      id: "file-" + Math.random().toString(36).slice(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleRetryMessage = (failedMessage: ChatMessage) => {
    const lastUser = [...activeSession.messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUser) {
      sendPrompt(lastUser.content, activeSession);
    }
  };

  const handleReaction = (msgId: string, type: "like" | "dislike") => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === msgId
                  ? {
                      ...m,
                      reaction: m.reaction === type ? null : type,
                    }
                  : m
              ),
            }
          : s
      )
    );
  };

  const springConfig = settings.reduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 400, damping: 30 };

  return (
    <MotionConfig reducedMotion={settings.reduceMotion ? "always" : "user"}>
      <div
        ref={containerRef}
        className={`relative flex w-full h-full min-h-[640px] flex-1 overflow-hidden transition-colors font-sans antialiased ${className || ""} ${
          currentTheme === "dark"
            ? "bg-[#09090b] text-zinc-100"
            : "bg-[#fcfcfd] text-zinc-900"
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-30" />

        {/* SIDEBAR */}
        <aside
          className={`${isMobile ? "hidden" : "flex"} flex-col border-r transition-all duration-300 z-20 ${
            isSidebarOpen ? "w-72" : "w-0 overflow-hidden border-none"
          } ${
            currentTheme === "dark"
              ? "bg-[#0d0d10] border-zinc-800/80"
              : "bg-zinc-50 border-zinc-200"
          }`}
        >
          <div className="p-3.5 space-y-2.5">
            <button
              onClick={handleCreateNewChat}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                currentTheme === "dark"
                  ? "bg-zinc-100 text-zinc-900 hover:bg-white active:scale-[0.98] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]"
                  : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>New chat</span>
              </div>
              <span className="font-mono text-[10px] tracking-widest px-1.5 py-0.5 rounded opacity-60 bg-black/10 dark:bg-black/20">
                ⌘N
              </span>
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-7 py-1.5 text-xs rounded-lg transition-all outline-none ${
                  currentTheme === "dark"
                    ? "bg-zinc-900/80 text-zinc-200 border border-zinc-800 placeholder:text-zinc-500 focus:border-zinc-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                    : "bg-white text-zinc-800 border border-zinc-200 placeholder:text-zinc-400 focus:border-zinc-400 shadow-xs"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-4 py-2 text-xs">
            {groupedSessions.today.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase font-semibold text-zinc-400">
                  Today
                </div>
                <div className="space-y-0.5">
                  {groupedSessions.today.map((s) => (
                    <SidebarChatItem
                      key={s.id}
                      session={s}
                      active={s.id === activeSessionId}
                      theme={currentTheme}
                      editingId={editingSessionId}
                      editingTitle={editingTitle}
                      onSelect={() => setActiveSessionId(s.id)}
                      onStartRename={(e) => handleStartRename(s, e)}
                      onSaveRename={handleSaveRename}
                      onChangeTitle={setEditingTitle}
                      onDelete={(e) => handleDeleteSession(s.id, e)}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedSessions.yesterday.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase font-semibold text-zinc-400">
                  Yesterday
                </div>
                <div className="space-y-0.5">
                  {groupedSessions.yesterday.map((s) => (
                    <SidebarChatItem
                      key={s.id}
                      session={s}
                      active={s.id === activeSessionId}
                      theme={currentTheme}
                      editingId={editingSessionId}
                      editingTitle={editingTitle}
                      onSelect={() => setActiveSessionId(s.id)}
                      onStartRename={(e) => handleStartRename(s, e)}
                      onSaveRename={handleSaveRename}
                      onChangeTitle={setEditingTitle}
                      onDelete={(e) => handleDeleteSession(s.id, e)}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedSessions.previous7Days.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase font-semibold text-zinc-400">
                  Previous 7 Days
                </div>
                <div className="space-y-0.5">
                  {groupedSessions.previous7Days.map((s) => (
                    <SidebarChatItem
                      key={s.id}
                      session={s}
                      active={s.id === activeSessionId}
                      theme={currentTheme}
                      editingId={editingSessionId}
                      editingTitle={editingTitle}
                      onSelect={() => setActiveSessionId(s.id)}
                      onStartRename={(e) => handleStartRename(s, e)}
                      onSaveRename={handleSaveRename}
                      onChangeTitle={setEditingTitle}
                      onDelete={(e) => handleDeleteSession(s.id, e)}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedSessions.older.length > 0 && (
              <div>
                <div className="px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase font-semibold text-zinc-400">
                  Older
                </div>
                <div className="space-y-0.5">
                  {groupedSessions.older.map((s) => (
                    <SidebarChatItem
                      key={s.id}
                      session={s}
                      active={s.id === activeSessionId}
                      theme={currentTheme}
                      editingId={editingSessionId}
                      editingTitle={editingTitle}
                      onSelect={() => setActiveSessionId(s.id)}
                      onStartRename={(e) => handleStartRename(s, e)}
                      onSaveRename={handleSaveRename}
                      onChangeTitle={setEditingTitle}
                      onDelete={(e) => handleDeleteSession(s.id, e)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredSessions.length === 0 && (
              <div className="p-6 text-center text-zinc-400 text-xs">
                No matching conversations found.
              </div>
            )}
          </div>

          <div
            className={`p-3 border-t text-[11px] flex items-center justify-between ${
              currentTheme === "dark"
                ? "border-zinc-800/80 bg-zinc-950/40 text-zinc-400"
                : "border-zinc-200 bg-white text-zinc-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-mono text-[10px] tracking-tight">
                {settings.wordsPerSecond} tok/s · {settings.cursorStyle}
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1 hover:text-zinc-200 transition-colors"
              title="Stream Settings"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs z-40 cursor-pointer"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={springConfig}
                className={`absolute top-0 bottom-0 left-0 w-72 max-w-[85%] z-50 flex flex-col border-r shadow-2xl ${
                  isDark
                    ? "bg-[#0d0d10] border-zinc-800 text-zinc-100"
                    : "bg-[#f8f9fa] border-zinc-200 text-zinc-900"
                } ${
                  currentTheme === "dark"
                    ? "bg-[#0d0d10] border-zinc-800"
                    : "bg-white border-zinc-200"
                }`}
              >
                <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                  <div className="font-semibold text-sm tracking-tight flex items-center gap-2">
                    <Bot className="w-4 h-4 text-zinc-400" />
                    <span>Chat History</span>
                  </div>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-zinc-500/10 text-zinc-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3">
                  <button
                    onClick={handleCreateNewChat}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New chat</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {filteredSessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveSessionId(s.id);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center gap-2.5 ${
                        s.id === activeSessionId
                          ? "bg-zinc-200 dark:bg-zinc-800 font-medium"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      <span className="truncate">{s.title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MAIN CHAT */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative">
          <header
            className={`h-14 px-4 flex items-center justify-between border-b shrink-0 z-10 transition-colors ${
              currentTheme === "dark"
                ? "bg-[#09090b]/80 border-zinc-800/80 backdrop-blur-md"
                : "bg-white/80 border-zinc-200 backdrop-blur-md"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isMobile ? (
                <button
                  onClick={() => setIsMobileDrawerOpen(true)}
                  className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isDark
                      ? "bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700/80"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 shadow-xs"
                  }`}
                  aria-label="Open chat drawer"
                >
                  <Menu className="w-4 h-4" />
                  <span className="text-[11px] font-mono">Chats</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`p-1.5 rounded-lg flex hover:bg-zinc-500/10 transition-colors ${
                    isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                  title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <Layers className="w-4 h-4" />
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    currentTheme === "dark"
                      ? "bg-zinc-900/90 border-zinc-800 text-zinc-200 hover:border-zinc-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                      : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="truncate max-w-[120px] sm:max-w-[180px]">
                    {AVAILABLE_MODELS.find((m) => m.id === settings.model)?.name ||
                      settings.model}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSettingsOpen
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-500/10"
                }`}
                title="Streaming Speed & Tuning"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono text-[11px]">
                  {settings.wordsPerSecond} wps
                </span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-500/10 transition-colors"
                title={currentTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme"
              >
                {currentTheme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => {
                  if (typeof document !== "undefined") {
                    if (document.fullscreenElement) {
                      document.exitFullscreen().catch(() => {});
                    } else {
                      document.documentElement.requestFullscreen().catch(() => {});
                    }
                  }
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-500/10 transition-colors"
                title="Toggle Fullscreen"
                aria-label="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExportOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTheme === "dark"
                    ? "bg-white text-zinc-900 hover:bg-zinc-200 active:scale-95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)]"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 shadow-sm"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Export Code</span>
              </button>
            </div>
          </header>

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 relative"
          >
            <div className="max-w-[740px] mx-auto space-y-6">
              {activeSession.messages.length === 0 ? (
                <div className="py-8 sm:py-16 text-center space-y-8">
                  <div className="space-y-3">
                    <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] ${isDark ? "text-white" : "text-zinc-950"}`}>
                      What will we build today?
                    </h1>
                    <p className={`text-sm max-w-lg mx-auto leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                      High-fidelity streaming AI workspace. Adjust token velocity on-the-fly and swap models with a single line of code.
                    </p>
                  </div>

                  <div className={`grid gap-3 text-left ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                    {PROMPT_SUGGESTIONS.map((card) => (
                      <motion.button
                        key={card.id}
                        whileHover={settings.reduceMotion ? {} : { y: -3, scale: 1.01 }}
                        whileTap={settings.reduceMotion ? {} : { scale: 0.98 }}
                        transition={springConfig}
                        onClick={() => {
                          setInputValue(card.prompt);
                          textareaRef.current?.focus();
                        }}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          currentTheme === "dark"
                            ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                            : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80 shadow-xs"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-zinc-400 mb-2">
                            <span className="font-mono text-[10px] tracking-wider uppercase font-semibold">
                              {card.category}
                            </span>
                            {card.icon === "code" && <FileCode className="w-3.5 h-3.5" />}
                            {card.icon === "terminal" && <Terminal className="w-3.5 h-3.5" />}
                            {card.icon === "layers" && <Layers className="w-3.5 h-3.5" />}
                            {card.icon === "sparkles" && <Sparkles className="w-3.5 h-3.5" />}
                          </div>
                          <div className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            {card.title}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                            {card.description}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-[11px] font-mono text-zinc-400 font-medium">
                          <span>Use prompt</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                activeSession.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    theme={currentTheme}
                    cursorStyle={settings.cursorStyle}
                    reduceMotion={settings.reduceMotion}
                    onRetry={() => handleRetryMessage(message)}
                    onRegenerate={() => {
                      const userMsg = activeSession.messages.find((m) => m.role === "user");
                      if (userMsg) sendPrompt(userMsg.content, activeSession);
                    }}
                    onReaction={(type) => handleReaction(message.id, type)}
                  />
                ))
              )}

              {isGenerating &&
                activeSession.messages.length > 0 &&
                activeSession.messages[activeSession.messages.length - 1].role === "user" && (
                  <div className="flex items-start gap-3.5 py-4">
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                      <Bot className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex items-center gap-1.5 py-1 text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
            </div>
          </div>

          <AnimatePresence>
            {isUserScrolledUp && (
              <motion.button
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={springConfig}
                onClick={() => scrollToBottom(true)}
                className={`absolute bottom-[115px] left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium border shadow-xl z-30 transition-all ${
                  isDark
                    ? "bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700 shadow-lg"
                    : "bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100 shadow-lg font-medium"
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Jump to latest</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* INPUT AREA */}
          <div className="p-4 sm:px-8 shrink-0 z-10">
            <div
              className={`max-w-[740px] mx-auto rounded-2xl border p-2.5 transition-all shadow-md ${
                currentTheme === "dark"
                  ? "bg-[#111114] border-zinc-800 focus-within:border-zinc-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                  : "bg-white border-zinc-300 focus-within:border-zinc-400 shadow-sm"
              }`}
            >
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 p-1">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg text-xs font-mono bg-zinc-500/10 border border-zinc-500/20 text-zinc-300"
                    >
                      <Paperclip className="w-3 h-3 text-zinc-400" />
                      <span className="truncate max-w-[140px]">{file.name}</span>
                      <span className="text-[10px] text-zinc-500">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                      <button
                        onClick={() => removeAttachment(file.id)}
                        className="p-0.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything, write code, or query telemetry... (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="w-full px-2 py-1 text-sm bg-transparent outline-none resize-none leading-relaxed placeholder:text-zinc-500"
                style={{ maxHeight: "180px" }}
              />

              <div className="flex items-center justify-between pt-2 border-t border-zinc-500/10 mt-1">
                <div className="flex items-center gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-500/10 transition-colors"
                    title="Attach files or specs"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline ml-2">
                    Enter ↵ to send
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <button
                      type="button"
                      onClick={stopStream}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 active:scale-95 transition-all"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!inputValue.trim() && attachments.length === 0}
                      className={`p-2 rounded-xl transition-all ${
                        inputValue.trim() || attachments.length > 0
                          ? currentTheme === "dark"
                            ? "bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]"
                            : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95"
                          : "opacity-30 cursor-not-allowed text-zinc-400"
                      }`}
                      aria-label="Send message"
                    >
                      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* SETTINGS MODAL */}
        <AnimatePresence>
          {isSettingsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSettingsOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={springConfig}
                className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl z-10 transition-colors ${
                  isDark
                    ? "bg-[#121215] border-zinc-800 text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                    : "bg-white border-zinc-300 text-zinc-900 shadow-2xl"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Sliders className={`w-4 h-4 ${isDark ? "text-zinc-400" : "text-zinc-700"}`} />
                    <h3 className={`font-semibold text-sm tracking-tight ${isDark ? "text-zinc-100" : "text-zinc-950 font-bold"}`}>
                      Streaming Engine Tuning
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className={`p-1 rounded-lg transition-colors ${
                      isDark ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-5 text-xs">
                  <div className="space-y-2">
                    <label className={`font-semibold ${isDark ? "text-zinc-400" : "text-zinc-700"}`}>Target Model</label>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_MODELS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSettings((s) => ({ ...s, model: m.id }))}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            settings.model === m.id
                              ? isDark
                                ? "border-zinc-400 bg-zinc-500/20 text-white font-medium"
                                : "border-zinc-900 bg-zinc-100 text-zinc-950 font-semibold ring-1 ring-zinc-900 shadow-xs"
                              : isDark
                              ? "border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 bg-transparent"
                              : "border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-700"
                          }`}
                        >
                          <div className={`font-semibold ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>{m.name}</div>
                          <div className={`text-[10px] font-mono ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            {m.provider} · {m.context}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className={`font-semibold ${isDark ? "text-zinc-400" : "text-zinc-700"}`}>
                        Streaming Velocity
                      </label>
                      <span className={`font-mono font-semibold ${isDark ? "text-zinc-200" : "text-zinc-950 font-bold"}`}>
                        {settings.wordsPerSecond} words / sec
                      </span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={140}
                      step={5}
                      value={settings.wordsPerSecond}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          wordsPerSecond: Number(e.target.value),
                        }))
                      }
                      className={`w-full cursor-pointer ${isDark ? "accent-zinc-200" : "accent-zinc-900"}`}
                    />
                    <div className={`flex justify-between text-[10px] font-mono ${isDark ? "text-zinc-500" : "text-zinc-600 font-medium"}`}>
                      <span>15 wps (Cinematic)</span>
                      <span>65 wps (Standard)</span>
                      <span>140 wps (Ultra Fast)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`font-semibold ${isDark ? "text-zinc-400" : "text-zinc-700"}`}>Cursor Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["line", "block", "pulse"] as CursorStyle[]).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setSettings((s) => ({ ...s, cursorStyle: style }))}
                          className={`p-2.5 rounded-xl border capitalize font-medium transition-all ${
                            settings.cursorStyle === style
                              ? isDark
                                ? "border-zinc-400 bg-zinc-500/20 text-zinc-100 font-semibold"
                                : "border-zinc-900 bg-zinc-100 text-zinc-950 font-semibold ring-1 ring-zinc-900 shadow-xs"
                              : isDark
                              ? "border-zinc-800 hover:border-zinc-700 text-zinc-400 bg-transparent"
                              : "border-zinc-300 hover:border-zinc-400 bg-white text-zinc-700"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className={`font-semibold ${isDark ? "text-zinc-400" : "text-zinc-700"}`}>
                        Temperature (Creativity)
                      </label>
                      <span className={`font-mono font-semibold ${isDark ? "text-zinc-200" : "text-zinc-950 font-bold"}`}>
                        {settings.temperature.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={settings.temperature}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          temperature: Number(e.target.value),
                        }))
                      }
                      className={`w-full cursor-pointer ${isDark ? "accent-zinc-200" : "accent-zinc-900"}`}
                    />
                  </div>

                  <div className={`flex items-center justify-between pt-3 border-t ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                    <div>
                      <div className={`font-semibold ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>Reduce Motion</div>
                      <div className={`text-[11px] ${isDark ? "text-zinc-500" : "text-zinc-600 font-medium"}`}>
                        Disable smooth spring physics & transitions
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.reduceMotion}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, reduceMotion: e.target.checked }))
                      }
                      className={`w-4 h-4 rounded cursor-pointer ${isDark ? "accent-zinc-200" : "accent-zinc-900"}`}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold active:scale-95 transition-all ${
                      isDark
                        ? "bg-white text-zinc-900 hover:bg-zinc-200"
                        : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm"
                    }`}
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* EXPORT CODE MODAL */}
        <AnimatePresence>
          {isExportOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsExportOpen(false)}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={springConfig}
                className={`relative w-full max-w-3xl max-h-[85vh] rounded-2xl border flex flex-col shadow-2xl z-10 overflow-hidden ${
                  currentTheme === "dark"
                    ? "bg-[#0e0e12] border-zinc-800 text-zinc-100"
                    : "bg-white border-zinc-200 text-zinc-900"
                }`}
              >
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-zinc-400" />
                    <h3 className="font-semibold text-sm tracking-tight">
                      Export Production Code
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const code = getExportCode(exportTab);
                        navigator.clipboard.writeText(code);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-zinc-900 hover:bg-zinc-200 active:scale-95 transition-all"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const code = getExportCode(exportTab);
                        const blob = new Blob([code], { type: "text/typescript" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download =
                          exportTab === "full"
                            ? "AiChatInterface.tsx"
                            : exportTab === "hook"
                            ? "useChatStream.ts"
                            : exportTab === "providers"
                            ? "ai-providers.ts"
                            : "api-chat-route.ts";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-500/10"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsExportOpen(false)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-500/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/40 text-xs font-medium shrink-0">
                  <button
                    onClick={() => setExportTab("full")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      exportTab === "full"
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    AiChatInterface.tsx (Complete)
                  </button>
                  <button
                    onClick={() => setExportTab("providers")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      exportTab === "providers"
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    AI Providers (OpenAI, Claude, SSE)
                  </button>
                  <button
                    onClick={() => setExportTab("route")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      exportTab === "route"
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Next.js Server Route (/api/chat)
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-4 text-[13px] font-mono bg-[#08080a] text-zinc-300">
                  <pre className="whitespace-pre">
                    <code>{getExportCode(exportTab)}</code>
                  </pre>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. SUB-COMPONENTS (MessageBubble, SidebarChatItem)
   ═══════════════════════════════════════════════════════════════════════════ */

interface SidebarChatItemProps {
  session: ChatSession;
  active: boolean;
  theme: ThemeMode;
  editingId: string | null;
  editingTitle: string;
  onSelect: () => void;
  onStartRename: (e: React.MouseEvent) => void;
  onSaveRename: (e?: React.FormEvent) => void;
  onChangeTitle: (val: string) => void;
  onDelete: (e: React.MouseEvent) => void;
}

function SidebarChatItem({
  session,
  active,
  theme,
  editingId,
  editingTitle,
  onSelect,
  onStartRename,
  onSaveRename,
  onChangeTitle,
  onDelete,
}: SidebarChatItemProps) {
  const isDark = theme === "dark";
  const isEditing = editingId === session.id;

  if (isEditing) {
    return (
      <form onSubmit={onSaveRename} className="px-2 py-1">
        <input
          autoFocus
          type="text"
          value={editingTitle}
          onChange={(e) => onChangeTitle(e.target.value)}
          onBlur={() => onSaveRename()}
          className="w-full px-2 py-1 text-xs rounded bg-zinc-800 text-white border border-zinc-700 outline-none"
        />
      </form>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition-all ${
        active
          ? isDark
            ? "bg-zinc-800/90 text-zinc-100 font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            : "bg-zinc-200/90 text-zinc-950 font-semibold shadow-xs"
          : isDark
          ? "hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
          : "hover:bg-zinc-200/60 text-zinc-700 hover:text-zinc-950"
      }`}
    >
      <div className="flex items-center gap-2 truncate pr-2">
        <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
        <span className="truncate text-xs">{session.title}</span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onStartRename}
          className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-zinc-200"
          title="Rename conversation"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
          title="Delete conversation"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  theme: ThemeMode;
  cursorStyle: CursorStyle;
  reduceMotion: boolean;
  onRetry: () => void;
  onRegenerate: () => void;
  onReaction: (type: "like" | "dislike") => void;
}

function MessageBubble({
  message,
  theme,
  cursorStyle,
  reduceMotion,
  onRetry,
  onRegenerate,
  onReaction,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === "user";

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-start gap-3.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
          isUser
            ? "bg-zinc-800 text-zinc-200 border-zinc-700"
            : theme === "dark"
            ? "bg-[#18181b] text-white border-zinc-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
            : "bg-zinc-900 text-white border-zinc-900"
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>

      <div className={`max-w-[85%] sm:max-w-[78%] space-y-2 ${isUser ? "text-right" : "text-left"}`}>
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-end mb-1.5">
            {message.attachments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-800/80 border border-zinc-700 text-zinc-300"
              >
                <Paperclip className="w-3 h-3 text-zinc-400" />
                <span>{a.name}</span>
              </div>
            ))}
          </div>
        )}

        <div
          className={`px-4 py-3 rounded-2xl transition-all leading-relaxed ${
            isUser
              ? isDark
                ? "bg-zinc-850 text-zinc-100 border border-zinc-750 rounded-tr-xs shadow-sm"
                : "bg-[#f0f2f5] text-zinc-950 border border-zinc-300 rounded-tr-xs shadow-xs font-sans"
              : isDark
              ? "bg-[#141418] border border-zinc-800/90 text-zinc-200 rounded-tl-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
              : "bg-white border border-zinc-300 text-zinc-900 rounded-tl-xs shadow-xs"
          }`}
        >
          {isUser ? (
            <p className={`text-sm leading-relaxed whitespace-pre-wrap font-sans ${isDark ? "text-zinc-100" : "text-zinc-950 font-medium"}`}>
              {message.content}
            </p>
          ) : message.status === "error" ? (
            <div className="space-y-2.5 text-left">
              <div className="flex items-center gap-2 text-red-500 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Generation Failed</span>
              </div>
              <p className={`text-xs font-mono ${isDark ? "text-zinc-400" : "text-zinc-700"}`}>
                {message.errorMessage || "The model request was interrupted."}
              </p>
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Request</span>
              </button>
            </div>
          ) : (
            <MarkdownRenderer
              content={message.content}
              isStreaming={message.status === "streaming"}
              cursorStyle={cursorStyle}
              theme={theme}
            />
          )}

          {message.status === "stopped" && (
            <div className="mt-3 pt-2 border-t border-zinc-500/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Square className="w-2.5 h-2.5 fill-current" />
                Generation paused by user
              </span>
              <button
                onClick={onRegenerate}
                className="hover:text-white transition-colors underline"
              >
                Resume / Regenerate
              </button>
            </div>
          )}
        </div>

        {!isUser && message.status !== "error" && message.content && (
          <div className="flex items-center gap-3 px-1 text-xs text-zinc-400">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
              title="Regenerate response"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 ml-1 border-l border-zinc-500/20 pl-2">
              <button
                onClick={() => onReaction("like")}
                className={`p-1 rounded hover:text-zinc-200 transition-colors ${
                  message.reaction === "like" ? "text-emerald-400 font-bold" : ""
                }`}
                title="Helpful"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => onReaction("dislike")}
                className={`p-1 rounded hover:text-zinc-200 transition-colors ${
                  message.reaction === "dislike" ? "text-rose-400 font-bold" : ""
                }`}
                title="Unhelpful"
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>

            {message.metrics && (
              <span className="font-mono text-[10px] text-zinc-500 ml-auto">
                {message.metrics.tokens} tokens · {(message.metrics.durationMs / 1000).toFixed(1)}s · {message.metrics.speedTokPerSec} tok/s
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. CODE EXPORT GENERATOR (Pluggable: OpenAI, Anthropic, Custom SSE)
   ═══════════════════════════════════════════════════════════════════════════ */

function getRouteExportCode(): string {
  return `// app/api/chat/route.ts
// Next.js 15 Server-Side Streaming Endpoint
// API keys are safely held in environment variables, NEVER exposed to client.

import { NextRequest } from "next/server";

export const runtime = "edge"; // Or "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "gpt-4o" } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY on server" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(errText, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}`;
}

function getProvidersExportCode(): string {
  return `/**
 * AI Providers for NexoreUI Chat Interface
 * Single-line swap between Mock, OpenAI, Anthropic, and Custom SSE Backend.
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export type StreamTokenHandler = (chunk: string) => void;

/**
 * 1. REAL OPENAI PROVIDER (Connects to /api/chat route)
 */
export async function streamOpenAIProvider(
  messages: ChatMessage[],
  signal: AbortSignal,
  onToken: StreamTokenHandler
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model: "gpt-4o" }),
    signal,
  });

  if (!response.ok) throw new Error(\`OpenAI Error: \${response.statusText}\`);
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\\n");
    for (const line of lines) {
      if (line.startsWith("data: ") && line !== "data: [DONE]") {
        try {
          const json = JSON.parse(line.replace("data: ", ""));
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) onToken(delta);
        } catch {
          // Keep streaming
        }
      }
    }
  }
}

/**
 * 2. REAL ANTHROPIC CLAUDE PROVIDER
 */
export async function streamAnthropicProvider(
  messages: ChatMessage[],
  signal: AbortSignal,
  onToken: StreamTokenHandler
) {
  const response = await fetch("/api/anthropic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model: "claude-3-7-sonnet" }),
    signal,
  });

  if (!response.ok) throw new Error(\`Claude Error: \${response.statusText}\`);
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value));
  }
}

/**
 * 3. CUSTOM BACKEND VIA SSE
 */
export async function streamCustomBackendProvider(
  endpointUrl: string,
  messages: ChatMessage[],
  signal: AbortSignal,
  onToken: StreamTokenHandler
) {
  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });

  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value));
  }
}`;
}

function getFullComponentExportCode(): string {
  return `/**
 * NexoreUI "AI Chat Interface" Template
 * Full code is 100% standalone and self-contained with no extra dependencies besides framer-motion & lucide-react.
 * Install: npx nexoreui add template-ai-chat-interface
 */

"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  Bot, User, ArrowUp, ArrowDown, Square, Plus, Search, X, Check, Copy, RefreshCw,
  ThumbsUp, ThumbsDown, Paperclip, Sliders, Moon, Sun, Layers, MessageSquare,
  Trash2, Pencil, ExternalLink, FileCode, Terminal, Sparkles, Cpu, Gauge,
  History, AlertCircle, ChevronDown, ChevronRight, Download, Code2
} from "lucide-react";

export type ThemeMode = "dark" | "light";
export type CursorStyle = "block" | "line" | "pulse";

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
  status?: "streaming" | "complete" | "stopped" | "error";
  errorMessage?: string;
  attachments?: FileAttachment[];
  metrics?: { tokens: number; durationMs: number; speedTokPerSec: number };
  reaction?: "like" | "dislike" | null;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  modelId: string;
}

export interface StreamSettings {
  wordsPerSecond: number;
  cursorStyle: CursorStyle;
  reduceMotion: boolean;
  temperature: number;
  model: string;
}

const PROMPT_SUGGESTIONS = [
  {
    id: "p1",
    category: "Architecture",
    title: "High-Throughput Streaming Pipeline",
    description: "Design an ultra-low latency event pipeline in Go & Apache Kafka.",
    prompt: "Design a high-throughput event streaming pipeline in Go using Apache Kafka. Include code for consumer groups, backpressure handling, and a summary benchmark table.",
    icon: "layers",
  },
  {
    id: "p2",
    category: "Fullstack",
    title: "React Hook Form + Zod v4 Schema",
    description: "Build a production-grade polymorphic form validation model.",
    prompt: "Create a typed React Hook Form component using Zod v4 schema with discriminated unions, async validation, and clean accessibility focus attributes.",
    icon: "code",
  },
  {
    id: "p3",
    category: "Telemetry",
    title: "Microsecond Latency Monitor",
    description: "Implement an algorithmic sliding window p99 quantile tracker.",
    prompt: "Write a high-performance TypeScript sliding-window quantile calculator (p50, p95, p99) for tracking microsecond network request latency.",
    icon: "terminal",
  },
  {
    id: "p4",
    category: "Systems",
    title: "LLM Inference Cost & Latency Benchmark",
    description: "Compare Claude 3.7 Sonnet, GPT-4o, and DeepSeek R1.",
    prompt: "Provide a comprehensive comparison table of Claude 3.7 Sonnet, GPT-4o, and DeepSeek R1, analyzing time-to-first-token (TTFT), tokens/sec, and pricing per 1M tokens.",
    icon: "sparkles",
  },
];

function generateMockResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("error") || p.includes("fail") || p.includes("test-error")) {
    throw new Error("HTTP 429: Rate limit exceeded. Quota replenishment scheduled.");
  }
  return \`### Solution Overview\\n\\nHere is an architectural implementation following NexoreUI craft standards:\\n\\n\\\`\\\`\\\`typescript\\nexport interface StreamPipelineOptions {\\n  batchSize: number;\\n  maxConcurrency: number;\\n}\\n\\nexport async function executePipeline<T>(items: T[]): Promise<void> {\\n  // Parallel stream processor\\n}\\n\\\`\\\`\\\`\\n\\n- **Memory Overhead:** Constrained strictly to active sliding buffer size.\\n- **Backpressure Protection:** Concurrency gate halts upstream pulling if downstream slows down.\`;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-zinc-800 bg-[#0c0c0e] text-zinc-100">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">{language || "code"}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-mono text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
}

function MarkdownRenderer({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  const lines = content.split("\\n");
  let inCode = false;
  let codeBuffer: string[] = [];
  let lang = "";
  const rendered: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.trim().startsWith("\`\`\`")) {
      if (inCode) {
        rendered.push(<CodeBlock key={i} language={lang} code={codeBuffer.join("\\n")} />);
        codeBuffer = [];
        inCode = false;
      } else {
        lang = l.trim().replace(/^\`\`\`/, "");
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(l);
      continue;
    }
    if (l.startsWith("### ")) {
      rendered.push(<h3 key={i} className="text-base font-semibold mt-4 mb-2">{l.replace("### ", "")}</h3>);
    } else if (l.startsWith("- ")) {
      rendered.push(<li key={i} className="ml-4 list-disc text-sm my-1">{l.replace("- ", "")}</li>);
    } else if (l.trim()) {
      rendered.push(<p key={i} className="text-sm leading-relaxed my-1">{l}</p>);
    }
  }

  return (
    <div className="text-sm font-sans">
      {rendered}
      {isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-current align-middle animate-pulse" />}
    </div>
  );
}

export default function AiChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: "s-1", title: "Streaming Architecture", createdAt: Date.now(), updatedAt: Date.now(), messages: [], modelId: "gpt-4o" }
  ]);
  const [activeId, setActiveId] = useState("s-1");
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const activeSession = sessions.find((s) => s.id === activeId) || sessions[0];

  const handleSend = async (text: string) => {
    if (!text.trim() || isGenerating) return;
    const userMsg: ChatMessage = { id: "u-" + Date.now(), role: "user", content: text, createdAt: Date.now() };
    const botMsg: ChatMessage = { id: "b-" + Date.now(), role: "assistant", content: "", createdAt: Date.now() + 1, status: "streaming" };

    setSessions((prev) => prev.map((s) => s.id === activeId ? { ...s, messages: [...s.messages, userMsg, botMsg] } : s));
    setInput("");
    setIsGenerating(true);

    const fullResponse = generateMockResponse(text);
    const words = fullResponse.split(" ");
    let curr = "";

    for (let i = 0; i < words.length; i++) {
      curr += (i === 0 ? "" : " ") + words[i];
      setSessions((prev) => prev.map((s) => s.id === activeId ? {
        ...s,
        messages: s.messages.map((m) => m.id === botMsg.id ? { ...m, content: curr, status: "streaming" } : m)
      } : s));
      await new Promise((r) => setTimeout(r, 25));
    }

    setSessions((prev) => prev.map((s) => s.id === activeId ? {
      ...s,
      messages: s.messages.map((m) => m.id === botMsg.id ? { ...m, content: curr, status: "complete" } : m)
    } : s));
    setIsGenerating(false);
  };

  return (
    <div className="w-full max-w-5xl h-[700px] mx-auto rounded-2xl border border-zinc-800 bg-[#09090b] text-zinc-100 flex overflow-hidden shadow-2xl">
      <aside className="w-64 border-r border-zinc-800 bg-[#0c0c0e] flex flex-col p-3">
        <button
          onClick={() => {
            const newS: ChatSession = { id: "s-" + Date.now(), title: "New Chat", createdAt: Date.now(), updatedAt: Date.now(), messages: [], modelId: "gpt-4o" };
            setSessions((p) => [newS, ...p]);
            setActiveId(newS.id);
          }}
          className="w-full py-2 px-3 rounded-xl bg-white text-zinc-900 font-semibold text-xs flex items-center justify-between mb-4 shadow"
        >
          <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> New chat</span>
          <span className="font-mono text-[10px] opacity-60">⌘N</span>
        </button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={\`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 \${s.id === activeId ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"}\`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full bg-[#09090b]">
        <header className="h-12 border-b border-zinc-800 px-4 flex items-center justify-between">
          <div className="font-semibold text-xs flex items-center gap-2 text-zinc-300">
            <Bot className="w-4 h-4" />
            <span>Claude 3.7 Sonnet / GPT-4o</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">What will we build today?</h2>
              <div className="grid grid-cols-2 gap-3 max-w-xl text-left">
                {PROMPT_SUGGESTIONS.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleSend(card.prompt)}
                    className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 transition-all text-xs"
                  >
                    <div className="font-semibold text-zinc-200 mb-1">{card.title}</div>
                    <div className="text-[11px] text-zinc-400 line-clamp-2">{card.description}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            activeSession.messages.map((m) => (
              <div key={m.id} className={\`flex gap-3 \${m.role === "user" ? "justify-end" : "justify-start"}\`}>
                <div className={\`p-3.5 rounded-2xl max-w-[80%] leading-relaxed \${m.role === "user" ? "bg-zinc-800 text-white" : "bg-zinc-900/80 border border-zinc-800 text-zinc-200"}\`}>
                  <MarkdownRenderer content={m.content} isStreaming={m.status === "streaming"} />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#121215] p-1.5 focus-within:border-zinc-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Ask anything... (Enter to send)"
              className="flex-1 px-3 py-1.5 bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isGenerating}
              className="p-2 rounded-lg bg-white text-zinc-900 hover:bg-zinc-200 disabled:opacity-40"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}`;
}

function getExportCode(tab: "full" | "hook" | "providers" | "route"): string {
  if (tab === "route") return getRouteExportCode();
  if (tab === "providers") return getProvidersExportCode();
  return getFullComponentExportCode();
}
