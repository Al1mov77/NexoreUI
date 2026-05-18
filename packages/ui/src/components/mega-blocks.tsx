"use client"

import * as React from "react"
import { CheckCircle2, ChevronRight, Mail, Phone, MapPin } from "lucide-react"

// 1. FeatureGridX
export const FeatureGridX = () => (
  <div className="grid md:grid-cols-3 gap-8 py-12">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex flex-col items-center text-center p-6 border rounded-2xl bg-card hover:shadow-lg transition-shadow">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4"><CheckCircle2 /></div>
        <h3 className="text-xl font-bold mb-2">Feature {i}</h3>
        <p className="text-muted-foreground text-sm">Amazing feature description that explains the value proposition clearly to the user.</p>
      </div>
    ))}
  </div>
)

// 2. HeroSectionX
export const HeroSectionX = () => (
  <div className="text-center py-20 px-4 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-primary/5 border my-12">
    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 inline-block">New Version 2.0</span>
    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">Build Faster. <span className="text-primary">Scale Better.</span></h1>
    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">The ultimate UI kit for modern startups and forward-thinking developers.</p>
    <div className="flex justify-center gap-4">
      <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full shadow-xl hover:scale-105 transition-transform">Start Building Free</button>
      <button className="px-8 py-4 bg-background border font-bold rounded-full hover:bg-muted transition-colors">Book Demo</button>
    </div>
  </div>
)

// 3. FaqAccordionX (Visual)
export const FaqAccordionX = () => (
  <div className="max-w-3xl mx-auto py-12 space-y-4">
    <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
    {[1, 2, 3].map(i => (
      <div key={i} className="border rounded-xl p-5 bg-card">
        <div className="flex justify-between items-center font-bold"><span>Question {i}?</span><ChevronRight className="w-5 h-5" /></div>
        {i === 1 && <p className="text-muted-foreground mt-2 text-sm">Yes, you can use it in commercial projects without attribution.</p>}
      </div>
    ))}
  </div>
)

// 4. TeamSectionX
export const TeamSectionX = () => (
  <div className="py-12">
    <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-muted mb-4 border-4 border-background shadow-lg" />
          <h3 className="font-bold">Member {i}</h3>
          <p className="text-sm text-primary">Position</p>
        </div>
      ))}
    </div>
  </div>
)

// 5. LogoCloudX
export const LogoCloudX = () => (
  <div className="py-12 border-y bg-muted/30 my-12">
    <p className="text-center text-sm font-medium text-muted-foreground mb-8">TRUSTED BY INNOVATIVE TEAMS</p>
    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="text-xl font-bold uppercase tracking-widest">Logo{i}</div>)}
    </div>
  </div>
)

// 6. CTASectionX
export const CTASectionX = () => (
  <div className="bg-primary text-primary-foreground rounded-3xl p-12 text-center my-12 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <h2 className="text-4xl font-bold mb-4 relative z-10">Ready to transform your workflow?</h2>
    <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8 relative z-10">Join thousands of developers building better applications faster.</p>
    <button className="bg-background text-foreground px-8 py-4 rounded-full font-bold relative z-10 hover:scale-105 transition-transform shadow-2xl">Get Started Now</button>
  </div>
)

// 7. ContactFormX
export const ContactFormX = () => (
  <div className="grid md:grid-cols-2 gap-12 py-12">
    <div>
      <h2 className="text-3xl font-bold mb-4">Get in touch</h2>
      <p className="text-muted-foreground mb-8">Fill out the form and our team will get back to you within 24 hours.</p>
      <div className="space-y-4">
        <div className="flex items-center gap-3"><Mail className="text-primary w-5 h-5" /><span>hello@example.com</span></div>
        <div className="flex items-center gap-3"><Phone className="text-primary w-5 h-5" /><span>+1 (555) 000-0000</span></div>
        <div className="flex items-center gap-3"><MapPin className="text-primary w-5 h-5" /><span>123 Innovation Drive, NY</span></div>
      </div>
    </div>
    <div className="bg-card p-6 border rounded-2xl flex flex-col gap-4">
      <input placeholder="Name" className="p-3 bg-background border rounded-lg" />
      <input placeholder="Email" className="p-3 bg-background border rounded-lg" />
      <textarea placeholder="Message" className="p-3 bg-background border rounded-lg h-32" />
      <button className="bg-primary text-primary-foreground p-3 rounded-lg font-bold">Send Message</button>
    </div>
  </div>
)

// 8. PricingCardsX
export const PricingCardsX = () => (
  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto py-12">
    <div className="p-8 border rounded-3xl bg-card">
      <h3 className="text-2xl font-bold mb-2">Starter</h3>
      <p className="text-muted-foreground mb-6">Perfect for side projects.</p>
      <div className="text-4xl font-bold mb-8">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
      <button className="w-full py-3 bg-muted font-bold rounded-xl mb-6">Start Free</button>
      <ul className="space-y-3 text-sm"><li>✓ 1 Project</li><li>✓ Basic Support</li></ul>
    </div>
    <div className="p-8 border-2 border-primary rounded-3xl bg-primary/5 relative">
      <span className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">PRO</span>
      <h3 className="text-2xl font-bold mb-2">Professional</h3>
      <p className="text-muted-foreground mb-6">For serious developers.</p>
      <div className="text-4xl font-bold mb-8">$29<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
      <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl mb-6 shadow-xl">Subscribe</button>
      <ul className="space-y-3 text-sm"><li>✓ Unlimited Projects</li><li>✓ Priority Support</li><li>✓ Advanced Analytics</li></ul>
    </div>
  </div>
)

// 9. TestimonialSliderX (Visual)
export const TestimonialSliderX = () => (
  <div className="py-16 text-center max-w-3xl mx-auto">
    <div className="text-6xl text-primary/20 font-serif mb-4">"</div>
    <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">This is the best UI library I have ever used. It completely transformed how my team builds web applications.</p>
    <div className="flex items-center justify-center gap-4">
      <div className="w-12 h-12 bg-muted rounded-full" />
      <div className="text-left">
        <div className="font-bold">Sarah Jenkins</div>
        <div className="text-sm text-muted-foreground">CTO at TechFlow</div>
      </div>
    </div>
    <div className="flex justify-center gap-2 mt-8">
      <div className="w-2 h-2 bg-primary rounded-full" /><div className="w-2 h-2 bg-muted rounded-full" /><div className="w-2 h-2 bg-muted rounded-full" />
    </div>
  </div>
)

// 10. FooterX
export const FooterX = () => (
  <footer className="border-t pt-16 pb-8 mt-12">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <div className="col-span-2 md:col-span-1">
        <div className="font-bold text-xl mb-4">NexoreUI</div>
        <p className="text-muted-foreground text-sm">Building the future of web interfaces, one component at a time.</p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Product</h4>
        <ul className="space-y-2 text-sm text-muted-foreground"><li>Features</li><li>Pricing</li><li>Changelog</li></ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Resources</h4>
        <ul className="space-y-2 text-sm text-muted-foreground"><li>Documentation</li><li>Blog</li><li>Community</li></ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Legal</h4>
        <ul className="space-y-2 text-sm text-muted-foreground"><li>Privacy</li><li>Terms</li></ul>
      </div>
    </div>
    <div className="text-center text-sm text-muted-foreground border-t pt-8">© 2026 NexoreUI. All rights reserved.</div>
  </footer>
)
