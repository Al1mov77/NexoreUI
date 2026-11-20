"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import {
  ModernAreaChart,
  ModernBarChart,
  ModernDonutChart,
  StatWidget,
  ComparisonBar,
  HeatmapGrid,
  FunnelChart,
  KPIDashboard,
} from "nexoreui";
import { Activity, DollarSign, Users, Zap } from "lucide-react";

const SAMPLE_AREA_DATA = [
  { label: "Mon", value: 3400 },
  { label: "Tue", value: 4200 },
  { label: "Wed", value: 3900 },
  { label: "Thu", value: 5800 },
  { label: "Fri", value: 6400 },
  { label: "Sat", value: 5900 },
  { label: "Sun", value: 7800 },
];

const SAMPLE_BAR_DATA = [
  { label: "Jan", value: 45 },
  { label: "Feb", value: 68 },
  { label: "Mar", value: 85 },
  { label: "Apr", value: 52 },
  { label: "May", value: 94 },
  { label: "Jun", value: 76 },
  { label: "Jul", value: 110 },
];

const SAMPLE_HEATMAP = [
  1, 3, 2, 0, 5, 4, 2,
  2, 4, 6, 3, 2, 1, 5,
  0, 2, 5, 7, 6, 4, 3,
  3, 1, 4, 5, 8, 5, 2,
];

export function ChartsSection() {
  const [activeTab, setActiveTab] = useState<"area" | "bar" | "donut">("area");
  const [chartColor, setChartColor] = useState<string>("primary");
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [donutPercent, setDonutPercent] = useState<number>(84);

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
    { label: "Jul", value: 110 },
  ];

  return <ModernBarChart data={data} color="${chartColor}" />;
}`;
    }

    return `import { ModernDonutChart } from "nexoreui";

export default function DonutChartDemo() {
  return (
    <ModernDonutChart
      percentage={${donutPercent}}
      title="${donutPercent}%"
      subtitle="Target Met"
      color="${chartColor}"
    />
  );
}`;
  };

  const propsData = [
    {
      name: "data",
      type: "{ label: string; value: number }[]",
      defaultValue: "7-day series",
      description: "Array of axis labels and numeric values.",
      required: false,
    },
    {
      name: "color",
      type: '"primary" | "chart-1" | "chart-2" | "emerald" | "rose" | "amber"',
      defaultValue: '"primary"',
      description: "Token-mapped stroke and fill color key.",
      required: false,
    },
    {
      name: "height",
      type: "number",
      defaultValue: "240",
      description: "Chart viewport height in pixels.",
      required: false,
    },
    {
      name: "showGrid",
      type: "boolean",
      defaultValue: "true",
      description: "Shows horizontal dashed reference grid lines (ModernAreaChart).",
      required: false,
    },
    {
      name: "showTooltip",
      type: "boolean",
      defaultValue: "true",
      description: "Shows hovered point readout badge (ModernAreaChart).",
      required: false,
    },
  ];

  const widgetExamples = [
    {
      name: "StatWidget & ComparisonBar",
      component: (
        <div className="w-full max-w-md space-y-5">
          <StatWidget
            title="Weekly Active Developers"
            value="8,420"
            change="+11.4%"
            changeType="positive"
            data={[32, 41, 39, 54, 62, 58, 74]}
          />
          <ComparisonBar
            label1="Desktop"
            label2="Mobile"
            value1={6840}
            value2={3160}
          />
        </div>
      ),
      code: `import { StatWidget, ComparisonBar } from "nexoreui";

export default function StatAndComparisonDemo() {
  return (
    <div className="space-y-5">
      <StatWidget
        title="Weekly Active Developers"
        value="8,420"
        change="+11.4%"
        changeType="positive"
        data={[32, 41, 39, 54, 62, 58, 74]}
      />
      <ComparisonBar label1="Desktop" label2="Mobile" value1={6840} value2={3160} />
    </div>
  );
}`,
    },
    {
      name: "FunnelChart & HeatmapGrid",
      component: (
        <div className="w-full max-w-md space-y-6">
          <FunnelChart
            steps={[
              { label: "Visited", value: 12400 },
              { label: "Installed", value: 4920 },
              { label: "Shipped", value: 1840 },
            ]}
          />
          <div className="flex flex-col items-start gap-2">
            <span className="text-xs font-mono text-muted-foreground">Activity (28 days)</span>
            <HeatmapGrid data={SAMPLE_HEATMAP} columns={7} />
          </div>
        </div>
      ),
      code: `import { FunnelChart, HeatmapGrid } from "nexoreui";

