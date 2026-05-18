"use client";

import React from "react";
import { ComponentSource } from "../ComponentSource";
import { ProductCardPro, CartItem, CheckoutSummary, PricingSlider, InvoiceCard, CreditCardVisual, CouponCard, SubscriptionCard, ReviewStars, TrustBadge } from "nexoreui";

const variants = [
  {
    name: "Product Card Pro",
    component: <div className="p-4 w-full flex justify-center"><ProductCardPro name="Wireless Headphones" price="199" originalPrice="249" badge="Sale" rating={4.5} reviewCount={128} /></div>,
    code: `import { ProductCardPro } from "nexoreui"\n\n<ProductCardPro name="Wireless Headphones" price="199" originalPrice="249" badge="Sale" rating={4.5} reviewCount={128} />`
  },
  {
    name: "Cart Item",
    component: <div className="p-4 w-full"><CartItem name="Mechanical Keyboard" price="149.99" quantity={2} /></div>,
    code: `import { CartItem } from "nexoreui"\n\n<CartItem name="Mechanical Keyboard" price="149.99" quantity={2} />`
  },
  {
    name: "Checkout Summary",
    component: <div className="p-4 w-full flex justify-center"><CheckoutSummary subtotal="299.98" shipping="Free" tax="24.00" total="323.98" /></div>,
    code: `import { CheckoutSummary } from "nexoreui"\n\n<CheckoutSummary subtotal="299.98" shipping="Free" tax="24.00" total="323.98" />`
  },
  {
    name: "Pricing Slider",
    component: <div className="p-4 w-full flex justify-center"><PricingSlider tiers={[{name: "Basic", price: "10", features: ["A", "B"]}, {name: "Pro", price: "29", features: ["A", "B", "C"]}]} /></div>,
    code: `import { PricingSlider } from "nexoreui"\n\n<PricingSlider tiers={[{name: "Basic", price: "10", features: ["A"]}, ...]} />`
  },
  {
    name: "Invoice Card",
    component: <div className="p-4 w-full flex justify-center"><InvoiceCard invoiceNumber="INV-2023-001" date="Oct 24, 2023" status="paid" amount="1250.00" client="Acme Corp" /></div>,
    code: `import { InvoiceCard } from "nexoreui"\n\n<InvoiceCard invoiceNumber="INV-2023-001" date="Oct 24, 2023" status="paid" amount="1250.00" client="Acme Corp" />`
  },
  {
    name: "Credit Card Visual",
    component: <div className="p-4 w-full flex justify-center"><CreditCardVisual holder="JOHN DOE" number="•••• •••• •••• 4242" expiry="12/28" type="visa" /></div>,
    code: `import { CreditCardVisual } from "nexoreui"\n\n<CreditCardVisual holder="JOHN DOE" number="•••• •••• •••• 4242" expiry="12/28" type="visa" />`
  },
  {
    name: "Coupon Card",
    component: <div className="p-4 w-full flex justify-center"><CouponCard code="SUMMER24" discount="20% OFF" description="Valid on all summer collection items." validUntil="Aug 31, 2024" /></div>,
    code: `import { CouponCard } from "nexoreui"\n\n<CouponCard code="SUMMER24" discount="20% OFF" description="..." validUntil="Aug 31, 2024" />`
  },
  {
    name: "Subscription Card",
    component: <div className="p-4 w-full flex justify-center"><SubscriptionCard plan="Pro Plan" price="29" nextBilling="Nov 1, 2023" status="active" features={["Unlimited projects", "Priority support"]} /></div>,
    code: `import { SubscriptionCard } from "nexoreui"\n\n<SubscriptionCard plan="Pro Plan" price="29" status="active" features={[...]} />`
  },
  {
    name: "Review Stars",
    component: <div className="p-4 w-full flex justify-center"><ReviewStars rating={4.5} size={32} /></div>,
    code: `import { ReviewStars } from "nexoreui"\n\n<ReviewStars rating={4.5} size={32} />`
  },
  {
    name: "Trust Badge",
    component: <div className="p-4 w-full flex justify-center"><TrustBadge icon={<span className="text-xl">🔒</span>} title="Secure Checkout" subtitle="256-bit encryption" /></div>,
    code: `import { TrustBadge } from "nexoreui"\n\n<TrustBadge icon={<Icon />} title="Secure Checkout" subtitle="256-bit encryption" />`
  }
];

export function CommerceSection() {
  return (
    <section id="commerce" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Commerce</h2>
          <p className="text-muted-foreground">Premium components for e-commerce stores.</p>
        </div>
      </div>

      <div className="space-y-12">
        {variants.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
