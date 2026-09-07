"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Kanban,
  ListFilter,
  Plus,
  Flame,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function ProjectManagementPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [activeMobileCol, setActiveMobileCol] = useState("progress");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"Urgent" | "High" | "Medium">("High");

  const [issues, setIssues] = useState([
    { id: "ORB-101", title: "Migrate Postgres connections to PgBouncer connection pool", col: "progress", priority: "Urgent", pts: "5", user: "JD" },
    { id: "ORB-102", title: "Implement Web Crypto HMAC SHA-256 tokens", col: "review", priority: "High", pts: "3", user: "SK" },
    { id: "ORB-103", title: "Optimize CSS bundle tree-shaking with Tailwind v4", col: "done", priority: "Medium", pts: "2", user: "UR" },
    { id: "ORB-104", title: "Add multi-region edge failover circuit breaker", col: "backlog", priority: "High", pts: "8", user: "AL" },
    { id: "ORB-105", title: "Refactor global navigation sheet drawer for mobile", col: "done", priority: "Medium", pts: "3", user: "SK" },
  ]);

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newId = `ORB-${100 + issues.length + 1}`;
    setIssues((prev) => [
      { id: newId, title: newTitle.trim(), col: "backlog", priority: newPriority, pts: "3", user: "ME" },
      ...prev,
    ]);
    setNewTitle("");
    setIsCreateOpen(false);
  };

  const columns = [
    { id: "backlog", label: "Backlog", dotColor: "#94a3b8" },
    { id: "progress", label: "In Progress", dotColor: "#f59e0b" },
    { id: "review", label: "In Review", dotColor: "#8b5cf6" },
    { id: "done", label: "Done", dotColor: "#10b981" },
  ];

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "box"} className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-sm @sm:text-base tracking-tight"
              style={{ fontFamily: "var(--template-heading-font)" }}
            >
              {config.brandName || "Orbit Flow"}
            </span>

            {/* Sprint Velocity pill */}
            <div
              className="hidden @md:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                color: "var(--template-fg-muted)",
              }}
            >
              <span>Sprint 28</span>
              <span className="opacity-40">•</span>
              <span className="text-emerald-500 font-bold">38/48 pts (79%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            {/* View Switcher */}
            <div
              className="flex items-center p-1 rounded-lg border text-xs"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <button
                onClick={() => setViewMode("board")}
                className={`px-3 py-1.5 rounded font-medium transition-all ${
                  viewMode === "board" ? "shadow-sm font-semibold text-white" : "opacity-70 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: viewMode === "board" ? "var(--template-primary)" : "transparent",
                  color: viewMode === "board" ? "#ffffff" : "var(--template-fg)",
                  borderRadius: "calc(var(--template-radius) - 4px)",
                }}
              >
                Board
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded font-medium transition-all ${
                  viewMode === "list" ? "shadow-sm font-semibold text-white" : "opacity-70 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: viewMode === "list" ? "var(--template-primary)" : "transparent",
                  color: viewMode === "list" ? "#ffffff" : "var(--template-fg)",
                  borderRadius: "calc(var(--template-radius) - 4px)",
                }}
              >
                List
              </button>
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-xs @sm:text-sm font-semibold px-3.5 py-2 rounded-lg text-white shadow-sm transition-all hover:brightness-110 flex items-center gap-2 shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden @sm:inline">New Issue</span>
              <span className="@sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Kanban & Issue Content */}
      <main className="p-4 @sm:p-6 @lg:p-8 max-w-7xl mx-auto">
        {viewMode === "board" ? (
          <div>
            {/* Mobile Column Switcher (Visible on small containers < @md to prevent compressed vertical columns) */}
            <div className="@md:hidden flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
              {columns.map((col) => {
                const count = issues.filter((i) => i.col === col.id).length;
                const isSelected = activeMobileCol === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => setActiveMobileCol(col.id)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 shrink-0 transition-all ${
                      isSelected ? "shadow-sm font-semibold ring-1" : "opacity-70"
                    }`}
                    style={{
                      backgroundColor: isSelected ? "var(--template-surface-elevated)" : "var(--template-surface)",
                      borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                      color: "var(--template-fg)",
                      borderRadius: "var(--template-radius)",
                    }}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.dotColor }} />
                    <span>{col.label}</span>
                    <span className="text-xs opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Responsive Columns: 1-col on mobile, 2-col on tablet (@md:), 4-col on desktop (@xl:) */}
            <div className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-4 gap-4 @lg:gap-5">
              {columns.map((col) => {
                const colIssues = issues.filter((i) => i.col === col.id);
                const isHiddenOnMobile = activeMobileCol !== col.id;

                return (
                  <div
                    key={col.id}
                    className={`rounded-2xl border p-4 flex flex-col justify-between min-h-[440px] @sm:min-h-[500px] transition-all ${
                      isHiddenOnMobile ? "hidden @md:flex" : "flex"
                    }`}
                    style={{
                      backgroundColor: "var(--template-surface)",
                      borderColor: "var(--template-border)",
                      borderRadius: "var(--template-radius)",
                      boxShadow: "var(--template-card-shadow)",
                    }}
                  >
                    <div>
                      <div
                        className="flex items-center justify-between pb-3.5 mb-3.5 border-b text-xs @sm:text-sm font-mono"
                        style={{ borderColor: "var(--template-border)" }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.dotColor }} />
                          <span className="font-semibold" style={{ color: "var(--template-fg)" }}>
                            {col.label}
                          </span>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded border text-xs font-mono font-medium"
                          style={{
                            borderColor: "var(--template-border)",
                            color: "var(--template-fg-muted)",
                          }}
                        >
                          {colIssues.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {colIssues.map((issue) => (
                          <div
                            key={issue.id}
                            className="p-3.5 rounded-xl border text-xs @sm:text-sm shadow-sm transition-all cursor-pointer hover:border-zinc-400"
                            style={{
                              backgroundColor: "var(--template-surface-elevated)",
                              borderColor: "var(--template-border)",
                              borderRadius: "var(--template-radius)",
                              boxShadow: "var(--template-card-shadow)",
                            }}
                          >
                            <div className="flex items-center justify-between text-xs font-mono mb-2">
                              <span style={{ color: "var(--template-fg-muted)" }}>{issue.id}</span>
                              <span className="flex items-center gap-1 font-bold">
                                {issue.priority === "Urgent" && <Flame className="h-3.5 w-3.5 text-red-500" />}
                                <span style={{ color: issue.priority === "Urgent" ? "#ef4444" : "var(--template-fg-muted)" }}>
                                  {issue.priority}
                                </span>
                              </span>
                            </div>

                            <p
                              className="font-medium mb-3 leading-snug text-xs @sm:text-sm"
                              style={{ color: "var(--template-fg)" }}
                            >
                              {issue.title}
                            </p>

                            <div
                              className="flex items-center justify-between pt-2.5 border-t text-xs font-mono"
                              style={{
                                borderColor: "var(--template-border)",
                                color: "var(--template-fg-muted)",
                              }}
                            >
                              <span
                                className="px-2 py-0.5 rounded border text-xs"
                                style={{ borderColor: "var(--template-border)" }}
                              >
                                {issue.pts} pts
                              </span>
                              <div
                                className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs text-white"
                                style={{ backgroundColor: "var(--template-primary)" }}
                              >
                                {issue.user}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCreateOpen(true)}
                      className="w-full mt-4 h-10 rounded-xl border border-dashed text-xs @sm:text-sm opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 font-medium"
                      style={{
                        borderColor: "var(--template-border)",
                        color: "var(--template-fg)",
                        borderRadius: "var(--template-radius)",
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Issue</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div
            className="rounded-2xl border divide-y text-xs @sm:text-sm font-mono overflow-hidden"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
              boxShadow: "var(--template-card-shadow)",
            }}
          >
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 flex flex-col @sm:flex-row @sm:items-center justify-between gap-3 transition-colors"
                style={{ borderColor: "var(--template-border)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-20 opacity-60 shrink-0 font-medium">{issue.id}</span>
                  <span className="font-sans font-medium truncate" style={{ color: "var(--template-fg)" }}>
                    {issue.title}
                  </span>
                </div>

                <div className="flex items-center justify-between @sm:justify-end gap-3 pt-2 @sm:pt-0 shrink-0">
                  <span
                    className="px-2.5 py-1 rounded border capitalize text-xs"
                    style={{
                      borderColor: "var(--template-border)",
                      color: "var(--template-fg-muted)",
                    }}
                  >
                    {issue.col}
                  </span>
                  <span className="text-right opacity-80" style={{ color: "var(--template-fg)" }}>
                    {issue.pts} pts
                  </span>
                  <div
                    className="h-7 w-7 rounded-full text-white flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: "var(--template-primary)" }}
                  >
                    {issue.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Quick Issue Creator Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsCreateOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreateIssue}
              className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <h3 className="font-bold text-base" style={{ fontFamily: "var(--template-heading-font)" }}>
                  Create New Issue
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1 rounded hover:opacity-75 transition-opacity"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--template-fg-muted)" }}>
                  Issue Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement Webhook retry backoff"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent focus:outline-none"
                  style={{
                    borderColor: "var(--template-border)",
                    color: "var(--template-fg)",
                    borderRadius: "var(--template-radius)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--template-fg-muted)" }}>
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(["Urgent", "High", "Medium"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-2 rounded-lg border font-medium transition-all ${
                        newPriority === p ? "shadow-sm font-semibold" : "opacity-70"
                      }`}
                      style={{
                        backgroundColor: newPriority === p ? "var(--template-primary)" : "transparent",
                        borderColor: newPriority === p ? "var(--template-primary)" : "var(--template-border)",
                        color: newPriority === p ? "#ffffff" : "var(--template-fg)",
                        borderRadius: "var(--template-radius)",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs @sm:text-sm font-medium hover:opacity-80"
                  style={{ borderColor: "var(--template-border)", color: "var(--template-fg)", borderRadius: "var(--template-radius)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs @sm:text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
                  style={{ backgroundColor: "var(--template-primary)", borderRadius: "var(--template-radius)" }}
                >
                  Create Issue
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
