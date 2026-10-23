"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Github, Package, BookOpen } from "lucide-react";
import { NexoreLogo } from "../../layout/NexoreLogo";
import { FooterWordmark } from "./FooterWordmark";
import "./site-footer.css";

type FooterLink = {
  label: string;
  href: string;
  hl?: boolean;
  ext?: boolean;
  g?: string;
};

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "PRIMITIVES",
    links: [
      { label: "All Components", href: "/docs/components" },
      { label: "Buttons & Actions", href: "/docs/components/button" },
      { label: "Dialogs & Modals", href: "/docs/components/modal" },
      { label: "Cards & Surfaces", href: "/docs/components/card" },
      { label: "Aurora Border Card", href: "/docs/components/aurora-border-card" },
      { label: "Dark Mode Tokens", href: "/docs/components/dark-mode" },
      { label: "Icon Library (100+)", href: "/docs/icons" },
    ],
  },
  {
    title: "TEMPLATES",
    links: [
      { label: "Flagship Catalog", href: "/templates", hl: true },
      { label: "Ferrari Nocturne", href: "/templates/ferrari-nocturne" },
      { label: "Aura Botanica", href: "/templates/aura-obsidian-botanica" },
      { label: "Velvet Cryo-Gelato", href: "/templates/velvet-cryo-gelato" },
      { label: "Zenith Tea Elixir", href: "/templates/zenith-tea-elixir" },
      { label: "Nexore Make Studio", href: "/nexoremake" },
      { label: "Token Customizer", href: "/create" },
    ],
  },
  {
    title: "DEVELOPERS",
    links: [
      { label: "Installation", href: "/docs/installation" },
      { label: "Tailwind CSS v4 Setup", href: "/docs/installation#tailwind-v4" },
      { label: "React 19 Architecture", href: "/docs/installation#react-19" },
      { label: "Video Walkthrough", href: "/#demo" },
      { label: "npm Registry", href: "https://www.npmjs.com/package/nexoreui", ext: true },
      { label: "Changelog", href: "https://github.com/Al1mov77/NexoreUI/releases", ext: true },
    ],
  },
  {
    title: "COMMUNITY",
    links: [
      { label: "GitHub Repository", href: "https://github.com/Al1mov77/NexoreUI", ext: true },
      { label: "Pricing & Plans", href: "/pricing", hl: true },
      { label: "Team Workspace", href: "/workspace" },
      { label: "Terms of Service", href: "/terms", hl: true },
      { label: "Customer Support", href: "/support", hl: true },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "MIT License", href: "https://github.com/Al1mov77/NexoreUI/blob/main/LICENSE", ext: true },
      { label: "Issues & Feedback", href: "https://github.com/Al1mov77/NexoreUI/issues", ext: true },
    ],
  },
];

const CLI = "npx nexoreui@latest init";

