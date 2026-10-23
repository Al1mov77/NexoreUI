const fs = require('fs');
const path = require('path');
const sharp = require('../apps/docs/node_modules/sharp');

const OUTPUT_DIR = path.join(__dirname, '../apps/docs/public/images/templates');

// Shared SVG helper to build ultra-clean, architectural background grids & specular lighting
function buildBackdrop(accentColor, secondaryAccent) {
  return `
    <defs>
      <!-- Base Gradients -->
      <radialGradient id="ambientGlow" cx="75%" cy="45%" r="65%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.18" />
        <stop offset="60%" stop-color="${secondaryAccent || accentColor}" stop-opacity="0.04" />
        <stop offset="100%" stop-color="#07080c" stop-opacity="0" />
      </radialGradient>

      <linearGradient id="topHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="25%" stop-color="${accentColor}" stop-opacity="0.6" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.8" />
        <stop offset="75%" stop-color="${accentColor}" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>

      <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
        <stop offset="40%" stop-color="${accentColor}" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05" />
      </linearGradient>

      <linearGradient id="glassFill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#141721" stop-opacity="0.85" />
        <stop offset="100%" stop-color="#0b0d14" stop-opacity="0.95" />
      </linearGradient>

      <!-- Soft Glow Filter -->
      <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <!-- Heavy Drop Shadow -->
      <filter id="shadowHeavy" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.75" />
      </filter>

      <!-- Grid Pattern -->
      <pattern id="archGrid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1" />
        <circle cx="32" cy="32" r="0.75" fill="#ffffff" fill-opacity="0.07" />
      </pattern>
    </defs>

    <!-- Deep Obsidian Canvas -->
    <rect width="1376" height="768" fill="#08090d" />
    <rect width="1376" height="768" fill="url(#ambientGlow)" />
    <rect width="1376" height="768" fill="url(#archGrid)" />

    <!-- Top Specular Rim Ray -->
    <rect x="0" y="0" width="1376" height="1.5" fill="url(#topHighlight)" />
  `;
}

// 1. AI CHAT INTERFACE
function renderAiChat() {
  const accent = "#38bdf8";
  const sec = "#6366f1";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT MONUMENTAL TYPOGRAPHY & HERO BRANDING -->
    <g transform="translate(72, 88)">
      <!-- Badge Pill -->
      <rect x="0" y="0" width="220" height="28" rx="14" fill="#0e1726" stroke="#38bdf8" stroke-opacity="0.3" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#38bdf8" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#7dd3fc" letter-spacing="1.5">PRO FLAGSHIP // AI APPLICATION</text>

      <!-- Monumental Headline -->
      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">AI STREAMING</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#38bdf8" letter-spacing="-1.5">STUDIO 2026</text>

      <!-- Subtitle Description -->
      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8" letter-spacing="0.2">ChatGPT &amp; Claude 3.7 native token streaming studio</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b" letter-spacing="0.2">On-the-fly velocity tuning, rich code syntax &amp; clean spring physics.</text>

      <!-- Telemetry Stats Cards Grid -->
      <g transform="translate(0, 224)">
        <!-- Stat 1 -->
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#64748b" letter-spacing="1">VELOCITY</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#38bdf8">140 W/S</text>

        <!-- Stat 2 -->
        <rect x="142" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#64748b" letter-spacing="1">LATENCY</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#a5b4fc">&lt; 18 MS</text>

        <!-- Stat 3 -->
        <rect x="284" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#64748b" letter-spacing="1">MODELS</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#ffffff">GPT-4o / C3.7</text>
      </g>

      <!-- CLI Install Command Bar -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#0a0e17" stroke="#1e293b" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#38bdf8" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#cbd5e1">npx nexoreui add template-ai-chat-interface</text>
      </g>

      <!-- Key Capabilities Tags -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="102" height="26" rx="6" fill="#131b2e" stroke="#1e293b" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#93c5fd">Zero AI Slop</text>

        <rect x="110" y="0" width="118" height="26" rx="6" fill="#131b2e" stroke="#1e293b" stroke-width="1" />
        <text x="120" y="17" font-size="11" font-weight="600" fill="#93c5fd">Next.js 15 Ready</text>

        <rect x="236" y="0" width="130" height="26" rx="6" fill="#131b2e" stroke="#1e293b" stroke-width="1" />
        <text x="246" y="17" font-size="11" font-weight="600" fill="#93c5fd">Spring Animations</text>
      </g>
    </g>

    <!-- RIGHT 3D PERSPECTIVE UI STUDIO WORKSPACE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Window Frame -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Window Top Navigation Bar -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111420" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />

      <rect x="230" y="10" width="300" height="26" rx="6" fill="#0b0d14" stroke="#1e293b" stroke-width="1" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">ai-chat.nexore.dev • Stream Orchestrator</text>

      <!-- Sidebar Mini Mockup -->
      <g transform="translate(0, 46)">
        <rect x="0" y="0" width="190" height="584" fill="#0e111a" stroke="#1e2333" stroke-width="0.5" />
        <!-- Sidebar items -->
        <rect x="14" y="20" width="162" height="32" rx="8" fill="#1e293b" fill-opacity="0.5" stroke="#38bdf8" stroke-opacity="0.4" stroke-width="1" />
        <circle cx="28" cy="36" r="3.5" fill="#38bdf8" />
        <text x="38" y="40" font-size="11" font-weight="600" fill="#ffffff">Architecture Refactor</text>

        <rect x="14" y="60" width="162" height="30" rx="8" fill="#131722" />
        <circle cx="28" cy="75" r="3" fill="#64748b" />
        <text x="38" y="79" font-size="11" font-weight="500" fill="#94a3b8">Quantum Cryptography</text>

        <rect x="14" y="98" width="162" height="30" rx="8" fill="#131722" />
        <circle cx="28" cy="113" r="3" fill="#64748b" />
        <text x="38" y="117" font-size="11" font-weight="500" fill="#94a3b8">Bespoke Vector Search</text>

        <!-- Velocity Tune Slider -->
        <rect x="14" y="490" width="162" height="68" rx="10" fill="#131722" stroke="#1e2333" stroke-width="1" />
        <text x="26" y="512" font-size="10" font-weight="700" fill="#64748b">STREAMING SPEED</text>
        <rect x="26" y="524" width="138" height="6" rx="3" fill="#1e293b" />
        <rect x="26" y="524" width="100" height="6" rx="3" fill="#38bdf8" />
        <circle cx="126" cy="527" r="6" fill="#ffffff" filter="url(#glowEffect)" />
        <text x="26" y="546" font-size="10" font-weight="700" fill="#38bdf8">140 words/sec</text>
      </g>

      <!-- Main Chat Body -->
      <g transform="translate(210, 64)">
        <!-- User Bubble -->
        <rect x="280" y="10" width="250" height="42" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1" />
        <text x="296" y="36" font-size="12" font-weight="500" fill="#f8fafc">Refactor SSE streaming pipeline with Zod</text>

        <!-- Assistant AI Response Bubble -->
        <rect x="10" y="70" width="520" height="370" rx="14" fill="#0b0e17" stroke="#1e2538" stroke-width="1" />

        <!-- AI Header -->
        <circle cx="32" cy="94" r="10" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1" />
        <text x="32" y="98" font-size="10" font-weight="900" fill="#38bdf8" text-anchor="middle">AI</text>
        <text x="50" y="98" font-size="12" font-weight="700" fill="#ffffff">Claude 3.7 Sonnet</text>
        <rect x="160" y="87" width="52" height="18" rx="4" fill="#14532d" />
        <text x="186" y="99" font-size="9" font-weight="700" fill="#4ade80" text-anchor="middle">STREAMING</text>

        <!-- Explanation text -->
        <text x="24" y="132" font-size="12" font-weight="400" fill="#cbd5e1">Here is the production-grade pipeline with zero-latency buffer:</text>

        <!-- Syntax Code Block -->
        <g transform="translate(24, 150)">
          <rect x="0" y="0" width="472" height="190" rx="8" fill="#06080e" stroke="#1e293b" stroke-width="1" />
          <!-- Code Title Bar -->
          <rect x="0" y="0" width="472" height="26" rx="8" fill="#0f1422" />
          <text x="14" y="17" font-size="10" font-family="'JetBrains Mono', monospace" fill="#64748b">stream-engine.ts</text>
          <text x="440" y="17" font-size="10" font-weight="600" fill="#38bdf8">COPY</text>

          <!-- Code lines -->
          <text x="14" y="48" font-size="11" font-family="'JetBrains Mono', monospace" fill="#c084fc">export async function <tspan fill="#60a5fa">createTokenStream</tspan>() {</text>
          <text x="28" y="70" font-size="11" font-family="'JetBrains Mono', monospace" fill="#94a3b8">  const stream = new <tspan fill="#38bdf8">TransformStream</tspan>();</text>
          <text x="28" y="92" font-size="11" font-family="'JetBrains Mono', monospace" fill="#94a3b8">  const writer = stream.writable.getWriter();</text>
          <text x="28" y="114" font-size="11" font-family="'JetBrains Mono', monospace" fill="#e2e8f0">  await writer.write(encoder.encode(chunk));</text>
          <text x="28" y="136" font-size="11" font-family="'JetBrains Mono', monospace" fill="#4ade80">  // Velocity: 140 words/sec locked</text>
          <text x="14" y="160" font-size="11" font-family="'JetBrains Mono', monospace" fill="#c084fc">}</text>

          <!-- Streaming cursor pulse -->
          <rect x="30" y="150" width="8" height="15" fill="#38bdf8" filter="url(#glowEffect)" />
        </g>

        <!-- Interactive Input Bar -->
        <g transform="translate(10, 460)">
          <rect x="0" y="0" width="520" height="54" rx="14" fill="#0e1320" stroke="#38bdf8" stroke-opacity="0.4" stroke-width="1.2" />
          <text x="20" y="32" font-size="13" font-weight="400" fill="#94a3b8">Ask anything or write code...</text>
          <rect x="444" y="10" width="64" height="34" rx="8" fill="#38bdf8" />
          <text x="476" y="31" font-size="11" font-weight="800" fill="#080c14" text-anchor="middle">SEND ↵</text>
        </g>
      </g>
    </g>
  </svg>
  `;
}

// 2. NEXSTORE E-COMMERCE
function renderNexStore() {
  const accent = "#10b981";
  const sec = "#f59e0b";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="180" height="28" rx="14" fill="#06281e" stroke="#10b981" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#10b981" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#6ee7b7" letter-spacing="1.5">PRO FLAGSHIP // COMMERCE</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">NEXSTORE PRO</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#10b981" letter-spacing="-1.5">HAUTE VITRINE</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Complete high-performance e-commerce suite with 10 real products.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Interactive cart drawer, multi-step checkout &amp; discount engine.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#64748b">CATALOG</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#10b981">10 CURATED</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#64748b">CHECKOUT</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#fbbf24">1-CLICK</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#64748b">DISCOUNT</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#ffffff">PRO2026</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#0a0e17" stroke="#1e293b" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#10b981" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#cbd5e1">npx nexoreui add template-ecommerce-pro</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#0d231b" stroke="#1e293b" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#6ee7b7">Apple Pay Ready</text>

        <rect x="120" y="0" width="124" height="26" rx="6" fill="#0d231b" stroke="#1e293b" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#6ee7b7">Cart Drawer Engine</text>

        <rect x="252" y="0" width="118" height="26" rx="6" fill="#0d231b" stroke="#1e293b" stroke-width="1" />
        <text x="262" y="17" font-size="11" font-weight="600" fill="#6ee7b7">Customer Reviews</text>
      </g>
    </g>

    <!-- RIGHT STOREFRONT SHOWCASE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Window -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Top Bar -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111420" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">store.nexore.dev • Flagship Catalog</text>

      <!-- Product Card 1 (Hero Product Vitrine) -->
      <g transform="translate(30, 66)">
        <rect x="0" y="0" width="410" height="520" rx="16" fill="#0c0f18" stroke="#1e2638" stroke-width="1" />
        <!-- Image Area -->
        <rect x="14" y="14" width="382" height="260" rx="12" fill="#121726" />
        <!-- Headphone Silhouette in vector -->
        <circle cx="205" cy="144" r="74" fill="none" stroke="#10b981" stroke-width="6" stroke-dasharray="140 180" />
        <rect x="120" y="130" width="26" height="56" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
        <rect x="264" y="130" width="26" height="56" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
        <circle cx="205" cy="144" r="32" fill="#10b981" fill-opacity="0.1" />

        <!-- Rating Pill -->
        <rect x="28" y="28" width="94" height="24" rx="6" fill="#091410" stroke="#10b981" stroke-opacity="0.4" stroke-width="1" />
        <text x="38" y="44" font-size="11" font-weight="700" fill="#34d399">★ 4.9 (128)</text>

        <!-- Product details -->
        <text x="20" y="306" font-size="20" font-weight="800" fill="#ffffff">Aura ANC Studio Hi-Fi</text>
        <text x="20" y="330" font-size="12" font-weight="400" fill="#94a3b8">Bespoke planar drivers, Grade 5 titanium chassis</text>

        <!-- Pricing & Add to Cart -->
        <text x="20" y="372" font-size="26" font-weight="900" fill="#34d399">$590.00</text>
        <text x="135" y="372" font-size="15" font-weight="500" fill="#64748b" text-decoration="line-through">$690.00</text>

        <rect x="20" y="396" width="370" height="46" rx="10" fill="#10b981" />
        <text x="205" y="424" font-size="13" font-weight="800" fill="#062217" text-anchor="middle">ADD TO CART • INSTANT DISPATCH</text>

        <!-- Finishes pills -->
        <g transform="translate(20, 460)">
          <text x="0" y="16" font-size="10" font-weight="600" fill="#64748b">COLORWAYS:</text>
          <circle cx="88" cy="12" r="8" fill="#18181b" stroke="#ffffff" stroke-width="1.5" />
          <circle cx="112" cy="12" r="8" fill="#94a3b8" />
          <circle cx="136" cy="12" r="8" fill="#d97706" />
        </g>
      </g>

      <!-- Cart Drawer Overlay on Right -->
      <g transform="translate(460, 66)" filter="url(#shadowHeavy)">
        <rect x="0" y="0" width="270" height="520" rx="16" fill="#0f1320" stroke="#10b981" stroke-opacity="0.5" stroke-width="1.5" />
        <rect x="0" y="0" width="270" height="42" rx="16" fill="#14192b" />
        <text x="20" y="26" font-size="12" font-weight="700" fill="#ffffff">YOUR BAG (2 ITEMS)</text>
        <text x="236" y="26" font-size="12" font-weight="700" fill="#64748b">✕</text>

        <!-- Cart Item 1 -->
        <g transform="translate(16, 60)">
          <rect x="0" y="0" width="238" height="74" rx="8" fill="#171d30" />
          <rect x="8" y="8" width="58" height="58" rx="6" fill="#0c0f18" />
          <text x="76" y="28" font-size="11" font-weight="700" fill="#ffffff">Aura ANC Studio</text>
          <text x="76" y="46" font-size="10" font-weight="500" fill="#94a3b8">Space Black • Qty 1</text>
          <text x="76" y="62" font-size="12" font-weight="800" fill="#34d399">$590.00</text>
        </g>

        <!-- Cart Item 2 -->
        <g transform="translate(16, 146)">
          <rect x="0" y="0" width="238" height="74" rx="8" fill="#171d30" />
          <rect x="8" y="8" width="58" height="58" rx="6" fill="#0c0f18" />
          <text x="76" y="28" font-size="11" font-weight="700" fill="#ffffff">Chrono-X Titanium</text>
          <text x="76" y="46" font-size="10" font-weight="500" fill="#94a3b8">Obsidian • Qty 1</text>
          <text x="76" y="62" font-size="12" font-weight="800" fill="#34d399">$830.00</text>
        </g>

        <!-- Promo Code Pill -->
        <g transform="translate(16, 236)">
          <rect x="0" y="0" width="238" height="38" rx="8" fill="#0b101d" stroke="#10b981" stroke-opacity="0.3" stroke-width="1" />
          <text x="14" y="24" font-size="10" font-family="'JetBrains Mono', monospace" fill="#34d399">PROMO: PRO2026 (-10%)</text>
        </g>

        <!-- Subtotal calculation -->
        <g transform="translate(20, 296)">
          <text x="0" y="16" font-size="11" font-weight="500" fill="#94a3b8">Subtotal</text>
          <text x="230" y="16" font-size="11" font-weight="700" fill="#ffffff" text-anchor="end">$1,420.00</text>

          <text x="0" y="38" font-size="11" font-weight="500" fill="#34d399">PRO2026 Discount</text>
          <text x="230" y="38" font-size="11" font-weight="700" fill="#34d399" text-anchor="end">-$142.00</text>

          <line x1="0" y1="52" x2="230" y2="52" stroke="#1e293b" stroke-width="1" />

          <text x="0" y="74" font-size="14" font-weight="800" fill="#ffffff">Total</text>
          <text x="230" y="74" font-size="18" font-weight="900" fill="#34d399" text-anchor="end">$1,278.00</text>
        </g>

        <!-- Checkout Button -->
        <rect x="16" y="440" width="238" height="48" rx="10" fill="#10b981" />
        <text x="135" y="470" font-size="13" font-weight="800" fill="#052216" text-anchor="middle">CHECKOUT NOW ➔</text>
      </g>
    </g>
  </svg>
  `;
}

