# QA and export

## 1. Audit

```powershell
node scripts/audit-template.js apps/docs/app/components/templates/previews/<Name>Preview.tsx
```

Exit code 1 means ERRORs. Fix every one. Warnings: fix, or justify in the report (for example `canvas-ok:` comment for a scrub canvas that carries real content).

The audit catches: emoji, glyph bullets, ping/pulse, blur blobs, purple/pink gradients, gradient buttons, banned marketing words, fake scarcity/serials, Aerovoid fingerprints, missing font loading, missing `useReducedMotion`, missing responsive handling. It does not judge taste: the squint test and the pre-delivery list in `anti-slop.md` still apply.

## 2. Verify fonts

```powershell
Invoke-WebRequest "https://fonts.googleapis.com/css2?family=...&display=swap" -UseBasicParsing | Select-Object StatusCode
```

Must be 200 for every family string you use.

## 3. Typecheck

```powershell
npx tsc --noEmit --project apps/docs/tsconfig.json
```

One known unrelated error exists in `ThemeCustomizerContext.tsx(206,58)`. Nothing else may reference your files.

## 4. Export sync (registry code equals preview)

The registry export must be the full, non-truncated, standalone code of the preview. Never hand-edit it. Generate it:

```powershell
node scripts/sync-template-export.js `
  --preview apps/docs/app/components/templates/previews/<Name>Preview.tsx `
  --registry packages/cli/src/registry/template-<id>-pro.ts `
  --const template<Name>Pro --name template-<id>-pro `
  --component <Name>Template --brand "<BRAND>" --check
```

The script strips the customizer import, builds standalone props, writes the registry file, and with `--check` type-checks the generated standalone component. If it fails on a local relative import or a customizer field it does not support, change the preview (inline the helper, avoid the unsupported field) rather than editing the export. Re-run until "Export type-check passed".

If the template has no registry file yet, also wire it like the others: `apps/docs/app/data/pro-template-snippets.ts`, `apps/docs/app/data/templates.ts`, `apps/docs/app/templates/TemplatesPageClient.tsx`, `apps/docs/app/components/templates/TemplatePreviews.tsx`. Copy the pattern of an existing wiring, not the existing design.

## 5. Ledger and brief

- `.agents/briefs/<id>.md` completed.
- `.agents/rules/identity-ledger.md` row set to `done`, updated to the real values.

## 6. Browser verification

If you can run the docs app and a browser, check 375/768/1280 and the device switcher. If you cannot, write "Not verified in a browser" in the report. Never claim otherwise.

## 7. Report (max 8 lines)

Identity, signature moment, collision check, audit result, export check result, ledger updated, not verified list.
