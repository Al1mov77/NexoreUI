"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingBag,
  Heart,
  Star,
  Check,
  ShieldCheck,
  Lock,
  Download,
  CreditCard,
  Copy,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Zap,
  Tag
} from "lucide-react"
import { cn } from "../utils/cn"

// ============================================
// 1. ProductCardPro — Modern Luxury Product Card
// ============================================

export interface ProductCardProProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  price: string | number
  originalPrice?: string | number
  badge?: string
  rating?: number
  reviewCount?: number
  imageSrc?: string
  image?: string
  colors?: string[]
  onAddToCart?: () => void
}

export function ProductCardPro({
  name,
  price,
  originalPrice,
  badge = "Bestseller",
  rating = 4.9,
  reviewCount = 248,
  imageSrc,
  image,
  colors = ["#18181b", "#6366f1", "#06b6d4"],
  onAddToCart,
  className,
  ...props
}: ProductCardProProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [selectedColor, setSelectedColor] = React.useState(0)
  const [isAdded, setIsAdded] = React.useState(false)

  const effectiveImage = image || imageSrc

  const handleAdd = () => {
    setIsAdded(true)
    onAddToCart?.()
    setTimeout(() => setIsAdded(false), 1800)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "rounded-3xl border border-border/80 bg-card text-card-foreground p-4 w-full max-w-sm shadow-xl shadow-black/5 dark:shadow-black/40 overflow-hidden relative group backdrop-blur-md",
        className
      )}
      {...(props as any)}
    >
      {/* Product Image / Visual Container */}
      <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-muted/60 via-card to-background border border-border/50 overflow-hidden flex items-center justify-center">
        {/* Atmospheric ambient glow */}
        <div
          className="absolute inset-0 opacity-20 blur-2xl transition-colors duration-500 pointer-events-none"
          style={{ backgroundColor: colors[selectedColor] || "#6366f1" }}
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-[11px] font-bold tracking-wide shadow-md backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              {badge}
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 hover:bg-background backdrop-blur-md border border-border/80 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-xs"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isWishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-foreground"
            )}
          />
        </button>

        {/* Product Visual */}
        {effectiveImage ? (
          <img
            src={effectiveImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 select-none group-hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent border border-primary/20 flex items-center justify-center text-primary shadow-lg">
              <ShoppingBag className="w-9 h-9" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
              STUDIO SERIES
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="pt-4 space-y-3">
        {/* Rating & Color Swatches */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-foreground">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>

          {/* Color choices */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1">
              {colors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedColor(i)}
                  className={cn(
                    "w-4 h-4 rounded-full border border-background shadow-xs transition-transform cursor-pointer",
                    selectedColor === i ? "scale-125 ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                  )}
                  style={{ backgroundColor: c }}
                  title={`Color option ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Name Title */}
        <h3 className="font-bold text-base text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-foreground tracking-tight">
            ${price}
          </span>
          {originalPrice && (
            <span className="text-sm font-medium text-muted-foreground line-through">
              ${originalPrice}
            </span>
          )}
          {originalPrice && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 ml-auto">
              SAVE ${(Number(originalPrice) - Number(price)).toFixed(0)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd}
          className={cn(
            "w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md",
            isAdded
              ? "bg-emerald-600 text-white shadow-emerald-500/25"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

// ============================================
// 2. CheckoutSummary — High-Conversion Order Summary
// ============================================

export interface CheckoutSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  subtotal: string | number
  shipping?: string
  tax?: string | number
  total: string | number
  onCheckout?: () => void
}

export function CheckoutSummary({
  subtotal = "299.98",
  shipping = "Free",
  tax = "24.00",
  total = "323.98",
  onCheckout,
  className,
  ...props
}: CheckoutSummaryProps) {
  const [promoCode, setPromoCode] = React.useState("")
  const [applied, setApplied] = React.useState(false)

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.trim()) {
      setApplied(true)
    }
  }

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md p-6 w-full max-w-md shadow-2xl shadow-black/10 dark:shadow-black/40 space-y-5 text-card-foreground",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <h3 className="font-bold text-base text-foreground tracking-tight">Order Summary</h3>
        <span className="text-xs font-mono text-muted-foreground">3 Items</span>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value)
              setApplied(false)
            }}
            placeholder="Discount code or gift card"
            className="w-full pl-8.5 pr-3 py-2 text-xs rounded-xl border border-border bg-background/60 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!promoCode.trim() || applied}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border disabled:opacity-40 transition-colors cursor-pointer"
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </form>

      {/* Cost Breakdown */}
      <div className="space-y-2.5 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-mono font-medium text-foreground">${subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Express Delivery</span>
          <span className="font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {shipping}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Estimated Taxes (HST)</span>
          <span className="font-mono font-medium text-foreground">${tax}</span>
        </div>

        {applied && (
          <div className="flex justify-between items-center text-emerald-500 font-medium">
            <span>Promo Discount (10% OFF)</span>
            <span className="font-mono">-$29.99</span>
          </div>
        )}
      </div>

      {/* Total Separator */}
      <div className="pt-3 border-t border-border flex items-baseline justify-between">
        <div>
          <span className="font-bold text-sm text-foreground">Total Due</span>
          <p className="text-[10px] text-muted-foreground">Includes all regional sales taxes</p>
        </div>
        <span className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
          ${total}
        </span>
      </div>

      {/* Primary CTA Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onCheckout}
        className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <Lock className="w-3.5 h-3.5" />
        <span>Complete Secure Checkout</span>
      </motion.button>

      {/* Security & Trust Row */}
      <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-muted-foreground select-none">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>256-Bit SSL</span>
        </div>
        <span>•</span>
        <span>Money-Back Guarantee</span>
        <span>•</span>
        <span>Apple Pay</span>
      </div>
    </div>
  )
}

// ============================================
// 3. SubscriptionCard — Modern SaaS Tier Card
// ============================================

export interface SubscriptionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  plan: string
  price: string | number
  billingPeriod?: string
  nextBilling?: string
  status?: "active" | "cancelled" | "past_due"
  features?: string[]
  isPopular?: boolean
  onUpgrade?: () => void
}

export function SubscriptionCard({
  plan = "Pro Developer",
  price = "49",
  billingPeriod = "month",
  nextBilling = "Oct 01, 2026",
  status = "active",
  features = [
    "Unlimited Team Workspaces",
    "Real-time Cloud Analytics",
    "Priority 24/7 Support",
    "Dedicated CDN Edge Endpoints",
    "Custom Domain Verification"
  ],
  isPopular = true,
  onUpgrade,
  className,
  ...props
}: SubscriptionCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md p-6 w-full max-w-sm shadow-xl relative overflow-hidden text-card-foreground space-y-6",
        isPopular && "border-primary/50 shadow-primary/10",
        className
      )}
      {...props}
    >
      {/* Decorative Glow */}
      {isPopular && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {plan}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-foreground tracking-tight font-mono">
              ${price}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/{billingPeriod}</span>
          </div>
        </div>

        {isPopular && (
          <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider">
            POPULAR
          </span>
        )}
      </div>

      {/* Features List */}
      <div className="space-y-2.5 pt-2 border-t border-border/60">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Included with plan:
        </p>
        <ul className="space-y-2 text-xs">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-foreground/90">
              <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onUpgrade}
        className="w-full py-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <span>Upgrade to {plan}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  )
}

// ============================================
// 4. CreditCardVisual — Holographic Luxury Card
// ============================================

export interface CreditCardVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  holder?: string
  number?: string
  expiry?: string
  type?: "visa" | "mastercard" | "amex"
}

export function CreditCardVisual({
  holder = "ALEXANDER VANCE",
  number = "•••• •••• •••• 8842",
  expiry = "09/29",
  type = "visa",
  className,
  ...props
}: CreditCardVisualProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-sm aspect-[1.6/1] rounded-2xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 border border-white/10 p-6 text-white shadow-2xl overflow-hidden select-none flex flex-col justify-between",
        className
      )}
      {...props}
    >
      {/* Gloss reflection overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header with Chip and Contactless */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {/* Gold EMV Chip */}
          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200/50 shadow-xs relative overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-amber-900/30" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-amber-900/30" />
          </div>

          {/* Contactless Wave */}
          <svg className="w-5 h-5 text-white/70 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.393 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>

        {/* Brand */}
        <span className="font-mono text-sm font-extrabold tracking-widest uppercase opacity-80">
          NEXORE BLACK
        </span>
      </div>

      {/* Middle Card Number */}
      <div className="z-10 tracking-[0.2em] font-mono text-lg text-white/95 font-medium shadow-xs">
        {number}
      </div>

      {/* Bottom Cardholder & Expiry */}
      <div className="flex items-end justify-between z-10 text-[11px] font-mono">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-white/50">CARDHOLDER</p>
          <p className="font-semibold tracking-wider uppercase text-white/90">{holder}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest text-white/50">EXPIRES</p>
          <p className="font-semibold tracking-wider text-white/90">{expiry}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 5. CartItem — Modern Cart Drawer List Item
// ============================================

export interface CartItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  price: string | number
  quantity?: number
  onQuantityChange?: (qty: number) => void
  onRemove?: () => void
}

export function CartItem({
  name,
  price,
  quantity = 1,
  onQuantityChange,
  onRemove,
  className,
  ...props
}: CartItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 py-3.5 px-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-primary shrink-0">
        <ShoppingBag className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm truncate text-foreground">{name}</h4>
        <p className="text-xs font-mono font-bold text-primary mt-0.5">${price}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0 bg-muted/40 p-1 rounded-xl border border-border/60">
        <button
          type="button"
          onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
          className="w-6 h-6 rounded-lg bg-card hover:bg-muted flex items-center justify-center text-xs transition-colors cursor-pointer border border-border/40"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-xs font-mono font-bold">{quantity}</span>
        <button
          type="button"
          onClick={() => onQuantityChange?.(quantity + 1)}
          className="w-6 h-6 rounded-lg bg-card hover:bg-muted flex items-center justify-center text-xs transition-colors cursor-pointer border border-border/40"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ============================================
// 6. InvoiceCard — Digital Invoice Summary
// ============================================

export interface InvoiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  invoiceNumber: string
  date: string
  status?: "paid" | "pending" | "overdue"
  amount: string | number
  client: string
  onDownload?: () => void
}

export function InvoiceCard({
  invoiceNumber = "INV-2026-001",
  date = "Oct 24, 2026",
  status = "paid",
  amount = "1,250.00",
  client = "Acme Global Corp",
  onDownload,
  className,
  ...props
}: InvoiceCardProps) {
  const statusStyles = {
    paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    overdue: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 hover:shadow-lg transition-all duration-200 w-full max-w-sm text-card-foreground space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-xs font-bold text-foreground">{invoiceNumber}</span>
          <p className="text-[11px] text-muted-foreground">{date}</p>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border",
            statusStyles[status] || statusStyles.paid
          )}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">BILLED TO</p>
          <p className="text-xs font-semibold text-foreground">{client}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AMOUNT</p>
          <p className="text-lg font-bold font-mono text-foreground">${amount}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDownload || (() => alert("Downloading PDF..."))}
        className="w-full py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-primary" />
        <span>Download Receipt (PDF)</span>
      </button>
    </div>
  )
}

// ============================================
// 7. CouponCard — Promotional Voucher
// ============================================

export interface CouponCardProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
  discount: string
  description?: string
  validUntil?: string
}

export function CouponCard({
  code = "NEXORE50",
  discount = "50% OFF",
  description = "Valid across all annual developer packages.",
  validUntil = "Dec 31, 2026",
  className,
  ...props
}: CouponCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 w-full max-w-sm relative overflow-hidden text-card-foreground space-y-3",
        className
      )}
      {...props}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-black text-primary font-mono">{discount}</span>
        {validUntil && <span className="text-[10px] font-mono text-muted-foreground">Exp: {validUntil}</span>}
      </div>

      {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}

      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1 px-3 py-2 rounded-xl bg-background border border-border font-mono text-xs text-center font-bold tracking-widest text-foreground">
          {code}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
    </div>
  )
}

// ============================================
// 8. PricingSlider — Interactive Tiers Slider
// ============================================

export interface PricingSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers?: { name: string; price: string | number; features: string[] }[]
}

export function PricingSlider({
  tiers = [
    { name: "Starter", price: "19", features: ["Up to 5 Projects", "Community Support", "Basic Analytics"] },
    { name: "Professional", price: "49", features: ["Unlimited Projects", "Priority Support", "Advanced Analytics", "Custom Domain"] },
    { name: "Enterprise", price: "99", features: ["Unlimited Everything", "24/7 Phone Support", "Custom SLAs", "Dedicated Engineer"] },
  ],
  className,
  ...props
}: PricingSliderProps) {
  const [selected, setSelected] = React.useState(1)
  const current = tiers[selected] || tiers[0]

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-6 w-full max-w-md shadow-xl text-card-foreground space-y-5",
        className
      )}
      {...props}
    >
      <div className="text-center space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">{current.name} Plan</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-extrabold font-mono text-foreground">${current.price}</span>
          <span className="text-xs text-muted-foreground font-mono">/month</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={tiers.length - 1}
        value={selected}
        onChange={(e) => setSelected(Number(e.target.value))}
        className="w-full accent-primary cursor-pointer"
      />

      <div className="space-y-2 pt-2 border-t border-border/60">
        <p className="text-[11px] font-bold text-muted-foreground uppercase">Key Features:</p>
        <ul className="space-y-1.5 text-xs">
          {current.features.map((f, idx) => (
            <li key={idx} className="flex items-center gap-2 text-foreground/90">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ============================================
// 9. ReviewStars & TrustBadge
// ============================================

export function ReviewStars({ rating = 4.8, size = 18, reviewCount }: { rating?: number; size?: number; reviewCount?: number }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} style={{ width: size, height: size }} className={cn(s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted/40")} />
        ))}
      </div>
      <span className="text-xs font-bold text-foreground">{rating}</span>
      {reviewCount && <span className="text-xs text-muted-foreground">({reviewCount})</span>}
    </div>
  )
}

export function TrustBadge({
  icon,
  title = "Guaranteed Checkout",
  subtitle = "256-Bit SSL Protection",
  className,
}: {
  icon?: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn("inline-flex items-center gap-3 p-3 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs", className)}>
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon || <ShieldCheck className="w-5 h-5" />}
      </div>
      <div>
        <h5 className="text-xs font-bold text-foreground leading-tight">{title}</h5>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
