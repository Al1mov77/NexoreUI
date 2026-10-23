"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Server,
  Settings,
  Search,
  Sun,
  Moon,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  Menu,
  ChevronRight,
  SlidersHorizontal,
  Layers,
  Database,
  Globe2,
  Cpu,
  CornerDownLeft,
  Filter,
  Shield,
  Key,
  Smartphone,
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  Lock,
  Mail,
  Copy,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

type DateRange = "Today" | "7D" | "30D" | "90D";
type ChartType = "bar" | "line" | "area";
type TransactionStatus = "all" | "settled" | "pending" | "refunded";
type NavPage = "overview" | "analytics" | "users" | "infrastructure" | "settings";
type UserRoleFilter = "all" | "Admin" | "Member" | "Billing";
type DensityMode = "default" | "compact";

interface MetricItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  isPositive: boolean;
  history: number[];
}

interface TransactionItem {
  id: string;
  counterparty: string;
  accountRef: string;
  timestamp: string;
  amount: string;
  status: "settled" | "pending" | "refunded";
}

interface UserDirectoryItem {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member" | "Billing";
  status: "active" | "invited" | "suspended";
  lastSeen: string;
}

interface CommandItem {
  id: string;
  category: "Navigation" | "Actions" | "Filter";
  title: string;
  subtitle: string;
  action: () => void;
}

const PALETTE = {
  light: {
    bg: "#fafafa",
    surface: "#ffffff",
    surfaceElevated: "#f4f4f5",
    surfaceMuted: "#e4e4e7",
    line: "#e4e4e7",
    text: "#09090b",
    muted: "#71717a",
    accent: "#18181b",
    accentInk: "#ffffff",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  dark: {
    bg: "#09090b",
    surface: "#121215",
    surfaceElevated: "#1c1c20",
    surfaceMuted: "#27272a",
    line: "#27272a",
    text: "#f4f4f5",
    muted: "#a1a1aa",
    accent: "#ffffff",
    accentInk: "#09090b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
} as const;

const METRICS_BY_RANGE: Record<DateRange, MetricItem[]> = {
  Today: [
    { id: "rev", label: "Net Settlement", value: "$4,280", delta: "+3.2%", isPositive: true, history: [12, 18, 14, 22, 28, 24, 32] },
    { id: "ord", label: "Processed Orders", value: "86", delta: "+8.1%", isPositive: true, history: [8, 10, 9, 14, 12, 16, 15] },
    { id: "act", label: "Active Nodes", value: "2,149", delta: "-1.4%", isPositive: false, history: [45, 42, 44, 40, 39, 41, 38] },
    { id: "cr", label: "Conversion Rate", value: "4.02%", delta: "+0.3%", isPositive: true, history: [3.8, 3.9, 3.7, 4.1, 4.0, 4.2, 4.02] },
  ],
  "7D": [
    { id: "rev", label: "Net Settlement", value: "$31,420", delta: "+12.4%", isPositive: true, history: [22, 28, 25, 34, 40, 38, 46] },
    { id: "ord", label: "Processed Orders", value: "612", delta: "+9.8%", isPositive: true, history: [14, 18, 16, 22, 20, 24, 26] },
    { id: "act", label: "Active Nodes", value: "14,832", delta: "+6.2%", isPositive: true, history: [30, 32, 35, 38, 42, 44, 47] },
    { id: "cr", label: "Conversion Rate", value: "4.18%", delta: "+0.5%", isPositive: true, history: [3.7, 3.8, 3.9, 4.0, 4.1, 4.15, 4.18] },
  ],
  "30D": [
    { id: "rev", label: "Net Settlement", value: "$148,920", delta: "+18.6%", isPositive: true, history: [35, 42, 38, 56, 52, 68, 74] },
    { id: "ord", label: "Processed Orders", value: "2,847", delta: "+14.2%", isPositive: true, history: [20, 24, 22, 30, 28, 36, 40] },
    { id: "act", label: "Active Nodes", value: "62,410", delta: "+11.8%", isPositive: true, history: [40, 44, 48, 52, 58, 62, 66] },
    { id: "cr", label: "Conversion Rate", value: "4.64%", delta: "+0.8%", isPositive: true, history: [3.9, 4.0, 4.2, 4.3, 4.5, 4.6, 4.64] },
  ],
  "90D": [
    { id: "rev", label: "Net Settlement", value: "$412,500", delta: "+22.4%", isPositive: true, history: [40, 48, 45, 65, 62, 80, 92] },
    { id: "ord", label: "Processed Orders", value: "8,124", delta: "+19.1%", isPositive: true, history: [25, 30, 28, 38, 36, 46, 52] },
    { id: "act", label: "Active Nodes", value: "184,290", delta: "+16.4%", isPositive: true, history: [50, 56, 62, 70, 78, 86, 94] },
    { id: "cr", label: "Conversion Rate", value: "4.48%", delta: "+0.6%", isPositive: true, history: [3.8, 4.0, 4.1, 4.3, 4.4, 4.45, 4.48] },
  ],
};

const CHART_SERIES: Record<DateRange, { labels: string[]; values: number[] }> = {
  Today: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"],
    values: [320, 180, 450, 890, 1140, 780, 520],
  },
  "7D": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [3800, 4200, 3900, 5100, 5800, 4400, 4220],
  },
  "30D": {
    labels: ["W1", "W2", "W3", "W4", "W5"],
    values: [26400, 31200, 29800, 38500, 23020],
  },
  "90D": {
    labels: ["Month 1", "Month 2", "Month 3"],
    values: [124000, 138500, 150000],
  },
};

