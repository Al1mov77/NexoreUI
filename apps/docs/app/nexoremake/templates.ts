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
  {
    id: "template-hero",
    name: "Hero Section",
    description: "A stunning hero section with a primary CTA",
    category: "Sections",
    canvasSettings: { width: 1200, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      {
        id: "hero-title",
        name: "Hero Title",
        type: "text",
        content: "Build Faster with NexoreUI",
        position: { x: 300, y: 150 },
        size: { width: 600, height: 80 },
        zIndex: 1,
        styles: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#fff" }
      },
      {
        id: "hero-subtitle",
        name: "Hero Subtitle",
        type: "text",
        content: "The ultimate component library for modern web applications.",
        position: { x: 350, y: 240 },
        size: { width: 500, height: 40 },
        zIndex: 2,
        styles: { fontSize: "18px", textAlign: "center", color: "#a1a1aa" }
      },
      {
        id: "hero-button",
        name: "Get Started Button",
        type: "button",
        content: "Get Started",
        variant: "default",
        sizeVariant: "lg",
        position: { x: 500, y: 320 },
        size: { width: 200, height: 50 },
        zIndex: 3,
        styles: { backgroundColor: "#7c3aed", color: "#fff", borderRadius: "8px", fontWeight: "bold" }
      }
    ]
  },
  {
    id: "template-login",
    name: "Login Form",
    description: "A clean, modern login form",
    category: "Forms",
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      {
        id: "login-card",
        name: "Login Card",
        type: "card",
        position: { x: 200, y: 100 },
        size: { width: 400, height: 400 },
        zIndex: 1,
        styles: { backgroundColor: "#09090b", borderRadius: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a", paddingTop: "24px", paddingRight: "24px", paddingBottom: "24px", paddingLeft: "24px" }
      },
      {
        id: "login-title",
        name: "Login Title",
        type: "text",
        content: "Welcome back",
        position: { x: 230, y: 140 },
        size: { width: 340, height: 40 },
        zIndex: 2,
        styles: { fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "#fff" }
      },
      {
        id: "login-input-email",
        name: "Email Input",
        type: "input",
        placeholder: "Email Address",
        position: { x: 240, y: 220 },
        size: { width: 320, height: 40 },
        zIndex: 3,
        styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" }
      },
      {
        id: "login-input-pwd",
        name: "Password Input",
        type: "input",
        placeholder: "Password",
        position: { x: 240, y: 280 },
        size: { width: 320, height: 40 },
        zIndex: 4,
        styles: { backgroundColor: "#18181b", color: "#fff", borderRadius: "6px" }
      },
      {
        id: "login-btn",
        name: "Login Button",
        type: "button",
        content: "Sign In",
        position: { x: 240, y: 360 },
        size: { width: 320, height: 40 },
        zIndex: 5,
        styles: { backgroundColor: "#7c3aed", color: "#fff", borderRadius: "6px" }
      }
    ]
  },
  {
    id: "template-profile",
    name: "User Profile Card",
    description: "Compact user info card",
    category: "Cards",
    canvasSettings: { width: 800, height: 600, backgroundColor: "transparent", gridVisible: true, zoom: 1 },
    elements: [
      {
        id: "prof-card",
        name: "Profile Card",
        type: "card",
        position: { x: 250, y: 150 },
        size: { width: 300, height: 300 },
        zIndex: 1,
        styles: { backgroundColor: "#09090b", borderRadius: "16px", borderStyle: "solid", borderWidth: "1px", borderColor: "#27272a" }
      },
      {
        id: "prof-avatar",
        name: "Profile Avatar",
        type: "avatar",
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        position: { x: 360, y: 180 },
        size: { width: 80, height: 80 },
        zIndex: 2,
        styles: {}
      },
      {
        id: "prof-name",
        name: "Profile Name",
        type: "text",
        content: "Sarah Connor",
        position: { x: 250, y: 280 },
        size: { width: 300, height: 30 },
        zIndex: 3,
        styles: { fontSize: "20px", fontWeight: "bold", textAlign: "center", color: "#fff" }
      },
      {
        id: "prof-role",
        name: "Role Badge",
        type: "badge",
        content: "Pro Member",
        variant: "default",
        position: { x: 350, y: 320 },
        size: { width: 100, height: 24 },
        zIndex: 4,
        styles: { backgroundColor: "rgba(124,58,237,0.2)", color: "#c4b5fd", borderStyle: "solid", borderWidth: "1px", borderColor: "rgba(124,58,237,0.4)" }
      },
      {
        id: "prof-btn",
        name: "Message Button",
        type: "button",
        content: "Message",
        position: { x: 300, y: 370 },
        size: { width: 200, height: 36 },
        zIndex: 5,
        styles: { backgroundColor: "#27272a", color: "#fff", borderRadius: "6px" }
      }
    ]
  }
];
