import React from "react";
import { Accessibility } from "lucide-react";

export function A11yHeader({ title = "Accessibility (a11y)" }: { title?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1 rounded-md bg-primary/10 text-primary shrink-0">
        <Accessibility className="h-3.5 w-3.5" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );
}
