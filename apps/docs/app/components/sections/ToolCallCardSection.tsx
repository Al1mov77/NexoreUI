"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { PropsTable } from "../PropsTable";
import { ToolCallCard, Badge, Button } from "nexoreui";
import {
  Globe,
  Database,
  Terminal,
  FileCode,
  Sparkles,
  Bot,
  Layers,
} from "lucide-react";

const toolCallCardPropsData = [
  {
    name: "toolName",
    type: "string",
    defaultValue: "—",
    description: "Name of the tool or function invoked by the AI agent (e.g. 'read_file', 'query_db').",
    required: true,
  },
  {
    name: "status",
    type: '"pending" | "running" | "success" | "error"',
    defaultValue: '"running"',
    description: "Execution state with live orbital animations and status badge transitions.",
    required: false,
  },
  {
    name: "variant",
    type: '"default" | "neon" | "glow" | "cyberpunk"',
    defaultValue: '"default"',
    description: "Visual aesthetic preset matching NexoreUI indicator themes.",
    required: false,
  },
  {
    name: "args",
    type: "Record<string, any> | string",
    defaultValue: "undefined",
    description: "Key-value object or raw string arguments passed to the tool function.",
    required: false,
  },
  {
    name: "result",
    type: "Record<string, any> | string | ReactNode",
    defaultValue: "undefined",
    description: "Execution payload or response returned by the tool execution.",
    required: false,
  },
  {
    name: "duration",
    type: "string | number",
    defaultValue: "undefined",
    description: "Execution duration label (e.g. '340ms', '1.2s') or milliseconds number.",
    required: false,
  },
  {
    name: "isCollapsedByDefault",
    type: "boolean",
    defaultValue: "false",
    description: "Whether the arguments and result drawer start in a collapsed state.",
    required: false,
  },
  {
    name: "onToggle",
    type: "(isOpen: boolean) => void",
    defaultValue: "undefined",
    description: "Callback invoked when the card drawer is toggled open or closed.",
    required: false,
  },
  {
    name: "icon",
    type: "React.ComponentType<{ className?: string }>",
    defaultValue: "Wrench",
    description: "Custom icon rendered on the left badge of the card header.",
    required: false,
  },
  {
    name: "className",
    type: "string",
    defaultValue: "—",
    description: "Additional CSS classes applied to the root card container.",
    required: false,
  },
];

