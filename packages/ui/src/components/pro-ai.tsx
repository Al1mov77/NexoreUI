"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, Send, Mic, Copy, Check, Bot, User, Settings, FileText, ChevronDown, RefreshCw, Plus } from "lucide-react"
import { cn } from "../utils/cn"

// 1. ChatBubbleUser
export const ChatBubbleUser = ({ message }: any) => (
  <div className="flex gap-4 justify-end mb-6">
    <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
      <p className="leading-relaxed">{message || "How do I build a Next.js application with Tailwind CSS?"}</p>
    </div>
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 border"><User className="w-4 h-4" /></div>
  </div>
)

// 2. ChatBubbleAI
export const ChatBubbleAI = ({ message }: any) => (
  <div className="flex gap-4 mb-6">
    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20"><Bot className="w-4 h-4" /></div>
    <div className="bg-muted/50 px-5 py-3 rounded-2xl rounded-tl-sm max-w-[80%] border border-border/50">
      <p className="leading-relaxed text-foreground">{message || "You can start by running npx create-next-app@latest and selecting Tailwind CSS during the setup process."}</p>
      <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
        <button className="text-muted-foreground hover:text-foreground"><Copy className="w-4 h-4" /></button>
        <button className="text-muted-foreground hover:text-foreground"><RefreshCw className="w-4 h-4" /></button>
      </div>
    </div>
  </div>
)

// 3. AIPromptInput
export const AIPromptInput = () => (
  <div className="w-full relative border rounded-2xl bg-card shadow-lg flex items-end p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
    <button className="p-3 text-muted-foreground hover:text-foreground"><Mic className="w-5 h-5" /></button>
    <textarea className="flex-1 max-h-32 min-h-[44px] py-3 bg-transparent outline-none resize-none placeholder:text-muted-foreground" placeholder="Ask anything..." rows={1} />
    <button className="p-3 bg-primary text-primary-foreground rounded-xl shadow-sm hover:opacity-90"><Send className="w-5 h-5" /></button>
  </div>
)

// 4. ThinkingLoader
export const ThinkingLoader = () => (
  <div className="flex gap-4 mb-6">
    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20"><Bot className="w-4 h-4" /></div>
    <div className="bg-muted/50 px-5 py-4 rounded-2xl rounded-tl-sm border border-border/50 flex items-center gap-1.5">
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} className="w-2 h-2 rounded-full bg-foreground" />
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-2 h-2 rounded-full bg-foreground" />
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-2 h-2 rounded-full bg-foreground" />
    </div>
  </div>
)

// 5. ModelSelector
export const ModelSelector = () => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg border cursor-pointer hover:bg-muted/80 transition-colors">
    <Sparkles className="w-4 h-4 text-primary" />
    <span className="text-sm font-medium">GPT-4 Turbo</span>
    <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
  </div>
)

// 6. GeneratedCodeBlock
export const GeneratedCodeBlock = () => (
  <div className="rounded-xl border border-border bg-zinc-950 overflow-hidden my-4 max-w-2xl">
    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
      <span className="text-xs text-zinc-400 font-mono">tsx</span>
      <button className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white"><Copy className="w-3 h-3" /> Copy code</button>
    </div>
    <pre className="p-4 text-sm text-zinc-300 font-mono overflow-x-auto">
      <code>{`export default function App() {\n  return (\n    <div className="p-4">\n      <h1 className="text-2xl font-bold">Hello World</h1>\n    </div>\n  );\n}`}</code>
    </pre>
  </div>
)

// 7. ChatHistorySidebar
export const ChatHistorySidebar = () => (
  <div className="w-64 h-full border-r bg-background p-4 flex flex-col">
    <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium mb-6 text-sm flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> New Chat</button>
    <div className="text-xs font-semibold text-muted-foreground mb-3 px-2">Today</div>
    <div className="space-y-1">
      <button className="w-full text-left px-3 py-2 text-sm bg-muted rounded-md font-medium truncate flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground shrink-0" /> React State Management</button>
      <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md truncate flex items-center gap-2"><FileText className="w-4 h-4 shrink-0" /> Tailwind Layouts</button>
    </div>
  </div>
)

// 8. AIFeatureCard
export const AIFeatureCard = () => (
  <div className="p-6 rounded-2xl border bg-card relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 relative z-10"><Sparkles className="w-6 h-6" /></div>
    <h3 className="text-xl font-bold mb-2 relative z-10">Smart Autocomplete</h3>
    <p className="text-sm text-muted-foreground relative z-10">Let AI predict and complete your code in real-time as you type.</p>
  </div>
)

// 9. SuggestionChips
export const SuggestionChips = () => (
  <div className="flex flex-wrap gap-2">
    {["Explain this code", "Refactor for performance", "Add type definitions"].map((text, i) => (
      <button key={i} className="px-4 py-2 rounded-full border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">{text}</button>
    ))}
  </div>
)

// 10. VoiceInputPulse
export const VoiceInputPulse = () => (
  <div className="flex items-center justify-center w-24 h-24 relative">
    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-red-500/20" />
    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }} className="absolute inset-2 rounded-full bg-red-500/30" />
    <button className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center relative z-10 shadow-xl"><Mic className="w-6 h-6" /></button>
  </div>
)
