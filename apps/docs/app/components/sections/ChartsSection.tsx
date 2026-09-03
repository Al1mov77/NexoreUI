"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { Button } from "nexoreui";
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  PieChart,
  LineChart,
  Terminal,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  Activity
} from "lucide-react";
import { cn } from "nexoreui";

// Color palette mapping
const chartColorMap: Record<string, { stroke: string; fill: string; glow: string; text: string }> = {
  violet: { stroke: "#8b5cf6", fill: "rgba(139, 92, 246, 0.2)", glow: "rgba(139, 92, 246, 0.4)", text: "text-violet-400" },
  cyan: { stroke: "#06b6d4", fill: "rgba(6, 182, 212, 0.2)", glow: "rgba(6, 182, 212, 0.4)", text: "text-cyan-400" },
  emerald: { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.2)", glow: "rgba(16, 185, 129, 0.4)", text: "text-emerald-400" },
  rose: { stroke: "#f43f5e", fill: "rgba(244, 63, 94, 0.2)", glow: "rgba(244, 63, 94, 0.4)", text: "text-rose-400" },
  amber: { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)", glow: "rgba(245, 158, 11, 0.4)", text: "text-amber-400" },
};

// 1. High-Performance SVG Area Spline Chart
interface AreaChartProps {
  data?: { label: string; value: number }[];
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  currency?: string;
  className?: string;
}