// 3. NEXAUTH IDENTITY
function renderNexAuth() {
  const accent = "#e2e8f0";
  const sec = "#94a3b8";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="200" height="28" rx="14" fill="#18181b" stroke="#71717a" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#fafafa" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#f4f4f5" letter-spacing="1.5">MINIMALIST // AUTH SUITE</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">NEXAUTH IDENTITY</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#a1a1aa" letter-spacing="-1.5">BIOMETRIC &amp; 2FA</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Iconic shadcn/ui inspired authentication architecture.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Google &amp; GitHub OAuth, 6-digit OTP verification &amp; dark/light parity.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#121215" stroke="#27272a" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#71717a">VERIFICATION</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#fafafa">6-DIGIT OTP</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#121215" stroke="#27272a" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#71717a">SOCIAL</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#fafafa">OAUTH 2.0</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#121215" stroke="#27272a" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#71717a">CONTRAST</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#71717a">PURE ZINC</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#09090b" stroke="#27272a" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#ffffff" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#e4e4e7">npx nexoreui add template-auth-pro</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#e4e4e7">Zero AI Slop</text>

        <rect x="120" y="0" width="118" height="26" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#e4e4e7">shadcn/ui Craft</text>

        <rect x="246" y="0" width="124" height="26" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1" />
        <text x="256" y="17" font-size="11" font-weight="600" fill="#e4e4e7">Biometric Security</text>
      </g>
    </g>

    <!-- RIGHT AUTH SUITE SHOWCASE -->
    <g transform="translate(560, 68)" filter="url(#shadowHeavy)">
      <!-- Main Container Card -->
      <rect x="0" y="0" width="720" height="630" rx="18" fill="#0c0d12" stroke="#27272a" stroke-width="1.5" />
      <rect x="0" y="0" width="720" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Split Layout: Left decorative quotes, Right 2FA / Login flow -->
      <!-- Left side quote bar -->
      <g transform="translate(24, 24)">
        <rect x="0" y="0" width="260" height="582" rx="12" fill="#12131a" stroke="#1f212a" stroke-width="1" />
        <circle cx="34" cy="36" r="12" fill="#27272a" />
        <text x="34" y="40" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">NX</text>
        <text x="56" y="40" font-size="14" font-weight="800" fill="#ffffff">Nexore Inc.</text>

        <!-- Quote -->
        <text x="24" y="240" font-size="13" font-weight="400" fill="#a1a1aa" line-height="1.6">
          <tspan x="24" dy="0">“This authentication suite</tspan>
          <tspan x="24" dy="22">eliminated days of boilerplate.</tspan>
          <tspan x="24" dy="22">Pure typographic elegance</tspan>
          <tspan x="24" dy="22">and rock-solid security.”</tspan>
        </text>

        <text x="24" y="360" font-size="12" font-weight="700" fill="#ffffff">Sofia Chen</text>
        <text x="24" y="378" font-size="11" font-weight="400" fill="#71717a">VP Engineering at Vektor</text>
      </g>

      <!-- Right Side 2FA OTP Card -->
      <g transform="translate(310, 48)">
        <!-- Security Shield Icon -->
        <circle cx="190" cy="50" r="32" fill="#181922" stroke="#27272a" stroke-width="1.5" />
        <path d="M 190 32 L 206 38 L 206 52 C 206 63 190 71 190 71 C 190 71 174 63 174 52 L 174 38 Z" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-width="2" />
        <circle cx="190" cy="50" r="4" fill="#ffffff" />

        <text x="190" y="112" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">Two-Factor Authentication</text>
        <text x="190" y="134" font-size="12" font-weight="400" fill="#71717a" text-anchor="middle">Enter the 6-digit code sent to your authenticator</text>

        <!-- 6 OTP Input Boxes -->
        <g transform="translate(18, 168)">
          <!-- Box 1 -->
          <rect x="0" y="0" width="50" height="58" rx="8" fill="#12131a" stroke="#ffffff" stroke-opacity="0.8" stroke-width="1.5" />
          <text x="25" y="38" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">7</text>

          <!-- Box 2 -->
          <rect x="60" y="0" width="50" height="58" rx="8" fill="#12131a" stroke="#27272a" stroke-width="1" />
          <text x="85" y="38" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">4</text>

          <!-- Box 3 -->
          <rect x="120" y="0" width="50" height="58" rx="8" fill="#12131a" stroke="#27272a" stroke-width="1" />
          <text x="145" y="38" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">2</text>

          <!-- Box 4 -->
          <rect x="180" y="0" width="50" height="58" rx="8" fill="#12131a" stroke="#27272a" stroke-width="1" />
          <text x="205" y="38" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">9</text>

          <!-- Box 5 -->
          <rect x="240" y="0" width="50" height="58" rx="8" fill="#12131a" stroke="#27272a" stroke-width="1" />
          <text x="265" y="38" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">0</text>

          <!-- Box 6 -->
          <rect x="300" y="0" width="50" height="58" rx="8" fill="#12131a" stroke="#27272a" stroke-width="1" />
          <text x="325" y="38" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">1</text>
        </g>

        <!-- Submit Button -->
        <rect x="18" y="254" width="350" height="44" rx="8" fill="#ffffff" />
        <text x="193" y="281" font-size="13" font-weight="800" fill="#09090b" text-anchor="middle">VERIFY IDENTITY ➔</text>

        <!-- Divider -->
        <line x1="18" y1="324" x2="368" y2="324" stroke="#27272a" stroke-width="1" />
        <rect x="156" y="314" width="70" height="20" rx="4" fill="#0c0d12" />
        <text x="191" y="328" font-size="10" font-weight="600" fill="#71717a" text-anchor="middle">OR CONTINUE</text>

        <!-- OAuth Providers -->
        <g transform="translate(18, 354)">
          <rect x="0" y="0" width="170" height="40" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1" />
          <circle cx="28" cy="20" r="7" fill="#ffffff" />
          <text x="44" y="25" font-size="12" font-weight="600" fill="#ffffff">Google</text>

          <rect x="180" y="0" width="170" height="40" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1" />
          <circle cx="208" cy="20" r="7" fill="#ffffff" />
          <text x="224" y="25" font-size="12" font-weight="600" fill="#ffffff">GitHub</text>
        </g>
      </g>
    </g>
  </svg>
  `;
}

// 4. NEXCORE ADMIN
function renderNexCoreAdmin() {
  const accent = "#6366f1";
  const sec = "#8b5cf6";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="200" height="28" rx="14" fill="#1e1b4b" stroke="#6366f1" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#818cf8" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#c7d2fe" letter-spacing="1.5">PRO FLAGSHIP // DASHBOARD</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">NEXCORE MATRIX</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#818cf8" letter-spacing="-1.5">ADMIN COCKPIT</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Executive SaaS enterprise operations &amp; live KPI metrics hub.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Dynamic multi-page routing, interactive charts &amp; SVG tooltips.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#64748b">ANNUAL ARR</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#818cf8">$2.84M</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#64748b">NET EXPANSION</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#4ade80">+34.8%</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#64748b">PAGES</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#ffffff">5 SUITES</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#0a0e17" stroke="#1e293b" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#818cf8" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#cbd5e1">npx nexoreui add template-nexcore-admin-pro</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#1e1b4b" stroke="#312e81" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#a5b4fc">SVG Sparklines</text>

        <rect x="120" y="0" width="128" height="26" rx="6" fill="#1e1b4b" stroke="#312e81" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#a5b4fc">Multi-Page Routing</text>

        <rect x="256" y="0" width="124" height="26" rx="6" fill="#1e1b4b" stroke="#312e81" stroke-width="1" />
        <text x="266" y="17" font-size="11" font-weight="600" fill="#a5b4fc">Responsive Drawer</text>
      </g>
    </g>

    <!-- RIGHT DASHBOARD COCKPIT SHOWCASE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Container Card -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Top Nav -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111420" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">admin.nexore.dev • Executive Operations Hub</text>

      <!-- KPI Metric Row -->
      <g transform="translate(26, 64)">
        <!-- Card 1 -->
        <rect x="0" y="0" width="220" height="106" rx="12" fill="#0f121d" stroke="#252b3e" stroke-width="1" />
        <text x="16" y="28" font-size="11" font-weight="600" fill="#94a3b8">MONTHLY RECURRING (MRR)</text>
        <text x="16" y="62" font-size="24" font-weight="900" fill="#ffffff">$248,500</text>
        <text x="16" y="86" font-size="11" font-weight="700" fill="#4ade80">+14.2% vs last month</text>

        <!-- Card 2 -->
        <rect x="242" y="0" width="220" height="106" rx="12" fill="#0f121d" stroke="#252b3e" stroke-width="1" />
        <text x="258" y="28" font-size="11" font-weight="600" fill="#94a3b8">ACTIVE SEATS</text>
        <text x="258" y="62" font-size="24" font-weight="900" fill="#818cf8">18,420</text>
        <text x="258" y="86" font-size="11" font-weight="700" fill="#4ade80">+8.5% growth</text>

        <!-- Card 3 -->
        <rect x="484" y="0" width="220" height="106" rx="12" fill="#0f121d" stroke="#252b3e" stroke-width="1" />
        <text x="500" y="28" font-size="11" font-weight="600" fill="#94a3b8">SERVER HEALTH</text>
        <text x="500" y="62" font-size="24" font-weight="900" fill="#38bdf8">99.98%</text>
        <text x="500" y="86" font-size="11" font-weight="700" fill="#38bdf8">Zero incidents</text>
      </g>

      <!-- Revenue Analytics Chart -->
      <g transform="translate(26, 190)">
        <rect x="0" y="0" width="704" height="230" rx="14" fill="#0c0e18" stroke="#1f2638" stroke-width="1" />
        <text x="20" y="32" font-size="14" font-weight="800" fill="#ffffff">Revenue Velocity &amp; Cohort Inflow</text>
        <text x="684" y="32" font-size="11" font-weight="600" fill="#818cf8" text-anchor="end">2026 AUDITED</text>

        <!-- Bar chart visual -->
        <g transform="translate(40, 60)">
          <!-- Grid lines -->
          <line x1="0" y1="120" x2="620" y2="120" stroke="#1e2436" stroke-width="1" />
          <line x1="0" y1="80" x2="620" y2="80" stroke="#1e2436" stroke-width="1" />
          <line x1="0" y1="40" x2="620" y2="40" stroke="#1e2436" stroke-width="1" />

          <!-- Bars with glow -->
          <!-- Jan -->
          <rect x="20" y="70" width="36" height="50" rx="6" fill="#312e81" />
          <text x="38" y="140" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">JAN</text>

          <!-- Feb -->
          <rect x="80" y="55" width="36" height="65" rx="6" fill="#3730a3" />
          <text x="98" y="140" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">FEB</text>

          <!-- Mar -->
          <rect x="140" y="45" width="36" height="75" rx="6" fill="#4338ca" />
          <text x="158" y="140" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">MAR</text>

          <!-- Apr -->
          <rect x="200" y="30" width="36" height="90" rx="6" fill="#4f46e5" />
          <text x="218" y="140" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">APR</text>

          <!-- May -->
          <rect x="260" y="15" width="36" height="105" rx="6" fill="#6366f1" filter="url(#glowEffect)" />
          <text x="278" y="140" font-size="10" font-weight="700" fill="#818cf8" text-anchor="middle">MAY</text>

          <!-- Jun -->
          <rect x="320" y="5" width="36" height="115" rx="6" fill="#818cf8" filter="url(#glowEffect)" />
          <text x="338" y="140" font-size="10" font-weight="800" fill="#ffffff" text-anchor="middle">JUN</text>

          <!-- Tooltip on peak bar -->
          <rect x="300" y="-24" width="76" height="22" rx="4" fill="#181b2a" stroke="#818cf8" stroke-width="1" />
          <text x="338" y="-9" font-size="10" font-weight="700" fill="#c7d2fe" text-anchor="middle">$428.5K</text>

          <!-- Jul - Dec -->
          <rect x="380" y="20" width="36" height="100" rx="6" fill="#4f46e5" />
          <text x="398" y="140" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">JUL</text>
          <rect x="440" y="35" width="36" height="85" rx="6" fill="#4338ca" />
          <text x="458" y="140" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">AUG</text>
          <rect x="500" y="18" width="36" height="102" rx="6" fill="#4f46e5" />
          <text x="518" y="140" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">SEP</text>
          <rect x="560" y="8" width="36" height="112" rx="6" fill="#6366f1" />
          <text x="578" y="140" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">OCT</text>
        </g>
      </g>

      <!-- Recent Audit Row -->
      <g transform="translate(26, 440)">
        <rect x="0" y="0" width="704" height="150" rx="14" fill="#0c0e18" stroke="#1f2638" stroke-width="1" />
        <text x="20" y="28" font-size="12" font-weight="700" fill="#ffffff">LIVE AUDIT ACTIVITY STREAM</text>

        <!-- Stream row 1 -->
        <g transform="translate(20, 44)">
          <circle cx="8" cy="12" r="4" fill="#4ade80" />
          <text x="24" y="16" font-size="11" font-weight="600" fill="#e2e8f0">Production Cluster scaled to 48 replicas</text>
          <text x="580" y="16" font-size="10" font-weight="500" fill="#64748b">2 mins ago</text>
        </g>

        <!-- Stream row 2 -->
        <g transform="translate(20, 80)">
          <circle cx="8" cy="12" r="4" fill="#818cf8" />
          <text x="24" y="16" font-size="11" font-weight="600" fill="#e2e8f0">Enterprise SSO SAML 2.0 connection verified</text>
          <text x="580" y="16" font-size="10" font-weight="500" fill="#64748b">14 mins ago</text>
        </g>
      </g>
    </g>
  </svg>
  `;
}

