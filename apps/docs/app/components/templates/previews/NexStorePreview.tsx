"use client";

import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Star,
  Search,
  Filter,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Lock,
  User,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Package,
  SlidersHorizontal,
  ExternalLink,
  MessageSquare,
  Share2,
} from "lucide-react";
import { TemplateCustomizerContext, useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

// ─── AUTHENTIC SVG SOCIAL ICONS ────────────────────────────────────────────────
function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

// ─── TYPES ──────────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  category: "Audio" | "Wearables" | "Workspace" | "Cameras" | "Accessories";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  badge?: string;
  features: string[];
  colors: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
}

export type StoreView = "catalog" | "product-detail" | "cart" | "checkout" | "wishlist" | "orders" | "reviews";

// ─── 10 CURATED REAL PRODUCTS WITH HIGH-RES PHOTOS ──────────────────────────────
export const PRODUCTS_DATA: Product[] = [
  {
    id: "prod-1",
    name: "Aura Nova ANC Wireless Headphones",
    category: "Audio",
    price: 349,
    originalPrice: 399,
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Flagship wireless noise-canceling headphones engineered with beryllium acoustic drivers, spatial audio tracking, and 42-hour battery life.",
    badge: "Best Seller",
    features: ["Active Noise Cancellation", "Spatial Audio", "42h Battery", "Bluetooth 5.3"],
    colors: ["#18181b", "#71717a", "#f4f4f5"],
  },
  {
    id: "prod-2",
    name: "Chrono Titanium Automatic Watch",
    category: "Wearables",
    price: 580,
    originalPrice: 650,
    rating: 4.8,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Aerospace-grade titanium mechanical timepiece with sapphire crystal glass, 100m water resistance, and Japanese automatic movement.",
    badge: "Flagship",
    features: ["Titanium Grade 5", "Sapphire Glass", "100m Water Resist", "Self-Winding"],
    colors: ["#27272a", "#52525b", "#e4e4e7"],
  },
  {
    id: "prod-3",
    name: "Horizon Minimalist Mechanical Keyboard",
    category: "Workspace",
    price: 210,
    rating: 4.9,
    reviewsCount: 216,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    description: "75% CNC machined aluminum wireless keyboard with custom lubed linear switches, gasket mount acoustic dampening, and hot-swap PCB.",
    badge: "Popular",
    features: ["CNC Aluminum", "Hot-Swappable", "Gasket Mount", "RGB & Wireless"],
    colors: ["#18181b", "#e4e4e7", "#3b82f6"],
  },
  {
    id: "prod-4",
    name: "Luminary Studio 4K Mirrorless Camera",
    category: "Cameras",
    price: 1490,
    originalPrice: 1650,
    rating: 5.0,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    description: "Full-frame 45MP cinematic photography tool with in-body 5-axis image stabilization, 10-bit ProRes video, and dual CFexpress slots.",
    badge: "Pro Choice",
    features: ["45MP Full-Frame", "4K 120p ProRes", "5-Axis IBIS", "Weather-Sealed"],
    colors: ["#09090b", "#3f3f46"],
  },
  {
    id: "prod-5",
    name: "Vanguard Waterproof Ergonomic Backpack",
    category: "Accessories",
    price: 185,
    rating: 4.7,
    reviewsCount: 118,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description: "Graphene-reinforced weatherproof commuter bag with 16-inch suspended laptop sleeve, magnetic Fidlock buckles, and ergonomic lumbar support.",
    features: ["Cordura Graphene", "Fidlock Buckles", "Waterproof Zippers", "28L Capacity"],
    colors: ["#18181b", "#3f3f46", "#15803d"],
  },
  {
    id: "prod-6",
    name: "Spectra Spatial Audio Wireless Earbuds",
    category: "Audio",
    price: 199,
    originalPrice: 229,
    rating: 4.8,
    reviewsCount: 175,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    description: "Compact ceramic buds with adaptive transparency, wireless Qi fast-charging case, and studio-tuned dual dynamic balanced armatures.",
    badge: "New",
    features: ["Ceramic Shell", "Adaptive ANC", "Wireless Qi", "36h Total Playtime"],
    colors: ["#ffffff", "#09090b"],
  },
  {
    id: "prod-7",
    name: "Nomad Obsidian Polarized Sunglasses",
    category: "Accessories",
    price: 165,
    rating: 4.6,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    description: "Laser-cut Japanese beta-titanium wireframe sunglasses with anti-reflective oleophobic polarized lenses providing 100% UV400 defense.",
    features: ["Beta-Titanium", "Polarized UV400", "Oleophobic Coating", "Ultra-Light 14g"],
    colors: ["#18181b", "#d4af37", "#71717a"],
  },
  {
    id: "prod-8",
    name: "Nexus MagSafe Ambient Charging Dock",
    category: "Workspace",
    price: 120,
    originalPrice: 140,
    rating: 4.9,
    reviewsCount: 153,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
    description: "Heavy solid sandblasted aluminum 3-in-1 MagSafe charging station with weighted non-slip silicone base and integrated soft ambient glow.",
    features: ["Solid Aluminum", "15W MagSafe Fast", "3-in-1 Phone/Watch/AirPods", "Ambient LED"],
    colors: ["#18181b", "#e4e4e7"],
  },
  {
    id: "prod-9",
    name: "Kinetix Carbon High-Top Sneakers",
    category: "Wearables",
    price: 240,
    rating: 4.8,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Performance athletic lifestyle sneakers featuring embedded carbon composite propulsion plates and breathable ballistic knit mesh.",
    badge: "Trending",
    features: ["Carbon Fiber Plate", "Propulsion Cushion", "Ballistic Knit", "Ortholite Insole"],
    colors: ["#dc2626", "#18181b", "#2563eb"],
  },
  {
    id: "prod-10",
    name: "Apex Aerodynamic Polar Smart Sunglasses",
    category: "Accessories",
    price: 295,
    originalPrice: 330,
    rating: 4.9,
    reviewsCount: 71,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    description: "Smart audio frames with bone-conduction audio micro-speakers, voice assistant support, and interchangeable photochromic lenses.",
    badge: "Smart Tech",
    features: ["Open-Ear Audio", "Photochromic Lens", "Dual Microphones", "IPX5 Splashproof"],
    colors: ["#18181b", "#52525b"],
  },
];

