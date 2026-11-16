"use client"

import { Check, X, Play, ArrowRight, ShieldCheck } from "lucide-react"

export const WaitlistForm = () => (
  <div className="w-full max-w-md mx-auto text-center space-y-6 bg-card p-8 rounded-3xl border shadow-sm">
    <h2 className="text-3xl font-extrabold tracking-tight">Join the Waitlist</h2>
    <p className="text-muted-foreground text-sm">Receive release notes and deployment credentials at launch.</p>
    <div className="flex flex-col gap-3">
      <input className="w-full px-4 py-3 bg-muted/50 border rounded-xl outline-none focus:border-primary transition-colors text-sm" placeholder="Email address" />
      <button className="w-full py-3 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm">Request Access</button>
    </div>
    <p className="text-xs text-muted-foreground">Release announcements delivered via monthly digest.</p>
  </div>
)

export const PricingToggle = () => (
  <div className="flex items-center justify-center gap-3">
    <span className="font-medium text-sm">Monthly</span>
    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute top-1 left-7 w-4 h-4 bg-background rounded-full transition-all" /></div>
    <span className="font-medium text-sm">Annually <span className="text-success text-xs font-semibold bg-success/10 px-1.5 py-0.5 rounded ml-1">Save 20%</span></span>
  </div>
)

export const FeatureShowcase = () => (
  <div className="flex items-center gap-8 bg-card border rounded-2xl p-6 overflow-hidden">
    <div className="flex-1 space-y-4">
      <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
      <h3 className="text-2xl font-bold">Encrypted Storage</h3>
      <p className="text-muted-foreground">End-to-end cryptographic verification applied to all persistent volumes.</p>
      <button className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">Documentation <ArrowRight className="w-4 h-4" /></button>
    </div>
    <div className="flex-1 h-48 bg-muted rounded-xl border flex items-center justify-center font-mono text-muted-foreground text-sm">Architecture Preview</div>
  </div>
)

export const TrustBanner = () => (
  <div className="py-8 text-center border-y bg-muted/20">
    <p className="text-xs font-semibold text-muted-foreground mb-6 uppercase tracking-wider">Verified Compatibility</p>
    <div className="flex justify-center gap-8 flex-wrap opacity-70">
      <div className="font-bold text-sm tracking-wider">REACT</div>
      <div className="font-bold text-sm tracking-wider">TYPESCRIPT</div>
      <div className="font-bold text-sm tracking-wider">TAILWIND</div>
      <div className="font-bold text-sm tracking-wider">POSTGRESQL</div>
    </div>
  </div>
)

export const ComparisonTableMock = () => (
  <div className="w-full border rounded-2xl bg-card overflow-hidden shadow-sm">
    <div className="grid grid-cols-3 bg-muted/50 p-4 border-b font-semibold text-center">
      <div className="text-left">Feature</div>
      <div className="text-muted-foreground">Standard</div>
      <div className="text-primary">Pro</div>
    </div>
    <div className="divide-y text-sm">
      {['State synchronization', 'Hardware encryption', 'Role-based access'].map((f, i) => (
        <div key={i} className="grid grid-cols-3 p-4 items-center text-center">
          <div className="text-left font-medium">{f}</div>
          <div className="flex justify-center">
            {i === 0 ? <Check className="w-4 h-4 text-muted-foreground/60" /> : <X className="w-4 h-4 text-muted-foreground/30" />}
          </div>
          <div className="flex justify-center">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const AnimatedHeroText = () => (
  <h1 className="text-4xl md:text-6xl font-bold text-center leading-tight tracking-tight">
    Build scalable <br/>
    <span className="text-foreground">production interfaces.</span>
  </h1>
)

export const StatCounter = () => (
  <div className="grid grid-cols-3 gap-4 border-y py-8 text-center bg-card">
    <div>
      <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">99.9%</div>
      <div className="text-xs text-muted-foreground font-mono">Uptime (30 days)</div>
    </div>
    <div>
      <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">14ms</div>
      <div className="text-xs text-muted-foreground font-mono">Average latency</div>
    </div>
    <div>
      <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">48</div>
      <div className="text-xs text-muted-foreground font-mono">Platform integrations</div>
    </div>
  </div>
)

export const NewsletterSignup = () => (
  <div className="bg-card border text-card-foreground p-8 md:p-12 rounded-3xl text-center md:text-left flex flex-col md:flex-row items-center gap-8 justify-between shadow-sm">
    <div className="max-w-md">
      <h2 className="text-2xl font-bold mb-2">Subscribe to engineering updates</h2>
      <p className="text-sm text-muted-foreground">Receive technical releases, security advisories, and architecture writeups.</p>
    </div>
    <div className="w-full max-w-sm flex flex-col gap-2">
      <div className="flex gap-2">
        <input className="flex-1 px-4 py-2.5 rounded-xl border bg-background text-sm text-foreground outline-none focus:border-primary" placeholder="Enter your email" />
        <button className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">Subscribe</button>
      </div>
      <p className="text-xs text-muted-foreground text-center md:text-left">No tracking cookies. Unsubscribe at any time.</p>
    </div>
  </div>
)

export const VideoModalVisual = () => (
  <div className="relative w-full max-w-2xl mx-auto aspect-video bg-muted rounded-2xl overflow-hidden shadow-md group cursor-pointer border">
    <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-14 h-14 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-105 transition-transform border shadow-sm">
        <Play className="w-5 h-5 text-foreground ml-0.5" />
      </div>
    </div>
    <div className="absolute bottom-4 left-4">
      <h4 className="font-semibold text-sm">System Walkthrough</h4>
      <p className="text-xs text-muted-foreground">2 mins</p>
    </div>
  </div>
)

export const GradientCTABlock = () => (
  <div className="relative p-12 rounded-3xl overflow-hidden border shadow-sm text-center bg-card">
    <div className="relative z-10 max-w-lg mx-auto space-y-5">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Deploy your project</h2>
      <p className="text-sm text-muted-foreground">Initialize your repository with our command line utility.</p>
      <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-xs hover:bg-primary/90 transition-all text-sm">Install Components</button>
    </div>
  </div>
)
