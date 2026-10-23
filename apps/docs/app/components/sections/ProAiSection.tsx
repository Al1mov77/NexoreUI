"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  ChatBubbleUser,
  ChatBubbleAI,
  AIPromptInput,
  ThinkingLoader,
  ModelSelector,
  GeneratedCodeBlock,
  SuggestionChips,
} from "nexoreui";

export function ProAiSection() {
  return (
    <SuiteSectionLayout
      id="pro-ai"
      title="Pro AI Suite"
      badge="AI & Agentic"
      description="Production-ready conversational AI interface primitives: message bubbles, prompt input, model selector, thinking telemetry, and response chips."
      cliCommand="npx nexoreui add pro-ai"
      items={[
        {
          name: "Conversational Message Stream",
          description: "Structured user prompt and streaming AI assistant response bubbles with copy actions.",
          component: (
            <div className="w-full max-w-lg p-2">
              <ChatBubbleUser message="How do I configure Tailwind CSS v4 in my Next.js App Router project?" />
              <ChatBubbleAI message="Import @tailwindcss/postcss in your postcss.config.mjs and add @import 'tailwindcss'; to your globals.css file." />
            </div>
          ),
          code: `import { ChatBubbleUser, ChatBubbleAI } from "nexoreui"

<div className="space-y-4">
  <ChatBubbleUser message="How do I configure Tailwind CSS v4 in Next.js?" />
  <ChatBubbleAI message="Import @tailwindcss/postcss and declare @import 'tailwindcss' in globals.css." />
</div>`,
          propsData: [
            { name: "message", type: "string", defaultValue: "—", description: "Text content displayed within the chat bubble.", required: false }
          ]
        },
        {
          name: "AI Prompt Input Bar",
          description: "Multi-line expandable prompt bar with voice dictation trigger and submit action.",
          component: (
            <div className="w-full max-w-lg">
              <AIPromptInput />
            </div>
          ),
          code: `import { AIPromptInput } from "nexoreui"

<AIPromptInput />`
        },
        {
          name: "Model Selector Dropdown",
          description: "Pill control indicating the active foundation model with quick switch trigger.",
          component: (
            <div className="flex items-center justify-center p-4">
              <ModelSelector />
            </div>
          ),
          code: `import { ModelSelector } from "nexoreui"

<ModelSelector />`
        },
        {
          name: "Thinking Status Loader",
          description: "Animated pulse loader indicating real-time token generation and agentic inference.",
          component: (
            <div className="w-full max-w-md">
              <ThinkingLoader />
            </div>
          ),
          code: `import { ThinkingLoader } from "nexoreui"

<ThinkingLoader />`
        },
        {
          name: "Contextual Suggestion Chips",
          description: "One-click follow-up prompt chips designed for guided conversational discovery.",
          component: (
            <div className="p-2">
              <SuggestionChips />
            </div>
          ),
          code: `import { SuggestionChips } from "nexoreui"

<SuggestionChips />`
        },
        {
          name: "Syntax-Highlighted Code Response",
          description: "Card container for AI-generated code blocks with language badge and copy button.",
          component: (
            <div className="w-full max-w-lg">
              <GeneratedCodeBlock />
            </div>
          ),
          code: `import { GeneratedCodeBlock } from "nexoreui"

<GeneratedCodeBlock />`
        }
      ]}
      a11yNotes={[
        "Keyboard Support: All action buttons (Copy, Refresh, Submit) are fully focusable with visible focus rings.",
        "ARIA labels: Input regions and action buttons include explicit accessible names for screen reader compatibility.",
        "Reduced Motion: Streaming pulse animations respect prefers-reduced-motion settings."
      ]}
    />
  );
}
