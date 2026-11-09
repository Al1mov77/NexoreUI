"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  Loader2,
  Lock,
  Palette,
  Terminal,
  X,
} from "lucide-react";
import { TemplateConfig, RADIUS_VALUES } from "../../context/TemplateCustomizerContext";
import { TemplateItem } from "../../data/templates";
import { useProStatus } from "../../../hooks/useProStatus";

interface TemplateCodeExportModalProps {
  template: TemplateItem;
  config: TemplateConfig;
  isOpen: boolean;
  onClose: () => void;
}

type ExportTab = "code" | "cli" | "css";
type DataMode = "api-fetch" | "api-axios" | "mock";

interface VerifyResponse {
  valid?: boolean;
  owner?: string;
  error?: string;
}

interface ProRegistryResponse {
  valid?: boolean;
  content?: string;
  error?: string;
}

const TOYBERRY_ASSETS_LIST = [
  ...Array.from({ length: 120 }, (_, i) => `/templates/toyberry/frames/s1/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 120 }, (_, i) => `/templates/toyberry/frames/s2/${String(i + 1).padStart(4, "0")}.webp`),
  "/templates/toyberry/toys/dino.png",
  "/templates/toyberry/toys/rocket.png",
  "/templates/toyberry/toys/bear.png",
  "/templates/toyberry/toys/pinkcar.png",
  "/templates/toyberry/toys/duck.png",
  "/templates/toyberry/toys/redcar.png",
  "/templates/toyberry/toys/robot.png",
  "/templates/toyberry/toys/train.png",
];

const KARMIN_ASSETS_LIST = [
  ...Array.from({ length: 120 }, (_, i) => `/templates/karmin/frames/eye/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 120 }, (_, i) => `/templates/karmin/frames/smoke/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 120 }, (_, i) => `/templates/karmin/frames/morph/${String(i + 1).padStart(4, "0")}.webp`),
  "/templates/karmin/stills/halo.webp",
  "/templates/karmin/stills/panther.webp",
  "/templates/karmin/stills/tiger.webp",
];

const NEXORE_TEE_ASSETS = [
  "/templates/nexore-tee/nexore-tee-01-box-closed.jpg",
  "/templates/nexore-tee/nexore-tee-02-box-open.jpg",
  "/templates/nexore-tee/nexore-tee-03-tee-white.jpg",
  "/templates/nexore-tee/nexore-tee-04-patch-sheet.jpg",
  "/templates/nexore-tee/nexore-tee-04-patches-sheet.jpg",
  "/templates/nexore-tee/nexore-tee-05-letters-tray.jpg",
  "/templates/nexore-tee/nexore-tee-06-paper-texture.jpg",
  "/templates/nexore-tee/nexore-tee-07-sealed-bag.jpg",
  "/templates/nexore-tee/nexore-tee-08-press-pad.jpg",
];

const NEXORE_CASE_ASSETS = [
  "/templates/nexore-case/nexore-01-box-closed.jpg",
  "/templates/nexore-case/nexore-02-box-open.jpg",
  "/templates/nexore-case/nexore-03-case-white.jpg",
  "/templates/nexore-case/nexore-04-charms-sheet.jpg",
  "/templates/nexore-case/nexore-05-stars-tray.jpg",
  "/templates/nexore-case/nexore-06-paper-texture.jpg",
  "/templates/nexore-case/nexore-07-seal-pad.jpg",
];

const VESUVIO_PIZZA_ASSETS = [
  "/templates/vesuvio-pizza/scene/counter.jpg",
  "/templates/vesuvio-pizza/scene/box-closed.webp",
  "/templates/vesuvio-pizza/scene/box-base.webp",
  "/templates/vesuvio-pizza/scene/box-ajar.webp",
  "/templates/vesuvio-pizza/scene/timer.webp",
  "/templates/vesuvio-pizza/pizza/dough.webp",
  "/templates/vesuvio-pizza/pizza/sauce.webp",
  "/templates/vesuvio-pizza/pizza/crust-baked.webp",
  "/templates/vesuvio-pizza/pizza/pizza-baked-full.webp",
  "/templates/vesuvio-pizza/toppings/mozzarella-1.webp",
  "/templates/vesuvio-pizza/toppings/mozzarella-2.webp",
  "/templates/vesuvio-pizza/toppings/pepperoni-1.webp",
  "/templates/vesuvio-pizza/toppings/pepperoni-2.webp",
  "/templates/vesuvio-pizza/toppings/mushroom-1.webp",
  "/templates/vesuvio-pizza/toppings/mushroom-2.webp",
  "/templates/vesuvio-pizza/toppings/basil-1.webp",
  "/templates/vesuvio-pizza/toppings/basil-2.webp",
  "/templates/vesuvio-pizza/toppings/basil-3.webp",
  "/templates/vesuvio-pizza/toppings/olive-1.webp",
  "/templates/vesuvio-pizza/toppings/onion-1.webp",
  "/templates/vesuvio-pizza/toppings/onion-2.webp",
  "/templates/vesuvio-pizza/trays/tray-mozzarella.webp",
  "/templates/vesuvio-pizza/trays/tray-pepperoni.webp",
  "/templates/vesuvio-pizza/trays/tray-mushrooms.webp",
  "/templates/vesuvio-pizza/trays/tray-basil.webp",
  "/templates/vesuvio-pizza/trays/tray-olives.webp",
  "/templates/vesuvio-pizza/trays/tray-onion.webp",
  "/templates/vesuvio-pizza/hands/hand-open.webp",
  "/templates/vesuvio-pizza/hands/hand-pinch.webp",
  "/templates/vesuvio-pizza/hands/hand-ok.webp",
  "/templates/vesuvio-pizza/hands/hand-point.webp",
];

const DUSTLINE_ASSETS = [
  "/templates/dustline-dawn/ride.mp4",
  "/templates/dustline-dawn/poster.webp",
  "/templates/dustline-dawn/p1.webp",
  "/templates/dustline-dawn/p2.webp",
  "/templates/dustline-dawn/p3.webp",
  "/templates/dustline-dawn/p4.webp",
  "/templates/dustline-dawn/p5.webp",
];

const TEMPLATE_MEDIA_ASSETS: Record<string, string[]> = {
  "template-toyberry-store-pro": TOYBERRY_ASSETS_LIST,
  "toyberry-store": TOYBERRY_ASSETS_LIST,
  toyberry: TOYBERRY_ASSETS_LIST,
  "template-karmin-film-pro": KARMIN_ASSETS_LIST,
  "karmin-film": KARMIN_ASSETS_LIST,
  karmin: KARMIN_ASSETS_LIST,
  "template-nexore-tee-pro": NEXORE_TEE_ASSETS,
  "nexore-tee": NEXORE_TEE_ASSETS,
  "template-nexore-case-pro": NEXORE_CASE_ASSETS,
  "nexore-case": NEXORE_CASE_ASSETS,
  "template-vesuvio-pizza-pro": VESUVIO_PIZZA_ASSETS,
  "vesuvio-pizza": VESUVIO_PIZZA_ASSETS,
  "template-dustline-dawn-pro": DUSTLINE_ASSETS,
  "dustline-dawn": DUSTLINE_ASSETS,
  "template-pull-noodle-pro": ["/videos/pull-noodle.mp4"],
  "pull-noodle-pro": ["/videos/pull-noodle.mp4"],
  "template-ferrari-nocturne": ["/videos/ferrari-nocturne.mp4"],
  "ferrari-nocturne": ["/videos/ferrari-nocturne.mp4"],
  "template-rose-nocturne": ["/videos/rose-nocturne-atelier.mp4"],
  "rose-nocturne": ["/videos/rose-nocturne-atelier.mp4"],
  "template-psyche-obsidian": ["/videos/psyche-obsidian-atelier.mp4"],
  "psyche-obsidian": ["/videos/psyche-obsidian-atelier.mp4"],
  "template-vortex-apex-pro": ["/videos/vortex-apex-obsidian.mp4"],
  "vortex-apex-pro": ["/videos/vortex-apex-obsidian.mp4"],
  "template-aerovoid-obsidian-pro": ["/videos/aerovoid-obsidian-parka.mp4"],
  "aerovoid-obsidian-pro": ["/videos/aerovoid-obsidian-parka.mp4"],
  "template-amarena-royale-pro": ["/videos/amarena-royale-cupcake.mp4"],
  "amarena-royale-pro": ["/videos/amarena-royale-cupcake.mp4"],
  "template-monolith-cacao-pro": ["/videos/monolith-cacao-glaze.mp4"],
  "monolith-cacao-pro": ["/videos/monolith-cacao-glaze.mp4"],
  "template-levitas-cryo-pro": ["/videos/levitas-cryo-spheres.mp4"],
  "levitas-cryo-pro": ["/videos/levitas-cryo-spheres.mp4"],
  "template-aura-obsidian-pro": ["/videos/aura-obsidian-botanica.mp4"],
  "aura-obsidian-pro": ["/videos/aura-obsidian-botanica.mp4"],
  "template-aura-nocturne-pro": ["/videos/aura-nocturne-perfume.mp4"],
  "aura-nocturne-pro": ["/videos/aura-nocturne-perfume.mp4"],
  "template-velvet-gelato-pro": ["/videos/velvet-cryo-gelato.mp4"],
  "velvet-gelato-pro": ["/videos/velvet-cryo-gelato.mp4"],
  "template-zenith-elixir-pro": ["/videos/zenith-tea-elixir.mp4"],
  "zenith-elixir-pro": ["/videos/zenith-tea-elixir.mp4"],
  "template-chrono-x-pro": ["/videos/chrono-scrub.mp4"],
  "chrono-x-pro": ["/videos/chrono-scrub.mp4"],
  "template-aura-sound-pro": ["/videos/headphones-scrub.mp4"],
  "aura-sound-pro": ["/videos/headphones-scrub.mp4"],
};

const DATA_MODES: readonly { id: DataMode; label: string }[] = [
  { id: "api-fetch", label: "Next.js fetch" },
  { id: "api-axios", label: "Axios client" },
  { id: "mock", label: "Static dataset" },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const buttonBase = `inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50 ${focusRing}`;
const buttonOutline = `${buttonBase} border border-border bg-background text-foreground hover:bg-accent`;
const buttonGhost = `${buttonBase} text-muted-foreground hover:bg-accent hover:text-foreground`;
const buttonPrimary = `${buttonBase} bg-primary text-primary-foreground hover:bg-primary/90`;

function formatTitle(rawTitle: string): { name: string; subtitle: string } {
  const separator = rawTitle.includes(" — ") ? " — " : " - ";
  const [head, ...rest] = rawTitle.split(separator);
  const trimmedHead = head.trim();
  const isAllCaps = trimmedHead === trimmedHead.toUpperCase() && /[A-Z]{3,}/.test(trimmedHead);
  const name = isAllCaps
    ? trimmedHead
        .toLowerCase()
        .split(" ")
        .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" ")
    : trimmedHead;
  return { name, subtitle: rest.join(" - ").trim() };
}

function getWebDeviceId(): string {
  if (typeof window === "undefined") return "web_ssr";
  let id = localStorage.getItem("nexoreui_device_id");
  if (!id) {
    id = "web_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem("nexoreui_device_id", id);
  }
  return id;
}

function buildUsersHookCode(client: "fetch" | "axios", apiEndpoint: string): { header: string; hook: string } {
  const header = `export const USERS_API_ENDPOINT =\n  process.env.NEXT_PUBLIC_USERS_API_URL || "${apiEndpoint}";\n\n`;
  const requestBlock =
    client === "fetch"
      ? `        const res = await fetch(USERS_API_ENDPOINT);\n        if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);\n        const data: unknown = await res.json();`
      : `        const response = await axios.get<unknown>(USERS_API_ENDPOINT);\n        const data: unknown = response.data;`;

  const hook = `  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchApiUsers() {
      try {
        setIsLoading(true);
        setApiError(null);
${requestBlock}
        const record = typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
        const rawList = Array.isArray(data)
          ? data
          : Array.isArray(record.users)
          ? record.users
          : Array.isArray(record.items)
          ? record.items
          : Array.isArray(record.data)
          ? record.data
          : [];
        if (isMounted) {
          const mapped: UserItem[] = rawList.map((entry: unknown, idx: number) => {
            const u = typeof entry === "object" && entry !== null ? (entry as Record<string, unknown>) : {};
            const address = typeof u.address === "object" && u.address !== null ? (u.address as Record<string, unknown>) : {};
            const fullName = \`\${typeof u.firstName === "string" ? u.firstName : ""} \${typeof u.lastName === "string" ? u.lastName : ""}\`.trim();
            const rawStatus = u.status;
            return {
              id: u.id ? String(u.id) : \`usr-\${idx + 1}\`,
              name: (typeof u.name === "string" && u.name) || fullName || "Team Member",
              email: (typeof u.email === "string" && u.email) || \`user\${idx + 1}@domain.com\`,
              avatar:
                (typeof u.avatar === "string" && u.avatar) ||
                (typeof u.image === "string" && u.image) ||
                \`https://images.unsplash.com/photo-\${1534528741775 + idx}?auto=format&fit=crop&w=200&q=80\`,
              role:
                (u.role as UserRole) ||
                (idx % 3 === 0 ? "Senior Developer" : idx % 2 === 0 ? "Product Designer" : "Lead Architect"),
              department: (u.department as UserDepartment) || (idx % 2 === 0 ? "Engineering" : "Design"),
              status:
                rawStatus === "active" || rawStatus === "invited" || rawStatus === "suspended"
                  ? rawStatus
                  : idx % 4 === 0
                  ? "invited"
                  : "active",
              lastActive: "Just now",
              joinedDate: "2026",
              twoFactorEnabled: Boolean(u.twoFactorEnabled ?? true),
              location:
                (typeof u.location === "string" && u.location) ||
                (typeof address.city === "string" && address.city) ||
                "San Francisco, US",
              projectsCount: Number(u.projectsCount || ((idx * 3) % 12) + 2),
            };
          });
          setUsers(mapped);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setApiError(err instanceof Error ? err.message : "Failed to load users");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchApiUsers();
    return () => {
      isMounted = false;
    };
  }, []);`;

  return { header, hook };
}

function buildCustomizedTsx(
  rawSource: string,
  template: TemplateItem,
  config: TemplateConfig,
  isUsersTable: boolean,
  dataMode: DataMode
): string {
  let code = rawSource;

  if (template.id === "template-portfolio-pro" || template.slug === "nexfolio-portfolio-pro") {
    const customName = config.brandName || "Kaelen Vance";
    const customRole = config.brandTagline || "Principal Design Eng";
    const customAvatar =
      config.customLogoUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
    const customHeadline =
      config.heroTitle || "Crafting high-precision interfaces for visionary engineering teams.";
    const customBio =
      config.heroSubtitle ||
      "I partner with founders and product teams to bridge the chasm between Swiss rationalist design and zero-compromise frontend engineering. Currently Staff Design Engineer at Vercel.";
    const customEmail = config.portfolioConfig?.email || "kaelen.vance@nexore.design";
    const customLocation = config.portfolioConfig?.location || "Zurich";
    const tz =
      customLocation === "San Francisco"
        ? "America/Los_Angeles"
        : customLocation === "London"
        ? "Europe/London"
        : customLocation === "Tokyo"
        ? "Asia/Tokyo"
        : "Europe/Zurich";

    code = code
      .replace(/Kaelen Vance/g, customName)
      .replace(/Principal Design Eng/g, customRole)
      .replace(
        /https:\/\/images\.unsplash\.com\/photo-1534528741775-53994a69daeb\?auto=format&fit=crop&w=120&q=80/g,
        customAvatar
      )
      .replace(/Crafting high-precision interfaces for visionary engineering teams\./g, customHeadline)
      .replace(
        /I partner with founders and product teams to bridge the chasm between Swiss rationalist design and zero-compromise frontend engineering\. Currently Staff Design Engineer at Vercel\./g,
        customBio
      )
      .replace(/kaelen\.vance@nexore\.design/g, customEmail)
      .replace(/"Europe\/Zurich"/g, `"${tz}"`)
      .replace(/Zurich/g, customLocation);
  } else if (isUsersTable) {
    const apiEndpoint = config.swaggerApiUrl || "https://dummyjson.com/users";
    const mockArrayRegex = /export\s+const\s+INITIAL_USERS:\s*UserItem\[\]\s*=\s*\[[\s\S]*?\n\];/;

    if (dataMode === "api-fetch" || dataMode === "api-axios") {
      const client = dataMode === "api-fetch" ? "fetch" : "axios";
      const { header, hook } = buildUsersHookCode(client, apiEndpoint);
      if (mockArrayRegex.test(code)) {
        code = code.replace(mockArrayRegex, header);
      }
      if (client === "axios") {
        code = `import axios from "axios";\n${code}`;
      }
      code = code.replace("  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);", hook);
    } else if (config.customUsersData && config.customUsersData.length > 0 && mockArrayRegex.test(code)) {
      const formattedMock = `export const INITIAL_USERS: UserItem[] = ${JSON.stringify(
        config.customUsersData,
        null,
        2
      )};`;
      code = code.replace(mockArrayRegex, formattedMock);
    }
  } else if (template.id === "template-nexcore-admin-pro" || template.slug === "nexcore-admin-pro") {
    if (config.brandName) {
      code = code.replace(/NexCore/g, config.brandName);
    }
    if (config.adminConfig?.currency) {
      code = code.replace(/\$128,430/g, `${config.adminConfig.currency}128,430`);
    }
  }

  return code.trim();
}

function highlightSyntaxLine(line: string): React.ReactNode {
  const trimmed = line.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
    return <span className="text-muted-foreground">{line}</span>;
  }

  const tokenRegex =
    /(".*?"|'.*?'|`.*?`|\/\/.*$|\b(?:import|export|default|from|const|let|var|function|return|async|await|if|else|try|catch|finally|switch|case|new|typeof|interface|type|extends|as)\b|\b(?:useState|useEffect|useMemo|useRef|useCallback)\b|\b(?:string|number|boolean|void|unknown|Record|UserItem|UserRole|UserDepartment|UserStatus|TemplateConfig)\b|<\/?[A-Za-z0-9_.]+|\b\d+\b)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }
    const token = match[0];

    if (token.startsWith("//")) {
      parts.push(
        <span key={match.index} className="text-muted-foreground">
          {token}
        </span>
      );
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
      parts.push(
        <span key={match.index} className="text-muted-foreground">
          {token}
        </span>
      );
    } else if (
      /^(?:import|export|default|from|const|let|var|function|return|async|await|if|else|try|catch|finally|switch|case|new|typeof|interface|type|extends|as)$/.test(
        token
      )
    ) {
      parts.push(
        <span key={match.index} className="font-semibold text-foreground">
          {token}
        </span>
      );
    } else if (/^(?:useState|useEffect|useMemo|useRef|useCallback)$/.test(token)) {
      parts.push(
        <span key={match.index} className="font-medium text-foreground">
          {token}
        </span>
      );
    } else if (
      /^(?:string|number|boolean|void|unknown|Record|UserItem|UserRole|UserDepartment|UserStatus|TemplateConfig)$/.test(
        token
      )
    ) {
      parts.push(
        <span key={match.index} className="text-foreground/80">
          {token}
        </span>
      );
    } else if (token.startsWith("<") || token.startsWith("</")) {
      parts.push(
        <span key={match.index} className="font-medium text-foreground">
          {token}
        </span>
      );
    } else if (/^\d+$/.test(token)) {
      parts.push(
        <span key={match.index} className="tabular-nums text-muted-foreground">
          {token}
        </span>
      );
    } else {
      parts.push(token);
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  return parts;
}

export function TemplateCodeExportModal({
  template,
  config,
  isOpen,
  onClose,
}: TemplateCodeExportModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const licenseInputId = useId();
  const titleId = useId();

  const isUsersTable =
    template.id === "template-users-table-pro" || template.slug === "nexusers-table-pro";
  const [dataMode, setDataMode] = useState<DataMode>("api-fetch");
  const [activeTab, setActiveTab] = useState<ExportTab>("code");
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const mediaAssets = TEMPLATE_MEDIA_ASSETS[template.id] || TEMPLATE_MEDIA_ASSETS[template.slug] || [];
  const hasMedia = mediaAssets.length > 0;

  const { licenseKey: userLicenseKey } = useProStatus();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [licenseKeyInput, setLicenseKeyInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [licenseOwner, setLicenseOwner] = useState<string | null>(null);
  const [remoteCode, setRemoteCode] = useState<string | null>(null);
  const [isLoadingRemoteCode, setIsLoadingRemoteCode] = useState(false);
  const [remoteCodeError, setRemoteCodeError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  async function verifyLicenseKey(keyToVerify: string) {
    const clean = keyToVerify.trim().toUpperCase();
    if (!clean) {
      setVerifyError("Enter your license key to continue.");
      return;
    }
    setIsVerifying(true);
    setVerifyError(null);
    try {
      const deviceId = getWebDeviceId();
      const res = await fetch(
        `/api/licenses/verify?key=${encodeURIComponent(clean)}&device_id=${encodeURIComponent(
          deviceId
        )}&device_name=${encodeURIComponent("Web Browser")}`
      );
      const data = (await res.json()) as VerifyResponse;
      if (res.ok && data.valid) {
        setIsUnlocked(true);
        setLicenseOwner(data.owner || "Pro license");
        localStorage.setItem("nexoreui_license_key", clean);
      } else {
        setIsUnlocked(false);
        setVerifyError(data.error || "License key is invalid or inactive. Check the key and try again.");
      }
    } catch {
      setIsUnlocked(false);
      setVerifyError("Could not reach the license server. Check your connection and try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    setRemoteCode(null);
    setRemoteCodeError(null);
    const stored =
      userLicenseKey || (typeof window !== "undefined" ? localStorage.getItem("nexoreui_license_key") : null);
    if (stored) {
      setLicenseKeyInput(stored);
      verifyLicenseKey(stored);
    }
  }, [isOpen, template.id, userLicenseKey]);

  useEffect(() => {
    if (!isOpen || !isUnlocked) return;
    const cleanKey = (
      licenseKeyInput ||
      (typeof window !== "undefined" ? localStorage.getItem("nexoreui_license_key") : "") ||
      ""
    ).trim();
    if (!cleanKey) return;

    let cancelled = false;
    setIsLoadingRemoteCode(true);
    setRemoteCodeError(null);

    const deviceId = getWebDeviceId();
    fetch(
      `/api/registry/pro?name=${encodeURIComponent(template.id)}&key=${encodeURIComponent(
        cleanKey
      )}&device_id=${encodeURIComponent(deviceId)}&device_name=${encodeURIComponent("Web Browser")}`
    )
      .then((res) => res.json() as Promise<ProRegistryResponse>)
      .then((data) => {
        if (cancelled) return;
        if (data.valid && data.content) {
          setRemoteCode(data.content);
        } else if (template.codeSnippet) {
          setRemoteCode(template.codeSnippet);
        } else {
          setRemoteCodeError(data.error || "Source code could not be loaded from the registry.");
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (template.codeSnippet) {
          setRemoteCode(template.codeSnippet);
        } else {
          setRemoteCodeError("Could not reach the template registry. Try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRemoteCode(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, isUnlocked, template.id, template.codeSnippet, licenseKeyInput, reloadNonce]);

  const rawSource = isUnlocked ? remoteCode || template.codeSnippet || "" : "";

  const customizedTsx = useMemo(
    () => (rawSource ? buildCustomizedTsx(rawSource, template, config, isUsersTable, dataMode) : ""),
    [rawSource, template, config, isUsersTable, dataMode]
  );

  const customizedCss = useMemo(
    () => `:root {
  --template-primary: ${config.colors.primary};
  --template-secondary: ${config.colors.secondary};
  --template-accent: ${config.colors.accent};
  --template-font: '${config.typography.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --template-heading-font: '${config.typography.headingFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --template-radius: ${RADIUS_VALUES[config.ui.radius]};
  --template-density: ${config.ui.density === "compact" ? "0.85" : config.ui.density === "relaxed" ? "1.2" : "1"};
}
`,
    [config]
  );

  const customizedCli = useMemo(() => {
    const cliCommand = template.cliCommand || `npx nexoreui add ${template.slug}`;
    const assetLines = hasMedia
      ? `\n\n${mediaAssets.map((a) => `curl -o public${a} https://www.nexoreui.com${a}`).join("\n")}`
      : "";
    return `npx nexoreui auth <your-license-key>\n${cliCommand}\nnpm install framer-motion lucide-react${
      isUsersTable && dataMode === "api-axios" ? " axios" : ""
    }${assetLines}`;
  }, [template.cliCommand, template.slug, hasMedia, mediaAssets, isUsersTable, dataMode]);

  const currentSnippet =
    activeTab === "code" ? customizedTsx : activeTab === "css" ? customizedCss : customizedCli;

  const codeLines = useMemo(() => (currentSnippet ? currentSnippet.split("\n") : []), [currentSnippet]);

  if (!isOpen) return null;

  const { name, subtitle } = formatTitle(template.title);
  const canCopyCurrent = activeTab !== "code" || (isUnlocked && Boolean(customizedTsx) && !isLoadingRemoteCode);
  const canDownloadCode = isUnlocked && Boolean(customizedTsx) && !isLoadingRemoteCode && !downloadingZip;

  const handleCopy = async () => {
    if (!canCopyCurrent) return;
    try {
      await navigator.clipboard.writeText(currentSnippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = async () => {
    if (!canDownloadCode) return;
    if (!hasMedia) {
      const blob = new Blob([customizedTsx], { type: "text/typescript;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${template.slug}.tsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    setDownloadingZip(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      zip.file(`${template.slug}.tsx`, customizedTsx);
      zip.file(
        "README.md",
        `# ${name}\n\n1. Copy \`${template.slug}.tsx\` into your project.\n2. Copy the \`public/\` directory from this archive into your project root.\n3. Install dependencies: npm install framer-motion lucide-react clsx tailwind-merge\n`
      );

      for (const assetPath of mediaAssets) {
        try {
          const res = await fetch(assetPath);
          if (res.ok) {
            const buf = await res.arrayBuffer();
            const relPath = `public/${assetPath.replace(/^\//, "")}`;
            zip.file(relPath, buf);
          }
        } catch {
          continue;
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${template.slug}-starter.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleSwitchLicense = () => {
    setIsUnlocked(false);
    setRemoteCode(null);
    setRemoteCodeError(null);
    setVerifyError(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={prefersReducedMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-md"
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id={titleId} className="truncate text-base font-semibold tracking-[-0.02em] text-foreground">
                  {name}
                </h2>
                {subtitle && (
                  <span className="hidden truncate text-sm text-muted-foreground sm:inline">
                    {subtitle}
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground tabular-nums">
                <span>{template.slug}.tsx</span>
                <span>·</span>
                {isUnlocked ? (
                  <>
                    <span>Unlocked ({licenseOwner || "Pro"})</span>
                    {codeLines.length > 0 && activeTab === "code" && (
                      <>
                        <span>·</span>
                        <span>{codeLines.length} lines</span>
                      </>
                    )}
                    <span>·</span>
                    <button
                      type="button"
                      onClick={handleSwitchLicense}
                      className={`underline hover:text-foreground cursor-pointer ${focusRing}`}
                    >
                      Change key
                    </button>
                  </>
                ) : (
                  <span>Pro license required</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close code dialog"
              className={`${buttonGhost} h-8 w-8 shrink-0 px-0`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-2.5">
            <div role="group" aria-label="Export format" className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-pressed={activeTab === "code"}
                onClick={() => setActiveTab("code")}
                className={
                  activeTab === "code"
                    ? `${buttonBase} border border-border bg-background text-foreground`
                    : buttonGhost
                }
              >
                <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Component (.tsx)</span>
              </button>
              <button
                type="button"
                aria-pressed={activeTab === "cli"}
                onClick={() => setActiveTab("cli")}
                className={
                  activeTab === "cli"
                    ? `${buttonBase} border border-border bg-background text-foreground`
                    : buttonGhost
                }
              >
                <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                <span>CLI</span>
              </button>
              <button
                type="button"
                aria-pressed={activeTab === "css"}
                onClick={() => setActiveTab("css")}
                className={
                  activeTab === "css"
                    ? `${buttonBase} border border-border bg-background text-foreground`
                    : buttonGhost
                }
              >
                <Palette className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Tokens (.css)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === "code" && isUnlocked && (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!canDownloadCode}
                  className={buttonOutline}
                >
                  {downloadingZip ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {downloadingZip
                      ? "Archiving..."
                      : hasMedia
                      ? "Download ZIP"
                      : `Download ${template.slug}.tsx`}
                  </span>
                </button>
              )}

              {(activeTab !== "code" || isUnlocked) && (
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!canCopyCurrent}
                  className={buttonPrimary}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span aria-live="polite">{copied ? "Copied" : "Copy code"}</span>
                </button>
              )}
            </div>
          </div>

          {isUsersTable && activeTab === "code" && isUnlocked && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background px-5 py-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted-foreground">
                  Data source
                </span>
                <div role="group" aria-label="Data source mode" className="inline-flex items-center gap-1">
                  {DATA_MODES.map((mode) => {
                    const active = dataMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setDataMode(mode.id)}
                        className={
                          active
                            ? `${buttonBase} h-7 border border-border bg-muted px-2.5 text-foreground`
                            : `${buttonGhost} h-7 px-2.5`
                        }
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <span className="hidden font-mono text-[11px] text-muted-foreground md:inline">
                {dataMode === "api-fetch" && "Uses native fetch with NEXT_PUBLIC_USERS_API_URL"}
                {dataMode === "api-axios" && "Uses axios client with NEXT_PUBLIC_USERS_API_URL"}
                {dataMode === "mock" && "Bundles static array inside the component file"}
              </span>
            </div>
          )}

          <div className="relative min-h-[380px] flex-1 overflow-auto bg-background">
            {activeTab === "code" && !isUnlocked ? (
              <div className="flex min-h-[380px] items-center justify-center p-6">
                <div className="w-full max-w-md rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.04em] text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Pro source access</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold tracking-[-0.02em] text-foreground">
                    Unlock {name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your license key to load the full TypeScript source and media bundle from the registry.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      verifyLicenseKey(licenseKeyInput);
                    }}
                    className="mt-5 space-y-3"
                  >
                    <div>
                      <label
                        htmlFor={licenseInputId}
                        className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.04em] text-muted-foreground"
                      >
                        License key
                      </label>
                      <input
                        id={licenseInputId}
                        type="text"
                        value={licenseKeyInput}
                        onChange={(e) => {
                          setLicenseKeyInput(e.target.value.toUpperCase());
                          if (verifyError) setVerifyError(null);
                        }}
                        placeholder="NX-PRO-XXXXXX-XXXXXX-XXXXXX"
                        autoComplete="off"
                        spellCheck={false}
                        className={`h-9 w-full rounded-md border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground ${focusRing} ${
                          verifyError ? "border-destructive" : "border-border"
                        }`}
                      />
                      {verifyError && (
                        <p role="alert" className="mt-1.5 text-xs text-destructive">
                          {verifyError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className={`${buttonPrimary} h-9 w-full`}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                          <span>Verifying key...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Unlock source code</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
                    <span className="text-muted-foreground">Don&apos;t have a key yet?</span>
                    <a
                      href="/pricing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 font-medium text-foreground hover:underline ${focusRing}`}
                    >
                      <span>View pricing</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            ) : activeTab === "code" && isLoadingRemoteCode ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center gap-2 p-6 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-foreground" aria-hidden="true" />
                <p className="font-mono text-xs">Fetching {template.slug}.tsx from registry...</p>
              </div>
            ) : activeTab === "code" && remoteCodeError && !customizedTsx ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-sm font-medium text-destructive">{remoteCodeError}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReloadNonce((n) => n + 1)}
                    className={buttonOutline}
                  >
                    Retry
                  </button>
                  <button type="button" onClick={handleSwitchLicense} className={buttonGhost}>
                    Change license key
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-w-full font-mono text-xs leading-6">
                <div
                  aria-hidden="true"
                  className="w-12 shrink-0 select-none border-r border-border bg-muted/30 px-3 py-4 text-right font-mono text-[11px] leading-6 text-muted-foreground tabular-nums sm:w-14"
                >
                  {codeLines.map((_, idx) => (
                    <div key={idx}>{idx + 1}</div>
                  ))}
                </div>
                <div className="w-full overflow-x-auto px-4 py-4 text-foreground">
                  {codeLines.map((line, idx) => (
                    <div key={idx} className="whitespace-pre">
                      {activeTab === "code" ? highlightSyntaxLine(line) : line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
