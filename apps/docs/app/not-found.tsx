import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-sm font-medium text-muted-foreground">404</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Page not found
        </h1>

        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
