"use client";

import React, { useState } from "react";
import {
  BarChartSimple,
  ComparisonBar,
  FunnelChart,
  HeatmapGrid,
  KPIDashboard,
  LeaderboardWidget,
  ModernAreaChart,
  ModernBarChart,
  ModernDonutChart,
  ProgressCircle,
  StatWidget,
  Switch,
} from "nexoreui";
import { A11yHeader } from "../A11yNotice";
import { ComponentCard, ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { WhenToUse } from "../WhenToUse";

const whenToUseItems = [
  {
    label: "ModernAreaChart",
    description:
      "Use for continuous time-series trends where cumulative volume or daily progression matters.",
  },
  {
    label: "ModernBarChart",
    description:
      "Use to compare discrete periods, endpoints, or regional totals along a shared zero baseline.",
  },
  {
    label: "ModernDonutChart",
    description:
      "Use for part-to-whole composition with 3 to 5 clear segments alongside an aligned numeric legend.",
  },
  {
    label: "Funnel & Comparison",
    description:
      "Use FunnelChart for staged drop-off analysis and ComparisonBar for two-way allocation splits.",
  },
];

const areaSeriesData = [
  { label: "Mon", value: 4200, formattedValue: "$4,200" },
  { label: "Tue", value: 3800, formattedValue: "$3,800" },
  { label: "Wed", value: 5900, formattedValue: "$5,900" },
  { label: "Thu", value: 5200, formattedValue: "$5,200" },
  { label: "Fri", value: 7100, formattedValue: "$7,100" },
  { label: "Sat", value: 6400, formattedValue: "$6,400" },
  { label: "Sun", value: 7800, formattedValue: "$7,800" },
];

const barSeriesData = [
  { label: "Q1", value: 42000, formattedValue: "$42k", color: "var(--primary)" },
  { label: "Q2", value: 64000, formattedValue: "$64k", color: "var(--chart-1)" },
  { label: "Q3", value: 56000, formattedValue: "$56k", color: "var(--chart-2)" },
  { label: "Q4", value: 89000, formattedValue: "$89k", color: "var(--chart-3)" },
];

const donutSeriesData = [
  { label: "Desktop", value: 58, color: "var(--primary)" },
  { label: "Mobile", value: 31, color: "var(--chart-2)" },
  { label: "Tablet", value: 11, color: "var(--chart-4)" },
];

const funnelSteps = [
  { label: "Landing Sessions", value: 12400 },
  { label: "Workspace Created", value: 6820 },
  { label: "Repository Connected", value: 3940 },
  { label: "Paid Conversion", value: 1480 },
];

const heatmapSeries = [
  0, 1, 2, 4, 3, 2, 1,
  1, 2, 3, 3, 4, 2, 0,
  0, 1, 4, 2, 1, 3, 2,
  2, 3, 4, 4, 3, 1, 1,
];

const kpiMetrics = [
  { label: "Monthly Revenue", value: "$68,420", delta: "+14.2%", positive: true },
  { label: "Active Tenants", value: "1,940", delta: "+6.8%", positive: true },
  { label: "Median Latency", value: "42 ms", delta: "-8.4%", positive: true },
  { label: "Churn Rate", value: "1.42%", delta: "+0.18%", positive: false },
];

const leaderboardItems = [
  { name: "Direct Organic", value: "41,280" },
  { name: "GitHub Referrals", value: "24,910" },
  { name: "Package Registry", value: "18,440" },
  { name: "Developer Docs", value: "11,620" },
];

const compactBarsData = [
  { label: "US-E", value: 420 },
  { label: "EU-W", value: 360 },
  { label: "AP-S", value: 290 },
  { label: "US-W", value: 340 },
];

const statWidgetCode = `import { StatWidget } from "nexoreui";

export default function StatWidgetsDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <StatWidget
        title="Net Revenue"
        value="$54,280"
        change="+18.4%"
        changeType="positive"
        data={[28, 34, 31, 45, 52, 49, 64]}
      />
      <StatWidget
        title="API Requests"
        value="1.42M"
        change="+6.2%"
        changeType="positive"
        data={[62, 65, 70, 68, 76, 81, 88]}
      />
      <StatWidget
        title="Error Budget"
        value="0.18%"
        change="-0.04%"
        changeType="negative"
        data={[38, 32, 35, 29, 24, 22, 19]}
      />
    </div>
  );
}`;

const comparisonAndProgressCode = `import { ComparisonBar, ProgressCircle } from "nexoreui";

export default function AllocationAndTargetsDemo() {
  return (
    <div className="w-full space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <ComparisonBar
          label1="Production Cluster"
          label2="Preview Builds"
          value1={8420}
          value2={3180}
        />
      </div>
      <div className="flex flex-wrap items-center justify-around gap-6 rounded-xl border border-border bg-card p-5">
        <ProgressCircle value={94} label="Uptime SLA" />
        <ProgressCircle value={76} label="Edge Cache" />
        <ProgressCircle value={62} label="Quota Used" />
      </div>
    </div>
  );
}`;

const funnelAndHeatmapCode = `import { FunnelChart, HeatmapGrid } from "nexoreui";

const funnelSteps = [
  { label: "Landing Sessions", value: 12400 },
  { label: "Workspace Created", value: 6820 },
  { label: "Repository Connected", value: 3940 },
  { label: "Paid Conversion", value: 1480 },
];

const heatmapSeries = [
  0, 1, 2, 4, 3, 2, 1,
  1, 2, 3, 3, 4, 2, 0,
  0, 1, 4, 2, 1, 3, 2,
  2, 3, 4, 4, 3, 1, 1,
];

export default function FunnelAndHeatmapDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="mb-4 text-sm font-semibold text-foreground">Activation Funnel</h4>
        <FunnelChart steps={funnelSteps} />
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="mb-4 text-sm font-semibold text-foreground">28-Day Deploy Cadence</h4>
        <HeatmapGrid data={heatmapSeries} columns={7} />
      </div>
    </div>
  );
}`;

const kpiDashboardCode = `import { KPIDashboard } from "nexoreui";

const metrics = [
  { label: "Monthly Revenue", value: "$68,420", delta: "+14.2%", positive: true },
  { label: "Active Tenants", value: "1,940", delta: "+6.8%", positive: true },
  { label: "Median Latency", value: "42 ms", delta: "-8.4%", positive: true },
  { label: "Churn Rate", value: "1.42%", delta: "+0.18%", positive: false },
];

export default function KPIDashboardDemo() {
  return <KPIDashboard metrics={metrics} />;
}`;

const leaderboardAndBarsCode = `import { BarChartSimple, LeaderboardWidget } from "nexoreui";

const leaderboardItems = [
  { name: "Direct Organic", value: "41,280" },
  { name: "GitHub Referrals", value: "24,910" },
  { name: "Package Registry", value: "18,440" },
  { name: "Developer Docs", value: "11,620" },
];

const regionalBars = [
  { label: "US-E", value: 420 },
  { label: "EU-W", value: 360 },
  { label: "AP-S", value: 290 },
  { label: "US-W", value: 340 },
];

export default function LeaderboardAndBarsDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <LeaderboardWidget title="Traffic Sources" items={leaderboardItems} />
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
        <h4 className="mb-4 text-sm font-semibold text-foreground">Regional Throughput</h4>
        <BarChartSimple data={regionalBars} height={170} />
      </div>
    </div>
  );
}`;

export function ChartsSection() {
  const [activeChart, setActiveChart] = useState<"area" | "bar" | "donut">("area");
  const [showGrid, setShowGrid] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [smoothCurve, setSmoothCurve] = useState(true);

  const areaCode = `import { ModernAreaChart } from "nexoreui";

const revenueData = [
  { label: "Mon", value: 4200, formattedValue: "$4,200" },
  { label: "Tue", value: 3800, formattedValue: "$3,800" },
  { label: "Wed", value: 5900, formattedValue: "$5,900" },
  { label: "Thu", value: 5200, formattedValue: "$5,200" },
  { label: "Fri", value: 7100, formattedValue: "$7,100" },
  { label: "Sat", value: 6400, formattedValue: "$6,400" },
  { label: "Sun", value: 7800, formattedValue: "$7,800" },
];

export default function AreaAnalyticsDemo() {
  return (
    <ModernAreaChart
      title="Weekly Revenue Volume"
      subtitle="Gross settled volume over 7 days"
      data={revenueData}
      showGrid={${showGrid}}
      showTooltip={${showTooltip}}
      smooth={${smoothCurve}}
    />
  );
}`;

  const barCode = `import { ModernBarChart } from "nexoreui";

const quarterlyData = [
  { label: "Q1", value: 42000, formattedValue: "$42k", color: "var(--primary)" },
  { label: "Q2", value: 64000, formattedValue: "$64k", color: "var(--chart-1)" },
  { label: "Q3", value: 56000, formattedValue: "$56k", color: "var(--chart-2)" },
  { label: "Q4", value: 89000, formattedValue: "$89k", color: "var(--chart-3)" },
];

export default function QuarterlyBarDemo() {
  return (
    <ModernBarChart
      title="Quarterly ARR Breakdown"
      subtitle="Net booked recurring revenue by quarter"
      data={quarterlyData}
      showGrid={${showGrid}}
    />
  );
}`;

  const donutCode = `import { ModernDonutChart } from "nexoreui";

const deviceShare = [
  { label: "Desktop", value: 58, color: "var(--primary)" },
  { label: "Mobile", value: 31, color: "var(--chart-2)" },
  { label: "Tablet", value: 11, color: "var(--chart-4)" },
];

export default function DeviceDonutDemo() {
  return (
    <ModernDonutChart
      title="Active Sessions by Device"
      centerLabel="Share"
      centerValue="100%"
      data={deviceShare}
    />
  );
}`;

  const playgroundCode =
    activeChart === "area"
      ? areaCode
      : activeChart === "bar"
      ? barCode
      : donutCode;

  return (
    <section id="charts" className="space-y-12 scroll-mt-20">
      <WhenToUse items={whenToUseItems} />

      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Interactive Chart Playground
          </h2>
          <p className="text-sm text-muted-foreground">
            Switch chart geometries and toggle gridlines, non-overlapping header readouts, or curve interpolation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-border bg-muted/20 p-5 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Chart Type
                </span>
                <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-background p-1">
                  {(["area", "bar", "donut"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      aria-pressed={activeChart === mode}
                      onClick={() => setActiveChart(mode)}
                      className={`rounded-md py-1.5 text-xs font-medium capitalize transition-colors cursor-pointer ${
                        activeChart === mode
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="charts-grid-switch"
                    className="text-xs font-medium text-foreground cursor-pointer"
                  >
                    Show gridlines
                  </label>
                  <Switch
                    id="charts-grid-switch"
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                    disabled={activeChart === "donut"}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="charts-tooltip-switch"
                    className="text-xs font-medium text-foreground cursor-pointer"
                  >
                    Header readout
                  </label>
                  <Switch
                    id="charts-tooltip-switch"
                    checked={showTooltip}
                    onCheckedChange={setShowTooltip}
                    disabled={activeChart !== "area"}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="charts-smooth-switch"
                    className="text-xs font-medium text-foreground cursor-pointer"
                  >
                    Smooth interpolation
                  </label>
                  <Switch
                    id="charts-smooth-switch"
                    checked={smoothCurve}
                    onCheckedChange={setSmoothCurve}
                    disabled={activeChart !== "area"}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background/80 p-3">
              <p className="font-mono text-[11px] font-semibold text-foreground">
                Scale & Precision
              </p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Y-axis ticks reserve dedicated left margin space and active data readouts dock in the header strip so peaks are never occluded.
              </p>
            </div>
          </div>

          <div
            data-demo-preview
            className="lg:col-span-8 p-4 sm:p-6 flex items-center justify-center bg-background"
          >
            {activeChart === "area" && (
              <ModernAreaChart
                title="Weekly Revenue Volume"
                subtitle="Gross settled volume over 7 days"
                data={areaSeriesData}
                showGrid={showGrid}
                showTooltip={showTooltip}
                smooth={smoothCurve}
              />
            )}
            {activeChart === "bar" && (
              <ModernBarChart
                title="Quarterly ARR Breakdown"
                subtitle="Net booked recurring revenue by quarter"
                data={barSeriesData}
                showGrid={showGrid}
              />
            )}
            {activeChart === "donut" && (
              <ModernDonutChart
                title="Active Sessions by Device"
                centerLabel="Share"
                centerValue="100%"
                data={donutSeriesData}
              />
            )}
          </div>
        </div>

        <ComponentSource sourceCode={playgroundCode} fileName="analytics-chart.tsx" />
      </div>

      <div className="space-y-10">
        <ComponentCard
          title="Sparkline Stat Widgets"
          description="StatWidget pairs tabular summary values and directional deltas with a lightweight AreaChartSimple sparkline."
          code={statWidgetCode}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <StatWidget
              title="Net Revenue"
              value="$54,280"
              change="+18.4%"
              changeType="positive"
              data={[28, 34, 31, 45, 52, 49, 64]}
            />
            <StatWidget
              title="API Requests"
              value="1.42M"
              change="+6.2%"
              changeType="positive"
              data={[62, 65, 70, 68, 76, 81, 88]}
            />
            <StatWidget
              title="Error Budget"
              value="0.18%"
              change="-0.04%"
              changeType="negative"
              data={[38, 32, 35, 29, 24, 22, 19]}
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Allocation Bar & Progress Rings"
          description="ComparisonBar enforces non-zero division safety while ProgressCircle tracks SLA completion thresholds."
          code={comparisonAndProgressCode}
        >
          <div className="w-full space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <ComparisonBar
                label1="Production Cluster"
                label2="Preview Builds"
                value1={8420}
                value2={3180}
              />
            </div>
            <div className="flex flex-wrap items-center justify-around gap-6 rounded-xl border border-border bg-card p-5">
              <ProgressCircle value={94} label="Uptime SLA" />
              <ProgressCircle value={76} label="Edge Cache" />
              <ProgressCircle value={62} label="Quota Used" />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Activation Funnel & Deployment Matrix"
          description="FunnelChart calculates stage-over-stage retention automatically alongside a 5-step HeatmapGrid legend."
          code={funnelAndHeatmapCode}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Activation Funnel
              </h4>
              <FunnelChart steps={funnelSteps} />
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                28-Day Deploy Cadence
              </h4>
              <HeatmapGrid data={heatmapSeries} columns={7} />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Executive KPI Grid"
          description="Responsive KPIDashboard adapting cleanly across 1, 2, and 4 columns with semantic delta badges."
          code={kpiDashboardCode}
        >
          <KPIDashboard metrics={kpiMetrics} />
        </ComponentCard>

        <ComponentCard
          title="Ranked Sources & Regional Bars"
          description="LeaderboardWidget and BarChartSimple share aligned monospace counters and semantic surface tokens."
          code={leaderboardAndBarsCode}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <LeaderboardWidget title="Traffic Sources" items={leaderboardItems} />
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Regional Throughput
              </h4>
              <BarChartSimple data={compactBarsData} height={170} />
            </div>
          </div>
        </ComponentCard>
      </div>

      <div className="space-y-4">
        <A11yHeader title="Accessibility & Reduced Motion" />
        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground rounded-xl border border-border bg-card p-5">
          <li>
            <strong className="text-foreground">Keyboard inspection:</strong> Data columns in ModernAreaChart, ModernBarChart, and ModernDonutChart legend items are focusable with explicit aria-label value readouts.
          </li>
          <li>
            <strong className="text-foreground">Reduced motion:</strong> Every SVG stroke and bar entry honors prefers-reduced-motion via useReducedMotion().
          </li>
        </ul>
      </div>

      <PropsTable
        propsData={[
          {
            name: "data",
            type: "{ label: string; value: number; formattedValue?: string; color?: string }[]",
            description: "Series dataset array consumed by ModernAreaChart, ModernBarChart, and ModernDonutChart.",
            required: true,
          },
          {
            name: "title",
            type: "string",
            description: "Heading title rendered above the chart plot.",
          },
          {
            name: "subtitle",
            type: "string",
            description: "Secondary context description under the chart title.",
          },
          {
            name: "height",
            type: "number",
            defaultValue: "220 / 200",
            description: "Plot area height in pixels for area and bar charts.",
          },
          {
            name: "showGrid",
            type: "boolean",
            defaultValue: "true",
            description: "Draws horizontal dashed reference lines aligned with Y-axis ticks.",
          },
          {
            name: "showTooltip",
            type: "boolean",
            defaultValue: "true",
            description: "Shows the selected point readout chip in the ModernAreaChart header.",
          },
          {
            name: "smooth",
            type: "boolean",
            defaultValue: "true",
            description: "Switches ModernAreaChart between cubic spline interpolation and linear segments.",
          },
          {
            name: "centerLabel / centerValue",
            type: "string",
            description: "Default center ring label and figure shown in ModernDonutChart when idle.",
          },
        ]}
      />
    </section>
  );
}

export default ChartsSection;
