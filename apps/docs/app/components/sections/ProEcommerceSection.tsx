"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  AddToCartBar,
  OrderSummaryCard,
  CartDrawerItem,
  ColorSelector,
  SizeSelector,
} from "nexoreui";

export function ProEcommerceSection() {
  return (
    <SuiteSectionLayout
      id="pro-ecommerce"
      title="Pro E-Commerce"
      badge="Commerce Primitives"
      description="Production e-commerce UI blocks: sticky add-to-cart bars, shopping cart items with quantity steppers, order summaries, and variant selectors."
      cliCommand="npx nexoreui add pro-ecommerce"
      items={[
        {
          name: "Order Summary Checkout Card",
          description: "Subtotal calculation card with shipping, estimated taxes, and secure checkout CTA.",
          component: (
            <div className="w-full max-w-sm">
              <OrderSummaryCard />
            </div>
          ),
          code: `import { OrderSummaryCard } from "nexoreui"

<OrderSummaryCard />`
        },
        {
          name: "Add to Cart Bar with Quantity Stepper",
          description: "Sticky action bar with live price calculation and increment/decrement controls.",
          component: (
            <div className="w-full max-w-lg">
              <AddToCartBar />
            </div>
          ),
          code: `import { AddToCartBar } from "nexoreui"

<AddToCartBar />`
        },
        {
          name: "Cart Line Item",
          description: "Detailed cart drawer row with quantity adjustment, unit pricing, and item removal.",
          component: (
            <div className="w-full max-w-md">
              <CartDrawerItem />
            </div>
          ),
          code: `import { CartDrawerItem } from "nexoreui"

<CartDrawerItem />`
        },
        {
          name: "Product Variant Selectors",
          description: "Tactile color swatches and apparel size selectors with active ring highlights.",
          component: (
            <div className="space-y-6 w-full max-w-xs">
              <ColorSelector />
              <SizeSelector />
            </div>
          ),
          code: `import { ColorSelector, SizeSelector } from "nexoreui"

<ColorSelector />
<SizeSelector />`
        }
      ]}
      a11yNotes={[
        "Quantity Inputs: Stepper buttons include explicit aria-label ('Decrease quantity', 'Increase quantity').",
        "Contrast: Color swatch rings ensure high-visibility focus borders in both dark and light modes."
      ]}
    />
  );
}
