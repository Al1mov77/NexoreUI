"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"

// 1. CircularProgressCard
export const CircularProgressCard = ({ value = 75, label = "Completion" }: any) => (
  <div className="p-6 bg-card border rounded-2xl flex flex-col items-center gap-4">
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full"><circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" /><circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * value) / 100} className="text-primary transition-all duration-1000 ease-out" /></svg>
      <span className="absolute text-xl font-bold">{value}%</span>
    </div>
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
  </div>
)

// 2. LineChartCard (Mock)
export const LineChartCard = () => (
  <div className="p-6 bg-card border rounded-2xl">
    <div className="flex justify-between items-end mb-6">
      <div><h3 className="text-muted-foreground text-sm font-medium">Revenue</h3><p className="text-3xl font-bold">$12,450</p></div>
      <span className="flex items-center text-green-500 text-sm font-bold"><ArrowUpRight className="w-4 h-4 mr-1" /> +14.5%</span>
    </div>
    <div className="h-24 flex items-end gap-1">
      {[40, 30, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 100].map((h, i) => (
        <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
)

// 3. BarChartCard (Mock)
export const BarChartCard = () => (
  <div className="p-6 bg-card border rounded-2xl">
    <h3 className="font-bold mb-4">Traffic Sources</h3>
    <div className="space-y-3">
      {[{ l: "Direct", v: 60, c: "bg-blue-500" }, { l: "Social", v: 30, c: "bg-indigo-500" }, { l: "Referral", v: 10, c: "bg-purple-500" }].map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1"><span>{item.l}</span><span>{item.v}%</span></div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${item.v}%` }} className={`h-full ${item.c}`} /></div>
        </div>
      ))}
    </div>
  </div>
)

// 4. TrendStatCard
export const TrendStatCard = ({ title = "Active Users", value = "2,345", trend = "up" }: any) => (
  <div className="p-4 bg-card border border-l-4 border-l-primary rounded-lg shadow-sm flex justify-between items-center">
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <h4 className="text-2xl font-bold">{value}</h4>
    </div>
    <div className={`p-2 rounded-full ${trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
      {trend === 'up' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
    </div>
  </div>
)

// 5. RankingList
export const RankingList = () => (
  <div className="p-6 bg-card border rounded-2xl space-y-4">
    <h3 className="font-bold">Top Products</h3>
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{i}</span>
        <div className="flex-1"><h4 className="text-sm font-semibold">Product {i}</h4><p className="text-xs text-muted-foreground">{1000 - i * 100} sales</p></div>
        <span className="text-sm font-bold text-primary">${(1000 - i * 100) * 10}</span>
      </div>
    ))}
  </div>
)

// 6. ActivityHeatmap (Mock)
export const ActivityHeatmap = () => (
  <div className="p-6 bg-card border rounded-2xl flex flex-col items-center">
    <h3 className="font-bold mb-4 w-full text-left">Activity Heatmap</h3>
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} className="w-4 h-4 rounded-sm" style={{ backgroundColor: `rgba(var(--color-primary), ${Math.random() * 0.8 + 0.1})` }} />
      ))}
    </div>
  </div>
)

// 7. RadarChartMock
export const RadarChartMock = () => (
  <div className="p-6 bg-card border rounded-2xl flex items-center justify-center min-h-[200px] relative">
    <div className="absolute inset-0 flex items-center justify-center opacity-10">
      <svg viewBox="0 0 100 100" className="w-32 h-32 stroke-foreground fill-transparent stroke-1"><polygon points="50,0 100,25 100,75 50,100 0,75 0,25" /></svg>
      <svg viewBox="0 0 100 100" className="w-20 h-20 absolute stroke-foreground fill-transparent stroke-1"><polygon points="50,0 100,25 100,75 50,100 0,75 0,25" /></svg>
    </div>
    <svg viewBox="0 0 100 100" className="w-32 h-32 absolute stroke-primary fill-primary/30 stroke-2"><polygon points="50,20 80,40 70,80 40,90 20,50" /></svg>
    <div className="absolute top-2 text-xs font-bold">Speed</div><div className="absolute bottom-2 text-xs font-bold">Power</div>
  </div>
)

// 8. GaugeMeter
export const GaugeMeter = ({ value = 65 }: any) => (
  <div className="p-6 bg-card border rounded-2xl flex flex-col items-center">
    <div className="relative w-32 h-16 overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-muted" />
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-primary border-b-transparent border-r-transparent transform -rotate-45" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${value}%, 0 ${value}%)` }} />
    </div>
    <div className="mt-[-10px] text-center"><h4 className="text-2xl font-bold">{value}</h4><p className="text-xs text-muted-foreground">Score</p></div>
  </div>
)

// 9. SparklineStat
export const SparklineStat = () => (
  <div className="p-4 bg-card border rounded-lg flex items-center justify-between">
    <div><p className="text-sm text-muted-foreground">Bounce Rate</p><h4 className="text-xl font-bold">42.3%</h4></div>
    <svg className="w-16 h-8 stroke-red-500 stroke-2 fill-none"><polyline points="0,20 10,25 20,15 30,20 40,5 50,10 60,0" /></svg>
  </div>
)

// 10. MetricGrid
export const MetricGrid = () => (
  <div className="grid grid-cols-2 gap-2">
    {[{ l: "Users", v: "1.2k" }, { l: "Sessions", v: "3.4k" }, { l: "Duration", v: "2m 14s" }, { l: "Issues", v: "4" }].map((m, i) => (
      <div key={i} className="bg-card border p-3 rounded-lg text-center"><p className="text-xs text-muted-foreground mb-1">{m.l}</p><p className="font-bold">{m.v}</p></div>
    ))}
  </div>
)