export function ModernAreaChart({
  data = [
    { label: "Mon", value: 3400 },
    { label: "Tue", value: 4200 },
    { label: "Wed", value: 3900 },
    { label: "Thu", value: 5800 },
    { label: "Fri", value: 6400 },
    { label: "Sat", value: 5900 },
    { label: "Sun", value: 7800 },
  ],
  color = "violet",
  height = 240,
  showGrid = true,
  showTooltip = true,
  currency = "$",
  className,
}: AreaChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const colorTheme = chartColorMap[color] || chartColorMap.violet;

  const padding = { top: 20, right: 20, bottom: 35, left: 45 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values) * 0.85;
  const maxVal = Math.max(...values) * 1.1;

  // Calculate points
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, ...d };
  });

  // Generate smooth cubic bezier SVG curve
  const pathD = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = a[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className={cn("relative w-full select-none", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={`area-grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorTheme.stroke} stopOpacity="0.4" />
            <stop offset="85%" stopColor={colorTheme.stroke} stopOpacity="0.02" />
            <stop offset="100%" stopColor={colorTheme.stroke} stopOpacity="0" />
          </linearGradient>
          <filter id={`glow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g className="stroke-border/40" strokeDasharray="3 3">
            {[0, 0.33, 0.66, 1].map((ratio, i) => {
              const y = padding.top + chartHeight * ratio;
              return <line key={i} x1={padding.left} y1={y} x2={width - padding.right} y2={y} />;
            })}
          </g>
        )}

        {/* Gradient fill area */}
        <motion.path
          d={areaD}
          fill={`url(#area-grad-${color})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Spline line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={colorTheme.stroke}
          strokeWidth="2.5"
          filter={`url(#glow-${color})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Data points & hover triggers */}
        {points.map((p, i) => (
          <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIndex(i)}>
            {/* Invisible wide hit area */}
            <circle cx={p.x} cy={p.y} r="16" fill="transparent" />

            {/* Visible circle */}
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIndex === i ? 5.5 : 3.5}
              fill="#09090b"
              stroke={colorTheme.stroke}
              strokeWidth={hoverIndex === i ? 3 : 2}
              className="transition-all duration-150"
            />

            {/* X-axis labels */}
            <text
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className={cn(
                "text-[11px] font-mono fill-muted-foreground transition-colors",
                hoverIndex === i && "fill-foreground font-bold"
              )}
            >
              {p.label}
            </text>
          </g>
        ))}

        {/* Active tracking vertical line */}
        {hoverIndex !== null && (
          <line
            x1={activePoint.x}
            y1={padding.top}
            x2={activePoint.x}
            y2={padding.top + chartHeight}
            stroke={colorTheme.stroke}
            strokeWidth="1.5"
            strokeDasharray="2 2"
            opacity="0.6"
          />
        )}
      </svg>

      {/* Floating Tooltip */}
      {showTooltip && (
        <div className="absolute top-2 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-card/90 backdrop-blur-md shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorTheme.stroke }} />
          <span className="text-xs font-mono text-muted-foreground">{activePoint.label}:</span>
          <span className="text-xs font-mono font-bold text-foreground">
            {currency}
            {activePoint.value.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

// 2. Modern Column Bar Chart
interface BarChartProps {
  data?: { label: string; value: number }[];
  color?: string;
  height?: number;
  className?: string;
}

export function ModernBarChart({
  data = [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 68 },
    { label: "Mar", value: 85 },
    { label: "Apr", value: 52 },
    { label: "May", value: 94 },
    { label: "Jun", value: 76 },
    { label: "Jul", value: 110 },
  ],
  color = "cyan",
  height = 220,
  className,
}: BarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const colorTheme = chartColorMap[color] || chartColorMap.cyan;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15;

  return (
    <div className={cn("w-full select-none space-y-2", className)}>
      <div className="flex items-end gap-3 justify-between w-full px-2" style={{ height }}>
        {data.map((item, idx) => {
          const heightPct = (item.value / maxVal) * 100;
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full gap-2 cursor-pointer group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span
                className={cn(
                  "text-[10px] font-mono text-muted-foreground transition-all duration-150",
                  isHovered && "text-foreground font-bold scale-110"
                )}
              >
                {item.value}
              </span>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={cn(
                  "w-full rounded-t-lg transition-all duration-200 relative overflow-hidden",
                  isHovered ? "opacity-100 shadow-lg" : "opacity-80 hover:opacity-100"
                )}
                style={{
                  backgroundColor: colorTheme.stroke,
                  boxShadow: isHovered ? `0 0 20px ${colorTheme.glow}` : "none",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/20" />
              </motion.div>

              <span
                className={cn(
                  "text-[11px] font-mono text-muted-foreground",
                  isHovered && "text-foreground font-bold"
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. Modern Donut Ring Chart
interface DonutChartProps {
  percentage?: number;
  title?: string;
  subtitle?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ModernDonutChart({
  percentage = 78,
  title = "78%",
  subtitle = "Conversion Rate",
  color = "emerald",
  size = 180,
  strokeWidth = 14,
  className,
}: DonutChartProps) {
  const colorTheme = chartColorMap[color] || chartColorMap.emerald;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center select-none", className)}>
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />

        {/* Glow & active path */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorTheme.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${colorTheme.glow})`,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <span className="text-3xl font-extrabold text-foreground tracking-tight">{title}</span>
        {subtitle && (
          <span className="text-[11px] font-mono text-muted-foreground mt-0.5">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

export function ChartsSection() {
  const [activeTab, setActiveTab] = useState<"area" | "bar" | "donut">("area");
  const [chartColor, setChartColor] = useState<string>("violet");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [donutPercent, setDonutPercent] = useState<number>(84);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const generateLiveCode = () => {
    if (activeTab === "area") {
      return `import { ModernAreaChart } from "nexoreui";

export default function AreaChartDemo() {
  const data = [
    { label: "Mon", value: 3400 },
    { label: "Tue", value: 4200 },
    { label: "Wed", value: 3900 },
    { label: "Thu", value: 5800 },
    { label: "Fri", value: 6400 },
    { label: "Sat", value: 5900 },
    { label: "Sun", value: 7800 },
  ];

  return (
    <ModernAreaChart
      data={data}
      color="${chartColor}"
      showGrid={${showGrid}}
      showTooltip={${showTooltip}}
    />
  );
}`;
    }

    if (activeTab === "bar") {
      return `import { ModernBarChart } from "nexoreui";

export default function BarChartDemo() {
  const data = [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 68 },
    { label: "Mar", value: 85 },
    { label: "Apr", value: 52 },
    { label: "May", value: 94 },
    { label: "Jun", value: 76 },
  ];

  return (
    <ModernBarChart
      data={data}
      color="${chartColor}"
    />
  );
}`;
    }

    return `import { ModernDonutChart } from "nexoreui";

export default function DonutChartDemo() {
  return (
    <ModernDonutChart
      percentage={${donutPercent}}
      title="${donutPercent}%"
      subtitle="Efficiency Target"
      color="${chartColor}"
    />
  );
}`;
  };

  const propsData = [
    {
      name: "data",
      type: "{ label: string; value: number }[]",
      defaultValue: "[...]",
      description: "Array of numerical data points and corresponding axis labels.",
      required: true,
    },
    {
      name: "color",
      type: '"violet" | "cyan" | "emerald" | "rose" | "amber"',
      defaultValue: '"violet"',
      description: "Curated gradient and glow theme for SVG lines and bars.",
      required: false,
    },
    {
      name: "height",
      type: "number",
      defaultValue: "240",
      description: "Pixel height profile of the chart container.",
      required: false,
    },
    {
      name: "showGrid",
      type: "boolean",
      defaultValue: "true",
      description: "Renders dashed background horizontal grid alignment lines.",
      required: false,
    },
    {
      name: "showTooltip",
      type: "boolean",
      defaultValue: "true",
      description: "Enables floating glassmorphic tooltip with hover cursor tracking.",
      required: false,
    },
  ];

  const examples = [
    {
      name: "1. Revenue Performance Spline Chart",
      component: (
        <div className="w-full p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground">Total Revenue</p>
              <h4 className="text-xl font-bold text-foreground">$48,290</h4>
            </div>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              +24.5%
            </span>
          </div>
          <ModernAreaChart color="emerald" height={200} />
        </div>
      ),
      code: `<ModernAreaChart color="emerald" height={200} />`,
    },
    {
      name: "2. Monthly Growth Column Chart",
      component: (
        <div className="w-full p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-foreground">Monthly Active Accounts</h4>
            <span className="text-xs font-mono text-cyan-400">Q1-Q2 2026</span>
          </div>
          <ModernBarChart color="cyan" height={190} />
        </div>
      ),
      code: `<ModernBarChart color="cyan" height={190} />`,
    },
    {
      name: "3. KPI Donut Ring Dashboard Widget",
      component: (
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border bg-card/60 w-full max-w-xs">
          <ModernDonutChart percentage={88} color="rose" title="88%" subtitle="Goal Achieved" size={160} />
        </div>
      ),
      code: `<ModernDonutChart percentage={88} color="rose" size={160} />`,
    },
    {
      name: "4. Executive Stat Metric with Sparkline",
      component: (
        <div className="p-5 rounded-2xl border border-border bg-card/60 w-full max-w-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">NEW USERS</span>
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <h4 className="text-2xl font-bold text-foreground">12,450</h4>
            <span className="text-xs font-semibold text-emerald-400">+18.2%</span>
          </div>
          <ModernAreaChart
            color="violet"
            height={90}
            showGrid={false}
            showTooltip={false}
            data={[
              { label: "1", value: 20 },
              { label: "2", value: 35 },
              { label: "3", value: 25 },
              { label: "4", value: 60 },
              { label: "5", value: 45 },
              { label: "6", value: 80 },
            ]}
          />
        </div>
      ),
      code: `<div className="p-5 rounded-2xl border border-border bg-card">
  <h4>12,450</h4>
  <ModernAreaChart color="violet" height={90} showGrid={false} />
</div>`,
    },
  ];

  const itemsPerPage = 2;
  const totalPages = Math.ceil(examples.length / itemsPerPage);
  const visibleItems = examples.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="charts" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pro Suites — Data Visualization</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Modern Charts & Analytics
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          State-of-the-art dark-mode optimized SVG charts. Featuring smooth cubic spline curves,
          luminous gradient halos, interactive cursor tooltips, and zero heavy D3/Canvas overhead.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border text-xs font-mono w-fit mt-3">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">npx nexoreui-cli add charts</span>
        </div>
      </div>

      {/* Interactive Live Playground */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Interactive Live Playground
            </h2>
            <p className="text-xs text-muted-foreground">
              Test dynamic color themes, chart styles, and layout properties.
            </p>
          </div>

          {/* Chart Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("area")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "area" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Area Spline
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bar")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "bar" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Column Bar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("donut")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "donut" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Donut Ring
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Live Preview Box */}
          <div className="xl:col-span-2 min-h-[320px] flex items-center justify-center p-6 sm:p-10 rounded-2xl border border-border bg-card/40 backdrop-blur-md relative overflow-hidden">
            {activeTab === "area" && (
              <ModernAreaChart
                color={chartColor}
                showGrid={showGrid}
                showTooltip={showTooltip}
                height={260}
              />
            )}

            {activeTab === "bar" && <ModernBarChart color={chartColor} height={240} />}

            {activeTab === "donut" && (
              <ModernDonutChart
                percentage={donutPercent}
                title={`${donutPercent}%`}
                subtitle="Performance Score"
                color={chartColor}
                size={200}
              />
            )}
          </div>

          {/* Controls Panel */}
          <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Configure Props
            </h3>

            {/* Color palette */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Color Theme</label>
              <div className="grid grid-cols-5 gap-1.5">
                {(["violet", "cyan", "emerald", "rose", "amber"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChartColor(c)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                      chartColor === c
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "area" && (
              <>
                <div className="flex items-center justify-between pt-1">
                  <label className="text-xs font-medium text-foreground">Grid Lines</label>
                  <button
                    type="button"
                    onClick={() => setShowGrid(!showGrid)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      showGrid ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.75 ${
                        showGrid ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="text-xs font-medium text-foreground">Hover Tooltip</label>
                  <button
                    type="button"
                    onClick={() => setShowTooltip(!showTooltip)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      showTooltip ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.75 ${
                        showTooltip ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </>
            )}

            {activeTab === "donut" && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                  <span>Target Value</span>
                  <span>{donutPercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={donutPercent}
                  onChange={(e) => setDonutPercent(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Live Generated Code */}
        <div className="pt-2">
          <ComponentSource
            sourceCode={generateLiveCode()}
            scope={{ ModernAreaChart, ModernBarChart, ModernDonutChart }}
          />
        </div>
      </div>

      {/* Props Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Props Reference</h2>
        <PropsTable propsData={propsData} />
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Usage Examples</h2>
          <span className="text-xs text-muted-foreground font-mono">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="space-y-8">
          {visibleItems.map((ex, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{ex.name}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div className="min-h-[200px] flex items-center justify-center p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-md">
                  {ex.component}
                </div>
                <ComponentSource
                  sourceCode={ex.code}
                  scope={{ ModernAreaChart, ModernBarChart, ModernDonutChart }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ChartsSection;
