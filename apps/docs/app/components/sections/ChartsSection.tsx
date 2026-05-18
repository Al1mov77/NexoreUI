"use client";

import React from "react";
import { ComponentSource } from "../ComponentSource";
import { DonutChart, BarChartSimple, AreaChartSimple, StatWidget, ProgressCircle, ComparisonBar, HeatmapGrid, LeaderboardWidget, FunnelChart, KPIDashboard } from "nexoreui";

const variants = [
  {
    name: "Donut Chart",
    component: <div className="p-4 flex justify-center w-full"><DonutChart value={75} max={100} label="75%" /></div>,
    code: `import { DonutChart } from "nexoreui"\n\n<DonutChart value={75} max={100} label="75%" />`
  },
  {
    name: "Bar Chart Simple",
    component: <div className="p-4 w-full"><BarChartSimple data={[{label: "Jan", value: 30}, {label: "Feb", value: 50}, {label: "Mar", value: 80}]} /></div>,
    code: `import { BarChartSimple } from "nexoreui"\n\n<BarChartSimple data={[{label: "Jan", value: 30}, ...]} />`
  },
  {
    name: "Area Chart Simple",
    component: <div className="p-4 w-full"><AreaChartSimple data={[10, 20, 15, 40, 30, 50, 45, 70]} /></div>,
    code: `import { AreaChartSimple } from "nexoreui"\n\n<AreaChartSimple data={[10, 20, 15, 40, ...]} />`
  },
  {
    name: "Stat Widget",
    component: <div className="p-4 w-full max-w-sm"><StatWidget title="Total Revenue" value="$45,231" change="20.1%" changeType="positive" data={[10,20,30,25,40]} /></div>,
    code: `import { StatWidget } from "nexoreui"\n\n<StatWidget title="Total Revenue" value="$45,231" change="20.1%" data={[...]} />`
  },
  {
    name: "Progress Circle",
    component: <div className="p-4 flex justify-center w-full"><ProgressCircle value={60} size={80} label="60/100" /></div>,
    code: `import { ProgressCircle } from "nexoreui"\n\n<ProgressCircle value={60} size={80} label="60/100" />`
  },
  {
    name: "Comparison Bar",
    component: <div className="p-4 w-full"><ComparisonBar label1="Desktop" label2="Mobile" value1={65} value2={35} /></div>,
    code: `import { ComparisonBar } from "nexoreui"\n\n<ComparisonBar label1="Desktop" label2="Mobile" value1={65} value2={35} />`
  },
  {
    name: "Heatmap Grid",
    component: <div className="p-4 flex justify-center w-full"><HeatmapGrid data={Array.from({length: 35}, () => Math.random() * 100)} columns={7} /></div>,
    code: `import { HeatmapGrid } from "nexoreui"\n\n<HeatmapGrid data={[...]} columns={7} />`
  },
  {
    name: "Leaderboard Widget",
    component: <div className="p-4 w-full max-w-sm"><LeaderboardWidget title="Top Creators" items={[{name: "Alice", score: 9420, avatar: ""}, {name: "Bob", score: 8100, avatar: ""}]} /></div>,
    code: `import { LeaderboardWidget } from "nexoreui"\n\n<LeaderboardWidget title="Top Creators" items={[...]} />`
  },
  {
    name: "Funnel Chart",
    component: <div className="p-4 w-full"><FunnelChart steps={[{label: "Visitors", value: 1000}, {label: "Signups", value: 400}, {label: "Sales", value: 150}]} /></div>,
    code: `import { FunnelChart } from "nexoreui"\n\n<FunnelChart steps={[{label: "Visitors", value: 1000}, ...]} />`
  },
  {
    name: "KPI Dashboard",
    component: <div className="p-4 w-full"><KPIDashboard metrics={[{label: "Users", value: "1.2K", trend: "+12%"}, {label: "Sales", value: "$4.5K", trend: "+5%"}]} /></div>,
    code: `import { KPIDashboard } from "nexoreui"\n\n<KPIDashboard metrics={[...]} />`
  }
];

export function ChartsSection() {
  return (
    <section id="charts" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Charts & Data</h2>
          <p className="text-muted-foreground">Beautiful visual representations of data.</p>
        </div>
      </div>

      <div className="space-y-12">
        {variants.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