const TRANSACTIONS: TransactionItem[] = [
  { id: "TX-90412", counterparty: "Apex Systems Zurich", accountRef: "CH-9812", timestamp: "14:28:02 UTC", amount: "$12,480.00", status: "settled" },
  { id: "TX-90411", counterparty: "Kestrel BioTech AG", accountRef: "DE-4410", timestamp: "14:22:18 UTC", amount: "$3,640.50", status: "settled" },
  { id: "TX-90410", counterparty: "Vanguard Micro BV", accountRef: "NL-2041", timestamp: "14:15:44 UTC", amount: "$890.00", status: "pending" },
  { id: "TX-90409", counterparty: "Helios Energy SARL", accountRef: "FR-8821", timestamp: "13:58:30 UTC", amount: "$7,210.00", status: "settled" },
  { id: "TX-90408", counterparty: "Optima Data Corp", accountRef: "US-0193", timestamp: "13:41:12 UTC", amount: "$450.00", status: "refunded" },
  { id: "TX-90407", counterparty: "Nordic Logistics OY", accountRef: "FI-6204", timestamp: "13:19:05 UTC", amount: "$5,190.00", status: "settled" },
];

const CHANNELS = [
  { label: "Direct Enterprise API", share: 44, volume: "$65,524", rate: "+14.2%" },
  { label: "Partner Wire Settlement", share: 31, volume: "$46,165", rate: "+8.6%" },
  { label: "Automated ACH Clearing", share: 18, volume: "$26,805", rate: "+4.1%" },
  { label: "Card Processing Gateway", share: 7, volume: "$10,426", rate: "-1.8%" },
];

const DIRECTORY_USERS: UserDirectoryItem[] = [
  { id: "usr-1", name: "Sarah Chen", email: "sarah.chen@nexcore.net", role: "Admin", status: "active", lastSeen: "2 min ago" },
  { id: "usr-2", name: "Marcus Vance", email: "m.vance@nexcore.net", role: "Member", status: "active", lastSeen: "14 min ago" },
  { id: "usr-3", name: "Elena Rostova", email: "elena@nexcore.net", role: "Billing", status: "active", lastSeen: "1 hour ago" },
  { id: "usr-4", name: "David Kim", email: "d.kim@partner.io", role: "Member", status: "invited", lastSeen: "Yesterday" },
  { id: "usr-5", name: "Julian Thorne", email: "j.thorne@legacy.ch", role: "Member", status: "suspended", lastSeen: "4 days ago" },
];

const INFRASTRUCTURE_NODES = [
  { id: "gw", name: "Edge Gateway FRA-1", latency: "18ms", load: "34%", isHealthy: true },
  { id: "db", name: "Primary Postgres ZRH", latency: "2.4ms", load: "48%", isHealthy: true },
  { id: "cdn", name: "Global Anycast Mesh", latency: "99.8%", load: "12%", isHealthy: true },
  { id: "wrk", name: "Worker Fleet 24/24", latency: "0 faults", load: "41%", isHealthy: true },
];

const CONVERSION_STAGES = [
  { step: "Edge Visits", count: "248,190", conversion: "100%" },
  { step: "Documentation Reading", count: "98,420", conversion: "39.6%" },
  { step: "API Key Generated", count: "14,820", conversion: "15.1%" },
  { step: "Production Settlement", count: "2,847", conversion: "19.2%" },
];

const REGIONAL_TRAFFIC = [
  { region: "Western Europe (FRA/ZRH)", share: "48.2%", latency: "14ms", volume: "$71,800" },
  { region: "North America (IAD/SJC)", share: "34.1%", latency: "28ms", volume: "$50,780" },
  { region: "Asia Pacific (HND/SIN)", share: "14.5%", latency: "54ms", volume: "$21,600" },
  { region: "Latin America (GRU)", share: "3.2%", latency: "92ms", volume: "$4,740" },
];

