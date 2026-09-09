"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownUp,
  Zap,
  SlidersHorizontal,
  ShieldCheck,
  Wallet,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Coins,
  Search,
  X,
  Flame,
  Globe,
  Lock,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function Web3DexPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // Tokens config
  const tokens = [
    { symbol: "ETH", name: "Ethereum", balance: "4.821", price: 2640.5 },
    { symbol: "USDC", name: "USD Coin", balance: "14,850.00", price: 1.0 },
    { symbol: "SOL", name: "Solana", balance: "84.20", price: 148.2 },
    { symbol: "NEXO", name: "Nexore Token", balance: "25,000.00", price: 0.85 },
    { symbol: "WBTC", name: "Wrapped BTC", balance: "0.245", price: 62450.0 },
  ];

  // States
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState("1.5");
  const [slippage, setSlippage] = useState("0.5%");
  const [activeTimeframe, setActiveTimeframe] = useState<"1H" | "24H" | "7D" | "1M">("24H");
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(true);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapToast, setSwapToast] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Compute calculated output
  const calculatedOutput = (
    (parseFloat(fromAmount || "0") * fromToken.price) /
    toToken.price
  ).toFixed(toToken.symbol === "USDC" ? 2 : 4);

  const handleFlip = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
      setSwapToast(`Swapped ${fromAmount} ${fromToken.symbol} for ${calculatedOutput} ${toToken.symbol}!`);
      setTimeout(() => setSwapToast(null), 4000);
    }, 1200);
  };

  const liquidityPools = [
    { pair: "ETH / USDC", tvl: "$48.2M", vol24h: "$14.8M", apy: "24.6% APY", fee: "0.05%" },
    { pair: "NEXO / ETH", tvl: "$18.6M", vol24h: "$6.2M", apy: "48.2% APY", fee: "0.30%" },
    { pair: "SOL / USDC", tvl: "$32.4M", vol24h: "$9.4M", apy: "19.8% APY", fee: "0.05%" },
    { pair: "WBTC / ETH", tvl: "$64.1M", vol24h: "$18.2M", apy: "12.4% APY", fee: "0.05%" },
  ];

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans text-left"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* DEX Navigation Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "zap"} className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-sm @sm:text-base tracking-tight"
              style={{ fontFamily: "var(--template-heading-font)" }}
            >
              {config.brandName || "NovaSwap Protocol"}
            </span>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            {/* Gas fee ticker */}
            <div
              className="hidden @md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="opacity-70">12 Gwei</span>
              <span className="text-cyan-500 font-bold">• Fast</span>
            </div>

            {/* Network pill */}
            <div
              className="hidden @sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Ethereum</span>
            </div>

            {/* Wallet button */}
            <button
              onClick={() => setIsWalletOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>{walletConnected ? "0x7F2...91cB" : "Connect Wallet"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Terminal View */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @sm:py-8 space-y-6">
        {/* Market Stats Bar */}
        <div className="grid grid-cols-2 @md:grid-cols-4 gap-3 @sm:gap-4">
          {[
            { label: "ETH / USD", val: "$2,640.50", delta: "+4.18%", up: true },
            { label: "24h Protocol Volume", val: "$182,490,200", delta: "+12.4%", up: true },
            { label: "Total Value Locked", val: "$842,100,000", delta: "+3.2%", up: true },
            { label: "Average Swap Routing", val: "14ms", delta: "Zero MEV", up: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-3.5 rounded-xl border"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="text-[11px] opacity-60 font-medium">{stat.label}</div>
              <div className="text-base @sm:text-lg font-bold font-mono my-0.5">{stat.val}</div>
              <div className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{stat.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Core Layout: Swap Card + Candlestick Depth Chart */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
          {/* Swap Card: 5 Cols */}
          <div className="@lg:col-span-5">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-4 shadow-lg"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm @sm:text-base">Instant Swap</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                    V3 AMM
                  </span>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="p-1.5 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ borderColor: "var(--template-border)" }}
                  aria-label="Swap Settings"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Settings Dropdown Drawer */}
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3.5 rounded-xl border space-y-2 text-xs"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold opacity-75">Slippage Tolerance</span>
                    <span className="font-mono text-cyan-500 font-bold">{slippage}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {["0.1%", "0.5%", "1.0%", "Custom"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSlippage(s)}
                        className={`flex-1 py-1 rounded-lg border text-xs font-mono font-medium transition-colors ${
                          slippage === s
                            ? "bg-cyan-600 text-white border-cyan-600 font-bold"
                            : "opacity-75 hover:opacity-100"
                        }`}
                        style={{ borderColor: "var(--template-border)" }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleExecuteSwap} className="space-y-2">
                {/* Pay Token Container */}
                <div
                  className="p-4 rounded-xl border space-y-1.5"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="flex justify-between text-xs opacity-70">
                    <span>You Pay</span>
                    <span className="font-mono">
                      Balance: {fromToken.balance} {fromToken.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="number"
                      step="any"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="text-2xl @sm:text-3xl font-mono font-bold bg-transparent outline-none w-full"
                    />
                    <select
                      value={fromToken.symbol}
                      onChange={(e) => {
                        const t = tokens.find((tok) => tok.symbol === e.target.value);
                        if (t) setFromToken(t);
                      }}
                      className="px-3 py-1.5 rounded-xl font-bold text-xs border bg-transparent outline-none cursor-pointer"
                      style={{ borderColor: "var(--template-border)" }}
                    >
                      {tokens.map((t) => (
                        <option key={t.symbol} value={t.symbol} className="text-black dark:text-white dark:bg-zinc-900">
                          {t.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-[11px] font-mono opacity-50">
                    ≈ ${(parseFloat(fromAmount || "0") * fromToken.price).toLocaleString()} USD
                  </div>
                </div>

                {/* Flip Pair Trigger */}
                <div className="flex justify-center -my-3 relative z-10">
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="p-2 rounded-xl border shadow-md hover:scale-105 active:scale-95 transition-all"
                    style={{
                      backgroundColor: "var(--template-surface)",
                      borderColor: "var(--template-border)",
                    }}
                    aria-label="Flip tokens"
                  >
                    <ArrowDownUp className="h-4 w-4 text-cyan-500" />
                  </button>
                </div>

                {/* Receive Token Container */}
                <div
                  className="p-4 rounded-xl border space-y-1.5"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="flex justify-between text-xs opacity-70">
                    <span>You Receive (Estimated)</span>
                    <span className="font-mono">
                      Balance: {toToken.balance} {toToken.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-2xl @sm:text-3xl font-mono font-bold w-full truncate">
                      {calculatedOutput}
                    </div>
                    <select
                      value={toToken.symbol}
                      onChange={(e) => {
                        const t = tokens.find((tok) => tok.symbol === e.target.value);
                        if (t) setToToken(t);
                      }}
                      className="px-3 py-1.5 rounded-xl font-bold text-xs border bg-transparent outline-none cursor-pointer"
                      style={{ borderColor: "var(--template-border)" }}
                    >
                      {tokens.map((t) => (
                        <option key={t.symbol} value={t.symbol} className="text-black dark:text-white dark:bg-zinc-900">
                          {t.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-[11px] font-mono opacity-50">
                    ≈ ${(parseFloat(calculatedOutput || "0") * toToken.price).toLocaleString()} USD
                  </div>
                </div>

                {/* Trade Execution Telemetry details */}
                <div
                  className="p-3 rounded-xl border text-[11px] space-y-1 font-mono opacity-75"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="flex justify-between">
                    <span>Rate</span>
                    <span>1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(4)} {toToken.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Routing</span>
                    <span className="text-cyan-500 font-semibold">NovaSwap Split-Route (Zero MEV)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Network Fee</span>
                    <span>~$1.24 (0.00047 ETH)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSwapping}
                  className="w-full py-3.5 rounded-xl font-bold text-xs text-white shadow-md transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "var(--template-primary)",
                    borderRadius: "var(--template-radius)",
                  }}
                >
                  {isSwapping ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Confirming on Chain...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>Swap {fromToken.symbol} to {toToken.symbol}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Chart & Depth Visualizer: 7 Cols */}
          <div className="@lg:col-span-7 space-y-6">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm @sm:text-base">
                      {fromToken.symbol} / {toToken.symbol} Market Depth
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-500">+4.18%</span>
                  </div>
                  <div className="text-xl @sm:text-2xl font-mono font-extrabold mt-1">
                    ${(fromToken.price / toToken.price).toFixed(2)}
                  </div>
                </div>

                <div
                  className="inline-flex p-1 rounded-xl border text-xs"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  {(["1H", "24H", "7D", "1M"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTimeframe(t)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                        activeTimeframe === t
                          ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Candlestick / Bar Visualization */}
              <div className="w-full h-48 relative flex items-end justify-between gap-1 pt-6 px-1">
                {[
                  { h: 40, up: true },
                  { h: 55, up: true },
                  { h: 50, up: false },
                  { h: 65, up: true },
                  { h: 60, up: false },
                  { h: 75, up: true },
                  { h: 85, up: true },
                  { h: 80, up: false },
                  { h: 95, up: true },
                  { h: 90, up: false },
                  { h: 105, up: true },
                  { h: 120, up: true },
                  { h: 115, up: false },
                  { h: 130, up: true },
                  { h: 145, up: true },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className={`w-full max-w-[14px] rounded-t transition-all ${
                        bar.up ? "bg-emerald-500/80 hover:bg-emerald-400" : "bg-rose-500/80 hover:bg-rose-400"
                      }`}
                      style={{ height: `${bar.h}px` }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[10px] font-mono opacity-50 border-t pt-2" style={{ borderColor: "var(--template-border)" }}>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>Current</span>
              </div>
            </div>

            {/* Yield Farming Liquidity Pools */}
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm @sm:text-base flex items-center gap-2">
                  <Coins className="h-4 w-4 text-cyan-500" />
                  <span>Featured Liquidity Pools</span>
                </h3>
                <span className="text-xs opacity-60 font-mono">Real-time APY Yields</span>
              </div>

              <div className="space-y-2.5 overflow-x-auto">
                {liquidityPools.map((pool) => (
                  <div
                    key={pool.pair}
                    className="p-3.5 rounded-xl border flex items-center justify-between gap-4 text-xs font-mono"
                    style={{
                      backgroundColor: "var(--template-surface-elevated)",
                      borderColor: "var(--template-border)",
                    }}
                  >
                    <div>
                      <div className="font-bold text-sm text-foreground">{pool.pair}</div>
                      <div className="text-[11px] opacity-60">Fee: {pool.fee}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold">{pool.tvl}</div>
                      <div className="text-[10px] opacity-60">TVL</div>
                    </div>

                    <div className="text-right hidden @sm:block">
                      <div className="font-bold">{pool.vol24h}</div>
                      <div className="text-[10px] opacity-60">24h Vol</div>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                      {pool.apy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Wallet Connection Modal */}
      {isWalletOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm p-6 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              color: "var(--template-fg)",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--template-border)" }}>
              <span className="font-bold text-sm">Connect Web3 Wallet</span>
              <button onClick={() => setIsWalletOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: "MetaMask", badge: "Installed" },
                { name: "Phantom", badge: "Multi-chain" },
                { name: "Coinbase Wallet", badge: "Smart Wallet" },
                { name: "WalletConnect", badge: "QR Code" },
              ].map((w) => (
                <button
                  key={w.name}
                  onClick={() => {
                    setWalletConnected(true);
                    setIsWalletOpen(false);
                  }}
                  className="w-full p-3 rounded-xl border flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  <span className="font-bold">{w.name}</span>
                  <span className="text-[10px] font-mono opacity-60">{w.badge}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      {swapToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{swapToast}</span>
        </div>
      )}
    </div>
  );
}
