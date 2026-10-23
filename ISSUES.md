# Issue Reporting & Technical Guidelines

This document outlines how to file bug reports, submit feature inquiries, and resolve common integration questions in NexoreUI.

---

## Filing a Bug Report

Before opening a new issue, please verify:
1. You are running the latest version of `nexoreui` or `nexoreui-cli` (v2.0.0+).
2. The issue has not already been reported in existing closed or open issues.

### Required Information for Bug Reports
- **Description:** A concise explanation of the bug.
- **Reproduction Steps:** Step-by-step instructions to reproduce the behavior from a clean setup.
- **Expected vs Actual Behavior:** What you expected to happen versus what occurred.
- **Environment Details:**
  - Operating System (Windows, macOS, Linux)
  - Node.js version (`node -v`)
  - Package manager and version (`pnpm -v` / `npm -v` / `yarn -v`)
  - Framework (Next.js 15, Vite, Remix, etc.)
  - Tailwind CSS version (v3 or v4)
- **Minimal Reproduction:** A code snippet or a link to a minimal reproduction repository.

---

## Feature Requests & Component Inquiries

We welcome suggestions that align with NexoreUI's design language:
- Clean, disciplined typography and spatial proportions.
- Strict token-driven palettes (zinc neutrals, single accent).
- Full keyboard and screen-reader accessibility.
- Purposeful motion with native `prefers-reduced-motion` compliance.

*Note: Requests for decorative AI-slop (rainbow gradients, glowing neon buttons, pulsing status dots, and floating 3D particle toys) are out of scope and will be closed.*

---

## Common Technical Inquiries

### 1. Tailwind CSS v4 Theme Variables
NexoreUI uses CSS variables for theming. If colors or border radiuses do not render properly in Tailwind CSS v4, ensure your `globals.css` imports the base tokens:
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --border: 240 5.9% 90%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --radius: 0.625rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --border: 240 3.7% 15.9%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
  }
}
```

### 2. Next.js 15 Client Boundaries
Components utilizing Framer Motion or React hooks must be imported within client components (`"use client"`). When wrapping pages that consume URL search parameters, always use `<Suspense>` boundaries to allow static prerendering.

### 3. Pro License & Machine Activations
- **Authentication:** Run `npx nexoreui auth <your-license-key>`.
- **Status Check:** Run `npx nexoreui auth --status`.
- **Device Limits:** Each Pro license supports up to 3 active developer machines. If you upgrade your machine or switch computers, reset your active device slots via the workspace console at `https://www.nexoreui.site/workspace`.

---

## Support & Direct Contact

For licensing inquiries, corporate access, or urgent questions:
- Email: `nexoreuiteam@mail.ru`
- Website: `https://www.nexoreui.site`
