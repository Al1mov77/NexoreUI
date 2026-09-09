export const templateWeb3Dex = {
  name: "template-web3-dex",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-web3-dex.tsx",
  content: `"use client";

import React, { useState } from "react";
import { ArrowDownUp, Zap, Wallet, TrendingUp } from "lucide-react";

export default function Web3DexTemplate() {
  const [fromAmount, setFromAmount] = useState("1.5");
  const [isSwapping, setIsSwapping] = useState(false);

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-3xl border border-white/10 bg-[#12141c] space-y-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <span className="font-bold text-base">NovaSwap DEX</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">12 Gwei</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/5 bg-[#181a24] space-y-1">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>You Pay</span>
            <span>Balance: 4.82 ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-2xl font-mono font-bold bg-transparent outline-none w-1/2"
            />
            <span className="px-3 py-1 rounded-xl bg-white/10 font-bold text-xs">ETH</span>
          </div>
        </div>

        <div className="flex justify-center -my-2">
          <div className="p-2 rounded-xl bg-[#12141c] border border-white/10">
            <ArrowDownUp className="h-4 w-4 text-cyan-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-white/5 bg-[#181a24] space-y-1">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>You Receive (Est.)</span>
            <span>Balance: 14,850 USDC</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-2xl font-mono font-bold">
              {(parseFloat(fromAmount || "0") * 2640.5).toFixed(2)}
            </div>
            <span className="px-3 py-1 rounded-xl bg-white/10 font-bold text-xs">USDC</span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsSwapping(true);
            setTimeout(() => setIsSwapping(false), 1200);
          }}
          className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-cyan-600 hover:bg-cyan-500 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Zap className="h-4 w-4" />
          <span>{isSwapping ? "Routing via Smart Contract..." : "Swap Tokens"}</span>
        </button>
      </div>
    </div>
  );
}
`,
};
