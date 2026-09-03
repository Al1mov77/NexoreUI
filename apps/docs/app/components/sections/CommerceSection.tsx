"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import {
  ProductCardPro,
  CartItem,
  CheckoutSummary,
  PricingSlider,
  InvoiceCard,
  CreditCardVisual,
  CouponCard,
  SubscriptionCard,
  ReviewStars,
  TrustBadge,
  Button
} from "nexoreui";
import { ShoppingBag, Sparkles, Terminal, CreditCard, ShieldCheck, Tag } from "lucide-react";

export function CommerceSection() {
  const [activeTab, setActiveTab] = useState<"product" | "checkout" | "subscription">("product");
  const [productName, setProductName] = useState("Pro ANC Headphones");
  const [productPrice, setProductPrice] = useState("249");
  const [productBadge, setProductBadge] = useState("Best Seller");
  const [productRating, setProductRating] = useState(4.8);
  const [currentPage, setCurrentPage] = useState(1);

  const generateLiveCode = () => {
    if (activeTab === "product") {
      return `import { ProductCardPro } from "nexoreui";

export default function ProductCardDemo() {
  return (
    <ProductCardPro
      name="${productName}"
      price="${productPrice}"
      originalPrice="299"
      badge="${productBadge}"
      rating={${productRating}}
      reviewCount={342}
      onAddToCart={() => alert("Added to cart")}
    />
  );
}`;
    }

    if (activeTab === "checkout") {
      return `import { CheckoutSummary } from "nexoreui";

export default function CheckoutDemo() {
  return (
    <CheckoutSummary
      subtotal="349.00"
      shipping="Free"
      tax="28.00"
      total="377.00"
      onCheckout={() => alert("Proceeding to checkout")}
    />
  );
}`;
    }

    return `import { SubscriptionCard } from "nexoreui";

export default function SubscriptionDemo() {
  return (
    <SubscriptionCard
      plan="Pro Developer"
      price="49"
      billingPeriod="month"
      status="active"
      features={[
        "Unlimited API Requests",
        "Team Collaboration (10 seats)",
        "Priority 24/7 SLA Support",
        "Custom SSL & Domains"
      ]}
      onUpgrade={() => alert("Upgrading plan")}
    />
  );
}`;
  };

  const propsData = [
    {
      name: "name",
      type: "string",
      defaultValue: '""',
      description: "Title of the commerce product item.",
      required: true,
    },
    {
      name: "price",
      type: "string | number",
      defaultValue: '""',
      description: "Current promotional or sale price.",
      required: true,
    },
    {
      name: "originalPrice",
      type: "string | number",
      defaultValue: "—",
      description: "Previous original price rendered with strikethrough styling.",
      required: false,
    },
    {
      name: "badge",
      type: "string",
      defaultValue: "—",
      description: "Highlight pill label (e.g., 'Sale', 'Popular', 'New').",
      required: false,
    },
    {
      name: "rating",
      type: "number",
      defaultValue: "5.0",
      description: "Customer review star rating from 1 to 5.",
      required: false,
    },
    {
      name: "onAddToCart",
      type: "() => void",
      defaultValue: "—",
      description: "Primary purchase or add to cart button callback handler.",
      required: false,
    },
  ];

  const examples = [
    {
      name: "1. Flagship E-Commerce Product Card",
      component: (
        <div className="w-full flex justify-center">
          <ProductCardPro
            name="AirPulse Studio Pro"
            price="299"
            originalPrice="399"
            badge="Top Rated"
            rating={4.9}
            reviewCount={284}
          />
        </div>
      ),
      code: `<ProductCardPro
  name="AirPulse Studio Pro"
  price="299"
  originalPrice="399"
  badge="Top Rated"
  rating={4.9}
  reviewCount={284}
/>`,
    },
    {
      name: "2. Interactive Order Checkout Summary",
      component: (
        <div className="w-full flex justify-center">
          <CheckoutSummary
            subtotal="299.98"
            shipping="Free"
            tax="24.00"
            total="323.98"
          />
        </div>
      ),
      code: `<CheckoutSummary
  subtotal="299.98"
  shipping="Free"
  tax="24.00"
  total="323.98"
/>`,
    },
    {
      name: "3. Sleek SaaS Subscription Plan Card",
      component: (
        <div className="w-full flex justify-center">
          <SubscriptionCard
            plan="Enterprise Growth"
            price="99"
            nextBilling="Nov 1, 2026"
            status="active"
            features={["Unlimited Workspaces", "99.99% Uptime SLA", "Dedicated Account Manager"]}
          />
        </div>
      ),
      code: `<SubscriptionCard
  plan="Enterprise Growth"
  price="99"
  status="active"
  features={["Unlimited Workspaces", "99.99% Uptime SLA"]}
/>`,
    },
    {
      name: "4. Digital Invoice & Transaction Card",
      component: (
        <div className="w-full flex justify-center">
          <InvoiceCard
            invoiceNumber="INV-2026-849"
            date="Sep 03, 2026"
            status="paid"
            amount="2,450.00"
            client="Acme Global Inc"
          />
        </div>
      ),
      code: `<InvoiceCard
  invoiceNumber="INV-2026-849"
  date="Sep 03, 2026"
  status="paid"
  amount="2,450.00"
  client="Acme Global Inc"
/>`,
    },
    {
      name: "5. Realistic Holographic Payment Card",
      component: (
        <div className="w-full flex justify-center">
          <CreditCardVisual
            holder="ALEXANDER VANCE"
            number="•••• •••• •••• 8842"
            expiry="09/29"
            type="visa"
          />
        </div>
      ),
      code: `<CreditCardVisual
  holder="ALEXANDER VANCE"
  number="•••• •••• •••• 8842"
  expiry="09/29"
  type="visa"
/>`,
    },
    {
      name: "6. Promotional Coupon Voucher",
      component: (
        <div className="w-full flex justify-center">
          <CouponCard
            code="NEXORE50"
            discount="50% OFF"
            description="Special launch promotional discount on all annual Pro licenses."
            validUntil="Dec 31, 2026"
          />
        </div>
      ),
      code: `<CouponCard
  code="NEXORE50"
  discount="50% OFF"
  description="Special launch promotional discount on all annual Pro licenses."
  validUntil="Dec 31, 2026"
/>`,
    },
  ];

  const itemsPerPage = 2;
  const totalPages = Math.ceil(examples.length / itemsPerPage);
  const visibleItems = examples.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="commerce" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pro Suites — E-Commerce Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Commerce Suite
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          High-conversion checkout summaries, promotional voucher cards, holographic credit card
          visualizers, invoice managers, and interactive pricing tier sliders.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border text-xs font-mono w-fit mt-3">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">npx nexoreui-cli add commerce</span>
        </div>
      </div>

      {/* Interactive Live Playground */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Interactive Live Playground
            </h2>
            <p className="text-xs text-muted-foreground">
              Test dynamic product properties, pricing states, and layout modes.
            </p>
          </div>

          {/* Component Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("product")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "product" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Product Card
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("checkout")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "checkout" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Checkout Summary
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("subscription")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "subscription" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Subscription
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Live Preview Box */}
          <div className="xl:col-span-2 min-h-[360px] flex items-center justify-center p-6 sm:p-10 rounded-2xl border border-border bg-card/40 backdrop-blur-md relative overflow-hidden">
            {activeTab === "product" && (
              <ProductCardPro
                name={productName}
                price={productPrice}
                originalPrice="299"
                badge={productBadge}
                rating={productRating}
                reviewCount={342}
              />
            )}

            {activeTab === "checkout" && (
              <CheckoutSummary
                subtotal="349.00"
                shipping="Free"
                tax="28.00"
                total="377.00"
              />
            )}

            {activeTab === "subscription" && (
              <SubscriptionCard
                plan="Pro Developer"
                price="49"
                status="active"
                features={[
                  "Unlimited API Requests",
                  "Team Collaboration",
                  "Priority Support",
                  "Custom Domains"
                ]}
              />
            )}
          </div>

          {/* Controls Panel */}
          <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Configure Props
            </h3>

            {activeTab === "product" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Product Title</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Price ($)</label>
                  <input
                    type="text"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Badge Label</label>
                  <input
                    type="text"
                    value={productBadge}
                    onChange={(e) => setProductBadge(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>Star Rating</span>
                    <span>{productRating} / 5.0</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={productRating}
                    onChange={(e) => setProductRating(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </>
            )}

            {activeTab !== "product" && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Interact with the live component preview on the left. Toggle between tabs to test
                order checkout calculations or SaaS subscription cards.
              </p>
            )}
          </div>
        </div>

        {/* Live Generated Code */}
        <div className="pt-2">
          <ComponentSource
            sourceCode={generateLiveCode()}
            scope={{ ProductCardPro, CheckoutSummary, SubscriptionCard, InvoiceCard }}
          />
        </div>
      </div>

      {/* Props Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Props Reference</h2>
        <PropsTable propsData={propsData} />
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Usage Examples</h2>
          <span className="text-xs text-muted-foreground font-mono">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="space-y-8">
          {visibleItems.map((ex, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{ex.name}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div className="min-h-[220px] flex items-center justify-center p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-md">
                  {ex.component}
                </div>
                <ComponentSource
                  sourceCode={ex.code}
                  scope={{ ProductCardPro, CheckoutSummary, SubscriptionCard, InvoiceCard }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CommerceSection;
