export const templateEcommerceStore = {
  name: "template-ecommerce-store",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-ecommerce-store.tsx",
  content: `"use client";

import React from "react";
import { ShoppingBag, Heart, Truck, RotateCcw } from "lucide-react";

export default function EcommerceStoreTemplate() {
  return (
    <div className="min-h-screen bg-[#0c0d12] text-zinc-100 p-8">
      <h1 className="text-3xl font-bold">Atelier Objects</h1>
    </div>
  );
}
`,
};
