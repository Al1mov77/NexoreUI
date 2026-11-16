export const proLayouts = {
  name: "pro-layouts",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "lucide-react"
],
  
  fileName: "pro-layouts.tsx",
  content: `"use client"

import { User, Bell, Search } from "lucide-react"

export const SplitScreenLayout = () => (
  <div className="flex w-full h-[400px] border rounded-xl overflow-hidden bg-background">
    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-card">
      <div className="w-12 h-12 bg-primary rounded-xl mb-8" />
      <h2 className="text-3xl font-bold mb-4">Welcome back</h2>
      <p className="text-muted-foreground mb-8">Please enter your credentials to sign in.</p>
      <div className="w-full h-10 bg-muted rounded-lg mb-4" />
      <div className="w-full h-10 bg-muted rounded-lg mb-8" />
      <div className="w-full h-12 bg-primary rounded-lg" />
    </div>
    <div className="hidden md:block flex-1 bg-linear-to-br from-primary to-primary p-12 text-white flex flex-col justify-between">
      <div />
      <div>
        <h2 className="text-4xl font-bold mb-4">Application Core</h2>
        <p className="text-lg opacity-80">Modular component system engineered for high-concurrency environments.</p>
      </div>
    </div>
  </div>
)

export const AuthenticationLayout = () => (
  <div className="w-full h-[400px] bg-muted/20 border rounded-xl flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-card border rounded-2xl shadow-xl p-8 flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6"><User className="w-8 h-8 text-primary" /></div>
      <h2 className="text-2xl font-bold mb-2">Create Account</h2>
      <p className="text-muted-foreground text-center mb-8 text-sm">Deploy services with verified access controls.</p>
      <div className="w-full space-y-4"><div className="w-full h-10 bg-muted rounded-md" /><div className="w-full h-10 bg-muted rounded-md" /><div className="w-full h-10 bg-primary rounded-md mt-4" /></div>
    </div>
  </div>
)

export const SidebarLayout = () => (
  <div className="flex w-full h-[400px] border rounded-xl overflow-hidden bg-background text-sm">
    <div className="w-64 bg-card border-r flex flex-col">
      <div className="h-14 border-b flex items-center px-4 font-bold">Workspace</div>
      <div className="p-4 space-y-2 flex-1"><div className="w-full h-8 bg-primary/10 text-primary rounded flex items-center px-3 font-medium">Dashboard</div><div className="w-full h-8 hover:bg-muted rounded flex items-center px-3 text-muted-foreground">Projects</div></div>
      <div className="p-4 border-t flex items-center gap-3"><div className="w-8 h-8 bg-muted rounded-full" /><div className="flex-1 h-4 bg-muted rounded" /></div>
    </div>
    <div className="flex-1 flex flex-col">
      <div className="h-14 border-b flex items-center px-6 justify-between"><div className="font-bold">Overview</div><div className="flex gap-4"><Search className="w-4 h-4 text-muted-foreground" /><Bell className="w-4 h-4 text-muted-foreground" /></div></div>
      <div className="p-6 flex-1 bg-muted/10"><div className="w-full h-full border-2 border-dashed rounded-xl border-muted flex items-center justify-center text-muted-foreground">Content Area</div></div>
    </div>
  </div>
)

export const DashboardGridLayout = () => (
  <div className="w-full p-4 border rounded-xl bg-muted/10 space-y-4 h-[400px] overflow-hidden">
    <div className="grid grid-cols-4 gap-4"><div className="col-span-1 h-24 bg-card border rounded-xl shadow-sm" /><div className="col-span-1 h-24 bg-card border rounded-xl shadow-sm" /><div className="col-span-1 h-24 bg-card border rounded-xl shadow-sm" /><div className="col-span-1 h-24 bg-card border rounded-xl shadow-sm" /></div>
    <div className="grid grid-cols-3 gap-4 h-[200px]"><div className="col-span-2 bg-card border rounded-xl shadow-sm" /><div className="col-span-1 bg-card border rounded-xl shadow-sm" /></div>
  </div>
)

export const BentoGridVisual = () => (
  <div className="w-full h-[400px] border rounded-xl bg-background p-4 grid grid-cols-4 grid-rows-3 gap-4">
    <div className="col-span-2 row-span-2 bg-linear-to-br from-primary/20 to-primary/5 border rounded-2xl p-6 flex flex-col justify-end"><h3 className="text-2xl font-bold">Main Metric</h3></div>
    <div className="col-span-1 row-span-1 bg-card border rounded-2xl" />
    <div className="col-span-1 row-span-2 bg-card border rounded-2xl" />
    <div className="col-span-1 row-span-1 bg-card border rounded-2xl" />
    <div className="col-span-3 row-span-1 bg-card border rounded-2xl" />
  </div>
)

export const KanbanBoardVisual = () => (
  <div className="flex w-full h-[400px] border rounded-xl bg-muted/20 p-4 gap-4 overflow-hidden">
    {[1, 2, 3].map(col => (
      <div key={col} className="w-80 shrink-0 flex flex-col bg-card border rounded-xl p-3 h-full">
        <h4 className="font-bold text-sm mb-3 px-1">{col === 1 ? 'Backlog' : col === 2 ? 'In Review' : 'Resolved'} <span className="text-muted-foreground font-normal ml-2">3</span></h4>
        <div className="space-y-3 flex-1 overflow-hidden">
          <div className="w-full h-24 bg-background border rounded-lg shadow-sm" />
          <div className="w-full h-32 bg-background border rounded-lg shadow-sm" />
        </div>
      </div>
    ))}
  </div>
)

export const ChatLayoutVisual = () => (
  <div className="flex w-full h-[400px] border rounded-xl overflow-hidden bg-background">
    <div className="w-64 border-r flex flex-col"><div className="p-4 border-b font-bold">Conversations</div><div className="p-2 space-y-1 flex-1"><div className="w-full h-12 bg-muted rounded-lg" /><div className="w-full h-12 hover:bg-muted/50 rounded-lg" /></div></div>
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b font-bold flex items-center gap-3"><div className="w-8 h-8 bg-muted rounded-full" /> Channel Name</div>
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden bg-muted/10">
        <div className="w-64 h-12 bg-muted rounded-2xl rounded-tl-sm" />
        <div className="w-48 h-10 bg-primary rounded-2xl rounded-tr-sm self-end" />
      </div>
      <div className="p-4 border-t"><div className="w-full h-10 bg-muted rounded-full" /></div>
    </div>
  </div>
)

export const FeedLayout = () => (
  <div className="w-full h-[400px] border rounded-xl overflow-hidden bg-muted/20 flex justify-center p-4">
    <div className="w-full max-w-lg flex flex-col gap-4">
      <div className="w-full p-4 bg-card border rounded-xl shadow-sm"><div className="flex gap-3 items-center mb-4"><div className="w-10 h-10 bg-muted rounded-full" /><div className="w-32 h-4 bg-muted rounded" /></div><div className="w-full h-24 bg-muted/50 rounded-lg" /></div>
      <div className="w-full p-4 bg-card border rounded-xl shadow-sm"><div className="flex gap-3 items-center mb-4"><div className="w-10 h-10 bg-muted rounded-full" /><div className="w-32 h-4 bg-muted rounded" /></div><div className="w-full h-24 bg-muted/50 rounded-lg" /></div>
    </div>
  </div>
)

export const DocumentationLayout = () => (
  <div className="flex w-full h-[400px] border rounded-xl overflow-hidden bg-background">
    <div className="w-64 border-r p-4 space-y-4"><div className="w-full h-6 bg-muted rounded mb-6" /><div className="w-full h-4 bg-muted/50 rounded" /><div className="w-3/4 h-4 bg-muted/50 rounded" /><div className="w-5/6 h-4 bg-muted/50 rounded" /></div>
    <div className="flex-1 p-8 overflow-hidden">
      <h1 className="text-3xl font-bold mb-4">Installation</h1>
      <p className="text-muted-foreground mb-6">Install packages and configure environment dependencies.</p>
      <div className="w-full h-32 bg-zinc-950 rounded-xl mb-6 flex items-center px-4"><span className="font-mono text-zinc-300">npm install @ui/core</span></div>
      <div className="w-full h-4 bg-muted rounded mb-2" /><div className="w-full h-4 bg-muted rounded mb-2" /><div className="w-3/4 h-4 bg-muted rounded" />
    </div>
    <div className="w-48 border-l p-4 space-y-4 hidden lg:block"><div className="text-sm font-bold">On this page</div><div className="w-full h-3 bg-muted rounded" /><div className="w-2/3 h-3 bg-muted rounded" /></div>
  </div>
)

export const HeaderFooterLayout = () => (
  <div className="flex flex-col w-full h-[400px] border rounded-xl overflow-hidden bg-background">
    <header className="h-16 border-b flex items-center justify-between px-6 bg-card"><div className="w-8 h-8 bg-primary rounded" /><div className="flex gap-4"><div className="w-16 h-4 bg-muted rounded" /><div className="w-16 h-4 bg-muted rounded" /></div></header>
    <main className="flex-1 bg-muted/10 p-8"><div className="w-full h-full border-2 border-dashed rounded-xl border-muted flex items-center justify-center">Main Content</div></main>
    <footer className="h-20 border-t bg-card p-6 flex items-center justify-between"><div className="w-32 h-4 bg-muted rounded" /><div className="flex gap-2"><div className="w-6 h-6 bg-muted rounded-full" /><div className="w-6 h-6 bg-muted rounded-full" /></div></footer>
  </div>
)
`
};
