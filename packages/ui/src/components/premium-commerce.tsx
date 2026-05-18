"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. ProductCard Pro — Enhanced product card
// ============================================
export function ProductCardPro({ name, price, originalPrice, badge, rating = 0, reviewCount = 0, className }: {
  name: string
  price: string
  originalPrice?: string
  badge?: string
  rating?: number
  reviewCount?: number
  className?: string
}) {
  const [wishlisted, setWishlisted] = React.useState(false)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn("rounded-2xl border border-border bg-card overflow-hidden group", className)}
    >
      <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        {badge && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">{badge}</span>
        )}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border"
        >
          <svg className={cn("w-4 h-4 transition-colors", wishlisted ? "text-red-500 fill-red-500" : "text-muted-foreground")} fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </motion.button>
        <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">🛍</div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-sm mb-1 truncate">{name}</h4>
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={cn("w-3.5 h-3.5", i < rating ? "text-amber-400" : "text-muted")} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{price}</span>
          {originalPrice && <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full mt-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  )
}

// ============================================
// 2. CartItem — Shopping cart item
// ============================================
export function CartItem({ name, price, quantity = 1, onQuantityChange, onRemove, className }: {
  name: string
  price: string
  quantity?: number
  onQuantityChange?: (qty: number) => void
  onRemove?: () => void
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-4 py-4 border-b border-border", className)}>
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-2xl shrink-0">
        📦
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{name}</h4>
        <p className="text-sm font-bold mt-1">{price}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))} className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-sm hover:bg-accent transition-colors">−</button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button onClick={() => onQuantityChange?.(quantity + 1)} className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-sm hover:bg-accent transition-colors">+</button>
      </div>
      {onRemove && (
        <button onClick={onRemove} className="text-muted-foreground hover:text-red-500 transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      )}
    </div>
  )
}

// ============================================
// 3. CheckoutSummary — Order total summary
// ============================================
export function CheckoutSummary({ subtotal, shipping = "Free", tax, total, className }: {
  subtotal: string
  shipping?: string
  tax?: string
  total: string
  className?: string
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <h4 className="font-semibold mb-4">Order Summary</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === "Free" ? "text-emerald-500 font-medium" : ""}>{shipping}</span>
        </div>
        {tax && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>{tax}</span>
          </div>
        )}
        <div className="flex justify-between pt-3 border-t border-border font-bold text-base">
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
      >
        Proceed to Checkout
      </motion.button>
    </div>
  )
}

// ============================================
// 4. PricingSlider — Dynamic pricing slider
// ============================================
export function PricingSlider({ tiers, className }: {
  tiers: { name: string; price: string; features: string[] }[]
  className?: string
}) {
  const [selected, setSelected] = React.useState(0)
  const tier = tiers[selected]

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-1">Select your plan</p>
        <p className="text-4xl font-bold">{tier?.price}<span className="text-lg text-muted-foreground">/mo</span></p>
        <p className="text-sm font-medium text-primary mt-1">{tier?.name}</p>
      </div>
      <input
        type="range"
        min={0}
        max={tiers.length - 1}
        value={selected}
        onChange={(e) => setSelected(Number(e.target.value))}
        className="w-full mb-6 accent-primary"
      />
      <AnimatePresence mode="wait">
        <motion.ul
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2"
        >
          {tier?.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  )
}

// ============================================
// 5. InvoiceCard — Invoice summary card
// ============================================
export function InvoiceCard({ invoiceNumber, date, status, amount, client, className }: {
  invoiceNumber: string
  date: string
  status: "paid" | "pending" | "overdue"
  amount: string
  client: string
  className?: string
}) {
  const statusStyles = {
    paid: "bg-emerald-500/10 text-emerald-500",
    pending: "bg-amber-500/10 text-amber-500",
    overdue: "bg-red-500/10 text-red-500",
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow", className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-sm font-semibold">{invoiceNumber}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full capitalize", statusStyles[status])}>{status}</span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-sm text-muted-foreground">{client}</span>
        <span className="font-bold text-lg">{amount}</span>
      </div>
    </div>
  )
}

