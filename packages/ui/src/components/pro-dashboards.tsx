"use client"

import * as React from "react"
import { Activity, Users, DollarSign, ArrowUpRight, CheckCircle2, HardDrive, Server, Zap, Plus, FileText, Settings } from "lucide-react"

// 1. DashboardShell (Visual structure)
export const DashboardShell = ({ children }: any) => (
  <div className="flex h-[400px] w-full border rounded-xl overflow-hidden bg-background">
    <div className="w-48 border-r bg-muted/20 p-4 flex flex-col gap-2">
      <div className="w-full h-8 bg-muted rounded mb-4" />
      {[1, 2, 3].map(i => <div key={i} className="w-full h-6 bg-muted/50 rounded" />)}
    </div>
    <div className="flex-1 flex flex-col">
      <div className="h-12 border-b flex items-center px-4 justify-between bg-card"><div className="w-32 h-4 bg-muted rounded" /><div className="w-8 h-8 bg-muted rounded-full" /></div>
      <div className="flex-1 p-4 overflow-y-auto bg-muted/10">{children || <div className="w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">Dashboard Content</div>}</div>
    </div>
  </div>
)

// 2. StatWidgetCard
export const StatWidgetCard = ({ title = "Total Revenue", value = "$45,231.89", icon: Icon = DollarSign, trend = "+20.1%" }: any) => (
  <div className="p-6 border rounded-xl bg-card shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-muted-foreground mt-1"><span className="text-green-500 font-medium flex items-center inline-flex"><ArrowUpRight className="w-3 h-3 mr-1" />{trend}</span> from last month</p>
  </div>
)

// 3. ActivityFeed
export const ActivityFeed = () => (
  <div className="border rounded-xl bg-card p-6">
    <h3 className="font-bold mb-4">Recent Activity</h3>
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {[1, 2].map(i => (
        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"><Zap className="w-4 h-4" /></div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] border rounded-lg p-3 bg-background shadow-sm">
            <div className="flex justify-between items-center mb-1"><h4 className="font-bold text-sm">System Update</h4><time className="text-xs text-muted-foreground">2 hrs ago</time></div>
            <p className="text-xs text-muted-foreground">Server deployed successfully.</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// 4. ProgressWidget
export const ProgressWidget = () => (
  <div className="border rounded-xl bg-card p-6">
    <h3 className="font-bold mb-4 text-sm">Monthly Goal</h3>
    <div className="flex justify-between items-end mb-2">
      <div className="text-2xl font-bold">12,450 <span className="text-sm font-normal text-muted-foreground">/ 20,000</span></div>
      <div className="text-sm font-medium text-primary">62%</div>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary w-[62%]" /></div>
  </div>
)

// 5. QuickActionsWidget
export const QuickActionsWidget = () => (
  <div className="border rounded-xl bg-card p-4 grid grid-cols-3 gap-2">
    <button className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-muted transition-colors gap-2"><div className="p-2 bg-primary/10 text-primary rounded-full"><Plus className="w-4 h-4" /></div><span className="text-xs font-medium">New Project</span></button>
    <button className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-muted transition-colors gap-2"><div className="p-2 bg-blue-500/10 text-blue-500 rounded-full"><FileText className="w-4 h-4" /></div><span className="text-xs font-medium">Create Invoice</span></button>
    <button className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-muted transition-colors gap-2"><div className="p-2 bg-zinc-500/10 text-zinc-500 rounded-full"><Settings className="w-4 h-4" /></div><span className="text-xs font-medium">Settings</span></button>
  </div>
)

// 6. TaskChecklist
export const TaskChecklist = () => (
  <div className="border rounded-xl bg-card p-6">
    <h3 className="font-bold mb-4 text-sm">Tasks</h3>
    <div className="space-y-3">
      {['Review pull requests', 'Deploy new staging environment', 'Update documentation'].map((t, i) => (
        <div key={i} className="flex items-center gap-3">
          <input type="checkbox" defaultChecked={i === 0} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <span className={`text-sm ${i === 0 ? 'line-through text-muted-foreground' : 'font-medium'}`}>{t}</span>
        </div>
      ))}
    </div>
  </div>
)

// 7. StorageWidget
export const StorageWidget = () => (
  <div className="border rounded-xl bg-card p-6 flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4"><HardDrive className="w-8 h-8 text-blue-500" /></div>
    <h3 className="font-bold mb-1">Storage Usage</h3>
    <p className="text-2xl font-bold mb-1">45.2 GB <span className="text-sm font-normal text-muted-foreground">/ 100 GB</span></p>
    <div className="w-full h-2 bg-muted rounded-full mt-4"><div className="h-full bg-blue-500 rounded-full w-[45%]" /></div>
  </div>
)

// 8. RevenueChartWidget (Visual Mock)
export const RevenueChartWidget = () => (
  <div className="border rounded-xl bg-card p-6 h-48 flex flex-col">
    <h3 className="font-bold text-sm mb-4">Revenue Overview</h3>
    <div className="flex-1 flex items-end gap-2">
      {[30, 50, 40, 70, 50, 90, 80].map((h, i) => <div key={i} className="flex-1 bg-primary hover:opacity-80 transition-opacity rounded-t-sm" style={{ height: `${h}%` }} />)}
    </div>
  </div>
)

// 9. RecentUsersWidget
export const RecentUsersWidget = () => (
  <div className="border rounded-xl bg-card p-6">
    <h3 className="font-bold text-sm mb-4">New Users</h3>
    <div className="flex -space-x-3 overflow-hidden">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-xs border font-medium">{i}</div>)}
    </div>
    <button className="text-xs font-medium text-primary mt-4 hover:underline">View all users</button>
  </div>
)

// 10. ServerStatusWidget
export const ServerStatusWidget = () => (
  <div className="border rounded-xl bg-card p-6 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-green-500/10 rounded-full"><Server className="w-6 h-6 text-green-500" /></div>
      <div><h3 className="font-bold">us-east-1</h3><p className="text-xs text-green-500 font-medium flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />Operational</p></div>
    </div>
    <div className="text-right"><p className="text-xs text-muted-foreground mb-1">Ping</p><p className="font-mono font-bold text-sm">24ms</p></div>
  </div>
)
