"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import {
  ShoppingBag,
  Heart,
  Star,
  Check,
  ShieldCheck,
  Lock,
  Download,
  Copy,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag
} from "lucide-react"
import { cn } from "../utils/cn"

export interface ProductCardProProps extends HTMLMotionProps<"div"> {
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
  badge = "Featured",
  rating = 4.9,
  reviewCount = 248,
  imageSrc,
  image,
  colors = ["#18181b", "#71717a", "#a1a1aa"],
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-3xl border border-border/80 bg-card text-card-foreground p-4 w-full max-w-sm shadow-sm overflow-hidden relative group",
        className
      )}
      {...props}
    >
      <div className="relative aspect-[4/3] rounded-2xl bg-muted/40 border border-border/50 overflow-hidden flex items-center justify-center">
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold tracking-wide shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              <span>{badge}</span>
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 hover:bg-background border border-border flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isWishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-foreground"
            )}
          />
        </button>

        {effectiveImage ? (
          <img
            src={effectiveImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 select-none group-hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <ShoppingBag className="w-9 h-9" />
            </div>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              STUDIO EDITION
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
            </div>
            <span className="text-xs font-bold text-foreground">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>

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

        <h3 className="font-semibold text-base text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground tracking-tight tabular-nums">
            ${price}
          </span>
          {originalPrice && (
            <span className="text-sm font-medium text-muted-foreground line-through tabular-nums">
              ${originalPrice}
            </span>
          )}
          {originalPrice && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-success/15 text-success border border-success/20 ml-auto tabular-nums">
              Save ${(Number(originalPrice) - Number(price)).toFixed(0)}
            </span>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className={cn(
            "w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs",
            isAdded
              ? "bg-success text-success-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart</span>
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
        "rounded-3xl border border-border/80 bg-card p-6 w-full max-w-md shadow-sm space-y-5 text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <h3 className="font-semibold text-base text-foreground tracking-tight">Order Summary</h3>
        <span className="text-xs font-mono text-muted-foreground">3 Items</span>
      </div>

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
            placeholder="Discount code"
            className="w-full pl-8.5 pr-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
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

      <div className="space-y-2.5 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-mono font-medium text-foreground tabular-nums">${subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span className="font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
            {shipping}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Estimated Taxes</span>
          <span className="font-mono font-medium text-foreground tabular-nums">${tax}</span>
        </div>

        {applied && (
          <div className="flex justify-between items-center text-success font-medium">
            <span>Discount</span>
            <span className="font-mono tabular-nums">-$29.99</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border flex items-baseline justify-between">
        <div>
          <span className="font-semibold text-sm text-foreground">Total</span>
          <p className="text-[10px] text-muted-foreground">All applicable taxes included</p>
        </div>
        <span className="text-2xl font-bold text-foreground tracking-tight font-mono tabular-nums">
          ${total}
        </span>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onCheckout}
        className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <Lock className="w-3.5 h-3.5" />
        <span>Complete Checkout</span>
      </motion.button>

      <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-muted-foreground select-none">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>SSL Verified</span>
        </div>
        <span>•</span>
        <span>Satisfaction Guarantee</span>
      </div>
    </div>
  )
}

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
  plan = "Developer",
  price = "49",
  billingPeriod = "month",
  nextBilling = "Oct 01, 2026",
  status = "active",
  features = [
    "Unlimited Team Workspaces",
    "Real-time Telemetry Analytics",
    "Priority Technical Support",
    "Dedicated Edge Endpoints",
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
        "rounded-3xl border border-border bg-card p-6 w-full max-w-sm shadow-sm relative overflow-hidden text-card-foreground space-y-6",
        isPopular && "border-primary",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {plan}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-foreground tracking-tight font-mono tabular-nums">
              ${price}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/{billingPeriod}</span>
          </div>
        </div>

        {isPopular && (
          <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold uppercase tracking-wider">
            Standard
          </span>
        )}
      </div>

      <div className="space-y-2.5 pt-2 border-t border-border/60">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Included features:
        </p>
        <ul className="space-y-2 text-xs">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-foreground/90">
              <div className="w-4 h-4 rounded-full bg-success/15 border border-success/30 text-success flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onUpgrade}
        className="w-full py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <span>Upgrade to {plan}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  )
}

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
        "relative w-full max-w-sm aspect-[1.6/1] rounded-2xl bg-zinc-950 border border-white/10 p-6 text-white shadow-xl overflow-hidden select-none flex flex-col justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 rounded-md bg-amber-400 border border-amber-200/50 shadow-xs relative overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-amber-900/30" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-amber-900/30" />
          </div>

          <svg className="w-5 h-5 text-white/70 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.393 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>

        <span className="font-mono text-xs font-semibold tracking-widest uppercase opacity-80">
          OBSIDIAN BLACK
        </span>
      </div>

      <div className="z-10 tracking-[0.2em] font-mono text-base text-white/95 font-medium tabular-nums">
        {number}
      </div>

      <div className="flex items-end justify-between z-10 font-mono text-xs">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-white/50">CARDHOLDER</p>
          <p className="font-semibold tracking-wider text-white/90 truncate max-w-[170px]">{holder}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wider text-white/50">EXPIRES</p>
          <p className="font-semibold tracking-wider text-white/90 tabular-nums">{expiry}</p>
        </div>
      </div>
    </div>
  )
}

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
        "flex items-center gap-4 py-3.5 px-4 rounded-2xl border border-border bg-card shadow-xs text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-primary shrink-0">
        <ShoppingBag className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate text-foreground">{name}</h4>
        <p className="text-xs font-mono font-semibold text-primary mt-0.5 tabular-nums">${price}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0 bg-muted/50 p-1 rounded-xl border border-border/60">
        <button
          type="button"
          onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
          className="w-6 h-6 rounded-lg bg-card hover:bg-muted flex items-center justify-center text-xs transition-colors cursor-pointer border border-border/40"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-xs font-mono font-medium tabular-nums">{quantity}</span>
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
  client = "Apex Technologies Corp",
  onDownload,
  className,
  ...props
}: InvoiceCardProps) {
  const statusStyles = {
    paid: "bg-success/15 text-success border-success/30",
    pending: "bg-warning/15 text-warning border-warning/30",
    overdue: "bg-destructive/15 text-destructive border-destructive/30",
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-all duration-200 w-full max-w-sm text-card-foreground space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-xs font-semibold text-foreground">{invoiceNumber}</span>
          <p className="text-[11px] text-muted-foreground">{date}</p>
        </div>
        <span
          className={cn(
            "text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider border",
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
          <p className="text-lg font-bold font-mono text-foreground tabular-nums">${amount}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDownload}
        className="w-full py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-primary" />
        <span>Download Receipt (PDF)</span>
      </button>
    </div>
  )
}

export interface CouponCardProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
  discount: string
  description?: string
  validUntil?: string
}

export function CouponCard({
  code = "SAVE50",
  discount = "50% OFF",
  description = "Valid across standard subscription tiers.",
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
        "rounded-2xl border border-dashed border-primary/40 bg-card p-5 w-full max-w-sm relative overflow-hidden text-card-foreground space-y-3",
        className
      )}
      {...props}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-primary font-mono">{discount}</span>
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
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  )
}