// 5. NEXUSERS TABLE
function renderUsersTable() {
  const accent = "#8b5cf6";
  const sec = "#06b6d4";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="210" height="28" rx="14" fill="#1e1333" stroke="#8b5cf6" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#a78bfa" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#ddd6fe" letter-spacing="1.5">PRO FLAGSHIP // DATA TABLE</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">NEXUSERS TABLE</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#a78bfa" letter-spacing="-1.5">ENTERPRISE CRUD</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Production-grade enterprise user directory &amp; bulk dock.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Multi-select checkboxes, slide-over drawer &amp; real CSV export.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#64748b">DIRECTORY</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#a78bfa">24 USERS</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#64748b">ACTIONS</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#38bdf8">BULK DOCK</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#64748b">EXPORT</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#ffffff">RFC CSV</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#0a0e17" stroke="#1e293b" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#a78bfa" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#cbd5e1">npx nexoreui add template-users-table-pro</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#1e1333" stroke="#2e1a4d" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#c4b5fd">Slide-Over Drawer</text>

        <rect x="120" y="0" width="124" height="26" rx="6" fill="#1e1333" stroke="#2e1a4d" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#c4b5fd">Multi-Column Sort</text>

        <rect x="252" y="0" width="118" height="26" rx="6" fill="#1e1333" stroke="#2e1a4d" stroke-width="1" />
        <text x="262" y="17" font-size="11" font-weight="600" fill="#c4b5fd">Live Search Filter</text>
      </g>
    </g>

    <!-- RIGHT DATA TABLE SHOWCASE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Container Card -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Top Nav -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111420" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">directory.nexore.dev • Members &amp; Roles</text>

      <!-- Table Search & Filter Bar -->
      <g transform="translate(24, 64)">
        <rect x="0" y="0" width="280" height="38" rx="8" fill="#0d101b" stroke="#23283c" stroke-width="1" />
        <text x="14" y="24" font-size="11" font-weight="400" fill="#94a3b8">Search by name, role, email...</text>

        <!-- Add User Button -->
        <rect x="572" y="0" width="140" height="38" rx="8" fill="#8b5cf6" />
        <text x="642" y="24" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">+ ADD MEMBER</text>
      </g>

      <!-- Data Table Component -->
      <g transform="translate(24, 120)">
        <!-- Header Row -->
        <rect x="0" y="0" width="712" height="36" rx="6" fill="#141828" stroke="#1f253d" stroke-width="1" />
        <rect x="14" y="11" width="14" height="14" rx="3" fill="#8b5cf6" />
        <text x="46" y="23" font-size="11" font-weight="700" fill="#94a3b8">MEMBER</text>
        <text x="240" y="23" font-size="11" font-weight="700" fill="#94a3b8">ROLE &amp; DEPT</text>
        <text x="420" y="23" font-size="11" font-weight="700" fill="#94a3b8">STATUS</text>
        <text x="560" y="23" font-size="11" font-weight="700" fill="#94a3b8">SECURITY</text>

        <!-- Row 1 -->
        <g transform="translate(0, 44)">
          <rect x="0" y="0" width="712" height="60" rx="8" fill="#0c0e18" stroke="#1a2034" stroke-width="1" />
          <rect x="14" y="23" width="14" height="14" rx="3" fill="#8b5cf6" />
          <circle cx="56" cy="30" r="15" fill="#312e81" stroke="#8b5cf6" stroke-width="1.5" />
          <text x="56" y="34" font-size="11" font-weight="800" fill="#c4b5fd" text-anchor="middle">AK</text>
          <text x="82" y="27" font-size="13" font-weight="700" fill="#ffffff">Aria Kozlov</text>
          <text x="82" y="43" font-size="11" font-weight="400" fill="#64748b">aria@nexore.dev</text>

          <text x="240" y="27" font-size="12" font-weight="600" fill="#e2e8f0">Principal Architect</text>
          <text x="240" y="43" font-size="11" font-weight="400" fill="#64748b">Engineering</text>

          <rect x="420" y="20" width="68" height="22" rx="4" fill="#064e3b" />
          <text x="454" y="35" font-size="10" font-weight="700" fill="#34d399" text-anchor="middle">ACTIVE</text>

          <text x="560" y="35" font-size="11" font-weight="600" fill="#38bdf8">2FA Verified</text>
        </g>

        <!-- Row 2 -->
        <g transform="translate(0, 112)">
          <rect x="0" y="0" width="712" height="60" rx="8" fill="#0c0e18" stroke="#1a2034" stroke-width="1" />
          <rect x="14" y="23" width="14" height="14" rx="3" fill="#8b5cf6" />
          <circle cx="56" cy="30" r="15" fill="#4c1d95" stroke="#a78bfa" stroke-width="1.5" />
          <text x="56" y="34" font-size="11" font-weight="800" fill="#ddd6fe" text-anchor="middle">MN</text>
          <text x="82" y="27" font-size="13" font-weight="700" fill="#ffffff">Marcus Vance</text>
          <text x="82" y="43" font-size="11" font-weight="400" fill="#64748b">marcus@nexore.dev</text>

          <text x="240" y="27" font-size="12" font-weight="600" fill="#e2e8f0">Staff Design Engineer</text>
          <text x="240" y="43" font-size="11" font-weight="400" fill="#64748b">Product Craft</text>

          <rect x="420" y="20" width="68" height="22" rx="4" fill="#064e3b" />
          <text x="454" y="35" font-size="10" font-weight="700" fill="#34d399" text-anchor="middle">ACTIVE</text>

          <text x="560" y="35" font-size="11" font-weight="600" fill="#38bdf8">Hardware Key</text>
        </g>

        <!-- Row 3 -->
        <g transform="translate(0, 180)">
          <rect x="0" y="0" width="712" height="60" rx="8" fill="#0c0e18" stroke="#1a2034" stroke-width="1" />
          <rect x="14" y="23" width="14" height="14" rx="3" fill="#8b5cf6" />
          <circle cx="56" cy="30" r="15" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" />
          <text x="56" y="34" font-size="11" font-weight="800" fill="#c7d2fe" text-anchor="middle">EL</text>
          <text x="82" y="27" font-size="13" font-weight="700" fill="#ffffff">Elena Rostova</text>
          <text x="82" y="43" font-size="11" font-weight="400" fill="#64748b">elena@nexore.dev</text>

          <text x="240" y="27" font-size="12" font-weight="600" fill="#e2e8f0">Security Officer</text>
          <text x="240" y="43" font-size="11" font-weight="400" fill="#64748b">SecOps</text>

          <rect x="420" y="20" width="68" height="22" rx="4" fill="#064e3b" />
          <text x="454" y="35" font-size="10" font-weight="700" fill="#34d399" text-anchor="middle">ACTIVE</text>

          <text x="560" y="35" font-size="11" font-weight="600" fill="#38bdf8">Biometric Enrolled</text>
        </g>
      </g>

      <!-- Floating Sticky Bulk Actions Dock -->
      <g transform="translate(140, 520)" filter="url(#shadowHeavy)">
        <rect x="0" y="0" width="480" height="52" rx="14" fill="#121626" stroke="#8b5cf6" stroke-opacity="0.7" stroke-width="1.5" />
        <rect x="0" y="0" width="480" height="1" fill="#ffffff" fill-opacity="0.4" rx="1" />

        <text x="20" y="31" font-size="12" font-weight="800" fill="#a78bfa">3 SELECTED</text>

        <rect x="120" y="10" width="94" height="32" rx="8" fill="#1e253c" stroke="#333e60" stroke-width="1" />
        <text x="167" y="30" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">ACTIVATE</text>

        <rect x="224" y="10" width="94" height="32" rx="8" fill="#1e253c" stroke="#333e60" stroke-width="1" />
        <text x="271" y="30" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">SUSPEND</text>

        <rect x="328" y="10" width="136" height="32" rx="8" fill="#8b5cf6" />
        <text x="396" y="30" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">EXPORT CSV ⭳</text>
      </g>
    </g>
  </svg>
  `;
}

// 6. SWAGGER FORM BUILDER
function renderSwaggerForm() {
  const accent = "#3b82f6";
  const sec = "#10b981";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="190" height="28" rx="14" fill="#172554" stroke="#3b82f6" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#60a5fa" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#93c5fd" letter-spacing="1.5">PRO TOOL // FORM STUDIO</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">SWAGGER FORM</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#60a5fa" letter-spacing="-1.5">OPENAPI TO ZOD</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Convert OpenAPI 3 / Swagger specs into React Hook Form.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Zod schema validation, live preview testing &amp; cURL code export.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#64748b">OPENAPI</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#60a5fa">SPEC 3.0</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#64748b">VALIDATOR</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#4ade80">ZOD 4.0</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#64748b">DEREF</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#ffffff">CLIENT $REF</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#0a0e17" stroke="#1e293b" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#60a5fa" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#cbd5e1">npx nexoreui add template-swagger-form-builder</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#172554" stroke="#1e3a8a" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#93c5fd">React Hook Form</text>

        <rect x="120" y="0" width="118" height="26" rx="6" fill="#172554" stroke="#1e3a8a" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#93c5fd">Dynamic Reorder</text>

        <rect x="246" y="0" width="124" height="26" rx="6" fill="#172554" stroke="#1e3a8a" stroke-width="1" />
        <text x="256" y="17" font-size="11" font-weight="600" fill="#93c5fd">Clean Code Export</text>
      </g>
    </g>

    <!-- RIGHT BUILDER SHOWCASE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Container Card -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Top Nav -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111420" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">swagger.nexore.dev • OpenAPI Spec to Form</text>

      <!-- Split Studio: Left Spec snippet, Right generated form -->
      <!-- Left Spec Box -->
      <g transform="translate(24, 64)">
        <rect x="0" y="0" width="340" height="520" rx="12" fill="#0a0d16" stroke="#1c253c" stroke-width="1" />
        <rect x="0" y="0" width="340" height="34" rx="12" fill="#0f1422" />
        <text x="16" y="22" font-size="11" font-family="'JetBrains Mono', monospace" fill="#64748b">schema-spec.yaml</text>
        <rect x="250" y="6" width="74" height="22" rx="4" fill="#1e3a8a" />
        <text x="287" y="20" font-size="10" font-weight="700" fill="#93c5fd" text-anchor="middle">POST 200</text>

        <!-- Code syntax lines -->
        <g transform="translate(16, 50)" font-family="'JetBrains Mono', monospace" font-size="11">
          <text y="20" fill="#60a5fa">/api/v1/checkout:</text>
          <text y="42" fill="#94a3b8">  post:</text>
          <text y="64" fill="#94a3b8">    summary: Process Card</text>
          <text y="86" fill="#94a3b8">    requestBody:</text>
          <text y="108" fill="#f472b6">      schema:</text>
          <text y="130" fill="#c084fc">        fullName:</text>
          <text y="152" fill="#cbd5e1">          type: string</text>
          <text y="174" fill="#cbd5e1">          minLength: 3</text>
          <text y="196" fill="#c084fc">        cardEmail:</text>
          <text y="218" fill="#cbd5e1">          type: string</text>
          <text y="240" fill="#cbd5e1">          format: email</text>
          <text y="262" fill="#c084fc">        billingZip:</text>
          <text y="284" fill="#cbd5e1">          type: integer</text>
        </g>
      </g>

      <!-- Right Generated Form Box -->
      <g transform="translate(390, 64)">
        <rect x="0" y="0" width="346" height="520" rx="12" fill="#0d111d" stroke="#1f2842" stroke-width="1" />
        <rect x="0" y="0" width="346" height="34" rx="12" fill="#13192c" />
        <text x="16" y="22" font-size="11" font-weight="700" fill="#ffffff">GENERATED ZOD FORM</text>
        <rect x="260" y="6" width="70" height="22" rx="4" fill="#064e3b" />
        <text x="295" y="20" font-size="10" font-weight="700" fill="#4ade80" text-anchor="middle">VALIDATED</text>

        <!-- Form fields -->
        <g transform="translate(18, 56)">
          <!-- Field 1 -->
          <text x="0" y="16" font-size="11" font-weight="700" fill="#cbd5e1">Full Name *</text>
          <rect x="0" y="26" width="310" height="40" rx="8" fill="#080b12" stroke="#25304e" stroke-width="1" />
          <text x="14" y="51" font-size="12" font-weight="500" fill="#ffffff">Alexander Wright</text>

          <!-- Field 2 with Valid Badge -->
          <text x="0" y="92" font-size="11" font-weight="700" fill="#cbd5e1">Card Email *</text>
          <rect x="0" y="102" width="310" height="40" rx="8" fill="#080b12" stroke="#10b981" stroke-width="1.2" />
          <text x="14" y="127" font-size="12" font-weight="500" fill="#ffffff">alex@wright-aerospace.com</text>
          <circle cx="290" cy="122" r="7" fill="#10b981" />
          <path d="M 287 122 L 289 124 L 293 120" stroke="#052216" stroke-width="1.5" fill="none" />

          <!-- Field 3 -->
          <text x="0" y="168" font-size="11" font-weight="700" fill="#cbd5e1">Billing Zip Code *</text>
          <rect x="0" y="178" width="310" height="40" rx="8" fill="#080b12" stroke="#25304e" stroke-width="1" />
          <text x="14" y="203" font-size="12" font-weight="500" fill="#ffffff">94107</text>

          <!-- Submit Button -->
          <rect x="0" y="250" width="310" height="44" rx="10" fill="#3b82f6" />
          <text x="155" y="277" font-size="13" font-weight="800" fill="#ffffff" text-anchor="middle">DISPATCH PAYLOAD (POST) ↵</text>
        </g>
      </g>
    </g>
  </svg>
  `;
}

