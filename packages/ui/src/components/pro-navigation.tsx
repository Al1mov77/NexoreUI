"use client"

import * as React from "react"
import { Globe, ChevronDown, X, ChevronRight, ChevronLeft } from "lucide-react"

// ============================================
// 1. FilterBar
// ============================================
export const FilterBar = () => (
  <div className="flex flex-wrap gap-3 items-center p-2 border rounded-lg bg-card">
    <span className="text-sm font-bold ml-2">Filters:</span>
    <div className="flex items-center border rounded-full px-3 py-1 bg-muted/50 text-sm gap-2">Status: Active <X className="w-3 h-3 cursor-pointer" /></div>
    <div className="flex items-center border rounded-full px-3 py-1 bg-muted/50 text-sm gap-2">Role: Admin <X className="w-3 h-3 cursor-pointer" /></div>
    <button className="text-sm border-dashed border rounded-full px-3 py-1 text-muted-foreground hover:bg-muted">+ Add Filter</button>
    <button className="text-sm text-muted-foreground hover:text-foreground ml-auto pr-2">Clear all</button>
  </div>
)

// ============================================
// 2. LanguageSelector
// ============================================
export const LanguageSelector = () => (
  <div className="inline-flex items-center border rounded-md bg-card overflow-hidden">
    <div className="px-3 py-2 border-r flex items-center"><Globe className="w-4 h-4 text-muted-foreground" /></div>
    <select className="bg-transparent pl-3 pr-8 py-2 text-sm font-medium outline-none cursor-pointer appearance-none">
      <option>English (US)</option><option>Spanish</option><option>French</option>
    </select>
  </div>
)

// ============================================
// 3. UserMenuDropdown
// ============================================
export const UserMenuDropdown = () => (
  <div className="flex items-center gap-3 cursor-pointer p-2 border rounded-lg hover:bg-muted transition-colors w-fit">
    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">JD</div>
    <div className="flex flex-col"><span className="text-sm font-bold leading-none">John Doe</span><span className="text-xs text-muted-foreground">admin@example.com</span></div>
    <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
  </div>
)

// ============================================
// 4. TreeNavigation
// ============================================
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

// ============================================
// 5. ContextActionBar
// ============================================
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

// ============================================
// 6. PaginationPro
// ============================================
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
