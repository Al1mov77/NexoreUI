export const nodeFlowGraph = {
  name: "node-flow-graph",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion",
  "lucide-react"
],
  
  fileName: "node-flow-graph.tsx",
  content: `'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2, AlertCircle, Loader2, Sparkles, Bot, Database, Globe, Cpu, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export type NodeStatus = 'idle' | 'running' | 'completed' | 'error';

export interface FlowNode {
  id: string;
  label: string;
  type: string;
  icon?: 'bot' | 'db' | 'globe' | 'cpu';
  status: NodeStatus;
  x: number;
  y: number;
  dataSummary?: string;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  animated?: boolean;
}

export interface NodeFlowGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of initial graph nodes */
  initialNodes?: FlowNode[];
  /** Array of directed edges linking nodes */
  initialEdges?: FlowEdge[];
  /** Whether nodes can be dragged */
  interactive?: boolean;
  /** Whether the execution toolbar is visible */
  showToolbar?: boolean;
  /** Title header for the workflow canvas */
  title?: string;
  /** Theme mode override */
  theme?: 'dark' | 'light' | 'auto';
}

const defaultNodes: FlowNode[] = [
  {
    id: 'n1',
    label: 'AI Intent Classifier',
    type: 'Model Agent',
    icon: 'bot',
    status: 'completed',
    x: 40,
    y: 90,
    dataSummary: 'gpt-4o-mini ~ 99.4% conf',
  },
  {
    id: 'n2',
    label: 'Vector DB Retrieval',
    type: 'Semantic Index',
    icon: 'db',
    status: 'idle',
    x: 290,
    y: 50,
    dataSummary: 'Pinecone / 1536 dims',
  },
  {
    id: 'n3',
    label: 'External API Webhook',
    type: 'Integration',
    icon: 'globe',
    status: 'idle',
    x: 290,
    y: 190,
    dataSummary: 'Stripe v2 Webhook',
  },
  {
    id: 'n4',
    label: 'Synthesis & Dispatch',
    type: 'Executor',
    icon: 'cpu',
    status: 'idle',
    x: 540,
    y: 120,
    dataSummary: '200 OK / 142ms latency',
  },
];

const defaultEdges: FlowEdge[] = [
  { id: 'e1-2', from: 'n1', to: 'n2', animated: true },
  { id: 'e1-3', from: 'n1', to: 'n3', animated: true },
  { id: 'e2-4', from: 'n2', to: 'n4', animated: true },
  { id: 'e3-4', from: 'n3', to: 'n4', animated: true },
];

export const NodeFlowGraph = React.forwardRef<HTMLDivElement, NodeFlowGraphProps>(
  (
    {
      initialNodes = defaultNodes,
      initialEdges = defaultEdges,
      interactive = true,
      showToolbar = true,
      title = 'AGENTIC WORKFLOW PIPELINE',
      theme = 'auto',
      className,
      ...props
    },
    ref
  ) => {
    const [nodes, setNodes] = React.useState<FlowNode[]>(initialNodes);
    const [edges] = React.useState<FlowEdge[]>(initialEdges);
    const [isRunning, setIsRunning] = React.useState(false);
    const [activeEdge, setActiveEdge] = React.useState<string | null>(null);

    const canvasRef = React.useRef<HTMLDivElement>(null);
    const draggingNodeRef = React.useRef<{ id: string; startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);

    // Node dragging handlers
    const handlePointerDown = (id: string, e: React.PointerEvent) => {
      if (!interactive) return;
      const targetNode = nodes.find((n) => n.id === id);
      if (!targetNode) return;

      draggingNodeRef.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        nodeX: targetNode.x,
        nodeY: targetNode.y,
      };
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!draggingNodeRef.current) return;
      const { id, startX, startY, nodeX, nodeY } = draggingNodeRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== id) return node;
          return {
            ...node,
            x: Math.max(10, Math.min(640, nodeX + dx)),
            y: Math.max(10, Math.min(260, nodeY + dy)),
          };
        })
      );
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!draggingNodeRef.current) return;
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      draggingNodeRef.current = null;
    };

    // Sequential pipeline run simulation
    const runPipeline = React.useCallback(async () => {
      if (isRunning) return;
      setIsRunning(true);

      // Reset all nodes
      setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));
      setActiveEdge(null);

      // Step 1: n1 running
      setNodes((prev) => prev.map((n) => (n.id === 'n1' ? { ...n, status: 'running' } : n)));
      await new Promise((r) => setTimeout(r, 700));
      setNodes((prev) => prev.map((n) => (n.id === 'n1' ? { ...n, status: 'completed' } : n)));

      // Data emits along e1-2 & e1-3
      setActiveEdge('e1-2');
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: n2 & n3 running
      setNodes((prev) =>
        prev.map((n) => (n.id === 'n2' || n.id === 'n3' ? { ...n, status: 'running' } : n))
      );
      await new Promise((r) => setTimeout(r, 800));
      setNodes((prev) =>
        prev.map((n) => (n.id === 'n2' || n.id === 'n3' ? { ...n, status: 'completed' } : n))
      );

      // Data emits along e2-4 & e3-4
      setActiveEdge('e2-4');
      await new Promise((r) => setTimeout(r, 600));

      // Step 3: n4 running
      setNodes((prev) => prev.map((n) => (n.id === 'n4' ? { ...n, status: 'running' } : n)));
      await new Promise((r) => setTimeout(r, 750));
      setNodes((prev) => prev.map((n) => (n.id === 'n4' ? { ...n, status: 'completed' } : n)));

      setActiveEdge(null);
      setIsRunning(false);
    }, [isRunning]);

    const resetPipeline = () => {
      setIsRunning(false);
      setActiveEdge(null);
      setNodes(defaultNodes);
    };

    const getNodeCoordinates = (id: string): { outputX: number; outputY: number; inputX: number; inputY: number } => {
      const node = nodes.find((n) => n.id === id);
      if (!node) return { outputX: 0, outputY: 0, inputX: 0, inputY: 0 };
      return {
        outputX: node.x + 190,
        outputY: node.y + 36,
        inputX: node.x,
        inputY: node.y + 36,
      };
    };

    const renderIcon = (icon?: string) => {
      switch (icon) {
        case 'bot':
          return <Bot className="w-3.5 h-3.5 text-cyan-500" />;
        case 'db':
          return <Database className="w-3.5 h-3.5 text-purple-500" />;
        case 'globe':
          return <Globe className="w-3.5 h-3.5 text-emerald-500" />;
        default:
          return <Cpu className="w-3.5 h-3.5 text-amber-500" />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex flex-col p-6 rounded-3xl transition-all duration-300 select-none overflow-hidden',
          'bg-white dark:bg-[#07090f] border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-black/70 w-full',
          className
        )}
        {...props}
      >
        {/* Top Header */}
        <div className="w-full flex items-center justify-between mb-4 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">
              {title}
            </span>
          </div>

          {showToolbar && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetPipeline}
                disabled={isRunning}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                title="Reset Workflow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={runPipeline}
                disabled={isRunning}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer',
                  isRunning
                    ? 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30'
                    : 'bg-primary text-primary-foreground border-primary hover:opacity-90 shadow-md shadow-primary/20'
                )}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> EXECUTING...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> RUN PIPELINE
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Interactive Graph Canvas */}
        <div
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full h-[360px] rounded-2xl bg-slate-50 dark:bg-[#090c14] border border-slate-200/70 dark:border-white/5 overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(148, 163, 184, 0.25) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Connecting SVG Bezier Spline Cables */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="flow-cable-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="cable-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {edges.map((edge) => {
              const fromCoords = getNodeCoordinates(edge.from);
              const toCoords = getNodeCoordinates(edge.to);

              const x1 = fromCoords.outputX;
              const y1 = fromCoords.outputY;
              const x2 = toCoords.inputX;
              const y2 = toCoords.inputY;

              const dx = Math.abs(x2 - x1) * 0.55;
              const pathD = \`M \${x1} \${y1} C \${x1 + dx} \${y1}, \${x2 - dx} \${y2}, \${x2} \${y2}\`;

              const isEdgeActive = isRunning || activeEdge === edge.id;

              return (
                <g key={edge.id}>
                  {/* Background Cable Wire */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="text-slate-300 dark:text-slate-800"
                  />
                  {/* Active Highlight Cable */}
                  {isEdgeActive && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="url(#flow-cable-grad)"
                      strokeWidth={2.5}
                      filter="url(#cable-glow)"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Flow Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              onPointerDown={(e) => handlePointerDown(node.id, e)}
              style={{
                transform: \`translate3d(\${node.x}px, \${node.y}px, 0)\`,
              }}
              className={cn(
                'absolute w-[190px] rounded-xl p-3 select-none transition-shadow duration-200 z-10',
                interactive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
                'bg-white dark:bg-[#0e121c] border border-slate-200/90 dark:border-white/10 shadow-lg',
                node.status === 'running' && 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
                node.status === 'completed' && 'border-emerald-500/40'
              )}
            >
              {/* Input Port Anchor */}
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-primary" />

              {/* Output Port Anchor */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-emerald-500" />

              {/* Node Header Row */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    {renderIcon(node.icon)}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{node.type}</span>
                </div>

                {/* Status Indicator */}
                {node.status === 'running' ? (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                ) : node.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : node.status === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                )}
              </div>

              {/* Node Title */}
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {node.label}
              </h4>

              {/* Data Summary Subtext */}
              {node.dataSummary && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-white/5 text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  {node.dataSummary}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

NodeFlowGraph.displayName = 'NodeFlowGraph';
`
};