export default function FunnelAndHeatmapDemo() {
  return (
    <div className="space-y-6">
      <FunnelChart
        steps={[
          { label: "Visited", value: 12400 },
          { label: "Installed", value: 4920 },
          { label: "Shipped", value: 1840 },
        ]}
      />
      <HeatmapGrid data={[1, 3, 2, 0, 5, 4, 2, 2, 4, 6, 3, 2, 1, 5]} columns={7} />
    </div>
  );
}`,
    },
    {
      name: "KPIDashboard",
      component: (
        <div className="w-full">
          <KPIDashboard
            className="grid-cols-2 md:grid-cols-2"
            metrics={[
              { label: "MRR", value: "$48.2k", icon: <DollarSign className="w-4 h-4" />, trend: "12.4%", trendType: "up" },
              { label: "Users", value: "3,412", icon: <Users className="w-4 h-4" />, trend: "6.1%", trendType: "up" },
              { label: "p95 Latency", value: "42ms", icon: <Zap className="w-4 h-4" />, trend: "8ms", trendType: "up" },
              { label: "Error Rate", value: "0.08%", icon: <Activity className="w-4 h-4" />, trend: "0.02%", trendType: "down" },
            ]}
          />
        </div>
      ),
      code: `import { KPIDashboard } from "nexoreui";
import { DollarSign, Users, Zap, Activity } from "lucide-react";

export default function KPIDashboardDemo() {
  return (
    <KPIDashboard
      metrics={[
        { label: "MRR", value: "$48.2k", icon: <DollarSign className="w-4 h-4" />, trend: "12.4%", trendType: "up" },
        { label: "Users", value: "3,412", icon: <Users className="w-4 h-4" />, trend: "6.1%", trendType: "up" },
        { label: "p95 Latency", value: "42ms", icon: <Zap className="w-4 h-4" />, trend: "8ms", trendType: "up" },
        { label: "Error Rate", value: "0.08%", icon: <Activity className="w-4 h-4" />, trend: "0.02%", trendType: "down" },
      ]}
    />
  );
}`,
    },
  ];

  return (
    <section id="charts" className="space-y-12 scroll-mt-20">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Interactive Playground
            </h2>
            <p className="text-xs text-muted-foreground">
              All previews render directly from the exported nexoreui charts package.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border text-xs font-medium self-start sm:self-auto">
            {(["area", "bar", "donut"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "area" ? "Area Spline" : tab === "bar" ? "Column Bar" : "Donut Ring"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div
            data-demo-preview
            className="xl:col-span-2 min-h-[300px] flex items-center justify-center p-6 sm:p-10 rounded-xl border border-border bg-card overflow-hidden"
          >
            {activeTab === "area" && (
              <ModernAreaChart
                data={SAMPLE_AREA_DATA}
                color={chartColor}
                showGrid={showGrid}
                showTooltip={showTooltip}
                height={250}
              />
            )}

            {activeTab === "bar" && (
              <ModernBarChart data={SAMPLE_BAR_DATA} color={chartColor} height={230} />
            )}

            {activeTab === "donut" && (
              <ModernDonutChart
                percentage={donutPercent}
                title={`${donutPercent}%`}
                subtitle="Target Met"
                color={chartColor}
                size={190}
              />
            )}
          </div>

          <div className="p-5 rounded-xl border border-border bg-card space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Configure Props
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Color Token</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["primary", "chart-2", "emerald", "rose", "amber"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChartColor(c)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-colors cursor-pointer ${
                      chartColor === c
                        ? "bg-primary text-primary-foreground font-semibold border-primary"
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
                  <span className="text-xs font-medium text-foreground">Grid Lines</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showGrid}
                    aria-label="Toggle grid lines"
                    onClick={() => setShowGrid(!showGrid)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer border ${
                      showGrid ? "bg-foreground border-foreground" : "bg-muted border-border"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full transition-transform absolute top-0.5 ${
                        showGrid ? "translate-x-4.5 bg-background" : "translate-x-0.5 bg-foreground"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-foreground">Hover Tooltip</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showTooltip}
                    aria-label="Toggle hover tooltip"
                    onClick={() => setShowTooltip(!showTooltip)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer border ${
                      showTooltip ? "bg-foreground border-foreground" : "bg-muted border-border"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full transition-transform absolute top-0.5 ${
                        showTooltip ? "translate-x-4.5 bg-background" : "translate-x-0.5 bg-foreground"
                      }`}
                    />
                  </button>
                </div>
              </>
            )}

            {activeTab === "donut" && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground font-mono tabular-nums">
                  <label htmlFor="donut-target-range">Target Value</label>
                  <span>{donutPercent}%</span>
                </div>
                <input
                  id="donut-target-range"
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

        <ComponentSource sourceCode={generateLiveCode()} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Props Reference</h2>
        <PropsTable propsData={propsData} />
      </div>

      <div className="space-y-8">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Additional Chart Widgets</h2>
        <div className="space-y-10">
          {widgetExamples.map((ex, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{ex.name}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div
                  data-demo-preview
                  className="min-h-[200px] flex items-center justify-center p-6 rounded-xl border border-border bg-card"
                >
                  {ex.component}
                </div>
                <ComponentSource sourceCode={ex.code} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ChartsSection;
