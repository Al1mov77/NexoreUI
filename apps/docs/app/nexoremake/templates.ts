import { NexoreMakeElement, CanvasSettings } from './types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  elements: NexoreMakeElement[];
  canvasSettings: CanvasSettings;
}

export const nexoreTemplates: Template[] = [
  // --- EXISTING ---
  {
    id: "template-hero",
    name: "Hero Section",
    description: "A stunning hero section with a primary CTA",
    category: "Landing",
    canvasSettings: { width: 1200, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "hero-title", name: "Hero Title", type: "text", content: "Build Faster with NexoreUI", position: { x: 300, y: 150 }, size: { width: 600, height: 80 }, zIndex: 1, styles: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#fff" } },
      { id: "hero-subtitle", name: "Hero Subtitle", type: "text", content: "The ultimate component library for modern web applications.", position: { x: 350, y: 240 }, size: { width: 500, height: 40 }, zIndex: 2, styles: { fontSize: "18px", textAlign: "center", color: "#a1a1aa" } },
      { id: "hero-button", name: "Get Started Button", type: "button", content: "Get Started", variant: "default", sizeVariant: "lg", position: { x: 500, y: 320 }, size: { width: 200, height: 50 }, zIndex: 3, styles: { backgroundColor: "#7c3aed", color: "#fff", borderRadius: "8px", fontWeight: "bold" } }
    ]
  },
  {
    id: "template-login",
    name: "Login Form",
    description: "A clean, modern login form",
    category: "Forms",
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "login-card", name: "Login Card", type: "card", position: { x: 200, y: 100 }, size: { width: 400, height: 400 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "login-title", name: "Login Title", type: "text", content: "Welcome back", position: { x: 230, y: 140 }, size: { width: 340, height: 40 }, zIndex: 2, styles: { fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "#fff" } },
      { id: "login-input-email", name: "Email Input", type: "input", placeholder: "Email Address", position: { x: 240, y: 220 }, size: { width: 320, height: 40 }, zIndex: 3, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "login-input-pwd", name: "Password Input", type: "input", placeholder: "Password", position: { x: 240, y: 280 }, size: { width: 320, height: 40 }, zIndex: 4, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "login-btn", name: "Login Button", type: "button", content: "Sign In", position: { x: 240, y: 360 }, size: { width: 320, height: 40 }, zIndex: 5, styles: { backgroundColor: "#7c3aed", color: "#fff", borderRadius: "6px" } }
    ]
  },
  
  // --- DASHBOARDS ---
  {
    id: "template-stat-card",
    name: "Stat Card",
    description: "Analytics metric card with sparkline",
    category: "Dashboard",
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
    canvasSettings: { width: 600, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pc-bg", name: "Card Bg", type: "card", position: { x: 150, y: 50 }, size: { width: 300, height: 450 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "pc-img", name: "Image", type: "image", src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", position: { x: 150, y: 50 }, size: { width: 300, height: 250 }, zIndex: 2, styles: { borderTopLeftRadius: "16px", borderTopRightRadius: "16px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px" } },
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
    canvasSettings: { width: 600, height: 800, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "pr-bg", name: "Bg", type: "card", position: { x: 150, y: 100 }, size: { width: 300, height: 500 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "24px", borderStyle: "solid", borderWidth: "2px", borderColor: "#7c3aed" } },
      { id: "pr-badge", name: "Badge", type: "badge", content: "MOST POPULAR", position: { x: 230, y: 85 }, size: { width: 140, height: 30 }, zIndex: 2, styles: { backgroundColor: "#7c3aed", color: "#fff", borderRadius: "100px", fontWeight: "bold" } },
      { id: "pr-title", name: "Title", type: "text", content: "Pro Plan", position: { x: 180, y: 140 }, size: { width: 240, height: 30 }, zIndex: 3, styles: { color: "#fff", fontSize: "24px", fontWeight: "bold", textAlign: "center" } },
      { id: "pr-price", name: "Price", type: "text", content: "$29/mo", position: { x: 180, y: 180 }, size: { width: 240, height: 40 }, zIndex: 4, styles: { color: "#fff", fontSize: "36px", fontWeight: "bold", textAlign: "center" } },
      { id: "pr-div", name: "Divider", type: "divider", position: { x: 180, y: 240 }, size: { width: 240, height: 1 }, zIndex: 5, styles: { backgroundColor: "#27272a" } },
      { id: "pr-f1", name: "Feature", type: "text", content: "✓ Unlimited Projects", position: { x: 190, y: 270 }, size: { width: 200, height: 25 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "pr-f2", name: "Feature", type: "text", content: "✓ 24/7 Support", position: { x: 190, y: 310 }, size: { width: 200, height: 25 }, zIndex: 7, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "pr-f3", name: "Feature", type: "text", content: "✓ Advanced Analytics", position: { x: 190, y: 350 }, size: { width: 200, height: 25 }, zIndex: 8, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "pr-btn", name: "Button", type: "button", content: "Upgrade Now", position: { x: 180, y: 520 }, size: { width: 240, height: 45 }, zIndex: 9, styles: { backgroundColor: "#7c3aed", color: "#fff", borderRadius: "8px", fontWeight: "bold" } }
    ]
  },
  
  // --- LANDING PAGES ---
  {
    id: "template-feature-split",
    name: "Feature Split",
    description: "Text on left, Image on right",
    category: "Landing",
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
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "t-bg", name: "Bg", type: "card", position: { x: 100, y: 100 }, size: { width: 400, height: 200 }, zIndex: 1, styles: { backgroundColor: "#18181b", borderRadius: "16px", paddingLeft: "24px", paddingTop: "24px" } },
      { id: "t-stars", name: "Stars", type: "text", content: "★★★★★", position: { x: 124, y: 124 }, size: { width: 100, height: 24 }, zIndex: 2, styles: { color: "#eab308", fontSize: "18px" } },
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
    canvasSettings: { width: 800, height: 800, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "su-bg", name: "Bg", type: "card", position: { x: 200, y: 50 }, size: { width: 400, height: 650 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "su-t", name: "Title", type: "text", content: "Create an account", position: { x: 230, y: 90 }, size: { width: 340, height: 40 }, zIndex: 2, styles: { fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "#fff" } },
      { id: "su-d", name: "Desc", type: "text", content: "Enter your details to get started.", position: { x: 230, y: 130 }, size: { width: 340, height: 20 }, zIndex: 3, styles: { fontSize: "14px", textAlign: "center", color: "#a1a1aa" } },
      { id: "su-n-l", name: "Name Lbl", type: "text", content: "Full Name", position: { x: 240, y: 180 }, size: { width: 100, height: 20 }, zIndex: 4, styles: { fontSize: "12px", color: "#fff", fontWeight: "bold" } },
      { id: "su-n-i", name: "Name Inp", type: "input", placeholder: "John Doe", position: { x: 240, y: 205 }, size: { width: 320, height: 40 }, zIndex: 5, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
      { id: "su-e-l", name: "Email Lbl", type: "text", content: "Email", position: { x: 240, y: 265 }, size: { width: 100, height: 20 }, zIndex: 6, styles: { fontSize: "12px", color: "#fff", fontWeight: "bold" } },
      { id: "su-e-i", name: "Email Inp", type: "input", placeholder: "john@example.com", position: { x: 240, y: 290 }, size: { width: 320, height: 40 }, zIndex: 7, styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" } },
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
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "c-av", name: "Avatar", type: "avatar", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100", position: { x: 100, y: 150 }, size: { width: 40, height: 40 }, zIndex: 1, styles: {} },
      { id: "c-bub1", name: "Bubble 1", type: "card", position: { x: 150, y: 130 }, size: { width: 220, height: 60 }, zIndex: 2, styles: { backgroundColor: "#27272a", borderRadius: "18px", borderTopLeftRadius: "4px", paddingTop: "12px", paddingRight: "12px", paddingBottom: "12px", paddingLeft: "12px" } },
      { id: "c-txt1", name: "Text", type: "text", content: "Hey! Are we still on for today?", position: { x: 160, y: 145 }, size: { width: 200, height: 30 }, zIndex: 3, styles: { color: "#fff", fontSize: "14px" } },
      { id: "c-bub2", name: "Bubble 2", type: "card", position: { x: 300, y: 200 }, size: { width: 180, height: 60 }, zIndex: 4, styles: { backgroundColor: "#3b82f6", borderRadius: "18px", borderBottomRightRadius: "4px", paddingTop: "12px", paddingRight: "12px", paddingBottom: "12px", paddingLeft: "12px" } },
      { id: "c-txt2", name: "Text", type: "text", content: "Yes, see you at 5!", position: { x: 310, y: 215 }, size: { width: 160, height: 30 }, zIndex: 5, styles: { color: "#fff", fontSize: "14px" } },
      { id: "c-time", name: "Time", type: "text", content: "Delivered", position: { x: 420, y: 270 }, size: { width: 60, height: 20 }, zIndex: 6, styles: { color: "#a1a1aa", fontSize: "11px", textAlign: "right" } }
    ]
  },
  {
    id: "template-feed-post",
    name: "Social Feed Post",
    description: "Instagram-style card",
    category: "Social",
    canvasSettings: { width: 600, height: 800, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "f-bg", name: "Card", type: "card", position: { x: 100, y: 50 }, size: { width: 400, height: 550 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "f-av", name: "Avatar", type: "avatar", src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100", position: { x: 120, y: 70 }, size: { width: 40, height: 40 }, zIndex: 2, styles: {} },
      { id: "f-un", name: "Username", type: "text", content: "alice_wonder", position: { x: 170, y: 70 }, size: { width: 150, height: 20 }, zIndex: 3, styles: { color: "#fff", fontWeight: "bold", fontSize: "14px" } },
      { id: "f-loc", name: "Location", type: "text", content: "San Francisco, CA", position: { x: 170, y: 90 }, size: { width: 150, height: 20 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "f-img", name: "Post Image", type: "image", src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600", position: { x: 100, y: 130 }, size: { width: 400, height: 350 }, zIndex: 5, styles: {} },
      { id: "f-act", name: "Actions", type: "text", content: "❤️ 💬 🚀", position: { x: 120, y: 495 }, size: { width: 100, height: 30 }, zIndex: 6, styles: { fontSize: "20px" } },
      { id: "f-lk", name: "Likes", type: "text", content: "1,245 likes", position: { x: 120, y: 530 }, size: { width: 100, height: 20 }, zIndex: 7, styles: { color: "#fff", fontWeight: "bold", fontSize: "14px" } },
      { id: "f-cap", name: "Caption", type: "text", content: "Beautiful day out here!", position: { x: 120, y: 555 }, size: { width: 300, height: 20 }, zIndex: 8, styles: { color: "#fff", fontSize: "14px" } }
    ]
  },
  
  // --- UI COMPONENTS ---
  {
    id: "template-modal",
    name: "Modal Dialog",
    description: "Confirmation popup",
    category: "Cards",
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "m-overlay", name: "Overlay", type: "card", position: { x: 0, y: 0 }, size: { width: 800, height: 600 }, zIndex: 1, styles: { backgroundColor: "rgba(0,0,0,0.6)", backdropBlur: "4" } },
      { id: "m-card", name: "Dialog", type: "card", position: { x: 200, y: 200 }, size: { width: 400, height: 200 }, zIndex: 2, styles: { backgroundColor: "#18181b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "m-icon", name: "Icon", type: "text", content: "⚠️", position: { x: 220, y: 220 }, size: { width: 30, height: 30 }, zIndex: 3, styles: { fontSize: "24px" } },
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
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "mp-bg", name: "Bg", type: "card", position: { x: 150, y: 100 }, size: { width: 300, height: 140 }, zIndex: 1, styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" } },
      { id: "mp-cv", name: "Cover", type: "image", src: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200", position: { x: 170, y: 120 }, size: { width: 60, height: 60 }, zIndex: 2, styles: { borderRadius: "8px" } },
      { id: "mp-t", name: "Title", type: "text", content: "Midnight City", position: { x: 245, y: 125 }, size: { width: 180, height: 20 }, zIndex: 3, styles: { color: "#fff", fontSize: "16px", fontWeight: "bold" } },
      { id: "mp-a", name: "Artist", type: "text", content: "M83", position: { x: 245, y: 145 }, size: { width: 180, height: 20 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "14px" } },
      { id: "mp-pbg", name: "Prog Bg", type: "card", position: { x: 170, y: 200 }, size: { width: 260, height: 4 }, zIndex: 5, styles: { backgroundColor: "#27272a", borderRadius: "2px" } },
      { id: "mp-pfl", name: "Prog Fill", type: "card", position: { x: 170, y: 200 }, size: { width: 120, height: 4 }, zIndex: 6, styles: { backgroundColor: "#fff", borderRadius: "2px" } },
      { id: "mp-ctrl", name: "Controls", type: "text", content: "⏮️  ▶️  ⏭️", position: { x: 170, y: 215 }, size: { width: 260, height: 20 }, zIndex: 7, styles: { color: "#fff", fontSize: "18px", textAlign: "center" } }
    ]
  },
  {
    id: "template-weather",
    name: "Weather Widget",
    description: "Glassmorphic weather card",
    category: "Cards",
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "ww-bg", name: "Glass Card", type: "card", position: { x: 180, y: 80 }, size: { width: 240, height: 240 }, zIndex: 1, styles: { backgroundColor: "rgba(255,255,255,0.1)", backdropBlur: "16", borderRadius: "24px", borderStyle: "solid", borderWidth: "1px", borderColor: "rgba(255,255,255,0.2)" } },
      { id: "ww-loc", name: "Location", type: "text", content: "Cupertino", position: { x: 180, y: 100 }, size: { width: 240, height: 30 }, zIndex: 2, styles: { color: "#fff", fontSize: "20px", textAlign: "center" } },
      { id: "ww-ic", name: "Icon", type: "text", content: "☀️", position: { x: 180, y: 130 }, size: { width: 240, height: 60 }, zIndex: 3, styles: { fontSize: "64px", textAlign: "center" } },
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
    canvasSettings: { width: 600, height: 400, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      { id: "n-bg", name: "Bg", type: "card", position: { x: 150, y: 160 }, size: { width: 300, height: 60 }, zIndex: 1, styles: { backgroundColor: "#18181b", borderRadius: "8px", borderStyle: "solid", borderWidth: "1px", borderColor: "#22c55e" } },
      { id: "n-ic", name: "Icon", type: "text", content: "✓", position: { x: 160, y: 175 }, size: { width: 24, height: 24 }, zIndex: 2, styles: { color: "#22c55e", fontSize: "18px", fontWeight: "bold", textAlign: "center", backgroundColor: "rgba(34,197,94,0.2)", borderRadius: "12px" } },
      { id: "n-t", name: "Title", type: "text", content: "Successfully saved!", position: { x: 195, y: 170 }, size: { width: 200, height: 20 }, zIndex: 3, styles: { color: "#fff", fontSize: "14px", fontWeight: "bold" } },
      { id: "n-d", name: "Desc", type: "text", content: "Your changes have been deployed.", position: { x: 195, y: 188 }, size: { width: 200, height: 20 }, zIndex: 4, styles: { color: "#a1a1aa", fontSize: "12px" } },
      { id: "n-x", name: "Close", type: "text", content: "✕", position: { x: 420, y: 180 }, size: { width: 20, height: 20 }, zIndex: 5, styles: { color: "#a1a1aa", fontSize: "12px", textAlign: "center" } }
    ]
  }
];
