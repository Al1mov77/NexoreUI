import { Suspense } from "react";
import { Metadata } from "next";
import { WorkspacePageClient } from "./WorkspacePageClient";

export const metadata: Metadata = {
  title: "Team & Workspace License Management — NexoreUI",
  description: "Manage your NexoreUI Pro license, team collaborator seats, and colleague invite links.",
};

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-xs font-mono text-muted-foreground">
        Loading workspace...
      </div>
    }>
      <WorkspacePageClient />
    </Suspense>
  );
}
