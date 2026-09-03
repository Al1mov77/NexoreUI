"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { Button } from "nexoreui";
import { ShieldCheck, Cookie, Sparkles, Terminal, Settings2 } from "lucide-react";
import { cn } from "nexoreui";

export function CookieBanner({
  title = "We value your privacy",
  description = "We use cookies to enhance your browsing experience, serve personalized content, and analyze web traffic.",
  onAccept,
  onDecline,
  onSettings,
  position = "bottom",
  variant = "default",
  showDecline = true,
  showSettings = true,
  className,
}: any) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
        <span>Banner dismissed.</span>
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="text-primary underline font-medium cursor-pointer"
        >
          Reset preview
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-5 border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full transition-all duration-300",
        variant === "minimal" ? "max-w-md" : "max-w-3xl",
        className
      )}
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        {showSettings && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onSettings?.();
              alert("Cookie preferences opened");
            }}
          >
            Preferences
          </Button>
        )}
        {showDecline && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDecline?.();
              setVisible(false);
            }}
          >
            Decline
          </Button>
        )}
        <Button
          size="sm"
          onClick={() => {
            onAccept?.();
            setVisible(false);
          }}
        >
          Accept All
        </Button>
      </div>
    </div>
  );
}

export function CookieSettings({ onAccept, onDecline }: any) {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="p-6 border border-border bg-card/95 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl space-y-5">
      <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h3 className="text-base font-bold text-foreground">Cookie Preferences</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-xs text-foreground">Essential System Cookies</h4>
            <p className="text-[11px] text-muted-foreground">Required for authentication and security.</p>
          </div>
          <span className="text-[10px] font-mono font-semibold text-muted-foreground px-2 py-0.5 rounded bg-muted/60">
            Always Active
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-xs text-foreground">Analytics & Telemetry</h4>
            <p className="text-[11px] text-muted-foreground">Helps optimize application performance.</p>
          </div>
          <button
            type="button"
            onClick={() => setAnalytics(!analytics)}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
              analytics ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.25 ${
                analytics ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-xs text-foreground">Marketing & Personalization</h4>
            <p className="text-[11px] text-muted-foreground">Customizes offers and campaign insights.</p>
          </div>
          <button
            type="button"
            onClick={() => setMarketing(!marketing)}
            className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
              marketing ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.25 ${
                marketing ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t border-border/60">
        <Button variant="outline" size="sm" onClick={onDecline}>
          Reject Non-Essential
        </Button>
        <Button size="sm" onClick={onAccept}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

export function CookieToast({ onAccept }: any) {
  return (
    <div className="p-3.5 border border-border/80 bg-card/95 backdrop-blur-md rounded-xl shadow-xl flex items-center gap-3 w-max">
      <span className="text-xs font-medium text-foreground">🍪 We use cookies to improve experience</span>
      <Button size="sm" variant="secondary" onClick={onAccept}>
        Got it
      </Button>
    </div>
  );
}

export function CookieSection() {
  const [playVariant, setPlayVariant] = useState<"default" | "minimal">("default");
  const [playTitle, setPlayTitle] = useState("We value your privacy");
  const [playShowDecline, setPlayShowDecline] = useState(true);
  const [playShowSettings, setPlayShowSettings] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const generateLiveCode = () => {
    return `import { CookieBanner } from "nexoreui";

export default function CookieDemo() {
  return (
    <CookieBanner
      title="${playTitle}"
      variant="${playVariant}"
      showDecline={${playShowDecline}}
      showSettings={${playShowSettings}}
      onAccept={() => console.log("Accepted")}
      onDecline={() => console.log("Declined")}
      onSettings={() => console.log("Settings")}
    />
  );
}`;
  };

  const propsData = [
    {
      name: "title",
      type: "string",
      defaultValue: '"We value your privacy"',
      description: "Header text rendered in the cookie compliance banner.",
      required: false,
    },
    {
      name: "variant",
      type: '"default" | "minimal"',
      defaultValue: '"default"',
      description: "Visual sizing constraint (standard wide or compact container).",
      required: false,
    },
    {
      name: "showDecline",
      type: "boolean",
      defaultValue: "true",
      description: "Controls display of the secondary decline button.",
      required: false,
    },
    {
      name: "showSettings",
      type: "boolean",
      defaultValue: "true",
      description: "Controls display of the granular preferences trigger button.",
      required: false,
    },
    {
      name: "onAccept",
      type: "() => void",
      defaultValue: "—",
      description: "Callback triggered when user accepts all tracking policies.",
      required: true,
    },
  ];

  const examples = [
    {
      name: "1. Comprehensive Full-Width Compliance Banner",
      component: (
        <CookieBanner
          title="Privacy & Data Transparency"
          description="We use first-party cookies for essential functionality and anonymized telemetry."
          onAccept={() => {}}
          onDecline={() => {}}
          onSettings={() => {}}
          variant="default"
        />
      ),
      code: `<CookieBanner
  title="Privacy & Data Transparency"
  onAccept={handleAccept}
  onDecline={handleDecline}
  onSettings={openSettings}
/>`,
    },
    {
      name: "2. Compact Floating Minimalist Cookie Pill",
      component: (
        <CookieBanner
          title="Cookies Policy"
          description="We use cookies to improve experience."
          variant="minimal"
          showSettings={false}
          onAccept={() => {}}
          onDecline={() => {}}
        />
      ),
      code: `<CookieBanner
  variant="minimal"
  showSettings={false}
  onAccept={handleAccept}
/>`,
    },
    {
      name: "3. Granular Category Preferences Modal",
      component: <CookieSettings onAccept={() => alert("Preferences saved")} onDecline={() => alert("Non-essential rejected")} />,
      code: `<CookieSettings
  onAccept={savePreferences}
  onDecline={rejectNonEssential}
/>`,
    },
    {
      name: "4. Floating Micro Toast Notification",
      component: <CookieToast onAccept={() => alert("Acknowledged")} />,
      code: `<CookieToast onAccept={dismiss} />`,
    },
  ];

  const itemsPerPage = 2;
  const totalPages = Math.ceil(examples.length / itemsPerPage);
  const visibleItems = examples.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="cookie" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pro Suites — Privacy & Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Cookie Consent Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          GDPR & CCPA ready cookie compliance modules. Includes floating notification toasts,
          comprehensive bottom banners, and granular preferences dialogue modals.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border text-xs font-mono w-fit mt-3">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">npx nexoreui-cli add cookie</span>
        </div>
      </div>

      {/* Interactive Live Playground */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Interactive Live Playground
          </h2>
          <span className="text-xs text-muted-foreground font-mono">Live Consent Engine</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Live Preview Box */}
          <div className="xl:col-span-2 min-h-[280px] flex items-center justify-center p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-md relative overflow-hidden">
            <CookieBanner
              title={playTitle}
              variant={playVariant}
              showDecline={playShowDecline}
              showSettings={playShowSettings}
              onAccept={() => {}}
              onDecline={() => {}}
            />
          </div>

          {/* Controls Panel */}
          <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Configure Props
            </h3>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Banner Title</label>
              <input
                type="text"
                value={playTitle}
                onChange={(e) => setPlayTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            {/* Variant selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Variant Style</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["default", "minimal"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setPlayVariant(v)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                      playVariant === v
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Decline toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs font-medium text-foreground">Decline Button</label>
              <button
                type="button"
                onClick={() => setPlayShowDecline(!playShowDecline)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  playShowDecline ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.75 ${
                    playShowDecline ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Settings toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs font-medium text-foreground">Preferences Button</label>
              <button
                type="button"
                onClick={() => setPlayShowSettings(!playShowSettings)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  playShowSettings ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.75 ${
                    playShowSettings ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Live Generated Code */}
        <div className="pt-2">
          <ComponentSource sourceCode={generateLiveCode()} />
        </div>
      </div>

      {/* Props Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Props Reference</h2>
        <PropsTable propsData={propsData} />
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Usage Examples</h2>
          <span className="text-xs text-muted-foreground font-mono">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="space-y-8">
          {visibleItems.map((ex, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{ex.name}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div className="min-h-[180px] flex items-center justify-center p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-md">
                  {ex.component}
                </div>
                <ComponentSource sourceCode={ex.code} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CookieSection;
