# Rewriting an existing template

The user will do this template by template. The old code probably contains slop. Do not polish it. Replace it.

## Step 1. Inventory (read the old file once)

Record:
- Props and `useTemplateCustomizer` fields used (keep this contract).
- Media paths (`/videos/...`, `/images/...`, frames) and whether they exist in `apps/docs/public`.
- True product facts: name, real specs, prices, copy that describes real behaviour. If a number looks invented, drop it.
- Registered names: the component name, the registry const, the export file name.

Everything else gets deleted: layout, copy, effects, colors.

## Step 2. Slop scan (PowerShell; `rg` is not installed)

```powershell
Select-String -Path <file> -Pattern "animate-ping|animate-pulse|blur-\[|blur-3xl|from-purple|to-pink|via-indigo|bg-gradient|rounded-full.*uppercase|tracking-\[0\.[2-9]|text-\[1?0px\]|·|HUD|telemetry|SERIAL|BATCH|limited|only \d+ left" 
node scripts/audit-template.js <file>
```

Use the audit result as evidence of what was wrong, mention it in the brief's "Deleted from the old version".

## Step 3. Replace, do not restyle

- Do not keep any section just because it exists.
- Do not keep floating shapes, particles or canvases without real content.
- Do not keep a sticky exploded 3D scene unless the product has layers.
- Do not keep decorative stat rows (three counters) unless each number is a real product fact that matters.
- If media is a good video or frames, keep it and give it new treatment (clip, scrub, type mask).

## Step 4. New identity

Follow template-studio Phase 2. The new identity must also differ from the OLD version of this template in at least 4 axes. A rewrite that looks like the old one is a failed rewrite.

## Step 5. Build from a blank file

Overwrite the preview file entirely. Keep the default export name and prop contract. Keep `"use client"` if present.

## Step 6. Export and ledger

`qa-and-export.md`. Update the ledger row to `done` with what was actually built.

## Quick quality questions

- Would a designer put this page in a portfolio?
- If I replace the product name, does the page still feel like this brand? (If yes, the identity is generic.)
- Does it look like any other NexoreUI template?
