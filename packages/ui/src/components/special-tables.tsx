"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

// 1. DataGridTable (Premium look)
export const DataGridTable = ({ columns, data }: any) => (
  <div className="rounded-xl border bg-card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
          <tr>
            {columns.map((col: any, i: number) => (
              <th key={i} className="px-6 py-4 font-semibold">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row: any, i: number) => (
            <motion.tr 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="hover:bg-muted/30 transition-colors"
            >
              {row.map((cell: any, j: number) => (
                <td key={j} className="px-6 py-4">{cell}</td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

// 2. KanbanBoard
export const KanbanBoard = ({ columns }: any) => (
  <div className="flex gap-6 overflow-x-auto pb-4">
    {columns.map((col: any, i: number) => (
      <div key={i} className="min-w-[300px] bg-muted/30 rounded-xl p-4 flex flex-col gap-4 border">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-semibold">{col.title}</h3>
          <span className="bg-background text-xs px-2 py-1 rounded-full border">{col.items.length}</span>
        </div>
        <div className="flex flex-col gap-3">
          {col.items.map((item: any, j: number) => (
            <div key={j} className="bg-card p-4 rounded-lg shadow-sm border cursor-pointer hover:border-primary transition-colors">
              <h4 className="font-medium mb-1">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

// 3. PricingTable Advanced
export const PricingTableAdvanced = ({ plans }: any) => (
  <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {plans.map((p: any, i: number) => (
      <div key={i} className={cn("relative p-8 rounded-3xl border flex flex-col", p.popular ? "border-primary bg-primary/5 shadow-xl scale-105 z-10" : "bg-card")}>
        {p.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
        <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
        <p className="text-sm text-muted-foreground mb-6">{p.description}</p>
        <p className="text-5xl font-extrabold mb-6">${p.price}<span className="text-lg text-muted-foreground font-normal">/mo</span></p>
        <button className={cn("w-full py-3 rounded-xl font-semibold mb-8 transition-all hover:scale-105 active:scale-95", p.popular ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
          {p.cta}
        </button>
        <ul className="space-y-4 flex-1">
          {p.features.map((f: string, j: number) => (
            <li key={j} className="flex items-start gap-3 text-sm">
              <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)