// 7. NEXFOLIO PORTFOLIO
function renderNexFolio() {
  const accent = "#ffffff";
  const sec = "#71717a";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="220" height="28" rx="14" fill="#18181b" stroke="#52525b" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#ffffff" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#f4f4f5" letter-spacing="1.5">MINIMALIST // PORTFOLIO</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">NEXFOLIO ATELIER</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#71717a" letter-spacing="-1.5">SWISS RATIONALISM</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Swiss rationalist engineer &amp; creative technologist showcase.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Interactive case studies, career matrix &amp; live Zurich clock.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#121215" stroke="#27272a" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#71717a">TIMEZONE</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#ffffff">ZRH 14:03</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#121215" stroke="#27272a" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#71717a">CASE STUDIES</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#ffffff">6 CURATED</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#121215" stroke="#27272a" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#71717a">AESTHETIC</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#a1a1aa">DIETER RAMS</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#09090b" stroke="#27272a" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#ffffff" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#e4e4e7">npx nexoreui add template-portfolio-pro</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#e4e4e7">Zero Vibe-Code</text>

        <rect x="120" y="0" width="128" height="26" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#e4e4e7">Zurich UTC Clock</text>

        <rect x="256" y="0" width="124" height="26" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1" />
        <text x="266" y="17" font-size="11" font-weight="600" fill="#e4e4e7">Metric Highlights</text>
      </g>
    </g>

    <!-- RIGHT PORTFOLIO VITRINE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Container Card -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="#0c0d12" stroke="#27272a" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Top Nav -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111218" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#71717a" text-anchor="middle">folio.nexore.dev • Staff Design Engineer</text>

      <!-- Portfolio Grid Content -->
      <g transform="translate(30, 68)">
        <!-- Hero Tagline within card -->
        <text x="0" y="28" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="-0.8">ENGINEERING AT THE SPEED OF THOUGHT</text>
        <text x="0" y="52" font-size="13" font-weight="400" fill="#71717a">Designing high-craft web systems, compilers &amp; spatial interfaces in Zurich, Switzerland.</text>

        <!-- Case Study 1 -->
        <g transform="translate(0, 80)">
          <rect x="0" y="0" width="338" height="240" rx="12" fill="#14141c" stroke="#262633" stroke-width="1" />
          <rect x="12" y="12" width="314" height="130" rx="8" fill="#1c1c27" />
          <text x="24" y="38" font-size="11" font-weight="700" fill="#a1a1aa">CASE STUDY 01</text>
          <text x="24" y="80" font-size="20" font-weight="800" fill="#ffffff">Krypton L2 Rollup</text>
          <text x="24" y="102" font-size="12" font-weight="400" fill="#a1a1aa">High-throughput zkEVM explorer</text>

          <text x="24" y="180" font-size="22" font-weight="900" fill="#ffffff">+140%</text>
          <text x="24" y="198" font-size="10" font-weight="600" fill="#71717a">TRANSACTION THROUGHPUT</text>
        </g>

        <!-- Case Study 2 -->
        <g transform="translate(362, 80)">
          <rect x="0" y="0" width="338" height="240" rx="12" fill="#14141c" stroke="#262633" stroke-width="1" />
          <rect x="12" y="12" width="314" height="130" rx="8" fill="#1c1c27" />
          <text x="24" y="38" font-size="11" font-weight="700" fill="#a1a1aa">CASE STUDY 02</text>
          <text x="24" y="80" font-size="20" font-weight="800" fill="#ffffff">Aero Spatial Engine</text>
          <text x="24" y="102" font-size="12" font-weight="400" fill="#a1a1aa">Real-time WebGL photometrics</text>

          <text x="24" y="180" font-size="22" font-weight="900" fill="#ffffff">120 FPS</text>
          <text x="24" y="198" font-size="10" font-weight="600" fill="#71717a">ZERO JANK RENDERING</text>
        </g>

        <!-- Zurich Status Pill -->
        <g transform="translate(0, 350)">
          <rect x="0" y="0" width="700" height="74" rx="12" fill="#121218" stroke="#262633" stroke-width="1" />
          <circle cx="28" cy="37" r="6" fill="#22c55e" />
          <text x="44" y="34" font-size="13" font-weight="700" fill="#ffffff">Available for Select Design Engineering Advisory (Q2 2026)</text>
          <text x="44" y="52" font-size="11" font-weight="500" fill="#71717a">Zurich, Switzerland • UTC+1 • Engagements from $25,000</text>

          <rect x="560" y="18" width="120" height="38" rx="8" fill="#ffffff" />
          <text x="620" y="42" font-size="11" font-weight="800" fill="#09090b" text-anchor="middle">GET IN TOUCH ➔</text>
        </g>
      </g>
    </g>
  </svg>
  `;
}

// 8. VANTR PARTICLE REVEAL
function renderVantrParticle() {
  const accent = "#f59e0b";
  const sec = "#d97706";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="220" height="28" rx="14" fill="#271904" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#fbbf24" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#fde68a" letter-spacing="1.5">INTERACTIVE // CANVAS 2D</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">VANTR KINETIC</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#fbbf24" letter-spacing="-1.5">PARTICLE REVEAL</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Haute techwear interactive editorial particle dispersion canvas.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Hooke's spring relaxation, inverse proximity repulsion &amp; touch tracking.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#64748b">HOOKE SPRING</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#fbbf24">0.07 K</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#64748b">DAMPING</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#ffffff">0.86 FRIC</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#64748b">SAMPLING</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#fbbf24">OFFSCREEN</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#0a0e17" stroke="#1e293b" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#fbbf24" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#cbd5e1">npx nexoreui add template-vantr-particle</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#271904" stroke="#451a03" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#fde68a">120 FPS Fluid</text>

        <rect x="120" y="0" width="124" height="26" rx="6" fill="#271904" stroke="#451a03" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#fde68a">Pointer Repulsion</text>

        <rect x="252" y="0" width="118" height="26" rx="6" fill="#271904" stroke="#451a03" stroke-width="1" />
        <text x="262" y="17" font-size="11" font-weight="600" fill="#fde68a">Tactile Replay</text>
      </g>
    </g>

    <!-- RIGHT KINETIC CANVAS SHOWCASE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Window -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Top Nav -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111420" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">vantr.nexore.dev • Kinetic Particle Chamber</text>

      <!-- Particle Simulation Vector Display -->
      <g transform="translate(30, 64)">
        <rect x="0" y="0" width="700" height="520" rx="14" fill="#05070c" stroke="#1f253a" stroke-width="1" />

        <!-- Repulsion Wave Rings around pointer center (x=350, y=260) -->
        <circle cx="350" cy="260" r="140" fill="none" stroke="#f59e0b" stroke-opacity="0.1" stroke-dasharray="8 8" stroke-width="1" />
        <circle cx="350" cy="260" r="90" fill="none" stroke="#f59e0b" stroke-opacity="0.25" stroke-width="1.5" />
        <circle cx="350" cy="260" r="40" fill="#f59e0b" fill-opacity="0.08" stroke="#f59e0b" stroke-opacity="0.6" stroke-width="2" />
        <circle cx="350" cy="260" r="5" fill="#ffffff" filter="url(#glowEffect)" />

        <!-- Swarm of Gold Particle Nodes with Physics Vectors -->
        <!-- Center cluster dispersing outward -->
        <!-- Ring 1 -->
        <circle cx="280" cy="210" r="3" fill="#fbbf24" /><line x1="280" y1="210" x2="260" y2="190" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="1" />
        <circle cx="420" cy="210" r="3.5" fill="#fde68a" /><line x1="420" y1="210" x2="445" y2="190" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="1" />
        <circle cx="270" cy="300" r="3" fill="#fbbf24" /><line x1="270" y1="300" x2="245" y2="320" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="1" />
        <circle cx="430" cy="310" r="4" fill="#f59e0b" /><line x1="430" y1="310" x2="460" y2="330" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="1" />

        <!-- Outer Scatter Field -->
        <circle cx="210" cy="150" r="2.5" fill="#ffffff" />
        <circle cx="480" cy="140" r="2.5" fill="#fbbf24" />
        <circle cx="170" cy="240" r="3" fill="#f59e0b" />
        <circle cx="520" cy="250" r="3.5" fill="#fde68a" />
        <circle cx="190" cy="360" r="2.5" fill="#fbbf24" />
        <circle cx="500" cy="370" r="3" fill="#ffffff" />
        <circle cx="340" cy="120" r="3" fill="#f59e0b" />
        <circle cx="360" cy="400" r="3" fill="#fbbf24" />

        <!-- More micro-dust particles -->
        <circle cx="140" cy="100" r="1.5" fill="#fbbf24" fill-opacity="0.6" />
        <circle cx="560" cy="110" r="1.5" fill="#ffffff" fill-opacity="0.8" />
        <circle cx="120" cy="420" r="1.5" fill="#f59e0b" fill-opacity="0.5" />
        <circle cx="580" cy="430" r="1.5" fill="#fbbf24" fill-opacity="0.6" />
        <circle cx="300" cy="450" r="2" fill="#ffffff" fill-opacity="0.7" />

        <!-- Telemetry HUD Box -->
        <g transform="translate(24, 24)">
          <rect x="0" y="0" width="230" height="88" rx="8" fill="#0d111d" fill-opacity="0.8" stroke="#252b42" stroke-width="1" />
          <text x="14" y="22" font-size="10" font-family="'JetBrains Mono', monospace" font-weight="700" fill="#fbbf24">VANTR HUD TELEMETRY</text>
          <text x="14" y="42" font-size="11" font-family="'JetBrains Mono', monospace" fill="#94a3b8">Active Particles: 14,200</text>
          <text x="14" y="58" font-size="11" font-family="'JetBrains Mono', monospace" fill="#94a3b8">Spring: 0.07 • Damp: 0.86</text>
          <text x="14" y="74" font-size="11" font-family="'JetBrains Mono', monospace" fill="#4ade80">Proximity Repulsion: ACTIVE</text>
        </g>

        <!-- Replay Trigger Button -->
        <g transform="translate(540, 24)">
          <rect x="0" y="0" width="136" height="36" rx="8" fill="#f59e0b" />
          <text x="68" y="23" font-size="11" font-weight="800" fill="#080c14" text-anchor="middle">↺ REPLAY SCATTER</text>
        </g>
      </g>
    </g>
  </svg>
  `;
}

