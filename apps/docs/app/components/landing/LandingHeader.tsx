"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Github, Menu, X, ArrowRight } from "lucide-react";
import { NexoreLogo } from "../layout/NexoreLogo";

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <NexoreLogo size={24} />
          <span className="font-semibold text-sm tracking-tight text-foreground">
            Nexore<span className="text-zinc-500 font-bold">UI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-muted-foreground font-medium">
          <Link href="/pricing" className="hover:text-foreground text-foreground font-semibold transition-colors">
            Pricing & Plans
          </Link>
          <Link href="/workspace" className="hover:text-foreground transition-colors">
            Workspace
          </Link>
          <Link href="/support" className="hover:text-foreground transition-colors">
            Support
          </Link>
          <Link href="/docs/installation" className="hover:text-foreground transition-colors">
            Docs
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/Al1mov77/NexoreUI"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
            aria-label="GitHub"
          >
            <Github size={14} />
          </a>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <span>Get Pro</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-3 text-sm">
          <Link
            href="/docs/components"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-muted-foreground hover:text-foreground"
          >
            Components
          </Link>
          <Link
            href="/templates"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-muted-foreground hover:text-foreground"
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="block py-1 font-semibold text-foreground"
          >
            Pricing & Plans
          </Link>
          <Link
            href="/workspace"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-muted-foreground hover:text-foreground"
          >
            Workspace
          </Link>
          <Link
            href="/docs/installation"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-muted-foreground hover:text-foreground"
          >
            Documentation
          </Link>
          <Link
            href="/support"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-muted-foreground hover:text-foreground"
          >
            Support & Contact
          </Link>
          <Link
            href="/terms"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </Link>
          <div className="pt-2">
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium"
            >
              Get Pro ($39)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
