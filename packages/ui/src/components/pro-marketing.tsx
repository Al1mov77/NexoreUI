"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, Play, ArrowRight, ShieldCheck } from "lucide-react"

// 1. WaitlistForm
export const WaitlistForm = () => (
  <div className="w-full max-w-md mx-auto text-center space-y-6 bg-card p-8 rounded-3xl border shadow-xl">
    <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full mb-2">EARLY ACCESS</div>
    <h2 className="text-3xl font-extrabold tracking-tight">Join the Waitlist</h2>
    <p className="text-muted-foreground text-sm">Be the first to know when we launch and get 50% off your first year.</p>
    <div className="flex flex-col gap-3">
      <input className="w-full px-4 py-3 bg-muted/50 border rounded-xl outline-none focus:border-primary transition-colors" placeholder="Email address" />
      <button className="w-full py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity">Request Access</button>
    </div>
    <p className="text-xs text-muted-foreground">Over 10,000+ people already joined.</p>
  </div>
)

// 2. PricingToggle
export const PricingToggle = () => (
  <div className="flex items-center justify-center gap-3">
    <span className="font-medium text-sm">Monthly</span>
    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute top-1 left-7 w-4 h-4 bg-background rounded-full transition-all" /></div>
    <span className="font-medium text-sm">Annually <span className="text-green-500 text-xs font-bold bg-green-500/10 px-1.5 py-0.5 rounded ml-1">Save 20%</span></span>
  </div>
)

// 3. FeatureShowcase
export const FeatureShowcase = () => (
  <div className="flex items-center gap-8 bg-card border rounded-2xl p-6 overflow-hidden">
    <div className="flex-1 space-y-4">
      <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
      <h3 className="text-2xl font-bold">Enterprise Security</h3>
      <p className="text-muted-foreground">Bank-grade encryption for all your data. We never compromise on the security of your business.</p>
      <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">Learn more <ArrowRight className="w-4 h-4" /></button>
    </div>
    <div className="flex-1 h-48 bg-muted rounded-xl border flex items-center justify-center font-mono text-muted-foreground text-sm">Illustration Placeholder</div>
  </div>
)

// 4. TrustBanner
export const TrustBanner = () => (
  <div className="py-8 text-center border-y bg-muted/20">
    <p className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-widest">Backed by the best</p>
    <div className="flex justify-center gap-8 flex-wrap opacity-60">
      <div className="font-black text-xl">Y COMBINATOR</div><div className="font-black text-xl">SEQUOIA</div><div className="font-black text-xl">a16z</div>
    </div>
  </div>
)

// 5. ComparisonTableMock
export const ComparisonTableMock = () => (
  <div className="w-full border rounded-2xl bg-card overflow-hidden">
    <div className="grid grid-cols-3 bg-muted/50 p-4 border-b font-bold text-center">
      <div className="text-left">Features</div><div className="text-muted-foreground">Others</div><div className="text-primary">Us</div>
    </div>
    <div className="divide-y text-sm">
      {['Real-time sync', 'End-to-end encryption', '24/7 Support'].map((f, i) => (
        <div key={i} className="grid grid-cols-3 p-4 items-center text-center">
          <div className="text-left font-medium">{f}</div>
          <div className="text-muted-foreground/30">{i === 0 ? '✔️' : '❌'}</div>
          <div className="text-primary font-bold text-lg">✓</div>
        </div>
      ))}
    </div>
  </div>
)

// 6. AnimatedHeroText
export const AnimatedHeroText = () => (
  <h1 className="text-4xl md:text-6xl font-black text-center leading-tight">
    Create the next <br/>
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-[pulse_4s_ease-in-out_infinite]">unicorn startup.</span>
  </h1>
)

// 7. StatCounter
export const StatCounter = () => (
  <div className="grid grid-cols-3 gap-4 border-y py-8 text-center bg-card">
    <div><div className="text-4xl font-black text-primary mb-1">99.9%</div><div className="text-sm font-medium text-muted-foreground">Uptime SLA</div></div>
    <div><div className="text-4xl font-black text-primary mb-1">2M+</div><div className="text-sm font-medium text-muted-foreground">Active Users</div></div>
    <div><div className="text-4xl font-black text-primary mb-1">4.9/5</div><div className="text-sm font-medium text-muted-foreground">Customer Rating</div></div>
  </div>
)

// 8. NewsletterSignup
export const NewsletterSignup = () => (
  <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-3xl text-center md:text-left flex flex-col md:flex-row items-center gap-8 justify-between">
    <div className="max-w-md"><h2 className="text-3xl font-bold mb-2">Subscribe to our newsletter</h2><p className="opacity-90">Get the latest news, articles, and resources delivered to your inbox weekly.</p></div>
    <div className="w-full max-w-sm flex flex-col gap-2">
      <div className="flex gap-2"><input className="flex-1 px-4 py-3 rounded-xl text-foreground outline-none" placeholder="Enter your email" /><button className="px-6 py-3 bg-foreground text-background font-bold rounded-xl">Subscribe</button></div>
      <p className="text-xs opacity-70 text-center md:text-left">We care about your data. Read our Privacy Policy.</p>
    </div>
  </div>
)

// 9. VideoModalVisual
export const VideoModalVisual = () => (
  <div className="relative w-full max-w-2xl mx-auto aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer border border-white/10">
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Play className="w-6 h-6 text-white ml-1" /></div>
    </div>
    <div className="absolute bottom-4 left-4 text-white"><h4 className="font-bold">Watch the demo</h4><p className="text-sm opacity-80">2 mins</p></div>
  </div>
)

// 10. GradientCTABlock
export const GradientCTABlock = () => (
  <div className="relative p-12 rounded-3xl overflow-hidden border shadow-lg text-center">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
    <div className="relative z-10 max-w-lg mx-auto space-y-6">
      <h2 className="text-3xl md:text-4xl font-extrabold">Ready to dive in?</h2>
      <p className="text-lg text-muted-foreground">Start your free 14-day trial today. No credit card required.</p>
      <button className="px-8 py-4 bg-foreground text-background rounded-full font-bold shadow-xl hover:scale-105 transition-transform">Get Started Free</button>
    </div>
  </div>
)
