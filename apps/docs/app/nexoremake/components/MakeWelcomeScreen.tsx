'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { nexoreTemplates, Template } from '../templates';
import {
  Layers,
  MousePointer2,
  LayoutTemplate,
  BarChart3,
  ShoppingBag,
  Users,
  Component,
  FileText,
  Compass,
  Maximize2,
  Search,
  Lock,
  ArrowRight,
  X,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { TemplatePreview } from './ElementRenderer';

interface MakeWelcomeScreenProps {
  onSelectTemplate: (template: Template) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Landing': <LayoutTemplate className="w-4 h-4" />,
  'Dashboard': <BarChart3 className="w-4 h-4" />,
  'E-commerce': <ShoppingBag className="w-4 h-4" />,
  'Social': <Users className="w-4 h-4" />,
  'Sections': <Component className="w-4 h-4" />,
  'Forms': <FileText className="w-4 h-4" />,
  'Cards': <Layers className="w-4 h-4" />,
  'Navigation': <Compass className="w-4 h-4" />,
  'Overlays': <Maximize2 className="w-4 h-4" />,
};

export default function MakeWelcomeScreen({ onSelectTemplate }: MakeWelcomeScreenProps) {
  const [leaving, setLeaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasProLicense, setHasProLicense] = useState(false);
  const [pendingProTemplate, setPendingProTemplate] = useState<Template | null>(null);
  const [licenseInput, setLicenseInput] = useState('');
  const [licenseError, setLicenseError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nexore_pro_license');
      if (stored && stored.trim().length > 0) {
        setHasProLicense(true);
      }
    }
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    nexoreTemplates.forEach((t) => set.add(t.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredTemplates = useMemo(() => {
    return nexoreTemplates.filter((t) => {
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
      const matchTier =
        tierFilter === 'all' ||
        (tierFilter === 'pro' && t.tier === 'pro') ||
        (tierFilter === 'free' && t.tier !== 'pro');
      const matchQuery =
        searchQuery.trim().length === 0 ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchTier && matchQuery;
    });
  }, [selectedCategory, tierFilter, searchQuery]);

  const handleSelect = (template: Template) => {
    if (template.tier === 'pro' && !hasProLicense) {
      setPendingProTemplate(template);
      setLicenseError(null);
      return;
    }
    executeSelect(template);
  };

  const executeSelect = (template: Template) => {
    setSelectedId(template.id);
    setLeaving(true);
    setTimeout(() => onSelectTemplate(template), 350);
  };

  const handleActivateLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseInput.trim()) {
      setLicenseError('Please enter a valid license key.');
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexore_pro_license', licenseInput.trim());
    }
    setHasProLicense(true);
    const target = pendingProTemplate;
    setPendingProTemplate(null);
    if (target) {
      executeSelect(target);
    }
  };

  return (
    <div
      className={`absolute inset-0 z-10 overflow-y-auto welcome-scroll transition-all duration-300 ${
        leaving ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'
      }`}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .welcome-scroll::-webkit-scrollbar {
          display: none;
        }
      `,
        }}
      />
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'var(--make-bg, #09090b)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.12,
            backgroundImage:
              'radial-gradient(circle, var(--make-grid-dot, #27272a) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full min-h-full flex flex-col items-center py-12 px-6">
        <div className="text-center mb-8 max-w-2xl">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="p-2.5 rounded-xl bg-card border border-border">
              <LayoutTemplate className="w-5 h-5 text-foreground" />
            </div>
          </div>

          <h1
            className="text-2xl md:text-3xl font-semibold tracking-tight mb-2 leading-tight"
            style={{ color: 'var(--make-text, #fafafa)' }}
          >
            Nexore Make Studio
          </h1>
          <p
            className="text-xs md:text-sm max-w-lg mx-auto leading-relaxed"
            style={{ color: 'var(--make-text-muted, #a1a1aa)' }}
          >
            Structured canvas editor for production Next.js interfaces. Start from a
            vetted template or build from scratch.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="w-full max-w-5xl mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--make-text-muted, #71717a)' }}
              />
              <input
                type="text"
                placeholder="Search templates by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-ring"
                style={{
                  backgroundColor: 'var(--make-surface, #18181b)',
                  borderColor: 'var(--make-border, #27272a)',
                  color: 'var(--make-text, #fafafa)',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tier switcher */}
            <div
              className="inline-flex items-center rounded-lg p-0.5 border self-start sm:self-auto"
              style={{
                backgroundColor: 'var(--make-surface, #18181b)',
                borderColor: 'var(--make-border, #27272a)',
              }}
            >
              {(['all', 'free', 'pro'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors uppercase tracking-wider ${
                    tierFilter === tier
                      ? 'bg-foreground text-background font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => {
              const icon = categoryIcons[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors border ${
                    isSelected
                      ? 'border-foreground/40 bg-foreground/10 text-foreground font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  {icon}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full">
          {filteredTemplates.map((template) => {
            const isPro = template.tier === 'pro';
            return (
              <div
                key={template.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (!leaving) handleSelect(template);
                }}
                onKeyDown={(e) => {
                  if (!leaving && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleSelect(template);
                  }
                }}
                className={`group text-left rounded-xl border transition-all duration-200 cursor-pointer flex flex-col overflow-hidden relative ${
                  selectedId === template.id
                    ? 'border-primary ring-1 ring-primary'
                    : 'hover:border-foreground/30'
                }`}
                style={{
                  backgroundColor: 'var(--make-header-bg, #09090b)',
                  borderColor:
                    selectedId === template.id
                      ? undefined
                      : 'var(--make-border, #27272a)',
                }}
              >
                {/* Preview area */}
                <div
                  className="relative h-32 w-full overflow-hidden border-b"
                  style={{ borderColor: 'var(--make-border, #27272a)' }}
                >
                  <div className="absolute inset-0 p-2.5">
                    <TemplatePreview
                      elements={template.elements}
                      canvasSettings={template.canvasSettings}
                      containerW={280}
                      containerH={110}
                    />
                  </div>
                  {isPro && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-foreground text-background text-[10px] font-mono font-semibold tracking-wider">
                      <Lock className="w-2.5 h-2.5" />
                      <span>PRO</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="p-1.5 rounded-md border text-muted-foreground group-hover:text-foreground transition-colors"
                      style={{
                        backgroundColor: 'var(--make-surface, #18181b)',
                        borderColor: 'var(--make-border, #27272a)',
                      }}
                    >
                      {categoryIcons[template.category] || <Layers className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2
                          className="text-xs font-semibold truncate group-hover:text-foreground transition-colors"
                          style={{ color: 'var(--make-text, #fafafa)' }}
                        >
                          {template.name}
                        </h2>
                      </div>
                      <span
                        className="text-[10px] font-mono uppercase tracking-wider block"
                        style={{ color: 'var(--make-text-muted, #71717a)' }}
                      >
                        {template.category}
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-[11px] leading-relaxed mb-3 flex-1 line-clamp-2"
                    style={{ color: 'var(--make-text-muted, #a1a1aa)' }}
                  >
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
                    <span className="text-muted-foreground font-mono">
                      {template.elements.length} components
                    </span>
                    <div className="flex items-center gap-1 font-medium text-foreground opacity-70 group-hover:opacity-100 transition-opacity">
                      <span>{isPro && !hasProLicense ? 'View Pro' : 'Use'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="py-16 text-center text-xs text-muted-foreground">
            No templates match your search and filter criteria.
          </div>
        )}

        {/* Bottom hint */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40 text-muted-foreground text-xs">
            <MousePointer2 className="w-3.5 h-3.5" />
            <span>Select a template or drag components from the toolbar</span>
          </div>
        </div>
      </div>

      {/* Pro Template Unlock / Preview Modal */}
      {pendingProTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-xl border p-5 shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--make-header-bg, #09090b)',
              borderColor: 'var(--make-border, #27272a)',
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-foreground text-background">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Pro Studio Template
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {pendingProTemplate.name}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingProTemplate(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {pendingProTemplate.description}. This template includes production-ready
              metrics, tokens, and multi-viewport layouts.
            </p>

            <form onSubmit={handleActivateLicense} className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  License Key
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="NX-PRO-XXXX-XXXX-XXXX"
                    value={licenseInput}
                    onChange={(e) => {
                      setLicenseInput(e.target.value);
                      setLicenseError(null);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                    style={{
                      backgroundColor: 'var(--make-surface, #18181b)',
                      borderColor: 'var(--make-border, #27272a)',
                      color: 'var(--make-text, #fafafa)',
                    }}
                  />
                </div>
                {licenseError && (
                  <p className="text-[11px] text-destructive mt-1">{licenseError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = pendingProTemplate;
                    setPendingProTemplate(null);
                    if (target) executeSelect(target);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  Preview in Editor
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90"
                >
                  Unlock with Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
