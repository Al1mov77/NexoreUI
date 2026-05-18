"use client"

import * as React from "react"
import { Search, Menu, User, Bell, Command, LayoutGrid, FileText, Settings, Globe, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react"

// 1. MegaMenuVisual
export const MegaMenuVisual = () => (
  <div className="w-full max-w-2xl bg-card border rounded-xl shadow-xl p-6 absolute top-12 left-0 z-50">
    <div className="grid grid-cols-3 gap-6">
      <div>
        <h4 className="font-bold text-sm mb-3">Products</h4>
        <ul className="space-y-2 text-sm text-muted-foreground"><li>Analytics</li><li>Automation</li><li>Commerce</li><li>Insights</li></ul>
      </div>
      <div>
        <h4 className="font-bold text-sm mb-3">Resources</h4>
        <ul className="space-y-2 text-sm text-muted-foreground"><li>Documentation</li><li>API Reference</li><li>Blog</li><li>Community</li></ul>
      </div>
      <div className="bg-muted p-4 rounded-lg flex flex-col justify-end">
        <h4 className="font-bold text-sm mb-1">Nexore UI 2.0</h4>
        <p className="text-xs text-muted-foreground mb-4">The new standard for web interfaces.</p>
        <button className="text-xs font-bold text-primary text-left hover:underline">Read announcement →</button>
      </div>
    </div>
  </div>
)

// 2. CommandPaletteVisual
export const CommandPaletteVisual = () => (
  <div className="w-full max-w-xl mx-auto bg-card border rounded-xl shadow-2xl overflow-hidden flex flex-col">
    <div className="flex items-center px-4 py-3 border-b"><Search className="w-5 h-5 text-muted-foreground mr-3" /><input className="flex-1 bg-transparent outline-none" placeholder="Type a command or search..." /><span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">ESC</span></div>
    <div className="p-2 space-y-1">
      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Suggestions</div>
      <div className="flex items-center px-2 py-2 bg-muted rounded-md cursor-pointer"><LayoutGrid className="w-4 h-4 mr-3" /><span className="text-sm font-medium">Go to Dashboard</span></div>
      <div className="flex items-center px-2 py-2 hover:bg-muted/50 rounded-md cursor-pointer"><FileText className="w-4 h-4 mr-3" /><span className="text-sm font-medium">Create New Document</span></div>
      <div className="flex items-center px-2 py-2 hover:bg-muted/50 rounded-md cursor-pointer"><Settings className="w-4 h-4 mr-3" /><span className="text-sm font-medium">Settings</span></div>
    </div>
  </div>
)

// 3. AppTopbar
export const AppTopbar = () => (
  <header className="flex h-14 items-center justify-between border-b px-6 bg-card w-full">
    <div className="flex items-center gap-4"><div className="w-6 h-6 bg-primary rounded" /><span className="font-bold text-lg hidden sm:block">AppShell</span></div>
    <div className="flex-1 max-w-md mx-6 hidden md:block"><div className="relative"><Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" /><input className="w-full bg-muted/50 border rounded-md h-8 pl-8 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Search..." /></div></div>
    <div className="flex items-center gap-4"><button className="relative"><Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" /><span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" /></button><div className="w-8 h-8 rounded-full bg-muted border cursor-pointer" /></div>
  </header>
)

// 4. MobileDrawerNav (Visual state)
export const MobileDrawerNav = () => (
  <div className="w-64 h-[400px] bg-card border-r shadow-2xl flex flex-col absolute left-0 top-0 z-50">
    <div className="p-4 border-b flex justify-between items-center"><span className="font-bold">Menu</span><X className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-foreground" /></div>
    <div className="p-4 flex-1 space-y-4">
      <div className="font-bold text-primary">Home</div>
      <div className="font-medium text-muted-foreground hover:text-foreground">Profile</div>
      <div className="font-medium text-muted-foreground hover:text-foreground">Settings</div>
    </div>
    <div className="p-4 border-t"><button className="w-full py-2 bg-muted rounded-md font-medium text-sm">Sign Out</button></div>
  </div>
)

// 5. TreeNavigation
export const TreeNavigation = () => (
  <div className="w-64 bg-card border rounded-lg p-4 space-y-1 text-sm">
    <div className="flex items-center gap-2 font-bold cursor-pointer py-1"><ChevronDown className="w-4 h-4" /> Components</div>
    <div className="pl-6 space-y-1">
      <div className="flex items-center gap-2 font-medium text-primary cursor-pointer py-1 bg-primary/10 px-2 rounded">Buttons</div>
      <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer py-1 px-2">Cards</div>
      <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer py-1 px-2">Inputs</div>
    </div>
    <div className="flex items-center gap-2 font-bold text-muted-foreground cursor-pointer py-1"><ChevronRight className="w-4 h-4" /> Hooks</div>
  </div>
)

// 6. ContextActionBar
export const ContextActionBar = () => (
  <div className="flex items-center justify-between p-2 bg-primary text-primary-foreground rounded-lg shadow-xl mx-auto w-fit gap-6 animate-in slide-in-from-bottom-4">
    <span className="text-sm font-medium pl-2">3 items selected</span>
    <div className="flex gap-2">
      <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors">Move</button>
      <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors">Archive</button>
      <button className="px-3 py-1 bg-destructive hover:bg-destructive/90 rounded text-sm font-medium transition-colors">Delete</button>
    </div>
  </div>
)

// 7. PaginationPro
export const PaginationPro = () => (
  <div className="flex items-center gap-1 border bg-card p-1 rounded-md w-fit mx-auto">
    <button className="p-2 hover:bg-muted rounded text-muted-foreground disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
    <button className="w-8 h-8 rounded text-sm font-medium hover:bg-muted">1</button>
    <button className="w-8 h-8 rounded text-sm font-medium bg-primary text-primary-foreground">2</button>
    <button className="w-8 h-8 rounded text-sm font-medium hover:bg-muted">3</button>
    <span className="px-2 text-muted-foreground">...</span>
    <button className="w-8 h-8 rounded text-sm font-medium hover:bg-muted">10</button>
    <button className="p-2 hover:bg-muted rounded text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
  </div>
)

// 8. FilterBar
export const FilterBar = () => (
  <div className="flex flex-wrap gap-3 items-center p-2 border rounded-lg bg-card">
    <span className="text-sm font-bold ml-2">Filters:</span>
    <div className="flex items-center border rounded-full px-3 py-1 bg-muted/50 text-sm gap-2">Status: Active <X className="w-3 h-3 cursor-pointer" /></div>
    <div className="flex items-center border rounded-full px-3 py-1 bg-muted/50 text-sm gap-2">Role: Admin <X className="w-3 h-3 cursor-pointer" /></div>
    <button className="text-sm border-dashed border rounded-full px-3 py-1 text-muted-foreground hover:bg-muted">+ Add Filter</button>
    <button className="text-sm text-muted-foreground hover:text-foreground ml-auto pr-2">Clear all</button>
  </div>
)

// 9. LanguageSelector
export const LanguageSelector = () => (
  <div className="inline-flex items-center border rounded-md bg-card overflow-hidden">
    <div className="px-3 py-2 border-r flex items-center"><Globe className="w-4 h-4 text-muted-foreground" /></div>
    <select className="bg-transparent pl-3 pr-8 py-2 text-sm font-medium outline-none cursor-pointer appearance-none">
      <option>English (US)</option><option>Spanish</option><option>French</option>
    </select>
  </div>
)

// 10. UserMenuDropdown
export const UserMenuDropdown = () => (
  <div className="flex items-center gap-3 cursor-pointer p-2 border rounded-lg hover:bg-muted transition-colors w-fit">
    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">JD</div>
    <div className="flex flex-col"><span className="text-sm font-bold leading-none">John Doe</span><span className="text-xs text-muted-foreground">admin@example.com</span></div>
    <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
  </div>
)
