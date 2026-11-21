"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "./button";

export interface ProductCardProProps extends Omit<HTMLMotionProps<"div">, "children"> {
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  imageSrc?: string;
  image?: string;
  colors?: string[];
  sizes?: string[];
  onAddToCart?: () => void;
}

export function ProductCardPro({
  name,
  price,
  originalPrice,
  badge,
  rating = 4.9,
  reviewCount,
  imageSrc,
  image,
  colors = ["#18181b", "#52525b", "#a1a1aa"],
  sizes,
  onAddToCart,
  className,
  ...props
}: ProductCardProProps) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedColor, setSelectedColor] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState(0);
  const [wishlisted, setWishlisted] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const effectiveImage = imageSrc ?? image;
  const discountPct =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const handleAdd = () => {
    setAdded(true);
    onAddToCart?.();
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
      className={cn(
        "group relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs",
        className
      )}
      {...props}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-muted/40">
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-md border border-border bg-background/90 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">
            {badge}
          </span>
        )}
        {discountPct !== null && (
          <span className="absolute left-3 bottom-3 z-10 rounded-md bg-foreground px-2 py-0.5 font-mono text-[10px] font-semibold text-background tabular-nums">
            -{discountPct}%
          </span>
        )}
        <button
          type="button"
          onClick={() => setWishlisted((prev) => !prev)}
          aria-label={wishlisted ? `Remove ${name} from saved items` : `Save ${name}`}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              wishlisted && "fill-destructive text-destructive"
            )}
          />
        </button>

        {effectiveImage ? (
          <img src={effectiveImage} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6">
            <svg
              viewBox="0 0 240 160"
              className="h-full w-full max-w-[200px] text-foreground/80"
              aria-hidden="true"
            >
              <rect
                x="18"
                y="18"
                width="204"
                height="124"
                rx="10"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.14"
                strokeWidth="1"
              />
              <circle
                cx="120"
                cy="74"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="120"
                cy="74"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <path
                d="M120 40 V54 M120 94 V108 M86 74 H100 M140 74 H154"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle
                cx="120"
                cy="74"
                r="5"
                fill={colors[selectedColor] ?? "currentColor"}
              />
              <text
                x="120"
                y="128"
                textAnchor="middle"
                className="fill-muted-foreground font-mono text-[9px] uppercase tracking-widest"
              >
                {name.slice(0, 20)}
              </text>
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-foreground">{name}</h3>
          <div className="flex items-center gap-1 shrink-0 font-mono text-xs tabular-nums">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
            {reviewCount !== undefined && (
              <span className="text-muted-foreground">({reviewCount})</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {colors.length > 0 && (
            <div className="flex items-center gap-1.5" role="group" aria-label="Color options">
              {colors.map((color, idx) => (
                <button
                  key={`${color}-${idx}`}
                  type="button"
                  onClick={() => setSelectedColor(idx)}
                  aria-label={`Select finish ${idx + 1}`}
                  aria-pressed={selectedColor === idx}
                  className={cn(
                    "h-5 w-5 rounded-full border p-0.5 transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedColor === idx
                      ? "border-foreground scale-110"
                      : "border-border opacity-75 hover:opacity-100"
                  )}
                >
                  <span
                    className="block h-full w-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </button>
              ))}
            </div>
          )}

          {sizes && sizes.length > 0 && (
            <div className="flex items-center gap-1" role="group" aria-label="Size options">
              {sizes.map((size, idx) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(idx)}
                  aria-pressed={selectedSize === idx}
                  className={cn(
                    "h-6 min-w-6 rounded border px-1.5 font-mono text-[10px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedSize === idx
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-lg font-semibold text-foreground">
              ${price.toFixed(2)}
            </span>
            {originalPrice !== undefined && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button type="button" size="sm" onClick={handleAdd} className="gap-1.5">
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Add to cart</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export interface CheckoutSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  subtotal: number;
  shipping?: number;
  tax?: number;
  total?: number;
  itemCount?: number;
  promoDiscountPercent?: number;
  onCheckout?: () => void;
}

const PROMO_RATES: Record<string, number> = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  NEXORE15: 0.15,
};

export function CheckoutSummary({
  subtotal,
  shipping = 0,
  tax = 0,
  total,
  itemCount,
  promoDiscountPercent,
  onCheckout,
  className,
  ...props
}: CheckoutSummaryProps) {
  const [promoCode, setPromoCode] = React.useState("");
  const [appliedCode, setAppliedCode] = React.useState<string | null>(null);
  const [promoError, setPromoError] = React.useState<string | null>(null);

  const activeRate = appliedCode
    ? PROMO_RATES[appliedCode] ?? (promoDiscountPercent ? promoDiscountPercent / 100 : 0.1)
    : 0;
  const discountAmount = subtotal * activeRate;
  const calculatedTotal = Math.max(0, subtotal + shipping + tax - discountAmount);
  const displayedTotal =
    appliedCode || total === undefined
      ? calculatedTotal
      : Math.max(0, total - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = promoCode.trim().toUpperCase();
    if (!trimmed) return;
    if (trimmed in PROMO_RATES || promoDiscountPercent) {
      setAppliedCode(trimmed);
      setPromoError(null);
      return;
    }
    setPromoError("Try SAVE10 or SAVE20");
  };

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
        <h3 className="text-base font-semibold text-foreground">Order Summary</h3>
        {itemCount !== undefined && (
          <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2.5 text-sm tabular-nums">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-foreground">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
        </div>
        {appliedCode && (
          <div className="flex items-center justify-between text-success">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <Tag className="h-3.5 w-3.5" />
              Promo ({appliedCode})
            </span>
            <span className="font-mono font-semibold">-${discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleApplyPromo} className="mt-4 border-t border-border pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            aria-label="Promo code"
            placeholder="Promo code (SAVE10)"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value);
              if (promoError) setPromoError(null);
            }}
            className="h-9 flex-1 min-w-0 rounded-lg border border-border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" variant="outline" size="sm" className="h-9 shrink-0">
            Apply
          </Button>
        </div>
        {promoError && (
          <p className="mt-1.5 font-mono text-[11px] text-destructive">{promoError}</p>
        )}
      </form>

      <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4 tabular-nums">
        <span className="text-sm font-medium text-muted-foreground">Total due</span>
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          ${displayedTotal.toFixed(2)}
        </span>
      </div>

      <Button type="button" onClick={onCheckout} className="mt-4 w-full">
        Complete Purchase
      </Button>
    </div>
  );
}

export interface SubscriptionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  plan: string;
  price: number;
  billingPeriod?: string;
  nextBilling?: string;
  status?: "active" | "past_due" | "cancelled";
  features?: string[];
  isPopular?: boolean;
  onUpgrade?: () => void;
}

const SUBSCRIPTION_STATUS_STYLES: Record<
  NonNullable<SubscriptionCardProps["status"]>,
  { label: string; className: string }
> = {
  active: { label: "Active", className: "bg-success/15 text-success" },
  past_due: { label: "Past due", className: "bg-warning/15 text-warning" },
  cancelled: { label: "Cancelled", className: "bg-destructive/15 text-destructive" },
};

export function SubscriptionCard({
  plan,
  price,
  billingPeriod = "month",
  nextBilling,
  status,
  features = [],
  isPopular = false,
  onUpgrade,
  className,
  ...props
}: SubscriptionCardProps) {
  const statusInfo = status ? SUBSCRIPTION_STATUS_STYLES[status] : null;

  return (
    <div
      className={cn(
        "flex w-full max-w-sm flex-col rounded-2xl border bg-card p-6 text-card-foreground shadow-xs",
        isPopular ? "border-foreground" : "border-border",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">{plan}</h3>
          {nextBilling && (
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              Renews {nextBilling}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {statusInfo && (
            <span
              className={cn(
                "rounded-md px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
                statusInfo.className
              )}
            >
              {statusInfo.label}
            </span>
          )}
          {isPopular && (
            <span className="rounded-md bg-foreground px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-background">
              Recommended
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-1.5 border-b border-border pb-5 tabular-nums">
        <span className="text-3xl font-semibold tracking-tight text-foreground">
          ${price}
        </span>
        <span className="text-xs text-muted-foreground">/ {billingPeriod}</span>
      </div>

      {features.length > 0 && (
        <ul className="my-5 flex-1 space-y-2.5 text-xs sm:text-sm text-foreground">
          {features.map((feat, idx) => (
            <li key={`${feat}-${idx}`} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        variant={isPopular ? "default" : "outline"}
        onClick={onUpgrade}
        className="w-full"
      >
        {isPopular ? "Upgrade Plan" : "Manage Plan"}
      </Button>
    </div>
  );
}

export interface CreditCardVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  holder?: string;
  number?: string;
  expiry?: string;
  type?: "visa" | "mastercard" | "amex";
}

export function CreditCardVisual({
  holder = "M. KATO",
  number = "4532 •••• •••• 8910",
  expiry = "08/29",
  type = "visa",
  className,
  ...props
}: CreditCardVisualProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-[1.586/1] w-full max-w-[340px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-foreground p-6 text-background shadow-sm select-none",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 20%, currentColor 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div
          aria-hidden="true"
          className="h-7 w-10 rounded-md border border-background/25 bg-background/10 grid grid-cols-2 gap-px p-1"
        >
          <span className="rounded-[1px] border border-background/25" />
          <span className="rounded-[1px] border border-background/25" />
        </div>
        <span className="font-mono text-xs font-semibold uppercase tracking-widest">
          {type}
        </span>
      </div>

      <p className="relative z-10 font-mono text-base sm:text-lg tracking-[0.14em] tabular-nums">
        {number}
      </p>

      <div className="relative z-10 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <span className="block font-mono text-[9px] uppercase tracking-wider opacity-65">
            Cardholder
          </span>
          <span className="mt-0.5 block truncate font-mono text-xs font-medium uppercase tracking-wider">
            {holder}
          </span>
        </div>
        <div className="shrink-0 text-right tabular-nums">
          <span className="block font-mono text-[9px] uppercase tracking-wider opacity-65">
            Expires
          </span>
          <span className="mt-0.5 block font-mono text-xs font-medium">{expiry}</span>
        </div>
      </div>
    </div>
  );
}

export interface CartItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  imageSrc?: string;
  image?: string;
  onQuantityChange?: (q: number) => void;
  onRemove?: () => void;
}

export function CartItem({
  name,
  price,
  quantity,
  variant,
  imageSrc,
  image,
  onQuantityChange,
  onRemove,
  className,
  ...props
}: CartItemProps) {
  const effectiveImage = imageSrc ?? image;
  const lineTotal = price * quantity;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 text-card-foreground shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-3 min-w-[160px]">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40">
          {effectiveImage ? (
            <img src={effectiveImage} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              {name.slice(0, 2)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-medium text-foreground">{name}</h4>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground tabular-nums">
            ${price.toFixed(2)} each{variant ? ` · ${variant}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 shrink-0 ml-auto">
        <div className="flex items-center rounded-lg border border-border bg-background">
          <button
            type="button"
            aria-label={`Decrease quantity for ${name}`}
            onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-l-lg"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-7 text-center font-mono text-xs font-medium text-foreground tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            aria-label={`Increase quantity for ${name}`}
            onClick={() => onQuantityChange?.(quantity + 1)}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-r-lg"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <span className="hidden sm:inline-block w-16 text-right font-mono text-sm font-semibold text-foreground tabular-nums">
          ${lineTotal.toFixed(2)}
        </span>

        {onRemove && (
          <button
            type="button"
            aria-label={`Remove ${name}`}
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export interface InvoiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  invoiceNumber: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  onDownload?: () => void;
}

const INVOICE_STATUS_STYLES: Record<InvoiceCardProps["status"], string> = {
  paid: "bg-success/15 text-success",
  pending: "bg-warning/15 text-warning",
  overdue: "bg-destructive/15 text-destructive",
};

export function InvoiceCard({
  invoiceNumber,
  date,
  amount,
  status,
  onDownload,
  className,
  ...props
}: InvoiceCardProps) {
  const [downloaded, setDownloaded] = React.useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    onDownload?.();
    window.setTimeout(() => setDownloaded(false), 1600);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-xs",
        className
      )}
      {...props}
    >
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
            {invoiceNumber}
          </span>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
              INVOICE_STATUS_STYLES[status]
            )}
          >
            {status}
          </span>
        </div>
        <p className="font-mono text-xs text-muted-foreground tabular-nums">{date}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
          ${amount.toFixed(2)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownload}
          aria-label={`Download invoice ${invoiceNumber}`}
          className="h-8 gap-1.5 px-2.5 text-xs"
        >
          {downloaded ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export interface CouponCardProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  discount: string;
  expiry?: string;
  onCopy?: () => void;
}

export function CouponCard({
  code,
  discount,
  expiry,
  onCopy,
  className,
  ...props
}: CouponCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopied(true);
    onCopy?.();
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-dashed border-border bg-card p-4 text-card-foreground shadow-xs",
        className
      )}
      {...props}
    >
      <div className="min-w-0 space-y-1">
        <span className="block text-base font-semibold tracking-tight text-foreground">
          {discount}
        </span>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <code className="rounded border border-border bg-muted px-1.5 py-0.5 text-foreground font-semibold">
            {code}
          </code>
          {expiry && <span>{expiry}</span>}
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        aria-label={`Copy promo code ${code}`}
        className="shrink-0 gap-1.5"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-success" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </Button>
    </div>
  );
}

export interface PricingSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  min?: number;
  max?: number;
  step?: number;
  pricePerUnit?: number;
  onTierChange?: (seats: number, cost: number) => void;
}

export function PricingSlider({
  min = 10,
  max = 500,
  step = 10,
  pricePerUnit = 4,
  onTierChange,
  className,
  ...props
}: PricingSliderProps) {
  const [seats, setSeats] = React.useState(Math.min(max, Math.max(min, 100)));
  const totalCost = seats * pricePerUnit;

  const updateSeats = (nextValue: number) => {
    const clamped = Math.min(max, Math.max(min, nextValue));
    setSeats(clamped);
    onTierChange?.(clamped, clamped * pricePerUnit);
  };

  const presets = [min, Math.round(max * 0.2), Math.round(max * 0.5), max];

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Team Volume
          </span>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {seats} seats
          </p>
        </div>
        <div className="text-right tabular-nums">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Monthly Estimate
          </span>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            ${totalCost.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <input
          type="range"
          aria-label="Seat volume"
          min={min}
          max={max}
          step={step}
          value={seats}
          onChange={(e) => updateSeats(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-foreground"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => updateSeats(preset)}
              className={cn(
                "rounded-md border px-2 py-1 font-mono text-[11px] tabular-nums transition-colors cursor-pointer",
                seats === preset
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 border-t border-border pt-3 font-mono text-[11px] text-muted-foreground tabular-nums">
        Billed at ${pricePerUnit.toFixed(2)} per active workspace seat.
      </p>
    </div>
  );
}

export function ReviewStars({
  rating = 4.8,
  size = 16,
  reviewCount,
}: {
  rating?: number;
  size?: number;
  reviewCount?: number;
}) {
  const fullStars = Math.floor(Math.max(0, Math.min(5, rating)));

  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={cn(
              i < fullStars
                ? "fill-warning text-warning"
                : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          ({reviewCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
}

export function TrustBadge({
  label,
  icon,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs",
        className
      )}
    >
      <span className="text-muted-foreground shrink-0">
        {icon ?? <ShieldCheck className="h-3.5 w-3.5" />}
      </span>
      <span>{label}</span>
    </span>
  );
}
