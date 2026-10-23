import { NexoreMakeElement, CanvasSettings } from './types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  elements: NexoreMakeElement[];
  canvasSettings: CanvasSettings;
  tier?: 'free' | 'pro';
}

export const nexoreTemplates: Template[] = [
  // --- EXISTING ---
  {
    id: "template-hero",
    name: "Hero Section",
    description: "A clean hero section with a primary CTA",
    category: "Landing",
    tier: 'free',
    canvasSettings: { width: 1200, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "hero-title", name: "Hero Title", type: "text", content: "Build Faster with NexoreUI", position: { x: 300, y: 150 }, size: { width: 600, height: 80 }, zIndex: 1, styles: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#fff" } },
      { id: "hero-subtitle", name: "Hero Subtitle", type: "text", content: "The ultimate component library for modern web applications.", position: { x: 350, y: 240 }, size: { width: 500, height: 40 }, zIndex: 2, styles: { fontSize: "18px", textAlign: "center", color: "#a1a1aa" } },
      { id: "hero-button", name: "Get Started Button", type: "button", content: "Get Started", variant: "default", sizeVariant: "lg", position: { x: 500, y: 320 }, size: { width: 200, height: 50 }, zIndex: 3, styles: { backgroundColor: "#fafafa", color: "#09090b", borderRadius: "8px", fontWeight: "bold" } }
    ]
  },
  {
    id: "template-login",
    name: "Login Form",
    description: "A clean, modern login form",
    category: "Forms",
    tier: 'free',
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "login-card", name: "Login Card", type: "card", position: { x: 200, y: 100 }, size: { width: 400, height: 400 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "login-title", name: "Login Title", type: "text", content: "Welcome back", position: { x: 230, y: 140 }, size: { width: 340, height: 40 }, zIndex: 2, styles: { fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "#fff" } },
      { id: "login-input-email", name: "Email Input", type: "input", placeholder: "Email Address", position: { x: 240, y: 220 }, size: { width: 320, height: 40 }, zIndex: 3, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "login-input-pwd", name: "Password Input", type: "input", placeholder: "Password", position: { x: 240, y: 280 }, size: { width: 320, height: 40 }, zIndex: 4, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "login-btn", name: "Login Button", type: "button", content: "Sign In", position: { x: 240, y: 360 }, size: { width: 320, height: 40 }, zIndex: 5, styles: { backgroundColor: "#fafafa", color: "#09090b", borderRadius: "6px" } }
    ]
  },
  
  // --- DASHBOARDS ---
  {
    id: "template-stat-card",
    name: "Stat Card",
    description: "Analytics metric card with sparkline",
    category: "Dashboard",
    tier: 'free',
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "st-card", name: "Card", type: "card", position: { x: 150, y: 100 }, size: { width: 300, height: 160 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "st-title", name: "Title", type: "text", content: "Total Revenue", position: { x: 170, y: 120 }, size: { width: 150, height: 20 }, zIndex: 2, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "st-val", name: "Value", type: "text", content: "$45,231.89", position: { x: 170, y: 150 }, size: { width: 200, height: 40 }, zIndex: 3, styles: { color: "#fff", fontSize: "32px", fontWeight: "bold" } },
      { id: "st-badge", name: "Badge", type: "badge", content: "+20.1% from last month", position: { x: 170, y: 200 }, size: { width: 160, height: 24 }, zIndex: 4, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "11px" } }
    ]
  },
  {
    id: "template-data-table",
    name: "Data Table Mock",
    description: "Simple user data list",
    category: "Dashboard",
    tier: 'free',
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "dt-card", name: "Card bg", type: "card", position: { x: 100, y: 100 }, size: { width: 600, height: 350 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "dt-hdr", name: "Header", type: "text", content: "Recent Users", position: { x: 130, y: 120 }, size: { width: 200, height: 30 }, zIndex: 2, styles: { color: "#fff", fontSize: "20px", fontWeight: "bold" } },
      { id: "dt-div1", name: "Divider", type: "divider", position: { x: 100, y: 160 }, size: { width: 600, height: 1 }, zIndex: 3, styles: { backgroundColor: "#27272a" } },
      { id: "dt-user1", name: "User1", type: "avatar", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50", position: { x: 130, y: 180 }, size: { width: 40, height: 40 }, zIndex: 4, styles: {} },
      { id: "dt-u1n", name: "Name", type: "text", content: "Olivia Martin", position: { x: 190, y: 180 }, size: { width: 200, height: 20 }, zIndex: 5, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "dt-u1e", name: "Email", type: "text", content: "olivia@example.com", position: { x: 190, y: 200 }, size: { width: 200, height: 20 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "dt-u1s", name: "Badge", type: "badge", content: "Active", position: { x: 600, y: 190 }, size: { width: 60, height: 24 }, zIndex: 7, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80" } },
      { id: "dt-div2", name: "Divider", type: "divider", position: { x: 100, y: 240 }, size: { width: 600, height: 1 }, zIndex: 8, styles: { backgroundColor: "#27272a" } },
      { id: "dt-user2", name: "User2", type: "avatar", src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50", position: { x: 130, y: 260 }, size: { width: 40, height: 40 }, zIndex: 9, styles: {} },
      { id: "dt-u2n", name: "Name", type: "text", content: "Jackson Lee", position: { x: 190, y: 260 }, size: { width: 200, height: 20 }, zIndex: 10, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "dt-u2e", name: "Email", type: "text", content: "jackson@example.com", position: { x: 190, y: 280 }, size: { width: 200, height: 20 }, zIndex: 11, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "dt-u2s", name: "Badge", type: "badge", content: "Offline", position: { x: 600, y: 270 }, size: { width: 60, height: 24 }, zIndex: 12, styles: { backgroundColor: "rgba(161,161,170,0.1)", color: "#a1a1aa" } }
    ]
  },
  
  // --- E-COMMERCE ---
  {
    id: "template-product-card",
    name: "Product Card",
    description: "Store item with image and price",
    category: "E-commerce",
    tier: 'free',
    canvasSettings: { width: 600, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pc-bg", name: "Card Bg", type: "card", position: { x: 150, y: 50 }, size: { width: 300, height: 450 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pc-img", name: "Image", type: "image", src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", position: { x: 150, y: 50 }, size: { width: 300, height: 250 }, zIndex: 2, styles: { borderRadiusTopLeft: "16px", borderRadiusTopRight: "16px", borderRadiusBottomLeft: "0px", borderRadiusBottomRight: "0px" } },
      { id: "pc-title", name: "Title", type: "text", content: "Nike Air Max 270", position: { x: 170, y: 320 }, size: { width: 260, height: 30 }, zIndex: 3, styles: { color: "#fff", fontSize: "20px", fontWeight: "bold" } },
      { id: "pc-price", name: "Price", type: "text", content: "$150.00", position: { x: 170, y: 350 }, size: { width: 100, height: 25 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "16px" } },
      { id: "pc-btn", name: "Add to Cart", type: "button", content: "Add to Cart", position: { x: 170, y: 400 }, size: { width: 260, height: 40 }, zIndex: 5, styles: { backgroundColor: "#fff", color: "#000", fontWeight: "bold", borderRadius: "8px" } }
    ]
  },
  {
    id: "template-pricing-tier",
    name: "Pricing Tier",
    description: "Subscription pricing plan",
    category: "E-commerce",
    tier: 'free',
    canvasSettings: { width: 600, height: 800, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pr-bg", name: "Bg", type: "card", position: { x: 150, y: 100 }, size: { width: 300, height: 500 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "24px", borderStyle: "solid", borderWidth: "2px", borderColor: "#3f3f46" } },
      { id: "pr-badge", name: "Badge", type: "badge", content: "MOST POPULAR", position: { x: 230, y: 85 }, size: { width: 140, height: 30 }, zIndex: 2, styles: { backgroundColor: "#fafafa", color: "#09090b", borderRadius: "100px", fontWeight: "bold" } },
      { id: "pr-title", name: "Title", type: "text", content: "Pro Plan", position: { x: 180, y: 140 }, size: { width: 240, height: 30 }, zIndex: 3, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold", textAlign: "center" } },
      { id: "pr-price", name: "Price", type: "text", content: "$29/mo", position: { x: 180, y: 180 }, size: { width: 240, height: 40 }, zIndex: 4, styles: { color: "#fff", fontSize: "36px", fontWeight: "bold", textAlign: "center" } },
      { id: "pr-div", name: "Divider", type: "divider", position: { x: 180, y: 240 }, size: { width: 240, height: 1 }, zIndex: 5, styles: { backgroundColor: "#27272a" } },
      { id: "pr-f1", name: "Feature", type: "text", content: "Unlimited Projects", position: { x: 190, y: 270 }, size: { width: 200, height: 25 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "pr-f2", name: "Feature", type: "text", content: "24/7 Support", position: { x: 190, y: 310 }, size: { width: 200, height: 25 }, zIndex: 7, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "pr-f3", name: "Feature", type: "text", content: "Advanced Analytics", position: { x: 190, y: 350 }, size: { width: 200, height: 25 }, zIndex: 8, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "pr-btn", name: "Button", type: "button", content: "Upgrade Now", position: { x: 180, y: 520 }, size: { width: 240, height: 45 }, zIndex: 9, styles: { backgroundColor: "#fafafa", color: "#09090b", borderRadius: "8px", fontWeight: "bold" } }
    ]
  },
  
  // --- LANDING PAGES ---
  {
    id: "template-feature-split",
    name: "Feature Split",
    description: "Text on left, Image on right",
    category: "Landing",
    tier: 'free',
    canvasSettings: { width: 1200, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "fs-title", name: "Title", type: "text", content: "Lightning Fast Performance", position: { x: 150, y: 200 }, size: { width: 400, height: 80 }, zIndex: 1, styles: { fontSize: "36px", fontWeight: "bold", color: "#fff", lineHeight: "1.2" } },
      { id: "fs-desc", name: "Desc", type: "text", content: "Experience unparalleled speed and reliability. Built on Edge network to deliver content milliseconds away from your users.", position: { x: 150, y: 290 }, size: { width: 400, height: 80 }, zIndex: 2, styles: { fontSize: "16px", color: "#a1a1aa", lineHeight: "1.6" } },
      { id: "fs-btn", name: "Btn", type: "button", content: "Learn More", variant: "outline", position: { x: 150, y: 380 }, size: { width: 150, height: 40 }, zIndex: 3, styles: { borderRadius: "6px" } },
      { id: "fs-img", name: "Image", type: "image", src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600", position: { x: 600, y: 150 }, size: { width: 450, height: 300 }, zIndex: 4, styles: { borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } }
    ]
  },
  {
    id: "template-testimonial",
    name: "Testimonial Card",
    description: "Customer review card",
    category: "Landing",
    tier: 'free',
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "t-bg", name: "Bg", type: "card", position: { x: 100, y: 100 }, size: { width: 400, height: 200 }, zIndex: 1, styles: { backgroundColor: "#18181b", borderRadius: "16px", paddingLeft: "24px", paddingTop: "24px" } },
      { id: "t-stars", name: "Rating", type: "rating", value: 5, position: { x: 124, y: 124 }, size: { width: 100, height: 24 }, zIndex: 2, styles: { color: "#eab308", fontSize: "18px" } },
      { id: "t-quote", name: "Quote", type: "text", content: "\"This library saved me hundreds of hours. Highly recommended for any serious frontend team.\"", position: { x: 124, y: 160 }, size: { width: 350, height: 60 }, zIndex: 3, styles: { color: "#fff", fontSize: "16px", fontStyle: "italic" } },
      { id: "t-av", name: "Avatar", type: "avatar", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", position: { x: 124, y: 230 }, size: { width: 40, height: 40 }, zIndex: 4, styles: {} },
      { id: "t-name", name: "Name", type: "text", content: "Emily Chen", position: { x: 180, y: 230 }, size: { width: 150, height: 20 }, zIndex: 5, styles: { color: "#fff", fontWeight: "bold", fontSize: "14px" } },
      { id: "t-job", name: "Job", type: "text", content: "Lead Designer at Vercel", position: { x: 180, y: 250 }, size: { width: 200, height: 20 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "12px" } }
    ]
  },
  
  // --- FORMS & AUTH ---
  {
    id: "template-signup",
    name: "Sign Up Form",
    description: "Detailed registration form",
    category: "Forms",
    tier: 'free',
    canvasSettings: { width: 800, height: 800, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "su-bg", name: "Bg", type: "card", position: { x: 200, y: 50 }, size: { width: 400, height: 650 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "su-t", name: "Title", type: "text", content: "Create an account", position: { x: 230, y: 90 }, size: { width: 340, height: 40 }, zIndex: 2, styles: { fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "#fff" } },
      { id: "su-d", name: "Desc", type: "text", content: "Enter your details to get started.", position: { x: 230, y: 130 }, size: { width: 340, height: 20 }, zIndex: 3, styles: { fontSize: "14px", textAlign: "center", color: "#a1a1aa" } },
      { id: "su-n-l", name: "Name Lbl", type: "text", content: "Full Name", position: { x: 240, y: 180 }, size: { width: 100, height: 20 }, zIndex: 4, styles: { fontSize: "12px", color: "#fff", fontWeight: "bold" } },
      { id: "su-n-i", name: "Name Inp", type: "input", placeholder: "Elena Rostova", position: { x: 240, y: 205 }, size: { width: 320, height: 40 }, zIndex: 5, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "su-e-l", name: "Email Lbl", type: "text", content: "Email", position: { x: 240, y: 265 }, size: { width: 100, height: 20 }, zIndex: 6, styles: { fontSize: "12px", color: "#fff", fontWeight: "bold" } },
      { id: "su-e-i", name: "Email Inp", type: "input", placeholder: "elena@nexore.dev", position: { x: 240, y: 290 }, size: { width: 320, height: 40 }, zIndex: 7, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "su-p-l", name: "Pwd Lbl", type: "text", content: "Password", position: { x: 240, y: 350 }, size: { width: 100, height: 20 }, zIndex: 8, styles: { fontSize: "12px", color: "#fff", fontWeight: "bold" } },
      { id: "su-p-i", name: "Pwd Inp", type: "input", placeholder: "••••••••", position: { x: 240, y: 375 }, size: { width: 320, height: 40 }, zIndex: 9, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "su-c-b", name: "Check", type: "checkbox", content: "I agree to the Terms of Service", position: { x: 240, y: 440 }, size: { width: 320, height: 30 }, zIndex: 10, styles: { color: "#a1a1aa" } },
      { id: "su-btn", name: "Submit", type: "button", content: "Sign Up", position: { x: 240, y: 490 }, size: { width: 320, height: 45 }, zIndex: 11, styles: { backgroundColor: "#fff", color: "#000", fontWeight: "bold", borderRadius: "6px" } },
      { id: "su-sep", name: "Sep", type: "divider", position: { x: 240, y: 560 }, size: { width: 320, height: 1 }, zIndex: 12, styles: { backgroundColor: "#27272a" } },
      { id: "su-gh", name: "Github Btn", type: "button", content: "Continue with GitHub", variant: "outline", position: { x: 240, y: 590 }, size: { width: 320, height: 45 }, zIndex: 13, styles: { borderRadius: "6px", color: "#fff", borderColor: "#27272a" } }
    ]
  },
  {
    id: "template-settings",
    name: "Settings Panel",
    description: "Account settings toggles",
    category: "Forms",
    tier: 'free',
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "set-bg", name: "Bg", type: "card", position: { x: 150, y: 100 }, size: { width: 500, height: 400 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "set-t", name: "Title", type: "text", content: "Notifications", position: { x: 180, y: 130 }, size: { width: 200, height: 30 }, zIndex: 2, styles: { fontSize: "20px", fontWeight: "bold", color: "#fff" } },
      { id: "set-d", name: "Desc", type: "text", content: "Manage how you receive alerts.", position: { x: 180, y: 160 }, size: { width: 300, height: 20 }, zIndex: 3, styles: { fontSize: "14px", color: "#a1a1aa" } },
      { id: "set-div1", name: "Divider", type: "divider", position: { x: 150, y: 200 }, size: { width: 500, height: 1 }, zIndex: 4, styles: { backgroundColor: "#27272a" } },
      { id: "set-i1-t", name: "Item Title", type: "text", content: "Email Notifications", position: { x: 180, y: 230 }, size: { width: 200, height: 20 }, zIndex: 5, styles: { fontSize: "14px", fontWeight: "bold", color: "#fff" } },
      { id: "set-i1-d", name: "Item Desc", type: "text", content: "Receive daily digests.", position: { x: 180, y: 250 }, size: { width: 200, height: 20 }, zIndex: 6, styles: { fontSize: "12px", color: "#a1a1aa" } },
      { id: "set-s1", name: "Switch", type: "switch", content: "", checked: true, position: { x: 570, y: 235 }, size: { width: 40, height: 24 }, zIndex: 7, styles: {} },
      { id: "set-div2", name: "Divider", type: "divider", position: { x: 180, y: 290 }, size: { width: 440, height: 1 }, zIndex: 8, styles: { backgroundColor: "#27272a" } },
      { id: "set-i2-t", name: "Item Title", type: "text", content: "Marketing Emails", position: { x: 180, y: 320 }, size: { width: 200, height: 20 }, zIndex: 9, styles: { fontSize: "14px", fontWeight: "bold", color: "#fff" } },
      { id: "set-i2-d", name: "Item Desc", type: "text", content: "Promotions and news.", position: { x: 180, y: 340 }, size: { width: 200, height: 20 }, zIndex: 10, styles: { fontSize: "12px", color: "#a1a1aa" } },
      { id: "set-s2", name: "Switch", type: "switch", content: "", checked: false, position: { x: 570, y: 325 }, size: { width: 40, height: 24 }, zIndex: 11, styles: {} },
      { id: "set-div3", name: "Divider", type: "divider", position: { x: 150, y: 390 }, size: { width: 500, height: 1 }, zIndex: 12, styles: { backgroundColor: "#27272a" } },
      { id: "set-btn", name: "Save", type: "button", content: "Save Changes", position: { x: 480, y: 430 }, size: { width: 140, height: 36 }, zIndex: 13, styles: { backgroundColor: "#fff", color: "#000", fontWeight: "bold", borderRadius: "6px" } }
    ]
  },
  
  // --- SOCIAL ---
  {
    id: "template-chat-msg",
    name: "Chat Bubble",
    description: "iOS style chat message",
    category: "Social",
    tier: 'free',
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "c-av", name: "Avatar", type: "avatar", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100", position: { x: 100, y: 150 }, size: { width: 40, height: 40 }, zIndex: 1, styles: {} },
      { id: "c-bub1", name: "Bubble 1", type: "card", position: { x: 150, y: 130 }, size: { width: 220, height: 60 }, zIndex: 2, styles: { backgroundColor: "#27272a", borderRadius: "18px", borderRadiusTopLeft: "4px", paddingTop: "12px", paddingRight: "12px", paddingBottom: "12px", paddingLeft: "12px" } },
      { id: "c-txt1", name: "Text", type: "text", content: "Hey! Are we still on for today?", position: { x: 160, y: 145 }, size: { width: 200, height: 30 }, zIndex: 3, styles: { color: "#fff", fontSize: "14px" } },
      { id: "c-bub2", name: "Bubble 2", type: "card", position: { x: 300, y: 200 }, size: { width: 180, height: 60 }, zIndex: 4, styles: { backgroundColor: "#3b82f6", borderRadius: "18px", borderRadiusBottomRight: "4px", paddingTop: "12px", paddingRight: "12px", paddingBottom: "12px", paddingLeft: "12px" } },
      { id: "c-txt2", name: "Text", type: "text", content: "Yes, see you at 5!", position: { x: 310, y: 215 }, size: { width: 160, height: 30 }, zIndex: 5, styles: { color: "#fff", fontSize: "14px" } },
      { id: "c-time", name: "Time", type: "text", content: "Delivered", position: { x: 420, y: 270 }, size: { width: 60, height: 20 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "11px", textAlign: "right" } }
    ]
  },
  {
    id: "template-feed-post",
    name: "Social Feed Post",
    description: "Instagram-style card",
    category: "Social",
    tier: 'free',
    canvasSettings: { width: 600, height: 800, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "f-bg", name: "Card", type: "card", position: { x: 100, y: 50 }, size: { width: 400, height: 550 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "f-av", name: "Avatar", type: "avatar", src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100", position: { x: 120, y: 70 }, size: { width: 40, height: 40 }, zIndex: 2, styles: {} },
      { id: "f-un", name: "Username", type: "text", content: "alice_wonder", position: { x: 170, y: 70 }, size: { width: 150, height: 20 }, zIndex: 3, styles: { color: "#fff", fontWeight: "bold", fontSize: "14px" } },
      { id: "f-loc", name: "Location", type: "text", content: "San Francisco, CA", position: { x: 170, y: 90 }, size: { width: 150, height: 20 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "f-img", name: "Post Image", type: "image", src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600", position: { x: 100, y: 130 }, size: { width: 400, height: 350 }, zIndex: 5, styles: {} },
      { id: "f-act", name: "Actions", type: "text", content: "24 likes · 8 comments · Share", position: { x: 120, y: 495 }, size: { width: 200, height: 30 }, zIndex: 6, styles: { fontSize: "13px", color: "#a1a1aa" } },
      { id: "f-lk", name: "Likes", type: "text", content: "1,245 likes", position: { x: 120, y: 530 }, size: { width: 100, height: 20 }, zIndex: 7, styles: { color: "#fff", fontWeight: "bold", fontSize: "14px" } },
      { id: "f-cap", name: "Caption", type: "text", content: "crafted day out here!", position: { x: 120, y: 555 }, size: { width: 300, height: 20 }, zIndex: 8, styles: { color: "#fff", fontSize: "14px" } }
    ]
  },
  
  // --- UI COMPONENTS ---
  {
    id: "template-modal",
    name: "Modal Dialog",
    description: "Confirmation popup",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "m-overlay", name: "Overlay", type: "card", position: { x: 0, y: 0 }, size: { width: 800, height: 600 }, zIndex: 1, styles: { backgroundColor: "rgba(0,0,0,0.6)", backdropBlur: "4" } },
      { id: "m-card", name: "Dialog", type: "card", position: { x: 200, y: 200 }, size: { width: 400, height: 200 }, zIndex: 2, styles: { backgroundColor: "#18181b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "m-icon", name: "Icon", type: "text", content: "!", position: { x: 220, y: 220 }, size: { width: 28, height: 28 }, zIndex: 3, styles: { fontSize: "16px", fontWeight: "bold", color: "#ef4444", textAlign: "center", backgroundColor: "rgba(239,68,68,0.15)", borderRadius: "50%", paddingTop: "3px" } },
      { id: "m-t", name: "Title", type: "text", content: "Delete Project?", position: { x: 260, y: 224 }, size: { width: 300, height: 25 }, zIndex: 4, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "m-d", name: "Desc", type: "text", content: "This action cannot be undone. All your files will be permanently removed.", position: { x: 220, y: 260 }, size: { width: 350, height: 50 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "m-c", name: "Cancel", type: "button", content: "Cancel", variant: "outline", position: { x: 380, y: 340 }, size: { width: 90, height: 40 }, zIndex: 6, styles: { borderRadius: "6px", color: "#fff", borderColor: "#27272a" } },
      { id: "m-s", name: "Delete", type: "button", content: "Delete", variant: "destructive", position: { x: 480, y: 340 }, size: { width: 90, height: 40 }, zIndex: 7, styles: { borderRadius: "6px" } }
    ]
  },
  {
    id: "template-navbar",
    name: "Navigation Bar",
    description: "Header navigation with logo and links",
    category: "Sections",
    tier: 'free',
    canvasSettings: { width: 1000, height: 300, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "n-bg", name: "Nav Bg", type: "card", position: { x: 100, y: 50 }, size: { width: 800, height: 64 }, zIndex: 1, styles: { backgroundColor: "rgba(9,9,11,0.8)", backdropBlur: "8", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "n-logo", name: "Logo", type: "text", content: "NexoreUI", position: { x: 120, y: 67 }, size: { width: 100, height: 30 }, zIndex: 2, styles: { color: "#fff", fontSize: "20px", fontWeight: "bold" } },
      { id: "n-l1", name: "Link 1", type: "text", content: "Products", position: { x: 350, y: 72 }, size: { width: 70, height: 20 }, zIndex: 3, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "n-l2", name: "Link 2", type: "text", content: "Solutions", position: { x: 440, y: 72 }, size: { width: 70, height: 20 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "n-l3", name: "Link 3", type: "text", content: "Pricing", position: { x: 530, y: 72 }, size: { width: 60, height: 20 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "n-b1", name: "Login", type: "button", content: "Log in", variant: "ghost", position: { x: 690, y: 62 }, size: { width: 80, height: 40 }, zIndex: 6, styles: { borderRadius: "6px" } },
      { id: "n-b2", name: "Signup", type: "button", content: "Sign Up", position: { x: 780, y: 62 }, size: { width: 90, height: 40 }, zIndex: 7, styles: { backgroundColor: "#fff", color: "#000", borderRadius: "6px", fontWeight: "bold" } }
    ]
  },
  {
    id: "template-player",
    name: "Music Player",
    description: "Audio player widget",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "mp-bg", name: "Bg", type: "card", position: { x: 150, y: 100 }, size: { width: 300, height: 140 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "mp-cv", name: "Cover", type: "image", src: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200", position: { x: 170, y: 120 }, size: { width: 60, height: 60 }, zIndex: 2, styles: { borderRadius: "8px" } },
      { id: "mp-t", name: "Title", type: "text", content: "Midnight City", position: { x: 245, y: 125 }, size: { width: 180, height: 20 }, zIndex: 3, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "mp-a", name: "Artist", type: "text", content: "M83", position: { x: 245, y: 145 }, size: { width: 180, height: 20 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "mp-pbg", name: "Prog Bg", type: "card", position: { x: 170, y: 200 }, size: { width: 260, height: 4 }, zIndex: 5, styles: { backgroundColor: "#27272a", borderRadius: "2px" } },
      { id: "mp-pfl", name: "Prog Fill", type: "card", position: { x: 170, y: 200 }, size: { width: 120, height: 4 }, zIndex: 6, styles: { backgroundColor: "#fff", borderRadius: "2px" } },
      { id: "mp-prev", name: "Prev", type: "icon", iconName: "SkipBack", position: { x: 235, y: 215 }, size: { width: 22, height: 22 }, zIndex: 7, styles: { color: "#a1a1aa" } },
      { id: "mp-play", name: "Play", type: "icon", iconName: "Play", position: { x: 289, y: 215 }, size: { width: 22, height: 22 }, zIndex: 8, styles: { color: "#fafafa" } },
      { id: "mp-next", name: "Next", type: "icon", iconName: "SkipForward", position: { x: 343, y: 215 }, size: { width: 22, height: 22 }, zIndex: 9, styles: { color: "#a1a1aa" } }
    ]
  },
  {
    id: "template-weather",
    name: "Weather Widget",
    description: "Glassmorphic weather card",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "ww-bg", name: "Glass Card", type: "card", position: { x: 180, y: 80 }, size: { width: 240, height: 240 }, zIndex: 1, styles: { backgroundColor: "rgba(255,255,255,0.1)", backdropBlur: "16", borderRadius: "24px", borderStyle: "solid", borderWidth: "1px", borderColor: "rgba(255,255,255,0.2)" } },
      { id: "ww-loc", name: "Location", type: "text", content: "Cupertino", position: { x: 180, y: 100 }, size: { width: 240, height: 30 }, zIndex: 2, styles: { color: "#fff", fontSize: "20px", textAlign: "center" } },
      { id: "ww-ic", name: "Icon", type: "icon", iconName: "Sun", position: { x: 275, y: 130 }, size: { width: 50, height: 50 }, zIndex: 3, styles: { color: "#fafafa" } },
      { id: "ww-t", name: "Temp", type: "text", content: "72°", position: { x: 180, y: 210 }, size: { width: 240, height: 50 }, zIndex: 4, styles: { color: "#fff", fontSize: "48px", fontWeight: "300", textAlign: "center" } },
      { id: "ww-d", name: "Condition", type: "text", content: "Mostly Sunny", position: { x: 180, y: 265 }, size: { width: 240, height: 20 }, zIndex: 5, styles: { color: "#fff", fontSize: "14px", textAlign: "center" } },
      { id: "ww-mm", name: "High/Low", type: "text", content: "H:75° L:60°", position: { x: 180, y: 285 }, size: { width: 240, height: 20 }, zIndex: 6, styles: { color: "#fff", fontSize: "14px", textAlign: "center" } }
    ]
  },
  {
    id: "template-notif",
    name: "Toast Notification",
    description: "Success alert message",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "n-bg", name: "Bg", type: "card", position: { x: 150, y: 160 }, size: { width: 300, height: 60 }, zIndex: 1, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "1px", borderColor: "#22c55e" } },
      { id: "n-ic", name: "Icon", type: "icon", iconName: "Check", position: { x: 162, y: 177 }, size: { width: 20, height: 20 }, zIndex: 2, styles: { color: "#4ade80" } },
      { id: "n-t", name: "Title", type: "text", content: "Successfully saved!", position: { x: 195, y: 170 }, size: { width: 200, height: 20 }, zIndex: 3, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "n-d", name: "Desc", type: "text", content: "Your changes have been deployed.", position: { x: 195, y: 188 }, size: { width: 200, height: 20 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "n-x", name: "Close", type: "icon", iconName: "X", position: { x: 420, y: 180 }, size: { width: 16, height: 16 }, zIndex: 5, styles: { color: "#a1a1aa" } }
    ]
  },
  
  // --- NEW TEMPLATES ---
  {
    id: "template-newsletter",
    name: "Newsletter CTA",
    description: "Subscribe form for newsletters",
    category: "Landing",
    tier: 'free',
    canvasSettings: { width: 800, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "nl-bg", name: "Bg", type: "card", position: { x: 100, y: 100 }, size: { width: 600, height: 200 }, zIndex: 1, styles: { backgroundColor: "#18181b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "nl-t", name: "Title", type: "text", content: "Subscribe to our Newsletter", position: { x: 150, y: 140 }, size: { width: 300, height: 30 }, zIndex: 2, styles: { color: "#fff", fontSize: "20px", fontWeight: "bold" } },
      { id: "nl-d", name: "Desc", type: "text", content: "Get the latest updates delivered right to your inbox.", position: { x: 150, y: 175 }, size: { width: 350, height: 20 }, zIndex: 3, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "nl-i", name: "Input", type: "input", placeholder: "Enter your email", position: { x: 150, y: 220 }, size: { width: 300, height: 40 }, zIndex: 4, styles: { backgroundColor: "#09090b", color: "#fff", borderRadius: "6px" } },
      { id: "nl-b", name: "Button", type: "button", content: "Subscribe", position: { x: 460, y: 220 }, size: { width: 100, height: 40 }, zIndex: 5, styles: { backgroundColor: "#fff", color: "#000", fontWeight: "bold", borderRadius: "6px" } }
    ]
  },
  {
    id: "template-profile-card",
    name: "User Profile Card",
    description: "Profile with cover image and stats",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "up-bg", name: "Bg", type: "card", position: { x: 150, y: 100 }, size: { width: 300, height: 350 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "up-cv", name: "Cover", type: "image", src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400", position: { x: 150, y: 100 }, size: { width: 300, height: 100 }, zIndex: 2, styles: { borderRadiusTopLeft: "16px", borderRadiusTopRight: "16px" } },
      { id: "up-av", name: "Avatar", type: "avatar", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200", position: { x: 260, y: 160 }, size: { width: 80, height: 80 }, zIndex: 3, styles: { borderStyle: "solid", borderWidth: "4px", borderColor: "#09090b" } },
      { id: "up-n", name: "Name", type: "text", content: "Sarah Jenkins", position: { x: 150, y: 250 }, size: { width: 300, height: 25 }, zIndex: 4, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold", textAlign: "center" } },
      { id: "up-h", name: "Handle", type: "text", content: "@sarahj", position: { x: 150, y: 275 }, size: { width: 300, height: 20 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "14px", textAlign: "center" } },
      { id: "up-div", name: "Divider", type: "divider", position: { x: 150, y: 310 }, size: { width: 300, height: 1 }, zIndex: 6, styles: { backgroundColor: "#27272a" } },
      { id: "up-s1", name: "Stat1", type: "text", content: "1.2k\nFollowers", position: { x: 170, y: 330 }, size: { width: 80, height: 40 }, zIndex: 7, styles: { color: "#fff", fontSize: "14px", textAlign: "center", fontWeight: "bold" } },
      { id: "up-s2", name: "Stat2", type: "text", content: "48\nFollowing", position: { x: 350, y: 330 }, size: { width: 80, height: 40 }, zIndex: 8, styles: { color: "#fff", fontSize: "14px", textAlign: "center", fontWeight: "bold" } },
      { id: "up-btn", name: "Follow Btn", type: "button", content: "Follow", position: { x: 150, y: 400 }, size: { width: 300, height: 40 }, zIndex: 9, styles: { backgroundColor: "#3b82f6", color: "#fff", borderRadius: "8px", fontWeight: "bold" } }
    ]
  },
  {
    id: "template-blog-card",
    name: "Blog Post Card",
    description: "Article thumbnail and summary",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "bc-bg", name: "Bg", type: "card", position: { x: 150, y: 100 }, size: { width: 320, height: 420 }, zIndex: 1, styles: { backgroundColor: "#18181b", borderRadius: "12px" } },
      { id: "bc-img", name: "Image", type: "image", src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500", position: { x: 150, y: 100 }, size: { width: 320, height: 200 }, zIndex: 2, styles: { borderRadiusTopLeft: "12px", borderRadiusTopRight: "12px" } },
      { id: "bc-cat", name: "Category", type: "badge", content: "Technology", position: { x: 170, y: 320 }, size: { width: 90, height: 24 }, zIndex: 3, styles: { backgroundColor: "rgba(59,130,246,0.1)", color: "#3b82f6" } },
      { id: "bc-t", name: "Title", type: "text", content: "The Future of AI Development", position: { x: 170, y: 360 }, size: { width: 280, height: 30 }, zIndex: 4, styles: { color: "#fff", fontSize: "20px", fontWeight: "bold" } },
      { id: "bc-d", name: "Date", type: "text", content: "Oct 24, 2026 • 5 min read", position: { x: 170, y: 400 }, size: { width: 200, height: 20 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "bc-rd", name: "Read More", type: "text", content: "Read article →", position: { x: 170, y: 470 }, size: { width: 100, height: 20 }, zIndex: 6, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } }
    ]
  },
  {
    id: "template-sidebar",
    name: "App Sidebar",
    description: "Vertical navigation menu",
    category: "Sections",
    tier: 'free',
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "sb-bg", name: "Sidebar Bg", type: "card", position: { x: 50, y: 50 }, size: { width: 240, height: 500 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "sb-l", name: "Logo", type: "text", content: "NexoreUI", position: { x: 70, y: 70 }, size: { width: 150, height: 30 }, zIndex: 2, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "sb-i1", name: "Item1", type: "text", content: "Dashboard", position: { x: 70, y: 130 }, size: { width: 180, height: 30 }, zIndex: 3, styles: { color: "#fff", fontSize: "14px", backgroundColor: "#27272a", borderRadius: "6px", paddingTop: "6px", paddingLeft: "12px", fontWeight: "500" } },
      { id: "sb-i2", name: "Item2", type: "text", content: "Analytics", position: { x: 70, y: 170 }, size: { width: 180, height: 30 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "14px", paddingTop: "6px", paddingLeft: "12px" } },
      { id: "sb-i3", name: "Item3", type: "text", content: "Customers", position: { x: 70, y: 210 }, size: { width: 180, height: 30 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "14px", paddingTop: "6px", paddingLeft: "12px" } },
      { id: "sb-i4", name: "Item4", type: "text", content: "Settings", position: { x: 70, y: 250 }, size: { width: 180, height: 30 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "14px", paddingTop: "6px", paddingLeft: "12px" } },
      { id: "sb-div", name: "Divider", type: "divider", position: { x: 50, y: 450 }, size: { width: 240, height: 1 }, zIndex: 7, styles: { backgroundColor: "#27272a" } },
      { id: "sb-av", name: "Avatar", type: "avatar", src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100", position: { x: 70, y: 480 }, size: { width: 32, height: 32 }, zIndex: 8, styles: {} },
      { id: "sb-un", name: "Username", type: "text", content: "Admin User", position: { x: 110, y: 486 }, size: { width: 100, height: 20 }, zIndex: 9, styles: { color: "#fff", fontSize: "12px" } }
    ]
  },
  {
    id: "template-checkout",
    name: "Checkout Summary",
    description: "E-commerce order summary card",
    category: "E-commerce",
    tier: 'free',
    canvasSettings: { width: 600, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "co-bg", name: "Bg", type: "card", position: { x: 150, y: 100 }, size: { width: 320, height: 450 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a", paddingLeft: "24px", paddingTop: "24px", paddingRight: "24px" } },
      { id: "co-t", name: "Title", type: "text", content: "Order Summary", position: { x: 174, y: 124 }, size: { width: 200, height: 30 }, zIndex: 2, styles: { color: "#fff", fontSize: "20px", fontWeight: "bold" } },
      { id: "co-i1t", name: "Item1", type: "text", content: "Mechanical Keyboard", position: { x: 174, y: 180 }, size: { width: 150, height: 20 }, zIndex: 3, styles: { color: "#fff", fontSize: "14px" } },
      { id: "co-i1p", name: "Price1", type: "text", content: "$129.00", position: { x: 390, y: 180 }, size: { width: 60, height: 20 }, zIndex: 4, styles: { color: "#fff", fontSize: "14px", textAlign: "right" } },
      { id: "co-i2t", name: "Item2", type: "text", content: "Wireless Mouse", position: { x: 174, y: 220 }, size: { width: 150, height: 20 }, zIndex: 5, styles: { color: "#fff", fontSize: "14px" } },
      { id: "co-i2p", name: "Price2", type: "text", content: "$79.00", position: { x: 390, y: 220 }, size: { width: 60, height: 20 }, zIndex: 6, styles: { color: "#fff", fontSize: "14px", textAlign: "right" } },
      { id: "co-div1", name: "Div", type: "divider", position: { x: 174, y: 270 }, size: { width: 272, height: 1 }, zIndex: 7, styles: { backgroundColor: "#27272a" } },
      { id: "co-stt", name: "Subtotal", type: "text", content: "Subtotal", position: { x: 174, y: 290 }, size: { width: 100, height: 20 }, zIndex: 8, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "co-stp", name: "Sub Price", type: "text", content: "$208.00", position: { x: 390, y: 290 }, size: { width: 60, height: 20 }, zIndex: 9, styles: { color: "#fff", fontSize: "14px", textAlign: "right" } },
      { id: "co-tx", name: "Tax", type: "text", content: "Tax", position: { x: 174, y: 320 }, size: { width: 100, height: 20 }, zIndex: 10, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "co-txp", name: "Tax Price", type: "text", content: "$16.64", position: { x: 390, y: 320 }, size: { width: 60, height: 20 }, zIndex: 11, styles: { color: "#fff", fontSize: "14px", textAlign: "right" } },
      { id: "co-div2", name: "Div2", type: "divider", position: { x: 174, y: 360 }, size: { width: 272, height: 1 }, zIndex: 12, styles: { backgroundColor: "#27272a" } },
      { id: "co-tot", name: "Total", type: "text", content: "Total", position: { x: 174, y: 380 }, size: { width: 100, height: 25 }, zIndex: 13, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "co-top", name: "Total Price", type: "text", content: "$224.64", position: { x: 370, y: 380 }, size: { width: 80, height: 25 }, zIndex: 14, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold", textAlign: "right" } },
      { id: "co-btn", name: "Checkout Btn", type: "button", content: "Proceed to Checkout", position: { x: 174, y: 430 }, size: { width: 272, height: 45 }, zIndex: 15, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "bold", borderRadius: "8px" } }
    ]
  },
  {
    id: "template-faq",
    name: "FAQ Accordion",
    description: "Expandable FAQ list item",
    category: "Landing",
    tier: 'free',
    canvasSettings: { width: 800, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "fq-t", name: "Title", type: "text", content: "Frequently Asked Questions", position: { x: 150, y: 80 }, size: { width: 500, height: 30 }, zIndex: 1, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold", textAlign: "center" } },
      { id: "fq-b1", name: "Q1 Bg", type: "card", position: { x: 150, y: 140 }, size: { width: 500, height: 50 }, zIndex: 2, styles: { backgroundColor: "#18181b", borderRadius: "8px" } },
      { id: "fq-q1", name: "Q1 Text", type: "text", content: "What payment methods do you accept?", position: { x: 170, y: 155 }, size: { width: 400, height: 20 }, zIndex: 3, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "fq-i1", name: "Icon1", type: "text", content: "+", position: { x: 620, y: 152 }, size: { width: 20, height: 20 }, zIndex: 4, styles: { color: "#fff", fontSize: "20px" } },
      { id: "fq-b2", name: "Q2 Bg", type: "card", position: { x: 150, y: 200 }, size: { width: 500, height: 120 }, zIndex: 5, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "1px", borderColor: "#3f3f46" } },
      { id: "fq-q2", name: "Q2 Text", type: "text", content: "Can I cancel my subscription?", position: { x: 170, y: 215 }, size: { width: 400, height: 20 }, zIndex: 6, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "fq-i2", name: "Icon2", type: "text", content: "-", position: { x: 620, y: 212 }, size: { width: 20, height: 20 }, zIndex: 7, styles: { color: "#fafafa", fontSize: "20px" } },
      { id: "fq-a2", name: "Answer", type: "text", content: "Yes, you can cancel your subscription at any time from your account settings. You will continue to have access until the end of your billing cycle.", position: { x: 170, y: 250 }, size: { width: 460, height: 50 }, zIndex: 8, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "fq-b3", name: "Q3 Bg", type: "card", position: { x: 150, y: 330 }, size: { width: 500, height: 50 }, zIndex: 9, styles: { backgroundColor: "#18181b", borderRadius: "8px" } },
      { id: "fq-q3", name: "Q3 Text", type: "text", content: "Do you offer refunds?", position: { x: 170, y: 345 }, size: { width: 400, height: 20 }, zIndex: 10, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "fq-i3", name: "Icon3", type: "text", content: "+", position: { x: 620, y: 342 }, size: { width: 20, height: 20 }, zIndex: 11, styles: { color: "#fff", fontSize: "20px" } }
    ]
  },
  {
    id: "template-stats-grid",
    name: "Stats Grid",
    description: "Grid of 3 metric cards",
    category: "Dashboard",
    tier: 'free',
    canvasSettings: { width: 1000, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "sg-1b", name: "Card1", type: "card", position: { x: 100, y: 150 }, size: { width: 240, height: 120 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "sg-1t", name: "Title1", type: "text", content: "Total Users", position: { x: 120, y: 170 }, size: { width: 100, height: 20 }, zIndex: 2, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "sg-1v", name: "Val1", type: "text", content: "24.5k", position: { x: 120, y: 200 }, size: { width: 100, height: 35 }, zIndex: 3, styles: { color: "#fff", fontSize: "28px", fontWeight: "bold" } },
      { id: "sg-1p", name: "Pct1", type: "text", content: "+12%", position: { x: 280, y: 210 }, size: { width: 40, height: 20 }, zIndex: 4, styles: { color: "#4ade80", fontSize: "14px", fontWeight: "bold" } },
      { id: "sg-2b", name: "Card2", type: "card", position: { x: 360, y: 150 }, size: { width: 240, height: 120 }, zIndex: 5, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "sg-2t", name: "Title2", type: "text", content: "Revenue", position: { x: 380, y: 170 }, size: { width: 100, height: 20 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "sg-2v", name: "Val2", type: "text", content: "$84.2k", position: { x: 380, y: 200 }, size: { width: 120, height: 35 }, zIndex: 7, styles: { color: "#fff", fontSize: "28px", fontWeight: "bold" } },
      { id: "sg-2p", name: "Pct2", type: "text", content: "+8%", position: { x: 540, y: 210 }, size: { width: 40, height: 20 }, zIndex: 8, styles: { color: "#4ade80", fontSize: "14px", fontWeight: "bold" } },
      { id: "sg-3b", name: "Card3", type: "card", position: { x: 620, y: 150 }, size: { width: 240, height: 120 }, zIndex: 9, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "sg-3t", name: "Title3", type: "text", content: "Bounce Rate", position: { x: 640, y: 170 }, size: { width: 100, height: 20 }, zIndex: 10, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "sg-3v", name: "Val3", type: "text", content: "42.3%", position: { x: 640, y: 200 }, size: { width: 120, height: 35 }, zIndex: 11, styles: { color: "#fff", fontSize: "28px", fontWeight: "bold" } },
      { id: "sg-3p", name: "Pct3", type: "text", content: "-2%", position: { x: 800, y: 210 }, size: { width: 40, height: 20 }, zIndex: 12, styles: { color: "#ef4444", fontSize: "14px", fontWeight: "bold" } }
    ]
  },
  {
    id: "template-bento-grid",
    name: "Bento Grid Demo",
    description: "Modern asymmetrical grid layout",
    category: "Landing",
    tier: 'free',
    canvasSettings: { width: 1000, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "bg-1", name: "Box 1", type: "card", position: { x: 100, y: 100 }, size: { width: 480, height: 280 }, zIndex: 1, styles: { backgroundColor: "#18181b", borderRadius: "24px" } },
      { id: "bg-1t", name: "Text 1", type: "text", content: "Powerful Analytics", position: { x: 140, y: 140 }, size: { width: 300, height: 40 }, zIndex: 2, styles: { color: "#fff", fontSize: "28px", fontWeight: "bold" } },
      { id: "bg-2", name: "Box 2", type: "card", position: { x: 600, y: 100 }, size: { width: 300, height: 130 }, zIndex: 3, styles: { backgroundColor: "#3b82f6", borderRadius: "24px" } },
      { id: "bg-2t", name: "Text 2", type: "text", content: "Real-time Sync", position: { x: 630, y: 140 }, size: { width: 200, height: 30 }, zIndex: 4, styles: { color: "#fff", fontSize: "20px", fontWeight: "bold" } },
      { id: "bg-3", name: "Box 3", type: "card", position: { x: 600, y: 250 }, size: { width: 300, height: 280 }, zIndex: 5, styles: { backgroundColor: "#27272a", borderRadius: "24px" } },
      { id: "bg-3t", name: "Text 3", type: "text", content: "AI Powered", position: { x: 630, y: 290 }, size: { width: 200, height: 30 }, zIndex: 6, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold" } },
      { id: "bg-4", name: "Box 4", type: "card", position: { x: 100, y: 400 }, size: { width: 480, height: 130 }, zIndex: 7, styles: { backgroundColor: "#18181b", borderRadius: "24px" } },
      { id: "bg-4t", name: "Text 4", type: "text", content: "Enterprise Security", position: { x: 140, y: 440 }, size: { width: 300, height: 30 }, zIndex: 8, styles: { color: "#fff", fontSize: "20px", fontWeight: "bold" } }
    ]
  },

  // ==========================================
  //  NEW TEMPLATES BATCH — 30 MORE
  // ==========================================

  // --- DASHBOARD ---
  {
    id: "template-activity-feed",
    name: "Activity Feed",
    description: "Timeline of recent user activities",
    category: "Dashboard",
    tier: 'free',
    canvasSettings: { width: 600, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "af-bg", name: "Card", type: "card", position: { x: 100, y: 50 }, size: { width: 400, height: 500 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "af-t", name: "Title", type: "text", content: "Recent Activity", position: { x: 130, y: 80 }, size: { width: 200, height: 25 }, zIndex: 2, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "af-div0", name: "Divider", type: "divider", position: { x: 100, y: 120 }, size: { width: 400, height: 1 }, zIndex: 3, styles: { backgroundColor: "#27272a" } },
      { id: "af-dot1", name: "Dot1", type: "card", position: { x: 140, y: 148 }, size: { width: 10, height: 10 }, zIndex: 4, styles: { backgroundColor: "#22c55e", borderRadius: "50%" } },
      { id: "af-line1", name: "Line1", type: "card", position: { x: 144, y: 160 }, size: { width: 2, height: 50 }, zIndex: 3, styles: { backgroundColor: "#27272a" } },
      { id: "af-e1t", name: "Event1 Title", type: "text", content: "Deployment successful", position: { x: 170, y: 140 }, size: { width: 250, height: 20 }, zIndex: 5, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "af-e1d", name: "Event1 Time", type: "text", content: "2 minutes ago · production", position: { x: 170, y: 160 }, size: { width: 250, height: 18 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "af-dot2", name: "Dot2", type: "card", position: { x: 140, y: 228 }, size: { width: 10, height: 10 }, zIndex: 7, styles: { backgroundColor: "#3b82f6", borderRadius: "50%" } },
      { id: "af-line2", name: "Line2", type: "card", position: { x: 144, y: 240 }, size: { width: 2, height: 50 }, zIndex: 3, styles: { backgroundColor: "#27272a" } },
      { id: "af-e2t", name: "Event2 Title", type: "text", content: "New team member added", position: { x: 170, y: 220 }, size: { width: 250, height: 20 }, zIndex: 8, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "af-e2d", name: "Event2 Time", type: "text", content: "15 minutes ago · team", position: { x: 170, y: 240 }, size: { width: 250, height: 18 }, zIndex: 9, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "af-dot3", name: "Dot3", type: "card", position: { x: 140, y: 308 }, size: { width: 10, height: 10 }, zIndex: 10, styles: { backgroundColor: "#eab308", borderRadius: "50%" } },
      { id: "af-line3", name: "Line3", type: "card", position: { x: 144, y: 320 }, size: { width: 2, height: 50 }, zIndex: 3, styles: { backgroundColor: "#27272a" } },
      { id: "af-e3t", name: "Event3 Title", type: "text", content: "API rate limit warning", position: { x: 170, y: 300 }, size: { width: 250, height: 20 }, zIndex: 11, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "af-e3d", name: "Event3 Time", type: "text", content: "1 hour ago · monitoring", position: { x: 170, y: 320 }, size: { width: 250, height: 18 }, zIndex: 12, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "af-dot4", name: "Dot4", type: "card", position: { x: 140, y: 388 }, size: { width: 10, height: 10 }, zIndex: 13, styles: { backgroundColor: "#ef4444", borderRadius: "50%" } },
      { id: "af-e4t", name: "Event4 Title", type: "text", content: "Build failed on staging", position: { x: 170, y: 380 }, size: { width: 250, height: 20 }, zIndex: 14, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "af-e4d", name: "Event4 Time", type: "text", content: "3 hours ago · CI/CD", position: { x: 170, y: 400 }, size: { width: 250, height: 18 }, zIndex: 15, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "af-btn", name: "View All", type: "button", content: "View All Activity", variant: "outline", position: { x: 130, y: 460 }, size: { width: 340, height: 36 }, zIndex: 16, styles: { borderRadius: "6px", color: "#a1a1aa", borderColor: "#27272a" } }
    ]
  },
  {
    id: "template-chart-card",
    name: "Chart Card",
    description: "Analytics chart placeholder with legend",
    category: "Dashboard",
    tier: 'free',
    canvasSettings: { width: 700, height: 500, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "cc-bg", name: "Card", type: "card", position: { x: 100, y: 50 }, size: { width: 500, height: 400 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "cc-t", name: "Title", type: "text", content: "Revenue Overview", position: { x: 130, y: 80 }, size: { width: 200, height: 25 }, zIndex: 2, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "cc-sub", name: "Subtitle", type: "text", content: "Last 30 days performance", position: { x: 130, y: 105 }, size: { width: 200, height: 18 }, zIndex: 3, styles: { color: "#a1a1aa", fontSize: "13px" } },
      { id: "cc-l1", name: "Legend1", type: "card", position: { x: 430, y: 80 }, size: { width: 10, height: 10 }, zIndex: 4, styles: { backgroundColor: "#27272a", borderRadius: "50%" } },
      { id: "cc-l1t", name: "Legend1 Text", type: "text", content: "Revenue", position: { x: 445, y: 76 }, size: { width: 60, height: 18 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "11px" } },
      { id: "cc-l2", name: "Legend2", type: "card", position: { x: 510, y: 80 }, size: { width: 10, height: 10 }, zIndex: 6, styles: { backgroundColor: "#3b82f6", borderRadius: "50%" } },
      { id: "cc-l2t", name: "Legend2 Text", type: "text", content: "Costs", position: { x: 525, y: 76 }, size: { width: 50, height: 18 }, zIndex: 7, styles: { color: "#a1a1aa", fontSize: "11px" } },
      { id: "cc-area", name: "Chart Area", type: "card", position: { x: 130, y: 140 }, size: { width: 440, height: 220 }, zIndex: 8, styles: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "8px", borderStyle: "dashed", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "cc-bar1", name: "Bar1", type: "card", position: { x: 160, y: 250 }, size: { width: 30, height: 100 }, zIndex: 9, styles: { backgroundColor: "#27272a", borderRadius: "4px 4px 0 0" } },
      { id: "cc-bar2", name: "Bar2", type: "card", position: { x: 210, y: 220 }, size: { width: 30, height: 130 }, zIndex: 10, styles: { backgroundColor: "#27272a", borderRadius: "4px 4px 0 0" } },
      { id: "cc-bar3", name: "Bar3", type: "card", position: { x: 260, y: 190 }, size: { width: 30, height: 160 }, zIndex: 11, styles: { backgroundColor: "#27272a", borderRadius: "4px 4px 0 0" } },
      { id: "cc-bar4", name: "Bar4", type: "card", position: { x: 310, y: 230 }, size: { width: 30, height: 120 }, zIndex: 12, styles: { backgroundColor: "#3b82f6", borderRadius: "4px 4px 0 0" } },
      { id: "cc-bar5", name: "Bar5", type: "card", position: { x: 360, y: 180 }, size: { width: 30, height: 170 }, zIndex: 13, styles: { backgroundColor: "#27272a", borderRadius: "4px 4px 0 0" } },
      { id: "cc-bar6", name: "Bar6", type: "card", position: { x: 410, y: 200 }, size: { width: 30, height: 150 }, zIndex: 14, styles: { backgroundColor: "#3b82f6", borderRadius: "4px 4px 0 0" } },
      { id: "cc-bar7", name: "Bar7", type: "card", position: { x: 460, y: 160 }, size: { width: 30, height: 190 }, zIndex: 15, styles: { backgroundColor: "#27272a", borderRadius: "4px 4px 0 0" } },
      { id: "cc-bar8", name: "Bar8", type: "card", position: { x: 510, y: 210 }, size: { width: 30, height: 140 }, zIndex: 16, styles: { backgroundColor: "#3b82f6", borderRadius: "4px 4px 0 0" } },
      { id: "cc-total", name: "Total", type: "text", content: "$128,430", position: { x: 130, y: 380 }, size: { width: 150, height: 30 }, zIndex: 17, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold" } },
      { id: "cc-pct", name: "Pct", type: "badge", content: "+14.2%", position: { x: 290, y: 385 }, size: { width: 60, height: 22 }, zIndex: 18, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "11px" } }
    ]
  },
  {
    id: "template-kpi-header",
    name: "KPI Dashboard Header",
    description: "Dashboard header with key performance indicators",
    category: "Dashboard",
    tier: 'free',
    canvasSettings: { width: 1200, height: 300, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "kpi-title", name: "Title", type: "text", content: "Dashboard Overview", position: { x: 100, y: 60 }, size: { width: 250, height: 30 }, zIndex: 1, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold" } },
      { id: "kpi-desc", name: "Desc", type: "text", content: "Welcome back, here's what's happening today.", position: { x: 100, y: 95 }, size: { width: 350, height: 20 }, zIndex: 2, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "kpi-c1", name: "Card1", type: "card", position: { x: 100, y: 150 }, size: { width: 230, height: 100 }, zIndex: 3, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "kpi-c1t", name: "Label1", type: "text", content: "Monthly Revenue", position: { x: 120, y: 165 }, size: { width: 130, height: 18 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "kpi-c1v", name: "Value1", type: "text", content: "$48,290", position: { x: 120, y: 190 }, size: { width: 130, height: 30 }, zIndex: 5, styles: { color: "#fff", fontSize: "26px", fontWeight: "bold" } },
      { id: "kpi-c1p", name: "Pct1", type: "badge", content: "↑ 12.5%", position: { x: 260, y: 200 }, size: { width: 55, height: 20 }, zIndex: 6, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "10px" } },
      { id: "kpi-c2", name: "Card2", type: "card", position: { x: 350, y: 150 }, size: { width: 230, height: 100 }, zIndex: 7, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "kpi-c2t", name: "Label2", type: "text", content: "Active Users", position: { x: 370, y: 165 }, size: { width: 130, height: 18 }, zIndex: 8, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "kpi-c2v", name: "Value2", type: "text", content: "3,847", position: { x: 370, y: 190 }, size: { width: 130, height: 30 }, zIndex: 9, styles: { color: "#fff", fontSize: "26px", fontWeight: "bold" } },
      { id: "kpi-c2p", name: "Pct2", type: "badge", content: "↑ 8.1%", position: { x: 510, y: 200 }, size: { width: 55, height: 20 }, zIndex: 10, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "10px" } },
      { id: "kpi-c3", name: "Card3", type: "card", position: { x: 600, y: 150 }, size: { width: 230, height: 100 }, zIndex: 11, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "kpi-c3t", name: "Label3", type: "text", content: "Conversion Rate", position: { x: 620, y: 165 }, size: { width: 130, height: 18 }, zIndex: 12, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "kpi-c3v", name: "Value3", type: "text", content: "3.24%", position: { x: 620, y: 190 }, size: { width: 130, height: 30 }, zIndex: 13, styles: { color: "#fff", fontSize: "26px", fontWeight: "bold" } },
      { id: "kpi-c3p", name: "Pct3", type: "badge", content: "↓ 1.2%", position: { x: 760, y: 200 }, size: { width: 55, height: 20 }, zIndex: 14, styles: { backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: "10px" } },
      { id: "kpi-c4", name: "Card4", type: "card", position: { x: 850, y: 150 }, size: { width: 230, height: 100 }, zIndex: 15, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "kpi-c4t", name: "Label4", type: "text", content: "Avg. Session", position: { x: 870, y: 165 }, size: { width: 130, height: 18 }, zIndex: 16, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "kpi-c4v", name: "Value4", type: "text", content: "4m 32s", position: { x: 870, y: 190 }, size: { width: 130, height: 30 }, zIndex: 17, styles: { color: "#fff", fontSize: "26px", fontWeight: "bold" } },
      { id: "kpi-c4p", name: "Pct4", type: "badge", content: "↑ 3.7%", position: { x: 1010, y: 200 }, size: { width: 55, height: 20 }, zIndex: 18, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "10px" } }
    ]
  },

  // --- E-COMMERCE ---
  {
    id: "template-cart-item",
    name: "Shopping Cart Item",
    description: "Single item row in a shopping cart",
    category: "E-commerce",
    tier: 'free',
    canvasSettings: { width: 800, height: 300, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "ci-bg", name: "Row", type: "card", position: { x: 100, y: 100 }, size: { width: 600, height: 100 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "ci-img", name: "Thumb", type: "image", src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200", position: { x: 115, y: 115 }, size: { width: 70, height: 70 }, zIndex: 2, styles: { borderRadius: "8px" } },
      { id: "ci-name", name: "Name", type: "text", content: "curated Watch", position: { x: 200, y: 115 }, size: { width: 200, height: 22 }, zIndex: 3, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "ci-var", name: "Variant", type: "text", content: "Color: Black · Size: One Size", position: { x: 200, y: 140 }, size: { width: 250, height: 18 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "ci-qty-minus", name: "Minus", type: "button", content: "−", variant: "outline", position: { x: 200, y: 165 }, size: { width: 28, height: 28 }, zIndex: 5, styles: { borderRadius: "6px", fontSize: "14px", color: "#fff", borderColor: "#27272a" } },
      { id: "ci-qty", name: "Qty", type: "text", content: "1", position: { x: 234, y: 167 }, size: { width: 30, height: 24 }, zIndex: 6, styles: { color: "#fff", fontSize: "14px", textAlign: "center" } },
      { id: "ci-qty-plus", name: "Plus", type: "button", content: "+", variant: "outline", position: { x: 270, y: 165 }, size: { width: 28, height: 28 }, zIndex: 7, styles: { borderRadius: "6px", fontSize: "14px", color: "#fff", borderColor: "#27272a" } },
      { id: "ci-price", name: "Price", type: "text", content: "$249.00", position: { x: 570, y: 130 }, size: { width: 110, height: 25 }, zIndex: 8, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold", textAlign: "right" } },
      { id: "ci-del", name: "Remove", type: "icon", iconName: "X", position: { x: 670, y: 110 }, size: { width: 16, height: 16 }, zIndex: 9, styles: { color: "#a1a1aa" } }
    ]
  },
  {
    id: "template-product-review",
    name: "Product Review",
    description: "Customer review with star rating",
    category: "E-commerce",
    tier: 'free',
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "rv-bg", name: "Card", type: "card", position: { x: 100, y: 80 }, size: { width: 400, height: 240 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "rv-av", name: "Avatar", type: "avatar", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", position: { x: 120, y: 100 }, size: { width: 44, height: 44 }, zIndex: 2, styles: {} },
      { id: "rv-name", name: "Name", type: "text", content: "Marcus Rivera", position: { x: 175, y: 100 }, size: { width: 200, height: 20 }, zIndex: 3, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "rv-date", name: "Date", type: "text", content: "Reviewed on Nov 3, 2026", position: { x: 175, y: 120 }, size: { width: 200, height: 18 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "rv-stars", name: "Rating", type: "rating", value: 5, position: { x: 120, y: 160 }, size: { width: 100, height: 22 }, zIndex: 5, styles: { color: "#eab308", fontSize: "16px" } },
      { id: "rv-badge", name: "Verified", type: "badge", content: "Verified Purchase", position: { x: 230, y: 162 }, size: { width: 110, height: 20 }, zIndex: 6, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "10px" } },
      { id: "rv-text", name: "Review", type: "text", content: "Absolutely love this product. The build quality is exceptional and it arrived much faster than expected. Would definitely recommend to anyone looking for curated quality.", position: { x: 120, y: 195 }, size: { width: 360, height: 65 }, zIndex: 7, styles: { color: "#d4d4d8", fontSize: "14px", lineHeight: "1.6" } },
      { id: "rv-helpful", name: "Helpful", type: "text", content: "24 people found this helpful", position: { x: 120, y: 275 }, size: { width: 250, height: 20 }, zIndex: 8, styles: { color: "#71717a", fontSize: "12px" } }
    ]
  },
  {
    id: "template-coupon-banner",
    name: "Coupon Code Banner",
    description: "Discount code entry with promo",
    category: "E-commerce",
    tier: 'free',
    canvasSettings: { width: 800, height: 300, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "cp-bg", name: "Banner", type: "card", position: { x: 100, y: 80 }, size: { width: 600, height: 140 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "dashed", borderWidth: "2px", borderColor: "#3f3f46" } },
      { id: "cp-emoji", name: "Badge", type: "text", content: "20% OFF", position: { x: 130, y: 112 }, size: { width: 70, height: 26 }, zIndex: 2, styles: { fontSize: "11px", fontWeight: "bold", color: "#a1a1aa", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "4px", textAlign: "center", paddingTop: "5px" } },
      { id: "cp-t", name: "Title", type: "text", content: "Get 20% Off Your First Order!", position: { x: 180, y: 105 }, size: { width: 300, height: 25 }, zIndex: 3, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "cp-d", name: "Desc", type: "text", content: "Use code below at checkout", position: { x: 180, y: 132 }, size: { width: 250, height: 18 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "13px" } },
      { id: "cp-code", name: "Code", type: "card", position: { x: 180, y: 160 }, size: { width: 160, height: 36 }, zIndex: 5, styles: { backgroundColor: "#18181b", borderRadius: "6px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "cp-code-text", name: "Code Text", type: "text", content: "WELCOME20", position: { x: 195, y: 167 }, size: { width: 120, height: 22 }, zIndex: 6, styles: { color: "#fafafa", fontSize: "14px", fontWeight: "bold", letterSpacing: "2px" } },
      { id: "cp-copy", name: "Copy", type: "button", content: "Copy Code", position: { x: 360, y: 160 }, size: { width: 100, height: 36 }, zIndex: 7, styles: { backgroundColor: "#fafafa", color: "#09090b", borderRadius: "6px", fontWeight: "bold", fontSize: "12px" } }
    ]
  },
  {
    id: "template-wishlist-card",
    name: "Wishlist Item",
    description: "Product saved to wishlist",
    category: "E-commerce",
    tier: 'free',
    canvasSettings: { width: 600, height: 500, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "wl-bg", name: "Card", type: "card", position: { x: 150, y: 50 }, size: { width: 300, height: 400 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "wl-img", name: "Image", type: "image", src: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400", position: { x: 150, y: 50 }, size: { width: 300, height: 220 }, zIndex: 2, styles: { borderRadiusTopLeft: "16px", borderRadiusTopRight: "16px" } },
      { id: "wl-heart", name: "Heart", type: "card", position: { x: 400, y: 70 }, size: { width: 32, height: 32 }, zIndex: 3, styles: { backgroundColor: "rgba(239,68,68,0.2)", borderRadius: "50%" } },
      { id: "wl-heart-icon", name: "Heart Icon", type: "icon", iconName: "Heart", position: { x: 404, y: 73 }, size: { width: 20, height: 20 }, zIndex: 4, styles: { color: "#ef4444" } },
      { id: "wl-name", name: "Name", type: "text", content: "Classic Leather Sneakers", position: { x: 170, y: 290 }, size: { width: 260, height: 22 }, zIndex: 5, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "wl-brand", name: "Brand", type: "text", content: "curated Collection", position: { x: 170, y: 315 }, size: { width: 200, height: 18 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "wl-price", name: "Price", type: "text", content: "$189.00", position: { x: 170, y: 345 }, size: { width: 100, height: 25 }, zIndex: 7, styles: { color: "#fff", fontSize: "20px", fontWeight: "bold" } },
      { id: "wl-old", name: "Old Price", type: "text", content: "$249.00", position: { x: 280, y: 350 }, size: { width: 70, height: 18 }, zIndex: 8, styles: { color: "#71717a", fontSize: "14px", textDecoration: "line-through" } },
      { id: "wl-btn", name: "Add to Cart", type: "button", content: "Move to Cart", position: { x: 170, y: 385 }, size: { width: 260, height: 40 }, zIndex: 9, styles: { backgroundColor: "#fff", color: "#000", fontWeight: "bold", borderRadius: "8px" } }
    ]
  },

  // --- LANDING ---
  {
    id: "template-cta-banner",
    name: "CTA Banner",
    description: "Full-width call to action section",
    category: "Landing",
    tier: 'free',
    canvasSettings: { width: 1200, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "cta-bg", name: "Bg", type: "card", position: { x: 100, y: 80 }, size: { width: 1000, height: 240 }, zIndex: 1, styles: { backgroundGradient: "linear-gradient(180deg, #18181b 0%, #09090b 100%)", backgroundColor: "#18181b", borderRadius: "24px" } },
      { id: "cta-title", name: "Title", type: "text", content: "Ready to get started?", position: { x: 200, y: 130 }, size: { width: 800, height: 50 }, zIndex: 2, styles: { color: "#fff", fontSize: "36px", fontWeight: "bold", textAlign: "center" } },
      { id: "cta-desc", name: "Desc", type: "text", content: "Join thousands of developers building amazing products with our platform.", position: { x: 300, y: 185 }, size: { width: 600, height: 25 }, zIndex: 3, styles: { color: "rgba(255,255,255,0.8)", fontSize: "16px", textAlign: "center" } },
      { id: "cta-btn1", name: "Primary", type: "button", content: "Start Free Trial", position: { x: 420, y: 230 }, size: { width: 160, height: 45 }, zIndex: 4, styles: { backgroundColor: "#fff", color: "#fafafa", fontWeight: "bold", borderRadius: "8px" } },
      { id: "cta-btn2", name: "Secondary", type: "button", content: "Contact Sales", variant: "outline", position: { x: 600, y: 230 }, size: { width: 160, height: 45 }, zIndex: 5, styles: { borderRadius: "8px", color: "#fff", borderColor: "rgba(255,255,255,0.3)" } }
    ]
  },
  {
    id: "template-logo-cloud",
    name: "Logo Cloud",
    description: "Trusted by leading companies section",
    category: "Landing",
    tier: 'free',
    canvasSettings: { width: 1200, height: 300, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "lc-label", name: "Label", type: "text", content: "TRUSTED BY LEADING TEAMS", position: { x: 350, y: 80 }, size: { width: 500, height: 20 }, zIndex: 1, styles: { color: "#71717a", fontSize: "12px", textAlign: "center", fontWeight: "bold", letterSpacing: "3px", textTransform: "uppercase" } },
      { id: "lc-1", name: "Logo1", type: "text", content: "Vercel", position: { x: 120, y: 140 }, size: { width: 120, height: 40 }, zIndex: 2, styles: { color: "#52525b", fontSize: "22px", fontWeight: "bold", textAlign: "center" } },
      { id: "lc-2", name: "Logo2", type: "text", content: "Stripe", position: { x: 280, y: 140 }, size: { width: 120, height: 40 }, zIndex: 3, styles: { color: "#52525b", fontSize: "22px", fontWeight: "bold", textAlign: "center" } },
      { id: "lc-3", name: "Logo3", type: "text", content: "GitHub", position: { x: 440, y: 140 }, size: { width: 120, height: 40 }, zIndex: 4, styles: { color: "#52525b", fontSize: "22px", fontWeight: "bold", textAlign: "center" } },
      { id: "lc-4", name: "Logo4", type: "text", content: "Figma", position: { x: 600, y: 140 }, size: { width: 120, height: 40 }, zIndex: 5, styles: { color: "#52525b", fontSize: "22px", fontWeight: "bold", textAlign: "center" } },
      { id: "lc-5", name: "Logo5", type: "text", content: "Linear", position: { x: 760, y: 140 }, size: { width: 120, height: 40 }, zIndex: 6, styles: { color: "#52525b", fontSize: "22px", fontWeight: "bold", textAlign: "center" } },
      { id: "lc-6", name: "Logo6", type: "text", content: "Notion", position: { x: 920, y: 140 }, size: { width: 120, height: 40 }, zIndex: 7, styles: { color: "#52525b", fontSize: "22px", fontWeight: "bold", textAlign: "center" } }
    ]
  },
  {
    id: "template-feature-grid",
    name: "Feature Grid",
    description: "Three-column feature highlights",
    category: "Landing",
    tier: 'free',
    canvasSettings: { width: 1200, height: 500, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "fg-title", name: "Section Title", type: "text", content: "Everything You Need", position: { x: 200, y: 60 }, size: { width: 800, height: 40 }, zIndex: 1, styles: { color: "#fff", fontSize: "32px", fontWeight: "bold", textAlign: "center" } },
      { id: "fg-desc", name: "Section Desc", type: "text", content: "A complete toolkit for modern development workflows", position: { x: 300, y: 105 }, size: { width: 600, height: 25 }, zIndex: 2, styles: { color: "#a1a1aa", fontSize: "16px", textAlign: "center" } },
      { id: "fg-c1", name: "Card1", type: "card", position: { x: 100, y: 170 }, size: { width: 320, height: 250 }, zIndex: 3, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "fg-i1", name: "Icon1", type: "text", content: "01", position: { x: 130, y: 200 }, size: { width: 32, height: 32 }, zIndex: 4, styles: { fontSize: "15px", fontWeight: "bold", color: "#a1a1aa", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "6px", textAlign: "center", paddingTop: "5px" } },
      { id: "fg-t1", name: "Title1", type: "text", content: "Lightning Fast", position: { x: 130, y: 250 }, size: { width: 260, height: 25 }, zIndex: 5, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "fg-d1", name: "Desc1", type: "text", content: "Optimized for speed with edge-first architecture and smart caching strategies.", position: { x: 130, y: 280 }, size: { width: 260, height: 50 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "14px", lineHeight: "1.6" } },
      { id: "fg-c2", name: "Card2", type: "card", position: { x: 440, y: 170 }, size: { width: 320, height: 250 }, zIndex: 7, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "fg-i2", name: "Icon2", type: "text", content: "02", position: { x: 470, y: 200 }, size: { width: 32, height: 32 }, zIndex: 8, styles: { fontSize: "15px", fontWeight: "bold", color: "#a1a1aa", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "6px", textAlign: "center", paddingTop: "5px" } },
      { id: "fg-t2", name: "Title2", type: "text", content: "Enterprise Security", position: { x: 470, y: 250 }, size: { width: 260, height: 25 }, zIndex: 9, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "fg-d2", name: "Desc2", type: "text", content: "SOC2 compliant with end-to-end encryption and role-based access controls.", position: { x: 470, y: 280 }, size: { width: 260, height: 50 }, zIndex: 10, styles: { color: "#a1a1aa", fontSize: "14px", lineHeight: "1.6" } },
      { id: "fg-c3", name: "Card3", type: "card", position: { x: 780, y: 170 }, size: { width: 320, height: 250 }, zIndex: 11, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "fg-i3", name: "Icon3", type: "text", content: "03", position: { x: 810, y: 200 }, size: { width: 32, height: 32 }, zIndex: 12, styles: { fontSize: "15px", fontWeight: "bold", color: "#a1a1aa", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "6px", textAlign: "center", paddingTop: "5px" } },
      { id: "fg-t3", name: "Title3", type: "text", content: "Fully Extensible", position: { x: 810, y: 250 }, size: { width: 260, height: 25 }, zIndex: 13, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "fg-d3", name: "Desc3", type: "text", content: "Plugin architecture that scales. Build custom integrations with our open API.", position: { x: 810, y: 280 }, size: { width: 260, height: 50 }, zIndex: 14, styles: { color: "#a1a1aa", fontSize: "14px", lineHeight: "1.6" } }
    ]
  },
  {
    id: "template-stats-counter",
    name: "Stats Counter Section",
    description: "Big number metrics showcase",
    category: "Landing",
    tier: 'free',
    canvasSettings: { width: 1200, height: 300, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "sc-bg", name: "Bg", type: "card", position: { x: 100, y: 60 }, size: { width: 1000, height: 180 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "20px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "sc-v1", name: "Val1", type: "text", content: "10M+", position: { x: 150, y: 100 }, size: { width: 180, height: 50 }, zIndex: 2, styles: { color: "#fff", fontSize: "42px", fontWeight: "bold", textAlign: "center" } },
      { id: "sc-l1", name: "Label1", type: "text", content: "Downloads", position: { x: 150, y: 155 }, size: { width: 180, height: 20 }, zIndex: 3, styles: { color: "#a1a1aa", fontSize: "14px", textAlign: "center" } },
      { id: "sc-div1", name: "Div1", type: "card", position: { x: 355, y: 100 }, size: { width: 1, height: 80 }, zIndex: 4, styles: { backgroundColor: "#27272a" } },
      { id: "sc-v2", name: "Val2", type: "text", content: "50K+", position: { x: 380, y: 100 }, size: { width: 180, height: 50 }, zIndex: 5, styles: { color: "#fff", fontSize: "42px", fontWeight: "bold", textAlign: "center" } },
      { id: "sc-l2", name: "Label2", type: "text", content: "Developers", position: { x: 380, y: 155 }, size: { width: 180, height: 20 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "14px", textAlign: "center" } },
      { id: "sc-div2", name: "Div2", type: "card", position: { x: 585, y: 100 }, size: { width: 1, height: 80 }, zIndex: 7, styles: { backgroundColor: "#27272a" } },
      { id: "sc-v3", name: "Val3", type: "text", content: "99.9%", position: { x: 610, y: 100 }, size: { width: 180, height: 50 }, zIndex: 8, styles: { color: "#fff", fontSize: "42px", fontWeight: "bold", textAlign: "center" } },
      { id: "sc-l3", name: "Label3", type: "text", content: "Uptime", position: { x: 610, y: 155 }, size: { width: 180, height: 20 }, zIndex: 9, styles: { color: "#a1a1aa", fontSize: "14px", textAlign: "center" } },
      { id: "sc-div3", name: "Div3", type: "card", position: { x: 815, y: 100 }, size: { width: 1, height: 80 }, zIndex: 10, styles: { backgroundColor: "#27272a" } },
      { id: "sc-v4", name: "Val4", type: "text", content: "200+", position: { x: 840, y: 100 }, size: { width: 180, height: 50 }, zIndex: 11, styles: { color: "#fff", fontSize: "42px", fontWeight: "bold", textAlign: "center" } },
      { id: "sc-l4", name: "Label4", type: "text", content: "Components", position: { x: 840, y: 155 }, size: { width: 180, height: 20 }, zIndex: 12, styles: { color: "#a1a1aa", fontSize: "14px", textAlign: "center" } }
    ]
  },

  // --- FORMS ---
  {
    id: "template-contact-form",
    name: "Contact Form",
    description: "Name, email, and message form",
    category: "Forms",
    tier: 'free',
    canvasSettings: { width: 800, height: 800, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "cf-bg", name: "Card", type: "card", position: { x: 200, y: 50 }, size: { width: 400, height: 680 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "cf-t", name: "Title", type: "text", content: "Get in Touch", position: { x: 230, y: 90 }, size: { width: 340, height: 30 }, zIndex: 2, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold", textAlign: "center" } },
      { id: "cf-d", name: "Desc", type: "text", content: "We'd love to hear from you. Send us a message.", position: { x: 230, y: 125 }, size: { width: 340, height: 20 }, zIndex: 3, styles: { color: "#a1a1aa", fontSize: "14px", textAlign: "center" } },
      { id: "cf-nl", name: "Name Label", type: "text", content: "Full Name", position: { x: 240, y: 175 }, size: { width: 100, height: 18 }, zIndex: 4, styles: { color: "#fff", fontSize: "12px", fontWeight: "bold" } },
      { id: "cf-ni", name: "Name Input", type: "input", placeholder: "Elena Rostova", position: { x: 240, y: 198 }, size: { width: 320, height: 40 }, zIndex: 5, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "cf-el", name: "Email Label", type: "text", content: "Email Address", position: { x: 240, y: 258 }, size: { width: 100, height: 18 }, zIndex: 6, styles: { color: "#fff", fontSize: "12px", fontWeight: "bold" } },
      { id: "cf-ei", name: "Email Input", type: "input", placeholder: "elena@nexore.dev", position: { x: 240, y: 281 }, size: { width: 320, height: 40 }, zIndex: 7, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "cf-sl", name: "Subject Label", type: "text", content: "Subject", position: { x: 240, y: 341 }, size: { width: 100, height: 18 }, zIndex: 8, styles: { color: "#fff", fontSize: "12px", fontWeight: "bold" } },
      { id: "cf-si", name: "Subject Input", type: "input", placeholder: "How can we help?", position: { x: 240, y: 364 }, size: { width: 320, height: 40 }, zIndex: 9, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "cf-ml", name: "Message Label", type: "text", content: "Message", position: { x: 240, y: 424 }, size: { width: 100, height: 18 }, zIndex: 10, styles: { color: "#fff", fontSize: "12px", fontWeight: "bold" } },
      { id: "cf-mi", name: "Message Area", type: "card", position: { x: 240, y: 447 }, size: { width: 320, height: 120 }, zIndex: 11, styles: { backgroundColor: "#18181b", borderRadius: "6px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "cf-mi-ph", name: "Msg Placeholder", type: "text", content: "Tell us more about your project...", position: { x: 250, y: 460 }, size: { width: 300, height: 18 }, zIndex: 12, styles: { color: "#52525b", fontSize: "14px" } },
      { id: "cf-btn", name: "Send Button", type: "button", content: "Send Message", position: { x: 240, y: 590 }, size: { width: 320, height: 45 }, zIndex: 13, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "bold", borderRadius: "8px" } },
      { id: "cf-note", name: "Note", type: "text", content: "We'll get back to you within 24 hours.", position: { x: 240, y: 650 }, size: { width: 320, height: 18 }, zIndex: 14, styles: { color: "#71717a", fontSize: "12px", textAlign: "center" } }
    ]
  },
  {
    id: "template-search-bar",
    name: "Search Bar",
    description: "Search input with filter options",
    category: "Forms",
    tier: 'free',
    canvasSettings: { width: 800, height: 300, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "srch-bg", name: "Container", type: "card", position: { x: 100, y: 100 }, size: { width: 600, height: 60 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "srch-icon", name: "Icon", type: "text", content: "⌕", position: { x: 120, y: 115 }, size: { width: 24, height: 24 }, zIndex: 2, styles: { fontSize: "20px", color: "#71717a" } },
      { id: "srch-input", name: "Input", type: "input", placeholder: "Search components, templates, docs...", position: { x: 150, y: 110 }, size: { width: 340, height: 40 }, zIndex: 3, styles: { backgroundColor: "transparent", color: "#fff", borderRadius: "0px" } },
      { id: "srch-kbd", name: "Shortcut", type: "card", position: { x: 510, y: 115 }, size: { width: 60, height: 28 }, zIndex: 4, styles: { backgroundColor: "#18181b", borderRadius: "6px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "srch-kbd-t", name: "Shortcut Text", type: "text", content: "⌘ K", position: { x: 515, y: 118 }, size: { width: 50, height: 22 }, zIndex: 5, styles: { color: "#71717a", fontSize: "12px", textAlign: "center" } },
      { id: "srch-btn", name: "Filter", type: "button", content: "Filter", variant: "outline", position: { x: 590, y: 112 }, size: { width: 90, height: 36 }, zIndex: 6, styles: { borderRadius: "6px", color: "#a1a1aa", borderColor: "#27272a", fontSize: "13px" } }
    ]
  },
  {
    id: "template-payment-form",
    name: "Payment Form",
    description: "Credit card payment entry",
    category: "Forms",
    tier: 'free',
    canvasSettings: { width: 800, height: 700, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pf-bg", name: "Card", type: "card", position: { x: 200, y: 50 }, size: { width: 400, height: 580 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pf-t", name: "Title", type: "text", content: "Payment Details", position: { x: 230, y: 80 }, size: { width: 340, height: 30 }, zIndex: 2, styles: { color: "#fff", fontSize: "22px", fontWeight: "bold" } },
      { id: "pf-d", name: "Desc", type: "text", content: "Enter your card information securely", position: { x: 230, y: 112 }, size: { width: 340, height: 18 }, zIndex: 3, styles: { color: "#a1a1aa", fontSize: "13px" } },
      { id: "pf-cards", name: "Card Logos", type: "text", content: "Visa · Mastercard · Amex", position: { x: 230, y: 150 }, size: { width: 300, height: 18 }, zIndex: 4, styles: { color: "#71717a", fontSize: "12px" } },
      { id: "pf-cl", name: "Card Label", type: "text", content: "Card Number", position: { x: 230, y: 190 }, size: { width: 100, height: 18 }, zIndex: 5, styles: { color: "#fff", fontSize: "12px", fontWeight: "bold" } },
      { id: "pf-ci", name: "Card Input", type: "input", placeholder: "4242 4242 4242 4242", position: { x: 230, y: 213 }, size: { width: 340, height: 42 }, zIndex: 6, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "8px" } },
      { id: "pf-nl", name: "Name Label", type: "text", content: "Cardholder Name", position: { x: 230, y: 275 }, size: { width: 130, height: 18 }, zIndex: 7, styles: { color: "#fff", fontSize: "12px", fontWeight: "bold" } },
      { id: "pf-ni", name: "Name Input", type: "input", placeholder: "Elena Rostova", position: { x: 230, y: 298 }, size: { width: 340, height: 42 }, zIndex: 8, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "8px" } },
      { id: "pf-exl", name: "Expiry Label", type: "text", content: "Expiry Date", position: { x: 230, y: 360 }, size: { width: 100, height: 18 }, zIndex: 9, styles: { color: "#fff", fontSize: "12px", fontWeight: "bold" } },
      { id: "pf-exi", name: "Expiry Input", type: "input", placeholder: "MM / YY", position: { x: 230, y: 383 }, size: { width: 160, height: 42 }, zIndex: 10, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "8px" } },
      { id: "pf-cvl", name: "CVC Label", type: "text", content: "CVC", position: { x: 410, y: 360 }, size: { width: 50, height: 18 }, zIndex: 11, styles: { color: "#fff", fontSize: "12px", fontWeight: "bold" } },
      { id: "pf-cvi", name: "CVC Input", type: "input", placeholder: "123", position: { x: 410, y: 383 }, size: { width: 160, height: 42 }, zIndex: 12, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "8px" } },
      { id: "pf-div", name: "Divider", type: "divider", position: { x: 230, y: 450 }, size: { width: 340, height: 1 }, zIndex: 13, styles: { backgroundColor: "#27272a" } },
      { id: "pf-total-l", name: "Total Label", type: "text", content: "Total", position: { x: 230, y: 470 }, size: { width: 100, height: 25 }, zIndex: 14, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "pf-total-v", name: "Total Value", type: "text", content: "$99.00", position: { x: 480, y: 470 }, size: { width: 90, height: 25 }, zIndex: 15, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold", textAlign: "right" } },
      { id: "pf-btn", name: "Pay Button", type: "button", content: "Pay Now — $99.00", position: { x: 230, y: 520 }, size: { width: 340, height: 48 }, zIndex: 16, styles: { backgroundColor: "#22c55e", color: "#fff", fontWeight: "bold", borderRadius: "8px" } },
      { id: "pf-secure", name: "Secure", type: "text", content: "Secured by 256-bit SSL encryption", position: { x: 230, y: 580 }, size: { width: 340, height: 18 }, zIndex: 17, styles: { color: "#71717a", fontSize: "11px", textAlign: "center" } }
    ]
  },
  {
    id: "template-otp-verify",
    name: "OTP Verification",
    description: "Code verification input screen",
    category: "Forms",
    tier: 'free',
    canvasSettings: { width: 600, height: 500, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "otp-bg", name: "Card", type: "card", position: { x: 100, y: 80 }, size: { width: 400, height: 340 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "otp-icon", name: "Icon", type: "text", content: "@", position: { x: 100, y: 110 }, size: { width: 400, height: 40 }, zIndex: 2, styles: { fontSize: "28px", textAlign: "center", color: "#a1a1aa", fontWeight: "bold" } },
      { id: "otp-t", name: "Title", type: "text", content: "Verify Your Email", position: { x: 100, y: 155 }, size: { width: 400, height: 30 }, zIndex: 3, styles: { color: "#fff", fontSize: "22px", fontWeight: "bold", textAlign: "center" } },
      { id: "otp-d", name: "Desc", type: "text", content: "We sent a 6-digit code to elena@nexore.dev", position: { x: 100, y: 190 }, size: { width: 400, height: 20 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "13px", textAlign: "center" } },
      { id: "otp-b1", name: "Box1", type: "card", position: { x: 140, y: 235 }, size: { width: 45, height: 55 }, zIndex: 5, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "2px", borderColor: "#3f3f46" } },
      { id: "otp-n1", name: "Num1", type: "text", content: "4", position: { x: 140, y: 245 }, size: { width: 45, height: 35 }, zIndex: 6, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold", textAlign: "center" } },
      { id: "otp-b2", name: "Box2", type: "card", position: { x: 195, y: 235 }, size: { width: 45, height: 55 }, zIndex: 7, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "2px", borderColor: "#3f3f46" } },
      { id: "otp-n2", name: "Num2", type: "text", content: "8", position: { x: 195, y: 245 }, size: { width: 45, height: 35 }, zIndex: 8, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold", textAlign: "center" } },
      { id: "otp-b3", name: "Box3", type: "card", position: { x: 250, y: 235 }, size: { width: 45, height: 55 }, zIndex: 9, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "2px", borderColor: "#3f3f46" } },
      { id: "otp-n3", name: "Num3", type: "text", content: "2", position: { x: 250, y: 245 }, size: { width: 45, height: 35 }, zIndex: 10, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold", textAlign: "center" } },
      { id: "otp-b4", name: "Box4", type: "card", position: { x: 305, y: 235 }, size: { width: 45, height: 55 }, zIndex: 11, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "otp-b5", name: "Box5", type: "card", position: { x: 360, y: 235 }, size: { width: 45, height: 55 }, zIndex: 12, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "otp-b6", name: "Box6", type: "card", position: { x: 415, y: 235 }, size: { width: 45, height: 55 }, zIndex: 13, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "otp-btn", name: "Verify", type: "button", content: "Verify Code", position: { x: 140, y: 310 }, size: { width: 320, height: 42 }, zIndex: 14, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "bold", borderRadius: "8px" } },
      { id: "otp-resend", name: "Resend", type: "text", content: "Didn't receive code? Resend", position: { x: 140, y: 365 }, size: { width: 320, height: 18 }, zIndex: 15, styles: { color: "#71717a", fontSize: "12px", textAlign: "center" } }
    ]
  },

  // --- SOCIAL ---
  {
    id: "template-story-circles",
    name: "Story Circles",
    description: "Row of user story avatars",
    category: "Social",
    tier: 'free',
    canvasSettings: { width: 800, height: 250, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "stry-t", name: "Title", type: "text", content: "Stories", position: { x: 100, y: 50 }, size: { width: 100, height: 25 }, zIndex: 1, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "stry-r1", name: "Ring1", type: "card", position: { x: 100, y: 90 }, size: { width: 68, height: 68 }, zIndex: 2, styles: { borderRadius: "50%", backgroundGradient: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", backgroundColor: "#e6683c" } },
      { id: "stry-a1", name: "Avatar1", type: "avatar", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", position: { x: 103, y: 93 }, size: { width: 62, height: 62 }, zIndex: 3, styles: { borderStyle: "solid", borderWidth: "3px", borderColor: "#09090b" } },
      { id: "stry-n1", name: "Name1", type: "text", content: "sarah_j", position: { x: 100, y: 165 }, size: { width: 68, height: 16 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "10px", textAlign: "center" } },
      { id: "stry-r2", name: "Ring2", type: "card", position: { x: 190, y: 90 }, size: { width: 68, height: 68 }, zIndex: 5, styles: { borderRadius: "50%", backgroundGradient: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", backgroundColor: "#dc2743" } },
      { id: "stry-a2", name: "Avatar2", type: "avatar", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", position: { x: 193, y: 93 }, size: { width: 62, height: 62 }, zIndex: 6, styles: { borderStyle: "solid", borderWidth: "3px", borderColor: "#09090b" } },
      { id: "stry-n2", name: "Name2", type: "text", content: "marcus", position: { x: 190, y: 165 }, size: { width: 68, height: 16 }, zIndex: 7, styles: { color: "#a1a1aa", fontSize: "10px", textAlign: "center" } },
      { id: "stry-r3", name: "Ring3", type: "card", position: { x: 280, y: 90 }, size: { width: 68, height: 68 }, zIndex: 8, styles: { borderRadius: "50%", backgroundGradient: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", backgroundColor: "#cc2366" } },
      { id: "stry-a3", name: "Avatar3", type: "avatar", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", position: { x: 283, y: 93 }, size: { width: 62, height: 62 }, zIndex: 9, styles: { borderStyle: "solid", borderWidth: "3px", borderColor: "#09090b" } },
      { id: "stry-n3", name: "Name3", type: "text", content: "emily_c", position: { x: 280, y: 165 }, size: { width: 68, height: 16 }, zIndex: 10, styles: { color: "#a1a1aa", fontSize: "10px", textAlign: "center" } },
      { id: "stry-r4", name: "Ring4", type: "card", position: { x: 370, y: 90 }, size: { width: 68, height: 68 }, zIndex: 11, styles: { borderRadius: "50%", backgroundColor: "#27272a" } },
      { id: "stry-a4", name: "Avatar4", type: "avatar", src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100", position: { x: 373, y: 93 }, size: { width: 62, height: 62 }, zIndex: 12, styles: { borderStyle: "solid", borderWidth: "3px", borderColor: "#09090b" } },
      { id: "stry-n4", name: "Name4", type: "text", content: "jackson", position: { x: 370, y: 165 }, size: { width: 68, height: 16 }, zIndex: 13, styles: { color: "#71717a", fontSize: "10px", textAlign: "center" } },
      { id: "stry-r5", name: "Ring5", type: "card", position: { x: 460, y: 90 }, size: { width: 68, height: 68 }, zIndex: 14, styles: { borderRadius: "50%", backgroundColor: "#27272a" } },
      { id: "stry-a5", name: "Avatar5", type: "avatar", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100", position: { x: 463, y: 93 }, size: { width: 62, height: 62 }, zIndex: 15, styles: { borderStyle: "solid", borderWidth: "3px", borderColor: "#09090b" } },
      { id: "stry-n5", name: "Name5", type: "text", content: "lisa_m", position: { x: 460, y: 165 }, size: { width: 68, height: 16 }, zIndex: 16, styles: { color: "#71717a", fontSize: "10px", textAlign: "center" } }
    ]
  },
  {
    id: "template-notification-list",
    name: "Notification List",
    description: "Recent notifications panel",
    category: "Social",
    tier: 'free',
    canvasSettings: { width: 600, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "nl2-bg", name: "Panel", type: "card", position: { x: 100, y: 50 }, size: { width: 400, height: 500 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "nl2-t", name: "Title", type: "text", content: "Notifications", position: { x: 130, y: 80 }, size: { width: 200, height: 25 }, zIndex: 2, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "nl2-badge", name: "Count", type: "badge", content: "3 new", position: { x: 410, y: 82 }, size: { width: 50, height: 20 }, zIndex: 3, styles: { backgroundColor: "rgba(255,255,255,0.06)", color: "#fafafa", fontSize: "10px" } },
      { id: "nl2-div0", name: "Divider", type: "divider", position: { x: 100, y: 120 }, size: { width: 400, height: 1 }, zIndex: 4, styles: { backgroundColor: "#27272a" } },
      { id: "nl2-n1-bg", name: "Item1 Bg", type: "card", position: { x: 100, y: 121 }, size: { width: 400, height: 80 }, zIndex: 5, styles: { backgroundColor: "rgba(255,255,255,0.06)" } },
      { id: "nl2-n1-dot", name: "Dot1", type: "card", position: { x: 120, y: 150 }, size: { width: 8, height: 8 }, zIndex: 6, styles: { backgroundColor: "#27272a", borderRadius: "50%" } },
      { id: "nl2-n1-av", name: "Avatar1", type: "avatar", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80", position: { x: 140, y: 136 }, size: { width: 36, height: 36 }, zIndex: 7, styles: {} },
      { id: "nl2-n1-t", name: "Notif1 Title", type: "text", content: "Sarah Jenkins liked your post", position: { x: 190, y: 135 }, size: { width: 280, height: 18 }, zIndex: 8, styles: { color: "#fff", fontSize: "13px", fontWeight: "bold" } },
      { id: "nl2-n1-d", name: "Notif1 Time", type: "text", content: "2 minutes ago", position: { x: 190, y: 155 }, size: { width: 280, height: 16 }, zIndex: 9, styles: { color: "#71717a", fontSize: "11px" } },
      { id: "nl2-n2-bg", name: "Item2 Bg", type: "card", position: { x: 100, y: 201 }, size: { width: 400, height: 80 }, zIndex: 10, styles: { backgroundColor: "rgba(255,255,255,0.06)" } },
      { id: "nl2-n2-dot", name: "Dot2", type: "card", position: { x: 120, y: 230 }, size: { width: 8, height: 8 }, zIndex: 11, styles: { backgroundColor: "#27272a", borderRadius: "50%" } },
      { id: "nl2-n2-av", name: "Avatar2", type: "avatar", src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80", position: { x: 140, y: 216 }, size: { width: 36, height: 36 }, zIndex: 12, styles: {} },
      { id: "nl2-n2-t", name: "Notif2 Title", type: "text", content: "Jackson Lee started following you", position: { x: 190, y: 215 }, size: { width: 280, height: 18 }, zIndex: 13, styles: { color: "#fff", fontSize: "13px", fontWeight: "bold" } },
      { id: "nl2-n2-d", name: "Notif2 Time", type: "text", content: "15 minutes ago", position: { x: 190, y: 235 }, size: { width: 280, height: 16 }, zIndex: 14, styles: { color: "#71717a", fontSize: "11px" } },
      { id: "nl2-n3-av", name: "Avatar3", type: "avatar", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80", position: { x: 140, y: 296 }, size: { width: 36, height: 36 }, zIndex: 15, styles: {} },
      { id: "nl2-n3-t", name: "Notif3 Title", type: "text", content: "Emily commented on your project", position: { x: 190, y: 295 }, size: { width: 280, height: 18 }, zIndex: 16, styles: { color: "#fff", fontSize: "13px" } },
      { id: "nl2-n3-d", name: "Notif3 Time", type: "text", content: "1 hour ago", position: { x: 190, y: 315 }, size: { width: 280, height: 16 }, zIndex: 17, styles: { color: "#71717a", fontSize: "11px" } },
      { id: "nl2-n4-av", name: "Avatar4", type: "avatar", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", position: { x: 140, y: 376 }, size: { width: 36, height: 36 }, zIndex: 18, styles: {} },
      { id: "nl2-n4-t", name: "Notif4 Title", type: "text", content: "Marcus shared your article", position: { x: 190, y: 375 }, size: { width: 280, height: 18 }, zIndex: 19, styles: { color: "#fff", fontSize: "13px" } },
      { id: "nl2-n4-d", name: "Notif4 Time", type: "text", content: "3 hours ago", position: { x: 190, y: 395 }, size: { width: 280, height: 16 }, zIndex: 20, styles: { color: "#71717a", fontSize: "11px" } },
      { id: "nl2-all", name: "View All", type: "text", content: "View all notifications →", position: { x: 100, y: 460 }, size: { width: 400, height: 20 }, zIndex: 21, styles: { color: "#fafafa", fontSize: "13px", textAlign: "center", fontWeight: "bold" } }
    ]
  },
  {
    id: "template-leaderboard",
    name: "User Leaderboard",
    description: "Ranking list with scores",
    category: "Social",
    tier: 'free',
    canvasSettings: { width: 600, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "lb-bg", name: "Card", type: "card", position: { x: 100, y: 50 }, size: { width: 400, height: 500 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "lb-t", name: "Title", type: "text", content: "Leaderboard", position: { x: 130, y: 80 }, size: { width: 200, height: 25 }, zIndex: 2, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "lb-period", name: "Period", type: "badge", content: "This Week", position: { x: 400, y: 82 }, size: { width: 70, height: 22 }, zIndex: 3, styles: { backgroundColor: "#18181b", color: "#a1a1aa", fontSize: "10px", borderRadius: "100px" } },
      { id: "lb-div", name: "Divider", type: "divider", position: { x: 100, y: 120 }, size: { width: 400, height: 1 }, zIndex: 4, styles: { backgroundColor: "#27272a" } },
      { id: "lb-r1", name: "Rank1", type: "text", content: "1", position: { x: 120, y: 145 }, size: { width: 24, height: 24 }, zIndex: 5, styles: { color: "#eab308", fontSize: "16px", fontWeight: "bold", textAlign: "center" } },
      { id: "lb-a1", name: "Avatar1", type: "avatar", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80", position: { x: 155, y: 140 }, size: { width: 36, height: 36 }, zIndex: 6, styles: {} },
      { id: "lb-n1", name: "Name1", type: "text", content: "Sarah Jenkins", position: { x: 205, y: 140 }, size: { width: 150, height: 18 }, zIndex: 7, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "lb-p1", name: "Points1", type: "text", content: "2,847 pts", position: { x: 400, y: 145 }, size: { width: 80, height: 18 }, zIndex: 8, styles: { color: "#eab308", fontSize: "14px", fontWeight: "bold", textAlign: "right" } },
      { id: "lb-r2", name: "Rank2", type: "text", content: "2", position: { x: 120, y: 205 }, size: { width: 24, height: 24 }, zIndex: 9, styles: { color: "#a1a1aa", fontSize: "16px", fontWeight: "bold", textAlign: "center" } },
      { id: "lb-a2", name: "Avatar2", type: "avatar", src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80", position: { x: 155, y: 200 }, size: { width: 36, height: 36 }, zIndex: 10, styles: {} },
      { id: "lb-n2", name: "Name2", type: "text", content: "Jackson Lee", position: { x: 205, y: 200 }, size: { width: 150, height: 18 }, zIndex: 11, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "lb-p2", name: "Points2", type: "text", content: "2,341 pts", position: { x: 400, y: 205 }, size: { width: 80, height: 18 }, zIndex: 12, styles: { color: "#a1a1aa", fontSize: "14px", fontWeight: "bold", textAlign: "right" } },
      { id: "lb-r3", name: "Rank3", type: "text", content: "3", position: { x: 120, y: 265 }, size: { width: 24, height: 24 }, zIndex: 13, styles: { color: "#cd7f32", fontSize: "16px", fontWeight: "bold", textAlign: "center" } },
      { id: "lb-a3", name: "Avatar3", type: "avatar", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80", position: { x: 155, y: 260 }, size: { width: 36, height: 36 }, zIndex: 14, styles: {} },
      { id: "lb-n3", name: "Name3", type: "text", content: "Emily Chen", position: { x: 205, y: 260 }, size: { width: 150, height: 18 }, zIndex: 15, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "lb-p3", name: "Points3", type: "text", content: "2,105 pts", position: { x: 400, y: 265 }, size: { width: 80, height: 18 }, zIndex: 16, styles: { color: "#cd7f32", fontSize: "14px", fontWeight: "bold", textAlign: "right" } },
      { id: "lb-r4", name: "Rank4", type: "text", content: "4", position: { x: 120, y: 325 }, size: { width: 24, height: 24 }, zIndex: 17, styles: { color: "#71717a", fontSize: "16px", fontWeight: "bold", textAlign: "center" } },
      { id: "lb-a4", name: "Avatar4", type: "avatar", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", position: { x: 155, y: 320 }, size: { width: 36, height: 36 }, zIndex: 18, styles: {} },
      { id: "lb-n4", name: "Name4", type: "text", content: "Marcus Rivera", position: { x: 205, y: 320 }, size: { width: 150, height: 18 }, zIndex: 19, styles: { color: "#fff", fontSize: "14px" } },
      { id: "lb-p4", name: "Points4", type: "text", content: "1,892 pts", position: { x: 400, y: 325 }, size: { width: 80, height: 18 }, zIndex: 20, styles: { color: "#71717a", fontSize: "14px", textAlign: "right" } },
      { id: "lb-r5", name: "Rank5", type: "text", content: "5", position: { x: 120, y: 385 }, size: { width: 24, height: 24 }, zIndex: 21, styles: { color: "#71717a", fontSize: "16px", fontWeight: "bold", textAlign: "center" } },
      { id: "lb-a5", name: "Avatar5", type: "avatar", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80", position: { x: 155, y: 380 }, size: { width: 36, height: 36 }, zIndex: 22, styles: {} },
      { id: "lb-n5", name: "Name5", type: "text", content: "Lisa Martinez", position: { x: 205, y: 380 }, size: { width: 150, height: 18 }, zIndex: 23, styles: { color: "#fff", fontSize: "14px" } },
      { id: "lb-p5", name: "Points5", type: "text", content: "1,654 pts", position: { x: 400, y: 385 }, size: { width: 80, height: 18 }, zIndex: 24, styles: { color: "#71717a", fontSize: "14px", textAlign: "right" } }
    ]
  },

  // --- CARDS ---
  {
    id: "template-file-upload",
    name: "File Upload",
    description: "Drag-and-drop upload area",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 500, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "fu-bg", name: "Card", type: "card", position: { x: 100, y: 80 }, size: { width: 400, height: 340 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "fu-t", name: "Title", type: "text", content: "Upload Files", position: { x: 130, y: 100 }, size: { width: 200, height: 25 }, zIndex: 2, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "fu-drop", name: "Drop Zone", type: "card", position: { x: 130, y: 140 }, size: { width: 340, height: 160 }, zIndex: 3, styles: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "12px", borderStyle: "dashed", borderWidth: "2px", borderColor: "#27272a" } },
      { id: "fu-icon", name: "Upload Icon", type: "text", content: "↑", position: { x: 130, y: 170 }, size: { width: 340, height: 40 }, zIndex: 4, styles: { fontSize: "32px", textAlign: "center", color: "#a1a1aa", fontWeight: "bold" } },
      { id: "fu-hint", name: "Hint", type: "text", content: "Drag & drop files here, or click to browse", position: { x: 130, y: 215 }, size: { width: 340, height: 20 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "14px", textAlign: "center" } },
      { id: "fu-types", name: "Types", type: "text", content: "SVG, PNG, JPG or PDF (max. 10MB)", position: { x: 130, y: 240 }, size: { width: 340, height: 18 }, zIndex: 6, styles: { color: "#71717a", fontSize: "12px", textAlign: "center" } },
      { id: "fu-file", name: "File Item", type: "card", position: { x: 130, y: 320 }, size: { width: 340, height: 50 }, zIndex: 7, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "fu-file-icon", name: "File Icon", type: "text", content: "DOC", position: { x: 145, y: 334 }, size: { width: 28, height: 20 }, zIndex: 8, styles: { fontSize: "10px", fontWeight: "bold", color: "#a1a1aa", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "4px", textAlign: "center", paddingTop: "3px" } },
      { id: "fu-file-name", name: "File Name", type: "text", content: "design-system.fig", position: { x: 175, y: 328 }, size: { width: 200, height: 18 }, zIndex: 9, styles: { color: "#fff", fontSize: "13px", fontWeight: "bold" } },
      { id: "fu-file-size", name: "File Size", type: "text", content: "4.2 MB", position: { x: 175, y: 346 }, size: { width: 100, height: 16 }, zIndex: 10, styles: { color: "#71717a", fontSize: "11px" } },
      { id: "fu-progress", name: "Progress", type: "progress", value: 65, position: { x: 350, y: 340 }, size: { width: 100, height: 6 }, zIndex: 11, styles: { borderRadius: "3px" } }
    ]
  },
  {
    id: "template-calendar-event",
    name: "Calendar Event",
    description: "Event card with time and details",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "ce-bg", name: "Card", type: "card", position: { x: 150, y: 80 }, size: { width: 300, height: 240 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "ce-accent", name: "Accent", type: "card", position: { x: 150, y: 80 }, size: { width: 4, height: 240 }, zIndex: 2, styles: { backgroundColor: "#3b82f6", borderRadiusTopLeft: "12px", borderRadiusBottomLeft: "12px" } },
      { id: "ce-date", name: "Date", type: "text", content: "NOV 15", position: { x: 175, y: 100 }, size: { width: 60, height: 18 }, zIndex: 3, styles: { color: "#3b82f6", fontSize: "11px", fontWeight: "bold", letterSpacing: "1px" } },
      { id: "ce-title", name: "Title", type: "text", content: "Design Review Meeting", position: { x: 175, y: 125 }, size: { width: 250, height: 25 }, zIndex: 4, styles: { color: "#fff", fontSize: "18px", fontWeight: "bold" } },
      { id: "ce-time", name: "Time", type: "text", content: "2:00 PM — 3:30 PM", position: { x: 175, y: 160 }, size: { width: 250, height: 18 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "13px" } },
      { id: "ce-loc", name: "Location", type: "text", content: "Conference Room B", position: { x: 175, y: 185 }, size: { width: 250, height: 18 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "13px" } },
      { id: "ce-div", name: "Divider", type: "divider", position: { x: 175, y: 215 }, size: { width: 250, height: 1 }, zIndex: 7, styles: { backgroundColor: "#27272a" } },
      { id: "ce-label", name: "Attendees", type: "text", content: "Attendees", position: { x: 175, y: 230 }, size: { width: 80, height: 16 }, zIndex: 8, styles: { color: "#71717a", fontSize: "11px" } },
      { id: "ce-a1", name: "Att1", type: "avatar", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60", position: { x: 175, y: 250 }, size: { width: 28, height: 28 }, zIndex: 9, styles: {} },
      { id: "ce-a2", name: "Att2", type: "avatar", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60", position: { x: 197, y: 250 }, size: { width: 28, height: 28 }, zIndex: 10, styles: {} },
      { id: "ce-a3", name: "Att3", type: "avatar", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60", position: { x: 219, y: 250 }, size: { width: 28, height: 28 }, zIndex: 11, styles: {} },
      { id: "ce-more", name: "More", type: "card", position: { x: 241, y: 250 }, size: { width: 28, height: 28 }, zIndex: 12, styles: { backgroundColor: "#27272a", borderRadius: "50%" } },
      { id: "ce-more-t", name: "More Text", type: "text", content: "+3", position: { x: 241, y: 254 }, size: { width: 28, height: 20 }, zIndex: 13, styles: { color: "#a1a1aa", fontSize: "10px", fontWeight: "bold", textAlign: "center" } }
    ]
  },
  {
    id: "template-crypto-ticker",
    name: "Crypto Ticker",
    description: "Cryptocurrency price card",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "ct-bg", name: "Card", type: "card", position: { x: 150, y: 100 }, size: { width: 300, height: 200 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "ct-icon", name: "BTC Icon", type: "text", content: "₿", position: { x: 175, y: 120 }, size: { width: 40, height: 40 }, zIndex: 2, styles: { color: "#f7931a", fontSize: "28px", fontWeight: "bold", backgroundColor: "rgba(247,147,26,0.1)", borderRadius: "10px", textAlign: "center" } },
      { id: "ct-name", name: "Name", type: "text", content: "Bitcoin", position: { x: 225, y: 120 }, size: { width: 100, height: 22 }, zIndex: 3, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "ct-sym", name: "Symbol", type: "text", content: "BTC", position: { x: 225, y: 142 }, size: { width: 50, height: 18 }, zIndex: 4, styles: { color: "#71717a", fontSize: "12px" } },
      { id: "ct-pct", name: "Change", type: "badge", content: "+5.24%", position: { x: 380, y: 125 }, size: { width: 60, height: 22 }, zIndex: 5, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "11px", fontWeight: "bold" } },
      { id: "ct-price", name: "Price", type: "text", content: "$67,842.50", position: { x: 175, y: 185 }, size: { width: 250, height: 35 }, zIndex: 6, styles: { color: "#fff", fontSize: "28px", fontWeight: "bold" } },
      { id: "ct-vol", name: "Volume", type: "text", content: "Vol: $28.4B · MCap: $1.32T", position: { x: 175, y: 225 }, size: { width: 250, height: 18 }, zIndex: 7, styles: { color: "#71717a", fontSize: "12px" } },
      { id: "ct-spark-bg", name: "Spark Bg", type: "card", position: { x: 175, y: 255 }, size: { width: 250, height: 30 }, zIndex: 8, styles: { backgroundColor: "rgba(34,197,94,0.05)", borderRadius: "4px" } },
      { id: "ct-spark-line", name: "Spark Line", type: "card", position: { x: 175, y: 270 }, size: { width: 250, height: 2 }, zIndex: 9, styles: { backgroundColor: "#4ade80", borderRadius: "1px" } }
    ]
  },
  {
    id: "template-team-member",
    name: "Team Member Card",
    description: "Team profile with role and socials",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 500, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "tm-bg", name: "Card", type: "card", position: { x: 150, y: 50 }, size: { width: 300, height: 380 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "20px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "tm-av", name: "Avatar", type: "avatar", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", position: { x: 240, y: 85 }, size: { width: 120, height: 120 }, zIndex: 2, styles: {} },
      { id: "tm-name", name: "Name", type: "text", content: "Alex Turner", position: { x: 150, y: 220 }, size: { width: 300, height: 25 }, zIndex: 3, styles: { color: "#fff", fontSize: "20px", fontWeight: "bold", textAlign: "center" } },
      { id: "tm-role", name: "Role", type: "text", content: "Senior Product Designer", position: { x: 150, y: 248 }, size: { width: 300, height: 20 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "14px", textAlign: "center" } },
      { id: "tm-badge", name: "Badge", type: "badge", content: "Design Team", position: { x: 238, y: 280 }, size: { width: 90, height: 22 }, zIndex: 5, styles: { backgroundColor: "rgba(59,130,246,0.1)", color: "#3b82f6", fontSize: "10px" } },
      { id: "tm-div", name: "Divider", type: "divider", position: { x: 175, y: 320 }, size: { width: 250, height: 1 }, zIndex: 6, styles: { backgroundColor: "#27272a" } },
      { id: "tm-s1", name: "Social1", type: "text", content: "X", position: { x: 230, y: 340 }, size: { width: 30, height: 30 }, zIndex: 7, styles: { color: "#a1a1aa", fontSize: "16px", textAlign: "center", backgroundColor: "#18181b", borderRadius: "6px" } },
      { id: "tm-s2", name: "Social2", type: "text", content: "in", position: { x: 270, y: 340 }, size: { width: 30, height: 30 }, zIndex: 8, styles: { color: "#a1a1aa", fontSize: "14px", textAlign: "center", fontWeight: "bold", backgroundColor: "#18181b", borderRadius: "6px" } },
      { id: "tm-s3", name: "Social3", type: "text", content: "gh", position: { x: 310, y: 340 }, size: { width: 30, height: 30 }, zIndex: 9, styles: { color: "#a1a1aa", fontSize: "13px", textAlign: "center", fontWeight: "bold", backgroundColor: "#18181b", borderRadius: "6px", paddingTop: "5px" } },
      { id: "tm-btn", name: "Message", type: "button", content: "Send Message", variant: "outline", position: { x: 185, y: 390 }, size: { width: 230, height: 36 }, zIndex: 10, styles: { borderRadius: "8px", color: "#fff", borderColor: "#27272a", fontSize: "13px" } }
    ]
  },
  {
    id: "template-cookie-consent",
    name: "Cookie Consent",
    description: "GDPR cookie consent banner",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 1000, height: 300, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "ck-bg", name: "Banner", type: "card", position: { x: 100, y: 100 }, size: { width: 800, height: 100 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "ck-icon", name: "Cookie", type: "text", content: "Notice", position: { x: 130, y: 132 }, size: { width: 50, height: 24 }, zIndex: 2, styles: { fontSize: "11px", fontWeight: "bold", color: "#a1a1aa", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "4px", textAlign: "center", paddingTop: "4px" } },
      { id: "ck-text", name: "Text", type: "text", content: "We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.", position: { x: 170, y: 125 }, size: { width: 450, height: 40 }, zIndex: 3, styles: { color: "#d4d4d8", fontSize: "13px", lineHeight: "1.5" } },
      { id: "ck-manage", name: "Manage", type: "button", content: "Manage Cookies", variant: "outline", position: { x: 660, y: 120 }, size: { width: 120, height: 36 }, zIndex: 4, styles: { borderRadius: "6px", color: "#a1a1aa", borderColor: "#27272a", fontSize: "12px" } },
      { id: "ck-accept", name: "Accept", type: "button", content: "Accept All", position: { x: 790, y: 120 }, size: { width: 90, height: 36 }, zIndex: 5, styles: { backgroundColor: "#fafafa", color: "#09090b", borderRadius: "6px", fontWeight: "bold", fontSize: "12px" } },
      { id: "ck-close", name: "Close", type: "icon", iconName: "X", position: { x: 870, y: 108 }, size: { width: 20, height: 20 }, zIndex: 6, styles: { color: "#71717a" } }
    ]
  },
  {
    id: "template-command-palette",
    name: "Command Palette",
    description: "Quick-action search modal",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "cmd-overlay", name: "Overlay", type: "card", position: { x: 0, y: 0 }, size: { width: 800, height: 600 }, zIndex: 1, styles: { backgroundColor: "rgba(0,0,0,0.6)" } },
      { id: "cmd-bg", name: "Modal", type: "card", position: { x: 150, y: 80 }, size: { width: 500, height: 400 }, zIndex: 2, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "cmd-input-bg", name: "Input Bg", type: "card", position: { x: 150, y: 80 }, size: { width: 500, height: 55 }, zIndex: 3, styles: { backgroundColor: "#18181b", borderRadiusTopLeft: "16px", borderRadiusTopRight: "16px", borderRadiusBottomLeft: "0px", borderRadiusBottomRight: "0px" } },
      { id: "cmd-icon", name: "Search Icon", type: "text", content: "⌕", position: { x: 170, y: 94 }, size: { width: 24, height: 24 }, zIndex: 4, styles: { fontSize: "18px", color: "#71717a" } },
      { id: "cmd-input", name: "Input", type: "input", placeholder: "Type a command or search...", position: { x: 200, y: 90 }, size: { width: 400, height: 36 }, zIndex: 5, styles: { backgroundColor: "transparent", color: "#fff" } },
      { id: "cmd-div1", name: "Divider", type: "divider", position: { x: 150, y: 135 }, size: { width: 500, height: 1 }, zIndex: 6, styles: { backgroundColor: "#27272a" } },
      { id: "cmd-label1", name: "Label", type: "text", content: "SUGGESTIONS", position: { x: 175, y: 150 }, size: { width: 150, height: 16 }, zIndex: 7, styles: { color: "#71717a", fontSize: "10px", fontWeight: "bold", letterSpacing: "1px" } },
      { id: "cmd-i1", name: "Item1", type: "card", position: { x: 165, y: 175 }, size: { width: 470, height: 40 }, zIndex: 8, styles: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "8px" } },
      { id: "cmd-i1-icon", name: "Item1 Icon", type: "icon", iconName: "FileText", position: { x: 180, y: 183 }, size: { width: 20, height: 20 }, zIndex: 9, styles: { color: "#fafafa" } },
      { id: "cmd-i1-t", name: "Item1 Text", type: "text", content: "Create New Document", position: { x: 210, y: 183 }, size: { width: 200, height: 20 }, zIndex: 10, styles: { color: "#fff", fontSize: "13px" } },
      { id: "cmd-i1-k", name: "Item1 Key", type: "text", content: "⌘ N", position: { x: 570, y: 183 }, size: { width: 50, height: 20 }, zIndex: 11, styles: { color: "#71717a", fontSize: "11px", textAlign: "right" } },
      { id: "cmd-i2", name: "Item2", type: "card", position: { x: 165, y: 225 }, size: { width: 470, height: 40 }, zIndex: 12, styles: { borderRadius: "8px" } },
      { id: "cmd-i2-icon", name: "Item2 Icon", type: "text", content: "◈", position: { x: 180, y: 233 }, size: { width: 20, height: 20 }, zIndex: 13, styles: { fontSize: "14px", color: "#71717a" } },
      { id: "cmd-i2-t", name: "Item2 Text", type: "text", content: "Open Project...", position: { x: 210, y: 233 }, size: { width: 200, height: 20 }, zIndex: 14, styles: { color: "#d4d4d8", fontSize: "13px" } },
      { id: "cmd-i2-k", name: "Item2 Key", type: "text", content: "⌘ O", position: { x: 570, y: 233 }, size: { width: 50, height: 20 }, zIndex: 15, styles: { color: "#71717a", fontSize: "11px", textAlign: "right" } },
      { id: "cmd-i3", name: "Item3", type: "card", position: { x: 165, y: 275 }, size: { width: 470, height: 40 }, zIndex: 16, styles: { borderRadius: "8px" } },
      { id: "cmd-i3-icon", name: "Item3 Icon", type: "icon", iconName: "Settings", position: { x: 180, y: 283 }, size: { width: 20, height: 20 }, zIndex: 17, styles: { color: "#71717a" } },
      { id: "cmd-i3-t", name: "Item3 Text", type: "text", content: "Open Settings", position: { x: 210, y: 283 }, size: { width: 200, height: 20 }, zIndex: 18, styles: { color: "#d4d4d8", fontSize: "13px" } },
      { id: "cmd-i3-k", name: "Item3 Key", type: "text", content: "⌘ ,", position: { x: 570, y: 283 }, size: { width: 50, height: 20 }, zIndex: 19, styles: { color: "#71717a", fontSize: "11px", textAlign: "right" } },
      { id: "cmd-i4", name: "Item4", type: "card", position: { x: 165, y: 325 }, size: { width: 470, height: 40 }, zIndex: 20, styles: { borderRadius: "8px" } },
      { id: "cmd-i4-icon", name: "Item4 Icon", type: "text", content: "◐", position: { x: 180, y: 333 }, size: { width: 20, height: 20 }, zIndex: 21, styles: { fontSize: "14px", color: "#71717a" } },
      { id: "cmd-i4-t", name: "Item4 Text", type: "text", content: "Toggle Theme", position: { x: 210, y: 333 }, size: { width: 200, height: 20 }, zIndex: 22, styles: { color: "#d4d4d8", fontSize: "13px" } },
      { id: "cmd-i4-k", name: "Item4 Key", type: "text", content: "⌘ T", position: { x: 570, y: 333 }, size: { width: 50, height: 20 }, zIndex: 23, styles: { color: "#71717a", fontSize: "11px", textAlign: "right" } },
      { id: "cmd-footer", name: "Footer", type: "text", content: "↑↓ Navigate · ↵ Select · Esc Close", position: { x: 150, y: 440 }, size: { width: 500, height: 20 }, zIndex: 24, styles: { color: "#52525b", fontSize: "11px", textAlign: "center" } }
    ]
  },
  {
    id: "template-onboarding-step",
    name: "Onboarding Step",
    description: "Step indicator with content",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "ob-bg", name: "Card", type: "card", position: { x: 150, y: 80 }, size: { width: 500, height: 440 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "20px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "ob-step-label", name: "Step Label", type: "text", content: "Step 2 of 4", position: { x: 180, y: 110 }, size: { width: 100, height: 18 }, zIndex: 2, styles: { color: "#fafafa", fontSize: "12px", fontWeight: "bold" } },
      { id: "ob-prog-bg", name: "Progress Bg", type: "card", position: { x: 180, y: 140 }, size: { width: 440, height: 4 }, zIndex: 3, styles: { backgroundColor: "#27272a", borderRadius: "2px" } },
      { id: "ob-prog-fill", name: "Progress Fill", type: "card", position: { x: 180, y: 140 }, size: { width: 220, height: 4 }, zIndex: 4, styles: { backgroundColor: "#27272a", borderRadius: "2px" } },
      { id: "ob-icon", name: "Icon", type: "text", content: "02", position: { x: 180, y: 175 }, size: { width: 44, height: 44 }, zIndex: 5, styles: { fontSize: "18px", fontWeight: "bold", color: "#a1a1aa", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "50%", textAlign: "center", paddingTop: "8px" } },
      { id: "ob-title", name: "Title", type: "text", content: "Tell Us About Yourself", position: { x: 180, y: 235 }, size: { width: 440, height: 30 }, zIndex: 6, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold" } },
      { id: "ob-desc", name: "Desc", type: "text", content: "Help us personalize your experience by sharing a few details.", position: { x: 180, y: 270 }, size: { width: 440, height: 20 }, zIndex: 7, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "ob-label", name: "Label", type: "text", content: "Display Name", position: { x: 180, y: 315 }, size: { width: 120, height: 18 }, zIndex: 8, styles: { color: "#fff", fontSize: "12px", fontWeight: "bold" } },
      { id: "ob-input", name: "Input", type: "input", placeholder: "Your name", position: { x: 180, y: 338 }, size: { width: 440, height: 42 }, zIndex: 9, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "8px" } },
      { id: "ob-label2", name: "Label2", type: "text", content: "What best describes you?", position: { x: 180, y: 400 }, size: { width: 200, height: 18 }, zIndex: 10, styles: { color: "#fff", fontSize: "12px", fontWeight: "bold" } },
      { id: "ob-opt1", name: "Option1", type: "card", position: { x: 180, y: 425 }, size: { width: 135, height: 36 }, zIndex: 11, styles: { backgroundColor: "#27272a", borderRadius: "8px" } },
      { id: "ob-opt1-t", name: "Opt1 Text", type: "text", content: "Developer", position: { x: 180, y: 432 }, size: { width: 135, height: 22 }, zIndex: 12, styles: { color: "#fff", fontSize: "13px", fontWeight: "bold", textAlign: "center" } },
      { id: "ob-opt2", name: "Option2", type: "card", position: { x: 325, y: 425 }, size: { width: 135, height: 36 }, zIndex: 13, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "ob-opt2-t", name: "Opt2 Text", type: "text", content: "Designer", position: { x: 325, y: 432 }, size: { width: 135, height: 22 }, zIndex: 14, styles: { color: "#a1a1aa", fontSize: "13px", textAlign: "center" } },
      { id: "ob-opt3", name: "Option3", type: "card", position: { x: 470, y: 425 }, size: { width: 135, height: 36 }, zIndex: 15, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "ob-opt3-t", name: "Opt3 Text", type: "text", content: "Manager", position: { x: 470, y: 432 }, size: { width: 135, height: 22 }, zIndex: 16, styles: { color: "#a1a1aa", fontSize: "13px", textAlign: "center" } },
      { id: "ob-next", name: "Next", type: "button", content: "Continue", position: { x: 480, y: 480 }, size: { width: 140, height: 40 }, zIndex: 17, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "bold", borderRadius: "8px" } },
      { id: "ob-skip", name: "Skip", type: "button", content: "Skip", variant: "ghost", position: { x: 380, y: 480 }, size: { width: 90, height: 40 }, zIndex: 18, styles: { color: "#71717a", borderRadius: "8px" } }
    ]
  },
  {
    id: "template-error-state",
    name: "Error State 404",
    description: "Page not found error screen",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "err-num", name: "404", type: "text", content: "404", position: { x: 100, y: 120 }, size: { width: 600, height: 120 }, zIndex: 1, styles: { color: "#18181b", fontSize: "140px", fontWeight: "bold", textAlign: "center" } },
      { id: "err-num-fg", name: "404 Fg", type: "text", content: "404", position: { x: 100, y: 125 }, size: { width: 600, height: 120 }, zIndex: 2, styles: { color: "#27272a", fontSize: "140px", fontWeight: "bold", textAlign: "center" } },
      { id: "err-t", name: "Title", type: "text", content: "Page Not Found", position: { x: 100, y: 260 }, size: { width: 600, height: 35 }, zIndex: 3, styles: { color: "#fff", fontSize: "28px", fontWeight: "bold", textAlign: "center" } },
      { id: "err-d", name: "Desc", type: "text", content: "Sorry, we couldn't find the page you're looking for. It might have been removed or the URL is incorrect.", position: { x: 200, y: 305 }, size: { width: 400, height: 50 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "15px", textAlign: "center", lineHeight: "1.6" } },
      { id: "err-btn1", name: "Home", type: "button", content: "Go Home", position: { x: 280, y: 380 }, size: { width: 120, height: 42 }, zIndex: 5, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "bold", borderRadius: "8px" } },
      { id: "err-btn2", name: "Back", type: "button", content: "Go Back", variant: "outline", position: { x: 415, y: 380 }, size: { width: 120, height: 42 }, zIndex: 6, styles: { borderRadius: "8px", color: "#a1a1aa", borderColor: "#27272a" } }
    ]
  },
  {
    id: "template-podcast-card",
    name: "Podcast Episode",
    description: "Podcast episode card with play button",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pod-bg", name: "Card", type: "card", position: { x: 100, y: 80 }, size: { width: 400, height: 240 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pod-img", name: "Cover", type: "image", src: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200", position: { x: 120, y: 100 }, size: { width: 80, height: 80 }, zIndex: 2, styles: { borderRadius: "12px" } },
      { id: "pod-ep", name: "Episode", type: "text", content: "EPISODE 47", position: { x: 220, y: 100 }, size: { width: 100, height: 16 }, zIndex: 3, styles: { color: "#fafafa", fontSize: "10px", fontWeight: "bold", letterSpacing: "1px" } },
      { id: "pod-t", name: "Title", type: "text", content: "The Future of Design Systems", position: { x: 220, y: 120 }, size: { width: 250, height: 25 }, zIndex: 4, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "pod-host", name: "Host", type: "text", content: "with Sarah Chen · 42 min", position: { x: 220, y: 148 }, size: { width: 200, height: 18 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "pod-desc", name: "Desc", type: "text", content: "Exploring how design tokens and component libraries are shaping the future of product development.", position: { x: 120, y: 200 }, size: { width: 360, height: 40 }, zIndex: 6, styles: { color: "#71717a", fontSize: "13px", lineHeight: "1.5" } },
      { id: "pod-div", name: "Divider", type: "divider", position: { x: 120, y: 250 }, size: { width: 360, height: 1 }, zIndex: 7, styles: { backgroundColor: "#27272a" } },
      { id: "pod-play", name: "Play", type: "button", content: "▶  Play Episode", position: { x: 120, y: 265 }, size: { width: 140, height: 36 }, zIndex: 8, styles: { backgroundColor: "#fafafa", color: "#09090b", borderRadius: "8px", fontWeight: "bold", fontSize: "12px" } },
      { id: "pod-save", name: "Save", type: "button", content: "Save", variant: "outline", position: { x: 275, y: 265 }, size: { width: 70, height: 36 }, zIndex: 9, styles: { borderRadius: "8px", color: "#a1a1aa", borderColor: "#27272a", fontSize: "12px" } },
      { id: "pod-share", name: "Share", type: "button", content: "Share", variant: "outline", position: { x: 355, y: 265 }, size: { width: 70, height: 36 }, zIndex: 10, styles: { borderRadius: "8px", color: "#a1a1aa", borderColor: "#27272a", fontSize: "12px" } }
    ]
  },
  {
    id: "template-ai-chat",
    name: "AI Chat Interface",
    description: "AI assistant conversation UI",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 700, height: 700, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "ai-bg", name: "Container", type: "card", position: { x: 100, y: 50 }, size: { width: 500, height: 600 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "ai-header", name: "Header", type: "card", position: { x: 100, y: 50 }, size: { width: 500, height: 55 }, zIndex: 2, styles: { backgroundColor: "#18181b", borderRadiusTopLeft: "16px", borderRadiusTopRight: "16px", borderRadiusBottomLeft: "0px", borderRadiusBottomRight: "0px", borderStyle: "solid", borderWidth: "0 0 1px 0", borderColor: "#27272a" } },
      { id: "ai-logo", name: "Logo", type: "icon", iconName: "Bot", position: { x: 120, y: 66 }, size: { width: 24, height: 24 }, zIndex: 3, styles: { color: "#fafafa" } },
      { id: "ai-name", name: "Name", type: "text", content: "NexoreAI Assistant", position: { x: 150, y: 64 }, size: { width: 200, height: 22 }, zIndex: 4, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "ai-status", name: "Status", type: "badge", content: "● Online", position: { x: 150, y: 84 }, size: { width: 60, height: 16 }, zIndex: 5, styles: { backgroundColor: "transparent", color: "#4ade80", fontSize: "10px" } },
      { id: "ai-msg1-bg", name: "AI Msg 1", type: "card", position: { x: 120, y: 130 }, size: { width: 350, height: 70 }, zIndex: 6, styles: { backgroundColor: "#18181b", borderRadius: "12px", borderRadiusTopLeft: "4px" } },
      { id: "ai-msg1", name: "AI Text 1", type: "text", content: "Hello! I'm your AI assistant. I can help you build components, debug code, or answer questions about NexoreUI. What can I help you with?", position: { x: 135, y: 140 }, size: { width: 320, height: 50 }, zIndex: 7, styles: { color: "#d4d4d8", fontSize: "13px", lineHeight: "1.5" } },
      { id: "ai-msg2-bg", name: "User Msg", type: "card", position: { x: 330, y: 220 }, size: { width: 250, height: 45 }, zIndex: 8, styles: { backgroundColor: "#27272a", borderRadius: "12px", borderRadiusBottomRight: "4px" } },
      { id: "ai-msg2", name: "User Text", type: "text", content: "Help me create a dark mode toggle component", position: { x: 345, y: 228 }, size: { width: 220, height: 30 }, zIndex: 9, styles: { color: "#fff", fontSize: "13px", lineHeight: "1.5" } },
      { id: "ai-msg3-bg", name: "AI Msg 2", type: "card", position: { x: 120, y: 285 }, size: { width: 380, height: 180 }, zIndex: 10, styles: { backgroundColor: "#18181b", borderRadius: "12px", borderRadiusTopLeft: "4px" } },
      { id: "ai-msg3", name: "AI Text 2", type: "text", content: "I'd be happy to help! Here's a dark mode toggle using a switch component with system theme detection:", position: { x: 135, y: 295 }, size: { width: 350, height: 40 }, zIndex: 11, styles: { color: "#d4d4d8", fontSize: "13px", lineHeight: "1.5" } },
      { id: "ai-code", name: "Code Block", type: "card", position: { x: 135, y: 340 }, size: { width: 350, height: 110 }, zIndex: 12, styles: { backgroundColor: "#0d0d0d", borderRadius: "8px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "ai-code-t", name: "Code Text", type: "text", content: "const [dark, setDark] = useState(false);\n\nuseEffect(() => {\n  document.documentElement\n    .classList.toggle('dark', dark);\n}, [dark]);", position: { x: 145, y: 350 }, size: { width: 330, height: 90 }, zIndex: 13, styles: { color: "#a1a1aa", fontSize: "11px", fontFamily: "monospace" } },
      { id: "ai-input-bg", name: "Input Bar", type: "card", position: { x: 100, y: 595 }, size: { width: 500, height: 55 }, zIndex: 14, styles: { backgroundColor: "#18181b", borderRadiusBottomLeft: "16px", borderRadiusBottomRight: "16px", borderRadiusTopLeft: "0px", borderRadiusTopRight: "0px", borderStyle: "solid", borderWidth: "1px 0 0 0", borderColor: "#27272a" } },
      { id: "ai-input", name: "Input", type: "input", placeholder: "Ask me anything...", position: { x: 120, y: 606 }, size: { width: 400, height: 34 }, zIndex: 15, styles: { backgroundColor: "transparent", color: "#fff" } },
      { id: "ai-send", name: "Send", type: "button", content: "↑", position: { x: 550, y: 606 }, size: { width: 34, height: 34 }, zIndex: 16, styles: { backgroundColor: "#fafafa", color: "#09090b", borderRadius: "8px", fontWeight: "bold" } }
    ]
  },

  // --- SECTIONS ---
  {
    id: "template-footer",
    name: "Footer Section",
    description: "Website footer with links and socials",
    category: "Sections",
    tier: 'free',
    canvasSettings: { width: 1200, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "ft-bg", name: "Footer Bg", type: "card", position: { x: 0, y: 50 }, size: { width: 1200, height: 350 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderStyle: "solid", borderWidth: "1px 0 0 0", borderColor: "#27272a" } },
      { id: "ft-logo", name: "Logo", type: "text", content: "NexoreUI", position: { x: 100, y: 100 }, size: { width: 150, height: 30 }, zIndex: 2, styles: { color: "#fff", fontSize: "22px", fontWeight: "bold" } },
      { id: "ft-desc", name: "Desc", type: "text", content: "crafted, accessible components for modern web applications.", position: { x: 100, y: 140 }, size: { width: 250, height: 40 }, zIndex: 3, styles: { color: "#71717a", fontSize: "13px", lineHeight: "1.5" } },
      { id: "ft-h1", name: "Col1 Header", type: "text", content: "Product", position: { x: 450, y: 100 }, size: { width: 100, height: 20 }, zIndex: 4, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "ft-l1", name: "Link1", type: "text", content: "Components", position: { x: 450, y: 130 }, size: { width: 100, height: 20 }, zIndex: 5, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-l2", name: "Link2", type: "text", content: "Templates", position: { x: 450, y: 155 }, size: { width: 100, height: 20 }, zIndex: 6, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-l3", name: "Link3", type: "text", content: "Pricing", position: { x: 450, y: 180 }, size: { width: 100, height: 20 }, zIndex: 7, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-l4", name: "Link4", type: "text", content: "Changelog", position: { x: 450, y: 205 }, size: { width: 100, height: 20 }, zIndex: 8, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-h2", name: "Col2 Header", type: "text", content: "Company", position: { x: 650, y: 100 }, size: { width: 100, height: 20 }, zIndex: 9, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "ft-l5", name: "Link5", type: "text", content: "About", position: { x: 650, y: 130 }, size: { width: 100, height: 20 }, zIndex: 10, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-l6", name: "Link6", type: "text", content: "Blog", position: { x: 650, y: 155 }, size: { width: 100, height: 20 }, zIndex: 11, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-l7", name: "Link7", type: "text", content: "Careers", position: { x: 650, y: 180 }, size: { width: 100, height: 20 }, zIndex: 12, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-l8", name: "Link8", type: "text", content: "Contact", position: { x: 650, y: 205 }, size: { width: 100, height: 20 }, zIndex: 13, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-h3", name: "Col3 Header", type: "text", content: "Legal", position: { x: 850, y: 100 }, size: { width: 100, height: 20 }, zIndex: 14, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "ft-l9", name: "Link9", type: "text", content: "Privacy", position: { x: 850, y: 130 }, size: { width: 100, height: 20 }, zIndex: 15, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-l10", name: "Link10", type: "text", content: "Terms", position: { x: 850, y: 155 }, size: { width: 100, height: 20 }, zIndex: 16, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-l11", name: "Link11", type: "text", content: "Cookies", position: { x: 850, y: 180 }, size: { width: 100, height: 20 }, zIndex: 17, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "ft-div", name: "Divider", type: "divider", position: { x: 100, y: 300 }, size: { width: 1000, height: 1 }, zIndex: 18, styles: { backgroundColor: "#27272a" } },
      { id: "ft-copy", name: "Copyright", type: "text", content: "© 2026 NexoreUI. All rights reserved.", position: { x: 100, y: 325 }, size: { width: 300, height: 20 }, zIndex: 19, styles: { color: "#52525b", fontSize: "12px" } },
      { id: "ft-social", name: "Socials", type: "text", content: "X  ·  GitHub  ·  Discord", position: { x: 900, y: 325 }, size: { width: 200, height: 20 }, zIndex: 20, styles: { color: "#52525b", fontSize: "12px", textAlign: "right" } }
    ]
  },
  {
    id: "template-mobile-bottom-nav",
    name: "Mobile Bottom Nav",
    description: "Mobile app bottom tab bar",
    category: "Sections",
    tier: 'free',
    canvasSettings: { width: 400, height: 300, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "mn-bg", name: "Nav Bar", type: "card", position: { x: 20, y: 200 }, size: { width: 360, height: 70 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "20px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "mn-i1", name: "Home", type: "icon", iconName: "Home", position: { x: 60, y: 215 }, size: { width: 20, height: 20 }, zIndex: 2, styles: { color: "#fafafa" } },
      { id: "mn-l1", name: "Home Label", type: "text", content: "Home", position: { x: 42, y: 242 }, size: { width: 56, height: 16 }, zIndex: 3, styles: { color: "#fafafa", fontSize: "10px", textAlign: "center", fontWeight: "bold" } },
      { id: "mn-dot", name: "Active Dot", type: "card", position: { x: 65, y: 260 }, size: { width: 6, height: 6 }, zIndex: 4, styles: { backgroundColor: "#27272a", borderRadius: "50%" } },
      { id: "mn-i2", name: "Search", type: "text", content: "⌕", position: { x: 120, y: 215 }, size: { width: 40, height: 24 }, zIndex: 5, styles: { fontSize: "20px", textAlign: "center", color: "#71717a" } },
      { id: "mn-l2", name: "Search Label", type: "text", content: "Search", position: { x: 112, y: 242 }, size: { width: 56, height: 16 }, zIndex: 6, styles: { color: "#71717a", fontSize: "10px", textAlign: "center" } },
      { id: "mn-i3-bg", name: "Add Bg", type: "card", position: { x: 178, y: 205 }, size: { width: 44, height: 44 }, zIndex: 7, styles: { backgroundColor: "#27272a", borderRadius: "50%" } },
      { id: "mn-i3", name: "Add", type: "text", content: "+", position: { x: 178, y: 210 }, size: { width: 44, height: 34 }, zIndex: 8, styles: { color: "#fff", fontSize: "22px", textAlign: "center", fontWeight: "bold" } },
      { id: "mn-i4", name: "Inbox", type: "icon", iconName: "Mail", position: { x: 250, y: 215 }, size: { width: 20, height: 20 }, zIndex: 9, styles: { color: "#71717a" } },
      { id: "mn-l4", name: "Inbox Label", type: "text", content: "Inbox", position: { x: 232, y: 242 }, size: { width: 56, height: 16 }, zIndex: 10, styles: { color: "#71717a", fontSize: "10px", textAlign: "center" } },
      { id: "mn-i5", name: "Profile", type: "text", content: "●", position: { x: 310, y: 215 }, size: { width: 40, height: 24 }, zIndex: 11, styles: { fontSize: "14px", textAlign: "center", color: "#71717a" } },
      { id: "mn-l5", name: "Profile Label", type: "text", content: "Profile", position: { x: 302, y: 242 }, size: { width: 56, height: 16 }, zIndex: 12, styles: { color: "#71717a", fontSize: "10px", textAlign: "center" } }
    ]
  },
  {
    id: "template-breadcrumb-header",
    name: "Page Header with Breadcrumb",
    description: "Page title with breadcrumb navigation",
    category: "Sections",
    tier: 'free',
    canvasSettings: { width: 1000, height: 250, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "bh-bg", name: "Bg", type: "card", position: { x: 50, y: 50 }, size: { width: 900, height: 150 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderStyle: "solid", borderWidth: "0 0 1px 0", borderColor: "#27272a" } },
      { id: "bh-bc1", name: "Crumb1", type: "text", content: "Dashboard", position: { x: 100, y: 75 }, size: { width: 80, height: 18 }, zIndex: 2, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "bh-sep1", name: "Sep1", type: "text", content: "/", position: { x: 182, y: 75 }, size: { width: 15, height: 18 }, zIndex: 3, styles: { color: "#3f3f46", fontSize: "13px" } },
      { id: "bh-bc2", name: "Crumb2", type: "text", content: "Projects", position: { x: 200, y: 75 }, size: { width: 60, height: 18 }, zIndex: 4, styles: { color: "#71717a", fontSize: "13px" } },
      { id: "bh-sep2", name: "Sep2", type: "text", content: "/", position: { x: 262, y: 75 }, size: { width: 15, height: 18 }, zIndex: 5, styles: { color: "#3f3f46", fontSize: "13px" } },
      { id: "bh-bc3", name: "Current", type: "text", content: "NexoreUI", position: { x: 280, y: 75 }, size: { width: 80, height: 18 }, zIndex: 6, styles: { color: "#fff", fontSize: "13px", fontWeight: "bold" } },
      { id: "bh-title", name: "Title", type: "text", content: "NexoreUI", position: { x: 100, y: 110 }, size: { width: 300, height: 35 }, zIndex: 7, styles: { color: "#fff", fontSize: "28px", fontWeight: "bold" } },
      { id: "bh-desc", name: "Desc", type: "text", content: "Modern component library for React", position: { x: 100, y: 150 }, size: { width: 300, height: 20 }, zIndex: 8, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "bh-btn1", name: "Edit", type: "button", content: "Edit Project", position: { x: 720, y: 120 }, size: { width: 110, height: 36 }, zIndex: 9, styles: { backgroundColor: "#fff", color: "#000", fontWeight: "bold", borderRadius: "6px", fontSize: "13px" } },
      { id: "bh-btn2", name: "Settings", type: "button", content: "Settings", variant: "outline", position: { x: 840, y: 120 }, size: { width: 90, height: 36 }, zIndex: 10, styles: { borderRadius: "6px", color: "#a1a1aa", borderColor: "#27272a", fontSize: "13px" } }
    ]
  },

  // --- BONUS TEMPLATES ---
  {
    id: "template-progress-steps",
    name: "Progress Steps",
    description: "Multi-step progress indicator",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 800, height: 250, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "ps-c1", name: "Circle1", type: "card", position: { x: 150, y: 100 }, size: { width: 36, height: 36 }, zIndex: 2, styles: { backgroundColor: "#27272a", borderRadius: "50%" } },
      { id: "ps-n1", name: "Num1", type: "icon", iconName: "Check", position: { x: 158, y: 108 }, size: { width: 20, height: 20 }, zIndex: 3, styles: { color: "#09090b" } },
      { id: "ps-l1", name: "Label1", type: "text", content: "Account", position: { x: 135, y: 145 }, size: { width: 66, height: 18 }, zIndex: 4, styles: { color: "#fafafa", fontSize: "12px", fontWeight: "bold", textAlign: "center" } },
      { id: "ps-line1", name: "Line1", type: "card", position: { x: 186, y: 116 }, size: { width: 120, height: 3 }, zIndex: 1, styles: { backgroundColor: "#27272a", borderRadius: "2px" } },
      { id: "ps-c2", name: "Circle2", type: "card", position: { x: 306, y: 100 }, size: { width: 36, height: 36 }, zIndex: 2, styles: { backgroundColor: "#27272a", borderRadius: "50%" } },
      { id: "ps-n2", name: "Num2", type: "text", content: "2", position: { x: 306, y: 106 }, size: { width: 36, height: 24 }, zIndex: 3, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold", textAlign: "center" } },
      { id: "ps-l2", name: "Label2", type: "text", content: "Details", position: { x: 291, y: 145 }, size: { width: 66, height: 18 }, zIndex: 4, styles: { color: "#fafafa", fontSize: "12px", fontWeight: "bold", textAlign: "center" } },
      { id: "ps-line2", name: "Line2", type: "card", position: { x: 342, y: 116 }, size: { width: 120, height: 3 }, zIndex: 1, styles: { backgroundColor: "#27272a", borderRadius: "2px" } },
      { id: "ps-c3", name: "Circle3", type: "card", position: { x: 462, y: 100 }, size: { width: 36, height: 36 }, zIndex: 2, styles: { backgroundColor: "#18181b", borderRadius: "50%", borderStyle: "solid", borderWidth: "2px", borderColor: "#27272a" } },
      { id: "ps-n3", name: "Num3", type: "text", content: "3", position: { x: 462, y: 106 }, size: { width: 36, height: 24 }, zIndex: 3, styles: { color: "#71717a", fontSize: "14px", fontWeight: "bold", textAlign: "center" } },
      { id: "ps-l3", name: "Label3", type: "text", content: "Payment", position: { x: 447, y: 145 }, size: { width: 66, height: 18 }, zIndex: 4, styles: { color: "#71717a", fontSize: "12px", textAlign: "center" } },
      { id: "ps-line3", name: "Line3", type: "card", position: { x: 498, y: 116 }, size: { width: 120, height: 3 }, zIndex: 1, styles: { backgroundColor: "#27272a", borderRadius: "2px" } },
      { id: "ps-c4", name: "Circle4", type: "card", position: { x: 618, y: 100 }, size: { width: 36, height: 36 }, zIndex: 2, styles: { backgroundColor: "#18181b", borderRadius: "50%", borderStyle: "solid", borderWidth: "2px", borderColor: "#27272a" } },
      { id: "ps-n4", name: "Num4", type: "text", content: "4", position: { x: 618, y: 106 }, size: { width: 36, height: 24 }, zIndex: 3, styles: { color: "#71717a", fontSize: "14px", fontWeight: "bold", textAlign: "center" } },
      { id: "ps-l4", name: "Label4", type: "text", content: "Confirm", position: { x: 603, y: 145 }, size: { width: 66, height: 18 }, zIndex: 4, styles: { color: "#71717a", fontSize: "12px", textAlign: "center" } }
    ]
  },
  {
    id: "template-empty-state",
    name: "Empty State",
    description: "No data placeholder with action",
    category: "Cards",
    tier: 'free',
    canvasSettings: { width: 600, height: 500, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "es-bg", name: "Card", type: "card", position: { x: 100, y: 80 }, size: { width: 400, height: 340 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "dashed", borderWidth: "2px", borderColor: "#27272a" } },
      { id: "es-icon", name: "Icon", type: "icon", iconName: "Inbox", position: { x: 280, y: 130 }, size: { width: 40, height: 40 }, zIndex: 2, styles: { color: "#52525b" } },
      { id: "es-title", name: "Title", type: "text", content: "No Projects Yet", position: { x: 100, y: 190 }, size: { width: 400, height: 30 }, zIndex: 3, styles: { color: "#fff", fontSize: "22px", fontWeight: "bold", textAlign: "center" } },
      { id: "es-desc", name: "Desc", type: "text", content: "Create your first project to get started. You can import existing repos or start from a blank template.", position: { x: 150, y: 225 }, size: { width: 300, height: 50 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "14px", textAlign: "center", lineHeight: "1.6" } },
      { id: "es-btn", name: "Create", type: "button", content: "+ Create Project", position: { x: 210, y: 295 }, size: { width: 180, height: 42 }, zIndex: 5, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "bold", borderRadius: "8px" } },
      { id: "es-link", name: "Import", type: "text", content: "or import from GitHub →", position: { x: 100, y: 350 }, size: { width: 400, height: 18 }, zIndex: 6, styles: { color: "#71717a", fontSize: "12px", textAlign: "center" } }
    ]
  },
  // ==========================================
  //  RELEASE 2.0 PRO TEMPLATES (8 HIGH-CRAFT)
  // ==========================================
  {
    id: "template-pro-saas-metrics",
    name: "SaaS Metrics Dashboard",
    description: "Executive revenue telemetry with ARR, cohort retention, and burn multiple",
    category: "Dashboard",
    tier: "pro",
    canvasSettings: { width: 1100, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pro-m-hdr", name: "Header", type: "text", content: "Telemetry & Revenue Operations", position: { x: 60, y: 50 }, size: { width: 400, height: 32 }, zIndex: 1, styles: { color: "#fafafa", fontSize: "22px", fontWeight: "600" } },
      { id: "pro-m-sub", name: "Subheader", type: "text", content: "Audited financial run-rate and net retention cohorts", position: { x: 60, y: 86 }, size: { width: 450, height: 20 }, zIndex: 2, styles: { color: "#a1a1aa", fontSize: "13px" } },
      { id: "pro-m-c1", name: "MRR Card", type: "card", position: { x: 60, y: 130 }, size: { width: 230, height: 110 }, zIndex: 3, styles: { backgroundColor: "#09090b", borderRadius: "10px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-m-c1-t", name: "MRR Title", type: "text", content: "ARR Run-Rate", position: { x: 80, y: 148 }, size: { width: 140, height: 16 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "12px", textTransform: "uppercase" } },
      { id: "pro-m-c1-v", name: "MRR Val", type: "text", content: "$2,480,000", position: { x: 80, y: 172 }, size: { width: 190, height: 32 }, zIndex: 5, styles: { color: "#fafafa", fontSize: "24px", fontWeight: "600" } },
      { id: "pro-m-c1-b", name: "MRR Badge", type: "badge", content: "+18.4% YoY", position: { x: 80, y: 210 }, size: { width: 90, height: 20 }, zIndex: 6, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "11px" } },
      { id: "pro-m-c2", name: "NDR Card", type: "card", position: { x: 310, y: 130 }, size: { width: 230, height: 110 }, zIndex: 7, styles: { backgroundColor: "#09090b", borderRadius: "10px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-m-c2-t", name: "NDR Title", type: "text", content: "Net Dollar Retention", position: { x: 330, y: 148 }, size: { width: 140, height: 16 }, zIndex: 8, styles: { color: "#a1a1aa", fontSize: "12px", textTransform: "uppercase" } },
      { id: "pro-m-c2-v", name: "NDR Val", type: "text", content: "124.6%", position: { x: 330, y: 172 }, size: { width: 190, height: 32 }, zIndex: 9, styles: { color: "#fafafa", fontSize: "24px", fontWeight: "600" } },
      { id: "pro-m-c2-b", name: "NDR Badge", type: "badge", content: "+2.1% MoM", position: { x: 330, y: 210 }, size: { width: 85, height: 20 }, zIndex: 10, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "11px" } },
      { id: "pro-m-c3", name: "CAC Card", type: "card", position: { x: 560, y: 130 }, size: { width: 230, height: 110 }, zIndex: 11, styles: { backgroundColor: "#09090b", borderRadius: "10px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-m-c3-t", name: "CAC Title", type: "text", content: "CAC Payback", position: { x: 580, y: 148 }, size: { width: 140, height: 16 }, zIndex: 12, styles: { color: "#a1a1aa", fontSize: "12px", textTransform: "uppercase" } },
      { id: "pro-m-c3-v", name: "CAC Val", type: "text", content: "6.8 months", position: { x: 580, y: 172 }, size: { width: 190, height: 32 }, zIndex: 13, styles: { color: "#fafafa", fontSize: "24px", fontWeight: "600" } },
      { id: "pro-m-c3-b", name: "CAC Badge", type: "badge", content: "Top Decile", position: { x: 580, y: 210 }, size: { width: 80, height: 20 }, zIndex: 14, styles: { backgroundColor: "rgba(255,255,255,0.08)", color: "#a1a1aa", fontSize: "11px" } },
      { id: "pro-m-c4", name: "LTV Card", type: "card", position: { x: 810, y: 130 }, size: { width: 230, height: 110 }, zIndex: 15, styles: { backgroundColor: "#09090b", borderRadius: "10px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-m-c4-t", name: "LTV Title", type: "text", content: "Gross Churn", position: { x: 830, y: 148 }, size: { width: 140, height: 16 }, zIndex: 16, styles: { color: "#a1a1aa", fontSize: "12px", textTransform: "uppercase" } },
      { id: "pro-m-c4-v", name: "LTV Val", type: "text", content: "0.82%", position: { x: 830, y: 172 }, size: { width: 190, height: 32 }, zIndex: 17, styles: { color: "#fafafa", fontSize: "24px", fontWeight: "600" } },
      { id: "pro-m-c4-b", name: "LTV Badge", type: "badge", content: "-0.15% trend", position: { x: 830, y: 210 }, size: { width: 95, height: 20 }, zIndex: 18, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "11px" } },
      { id: "pro-m-panel", name: "Chart Frame", type: "card", position: { x: 60, y: 260 }, size: { width: 980, height: 280 }, zIndex: 19, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-m-table", name: "Cohort Grid", type: "grid", position: { x: 90, y: 300 }, size: { width: 920, height: 210 }, zIndex: 20, styles: { fontSize: "13px" } }
    ]
  },
  {
    id: "template-pro-checkout-flow",
    name: "E-Commerce Checkout & Order Summary",
    description: "High-conversion checkout layout with step indicator, shipping details, and cost summary",
    category: "E-commerce",
    tier: "pro",
    canvasSettings: { width: 1050, height: 620, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pro-ck-title", name: "Checkout Title", type: "text", content: "Secure Checkout", position: { x: 60, y: 40 }, size: { width: 300, height: 30 }, zIndex: 1, styles: { color: "#fafafa", fontSize: "22px", fontWeight: "600" } },
      { id: "pro-ck-left", name: "Form Container", type: "card", position: { x: 60, y: 90 }, size: { width: 560, height: 490 }, zIndex: 2, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-ck-step", name: "Step Label", type: "text", content: "1. Contact & Shipping Address", position: { x: 90, y: 120 }, size: { width: 300, height: 24 }, zIndex: 3, styles: { color: "#fafafa", fontSize: "15px", fontWeight: "600" } },
      { id: "pro-ck-email", name: "Email Input", type: "input", placeholder: "elena@nexore.dev", position: { x: 90, y: 160 }, size: { width: 500, height: 40 }, zIndex: 4, styles: { backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px" } },
      { id: "pro-ck-fname", name: "First Name", type: "input", placeholder: "Elena", position: { x: 90, y: 220 }, size: { width: 240, height: 40 }, zIndex: 5, styles: { backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px" } },
      { id: "pro-ck-lname", name: "Last Name", type: "input", placeholder: "Rostova", position: { x: 350, y: 220 }, size: { width: 240, height: 40 }, zIndex: 6, styles: { backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px" } },
      { id: "pro-ck-addr", name: "Address", type: "input", placeholder: "452 Silicon Boulevard, Suite 300", position: { x: 90, y: 280 }, size: { width: 500, height: 40 }, zIndex: 7, styles: { backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px" } },
      { id: "pro-ck-city", name: "City", type: "input", placeholder: "San Francisco, CA 94107", position: { x: 90, y: 340 }, size: { width: 500, height: 40 }, zIndex: 8, styles: { backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px" } },
      { id: "pro-ck-save", name: "Save Details", type: "checkbox", content: "Save address for future checkouts", checked: true, position: { x: 90, y: 405 }, size: { width: 300, height: 24 }, zIndex: 9, styles: {} },
      { id: "pro-ck-next", name: "Continue Btn", type: "button", content: "Continue to Payment Method", position: { x: 90, y: 450 }, size: { width: 500, height: 44 }, zIndex: 10, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "600", borderRadius: "6px" } },
      { id: "pro-ck-right", name: "Summary Container", type: "card", position: { x: 640, y: 90 }, size: { width: 350, height: 490 }, zIndex: 11, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-ck-sum-t", name: "Summary Title", type: "text", content: "Order Summary (2 items)", position: { x: 670, y: 120 }, size: { width: 250, height: 24 }, zIndex: 12, styles: { color: "#fafafa", fontSize: "15px", fontWeight: "600" } },
      { id: "pro-ck-sub", name: "Subtotal Label", type: "text", content: "Subtotal", position: { x: 670, y: 380 }, size: { width: 100, height: 20 }, zIndex: 13, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "pro-ck-sub-v", name: "Subtotal Val", type: "text", content: "$420.00", position: { x: 880, y: 380 }, size: { width: 80, height: 20 }, zIndex: 14, styles: { color: "#fafafa", fontSize: "14px", textAlign: "right" } },
      { id: "pro-ck-ship", name: "Shipping Label", type: "text", content: "Express Shipping", position: { x: 670, y: 410 }, size: { width: 140, height: 20 }, zIndex: 15, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "pro-ck-ship-v", name: "Shipping Val", type: "text", content: "Free", position: { x: 880, y: 410 }, size: { width: 80, height: 20 }, zIndex: 16, styles: { color: "#4ade80", fontSize: "14px", textAlign: "right" } },
      { id: "pro-ck-tot", name: "Total Label", type: "text", content: "Total Due", position: { x: 670, y: 450 }, size: { width: 120, height: 24 }, zIndex: 17, styles: { color: "#fafafa", fontSize: "16px", fontWeight: "600" } },
      { id: "pro-ck-tot-v", name: "Total Val", type: "text", content: "$420.00 USD", position: { x: 830, y: 450 }, size: { width: 130, height: 24 }, zIndex: 18, styles: { color: "#fafafa", fontSize: "16px", fontWeight: "600", textAlign: "right" } }
    ]
  },
  {
    id: "template-pro-ai-agent-control",
    name: "AI Agent Control Plane",
    description: "Mission control layout for autonomous agent pipelines, token budget, and active tools",
    category: "Dashboard",
    tier: "pro",
    canvasSettings: { width: 1100, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pro-ai-t", name: "Title", type: "text", content: "Autonomous Workflow Agent #04", position: { x: 60, y: 45 }, size: { width: 450, height: 30 }, zIndex: 1, styles: { color: "#fafafa", fontSize: "20px", fontWeight: "600" } },
      { id: "pro-ai-badge", name: "Status Badge", type: "badge", content: "Agent Active · Idle Waiting", position: { x: 440, y: 48 }, size: { width: 170, height: 24 }, zIndex: 2, styles: { backgroundColor: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: "11px" } },
      { id: "pro-ai-c1", name: "Token Card", type: "card", position: { x: 60, y: 95 }, size: { width: 310, height: 100 }, zIndex: 3, styles: { backgroundColor: "#09090b", borderRadius: "10px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-ai-c1-t", name: "Token Title", type: "text", content: "Context Window Saturation", position: { x: 80, y: 115 }, size: { width: 220, height: 18 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "pro-ai-c1-v", name: "Token Val", type: "text", content: "48,219 / 200,000 tokens", position: { x: 80, y: 140 }, size: { width: 250, height: 24 }, zIndex: 5, styles: { color: "#fafafa", fontSize: "17px", fontWeight: "600" } },
      { id: "pro-ai-c2", name: "Cost Card", type: "card", position: { x: 390, y: 95 }, size: { width: 310, height: 100 }, zIndex: 6, styles: { backgroundColor: "#09090b", borderRadius: "10px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-ai-c2-t", name: "Cost Title", type: "text", content: "Hourly Inference Cost", position: { x: 410, y: 115 }, size: { width: 200, height: 18 }, zIndex: 7, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "pro-ai-c2-v", name: "Cost Val", type: "text", content: "$0.142 / execution", position: { x: 410, y: 140 }, size: { width: 200, height: 24 }, zIndex: 8, styles: { color: "#fafafa", fontSize: "17px", fontWeight: "600" } },
      { id: "pro-ai-c3", name: "Latency Card", type: "card", position: { x: 720, y: 95 }, size: { width: 320, height: 100 }, zIndex: 9, styles: { backgroundColor: "#09090b", borderRadius: "10px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-ai-c3-t", name: "Latency Title", type: "text", content: "Median TTFT (First Token)", position: { x: 740, y: 115 }, size: { width: 200, height: 18 }, zIndex: 10, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "pro-ai-c3-v", name: "Latency Val", type: "text", content: "340 ms", position: { x: 740, y: 140 }, size: { width: 200, height: 24 }, zIndex: 11, styles: { color: "#fafafa", fontSize: "17px", fontWeight: "600" } },
      { id: "pro-ai-term", name: "Console Frame", type: "card", position: { x: 60, y: 215 }, size: { width: 640, height: 340 }, zIndex: 12, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-ai-log", name: "Telemetry Text", type: "text", content: "[2026-10-18 14:02:11] Worker spawned with threadId=7\n[2026-10-18 14:02:12] Tool WebSearch executed query='Next.js 15 Server Actions'\n[2026-10-18 14:02:14] 4 chunks returned, relevance score 0.94\n[2026-10-18 14:02:15] Completed synthesis step in 840ms", position: { x: 80, y: 245 }, size: { width: 600, height: 180 }, zIndex: 13, styles: { color: "#a1a1aa", fontSize: "12px", fontFamily: "monospace", lineHeight: "1.7" } },
      { id: "pro-ai-sidebar", name: "Tools Sidebar", type: "card", position: { x: 720, y: 215 }, size: { width: 320, height: 340 }, zIndex: 14, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-ai-tools-t", name: "Tools Title", type: "text", content: "Equipped Subroutines", position: { x: 745, y: 240 }, size: { width: 200, height: 20 }, zIndex: 15, styles: { color: "#fafafa", fontSize: "14px", fontWeight: "600" } },
      { id: "pro-ai-t1", name: "Tool 1", type: "button", content: "WebSearch Engine", variant: "outline", position: { x: 745, y: 280 }, size: { width: 270, height: 36 }, zIndex: 16, styles: { borderColor: "#27272a", borderRadius: "6px" } },
      { id: "pro-ai-t2", name: "Tool 2", type: "button", content: "Sandboxed Terminal", variant: "outline", position: { x: 745, y: 328 }, size: { width: 270, height: 36 }, zIndex: 17, styles: { borderColor: "#27272a", borderRadius: "6px" } },
      { id: "pro-ai-t3", name: "Tool 3", type: "button", content: "PostgreSQL Connector", variant: "outline", position: { x: 745, y: 376 }, size: { width: 270, height: 36 }, zIndex: 18, styles: { borderColor: "#27272a", borderRadius: "6px" } }
    ]
  },
  {
    id: "template-pro-marketing-hero",
    name: "Modern Marketing Hero with Feature Cards",
    description: "Typography-first hero section with deliberate spacing, badge kicker, and bento preview cards",
    category: "Landing",
    tier: "pro",
    canvasSettings: { width: 1200, height: 650, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pro-h-badge", name: "Badge", type: "badge", content: "NexoreUI Release 2.0", position: { x: 500, y: 60 }, size: { width: 200, height: 28 }, zIndex: 1, styles: { backgroundColor: "rgba(255,255,255,0.06)", color: "#fafafa", fontSize: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-h-title", name: "Headline", type: "text", content: "Engineered for teams who ship without slop.", position: { x: 200, y: 110 }, size: { width: 800, height: 70 }, zIndex: 2, styles: { color: "#fafafa", fontSize: "44px", fontWeight: "600", textAlign: "center", letterSpacing: "-0.04em" } },
      { id: "pro-h-desc", name: "Subheadline", type: "text", content: "Accessible shadcn-compatible components and full landing templates with zero AI-generated clutter.", position: { x: 250, y: 195 }, size: { width: 700, height: 40 }, zIndex: 3, styles: { color: "#a1a1aa", fontSize: "16px", textAlign: "center", lineHeight: "1.6" } },
      { id: "pro-h-btn1", name: "Primary CTA", type: "button", content: "Explore Component Registry", position: { x: 420, y: 260 }, size: { width: 200, height: 44 }, zIndex: 4, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "600", borderRadius: "6px" } },
      { id: "pro-h-btn2", name: "Secondary CTA", type: "button", content: "Documentation", variant: "outline", position: { x: 636, y: 260 }, size: { width: 140, height: 44 }, zIndex: 5, styles: { borderColor: "#27272a", borderRadius: "6px" } },
      { id: "pro-h-card1", name: "Feature Card 1", type: "card", position: { x: 120, y: 350 }, size: { width: 300, height: 230 }, zIndex: 6, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-h-c1-t", name: "Card 1 Title", type: "text", content: "Zero Any / Zero Slop", position: { x: 145, y: 375 }, size: { width: 250, height: 24 }, zIndex: 7, styles: { color: "#fafafa", fontSize: "16px", fontWeight: "600" } },
      { id: "pro-h-c1-d", name: "Card 1 Body", type: "text", content: "Every component is typed with strict TypeScript and audited against unhandled exceptions.", position: { x: 145, y: 410 }, size: { width: 250, height: 70 }, zIndex: 8, styles: { color: "#a1a1aa", fontSize: "13px", lineHeight: "1.5" } },
      { id: "pro-h-card2", name: "Feature Card 2", type: "card", position: { x: 450, y: 350 }, size: { width: 300, height: 230 }, zIndex: 9, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-h-c2-t", name: "Card 2 Title", type: "text", content: "Full Code Export", position: { x: 475, y: 375 }, size: { width: 250, height: 24 }, zIndex: 10, styles: { color: "#fafafa", fontSize: "16px", fontWeight: "600" } },
      { id: "pro-h-c2-d", name: "Card 2 Body", type: "text", content: "100% production code output without synthetic wrappers or runtime bundle lock-in.", position: { x: 475, y: 410 }, size: { width: 250, height: 70 }, zIndex: 11, styles: { color: "#a1a1aa", fontSize: "13px", lineHeight: "1.5" } },
      { id: "pro-h-card3", name: "Feature Card 3", type: "card", position: { x: 780, y: 350 }, size: { width: 300, height: 230 }, zIndex: 12, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-h-c3-t", name: "Card 3 Title", type: "text", content: "Multi-Device Fidelity", position: { x: 805, y: 375 }, size: { width: 250, height: 24 }, zIndex: 13, styles: { color: "#fafafa", fontSize: "16px", fontWeight: "600" } },
      { id: "pro-h-c3-d", name: "Card 3 Body", type: "text", content: "Independent layout persistence across Desktop, Tablet, and Mobile viewport modes.", position: { x: 805, y: 410 }, size: { width: 250, height: 70 }, zIndex: 14, styles: { color: "#a1a1aa", fontSize: "13px", lineHeight: "1.5" } }
    ]
  },
  {
    id: "template-pro-rbac-matrix",
    name: "Team Settings & RBAC Permissions Matrix",
    description: "Enterprise access control with member roster, roles, and granular capability toggles",
    category: "Forms",
    tier: "pro",
    canvasSettings: { width: 1000, height: 620, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pro-r-title", name: "Page Title", type: "text", content: "Team Permissions & Governance", position: { x: 60, y: 40 }, size: { width: 400, height: 28 }, zIndex: 1, styles: { color: "#fafafa", fontSize: "20px", fontWeight: "600" } },
      { id: "pro-r-btn", name: "Invite Button", type: "button", content: "+ Invite Teammate", position: { x: 800, y: 36 }, size: { width: 140, height: 36 }, zIndex: 2, styles: { backgroundColor: "#fafafa", color: "#09090b", borderRadius: "6px", fontWeight: "600", fontSize: "13px" } },
      { id: "pro-r-box", name: "Table Container", type: "card", position: { x: 60, y: 90 }, size: { width: 880, height: 480 }, zIndex: 3, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-r-col1", name: "Col 1", type: "text", content: "Teammate", position: { x: 90, y: 115 }, size: { width: 200, height: 20 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "12px", textTransform: "uppercase" } },
      { id: "pro-r-col2", name: "Col 2", type: "text", content: "Assigned Role", position: { x: 380, y: 115 }, size: { width: 150, height: 20 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "12px", textTransform: "uppercase" } },
      { id: "pro-r-col3", name: "Col 3", type: "text", content: "Production Write", position: { x: 600, y: 115 }, size: { width: 140, height: 20 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "12px", textTransform: "uppercase" } },
      { id: "pro-r-col4", name: "Col 4", type: "text", content: "Billing Access", position: { x: 770, y: 115 }, size: { width: 120, height: 20 }, zIndex: 7, styles: { color: "#a1a1aa", fontSize: "12px", textTransform: "uppercase" } },
      { id: "pro-r-row1-n", name: "User 1", type: "text", content: "Elena Rostova (elena@nexore.dev)", position: { x: 90, y: 165 }, size: { width: 260, height: 20 }, zIndex: 8, styles: { color: "#fafafa", fontSize: "14px", fontWeight: "500" } },
      { id: "pro-r-row1-s", name: "Select 1", type: "select", items: ["Owner", "Administrator", "Engineer", "Billing"], position: { x: 380, y: 155 }, size: { width: 160, height: 36 }, zIndex: 9, styles: { backgroundColor: "#18181b" } },
      { id: "pro-r-row1-c1", name: "Toggle 1A", type: "checkbox", checked: true, position: { x: 640, y: 162 }, size: { width: 24, height: 24 }, zIndex: 10, styles: {} },
      { id: "pro-r-row1-c2", name: "Toggle 1B", type: "checkbox", checked: true, position: { x: 800, y: 162 }, size: { width: 24, height: 24 }, zIndex: 11, styles: {} },
      { id: "pro-r-row2-n", name: "User 2", type: "text", content: "Marcus Vance (marcus@nexore.dev)", position: { x: 90, y: 235 }, size: { width: 260, height: 20 }, zIndex: 12, styles: { color: "#fafafa", fontSize: "14px", fontWeight: "500" } },
      { id: "pro-r-row2-s", name: "Select 2", type: "select", items: ["Engineer", "Administrator", "Viewer"], position: { x: 380, y: 225 }, size: { width: 160, height: 36 }, zIndex: 13, styles: { backgroundColor: "#18181b" } },
      { id: "pro-r-row2-c1", name: "Toggle 2A", type: "checkbox", checked: true, position: { x: 640, y: 232 }, size: { width: 24, height: 24 }, zIndex: 14, styles: {} },
      { id: "pro-r-row2-c2", name: "Toggle 2B", type: "checkbox", checked: false, position: { x: 800, y: 232 }, size: { width: 24, height: 24 }, zIndex: 15, styles: {} }
    ]
  },
  {
    id: "template-pro-feedback-nps",
    name: "Customer Feedback & NPS Survey Modal",
    description: "Structured Net Promoter Score assessment with categorical tags and text feedback",
    category: "Overlays",
    tier: "pro",
    canvasSettings: { width: 800, height: 550, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pro-nps-box", name: "Modal Box", type: "card", position: { x: 120, y: 60 }, size: { width: 560, height: 430 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "14px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-nps-t", name: "Modal Header", type: "text", content: "How likely are you to recommend Nexore?", position: { x: 150, y: 95 }, size: { width: 500, height: 26 }, zIndex: 2, styles: { color: "#fafafa", fontSize: "18px", fontWeight: "600" } },
      { id: "pro-nps-sub", name: "Scale Sub", type: "text", content: "0 = Not likely at all · 10 = Extremely likely", position: { x: 150, y: 125 }, size: { width: 400, height: 18 }, zIndex: 3, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "pro-nps-b9", name: "Btn 9", type: "button", content: "9", variant: "outline", position: { x: 150, y: 165 }, size: { width: 44, height: 44 }, zIndex: 4, styles: { borderColor: "#27272a", borderRadius: "8px" } },
      { id: "pro-nps-b10", name: "Btn 10", type: "button", content: "10", position: { x: 202, y: 165 }, size: { width: 44, height: 44 }, zIndex: 5, styles: { backgroundColor: "#fafafa", color: "#09090b", borderRadius: "8px", fontWeight: "600" } },
      { id: "pro-nps-lbl", name: "Feedback Label", type: "text", content: "What is the primary reason for your score?", position: { x: 150, y: 235 }, size: { width: 400, height: 20 }, zIndex: 6, styles: { color: "#fafafa", fontSize: "14px", fontWeight: "500" } },
      { id: "pro-nps-area", name: "Textarea", type: "textarea", placeholder: "Tell us about your experience with registry exports and layout responsiveness...", position: { x: 150, y: 265 }, size: { width: 500, height: 100 }, zIndex: 7, styles: { backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" } },
      { id: "pro-nps-submit", name: "Submit Btn", type: "button", content: "Send Feedback", position: { x: 490, y: 395 }, size: { width: 160, height: 40 }, zIndex: 8, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "600", borderRadius: "6px" } },
      { id: "pro-nps-cancel", name: "Dismiss Btn", type: "button", content: "Later", variant: "ghost", position: { x: 400, y: 395 }, size: { width: 80, height: 40 }, zIndex: 9, styles: { borderRadius: "6px", color: "#a1a1aa" } }
    ]
  },
  {
    id: "template-pro-api-keys",
    name: "API Key Management & Webhook Config",
    description: "Developer console view with token generation, revocation controls, and event triggers",
    category: "Sections",
    tier: "pro",
    canvasSettings: { width: 1050, height: 580, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pro-k-title", name: "Section Title", type: "text", content: "Production API Keys & Endpoints", position: { x: 60, y: 40 }, size: { width: 400, height: 28 }, zIndex: 1, styles: { color: "#fafafa", fontSize: "20px", fontWeight: "600" } },
      { id: "pro-k-create", name: "Create Key Btn", type: "button", content: "+ Generate New Key", position: { x: 840, y: 36 }, size: { width: 150, height: 38 }, zIndex: 2, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "600", borderRadius: "6px", fontSize: "13px" } },
      { id: "pro-k-box", name: "Keys Box", type: "card", position: { x: 60, y: 95 }, size: { width: 930, height: 220 }, zIndex: 3, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-k-h1", name: "Key Name", type: "text", content: "Live Gateway Key", position: { x: 90, y: 125 }, size: { width: 180, height: 20 }, zIndex: 4, styles: { color: "#fafafa", fontSize: "14px", fontWeight: "600" } },
      { id: "pro-k-v1", name: "Key Mask", type: "text", content: "nx_live_948f2...e491a0c", position: { x: 90, y: 150 }, size: { width: 220, height: 20 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "13px", fontFamily: "monospace" } },
      { id: "pro-k-b1", name: "Key Revoke", type: "button", content: "Revoke", variant: "outline", position: { x: 880, y: 130 }, size: { width: 80, height: 32 }, zIndex: 6, styles: { borderColor: "#ef4444", color: "#ef4444", borderRadius: "6px", fontSize: "12px" } },
      { id: "pro-wh-box", name: "Webhook Box", type: "card", position: { x: 60, y: 335 }, size: { width: 930, height: 200 }, zIndex: 7, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-wh-t", name: "Webhook Title", type: "text", content: "Webhook Delivery URL", position: { x: 90, y: 360 }, size: { width: 300, height: 20 }, zIndex: 8, styles: { color: "#fafafa", fontSize: "15px", fontWeight: "600" } },
      { id: "pro-wh-input", name: "URL Input", type: "input", placeholder: "https://api.yourdomain.com/v1/nexore-webhooks", position: { x: 90, y: 395 }, size: { width: 620, height: 40 }, zIndex: 9, styles: { backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px" } },
      { id: "pro-wh-save", name: "Save Endpoint", type: "button", content: "Save Endpoint", position: { x: 730, y: 395 }, size: { width: 140, height: 40 }, zIndex: 10, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "600", borderRadius: "6px" } }
    ]
  },
  {
    id: "template-pro-pricing-matrix",
    name: "Pricing Matrix with Annual/Monthly Toggle",
    description: "3-tier pricing table with highlighted recommend tier, feature checklist, and currency switcher",
    category: "Landing",
    tier: "pro",
    canvasSettings: { width: 1100, height: 640, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pro-p-title", name: "Section Title", type: "text", content: "Transparent, predictable pricing.", position: { x: 300, y: 40 }, size: { width: 500, height: 36 }, zIndex: 1, styles: { color: "#fafafa", fontSize: "28px", fontWeight: "600", textAlign: "center" } },
      { id: "pro-p-toggle", name: "Billing Toggle", type: "badge", content: "Billed Annually · Save 20%", position: { x: 450, y: 90 }, size: { width: 200, height: 26 }, zIndex: 2, styles: { backgroundColor: "rgba(255,255,255,0.08)", color: "#fafafa", fontSize: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-p-c1", name: "Tier 1 Starter", type: "card", position: { x: 80, y: 140 }, size: { width: 290, height: 440 }, zIndex: 3, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-p-c1-t", name: "Tier 1 Name", type: "text", content: "Starter", position: { x: 110, y: 170 }, size: { width: 150, height: 24 }, zIndex: 4, styles: { color: "#fafafa", fontSize: "18px", fontWeight: "600" } },
      { id: "pro-p-c1-p", name: "Tier 1 Price", type: "text", content: "$0 / month", position: { x: 110, y: 205 }, size: { width: 200, height: 32 }, zIndex: 5, styles: { color: "#fafafa", fontSize: "24px", fontWeight: "700" } },
      { id: "pro-p-c1-b", name: "Tier 1 Btn", type: "button", content: "Start Free", variant: "outline", position: { x: 110, y: 490 }, size: { width: 230, height: 42 }, zIndex: 6, styles: { borderColor: "#27272a", borderRadius: "6px" } },
      { id: "pro-p-c2", name: "Tier 2 Pro", type: "card", position: { x: 405, y: 130 }, size: { width: 290, height: 460 }, zIndex: 7, styles: { backgroundColor: "#18181b", borderRadius: "12px", borderStyle: "solid", borderWidth: "2px", borderColor: "#fafafa" } },
      { id: "pro-p-c2-badge", name: "Most Popular", type: "badge", content: "RECOMMENDED", position: { x: 435, y: 155 }, size: { width: 120, height: 22 }, zIndex: 8, styles: { backgroundColor: "#fafafa", color: "#09090b", fontSize: "10px", fontWeight: "700" } },
      { id: "pro-p-c2-t", name: "Tier 2 Name", type: "text", content: "Pro Studio", position: { x: 435, y: 190 }, size: { width: 150, height: 24 }, zIndex: 9, styles: { color: "#fafafa", fontSize: "18px", fontWeight: "600" } },
      { id: "pro-p-c2-p", name: "Tier 2 Price", type: "text", content: "$49 / seat", position: { x: 435, y: 220 }, size: { width: 200, height: 32 }, zIndex: 10, styles: { color: "#fafafa", fontSize: "28px", fontWeight: "700" } },
      { id: "pro-p-c2-b", name: "Tier 2 Btn", type: "button", content: "Upgrade to Pro", position: { x: 435, y: 510 }, size: { width: 230, height: 44 }, zIndex: 11, styles: { backgroundColor: "#fafafa", color: "#09090b", fontWeight: "700", borderRadius: "6px" } },
      { id: "pro-p-c3", name: "Tier 3 Org", type: "card", position: { x: 730, y: 140 }, size: { width: 290, height: 440 }, zIndex: 12, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pro-p-c3-t", name: "Tier 3 Name", type: "text", content: "Enterprise", position: { x: 760, y: 170 }, size: { width: 150, height: 24 }, zIndex: 13, styles: { color: "#fafafa", fontSize: "18px", fontWeight: "600" } },
      { id: "pro-p-c3-p", name: "Tier 3 Price", type: "text", content: "Custom SLA", position: { x: 760, y: 205 }, size: { width: 200, height: 32 }, zIndex: 14, styles: { color: "#fafafa", fontSize: "24px", fontWeight: "700" } },
      { id: "pro-p-c3-b", name: "Tier 3 Btn", type: "button", content: "Contact Sales", variant: "outline", position: { x: 760, y: 490 }, size: { width: 230, height: 42 }, zIndex: 15, styles: { borderColor: "#27272a", borderRadius: "6px" } }
    ]
  }

];