// 9. VAPOR OBSIDIAN
function renderVaporObsidian() {
  const accent = "#06b6d4";
  const sec = "#0284c7";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="220" height="28" rx="14" fill="#082836" stroke="#06b6d4" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#22d3ee" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#a5f3fc" letter-spacing="1.5">PRO FLAGSHIP // LUXURY OPTICS</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">VAPOR OBSIDIAN</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#22d3ee" letter-spacing="-1.5">CONDENSATION ATELIER</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Haute optical eyewear vitrine with instant frosted glass wipe physics.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Web Audio noir club atmospheric synthesizer &amp; diopter calibration.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#64748b">WIPE PHYSICS</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#22d3ee">ZERO-LAG</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#64748b">AUDIO SYNTH</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#ffffff">NOIR CLUB</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#64748b">MATERIAL</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#22d3ee">TITANIUM</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#0a0e17" stroke="#1e293b" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#22d3ee" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#cbd5e1">npx nexoreui add template-vapor-obsidian</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#082836" stroke="#0e7490" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#67e8f9">Frosted Glass</text>

        <rect x="120" y="0" width="124" height="26" rx="6" fill="#082836" stroke="#0e7490" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#67e8f9">Diopter Calibration</text>

        <rect x="252" y="0" width="118" height="26" rx="6" fill="#082836" stroke="#0e7490" stroke-width="1" />
        <text x="262" y="17" font-size="11" font-weight="600" fill="#67e8f9">Web Audio Noir</text>
      </g>
    </g>

    <!-- RIGHT CONDENSATION CHAMBER SHOWCASE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Window -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Top Nav -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111420" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">vapor.nexore.dev • Nocturnal Optics Vitrine</text>

      <!-- Glass Condensation Chamber Visual -->
      <g transform="translate(30, 64)">
        <rect x="0" y="0" width="700" height="520" rx="14" fill="#080c14" stroke="#172236" stroke-width="1" />

        <!-- Frosted Fog backdrop -->
        <rect x="0" y="0" width="700" height="520" rx="14" fill="#0e1b29" fill-opacity="0.6" />

        <!-- Clear Circular Aperture (Cursor wipe effect) -->
        <circle cx="350" cy="240" r="160" fill="#05080f" stroke="#22d3ee" stroke-opacity="0.5" stroke-width="2" />
        <circle cx="350" cy="240" r="160" fill="url(#ambientGlow)" />

        <!-- Eyewear Silhouette Vector -->
        <g transform="translate(200, 190)">
          <!-- Left Lens Frame -->
          <rect x="0" y="0" width="130" height="90" rx="24" fill="#0b101c" stroke="#22d3ee" stroke-width="3" />
          <rect x="15" y="15" width="100" height="60" rx="16" fill="#0e1726" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1" />

          <!-- Bridge -->
          <path d="M 130 35 Q 150 25 170 35" fill="none" stroke="#22d3ee" stroke-width="4" stroke-linecap="round" />

          <!-- Right Lens Frame -->
          <rect x="170" y="0" width="130" height="90" rx="24" fill="#0b101c" stroke="#22d3ee" stroke-width="3" />
          <rect x="185" y="15" width="100" height="60" rx="16" fill="#0e1726" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1" />

          <!-- Titanium Temples -->
          <line x1="0" y1="20" x2="-40" y2="10" stroke="#22d3ee" stroke-width="3" />
          <line x1="300" y1="20" x2="340" y2="10" stroke="#22d3ee" stroke-width="3" />
        </g>

        <!-- Wipe Cursor indicator -->
        <circle cx="480" cy="330" r="18" fill="none" stroke="#ffffff" stroke-width="2" />
        <circle cx="480" cy="330" r="4" fill="#ffffff" filter="url(#glowEffect)" />
        <text x="508" y="334" font-size="11" font-weight="700" fill="#ffffff">WIPED CLEAR (TOUCH)</text>

        <!-- Telemetry bottom bar -->
        <g transform="translate(24, 430)">
          <rect x="0" y="0" width="652" height="64" rx="10" fill="#0c121e" stroke="#1f2c44" stroke-width="1" />
          <text x="24" y="28" font-size="11" font-weight="700" fill="#22d3ee">REFRACTIVE INDEX: nD 1.586</text>
          <text x="24" y="48" font-size="10" font-weight="500" fill="#94a3b8">Matte Obsidian Aero-Titanium • UV400 Glare Suppression</text>

          <text x="440" y="28" font-size="11" font-weight="700" fill="#ffffff">DIOPTER: -2.50 SPH</text>
          <text x="440" y="48" font-size="10" font-weight="500" fill="#94a3b8">Pupillary Distance: 63.5 mm</text>
        </g>
      </g>
    </g>
  </svg>
  `;
}

// 10. FERRARI NOCTURNE
function renderFerrariNocturne() {
  const accent = "#ef4444";
  const sec = "#991b1b";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="220" height="28" rx="14" fill="#2e0a0a" stroke="#ef4444" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#f87171" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#fca5a5" letter-spacing="1.5">PRO FLAGSHIP // AUTOMOTIVE</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">FERRARI NOCTURNE</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#ef4444" letter-spacing="-1.5">DARK GARAGE ATELIER</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Cinematic hypercar dark garage showcase inspired by Maranello.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Stealth-Xenon headlight toggle, V8 idle rumble audio &amp; active aero.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#64748b">HORSEPOWER</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#ef4444">1,000 CV</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#64748b">ACCELERATION</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#ffffff">2.5s 0-100</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#64748b">V-MAX</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#ef4444">340+ KM/H</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#0a0e17" stroke="#1e293b" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#ef4444" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#cbd5e1">npx nexoreui add template-ferrari-nocturne</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#2e0a0a" stroke="#450a0a" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#fca5a5">Stealth Xenon</text>

        <rect x="120" y="0" width="124" height="26" rx="6" fill="#2e0a0a" stroke="#450a0a" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#fca5a5">V8 Twin-Turbo Audio</text>

        <rect x="252" y="0" width="118" height="26" rx="6" fill="#2e0a0a" stroke="#450a0a" stroke-width="1" />
        <text x="262" y="17" font-size="11" font-weight="600" fill="#fca5a5">Maranello Tailor</text>
      </g>
    </g>

    <!-- RIGHT GARAGE SHOWCASE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Window -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Top Nav -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111420" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">ferrari.nexore.dev • Nocturne Aerodynamics Atelier</text>

      <!-- Garage Stage -->
      <g transform="translate(30, 64)">
        <rect x="0" y="0" width="700" height="520" rx="14" fill="#08090f" stroke="#24151b" stroke-width="1" />

        <!-- Xenon Headlight Beams slicing through darkness -->
        <polygon points="120,240 680,80 680,440" fill="#ffffff" fill-opacity="0.04" />
        <polygon points="120,240 600,160 600,320" fill="#ef4444" fill-opacity="0.08" />

        <!-- Hypercar Silhouette -->
        <g transform="translate(80, 160)">
          <!-- Roofline & Carbon Monocoque -->
          <path d="M 60 140 Q 140 30 320 20 Q 420 20 500 120 L 520 150 L 20 150 Z" fill="#120c10" stroke="#ef4444" stroke-width="2" />
          <!-- Headlight Cluster glowing -->
          <circle cx="64" cy="130" r="14" fill="#ffffff" filter="url(#glowEffect)" />
          <circle cx="64" cy="130" r="6" fill="#ef4444" />
          <line x1="64" y1="130" x2="40" y2="126" stroke="#ffffff" stroke-width="3" />

          <!-- Aerodynamic Downforce Lines -->
          <path d="M 120 70 Q 240 40 400 48" fill="none" stroke="#ef4444" stroke-dasharray="12 8" stroke-width="2" />
          <path d="M 100 90 Q 260 60 440 70" fill="none" stroke="#ef4444" stroke-opacity="0.6" stroke-dasharray="8 6" stroke-width="1.5" />

          <!-- Wheels / Brakes Brembo CCM-R -->
          <circle cx="120" cy="150" r="44" fill="#0a0a0f" stroke="#33333f" stroke-width="4" />
          <circle cx="120" cy="150" r="28" fill="#18181f" stroke="#ef4444" stroke-width="2" />

          <circle cx="440" cy="150" r="44" fill="#0a0a0f" stroke="#33333f" stroke-width="4" />
          <circle cx="440" cy="150" r="28" fill="#18181f" stroke="#ef4444" stroke-width="2" />
        </g>

        <!-- Maranello Telemetry Panel -->
        <g transform="translate(24, 380)">
          <rect x="0" y="0" width="652" height="114" rx="10" fill="#110d14" stroke="#ef4444" stroke-opacity="0.3" stroke-width="1" />
          <text x="24" y="32" font-size="12" font-weight="800" fill="#ffffff">AERODYNAMICS TELEMETRY • DOWNFORCE 390 KG @ 250 KM/H</text>

          <g transform="translate(24, 52)">
            <rect x="0" y="0" width="138" height="42" rx="6" fill="#1a1219" />
            <text x="14" y="18" font-size="9" font-weight="600" fill="#94a3b8">ACTIVE HALO</text>
            <text x="14" y="34" font-size="13" font-weight="800" fill="#ef4444">DEPLOYED</text>

            <rect x="150" y="0" width="138" height="42" rx="6" fill="#1a1219" />
            <text x="164" y="18" font-size="9" font-weight="600" fill="#94a3b8">BRAKE TEMP</text>
            <text x="164" y="34" font-size="13" font-weight="800" fill="#ffffff">412°C CCM-R</text>

            <rect x="300" y="0" width="138" height="42" rx="6" fill="#1a1219" />
            <text x="314" y="18" font-size="9" font-weight="600" fill="#94a3b8">CFD Cd</text>
            <text x="314" y="34" font-size="13" font-weight="800" fill="#ef4444">0.272 COEFFICIENT</text>

            <rect x="450" y="0" width="154" height="42" rx="6" fill="#ef4444" />
            <text x="527" y="26" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">COMMISSION SLOT ➔</text>
          </g>
        </g>
      </g>
    </g>
  </svg>
  `;
}

