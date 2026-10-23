---
name: template-code-export-integrity
description: Strict protocol and engineering standards for code export integrity in NexoreUI. Mandates that every template export (Export Code modal, CLI registry, code snippets) contains 100% full, non-truncated, standalone production code that exactly matches the live preview.
---

# Template Code Export Integrity Skill

Every template in NexoreUI offers an **`</> Export Code`** button and a CLI command (`npx nexoreui add <template-name>`). When a user exports or installs a template, the code must be **complete, clean, standalone, and identical to the preview**. Never truncated, never summarized, and never out of sync.

---

## 1. The Core Law of Code Export

> [!IMPORTANT]
> **No Truncation. No Placeholders. Exact 1:1 Parity.**
> Never emit code with `// ... rest of component`, `/* styles here */`, or missing subcomponents. The exported code must be ready to paste into a brand-new Next.js application and run without adding missing helper files or guessing missing JSX.

---

## 2. The 3 Synchronization Points

Whenever a template is created, updated, or refactored, all **three locations** must be synchronized simultaneously:

```
┌────────────────────────────────────────────────────────┐
│ 1. Live Preview Component                              │
│    apps/docs/app/components/templates/previews/       │
│    └── <Name>Preview.tsx                               │
└──────────────────────────┬─────────────────────────────┘
                           │ 1:1 Mirror
┌──────────────────────────▼─────────────────────────────┐
│ 2. CLI Registry File (Export Source)                   │
│    packages/cli/src/registry/                          │
│    └── template-<name>-pro.ts                          │
│    └── content: "\"use client\";\n\nimport ..."        │
└──────────────────────────┬─────────────────────────────┘
                           │ Referenced by
┌──────────────────────────▼─────────────────────────────┐
│ 3. Template Metadata & Code Snippet                    │
│    apps/docs/app/data/templates.ts                     │
│    └── codeSnippet: <name>Code                         │
│    └── features: [ updated non-slop list ]             │
└────────────────────────────────────────────────────────┘
```

If you edit `<Name>Preview.tsx`, you **must** update `template-<name>-pro.ts` and `templates.ts` in the same turn. Leaving the export on an older version or leaving slop in the export violates this skill.

---

## 3. Standalone Template Requirements

The live preview file uses docs-internal contexts (like `useTemplateCustomizer()`). The **exported code** must be completely **standalone**:

### Standalone Props Interface
Replace `useTemplateCustomizer()` with direct component props and sensible defaults:

```tsx
// ❌ WRONG in exported code (depends on docs context):
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
export function AmarenaRoyalePreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  ...

// ✅ CORRECT in exported code (self-contained, drops anywhere):
export default function AmarenaRoyaleTemplate({
  brandName = "AMARENA ROYALE",
  theme = "dark",
  deviceMode = "desktop",
}: {
  brandName?: string;
  theme?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}) {
  const isDark = theme === "dark";
  ...
```

### Self-Contained Subcomponents
Every helper used by the template must be included in full in the exported file:
- `SPRING`, `TILT`, and motion constants
- `findScroller()` and `useScrollProgress()` helpers
- `SplitWords` masked reveal
- `Counter` count-up number with `useReducedMotion`
- `MagneticButton` and `TiltCard`
- The signature wow scene component
- The detail texture inspector
- All TypeScript types and interfaces

Only standard public npm dependencies are allowed:
`"framer-motion"`, `"lucide-react"`, `"clsx"`, `"tailwind-merge"`.

---

## 4. How to Generate Clean Export Code

To avoid escaping errors with template literals or nested backticks, format `content` in the registry file using `JSON.stringify`:

```ts
// packages/cli/src/registry/template-amarena-royale-pro.ts
export const templateAmarenaRoyalePro = {
  name: "template-amarena-royale-pro",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-amarena-royale-pro.tsx",
  content: JSON.stringify(fullCleanCodeString),
};
```

This guarantees:
1. No unescaped `${...}` expressions breaking the registry bundle.
2. No syntax errors during CLI bundling (`pnpm --filter nexoreui-cli build`).
3. Complete preserved newlines and indentation in the `</> Export Code` modal.

---

## 5. Verification Checklist

Before reporting completion on any template task:

1. [ ] **Preview matches export:** Does `packages/cli/src/registry/template-<name>-pro.ts` contain the new wow moment and new features?
2. [ ] **No truncated code:** Does the exported code end with the closing brace of the default export function? (`\n  );\n}\n`)
3. [ ] **No docs context imports:** Did you remove `useTemplateCustomizer` from the export file?
4. [ ] **CLI build passes:** Did you run `pnpm --filter nexoreui-cli build` to verify `tsup` succeeds?
5. [ ] **Metadata synced:** Does `apps/docs/app/data/templates.ts` accurately describe the real features and point to the updated snippet?
