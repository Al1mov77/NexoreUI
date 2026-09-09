"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy,
  Search,
  HelpCircle,
  FileText,
  Send,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Code2,
  Users,
  Smartphone,
  ThumbsUp,
  ThumbsDown,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function HelpCenterPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<number, boolean>>({});
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDepartment, setTicketDepartment] = useState("technical");
  const [ticketPriority, setTicketPriority] = useState<"low" | "normal" | "urgent">("normal");
  const [ticketToast, setTicketToast] = useState(false);

  const categories = [
    {
      title: "Getting Started & Onboarding",
      articles: "14 articles",
      icon: LifeBuoy,
      desc: "Quickstart guides, workspace setup, and team invites.",
      sample: "Inviting collaborators to your team workspace",
    },
    {
      title: "Billing & Invoicing",
      articles: "9 articles",
      icon: CreditCard,
      desc: "Managing card payments, enterprise invoicing, and VAT receipts.",
      sample: "Downloading annual billing VAT tax receipts",
    },
    {
      title: "Security, SSO & 2FA",
      articles: "18 articles",
      icon: ShieldCheck,
      desc: "SAML SSO, two-factor authentication, and audit logs.",
      sample: "Configuring Okta and Google Workspace SAML SSO",
    },
    {
      title: "Developer API & Webhooks",
      articles: "22 articles",
      icon: Code2,
      desc: "REST endpoints, rate limits, SDKs, and event signatures.",
      sample: "Handling webhook retry backoff algorithms",
    },
    {
      title: "Team Permissions & RBAC",
      articles: "11 articles",
      icon: Users,
      desc: "Granular access roles, audit trails, and guest permissions.",
      sample: "Setting custom role permissions matrix",
    },
    {
      title: "Mobile & Desktop Apps",
      articles: "8 articles",
      icon: Smartphone,
      desc: "macOS menu bar utilities, iOS notifications, and offline sync.",
      sample: "Enabling offline local cache persistence",
    },
  ];

  const faqs = [
    {
      q: "How do I transfer organization ownership to a new administrator?",
      a: "Navigate to Settings → Organization → General. Click 'Transfer Ownership' and select a verified team administrator. An email confirmation link will be sent to both parties to cryptographically authorize the change.",
    },
    {
      q: "What are the default API rate limits for production keys?",
      a: "Production keys are provisioned with 10,000 requests per minute with burst allowance up to 15,000 req/min. Enterprise tiers can configure custom multi-region rate limit pools via our technical architecture team.",
    },
    {
      q: "How does the 30-day money-back refund guarantee work?",
      a: "If you are dissatisfied with your plan within 30 days of initial subscription, submit a ticket under 'Billing & Invoices'. We process 100% full refunds back to your original payment method with zero cancellation penalties.",
    },
    {
      q: "Can we self-host or deploy NexoreUI in an air-gapped private cloud?",
      a: "Yes. Enterprise customers receive access to private container registries, Helm charts, and single-tenant AWS/GCP Terraform modules with zero external phone-home dependencies.",
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTicketModalOpen(false);
    setTicketToast(true);
    setTimeout(() => setTicketToast(false), 3500);
  };

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.desc.toLowerCase().includes(q) ||
      cat.sample.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans text-left"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Support Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "shield"} className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-bold text-sm @sm:text-base tracking-tight"
                style={{ fontFamily: "var(--template-heading-font)" }}
              >
                {config.brandName || "Resolv Desk"}
              </span>
              <span className="hidden @md:inline-block text-xs opacity-60 ml-2 font-mono">
                • Help Center & Docs
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            <div
              className="hidden @sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Support: &lt; 4m wait</span>
            </div>

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Instant Search Section */}
      <section className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 pt-10 pb-12 text-center space-y-5">
        <h1
          className="text-2xl @sm:text-4xl @lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto"
          style={{ fontFamily: "var(--template-heading-font)" }}
        >
          How can our customer support team help you today?
        </h1>
        <p className="text-xs @sm:text-sm opacity-75 max-w-xl mx-auto leading-relaxed">
          Search over 120 verified setup guides, developer tutorials, or connect directly with our engineering tier.
        </p>

        {/* Search Input */}
        <div className="max-w-xl mx-auto relative pt-2">
          <Search className="absolute left-4 top-5 h-4 w-4 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, keywords (e.g. 2FA, refunds, API tokens)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl border text-xs bg-transparent shadow-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/40"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-5 opacity-60 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Search Shortcut Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
          <span className="opacity-60 text-[11px] mr-1">Popular searches:</span>
          {["Reset 2FA", "Update Billing Card", "API Rate Limits", "Custom SSO"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-1 rounded-lg border text-[11px] opacity-75 hover:opacity-100 transition-colors"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Categorized Knowledge Base Grid */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-12">
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-base @sm:text-lg">Knowledge Base Topics</h2>
            <span className="text-xs opacity-60 font-mono">{filteredCategories.length} Categories</span>
          </div>

          <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="p-5 rounded-2xl border space-y-3 transition-colors hover:border-zinc-400 group cursor-pointer"
                  style={{
                    backgroundColor: "var(--template-surface)",
                    borderColor: "var(--template-border)",
                    borderRadius: "var(--template-radius)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono opacity-60 font-semibold">{cat.articles}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs opacity-75 mt-1 leading-relaxed">{cat.desc}</p>
                  </div>

                  <div className="pt-2 border-t text-[11px] opacity-70 flex items-center justify-between" style={{ borderColor: "var(--template-border)" }}>
                    <span className="truncate">{cat.sample}</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-60 shrink-0 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Interactive FAQ Accordion Section */}
        <section className="space-y-4 max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="font-bold text-xl">Frequently Asked Questions</h2>
            <p className="text-xs opacity-65">Instant answers to high-frequency customer questions.</p>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              const hasVoted = helpfulFeedback[idx] !== undefined;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border space-y-3 transition-colors"
                  style={{
                    backgroundColor: "var(--template-surface)",
                    borderColor: "var(--template-border)",
                    borderRadius: "var(--template-radius)",
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left font-bold text-xs @sm:text-sm"
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 opacity-60 shrink-0" /> : <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-2 border-t space-y-4 text-xs opacity-85 leading-relaxed"
                      style={{ borderColor: "var(--template-border)" }}
                    >
                      <p>{faq.a}</p>

                      {/* Was this helpful feedback trigger */}
                      <div className="flex items-center justify-between pt-2 border-t text-[11px] opacity-75" style={{ borderColor: "var(--template-border)" }}>
                        <span>Was this answer helpful?</span>
                        {hasVoted ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Feedback recorded. Thank you!</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setHelpfulFeedback((prev) => ({ ...prev, [idx]: true }))}
                              className="px-2.5 py-1 rounded-lg border flex items-center gap-1 hover:bg-emerald-500/10 transition-colors"
                              style={{ borderColor: "var(--template-border)" }}
                            >
                              <ThumbsUp className="h-3 w-3 text-emerald-500" />
                              <span>Yes</span>
                            </button>
                            <button
                              onClick={() => setHelpfulFeedback((prev) => ({ ...prev, [idx]: false }))}
                              className="px-2.5 py-1 rounded-lg border flex items-center gap-1 hover:bg-rose-500/10 transition-colors"
                              style={{ borderColor: "var(--template-border)" }}
                            >
                              <ThumbsDown className="h-3 w-3 text-rose-500" />
                              <span>No</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Support Banner */}
        <section
          className="p-6 @sm:p-8 rounded-3xl border text-center space-y-4 max-w-4xl mx-auto"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <MessageSquare className="h-6 w-6" />
          </div>

          <h3 className="font-bold text-lg @sm:text-xl">Still need direct assistance?</h3>
          <p className="text-xs @sm:text-sm opacity-75 max-w-md mx-auto leading-relaxed">
            Our systems and customer engineering staff are on standby 24 hours a day, 7 days a week.
          </p>

          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-transform active:scale-95"
            style={{
              backgroundColor: "var(--template-primary)",
              borderRadius: "var(--template-radius)",
            }}
          >
            Create New Support Ticket
          </button>
        </section>
      </main>

      {/* Support Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              color: "var(--template-fg)",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--template-border)" }}>
              <span className="font-bold text-base">Create Support Ticket</span>
              <button onClick={() => setIsTicketModalOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 opacity-80">Department Routing</label>
                <select
                  value={ticketDepartment}
                  onChange={(e) => setTicketDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <option value="technical">Technical Support & Architecture</option>
                  <option value="billing">Billing & Invoicing</option>
                  <option value="enterprise">Enterprise SLA & Custom Plans</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Priority Severity</label>
                <div className="flex gap-2">
                  {(["low", "normal", "urgent"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTicketPriority(p)}
                      className={`flex-1 py-1.5 rounded-lg border font-bold text-xs uppercase tracking-wider transition-colors ${
                        ticketPriority === p
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-zinc-300 dark:border-zinc-700 opacity-75 hover:opacity-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief description of the issue..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  style={{ borderColor: "var(--template-border)" }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Message Body</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please include error logs, relevant URLs, or steps to reproduce..."
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none text-xs leading-relaxed"
                  style={{ borderColor: "var(--template-border)" }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-semibold opacity-75"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Toast */}
      {ticketToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Ticket #8492 received! Our engineering tier is reviewing.</span>
        </div>
      )}
    </div>
  );
}
