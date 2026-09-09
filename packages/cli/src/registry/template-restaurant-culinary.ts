export const templateRestaurantCulinary = {
  name: "template-restaurant-culinary",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-restaurant-culinary.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Utensils, Calendar, Users, Award, Wine } from "lucide-react";

export default function RestaurantCulinaryTemplate() {
  const [guests, setGuests] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#f5f2eb] font-sans p-6 sm:p-12">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-[#2e2b24]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500">Komorebi Gastronomy</span>
          <h1 className="text-xl font-serif">Contemporary Seasonal Dining</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-serif">
          <Award className="h-4 w-4" />
          <span>Two Michelin Stars</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-light">Autumn Tasting Menu (8 Courses)</h2>
          <p className="text-xs text-[#b8b3a5] max-w-xl mx-auto">
            Hokkaido sea urchin, wild matsutake, and binchotan-charred Miyazaki A5 wagyu tenderloin.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-[#2e2b24] bg-[#171512] max-w-md mx-auto space-y-4">
          <div className="font-serif font-bold text-sm">Table Reservation</div>
          <div className="flex gap-2">
            {[2, 4, 6].map((g) => (
              <button
                key={g}
                onClick={() => setGuests(g)}
                className={\`flex-1 py-2 rounded-xl border text-xs font-serif \${
                  guests === g ? "bg-amber-700 text-white border-amber-700" : "border-[#2e2b24] text-[#b8b3a5]"
                }\`}
              >
                {g} Guests
              </button>
            ))}
          </div>

          <button
            onClick={() => setConfirmed(true)}
            className="w-full py-3 rounded-xl font-serif uppercase tracking-widest text-xs font-bold text-white bg-amber-700 hover:bg-amber-600 shadow-lg"
          >
            {confirmed ? "Table Reserved ✓" : "Reserve Table for " + guests}
          </button>
        </div>
      </main>
    </div>
  );
}
`,
};
