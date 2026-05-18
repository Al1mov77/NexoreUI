"use client"

import * as React from "react"
import { Star, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Lock } from "lucide-react"

export const ProductGallery = () => {
  const [active, setActive] = React.useState(1)
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} onClick={() => setActive(i)} className={`w-16 h-16 md:w-20 md:h-24 bg-muted rounded-lg border-2 transition-all ${i === active ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent cursor-pointer hover:border-foreground/20'}`} />
        ))}
      </div>
      <div className="flex-1 bg-muted rounded-2xl aspect-[4/3] flex items-center justify-center text-muted-foreground order-1 md:order-2 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-background/10 to-transparent" />
        <span className="font-medium">Product View {active}</span>
      </div>
    </div>
  )
}

export const AddToCartBar = () => {
  const [qty, setQty] = React.useState(1)
  return (
    <div className="flex items-center gap-4 w-full p-4 border rounded-2xl bg-card shadow-lg sticky bottom-4 z-10 max-w-2xl mx-auto">
      <div><p className="text-sm text-muted-foreground">Total Price</p><h3 className="text-2xl font-bold">${(qty * 129).toFixed(2)}</h3></div>
      <div className="flex-1"></div>
      <div className="flex items-center border rounded-lg h-12 overflow-hidden bg-background">
        <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 hover:bg-muted h-full transition-colors">-</button>
        <span className="px-4 font-bold min-w-[2.5rem] text-center">{qty}</span>
        <button onClick={() => setQty(qty + 1)} className="px-4 hover:bg-muted h-full transition-colors">+</button>
      </div>
      <button className="px-6 md:px-8 h-12 bg-primary text-primary-foreground font-bold rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"><ShoppingBag className="w-5 h-5" /> <span className="hidden md:inline">Add to Cart</span></button>
    </div>
  )
}

export const CartDrawerItem = () => {
  const [qty, setQty] = React.useState(1)
  const [visible, setVisible] = React.useState(true)
  
  if (!visible) return null;

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="w-20 h-20 bg-muted rounded-xl border" />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between"><h4 className="font-bold text-sm md:text-base">Premium Wireless Headphones</h4><button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-destructive transition-colors p-1"><Trash2 className="w-4 h-4" /></button></div>
        <p className="text-sm text-muted-foreground mb-auto">Matte Black</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center border rounded-lg overflow-hidden h-8 bg-background">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 hover:bg-muted transition-colors">-</button>
            <span className="px-3 text-sm font-bold min-w-[2rem] text-center">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="px-3 hover:bg-muted transition-colors">+</button>
          </div>
          <span className="font-bold text-lg">${(qty * 299).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export const OrderSummaryCard = () => (
  <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-4">
    <h3 className="font-bold text-xl border-b pb-4">Order Summary</h3>
    <div className="space-y-3 text-sm">
      <div className="flex justify-between font-medium"><span className="text-muted-foreground">Subtotal</span><span>$129.00</span></div>
      <div className="flex justify-between font-medium"><span className="text-muted-foreground">Shipping</span><span>$10.00</span></div>
      <div className="flex justify-between font-medium"><span className="text-muted-foreground">Tax</span><span>$6.45</span></div>
    </div>
    <div className="border-t pt-4 flex justify-between font-black text-xl"><span>Total</span><span>$145.45</span></div>
    <button className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl mt-4 flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5">Checkout <ArrowRight className="w-4 h-4" /></button>
    <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground opacity-50">
      <Lock className="w-3 h-3" /> <span className="text-xs font-medium">Secure Checkout</span>
    </div>
  </div>
)

// 5. PromoCodeInput
export const PromoCodeInput = () => (
  <div className="flex gap-2">
    <input className="flex-1 px-4 py-2 border rounded-md text-sm" placeholder="Discount code" />
    <button className="px-6 py-2 bg-secondary text-secondary-foreground font-medium rounded-md text-sm">Apply</button>
  </div>
)

// 6. ShippingAddressForm
export const ShippingAddressForm = () => (
  <div className="space-y-4">
    <h3 className="font-bold text-lg mb-2">Shipping Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <input className="p-2 border rounded-md w-full" placeholder="First Name" />
      <input className="p-2 border rounded-md w-full" placeholder="Last Name" />
    </div>
    <input className="p-2 border rounded-md w-full" placeholder="Address" />
    <input className="p-2 border rounded-md w-full" placeholder="Apartment, suite, etc. (optional)" />
    <div className="grid grid-cols-3 gap-4">
      <input className="p-2 border rounded-md w-full" placeholder="City" />
      <select className="p-2 border rounded-md w-full bg-background"><option>State</option></select>
      <input className="p-2 border rounded-md w-full" placeholder="ZIP code" />
    </div>
  </div>
)

// 7. ProductReview
export const ProductReview = () => (
  <div className="py-6 border-b">
    <div className="flex justify-between mb-2">
      <div className="font-semibold">Alex Johnson</div>
      <div className="text-sm text-muted-foreground">October 12, 2025</div>
    </div>
    <div className="flex text-yellow-400 mb-3">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
    <h4 className="font-bold mb-1">Incredible sound quality!</h4>
    <p className="text-muted-foreground text-sm leading-relaxed">I've been using these for a month and they are absolutely fantastic. The noise cancellation is top tier and battery life is exactly as advertised.</p>
  </div>
)

// 8. ColorSelector
export const ColorSelector = () => (
  <div>
    <h4 className="text-sm font-medium mb-3">Color - <span className="text-muted-foreground">Matte Black</span></h4>
    <div className="flex gap-3">
      {['bg-black', 'bg-gray-300', 'bg-blue-900', 'bg-red-700'].map((color, i) => (
        <button key={i} className={`w-10 h-10 rounded-full ${color} ring-offset-2 ${i === 0 ? 'ring-2 ring-primary' : 'ring-1 ring-border'}`} />
      ))}
    </div>
  </div>
)

// 9. SizeSelector
export const SizeSelector = () => (
  <div>
    <div className="flex justify-between items-end mb-3">
      <h4 className="text-sm font-medium">Size</h4>
      <a href="#" className="text-xs text-primary hover:underline">Size guide</a>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {['S', 'M', 'L', 'XL'].map((size, i) => (
        <button key={i} className={`py-2 border rounded-md font-medium transition-colors ${i === 1 ? 'border-primary bg-primary/5 text-primary' : 'hover:border-foreground'}`}>{size}</button>
      ))}
    </div>
  </div>
)

// 10. CategoryCard
export const CategoryCard = () => (
  <div className="relative group overflow-hidden rounded-2xl cursor-pointer aspect-square bg-muted flex items-center justify-center">
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
    <div className="absolute inset-0 scale-100 group-hover:scale-110 transition-transform duration-500 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-50" />
    <div className="relative z-20 text-white text-center">
      <h3 className="text-3xl font-bold mb-2">Sneakers</h3>
      <div className="flex items-center gap-1 text-sm font-medium justify-center group-hover:gap-2 transition-all">Shop Now <ArrowRight className="w-4 h-4" /></div>
    </div>
  </div>
)