export function SiteFooter({ children }: { children?: ReactNode }) {
  const ftRef = useRef<HTMLElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ft = ftRef.current;
    const peek = peekRef.current;
    if (!ft || !peek) return;

    const card = peek.firstElementChild as HTMLElement | null;
    if (!card) return;
    const name = card.querySelector("b");
    const canHover = typeof window !== "undefined" && window.matchMedia("(hover:hover)").matches;

    const place = (e: PointerEvent) => {
      const x = Math.min(e.clientX + 22, window.innerWidth - 190);
      const y = e.clientY + 134 > window.innerHeight ? e.clientY - 134 : e.clientY + 22;
      peek.style.transform = `translate3d(${x}px,${y}px,0)`;
    };

    const onMove = (e: PointerEvent) => {
      const r = ft.getBoundingClientRect();
      ft.style.setProperty("--mx", `${e.clientX - r.left}px`);
      ft.style.setProperty("--my", `${e.clientY - r.top}px`);
      ft.style.setProperty("--so", "1");
      if (canHover && peek.classList.contains("on")) place(e);
    };

    const onLeave = () => ft.style.setProperty("--so", "0");

    const onOver = (e: PointerEvent) => {
      if (!canHover) return;
      const target = e.target as Element | null;
      const a = target?.closest<HTMLElement>("a[data-g]");
      if (!a) return;
      card.style.setProperty("--g", a.dataset.g || "#71717a,#a1a1aa");
      if (name) {
        name.textContent = a.textContent?.replace("↗", "").trim() || "";
      }
      place(e);
      peek.classList.add("on");
    };

    const onOut = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("a[data-g]")) {
        peek.classList.remove("on");
      }
    };

    ft.addEventListener("pointermove", onMove);
    ft.addEventListener("pointerleave", onLeave);
    ft.addEventListener("pointerover", onOver);
    ft.addEventListener("pointerout", onOut);

    return () => {
      ft.removeEventListener("pointermove", onMove);
      ft.removeEventListener("pointerleave", onLeave);
      ft.removeEventListener("pointerover", onOver);
      ft.removeEventListener("pointerout", onOut);
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CLI);
    } catch {
      // fallback
    }
    setCopied(true);
  };

  return (
    <>
      <footer ref={ftRef} className="nf">
        <div className="nf-beam" />

        <div className="nf-wrap">
          <div className="nf-brand">
            <div className="nf-logo">
              <NexoreLogo size={28} />
              <span>
                Nexore<span className="text-zinc-500 dark:text-zinc-400 font-bold">UI</span>
              </span>
              <span className="nf-ver">v2.0.0</span>
            </div>

            <p>
              Handcrafted React components built on Radix UI primitives and Tailwind CSS v4. Precision
              spring physics, dark-mode architecture, and zero runtime lock-in.
            </p>

            <span className="nf-lbl">QUICKSTART CLI</span>
            <button
              type="button"
              className={`nf-cli${copied ? " ok" : ""}`}
              onClick={copy}
              aria-label="Copy CLI init command"
            >
              <span className="nf-pr">&gt;_</span>
              <span>{CLI}</span>
              <span className="nf-cp" aria-live="polite">
                {copied ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5 9-10" />
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
                  </svg>
                )}
              </span>
            </button>

            <div className="nf-mini">
              <Link href="/pricing">Pricing</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/support">Support</Link>
              <a
                href="https://github.com/Al1mov77/NexoreUI"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/nexoreui"
                target="_blank"
                rel="noreferrer"
              >
                npm Package
              </a>
              <Link href="/docs/installation">Documentation</Link>
            </div>
          </div>

          <nav className="nf-cols" aria-label="Footer">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.ext ? (
                        <a
                          href={l.href}
                          data-g={l.g}
                          className={l.hl ? "hl" : undefined}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {l.label}
                          <span className="nf-ext">↗</span>
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          data-g={l.g}
                          className={l.hl ? "hl" : undefined}
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {children}

        <div className="nf-bar">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
            <span>© 2026 NexoreUI. Open source under the MIT License.</span>
            <span className="hidden sm:inline opacity-30">•</span>
            <span>Support: nexoreuiteam@mail.ru</span>
            <span className="hidden sm:inline opacity-30">•</span>
            <span>React 19 • Next.js 15 • Radix UI • Tailwind CSS v4</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Al1mov77/NexoreUI"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg border border-border/60 hover:border-foreground/30 hover:text-foreground transition-all"
              aria-label="NexoreUI GitHub"
            >
              <Github size={14} />
            </a>
            <a
              href="https://www.npmjs.com/package/nexoreui"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg border border-border/60 hover:border-foreground/30 hover:text-foreground transition-all"
              aria-label="NexoreUI npm package"
            >
              <Package size={14} />
            </a>
            <Link
              href="/docs/installation"
              className="p-1.5 rounded-lg border border-border/60 hover:border-foreground/30 hover:text-foreground transition-all"
              aria-label="NexoreUI Documentation"
            >
              <BookOpen size={14} />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating template palette preview near cursor */}
      <div ref={peekRef} className="nf-peek" aria-hidden="true">
        <div className="nf-card">
          <small>Template Preview</small>
          <b>Name</b>
        </div>
      </div>
    </>
  );
}

export function FooterSection() {
  return (
    <SiteFooter>
      <div className="pt-8 pb-4 select-none overflow-hidden">
        <FooterWordmark text="NEXOREUI" />
      </div>
    </SiteFooter>
  );
}

export { FooterWordmark };
export default FooterSection;
