import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexore Make — Visual Component Builder",
  description: "Create, customize, and export custom UI components visually with AI assistance. Export to React, HTML/CSS, Vue, Svelte, Angular, and Vanilla JS.",
};

export default function NexoreMakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen overflow-hidden flex flex-col" style={{
      backgroundColor: 'var(--make-bg, #030303)',
      color: 'var(--make-text, #e4e4e7)',
    }}>
      {children}
    </div>
  );
}