// 11. CHRONO-X TITANIUM (Bonus)
function renderChronoX() {
  const accent = "#10b981";
  const sec = "#d97706";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="220" height="28" rx="14" fill="#06281e" stroke="#10b981" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#34d399" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#6ee7b7" letter-spacing="1.5">PRO FLAGSHIP // HOROLOGY</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">CHRONO-X TITANIUM</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#34d399" letter-spacing="-1.5">28,800 VPH TOURBILLON</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Cinematic scroll-driven luxury chronograph with exposed tourbillon.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Buttery All-Intra video scrubbing, Apple Pro-Motion interpolation.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#64748b">ESCAPEMENT</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#34d399">28,800 VPH</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#64748b">CASE MATERIAL</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#ffffff">GRADE 5 TI</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#64748b">SCRUB INTERPOLATION</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#34d399">0.22 LERP</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#0a0e17" stroke="#1e293b" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#34d399" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#cbd5e1">npx nexoreui add template-chrono-x-pro</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#06281e" stroke="#064e3b" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#6ee7b7">Scroll 3D Lerp</text>

        <rect x="120" y="0" width="124" height="26" rx="6" fill="#06281e" stroke="#064e3b" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#6ee7b7">Exposed Tourbillon</text>

        <rect x="252" y="0" width="118" height="26" rx="6" fill="#06281e" stroke="#064e3b" stroke-width="1" />
        <text x="262" y="17" font-size="11" font-weight="600" fill="#6ee7b7">Biophotonic PPG</text>
      </g>
    </g>

    <!-- RIGHT WATCH DIAL SHOWCASE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Window -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Top Nav -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111420" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">chronox.nexore.dev • Haute Horlogerie 3D</text>

      <!-- Chronograph Bezel & Tourbillon Dial -->
      <g transform="translate(380, 330)">
        <!-- Outer Titanium Bezel Ring -->
        <circle cx="0" cy="0" r="220" fill="#0a0e17" stroke="#252f44" stroke-width="14" />
        <circle cx="0" cy="0" r="212" fill="none" stroke="#34d399" stroke-opacity="0.3" stroke-width="2" />

        <!-- 60 Tachymeter tick marks -->
        <circle cx="0" cy="0" r="195" fill="none" stroke="#64748b" stroke-dasharray="3 16" stroke-width="3" />

        <!-- Inner Dial -->
        <circle cx="0" cy="0" r="180" fill="#060910" stroke="#1e293b" stroke-width="1" />

        <!-- Exposed Tourbillon at 6 o'clock (cy=70) -->
        <circle cx="0" cy="70" r="52" fill="#0c121e" stroke="#34d399" stroke-width="2" />
        <circle cx="0" cy="70" r="38" fill="none" stroke="#ffffff" stroke-dasharray="8 8" stroke-width="1.5" />
        <circle cx="0" cy="70" r="16" fill="#34d399" fill-opacity="0.2" stroke="#34d399" stroke-width="2" />
        <line x1="-30" y1="70" x2="30" y2="70" stroke="#fbbf24" stroke-width="2" />
        <line x1="0" y1="40" x2="0" y2="100" stroke="#fbbf24" stroke-width="2" />
        <circle cx="0" cy="70" r="5" fill="#ffffff" filter="url(#glowEffect)" />
        <text x="0" y="136" font-size="9" font-weight="700" fill="#34d399" text-anchor="middle">TOURBILLON 28,800 VPH</text>

        <!-- Chrono Dial at 12 o'clock (cy=-60) -->
        <circle cx="0" cy="-60" r="44" fill="#0c121e" stroke="#252f44" stroke-width="1.5" />
        <line x1="0" y1="-60" x2="18" y2="-82" stroke="#34d399" stroke-width="2" />
        <circle cx="0" cy="-60" r="4" fill="#ffffff" />
        <text x="0" y="-30" font-size="8" font-weight="700" fill="#94a3b8" text-anchor="middle">CHRONO MIN</text>

        <!-- Hands -->
        <!-- Hour Hand -->
        <line x1="0" y1="0" x2="-60" y2="-40" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
        <!-- Minute Hand -->
        <line x1="0" y1="0" x2="80" y2="-80" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
        <!-- Second Hand with emerald tip -->
        <line x1="0" y1="20" x2="0" y2="-150" stroke="#34d399" stroke-width="2" />
        <circle cx="0" cy="-150" r="4" fill="#34d399" filter="url(#glowEffect)" />
        <circle cx="0" cy="0" r="8" fill="#ffffff" />
      </g>
    </g>
  </svg>
  `;
}

// 12. AURA SOUND PRO (Bonus)
function renderAuraSound() {
  const accent = "#f43f5e";
  const sec = "#fb7185";
  return `
  <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
    ${buildBackdrop(accent, sec)}

    <!-- LEFT HERO BRANDING -->
    <g transform="translate(72, 88)">
      <rect x="0" y="0" width="220" height="28" rx="14" fill="#2c0912" stroke="#f43f5e" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="14" cy="14" r="4" fill="#fb7185" />
      <text x="26" y="18" font-size="11" font-weight="700" fill="#fecdd3" letter-spacing="1.5">PRO FLAGSHIP // CONSUMER AUDIO</text>

      <text x="0" y="76" font-size="46" font-weight="900" fill="#ffffff" letter-spacing="-1.5">AURA SOUND PRO</text>
      <text x="0" y="126" font-size="46" font-weight="900" fill="#fb7185" letter-spacing="-1.5">360° SPATIAL HI-FI</text>

      <text x="0" y="165" font-size="15" font-weight="400" fill="#94a3b8">Ultra-luxury consumer audio landing page with video scrubbing.</text>
      <text x="0" y="187" font-size="15" font-weight="400" fill="#64748b">Real-time planar driver inspection, active noise cancelling &amp; pre-order.</text>

      <!-- Stats Grid -->
      <g transform="translate(0, 224)">
        <rect x="0" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="24" font-size="10" font-weight="600" fill="#64748b">DRIVER</text>
        <text x="14" y="48" font-size="18" font-weight="800" fill="#fb7185">40MM PLANAR</text>

        <rect x="142" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="156" y="24" font-size="10" font-weight="600" fill="#64748b">ACOUSTIC FIELD</text>
        <text x="156" y="48" font-size="18" font-weight="800" fill="#ffffff">360° SPATIAL</text>

        <rect x="284" y="0" width="130" height="64" rx="10" fill="#0d111b" stroke="#1e293b" stroke-width="1" />
        <text x="298" y="24" font-size="10" font-weight="600" fill="#64748b">BATTERY</text>
        <text x="298" y="48" font-size="18" font-weight="800" fill="#fb7185">42H ANC ON</text>
      </g>

      <!-- CLI Install -->
      <g transform="translate(0, 316)">
        <rect x="0" y="0" width="414" height="42" rx="10" fill="#0a0e17" stroke="#1e293b" stroke-width="1" />
        <circle cx="18" cy="21" r="3" fill="#fb7185" />
        <text x="32" y="26" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#cbd5e1">npx nexoreui add template-aura-sound-pro</text>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 386)">
        <rect x="0" y="0" width="112" height="26" rx="6" fill="#2c0912" stroke="#4c0519" stroke-width="1" />
        <text x="10" y="17" font-size="11" font-weight="600" fill="#fecdd3">Planar Drivers</text>

        <rect x="120" y="0" width="124" height="26" rx="6" fill="#2c0912" stroke="#4c0519" stroke-width="1" />
        <text x="130" y="17" font-size="11" font-weight="600" fill="#fecdd3">Spatial Frequency EQ</text>

        <rect x="252" y="0" width="118" height="26" rx="6" fill="#2c0912" stroke="#4c0519" stroke-width="1" />
        <text x="262" y="17" font-size="11" font-weight="600" fill="#fecdd3">360° Scrubbing</text>
      </g>
    </g>

    <!-- RIGHT ACOUSTIC STAGE SHOWCASE -->
    <g transform="translate(540, 68)" filter="url(#shadowHeavy)">
      <!-- Main Window -->
      <rect x="0" y="0" width="760" height="630" rx="18" fill="url(#glassFill)" stroke="url(#cardBorder)" stroke-width="1.5" />
      <rect x="0" y="0" width="760" height="1.5" fill="#ffffff" fill-opacity="0.3" rx="1" />

      <!-- Top Nav -->
      <rect x="0" y="0" width="760" height="46" rx="18" fill="#111420" />
      <circle cx="24" cy="23" r="5" fill="#ef4444" fill-opacity="0.8" />
      <circle cx="40" cy="23" r="5" fill="#eab308" fill-opacity="0.8" />
      <circle cx="56" cy="23" r="5" fill="#22c55e" fill-opacity="0.8" />
      <text x="380" y="27" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle">sound.nexore.dev • Spatial Acoustics Chamber</text>

      <!-- Equalizer Waveform & Driver Chamber -->
      <g transform="translate(30, 64)">
        <rect x="0" y="0" width="700" height="520" rx="14" fill="#090a12" stroke="#25121c" stroke-width="1" />

        <!-- 360 Acoustic Waves (Concentric elliptical soundfield) -->
        <ellipse cx="350" cy="240" rx="260" ry="170" fill="none" stroke="#f43f5e" stroke-opacity="0.1" stroke-width="1" stroke-dasharray="10 10" />
        <ellipse cx="350" cy="240" rx="190" ry="120" fill="none" stroke="#f43f5e" stroke-opacity="0.25" stroke-width="1.5" />
        <ellipse cx="350" cy="240" rx="120" ry="80" fill="#f43f5e" fill-opacity="0.05" stroke="#f43f5e" stroke-opacity="0.5" stroke-width="2" />

        <!-- Planar Driver Mockup -->
        <g transform="translate(260, 160)">
          <rect x="0" y="0" width="180" height="160" rx="20" fill="#121320" stroke="#f43f5e" stroke-width="2" />
          <circle cx="90" cy="80" r="50" fill="#0a0a14" stroke="#fb7185" stroke-width="3" />
          <circle cx="90" cy="80" r="30" fill="none" stroke="#ffffff" stroke-dasharray="6 6" stroke-width="1.5" />
          <circle cx="90" cy="80" r="10" fill="#f43f5e" filter="url(#glowEffect)" />
        </g>

        <!-- Frequency Equalizer Waveform Bars -->
        <g transform="translate(80, 370)">
          <!-- 24 equalizer frequency columns -->
          ${Array.from({ length: 24 }).map((_, i) => {
            const h = [30, 48, 65, 82, 110, 95, 75, 120, 135, 90, 60, 85, 105, 125, 95, 70, 50, 68, 88, 115, 80, 55, 40, 25][i];
            const x = i * 22;
            const y = 140 - h;
            return `<rect x="${x}" y="${y}" width="12" height="${h}" rx="6" fill="#f43f5e" fill-opacity="${0.4 + (h / 180)}" />`;
          }).join('')}
        </g>

        <!-- Equalizer Telemetry Pill -->
        <g transform="translate(24, 24)">
          <rect x="0" y="0" width="220" height="40" rx="8" fill="#17111b" stroke="#361726" stroke-width="1" />
          <text x="14" y="24" font-size="11" font-weight="700" fill="#fb7185">SPATIAL EQ: ACTIVE (48 kHz)</text>
        </g>
      </g>
    </g>
  </svg>
  `;
}

// Registry mapping ID to generator function & output filename
const PREVIEWS_CONFIG = [
  { id: 'template-ai-chat-interface', file: 'ai-chat-preview.jpg', render: renderAiChat },
  { id: 'template-ecommerce-pro', file: 'nexstore-ecommerce-preview.jpg', render: renderNexStore },
  { id: 'template-auth-pro', file: 'nexauth-preview.jpg', render: renderNexAuth },
  { id: 'template-nexcore-admin-pro', file: 'nexcore-admin-preview.jpg', render: renderNexCoreAdmin },
  { id: 'template-users-table-pro', file: 'users-table-preview.jpg', render: renderUsersTable },
  { id: 'template-swagger-form-builder', file: 'swagger-form-builder-preview.jpg', render: renderSwaggerForm },
  { id: 'template-portfolio-pro', file: 'nexfolio-portfolio-preview.jpg', render: renderNexFolio },
  { id: 'template-vantr-particle', file: 'vantr-particle-preview.jpg', render: renderVantrParticle },
  { id: 'template-vapor-obsidian', file: 'vapor-obsidian-preview.jpg', render: renderVaporObsidian },
  { id: 'template-ferrari-nocturne', file: 'ferrari-nocturne-preview.jpg', render: renderFerrariNocturne },
  { id: 'template-chrono-x-pro', file: 'chrono-x-preview.jpg', render: renderChronoX },
  { id: 'template-aura-sound-pro', file: 'aura-sound-preview.jpg', render: renderAuraSound }
];

async function generateAll() {
  console.log(`Starting generation of ${PREVIEWS_CONFIG.length} bespoke preview images...`);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const item of PREVIEWS_CONFIG) {
    const dest = path.join(OUTPUT_DIR, item.file);
    const svgStr = item.render();
    
    await sharp(Buffer.from(svgStr))
      .jpeg({ quality: 95, progressive: true })
      .toFile(dest);

    const stats = fs.statSync(dest);
    console.log(`✓ Generated ${item.file} (${stats.size} bytes) for ${item.id}`);
  }

  console.log('ALL PREVIEWS GENERATED SUCCESSFULLY!');
}

generateAll().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
