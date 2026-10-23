"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Edit2,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Download,
  RefreshCw,
  Eye,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Copy,
  Sun,
  Moon,
  LayoutGrid,
  List,
  AlertTriangle,
  UserX,
  Clock,
  MapPin,
  Globe,
  Database,
  Code2,
  SlidersHorizontal,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

const FONT = {
  display: "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'IBM Plex Mono', Menlo, Monaco, Consolas, monospace",
};

const PALETTE = {
  light: {
    bg: "#eaeef2",
    surface: "#ffffff",
    surfaceAlt: "#dfe5eb",
    line: "#c8d0d9",
    text: "#0f1722",
    muted: "#5b6776",
    accent: "#0a6cff",
    accentInk: "#ffffff",
  },
  dark: {
    bg: "#0a0e14",
    surface: "#11161f",
    surfaceAlt: "#161d27",
    line: "#1f2937",
    text: "#e2e8f0",
    muted: "#64748b",
    accent: "#3b82f6",
    accentInk: "#ffffff",
  },
  status: {
    active: "#10b981",
    pending: "#f59e0b",
    suspended: "#ef4444",
  },
};

const M1_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
};

export type UserRole =
  | "Super Admin"
  | "Admin"
  | "Lead Architect"
  | "Senior Developer"
  | "Product Designer"
  | "Product Manager"
  | "Growth Marketing"
  | "SecOps Lead"
  | "Viewer";

export type UserDepartment =
  | "Engineering"
  | "Product"
  | "Design"
  | "Marketing"
  | "Operations"
  | "Security";

export type UserStatus = "active" | "invited" | "suspended";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department: UserDepartment;
  status: UserStatus;
  lastActive: string;
  joinedDate: string;
  twoFactorEnabled: boolean;
  location: string;
  projectsCount: number;
}

export const INITIAL_USERS: UserItem[] = [
  {
    id: "usr-01",
    name: "Sarah Chen",
    email: "sarah.chen@nexore.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "Super Admin",
    department: "Engineering",
    status: "active",
    lastActive: "Just now",
    joinedDate: "Jan 12, 2025",
    twoFactorEnabled: true,
    location: "San Francisco, US",
    projectsCount: 14,
  },
  {
    id: "usr-02",
    name: "Alex Rivera",
    email: "alex.rivera@nexore.io",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    role: "Product Designer",
    department: "Design",
    status: "active",
    lastActive: "4m ago",
    joinedDate: "Feb 03, 2025",
    twoFactorEnabled: true,
    location: "New York, US",
    projectsCount: 9,
  },
  {
    id: "usr-03",
    name: "Marcus Vance",
    email: "marcus.vance@nexore.io",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    role: "Lead Architect",
    department: "Engineering",
    status: "active",
    lastActive: "18m ago",
    joinedDate: "Mar 19, 2025",
    twoFactorEnabled: true,
    location: "Seattle, US",
    projectsCount: 12,
  },
  {
    id: "usr-04",
    name: "Elena Rostova",
    email: "elena.rostova@nexore.io",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    role: "Admin",
    department: "Engineering",
    status: "active",
    lastActive: "1h ago",
    joinedDate: "Apr 04, 2025",
    twoFactorEnabled: true,
    location: "Austin, US",
    projectsCount: 16,
  },
  {
    id: "usr-05",
    name: "David Sterling",
    email: "david.s@nexore.io",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    role: "Product Manager",
    department: "Product",
    status: "active",
    lastActive: "2h ago",
    joinedDate: "May 15, 2025",
    twoFactorEnabled: true,
    location: "Chicago, US",
    projectsCount: 11,
  },
  {
    id: "usr-06",
    name: "Maya Patel",
    email: "maya.patel@nexore.io",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    lastActive: "5m ago",
    joinedDate: "Jun 22, 2025",
    twoFactorEnabled: true,
    location: "London, UK",
    projectsCount: 8,
  },
  {
    id: "usr-07",
    name: "Jordan Kim",
    email: "jordan.kim@nexore.io",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    role: "Growth Marketing",
    department: "Marketing",
    status: "active",
    lastActive: "Yesterday",
    joinedDate: "Jul 10, 2025",
    twoFactorEnabled: false,
    location: "Toronto, CA",
    projectsCount: 6,
  },
  {
    id: "usr-08",
    name: "Liam O'Connor",
    email: "liam.oc@nexore.io",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    role: "Lead Architect",
    department: "Engineering",
    status: "active",
    lastActive: "35m ago",
    joinedDate: "Aug 02, 2025",
    twoFactorEnabled: true,
    location: "Dublin, IE",
    projectsCount: 10,
  },
  {
    id: "usr-09",
    name: "Sophia Thorne",
    email: "sophia.t@nexore.io",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    role: "Product Designer",
    department: "Design",
    status: "invited",
    lastActive: "Pending",
    joinedDate: "Sep 28, 2026",
    twoFactorEnabled: false,
    location: "Berlin, DE",
    projectsCount: 2,
  },
  {
    id: "usr-10",
    name: "Noah Tanaka",
    email: "noah.t@nexore.io",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    role: "SecOps Lead",
    department: "Security",
    status: "active",
    lastActive: "12m ago",
    joinedDate: "Aug 18, 2025",
    twoFactorEnabled: true,
    location: "Tokyo, JP",
    projectsCount: 15,
  },
  {
    id: "usr-11",
    name: "Olivia Morales",
    email: "olivia.m@nexore.io",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    role: "Product Manager",
    department: "Product",
    status: "active",
    lastActive: "3h ago",
    joinedDate: "Sep 01, 2025",
    twoFactorEnabled: true,
    location: "Madrid, ES",
    projectsCount: 7,
  },
  {
    id: "usr-12",
    name: "Ethan Wright",
    email: "ethan.w@nexore.io",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    role: "Senior Developer",
    department: "Engineering",
    status: "suspended",
    lastActive: "5d ago",
    joinedDate: "Oct 14, 2025",
    twoFactorEnabled: false,
    location: "Boston, US",
    projectsCount: 4,
  },
  {
    id: "usr-13",
    name: "Ava Dubois",
    email: "ava.dubois@nexore.io",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    role: "Product Designer",
    department: "Design",
    status: "active",
    lastActive: "14m ago",
    joinedDate: "Nov 03, 2025",
    twoFactorEnabled: true,
    location: "Paris, FR",
    projectsCount: 5,
  },
  {
    id: "usr-14",
    name: "Lucas Santos",
    email: "lucas.s@nexore.io",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80",
    role: "Viewer",
    department: "Operations",
    status: "active",
    lastActive: "1d ago",
    joinedDate: "Nov 20, 2025",
    twoFactorEnabled: false,
    location: "Sao Paulo, BR",
    projectsCount: 3,
  },
  {
    id: "usr-15",
    name: "Emma Watson",
    email: "emma.w@nexore.io",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    role: "Product Manager",
    department: "Product",
    status: "active",
    lastActive: "8m ago",
    joinedDate: "Dec 05, 2025",
    twoFactorEnabled: true,
    location: "Cambridge, UK",
    projectsCount: 9,
  },
  {
    id: "usr-16",
    name: "James Wilson",
    email: "james.w@nexore.io",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    role: "Senior Developer",
    department: "Engineering",
    status: "invited",
    lastActive: "Pending",
    joinedDate: "Sep 27, 2026",
    twoFactorEnabled: false,
    location: "Sydney, AU",
    projectsCount: 1,
  },
  {
    id: "usr-17",
    name: "Chloe Bennet",
    email: "chloe.b@nexore.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "Admin",
    department: "Operations",
    status: "active",
    lastActive: "25m ago",
    joinedDate: "Jan 08, 2026",
    twoFactorEnabled: true,
    location: "Denver, US",
    projectsCount: 8,
  },
  {
    id: "usr-18",
    name: "Daniel Zhao",
    email: "daniel.z@nexore.io",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    role: "Lead Architect",
    department: "Engineering",
    status: "active",
    lastActive: "Just now",
    joinedDate: "Jan 19, 2026",
    twoFactorEnabled: true,
    location: "Singapore, SG",
    projectsCount: 13,
  },
  {
    id: "usr-19",
    name: "Mia Lindqvist",
    email: "mia.l@nexore.io",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80",
    role: "Product Designer",
    department: "Design",
    status: "active",
    lastActive: "42m ago",
    joinedDate: "Feb 02, 2026",
    twoFactorEnabled: true,
    location: "Stockholm, SE",
    projectsCount: 7,
  },
  {
    id: "usr-20",
    name: "Oliver King",
    email: "oliver.k@nexore.io",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    role: "SecOps Lead",
    department: "Security",
    status: "active",
    lastActive: "2h ago",
    joinedDate: "Feb 14, 2026",
    twoFactorEnabled: true,
    location: "Zurich, CH",
    projectsCount: 11,
  },
  {
    id: "usr-21",
    name: "Isabella Rossi",
    email: "isabella.r@nexore.io",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    role: "Growth Marketing",
    department: "Marketing",
    status: "suspended",
    lastActive: "7d ago",
    joinedDate: "Feb 24, 2026",
    twoFactorEnabled: false,
    location: "Milan, IT",
    projectsCount: 3,
  },
  {
    id: "usr-22",
    name: "William Zhang",
    email: "william.z@nexore.io",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    lastActive: "1h ago",
    joinedDate: "Mar 05, 2026",
    twoFactorEnabled: true,
    location: "Vancouver, CA",
    projectsCount: 6,
  },
  {
    id: "usr-23",
    name: "Hannah Schmidt",
    email: "hannah.s@nexore.io",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    role: "Viewer",
    department: "Operations",
    status: "invited",
    lastActive: "Pending",
    joinedDate: "Sep 29, 2026",
    twoFactorEnabled: false,
    location: "Munich, DE",
    projectsCount: 1,
  },
  {
    id: "usr-24",
    name: "Gabriel Costa",
    email: "gabriel.c@nexore.io",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    lastActive: "10m ago",
    joinedDate: "Mar 18, 2026",
    twoFactorEnabled: true,
    location: "Lisbon, PT",
    projectsCount: 8,
  },
];