function ResponsiveSparkline({
  points,
  strokeColor,
  fillColor,
}: {
  points: number[];
  strokeColor: string;
  fillColor: string;
}) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const padding = 1;

  const coords = points.map((val, idx) => {
    const x = padding + (idx / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${coords.join(" L ")}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <div className="w-16 sm:w-20 h-6 shrink-0">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-hidden">
        <path d={areaD} fill={fillColor} />
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function NexCoreAdminPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);

  useEffect(() => {
    if (!rootRef.current) return;
    const updateSize = () => {
      if (rootRef.current) {
        setContainerWidth(rootRef.current.clientWidth || rootRef.current.getBoundingClientRect().width);
      }
    };
    updateSize();
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);
  const isDesktop = !isMobile && !isTablet;

  const [internalDark, setInternalDark] = useState<boolean>(config.theme === "dark");
  useEffect(() => {
    setInternalDark(config.theme === "dark");
  }, [config.theme]);

  const palette = internalDark ? PALETTE.dark : PALETTE.light;
  const shouldReduceMotion = useReducedMotion();

  const [activePage, setActivePage] = useState<NavPage>("overview");
  const [dateRange, setDateRange] = useState<DateRange>("30D");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus>("all");
  const [userRoleFilter, setUserRoleFilter] = useState<UserRoleFilter>("all");
  const [userSearchText, setUserSearchText] = useState<string>("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [commandQuery, setCommandQuery] = useState<string>("");
  const [selectedCommandIndex, setSelectedCommandIndex] = useState<number>(0);
  const [exportToastVisible, setExportToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("Dataset exported successfully");
  const [activeHoverPoint, setActiveHoverPoint] = useState<number | null>(null);

  const [densityMode, setDensityMode] = useState<DensityMode>("default");
  const [twoFactorActive, setTwoFactorActive] = useState<boolean>(true);
  const [settingsTab, setSettingsTab] = useState<"general" | "appearance" | "security">("general");

  const currentMetrics = useMemo(() => METRICS_BY_RANGE[dateRange], [dateRange]);
  const currentChart = useMemo(() => CHART_SERIES[dateRange], [dateRange]);

  const filteredTransactions = useMemo(() => {
    if (statusFilter === "all") return TRANSACTIONS;
    return TRANSACTIONS.filter((item) => item.status === statusFilter);
  }, [statusFilter]);

  const filteredDirectoryUsers = useMemo(() => {
    return DIRECTORY_USERS.filter((usr) => {
      const matchesRole = userRoleFilter === "all" || usr.role === userRoleFilter;
      const matchesSearch =
        !userSearchText.trim() ||
        usr.name.toLowerCase().includes(userSearchText.toLowerCase()) ||
        usr.email.toLowerCase().includes(userSearchText.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [userRoleFilter, userSearchText]);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setExportToastVisible(true);
    const timer = setTimeout(() => {
      setExportToastVisible(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllUsers = () => {
    if (selectedUserIds.size === filteredDirectoryUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredDirectoryUsers.map((u) => u.id)));
    }
  };

  const commandItems: CommandItem[] = useMemo(() => {
    return [
      {
        id: "nav-overview",
        category: "Navigation",
        title: "Go to Overview",
        subtitle: "Real-time settlements, revenue chart, and capital distribution",
        action: () => {
          setActivePage("overview");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-analytics",
        category: "Navigation",
        title: "Go to Analytics",
        subtitle: "Conversion funnels, regional traffic latency, and throughput",
        action: () => {
          setActivePage("analytics");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-users",
        category: "Navigation",
        title: "Go to Users Directory",
        subtitle: "Manage authorized team credentials, roles, and access",
        action: () => {
          setActivePage("users");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-infra",
        category: "Navigation",
        title: "Go to Infrastructure Health",
        subtitle: "Cluster nodes, database query latency, and system checks",
        action: () => {
          setActivePage("infrastructure");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "nav-settings",
        category: "Navigation",
        title: "Go to Settings",
        subtitle: "Workspace profile, appearance theme, and 2FA security",
        action: () => {
          setActivePage("settings");
          setCommandPaletteOpen(false);
        },
      },
      {
        id: "act-theme",
        category: "Actions",
        title: internalDark ? "Switch to Light Mode" : "Switch to Dark Mode",
        subtitle: "Toggle administrative color palette",
        action: () => {
          setInternalDark((prev) => !prev);
          setCommandPaletteOpen(false);
          triggerToast(internalDark ? "Light mode enabled" : "Dark mode enabled");
        },
      },
      {
        id: "act-export",
        category: "Actions",
        title: "Export Ledger as CSV",
        subtitle: "Generate cryptographically signed export of current dataset",
        action: () => {
          setCommandPaletteOpen(false);
          triggerToast("Ledger CSV export verified");
        },
      },
      {
        id: "flt-30d",
        category: "Filter",
        title: "Filter: 30 Days Window",
        subtitle: "Recalculate operational metrics over a 30-day period",
        action: () => {
          setDateRange("30D");
          setCommandPaletteOpen(false);
          triggerToast("Time window set to 30 Days");
        },
      },
      {
        id: "flt-7d",
        category: "Filter",
        title: "Filter: 7 Days Window",
        subtitle: "Zoom view to 7-day settlement velocity",
        action: () => {
          setDateRange("7D");
          setCommandPaletteOpen(false);
          triggerToast("Time window set to 7 Days");
        },
      },
    ];
  }, [internalDark, triggerToast]);

  const matchingCommands = useMemo(() => {
    if (!commandQuery.trim()) return commandItems;
    const q = commandQuery.toLowerCase();
    return commandItems.filter(
      (cmd) => cmd.title.toLowerCase().includes(q) || cmd.subtitle.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q)
    );
  }, [commandItems, commandQuery]);

  useEffect(() => {
    setSelectedCommandIndex(0);
  }, [commandQuery]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        return;
      }
      if (!commandPaletteOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setCommandPaletteOpen(false);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedCommandIndex((prev) => (matchingCommands.length ? (prev + 1) % matchingCommands.length : 0));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedCommandIndex((prev) => (matchingCommands.length ? (prev - 1 + matchingCommands.length) % matchingCommands.length : 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (matchingCommands[selectedCommandIndex]) {
          matchingCommands[selectedCommandIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, matchingCommands, selectedCommandIndex]);

  const navList = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "users" as const, label: "Users", icon: Users },
    { id: "infrastructure" as const, label: "Infrastructure", icon: Server },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div
      ref={rootRef}
      className="w-full min-h-screen select-none overflow-x-clip transition-colors duration-150"
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
        fontFamily: '"Inter Tight", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
      />

      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full min-h-screen`}>
        {!isMobile && (
          <aside
            className={`shrink-0 border-r flex flex-col justify-between transition-all duration-150 ${
              isTablet ? "w-16" : "w-60"
            }`}
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.line,
            }}
          >
            <div>
              <div
                className={`flex items-center gap-3 px-4 py-4 border-b ${isTablet ? "justify-center px-1" : ""}`}
                style={{ borderColor: palette.line }}
              >
                <div
                  className="h-7 w-7 rounded flex items-center justify-center shrink-0"
                  style={{ backgroundColor: palette.accent, color: palette.accentInk }}
                >
                  <Layers className="h-4 w-4" />
                </div>
                {!isTablet && (
                  <div className="min-w-0">
                    <span className="font-bold text-sm tracking-tight block truncate">
                      {config.brandName || "NEXCORE"}
                    </span>
                    <span
                      className="text-[10px] tracking-wider block font-mono"
                      style={{ color: palette.muted, fontFamily: '"IBM Plex Mono", monospace' }}
                    >
                      WORKSPACE
                    </span>
                  </div>
                )}
              </div>

              <nav className="p-2 space-y-1">
                {navList.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActivePage(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-colors ${
                        isTablet ? "justify-center px-0 py-2.5" : ""
                      }`}
                      style={{
                        backgroundColor: isActive ? palette.surfaceElevated : "transparent",
                        color: isActive ? palette.text : palette.muted,
                        fontWeight: isActive ? 600 : 500,
                      }}
                      title={item.label}
                    >
                      <Icon className="h-4 w-4 shrink-0" style={{ color: isActive ? palette.text : palette.muted }} />
                      {!isTablet && <span>{item.label}</span>}
                      {!isTablet && isActive && (
                        <div
                          className="ml-auto w-1 h-3 rounded-full"
                          style={{ backgroundColor: palette.accent }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-3 border-t text-[11px] font-mono" style={{ borderColor: palette.line, color: palette.muted, fontFamily: '"IBM Plex Mono", monospace' }}>
              {!isTablet ? (
                <div className="flex items-center justify-between">
                  <span>v2.4.0</span>
                  <span className="flex items-center gap-1.5" style={{ color: palette.success }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.success }} />
                    PROD
                  </span>
                </div>
              ) : (
                <div className="flex justify-center">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.success }} />
                </div>
              )}
            </div>
          </aside>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <header
            className="sticky top-0 z-30 border-b px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3"
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.line,
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isMobile && (
                <button
                  onClick={() => setMobileDrawerOpen((prev) => !prev)}
                  className="p-1.5 rounded border"
                  style={{ borderColor: palette.line, color: palette.text }}
                  aria-label="Toggle navigation drawer"
                >
                  {mobileDrawerOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              )}

              <div className="flex items-center gap-2 min-w-0">
                {isMobile && (
                  <span className="font-bold text-sm tracking-tight truncate">
                    {config.brandName || "NEXCORE"}
                  </span>
                )}
                <span
                  className="text-[11px] font-mono px-2 py-0.5 rounded capitalize"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    color: palette.muted,
                    fontFamily: '"IBM Plex Mono", monospace',
                  }}
                >
                  {activePage}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded border text-xs transition-colors hover:opacity-85"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.line,
                  color: palette.muted,
                }}
              >
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden md:inline">Command...</span>
                <kbd
                  className="hidden sm:inline px-1 py-0.2 rounded text-[10px] font-mono border"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.line,
                    color: palette.text,
                    fontFamily: '"IBM Plex Mono", monospace',
                  }}
                >
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => {
                  setInternalDark((prev) => !prev);
                  triggerToast(internalDark ? "Light mode enabled" : "Dark mode enabled");
                }}
                className="p-1.5 sm:p-2 rounded border transition-colors hover:opacity-85"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.line,
                  color: palette.text,
                }}
                title={internalDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme mode"
              >
                {internalDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={() => triggerToast("Ledger CSV export verified")}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-semibold transition-colors hover:opacity-85"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.line,
                  color: palette.text,
                }}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
            </div>
          </header>

          <AnimatePresence>
            {isMobile && mobileDrawerOpen && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="border-b overflow-hidden px-4 py-3 space-y-2"
                style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line }}
              >
                <nav className="space-y-1">
                  {navList.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActivePage(item.id);
                          setMobileDrawerOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs"
                        style={{
                          backgroundColor: isActive ? palette.surface : "transparent",
                          color: isActive ? palette.text : palette.muted,
                          fontWeight: isActive ? 600 : 500,
                        }}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          <main className={`flex-1 ${densityMode === "compact" ? "p-3 sm:p-4 lg:p-5 space-y-4" : "p-4 sm:p-6 lg:p-7 space-y-5"}`}>
            {activePage === "overview" && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-base sm:text-lg font-bold tracking-tight">Executive Dashboard</h1>
                    <p className="text-xs" style={{ color: palette.muted }}>
                      Verified settlement throughput and active cluster metrics
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center p-0.5 rounded border text-xs"
                      style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line }}
                    >
                      {(["Today", "7D", "30D", "90D"] as const).map((range) => {
                        const isSelected = dateRange === range;
                        return (
                          <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className="relative px-2 py-1 text-xs transition-colors"
                            style={{
                              color: isSelected ? palette.accentInk : palette.muted,
                              fontFamily: '"IBM Plex Mono", monospace',
                            }}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeRangePill"
                                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 38 }}
                                className="absolute inset-0 rounded"
                                style={{ backgroundColor: palette.accent }}
                              />
                            )}
                            <span className="relative z-10 font-medium">{range}</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => triggerToast("Ledger CSV export verified")}
                      className="sm:hidden p-1.5 rounded border"
                      style={{ backgroundColor: palette.surface, borderColor: palette.line }}
                      title="Export CSV"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <section aria-labelledby="section-kpis">
                  <div className={`grid ${isMobile ? "grid-cols-2 gap-2.5" : isTablet ? "grid-cols-2 gap-3" : "grid-cols-4 gap-3.5"}`}>
                    {currentMetrics.map((kpi, idx) => {
                      const DeltaArrow = kpi.isPositive ? ArrowUpRight : ArrowDownRight;
                      const deltaColor = kpi.isPositive ? palette.success : palette.error;
                      return (
                        <motion.div
                          key={kpi.id}
                          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: idx * 0.04 }}
                          className="p-3.5 rounded border flex flex-col justify-between"
                          style={{
                            backgroundColor: palette.surface,
                            borderColor: palette.line,
                          }}
                        >
                          <div className="flex items-center justify-between mb-1.5 gap-1">
                            <span className="text-[11px] sm:text-xs font-medium truncate" style={{ color: palette.muted }}>
                              {kpi.label}
                            </span>
                            <div className="flex items-center text-[11px] font-semibold shrink-0" style={{ color: deltaColor }}>
                              <DeltaArrow className="h-3 w-3" />
                              <span style={{ fontFamily: '"IBM Plex Mono", monospace' }}>{kpi.delta}</span>
                            </div>
                          </div>

                          <div className="flex items-end justify-between gap-1.5 mt-1">
                            <span
                              className="text-lg sm:text-xl font-bold tracking-tight"
                              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                            >
                              {kpi.value}
                            </span>
                            <ResponsiveSparkline
                              points={kpi.history}
                              strokeColor={kpi.isPositive ? palette.text : palette.muted}
                              fillColor={internalDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>

                <section
                  aria-labelledby="section-chart"
                  className="p-4 sm:p-5 rounded border"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.line,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b" style={{ borderColor: palette.line }}>
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold tracking-tight">Settlement Trajectory</h2>
                      <p className="text-[11px]" style={{ color: palette.muted }}>
                        Aggregated clearing volumes across verified ledger entries
                      </p>
                    </div>

                    <div
                      className="flex items-center p-0.5 rounded border self-start sm:self-auto"
                      style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line }}
                    >
                      {(["bar", "line", "area"] as const).map((type) => {
                        const isSelected = chartType === type;
                        return (
                          <button
                            key={type}
                            onClick={() => setChartType(type)}
                            className="relative px-2 py-0.5 text-xs capitalize transition-colors"
                            style={{
                              color: isSelected ? palette.accentInk : palette.muted,
                            }}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="chartTypeSelect"
                                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 38 }}
                                className="absolute inset-0 rounded"
                                style={{ backgroundColor: palette.accent }}
                              />
                            )}
                            <span className="relative z-10 font-medium text-[11px]">{type}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="w-full h-44 sm:h-56 relative flex flex-col justify-end">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                      <div className="border-b border-dashed w-full" style={{ borderColor: palette.line }} />
                      <div className="border-b border-dashed w-full" style={{ borderColor: palette.line }} />
                      <div className="border-b border-dashed w-full" style={{ borderColor: palette.line }} />
                    </div>

                    {chartType === "bar" && (
                      <div className="w-full h-36 sm:h-44 flex items-end justify-between gap-2 sm:gap-4 z-10 px-1">
                        {currentChart.values.map((val, idx) => {
                          const maxVal = Math.max(...currentChart.values) || 1;
                          const heightPercent = Math.max(12, (val / maxVal) * 100);
                          const isHovered = activeHoverPoint === idx;

                          return (
                            <div
                              key={idx}
                              onMouseEnter={() => setActiveHoverPoint(idx)}
                              onMouseLeave={() => setActiveHoverPoint(null)}
                              className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                            >
                              {isHovered && (
                                <div
                                  className="absolute -top-8 px-1.5 py-0.5 rounded text-[10px] font-mono z-20 border whitespace-nowrap"
                                  style={{
                                    backgroundColor: palette.surfaceElevated,
                                    borderColor: palette.line,
                                    color: palette.text,
                                    fontFamily: '"IBM Plex Mono", monospace',
                                  }}
                                >
                                  ${val.toLocaleString()}
                                </div>
                              )}

                              <motion.div
                                initial={shouldReduceMotion ? { height: `${heightPercent}%` } : { height: 0 }}
                                animate={{ height: `${heightPercent}%` }}
                                transition={{ duration: 0.35, delay: idx * 0.03 }}
                                className="w-full rounded-t transition-colors"
                                style={{
                                  backgroundColor: isHovered ? palette.text : palette.surfaceElevated,
                                  borderTop: `2px solid ${palette.text}`,
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {(chartType === "line" || chartType === "area") && (
                      <div className="w-full h-36 sm:h-44 relative z-10">
                        {(() => {
                          const width = 800;
                          const height = 140;
                          const padding = 12;
                          const vals = currentChart.values;
                          const max = Math.max(...vals) || 1;
                          const min = Math.min(...vals);
                          const range = max - min || 1;

                          const points = vals.map((v, i) => {
                            const x = padding + (i / (vals.length - 1)) * (width - padding * 2);
                            const y = height - padding - ((v - min) / range) * (height - padding * 2);
                            return { x, y, val: v };
                          });

                          const pathD = points.reduce((acc, pt, i) => {
                            return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                          }, "");

                          const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

                          return (
                            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                              {chartType === "area" && (
                                <path
                                  d={areaD}
                                  fill={internalDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)"}
                                />
                              )}
                              <path
                                d={pathD}
                                fill="none"
                                stroke={palette.text}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              {points.map((pt, i) => (
                                <circle
                                  key={i}
                                  cx={pt.x}
                                  cy={pt.y}
                                  r={activeHoverPoint === i ? "4.5" : "3"}
                                  fill={palette.surface}
                                  stroke={palette.text}
                                  strokeWidth="2"
                                  onMouseEnter={() => setActiveHoverPoint(i)}
                                  onMouseLeave={() => setActiveHoverPoint(null)}
                                  className="cursor-pointer"
                                />
                              ))}
                            </svg>
                          );
                        })()}
                      </div>
                    )}

                    <div
                      className="flex items-center justify-between w-full pt-2 border-t text-[10px] font-mono"
                      style={{ borderColor: palette.line, color: palette.muted, fontFamily: '"IBM Plex Mono", monospace' }}
                    >
                      {currentChart.labels.map((lbl, idx) => (
                        <span key={idx} className="truncate">
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                <section
                  aria-labelledby="section-operations"
                  className={`grid ${isMobile || isTablet ? "grid-cols-1 gap-4" : "grid-cols-12 gap-5"}`}
                >
                  <div
                    className={`${isMobile || isTablet ? "w-full" : "col-span-5"} p-4 rounded border`}
                    style={{ backgroundColor: palette.surface, borderColor: palette.line }}
                  >
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b" style={{ borderColor: palette.line }}>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider">Capital Ingestion</h3>
                        <p className="text-[11px]" style={{ color: palette.muted }}>
                          Settlement share by channel
                        </p>
                      </div>
                      <SlidersHorizontal className="h-3.5 w-3.5" style={{ color: palette.muted }} />
                    </div>

                    <div className="h-1.5 rounded overflow-hidden flex w-full mb-4" style={{ backgroundColor: palette.surfaceElevated }}>
                      <div style={{ width: "44%", backgroundColor: palette.text }} />
                      <div style={{ width: "31%", backgroundColor: palette.muted }} />
                      <div style={{ width: "18%", backgroundColor: palette.warning }} />
                      <div style={{ width: "7%", backgroundColor: palette.line }} />
                    </div>

                    <div className="space-y-3">
                      {CHANNELS.map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-xs">
                          <div>
                            <p className="font-medium text-[11px]">{item.label}</p>
                            <p
                              className="text-[10px]"
                              style={{ color: palette.muted, fontFamily: '"IBM Plex Mono", monospace' }}
                            >
                              {item.share}% share
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[11px]" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
                              {item.volume}
                            </p>
                            <p
                              className="text-[10px] font-semibold"
                              style={{
                                color: item.rate.startsWith("+") ? palette.success : palette.error,
                                fontFamily: '"IBM Plex Mono", monospace',
                              }}
                            >
                              {item.rate}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`${isMobile || isTablet ? "w-full" : "col-span-7"} p-4 rounded border`}
                    style={{ backgroundColor: palette.surface, borderColor: palette.line }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 pb-2.5 border-b" style={{ borderColor: palette.line }}>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider">Operational Clearing</h3>
                        <p className="text-[11px]" style={{ color: palette.muted }}>
                          Latest network transactions
                        </p>
                      </div>

                      <div
                        className="flex items-center p-0.5 rounded border text-[10px]"
                        style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line }}
                      >
                        {(["all", "settled", "pending", "refunded"] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-2 py-0.5 capitalize rounded ${
                              statusFilter === st ? "font-semibold" : "opacity-75"
                            }`}
                            style={{
                              backgroundColor: statusFilter === st ? palette.surface : "transparent",
                              color: statusFilter === st ? palette.text : palette.muted,
                            }}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="divide-y" style={{ borderColor: palette.line }}>
                      {filteredTransactions.map((tx) => {
                        const statusColor =
                          tx.status === "settled" ? palette.success : tx.status === "pending" ? palette.warning : palette.error;
                        return (
                          <div key={tx.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                            <div className="min-w-0">
                              <p className="font-medium text-[11px] truncate">{tx.counterparty}</p>
                              <div
                                className="flex items-center gap-1.5 text-[10px]"
                                style={{ color: palette.muted, fontFamily: '"IBM Plex Mono", monospace' }}
                              >
                                <span>{tx.id}</span>
                                <span>{tx.timestamp}</span>
                              </div>
                            </div>

                            <div className="text-right shrink-0 flex items-center gap-2">
                              <span className="font-semibold text-xs" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
                                {tx.amount}
                              </span>
                              <span
                                className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                                style={{
                                  backgroundColor: palette.surfaceElevated,
                                  color: statusColor,
                                  border: `1px solid ${palette.line}`,
                                  fontFamily: '"IBM Plex Mono", monospace',
                                }}
                              >
                                {tx.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activePage === "analytics" && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-base sm:text-lg font-bold tracking-tight">Analytics & Yield</h1>
                  <p className="text-xs" style={{ color: palette.muted }}>
                    Full-funnel customer lifecycle velocity and regional latency metrics
                  </p>
                </div>

                <div className={`grid ${isMobile ? "grid-cols-2 gap-2.5" : "grid-cols-4 gap-3.5"}`}>
                  {CONVERSION_STAGES.map((stg) => (
                    <div
                      key={stg.step}
                      className="p-3.5 rounded border"
                      style={{ backgroundColor: palette.surface, borderColor: palette.line }}
                    >
                      <p className="text-[11px] font-medium" style={{ color: palette.muted }}>{stg.step}</p>
                      <p className="text-lg font-bold mt-1" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
                        {stg.count}
                      </p>
                      <p className="text-[10px] mt-0.5 font-semibold" style={{ color: palette.success }}>
                        {stg.conversion} conversion
                      </p>
                    </div>
                  ))}
                </div>

                <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-5"}`}>
                  <div className="p-4 rounded border" style={{ backgroundColor: palette.surface, borderColor: palette.line }}>
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b" style={{ borderColor: palette.line }}>
                      <h2 className="text-xs font-bold uppercase tracking-wider">Regional Routing Velocity</h2>
                      <Globe2 className="h-4 w-4" style={{ color: palette.muted }} />
                    </div>

                    <div className="space-y-3">
                      {REGIONAL_TRAFFIC.map((item) => (
                        <div key={item.region} className="flex items-center justify-between text-xs">
                          <div>
                            <p className="font-medium text-[11px]">{item.region}</p>
                            <p className="text-[10px]" style={{ color: palette.muted, fontFamily: '"IBM Plex Mono", monospace' }}>
                              Latency: {item.latency}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-xs" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>{item.volume}</p>
                            <p className="text-[10px]" style={{ color: palette.muted, fontFamily: '"IBM Plex Mono", monospace' }}>{item.share}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded border" style={{ backgroundColor: palette.surface, borderColor: palette.line }}>
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b" style={{ borderColor: palette.line }}>
                      <h2 className="text-xs font-bold uppercase tracking-wider">Throughput Integrity</h2>
                      <Cpu className="h-4 w-4" style={{ color: palette.muted }} />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: palette.muted }}>P95 Edge Response Time</span>
                          <span className="font-mono font-bold">18.4ms</span>
                        </div>
                        <div className="h-1.5 w-full rounded overflow-hidden" style={{ backgroundColor: palette.surfaceElevated }}>
                          <div style={{ width: "24%", backgroundColor: palette.success, height: "100%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: palette.muted }}>Error Budget Burn</span>
                          <span className="font-mono font-bold" style={{ color: palette.success }}>0.02%</span>
                        </div>
                        <div className="h-1.5 w-full rounded overflow-hidden" style={{ backgroundColor: palette.surfaceElevated }}>
                          <div style={{ width: "2%", backgroundColor: palette.success, height: "100%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: palette.muted }}>Postgres Read Replicas Sync</span>
                          <span className="font-mono font-bold">0.8ms lag</span>
                        </div>
                        <div className="h-1.5 w-full rounded overflow-hidden" style={{ backgroundColor: palette.surfaceElevated }}>
                          <div style={{ width: "9%", backgroundColor: palette.success, height: "100%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage === "users" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-base sm:text-lg font-bold tracking-tight">Team Credentials & Directory</h1>
                    <p className="text-xs" style={{ color: palette.muted }}>
                      Manage cryptographic roles, members, and authorization status
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerToast("Invitation email dispatched")}
                      className="px-3 py-1.5 rounded text-xs font-semibold"
                      style={{ backgroundColor: palette.accent, color: palette.accentInk }}
                    >
                      Invite Member
                    </button>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded border space-y-3" style={{ backgroundColor: palette.surface, borderColor: palette.line }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded border text-xs flex-1 max-w-sm" style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line }}>
                      <Search className="h-3.5 w-3.5" style={{ color: palette.muted }} />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={userSearchText}
                        onChange={(e) => setUserSearchText(e.target.value)}
                        className="bg-transparent outline-none w-full text-xs"
                        style={{ color: palette.text }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 p-0.5 rounded border text-xs" style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line }}>
                      {(["all", "Admin", "Member", "Billing"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setUserRoleFilter(r)}
                          className={`px-2 py-0.5 rounded text-[11px] ${userRoleFilter === r ? "font-semibold" : "opacity-75"}`}
                          style={{
                            backgroundColor: userRoleFilter === r ? palette.surface : "transparent",
                            color: userRoleFilter === r ? palette.text : palette.muted,
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-[11px]" style={{ borderColor: palette.line, color: palette.muted }}>
                          <th className="py-2 px-2">
                            <input
                              type="checkbox"
                              checked={selectedUserIds.size === filteredDirectoryUsers.length && filteredDirectoryUsers.length > 0}
                              onChange={toggleSelectAllUsers}
                              className="rounded cursor-pointer"
                            />
                          </th>
                          <th className="py-2 px-2 font-medium">Member</th>
                          <th className="py-2 px-2 font-medium">Role</th>
                          <th className="py-2 px-2 font-medium">Status</th>
                          <th className="py-2 px-2 font-medium">Last Active</th>
                          <th className="py-2 px-2 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: palette.line }}>
                        {filteredDirectoryUsers.map((u) => {
                          const isSelected = selectedUserIds.has(u.id);
                          return (
                            <tr key={u.id} className="transition-colors hover:opacity-90">
                              <td className="py-2.5 px-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectUser(u.id)}
                                  className="rounded cursor-pointer"
                                />
                              </td>
                              <td className="py-2.5 px-2">
                                <p className="font-semibold">{u.name}</p>
                                <p className="text-[10px]" style={{ color: palette.muted }}>{u.email}</p>
                              </td>
                              <td className="py-2.5 px-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono border" style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line, fontFamily: '"IBM Plex Mono", monospace' }}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="py-2.5 px-2">
                                <span
                                  className="text-[11px] font-semibold capitalize"
                                  style={{
                                    color: u.status === "active" ? palette.success : u.status === "invited" ? palette.warning : palette.muted,
                                  }}
                                >
                                  {u.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-[11px] font-mono" style={{ color: palette.muted, fontFamily: '"IBM Plex Mono", monospace' }}>
                                {u.lastSeen}
                              </td>
                              <td className="py-2.5 px-2 text-right">
                                <button
                                  onClick={() => triggerToast(`Copied ${u.email}`)}
                                  className="p-1 rounded hover:opacity-80"
                                  title="Copy email"
                                >
                                  <Copy className="h-3.5 w-3.5" style={{ color: palette.muted }} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-[11px]" style={{ borderColor: palette.line, color: palette.muted }}>
                    <span>Showing {filteredDirectoryUsers.length} authorized accounts</span>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 rounded border" style={{ borderColor: palette.line }}>Previous</button>
                      <button className="px-2 py-1 rounded border" style={{ borderColor: palette.line }}>Next</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage === "infrastructure" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-base sm:text-lg font-bold tracking-tight">Cluster Infrastructure</h1>
                    <p className="text-xs" style={{ color: palette.muted }}>
                      Live heartbeat monitoring and node redundancy verification
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: palette.success }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.success }} />
                    HEALTHY
                  </div>
                </div>

                <div className={`grid ${isMobile ? "grid-cols-1 sm:grid-cols-2 gap-3" : "grid-cols-4 gap-4"}`}>
                  {INFRASTRUCTURE_NODES.map((node) => (
                    <div
                      key={node.id}
                      className="p-3.5 rounded border"
                      style={{ backgroundColor: palette.surface, borderColor: palette.line }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold truncate">{node.name}</span>
                        <Server className="h-3.5 w-3.5" style={{ color: palette.muted }} />
                      </div>
                      <div className="flex items-baseline justify-between font-mono" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
                        <span className="text-sm font-bold">{node.latency}</span>
                        <span className="text-[11px]" style={{ color: palette.muted }}>load: {node.load}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded border space-y-3" style={{ backgroundColor: palette.surface, borderColor: palette.line }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider">Deployment & Event Audit Log</h2>
                  <div className="divide-y text-xs font-mono" style={{ borderColor: palette.line, fontFamily: '"IBM Plex Mono", monospace' }}>
                    {[
                      { time: "14:31:02 UTC", msg: "Postgres index vacuum completed on primary cluster", code: "OK 200" },
                      { time: "14:18:44 UTC", msg: "Edge mesh TLS certificates renewed automatically", code: "OK 200" },
                      { time: "13:50:12 UTC", msg: "Automated container failover test passed with 0 dropped packets", code: "PASS" },
                      { time: "12:04:39 UTC", msg: "Hourly ledger checksum verified against remote S3 replica", code: "SYNC" },
                    ].map((log, i) => (
                      <div key={i} className="py-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 truncate">
                          <span style={{ color: palette.muted }}>{log.time}</span>
                          <span className="truncate">{log.msg}</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0" style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line, color: palette.success }}>
                          {log.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePage === "settings" && (
              <div className="space-y-4">
                <div>
                  <h1 className="text-base sm:text-lg font-bold tracking-tight">Workspace Preferences</h1>
                  <p className="text-xs" style={{ color: palette.muted }}>
                    Configure color appearance, visual density, and credential security
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-0.5 rounded border w-fit text-xs" style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line }}>
                  {(["general", "appearance", "security"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSettingsTab(tab)}
                      className={`px-3 py-1 capitalize rounded text-xs ${settingsTab === tab ? "font-semibold" : "opacity-75"}`}
                      style={{
                        backgroundColor: settingsTab === tab ? palette.surface : "transparent",
                        color: settingsTab === tab ? palette.text : palette.muted,
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {settingsTab === "general" && (
                  <div className="p-4 rounded border space-y-4 max-w-xl" style={{ backgroundColor: palette.surface, borderColor: palette.line }}>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">Workspace Identifier</label>
                      <input
                        type="text"
                        defaultValue={config.brandName || "NEXCORE"}
                        className="w-full px-3 py-2 rounded border text-xs outline-none"
                        style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line, color: palette.text }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">Settlement Currency</label>
                      <select
                        className="w-full px-3 py-2 rounded border text-xs outline-none"
                        style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.line, color: palette.text }}
                      >
                        <option>USD ($) — United States Dollar</option>
                        <option>EUR (€) — Euro</option>
                        <option>CHF (Fr) — Swiss Franc</option>
                      </select>
                    </div>

                    <button
                      onClick={() => triggerToast("Workspace settings saved")}
                      className="px-3.5 py-1.5 rounded text-xs font-semibold"
                      style={{ backgroundColor: palette.accent, color: palette.accentInk }}
                    >
                      Save Configuration
                    </button>
                  </div>
                )}

                {settingsTab === "appearance" && (
                  <div className="p-4 rounded border space-y-5 max-w-xl" style={{ backgroundColor: palette.surface, borderColor: palette.line }}>
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-2">Theme Mode</h2>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setInternalDark(false);
                            triggerToast("Light theme applied");
                          }}
                          className={`p-3 rounded border text-left flex items-center justify-between ${!internalDark ? "ring-2" : ""}`}
                          style={{
                            backgroundColor: PALETTE.light.surface,
                            borderColor: PALETTE.light.line,
                            color: PALETTE.light.text,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            <span className="text-xs font-semibold">Light Mode</span>
                          </div>
                          {!internalDark && <Check className="h-4 w-4" />}
                        </button>

                        <button
                          onClick={() => {
                            setInternalDark(true);
                            triggerToast("Dark theme applied");
                          }}
                          className={`p-3 rounded border text-left flex items-center justify-between ${internalDark ? "ring-2" : ""}`}
                          style={{
                            backgroundColor: PALETTE.dark.surface,
                            borderColor: PALETTE.dark.line,
                            color: PALETTE.dark.text,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            <span className="text-xs font-semibold">Dark Mode</span>
                          </div>
                          {internalDark && <Check className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider mb-2">Interface Density</h2>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setDensityMode("default");
                            triggerToast("Default spacing applied");
                          }}
                          className="p-3 rounded border text-left flex items-center justify-between"
                          style={{
                            backgroundColor: palette.surfaceElevated,
                            borderColor: palette.line,
                          }}
                        >
                          <div>
                            <p className="text-xs font-semibold">Standard</p>
                            <p className="text-[10px]" style={{ color: palette.muted }}>Generous breathing room</p>
                          </div>
                          {densityMode === "default" && <Check className="h-4 w-4" />}
                        </button>

                        <button
                          onClick={() => {
                            setDensityMode("compact");
                            triggerToast("Compact spacing applied");
                          }}
                          className="p-3 rounded border text-left flex items-center justify-between"
                          style={{
                            backgroundColor: palette.surfaceElevated,
                            borderColor: palette.line,
                          }}
                        >
                          <div>
                            <p className="text-xs font-semibold">Compact</p>
                            <p className="text-[10px]" style={{ color: palette.muted }}>High information density</p>
                          </div>
                          {densityMode === "compact" && <Check className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "security" && (
                  <div className="p-4 rounded border space-y-4 max-w-xl" style={{ backgroundColor: palette.surface, borderColor: palette.line }}>
                    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: palette.line }}>
                      <div>
                        <p className="text-xs font-semibold">Hardware Two-Factor Authentication</p>
                        <p className="text-[11px]" style={{ color: palette.muted }}>Enforce WebAuthn security keys for all members</p>
                      </div>
                      <button
                        onClick={() => {
                          setTwoFactorActive((prev) => !prev);
                          triggerToast(twoFactorActive ? "2FA disabled" : "2FA enforced");
                        }}
                        className="px-3 py-1 rounded text-xs font-semibold border"
                        style={{
                          backgroundColor: twoFactorActive ? palette.surfaceElevated : "transparent",
                          borderColor: palette.line,
                          color: twoFactorActive ? palette.success : palette.muted,
                        }}
                      >
                        {twoFactorActive ? "Enabled" : "Disabled"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-xs font-semibold">Active Authorized Sessions</p>
                        <p className="text-[11px]" style={{ color: palette.muted }}>3 devices currently authenticated via token</p>
                      </div>
                      <button
                        onClick={() => triggerToast("Other sessions revoked")}
                        className="px-3 py-1 rounded text-xs font-semibold border"
                        style={{
                          borderColor: palette.line,
                          color: palette.error,
                        }}
                      >
                        Revoke All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
              onClick={() => setCommandPaletteOpen(false)}
              className="fixed inset-0 bg-black/60"
            />

            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -10 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-lg rounded border shadow-2xl overflow-hidden z-10"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.line,
                color: palette.text,
              }}
            >
              <div
                className="flex items-center gap-3 px-3.5 py-3 border-b"
                style={{ borderColor: palette.line }}
              >
                <Search className="h-4 w-4 shrink-0" style={{ color: palette.muted }} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or filter..."
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-xs"
                  style={{ color: palette.text }}
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="p-1 rounded hover:opacity-75"
                  style={{ color: palette.muted }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
                {matchingCommands.length === 0 ? (
                  <div className="p-4 text-center text-xs" style={{ color: palette.muted }}>
                    No matching commands found.
                  </div>
                ) : (
                  matchingCommands.map((cmd, idx) => {
                    const isSelected = idx === selectedCommandIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedCommandIndex(idx)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors text-xs"
                        style={{
                          backgroundColor: isSelected ? palette.surfaceElevated : "transparent",
                          color: palette.text,
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        <div>
                          <p className="text-xs">{cmd.title}</p>
                          <p
                            className="text-[10px]"
                            style={{ color: palette.muted }}
                          >
                            {cmd.subtitle}
                          </p>
                        </div>
                        <CornerDownLeft
                          className="h-3.5 w-3.5 opacity-40 shrink-0"
                          style={{ opacity: isSelected ? 1 : 0.4 }}
                        />
                      </button>
                    );
                  })
                )}
              </div>

              <div
                className="px-3.5 py-1.5 border-t flex items-center justify-between text-[10px]"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.line,
                  color: palette.muted,
                  fontFamily: '"IBM Plex Mono", monospace',
                }}
              >
                <span>↑ ↓ Navigate | ↵ Run</span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {exportToastVisible && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-5 right-5 z-50 p-3 rounded border shadow-lg flex items-center gap-2.5 text-xs"
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.line,
              color: palette.text,
            }}
          >
            <div
              className="h-4 w-4 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: palette.success, color: palette.accentInk }}
            >
              <Check className="h-2.5 w-2.5" />
            </div>
            <div>
              <p className="font-semibold text-xs">{toastMessage}</p>
              <p
                className="text-[10px]"
                style={{ color: palette.muted, fontFamily: '"IBM Plex Mono", monospace' }}
              >
                verified by local node
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
