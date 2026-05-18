"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { DismissibleAlert, ToastAlertWrapper, CookieAlert, RateLimitAlert, OfflineBanner, TrustBanner, Button } from "nexoreui";

const variants = [
  {
    name: "Dismissible Alert",
    component: <div className="w-full max-w-md"><DismissibleAlert title="Success" description="Your settings have been saved successfully." variant="success" onDismiss={() => {}} /></div>,
    code: `import { DismissibleAlert } from "nexoreui"\n\n<DismissibleAlert \n  title="Success" \n  description="Settings saved." \n  variant="success" \n  onDismiss={() => {}} \n/>`
  },
  {
    name: "Toast Alert Wrapper",
    component: <div className="w-full max-w-sm"><ToastAlertWrapper><div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">✨</div><div><p className="font-medium text-sm">New Notification</p><p className="text-xs text-muted-foreground">You have 3 unread messages.</p></div></div></ToastAlertWrapper></div>,
    code: `import { ToastAlertWrapper } from "nexoreui"\n\n<ToastAlertWrapper>\n  <CustomNotificationContent />\n</ToastAlertWrapper>`
  },
  {
    name: "Cookie Alert (Legacy)",
    component: <div className="w-full max-w-md"><CookieAlert onAccept={() => {}} onLearnMore={() => {}} /></div>,
    code: `import { CookieAlert } from "nexoreui"\n\n<CookieAlert \n  onAccept={handleAccept} \n  onLearnMore={handleLearnMore} \n/>`
  },
  {
    name: "Rate Limit Alert",
    component: <div className="w-full max-w-md"><RateLimitAlert resetTime="14:32:05" limit={100} remaining={0} /></div>,
    code: `import { RateLimitAlert } from "nexoreui"\n\n<RateLimitAlert \n  resetTime="14:32:05" \n  limit={100} \n  remaining={0} \n/>`
  },
  {
    name: "Offline Banner",
    component: <div className="w-full relative h-32 border rounded-xl overflow-hidden"><OfflineBanner isOffline={true} /></div>,
    code: `import { OfflineBanner } from "nexoreui"\n\n<OfflineBanner isOffline={true} />`
  },
  {
    name: "Trust Banner",
    component: <div className="w-full"><TrustBanner message="Over 10,000 developers trust NexoreUI for their projects." /></div>,
    code: `import { TrustBanner } from "nexoreui"\n\n<TrustBanner message="Over 10,000 developers trust NexoreUI." />`
  },
  {
    name: "Action Required Alert",
    component: <div className="w-full max-w-md p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col sm:flex-row gap-4 items-center justify-between"><div className="text-red-500"><h4 className="font-semibold text-sm">Payment Failed</h4><p className="text-xs opacity-90 mt-1">Please update your payment method.</p></div><Button size="sm" variant="destructive">Update Billing</Button></div>,
    code: `// Custom Action Alert composed of existing parts\n<Alert variant="destructive">\n  <AlertTitle>Payment Failed</AlertTitle>\n  <AlertDescription className="flex justify-between items-center">\n    Please update your payment method.\n    <Button variant="outline" size="sm">Update</Button>\n  </AlertDescription>\n</Alert>`
  },
  {
    name: "Gradient Notification",
    component: <div className="w-full max-w-sm p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white shadow-lg shadow-blue-500/20 flex gap-3"><div className="text-xl">🚀</div><div><h4 className="font-semibold text-sm">Upgrade Successful</h4><p className="text-xs text-white/80 mt-1">Welcome to Pro tier.</p></div></div>,
    code: `<div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-lg text-white">\n  <h4 className="font-semibold">Upgrade Successful</h4>\n  <p className="text-sm opacity-80">Welcome to Pro tier.</p>\n</div>`
  },
  {
    name: "Floating Toast Preview",
    component: <div className="relative h-40 w-full rounded-xl border bg-secondary/20"><div className="absolute bottom-4 right-4 p-4 bg-background border shadow-xl rounded-lg animate-bounce max-w-xs"><p className="text-sm font-medium">New update available</p><p className="text-xs text-muted-foreground mt-1">Click to refresh.</p></div></div>,
    code: `<div className="fixed bottom-4 right-4 p-4 bg-background border shadow-xl rounded-lg">\n  <p className="text-sm font-medium">New update available</p>\n  <p className="text-xs text-muted-foreground mt-1">Click to refresh.</p>\n</div>`
  },
  {
    name: "Minimal Status Alert",
    component: <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm font-medium border border-green-500/20"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>Database connected</div>,
    code: `<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm font-medium border border-green-500/20">\n  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>\n  Database connected\n</div>`
  }
];

export function SpecialAlertsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="special-alerts" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Special Alerts</h2>
          <p className="text-muted-foreground">Contextual banners, dismissible alerts, and notifications.</p>
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
    </section>
  );
}