export function NexUsersTablePreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const shouldReduceMotion = useReducedMotion();

  const initialTheme = config.theme ?? "dark";
  const [internalDark, setInternalDark] = useState<boolean>(initialTheme === "dark");

  useEffect(() => {
    if (config.theme) {
      setInternalDark(config.theme === "dark");
    }
  }, [config.theme]);

  const C = internalDark ? PALETTE.dark : PALETTE.light;
  const springTransition = shouldReduceMotion ? { duration: 0 } : M1_SPRING;

  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);

  useEffect(() => {
    if (!rootRef.current) return;
    const updateWidth = () => {
      if (rootRef.current) {
        setContainerWidth(rootRef.current.clientWidth || rootRef.current.getBoundingClientRect().width);
      }
    };
    updateWidth();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);

  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [isApiPanelOpen, setIsApiPanelOpen] = useState(false);
  const [apiPanelMode, setApiPanelMode] = useState<"endpoint" | "json">("endpoint");
  const [apiUrlInput, setApiUrlInput] = useState("https://dummyjson.com/users");
  const [isFetchingApi, setIsFetchingApi] = useState(false);
  const [apiStatusMessage, setApiStatusMessage] = useState<string | null>(null);
  const [apiStatusType, setApiStatusType] = useState<"success" | "error" | null>(null);
  const [rawJsonInput, setRawJsonInput] = useState(
    JSON.stringify(INITIAL_USERS.slice(0, 3), null, 2)
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const [sortField, setSortField] = useState<keyof UserItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(8);

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [activeDrawerUser, setActiveDrawerUser] = useState<UserItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserItem | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: UserRole;
    department: UserDepartment;
    status: UserStatus;
    location: string;
    twoFactorEnabled: boolean;
  }>({
    name: "",
    email: "",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    location: "San Francisco, US",
    twoFactorEnabled: true,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, roleFilter, deptFilter]);

  useEffect(() => {
    const handleOutside = () => setOpenActionId(null);
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDrawerUser(null);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setDeleteConfirmUser(null);
        setIsBulkDeleteModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSyncApi = async (urlOverride?: string) => {
    const targetUrl = urlOverride || apiUrlInput;
    if (!targetUrl.trim()) return;

    setIsFetchingApi(true);
    setApiStatusMessage(null);
    setApiStatusType(null);

    try {
      const res = await fetch(targetUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : data.users || data.items || data.data || [];

      if (!rawList || rawList.length === 0) {
        throw new Error("No user records found in response array");
      }

      const rolesList: UserRole[] = [
        "Super Admin",
        "Admin",
        "Lead Architect",
        "Senior Developer",
        "Product Designer",
        "Product Manager",
        "Growth Marketing",
        "SecOps Lead",
        "Viewer",
      ];
      const deptsList: UserDepartment[] = [
        "Engineering",
        "Product",
        "Design",
        "Marketing",
        "Operations",
        "Security",
      ];

      const mapped: UserItem[] = rawList.map((u: any, idx: number) => {
        const parsedRole = (u.role || u.company?.title || rolesList[idx % rolesList.length]) as UserRole;
        const parsedDept = (u.department || u.company?.department || deptsList[idx % deptsList.length]) as UserDepartment;
        const parsedStatus: UserStatus =
          u.status === "active" || u.status === "invited" || u.status === "suspended"
            ? u.status
            : idx % 6 === 0
            ? "invited"
            : idx % 10 === 0
            ? "suspended"
            : "active";

        return {
          id: u.id ? `usr-${u.id}` : `usr-api-${idx + 1}`,
          name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || `User ${idx + 1}`,
          email: u.email || `user.${idx + 1}@nexore.io`,
          avatar:
            u.image ||
            u.avatar ||
            INITIAL_USERS[idx % INITIAL_USERS.length].avatar,
          role: rolesList.includes(parsedRole) ? parsedRole : "Senior Developer",
          department: deptsList.includes(parsedDept) ? parsedDept : "Engineering",
          status: parsedStatus,
          lastActive: idx % 3 === 0 ? "Just now" : `${(idx * 7) % 55 + 2}m ago`,
          joinedDate: `2025`,
          twoFactorEnabled: Boolean(u.twoFactorEnabled ?? idx % 2 === 0),
          location: u.address?.city ? `${u.address.city}, US` : u.location || "San Francisco, US",
          projectsCount: Number(u.projectsCount || ((idx * 3) % 12) + 1),
        };
      });

      setUsers(mapped);
      setSelectedIds(new Set());
      setApiStatusType("success");
      setApiStatusMessage(`Loaded ${mapped.length} live records from endpoint`);
      showToast(`Connected: ${mapped.length} users synchronized`);
    } catch (err: any) {
      setApiStatusType("error");
      setApiStatusMessage(`Fetch error: ${err.message || "Failed to reach endpoint"}`);
      showToast("Failed to fetch live API records");
    } finally {
      setIsFetchingApi(false);
    }
  };

  const handleApplyCustomJson = () => {
    try {
      const parsed = JSON.parse(rawJsonInput);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array of user objects");

      const mapped: UserItem[] = parsed.map((u: any, idx: number) => ({
        id: u.id ? String(u.id) : `usr-custom-${idx + 1}`,
        name: u.name || `User ${idx + 1}`,
        email: u.email || `user.${idx + 1}@nexore.io`,
        avatar: u.avatar || INITIAL_USERS[idx % INITIAL_USERS.length].avatar,
        role: u.role || "Senior Developer",
        department: u.department || "Engineering",
        status: u.status === "invited" || u.status === "suspended" ? u.status : "active",
        lastActive: u.lastActive || "Just now",
        joinedDate: u.joinedDate || "2025",
        twoFactorEnabled: Boolean(u.twoFactorEnabled ?? true),
        location: u.location || "San Francisco, US",
        projectsCount: Number(u.projectsCount || 4),
      }));

      setUsers(mapped);
      setSelectedIds(new Set());
      setApiStatusType("success");
      setApiStatusMessage(`Applied ${mapped.length} custom JSON records`);
      showToast(`Imported ${mapped.length} records`);
    } catch (err: any) {
      setApiStatusType("error");
      setApiStatusMessage(`Invalid JSON: ${err.message}`);
      showToast("JSON format error");
    }
  };

  const handleResetDefaultUsers = () => {
    setUsers(INITIAL_USERS);
    setSelectedIds(new Set());
    setApiStatusType("success");
    setApiStatusMessage("Reset to default 24 enterprise records");
    showToast("Restored initial 24 users");
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (deptFilter !== "all" && u.department !== deptFilter) return false;

      return true;
    });
  }, [users, searchQuery, statusFilter, roleFilter, deptFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredUsers, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  const isAllCurrentSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((u) => selectedIds.has(u.id));

  const toggleSelectAllCurrent = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllCurrentSelected) {
        paginatedUsers.forEach((u) => next.delete(u.id));
      } else {
        paginatedUsers.forEach((u) => next.add(u.id));
      }
      return next;
    });
  };

  const toggleSelectUser = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSort = (field: keyof UserItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      email: "",
      role: "Senior Developer",
      department: "Engineering",
      status: "active",
      location: "San Francisco, US",
      twoFactorEnabled: true,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast("Provide both name and email");
      return;
    }

    const newUser: UserItem = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      avatar: INITIAL_USERS[Math.floor(Math.random() * INITIAL_USERS.length)].avatar,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      lastActive: "Just now",
      joinedDate: "Today",
      twoFactorEnabled: formData.twoFactorEnabled,
      location: formData.location.trim() || "San Francisco, US",
      projectsCount: 1,
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    showToast(`Added member ${newUser.name}`);
  };

  const handleOpenEditModal = (user: UserItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      location: user.location,
      twoFactorEnabled: user.twoFactorEnabled,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: formData.name.trim() || u.name,
              email: formData.email.trim().toLowerCase() || u.email,
              role: formData.role,
              department: formData.department,
              status: formData.status,
              location: formData.location.trim() || u.location,
              twoFactorEnabled: formData.twoFactorEnabled,
            }
          : u
      )
    );

    if (activeDrawerUser?.id === editingUser.id) {
      setActiveDrawerUser((prev) =>
        prev
          ? {
              ...prev,
              name: formData.name.trim() || prev.name,
              email: formData.email.trim().toLowerCase() || prev.email,
              role: formData.role,
              department: formData.department,
              status: formData.status,
              location: formData.location.trim() || prev.location,
              twoFactorEnabled: formData.twoFactorEnabled,
            }
          : null
      );
    }

    setIsEditModalOpen(false);
    setEditingUser(null);
    showToast("Profile updated");
  };

  const handleToggleStatus = (user: UserItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus: UserStatus = user.status === "active" ? "suspended" : "active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    if (activeDrawerUser?.id === user.id) {
      setActiveDrawerUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Status changed to ${newStatus}`);
  };

  const handleDeleteSingleUser = () => {
    if (!deleteConfirmUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteConfirmUser.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteConfirmUser.id);
      return next;
    });
    if (activeDrawerUser?.id === deleteConfirmUser.id) {
      setActiveDrawerUser(null);
    }
    showToast(`Removed ${deleteConfirmUser.name}`);
    setDeleteConfirmUser(null);
  };

  const handleBulkStatusChange = (status: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (selectedIds.has(u.id) ? { ...u, status } : u))
    );
    showToast(`Updated ${selectedIds.size} records`);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    const count = selectedIds.size;
    setUsers((prev) => prev.filter((u) => !selectedIds.has(u.id)));
    if (activeDrawerUser && selectedIds.has(activeDrawerUser.id)) {
      setActiveDrawerUser(null);
    }
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    showToast(`Deleted ${count} records`);
  };

  const handleExportCSV = () => {
    const targetUsers =
      selectedIds.size > 0
        ? users.filter((u) => selectedIds.has(u.id))
        : filteredUsers;

    const headers = [
      "ID",
      "Name",
      "Email",
      "Role",
      "Department",
      "Status",
      "Location",
      "Joined Date",
      "2FA Enabled",
    ];
    const rows = targetUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      `"${u.role}"`,
      u.department,
      u.status,
      `"${u.location}"`,
      `"${u.joinedDate}"`,
      u.twoFactorEnabled ? "Yes" : "No",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexusers-directory-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${targetUsers.length} records to CSV`);
  };

  const handleCopyEmail = (email: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(email);
    showToast(`Copied ${email}`);
  };

  const activeCount = useMemo(() => users.filter((u) => u.status === "active").length, [users]);
  const invitedCount = useMemo(() => users.filter((u) => u.status === "invited").length, [users]);
  const suspendedCount = useMemo(() => users.filter((u) => u.status === "suspended").length, [users]);

  const activeViewMode = isMobile ? "grid" : viewMode;

  return (
    <div
      ref={rootRef}
      className="w-full min-h-screen overflow-x-clip transition-colors duration-200"
      style={{
        backgroundColor: C.bg,
        color: C.text,
        fontFamily: FONT.body,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
      />

      {/* HEADER / NAVIGATION BAR */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md transition-colors"
        style={{
          backgroundColor: internalDark ? "rgba(10, 14, 20, 0.94)" : "rgba(255, 255, 255, 0.94)",
          borderColor: C.line,
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {isMobile ? (
            <div className="py-3 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="h-7 w-7 rounded flex items-center justify-center font-bold text-xs shrink-0"
                    style={{
                      backgroundColor: C.accent,
                      color: C.accentInk,
                    }}
                  >
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <span
                    className="font-semibold text-sm tracking-tight truncate"
                    style={{ fontFamily: FONT.display }}
                  >
                    Enterprise Directory
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setInternalDark(!internalDark)}
                    className="p-1.5 rounded border transition-colors"
                    style={{
                      backgroundColor: C.surface,
                      borderColor: C.line,
                      color: C.text,
                    }}
                    title="Toggle theme"
                  >
                    {internalDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => setIsApiPanelOpen(!isApiPanelOpen)}
                    className="p-1.5 rounded border transition-colors"
                    style={{
                      backgroundColor: isApiPanelOpen ? C.accent : C.surface,
                      borderColor: isApiPanelOpen ? C.accent : C.line,
                      color: isApiPanelOpen ? C.accentInk : C.text,
                    }}
                    title="API Connection"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="p-1.5 rounded border text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: C.surface,
                      borderColor: C.line,
                      color: C.text,
                    }}
                    title="Export CSV"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold shadow-xs"
                    style={{
                      backgroundColor: C.accent,
                      color: C.accentInk,
                    }}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-8 w-8 rounded flex items-center justify-center font-bold text-xs shrink-0"
                  style={{
                    backgroundColor: C.accent,
                    color: C.accentInk,
                  }}
                >
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h1
                      className="font-semibold text-base tracking-tight truncate"
                      style={{ fontFamily: FONT.display }}
                    >
                      Enterprise User Directory
                    </h1>
                    <span
                      className="text-[11px] px-2 py-0.5 rounded border"
                      style={{
                        fontFamily: FONT.mono,
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.muted,
                      }}
                    >
                      {users.length} Records
                    </span>
                  </div>
                  <p className="text-xs truncate" style={{ color: C.muted }}>
                    Access registry, live synchronization, and bulk role operations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsApiPanelOpen(!isApiPanelOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: isApiPanelOpen ? C.accent : C.surface,
                    borderColor: isApiPanelOpen ? C.accent : C.line,
                    color: isApiPanelOpen ? C.accentInk : C.text,
                  }}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Live Data Source</span>
                </button>

                <button
                  onClick={() => setInternalDark(!internalDark)}
                  className="p-2 rounded border transition-colors"
                  style={{
                    backgroundColor: C.surface,
                    borderColor: C.line,
                    color: C.text,
                  }}
                  title="Toggle theme"
                >
                  {internalDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                <button
                  onClick={handleExportCSV}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: C.surface,
                    borderColor: C.line,
                    color: C.text,
                  }}
                  title="Export to CSV"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold shadow-xs"
                  style={{
                    backgroundColor: C.accent,
                    color: C.accentInk,
                  }}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4">
        {/* LIVE SWAGGER / REST API & DATA SOURCE CONTROL PANEL */}
        <AnimatePresence>
          {isApiPanelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={springTransition}
              className="overflow-hidden"
            >
              <div
                className="p-4 sm:p-5 rounded-lg border space-y-3.5"
                style={{
                  backgroundColor: C.surface,
                  borderColor: C.line,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b" style={{ borderColor: C.line }}>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" style={{ color: C.accent }} />
                    <span className="font-semibold text-xs tracking-tight">REST API & Swagger Live Sync</span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded border"
                      style={{
                        fontFamily: FONT.mono,
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.muted,
                      }}
                    >
                      HTTP GET
                    </span>
                  </div>

                  <div className="flex items-center gap-1 p-0.5 rounded border" style={{ backgroundColor: C.surfaceAlt, borderColor: C.line }}>
                    <button
                      onClick={() => setApiPanelMode("endpoint")}
                      className="px-2.5 py-1 rounded text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: apiPanelMode === "endpoint" ? C.surface : "transparent",
                        color: apiPanelMode === "endpoint" ? C.text : C.muted,
                      }}
                    >
                      Endpoint URL
                    </button>
                    <button
                      onClick={() => setApiPanelMode("json")}
                      className="px-2.5 py-1 rounded text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: apiPanelMode === "json" ? C.surface : "transparent",
                        color: apiPanelMode === "json" ? C.text : C.muted,
                      }}
                    >
                      Import JSON
                    </button>
                  </div>
                </div>

                {apiPanelMode === "endpoint" ? (
                  <div className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={apiUrlInput}
                          onChange={(e) => setApiUrlInput(e.target.value)}
                          placeholder="https://your-api.com/v1/users"
                          className="w-full px-3 py-2 rounded text-xs outline-none border transition-colors"
                          style={{
                            fontFamily: FONT.mono,
                            backgroundColor: C.surfaceAlt,
                            borderColor: C.line,
                            color: C.text,
                          }}
                        />
                      </div>
                      <button
                        onClick={() => handleSyncApi()}
                        disabled={isFetchingApi}
                        className="px-4 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
                        style={{
                          backgroundColor: C.accent,
                          color: C.accentInk,
                        }}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isFetchingApi ? "animate-spin" : ""}`} />
                        <span>{isFetchingApi ? "Connecting..." : "Sync Live API"}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-[11px] mr-1" style={{ color: C.muted }}>Presets:</span>
                      <button
                        onClick={() => {
                          const url = "https://dummyjson.com/users";
                          setApiUrlInput(url);
                          handleSyncApi(url);
                        }}
                        className="px-2.5 py-1 rounded border text-[11px] font-mono transition-colors"
                        style={{
                          backgroundColor: C.surfaceAlt,
                          borderColor: C.line,
                          color: C.text,
                        }}
                      >
                        DummyJSON (30 users)
                      </button>
                      <button
                        onClick={() => {
                          const url = "https://jsonplaceholder.typicode.com/users";
                          setApiUrlInput(url);
                          handleSyncApi(url);
                        }}
                        className="px-2.5 py-1 rounded border text-[11px] font-mono transition-colors"
                        style={{
                          backgroundColor: C.surfaceAlt,
                          borderColor: C.line,
                          color: C.text,
                        }}
                      >
                        JSONPlaceholder (10 users)
                      </button>
                      <button
                        onClick={handleResetDefaultUsers}
                        className="px-2.5 py-1 rounded border text-[11px] font-mono transition-colors"
                        style={{
                          backgroundColor: C.surfaceAlt,
                          borderColor: C.line,
                          color: C.muted,
                        }}
                      >
                        Reset Initial (24)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <textarea
                      rows={5}
                      value={rawJsonInput}
                      onChange={(e) => setRawJsonInput(e.target.value)}
                      className="w-full p-2.5 rounded text-[11px] outline-none border transition-colors resize-y leading-relaxed"
                      style={{
                        fontFamily: FONT.mono,
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                      spellCheck={false}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={handleResetDefaultUsers}
                        className="text-xs transition-colors"
                        style={{ color: C.muted }}
                      >
                        Restore Defaults
                      </button>
                      <button
                        onClick={handleApplyCustomJson}
                        className="px-4 py-1.5 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: C.accent,
                          color: C.accentInk,
                        }}
                      >
                        Apply JSON Dataset
                      </button>
                    </div>
                  </div>
                )}

                {apiStatusMessage && (
                  <div
                    className="p-2.5 rounded border text-xs flex items-center gap-2"
                    style={{
                      backgroundColor: C.surfaceAlt,
                      borderColor: apiStatusType === "error" ? PALETTE.status.suspended : PALETTE.status.active,
                      color: apiStatusType === "error" ? PALETTE.status.suspended : PALETTE.status.active,
                      fontFamily: FONT.mono,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: apiStatusType === "error" ? PALETTE.status.suspended : PALETTE.status.active,
                      }}
                    />
                    <span className="truncate">{apiStatusMessage}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* METRIC CARDS / STATUS SUMMARY */}
        <div className={`grid ${isMobile ? "grid-cols-2 gap-2" : isTablet ? "grid-cols-2 sm:grid-cols-4 gap-3" : "grid-cols-4 gap-3"}`}>
          <div
            onClick={() => setStatusFilter("all")}
            className="p-3 sm:p-3.5 rounded-lg border cursor-pointer transition-all"
            style={{
              backgroundColor: C.surface,
              borderColor: statusFilter === "all" ? C.accent : C.line,
            }}
          >
            <div className="flex items-center justify-between text-xs mb-1" style={{ color: C.muted }}>
              <span className="font-medium text-[11px] sm:text-xs">Total Members</span>
              <Users className="h-3.5 w-3.5" />
            </div>
            <div
              className="text-xl sm:text-2xl font-semibold tabular-nums"
              style={{
                fontFamily: FONT.mono,
                color: statusFilter === "all" ? C.accent : C.text,
              }}
            >
              {users.length}
            </div>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
            className="p-3 sm:p-3.5 rounded-lg border cursor-pointer transition-all"
            style={{
              backgroundColor: C.surface,
              borderColor: statusFilter === "active" ? PALETTE.status.active : C.line,
            }}
          >
            <div className="flex items-center justify-between text-xs mb-1" style={{ color: C.muted }}>
              <span className="font-medium text-[11px] sm:text-xs">Active</span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PALETTE.status.active }}
              />
            </div>
            <div
              className="text-xl sm:text-2xl font-semibold tabular-nums"
              style={{
                fontFamily: FONT.mono,
                color: PALETTE.status.active,
              }}
            >
              {activeCount}
            </div>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === "invited" ? "all" : "invited")}
            className="p-3 sm:p-3.5 rounded-lg border cursor-pointer transition-all"
            style={{
              backgroundColor: C.surface,
              borderColor: statusFilter === "invited" ? PALETTE.status.pending : C.line,
            }}
          >
            <div className="flex items-center justify-between text-xs mb-1" style={{ color: C.muted }}>
              <span className="font-medium text-[11px] sm:text-xs">Pending</span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PALETTE.status.pending }}
              />
            </div>
            <div
              className="text-xl sm:text-2xl font-semibold tabular-nums"
              style={{
                fontFamily: FONT.mono,
                color: PALETTE.status.pending,
              }}
            >
              {invitedCount}
            </div>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === "suspended" ? "all" : "suspended")}
            className="p-3 sm:p-3.5 rounded-lg border cursor-pointer transition-all"
            style={{
              backgroundColor: C.surface,
              borderColor: statusFilter === "suspended" ? PALETTE.status.suspended : C.line,
            }}
          >
            <div className="flex items-center justify-between text-xs mb-1" style={{ color: C.muted }}>
              <span className="font-medium text-[11px] sm:text-xs">Suspended</span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PALETTE.status.suspended }}
              />
            </div>
            <div
              className="text-xl sm:text-2xl font-semibold tabular-nums"
              style={{
                fontFamily: FONT.mono,
                color: PALETTE.status.suspended,
              }}
            >
              {suspendedCount}
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS TOOLBAR */}
        <div
          className="p-2.5 sm:p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3"
          style={{
            backgroundColor: C.surface,
            borderColor: C.line,
          }}
        >
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: C.muted }} />
            <input
              type="text"
              placeholder="Search by name, email, department, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded text-xs outline-none border transition-colors"
              style={{
                backgroundColor: C.surfaceAlt,
                borderColor: C.line,
                color: C.text,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 hover:opacity-80"
                style={{ color: C.muted }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-initial">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="flex-1 md:flex-initial px-2.5 py-1.5 rounded border text-xs outline-none cursor-pointer"
                style={{
                  backgroundColor: C.surfaceAlt,
                  borderColor: C.line,
                  color: C.text,
                }}
              >
                <option value="all">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Lead Architect">Lead Architect</option>
                <option value="Senior Developer">Senior Developer</option>
                <option value="Product Designer">Product Designer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Growth Marketing">Growth Marketing</option>
                <option value="SecOps Lead">SecOps Lead</option>
                <option value="Viewer">Viewer</option>
              </select>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="flex-1 md:flex-initial px-2.5 py-1.5 rounded border text-xs outline-none cursor-pointer"
                style={{
                  backgroundColor: C.surfaceAlt,
                  borderColor: C.line,
                  color: C.text,
                }}
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Security">Security</option>
              </select>
            </div>

            <div
              className="flex items-center p-0.5 rounded border shrink-0"
              style={{
                backgroundColor: C.surfaceAlt,
                borderColor: C.line,
              }}
            >
              <button
                onClick={() => setViewMode("table")}
                className="p-1.5 rounded transition-colors"
                style={{
                  backgroundColor: viewMode === "table" ? C.surface : "transparent",
                  color: viewMode === "table" ? C.text : C.muted,
                }}
                title="Table View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className="p-1.5 rounded transition-colors"
                style={{
                  backgroundColor: viewMode === "grid" ? C.surface : "transparent",
                  color: viewMode === "grid" ? C.text : C.muted,
                }}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT CANVAS: TABLE OR GRID VIEW */}
        {activeViewMode === "table" ? (
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              backgroundColor: C.surface,
              borderColor: C.line,
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      backgroundColor: C.surfaceAlt,
                      borderColor: C.line,
                      color: C.muted,
                    }}
                  >
                    <th className="py-3 px-3.5 w-10">
                      <button
                        onClick={toggleSelectAllCurrent}
                        className="flex items-center justify-center cursor-pointer"
                        style={{ color: isAllCurrentSelected ? C.accent : C.muted }}
                      >
                        {isAllCurrentSelected ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th
                      onClick={() => handleSort("name")}
                      className="py-3 px-3.5 font-medium cursor-pointer hover:opacity-80 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>User</span>
                        {sortField === "name" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3 w-3" style={{ color: C.accent }} />
                          ) : (
                            <ArrowDown className="h-3 w-3" style={{ color: C.accent }} />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("role")}
                      className="py-3 px-3.5 font-medium cursor-pointer hover:opacity-80 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Role</span>
                        {sortField === "role" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3 w-3" style={{ color: C.accent }} />
                          ) : (
                            <ArrowDown className="h-3 w-3" style={{ color: C.accent }} />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("department")}
                      className="py-3 px-3.5 font-medium cursor-pointer hover:opacity-80 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Department</span>
                        {sortField === "department" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3 w-3" style={{ color: C.accent }} />
                          ) : (
                            <ArrowDown className="h-3 w-3" style={{ color: C.accent }} />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      className="py-3 px-3.5 font-medium cursor-pointer hover:opacity-80 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        {sortField === "status" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3 w-3" style={{ color: C.accent }} />
                          ) : (
                            <ArrowDown className="h-3 w-3" style={{ color: C.accent }} />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-3.5 font-medium">2FA</th>
                    <th className="py-3 px-3.5 font-medium">Activity</th>
                    <th className="py-3 px-3.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y" style={{ borderColor: C.line }}>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs" style={{ color: C.muted }}>
                        No records match the active query or filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => {
                      const isSelected = selectedIds.has(user.id);
                      return (
                        <motion.tr
                          key={user.id}
                          layout
                          transition={springTransition}
                          onClick={() => setActiveDrawerUser(user)}
                          className="group cursor-pointer transition-colors"
                          style={{
                            backgroundColor: isSelected
                              ? internalDark
                                ? "rgba(59, 130, 246, 0.08)"
                                : "rgba(10, 108, 255, 0.06)"
                              : "transparent",
                          }}
                        >
                          <td className="py-3 px-3.5 w-10" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => toggleSelectUser(user.id, e)}
                              className="flex items-center justify-center cursor-pointer"
                              style={{ color: isSelected ? C.accent : C.muted }}
                            >
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-8 w-8 rounded-full object-cover border shrink-0"
                                style={{ borderColor: C.line }}
                              />
                              <div className="min-w-0">
                                <div className="font-semibold truncate leading-snug">
                                  {user.name}
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => handleCopyEmail(user.email, e)}
                                  className="text-[11px] truncate block text-left hover:underline"
                                  style={{
                                    fontFamily: FONT.mono,
                                    color: C.muted,
                                  }}
                                  title="Click to copy email"
                                >
                                  {user.email}
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3.5">
                            <span
                              className="text-[11px] px-2 py-0.5 rounded border inline-block"
                              style={{
                                backgroundColor: C.surfaceAlt,
                                borderColor: C.line,
                                color: C.text,
                              }}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="py-3 px-3.5" style={{ color: C.muted }}>
                            {user.department}
                          </td>

                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    user.status === "active"
                                      ? PALETTE.status.active
                                      : user.status === "invited"
                                      ? PALETTE.status.pending
                                      : PALETTE.status.suspended,
                                }}
                              />
                              <span
                                className="text-[11px] capitalize"
                                style={{
                                  color:
                                    user.status === "active"
                                      ? PALETTE.status.active
                                      : user.status === "invited"
                                      ? PALETTE.status.pending
                                      : PALETTE.status.suspended,
                                }}
                              >
                                {user.status}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-3.5">
                            {user.twoFactorEnabled ? (
                              <ShieldCheck className="h-4 w-4" style={{ color: PALETTE.status.active }} />
                            ) : (
                              <ShieldAlert className="h-4 w-4" style={{ color: C.muted }} />
                            )}
                          </td>

                          <td className="py-3 px-3.5" style={{ fontFamily: FONT.mono, color: C.muted }}>
                            {user.lastActive}
                          </td>

                          <td className="py-3 px-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="relative inline-block text-left">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionId(openActionId === user.id ? null : user.id);
                                }}
                                className="p-1 rounded hover:opacity-80"
                                style={{ color: C.muted }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>

                              {openActionId === user.id && (
                                <div
                                  className="absolute right-0 mt-1 w-36 rounded border shadow-lg z-20 py-1"
                                  style={{
                                    backgroundColor: C.surface,
                                    borderColor: C.line,
                                  }}
                                >
                                  <button
                                    onClick={() => {
                                      setActiveDrawerUser(user);
                                      setOpenActionId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:opacity-80"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>Inspect</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      handleOpenEditModal(user, e);
                                      setOpenActionId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:opacity-80"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                    <span>Edit User</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      handleToggleStatus(user, e);
                                      setOpenActionId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:opacity-80"
                                  >
                                    <UserX className="h-3.5 w-3.5" />
                                    <span>{user.status === "active" ? "Suspend" : "Activate"}</span>
                                  </button>
                                  <div className="my-1 border-t" style={{ borderColor: C.line }} />
                                  <button
                                    onClick={() => {
                                      setDeleteConfirmUser(user);
                                      setOpenActionId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2"
                                    style={{ color: PALETTE.status.suspended }}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION BAR */}
            <div
              className="py-3 px-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
              style={{
                backgroundColor: C.surfaceAlt,
                borderColor: C.line,
                color: C.muted,
              }}
            >
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded border text-xs outline-none cursor-pointer"
                  style={{
                    backgroundColor: C.surface,
                    borderColor: C.line,
                    color: C.text,
                  }}
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
                <span className="tabular-nums" style={{ fontFamily: FONT.mono }}>
                  Showing {paginatedUsers.length} of {sortedUsers.length} records
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded border disabled:opacity-30 cursor-pointer"
                  style={{
                    backgroundColor: C.surface,
                    borderColor: C.line,
                    color: C.text,
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 tabular-nums" style={{ fontFamily: FONT.mono }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded border disabled:opacity-30 cursor-pointer"
                  style={{
                    backgroundColor: C.surface,
                    borderColor: C.line,
                    color: C.text,
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* CARD GRID VIEW (MOBILE OR GRID TOGGLE) */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {paginatedUsers.map((user) => {
                const isSelected = selectedIds.has(user.id);
                return (
                  <motion.div
                    key={user.id}
                    layout
                    transition={springTransition}
                    onClick={() => setActiveDrawerUser(user)}
                    className="p-4 rounded-lg border cursor-pointer space-y-3 transition-colors"
                    style={{
                      backgroundColor: C.surface,
                      borderColor: isSelected ? C.accent : C.line,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover border shrink-0"
                          style={{ borderColor: C.line }}
                        />
                        <div className="min-w-0">
                          <h2
                            className="font-semibold text-sm truncate leading-snug"
                            style={{ fontFamily: FONT.display }}
                          >
                            {user.name}
                          </h2>
                          <button
                            type="button"
                            onClick={(e) => handleCopyEmail(user.email, e)}
                            className="text-[11px] truncate block text-left hover:underline"
                            style={{
                              fontFamily: FONT.mono,
                              color: C.muted,
                            }}
                          >
                            {user.email}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={(e) => toggleSelectUser(user.id, e)}
                        className="cursor-pointer shrink-0"
                        style={{ color: isSelected ? C.accent : C.muted }}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: C.surfaceAlt,
                          borderColor: C.line,
                          color: C.text,
                        }}
                      >
                        {user.role}
                      </span>
                      <span style={{ color: C.muted }}>{user.department}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: C.line }}>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              user.status === "active"
                                ? PALETTE.status.active
                                : user.status === "invited"
                                ? PALETTE.status.pending
                                : PALETTE.status.suspended,
                          }}
                        />
                        <span
                          className="text-[11px] capitalize"
                          style={{
                            color:
                              user.status === "active"
                                ? PALETTE.status.active
                                : user.status === "invited"
                                ? PALETTE.status.pending
                                : PALETTE.status.suspended,
                          }}
                        >
                          {user.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {user.twoFactorEnabled ? (
                          <ShieldCheck className="h-3.5 w-3.5" style={{ color: PALETTE.status.active }} />
                        ) : (
                          <ShieldAlert className="h-3.5 w-3.5" style={{ color: C.muted }} />
                        )}
                        <span className="text-[11px]" style={{ fontFamily: FONT.mono, color: C.muted }}>
                          {user.lastActive}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* GRID PAGINATION */}
            <div
              className="py-3 px-4 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
              style={{
                backgroundColor: C.surface,
                borderColor: C.line,
                color: C.muted,
              }}
            >
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded border text-xs outline-none cursor-pointer"
                  style={{
                    backgroundColor: C.surfaceAlt,
                    borderColor: C.line,
                    color: C.text,
                  }}
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
                <span className="tabular-nums" style={{ fontFamily: FONT.mono }}>
                  {sortedUsers.length} records total
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded border disabled:opacity-30 cursor-pointer"
                  style={{
                    backgroundColor: C.surfaceAlt,
                    borderColor: C.line,
                    color: C.text,
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 tabular-nums" style={{ fontFamily: FONT.mono }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded border disabled:opacity-30 cursor-pointer"
                  style={{
                    backgroundColor: C.surfaceAlt,
                    borderColor: C.line,
                    color: C.text,
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING BULK ACTIONS BAR */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={springTransition}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-lg border shadow-lg flex items-center gap-3 text-xs"
            style={{
              backgroundColor: C.surface,
              borderColor: C.line,
            }}
          >
            <span className="font-semibold tabular-nums" style={{ fontFamily: FONT.mono, color: C.accent }}>
              {selectedIds.size} selected
            </span>

            <div className="h-4 w-px" style={{ backgroundColor: C.line }} />

            <button
              onClick={() => handleBulkStatusChange("active")}
              className="px-2.5 py-1 rounded border font-medium hover:opacity-80"
              style={{
                backgroundColor: C.surfaceAlt,
                borderColor: C.line,
                color: PALETTE.status.active,
              }}
            >
              Activate
            </button>

            <button
              onClick={() => handleBulkStatusChange("suspended")}
              className="px-2.5 py-1 rounded border font-medium hover:opacity-80"
              style={{
                backgroundColor: C.surfaceAlt,
                borderColor: C.line,
                color: PALETTE.status.pending,
              }}
            >
              Suspend
            </button>

            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1 rounded border font-medium hover:opacity-80"
              style={{
                backgroundColor: C.surfaceAlt,
                borderColor: C.line,
                color: C.text,
              }}
            >
              Export
            </button>

            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-2.5 py-1 rounded border font-medium"
              style={{
                backgroundColor: C.surfaceAlt,
                borderColor: C.line,
                color: PALETTE.status.suspended,
              }}
            >
              Delete
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1 rounded hover:opacity-80 ml-1"
              style={{ color: C.muted }}
              title="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLIDE-OVER USER DETAIL DRAWER */}
      <AnimatePresence>
        {activeDrawerUser && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawerUser(null)}
              className="fixed inset-0 bg-black/50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={springTransition}
              className="relative w-full max-w-md h-full border-l shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
              style={{
                backgroundColor: C.surface,
                borderColor: C.line,
              }}
            >
              <div className="p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: C.line }}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs tracking-tight">User Security Audit</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded border"
                      style={{
                        fontFamily: FONT.mono,
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.muted,
                      }}
                    >
                      {activeDrawerUser.id}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveDrawerUser(null)}
                    className="p-1.5 rounded hover:opacity-80"
                    style={{ color: C.muted }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={activeDrawerUser.avatar}
                    alt={activeDrawerUser.name}
                    className="h-16 w-16 rounded-full object-cover border"
                    style={{ borderColor: C.line }}
                  />
                  <div>
                    <h2
                      className="font-semibold text-base"
                      style={{ fontFamily: FONT.display }}
                    >
                      {activeDrawerUser.name}
                    </h2>
                    <p className="text-xs" style={{ fontFamily: FONT.mono, color: C.muted }}>
                      {activeDrawerUser.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: C.surfaceAlt,
                          borderColor: C.line,
                          color: C.text,
                        }}
                      >
                        {activeDrawerUser.role}
                      </span>
                      <span className="text-[10px]" style={{ color: C.muted }}>
                        {activeDrawerUser.department}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 rounded border" style={{ backgroundColor: C.surfaceAlt, borderColor: C.line }}>
                    <span className="block text-[11px] mb-0.5" style={{ color: C.muted }}>Status</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            activeDrawerUser.status === "active"
                              ? PALETTE.status.active
                              : activeDrawerUser.status === "invited"
                              ? PALETTE.status.pending
                              : PALETTE.status.suspended,
                        }}
                      />
                      <span className="capitalize font-medium">{activeDrawerUser.status}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded border" style={{ backgroundColor: C.surfaceAlt, borderColor: C.line }}>
                    <span className="block text-[11px] mb-0.5" style={{ color: C.muted }}>2FA Authentication</span>
                    <span className="font-medium">
                      {activeDrawerUser.twoFactorEnabled ? "Enforced" : "Not configured"}
                    </span>
                  </div>

                  <div className="p-3 rounded border" style={{ backgroundColor: C.surfaceAlt, borderColor: C.line }}>
                    <span className="block text-[11px] mb-0.5" style={{ color: C.muted }}>Location</span>
                    <span className="font-medium">{activeDrawerUser.location}</span>
                  </div>

                  <div className="p-3 rounded border" style={{ backgroundColor: C.surfaceAlt, borderColor: C.line }}>
                    <span className="block text-[11px] mb-0.5" style={{ color: C.muted }}>Joined</span>
                    <span className="font-medium">{activeDrawerUser.joinedDate}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold block">Audit Log Activity</span>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded border text-xs space-y-0.5" style={{ backgroundColor: C.surfaceAlt, borderColor: C.line }}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Session Authenticated</span>
                        <span className="text-[10px]" style={{ fontFamily: FONT.mono, color: C.muted }}>14m ago</span>
                      </div>
                      <p className="text-[11px]" style={{ color: C.muted }}>Direct SAML assertion from corporate gateway</p>
                    </div>

                    <div className="p-2.5 rounded border text-xs space-y-0.5" style={{ backgroundColor: C.surfaceAlt, borderColor: C.line }}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Policy Verification</span>
                        <span className="text-[10px]" style={{ fontFamily: FONT.mono, color: C.muted }}>2h ago</span>
                      </div>
                      <p className="text-[11px]" style={{ color: C.muted }}>Role membership confirmed for Engineering repository access</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-4 border-t flex items-center justify-between gap-2"
                style={{
                  backgroundColor: C.surfaceAlt,
                  borderColor: C.line,
                }}
              >
                <button
                  onClick={(e) => handleToggleStatus(activeDrawerUser, e)}
                  className="px-3 py-1.5 rounded border text-xs font-medium"
                  style={{
                    backgroundColor: C.surface,
                    borderColor: C.line,
                    color: C.text,
                  }}
                >
                  {activeDrawerUser.status === "active" ? "Suspend Access" : "Activate Access"}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleOpenEditModal(activeDrawerUser, e)}
                    className="px-3.5 py-1.5 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: C.accent,
                      color: C.accentInk,
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD USER MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={springTransition}
              className="relative w-full max-w-lg rounded-lg border p-5 shadow-2xl z-10 space-y-4"
              style={{
                backgroundColor: C.surface,
                borderColor: C.line,
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: C.line }}>
                <h3 className="font-semibold text-sm" style={{ fontFamily: FONT.display }}>
                  Add Directory Member
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} style={{ color: C.muted }}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveNewUser} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@nexore.io"
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Lead Architect">Lead Architect</option>
                      <option value="Senior Developer">Senior Developer</option>
                      <option value="Product Designer">Product Designer</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Growth Marketing">Growth Marketing</option>
                      <option value="SecOps Lead">SecOps Lead</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value as UserDepartment })}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="invited">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="San Francisco, US"
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.twoFactorEnabled}
                    onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
                    className="rounded"
                  />
                  <span>Enforce Two-Factor Authentication (2FA)</span>
                </label>

                <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: C.line }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3.5 py-1.5 rounded border font-medium"
                    style={{
                      backgroundColor: C.surfaceAlt,
                      borderColor: C.line,
                      color: C.text,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded font-semibold"
                    style={{
                      backgroundColor: C.accent,
                      color: C.accentInk,
                    }}
                  >
                    Create User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT USER MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-black/50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={springTransition}
              className="relative w-full max-w-lg rounded-lg border p-5 shadow-2xl z-10 space-y-4"
              style={{
                backgroundColor: C.surface,
                borderColor: C.line,
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: C.line }}>
                <h3 className="font-semibold text-sm" style={{ fontFamily: FONT.display }}>
                  Edit Member Profile
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} style={{ color: C.muted }}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditUser} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Lead Architect">Lead Architect</option>
                      <option value="Senior Developer">Senior Developer</option>
                      <option value="Product Designer">Product Designer</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Growth Marketing">Growth Marketing</option>
                      <option value="SecOps Lead">SecOps Lead</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value as UserDepartment })}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="invited">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium" style={{ color: C.muted }}>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 rounded border outline-none"
                      style={{
                        backgroundColor: C.surfaceAlt,
                        borderColor: C.line,
                        color: C.text,
                      }}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.twoFactorEnabled}
                    onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
                    className="rounded"
                  />
                  <span>Two-Factor Authentication Active</span>
                </label>

                <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: C.line }}>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-3.5 py-1.5 rounded border font-medium"
                    style={{
                      backgroundColor: C.surfaceAlt,
                      borderColor: C.line,
                      color: C.text,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded font-semibold"
                    style={{
                      backgroundColor: C.accent,
                      color: C.accentInk,
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {deleteConfirmUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmUser(null)}
              className="fixed inset-0 bg-black/50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={springTransition}
              className="relative w-full max-w-sm rounded-lg border p-5 shadow-2xl z-10 text-center space-y-3"
              style={{
                backgroundColor: C.surface,
                borderColor: C.line,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                  color: PALETTE.status.suspended,
                }}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">Revoke User Access</h3>
              <p className="text-xs" style={{ color: C.muted }}>
                Are you sure you want to remove <strong>{deleteConfirmUser.name}</strong> from the directory?
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <button
                  onClick={() => setDeleteConfirmUser(null)}
                  className="py-2 rounded border font-medium"
                  style={{
                    backgroundColor: C.surfaceAlt,
                    borderColor: C.line,
                    color: C.text,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSingleUser}
                  className="py-2 rounded font-semibold text-white"
                  style={{ backgroundColor: PALETTE.status.suspended }}
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BULK DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {isBulkDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={springTransition}
              className="relative w-full max-w-sm rounded-lg border p-5 shadow-2xl z-10 text-center space-y-3"
              style={{
                backgroundColor: C.surface,
                borderColor: C.line,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                  color: PALETTE.status.suspended,
                }}
              >
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">Delete Selected Members</h3>
              <p className="text-xs" style={{ color: C.muted }}>
                You are about to remove <strong>{selectedIds.size}</strong> members from the directory. This action cannot be reversed.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <button
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="py-2 rounded border font-medium"
                  style={{
                    backgroundColor: C.surfaceAlt,
                    borderColor: C.line,
                    color: C.text,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="py-2 rounded font-semibold text-white"
                  style={{ backgroundColor: PALETTE.status.suspended }}
                >
                  Delete {selectedIds.size} Users
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST FEEDBACK NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={springTransition}
            className="fixed top-5 right-5 z-50 px-3.5 py-2 rounded border text-xs font-medium shadow-lg flex items-center gap-2"
            style={{
              backgroundColor: C.surface,
              borderColor: C.line,
              color: C.text,
            }}
          >
            <Check className="h-3.5 w-3.5" style={{ color: PALETTE.status.active }} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