const examples = [
  {
    name: "Running Web Search Tool (Default Variant)",
    component: (
      <div className="w-full max-w-xl">
        <ToolCallCard
          variant="default"
          status="running"
          toolName="search_web"
          icon={Globe}
          args={{
            query: "React 19 Server Actions best practices 2026",
            max_results: 5,
            search_depth: "advanced",
          }}
          duration="fetching..."
        />
      </div>
    ),
    code: `import { ToolCallCard } from "nexoreui"\nimport { Globe } from "lucide-react"\n\n<ToolCallCard\n  variant="default"\n  status="running"\n  toolName="search_web"\n  icon={Globe}\n  args={{\n    query: "React 19 Server Actions best practices 2026",\n    max_results: 5,\n    search_depth: "advanced",\n  }}\n  duration="fetching..."\n/>`,
  },
  {
    name: "Completed Database Query (Neon Electric Theme)",
    component: (
      <div className="w-full max-w-xl">
        <ToolCallCard
          variant="neon"
          status="success"
          toolName="execute_sql"
          icon={Database}
          args={{
            table: "analytics_events",
            filters: { environment: "production", latency_ms: { $gt: 200 } },
            limit: 3,
          }}
          result={{
            status: 200,
            rows_returned: 3,
            scanned_partitions: 14,
            execution_engine: "vector-accelerated",
          }}
          duration="142ms"
        />
      </div>
    ),
    code: `import { ToolCallCard } from "nexoreui"\nimport { Database } from "lucide-react"\n\n<ToolCallCard\n  variant="neon"\n  status="success"\n  toolName="execute_sql"\n  icon={Database}\n  args={{\n    table: "analytics_events",\n    filters: { environment: "production", latency_ms: { $gt: 200 } },\n    limit: 3,\n  }}\n  result={{\n    status: 200,\n    rows_returned: 3,\n    scanned_partitions: 14,\n  }}\n  duration="142ms"\n/>`,
  },
  {
    name: "Semantic Vector Search (Warm Glow Theme)",
    component: (
      <div className="w-full max-w-xl">
        <ToolCallCard
          variant="glow"
          status="success"
          toolName="query_knowledge_graph"
          icon={Sparkles}
          args={{
            similarity_threshold: 0.88,
            embedding_model: "text-embedding-3-large",
            nodes: ["Authentication", "SessionTokens", "OAuth2"],
          }}
          result={{
            matched_nodes: 7,
            top_relevance_score: 0.964,
            cached: true,
          }}
          duration="38ms"
        />
      </div>
    ),
    code: `import { ToolCallCard } from "nexoreui"\nimport { Sparkles } from "lucide-react"\n\n<ToolCallCard\n  variant="glow"\n  status="success"\n  toolName="query_knowledge_graph"\n  icon={Sparkles}\n  args={{\n    similarity_threshold: 0.88,\n    nodes: ["Authentication", "SessionTokens", "OAuth2"],\n  }}\n  result={{\n    matched_nodes: 7,\n    top_relevance_score: 0.964,\n  }}\n  duration="38ms"\n/>`,
  },
  {
    name: "Cyberpunk Terminal Execution with Error Trace",
    component: (
      <div className="w-full max-w-xl">
        <ToolCallCard
          variant="cyberpunk"
          status="error"
          toolName="bash_sandbox_exec"
          icon={Terminal}
          args={{
            command: "pnpm run deploy --target=edge-cluster-eu",
            timeout_ms: 10000,
          }}
          result={{
            error: "CONNECTION_RESET_BY_PEER",
            code: "ERR_SOCKET_TIMEOUT",
            details: "Upstream cluster gateway unreachable on port 8443",
          }}
          duration="10002ms"
        />
      </div>
    ),
    code: `import { ToolCallCard } from "nexoreui"\nimport { Terminal } from "lucide-react"\n\n<ToolCallCard\n  variant="cyberpunk"\n  status="error"\n  toolName="bash_sandbox_exec"\n  icon={Terminal}\n  args={{\n    command: "pnpm run deploy --target=edge-cluster-eu",\n    timeout_ms: 10000,\n  }}\n  result={{\n    error: "CONNECTION_RESET_BY_PEER",\n    code: "ERR_SOCKET_TIMEOUT",\n  }}\n  duration="10002ms"\n/>`,
  },
  {
    name: "Multi-Step Agentic Chain in AI Assistant Chat",
    component: (
      <div className="w-full max-w-xl p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-zinc-300">Antigravity Agent Pipeline</span>
          </div>
          <Badge variant="outline" size="sm" className="text-[10px]">
            Execution Chain (3 Steps)
          </Badge>
        </div>

        <div className="space-y-2.5">
          <ToolCallCard
            variant="default"
            status="success"
            toolName="git_diff_check"
            icon={FileCode}
            args={{ path: "packages/ui/src/components" }}
            result={{ modified_files: 2, insertions: 140, deletions: 12 }}
            duration="84ms"
            isCollapsedByDefault
          />
          <ToolCallCard
            variant="default"
            status="running"
            toolName="run_test_suite"
            icon={Terminal}
            args={{ test_filter: "thinking-indicator.test.tsx" }}
            duration="running..."
          />
          <ToolCallCard
            variant="default"
            status="pending"
            toolName="publish_turborepo_package"
            icon={Layers}
            args={{ bump: "patch" }}
          />
        </div>
      </div>
    ),
    code: `import { ToolCallCard, Badge } from "nexoreui"\nimport { Bot, FileCode, Terminal, Layers } from "lucide-react"\n\n<div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">\n  <div className="flex items-center justify-between">\n    <span className="text-xs font-semibold">Agent Pipeline</span>\n    <Badge variant="outline" size="sm">3 Steps</Badge>\n  </div>\n\n  <div className="space-y-2.5">\n    <ToolCallCard status="success" toolName="git_diff_check" icon={FileCode} duration="84ms" isCollapsedByDefault />\n    <ToolCallCard status="running" toolName="run_test_suite" icon={Terminal} duration="running..." />\n    <ToolCallCard status="pending" toolName="publish_package" icon={Layers} />\n  </div>\n</div>`,
  },
];

export function ToolCallCardSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(examples.length / itemsPerPage);
  const visibleItems = examples.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-12">
      {/* Interactive Playground */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Interactive Playground</h3>
        <PropsEditor
          component={(props: any) => (
            <div className="w-full max-w-xl p-4 flex items-center justify-center">
              <ToolCallCard
                {...props}
                args={{
                  query: "Neural architecture search algorithms",
                  top_k: 5,
                  filters: { domain: "ai-reasoning", verified_only: true },
                }}
                result={
                  props.status === "success"
                    ? { matches: 5, confidence_score: 0.982, latency_ms: 320 }
                    : props.status === "error"
                    ? { error: "TIMEOUT_EXCEEDED", message: "Upstream cluster did not respond" }
                    : undefined
                }
              />
            </div>
          )}
          componentName="ToolCallCard"
          importFrom="nexoreui"
          controls={[
            {
              name: "variant",
              type: "select",
              options: ["default", "neon", "glow", "cyberpunk"],
              defaultValue: "default",
              description: "Visual aesthetic preset matching NexoreUI indicator themes.",
            },
            {
              name: "status",
              type: "select",
              options: ["running", "success", "error", "pending"],
              defaultValue: "running",
              description: "Live execution status with animated indicators.",
            },
            {
              name: "toolName",
              type: "text",
              defaultValue: "search_knowledge_base",
              description: "Name of the tool or function invoked.",
            },
            {
              name: "duration",
              type: "text",
              defaultValue: "320ms",
              description: "Execution time label.",
            },
            {
              name: "isCollapsedByDefault",
              type: "boolean",
              defaultValue: false,
              description: "Whether the drawer starts collapsed.",
            },
          ]}
        />
      </div>

      {/* Props Reference Table */}
      <div className="space-y-4">
        <PropsTable propsData={toolCallCardPropsData} />
      </div>

      {/* Examples Showcase */}
      <div className="space-y-8">
        <h3 className="text-lg font-semibold tracking-tight">Usage Examples</h3>
        <div className="space-y-8">
          {visibleItems.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">{item.name}</h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-background p-6">
                  {item.component}
                </div>
                <ComponentSource sourceCode={item.code} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground mx-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToolCallCardSection;
