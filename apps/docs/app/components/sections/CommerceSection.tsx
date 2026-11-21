"use client";

import React, { useState } from "react";
import { Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import {
  CartItem,
  CheckoutSummary,
  CouponCard,
  CreditCardVisual,
  InvoiceCard,
  PricingSlider,
  ProductCardPro,
  ReviewStars,
  SubscriptionCard,
  TrustBadge,
} from "nexoreui";
import { A11yHeader } from "../A11yNotice";
import { ComponentCard, ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { WhenToUse } from "../WhenToUse";

const whenToUseItems = [
  {
    label: "ProductCardPro",
    description:
      "Use in catalog grids where finish swatches, size selectors, rating metrics, and quick cart feedback sit inline.",
  },
  {
    label: "CartItem & Checkout",
    description:
      "Pair stateful CartItem rows with CheckoutSummary so quantities, taxes, and promo discounts reconcile immediately.",
  },
  {
    label: "Subscription & Slider",
    description:
      "Use SubscriptionCard for fixed plans with renewal status and PricingSlider for seat-based usage estimation.",
  },
  {
    label: "Invoice & CardVisual",
    description:
      "Use InvoiceCard in billing history tables and CreditCardVisual on payment method settings panels.",
  },
];

const cartAndCheckoutCode = `import { useState } from "react";
import { CartItem, CheckoutSummary } from "nexoreui";

export default function CartCheckoutFlow() {
  const [items, setItems] = useState([
    { id: "keycaps", name: "PBT Keycap Set", variant: "Graphite", price: 89, quantity: 1 },
    { id: "cable", name: "Coiled USB-C Cable", variant: "Braided", price: 34, quantity: 2 },
  ]);

  const updateQty = (id: string, nextQty: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal * 0.08;

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6 w-full max-w-xl 2xl:max-w-none mx-auto items-start">
      <div className="2xl:col-span-7 space-y-3">
        {items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            variant={item.variant}
            price={item.price}
            quantity={item.quantity}
            onQuantityChange={(q) => updateQty(item.id, q)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>
      <div className="2xl:col-span-5 flex justify-center 2xl:justify-end">
        <CheckoutSummary
          subtotal={subtotal}
          shipping={subtotal >= 120 ? 0 : 12}
          tax={tax}
          itemCount={itemCount}
        />
      </div>
    </div>
  );
}`;

const productGridCode = `import { ProductCardPro } from "nexoreui";

export default function ProductCatalogGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
      <ProductCardPro
        name="Machina-65 Mechanical Frame"
        price={240}
        originalPrice={290}
        badge="New batch"
        rating={4.9}
        reviewCount={142}
        colors={["#18181b", "#52525b", "#a1a1aa"]}
        sizes={["65%", "75%", "TKL"]}
      />
      <ProductCardPro
        name="Studio Monitor Arm"
        price={165}
        badge="In stock"
        rating={4.8}
        reviewCount={84}
        colors={["#18181b", "#71717a"]}
        sizes={["Single", "Dual"]}
      />
    </div>
  );
}`;

const pricingSliderCode = `import { PricingSlider } from "nexoreui";

export default function TeamSeatEstimator() {
  return (
    <div className="flex justify-center w-full">
      <PricingSlider min={10} max={500} step={10} pricePerUnit={4} />
    </div>
  );
}`;

const subscriptionGridCode = `import { SubscriptionCard } from "nexoreui";

export default function SubscriptionPlansDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
      <SubscriptionCard
        plan="Starter Workspace"
        price={19}
        status="active"
        nextBilling="May 14"
        features={[
          "Up to 5 team operators",
          "50 GB asset storage",
          "Standard audit retention",
        ]}
      />
      <SubscriptionCard
        plan="Organization Scale"
        price={59}
        isPopular
        features={[
          "Unlimited workspace seats",
          "500 GB global edge storage",
          "SAML SSO & dedicated SLA",
        ]}
      />
    </div>
  );
}`;

const invoiceGridCode = `import { InvoiceCard } from "nexoreui";

export default function BillingInvoicesDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
      <InvoiceCard
        invoiceNumber="INV-2026-041"
        date="Apr 01, 2026"
        amount={240}
        status="paid"
      />
      <InvoiceCard
        invoiceNumber="INV-2026-042"
        date="May 01, 2026"
        amount={59}
        status="pending"
      />
    </div>
  );
}`;

const creditCardCode = `import { CreditCardVisual } from "nexoreui";

export default function PaymentMethodDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 w-full">
      <CreditCardVisual
        holder="M. KATO"
        number="4532 •••• •••• 8910"
        expiry="08/29"
        type="visa"
      />
    </div>
  );
}`;

const couponGridCode = `import { CouponCard } from "nexoreui";

export default function PromoCouponsDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
      <CouponCard
        code="SAVE10"
        discount="10% Off First Order"
        expiry="Valid through Dec 31"
      />
      <CouponCard
        code="SAVE20"
        discount="20% Off Annual Plans"
        expiry="Team tiers eligible"
      />
    </div>
  );
}`;

const assuranceStripCode = `import { ReviewStars, TrustBadge } from "nexoreui";
import { Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";

export default function CheckoutAssuranceDemo() {
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <ReviewStars rating={4.9} reviewCount={318} />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <TrustBadge label="256-bit TLS Checkout" icon={<Lock className="h-3.5 w-3.5" />} />
        <TrustBadge label="30-Day Returns" icon={<RotateCcw className="h-3.5 w-3.5" />} />
        <TrustBadge label="Tracked Dispatch" icon={<Truck className="h-3.5 w-3.5" />} />
        <TrustBadge label="2-Year Warranty" icon={<ShieldCheck className="h-3.5 w-3.5" />} />
      </div>
    </div>
  );
}`;

export function CommerceSection() {
  const [playgroundTab, setPlaygroundTab] = useState<
    "product" | "checkout" | "subscription" | "invoice"
  >("product");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "amex">("visa");

  const [cartItems, setCartItems] = useState([
    {
      id: "keycaps",
      name: "PBT Keycap Set",
      variant: "Graphite",
      price: 89,
      quantity: 1,
    },
    {
      id: "cable",
      name: "Coiled USB-C Cable",
      variant: "Braided",
      price: 34,
      quantity: 2,
    },
  ]);

  const updateCartQty = (id: string, nextQty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item))
    );
  };

  const removeCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetSampleCart = () => {
    setCartItems([
      {
        id: "keycaps",
        name: "PBT Keycap Set",
        variant: "Graphite",
        price: 89,
        quantity: 1,
      },
      {
        id: "cable",
        name: "Coiled USB-C Cable",
        variant: "Braided",
        price: 34,
        quantity: 2,
      },
    ]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal >= 120 || subtotal === 0 ? 0 : 12;
  const tax = subtotal * 0.08;

  const playgroundCodeMap = {
    product: `import { ProductCardPro } from "nexoreui";

export default function ProductPlayground() {
  return (
    <ProductCardPro
      name="Machina-65 Mechanical Frame"
      price={240}
      originalPrice={290}
      badge="New batch"
      rating={4.9}
      reviewCount={142}
      colors={["#18181b", "#52525b", "#a1a1aa"]}
      sizes={["65%", "75%", "TKL"]}
    />
  );
}`,
    checkout: `import { CheckoutSummary } from "nexoreui";

export default function CheckoutPlayground() {
  return (
    <CheckoutSummary
      subtotal={157}
      shipping={0}
      tax={12.56}
      itemCount={3}
    />
  );
}`,
    subscription: `import { SubscriptionCard } from "nexoreui";

export default function SubscriptionPlayground() {
  return (
    <SubscriptionCard
      plan="Organization Scale"
      price={59}
      isPopular
      status="active"
      nextBilling="May 14"
      features={[
        "Unlimited workspace seats",
        "500 GB global edge storage",
        "SAML SSO & dedicated SLA",
      ]}
    />
  );
}`,
    invoice: `import { InvoiceCard } from "nexoreui";

export default function InvoicePlayground() {
  return (
    <InvoiceCard
      invoiceNumber="INV-2026-041"
      date="Apr 01, 2026"
      amount={240}
      status="paid"
    />
  );
}`,
  };

  return (
    <section id="commerce" className="space-y-12 scroll-mt-20">
      <WhenToUse items={whenToUseItems} />

      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Interactive Commerce Playground
          </h2>
          <p className="text-sm text-muted-foreground">
            Inspect each checkout, catalog, and billing primitive individually with synchronized copy-ready JSX.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-background p-1">
              {(
                [
                  { id: "product", label: "Product Card" },
                  { id: "checkout", label: "Checkout Summary" },
                  { id: "subscription", label: "Subscription" },
                  { id: "invoice", label: "Invoice" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={playgroundTab === tab.id}
                  onClick={() => setPlaygroundTab(tab.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    playgroundTab === tab.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              Interactive preview
            </span>
          </div>

          <div
            data-demo-preview
            className="flex min-h-[340px] items-center justify-center bg-background p-5 sm:p-8"
          >
            {playgroundTab === "product" && (
              <ProductCardPro
                name="Machina-65 Mechanical Frame"
                price={240}
                originalPrice={290}
                badge="New batch"
                rating={4.9}
                reviewCount={142}
                colors={["#18181b", "#52525b", "#a1a1aa"]}
                sizes={["65%", "75%", "TKL"]}
              />
            )}
            {playgroundTab === "checkout" && (
              <CheckoutSummary
                subtotal={157}
                shipping={0}
                tax={12.56}
                itemCount={3}
              />
            )}
            {playgroundTab === "subscription" && (
              <SubscriptionCard
                plan="Organization Scale"
                price={59}
                isPopular
                status="active"
                nextBilling="May 14"
                features={[
                  "Unlimited workspace seats",
                  "500 GB global edge storage",
                  "SAML SSO & dedicated SLA",
                ]}
              />
            )}
            {playgroundTab === "invoice" && (
              <InvoiceCard
                invoiceNumber="INV-2026-041"
                date="Apr 01, 2026"
                amount={240}
                status="paid"
                className="w-full max-w-md"
              />
            )}
          </div>
        </div>

        <ComponentSource
          sourceCode={playgroundCodeMap[playgroundTab]}
          fileName={`commerce-${playgroundTab}.tsx`}
        />
      </div>

      <div className="space-y-10">
        <ComponentCard
          title="Stateful Cart & Checkout Flow"
          description="CartItem quantities drive CheckoutSummary totals dynamically; test promo code SAVE10 or SAVE20 inside the form."
          code={cartAndCheckoutCode}
        >
          <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6 w-full max-w-xl 2xl:max-w-none mx-auto items-start">
            <div className="2xl:col-span-7 space-y-3">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    name={item.name}
                    variant={item.variant}
                    price={item.price}
                    quantity={item.quantity}
                    onQuantityChange={(q) => updateCartQty(item.id, q)}
                    onRemove={() => removeCartItem(item.id)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
                  <p className="text-sm text-muted-foreground">Cart is empty.</p>
                  <button
                    type="button"
                    onClick={resetSampleCart}
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
                  >
                    Restore sample items
                  </button>
                </div>
              )}
            </div>
            <div className="2xl:col-span-5 flex justify-center 2xl:justify-end">
              <CheckoutSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                itemCount={itemCount}
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Product Catalog Cards"
          description="Token-based ProductCardPro with color swatches, size selectors, wishlist toggle, and discount badges."
          code={productGridCode}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <ProductCardPro
              name="Machina-65 Mechanical Frame"
              price={240}
              originalPrice={290}
              badge="New batch"
              rating={4.9}
              reviewCount={142}
              colors={["#18181b", "#52525b", "#a1a1aa"]}
              sizes={["65%", "75%", "TKL"]}
            />
            <ProductCardPro
              name="Studio Monitor Arm"
              price={165}
              badge="In stock"
              rating={4.8}
              reviewCount={84}
              colors={["#18181b", "#71717a"]}
              sizes={["Single", "Dual"]}
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Usage & Seat Pricing Estimator"
          description="PricingSlider combines quick preset increments with a continuous range slider and live monthly estimate."
          code={pricingSliderCode}
        >
          <div className="flex justify-center w-full">
            <PricingSlider min={10} max={500} step={10} pricePerUnit={4} />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Subscription Tiers"
          description="Compare fixed subscription cards showing status badges, renewal dates, and aligned feature lists."
          code={subscriptionGridCode}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <SubscriptionCard
              plan="Starter Workspace"
              price={19}
              status="active"
              nextBilling="May 14"
              features={[
                "Up to 5 team operators",
                "50 GB asset storage",
                "Standard audit retention",
              ]}
            />
            <SubscriptionCard
              plan="Organization Scale"
              price={59}
              isPopular
              features={[
                "Unlimited workspace seats",
                "500 GB global edge storage",
                "SAML SSO & dedicated SLA",
              ]}
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Billing Invoices"
          description="Compact InvoiceCard rows with semantic payment state pills and PDF download feedback."
          code={invoiceGridCode}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            <InvoiceCard
              invoiceNumber="INV-2026-041"
              date="Apr 01, 2026"
              amount={240}
              status="paid"
            />
            <InvoiceCard
              invoiceNumber="INV-2026-042"
              date="May 01, 2026"
              amount={59}
              status="pending"
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Payment Method Card"
          description="Monochrome CreditCardVisual with network switcher, masked PAN formatting, and tabular expiry."
          code={creditCardCode}
        >
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
              {(["visa", "mastercard", "amex"] as const).map((network) => (
                <button
                  key={network}
                  type="button"
                  onClick={() => setCardType(network)}
                  className={`rounded-md px-3 py-1 font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                    cardType === network
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {network}
                </button>
              ))}
            </div>
            <CreditCardVisual
              holder="M. KATO"
              number="4532 •••• •••• 8910"
              expiry="08/29"
              type={cardType}
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Promotional Coupons"
          description="Dashed CouponCard primitives with one-click clipboard copy feedback matching CheckoutSummary promo codes."
          code={couponGridCode}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            <CouponCard
              code="SAVE10"
              discount="10% Off First Order"
              expiry="Valid through Dec 31"
            />
            <CouponCard
              code="SAVE20"
              discount="20% Off Annual Plans"
              expiry="Team tiers eligible"
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Ratings & Checkout Assurance"
          description="Semantic ReviewStars paired with TrustBadge guarantees for product detail and payment footers."
          code={assuranceStripCode}
        >
          <div className="flex flex-col items-center gap-5 w-full">
            <ReviewStars rating={4.9} reviewCount={318} />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <TrustBadge
                label="256-bit TLS Checkout"
                icon={<Lock className="h-3.5 w-3.5" />}
              />
              <TrustBadge
                label="30-Day Returns"
                icon={<RotateCcw className="h-3.5 w-3.5" />}
              />
              <TrustBadge
                label="Tracked Dispatch"
                icon={<Truck className="h-3.5 w-3.5" />}
              />
              <TrustBadge
                label="2-Year Warranty"
                icon={<ShieldCheck className="h-3.5 w-3.5" />}
              />
            </div>
          </div>
        </ComponentCard>
      </div>

      <div className="space-y-4">
        <A11yHeader title="Accessibility & Financial Clarity" />
        <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground rounded-xl border border-border bg-card p-5">
          <li>
            <strong className="text-foreground">Action clarity:</strong> Quantity increment, decrement, item removal, wishlist toggles, and promo copy buttons all expose descriptive aria-label text.
          </li>
          <li>
            <strong className="text-foreground">Price legibility:</strong> Every currency figure, line total, invoice number, seat preset, and expiry date uses tabular-nums to prevent column shifting.
          </li>
        </ul>
      </div>

      <PropsTable
        propsData={[
          {
            name: "price / originalPrice",
            type: "number",
            description: "Current and compare-at prices displayed in ProductCardPro.",
          },
          {
            name: "colors / sizes",
            type: "string[]",
            description: "Finish swatches and size pill options in ProductCardPro.",
          },
          {
            name: "subtotal / shipping / tax",
            type: "number",
            description: "Line amounts reconciled by CheckoutSummary with live promo discount math.",
          },
          {
            name: "itemCount",
            type: "number",
            description: "Total unit count displayed in the CheckoutSummary header badge.",
          },
          {
            name: "status",
            type: '"active" | "past_due" | "cancelled" | "paid" | "pending" | "overdue"',
            description: "Semantic status tag for SubscriptionCard or InvoiceCard.",
          },
          {
            name: "type",
            type: '"visa" | "mastercard" | "amex"',
            defaultValue: '"visa"',
            description: "Card network wordmark rendered in CreditCardVisual.",
          },
          {
            name: "min / max / pricePerUnit",
            type: "number",
            defaultValue: "10 / 500 / 4",
            description: "Range bounds and unit pricing multiplier for PricingSlider.",
          },
        ]}
      />
    </section>
  );
}

export default CommerceSection;
