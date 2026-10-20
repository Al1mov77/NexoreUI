import { Suspense } from "react";
import { Metadata } from "next";
import { SuccessPageClient } from "./SuccessPageClient";

export const metadata: Metadata = {
  title: "Order Confirmed · Pro License — NexoreUI",
  description: "Your NexoreUI Pro lifetime license and developer team invite credentials.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-xs font-mono text-muted-foreground">
        Loading license credentials...
      </div>
    }>
      <SuccessPageClient />
    </Suspense>
  );
}