// ─── INITIAL REVIEWS DATA ───────────────────────────────────────────────────────
const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    author: "Marcus Vance",
    rating: 5,
    date: "Sep 24, 2026",
    verified: true,
    comment: "The noise cancellation is on par with the best studio headphones I've ever owned. Battery actually lasts 40+ hours. Remarkable craftsmanship.",
  },
  {
    id: "rev-2",
    productId: "prod-1",
    author: "Elena Rostova",
    rating: 5,
    date: "Sep 20, 2026",
    verified: true,
    comment: "Pristine sound stage and deep sub-bass without muddiness. Super comfortable headband for all-day coding sessions.",
  },
  {
    id: "rev-3",
    productId: "prod-2",
    author: "David Sterling",
    rating: 5,
    date: "Sep 18, 2026",
    verified: true,
    comment: "The titanium finish is flawless in person. You feel the mechanical rotor gliding silently. Absolute masterpiece for the price.",
  },
  {
    id: "rev-4",
    productId: "prod-3",
    author: "Kai Takahashi",
    rating: 5,
    date: "Sep 15, 2026",
    verified: true,
    comment: "Heaviest, most satisfying keyboard sound profile out of the box. Zero ping, smooth switches, rock solid wireless latency.",
  },
];

// ─── COMPONENT ──────────────────────────────────────────────────────────────────
export function NexStorePreview() {
  const { config: customizerConfig, deviceMode } = useTemplateCustomizer();

  const initialTheme = customizerConfig?.theme ?? "dark";
  const [internalDark, setInternalDark] = useState<boolean>(initialTheme === "dark");

  useEffect(() => {
    if (customizerConfig?.theme) {
      setInternalDark(customizerConfig.theme === "dark");
    }
  }, [customizerConfig?.theme]);

  // Responsive observation
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
  const isDesktop = !isMobile && !isTablet;

  // View state
  const [currentView, setCurrentView] = useState<StoreView>("catalog");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // E-Commerce Data State
  const [products] = useState<Product[]>(PRODUCTS_DATA);
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS_DATA[0], quantity: 1, selectedColor: PRODUCTS_DATA[0].colors[0] },
    { product: PRODUCTS_DATA[2], quantity: 1, selectedColor: PRODUCTS_DATA[2].colors[0] },
  ]);
  const [wishlist, setWishlist] = useState<string[]>(["prod-1", "prod-2"]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  // Product Detail selection
  const [detailColor, setDetailColor] = useState<string>("");
  const [detailQty, setDetailQty] = useState<number>(1);

  // Cart & Promo
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Checkout Form State
  const [checkoutData, setCheckoutData] = useState({
    name: "Alex Rivera",
    email: "alex.rivera@nexcore.io",
    address: "742 Evergreen Terrace",
    city: "San Francisco",
    postalCode: "94107",
    cardNumber: "•••• •••• •••• 4242",
    cardExp: "12/28",
    cardCvc: "888",
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  // User Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>({
    name: "Alex Rivera",
    email: "alex.rivera@nexcore.io",
  });

  // New Review Form State
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSuccessToast, setReviewSuccessToast] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, categoryFilter, searchQuery, sortBy]);

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartShipping = cartSubtotal > 150 || cart.length === 0 ? 0 : 15;
  const cartTotal = Math.max(0, cartSubtotal - promoDiscount + (cart.length > 0 ? cartShipping : 0));
  const cartItemsCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  // Cart Actions
  const addToCart = (product: Product, color?: string, qty = 1) => {
    const selected = color || product.colors[0];
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedColor === selected);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === selected
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty, selectedColor: selected }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const updateQuantity = (productId: string, color: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedColor === color) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string, color: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedColor === color)));
    showToast("Item removed from cart");
  };

  // Wishlist Action
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to wishlist");
        return [...prev, productId];
      }
    });
  };

  // Promo Code Validation
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");
    const clean = promoCode.trim().toUpperCase();
    if (clean === "PRO2026") {
      const discount = Math.round(cartSubtotal * 0.15);
      setPromoDiscount(discount);
      setPromoSuccess("Code PRO2026 applied: 15% discount!");
      showToast("15% discount applied!");
    } else if (clean === "NEXORE10") {
      setPromoDiscount(10);
      setPromoSuccess("Code NEXORE10 applied: $10 off!");
      showToast("$10 discount applied!");
    } else {
      setPromoError("Invalid promotional code.");
    }
  };

  // Open Detail View
  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setDetailColor(product.colors[0]);
    setDetailQty(1);
    setCurrentView("product-detail");
  };

  // Place Order Simulation
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderConfirmed(true);
      setConfirmedOrderId(`NEX-${Math.floor(100000 + Math.random() * 900000)}`);
      setCart([]);
      setPromoDiscount(0);
      setPromoCode("");
    }, 1200);
  };

  // Add Review Simulation
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: selectedProduct ? selectedProduct.id : "prod-1",
      author: currentUser?.name || "Verified Customer",
      rating: newReviewRating,
      date: "Just now",
      verified: true,
      comment: newReviewComment.trim(),
    };

    setReviews([newRev, ...reviews]);
    setNewReviewComment("");
    setReviewSuccessToast(true);
    showToast("Review published successfully!");
    setTimeout(() => setReviewSuccessToast(false), 3000);
  };

  return (
    <div
      ref={rootRef}
      className={`w-full min-h-screen font-sans transition-colors duration-200 select-none ${
        internalDark ? "bg-[#09090b] text-[#fafafa]" : "bg-white text-[#09090b]"
      }`}
    >
      {/* ═══════════════════════════ NAVBAR ═══════════════════════════ */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          internalDark ? "border-zinc-800 bg-[#09090b]/95" : "border-zinc-200 bg-white/95"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Top Row */}
          <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" onClick={() => setCurrentView("catalog")}>
              <div
                className={`h-7 w-7 rounded-md flex items-center justify-center font-bold text-xs ${
                  internalDark ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-zinc-50"
                }`}
              >
                NX
              </div>
              <span className="font-bold text-sm sm:text-base tracking-tight">NEXSTORE</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold border border-zinc-700">
                PRO
              </span>
            </div>

            {/* Desktop / Tablet Navigation Links */}
            {!isMobile && (
              <nav className="flex items-center gap-1 text-xs sm:text-sm font-medium">
                <button
                  onClick={() => setCurrentView("catalog")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    currentView === "catalog"
                      ? internalDark
                        ? "text-zinc-50 bg-zinc-900"
                        : "text-zinc-900 bg-zinc-100"
                      : internalDark
                      ? "text-zinc-400 hover:text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Shop
                </button>
                <button
                  onClick={() => setCurrentView("wishlist")}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                    currentView === "wishlist"
                      ? internalDark
                        ? "text-zinc-50 bg-zinc-900"
                        : "text-zinc-900 bg-zinc-100"
                      : internalDark
                      ? "text-zinc-400 hover:text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <span>Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCurrentView("reviews")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    currentView === "reviews"
                      ? internalDark
                        ? "text-zinc-50 bg-zinc-900"
                        : "text-zinc-900 bg-zinc-100"
                      : internalDark
                      ? "text-zinc-400 hover:text-zinc-100"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Reviews
                </button>
              </nav>
            )}

            {/* Desktop / Tablet Search Input */}
            {!isMobile && (
              <div className="relative w-36 sm:w-48 lg:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== "catalog") setCurrentView("catalog");
                  }}
                  className={`w-full pl-8 pr-3 py-1.5 rounded-md border text-xs outline-none transition-colors ${
                    internalDark
                      ? "bg-transparent border-zinc-800 placeholder:text-zinc-600 focus:border-zinc-500"
                      : "bg-transparent border-zinc-200 placeholder:text-zinc-400 focus:border-zinc-900"
                  }`}
                />
              </div>
            )}

            {/* Controls (Theme, Auth, Cart) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Dark / Light Toggle */}
              <button
                onClick={() => setInternalDark(!internalDark)}
                className={`p-1.5 sm:p-2 rounded-md border transition-colors ${
                  internalDark
                    ? "border-zinc-800 hover:bg-zinc-900 text-zinc-300"
                    : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                }`}
                title="Toggle theme"
              >
                {internalDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* User Account / Auth Button */}
              {currentUser ? (
                <div
                  onClick={() => setAuthModalOpen(true)}
                  className={`cursor-pointer flex items-center gap-1.5 p-1 sm:p-1.5 sm:px-2 rounded-md border text-xs font-medium transition-colors ${
                    internalDark
                      ? "border-zinc-800 hover:bg-zinc-900 text-zinc-200"
                      : "border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                  }`}
                  title="Account"
                >
                  <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name[0]}
                  </div>
                  {!isMobile && (
                    <span className="hidden sm:inline-block max-w-[80px] truncate">{currentUser.name}</span>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                  }}
                  className={`p-1.5 sm:p-2 rounded-md border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    internalDark
                      ? "border-zinc-800 hover:bg-zinc-900 text-zinc-300"
                      : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                  }`}
                >
                  <User className="h-4 w-4" />
                  {!isMobile && <span>Sign In</span>}
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setCurrentView("cart")}
                className={`relative p-1.5 sm:p-2 rounded-md transition-colors flex items-center gap-1.5 ${
                  currentView === "cart"
                    ? internalDark
                      ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                      : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                    : internalDark
                    ? "border border-zinc-800 hover:bg-zinc-900 text-zinc-300"
                    : "border border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                }`}
                title="View Cart"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="text-xs font-bold font-mono">{cartItemsCount}</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Sub-Bar & Full Search */}
          {isMobile && (
            <div className="pb-2.5 pt-1 space-y-2 border-t border-zinc-800/40">
              {/* Mobile Tab Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setCurrentView("catalog")}
                  className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 transition-colors ${
                    currentView === "catalog"
                      ? internalDark
                        ? "bg-zinc-100 text-zinc-950 font-bold"
                        : "bg-zinc-900 text-zinc-50 font-bold"
                      : internalDark
                      ? "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                      : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200"
                  }`}
                >
                  Shop
                </button>
                <button
                  onClick={() => setCurrentView("wishlist")}
                  className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 transition-colors flex items-center gap-1 ${
                    currentView === "wishlist"
                      ? internalDark
                        ? "bg-zinc-100 text-zinc-950 font-bold"
                        : "bg-zinc-900 text-zinc-50 font-bold"
                      : internalDark
                      ? "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                      : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200"
                  }`}
                >
                  <span>Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="text-[10px] font-mono px-1 rounded-full bg-zinc-800 text-zinc-300">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCurrentView("reviews")}
                  className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 transition-colors ${
                    currentView === "reviews"
                      ? internalDark
                        ? "bg-zinc-100 text-zinc-950 font-bold"
                        : "bg-zinc-900 text-zinc-50 font-bold"
                      : internalDark
                      ? "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                      : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200"
                  }`}
                >
                  Reviews
                </button>
              </div>

              {/* Mobile Search Input */}
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search 10 tech products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== "catalog") setCurrentView("catalog");
                  }}
                  className={`w-full pl-8 pr-3 py-1.5 rounded-md border text-xs outline-none ${
                    internalDark
                      ? "bg-zinc-900/60 border-zinc-800 placeholder:text-zinc-500 text-zinc-100 focus:border-zinc-500"
                      : "bg-zinc-50 border-zinc-200 placeholder:text-zinc-400 text-zinc-900 focus:border-zinc-900"
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ═══════════════════════════ MAIN CONTENT ═══════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* ═══════════════ VIEW 1: CATALOG / STOREFRONT ═══════════════ */}
          {currentView === "catalog" && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Category Pills & Sort Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {["All", "Audio", "Wearables", "Workspace", "Cameras", "Accessories"].map((cat) => {
                    const isSelected = categoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                          isSelected
                            ? internalDark
                              ? "bg-zinc-100 text-zinc-950 font-semibold"
                              : "bg-zinc-900 text-zinc-50 font-semibold"
                            : internalDark
                            ? "border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                            : "border border-zinc-200 text-zinc-600 hover:text-zinc-900"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className={`px-2.5 py-1.5 rounded-md border text-xs outline-none cursor-pointer ${
                      internalDark
                        ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                        : "bg-zinc-50 border-zinc-200 text-zinc-800"
                    }`}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* 10 Products Grid */}
              <div
                className={`grid ${
                  isMobile
                    ? "grid-cols-1 gap-4"
                    : isTablet
                    ? "grid-cols-2 gap-4"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                }`}
              >
                {filteredProducts.map((product) => {
                  const isWish = wishlist.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className={`group rounded-xl border overflow-hidden flex flex-col transition-all duration-200 hover:border-zinc-500/50 ${
                        internalDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-white shadow-sm"
                      }`}
                    >
                      {/* Product Image & Badges */}
                      <div
                        className="relative aspect-square w-full overflow-hidden bg-zinc-950 cursor-pointer"
                        onClick={() => handleOpenDetail(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-2.5 left-2.5">
                            <span
                              className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded shadow-sm ${
                                internalDark
                                  ? "bg-zinc-900/90 text-zinc-100 border border-zinc-700"
                                  : "bg-white/95 text-zinc-900 border border-zinc-200"
                              }`}
                            >
                              {product.badge}
                            </span>
                          </div>
                        )}
                        {/* Wishlist Heart */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-transform active:scale-90 ${
                            isWish
                              ? "bg-rose-500 text-white"
                              : internalDark
                              ? "bg-black/60 text-zinc-300 hover:text-white"
                              : "bg-white/80 text-zinc-700 hover:text-black"
                          }`}
                        >
                          <Heart className="h-3.5 w-3.5 fill-current" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
                            <span>{product.category}</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-3 w-3 fill-current" />
                              <span className="font-bold text-zinc-300">{product.rating}</span>
                              <span className="text-zinc-500">({product.reviewsCount})</span>
                            </div>
                          </div>
                          <h3
                            onClick={() => handleOpenDetail(product)}
                            className="font-medium text-sm leading-snug line-clamp-2 cursor-pointer hover:underline"
                          >
                            {product.name}
                          </h3>
                        </div>

                        {/* Price & Add Button */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40 gap-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-base font-mono">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-xs font-mono text-zinc-500 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenDetail(product)}
                              className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                                internalDark
                                  ? "border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                                  : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                              }`}
                            >
                              Details
                            </button>
                            <button
                              onClick={() => addToCart(product)}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                                internalDark
                                  ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                                  : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                              }`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ═══════════════ VIEW 2: PRODUCT DETAIL PAGE ═══════════════ */}
          {currentView === "product-detail" && selectedProduct && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <button
                onClick={() => setCurrentView("catalog")}
                className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Catalog</span>
              </button>

              <div className={`${isMobile || isTablet ? "flex flex-col gap-6" : "grid grid-cols-1 lg:grid-cols-2 gap-10"}`}>
                {/* Photo Gallery Large */}
                <div className="rounded-2xl border overflow-hidden aspect-square bg-zinc-950 border-zinc-800">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Detail Specifications */}
                <div className="flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-500 tracking-wider">
                        {selectedProduct.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold text-zinc-200">{selectedProduct.rating}</span>
                        <span className="text-zinc-500">({selectedProduct.reviewsCount} customer reviews)</span>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                      {selectedProduct.name}
                    </h1>

                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold font-mono">${selectedProduct.price}</span>
                      {selectedProduct.originalPrice && (
                        <span className="text-lg font-mono text-zinc-500 line-through">
                          ${selectedProduct.originalPrice}
                        </span>
                      )}
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        In Stock & Ready to Ship
                      </span>
                    </div>

                    <p className={`text-sm leading-relaxed ${internalDark ? "text-zinc-300" : "text-zinc-600"}`}>
                      {selectedProduct.description}
                    </p>

                    {/* Features list */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {selectedProduct.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Color selection */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-medium text-zinc-400">Color finish</label>
                      <div className="flex items-center gap-2">
                        {selectedProduct.colors.map((c, i) => (
                          <button
                            key={i}
                            onClick={() => setDetailColor(c)}
                            className={`w-7 h-7 rounded-full border-2 transition-transform ${
                              detailColor === c ? "scale-110 border-indigo-500" : "border-transparent"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 pt-2">
                      <label className="text-xs font-medium text-zinc-400">Quantity</label>
                      <div className="flex items-center rounded-md border border-zinc-800 text-xs">
                        <button
                          onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                          className="p-2 hover:bg-zinc-800"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono font-bold">{detailQty}</span>
                        <button
                          onClick={() => setDetailQty(detailQty + 1)}
                          className="p-2 hover:bg-zinc-800"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`pt-4 border-t border-zinc-800 flex ${isMobile ? "flex-col gap-2.5" : "gap-3"}`}>
                    <button
                      onClick={() => addToCart(selectedProduct, detailColor, detailQty)}
                      className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        internalDark
                          ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                          : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Cart (${selectedProduct.price * detailQty})</span>
                    </button>
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, detailColor, detailQty);
                        setCurrentView("checkout");
                      }}
                      className="py-3 px-6 rounded-md text-sm font-semibold border border-indigo-500 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════ VIEW 3: CART ═══════════════ */}
          {currentView === "cart" && (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h1 className="text-2xl font-semibold tracking-tight">Shopping Cart</h1>
                <span className="text-sm font-mono text-zinc-500">{cart.length} unique items</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800/60 mx-auto flex items-center justify-center text-zinc-500">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold">Your cart is empty</h3>
                    <p className="text-sm text-zinc-500">Discover our high-performance hardware and accessories.</p>
                  </div>
                  <button
                    onClick={() => setCurrentView("catalog")}
                    className={`py-2 px-4 rounded-md text-sm font-medium ${
                      internalDark ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-zinc-50"
                    }`}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className={`${isMobile || isTablet ? "flex flex-col gap-6" : "grid grid-cols-1 lg:grid-cols-3 gap-8"}`}>
                  {/* Cart Items List */}
                  <div className={`${isMobile || isTablet ? "space-y-3" : "lg:col-span-2 space-y-4"}`}>
                    {cart.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedColor}`}
                        className={`p-3.5 sm:p-4 rounded-xl border ${
                          isMobile ? "flex flex-col gap-3" : "flex gap-4 items-center justify-between"
                        } ${
                          internalDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover bg-zinc-900 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs sm:text-sm truncate">{item.product.name}</h4>
                            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-500 mt-1">
                              <span className="flex items-center gap-1">
                                Color:
                                <span
                                  className="w-2.5 h-2.5 rounded-full inline-block border border-zinc-700"
                                  style={{ backgroundColor: item.selectedColor }}
                                />
                              </span>
                              <span>•</span>
                              <span className="font-mono">${item.product.price} each</span>
                            </div>
                          </div>
                        </div>

                        {/* Controls (Qty, Total, Delete) */}
                        <div className={`flex items-center ${isMobile ? "justify-between pt-2 border-t border-zinc-800/40" : "gap-4"}`}>
                          <div className="flex items-center rounded-md border border-zinc-800 text-xs">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedColor, -1)}
                              className="p-1.5 hover:bg-zinc-800"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center font-mono font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedColor, 1)}
                              className="p-1.5 hover:bg-zinc-800"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold font-mono text-sm">
                              ${item.product.price * item.quantity}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                              className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Checkout Card */}
                  <div
                    className={`p-4 sm:p-6 rounded-xl border space-y-5 h-fit ${
                      internalDark ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-200 bg-zinc-50"
                    }`}
                  >
                    <h3 className="font-semibold text-base">Order Summary</h3>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Subtotal</span>
                        <span className="font-mono font-medium">${cartSubtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Shipping</span>
                        <span className="font-mono font-medium">
                          {cartShipping === 0 ? "FREE" : `$${cartShipping}`}
                        </span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Discount</span>
                          <span className="font-mono font-medium">-${promoDiscount}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span className="font-mono">${cartTotal}</span>
                      </div>
                    </div>

                    {/* Promo Code Input */}
                    <form onSubmit={handleApplyPromo} className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo code (PRO2026)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className={`flex-1 px-3 py-1.5 rounded-md border text-xs outline-none ${
                            internalDark
                              ? "bg-transparent border-zinc-800 placeholder:text-zinc-600 focus:border-zinc-500"
                              : "bg-transparent border-zinc-200 placeholder:text-zinc-400 focus:border-zinc-900"
                          }`}
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-md border border-zinc-700 text-xs font-medium hover:bg-zinc-800 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {promoSuccess && <p className="text-[11px] text-emerald-400">{promoSuccess}</p>}
                      {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
                    </form>

                    <button
                      onClick={() => setCurrentView("checkout")}
                      className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        internalDark
                          ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                          : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                      }`}
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════ VIEW 4: CHECKOUT ═══════════════ */}
          {currentView === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <button
                onClick={() => setCurrentView("cart")}
                className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Cart</span>
              </button>

              {!orderConfirmed ? (
                <div className={`${isMobile || isTablet ? "flex flex-col gap-6" : "grid grid-cols-1 lg:grid-cols-3 gap-8"}`}>
                  {/* Checkout Form */}
                  <form onSubmit={handlePlaceOrder} className={`${isMobile || isTablet ? "space-y-4" : "lg:col-span-2 space-y-6"}`}>
                    {/* Shipping Address */}
                    <div
                      className={`p-4 sm:p-6 rounded-xl border space-y-4 ${
                        internalDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-white"
                      }`}
                    >
                      <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                        <Truck className="h-4 w-4 text-zinc-400" />
                        <span>1. Shipping Details</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-400">Full Name</label>
                          <input
                            type="text"
                            required
                            value={checkoutData.name}
                            onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                            className={`w-full px-3 py-2 rounded-md border text-xs outline-none ${
                              internalDark ? "bg-transparent border-zinc-800" : "bg-transparent border-zinc-200"
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-400">Email Address</label>
                          <input
                            type="email"
                            required
                            value={checkoutData.email}
                            onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                            className={`w-full px-3 py-2 rounded-md border text-xs outline-none ${
                              internalDark ? "bg-transparent border-zinc-800" : "bg-transparent border-zinc-200"
                            }`}
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-medium text-zinc-400">Street Address</label>
                          <input
                            type="text"
                            required
                            value={checkoutData.address}
                            onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                            className={`w-full px-3 py-2 rounded-md border text-xs outline-none ${
                              internalDark ? "bg-transparent border-zinc-800" : "bg-transparent border-zinc-200"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div
                      className={`p-4 sm:p-6 rounded-xl border space-y-4 ${
                        internalDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-white"
                      }`}
                    >
                      <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-zinc-400" />
                        <span>2. Payment Method</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-medium text-zinc-400">Card Number</label>
                          <input
                            type="text"
                            required
                            value={checkoutData.cardNumber}
                            onChange={(e) => setCheckoutData({ ...checkoutData, cardNumber: e.target.value })}
                            className={`w-full px-3 py-2 rounded-md border text-xs font-mono outline-none ${
                              internalDark ? "bg-transparent border-zinc-800" : "bg-transparent border-zinc-200"
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-400">Expiration</label>
                          <input
                            type="text"
                            required
                            value={checkoutData.cardExp}
                            onChange={(e) => setCheckoutData({ ...checkoutData, cardExp: e.target.value })}
                            className={`w-full px-3 py-2 rounded-md border text-xs font-mono outline-none ${
                              internalDark ? "bg-transparent border-zinc-800" : "bg-transparent border-zinc-200"
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-400">CVC</label>
                          <input
                            type="text"
                            required
                            value={checkoutData.cardCvc}
                            onChange={(e) => setCheckoutData({ ...checkoutData, cardCvc: e.target.value })}
                            className={`w-full px-3 py-2 rounded-md border text-xs font-mono outline-none ${
                              internalDark ? "bg-transparent border-zinc-800" : "bg-transparent border-zinc-200"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isCheckingOut}
                      className={`w-full py-3 px-4 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        internalDark
                          ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                          : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                      }`}
                    >
                      {isCheckingOut ? (
                        <span>Processing Encrypted Payment...</span>
                      ) : (
                        <span>Pay ${cartTotal} & Place Order</span>
                      )}
                    </button>
                  </form>

                  {/* Summary Sidebar */}
                  <div
                    className={`p-4 sm:p-6 rounded-xl border space-y-4 h-fit ${
                      internalDark ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-200 bg-zinc-50"
                    }`}
                  >
                    <h3 className="font-semibold text-sm">Summary ({cart.length} items)</h3>
                    <div className="space-y-2 text-xs">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex justify-between">
                          <span className="text-zinc-400 truncate max-w-[160px]">{item.product.name} (x{item.quantity})</span>
                          <span className="font-mono">${item.product.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-zinc-800 flex justify-between font-bold text-sm">
                        <span>Total Due</span>
                        <span className="font-mono">${cartTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Order Confirmation Modal / Screen */
                <div
                  className={`max-w-lg mx-auto p-8 rounded-2xl border text-center space-y-4 ${
                    internalDark ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Order Confirmed!</h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Order reference <span className="font-mono text-indigo-400 font-bold">{confirmedOrderId}</span> has been dispatched for fulfillment.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-zinc-800 text-xs space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Recipient:</span>
                      <span className="font-medium">{checkoutData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Delivery Address:</span>
                      <span className="font-medium">{checkoutData.address}, {checkoutData.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Total Charged:</span>
                      <span className="font-mono font-bold">${cartTotal}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOrderConfirmed(false);
                      setCurrentView("catalog");
                    }}
                    className={`w-full py-2 px-4 rounded-md text-xs font-semibold ${
                      internalDark ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-zinc-50"
                    }`}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════ VIEW 5: REVIEWS ═══════════════ */}
          {currentView === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Customer Reviews</h1>
                  <p className="text-xs text-zinc-500 mt-0.5">Verified purchaser testimonials and technical reviews</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-500 text-sm">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold text-zinc-200">4.9</span>
                    <span className="text-zinc-500">/ 5.0 (98% satisfaction)</span>
                  </div>
                </div>
              </div>

              {/* Submit Review Box */}
              <form onSubmit={handleAddReview} className={`p-4 rounded-xl border space-y-3 ${
                internalDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-white"
              }`}>
                <h4 className="text-xs font-semibold uppercase text-zinc-400">Leave a verified review</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className={`p-0.5 ${star <= newReviewRating ? "text-amber-500" : "text-zinc-600"}`}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Write your product experience..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-md border text-xs outline-none ${
                      internalDark
                        ? "bg-transparent border-zinc-800 placeholder:text-zinc-600 focus:border-zinc-500"
                        : "bg-transparent border-zinc-200 placeholder:text-zinc-400 focus:border-zinc-900"
                    }`}
                  />
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-xs font-semibold ${
                      internalDark ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-zinc-50"
                    }`}
                  >
                    Post Review
                  </button>
                </div>
              </form>

              {/* Reviews Feed */}
              <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 gap-4"}`}>
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-5 rounded-xl border space-y-3 ${
                      internalDark ? "border-zinc-800 bg-zinc-900/20" : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs">
                          {rev.author[0]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight">{rev.author}</p>
                          <p className="text-[10px] text-zinc-500">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed ${internalDark ? "text-zinc-300" : "text-zinc-700"}`}>
                      “{rev.comment}”
                    </p>
                    {rev.verified && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verified Purchase</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════════════ VIEW 6: WISHLIST ═══════════════ */}
          {currentView === "wishlist" && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h1 className="text-2xl font-semibold tracking-tight">Your Wishlist</h1>
                <span className="text-sm font-mono text-zinc-500">{wishlist.length} saved products</span>
              </div>

              {wishlist.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <Heart className="h-8 w-8 text-zinc-600 mx-auto" />
                  <p className="text-sm text-zinc-500">You haven't saved any items yet.</p>
                </div>
              ) : (
                <div
                  className={`grid ${
                    isMobile
                      ? "grid-cols-1 gap-4"
                      : isTablet
                      ? "grid-cols-2 gap-4"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  }`}
                >
                  {products
                    .filter((p) => wishlist.includes(p.id))
                    .map((p) => (
                      <div
                        key={p.id}
                        className={`rounded-xl border overflow-hidden flex flex-col justify-between p-4 space-y-3 ${
                          internalDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-white"
                        }`}
                      >
                        <img src={p.image} alt={p.name} className="aspect-square rounded-lg object-cover bg-zinc-900" />
                        <div>
                          <h4 className="font-medium text-sm truncate">{p.name}</h4>
                          <p className="font-mono font-bold text-sm mt-1">${p.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(p)}
                            className={`flex-1 py-1.5 rounded-md text-xs font-semibold ${
                              internalDark ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-zinc-50"
                            }`}
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="p-1.5 border border-zinc-800 rounded-md text-zinc-400 hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ═══════════════ INTEGRATED AUTH MODAL ═══════════════ */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-sm p-6 rounded-2xl border shadow-2xl relative space-y-5 ${
                internalDark ? "border-zinc-800 bg-[#09090b] text-white" : "border-zinc-200 bg-white text-zinc-900"
              }`}
            >
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>

              {currentUser ? (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 font-bold text-base flex items-center justify-center mx-auto">
                    {currentUser.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{currentUser.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono">{currentUser.email}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 space-y-2">
                    <button
                      onClick={() => {
                        setCurrentUser(null);
                        setAuthModalOpen(false);
                        showToast("Signed out successfully");
                      }}
                      className="w-full py-2 rounded-md border border-rose-500/20 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-lg">
                      {authMode === "login" ? "Sign In to Account" : "Create Account"}
                    </h3>
                    <p className="text-xs text-zinc-500">Sync cart, wishlists, and track orders</p>
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentUser({ name: "Google Customer", email: "customer@gmail.com" });
                        setAuthModalOpen(false);
                        showToast("Signed in with Google");
                      }}
                      className="py-2 px-3 rounded-md border border-zinc-800 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-zinc-900"
                    >
                      <GoogleIcon className="h-3.5 w-3.5" />
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentUser({ name: "GitHub Developer", email: "dev@github.com" });
                        setAuthModalOpen(false);
                        showToast("Signed in with GitHub");
                      }}
                      className="py-2 px-3 rounded-md border border-zinc-800 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-zinc-900"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      <span>GitHub</span>
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCurrentUser({ name: userEmail.split("@")[0] || "Customer", email: userEmail || "user@nexstore.io" });
                      setAuthModalOpen(false);
                      showToast(`Welcome back, ${userEmail.split("@")[0] || "Customer"}!`);
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border text-xs outline-none ${
                        internalDark ? "bg-transparent border-zinc-800" : "bg-transparent border-zinc-200"
                      }`}
                    />
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border text-xs outline-none ${
                        internalDark ? "bg-transparent border-zinc-800" : "bg-transparent border-zinc-200"
                      }`}
                    />
                    <button
                      type="submit"
                      className={`w-full py-2 rounded-md text-xs font-semibold ${
                        internalDark ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-zinc-50"
                      }`}
                    >
                      {authMode === "login" ? "Sign In" : "Register"}
                    </button>
                  </form>

                  <div className="text-center text-xs text-zinc-500">
                    {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                      className="underline text-zinc-300 font-medium"
                    >
                      {authMode === "login" ? "Register" : "Sign In"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════ TOAST ═══════════════ */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className={`fixed bottom-6 right-6 p-3 px-4 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-medium z-50 ${
              internalDark ? "border-zinc-800 bg-zinc-900 text-zinc-100" : "border-zinc-200 bg-white text-zinc-900"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
