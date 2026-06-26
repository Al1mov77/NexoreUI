"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { Button } from "nexoreui";

// --- Mock Components for Cookie Section ---

export function CookieBanner({ onAccept, onDecline, onSettings, position = "bottom", variant = "default" }: any) {
  return (
    <div className={`p-4 border border-border bg-background/95 backdrop-blur shadow-lg rounded-xl flex flex-col sm:flex-row gap-4 items-center justify-between w-full ${variant === 'minimal' ? 'max-w-md' : 'max-w-4xl'}`}>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground">We value your privacy</h4>
        <p className="text-sm text-muted-foreground mt-1 text-xs">
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        {onSettings && <Button variant="outline" size="sm" onClick={onSettings}>Settings</Button>}
        {onDecline && <Button variant="ghost" size="sm" onClick={onDecline}>Decline</Button>}
        <Button size="sm" onClick={onAccept}>Accept All</Button>
      </div>
    </div>
  );
}

export function CookieSettings({ onAccept, onDecline }: any) {
  return (
    <div className="p-6 border border-border bg-background rounded-xl w-full max-w-lg shadow-2xl space-y-4">
      <h3 className="text-lg font-bold">Cookie Preferences</h3>
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm">Essential Cookies</h4>
            <p className="text-xs text-muted-foreground">Required for the website to function.</p>
          </div>
          <div className="w-8 h-4 bg-primary rounded-full relative opacity-50"><div className="w-4 h-4 bg-white rounded-full absolute right-0"></div></div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm">Analytics Cookies</h4>
            <p className="text-xs text-muted-foreground">Help us improve our website.</p>
          </div>
          <div className="w-8 h-4 bg-primary rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-0"></div></div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm">Marketing Cookies</h4>
            <p className="text-xs text-muted-foreground">Used for targeted advertising.</p>
          </div>
          <div className="w-8 h-4 bg-muted rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute left-0 shadow"></div></div>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onDecline}>Reject Non-Essential</Button>
        <Button onClick={onAccept}>Save Preferences</Button>
      </div>
    </div>
  );
}

export function CookieToast({ onAccept, position = "bottom-right" }: any) {
  return (
    <div className="p-3 border border-border bg-card rounded-lg shadow-md flex items-center gap-3 w-max">
      <span className="text-sm">🍪 We use cookies!</span>
      <Button size="sm" variant="secondary" onClick={onAccept}>Got it</Button>
    </div>
  );
}

// --- End Mock Components ---

const variants = [
  {
    name: "Standard Banner (Bottom)",
    component: <CookieBanner onAccept={() => {}} onDecline={() => {}} onSettings={() => {}} position="bottom" variant="default" />,
    code: `<CookieBanner \n  onAccept={handleAccept} \n  onDecline={handleDecline} \n  onSettings={handleSettings} \n  position="bottom" \n  variant="default" \n/>`
  },
  {
    name: "Minimal Banner",
    component: <CookieBanner onAccept={() => {}} onDecline={() => {}} position="bottom" variant="minimal" />,
    code: `<CookieBanner \n  onAccept={handleAccept} \n  onDecline={handleDecline} \n  variant="minimal" \n/>`
  },
  {
    name: "Top Banner",
    component: <CookieBanner onAccept={() => {}} position="top" variant="default" />,
    code: `<CookieBanner \n  onAccept={handleAccept} \n  position="top" \n/>`
  },
  {
    name: "Cookie Settings Modal",
    component: <CookieSettings onAccept={() => {}} onDecline={() => {}} />,
    code: `<CookieSettings \n  onAccept={savePreferences} \n  onDecline={rejectAll} \n/>`
  },
  {
    name: "Cookie Toast Notification",
    component: <CookieToast onAccept={() => {}} position="bottom-right" />,
    code: `<CookieToast \n  onAccept={dismiss} \n  position="bottom-right" \n/>`
  },
  {
    name: "Banner without Decline",
    component: <CookieBanner onAccept={() => {}} onSettings={() => {}} variant="default" />,
    code: `<CookieBanner \n  onAccept={handleAccept} \n  onSettings={openSettings} \n/>`
  },
  {
    name: "Toast (Bottom Left)",
    component: <CookieToast onAccept={() => {}} position="bottom-left" />,
    code: `<CookieToast \n  onAccept={dismiss} \n  position="bottom-left" \n/>`
  },
  {
    name: "Minimal Banner with Settings",
    component: <CookieBanner onAccept={() => {}} onSettings={() => {}} variant="minimal" />,
    code: `<CookieBanner \n  onAccept={handleAccept} \n  onSettings={handleSettings} \n  variant="minimal" \n/>`
  },
  {
    name: "Banner Auto-Hide (Mock)",
    component: <CookieBanner onAccept={() => {}} variant="default" />,
    code: `<CookieBanner \n  onAccept={handleAccept} \n  autoHideDuration={5000} \n/>`
  },
  {
    name: "Dark Themed Banner",
    component: <div className="dark"><CookieBanner onAccept={() => {}} variant="default" /></div>,
    code: `<CookieBanner \n  onAccept={handleAccept} \n  theme="dark" \n/>`
  }
];

