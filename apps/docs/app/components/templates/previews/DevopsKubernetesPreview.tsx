"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Cpu,
  Database,
  Activity,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Search,
  Filter,
  Play,
  Pause,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  HardDrive,
  X,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function DevopsKubernetesPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [selectedCluster, setSelectedCluster] = useState("prod-eu-central-1");
  const [podFilter, setPodFilter] = useState<"all" | "running" | "crashloop" | "pending">("all");
  const [searchPod, setSearchPod] = useState("");
  const [canaryWeight, setCanaryWeight] = useState(15); // 15% canary, 85% stable
  const [selectedNode, setSelectedNode] = useState<number | null>(0);
  const [isLogsPaused, setIsLogsPaused] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployToast, setDeployToast] = useState<string | null>(null);

  const nodes = [
    { id: 0, name: "node-c5.4xlarge-01", region: "eu-central-1a", cpu: "68%", ram: "74%", pods: 42, status: "Ready", role: "Worker" },
    { id: 1, name: "node-c5.4xlarge-02", region: "eu-central-1b", cpu: "82%", ram: "88%", pods: 46, status: "Ready", role: "Worker" },
    { id: 2, name: "node-g4dn.2xlarge-03", region: "eu-central-1a", cpu: "45%", ram: "52%", pods: 18, status: "Ready", role: "GPU Tensor" },
    { id: 3, name: "node-m5.2xlarge-04", region: "eu-central-1c", cpu: "91%", ram: "94%", pods: 38, status: "Pressure", role: "Memory High" },
  ];

  const pods = [
    { name: "auth-gateway-7b89f6-2dla", namespace: "ingress", status: "Running", restarts: 0, age: "14d", cpu: "140m", mem: "312Mi" },
    { name: "payment-worker-64cb89-x99k", namespace: "finance", status: "Running", restarts: 0, age: "4d", cpu: "420m", mem: "840Mi" },
    { name: "vector-indexer-59fa12-z7lp", namespace: "ai-mesh", status: "CrashLoopBackOff", restarts: 14, age: "12m", cpu: "880m", mem: "1.8Gi" },
    { name: "telemetry-collector-41da-k2pp", namespace: "monitoring", status: "Running", restarts: 1, age: "28d", cpu: "95m", mem: "180Mi" },
    { name: "redis-cache-shard-02", namespace: "cache", status: "Pending", restarts: 0, age: "2m", cpu: "0m", mem: "0Mi" },
    { name: "billing-cron-job-28491-pl9s", namespace: "finance", status: "Running", restarts: 0, age: "1h", cpu: "210m", mem: "410Mi" },
  ];

  const logLines = [
    { time: "14:28:40.102", level: "INFO", src: "auth-gateway", msg: "TLS 1.3 handshake negotiated with 194.26.29.11" },
    { time: "14:28:41.220", level: "INFO", src: "payment-worker", msg: "Batch settled: 420 ledger entries dispatched in 18ms" },
    { time: "14:28:42.508", level: "WARN", src: "node-m5-04", msg: "Kubelet memory eviction threshold warning (free < 6%)" },
    { time: "14:28:43.910", level: "ERROR", src: "vector-indexer", msg: "OOMKilled: container exceeded memory limit 2048MiB" },
    { time: "14:28:44.305", level: "INFO", src: "kube-scheduler", msg: "Pod redis-cache-shard-02 placed on node-c5.4xlarge-01" },
  ];

  const filteredPods = pods.filter((p) => {
    const matchFilter =
      podFilter === "all" ||
      (podFilter === "running" && p.status === "Running") ||
      (podFilter === "crashloop" && p.status === "CrashLoopBackOff") ||
      (podFilter === "pending" && p.status === "Pending");
    const matchSearch = p.name.toLowerCase().includes(searchPod.toLowerCase()) || p.namespace.toLowerCase().includes(searchPod.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleDeploySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeployModalOpen(false);
    setDeployToast("Manifest deployed! Rolling update initiated across 3 replicas.");
    setTimeout(() => setDeployToast(null), 4000);
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans text-left"
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
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "server"} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "KubeOrbit Cloud"}
                </span>
                <span className="hidden @sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  k8s v1.31.1
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">Kubernetes Multi-Cluster Orchestration & SRE Fleet</p>
            </div>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="hidden @sm:block px-3 py-1.5 rounded-xl border text-xs font-mono outline-none font-medium"
              style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
            >
              <option value="prod-eu-central-1">prod-eu-central-1 (Frankfurt)</option>
              <option value="prod-us-east-1">prod-us-east-1 (N. Virginia)</option>
              <option value="staging-ap-east-1">staging-ap-east-1 (Tokyo)</option>
            </select>

            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Deploy Workload</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {deployToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "var(--template-border)",
              color: "var(--template-fg)",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{deployToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @lg:py-8 space-y-6">
        {/* Top 4 Cluster Health KPI Cards */}
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">CPU Capacity Saturation</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">68.4%</span>
              <span className="text-xs opacity-60">128 / 192 Cores</span>
            </div>
            <p className="text-[11px] opacity-65">Healthy headroom across 32 active worker nodes.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[68%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Cluster RAM Allocation</span>
              <Database className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">82.1%</span>
              <span className="text-xs text-amber-500 font-medium">Warning &gt; 80%</span>
            </div>
            <p className="text-[11px] opacity-65">394 GiB of 480 GiB committed by pod requests.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[82%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Pod Lifecycle Status</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-emerald-500">242</span>
              <span className="text-xs opacity-60">/ 248 Healthy</span>
            </div>
            <p className="text-[11px] opacity-65">1 CrashLoopBackOff • 5 Pending scheduling.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[97%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Ingress Mesh Bandwidth</span>
              <Server className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">4.82</span>
              <span className="text-xs opacity-60">Gbps</span>
            </div>
            <p className="text-[11px] opacity-65">Zero packet drop • Envoy P99 latency 1.4ms.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full w-[54%]" />
            </div>
          </div>
        </div>

        {/* Section 1: Multi-Region Kubernetes Node Cluster Grid */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold tracking-tight">Active Node Fleet & Pressure Telemetry</h2>
              <p className="text-xs opacity-65">Click a node to inspect system metrics and simulate cordon/drain actions</p>
            </div>
            <span className="text-xs font-mono opacity-70">Region: Frankfurt AZ-1a/b/c</span>
          </div>

          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
            {nodes.map((n) => {
              const isSelected = selectedNode === n.id;
              const hasPressure = n.status === "Pressure";
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-indigo-500/40"
                  }`}
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono truncate max-w-[150px]">{n.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        hasPressure
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      }`}
                    >
                      {n.status}
                    </span>
                  </div>

                  <div className="text-[11px] opacity-60 mb-3">{n.role} • {n.region}</div>

                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="opacity-70">CPU: {n.cpu}</span>
                        <span className="opacity-70">RAM: {n.ram}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-indigo-500" style={{ width: n.cpu }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="opacity-60">{n.pods} Running Pods</span>
                      <span className="text-indigo-400 font-semibold text-[10px]">Inspect &rarr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2 & 3: Pod Health Matrix & Canary Deployment */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Pod Health Matrix Table */}
          <div
            className="@lg:col-span-2 p-6 rounded-2xl border"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold tracking-tight">Pod Workload Inventory</h3>
                <p className="text-xs opacity-65">Real-time status across all namespaces</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border text-xs" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)", borderColor: "var(--template-border)" }}>
                <button
                  onClick={() => setPodFilter("all")}
                  className={`px-2.5 py-1 rounded-lg ${podFilter === "all" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}`}
                >
                  All (6)
                </button>
                <button
                  onClick={() => setPodFilter("running")}
                  className={`px-2.5 py-1 rounded-lg ${podFilter === "running" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}`}
                >
                  Running
                </button>
                <button
                  onClick={() => setPodFilter("crashloop")}
                  className={`px-2.5 py-1 rounded-lg ${podFilter === "crashloop" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}`}
                >
                  OOM/Crash
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 opacity-50" />
              <input
                type="text"
                placeholder="Search pod name or namespace..."
                value={searchPod}
                onChange={(e) => setSearchPod(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none font-mono"
                style={{ backgroundColor: "var(--template-bg)", borderColor: "var(--template-border)" }}
              />
            </div>

            {/* Pod Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b opacity-60 text-[11px]" style={{ borderColor: "var(--template-border)" }}>
                    <th className="pb-2">Pod Identifier</th>
                    <th className="pb-2">Namespace</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">CPU</th>
                    <th className="pb-2">Memory</th>
                    <th className="pb-2">Restarts</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono" style={{ borderColor: "var(--template-border)" }}>
                  {filteredPods.map((p, idx) => (
                    <tr key={idx} className="hover:bg-zinc-500/5 transition-colors">
                      <td className="py-2.5 font-bold truncate max-w-[180px]">{p.name}</td>
                      <td className="py-2.5 opacity-70">{p.namespace}</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === "Running"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : p.status === "CrashLoopBackOff"
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 opacity-70">{p.cpu}</td>
                      <td className="py-2.5 opacity-70">{p.mem}</td>
                      <td className="py-2.5 opacity-70">{p.restarts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Canary Deployment & Ingress Splitter */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Canary Ingress Split</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Istio Route
                </span>
              </div>

              <div className="p-4 rounded-xl border text-center mb-6" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-3xl font-extrabold font-mono tracking-tight text-indigo-500">
                  {canaryWeight}% <span className="text-sm font-normal opacity-70">Canary v2.5.0</span>
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Stable v2.4.0 receiving {100 - canaryWeight}% of live ingress traffic
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-mono opacity-70">
                  <span>0% (Drain Canary)</span>
                  <span>100% (Promote)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={canaryWeight}
                  onChange={(e) => setCanaryWeight(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: "var(--template-border)" }}>
                  <span className="opacity-70">Stable Error Rate</span>
                  <span className="font-mono text-emerald-500 font-bold">0.012% P99</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: "var(--template-border)" }}>
                  <span className="opacity-70">Canary Error Rate</span>
                  <span className="font-mono text-emerald-500 font-bold">0.018% P99</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCanaryWeight(100);
                setDeployToast("Canary promoted to 100% stable production traffic!");
                setTimeout(() => setDeployToast(null), 3500);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white mt-4 shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              Promote Canary to 100%
            </button>
          </div>
        </div>

        {/* Section 4: Live Streaming Pod Logs Viewer */}
        <div
          className="p-6 rounded-2xl border font-mono"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold font-sans">Live Pod Stream: all-namespaces stdout</h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setIsLogsPaused(!isLogsPaused)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border hover:opacity-100 opacity-75 transition-opacity"
                style={{ borderColor: "var(--template-border)" }}
              >
                {isLogsPaused ? <Play className="w-3 h-3 text-emerald-500" /> : <Pause className="w-3 h-3 text-amber-500" />}
                <span>{isLogsPaused ? "Resume" : "Pause Stream"}</span>
              </button>
            </div>
          </div>

          <div
            className="p-4 rounded-xl border text-xs space-y-1.5 overflow-x-auto max-h-52 overflow-y-auto"
            style={{
              backgroundColor: isDark ? "#090a0f" : "#f8fafc",
              borderColor: "var(--template-border)",
            }}
          >
            {logLines.map((l, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="opacity-40 shrink-0 text-[10px]">{l.time}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                    l.level === "INFO"
                      ? "text-cyan-400 bg-cyan-400/10"
                      : l.level === "WARN"
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-rose-400 bg-rose-400/10"
                  }`}
                >
                  {l.level}
                </span>
                <span className="opacity-60 text-indigo-400 shrink-0">[{l.src}]</span>
                <span className="opacity-85">{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Deploy Workload Modal */}
      <AnimatePresence>
        {isDeployModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "var(--template-bg)",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Deploy Container Workload</h3>
              </div>

              <form onSubmit={handleDeploySubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block font-semibold mb-1 opacity-80 font-sans">OCI Image URI</label>
                  <input
                    type="text"
                    defaultValue="ghcr.io/nexore/vector-mesh:v2.5.1"
                    className="w-full p-2.5 rounded-xl border outline-none font-mono"
                    style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 font-sans">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Target Namespace</label>
                    <select
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                    >
                      <option value="ingress">ingress</option>
                      <option value="ai-mesh">ai-mesh</option>
                      <option value="finance">finance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Replicas</label>
                    <input
                      type="number"
                      defaultValue="3"
                      min="1"
                      max="16"
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80 font-sans">CPU Limit</label>
                    <input
                      type="text"
                      defaultValue="1000m"
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80 font-sans">Memory Limit</label>
                    <input
                      type="text"
                      defaultValue="2048Mi"
                      className="w-full p-2.5 rounded-xl border outline-none"
                      style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 font-sans"
                  style={{ backgroundColor: "var(--template-primary)" }}
                >
                  Apply Manifest to Cluster
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