// ============================================
// 6. CreditCard — Visual credit card
// ============================================
export function CreditCardVisual({ holder = "YOUR NAME", number = "•••• •••• •••• 4242", expiry = "12/28", type = "visa", className }: {
  holder?: string
  number?: string
  expiry?: string
  type?: "visa" | "mastercard" | "amex"
  className?: string
}) {
  const gradients = {
    visa: "from-blue-600 to-blue-800",
    mastercard: "from-slate-700 to-slate-900",
    amex: "from-emerald-600 to-teal-800",
  }

  return (
    <div className={cn(`relative w-full max-w-sm aspect-[1.6/1] rounded-2xl bg-gradient-to-br ${gradients[type]} p-6 text-white shadow-xl overflow-hidden`, className)}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-300 to-amber-500" />
          <span className="text-sm font-bold uppercase opacity-80">{type}</span>
        </div>
        <p className="text-lg font-mono tracking-widest">{number}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase opacity-60">Card Holder</p>
            <p className="text-sm font-medium uppercase tracking-wider">{holder}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-60">Expires</p>
            <p className="text-sm font-mono">{expiry}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 7. CouponCard — Promo/coupon card
// ============================================
export function CouponCard({ code, discount, description, validUntil, className }: {
  code: string
  discount: string
  description?: string
  validUntil?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  return (
    <div className={cn("rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10">
        <p className="text-3xl font-bold text-primary mb-1">{discount}</p>
        {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-lg bg-background border border-border font-mono text-sm text-center tracking-widest font-bold">
            {code}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shrink-0"
          >
            {copied ? "Copied!" : "Copy"}
          </motion.button>
        </div>
        {validUntil && <p className="text-xs text-muted-foreground mt-2">Valid until {validUntil}</p>}
      </div>
    </div>
  )
}

// ============================================
// 8. SubscriptionCard — Subscription status
// ============================================
export function SubscriptionCard({ plan, price, nextBilling, status = "active", features, className }: {
  plan: string
  price: string
  nextBilling?: string
  status?: "active" | "cancelled" | "past_due"
  features?: string[]
  className?: string
}) {
  const statusStyles = {
    active: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "Active" },
    cancelled: { bg: "bg-muted", text: "text-muted-foreground", label: "Cancelled" },
    past_due: { bg: "bg-red-500/10", text: "text-red-500", label: "Past Due" },
  }
  const s = statusStyles[status]

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-bold text-lg">{plan}</h4>
          <p className="text-2xl font-bold mt-1">{price}<span className="text-sm text-muted-foreground font-normal">/month</span></p>
        </div>
        <span className={cn("text-xs font-medium px-3 py-1 rounded-full", s.bg, s.text)}>{s.label}</span>
      </div>
      {features && (
        <ul className="space-y-2 mb-4">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {f}
            </li>
          ))}
        </ul>
      )}
      {nextBilling && (
        <p className="text-xs text-muted-foreground pt-4 border-t border-border">Next billing: {nextBilling}</p>
      )}
    </div>
  )
}

// ============================================
// 9. ReviewStars — Star rating selector
// ============================================
export function ReviewStars({ rating = 0, onChange, size = 24, readonly = false, className }: {
  rating?: number
  onChange?: (rating: number) => void
  size?: number
  readonly?: boolean
  className?: string
}) {
  const [hovered, setHovered] = React.useState(0)

  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileTap={readonly ? {} : { scale: 0.8 }}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={cn("transition-colors", readonly ? "cursor-default" : "cursor-pointer")}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={(hovered || rating) >= star ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className={cn(
              "transition-colors",
              (hovered || rating) >= star ? "text-amber-400" : "text-muted-foreground/30"
            )}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.button>
      ))}
    </div>
  )
}

// ============================================
// 10. TrustBadge — Trust/security badge
// ============================================
export function TrustBadge({ icon, title, subtitle, className }: {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3", className)}>
      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
        {icon || (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        )}
      </div>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  )
}