const bannerPropsData = [
  { name: "onAccept", type: "() => void", defaultValue: "—", description: "Fired when user accepts all tracking policies.", required: true },
  { name: "onDecline", type: "() => void", defaultValue: "—", description: "Fired when user declines policy.", required: false },
  { name: "onSettings", type: "() => void", defaultValue: "—", description: "Fired when user triggers custom settings preference dial.", required: false },
  { name: "position", type: '"top" | "bottom"', defaultValue: '"bottom"', description: "Controls layout placement on viewport.", required: false },
  { name: "variant", type: '"default" | "minimal"', defaultValue: '"default"', description: "The preset layout style constraint.", required: false },
];

const settingsPropsData = [
  { name: "onAccept", type: "() => void", defaultValue: "—", description: "Fired when user accepts customized tracking categories.", required: true },
  { name: "onDecline", type: "() => void", defaultValue: "—", description: "Fired when user rejects optional analytics cookies.", required: true },
];

export function CookieSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="cookie" className="space-y-10 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cookie Management</h2>
          <p className="text-muted-foreground mt-1">Cookie banners, settings, and toasts for privacy compliance.</p>
        </div>
      </div>

      {/* When to use guide */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
        <h3 className="text-sm font-semibold">When to use</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            ["standard banner", "Fulfilling GDPR and CCPA tracking banner rules upon initial site visits"],
            ["minimal banner", "Compact footers or subpages requesting user tracking permission with minimal noise"],
            ["cookie settings", "Providing users granular checkbox categories to toggle optional analytics or marketing cookies"],
            ["cookie toast", "Simple privacy notices notifying that cookies are used, requiring basic acknowledgment"],
          ].map(([variant, desc]) => (
            <div key={variant} className="flex gap-2">
              <code className="text-primary font-mono text-[10px] shrink-0 mt-0.5">{variant}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background/50 p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}

      {/* Props Reference Tables */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4">CookieBanner Props</h3>
          <PropsTable propsData={bannerPropsData} />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-4">CookieSettings Props</h3>
          <PropsTable propsData={settingsPropsData} />
        </div>
      </div>

      {/* Accessibility Section */}
      <div className="rounded-xl border border-border bg-muted/10 p-5 space-y-3">
        <h3 className="text-sm font-semibold">♿ Accessibility (a11y)</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          <li><strong>Keyboard Trap:</strong> Custom Cookie settings dialogs should implement modal keyboard traps to ensure blind users can configure preferences before continuing site navigation.</li>
          <li><strong>Semantic Banner:</strong> Wrap page banner components using <code className="text-primary font-mono text-[10px]">role="region"</code> and label with <code className="text-primary font-mono text-[10px]">aria-label="Cookie consent banner"</code>.</li>
        </ul>
      </div>
    </section>
  );
}
