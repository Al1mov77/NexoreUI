"use client"

import * as React from "react"
import { Home, Search, Bell, User, Settings, Menu, ChevronRight } from "lucide-react"

// 1. SimpleNavbar
export const SimpleNavbar = () => (
  <nav className="flex items-center justify-between p-4 border-b bg-background w-full">
    <div className="font-bold text-lg">Logo</div>
    <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
      <a href="#" className="text-foreground">Home</a>
      <a href="#" className="hover:text-foreground">About</a>
      <a href="#" className="hover:text-foreground">Services</a>
      <a href="#" className="hover:text-foreground">Contact</a>
    </div>
    <div className="flex gap-4">
      <button><Search className="w-5 h-5" /></button>
      <button className="md:hidden"><Menu className="w-5 h-5" /></button>
    </div>
  </nav>
)

// 2. CenteredNavbar
export const CenteredNavbar = () => (
  <nav className="flex items-center justify-between p-4 border-b bg-background w-full">
    <div className="flex-1"><div className="font-bold text-lg">Logo</div></div>
    <div className="hidden md:flex gap-6 text-sm font-medium">
      <a href="#">Products</a>
      <a href="#">Solutions</a>
      <a href="#">Pricing</a>
    </div>
    <div className="flex-1 flex justify-end gap-2">
      <button className="px-4 py-2 text-sm font-medium">Log in</button>
      <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md">Sign up</button>
    </div>
  </nav>
)

// 3. GlassNavbar
export const GlassNavbar = () => (
  <nav className="flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-[90%] mx-auto mt-4 shadow-lg sticky top-4 z-50">
    <div className="font-bold text-white">Glass UI</div>
    <div className="flex gap-6 text-sm font-medium text-white/80">
      <a href="#" className="hover:text-white transition-colors">Features</a>
      <a href="#" className="hover:text-white transition-colors">Pricing</a>
    </div>
    <button className="px-4 py-1.5 bg-white text-black rounded-full text-sm font-bold">Start</button>
  </nav>
)

// 4. FloatingNavbar
export const FloatingNavbar = () => (
  <nav className="flex items-center justify-center gap-8 px-8 py-3 bg-card border rounded-full w-fit mx-auto mt-4 shadow-xl">
    <a href="#" className="flex flex-col items-center gap-1 text-primary"><Home className="w-5 h-5" /><span className="text-[10px] font-medium">Home</span></a>
    <a href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><Search className="w-5 h-5" /><span className="text-[10px] font-medium">Search</span></a>
    <a href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><Bell className="w-5 h-5" /><span className="text-[10px] font-medium">Alerts</span></a>
    <a href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><User className="w-5 h-5" /><span className="text-[10px] font-medium">Profile</span></a>
  </nav>
)

// 5. SidebarMenu (Visual snippet)
export const SidebarMenu = () => (
  <div className="w-64 h-full min-h-[300px] border-r bg-background p-4 flex flex-col gap-2">
    <div className="font-bold text-xl mb-6 px-2">Dashboard</div>
    <a href="#" className="flex items-center gap-3 px-3 py-2 bg-muted rounded-md font-medium text-sm"><Home className="w-4 h-4" /> Overview</a>
    <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md font-medium text-sm"><Settings className="w-4 h-4" /> Settings</a>
    <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md font-medium text-sm mt-auto"><User className="w-4 h-4" /> Account</a>
  </div>
)

// 6. BottomNav (Mobile style)
export const BottomNav = () => (
  <div className="flex items-center justify-around p-3 border-t bg-background w-full mt-auto">
    <button className="flex flex-col items-center gap-1 text-primary"><Home className="w-5 h-5" /></button>
    <button className="flex flex-col items-center gap-1 text-muted-foreground"><Search className="w-5 h-5" /></button>
    <div className="relative -top-5"><button className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg"><Menu className="w-6 h-6" /></button></div>
    <button className="flex flex-col items-center gap-1 text-muted-foreground"><Bell className="w-5 h-5" /></button>
    <button className="flex flex-col items-center gap-1 text-muted-foreground"><User className="w-5 h-5" /></button>
  </div>
)

// 7. BreadcrumbTrail
export const BreadcrumbTrail = () => (
  <nav className="flex items-center text-sm text-muted-foreground space-x-1">
    <a href="#" className="hover:text-foreground hover:underline">Home</a>
    <ChevronRight className="w-4 h-4" />
    <a href="#" className="hover:text-foreground hover:underline">Products</a>
    <ChevronRight className="w-4 h-4" />
    <span className="text-foreground font-medium">Laptop</span>
  </nav>
)

// 8. StepIndicator
export const StepIndicator = ({ current = 2 }: any) => (
  <div className="flex items-center w-full max-w-sm">
    <div className="flex items-center text-primary"><div className="w-8 h-8 rounded-full border-2 border-primary bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div></div>
    <div className="flex-1 h-[2px] bg-primary mx-2"></div>
    <div className="flex items-center text-primary"><div className="w-8 h-8 rounded-full border-2 border-primary bg-background flex items-center justify-center font-bold text-sm">2</div></div>
    <div className="flex-1 h-[2px] bg-muted mx-2"></div>
    <div className="flex items-center text-muted-foreground"><div className="w-8 h-8 rounded-full border-2 border-muted bg-background flex items-center justify-center font-bold text-sm">3</div></div>
  </div>
)

// 9. TabMenu
export const TabMenu = () => (
  <div className="flex border-b w-full">
    <button className="px-6 py-3 border-b-2 border-primary text-primary font-medium text-sm">Account</button>
    <button className="px-6 py-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium text-sm transition-colors">Password</button>
    <button className="px-6 py-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium text-sm transition-colors">Notifications</button>
  </div>
)

// 10. DropdownMenuVisual
export const DropdownMenuVisual = () => (
  <div className="w-48 border bg-card rounded-md shadow-md p-1 flex flex-col">
    <div className="px-2 py-1.5 text-sm font-semibold border-b mb-1">My Account</div>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Profile</button>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Billing</button>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Settings</button>
    <div className="border-t my-1"></div>
    <button className="px-2 py-1.5 text-sm text-left text-destructive hover:bg-destructive/10 rounded-sm transition-colors">Log out</button>
  </div>
)
