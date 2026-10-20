import { Suspense } from "react";
import { Metadata } from "next";
import { InvitePageClient } from "./InvitePageClient";

export const metadata: Metadata = {
  title: "Claim Team Invitation · Pro Access — NexoreUI",
  description: "Redeem your colleague invite link for permanent NexoreUI Pro lifetime access.",
};

export default function InvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-xs font-mono text-muted-foreground">
        Loading invitation...
      </div>
    }>
      <InvitePageClient />
    </Suspense>
  );
}
