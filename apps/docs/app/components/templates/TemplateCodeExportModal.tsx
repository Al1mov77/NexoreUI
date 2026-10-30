"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  Palette,
  Sparkles,
  ExternalLink,
  Code2,
  Lock,
  Key,
  Loader2,
  ShieldCheck,
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

const TEMPLATE_MEDIA_ASSETS: Record<string, string[]> = {
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

function highlightSyntaxLine(line: string) {
  const trimmed = line.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
    return <span className="text-zinc-500 italic">{line}</span>;
  }

  const tokenRegex =
    /(".*?"|'.*?'|`.*?`|\/\/.*$|\b(?:import|export|default|from|const|let|var|function|return|async|await|if|else|try|catch|finally|switch|case|new|typeof|interface|type|extends|as)\b|\b(?:useState|useEffect|useMemo|useRef|useCallback)\b|\b(?:string|number|boolean|any|void|UserItem|UserRole|UserDepartment|UserStatus|TemplateConfig)\b|<\/?[A-Za-z0-9_.]+|\b\d+\b)/g;

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
        <span key={match.index} className="text-zinc-500 italic">
          {token}
        </span>
      );
    } else if (
      token.startsWith('"') ||
      token.startsWith("'") ||
      token.startsWith("`")
    ) {
      parts.push(
        <span key={match.index} className="text-emerald-400">
          {token}
        </span>
      );
    } else if (
      /^(?:import|export|default|from|const|let|var|function|return|async|await|if|else|try|catch|finally|switch|case|new|typeof|interface|type|extends|as)$/.test(
        token
      )
    ) {
      parts.push(
        <span key={match.index} className="text-foreground/90 font-semibold">
          {token}
        </span>
      );
    } else if (
      /^(?:useState|useEffect|useMemo|useRef|useCallback)$/.test(token)
    ) {
      parts.push(
        <span key={match.index} className="text-foreground font-bold">
          {token}
        </span>
      );
    } else if (
      /^(?:string|number|boolean|any|void|UserItem|UserRole|UserDepartment|UserStatus|TemplateConfig)$/.test(
        token
      )
    ) {
      parts.push(
        <span key={match.index} className="text-amber-300 font-medium">
          {token}
        </span>
      );
    } else if (token.startsWith("<") || token.startsWith("</")) {
      parts.push(
        <span key={match.index} className="text-pink-400 font-medium">
          {token}
        </span>
      );
    } else if (/^\d+$/.test(token)) {
      parts.push(
        <span key={match.index} className="text-orange-300">
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
  const isUsersTable =
    template.id === "template-users-table-pro" || template.slug === "nexusers-table-pro";
  const [dataMode, setDataMode] = useState<"api-fetch" | "api-axios" | "mock">(
    "api-fetch"
  );
  const [activeTab, setActiveTab] = useState<"code" | "css" | "cli">("code");
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const mediaAssets = TEMPLATE_MEDIA_ASSETS[template.id] || TEMPLATE_MEDIA_ASSETS[template.slug] || [];
  const hasMedia = mediaAssets.length > 0;

  const { isPro: isUserPro, licenseKey: userLicenseKey } = useProStatus();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [licenseKeyInput, setLicenseKeyInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [licenseOwner, setLicenseOwner] = useState<string | null>(null);
  const [remoteCode, setRemoteCode] = useState<string | null>(null);
  const [isLoadingRemoteCode, setIsLoadingRemoteCode] = useState(false);
  const [remoteCodeError, setRemoteCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const stored = userLicenseKey || (typeof window !== "undefined" ? localStorage.getItem("nexoreui_license_key") : null);
    if (stored) {
      setLicenseKeyInput(stored);
      verifyLicenseKey(stored);
    }
  }, [isOpen]);

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
    const deviceName = "Web Browser";
    fetch(
      `/api/registry/pro?name=${encodeURIComponent(template.id)}&key=${encodeURIComponent(cleanKey)}&device_id=${encodeURIComponent(deviceId)}&device_name=${encodeURIComponent(deviceName)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.valid && data.content) {
          setRemoteCode(data.content);
        } else {
          setRemoteCodeError(data.error || "Failed to load template source code.");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setRemoteCodeError("Failed to reach secure Pro registry.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRemoteCode(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, isUnlocked, template.id, licenseKeyInput]);

  function getWebDeviceId(): string {
    if (typeof window === "undefined") return "web_ssr";
    let id = localStorage.getItem("nexoreui_device_id");
    if (!id) {
      id = "web_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem("nexoreui_device_id", id);
    }
    return id;
  }

  async function verifyLicenseKey(keyToVerify: string) {
    const clean = keyToVerify.trim().toUpperCase();
    if (!clean) {
      setVerifyError("License key is required");
      return;
    }
    setIsVerifying(true);
    setVerifyError(null);
    try {
      const deviceId = getWebDeviceId();
      const deviceName = "Web Browser";
      const res = await fetch(
        `/api/licenses/verify?key=${encodeURIComponent(clean)}&device_id=${encodeURIComponent(
          deviceId
        )}&device_name=${encodeURIComponent(deviceName)}`
      );
      const data = await res.json();
      if (res.ok && data.valid) {
        setIsUnlocked(true);
        setLicenseOwner(data.owner || "Verified Pro Member");
        localStorage.setItem("nexoreui_license_key", clean);
      } else {
        setIsUnlocked(false);
        setVerifyError(data.error || "Invalid or inactive license key");
      }
    } catch {
      setIsUnlocked(false);
      setVerifyError("License verification service unreachable");
    } finally {
      setIsVerifying(false);
    }
  }

  if (!isOpen) return null;

  // ─── DYNAMIC CODE GENERATOR (ADAPTS TO USER'S STUDIO CUSTOMIZATIONS) ───────────
  const lockedPlaceholder = `// ─── NEXOREUI PRO TEMPLATE SOURCE CODE (PROTECTED) ─────────────────────────
// Licensed under NexoreUI Lifetime Pro License.
// Authenticate with your Pro License Key to view and export full production code.

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ${template.title.replace(/[^a-zA-Z0-9]/g, "")}() {
  // [PRO STANDALONE CODE BLURRED - LICENSE VERIFICATION REQUIRED]
  // • Swiss High-Precision Design System Tokens
  // • Framer Motion Micro-Interactions & Responsive Layouts
  // • Accessible ARIA Standards & Server Component Clean Architecture
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Complete standalone code unlocks instantly with your Pro key */}
    </div>
  );
}`;

  const rawSource = isUnlocked ? (remoteCode || template.codeSnippet || "") : lockedPlaceholder;
  let customizedTsx = rawSource;

  // 1. NEXFOLIO (Portfolio template dynamic customization)
  if (template.id === "template-portfolio-pro" || template.slug === "nexfolio-portfolio-pro") {
    const customName = config.brandName || "Kaelen Vance";
    const customRole = config.brandTagline || "Principal Design Eng";
    const customAvatar = config.customLogoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
    const customHeadline = config.heroTitle || "Crafting high-precision interfaces for visionary engineering teams.";
    const customBio = config.heroSubtitle || "I partner with founders and product teams to bridge the chasm between Swiss rationalist design and zero-compromise frontend engineering. Currently Staff Design Engineer at Vercel.";
    const customEmail = config.portfolioConfig?.email || "kaelen.vance@nexore.design";
    const customLocation = config.portfolioConfig?.location || "Zurich";

    customizedTsx = customizedTsx
      .replace(/Kaelen Vance/g, customName)
      .replace(/Principal Design Eng/g, customRole)
      .replace(/https:\/\/images\.unsplash\.com\/photo-1534528741775-53994a69daeb\?auto=format&fit=crop&w=120&q=80/g, customAvatar)
      .replace(/Crafting high-precision interfaces for visionary engineering teams\./g, customHeadline)
      .replace(/I partner with founders and product teams to bridge the chasm between Swiss rationalist design and zero-compromise frontend engineering\. Currently Staff Design Engineer at Vercel\./g, customBio)
      .replace(/kaelen\.vance@nexore\.design/g, customEmail)
      .replace(/"Europe\/Zurich"/g, `"${customLocation === "San Francisco" ? "America/Los_Angeles" : customLocation === "London" ? "Europe/London" : customLocation === "Tokyo" ? "Asia/Tokyo" : "Europe/Zurich"}"`)
      .replace(/Zurich/g, customLocation);
  }

  // 2. NEXUSERS (Table Users template dynamic customization: Live API fetch, axios, or Mock)
  else if (isUsersTable) {
    const apiEndpoint = config.swaggerApiUrl || "https://dummyjson.com/users";

    if (dataMode === "api-fetch") {
      // ⚡ REVOLUTIONARY CLEAN CODE: Completely strip out bulky 350-line INITIAL_USERS array!
      const apiEndpointHeader = `// ─── API CONFIGURATION (ZERO BUNDLE BLOAT) ───────────────────────────────────
// Live REST / Swagger API Endpoint. Configure in .env.local via NEXT_PUBLIC_USERS_API_URL:
export const USERS_API_ENDPOINT =
  process.env.NEXT_PUBLIC_USERS_API_URL || "${apiEndpoint}";

`;
      const mockArrayRegex = /export\s+const\s+INITIAL_USERS:\s*UserItem\[\]\s*=\s*\[[\s\S]*?\n\];/;
      if (mockArrayRegex.test(customizedTsx)) {
        customizedTsx = customizedTsx.replace(mockArrayRegex, apiEndpointHeader);
      }

      // Inject clean fetch hook & loading state
      const apiHookCode = `  // ─── DATA STATE ─────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // ─── LIVE REST / SWAGGER API SYNC (NATIVE NEXT.JS 15 FETCH) ────────────────
  useEffect(() => {
    let isMounted = true;
    async function fetchApiUsers() {
      try {
        setIsLoading(true);
        setApiError(null);
        const res = await fetch(USERS_API_ENDPOINT);
        if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
        const data = await res.json();
        const raw = Array.isArray(data) ? data : data.users || data.items || data.data || [];
        if (isMounted) {
          const mapped: UserItem[] = raw.map((u: any, idx: number) => ({
            id: u.id ? String(u.id) : \`usr-\${idx + 1}\`,
            name: u.name || \`\${u.firstName || ""} \${u.lastName || ""}\`.trim() || "Enterprise Member",
            email: u.email || \`user\${idx + 1}@domain.com\`,
            avatar: u.avatar || u.image || \`https://images.unsplash.com/photo-\${1534528741775 + idx}?auto=format&fit=crop&w=200&q=80\`,
            role: (u.role as UserRole) || (idx % 3 === 0 ? "Senior Developer" : idx % 2 === 0 ? "Product Designer" : "Lead Architect"),
            department: (u.department as UserDepartment) || (idx % 2 === 0 ? "Engineering" : "Design"),
            status: (u.status === "active" || u.status === "invited" || u.status === "suspended") ? u.status : (idx % 4 === 0 ? "invited" : "active"),
            lastActive: "Just now",
            joinedDate: "2026",
            twoFactorEnabled: Boolean(u.twoFactorEnabled ?? true),
            location: u.location || u.address?.city || "San Francisco, US",
            projectsCount: Number(u.projectsCount || ((idx * 3) % 12) + 2),
          }));
          setUsers(mapped);
        }
      } catch (err: any) {
        if (isMounted) {
          setApiError(err.message || "Failed to load users from API");
        }
        console.error("API Fetch Error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchApiUsers();
    return () => {
      isMounted = false;
    };
  }, []);`;

      customizedTsx = customizedTsx.replace(
        "  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);",
        apiHookCode
      );
    } else if (dataMode === "api-axios") {
      // 📡 AXIOS ARCHITECTURE: Strip mock data + import axios
      const apiEndpointHeader = `// ─── API CONFIGURATION (AXIOS CLIENT) ─────────────────────────────────────────
// Configure in .env.local via NEXT_PUBLIC_USERS_API_URL:
export const USERS_API_ENDPOINT =
  process.env.NEXT_PUBLIC_USERS_API_URL || "${apiEndpoint}";

`;
      const mockArrayRegex = /export\s+const\s+INITIAL_USERS:\s*UserItem\[\]\s*=\s*\[[\s\S]*?\n\];/;
      if (mockArrayRegex.test(customizedTsx)) {
        customizedTsx = customizedTsx.replace(mockArrayRegex, apiEndpointHeader);
      }

      // Add axios import
      customizedTsx = `import axios from "axios";\n${customizedTsx}`;

      const axiosHookCode = `  // ─── DATA STATE ─────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // ─── LIVE REST / SWAGGER API SYNC (AXIOS CLIENT) ───────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function fetchApiUsers() {
      try {
        setIsLoading(true);
        setApiError(null);
        const { data } = await axios.get(USERS_API_ENDPOINT);
        const raw = Array.isArray(data) ? data : data.users || data.items || data.data || [];
        if (isMounted) {
          const mapped: UserItem[] = raw.map((u: any, idx: number) => ({
            id: u.id ? String(u.id) : \`usr-\${idx + 1}\`,
            name: u.name || \`\${u.firstName || ""} \${u.lastName || ""}\`.trim() || "Enterprise Member",
            email: u.email || \`user\${idx + 1}@domain.com\`,
            avatar: u.avatar || u.image || \`https://images.unsplash.com/photo-\${1534528741775 + idx}?auto=format&fit=crop&w=200&q=80\`,
            role: (u.role as UserRole) || (idx % 3 === 0 ? "Senior Developer" : idx % 2 === 0 ? "Product Designer" : "Lead Architect"),
            department: (u.department as UserDepartment) || (idx % 2 === 0 ? "Engineering" : "Design"),
            status: (u.status === "active" || u.status === "invited" || u.status === "suspended") ? u.status : (idx % 4 === 0 ? "invited" : "active"),
            lastActive: "Just now",
            joinedDate: "2026",
            twoFactorEnabled: Boolean(u.twoFactorEnabled ?? true),
            location: u.location || u.address?.city || "San Francisco, US",
            projectsCount: Number(u.projectsCount || ((idx * 3) % 12) + 2),
          }));
          setUsers(mapped);
        }
      } catch (err: any) {
        if (isMounted) {
          setApiError(err.message || "Failed to load users via Axios");
        }
        console.error("Axios Error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchApiUsers();
    return () => {
      isMounted = false;
    };
  }, []);`;

      customizedTsx = customizedTsx.replace(
        "  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);",
        axiosHookCode
      );
    } else if (dataMode === "mock") {
      // 📦 OFFLINE MOCK MODE
      if (config.customUsersData && config.customUsersData.length > 0) {
        const formattedMock = `// ─── CUSTOM OFFLINE MOCK DATASET ─────────────────────────────────────────────
export const INITIAL_USERS: UserItem[] = ${JSON.stringify(config.customUsersData, null, 2)};`;
        const mockArrayRegex = /export\s+const\s+INITIAL_USERS:\s*UserItem\[\]\s*=\s*\[[\s\S]*?\n\];/;
        if (mockArrayRegex.test(customizedTsx)) {
          customizedTsx = customizedTsx.replace(mockArrayRegex, formattedMock);
        }
      }
    }
  }

  // 3. NEXCORE (Admin Dashboard template dynamic customization)
  else if (template.id === "template-nexcore-admin-pro" || template.slug === "nexcore-admin-pro") {
    if (config.brandName) {
      customizedTsx = customizedTsx.replace(/NexCore/g, config.brandName);
    }
    if (config.adminConfig?.currency) {
      customizedTsx = customizedTsx.replace(/\$128,430/g, `${config.adminConfig.currency}128,430`);
    }
  }

  // 4. Clean Header banner
  customizedTsx = `// ============================================================================
// NexoreUI Production Template: ${template.title}
// Clean, 100% full, non-truncated standalone React / Next.js 15 component.
// Generated via NexoreUI Studio for: "${config.brandName || "Production"}"
// Architecture: ${isUsersTable ? (dataMode === "api-fetch" ? "Live API (Native Next.js fetch)" : dataMode === "api-axios" ? "Live API (Axios Client)" : "Offline Mock Dataset") : "Standalone"}
// ============================================================================

${customizedTsx.trim()}
`;

  const customizedCss = `/* NexoreUI Design Tokens for ${template.title} */
:root {
  --template-primary: ${config.colors.primary};
  --template-secondary: ${config.colors.secondary};
  --template-accent: ${config.colors.accent};
  --template-font: '${config.typography.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --template-heading-font: '${config.typography.headingFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --template-radius: ${RADIUS_VALUES[config.ui.radius]};
  --template-density: ${config.ui.density === "compact" ? "0.85" : config.ui.density === "relaxed" ? "1.2" : "1"};
  
  /* Semantic Colors */
  --template-bg: ${config.theme === "dark" ? "#090a0f" : "#ffffff"};
  --template-surface: ${config.theme === "dark" ? "#12141c" : "#f8f9fa"};
  --template-border: ${config.theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"};
  --template-fg: ${config.theme === "dark" ? "#f4f4f7" : "#0f172a"};
  --template-fg-muted: ${config.theme === "dark" ? "#9aa0aa" : "#475569"};
}
`;

  const mediaCliNote = hasMedia
    ? `\n# 4. Media assets are automatically placed in public/videos/ by the CLI.\n# If adding manually, fetch video directly:\n${mediaAssets.map((a) => `curl -o public${a} https://www.nexoreui.site${a}`).join("\n")}\n`
    : "";

  const customizedCli = `# 1. Authenticate CLI with your Pro license:
npx nexoreui auth <your-license-key>

# 2. Add ${template.title} to your project:
${template.cliCommand}

# 3. Required production dependencies:
npm install framer-motion lucide-react${isUsersTable && dataMode === "api-axios" ? " axios" : ""}
${mediaCliNote}`;

  const currentSnippet =
    activeTab === "code" ? customizedTsx : activeTab === "css" ? customizedCss : customizedCli;

  const handleCopy = () => {
    if (!isUnlocked && activeTab === "code") {
      return;
    }
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!isUnlocked || downloadingZip) return;
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
        `# ${template.title}\n\n1. Copy \`${template.slug}.tsx\` into your project.\n2. The \`public/videos/\` folder inside this archive includes the required video asset.\n3. Install dependencies: npm install framer-motion lucide-react clsx tailwind-merge\n`
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
    } catch {
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl rounded-3xl border border-white/10 bg-[#090a0f] text-zinc-100 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Mac-style Window Header */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-zinc-950/90 backdrop-blur-xl">
            <div className="flex items-center gap-3 min-w-0">
              {/* macOS Traffic Lights */}
              <div className="flex items-center gap-1.5 mr-1">
                <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-400/40 shadow-xs" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400/40 shadow-xs" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/40 shadow-xs" />
              </div>

              <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
                    {template.title}
                  </h3>
                  {isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Pro Unlocked</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>Pro Required</span>
                    </span>
                  )}
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-white/10">
                    {template.slug}.tsx
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5 truncate">
                  {isUnlocked
                    ? `Licensed to ${licenseOwner || "Pro Member"} • Full Source Access`
                    : "Standalone React 19 / Next.js 15 • Pro License Required"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Tabs & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 pt-2.5 border-b border-white/10 bg-zinc-900/60 gap-3">
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-1.5 pb-2.5 px-2.5 border-b-2 font-medium transition-all cursor-pointer ${
                  activeTab === "code"
                    ? "border-indigo-500 text-white font-bold"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Component Code (.tsx)</span>
              </button>
              <button
                onClick={() => setActiveTab("cli")}
                className={`flex items-center gap-1.5 pb-2.5 px-2.5 border-b-2 font-medium transition-all cursor-pointer ${
                  activeTab === "cli"
                    ? "border-indigo-500 text-white font-bold"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>CLI Command</span>
              </button>
              <button
                onClick={() => setActiveTab("css")}
                className={`flex items-center gap-1.5 pb-2.5 px-2.5 border-b-2 font-medium transition-all cursor-pointer ${
                  activeTab === "css"
                    ? "border-indigo-500 text-white font-bold"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Tailwind Tokens (.css)</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={() => {
                  if (!isUnlocked && activeTab === "code") {
                    return;
                  }
                  handleCopy();
                }}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
                  isUnlocked || activeTab !== "code"
                    ? "bg-zinc-800 hover:bg-zinc-700 border-white/10 text-white cursor-pointer active:scale-95"
                    : "bg-zinc-900 border-white/5 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : isUnlocked || activeTab !== "code" ? "Copy Code" : "Locked (Pro)"}</span>
              </button>

              {activeTab === "code" && (
                <button
                  onClick={() => {
                    if (!isUnlocked || downloadingZip) return;
                    handleDownload();
                  }}
                  disabled={!isUnlocked || downloadingZip}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 ${
                    isUnlocked
                      ? "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer active:scale-95"
                      : "bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-60"
                  }`}
                >
                  {downloadingZip ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {downloadingZip
                      ? "Packaging ZIP..."
                      : hasMedia
                      ? "Download ZIP (with Video)"
                      : "Download .tsx"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Architecture Selector for Table Users (API fetch vs Axios vs Mock) */}
          {isUsersTable && activeTab === "code" && (
            <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-2 border-b border-white/10 bg-zinc-950/80 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-zinc-400">Architecture:</span>
                <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-white/10 text-[11px]">
                  <button
                    onClick={() => setDataMode("api-fetch")}
                    className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      dataMode === "api-fetch"
                        ? "bg-indigo-600 text-white font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>⚡ Live API (fetch)</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-500/30 text-indigo-200">Recommended</span>
                  </button>
                  <button
                    onClick={() => setDataMode("api-axios")}
                    className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      dataMode === "api-axios"
                        ? "bg-indigo-600 text-white font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>📡 Live API (axios)</span>
                  </button>
                  <button
                    onClick={() => setDataMode("mock")}
                    className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                      dataMode === "mock"
                        ? "bg-indigo-600 text-white font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>📦 Offline Mock Data</span>
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 font-mono hidden md:block">
                {dataMode === "api-fetch" && "Zero bundle bloat • Native Next.js 15 fetch • URL link in code"}
                {dataMode === "api-axios" && "Enterprise axios client • Interceptors & error handling"}
                {dataMode === "mock" && "Standalone offline array • No network requests required"}
              </div>
            </div>
          )}

          {/* Code Viewer with macOS Line Numbers & Rich Syntax Token Highlighting */}
          <div className="flex-1 overflow-auto font-mono text-xs bg-[#08090d] select-text relative min-h-[360px]">
            {activeTab === "code" ? (
              <>
                <div
                  className={`min-w-full flex ${
                    !isUnlocked ? "filter blur-[6px] select-none pointer-events-none opacity-20" : ""
                  }`}
                >
                  {/* Gutter with line numbers */}
                  <div className="select-none py-4 px-3 text-right text-zinc-600 bg-[#06070a] border-r border-white/5 font-mono text-[11px] leading-6 shrink-0 w-12 sm:w-14">
                    {currentSnippet.split("\n").map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  {/* Syntax highlighted lines */}
                  <div className="py-4 px-4 leading-6 overflow-x-auto w-full selection:bg-indigo-600/40">
                    {currentSnippet.split("\n").map((line, i) => (
                      <div key={i} className="whitespace-pre hover:bg-white/[0.02]">
                        {highlightSyntaxLine(line)}
                      </div>
                    ))}
                  </div>
                </div>

                {!isUnlocked && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="w-full max-w-md p-6 rounded-2xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Lock className="h-5 w-5 text-zinc-300" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold tracking-tight text-white">NexoreUI Pro Template</h4>
                          <p className="text-xs text-zinc-400">Enter your license key to unlock production source code</p>
                        </div>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          verifyLicenseKey(licenseKeyInput);
                        }}
                        className="space-y-3"
                      >
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5 tracking-wider">
                            License Key
                          </label>
                          <input
                            type="text"
                            value={licenseKeyInput}
                            onChange={(e) => setLicenseKeyInput(e.target.value.toUpperCase())}
                            placeholder="NX-PRO-XXXXXX-XXXXXX-XXXXXX"
                            className="w-full h-10 px-3 font-mono text-xs rounded-lg border border-white/10 bg-zinc-900 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white/30"
                          />
                        </div>

                        {verifyError && (
                          <p className="text-xs text-rose-400">{verifyError}</p>
                        )}

                        <button
                          type="submit"
                          disabled={isVerifying}
                          className="w-full h-9 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <>
                              <Key className="h-3.5 w-3.5" />
                              <span>Unlock Template Code</span>
                            </>
                          )}
                        </button>
                      </form>

                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Launch access is $39</span>
                        <a
                          href="/pricing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:underline font-medium inline-flex items-center gap-1"
                        >
                          <span>Get Pro License</span>
                          <ExternalLink className="h-3 w-3 text-zinc-400" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-5 overflow-x-auto leading-relaxed text-zinc-200">
                <pre className="font-mono text-xs"><code>{currentSnippet}</code></pre>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