export interface PricingSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers?: { name: string; price: string | number; features: string[] }[]
}

export function PricingSlider({
  tiers = [
    { name: "Starter", price: "19", features: ["Up to 5 Projects", "Standard Support", "Basic Analytics"] },
    { name: "Professional", price: "49", features: ["Unlimited Projects", "Priority Support", "Advanced Analytics", "Custom Domain"] },
    { name: "Enterprise", price: "99", features: ["Unlimited Everything", "Dedicated Channel", "Custom SLAs", "Dedicated Engineer"] },
  ],
  className,
  ...props
}: PricingSliderProps) {
  const [selected, setSelected] = React.useState(1)
  const current = tiers[selected] || tiers[0]

  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card p-6 w-full max-w-md shadow-sm text-card-foreground space-y-5",
        className
      )}
      {...props}
    >
      <div className="text-center space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{current.name} Tier</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold font-mono text-foreground tabular-nums">${current.price}</span>
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
        <p className="text-[11px] font-semibold text-muted-foreground uppercase">Included:</p>
        <ul className="space-y-1.5 text-xs">
          {current.features.map((f, idx) => (
            <li key={idx} className="flex items-center gap-2 text-foreground/90">
              <Check className="w-3.5 h-3.5 text-success shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ReviewStars({ rating = 4.8, size = 18, reviewCount }: { rating?: number; size?: number; reviewCount?: number }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} style={{ width: size, height: size }} className={cn(s <= Math.round(rating) ? "fill-amber-500 text-amber-500" : "text-muted/40")} />
        ))}
      </div>
      <span className="text-xs font-semibold text-foreground tabular-nums">{rating}</span>
      {reviewCount && <span className="text-xs text-muted-foreground tabular-nums">({reviewCount})</span>}
    </div>
  )
}

export function TrustBadge({
  icon,
  title = "Verified Security",
  subtitle = "Cryptographic Verification",
  className,
}: {
  icon?: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn("inline-flex items-center gap-3 p-3 rounded-2xl border border-border bg-card shadow-xs", className)}>
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon || <ShieldCheck className="w-5 h-5" />}
      </div>
      <div>
        <h5 className="text-xs font-semibold text-foreground leading-tight">{title}</h5>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
