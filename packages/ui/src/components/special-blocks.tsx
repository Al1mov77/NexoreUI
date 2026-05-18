"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"
import { Button } from "./button"

// 1. HeroSection
export const HeroSection = ({ title, subtitle, ctaText }: any) => (
  <section className="py-24 flex flex-col items-center text-center space-y-6">
    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">{title}</h1>
    <p className="text-xl text-muted-foreground max-w-2xl">{subtitle}</p>
    <Button size="lg" className="h-12 px-8 text-lg">{ctaText}</Button>
  </section>
)

// 2. FeatureGrid
export const FeatureGrid = ({ features }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
    {features?.map((f: any, i: number) => (
      <div key={i} className="flex flex-col items-start p-6 bg-card border rounded-2xl">
        <div className="p-3 bg-primary/10 rounded-lg mb-4 text-primary">{f.icon}</div>
        <h3 className="text-xl font-bold mb-2">{f.title}</h3>
        <p className="text-muted-foreground">{f.description}</p>
      </div>
    ))}
  </div>
)

// 3. SimpleFooter
export const SimpleFooter = ({ text }: any) => (
  <footer className="py-6 border-t text-center text-muted-foreground text-sm">
    <p>{text}</p>
  </footer>
)

// 4. NewsletterBlock
export const NewsletterBlock = () => (
  <div className="p-12 bg-muted rounded-3xl flex flex-col items-center text-center space-y-6">
    <h2 className="text-3xl font-bold">Subscribe to our newsletter</h2>
    <p className="text-muted-foreground">Get the latest updates directly to your inbox.</p>
    <div className="flex w-full max-w-md gap-2">
      <input type="email" placeholder="Enter your email" className="flex-1 rounded-md border bg-background px-3 py-2 text-sm" />
      <Button>Subscribe</Button>
    </div>
  </div>
)

// 5. TestimonialCard
export const TestimonialCard = ({ quote, author, role }: any) => (
  <div className="p-6 bg-card border rounded-xl space-y-4">
    <p className="text-lg italic">"{quote}"</p>
    <div>
      <p className="font-bold">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </div>
)

// 6. FaqAccordion (Block wrapper)
export const FaqBlock = ({ faqs }: any) => (
  <div className="max-w-3xl mx-auto py-12 space-y-4">
    <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
    {faqs?.map((faq: any, i: number) => (
      <details key={i} className="group border rounded-lg bg-card [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
          {faq.q}
          <span className="transition group-open:rotate-180">
            <svg fill="none" height="24" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </summary>
        <p className="group-open:animate-fadeIn p-4 pt-0 text-muted-foreground">{faq.a}</p>
      </details>
    ))}
  </div>
)

// 7. CtaBlock
export const CtaBlock = ({ title, buttonText }: any) => (
  <div className="py-16 px-8 bg-primary text-primary-foreground rounded-3xl text-center space-y-6">
    <h2 className="text-3xl font-bold">{title}</h2>
    <Button variant="secondary" size="lg">{buttonText}</Button>
  </div>
)

// 8. LogoCloud
export const LogoCloud = ({ title, logos }: any) => (
  <div className="py-12 border-y">
    <p className="text-center text-sm font-medium text-muted-foreground mb-8">{title}</p>
    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
      {logos?.map((l: any, i: number) => <span key={i} className="text-xl font-bold">{l}</span>)}
    </div>
  </div>
)

// 9. PricingTableSimple
export const PricingTableSimple = ({ plans }: any) => (
  <div className="grid md:grid-cols-2 gap-8 py-12 max-w-4xl mx-auto">
    {plans?.map((p: any, i: number) => (
      <div key={i} className={cn("p-8 rounded-3xl border", p.popular ? "border-primary shadow-lg" : "bg-card")}>
        <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
        <p className="text-4xl font-extrabold mb-6">${p.price}<span className="text-lg text-muted-foreground font-normal">/mo</span></p>
        <ul className="space-y-3 mb-8">
          {p.features?.map((f: string, j: number) => <li key={j} className="flex items-center gap-2">✓ {f}</li>)}
        </ul>
        <Button className="w-full" variant={p.popular ? "default" : "outline"}>Choose Plan</Button>
      </div>
    ))}
  </div>
)

// 10. ContactFormBlock
export const ContactFormBlock = () => (
  <form className="max-w-md mx-auto p-6 border rounded-2xl bg-card space-y-4">
    <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
    <input placeholder="Name" className="w-full rounded-md border p-2 bg-background" />
    <input placeholder="Email" type="email" className="w-full rounded-md border p-2 bg-background" />
    <textarea placeholder="Message" className="w-full rounded-md border p-2 bg-background min-h-[100px]" />
    <Button className="w-full">Send Message</Button>
  </form>
)
